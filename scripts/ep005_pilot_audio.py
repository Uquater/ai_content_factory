"""2026-11-005 Episode 4, opening pilot v2 (owner 2026-11-23): the owner's ElevenLabs takes P01 (toa, Dhani) and D01
(adik, Zorin) from vo_raw (never written) placed on the pilot timeline, the Ep 3 toa chain on P01, a small SFX bed.

Step `plan`: finds each take's speech, places P01 so its first word starts just after the tape closes the lens, places D01
after a response gap that follows the end of the toa's last word, writes studio/src/ep005/pilot005v2-plan.json (picture reads it:
caption windows, adik's mouth frames from D01's own envelope, film length).
Step `mix`: VO + SFX + beds on the film timeline, master to -14 LUFS, true peak <= -1.5 dBTP. Refuses to overwrite.

v3 (owner 2026-11-23, after hearing v2: the toa sounded foreign), matched to the Ep 3 FINAL mix (scripts/ep004_episode_audio_v2.py,
measured against _media/2026-11-004/out/final_v1/episode_2026-11-004_final_v1.mp4):
  - the toa opener (A_distant_outdoor_pu_#4, same filter, peak -12) 1.0 s before the first toa word, as Ep 3 L4/L9;
  - bed = Quiet_night_ambience_#3 (Ep 3) at rms -36 and the toa hum at rms -42 for the whole clip (Ep 3), not only around P01;
  - master = Ep 3's fixed master (gain +7.5 dB, limiter ceiling -2.6 dB) instead of normalising this short, mostly quiet clip
    to -14 LUFS (v2 needed +15 dB: the toa came out 3-4 dB louder than in Ep 3 and limited, crest 12 vs 15.5 dB);
  - caption bursts measured as Ep 3 (silencedetect -40 dB, 0.12 s).
VO chain, VO level targets and the takes are unchanged.

usage:
  python scripts/ep005_pilot_audio.py plan [--v v3]
  python scripts/ep005_pilot_audio.py mix --name 2026-11-005_pilot_open_v2_mix
  python scripts/ep005_pilot_audio.py mix --v v3 --name 2026-11-005_pilot_open_v3_mix
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402  (speech, lufs, true_peak, render_cue, run, TOA_CHAIN)

ROOT = PA.ROOT
UNIT = "2026-11-005"
VO = ROOT / f"_media/{UNIT}/audio/vo_raw"
SFX = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
PLAN = ROOT / "studio/src/ep005/pilot005v2-plan.json"
PLAN_V3 = ROOT / "studio/src/ep005/pilot005v3-plan.json"
OPEN_AT = 4.70            # v3: toa opener starts 0.08 s after the tape touches the lens
OPEN_LEAD = 1.0           # v3: opener -> first toa word (Ep 3: L4 1.10 s, L9 1.00 s)
EP3_MASTER = (7.5, -2.6)  # Ep 3 final master: gain dB, limiter ceiling dB (2026-11-004_episode_v2_report.txt)
OUT_DIR = ROOT / f"_media/{UNIT}/audio/pilot"
WORK = OUT_DIR / "work"
SR = PA.SR
FPS = 30
TAPE_ON = 4.62          # film time the tape touches the lens (world 5.52 - 0.9 cut offset; open005v3 W.tape)
TOA_FIRST_WORD = 4.78   # first word of P01 starts 0.16 s after the lens is covered (v1 temp used 0.13)
RESP_GAP = 0.80         # end of the toa's last word -> first word of D01 (a natural beat to hear it and turn)
TAIL = 0.70             # silence after the end of D01's file before the film ends
S03B_CUT = 6.9          # film time of the cut S03 -> S03b (open005v3 W.end 7.8 - 0.9)


def env_frames(p, fps=FPS, thr_db=-38.0):
    """per picture-frame RMS (dB) of a take, as the mouth driver"""
    import numpy as np
    raw = PA.run_bytes(["ffmpeg", "-v", "error", "-i", str(p), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"])
    x = np.frombuffer(raw, np.float32)
    w = 16000 // fps
    n = len(x) // w
    db = [20 * np.log10(np.sqrt(np.mean(x[i * w:(i + 1) * w] ** 2)) + 1e-9) for i in range(n)]
    return [round(float(v), 1) for v in db], thr_db


def cmd_plan(a):
    v3 = a.v == "v3"
    pf = VO / f"{UNIT}_vo_P01_take01.mp3"
    df = VO / f"{UNIT}_vo_D01_take01.mp3"
    psp, pd = PA.speech(pf, min_sil=0.12)
    dsp, dd = PA.speech(df, min_sil=0.12)
    p_at = round((OPEN_AT + OPEN_LEAD if v3 else TOA_FIRST_WORD) - psp[0][0], 3)
    p_end = round(p_at + psp[-1][1], 3)
    d_first = round(p_end + RESP_GAP, 3)
    d_at = round(d_first - dsp[0][0], 3)
    d_speech_end = round(d_at + dsp[-1][1], 3)
    d_file_end = round(d_at + dd, 3)
    film_end = round(round((d_file_end + TAIL) * FPS) / FPS, 4)
    db, thr = env_frames(df)
    frames_open = [int(round((d_at + i / FPS) * FPS)) for i, v in enumerate(db) if v > thr]
    plan = {"fps": FPS, "tapeOn": TAPE_ON, "s03bCut": S03B_CUT, "filmEnd": film_end, "frames": int(round(film_end * FPS)),
            "P01": {"file": pf.name, "at": p_at, "speech": [[round(p_at + a, 3), round(p_at + b, 3)] for a, b in psp], "end": p_end, "fileEnd": round(p_at + pd, 3),
                    "text": "Kalian memilih menutupnya."},
            "D01": {"file": df.name, "at": d_at, "speech": [[round(d_at + a, 3), round(d_at + b, 3)] for a, b in dsp], "end": d_speech_end, "fileEnd": d_file_end,
                    "text": "Kalian siapa, Kak?", "mouthOpenFrames": frames_open},
            "respGap": RESP_GAP, "timing": "VO asli pemilik (P01, D01 take01), 2026-11-23"}
    if v3:
        # caption bursts measured as Ep 3 (silencedetect -40 dB, 0.12 s)
        plan["toaOpen"] = OPEN_AT
        plan["version"] = "v3"
        for k, f, at in (("P01", pf, p_at), ("D01", df, d_at)):
            sp40, _ = PA.speech(f, noise=-40, min_sil=0.12)
            plan[k]["capBursts"] = [[round(at + x, 3), round(at + y, 3)] for x, y in sp40]
    out = PLAN_V3 if v3 else PLAN
    out.write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: v for k, v in plan.items() if k not in ("D01",)}, ensure_ascii=False))
    print("D01", {k: v for k, v in plan["D01"].items() if k != "mouthOpenFrames"}, "mouth frames", len(frames_open), "of", int(round(dd * FPS)))
    print("wrote", out)


def cmd_mix(a):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{a.name}.wav"
    if out.exists():
        sys.exit(f"refuse to overwrite {out}")
    v3 = a.v == "v3"
    plan = json.loads((PLAN_V3 if v3 else PLAN).read_text(encoding="utf-8"))
    T_END = plan["filmEnd"]
    p_at, d_at = plan["P01"]["at"], plan["D01"]["at"]
    # (source, filter, start on the film timeline, level rule, label)
    cues = [
        (VO / plan["P01"]["file"], "apad=pad_dur=0.6," + PA.TOA_CHAIN, p_at, ("lufs", PA.TARGET["toa"]), "P01 toa (Dhani, rantai toa Ep 3)"),
        (VO / plan["D01"]["file"], "highpass=f=90", d_at, ("lufs", PA.TARGET["adik"]), "D01 adik berbisik (Zorin)"),
        (SFX / "1 Click Mouse.mp3", "", plan["tapeOn"] - 0.02, ("peak", -16), "selotip menempel di lensa"),
        (SFX / "Quiet_night_ambience_#1.mp3", f"aloop=loop=-1:size=2e9,atrim=0:{T_END},afade=t=in:d=0.3", 0.0, ("rms", -36), "bed malam"),
        (SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{plan['P01']['end'] - p_at + 1.2},lowpass=f=2600,afade=t=in:d=0.35,afade=t=out:st={plan['P01']['end'] - p_at + 0.5}:d=0.7", p_at - 0.4, ("rms", -42), "dengung pembawa toa (sintesis Ep 1)"),
    ]
    if v3:
        cues = cues[:3] + [
            (SFX / "A_distant_outdoor_pu_#4.mp3", "atrim=0:1.0,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.3,highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16", plan["toaOpen"], ("peak", -12), "pembuka toa (Ep 3 L4/L9)"),
            (SFX / "Quiet_night_ambience_#3.mp3", f"aloop=loop=-1:size=2e9,atrim=0:{T_END},afade=t=in:d=0.3", 0.0, ("rms", -36), "bed malam (Ep 3)"),
            (SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{T_END + 0.5},lowpass=f=2600", 0.0, ("rms", -42), "dengung toa samar sepanjang klip (Ep 3)"),
        ]
    tracks, report = [], []
    for i, (src, filt, at, (kind, target), label) in enumerate(cues):
        w = PA.render_cue(src, filt, WORK, f"v2c{i:02d}")
        if kind == "lufs":
            cur, _ = PA.lufs(w)
        elif kind == "peak":
            cur = float(PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(w), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr.split("Overall")[-1].split("Peak level dB:")[1].split()[0])
        else:
            cur = PA.rms_af(w, "anull")
        g = target - cur
        tracks.append((w, at, g))
        report.append(f"{label:42s} @ {at:6.2f} s  {kind} {cur:7.1f} -> {target} dB (gain {g:+.1f})")
    args, fl = [], []
    for j, (w, at, g) in enumerate(tracks):
        args += ["-i", str(w)]
        fl.append(f"[{j}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}|{int(round(at * 1000))},apad=whole_dur={T_END}[t{j}]")
    fl.append("".join(f"[t{j}]" for j in range(len(tracks))) + f"amix=inputs={len(tracks)}:normalize=0:duration=longest,atrim=0:{T_END}[m]")
    pre = WORK / f"{a.name}_premix.wav"
    r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", ";".join(fl), "-map", "[m]", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_f32le", str(pre)])
    if r.returncode:
        sys.exit(r.stderr)
    i0, _ = PA.lufs(pre)
    gain, ceil = -14.0 - i0, -2.6
    if v3:
        gain, ceil = EP3_MASTER
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre), "-af", f"volume={gain:.2f}dB,alimiter=limit={10 ** (ceil / 20):.4f}:attack=2:release=60:level=disabled,apad=whole_dur={T_END + 0.04}", "-c:a", "pcm_s16le", str(out)])
        i1, tpw = PA.true_peak(out)
        gr = PA.limiter_gr(pre, out, gain)
        report.append(f"master (Ep 3 final): gain {gain:+.2f} dB ceiling {ceil:.1f} dB -> {i1:.2f} LUFS, TP {tpw:.2f} dBTP; premix {i0:.2f} LUFS")
        report.append(f"limiter GR: max {gr[0]:.1f} dB at {gr[1]:.2f} s; {gr[2]:.2f} s above 1 dB")
        (OUT_DIR / f"{a.name}_cues.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
        print("\n".join(report))
        print("wrote", out)
        return
    for it in range(6):
        tmp = WORK / f"{a.name}_m{it}.wav"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre), "-af", f"volume={gain:.2f}dB,alimiter=limit={10 ** (ceil / 20):.4f}:attack=2:release=60:level=disabled,apad=whole_dur={T_END + 0.04}", "-c:a", "pcm_s16le", str(tmp)])
        aac = WORK / f"{a.name}_m{it}.m4a"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(tmp), "-c:a", "aac", "-b:a", "192k", str(aac)])
        i1, tpw = PA.true_peak(tmp)
        _, tpa = PA.true_peak(aac)
        print(f"  master {it}: gain {gain:+.2f} dB ceiling {ceil:.1f} -> {i1:.2f} LUFS, TP wav {tpw:.2f} / aac {tpa:.2f} dBTP")
        if abs(i1 + 14) <= 0.5 and max(tpw, tpa) <= -1.5:
            tmp.replace(out)
            break
        gain += -14.0 - i1
        if max(tpw, tpa) > -1.5:
            ceil -= 0.4
    else:
        sys.exit("master did not converge")
    (OUT_DIR / f"{a.name}_cues.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report))
    print("wrote", out)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    pl = sub.add_parser("plan")
    pl.add_argument("--v", default="v2", choices=["v2", "v3"])
    pl.set_defaults(fn=cmd_plan)
    m = sub.add_parser("mix")
    m.add_argument("--v", default="v2", choices=["v2", "v3"])
    m.add_argument("--name", required=True)
    m.set_defaults(fn=cmd_mix)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
