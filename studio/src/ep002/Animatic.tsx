// Episode 2026-11-002 "Peringatan dengan Suaramu Sendiri" — ANIMATIC of the whole story, A01–A17 (D-027).
// Text, line timing (audio v2), scene cuts and shots live in plan-2026-11-002.json (built by
// scripts/ep002_animatic_prep.py); this file stages them. Every frame is a pure function of the frame number.
// Audio is muxed after the picture render (finish_render.mjs + the animatic mix); nothing here plays sound.
// One world: the house interior (sets.tsx HouseInterior) and the street (StreetSet) share geo.ts coordinates.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { C1, C1_BUILD, C1_HEIGHT, c1SeatedRoot, stickHeadCenter } from "../c1/C1";
import type { C1Face, C1Props } from "../c1/C1";
import { IbuGendong } from "../cast/carry";
import { ADIK, ANAK_WARGA, BAPAK, BALITA, IBU, Npc, WARGA_3, WARGA_4, WARGA_5 } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";
import { Walker } from "../cast/Walker";
import type { Gait, WalkPlan } from "../cast/walk";
import { walkState } from "../cast/walk";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { handWorld, solveArm } from "../inkbeat/core/ik";
import { boxG, coreMat, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import type { MoodPreset } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { KAMAR, TAMU } from "./geo";
import { Cards, PhoneUI, Subtitles } from "./overlay";
import PLAN from "./plan-2026-11-002.json";
import { HouseInterior, plateWorld, StreetSet, toaHornWorld } from "./sets";
export { WalkTest } from "./WalkTest";

export const EP002_FPS = 30;
export const EP002_FRAMES = PLAN.frames;
const E = Math.PI / 2; // yaw: facing east (+x)
const W_ = -Math.PI / 2; // facing west
const S_ = 0; // facing south (+z)
const N_ = Math.PI; // facing north

// ------------------------------------------------------------------ time helpers
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const cam = (pos: V3, look: V3, fov = 40): Cam => ({ pos, look, fov, roll: 0 });
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({ pos: lerp3(a.pos, b.pos, u), look: lerp3(a.look, b.look, u), fov: lerp(a.fov, b.fov, u), roll: 0 });
const L = (id: string) => PLAN.lines.find((l) => l.id === id)!;

// ------------------------------------------------------------------ C1 helpers
const H1 = C1_HEIGHT;
/** a C1 hand target pose by IK (side "L" = C1's own right) */
const reach = (root: V3, yaw: number, side: "L" | "R", target: V3, height = H1) => {
  const ik = solveArm({ position: root, yaw, side, target, height, build: C1_BUILD });
  return side === "L" ? { armL: ik.arm, armLFwd: ik.fwd } : { armR: ik.arm, armRFwd: ik.fwd };
};
const headAt = (root: V3, height = H1, look?: NpcPreset) => stickHeadCenter(root, height, look ? undefined : undefined);

// ------------------------------------------------------------------ the bed (A02–A04): C1 lies head-west, sits up facing east
const BED_SEAT: V3 = [3.3, KAMAR.bed.top, (KAMAR.bed.z0 + KAMAR.bed.z1) / 2];
const flatLegs = (s: 1 | -1) => ({ ankle: [s * 0.05, 0.411, 0.38] as V3, knee: [s * 0.05, 0.47, 0.19] as V3 });
const BedC1: React.FC<{ t: number; up: number; face: C1Face; headYaw?: number }> = ({ t, up, face, headYaw = 0 }) => {
  // lying: the upper body leans back 80°, raised a little so the back rests on the mattress
  const seat: V3 = [BED_SEAT[0], BED_SEAT[1] + 0.05 * (1 - up), BED_SEAT[2]];
  const root = c1SeatedRoot(seat);
  return (
    <group>
      <C1 position={root} yaw={E} t={t} legPose={{ L: flatLegs(-1), R: flatLegs(1) }} face={face} pose={{ lean: -80 * (1 - up), armL: [8, 6], armR: [8, 6], headYaw, headNod: 10 * (1 - up) }} />
      {/* the blanket over the legs (stays when C1 sits up) */}
      <M g={boxG(0.72, 0.07, 0.62)} c="#5d6f9a" tex="fabric" p={[BED_SEAT[0] + 0.36, KAMAR.bed.top + 0.07, BED_SEAT[2]]} />
    </group>
  );
};

// ------------------------------------------------------------------ the phone (A07)
const Phone: React.FC<{ p: V3; q?: THREE.Euler; glow: number }> = ({ p, q, glow }) => (
  <group position={p} rotation={q}>
    <M g={boxG(0.075, 0.155, 0.009)} c="#1c1b22" />
    <mesh position={[0, 0, 0.0052]} geometry={boxG(0.066, 0.142, 0.001)} material={coreMat("#cfe0ff", 0.3 + 1.1 * glow)} />
    {glow > 0 ? <pointLight position={[0, 0, 0.12]} intensity={0.9 * glow} distance={0.9} decay={2} color="#cfe0ff" /> : null}
  </group>
);

// ------------------------------------------------------------------ villagers (walk plans in world time, D-027)
type W = { key: string; preset?: NpcPreset; carry?: boolean; gait: Gait; plan: WalkPlan; look?: number; lookDeg?: number };
const G = (p: NpcPreset, stride: number, phase: number, extra: Partial<Gait> = {}): Gait => ({ height: p.height, stride, phase, ...extra });
/** A05: they step out of their doors onto the street and walk east toward the toa */
const WARGA_A05: W[] = [
  { key: "w1", preset: BAPAK, gait: G(BAPAK, 1.1, 0.2), plan: { t0: 16.6, from: [-1.2, 0, 8.6], yaw: E, speed: 0.8 } },
  { key: "w2", carry: true, gait: G(IBU, 0.92, 0.63, { bob: 0.005, swing: 10 }), plan: { t0: 17.4, from: [0.4, 0, 8.9], yaw: E, speed: 0.62 } },
  { key: "w6", preset: ANAK_WARGA, gait: G(ANAK_WARGA, 0.78, 0.44, { lift: 0.04, swing: 18 }), plan: { t0: 17.8, from: [-0.5, 0, 9.4], yaw: E, speed: 0.66 } },
  { key: "w3", preset: WARGA_3, gait: G(WARGA_3, 1.08, 0.9), plan: { t0: 16.2, from: [-2.8, 0, 6.6], yaw: E, speed: 0.85 } },
  { key: "w4", preset: WARGA_4, gait: G(WARGA_4, 0.95, 0.35), plan: { t0: 16.9, from: [3.4, 0, 6.9], yaw: E, speed: 0.72 } },
  { key: "w5", preset: WARGA_5, gait: G(WARGA_5, 1.0, 0.71), plan: { t0: 16.0, from: [-4.6, 0, 7.4], yaw: E, speed: 0.78 } },
];
/** A13–A14: still walking east past house 7; they slow down and stop (L28), then turn their heads one by one toward
 * the house (L29, +0.4 s apart). Continuous across A13b → A14. */
const L29 = L("L29");
const WARGA_A14: W[] = [
  { key: "w1", preset: BAPAK, gait: G(BAPAK, 1.1, 0.2), plan: { t0: 62.0, from: [-12.0, 0, 7.2], yaw: E, speed: 0.78, tStop: 76.2, decel: 1.6 }, look: L29.start + 0.0, lookDeg: 72 },
  { key: "w2", carry: true, gait: G(IBU, 0.92, 0.63, { bob: 0.005, swing: 10 }), plan: { t0: 62.0, from: [-9.4, 0, 8.3], yaw: E, speed: 0.6, tStop: 76.8, decel: 1.8 }, look: L29.start + 0.4, lookDeg: 70 },
  { key: "w6", preset: ANAK_WARGA, gait: G(ANAK_WARGA, 0.78, 0.44, { lift: 0.04, swing: 18 }), plan: { t0: 62.0, from: [-9.9, 0, 9.1], yaw: E, speed: 0.62, tStop: 77.0, decel: 1.4 }, look: L29.start + 0.8, lookDeg: 66 },
  { key: "w3", preset: WARGA_3, gait: G(WARGA_3, 1.08, 0.9), plan: { t0: 62.0, from: [-11.0, 0, 6.3], yaw: E, speed: 0.82, tStop: 75.6, decel: 1.5 }, look: L29.start + 1.2, lookDeg: 75 },
  { key: "w4", preset: WARGA_4, gait: G(WARGA_4, 0.95, 0.35), plan: { t0: 62.0, from: [-13.8, 0, 7.9], yaw: E, speed: 0.86, tStop: 76.5, decel: 1.6 }, look: L29.start + 1.6, lookDeg: 70 },
  { key: "w5", preset: WARGA_5, gait: G(WARGA_5, 1.0, 0.71), plan: { t0: 62.0, from: [-12.6, 0, 9.4], yaw: E, speed: 0.74, tStop: 77.3, decel: 1.7 }, look: L29.start + 2.0, lookDeg: 68 },
];
const Warga: React.FC<{ list: W[]; t: number }> = ({ list, t }) => (
  <>
    {list.map((w) => (
      <Walker key={w.key} preset={w.preset} carry={w.carry} gait={w.gait} plan={w.plan} t={t} look={w.look !== undefined ? { t0: w.look, deg: w.lookDeg ?? 70, dur: 0.75 } : undefined} face={{ mouth: "flat", eyes: "open" }} />
    ))}
  </>
);

// ------------------------------------------------------------------ the living room: C1 and adik
const ADIK_DOOR: V3 = [TAMU.frontDoor.x + 0.12, 0, 2.5]; // at the front door, facing it (south)
const A08 = { t0: PLAN.cutA07A08, grab: 41.75, pull0: 42.0, pull1: 43.05 };
/** A08: C1 walks in from the right, takes adik's upper arm and pulls her back from the door (both step back north-east) */
const pullState = (t: number) => {
  const k = ramp(t, A08.pull0, A08.pull1);
  const adik = lerp3(ADIK_DOOR, [-2.05, 0, 1.75], k);
  const adikYaw = lerp(S_, 0.6 + E * 0.3, ramp(t, A08.pull0, A08.pull0 + 0.5));
  const c1 = lerp3(lerp3([0.2, 0, 1.6], [-1.9, 0, 2.05], ramp(t, A08.t0, A08.grab)), [-1.45, 0, 1.45], k);
  const c1Yaw = lerp(W_ + 0.3, W_ + 0.9, k);
  return { adik, adikYaw, c1, c1Yaw, k };
};
/** standing positions after the pull (A09–A13a, A15, A17): both facing the front window (south / screen left) */
const C1_ROOM: V3 = [-1.5, 0, 1.35];
/** "looking at the front window": south-east, so the faces read 3/4 to the west-facing cameras (screen left = street) */
const FACE_WIN = 0.55;
/** lying on the bed, the head turned toward the camera on the south side */
const HEAD_TO_CAM = -40;
const ADIK_ROOM: V3 = [-1.78, 0, 1.98];

/** a small shuffle (blocking) while a character is moved by a lerp: feet alternate with a short lift */
const shuffle = (t: number, k: number, height: number): C1Props["legPose"] => {
  if (k <= 0 || k >= 1) return undefined;
  const ph = t * 3.2;
  const l = Math.max(0, Math.sin(ph * Math.PI)) * 0.03;
  const r = Math.max(0, -Math.sin(ph * Math.PI)) * 0.03;
  void height;
  return { L: { ankle: [-0.05, 0.012 + l, 0.004 + l * 0.6] }, R: { ankle: [0.05, 0.012 + r, 0.004 + r * 0.6] } };
};

// ------------------------------------------------------------------ shots
type Shot = { id: string; scene: string; start: number; end: number };
const SHOTS = PLAN.shots as Shot[];
type Staged = { cam: Cam; mood: MoodPreset; ext: boolean; int: boolean; tamuLamp: number; body: React.ReactNode; light: V3; blur?: number; ui?: React.ReactNode; house7?: "full" | "none"; sky?: boolean; doors?: number };

const NIGHT = moodOf("night");
const LAMP = moodOf("lamp");

const stage = (s: Shot, t: number): Staged => {
  const u = clamp01((t - s.start) / (s.end - s.start));
  const lightOff = PLAN.beats.lightOff;
  const lit = t < lightOff ? 1 : 0;
  switch (s.id) {
    // A01 — wide high angle across the street, push in toward the bedroom window; the toa clicks on at the end
    case "a01": {
      const a = cam([-14, 9, 13], [6, 1.5, 3.5], 50);
      const b = cam([-3.2, 4.4, 10.5], [2.6, 1.35, 3.0], 40);
      return { cam: camLerp(a, b, ease(u)), mood: NIGHT, ext: true, int: false, tamuLamp: 0, body: null, light: [2.6, 1.5, 3], sky: true };
    }
    // A02 — C1 asleep; the announcement; eyes open
    case "a02": {
      const open = t > L("L2").start + 0.35;
      return {
        cam: cam([2.85, 1.32, 1.05], [2.62, 0.64, -0.47], 40),
        mood: NIGHT, ext: false, int: true, tamuLamp: 0,
        body: <BedC1 t={t} up={0} face={{ eyes: open ? "open" : "closed", mouth: "flat" }} headYaw={HEAD_TO_CAM} />,
        light: [2.4, 0.7, -0.47], blur: 1.2,
      };
    }
    // A03 — sits up abruptly
    case "a03": {
      const up = ramp(t, s.start + 0.12, s.start + 0.5);
      return {
        cam: camLerp(cam([3.2, 1.0, 2.05], [3.0, 0.72, -0.47], 50), cam([3.2, 1.1, 2.05], [3.0, 0.92, -0.47], 50), up),
        mood: NIGHT, ext: false, int: true, tamuLamp: 0,
        body: <BedC1 t={t} up={up} face={{ eyes: "open", mouth: "flat", brows: "raised" }} />,
        light: [3.2, 1.1, -0.47], blur: 1.0,
      };
    }
    // A04 — freezes, looking toward the window (screen left); the toa repeats L2 quietly under L5 (audio)
    case "a04": {
      const worried = t > L("L5").start + 0.6;
      const look = -42 * ramp(t, s.start, s.start + 0.5);
      const c0 = cam([3.95, 1.18, 0.35], [3.3, 1.22, -0.47], 30);
      const c1 = cam([3.82, 1.2, 0.2], [3.3, 1.23, -0.47], 28);
      return {
        cam: camLerp(c0, c1, u),
        mood: NIGHT, ext: false, int: true, tamuLamp: 0,
        body: <BedC1 t={t} up={1} face={{ eyes: "open", mouth: worried ? "open" : "flat", brows: worried ? "worried" : "raised", look: -0.8 }} headYaw={look} />,
        light: [3.3, 1.25, -0.47], blur: 1.6,
      };
    }
    // A05 — at the window; the villagers come out and walk east toward the toa
    case "a05a": {
      const c1Root: V3 = [KAMAR.window.x - 0.14, 0, 2.6];
      return {
        cam: cam([KAMAR.window.x + 0.16, 1.85, 1.5], [KAMAR.window.x - 0.2, 0.7, 10], 56),
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none", doors: ramp(t, 16.0, 17.2),
        body: (
          <>
            <C1 position={c1Root} yaw={S_} t={t} pose={{ ...reach(c1Root, S_, "R", [KAMAR.window.x + 0.2, 1.3, 2.86]), headYaw: 0 }} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
            <Warga list={WARGA_A05} t={t} />
          </>
        ),
        light: [KAMAR.window.x, 1.4, 2.4],
      };
    }
    case "a05b":
    case "a05c": {
      // POV through the bedroom window: W1 (sarung) in a05b, W2 (carrying) in a05c
      const who = WARGA_A05[s.id === "a05b" ? 0 : 1];
      const w = walkState(who.gait, who.plan, t);
      const at: V3 = [w.position[0], 1.0, w.position[2]];
      return {
        cam: cam([KAMAR.window.x, 1.45, 2.3], at, 26),
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: <Warga list={WARGA_A05} t={t} />,
        light: [at[0], 1.3, at[2]],
      };
    }
    // A06 — adik in the bedroom door, the lit living room behind her; C1 turns from the window
    case "a06a":
    case "a06b": {
      const c1Root: V3 = [3.0, 0, 2.15];
      const adikRoot: V3 = [KAMAR.x0 + 0.12, 0, KAMAR.door.z];
      const turn = ramp(t, L("L9").start + 0.3, L("L9").start + 1.0);
      const adikTurn = ramp(t, L("L10").end + 0.2, L("L10").end + 0.8); // after L10 she turns toward the front door
      const body = (
        <>
          <C1 position={c1Root} yaw={lerp(S_, N_ - 0.9, turn)} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ headYaw: -18 * turn }} />
          <Npc preset={ADIK} position={adikRoot} yaw={lerp(E, W_ + 0.4, adikTurn)} t={t} face={{ mouth: t >= L("L10").start && t < L("L10").end ? "open" : "soft", eyes: "open" }} pose={{ headNod: -4 }} />
        </>
      );
      return s.id === "a06a"
        ? { cam: cam([3.75, 1.4, 2.6], [1.2, 1.0, 0.6], 56), mood: NIGHT, ext: false, int: true, tamuLamp: 1, body, light: [2.2, 1.3, 1.4] }
        : { cam: cam([2.15, 1.22, 0.55], [adikRoot[0], 1.05, adikRoot[2]], 32), mood: NIGHT, ext: false, int: true, tamuLamp: 1, body, light: [1.3, 1.1, 0.3], blur: 1.6 };
    }
    // A07 — the phone: hand + phone insert, the chat UI (the message), then C1's face lit by the screen
    case "a07a": {
      const root: V3 = [KAMAR.table.x + 0.15, 0, KAMAR.table.z + 0.5];
      const yaw = N_ - 0.5;
      const lift = ramp(t, s.start + 0.6, s.end - 0.1);
      const onTable: V3 = [KAMAR.table.x, KAMAR.table.top + 0.006, KAMAR.table.z];
      const inHand: V3 = [root[0] - 0.12, 1.12, root[2] - 0.22];
      const target = lerp3(onTable, inHand, lift);
      const reachK = ramp(t, s.start, s.start + 0.55);
      const handTarget = lerp3([root[0] - 0.15, 0.9, root[2] - 0.05], target, reachK);
      return {
        cam: cam([KAMAR.table.x + 0.55, 1.35, KAMAR.table.z + 0.45], [KAMAR.table.x - 0.05, 0.8, KAMAR.table.z - 0.05], 36),
        mood: NIGHT, ext: false, int: true, tamuLamp: 1,
        body: (
          <>
            <C1 position={root} yaw={yaw} t={t} pose={reach(root, yaw, "L", handTarget)} face={{ eyes: "down", mouth: "flat" }} />
            <Phone p={target} q={new THREE.Euler(-Math.PI / 2 + lift * 1.2, 0, 0)} glow={0.6} />
          </>
        ),
        light: [KAMAR.table.x, 1.0, KAMAR.table.z], blur: 1.4,
      };
    }
    case "a07b":
      return {
        cam: cam([2.6, 1.3, 0.4], [2.0, 1.2, -0.2], 30),
        mood: NIGHT, ext: false, int: true, tamuLamp: 1,
        body: null, light: [2.0, 1.2, -0.2], blur: 3.0,
        ui: <PhoneUI t={t} tIn={s.start} notif={L("L13").start} />,
      };
    case "a07c": {
      const root: V3 = [2.05, 0, -0.15];
      const yaw = E;
      const phone: V3 = [2.05 + 0.3, 1.18, -0.15 - 0.03];
      return {
        cam: camLerp(cam([2.95, 1.3, 0.05], [2.05, 1.32, -0.15], 30), cam([2.85, 1.31, 0.03], [2.05, 1.32, -0.15], 28), u),
        mood: NIGHT, ext: false, int: true, tamuLamp: 1,
        body: (
          <>
            <C1 position={root} yaw={yaw} t={t} pose={reach(root, yaw, "L", phone)} face={{ eyes: "open", brows: "worried", mouth: "open" }} />
            <Phone p={phone} q={new THREE.Euler(0, -Math.PI / 2 + 0.25, 0)} glow={1} />
          </>
        ),
        light: [2.05, 1.3, -0.15], blur: 1.8,
      };
    }
    // A08 — the living room: adik at the front door; C1 pulls her away
    case "a08": {
      const p = pullState(t);
      const onHandle = 1 - ramp(t, A08.pull0, A08.pull0 + 0.3);
      const handle: V3 = [TAMU.frontDoor.x + TAMU.frontDoor.w / 2 - 0.12, 1.0, 2.92];
      const adikPose = onHandle > 0.01 ? reach(p.adik, p.adikYaw, "R", handle, ADIK.height) : {};
      const grab = ramp(t, A08.grab - 0.25, A08.grab);
      // C1's left hand ("R") on adik's upper arm (her right shoulder side)
      const adikShoulder = handWorld({ position: p.adik, yaw: p.adikYaw, pose: { armL: [0, 0] }, side: "L", height: ADIK.height, build: C1_BUILD });
      const shoulder: V3 = [adikShoulder[0], adikShoulder[1] + 0.32 * ADIK.height * 0.45, adikShoulder[2]];
      const c1Pose = grab > 0 ? reach(p.c1, p.c1Yaw, "R", lerp3([p.c1[0] - 0.2, 0.9, p.c1[2] + 0.1], shoulder, grab)) : {};
      return {
        cam: cam([0.8, 1.5, -0.5], [-2.6, 1.0, 2.2], 56),
        mood: LAMP, ext: false, int: true, tamuLamp: 1,
        body: (
          <>
            <Npc preset={ADIK} position={p.adik} yaw={p.adikYaw} t={t} pose={{ ...(ADIK.pose ?? {}), ...adikPose }} legPose={shuffle(t, p.k, ADIK.height)} face={{ eyes: "open", brows: p.k > 0.1 ? "raised" : "neutral", mouth: "flat" }} />
            <C1 position={p.c1} yaw={p.c1Yaw} t={t} pose={c1Pose} legPose={shuffle(t + 0.15, Math.min(p.k, 0.999) || ramp(t, A08.t0, A08.grab) * 0.999, H1)} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          </>
        ),
        light: [-1.8, 1.2, 1.8],
      };
    }
    // A09 — the announcement stops; silence; both freeze, adik moves closer
    case "a09": {
      const closer = ramp(t, L("L18").end + 0.4, L("L19").start - 0.2);
      const adik = lerp3([-2.05, 0, 1.75], ADIK_ROOM, closer);
      const c0 = cam([0.8, 1.45, 1.7], [-1.65, 1.05, 1.65], 42);
      const c1c = cam([0.5, 1.42, 1.68], [-1.65, 1.08, 1.65], 38);
      return {
        cam: camLerp(c0, c1c, u),
        mood: LAMP, ext: false, int: true, tamuLamp: 1,
        body: (
          <>
            <C1 position={C1_ROOM} yaw={FACE_WIN} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat", look: -0.4 }} pose={{ headYaw: -8 }} />
            <Npc preset={ADIK} position={adik} yaw={FACE_WIN - 0.15} t={t} legPose={shuffle(t, closer, ADIK.height)} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ ...(ADIK.pose ?? {}), headYaw: -10 }} />
          </>
        ),
        light: [-1.7, 1.2, 1.6],
      };
    }
    // A10 — the toa horns (nobody there), then the "7" plate; both with a slow camera move (D-025/D-026)
    case "a10a": {
      const h = toaHornWorld();
      return {
        cam: camLerp(cam([h[0] - 2.2, 1.6, h[2] + 2.6], [h[0], h[1] - 0.2, h[2]], 30), cam([h[0] - 1.9, 1.7, h[2] + 2.3], [h[0], h[1] + 0.1, h[2]], 26), ease(u)),
        mood: NIGHT, ext: true, int: false, tamuLamp: 1, body: null, light: h, sky: true,
      };
    }
    case "a10b": {
      const p = plateWorld();
      return {
        cam: camLerp(cam([p[0] + 0.35, p[1] + 0.12, p[2] + 1.3], p, 30), cam([p[0] + 0.18, p[1] + 0.05, p[2] + 0.75], p, 26), ease(u)),
        mood: NIGHT, ext: true, int: false, tamuLamp: 1, body: null, light: [p[0], p[1] + 0.3, p[2] + 0.5], sky: true, blur: 1.4,
      };
    }
    // A11 — adik looks up at C1, then whispers "Kok dia tahu?"
    case "a11a":
    case "a11b": {
      const up = ramp(t, L("L23").start, L("L23").start + 0.6);
      const whisper = t >= L("L24").start && t < L("L24").end;
      const body = (
        <>
          <C1 position={C1_ROOM} yaw={S_ - 0.35} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ headYaw: -25, headNod: -6 }} />
          <Npc preset={ADIK} position={ADIK_ROOM} yaw={S_ + 1.1} t={t} face={{ eyes: "open", brows: "worried", mouth: whisper ? "open" : "flat" }} pose={{ ...(ADIK.pose ?? {}), headNod: -14 * up, headYaw: 8 }} />
        </>
      );
      const c1h = stickHeadCenter(C1_ROOM);
      return s.id === "a11a"
        ? { cam: cam([-2.65, 1.3, 2.25], [c1h[0], c1h[1] - 0.05, c1h[2]], 32), mood: LAMP, ext: false, int: true, tamuLamp: 1, body, light: c1h, blur: 1.6 }
        : { cam: cam([-1.15, 1.2, 2.15], [ADIK_ROOM[0], 1.0, ADIK_ROOM[2]], 38), mood: LAMP, ext: false, int: true, tamuLamp: 1, body, light: [ADIK_ROOM[0], 1.1, ADIK_ROOM[2]], blur: 1.8 };
    }
    // A12 — C1 switches the living-room light off (click at the beat), the room goes dark blue
    case "a12a":
    case "a12b": {
      const root: V3 = [TAMU.switch[0] - 0.36, 0, TAMU.switch[2] - 0.5];
      const yaw = S_ + 0.6;
      const press = ramp(t, lightOff - 0.45, lightOff);
      const handT = lerp3([root[0] + 0.15, 1.0, root[2] + 0.15], [TAMU.switch[0] - 0.01, TAMU.switch[1], TAMU.switch[2] - 0.035], press);
      const body = (
        <>
          <C1 position={root} yaw={yaw} t={t} pose={reach(root, yaw, "R", handT)} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          <Npc preset={ADIK} position={ADIK_ROOM} yaw={FACE_WIN} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
        </>
      );
      return s.id === "a12a"
        ? { cam: cam([TAMU.switch[0] + 0.65, 1.42, TAMU.switch[2] - 0.8], TAMU.switch, 34), mood: lit ? LAMP : NIGHT, ext: false, int: true, tamuLamp: lit, body, light: TAMU.switch, blur: 2.0 }
        : { cam: cam([0.75, 1.55, 2.3], [-1.95, 1.0, 2.0], 46), mood: NIGHT, ext: false, int: true, tamuLamp: 0, body, light: [-1.6, 1.2, 1.7] };
    }
    // A13 — in the dark both turn to the window (L26); outside, the living-room window has just gone dark (L27)
    case "a13a": {
      const turn = ramp(t, L("L26").start + 0.2, L("L26").start + 0.8);
      return {
        cam: cam([0.8, 1.42, 1.7], [-1.65, 1.08, 1.65], 42),
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: (
          <>
            <C1 position={C1_ROOM} yaw={lerp(FACE_WIN + 0.5, FACE_WIN, turn)} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} pose={{ roll: 2 * turn }} />
            <Npc preset={ADIK} position={ADIK_ROOM} yaw={lerp(FACE_WIN + 0.6, FACE_WIN - 0.15, turn)} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
            <Warga list={WARGA_A14} t={t} />
          </>
        ),
        light: [-1.6, 1.2, 1.8],
      };
    }
    case "a13b":
      return {
        cam: cam([-14, 9, 13], [3.0, 1.4, 5.0], 48),
        mood: NIGHT, ext: true, int: false, tamuLamp: 0, body: <Warga list={WARGA_A14} t={t} />, light: [0, 1.4, 7], sky: true,
      };
    // A14 — POV from behind the living-room curtain: the villagers slow down, stop, turn their heads one by one
    case "a14":
      return {
        cam: cam([TAMU.window.x + 0.1, 1.5, 2.66], [-1.1, 0.95, 8.0], 44),
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: <Warga list={WARGA_A14} t={t} />, light: [-1.0, 1.3, 7.5],
      };
    // A15 — adik's hand grips C1's hand tighter; tilt up to both faces
    case "a15": {
      const grip = ramp(t, L("L30").start + 0.4, L("L30").end);
      const meet: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2 + 0.02, 0.74 + 0.01 * grip, (C1_ROOM[2] + ADIK_ROOM[2]) / 2 + 0.12];
      const tilt = ramp(t, s.start + 0.9, s.end - 0.2);
      return {
        cam: camLerp(cam([meet[0] + 1.15, meet[1] + 0.25, meet[2] - 0.05], [meet[0], meet[1] + 0.03, meet[2]], 30), cam([meet[0] + 1.8, 1.25, meet[2] + 0.1], [meet[0] - 0.05, 1.1, meet[2] - 0.1], 44), tilt),
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: <Pair t={t} grip={grip} />,
        light: [meet[0], 1.0, meet[2] + 0.3], blur: 1.6,
      };
    }
    // A16 — C1 turns toward the back of the house (screen right); POV down the hallway to the back door
    case "a16a": {
      const turn = ramp(t, s.start + 0.25, s.start + 1.0);
      return {
        cam: cam([-0.25, 1.38, 1.75], [C1_ROOM[0], 1.32, C1_ROOM[2]], 30),
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: <Pair t={t} grip={1} c1Yaw={FACE_WIN + 1.0 * turn} c1Head={50 * turn} />,
        light: [C1_ROOM[0], 1.3, C1_ROOM[2] + 0.4], blur: 1.6,
      };
    }
    case "a16b":
      return {
        cam: camLerp(cam([-0.8, 1.5, -0.4], [-0.8, 1.15, -5.0], 40), cam([-0.8, 1.48, -1.55], [-0.8, 1.15, -5.0], 38), ease(clamp01(u / 0.8))),
        mood: NIGHT, ext: false, int: true, tamuLamp: 0, body: null, light: [-0.8, 1.2, -3.0],
      };
    // A17 — both, hand in hand, between the two ways out; C1 glances at the window (left), then the hallway (right);
    // the camera pans with the glances (a vertical frame cannot hold both openings at once); cards on the last 3 s
    case "a17": {
      const l33 = L("L33");
      // "atau" ≈ 42 % into L33 (letter count): the window half before it, the back-door half after it
      const atau = l33.start + (l33.end - l33.start) * 0.42;
      const lookL = ramp(t, l33.start + 0.3, l33.start + 1.0) * (1 - ramp(t, atau - 0.2, atau + 0.3));
      const lookR = ramp(t, atau, atau + 0.8) * (1 - ramp(t, l33.end + 0.2, l33.end + 1.0));
      const P = [0.55, 1.5, 2.45] as V3;
      const centre = cam(P, [-1.65, 1.0, 1.65], 54);
      const win = cam(P, [-1.45, 1.15, 2.55], 54);
      const hall = cam(P, [-1.0, 1.05, -1.6], 54);
      const c =
        t < atau ? camLerp(centre, win, ramp(t, l33.start + 0.2, l33.start + 1.4) * (1 - ramp(t, atau - 0.6, atau + 0.2)))
        : t < l33.end ? camLerp(centre, hall, ramp(t, atau + 0.1, atau + 1.3))
        : camLerp(hall, centre, ramp(t, l33.end, l33.end + 1.0));
      return {
        cam: c,
        mood: NIGHT, ext: true, int: true, tamuLamp: 0, house7: "none",
        body: (
          <>
            <Pair t={t} grip={1} c1Yaw={FACE_WIN + 1.0 * lookR} c1Head={-25 * lookL + 50 * lookR} />
            <Warga list={WARGA_A14} t={t} />
          </>
        ),
        light: [-1.7, 1.3, 1.8],
        ui: <Cards t={t} inAt={PLAN.beats.cards} />,
      };
    }
    default:
      return { cam: cam([0, 1.5, 5], [0, 1, 0]), mood: NIGHT, ext: false, int: true, tamuLamp: 0, body: null, light: [0, 1, 0] };
  }
};

/** C1 and adik side by side facing the front window, hand in hand (C1's right hand "L", adik's left hand "R") */
const Pair: React.FC<{ t: number; grip: number; c1Head?: number; c1Yaw?: number }> = ({ t, grip, c1Head = 0, c1Yaw = FACE_WIN }) => {
  const adikYaw = FACE_WIN - 0.2;
  const meet: V3 = [(C1_ROOM[0] + ADIK_ROOM[0]) / 2 + 0.02, 0.74 + 0.01 * grip, (C1_ROOM[2] + ADIK_ROOM[2]) / 2 + 0.12];
  return (
    <>
      <C1 position={C1_ROOM} yaw={c1Yaw} t={t} pose={{ ...reach(C1_ROOM, c1Yaw, "L", [meet[0] + 0.035, meet[1] + 0.025, meet[2] + 0.01]), headYaw: c1Head }} hands={{ L: { dir: [0, -1, 0.3], palm: [1, 0, 0], curl: 40 + 30 * grip, w: 0.8 } }} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
      <Npc preset={ADIK} position={ADIK_ROOM} yaw={adikYaw} t={t} pose={{ ...(ADIK.pose ?? {}), ...reach(ADIK_ROOM, adikYaw, "R", [meet[0] - 0.03, meet[1] - 0.01, meet[2]], ADIK.height), headYaw: 15, headNod: -6 }} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
    </>
  );
};

/** exposure per location (the set builder's values): street −0.18, dark interior −0.45, lit living room 0 */
const exposureOf = (st: Staged) => (st.mood === LAMP ? 0 : st.int && !st.ext ? -0.45 : st.int ? -0.3 : -0.18);

export const Animatic: React.FC = () => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  const t = f / EP002_FPS;
  const shot = SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];
  const st = stage(shot, t);
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={st.mood} cam={st.cam} t={t} focus={st.cam.look} blur={st.blur ?? 0.6} sky={!!st.sky || (st.ext && st.int)} exposure={exposureOf(st)}>
        {st.int ? <HouseInterior tamuLamp={st.tamuLamp} t={t} windowGlass={st.ext ? "clear" : "opaque"} /> : null}
        {st.ext ? <StreetSet t={t} tamuLit={st.tamuLamp} house7={st.int ? "none" : st.house7 ?? "full"} neighbourDoorsOpen={st.doors ?? 1} /> : null}
        {st.body}
        <CastLight at={st.light} cam={st.cam.pos} mood={st.mood} />
      </View>
      {st.ui}
      <Subtitles t={t} />
    </AbsoluteFill>
  );
};
void headAt;
void BALITA;
void IBU;
void IbuGendong;
