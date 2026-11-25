"""Episode 2026-11-002 animatic prep (D-027): builds the plan JSON and the animatic audio mix.

Inputs (read only):
  04-PRODUCTION/2026-11-002/content.md            locked script, table §2 (L1-L33)
  _media/2026-11-002/audio/preview/2026-11-002_vo_preview_v2.wav          approved audio v2 (not changed)
  _media/2026-11-002/audio/preview/2026-11-002_vo_preview_v2_timing.json  its line timing
  _media/2026-11-002/audio/vo_fx/2026-11-002_vo_P01_take01_toa_v2.wav     the approved toa copy of L2
Outputs (refuse to overwrite unless --force on a file made by this script in this session):
  studio/src/ep002/plan-2026-11-002.json
  _media/2026-11-002/audio/animatic/2026-11-002_animatic_mix_v1.wav
Mix = audio v2 unchanged + the L2 toa repeat quietly under L5 (A04, D-025) + faint repeats in A07-A08 that stop at the
onset of L18 ("Pengumuman itu berhenti", content.md §5.3) + 1.0 s silence at the end (A17, D-025). No speed change,
no new speech, no music, no new SFX.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "04-PRODUCTION/2026-11-002/content.md"
V2 = ROOT / "_media/2026-11-002/audio/preview/2026-11-002_vo_preview_v2.wav"
TIMING = ROOT / "_media/2026-11-002/audio/preview/2026-11-002_vo_preview_v2_timing.json"
TOA = ROOT / "_media/2026-11-002/audio/vo_fx/2026-11-002_vo_P01_take01_toa_v2.wav"
PLAN = ROOT / "studio/src/ep002/plan-2026-11-002.json"
MIX = ROOT / "_media/2026-11-002/audio/animatic/2026-11-002_animatic_mix_v2.wav"

TAIL = 1.0  # A17: silence added on the video timeline (D-025)
# A07 -> A08 editing choice (D-027, for review): the message (L16, ends 40.10 s) stays on screen until 40.25 s, then
# C1's face lit by the phone until 41.08 s, two frames before L17 starts (41.15 s). Audio is not moved.
CUT_A07_A08 = 41.08
FACE_IN = 40.25
# toa repeats of L2 (start s, gain dB, low-pass Hz, end s or None): A04 under L5; A07-A08 faint, cut at L18's onset
REPEATS = [(11.30, -6.0, 3400, None), (30.10, -11.0, 2400, None), (36.30, -12.0, 2400, None), (41.25, -11.0, 2400, 43.50)]

# scene cuts (content.md §4 v0.2, measured on audio v2) and shots inside them
SCENES = [
    ("A01", 0.0, 4.77, [("a01", 0.0)]),
    ("A02", 4.77, 8.10, [("a02", 4.77)]),
    ("A03", 8.10, 9.96, [("a03", 8.10)]),
    ("A04", 9.96, 16.15, [("a04", 9.96)]),
    ("A05", 16.15, 22.76, [("a05a", 16.15), ("a05b", 19.30), ("a05c", 21.06)]),
    ("A06", 22.76, 27.73, [("a06a", 22.76), ("a06b", 26.05)]),
    ("A07", 27.73, CUT_A07_A08, [("a07a", 27.73), ("a07b", 29.64), ("a07c", FACE_IN)]),
    ("A08", CUT_A07_A08, 43.37, [("a08", CUT_A07_A08)]),
    ("A09", 43.37, 49.96, [("a09", 43.37)]),
    ("A10", 49.96, 58.74, [("a10a", 49.96), ("a10b", 55.66)]),
    ("A11", 58.74, 62.87, [("a11a", 58.74), ("a11b", 60.72)]),
    ("A12", 62.87, 65.68, [("a12a", 62.87), ("a12b", 64.40)]),
    ("A13", 65.68, 73.34, [("a13a", 65.68), ("a13b", 68.20)]),
    ("A14", 73.34, 80.75, [("a14", 73.34)]),
    ("A15", 80.75, 83.24, [("a15", 80.75)]),
    ("A16", 83.24, 89.89, [("a16a", 83.24), ("a16b", 85.59)]),
    ("A17", 89.89, None, [("a17", 89.89)]),
]
SPEAKER = {"NARATOR": "n", "PENGUMUMAN": "toa", "ADIK": "adik"}


def lines():
    c = CONTENT.read_text(encoding="utf-8")
    rows = re.findall(r"^\| L(\d+) \| P\d+ \| ([^|]+) \| (.+?) \|\s*$", c, re.M)
    t = json.loads(TIMING.read_text(encoding="utf-8"))
    tm = {x["L"]: x for x in t["lines"]}
    out = []
    for n, who, text in rows:
        kind = "msg" if "membaca pesan" in who else SPEAKER[who.split()[0]]
        x = tm[f"L{n}"]
        out.append({"id": f"L{n}", "who": kind, "text": text.strip(), "start": round(x["start"], 3), "end": round(x["end"], 3)})
    assert len(out) == 33 and [o["id"] for o in out] == [f"L{i}" for i in range(1, 34)], "script table changed"
    return out, t["duration_s"]


def build_plan(force):
    ls, dur = lines()
    end = round(dur + TAIL, 3)
    shots = []
    for sid, a, b, sh in SCENES:
        b = end if b is None else b
        for i, (shot, s0) in enumerate(sh):
            s1 = sh[i + 1][1] if i + 1 < len(sh) else b
            shots.append({"id": shot, "scene": sid, "start": s0, "end": round(s1, 3)})
    plan = {
        "id": "2026-11-002",
        "note": "built by scripts/ep002_animatic_prep.py from content.md §2/§4 and audio v2 timing; do not hand-edit",
        "fps": 30,
        "audioEnd": round(dur, 3),
        "end": end,
        "frames": round(end * 30),
        "cutA07A08": CUT_A07_A08,
        "lines": ls,
        "scenes": [{"id": s, "start": a, "end": end if b is None else b} for s, a, b, _ in SCENES],
        "shots": shots,
        "beats": {"lightOff": 64.40, "cards": round(ls[-1]["end"], 3), "toaStops": 43.557, "repeatUnderL5": REPEATS[0][0]},
    }
    if PLAN.exists() and not force:
        old = json.loads(PLAN.read_text(encoding="utf-8"))
        if old != plan:
            sys.exit(f"REFUSED: {PLAN} exists and differs (use --force only for a plan this script made)")
    PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"plan: {len(ls)} lines, {len(shots)} shots, end {end} s ({plan['frames']} frames)")
    return plan


def build_mix(force, dur):
    if MIX.exists() and not force:
        sys.exit(f"REFUSED: {MIX} exists")
    MIX.parent.mkdir(parents=True, exist_ok=True)
    args = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(V2)]
    fl = []
    for i, (st, g, lp, stop) in enumerate(REPEATS):
        args += ["-i", str(TOA)]
        trim = f"atrim=0:{stop - st:.3f},afade=t=out:st={stop - st - 0.02:.3f}:d=0.02," if stop else ""
        fl.append(f"[{i + 1}:a]{trim}lowpass=f={lp},volume={g}dB,adelay={int(st * 1000)}:all=1[r{i}]")
    mixin = "[0:a]" + "".join(f"[r{i}]" for i in range(len(REPEATS)))
    # v2: padded to the picture length + 50 ms, so finish_render's -shortest never trims the last frames
    # (v1 ended at 99.563 s, 3.7 ms before frame 2987 ended, and the mux dropped 3 frames)
    whole = round((dur + TAIL) * 30) / 30 + 0.05
    fl.append(f"{mixin}amix=inputs={len(REPEATS) + 1}:normalize=0:duration=first,apad=whole_dur={whole:.3f}[out]")
    args += ["-filter_complex", ";".join(fl), "-map", "[out]", "-c:a", "pcm_s24le", "-ar", "44100", str(MIX)]
    subprocess.run(args, check=True)
    print(f"mix: {MIX}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--plan-only", action="store_true")
    a = ap.parse_args()
    p = build_plan(a.force)
    if not a.plan_only:
        build_mix(a.force, p["audioEnd"])
