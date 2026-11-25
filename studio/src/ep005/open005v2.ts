// Episode 4 (2026-11-005) opening ANIMATIC v2 (owner 2026-11-23, after watching v1): the fan is dropped. Uq covers lens T
// with a small piece of opaque paper tape carried on the tip of a long pole (gagang); the pole is pulled back and the tape
// stays on the lens, the LED beside it stays lit. Adik puts the jacket on the sofa, walking AROUND the coffee table.
// Paths are checked against the sofa, the coffee table, the bedroom door leaf and the walls (tools/m005v2_check.ts).
// The preparation (tape onto the pole tip, gripping the pole at its lower end) happens between two shots (ellipsis).
// Every value is a pure function of the world time w (video-production §9). v1 (motion005.ts) is left unchanged.
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

export type Q = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const qlerp = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const fwdV = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
const rightV = (yaw: number) => new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));
const V = (v: THREE.Vector3): V3 => [v.x, v.y, v.z];

const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
const LAY = layoutOf(C1_BUILD);
const M0 = c1UpperMatrix({});
export const handWorld = (q: Q, side: "L" | "R", root: V3, yaw: number, h: number) => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  return armChain(pose, side, LAY).H.applyMatrix4(M0).multiplyScalar(h).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
};
/** shoulder, elbow, hand of an arm in world space (for the clearance check) */
export const armWorld = (q: Q, side: "L" | "R", root: V3, yaw: number, h: number) => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  const c = armChain(pose, side, LAY);
  return [c.S, c.E, c.H].map((p) => V(p.clone().applyMatrix4(M0).multiplyScalar(h).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root))));
};
const ik = (side: "L" | "R", root: V3, yaw: number, h: number, target: THREE.Vector3, ref: Q) => {
  const s = c1ArmIK({ root, yaw, body: {}, side, target: [target.x, target.y, target.z], ref, height: h, avoidTorso: true, wMin: -60 });
  return { q: [s.arm[0], s.arm[1], s.fwd] as Q, err: s.err };
};
/** per-frame local IK along a world path, continued from the previous frame (computed once at module load) */
const armTable = (mv: Moves, h: number, t0: number, t1: number, q0: Q, target: (t: number) => THREE.Vector3) => {
  const n = Math.max(1, Math.ceil((t1 - t0) * 30));
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
  return Object.assign(fn, { last: out[out.length - 1] });
};

// ------------------------------------------------------------------ fixed numbers
export const T_LED = ledWorld("T");
export const LENS: V3 = lensWorld("T");
const LD = new THREE.Vector3(...CAMS.T.dir).normalize(); // the way the lens looks (into the room, down)
export const LENS_DIR: V3 = V(LD);
export const POLE = { len: 1.5, grip: 0.08, r: 0.013 };
const TIP = POLE.len - POLE.grip; // grip to tip
const TILT = 25 * D2R;
/** tape: 2.2 x 1.8 cm, centred on the lens, 4 mm in front of it (lens Ø 1.5 cm; the LED sits 2.0 cm from the lens centre) */
export const TAPE = { w: 0.022, h: 0.018, gap: 0.004 };
/** the pole leans on the bedroom side of the living room's east wall (x 0.94), never seen in Ep 2–3 (tools/m005_prop_vis.ts) */
export const POLE_LEAN = { bottom: [0.7, 0.0, 2.45] as V3, top: [0.925, 1.483, 2.45] as V3 };
export const W = {
  uqHead: [0.0, 0.35], uqWalk: [0.3, 2.3], uqTurn: [2.3, 2.6], adTurn: [0.4, 0.75], adWalk1: [0.75, 1.3], adTurn2: [1.3, 1.55], adWalk2: [1.55, 2.45], adTurn3: [2.45, 2.65], adArm: [2.5, 2.95], jacketDrop: 3.0, adBack: [3.1, 3.9],
  cut: [3.1, 4.0], raise: [4.0, 5.0], press: [5.0, 5.12], tape: 5.12, pull: [5.12, 5.75], toa: 5.25, lower: [5.8, 6.95], end: 7.4,
};

// aim: hand position and Uq's root so the tip meets the lens with the pole tilted 25° toward the corner
/** Uq faces the south-east corner (yaw 45°); the hand sits 13 cm right of and 28 cm ahead of his root */
const solveAim = () => {
  const yaw = 45 * D2R;
  const a = new THREE.Vector3(0, Math.cos(TILT), 0).addScaledVector(fwdV(yaw), Math.sin(TILT)).normalize();
  const H = new THREE.Vector3(...LENS).addScaledVector(LD, -TAPE.gap).addScaledVector(a, -TIP);
  const root = H.clone().addScaledVector(rightV(yaw), -0.13).addScaledVector(fwdV(yaw), -0.28).setY(0);
  return { root: V(root), yaw, H, a };
};
export const AIM = solveAim();
export const AIM_ROOT = AIM.root, AIM_YAW = AIM.yaw;

// ------------------------------------------------------------------ Uq: straight walk from the Ep 3 end spot to AIM_ROOT
const stU0 = stanceAt(U1, yawTo(U1, T_LED), H_UQ);
const yUW = yawTo(U1, AIM_ROOT);
const uT0 = turnInPlace(stU0, yUW, W.uqHead[0] + 0.05, W.uqWalk[0], H_UQ);
const uW = walkSteps(uT0.end, AIM_ROOT, yUW, 4, W.uqWalk[0], W.uqWalk[1], H_UQ);
const uT1 = turnInPlace(uW.end, AIM_YAW, W.uqTurn[0], W.uqTurn[1], H_UQ);
export const UQ_MOVES: Moves = chain(stU0, H_UQ, [uT0, uW, uT1]);
const uqAt = (t: number) => movesAt(UQ_MOVES, t);

// ------------------------------------------------------------------ adik: around the coffee table's east end to the sofa
export const AD_WAY: V3 = [-1.5, 0, 0.85];
export const SOFA_SPOT: V3 = [-1.75, 0, 0.03];
export const SOFA_DROP: V3 = [-1.82, 0.76, -0.27];
export const JACKET_ON_SOFA: V3 = [-1.88, 0.535, -0.42];
const stA0 = stanceAt(A1_SB, yawTo(A1_SB, T_LED), H_AD);
const yW = yawTo(A1_SB, AD_WAY);
const aT = turnInPlace(stA0, yW, W.adTurn[0], W.adTurn[1], H_AD);
// walk only along the body's facing (sideways paths cross the feet, v2 run 1: adik's legs crossed at 1.4–1.7 s)
const aW1 = walkSteps(aT.end, AD_WAY, yW, 2, W.adWalk1[0], W.adWalk1[1], H_AD);
const yW2 = yawTo(AD_WAY, SOFA_SPOT);
const aT2 = turnInPlace(aW1.end, yW2, W.adTurn2[0], W.adTurn2[1], H_AD);
const aW2 = walkSteps(aT2.end, SOFA_SPOT, yW2, 3, W.adWalk2[0], W.adWalk2[1], H_AD);
const aT3 = turnInPlace(aW2.end, Math.PI, W.adTurn3[0], W.adTurn3[1], H_AD);
export const AD_MOVES: Moves = chain(stA0, H_AD, [aT, aW1, aT2, aW2, aT3]);
const adAt = (t: number) => movesAt(AD_MOVES, t);

// ------------------------------------------------------------------ arms
/** a natural arm swing while walking: phase from the distance travelled (one swing cycle per two steps) */
const travel = (mv: Moves, t: number, t0: number) => { const a = movesAt(mv, t0).root, b = movesAt(mv, t).root; return Math.hypot(b[0] - a[0], b[2] - a[2]); };
/** the back swing is kept small (a full back swing put the arm into the tee: 2.0 cm, check v2 run 1) */
const swingQ = (rest: Q, amp: number, ph: number, w: number, planeFwd: number): Q => { const x = Math.sin(ph); return [rest[0] + w * amp * (x > 0 ? x : 0), rest[1] + w * 10 * Math.max(0, x), lerp(rest[2], planeFwd, w)]; };
const STEP_U = 0.6, STEP_A = 0.42;
// Uq right arm: swing on the walk; after the cut it holds the pole upright beside him (Q_HOLD), raises it to the aim
const holdPt = (t: number) => { const u = uqAt(t); return new THREE.Vector3(...u.root).addScaledVector(rightV(u.yaw), 0.24).addScaledVector(fwdV(u.yaw), 0.2).setY(0.8); };
const kHold = ik("L", AIM_ROOT, AIM_YAW, H_UQ, holdPt(W.raise[0]), [30, 60, 40]);
const HOLD_FK = handWorld(kHold.q, "L", AIM_ROOT, AIM_YAW, H_UQ);
const tRaise = armTable(UQ_MOVES, H_UQ, W.raise[0], W.press[0], kHold.q, (t) => HOLD_FK.clone().lerp(AIM.H, sm((t - W.raise[0]) / (W.press[0] - W.raise[0]))));
const H_PRESS = AIM.H.clone().addScaledVector(AIM.a, 0.0);
const tPress = armTable(UQ_MOVES, H_UQ, W.press[0], W.press[1], tRaise.last, () => H_PRESS);
const H_PULL = AIM.H.clone().addScaledVector(AIM.a, -0.25).add(new THREE.Vector3(0, -0.04, 0));
const tPull = armTable(UQ_MOVES, H_UQ, W.pull[0], W.pull[1], tPress.last, (t) => H_PRESS.clone().lerp(H_PULL, sm((t - W.pull[0]) / (W.pull[1] - W.pull[0]))));
export const UQ_KEYS = {
  hold: kHold,
  aim: { q: tRaise.last, err: handWorld(tRaise.last, "L", AIM_ROOT, AIM_YAW, H_UQ).distanceTo(AIM.H) },
  pull: { q: tPull.last, err: handWorld(tPull.last, "L", AIM_ROOT, AIM_YAW, H_UQ).distanceTo(H_PULL) },
};
const PLANE_FWD = 35; // arm plane turned forward for the swing (deg)
export const uqArmAt = (t: number): Q => {
  if (t < W.cut[0]) {
    const w = ramp(t, W.uqWalk[0], W.uqWalk[0] + 0.6) * (1 - ramp(t, W.uqWalk[1] - 0.6, W.uqWalk[1]));
    return swingQ(REST_UQ, 14, (Math.PI * travel(UQ_MOVES, t, W.uqWalk[0])) / STEP_U, w, PLANE_FWD);
  }
  if (t < W.raise[0]) return kHold.q; // hidden by the cut
  if (t < W.press[0]) return tRaise(t);
  if (t < W.press[1]) return tPress(t);
  if (t < W.pull[1]) return tPull(t);
  if (t < W.lower[0]) return tPull.last;
  return qlerp(tPull.last, kHold.q, sm((t - W.lower[0]) / (W.lower[1] - W.lower[0])));
};
// adik right arm (rig "L", carries the jacket): path in HER body frame to the sofa drop point and back
const toLoc = (p: THREE.Vector3, root: V3, yaw: number) => p.clone().sub(new THREE.Vector3(...root)).applyAxisAngle(UP, -yaw);
const fromLoc = (l: THREE.Vector3, root: V3, yaw: number) => l.clone().applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
const adFin = adAt(W.adTurn3[1]);
const L_REST = toLoc(handWorld(JACKET_Q, "L", adAt(0).root, adAt(0).yaw, H_AD), adAt(0).root, adAt(0).yaw);
const L_DROP = toLoc(new THREE.Vector3(...SOFA_DROP), adFin.root, adFin.yaw);
const adPath = (l: THREE.Vector3, t: number) => { const a = adAt(t); return fromLoc(l, a.root, a.yaw); };
const adOut = armTable(AD_MOVES, H_AD, W.adArm[0], W.adArm[1], JACKET_Q, (t) => adPath(L_REST.clone().lerp(L_DROP, sm((t - W.adArm[0]) / (W.adArm[1] - W.adArm[0]))), t));
const adBk = armTable(AD_MOVES, H_AD, W.adBack[0], W.adBack[1], adOut.last, (t) => adPath(L_DROP.clone().lerp(L_REST, sm((t - W.adBack[0]) / (W.adBack[1] - W.adBack[0]))), t));
export const AD_KEYS = { drop: { q: adOut.last, err: handWorld(adOut.last, "L", adFin.root, adFin.yaw, H_AD).distanceTo(new THREE.Vector3(...SOFA_DROP)) } };
export const adArmAt = (t: number): Q => (t < W.adArm[0] ? JACKET_Q : t < W.adArm[1] ? adOut(t) : t < W.adBack[0] ? adOut.last : t < W.adBack[1] ? adBk(t) : adBk.last);
/** adik's free LEFT arm (rig "R") swings while she walks */
export const adLeftAt = (t: number): Q => {
  const w = ramp(t, W.adWalk1[0], W.adWalk1[0] + 0.5) * (1 - ramp(t, W.adWalk2[1] - 0.45, W.adWalk2[1]));
  return swingQ(REST_AD, 10, (Math.PI * travel(AD_MOVES, t, W.adWalk1[0])) / STEP_A + Math.PI, w, PLANE_FWD);
};

// ------------------------------------------------------------------ the pole and the tape
export type PoleState = { bottom: V3; tip: V3; a: V3; held: boolean };
export const poleAt = (t: number): PoleState => {
  if (t < W.cut[1] - 1e-6) {
    const b = new THREE.Vector3(...POLE_LEAN.bottom), tp = new THREE.Vector3(...POLE_LEAN.top);
    return { bottom: POLE_LEAN.bottom, tip: POLE_LEAN.top, a: V(tp.clone().sub(b).normalize()), held: false };
  }
  const u = uqAt(t);
  const H = handWorld(uqArmAt(t), "L", u.root, u.yaw, H_UQ);
  const aUp = new THREE.Vector3(0, 1, 0);
  const k = ramp(t, W.raise[0], W.press[0]) * (1 - ramp(t, W.lower[0], W.lower[1]));
  const a = aUp.clone().lerp(AIM.a, k).normalize();
  return { bottom: V(H.clone().addScaledVector(a, -POLE.grip)), tip: V(H.clone().addScaledVector(a, TIP)), a: V(a), held: true };
};
/** where the tape is: on the pole tip until the press, then on the lens for good */
export const tapeAt = (t: number): { on: "tip" | "lens" | "hidden"; c: V3; n: V3 } => {
  if (t < W.cut[1]) return { on: "hidden", c: [0, -5, 0], n: [0, 1, 0] };
  if (t < W.tape) { const p = poleAt(t); const a = new THREE.Vector3(...p.a); return { on: "tip", c: V(new THREE.Vector3(...p.tip).addScaledVector(a, 0.002)), n: p.a }; }
  return { on: "lens", c: V(new THREE.Vector3(...LENS).addScaledVector(LD, TAPE.gap - 0.002)), n: V(LD.clone().negate()) };
};

// ------------------------------------------------------------------ frame
const phoneAt = (root: V3, yaw: number) => {
  const p0 = new THREE.Vector3(...EP2_END.phone.p).sub(new THREE.Vector3(...uqEnd.root)).applyAxisAngle(UP, yaw - uqEnd.yaw);
  const q = new THREE.Quaternion().setFromAxisAngle(UP, yaw - uqEnd.yaw).multiply(new THREE.Quaternion(...EP2_END.phone.q));
  return { p: [root[0] + p0.x, p0.y, root[2] + p0.z] as V3, q: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
};
const clampH = (x: number) => Math.max(-55, Math.min(55, x));
const look = (m: { root: V3; yaw: number }, p: V3, eyeY: number) => ({
  yaw: clampH(wrap(yawTo(m.root, p) - m.yaw) * R2D),
  nod: Math.max(-25, Math.min(10, -Math.atan2(p[1] - eyeY, Math.hypot(p[0] - m.root[0], p[2] - m.root[2])) * R2D)),
});
const mixH = (a: { yaw: number; nod: number }, b: { yaw: number; nod: number }, k: number) => ({ yaw: lerp(a.yaw, b.yaw, k), nod: lerp(a.nod, b.nod, k) });
export type MChar = { who: "uq" | "adik"; root: V3; yaw: number; height: number; pose: Record<string, unknown>; legPose?: unknown; hands?: unknown; face: Record<string, unknown>; feet: { L: V3; R: V3; air: { L: number; R: number } } };
export const frameAt = (t: number) => {
  const u = uqAt(t), a = adAt(t);
  // heads lead the body: Uq looks at the corner first, then along the walk, then up at the lens
  const ahead = (m: { root: V3; yaw: number }, d: number) => [m.root[0] + Math.sin(m.yaw) * d, 1.4, m.root[2] + Math.cos(m.yaw) * d] as V3;
  const hU = mixH(mixH(look(u, T_LED, 1.33), look(u, ahead(u, 2), 1.33), ramp(t, 0.5, 0.9)), look(u, T_LED, 1.33), ramp(t, 2.1, 2.5));
  const hA = mixH(mixH(look(a, [U1[0], 1.2, U1[2]], 1.12), look(a, [AD_WAY[0], 0.9, AD_WAY[2]], 1.12), ramp(t, 0.45, 0.8)), look(a, [-1.9, 0.5, -0.4], 1.12), ramp(t, 1.4, 1.8));
  const hA2 = mixH(hA, look(a, [u.root[0], 1.6, u.root[2]], 1.12), ramp(t, 2.9, 3.4));
  const qU = uqArmAt(t), qA = adArmAt(t), qAL = adLeftAt(t);
  const uq: MChar = {
    who: "uq", root: u.root, yaw: u.yaw, height: H_UQ, legPose: u.legPose, hands: uqEnd.hands, feet: { L: u.feetWorld.L, R: u.feetWorld.R, air: u.air },
    pose: { ...(uqEnd.pose as object), armL: [qU[0], qU[1]], armLFwd: qU[2], headYaw: hU.yaw, headNod: hU.nod },
    face: { eyes: "open", brows: "worried", mouth: "flat" },
  };
  const ad: MChar = {
    who: "adik", root: a.root, yaw: a.yaw, height: H_AD, legPose: a.legPose, feet: { L: a.feetWorld.L, R: a.feetWorld.R, air: a.air },
    pose: { ...(adEnd.pose as object), armR: [qAL[0], qAL[1]], armRFwd: qAL[2], armL: [qA[0], qA[1]], armLFwd: qA[2], headYaw: hA2.yaw, headNod: hA2.nod, lean: 3 * ramp(t, W.adWalk1[0], W.adWalk1[0] + 0.3) * (1 - ramp(t, W.adWalk2[1] - 0.3, W.adWalk2[1])) },
    face: { eyes: "open", brows: "raised", mouth: "flat" },
  };
  return { chars: [uq, ad], phone: phoneAt(u.root, u.yaw), pole: poleAt(t), tape: tapeAt(t), jacketOnArm: t < W.jacketDrop, ledT: 1 };
};
export type F5v2 = ReturnType<typeof frameAt>;
export const uqAtPublic = uqAt;
export const adAtPublic = adAt;
export { c1ArmTorsoDepth, D2R, REST_UQ };
