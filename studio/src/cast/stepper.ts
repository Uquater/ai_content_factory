// Authored footsteps (2026-11-18, Episode 2026-11-003 draft). walk.ts makes a steady gait between a start and a stop;
// this module covers what it cannot: turning in place, side steps, short walks that must start and end in a given
// stance (so a shot can hand over to the next without a pop), and backing up. Every foot event is a lifted step: the
// foot leaves its planted spot, follows an arc and lands; a planted foot never moves (no sliding by construction).
// The root and yaw follow eased keys. All functions are pure functions of t (video-production §9).
import type { V3 } from "../inkbeat/types";

export type FootId = "L" | "R";
/** a planted stance: root (y = 0), facing yaw (0 = +z), feet in world xz */
export type Stance = { root: V3; yaw: number; L: V3; R: V3 };
/** one lifted step of one foot to a world point, from t0 to t1 */
export type FootEvent = { foot: FootId; to: V3; t0: number; t1: number };
/** body keys: root and yaw at time t (eased between consecutive keys) */
export type BodyKey = { t: number; root: V3; yaw: number; /** easing INTO this key: "smooth" (default) or "trap" (accelerate 25 %, cruise, decelerate 25 %) */ ease?: "smooth" | "trap" };
/** trapezoid speed profile over u in [0,1]: accelerate over a, cruise, decelerate over a; returns progress 0..1 */
const trap = (u: number, a = 0.25) => {
  const x = clamp01(u);
  const vmax = 1 / (1 - a); // area = 1
  if (x < a) return (vmax * x * x) / (2 * a);
  if (x > 1 - a) return 1 - (vmax * (1 - x) * (1 - x)) / (2 * a);
  return vmax * (a / 2) + vmax * (x - a);
};
export type Moves = { start: Stance; feet: FootEvent[]; body: BodyKey[]; height: number; lift?: number };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
/** shortest-way yaw interpolation */
export const yawMix = (a: number, b: number, u: number) => {
  let d = b - a;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  return a + d * u;
};

/** the C1/Npc default foot offsets in the character frame (units of height): x ±0.05, z 0.004 (C1.tsx) */
export const FOOT_X = 0.05, FOOT_Z = 0.004;
/** world foot position for a root/yaw and a side, at the default stance offset */
export const footAt = (root: V3, yaw: number, f: FootId, height: number, dz = FOOT_Z): V3 => {
  const x = (f === "L" ? -FOOT_X : FOOT_X) * height, z = dz * height;
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return [root[0] + x * c + z * s, 0, root[2] - x * s + z * c];
};
export const stanceAt = (root: V3, yaw: number, height: number): Stance => ({ root, yaw, L: footAt(root, yaw, "L", height), R: footAt(root, yaw, "R", height) });

/** state at t: root, yaw, ankles in the character frame (legPose), and which foot is in the air */
export const movesAt = (m: Moves, t: number) => {
  // body: eased between the keys around t (before the first key: the start stance)
  // before the first key: the start stance; between keys: eased; after the last: the last key
  const keys = [...m.body].sort((x, y) => x.t - y.t);
  let root = m.start.root, yaw = m.start.yaw;
  let prev: BodyKey = { t: -Infinity, root: m.start.root, yaw: m.start.yaw };
  for (const b of keys) {
    if (t >= b.t) { root = b.root; yaw = b.yaw; prev = b; continue; }
    if (prev.t === -Infinity) break; // not started yet
    const x = (t - prev.t) / Math.max(1e-6, b.t - prev.t);
    const u = b.ease === "trap" ? trap(x) : smooth(x);
    root = [mix(prev.root[0], b.root[0], u), 0, mix(prev.root[2], b.root[2], u)];
    yaw = yawMix(prev.yaw, b.yaw, u);
    break;
  }
  // feet: each foot from its last landing to the current event's target, lifted
  const lift = m.lift ?? 0.035;
  const pos: Record<FootId, V3> = { L: m.start.L, R: m.start.R };
  const air: Record<FootId, number> = { L: 0, R: 0 };
  for (const f of ["L", "R"] as FootId[]) {
    let at = m.start[f];
    for (const e of m.feet.filter((x) => x.foot === f).sort((x, y) => x.t0 - y.t0)) {
      if (t <= e.t0) break;
      const w = clamp01((t - e.t0) / (e.t1 - e.t0));
      const u = smooth(w);
      if (w < 1) {
        pos[f] = [mix(at[0], e.to[0], u), 0, mix(at[2], e.to[2], u)];
        air[f] = lift * Math.sin(Math.PI * w);
        at = e.to;
        break;
      }
      at = e.to;
    }
    if (air[f] === 0) pos[f] = at;
  }
  const c = Math.cos(yaw), s = Math.sin(yaw), h = m.height;
  const local = (f: FootId): V3 => {
    const dx = (pos[f][0] - root[0]) / h, dz = (pos[f][2] - root[2]) / h;
    return [dx * c - dz * s, 0.012 + air[f] / h, dx * s + dz * c];
  };
  return { root, yaw, legPose: { L: { ankle: local("L") }, R: { ankle: local("R") } }, feetWorld: pos, air };
};

/** turn in place to yaw `to` with two lifted steps (the foot on the turning side first), root fixed */
export const turnInPlace = (st: Stance, to: number, t0: number, t1: number, height: number): { feet: FootEvent[]; body: BodyKey[]; end: Stance } => {
  let d = to - st.yaw;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  // +yaw turns toward local +x = the character's anatomical LEFT; code foot "R" is the +x (anatomical left) foot, so a
  // left turn leads with code "R" (the foot on the turning side moves first)
  const first: FootId = d > 0 ? "R" : "L";
  const second: FootId = first === "L" ? "R" : "L";
  const end = stanceAt(st.root, to, height);
  const mid = t0 + (t1 - t0) * 0.5;
  return {
    feet: [
      { foot: first, to: end[first], t0, t1: mid - 0.02 },
      { foot: second, to: end[second], t0: mid + 0.02, t1 },
    ],
    body: [{ t: t0, root: st.root, yaw: st.yaw }, { t: t1, root: st.root, yaw: to }],
    end,
  };
};

/** walk from a stance to a root/yaw in n alternating lifted steps (the last one closes beside the other foot);
 * the root moves continuously over [t0, t1] (ease in/out), each foot lands ahead of it */
export const walkSteps = (st: Stance, toRoot: V3, toYaw: number, n: number, t0: number, t1: number, height: number, first?: FootId): { feet: FootEvent[]; body: BodyKey[]; end: Stance } => {
  const end = stanceAt(toRoot, toYaw, height);
  const dir: V3 = [toRoot[0] - st.root[0], 0, toRoot[2] - st.root[2]];
  // the first foot: the one behind along the walking direction (or given)
  const along = (p: V3) => (p[0] - st.root[0]) * dir[0] + (p[2] - st.root[2]) * dir[2];
  const f0: FootId = first ?? (along(st.L) <= along(st.R) ? "L" : "R");
  const feet: FootEvent[] = [];
  const dt = (t1 - t0) / n;
  for (let i = 1; i <= n; i++) {
    const f: FootId = i % 2 === 1 ? f0 : f0 === "L" ? "R" : "L";
    const k = i === n ? 1 : Math.min(1, (i + 0.5) / n); // land half a step ahead of the root, the last closes the stance
    const rootK: V3 = [mix(st.root[0], toRoot[0], k), 0, mix(st.root[2], toRoot[2], k)];
    const y = yawMix(st.yaw, toYaw, k);
    const to = i >= n - 1 ? end[f] : footAt(rootK, y, f, height);
    const a = t0 + (i - 1) * dt + (i === 1 ? 0.04 : 0), b = t0 + i * dt - 0.04;
    feet.push({ foot: f, to, t0: a, t1: Math.max(a + 0.12, b) });
  }
  return { feet, body: [{ t: t0, root: st.root, yaw: st.yaw }, { t: t1, root: toRoot, yaw: toYaw, ease: n >= 4 ? "trap" : "smooth" }], end };
};

/** concatenate move blocks into one Moves */
export const chain = (start: Stance, height: number, blocks: { feet: FootEvent[]; body: BodyKey[] }[], lift?: number): Moves => ({
  start, height, lift, feet: blocks.flatMap((b) => b.feet), body: blocks.flatMap((b) => b.body),
});
