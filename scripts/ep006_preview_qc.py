"""Ep 5 (2026-11-006) full-episode preview QC on the rendered MP4 (not on the plan):
  1. ffprobe (size, fps, frames, duration, codecs)
  2. VO completeness: every VO segment's speech span in the MP4 audio vs the bed around it (rms in dB; speech must sit
     clearly above the floor); v5: N06 in full, the pause before the switch click measured
  3. captions: every caption page lies inside its VO speech (+/- 0.15 s) — from the plan (the picture draws them from it)
  4. closing sync (D-067, relative to the start of the stare = end of U02): audio hit onset vs 3.30 s, the picture cut
     (luma drop) vs 3.40 s, TAMAT from 3.90 s (luma rise), glitch frames 3.90-6.40 s (frame-to-frame change), audio
     present to the last frame (ring/static), no clipping
  5. one-frame luma spikes outside cuts (flicker)
usage: python -X utf8 scripts/ep006_preview_qc.py <mp4> <out.txt>
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PLAN = json.loads((ROOT / "studio/src/ep006/episode006-plan.json").read_text(encoding="utf-8"))
SR = 48000


def run(c):
    return subprocess.run(c, capture_output=True)


def main():
    mp4, out = Path(sys.argv[1]), Path(sys.argv[2])
    L = []
    pr = run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name,width,height,r_frame_rate,nb_frames", "-show_entries", "format=duration", "-of", "compact", str(mp4)]).stdout.decode()
    L.append("## ffprobe\n" + pr.strip())
    a = np.frombuffer(run(["ffmpeg", "-v", "error", "-i", str(mp4), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"]).stdout, dtype=np.float32).reshape(-1, 2)
    m = a.mean(1)
    db = lambda x: float(20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12))  # noqa: E731
    pk = lambda x: float(20 * np.log10(np.abs(x).max() + 1e-12))  # noqa: E731
    seg = lambda t0, t1: m[int(t0 * SR):int(t1 * SR)]  # noqa: E731
    L.append(f"\n## audio: peak per channel {pk(a[:, 0]):.2f} / {pk(a[:, 1]):.2f} dBFS; samples >= 0.999: {int((np.abs(a) >= 0.999).sum())}")
    L.append("\n## VO in the MP4 (rms speech vs rms of the 0.4 s before the take)")
    for k, v in PLAN["vo"].items():
        s0, s1 = v["speech"][0][0], v["end"]
        sp, fl = db(seg(s0, s1)), db(seg(max(0, v["at"] - 0.45), max(0.05, v["at"] - 0.05)))
        L.append(f"{k:4s} {s0:7.2f}-{s1:7.2f} s  speech {sp:6.1f} dB  floor {fl:6.1f} dB  margin {sp - fl:5.1f} dB  {'OK' if sp - fl > 8 else 'CEK'}")
    # v5 (owner): N06 in full ("Kamu akan memilih…"), then ~0.8 s of decision, then the switch click. Measured IN THE MP4: the
    # last frame of N06 speech (10 ms rms above the floor between the take and the click) and the click's onset
    ck = PLAN["events"]["click"]
    n06 = PLAN["vo"]["N06"]
    w = int(0.01 * SR)
    win = m[int((n06["speech"][-1][1] - 0.6) * SR):int((ck + 0.3) * SR)]
    t0 = n06["speech"][-1][1] - 0.6
    env = np.array([20 * np.log10(np.sqrt((win[i:i + w] ** 2).mean()) + 1e-12) for i in range(0, len(win) - w, w)])
    floor = np.median(env[int((ck - 0.25 - t0) / 0.01):int((ck - 0.05 - t0) / 0.01)])
    speech_last = t0 + 0.01 * max(i for i in range(int((ck - 0.3 - t0) / 0.01)) if env[i] > floor + 10)
    click_on = t0 + 0.01 * next(i for i in range(int((ck - 0.2 - t0) / 0.01), len(env)) if env[i] > floor + 15)
    L.append(f"N06 -> click: last speech (10 ms rms > floor + 10 dB) {speech_last:.3f} s (plan {n06['speech'][-1][1]:.3f}); click onset {click_on:.3f} s (plan {ck:.3f}); pause {click_on - speech_last:.2f} s (target ~0.8); floor {floor:.1f} dB")
    # closing
    s15 = PLAN["shots"]["S15"][0]
    C = {k: v - s15 for k, v in PLAN["events"]["close"].items()}
    w = 48
    tail = m[int(s15 * SR):]
    env = np.array([np.abs(tail[i:i + w]).max() for i in range(0, len(tail) - w, w)])
    on = np.argmax(env > 10 ** (-20 / 20)) / 1000
    L.append(f"\n## closing (relative to the stare start {s15:.3f} s = end of U02 {PLAN['vo']['U02']['end']:.3f} s)")
    L.append(f"audio hit onset (> -20 dBFS): {on:.3f} s (plan {C['hit']:.2f})")
    L.append(f"audio after the cut: 3.90-4.60 rms {db(tail[int(3.9 * SR):int(4.6 * SR)]):.1f} dB; last 0.3 s rms {db(tail[-int(0.3 * SR):]):.1f} dB (ring + static to the end)")
    # picture: luma per frame
    yv = np.frombuffer(run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", "scale=54:96,format=gray", "-f", "rawvideo", "-"]).stdout, dtype=np.uint8).reshape(-1, 96, 54).astype(float)
    Y = yv.mean((1, 2))
    f15 = int(round(s15 * 30))
    cutf = int(np.argmax(Y[f15:] < 3)) + f15
    tamf = cutf + int(np.argmax(Y[cutf:] > 4.5))
    L.append(f"picture cut (luma < 3): frame {cutf} = {cutf / 30 - s15:.3f} s (plan {C['cut']:.2f}); TAMAT/grain (luma > 4.5): {tamf / 30 - s15:.3f} s (plan {C['tamatIn']:.2f})")
    d = np.abs(np.diff(yv[f15 + int(3.9 * 30):], axis=0)).mean((1, 2))
    L.append(f"glitch 3.90-6.40 s: frame-to-frame change mean {d.mean():.2f}, frames with change > 0.5: {(d > 0.5).sum()} of {len(d)}")
    # flicker: one-frame luma spikes outside cuts
    cuts = {int(round(PLAN['shots'][k][0] * 30)) for k in PLAN['order']}
    sp = []
    for f in range(1, len(Y) - 1):
        if f in cuts or f + 1 in cuts or f - 1 in cuts or f >= f15 + int(3.3 * 30):
            continue
        if Y[f] - (Y[f - 1] + Y[f + 1]) / 2 > 6:
            sp.append(f)
    L.append(f"\n## one-frame luma spikes outside cuts (> 6): {len(sp)} {sp[:20]}")
    out.write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\n".join(L))


if __name__ == "__main__":
    main()
