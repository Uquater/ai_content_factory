"""2026-11-004 Episode 3: FULL-EPISODE audio mix v2 (owner task 2026-11-20). AUDIO ONLY. Updated COPY of ep004_episode_audio.py (v1 script untouched).

v2 changes vs v1 (everything else: VO, levels, limiter settings, master loop, cue rules = v1 code):
  1. Timeline = episode004-plan-d055.json (69.15 s, DRAFT accepted by the owner): L11/N06 61.00 -> 61.80, Doom 65.10 -> 65.90 (+0.80 s). Every cue before
     insert I15 (59.20 s) is on the same time as v1. `measured` (VO speech leads) still comes from the draft plan (d055 has none; VO files unchanged).
  2. Retreat footsteps S10: guessed RETREAT replaced by the FOOT LANDING TIMES of the final picture code (see RETREAT below).
  3. Output trimmed to the frame count of the plan: FRAMES = round(69.15 * 30) = 2075 -> 69.1667 s (0.3 s end fade kept).
  4. Bed / toa-hum gains are computed on the v1-length cue, so their levels are identical to v1 (length would otherwise move the rms by a hair).
  5. Extra measurements: momentary max, short-term max, LRA, inter-sample overs (4x oversampling), 16-bit full-scale count; v1 re-measured the same way.
  6. Work files go to work_v2/ (v1's work/ is not touched).

Original v1 docstring follows.
2026-11-004 Episode 3: FULL-EPISODE audio mix (owner task 2026-11-20, plan of D-052 / content.md §19.3). AUDIO ONLY.

Places every VO and SFX on the episode timeline (studio/src/ep004/episode004-plan-draft.json, 68.35 s) and masters to
-14 LUFS with true peak <= -1.5 dBTP, measured on the WAV and on the AAC encode. Same approach as ep004_pilot_audio.py
(cue level rules, 10-ms-free single timeline, gain + alimiter, ceiling iteration); it imports ep003_pilot_audio helpers.
Reads the owner's VO takes (never written): N01, P01, N02, N03, D01, N04a/b/c, P02, N05, N06 (old N04 is NOT used).
Writes only into _media/2026-11-004/audio/episode/ ; refuses to overwrite.

Differences from the pilot, all deliberate:
  * Pilot Block A cues (S01-S02) are reused at the pilot's own times (plan "beats" of pilot004-plan-v3.json), because the
    episode keeps S01-S02 identical to pilot v3 (0-9.2 s). Pilot Block B cues are the same cues shifted by the episode
    offset (D01 file start 29.05 -> 32.321 s), so they match plan events LED1_click / L7_D01 / screen_on.
  * `Relaxed_footsteps_alley` gets a 0.8 s fade-out (in the pilot the cut at 9.2 s ended it; here it plays to 11.3 s).
  * Retreat footsteps (S10), two characters, NOT picture-locked (S10 is not rendered yet): see RETREAT below.
  * Night bed is 30 s, the episode 68.4 s: laid with 1.2 s equal-power crossfades at seams inside speech (Ep 3 method).
  * 0.3 s fade-out at the very end (the Doom tail is longer than the picture).
  * sfx-14 (UNDECODABLE) is not used: the synthesised switch_click replaces it (as in the pilot).

usage:
  python scripts/ep004_episode_audio_v2.py mix --name 2026-11-004_episode_v2
"""
import argparse
import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402  (speech, lufs, true_peak, render_cue, limiter_gr, pcm_np, onsets_of ...)
import ep003_episode_audio as EA  # noqa: E402  (ambience_loop)

ROOT = PA.ROOT
UNIT = "2026-11-004"
VO = ROOT / f"_media/{UNIT}/audio/vo_raw"
SFX = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
PLAN = ROOT / "studio/src/ep004/episode004-plan-d055.json"
PLAN_DRAFT = ROOT / "studio/src/ep004/episode004-plan-draft.json"  # `measured` (VO leads) only; events come from d055
PILOT = ROOT / "studio/src/ep004/pilot004-plan-v3.json"
OUT_DIR = ROOT / f"_media/{UNIT}/audio/episode"
WORK = OUT_DIR / "work_v2"
FRAMES = 2075                 # round(69.15 * 30) = round(2074.5) -> 2075 (JS Math.round, as pilot004Stage PILOT_FRAMES); report lists 2074/2076 too
V1_END = 68.35                # v1 plan total: bed / hum rms gains are measured on the v1-length cue (identical levels to v1)
V1_REPORT = OUT_DIR / "2026-11-004_episode_v1_report.txt"
SR = PA.SR
N01_SPLIT = 3.78            # same cut in the silence between L2 and L3 as the pilot
D01_PILOT_FILE_START = 29.05  # pilot (v3) D01 placement: file start on the pilot clock
LED1_PILOT = 27.90 + 0.0    # pilot ledT on the pilot clock
# Retreat footsteps S10 (episode 37.775-41.275), v2: FOOT LANDING TIMES FROM THE PICTURE CODE, not guesses.
# Source: studio/src/ep004/motion004.ts:336-337 -> sideShuffle (shuffle004.ts) with S10C_PASS (motion004d055.ts: cycles [3,3], body "pulse",
# walkEnd 2.8) and d055Opts -> PROPOSED.away = 0.1 (adik turns with walkSteps, motion004.ts:342-343). Step-close ("geser-rapat"): per cycle the lead foot
# lands at c0 + dt/2 - 0.02 and the trail foot at c0 + dt - 0.02 (FootEvent.t1; stepper.movesAt plants the foot at t1, lifted in between).
#   Uq : t0 0.20, t1 2.80, 3 cycles, dt 0.8667 -> 6 landings        adik: t0 0.20, t1 2.75 (= walkEnd - 0.05), 3 cycles, dt 0.85 -> 6 landings
#   turn to the hallway (outT0 = 3.5 - out 0.7 = 2.8): Uq turnInPlace 2.8-3.5 (mid 3.15): feet land 3.13, 3.50; adik walkSteps(2) 2.85-3.55 (a = t0 + 0.04,
#   b = t0 + i*dt - 0.04): feet land 3.16, 3.51. Values below were produced by running shuffle004.sideShuffle / stepper.turnInPlace / walkSteps (esbuild, scratch
#   script, studio/ not written) and agree with the formula (asserted in main()). Times are SHOT-local (S10 starts at 37.775 on the plan clock).
# Plan-clock caveat: frames are rendered per shot (round(dur*30)), the full episode is not assembled yet; the S10 start in frames may differ from 37.775 by < 1 frame.
S10_START = 37.775
RETREAT_UQ = [0.6133, 1.0467, 1.48, 1.9133, 2.3467, 2.78]        # walk landings, R L R L R L
RETREAT_ADIK = [0.605, 1.03, 1.455, 1.88, 2.305, 2.73]           # walk landings, R L R L R L
TURN_UQ = [3.13, 3.50]                                           # turn-to-hallway landings (turnInPlace)
TURN_ADIK = [3.16, 3.51]                                         # turn-to-hallway landings (walkSteps, away 0.10 m)
RETREAT = [("uq", t) for t in RETREAT_UQ] + [("adik", t) for t in RETREAT_ADIK] + [("uq", t) for t in TURN_UQ] + [("adik", t) for t in TURN_ADIK]
RETREAT_LEVEL = {"uq": -24.0, "adik": -28.0}          # v1 peak rules, unchanged
RETREAT_TURN_EXTRA = -3.0                             # turn steps softer (as the v1 turn shuffles)
N_TURN = len(TURN_UQ) + len(TURN_ADIK)


def _check_landings():
    """the hard-coded times must equal the formulas of sideShuffle / turnInPlace / walkSteps"""
    def walk(t0, t1, n):
        dt = (t1 - t0) / n
        return [round(c, 4) for i in range(n) for c in (t0 + i * dt + 0.5 * dt - 0.02, t0 + (i + 1) * dt - 0.02)]
    assert walk(0.2, 2.8, 3) == RETREAT_UQ, walk(0.2, 2.8, 3)
    assert walk(0.2, 2.75, 3) == RETREAT_ADIK, walk(0.2, 2.75, 3)
    mid = 2.8 + 0.7 * 0.5
    assert [round(mid - 0.02, 4), 3.5] == TURN_UQ
    t0, dt = 2.85, (3.55 - 2.85) / 2
    assert [round(max(t0 + 0.04 + 0.12, t0 + dt - 0.04), 4), round(max(t0 + dt + 0.04 + 0.12, t0 + 2 * dt - 0.04), 4)] == TURN_ADIK


def ext_measure(path, tag):
    """EBU R128 loudness (integrated, momentary max, short-term max, LRA), true peak (ebur128) and inter-sample overs:
    the file is decoded to float (AAC unclipped), upsampled 4x (192 kHz) and every sample >= 0 dBFS counted; also 16-bit full-scale samples."""
    import numpy as np, re
    e = PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    rows = re.findall(r"t:\s*([\d.]+)\s.*?M:\s*(-?[\d.]+)\s+S:\s*(-?[\d.]+)", e)
    t = np.array([float(r[0]) for r in rows]); M = np.array([float(r[1]) for r in rows]); S = np.array([float(r[2]) for r in rows])
    ok_m, ok_s = M > -100, (S > -100) & (t >= 3.0)  # short-term needs a full 3 s window
    sm = e[e.rfind("Summary"):]
    I = float(re.search(r"I:\s*(-?[\d.]+) LUFS", sm).group(1)); LRA = float(re.search(r"LRA:\s*([\d.]+) LU", sm).group(1))
    TP = float(re.search(r"True peak:\s*Peak:\s*(-?[\d.inf]+)", sm).group(1))
    def pcm(af, fmt):
        return np.frombuffer(PA.run_bytes(["ffmpeg", "-v", "error", "-i", str(path), "-af", af, "-f", fmt, "-"]), np.float32 if fmt == "f32le" else np.int16)
    x4 = pcm("aresample=192000", "f32le")
    ov = np.abs(x4) >= 1.0
    out = {"tag": tag, "I": I, "TP": TP, "LRA": LRA, "Mmax": float(M[ok_m].max()), "Mmax_t": float(t[ok_m][M[ok_m].argmax()]),
           "Smax": float(S[ok_s].max()), "Smax_t": float(t[ok_s][S[ok_s].argmax()]), "isp_peak_db": float(20 * np.log10(np.abs(x4).max() + 1e-12)), "isp_over": int(ov.sum()),
           "isp_over_t": float(np.flatnonzero(ov)[0] / 192000.0) if ov.any() else None}
    if str(path).endswith(".wav"):
        xi = pcm("anull", "s16le")
        out["fs16"] = int((np.abs(xi.astype(np.int32)) >= 32767).sum())
    else:
        out["fs16"] = None
    return out


def fmt_ext(o):
    return (f"  {o['tag']:12s} I {o['I']:.1f} LUFS | TP {o['TP']:.1f} dBTP | LRA {o['LRA']:.1f} LU | momentary max {o['Mmax']:.1f} LUFS @ {o['Mmax_t']:.1f} s | "
            f"short-term max {o['Smax']:.1f} LUFS @ {o['Smax_t']:.1f} s | 4x-oversampled peak {o['isp_peak_db']:.2f} dBFS, samples >= 0 dBFS: {o['isp_over']}"
            + (f" (first @ {o['isp_over_t']:.3f} s)" if o['isp_over'] else "") + (f" | 16-bit full-scale samples: {o['fs16']}" if o['fs16'] is not None else ""))


def extra_lines(out, out_aac, pre, END):
    """v2 extra measurements (not in v1): momentary / short-term / LRA / inter-sample overs, v1 re-measured identically; premix diff vs v1"""
    import numpy as np
    lines = []
    v1w, v1a = OUT_DIR / "2026-11-004_episode_v1.wav", OUT_DIR / "2026-11-004_episode_v1.m4a"
    lines.append(f"frames: {FRAMES} @ 30 fps = {FRAMES / 30:.4f} s; output {PA.duration(out):.4f} s (plan {END} s = {END * 30:.1f} frames; round-half-down 2074 = {2074 / 30:.4f} s, sum of per-shot rounded frames 2076 = {2076 / 30:.4f} s)")
    lines.append("extended loudness (ffmpeg ebur128, peak=true):")
    for pth, tg in ((out, "v2 WAV"), (out_aac, "v2 AAC 192k"), (v1w, "v1 WAV"), (v1a, "v1 AAC 192k")):
        if pth.exists():
            lines.append(fmt_ext(ext_measure(pth, tg)))
    v1pre = OUT_DIR / "work" / "2026-11-004_episode_v1_premix.wav"
    if v1pre.exists():
        pa, pb = PA.pcm_np(v1pre), PA.pcm_np(pre)
        n = min(len(pa), len(pb))
        d = np.abs(pa[:n] - pb[:n])
        kk = int(0.1 * SR)
        nb = n // kk
        bins = d[:nb * kk].reshape(nb, kk).max(1) > 1e-5
        segs, i = [], 0
        while i < nb:
            if bins[i]:
                j = i
                while j < nb and bins[j]:
                    j += 1
                segs.append(f"{i * 0.1:.1f}-{j * 0.1:.1f}")
                i = j
            else:
                i += 1
        lines.append(f"premix v2 vs v1 (|diff| > 1e-5 in 0.1 s bins, first {n / SR:.2f} s): differs only in " + (", ".join(segs) if segs else "nowhere"))
        lines.append(f"premix v2 vs v1: max |diff| for t < 37.7 s = {float(d[:int(37.7 * SR)].max()):.2e} (0 = cues before S10 bit-identical)")
    return lines


def peak_of(w):
    return float(PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(w), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr.split("Overall")[-1].split("Peak level dB:")[1].split()[0])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("step", choices=["mix", "measure"])
    ap.add_argument("--name", required=True)
    a = ap.parse_args()
    import numpy as np
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    (WORK / "v1len").mkdir(exist_ok=True)
    out, out_aac = OUT_DIR / f"{a.name}.wav", OUT_DIR / f"{a.name}.m4a"
    if a.step == "measure":  # append the extended measurements to an existing run's report (no re-mix, nothing overwritten)
        rp = OUT_DIR / f"{a.name}_report.txt"
        ls = extra_lines(out, out_aac, WORK / f"{a.name}_premix.wav", json.loads(PLAN.read_text(encoding="utf-8"))["total"])
        with open(rp, "a", encoding="utf-8") as f:
            f.write("\n".join(ls) + "\n")
        print("\n".join(ls))
        return
    cues_txt, rep_txt = OUT_DIR / f"{a.name}_cues.txt", OUT_DIR / f"{a.name}_report.txt"
    for p in (out, out_aac, cues_txt, rep_txt):
        if p.exists():
            sys.exit(f"refuse to overwrite {p}")
    _check_landings()
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    draft = json.loads(PLAN_DRAFT.read_text(encoding="utf-8"))
    pil = json.loads(PILOT.read_text(encoding="utf-8"))
    E, M = plan["events"], draft["measured"]
    END = plan["total"]
    L = FRAMES / 30.0  # exactly 2075 frames
    assert abs(END - 69.15) < 1e-9
    B = pil["beats"]
    d_shift = round(E["L7_D01"] - M["D01"]["lead"] - D01_PILOT_FILE_START, 3)  # pilot Block B -> episode
    for seg in ("N01", "P01", "N02", "N03", "D01", "N04a", "N04b", "N04c", "P02", "N05", "N06"):
        if not (VO / f"{UNIT}_vo_{seg}_take01.mp3").exists():
            sys.exit(f"missing VO {seg}")

    def vo(seg, t_speech, who):
        f = VO / f"{UNIT}_vo_{seg}_take01.mp3"
        chain = {"n": "", "adik": "highpass=f=90", "toa": "apad=pad_dur=0.6," + PA.TOA_CHAIN}[who]
        return (f, chain, round(t_speech - M[seg]["lead"], 3), ("lufs", {"n": -20.0, "adik": -22.5, "toa": -21.0}[who]), f"VO {seg} ({'narator' if who == 'n' else 'toa' if who == 'toa' else 'adik, bisik'})")

    n01_gain = -20.0 - PA.lufs(VO / f"{UNIT}_vo_N01_take01.mp3")[0]
    l3_at = 3.0 + N01_SPLIT + pil["shift"]
    cues = [
        (VO / f"{UNIT}_vo_N01_take01.mp3", f"atrim=0:{N01_SPLIT},asetpts=PTS-STARTPTS", 3.0, ("gain", n01_gain), "VO N01 L1-L2 (narator)"),
        (VO / f"{UNIT}_vo_N01_take01.mp3", f"atrim={N01_SPLIT},asetpts=PTS-STARTPTS", l3_at, ("gain", n01_gain), "VO N01 L3 (narator, digeser)"),
        vo("P01", E["L4"][0], "toa"), vo("N02", E["L5"][0], "n"), vo("N03", E["L6"][0], "n"), vo("D01", E["L7_D01"], "adik"),
        vo("N04a", E["L8a"][0], "n"), vo("N04b", E["L8b"][0], "n"), vo("N04c", E["L8c"][0], "n"),
        vo("P02", E["L9"][0], "toa"), vo("N05", E["L10"][0], "n"), vo("N06", E["L11"][0], "n"),
    ]
    l3_speech = l3_at + (3.896 - N01_SPLIT)
    if abs(l3_speech - E["L3"][0]) > 0.02:
        print(f"WARNING: L3 speech start {l3_speech:.3f} vs plan {E['L3'][0]}")
    cues += [
        (SFX / "Old_round_doorknob.wav", "atrim=0:0.45,asetpts=PTS-STARTPTS,afade=t=out:st=0.38:d=0.07", B["knobTurn"], ("peak", -12), "kenop berputar"),
        (SFX / "Old_round_doorknob.wav", "atrim=1.70:2.00,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.24:d=0.06", B["knobStrain"], ("peak", -14), "kenop tertahan"),
        (SFX / "A_small_metal_barrel_#3.mp3", "atrim=0.10:0.55,asetpts=PTS-STARTPTS,afade=t=out:st=0.37:d=0.08", B["boltRattle"], ("peak", -11), "gerendel berderak sekali"),
        (SFX / "Old_round_doorknob.wav", "atrim=2.20:2.60,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.33:d=0.07", B["knobBack"], ("peak", -13), "kenop kembali, klik"),
        (SFX / "Muffled_held_breath.wav", "atrim=0:2.4,asetpts=PTS-STARTPTS,afade=t=out:st=2.1:d=0.3", B["breath"], ("peak", -20), "napas tertahan"),
        (SFX / "Muffled_held_breath.wav", "atrim=1.35:2.35,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=0.75:d=0.25", B["breath2"], ("peak", -25), "napas tertahan, embusan kedua (pelan)"),
        (SFX / "Relaxed_footsteps_alley.wav", "lowpass=f=2500,afade=t=out:st=5.2:d=0.8", B["steps"], ("peak", -22), "langkah menjauh di gang (+ fade 0,8 s)"),
        (SFX / "1 Click Mouse.mp3", "", B["recapClick"], ("peak", -16), "klik recap"),
    ]
    for name, key in (("toa buka 1 (S04)", "toa_open1"), ("toa buka 2 (S13)", "toa_open2")):
        cues.append((SFX / "A_distant_outdoor_pu_#4.mp3", "atrim=0:1.0,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.3,highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16", E[key], ("peak", -12), name))
    for name, key in (("getar ponsel 1 (S05)", "vib1"), ("getar ponsel 2 (S14)", "vib2")):
        cues.append((SFX / "A_smartphone_vibrati_#2.mp3", "", E[key], ("peak", -14), name))
    for i, key in enumerate(["LED1_click", "LED2_click", "LED3_click", "LED4_click"], 1):
        # sfx-14 is UNDECODABLE: own synthesised switch click, high-passed (as in the pilot)
        cues.append((SYN / "switch_click.wav", "atrim=0:0.2,asetpts=PTS-STARTPTS,highpass=f=1800,afade=t=out:st=0.12:d=0.08", E[key], ("peak", -22), f"LED-{i} menyala (klik halus, sintesis)"))
    cues.append((SFX / "A_very_soft_single_f_#1.mp3", "", round(B["screenTap"] + d_shift, 3), ("peak", -22), "layar ponsel menyala (S09)"))
    # retreat footsteps (grains cut at the source's own onsets, peak aligned to the planned heel strike)
    src_step = SFX / "Slow,_careful_footst_#1.mp3"
    xs = PA.pcm_np(src_step)
    ons = PA.onsets_of(xs)
    if not ons:
        sys.exit("no footstep onsets found")
    for j, (who, dt) in enumerate(RETREAT):
        o = ons[(j * 3 + (1 if who == "adik" else 0)) % len(ons)]  # 8 onsets, 16 steps; adik grain differs from Uq at the same step number
        g0 = max(0.0, o - 0.03)
        pk = PA.peak_time(xs, g0, o + 0.12)
        turn = j >= len(RETREAT) - N_TURN
        filt = f"atrim={g0}:{o + 0.32},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={o + 0.32 - g0 - 0.12}:d=0.12"
        cues.append((src_step, filt, round(S10_START + dt - (pk - g0), 3), ("peak", RETREAT_LEVEL[who] + (RETREAT_TURN_EXTRA if turn else 0.0)),
                     f"langkah mundur {who}{' (putar ke lorong, pelan)' if turn else ''} @S10+{dt:.3f}"))
    cues.append((SFX / "Two_deep_cinematic_Doom.wav", "", E["doom"], ("peak", -7), "dentuman kartu (Doom)"))
    # beds: night ambience (30 s) laid to the episode length with crossfaded seams inside speech; toa hum (2.5 s file, looped as in the pilot)
    seams = [round((E["L6"][0] + E["L6"][1]) / 2, 2), round((E["L10"][0] + E["L10"][1]) / 2, 2)]
    bed_src = PA.render_cue(SFX / "Quiet_night_ambience_#3.mp3", "", WORK, "bed_src")
    bed = EA.ambience_loop(bed_src, END + 0.5, seams, WORK)
    cues.append((bed, f"afade=t=in:d=0.3,afade=t=out:st={END - 0.6}:d=0.6", 0.0, ("rms", -36), f"bed malam (loop, sambungan {seams[0]} / {seams[1]} s di dalam ucapan)"))
    cues.append((SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{END + 0.5},lowpass=f=2600", 0.0, ("rms", -42), "dengung toa samar (sintesis Ep 1)"))

    # v1-length twins of the two rms-ruled beds: the gain is taken from these so the bed levels equal v1 exactly
    v1_bed = EA.ambience_loop(bed_src, V1_END + 0.5, seams, WORK / "v1len")
    v1_bed_w = PA.render_cue(v1_bed, f"afade=t=in:d=0.3,afade=t=out:st={V1_END - 0.6}:d=0.6", WORK / "v1len", "bed")
    v1_hum_w = PA.render_cue(SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{V1_END + 0.5},lowpass=f=2600", WORK / "v1len", "hum")
    v1_rms = {"bed": PA.rms_af(v1_bed_w, "anull"), "hum": PA.rms_af(v1_hum_w, "anull")}
    tracks, report = [], []
    for i, (src, filt, at, (kind, target), label) in enumerate(cues):
        w = PA.render_cue(src, filt, WORK, f"e{i:02d}")
        cur = 0.0 if kind == "gain" else PA.lufs(w)[0] if kind == "lufs" else peak_of(w) if kind == "peak" else (v1_rms["bed"] if label.startswith("bed") else v1_rms["hum"])
        g = target - cur
        tracks.append((w, at, g))
        report.append(f"{label:52s} @ {at:7.2f} s  {kind} {cur:7.1f} -> {target:.1f} dB (gain {g:+.1f})")
    args, fl = [], []
    for j, (w, at, g) in enumerate(tracks):
        args += ["-i", str(w)]
        fl.append(f"[{j}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}|{int(round(at * 1000))},apad=whole_dur={END + 0.5}[t{j}]")
    fl.append("".join(f"[t{j}]" for j in range(len(tracks))) + f"amix=inputs={len(tracks)}:normalize=0:duration=longest,atrim=0:{L},afade=t=out:st={L - 0.3:.3f}:d=0.3[m]")
    pre = WORK / f"{a.name}_premix.wav"
    r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", ";".join(fl), "-map", "[m]", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_f32le", str(pre)])
    if r.returncode:
        sys.exit(r.stderr)
    i0, pk0 = PA.lufs(pre)
    print(f"premix: {i0:.2f} LUFS, sample peak {pk0:.1f} dBFS, {L:.2f} s, {len(cues)} cues")
    gain, ceil = -14.0 - i0, -2.6
    tmp = aac = None
    for it in range(8):
        tmp = WORK / f"{a.name}_m{it}.wav"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre), "-af", f"volume={gain:.2f}dB,alimiter=limit={10 ** (ceil / 20):.4f}:attack=2:release=60:level=disabled", "-c:a", "pcm_s16le", str(tmp)])
        aac = WORK / f"{a.name}_m{it}.m4a"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(tmp), "-c:a", "aac", "-b:a", "192k", str(aac)])
        i1, tpw = PA.true_peak(tmp)
        ia, tpa = PA.true_peak(aac)
        print(f"  master {it}: gain {gain:+.2f} dB ceiling {ceil:.1f} -> WAV {i1:.2f} LUFS TP {tpw:.2f} | AAC {ia:.2f} LUFS TP {tpa:.2f} dBTP")
        if abs(i1 + 14) <= 0.5 and abs(ia + 14) <= 0.5 and max(tpw, tpa) <= -1.5:
            break
        gain += -14.0 - i1
        if max(tpw, tpa) > -1.5:
            ceil -= 0.4
    else:
        sys.exit("master did not converge")
    shutil.copy2(tmp, out)
    shutil.copy2(aac, out_aac)
    # limiter gain reduction: overall and per section (latency aligned)
    gr = PA.limiter_gr(pre, out, gain)
    lines = [f"master: gain {gain:+.2f} dB, ceiling {ceil:.1f} dB; WAV {i1:.2f} LUFS TP {tpw:.2f} dBTP; AAC 192k {ia:.2f} LUFS TP {tpa:.2f} dBTP; premix {i0:.2f} LUFS",
             f"limiter GR overall: max {gr[0]:.1f} dB at {gr[1]:.2f} s; {gr[2]:.2f} s above 1 dB; lag {gr[3]} samples"]
    a_ = PA.pcm_np(pre) * 10 ** (gain / 20)
    b_ = PA.pcm_np(out)
    lag = gr[3]
    if lag > 0:
        b_ = b_[lag:]
        a_ = a_[:len(b_)]
    elif lag < 0:
        a_ = a_[-lag:]
        b_ = b_[:len(a_)]
    k = int(0.005 * SR)
    m = min(len(a_), len(b_)) // k
    ea = np.sqrt((a_[:m * k].reshape(m, k) ** 2).mean(1)) + 1e-12
    eb = np.sqrt((b_[:m * k].reshape(m, k) ** 2).mean(1)) + 1e-12
    g = np.where(ea > 10 ** (-40 / 20), 20 * np.log10(eb / ea), 0.0)
    wins = [("awal L5 (N02, 21.52-23.5 s)", (E["L5"][0], E["L5"][0] + 2.0)), ("L5 seluruhnya", tuple(E["L5"])), ("L1-L3 (3.0-12.4)", (3.0, 12.4)), ("L4 toa P01", tuple(E["L4"])),
            ("L6 N03", tuple(E["L6"])), ("D01 bisikan adik", (E["L7_D01"], E["L7_D01"] + 2.5)), ("L8a/b/c (LED)", (E["L8a"][0], E["L8c"][1])), ("L9 toa P02", tuple(E["L9"])),
            ("L10 N05", tuple(E["L10"])), ("N06 pertanyaan", tuple(E["L11"])), ("Doom + kartu", (E["doom"], E["doom"] + 3.3)), ("S10 langkah mundur", (S10_START, S10_START + 3.5))]
    for name, (t0, t1) in wins:
        seg = g[int(t0 / 0.005):int(t1 / 0.005)]
        j = int(np.argmin(seg))
        lines.append(f"  GR {name:30s} ({t0:6.2f}-{t1:6.2f} s): maks {-seg.min():4.1f} dB di {t0 + j * 0.005:6.2f} s, {float((seg < -1).sum() * 0.005):.2f} s > 1 dB")
    lines += extra_lines(out, out_aac, pre, END)
    cues_txt.write_text("\n".join(report) + "\n", encoding="utf-8")
    rep_txt.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(report))
    print("\n".join(lines))
    print("wrote", out, out_aac, cues_txt, rep_txt)


if __name__ == "__main__":
    main()
