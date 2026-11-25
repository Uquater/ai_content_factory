"""Signal analysis of the owner's SFX variant sets in refrences/SFX/ (files named "<prompt prefix>_#<n>.mp3", 4
variants per kind, added 2026-11-18). Claude cannot listen: everything here is measured, nothing is judged by ear.

Per file: size, MD5 of the file bytes, MD5 of the decoded PCM (48 kHz mono f32), duration, channels, sample rate,
codec/bitrate, tags (encoder), sample peak, true peak, integrated loudness (LUFS), RMS, leading/trailing silence
(-50 dB), onsets (transients: 10 ms RMS envelope rising >= 12 dB above the previous 60 ms, >= 120 ms apart, above
-40 dBFS), the loudest 10 ms window (time), the spectral centroid, and the start/end level (for loops).
Per kind: pairwise comparison of the variants (identical bytes? identical PCM? max normalised cross-correlation of
the 10 ms log-envelope and of the waveform at 8 kHz, any lag), so "are the four variants really different?" is
answered with numbers.

Read-only: the originals are never written.

usage: python scripts/sfx_variants_analyze.py <sfx_dir> <out_dir>
  writes <out_dir>/sfx_variants.csv, <out_dir>/sfx_variants_pairs.csv, <out_dir>/sfx_variants.json
"""
import csv
import hashlib
import json
import re
import subprocess
import sys
from itertools import combinations
from pathlib import Path

import numpy as np

KINDS = {
    "Quiet_night_ambience": "suasana malam (loop)",
    "Slow,_careful_footst": "langkah kaki pelan",
    "A_small_metal_barrel": "gerendel digeser + terkunci",
    "A_very_soft_single_f": "ketukan halus layar ponsel",
    "A_distant_outdoor_pu": "pembuka pengeras suara toa",
    "A_smartphone_vibrati": "getar ponsel (S08+, belum dipakai)",
    "Three_slow,_delibera": "tiga ketukan (S10, belum dipakai)",
    "Very_faint,_distant_": "gumam warga (TIDAK dipakai tanpa persetujuan)",
}
SR = 48000


def run(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")


def pcm(f, sr=SR):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def probe(f):
    j = json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration,bit_rate:format_tags:stream=codec_name,sample_rate,channels,bit_rate", "-of", "json", str(f)]).stdout)
    st = j["streams"][0]
    tags = {**j.get("format", {}).get("tags", {})}
    return {"dur": float(j["format"]["duration"]), "ch": int(st["channels"]), "sr": int(st["sample_rate"]), "codec": st.get("codec_name"), "kbps": round(int(j["format"].get("bit_rate", 0)) / 1000), "tags": tags}


def loudness(f):
    e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-af", "apad=pad_dur=1,ebur128=peak=true+sample:framelog=quiet", "-f", "null", "-"]).stderr
    s = e[e.rfind("Summary"):]
    i = re.search(r"I:\s*(-?[\d.]+) LUFS", s)
    tp = re.search(r"True peak:\s*Peak:\s*(-?[\d.inf]+)", s)
    sp = re.search(r"Sample peak:\s*Peak:\s*(-?[\d.inf]+)", s)
    return (float(i.group(1)) if i else float("nan")), (float(tp.group(1)) if tp else float("nan")), (float(sp.group(1)) if sp else float("nan"))


def db(x):
    return 20 * np.log10(max(float(x), 1e-12))


def env(x, sr=SR, win=0.01):
    n = int(win * sr)
    m = len(x) // n
    e = np.sqrt(np.mean(x[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e + 1e-12)


def onsets(e, win=0.01):
    out, last = [], -1e9
    for i in range(6, len(e)):
        prev = e[i - 6:i].mean()
        if e[i] > -40 and e[i] - prev >= 12 and (i - last) * win >= 0.12:
            out.append(round(i * win, 2))
            last = i
    return out


def centroid(x, sr=SR):
    if len(x) < 2048:
        return float("nan")
    seg = x[: (len(x) // 2048) * 2048].reshape(-1, 2048) * np.hanning(2048)
    mag = np.abs(np.fft.rfft(seg, axis=1))
    w = mag.sum(axis=1)
    f = np.fft.rfftfreq(2048, 1 / sr)
    keep = w > w.max() * 0.05
    return float(((mag[keep] * f).sum(axis=1) / w[keep]).mean())


def ncc_max(a, b):
    """max normalised cross-correlation over all lags (FFT)"""
    a = (a - a.mean()) / (a.std() + 1e-12)
    b = (b - b.mean()) / (b.std() + 1e-12)
    n = len(a) + len(b) - 1
    N = 1 << (n - 1).bit_length()
    c = np.fft.irfft(np.fft.rfft(a, N) * np.conj(np.fft.rfft(b, N)), N)
    return float(np.max(np.abs(c)) / min(len(a), len(b)))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    rows, pairs, store = [], [], {}
    for prefix, purpose in KINDS.items():
        files = sorted(src.glob(f"{prefix}*#*.mp3"), key=lambda p: int(re.search(r"#(\d+)", p.name).group(1)))
        sigs = {}
        for f in files:
            b = f.read_bytes()
            x = pcm(f)
            pr = probe(f)
            I, tp, sp = loudness(f)
            e = env(x)
            loud = e > -50
            lead = float(np.argmax(loud) * 0.01) if loud.any() else float("nan")
            trail = float((len(e) - 1 - np.argmax(loud[::-1])) * 0.01) if loud.any() else float("nan")
            k = int(re.search(r"#(\d+)", f.name).group(1))
            r = {
                "kind": prefix, "purpose": purpose, "variant": k, "file": f.name, "bytes": len(b),
                "md5_file": hashlib.md5(b).hexdigest(), "md5_pcm": hashlib.md5(x.astype(np.float32).tobytes()).hexdigest(),
                "dur_s": round(pr["dur"], 3), "ch": pr["ch"], "sr": pr["sr"], "codec": pr["codec"], "kbps": pr["kbps"],
                "encoder": pr["tags"].get("encoder", ""), "tags": ";".join(f"{a}={v}" for a, v in pr["tags"].items() if a != "encoder"),
                "peak_dbfs": round(db(np.abs(x).max()), 1), "true_peak_dbtp": tp, "lufs": I, "rms_db": round(db(np.sqrt(np.mean(x ** 2))), 1),
                "sound_from_s": lead, "sound_to_s": round(trail + 0.01, 2), "loudest_at_s": round(float(np.argmax(e)) * 0.01, 2),
                "onsets_s": " ".join(str(o) for o in onsets(e)), "centroid_hz": round(centroid(x)),
                "start_db": round(float(e[:20].mean()), 1), "end_db": round(float(e[-20:].mean()), 1),
            }
            rows.append(r)
            sigs[k] = (x, e, r)
            store.setdefault(prefix, {})[k] = {kk: vv for kk, vv in r.items() if kk not in ("kind", "purpose")}
        for a, b_ in combinations(sorted(sigs), 2):
            xa, ea, ra = sigs[a]
            xb, eb, rb = sigs[b_]
            d8a, d8b = xa[::6], xb[::6]  # 8 kHz
            # long beds: compare the first 20 s (enough to tell copies from different takes)
            lim = 8000 * 20
            pairs.append({
                "kind": prefix, "a": a, "b": b_,
                "same_bytes": ra["md5_file"] == rb["md5_file"], "same_pcm": ra["md5_pcm"] == rb["md5_pcm"],
                "dur_diff_s": round(abs(ra["dur_s"] - rb["dur_s"]), 3),
                "env_ncc": round(ncc_max(np.maximum(ea, -60), np.maximum(eb, -60)), 3),
                "wave_ncc": round(ncc_max(d8a[:lim], d8b[:lim]), 3),
            })
    with open(out / "sfx_variants.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    with open(out / "sfx_variants_pairs.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(pairs[0].keys()))
        w.writeheader()
        w.writerows(pairs)
    (out / "sfx_variants.json").write_text(json.dumps(store, ensure_ascii=False, indent=1), encoding="utf-8")
    for r in rows:
        print(f"{r['kind'][:20]:20s} #{r['variant']} {r['dur_s']:6.2f}s pk {r['peak_dbfs']:6.1f} tp {r['true_peak_dbtp']:6.1f} {r['lufs']:6.1f} LUFS  snd {r['sound_from_s']}-{r['sound_to_s']}  loud@{r['loudest_at_s']}  on[{r['onsets_s']}]  c{r['centroid_hz']}  {r['ch']}ch {r['sr']} {r['kbps']}k  md5 {r['md5_file'][:8]}  enc={r['encoder']} {r['tags']}")
    print("--- pairs")
    for p in pairs:
        print(f"{p['kind'][:20]:20s} #{p['a']}-#{p['b']} bytes={p['same_bytes']} pcm={p['same_pcm']} ddur={p['dur_diff_s']} env_ncc={p['env_ncc']} wave_ncc={p['wave_ncc']}")


if __name__ == "__main__":
    main()
