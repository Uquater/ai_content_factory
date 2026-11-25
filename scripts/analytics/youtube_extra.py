"""Read-only extras for youtube_api.py (2026-11-18): list the channel's uploads, dump all comments + replies.

  python scripts/analytics/youtube_extra.py uploads
  python scripts/analytics/youtube_extra.py comments --video-id <ID> --out <file.json>

Never prints tokens; comments are stored with author names stripped (a stable anonymous hash per author is kept so
"one account counts once" works). No write calls exist here: no reply, like, delete.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import youtube_api as Y  # noqa: E402


def uploads() -> list[dict]:
    ch = Y.api_get(f"{Y.DATA_API}/channels", {"part": "contentDetails", "mine": "true"})["items"][0]
    pl = ch["contentDetails"]["relatedPlaylists"]["uploads"]
    out, tok = [], None
    while True:
        p = {"part": "snippet,contentDetails,status", "playlistId": pl, "maxResults": 50}
        if tok:
            p["pageToken"] = tok
        r = Y.api_get(f"{Y.DATA_API}/playlistItems", p)
        out += r.get("items", [])
        tok = r.get("nextPageToken")
        if not tok:
            return out


def cmd_uploads(_a):
    for it in uploads():
        sn, cd, st = it["snippet"], it["contentDetails"], it.get("status", {})
        print(cd["videoId"], "|", cd.get("videoPublishedAt"), "|", st.get("privacyStatus"), "|", sn["title"])


def cmd_comments(a):
    threads, tok = [], None
    while True:
        p = {"part": "snippet,replies", "videoId": a.video_id, "maxResults": 100, "textFormat": "plainText", "order": "time"}
        if tok:
            p["pageToken"] = tok
        r = Y.api_get(f"{Y.DATA_API}/commentThreads", p)
        threads += r.get("items", [])
        tok = r.get("nextPageToken")
        if not tok:
            break
    rows = []
    anon = lambda cid: hashlib.sha256(("uq-salt|" + (cid or "")).encode()).hexdigest()[:10]  # noqa: E731
    for th in threads:
        top = th["snippet"]["topLevelComment"]["snippet"]
        rows.append({"id": th["id"], "parent": None, "author": anon(top.get("authorChannelId", {}).get("value")), "text": top.get("textDisplay", ""),
                     "likes": top.get("likeCount", 0), "at": top.get("publishedAt"), "by_channel_owner": False})
        replies = th.get("replies", {}).get("comments", [])
        total = th["snippet"].get("totalReplyCount", 0)
        if total > len(replies):  # threads only embed a few replies: fetch the rest
            rep, t2 = [], None
            while True:
                q = {"part": "snippet", "parentId": th["id"], "maxResults": 100, "textFormat": "plainText"}
                if t2:
                    q["pageToken"] = t2
                rr = Y.api_get(f"{Y.DATA_API}/comments", q)
                rep += rr.get("items", [])
                t2 = rr.get("nextPageToken")
                if not t2:
                    break
            replies = rep
        for c in replies:
            s = c["snippet"]
            rows.append({"id": c["id"], "parent": th["id"], "author": anon(s.get("authorChannelId", {}).get("value")), "text": s.get("textDisplay", ""),
                         "likes": s.get("likeCount", 0), "at": s.get("publishedAt"), "by_channel_owner": False})
    own = None
    try:
        own = Y.my_channel()["id"]
    except SystemExit:
        pass
    for th in threads:
        pass
    Path(a.out).write_text(json.dumps({"video_id": a.video_id, "n_threads": len(threads), "n_total": len(rows), "owner_channel_hash": anon(own), "comments": rows}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(threads)} thread, {len(rows)} komentar+balasan tersimpan ke {a.out}")


def main():
    for s in (sys.stdout, sys.stderr):
        s.reconfigure(encoding="utf-8", errors="replace")
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("uploads").set_defaults(fn=cmd_uploads)
    c = sub.add_parser("comments"); c.add_argument("--video-id", required=True); c.add_argument("--out", required=True); c.set_defaults(fn=cmd_comments)
    a = p.parse_args()
    try:
        a.fn(a)
    except Y.ApiError as e:
        sys.exit(f"API error: HTTP {e.status}: {e.message[:300]}")


if __name__ == "__main__":
    main()
