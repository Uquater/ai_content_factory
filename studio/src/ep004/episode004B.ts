// Episode 3 (2026-11-004), D-057 tahap 2, GROUP B: S03–S07 (9.20–30.675 s) on the working timeline
// episode004-plan-d055.json. A pure function of EPISODE time. Additive: the pilot stage (pilot004Stage.ts), its S02 poses
// (e004Poses.ts) and the Episode 2 code are only READ, never changed.
//   S03 9.20–12.40  hallway POV-less shot to the back door (Ep 2 S10 lens), no characters
//   S04 12.40–19.22 lens (0.62; 1.45; 2.50) fov 30: heads up to the toa on its opener (12.6); the S02 hands released along
//                   the CHECKED S02 joint paths in reverse order (Uq's hand off her shoulder via MID first, then her hand
//                   off her mouth), same segment durations as the forward moves
//   S05 19.22–21.22 insert: the phone buzzes (19.27) in Uq's LEFT hand (rig "R"), he raises it in front of his chest
//   S06 21.22–26.11 phone UI (overlay, PhoneUI004): chat with the unknown number, message L5
//   S07 26.11–30.675 long lens, faces lit by the screen; eyes screen → up → screen on L6; adik leans in to read
// Continuity into the pilot's Blok B: pilot time + 3.275 s = episode time (pilot LED-1 27.9 → plan 31.175). The pilot's S08
// starts with hands at REST and the phone low (EP2_END.phone); the 1.5 s S08a cutaway (POV, Uq not drawn) covers the
// lowering of the phone.
import * as THREE from "three";
import { C1_BUILD, C1_HEIGHT } from "../c1/c1rig";
import type { C1Hand } from "../c1/c1rig";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import { solveArm } from "../inkbeat/core/ik";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { toaHornWorld } from "../ep002/sets";
import { handFrame } from "../ep003/ld003SceneV3";
import { EP2_END, S02 } from "./e004Poses";
import { adikAt as pilotAdik, MID_UQ, REST_AD, REST_UQ, uqAt as pilotUq } from "./pilot004Stage";
import type { MChar } from "./motion004";
import P55 from "./episode004-plan-d055.json";

type Q3 = [number, number, number];
type Q4 = [number, number, number, number];
const SH = P55.shots as unknown as Record<string, [number, number, number]>;
const EV = P55.events as unknown as Record<string, number | [number, number]>;
const ev = (k: string) => EV[k] as number;
const span = (k: string) => EV[k] as [number, number];
export const PILOT_B_OFFSET = SH.S08a[0] - 27.4; // 3.275 s (pilot v3 S08a 27.4 → plan 30.675)

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const qlerp = (a: Q3, b: Q3, u: number): Q3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const UP = new THREE.Vector3(0, 1, 0);
const R2D = 180 / Math.PI;
const wrapDeg = (a: number) => Math.atan2(Math.sin(a), Math.cos(a)) * R2D;
const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const v3 = (p: THREE.Vector3): V3 => [p.x, p.y, p.z];
const q4 = (q: THREE.Quaternion): Q4 => [q.x, q.y, q.z, q.w];
const LAY = layoutOf(C1_BUILD);

// ------------------------------------------------------------------ the S02 end pose (pilot, last frame before the cut 9.2)
const A_U = pilotUq(SH.S02[1] - 1 / 30);
const A_A = pilotAdik(SH.S02[1] - 1 / 30);
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const QU = S02.q.uq as Q3, QA = S02.q.adik as Q3;
const ROOT_U = uqEnd.root as V3, YAW_U = uqEnd.yaw;
const ROOT_A = S02.adik.root as V3, YAW_A = A_A.yaw;

// ------------------------------------------------------------------ the phone in his LEFT hand (copied from Ep 2
// episode003Stage.ts, not exported there; Ep 2 code unchanged): world ↔ hand-local, front pose for reading
const HAND_FRONT: C1Hand = { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 };
const READ_LOCAL: V3 = [0.11, 0.98, 0.25]; // Ep 2 S08–S09 reading pose [0.08, 0.98, 0.24] moved 3 cm out to his left and 1 cm
// forward (D-057 numbers: Ep 2's point put the phone arm 0.31 cm into his torso, limit 0.2)
const ik = (root: V3, yaw: number, side: "L" | "R", target: V3): Q3 => {
  const s = solveArm({ position: root, yaw, side, target, height: C1_HEIGHT, build: C1_BUILD });
  return [s.arm[0], s.arm[1], s.fwd];
};
const toWorld = (root: V3, yaw: number, local: V3): V3 => {
  const p = new THREE.Vector3(...local).applyAxisAngle(UP, yaw);
  return [root[0] + p.x, root[1] + p.y, root[2] + p.z];
};
const aimQuat = (p: V3, aim: V3) => {
  const yaw = Math.atan2(aim[0] - p[0], aim[2] - p[2]);
  const pitch = Math.atan2(aim[1] - p[1], Math.hypot(aim[0] - p[0], aim[2] - p[2]));
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-pitch, 0, 0)));
};
const armPoseR = (q: Q3) => ({ armR: [q[0], q[1]] as [number, number], armRFwd: q[2] });
const PHONE_FRONT = (root: V3, yaw: number, q: Q3, tilt = 0.6) => {
  const palm = armChain(armPoseR(q), "R", LAY).H.multiplyScalar(C1_HEIGHT).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
  const fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const p = palm.clone().addScaledVector(fwd, 0.03).add(new THREE.Vector3(0, 0.02, 0));
  return { p: v3(p), q: q4(aimQuat(v3(p), [p.x + fwd.x, p.y - tilt, p.z + fwd.z])) };
};
type PhoneL = { p: THREE.Vector3; q: THREE.Quaternion };
const phoneToHand = (w: { p: V3; q: Q4 }, q: Q3, h: C1Hand): PhoneL => {
  const hf = handFrame(armPoseR(q), "R", h, ROOT_U, YAW_U);
  const inv = hf.q.clone().invert();
  return { p: new THREE.Vector3(...w.p).sub(hf.origin).applyQuaternion(inv), q: inv.clone().multiply(new THREE.Quaternion(...w.q)) };
};
const phoneFromHand = (l: PhoneL, q: Q3, h: C1Hand) => {
  const hf = handFrame(armPoseR(q), "R", h, ROOT_U, YAW_U);
  return { p: v3(l.p.clone().applyQuaternion(hf.q).add(hf.origin)), q: q4(hf.q.clone().multiply(l.q)) };
};
const handMix = (a: C1Hand, b: C1Hand, u: number): C1Hand => {
  const n = (x: V3) => { const l = Math.hypot(...x) || 1; return [x[0] / l, x[1] / l, x[2] / l] as V3; };
  return { dir: n(lerp3(a.dir, b.dir, u)), palm: n(lerp3(a.palm, b.palm, u)), curl: lerp(a.curl ?? 0, b.curl ?? 0, u), w: lerp(a.w ?? 1, b.w ?? 1, u) };
};
const uqPose = uqEnd.pose as Record<string, unknown>;
const Q_END: Q3 = [(uqPose.armR as number[])[0], (uqPose.armR as number[])[1], (uqPose.armRFwd as number) ?? 0];
const HANDS_END = uqEnd.hands as { L: C1Hand; R: C1Hand };
export const Q_FRONT = ik(ROOT_U, YAW_U, "R", toWorld(ROOT_U, YAW_U, READ_LOCAL));
const PH_END_L = phoneToHand(EP2_END.phone as { p: V3; q: Q4 }, Q_END, HANDS_END.R);
const PH_FRONT_L = phoneToHand(PHONE_FRONT(ROOT_U, YAW_U, Q_FRONT), Q_FRONT, HAND_FRONT);

// ------------------------------------------------------------------ timing (USULAN, from the plan's events)
const VIB = [ev("vib1"), ev("vib1") + 1.0]; // two 0.52 s buzzes 1.0 s apart (Ep 2's vibration SFX, plan "vib")
export const RAISE: [number, number] = [ev("vib1") + 0.58, ev("vib1") + 1.28]; // after the first buzz, 0.7 s (Ep 2: 0.65 s)
export const SCREEN_ON = ev("vib1"); // lock screen lights on the buzz; off at S08a (pilot)
export const REL_U: [number, number, number] = [14.4, 14.8, 15.2]; // Uq: shoulder → MID → REST (S02 forward: 0.4 + 0.4 s)
export const REL_A: [number, number] = [15.2, 16.0]; // adik: mouth → REST (S02 forward: 0.8 s)
// L6 word timing by character share (ASUMSI, same method as the captions): "Kamu" ≈ 27.55 s, "percaya" ≈ 29.07 s
const L6 = span("L6");
const L6_KAMU = L6[0] + (18 / 59) * (L6[1] - L6[0]);
const L6_PERCAYA = L6[0] + (40 / 59) * (L6[1] - L6[0]);

const TOA = toaHornWorld();
const toaHead = (root: V3, yaw: number) => {
  const d = wrapDeg(yawTo(root, TOA) - yaw);
  return { yaw: Math.max(-55, Math.min(55, d)), nod: -10 }; // "sedikit terangkat" (storyboard S04)
};
const TOA_U = toaHead(ROOT_U, YAW_U), TOA_A = toaHead(ROOT_A, YAW_A);
const PHONE_HEAD_U = { yaw: 12, nod: 26 }; // looking down at the phone in front of his chest (left of centre)

export type BFrame = { chars: MChar[]; phone: { p: V3; q: Q4 }; glow: number };
const breathU = (t: number) => 1.2 * Math.sin((t - 2.1) * 2 * Math.PI * 0.28); // the pilot S02 formula, continued
const breathA = (t: number) => 1.0 * Math.sin((t - 2.1) * 2 * Math.PI * 0.31 + 1.3);

export const charsB = (t: number): BFrame => {
  // ---- Uq, right arm (rig "L"): the S02 hand on her shoulder, released along the checked path in reverse
  const r1 = ramp(t, REL_U[0], REL_U[1]), r2 = ramp(t, REL_U[1], REL_U[2]);
  const qL: Q3 = r2 > 0 ? qlerp(MID_UQ, REST_UQ, r2) : qlerp(QU, MID_UQ, r1);
  // ---- Uq, left arm (rig "R"): the phone, raised after the first buzz and held through S07
  const up = ramp(t, RAISE[0], RAISE[1]);
  const qR = qlerp(Q_END, Q_FRONT, up);
  const handR = handMix(HANDS_END.R, HAND_FRONT, up);
  const local: PhoneL = { p: PH_END_L.p.clone().lerp(PH_FRONT_L.p, up), q: PH_END_L.q.clone().slerp(PH_FRONT_L.q, up) };
  let phone = phoneFromHand(local, qR, handR);
  const buzz = VIB.some((b) => t >= b && t < b + 0.52) ? 0.002 * Math.sin(t * 2 * Math.PI * 18) : 0;
  phone = { ...phone, p: [phone.p[0] + buzz, phone.p[1], phone.p[2]] };
  // ---- Uq head: S02 end → toa (opener 12.6) → adik after the release → the phone → (S07) up on "Kamu", back on "percaya"
  const a0 = { yaw: A_U.pose.headYaw as number, nod: (A_U.pose.headNod as number) - breathU(SH.S02[1] - 1 / 30) };
  // sequential blends (each a smoothstep of t), so the head path is continuous by construction
  const steps: [number, { yaw: number; nod: number }][] = [
    [ramp(t, ev("toa_open1"), ev("toa_open1") + 0.6), TOA_U],
    // after the release he settles, facing ahead and a little down (D-057 v1 turned to adik, −30°: from this lens the
    // face went to the back of the head for ~3 s)
    [ramp(t, 16.2, 16.9), { yaw: 25, nod: 6 }], // v3: 25° (v2 5° read three-quarter away from this lens)
    [ramp(t, VIB[0] + 0.08, VIB[0] + 0.5), PHONE_HEAD_U],
    [ramp(t, L6_KAMU, L6_KAMU + 0.45), { yaw: 0, nod: -6 }],
    [ramp(t, L6_PERCAYA - 0.15, L6_PERCAYA + 0.35), PHONE_HEAD_U],
  ];
  let hy = a0.yaw, hn = a0.nod;
  for (const [k, h] of steps) { hy = lerp(hy, h.yaw, k); hn = lerp(hn, h.nod, k); }
  const glanceUp = ramp(t, L6_KAMU, L6_KAMU + 0.45) * (1 - ramp(t, L6_PERCAYA - 0.15, L6_PERCAYA + 0.35));
  const uq: MChar = {
    who: "uq", root: ROOT_U, yaw: YAW_U, height: uqEnd.height, legPose: uqEnd.legPose,
    hands: { L: HANDS_END.L, R: handR },
    pose: { ...uqPose, armL: [qL[0], qL[1]], armLFwd: qL[2], armR: [qR[0], qR[1]], armRFwd: qR[2], headYaw: hy, headNod: hn + breathU(t) },
    face: { eyes: "open", brows: "worried", mouth: "flat", look: lerp((A_U.face.look as number) ?? 0, 0, ramp(t, 12.4, 13.0)) - 0.3 * glanceUp },
  };
  // ---- adik: her own hand off her mouth after his, an exhale, toa look, then she leans in to read (S05–S07)
  const qA = qlerp(QA, REST_AD, ramp(t, REL_A[0], REL_A[1]));
  const b0 = { yaw: A_A.pose.headYaw as number, nod: (A_A.pose.headNod as number) - breathA(SH.S02[1] - 1 / 30) };
  const tA = ramp(t, ev("toa_open1") + 0.05, ev("toa_open1") + 0.65);
  const back = ramp(t, 16.3, 17.0);
  const exhale = 6 * ramp(t, REL_A[1] - 0.2, REL_A[1] + 0.3) * (1 - ramp(t, REL_A[1] + 0.4, REL_A[1] + 1.1));
  const read = ramp(t, VIB[0] + 0.25, VIB[0] + 1.05); // she turns her head to the buzzing phone and leans in
  let ay = lerp(b0.yaw, TOA_A.yaw, tA), an = lerp(b0.nod, TOA_A.nod, tA);
  ay = lerp(ay, 20, back); an = lerp(an, -4, back);
  ay = lerp(ay, 38, read); an = lerp(an, 16, read);
  const adPose = A_A.pose as Record<string, unknown>;
  const adik: MChar = {
    who: "adik", root: ROOT_A, yaw: YAW_A, height: A_A.height, legPose: A_A.legPose,
    pose: { ...adPose, armR: [qA[0], qA[1]], armRFwd: qA[2], headYaw: ay, headNod: an + exhale + breathA(t), lean: 4 * read },
    face: { eyes: "open", brows: "raised", mouth: "flat" },
  };
  const glow = t >= SCREEN_ON ? ramp(t, SCREEN_ON, SCREEN_ON + 0.1) : 0;
  return { chars: [uq, adik], phone, glow };
};

// ------------------------------------------------------------------ cameras
const headPt = (c: MChar, dy = 0): V3 => {
  const h = c.height;
  return [c.root[0], c.root[1] + h * 0.86 + dy, c.root[2]];
};
const MID_A = (y: number): V3 => [(ROOT_U[0] + ROOT_A[0]) / 2, y, (ROOT_U[2] + ROOT_A[2]) / 2];
/** S03: Ep 2 S10's lens, a slow continuous push (linear: no stall), no characters */
const S03A: Cam = { pos: [-0.8, 1.5, -0.4], look: [-0.8, 1.15, -5.0], fov: 40, roll: 0 };
const S03B: Cam = { pos: [-0.8, 1.49, -0.95], look: [-0.8, 1.15, -5.0], fov: 39, roll: 0 };
/** S04 (USULAN): lens (0.62; 1.45; 2.50), fov 30 → 27 with a 4 cm dolly (≈ 2 %/s; a 3 %/s dolly alone would end
 * 1.8 m from Uq, under the 2.2 m rule), aimed so the faces sit near the storyboard's (681; 538) / (420; 943) */
/** D-057 v2: fov 40 → 37 (v1 storyboard 30 → 27 cut Uq's head at the right edge: the storyboard's 30 assumed adik 0.39 m
 * from him; the S02 fallback put her 0.64 m away). At 40 the face x match the storyboard (681 / 420). */
export const S04_FOV: [number, number] = [40, 37];
export const S04_LOOK: V3 = MID_A(1.024);
/** S07 (USULAN): long lens (0.68; 1.4; 2.55) fov 26 → 24.5, aim near the storyboard's faces (704; 475) / (400; 948) */
/** D-057 v2: fov 36 → 34 (v1 storyboard 26 → 24.5 cut Uq's head, same reason as S04) */
export const S07_FOV: [number, number] = [36, 34];
export const S07_LOOK: V3 = MID_A(1.02);
/** S05 insert (USULAN): Ep 2 S08's actual lens pattern — in front of him and to his right, waist height, ~1 m, the look
 * follows the phone up. Fov chosen for the 45 % insert rule at the raised phone (measured, see S05_FOV) */
// D-057 v2: front-LEFT (his phone side). v1 used Ep 2 S08's front-right offset: here adik stands there and filled the frame.
const S05_POS: V3 = toWorld(ROOT_U, YAW_U, [0.45, 1.15, 0.9]);
export const S05_FOV = 18; // D-057 numbers: fov 22 (45 % rule on the untilted phone) measured 38 %; 18 → ≈ 46 % raised
/** the phone without the buzz (the lens must not shake with it) */
const phoneNoBuzz = (t: number): V3 => {
  const up = ramp(t, RAISE[0], RAISE[1]);
  const local: PhoneL = { p: PH_END_L.p.clone().lerp(PH_FRONT_L.p, up), q: PH_END_L.q.clone().slerp(PH_FRONT_L.q, up) };
  return phoneFromHand(local, qlerp(Q_END, Q_FRONT, up), handMix(HANDS_END.R, HAND_FRONT, up)).p;
};
// D-057 v2: the look follows the phone itself (v1 trailed the eased path: the phone swung to x 105 px mid-raise)
const s05Look = (t: number): V3 => phoneNoBuzz(t);
export type BStage = { cam: Cam; focus: V3; chars: boolean; pov: false; dim: number };
export const stageB = (shot: string, t: number): BStage => {
  const [a, b] = SH[shot];
  const u = clamp01((t - a) / (b - a));
  if (shot === "S03") return { cam: { pos: lerp3(S03A.pos, S03B.pos, u), look: S03A.look, fov: lerp(S03A.fov, S03B.fov, u), roll: 0 }, focus: S03A.look, chars: false, pov: false, dim: 0 };
  if (shot === "S04") {
    const p0: V3 = [0.62, 1.45, 2.5];
    const dir = new THREE.Vector3(...S04_LOOK).sub(new THREE.Vector3(...p0)).normalize().multiplyScalar(0.04 * sm(u));
    return { cam: { pos: [p0[0] + dir.x, p0[1] + dir.y, p0[2] + dir.z], look: S04_LOOK, fov: lerp(S04_FOV[0], S04_FOV[1], sm(u)), roll: 0 }, focus: headPt(charsB(t).chars[0]), chars: true, pov: false, dim: 0 };
  }
  if (shot === "S05" || shot === "S06") {
    // S06 = the UI over the insert lens held at its end, with the UI's own slow push (overlay); background dimmed
    const tt = shot === "S05" ? t : SH.S05[1];
    return { cam: { pos: S05_POS, look: s05Look(tt), fov: S05_FOV, roll: 0 }, focus: s05Look(tt), chars: true, pov: false, dim: shot === "S06" ? 0.55 : 0 };
  }
  // S07
  return { cam: { pos: [0.68, 1.4, 2.55], look: S07_LOOK, fov: lerp(S07_FOV[0], S07_FOV[1], sm(u)), roll: 0 }, focus: headPt(charsB(t).chars[0]), chars: true, pov: false, dim: 0 };
};
