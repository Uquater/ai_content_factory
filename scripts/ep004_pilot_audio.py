"""2026-11-004 Episode 3, pilot v1 (owner 2026-11-20, D-049): two blocks of the episode timeline,
Blok A 0–6.8 s (S01 knob insert, S02 adik covers her mouth / Uq's hand on her shoulder, label, recap) and
Blok B 27.4–35.0 s (S08 the first LED + adik points + D01, S09 POV the corner + the phone screen flash).

Step `plan`: reads the owner's VO takes N01 and D01 from vo_raw (never written), places them on the episode timeline
(storyboard v0.3 §11; N01 starts at 3.0 s, so L3 starts at 6.90 s = just after the S02→S03 cut at 6.8 s), splits them
into sentences at their own pauses, and writes studio/src/ep004/pilot004-plan.json (lines, words, SFX beats, blocks).
Step `mix`: VO + SFX + bed on the episode timeline, then the two blocks cut out and joined (10 ms fades at the join),
master to -14 LUFS with true peak <= -1.5 dBTP (owner: <= -1.5). Refuses to overwrite.

usage:
  python scripts/ep004_pilot_audio.py plan
  python scripts/ep004_pilot_audio.py mix --name 2026-11-004_pilot_v1_mix
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402  (speech, lufs, true_peak, render_cue, run)

ROOT = PA.ROOT
UNIT = "2026-11-004"
VO = ROOT / f"_media/{UNIT}/audio/vo_raw"
SFX = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
PLAN = ROOT / "studio/src/ep004/pilot004-plan-v3.json"  # v3 (2026-11-20, D-051); v1/v2 plans kept
OUT_DIR = ROOT / f"_media/{UNIT}/audio/pilot"
WORK = OUT_DIR / "work"
SR = PA.SR
# v3 (owner D-051, option 2): the recap cards after T (end of "memakai suaramu." = 6.650 s), L3 and the S02→S03 cut moved
# back by SHIFT; S08a 1.0 → 1.5 s (everything after it in Blok B +0.5 s); Blok A ends on the cut, right after the cards
T_SUARAMU = 6.650
CARDS = {"in": round(T_SUARAMU + 0.5, 3), "rightLag": 0.2, "fade": 0.35}
CARDS["click"] = round(CARDS["in"] + CARDS["rightLag"] + 0.5, 3)   # USULAN: 0.5 s after the RIGHT card appears
CARDS["out"] = round(CARDS["click"] + 1.0, 3)                       # USULAN: held 1.0 s after the click
CARDS["gone"] = round(CARDS["out"] + CARDS["fade"], 3)
L3_V1 = 6.896                                                        # v1/v2 L3 onset (N01 at 3.0)
SHIFT = round(CARDS["gone"] + 0.1 - L3_V1 + 0.01, 3)                 # L3 >= 0.1 s after the cards are gone (+10 ms margin)
CUT_A = round(round((6.8 + SHIFT) * 30) / 30, 4)                    # S02→S03 cut on a whole frame, before L3
if CUT_A + 0.0001 < CARDS["gone"]:
    CUT_A = round(-(-CARDS["gone"] * 30 // 1) / 30, 4)
S08A_EXTRA = 0.5
BLOCKS = [(0.0, CUT_A), (27.4, 34.0 + S08A_EXTRA)]
TEXT = {
    "L1": "Jam dua pagi.", "L2": "Pengeras suara kompleks memakai suaramu.", "L3": "Dan seseorang baru saja mencoba pintu belakangmu.",
    "L7": "“Kak… itu apa yang merah?”",
}
N01_AT = 3.0   # storyboard: L1 at 3.0 s
N01_SPLIT = 3.78  # s in the N01 file: inside the silence between L2 (ends 3.650) and L3 (starts 3.896); v3 places the
                  # tail (L3) SHIFT later. The file itself is not edited; no crossfade (cut in silence)
D01_AT = 28.55 + 0.5  # v3: +0.5 s with the longer S08a insert
# SFX beats on the episode timeline (picture uses the same numbers via the plan JSON)
BEATS = {
    "knobTurn": 0.25,   # Old_round_doorknob part 1 (0.00–0.45 of the file): the knob turns
    "knobStrain": 1.00,  # part 2 (1.70–2.00): strain against the bolt
    "boltRattle": 1.33,  # A_small_metal_barrel_#3 first rattle (0.10–0.55): the leaf is pushed, the bolt rattles once
    "knobBack": 1.60,   # part 3 (2.20–2.60): turns back and clicks into rest
    "breath": 2.50,     # Muffled_held_breath (inhale 0.11–0.83 → 2.61–3.33 as adik covers her mouth)
    "steps": 5.30,      # Relaxed_footsteps_alley (first step at 0.67 → 5.97)
    "recapClick": None,  # v3: = CARDS["click"] (set below)
    "ledT": 27.90,      # sfx-14_click_tiny_noise: LED-1 switches on (picture: the LED core lights on this frame)
    "screenTap": 32.55 + 0.5,  # A_very_soft_single_f_#1: the phone screen on (S09), +0.5 s in v3
    "breath2": None,     # v3: a second, softer held exhale in the extended S02 (set below)
}
BEATS["recapClick"] = CARDS["click"]
BEATS["breath2"] = 7.40
SCREEN = (33.1, 33.8)  # phone screen on (glint), +0.5 s in v3


def cmd_plan(_a):
    lines = []
    for seg, at, ids, who in (("N01", N01_AT, ["L1", "L2", "L3"], "n"), ("D01", D01_AT, ["L7"], "adik")):
        f = VO / f"{UNIT}_vo_{seg}_take01.mp3"
        sp, d = PA.speech(f, min_sil=0.12)
        if seg == "N01":
            assert len(sp) == 3, sp
            for lid, (a, b) in zip(ids, sp):
                off = SHIFT if lid == "L3" else 0.0
                lines.append({"id": lid, "who": who, "seg": seg, "text": TEXT[lid], "start": round(at + a + off, 3), "end": round(at + b + off, 3)})
        else:  # D01: "Kak…" burst + the question burst = one line with two word groups
            lines.append({"id": "L7", "who": who, "seg": seg, "text": TEXT["L7"], "start": round(at + sp[0][0], 3), "end": round(at + sp[-1][1], 3),
                          "bursts": [[round(at + a, 3), round(at + b, 3)] for a, b in sp]})
        print(seg, f"{d:.2f} s", [(round(a, 2), round(b, 2)) for a, b in sp])
    plan = {"fps": 30, "blocks": BLOCKS, "lines": lines, "beats": BEATS, "screen": SCREEN, "vo": {"N01": N01_AT, "D01": D01_AT},
            "cards": CARDS, "shift": SHIFT, "cutA": CUT_A, "n01Split": N01_SPLIT, "s08aExtra": S08A_EXTRA,
            "timing": "VO asli pemilik (N01, D01 take01), 2026-11-20"}
    PLAN.write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")
    print("wrote", PLAN)


def cmd_mix(a):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{a.name}.wav"
    if out.exists():
        sys.exit(f"refuse to overwrite {out}")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    B = plan["beats"]
    T_END = BLOCKS[-1][1] + 0.5
    # (source, filter, start on the episode timeline, level rule, label)
    # one gain for both N01 pieces (from the whole take), so L3 keeps its level relative to L1–L2
    n01_gain = -20.0 - PA.lufs(VO / f"{UNIT}_vo_N01_take01.mp3")[0]
    cues = [
        (VO / f"{UNIT}_vo_N01_take01.mp3", f"atrim=0:{N01_SPLIT},asetpts=PTS-STARTPTS", plan["vo"]["N01"], ("gain", n01_gain), "VO N01 L1–L2 (narator)"),
        (VO / f"{UNIT}_vo_N01_take01.mp3", f"atrim={N01_SPLIT},asetpts=PTS-STARTPTS", plan["vo"]["N01"] + N01_SPLIT + SHIFT, ("gain", n01_gain), "VO N01 L3 (narator, digeser)"),
        (VO / f"{UNIT}_vo_D01_take01.mp3", "highpass=f=90", plan["vo"]["D01"], ("lufs", -22.5), "VO D01 (adik, bisik)"),
        (SFX / "Old_round_doorknob.wav", "atrim=0:0.45,asetpts=PTS-STARTPTS,afade=t=out:st=0.38:d=0.07", B["knobTurn"], ("peak", -12), "kenop berputar"),
        (SFX / "Old_round_doorknob.wav", "atrim=1.70:2.00,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.24:d=0.06", B["knobStrain"], ("peak", -14), "kenop tertahan"),
        (SFX / "A_small_metal_barrel_#3.mp3", "atrim=0.10:0.55,asetpts=PTS-STARTPTS,afade=t=out:st=0.37:d=0.08", B["boltRattle"], ("peak", -11), "gerendel berderak sekali"),
        (SFX / "Old_round_doorknob.wav", "atrim=2.20:2.60,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.33:d=0.07", B["knobBack"], ("peak", -13), "kenop kembali, klik"),
        (SFX / "Muffled_held_breath.wav", "atrim=0:2.4,asetpts=PTS-STARTPTS,afade=t=out:st=2.1:d=0.3", B["breath"], ("peak", -20), "napas tertahan"),
        (SFX / "Muffled_held_breath.wav", "atrim=1.35:2.35,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=0.75:d=0.25", B["breath2"], ("peak", -25), "napas tertahan, embusan kedua (lebih pelan)"),
        (SFX / "Relaxed_footsteps_alley.wav", "lowpass=f=2500", B["steps"], ("peak", -22), "langkah menjauh di gang"),
        (SFX / "1 Click Mouse.mp3", "", B["recapClick"], ("peak", -16), "klik recap"),
        # sfx-14_click_tiny_noise.wav is undecodable (WAV with Vorbis payload, tag 0x674F; collection analysis.csv
        # "UNDECODABLE"): the own synthesised Ep 1 switch click, high-passed into a tiny tick, replaces it
        (SYN / "switch_click.wav", "atrim=0:0.2,asetpts=PTS-STARTPTS,highpass=f=1800,afade=t=out:st=0.12:d=0.08", B["ledT"], ("peak", -22), "LED-1 menyala (klik halus, sintesis)"),
        (SFX / "A_very_soft_single_f_#1.mp3", "", B["screenTap"], ("peak", -22), "layar ponsel menyala"),
        (SFX / "Quiet_night_ambience_#3.mp3", f"aloop=loop=-1:size=2e9,atrim=0:{T_END},afade=t=in:d=0.3", 0.0, ("rms", -36), "bed malam"),
        (SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{T_END},lowpass=f=2600", 0.0, ("rms", -42), "dengung toa samar (sintesis Ep 1)"),
    ]
    tracks, report = [], []
    for i, (src, filt, at, (kind, target), label) in enumerate(cues):
        w = PA.render_cue(src, filt, WORK, f"c{i:02d}")
        if kind == "gain":
            cur = 0.0
        elif kind == "lufs":
            cur, _ = PA.lufs(w)
        elif kind == "peak":
            cur = float(PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(w), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr.split("Overall")[-1].split("Peak level dB:")[1].split()[0])
        else:
            cur = PA.rms_af(w, "anull")
        g = target - cur
        tracks.append((w, at, g))
        report.append(f"{label:38s} @ {at:6.2f} s  {kind} {cur:7.1f} → {target} dB (gain {g:+.1f})")
    # episode-timeline premix
    args, fl = [], []
    for j, (w, at, g) in enumerate(tracks):
        args += ["-i", str(w)]
        fl.append(f"[{j}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}|{int(round(at * 1000))},apad=whole_dur={T_END}[t{j}]")
    fl.append("".join(f"[t{j}]" for j in range(len(tracks))) + f"amix=inputs={len(tracks)}:normalize=0:duration=longest,atrim=0:{T_END}[m]")
    pre_ep = WORK / f"{a.name}_episode_premix.wav"
    r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", ";".join(fl), "-map", "[m]", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_f32le", str(pre_ep)])
    if r.returncode:
        sys.exit(r.stderr)
    # cut the two blocks, 10 ms fades at the join, concat; pad to the picture length + 40 ms
    parts = []
    for k, (b0, b1) in enumerate(BLOCKS):
        p = WORK / f"{a.name}_blk{k}.wav"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre_ep), "-af", f"atrim={b0}:{b1},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={b1 - b0 - 0.01}:d=0.01", "-c:a", "pcm_f32le", str(p)])
        parts.append(p)
    pre = WORK / f"{a.name}_premix.wav"
    total = sum(b1 - b0 for b0, b1 in BLOCKS)
    PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(parts[0]), "-i", str(parts[1]), "-filter_complex", f"[0:a][1:a]concat=n=2:v=0:a=1,apad=whole_dur={total + 0.04}[m]", "-map", "[m]", "-c:a", "pcm_f32le", str(pre)])
    # master: gain to -14 LUFS, true-peak limiter; iterate until -14 ± 0.5 LUFS and TP (wav and AAC) <= -1.5 dBTP
    i0, _ = PA.lufs(pre)
    gain, ceil = -14.0 - i0, -2.6
    for it in range(6):
        tmp = WORK / f"{a.name}_m{it}.wav"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre), "-af", f"volume={gain:.2f}dB,alimiter=limit={10 ** (ceil / 20):.4f}:attack=2:release=60:level=disabled", "-c:a", "pcm_s16le", str(tmp)])
        aac = WORK / f"{a.name}_m{it}.m4a"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(tmp), "-c:a", "aac", "-b:a", "192k", str(aac)])
        i1, tpw = PA.true_peak(tmp)
        _, tpa = PA.true_peak(aac)
        print(f"  master {it}: gain {gain:+.2f} dB ceiling {ceil:.1f} → {i1:.2f} LUFS, TP wav {tpw:.2f} / aac {tpa:.2f} dBTP")
        if abs(i1 + 14) <= 0.5 and max(tpw, tpa) <= -1.5:  # project rule −14 ± 0.5 LUFS (STUDIO-WORKFLOW §10); owner TP ≤ −1.5
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
    sub.add_parser("plan").set_defaults(fn=cmd_plan)
    m = sub.add_parser("mix"); m.add_argument("--name", required=True); m.set_defaults(fn=cmd_mix)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
