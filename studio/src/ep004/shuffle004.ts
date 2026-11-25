// Episode 3 (2026-11-004), D-055: side "step-close" (geser-rapat) for the S10 retreat option (c), owner 2026-11-20.
// The foot on the travel side steps first, the other foot closes beside it and never passes it, so the feet cannot cross
// by construction (cast/stepper.ts walkSteps alternates feet and crosses them on paths > ~30° sideways, D-053).
// Same data model as cast/stepper.ts (lifted FootEvents, BodyKeys); stepper.ts itself is not changed. Pure functions of t.
import { stanceAt, yawMix } from "../cast/stepper";
import type { BodyKey, FootEvent, FootId, Stance } from "../cast/stepper";
import type { V3 } from "../inkbeat/types";

const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** trapezoid progress (accelerate 25 %, cruise, decelerate 25 %), same profile as stepper's "trap" */
const trap = (u: number, a = 0.25) => {
  const x = clamp01(u), v = 1 / (1 - a);
  if (x < a) return (v * x * x) / (2 * a);
  if (x > 1 - a) return 1 - (v * (1 - x) * (1 - x)) / (2 * a);
  return v * (a / 2) + v * (x - a);
};

/**
 * Step-close from a stance to `toRoot` in n cycles over [t0, t1]. Each cycle: the lead foot (travel side) lifts and
 * lands at the next stance, then the trail foot closes to the next stance. `yawAt(root)` gives the body yaw at a root
 * (e.g. facing a point); the last cycle ends at `yawAt(toRoot)`.
 * body "pulse": root/yaw eased per cycle (the body shifts with each step-close and settles);
 * body "glide": root moves on one trapezoid over [t0, t1] (dense keys every 1/30 s), yaw from yawAt on the way.
 */
/** owner D-056: the step length as a knob. Cycles needed for a path of `dist` m with steps of at most `stepLen` m (the
 * travel-side foot's step per cycle). S10 today: 3 cycles = Uq 0.32 m, adik 0.35 m. */
export const cyclesFor = (dist: number, stepLen: number) => Math.max(1, Math.ceil(dist / stepLen - 1e-9));
export const sideShuffle = (
  st: Stance, toRoot: V3, yawAt: (root: V3) => number, n: number, t0: number, t1: number, height: number, body: "pulse" | "glide",
): { feet: FootEvent[]; body: BodyKey[]; end: Stance; lead: FootId } => {
  const dir: V3 = [toRoot[0] - st.root[0], 0, toRoot[2] - st.root[2]];
  // local +x (code foot "R") is the character's anatomical left: (cos yaw, −sin yaw) in world xz
  const side = dir[0] * Math.cos(st.yaw) - dir[2] * Math.sin(st.yaw);
  const lead: FootId = side > 0 ? "R" : "L";
  const trail: FootId = lead === "R" ? "L" : "R";
  const rootAt = (k: number): V3 => [mix(st.root[0], toRoot[0], k), 0, mix(st.root[2], toRoot[2], k)];
  const feet: FootEvent[] = [];
  const keys: BodyKey[] = [{ t: t0, root: st.root, yaw: st.yaw }];
  const dt = (t1 - t0) / n;
  for (let i = 1; i <= n; i++) {
    const r = rootAt(i / n), y = yawAt(r);
    const s = stanceAt(r, y, height);
    const c0 = t0 + (i - 1) * dt;
    feet.push({ foot: lead, to: s[lead], t0: c0 + 0.02, t1: c0 + 0.5 * dt - 0.02 });
    feet.push({ foot: trail, to: s[trail], t0: c0 + 0.5 * dt + 0.02, t1: c0 + dt - 0.02 });
    if (body === "pulse") keys.push({ t: c0 + dt, root: r, yaw: y });
  }
  if (body === "glide") {
    const m = Math.max(2, Math.round((t1 - t0) * 30));
    for (let j = 1; j <= m; j++) {
      const r = rootAt(trap(j / m));
      // yaw: from the start yaw into the facing yaw over the first cycle, then facing
      const y = yawMix(st.yaw, yawAt(r), clamp01((j / m) * n));
      keys.push({ t: t0 + ((t1 - t0) * j) / m, root: r, yaw: y });
    }
  }
  return { feet, body: keys, end: stanceAt(toRoot, yawAt(toRoot), height), lead };
};
