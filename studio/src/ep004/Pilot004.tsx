// Episode 3 (2026-11-004) PILOT v1 (owner 2026-11-20, D-049): Blok A 0–6.8 s + Blok B 27.4–35.0 s of the episode,
// joined by a hard cut. Same Remotion structure as Episode003.tsx: one <Sequence> per shot on frame boundaries, the
// stage from stageAt(epTime(frame)) (pilot004Stage.ts, a pure function of time), captions/overlays in their own layer.
// Set, cast, light: Episode 2's approved house (NIGHT_INT, local light, dressing, vent "lit2"); new assets from
// LookDev004.tsx (hidden cameras + LED + occlusion-gated halo, slotted knob, lens glint).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { CardsEp1, EP2_CHOICES } from "../ep003/Episode003";
import { EP2_END } from "./e004Poses";
import { Glint, Halo, HALO_BY_LED, HiddenCam, KnobSlot, ledWorld, lensWorld } from "./LookDev004";
import { adikAt, BEATS, BLOCKS, CARDS, epTime, FPS, LINES, PILOT_FRAMES, SHOTS, stageAt, uqAt } from "./pilot004Stage";
import type { PLine } from "./pilot004Stage";

export const PILOT004_FRAMES = PILOT_FRAMES;
export const PILOT004_FPS = FPS;
const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };

const ShotView: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const t = epTime(from + f);
  const st = stageAt(t);
  const pov = st.shot === "s08a" || st.shot === "s09";
  const uq = uqAt(t), ad = adikAt(t);
  const chars = st.chars ? (pov ? [ad] : [uq, ad]) : []; // POV = Uq's eye: his own body is not drawn
  const occ = chars.map((c) => ({ root: c.root, height: c.height, who: c.who as "uq" | "adik" }));
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={st.blur}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={st.push ?? 0} />
        <HiddenCam id="T" on={st.ledT} />
        <HiddenCam id="D" on={0} />
        <HiddenCam id="L" on={0} />
        <HiddenCam id="K" on={0} />
        {st.knob !== undefined ? (
          <>
            <KnobSlot deg={st.knob} dz={st.push ?? 0} />
            {/* the vent glass's cold glow on the door (motivated), ×6 (D-049: ≤ 85 % dark pixels) */}
            <pointLight position={[-0.85, 2.05, -4.7]} color="#9bb0ff" intensity={0.35 * (st.vent ?? 0)} distance={2.2} decay={2} />
          </>
        ) : null}
        {chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose} hands={c.hands} legPose={c.legPose} face={c.face} blinkSeed={c.blinkSeed} />
          ) : (
            <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...c.pose }} legPose={c.legPose} face={c.face} />
          ),
        )}
        {st.chars && !pov ? <PhoneV3 p={EP2_END.phone.p} q={EP2_END.phone.q} /> : null}
        {chars.length ? <CharLight chars={chars} cam={st.cam.pos} mood={NIGHT_INT} /> : null}
      </View>
      <Halo c={st.cam} p={ledWorld("T")} on={st.ledT} d={HALO_BY_LED.T} occ={occ} />
      <Glint c={st.cam} p={lensWorld("T")} k={st.glint} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ captions (Ep 2 style: caps, active word lit; adik pink)
const COLOR: Record<string, string> = { n: "#ffffff", adik: "#ffc9d8" };
const ACCENT = "#d4f03c";
type W = { text: string; a: number; b: number; who: string };
const strip = (w: string) => w.replace(/[“”"]/g, "");
const spread = (ws: string[], a0: number, b0: number, who: string): W[] => {
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => { const a = a0 + ((b0 - a0) * acc) / total; acc += w.length + 1; return { text: w, a, b: a0 + ((b0 - a0) * acc) / total, who }; });
};
const WORDS: W[] = LINES.flatMap((l: PLine) => {
  const ws = l.text.split(/\s+/).map(strip).filter(Boolean);
  if (l.bursts && l.bursts.length === 2) return [...spread(ws.slice(0, 1), l.bursts[0][0], l.bursts[0][1], l.who), ...spread(ws.slice(1), l.bursts[1][0], l.bursts[1][1], l.who)];
  return spread(ws, l.start, l.end, l.who);
});
type Page = { words: W[]; a: number; b: number };
const PAGES: Page[] = (() => {
  const pages: Page[] = [];
  let cur: W[] = [];
  const flush = () => { if (cur.length) pages.push({ words: cur, a: cur[0].a - 2 / 30, b: cur[cur.length - 1].b + 0.25 }); cur = []; };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    if (prev && (prev.who !== w.who || w.a - prev.b > 0.15)) flush();
    cur.push(w);
    if (cur.length >= 3 || /[.?!,…]$/.test(w.text)) flush();
  });
  flush();
  pages.forEach((p, i) => { if (i + 1 < pages.length) p.b = Math.min(p.b, pages[i + 1].a); });
  return pages;
})();
const Captions: React.FC<{ t: number }> = ({ t }) => {
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

/** "HARI 1 / EPISODE 3" (Ep 2 DayLabel2, label text only changed), 0.25–4.9 s (D-046) */
const DayLabel3: React.FC<{ t: number }> = ({ t }) => {
  const a = sstep((t - 0.25) / 0.5) * (1 - sstep((t - 4.4) / 0.5));
  if (a <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 1080 * 0.08, top: 1920 * 0.12, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 18px", borderRadius: 16, background: "rgba(16, 22, 46, 0.9)", border: "2px solid rgba(160, 176, 230, 0.22)", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden><path d="M19.5 3.5a11.5 11.5 0 1 0 7 20.6A9.5 9.5 0 0 1 19.5 3.5Z" fill="#ffe7a3" /></svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>HARI 1</span>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>EPISODE 3</span>
      </div>
    </div>
  );
};

const Overlays: React.FC = () => {
  const t = epTime(useCurrentFrame());
  return (
    <>
      {/* the Ep 2 choice recap over the moving S02 (no freeze): 5.0–6.5 s, "tetap diam bersama adik" clicked (D-046) */}
      {/* v3 (D-051, option 2): in at T + 0.5 s, the right card 0.2 s later; click 0.5 s after the RIGHT card appears and held
          1.0 s after the click (both USULAN); the click SFX is on the same beat (BEATS.recapClick = CARDS.click) */}
      {t < 12 ? <CardsEp1 t={t} items={EP2_CHOICES} inAt={CARDS.in} click={{ index: 1, at: BEATS.recapClick }} outAt={CARDS.out} outDur={CARDS.fade} /> : null}
      <DayLabel3 t={t} />
      <Captions t={t} />
    </>
  );
};

export const Pilot004: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  // pilot-frame boundaries of each shot
  let base = 0;
  const seqs: { id: string; from: number; dur: number }[] = [];
  for (const [a, b] of BLOCKS) {
    for (const s of SHOTS.filter((x) => x.start >= a - 1e-9 && x.end <= b + 1e-9)) {
      const from = base + Math.round((s.start - a) * FPS);
      const to = base + Math.round((s.end - a) * FPS);
      seqs.push({ id: s.id, from, dur: to - from });
    }
    base += Math.round((b - a) * FPS);
  }
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {seqs.map((s) => (
        <Sequence key={s.id} name={s.id.toUpperCase()} from={s.from} durationInFrames={s.dur}>
          <ShotView from={s.from} />
        </Sequence>
      ))}
      <Overlays />
    </AbsoluteFill>
  );
};
