"""Episode 3 (2026-11-004), D-058: whole-video flicker scan on a rendered MP4.
A pixel "flickers" at frame f when it jumps away and comes back in one frame: s = min(|f-(f-1)|, |f-(f+1)|) - |(f+1)-(f-1)|
(luma, 0-255). Smooth camera or character motion is monotonic over three frames, so s stays ~0; z-fighting, crawling ink and
one-frame pops give s > 0. Frames whose triplet crosses a cut are skipped; windows listed in --mask (UI shake, etc.) are
scored separately. Per shot and per 16 px tile: the share of flicker pixels (s >= --thr) per frame, summed over the shot.
Clusters = adjacent hot tiles in a shot; ranked by summed score; max --per-shot clusters per shot.
usage: python studio/tools/e004_flicker_scan.py <mp4> <seq.json> <outdir> [--thr 14] [--top 10] [--per-shot 2] [--mask a:b,...]
--alt (D-058 v2, default on): a pixel counts only if it REVERSES at least twice inside 5 frames (f-2..f+2: three
consecutive frame-to-frame steps >= thr with alternating sign). A limb or edge that passes once reverses once; z-fighting,
crawling ink and buzz shake alternate. --alt 0 = the 3-frame metric above (v1, many false hits on moving limbs).
seq.json: [{"id","from","dur"}...] in video frames. Writes <outdir>/flicker_scan.txt and crops crop_NN_<shot>_f<frame>.png
(1:1 f-1 | f | f+1 and a 3x enlarged copy)."""
import argparse
import json
import subprocess
import sys

import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ap = argparse.ArgumentParser()
ap.add_argument("mp4"); ap.add_argument("seq"); ap.add_argument("out")
ap.add_argument("--thr", type=int, default=14); ap.add_argument("--top", type=int, default=10)
ap.add_argument("--per-shot", type=int, default=2); ap.add_argument("--mask", default="")
ap.add_argument("--tile", type=int, default=16)
ap.add_argument("--alt", type=int, default=1)
ap.add_argument("--flat", type=int, default=0)  # 1: ignore pixels within 2 px of an edge of the 5-frame median (z-fighting on surfaces)
a = ap.parse_args()
probe = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json", a.mp4], capture_output=True, text=True).stdout)
W, H = probe["streams"][0]["width"], probe["streams"][0]["height"]
seqs = json.load(open(a.seq, encoding="utf-8"))
shot_of = {}
for s in seqs:
    for f in range(s["from"], s["from"] + s["dur"]):
        shot_of[f] = s["id"]
masks = [tuple(int(x) for x in m.split(":")) for m in a.mask.split(",") if m]
T = a.tile
ty, tx = H // T, W // T
proc = subprocess.Popen(["ffmpeg", "-v", "error", "-i", a.mp4, "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
n = W * H
buf = []
score = {}          # (shot, iy, ix) -> summed share
hits = {}           # (shot, iy, ix) -> list of (share, frame)
masked = {}         # same, for masked windows
noise = []
f = -1
while True:
    raw = proc.stdout.read(n)
    if len(raw) < n:
        break
    f += 1
    buf.append(np.frombuffer(raw, np.uint8).reshape(H, W).astype(np.int16))
    K = 5 if a.alt else 3
    if len(buf) > K:
        buf.pop(0)
    if len(buf) < K:
        continue
    c = f - K // 2  # centre frame
    if any(shot_of.get(c + d) != shot_of.get(c) for d in range(-(K // 2), K // 2 + 1)):
        continue
    if a.alt:
        d = [buf[i + 1] - buf[i] for i in range(4)]
        st = [np.where(np.abs(x) >= a.thr, np.sign(x), 0) for x in d]
        rev = sum(((st[i] * st[i + 1]) < 0).astype(np.int8) for i in range(3))
        s = rev.astype(np.int16) * 100  # for the noise line: share of reversing pixels is what counts
        hot = (rev >= 2).astype(np.float32)
        if a.flat:
            med = np.median(np.stack(buf), axis=0)
            g = np.zeros_like(med)
            g[:, 1:] = np.abs(np.diff(med, axis=1)); g[1:, :] = np.maximum(g[1:, :], np.abs(np.diff(med, axis=0)))
            e = g > 8
            for _ in range(2):
                e = e | np.roll(e, 1, 0) | np.roll(e, -1, 0) | np.roll(e, 1, 1) | np.roll(e, -1, 1)
            hot = hot * (~e)
    else:
        p, m, q = buf
        s = np.minimum(np.abs(m - p), np.abs(m - q)) - np.abs(q - p)
        hot = (s >= a.thr).astype(np.float32)
    share = hot[: ty * T, : tx * T].reshape(ty, T, tx, T).mean(axis=(1, 3))
    noise.append(float(np.percentile(s, 99.0)))
    sh = shot_of[c]
    inmask = any(lo <= c <= hi for lo, hi in masks)
    tgt = masked if inmask else hits
    for iy, ix in zip(*np.nonzero(share > 0)):
        k = (sh, int(iy), int(ix))
        v = float(share[iy, ix])
        tgt.setdefault(k, []).append((v, c))
        if not inmask:
            score[k] = score.get(k, 0.0) + v
proc.wait()
frames_total = f + 1
# clusters: flood fill of tiles with score above a floor, per shot
def clusters(sc):
    out = []
    by_shot = {}
    for (sh, iy, ix), v in sc.items():
        by_shot.setdefault(sh, {})[(iy, ix)] = v
    for sh, tiles in by_shot.items():
        floor = 0.05
        seen = set()
        for k0, v0 in sorted(tiles.items(), key=lambda kv: -kv[1]):
            if k0 in seen or v0 < floor:
                continue
            stack, members = [k0], []
            seen.add(k0)
            while stack:
                k = stack.pop(); members.append(k)
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        kk = (k[0] + dy, k[1] + dx)
                        if kk in tiles and kk not in seen and tiles[kk] >= floor:
                            seen.add(kk); stack.append(kk)
            tot = sum(tiles[k] for k in members)
            out.append((tot, sh, members))
    return sorted(out, key=lambda x: -x[0])
cl = clusters(score)
pick, per = [], {}
for tot, sh, mem in cl:
    if per.get(sh, 0) >= a.per_shot:
        continue
    per[sh] = per.get(sh, 0) + 1
    pick.append((tot, sh, mem))
    if len(pick) >= a.top:
        break
lines = [f"video {a.mp4} {W}x{H}, {frames_total} frames; thr s >= {a.thr} (luma); tile {T}px; frames next to the 16 cuts skipped; masks {masks}",
         f"noise: 99th percentile of s per frame, median {np.median(noise):.1f}, 95th pct {np.percentile(noise, 95):.1f}, max {max(noise):.1f}",
         f"clusters found: {len(cl)} (tile score >= 0.05); top {len(pick)} with max {a.per_shot} per shot:"]
def grab(frame):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", a.mp4, "-vf", f"select=eq(n\\,{frame})", "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
    return Image.frombytes("RGB", (W, H), r.stdout)
for i, (tot, sh, mem) in enumerate(pick, 1):
    ys = [m[0] for m in mem]; xs = [m[1] for m in mem]
    best = max((v, fr) for m in mem for v, fr in hits.get((sh, m[0], m[1]), []))
    nfr = len({fr for m in mem for v, fr in hits.get((sh, m[0], m[1]), []) if v >= 0.05})
    fr = best[1]
    x0, x1, y0, y1 = min(xs) * T, (max(xs) + 1) * T, min(ys) * T, (max(ys) + 1) * T
    # crop centred on the hottest tile of the cluster (summed over the shot), 96 px (v2: the whole cluster was too large)
    hm = max(mem, key=lambda m: score.get((sh, m[0], m[1]), 0.0))
    cx, cy = hm[1] * T + T // 2, hm[0] * T + T // 2
    bw = bh = 96
    bx0, by0 = max(0, cx - bw // 2), max(0, cy - bh // 2)
    box = (bx0, by0, min(W, bx0 + bw), min(H, by0 + bh))
    tiles = [grab(fr + d).crop(box) for d in (-1, 0, 1)]
    strip = Image.new("RGB", (3 * (box[2] - box[0]) + 8, box[3] - box[1]), (255, 0, 255))
    for j, im in enumerate(tiles):
        strip.paste(im, (j * (box[2] - box[0] + 4), 0))
    name = f"crop_{i:02d}_{sh}_f{fr}"
    strip.save(f"{a.out}/{name}.png")
    strip.resize((strip.width * 3, strip.height * 3), Image.NEAREST).save(f"{a.out}/{name}_x3.png")
    s0 = next(s for s in seqs if s["id"] == sh)
    lines.append(f"    hottest tile centre ({cx}; {cy}) px = ({2 * cx}; {2 * cy}) in 1080 space; crop box {box}")
    lines.append(f"{i:2d}. {sh} global f{fr} (shot-local f{fr - s0['from']}, t {fr / 30:.3f} s) | area x {x0}-{x1} y {y0}-{y1} px ({W}x{H}; x2 = 1080 space) | "
                 f"score {tot:.2f}, peak share {best[0]:.2f}, frames >= 0.05: {nfr} | {name}.png")
lines.append("masked windows (scored separately, top 5 tiles):")
ms = {}
for k, v in masked.items():
    ms[k] = sum(x for x, _ in v)
for k, v in sorted(ms.items(), key=lambda kv: -kv[1])[:5]:
    lines.append(f"   {k[0]} tile y {k[1] * T} x {k[2] * T}: score {v:.2f}, frames {sorted({fr for _, fr in masked[k]})[:6]}")
open(f"{a.out}/flicker_scan.txt", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("\n".join(lines))
