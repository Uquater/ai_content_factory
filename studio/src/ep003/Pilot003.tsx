// Episode 2026-11-003 — PILOT S03–S06 (L5–L9), ±15 s with sound (STUDIO-WORKFLOW S7, D-039).
// Remotion structure as the Ep 1 pilot (src/ep002/Pilot.tsx): one <Sequence> per shot on frame boundaries, each shot
// reads useCurrentFrame() and maps it back to pilot time; captions in their own layer. Everything on screen comes
// from stageAt(t) (pilot003Stage.ts), a pure function of time, shared with the numeric checks (tools/p003_check.ts).
// The mix (VO + toa effect + SFX + night bed) is muxed after the render (scripts/ep003_pilot_mix.py).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import type { MoodPreset } from "../inkbeat/core/moods";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT, PhoneV3, TorchV3 } from "./LookDev003";
import { FPS, P1 } from "./pilot003Stage";
import type { Line, Pilot003Build } from "./pilot003Stage";
import { P2 } from "./pilot003V2";
import { P3 } from "./pilot003V3";

export const PILOT003_FPS = FPS;
export const PILOT003_FRAMES = P1.FRAMES;
export const PILOT003V2_FRAMES = P2.FRAMES;
export const PILOT003V3_FRAMES = P3.FRAMES;

const rimScaled = (m: MoodPreset, k: number): MoodPreset => (k === 1 ? m : { ...m, castLight: { ...m.castLight, rim: { ...m.castLight.rim, intensity: m.castLight.rim.intensity * k } } });

/** v2 flashback grade (s06f): a little desaturated and lifted, with a soft vignette (content.md §11 options) */
// flashPeak 0.28 in the first v2 render washed the whole frame grey for 3 frames (+50/255 luma at the cut): too much
// for "pembeda halus" (owner), so 0.08
export const FLASH_GRADE = { saturate: 0.55, brightness: 1.06, vignette: 0.35, flashFrames: 3, flashPeak: 0.08 };
const ShotView: React.FC<{ from: number; P: Pilot003Build; noTorch?: boolean; vent?: "lit" | "lit2" }> = ({ from, P, noTorch, vent }) => {
  const f = useCurrentFrame();
  const st = P.stageAt((from + f) / FPS);
  // scene time: = pilot time, except in the v2 flashback (it replays the S03 glass hold)
  const t = st.ts;
  const view = (
    <View mood={NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={st.shot === "s04" ? 0.8 : 0.5}>
      <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent={vent ?? P.V.vent} backBolt={st.bolt} />
      {st.chars.map((c, i) =>
        c.who === "uq" ? (
          <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose} hands={c.hands} legPose={c.legPose} face={c.face} blinkSeed={c.blinkSeed} />
        ) : (
          <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...c.pose }} face={c.face} />
        ),
      )}
      {st.shot === "s06" ? null : <PhoneV3 p={st.phone.p} q={st.phone.q} />}
      {st.torch && !noTorch ? <TorchV3 from={st.torch.from} aim={st.torch.aim} cover={0.45} leak={st.torch.leak} leakAt={st.torch.leakAt} /> : null}
      <CharLight chars={st.chars} cam={st.cam.pos} mood={rimScaled(charScaled(NIGHT_INT, st.charK), st.rimK)} />
    </View>
  );
  if (st.shot !== "s06f") return view;
  // memory grade on this shot only (captions are a separate layer and stay ungraded); a 3-frame light lift at the cut in
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

// ------------------------------------------------------------------ captions (Ep 1 style: caps, active word lit)
const COLOR: Record<string, string> = { n: "#ffffff", toa: "#ffe7a3", adik: "#ffc9d8" };
const ACCENT = "#d4f03c";
type W = { text: string; a: number; b: number; who: string };
const strip = (w: string) => w.replace(/[“”"]/g, "");
/** word onsets spread by letter count (the voice-over gives line timing, not word timing). When a line has as many
 * speech bursts (plan "bursts", pauses ≥ 0.12 s) as sentence groups ("Klik. | Pintu belakang terkunci.", "Kak… |
 * kaca …"), each group is spread over its own burst, so a word never lights up during the pause before it. */
const spread = (ws: string[], a0: number, b0: number, who: string): W[] => {
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => {
    const a = a0 + ((b0 - a0) * acc) / total;
    acc += w.length + 1;
    return { text: w, a, b: a0 + ((b0 - a0) * acc) / total, who };
  });
};
const wordsOf = (LINES: Line[]): W[] => LINES.flatMap((l) => {
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
const pagesOf = (WORDS: W[]): Page[] => {
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
};
const PAGES_BY = new Map<Pilot003Build, Page[]>();
const pagesFor = (P: Pilot003Build) => {
  if (!PAGES_BY.has(P)) PAGES_BY.set(P, pagesOf(wordsOf(P.LINES)));
  return PAGES_BY.get(P)!;
};
const Captions: React.FC<{ P: Pilot003Build }> = ({ P }) => {
  const PAGES = pagesFor(P);
  const TIMING = P.TIMING;
  const t = useCurrentFrame() / FPS;
  const p = PAGES.find((x) => t >= x.a && t < x.b);
  return (
    <>
      {p ? (
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
      ) : null}
      {TIMING === "provisional" ? (
        <div style={{ position: "absolute", left: 30, top: 30, fontFamily: "Poppins", fontWeight: 800, fontSize: 26, color: "#ff8a8a", textShadow: "0 0 6px #000" }}>TIMING SEMENTARA (belum dari audio)</div>
      ) : null}
    </>
  );
};

const PilotOf: React.FC<{ P: Pilot003Build; noTorch?: boolean; vent?: "lit" | "lit2" }> = ({ P, noTorch, vent }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {P.SHOTS.map((s, i) => {
        const from = Math.round(s.start * FPS);
        const to = Math.min(Math.round(s.end * FPS), P.FRAMES);
        return (
          <Sequence key={i} name={s.id.toUpperCase()} from={from} durationInFrames={to - from}>
            <ShotView from={from} P={P} noTorch={noTorch} vent={vent} />
          </Sequence>
        );
      })}
      <Captions P={P} />
    </AbsoluteFill>
  );
};
/** pilot v1 (rendered 2026-11-18, `npm run render:pilot003`) */
export const Pilot003: React.FC = () => <PilotOf P={P1} />;
/** pilot v2: S03 glass insert, S06 flashback + glass now dark, toa switch-on gap (`npm run render:pilot003v2`) */
/** QC probes only (stills): `noTorch` = the same frame without the torch (proves the warm glass is the torch's);
 * `vent` = another vent material (v1 "lit" next to v2 "lit2" for the owner) */
export const Pilot003v2: React.FC<{ noTorch?: boolean; vent?: "lit" | "lit2" }> = ({ noTorch, vent }) => <PilotOf P={P2} noTorch={noTorch} vent={vent} />;
/** pilot v3: lifted steps, S05 on the toa switch-on, wider glass insert (`npm run render:pilot003v3`); probes as v2 */
export const Pilot003v3: React.FC<{ noTorch?: boolean; vent?: "lit" | "lit2" }> = ({ noTorch, vent }) => <PilotOf P={P3} noTorch={noTorch} vent={vent} />;
