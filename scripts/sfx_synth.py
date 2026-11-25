"""Procedural SFX, ambience and music for the project (D-029): every sound is synthesised from math with ffmpeg's
`aevalsrc` / noise sources — no third-party samples, so no licence questions. Deterministic (fixed seeds).

usage: python scripts/sfx_synth.py <out_dir> [names...]      (default: all)
Writes 48 kHz mono WAVs; refuses to overwrite an existing file.

Sounds (name: what it is, length):
  switch_click   wall light switch: plastic tick + short body thump, 0.25 s
  crickets_bed   night ambience: crickets (pulsed 4.4/5.1 kHz chirps, two groups) + soft distant air, 20 s, loopable
  room_tone      quiet indoor room tone (filtered brown noise + faint 100 Hz mains hum), 20 s
  toa_hum        distant loudspeaker switching on: click + 120 Hz hum + rising feedback whine, band-passed, 2.5 s
  drone_tension  low tension music bed: detuned 55/55.4 Hz + fifth, slow filter swell, 20 s
  heartbeat      soft low double thump (for fear beats), 1.0 s
Claude cannot listen: levels are measured (peak/LUFS), the owner judges the sound.
"""
import subprocess
import sys
from pathlib import Path

SR = 48000
SOUNDS = {
    "switch_click": (0.25, "aevalsrc=exprs='(0.9*sin(2*PI*3100*t)+0.5*sin(2*PI*5300*t))*exp(-t*380)*lt(t\\,0.03)+0.6*sin(2*PI*180*t)*exp(-t*60)*gte(t\\,0.004)':s=48000:d=0.25,highpass=f=90,volume=0.7"),
    "crickets_bed": (20, "aevalsrc=exprs='0.20*sin(2*PI*4400*t)*gt(sin(2*PI*28*t)\\,0.2)*gt(sin(2*PI*0.83*t+0.4)\\,-0.1)+0.14*sin(2*PI*5100*t)*gt(sin(2*PI*33*t+1)\\,0.3)*gt(sin(2*PI*0.61*t+2.1)\\,0.0)':s=48000:d=20[c];anoisesrc=color=pink:seed=7:amplitude=0.05:d=20:r=48000,lowpass=f=900,highpass=f=120[a];[c][a]amix=inputs=2:normalize=0,lowpass=f=7000"),
    "room_tone": (20, "anoisesrc=color=brown:seed=11:amplitude=0.12:d=20:r=48000,lowpass=f=260[n];aevalsrc=exprs='0.012*sin(2*PI*100*t)+0.006*sin(2*PI*200*t)':s=48000:d=20[h];[n][h]amix=inputs=2:normalize=0"),
    "toa_hum": (2.5, "aevalsrc=exprs='0.7*exp(-t*90)*sin(2*PI*900*t)*lt(t\\,0.05)+0.25*min(1\\,t*3)*sin(2*PI*120*t)+0.18*min(1\\,max(0\\,t-0.6))*sin(2*PI*(1150+90*t)*t)*(0.7+0.3*sin(2*PI*5*t))':s=48000:d=2.5,bandpass=f=1200:width_type=h:w=1800,aecho=0.6:0.5:110|240:0.35|0.22,afade=t=out:st=2.1:d=0.4"),
    "drone_tension": (20, "aevalsrc=exprs='0.22*sin(2*PI*55*t)+0.22*sin(2*PI*55.4*t)+0.10*sin(2*PI*82.4*t)+0.05*sin(2*PI*110.3*t)':s=48000:d=20,lowpass=f=400,volume='0.6+0.4*sin(2*PI*t/10)':eval=frame,afade=t=in:d=2,afade=t=out:st=18:d=2"),
    "heartbeat": (1.0, "aevalsrc=exprs='0.9*sin(2*PI*55*t)*exp(-t*18)+0.7*sin(2*PI*50*(t-0.28))*exp(-(t-0.28)*16)*gte(t\\,0.28)':s=48000:d=1,lowpass=f=180"),
    # 2026-11-16 pilot (D-031): blanket rustle as he sits up, a bed creak, a quiet wall-clock tick
    "rustle": (0.8, "anoisesrc=color=pink:seed=21:amplitude=0.6:d=0.8:r=48000,bandpass=f=2400:width_type=h:w=3000,volume='0.15+0.85*sin(PI*min(1\\,t/0.8))*(0.6+0.4*sin(2*PI*9*t))':eval=frame,afade=t=in:d=0.04,afade=t=out:st=0.6:d=0.2"),
    "bed_creak": (0.6, "aevalsrc=exprs='0.5*sin(2*PI*(310+120*sin(2*PI*3*t))*t)*(0.5+0.5*sin(2*PI*31*t))*exp(-t*3.5)':s=48000:d=0.6,bandpass=f=600:width_type=h:w=700,afade=t=in:d=0.02,afade=t=out:st=0.45:d=0.15"),
    "clock_tick": (0.06, "aevalsrc=exprs='(0.8*sin(2*PI*4200*t)+0.4*sin(2*PI*2600*t))*exp(-t*420)':s=48000:d=0.06,highpass=f=800"),
}


def make(out: Path, name: str):
    dur, graph = SOUNDS[name]
    f = out / f"{name}.wav"
    if f.exists():
        print(f"REFUSED (exists): {f}")
        return
    complex_ = ";" in graph or "[" in graph
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error"]
    if complex_:
        cmd += ["-filter_complex", graph, "-t", str(dur)]
    else:
        cmd += ["-f", "lavfi", "-i", graph, "-t", str(dur)]
    cmd += ["-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(f)]
    subprocess.run(cmd, check=True)
    st = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-af", "astats=metadata=0", "-f", "null", "-"], capture_output=True, text=True).stderr
    peak = [l.split(":")[-1].strip() for l in st.splitlines() if "Peak level dB" in l][-1]
    print(f"{name}: {f.name} {dur}s peak {peak} dB")


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for n in sys.argv[2:] or SOUNDS:
        make(out, n)
