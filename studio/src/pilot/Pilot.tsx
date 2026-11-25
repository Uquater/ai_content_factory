// Pilot 2026-11-001 "Angka di Atas Kepala Sahabatmu" — ROUGH CUT of the whole story (script v1.1, 10 scenes).
// Text, provisional timing, shots and story beats live in pilot-plan.json; this file stages them. Every frame is a pure
// function of the frame number. Reused as is: C1 (approved, D-021), the warung set, the reach rig (src/c1/reach.ts).
// New: Tyo (C2, DESIGN PROPOSAL), the number above his head, the office box and ID card, the A/B choices.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { makeChunks } from "../inkbeat/core/captions";
import type { Chunk, Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { handWorld, solveArm } from "../inkbeat/core/ik";
import { moodOf } from "../inkbeat/core/moods";
import type { MoodPreset } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { blendLook } from "../inkbeat/lookdev/presets";
import { layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import { C1, C1_BUILD, c1Head, c1SeatedRoot, stickHeadCenter, stickHeadTop } from "../c1/C1";
import type { C1Face } from "../c1/C1";
import { reachAt } from "../c1/reach";
import type { ReachScene } from "../c1/reach";
import { Coffee, SEAT_Y, TABLE_Y, Warung } from "../c1/Warung";
import { ChoiceCards, PilotCaptions, RoughTag, Spotlight, toScreen } from "./overlay";
import PLAN from "./pilot-plan.json";
import { FloatingNumbers, HeadNumber, OfficeBox } from "./props";
import { cardPose, TYO_HEIGHT, TYO_LOOK, TyoChest } from "./Tyo";

export const PILOT_FPS = 30;
export const PILOT_FRAMES = Math.ceil(PLAN.end * PILOT_FPS);
const B = PLAN.beats;
const D2R = Math.PI / 180;

// ------------------------------------------------------------------ staging
export const TYO_X = -0.62;
const C1_SEAT = c1SeatedRoot([0, SEAT_Y, -0.18]);
const TYO_SEAT = c1SeatedRoot([TYO_X, SEAT_Y, -0.18], TYO_HEIGHT);
/** Tyo sits turned a little toward C1 */
const TYO_YAW = 18 * D2R;
const C1_CHIN = c1Head(C1_SEAT); // the demo cameras were framed on this point
const C1_HC = stickHeadCenter(C1_SEAT);
const TYO_HC = stickHeadCenter(TYO_SEAT, TYO_HEIGHT, TYO_LOOK);
const TYO_TOP = stickHeadTop(TYO_SEAT, TYO_HEIGHT, TYO_LOOK);
const NUMBER_AT: V3 = [TYO_TOP[0] + 0.02, TYO_TOP[1] + 0.12, TYO_TOP[2]];
const MID: V3 = [(C1_HC[0] + TYO_HC[0]) / 2, (C1_HC[1] + TYO_HC[1]) / 2 - 0.08, -0.18];
const BOX_AT: V3 = [TYO_X - 0.26, 0, -0.14]; // half under the chair, sticking out past the table end
const REST: [number, number] = [10, 50];
const SCENE: ReachScene = { root: C1_SEAT, tableY: TABLE_Y, cupY: TABLE_Y + 0.004, cupZ: B.reach.cupZ, table: { x0: -0.75, x1: 0.75, z0: -0.03, z1: 0.59 } };

/** Tyo's torso-local point (h = 1, y from the torso bottom; C1Props.chest frame) -> world */
const L0 = layoutOf(C1_BUILD);
const tyoLocalToWorld = (p: THREE.Vector3): V3 => {
  const v = new THREE.Vector3(p.x, p.y + L0.torsoY0, p.z).multiplyScalar(TYO_HEIGHT).applyAxisAngle(new THREE.Vector3(0, 1, 0), TYO_YAW);
  return [TYO_SEAT[0] + v.x, TYO_SEAT[1] + v.y, TYO_SEAT[2] + v.z];
};
const POCKET_W = tyoLocalToWorld(cardPose(1).p);

// ------------------------------------------------------------------ time helpers
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({ pos: lerp3(a.pos, b.pos, u), look: lerp3(a.look, b.look, u), fov: lerp(a.fov, b.fov, u), roll: 0 });
/** 0 before a, ramps to 1 by b */
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
/** up over [a, b], down over [c, d] */
const hold = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d));

// ------------------------------------------------------------------ words and captions (provisional timing)
type Line = { id: string; text: string; start: number; end: number; quote?: boolean };
const LINES = PLAN.lines as Line[];
const WORDS: (Word & { q?: boolean })[] = [];
const QUOTE: boolean[] = [];
for (const l of LINES) {
  const ws = l.text.split(" ");
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  let inQ = false;
  for (const w of ws) {
    const a = l.start + ((l.end - l.start) * acc) / total;
    acc += w.length + 1;
    if (l.quote && w.startsWith('"')) inQ = true;
    WORDS.push([w, a, l.start + ((l.end - l.start) * acc) / total]);
    QUOTE.push(inQ);
    if (w.endsWith('"') || w.endsWith('."')) inQ = false;
  }
}
const LAST_END = LINES[LINES.length - 1].end;
const CHUNKS: (Chunk & { quote: boolean[] })[] = (() => {
  const cs = makeChunks(WORDS as Word[], LAST_END + 0.35);
  let k = 0;
  return cs.map((c) => {
    const q = c.words.map(() => QUOTE[k++]);
    return { ...c, quote: q };
  });
})();

// ------------------------------------------------------------------ cameras per shot (start -> end, eased)
const shotCam = (id: string, u: number, t: number): Cam => {
  const e = ease(u);
  switch (id) {
    case "S1": {
      // the demo's establishing push-in, onto C1 alone (Tyo's chair still empty)
      const a = aim([1.7, 1.6, 3.7], [0, 0.95, -0.6], 50, 0.42);
      const b = aim([1.05, 1.32, 2.6], [0, 0.98, -0.3], 44, 0.42);
      const c = aim([0.55, 1.12, 1.85], C1_CHIN, 38, 0.36);
      return u < 0.36 ? camLerp(a, b, ease(u / 0.36) * 0.6) : camLerp(camLerp(a, b, 0.6), c, ease((u - 0.36) / 0.5));
    }
    case "S2":
      // from the front-left: Tyo, the card in his hand, the box beside and under his chair; C1 at the right edge
      return camLerp(aim([-0.82, 1.0, 1.95], [TYO_X - 0.1, 0.66, -0.18], 52, 0.38), aim([-0.8, 1.0, 1.8], [TYO_X - 0.1, 0.68, -0.18], 50, 0.38), e);
    case "S3":
      return camLerp(aim([-0.26, 1.3, 2.3], MID, 50, 0.52), aim([-0.27, 1.3, 2.15], MID, 49, 0.52), e);
    case "S4":
      return camLerp(aim([-0.44, 1.25, 1.0], TYO_HC, 38, 0.62), aim([-0.45, 1.25, 0.92], TYO_HC, 36, 0.62), e);
    case "S5":
      return camLerp(aim([-0.26, 1.32, 2.35], MID, 50, 0.58), aim([-0.27, 1.32, 2.2], MID, 49, 0.58), e);
    case "S6":
      return camLerp(aim([-0.27, 1.32, 2.2], MID, 49, 0.58), aim([-0.45, 1.25, 1.45], TYO_HC, 44, 0.64), ease(u * 0.9));
    case "S7": {
      // L7: down to the box under his chair, then the pocket with the card
      const k = (t - 23.5) / (26.25 - 23.5);
      if (t < 26.25) return camLerp(aim([-0.72, 0.85, 1.4], [TYO_X - 0.1, 0.45, -0.16], 40, 0.5), aim([-0.8, 0.4, 1.15], [BOX_AT[0], 0.14, BOX_AT[2]], 38, 0.5), ease(k * 1.2));
      return camLerp(aim([-0.44, 1.0, 0.8], POCKET_W, 30, 0.55), aim([-0.45, 1.0, 0.72], POCKET_W, 27, 0.55), ease((t - 26.25) / 2.55));
    }
    case "S8":
      return camLerp(aim([-0.42, 1.24, 0.98], TYO_HC, 37, 0.6), aim([-0.43, 1.24, 0.9], TYO_HC, 35, 0.6), e);
    case "S9":
      return camLerp(aim([-0.3, 1.24, 1.55], MID, 46, 0.52), aim([-0.25, 1.3, 2.3], MID, 50, 0.52), e);
    default:
      // S10: the whole table, the glass travelling from C1 to Tyo; a slow push, then a hold
      // the glass and the hands sit above the caption band (70% of the height)
      return camLerp(aim([-0.18, 1.36, 2.75], [-0.3, 0.95, -0.05], 41, 0.42), aim([-0.2, 1.34, 2.5], [-0.3, 0.96, -0.05], 40, 0.42), ease(u * 1.25));
  }
};

// ------------------------------------------------------------------ the mood: golden; a cold, blue-purple turn on L8
const GOLDEN = moodOf("golden");
const COLD = moodOf("night");
const moodAt = (t: number): MoodPreset => {
  const k = ramp(t, B.cold.in[0], B.cold.in[1]) * (1 - 0.45 * ramp(t, B.cold.partial[0], B.cold.partial[1])) * (1 - ramp(t, B.cold.out[0], B.cold.out[1]));
  return k <= 0.001 ? GOLDEN : (blendLook(GOLDEN, COLD, 0.62 * k) as MoodPreset);
};

// ------------------------------------------------------------------ Tyo's performance
const tyoAt = (t: number) => {
  // the card: held in front of the chest (S2), tucked into the pocket (S3), then the hand drops to the lap
  const tk = B.tuck;
  const tuck = ramp(t, tk.slide, tk.inPocket);
  const card = cardPose(tuck);
  const target = tyoLocalToWorld(card.p.clone().addScaledVector(card.n, 0.012));
  const ik = solveArm({ position: TYO_SEAT, yaw: TYO_YAW, side: "R", target, height: TYO_HEIGHT, build: C1_BUILD });
  const down = ramp(t, tk.inPocket + 0.15, tk.handDown);
  const armR: [number, number] = [lerp(ik.arm[0], REST[0], down), lerp(ik.arm[1], REST[1], down)];
  const armRFwd = lerp(ik.fwd, 75, down);
  // the face
  let face: C1Face = { mouth: "smile", brows: "neutral" };
  let headNod = 0;
  let headYaw = 12; // toward C1
  let lookY = 0;
  let look = 0.3;
  if (t >= 9.0 && t < 14.5) {
    face = { mouth: "forced", brows: "neutral" };
    const atCard = hold(t, 9.35, 9.6, 10.45, 10.75);
    lookY = atCard * 1.2 + 0.3 * ramp(t, 12.6, 13.2);
    headNod = atCard * 14;
    look = 0.3 * (1 - atCard);
    if (t > 13.4) face = { mouth: "forced", brows: "worried" };
  } else if (t >= 14.5 && t < 28.8) {
    face = { mouth: t < 17 ? "forced" : "flat", brows: "worried" };
    const g = hold(t, B.glanceDown[0], B.glanceDown[0] + 0.25, B.glanceDown[1] - 0.25, B.glanceDown[1]);
    lookY = 0.5 + 0.9 * g;
    headNod = 6 + 18 * g;
    look = 0.1 - 0.7 * g;
    headYaw = 6 - 16 * g;
  } else if (t >= 28.8 && t < 36.5) {
    const f = ramp(t, B.smileFade[0], B.smileFade[1]);
    face = { mouth: f < 0.35 ? "forced" : f < 0.75 ? "flat" : "frown", brows: "worried" };
    const d = ramp(t, B.tyoHeadDown[0], B.tyoHeadDown[1]);
    lookY = 0.7 + 0.5 * d;
    headNod = 4 + 18 * d;
    headYaw = 4;
    look = 0;
  } else if (t >= 36.5) {
    const cup = hold(t, B.tyoLookCup[0], B.tyoLookCup[0] + 0.3, B.tyoLookCup[1], B.tyoLookCup[1] + 0.4);
    const up = ramp(t, B.tyoLookCup[1], B.tyoLookCup[1] + 0.5);
    face = { mouth: t >= B.tyoSmile ? "soft" : "flat", brows: t >= B.tyoSmile - 0.2 ? "neutral" : "worried" };
    lookY = 0.9 * cup + 0.6 * (1 - up) * (1 - cup);
    headNod = 14 * cup + 10 * (1 - up) * (1 - cup);
    headYaw = 4 + 14 * up;
    look = 0.2 + 0.4 * up;
  }
  return { tuck, armR, armRFwd, face: { ...face, look, lookY }, headNod, headYaw };
};

// ------------------------------------------------------------------ C1's performance (body follows reach.ts in S10)
const c1At = (t: number, cam: Cam) => {
  const st = reachAt(t, B.reach, SCENE);
  const g = st.head;
  const lk = B.c1Lean;
  const lean = hold(t, lk[0], lk[1], lk[2], lk[3]);
  // after S1, C1 keeps its face on Tyo; S1 keeps the demo's 3/4 toward the lens
  const toTyo = ramp(t, 4.8, 5.2);
  const headYaw = -toTyo * (24 + 8 * lean) * (1 - g) - g * (12 + 8 * st.slide) - st.body.twist;
  const worried = t >= 14.5 && t < 36.8;
  const face: C1Face = { mouth: t >= 39.3 ? "soft" : worried || t >= 4.8 ? "flat" : "smile", brows: worried ? "worried" : "neutral", look: -st.eyes * (0.6 + 0.4 * st.slide) - toTyo * 0.5 * (1 - st.eyes), lookY: st.eyes * 1.7 + (t >= 31.3 && t < 36.5 ? 0.4 : 0) };
  return {
    st,
    face,
    faceCamera: t < 4.8 ? cam.pos : undefined,
    pose: {
      armL: st.armL,
      armLFwd: st.armLFwd,
      swivelL: st.swivelL,
      shrugL: st.body.shrug,
      lean: st.body.lean + 3 * lean,
      roll: st.body.roll + 4 * lean,
      twist: st.body.twist - 5 * lean,
      armR: REST,
      armRFwd: 75,
      headYaw: t < 4.8 ? 0 : headYaw,
      headNod: g * 22 - st.body.lean * 0.6 + 6 * lean,
      headTilt: 3 * g + 4 * lean,
    },
  };
};

// ------------------------------------------------------------------ the composition
export const Pilot: React.FC = () => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const t = f / PILOT_FPS;
  const shot = PLAN.shots.find((s) => t >= s.start && t < s.end) ?? PLAN.shots[PLAN.shots.length - 1];
  const u = (t - shot.start) / (shot.end - shot.start);
  const cam = shotCam(shot.id, u, t);
  const m = moodAt(t);
  const c1 = c1At(t, cam);
  const ty = tyoAt(t);
  const tyoIn = t >= 4.8;
  const focusOn: V3 = shot.id === "S1" ? C1_CHIN : shot.id === "S7" ? (t < 26.25 ? [BOX_AT[0], 0.15, BOX_AT[2]] : POCKET_W) : shot.id === "S10" ? c1.st.cup : shot.id === "S5" || shot.id === "S3" || shot.id === "S9" ? MID : TYO_HC;
  const keyHead = shot.id === "S1" ? C1_HC : TYO_HC;
  // spotlights on the clues in S7
  const spBox = hold(t, B.spotBox[0], B.spotBox[0] + 0.4, B.spotBox[1] - 0.3, B.spotBox[1]);
  const spPocket = hold(t, B.spotPocket[0], B.spotPocket[0] + 0.4, B.spotPocket[1] - 0.3, B.spotPocket[1]);
  const spAt = spBox > 0 ? toScreen(cam, [BOX_AT[0], 0.16, BOX_AT[2]]) : toScreen(cam, POCKET_W);

  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={focusOn} blur={shot.id === "S1" ? 0.8 : shot.id === "S10" ? 1.0 : 1.4} sky={false}>
        <Warung t={t} tyoChairX={TYO_X} spareCoffee={false} />
        <Coffee p={c1.st.cup} t={t} />
        <OfficeBox p={BOX_AT} yaw={0.12} />
        <C1 position={C1_SEAT} yaw={0} sitFloor={0} t={t} face={c1.face} faceCamera={c1.faceCamera} faceCameraAmount={0} threeQuarter={22} pose={c1.pose} hands={{ L: c1.st.hand }} />
        {tyoIn ? (
          <C1
            look={TYO_LOOK}
            height={TYO_HEIGHT}
            position={TYO_SEAT}
            yaw={TYO_YAW}
            sitFloor={0}
            t={t}
            blinkSeed={11}
            face={ty.face}
            pose={{ armL: REST, armLFwd: 75, armR: ty.armR, armRFwd: ty.armRFwd, headNod: ty.headNod, headYaw: ty.headYaw }}
            chest={<TyoChest tuck={ty.tuck} />}
          />
        ) : null}
        {tyoIn ? <HeadNumber at={NUMBER_AT} cam={cam.pos} t={t} inAt={B.numberIn} popAt={B.numberPop} size={shot.id === "S4" || shot.id === "S8" ? 0.12 : 0.15} /> : null}
        <FloatingNumbers cam={cam.pos} t={t} from={B.floatingNumbers[0]} to={B.floatingNumbers[1]} />
        <CastLight at={keyHead} cam={cam.pos} mood={m} />
      </View>
      <Spotlight x={spAt.x} y={spAt.y} r={spBox > 0 ? 210 : 170} amount={Math.max(spBox, spPocket)} />
      <ChoiceCards t={t} inAt={B.choices.in} outAt={B.choices.out} timer={B.choices.timer as [number, number]} />
      <ChoiceCards t={t} inAt={B.choices.smallIn} outAt={PLAN.end + 1} small />
      <PilotCaptions chunks={CHUNKS} t={t} until={LAST_END + 0.35} />
      <RoughTag text={PLAN.label} />
    </AbsoluteFill>
  );
};

/** a still for the owner: the Tyo design proposal next to C1 in the pilot's two-shot light */
export const TyoProposal: React.FC<{ close?: boolean }> = ({ close }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const t = 16.0;
  const cam = close ? aim([-0.45, 1.05, 0.75], [TYO_X, 0.95, -0.18], 30, 0.5) : aim([-0.25, 1.3, 2.35], [MID[0], 0.82, MID[2]], 40, 0.42);
  const m = GOLDEN;
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={MID} blur={1.0} sky={false}>
        <Warung t={t} tyoChairX={TYO_X} spareCoffee={false} />
        <Coffee p={[-0.22, TABLE_Y + 0.004, B.reach.cupZ]} t={t} />
        <OfficeBox p={BOX_AT} yaw={0.12} />
        <C1 position={C1_SEAT} yaw={0} sitFloor={0} t={t} face={{ mouth: "smile", look: -0.5 }} pose={{ armL: REST, armLFwd: 75, armR: REST, armRFwd: 75, headYaw: -22 }} />
        <C1
          look={TYO_LOOK}
          height={TYO_HEIGHT}
          position={TYO_SEAT}
          yaw={TYO_YAW}
          sitFloor={0}
          t={t}
          blinkSeed={11}
          face={{ mouth: "smile", look: 0.3 }}
          pose={{ armL: REST, armLFwd: 75, armR: REST, armRFwd: 75, headYaw: 10 }}
          chest={<TyoChest tuck={1} />}
        />
        <CastLight at={TYO_HC} cam={cam.pos} mood={m} />
      </View>
      <RoughTag text="USULAN DESAIN C2 TYO - belum disetujui" />
    </AbsoluteFill>
  );
};

/** checks for tools: the hand target the card IK uses must be reachable (err in m) */
export const tyoCardReach = (t: number) => {
  const tuck = ramp(t, B.tuck.slide, B.tuck.inPocket);
  const card = cardPose(tuck);
  const target = tyoLocalToWorld(card.p.clone().addScaledVector(card.n, 0.012));
  const ik = solveArm({ position: TYO_SEAT, yaw: TYO_YAW, side: "R", target, height: TYO_HEIGHT, build: C1_BUILD });
  const hw = handWorld({ position: TYO_SEAT, yaw: TYO_YAW, pose: { armR: ik.arm, armRFwd: ik.fwd }, side: "R", height: TYO_HEIGHT, build: C1_BUILD });
  return { err: ik.err, hw };
};
