"""Top-view floor plan of house no. 7 (geo.ts) for look-dev v3 of 2026-11-003, drawn from the JSON written by
tools/ld003_v3_denah_data.ts (every number on the plan is computed there). Pillow only.
usage: python tools/ld003_v3_denah.py <data.json> <out.png>  (refuses to overwrite)"""
import json, math, os, sys
from PIL import Image, ImageDraw, ImageFont

data, out = sys.argv[1], sys.argv[2]
if os.path.exists(out):
    sys.exit(f"exists, not overwriting: {out}")
d = json.load(open(data, encoding="utf-8"))
S = 150  # px per metre
X0, Z0 = -4.3, -5.3
W, H = int(5.6 * S), int(8.6 * S) + 260
im = Image.new("RGB", (W, H), "#f5f3ee")
g = ImageDraw.Draw(im)
try:
    F = ImageFont.truetype("studio/public/fonts/Poppins-ExtraBold.ttf", 17)
    F2 = ImageFont.truetype("studio/public/fonts/Poppins-ExtraBold.ttf", 20)
except OSError:
    F = F2 = ImageFont.load_default()
P = lambda x, z: ((x - X0) * S, (z - Z0) * S)
def wall(x0, z0, x1, z1):
    a, b = P(x0, z0), P(x1, z1)
    g.rectangle([min(a[0], b[0]), min(a[1], b[1]), max(a[0], b[0]), max(a[1], b[1])], fill="#3a3a48")
T = 0.06
wall(-4.0, -5.0 - T, 1.0, -5.0 + T); wall(-4.0 - T, -5.0, -4.0 + T, 3.0); wall(1.0 - T, -5.0, 1.0 + T, 3.0); wall(-4.0, 3.0 - T, 1.0, 3.0 + T)
wall(-4.0, -3.2 - T, -1.4, -3.2 + T); wall(-0.2, -3.2 - T, 1.0, -3.2 + T)
wall(-1.4 - T, -3.2, -1.4 + T, -1.0); wall(-0.2 - T, -3.2, -0.2 + T, -1.0)
wall(-4.0, -1.0 - T, -1.4, -1.0 + T); wall(-0.2, -1.0 - T, 1.0, -1.0 + T)
a, b = P(-1.25, -5.06), P(-0.35, -4.94); g.rectangle([a, b], fill="#c09a6c")  # back door leaf
a, b = P(-3.8, -4.94), P(-1.6, -4.32); g.rectangle([a, b], fill="#c8c0b0", outline="#888")
g.text(P(-3.6, -4.75), "meja dapur", fill="#555", font=F)
gx, gz = d["glass"]; a, b = P(gx - 0.25, gz - 0.12), P(gx + 0.25, gz - 0.02); g.rectangle([a, b], fill="#6f95d8")
g.text(P(gx + 0.3, gz - 0.2), "kaca", fill="#2a4f8f", font=F)
bx, bz = d["bolt"]; c = P(bx, bz + 0.05); g.ellipse([c[0] - 6, c[1] - 6, c[0] + 6, c[1] + 6], fill="#d86f1e")
g.text(P(-3.0, -2.4), "DAPUR", fill="#888", font=F2) if False else g.text(P(-3.3, -4.0), "DAPUR", fill="#888", font=F2)
g.text(P(-3.3, 1.0), "RUANG TAMU", fill="#888", font=F2)
g.text(P(-1.35, -2.0), "LORONG", fill="#888", font=F)
(l0, l1) = d["line"]
dx, dz = l1[0] - l0[0], l1[1] - l0[1]
ext = lambda t: P(l0[0] + dx * t, l0[1] + dz * t)
g.line([ext(-1.15), ext(1.25)], fill="#c0392b", width=3)
g.text(ext(-0.5), "  garis Uq–adik (S03–S07)", fill="#c0392b", font=F)
for ch in d["chars"]:
    c = P(*ch["p"]); r = 0.2 * S
    g.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], outline="#222", width=2, fill="#d9c9b0" if "adik" in ch["who"] else "#9aa4c8")
    g.text((c[0] + r + 4, c[1] - 9 + (22 if "v2" in ch["who"] else 0)), ch["who"], fill="#222", font=F)
colors = ["#1e7d3a", "#7a3fa0", "#b0601e", "#2a6db0", "#555555", "#a0346a", "#3a8a8a", "#806020"]
legend = []
seen = set()
for i, cm in enumerate(d["cams"]):
    if tuple(cm["pos"]) in seen:
        legend.append((colors[i % len(colors)], f"{cm['id']}: {cm['d']:.2f} m ke {cm['near']} · sisi garis: {cm['side']} (posisi sama dengan kamera sebelumnya)"))
        continue
    seen.add(tuple(cm["pos"]))
    col = colors[i % len(colors)]
    x, _, z = cm["pos"]; lx, _, lz = cm["look"]
    yaw = math.atan2(lx - x, lz - z); h = math.radians(cm["hfov"] / 2); L = 2.2
    pts = [P(x, z), P(x + L * math.sin(yaw - h), z + L * math.cos(yaw - h)), P(x + L * math.sin(yaw + h), z + L * math.cos(yaw + h))]
    g.polygon(pts, outline=col, width=2)
    c = P(x, z); g.rectangle([c[0] - 7, c[1] - 7, c[0] + 7, c[1] + 7], fill=col)
    g.text((c[0] + 9, c[1] + 2), cm["id"], fill=col, font=F)
    legend.append((col, f"{cm['id']}: {cm['d']:.2f} m ke {cm['near']} · sisi garis: {cm['side']}"))
y = int(8.6 * S) + 10
g.text((16, y), "Denah rumah no. 7 (geo.ts), 1 m = 150 px, utara di atas.", fill="#222", font=F); y += 24
g.text((16, y), "Angka dihitung dari data scene v3 (tools/ld003_v3_denah_data.ts).", fill="#222", font=F); y += 26
for col, t in legend:
    g.text((16, y), t, fill=col, font=F); y += 24
im.save(out)
print("saved", out)
