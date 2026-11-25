// Episode 4 (2026-11-005), FULL EPISODE stage for the shots after the approved opening pilot v3 (S04–S15), owner
// 2026-11-23. A pure function of EPISODE time on episode005-plan.json (scripts/ep005_episode_audio.py plan, timing from the
// owner's VO). The opening (0 → OPEN end) is Pilot005v3 unchanged; this file starts from its end state.
// Blocking (USULAN, storyboard v0.2 adapted, script words unchanged):
//   S04  both walk to the front window (Uq from the lens corner, adik from the sofa around the coffee table's east end),
//        recap cards in the gap before N01 (D-051 rule), N01 while they stand there; camera beyond the wild south wall
//   S05  insert: Uq's right hand (rig "L") parts the west curtain panel (gap 0.28 → 0.40 m)
//   S06  POV through the gap (Ep 1 A14 lens pattern): villagers outside the fence, facing house 7; on `turn` every head
//        turns to the window at the SAME time ("serentak")
//   S07  from the yard: Uq's face in the gap; toa opener + P02; after P02 he lets the curtain go and both turn to the room
//   S08  insert: the phone buzzes in Uq's LEFT hand (rig "R") and comes up (Ep 3 S05 pattern)
//   S09  the chat UI over the held insert, dimmed (Ep 3 S06 pattern; message L6 read by the narrator, not captioned)
//   S10  faces lit by the screen, "Nomornya sama."
//   S11  hallway POV from the living room (ellipsis: they are already at the hallway mouth), both walk north
//   S12  kitchen, looking east: they turn east and go into the bathroom one after the other; the door (opens into the
//        kitchen, look-dev v1) then closes fully (open 1.45 → 0)
//   S13–S15  inside the dark bathroom (look-dev v1 bath-cards blocking), door closed behind them: breath, buzz, the UI,
//        then N06 and the final cards.
// Every value is a pure function of t (video-production §9).
import * as THREE from "three";
import { c1ArmIK, c1ArmTorsoDepth } from "../c1/bodyIk";
import { C1_BUILD } from "../c1/c1rig";
import type { C1Hand } from "../c1/c1rig";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { chain, movesAt, stanceAt, turnInPlace, walkSteps } from "../cast/stepper";
import type { FootEvent, Moves } from "../cast/stepper";
import { handFrame } from "../ep003/ld003SceneV3";
import { EP2_END } from "../ep004/e004Poses";
import { Q_FRONT } from "../ep004/episode004B";
import { H_AD, H_UQ, REST_AD, REST_UQ } from "../ep004/motion004";
import { AD_MOVES, AIM_ROOT, AIM_YAW, handWorld } from "./open005v4";
import PLAN from "./episode005-plan.json";

export type Q = [number, number, number];
type Q4 = [number, number, number, number];
export const SH = PLAN.shots as unknown as Record<string, [number, number, number]>;
export const EV = PLAN.events as unknown as Record<string, number & [number, number] & Record<string, number>>;
const VOP = PLAN.vo as unknown as Record<string, { at: number; end: number; speech: number[][] }>;
const UP = new THREE.Vector3(0, 1, 0);
const D2R = Math.PI / 180;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const qlerp = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
export const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const fwdV = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
const v3 = (p: THREE.Vector3): V3 => [p.x, p.y, p.z];
const q4 = (q: THREE.Quaternion): Q4 => [q.x, q.y, q.z, q.w];
const LAY = layoutOf(C1_BUILD);
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
const uqPose = uqEnd.pose as Record<string, unknown>;
const HANDS_END = uqEnd.hands as { L: C1Hand; R: C1Hand };

// ------------------------------------------------------------------ spots
export const U_WIN: V3 = [-0.62, 0, 2.42]; // run 3: at z 2.36 the curtain edge sat at the arm's full length (palm error 5.7 cm) // Uq at the front window, his face behind the curtain gap
export const A_WIN: V3 = [-1.12, 0, 2.22]; // adik beside him (his right), a little behind
export const U_ROOM_YAW = -150 * D2R, A_ROOM_YAW = 150 * D2R; // both turned to the room, toward each other (S08–S10)
export const U_BATH: V3 = [1.55, 0, -3.4], A_BATH: V3 = [1.55, 0, -3.95]; // look-dev v1 bath-cards blocking, facing east
export const BATH_YAW = Math.PI / 2;
const T11 = EV.walk11 as unknown as number;
export const HALL = {
  // lanes (e005_check run 1): Uq x -0.6 (his swinging right hand touched the hallway's east wall at -0.55), adik z -4.05 past
  // the bathroom door leaf (her left hand touched it at -4.12); the walk starts before the cut (off screen) so that the
  // speeds stay near Ep 3's (peak ~1.35 m/s)
  uq: { start: [-0.6, 0, -0.6] as V3, corner: [-0.6, 0, -3.85] as V3, end: [1.75, 0, -3.92] as V3 },
  adik: { start: [-1.04, 0, -0.35] as V3, corner: [-1.04, 0, -4.0] as V3, end: [1.3, 0, -4.0] as V3 },
};

// ------------------------------------------------------------------ moves
const W4 = EV.walk4 as unknown as [number, number];
const P02_END = VOP.P02.end;
export const TURN7: [number, number] = [P02_END + 0.15, P02_END + 1.15];
export const TURN7A: [number, number] = [P02_END + 0.3, P02_END + 1.3];
const aEnd0 = movesAt(AD_MOVES, 99); // Uq starts at AIM_ROOT (UQ_MOVES ends there)
// living room (S04–S10)
const stU = stanceAt(AIM_ROOT, AIM_YAW, H_UQ);
const yU1 = yawTo(AIM_ROOT, U_WIN);
const uA = turnInPlace(stU, yU1, W4[0], W4[0] + 0.7, H_UQ);
const uB = walkSteps(uA.end, U_WIN, yU1, 2, W4[0] + 0.7, W4[0] + 1.75, H_UQ);
const uC = turnInPlace(uB.end, 0, W4[0] + 1.75, W4[0] + 2.2, H_UQ);
const uD = turnInPlace(uC.end, U_ROOM_YAW, TURN7[0], TURN7[1], H_UQ);
export const UQ_ROOM: Moves = chain(stU, H_UQ, [uA, uB, uC, uD]);
const stA = stanceAt(aEnd0.root, aEnd0.yaw, H_AD);
const yA1 = yawTo(aEnd0.root, A_WIN);
const aA = turnInPlace(stA, yA1, W4[0], W4[0] + 0.3, H_AD);
const aB = walkSteps(aA.end, A_WIN, yA1, 4, W4[0] + 0.3, W4[0] + 2.5, H_AD);
const aC = turnInPlace(aB.end, 0, W4[0] + 2.5, W4[0] + 2.9, H_AD);
const aD = turnInPlace(aC.end, A_ROOM_YAW, TURN7A[0], TURN7A[1], H_AD);
export const AD_ROOM: Moves = chain(stA, H_AD, [aA, aB, aC, aD]);
// hallway + kitchen (S11–S12): walk only along the body's facing (sideways walks cross the feet, lesson v2)
const N_ = Math.PI;
const hU0 = stanceAt(HALL.uq.start, N_, H_UQ);
const hU1 = walkSteps(hU0, HALL.uq.corner, N_, 6, T11 - 1.0, T11 + 2.2, H_UQ);
const hU2 = turnInPlace(hU1.end, Math.PI / 2, T11 + 2.2, T11 + 2.7, H_UQ);
const hU3 = walkSteps(hU2.end, HALL.uq.end, yawTo(HALL.uq.corner, HALL.uq.end), 4, T11 + 2.7, T11 + 4.8, H_UQ);
export const UQ_HALL: Moves = chain(hU0, H_UQ, [hU1, hU2, hU3]);
const hA0 = stanceAt(HALL.adik.start, N_, H_AD);
const hA1 = walkSteps(hA0, HALL.adik.corner, N_, 9, T11 - 1.2, T11 + 2.45, H_AD);
const hA2 = turnInPlace(hA1.end, Math.PI / 2, T11 + 2.45, T11 + 2.95, H_AD);
const hA3 = walkSteps(hA2.end, HALL.adik.end, Math.PI / 2, 6, T11 + 2.95, T11 + 5.3, H_AD);
export const AD_HALL: Moves = chain(hA0, H_AD, [hA1, hA2, hA3]);
/** which move set is on screen at t (the S10→S11 and S12→S13 cuts are ellipses) */
export const phaseOf = (t: number): "room" | "hall" | "bath" => (t < SH.S11[0] - 1e-9 ? "room" : t < SH.S13[0] - 1e-9 ? "hall" : "bath");
export const MOVES = { room: { uq: UQ_ROOM, adik: AD_ROOM }, hall: { uq: UQ_HALL, adik: AD_HALL } };
/** heel strikes on screen (for the footstep SFX): t1 of every foot event inside a shot that shows the feet moving */
export const stepTimes = (): [number, "uq" | "adik"][] => {
  const out: [number, "uq" | "adik"][] = [];
  const add = (m: Moves, who: "uq" | "adik", a: number, b: number) => m.feet.forEach((e: FootEvent) => { if (e.t1 >= a && e.t1 < b) out.push([Math.round(e.t1 * 1000) / 1000, who]); });
  add(UQ_ROOM, "uq", SH.S04[0], SH.S10[1]); add(AD_ROOM, "adik", SH.S04[0], SH.S10[1]);
  add(UQ_HALL, "uq", SH.S11[0], SH.S12[1]); add(AD_HALL, "adik", SH.S11[0], SH.S12[1]);
  return out.sort((x, y) => x[0] - y[0]);
};

// ------------------------------------------------------------------ the bathroom door and the curtain
export const DOOR_OPEN = 1.45;
export const bathDoorAt = (t: number) => (t < SH.S13[0] ? DOOR_OPEN * (1 - ramp(t, EV.door[0], EV.door[1])) : 0);
export const CURTAIN_GAP = (t: number) => {
  const open = ramp(t, EV.curtain[0], EV.curtain[1]);
  const back = ramp(t, TURN7[0] - 0.1, TURN7[0] + 0.3); // he lets it go after P02
  return 0.28 + 0.12 * open * (1 - back);
};
/** the west panel's inner edge (x), where his fingers are */
const edgeX = (t: number) => -0.7 - CURTAIN_GAP(t) / 2;

// ------------------------------------------------------------------ arms
const travel = (m: Moves, t: number, t0: number) => { const a = movesAt(m, t0).root, b = movesAt(m, t).root; return Math.hypot(b[0] - a[0], b[2] - a[2]); };
const swingQ = (rest: Q, amp: number, ph: number, w: number, planeFwd: number): Q => { const x = Math.sin(ph); return [rest[0] + w * amp * (x > 0 ? x : 0), rest[1] + w * 10 * Math.max(0, x), lerp(rest[2], planeFwd, w)]; };
const walkW = (t: number, a: number, b: number) => ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.4, b));
/** per-frame local IK along a world target path (as open005v3 armTable), continued from the previous frame */
const ikTable = (root: V3, yaw: number, h: number, t0: number, t1: number, q0: Q, target: (t: number) => V3, side: "L" | "R" = "L") => {
  const n = Math.max(1, Math.ceil((t1 - t0) * 30));
  const hw = (x: Q) => handWorld(x, side, root, yaw, h);
  const out: Q[] = [q0];
  let q: Q = [...q0];
  for (let f = 1; f <= n; f++) {
    const T = new THREE.Vector3(...target(Math.min(t1, t0 + f / 30)));
    const cost = (x: Q) => hw(x).distanceTo(T) + 4 * c1ArmTorsoDepth(x as never, side, h) + 0.0004 * (Math.abs(x[0] - q[0]) + Math.abs(x[1] - q[1]) + Math.abs(x[2] - q[2]));
    let best = q, bc = cost(q);
    for (const st of [4, 2, 1, 0.5]) for (let i = 0; i < 6; i++)
      for (const d of [[st, 0, 0], [-st, 0, 0], [0, st, 0], [0, -st, 0], [0, 0, st], [0, 0, -st]] as Q[]) {
        const x: Q = [best[0] + d[0], Math.max(-20, best[1] + d[1]), best[2] + d[2]];
        const c = cost(x);
        if (c < bc) { bc = c; best = x; }
      }
    q = best;
    out.push(q);
  }
  const fn = (t: number): Q => {
    if (t <= t0) return out[0];
    const x = (t - t0) * 30, i = Math.floor(x);
    if (i >= out.length - 1) return out[out.length - 1];
    return qlerp(out[i], out[i + 1], x - i);
  };
  return Object.assign(fn, { last: out[out.length - 1], err: (t: number) => hw(fn(t)).distanceTo(new THREE.Vector3(...target(t))) });
};
// S05: the right hand (rig "L") from rest to the west panel's inner edge, then it pulls the edge 6 cm west with the curtain
const CUR_Y = 1.32, CUR_Z = 2.775;
const REACH: [number, number] = [SH.S05[0] - 0.5, EV.curtain[0]]; // starts at the end of S04 (0.85 s: run 2 had 0.35 s = 19 deg/frame)
const H_REST: V3 = v3(handWorld(REST_UQ, "L", U_WIN, 0, H_UQ));
const curtainTarget = (t: number): V3 => {
  const atEdge: V3 = [edgeX(t) + 0.015, CUR_Y, CUR_Z];
  if (t < REACH[1]) return lerp3(H_REST, atEdge, sm((t - REACH[0]) / (REACH[1] - REACH[0])));
  return atEdge;
};
// joint-space keys (lesson: per-frame IK along a path near the shoulder jumps 20–50 deg/frame; run 1 here: 47.6)
const keyIK = (target: V3, ref: Q) => {
  // several starting refs, keep the smallest palm error (run 2: one ref left 5.7 cm)
  const refs: Q[] = [ref, [60, 40, 20], [30, 70, 40], [50, 60, 60], [20, 40, 10], [70, 20, 30]];
  const sol = refs.map((r) => c1ArmIK({ root: U_WIN, yaw: 0, body: {}, side: "L", target, ref: r, height: H_UQ, avoidTorso: true, wMin: -60 })).sort((x, y) => x.err - y.err)[0];
  return { q: [sol.arm[0], sol.arm[1], sol.fwd] as Q, err: sol.err };
};
const K_EDGE = keyIK(curtainTarget(REACH[1]), [40, 50, 30]);
const K_PULL = keyIK(curtainTarget(EV.curtain[1] as unknown as number), K_EDGE.q);
const tCurtain = Object.assign((t: number): Q => (t < REACH[1] ? qlerp(REST_UQ, K_EDGE.q, sm((t - REACH[0]) / (REACH[1] - REACH[0]))) : qlerp(K_EDGE.q, K_PULL.q, ramp(t, EV.curtain[0], EV.curtain[1]))),
  { last: K_PULL.q, err: (t: number) => handWorld(t < REACH[1] ? K_EDGE.q : K_PULL.q, "L", U_WIN, 0, H_UQ).distanceTo(new THREE.Vector3(...curtainTarget(t))) });
void ikTable;
const LET_GO: [number, number] = [TURN7[0] - 0.1, TURN7[0] + 0.6];
export const uqRightArm = (t: number, phase: "room" | "hall" | "bath"): Q => {
  if (phase === "room") {
    if (t < W4[1] + 0.2) return swingQ(REST_UQ, 14, (Math.PI * travel(UQ_ROOM, t, W4[0] + 0.7)) / 0.6, walkW(t, W4[0] + 0.7, W4[0] + 1.75), 35);
    if (t < REACH[0]) return REST_UQ; // (the S04 walk ends at W4[0] + 2.2 = 13.6 s, well before the reach)
    if (t < LET_GO[0]) return tCurtain(t);
    return qlerp(tCurtain.last, REST_UQ, ramp(t, LET_GO[0], LET_GO[1]));
  }
  if (phase === "hall") return swingQ(REST_UQ, 8, (Math.PI * travel(UQ_HALL, t, T11 - 1.0)) / 0.54, walkW(t, T11 - 1.0, T11 + 4.8) * (1 - ramp(t, T11 + 1.9, T11 + 2.25) + ramp(t, T11 + 2.65, T11 + 3.0)) * (1 - ramp(t, T11 + 3.4, T11 + 3.8)), 25); // arms in through the doorway
  return REST_UQ;
};
export const CURTAIN_KEYS = { reachErr: K_EDGE.err, pullErr: K_PULL.err };
export const adArms = (t: number, phase: "room" | "hall" | "bath"): { L: Q; R: Q } => {
  if (phase === "room") {
    const w = walkW(t, W4[0] + 0.3, W4[0] + 2.5), ph = (Math.PI * travel(AD_ROOM, t, W4[0] + 0.3)) / 0.42;
    return { L: swingQ(REST_AD, 10, ph, w, 35), R: swingQ(REST_AD, 10, ph + Math.PI, w, 35) };
  }
  if (phase === "hall") {
    const w = walkW(t, T11 - 1.2, T11 + 5.3) * (1 - ramp(t, T11 + 2.1, T11 + 2.5)), ph = (Math.PI * travel(AD_HALL, t, T11 - 1.2)) / 0.41;
    return { L: swingQ(REST_AD, 6, ph, w, 25), R: swingQ(REST_AD, 6, ph + Math.PI, w, 25) };
  }
  return { L: REST_AD, R: REST_AD };
};

// ------------------------------------------------------------------ the phone in his LEFT hand (Ep 3 episode004B.ts
// pattern, generalised to any root/yaw; Ep 3 code unchanged): lowered (EP2_END) → raised reading pose (Q_FRONT)
const HAND_FRONT: C1Hand = { dir: [0, 0.75, 0.66], palm: [-1, 0, 0], curl: 60, w: 0.9 };
const Q_END: Q = [(uqPose.armR as number[])[0], (uqPose.armR as number[])[1], (uqPose.armRFwd as number) ?? 0];
const armPoseR = (q: Q) => ({ armR: [q[0], q[1]] as [number, number], armRFwd: q[2] });
const aimQuat = (p: V3, aim: V3) => {
  const yaw = Math.atan2(aim[0] - p[0], aim[2] - p[2]);
  const pitch = Math.atan2(aim[1] - p[1], Math.hypot(aim[0] - p[0], aim[2] - p[2]));
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-pitch, 0, 0)));
};
const phoneFront = (root: V3, yaw: number, q: Q, tilt = 0.6) => {
  const palm = armChain(armPoseR(q), "R", LAY).H.multiplyScalar(H_UQ).applyAxisAngle(UP, yaw).add(new THREE.Vector3(...root));
  const fwd = fwdV(yaw);
  const p = palm.clone().addScaledVector(fwd, 0.03).add(new THREE.Vector3(0, 0.02, 0));
  return { p: v3(p), q: q4(aimQuat(v3(p), [p.x + fwd.x, p.y - tilt, p.z + fwd.z])) };
};
type PhoneL = { p: THREE.Vector3; q: THREE.Quaternion };
const toHand = (w: { p: V3; q: Q4 }, q: Q, h: C1Hand, root: V3, yaw: number): PhoneL => {
  const hf = handFrame(armPoseR(q), "R", h, root, yaw, H_UQ);
  const inv = hf.q.clone().invert();
  return { p: new THREE.Vector3(...w.p).sub(hf.origin).applyQuaternion(inv), q: inv.clone().multiply(new THREE.Quaternion(...w.q)) };
};
const fromHand = (l: PhoneL, q: Q, h: C1Hand, root: V3, yaw: number) => {
  const hf = handFrame(armPoseR(q), "R", h, root, yaw, H_UQ);
  return { p: v3(l.p.clone().applyQuaternion(hf.q).add(hf.origin)), q: q4(hf.q.clone().multiply(l.q)) };
};
const PH_LOW_L = toHand(EP2_END.phone as { p: V3; q: Q4 }, Q_END, HANDS_END.R, uqEnd.root as V3, uqEnd.yaw);
const PH_HIGH_L = toHand(phoneFront(uqEnd.root as V3, uqEnd.yaw, Q_FRONT), Q_FRONT, HAND_FRONT, uqEnd.root as V3, uqEnd.yaw);
const handMix = (a: C1Hand, b: C1Hand, u: number): C1Hand => {
  const n = (x: V3) => { const l = Math.hypot(...x) || 1; return [x[0] / l, x[1] / l, x[2] / l] as V3; };
  return { dir: n(lerp3(a.dir, b.dir, u)), palm: n(lerp3(a.palm, b.palm, u)), curl: lerp(a.curl ?? 0, b.curl ?? 0, u), w: lerp(a.w ?? 1, b.w ?? 1, u) };
};
const RAISE1 = EV.raise as unknown as [number, number];
const RAISE2: [number, number] = [(EV.vib2 as unknown as number) + 0.58, (EV.vib2 as unknown as number) + 1.28];
/** 0 = lowered, 1 = raised to read */
export const phoneUp = (t: number) => {
  if (t < SH.S11[0]) return ramp(t, RAISE1[0], RAISE1[1]);
  if (t < SH.S13[0]) return 0; // walking: lowered
  return ramp(t, RAISE2[0], RAISE2[1]);
};
const VIBS = [EV.vib1, (EV.vib1 as unknown as number) + 1.0, EV.vib2, (EV.vib2 as unknown as number) + 1.0] as unknown as number[];
export const buzzing = (t: number) => VIBS.some((b) => t >= b && t < b + 0.52);
export const phoneAt = (t: number, root: V3, yaw: number, shake = true) => {
  const up = phoneUp(t);
  const q = qlerp(Q_END, Q_FRONT, up), h = handMix(HANDS_END.R, HAND_FRONT, up);
  const l: PhoneL = { p: PH_LOW_L.p.clone().lerp(PH_HIGH_L.p, up), q: PH_LOW_L.q.clone().slerp(PH_HIGH_L.q, up) };
  const ph = fromHand(l, q, h, root, yaw);
  const b = shake && buzzing(t) ? 0.002 * Math.sin(t * 2 * Math.PI * 18) : 0;
  return { p: [ph.p[0] + b, ph.p[1], ph.p[2]] as V3, q: ph.q, arm: q, hand: h };
};
/** the lock screen lights on the first buzz; off while walking; on again on the second buzz */
export const glowAt = (t: number) => (t < SH.S11[0] ? ramp(t, EV.vib1, (EV.vib1 as unknown as number) + 0.1) : t < SH.S13[0] ? 0 : ramp(t, EV.vib2, (EV.vib2 as unknown as number) + 0.1));

// ------------------------------------------------------------------ characters
export type MChar5 = { who: "uq" | "adik"; root: V3; yaw: number; height: number; pose: Record<string, unknown>; legPose?: unknown; hands?: unknown; face: Record<string, unknown>; feet?: { L: V3; R: V3 } };
const breath = (t: number, a: number, hz: number, ph: number) => a * Math.sin(t * 2 * Math.PI * hz + ph);
/** N06 word timing by character share (ASUMSI, as Ep 3): "atau" ≈ second burst start */
const N06_B2 = VOP.N06.speech.length > 1 ? VOP.N06.speech[1][0] : VOP.N06.at + 2.2;
export const charsAt = (t: number) => {
  const phase = phaseOf(t);
  let u: { root: V3; yaw: number; legPose?: unknown; feet?: { L: V3; R: V3 } }, a: typeof u;
  if (phase === "bath") {
    u = { root: U_BATH, yaw: BATH_YAW, legPose: uqEnd.legPose };
    a = { root: A_BATH, yaw: BATH_YAW, legPose: adEnd.legPose };
  } else {
    const mu = movesAt(MOVES[phase].uq, t), ma = movesAt(MOVES[phase].adik, t);
    u = { root: mu.root, yaw: mu.yaw, legPose: mu.legPose, feet: mu.feetWorld };
    a = { root: ma.root, yaw: ma.yaw, legPose: ma.legPose, feet: ma.feetWorld };
  }
  const qR = uqRightArm(t, phase);
  const ph = phoneAt(t, u.root, u.yaw);
  // ---- heads
  let uy = 0, un = 0, ay = 0, an = 0;
  if (phase === "room") {
    // S04: Uq looks ahead along the walk then at the curtain gap; adik looks at Uq then at the window
    const gap = ramp(t, W4[0] + 1.6, W4[0] + 2.3);
    uy = lerp(0, -8, gap); un = lerp(0, 2, gap);
    ay = 12 * ramp(t, W4[0] + 2.6, W4[0] + 3.1); an = -4;
    // S07 → S08: after the turn both look down at the phone; S10 "Nomornya sama": Uq's eyes up briefly
    const ph1 = ramp(t, EV.vib1 as unknown as number, (EV.vib1 as unknown as number) + 0.45);
    uy = lerp(uy, 10, ph1); un = lerp(un, 26, ph1);
    const adRead = ramp(t, (EV.vib1 as unknown as number) + 0.25, (EV.vib1 as unknown as number) + 1.05);
    ay = lerp(ay, -30, adRead); an = lerp(an, 16, adRead);
    const sama = ramp(t, VOP.N04.at + 0.3, VOP.N04.at + 0.75);
    uy = lerp(uy, -20, sama); un = lerp(un, 4, sama);
    un += breath(t, 1.2, 0.28, 0); an += breath(t, 1.0, 0.31, 1.3);
  } else if (phase === "hall") {
    uy = 0; un = 2; ay = 0; an = 0;
  } else {
    // S13–S15: heads down to the phone once it is up; adik looks up at Uq on the second half of N06
    const look = phoneUp(t);
    uy = 0; un = lerp(4, 16, look) + breath(t, 1.0, 0.28, 0);
    const toUq = ramp(t, N06_B2, N06_B2 + 0.5);
    ay = lerp(0, -22, toUq); an = lerp(lerp(2, 10, look), -6, toUq) + breath(t, 0.9, 0.31, 1.3);
  }
  const am = adArms(t, phase);
  const uq: MChar5 = {
    who: "uq", root: u.root, yaw: u.yaw, height: H_UQ, legPose: u.legPose, feet: u.feet,
    hands: { L: HANDS_END.L, R: ph.hand },
    pose: { ...uqPose, armL: [qR[0], qR[1]], armLFwd: qR[2], armR: [ph.arm[0], ph.arm[1]], armRFwd: ph.arm[2], headYaw: uy, headNod: un },
    face: { eyes: "open", brows: "worried", mouth: "flat" },
  };
  const ad: MChar5 = {
    who: "adik", root: a.root, yaw: a.yaw, height: H_AD, legPose: a.legPose, feet: a.feet,
    pose: { ...(adEnd.pose as object), armL: [am.L[0], am.L[1]], armLFwd: am.L[2], armR: [am.R[0], am.R[1]], armRFwd: am.R[2], headYaw: ay, headNod: an, lean: phase === "room" ? 3 * ramp(t, (EV.vib1 as unknown as number) + 0.25, (EV.vib1 as unknown as number) + 1.05) : 0 },
    face: { eyes: "open", brows: "worried", mouth: "flat" },
  };
  return { chars: [uq, ad], phone: { p: ph.p, q: ph.q }, glow: glowAt(t) };
};

// ------------------------------------------------------------------ cameras and shot flags
export type Stage5 = { shot: string; cam: Cam; focus: V3; ext: boolean; int: boolean; wild?: "south"; chars: boolean; dim: number; exposure: number; bathDoor: number; gap: number; dark: boolean };
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({ pos: lerp3(a.pos, b.pos, u), look: lerp3(a.look, b.look, u), fov: lerp(a.fov, b.fov, u), roll: 0 });
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
export const S06_CAM = cam([-0.7, 1.5, 2.66], [-1.0, 1.0, 8.0], 44);
const toWorld = (root: V3, yaw: number, local: V3): V3 => { const p = new THREE.Vector3(...local).applyAxisAngle(UP, yaw); return [root[0] + p.x, root[1] + p.y, root[2] + p.z]; };
export const S08_POS: V3 = toWorld(U_WIN, U_ROOM_YAW, [-0.4, 1.2, 0.85]); // front-RIGHT (stills run 1: front-left is where adik stands)
export const BATH_CAM = cam([3.6, 1.25, -3.67], [1.55, 1.12, -3.67], 52);
export const stageAt = (t: number, shot: string): Stage5 => {
  const [a, b] = SH[shot];
  const u = clamp01((t - a) / (b - a));
  const base = { shot, ext: false, int: true, chars: true, dim: 0, exposure: 0, bathDoor: bathDoorAt(t), gap: CURTAIN_GAP(t), dark: false };
  switch (shot) {
    case "S04": {
      // stills run 1: fov 40 from 2.3 m held neither of them (9:16 is narrow); wider and further back, slow push in
      const c = camLerp(cam([-0.62, 1.45, 5.2], [-0.68, 0.95, 1.2], 62), cam([-0.68, 1.42, 4.95], [-0.82, 1.0, 2.0], 50), sm(u));
      return { ...base, cam: c, focus: [-0.62, 1.3, 2.36], wild: "south" };
    }
    // stills run 1: from (−0.12; 1.5; 2.02) his head filled the lens; low and to his left, under his head, past his body
    case "S05": return { ...base, cam: camLerp(cam([0.02, 1.18, 2.64], [-0.86, 1.3, 2.78], 40), cam([0.0, 1.18, 2.64], [-0.88, 1.3, 2.78], 38), u), focus: [-0.86, 1.3, 2.78] };
    case "S06": return { ...base, cam: camLerp(S06_CAM, cam([-0.7, 1.5, 2.64], [-1.0, 1.0, 8.0], 42), u), focus: [-1.0, 1.2, 6.0], ext: true, chars: false };
    // stills run 1: level with his face the window cross sat on it; higher and to the east, so the face is in one pane
    // run 2: the window's transom is at y 1.55 (sets.tsx WindowPane h·0.18); a low lens (1.05) puts the whole face in the
    // lower-east pane, looking up at him through the curtain gap; aimed below the face so it sits above the caption band
    case "S07": return { ...base, cam: camLerp(cam([-0.45, 1.05, 4.05], [-0.62, 1.22, 2.42], 40), cam([-0.45, 1.05, 3.98], [-0.62, 1.22, 2.42], 38), u), focus: [-0.62, 1.5, 2.42], ext: true };
    case "S08":
    case "S09": {
      const tt = shot === "S08" ? t : SH.S08[1];
      const lk = phoneAt(tt, U_WIN, U_ROOM_YAW, false).p;
      return { ...base, cam: cam(S08_POS, lk, 20), focus: lk, dim: shot === "S09" ? 0.55 : 0 };
    }
    case "S10": return { ...base, cam: camLerp(cam([-0.87, 1.4, -0.35], [-0.87, 1.1, 2.29], 40), cam([-0.87, 1.4, -0.2], [-0.87, 1.1, 2.29], 38), sm(u)), focus: [-0.87, 1.3, 2.29] };
    case "S11": return { ...base, cam: camLerp(cam([-0.8, 1.45, 1.0], [-0.8, 1.25, -4.0], 44), cam([-0.8, 1.45, 0.85], [-0.8, 1.25, -4.0], 42), u), focus: [-0.8, 1.2, -2.0] };
    case "S12": return { ...base, cam: camLerp(cam([-3.3, 1.4, -4.0], [0.9, 1.05, -4.0], 46), cam([-3.2, 1.4, -4.0], [0.9, 1.05, -4.0], 45), u), focus: [1.0, 1.1, -4.0] };
    case "S13": return { ...base, cam: BATH_CAM, focus: [1.55, 1.1, -3.67], exposure: -2.0, dark: true };
    case "S14": return { ...base, cam: BATH_CAM, focus: [1.55, 1.1, -3.67], exposure: -2.0, dark: true, dim: 0.55 };
    default: return { ...base, cam: camLerp(BATH_CAM, cam([3.55, 1.25, -3.67], [1.55, 1.12, -3.67], 50), sm(u)), focus: [1.55, 1.1, -3.67], exposure: -1.3, dark: true };
  }
};
export const shotOf = (t: number) => (PLAN.order.find((k) => t >= SH[k][0] - 1e-9 && t < SH[k][1] - 1e-9) ?? "S15");
