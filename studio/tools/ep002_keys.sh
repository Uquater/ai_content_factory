#!/usr/bin/env bash
# Render key stills of the 2026-11-002 animatic (review only) and tile them into one sheet.
# usage (from studio/): bash tools/ep002_keys.sh <tag> <shot ids...>   e.g. bash tools/ep002_keys.sh k3 a01 a02
# Frames = the middle of each shot in src/ep002/plan-2026-11-002.json (or "<id>@<frame>" to pick one). Half scale.
set -u
tag="$1"; shift
mkdir -p out/ep
for spec in "$@"; do
  id="${spec%@*}"
  if [[ "$spec" == *@* ]]; then f="${spec#*@}"; else
    f=$(python -c "import json,sys;P=json.load(open('src/ep002/plan-2026-11-002.json',encoding='utf-8'));s=[x for x in P['shots'] if x['id']==sys.argv[1]][0];print(round((s['start']+s['end'])/2*30))" "$id")
  fi
  npx remotion still src/index.ts Ep002Animatic "out/ep/${tag}_${id}_${f}.png" --frame="$f" --gl=angle --timeout=240000 --scale=0.5 >/dev/null 2>&1 || echo "FAIL $spec"
done
python - "$tag" <<'PY'
import sys, glob, os
from PIL import Image
tag = sys.argv[1]
fs = sorted(glob.glob(f"out/ep/{tag}_*.png"), key=os.path.getmtime)
fs = [f for f in fs if not f.endswith("_sheet.png")]
ims = [Image.open(f).resize((216, 384)) for f in fs]
cols = 8
rows = (len(ims) + cols - 1) // cols
c = Image.new("RGB", (216 * cols, 384 * rows))
for k, im in enumerate(ims):
    c.paste(im, ((k % cols) * 216, (k // cols) * 384))
c.save(f"out/ep/{tag}_sheet.png")
print(f"out/ep/{tag}_sheet.png", [os.path.basename(f) for f in fs])
PY
