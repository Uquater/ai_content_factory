"""Style-target numbers for a rendered MP4 (03-KNOWLEDGE/research/2026-11-16-style-target-badai-matahari.md):
cuts per minute (ffmpeg scene score > 0.3), share of still frames (mean absolute luma change to the previous frame
< 0.6 / 255 on a 270x480 copy, cuts excluded), mean L* and dark-pixel share (L* < 15) over frames sampled at 2 fps.
No numpy needed. usage: python tools/style_video.py <mp4>"""
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from style_measure import lstar  # noqa: E402

W, H = 270, 480


def frames_gray(mp4):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    n = W * H
    return [raw[i:i + n] for i in range(0, len(raw) - n + 1, n)]


def main(mp4):
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], capture_output=True, text=True).stdout)
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", mp4, "-vf", "select='gt(scene,0.3)',showinfo", "-f", "null", "-"], capture_output=True, text=True).stderr
    cuts = [float(x) for x in re.findall(r"pts_time:([\d.]+)", e)]
    fr = frames_gray(mp4)
    cut_idx = {round(c * 30) for c in cuts}
    still = 0
    for i in range(1, len(fr)):
        if i in cut_idx:
            continue
        a, b = fr[i - 1], fr[i]
        d = sum(abs(x - y) for x, y in zip(a[::7], b[::7])) / len(a[::7])
        still += d < 0.6
    # L* at 2 fps
    tmp = Path(mp4).with_suffix("")
    ls = []
    for k in range(int(dur * 2)):
        t = k / 2 + 0.25
        png = f"{tmp}_lstar_tmp.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", mp4, "-frames:v", "1", png], check=True)
        ls.append(lstar(png))
        Path(png).unlink()
    m = sum(x[0] for x in ls) / len(ls)
    d = sum(x[1] for x in ls) / len(ls)
    print(f"{mp4}: {dur:.2f} s · cuts {len(cuts)} ({len(cuts) / dur * 60:.1f}/min) at {[round(c, 2) for c in cuts]} · still frames {100 * still / max(1, len(fr) - 1):.0f}% · L* {m:.1f} · dark {d:.0f}%")


if __name__ == "__main__":
    main(sys.argv[1])
