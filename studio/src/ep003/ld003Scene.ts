// Episode 2026-11-003 look-dev v2: one source of truth for every still's characters, phone, torch and camera.
// Used by the composition (LookDev003.tsx) AND the clearance check (tools/ld003_clearance.ts), so the numbers in the
// report describe exactly what is rendered. Pure data + pure functions (no React, no time).
import * as THREE from "three";
import { c1HandWorld } from "../c1/bodyIk";
import { C1_BUILD, C1_HEIGHT } from "../c1/c1rig";
import type { C1Hand } from "../c1/c1rig";
import type { ArmPose } from "../inkbeat/char/skeleton";
import { solveArm } from "../inkbeat/core/ik";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { HOUSE } from "../ep002/geo";

export const NORTH = Math.PI; // yaw facing -z (toward the back door)
export const ADIK_HEIGHT = 1.27; // ADIK preset (cast/npc.tsx)
export const ADIK_REST: ArmPose = { armL: [6, 84], armLFwd: 74, armR: [10, -4] }; // ADIK preset pose (jacket on the right forearm)

// ------------------------------------------------------------------ world points (storyboard v0.3 §3.2)
export const DOOR_Z = HOUSE.z0 + 0.06; // inside face of the north wall
export const KNOB: V3 = [-1.15, 1.0, DOOR_Z + 0.02];
export const GLASS: V3 = [-0.8, 2.32, DOOR_Z];
export const BOLT: V3 = [-0.95, 1.1, DOOR_Z + 0.02];
export const UQ_STAND: V3 = [-0.95, 0, -3.8];
/** v2: adik behind Uq, inside the hallway OPENING (x -1.4..-0.2 at z -1.0), not beside him and clear of both walls */
export const ADIK_MOUTH: V3 = [-1.0, 0, -0.95];
/** still a: Uq walking north in the hallway (east half), adik behind him at the mouth (not abreast) */
export const UQ_HALL: V3 = [-0.72, 0, -2.15];

export type TorchAim = "off" | "knob" | "glass" | "bolt";
export const AIM: Record<Exclude<TorchAim, "off">, V3> = { knob: KNOB, glass: GLASS, bolt: BOLT };

const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const solve = (root: V3, yaw: number, side: "L" | "R", target: V3, height = C1_HEIGHT) => solveArm({ position: root, yaw, side, target, height, build: C1_BUILD });

export type Char = { who: "uq" | "adik"; root: V3; yaw: number; height: number; pose: ArmPose & { headNod?: number; headYaw?: number }; hands?: { L?: C1Hand; R?: C1Hand } };
export type Phone = { p: V3; aim?: V3; side: boolean };
export type Diag = { torch?: boolean; cast?: boolean; ink?: boolean; castOld?: boolean };
export type View = { id: string; label: string; cam: Cam; aim: TorchAim; focus: V3; chars: Char[]; phone: Phone; exposure?: number; diag?: Diag; group: string };

/** Uq at the door: phone in the LEFT hand (code side "R") in front of the chest, right palm ("L") cupping the lens.
 * The phone is placed at the solved palm (c1HandWorld), not at the IK target, so it sits in the hand. */
export const uqAtDoor = (aim: TorchAim): { char: Char; phone: Phone } => {
  const target: V3 = [-1.02, 1.15, -4.02];
  const qR = solve(UQ_STAND, NORTH, "R", target);
  const palmR = c1HandWorld([qR.arm[0], qR.arm[1], qR.fwd], "R", UQ_STAND, NORTH, {});
  const fwd = new THREE.Vector3(0, 0, -1); // north
  // phone just in front of the left palm (between the palm and the door)
  const p: V3 = [palmR.x + 0.0, palmR.y + 0.02, palmR.z + fwd.z * 0.03];
  // right palm cups in front of the lens, a little below and to the west (open at the top / toward the aim)
  const cup: V3 = [p[0] + 0.05, p[1] - 0.02, p[2] - 0.06];
  const qL = solve(UQ_STAND, NORTH, "L", cup);
  const up = aim === "glass" ? 6 : -10;
  return {
    char: {
      who: "uq", root: UQ_STAND, yaw: NORTH, height: C1_HEIGHT,
      pose: { armR: qR.arm, armRFwd: qR.fwd, armL: qL.arm, armLFwd: qL.fwd, headNod: up },
      hands: { R: { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 }, L: { dir: [0.2, 0.7, 0.68], palm: [1, 0, -0.3], curl: 40, w: 0.9 } },
    },
    phone: { p, aim: aim === "off" ? undefined : AIM[aim], side: false },
  };
};

/** still a: Uq in the hallway, phone gripped in the LEFT hand at the side (fingers curled round it) */
const uqInHall = (): { char: Char; phone: Phone } => {
  const target: V3 = [UQ_HALL[0] - 0.2, 0.74, UQ_HALL[2] - 0.04];
  const qR = solve(UQ_HALL, NORTH, "R", target);
  const palm = c1HandWorld([qR.arm[0], qR.arm[1], qR.fwd], "R", UQ_HALL, NORTH, {});
  return {
    // palm faces backward, phone face forward (readable from the front), fingers curled round its edges
    char: { who: "uq", root: UQ_HALL, yaw: NORTH, height: C1_HEIGHT, pose: { armR: qR.arm, armRFwd: qR.fwd }, hands: { R: { dir: [0, -1, 0.1], palm: [0, 0, -1], curl: 70, w: 1 } } },
    phone: { p: [palm.x, palm.y - 0.05, palm.z - 0.02], side: true },
  };
};

/** S04: after the two steps (root 0.55 m from the door): right hand on the bolt grip, phone in the left hand aimed at it */
const UQ_STEPPED: V3 = [-0.92, 0, -4.38];
const uqStepped = (): { char: Char; phone: Phone } => {
  const grip: V3 = [BOLT[0] + 0.02, BOLT[1] + 0.03, BOLT[2] + 0.04];
  const qL = solve(UQ_STEPPED, NORTH, "L", grip);
  const target: V3 = [-1.12, 1.18, -4.6];
  const qR = solve(UQ_STEPPED, NORTH, "R", target);
  const palmR = c1HandWorld([qR.arm[0], qR.arm[1], qR.fwd], "R", UQ_STEPPED, NORTH, {});
  return {
    char: { who: "uq", root: UQ_STEPPED, yaw: NORTH, height: C1_HEIGHT, pose: { armR: qR.arm, armRFwd: qR.fwd, armL: qL.arm, armLFwd: qL.fwd, headNod: -14 },
      hands: { R: { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 }, L: { dir: [0, 0.2, 1], palm: [0, 0, 1], curl: 55, w: 0.9 } } },
    phone: { p: [palmR.x, palmR.y + 0.02, palmR.z - 0.03], aim: BOLT, side: false },
  };
};

const adik = (root: V3 = ADIK_MOUTH, yaw = NORTH): Char => ({ who: "adik", root, yaw, height: ADIK_HEIGHT, pose: { ...ADIK_REST } });

// cameras (metres). All S03–S07 cameras stay on the WEST side of the Uq–adik line (x <= -0.95) or on it.
const LOOK_DOOR: V3 = [-0.92, 1.68, -4.45];
const CAMS = {
  // still a (S02 axis), from the kitchen facing south down the hallway
  a: cam([-1.0, 1.4, -4.45], [-0.85, 1.12, -1.6], 50),
  // S03 opening option: from the back of the living room, east of adik (adik small, lower-left, deliberate)
  s03: cam([-0.35, 1.6, 2.6], [-0.95, 1.45, -4.6], 34),
  // K1: legal (3.1 m), west wall of the kitchen beside the counter; aim + fov solved so face, phone, bolt, glass fit 9:16
  k1: cam([-3.88, 1.5, -4.85], [-2.92, 1.59, -4.7], 41),
  // K3: west side-front at 1.8 m: BREAKS the 2.2 m rule (STUDIO-WORKFLOW §10.4); fov solved for the same four points
  k3: cam([-2.6, 1.45, -4.45], [-1.61, 1.61, -4.39], 79),
  // S04 insert (exempt from 2.2 m): after the two steps, hands + phone + bolt from the west
  s04: cam([-1.75, 1.25, -4.25], [-1.0, 1.1, -4.8], 50),
  // e: adik's point of view (eye at 1.12 m) to the glass
  e: cam([-0.95, 1.12, -1.05], [-0.85, 1.85, -4.94], 46),
};

const V = (id: string, label: string, group: string, c: Cam, aim: TorchAim, focus: V3, uq: { char: Char; phone: Phone }, withAdik = true, extra: Partial<View> = {}): View => ({
  id, label, group, cam: c, aim, focus, chars: withAdik ? [uq.char, adik()] : [uq.char], phone: uq.phone, ...extra,
});

export const LD003_V2: View[] = [
  V("a", "a · lorong, senter mati (wajah, ponsel di tangan kiri)", "main", CAMS.a, "off", [-0.72, 1.2, -2.15], uqInHall(), true, { exposure: -0.12 }),
  V("s03", "S03 pembuka · dari belakang (adik di luar bingkai)", "main", CAMS.s03, "knob", [-0.95, 1.3, -3.9], uqAtDoor("knob")),
  V("k1c", "K1 legal 3,1 m · kaca (tertutup rak)", "options", CAMS.k1, "glass", LOOK_DOOR, uqAtDoor("glass")),
  V("k1d", "K1 legal 3,1 m · gerendel (tertutup rak)", "options", CAMS.k1, "bolt", LOOK_DOOR, uqAtDoor("bolt")),
  V("k3c", "K3 barat 1,8 m (<2,2 m) · kaca", "options", CAMS.k3, "glass", LOOK_DOOR, uqAtDoor("glass")),
  V("k3d", "K3 barat 1,8 m (<2,2 m) · gerendel", "options", CAMS.k3, "bolt", LOOK_DOOR, uqAtDoor("bolt")),
  V("s04", "S04 insert · tangan, ponsel, gerendel (sesudah maju)", "options", CAMS.s04, "bolt", [-0.98, 1.1, -4.8], uqStepped()),
  V("e", "e · POV adik ke kaca", "main", CAMS.e, "glass", [-0.85, 1.8, -4.7], uqAtDoor("glass"), false),
  // diagnostics (C): the bright frame lines and the bright ceiling
  V("dg-torchoff", "diag · senter mati", "diag", CAMS.s03, "off", [-0.95, 1.3, -3.9], uqAtDoor("knob"), true, { diag: { torch: false, castOld: true } }),
  V("dg-nocast", "diag · senter mati + CastLight mati", "diag", CAMS.s03, "off", [-0.95, 1.3, -3.9], uqAtDoor("knob"), true, { diag: { torch: false, cast: false } }),
  V("dg-newlight", "diag · senter mati + lampu karakter baru", "diag", CAMS.s03, "off", [-0.95, 1.3, -3.9], uqAtDoor("knob"), true, { diag: { torch: false } }),
  V("dg-noink", "diag · senter di kenop, outline mati", "diag", CAMS.s03, "knob", [-0.95, 1.3, -3.9], uqAtDoor("knob"), true, { diag: { ink: false, castOld: true } }),
];
export const LD003_V2_IDS = LD003_V2.map((v) => v.id);
