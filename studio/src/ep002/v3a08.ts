// A08 v3 (2026-11-17): C1 pulls adik back from the front door. Pure functions of episode time (no React), so
// tools/a08_check.ts can check every frame. Replaces the animatic's shuffle() blocking:
//   0.00–0.95 s  C1 comes in fast from screen right (real walk, feet driven by distance) and stops with a decel step;
//   0.80–1.05 s  his left hand reaches her left upper arm (the arm whose hand is on the door handle) — IK to a point
//                recomputed from her body every frame, so the hand stays on her arm while both move;
//   1.05–1.35 s  resistance: she leans a little toward the door, he leans back;
//   1.35–1.55 s  her hand leaves the handle; she turns toward him;
//   1.45–2.29 s  he steps back two steps (backward walk) pulling; she takes two steps after him and stops.
import { c1ArmIK } from "../c1/bodyIk";
import type { C1Body } from "../c1/bodyIk";
import { C1_BUILD, C1_HEIGHT, c1UpperToWorld } from "../c1/c1rig";
import { ADIK } from "../cast/npc";
import { walkState } from "../cast/walk";
import type { Gait, WalkPlan } from "../cast/walk";
import { layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import * as THREE from "three";
import { TAMU } from "./geo";
import PLAN from "./plan-2026-11-002.json";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ss = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const ramp = (t: number, a: number, b: number) => ss((t - a) / (b - a));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
const LAY = layoutOf(C1_BUILD);
const W_ = -Math.PI / 2;
const S_ = 0;

export const T0 = PLAN.cutA07A08; // 41.08
const T = (u: number) => T0 + u;
/** adik at the front door (facing it, south); her left hand ("R" chain) on the handle */
export const ADIK_DOOR: V3 = [TAMU.frontDoor.x + 0.12, 0, 2.5];
export const HANDLE: V3 = [TAMU.frontDoor.x + TAMU.frontDoor.w / 2 - 0.12, 1.0, 2.92];
const ADIK_H = ADIK.height;

// ---- C1: walks in from the east, stops beside her (north-east of her), then steps back east two steps
const C1_GAIT: Gait = { height: C1_HEIGHT, stride: 1.1, phase: 0.15, swing: 20, bob: 0.011 };
/** where C1 ends up beside her (after the stop and its settle step): east-north-east of her left arm, in reach */
const C1_AT: V3 = [-1.98, 0, 2.28];
const IN_YAW = W_ + 0.13;
const IN0: WalkPlan = { t0: T(-0.75), from: [0, 0, 0], yaw: IN_YAW, speed: 1.6, tStop: T(0.8), decel: 0.5 };
// the walk snaps its stop to a double-support point: measure where it really ends (with the settle) and start there
const IN_END = walkState(C1_GAIT, IN0, T(1.5)).position;
const C1_IN: WalkPlan = { ...IN0, from: [C1_AT[0] - IN_END[0], 0, C1_AT[2] - IN_END[2]] };
/** away from the door: north-east. Two short backward steps (phase chosen so the snapped stop is ~0.5 m) */
const AWAY = Math.atan2(0.8, -0.6);
const BACK_GAIT: Gait = { height: C1_HEIGHT, stride: 0.95, phase: 0.03, swing: 0, bob: 0.006, lift: 0.025 };
const back = (start: V3): WalkPlan => ({ t0: T(1.6), from: start, yaw: AWAY, speed: 0.75, tStop: T(2.2), decel: 0.45 });
/** the character faces the opposite way to its travel: rotate the walk's feet by 180° and swap the legs */
const flipLegs = (lp: { L: { ankle: V3 }; R: { ankle: V3 } }) => ({
  L: { ankle: [-lp.R.ankle[0], lp.R.ankle[1], -lp.R.ankle[2]] as V3 },
  R: { ankle: [-lp.L.ankle[0], lp.L.ankle[1], -lp.L.ankle[2]] as V3 },
});

// ---- adik: at the door; after the release she turns toward him and follows two steps
const ADIK_GAIT: Gait = { height: ADIK_H, stride: 0.8, phase: 0.0, swing: 10, bob: 0.008, lift: 0.03 };

export type A08State = {
  c1: { position: V3; yaw: number; legPose?: { L: { ankle: V3 }; R: { ankle: V3 } }; body: C1Body; armR?: { arm: [number, number]; fwd: number; err: number }; walkPose?: ReturnType<typeof walkState>["pose"]; grab: number };
  adik: { position: V3; yaw: number; legPose?: { L: { ankle: V3 }; R: { ankle: V3 } }; body: C1Body; armR?: { arm: [number, number]; fwd: number; err: number }; onHandle: number; walkPose?: ReturnType<typeof walkState>["pose"] };
  grip: V3;
};

export const a08At = (t: number): A08State => {
  // ---------------- adik
  const release = ramp(t, T(1.32), T(1.5));
  const turn = ramp(t, T(1.58), T(1.95));
  const lean = 4 * ramp(t, T(1.12), T(1.3)) * (1 - ramp(t, T(1.32), T(1.46))) - 5 * ramp(t, T(1.3), T(1.45)) * (1 - ramp(t, T(1.6), T(2.0)));
  const followPlan: WalkPlan = { t0: T(1.66), from: ADIK_DOOR, yaw: Math.atan2(0.6, -0.8), speed: 0.7, tStop: T(2.29), decel: 0.5 };
  const aw = t >= T(1.66) ? walkState(ADIK_GAIT, followPlan, t) : null;
  const adikYaw = mix(S_, followPlan.yaw, turn);
  const adikPos: V3 = aw ? aw.position : ADIK_DOOR;
  const adikBody: C1Body = { lean };
  const onHandle = 1 - release;
  const adikArm = onHandle > 0.01 ? c1ArmIK({ root: adikPos, yaw: adikYaw, body: adikBody, side: "R", target: HANDLE, ref: [40, 30, 60], height: ADIK_H, wMin: -30 }) : undefined;
  // her left upper arm, just below the shoulder, on the outside: where his hand holds
  const S = new THREE.Vector3(LAY.shoulderX * 1.0, LAY.shoulderY - 0.055, 0.004);
  const armPt = c1UpperToWorld(S, adikPos, adikYaw, adikBody, ADIK_H);
  const outward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), adikYaw);
  const grip: V3 = [armPt.x + outward.x * 0.045, armPt.y, armPt.z + outward.z * 0.045];

  // ---------------- C1
  const walkIn = walkState(C1_GAIT, C1_IN, t);
  const stopPos = walkState(C1_GAIT, C1_IN, T(1.6)).position;
  const goingBack = t >= T(1.6);
  const bw = goingBack ? walkState(BACK_GAIT, back(stopPos), t) : null;
  const c1Pos: V3 = bw ? bw.position : walkIn.position;
  // he turns a little toward her as he stops, then keeps facing her while he steps back
  const faceHer = Math.atan2(adikPos[0] - c1Pos[0], adikPos[2] - c1Pos[2]);
  const c1Yaw = mix(C1_IN.yaw, faceHer + 0.35, ramp(t, T(0.55), T(1.0)));
  const c1Lean = -6 * ramp(t, T(1.18), T(1.36)) * (1 - ramp(t, T(2.0), T(2.29))) + 3 * ramp(t, T(0.55), T(0.85)) * (1 - ramp(t, T(0.9), T(1.1)));
  const c1Body: C1Body = { lean: c1Lean };
  // he holds her arm through the pull and lets go as she turns to follow (1.55–1.8)
  const grab = ramp(t, T(0.88), T(1.18)) * (1 - ramp(t, T(1.5), T(1.68)));
  // his left hand ("R" chain): from the walk swing toward her arm, then on it
  const handRest: V3 = c1UpperToWorld(new THREE.Vector3(LAY.shoulderX * 1.15, LAY.shoulderY - 0.42, 0.06), c1Pos, c1Yaw, c1Body, C1_HEIGHT).toArray() as V3;
  const c1Arm = grab > 0 ? c1ArmIK({ root: c1Pos, yaw: c1Yaw, body: c1Body, side: "R", target: mix3(handRest, grip, grab), ref: [45, 25, 80], wMin: -30 }) : undefined;
  return {
    c1: {
      position: c1Pos,
      yaw: c1Yaw,
      legPose: bw ? flipLegs(bw.legPose) : walkIn.legPose,
      body: c1Body,
      armR: c1Arm,
      walkPose: bw ? undefined : walkIn.pose,
      grab,
    },
    adik: { position: adikPos, yaw: adikYaw, legPose: aw?.legPose, body: adikBody, armR: adikArm, onHandle, walkPose: aw?.pose },
    grip,
  };
};
