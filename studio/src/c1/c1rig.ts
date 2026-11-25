// C1 rig numbers and transforms with no React / DOM dependency (rev1, 2026-11-15), shared by C1.tsx (drawing),
// reach.ts (the demo's hand IK) and tools/c1_reach_check.ts (numeric checks in Node).
import * as THREE from "three";
import type { Build } from "../inkbeat/char/family";
import { layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";

export const C1_HEIGHT = 1.5;
/** layout overrides that reproduce the measured proportions inside inkbeat's skeleton */
// rev1 (2026-11-15): the shoulder joint sits high at the tee's shoulder corner (inkbeat default 0.83 left it ~17% of
// the torso below the top, so the sleeves hung low and detached); IK reads the same joint through layoutOf.
export const C1_BUILD: Partial<Build> = { headScale: 0.77, torso: "block", torsoWidth: 0.85, torsoDepth: 0.95, torsoHeight: 1.13, armLength: 1.4, neck: 2.3, shoulderT: 0.91, shoulderIn: 0.78 };
const L = layoutOf(C1_BUILD);
const D2R = Math.PI / 180;
const UP = new THREE.Vector3(0, 1, 0);
/** sleeve design numbers (h = 1): armhole ring (inside the torso, below and in from the shoulder joint), cuff ring */
export const SLEEVE = { armholeIn: 0.8, armholeDrop: 0.012, rA: 0.03, rC: 0.033, len: 0.088, out: 0.022, flare: 0.65 };
/** the hand pivots at the wrist: the palm center sits this far (h = 1) from the wrist along the hand */
export const WRIST_OFF = 0.012;
/** wrist override (upper-body frame): finger direction, palm normal (the side the fingers curl to), curl (deg), blend */
export type C1Hand = { dir: V3; palm: V3; curl?: number; w?: number };

/** rev1: the upper body (torso, sleeves, arms, neck, head) moves as one rigid block about the hip joint, so a seated
 * C1 can lean (forward, deg), roll (sideways, + = toward its own right / -x) and twist (about the vertical, + = chest
 * toward its own left) without sliding the hips. The same matrix drives the drawing and c1UpperToWorld (reach IK), so
 * a hand placed by IK is exactly where the drawn hand is. Character frame, h = 1, before the root yaw. */
export const c1UpperMatrix = (pose: { lean?: number; roll?: number; twist?: number; bob?: number }) => {
  const pv = new THREE.Vector3(0, L.hipY, 0);
  return new THREE.Matrix4()
    .makeRotationY((pose.twist ?? 0) * D2R)
    .multiply(new THREE.Matrix4().makeTranslation(pv.x, pv.y, pv.z))
    .multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler((pose.lean ?? 0) * D2R, 0, (pose.roll ?? 0) * D2R, "XYZ")))
    .multiply(new THREE.Matrix4().makeTranslation(-pv.x, -pv.y + (pose.bob ?? 0) / 430, -pv.z));
};
/** a point of the upper-body frame (h = 1, e.g. from armChain) to world space */
export const c1UpperToWorld = (p: THREE.Vector3, root: V3, yaw: number, pose: { lean?: number; roll?: number; twist?: number; bob?: number }, height = C1_HEIGHT): THREE.Vector3 =>
  p.clone().applyMatrix4(c1UpperMatrix(pose)).multiplyScalar(height).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
/** a world direction to the upper-body frame (root yaw + c1UpperMatrix rotation undone) */
export const c1WorldDirToUpper = (v: V3, yaw: number, pose: { lean?: number; roll?: number; twist?: number }): V3 => {
  const q = new THREE.Quaternion();
  c1UpperMatrix(pose).decompose(new THREE.Vector3(), q, new THREE.Vector3());
  const r = new THREE.Vector3(...v).applyAxisAngle(UP, -yaw).applyQuaternion(q.invert());
  return [r.x, r.y, r.z];
};
/** elbow swivel (rev1): turn the elbow about the shoulder→hand axis by `deg` (+ = the elbow swings out to the arm's
 * own side and up), so the elbow can clear a table top. The hand does not move, so inkbeat's IK (core/ik.ts, which
 * only places the hand) stays valid. inkbeat's arm otherwise moves in a vertical plane. side: -1 = "L", +1 = "R". */
export const c1Swivel = (S: THREE.Vector3, E: THREE.Vector3, H: THREE.Vector3, side: number, deg: number) => {
  if (!deg) return E;
  const a = H.clone().sub(S);
  if (a.lengthSq() < 1e-10) return E;
  a.normalize();
  const c = S.clone().addScaledVector(a, E.clone().sub(S).dot(a));
  const m = new THREE.Vector3().crossVectors(a, E.clone().sub(c));
  const sg = m.x * side + m.y * 0.5 >= 0 ? 1 : -1;
  return E.clone().sub(c).applyAxisAngle(a, sg * deg * D2R).add(c);
};
