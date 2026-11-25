// Reusable walk → slow down → stop → turn-the-head motion for the C1 stick family (2026-11-16, D-027).
// Pure functions of time (no state between frames). Feet are driven by the DISTANCE walked, not by time: a foot in
// stance keeps one world position while the body passes over it, so it never slides, whatever the speed profile.
// A stop always lands in double support (both feet planted). Head, torso and arms lag each other by small, different
// delays, so nothing moves in lock-step. Character frame: facing +z, h = 1, "L" = the character's own right (-x).
import type { V3 } from "../inkbeat/types";

const TAU = Math.PI * 2;
const frac = (x: number) => x - Math.floor(x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};

export type Gait = {
  /** world height of the character (the `height` passed to C1) */
  height: number;
  /** distance the body travels in one full cycle (two steps), metres */
  stride: number;
  /** cycle offset 0..1 (vary per villager) */
  phase: number;
  /** foot lift at mid-swing (h units) */
  lift?: number;
  /** fraction of the cycle a foot is planted (> 0.5 gives double support) */
  stance?: number;
  /** body bob amplitude (h units) and arm swing (deg) at full speed */
  bob?: number;
  swing?: number;
  /** half the stance width (h units) */
  footX?: number;
};
const STANCE = 0.62;

/** the cycle position (0..1 of foot "L") at which both feet are planted, centred in the double support */
// foot "L" is planted for u ∈ [0, st), foot "R" for u ∈ [0.5, 0.5 + st): both are planted in [0.5, st) (and [0, st - 0.5))
export const doubleSupport = (g: Gait) => 0.5 + ((g.stance ?? STANCE) - 0.5) / 2; // 0.56 for stance 0.62

/** one foot's ankle in the character frame for distance d (metres) walked; o = 0 for "L", 0.5 for "R" */
const footAt = (g: Gait, d: number, o: number, bodyBob: number): V3 => {
  const st = g.stance ?? STANCE;
  const S = g.stride;
  const c = d / S + o + g.phase; // cycles
  const n = Math.floor(c);
  const u = c - n;
  const d0 = (n - o - g.phase) * S; // body distance at this stance's start
  const plant = d0 + (st * S) / 2;
  let along: number;
  let lift = 0;
  if (u < st) along = plant;
  else {
    const w = (u - st) / (1 - st);
    along = plant + S * smooth(w);
    lift = Math.sin(Math.PI * w) * (g.lift ?? 0.03);
  }
  const s = o === 0 ? -1 : 1;
  return [s * (g.footX ?? 0.05), 0.012 + lift - bodyBob, (along - d) / g.height + 0.004];
};

export type WalkPlan = {
  /** start time and position, facing yaw (rad; 0 = +z, +π/2 = +x) */
  t0: number;
  from: V3;
  yaw: number;
  /** cruising speed m/s; time the body comes to rest; seconds of slowing down before it */
  speed: number;
  tStop?: number;
  decel?: number;
  /** optional: start already walking (distance at t0 > 0 means the cycle is mid-way) */
  d0?: number;
};

/** distance walked at time t (a smooth stop that lands in double support), and the speed */
export const walkDistance = (g: Gait, w: WalkPlan, t: number): { d: number; v: number } => {
  const dc = w.decel ?? 1.1;
  const start = w.d0 ?? 0;
  if (w.tStop === undefined) {
    const tt = Math.max(0, t - w.t0);
    return { d: start + w.speed * tt, v: t >= w.t0 ? w.speed : 0 };
  }
  // the nominal stop distance, snapped to the next double-support point
  const T = Math.max(dc, w.tStop - w.t0);
  const nominal = start + w.speed * (T - dc / 2);
  const ds = doubleSupport(g);
  const k = Math.round(nominal / g.stride + g.phase - ds);
  const dStop = Math.max(start + 0.05, (k + ds - g.phase) * g.stride);
  const v = (dStop - start) / (T - dc / 2); // cruising speed that lands exactly on dStop
  const tDec = w.t0 + T - dc;
  if (t <= w.t0) return { d: start, v: 0 };
  if (t <= tDec) return { d: start + v * (t - w.t0), v };
  if (t >= w.t0 + T) return { d: dStop, v: 0 };
  const x = (t - tDec) / dc; // decelerate linearly in speed: v(1 - x)
  return { d: start + v * (tDec - w.t0) + v * dc * (x - (x * x) / 2), v: v * (1 - x) };
};

/** the feet during the settle: the front foot stays planted; the rear foot steps up beside it */
const settled = (g: Gait, dStop: number, k: number): WalkState["legPose"] => {
  const L = footAt(g, dStop, 0, 0);
  const R = footAt(g, dStop, 0.5, 0);
  const dNow = dStop + 0.25 * g.stride * k;
  const aL = dStop + (L[2] - 0.004) * g.height;
  const aR = dStop + (R[2] - 0.004) * g.height;
  const front = Math.max(aL, aR);
  const lift = Math.sin(Math.PI * k) * 0.025;
  const z = (along: number, isRear: boolean) => ((isRear ? along + (front - 0.02 * g.height - along) * k : along) - dNow) / g.height + 0.004;
  const rearL = aL < aR;
  return {
    L: { ankle: [L[0], 0.012 + (rearL ? lift : 0), z(aL, rearL)] },
    R: { ankle: [R[0], 0.012 + (rearL ? 0 : lift), z(aR, !rearL)] },
  };
};

export type WalkState = {
  position: V3;
  yaw: number;
  legPose: { L: { ankle: V3 }; R: { ankle: V3 } };
  /** upper-body pose additions (deg): arm swing, twist, roll, head yaw/nod; bob is in the position */
  pose: { armL: [number, number]; armR: [number, number]; armLFwd: number; armRFwd: number; twist: number; roll: number; headYaw: number; headNod: number };
  d: number;
  speed: number;
};

/** the full walk state at time t (feet, body bob, arm swing, torso twist, head counter-turn), all lagged a little */
/** after the stop, the rear foot takes one small closing step (lifted, not slid) while the body settles a quarter
 * stride forward over both feet: 0 at the stop … 1 settled */
const SETTLE = 0.5;
export const walkState = (g: Gait, w: WalkPlan, t: number): WalkState => {
  const base = walkDistance(g, w, t);
  const { v } = base;
  let d = base.d;
  const settle = w.tStop === undefined ? 0 : smooth((t - w.tStop) / SETTLE);
  const k = clamp01(v / Math.max(0.01, w.speed)); // 0 standing … 1 cruising
  const cyc = d / g.stride + g.phase;
  const bobA = (g.bob ?? 0.008) * g.height * k;
  // the body is highest at mid-stance of either foot: twice per cycle
  const bob = bobA * (0.5 + 0.5 * Math.cos(TAU * 2 * (cyc - (g.stance ?? STANCE) / 4)));
  const bodyBob = bob / g.height;
  const sw = (g.swing ?? 16) * k;
  // arms swing opposite to the legs, a little late (0.06 cycle); the right arm ("L") goes forward with the left leg
  const arm = Math.sin(TAU * (cyc - 0.06));
  const twist = -4 * k * Math.sin(TAU * (cyc - 0.03)); // chest counter-rotates
  const roll = 1.6 * k * Math.sin(TAU * (cyc - 0.1)); // sway over the stance foot, later still
  const head = 2.5 * k * Math.sin(TAU * (cyc - 0.03)); // the head cancels most of the twist
  const yaw = w.yaw;
  const dir: V3 = [Math.sin(yaw), 0, Math.cos(yaw)];
  if (settle > 0) d = base.d + 0.25 * g.stride * settle;
  return {
    position: [w.from[0] + dir[0] * d, w.from[1] + bob, w.from[2] + dir[2] * d],
    yaw,
    legPose: settle > 0 ? settled(g, base.d, settle) : { L: { ankle: footAt(g, d, 0, bodyBob) }, R: { ankle: footAt(g, d, 0.5, bodyBob) } },
    pose: {
      // [shoulder, elbow] in the arm plane turned forward (armXFwd ≈ 80): + = forward, - = back; elbows bend a little
      armL: [6 + sw * arm, 8 + 6 * k + 4 * Math.max(0, arm)],
      armR: [6 - sw * arm, 8 + 6 * k + 4 * Math.max(0, -arm)],
      armLFwd: 70 * k + 0 * (1 - k),
      armRFwd: 70 * k + 0 * (1 - k),
      twist,
      roll,
      headYaw: head,
      headNod: 1.2 * k * Math.cos(TAU * 2 * (cyc - 0.12)),
    },
    d,
    speed: v,
  };
};

/** a delayed, eased turn of the head toward `deg` (starting at t0, `dur` long), with the torso following a part of it
 * later and slower, so the look reads as a person turning, not a puppet: returns head yaw and torso twist (deg) */
export const lookTurn = (t: number, t0: number, deg: number, dur = 0.7, torsoShare = 0.3) => {
  const h = smooth((t - t0) / dur);
  const b = smooth((t - t0 - 0.18) / (dur * 1.6));
  // a small overshoot settle on the head
  const settle = Math.sin(Math.PI * clamp01((t - t0 - dur) / 0.5)) * 0.06 * (1 - clamp01((t - t0 - dur - 0.5) / 0.3));
  return { headYaw: deg * ((1 - torsoShare) * h + settle * (1 - torsoShare)), twist: deg * torsoShare * b };
};

export { frac };
