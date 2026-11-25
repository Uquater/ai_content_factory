// Episode 4 (2026-11-005) FULL EPISODE preview (owner 2026-11-23, after approving the opening pilot v3).
// 0 → OPEN end: Pilot005v3 unchanged (its own captions off; the episode draws one caption layer over everything).
// S04–S15: episode005Stage.ts on the global clock t = frame / 30 (the clock of the mix and the captions).
// Captions = the Ep 3 final rules (captions005.tsx, lesson 2026-11-23-audio-toa-caption-ep4-pilot-v2-v3): narrator, toa and
// adik lines; the two MESSAGES (N03 = L6, N05 = L8) are shown on the phone UI and not captioned (Ep 2/3 rule).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";
import { lookTurn } from "../cast/walk";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ANAK_B, ADIK_B, BAPAK_B, W10_B, W3_B, W4_B, W5_B, W6_B, W7_B, W8_B } from "../ep002/castV3";
import { C1_BODIED, INK_NIGHT, thin } from "../ep002/LookDev";
import { HouseInterior, StreetSet } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { CardsAB } from "../ep004/Episode004";
import { Halo, HALO_BY_LED, HiddenCam, ledWorld } from "../ep004/LookDev004";
import { PhoneScreen004 } from "../ep004/overlay004";
import { JacketOnSofa, Pole } from "./Animatic005v2";
import { captionPages, captionWords, Captions005 } from "./captions005";
import type { ELine } from "./captions005";
import { charsAt, EV, SH, shotOf, stageAt, yawTo } from "./episode005Stage";
import { poleAt, tapeAt, TAPE } from "./open005v4";
import { DayLabel4, PhoneUI005 } from "./overlay005";
import { Pilot005v3 } from "./Pilot005v3";
import PLAN from "./episode005-plan.json";

export const EPISODE005_FRAMES = PLAN.frames;
const OPEN_END = SH.OPEN[1];
const LEDS = ["T", "D", "L", "K"] as const;
const NIGHT_EXT = thin("night", INK_NIGHT, 0.12, 0.2, 0.3, 1.0); // = Ep 1 AnimaticV3 exterior mood
const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };
const AD_PRESET = { ...ADIK_B, accessory: undefined }; // the jacket stays on the sofa (E4)
const POLE_REST = poleAt(0); // leaning on the bedroom-side wall (never in Ep 2–3 frames)
const TAPE_LENS = tapeAt(99);
const TapeLD: React.FC<{ c: V3; n: V3 }> = ({ c, n }) => {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...n).normalize());
  return <group position={c} quaternion={[q.x, q.y, q.z, q.w]}><M g={boxG(TAPE.w, TAPE.h, 0.0015)} c="#f1ead2" tex="paper" cast={false} /></group>;
};

// ------------------------------------------------------------------ captions (Ep 3 final rules)
type VoP = { who: string; text: string; capBursts: number[][] };
const VOX = PLAN.vo as unknown as Record<string, VoP>;
const LINES: ELine[] = [
  { id: "L1", who: "toa", text: "“Kalian memilih menutupnya.”", bursts: VOX.P01.capBursts, split: /^Kalian$/ },
  { id: "L2", who: "adik", text: "“Kalian siapa, Kak?”", bursts: VOX.D01.capBursts },
  { id: "L3", who: "n", text: VOX.N01.text, bursts: VOX.N01.capBursts, split: /[.,]$/ },
  { id: "L4", who: "n", text: VOX.N02.text, bursts: VOX.N02.capBursts },
  { id: "L5", who: "toa", text: VOX.P02.text, bursts: VOX.P02.capBursts },
  { id: "L7", who: "n", text: VOX.N04.text, bursts: VOX.N04.capBursts },
  { id: "L9", who: "n", text: VOX.N06.text, bursts: VOX.N06.capBursts, split: /,$/ },
];
// D-058/D-060 lesson (Ep 3 f132): a page gap shorter than 0.15 s flashes an empty caption band; bridge it (the earlier page
// stays until the next one starts). Found here: 15.08 → 15.16 s (N01) and 39.28 → 39.41 s (N04).
export const PAGES005 = (() => {
  const pages = captionPages(captionWords(LINES));
  pages.forEach((p, i) => { const n = pages[i + 1]; if (n && n.a - p.b > 0 && n.a - p.b < 0.15) p.b = n.a; });
  return pages;
})();

// ------------------------------------------------------------------ villagers (S06): standing outside the fence, facing
// house 7; on EV.turn every head turns to the living-room window at the same moment (owner/script: "serentak")
type Stand = { key: string; preset: NpcPreset; at: V3 };
const STAND: Stand[] = [
  { key: "v1", preset: BAPAK_B, at: [-1.35, 0, 4.85] },
  { key: "v2", preset: W3_B, at: [-0.45, 0, 5.2] },
  { key: "v3", preset: W4_B, at: [-2.0, 0, 5.9] },
  { key: "v4", preset: W5_B, at: [-0.95, 0, 6.3] },
  { key: "v5", preset: W6_B, at: [0.1, 0, 6.6] },
  { key: "v6", preset: ANAK_B, at: [-1.6, 0, 6.9] },
  { key: "v7", preset: W7_B, at: [-2.6, 0, 7.6] },
  { key: "v8", preset: W10_B, at: [-0.2, 0, 7.9] },
  { key: "v9", preset: W8_B, at: [-1.25, 0, 8.6] },
];
const WIN: V3 = [-0.7, 1.35, 3.0];
const HOUSE_FRONT: V3 = [-1.6, 1.2, 3.0];
const Villagers: React.FC<{ t: number }> = ({ t }) => (
  <>
    {STAND.map((s) => {
      const yaw = yawTo(s.at, HOUSE_FRONT);
      let d = yawTo(s.at, WIN) - yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      // the turn is small for those already facing the window: add a lift of the chin so every head moves together
      const lk = lookTurn(t, EV.turn as unknown as number, (d * 180) / Math.PI, 0.75, 0.2);
      const nod = -7 * sstep((t - (EV.turn as unknown as number)) / 0.75);
      return <Npc key={s.key} preset={s.preset} position={s.at} yaw={yaw} t={t} pose={{ ...(s.preset.pose ?? {}), headYaw: lk.headYaw, headNod: nod, twist: lk.twist }} face={{ mouth: "flat", eyes: "open" }} />;
    })}
  </>
);

// ------------------------------------------------------------------ one frame of S04–S15
const EpView: React.FC<{ t: number }> = ({ t }) => {
  const shot = shotOf(t);
  const st = stageAt(t, shot);
  const { chars, phone, glow } = charsAt(t);
  const drawn = !st.chars ? [] : chars;
  const occ = drawn.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  const bath = st.dark;
  // character light: bathroom 0.4 (look-dev v1), kitchen S12 0.5 (look-dev v1 bath-door; full strength drew a white disc on the wall behind Uq)
  const mood = st.ext ? NIGHT_EXT : bath ? charScaled(NIGHT_INT, 0.4) : shot === "S12" ? charScaled(NIGHT_INT, 0.25) : NIGHT_INT;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={st.ext ? NIGHT_EXT : NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={0.5} exposure={st.exposure} sky={st.ext}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={bath ? 0 : 0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} noFan bathDoor={st.bathDoor} tamuCurtainGap={st.gap} windowGlass={st.ext ? "clear" : "opaque"} wild={st.wild} />
        {st.ext ? <StreetSet t={t} tamuLit={0} house7="none" neighbourDoorsOpen={1} light="local" dense /> : null}
        {shot === "S06" ? <Villagers t={t} /> : null}
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={1} />)}
        <Pole p={POLE_REST} />
        <TapeLD c={TAPE_LENS.c} n={TAPE_LENS.n} />
        <JacketOnSofa />
        {drawn.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose as never} hands={c.hands as never} legPose={c.legPose as never} face={c.face as never} />
          ) : (
            <Npc key={i} preset={AD_PRESET} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...(c.pose as object) }} legPose={c.legPose as never} face={c.face as never} />
          ),
        )}
        {drawn.length ? <PhoneV3 p={phone.p} q={phone.q} /> : null}
        {drawn.length ? <PhoneScreen004 p={phone.p} q={phone.q} glow={glow} /> : null}
        {/* the bathroom: the only light is the phone screen in front of and below both faces (look-dev v1: 2.2 at full glow) */}
        {bath && drawn.length ? <pointLight position={[phone.p[0] + 0.14, phone.p[1] + 0.12, phone.p[2] - 0.12]} color="#cfe0ff" intensity={2.2 * glow} distance={1.6} decay={2} /> : null}
        {drawn.length ? <CharLight chars={drawn} cam={st.cam.pos} mood={mood} /> : null}
        {shot === "S06" ? <CastLight at={[-1.0, 1.3, 6.2]} cam={st.cam.pos} mood={NIGHT_EXT} /> : null}
      </View>
      {bath ? null : LEDS.map((k) => <Halo key={k} c={st.cam} p={ledWorld(k)} on={1} d={HALO_BY_LED[k]} occ={occ} />)}
      {st.dim ? <AbsoluteFill style={{ background: `rgba(5,5,10,${st.dim})` }} /> : null}
      {shot === "S09" ? <PhoneUI005 t={t} shot="S09" span={[SH.S09[0], SH.S09[1]]} msgAt={(PLAN.vo as unknown as Record<string, { at: number }>).N03.at} /> : null}
      {shot === "S14" ? <PhoneUI005 t={t} shot="S14" span={[SH.S14[0], SH.S14[1]]} msgAt={(PLAN.vo as unknown as Record<string, { at: number }>).N05.at} vib={EV.vib2 as unknown as number} /> : null}
      {shot === "S04" ? <CardsAB t={t} items={PLAN.recapChoices} inAt={EV.recap.in} click={{ index: 1, at: EV.recap.click }} outAt={EV.recap.out} outDur={EV.recap.fade} /> : null}
      {shot === "S15" ? <CardsAB t={t} items={PLAN.finalChoices} inAt={EV.finalCards as unknown as number} /> : null}
    </AbsoluteFill>
  );
};

export const Episode005: React.FC<{ hud?: boolean }> = ({ hud = false }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const t = f / 30;
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {t < OPEN_END - 1e-9 ? <Pilot005v3 captions={false} /> : <EpView t={t} />}
      <DayLabel4 t={t} />
      <Captions005 t={t} pages={PAGES005} />
      {hud ? (
        <div style={{ position: "absolute", left: 24, top: 24, fontFamily: "Poppins", fontSize: 26, fontWeight: 600, color: "#ffe9a0", textShadow: "0 2px 0 #000" }}>
          {t < OPEN_END ? "OPEN" : shotOf(t)} · {t.toFixed(2)} s · f{f}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
