// Episode 2026-11-003 — FULL EPISODE S01–S12, draft (owner 2026-11-18: pilot v3 approved as the quality reference;
// D-043 pending). One pure function of episode time, episodeAt(te): shot, camera, characters, phone, torch, bolt,
// door shake, phone glow, overlays. Read by the composition (Episode003.tsx) and the checks (tools/e003_check.ts).
//   - S03–S06 = pilot v3 (pilot003Stage.ts, VAR3) at pilot time te - OFF, OFF a whole number of frames, unchanged. Its
//     first walk is started 3 strides earlier on the same line (walk1Ext) so S02 shows Uq walking in from the living
//     room; for te >= OFF the stage is identical to P3 (per-frame dump).
//   - S01, S02, S07–S12: staged here. Footwork through cast/stepper.ts (lifted steps, no sliding) or cast/walk.ts.
// Storyboard: content.md §3.5 + v0.5 (§10.1). Positions and the reasons for them: content.md §13.
import * as THREE from "three";
import { C1_BUILD, C1_HEIGHT } from "../c1/c1rig";
import type { C1Hand } from "../c1/c1rig";
import type { C1Face } from "../c1/C1";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import { solveArm } from "../inkbeat/core/ik";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { walkState } from "../cast/walk";
import type { Gait, WalkPlan } from "../cast/walk";
import { chain, movesAt, stanceAt, turnInPlace, walkSteps } from "../cast/stepper";
import type { Stance } from "../cast/stepper";
import { a08At } from "../ep002/v3a08";
import EP1 from "../ep002/plan-2026-11-002.json";
import { TAMU } from "../ep002/geo";
import { ADIK_HEIGHT, ADIK_REST, GLASS, NORTH } from "./ld003Scene";
import { GRIPS, gripPhone, handFrame } from "./ld003SceneV3";
import { buildPilot003, VAR3 } from "./pilot003Stage";
import type { CharS, PlanJson, Stage } from "./pilot003Stage";
import PILOT_V3 from "./pilot003-plan-v3.json";
import PLAN from "./episode003-plan.json";

export const FPS = 30;
const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const D2R = Math.PI / 180;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const ramp = (t: number, a: number, b: number) => smooth((t - a) / Math.max(1e-6, b - a));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
const v3 = (p: THREE.Vector3): V3 => [p.x, p.y, p.z];
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const camMix = (a: Cam, b: Cam, u: number): Cam => ({ pos: mix3(a.pos, b.pos, u), look: mix3(a.look, b.look, u), fov: mix(a.fov, b.fov, u), roll: 0 });
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
type Q3 = [number, number, number];
const qLerp = (a: Q3, b: Q3, u: number): Q3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
const handMix = (a: C1Hand, b: C1Hand, u: number): C1Hand => {
  const n = (x: V3) => {
    const l = Math.hypot(...x) || 1;
    return [x[0] / l, x[1] / l, x[2] / l] as V3;
  };
  return { dir: n(mix3(a.dir, b.dir, u)), palm: n(mix3(a.palm, b.palm, u)), curl: mix(a.curl ?? 0, b.curl ?? 0, u), w: mix(a.w ?? 1, b.w ?? 1, u) };
};
/** IK in world space → [shoulder a, shoulder b, fwd] */
const ik = (root: V3, yaw: number, side: "L" | "R", target: V3, height = C1_HEIGHT): Q3 => {
  const s = solveArm({ position: root, yaw, side, target, height, build: C1_BUILD });
  return [s.arm[0], s.arm[1], s.fwd];
};
const toWorld = (root: V3, yaw: number, local: V3, height = 1): V3 => {
  const p = new THREE.Vector3(...local).multiplyScalar(height).applyAxisAngle(UP, yaw);
  return [root[0] + p.x, root[1] + p.y, root[2] + p.z];
};
/** a phone box turned so its back (+z) points at `aim`; the screen (-z) faces the holder (as the pilot) */
const aimQuat = (p: V3, aim: V3) => {
  const yaw = Math.atan2(aim[0] - p[0], aim[2] - p[2]);
  const pitch = Math.atan2(aim[1] - p[1], Math.hypot(aim[0] - p[0], aim[2] - p[2]));
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-pitch, 0, 0)));
};
const q4 = (q: THREE.Quaternion): [number, number, number, number] => [q.x, q.y, q.z, q.w];

// ------------------------------------------------------------------ plan
export type ELine = { id: string; who: string; seg: string; text: string; start: number; end: number; pre?: number; bursts?: [number, number][] };
export const LINES = PLAN.lines as ELine[];
const L = (id: string) => LINES.find((l) => l.id === id)!;
export const OFF = PLAN.off as number;
export const END = PLAN.end as number;
export const FRAMES = PLAN.frames as number;
export const KNOCKS = PLAN.knocks as number[];
export const CARDS_AT = PLAN.cards as number;
export const VIB = PLAN.vib as number[];
/** draft v2: the Episode 1 choice recap before S01 (a freeze of S01's first frame under Ep 1's two cards) */
export const RECAP = (PLAN as { recap?: number }).recap ?? 0;
export const RECAP_CLICK = (PLAN as { recapClick?: number }).recapClick ?? 0;
export const RECAP_OUT = (PLAN as { recapOut?: number }).recapOut ?? 0;
const SH = PLAN.shots as Record<string, number>;

// ------------------------------------------------------------------ the approved pilot (S03–S06), first walk extended
export const P = buildPilot003(PILOT_V3 as PlanJson, { ...VAR3, walk1Ext: 3 });
/** pilot time on the pilot's own frame grid: (episode frame - OFF frames) / FPS, so float error in te - OFF can never move
 * a cut by a frame (OFF 12.1 s + 19.0333 s fell 1e-12 short of frame 934 and showed S06 on S06f's first frame) */
const OFF_F = Math.round(OFF * FPS);
const tp = (te: number) => (Math.abs(te * FPS - Math.round(te * FPS)) < 1e-6 ? (Math.round(te * FPS) - OFF_F) / FPS : te - OFF);
const PEND_F = PLAN.pilotFrames as number;
/** episode shots: S01, S02, the pilot's shots shifted by OFF (ids s03…s06d), S07–S12 */
export type EShotId = "s00" | "s01" | "s02" | "s03" | "s03i" | "s04" | "s05" | "s06" | "s06f" | "s06d" | "s07" | "s08" | "s09" | "s10" | "s11" | "s12";
export type EShot = { id: EShotId; start: number; end: number };
export const SHOTS: EShot[] = [
  ...(RECAP > 0 ? [{ id: "s00" as EShotId, start: 0, end: SH.s01 }] : []),
  { id: "s01", start: SH.s01 ?? 0, end: SH.s02 },
  { id: "s02", start: SH.s02, end: SH.s03 },
  ...P.SHOTS.map((s) => ({ id: s.id as EShotId, start: OFF + s.start, end: s.end === P.END ? OFF + PEND_F / FPS : OFF + s.end })),
  { id: "s07", start: SH.s07, end: SH.s08 },
  { id: "s08", start: SH.s08, end: SH.s09 },
  { id: "s09", start: SH.s09, end: SH.s10 },
  { id: "s10", start: SH.s10, end: SH.s11 },
  { id: "s11", start: SH.s11, end: SH.s12 },
  { id: "s12", start: SH.s12, end: END },
];
export const shotAt = (t: number): EShotId => (SHOTS.find((s) => t >= s.start - 1e-9 && t < s.end - 1e-9) ?? SHOTS[SHOTS.length - 1]).id;

// ------------------------------------------------------------------ Episode 1's living room (S01, S12): the A17 pair
const EP1_A08 = (EP1 as unknown as { shots: { id: string; end: number }[] }).shots.find((s) => s.id === "a08")!;
const A08_END = a08At(EP1_A08.end);
export const C1_ROOM: V3 = [A08_END.c1.position[0], 0, A08_END.c1.position[2]];
const ADIK_PULLED: V3 = [A08_END.adik.position[0], 0, A08_END.adik.position[2]];
const EP1_L18 = (EP1 as unknown as { lines: { id: string; end: number }[] }).lines.find((l) => l.id === "L18")!;
const ADIK_GAIT_EP1: Gait = { height: ADIK_HEIGHT, stride: 0.55, phase: 0.3, swing: 6, lift: 0.025 };
export const ADIK_ROOM: V3 = (() => {
  const w: WalkPlan = { t0: EP1_L18.end + 0.5, from: ADIK_PULLED, yaw: yawTo(ADIK_PULLED, C1_ROOM), speed: 0.45, tStop: EP1_L18.end + 1.3, decel: 0.5 };
  const p = walkState(ADIK_GAIT_EP1, w, w.tStop! + 1).position;
  return [p[0], 0, p[2]];
})();
const WIN: V3 = [TAMU.window.x, 1.3, 3.0];
const FACE_WIN_C1 = yawTo(C1_ROOM, WIN);
const FACE_WIN_ADIK = yawTo(ADIK_ROOM, WIN);
const MEET: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 0.76, (C1_ROOM[2] + ADIK_ROOM[2]) / 2 + 0.1];
const pairPalms = (grip: number) => {
  const toC1 = new THREE.Vector3(C1_ROOM[0] - MEET[0], 0, C1_ROOM[2] - MEET[2]).normalize();
  return {
    uq: [MEET[0] + toC1.x * 0.018, MEET[1] + 0.01 * grip, MEET[2] + toC1.z * 0.018] as V3,
    adik: [MEET[0] - toC1.x * 0.018, MEET[1] - 0.005 + 0.01 * grip, MEET[2] - toC1.z * 0.018] as V3,
  };
};

// ------------------------------------------------------------------ hands, arms (same values as the pilot)
const HAND_G2 = GRIPS.g2.hand;
const HAND_FRONT: C1Hand = { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 };
const HAND_REST: C1Hand = { dir: [0, -1, 0.05], palm: [-1, 0, 0], curl: 20, w: 0 };
const HAND_PAIR: C1Hand = { dir: [0, -1, 0.3], palm: [1, 0, 0], curl: 70, w: 0.8 };
const SIDE_Q: Q3 = [12, 35, 75]; // left arm (code "R") carrying the phone at the side (pilot)
const REST_R: Q3 = [6, 8, 0]; // right arm (code "L") hanging (walk.ts at rest)
// (pilot FRONT_LOCAL [0.07, 1.15, 0.2] = the phone in front of the chest; not used after S06)
const READ_LOCAL: V3 = [0.08, 0.98, 0.24]; // S08–S09: reading the message, lower (at chest height it hid his face from S09)
const POCKET_LOCAL: V3 = [0.13, 0.84, 0.03]; // left trouser pocket (body-local m, +x = his left)
const PHONE_SIDE = (root: V3, yaw: number, q: Q3) => gripPhone({ armR: [q[0], q[1]], armRFwd: q[2] }, "R", GRIPS.g2, root, yaw);
const PHONE_FRONT = (root: V3, yaw: number, q: Q3, hand: C1Hand, tilt = 0.6) => {
  const poseArmR = { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  const palm = armChain(poseArmR, "R", LAY).H.multiplyScalar(C1_HEIGHT).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
  const fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const p = palm.clone().addScaledVector(fwd, 0.03).add(new THREE.Vector3(0, 0.02, 0));
  const aim: V3 = [p.x + fwd.x, p.y - tilt, p.z + fwd.z]; // back of the phone forward-down: the screen faces his face
  void hand;
  return { p: v3(p), q: q4(aimQuat(v3(p), aim)) };
};
const qPhone = (r: { p: THREE.Vector3 | V3; q: THREE.Quaternion }) => ({ p: (Array.isArray(r.p) ? r.p : v3(r.p)) as V3, q: q4(r.q) });
type PhoneW = { p: V3; q: [number, number, number, number] };
type PhoneL = { p: THREE.Vector3; q: THREE.Quaternion };
const armPoseR = (q: Q3) => ({ armR: [q[0], q[1]] as [number, number], armRFwd: q[2] });
/** a world phone transform → local to the left hand's frame (pose q, hand shape h) */
const phoneToHand = (w: PhoneW, root: V3, yaw: number, q: Q3, h: C1Hand): PhoneL => {
  const hf = handFrame(armPoseR(q), "R", h, root, yaw);
  const inv = hf.q.clone().invert();
  return { p: new THREE.Vector3(...w.p).sub(hf.origin).applyQuaternion(inv), q: inv.clone().multiply(new THREE.Quaternion(...w.q)) };
};
/** local-to-hand → world for the current pose */
const phoneFromHand = (l: PhoneL, root: V3, yaw: number, q: Q3, h: C1Hand): PhoneW => {
  const hf = handFrame(armPoseR(q), "R", h, root, yaw);
  return { p: v3(l.p.clone().applyQuaternion(hf.q).add(hf.origin)), q: q4(hf.q.clone().multiply(l.q)) };
};
const localMix = (a: PhoneL, b: PhoneL, u: number): PhoneL => ({ p: a.p.clone().lerp(b.p, u), q: a.q.clone().slerp(b.q, u) });
export const blendPhone = (a: { p: V3; q: [number, number, number, number] }, b: { p: V3; q: [number, number, number, number] }, u: number) => {
  const qa = new THREE.Quaternion(...a.q), qb = new THREE.Quaternion(...b.q);
  return { p: mix3(a.p, b.p, u), q: q4(qa.clone().slerp(qb, u)) };
};

// ------------------------------------------------------------------ places after the pilot (content.md §13)
/** S07 end → S09: Uq at the hallway mouth on the living-room side, facing south; adik on his right (west) */
export const UQ_MOUTH: V3 = [-0.65, 0, -0.75];
export const ADIK_MOUTH: V3 = [-1.15, 0, -0.6];
/** S10 (off screen) → S11: Uq faces north (the back door); adik moves to his right-behind (east-south) */
export const ADIK_BEHIND: V3 = [-0.25, 0, -0.5]; // 0.4 m east of Uq: his one-plane arm cannot fold its hand in closer (S11 grip error 8 cm at -0.38)
const SOUTH = 0;

// ------------------------------------------------------------------ Uq
const pilotEnd = P.uqAt(PEND_F / FPS - 1e-6);
const UQ_P_END: Stance = stanceAt(pilotEnd.char.root, pilotEnd.char.yaw, C1_HEIGHT); // default legs after the turn
const T7 = SH.s07, L10 = L("L10"), L11 = L("L11"), L12 = L("L12"), L14 = L("L14"), L15 = L("L15"), L19 = L("L19");
const toGlassYaw = yawTo(UQ_P_END.root, GLASS);
// S07: turn back toward the glass on L10, then turn south and walk back to the hallway mouth (L11–L12)
const UQ7 = (() => {
  const a = turnInPlace(UQ_P_END, toGlassYaw, T7 + 0.1, T7 + 0.85, C1_HEIGHT);
  const b1 = turnInPlace(a.end, toGlassYaw - Math.PI / 2, L10.end - 0.55, L10.end - 0.05, C1_HEIGHT);
  const b2 = turnInPlace(b1.end, SOUTH + 0.0001, L10.end - 0.02, L10.end + 0.5, C1_HEIGHT);
  const w0 = L10.end + 0.55, w1 = SH.s08 - 0.1;
  const c = walkSteps(b2.end, UQ_MOUTH, SOUTH, 9, w0, w1, C1_HEIGHT);
  return { moves: chain(UQ_P_END, C1_HEIGHT, [a, b1, b2, c]), walk: [w0, w1] as [number, number], end: c.end };
})();
// S10 (off screen): turn to face north at the mouth (two quarter turns)
const T10 = SH.s10;
const UQ10 = (() => {
  const a = turnInPlace(UQ7.end, Math.PI / 2, T10 + 0.25, T10 + 0.75, C1_HEIGHT);
  const b = turnInPlace(a.end, Math.PI - 0.0001, T10 + 0.78, T10 + 1.3, C1_HEIGHT);
  return { moves: chain(UQ7.end, C1_HEIGHT, [a, b]), end: b.end };
})();
// S11: the grip in the first 0.7 s, then half a step back (south) together
const T11 = SH.s11;
const BACK = 0.24;
const UQ11 = (() => {
  const to: V3 = [UQ10.end.root[0], 0, UQ10.end.root[2] + BACK];
  const a = walkSteps(UQ10.end, to, UQ10.end.yaw, 2, T11 + 0.95, T11 + 1.85, C1_HEIGHT);
  return { moves: chain(UQ10.end, C1_HEIGHT, [a]), end: a.end };
})();

/** Uq state in the shots staged here (S01, S07–S12); S02–S06 come from the pilot stage */
const uqS01 = (t: number) => {
  const rel0 = L("L2").start + 0.15, rel1 = rel0 + 0.45; // releases adik's hand during L2
  const pk0 = rel1 + 0.05, pk1 = pk0 + 0.4, up1 = pk1 + 0.45; // left hand to the pocket, phone out, to the side
  const turn0 = SH.s02 - 0.75; // starts turning toward the hallway (the cut lands mid-turn)
  const toHall = yawTo(C1_ROOM, [-0.95, 0, -1.0]);
  const tr = turnInPlace(stanceAt(C1_ROOM, FACE_WIN_C1, C1_HEIGHT), mix(FACE_WIN_C1, toHall, 0.5), turn0, SH.s02 + 0.2, C1_HEIGHT);
  const mv = movesAt(chain(stanceAt(C1_ROOM, FACE_WIN_C1, C1_HEIGHT), C1_HEIGHT, [tr]), t);
  const root = mv.root, yaw = mv.yaw;
  // right arm: holds adik (IK to the pair meeting point) → hangs
  const palms = pairPalms(1);
  const pairQ = ik(C1_ROOM, FACE_WIN_C1, "L", palms.uq);
  const qR = qLerp(pairQ, REST_R, ramp(t, rel0, rel1));
  const handR = handMix(HAND_PAIR, HAND_REST, ramp(t, rel0, rel1));
  // left arm: hanging → pocket → carries the phone at the side
  const pocketQ = ik(root, yaw, "R", toWorld(root, yaw, POCKET_LOCAL));
  let qL: Q3 = REST_R.map((v, i) => (i === 0 ? v : v)) as Q3;
  qL = qLerp(REST_R, pocketQ, ramp(t, pk0, pk1));
  if (t > pk1) qL = qLerp(pocketQ, SIDE_Q, ramp(t, pk1, up1));
  const handL = handMix(HAND_REST, HAND_G2, ramp(t, pk0 + 0.2, pk1));
  const phone = t >= pk1 - 0.05 ? qPhone(PHONE_SIDE(root, yaw, qL)) : null;
  const look = ramp(t, turn0 - 0.5, turn0 + 0.2);
  const char: CharS = {
    who: "uq", root, yaw, height: C1_HEIGHT, legPose: mv.legPose,
    pose: { armL: [qR[0], qR[1]], armLFwd: qR[2], armR: [qL[0], qL[1]], armRFwd: qL[2], headYaw: 20 * ramp(t, (SH.s01 ?? 0) + 0.6, (SH.s01 ?? 0) + 1.6) * (1 - look) + 55 * look, headNod: -4 * look },
    hands: { L: handR, R: handL },
    face: { eyes: "open", brows: "worried", mouth: "flat", look: 0.3 * look },
  };
  return { char, phone };
};

/** Uq from the end of the pilot (S07) to the end (S12) */
const uqLate = (t: number) => {
  // which moves apply
  const shot = shotAt(t);
  let mv = movesAt(UQ7.moves, t);
  if (t >= T10) mv = movesAt(UQ10.moves, t);
  if (t >= T11) mv = movesAt(UQ11.moves, t);
  let root = mv.root, yaw = mv.yaw;
  let legPose: CharS["legPose"] = mv.legPose;
  // left arm: pilot end pose (phone in front, after the torch went off) → side carry for the walk → front again (S08–S09)
  const qEnd: Q3 = [pilotEnd.char.pose.armR![0], pilotEnd.char.pose.armR![1], pilotEnd.char.pose.armRFwd ?? 0];
  const lower = ramp(t, T7 + 0.2, T7 + 0.9);
  const raise = ramp(t, SH.s08 + 0.35, SH.s08 + 1.0) * (1 - ramp(t, T10 + 0.1, T10 + 0.8));
  let qL: Q3 = qLerp(qEnd, SIDE_Q, lower);
  const qFront = ik(root, yaw, "R", toWorld(root, yaw, READ_LOCAL));
  if (raise > 0) qL = qLerp(SIDE_Q, qFront, raise);
  let handL = handMix(pilotEnd.char.hands?.R ?? HAND_FRONT, HAND_G2, lower);
  if (raise > 0) handL = handMix(HAND_G2, HAND_FRONT, raise);
  let local = localMix(PH_END_LOCAL, PH_SIDE_LOCAL, lower);
  if (raise > 0) local = localMix(PH_SIDE_LOCAL, PH_FRONT_LOCAL, raise);
  let phone = phoneFromHand(local, root, yaw, qL, handL);
  // vibration (S08, before the raise): ±2 mm at 18 Hz while buzzing (pure function of t)
  // on the two buzzes of the vibration SFX (plan "vib", Smartphone #2: 0.52 s each)
  const buzz = VIB.some((b) => t >= b && t < b + 0.52) ? 0.002 * Math.sin(t * 2 * Math.PI * 18) : 0;
  phone = { ...phone, p: [phone.p[0] + buzz, phone.p[1], phone.p[2]] };
  // right arm: hangs; S11 reaches to adik's hand (meeting point) and holds through the step back
  let qR: Q3 = REST_R;
  let handR: C1Hand = HAND_REST;
  const grip = gripAt(t);
  if (t >= T11 - 0.2) {
    const m = meetAt(t);
    const reachQ = ik(root, yaw, "L", m.uq);
    qR = qLerp(REST_R, reachQ, ramp(t, T11 - 0.1, T11 + 0.45));
    handR = handMix(HAND_REST, HAND_PAIR, grip);
  }
  // S12: the ellipsis to the living room (Episode 1's A17 pair)
  if (shot === "s12") {
    root = C1_ROOM;
    const lookA = l19Look(t);
    yaw = FACE_WIN_C1;
    legPose = undefined;
    const palms = pairPalms(1);
    qR = ik(C1_ROOM, FACE_WIN_C1, "L", palms.uq);
    handR = HAND_PAIR;
    qL = SIDE_Q;
    handL = HAND_G2;
    phone = qPhone(PHONE_SIDE(root, yaw, SIDE_Q));
    return {
      char: {
        who: "uq", root, yaw, height: C1_HEIGHT, legPose, hands: { L: handR, R: handL },
        // clause A: toward the front door (his right); clause B "…bersama adikmu": down at adik (behind-right of him).
        // (+35 on B, carried over from Ep 1 A17's look at the hallway, turned him AWAY from her: 150°)
        pose: { armL: [qR[0], qR[1]], armLFwd: qR[2], armR: [qL[0], qL[1]], armRFwd: qL[2], headYaw: -55 * lookA.a - 40 * lookA.b, headNod: -3 + 23 * lookA.b },
        face: { eyes: "open", brows: "worried", mouth: "flat", look: -0.6 * lookA.a - 0.6 * lookA.b },
      } as CharS,
      phone, glow: 0,
    };
  }
  // head and face
  const upGlass = ramp(t, T7 + 0.4, T7 + 1.1) * (1 - ramp(t, L10.end - 0.1, L10.end + 0.5));
  const toFront = ramp(t, L14.end - 0.3, L14.end + 0.5) * (1 - ramp(t, T10 - 0.1, T10 + 0.3)); // S09: looks toward the front
  const toDoor = t >= T10 ? 1 : 0;
  const screen = raise;
  const face: C1Face = t >= T10 - 0.05
    ? { eyes: "open", brows: "raised", mouth: t >= KNOCKS[0] && t < T11 + 1.0 ? "open" : "flat" }
    : { eyes: "open", brows: "worried", mouth: "flat", look: 0.5 * toFront };
  void toDoor;
  const char: CharS = {
    who: "uq", root, yaw, height: C1_HEIGHT, legPose, hands: { L: handR, R: handL },
    pose: {
      armL: [qR[0], qR[1]], armLFwd: qR[2], armR: [qL[0], qL[1]], armRFwd: qL[2],
      headNod: -22 * upGlass + 14 * screen * (1 - toFront) - 4 * (t >= T11 ? 1 : 0),
      headYaw: -35 * toFront, // the front door is SSW of him = toward his right (+ = own left); screen left in S09
    },
    face,
  };
  return { char, phone, glow: screen * (t < T10 ? 1 : 0) };
};

/** the phone in the left hand, local to the hand frame: at the pilot's end (front, torch off), carried at the side (g2),
 * held up in front of the chest (S08–S09); blended in the hand's frame, so it never leaves the hand */
const PH_END_LOCAL = (() => {
  const c = pilotEnd.char;
  const q: Q3 = [c.pose.armR![0], c.pose.armR![1], c.pose.armRFwd ?? 0];
  return phoneToHand(pilotEnd.phone, c.root, c.yaw, q, c.hands?.R ?? HAND_FRONT);
})();
const PH_SIDE_LOCAL = phoneToHand(qPhone(PHONE_SIDE(UQ_MOUTH, SOUTH, SIDE_Q)), UQ_MOUTH, SOUTH, SIDE_Q, HAND_G2);
const PH_FRONT_LOCAL = (() => {
  const q = ik(UQ_MOUTH, SOUTH, "R", toWorld(UQ_MOUTH, SOUTH, READ_LOCAL));
  return phoneToHand(PHONE_FRONT(UQ_MOUTH, SOUTH, q, HAND_FRONT), UQ_MOUTH, SOUTH, q, HAND_FRONT);
})();

/** the grip in S11 (0 → 1 in the first 0.7 s) */
const gripAt = (t: number) => ramp(t, T11 + 0.35, T11 + 0.7);
/** the meeting point of Uq's right hand and adik's left hand in S11 (follows the two roots during the step back) */
const meetAt = (t: number) => {
  const u = movesAt(UQ11.moves, t).root, a = movesAt(ADIK11.moves, t).root;
  const m: V3 = [mix(u[0], a[0], 0.62), 0.74, mix(u[2], a[2], 0.62)]; // nearer her (shorter arm), clear of his body
  const toU = new THREE.Vector3(u[0] - m[0], 0, u[2] - m[2]).normalize();
  return { m, uq: [m[0] + toU.x * 0.018, m[1] + 0.01, m[2] + toU.z * 0.018] as V3, adik: [m[0] - toU.x * 0.018, m[1] - 0.005, m[2] - toU.z * 0.018] as V3 };
};
/** S12: head look at the window/front door on clause A ("…pintu depan… siapa di sana,"), at adik on clause B */
const l19Look = (t: number) => {
  const b = L19.bursts && L19.bursts.length > 1 ? L19.bursts[1][0] : L19.start + (L19.end - L19.start) * 0.62;
  return {
    a: ramp(t, L19.start + 0.4, L19.start + 1.1) * (1 - ramp(t, b - 0.25, b + 0.3)),
    b: ramp(t, b, b + 0.7) * (1 - ramp(t, L19.end + 0.6, L19.end + 1.4)),
    atau: b,
  };
};

// ------------------------------------------------------------------ adik
const AD_PILOT_START = P.adikAt(0);
const AD_PILOT_END = P.adikAt(PEND_F / FPS - 1e-6);
const JAMB_Q: Q3 = [AD_PILOT_START.pose.armL![0], AD_PILOT_START.pose.armL![1], AD_PILOT_START.pose.armLFwd ?? 0];
const REST_L_AD: Q3 = [ADIK_REST.armL![0], ADIK_REST.armL![1], ADIK_REST.armLFwd ?? 0]; // jacket arm
const REST_R_AD: Q3 = [ADIK_REST.armR![0], ADIK_REST.armR![1], ADIK_REST.armRFwd ?? 0];
// S02: she follows two steps from the living room and stops at the hallway mouth (pilot position), right hand to jamb
const ADIK_GAIT: Gait = { height: ADIK_HEIGHT, stride: 0.55, phase: 0.3, swing: 6, lift: 0.025 };
const AD_S02_FROM: V3 = [P.ADIK_AT[0], 0, 1.3];
const AD_S02_T0 = SH.s02 + 0.45, AD_S02_T1 = OFF - 0.55;
const AD_WALK: WalkPlan = (() => {
  // speed such that she comes to rest exactly on ADIK_AT at AD_S02_T1 (bisection, as the pilot's walkTo)
  const D = Math.hypot(P.ADIK_AT[0] - AD_S02_FROM[0], P.ADIK_AT[2] - AD_S02_FROM[2]);
  const base = (speed: number): WalkPlan => ({ t0: AD_S02_T0, from: AD_S02_FROM, yaw: NORTH, speed, tStop: AD_S02_T1, decel: 0.5 });
  let lo = 0.05, hi = 3;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (walkState(ADIK_GAIT, base(m), AD_S02_T1 + 3).d < D) lo = m;
    else hi = m;
  }
  return base((lo + hi) / 2);
})();
// S07: lowers the pointing arm, lets go of the jamb, steps west and turns to face south (beside Uq, on his right)
const AD_P_END: Stance = stanceAt(AD_PILOT_END.root, AD_PILOT_END.yaw, ADIK_HEIGHT);
const ADIK7 = (() => {
  const a = walkSteps(AD_P_END, ADIK_MOUTH, SOUTH, 3, L12.start - 0.1, L12.end + 0.25, ADIK_HEIGHT);
  return { moves: chain(AD_P_END, ADIK_HEIGHT, [a], 0.025), end: a.end, t0: L12.start - 0.1 };
})();
// S08: turns toward Uq (to read with him / look up at him in S09)
const ADIK8 = (() => {
  const a = turnInPlace(ADIK7.end, yawTo(ADIK_MOUTH, UQ_MOUTH), SH.s08 + 0.1, SH.s08 + 0.8, ADIK_HEIGHT);
  return { moves: chain(ADIK7.end, ADIK_HEIGHT, [a], 0.025), end: a.end };
})();
// S10 (off screen): turns north and moves to Uq's right-behind
const ADIK10 = (() => {
  const a = walkSteps(ADIK8.end, ADIK_BEHIND, Math.PI - 0.0001, 4, T10 + 0.6, T10 + 2.2, ADIK_HEIGHT);
  return { moves: chain(ADIK8.end, ADIK_HEIGHT, [a], 0.025), end: a.end };
})();
// S11: half a step back with Uq
const ADIK11 = (() => {
  const to: V3 = [ADIK10.end.root[0], 0, ADIK10.end.root[2] + BACK];
  const a = walkSteps(ADIK10.end, to, ADIK10.end.yaw, 2, T11 + 1.0, T11 + 1.9, ADIK_HEIGHT);
  return { moves: chain(ADIK10.end, ADIK_HEIGHT, [a], 0.025), end: a.end };
})();

const adikS01 = (t: number): CharS => {
  const rel0 = L("L2").start + 0.15, rel1 = rel0 + 0.45;
  const palms = pairPalms(1);
  const pairQ = ik(ADIK_ROOM, FACE_WIN_ADIK, "R", palms.adik, ADIK_HEIGHT);
  const q = qLerp(pairQ, REST_R_AD, ramp(t, rel0 + 0.05, rel1 + 0.1));
  const toUq = ramp(t, rel0, rel1 + 0.3);
  return {
    who: "adik", root: ADIK_ROOM, yaw: FACE_WIN_ADIK, height: ADIK_HEIGHT,
    // she watches Uq as he lets go (he is on her LEFT: + = own left; -30 in the first draft turned her away, 80° off)
    pose: { ...ADIK_REST, armR: [q[0], q[1]], armRFwd: q[2], headYaw: 15 * (1 - toUq) + 45 * toUq, headNod: -6 - 6 * toUq },
    face: { eyes: "open", brows: "worried", mouth: "flat" },
  };
};
const adikS02 = (t: number): CharS => {
  const w = walkState(ADIK_GAIT, AD_WALK, t);
  const grab = ramp(t, AD_S02_T1 - 0.1, OFF - 0.05);
  const qL = qLerp(REST_L_AD, JAMB_Q, grab);
  const talking = t >= L("L4").start && t < L("L4").end && (t * 2) % 1 < 0.6;
  return {
    who: "adik", root: w.position as V3, yaw: w.yaw, height: ADIK_HEIGHT, legPose: w.legPose,
    pose: { ...ADIK_REST, armL: [qL[0], qL[1]], armLFwd: qL[2], armR: [REST_R_AD[0] + w.pose.armR[0] - 6, REST_R_AD[1]], armRFwd: REST_R_AD[2], headNod: -6, headYaw: 0 },
    face: { eyes: "open", brows: "worried", mouth: talking ? "open" : "soft" },
  };
};
const adikLate = (t: number): CharS => {
  const shot = shotAt(t);
  if (shot === "s12") {
    const palms = pairPalms(1);
    const q = ik(ADIK_ROOM, FACE_WIN_ADIK, "R", palms.adik, ADIK_HEIGHT);
    return { who: "adik", root: ADIK_ROOM, yaw: FACE_WIN_ADIK, height: ADIK_HEIGHT, pose: { ...ADIK_REST, armR: [q[0], q[1]], armRFwd: q[2], headYaw: 15, headNod: -8 }, face: { eyes: "open", brows: "worried", mouth: "flat" } };
  }
  let mv = movesAt(ADIK7.moves, t);
  if (t >= SH.s08) mv = movesAt(ADIK8.moves, t);
  if (t >= T10) mv = movesAt(ADIK10.moves, t);
  if (t >= T11) mv = movesAt(ADIK11.moves, t);
  const moving = t >= ADIK7.t0;
  // arms: pointing (pilot end) → down; right hand off the jamb (jacket arm) when she moves; S11 left hand to Uq's hand
  const qPointEnd: Q3 = [AD_PILOT_END.pose.armR![0], AD_PILOT_END.pose.armR![1], AD_PILOT_END.pose.armRFwd ?? 0];
  let qR = qLerp(qPointEnd, REST_R_AD, ramp(t, T7 + 0.1, T7 + 0.8));
  const qJ: Q3 = [AD_PILOT_END.pose.armL![0], AD_PILOT_END.pose.armL![1], AD_PILOT_END.pose.armLFwd ?? 0];
  const qL = qLerp(qJ, REST_L_AD, ramp(t, ADIK7.t0 + 0.5, ADIK7.t0 + 1.0)); // lets go as her body steps west (an earlier release swept the forearm through the wall end, -3.3 cm)
  void moving;
  if (t >= T11 - 0.2) {
    const m = meetAt(t);
    qR = qLerp(REST_R_AD, ik(mv.root, mv.yaw, "R", m.adik, ADIK_HEIGHT), ramp(t, T11 - 0.1, T11 + 0.55));
  }
  // head: looks at Uq while he comes back (L11), up at him in S09, at the door in S11
  const uq = uqLate(t).char;
  const toUq = yawTo(mv.root, uq.root) - mv.yaw;
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a)) / D2R;
  const look = Math.max(-60, Math.min(60, wrap(toUq)));
  const pointHead = 1 - ramp(t, T7 + 0.1, T7 + 0.9);
  const talking = [L11, L15].some((l) => t >= l.start && t < l.end) && (t * 2) % 1 < 0.6;
  return {
    who: "adik", root: mv.root, yaw: mv.yaw, height: ADIK_HEIGHT, legPose: mv.legPose,
    pose: { ...ADIK_REST, armL: [qL[0], qL[1]], armLFwd: qL[2], armR: [qR[0], qR[1]], armRFwd: qR[2],
      headYaw: (AD_PILOT_END.pose.headYaw ?? 0) * pointHead + (t >= T11 ? 0 : look * (1 - pointHead)), headNod: (AD_PILOT_END.pose.headNod ?? 0) * pointHead + (t >= SH.s09 && t < T10 ? -14 : -4) * (1 - pointHead) },
    face: { eyes: "open", brows: t >= SH.s09 ? "raised" : "worried", mouth: talking ? "open" : "soft" },
  };
};

// ------------------------------------------------------------------ cameras for the shots staged here
const CAM = {
  // S01: Episode 1's A17 lens P, looking at the pair; slow push (fov 54 → 48); lamp off, curtains closed
  // draft v2: starts on Episode 1's last framing exactly (A17 "centre": look y 1.0), so the recap freeze = Ep 1's end
  s01a: cam([0.75, 1.5, 2.55], [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 1.0, (C1_ROOM[2] + ADIK_ROOM[2]) / 2], 54),
  s01b: cam([0.7, 1.5, 2.5], [(C1_ROOM[0] + ADIK_ROOM[0]) / 2 + 0.05, 1.03, (C1_ROOM[2] + ADIK_ROOM[2]) / 2 - 0.05], 48),
  // S02: from the kitchen end of the hallway, facing south down it (west of the Uq–adik line, x -1.15)
  s02a: cam([-1.15, 1.35, -4.75], [-0.85, 1.1, 0.5], 50),
  s02b: cam([-1.15, 1.35, -4.7], [-0.85, 1.15, 0.0], 48),
  // S07: the S03 axis (living room behind adik, D-040), tilted up to the now-dark glass on L10, then down to Uq
  s07glass: cam([-1.08, 1.93, 2.6], [-0.8, 2.15, -4.9], 30),
  s07down: cam([-1.08, 1.75, 2.55], [-0.85, 1.25, -2.2], 40),
  // S08: insert over Uq's right shoulder (north-west of him, above), looking down at the phone
  // S09: two-shot from the living room, south-east of the pair, facing north-west, long lens
  s09: cam([0.2, 1.3, 1.6], [(UQ_MOUTH[0] + ADIK_MOUTH[0]) / 2 + 0.05, 1.12, (UQ_MOUTH[2] + ADIK_MOUTH[2]) / 2], 36),
  // S10: POV down the hallway to the back door (Episode 1 A16b), push on the third knock
  s10a: cam([-0.8, 1.5, -0.4], [-0.8, 1.15, -5.0], 40),
  s10b: cam([-0.8, 1.48, -1.55], [-0.8, 1.15, -5.0], 38),
  // S11: from the hallway/kitchen side facing south at the pair (they look at the back door, toward the lens)
  s11: cam([-0.75, 1.35, -3.2], [-0.5, 1.05, -0.6], 44),
};
const S12_P: V3 = [0.75, 1.5, 2.55];
const s12Cam = (t: number): Cam => {
  const mid: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 1.0, (C1_ROOM[2] + ADIK_ROOM[2]) / 2];
  const centre = cam(S12_P, mid, 54);
  const door = cam(S12_P, [-2.1, 1.15, 2.7], 54); // the front door and the curtained window (screen left)
  const lk = l19Look(t);
  const toDoor = ramp(t, L19.start + 0.2, L19.start + 1.4) * (1 - ramp(t, lk.atau - 0.6, lk.atau + 0.3));
  return camMix(centre, door, toDoor);
};

// ------------------------------------------------------------------ the stage
export type EStage = Stage & { eshot: EShotId; te: number; glow: number; doorShake: number; tamuLamp: number };
const knockShake = (t: number) => {
  for (const k of KNOCKS) if (t >= k && t < k + 2 / FPS) return 0.003 * (t < k + 1 / FPS ? 1 : -0.6);
  return 0;
};
export const episodeAt = (te: number): EStage => {
  // draft v2 recap: S01's first frame, frozen (the cut into motion is seamless)
  if (RECAP > 0 && te < SH.s01) return { ...episodeAt(SH.s01), eshot: "s00", te, t: te };
  const id = shotAt(te);
  const base = { eshot: id, te, glow: 0, doorShake: knockShake(te), tamuLamp: 0 };
  // the approved pilot block
  if (["s03", "s03i", "s04", "s05", "s06", "s06f", "s06d"].includes(id)) {
    const st = P.stageAt(tp(te));
    return { ...st, ...base, t: te };
  }
  const sp = SHOTS.find((s) => s.id === id)!;
  const u = clamp01((te - sp.start) / (sp.end - sp.start));
  if (id === "s01") {
    const uq = uqS01(te);
    return { ...base, t: te, ts: te, shot: "s03", cam: camMix(CAM.s01a, CAM.s01b, smooth(u)), focus: CAM.s01a.look, chars: [uq.char, adikS01(te)], phone: uq.phone ?? { p: [0, -10, 0], q: [0, 0, 0, 1] }, torch: null, bolt: 0, charK: 1, rimK: 0.6 };
  }
  if (id === "s02") {
    const p = P.uqAt(tp(te));
    return { ...base, t: te, ts: te, shot: "s03", cam: camMix(CAM.s02a, CAM.s02b, smooth(u)), focus: [-0.95, 1.2, mix(0.2, -2.2, u)], chars: [p.char, adikS02(te)], phone: p.phone, torch: null, bolt: 0, charK: 0.8, rimK: 0.6 };
  }
  const uq = uqLate(te);
  const adik = adikLate(te);
  const common = { ...base, t: te, ts: te, shot: "s03" as const, phone: uq.phone, torch: null, bolt: 1, glow: uq.glow };
  if (id === "s07") {
    const tilt = ramp(te, L10.end - 0.2, L10.end + 1.4);
    return { ...common, cam: camMix(CAM.s07glass, CAM.s07down, tilt), focus: tilt < 0.5 ? [-0.8, 2.1, -4.9] : [uq.char.root[0], 1.3, uq.char.root[2]], chars: [uq.char, adik], charK: 1, rimK: 0 };
  }
  if (id === "s08") {
    // in front of him and to his right (south-west, ~1 m; an insert, exempt from 2.2 m): the phone buzzing at his side,
    // the look follows the phone up as he raises it
    // then raised, the screen lighting his face; the screen itself is shown by the phone UI cut (Ep 1 A07 pattern).
    // (First version: over the shoulder at 0.45 m with blur 1.2 rendered black/blurred.)
    const r = uq.char.root;
    const up = ramp(te, SH.s08 + 0.35, SH.s08 + 1.0);
    const c = cam([r[0] - 0.42, 1.12, r[2] + 0.95], [r[0] + 0.03, mix(0.86, 1.0, up), r[2] + 0.12], 38);
    return { ...common, cam: c, focus: c.look, chars: [uq.char, adik], charK: 0.6, rimK: 0 };
  }
  if (id === "s09") return { ...common, cam: CAM.s09, focus: CAM.s09.look, chars: [uq.char, adik], charK: 0.5, rimK: 0 };
  if (id === "s10") {
    const push = clamp01((te - SH.s10) / (SH.s11 - SH.s10)); // v2: a slow continuous push over the whole shot
    return { ...common, cam: camMix(CAM.s10a, CAM.s10b, push), focus: [-0.8, 1.15, -5.0], chars: [], charK: 0.5, rimK: 0, glow: 0 };
  }
  if (id === "s11") return { ...common, cam: CAM.s11, focus: [-0.5, 1.1, -0.6], chars: [uq.char, adik], charK: 0.7, rimK: 0, glow: 0 };
  // s12
  return { ...common, cam: s12Cam(te), focus: [(C1_ROOM[0] + ADIK_ROOM[0]) / 2, 1.0, (C1_ROOM[2] + ADIK_ROOM[2]) / 2], chars: [uq.char, adik], charK: 1, rimK: 0.6, glow: 0 };
};
export { uqLate, adikLate, uqS01, adikS01, adikS02 };
