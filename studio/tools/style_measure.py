"""Style-target numbers for stills (method of 03-KNOWLEDGE/research/2026-11-16-style-target-badai-matahari.md):
mean CIE L* over all pixels (sRGB -> linear -> Y -> L*) and the share of dark pixels (L* < 15). No numpy needed.
usage: python tools/style_measure.py <image> [<image> ...]"""
import sys
from PIL import Image

LUT = [(c / 255 / 12.92) if c / 255 <= 0.04045 else ((c / 255 + 0.055) / 1.055) ** 2.4 for c in range(256)]


def lstar(path, size=(270, 480)):
    im = Image.open(path).convert("RGB").resize(size)
    data = im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()
    tot = dark = 0.0
    n = 0
    for r, g, b in data:
        y = 0.2126 * LUT[r] + 0.7152 * LUT[g] + 0.0722 * LUT[b]
        L = 116 * y ** (1 / 3) - 16 if y > 0.008856 else 903.3 * y
        tot += L
        dark += L < 15
        n += 1
    return tot / n, 100 * dark / n


if __name__ == "__main__":
    for p in sys.argv[1:]:
        m, d = lstar(p)
        print(f"{p}: L* {m:.1f}  dark {d:.0f}%")
