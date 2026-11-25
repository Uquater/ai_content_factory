// Episode 2026-11-003 look-dev v3 (owner decisions 2026-11-18, D-038): one source of truth for the v3 stills, read by
// the composition (LookDev003.tsx, LookDev003v3) AND the checks (tools/ld003_v3_calc.ts, tools/ld003_clearance.ts).
// v2 (ld003Scene.ts) is untouched. Pure data + pure functions (no React, no time).
//   s03s  — S03 opening from behind, adik small at the frame edge, camera WEST of the Uq–adik line
//   r05w  — S05 reaction (recommended alternative): west-south-west of the kitchen at >= 2.2 m, Uq glances back over his
//           left shoulder on the toa line, face lit from below by the torch light leaking through the cupping fingers
//   r05d  — S05 reaction as the owner proposed: close-up from the door side. Evidence still; it BREAKS the 2.2 m rule
//   a3g1/a3g2 — still a with the left fingers wrapped round the phone (two grip candidates)
import * as THREE from "three";
import { C1_BUILD, C1_HEIGHT, WRIST_OFF } from "../c1/c1rig";
import type { C1Hand } from "../c1/c1rig";
import { layoutOf, armChain } from "../inkbeat/char/skeleton";
import type { ArmPose } from "../inkbeat/char/skeleton";
import { solveArm } from "../inkbeat/core/ik";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { ADIK_HEIGHT, ADIK_REST, AIM, BOLT, NORTH, UQ_HALL, uqAtDoor } from "./ld003Scene";
import type { Char } from "./ld003Scene";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const D2R = Math.PI / 180;
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const solve = (root: V3, yaw: number, side: "L" | "R", target: V3) => solveArm({ position: root, yaw, side, target, height: C1_HEIGHT, build: C1_BUILD });

/** phone pose in world space: centre + quaternion of a box whose local axes are x = width (0.072), y = length (0.15),
 * z = thickness (0.009), screen on local -z */
export type PhoneV3 = { p: V3; q: [number, number, number, number]; aim?: V3; screen?: number };
export type ViewV3 = {
  id: string; label: string; cam: Cam; focus: V3; chars: Char[]; phone: PhoneV3;
  torch?: { from: V3; aim: V3; cover: number; leak: number; leakAt: V3 };
  face?: { eyes?: "open" | "closed" | "down"; brows?: "neutral" | "worried" | "raised"; mouth?: "flat" | "frown" | "open" };
  exposure?: number; ruleBreak?: string;
  /** scale of the per-character fill/rim (CharLight); < 1 lets a practical (the leak) dominate the face */
  charK?: number;
};

// ------------------------------------------------------------------ hand frame (replicates C1.tsx handQuat, w = 1)
/** world frame of a C1 hand with an explicit wrist override: origin = the wrist, axes x (thumb side for "L"), y =
 * fingers, z = back of the hand (the palm faces -z). Same maths as C1.tsx (hand group at `wrist`, quaternion from
 * dir/palm in the upper-body frame), then scale by height, yaw, root. No lean/twist (standing, upright). */
export const handFrame = (pose: ArmPose, side: "L" | "R", o: C1Hand, root: V3, yaw: number, height = C1_HEIGHT) => {
  const { E, H } = armChain(pose, side, LAY);
  const fore = H.clone().sub(E).normalize();
  const wrist = H.clone().addScaledVector(fore, -WRIST_OFF);
  const y = new THREE.Vector3(...o.dir).normalize();
  const z = new THREE.Vector3(...o.palm).negate();
  z.addScaledVector(y, -z.dot(y)).normalize();
  const x = new THREE.Vector3().crossVectors(y, z);
  const qLocal = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  const qYaw = new THREE.Quaternion().setFromAxisAngle(UP, yaw);
  const q = qYaw.clone().multiply(qLocal);
  const origin = wrist.clone().multiplyScalar(height).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
  /** hand-frame point (h = 1 units, as in C1.tsx) to world */
  const toWorld = (p: THREE.Vector3) => p.clone().multiplyScalar(height).applyQuaternion(q).add(origin);
  return { q, origin, toWorld, fore };
};

/** C1 "fingers" hand geometry in the hand frame (C1.tsx): finger i base at (x_i, WRIST_OFF + 0.008, 0), capsule radius
 * 0.0037 and straight length (len + 2r) along +y rotated about x by -curl·(0.8 + 0.1 i). Returns sample points along
 * each finger (h = 1 units) for the contact check. Thumb: base (-s·0.011, WRIST_OFF - 0.006, 0.003). */
export const fingerSamples = (curlDeg: number) => {
  const spread = [-0.009, -0.003, 0.003, 0.009];
  const out: { p: THREE.Vector3; finger: number; tip: boolean }[] = [];
  spread.forEach((x, i) => {
    const len = (i === 0 || i === 3 ? 0.010 : 0.013) + 2 * 0.0037;
    const a = -curlDeg * D2R * (0.8 + 0.1 * i);
    const dir = new THREE.Vector3(0, Math.cos(a), Math.sin(a));
    for (let k = 0; k <= 6; k++) {
      const s = 0.0037 + ((len - 2 * 0.0037) * k) / 6;
      out.push({ p: new THREE.Vector3(x, WRIST_OFF + 0.008, 0).addScaledVector(dir, s), finger: i, tip: k === 6 });
    }
  });
  return out;
};
export const FINGER_R = 0.0037; // h units
export const PALM_HALF = { x: 0.0125, y: 0.0135, z: 0.0075 }; // palm ellipsoid half-axes (h units), centre (0, WRIST_OFF, 0)
export const PHONE = { w: 0.072, l: 0.15, t: 0.009 }; // world metres (Ep 1 A07 phone 0.075 × 0.155; v2 look-dev 0.072 × 0.15)

/** a grip: the hand override + where the phone sits in the hand frame (h = 1 units) and how it is turned there
 * (`long`: the phone's long axis along the hand's x or y). The phone's back lies on the palm surface (z = -PALM_HALF.z),
 * one long edge just short of the finger roots, so the curled fingers close over that edge onto the screen. */
export type Grip = { hand: C1Hand; edgeY: number; long: "x" | "y"; slide: number; gap: number };
export const GRIPS: Record<"g1" | "g2", Grip> = {
  // g1: palm toward the front-low, fingers point down-forward; the phone lies across the palm (long axis across the
  //     hand), screen to the front; fingers wrap its lower long edge
  g1: { hand: { dir: [0.0, -0.82, 0.57], palm: [0.0, 0.57, 0.82], curl: 90, w: 1 }, edgeY: 0.014, long: "x", slide: 0, gap: 0.0002 },
  // g2 (palm turned 45° toward the lens so the screen shows): palm facing out (away from the thigh), fingers point forward-down; the phone stands upright along the side of
  //     the leg (long axis vertical), screen outward; fingers wrap its front long edge
  g2: { hand: { dir: [-0.35, -0.5, 0.79], palm: [0.7, 0, 0.7], curl: 90, w: 1 }, edgeY: 0.014, long: "x", slide: 0, gap: 0.0002 },
};

/** phone placement for a grip, in world space, + the data the check needs */
export const gripPhone = (pose: ArmPose, side: "L" | "R", g: Grip, root: V3, yaw: number) => {
  const hf = handFrame(pose, side, g.hand, root, yaw);
  const tH = PHONE.t / C1_HEIGHT;
  const wH = (g.long === "x" ? PHONE.w : PHONE.l) / C1_HEIGHT; // extent along hand y
  // phone centre in the hand frame: below the edge by half its extent along y, behind the palm surface (toward -z)
  const cLocal = new THREE.Vector3(g.slide, g.edgeY - wH / 2, -PALM_HALF.z - tH / 2 - g.gap);
  const p = hf.toWorld(cLocal);
  // phone box local axes: long axis (box y) along hand x when long = "x" (rotate 90° about z), screen (box -z) = hand -z
  const qBox = g.long === "x" ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2) : new THREE.Quaternion();
  const q = hf.q.clone().multiply(qBox);
  return { p, q, hf, cLocal, extent: { x: (g.long === "x" ? PHONE.l : PHONE.w) / C1_HEIGHT, y: wH, z: tH } };
};

// ------------------------------------------------------------------ still a v3 (hallway, phone in the LEFT hand = code "R")
const uqHallGrip = (g: "g1" | "g2") => {
  const target: V3 = [UQ_HALL[0] - 0.2, 0.74, UQ_HALL[2] - 0.04];
  const qR = solve(UQ_HALL, NORTH, "R", target);
  const pose: ArmPose = { armR: qR.arm, armRFwd: qR.fwd };
  const gp = gripPhone(pose, "R", GRIPS[g], UQ_HALL, NORTH);
  const char: Char = { who: "uq", root: UQ_HALL, yaw: NORTH, height: C1_HEIGHT, pose, hands: { R: GRIPS[g].hand } };
  return { char, phone: { p: [gp.p.x, gp.p.y, gp.p.z] as V3, q: [gp.q.x, gp.q.y, gp.q.z, gp.q.w] as [number, number, number, number] } };
};

// ------------------------------------------------------------------ S05: after the click (two steps in), the right
// palm comes back to cup the torch; the phone (left hand) still points at the door below the bolt
export const UQ_STEPPED: V3 = [-0.92, 0, -4.38];
const uqCupped = (yawTurn: number, headYaw: number, headNod: number) => {
  const yaw = NORTH + yawTurn * D2R;
  const fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const side = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)); // character's +x (anatomical left) in world
  // left hand (code "R") holds the phone in front of the chest, slightly to the left
  const target = new THREE.Vector3(...UQ_STEPPED).addScaledVector(fwd, 0.3).addScaledVector(side, 0.07).setY(1.12);
  const qR = solve(UQ_STEPPED, yaw, "R", [target.x, target.y, target.z]);
  const palm = armChain({ armR: qR.arm, armRFwd: qR.fwd }, "R", LAY).H.multiplyScalar(C1_HEIGHT).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...UQ_STEPPED));
  const p = palm.clone().addScaledVector(fwd, 0.03).setY(palm.y + 0.02);
  // right palm over the LED on the phone's back (the side toward the door), a little above its centre
  const cup = p.clone().addScaledVector(fwd, 0.035).addScaledVector(side, -0.01).setY(p.y + 0.03);
  const qL = solve(UQ_STEPPED, yaw, "L", [cup.x, cup.y, cup.z]);
  const aim: V3 = [BOLT[0], BOLT[1] - 0.25, BOLT[2]]; // the beam rests on the door just under the bolt
  const dir = new THREE.Vector3(aim[0] - p.x, aim[1] - p.y, aim[2] - p.z).normalize();
  // box +z (the back, with the LED) toward the aim, so the screen (-z) faces Uq: the same convention as v2Phone (S03)
  const qPhone = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
  const char: Char = {
    who: "uq", root: UQ_STEPPED, yaw, height: C1_HEIGHT,
    pose: { armR: qR.arm, armRFwd: qR.fwd, armL: qL.arm, armLFwd: qL.fwd, headYaw, headNod },
    // right hand ("L"): fingers up, palm facing back toward the phone's back (local -z), cupped
    hands: { R: { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 }, L: { dir: [0.15, 0.95, 0.2], palm: [0.2, 0, -1], curl: 45, w: 1 } },
  };
  // the leak: light escaping between the cupping fingers, just above the phone, toward the face
  const leakAt = p.clone().addScaledVector(fwd, -0.04).setY(p.y + 0.06);
  return {
    char,
    phone: { p: [p.x, p.y, p.z] as V3, q: [qPhone.x, qPhone.y, qPhone.z, qPhone.w] as [number, number, number, number], aim },
    torch: { from: [p.x, p.y, p.z] as V3, aim, cover: 0.45, leak: 1.2, leakAt: [leakAt.x, leakAt.y, leakAt.z] as V3 },
  };
};

// ------------------------------------------------------------------ adik
/** S03 v3: adik at the WEST side of the hallway mouth (storyboard S02: she stops at the mouth by the west jamb) */
export const ADIK_MOUTH_W: V3 = [-1.12, 0, -0.95];
/** S03 v3 (chosen by the numbers, tools/ld003_v3_calc.ts): adik at the EAST side of the mouth, so a camera WEST of the
 * Uq–adik line sees her at the right frame edge, off Uq's sight line (from the west half she stays mid-frame) */
export const ADIK_MOUTH_E: V3 = [-0.5, 0, -0.95];
const adik = (root: V3, yaw = NORTH): Char => ({ who: "adik", root, yaw, height: ADIK_HEIGHT, pose: { ...ADIK_REST } });

// ------------------------------------------------------------------ cameras
export const CAMS3 = {
  // S03: back of the living room, WEST of the Uq–adik line, raised a little so adik sits low at the right edge
  s03s: cam([-1.1, 1.95, 2.85], [-0.95, 1.45, -4.6], 28),
  // S03 (i) with a wider lens (fov 40), re-aimed west so adik stays at the right edge (head ~11 % instead of ~16 %)
  s03L: cam([-1.1, 1.95, 2.85], [-1.4, 1.45, -4.6], 40),
  // S03 alternative: adik stays at the WEST side (S02 jamb hold, S07–S12 pairing unchanged); camera further west
  s03w: cam([-1.72, 1.95, 2.85], [-0.86, 1.35, -4.6], 30),
  // S05 recommended: kitchen, west-south-west of Uq, >= 2.2 m, just north of the kitchen–hallway wall
  r05w: cam([-3.0, 1.42, -3.55], [-1.05, 1.27, -4.5], 30),
  // S05 owner proposal: between Uq's face and the door leaf, 6 cm in front of the door, looking back at the face
  r05d: cam([-0.96, 1.34, -4.87], [-0.92, 1.3, -4.38], 70),
  a3: cam([-1.0, 1.4, -4.45], [-0.85, 1.12, -1.6], 50),
};

const V = (v: Omit<ViewV3, "chars"> & { chars: Char[] }): ViewV3 => v;
const cupW = uqCupped(30, 50, 6); // body turned 30° to his left (west), head another 50°: he turns his face away from the door (~80° W of N; NOT toward adik, who is south)
const cupD = uqCupped(0, 0, 6);
const s03Uq = uqAtDoor("knob");
const s03Glass = uqAtDoor("glass"); // the top of the sweep (v2 pose for the glass aim) // same stand-off pose as v2 s03 (palm-covered torch on the knob area)
const a1 = uqHallGrip("g1");
const a2 = uqHallGrip("g2");

const v2Phone = (ph: { p: V3; aim?: V3 }) => {
  // v2 phone at the door: box turned to its aim (same rotation as PhoneV2 in LookDev003.tsx)
  const aim = ph.aim ?? AIM.knob;
  const yaw = Math.atan2(aim[0] - ph.p[0], aim[2] - ph.p[2]);
  const pitch = Math.atan2(aim[1] - ph.p[1], Math.hypot(aim[0] - ph.p[0], aim[2] - ph.p[2]));
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-pitch, 0, 0)));
  return { p: ph.p, q: [q.x, q.y, q.z, q.w] as [number, number, number, number], aim };
};

export const LD003_V3: ViewV3[] = [
  V({ id: "s03s", label: "S03 v3 · dari belakang, adik kecil di tepi kanan, kamera barat garis", cam: CAMS3.s03s, focus: [-0.95, 1.3, -3.9], chars: [s03Uq.char, adik(ADIK_MOUTH_E)], phone: v2Phone(s03Uq.phone), torch: { from: s03Uq.phone.p, aim: AIM.knob, cover: 0.45, leak: 0.12, leakAt: s03Uq.phone.p }, face: { eyes: "open", brows: "worried", mouth: "flat" } }),
  V({ id: "s03L", label: "S03 v3 (i) lensa 40° · adik tepi kanan · senter di kaca (puncak sapuan)", cam: CAMS3.s03L, focus: [-0.95, 1.6, -4.0], chars: [s03Glass.char, adik(ADIK_MOUTH_E)], phone: v2Phone(s03Glass.phone), torch: { from: s03Glass.phone.p, aim: AIM.glass, cover: 0.45, leak: 0.12, leakAt: s03Glass.phone.p }, face: { eyes: "open", brows: "worried", mouth: "flat" } }),
  V({ id: "s03w", label: "S03 v3 alt · adik tetap di sisi barat (tengah-kanan bawah), kamera barat garis", cam: CAMS3.s03w, focus: [-0.95, 1.3, -3.9], chars: [s03Uq.char, adik(ADIK_MOUTH_W)], phone: v2Phone(s03Uq.phone), torch: { from: s03Uq.phone.p, aim: AIM.knob, cover: 0.45, leak: 0.12, leakAt: s03Uq.phone.p }, face: { eyes: "open", brows: "worried", mouth: "flat" } }),
  V({ id: "a3g1", label: "a v3 · genggaman g1 (ponsel melintang, jari di tepi bawah)", cam: CAMS3.a3, focus: [-0.72, 1.2, -2.15], chars: [a1.char, adik([-1.0, 0, -0.95])], phone: a1.phone, exposure: -0.12, face: { eyes: "open", brows: "worried", mouth: "flat" } }),
  V({ id: "a3g2", label: "a v3 · genggaman g2 (ponsel tegak, jari di tepi depan)", cam: CAMS3.a3, focus: [-0.72, 1.2, -2.15], chars: [a2.char, adik([-1.0, 0, -0.95])], phone: a2.phone, exposure: -0.12, face: { eyes: "open", brows: "worried", mouth: "flat" } }),
  V({ id: "r05w", label: "S05 reaksi · barat-barat daya 2,24 m · membeku, menoleh ke kiri menjauhi pintu", cam: CAMS3.r05w, focus: [-0.95, 1.38, -4.4], chars: [cupW.char], phone: cupW.phone, torch: cupW.torch, face: { eyes: "open", brows: "raised", mouth: "flat" }, charK: 0.3 }),
  V({ id: "r05d", label: "S05 reaksi · usulan: dari arah pintu (MELANGGAR 2,2 m)", cam: CAMS3.r05d, focus: [-0.92, 1.33, -4.38], chars: [cupD.char], phone: cupD.phone, torch: cupD.torch, face: { eyes: "open", brows: "raised", mouth: "flat" }, charK: 0.3, ruleBreak: "kamera ± 0,4 m dari wajah" }),
];
export const LD003_V3_IDS = LD003_V3.map((v) => v.id);
