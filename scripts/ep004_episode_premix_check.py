"""2026-11-004: PRE-CHECK of the full-episode mix (D-052). ANALYSIS ONLY: builds a premix of the planned cues in a scratch
folder, then the same master chain as the pilot (gain to -14 LUFS + alimiter, ceiling -2.6) and reports loudness, the master
gain and the limiter gain reduction (max, and in the whisper D01 window). It writes NO file into _media (work dir is an
argument) and changes no mix script. Cue levels = the rules of ep004_pilot_audio.py (VO -20/-21/-22.5 LUFS, SFX peak rules).
Approximation: the retreat footsteps (S10) and a few small foleys are not included; expect +-1 dB on the integrated loudness.

usage:  python scripts/ep004_episode_premix_check.py <work_dir>
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402

ROOT = PA.ROOT
VO = ROOT / "_media/2026-11-004/audio/vo_raw"
SFX = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
PLAN = json.loads((ROOT / "studio/src/ep004/episode004-plan-draft.json").read_text(encoding="utf-8"))
PILOT = json.loads((ROOT / "studio/src/ep004/pilot004-plan-v3.json").read_text(encoding="utf-8"))
WORK = Path(sys.argv[1])
WORK.mkdir(parents=True, exist_ok=True)
E, M, SH = PLAN["events"], PLAN["measured"], PLAN["shots"]
N01_SPLIT = 3.78
END = PLAN["total"]


def peak_of(w):
    return float(PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(w), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr.split("Overall")[-1].split("Peak level dB:")[1].split()[0])


def vo(seg, speech_start, who, extra=""):
    """file start = speech start - lead (the take is not edited)"""
    f = VO / f"2026-11-004_vo_{seg}_take01.mp3"
    chain = {"n": "", "adik": "highpass=f=90", "toa": "apad=pad_dur=0.6," + PA.TOA_CHAIN}[who]
    return (f, extra + ("," if extra and chain else "") + chain, speech_start - M[seg]["lead"], ("lufs", {"n": -20.0, "adik": -22.5, "toa": -21.0}[who]), f"VO {seg}")


n01_gain = -20.0 - PA.lufs(VO / "2026-11-004_vo_N01_take01.mp3")[0]
l3_file_start = 3.0 + N01_SPLIT + PILOT["shift"]
cues = [
    (VO / "2026-11-004_vo_N01_take01.mp3", f"atrim=0:{N01_SPLIT},asetpts=PTS-STARTPTS", 3.0, ("gain", n01_gain), "VO N01 L1-L2"),
    (VO / "2026-11-004_vo_N01_take01.mp3", f"atrim={N01_SPLIT},asetpts=PTS-STARTPTS", l3_file_start, ("gain", n01_gain), "VO N01 L3"),
    vo("P01", E["L4"][0], "toa"), vo("N02", E["L5"][0], "n"), vo("N03", E["L6"][0], "n"), vo("D01", E["L7_D01"], "adik"),
    vo("N04a", E["L8a"][0], "n"), vo("N04b", E["L8b"][0], "n"), vo("N04c", E["L8c"][0], "n"),
    vo("P02", E["L9"][0], "toa"), vo("N05", E["L10"][0], "n"), vo("N06", E["L11"][0], "n"),
]
B = PILOT["beats"]
cues += [
    (SFX / "Old_round_doorknob.wav", "atrim=0:0.45,asetpts=PTS-STARTPTS,afade=t=out:st=0.38:d=0.07", B["knobTurn"], ("peak", -12), "kenop berputar"),
    (SFX / "Old_round_doorknob.wav", "atrim=1.70:2.00,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.24:d=0.06", B["knobStrain"], ("peak", -14), "kenop tertahan"),
    (SFX / "A_small_metal_barrel_#3.mp3", "atrim=0.10:0.55,asetpts=PTS-STARTPTS,afade=t=out:st=0.37:d=0.08", B["boltRattle"], ("peak", -11), "gerendel"),
    (SFX / "Old_round_doorknob.wav", "atrim=2.20:2.60,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.33:d=0.07", B["knobBack"], ("peak", -13), "kenop kembali"),
    (SFX / "Muffled_held_breath.wav", "atrim=0:2.4,asetpts=PTS-STARTPTS,afade=t=out:st=2.1:d=0.3", B["breath"], ("peak", -20), "napas"),
    (SFX / "Muffled_held_breath.wav", "atrim=1.35:2.35,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=0.75:d=0.25", B["breath2"], ("peak", -25), "napas 2"),
    (SFX / "Relaxed_footsteps_alley.wav", "lowpass=f=2500", B["steps"], ("peak", -22), "langkah gang"),
    (SFX / "1 Click Mouse.mp3", "", B["recapClick"], ("peak", -16), "klik recap"),
]
for name, key in (("toa buka 1", "toa_open1"), ("toa buka 2", "toa_open2")):
    cues.append((SFX / "A_distant_outdoor_pu_#4.mp3", "atrim=0:1.0,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.3,highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16", E[key], ("peak", -12), name))
for name, key in (("getar 1", "vib1"), ("getar 2", "vib2")):
    cues.append((SFX / "A_smartphone_vibrati_#2.mp3", "", E[key], ("peak", -14), name))
for i, key in enumerate(["LED1_click", "LED2_click", "LED3_click", "LED4_click"], 1):
    cues.append((SYN / "switch_click.wav", "atrim=0:0.2,asetpts=PTS-STARTPTS,highpass=f=1800,afade=t=out:st=0.12:d=0.08", E[key], ("peak", -22), f"LED{i} klik"))
cues += [
    (SFX / "A_very_soft_single_f_#1.mp3", "", E["screen_on"][0] - 0.05, ("peak", -22), "layar ponsel"),
    (SFX / "Two_deep_cinematic_Doom.wav", "", E["doom"], ("peak", -7), "dentuman kartu (Doom)"),
    (SFX / "Quiet_night_ambience_#3.mp3", f"aloop=loop=-1:size=2e9,atrim=0:{END + 0.5},afade=t=in:d=0.3", 0.0, ("rms", -36), "bed malam"),
    (SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{END + 0.5},lowpass=f=2600", 0.0, ("rms", -42), "dengung toa"),
]
tracks = []
for i, (src, filt, at, (kind, target), label) in enumerate(cues):
    w = PA.render_cue(src, filt, WORK, f"e{i:02d}")
    cur = 0.0 if kind == "gain" else PA.lufs(w)[0] if kind == "lufs" else peak_of(w) if kind == "peak" else PA.rms_af(w, "anull")
    tracks.append((w, at, target - cur))
args, fl = [], []
for j, (w, at, g) in enumerate(tracks):
    args += ["-i", str(w)]
    fl.append(f"[{j}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}|{int(round(at * 1000))},apad=whole_dur={END + 0.5}[t{j}]")
fl.append("".join(f"[t{j}]" for j in range(len(tracks))) + f"amix=inputs={len(tracks)}:normalize=0:duration=longest,atrim=0:{END + 0.04}[m]")
pre = WORK / "episode_premix_check.wav"
r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", ";".join(fl), "-map", "[m]", "-ac", "2", "-ar", str(PA.SR), "-c:a", "pcm_f32le", str(pre)])
if r.returncode:
    sys.exit(r.stderr)
i0, pk0 = PA.lufs(pre)
print(f"premix: {i0:.2f} LUFS integrated, sample peak {pk0:.1f} dBFS, length {END + 0.04:.2f} s, {len(cues)} cues")
gain, ceil = -14.0 - i0, -2.6
for it in range(6):
    out = WORK / f"episode_master_check{it}.wav"
    PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre), "-af", f"volume={gain:.2f}dB,alimiter=limit={10 ** (ceil / 20):.4f}:attack=2:release=60:level=disabled", "-c:a", "pcm_s16le", str(out)])
    i1, tp = PA.true_peak(out)
    print(f"  master {it}: gain {gain:+.2f} dB ceiling {ceil:.1f} -> {i1:.2f} LUFS, TP {tp:.2f} dBTP")
    if abs(i1 + 14) <= 0.5 and tp <= -1.5:
        break
    gain += -14.0 - i1
    if tp > -1.5:
        ceil -= 0.4
gr = PA.limiter_gr(pre, out, gain)
print(f"limiter GR max {gr[0]:.1f} dB at {gr[1]:.2f} s; {gr[2]:.2f} s above 1 dB; lag {gr[3]}")
# whisper window D01 and per-VO windows
import numpy as np  # noqa: E402
a = PA.pcm_np(pre) * 10 ** (gain / 20)
b = PA.pcm_np(out)
n = min(len(a), len(b))
lag = gr[3]
if lag > 0:
    b = b[lag:]
    a = a[:len(b)]
elif lag < 0:
    a = a[-lag:]
    b = b[:len(a)]
k = int(0.005 * PA.SR)
m = min(len(a), len(b)) // k
ea = np.sqrt((a[:m * k].reshape(m, k) ** 2).mean(1)) + 1e-12
eb = np.sqrt((b[:m * k].reshape(m, k) ** 2).mean(1)) + 1e-12
g = np.where(ea > 10 ** (-40 / 20), 20 * np.log10(eb / ea), 0.0)
for name, (t0, t1) in (("D01 bisikan", (E["L7_D01"], E["L7_D01"] + 2.5)), ("N06 pertanyaan", E["L11"]), ("Doom + kartu", (E["doom"], E["doom"] + 3.5)), ("L1-L3", (3.0, 12.4))):
    seg = g[int(t0 / 0.005):int(t1 / 0.005)]
    print(f"  GR di {name:14s} ({t0:6.2f}-{t1:6.2f} s): maks {-seg.min():.1f} dB, {float((seg < -1).sum() * 0.005):.2f} s > 1 dB")
# the pilot v3 premix for comparison (same method)
pp = ROOT / "_media/2026-11-004/audio/pilot/work/2026-11-004_pilot_v3_mix_premix.wav"
po = ROOT / "_media/2026-11-004/audio/pilot/2026-11-004_pilot_v3_mix.wav"
if pp.exists() and po.exists():
    print(f"pilot v3 untuk pembanding: premix {PA.lufs(pp)[0]:.2f} LUFS, master gain +10.80 dB, GR maks 8.9 dB (laporan v3)")
