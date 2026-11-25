"""Measure every file of the owner's SFX collection (refrences/SFX/) without listening (D-033): duration, channels,
sample rate, leading silence, peak and RMS (dBFS), integrated loudness (LUFS), spectral centroid and flatness
(aspectralstats, mean over the file), the attack (time to reach -6 dB of the peak), the share of the file above
-30 dBFS (how sustained it is), and the metadata tags. Read-only: the originals are never written.

usage: python scripts/sfx_analyze.py <sfx_dir> <out.csv>
"""
import csv
import json
import re
import subprocess
import sys
from pathlib import Path


def run(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")


def probe(f):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=sample_rate,channels:format_tags", "-of", "json", str(f)])
    j = json.loads(r.stdout)
    st = j["streams"][0]
    tags = {**j.get("format", {}).get("tags", {}), **(j["streams"][0].get("tags", {}) if j.get("streams") else {})}
    return float(j["format"]["duration"]), int(st["channels"]), int(st["sample_rate"]), tags


def levels(f):
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr
    ov = e[e.rfind("Overall"):] if "Overall" in e else e
    peak = float(re.findall(r"Peak level dB:\s*(-?[\d.inf]+)", ov)[-1])
    rms = float(re.findall(r"RMS level dB:\s*(-?[\d.inf]+)", ov)[-1])
    # loudness separately, padded (very short files have no gated block otherwise)
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-af", "apad=pad_dur=1,ebur128=framelog=quiet", "-f", "null", "-"]).stderr
    m = re.search(r"I:\s*(-?[\d.]+) LUFS", e[e.rfind("Summary"):])
    return peak, rms, float(m.group(1)) if m else float("nan")


def spectral(f):
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-af", "aformat=channel_layouts=mono,aspectralstats=measure=centroid+flatness,ametadata=print:file=-", "-f", "null", "-"]).stdout
    c = [float(x) for x in re.findall(r"centroid=([\d.]+)", e)]
    fl = [float(x) for x in re.findall(r"flatness=([\d.]+)", e)]
    return (sum(c) / len(c) if c else float("nan")), (sum(fl) / len(fl) if fl else float("nan"))


def envelope(f, peak):
    # RMS per 10 ms window: leading silence (< -50 dBFS), attack (to -6 dB of peak), share above -30 dBFS
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-af", "aformat=channel_layouts=mono,asetnsamples=n=441:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.Peak_level:file=-", "-f", "null", "-"]).stdout
    v = [float(x) if "inf" not in x else -120.0 for x in re.findall(r"Peak_level=(-?[\d.inf]+)", e)]
    if not v:
        return float("nan"), float("nan"), float("nan")
    step = 0.01
    lead = next((i for i, x in enumerate(v) if x > -50), len(v)) * step
    att = next((i for i, x in enumerate(v) if x > peak - 6), len(v)) * step - lead
    sus = sum(1 for x in v if x > -30) / len(v)
    return lead, att, sus


def main(d, out):
    rows = []
    for f in sorted(Path(d).iterdir()):
        if f.suffix.lower() not in (".mp3", ".wav"):
            continue
        dur, ch, sr, tags = probe(f)
        try:
            peak, rms, lufs = levels(f)
        except (IndexError, ValueError):
            # e.g. a WAV container around a codec ffmpeg cannot decode: recorded, not used
            rows.append({"file": f.name, "dur_s": round(dur, 2), "ch": ch, "sr": sr, "lead_silence_s": "", "attack_s": "", "share_above_-30dB": "", "peak_dBFS": "", "rms_dBFS": "", "LUFS": "", "centroid_Hz": "", "flatness": "", "tags": "UNDECODABLE; " + "; ".join(f"{k}={v}" for k, v in tags.items())})
            print(f"{f.name:55s} UNDECODABLE")
            continue
        cen, flat = spectral(f)
        lead, att, sus = envelope(f, peak)
        rows.append({"file": f.name, "dur_s": round(dur, 2), "ch": ch, "sr": sr, "lead_silence_s": round(lead, 2), "attack_s": round(att, 2), "share_above_-30dB": round(sus, 2), "peak_dBFS": round(peak, 1), "rms_dBFS": round(rms, 1), "LUFS": round(lufs, 1), "centroid_Hz": round(cen), "flatness": round(flat, 3), "tags": "; ".join(f"{k}={v}" for k, v in tags.items())})
        print(f"{f.name:55s} {dur:6.2f}s lead {lead:4.2f} att {att:4.2f} sus {sus:4.2f} pk {peak:6.1f} rms {rms:6.1f} cen {cen:6.0f} flat {flat:5.3f}")
    with open(out, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
