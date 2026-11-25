// Episode 3 (2026-11-004) — TEST CLIPS for the four motions never tested before (owner 2026-11-20, D-053):
//   mundur  : retreat ~1 m together, facing LED-1 (S10 0–3.0 s; storyboard 35.2–37.8 old = S10 +0.2..+2.8)
//   balik   : turn left to the hallway, hold (S11/S12 are POV), turn back to the front after L9
//             (t 0 = S10 +2.6; turn out = S10 +2.8..+3.5, turn back 1.1 s)
//   genggam : adik's LEFT hand takes Uq's RIGHT hand at a meeting point between them (S15 +0.2..+1.0)
//   tatap   : Uq looks into the lens ONCE for ~1 s at the end of L11 (63.85–64.85 s), from the S15 camera AT THAT TIME
// Lenses, positions and timings from storyboard v0.3 (content.md §11.0, §11.2 S10–S15, §11.8, §16.1) and the approved
// timing plan (episode004-plan-draft.json, §19.3). Pure functions of the clip time t (video-production §9).
// Feet: cast/stepper.ts (lifted steps; a planted foot never moves). Arms: c1ArmIK with avoidTorso, solved at KEY poses
// and interpolated in joint space (no per-frame solver jumps). S01/S02/S08a/S08/S09 (pilot v3, D-051/D-052) untouched.
import * as THREE from "three";
import { c1ArmIK, c1ArmTorsoDepth } from "../c1/bodyIk";
import { C1_BUILD, c1UpperMatrix } from "../c1/c1rig";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import { chain, movesAt, stanceAt, turnInPlace, walkSteps } from "../cast/stepper";
import type { Moves, Stance } from "../cast/stepper";
import { sideShuffle } from "./shuffle004";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { EP2_END, R1, S02 } from "./e004Poses";
import { ledWorld } from "./LookDev004";
import PLAN from "./episode004-plan-draft.json";

const UP = new THREE.Vector3(0, 1, 0);
export type Q = [number, number, number];
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const qlerp = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
/** piecewise joint path through key poses at times ts (smooth between consecutive keys) */
const qpath = (t: number, ts: number[], qs: Q[]): Q => {
  if (t <= ts[0]) return qs[0];
  for (let i = 1; i < ts.length; i++) if (t < ts[i]) return qlerp(qs[i - 1], qs[i], sm((t - ts[i - 1]) / (ts[i] - ts[i - 1])));
  return qs[qs.length - 1];
};
const R2D = 180 / Math.PI;
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const fwdV = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
/** the character's own LEFT (C1/Npc local +x) */
const leftV = (yaw: number) => new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
export const H_UQ = uqEnd.height, H_AD = adEnd.height;
export const REST_UQ: Q = [6, 8, 0];
export const REST_AD: Q = [10, -4, 0];
/** adik's own RIGHT arm (rig "L") carrying the jacket at the end of Ep 2 */
const adP = adEnd.pose as { armL: [number, number]; armLFwd: number };
export const JACKET_Q: Q = [adP.armL[0], adP.armL[1], adP.armLFwd];
const T_LED = ledWorld("T");
const P0: V3 = [0.75, 1.5, 2.55];

// ------------------------------------------------------------------ positions (storyboard v0.3)
export const U0: V3 = [uqEnd.root[0], 0, uqEnd.root[2]]; // end of Ep 2 = S02
export const A0: V3 = S02.adik.root; // S02: 0.25 m further than Ep 2 (D-049)
export const U1: V3 = R1.uq;
export const A1_SB: V3 = R1.adik; // storyboard R1 (adik steps 0.25 m closer during the retreat, §11.8 item 2)
export const YF_U = yawTo(U1, T_LED); // facing LED-1 (the "front")
// the turn: body yaw = the S11 POV look vector (R1 eye → (−0.6, 1.95, −3.6)); S12 POV look = R1 → (2.6, 1.75, −0.45)
const S11_LOOK: V3 = [-0.6, 0, -3.6], S12_LOOK: V3 = [2.6, 0, -0.45];
export const YH_U = yawTo([-1.55, 0, 1.0], S11_LOOK);
export const S12_HEAD_U = wrap(yawTo([-1.5, 0, 0.95], S12_LOOK) - YH_U) * R2D;
export const TURN_U = wrap(YH_U - YF_U) * R2D;

const PE = PLAN.events as unknown as Record<string, number | number[]>;
const PS = PLAN.shots as unknown as Record<string, number[]>;
export const TIMES = { s10: PS.S10[0], s15: PS.S15[0], s15dur: PS.S15[2], stare: PE.lens_stare as number[], l9end: (PE.L9 as number[])[1], s13end: PS.S13[1] };

/** the phone in Uq's left hand: Ep 2's last phone pose carried with his root/yaw (hand pose unchanged) */
const phoneAt = (root: V3, yaw: number) => {
  const p0 = new THREE.Vector3(...EP2_END.phone.p).sub(new THREE.Vector3(...uqEnd.root)).applyAxisAngle(UP, yaw - uqEnd.yaw);
  const q = new THREE.Quaternion().setFromAxisAngle(UP, yaw - uqEnd.yaw).multiply(new THREE.Quaternion(...EP2_END.phone.q));
  return { p: [root[0] + p0.x, p0.y, root[2] + p0.z] as V3, q: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
};
type Air = { L: number; R: number };
export type MChar = {
  who: "uq" | "adik"; root: V3; yaw: number; height: number; pose: Record<string, unknown>; legPose?: unknown; hands?: unknown; face: Record<string, unknown>;
  feet?: { L: V3; R: V3; air: Air };
};
export type MFrame = { cam: Cam; chars: MChar[]; phone: { p: V3; q: [number, number, number, number] }; meet?: V3; led: { T: number; D: number; L: number; K: number }; note: string;
  /** D-054: head-to-LED-1 angle the head clamp (±55°) could not reach, deg */
  diag?: { ledResU: number; ledResA: number } };
type MS = ReturnType<typeof movesAt>;
const still = (root: V3, yaw: number, h: number): MS => movesAt(chain(stanceAt(root, yaw, h), h, []), 0);
const uqC = (m: MS, armR: Q, head: { yaw: number; nod: number }, face: Record<string, unknown> = {}): MChar => ({
  who: "uq", root: m.root, yaw: m.yaw, height: H_UQ, legPose: m.legPose, hands: uqEnd.hands, feet: { L: m.feetWorld.L, R: m.feetWorld.R, air: m.air },
  pose: { ...(uqEnd.pose as object), armL: [armR[0], armR[1]], armLFwd: armR[2], headYaw: head.yaw, headNod: head.nod },
  face: { eyes: "open", brows: "worried", mouth: "flat", ...face },
});
const adC = (m: MS, armL: Q, jacket: Q, head: { yaw: number; nod: number }, face: Record<string, unknown> = {}): MChar => ({
  who: "adik", root: m.root, yaw: m.yaw, height: H_AD, legPose: m.legPose, feet: { L: m.feetWorld.L, R: m.feetWorld.R, air: m.air },
  pose: { ...(adEnd.pose as object), armR: [armL[0], armL[1]], armRFwd: armL[2], armL: [jacket[0], jacket[1]], armLFwd: jacket[2], headYaw: head.yaw, headNod: head.nod },
  face: { eyes: "open", brows: "raised", mouth: "flat", ...face },
});
const mid = (a: V3, b: V3, y: number): V3 => [(a[0] + b[0]) / 2, y, (a[2] + b[2]) / 2];
const S15_CAM = (u: number): Cam => ({ pos: lerp3(P0, [0.5, 1.48, 2.4], sm(u)), look: mid(U1, R1.adik, lerp(1.0, 1.02, sm(u))), fov: lerp(50, 42, sm(u)), roll: 0 });
const ik = (side: "L" | "R", root: V3, yaw: number, h: number, p: THREE.Vector3, ref: Q) =>
  c1ArmIK({ root, yaw, body: {}, side, target: [p.x, p.y, p.z], ref, height: h, avoidTorso: true, wMin: -60 });
/** Uq's right hand toward adik WITHOUT contact: 13 cm short of her left upper arm, a little in front, elbow height */
const reachToward = (u: MS, a: MS, gap = 0.13, y = 0.92): Q => {
  const her = new THREE.Vector3(...a.root).addScaledVector(leftV(a.yaw), 0.15).addScaledVector(fwdV(a.yaw), 0.06).setY(y);
  const from = new THREE.Vector3(u.root[0], y, u.root[2]);
  const dist = her.distanceTo(from);
  const tgt = from.clone().addScaledVector(her.clone().sub(from).normalize(), Math.max(0.2, dist - gap)).addScaledVector(fwdV(u.yaw), 0.05);
  const s = ik("L", u.root, u.yaw, H_UQ, tgt, [40, 30, 0]);
  return [s.arm[0], s.arm[1], s.fwd];
};

/** one smooth move A → B that bows through V at mid-way (no stop at V: lower peak speed than two segments) */
const qvia = (t: number, t0: number, t1: number, A: Q, V: Q, B: Q): Q => {
  const s = sm((t - t0) / (t1 - t0));
  const b = Math.sin(Math.PI * s);
  return [0, 1, 2].map((i) => lerp(A[i], B[i], s) + b * (V[i] - (A[i] + B[i]) / 2)) as Q;
};
const LAY = layoutOf(C1_BUILD);
const M0 = c1UpperMatrix({});
const handWorld = (q: Q, side: "L" | "R", root: V3, yaw: number, h: number) => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  return armChain(pose, side, LAY).H.applyMatrix4(M0).multiplyScalar(h).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
};
/** a hand moved along a world path: per-frame LOCAL IK continued from the previous frame (coordinate descent around the
 * last solution, torso always penalised). The whole table is computed once at module load from t0 forward, so every frame
 * is the same pure function of t in every tab (no state across frames at render time). */
const pathTable = (side: "L" | "R", root: V3, yaw: number, h: number, q0: Q, t0: number, t1: number, at: (s: number) => THREE.Vector3, qEnd: Q | null) => {
  const n = Math.ceil((t1 - t0) * 30);
  const out: Q[] = [];
  let q: Q = [...q0];
  for (let f = 0; f <= n; f++) {
    const s = sm(f / n);
    if (f === n && qEnd) { out.push(qEnd); break; }
    const T = at(s);
    const cost = (x: Q) => handWorld(x, side, root, yaw, h).distanceTo(T) + 4 * c1ArmTorsoDepth(x as never, side, h) + 0.0004 * (Math.abs(x[0] - q[0]) + Math.abs(x[1] - q[1]) + Math.abs(x[2] - q[2]));
    let best = q, bc = cost(q);
    for (const st of [4, 2, 1, 0.5]) for (let i = 0; i < 6; i++)
      for (const d of [[st, 0, 0], [-st, 0, 0], [0, st, 0], [0, -st, 0], [0, 0, st], [0, 0, -st]] as Q[]) {
        const x: Q = [best[0] + d[0], Math.max(-20, best[1] + d[1]), best[2] + d[2]];
        const c = cost(x);
        if (c < bc) { bc = c; best = x; }
      }
    q = best;
    out.push(q);
  }
  const last = qEnd ?? out[out.length - 1];
  const fn = (t: number): Q => (t <= t0 ? q0 : t >= t1 ? last : out[Math.min(out.length - 1, Math.round(((t - t0) / (t1 - t0)) * n))]);
  return Object.assign(fn, { last });
};
const bez = (a: THREE.Vector3, c: THREE.Vector3, b: THREE.Vector3, s: number) => a.clone().multiplyScalar((1 - s) * (1 - s)).addScaledVector(c, 2 * s * (1 - s)).addScaledVector(b, s * s);

export type Opts = { A1?: V3; tuck?: Q | null; away?: number; meetFwd?: number; meetLat?: number; meetY?: number; viaFwd?: number; herT?: [number, number]; hisT?: [number, number]; pathIK?: boolean; ctrlDown?: number; toHisHand?: Q;
  /** retreat OPTION (not storyboard): body yaw held (deg) so the walk is closer to straight backwards, head turned to LED-1 */
  retreat?: { yawU: number; yawA: number; nU: number; nA: number };
  /** D-054 (owner: retreat option (a)): body along the path, head to LED-1, initial turn spread over [0, turn0], the walk
   * [turn0, walkEnd], Uq's reach keyed at armT with a standoff `gap` (m), and the turn to the hallway in the SAME chain
   * (out = its duration, ending at S10 3.5 s). Clip "mundur" then covers S10 0–3.5 s and clip "balik" continues it. */
  s10?: { yawU: number; yawA: number; nU: number; nA: number; turn0: number; walkEnd: number; gap: number; armT: [number, number, number, number]; out: number };
  /** D-054 (owner: grip option (a)): hand insert at the start of S15. Insert lens perpendicular to the Uq–adik axis on the
   * front side; the two-shot (lens P, unchanged positions) then runs twoDur seconds from twoStart (episode time). */
  insert?: { dur: number; dist: number; h: number; fov: number; swing: number; lookDy: number; twoStart: number; twoDur: number; stare0: number;
    /** D-055: lens P push mapping u = (t_episode − camStart) / camDur (default: twoStart / twoDur, the D-054 behaviour) */
    camStart?: number; camDur?: number };
  /** D-055: start of the mutual look after the grip (default herT[1], the D-053/D-054 behaviour) */
  look0?: number;
  /** D-055 (owner: retreat option (c) after (b) failed): side step-close (src/ep004/shuffle004.ts) on the storyboard path,
   * body facing LED-1 at every key, walk [0.2, walkEnd] (adik 0.05 s earlier), then the same turn to the hallway as `s10`. */
  s10c?: { cycles: [number, number]; body: "pulse" | "glide"; gap: number; armT: [number, number, number, number]; walkEnd: number; out: number;
    /** D-056: height of the reach target (default 0.92 m, the D-053/D-055 value) */ reachY?: number;
    /** D-056: the S13 turn back (hallway → front), S10-relative times (default [5.0, 6.1] = the test clip "balik") */ backT?: [number, number] } };
/** the staging PROPOSED by the test (D-053, not an owner decision): adik turns with a 0.10 m step away from Uq; she
 * takes HIS resting hand (his arm only turns the hand out, [12, 8, 0]) over 1.25 s instead of the storyboard's 0.8 s */
export const PROPOSED: Opts = { away: 0.1, toHisHand: [12, 8, 0], viaFwd: 0.04, herT: [0.15, 1.4], hisT: [0.95, 1.4] };
export const buildClips = (o: Opts = {}) => {
  const A1 = o.A1 ?? A1_SB;
  const YF_A = yawTo(A1, T_LED);
  const YH_A = yawTo(A1, S11_LOOK);
  const tuck = o.tuck ?? null;
  const away = o.away ?? 0;

  // ---------------------------------------------------------------- A: mundur (S10 0–3.0 s), lens P fov 50 → 46
  const A_DUR = 3.0;
  const stU0 = stanceAt(U0, uqEnd.yaw, H_UQ), stA0 = stanceAt(A0, adEnd.yaw, H_AD);
  const rt = o.retreat;
  const D2R = Math.PI / 180;
  const stU0r = rt ? stanceAt(U0, rt.yawU * D2R, H_UQ) : stU0, stA0r = rt ? stanceAt(A0, rt.yawA * D2R, H_AD) : stA0;
  const UQ_A = rt
    ? chain(stU0, H_UQ, [turnInPlace(stU0, rt.yawU * D2R, 0.0, 0.25, H_UQ), walkSteps(stU0r, U1, rt.yawU * D2R, rt.nU, 0.25, 2.8, H_UQ)])
    : chain(stU0, H_UQ, [walkSteps(stU0, U1, YF_U, 3, 0.2, 2.8, H_UQ)]);
  const AD_A = rt
    ? chain(stA0, H_AD, [turnInPlace(stA0, rt.yawA * D2R, 0.0, 0.2, H_AD), walkSteps(stA0r, A1, rt.yawA * D2R, rt.nA, 0.2, 2.75, H_AD)])
    : chain(stA0, H_AD, [walkSteps(stA0, A1, YF_A, 4, 0.15, 2.75, H_AD)]);
  const headLED = (m: MS) => wrap(yawTo(m.root, T_LED) - m.yaw) * R2D;
  // he reaches toward her while she is still 0.6 m away, holds, and lowers the arm as she arrives at his side
  // (a reach held to the end folds the hand into his own belly at 0.41 m: tested, torso 8.4 cm)
  const keysA = [0.55, 1.1].map((t) => reachToward(movesAt(UQ_A, t), movesAt(AD_A, t)));
  const armA = (t: number) => qpath(t, [0.05, 0.55, 1.1, 2.0], [REST_UQ, ...keysA, REST_UQ]);
  const clipA = (t: number): MFrame => {
    const u = movesAt(UQ_A, t), a = movesAt(AD_A, t);
    const k = sm(t / 3.5);
    return {
      cam: { pos: lerp3(P0, [0.72, 1.5, 2.5], k), look: lerp3(mid(U0, A0, 1.0), mid(U1, A1, 1.05), k), fov: lerp(50, 46, k), roll: 0 },
      phone: phoneAt(u.root, u.yaw), led: { T: 1, D: 0, L: 0, K: 0 }, note: "mundur",
      chars: rt
        ? [uqC(u, armA(t), { yaw: Math.min(55, headLED(u)), nod: -6 }), adC(a, REST_AD, JACKET_Q, { yaw: Math.min(55, headLED(a)), nod: -12 })]
        : [uqC(u, armA(t), { yaw: -12, nod: -6 }), adC(a, REST_AD, JACKET_Q, { yaw: 12, nod: -12 })],
    };
  };

  // ---------------------------------------------------------------- B: balik (t 0 = S10 +2.6); hold = S11–S13 (POV, not drawn); back
  const B_DUR = 3.8;
  const stUF = stanceAt(U1, YF_U, H_UQ), stUH = stanceAt(U1, YH_U, H_UQ);
  const UQ_B = chain(stUF, H_UQ, [turnInPlace(stUF, YH_U, 0.2, 0.9, H_UQ), turnInPlace(stUH, YF_U, 2.4, 3.5, H_UQ)]);
  const awayV = new THREE.Vector3(A1[0] - U1[0], 0, A1[2] - U1[2]).normalize().multiplyScalar(away);
  const A1h: V3 = [A1[0] + awayV.x, 0, A1[2] + awayV.z];
  const stAF = stanceAt(A1, YF_A, H_AD);
  let AD_B: Moves;
  if (away > 0) {
    const out = walkSteps(stAF, A1h, YH_A, 2, 0.25, 0.95, H_AD);
    const back = walkSteps(out.end, A1, YF_A, 2, 2.45, 3.5, H_AD);
    AD_B = chain(stAF, H_AD, [out, back]);
  } else {
    const stAH = stanceAt(A1, YH_A, H_AD);
    AD_B = chain(stAF, H_AD, [turnInPlace(stAF, YH_A, 0.25, 0.95, H_AD), turnInPlace(stAH, YF_A, 2.45, 3.5, H_AD)]);
  }
  const jacketB = (t: number): Q => (tuck ? qlerp(JACKET_Q, tuck, ramp(t, 0.0, 0.2) * (1 - ramp(t, 3.5, 3.8))) : JACKET_Q);
  const clipB = (t: number): MFrame => {
    const u = movesAt(UQ_B, t), a = movesAt(AD_B, t);
    // head leads each turn by ≤ 25°; in S12 (POV) the heads turn right toward the bedroom door, back before the turn back
    const lead = 25 * (ramp(t, 0.05, 0.3) - ramp(t, 0.55, 0.9)) - 25 * (ramp(t, 2.25, 2.5) - ramp(t, 2.9, 3.5));
    const kamar = ramp(t, 1.1, 1.45) * (1 - ramp(t, 1.85, 2.2));
    return {
      cam: { pos: lerp3([0.72, 1.5, 2.5], [0.72, 1.5, 2.45], sm(t / B_DUR)), look: mid(U1, A1, 1.05), fov: 46, roll: 0 },
      phone: phoneAt(u.root, u.yaw), led: { T: 1, D: t > 1.0 ? 1 : 0, L: t > 1.0 ? 1 : 0, K: t > 1.0 ? 1 : 0 }, note: "balik",
      chars: [
        uqC(u, REST_UQ, { yaw: lead + S12_HEAD_U * 0.93 * kamar, nod: -4 }),
        adC(a, REST_AD, jacketB(t), { yaw: lead * 0.8 + S12_HEAD_U * 0.85 * kamar, nod: -8 }),
      ],
    };
  };

  // ---------------------------------------------------------------- C: genggam (t 0 = S15 start), lens P fov 50 → 42 (S15 push)
  const C_DUR = 2.2;
  const mU = still(U1, YF_U, H_UQ), mA = still(A1, YF_A, H_AD);
  const meetFwd = o.meetFwd ?? 0.1;
  const toU = new THREE.Vector3(U1[0] - A1[0], 0, U1[2] - A1[2]).normalize();
  const mc = new THREE.Vector3((U1[0] + A1[0]) / 2, o.meetY ?? 0.74, (U1[2] + A1[2]) / 2).addScaledVector(fwdV((YF_U + YF_A) / 2), meetFwd).addScaledVector(toU, -(o.meetLat ?? 0));
  const meetC = { c: [mc.x, mc.y, mc.z] as V3, uq: mc.clone().addScaledVector(toU, 0.018).add(new THREE.Vector3(0, 0.01, 0)), adik: mc.clone().addScaledVector(toU, -0.018).add(new THREE.Vector3(0, -0.005, 0)) };
  const gU = ik("L", U1, YF_U, H_UQ, meetC.uq, [10, 20, 0]);
  const gA = ik("R", A1, YF_A, H_AD, meetC.adik, [10, 20, 0]);
  const gripErr = { uq: gU.err, adik: gA.err };
  let QG_U: Q = [gU.arm[0], gU.arm[1], gU.fwd], QG_A: Q = [gA.arm[0], gA.arm[1], gA.fwd];
  // via poses: half-way hand positions pulled forward (keeps the forearm off the belly)
  const vf = o.viaFwd ?? 0.08;
  const handRest = (root: V3, yaw: number, h: number, side: "L" | "R") =>
    new THREE.Vector3(...root).addScaledVector(leftV(yaw), (side === "L" ? -1 : 1) * 0.2 * (h / 1.5)).setY(0.62 * (h / 1.5));
  const viaU = ik("L", U1, YF_U, H_UQ, handRest(U1, YF_U, H_UQ, "L").lerp(meetC.uq, 0.5).addScaledVector(fwdV(YF_U), vf), [20, 20, 0]);
  const viaA = ik("R", A1, YF_A, H_AD, handRest(A1, YF_A, H_AD, "R").lerp(meetC.adik, 0.5).addScaledVector(fwdV(YF_A), vf), [20, 20, 0]);
  const QV_U: Q = [viaU.arm[0], viaU.arm[1], viaU.fwd], QV_A: Q = [viaA.arm[0], viaA.arm[1], viaA.fwd];
  const herT = o.herT ?? [0.2, 1.0], hisT = o.hisT ?? [0.35, 1.0];
  let armCA = (t: number) => qvia(t, herT[0], herT[1], REST_AD, QV_A, QG_A); // her hand reaches first (S15 +0.2..+1.0)
  let armCU = (t: number) => qvia(t, hisT[0], hisT[1], REST_UQ, QV_U, QG_U); // his hand meets it
  if (o.pathIK) {
    // world hand paths: rest hand → meeting point, bowed forward by viaFwd (and down by ctrlDown)
    const rU = handWorld(REST_UQ, "L", U1, YF_U, H_UQ), rA = handWorld(REST_AD, "R", A1, YF_A, H_AD);
    const cU = rU.clone().lerp(meetC.uq, 0.5).addScaledVector(fwdV(YF_U), 2 * vf).add(new THREE.Vector3(0, -(o.ctrlDown ?? 0), 0));
    const cA = rA.clone().lerp(meetC.adik, 0.5).addScaledVector(fwdV(YF_A), 2 * vf).add(new THREE.Vector3(0, -(o.ctrlDown ?? 0), 0));
    // the path's own last solution is the grip pose (a global re-solve at the end would jump to another IK branch)
    const pu = pathTable("L", U1, YF_U, H_UQ, REST_UQ, hisT[0], hisT[1], (s) => bez(rU, cU, meetC.uq, s), null);
    const pa = pathTable("R", A1, YF_A, H_AD, REST_AD, herT[0], herT[1], (s) => bez(rA, cA, meetC.adik, s), null);
    armCU = pu; armCA = pa; QG_U = pu.last; QG_A = pa.last;
    gripErr.uq = handWorld(QG_U, "L", U1, YF_U, H_UQ).distanceTo(meetC.uq); gripErr.adik = handWorld(QG_A, "R", A1, YF_A, H_AD).distanceTo(meetC.adik);
  }
  if (o.toHisHand) {
    // she takes HIS hand where it hangs (storyboard: "tangan kiri adik menggenggam tangan kanan Uq"); his arm only
    // turns the hand out a little (toHisHand), her palm closes on it from her side
    QG_U = o.toHisHand;
    const hU = handWorld(QG_U, "L", U1, YF_U, H_UQ);
    const toA = new THREE.Vector3(A1[0] - U1[0], 0, A1[2] - U1[2]).normalize();
    const tA = hU.clone().addScaledVector(toA, 0.036).add(new THREE.Vector3(0, -0.01, 0));
    const g = ik("R", A1, YF_A, H_AD, tA, [10, 20, 0]);
    QG_A = [g.arm[0], g.arm[1], g.fwd];
    gripErr.uq = 0; gripErr.adik = g.err;
    meetC.c = [hU.x + toA.x * 0.018, hU.y, hU.z + toA.z * 0.018];
    const vA = ik("R", A1, YF_A, H_AD, handWorld(REST_AD, "R", A1, YF_A, H_AD).lerp(tA, 0.5).addScaledVector(fwdV(YF_A), vf), [20, 20, 0]);
    const QV: Q = [vA.arm[0], vA.arm[1], vA.fwd];
    armCA = (t: number) => qvia(t, herT[0], herT[1], REST_AD, QV, QG_A);
    armCU = (t: number) => qlerp(REST_UQ, QG_U, ramp(t, hisT[0], hisT[1]));
  }
  const clipC = (t: number): MFrame => {
    const l0 = o.look0 ?? herT[1];
    const look = ramp(t, l0, l0 + 0.5); // storyboard: they look at each other right after the grip
    return {
      cam: S15_CAM(t / TIMES.s15dur), phone: phoneAt(U1, YF_U), led: { T: 1, D: 1, L: 1, K: 1 }, note: "genggam", meet: meetC.c,
      chars: [uqC(mU, armCU(t), { yaw: -40 * look, nod: 4 * look }, { look: -0.4 * look }), adC(mA, armCA(t), JACKET_Q, { yaw: 35 * look, nod: -10 * look })],
    };
  };

  // ---------------------------------------------------------------- D: tatap (t 0 = stare − 0.4 s), camera = the S15 push at that time
  const D_DUR = 2.0;
  const D0 = TIMES.stare[0] - 0.4;
  const camD = (t: number) => S15_CAM((D0 + t - TIMES.s15) / TIMES.s15dur);
  const headAt = (c: Cam) => {
    const hc: V3 = [U1[0], 1.33, U1[2]];
    return { yaw: wrap(yawTo(U1, c.pos) - YF_U) * R2D, nod: -Math.atan2(c.pos[1] - hc[1], Math.hypot(c.pos[0] - hc[0], c.pos[2] - hc[2])) * R2D };
  };
  const PHONE_LOOK = { yaw: 22, nod: 24 }; // the glance at the phone on "membalas pesan itu" (storyboard S15) before the stare
  const clipD = (t: number): MFrame => {
    const c = camD(t);
    const k = ramp(t, 0.4, 0.7); // head to the lens, then held (no second look, D-048 item 10)
    const h = headAt(c);
    return {
      cam: c, phone: phoneAt(U1, YF_U), led: { T: 1, D: 1, L: 1, K: 1 }, note: "tatap", meet: meetC.c,
      chars: [
        uqC(mU, QG_U, { yaw: lerp(PHONE_LOOK.yaw, h.yaw, k), nod: lerp(PHONE_LOOK.nod, h.nod, k) }, { look: 0 }),
        adC(mA, QG_A, JACKET_Q, { yaw: 35, nod: -10 }),
      ],
    };
  };
  const D_HEAD = { start: headAt(camD(0.7)), end: headAt(camD(1.4)), camStart: camD(0.4).pos, camEnd: camD(1.4).pos };

  // ================================================================ D-054: owner option (a) for S10, hand insert for S15
  type Clip = { dur: number; at: (t: number) => MFrame };
  let mundur: Clip = { dur: A_DUR, at: clipA }, balik: Clip = { dur: B_DUR, at: clipB };
  const extra: Record<string, Clip> = {};
  let S10_INFO: Record<string, number> | null = null;
  const sc = o.s10c;
  const s10 = o.s10 ?? (sc ? { yawU: 0, yawA: 0, nU: 0, nA: 0, turn0: 0.2, walkEnd: sc.walkEnd, gap: sc.gap, armT: sc.armT, out: sc.out } : undefined);
  if (s10) {
    const yU = s10.yawU * D2R, yA = s10.yawA * D2R;
    const outT0 = 3.5 - s10.out, lag = 0.05;
    const noMove = (st: Stance) => ({ feet: [] as Moves["feet"], body: [] as Moves["body"], end: st });
    const faceLED = (r: V3) => yawTo(r, T_LED);
    // (a): turn in place, then walkSteps with the body along the path; (c, D-055): step-close facing LED-1
    const tU0 = sc ? noMove(stU0) : turnInPlace(stU0, yU, 0, s10.turn0, H_UQ), tA0 = sc ? noMove(stA0) : turnInPlace(stA0, yA, 0, s10.turn0, H_AD);
    const wU = sc ? sideShuffle(stU0, U1, faceLED, sc.cycles[0], 0.2, s10.walkEnd, H_UQ, sc.body) : walkSteps(tU0.end, U1, yU, s10.nU, s10.turn0, s10.walkEnd, H_UQ);
    const wA = sc ? sideShuffle(stA0, A1, faceLED, sc.cycles[1], 0.2, s10.walkEnd - 0.05, H_AD, sc.body) : walkSteps(tA0.end, A1, yA, s10.nA, s10.turn0, s10.walkEnd - 0.05, H_AD);
    const oU = turnInPlace(wU.end, YH_U, outT0, 3.5, H_UQ);
    const bT = sc?.backT ?? [5.0, 6.1];
    const bU = turnInPlace(oU.end, YF_U, bT[0], bT[1], H_UQ); // = clip "balik" 2.4–3.5 (S13 turn back, 1.1 s)
    let adOut: { feet: never[] | Moves["feet"]; body: Moves["body"] }[];
    if (away > 0) {
      const oA = walkSteps(wA.end, A1h, YH_A, 2, outT0 + lag, 3.5 + lag, H_AD);
      adOut = [oA, walkSteps(oA.end, A1, YF_A, 2, bT[0] + 0.05, bT[1], H_AD)];
    } else {
      const oA = turnInPlace(wA.end, YH_A, outT0 + lag, 3.5 + lag, H_AD);
      adOut = [oA, turnInPlace(oA.end, YF_A, bT[0] + 0.05, bT[1], H_AD)];
    }
    const UQ_S = chain(stU0, H_UQ, [tU0, wU, oU, bU]);
    const AD_S = chain(stA0, H_AD, [tA0, wA, ...adOut]);
    const LIM = 55;
    const ledRel = (m: MS) => wrap(yawTo(m.root, T_LED) - m.yaw) * R2D;
    const ledNod = (m: MS, hy: number) => Math.max(-25, -Math.atan2(T_LED[1] - hy, Math.hypot(T_LED[0] - m.root[0], T_LED[2] - m.root[2])) * R2D);
    const clampH = (x: number) => Math.max(-LIM, Math.min(LIM, x));
    const h0U = clampH(ledRel(movesAt(UQ_S, outT0))), h0A = clampH(ledRel(movesAt(AD_S, outT0 + lag)));
    // head on LED-1 during the retreat; over the turn to the hallway the head offset blends to 0 (body catches up)
    const headS = (m: MS, ts: number, h0: number, t0: number) => (ts <= t0 ? clampH(ledRel(m)) : h0 * (1 - ramp(ts, t0 + 0.3 * s10.out, t0 + s10.out)));
    const nodS = (m: MS, ts: number, hy: number, t0: number) => lerp(ledNod(m, hy), -4, ramp(ts, t0, t0 + s10.out));
    const keys = [s10.armT[1], s10.armT[2]].map((t) => reachToward(movesAt(UQ_S, t), movesAt(AD_S, t), s10.gap, sc?.reachY ?? 0.92));
    const armS = (t: number) => qpath(t, s10.armT, [REST_UQ, ...keys, REST_UQ]);
    const res = (m: MS) => Math.max(0, Math.abs(ledRel(m)) - LIM);
    const frameS = (ts: number, cam: Cam, led: MFrame["led"], note: string, extraHead: (ts: number) => { u: number; a: number }): MFrame => {
      const u = movesAt(UQ_S, ts), a = movesAt(AD_S, ts);
      const x = extraHead(ts);
      return {
        cam, phone: phoneAt(u.root, u.yaw), led, note,
        diag: ts <= outT0 ? { ledResU: res(u), ledResA: res(a) } : undefined,
        chars: [
          uqC(u, armS(ts), { yaw: headS(u, ts, h0U, outT0) + x.u, nod: nodS(u, ts, 1.33, outT0) }),
          adC(a, REST_AD, JACKET_Q, { yaw: headS(a, ts, h0A, outT0 + lag) + x.a, nod: nodS(a, ts, 1.12, outT0 + lag) }),
        ],
      };
    };
    mundur = {
      dur: 3.5,
      at: (t) => {
        const k = sm(t / 3.5);
        return frameS(t, { pos: lerp3(P0, [0.72, 1.5, 2.5], k), look: lerp3(mid(U0, A0, 1.0), mid(U1, A1, 1.05), k), fov: lerp(50, 46, k), roll: 0 }, { T: 1, D: 0, L: 0, K: 0 }, "mundur-a", () => ({ u: 0, a: 0 }));
      },
    };
    balik = {
      dur: B_DUR,
      at: (t) => {
        const kamar = ramp(t, 1.1, 1.45) * (1 - ramp(t, 1.85, 2.2));
        const back = -25 * (ramp(t, 2.25, 2.5) - ramp(t, 2.9, 3.5));
        return frameS(t + 2.6, { pos: lerp3([0.72, 1.5, 2.5], [0.72, 1.5, 2.45], sm(t / B_DUR)), look: mid(U1, A1, 1.05), fov: 46, roll: 0 },
          { T: 1, D: t > 1.0 ? 1 : 0, L: t > 1.0 ? 1 : 0, K: t > 1.0 ? 1 : 0 }, "balik-a",
          () => ({ u: back + S12_HEAD_U * 0.93 * kamar, a: back * 0.8 + S12_HEAD_U * 0.85 * kamar }));
      },
    };
    const end = movesAt(UQ_S, s10.walkEnd);
    S10_INFO = { yawUend: end.yaw * R2D, outT0, speedU: Math.hypot(U1[0] - U0[0], U1[2] - U0[2]) / (s10.walkEnd - s10.turn0), speedA: Math.hypot(A1[0] - A0[0], A1[2] - A0[2]) / (s10.walkEnd - 0.05 - s10.turn0), h0U, h0A };
  }
  let INSERT_INFO: { cam: Cam; meet: V3 } | null = null;
  const ins = o.insert;
  if (ins) {
    // insert lens: on the FRONT side of the Uq–adik axis (180° line kept: adik stays screen-left), roughly perpendicular
    // to it so the gap between the bodies shows; low, looking at the meeting point
    const m = new THREE.Vector3(...meetC.c);
    const ax = new THREE.Vector3(A1[0] - U1[0], 0, A1[2] - U1[2]).normalize();
    let n = new THREE.Vector3(-ax.z, 0, ax.x);
    if (n.dot(fwdV((YF_U + YF_A) / 2)) < 0) n.negate();
    n = n.applyAxisAngle(UP, ins.swing * D2R);
    const cam: Cam = { pos: [m.x + n.x * ins.dist, ins.h, m.z + n.z * ins.dist], look: [m.x, m.y + ins.lookDy, m.z], fov: ins.fov, roll: 0 };
    INSERT_INFO = { cam, meet: meetC.c };
    extra.insert = { dur: ins.dur, at: (t) => ({ ...clipC(t), cam, note: "genggam-insert" }) };
    // the two-shot after the cut: the motion continues (match on action), lens P with the new time mapping
    const cS = ins.camStart ?? ins.twoStart, cD = ins.camDur ?? ins.twoDur;
    extra.dua = { dur: 2.0, at: (t) => ({ ...clipC(ins.dur + t), cam: S15_CAM((ins.twoStart + t - cS) / cD), note: "genggam-dua" }) };
    const D0b = ins.stare0 - 0.4;
    const camD2 = (t: number) => S15_CAM((D0b + t - cS) / cD);
    extra.tatap2 = {
      dur: D_DUR,
      at: (t) => {
        const c = camD2(t);
        const k = ramp(t, 0.4, 0.7);
        const h = headAt(c);
        return { ...clipD(t), cam: c, chars: [uqC(mU, QG_U, { yaw: lerp(PHONE_LOOK.yaw, h.yaw, k), nod: lerp(PHONE_LOOK.nod, h.nod, k) }, { look: 0 }), adC(mA, QG_A, JACKET_Q, { yaw: 35, nod: -10 })], note: "tatap2" };
      },
    };
    Object.assign(D_HEAD as Record<string, unknown>, { start2: headAt(camD2(0.7)), end2: headAt(camD2(1.4)), cam2Start: camD2(0.4).pos, cam2End: camD2(1.4).pos });
  }

  return {
    S10_INFO, INSERT_INFO,
    CLIPS: { mundur, balik, genggam: { dur: C_DUR, at: clipC }, tatap: { dur: D_DUR, at: clipD }, ...extra } as Record<"mundur" | "balik" | "genggam" | "tatap", Clip> & Record<string, Clip>,
    GRIP: { uq: { ...gU, err: gripErr.uq }, adik: { ...gA, err: gripErr.adik }, viaU, viaA, meet: meetC }, D_HEAD, A1, A1h, YF_A, YH_A,
  };
};
export type Clips = ReturnType<typeof buildClips>;
export type ClipId = keyof Clips["CLIPS"];
