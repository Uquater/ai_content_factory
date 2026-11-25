"""2026-11-004 Episode 3: DRAFT episode timeline from the MEASURED length of the owner's VO takes (D-052). No render, no mix.

Everything is a pure computation from (a) the speech span of each take measured on the decoded samples (5 ms RMS
envelope, first/last window above -45 dBFS, the same method that gave T = 6.650 s), (b) the pilot v3 anchors that the
owner accepted unchanged (S01 0-2.1, S02 2.1-9.2, cards 7.15/7.35/click 7.85/out 8.85/gone 9.20, L3 9.31, Blok B
relative offsets) and (c) the EDITORIAL GAPS of storyboard v0.1 (content.md 2026-11-004 §11.2) kept as they are.
Reads vo_raw (never written). Writes studio/src/ep004/episode004-plan-draft.json (+ prints the table).

usage:  python scripts/ep004_episode_plan.py
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
VO = ROOT / "_media/2026-11-004/audio/vo_raw"
OUT = ROOT / "studio/src/ep004/episode004-plan-draft.json"
SR = 44100


def span(seg):
    """lead, speech span, trail, file length (s) of a take: 5 ms RMS windows above -45 dBFS"""
    f = VO / f"2026-11-004_vo_{seg}_take01.mp3"
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True)
    x = np.frombuffer(r.stdout, np.float32)
    w = int(0.005 * SR)
    n = len(x) // w
    e = 20 * np.log10(np.sqrt((x[: n * w].reshape(n, w) ** 2).mean(1)) + 1e-9)
    idx = np.where(e > -45)[0]
    a, b = idx[0] * 0.005, (idx[-1] + 1) * 0.005
    d = len(x) / SR
    return {"lead": round(a, 3), "span": round(b - a, 3), "trail": round(d - b, 3), "file": round(d, 3)}


M = {s: span(s) for s in ["N01", "P01", "N02", "N03", "D01", "N04", "N04a", "N04b", "N04c", "P02", "N05", "N06"]}
OLD_N04_BURSTS = [1.50, 1.13, 1.39]  # same RMS method (-45 dBFS, merge gaps < 0.12 s) on the archived single take

# ---- fixed by the accepted pilot v3 (pilot004-plan-v3.json)
S02_END = 9.200
L3_START = 9.310
L3_END = 12.310
SHIFT = 2.414
# ---- storyboard v0.1 editorial gaps (s), unchanged
GAP = dict(s03_after_l3=0.09, toa_open=0.2, open_to_speech=1.1, after_l4=1.8, vib=0.05, s05=2.0, l5_in=0.3, after_l5=0.1,
           l6_in=0.2, after_l6=0.3, s10=3.5, click_before=0.3, after_a_to_click=0.6, b_to_s11end=0.6, s12_click=0.2, c_to_s12end=0.9,
           s13_open=0.2, open_to_l9=1.0, after_l9=1.3, s14_vib=0.1, vib_to_l10=0.8, after_l10=1.1, s15_l11_in=1.8,
           doom_after_speech=0.25, cards_after_speech=0.1, stare=1.0, end_after_doom=3.25)
# ---- Blok B, relative to the start of S08a (pilot v3: S08a 1.5, LED click +0.5, D01 speech +1.806, S08 +1.5..4.7, screen on +5.7..6.4, S09 +4.7..7.1)
B = dict(s08a=1.5, led=0.5, s08_in=1.5, d01_speech=1.806, s08_end=4.7, screen=(5.7, 6.4), s09_end=7.1)


def build(n04_mode="new"):
    t = {}
    t["S01"] = (0.0, 2.1)
    t["S02"] = (2.1, S02_END)
    t["S03"] = (S02_END, round(L3_END + GAP["s03_after_l3"], 3))
    a = t["S03"][1]
    open1 = a + GAP["toa_open"]
    l4 = open1 + GAP["open_to_speech"]
    l4e = l4 + M["P01"]["span"]
    s04e = l4e + GAP["after_l4"]
    t["S04"] = (a, s04e)
    vib1 = s04e + GAP["vib"]
    t["S05"] = (s04e, s04e + GAP["s05"])
    s06 = t["S05"][1]
    l5 = s06 + GAP["l5_in"]
    l5e = l5 + M["N02"]["span"]
    t["S06"] = (s06, l5e + GAP["after_l5"])
    s07 = t["S06"][1]
    l6 = s07 + GAP["l6_in"]
    l6e = l6 + M["N03"]["span"]
    t["S07"] = (s07, l6e + GAP["after_l6"])
    tb = t["S07"][1]
    t["S08a"] = (tb, tb + B["s08a"])
    t["S08"] = (tb + B["s08_in"], tb + B["s08_end"])
    t["S09"] = (tb + B["s08_end"], tb + B["s09_end"])
    led1 = tb + B["led"]
    d01 = tb + B["d01_speech"]
    s10 = t["S09"][1]
    t["S10"] = (s10, s10 + GAP["s10"])
    s11 = t["S10"][1]
    if n04_mode == "new":
        da, db, dc = M["N04a"]["span"], M["N04b"]["span"], M["N04c"]["span"]
    else:
        da, db, dc = OLD_N04_BURSTS
    c1 = s11 + GAP["click_before"]
    na = c1 + GAP["click_before"]
    nae = na + da
    c2 = nae + GAP["after_a_to_click"]
    nb = c2 + GAP["click_before"]
    nbe = nb + db
    t["S11"] = (s11, nbe + GAP["b_to_s11end"])
    s12 = t["S11"][1]
    c3 = s12 + GAP["s12_click"]
    nc = c3 + GAP["click_before"]
    nce = nc + dc
    t["S12"] = (s12, nce + GAP["c_to_s12end"])
    s13 = t["S12"][1]
    open2 = s13 + GAP["s13_open"]
    l9 = open2 + GAP["open_to_l9"]
    l9e = l9 + M["P02"]["span"]
    t["S13"] = (s13, l9e + GAP["after_l9"])
    s14 = t["S13"][1]
    vib2 = s14 + GAP["s14_vib"]
    l10 = vib2 + GAP["vib_to_l10"]
    l10e = l10 + M["N05"]["span"]
    t["S14"] = (s14, l10e + GAP["after_l10"])
    s15 = t["S14"][1]
    l11 = s15 + GAP["s15_l11_in"]
    l11e = l11 + M["N06"]["span"]
    cards = l11e + GAP["cards_after_speech"]
    doom = l11e + GAP["doom_after_speech"]
    end = doom + GAP["end_after_doom"]
    t["S15"] = (s15, end)
    ev = {
        "L1": (3.0, 4.126), "L2": (4.482, 6.663), "cards_recap": (7.15, 9.2), "L3": (L3_START, L3_END),
        "toa_open1": open1, "L4": (l4, l4e), "vib1": vib1, "L5": (l5, l5e), "L6": (l6, l6e),
        "LED1_click": led1, "L7_D01": d01, "screen_on": (tb + B["screen"][0], tb + B["screen"][1]),
        "LED2_click": c1, "L8a": (na, nae), "LED3_click": c2, "L8b": (nb, nbe), "LED4_click": c3, "L8c": (nc, nce),
        "toa_open2": open2, "L9": (l9, l9e), "vib2": vib2, "L10": (l10, l10e), "L11": (l11, l11e),
        "lens_stare": (l11e - GAP["stare"], l11e), "final_cards": cards, "doom": doom,
    }
    return t, ev, end


t, ev, end = build("new")
t_old, ev_old, end_old = build("old")
est = 63.9 - 1.0 + SHIFT + 0.5
r = lambda v: round(v, 3)
plan = {
    "note": "DRAFT 2026-11-20 (D-052): computed from measured VO spans + pilot v3 anchors + storyboard v0.1 editorial gaps; not a mix, not a render",
    "measured": M, "old_n04_bursts": OLD_N04_BURSTS, "gaps": GAP, "blokB": B,
    "shots": {k: [r(a), r(b), r(b - a)] for k, (a, b) in t.items()},
    "events": {k: ([r(x) for x in v] if isinstance(v, tuple) else r(v)) for k, v in ev.items()},
    "total": r(end), "total_with_old_n04_gaps": r(end_old), "estimate_v3_report": round(est, 3),
    "premise_end_L3": L3_END,
}
OUT.write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")
if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    print(f"{'take':6s} {'lead':>6s} {'span':>6s} {'trail':>6s} {'file':>6s}")
    for k, v in M.items():
        print(f"{k:6s} {v['lead']:6.3f} {v['span']:6.3f} {v['trail']:6.3f} {v['file']:6.3f}")
    print("\nshot   start    end    dur")
    for k, (a, b) in t.items():
        print(f"{k:5s} {a:7.3f} {b:7.3f} {b - a:6.3f}")
    print(f"\nTOTAL measured {end:.3f} s | with old N04 burst lengths {end_old:.3f} s | report v3 estimate {est:.3f} s")
    print("N04 old file", M["N04"]["file"], "vs a+b+c", round(M["N04a"]["file"] + M["N04b"]["file"] + M["N04c"]["file"], 3),
          "| voiced old", sum(OLD_N04_BURSTS), "new", round(M["N04a"]["span"] + M["N04b"]["span"] + M["N04c"]["span"], 3))
    for k, v in plan["events"].items():
        print(f"  {k:12s} {v}")
