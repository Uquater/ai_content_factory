"""Pilot mix for 2026-11-002, first 15 s (A01-A04), D-031.

Dialogue stem = the approved animatic mix v2 (audio v2 unchanged + the D-025 toa repeat under L5), trimmed to the pilot.
Everything else is synthesised (scripts/sfx_synth.py, D-029): no third-party samples.
Levels follow inkbeat-shorts audio-and-voice.md, measured against the speech (not one global gain):
  beds (crickets, room tone) ~20 dB under the speech RMS; music bed ~14 dB under the speech RMS with a -3 dB duck under
  the voice; one-shots peak ~8 dB under the voice peak. Master: two-pass loudnorm -14 LUFS, -1 dBTP, LRA <= 7.
Claude cannot listen: every level is measured and printed; the owner judges the sound.

usage: python scripts/ep002_pilot_mix.py            (refuses to overwrite the output)
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "_media/2026-11-002"
STEM = MEDIA / "audio/animatic/2026-11-002_animatic_mix_v2.wav"
SFX = MEDIA / "sfx"
OUT_DIR = MEDIA / "audio/pilot"
OUT = OUT_DIR / "2026-11-002_pilot_mix_v1.wav"
DUR = 16.15 + 0.05  # the pilot picture ends where A05 starts (16.15 s)
SR = 48000

# cue: (file, start s, kind, extra dB, filter) — kind: "bed" | "music" | "shot"
CUES = [
    # A01 exterior: crickets in the open (0-4.77), then muffled through the bedroom wall (4.77-)
    ("crickets_bed.wav", 0.0, "bed", 0, "atrim=0:4.95,afade=t=out:st=4.77:d=0.18"),
    ("crickets_bed.wav", 4.77, "bed", -5, "atrim=0:11.5,lowpass=f=1800,afade=t=in:d=0.12"),
    ("room_tone.wav", 4.77, "bed", -2, "atrim=0:11.5,afade=t=in:d=0.12"),
    # the toa switching on at the end of L1 ("…karena pengeras suara kompleks.") before L2
    ("toa_hum.wav", 4.45, "shot", 0, ""),
    # A02-A04: the wall clock ticks once a second in the quiet bedroom
    *[("clock_tick.wav", 5.0 + i, "shot", -10, "") for i in range(11)],
    # A03: he sits up — blanket rustle and a bed creak on the move (L3 "Kamu langsung duduk.")
    ("rustle.wav", 8.18, "shot", -7, ""),
    ("bed_creak.wav", 8.36, "shot", -5, ""),
    # A04: heartbeat under L4-L5, every 0.9 s, very low
    *[("heartbeat.wav", 10.05 + 0.9 * i, "shot", -6, "") for i in range(7)],
    # music: a low tension drone, faint from the start, swelling into A04
    ("drone_tension.wav", 0.0, "music", 0, "atrim=0:16.2,volume='0.45+0.55*min(1\\,max(0\\,(t-9.9)/2.0))':eval=frame,afade=t=out:st=15.6:d=0.6"),
]


def run(args, **kw):
    return subprocess.run(args, check=True, capture_output=True, text=True, **kw)


def stats(path, extra=""):
    af = (extra + "," if extra else "") + "astats=metadata=0"
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", af, "-f", "null", "-"], capture_output=True, text=True).stderr
    overall = e[e.rfind("Overall"):] if "Overall" in e else e
    peak = float(re.findall(r"Peak level dB:\s*(-?[\d.inf]+)", overall)[-1])
    rms = float(re.findall(r"RMS level dB:\s*(-?[\d.inf]+)", overall)[-1])
    return peak, rms


def main():
    if OUT.exists():
        sys.exit(f"REFUSED (exists): {OUT}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    # speech reference: the stem over the pilot span
    v_peak, v_rms = stats(STEM, f"atrim=0:{DUR}")
    print(f"speech stem 0-{DUR:.2f}s: peak {v_peak:.1f} dB, RMS {v_rms:.1f} dB")
    inputs = ["-i", str(STEM)]
    fl = [f"[0:a]atrim=0:{DUR},aformat=sample_rates={SR}:channel_layouts=mono,asplit=2[vo][sc]"]
    names = []
    for i, (f, st, kind, extra, filt) in enumerate(CUES, start=1):
        p = SFX / f
        inputs += ["-i", str(p)]
        c_peak, c_rms = stats(p, filt.split(",volume")[0] if filt else "")
        if kind == "bed":
            g = (v_rms - 20) - c_rms
        elif kind == "music":
            g = (v_rms - 14) - c_rms
        else:
            g = (v_peak - 8) - c_peak
        g += extra
        chain = f"[{i}:a]aformat=sample_rates={SR}:channel_layouts=mono" + (f",{filt}" if filt else "") + f",volume={g:.2f}dB,adelay={int(st * 1000)}:all=1"
        lab = f"c{i}"
        if kind == "music":
            chain += f"[{lab}pre]"
            fl.append(chain)
            # -3 dB duck while the voice speaks (fast attack, slow release)
            fl.append(f"[{lab}pre][sc]sidechaincompress=threshold=0.03:ratio=2.2:attack=15:release=400:makeup=1[{lab}]")
        else:
            fl.append(chain + f"[{lab}]")
        names.append(lab)
        print(f"  {f:20s} @{st:6.2f}s {kind:5s} gain {g:6.1f} dB (cue peak {c_peak:.1f}, RMS {c_rms:.1f})")
    fl.append("[vo]" + "".join(f"[{n}]" for n in names) + f"amix=inputs={len(names) + 1}:normalize=0:duration=first,atrim=0:{DUR}[pre]")
    pre = OUT_DIR / "2026-11-002_pilot_premaster_v1.wav"
    if pre.exists():
        sys.exit(f"REFUSED (exists): {pre}")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[pre]", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s24le", str(pre)])
    # two-pass loudnorm
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(pre), "-af", "loudnorm=I=-14:TP=-1:LRA=7:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(e[e.rfind("{"):e.rfind("}") + 1])
    ln = (f"loudnorm=I=-14:TP=-1:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(pre), "-af", ln + f",aresample={SR}", "-ac", "2", "-c:a", "pcm_s16le", str(OUT)])
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(OUT), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = e[e.rfind("Summary"):]
    I = re.search(r"I:\s*(-?[\d.]+) LUFS", summ).group(1)
    lra = re.search(r"LRA:\s*(-?[\d.]+) LU", summ).group(1)
    tp = re.search(r"Peak:\s*(-?[\d.]+) dBFS", summ).group(1)
    print(f"wrote {OUT}: {I} LUFS, LRA {lra} LU, true peak {tp} dBFS")


if __name__ == "__main__":
    main()
