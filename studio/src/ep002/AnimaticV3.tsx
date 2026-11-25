// Episode 2026-11-002 — ANIMATIC v3, A01–A17 (D-033, 2026-11-17). The approach of the reviewed pilot A02–A04 v3 applied
// to the whole story (owner priorities D-032: 1 consistent character shape, 2 natural motion, 3 story clarity):
//   - every character in the approved bodied design (D-031; castV3.ts); thin ink; character rim at full strength;
//   - cameras keep >= ~2.2 m from the characters (shape distortion comes from distance, not from the lens), using wild
//     walls where a room traps the camera; inserts (hands, phone, switch) are the only close cameras;
//   - real weight in the key moves: A02–A04 from PilotV3 (v3b: smooth hand-to-lap), A08 pull from v3a08.ts (walk in,
//     grab by IK, resistance, release, step back), A09 settle step, A15 grip with both palms on one meeting point;
//   - C1 never mouths the narrator or the toa; adik's mouth moves only on her lines (L10, L24);
//   - local light (pooled lamp, moon cones, street-lamp pools), set dressing as in look-dev v2.
// Animatic.tsx (v2) is unchanged and still renders the rejected v2. Every frame is a pure function of the frame number.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { C1, C1_BUILD, C1_HEIGHT } from "../c1/C1";
import type { C1Props } from "../c1/C1";
import { Npc } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";
import { Walker } from "../cast/Walker";
import type { Gait, WalkPlan } from "../cast/walk";
import { lookTurn, walkState } from "../cast/walk";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { solveArm } from "../inkbeat/core/ik";
import { boxG, coreMat, M } from "../inkbeat/core/kit";
import type { MoodPreset } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B, ANAK_B, BAPAK_B, CARRY_B, W10_B, W3_B, W4_B, W5_B, W6_B, W7_B, W8_B, W9_B } from "./castV3";
import { KAMAR, TAMU } from "./geo";
import { C1_BODIED, INK_NIGHT, INK_WARM, thin } from "./LookDev";
import { CaptionsHL, Cards, DayLabel, PhoneUI } from "./overlay";
import { BedC1, camAt as camV3 } from "./PilotV3";
import PLAN from "./plan-2026-11-002.json";
import { HouseInterior, plateWorld, StreetSet, toaHornWorld } from "./sets";
import { a08At, ADIK_DOOR, HANDLE } from "./v3a08";

export const AV3_FPS = 30;
export const AV3_FRAMES = PLAN.frames;
const E = Math.PI / 2;
const S_ = 0;
const N_ = Math.PI;

// ------------------------------------------------------------------ helpers
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const cam = (pos: V3, look: V3, fov = 40): Cam => ({ pos, look, fov, roll: 0 });
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({ pos: lerp3(a.pos, b.pos, u), look: lerp3(a.look, b.look, u), fov: lerp(a.fov, b.fov, u), roll: 0 });
const L = (id: string) => PLAN.lines.find((l) => l.id === id)!;
const reach = (root: V3, yaw: number, side: "L" | "R", target: V3, height = C1_HEIGHT) => {
  const ik = solveArm({ position: root, yaw, side, target, height, build: C1_BUILD });
  return side === "L" ? { armL: ik.arm, armLFwd: ik.fwd } : { armR: ik.arm, armRFwd: ik.fwd };
};
/** C1 in the approved bodied design */
const U: React.FC<Omit<C1Props, "look">> = (p) => <C1 look={C1_BODIED} {...p} />;

// ------------------------------------------------------------------ moods (local light; character rim at 1.0)
const NIGHT_EXT = thin("night", INK_NIGHT, 0.12, 0.2, 0.3, 1.0);
/** the character fill (cast light, from the camera side) back to a fraction of the mood's value: thin() scales it with
 * the ambient, which left faces dark when the practical (lamp / window) is behind the characters (A09, A11a, A13a, A15) */
const faceFill = (m: MoodPreset, k: number): MoodPreset => ({ ...m, castLight: { ...m.castLight, fill: { ...m.castLight.fill, intensity: m.castLight.fill.intensity * k } } });
/** A02–A04 keep the reviewed pilot v3 light */
const NIGHT_BED = thin("night", INK_NIGHT, 0.05, 0, 0.12, 1.0);
const NIGHT_INT = faceFill(thin("night", INK_NIGHT, 0.05, 0, 0.12, 1.0), 9);
const LAMP = faceFill(thin("lamp", INK_WARM, 0.06, 0, 0.15, 1.0), 7);

// ------------------------------------------------------------------ the phone (A07)
const Phone: React.FC<{ p: V3; q?: THREE.Euler; glow: number }> = ({ p, q, glow }) => (
  <group position={p} rotation={q}>
    <M g={boxG(0.075, 0.155, 0.009)} c="#1c1b22" />
    <mesh position={[0, 0, 0.0052]} geometry={boxG(0.066, 0.142, 0.001)} material={coreMat("#cfe0ff", 0.3 + 1.1 * glow)} />
    {glow > 0 ? <pointLight position={[0, 0, 0.12]} intensity={0.9 * glow} distance={0.9} decay={2} color="#cfe0ff" /> : null}
  </group>
);

// ------------------------------------------------------------------ villagers (bodied looks; walk plans as in v2)
type W = { key: string; preset?: NpcPreset; carry?: boolean; gait: Gait; plan: WalkPlan; look?: number; lookDeg?: number };
const G = (p: NpcPreset, stride: number, phase: number, extra: Partial<Gait> = {}): Gait => ({ height: p.height, stride, phase, ...extra });
const WARGA_A05: W[] = [
  { key: "w1", preset: BAPAK_B, gait: G(BAPAK_B, 1.1, 0.2), plan: { t0: 16.6, from: [-1.2, 0, 8.6], yaw: E, speed: 0.8 } },
  { key: "w2", carry: true, gait: G(CARRY_B.mom, 0.92, 0.63, { bob: 0.005, swing: 10 }), plan: { t0: 17.4, from: [0.4, 0, 8.9], yaw: E, speed: 0.62 } },
  { key: "w6", preset: ANAK_B, gait: G(ANAK_B, 0.78, 0.44, { lift: 0.04, swing: 18 }), plan: { t0: 17.8, from: [-0.5, 0, 9.4], yaw: E, speed: 0.66 } },
  { key: "w3", preset: W3_B, gait: G(W3_B, 1.08, 0.9), plan: { t0: 16.2, from: [-2.8, 0, 6.6], yaw: E, speed: 0.85 } },
  { key: "w4", preset: W4_B, gait: G(W4_B, 0.95, 0.35), plan: { t0: 16.9, from: [3.4, 0, 6.9], yaw: E, speed: 0.72 } },
  { key: "w5", preset: W5_B, gait: G(W5_B, 1.0, 0.71), plan: { t0: 16.0, from: [-4.6, 0, 7.4], yaw: E, speed: 0.78 } },
];
const L29 = L("L29");
const WARGA_A14: W[] = [
  { key: "w1", preset: BAPAK_B, gait: G(BAPAK_B, 1.1, 0.2), plan: { t0: 62.0, from: [-12.0, 0, 7.2], yaw: E, speed: 0.78, tStop: 76.2, decel: 1.6 }, look: L29.start + 0.0, lookDeg: 72 },
  { key: "w2", carry: true, gait: G(CARRY_B.mom, 0.92, 0.63, { bob: 0.005, swing: 10 }), plan: { t0: 62.0, from: [-9.4, 0, 8.3], yaw: E, speed: 0.6, tStop: 76.8, decel: 1.8 }, look: L29.start + 0.4, lookDeg: 70 },
  { key: "w6", preset: ANAK_B, gait: G(ANAK_B, 0.78, 0.44, { lift: 0.04, swing: 18 }), plan: { t0: 62.0, from: [-9.9, 0, 9.1], yaw: E, speed: 0.62, tStop: 77.0, decel: 1.4 }, look: L29.start + 0.8, lookDeg: 66 },
  { key: "w3", preset: W3_B, gait: G(W3_B, 1.08, 0.9), plan: { t0: 62.0, from: [-11.0, 0, 6.3], yaw: E, speed: 0.82, tStop: 75.6, decel: 1.5 }, look: L29.start + 1.2, lookDeg: 75 },
  { key: "w4", preset: W4_B, gait: G(W4_B, 0.95, 0.35), plan: { t0: 62.0, from: [-13.8, 0, 7.9], yaw: E, speed: 0.86, tStop: 76.5, decel: 1.6 }, look: L29.start + 1.6, lookDeg: 70 },
  { key: "w5", preset: W5_B, gait: G(W5_B, 1.0, 0.71), plan: { t0: 62.0, from: [-12.6, 0, 9.4], yaw: E, speed: 0.74, tStop: 77.3, decel: 1.7 }, look: L29.start + 2.0, lookDeg: 68 },
];
// ---- v4 (2026-11-17): more villagers; each with its own look, stride phase, distance and reaction time. The A05
// walkers come from further west (behind W1/W2 in the bedroom POV, never between them and the camera); the A14 extras
// stop to the sides or further back, so the six original villagers stay readable in the curtain POV.
// lanes: the original A05/A14 villagers walk at z 6.3–9.4; the extras use the far side of the road and the far
// pavement (z 9.35–10.25), so in the window POVs they pass BEHIND the tracked villagers, never between them and the lens
const EXTRA_A05: W[] = [
  { key: "e1", preset: W6_B, gait: G(W6_B, 1.05, 0.15), plan: { t0: 16.3, from: [-3.5, 0, 9.85], yaw: E, speed: 0.82 } },
  { key: "e2", preset: W7_B, gait: G(W7_B, 0.95, 0.55), plan: { t0: 16.8, from: [-11.0, 0, 6.0], yaw: E, speed: 0.7 } },
  { key: "e3", preset: W8_B, gait: G(W8_B, 1.12, 0.3), plan: { t0: 17.1, from: [-5.2, 0, 9.35], yaw: E, speed: 0.86 } },
  { key: "e4", preset: W9_B, gait: G(W9_B, 0.8, 0.7, { lift: 0.04, swing: 18 }), plan: { t0: 17.25, from: [-5.9, 0, 9.8], yaw: E, speed: 0.84 } },
  { key: "e5", preset: W10_B, gait: G(W10_B, 1.0, 0.05), plan: { t0: 16.0, from: [-8.6, 0, 10.5], yaw: E, speed: 0.8 } }, // on the far pavement (the kerb top is at z 10.0–10.2)
];
/** stop inside the curtain POV of A14 but behind the six originals (left and right of their group) */
const EXTRA_A14: W[] = [
  { key: "x1", preset: W6_B, gait: G(W6_B, 1.05, 0.15), plan: { t0: 62.0, from: [-12.6, 0, 9.85], yaw: E, speed: 0.94, tStop: 76.9, decel: 1.7 }, look: L29.start + 2.3, lookDeg: 74 },
  { key: "x3", preset: W10_B, gait: G(W10_B, 1.0, 0.05), plan: { t0: 62.0, from: [-14.0, 0, 9.9], yaw: E, speed: 0.8, tStop: 76.6, decel: 1.6 }, look: L29.start + 2.7, lookDeg: 78 },
];
/** two neighbours already standing at their gates across the street, looking east toward the toa; they turn to
 * house 7 last (head first, then the torso) */
type Stander = { key: string; preset: NpcPreset; at: V3; yaw: number; look: number; deg: number };
const STANDERS_A14: Stander[] = [
  { key: "s1", preset: W7_B, at: [0.25, 0, 10.35], yaw: Math.PI - 0.9, look: L29.start + 2.9, deg: -62 },
  { key: "s2", preset: W8_B, at: [-2.6, 0, 10.4], yaw: Math.PI - 1.0, look: L29.start + 3.3, deg: -66 },
];
const Standers: React.FC<{ list: Stander[]; t: number }> = ({ list, t }) => (
  <>
    {list.map((s) => {
      const lk = lookTurn(t, s.look, s.deg, 0.8, 0.35);
      return <Npc key={s.key} preset={s.preset} position={s.at} yaw={s.yaw} t={t} pose={{ ...(s.preset.pose ?? {}), headYaw: lk.headYaw, twist: lk.twist }} face={{ mouth: "flat", eyes: "open" }} />;
    })}
  </>
);
let ENV: "v3" | "v4" | "v5" | "final" = "v3";
const crowdA05 = () => (ENV !== "v3" ? [...WARGA_A05, ...EXTRA_A05] : WARGA_A05);
/** A05 (v4): a neighbour who has just stepped out onto the porch across the street (door x 0.2), looking toward the toa;
 * seen through the bedroom window in A05a */
const PORCH_A05: Stander[] = [{ key: "p1", preset: W4_B, at: [0.2, 0, 11.45], yaw: Math.PI - 0.6, look: 17.4, deg: -25 }];
const crowdA14 = () => (ENV !== "v3" ? [...WARGA_A14, ...EXTRA_A14] : WARGA_A14);
const Crowd14: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Warga list={crowdA14()} t={t} />
    {ENV !== "v3" ? <Standers list={STANDERS_A14} t={t} /> : null}
  </>
);

const Warga: React.FC<{ list: W[]; t: number }> = ({ list, t }) => (
  <>
    {list.map((w) => (
      <Walker key={w.key} preset={w.preset} carry={w.carry} carryPresets={CARRY_B} gait={w.gait} plan={w.plan} t={t} look={w.look !== undefined ? { t0: w.look, deg: w.lookDeg ?? 70, dur: 0.75 } : undefined} face={{ mouth: "flat", eyes: "open" }} />
    ))}
  </>
);

// ------------------------------------------------------------------ the living room after the pull (A08 end = A09+)
const A08_END = a08At(PLAN.shots.find((s) => s.id === "a08")!.end);
/** C1 and adik stay where the pull left them (no jump at the A08→A09 cut) */
const C1_ROOM: V3 = A08_END.c1.position.map((v, i) => (i === 1 ? 0 : v)) as V3;
const ADIK_PULLED: V3 = A08_END.adik.position.map((v, i) => (i === 1 ? 0 : v)) as V3;
/** the front window, seen from the room: what they look at in A09 / A13 */
const WIN: V3 = [TAMU.window.x, 1.3, 3.0];
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const C1_YAW_END = A08_END.c1.yaw;
const ADIK_YAW_END = A08_END.adik.yaw;
/** A09: adik's one small step closer to C1 (a real step, not a slide) during the silence before L19 */
const ADIK_STEP: WalkPlan = { t0: L("L18").end + 0.5, from: ADIK_PULLED, yaw: yawTo(ADIK_PULLED, C1_ROOM), speed: 0.45, tStop: L("L18").end + 1.3, decel: 0.5 };
// phase 0.3: the snapped stop is a ~0.14 m step, so the bodies stay ~0.5 m apart (no contact)
const ADIK_GAIT: Gait = { height: ADIK_B.height, stride: 0.55, phase: 0.3, swing: 6, lift: 0.025 };
const ADIK_ROOM: V3 = (() => {
  const p = walkState(ADIK_GAIT, ADIK_STEP, ADIK_STEP.tStop! + 1).position;
  return [p[0], 0, p[2]];
})();
/** both turn toward the front window during A09 (head first, torso after: lookTurn), bodies keep their feet */
const winTurn = (t: number, t0: number, from: number, at: V3, who: V3) => {
  const target = yawTo(who, at);
  let d = target - from;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  return lookTurn(t, t0, (d * 180) / Math.PI, 0.8, 0.4);
};

// ------------------------------------------------------------------ the pair hand in hand (A15–A17)
const MEET = (): V3 => [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 0.76, (C1_ROOM[2] + ADIK_ROOM[2]) / 2 + 0.1];
/** both face the window; C1's right hand ("L") and adik's left hand ("R") hold each other: each palm sits 1.8 cm off
 * the shared meeting point toward its owner (bodied hands touch instead of overlapping) */
const FACE_WIN_C1 = yawTo(C1_ROOM, WIN);
const FACE_WIN_ADIK = yawTo(ADIK_ROOM, WIN);
const Pair: React.FC<{ t: number; grip: number; c1Head?: number; c1Yaw?: number }> = ({ t, grip, c1Head = 0, c1Yaw = FACE_WIN_C1 }) => {
  const m = MEET();
  const toC1 = new THREE.Vector3(C1_ROOM[0] - m[0], 0, C1_ROOM[2] - m[2]).normalize();
  const c1Palm: V3 = [m[0] + toC1.x * 0.018, m[1] + 0.01 * grip, m[2] + toC1.z * 0.018];
  const adPalm: V3 = [m[0] - toC1.x * 0.018, m[1] - 0.005 + 0.01 * grip, m[2] - toC1.z * 0.018];
  return (
    <>
      <U position={C1_ROOM} yaw={c1Yaw} t={t} pose={{ ...reach(C1_ROOM, c1Yaw, "L", c1Palm), headYaw: c1Head }} hands={{ L: { dir: [0, -1, 0.3], palm: [1, 0, 0], curl: 35 + 35 * grip, w: 0.8 } }} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
      <Npc preset={ADIK_B} position={ADIK_ROOM} yaw={FACE_WIN_ADIK} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...reach(ADIK_ROOM, FACE_WIN_ADIK, "R", adPalm, ADIK_B.height), headYaw: 15, headNod: -6 }} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
    </>
  );
};

// ------------------------------------------------------------------ shots
type Shot = { id: string; scene: string; start: number; end: number };
const SHOTS = PLAN.shots as Shot[];
type Staged = { cam: Cam; mood: MoodPreset; ext: boolean; int: boolean; tamuLamp: number; body: React.ReactNode; light: V3; blur?: number; ui?: React.ReactNode; house7?: "full" | "none"; sky?: boolean; doors?: number; wild?: "east" | "south"; kamarDoor?: number };

const stage = (s: Shot, t: number): Staged => {
  const u = clamp01((t - s.start) / (s.end - s.start));
  const lightOff = PLAN.beats.lightOff;
  const lit = t < lightOff ? 1 : 0;
  switch (s.id) {
    // A01 — high wide across the street, slow push toward the bedroom window
    case "a01": {
      const a = cam([-14, 9, 13], [6, 1.5, 3.5], 50);
      const b = cam([-3.2, 4.4, 10.5], [2.6, 1.35, 3.0], 40);
      return { cam: camLerp(a, b, ease(u)), mood: NIGHT_EXT, ext: true, int: false, tamuLamp: 0, body: null, light: [2.6, 1.5, 3], sky: true };
    }
    // A02–A04 — the reviewed pilot v3 (v3b: smooth hand-to-lap, A04 framed so "Uq" clears the captions)
    case "a02":
    case "a03":
    case "a04": {
      const id = s.id as "a02" | "a03" | "a04";
      const head: V3 = id === "a02" ? [3.1 - 0.74, KAMAR.bed.top + 0.2, (KAMAR.bed.z0 + KAMAR.bed.z1) / 2] : [3.1, 1.2, -0.47];
      return { cam: camV3(id, t, true), mood: NIGHT_BED, ext: false, int: true, tamuLamp: 0, body: <BedC1 t={t} v3b arms={ENV === "v5" || ENV === "final" ? "v3c" : undefined} />, light: head, blur: 0.4, wild: id === "a02" ? undefined : "east", kamarDoor: 0.25 };
    }
    // A05 — over C1's shoulder at the window (camera 2.3 m behind him), the villagers come out
    case "a05a": {
      const c1Root: V3 = [KAMAR.window.x - 0.14, 0, 2.6];
      const open = ramp(t, s.start + 0.2, s.start + 1.0);
      return {
        cam: camLerp(cam([KAMAR.window.x + 0.35, 1.72, 0.35], [KAMAR.window.x - 0.15, 0.95, 9.0], 40), cam([KAMAR.window.x + 0.3, 1.72, 0.55], [KAMAR.window.x - 0.15, 0.92, 9.0], 38), ease(u)),
        mood: NIGHT_EXT, ext: true, int: true, tamuLamp: 0, house7: "none", doors: ramp(t, 16.0, 17.2), kamarDoor: 0.25,
        body: (
          <>
            <U position={c1Root} yaw={S_} t={t} pose={{ ...reach(c1Root, S_, "R", [KAMAR.window.x + 0.2 + 0.12 * open, 1.3, 2.86]), headYaw: 0 }} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
            <Warga list={crowdA05()} t={t} />
            {ENV !== "v3" ? <Standers list={PORCH_A05} t={t} /> : null}
          </>
        ),
        light: [KAMAR.window.x, 1.4, 2.4],
      };
    }
    case "a05b":
    case "a05c": {
      const who = WARGA_A05[s.id === "a05b" ? 0 : 1];
      const w = walkState(who.gait, who.plan, t);
      const at: V3 = [w.position[0], 1.0, w.position[2]];
      return { cam: cam([KAMAR.window.x, 1.45, 2.3], at, 26), mood: NIGHT_EXT, ext: true, int: true, tamuLamp: 0, house7: "none", body: <Warga list={crowdA05()} t={t} />, light: [at[0], 1.3, at[2]], kamarDoor: 0.25 };
    }
    // A06 — adik in the bedroom door, the lit living room behind her; C1 turns from the window (camera beyond the wild
    // east wall, 2.3 m from C1; then a long lens on adik from 2.5 m)
    case "a06a":
    case "a06b": {
      const c1Root: V3 = [3.0, 0, 2.15];
      const adikRoot: V3 = [KAMAR.x0 + 0.12, 0, KAMAR.door.z];
      const turn = ramp(t, L("L9").start + 0.3, L("L9").start + 1.0);
      const adikTurn = ramp(t, L("L10").end + 0.2, L("L10").end + 0.8);
      const talking = t >= L("L10").start && t < L("L10").end;
      const body = (
        <>
          <U position={c1Root} yaw={lerp(S_, N_ - 0.9, turn)} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ headYaw: -18 * turn }} />
          <Npc preset={ADIK_B} position={adikRoot} yaw={lerp(E, -E + 0.4, adikTurn)} t={t} face={{ mouth: talking ? "open" : "soft", eyes: "open" }} pose={{ headNod: -4 }} />
        </>
      );
      return s.id === "a06a"
        ? { cam: cam([3.45, 1.5, 4.35], [2.0, 1.05, 1.0], 50), mood: NIGHT_INT, ext: false, int: true, tamuLamp: 1, body, light: [2.2, 1.3, 1.4], wild: "south" }
        : { cam: cam([3.55, 1.22, 0.85], [adikRoot[0], 1.05, adikRoot[2]], 24), mood: NIGHT_INT, ext: false, int: true, tamuLamp: 1, body, light: [1.3, 1.1, 0.3], blur: 1.0 };
    }
    // A07 — the phone: hand + phone insert, the chat UI, then C1's face lit by the screen (long lens from 2.3 m)
    case "a07a": {
      const root: V3 = [KAMAR.table.x + 0.15, 0, KAMAR.table.z + 0.5];
      const yaw = N_ - 0.5;
      const lift = ramp(t, s.start + 0.6, s.end - 0.1);
      const onTable: V3 = [KAMAR.table.x, KAMAR.table.top + 0.006, KAMAR.table.z];
      const inHand: V3 = [root[0] - 0.12, 1.12, root[2] - 0.22];
      const target = lerp3(onTable, inHand, lift);
      const reachK = ramp(t, s.start, s.start + 0.55);
      const handTarget = lerp3([root[0] - 0.15, 0.9, root[2] - 0.05], target, reachK);
      return {
        cam: cam([KAMAR.table.x + 0.55, 1.35, KAMAR.table.z + 0.45], [KAMAR.table.x - 0.05, 0.8, KAMAR.table.z - 0.05], 36),
        mood: NIGHT_INT, ext: false, int: true, tamuLamp: 1,
        body: (
          <>
            <U position={root} yaw={yaw} t={t} pose={reach(root, yaw, "L", handTarget)} face={{ eyes: "down", mouth: "flat" }} />
            <Phone p={target} q={new THREE.Euler(-Math.PI / 2 + lift * 1.2, 0, 0)} glow={0.6} />
          </>
        ),
        light: [KAMAR.table.x, 1.0, KAMAR.table.z], blur: 1.0,
      };
    }
    case "a07b":
      return { cam: cam([2.6, 1.3, 0.4], [2.0, 1.2, -0.2], 30), mood: NIGHT_INT, ext: false, int: true, tamuLamp: 1, body: null, light: [2.0, 1.2, -0.2], blur: 3.0, ui: <PhoneUI t={t} tIn={s.start} notif={L("L13").start} /> };
    case "a07c": {
      const root: V3 = [2.05, 0, -0.15];
      const phone: V3 = [2.05 + 0.3, 1.18, -0.15 - 0.03];
      return {
        cam: camLerp(cam([4.35, 1.32, 0.15], [2.05, 1.3, -0.15], 20), cam([4.25, 1.32, 0.13], [2.05, 1.3, -0.15], 19), u),
        mood: NIGHT_INT, ext: false, int: true, tamuLamp: 1, wild: "east",
        body: (
          <>
            <U position={root} yaw={E} t={t} pose={reach(root, E, "L", phone)} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
            <Phone p={phone} q={new THREE.Euler(0, -Math.PI / 2 + 0.25, 0)} glow={1} />
          </>
        ),
        light: [2.05, 1.3, -0.15], blur: 1.2,
      };
    }
    // A08 — adik at the front door; C1 comes in, takes her arm, pulls her back (v3a08.ts)
    case "a08": {
      const a = a08At(t);
      const c1Pose: NonNullable<C1Props["pose"]> = {
        lean: a.c1.body.lean,
        ...(a.c1.walkPose ? { armL: a.c1.walkPose.armL, armLFwd: a.c1.walkPose.armLFwd, armR: a.c1.walkPose.armR, armRFwd: a.c1.walkPose.armRFwd, twist: a.c1.walkPose.twist * (1 - a.c1.grab), roll: a.c1.walkPose.roll * (1 - a.c1.grab), headNod: a.c1.walkPose.headNod } : {}),
        ...(a.c1.armR && a.c1.grab > 0 ? { armR: a.c1.armR.arm, armRFwd: a.c1.armR.fwd } : {}),
      };
      const adikPose = {
        ...(ADIK_B.pose ?? {}),
        lean: a.adik.body.lean,
        ...(a.adik.walkPose ? { twist: a.adik.walkPose.twist, roll: a.adik.walkPose.roll } : {}),
        ...(a.adik.armR && a.adik.onHandle > 0.01 ? { armR: a.adik.armR.arm, armRFwd: a.adik.armR.fwd } : {}),
      };
      void HANDLE;
      return {
        // from the north (looking south at the door): the two separate on screen; a slow drift
        cam: camLerp(cam([-1.75, 1.45, -0.5], [-2.1, 1.0, 2.35], 42), cam([-1.7, 1.45, -0.42], [-2.05, 1.0, 2.25], 41), ease(u)),
        mood: LAMP, ext: false, int: true, tamuLamp: 1,
        body: (
          <>
            <Npc preset={ADIK_B} position={a.adik.position} yaw={a.adik.yaw} t={t} pose={adikPose} legPose={a.adik.legPose} face={{ eyes: "open", brows: a.c1.grab > 0.5 ? "raised" : "neutral", mouth: "flat" }} />
            <U position={a.c1.position} yaw={a.c1.yaw} t={t} pose={c1Pose} legPose={a.c1.legPose} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          </>
        ),
        light: [-1.9, 1.2, 2.0],
      };
    }
    // A09 — the announcement stops; both turn to the front window (head first, torso after); silence; adik takes one
    // small step closer to C1; very slow push
    case "a09": {
      const c1Turn = winTurn(t, s.start + 0.15, C1_YAW_END, WIN, C1_ROOM);
      const aw = walkState(ADIK_GAIT, ADIK_STEP, t);
      const adikPos: V3 = t >= ADIK_STEP.t0 ? aw.position : ADIK_PULLED;
      const adikTurn = winTurn(t, s.start + 0.35, ADIK_YAW_END, WIN, ADIK_PULLED);
      const stepping = t >= ADIK_STEP.t0;
      const mid: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 1.05, (C1_ROOM[2] + ADIK_ROOM[2]) / 2];
      return {
        // in front of them (they turn toward the front window = toward the camera), beyond the wild south wall
        cam: camLerp(cam([mid[0] + 0.45, 1.4, 4.35], [mid[0], 1.02, mid[2]], 36), cam([mid[0] + 0.4, 1.39, 4.15], [mid[0], 1.03, mid[2]], 35), u),
        mood: LAMP, ext: false, int: true, tamuLamp: 1, wild: "south",
        body: (
          <>
            <U position={C1_ROOM} yaw={C1_YAW_END} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat", look: -0.4 }} pose={{ headYaw: c1Turn.headYaw, twist: c1Turn.twist }} />
            <Npc preset={ADIK_B} position={adikPos} yaw={stepping ? lerp(lerp(ADIK_YAW_END, ADIK_STEP.yaw, ramp(t, ADIK_STEP.t0 - 0.3, ADIK_STEP.t0)), FACE_WIN_ADIK, ramp(t, ADIK_STEP.tStop! + 0.3, ADIK_STEP.tStop! + 1.1)) : ADIK_YAW_END} t={t} legPose={stepping ? aw.legPose : undefined} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ ...(ADIK_B.pose ?? {}), headYaw: adikTurn.headYaw * (1 - ramp(t, ADIK_STEP.t0 - 0.3, ADIK_STEP.t0)), twist: adikTurn.twist * (1 - ramp(t, ADIK_STEP.t0 - 0.3, ADIK_STEP.t0)) }} />
          </>
        ),
        light: [mid[0], 1.2, mid[2]],
      };
    }
    // A10 — the toa horns (nobody there), then the "7" plate; slow moves
    case "a10a": {
      const h = toaHornWorld();
      return { cam: camLerp(cam([h[0] - 2.2, 1.6, h[2] + 2.6], [h[0], h[1] - 0.2, h[2]], 30), cam([h[0] - 1.9, 1.7, h[2] + 2.3], [h[0], h[1] + 0.1, h[2]], 26), ease(u)), mood: NIGHT_EXT, ext: true, int: false, tamuLamp: 1, body: null, light: h, sky: true };
    }
    case "a10b": {
      const p = plateWorld();
      return { cam: camLerp(cam([p[0] + 0.35, p[1] + 0.12, p[2] + 1.3], p, 30), cam([p[0] + 0.18, p[1] + 0.05, p[2] + 0.75], p, 26), ease(u)), mood: NIGHT_EXT, ext: true, int: false, tamuLamp: 1, body: null, light: [p[0], p[1] + 0.3, p[2] + 0.5], sky: true, blur: 1.0 };
    }
    // A11 — adik looks up at C1, then whispers "Kok dia tahu?" (long lenses from >= 2.3 m)
    case "a11a":
    case "a11b": {
      const up = ramp(t, L("L23").start, L("L23").start + 0.6);
      const whisper = t >= L("L24").start && t < L("L24").end;
      const c1Yaw = FACE_WIN_C1 - 0.5;
      const adikYaw = yawTo(ADIK_ROOM, C1_ROOM);
      const body = (
        <>
          <U position={C1_ROOM} yaw={c1Yaw} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ headYaw: -20, headNod: -6 }} />
          <Npc preset={ADIK_B} position={ADIK_ROOM} yaw={adikYaw} t={t} face={{ eyes: "open", brows: "worried", mouth: whisper ? "open" : "flat" }} pose={{ ...(ADIK_B.pose ?? {}), headNod: -14 * up, headYaw: 8 }} />
        </>
      );
      const c1h: V3 = [C1_ROOM[0], 1.3, C1_ROOM[2]];
      const ah: V3 = [ADIK_ROOM[0], 1.0, ADIK_ROOM[2]];
      return s.id === "a11a"
        ? { cam: cam([C1_ROOM[0] + 1.0, 1.35, C1_ROOM[2] + 2.3], [c1h[0], c1h[1] - 0.12, c1h[2]], 24), mood: LAMP, ext: false, int: true, tamuLamp: 1, body, light: c1h, blur: 1.0, wild: "south" }
        : { cam: cam([C1_ROOM[0] + 0.95, 1.12, C1_ROOM[2] - 2.15], [ah[0], ah[1] + 0.02, ah[2]], 20), mood: LAMP, ext: false, int: true, tamuLamp: 1, body, light: ah, blur: 1.0 };
    }
    // A12 — C1 switches the light off (insert), then the dark room
    case "a12a":
    case "a12b": {
      const root: V3 = [TAMU.switch[0] - 0.36, 0, TAMU.switch[2] - 0.5];
      const yaw = S_ + 0.6;
      const press = ramp(t, lightOff - 0.45, lightOff);
      const handT = lerp3([root[0] + 0.15, 1.0, root[2] + 0.15], [TAMU.switch[0] - 0.01, TAMU.switch[1], TAMU.switch[2] - 0.035], press);
      const body = (
        <>
          <U position={root} yaw={yaw} t={t} pose={reach(root, yaw, "R", handT)} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          <Npc preset={ADIK_B} position={ADIK_ROOM} yaw={FACE_WIN_ADIK} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
        </>
      );
      return s.id === "a12a"
        ? { cam: cam([TAMU.switch[0] + 0.65, 1.42, TAMU.switch[2] - 0.8], TAMU.switch, 34), mood: lit ? LAMP : NIGHT_INT, ext: false, int: true, tamuLamp: lit, body, light: TAMU.switch, blur: 1.2 }
        : { cam: cam([0.75, 1.55, 2.3], [-1.95, 1.0, 2.0], 46), mood: NIGHT_INT, ext: false, int: true, tamuLamp: 0, body, light: [-1.6, 1.2, 1.7] };
    }
    // A13 — in the dark both turn to the window (L26); outside, the living-room window has just gone dark (L27)
    case "a13a": {
      const turn = ramp(t, L("L26").start + 0.2, L("L26").start + 0.8);
      const mid: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 1.05, (C1_ROOM[2] + ADIK_ROOM[2]) / 2];
      return {
        cam: cam([mid[0] + 0.35, 1.4, 4.35], [mid[0], 1.02, mid[2]], 36),
        mood: NIGHT_INT, ext: false, int: true, tamuLamp: 0, house7: "none", wild: "south",
        body: (
          <>
            <U position={C1_ROOM} yaw={lerp(FACE_WIN_C1 - 0.5, FACE_WIN_C1, turn)} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ roll: 2 * turn }} />
            <Npc preset={ADIK_B} position={ADIK_ROOM} yaw={lerp(FACE_WIN_ADIK + 0.6, FACE_WIN_ADIK, turn)} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          </>
        ),
        light: [mid[0], 1.2, mid[2]],
      };
    }
    case "a13b":
      return { cam: cam([-14, 9, 13], [3.0, 1.4, 5.0], 48), mood: NIGHT_EXT, ext: true, int: false, tamuLamp: 0, body: <Crowd14 t={t} />, light: [0, 1.4, 7], sky: true };
    // A14 — POV from behind the living-room curtain: the villagers slow down, stop, turn their heads one by one
    case "a14":
      return { cam: cam([TAMU.window.x + 0.1, 1.5, 2.66], [-1.1, 0.95, 8.0], 44), mood: NIGHT_EXT, ext: true, int: true, tamuLamp: 0, house7: "none", body: <Crowd14 t={t} />, light: [-1.0, 1.3, 7.5] };
    // A15 — adik's hand grips C1's hand tighter (insert), then the camera pulls back to both faces from 2.6 m
    case "a15": {
      const grip = ramp(t, L("L30").start + 0.4, L("L30").end);
      const m = MEET();
      const tilt = ramp(t, s.start + 0.9, s.end - 0.2);
      return {
        cam: camLerp(cam([m[0] + 0.25, m[1] + 0.25, m[2] + 0.95], [m[0], m[1] + 0.02, m[2]], 30), cam([m[0] + 0.35, 1.22, m[2] + 2.45], [m[0], 1.06, m[2]], 36), tilt),
        mood: NIGHT_INT, ext: false, int: true, tamuLamp: 0, house7: "none", wild: "south",
        body: <Pair t={t} grip={grip} />,
        light: [m[0], 1.0, m[2] + 0.3], blur: 1.0,
      };
    }
    // A16 — C1 turns toward the back of the house (screen right); POV down the hallway to the back door
    case "a16a": {
      const turn = ramp(t, s.start + 0.25, s.start + 1.0);
      return {
        cam: cam([-0.85, 1.4, -0.45], [C1_ROOM[0], 1.28, C1_ROOM[2]], 24),
        mood: NIGHT_INT, ext: false, int: true, tamuLamp: 0, house7: "none",
        body: <Pair t={t} grip={1} c1Yaw={FACE_WIN_C1 + 1.0 * turn} c1Head={50 * turn} />,
        light: [C1_ROOM[0], 1.3, C1_ROOM[2] + 0.4], blur: 1.0,
      };
    }
    case "a16b":
      return { cam: camLerp(cam([-0.8, 1.5, -0.4], [-0.8, 1.15, -5.0], 40), cam([-0.8, 1.48, -1.55], [-0.8, 1.15, -5.0], 38), ease(clamp01(u / 0.8))), mood: NIGHT_INT, ext: false, int: true, tamuLamp: 0, body: null, light: [-0.8, 1.2, -3.0] };
    // A17 — both, hand in hand, between the two ways out; C1 glances left (window), then right (hallway); cards
    case "a17": {
      const l33 = L("L33");
      const atau = l33.start + (l33.end - l33.start) * 0.42;
      const lookL = ramp(t, l33.start + 0.3, l33.start + 1.0) * (1 - ramp(t, atau - 0.2, atau + 0.3));
      const lookR = ramp(t, atau, atau + 0.8) * (1 - ramp(t, l33.end + 0.2, l33.end + 1.0));
      const P = [0.75, 1.5, 2.55] as V3;
      const mid: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 1.0, (C1_ROOM[2] + ADIK_ROOM[2]) / 2];
      const centre = cam(P, mid, 54);
      const win = cam(P, [-1.45, 1.15, 2.6], 54);
      const hall = cam(P, [-1.0, 1.05, -1.6], 54);
      const c =
        t < atau ? camLerp(centre, win, ramp(t, l33.start + 0.2, l33.start + 1.4) * (1 - ramp(t, atau - 0.6, atau + 0.2)))
        : t < l33.end ? camLerp(centre, hall, ramp(t, atau + 0.1, atau + 1.3))
        : camLerp(hall, centre, ramp(t, l33.end, l33.end + 1.0));
      return {
        cam: c, mood: NIGHT_INT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: (
          <>
            <Pair t={t} grip={1} c1Yaw={FACE_WIN_C1 + 1.0 * lookR} c1Head={-25 * lookL + 50 * lookR} />
            <Crowd14 t={t} />
          </>
        ),
        light: [mid[0], 1.3, mid[2]],
        ui: <Cards t={t} inAt={PLAN.beats.cards} />,
      };
    }
    default:
      return { cam: cam([0, 1.5, 5], [0, 1, 0]), mood: NIGHT_INT, ext: false, int: true, tamuLamp: 0, body: null, light: [0, 1, 0] };
  }
};
void ADIK_DOOR;

const CaptionLayer: React.FC = () => {
  const f = useCurrentFrame();
  return <CaptionsHL t={f / AV3_FPS} />;
};

/** env "v4" (2026-11-17): the denser neighbourhood (more houses, fence styles, back rows) and more villagers;
 * "v3" = the animatic v3 exactly as reviewed (the set-defect fixes apply to both) */
/** env "v5" (2026-11-17) = v4 + C1's arms kept outside the body during the sit-up (BedC1 arms "v3c") */
/** env "final" (2026-11-17) = v5 + the "HARI 1" day label over the first ~5 s */
export const AnimaticV3: React.FC<{ env?: "v3" | "v4" | "v5" | "final"; captions?: boolean }> = ({ env = "v3", captions = true }) => {
  ENV = env;
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  const t = f / AV3_FPS;
  const shot = SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];
  const st = stage(shot, t);
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={st.mood} cam={st.cam} t={t} focus={st.cam.look} blur={st.blur ?? 0.4} sky={!!st.sky || (st.ext && st.int)}>
        {st.int ? <HouseInterior tamuLamp={st.tamuLamp} t={t} windowGlass={st.ext ? "clear" : "opaque"} light="local" moon={0.55} moonReach={3.0} dressing wild={st.wild} kamarDoorOpen={st.kamarDoor ?? 1.35} /> : null}
        {st.ext ? <StreetSet t={t} tamuLit={st.tamuLamp} house7={st.int ? "none" : st.house7 ?? "full"} neighbourDoorsOpen={st.doors ?? 1} light="local" dense={env !== "v3"} /> : null}
        {st.body}
        <CastLight at={st.light} cam={st.cam.pos} mood={st.mood} />
      </View>
      {st.ui}
      {env === "final" && captions ? <DayLabel t={t} /> : null}
      {captions ? <CaptionLayer /> : null}
    </AbsoluteFill>
  );
};
