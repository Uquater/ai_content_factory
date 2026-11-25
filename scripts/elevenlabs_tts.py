"""Generate voice-over segments for a Content Unit with ElevenLabs TTS (one take per call).

Reads the spoken text from the content.md section "9.5 Segmen" code blocks (```text) so the
script text is never retyped. Never overwrites an existing file. Writes a JSON sidecar with the
generation metadata next to each MP3.

Usage (from repo root):
  python scripts/elevenlabs_tts.py --content 04-PRODUCTION/2026-11-002/content.md \
      --out _media/2026-11-002/audio/vo_raw --unit 2026-11-002 --segments D02 [N02 ...] [--dry-run]

Key: ELEVENLABS_API_KEY from the environment, or loaded from .env.local (never printed).
Spends ElevenLabs credits (1 per character on eleven_v4). Run only with owner approval.
"""
import argparse, datetime, hashlib, json, os, re, sys, urllib.error, urllib.request
from pathlib import Path

API = "https://api.elevenlabs.io/v1"
MODEL = "eleven_v4"
FORMAT = "mp3_44100_128"
# Verified 2026-11-15 from the accepted samples' history (content.md §9.8).
VOICES = {
    "N": ("Dhani - Professional, Clear and Engaging", "20ptB7Wn4Q2sMkAxK1qK"),
    "P": ("Dhani - Professional, Clear and Engaging", "20ptB7Wn4Q2sMkAxK1qK"),
    "D": ("Zorin - Friendly, Calm and Soft", "19zQpXlAQKHlcmXgXfLr"),
}
SETTINGS = {"stability": 0.77, "similarity_boost": 0.43}


def load_key():
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]
    env = Path(".env.local")
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.strip().startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY not found (env or .env.local)")


def parse_segments(content_md):
    text = Path(content_md).read_text(encoding="utf-8")
    sec = text.split("### 9.5", 1)[1].split("### 9.6", 1)[0]
    segs = {}
    for m in re.finditer(r"\*\*([NPD]\d\d) · [^*]+\*\*.*?```text\n(.*?)\n```", sec, re.S):
        segs[m.group(1)] = m.group(2)
    return segs


def generate(key, voice_id, spoken):
    body = json.dumps({"text": spoken, "model_id": MODEL, "voice_settings": SETTINGS}).encode("utf-8")
    req = urllib.request.Request(f"{API}/text-to-speech/{voice_id}?output_format={FORMAT}", data=body,
                                 method="POST", headers={"xi-api-key": key, "Content-Type": "application/json",
                                                         "Accept": "audio/mpeg"})
    with urllib.request.urlopen(req, timeout=180) as r:
        hdr = {k.lower(): v for k, v in r.headers.items()}
        return r.read(), hdr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--content", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--unit", required=True)
    ap.add_argument("--segments", nargs="+", required=True)
    ap.add_argument("--take", default="01")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    segs = parse_segments(a.content)
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    plan = []
    for sid in a.segments:
        if sid not in segs:
            sys.exit(f"{sid}: no ```text block in §9.5")
        mp3 = out / f"{a.unit}_vo_{sid}_take{a.take}.mp3"
        if mp3.exists() or mp3.with_suffix(".json").exists():
            sys.exit(f"{mp3.name}: already exists, refusing to overwrite")
        plan.append((sid, segs[sid], mp3))
    total = sum(len(t) for _, t, _ in plan)
    for sid, t, mp3 in plan:
        print(f"{sid} {len(t):4d} chars -> {mp3.name} | {t!r}")
    print(f"total {total} chars")
    if a.dry_run:
        return

    key = load_key()
    for sid, spoken, mp3 in plan:
        vname, vid = VOICES[sid[0]]
        try:
            audio, hdr = generate(key, vid, spoken)
        except urllib.error.HTTPError as e:
            sys.exit(f"{sid}: HTTP {e.code} {e.read()[:300]!r} (stopped; no retry)")
        if not audio:
            sys.exit(f"{sid}: empty response (stopped; no retry)")
        mp3.write_bytes(audio)
        meta = {
            "file": mp3.name, "segment": sid, "text": spoken, "chars": len(spoken),
            "model_id": MODEL, "voice_name": vname, "voice_id": vid, "voice_settings": SETTINGS,
            "output_format": FORMAT, "md5": hashlib.md5(audio).hexdigest(), "bytes": len(audio),
            "request_id": hdr.get("request-id"), "history_item_id": hdr.get("history-item-id"),
            "character_cost": hdr.get("character-cost") or hdr.get("x-character-count"),
            "generated_at": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
            "take_policy": "single take, no automatic regeneration",
        }
        mp3.with_suffix(".json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{sid}: ok {len(audio)} bytes md5 {meta['md5'][:8]} history {meta['history_item_id']} cost {meta['character_cost']}")


if __name__ == "__main__":
    main()
