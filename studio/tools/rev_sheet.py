"""Contact sheet of chosen frames from a clip (rev1 QC helper).
usage: python tools/rev_sheet.py clip.mp4 first_frame out.jpg crop=x,y,w,h scale t1 t2 ...  (times in seconds, 30 fps)"""
import subprocess, sys
from PIL import Image, ImageDraw
clip, first, out, crop, scale = sys.argv[1], int(sys.argv[2]), sys.argv[3], [int(v) for v in sys.argv[4].split(",")], float(sys.argv[5])
times = [float(t) for t in sys.argv[6:]]
tiles = []
for t in times:
    n = round(t * 30) - first
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", clip, "-vf", f"select=eq(n\,{n})", "-vframes", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
    from io import BytesIO
    im = Image.open(BytesIO(raw)).convert("RGB")
    x, y, w, h = crop
    im = im.crop((x, y, x + w, y + h)).resize((int(w * scale), int(h * scale)))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 92, 26), fill=(0, 0, 0))
    d.text((6, 6), f"t={t:.2f}s", fill=(255, 255, 255))
    tiles.append(im)
cols = min(7, len(tiles))
rows = (len(tiles) + cols - 1) // cols
tw, th = tiles[0].size
sheet = Image.new("RGB", (cols * tw + (cols - 1) * 4, rows * th + (rows - 1) * 4), (40, 40, 40))
for i, im in enumerate(tiles):
    sheet.paste(im, ((i % cols) * (tw + 4), (i // cols) * (th + 4)))
sheet.save(out, quality=90)
print(out, sheet.size)
