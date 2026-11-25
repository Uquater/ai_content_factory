// Episode 4 (2026-11-005) opening ANIMATIC clip (owner 2026-11-23): from the end position of Episode 3 to the toa line
// "Kalian memilih menutupnya." Adik takes the jacket off her right forearm and drops it on the sofa; Uq fetches the
// standing fan (Ep 1-3 set piece at FAN_POS), carries it under the south-east ceiling corner, lifts it overhead and presses
// its head (with a cloth draped over it) onto hidden camera T; the cloth stays hanging on the housing when the fan is
// lowered. Everything is a pure function of the world time t (video-production §9). The fan hangs on the ACTUAL forward-
// kinematics hand of Uq (grip slides along the pole), so hand and fan can never drift apart. Feet: cast/stepper.ts.
// Numbers: tools/m005_check.ts. Not an episode render: no captions of the story, no real audio.
import * as THREE from "three";
import { c1ArmIK, c1ArmTorsoDepth } from "../c1/bodyIk";
import { C1_BUILD, c1UpperMatrix } from "../c1/c1rig";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import { chain, movesAt, stanceAt, turnInPlace, walkSteps } from "../cast/stepper";
import type { Moves } from "../cast/stepper";
import type { V3 } from "../inkbeat/types";
import { EP2_END } from "../ep004/e004Poses";
import { CAMS, ledWorld, lensWorld } from "../ep004/LookDev004";
import { A1_SB, H_AD, H_UQ, JACKET_Q, REST_AD, REST_UQ, U1 } from "../ep004/motion004";
import { FAN_POS } from "../ep002/sets";

export type Q = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const qlerp = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
export const qpath = (t: number, ts: number[], qs: Q[]): Q => {
  if (t <= ts[0]) return qs[0];
  for (let i = 1; i < ts.length; i++) if (t < ts[i]) return qlerp(qs[i - 1], qs[i], sm((t - ts[i - 1]) / (ts[i] - ts[i - 1])));
  return qs[qs.length - 1];
};
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const fwdV = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
/** the character's own RIGHT (C1/Npc local -x) */
const rightV = (yaw: number) => new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));
const V = (v: THREE.Vector3): V3 => [v.x, v.y, v.z];

const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
const LAY = layoutOf(C1_BUILD);
const M0 = c1UpperMatrix({});
/** forward kinematics: world position of the palm of the rig arm `side` ("L" = the character's own right) */
export const handWorld = (q: Q, side: "L" | "R", root: V3, yaw: number, h: number) => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  return armChain(pose, side, LAY).H.applyMatrix4(M0).multiplyScalar(h).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
};
export const shoulderWorld = (side: "L" | "R", root: V3, yaw: number, h: number) =>
  armChain(side === "L" ? { armL: [0, 0], armLFwd: 0 } : { armR: [0, 0], armRFwd: 0 }, side, LAY).S.clone().applyMatrix4(M0).multiplyScalar(h).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
const ik = (side: "L" | "R", root: V3, yaw: number, h: number, target: THREE.Vector3, ref: Q): { q: Q; err: number } => {
  const s = c1ArmIK({ root, yaw, body: {}, side, target: [target.x, target.y, target.z], ref, height: h, avoidTorso: true, wMin: -60 });
  return { q: [s.arm[0], s.arm[1], s.fwd], err: s.err };
};
const relPt = (root: V3, yaw: number, r: number, f: number, y: number) => new THREE.Vector3(...root).addScaledVector(rightV(yaw), r).addScaledVector(fwdV(yaw), f).setY(y);

// ------------------------------------------------------------------ fixed numbers (one place)
export const T_LED = ledWorld("T");
export const LENS_T = lensWorld("T");
export const CAM_T_BODY: V3 = CAMS.T.c;
export const YF_U = yawTo(U1, T_LED);
export const YF_A = yawTo(A1_SB, T_LED);
export const FAN_LEN = { grip0: 0.85, headY: 1.15, headR: 0.22, headTop: 1.37, baseR: 0.2 };
/** sofa: x -3.3..-1.5, front edge z -0.175, seat top ≈ 0.52 (geo.ts TAMU.sofa, sets.tsx Sofa) */
export const SOFA_DROP: V3 = [-2.05, 0.66, -0.14];
export const SOFA_SPOT: V3 = [-2.0, 0, 0.06];
export const JACKET_ON_SOFA: V3 = [-2.15, 0.535, -0.42];

/** world time of each event (s) — shared by the check tool and the composition */
export const EV = {
  adTurn: [0.0, 0.45], adWalk: [0.45, 1.45], jacketDrop: 1.75,
  uqTurn1: [0.15, 0.65], uqWalk1: [0.65, 2.45], reach: [2.2, 2.95], grab: 2.95, liftOff: [2.95, 3.5],
  uqTurn2: [3.4, 3.9], uqWalk2: [3.9, 6.4], uqTurn3: [6.4, 6.65],
  lift: [6.65, 7.85], press: 7.85, cloth: [7.9, 8.2], toa: 8.3, lower: [8.3, 9.6], end: 10.0,
};
const CARRY_REL = { r: 0.3, f: 0.15, y: 0.8 };
const MID_REL = { r: 0.3, f: 0.3, y: 1.22 };
const UP_REL = { r: 0.06, f: 0.1, y: 1.5 };
const PRESS_REL = { r: 0.06, f: 0.17, y: 1.51 };
const GRIP = { carry: 0.55, up: 0.02 };
const TILT = { carry: 28 * D2R, up: 20 * D2R };

// ------------------------------------------------------------------ Uq stance chain
const FAN_ROOT: V3 = [FAN_POS[0], 0, FAN_POS[2]];
const yawFan = yawTo(U1, FAN_ROOT);
export const STAND: V3 = [FAN_ROOT[0] - Math.sin(yawFan) * 0.36, 0, FAN_ROOT[2] - Math.cos(yawFan) * 0.36];
const CHEAD_Y = PRESS_REL.y + (FAN_LEN.headY - GRIP.up) * Math.cos(TILT.up);
/** where Uq stands under the corner so that the disc centre meets the housing: solved from the press hand offset */
export const DEST: V3 = (() => {
  const ch = new THREE.Vector3(LENS_T[0] - 0.7071 * 0.08, 0, LENS_T[2] - 0.7071 * 0.08); // 8 cm room-side of the lens, horizontally
  let d = new THREE.Vector3(ch.x - 0.5, 0, ch.z - 0.5);
  for (let i = 0; i < 6; i++) {
    const yaw = yawTo([d.x, 0, d.z], [CAM_T_BODY[0], 0, CAM_T_BODY[2]]);
    const off = new THREE.Vector3().addScaledVector(rightV(yaw), PRESS_REL.r).addScaledVector(fwdV(yaw), PRESS_REL.f + Math.sin(TILT.up) * (FAN_LEN.headY - GRIP.up));
    d = ch.clone().sub(off);
  }
  return [d.x, 0, d.z];
})();
export const YAW_DEST = yawTo(DEST, [CAM_T_BODY[0], 0, CAM_T_BODY[2]]);
export const HEAD_AIM: V3 = [LENS_T[0] - 0.7071 * 0.08, CHEAD_Y, LENS_T[2] - 0.7071 * 0.08];
const yawWalk = yawTo(STAND, DEST);

const stU0 = stanceAt(U1, YF_U, H_UQ);
const uT1 = turnInPlace(stU0, yawFan, EV.uqTurn1[0], EV.uqTurn1[1], H_UQ);
const uW1 = walkSteps(uT1.end, STAND, yawFan, 4, EV.uqWalk1[0], EV.uqWalk1[1], H_UQ);
const uT2 = turnInPlace(uW1.end, yawWalk, EV.uqTurn2[0], EV.uqTurn2[1], H_UQ);
const uW2 = walkSteps(uT2.end, DEST, yawWalk, 6, EV.uqWalk2[0], EV.uqWalk2[1], H_UQ);
const uT3 = turnInPlace(uW2.end, YAW_DEST, EV.uqTurn3[0], EV.uqTurn3[1], H_UQ);
export const UQ_MOVES: Moves = chain(stU0, H_UQ, [uT1, uW1, uT2, uW2, uT3]);

// ------------------------------------------------------------------ adik stance chain (to the sofa)
const yawSofa = yawTo(A1_SB, SOFA_SPOT);
const stA0 = stanceAt(A1_SB, YF_A, H_AD);
const aT1 = turnInPlace(stA0, yawSofa, EV.adTurn[0], EV.adTurn[1], H_AD);
const aW1 = walkSteps(aT1.end, SOFA_SPOT, yawSofa, 2, EV.adWalk[0], EV.adWalk[1], H_AD);
export const AD_MOVES: Moves = chain(stA0, H_AD, [aT1, aW1]);

// ------------------------------------------------------------------ arms (keys solved with the stance at each key time)
const uqAt = (t: number) => movesAt(UQ_MOVES, t);
const adAt = (t: number) => movesAt(AD_MOVES, t);
const kPole = (() => { const u = uqAt(2.5); const p = new THREE.Vector3(FAN_ROOT[0], FAN_LEN.grip0, FAN_ROOT[2]).addScaledVector(fwdV(u.yaw), -0.02); return ik("L", u.root, u.yaw, H_UQ, p, [40, 20, 0]); })();
const POLE_PT = new THREE.Vector3(FAN_ROOT[0], FAN_LEN.grip0, FAN_ROOT[2]).addScaledVector(fwdV(yawFan), -0.02);

/** per-frame LOCAL IK along a world path, continued from the previous frame's solution (coordinate descent, torso always
 * penalised). Computed once at module load from t0 forward, so every frame is the same pure function of t in every tab. */
const armTable = (mv: Moves, h: number, t0: number, t1: number, q0: Q, target: (t: number) => THREE.Vector3) => {
  const n = Math.ceil((t1 - t0) * 30);
  const out: Q[] = [q0];
  let q: Q = [...q0];
  for (let f = 1; f <= n; f++) {
    const t = Math.min(t1, t0 + f / 30);
    const u = movesAt(mv, t);
    const T = target(t);
    const cost = (x: Q) => handWorld(x, "L", u.root, u.yaw, h).distanceTo(T) + 4 * c1ArmTorsoDepth(x as never, "L", h) + 0.0004 * (Math.abs(x[0] - q[0]) + Math.abs(x[1] - q[1]) + Math.abs(x[2] - q[2]));
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
  const fn = (t: number): Q => {
    if (t <= t0) return out[0];
    const x = (t - t0) * 30, i = Math.floor(x);
    if (i >= out.length - 1) return out[out.length - 1];
    return qlerp(out[i], out[i + 1], x - i);
  };
  return Object.assign(fn, { last: out[out.length - 1], frames: out.length });
};
const relAt = (t: number, k: { r: number; f: number; y: number }) => { const u = uqAt(t); return relPt(u.root, u.yaw, k.r, k.f, k.y); };
const lerpRel = (a: { r: number; f: number; y: number }, b: { r: number; f: number; y: number }, u: number) => ({ r: lerp(a.r, b.r, u), f: lerp(a.f, b.f, u), y: lerp(a.y, b.y, u) });
/** piecewise path through relative hand offsets at progress p in [0,1] (each segment smoothstepped) */
const relPath = (p: number): { r: number; f: number; y: number } => {
  const ks = [CARRY_REL, MID_REL, UP_REL, PRESS_REL], ps = [0, 0.3, 0.72, 1];
  for (let i = 1; i < ks.length; i++) if (p <= ps[i]) return lerpRel(ks[i - 1], ks[i], (p - ps[i - 1]) / (ps[i] - ps[i - 1]));
  return PRESS_REL;
};
const tReach = (() => { const q0 = REST_UQ; return (t: number): Q => qlerp(q0, kPole.q, sm((t - EV.reach[0]) / (EV.reach[1] - EV.reach[0]))); })();
const tLift = armTable(UQ_MOVES, H_UQ, EV.grab, EV.liftOff[1], kPole.q, (t) => POLE_PT.clone().lerp(relAt(t, CARRY_REL), sm((t - EV.grab) / (EV.liftOff[1] - EV.grab))));
const tUp = armTable(UQ_MOVES, H_UQ, EV.lift[0], EV.press, tLift.last, (t) => { const u = uqAt(t); const k = relPath(sm((t - EV.lift[0]) / (EV.press - EV.lift[0]))); return relPt(u.root, u.yaw, k.r, k.f, k.y); });
const Q_CARRY = tLift.last;
/** lowering: joint-space blend press → carry (the per-frame path solver jumped 20 deg/frame between two arm planes) */
const tLow = Object.assign((t: number): Q => qlerp(tUp.last, Q_CARRY, sm((t - EV.lower[0]) / (EV.lower[1] - EV.lower[0]))), { last: Q_CARRY });
export const UQ_KEYS = { kPole, carry: { q: tLift.last, err: handWorld(tLift.last, "L", uqAt(EV.liftOff[1]).root, uqAt(EV.liftOff[1]).yaw, H_UQ).distanceTo(relAt(EV.liftOff[1], CARRY_REL)) }, press: { q: tUp.last, err: handWorld(tUp.last, "L", uqAt(EV.press).root, uqAt(EV.press).yaw, H_UQ).distanceTo(relAt(EV.press, PRESS_REL)) }, low: { q: tLow.last, err: handWorld(tLow.last, "L", uqAt(EV.lower[1]).root, uqAt(EV.lower[1]).yaw, H_UQ).distanceTo(relAt(EV.lower[1], CARRY_REL)) } };
export const uqArmAt = (t: number): Q =>
  t < EV.reach[0] ? REST_UQ : t < EV.reach[1] ? tReach(t) : t < EV.liftOff[1] ? tLift(t) : t < EV.lift[0] ? tLift.last : t < EV.press ? tUp(t) : t < EV.lower[0] ? tUp.last : t < EV.lower[1] ? tLow(t) : tLow.last;

/** adik's hand path is built in HER body frame (constant joint while she walks and turns), the sofa point is fixed in the world */
const adFin = adAt(1.55);
const toLoc = (p: THREE.Vector3, root: V3, yaw: number) => p.clone().sub(new THREE.Vector3(...root)).applyAxisAngle(UP, -yaw);
const fromLoc = (l: THREE.Vector3, root: V3, yaw: number) => l.clone().applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
const L_REST = toLoc(handWorld(JACKET_Q, "L", adAt(0).root, adAt(0).yaw, H_AD), adAt(0).root, adAt(0).yaw);
const L_DROP = toLoc(new THREE.Vector3(...SOFA_DROP), adFin.root, adFin.yaw);
const adPath = (l: THREE.Vector3, t: number) => { const a = adAt(t); return fromLoc(l, a.root, a.yaw); };
const kDrop = (() => { const a = adAt(1.5); return ik("L", a.root, a.yaw, H_AD, new THREE.Vector3(...SOFA_DROP), [60, 20, 0]); })();
const adOut = armTable(AD_MOVES, H_AD, 0.4, 1.55, JACKET_Q, (t) => adPath(L_REST.clone().lerp(L_DROP, sm((t - 0.4) / 1.15)), t));
const adBack = armTable(AD_MOVES, H_AD, 2.0, 3.2, adOut.last, (t) => adPath(L_DROP.clone().lerp(L_REST, sm((t - 2.0) / 1.2)), t));
export const AD_KEYS = { kDrop: { q: adOut.last, err: handWorld(adOut.last, "L", adAt(1.55).root, adAt(1.55).yaw, H_AD).distanceTo(new THREE.Vector3(...SOFA_DROP)) }, ikRef: kDrop };
export const adArmAt = (t: number): Q => (t < 0.4 ? JACKET_Q : t < 1.55 ? adOut(t) : t < 2.0 ? adOut.last : t < 3.2 ? adBack(t) : adBack.last);

// ------------------------------------------------------------------ the fan (grip g along the pole, axis a, hand = actual FK)
export type FanState = { base: V3; a: V3; yaw: number; held: boolean; hand: V3; head: V3; g: number };
export const fanAt = (t: number): FanState => {
  const u = uqAt(t);
  const q = uqArmAt(t);
  const hand = handWorld(q, "L", u.root, u.yaw, H_UQ);
  const aCarry = new THREE.Vector3(0, Math.cos(TILT.carry), 0).addScaledVector(rightV(u.yaw), Math.sin(TILT.carry) * 0.35).addScaledVector(fwdV(u.yaw), Math.sin(TILT.carry) * 0.94).normalize();
  const aUp = new THREE.Vector3(0, Math.cos(TILT.up), 0).addScaledVector(fwdV(u.yaw), Math.sin(TILT.up)).normalize();
  const kA = ramp(t, EV.liftOff[0], EV.liftOff[1]) * (1 - ramp(t, EV.lift[0] + 0.1, EV.lift[1] - 0.1)) + 0; // 0 floor-up, 1 carry
  const kU = ramp(t, EV.lift[0] + 0.1, EV.lift[1] - 0.1) * (1 - ramp(t, EV.lower[0], EV.lower[1]));
  const a = new THREE.Vector3(0, 1, 0).lerp(aCarry, kA).lerp(aUp, kU).normalize();
  const g = t < EV.liftOff[0] ? FAN_LEN.grip0
    : lerp(FAN_LEN.grip0, GRIP.carry, ramp(t, EV.liftOff[0], EV.liftOff[1])) * (1 - ramp(t, EV.lift[0] + 0.1, EV.lift[1])) + GRIP.up * ramp(t, EV.lift[0] + 0.1, EV.lift[1]);
  const gg = t < EV.lower[0] ? g : lerp(GRIP.up, GRIP.carry, ramp(t, EV.lower[0], EV.lower[1]));
  const held = t >= EV.grab;
  const base = held ? hand.clone().addScaledVector(a, -gg) : new THREE.Vector3(...FAN_ROOT);
  const aa = held ? a : new THREE.Vector3(0, 1, 0);
  const head = base.clone().addScaledVector(aa, FAN_LEN.headY);
  return { base: V(base), a: V(aa), yaw: held ? u.yaw : -2.3, held, hand: V(hand), head: V(head), g: held ? gg : FAN_LEN.grip0 };
};

export const clothAt = (t: number): { mode: "fan" | "fall" | "hang"; s: number } =>
  t < EV.cloth[0] ? { mode: "fan", s: 0 } : t < EV.cloth[1] ? { mode: "fall", s: (t - EV.cloth[0]) / (EV.cloth[1] - EV.cloth[0]) } : { mode: "hang", s: 1 };
/** hanging cloth on the housing: top edge at the housing top, 4.5 cm room-side of the lens, plane facing the room */
export const CLOTH_HANG = { c: [CAM_T_BODY[0] - 0.7071 * 0.05, CAM_T_BODY[1] + 0.025 - 0.2, CAM_T_BODY[2] - 0.7071 * 0.05] as V3, w: 0.34, h: 0.4, yaw: Math.atan2(-0.7071, -0.7071) };

export const ledAt = (t: number) => ({ T: t < EV.cloth[0] ? 1 : 0.35, D: 1, L: 1, K: 1 });

// ------------------------------------------------------------------ frame
const phoneAt = (root: V3, yaw: number) => {
  const p0 = new THREE.Vector3(...EP2_END.phone.p).sub(new THREE.Vector3(...uqEnd.root)).applyAxisAngle(UP, yaw - uqEnd.yaw);
  const q = new THREE.Quaternion().setFromAxisAngle(UP, yaw - uqEnd.yaw).multiply(new THREE.Quaternion(...EP2_END.phone.q));
  return { p: [root[0] + p0.x, p0.y, root[2] + p0.z] as V3, q: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
};
const LIM = 55;
const clampH = (x: number) => Math.max(-LIM, Math.min(LIM, x));
const lookAtPt = (m: { root: V3; yaw: number }, p: V3, eyeY: number) => {
  const yaw = clampH(wrap(yawTo(m.root, p) - m.yaw) * R2D);
  const nod = Math.max(-25, Math.min(10, -Math.atan2(p[1] - eyeY, Math.hypot(p[0] - m.root[0], p[2] - m.root[2])) * R2D));
  return { yaw, nod };
};
const mixHead = (a: { yaw: number; nod: number }, b: { yaw: number; nod: number }, k: number) => ({ yaw: lerp(a.yaw, b.yaw, k), nod: lerp(a.nod, b.nod, k) });
export type MChar = { who: "uq" | "adik"; root: V3; yaw: number; height: number; pose: Record<string, unknown>; legPose?: unknown; hands?: unknown; face: Record<string, unknown>; feet: { L: V3; R: V3; air: { L: number; R: number } } };
export type F5 = { chars: MChar[]; phone: { p: V3; q: [number, number, number, number] }; fan: FanState; cloth: ReturnType<typeof clothAt>; jacketOnArm: boolean; led: ReturnType<typeof ledAt> };
export const frameAt = (t: number): F5 => {
  const u = uqAt(t), a = adAt(t);
  const fan = fanAt(t);
  const uqEye = 1.33;
  const hFan = lookAtPt(u, [FAN_ROOT[0], 1.0, FAN_ROOT[2]], uqEye);
  const hAhead = lookAtPt(u, [u.root[0] + Math.sin(yawWalk) * 2.5, 1.45, u.root[2] + Math.cos(yawWalk) * 2.5], uqEye);
  const hCorner = lookAtPt(u, T_LED, uqEye);
  const hU = mixHead(mixHead(mixHead(lookAtPt(u, [A1_SB[0], 1.1, A1_SB[2]], uqEye), hFan, ramp(t, 0.1, 0.6)), hAhead, ramp(t, 3.0, 3.6)), hCorner, ramp(t, 5.7, 6.3));
  const hA = mixHead(lookAtPt(a, [-2.0, 0.5, -0.3], 1.12), lookAtPt(a, [u.root[0], 1.2, u.root[2]], 1.12), ramp(t, 2.0, 2.6));
  const uq: MChar = {
    who: "uq", root: u.root, yaw: u.yaw, height: H_UQ, legPose: u.legPose, hands: uqEnd.hands, feet: { L: u.feetWorld.L, R: u.feetWorld.R, air: u.air },
    pose: { ...(uqEnd.pose as object), armL: [uqArmAt(t)[0], uqArmAt(t)[1]], armLFwd: uqArmAt(t)[2], headYaw: hU.yaw, headNod: hU.nod },
    face: { eyes: "open", brows: "worried", mouth: "flat" },
  };
  const aq = adArmAt(t);
  const ad: MChar = {
    who: "adik", root: a.root, yaw: a.yaw, height: H_AD, legPose: a.legPose, feet: { L: a.feetWorld.L, R: a.feetWorld.R, air: a.air },
    pose: { ...(adEnd.pose as object), armR: [REST_AD[0], REST_AD[1]], armRFwd: REST_AD[2], armL: [aq[0], aq[1]], armLFwd: aq[2], headYaw: hA.yaw, headNod: hA.nod },
    face: { eyes: "open", brows: "raised", mouth: "flat" },
  };
  return { chars: [uq, ad], phone: phoneAt(u.root, u.yaw), fan, cloth: clothAt(t), jacketOnArm: t < EV.jacketDrop, led: ledAt(t) };
};

export { c1ArmTorsoDepth };
export const WALL_NOTE = "x 0.94 (kamar wall), z 2.94 (south wall)";
export const uqAtPublic = (t: number) => movesAt(UQ_MOVES, t);
export const adAtPublic = (t: number) => movesAt(AD_MOVES, t);
