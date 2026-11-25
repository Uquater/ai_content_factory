"""Episode 3 (2026-11-004), D-058: contact sheet of key moments with a CONSERVATIVE safe-zone overlay for a 1080x1920 canvas
(third-party guidance for YouTube Shorts, not official documentation = an indication only): top 288, bottom 672, left 48,
right 192 px. Works on any render size (scaled). Zones are tinted red; a thin white line marks each edge.
usage: python studio/tools/e004_safezone_sheet.py <mp4> <out.png> <frame:label> [<frame:label> ...]"""
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

mp4, out, items = sys.argv[1], sys.argv[2], sys.argv[3:]
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", mp4], capture_output=True, text=True).stdout.strip().split(",")
W, H = int(probe[0]), int(probe[1])
k = W / 1080
Z = {"top": 288, "bottom": 672, "left": 48, "right": 192}
tiles = []
for it in items:
    fr, label = it.split(":", 1)
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vf", f"select=eq(n\\,{int(fr)})", "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
    im = Image.frombytes("RGB", (W, H), r.stdout).convert("RGBA")
    ov = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    red = (255, 40, 40, 70)
    d.rectangle([0, 0, W, Z["top"] * k], fill=red)
    d.rectangle([0, H - Z["bottom"] * k, W, H], fill=red)
    d.rectangle([0, Z["top"] * k, Z["left"] * k, H - Z["bottom"] * k], fill=red)
    d.rectangle([W - Z["right"] * k, Z["top"] * k, W, H - Z["bottom"] * k], fill=red)
    for x in (Z["left"] * k, W - Z["right"] * k):
        d.line([x, 0, x, H], fill=(255, 255, 255, 200), width=1)
    for y in (Z["top"] * k, H - Z["bottom"] * k):
        d.line([0, y, W, y], fill=(255, 255, 255, 200), width=1)
    im = Image.alpha_composite(im, ov).convert("RGB")
    lab = Image.new("RGB", (W, 28), (20, 20, 28))
    ImageDraw.Draw(lab).text((6, 6), f"f{fr} {label}", fill=(255, 255, 255), font=ImageFont.load_default())
    t = Image.new("RGB", (W, H + 28)); t.paste(lab, (0, 0)); t.paste(im, (0, 28))
    tiles.append(t)
cols = min(5, len(tiles)); rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (W + 6), rows * (H + 34)), (60, 60, 60))
for i, t in enumerate(tiles):
    sheet.paste(t, ((i % cols) * (W + 6), (i // cols) * (H + 34)))
sheet.save(out)
print(out, sheet.size)
