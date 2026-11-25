"""YouTube read-only analytics for Uq.cerita (Data API v3 + Analytics API v2).

Commands (run from the repo root):
  python scripts/analytics/youtube_api.py auth                  # browser login (Desktop OAuth, PKCE, loopback)
  python scripts/analytics/youtube_api.py whoami                # show the channel behind the token
  python scripts/analytics/youtube_api.py confirm-channel UC... # owner-confirmed channel ID (required before fetch)
  python scripts/analytics/youtube_api.py fetch --content-id 2026-11-002 [--dry-run]

Files:
  %USERPROFILE%\\.uq-story-analytics\\google_oauth_client.json  (owner downloads; Desktop app client)
  %USERPROFILE%\\.uq-story-analytics\\youtube_token.json        (written by `auth`; never printed)
  05-DATA/analytics/youtube_channel.json   confirmed channel (public IDs only)
  05-DATA/analytics/api_snapshots.csv      long-format snapshot store (all metrics, all periods)
  05-DATA/analytics/<content-id>/api/      raw API responses (no tokens)
  05-DATA/analytics/api_runs.jsonl         execution log (no secrets)
  05-DATA/metrics.csv                      one row per new lifetime-counter snapshot (schema unchanged)

Scopes: youtube.readonly, yt-analytics.readonly, youtube.force-ssl (comments; only GET calls are made).
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import http.server
import json
import re
import secrets
import socket
import sys
import time
import urllib.parse
import webbrowser
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import (  # noqa: E402
    ANALYTICS_DIR, SECRETS_DIR, ApiError, append_metrics_csv, append_rows, existing_keys,
    fmt_utc, fmt_wib, http_json, log_run, metrics_csv_rows, now_utc, parse_utc,
    read_published_urls, snapshot_key, write_secret_json,
)

SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    # commentThreads.list returned 403 with readonly only. force-ssl also permits writes;
    # this code only issues GET requests. Added 2026-11-20.
    "https://www.googleapis.com/auth/youtube.force-ssl",
]
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
DATA_API = "https://www.googleapis.com/youtube/v3"
ANALYTICS_API = "https://youtubeanalytics.googleapis.com/v2/reports"

CLIENT_FILE = SECRETS_DIR / "google_oauth_client.json"
TOKEN_FILE = SECRETS_DIR / "youtube_token.json"
CONFIRMED = ANALYTICS_DIR / "youtube_channel.json"

ANALYTICS_TZ = "tanggal laporan YouTube Analytics (zona waktu tidak disebut di dokumentasi API)"
UNITS = {
    "views": "count", "engagedViews": "count", "estimatedMinutesWatched": "minutes",
    "averageViewDuration": "seconds", "averageViewPercentage": "percent",
    "likes": "count", "comments": "count", "shares": "count",
    "subscribersGained": "count", "subscribersLost": "count",
    "audienceWatchRatio": "ratio", "relativeRetentionPerformance": "score_0_1",
    "viewCount": "count", "likeCount": "count", "commentCount": "count",
}
OPTIONAL_METRICS = {"engagedViews", "averageViewPercentage", "relativeRetentionPerformance"}


# ---------------------------------------------------------------- OAuth
def load_client() -> dict:
    if not CLIENT_FILE.exists():
        sys.exit(f"File OAuth client belum ada: {CLIENT_FILE}")
    data = json.loads(CLIENT_FILE.read_text(encoding="utf-8"))
    if "installed" not in data:
        sys.exit("JSON OAuth bukan tipe 'Desktop app' (kunci 'installed' tidak ada). Buat ulang client tipe Desktop.")
    return data["installed"]


def cmd_auth(_args) -> None:
    client = load_client()
    verifier = secrets.token_urlsafe(64)[:96]
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    state = secrets.token_urlsafe(24)
    result: dict = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):  # noqa: N802
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if "code" not in q and "error" not in q:
                self.send_response(404); self.end_headers(); return
            result.update({k: v[0] for k, v in q.items()})
            ok = "code" in q and q.get("state", [""])[0] == state
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            msg = "Login berhasil. Tutup tab ini dan kembali ke Claude Code." if ok else "Login gagal atau dibatalkan."
            self.wfile.write(f"<html><body style='font-family:sans-serif'><h2>{msg}</h2></body></html>".encode())

        def log_message(self, *a):  # keep the code out of any console log
            pass

    server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
    redirect = f"http://127.0.0.1:{server.server_port}"
    url = AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": client["client_id"], "redirect_uri": redirect, "response_type": "code",
        "scope": " ".join(SCOPES), "code_challenge": challenge, "code_challenge_method": "S256",
        "state": state, "access_type": "offline", "prompt": "consent",
    })
    print("Membuka browser untuk login Google. Bila tidak terbuka, salin URL ini ke browser:")
    print(url, flush=True)
    webbrowser.open(url)
    server.timeout = 5
    deadline = time.time() + 600
    while not result and time.time() < deadline:
        server.handle_request()
    server.server_close()
    if not result:
        sys.exit("Waktu habis (10 menit) tanpa login. Jalankan ulang `auth`.")
    if result.get("state") != state:
        sys.exit("State tidak cocok; login ditolak demi keamanan. Jalankan ulang `auth`.")
    if "error" in result:
        sys.exit(f"Login dibatalkan/ditolak: {result['error']}")

    form = {"grant_type": "authorization_code", "code": result["code"], "code_verifier": verifier,
            "redirect_uri": redirect, "client_id": client["client_id"]}
    if client.get("client_secret"):
        form["client_secret"] = client["client_secret"]
    try:
        tok = http_json("POST", TOKEN_URL, form=form)
    except ApiError as e:
        sys.exit(f"Penukaran kode gagal: {e}")
    granted = set(tok.get("scope", "").split())
    save_token(tok, client["client_id"])
    missing = [s for s in SCOPES if s not in granted]
    log_run({"at": fmt_utc(now_utc()), "platform": "youtube", "cmd": "auth", "status": "ok",
             "granted_scopes": sorted(granted), "missing_scopes": missing,
             "refresh_token_received": bool(tok.get("refresh_token"))})
    print(f"Token tersimpan (isi tidak ditampilkan): {TOKEN_FILE}")
    if missing:
        print(f"PERINGATAN: izin belum diberikan untuk {missing}. Jalankan ulang `auth` dan centang semua izin.")
    if not tok.get("refresh_token"):
        print("PERINGATAN: refresh token tidak diterima; token akan habis ±1 jam.")


def save_token(tok: dict, client_id: str, old: dict | None = None) -> dict:
    data = dict(old or {})
    data.update({
        "access_token": tok["access_token"],
        "expires_at": time.time() + int(tok.get("expires_in", 3600)),
        "scope": tok.get("scope", data.get("scope", "")),
        "token_type": tok.get("token_type", "Bearer"),
        "client_id": client_id,
        "updated_at": fmt_utc(now_utc()),
    })
    if tok.get("refresh_token"):
        data["refresh_token"] = tok["refresh_token"]
    write_secret_json(TOKEN_FILE, data)
    return data


def access_token() -> str:
    if not TOKEN_FILE.exists():
        sys.exit("Belum login. Jalankan: python scripts/analytics/youtube_api.py auth")
    data = json.loads(TOKEN_FILE.read_text(encoding="utf-8"))
    if data.get("expires_at", 0) > time.time() + 60:
        return data["access_token"]
    if not data.get("refresh_token"):
        sys.exit("Token habis dan tidak ada refresh token. Jalankan ulang `auth`.")
    client = load_client()
    form = {"grant_type": "refresh_token", "refresh_token": data["refresh_token"], "client_id": client["client_id"]}
    if client.get("client_secret"):
        form["client_secret"] = client["client_secret"]
    try:
        tok = http_json("POST", TOKEN_URL, form=form)
    except ApiError as e:
        sys.exit(f"Refresh token ditolak ({e.message}). Bila aplikasi Google berstatus 'Testing', "
                 "refresh token habis setelah 7 hari. Jalankan ulang `auth`.")
    return save_token(tok, client["client_id"], data)["access_token"]


def api_get(url: str, params: dict) -> dict:
    return http_json("GET", url, params=params, headers={"Authorization": f"Bearer {access_token()}"})


# ---------------------------------------------------------------- channel
def my_channel() -> dict:
    r = api_get(f"{DATA_API}/channels", {"part": "snippet,statistics", "mine": "true"})
    items = r.get("items", [])
    if not items:
        sys.exit("Akun Google ini tidak punya channel YouTube (atau channel Brand Account tidak dipilih saat login).")
    if len(items) > 1:
        sys.exit("Lebih dari satu channel dikembalikan; tidak diproses.")
    return items[0]


def cmd_whoami(_args) -> None:
    ch = my_channel()
    sn, st = ch["snippet"], ch.get("statistics", {})
    print(f"channel_id   : {ch['id']}")
    print(f"title        : {sn.get('title')}")
    print(f"custom_url   : {sn.get('customUrl', '(tidak ada)')}")
    print(f"created      : {sn.get('publishedAt')}")
    print(f"subscribers  : {'(disembunyikan)' if st.get('hiddenSubscriberCount') else st.get('subscriberCount')}")
    print(f"video_count  : {st.get('videoCount')}")
    confirmed = json.loads(CONFIRMED.read_text(encoding="utf-8")) if CONFIRMED.exists() else None
    print(f"confirmed    : {confirmed['channel_id'] if confirmed else '(belum dikonfirmasi pemilik)'}")
    log_run({"at": fmt_utc(now_utc()), "platform": "youtube", "cmd": "whoami", "status": "ok", "channel_id": ch["id"]})


def cmd_confirm(args) -> None:
    ch = my_channel()
    if ch["id"] != args.channel_id:
        sys.exit(f"Token milik channel {ch['id']}, bukan {args.channel_id}. Tidak dikonfirmasi.")
    CONFIRMED.write_text(json.dumps({
        "channel_id": ch["id"], "title": ch["snippet"].get("title"),
        "custom_url": ch["snippet"].get("customUrl"), "confirmed_at_utc": fmt_utc(now_utc()),
        "confirmed_by": "pemilik (via chat)",
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Channel dikonfirmasi: {ch['id']} ({ch['snippet'].get('title')})")


# ---------------------------------------------------------------- reports
def analytics(metrics: list[str], start: str, end: str, video: str, dims: str | None = None) -> tuple[dict, list[str], str]:
    """Run reports.query; on HTTP 400 drop optional metrics once. Returns (response, metrics_used, note)."""
    params = {"ids": "channel==MINE", "startDate": start, "endDate": end,
              "metrics": ",".join(metrics), "filters": f"video=={video}"}
    if dims:
        params["dimensions"] = dims
    try:
        return api_get(ANALYTICS_API, params), metrics, ""
    except ApiError as e:
        reduced = [m for m in metrics if m not in OPTIONAL_METRICS]
        if e.status != 400 or reduced == metrics or not reduced:
            raise
        params["metrics"] = ",".join(reduced)
        dropped = sorted(set(metrics) - set(reduced))
        return api_get(ANALYTICS_API, params), reduced, f"metrik {dropped} ditolak API ({e.message[:160]})"


def table(resp: dict) -> list[dict]:
    names = [h["name"] for h in resp.get("columnHeaders", [])]
    return [dict(zip(names, row)) for row in resp.get("rows", []) or []]


def cmd_fetch(args) -> None:
    if not CONFIRMED.exists():
        sys.exit("Channel belum dikonfirmasi pemilik. Jalankan `whoami`, lalu `confirm-channel <ID>`.")
    confirmed = json.loads(CONFIRMED.read_text(encoding="utf-8"))
    ch = my_channel()
    if ch["id"] != confirmed["channel_id"]:
        sys.exit(f"Token milik {ch['id']}, bukan channel terkonfirmasi {confirmed['channel_id']}. Berhenti.")
    account = {"account_id": ch["id"], "account_name": ch["snippet"].get("title", "")}

    if args.video_id:  # 2026-11-18: video ID given explicitly (found in the channel's upload list); published-urls untouched
        vid, url = args.video_id, f"https://www.youtube.com/shorts/{args.video_id}"
    else:
        urls = read_published_urls(args.content_id)
        ids = [m.group(1) for u in urls if (m := re.search(r"youtube\.com/(?:shorts/|watch\?v=)([A-Za-z0-9_-]{11})", u))]
        if len(ids) != 1:
            sys.exit(f"Butuh tepat satu URL YouTube di published-urls; ditemukan {len(ids)}.")
        vid, url = ids[0], next(u for u in urls if ids[0] in u)

    captured = now_utc()
    base = {"captured_at_utc": fmt_utc(captured), "captured_at_wib": fmt_wib(captured),
            "content_id": args.content_id, "platform": "youtube_shorts", "video_id": vid, **account}
    raw: dict = {}
    rows: list[dict] = []
    reports: list[tuple[str, list[dict]]] = []

    # A. Data API: public lifetime counters at capture time
    v = api_get(f"{DATA_API}/videos", {"part": "snippet,contentDetails,statistics,status", "id": vid})
    raw["videos.list"] = v
    if not v.get("items"):
        sys.exit("Video tidak ditemukan lewat Data API (privat/terhapus/ID salah).")
    item = v["items"][0]
    if item["snippet"]["channelId"] != ch["id"]:
        sys.exit("Video ini bukan milik channel terkonfirmasi. Berhenti.")
    published = parse_utc(item["snippet"]["publishedAt"])
    stats = item.get("statistics", {})
    a_rows = []
    for metric in ("viewCount", "likeCount", "commentCount"):
        val = stats.get(metric, "")
        a_rows.append({**base, "source": "youtube-data-api-v3:videos.list", "report": "video_public_counters",
                       "scope": "lifetime_counter", "period_start": fmt_utc(published), "period_end": fmt_utc(captured),
                       "period_timezone": "UTC (penghitung kumulatif saat pengambilan)", "metric": metric,
                       "value": val, "unit": UNITS[metric],
                       "note": "" if val != "" else "tidak dikembalikan API (mungkin disembunyikan/dinonaktifkan)"})
    reports.append(("video_public_counters", a_rows))

    # B. Analytics API: daily rows to learn which days are available
    start = (published - timedelta(days=1)).date().isoformat()  # report TZ undocumented; include the day before
    end = captured.astimezone(published.tzinfo).date().isoformat()
    core = ["views", "engagedViews", "estimatedMinutesWatched", "averageViewDuration",
            "likes", "comments", "shares", "subscribersGained", "subscribersLost"]
    daily_resp, used, note = analytics(core, start, end, vid, dims="day")
    raw["analytics.daily"] = daily_resp
    daily = table(daily_resp)
    b_rows = []
    for d in daily:
        for m in used:
            b_rows.append({**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_daily",
                           "scope": "date_range_daily", "period_start": d["day"], "period_end": d["day"],
                           "period_timezone": ANALYTICS_TZ, "dimension": "day", "dimension_value": d["day"],
                           "metric": m, "value": d.get(m, ""), "unit": UNITS[m], "note": note})
    data_through = max((d["day"] for d in daily), default=None)

    if data_through is None:
        b_rows.append({**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_daily",
                       "scope": "date_range_daily", "period_start": start, "period_end": end,
                       "period_timezone": ANALYTICS_TZ, "metric": "_status", "value": "",
                       "note": "API tidak mengembalikan baris: data Analytics untuk rentang ini belum tersedia"})
    reports.append(("video_daily", b_rows))

    if data_through:
        # C. Totals over the available range
        tot_resp, used_t, note_t = analytics(core + ["averageViewPercentage"], start, data_through, vid)
        raw["analytics.total"] = tot_resp
        tot = table(tot_resp)
        c_rows = [{**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_range_total",
                   "scope": "date_range_total", "period_start": start, "period_end": data_through,
                   "period_timezone": ANALYTICS_TZ, "metric": m, "value": (tot[0].get(m, "") if tot else ""),
                   "unit": UNITS[m], "note": note_t or ("" if tot else "tidak ada baris")} for m in used_t]
        reports.append(("video_range_total", c_rows))

        # D. Traffic sources
        tr_resp, used_tr, note_tr = analytics(["views", "engagedViews", "estimatedMinutesWatched"], start,
                                              data_through, vid, dims="insightTrafficSourceType")
        raw["analytics.traffic"] = tr_resp
        d_rows = [{**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_traffic_source",
                   "scope": "date_range_total", "period_start": start, "period_end": data_through,
                   "period_timezone": ANALYTICS_TZ, "dimension": "insightTrafficSourceType",
                   "dimension_value": r["insightTrafficSourceType"], "metric": m, "value": r.get(m, ""),
                   "unit": UNITS[m], "note": note_tr} for r in table(tr_resp) for m in used_tr]
        reports.append(("video_traffic_source", d_rows))

        # E. Audience retention (single video, 100 points)
        try:
            re_resp, used_re, note_re = analytics(["audienceWatchRatio", "relativeRetentionPerformance"], start,
                                                  data_through, vid, dims="elapsedVideoTimeRatio")
            raw["analytics.retention"] = re_resp
            e_rows = [{**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_retention",
                       "scope": "date_range_total", "period_start": start, "period_end": data_through,
                       "period_timezone": ANALYTICS_TZ, "dimension": "elapsedVideoTimeRatio",
                       "dimension_value": r["elapsedVideoTimeRatio"], "metric": m, "value": r.get(m, ""),
                       "unit": UNITS[m], "note": note_re} for r in table(re_resp) for m in used_re]
            if not e_rows:
                e_rows = [{**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_retention",
                           "scope": "date_range_total", "period_start": start, "period_end": data_through,
                           "period_timezone": ANALYTICS_TZ, "metric": "_status", "value": "",
                           "note": "API tidak mengembalikan kurva retention untuk rentang ini"}]
        except ApiError as e:
            e_rows = [{**base, "source": "youtube-analytics-api-v2:reports.query", "report": "video_retention",
                       "scope": "date_range_total", "period_start": start, "period_end": data_through,
                       "period_timezone": ANALYTICS_TZ, "metric": "_status", "value": "",
                       "note": f"permintaan ditolak: {e.message[:200]}"}]
        reports.append(("video_retention", e_rows))

    # Dedup: a report with the same period and identical values is not stored again
    keys = existing_keys()
    written, skipped = [], []
    for name, rws in reports:
        if not rws:
            continue
        # lifetime counters: period_end = capture time, so leave it out of the identity
        end_part = "" if rws[0]["scope"] == "lifetime_counter" else rws[-1]["period_end"]
        k = snapshot_key("youtube", vid, name, rws[0]["period_start"], end_part,
                         values=[(r.get("dimension_value", ""), r["metric"], r["value"]) for r in rws])
        if k in keys:
            skipped.append(name)
            continue
        for r in rws:
            r["snapshot_key"] = k
        rows += rws
        written.append(name)

    # metrics.csv: only the lifetime public counters (same meaning as the manual columns)
    mrow = None
    a = {r["metric"]: r["value"] for r in a_rows}
    prev = [r for r in metrics_csv_rows() if r["content_id"] == args.content_id and r["platform"] == "shorts"
            and "sumber=youtube-data-api" in r.get("notes", "")]
    if not prev or (prev[-1]["views"], prev[-1]["likes"], prev[-1]["comments"]) != (a["viewCount"], a["likeCount"], a["commentCount"]):
        mrow = {
            "content_id": args.content_id, "platform": "shorts", "url": url,
            "published_at": fmt_wib(published) + " (API)", "captured_at": fmt_wib(captured),
            "hours_since_publish": f"{(captured - published).total_seconds() / 3600:.1f}",
            "views": a["viewCount"], "avg_watch_time_s": "", "completion_rate": "",
            "likes": a["likeCount"], "comments": a["commentCount"], "shares": "", "saves": "", "followers_gained": "",
            "notes": ("sumber=youtube-data-api-v3 videos.list (penghitung publik kumulatif saat pengambilan). "
                      "Rata-rata durasi, shares, subscriber: lihat 05-DATA/analytics/api_snapshots.csv (rentang tanggal, "
                      f"data_through={data_through or 'belum tersedia'}). Completion rate tidak tersedia di API."),
        }

    print(f"channel     : {account['account_name']} ({ch['id']})")
    print(f"video       : {vid}  published {fmt_wib(published)}")
    print(f"captured    : {fmt_wib(captured)}  ({fmt_utc(captured)})")
    print(f"analytics   : {start} .. {data_through or '(belum ada data)'}")
    print(f"tulis       : {written or '-'}   lewati (duplikat): {skipped or '-'}")
    print(f"metrics.csv : {'tambah 1 baris' if mrow else 'tidak berubah (angka sama)'}")
    for r in a_rows:
        print(f"  {r['metric']:>14}: {r['value'] if r['value'] != '' else '(kosong)'}")
    if args.dry_run:
        print("DRY RUN: tidak ada yang ditulis.")
        return

    if rows:
        append_rows(rows)
        rawdir = ANALYTICS_DIR / args.content_id / "api"
        rawdir.mkdir(parents=True, exist_ok=True)
        (rawdir / f"youtube_{captured.strftime('%Y%m%dT%H%M%SZ')}.json").write_text(
            json.dumps({"captured_at_utc": fmt_utc(captured), "responses": raw}, ensure_ascii=False, indent=1),
            encoding="utf-8")
    if mrow:
        append_metrics_csv(mrow)
    log_run({"at": fmt_utc(captured), "platform": "youtube", "cmd": "fetch", "status": "ok",
             "content_id": args.content_id, "video_id": vid, "written": written, "skipped": skipped,
             "metrics_csv_row": bool(mrow), "analytics_range": [start, data_through]})


def main() -> None:
    # Windows consoles default to cp1252; titles may contain emoji
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    p = argparse.ArgumentParser(description="YouTube read-only analytics (Uq.cerita)")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("auth").set_defaults(fn=cmd_auth)
    sub.add_parser("whoami").set_defaults(fn=cmd_whoami)
    c = sub.add_parser("confirm-channel"); c.add_argument("channel_id"); c.set_defaults(fn=cmd_confirm)
    f = sub.add_parser("fetch"); f.add_argument("--content-id", required=True)
    f.add_argument("--dry-run", action="store_true")
    f.add_argument("--video-id", help="explicit video ID (must belong to the confirmed channel)"); f.set_defaults(fn=cmd_fetch)
    args = p.parse_args()
    try:
        args.fn(args)
    except ApiError as e:
        log_run({"at": fmt_utc(now_utc()), "platform": "youtube", "cmd": args.cmd, "status": "error",
                 "error": f"HTTP {e.status}: {e.message[:300]}"})
        sys.exit(f"API error: HTTP {e.status}: {e.message}")
    except (socket.timeout, OSError) as e:
        log_run({"at": fmt_utc(now_utc()), "platform": "youtube", "cmd": args.cmd, "status": "error",
                 "error": type(e).__name__})
        sys.exit(f"Jaringan gagal: {type(e).__name__}")


if __name__ == "__main__":
    main()
