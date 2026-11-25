// Episode 5 (2026-11-006) v5: the toa-room hasp + padlock as GEOMETRY and STATE, a pure function of t (drawn by sets006
// ToaRoom, held by stage006's hands, checked by tools/e006_check.ts R4). Owner review of v4 (2026-11-24, Kesalahan_Logika/
// gembok&kunci_tidak_masuk_Akal.png): the v4 padlock was a box with two pins, no hasp, no keyway, holding nothing.
// Real object (USULAN, a common Indonesian door hasp + a ~40 mm brass padlock):
//   - EYE: a wire ring (5 mm wire) standing out of the wall face beside the door's free edge, in the y-z plane (hole axis x)
//   - HASP: a 4 cm spacer block screwed to the leaf, a steel strap hinged on it (vertical axis); closed, the strap lies on
//     the wall face and the eye comes through its slot; open, it is swung back ~170 deg onto the leaf
//   - PADLOCK: brass body 40 x 35 x 15 mm, steel shackle 6 mm (inside width 20 mm, clearance 22 mm), keyway on the FRONT
//     face (the key goes in along -z, toward the wall); locked, the shackle's crown runs through the eye and hangs on it
// Sequence (plan events, scripts/ep006_episode_audio.py): keyIn (tip in along the keyway axis) -> lock (key turned 90 deg)
// -> shackle (the short leg springs out: the body drops 8 mm on the long leg) -> padOff (slide the eye to the short-leg corner,
// turn the lock +90 deg about z on that corner so the short leg points along the hole, pull it out, away) -> hasp (strap
// swung back by Uq's LEFT hand; his right hand holds the open padlock with the key in it) -> roomOpen (left hand pushes).
import * as THREE from "three";
import type { V3 } from "../inkbeat/types";
import { ROOM } from "./closeMotion006";
import PLAN from "./episode006-plan.json";

const EV = PLAN.events as unknown as Record<string, [number, number]>;
const cl = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = cl(x); return u * u * (3 - 2 * u); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));

export const WALL_FACE = ROOM.z1; // -7.30, the outside face of the toa room's south wall
export const LEAF_FACE = ROOM.z1 - ROOM.t / 2 + 0.02; // -7.34, the door leaf's outside face (closed)
export const EYE = { c: [8.62, 1.05, WALL_FACE + 0.014] as V3, r: 0.009, wire: 0.0025, out: 0.028 };
export const PL = { w: 0.04, h: 0.035, d: 0.015, leg: 0.013, wire: 0.003, clear: 0.022, drop: 0.008, keyDepth: 0.012, keyLen: 0.05 };
/** body centre in the lock frame (origin = the crown's wire centre line, the lock in the x-y plane, front = +z) */
export const BODY_C: V3 = [0, -(PL.clear + PL.wire) - PL.h / 2, 0];
export const KEYWAY_L: V3 = [0, BODY_C[1] - 0.006, PL.d / 2]; // the keyway's mouth on the front face
export const HASP = { hinge: [8.53, 1.05, WALL_FACE + 0.003] as V3, len: 0.115, w: 0.035, open: 2.95, block: [8.49, 8.53] as [number, number] };
/** locked: the crown rests on the eye's lower wire */
export const LOCK0: V3 = [EYE.c[0], EYE.c[1] - EYE.r + PL.wire, EYE.c[2]];

export type LockFrame = {
  /** lock frame: origin (crown centre) and rotation about z (rad) */
  o: V3; rz: number;
  /** body drop on the long leg (0 .. PL.drop) and the key: insertion 0..1, turn 0..1 */
  drop: number; keyIn: number; keyTurn: number;
  shackleOpen: boolean; onEye: boolean; haspAngle: number;
  keyTip: V3; keyBow: V3; keywayIn: V3; axis: V3;
  /** after padOff the padlock rides in Uq's right hand: the stage moves it (this frame = where the hand let the eye go) */
  free: boolean;
};
const P3 = (o: V3, rz: number, l: V3): V3 => { const c = Math.cos(rz), s = Math.sin(rz); return [o[0] + c * l[0] - s * l[1], o[1] + s * l[0] + c * l[1], o[2] + l[2]]; };
export const toWorld = P3;
/** the lock frame and key at t, as long as the padlock is on the eye or being taken off it (the stage takes over after) */
export const lockFrame = (t: number): LockFrame => {
  const kin = EV.keyIn, lk = EV.lock, sh = EV.shackle, po = EV.padOff, hp = EV.hasp;
  const keyIn = rp(t, kin[0], kin[1]);
  const keyTurn = rp(t, lk[0], lk[1]);
  const pop = rp(t, sh[0], sh[1]);
  const u = (t - po[0]) / (po[1] - po[0]);
  const slide1 = sm(u / 0.15), rot = sm((u - 0.15) / 0.25), slide2 = sm((u - 0.4) / 0.15), away = sm((u - 0.55) / 0.45);
  // slide the eye to the short-leg corner (lock moves -x by one leg offset), turn +90 deg about z on that corner, pull the short
  // leg out through the eye (-x again, the leg now lies along x), then away toward Uq (+z) and down
  const pivot: V3 = [LOCK0[0], LOCK0[1], LOCK0[2]];
  const rz = (rot * Math.PI) / 2;
  const corner: V3 = [PL.leg, 0, 0];
  // origin such that the corner sits at `pivot - slide1*0` after slide1 (the corner reaches the eye centre line)
  const o0: V3 = [LOCK0[0] - PL.leg * slide1, LOCK0[1], LOCK0[2]];
  // rotation about the corner: o = cornerWorld - R*corner
  const cw: V3 = [o0[0] + PL.leg, o0[1], o0[2]];
  const oR: V3 = [cw[0] - Math.cos(rz) * corner[0], cw[1] - Math.sin(rz) * corner[0], cw[2]];
  const oS: V3 = [oR[0] - (PL.clear + 0.012) * slide2, oR[1], oR[2]];
  // v5 run 2: away toward the middle of his body, where his LEFT hand can take it (IK 2.3-4.5 cm short at the old spot)
  const o: V3 = [oS[0] - 0.06 * away, oS[1] - 0.06 * away, oS[2] + 0.05 * away];
  void pivot;
  const drop = PL.drop * pop;
  const kTipL: V3 = [KEYWAY_L[0], KEYWAY_L[1] - drop, KEYWAY_L[2] + 0.05 * (1 - keyIn) - PL.keyDepth * keyIn];
  const kBowL: V3 = [kTipL[0], kTipL[1], kTipL[2] + PL.keyLen + 0.006];
  const kInL: V3 = [KEYWAY_L[0], KEYWAY_L[1] - drop, KEYWAY_L[2] - PL.keyDepth];
  return {
    o, rz, drop, keyIn, keyTurn, shackleOpen: pop > 0.999, onEye: u < 0.55, haspAngle: HASP.open * rp(t, hp[0], hp[1]),
    keyTip: P3(o, rz, kTipL), keyBow: P3(o, rz, kBowL), keywayIn: P3(o, rz, kInL), axis: [0, 0, -1], free: u >= 1,
  };
};
/** the strap's tip (free end) at angle a (0 = closed over the eye, +x; opens toward +z and on round to -x) */
export const haspTip = (a: number, extra = 0): V3 => [HASP.hinge[0] + (HASP.len + extra) * Math.cos(a), HASP.hinge[1], HASP.hinge[2] + (HASP.len + extra) * Math.sin(a)];
/** the crown passes through the eye (locked and hanging): the eye's hole centre lies between the legs and the crown's wire
 * centre lies inside the hole (|d| <= hole radius - wire radius) */
export const crownThroughEye = (f: LockFrame) => {
  const x0 = f.o[0] - PL.leg, x1 = f.o[0] + PL.leg;
  const d = Math.hypot(f.o[1] - EYE.c[1], f.o[2] - EYE.c[2]);
  return { ok: f.rz < 1e-3 && EYE.c[0] > x0 && EYE.c[0] < x1 && d <= EYE.r - PL.wire + 1e-4, d, x0, x1 };
};
export const v3 = (p: V3) => new THREE.Vector3(...p);
