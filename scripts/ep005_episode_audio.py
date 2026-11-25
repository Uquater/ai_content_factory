"""2026-11-005 Episode 4, FULL EPISODE preview (owner 2026-11-23, after approving the opening pilot v3).

Step `plan`: the episode timeline from the owner's VO takes (vo_raw, never written) and the approved pilot v3 opening
(studio/src/ep005/pilot005v3-plan.json, kept unchanged up to the S03b->S04 cut). Gaps are editorial (inkbeat: pauses come
from editing, never from changing the speech). Writes studio/src/ep005/episode005-plan.json: shots, VO placements, caption
bursts (silencedetect -40 dB / 0.12 s, as Ep 3), events (cards, curtain, villagers' turn, buzzes, door). The picture reads it.
Step `mix` (after the picture's beats exist: studio/out/e005_beats.json from tools/e005_beats.ts): Ep 3 final levels and chain
(lesson 2026-11-23-audio-toa-caption-ep4-pilot-v2-v3 §E): narrator -20, toa -21 (+ TOA_CHAIN, opener 1.0 s before the word),
adik -22.5, bed Quiet_night_ambience_#3 rms -36 (seams inside speech), toa hum rms -42; inside the closed bathroom the hum
goes to 0 and the bed is muffled (USULAN). Full episode = normalised to -14 +/- 0.5 LUFS, TP <= -1.5 dBTP (lesson §D).
Refuses to overwrite.

usage:
  python scripts/ep005_episode_audio.py plan
  python scripts/ep005_episode_audio.py mix --name 2026-11-005_episode_v1
"""
import argparse
import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402
import ep003_episode_audio as EA  # noqa: E402  (ambience_loop)

ROOT = PA.ROOT
UNIT = "2026-11-005"
VO = ROOT / f"_media/{UNIT}/audio/vo_raw"
SFX = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
PILOT = ROOT / "studio/src/ep005/pilot005v3-plan.json"
PLAN = ROOT / "studio/src/ep005/episode005-plan.json"
BEATS = ROOT / "studio/out/e005_beats.json"
OUT_DIR = ROOT / f"_media/{UNIT}/audio/episode"
WORK = OUT_DIR / "work"
FPS = 30
fr = lambda x: round(round(x * FPS) / FPS, 4)  # noqa: E731  (cuts on whole frames)

TEXT = {
    "N01": "Jam dua pagi. Rumahmu diawasi, dan toa kompleks memakai suaramu.",
    "N02": "Di luar, warga sudah berdiri menghadap rumahmu.",
    "P02": "“Mereka sudah menunggu.”",
    "N03": "“Ruangan itu kamar mandi, lewat dapur. Tidak ada kamera di sana.”",
    "N04": "Nomornya sama. Kamu belum tahu dia di pihak mana.",
    "N05": "“Saya punya kunci ruang toa. Saya tunggu di pintu belakang.”",
    "N06": "Kamu akan menemui satpam sekarang, atau meminta bukti dulu?",
}


def take(seg):
    f = VO / f"{UNIT}_vo_{seg}_take01.mp3"
    sp, d = PA.speech(f, min_sil=0.12)
    cap, _ = PA.speech(f, noise=-40, min_sil=0.12)
    return f, sp, cap, d


def cmd_plan(_a):
    P = json.loads(PILOT.read_text(encoding="utf-8"))
    ev, vo, shots = {}, {}, {}

    def place(seg, first_word, who):
        f, sp, cap, d = take(seg)
        at = round(first_word - sp[0][0], 3)
        vo[seg] = {"file": f.name, "who": who, "at": at, "speech": [[round(at + a, 3), round(at + b, 3)] for a, b in sp],
                   "capBursts": [[round(at + a, 3), round(at + b, 3)] for a, b in cap], "end": round(at + sp[-1][1], 3), "fileEnd": round(at + d, 3),
                   "text": TEXT.get(seg, "")}
        return vo[seg]

    # --- opening = pilot v3 (approved) up to the cut after D01
    vo["P01"] = {**P["P01"], "who": "toa"}
    vo["D01"] = {**P["D01"], "who": "adik"}
    ev["tapeOn"], ev["toaOpen1"] = P["tapeOn"], P["toaOpen"]
    cut4 = fr(P["D01"]["end"] + 0.55)
    shots["OPEN"] = [0.0, cut4]  # pilot v3 S01, S02, S03, S03b
    # --- S04: the pair regroups at the front window (walk) + the Ep 3 recap cards in the gap, then N01 (D-051 rule:
    #     the line starts >= 0.1 s after the cards are gone)
    cards = {"in": round(cut4 + 0.3, 3), "rightLag": 0.2, "fade": 0.35}
    cards["click"] = round(cards["in"] + cards["rightLag"] + 0.5, 3)
    cards["out"] = round(cards["click"] + 1.0, 3)
    cards["gone"] = round(cards["out"] + cards["fade"], 3)
    ev["recap"] = cards
    ev["walk4"] = [round(cut4 + 0.15, 3), round(cut4 + 3.15, 3)]
    n01 = place("N01", cards["gone"] + 0.11, "n")
    s04_end = fr(n01["end"] + 0.35)
    shots["S04"] = [cut4, s04_end]
    # --- S05 insert: two fingers part the curtain
    s05_end = fr(s04_end + 1.6)
    shots["S05"] = [s04_end, s05_end]
    ev["curtain"] = [round(s04_end + 0.35, 3), round(s04_end + 1.05, 3)]
    # --- S06 POV: the villagers, N02, then all heads turn to the window together
    n02 = place("N02", s05_end + 0.45, "n")
    ev["turn"] = round(n02["end"] + 0.25, 3)
    s06_end = fr(ev["turn"] + 0.75 + 0.6)
    shots["S06"] = [s05_end, s06_end]
    # --- S07 Uq's face at the gap: toa opener, P02 (lesson §E: opener 1.0 s before the first word), silence
    ev["toaOpen2"] = round(s06_end + 0.35, 3)
    p02 = place("P02", ev["toaOpen2"] + 1.0, "toa")
    s07_end = fr(p02["end"] + 1.3)  # both turn to the room after P02 (1.0 s turns, e005_check)
    shots["S07"] = [s06_end, s07_end]
    # --- S08 buzz insert (two buzzes 1.0 s apart, Ep 3), the phone comes up
    ev["vib1"] = round(s07_end + 0.15, 3)
    ev["raise"] = [round(ev["vib1"] + 0.58, 3), round(ev["vib1"] + 1.28, 3)]
    s08_end = fr(s07_end + 1.6)
    shots["S08"] = [s07_end, s08_end]
    # --- S09 UI: message L6 read by the narrator (enters 0.15 s before, Ep 2 rule)
    n03 = place("N03", s08_end + 0.4, "msg")
    s09_end = fr(n03["end"] + 0.45)
    shots["S09"] = [s08_end, s09_end]
    # --- S10 faces lit by the screen: "Nomornya sama."; S11 starts on the second sentence (keeps the silent walk short)
    n04 = place("N04", s09_end + 0.35, "n")
    s10_end = fr(n04["speech"][1][0] - 0.12)
    shots["S10"] = [s09_end, s10_end]
    # --- S11 hallway POV (walk north), S12 kitchen -> bathroom door, the door closes fully (open = 0)
    s11_end = fr(s10_end + 2.6)
    shots["S11"] = [s10_end, s11_end]
    ev["walk11"] = round(s10_end, 3)  # T11: the hallway walk starts on the cut (episode005Stage.ts lays the steps from here)
    s12_end = fr(s11_end + 3.85)
    shots["S12"] = [s11_end, s12_end]
    ev["door"] = [round(s12_end - 1.05, 3), round(s12_end - 0.25, 3)]  # closes 1.45 -> 0 rad
    # --- S13 dark: held breath, second buzz
    s13_end = fr(s12_end + 1.3)
    shots["S13"] = [s12_end, s13_end]
    ev["breath"] = round(s12_end + 0.15, 3)
    ev["vib2"] = round(s12_end + 0.75, 3)
    # --- S14 UI: message L8
    n05 = place("N05", s13_end + 0.4, "msg")
    s14_end = fr(n05["end"] + 0.45)
    shots["S14"] = [s13_end, s14_end]
    # --- S15 two-shot in the dark, door closed; N06, cards 0.3 s after it starts, Doom after it, hold
    n06 = place("N06", s14_end + 0.5, "n")
    ev["finalCards"] = round(n06["at"] + 0.3, 3)
    ev["doom"] = round(n06["end"] + 0.2, 3)
    end = fr(ev["doom"] + 3.0)
    shots["S15"] = [s14_end, end]
    order = ["OPEN", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S11", "S12", "S13", "S14", "S15"]
    plan = {"fps": FPS, "end": end, "frames": int(round(end * FPS)), "order": order, "shots": {k: shots[k] + [round(shots[k][1] - shots[k][0], 4)] for k in order},
            "vo": vo, "events": ev, "finalChoices": ["temui satpam sekarang", "minta bukti dulu"], "recapChoices": ["balas pesan itu", "tutup kameranya"],
            "timing": "VO asli pemilik (take01), 2026-11-23; pembuka = pilot v3 (disetujui)"}
    PLAN.write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")
    for k in order:
        a, b, d = plan["shots"][k]
        print(f"{k:5s} {a:7.3f} - {b:7.3f}  ({d:5.2f} s)")
    for k, v in vo.items():
        print(f"{k}: at {v['at']:.3f}, speech {v['speech'][0][0]:.3f}-{v['end']:.3f}")
    print("events", json.dumps(ev))
    print("wrote", PLAN, f"total {end:.2f} s = {plan['frames']} frames")


def peak_of(w):
    return float(PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(w), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr.split("Overall")[-1].split("Peak level dB:")[1].split()[0])


def cmd_mix(a):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{a.name}.wav"
    if out.exists():
        sys.exit(f"refuse to overwrite {out}")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    beats = json.loads(BEATS.read_text(encoding="utf-8"))
    E, V, END = plan["events"], plan["vo"], plan["end"]
    door_shut = E["door"][1]
    cues = []
    chain = {"n": "", "msg": "", "adik": "highpass=f=90", "toa": "apad=pad_dur=0.6," + PA.TOA_CHAIN}
    target = {"n": -20.0, "msg": -20.0, "toa": -21.0, "adik": -22.5}
    for seg, v in V.items():
        cues.append((VO / v["file"], chain[v["who"]], v["at"], ("lufs", target[v["who"]]), f"VO {seg} ({v['who']})"))
    opener = "atrim=0:1.0,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.3,highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16"
    cues += [
        (SFX / "A_distant_outdoor_pu_#4.mp3", opener, E["toaOpen1"], ("peak", -12), "pembuka toa 1 (S03)"),
        (SFX / "A_distant_outdoor_pu_#4.mp3", opener, E["toaOpen2"], ("peak", -12), "pembuka toa 2 (S07)"),
        (SFX / "1 Click Mouse.mp3", "", E["tapeOn"] - 0.02, ("peak", -16), "selotip menempel di lensa"),
        (SFX / "1 Click Mouse.mp3", "", E["recap"]["click"], ("peak", -16), "klik recap"),
        (SFX / "A_smartphone_vibrati_#2.mp3", "", E["vib1"], ("peak", -14), "getar ponsel 1 (S08)"),
        (SFX / "A_smartphone_vibrati_#2.mp3", "lowpass=f=3000", E["vib2"], ("peak", -15), "getar ponsel 2 (S13, kamar mandi)"),
        (SFX / "Muffled_held_breath.wav", "atrim=0:2.4,asetpts=PTS-STARTPTS,afade=t=out:st=2.1:d=0.3", E["breath"], ("peak", -20), "napas tertahan (S13)"),
        (SFX / "Two_deep_cinematic_Doom.wav", "", E["doom"], ("peak", -7), "dentuman kartu (Doom)"),
        # the door: the source's own latch click (Old_round_doorknob part 3, 2.20-2.60 s) as the leaf meets the frame (USULAN)
        (SFX / "Old_round_doorknob.wav", "atrim=2.20:2.60,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.33:d=0.07", door_shut - 0.05, ("peak", -14), "pintu kamar mandi menutup, klik grendel"),
    ]
    # footsteps: grains of the Ep 3 step source at the picture's heel strikes (tools/e005_beats.ts), quieter for adik
    src_step = SFX / "Slow,_careful_footst_#1.mp3"
    xs = PA.pcm_np(src_step)
    ons = PA.onsets_of(xs)
    for j, (tt, who) in enumerate(beats["steps"]):
        o = ons[(j * 3 + (1 if who == "adik" else 0)) % len(ons)]
        g0 = max(0.0, o - 0.03)
        pk = PA.peak_time(xs, g0, o + 0.12)
        filt = f"atrim={g0}:{o + 0.32},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={o + 0.32 - g0 - 0.12}:d=0.12"
        cues.append((src_step, filt, round(tt - (pk - g0), 3), ("peak", -24.0 if who == "uq" else -28.0), f"langkah {who} @{tt:.2f}"))
    # beds: night ambience looped with seams inside speech; muffled + lower after the bathroom door shuts (USULAN)
    seams = [round((V["N02"]["at"] + V["N02"]["end"]) / 2, 2), round((V["N05"]["at"] + V["N05"]["end"]) / 2, 2)]  # each piece < the 30 s file
    bed_src = PA.render_cue(SFX / "Quiet_night_ambience_#3.mp3", "", WORK, "bed_src")
    bed = EA.ambience_loop(bed_src, END + 0.5, seams, WORK)
    cues.append((bed, f"atrim=0:{door_shut + 0.3},afade=t=in:d=0.3,afade=t=out:st={door_shut - 0.5}:d=0.8", 0.0, ("rms_ref", -36), "bed malam (sampai pintu menutup)"))
    cues.append((bed, f"atrim={door_shut - 0.5}:{END + 0.5},asetpts=PTS-STARTPTS,lowpass=f=900,afade=t=in:d=0.8,afade=t=out:st={END - door_shut - 0.3}:d=0.6", door_shut - 0.5, ("rms_ref_db", -36 - 8), "bed malam teredam di kamar mandi (-8 dB, lowpass 900)"))
    cues.append((SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{door_shut + 0.3},lowpass=f=2600,afade=t=out:st={door_shut - 0.8}:d=1.0", 0.0, ("rms_hum", -42), "dengung toa (hilang saat pintu menutup)"))
    bed_full = PA.render_cue(bed, "", WORK, "bedfull")
    hum_full = PA.render_cue(SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{END},lowpass=f=2600", WORK, "humfull")
    ref = {"rms_ref": PA.rms_af(bed_full, "anull"), "rms_hum": PA.rms_af(hum_full, "anull")}
    tracks, report = [], []
    for i, (src, filt, at, (kind, tgt), label) in enumerate(cues):
        w = PA.render_cue(src, filt, WORK, f"e{i:03d}")
        if kind == "lufs":
            cur = PA.lufs(w)[0]
        elif kind == "peak":
            cur = peak_of(w)
        elif kind == "rms_ref_db":
            cur = ref["rms_ref"]
        else:
            cur = ref[kind]
        g = tgt - cur
        tracks.append((w, at, g))
        report.append(f"{label:52s} @ {at:7.2f} s  {kind} {cur:7.1f} -> {tgt:.1f} dB (gain {g:+.1f})")
    # amix in chunks of 32 inputs (Windows command line length)
    parts = []
    for c0 in range(0, len(tracks), 32):
        args, fl, chunk = [], [], tracks[c0:c0 + 32]
        for j, (w, at, g) in enumerate(chunk):
            args += ["-i", str(w)]
            fl.append(f"[{j}:a]volume={g:.2f}dB,adelay={int(round(at * 1000))}|{int(round(at * 1000))},apad=whole_dur={END + 0.5}[t{j}]")
        fl.append("".join(f"[t{j}]" for j in range(len(chunk))) + f"amix=inputs={len(chunk)}:normalize=0:duration=longest,atrim=0:{END}[m]")
        p = WORK / f"{a.name}_part{c0 // 32}.wav"
        r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", ";".join(fl), "-map", "[m]", "-ac", "1", "-ar", str(PA.SR), "-c:a", "pcm_f32le", str(p)])
        if r.returncode:
            sys.exit(r.stderr)
        parts.append(p)
    pre = WORK / f"{a.name}_premix.wav"
    args = sum([["-i", str(p)] for p in parts], [])
    fl = "".join(f"[{j}:a]" for j in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0:duration=longest,atrim=0:{END},afade=t=out:st={END - 0.3:.3f}:d=0.3[m]"
    r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", fl, "-map", "[m]", "-ac", "2", "-ar", str(PA.SR), "-c:a", "pcm_f32le", str(pre)])
    if r.returncode:
        sys.exit(r.stderr)
    i0, pk0 = PA.lufs(pre)
    gain, ceil = -14.0 - i0, -2.6
    for it in range(8):
        tmp = WORK / f"{a.name}_m{it}.wav"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(pre), "-af", f"volume={gain:.2f}dB,alimiter=limit={10 ** (ceil / 20):.4f}:attack=2:release=60:level=disabled,apad=whole_dur={END + 0.04}", "-c:a", "pcm_s16le", str(tmp)])
        aac = WORK / f"{a.name}_m{it}.m4a"
        PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(tmp), "-c:a", "aac", "-b:a", "192k", str(aac)])
        i1, tpw = PA.true_peak(tmp)
        ia, tpa = PA.true_peak(aac)
        print(f"  master {it}: gain {gain:+.2f} dB ceiling {ceil:.1f} -> WAV {i1:.2f} LUFS TP {tpw:.2f} | AAC {ia:.2f} LUFS TP {tpa:.2f}")
        if abs(i1 + 14) <= 0.5 and abs(ia + 14) <= 0.5 and max(tpw, tpa) <= -1.5:
            break
        gain += -14.0 - i1
        if max(tpw, tpa) > -1.5:
            ceil -= 0.4
    else:
        sys.exit("master did not converge")
    shutil.copy2(tmp, out)
    gr = PA.limiter_gr(pre, out, gain)
    report.insert(0, f"master: gain {gain:+.2f} dB, ceiling {ceil:.1f} dB; WAV {i1:.2f} LUFS TP {tpw:.2f}; AAC {ia:.2f} LUFS TP {tpa:.2f}; premix {i0:.2f} LUFS")
    report.insert(1, f"limiter GR (2-12 s window of limiter_gr): max {gr[0]:.1f} dB at {gr[1]:.2f} s; {gr[2]:.2f} s above 1 dB")
    (OUT_DIR / f"{a.name}_cues.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report[:2]))
    print(len(cues), "cues; wrote", out)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("plan").set_defaults(fn=cmd_plan)
    m = sub.add_parser("mix")
    m.add_argument("--name", required=True)
    m.set_defaults(fn=cmd_mix)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
