"""Shared helpers for read-only analytics pulls (Uq.cerita).

Rules (CLAUDE.md §6 Stage 10, ARCHITECTURE §12):
- Secrets live OUTSIDE the repo (default: %USERPROFILE%\\.uq-story-analytics).
  Never print or log token / secret values.
- Values the API does not return stay EMPTY (with a reason). Zero stays zero.
- Lifetime counters and date-range metrics are stored as separate rows (scope).
- Re-running must not duplicate an identical snapshot (snapshot_key).
"""
from __future__ import annotations

import csv
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SECRETS_DIR = Path(os.environ.get("UQ_ANALYTICS_SECRETS", str(Path.home() / ".uq-story-analytics")))
ANALYTICS_DIR = REPO / "05-DATA" / "analytics"
STORE = ANALYTICS_DIR / "api_snapshots.csv"
RUNS = ANALYTICS_DIR / "api_runs.jsonl"
METRICS_CSV = REPO / "05-DATA" / "metrics.csv"
WIB = timezone(timedelta(hours=7), "WIB")

STORE_FIELDS = [
    "snapshot_key", "captured_at_utc", "captured_at_wib", "content_id", "platform",
    "account_id", "account_name", "video_id", "source", "report", "scope",
    "period_start", "period_end", "period_timezone", "dimension", "dimension_value",
    "metric", "value", "unit", "note",
]

if SECRETS_DIR.resolve().is_relative_to(REPO.resolve()):
    sys.exit("STOP: folder kredensial berada di dalam repo. Pindahkan ke luar repo.")


class ApiError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(f"HTTP {status}: {message}")
        self.status = status
        self.message = message


def now_utc() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)


def fmt_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def fmt_wib(dt: datetime) -> str:
    return dt.astimezone(WIB).strftime("%Y-%m-%d %H:%M WIB")


def parse_utc(s: str) -> datetime:
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def read_published_urls(content_id: str) -> list[str]:
    """URLs from the `published-urls` frontmatter list of 04-PRODUCTION/<id>/content.md."""
    path = REPO / "04-PRODUCTION" / content_id / "content.md"
    text = path.read_text(encoding="utf-8")
    parts = text.split("---", 2)
    if len(parts) < 3:
        raise SystemExit(f"Frontmatter tidak ditemukan di {path}")
    urls, inside = [], False
    for line in parts[1].splitlines():
        if line.startswith("published-urls:"):
            inside = True
            urls += re.findall(r"https?://[^\s\"'\]]+", line)
            continue
        if inside:
            if line.startswith("  -") or line.startswith("- "):
                urls += re.findall(r"https?://[^\s\"']+", line)
            elif line.strip():
                break
    return urls


def http_json(method: str, url: str, *, params: dict | None = None, form: dict | None = None,
              headers: dict | None = None, timeout: int = 60) -> dict:
    if params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
    data = urllib.parse.urlencode(form).encode() if form is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        try:
            j = json.loads(body)
            err = j.get("error")
            if isinstance(err, dict):
                msg = err.get("message") or json.dumps(err)[:300]
            else:
                msg = f"{err}: {j.get('error_description', '')}".strip()
        except json.JSONDecodeError:
            msg = body[:300]
        raise ApiError(e.code, msg[:500]) from None


def snapshot_key(*parts: str, values: list) -> str:
    h = hashlib.sha1()
    h.update("|".join(parts).encode())
    h.update(json.dumps(values, sort_keys=True, default=str).encode())
    return h.hexdigest()[:16]


def existing_keys() -> set[str]:
    if not STORE.exists():
        return set()
    with STORE.open(encoding="utf-8", newline="") as f:
        return {r["snapshot_key"] for r in csv.DictReader(f)}


def append_rows(rows: list[dict]) -> None:
    new = not STORE.exists()
    STORE.parent.mkdir(parents=True, exist_ok=True)
    with STORE.open("a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=STORE_FIELDS, lineterminator="\n")
        if new:
            w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in STORE_FIELDS})


def metrics_csv_rows() -> list[dict]:
    with METRICS_CSV.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def append_metrics_csv(row: dict) -> None:
    with METRICS_CSV.open(encoding="utf-8", newline="") as f:
        header = next(csv.reader(f))
    unknown = set(row) - set(header)
    if unknown:
        raise SystemExit(f"Kolom tidak ada di metrics.csv: {unknown} (skema tidak boleh diubah)")
    with METRICS_CSV.open("a", encoding="utf-8", newline="") as f:
        csv.DictWriter(f, fieldnames=header, lineterminator="\n").writerow(row)


def log_run(entry: dict) -> None:
    """Append one execution record. Must never contain secrets."""
    RUNS.parent.mkdir(parents=True, exist_ok=True)
    with RUNS.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def write_secret_json(path: Path, data: dict) -> None:
    """Write next to the restricted folder; the folder ACL is inherited."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data), encoding="utf-8")
    os.replace(tmp, path)
