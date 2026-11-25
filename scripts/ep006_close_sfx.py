"""Ep 5 (2026-11-006) closing-shot SFX preview: boom (sfx-19) at the first palm-to-lens contact, a quieter synthesized
static burst at the picture cut, boom tail cut before TAMAT, TAMAT silent. Silent animatic v0b in, MP4 out (video copied).
Run: python -X utf8 scripts/ep006_close_sfx.py   (refuses to overwrite)
Times from studio/tools/e006_hit.ts: contact f99 = 3.300 s (palm 3.9 cm from the lens), picture cut f102 = 3.400 s.
sfx-22_white-noise_burst_short.wav is a Vorbis-in-WAV (format 0x674f) that ffmpeg cannot decode (same as sfx-14), so the
static is synthesized (seeded white noise)."""
import subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
SRC = ROOT / "_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0b.mp4"
OUT = ROOT / "_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0c_sfx.mp4"
WAV = ROOT / "_media/2026-11-006/audio/close/2026-11-006_close_sfx_v0c.wav"
BOOM = ROOT / "refrences/SFX/sfx-19_kick-boom_low_impact.wav"
T_HIT, T_CUT, T_TAMAT, DUR = 99 / 30, 102 / 30, 3.9, 192 / 30
BOOM_PEAK_DB, STATIC_PEAK_DB = -4.0, -15.0
TAIL_END, TAIL_FADE = 3.85, 0.12  # boom ends 50 ms before TAMAT starts fading in (3.9 s)

if OUT.exists() or WAV.exists():
    sys.exit(f"refuse to overwrite {OUT.name} / {WAV.name}")
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(BOOM), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
boom = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
boom *= 10 ** (BOOM_PEAK_DB / 20) / np.abs(boom).max()
n = int(round((TAIL_END - T_HIT) * SR))
boom = boom[:n]
f = int(TAIL_FADE * SR)
boom[-f:] *= np.linspace(1, 0, f)[:, None] ** 2
rng = np.random.default_rng(6006)
ns = int(round(0.1 * SR))  # 3 frames
st = rng.uniform(-1, 1, (ns, 2)).astype(np.float32)
env = np.minimum(1, np.arange(ns) / (0.004 * SR)) * np.exp(-np.arange(ns) / (0.03 * SR))
st *= env[:, None]
st *= 10 ** (STATIC_PEAK_DB / 20) / np.abs(st).max()
st[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))[:, None]
mix = np.zeros((int(DUR * SR), 2), dtype=np.float32)
a = int(round(T_HIT * SR)); mix[a:a + len(boom)] += boom
b = int(round(T_CUT * SR)); mix[b:b + len(st)] += st
assert np.abs(mix).max() <= 10 ** (-1.0 / 20), "peak over -1 dBFS"
WAV.parent.mkdir(parents=True, exist_ok=True)
import wave
with wave.open(str(WAV), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-n", "-i", str(SRC), "-i", str(WAV), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", str(OUT)], check=True)
print("wrote", OUT, "| hit", round(T_HIT, 3), "static", round(T_CUT, 3), "peak dBFS", round(20 * np.log10(np.abs(mix).max()), 2))
