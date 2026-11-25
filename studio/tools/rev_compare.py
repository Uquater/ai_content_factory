"""Before/after comparison panels for the C1 rev1 demo (labels in Indonesian).
usage: python tools/rev_compare.py old.mp4 new.mp4 out.jpg crop=x,y,w,h scale "label|t_old|t_new" ..."""
import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
old, new, out, crop, scale = sys.argv[1], sys.argv[2], sys.argv[3], [int(v) for v in sys.argv[4].split(",")], float(sys.argv[5])
font = ImageFont.truetype(sys.argv[6], 30) if sys.argv[6].endswith(".ttf") else None
rows = sys.argv[7:] if font else sys.argv[6:]
font = font or ImageFont.load_default()
def grab(clip, t):
    n = round(t * 30)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", clip, "-vf", rf"select=eq(n\,{n})", "-vframes", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
    x, y, w, h = crop
    im = Image.open(BytesIO(raw)).convert("RGB").crop((x, y, x + w, y + h))
    return im.resize((int(w * scale), int(h * scale)))
tiles = []
for r in rows:
    label, to, tn = r.split("|")
    a, b = grab(old, float(to)), grab(new, float(tn))
    tw, th = a.size
    row = Image.new("RGB", (tw * 2 + 12, th + 52), (28, 28, 32))
    row.paste(a, (0, 52)); row.paste(b, (tw + 12, 52))
    d = ImageDraw.Draw(row)
    d.text((10, 10), f"SEBELUM  {label}  t={float(to):.2f}s", font=font, fill=(255, 200, 120))
    d.text((tw + 22, 10), f"SESUDAH (rev1)  {label}  t={float(tn):.2f}s", font=font, fill=(150, 230, 160))
    tiles.append(row)
W = max(t.size[0] for t in tiles)
sheet = Image.new("RGB", (W, sum(t.size[1] for t in tiles) + 10 * (len(tiles) - 1)), (12, 12, 14))
y = 0
for t in tiles:
    sheet.paste(t, (0, y)); y += t.size[1] + 10
sheet.save(out, quality=92)
print(out, sheet.size)
