// Episode 2026-11-003 — PILOT S03–S06 (L5–L9), owner decisions on look-dev v3 (2026-11-18, D-039).
// One pure function of pilot time, stageAt(t): shot, camera, characters (root, yaw, pose, hands, legs, face), phone,
// torch, bolt. Read by the composition (Pilot003.tsx) AND the checks (tools/p003_check.ts), so the numbers describe
// exactly what is rendered (video-production §9: no clocks, no state between frames).
// Every action time is derived from the line times in pilot003-plan.json (provisional until the voice-over exists;
// scripts/ep003_pilot_audio.py rewrites the times from the real audio).
import * as THREE from "three";
import { C1_BUILD, C1_HEIGHT } from "../c1/c1rig";
import type { C1Hand } from "../c1/c1rig";
import type { C1Face } from "../c1/C1";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { ArmPose } from "../inkbeat/char/skeleton";
import { solveArm } from "../inkbeat/core/ik";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { walkDistance, walkState } from "../cast/walk";
import type { Gait, WalkPlan } from "../cast/walk";
import { BOLT_GRIP } from "../ep002/sets";
import { HOUSE } from "../ep002/geo";
import { ADIK_HEIGHT, ADIK_REST, GLASS, KNOB, NORTH } from "./ld003Scene";
import { GRIPS, gripPhone, handFrame } from "./ld003SceneV3";
import PLAN_V1 from "./pilot003-plan.json";

export const FPS = 30;
const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const D2R = Math.PI / 180;

export type Line = { id: string; who: string; seg: string; text: string; start: number; end: number; pre?: number; bursts?: [number, number][] };

/** s03/s04/s05/s06 = pilot v1 shots. v2 (owner note 2026-11-18, D-041 pending): s03i = INSERT close-up of the vent
 * glass while the torch sweep passes it (S03); s06f = the same insert as a flashback in S06 (scene time remapped into
 * the S03 glass hold, memory grade); s06d = the same insert camera at S06 time (the glass now dark). */
export type ShotId = "s03" | "s03i" | "s04" | "s05" | "s06" | "s06f" | "s06d";
export type Shot = { id: ShotId; start: number; end: number };
export type PlanJson = { lines: unknown[]; timing: string; end: number; /** v2: the audible "Klik" in N03 (pilot s) */ klik?: number; /** v3: the toa switch-on SFX start (pilot s) */ toaOpen?: number };
/** what a pilot version changes; V1 = pilot v1 exactly as rendered 2026-11-18 (stageAt per frame identical) */
export type Variant = {
  /** fractions of the torch sweep (sw0…sw1): hold on the knob, up, hold on the glass, down, hold on the bolt */
  sweep: [number, number, number, number, number];
  /** sideways drift of the aim point (m, + = east) across the glass hold: a hand searching, the pool visibly moving */
  glassDrift: number;
  /** cut to the S03 glass insert (s03i) */
  insert: boolean;
  /** S06 flashback: none, or "fd" = flashback (s06f) then the glass now dark (s06d) to the end of the pilot */
  flash: "none" | "fd";
  /** vent glass material (sets.tsx): v1 "lit", v2 "lit2" (warmer, weaker cold glow) */
  vent: "lit" | "lit2";
  /** cut times rounded up to whole frames, so each <Sequence> starts on its own shot (v1 cut 1 frame late: the first
   * frame of a Sequence still showed the previous shot, QC v1 §2) */
  frameCuts: boolean;
  /** v3 (owner 2026-11-18, P4): "lifted" = the two steps forward are three authored lifted steps from the first walk's
   * real end (no ankle blend, no root jump); "gait" = v1/v2 (WALK2 from STAND + a 0.25 s ankle blend) */
  steps: "gait" | "lifted";
  /** v3 (owner: the face must read before or on "Dapur"): "opener" = S05 cuts in on the toa switch-on (plan toaOpen),
   * Uq jolts, kills the torch and turns on it; "words" = v1/v2 (the jolt on the toa's first word) */
  toaReact: "words" | "opener";
  /** the glass insert lens and its timing: lead = s before the beam reaches the glass, tail = s after it leaves;
   * flashFrom = where the flashback is taken from the insert footage ("hold" v2; v3: s before the beam reaches it) */
  ins: { lens: V3; look: V3; fov: number; lead: number; tail: number; flashFrom: number | "hold" };
  /** episode: start the first walk this many whole strides earlier (same line, same motion from the pilot's start on) */
  walk1Ext?: number;
};
/** v2 glass insert lens (world, m) */
export const INS_LENS: V3 = [-1.25, 1.75, -3.3];
export const INS_LOOK: V3 = [-0.8, 2.12, -4.93];
export const INS_FOV = 40;
/** v3 insert (owner 2026-11-18): wider, so the door's head frame and the top of the door leaf read as "the glass ABOVE
 * the door", and the beam is seen sliding up the leaf into the glass */
export const INS3_LENS: V3 = [-1.45, 1.98, -3.25];
export const INS3_LOOK: V3 = [-0.8, 2.13, -4.93];
export const INS3_FOV = 44;
const INS_V2 = { lens: INS_LENS, look: INS_LOOK, fov: INS_FOV, lead: 0.2, tail: 0.15, flashFrom: "hold" as const };
export const V1: Variant = { sweep: [0.15, 0.28, 0.12, 0.25, 0.2], glassDrift: 0, insert: false, flash: "none", vent: "lit", frameCuts: false, steps: "gait", toaReact: "words", ins: INS_V2 };
export const V2: Variant = { sweep: [0.12, 0.22, 0.24, 0.22, 0.2], glassDrift: 0.06, insert: true, flash: "fd", vent: "lit2", frameCuts: true, steps: "gait", toaReact: "words", ins: INS_V2 };
export const VAR3: Variant = { ...V2, steps: "lifted", toaReact: "opener", ins: { lens: INS3_LENS, look: INS3_LOOK, fov: INS3_FOV, lead: 0.45, tail: 0.2, flashFrom: 0.3 } };

export type CharS = {
  who: "uq" | "adik"; root: V3; yaw: number; height: number;
  pose: ArmPose & { headNod?: number; headYaw?: number; shrugL?: number; shrugR?: number; twist?: number; roll?: number };
  hands?: { L?: C1Hand; R?: C1Hand }; legPose?: { L: { ankle: V3 }; R: { ankle: V3 } }; face: C1Face; blinkSeed?: number;
};

export type Stage = {
  /** t = pilot time (captions, audio); ts = scene time (= t, except in the flashback, which replays the S03 glass hold) */
  t: number; ts: number; shot: ShotId; cam: Cam; focus: V3; chars: CharS[];
  phone: { p: V3; q: [number, number, number, number] };
  torch: { on: number; from: V3; aim: V3; leak: number; leakAt: V3 } | null;
  bolt: number; charK: number; rimK: number;
};

/** builds one pilot version from a plan (line times from the voice-over) and a variant; every returned function is a
 * pure function of pilot time */
export const buildPilot003 = (PLAN: PlanJson, V: Variant) => {
  // ------------------------------------------------------------------ plan and derived beats (seconds, pilot time)
  const LINES = PLAN.lines as Line[];
  const TIMING = PLAN.timing as string;
  const L = (id: string) => LINES.find((l) => l.id === id)!;
  const L5 = L("L5"), L6 = L("L6"), L7 = L("L7"), L8 = L("L8"), L9 = L("L9");
  const END = PLAN.end as number;
  const FRAMES = Math.round(END * FPS);

  /** the action schedule (all derived from the line times; documented in content.md §10) */
  const BEAT = (() => {
    const walkStop = L5.end - 0.45; // body comes to rest at the stand-off while "…tidak bisa melihat gerendelnya"
    const raise0 = L6.start + 0.05; // left hand brings the phone up
    const torchOn = L6.start + 0.6; // "…menyalakan senter…": the torch click
    const s04 = L7.start - 0.7; // insert starts as the right hand leaves the phone for the bolt
    const st1 = s04 - 0.05; // two steps end (settled)
    const st0 = st1 - 1.0;
    const sw0 = torchOn + 0.35; // the sweep: knob → up past the glass → down to the bolt
    const sw1 = st0 - 0.1;
    const click = PLAN.klik ?? L7.start; // "Klik." = the bolt lands (v2: on the audible Klik, measured; v1: line start)
    const push0 = click - 0.35;
    const grab0 = s04 + 0.05;
    const grab1 = Math.min(push0 - 0.05, grab0 + 0.5);
    const back0 = L7.end - 0.4; // right palm returns over the lens
    // v3: S05 cuts in on the toa switch-on (plan toaOpen, over the tail of N03) and he jolts on it
    const opener = V.toaReact === "opener" && PLAN.toaOpen !== undefined;
    const s05 = opener ? PLAN.toaOpen! : Math.max(L7.end + 0.2, s04 + 2.0);
    const back1 = s05 - 0.05;
    const flinch = opener ? PLAN.toaOpen! + 0.08 : L8.start + 0.05; // toa: he jolts
    const torchOff = flinch + 0.1; // left thumb kills the torch on the jolt (owner, 2026-11-18)
    const turn0 = flinch + 0.25; // then turns toward the front of the house (the toa's side)
    const turn1 = turn0 + 1.0;
    const s06 = L8.end + 0.45;
    const point0 = Math.max(s06 + 0.1, L9.start - 0.35);
    return { walkStop, raise0, torchOn, s04, st0, st1, sw0, sw1, click, push0, grab0, grab1, back0, back1, s05, flinch, torchOff, turn0, turn1, s06, point0 };
  })();
  // ------------------------------------------------------------------ helpers
  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const smooth = (x: number) => {
    const u = clamp01(x);
    return u * u * (3 - 2 * u);
  };
  const ramp = (t: number, a: number, b: number) => smooth((t - a) / Math.max(1e-6, b - a));
  const mix = (a: number, b: number, u: number) => a + (b - a) * u;
  const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
  const v3 = (p: THREE.Vector3): V3 => [p.x, p.y, p.z];
  const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
  const camMix = (a: Cam, b: Cam, u: number): Cam => ({ pos: mix3(a.pos, b.pos, u), look: mix3(a.look, b.look, u), fov: mix(a.fov, b.fov, u), roll: 0 });
  const solve = (root: V3, yaw: number, side: "L" | "R", target: V3, height = C1_HEIGHT) => solveArm({ position: root, yaw, side, target, height, build: C1_BUILD });
  const handMix = (a: C1Hand, b: C1Hand, u: number): C1Hand => {
    const n = (x: V3) => {
      const l = Math.hypot(...x) || 1;
      return [x[0] / l, x[1] / l, x[2] / l] as V3;
    };
    return { dir: n(mix3(a.dir, b.dir, u)), palm: n(mix3(a.palm, b.palm, u)), curl: mix(a.curl ?? 0, b.curl ?? 0, u), w: mix(a.w ?? 1, b.w ?? 1, u) };
  };
  /** a phone box turned so its back (+z, the LED) points at `aim`; the screen (-z) faces the holder (same as v2Phone) */
  const aimQuat = (p: V3, aim: V3) => {
    const yaw = Math.atan2(aim[0] - p[0], aim[2] - p[2]);
    const pitch = Math.atan2(aim[1] - p[1], Math.hypot(aim[0] - p[0], aim[2] - p[2]));
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-pitch, 0, 0)));
  };
  const q4 = (q: THREE.Quaternion): [number, number, number, number] => [q.x, q.y, q.z, q.w];

  // ------------------------------------------------------------------ places (storyboard v0.4, look-dev v3, D-038/D-039)
  const DOOR_Z = HOUSE.z0 + 0.06;
  const STAND: V3 = [-0.95, 0, -3.8]; // stand-off (D-037)
  const BOLT_AT = (k: number): V3 => [BOLT_GRIP[0] + (1 - clamp01(k)) * 0.06, BOLT_GRIP[1] + 0.05, HOUSE.z0 + 0.044]; // the knob
  const BOLT_AIM: V3 = [BOLT_GRIP[0], BOLT_GRIP[1], DOOR_Z + 0.02];

  // ------------------------------------------------------------------ walks (cast/walk.ts: feet never slide)
  const GAIT_HALL: Gait = { height: C1_HEIGHT, stride: 0.95, phase: 0.1, swing: 10, bob: 0.006 };
  const GAIT_STEP: Gait = { height: C1_HEIGHT, stride: 0.62, phase: 0.56, swing: 0, bob: 0.004, lift: 0.025 };
  /** a walk plan that comes to rest exactly at `to` at time t1 (bisection on the cruising speed) */
  const walkTo = (g: Gait, from: V3, to: V3, t0: number, t1: number, decel: number): WalkPlan => {
    const yaw = Math.atan2(to[0] - from[0], to[2] - from[2]);
    const D = Math.hypot(to[0] - from[0], to[2] - from[2]);
    const base = (speed: number): WalkPlan => ({ t0, from, yaw, speed, tStop: t1 - 0.5, decel });
    let lo = 0.05, hi = 3;
    for (let i = 0; i < 40; i++) {
      const m = (lo + hi) / 2;
      if (walkState(g, base(m), t1 + 3).d < D) lo = m;
      else hi = m;
    }
    return base((lo + hi) / 2);
  };
  // hallway walk into the stand-off (starts before the pilot: he is already walking at t = 0)
  const WALK1 = walkTo(GAIT_HALL, [-0.95, 0, -1.55], STAND, -1.4, BEAT.walkStop, 1.1);
  // episode (V.walk1Ext = k strides): a lead-in walk on the same line that reaches WALK1's start at WALK1.t0 with the
  // same cruising speed, the same gait phase (k whole strides) and k = 1 (no stop), so the hand-over is seamless and
  // from WALK1.t0 on everything is WALK1 itself (P3 untouched; checked by the per-frame stage dump)
  const WALK0: WalkPlan | null = (() => {
    const k = V.walk1Ext ?? 0;
    if (!k) return null;
    const v = walkDistance(GAIT_HALL, WALK1, WALK1.t0 + 0.5).v;
    const D = k * GAIT_HALL.stride;
    const dir = [Math.sin(WALK1.yaw), 0, Math.cos(WALK1.yaw)];
    return { t0: WALK1.t0 - D / v, from: [WALK1.from[0] - dir[0] * D, 0, WALK1.from[2] - dir[2] * D], yaw: WALK1.yaw, speed: v };
  })();
  const STEP: V3 = [-0.93, 0, -4.52]; // after the two steps: 0.72 m in; closer than look-dev v3 so the elbows bend (owner b)
  const WALK2 = walkTo(GAIT_STEP, STAND, STEP, BEAT.st0, BEAT.st1, 0.45);

  // ------------------------------------------------------------------ arms (body-local targets → IK per frame)
  // left hand = code side "R" (phone); right hand = code side "L" (palm over the lens, the bolt)
  const FRONT_LOCAL: V3 = [0.07, 1.15, 0.2]; // phone in front of the chest, a little to the left (v2 stand-off, 2 cm closer)
  const HAND_G2 = GRIPS.g2.hand;
  const HAND_FRONT: C1Hand = { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 };
  const HAND_CUP: C1Hand = { dir: [0.15, 0.95, 0.2], palm: [0.2, 0, -1], curl: 45, w: 1 }; // palm over the LED (look-dev v3 fix)
  const HAND_BOLT: C1Hand = { dir: [0.1, 0.55, 0.83], palm: [0, -0.2, 1], curl: 70, w: 1 }; // fingers round the knob, palm to the door
  const HAND_REST: C1Hand = { dir: [0, -1, 0.05], palm: [-1, 0, 0], curl: 20, w: 0 };

  // ------------------------------------------------------------------ the sweep (D-037: knob → up past the glass → bolt)
  const AIM_KNOB: V3 = [KNOB[0], KNOB[1], DOOR_Z];
  const AIM_GLASS: V3 = [GLASS[0], GLASS[1], DOOR_Z];
  /** the beam's aim point on the door at time t, and how far up it is (0 knob … 1 glass) */
  /** sweep phase times: t1 end of the knob hold, t2 the beam reaches the glass, t3 it leaves, t4 it reaches the bolt */
  const SW = (() => {
    const a = BEAT.sw0, b = BEAT.sw1, d = b - a;
    const [h0, up, hg, dn] = V.sweep;
    const t1 = a + h0 * d, t2 = t1 + up * d, t3 = t2 + hg * d, t4 = t3 + dn * d;
    return { t1, t2, t3, t4 };
  })();
  /** the aim point on the glass, drifting east by V.glassDrift across the hold (0 in v1) */
  const glassAim = (k: number): V3 => [AIM_GLASS[0] + V.glassDrift * (k - 0.5), AIM_GLASS[1], AIM_GLASS[2]];
  const aimAt = (t: number): { aim: V3; up: number } => {
    // fractions of the sweep (V.sweep): v1 hold knob 0.15 · up 0.28 · hold glass 0.12 · down 0.25 · hold bolt 0.20;
    // v2 0.12 · 0.22 · 0.24 · 0.22 · 0.20 (owner 2026-11-18: the glass lit too briefly; same sweep length)
    const { t1, t2, t3, t4 } = SW;
    if (t < t1) return { aim: AIM_KNOB, up: 0 };
    if (t < t2) {
      const u = ramp(t, t1, t2);
      return { aim: mix3(AIM_KNOB, glassAim(0), u), up: u };
    }
    if (t < t3) return { aim: glassAim(ramp(t, t2, t3)), up: 1 };
    if (t < t4) {
      const u = ramp(t, t3, t4);
      return { aim: mix3(glassAim(1), BOLT_AIM, u), up: 1 - u };
    }
    return { aim: BOLT_AIM, up: 0 };
  };
  /** the glass is in the beam (for the adik head lift and the QC window) */
  const GLASS_WINDOW = (() => {
    const a = BEAT.sw0, d = BEAT.sw1 - BEAT.sw0;
    const [h0, up, hg, dn] = V.sweep;
    return [a + (h0 + up * 0.6) * d, a + (h0 + up + hg + dn * 0.4) * d] as [number, number];
  })();

  // ------------------------------------------------------------------ shots
  /** v2 cut points. S03 insert: from 0.2 s before the beam reaches the glass to 0.15 s after it leaves (the pool slides
   * up the door top into the glass, holds, and starts down). S06 flashback: on "tadi terang", whose onset is ESTIMATED
   * by letter count inside L9's second speech burst (same rule as the captions; not measured word timing; take01's
   * envelope dips put it ~0.14 s earlier), so it starts 0.15 s before that estimate and lasts 0.8 s, then the glass
   * now dark to the end. */
  const CUTS = (() => {
    const ins0 = SW.t2 - V.ins.lead, ins1 = SW.t3 + V.ins.tail;
    const ws = L9.text.replace(/[“”"]/g, "").split(/\s+/).filter(Boolean);
    const k0 = ws.findIndex((w) => /…$/.test(w)) + 1; // first word of the second sentence group ("kaca")
    const grp = ws.slice(k0);
    const b = L9.bursts && L9.bursts.length > 1 ? L9.bursts[1] : [L9.start, L9.end];
    const total = grp.reduce((n, w) => n + w.length + 1, 0);
    const iT = grp.findIndex((w) => /^tadi/i.test(w));
    const tadi = b[0] + ((b[1] - b[0]) * grp.slice(0, Math.max(0, iT)).reduce((n, w) => n + w.length + 1, 0)) / total;
    const fb0 = tadi - 0.15, fb1 = Math.min(fb0 + 0.8, END - 0.4);
    return { ins0, ins1, tadi, fb0, fb1 };
  })();
  const SHOTS0: Shot[] = [
    ...(V.insert
      ? [
          { id: "s03" as ShotId, start: 0, end: CUTS.ins0 },
          { id: "s03i" as ShotId, start: CUTS.ins0, end: CUTS.ins1 },
          { id: "s03" as ShotId, start: CUTS.ins1, end: BEAT.s04 },
        ]
      : [{ id: "s03" as ShotId, start: 0, end: BEAT.s04 }]),
    { id: "s04", start: BEAT.s04, end: BEAT.s05 },
    { id: "s05", start: BEAT.s05, end: BEAT.s06 },
    ...(V.flash === "fd"
      ? [
          { id: "s06" as ShotId, start: BEAT.s06, end: CUTS.fb0 },
          { id: "s06f" as ShotId, start: CUTS.fb0, end: CUTS.fb1 },
          { id: "s06d" as ShotId, start: CUTS.fb1, end: END },
        ]
      : [{ id: "s06" as ShotId, start: BEAT.s06, end: END }]),
  ];
  const q = (x: number) => (V.frameCuts && x > 0 ? Math.ceil(x * FPS - 1e-6) / FPS : x);
  const SHOTS: Shot[] = SHOTS0.map((s) => ({ ...s, start: q(s.start), end: s.end === END ? END : q(s.end) }));
  const shotAt = (t: number): ShotId => (SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1]).id;
  /** flashback: scene time replays the S03 glass hold (t2 … t3) over the flashback's length */
  // v3: the same footage as the insert, at its own speed, from flashFrom s before the beam reaches the glass
  const flashTime = (t: number) =>
    V.ins.flashFrom === "hold"
      ? SW.t2 + 0.02 + ((t - CUTS.fb0) * (SW.t3 - SW.t2 - 0.04)) / Math.max(1e-6, CUTS.fb1 - CUTS.fb0)
      : SW.t2 - V.ins.flashFrom + (t - CUTS.fb0);

  // ------------------------------------------------------------------ the state

  // --- v3 lifted steps (owner 2026-11-18, P4 failed in v1/v2). WALK1 settles at z -4.124 (not at STAND), and v1/v2
  // restarted WALK2 from STAND: a 32 cm root jump back at st0 (visible at f247) plus a 0.25 s ankle blend that slid the
  // feet 7.7–12 cm. Here the body goes from WALK1's settled stance to WALK2's settled stance (both exact, so no pop at
  // either end) in three lifted steps: foot 1 half-way, foot 2 all the way past it, foot 1 closes beside it. Only one
  // foot is ever off the floor, a planted foot does not move, and the root follows the mean progress of the two feet.
  const STEPS3 = (() => {
    const a = walkState(GAIT_HALL, WALK1, BEAT.st0 - 1e-6);
    const b = walkState(GAIT_STEP, WALK2, BEAT.st1);
    const world = (w: typeof a, f: "L" | "R"): V3 => {
      const an = w.legPose[f].ankle, c = Math.cos(w.yaw), s = Math.sin(w.yaw);
      return [w.position[0] + (an[0] * c + an[2] * s) * C1_HEIGHT, 0, w.position[2] + (-an[0] * s + an[2] * c) * C1_HEIGHT];
    };
    const T = BEAT.st0, D = BEAT.st1 - BEAT.st0;
    // the rear foot at the stand-off moves first
    const f1: "L" | "R" = a.legPose.L.ankle[2] < a.legPose.R.ankle[2] ? "L" : "R";
    const f2: "L" | "R" = f1 === "L" ? "R" : "L";
    const plan: ["L" | "R", number, number, number, number][] = [
      [f1, 0, 0.5, T + 0.03 * D, T + 0.33 * D],
      [f2, 0, 1, T + 0.36 * D, T + 0.68 * D],
      [f1, 0.5, 1, T + 0.72 * D, T + 0.98 * D],
    ];
    return { a, b, A: { L: world(a, "L"), R: world(a, "R") }, B: { L: world(b, "L"), R: world(b, "R") }, f1, f2, plan };
  })();
  /** a foot's progress 0..1 along its path and its lift (m) at time t */
  const footProg = (f: "L" | "R", t: number) => {
    let p = 0, lift = 0;
    for (const [ff, p0, p1, t0, t1] of STEPS3.plan) {
      if (ff !== f || t < t0) continue;
      const w = clamp01((t - t0) / (t1 - t0));
      p = mix(p0, p1, smooth(w));
      if (w < 1) lift = 0.035 * Math.sin(Math.PI * w);
    }
    return { p, lift };
  };
  const liftedSteps = (t: number) => {
    const { a, b, A, B } = STEPS3;
    const pL = footProg("L", t), pR = footProg("R", t);
    const k = (pL.p + pR.p) / 2;
    const root: V3 = [mix(a.position[0], b.position[0], k), 0, mix(a.position[2], b.position[2], k)];
    const yaw = a.yaw;
    const local = (f: "L" | "R", pr: { p: number; lift: number }): V3 => {
      const wx = mix(A[f][0], B[f][0], pr.p), wz = mix(A[f][2], B[f][2], pr.p);
      const dx = (wx - root[0]) / C1_HEIGHT, dz = (wz - root[2]) / C1_HEIGHT, c = Math.cos(yaw), s = Math.sin(yaw);
      return [dx * c - dz * s, 0.012 + pr.lift / C1_HEIGHT, dx * s + dz * c];
    };
    return { ...b, position: root, yaw, legPose: { L: { ankle: local("L", pL) }, R: { ankle: local("R", pR) } }, d: 0, speed: 0 };
  };

  // --- Uq
  const uqRoot = (t: number) => {
    if (WALK0 && t <= WALK1.t0 + 1e-9) return walkState(GAIT_HALL, WALK0, t); // WALK1 is at rest at exactly t0
    if (t < BEAT.st0) return walkState(GAIT_HALL, WALK1, t);
    if (V.steps === "lifted" && t < BEAT.st1) return liftedSteps(t);
    return walkState(GAIT_STEP, WALK2, t);
  };
  /** Uq's body yaw add (deg) and head yaw (deg) for the turn toward the front of the house (S05) */
  // 150° in all: the face ends at bearing -30° (south-south-west): ~25° off the S05 lens toward the front-door side,
  // ~37° off adik (south-south-east); with the head raised 18° (the toa is a loudspeaker up outside), so the cut to
  // adik (S06) does not read as the two looking at each other (owner: "bukan ke adik"). Numbers: tools/p003_check.ts
  const turnAt = (t: number) => ({ body: 110 * ramp(t, BEAT.turn0 + 0.12, BEAT.turn1), head: 40 * ramp(t, BEAT.turn0, BEAT.turn0 + 0.6) });
  const UQ_GAZE_UP = 18;
  type Q3 = [number, number, number];
  const qLerp = (a: Q3, b: Q3, u: number): Q3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
  /** the left arm carrying the phone at the side while walking: a hanging, slightly bent arm in the forward plane.
   * (The look-dev v3 still-a IK grip put the forearm 5.3 cm inside the tee; this pose: 0.2 cm, tools/p003_check.ts) */
  const SIDE_Q: Q3 = [12, 35, 75];
  const frontTarget = (t: number): V3 => {
    const up = t < BEAT.st0 ? aimAt(t).up : 0;
    // during the two steps the phone drops 15 cm (it then lights the bolt from below and stays out of the S04 insert's
    // line to the knob; look-dev v3 / first pilot stills: at chest height it hid the right hand from the west camera)
    return [FRONT_LOCAL[0], FRONT_LOCAL[1] + 0.05 * up - 0.15 * ramp(t, BEAT.st0, BEAT.st1), FRONT_LOCAL[2]];
  };
  const ikQ = (side: "L" | "R", target: V3): Q3 => {
    const q = solve([0, 0, 0], 0, side, target);
    return [q.arm[0], q.arm[1], q.fwd];
  };
  /** left arm (code "R"): side carry → (angle-space ease, checked outside the torso) → IK in front of the chest */
  const leftArmAt = (t: number): { q: Q3; hand: C1Hand } => {
    const hand = handMix(HAND_G2, HAND_FRONT, ramp(t, BEAT.raise0 + 0.1, BEAT.torchOn));
    if (t < BEAT.raise0) return { q: SIDE_Q, hand };
    if (t < BEAT.torchOn) return { q: qLerp(SIDE_Q, ikQ("R", frontTarget(BEAT.torchOn)), ramp(t, BEAT.raise0, BEAT.torchOn)), hand };
    return { q: ikQ("R", frontTarget(t)), hand };
  };
  /** body (root, yaw, walk state) */
  const bodyAt = (t: number) => {
    const w = uqRoot(t);
    return { w, root: w.position as V3, yaw: NORTH + turnAt(t).body * D2R };
  };
  /** the phone in the left hand: hand-attached (g2) while carried; after the raise its back points along the beam, at
   * the palm; after the torch goes off it stays where it was in the hand (attached to the hand frame) */
  const phoneRaw = (t: number) => {
    const { root, yaw } = bodyAt(t);
    const la = leftArmAt(t);
    const poseArmR = { armR: [la.q[0], la.q[1]] as [number, number], armRFwd: la.q[2] };
    const hf = handFrame(poseArmR, "R", la.hand, root, yaw);
    const g2 = gripPhone(poseArmR, "R", { ...GRIPS.g2, hand: la.hand }, root, yaw);
    const palmW = armChain(poseArmR, "R", LAY).H.multiplyScalar(C1_HEIGHT).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
    const fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const pFront = palmW.clone().addScaledVector(fwd, 0.03).add(new THREE.Vector3(0, 0.02, 0));
    const u = ramp(t, BEAT.raise0 + 0.1, BEAT.torchOn - 0.05);
    const p = g2.p.clone().lerp(pFront, u);
    const aim: V3 = t < BEAT.sw0 ? AIM_KNOB : t >= BEAT.st0 ? BOLT_AIM : aimAt(t).aim;
    const q = g2.q.clone().slerp(aimQuat(v3(p), aim), u);
    return { p, q, hf, aim, poseArmR, la };
  };
  const phoneAt = (t: number) => {
    const r = phoneRaw(t);
    if (t < BEAT.torchOff) return r;
    const ref = phoneRaw(BEAT.torchOff - 1e-3);
    const inv0 = ref.hf.q.clone().invert();
    const qLocal = inv0.clone().multiply(ref.q);
    const pLocal = ref.p.clone().sub(ref.hf.origin).applyQuaternion(inv0);
    return { ...r, q: r.hf.q.clone().multiply(qLocal), p: pLocal.applyQuaternion(r.hf.q).add(r.hf.origin) };
  };
  /** right arm (code "L"): walk swing → over the lens (angle-space ease into the IK) → the bolt knob (S04) → back */
  const cupTarget = (t: number): V3 => {
    const { root, yaw } = bodyAt(t);
    const p = phoneAt(t).p;
    const l = new THREE.Vector3(p.x - root[0], p.y - root[1], p.z - root[2]).applyAxisAngle(UP, -yaw);
    return [l.x - 0.01, l.y + 0.03, l.z + 0.035];
  };
  const CUP0 = BEAT.raise0 + 0.1;
  const CUP1 = BEAT.torchOn + 0.2;
  const rightArmAt = (t: number, w: ReturnType<typeof walkState>): { q: Q3; hand: C1Hand } => {
    const walkQ: Q3 = [w.pose.armL[0], w.pose.armL[1], w.pose.armLFwd];
    if (t < CUP0) return { q: walkQ, hand: HAND_REST };
    const hand0 = handMix(HAND_REST, HAND_CUP, ramp(t, CUP0 + 0.3, CUP1));
    if (t < CUP1) return { q: qLerp(walkQ, ikQ("L", cupTarget(CUP1)), ramp(t, CUP0, CUP1)), hand: hand0 };
    const g = ramp(t, BEAT.grab0, BEAT.grab1) * (1 - ramp(t, BEAT.back0, BEAT.back1));
    if (g <= 0) return { q: ikQ("L", cupTarget(t)), hand: hand0 };
    const { root, yaw } = bodyAt(t);
    const kb = BOLT_AT(ramp(t, BEAT.push0, BEAT.click));
    const kl = new THREE.Vector3(kb[0] - root[0], kb[1] - root[1], kb[2] - root[2]).applyAxisAngle(UP, -yaw);
    const knobLocal: V3 = [kl.x, kl.y - 0.01, kl.z - 0.03]; // palm centre just in front of the knob
    return { q: ikQ("L", mix3(cupTarget(t), knobLocal, g)), hand: handMix(HAND_CUP, HAND_BOLT, g) };
  };

  /** eyes a little further toward the front door (C1Face.look; sign checked on a still) */
  const EYE_LOOK = 0.8;
  /** a blink seed with no blink while the S05 reaction face is on screen (Character3D.blinkAt: deterministic) */
  const UQ_BLINK = (() => {
    const blinkAt = (t: number, seed: number) => {
      const x = t + seed * 1.37, P = 3.9, k = Math.floor(x / P), ph = x - k * P;
      const on = (u: number) => u >= 0 && u < 0.1;
      return on(ph - 1.2) || ((k * 7919 + seed * 31) % 100 < 18 && on(ph - 1.42));
    };
    for (let s = 5; s < 60; s++) {
      let ok = true;
      for (let t = BEAT.turn0; t < BEAT.s06; t += 1 / 60) if (blinkAt(t, s)) ok = false;
      if (ok) return s;
    }
    return 5;
  })();

  const uqAt = (t: number) => {
    const { w, root, yaw } = bodyAt(t);
    const turn = turnAt(t);
    const up = t < BEAT.st0 ? aimAt(t).up : 0;
    // legs: from the first walk's settle into the second walk's start, blended over 0.25 s (no foot pop)
    let legPose = w.legPose;
    if (V.steps === "gait" && t >= BEAT.st0 && t < BEAT.st0 + 0.25) {
      const a = walkState(GAIT_HALL, WALK1, BEAT.st0).legPose;
      const u = ramp(t, BEAT.st0, BEAT.st0 + 0.25);
      legPose = { L: { ankle: mix3(a.L.ankle, w.legPose.L.ankle, u) }, R: { ankle: mix3(a.R.ankle, w.legPose.R.ankle, u) } };
    }
    const ph = phoneAt(t);
    const ra = rightArmAt(t, w);
    const fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    // flinch on the toa: a quick shrug and a small head jerk, settling
    const fl = ramp(t, BEAT.flinch, BEAT.flinch + 0.12) * (1 - 0.5 * ramp(t, BEAT.flinch + 0.3, BEAT.flinch + 0.9));
    const torchOnK = t >= BEAT.torchOn && t < BEAT.torchOff ? 1 : 0;
    const face: C1Face = t >= BEAT.flinch
      ? { eyes: "open", brows: "raised", mouth: t >= BEAT.turn0 + 0.55 ? "open" : "flat", look: EYE_LOOK * ramp(t, BEAT.turn0 + 0.3, BEAT.turn1) }
      : { eyes: "open", brows: "worried", mouth: "flat" };
    // head: walking nod → looks at the knob (down) / follows the beam up → down at the bolt → jolt, then turns
    // C1 headNod: + = DOWN, - = UP (Rx tilts +z down; Ep 1 uses -14 for adik looking up)
    const look = 6 * (1 - up) * ramp(t, BEAT.torchOn, BEAT.sw0) - 9 * up + 4 * ramp(t, BEAT.st0, BEAT.st1);
    const char: CharS = {
      who: "uq", root, yaw, height: C1_HEIGHT, legPose: t >= BEAT.turn0 ? undefined : legPose, face, blinkSeed: UQ_BLINK,
      pose: {
        armL: [ra.q[0], ra.q[1]], armLFwd: ra.q[2], ...ph.poseArmR,
        twist: w.pose.twist * (t < BEAT.raise0 ? 1 : 0), roll: w.pose.roll * (t < BEAT.raise0 ? 1 : 0),
        headYaw: (t < BEAT.raise0 ? w.pose.headYaw : 0) + turn.head,
        headNod: (t < BEAT.raise0 ? w.pose.headNod : 0) + look - 6 * fl - (UQ_GAZE_UP + 4) * ramp(t, BEAT.turn0, BEAT.turn1),
        shrugL: 0.012 * fl, shrugR: 0.012 * fl,
      },
      hands: { L: ra.hand, R: ph.la.hand },
    };
    const leakAt = ph.p.clone().addScaledVector(fwd, 0.02).add(new THREE.Vector3(0, 0.05, 0));
    return {
      char,
      phone: { p: v3(ph.p), q: q4(ph.q) },
      torch: torchOnK ? { on: 1, from: v3(ph.p), aim: ph.aim, leak: 0.35, leakAt: v3(leakAt) } : null,
      bolt: ramp(t, BEAT.push0, BEAT.click),
    };
  };

  // --- adik (east side of the hallway mouth, D-039 S03 (i)). Storyboard v0.5 S02/S03: her RIGHT hand (code "L") holds
  // the EAST jamb the whole pilot (the jacket stays over that forearm); in S06 she points at the glass with her LEFT hand
  // (code "R"). Pilot v1 (owner 2026-11-18): 12 cm further west than look-dev v3 (x -0.5) and the hand at waist
  // height: the jacket over that forearm hangs along the forearm's slope (npc.tsx JacketOnArm), so a higher grip
  // (0.74–0.86 m) swung its tip 2.6–7.4 cm into the hallway's east wall (tools: out/jamb_probe.ts); this grip: +0.2 cm.
  const ADIK_AT: V3 = [-0.62, 0, -0.95];
  /** her right palm on the jamb: the west face of the living-room wall end at x -0.2 (z -1.06…-0.94) */
  const JAMB_HOLD: V3 = [-0.235, 0.66, -0.97];
  const ADIK_EYE: V3 = [ADIK_AT[0], 1.1, ADIK_AT[2]];
  /** what she points at: the glass */
  const POINT_AT: V3 = [GLASS[0], GLASS[1], GLASS[2] + 0.04];
  /** S06 lens (pilot v1): in the living room, WEST of the Uq–adik line, behind-left of adik, facing north up the
   * hallway. The hallway opening limits how far west it can go and still see the glass (x ≥ ~-1.5 at z 1.2). */
  const S06_LENS: V3 = [-1.45, 1.05, 1.2];
  /** Seen from any lens that also sees the glass, an honest point runs within ~25–30° of the lens axis and reads as a
   * stub. Camera cheat (film practice): the arm direction stays in the plane (lens, shoulder, glass), so on screen its
   * line still runs through the glass, but part of the depth component is taken out (POINT_CHEAT of it), which
   * lengthens the arm on screen. In 3D it then points a little above/left of the glass; only this lens sees it. */
  const POINT_CHEAT = 0.5;
  /** head turn toward the glass (deg): C1 headNod + = down, - = up; headYaw sign: + = toward her own left (checked by
   * tools/p003_check.ts, which reports the gaze → glass angle) */
  const toGlass = (() => {
    const d = new THREE.Vector3(POINT_AT[0] - ADIK_EYE[0], POINT_AT[1] - ADIK_EYE[1], POINT_AT[2] - ADIK_EYE[2]);
    const elev = (Math.asin(d.clone().normalize().y) * 180) / Math.PI;
    const yawOff = (Math.atan2(d.x, d.z) - NORTH) * (180 / Math.PI);
    const wrap = ((yawOff + 540) % 360) - 180;
    return { elev, yaw: wrap };
  })();
  const ADIK_GAZE = toGlass;
  const jambQ = solve(ADIK_AT, NORTH, "L", JAMB_HOLD, ADIK_HEIGHT);
  /** shoulder → elbow → hand length of adik's arm (m) */
  const ADIK_ARM_LEN = (() => {
    const { S, E, H } = armChain({ armR: [0, 0], armRFwd: 0 }, "R", LAY);
    return (E.distanceTo(S) + H.distanceTo(E)) * ADIK_HEIGHT;
  })();
  const adikAt = (t: number): CharS => {
    const root = ADIK_AT;
    const inGlass = ramp(t, GLASS_WINDOW[0] - 0.2, GLASS_WINDOW[0] + 0.2) * (1 - ramp(t, GLASS_WINDOW[1], GLASS_WINDOW[1] + 0.6));
    const pt = ramp(t, BEAT.point0, BEAT.point0 + 0.55);
    let pose: CharS["pose"] = { ...ADIK_REST, armL: jambQ.arm, armLFwd: jambQ.fwd, headNod: -8 * inGlass }; // looks up (- = up)
    if (pt > 0) {
      // the left arm (code side "R") along shoulder → glass; a small push along the same line on "kaca" (the oval hand
      // has no index finger, so the arm line, the push, the head and the glass at the end of the line carry the point)
      const sh = armChain({ armR: ADIK_REST.armR, armRFwd: 0 }, "R", LAY).S.multiplyScalar(ADIK_HEIGHT).applyAxisAngle(UP, NORTH).add(new THREE.Vector3(...root));
      const honest = new THREE.Vector3(...POINT_AT).sub(sh).normalize();
      const view = sh.clone().sub(new THREE.Vector3(...S06_LENS)).normalize();
      const dir = honest.clone().addScaledVector(view, -POINT_CHEAT * honest.dot(view)).normalize();
      const kaca = L9.bursts && L9.bursts.length > 1 ? L9.bursts[1][0] : L9.start + 0.9;
      // reach as a fraction of her arm length: 0.975 (elbow ~155°, a straight pointing arm; at 0.37 m the first render
      // bent the elbow to ~120° and it read as a raised hand) → 0.998 on "kaca" (a small push), settling at 0.985
      const jab = 0.023 * ramp(t, kaca - 0.12, kaca + 0.08) - 0.013 * ramp(t, kaca + 0.25, kaca + 0.6);
      const point = v3(sh.clone().addScaledVector(dir, ADIK_ARM_LEN * (0.975 + jab)));
      // the raise is eased in ANGLE space from the rest pose to the IK solution of the full point (IK on a straight
      // rest → point path switched branch on its first frame: 46.6°/frame and 3 cm into the torso, p003_check); IK only
      // once the arm is up (STUDIO-WORKFLOW §8.2 no. 3)
      const end = solve(root, NORTH, "R", v3(sh.clone().addScaledVector(dir, ADIK_ARM_LEN * 0.975)), ADIK_HEIGHT);
      let q = { arm: end.arm, fwd: end.fwd };
      if (pt < 1) {
        const r0 = ADIK_REST.armR ?? [10, -4], w0 = ADIK_REST.armRFwd ?? 0;
        q = { arm: [mix(r0[0], end.arm[0], pt), mix(r0[1], end.arm[1], pt)], fwd: mix(w0, end.fwd, pt) };
      } else {
        const s = solve(root, NORTH, "R", point, ADIK_HEIGHT);
        q = { arm: s.arm, fwd: s.fwd };
      }
      pose = { ...pose, armR: q.arm as [number, number], armRFwd: q.fwd, headNod: -toGlass.elev * pt + -8 * inGlass * (1 - pt), headYaw: toGlass.yaw * pt };
    }
    const talking = t >= L9.start && t < L9.end && (t * 2) % 1 < 0.6; // ≤ 2 Hz (inkbeat: no strobing)
    return {
      who: "adik", root, yaw: NORTH, height: ADIK_HEIGHT, pose,
      face: { eyes: "open", brows: pt > 0 || inGlass > 0.5 ? "raised" : "worried", mouth: talking ? "open" : "soft" },
    };
  };

  // ------------------------------------------------------------------ cameras (all WEST of the Uq–adik line, D-038)
  const CAM = {
    // S03 (i) lens 40° (look-dev v3), a slow 0.25 m dolly in
    // pilot v1: panned 4.2° east (look x -1.4 → -0.85) so adik's right hand on the east jamb (storyboard v0.5) is in
    // the frame; position, lens and dolly unchanged (look-dev v3 framing had the hand ~170 px outside the right edge)
    s03a: cam([-1.1, 1.95, 2.85], [-0.85, 1.45, -4.6], 40),
    s03b: cam([-1.08, 1.93, 2.6], [-0.85, 1.45, -4.6], 40),
    // S04 insert (exempt from 2.2 m), west of the bolt, after the two steps
    // (moved after the first stills: from (-1.72, 1.24, -4.3) Uq's head filled a third of the frame and the phone hid the
    // knob) — now near the door plane at the counter's east end, looking east along the door at the knob
    s04: cam([-1.6, 1.3, -4.75], [-0.93, 1.13, -4.93], 46),
    // S05: from the hallway (≥ 2.2 m), long lens on Uq's head and chest; he turns toward this side (the front of the house)
    s05a: cam([-1.12, 1.42, -2.0], [-0.92, 1.3, -4.52], 20),
    s05b: cam([-1.12, 1.42, -2.1], [-0.92, 1.3, -4.52], 19),
    // S06 pilot v1 (owner 2026-11-18: "kaca terlihat di bingkai"): from the living room, WEST of the Uq–adik line,
    // behind-left of adik, facing north up the hallway: adik 3/4 from behind (left profile), her pointing arm, and the
    // glass over the back door at the end of the line. Replaces the D-038 kitchen camera facing south (glass behind it).
    s06a: cam(S06_LENS, [-0.6, 1.25, -2.6], 46),
    s06b: cam([S06_LENS[0] + 0.02, S06_LENS[1], S06_LENS[2] - 0.12], [-0.6, 1.26, -2.6], 45),
    // v2 INSERT on the vent glass (s03i, and the S06 flashback s06f / now-dark s06d from the same lens): behind-left of
    // Uq at the stand-off, WEST of the Uq–adik line, looking up north-north-east at the glass, the door top and its frame
    // below it, so the warm pool is seen sliding up the wood into the glass (= the torch from inside). Inserts are
    // exempt from the 2.2 m rule (as S04); the lens is 1.8 m from the glass. Numbers: tools/p003_check.ts --v2.
    ins: cam(V.ins.lens, V.ins.look, V.ins.fov),
  };

  /** the stage for one shot at scene time ts. Camera moves run over the whole shot span (S03 is cut by the insert in
   * v2, the dolly continues underneath; S06 likewise), so v1 is unchanged. */
  const stageShot = (ts: number, shot: ShotId): Omit<Stage, "t" | "ts" | "shot"> => {
    const uq = uqAt(ts);
    const adik = adikAt(ts);
    let c: Cam, focus: V3, chars: CharS[], charK = 1, rimK = 1;
    if (shot === "s03") {
      c = camMix(CAM.s03a, CAM.s03b, smooth(clamp01(ts / BEAT.s04)));
      focus = [-0.95, 1.4, -3.9];
      chars = [uq.char, adik];
    } else if (shot === "s04") {
      c = CAM.s04;
      focus = [-0.95, 1.12, -4.86];
      chars = [uq.char];
    } else if (shot === "s05") {
      c = camMix(CAM.s05a, CAM.s05b, smooth(clamp01((ts - BEAT.s05) / (BEAT.s06 - BEAT.s05))));
      focus = [-0.92, 1.3, -4.52];
      chars = [uq.char];
      charK = 0.55; // the face is lit by the cold light coming down the hallway from the living room, not by a key
      rimK = 0; // the character rim sat between his head and the door and kept the door warm after the torch went off
    } else if (shot === "s06") {
      c = camMix(CAM.s06a, CAM.s06b, smooth(clamp01((ts - BEAT.s06) / (END - BEAT.s06))));
      focus = [ADIK_AT[0], 1.0, ADIK_AT[2]];
      chars = [adik, uq.char];
      // the character fills sat 0.4 m from the living-room wall end next to adik and burned it white (first S06 still),
      // and Uq's rim kept the back door warm after the torch went off (as in S05): low fills, no rim
      charK = 0.35;
      rimK = 0;
    } else {
      // s03i / s06f / s06d: the glass insert. No character rim and low fills, so the only warm light on the door and
      // the glass is the torch (checked: a torch-off still of the same frame, content.md §11)
      c = CAM.ins;
      focus = V.ins.look;
      chars = [uq.char, adik];
      charK = 0.35;
      rimK = 0;
    }
    return { cam: c, focus, chars, phone: uq.phone, torch: uq.torch, bolt: uq.bolt, charK, rimK };
  };
  const stageAt = (t: number): Stage => {
    const shot = shotAt(t);
    const ts = shot === "s06f" ? flashTime(t) : t;
    return { t, ts, shot, ...stageShot(ts, shot) };
  };

  return {
    PLAN, V, LINES, TIMING, END, FRAMES, BEAT, SW, CUTS, SHOTS, WALK0, WALK1, GAIT_HALL, shotAt, flashTime, aimAt, GLASS_WINDOW, uqAt, adikAt, stageShot, stageAt,
    STAND, STEP, UQ_GAZE_UP, EYE_LOOK, ADIK_AT, JAMB_HOLD, POINT_AT, S06_LENS, POINT_CHEAT, ADIK_GAZE, ADIK_ARM_LEN, CAM,
  };
};
export type Pilot003Build = ReturnType<typeof buildPilot003>;

/** pilot v1 (rendered 2026-11-18; pilot003-plan.json, V1): the names the composition and the tools import */
export const P1 = buildPilot003(PLAN_V1 as PlanJson, V1);
export const { LINES, TIMING, END, FRAMES, BEAT, SHOTS, shotAt, aimAt, GLASS_WINDOW, uqAt, adikAt, stageAt, STAND, STEP, UQ_GAZE_UP, EYE_LOOK, ADIK_AT, JAMB_HOLD, POINT_AT, S06_LENS, POINT_CHEAT, ADIK_GAZE, ADIK_ARM_LEN } = P1;
