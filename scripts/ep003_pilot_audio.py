"""2026-11-003 pilot S03–S06 (L5–L9): voice-over timing → picture plan, then the sound mix (D-039).

Step `plan` (run first, after the owner's ElevenLabs takes exist):
  - reads N02 (L5+L6), N03 (L7), P01 (L8, toa), D02 (L9) from the VO folder (never written);
  - finds each file's speech by silence detection (ffmpeg silencedetect, -45 dB) and splits N02 into L5/L6 at its
    longest internal pause;
  - lays the segments out on the pilot timeline. Gaps are editorial (inkbeat: pauses come from editing, never from
    changing the speech): 0.6 s lead-in; L7 waits until the torch sweep (≥ 3.0 s) and the two steps fit
    (L7 start ≥ L6 start + 5.8 s); 0.65 s before the toa; 0.7 s before adik; 0.8 s tail;
  - writes studio/src/ep003/pilot003-plan.json with "timing": "audio" (the provisional file is kept once as
    pilot003-plan.provisional.json).
Step `mix` (after `plan`; the picture reads the same plan):
  - builds the VO stem (per-segment gain to a loudness target; toa chain on P01 = a loudspeaker OUTSIDE the house:
    band-limited horn, soft clip, wall-muffled, two slapbacks off the houses across the alley);
  - adds SFX at the picture's beats (tools/p003_beats.ts): torch click on/off, the bolt, a night bed (crickets
    muffled through the wall + room tone) and a faint toa hum around L8; levels against the speech as in Ep 1;
  - two-pass loudnorm to -14 LUFS / -1 dBTP; writes the cue sheet. Refuses to overwrite.

usage:
  python scripts/ep003_pilot_audio.py plan [--vo-dir DIR] [--plan-out PATH]
  python scripts/ep003_pilot_audio.py mix  [--vo-dir DIR] [--out-dir DIR] [--name NAME]
"""
import argparse
import csv
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UNIT = "2026-11-003"
VO_DIR = ROOT / f"_media/{UNIT}/audio/vo_raw"
PLAN = ROOT / "studio/src/ep003/pilot003-plan.json"
SR = 48000
SEGS = {"N02": ("n", ["L5", "L6"]), "N03": ("n", ["L7"]), "P01": ("toa", ["L8"]), "D02": ("adik", ["L9"])}
TEXT = {
    "L5": "Dapur gelap. Kamu tidak bisa melihat gerendelnya.",
    "L6": "Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan.",
    "L7": "Klik. Pintu belakang terkunci.",
    "L8": "“Dapur juga tidak kosong.”",
    "L9": "“Kak… kaca di atas pintu tadi terang.”",
}
# a loudspeaker outside the house, heard from the kitchen: horn band + presence peak + soft clip, muffled by the wall,
# two slapbacks off the houses across the alley, a little quieter than the narration (Ep 1 chain + distance)
TOA_CHAIN = ("highpass=f=380,lowpass=f=3400,equalizer=f=1800:t=q:w=1:g=6,volume=5dB,asoftclip=type=tanh,volume=-5dB,"
             "lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16")
TARGET = {"n": -20.0, "toa": -21.0, "adik": -22.5}  # LUFS per segment before the master (Ep 1: whispers ~2.5 dB under)
SFX_SRC = ROOT / "refrences/SFX"
TOA_GAP = 0.65  # L7 end → P01 (toa breath) in pilot time; `plan --toa-gap`
SYN = ROOT / "_media/2026-11-002/sfx"  # Ep 1 synthesised beds (Claude, scripts/sfx_synth.py): no third-party rights


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def duration(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).stdout.strip())


def speech(p, noise=-45, min_sil=0.18):
    """speech intervals [(a, b)] from silencedetect"""
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(p), "-af", f"silencedetect=n={noise}dB:d={min_sil}", "-f", "null", "-"]).stderr
    st = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", e)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]
    d = duration(p)
    sil = list(zip(st, en + [d] * (len(st) - len(en))))
    out, cur = [], 0.0
    for a, b in sil:
        if a > cur + 0.02:
            out.append((max(0.0, cur), a))
        cur = b
    if cur < d - 0.02:
        out.append((cur, d))
    return [(a, b) for a, b in out if b - a > 0.06], d


def lufs(p, af=""):
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(p), "-af", (af + "," if af else "") + "ebur128=peak=true", "-f", "null", "-"]).stderr
    s = e[e.rfind("Summary"):]
    return float(re.search(r"I:\s*(-?[\d.]+) LUFS", s).group(1)), float(re.search(r"Peak:\s*(-?[\d.inf]+) dBFS", s).group(1))


def voiced_fraction(p, a, b, sr=16000):
    """share of 30 ms frames above -40 dBFS in [a, b] whose autocorrelation shows a pitch (70-300 Hz) > 0.5"""
    import numpy as np
    raw = run_bytes(["ffmpeg", "-v", "error", "-ss", f"{a}", "-to", f"{b}", "-i", str(p), "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"])
    x = np.frombuffer(raw, np.float32)
    w, n, v = int(0.03 * sr), 0, 0
    for i in range(0, len(x) - w, w // 2):
        f = x[i:i + w] - x[i:i + w].mean()
        if 20 * np.log10(np.sqrt(np.mean(f ** 2)) + 1e-9) < -40:
            continue
        ac = np.correlate(f, f, "full")[w - 1:]
        n += 1
        v += ac[sr // 300:sr // 70].max() / (ac[0] + 1e-12) > 0.5
    return v / n if n else 0.0


def run_bytes(cmd):
    return subprocess.run(cmd, capture_output=True).stdout


def vo_files(vo_dir):
    files = {k: vo_dir / f"{UNIT}_vo_{k}_take01.mp3" for k in SEGS}
    missing = [str(p) for p in files.values() if not p.exists()]
    if missing:
        sys.exit("VO not found (generate on the ElevenLabs site, content.md §9):\n  " + "\n  ".join(missing))
    return files


def layout(vo_dir):
    files = vo_files(vo_dir)
    info = {}
    for k, p in files.items():
        sp, d = speech(p)
        if not sp:
            sys.exit(f"no speech found in {p}")
        info[k] = {"file": p, "dur": d, "speech": sp, "a": sp[0][0], "b": sp[-1][1]}
        print(f"{k}: {d:.2f} s, speech {sp[0][0]:.2f}–{sp[-1][1]:.2f}, bursts {len(sp)}")
    # N02 = L5 + L6: split at the internal pause nearest the character-proportion boundary (L5 has its own full stop
    # after "Dapur gelap.", which can be the longest pause, so "longest pause" is not used)
    sp = info["N02"]["speech"]
    if len(sp) < 2:
        sys.exit("N02: no pause between L5 and L6 found; check the take")
    frac = len(TEXT["L5"]) / (len(TEXT["L5"]) + len(TEXT["L6"]))
    a_, b_ = sp[0][0], sp[-1][1]
    expect = a_ + frac * (b_ - a_)
    print(f"N02 split: expected near {expect:.2f} s ({frac:.0%} of the speech by characters)")
    for i in range(len(sp) - 1):
        print(f"  pause {i}: {sp[i][1]:.2f}–{sp[i + 1][0]:.2f} ({sp[i + 1][0] - sp[i][1]:.2f} s) → L5 {sp[i][1] - a_:.2f} s, L6 {b_ - sp[i + 1][0]:.2f} s")
    gi = min(range(len(sp) - 1), key=lambda i: abs((sp[i][1] + sp[i + 1][0]) / 2 - expect))
    print(f"  → pause {gi}")
    l5 = (sp[0][0], sp[gi][1])
    l6 = (sp[gi + 1][0], sp[-1][1])
    lines, place, pre = {}, {}, {}
    t0 = 0.6 - l5[0]  # file time → pilot time for N02
    place["N02"] = t0
    lines["L5"] = (l5[0] + t0, l5[1] + t0)
    lines["L6"] = (l6[0] + t0, l6[1] + t0)
    s7 = max(lines["L6"][1] + 0.6, lines["L6"][0] + 5.8)
    place["N03"] = s7 - info["N03"]["a"]
    lines["L7"] = (s7, s7 + info["N03"]["b"] - info["N03"]["a"])
    # P01 (toa) may open with an unvoiced breath before the words (owner take 2026-11-18: 0.0–0.69 s, words from
    # 1.09 s). The breath stays in the mix (speech is never edited); the LINE starts at the words, so the flinch and
    # the captions land on "Dapur" (D-039: "di awal kalimat toa"). Checked by voicing, P01 only: N03 "Klik" and D02
    # "Kak" are whispered/short words, a voicing rule would strip them.
    s8 = lines["L7"][1] + TOA_GAP  # v1 0.65 s; v2 1.20 s (room for the toa switch-on before the breath, D-041)
    place["P01"] = s8 - info["P01"]["a"]
    sp8 = info["P01"]["speech"]
    words8 = sp8[0][0]
    if len(sp8) >= 2:
        vf = voiced_fraction(info["P01"]["file"], *sp8[0])
        print(f"P01 first burst {sp8[0][0]:.2f}–{sp8[0][1]:.2f}: voiced fraction {vf:.2f}")
        if vf < 0.2 and sp8[0][1] - sp8[0][0] < 0.9 and sp8[1][0] - sp8[0][1] >= 0.25:
            words8 = sp8[1][0]
            print(f"  → breath, words from {words8:.2f} s")
    pre["L8"] = s8
    lines["L8"] = (place["P01"] + words8, place["P01"] + info["P01"]["b"])
    s9 = lines["L8"][1] + 0.7
    place["D02"] = s9 - info["D02"]["a"]
    lines["L9"] = (s9, s9 + info["D02"]["b"] - info["D02"]["a"])
    end = round(lines["L9"][1] + 0.8, 3)
    # the audible "Klik" (v2): the loudest 5 ms window in N03's first speech burst. Silence detection (-45 dB) starts
    # L7 on the breathy lead-in; the plosive burst comes later (take01: +0.13 s). The bolt lands on this time.
    import numpy as np
    raw = run_bytes(["ffmpeg", "-v", "error", "-i", str(info["N03"]["file"]), "-ac", "1", "-ar", "48000", "-f", "f32le", "-"])
    x = np.frombuffer(raw, np.float32).astype(float)
    a3, b3 = info["N03"]["speech"][0]
    n = 240
    seg = x[int(a3 * 48000):int(b3 * 48000)]
    m = len(seg) // n
    e = (seg[:m * n].reshape(m, n) ** 2).mean(1)
    klik = place["N03"] + a3 + (int(np.argmax(e)) + 0.5) * n / 48000
    # bursts (pilot time) inside each line, finer pause threshold, for caption word timing (words spread over the
    # bursts by letter count instead of over the whole line, so a pause like "Klik. | Pintu…" is not smeared)
    seg_of = {l: s for s, (_, ls) in SEGS.items() for l in ls}
    bursts = {}
    for l, (a, b) in lines.items():
        k = seg_of[l]
        fine, _ = speech(info[k]["file"], min_sil=0.12)
        bs = [(max(a, x + place[k]), min(b, y + place[k])) for x, y in fine]
        bursts[l] = [(round(x, 3), round(y, 3)) for x, y in bs if y - x > 0.05]
    return info, lines, place, end, pre, bursts, klik


def cmd_plan(a):
    global TOA_GAP
    TOA_GAP = a.toa_gap
    info, lines, place, end, pre, bursts, klik = layout(Path(a.vo_dir))
    plan_out = Path(a.plan_out)
    old = json.loads(plan_out.read_text(encoding="utf-8")) if plan_out.exists() else None
    if old and old.get("timing") == "provisional":
        bak = plan_out.with_name("pilot003-plan.provisional.json")
        if not bak.exists():
            shutil.copy2(plan_out, bak)
    who = {l: SEGS[s][0] for s, (_, ls) in SEGS.items() for l in ls}
    seg = {l: s for s, (_, ls) in SEGS.items() for l in ls}
    plan = {
        "unit": UNIT, "pilot": "S03-S06 (L5-L9)", "timing": "audio",
        "note": "Line times from the voice-over (silence detection, -45 dB); gaps are editorial. 'pre' = an unvoiced breath before the words (kept in the mix); 'bursts' = speech bursts (pauses >= 0.12 s) for caption timing. scripts/ep003_pilot_audio.py plan.",
        "lines": [{"id": l, "who": who[l], "seg": seg[l], "text": TEXT[l], "start": round(lines[l][0], 3), "end": round(lines[l][1], 3), **({"pre": round(pre[l], 3)} if l in pre else {}), "bursts": bursts[l]} for l in ["L5", "L6", "L7", "L8", "L9"]],
        "place": {k: round(v, 3) for k, v in place.items()},
        "end": end,
    }
    if a.toa_open_lead is not None:
        # v3: the toa switch-on SFX starts this long after L7 ends (negative = over the tail of N03); S05 cuts in on it
        plan["toaOpen"] = round(lines["L7"][1] + a.toa_open_lead, 3)
        plan["note"] += " 'toaOpen' = the toa switch-on SFX start; S05 cuts in on it and Uq jolts on it (v3)."
    if a.klik:
        plan["klik"] = round(klik, 3)
        plan["note"] += " 'klik' = the loudest 5 ms of N03's first burst (the audible 'Klik'); the bolt lands there (v2)."
    plan_out.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", plan_out)
    for l in plan["lines"]:
        print(f"  {l['id']} {l['start']:.2f}–{l['end']:.2f}")
    print(f"  end {end:.2f} s")


def beats():
    studio = ROOT / "studio"
    r = run(["npx", "esbuild", "tools/p003_beats.ts", "--bundle", "--platform=node", "--log-level=warning", "--outfile=out/p003_beats.cjs"], cwd=studio, shell=True)
    if r.returncode:
        sys.exit(r.stderr)
    return json.loads(run(["node", "out/p003_beats.cjs"], cwd=studio).stdout)


def stats(path):
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr
    ov = e[e.rfind("Overall"):]
    return float(re.findall(r"Peak level dB:\s*(-?[\d.inf]+)", ov)[-1]), float(re.findall(r"RMS level dB:\s*(-?[\d.inf]+)", ov)[-1])


def cmd_mix(a):
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    if plan.get("timing") != "audio":
        sys.exit("the plan is still provisional: run `plan` first")
    B = beats()
    if abs(B["end"] - plan["end"]) > 1e-6:
        sys.exit("beats and plan disagree (rebuild)")
    files = vo_files(Path(a.vo_dir))
    out_dir = Path(a.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    work = out_dir / "work"
    work.mkdir(exist_ok=True)
    OUT = out_dir / f"{a.name}_mix.wav"
    PRE = out_dir / f"{a.name}_premaster.wav"
    VO = out_dir / f"{a.name}_vo_stem.wav"
    SHEET = out_dir / f"{a.name}_cue_sheet.csv"
    for p in (OUT, PRE, VO, SHEET):
        if p.exists():
            sys.exit(f"REFUSED (exists): {p}")
    END = B["end"] + 0.04
    # 1) VO stem: each segment trimmed at its edges (≥ 0.12 s of the original silence kept), gained to its target
    inputs, fl, names, rows = [], [], [], []
    for i, (k, (who, _)) in enumerate(SEGS.items()):
        sp, d = speech(files[k])
        a0, b0 = max(0.0, sp[0][0] - 0.12), min(d, sp[-1][1] + 0.12)
        seg = work / f"{k}_trim.wav"
        chain = f"atrim={a0}:{b0},asetpts=PTS-STARTPTS,aresample={SR}"
        if who == "toa":
            chain += ",apad=pad_dur=0.6," + TOA_CHAIN
        if not seg.exists():
            r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(files[k]), "-af", chain, "-ac", "1", "-c:a", "pcm_s24le", str(seg)])
            if r.returncode:
                sys.exit(r.stderr)
        li, _ = lufs(seg)
        g = TARGET[who] - li
        at = plan["place"][k] + a0
        inputs += ["-i", str(seg)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}:all=1[v{i}]")
        names.append(f"v{i}")
        rows.append({"cue": f"VO {k}", "time_s": round(at, 3), "file": files[k].name, "purpose": "/".join(SEGS[k][1]) + (" (toa effect)" if who == "toa" else ""), "processing": chain, "gain_dB": round(g, 1), "licence": "ElevenLabs (owner directive: Pro plan assumed, D-035 / 2026-11-002)", "status": "owner to listen"})
    fl.append("".join(f"[{n}]" for n in names) + f"amix=inputs={len(names)}:normalize=0:duration=longest,apad=whole_dur={END},atrim=0:{END}[vo]")
    r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[vo]", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", str(VO)])  # float: a gained segment may pass 0 dBFS before the master (N03 "Klik" +1.5 dB clipped in s24, 2026-11-18)
    if r.returncode:
        sys.exit(r.stderr)
    v_peak, v_rms = stats(VO)
    print(f"VO stem: peak {v_peak:.1f} dB, RMS {v_rms:.1f} dB")
    bt = B["beat"]
    L = {l["id"]: l for l in plan["lines"]}
    COLL = "owner's SFX collection (refrences/SFX); licence per owner directive 2026-11-17 (not verified by Claude)"
    SYNTH = "synthesised by Claude for Ep 1 (scripts/sfx_synth.py): no third-party rights"
    # (file, origin, start s, kind, extra dB, filter, purpose, licence) — kinds as Ep 1: shot = voice peak -8 dB,
    # bed = speech RMS -24 dB
    cues = [
        ("crickets_bed.wav", "syn", 0.0, "bed", -3, f"aloop=loop=-1:size=2e6,atrim=0:{END},lowpass=f=2200,afade=t=in:d=0.4,afade=t=out:st={END - 0.5}:d=0.5", "night outside, muffled by the kitchen wall", SYNTH),
        ("room_tone.wav", "syn", 0.0, "bed", -4, f"aloop=loop=-1:size=2e6,atrim=0:{END},afade=t=in:d=0.3,afade=t=out:st={END - 0.5}:d=0.5", "room tone (no hard silence)", SYNTH),
        ("toa_hum.wav", "syn", L["L8"].get("pre", L["L8"]["start"]) - 0.5, "bed", 2, f"atrim=0:{L['L8']['end'] - L['L8'].get('pre', L['L8']['start']) + 1.6},lowpass=f=2600,afade=t=in:d=0.35,afade=t=out:st={L['L8']['end'] - L['L8'].get('pre', L['L8']['start']) + 1.0}:d=0.6", "the toa's carrier hum, outside", SYNTH),
        ("1 Click Mouse.mp3", "col", bt["torchOn"] - 0.01, "shot", -6, "lowpass=f=5000", "phone torch ON (S03)", COLL),
        ("1 Click Mouse.mp3", "col", bt["torchOff"] - 0.01, "shot", -6, "lowpass=f=5000", "phone torch OFF on the jolt (S05)", COLL),
        ("Shutter 5Dm4.mp3", "col", bt["click"] - 0.07, "shot", -2, "highpass=f=180", "the bolt slides home: 'Klik' (S04)", COLL),
        ("Hit 3.mp3", "col", bt["click"] - 0.01, "shot", -10, "atrim=0:0.5,afade=t=out:st=0.25:d=0.25,lowpass=f=4000", "bolt thunk under the clack", COLL),
    ]
    inputs, fl, names = ["-i", str(VO)], [f"[0:a]aresample={SR}[vo]"], []
    for i, (f, origin, st, kind, extra, filt, purpose, lic) in enumerate(cues, start=1):
        src = (SFX_SRC / f) if origin == "col" else (SYN / f)
        if not src.exists():
            sys.exit(f"missing SFX {src}")
        proc = work / f"sfx{i:02d}_{Path(f).stem}.wav"
        if not proc.exists():
            r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(src), "-af", (filt + "," if filt else "") + f"aresample={SR}", "-ac", "1", "-c:a", "pcm_s24le", str(proc)])
            if r.returncode:
                sys.exit(r.stderr)
        c_peak, c_rms = stats(proc)
        g = ((v_rms - 24) - c_rms) if kind == "bed" else ((v_peak - 8) - c_peak)
        g += extra
        inputs += ["-i", str(proc)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(max(0, st) * 1000))}:all=1[c{i}]")
        names.append(f"c{i}")
        rows.append({"cue": i, "time_s": round(st, 3), "file": f, "purpose": purpose, "processing": filt or "none", "gain_dB": round(g, 1), "licence": lic, "status": "CANDIDATE — owner to listen"})
        print(f"  {i:2d} {st:6.2f}s {kind:5s} {g:6.1f} dB  {f}  ({purpose})")
    fl.append("[vo]" + "".join(f"[{n}]" for n in names) + f"amix=inputs={len(names) + 1}:normalize=0:duration=first,atrim=0:{END}[pre]")
    r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[pre]", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", str(PRE)])
    if r.returncode:
        sys.exit(r.stderr)
    # master: one static gain to -14 LUFS, then a peak limiter at -1.5 dBFS (sample peak; ffmpeg loudnorm in linear
    # mode backs off when the clicks' true peak is high, and missed -14 by 1.6 dB in the pipeline test)
    # measured on the same dual-mono stereo the file will be (pan, not -ac, so both channels carry the full signal)
    st = "pan=stereo|c0=c0|c1=c0"
    i0, _ = lufs(PRE, st)
    gain = -14.0 - i0
    lim = 10 ** (-1.5 / 20)
    for _ in range(3):  # the limiter takes a little off: correct the static gain until -14 ± 0.2
        r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(PRE), "-af", f"{st},volume={gain:.2f}dB,alimiter=limit={lim:.4f}:attack=3:release=60:level=false,aresample={SR}", "-c:a", "pcm_s16le", str(OUT)])
        if r.returncode:
            sys.exit(r.stderr)
        i1, _ = lufs(OUT)
        if abs(i1 + 14.0) <= 0.2:
            break
        gain += -14.0 - i1
    i_, p_ = lufs(OUT)
    print(f"wrote {OUT}: {i_:.1f} LUFS, peak {p_:.1f} dBFS")
    with open(SHEET, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["cue", "time_s", "file", "purpose", "processing", "gain_dB", "licence", "status"])
        w.writeheader()
        w.writerows(rows)
    print("cue sheet", SHEET)


# ---------------------------------------------------------------------------------------------- v2 mix (D-041 pending)
# The owner's new SFX sets (refrences/SFX, "<prompt>_#n.mp3", 4 variants each, 2026-11-18). Which variant is used is
# read from scripts/ep003_pilot_sfx.json, so a swap ("gerendel → #3") is a remix + remux only: every cue is aligned by
# its own measured transient/peak, never by file start, and the picture does not depend on the choice.
PLAN_V2 = ROOT / "studio/src/ep003/pilot003-plan-v2.json"
PLAN_BY = {"v2": PLAN_V2, "v3": ROOT / "studio/src/ep003/pilot003-plan-v3.json"}
# v3 (owner 2026-11-18):
#  - de-plosive: a 90 Hz high-pass on adik's segment before the stem (her "p"/"t" bursts carry 38-61 % of their energy
#    below 200 Hz). Not on the narrator: on N03 the filter's phase shift RAISED the "Klik" peak by 1.3 dB (tested).
#    The toa chain already starts at 380 Hz.
#  - the night bed gets a high shelf (+8 dB from 2 kHz): #3 has 97 % of its energy below 1 kHz, which a phone speaker
#    barely plays. Its level rule is unchanged (RMS after the EQ), so the bed is not louder overall, only brighter.
#  - levels anchored to the VO RMS + 23.2 dB (= the v2 stem peak) instead of the stem peak, so taming a VO peak does
#    not move every SFX level with it.
DEPLOSIVE = "highpass=f=90:poles=2"
BED_EQ = "highshelf=f=2000:g=8"
ANCHOR_PEAK_OVER_RMS = 23.2
# v3: the night bed's level is set in the phone band: its RMS above 300 Hz = the VO's RMS above 300 Hz - 22 dB (v2 was
# ~25 dB under there, and the shelf alone raised it only 0.8 dB because the RMS rule took it back)
BED_PHONE_HP, BED_PHONE_REL = 300, -22.0
KIND_FILE = {
    "malam": "Quiet_night_ambience_#{n}.mp3",
    "langkah": "Slow,_careful_footst_#{n}.mp3",
    "gerendel": "A_small_metal_barrel_#{n}.mp3",
    "ketuk": "A_very_soft_single_f_#{n}.mp3",
    "toa_buka": "A_distant_outdoor_pu_#{n}.mp3",
}
FORBIDDEN = ("Very_faint",)  # the distant murmur (gumam warga): NOT before the owner approves it (a new story clue)
OWNER_SFX = "dibuat pemilik (refrences/SFX, 2026-11-18); lisensi mengikuti arahan pemilik yang tercatat (2026-11-17), tidak diverifikasi Claude"
TOA_OPEN_LEAD, TOA_OPEN_LEN, TOA_OPEN_FADE = 0.20, 0.90, 0.35  # after L7 ends; fixed window, fits every variant
# bolt: only 0.07 s before the file's loudest transient. A longer slide pre-roll pulls in the files' own pre-clicks
# (#1 -15 dB at -0.16 s, #3 -12 dB at -0.10 s, #4 -5 dB at -0.13 s): "no second click near the Klik" (owner)
BOLT_PRE, BOLT_POST = 0.07, 0.75


def pcm_np(p, sr=SR):
    import numpy as np
    return np.frombuffer(run_bytes(["ffmpeg", "-v", "error", "-i", str(p), "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"]), np.float32).astype(float)


def env_db(x, win=0.005, sr=SR):
    import numpy as np
    n = int(win * sr)
    m = len(x) // n
    return 20 * np.log10(np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1)) + 1e-12)


def onsets_of(x, win=0.01, sr=SR):
    """transients: 10 ms RMS rising >= 12 dB above the previous 60 ms, >= 0.12 s apart, above -40 dBFS"""
    e = env_db(x, win, sr)
    out, last = [], -1e9
    for i in range(6, len(e)):
        if e[i] > -40 and e[i] - e[i - 6:i].mean() >= 12 and (i - last) * win >= 0.12:
            out.append(i * win)
            last = i
    return out


def peak_time(x, a=0.0, b=None, sr=SR):
    """time of the loudest 5 ms window in [a, b]"""
    import numpy as np
    e = env_db(x, 0.005, sr)
    i0, i1 = int(a / 0.005), len(e) if b is None else min(len(e), int(b / 0.005))
    return (i0 + int(np.argmax(e[i0:i1])) + 0.5) * 0.005


def render_cue(src, filt, work, tag):
    """process one source to a float WAV, cached by a hash of (source, size, mtime, filter)"""
    import hashlib
    st = Path(src).stat()
    h = hashlib.md5(f"{Path(src).name}|{st.st_size}|{st.st_mtime_ns}|{filt}".encode()).hexdigest()[:10]
    out = work / f"{tag}_{h}.wav"
    if not out.exists():
        r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(src), "-af", (filt + "," if filt else "") + f"aresample={SR}", "-ac", "1", "-c:a", "pcm_f32le", str(out)])
        if r.returncode:
            sys.exit(r.stderr)
    return out


def true_peak(p):
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    s = e[e.rfind("Summary"):]
    return float(re.search(r"I:\s*(-?[\d.]+) LUFS", s).group(1)), float(re.search(r"True peak:\s*Peak:\s*(-?[\d.inf]+)", s).group(1))


def beats_v2(version="v2"):
    studio = ROOT / "studio"
    r = run(["npx", "esbuild", "tools/p003v2_beats.ts", "--bundle", "--platform=node", "--log-level=warning", "--outfile=out/p003v2_beats.cjs"], cwd=studio, shell=True)
    if r.returncode:
        sys.exit(r.stderr)
    return json.loads(run(["node", "out/p003v2_beats.cjs", version], cwd=studio).stdout)


def rms_af(p, af):
    """RMS (dB) of a file after a filter (e.g. the phone band)"""
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(p), "-af", af + ",astats=metadata=0", "-f", "null", "-"]).stderr
    ov = e[e.rfind("Overall"):]
    return float(re.findall(r"RMS level dB:\s*(-?[\d.inf]+)", ov)[-1])


def limiter_gr(pre, out, gain_db):
    """gain reduction of the master limiter, measured with the limiter's latency removed (cross-correlation), in 5 ms
    windows where the premaster is above -40 dBFS: returns (max dB, time s, seconds above 1 dB, lag samples). The v2 QC
    compared unaligned envelopes; the 2 ms latency made sharp onsets look limited by up to 14.6 dB (artefact)."""
    import numpy as np
    a = pcm_np(pre) * 10 ** (gain_db / 20)
    b = pcm_np(out)
    n = min(len(a), len(b))
    a, b = a[:n], b[:n]
    seg = slice(SR * 2, min(n, SR * 12))
    c = np.correlate(b[seg], a[seg][2000:-2000], "valid")
    lag = int(np.argmax(c)) - 2000
    if lag > 0:
        b = b[lag:]
        a = a[:len(b)]
    elif lag < 0:
        a = a[-lag:]
        b = b[:len(a)]
    k = int(0.005 * SR)
    m = min(len(a), len(b)) // k
    ea = np.sqrt((a[:m * k].reshape(m, k) ** 2).mean(1)) + 1e-12
    eb = np.sqrt((b[:m * k].reshape(m, k) ** 2).mean(1)) + 1e-12
    gr = 20 * np.log10(eb / ea)
    loud = ea > 10 ** (-40 / 20)
    g = np.where(loud, gr, 0.0)
    i = int(np.argmin(g))
    return float(-g[i]), i * 0.005, float(((g < -1)).sum() * 0.005), lag


def cmd_mix2(a):
    import hashlib
    cfg = json.loads(Path(a.config).read_text(encoding="utf-8"))
    v3 = a.version == "v3"
    plan = json.loads(PLAN_BY[a.version].read_text(encoding="utf-8"))
    B = beats_v2(a.version)
    if abs(B["end"] - plan["end"]) > 1e-6:
        sys.exit("beats and plan disagree (rebuild)")
    files = vo_files(Path(a.vo_dir))
    out_dir = Path(a.out_dir)
    work = out_dir / "work"
    work.mkdir(parents=True, exist_ok=True)
    OUT, PRE, VO, SHEET = (out_dir / f"{a.name}_{x}" for x in ("mix.wav", "premaster.wav", "vo_stem.wav", "cue_sheet.csv"))
    for p in (OUT, PRE, VO, SHEET):
        if p.exists():
            sys.exit(f"REFUSED (exists): {p}")
    END = B["frames"] / 30 + 0.05  # a little longer than the picture; the mux cuts to the picture (-shortest)
    bt, L = B["beat"], {l["id"]: l for l in plan["lines"]}
    # ---- VO stem: exactly the v1 chain (segment gain to a loudness target; toa chain on P01)
    inputs, fl, names, rows = [], [], [], []
    for i, (k, (who, _)) in enumerate(SEGS.items()):
        sp, d = speech(files[k])
        a0, b0 = max(0.0, sp[0][0] - 0.12), min(d, sp[-1][1] + 0.12)
        chain = f"atrim={a0}:{b0},asetpts=PTS-STARTPTS,aresample={SR}" + (",apad=pad_dur=0.6," + TOA_CHAIN if who == "toa" else (("," + DEPLOSIVE) if v3 and who == "adik" else ""))
        seg = render_cue(files[k], chain, work, f"vo_{k}")
        li, _ = lufs(seg)
        g = TARGET[who] - li
        at = plan["place"][k] + a0
        inputs += ["-i", str(seg)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}:all=1[v{i}]")
        names.append(f"v{i}")
        rows.append({"cue": f"VO {k}", "time_s": round(at, 3), "file": files[k].name, "variant": "take01", "align": "plan place", "purpose": "/".join(SEGS[k][1]) + (" (efek toa di luar rumah)" if who == "toa" else ""), "processing": chain, "gain_dB": round(g, 1), "peak_rel_vo_dB": "", "licence": "ElevenLabs (arahan pemilik: paket Pro diasumsikan, D-035)", "status": "pemilik mendengar", "md5": hashlib.md5(files[k].read_bytes()).hexdigest()})
    fl.append("".join(f"[{n}]" for n in names) + f"amix=inputs={len(names)}:normalize=0:duration=longest,apad=whole_dur={END},atrim=0:{END}[vo]")
    r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[vo]", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", str(VO)])
    if r.returncode:
        sys.exit(r.stderr)
    v_peak, v_rms = stats(VO)
    print(f"VO stem: peak {v_peak:.1f} dB, RMS {v_rms:.1f} dB")
    if v3:
        v_peak = v_rms + ANCHOR_PEAK_OVER_RMS  # anchor (see ANCHOR_PEAK_OVER_RMS)
        print(f"  level anchor (v3): VO RMS + {ANCHOR_PEAK_OVER_RMS} = {v_peak:.1f} dB")
    # ---- SFX cues from the config: (kind, source, file time of the alignment point, pilot time of that point, filter,
    #      level rule, extra dB, purpose, what is aligned)
    var, lev, extra = cfg["variasi"], cfg.get("level_db", {}), cfg.get("tambahan", {})
    src = {k: SFX_SRC / KIND_FILE[k].format(n=int(var[k])) for k in KIND_FILE}
    for k, p in src.items():
        if any(f in p.name for f in FORBIDDEN):
            sys.exit(f"REFUSED: {p.name} needs the owner's approval first")
        if not p.exists():
            sys.exit(f"missing SFX {p}")
    cues = []
    # night ambience under the whole pilot (30 s files: longer than the pilot, so no loop seam); gentle HPF
    cues.append(("malam", src["malam"], 0.0, 0.0, f"atrim=0:{END},highpass=f=80" + (f",{BED_EQ}" if v3 else "") + f",afade=t=in:d=0.4,afade=t=out:st={END - 0.5}:d=0.5", "bed", lev.get("malam", 0), "suasana malam (bed, seluruh pilot)" + (", high shelf +8 dB @2 kHz" if v3 else ""), "mulai file"))
    # footsteps: single-step grains cut at the file's own onsets, peak-aligned to each heel strike in the picture
    xs = pcm_np(src["langkah"])
    ons = onsets_of(xs)
    if not ons:
        sys.exit("no footstep onsets found")
    for j, stp in enumerate([s_ for s_ in B["steps"] if s_["t"] >= 0.05]):
        o = ons[(j * 3) % len(ons)]  # spread over the file's steps (neighbours never use the same grain)
        g0 = max(0.0, o - 0.03)
        pk = peak_time(xs, g0, o + 0.12)
        soft = stp["lift_cm"] < 1.5 or stp["phase"].startswith("settle") or (v3 and stp["phase"] == "steps2" and stp["t"] >= bt["st1"] - 0.05)
        filt = f"atrim={g0}:{o + 0.32},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={o + 0.32 - g0 - 0.12}:d=0.12"
        cues.append(("langkah", src["langkah"], pk - g0, stp["t"], filt, "step", lev.get("langkah", 0) - (5 if soft else 0), f"langkah {stp['foot']} ({stp['phase']}{', pelan' if soft else ''})", f"puncak grain {o:.2f} s → tapak kaki"))
    # phone screen tap when the torch comes on (only then, owner 2026-11-18): peak on the torch-on time
    xt = pcm_np(src["ketuk"])
    pt = peak_time(xt)
    cues.append(("ketuk", src["ketuk"], pt, bt["torchOn"], "highpass=f=150", "tap", lev.get("ketuk", 0), "ketukan layar ponsel: senter menyala (S03)", f"puncak file {pt:.3f} s → senter menyala"))
    # the bolt: the file's loudest transient on the audible "Klik" (plan 'klik'); only BOLT_PRE before it, so the file's
    # earlier events (slide, pre-clicks) are cut and no second click sits near it
    xb = pcm_np(src["gerendel"])
    pb = peak_time(xb)
    b0, b1 = max(0.0, pb - BOLT_PRE), min(len(xb) / SR, pb + BOLT_POST)
    cues.append(("gerendel", src["gerendel"], pb - b0, plan["klik"], f"atrim={b0}:{b1},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b1 - b0 - 0.3}:d=0.3,highpass=f=120", "shot", lev.get("gerendel", 0), "gerendel digeser + terkunci (S04), puncak di 'Klik'", f"puncak file {pb:.3f} s → 'Klik' VO"))
    # toa switch-on: a fixed window from the file start, after L7 ends, faded out before the P01 breath (outside: wall
    # muffle + the same slapbacks as the toa voice)
    t_open = L["L7"]["end"] + TOA_OPEN_LEAD
    o_len, o_fade, o_what = TOA_OPEN_LEN, TOA_OPEN_FADE, f"awal file → {TOA_OPEN_LEAD:.2f} s sesudah L7"
    if "toaOpen" in plan:  # v3: over the tail of N03, the cut to S05 and Uq's jolt are on it; ends 0.05 s before the P01 breath
        t_open = plan["toaOpen"]
        o_len = round(plan["place"]["P01"] - 0.05 - t_open, 3)
        o_fade = 0.3
        o_what = f"awal file → toaOpen {t_open:.3f} s (ekor N03; potongan S05 + sentakan Uq)"
    cues.append(("toa_buka", src["toa_buka"], 0.0, t_open, f"atrim=0:{o_len},asetpts=PTS-STARTPTS,afade=t=out:st={o_len - o_fade}:d={o_fade},highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16", "open", lev.get("toa_buka", 0), "pembuka toa di luar rumah (sebelum P01)", o_what))
    SYNTH = "disintesis Claude untuk Ep 1 (scripts/sfx_synth.py): tanpa hak pihak ketiga"
    if extra.get("jangkrik_sintesis_ep1"):
        cues.append(("syn", SYN / "crickets_bed.wav", 0.0, 0.0, f"aloop=loop=-1:size=2e6,atrim=0:{END},lowpass=f=2200,afade=t=in:d=0.4,afade=t=out:st={END - 0.5}:d=0.5", "bed", -3, "jangkrik sintesis Ep 1 (opsi)", "mulai file"))
    if extra.get("room_tone_sintesis_ep1"):
        cues.append(("syn", SYN / "room_tone.wav", 0.0, 0.0, f"aloop=loop=-1:size=2e6,atrim=0:{END},afade=t=in:d=0.3,afade=t=out:st={END - 0.5}:d=0.5", "bed", -4, "room tone sintesis Ep 1 (opsi)", "mulai file"))
    if extra.get("dengung_toa_sintesis_ep1"):
        p0 = L["L8"].get("pre", L["L8"]["start"])
        cues.append(("syn", SYN / "toa_hum.wav", 0.0, p0 - 0.5, f"atrim=0:{L['L8']['end'] - p0 + 1.6},lowpass=f=2600,afade=t=in:d=0.35,afade=t=out:st={L['L8']['end'] - p0 + 1.0}:d=0.6", "bed", 2, "dengung pembawa toa (sintesis Ep 1), di bawah P01", "mulai file"))
    # level rules, measured on the processed cue against the VO stem: bed = VO RMS - 24 dB (v1 rule: no hard silence);
    # step = VO peak - 20 dB; tap = VO peak - 24 dB (very soft); shot = VO peak - 8 dB (v1 bolt rule); open = VO peak - 12 dB
    rule = {"bed": ("rms", -24), "step": ("peak", -20), "tap": ("peak", -24), "shot": ("peak", -8), "open": ("peak", -12)}
    inputs, fl, names = ["-i", str(VO)], [f"[0:a]aresample={SR}[vo]"], []
    for i, (kind, sp_, align_f, at, filt, lvl, ex, purpose, what) in enumerate(cues, start=1):
        proc = render_cue(sp_, filt, work, f"sfx_{kind}")
        start = at - align_f
        if start < 0:
            proc = render_cue(proc, f"atrim={-start}", work, f"sfx_{kind}_cut")
            start = 0.0
        c_peak, c_rms = stats(proc)
        ref, off = rule[lvl]
        g = ((v_rms + off) - c_rms if ref == "rms" else (v_peak + off) - c_peak) + ex
        if v3 and kind == "malam":
            hp = f"highpass=f={BED_PHONE_HP},highpass=f={BED_PHONE_HP}"
            g = (rms_af(VO, hp) + BED_PHONE_REL) - rms_af(proc, hp) + ex
        inputs += ["-i", str(proc)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(start * 1000))}:all=1[c{i}]")
        names.append(f"c{i}")
        vn = re.search(r"#(\d+)", Path(sp_).name)
        rows.append({"cue": i, "time_s": round(at, 3), "file": Path(sp_).name, "variant": f"#{vn.group(1)}" if vn else "-", "align": what, "purpose": purpose, "processing": filt, "gain_dB": round(g, 1), "peak_rel_vo_dB": round(c_peak + g - v_peak, 1), "licence": OWNER_SFX if kind != "syn" else SYNTH, "status": "SEMENTARA: pemilik mendengar", "md5": hashlib.md5(Path(sp_).read_bytes()).hexdigest()})
        print(f"  {i:2d} {at:6.3f}s {lvl:5s} {g:6.1f} dB  peak {c_peak + g - v_peak:6.1f} rel VO  {Path(sp_).name}  ({purpose})")
    fl.append("[vo]" + "".join(f"[{n}]" for n in names) + f"amix=inputs={len(names) + 1}:normalize=0:duration=first,atrim=0:{END}[pre]")
    r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[pre]", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", str(PRE)])
    if r.returncode:
        sys.exit(r.stderr)
    # ---- master: static gain to -14 LUFS, a limiter run at 4x the sample rate (approximates a true-peak limiter), then
    # the check that matters: the true peak of the AAC the deliverable carries (finish_render: aac 128k) <= -1.6 dBTP
    stp = "pan=stereo|c0=c0|c1=c0"
    i0, _ = lufs(PRE, stp)
    gain, ceil = -14.0 - i0, -2.5
    probe = work / "tp_probe.m4a"
    for it in range(10):
        lim = 10 ** (ceil / 20)
        r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(PRE), "-af", f"{stp},volume={gain:.2f}dB,aresample={SR * 4},alimiter=limit={lim:.4f}:attack=2:release=60:level=false,aresample={SR}", "-c:a", "pcm_s24le", str(OUT)])
        if r.returncode:
            sys.exit(r.stderr)
        r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(OUT), "-c:a", "aac", "-b:a", "128k", str(probe)])
        i1, tp_wav = true_peak(OUT)
        _, tp_aac = true_peak(probe)
        print(f"  master pass {it}: gain {gain:+.2f} dB, ceiling {ceil:.1f} dBFS → {i1:.2f} LUFS, TP wav {tp_wav:.2f} / aac {tp_aac:.2f} dBTP")
        ok_l, ok_tp = abs(i1 + 14.0) <= 0.2, tp_aac <= -1.6
        if ok_l and ok_tp:
            break
        if not ok_tp:
            ceil -= 0.3
        if not ok_l:
            gain += -14.0 - i1
    else:
        sys.exit("master did not converge (see the passes above); OUT left for inspection")
    gmax, gt, gsec, lag = limiter_gr(PRE, OUT, gain)
    print(f"  master limiter (latency {lag} samples removed): max GR {gmax:.1f} dB at {gt:.3f} s; {gsec:.2f} s above 1 dB")
    with open(SHEET, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["cue", "time_s", "file", "variant", "align", "purpose", "processing", "gain_dB", "peak_rel_vo_dB", "licence", "status", "md5"])
        w.writeheader()
        w.writerows(rows)
    (out_dir / f"{a.name}_config_used.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT}\n  cue sheet {SHEET}")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("step", choices=["plan", "mix", "mix2"])
    ap.add_argument("--version", choices=["v2", "v3"], default=None, help="mix2 (required): pilot version (plan, beats, processing)")
    ap.add_argument("--config", default=str(ROOT / "scripts/ep003_pilot_sfx.json"), help="mix2: SFX variant choice")
    ap.add_argument("--vo-dir", default=str(VO_DIR))
    ap.add_argument("--plan-out", default=str(PLAN))
    ap.add_argument("--out-dir", default=str(ROOT / f"_media/{UNIT}/audio/pilot"))
    ap.add_argument("--name", default=f"{UNIT}_pilot_v1")
    ap.add_argument("--toa-open-lead", type=float, default=None, help="plan: write 'toaOpen' = L7 end + this (v3: -0.15)")
    ap.add_argument("--klik", action="store_true", help="plan: write 'klik' (audible Klik time) for the picture (v2)")
    ap.add_argument("--toa-gap", type=float, default=0.65, help="plan: L7 end → P01 start (s); v1 0.65, v2 1.20")
    a = ap.parse_args()
    if a.step == "mix2" and a.version is None:
        sys.exit("mix2 needs --version v2|v3 (v3 = the current pilot; v2 has the +0.55 s toa gap the owner rejected)")
    if a.step == "mix2" and a.out_dir == str(ROOT / f"_media/{UNIT}/audio/pilot"):
        a.out_dir = str(ROOT / f"_media/{UNIT}/audio/pilot_v2")
    if a.step == "mix2" and a.name == f"{UNIT}_pilot_v1":
        a.name = f"{UNIT}_pilot_{a.version}"
    if a.step == "mix2" and a.version == "v3" and a.out_dir == str(ROOT / f"_media/{UNIT}/audio/pilot_v2"):
        a.out_dir = str(ROOT / f"_media/{UNIT}/audio/pilot_v3")
    {"plan": cmd_plan, "mix": cmd_mix, "mix2": cmd_mix2}[a.step](a)


if __name__ == "__main__":
    main()
