// Episode 2026-11-003 — FULL EPISODE S01–S12, draft (D-043 pending). Same Remotion structure as the approved pilot v3
// (Pilot003.tsx): one <Sequence> per shot on frame boundaries, the stage from episodeAt(t) (episode003Stage.ts, a pure
// function of time, shared with tools/e003_check.ts), captions in their own layer. The pilot shots (S03–S06) are
// rendered from the pilot stage itself, with the pilot's flashback grade. Overlays: the "HARI 1 / EPISODE 2" label (Ep 1
// DayLabel, two lines), the phone UI in S08 (Ep 1 PhoneUI pattern, the officer's message from this plan, not
// captioned), the vertical choice cards in S12. The mix is muxed after the render (scripts/ep003_episode_audio.py).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import type { MoodPreset } from "../inkbeat/core/moods";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT, PhoneV3, TorchV3 } from "./LookDev003";
import { FLASH_GRADE } from "./Pilot003";
import { CARDS_AT, END, episodeAt, FPS, FRAMES, LINES, RECAP, RECAP_CLICK, RECAP_OUT, SHOTS } from "./episode003Stage";
import type { ELine } from "./episode003Stage";

export const EPISODE003_FPS = FPS;
export const EPISODE003_FRAMES = FRAMES;
const sstep = (x: number) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};
const rimScaled = (m: MoodPreset, k: number): MoodPreset => (k === 1 ? m : { ...m, castLight: { ...m.castLight, rim: { ...m.castLight.rim, intensity: m.castLight.rim.intensity * k } } });

/** the phone's screen, lit (S08–S09): an unlit plate over the PhoneV3 screen + a small cold light on the faces */
const PhoneScreen: React.FC<{ p: V3; q: [number, number, number, number]; glow: number }> = ({ p, q, glow }) => {
  if (glow <= 0.001) return null;
  const c = new THREE.Color("#1c2230").lerp(new THREE.Color("#dfe9ff"), glow);
  const front = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(...q)).multiplyScalar(0.12);
  return (
    <>
      <group position={p} quaternion={new THREE.Quaternion(...q)}>
        <mesh position={[0, 0, -0.0068]}>
          <boxGeometry args={[0.06, 0.128, 0.0006]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      </group>
      {/* a faint cold light up from the screen onto the face (0.55 turned the black tee bright blue: costume colour must hold) */}
      <pointLight position={[p[0] + front.x, p[1] + front.y + 0.1, p[2] + front.z]} color="#cfe0ff" intensity={0.12 * glow} distance={0.7} decay={2} />
    </>
  );
};

const ShotView: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const st = episodeAt((from + f) / FPS);
  const t = st.ts;
  const view = (
    <View mood={NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={st.shot === "s04" ? 0.8 : st.eshot === "s08" ? 0.7 : 0.5}>
      <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={st.bolt} backDoorShake={st.doorShake} />
      {st.chars.map((c, i) =>
        c.who === "uq" ? (
          <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose} hands={c.hands} legPose={c.legPose} face={c.face} blinkSeed={c.blinkSeed} />
        ) : (
          <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...c.pose }} legPose={c.legPose} face={c.face} />
        ),
      )}
      {st.shot === "s06" || st.eshot === "s10" ? null : <PhoneV3 p={st.phone.p} q={st.phone.q} />}
      <PhoneScreen p={st.phone.p} q={st.phone.q} glow={st.glow} />
      {st.torch ? <TorchV3 from={st.torch.from} aim={st.torch.aim} cover={0.45} leak={st.torch.leak} leakAt={st.torch.leakAt} /> : null}
      <CharLight chars={st.chars} cam={st.cam.pos} mood={rimScaled(charScaled(NIGHT_INT, st.charK), st.rimK)} />
    </View>
  );
  if (st.shot !== "s06f") return view;
  const g = FLASH_GRADE;
  const flash = f < g.flashFrames ? g.flashPeak * (1 - f / g.flashFrames) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `saturate(${g.saturate}) brightness(${g.brightness})` }}>{view}</AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,${g.vignette}) 100%)` }} />
      {flash > 0 ? <AbsoluteFill style={{ background: `rgba(255,248,235,${flash})` }} /> : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ captions (as the pilot: caps, active word lit; L14 = the message, on the phone UI instead)
const COLOR: Record<string, string> = { n: "#ffffff", toa: "#ffe7a3", adik: "#ffc9d8" };
const ACCENT = "#d4f03c";
type W = { text: string; a: number; b: number; who: string };
const strip = (w: string) => w.replace(/[“”"]/g, "");
const spread = (ws: string[], a0: number, b0: number, who: string): W[] => {
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => {
    const a = a0 + ((b0 - a0) * acc) / total;
    acc += w.length + 1;
    return { text: w, a, b: a0 + ((b0 - a0) * acc) / total, who };
  });
};
const WORDS: W[] = LINES.filter((l) => l.who !== "msg").flatMap((l: ELine) => {
  const ws = l.text.split(/\s+/).map(strip).filter(Boolean);
  const groups: string[][] = [[]];
  ws.forEach((w, i) => {
    groups[groups.length - 1].push(w);
    if (/[.?!…]$/.test(w) && i < ws.length - 1) groups.push([]);
  });
  const bursts = l.bursts ?? [];
  if (bursts.length > 1 && bursts.length === groups.length) return groups.flatMap((g, i) => spread(g, bursts[i][0], bursts[i][1], l.who));
  return spread(ws, l.start, l.end, l.who);
});
type Page = { words: W[]; a: number; b: number };
const PAGES: Page[] = (() => {
  const pages: Page[] = [];
  let cur: W[] = [];
  const flush = () => {
    if (cur.length) pages.push({ words: cur, a: cur[0].a - 2 / 30, b: cur[cur.length - 1].b + 0.25 });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    if (prev && (prev.who !== w.who || w.a - prev.b > 0.15)) flush();
    cur.push(w);
    if (cur.length >= 3 || /[.?!,…]$/.test(w.text)) flush();
  });
  flush();
  pages.forEach((p, i) => {
    if (i + 1 < pages.length) p.b = Math.min(p.b, pages[i + 1].a);
  });
  return pages;
})();
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const p = PAGES.find((x) => t >= x.a && t < x.b);
  if (!p) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1920 * 0.7 - 80, height: 160, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: 24 }}>
      {p.words.map((w, i) => {
        const on = t >= w.a - 0.066 && t < w.b + 0.04;
        return (
          <span key={i} style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 88, lineHeight: 1.05, color: on ? ACCENT : COLOR[w.who] ?? "#fff", WebkitTextStroke: "13px #0e0a10", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>
            {w.text.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ "HARI 1 / EPISODE 2" (Ep 1 DayLabel, two lines in the same pill; D-036 / content.md §2.2)
export const DayLabel2: React.FC<{ t: number }> = ({ t }) => {
  const a = sstep((t - 0.25) / 0.5) * (1 - sstep((t - 4.4) / 0.5));
  if (a <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 1080 * 0.08, top: 1920 * 0.12, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 18px", borderRadius: 16, background: "rgba(16, 22, 46, 0.9)", border: "2px solid rgba(160, 176, 230, 0.22)", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
        <path d="M19.5 3.5a11.5 11.5 0 1 0 7 20.6A9.5 9.5 0 0 1 19.5 3.5Z" fill="#ffe7a3" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>HARI 1</span>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>EPISODE 2</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ choice cards, Episode 1 style (owner 2026-11-18, D-043:
// replaces the approved vertical stack). Constants copied verbatim from ep002/overlay.tsx `Cards` (left/right 60, top 170,
// gap 30, padding 34/26, radius 30, border 6, shadow, Poppins 800 54 px, line-height 1.12; entry: fade 0.35 s, card i
// starts i·0.2 s late, from 30 px above). Measured on Ep 1 final's last frame: cream x 66–518 / 561–1013, y 176–364.
export type CardsEp1Props = {
  t: number; items: string[]; inAt: number;
  /** recap: the index of the card that is clicked, when, and when both fade out together */
  click?: { index: number; at: number }; outAt?: number; outDur?: number;
};
export const CardsEp1: React.FC<CardsEp1Props> = ({ t, items, inAt, click, outAt, outDur = 0.35 }) => {
  if (t < inAt) return null;
  const out = outAt === undefined ? 1 : 1 - sstep((t - outAt) / outDur);
  if (out <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 170, display: "flex", gap: 30, justifyContent: "center" }}>
      {items.map((s, i) => {
        const k = sstep((t - inAt - i * 0.2) / 0.35);
        // the click: 1.0 → 1.1 in 0.1 s, back to 1.0 in 0.2 s (scaled from the centre); a thin lime ring stays until the fade
        const sel = click && click.index === i && t >= click.at;
        const up = sel ? sstep((t - click!.at) / 0.1) * (1 - sstep((t - click!.at - 0.1) / 0.2)) : 0;
        const ring = sel ? sstep((t - click!.at) / 0.12) : 0;
        return (
          <div key={s} style={{ flex: 1, padding: "34px 26px", borderRadius: 30, background: "rgba(252,246,234,0.95)", border: "6px solid #1b1a2a", boxShadow: `0 10px 0 rgba(27,26,42,0.85)${ring > 0 ? `, 0 0 0 ${(5 * ring).toFixed(2)}px rgba(212,240,60,${(0.95 * ring).toFixed(3)})` : ""}`, opacity: k * out, transform: `translateY(${(1 - k) * -30}px) scale(${(1 + 0.1 * up).toFixed(4)})`, transformOrigin: "center", textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: "#1b1a2a" }}>
            {s}
          </div>
        );
      })}
    </div>
  );
};
export const EP1_CHOICES = ["tetap di dalam", "keluar lewat belakang"];
export const EP2_CHOICES = ["intip pintu depan", "tetap diam bersama adik"];

// ------------------------------------------------------------------ the phone UI (S08): notification → the officer's chat → the message (L14)
const L13 = LINES.find((l) => l.id === "L13")!;
const L14 = LINES.find((l) => l.id === "L14")!;
const UI_IN = (L13.bursts && L13.bursts.length > 1 ? L13.bursts[1][0] : L13.start + 1.0) - 0.35;
const UI_OUT = SHOTS.find((s) => s.id === "s09")!.start;
const NOTIF = UI_IN + 0.15;
export const PhoneUI2: React.FC<{ t: number }> = ({ t }) => {
  if (t < UI_IN || t >= UI_OUT) return null;
  const a = sstep((t - UI_IN) / 0.25);
  const chat = t >= NOTIF + 0.9;
  const msgK = sstep((t - L14.start + 0.15) / 0.25);
  return (
    <div style={{ position: "absolute", left: 140, top: 150, width: 800, height: 1110, borderRadius: 70, background: "#16151c", border: "12px solid #2a2833", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", opacity: a, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: 54, background: chat ? "#e9e6df" : "#1f2433", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {chat ? (
          <>
            <div style={{ height: 110, background: "#3c4a63", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
              <div style={{ width: 66, height: 66, borderRadius: 33, background: "#f3efe6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="38" height="44" viewBox="0 0 38 44"><path d="M19 2 L35 8 V21 C35 32 28 39 19 42 C10 39 3 32 3 21 V8 Z" fill="#3c4a63" /></svg>
              </div>
              <div style={{ height: 18, width: 220, borderRadius: 9, background: "rgba(255,255,255,0.55)", filter: "blur(2px)" }} />
            </div>
            <div style={{ flex: 1, padding: "40px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
              {/* the earlier message from Episode 1 (unreadable), then the new one */}
              <div style={{ alignSelf: "flex-start", width: 560, padding: "18px 22px", borderRadius: 26, background: "#f4f2ee", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ height: 14, width: "92%", borderRadius: 7, background: "rgba(40,40,50,0.28)", filter: "blur(3px)" }} />
                <div style={{ height: 14, width: "64%", borderRadius: 7, background: "rgba(40,40,50,0.22)", filter: "blur(3px)" }} />
              </div>
              {t < L14.start - 0.15 ? (
                <div style={{ alignSelf: "flex-start", padding: "26px 30px", borderRadius: 28, background: "#ffffff", display: "flex", gap: 14 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: "#7a7f8c", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((t * 3 - i * 0.35) * Math.PI)) }} />
                  ))}
                </div>
              ) : null}
              {msgK > 0 ? (
                <div style={{ alignSelf: "flex-start", maxWidth: 640, padding: "22px 28px", borderRadius: 28, background: "#ffffff", boxShadow: "0 4px 0 rgba(0,0,0,0.12)", opacity: msgK, transform: `translateY(${(1 - msgK) * 18}px)`, fontFamily: "Poppins", fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: "#1b1a22" }}>
                  {strip(L14.text)}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          // the lock screen while it buzzes: time-of-night clock, no text
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 140, gap: 18 }}>
            <div style={{ height: 120, width: 360, borderRadius: 20, background: "rgba(255,255,255,0.18)" }} />
            <div style={{ height: 22, width: 260, borderRadius: 11, background: "rgba(255,255,255,0.14)" }} />
          </div>
        )}
      </div>
      {t >= NOTIF && t < NOTIF + 0.9 ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 40 + (1 - sstep((t - NOTIF) / 0.2)) * -140, height: 120, borderRadius: 30, background: "rgba(250,250,252,0.97)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 22, padding: "0 26px" }}>
          <svg width="46" height="54" viewBox="0 0 38 44"><path d="M19 2 L35 8 V21 C35 32 28 39 19 42 C10 39 3 32 3 21 V8 Z" fill="#3c4a63" /></svg>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ height: 16, width: "40%", borderRadius: 8, background: "rgba(30,30,40,0.5)" }} />
            <div style={{ height: 14, width: "75%", borderRadius: 7, background: "rgba(30,30,40,0.25)", filter: "blur(2px)" }} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Overlays: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <PhoneUI2 t={t} />
      {/* draft v2 recap: Episode 1's two cards on the freeze, "tetap di dalam" clicked, both fade out together */}
      {RECAP > 0 ? <CardsEp1 t={t} items={EP1_CHOICES} inAt={-1} click={{ index: 0, at: RECAP_CLICK }} outAt={RECAP_OUT} outDur={RECAP - RECAP_OUT} /> : null}
      <CardsEp1 t={t} items={EP2_CHOICES} inAt={CARDS_AT} />
      {/* the label after the recap cards are gone (same in/hold/out as Ep 1, shifted by the recap) */}
      <DayLabel2 t={t - RECAP} />
    </>
  );
};

/** draft v1–v2 only (the script's "lalu potong ke hitam"): the last 0.4 s black. Not used since final v1 (D-044). */
export const CutToBlack: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return t >= END - 0.4 ? <AbsoluteFill style={{ background: "#000" }} /> : null;
};

export const Episode003: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {SHOTS.map((s, i) => {
        const from = Math.round(s.start * FPS);
        const to = Math.min(Math.round(s.end * FPS), FRAMES);
        return (
          <Sequence key={i} name={s.id.toUpperCase()} from={from} durationInFrames={to - from}>
            <ShotView from={from} />
          </Sequence>
        );
      })}
      <Overlays />
      <Captions />
      {/* (draft v1–v2: the last 0.4 s black; removed in final v1, owner 2026-11-18, D-044, as in Episode 1) */}
    </AbsoluteFill>
  );
};
