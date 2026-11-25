"""Sound-design proposal for the 2026-11-002 animatic v3 (D-033): SFX selected from the owner's collection
(refrences/SFX/) plus a few synthesised fillers where the collection has no foley (scripts/sfx_synth.py, D-029).
No music (pending the owner's decision). Claude cannot listen: every cue is a CANDIDATE for the owner to hear.

- Stem: the approved animatic mix v2 (audio v2 + the D-025 toa repeats), resampled to 48 kHz, padded to the picture
  end (99.563 s, the D-025 +1 s hold).
- The originals are never written: each used file is copied to _media/2026-11-002/sfx/collection/src/ and processed
  copies go to _media/2026-11-002/sfx/collection/proc/.
- Levels against the speech (inkbeat-shorts audio-and-voice.md): one-shots peak ~8 dB under the voice peak (story
  reveals at -10), beds ~22-28 dB under the speech RMS; no bed during the A09 silence (L18 end -> L19 start); nothing
  within 0.5 s of adik's whisper (L24) except the low room tone. Two-pass loudnorm -14 LUFS / -1 dBTP.
- Writes the cue sheet (CSV) next to the mix. Refuses to overwrite.

usage: python scripts/ep002_animatic_v3_mix.py
"""
import csv
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
COL = ROOT / "_media/2026-11-002/sfx/collection"
STEM = ROOT / "_media/2026-11-002/audio/animatic/2026-11-002_animatic_mix_v2.wav"
OUT = ROOT / "_media/2026-11-002/audio/animatic/2026-11-002_animatic_v3_sfx_mix.wav"
PRE = ROOT / "_media/2026-11-002/audio/animatic/2026-11-002_animatic_v3_sfx_premaster.wav"
SHEET = ROOT / "_media/2026-11-002/audio/animatic/2026-11-002_animatic_v3_cue_sheet.csv"
PLAN = json.load(open(ROOT / "studio/src/ep002/plan-2026-11-002.json", encoding="utf-8"))
END = PLAN["frames"] / 30 + 0.04  # picture end (2987 frames) + 40 ms, so the mux never trims the last frame
SR = 48000
L = {l["id"]: l for l in PLAN["lines"]}

PRODUCERSPOT = "ProducerSpot free pack (rename_map.csv: producerspot-sfx-NN) — licence NOT verified"
UNKNOWN = "source/licence unknown (free download, no notes) — verify before publishing"
SYNTH = "synthesised by Claude (scripts/sfx_synth.py, D-029) — no third-party rights"

# (file, origin, start s, kind, extra dB, ffmpeg filter on the copy, purpose, licence)
#   kind: "shot" one-shot vs the voice peak · "reveal" story hit · "bed" vs the speech RMS
CUES = [
    # ambience: crickets outside (exteriors), a low room tone inside; never through the A09 silence
    ("crickets_bed.wav", "synth", 0.0, "bed", -2, "atrim=0:4.95,afade=t=in:d=0.3,afade=t=out:st=4.6:d=0.3", "A01 night outside", SYNTH),
    ("crickets_bed.wav", "synth", 16.15, "bed", -2, "atrim=0:6.6,afade=t=in:d=0.4,afade=t=out:st=6.2:d=0.4", "A05 window / street", SYNTH),
    ("crickets_bed.wav", "synth", 49.96, "bed", -2, "atrim=0:8.8,afade=t=in:d=0.4,afade=t=out:st=8.4:d=0.4", "A10 toa + plate outside", SYNTH),
    ("crickets_bed.wav", "synth", 68.2, "bed", -2, "atrim=0:12.55,afade=t=in:d=0.4,afade=t=out:st=12.1:d=0.45", "A13b-A14 street", SYNTH),
    ("room_tone.wav", "synth", 4.77, "bed", -6, "atrim=0:11.4,afade=t=in:d=0.2,afade=t=out:st=11.0:d=0.4", "A02-A04 bedroom quiet", SYNTH),
    # the toa switching on (end of L1 "...karena pengeras suara kompleks.") and again on L26
    ("Radio Adjustment.mp3", "col", 4.42, "shot", -4, "atrim=0:0.75,highpass=f=300,lowpass=f=3500,afade=t=in:d=0.03,afade=t=out:st=0.5:d=0.25", "A01 the toa switches on", UNKNOWN),
    ("Radio Adjustment.mp3", "col", L["L26"]["start"] - 0.05, "shot", -6, "atrim=0:0.6,highpass=f=300,lowpass=f=3500,afade=t=in:d=0.03,afade=t=out:st=0.4:d=0.2", "A13a the toa comes back on", UNKNOWN),
    # A03: he sits up (no foley in the collection)
    ("rustle.wav", "synth", 8.18, "shot", -9, "", "A03 blanket as he sits up", SYNTH),
    # A04: "Itu suaramu." — the premise reveal
    ("Sub Drop 2.mp3", "col", L["L4"]["start"] - 0.05, "reveal", -8, "atrim=0:2.6,afade=t=out:st=2.0:d=0.6", "A04 reveal: it is your voice", UNKNOWN),
    # A07: the officer's message arrives (L13 "Lalu masuk pesan...")
    ("sfx-10_pluck_tonal_short.wav", "col", L["L13"]["start"] + 0.95, "shot", -6, "atrim=0:0.7,afade=t=out:st=0.45:d=0.25", "A07 phone notification", PRODUCERSPOT),
    # A09: the announcement cuts off (L18 "Pengumuman itu berhenti.") — then real silence until L19
    ("Glitch 1.mp3", "col", PLAN["beats"]["toaStops"] - 0.03, "shot", -10, "highpass=f=400,afade=t=out:st=0.35:d=0.2", "A09 the toa cuts off", UNKNOWN),
    # A10b: the "7" plate (L22 "Nomor rumahmu.")
    ("Deep Hit 3.mp3", "col", L["L22"]["start"] - 0.05, "reveal", -2, "atrim=0:2.5,afade=t=out:st=1.8:d=0.7", "A10b reveal: your house number", UNKNOWN),
    # A12: the light switch (beat lightOff)
    ("1 Click Mouse.mp3", "col", PLAN["beats"]["lightOff"] - 0.02, "shot", 0, "", "A12 light switch click", UNKNOWN),
    # A14: the first head turns toward the house (L29)
    ("Hit 1.mp3", "col", L["L29"]["start"], "reveal", -4, "atrim=0:2.2,afade=t=out:st=1.6:d=0.6", "A14 the heads turn", UNKNOWN),
    # A17: the choice cards appear
    ("Dramatic Impact.mp3", "col", PLAN["beats"]["cards"] - 0.05, "reveal", -4, "atrim=start=1.42:end=5.0,asetpts=PTS-STARTPTS,afade=t=out:st=2.6:d=1.0", "A17 choice cards", UNKNOWN),
]


def stats(path, af=""):
    chain = (af + "," if af else "") + "astats=metadata=0"
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", chain, "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    ov = e[e.rfind("Overall"):] if "Overall" in e else e
    return float(re.findall(r"Peak level dB:\s*(-?[\d.inf]+)", ov)[-1]), float(re.findall(r"RMS level dB:\s*(-?[\d.inf]+)", ov)[-1])


def main():
    for p in (OUT, PRE, SHEET):
        if p.exists():
            sys.exit(f"REFUSED (exists): {p}")
    (COL / "src").mkdir(parents=True, exist_ok=True)
    (COL / "proc").mkdir(parents=True, exist_ok=True)
    v_peak, v_rms = stats(STEM)
    print(f"speech stem: peak {v_peak:.1f} dB, RMS {v_rms:.1f} dB")
    inputs = ["-i", str(STEM)]
    fl = [f"[0:a]aresample={SR},aformat=sample_rates={SR}:channel_layouts=mono,apad=whole_dur={END}[vo]"]
    names, rows = [], []
    for i, (f, origin, st, kind, extra, filt, purpose, lic) in enumerate(CUES, start=1):
        if origin == "col":
            orig = SRC / f
            copy = COL / "src" / f
            if not copy.exists():
                shutil.copy2(orig, copy)  # the original stays untouched
        else:
            copy = SYN / f
        proc = COL / "proc" / f"{i:02d}_{Path(f).stem}.wav"
        if not proc.exists():
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(copy), "-af", (filt + "," if filt else "") + f"aresample={SR}", "-ac", "1", "-c:a", "pcm_s24le", str(proc)], check=True)
        c_peak, c_rms = stats(proc)
        if kind == "bed":
            g = (v_rms - 24) - c_rms
        elif kind == "reveal":
            g = (v_peak - 10) - c_peak
        else:
            g = (v_peak - 8) - c_peak
        g += extra
        inputs += ["-i", str(proc)]
        fl.append(f"[{i}:a]volume={g:.2f}dB,adelay={int(round(st * 1000))}:all=1[c{i}]")
        names.append(f"c{i}")
        rows.append({"cue": i, "time_s": round(st, 3), "file": f, "original_path": f"refrences/SFX/{f}" if origin == "col" else f"_media/2026-11-002/sfx/{f} (synth)", "processed_copy": str(proc.relative_to(ROOT)), "purpose": purpose, "processing": filt or "none", "gain_dB": round(g, 1), "level_rule": {"bed": "speech RMS -24 dB", "reveal": "voice peak -10 dB", "shot": "voice peak -8 dB"}[kind] + (f" {extra:+d} dB" if extra else ""), "licence": lic, "status": "CANDIDATE — owner to listen"})
        print(f"  {i:2d} {st:7.2f}s {kind:6s} {g:6.1f} dB  {f}")
    fl.append("[vo]" + "".join(f"[{n}]" for n in names) + f"amix=inputs={len(names) + 1}:normalize=0:duration=first,atrim=0:{END}[pre]")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fl), "-map", "[pre]", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s24le", str(PRE)], check=True)
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(PRE), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(e[e.rfind("{"):e.rfind("}") + 1])
    ln = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(PRE), "-af", ln + f",aresample={SR}", "-ac", "2", "-c:a", "pcm_s16le", str(OUT)], check=True)
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(OUT), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = e[e.rfind("Summary"):]
    print("wrote", OUT, re.search(r"I:\s*(-?[\d.]+) LUFS", summ).group(0), re.search(r"Peak:\s*(-?[\d.]+) dBFS", summ).group(0))
    with open(SHEET, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print("cue sheet", SHEET)


if __name__ == "__main__":
    main()
