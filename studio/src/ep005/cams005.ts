// Episode 4 (2026-11-005) opening animatic: shot windows and cameras, pure functions (shared by the composition and
// tools/m005_check.ts). World time w (s) = motion005.ts time. Variant A = every shot plays in real time (no ellipsis);
// variant B = the carry between S02 and S03 is cut out (match on action: S03 starts as Uq arrives under the corner).
import * as THREE from "three";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { DEST, EV, uqAtPublic } from "./motion005";

export type Variant = "A" | "B" | "C";
export type ShotId = "S01" | "S02" | "S03" | "S04";
export type Seg = { id: ShotId; w0: number; w1: number };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];

export const SEGS: Record<Variant, Seg[]> = {
  A: [{ id: "S01", w0: 0, w1: 2.2 }, { id: "S02", w0: 2.2, w1: 3.9 }, { id: "S03", w0: 3.9, w1: EV.toa }, { id: "S04", w0: EV.toa, w1: EV.end }],
  B: [{ id: "S01", w0: 0, w1: 2.2 }, { id: "S02", w0: 2.2, w1: 3.9 }, { id: "S03", w0: 6.6, w1: EV.toa }, { id: "S04", w0: EV.toa, w1: EV.end }],
  // C = the simpler alternative: the lift is never shown; S02 (fan taken) cuts straight to the insert at the corner
  C: [{ id: "S01", w0: 0, w1: 2.2 }, { id: "S02", w0: 2.2, w1: 3.9 }, { id: "S04", w0: 7.4, w1: EV.end }],
};
export const totalFrames = (v: Variant) => Math.round(SEGS[v].reduce((a, s) => a + (s.w1 - s.w0), 0) * 30);
/** composition frame -> shot and world time */
export const locate = (v: Variant, frame: number) => {
  let acc = 0;
  for (const s of SEGS[v]) {
    const n = Math.round((s.w1 - s.w0) * 30);
    if (frame < acc + n) return { shot: s.id, w: s.w0 + (frame - acc) / 30, local: (frame - acc) / 30, dur: n / 30, shotStart: acc / 30 };
    acc += n;
  }
  const last = SEGS[v][SEGS[v].length - 1];
  return { shot: last.id, w: last.w1, local: last.w1 - last.w0, dur: last.w1 - last.w0, shotStart: acc / 30 };
};
export const CORNER: V3 = [0.86, 2.5, 2.84];

export const camAt = (shot: ShotId, w: number, u: number): Cam => {
  switch (shot) {
    case "S01": return { pos: lerp3([-3.3, 1.35, 1.9], [-3.2, 1.35, 1.8], u), look: [-1.4, 0.8, 0.3], fov: 58, roll: 0 };
    case "S02": return { pos: lerp3([-2.0, 1.45, 1.9], [-1.8, 1.45, 1.8], u), look: lerp3([0.3, 0.9, -0.2], [0.4, 1.0, 0.4], u), fov: 48, roll: 0 };
    case "S03": {
      const m = uqAtPublic(w);
      const follow = sm((w - 5.6) / 1.2);
      const look = lerp3([m.root[0], 1.15, m.root[2]], [0.75, 1.95, 2.7], follow);
      return { pos: lerp3([-1.5, 1.0, 0.9], [-1.2, 1.0, 1.4], sm((w - 3.9) / 4.4)), look, fov: 56, roll: 0 };
    }
    case "S04": return { pos: lerp3([-0.2, 2.1, 1.85], [-0.05, 2.05, 1.95], u), look: [0.82, 2.5, 2.82], fov: 32, roll: 0 };
  }
};
export const camFor = (v: Variant, frame: number): { cam: Cam; shot: ShotId; w: number; local: number; shotStart: number } => {
  const l = locate(v, frame);
  return { cam: camAt(l.shot, l.w, clamp01(l.local / Math.max(l.dur, 1e-6))), shot: l.shot, w: l.w, local: l.local, shotStart: l.shotStart };
};
/** is a world point inside the frame of a camera (9:16, vertical fov)? */
export const inFrame = (c: Cam, p: V3, margin = 0.02) => {
  const pc = new THREE.PerspectiveCamera(c.fov, 1080 / 1920, 0.02, 600);
  pc.position.set(...c.pos); pc.lookAt(...c.look); pc.updateMatrixWorld(true);
  const v = new THREE.Vector3(...p).project(pc);
  const front = new THREE.Vector3(...p).sub(pc.position).dot(new THREE.Vector3(...c.look).sub(new THREE.Vector3(...c.pos))) > 0;
  return front && Math.abs(v.x) <= 1 - margin && Math.abs(v.y) <= 1 - margin;
};
export { DEST };
