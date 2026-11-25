"""QC for the 2026-11-002 animatic MP4 (run from studio/): python tools/ep002_qc.py <mp4> <contact_sheet.jpg>

Checks: stream format (720x1280, 30 fps, h264 + aac), frame count vs the plan, blank / black frames (luma per frame),
one-frame luma spikes outside shot cuts, the muxed audio equals the animatic mix (no repeated or cut audio), and a
contact sheet (1 frame per second). Prints a summary; exits 1 on a hard failure. Never overwrites the sheet.
"""
import json
import subprocess
import sys
from pathlib import Path

mp4, sheet = Path(sys.argv[1]), Path(sys.argv[2])
plan = json.loads(Path("src/ep002/plan-2026-11-002.json").read_text(encoding="utf-8"))
mix = Path("../_media/2026-11-002/audio/animatic/2026-11-002_animatic_mix_v2.wav")
bad = []

pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)], capture_output=True, text=True).stdout)
v = [s for s in pr["streams"] if s["codec_type"] == "video"][0]
a = [s for s in pr["streams"] if s["codec_type"] == "audio"][0]
nb = int(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "default=nw=1:nk=1", str(mp4)], capture_output=True, text=True).stdout.strip())
print(f"video {v['codec_name']} {v['width']}x{v['height']} {v['r_frame_rate']} frames={nb} (plan {plan['frames']}) · audio {a['codec_name']} {a['sample_rate']} Hz {a.get('channels')} ch · duration {float(pr['format']['duration']):.3f} s")
if (v["width"], v["height"]) != (720, 1280) or v["r_frame_rate"] != "30/1" or v["codec_name"] != "h264" or a["codec_name"] != "aac":
    bad.append("format")
if abs(nb - plan["frames"]) > 1:
    bad.append(f"frame count {nb} vs {plan['frames']}")

# luma per frame
out = subprocess.run(["ffprobe", "-v", "error", "-f", "lavfi", "-i", f"movie={mp4.as_posix()},signalstats", "-show_entries", "frame_tags=lavfi.signalstats.YAVG,lavfi.signalstats.YMAX", "-of", "csv=p=0"], capture_output=True, text=True).stdout
rows = [tuple(float(x) for x in l.split(",")[:2]) for l in out.strip().splitlines() if l]
yavg = [r[0] for r in rows]
blank = [i for i, (y, ym) in enumerate(rows) if ym - 0 < 20 or y < 6]
cuts = {round(s["start"] * 30) for s in plan["shots"]}
spikes = [i for i in range(1, len(yavg) - 1) if abs(yavg[i] - yavg[i - 1]) > 18 and abs(yavg[i] - yavg[i + 1]) > 18 and not any(abs(i - c) <= 1 for c in cuts)]
print(f"luma: min {min(yavg):.1f} max {max(yavg):.1f} · blank frames {len(blank)} {blank[:10]} · one-frame spikes outside cuts {spikes[:10]}")
if blank:
    bad.append("blank frames")

# audio equals the mix (decode both to 16-bit mono 44.1 kHz and compare the first 99 s by RMS difference)
def pcm(src):
    return subprocess.run(["ffmpeg", "-v", "error", "-i", str(src), "-map", "0:a:0", "-ac", "1", "-ar", "44100", "-t", "99.0", "-f", "s16le", "-"], capture_output=True).stdout
import array
x = array.array("h", pcm(mp4))
y = array.array("h", pcm(mix))
n = min(len(x), len(y))
# best lag within ±50 ms (AAC priming), then RMS of the difference relative to the mix RMS
def rms(seq):
    return (sum(s * s for s in seq) / max(1, len(seq))) ** 0.5
best = None
step = 4
for lag in range(-2205, 2206, 441):
    xs = x[max(0, lag): n + min(0, lag)][::step]
    ys = y[max(0, -lag): n - max(0, lag)][::step]
    m = min(len(xs), len(ys))
    d = rms([xs[i] - ys[i] for i in range(0, m, 25)])
    if best is None or d < best[1]:
        best = (lag, d)
ref = rms(y[::100])
print(f"audio vs mix: best lag {best[0] / 44.1:.1f} ms, residual {20 * __import__('math').log10(max(1e-9, best[1]) / ref):.1f} dB re mix RMS (AAC; < -20 dB = same audio)")
if 20 * __import__("math").log10(max(1e-9, best[1]) / ref) > -20:
    bad.append("audio differs from the mix")

if sheet.exists():
    print(f"sheet exists, not overwritten: {sheet}")
else:
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", "fps=1,scale=144:256,tile=10x10", "-frames:v", "1", str(sheet)], check=True)
    print(f"contact sheet: {sheet}")
print("RESULT:", "FAIL " + "; ".join(bad) if bad else "OK")
sys.exit(1 if bad else 0)
