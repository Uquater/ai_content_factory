"""Strip / 1:1 crop from a rendered IMAGE SEQUENCE (motion tests D-053; rev_sheet.py does the same from an MP4).
usage:
  python tools/m004_sheet.py strip <seq_dir> <out.jpg> x,y,w,h <scale> <cols> <frame> [<frame> ...]
  python tools/m004_sheet.py crop  <seq_dir> <out.png> x,y,w,h <frame>          (1:1, no scaling)
Frames are clip frame numbers (30 fps); each tile is labelled with frame and time. Refuses to overwrite <out>."""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

mode, seq, out = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
if out.exists():
    sys.exit(f"exists, not overwritten: {out}")
x, y, w, h = [int(v) for v in sys.argv[4].split(",")]
files = sorted(seq.glob("*.jpeg")) + sorted(seq.glob("*.jpg")) + sorted(seq.glob("*.png"))


def frame(n):
    im = Image.open(files[n]).convert("RGB")
    return im.crop((x, y, x + w, y + h))


if mode == "crop":
    frame(int(sys.argv[5])).save(out)
    sys.exit(0)
scale, cols = float(sys.argv[5]), int(sys.argv[6])
tiles = []
for n in [int(v) for v in sys.argv[7:]]:
    im = frame(n).resize((int(w * scale), int(h * scale)))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 118, 24), fill=(0, 0, 0))
    d.text((5, 6), f"f{n} {n / 30:.2f}s", fill=(255, 255, 255))
    tiles.append(im)
rows = (len(tiles) + cols - 1) // cols
tw, th = tiles[0].size
sheet = Image.new("RGB", (cols * tw + (cols - 1) * 4, rows * th + (rows - 1) * 4), (40, 40, 40))
for i, im in enumerate(tiles):
    sheet.paste(im, ((i % cols) * (tw + 4), (i // cols) * (th + 4)))
sheet.save(out, quality=90)
