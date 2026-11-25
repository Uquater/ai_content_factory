"""2026-11-003 Episode 2, full episode S01–S12 (draft): voice-over timing → episode plan, then the sound mix.

Step `plan`:
  - reads the 13 owner VO takes (N01 D01 N02 N03 P01 D02 N04 D03 N05 N06 D04 N07 N08) from vo_raw (never written);
  - the approved pilot v3 block (S03–S06: N02, N03, P01, D02, the toa switch-on, the "Klik") is copied unchanged from
    studio/src/ep003/pilot003-plan-v3.json and shifted by OFF, a whole number of frames, so every pilot frame is
    rendered at exactly the same pilot time;
  - the other segments get editorial gaps (speech is never edited); multi-sentence takes are split into lines at their
    own pauses (N01 → L1/L2/L3, N05 → L12/L13, N07 → L16/L17/L18);
  - the three knocks sit in their own gap after L15 (S10 opens on the first knock), then N07 names them;
  - writes studio/src/ep003/episode003-plan.json.
Step `mix` (after `plan` and the picture's beats, tools/e003_beats.ts): VO stem + SFX (config scripts/ep003_pilot_sfx.json
  for the pilot kinds; the vibration and knock variants below) + master. Refuses to overwrite.

usage:
  python scripts/ep003_episode_audio.py plan
  python scripts/ep003_episode_audio.py mix --name <name>
"""
import argparse
import csv
import hashlib
import json
import math
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402  (helpers: speech, lufs, stats, render_cue, pcm_np, ...)

ROOT = PA.ROOT
UNIT = PA.UNIT
VO_DIR = ROOT / f"_media/{UNIT}/audio/vo_raw"
PILOT_PLAN = ROOT / "studio/src/ep003/pilot003-plan-v3.json"
PLAN_OUT = ROOT / "studio/src/ep003/episode003-plan.json"
FPS = 30
PILOT_FRAMES = 627  # pilot v3 (20.915 s → 627 frames); S07 starts on the frame after its last one
SEG = {  # segment: (who, lines, text per line)
    "N01": ("n", ["L1", "L2", "L3"]), "D01": ("adik", ["L4"]),
    "N04": ("n", ["L10"]), "D03": ("adik", ["L11"]), "N05": ("n", ["L12", "L13"]), "N06": ("msg", ["L14"]),
    "D04": ("adik", ["L15"]), "N07": ("n", ["L16", "L17", "L18"]), "N08": ("n", ["L19"]),
}
TEXT = {
    "L1": "Pengeras suara itu masih memakai suaramu.", "L2": "Kamu memilih tetap di dalam.", "L3": "Tapi pintu belakang belum dikunci.",
    "L4": "“Kak, jangan nyalain lampu…”",
    "L10": "Lubang angin itu menghadap gang.", "L11": "“Dia lihat dari belakang juga?”", "L12": "Kamu tidak bisa memastikannya.",
    "L13": "Ponselmu bergetar. Pesan dari petugas keamanan.", "L14": "“Saya sudah di depan rumah tujuh. Buka pintunya.”",
    "L15": "“Itu Pak satpam, kan?”", "L16": "Sebelum kamu sempat menjawab, terdengar tiga ketukan.", "L17": "Dari pintu belakang.",
    "L18": "Pintu yang baru saja kamu kunci.",
    "L19": "Kamu akan mengintip ke arah pintu depan untuk memastikan siapa di sana, atau tetap diam bersama adikmu?",
}
# burst groups per line (bursts at pauses >= 0.12 s, measured 2026-11-18): N01 3, N05 3, N07 4
GROUPS = {"N01": [[0], [1], [2]], "N05": [[0], [1, 2]], "N07": [[0, 1], [2], [3]]}
KNOCK_GAP = 0.9  # s between knocks: Three_slow #3 single-knock grains (its own spacing 1.9 s), re-spaced; see mix
# draft v2 (owner 2026-11-18, D-043): the Episode 1 choice recap before S01 (freeze, the "tetap di dalam" card clicked,
# both cards fade out together, then S01 moves and N01 starts); the knocks tightened: the first one right after D04, as
# if cutting Uq off, and N07 close behind the third; S10 ends on "Dari pintu belakang" (L17)
RECAP = 2.1  # s: cards on the freeze 0–0.7, click at 0.7, both fade 1.75–2.1
RECAP_CLICK, RECAP_OUT = 0.7, 1.75
KNOCK_AFTER_D04, KNOCK_GAP_V2, N07_AFTER_KNOCK = 0.1, 0.75, 0.35
# final v1 (owner 2026-11-18, D-044): the two bass hits come AFTER the narrator has finished L19 (its tail is below
# -60 dBFS 0.03 s after the detected end): the first 0.25 s after, the second 0.7 s later and longer; the video runs on
# until the second hit's tail has died away (no black tail: removed, as in Episode 1)
BASS_AFTER_L19, BASS_GAP, END_AFTER_L19 = 0.25, 0.7, 3.75


def q(x):
    """round UP to a whole frame"""
    return math.ceil(x * FPS - 1e-6) / FPS


def files():
    out = {}
    for k in ["N01", "D01", "N02", "N03", "P01", "D02", "N04", "D03", "N05", "N06", "D04", "N07", "N08"]:
        p = VO_DIR / f"{UNIT}_vo_{k}_take01.mp3"
        if not p.exists():
            sys.exit(f"VO missing: {p}")
        out[k] = p
    return out


def cmd_plan(_a):
    F = files()
    pilot = json.loads(PILOT_PLAN.read_text(encoding="utf-8"))
    lines, place, bursts = {}, {}, {}

    def put(seg, at_speech):
        """place a segment so its first speech starts at `at_speech`; split into lines by its bursts"""
        sp, _d = PA.speech(F[seg], min_sil=0.12)
        a0 = sp[0][0]
        place[seg] = at_speech - a0
        who, ids = SEG[seg]
        groups = GROUPS.get(seg, [list(range(len(sp)))])
        if max(i for g in groups for i in g) >= len(sp):
            sys.exit(f"{seg}: expected more speech bursts than found ({len(sp)}); check the take")
        if seg in GROUPS and len(sp) != sum(len(g) for g in groups):
            sys.exit(f"{seg}: found {len(sp)} bursts, expected {sum(len(g) for g in groups)}; check the take")
        for lid, g in zip(ids, groups):
            bs = [(place[seg] + sp[i][0], place[seg] + sp[i][1]) for i in g]
            lines[lid] = (bs[0][0], bs[-1][1], who, seg)
            bursts[lid] = [(round(x, 3), round(y, 3)) for x, y in bs]
        return lines[ids[-1]][1]

    e = put("N01", RECAP + 0.3)  # v2: after the recap cards are gone
    e = put("D01", e + 0.45)
    off = q(e + 0.05)  # S03 (pilot time 0) starts here, a whole frame
    for l in pilot["lines"]:
        lines[l["id"]] = (off + l["start"], off + l["end"], l["who"], l["seg"])
        bursts[l["id"]] = [(round(off + x, 3), round(off + y, 3)) for x, y in l["bursts"]]
    pre = {l["id"]: round(off + l["pre"], 3) for l in pilot["lines"] if "pre" in l}
    for k, v in pilot["place"].items():
        place[k] = off + v
    pend = off + PILOT_FRAMES / FPS
    e = put("N04", pend + 0.35)
    e = put("D03", e + 0.45)
    e = put("N05", e + 0.5)
    e = put("N06", e + 0.45)
    e = put("D04", e + 0.4)
    k1 = q(e + KNOCK_AFTER_D04)
    knocks = [round(k1 + i * KNOCK_GAP_V2, 3) for i in range(3)]
    e = put("N07", knocks[-1] + N07_AFTER_KNOCK)
    l18_end = e
    e = put("N08", l18_end + 1.2)
    bass = [round(e + BASS_AFTER_L19, 3), round(e + BASS_AFTER_L19 + BASS_GAP, 3)]
    end = round(e + END_AFTER_L19, 3)
    L = {k: v for k, v in lines.items()}
    s02 = q(L["L3"][0] - 0.25)
    s08 = q(L["L13"][0] - 0.3)
    s09 = q(L["L14"][1] - 0.6)
    s11 = q(L["L17"][0] - 0.05)  # v2: cut to the reverse on "Dari pintu belakang"
    s12 = q(L["L18"][1] + 0.55)
    order = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19"]
    text = {**TEXT, **{l["id"]: l["text"] for l in pilot["lines"]}}
    plan = {
        "unit": UNIT, "kind": "episode draft S01–S12", "timing": "audio",
        "note": "Line times from the owner's VO takes (silence detection -45 dB, bursts at pauses >= 0.12 s); gaps are editorial. "
                "S03–S06 = pilot v3 shifted by 'off' (whole frames). 'knocks' = the three knock peaks. scripts/ep003_episode_audio.py plan.",
        "lines": [{"id": i, "who": L[i][2], "seg": L[i][3], "text": text[i], "start": round(L[i][0], 3), "end": round(L[i][1], 3), **({"pre": pre[i]} if i in pre else {}), "bursts": bursts[i]} for i in order],
        "place": {k: round(v, 3) for k, v in place.items()},
        "off": round(off, 6), "offFrames": round(off * FPS), "pilotFrames": PILOT_FRAMES,
        "toaOpen": round(off + pilot["toaOpen"], 3), "klik": round(off + pilot["klik"], 3),
        "knocks": knocks, "cards": round(L["L19"][0] + 0.3, 3), "bass": bass, "vib": [round(s08, 3), round(s08 + 1.0, 3)],
        "recap": RECAP, "recapClick": RECAP_CLICK, "recapOut": RECAP_OUT,
        "shots": {"s00": 0, "s01": RECAP, "s02": s02, "s03": off, "s07": round(pend, 6), "s08": s08, "s09": s09, "s10": k1, "s11": s11, "s12": s12},
        "end": end, "frames": round(end * FPS),
    }
    PLAN_OUT.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", PLAN_OUT)
    for l in plan["lines"]:
        print(f"  {l['id']:4s} {l['start']:6.2f}–{l['end']:6.2f}  {l['who']:4s} {l['text'][:50]}")
    print("  off", round(off, 3), "frames", plan["offFrames"], "| knocks", knocks, "| cards", plan["cards"], "| end", end, f"({plan['frames']} frames)")
    print("  shots", plan["shots"])


# ---------------------------------------------------------------------------------------------- mix
VIB_FILE = "A_smartphone_vibrati_#2.mp3"  # two clean 0.52 s buzzes 0.99 s apart (signal analysis 2026-11-18)
KNOCK_FILE = "Three_slow,_delibera_#3.mp3"  # the only variant with exactly three single onsets (0.05, 1.97, 3.895 s)
KNOCK_ONSETS = [0.05, 1.97, 3.895]
# draft v2: the recap card click and the two bass hits under the end cards (signal analysis 2026-11-18)
CLICK_FILE = "1 Click Mouse.mp3"  # 94 % of its energy above 2 kHz (the bolt #3 centres ~480 Hz): clearly a UI click;
#   the file holds press + release (onsets 0.04 / 0.18 s): only the loudest transient is used
BASS_ATTACK = "sfx-19_kick-boom_low_impact.wav"  # the only hit candidate with energy at 200–500 Hz (phone speakers)
BASS_TAIL = "Sub Drop 2.mp3"  # 80–200 Hz, 2.3 s decay: the longer "dooom" under the second attack
BASS_SECOND = 0.7  # s after the first hit


def picture_beats():
    studio = ROOT / "studio"
    r = PA.run(["npx", "esbuild", "tools/e003_check.ts", "--bundle", "--platform=node", "--log-level=warning", "--outfile=out/e003_check.cjs"], cwd=studio, shell=True)
    if r.returncode:
        sys.exit(r.stderr)
    out = PA.run(["node", "out/e003_check.cjs", "--json"], cwd=studio).stdout
    return json.loads(out[out.index("{"):])


def write_f32(x, path):
    import numpy as np
    raw = np.asarray(x, np.float32).tobytes()
    r = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", str(PA.SR), "-ac", "1", "-i", "-", "-c:a", "pcm_f32le", str(path)], input=raw, capture_output=True)
    if r.returncode:
        sys.exit(r.stderr.decode(errors="replace"))


def ambience_loop(src, end, seams, work):
    """the 30 s bed laid end to end with 1.2 s equal-power crossfades at `seams` (episode s, chosen inside speech so a
    seam never sits in a quiet gap); each copy starts 3 s further into the file so no stretch repeats exactly"""
    import numpy as np
    x = PA.pcm_np(src)
    n = int(end * PA.SR)
    out = np.zeros(n)
    xf = int(1.2 * PA.SR)
    starts = [0] + [int(s * PA.SR) for s in seams]
    for i, a in enumerate(starts):
        b = starts[i + 1] + xf if i + 1 < len(starts) else n
        off = int((3.0 * i) * PA.SR) % max(1, len(x) - (b - a) - 1)
        seg = x[off:off + (b - a)]
        if len(seg) < b - a:
            sys.exit("ambience file too short for a segment; add a seam")
        w = np.ones(b - a)
        if i > 0:
            w[:xf] = np.sin(np.linspace(0, np.pi / 2, xf))
        if i + 1 < len(starts):
            w[-xf:] = np.cos(np.linspace(0, np.pi / 2, xf))
        out[a:b] += seg * w
    path = work / "bed_loop.wav"
    write_f32(out, path)
    return path


def cmd_mix(a):
    import numpy as np
    cfg = json.loads(Path(a.config).read_text(encoding="utf-8"))
    plan = json.loads(PLAN_OUT.read_text(encoding="utf-8"))
    B = picture_beats()
    if B["frames"] != plan["frames"]:
        sys.exit("picture and plan disagree (rebuild)")
    F = files()
    out_dir = ROOT / f"_media/{UNIT}/audio/episode"
    # (v2 mixes go to the same folder under a new name; the script refuses to overwrite)
    work = out_dir / "work"
    work.mkdir(parents=True, exist_ok=True)
    OUT, PRE, VO, SHEET = (out_dir / f"{a.name}_{x}" for x in ("mix.wav", "premaster.wav", "vo_stem.wav", "cue_sheet.csv"))
    for p in (OUT, PRE, VO, SHEET):
        if p.exists():
            sys.exit(f"REFUSED (exists): {p}")
    END = plan["frames"] / FPS + 0.05
    L = {l["id"]: l for l in plan["lines"]}
    who_of = {"N01": "n", "D01": "adik", "N02": "n", "N03": "n", "P01": "toa", "D02": "adik", "N04": "n", "D03": "adik", "N05": "n", "N06": "n", "D04": "adik", "N07": "n", "N08": "n"}
    # ---- VO stem: the v3 chains (toa chain on P01, de-plosive high-pass on adik), each segment to its loudness target
    inputs, fl, names, rows = [], [], [], []
    for i, (k, who) in enumerate(who_of.items()):
        sp, d = PA.speech(F[k])
        a0, b0 = max(0.0, sp[0][0] - 0.12), min(d, sp[-1][1] + 0.12)
        chain = f"atrim={a0}:{b0},asetpts=PTS-STARTPTS,aresample={PA.SR}" + (",apad=pad_dur=0.6," + PA.TOA_CHAIN if who == "toa" else ("," + PA.DEPLOSIVE if who == "adik" else ""))
        seg = PA.render_cue(F[k], chain, work, f"vo_{k}")
        li, _ = PA.lufs(seg)
        g = PA.TARGET[who] - li
        at = plan["place"][k] + a0
        inputs += ["-i", str(seg)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}:all=1[v{i}]")
        names.append(f"v{i}")
        rows.append({"cue": f"VO {k}", "time_s": round(at, 3), "file": F[k].name, "variant": "take01", "align": "plan place", "purpose": "/".join(SEG.get(k, ("", ["(pilot)"]))[1]), "processing": chain, "gain_dB": round(g, 1), "peak_rel_vo_dB": "", "licence": "ElevenLabs (arahan pemilik: paket Pro diasumsikan, D-035)", "status": "pemilik mendengar", "md5": hashlib.md5(F[k].read_bytes()).hexdigest()})
    fl.append("".join(f"[{n}]" for n in names) + f"amix=inputs={len(names)}:normalize=0:duration=longest,apad=whole_dur={END},atrim=0:{END}[vo]")
    r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[vo]", "-ac", "1", "-ar", str(PA.SR), "-c:a", "pcm_f32le", str(VO)])
    if r.returncode:
        sys.exit(r.stderr)
    v_peak, v_rms = PA.stats(VO)
    anchor = v_rms + PA.ANCHOR_PEAK_OVER_RMS
    print(f"VO stem: peak {v_peak:.1f} dB, RMS {v_rms:.1f} dB; level anchor {anchor:.1f} dB")
    var, lev = cfg["variasi"], cfg.get("level_db", {})
    src = {k: PA.SFX_SRC / PA.KIND_FILE[k].format(n=int(var[k])) for k in PA.KIND_FILE}
    for p in list(src.values()) + [PA.SFX_SRC / VIB_FILE, PA.SFX_SRC / KNOCK_FILE]:
        if any(f in p.name for f in PA.FORBIDDEN):
            sys.exit(f"REFUSED: {p.name} needs the owner's approval first")
        if not p.exists():
            sys.exit(f"missing SFX {p}")
    cues = []  # (kind, source, align point in the processed cue, episode time of that point, filter, rule, extra dB, purpose, align text)
    # night bed: the loop (seams inside speech), HPF 80 + shelf, level in the phone band
    seams = [round((L[x]["start"] + L[x]["end"]) / 2, 2) for x in ("L6", "L13", "L18")]  # inside speech, every segment < 30 s
    bed = ambience_loop(PA.render_cue(src["malam"], "highpass=f=80," + PA.BED_EQ, work, "bed_src"), END, seams, work)
    cues.append(("malam", bed, 0.0, 0.0, f"afade=t=in:d=0.4,afade=t=out:st={END - 0.6}:d=0.6", "bed", lev.get("malam", 0), f"suasana malam #{var['malam']} (loop, sambungan {', '.join(str(x) for x in seams)} s di dalam ucapan)", "mulai"))
    # footsteps from the picture (every heel strike of both characters; adik softer)
    xs = PA.pcm_np(src["langkah"])
    ons = PA.onsets_of(xs)
    for j, stp in enumerate(B["steps"]):
        if stp["t"] < 0.05:
            continue
        o = ons[(j * 3) % len(ons)]
        g0 = max(0.0, o - 0.03)
        pk = PA.peak_time(xs, g0, o + 0.12)
        filt = f"atrim={g0}:{o + 0.32},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={o + 0.32 - g0 - 0.12}:d=0.12"
        cues.append(("langkah", src["langkah"], pk - g0, stp["t"], filt, "step", lev.get("langkah", 0) - (4 if stp["who"] == "adik" else 0), f"langkah {stp['who']} {stp['foot']} ({stp['shot']})", f"puncak grain {o:.2f} s → tapak kaki"))
    # torch tap (pilot), bolt on the audible Klik (pilot), toa switch-on over the N03 tail (pilot), toa hum (pilot)
    xt = PA.pcm_np(src["ketuk"])
    pt = PA.peak_time(xt)
    cues.append(("ketuk", src["ketuk"], pt, B["torchOn"], "highpass=f=150", "tap", lev.get("ketuk", 0), "ketukan layar: senter menyala (S03)", "puncak → senter menyala"))
    xb = PA.pcm_np(src["gerendel"])
    pb = PA.peak_time(xb)
    b0, b1 = max(0.0, pb - PA.BOLT_PRE), min(len(xb) / PA.SR, pb + PA.BOLT_POST)
    cues.append(("gerendel", src["gerendel"], pb - b0, plan["klik"], f"atrim={b0}:{b1},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b1 - b0 - 0.3}:d=0.3,highpass=f=120", "shot", lev.get("gerendel", 0), "gerendel (S04), puncak di 'Klik'", "puncak → 'Klik'"))
    o_len = round(plan["place"]["P01"] - 0.05 - plan["toaOpen"], 3)
    cues.append(("toa_buka", src["toa_buka"], 0.0, plan["toaOpen"], f"atrim=0:{o_len},asetpts=PTS-STARTPTS,afade=t=out:st={o_len - 0.3}:d=0.3,highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16", "open", lev.get("toa_buka", 0), "pembuka toa (ekor N03, S05)", "awal file → toaOpen"))
    p0 = L["L8"].get("pre", L["L8"]["start"])
    cues.append(("syn", PA.SYN / "toa_hum.wav", 0.0, p0 - 0.5, f"atrim=0:{L['L8']['end'] - p0 + 1.6},lowpass=f=2600,afade=t=in:d=0.35,afade=t=out:st={L['L8']['end'] - p0 + 1.0}:d=0.6", "bed", 2, "dengung pembawa toa (sintesis Ep 1)", "mulai"))
    # the phone buzzing twice (S08): Smartphone #2, its buzz onsets 0.04 and 1.03 s on plan "vib"
    xv = PA.pcm_np(PA.SFX_SRC / VIB_FILE)
    v_on = PA.onsets_of(xv)[0] if PA.onsets_of(xv) else 0.04
    cues.append(("getar", PA.SFX_SRC / VIB_FILE, v_on, plan["vib"][0], "atrim=0:1.65,asetpts=PTS-STARTPTS,afade=t=out:st=1.35:d=0.3,highpass=f=90", "vib", 0, "ponsel bergetar dua kali (S08)", f"onset {v_on:.2f} s → vib[0]"))
    # three knocks: single-knock grains of Three_slow #3, each to the same peak, on plan "knocks" (S10); from outside the
    # back door: a little muffled, a short hallway reflection
    xk = PA.pcm_np(PA.SFX_SRC / KNOCK_FILE)
    for i, (o, at) in enumerate(zip(KNOCK_ONSETS, plan["knocks"])):
        g0 = max(0.0, o - 0.02)
        pk = PA.peak_time(xk, g0, o + 0.1)
        filt = f"atrim={g0}:{o + 0.62},asetpts=PTS-STARTPTS,afade=t=out:st=0.37:d=0.25,lowpass=f=2800,aecho=0.8:0.6:45|110:0.25|0.12"
        cues.append(("ketukan", PA.SFX_SRC / KNOCK_FILE, pk - g0, at, filt, "knock", 0, f"ketukan {i + 1} dari 3 (S10)", f"grain {o:.2f} s → knocks[{i}]"))
    # draft v2: the recap click (on the card click) and the two bass hits (on the end cards' entry)
    if plan.get("recap"):
        xc = PA.pcm_np(PA.SFX_SRC / CLICK_FILE)
        pc = PA.peak_time(xc)
        c0 = max(0.0, pc - 0.015)
        cues.append(("klik_ui", PA.SFX_SRC / CLICK_FILE, pc - c0, plan["recapClick"], f"atrim={c0}:{pc + 0.06},asetpts=PTS-STARTPTS,afade=t=out:st={pc + 0.06 - c0 - 0.03}:d=0.03", "click", 0, "klik kartu 'tetap di dalam' (recap)", f"puncak {pc:.3f} s → klik"))
        # hit 1: the kick-boom with gentle saturation (harmonics a phone speaker can play); hit 2: the same attack over the
        # sub drop tail, saturated, longer
        sat = "volume=6dB,asoftclip=type=tanh,volume=-6dB"
        h1 = PA.render_cue(PA.SFX_SRC / BASS_ATTACK, f"atrim=0:1.4,asetpts=PTS-STARTPTS,{sat},afade=t=out:st=0.7:d=0.7", work, "bass1")
        tail = PA.render_cue(PA.SFX_SRC / BASS_TAIL, f"atrim=0:2.6,asetpts=PTS-STARTPTS,{sat},afade=t=out:st=1.6:d=1.0", work, "bass2_tail")
        h2 = work / "bass2_mix.wav"
        if not h2.exists():
            r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(h1), "-i", str(tail), "-filter_complex", "[0:a]volume=0dB[a];[1:a]volume=-2dB[b];[a][b]amix=inputs=2:normalize=0:duration=longest", "-c:a", "pcm_f32le", str(h2)])
            if r.returncode:
                sys.exit(r.stderr)
        pk1 = PA.peak_time(PA.pcm_np(h1), 0, 0.4)
        b1, b2 = plan.get("bass", [plan["cards"] + 0.05, plan["cards"] + 0.05 + BASS_SECOND])
        cues.append(("bass1", h1, pk1, b1, "highpass=f=35", "bass", 0, "dentuman 1 'doom' (sesudah L19)", f"puncak → {b1:.3f} s ({BASS_ATTACK})"))
        cues.append(("bass2", h2, pk1, b2, "highpass=f=30", "bass", 1, "dentuman 2 'dooom' (lebih panjang)", f"puncak → {b2:.3f} s ({BASS_ATTACK} + {BASS_TAIL})"))
    rule = {"bed": ("rms", -24), "step": ("peak", -20), "tap": ("peak", -24), "shot": ("peak", -8), "open": ("peak", -12), "vib": ("peak", -14), "knock": ("peak", -9), "click": ("peak", -12), "bass": ("peak", -7)}
    inputs, fl, names = ["-i", str(VO)], [f"[0:a]aresample={PA.SR}[vo]"], []
    for i, (kind, sp_, align_f, at, filt, lvl, ex, purpose, what) in enumerate(cues, start=1):
        proc = PA.render_cue(sp_, filt, work, f"sfx_{kind}")
        start = at - align_f
        if start < 0:
            proc = PA.render_cue(proc, f"atrim={-start}", work, f"sfx_{kind}_cut")
            start = 0.0
        c_peak, c_rms = PA.stats(proc)
        ref, off = rule[lvl]
        g = ((v_rms + off) - c_rms if ref == "rms" else (anchor + off) - c_peak) + ex
        if kind == "malam":
            hp = f"highpass=f={PA.BED_PHONE_HP},highpass=f={PA.BED_PHONE_HP}"
            g = (PA.rms_af(VO, hp) + PA.BED_PHONE_REL) - PA.rms_af(proc, hp) + ex
        inputs += ["-i", str(proc)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(start * 1000))}:all=1[c{i}]")
        names.append(f"c{i}")
        name = Path(sp_).name
        vn = re.search(r"#(\d+)", name)
        if kind == "bass2":
            name = f"{BASS_ATTACK} + {BASS_TAIL}"
        elif kind == "bass1":
            name = BASS_ATTACK
        rows.append({"cue": i, "time_s": round(at, 3), "file": name if kind != "malam" else src["malam"].name, "variant": f"#{vn.group(1)}" if vn else (f"#{var['malam']}" if kind == "malam" else "-"), "align": what, "purpose": purpose, "processing": filt, "gain_dB": round(g, 1), "peak_rel_vo_dB": round(c_peak + g - anchor, 1), "licence": PA.OWNER_SFX if kind != "syn" else "disintesis Claude untuk Ep 1: tanpa hak pihak ketiga", "status": "pemilik mendengar", "md5": hashlib.md5(Path(sp_ if kind not in ("malam", "bass1", "bass2") else (src["malam"] if kind == "malam" else PA.SFX_SRC / BASS_ATTACK)).read_bytes()).hexdigest()})
    fl.append("[vo]" + "".join(f"[{n}]" for n in names) + f"amix=inputs={len(names) + 1}:normalize=0:duration=first,atrim=0:{END}[pre]")
    r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[pre]", "-ac", "1", "-ar", str(PA.SR), "-c:a", "pcm_f32le", str(PRE)])
    if r.returncode:
        sys.exit(r.stderr)
    stp = "pan=stereo|c0=c0|c1=c0"
    i0, _ = PA.lufs(PRE, stp)
    gain, ceil = -14.0 - i0, -2.5
    probe = work / "tp_probe.m4a"
    for it in range(10):
        lim = 10 ** (ceil / 20)
        r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(PRE), "-af", f"{stp},volume={gain:.2f}dB,aresample={PA.SR * 4},alimiter=limit={lim:.4f}:attack=2:release=60:level=false,aresample={PA.SR}", "-c:a", "pcm_s24le", str(OUT)])
        if r.returncode:
            sys.exit(r.stderr)
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(OUT), "-c:a", "aac", "-b:a", "128k", str(probe)])
        i1, tp_wav = PA.true_peak(OUT)
        _, tp_aac = PA.true_peak(probe)
        print(f"  master pass {it}: gain {gain:+.2f} dB, ceiling {ceil:.1f} → {i1:.2f} LUFS, TP wav {tp_wav:.2f} / aac {tp_aac:.2f} dBTP")
        ok_l, ok_tp = abs(i1 + 14.0) <= 0.2, tp_aac <= -1.6
        if ok_l and ok_tp:
            break
        if not ok_tp:
            ceil -= 0.3
        if not ok_l:
            gain += -14.0 - i1
    else:
        sys.exit("master did not converge")
    gmax, gt, gsec, lag = PA.limiter_gr(PRE, OUT, gain)
    print(f"  limiter (latency {lag} samples removed): max GR {gmax:.1f} dB at {gt:.3f} s; {gsec:.2f} s above 1 dB")
    with open(SHEET, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["cue", "time_s", "file", "variant", "align", "purpose", "processing", "gain_dB", "peak_rel_vo_dB", "licence", "status", "md5"])
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {OUT}\n  cue sheet {SHEET}")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("step", choices=["plan", "mix"])
    ap.add_argument("--name", default=f"{UNIT}_episode_draft_v1")
    ap.add_argument("--config", default=str(ROOT / "scripts/ep003_pilot_sfx.json"))
    a = ap.parse_args()
    if a.step == "plan":
        cmd_plan(a)
    else:
        cmd_mix(a)


if __name__ == "__main__":
    main()
