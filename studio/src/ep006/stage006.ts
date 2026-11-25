// Episode 5 (2026-11-006) FULL EPISODE stage (preview, owner 2026-11-24; branch B, D-064..D-067). A pure function of the
// EPISODE time t on episode006-plan.json (scripts/ep006_episode_audio.py plan; timing from the owner's VO).
// Blocking (USULAN where the storyboard v0.1 is silent; script words unchanged):
//   S01-S03  the dark bathroom, Ep 4's end state (Ep 4 stage at its S15); S01/S03 = the chat UI over the dimmed two-shot
//   S04a     kitchen, looking east at the bathroom door: Uq pushes it open (opens into the kitchen) and walks out, adik behind
//   S04b     insert at the back door: Uq's right hand slides the bolt (locked in Ep 2) and pushes the door OUTWARD to 0.45 rad
//   S05      v5 (owner review of v4): the guard stands in the gang west of the gap (a whole body, shoulder outside); his left
//            arm comes in through the gap, elbow bent, the key pinched in his glove; Uq's right palm comes under it, closes;
//            the guard lets go and draws the arm back
//   S06a     v5: camera in the gang facing the door: Uq steps into the doorway pushing the leaf (hand on it) to 0.85 rad, lets
//            go, it swings on slowing to ~1.75 rad; Uq walks out; the guard points east; adik walks THROUGH the doorway
//   S06c/b   the gang: both walk east toward the lens, crouched; the gang camera's LED lights; POV through the gap between
//            house 7 and house 9: villagers still face the empty house
//   S07a/b   the toa room's door (R2, D-066): v5 a real hasp + padlock (lock006.ts): key in along the keyway, turned, the
//            shackle springs, the padlock comes off the eye, the strap is swung back (left hand), the left hand pushes the door
//   S08a     inside, wide from the north-east corner: they come in, the monitors light up
//   S08b, S09, S10b  2D inserts (monitor grid, the self-typing text box); S10 Uq's face lit by the screens
//   S10c     v5: ~0.6 s on Uq after "Kamu akan memilih…" (in full): his head and eyes go to the switch, the hand starts
//   S11      insert: Uq's right hand flips OTOMATIS -> MIKROFON on the rack (0.8 s after the narrator's last word)
//   S12, S14 Uq at the mic (front-left lens); S13 the street: the villagers hear the toa, two lower their eyes and turn away
//   S15      the approved closing shot (Close006 = v0f) from the end of U02
// Ellipses (cuts, not shown): the phone is pocketed after S03; the padlock is pocketed after S08a; the toa room's door is
// closed between S08a and S12 (the closed door is what v0f shows behind Uq).
import * as THREE from "three";
import { c1ArmIK, c1ArmTorsoDepth, c1HandWorld } from "../c1/bodyIk";
import type { C1Hand } from "../c1/c1rig";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { chain, movesAt, stanceAt, turnInPlace, walkSteps } from "../cast/stepper";
import type { FootEvent, Moves } from "../cast/stepper";
import { EP2_END } from "../ep004/e004Poses";
import { H_AD, H_UQ, REST_AD, REST_UQ } from "../ep004/motion004";
import { charsAt as charsAt5 } from "../ep005/episode005Stage";
import { BOLT_GRIP } from "../ep002/sets";
import { DAPUR, HOUSE } from "../ep002/geo";
import { ROOT_A } from "./closeMotion006";
import { SWITCH } from "./sets006";
import { BODY_C, haspTip, HASP, lockFrame, toWorld } from "./lock006";
import type { LockFrame } from "./lock006";
import { armWorld } from "../ep005/open005v4";
import { ROOM } from "./closeMotion006";
import PLAN from "./episode006-plan.json";

export type Q = [number, number, number];
export const SH = PLAN.shots as unknown as Record<string, [number, number, number]>;
export const EV = PLAN.events as unknown as Record<string, number & [number, number] & Record<string, number>>;
export const VOP = PLAN.vo as unknown as Record<string, { at: number; end: number; speech: number[][]; capBursts: number[][] }>;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const qlerp = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
export const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
/** the same heading, unwrapped to the turn shorter than pi from `ref` (e006_check v5 run 1: adik turned 288 deg the long way) */
const near = (yaw: number, ref: number) => yaw + 2 * Math.PI * Math.round((ref - yaw) / (2 * Math.PI));
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({ pos: lerp3(a.pos, b.pos, u), look: lerp3(a.look, b.look, u), fov: lerp(a.fov, b.fov, u), roll: 0 });
const T = (k: string) => EV[k] as unknown as number;
const P = (k: string) => EV[k] as unknown as [number, number];
/** the shot at t (defined first: the hand tracks below are built at load and use it) */
export function shotOf(t: number): string { return PLAN.order.find((k) => t >= SH[k][0] - 1e-9 && t < SH[k][1] - 1e-9) ?? "S15"; }

// ------------------------------------------------------------------ the bathroom: Ep 4's end state (its S15, phone up)
const EP4_END_T = 57.0;
const B = charsAt5(EP4_END_T);
export const U_BATH: V3 = B.chars[0].root, A_BATH: V3 = B.chars[1].root;
export const BATH_YAW = B.chars[0].yaw;
export const BATH_CAM = cam([3.6, 1.25, -3.67], [1.55, 1.12, -3.67], 52);

// ------------------------------------------------------------------ moves
const N_ = Math.PI, E_ = Math.PI / 2;
// S04a: out of the bathroom (path inside the doorway z -4.0 +/- 0.18: the jambs are at -3.6 / -4.4)
const s04 = SH.S04a[0];
const uT1 = turnInPlace(stanceAt(U_BATH, BATH_YAW, H_UQ), yawTo(U_BATH, [1.32, 0, -3.98]), s04 + 0.0, s04 + 0.55, H_UQ);
const uW1 = walkSteps(uT1.end, [1.32, 0, -3.98], yawTo(U_BATH, [1.32, 0, -3.98]), 2, s04 + 0.55, s04 + 1.15, H_UQ);
const uT2 = turnInPlace(uW1.end, -E_, s04 + 1.15, s04 + 1.5, H_UQ);
const uW2 = walkSteps(uT2.end, [0.35, 0, -3.98], -E_, 3, s04 + 1.5, s04 + 2.45, H_UQ);
export const UQ_OUT: Moves = chain(stanceAt(U_BATH, BATH_YAW, H_UQ), H_UQ, [uT1, uW1, uT2, uW2]);
// e006_check run 1: adik stood on Uq's way out (body gap -17.7 cm): she steps back east first, then follows
const aB0 = walkSteps(stanceAt(A_BATH, BATH_YAW, H_AD), [A_BATH[0] + 0.32, 0, A_BATH[2]], BATH_YAW, 2, s04 + 0.0, s04 + 0.5, H_AD);
const aT1 = turnInPlace(aB0.end, -E_, s04 + 0.55, s04 + 1.4, H_AD); // run 3: 180 deg in 0.5 s = 18 deg/frame
const aW1 = walkSteps(aT1.end, [1.22, 0, -3.97], -E_, 3, s04 + 1.5, s04 + 2.4, H_AD);
export const AD_OUT: Moves = chain(stanceAt(A_BATH, BATH_YAW, H_AD), H_AD, [aB0, aT1, aW1]);
// S04b/S05: Uq at the back door, facing north; adik behind his left shoulder
// v5: nearer the door than v4 (-1.1, -4.62), from where his hand could not push the leaf past ~0.3 rad (IK error 3-14 cm);
// not nearer than z -4.66: there his elbow stays >= 6 cm off the closed leaf while he slides the bolt (run 4); he leans
// into the pushes (S04b 8 deg to 0.45 rad, S06a 20 deg to 0.7 rad: IK <= 4 mm)
export const U_DOOR: V3 = [-1.0, 0, -4.66];
export const A_DOOR: V3 = [-0.25, 0, -4.15]; // e006_check run 1: at (-0.55, -4.3) the S05 lens stood inside her
// S06a (v5): out through the back door. Uq steps into the doorway while pushing the leaf, walks out north, then to the east
// lane (z -6.65); adik crosses the kitchen to the doorway and walks out north after him. The leaf stands at ~1.75 rad (its
// free edge at (-0.25, -5.88)), so both lanes run north of it: Uq z -6.65, adik z -6.22.
const s6 = SH.S06a[0];
const gW = EV.walkG as unknown as [number, number];
// e006_check v5 run 1: stepping into the doorway while the leaf stood at 0.45 rad left 36 cm of clear width for his 44 cm
// body (R2). He now pushes from where he stands, leaning 14 deg (IK error <= 5 mm up to 0.7 rad), lets go at 0.7 rad and
// steps through only once the leaf is past ~0.8 rad (clear width > 0.8 m); lane x -0.92 keeps him >= 15 cm off the leaf
// run 10: walking on while the arm still came down carried his forearm into the swinging leaf: he walks once it is down
const uE1 = walkSteps(stanceAt(U_DOOR, N_, H_UQ), [-0.92, 0, -5.1], N_, 2, s6 + 1.15, s6 + 1.6, H_UQ);
// stills r1 / R5: walking north toward the S06a lens he hid the doorway just before adik came through it; he turns off
// north-east once past the threshold (>= 18 cm from the open leaf's edge) and waits east of the lens's line to the door
const U_WAIT: V3 = [-0.3, 0, -6.55];
const uE2 = walkSteps(uE1.end, [-0.92, 0, -5.55], N_, 2, s6 + 1.65, s6 + 2.1, H_UQ);
const uE3a = turnInPlace(uE2.end, yawTo([-0.92, 0, -5.55], U_WAIT), s6 + 2.1, s6 + 2.3, H_UQ);
const uE3 = walkSteps(uE3a.end, U_WAIT, yawTo([-0.92, 0, -5.55], U_WAIT), 3, s6 + 2.3, s6 + 3.0, H_UQ);
const uE4 = turnInPlace(uE3.end, E_ - 0.7, s6 + 3.0, s6 + 3.18, H_UQ); // half back toward the door: waits for adik
const uG1 = turnInPlace(uE4.end, E_, gW[0], gW[0] + 0.35, H_UQ);
const uG2 = walkSteps(uG1.end, [1.75, 0, -6.6], E_, 6, gW[0] + 0.4, gW[0] + 3.9, H_UQ);
/** Uq leans into the pushes (deg): S04b (back door to 0.45 rad), back up while his palm goes under the key (S05); S06a */
export const uqLeanAt = (t: number) => {
  const s = shotOf(t);
  if (s === "S04b" || s === "S05") return 8 * ramp(t, P("backOpen")[0], P("backOpen")[0] + 0.3) * (1 - ramp(t, P("palm")[0], P("palm")[1])); // leans only once the leaf moves away (run 5: his elbow touched the closed leaf)
  if (s === "S06a") return 20 * ramp(t, s6 + 0.1, s6 + 0.4) * (1 - ramp(t, P("push")[1] + 0.1, P("push")[1] + 0.5));
  if (s === "S07a" || s === "S07b") return 15 * ramp(t, ro[0], ro[0] + RPUSH_T) * (1 - ramp(t, ro[0] + RPUSH_T + 0.45, ro[0] + RPUSH_T + 0.9)); // run 15: leaning INTO the push (shoulder follows the hand) keeps the elbow under 11 deg/frame
  return 0;
};
export const UQ_EXIT: Moves = chain(stanceAt(U_DOOR, N_, H_UQ), H_UQ, [uE1, uE2, uE3a, uE3, uE4, uG1, uG2]);
const A_IN: V3 = [-0.82, 0, -4.75];
const A_HEAD = near(yawTo(A_DOOR, A_IN), N_ - 0.5);
const aE1 = turnInPlace(stanceAt(A_DOOR, N_ - 0.5, H_AD), A_HEAD, s6 + 1.2, s6 + 1.5, H_AD);
const aE2 = walkSteps(aE1.end, A_IN, A_HEAD, 3, s6 + 1.5, s6 + 2.2, H_AD);
const aE3 = turnInPlace(aE2.end, N_, s6 + 2.2, s6 + 2.45, H_AD);
const aE4 = walkSteps(aE3.end, [-0.8, 0, -5.95], N_, 4, s6 + 2.45, s6 + 3.45, H_AD);
const aG1 = turnInPlace(aE4.end, yawTo([-0.8, 0, -5.95], [-0.55, 0, -6.22]), gW[0] + 0.3, gW[0] + 0.6, H_AD);
const aG2 = walkSteps(aG1.end, [-0.55, 0, -6.22], yawTo([-0.8, 0, -5.95], [-0.55, 0, -6.22]), 2, gW[0] + 0.6, gW[0] + 1.0, H_AD);
const aG3 = turnInPlace(aG2.end, E_, gW[0] + 1.0, gW[0] + 1.25, H_AD);
const aG4 = walkSteps(aG3.end, [1.05, 0, -6.22], E_, 7, gW[0] + 1.25, gW[0] + 4.0, H_AD);
export const AD_EXIT: Moves = chain(stanceAt(A_DOOR, N_ - 0.5, H_AD), H_AD, [aE1, aE2, aE3, aE4, aG1, aG2, aG3, aG4]);
// S07/S08a: at the toa room's door, then in
// v5: (8.45, -6.88) (v4 (8.5, -6.95) left the key 5 cm out of the right hand's reach, IK): the padlock sequence; he steps
// to (8.45, -7.0) for the push and back to (8.55, -6.9) out of adik's way in (run 3 of v4: east of the door)
export const U_RDOOR: V3 = [8.45, 0, -6.88];
export const A_RDOOR: V3 = [7.75, 0, -6.7];
const ro = EV.roomOpen as unknown as [number, number];
const s08 = SH.S08a[0];
// e006_check run 2-3: the room is small (Uq's back at ROOT_A is 0.27 m from the south wall), so adik goes in FIRST, along
// z -7.66 between the south wall and the rack, to the east of the desk; Uq waits outside (east), then walks in to ROOT_A
export const AD_ROOM: V3 = [8.85, 0, -7.66];
const rA1 = turnInPlace(stanceAt(A_RDOOR, N_, H_AD), yawTo(A_RDOOR, [8.14, 0, -7.2]), ro[1] - 0.2, ro[1] + 0.35, H_AD);
const rA2 = walkSteps(rA1.end, [8.14, 0, -7.2], yawTo(A_RDOOR, [8.14, 0, -7.2]), 2, ro[1] + 0.35, ro[1] + 1.05, H_AD);
const rA3 = turnInPlace(rA2.end, N_, ro[1] + 1.05, ro[1] + 1.5, H_AD);
const rA4 = walkSteps(rA3.end, [8.14, 0, -7.66], N_, 2, ro[1] + 1.5, ro[1] + 2.2, H_AD);
const rA5 = turnInPlace(rA4.end, E_, ro[1] + 2.2, ro[1] + 2.8, H_AD);
const rA6 = walkSteps(rA5.end, AD_ROOM, E_, 3, ro[1] + 2.8, s08 + 1.7, H_AD);
const rA7 = turnInPlace(rA6.end, N_ + 0.35, s08 + 1.7, s08 + 2.3, H_AD);
export const AD_IN: Moves = chain(stanceAt(A_RDOOR, N_, H_AD), H_AD, [rA1, rA2, rA3, rA4, rA5, rA6, rA7]);
// run 4: in through the middle of the doorway (from the east his right hand caught the jamb)
const HP_ = EV.hasp as unknown as [number, number];
const rU0a = walkSteps(stanceAt(U_RDOOR, N_, H_UQ), [8.45, 0, -7.0], N_, 1, HP_[1] + 0.1, HP_[1] + 0.5, H_UQ);
const rU0b = walkSteps(rU0a.end, [8.55, 0, -6.9], N_, 2, ro[0] + 1.4, ro[0] + 1.85, H_UQ); // runs 9-11: once the hand is down (stepping back dragged it into the east jamb)
const rU1 = turnInPlace(rU0b.end, near(-E_, N_), s08 + 0.9, s08 + 1.3, H_UQ); // v5: the short way (was 270 deg)
const rU2 = walkSteps(rU1.end, [8.2, 0, -6.98], near(-E_, N_), 2, s08 + 1.3, s08 + 1.75, H_UQ);
const rU2b = turnInPlace(rU2.end, N_, s08 + 1.75, s08 + 2.15, H_UQ);
const rU3 = walkSteps(rU2b.end, ROOT_A, N_, 3, s08 + 2.15, s08 + 3.0, H_UQ);
export const UQ_IN: Moves = chain(stanceAt(U_RDOOR, N_, H_UQ), H_UQ, [rU0a, rU0b, rU1, rU2, rU2b, rU3]);
/** heel strikes on screen (footstep SFX) */
export const stepTimes = (): [number, "uq" | "adik"][] => {
  const out: [number, "uq" | "adik"][] = [];
  const add = (m: Moves, who: "uq" | "adik", a: number, b: number) => m.feet.forEach((e: FootEvent) => { if (e.t1 >= a && e.t1 < b) out.push([Math.round(e.t1 * 1000) / 1000, who]); });
  add(UQ_OUT, "uq", SH.S04a[0], SH.S04a[1]); add(AD_OUT, "adik", SH.S04a[0], SH.S04a[1]);
  add(UQ_EXIT, "uq", SH.S06a[0], SH.S06c[1]); add(AD_EXIT, "adik", SH.S06a[0], SH.S06c[1]);
  add(UQ_IN, "uq", SH.S07b[0], SH.S08a[1]); add(AD_IN, "adik", SH.S07b[0], SH.S08a[1]);
  return out.sort((x, y) => x[0] - y[0]);
};

// ------------------------------------------------------------------ doors and props
// A door leaf moves only under a hand, or swings on after a push and SLOWS DOWN (e006_check R1): push = constant
// acceleration from rest; release at the push's end speed v; then a(t) = aEnd - (aEnd - a1) exp(-(t - t1) / tau), tau =
// (aEnd - a1) / v (the same speed at the release, decelerating after it)
const pushSwing = (t: number, t0: number, t1: number, a0: number, a1: number, aEnd: number) => {
  if (t <= t0) return a0;
  if (t < t1) { const u = (t - t0) / (t1 - t0); return a0 + (a1 - a0) * u * u; }
  const v = (2 * (a1 - a0)) / (t1 - t0), tau = (aEnd - a1) / v;
  return aEnd - (aEnd - a1) * Math.exp(-(t - t1) / tau);
};
export const bathDoorAt = (t: number) => (t < SH.S04a[0] ? 0 : 1.45 * ramp(t, P("bathOpen")[0], P("bathOpen")[1]));
export const boltAt = (t: number) => 1 - ramp(t, P("bolt")[0], P("bolt")[1]);
export const BACK_OPEN0 = 0.45, BACK_PUSH = 0.7, BACK_WIDE = 1.75;
export const backDoorAt = (t: number) => {
  if (t < SH.S06a[0]) return BACK_OPEN0 * ramp(t, P("backOpen")[0], P("backOpen")[1]);
  if (t < SH.S06c[0]) return pushSwing(t, P("push")[0], P("push")[1], BACK_OPEN0, BACK_PUSH, BACK_WIDE);
  return BACK_WIDE;
};
// run 10: a 0.3 s shove straightened his elbow 20 deg/frame; 0.5 s to 0.35 rad, leaning 15 deg (the swing then opens it far
// enough for adik 1.15 s after the release)
export const ROOM_PUSH = 0.3, ROOM_WIDE = 1.5, RPUSH_T = 0.7; // run 16: 0.35 in 0.5 s still snapped the elbow (18 deg/frame)
export const roomDoorAt = (t: number) => (t < SH.S07b[0] ? 0 : t < SH.S10[0] ? pushSwing(t, ro[0], ro[0] + RPUSH_T, 0, ROOM_PUSH, ROOM_WIDE) : 0);
export const leverAt = (t: number) => ramp(t, T("click") - 0.08, T("click") + 0.07); // with the hand (run 21)
export const monitorsAt = (t: number) => {
  if (t < SH.S07b[0]) return 0;
  const on = T("monitorsOn");
  if (t < on) return 0;
  // power-on: two quick flickers, then full
  const x = t - on;
  return x < 0.08 ? 0.6 : x < 0.14 ? 0.1 : x < 0.22 ? 0.8 : x < 0.27 ? 0.3 : sm(x / 0.5);
};
export const gangLedAt = (t: number) => ramp(t, T("led"), T("led") + 0.08);

// ------------------------------------------------------------------ arms (rig "L" = the character's own RIGHT hand)
type Sol = { q: Q; err: number; torso: number };
const ikH = (root: V3, yaw: number, target: V3, ref: Q, height: number, side: "L" | "R" = "L", lean = 0): Sol => {
  const refs: Q[] = [ref, [60, 30, 20], [40, 60, 40], [80, 20, 60], [30, 40, 0], [40, 40, 20], [50, 40, 20], [20, 80, 100], [70, 60, 90], [100, 0, 80]];
  const all = refs.map((r) => c1ArmIK({ root, yaw, body: { lean }, side, target, ref: r, height, avoidTorso: true, wMin: -60 }));
  const e0 = Math.min(...all.map((x) => x.err));
  // v5 run 1: the best-error pick jumped between elbow branches (44 deg/frame): among solutions within 3 mm of the best, take
  // the one nearest the seed
  const dist = (x: (typeof all)[number]) => Math.hypot(x.arm[0] - ref[0], x.arm[1] - ref[1], x.fwd - ref[2]);
  const sol = all.filter((x) => x.err <= Math.max(e0 + 0.003, Math.min(0.01, e0 + 0.008))).sort((x, y) => dist(x) - dist(y))[0];
  const q: Q = [sol.arm[0], sol.arm[1], sol.fwd];
  return { q, err: sol.err, torso: c1ArmTorsoDepth(q as never, side, height) };
};
const ik = (root: V3, yaw: number, target: V3, ref: Q, lean = 0, side: "L" | "R" = "L"): Sol => ikH(root, yaw, target, ref, H_UQ, side, lean);
const keysPath = (t: number, ts: number[], qs: Q[]): Q => {
  if (t <= ts[0]) return qs[0];
  for (let i = 1; i < ts.length; i++) if (t < ts[i]) return qlerp(qs[i - 1], qs[i], sm((t - ts[i - 1]) / (ts[i] - ts[i - 1])));
  return qs[qs.length - 1];
};
/** a hand that follows a MOVING target (a leaf, a key, a strap) while the body may walk: IK per frame, each frame seeded with
 * the previous solution (no flips); a table built once from the plan, so every frame stays a pure function of t */
type Track = { at: (t: number) => Q; errMax: number; t0: number; t1: number; q0: Q; q1: Q };
/** tracks whose hand must TOUCH something (a leaf, a key, a strap, a lever): the check holds them to <= 1 cm IK error; the
 * others are hand paths between touches (their FK is what is drawn and checked) */
export const TRACK_CONTACT = new Set<string>();
export const TRACK_ERR: Record<string, number> = {};
export const TRACK_ERR_T: Record<string, number> = {};
const track = (name: string, t0: number, t1: number, root: (t: number) => V3, yaw: (t: number) => number, target: (t: number) => V3, ref: Q, side: "L" | "R" = "L", height = H_UQ, lean: (t: number) => number = () => 0, contact = false): Track => {
  if (contact) TRACK_CONTACT.add(name);
  const f0 = Math.floor(t0 * 30), f1 = Math.ceil(t1 * 30);
  const tab: Q[] = [];
  let r = ref, errMax = 0, errT = t0;
  for (let f = f0; f <= f1; f++) {
    const t = f / 30;
    const s = ikH(root(t), yaw(t), target(t), r, height, side, lean(t));
    r = s.q; if (s.err > errMax) { errMax = s.err; errT = t; } tab.push(r);
  }
  TRACK_ERR[name] = errMax;
  TRACK_ERR_T[name] = errT;
  const at = (t: number): Q => { const x = Math.min(Math.max(t * 30 - f0, 0), f1 - f0); const i = Math.floor(x); return i >= f1 - f0 ? tab[f1 - f0] : qlerp(tab[i], tab[i + 1], x - i); };
  return { at, errMax, t0, t1, q0: tab[0], q1: tab[tab.length - 1] };
};
/** world hand point (FK) of a character's arm */
export const handW = (q: Q, side: "L" | "R", root: V3, yaw: number, h: number, lean = 0): V3 => { const v = c1HandWorld(q, side, root, yaw, { lean }, h); return [v.x, v.y, v.z]; };
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
/** a hand path as straight WORLD lines through points at times (eased per leg); joint interpolation between far keys swept
 * hands through leaves, racks and the torso (e006_check v5 run 1) */
const wpath = (ts: number[], ps: V3[]) => (t: number): V3 => {
  if (t <= ts[0]) return ps[0];
  for (let i = 1; i < ts.length; i++) if (t < ts[i]) return lerp3(ps[i - 1], ps[i], sm((t - ts[i - 1]) / (ts[i] - ts[i - 1])));
  return ps[ps.length - 1];
};

// back door geometry: hinge on the east jamb (sets.tsx Door hinge=1), the bolt grip turns with the leaf (opens outward)
const BD = DAPUR.backDoor;
const HINGE: V3 = [BD.x + BD.w / 2 - 0.01, 0, HOUSE.z0];
const onLeaf = (p: V3, open: number): V3 => { const v = new THREE.Vector3(p[0] - HINGE[0], p[1], p[2] - HINGE[2]).applyAxisAngle(new THREE.Vector3(0, 1, 0), -open); return [HINGE[0] + v.x, v.y, HINGE[2] + v.z]; };
// palm centre in front of the knob (wall face at z -4.94); v5: 6.5 cm (was 5): from U_DOOR 10 cm nearer the door his elbow
// touched the closed leaf by 1.4 cm (e006_check v5 run 3)
const GRIP = (k: number): V3 => [BOLT_GRIP[0] + (1 - k) * 0.06, BOLT_GRIP[1] + 0.05, BOLT_GRIP[2] + 0.065];
const kBolt0 = ik(U_DOOR, N_, GRIP(1), [50, 30, 30]);
const kBolt1 = ik(U_DOOR, N_, GRIP(0), kBolt0.q);
// S04b: the hand stays on the grip and pushes the leaf open to 0.45 rad
const trOpen = track("S04b dorong pintu belakang ke 0,45", P("backOpen")[0], P("backOpen")[1], () => U_DOOR, () => N_, (t) => onLeaf(GRIP(0), backDoorAt(t)), kBolt1.q, "L", H_UQ, (t) => uqLeanAt(t), true);

// ------------------------------------------------------------------ the guard (S04b-S06c): a whole body in the gang, west of
// the gap; his LEFT arm (rig R) does the handover through the gap and points east in S06a (guard search 2026-11-24: root and
// yaw chosen so that the arm keeps >= 9 cm from the leaf at 0.45 rad and the jamb, the body >= 13 cm)
export const G_ROOT: V3 = [-1.55, 0, -5.4];
export const G_YAW = 0.244;
export const G_H = 1.62;
const gik = (target: V3, ref: Q) => ikH(G_ROOT, G_YAW, target, ref, G_H, "R");
export const HG: V3 = [-1.06, 1.0, -5.1]; // his glove at the handover, in the doorway (v5 run 2: at -5.06 Uq's palm under the key was too near his chest to reach, IK 3 cm)
const kGmid = gik([-1.18, 1.04, -5.18], [60, 30, 30]);
const kGhand = gik(HG, kGmid.q);
const G_SHOULDER = armWorld(REST_UQ as never, "R", G_ROOT, G_YAW, G_H)[0] as V3;
const kGpoint = gik([G_SHOULDER[0] + 0.42, G_SHOULDER[1] + 0.1, G_SHOULDER[2] + 0.08], [80, 10, 40]);
const G_REST_H = handW(REST_UQ, "R", G_ROOT, G_YAW, G_H);
const G_MID: V3 = [-1.2, 1.03, -5.2]; // in the gap (between the west jamb and the free edge)
const G_FWD: V3 = [-1.36, 0.97, -5.17]; // in front of his left hip, west of the gap (start / end of the world path)
const kGfwd = gik(G_FWD, [40, 40, 20]);
const gr = EV.reachIn as unknown as [number, number], gw = EV.withdraw as unknown as [number, number];
const gTrIn = track("S05 satpam menjulurkan kunci", gr[0] + 0.6, gr[1], () => G_ROOT, () => G_YAW, wpath([gr[0] + 0.6, gr[0] + 0.9, gr[1]], [G_FWD, G_MID, HG]), kGfwd.q, "R", G_H);
const gTrOut = track("S05 satpam menarik lengan", gw[0], gw[1] - 0.3, () => G_ROOT, () => G_YAW, wpath([gw[0], gw[0] + 0.25, gw[1] - 0.3], [HG, G_MID, G_FWD]), kGhand.q, "R", G_H);
void G_REST_H;
const guardArm = (t: number): Q => {
  const s = shotOf(t);
  if (s === "S05") { if (t < gr[0] + 0.6) return keysPath(t, [gr[0], gr[0] + 0.6], [REST_UQ, gTrIn.q0]); if (t <= gr[1]) return gTrIn.at(t); if (t < gw[0]) return gTrIn.q1; if (t <= gw[1] - 0.3) return gTrOut.at(t); return keysPath(t, [gw[1] - 0.3, gw[1]], [gTrOut.q1, REST_UQ]); }
  if (s === "S06a") { const p = P("point"); return keysPath(t, [p[0], p[0] + 0.4, p[1] - 0.4, p[1]], [REST_UQ, kGpoint.q, kGpoint.q, REST_UQ]); }
  return REST_UQ;
};
export type Guard = { who: "satpam"; root: V3; yaw: number; height: number; pose: Record<string, unknown>; point: number; r: number; h: number };
export const guardAt = (t: number): Guard | null => {
  const s = shotOf(t);
  if (!["S04b", "S05", "S06a", "S06c"].includes(s)) return null;
  const q = guardArm(t);
  const p = P("point");
  const point = s === "S06a" ? ramp(t, p[0] + 0.25, p[0] + 0.45) * (1 - ramp(t, p[1] - 0.4, p[1] - 0.2)) : 0;
  return { who: "satpam", root: G_ROOT, yaw: G_YAW, height: G_H, pose: { armL: [REST_UQ[0], REST_UQ[1]], armLFwd: REST_UQ[2], armR: [q[0], q[1]], armRFwd: q[2], headNod: 4 }, point, r: 0.2, h: G_H };
};
export const guardHand = (t: number): V3 | null => { const g = guardAt(t); if (!g) return null; const a = g.pose.armR as number[]; return handW([a[0], a[1], g.pose.armRFwd as number], "R", g.root, g.yaw, g.height); };
// the key: its blade root pinched in the glove, the blade toward Uq (+z); Uq's palm comes under the blade
export const KEY_LEN = 0.05;
const KEY_G = (hand: V3): V3 => [hand[0], hand[1] - 0.012, hand[2] + 0.03];
const keyMid = (o: V3): V3 => [o[0], o[1], o[2] + KEY_LEN / 2];
const HG_FK = handW(kGhand.q, "R", G_ROOT, G_YAW, G_H);
const RECV: V3 = add3(keyMid(KEY_G(HG_FK)), [0, -0.028, 0]);
const kPalmUp = ik(U_DOOR, N_, [RECV[0] + 0.01, RECV[1] - 0.06, RECV[2] + 0.05], trOpen.q1);
const kRecv = ik(U_DOOR, N_, RECV, kPalmUp.q);
const CHEST_P: V3 = [-0.94, 1.0, -4.97];
const kChest = ik(U_DOOR, N_, CHEST_P, kRecv.q);
const OPEN_H = handW(trOpen.q1, "L", U_DOOR, N_, H_UQ);
const pm_ = EV.palm as unknown as [number, number], tk_ = EV.take as unknown as number;
const OPEN_HL = handW(trOpen.q1, "L", U_DOOR, N_, H_UQ, 8);
const uTrPalm = track("S05 telapak Uq ke bawah kunci", pm_[0], pm_[1], () => U_DOOR, () => N_, wpath([pm_[0], (pm_[0] + pm_[1]) / 2, pm_[1]], [OPEN_HL, [OPEN_HL[0] - 0.05, RECV[1] - 0.05, RECV[2] + 0.06], RECV]), trOpen.q1, "L", H_UQ, (t) => uqLeanAt(t), true);
void OPEN_H;
const uTrChest = track("S05 kunci ke dada Uq", tk_ + 0.25, gw[1], () => U_DOOR, () => N_, wpath([tk_ + 0.25, gw[1]], [RECV, CHEST_P]), uTrPalm.q1);
const RECV_FK = handW(uTrPalm.q1, "L", U_DOOR, N_, H_UQ, uqLeanAt(tk_));

// ------------------------------------------------------------------ S06a: Uq pushes the leaf wide while stepping into the doorway
const uqRootAt = (t: number): V3 => movesAt(UQ_EXIT, t).root;
const uqYawAt = (t: number): number => movesAt(UQ_EXIT, t).yaw;
const CHEST_W = handW(kChest.q, "L", U_DOOR, N_, H_UQ);
const trPush = track("S06a dorong daun pintu belakang", s6, P("push")[1], uqRootAt, uqYawAt, (t) => (t < P("push")[0] ? lerp3(CHEST_W, onLeaf(GRIP(0), BACK_OPEN0), sm((t - s6) / (P("push")[0] - s6))) : onLeaf(GRIP(0), backDoorAt(t))), uTrChest.q1, "L", H_UQ, (t) => uqLeanAt(t), true);
const PUSH_H = onLeaf(GRIP(0), BACK_PUSH);
// run 6: pulling the hand back toward the chest bent the elbow 21 deg/frame (kept for the record, not used: run 7)
const trLet = track("S06a lepas daun, tangan turun", P("push")[1], P("push")[1] + 0.5, uqRootAt, uqYawAt, wpath([P("push")[1], P("push")[1] + 0.5], [PUSH_H, [PUSH_H[0] - 0.02, PUSH_H[1] - 0.25, PUSH_H[2] + 0.06]]), trPush.q1, "L", H_UQ, (t) => uqLeanAt(t));

// ------------------------------------------------------------------ S07a/S07b: the padlock, the hasp and the door (right hand)
const HOFF: V3 = [-0.012, -0.008, 0.032]; // palm centre behind the key's bow (fingers pinch the bow)
const s07 = SH.S07a[0];
const PO = EV.padOff as unknown as [number, number];
const trKey = track("S07a kunci + gembok (tangan kanan)", s07, PO[1], () => U_RDOOR, () => N_, (t) => add3(lockFrame(t).keyBow, HOFF), [50, 40, 20], "L", H_UQ, () => 0, true);
// after the padlock is off: the right hand puts it (open, the key still in it) into his right trouser pocket (runs 11-16: a
// handover to the left hand ended across his belly, the arm 1.2-2.1 cm inside it, whatever the hold point), comes back,
// swings the strap back, then (one step in, leaning) pushes the door to 0.3 rad and lets go (it swings on, slowing)
// the pocket: the side pocket of his trousers, the arm almost down (run 17: an IK hand path to a front pocket bent the elbow
// 100 deg and put the forearm 1.1-1.3 cm into the tee); joint blends searched to stay out of the torso
const T_POCKET = PO[1] + 0.6;
const LOCK_FREE = lockFrame(PO[1]);
const HAND_FREE = handW(trKey.q1, "L", U_RDOOR, N_, H_UQ);
const POCKET_Q: Q = [8, 35, 15];
const HP = EV.hasp as unknown as [number, number];
const STRAP_HAND = (a: number): V3 => { const p = haspTip(a, 0.02); return [p[0], p[1] - 0.01, p[2] + 0.04]; }; // fingers round the strap's tip
const kStrapR = ik(U_RDOOR, N_, STRAP_HAND(0), [50, 80, 67]);
void BODY_C; void toWorld;
const trHasp = track("S07a tali pengait dibalik (tangan kanan)", HP[0], HP[1], () => U_RDOOR, () => N_, (t) => STRAP_HAND(HASP.open * ramp(t, HP[0], HP[1])), kStrapR.q, "L", H_UQ, () => 0, true);
const RHINGE: V3 = [ROOM.door.x0 + 0.01, 0, ROOM.z1 - ROOM.t / 2];
const PUSH_R = 0.7; // v5 run 2: 0.62 was a cross-body reach for the right hand (IK 1.4-1.8 cm)
const leafPush = (a: number): V3 => [RHINGE[0] + PUSH_R * Math.cos(a) + Math.sin(a) * 0.065, 0.95, RHINGE[2] - PUSH_R * Math.sin(a) + Math.cos(a) * 0.065];
const inRoot = (t: number): V3 => movesAt(UQ_IN, t).root;
const inYaw = (t: number): number => movesAt(UQ_IN, t).yaw;
const inLean = (t: number) => uqLeanAt(t);
const trToLeaf = track("S07a/b tangan kanan ke daun pintu (melangkah)", HP[1], ro[0], inRoot, inYaw, wpath([HP[1], ro[0]], [STRAP_HAND(HASP.open), leafPush(0)]), trHasp.q1, "L", H_UQ, inLean);
const trRoom = track("S07b dorong pintu ruang toa (tangan kanan)", ro[0], ro[0] + RPUSH_T, inRoot, inYaw, (t) => leafPush(roomDoorAt(t)), trToLeaf.q1, "L", H_UQ, inLean, true);
// runs 9-11: a joint blend from the push to rest swung the hand east into the jamb; it lets go (0.1 s), drops straight down
// and back in front of him (tracked, as he straightens), then joins rest
const R1T = ro[0] + RPUSH_T;
const trRoomBack = track("S07b lepas pintu, tangan turun", R1T + 0.1, R1T + 0.5, inRoot, inYaw, wpath([R1T + 0.1, R1T + 0.5], [leafPush(ROOM_PUSH), [8.45, 0.75, -7.2]]), trRoom.q1, "L", H_UQ, inLean);
const ROOM_VIA: Q = [20, 20, 90];
void trRoomBack;
// the switch lever knob (on, off) from ROOT_A
const KNOB = (lv: number): V3 => [SWITCH[0], SWITCH[1] + 0.08, SWITCH[2] + (lv - 0.5) * 0.06];
// v5 (S10c shows the reach): over the rack's top, not through it (e006_check v5 run 1: joint interpolation, -17 cm); the
// lever stands on a small switch box now (sets006 SWITCH), so the forearm clears the rack's edge
const SW_REST = handW(REST_UQ, "L", ROOT_A, N_, H_UQ);
const SW_T0 = SH.S10c[0] + 0.2; // joint blend from rest to a start in front of the hip (searched: the blend stays out of the torso)
const trSwitch = track("S10c tangan ke tuas (di atas rak)", SW_T0, T("click") - 0.14, () => ROOT_A, () => N_, wpath([SW_T0, T("click") - 0.14], [[8.4, 0.85, -8.2], KNOB(0)]), [13, 90, 66], "L", H_UQ, () => 0, true);
void SW_REST;
const kSw0 = { q: trSwitch.q1, err: TRACK_ERR["S10c tangan ke tuas (di atas rak)"], torso: 0 };
const kSw1 = ik(ROOT_A, N_, KNOB(1), kSw0.q);
export const ARM_KEYS = { kBolt0, kBolt1, kRecv, kChest, kStrapR, kSw1, kGfwd, kGmid, kGhand, kGpoint };
export const ROOM_PUSH_Q = trRoom.q1;
export const SW_Q0 = trSwitch.q0;
void trLet;
/** Uq's right arm (rig L) at t */
export const uqRight = (t: number): Q => {
  const s = shotOf(t);
  if (s === "S04b") { if (t < P("backOpen")[0]) return keysPath(t, [SH.S04b[0], P("bolt")[0], P("bolt")[1]], [kBolt0.q, kBolt0.q, kBolt1.q]); return trOpen.at(t); }
  if (s === "S05") { if (t < pm_[0]) return trOpen.q1; if (t <= pm_[1]) return uTrPalm.at(t); if (t < tk_ + 0.25) return uTrPalm.q1; return uTrChest.at(t); }
  if (s === "S06a") { if (t <= P("push")[1]) return trPush.at(t); return keysPath(t, [P("push")[1] + 0.1, P("push")[1] + 0.85], [trPush.q1, REST_UQ]); } // runs 6-9: the hand stays where it let go while the leaf swings off it (0.25 s), then drops to rest as he straightens (a joint blend that stays out of the torso)
  if (s === "S07a" || s === "S07b") {
    if (t <= PO[1]) return trKey.at(t);
    if (t < HP[0]) return keysPath(t, [PO[1], T_POCKET, T_POCKET + 0.1, HP[0]], [trKey.q1, POCKET_Q, POCKET_Q, trHasp.q0]);
    if (t <= HP[1]) return trHasp.at(t);
    if (t <= ro[0]) return trToLeaf.at(t);
    if (t <= R1T) return trRoom.at(t);
    // runs 9-14: lets go, then down via a pose searched to keep the hand off the east jamb and out of the torso, to rest
    return keysPath(t, [R1T + 0.1, R1T + 0.45, R1T + 1.0], [trRoom.q1, ROOM_VIA, REST_UQ]); // runs 8-9: off the leaf a little down and back (tracked: no elbow flip), then to rest
  }
  // runs 19-22: the reach starts 0.32 s before the S10c cut (S10b is the text box: not seen): 13 -> <= 11 deg/frame
  if (s === "S10b" || s === "S10c" || s === "S11") { if (t < SW_T0) return keysPath(t, [SH.S10c[0] - 0.32, SW_T0], [REST_UQ, trSwitch.q0]); if (t <= T("click") - 0.14) return trSwitch.at(t); return keysPath(t, [T("click") - 0.14, T("click") - 0.08, T("click") + 0.07], [trSwitch.q1, kSw0.q, kSw1.q]); } // run 21: the flip over 0.15 s (0.1 s: 12.8 deg/frame) // v4 run 1: the way back to rest passed through the rack: the hand stays on the lever
  if (s === "S04a") return qlerp(REST_UQ, [55, 18, 10], ramp(t, P("bathOpen")[0] - 0.3, P("bathOpen")[0] + 0.3) * (1 - ramp(t, P("bathOpen")[1], P("bathOpen")[1] + 0.6))); // run 1: a step at bathOpen end (47 deg/frame)
  return REST_UQ;
};
/** Uq's left arm (rig R) at t: at rest (v5: every hand action is the right hand's) */
export const uqLeft = (t: number): Q => { void t; return REST_UQ; };
const keyTurn = (t: number) => lockFrame(t).keyTurn;
/** Uq's hand orientations (palm up for the key in S05, a pinch on the key in S07a, around the lever in S11) */
export const uqHands = (t: number): { L?: C1Hand; R?: C1Hand } | undefined => {
  const s = shotOf(t);
  if (s === "S05") { const tk = T("take"); return t < P("palm")[0] ? undefined : { L: { dir: [0.1, 0.1, 1], palm: [0, 1, 0], curl: t > tk ? 12 + 48 * ramp(t, tk, tk + 0.2) : 12, w: 0.9 } }; }
  if (s === "S07a" && t <= PO[1]) { const a = (keyTurn(t) * Math.PI) / 2; return { L: { dir: [0, -0.2, 1], palm: [-Math.cos(a), -Math.sin(a), 0], curl: 55, w: 0.9 } }; }
  // keys v1: on the lever the open hand read as a wave; fingers forward-down around the lever, palm down
  if (s === "S11") return { L: { dir: [-0.2, -0.65, 0.7], palm: [0, -1, 0.1], curl: 70, w: 0.9 } };
  return undefined;
};

// ------------------------------------------------------------------ characters
export type Ch6 = { who: "uq" | "adik"; root: V3; yaw: number; height: number; pose: Record<string, unknown>; legPose?: unknown; hands?: unknown; face: Record<string, unknown>; feet?: { L: V3; R: V3 } };
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
const breath = (t: number, a: number, hz: number, ph: number) => a * Math.sin(t * 2 * Math.PI * hz + ph);
const armsPose = (qR: Q, qL: Q, extra: Record<string, unknown> = {}) => ({ armL: [qR[0], qR[1]], armLFwd: qR[2], armR: [qL[0], qL[1]], armRFwd: qL[2], ...extra });
const adRest = (extra: Record<string, unknown> = {}) => ({ ...(adEnd.pose as object), armL: [REST_AD[0], REST_AD[1]], armLFwd: 0, armR: [REST_AD[0], REST_AD[1]], armRFwd: REST_AD[2], ...extra });
export const charsAt = (t: number): { chars: Ch6[]; phone?: { p: V3; q: [number, number, number, number] }; glow: number } => {
  const s = shotOf(t);
  if (s === "S01" || s === "S02" || s === "S03") {
    const c = charsAt5(EP4_END_T);
    const vib = T("vib");
    const shake = t >= vib && t < vib + 0.52 ? 0.002 * Math.sin(t * 2 * Math.PI * 18) : 0;
    const u = { ...c.chars[0], pose: { ...c.chars[0].pose, headNod: 16 + breath(t, 1.0, 0.28, 0) } } as Ch6;
    const a = { ...c.chars[1], pose: { ...c.chars[1].pose, headNod: 10 + breath(t, 0.9, 0.31, 1.3), headYaw: -22 * ramp(t, vib + 0.2, vib + 0.7) } } as Ch6;
    return { chars: [u, a], phone: { p: [c.phone.p[0] + shake, c.phone.p[1], c.phone.p[2]], q: c.phone.q }, glow: 1 };
  }
  const qR = uqRight(t);
  const qL = uqLeft(t);
  const hands = uqHands(t);
  const face = { eyes: "open", brows: "worried", mouth: "flat" };
  let mu: { root: V3; yaw: number; legPose?: unknown; feetWorld?: { L: V3; R: V3 } }, ma: typeof mu;
  let un = 2, uy = 0, an = 0, ay = 0, lean = 0, alean = 0;
  if (s === "S04a") { mu = movesAt(UQ_OUT, t); ma = movesAt(AD_OUT, t); }
  else if (s === "S04b" || s === "S05") {
    mu = { root: U_DOOR, yaw: N_ }; ma = { root: A_DOOR, yaw: N_ - 0.5 }; lean = uqLeanAt(t);
    un = s === "S05" ? 14 : 10; uy = s === "S05" ? 6 : 0; an = 6;
  } else if (s === "S06a") { mu = movesAt(UQ_EXIT, t); ma = movesAt(AD_EXIT, t); un = 4; an = 2; lean = uqLeanAt(t); }
  else if (s === "S06c") { mu = movesAt(UQ_EXIT, t); ma = movesAt(AD_EXIT, t); lean = 8; alean = 6; un = -4; an = -2; uy = -10 * ramp(t, T("led") - 0.2, T("led") + 0.3); }
  else if (s === "S07a" || s === "S07b" || s === "S08a") {
    mu = movesAt(UQ_IN, t);
    ma = movesAt(AD_IN, t);
    lean = uqLeanAt(t);
    un = s === "S07a" ? 14 : 2;
  } else {
    // in the toa room, Uq at ROOT_A facing the monitors; adik east of the door
    mu = { root: ROOT_A, yaw: N_ }; ma = { root: AD_ROOM, yaw: N_ + 0.35 };
    if (s === "S10") { const g = ramp(t, SH.S10[0] + 0.45, SH.S10[1]); uy = -24 * g; un = lerp(0, 18, g); }
    // v5: the decision: from the screens, his head (and eyes) go to the switch on his right, down; then the click (S11)
    // MP4 r1: +26 turned him AWAY from the switch (headYaw > 0 = toward his own left); the switch is on his right: more negative
    if (s === "S10c") { const g = ramp(t, SH.S10c[0] + 0.05, SH.S10c[0] + 0.45); uy = lerp(-24, -36, g); un = lerp(18, 30, g); } // r2: -55 hid his face from the lens
    if (s === "S12" || s === "S14") { un = 6 + breath(t, 1.2, 0.3, 0); uy = 6; }
    an = 4;
  }
  const uq: Ch6 = {
    who: "uq", root: mu.root, yaw: mu.yaw, height: H_UQ, legPose: mu.legPose ?? uqEnd.legPose, feet: mu.feetWorld,
    hands,
    pose: armsPose(qR, qL, { headNod: un, headYaw: uy, lean }),
    face,
  };
  const ad: Ch6 = {
    who: "adik", root: ma.root, yaw: ma.yaw, height: H_AD, legPose: ma.legPose ?? adEnd.legPose, feet: ma.feetWorld,
    pose: adRest({ headNod: an, headYaw: ay, lean: alean }), face: { eyes: "open", brows: "worried", mouth: "flat" },
  };
  return { chars: [uq, ad], glow: 0 };
};

/** the guard's key -> Uq's palm (one frame: "take"); then closed in his fist (not drawn) until the padlock */
export const keyAt = (t: number): { o: V3; mid: V3; holder: "guard" | "uq" } | null => {
  const s = shotOf(t);
  if (s !== "S05" && !(s === "S04b" && t > P("backOpen")[1] - 0.2)) return null;
  const tk = T("take");
  if (s !== "S05" || t < tk) { const g = guardHand(t)!; const o = KEY_G(g); return { o, mid: keyMid(o), holder: "guard" }; }
  if (t > P("withdraw")[1] + 0.2) return null;
  const c = charsAt(t).chars.find((x) => x.who === "uq")!;
  const pose = c.pose as Record<string, unknown>;
  const a = pose.armL as number[];
  const h = handW([a[0], a[1], pose.armLFwd as number], "L", c.root, c.yaw, H_UQ, (pose.lean as number) ?? 0);
  const o0 = KEY_G(HG_FK);
  const o: V3 = [h[0] + o0[0] - RECV_FK[0], h[1] + o0[1] - RECV_FK[1], h[2] + o0[2] - RECV_FK[2]];
  return { o, mid: keyMid(o), holder: "uq" };
};
/** the padlock: on the eye / coming off it (lock006), in Uq's right hand, then in his pocket (not drawn) */
export const LOCK_HOLDER = (t: number): "eye" | "uq kanan" | "saku" => (t <= PO[1] ? "eye" : t < T_POCKET ? "uq kanan" : "saku");
export const padlockAt = (t: number): LockFrame | null => {
  const s = shotOf(t);
  if (!["S06b", "S07a", "S07b", "S08a"].includes(s)) return s === "S06c" || s === "S06a" ? lockFrame(0) : null;
  if (t <= PO[1]) return lockFrame(t);
  if (t >= T_POCKET) return null; // in his pocket
  const c = charsAt(t).chars.find((x) => x.who === "uq")!;
  const pose = c.pose as Record<string, unknown>;
  const a = pose.armL as number[];
  const h = handW([a[0], a[1], pose.armLFwd as number], "L", c.root, c.yaw, H_UQ, (pose.lean as number) ?? 0);
  const d: V3 = [h[0] - HAND_FREE[0], h[1] - HAND_FREE[1], h[2] - HAND_FREE[2]];
  const f = LOCK_FREE;
  return { ...f, o: add3(f.o, d), keyTip: add3(f.keyTip, d), keyBow: add3(f.keyBow, d), keywayIn: add3(f.keywayIn, d) };
};

// ------------------------------------------------------------------ cameras and shot flags
export type Stage6 = { shot: string; cam: Cam; focus: V3; place: "bath" | "kitchen" | "gang" | "street" | "room" | "ui"; chars: boolean; dim: number; exposure: number };
export const stageAt = (t: number, shot: string): Stage6 => {
  const [a, b] = SH[shot];
  const u = clamp01((t - a) / (b - a));
  switch (shot) {
    case "S01":
    case "S03": return { shot, cam: BATH_CAM, focus: [1.55, 1.1, -3.67], place: "bath", chars: true, dim: 0.55, exposure: -2.0 };
    case "S02": return { shot, cam: camLerp(BATH_CAM, cam([3.55, 1.25, -3.67], [1.55, 1.12, -3.67], 50), sm(u)), focus: [1.55, 1.1, -3.67], place: "bath", chars: true, dim: 0, exposure: -1.3 };
    case "S04a": return { shot, cam: camLerp(cam([-1.75, 1.45, -3.7], [1.3, 1.08, -3.95], 62), cam([-1.7, 1.45, -3.72], [1.2, 1.08, -3.95], 60), u), focus: [0.9, 1.1, -3.95], place: "kitchen", chars: true, dim: 0, exposure: 0 };
    case "S04b": return { shot, cam: camLerp(cam([-0.5, 1.72, -4.3], [-1.02, 1.05, -4.98], 52), cam([-0.52, 1.7, -4.32], [-1.04, 1.04, -4.98], 50), u), focus: [-0.95, 1.1, -4.95], place: "kitchen", chars: true, dim: 0, exposure: 0 };
    // v5: from beside Uq's right shoulder, toward the gap (the v4 angle looked through the back of his head once he stood at
    // the door): his right hand, the guard's arm through the gap, the guard's shoulder outside, the key
    // MP4 r1: aimed at hand height, the caption band sat on the key at the handover: aimed 10 cm lower (action ~40 % high)
    case "S05": return { shot, cam: camLerp(cam([-0.42, 1.32, -4.72], [-1.12, 0.92, -5.12], 44), cam([-0.43, 1.31, -4.74], [-1.12, 0.92, -5.12], 42), u), focus: [-1.08, 1.0, -5.08], place: "kitchen", chars: true, dim: 0, exposure: 0 };
    // v5: in the gang, north of the door, facing it (south): the leaf, the guard (right), Uq and adik coming THROUGH the doorway
    // MP4 r1: the guard's head was cut at the top: aimed higher, a little wider
    case "S06a": return { shot, cam: camLerp(cam([-1.35, 1.55, -7.2], [-0.95, 1.12, -5.0], 66), cam([-1.37, 1.53, -7.22], [-0.92, 1.12, -5.05], 64), u), focus: [-0.85, 1.0, -5.2], place: "gang", chars: true, dim: 0, exposure: 0 };
    case "S06c": return { shot, cam: camLerp(cam([2.65, 0.95, -6.45], [-1.5, 1.2, -6.65], 70), cam([2.75, 0.95, -6.45], [-1.5, 1.2, -6.65], 68), u), focus: [0.5, 1.0, -6.2], place: "gang", chars: true, dim: 0, exposure: 0 };
    case "S06b": return { shot, cam: camLerp(cam([4.75, 1.45, -5.25], [4.35, 1.2, 6.5], 40), cam([4.75, 1.45, -5.1], [4.35, 1.2, 6.5], 38), u), focus: [4.3, 1.2, 6.5], place: "gang", chars: false, dim: 0, exposure: 0 };
    // v5: the insert from the east-front (about 60 deg off the lock's face) so the hand never covers the keyway
    case "S07a": return { shot, cam: camLerp(cam([9.1, 1.1, -6.88], [8.6, 0.97, -7.29], 30), cam([9.08, 1.09, -6.9], [8.6, 0.97, -7.29], 29), u), focus: [8.62, 1.0, -7.28], place: "gang", chars: true, dim: 0, exposure: 0 };
    case "S07b": return { shot, cam: camLerp(cam([7.95, 1.5, -5.35], [8.2, 1.1, -7.3], 58), cam([7.97, 1.5, -5.5], [8.2, 1.1, -7.3], 56), u), focus: [8.2, 1.2, -7.2], place: "gang", chars: true, dim: 0, exposure: 0 };
    case "S08a": return { shot, cam: camLerp(cam([9.1, 2.05, -9.1], [7.95, 1.0, -7.55], 72), cam([9.08, 2.02, -9.08], [8.05, 1.05, -7.65], 70), u), focus: [8.2, 1.2, -7.8], place: "room", chars: true, dim: 0, exposure: 0 };
    case "S10": return { shot, cam: camLerp(cam([7.9, 1.38, -8.62], [8.2, 1.22, -7.92], 60), cam([7.92, 1.38, -8.58], [8.2, 1.22, -7.92], 57), u), focus: [8.2, 1.3, -7.92], place: "room", chars: true, dim: 0, exposure: 0 };
    // MP4 r1-r3: from his LEFT-front any turn toward the switch (his right) took his face out of the lens; from his right-front
    // (the switch's side, outside the rack, south of the desk) the turn comes toward the lens
    case "S10c": return { shot, cam: camLerp(cam([8.48, 1.4, -8.6], [8.2, 1.22, -7.92], 50), cam([8.47, 1.39, -8.58], [8.2, 1.21, -7.92], 48), u), focus: [8.2, 1.3, -7.92], place: "room", chars: true, dim: 0, exposure: 0 };
    case "S11": return { shot, cam: cam([8.3, 1.3, -8.5], [8.61, 0.9, -8.08], 40), focus: [8.62, 1.05, -8.1], place: "room", chars: true, dim: 0, exposure: 0 }; // v1: aimed at the old switch spot, adik filled the frame
    case "S12": return { shot, cam: camLerp(cam([7.72, 1.4, -8.65], [8.2, 1.22, -7.92], 52), cam([7.75, 1.4, -8.58], [8.2, 1.23, -7.92], 49), u), focus: [8.2, 1.3, -7.92], place: "room", chars: true, dim: 0, exposure: 0 };
    case "S13": return { shot, cam: camLerp(cam([1.7, 1.55, 4.55], [-1.0, 1.3, 7.0], 52), cam([1.65, 1.55, 4.6], [-1.0, 1.3, 7.0], 50), u), focus: [-0.6, 1.3, 6.2], place: "street", chars: false, dim: 0, exposure: 0 };
    case "S14": return { shot, cam: camLerp(cam([7.9, 1.38, -8.62], [8.2, 1.22, -7.92], 56), cam([7.93, 1.38, -8.56], [8.2, 1.22, -7.92], 52), u), focus: [8.2, 1.3, -7.92], place: "room", chars: true, dim: 0, exposure: 0 };
    default: return { shot, cam: BATH_CAM, focus: [0, 1, 0], place: "ui", chars: false, dim: 0, exposure: 0 };
  }
};

