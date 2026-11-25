// Episode 3 (2026-11-004) PILOT v1 stage (owner 2026-11-20, D-049): a pure function of EPISODE time for the two blocks
// Blok A 0–6.8 s (S01 knob insert, S02) and Blok B 27.4–35.0 s (S08a LED insert, S08 two-shot, S09 POV + screen flash).
// Timing = the owner's VO (pilot004-plan.json, scripts/ep004_pilot_audio.py plan). Poses: e004Poses.ts (S02 fallback,
// numerically passed in tools/e004_mouth_check.ts); the arm paths are the checked joint-space paths:
//   adik's left hand REST → mouth 2.1–2.9 s; then Uq's right hand REST → mid [15, 75, −90] → her shoulder 2.9–3.7 s.
import * as THREE from "three";
import { c1ArmIK } from "../c1/bodyIk";
import { C1_BUILD } from "../c1/c1rig";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { EP2_END, S02 } from "./e004Poses";
import { CAMS, ledWorld } from "./LookDev004";
import PLAN from "./pilot004-plan-v3.json"; // v3 (D-051): cards after T, S02 to the cut 9.2 s, S08a 1.5 s

export const FPS = 30;
export const BLOCKS = PLAN.blocks as [number, number][];
export const BEATS = PLAN.beats as Record<string, number>;
export const SCREEN = PLAN.screen as [number, number];
export type PLine = { id: string; who: string; text: string; start: number; end: number; bursts?: [number, number][] };
export const LINES = PLAN.lines as PLine[];
export const CARDS = PLAN.cards as { in: number; rightLag: number; fade: number; click: number; out: number; gone: number };
const CUT_A = PLAN.cutA as number;
const B_SHIFT = PLAN.s08aExtra as number; // Blok B after S08a: +0.5 s (v3)
/** pilot frame → episode time */
export const PILOT_FRAMES = Math.round(BLOCKS.reduce((s, [a, b]) => s + (b - a), 0) * FPS);
export const epTime = (pf: number) => {
  let t = pf / FPS;
  for (const [a, b] of BLOCKS) {
    if (t < b - a - 1e-9) return a + t;
    t -= b - a;
  }
  return BLOCKS[BLOCKS.length - 1][1];
};
export type ShotId = "s01" | "s02" | "s08a" | "s08" | "s09";
export const SHOTS: { id: ShotId; start: number; end: number }[] = [
  { id: "s01", start: 0, end: 2.1 }, { id: "s02", start: 2.1, end: CUT_A },
  { id: "s08a", start: 27.4, end: 28.4 + B_SHIFT }, { id: "s08", start: 28.4 + B_SHIFT, end: 31.6 + B_SHIFT }, { id: "s09", start: 31.6 + B_SHIFT, end: 34.0 + B_SHIFT },
];
export const shotAt = (t: number): ShotId => (SHOTS.find((s) => t >= s.start - 1e-9 && t < s.end - 1e-9) ?? SHOTS[SHOTS.length - 1]).id;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
type Q = [number, number, number];
const qlerp = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });

// ------------------------------------------------------------------ S01: the knob (0.6 m, vent glow ×6, D-049)
/** inner knob angle (deg): turns from outside, strains against the bolt, turns back — on the SFX beats */
export const knobDeg = (t: number) => {
  const turn = ramp(t, BEATS.knobTurn + 0.05, BEATS.knobTurn + 0.5) * 40;
  const strain = t >= BEATS.knobStrain && t < BEATS.knobStrain + 0.35 ? 2.2 * Math.sin((t - BEATS.knobStrain) * 2 * Math.PI * 6) : 0;
  const back = ramp(t, BEATS.knobBack, BEATS.knobBack + 0.4);
  return turn * (1 - back) + strain;
};
/** the leaf pushed in from outside by 3 mm for 2 frames on the bolt rattle (+z = into the house) */
export const doorPush = (t: number) => (t >= BEATS.boltRattle && t < BEATS.boltRattle + 2 / FPS ? 0.003 : 0);
const S01A = cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30);

// ------------------------------------------------------------------ characters
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
export const REST_UQ: Q = [6, 8, 0], REST_AD: Q = [10, -4, 0], MID_UQ: Q = [15, 75, -90];
const QU = S02.q.uq as Q, QA = S02.q.adik as Q;
const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const wrapDeg = (a: number) => (Math.atan2(Math.sin(a), Math.cos(a)) * 180) / Math.PI;
const T_LED = ledWorld("T");

/** adik's left arm pointing at the living-room LED (S08): a near-straight arm along the line shoulder → LED */
export const POINT_Q: Q = (() => {
  const { S } = armChain({ ...(adEnd.pose as object), armR: [REST_AD[0], REST_AD[1]], armRFwd: REST_AD[2] } as never, "R", LAY);
  const sh = S.clone().multiplyScalar(adEnd.height).applyAxisAngle(UP, adEnd.yaw).add(new THREE.Vector3(...S02.adik.root));
  // aim 0.6 m above the LED (still "up at the corner") with a near-straight arm: from lens P the LED is behind the lens,
  // so an arm aimed straight at it foreshortens into the face (pilot still v1: read as covering the mouth again)
  const aim = new THREE.Vector3(...T_LED).add(new THREE.Vector3(0, 0.6, 0));
  const dir = aim.sub(sh).normalize();
  const tg = sh.clone().add(dir.multiplyScalar(0.41));
  const r = c1ArmIK({ root: S02.adik.root, yaw: adEnd.yaw, body: {}, side: "R", target: [tg.x, tg.y, tg.z], ref: [70, 20, 0], height: adEnd.height, avoidTorso: true, wMin: -60 });
  return [r.arm[0], r.arm[1], r.fwd];
})();
const MID_POINT: Q = [100, 80, 15];

export const uqAt = (t: number) => {
  let q: Q = REST_UQ, headYaw = 0, headNod = 2;
  if (t < 10) {
    // S02: his right hand to her shoulder AFTER her hand reached her mouth (the checked order)
    const u1 = ramp(t, 2.9, 3.3), u2 = ramp(t, 3.3, 3.7);
    q = u2 > 0 ? qlerp(MID_UQ, QU, u2) : qlerp(REST_UQ, MID_UQ, u1);
    headYaw = -30 * ramp(t, 2.8, 3.3) + 75 * ramp(t, 5.9, 6.6); // to adik (his right), then toward the hallway (his left) on the steps
    headNod = 2 - 6 * ramp(t, 5.9, 6.6);
    // v3: the longer S02 (to 9.2 s) — he stays still and listens: breathing in the head only (±1.2°, ~0.28 Hz; the arms
    // and torso do not move, so the hand on her shoulder keeps its checked contact) and a small drift of the look
    headNod += 1.2 * Math.sin((t - 2.1) * 2 * Math.PI * 0.28);
    headYaw += 4 * Math.sin((t - 6.6) * 2 * Math.PI * 0.11) * ramp(t, 6.6, 7.2);
  } else {
    // Blok B: hands down; he looks up at the corner after adik points (S08), with her
    const d = wrapDeg(yawTo(uqEnd.root, T_LED) - uqEnd.yaw);
    headYaw = Math.max(-60, Math.min(60, d)) * ramp(t, 29.2 + B_SHIFT, 29.8 + B_SHIFT);
    headNod = 2 - 22 * ramp(t, 29.2 + B_SHIFT, 29.8 + B_SHIFT);
  }
  return {
    ...uqEnd,
    pose: { ...(uqEnd.pose as object), armL: [q[0], q[1]] as [number, number], armLFwd: q[2], headYaw, headNod },
    face: { eyes: "open" as const, brows: "worried" as const, mouth: "flat" as const, look: t < 10 ? -0.4 * ramp(t, 2.8, 3.3) * (1 - ramp(t, 5.9, 6.6)) + 0.15 * Math.sin((t - 6.6) * 2 * Math.PI * 0.17) * ramp(t, 6.6, 7.2) : 0 },
  };
};
export const adikAt = (t: number) => {
  let q: Q = REST_AD, headYaw = 20, headNod = -4;
  if (t < 10) {
    q = qlerp(REST_AD, QA, ramp(t, 2.1, 2.9));
    // v3: breathing in the head only while she holds her mouth (other phase than Uq), eyes drift toward the hallway
    headNod += 1.0 * Math.sin((t - 2.1) * 2 * Math.PI * 0.31 + 1.3);
    headYaw += 6 * ramp(t, 6.0, 6.9) + 2 * Math.sin((t - 6.9) * 2 * Math.PI * 0.13) * ramp(t, 6.9, 7.5);
  } else {
    // S08: notices the LED, head up toward the corner (above-left of the lens, not into it), left arm points
    const d = wrapDeg(yawTo(S02.adik.root, T_LED) - adEnd.yaw);
    const look = ramp(t, 28.5 + B_SHIFT, 29.0 + B_SHIFT);
    headYaw = 20 * (1 - look) + Math.max(-60, Math.min(60, d)) * look;
    headNod = -4 - 24 * look;
    // v2 (owner D-050, option b): NO pointing arm — she only looks up while she whispers (v1's point read as a hand
    // over her face from lens P); the left hand stays down
    q = REST_AD;
    void MID_POINT;
    void POINT_Q;
  }
  const talking = LINES.some((l) => l.who === "adik" && (l.bursts ?? [[l.start, l.end]]).some(([a, b]) => t >= a && t < b)) && (t * 2) % 1 < 0.6;
  return {
    ...adEnd, root: S02.adik.root,
    pose: { ...(adEnd.pose as object), armR: [q[0], q[1]] as [number, number], armRFwd: q[2], headYaw, headNod },
    face: { eyes: "open" as const, brows: "raised" as const, mouth: talking ? ("open" as const) : ("flat" as const) },
  };
};

// ------------------------------------------------------------------ cameras
const P0: V3 = [0.75, 1.5, 2.55];
const midS02 = (y: number): V3 => [(S02.uq.root[0] + S02.adik.root[0]) / 2, y, (S02.uq.root[2] + S02.adik.root[2]) / 2];
const POV_EYE: V3 = [-1.5, 1.42, 1.95];
const POV_LOOK: V3 = [0.85, 2.55, 2.85];
export type PStage = { shot: ShotId; t: number; cam: Cam; focus: V3; chars: boolean; knob?: number; push?: number; vent?: number; ledT: number; glint: number; blur: number };
export const stageAt = (t: number): PStage => {
  const shot = shotAt(t);
  const sp = SHOTS.find((s) => s.id === shot)!;
  const u = clamp01((t - sp.start) / (sp.end - sp.start));
  // v2 (D-050): fully on ON the click's frame (v1 ramped over the next 2 frames: 1 frame late)
  const ledT = t >= BEATS.ledT - 1e-6 ? 1 : 0;
  const glint = t >= SCREEN[0] && t < SCREEN[1] ? ramp(t, SCREEN[0], SCREEN[0] + 0.07) * (1 - ramp(t, SCREEN[1] - 0.1, SCREEN[1])) : 0;
  if (shot === "s01") {
    // slow push, ~3 %/s of the 0.6 m distance
    const z = S01A.pos[2] - 0.018 * t;
    return { shot, t, cam: cam([S01A.pos[0], S01A.pos[1], z], S01A.look, 30), focus: [-1.15, 1.0, -4.955], chars: false, knob: knobDeg(t), push: doorPush(t), vent: 6, ledT: 0, glint: 0, blur: 0.8 };
  }
  if (shot === "s02") {
    const c = { pos: lerp3(P0, [0.62, 1.48, 2.48], sm(u)), look: lerp3(midS02(1.0), midS02(1.02), u), fov: lerp(50, 44, sm(u)), roll: 0 };
    return { shot, t, cam: c, focus: midS02(1.1), chars: true, ledT: 0, glint: 0, blur: 0.5 };
  }
  if (shot === "s08a") {
    // insert: the corner from Uq's eye (wider than S09); the LED switches on ON CAMERA with its click (D-049 criterion)
    return { shot, t, cam: cam(POV_EYE, POV_LOOK, lerp(30, 28, u)), focus: T_LED, chars: true, ledT, glint: 0, blur: 0.5 };
  }
  if (shot === "s08") {
    const c = { pos: lerp3(P0, [0.68, 1.49, 2.52], u), look: midS02(1.05), fov: lerp(46, 43, u), roll: 0 };
    return { shot, t, cam: c, focus: midS02(1.1), chars: true, ledT, glint: 0, blur: 0.5 };
  }
  // s09: POV push on the corner, the screen on for 0.7 s (lens glint only: physics, owner D-049 butir 6)
  return { shot, t, cam: cam(POV_EYE, POV_LOOK, lerp(24, 20, sm(u))), focus: T_LED, chars: true, ledT, glint, blur: 0.5 };
};
void CAMS;
