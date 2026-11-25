"""2026-11-006 Episode 5, FULL EPISODE preview (owner 2026-11-24: all VO in, branch B, D-064..D-067).

Step `plan`: the episode timeline from the owner's VO takes (vo_raw, never written). Gaps are editorial (inkbeat: pauses come
from editing, never from changing the speech). Writes studio/src/ep006/episode006-plan.json: shots, VO placements, caption
bursts (silencedetect -40 dB / 0.12 s, as Ep 3-4), events. The picture reads it.
  - S15 (the closing shot) = the approved reference animatic_close_2026-11-006_v0f_glitch.mp4 (D-067): it starts on the END
    of U02 ("Kami bukan tontonan."); relative to that start: low hit 3.30 s, picture cut + static 3.40 s, TAMAT from 3.90 s,
    glitch + static + thin ear ring over the last 2.5 s, to the last frame.
  - N06 is cut on the switch click after "Kamu akan m" (ASUMSI by character share of its single speech burst: 0.85 s).
Step `mix`: Ep 4 final levels/chain (lesson 2026-11-23-audio-toa-caption-ep4-pilot-v2-v3 §E): narrator -20, toa -21 (+TOA_CHAIN,
opener 1.0 s before the word), adik -22.5, Uq (U01/U02) -20 dry in the room, the street cut hears U01 through the toa chain;
beds per place; the closing audio = closing006_audio() (reproduction of v0f, also used by the closing test). Full episode =
-14 +/- 0.5 LUFS, TP <= -1.5 dBTP. Refuses to overwrite.

usage:
  python -X utf8 scripts/ep006_episode_audio.py plan
  python -X utf8 scripts/ep006_episode_audio.py mix --name 2026-11-006_episode_v1
"""
import argparse
import json
import shutil
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ep003_pilot_audio as PA  # noqa: E402
import ep003_episode_audio as EA  # noqa: E402  (ambience_loop)

ROOT = PA.ROOT
UNIT = "2026-11-006"
VO = ROOT / f"_media/{UNIT}/audio/vo_raw"
SFX = ROOT / "refrences/SFX"
SYN = ROOT / "_media/2026-11-002/sfx"
PLAN = ROOT / "studio/src/ep006/episode006-plan.json"
OUT_DIR = ROOT / f"_media/{UNIT}/audio/episode"
WORK = OUT_DIR / "work"
FPS = 30
fr = lambda x: round(round(x * FPS) / FPS, 4)  # noqa: E731  (cuts on whole frames)

TEXT = {
    "N01": "Kamu meminta bukti.",
    "N02": "“Ini kuncinya. Saya di luar pintu belakang.”",
    "N03": "Kamu menerima kuncinya.",
    "P01": "“Kalian lewat gang.”",
    "N04": "Pintunya masih terkunci. Tidak ada siapa pun di dalam.",
    "D01": "“Itu rumah kita…”",
    "N05": "Kamu melihat semuanya.",
    "N06": "Kamu akan memilih…",
    "U01": "“Ini Uq, rumah nomor tujuh.”",
    "U02": "“Kami bukan tontonan.”",
}
PAUSE_N06 = 0.8  # v5 (owner): N06 plays in full ("Kamu akan memilih…"), then ~0.8 s of decision before the click
# closing shot (D-067, v0f): times relative to the start of the stare (= end of U02 speech)
CLOSE = {"stepA": 2.05, "stepB": 2.85, "reachA": 2.05, "cover": 3.35, "hit": 3.30, "cut": 3.40, "tamatIn": 3.90, "tamatFull": 4.15, "glitch": 3.90, "end": 6.40}


def take(seg):
    f = VO / f"{UNIT}_vo_{seg}_take01.mp3"
    sp, d = PA.speech(f, min_sil=0.12)
    cap, _ = PA.speech(f, noise=-40, min_sil=0.12)
    return f, sp, cap, d


def cmd_plan(_a):
    ev, vo, shots = {}, {}, {}

    def place(seg, first_word, who, skip=0):
        """put the take so that its (skip-th) speech burst starts at first_word"""
        f, sp, cap, d = take(seg)
        at = round(first_word - sp[skip][0], 3)
        vo[seg] = {"file": f.name, "who": who, "at": at, "speech": [[round(at + a, 3), round(at + b, 3)] for a, b in sp[skip:]],
                   "capBursts": [[round(at + a, 3), round(at + b, 3)] for a, b in cap if a >= sp[skip][0] - 0.05], "end": round(at + sp[-1][1], 3),
                   "fileEnd": round(at + d, 3), "text": TEXT.get(seg, "")}
        return vo[seg]

    # --- S01 phone insert in the dark bathroom: Uq types and sends "Buktikan dulu." (not spoken), N01
    ev["type"] = [0.15, 1.0]
    ev["send"] = 1.05
    n01 = place("N01", 1.25, "n")
    s01 = fr(n01["end"] + 0.35)
    shots["S01"] = [0.0, s01]
    # --- S02 two-shot in the dark bathroom (Ep 4 S15 blocking): waiting; the Ep 4 recap cards in the gap (D-051 rule)
    cards = {"in": round(s01 + 0.3, 3), "rightLag": 0.2, "fade": 0.35}
    cards["click"] = round(cards["in"] + cards["rightLag"] + 0.5, 3)
    cards["out"] = round(cards["click"] + 1.0, 3)
    cards["gone"] = round(cards["out"] + cards["fade"], 3)
    ev["recap"] = cards
    ev["vib"] = round(cards["gone"] + 0.2, 3)
    s02 = fr(ev["vib"] + 0.6)
    shots["S02"] = [s01, s02]
    # --- S03 chat UI: the photo + the message (read by the narrator, not captioned), enters 0.2 s before
    n02 = place("N02", s02 + 0.5, "msg")
    ev["photo"] = round(n02["at"] - 0.2, 3)
    s03 = fr(n02["end"] + 0.45)
    shots["S03"] = [s02, s03]
    # --- S04 kitchen: Uq opens the bathroom door, both cross to the back door, he slides the bolt, opens a crack
    ev["bathOpen"] = [round(s03 + 0.1, 3), round(s03 + 0.8, 3)]
    ev["cross"] = [round(s03 + 0.6, 3), round(s03 + 2.3, 3)]
    # v5: 3.6 s (was 4.0) so that the silent block N02 -> N03 stays <= 5.8 s
    ev["bolt"] = [round(s03 + 2.35, 3), round(s03 + 2.7, 3)]
    ev["backOpen"] = [round(s03 + 2.85, 3), round(s03 + 3.45, 3)]  # v5: Uq pushes the leaf open to 0.45 rad (hand on the bolt grip)
    s04 = fr(s03 + 3.6)
    shots["S04a"] = [s03, fr(s03 + 2.2)]  # out of the bathroom
    shots["S04b"] = [fr(s03 + 2.2), s04]  # insert: the bolt, the crack
    # --- S05 (v5, owner review of v4): the door already stands 0.45 rad open (Uq pushed it, S04b); the guard stands in the
    # gang west of the gap; his LEFT arm comes in through the gap (shoulder outside, elbow bent) with the key pinched in
    # his gloved fingers; Uq's right palm rises under the key, his fingers close (the key is his from "take"), the guard
    # lets go and draws his arm back; N03 "Kamu menerima kuncinya." as the key lands
    ev["reachIn"] = [round(s04 + 0.15, 3), round(s04 + 1.35, 3)]   # rest -> through the gap -> the handover point
    ev["palm"] = [round(s04 + 0.9, 3), round(s04 + 1.7, 3)]        # Uq's hand off the leaf, palm up under the key (0.8 s: run 18, 13 deg/frame in 0.55 s)
    ev["take"] = round(s04 + 1.95, 3)                               # fingers closed: the key is Uq's from here
    ev["withdraw"] = [round(s04 + 2.2, 3), round(s04 + 2.9, 3)]    # the guard's arm back out of the gap
    n03 = place("N03", ev["take"] - 0.3, "n")  # "Kamu menerima kuncinya." as his fingers close (block N02-N03 <= 5.8 s)
    s05 = fr(max(n03["end"] + 0.35, ev["withdraw"][1] + 0.3))
    shots["S05"] = [s04, s05]
    # --- S06a (v5): camera in the gang facing the back door. Uq steps into the doorway pushing the leaf (hand on it) from
    # 0.45 to 0.85 rad, lets go, the leaf swings on (slowing) to ~1.75 rad; Uq walks out north and to the east lane; the
    # guard points east; adik crosses the kitchen and walks THROUGH the doorway (the leaf stands open, still)
    ev["push"] = [round(s05 + 0.3, 3), round(s05 + 0.8, 3)]
    ev["point"] = [round(s05 + 1.4, 3), round(s05 + 2.6, 3)]
    ev["exitA"] = [round(s05 + 1.2, 3), round(s05 + 3.2, 3)]
    s06a = fr(s05 + 3.5)
    shots["S06a"] = [s05, s06a]
    ev["walkG"] = [round(s06a - 0.3, 3), round(s06a + 3.7, 3)]
    ev["led"] = round(s06a + 1.6, 3)
    ev["toaOpen"] = round(s06a + 0.6, 3)
    p01 = place("P01", ev["toaOpen"] + 1.0, "toa")
    s06 = fr(p01["end"] + 0.55)
    shots["S06c"] = [s06a, fr(s06 - 1.65)]
    shots["S06b"] = [fr(s06 - 1.65), s06]
    # --- S07a (v5) insert: a brass padlock through the staple eye of a hasp; the key tip goes into the keyway (front), the hand
    # turns it, the shackle springs open, the padlock comes off the staple, the hasp strap is flipped back; S07b: Uq pushes
    # the door in (his hand on the leaf); N04
    ev["keyIn"] = [round(s06 + 0.35, 3), round(s06 + 0.85, 3)]
    ev["lock"] = [round(s06 + 1.0, 3), round(s06 + 1.4, 3)]       # the turn (90 deg)
    ev["shackle"] = [round(s06 + 1.45, 3), round(s06 + 1.6, 3)]   # the shackle springs up
    ev["padOff"] = [round(s06 + 1.75, 3), round(s06 + 2.35, 3)]   # the padlock out of the staple, away
    ev["hasp"] = [round(s06 + 3.55, 3), round(s06 + 4.25, 3)]    # v5: the padlock in his pocket; the right hand swings the strap back
    n04 = place("N04", s06 + 0.5, "n")
    shots["S07a"] = [s06, fr(ev["hasp"][1] + 0.3)]
    ev["roomOpen"] = [round(shots["S07a"][1] + 0.3, 3), round(shots["S07a"][1] + 1.6, 3)]
    s07 = fr(max(n04["end"] + 0.35, ev["roomOpen"][1] + 1.4))  # v5: adik's way in keeps v4's offset to S08a
    shots["S07b"] = [shots["S07a"][1], s07]
    # --- S08a wide from the doorway: the monitors come on; S08b the monitor grid insert; D01
    ev["monitorsOn"] = round(s07 + 0.35, 3)
    s08a = fr(s07 + 2.2)
    shots["S08a"] = [s07, s08a]
    d01 = place("D01", s08a + 0.5, "adik")
    s08b = fr(d01["end"] + 0.55)
    shots["S08b"] = [s08a, s08b]
    # --- S09 the text box types "Kamu melihat semuanya."; N05 dry, then the SAME take through the toa 1.0 s later
    ev["type1"] = [round(s08b + 0.15, 3), round(s08b + 0.95, 3)]
    n05 = place("N05", s08b + 0.45, "n")
    ev["echo"] = round(n05["at"] + 1.0, 3)
    s09 = fr(n05["end"] + 0.25)
    shots["S09"] = [s08b, s09]
    # --- S10 Uq's face lit by the monitors during the echo
    s10 = fr(ev["echo"] + (n05["end"] - n05["at"]) + 0.3)
    shots["S10"] = [s09, s10]
    # --- S10b the text box: "Kamu akan memilih…" types; PILIHAN BERIKUTNYA; N06 IN FULL (owner, v5: "memilih" must be heard)
    ev["type2"] = [round(s10 + 0.15, 3), round(s10 + 1.3, 3)]
    ev["panel"] = round(s10 + 0.25, 3)
    n06 = place("N06", s10 + 0.4, "n")
    # --- S10c (v5): the decision: about 0.8 s on Uq, his eyes go to the switch (the reach starts); then the click (S11)
    ev["click"] = round(n06["end"] + PAUSE_N06, 3)
    shots["S10b"] = [s10, fr(n06["end"] + 0.1)]
    shots["S10c"] = [shots["S10b"][1], fr(ev["click"] - 0.15)]
    # --- S11 insert: the switch OTOMATIS -> MIKROFON on the click; the text box freezes; silence
    s11 = fr(ev["click"] + 1.6)
    shots["S11"] = [shots["S10c"][1], s11]
    # --- S12 medium at the mic: breath (the U01 take starts with it), cut to the street on the first word
    u01 = place("U01", s11 + 0.2, "uq")  # the take starts with the shaky inhale (burst 0-1.216 s, unvoiced); the words from 1.586 s
    u01["capBursts"] = [b for b in u01["capBursts"] if b[0] >= u01["at"] + 1.5]
    u01_word = round(u01["at"] + 1.586, 3)
    s12 = fr(u01_word - 0.1)
    shots["S12"] = [s11, s12]
    # --- S13 street: the villagers hear the toa (U01 through the toa chain); one or two lower their eyes and turn away
    ev["turnAway"] = [round(u01_word + 1.1, 3), round(u01_word + 2.3, 3), round(u01_word + 1.6, 3), round(u01_word + 2.8, 3)]
    s13 = fr(u01["end"] + 0.35)
    shots["S13"] = [s12, s13]
    # --- S14 Uq's face: U02; the closing shot starts on the end of U02
    u02 = place("U02", s13 + 0.4, "uq")
    s14 = fr(u02["end"])
    shots["S14"] = [s13, s14]
    # --- S15 closing shot (v0f): relative times
    ev["close"] = {k: round(s14 + v, 3) for k, v in CLOSE.items()}
    end = fr(s14 + CLOSE["end"])
    shots["S15"] = [s14, end]
    order = ["S01", "S02", "S03", "S04a", "S04b", "S05", "S06a", "S06c", "S06b", "S07a", "S07b", "S08a", "S08b", "S09", "S10", "S10b", "S10c", "S11", "S12", "S13", "S14", "S15"]
    plan = {"fps": FPS, "end": end, "frames": int(round(end * FPS)), "order": order,
            "shots": {k: shots[k] + [round(shots[k][1] - shots[k][0], 4)] for k in order},
            "vo": vo, "events": ev, "recapChoices": ["temui satpam sekarang", "minta bukti dulu"],
            "timing": "VO asli pemilik (take01), 2026-11-24; penutup = acuan v0f (D-067)"}
    PLAN.parent.mkdir(parents=True, exist_ok=True)
    PLAN.write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")
    for k in order:
        a, b, d = plan["shots"][k]
        print(f"{k:5s} {a:7.3f} - {b:7.3f}  ({d:5.2f} s)")
    for k, v in vo.items():
        print(f"{k}: at {v['at']:.3f}, speech {v['speech'][0][0]:.3f}-{v['end']:.3f}")
    print("events", json.dumps(ev))
    # blocks without narration (lesson Ep 4: <= 5.8 s; the closing is an approved exception, D-064/D-067)
    sp = sorted([a, b] for v in vo.values() for a, b in v["speech"])
    for (a0, b0), (a1, b1) in zip(sp, sp[1:]):
        if a1 - b0 > 5.8:
            print(f"BLOK TANPA NARASI {b0:.2f}-{a1:.2f} s = {a1 - b0:.2f} s (> 5.8)")
    if end - sp[-1][1] > 5.8:
        print(f"BLOK TANPA NARASI {sp[-1][1]:.2f}-{end:.2f} s = {end - sp[-1][1]:.2f} s (penutup, pengecualian D-064/D-067)")
    print("wrote", PLAN, f"total {end:.2f} s = {plan['frames']} frames")


# ------------------------------------------------------------------ closing audio (reproduction of the approved v0f)
SR = 48000


def closing006_audio(dur=CLOSE["end"]):
    """mono float32 at 48 kHz for the closing shot, t = 0 at the start of the stare (D-067; measured on v0f):
    - a faint room/monitor hum during the stare (v0f: ~200-290 Hz, rms about -46 dB, fading to ~-60 dB before the hit);
    - the low hit from 3.30 s: Two_deep_cinematic_Doom + sfx-19 (envelope fit to v0f), peak -2.0 dBFS, cut at 3.80 s;
    - static at the picture cut 3.40 s, 3 frames (seeded white noise), well under the hit;
    - from 3.90 s to the last frame: a thin ear ring (sine 2760 Hz + weak 1058 Hz, as v0f's spectrum) with soft static
      (band 4-16 kHz), faded in over 0.7 s to rms about -36 dB, held to the end.
    Seeded and deterministic (same samples every run)."""
    n = int(round(dur * SR))
    t = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float64)
    rng = np.random.default_rng(60061)
    # hum during the stare
    hum = 0.6 * np.sin(2 * np.pi * 202 * t) + 0.4 * np.sin(2 * np.pi * 291 * t) + 0.25 * np.sin(2 * np.pi * 222 * t)
    henv = np.clip(t / 0.15, 0, 1) * np.clip((3.0 - t) / 0.9, 0, 1) ** 1.5
    out += hum * henv * 10 ** (-44 / 20)
    # the hit: v0f's source is not in the repo; its envelope (mono rms per window 3.25/3.40/3.50/3.70-3.90 s: -8.6/-6.2/-9.3/
    # -22.5 dB) is matched best by Two_deep_cinematic_Doom layered with sfx-19 (grid fit, 2026-11-24), cut at 3.80 s (40 ms),
    # the sum scaled to a -2.0 dBFS peak (the episode's true-peak limit) - about 2-3 dB under v0f's own peak
    import subprocess
    def mono(f):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
        return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    doom, boom = mono(SFX / "Two_deep_cinematic_Doom.wav"), mono(SFX / "sfx-19_kick-boom_low_impact.wav")
    a = int(round(CLOSE["hit"] * SR))
    nb = int(round((3.80 - CLOSE["hit"]) * SR))
    hit = doom[:nb] / np.abs(doom).max() * 10 ** (-2 / 20) + boom[:nb] / np.abs(boom).max() * 10 ** (-4 / 20)
    f = int(0.04 * SR)
    hit[-f:] *= np.linspace(1, 0, f)
    hit *= 10 ** (-2.0 / 20) / np.abs(hit).max()
    out[a:a + len(hit)] += hit
    # static at the cut
    ns = int(round(0.1 * SR))
    st = rng.uniform(-1, 1, ns) * np.minimum(1, np.arange(ns) / (0.004 * SR)) * np.exp(-np.arange(ns) / (0.03 * SR))
    st *= 10 ** (-15 / 20) / np.abs(st).max()
    b = int(round(CLOSE["cut"] * SR))
    out[b:b + ns] += st
    # ear ring + soft static to the last frame
    g0 = int(round(CLOSE["glitch"] * SR))
    tt = t[g0:] - CLOSE["glitch"]
    ring = np.sin(2 * np.pi * 2760 * tt) + 0.18 * np.sin(2 * np.pi * 1058 * tt)
    noise = rng.standard_normal(len(tt))
    spec = np.fft.rfft(noise)
    fq = np.fft.rfftfreq(len(tt), 1 / SR)
    spec[(fq < 4000) | (fq > 16000)] = 0
    noise = np.fft.irfft(spec, len(tt))
    noise /= np.sqrt((noise ** 2).mean()) + 1e-12
    ring /= np.sqrt((ring ** 2).mean())
    tail = ring * 10 ** (-36.8 / 20) + noise * 10 ** (-45 / 20)
    env = np.clip(tt / 0.7, 0, 1)
    out[g0:] += tail * env
    return out.astype(np.float32)


def peak_of(w):
    return float(PA.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(w), "-af", "astats=metadata=0", "-f", "null", "-"]).stderr.split("Overall")[-1].split("Peak level dB:")[1].split()[0])


def write_wav(path, x, sr=SR):
    import wave
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


def cmd_mix(a):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{a.name}.wav"
    if out.exists():
        sys.exit(f"refuse to overwrite {out}")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    E, V, SHT, END = plan["events"], plan["vo"], plan["shots"], plan["end"]
    C = E["close"]
    s15 = SHT["S15"][0]
    cues = []
    chain = {"n": "", "msg": "", "adik": "highpass=f=90", "toa": "apad=pad_dur=0.6," + PA.TOA_CHAIN, "uq": "highpass=f=80"}
    target = {"n": -20.0, "msg": -20.0, "toa": -21.0, "adik": -22.5, "uq": -20.0}
    # sound perspective (preview v3 QC): in the street shot S13 the toa carries U01 and the dry mic voice is ducked; in the
    # room (S12/S14) the dry voice is full and the toa is faint bleed from outside. The duck is applied AFTER the level
    # measurement (POST filter in the amix chain), so the LUFS gain is computed on the un-ducked cue.
    s13a, s13b = SHT["S13"][0], SHT["S13"][1]
    POST = {}
    def duck(at, a0, b0, inside, outside):
        ra, rb = round(a0 - at, 3), round(b0 - at, 3)
        return f"volume=eval=frame:volume='if(between(t,{ra},{rb}),{inside},{outside})'"
    for seg, v in V.items():
        filt = chain[v["who"]]
        if seg == "U01":
            POST[f"VO {seg} ({v['who']})"] = duck(v["at"], s13a, s13b, 0.1, 1.0)  # -20 dB under the toa in the street
        cues.append((VO / v["file"], filt, v["at"], ("lufs", target[v["who"]]), f"VO {seg} ({v['who']})"))
    # N05 a second time through the toa, 1.0 s later, quieter (heard through the wall)
    cues.append((VO / V["N05"]["file"], "apad=pad_dur=0.6," + PA.TOA_CHAIN + ",lowpass=f=2400", E["echo"], ("lufs", -27.0), "N05 gema toa dari luar"))
    # U01 on the street (S13): the same take through the toa, louder outside; inside (S12/S14) the dry take continues
    cues.append((VO / V["U01"]["file"], "apad=pad_dur=0.6," + PA.TOA_CHAIN, V["U01"]["at"], ("lufs", -21.0), "U01 lewat toa (jalan)"))
    POST["U01 lewat toa (jalan)"] = duck(V["U01"]["at"], s13a, s13b, 1.0, 0.3)  # outside S13: faint bleed (-10 dB)
    cues.append((VO / V["U02"]["file"], "apad=pad_dur=0.6," + PA.TOA_CHAIN + ",lowpass=f=2200", V["U02"]["at"] + 0.05, ("lufs", -31.0), "U02 lewat toa, jauh (dari dalam ruang)"))
    opener = "atrim=0:1.0,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.3,highpass=f=250,lowpass=f=2600,aecho=0.85:0.7:170|390:0.32|0.16"
    cues += [
        (SFX / "Keyboard 1.mp3", "atrim=0:0.85,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.15,highpass=f=1200", E["type"][0], ("peak", -26), "ketik di ponsel (S01)"),
        (SFX / "Whoosh Short 2.mp3", "highpass=f=1500", E["send"] - 0.05, ("peak", -26), "pesan terkirim (USULAN)"),
        (SFX / "1 Click Mouse.mp3", "", E["recap"]["click"], ("peak", -16), "klik recap"),
        (SFX / "A_smartphone_vibrati_#2.mp3", "lowpass=f=3000", E["vib"], ("peak", -15), "getar ponsel (balasan)"),
        (SFX / "Old_round_doorknob.wav", "atrim=2.20:2.60,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=0.33:d=0.07", E["bathOpen"][0], ("peak", -16), "pintu kamar mandi dibuka"),
        (SFX / "A_small_metal_barrel_#1.mp3", "atrim=0:0.45,asetpts=PTS-STARTPTS,afade=t=out:st=0.3:d=0.15,highpass=f=600", E["bolt"][0], ("peak", -15), "gerendel digeser (USULAN)"),
        (SFX / "Old_round_doorknob.wav", "atrim=0:0.9,asetpts=PTS-STARTPTS,afade=t=out:st=0.7:d=0.2", E["backOpen"][0], ("peak", -17), "pintu belakang dibuka"),
        (SFX / "Old_round_doorknob.wav", "atrim=0:0.7,asetpts=PTS-STARTPTS,afade=t=out:st=0.5:d=0.2,lowpass=f=3500", E["push"][0], ("peak", -19), "Uq mendorong pintu belakang lebar"),
        (SFX / "A_small_metal_barrel_#2.mp3", "atrim=0:0.3,asetpts=PTS-STARTPTS,afade=t=out:st=0.2:d=0.1,highpass=f=1500", E["take"] - 0.08, ("peak", -19), "kunci berpindah ke telapak Uq (USULAN)"),
        (SFX / "A_distant_outdoor_pu_#4.mp3", opener, E["toaOpen"], ("peak", -14), "pembuka toa (S06)"),
        (SFX / "A_small_metal_barrel_#2.mp3", "atrim=0:0.35,asetpts=PTS-STARTPTS,afade=t=out:st=0.25:d=0.1,highpass=f=2000", E["keyIn"][1] - 0.15, ("peak", -20), "anak kunci masuk lubang (USULAN)"),
        (SFX / "A_small_metal_barrel_#3.mp3", "atrim=0:0.5,asetpts=PTS-STARTPTS,afade=t=out:st=0.35:d=0.15,highpass=f=900", E["lock"][1] - 0.08, ("peak", -14), "kunci gembok diputar (USULAN)"),
        (SFX / "1 Click Mouse.mp3", "lowpass=f=4000", E["shackle"][0], ("peak", -13), "lengkung gembok terlepas (klik)"),
        (SFX / "A_small_metal_barrel_#4.mp3", "atrim=0:0.4,asetpts=PTS-STARTPTS,afade=t=out:st=0.25:d=0.15,highpass=f=500", E["padOff"][0] + 0.3, ("peak", -16), "gembok keluar dari kupingan (USULAN)"),
        (SFX / "A_small_metal_barrel_#1.mp3", "atrim=0:0.35,asetpts=PTS-STARTPTS,afade=t=out:st=0.25:d=0.1,highpass=f=700", E["hasp"][1] - 0.05, ("peak", -17), "pengait dibalik ke daun pintu (USULAN)"),
        (SFX / "Old_round_doorknob.wav", "atrim=0:1.2,asetpts=PTS-STARTPTS,afade=t=out:st=0.9:d=0.3,lowpass=f=4000", E["roomOpen"][0], ("peak", -16), "pintu besi ruang toa"),
        (SFX / "Radio Adjustment.mp3", "atrim=0:0.6,asetpts=PTS-STARTPTS,afade=t=out:st=0.4:d=0.2,highpass=f=300", E["monitorsOn"], ("peak", -20), "monitor menyala (USULAN)"),
        (SFX / "Keyboard 1.mp3", "atrim=0:0.8,asetpts=PTS-STARTPTS,afade=t=out:st=0.65:d=0.15,highpass=f=1200", E["type1"][0], ("peak", -28), "ketik sendiri 1 (S09)"),
        (SFX / "Keyboard 1.mp3", "atrim=0.9:1.6,asetpts=PTS-STARTPTS,afade=t=out:st=0.5:d=0.15,highpass=f=1200", E["type2"][0], ("peak", -28), "ketik sendiri 2 (S10b)"),
        (SFX / "1 Click Mouse.mp3", "lowpass=f=5000", E["click"] - 0.01, ("peak", -11), "sakelar OTOMATIS -> MIKROFON"),
    ]
    # footsteps in the gang (heel strikes from the stage via studio/out/e006_beats.json when present, else a grid)
    beats_p = ROOT / "studio/out/e006_beats.json"
    steps = json.loads(beats_p.read_text(encoding="utf-8"))["steps"] if beats_p.exists() else []
    src_step = SFX / "Slow,_careful_footst_#1.mp3"
    xs = PA.pcm_np(src_step)
    ons = PA.onsets_of(xs)
    for j, (tt, who) in enumerate(steps):
        o = ons[(j * 3 + (1 if who == "adik" else 0)) % len(ons)]
        g0 = max(0.0, o - 0.03)
        pk = PA.peak_time(xs, g0, o + 0.12)
        filt = f"atrim={g0}:{o + 0.32},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={o + 0.32 - g0 - 0.12}:d=0.12"
        cues.append((src_step, filt, round(tt - (pk - g0), 3), ("peak", -25.0 if who == "uq" else -29.0), f"langkah {who} @{tt:.2f}"))
    # beds: bathroom (muffled night) S01-S03; kitchen/gang/door night S04-S07; inside the toa room: monitor hum S08a-S14
    bed_src = PA.render_cue(SFX / "Quiet_night_ambience_#3.mp3", "", WORK, "bed_src")
    t_room = SHT["S08a"][0]
    # v5: the episode is 58.6 s (v4 51 s): a second seam inside U01 (the 30 s bed no longer covers N04 -> end)
    bed = EA.ambience_loop(bed_src, END + 0.5, [round((V["N04"]["at"] + V["N04"]["end"]) / 2, 2), round((V["U01"]["at"] + V["U01"]["end"]) / 2, 2)], WORK)
    s04 = SHT["S04a"][0]
    cues.append((bed, f"atrim=0:{s04 + 0.3},lowpass=f=900,afade=t=in:d=0.3,afade=t=out:st={s04 - 0.1}:d=0.4", 0.0, ("rms_ref_db", -36 - 8), "bed teredam kamar mandi (S01-S03)"))
    cues.append((bed, f"atrim={s04 - 0.1}:{t_room + 0.5},asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st={t_room - s04 + 0.1}:d=0.5", s04 - 0.1, ("rms_ref", -36), "bed malam dapur/gang (S04-S07)"))
    cues.append((bed, f"atrim={t_room}:{s15 + 0.3},asetpts=PTS-STARTPTS,lowpass=f=1200,afade=t=in:d=0.6,afade=t=out:st={s15 - t_room - 0.3}:d=0.3", t_room, ("rms_ref_db", -36 - 10), "bed malam teredam di ruang toa (sampai S15)"))
    cues.append((SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{t_room},lowpass=f=2600,afade=t=in:d=0.5,afade=t=out:st={t_room - 0.6}:d=0.6", 0.0, ("rms_hum", -44), "dengung toa (luar)"))
    # the toa-room hum (monitors) from the monitors' power-on to the stare (the closing audio carries its own faint hum)
    hum_len = s15 - E["monitorsOn"]
    hum = PA.render_cue(SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{hum_len + 0.4},highpass=f=150,lowpass=f=600,afade=t=in:d=0.4,afade=t=out:st={hum_len - 0.3}:d=0.4", WORK, "roomhum")
    cues.append((hum, "", E["monitorsOn"], ("rms_hum", -46), "dengung monitor ruang toa (USULAN)"))
    # the closing shot (D-067): added AFTER the master at its own (v0f) level, so the loudness normalisation of the
    # episode does not change the approved closing (hit peak, ring level)
    bed_full = PA.render_cue(bed, "", WORK, "bedfull")
    hum_full = PA.render_cue(SYN / "toa_hum.wav", f"aloop=loop=-1:size=2e9,atrim=0:{END},lowpass=f=2600", WORK, "humfull")
    ref = {"rms_ref": PA.rms_af(bed_full, "anull"), "rms_hum": PA.rms_af(hum_full, "anull")}
    tracks, report = [], []
    for i, (src, filt, at, (kind, tgt), label) in enumerate(cues):
        w = PA.render_cue(src, filt, WORK, f"e{i:03d}") if filt or kind != "gain" else src
        if kind == "lufs":
            cur = PA.lufs(w)[0]
        elif kind == "peak":
            cur = peak_of(w)
        elif kind == "rms_ref_db":
            cur = ref["rms_ref"]
        elif kind == "gain":
            cur = 0.0
        else:
            cur = ref[kind]
        g = tgt - cur
        tracks.append((w, at, g, label))
        if label in POST:
            report.append(f"   post: {POST[label]}")
        report.append(f"{label:62s} @ {at:7.2f} s  {kind} {cur:7.1f} -> {tgt:.1f} dB (gain {g:+.1f})")
    parts = []
    for c0 in range(0, len(tracks), 32):
        args, fl, chunk = [], [], tracks[c0:c0 + 32]
        for j, (w, at, g, _l) in enumerate(chunk):
            args += ["-i", str(w)]
            post = ("," + POST[_l]) if _l in POST else ""
            fl.append(f"[{j}:a]aresample={PA.SR},volume={g:.2f}dB{post},adelay={int(round(at * 1000))}|{int(round(at * 1000))},apad=whole_dur={END + 0.5}[t{j}]")
        fl.append("".join(f"[t{j}]" for j in range(len(chunk))) + f"amix=inputs={len(chunk)}:normalize=0:duration=longest,atrim=0:{END}[m]")
        p = WORK / f"{a.name}_part{c0 // 32}.wav"
        r = PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args, "-filter_complex", ";".join(fl), "-map", "[m]", "-ac", "1", "-ar", str(PA.SR), "-c:a", "pcm_f32le", str(p)])
        if r.returncode:
            sys.exit(r.stderr)
        parts.append(p)
    pre = WORK / f"{a.name}_premix.wav"
    args = sum([["-i", str(p)] for p in parts], [])
    fl = "".join(f"[{j}:a]" for j in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0:duration=longest,atrim=0:{END}[m]"
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
    # the closing (v0f reproduction) on top of the mastered episode, at unity gain from the start of S15
    import wave
    with wave.open(str(tmp), "rb") as w:
        nch, sr0, frames = w.getnchannels(), w.getframerate(), w.readframes(w.getnframes())
    x = np.frombuffer(frames, dtype="<i2").astype(np.float32).reshape(-1, nch) / 32767
    cl = closing006_audio()
    if sr0 != SR:
        sys.exit(f"sample rate {sr0} != {SR}")
    a0 = int(round(s15 * SR))
    n = min(len(cl), len(x) - a0)
    x = x.copy()
    x[a0:a0 + n] += cl[:n, None]
    fin = WORK / f"{a.name}_final.wav"
    with wave.open(str(fin), "wb") as w:
        w.setnchannels(nch); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    i2, tp2 = PA.true_peak(fin)
    aacf = WORK / f"{a.name}_final.m4a"
    PA.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(fin), "-c:a", "aac", "-b:a", "192k", str(aacf)])
    ia2, tpa2 = PA.true_peak(aacf)
    print(f"  + closing (v0f) at {s15:.3f} s: WAV {i2:.2f} LUFS TP {tp2:.2f} | AAC {ia2:.2f} LUFS TP {tpa2:.2f}")
    if max(tp2, tpa2) > -1.0:
        sys.exit("closing pushes the true peak over -1.0 dBTP")
    shutil.copy2(fin, out)
    report.insert(0, f"closing v0f added after the master at {s15:.3f} s (unity): final WAV {i2:.2f} LUFS TP {tp2:.2f}; AAC {ia2:.2f} LUFS TP {tpa2:.2f}")
    report.insert(0, f"master: gain {gain:+.2f} dB, ceiling {ceil:.1f} dB; WAV {i1:.2f} LUFS TP {tpw:.2f}; AAC {ia:.2f} LUFS TP {tpa:.2f}; premix {i0:.2f} LUFS")
    (OUT_DIR / f"{a.name}_cues.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report[:1]))
    print(len(cues), "cues; wrote", out)


def cmd_closing(a):
    """the closing audio alone (for comparison with v0f): writes <out>.wav"""
    p = Path(a.out)
    if p.exists():
        sys.exit(f"refuse to overwrite {p}")
    p.parent.mkdir(parents=True, exist_ok=True)
    write_wav(p, closing006_audio())
    print("wrote", p)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("plan").set_defaults(fn=cmd_plan)
    m = sub.add_parser("mix")
    m.add_argument("--name", required=True)
    m.set_defaults(fn=cmd_mix)
    c = sub.add_parser("closing")
    c.add_argument("--out", required=True)
    c.set_defaults(fn=cmd_closing)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
