// C1 arm IK that respects C1's own upper-body transform (c1UpperMatrix: lean / roll / twist / bob about the hip),
// for hands planted on a surface while the body moves (2026-11-17, pilot A03: pushing up from the mattress).
// inkbeat's solveArm models lean about the feet, so it misplaces the hands once C1 leans about the hip.
// Search: coarse grid + refinement over (shoulder, elbow, arm-plane forward), with a small pull toward a reference pose
// so neighbouring frames pick the same elbow solution (no flips between frames). Pure function: cached by inputs.
import * as THREE from "three";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import { teeSurface } from "./C1";
import { C1_BUILD, C1_HEIGHT, c1UpperMatrix } from "./c1rig";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
export type C1Body = { lean?: number; roll?: number; twist?: number; bob?: number };
type Q = [number, number, number];

/** the palm centre of one arm in world space for C1 (side "L" = C1's own right, as in C1.tsx) */
export const c1HandWorld = (q: Q, side: "L" | "R", root: V3, yaw: number, body: C1Body, height = C1_HEIGHT): THREE.Vector3 => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  const { H } = armChain(pose, side, LAY);
  return H.applyMatrix4(c1UpperMatrix(body)).multiplyScalar(height).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
};

/** how deep the arm's CENTRE LINE goes inside C1's torso (the tee surface), in metres at `height` (0 = outside). An arm
 * pressed against the side is still half visible and is not counted; a centre line inside the tee means the arm is
 * hidden in the body (it "disappears", then "comes out of the torso"). Samples run from the sleeve end (55 % of the upper
 * arm: its root is inside the sleeve by design) through the forearm to the palm centre. Upper-body frame, so the test
 * does not depend on the lean. 2026-11-17. */
const radii = new Map<number, [number, number]>();
const torsoRadii = (v: number): [number, number] => {
  const k = Math.round(v * 200);
  const hit = radii.get(k);
  if (hit) return hit;
  const r: [number, number] = [Math.abs(teeSurface(0.999, k / 200).p.x), Math.abs(teeSurface(0, k / 200).p.z)];
  radii.set(k, r);
  return r;
};
export const c1ArmTorsoDepth = (q: Q, side: "L" | "R", height = C1_HEIGHT): number => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  const { S, E, H } = armChain(pose, side, LAY);
  let worst = 0;
  const test = (p: THREE.Vector3) => {
    const v = (p.y - LAY.torsoY0) / LAY.torsoH;
    if (v < 0.02 || v > 0.98) return;
    const [rx, rz] = torsoRadii(v);
    const e = Math.sqrt((p.x / rx) ** 2 + (p.z / rz) ** 2);
    if (e < 1) worst = Math.max(worst, (1 - e) * Math.min(rx, rz));
  };
  for (let i = 0; i <= 8; i++) test(S.clone().lerp(E, 0.55 + (0.45 * i) / 8));
  for (let i = 1; i <= 10; i++) test(E.clone().lerp(H, i / 10));
  return worst * height;
};

const cache = new Map<string, { arm: [number, number]; fwd: number; err: number }>();
/** solve one arm so its palm reaches `target`; `ref` = the preferred pose [shoulder, elbow, forward] (degrees) */
/** wMin: start of the 180°-wide arm-plane window (default -90 → [-90, 90]); pick it so the motion never crosses the
 * window edge (a reach out to the side sits near w = 90: use e.g. -30 → [-30, 150]) */
/** avoidTorso (2026-11-17): add 4 x the arm's depth inside the torso to the cost, so a reachable target is reached with
 * the arm OUTSIDE the body (a solution that folds the forearm into the tee is never chosen when another exists) */
export const c1ArmIK = (o: { root: V3; yaw: number; body: C1Body; side: "L" | "R"; target: V3; ref: Q; height?: number; wMin?: number; avoidTorso?: boolean }) => {
  const w0 = o.wMin ?? -90;
  const bMin = o.avoidTorso ? -20 : 0;
  const key = [o.side, w0, o.avoidTorso ? 1 : 0, ...o.root, o.yaw, o.body.lean ?? 0, o.body.roll ?? 0, o.body.twist ?? 0, o.body.bob ?? 0, ...o.target, ...o.ref].map((v) => (typeof v === "number" ? v.toFixed(4) : v)).join("|");
  const hit = cache.get(key);
  if (hit) return hit;
  const M = c1UpperMatrix(o.body);
  const h = o.height ?? C1_HEIGHT;
  const T = new THREE.Vector3(...o.target);
  const rootV = new THREE.Vector3(...o.root);
  const cost = (q: Q) => {
    const pose = o.side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
    const p = armChain(pose, o.side, LAY).H.applyMatrix4(M).multiplyScalar(h).applyAxisAngle(UP, o.yaw).add(rootV);
    const e = p.distanceTo(T);
    // 0.00004 m per degree away from the reference: reach wins; the reference only breaks ties between near-equal
    // solutions (1 cm of reach error ~ 250 degrees of pose change)
    const reg = 0.00004 * (Math.abs(q[0] - o.ref[0]) + Math.abs(q[1] - o.ref[1]) + 0.5 * Math.abs(q[2] - o.ref[2]));
    const pen = o.avoidTorso && e < 0.12 ? 4 * c1ArmTorsoDepth(q, o.side, h) : 0;
    return { c: e + reg + pen, e };
  };
  let best: { q: Q; c: number; e: number } = { q: o.ref, ...cost(o.ref) };
  // the shoulder may swing behind the body (a < 0 in a forward arm plane): a hand planted behind the hip needs it
  for (let a = -80; a <= 170; a += 10)
    for (let b = bMin; b <= 150; b += 10)
      // (a, w) and (-a, w + 180) are the same arm: keep w in [-90, 90] so the search has one answer per pose (no flips)
      for (let w = w0; w <= w0 + 180; w += 10) {
        const r = cost([a, b, w]);
        if (r.c < best.c) best = { q: [a, b, w], ...r };
      }
  for (const st of [5, 2.5, 1.2, 0.6])
    for (let i = 0; i < 4; i++)
      for (const d of [[st, 0, 0], [-st, 0, 0], [0, st, 0], [0, -st, 0], [0, 0, st], [0, 0, -st]] as Q[]) {
        const q: Q = [Math.max(-90, best.q[0] + d[0]), Math.max(bMin, best.q[1] + d[1]), Math.min(w0 + 180, Math.max(w0, best.q[2] + d[2]))];
        const r = cost(q);
        if (r.c < best.c) best = { q, ...r };
      }
  const out = { arm: [best.q[0], best.q[1]] as [number, number], fwd: best.q[2], err: best.e };
  if (cache.size > 6000) cache.clear();
  cache.set(key, out);
  return out;
};
