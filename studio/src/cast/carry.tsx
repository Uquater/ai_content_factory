// IbuGendong (2026-11-16, Content Unit 2026-11-002, L8 "Ada yang menggendong anaknya"): IBU carrying BALITA in a kain
// gendongan. One static pose (no animation): the toddler sits in the sling's pouch in front of the mother's left hip,
// facing forward and turned a little toward her; the sling runs over the mother's RIGHT shoulder, diagonally across her
// chest and back; the mother's LEFT forearm ("R" chain, +x) supports the toddler from below (IK + elbow swivel out so
// the elbow clears her torso). Everything is in the mother's local frame (soles at 0, facing +z), wrapped in one group.
// Numbers are checked by `carryCheck()` + `carryContacts()` (runner: studio/tools/cast_check.ts) and by stills from
// several angles.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Inked } from "../inkbeat/char/Inked";
import { charMat } from "../inkbeat/char/material";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import { solveArm } from "../inkbeat/core/ik";
import type { V3 } from "../inkbeat/types";
import { C1_BUILD, STICK_INK_W, stickHip, stickSeatedRoot, teeSurface } from "../c1/C1";
import { c1Swivel } from "../c1/c1rig";
import { BALITA, IBU, Npc, stripGeo, teeAtX, teeTopAt } from "./npc";
import type { NpcPreset } from "./npc";

const L = layoutOf(C1_BUILD);
const W = STICK_INK_W;
// carry layout numbers (metres, mother frame), tuned with carryCheck() and stills (2026-11-16)
let SEAT: V3 = [0.27, 0.79, 0.07];
let KID_YAW = -0.5;
let HAND: V3 = [0.0, -0.095, -0.02];
let SWIVEL = 55;
/** the toddler's arm pose in the carry (hands resting forward over its lap, clear of the sling; head turned a little to camera) */
let KID_POSE = { armL: [4, 34] as [number, number], armLFwd: 50, armR: [4, 34] as [number, number], armRFwd: 50, headYaw: 18 };
/** for tuning from tools only */
export const setCarryTuning = (o: { seat?: V3; kidYaw?: number; hand?: V3; swivel?: number; kidPose?: typeof KID_POSE }) => {
  KID_POSE = o.kidPose ?? KID_POSE;
  SEAT = o.seat ?? SEAT;
  KID_YAW = o.kidYaw ?? KID_YAW;
  HAND = o.hand ?? HAND;
  SWIVEL = o.swivel ?? SWIVEL;
};

/** the carry layout in the mother's frame (metres) for a mother / toddler preset pair */
export const carryLayout = (mom: NpcPreset = IBU, kid: NpcPreset = BALITA) => {
  const hm = mom.height;
  const hk = kid.height;
  // hip carry: the toddler's seat (its tee hem) beside the mother's left hip, on her forearm, about elbow height;
  // beside her (not in front), so its head does not cover her face from the front
  const seat: V3 = SEAT;
  const kidYaw = KID_YAW; // turned toward the mother
  const kidRoot = stickSeatedRoot(seat, hk, kid.proportions);
  const kidFloor = seat[1] - 0.16; // the toddler's feet dangle (sitFloor)
  // the mother's left hand ("R" chain) under the toddler's seat, toward its front: the toddler sits on her forearm
  const hand: V3 = [seat[0] + HAND[0], seat[1] + HAND[1], seat[2] + HAND[2]];
  const ik = solveArm({ position: [0, 0, 0], yaw: 0, side: "R", target: hand, height: hm, build: C1_BUILD });
  const momPose = { ...(mom.pose ?? {}), armR: ik.arm, armRFwd: ik.fwd, swivelR: SWIVEL } as NonNullable<React.ComponentProps<typeof Npc>["pose"]>;
  return { hm, hk, seat, kidYaw, kidRoot, kidFloor, hand, ik, momPose };
};

/** numeric clearance checks (metres; negative = penetration) for the carry pose */
export const carryCheck = (mom: NpcPreset = IBU, kid: NpcPreset = BALITA) => {
  const c = carryLayout(mom, kid);
  const pose = c.momPose as Parameters<typeof armChain>[0] & { swivelR?: number };
  const ch = armChain(pose, "R", L);
  const E = c1Swivel(ch.S, ch.E, ch.H, 1, pose.swivelR ?? 0);
  const w = (p: THREE.Vector3) => p.clone().multiplyScalar(c.hm);
  const S = w(ch.S);
  const Ew = w(E);
  const Hw = w(ch.H);
  // the mother's torso as an elliptic cylinder per height (tee surface, metres)
  const momInside = (p: THREE.Vector3) => {
    const v = (p.y / c.hm - L.torsoY0) / L.torsoH;
    if (v < 0 || v > 1) return -1;
    const rx = Math.abs(teeSurface(0.999, v).p.x) * c.hm;
    const rz = Math.abs(teeSurface(0, v).p.z) * c.hm;
    return 1 - Math.hypot(p.x / rx, p.z / rz); // > 0 = inside
  };
  // the toddler's torso as an ellipsoid-ish box around its tee (metres)
  const kHem = c.seat[1];
  const kTop = kHem + L.torsoH * c.hk;
  const kRx = Math.abs(teeSurface(0.999, 0.5).p.x) * c.hk;
  const kRz = Math.abs(teeSurface(0, 0.5).p.z) * c.hk;
  const cy = Math.cos(-c.kidYaw);
  const sy = Math.sin(-c.kidYaw);
  const kidInside = (p: THREE.Vector3) => {
    if (p.y < kHem - 0.01 || p.y > kTop) return -1;
    const dx = p.x - c.seat[0];
    const dz = p.z - c.seat[2];
    const lx = dx * cy - dz * sy;
    const lz = dx * sy + dz * cy;
    return 1 - Math.hypot(lx / kRx, lz / kRz);
  };
  let worstMom = -Infinity;
  let worstKid = -Infinity;
  const seg = (a: THREE.Vector3, b: THREE.Vector3, skipStart = 0) => {
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      if (u < skipStart) continue;
      const p = a.clone().lerp(b, u);
      worstMom = Math.max(worstMom, momInside(p));
      worstKid = Math.max(worstKid, kidInside(p));
    }
  };
  seg(S, Ew, 0.35); // the shoulder joint itself sits inside the sleeve/torso by design
  seg(Ew, Hw);
  // the toddler's torso boundary (its tee, at 5 heights × 24 angles) against the mother's torso
  let kidInMom = -Infinity;
  for (let k = 0; k <= 4; k++)
    for (let j = 0; j < 24; j++) {
      const a = (j / 24) * Math.PI * 2;
      const lx = Math.cos(a) * kRx;
      const lz = Math.sin(a) * kRz;
      const p = new THREE.Vector3(c.seat[0] + lx * cy + lz * sy, kHem + (k / 4) * (kTop - kHem), c.seat[2] - lx * sy + lz * cy);
      kidInMom = Math.max(kidInMom, momInside(p));
    }
  return { ikErr: c.ik.err, elbow: Ew.toArray().map((v) => +v.toFixed(3)), hand: Hw.toArray().map((v) => +v.toFixed(3)), worstMomInside: +worstMom.toFixed(3), worstKidInside: +worstKid.toFixed(3), kidTorsoInMom: +kidInMom.toFixed(3) };
};

/** the kain gendongan: one strip over the mother's right shoulder (back → shoulder → chest → pouch under the toddler)
 * and one from the pouch's outer side around her left flank to the back */
const slingPaths = (c: ReturnType<typeof carryLayout>) => {
  const hm = c.hm;
  const thick = 0.0075; // h units on the mother
  const out = 0.007 + thick / 2;
  const toW = (p: THREE.Vector3) => new THREE.Vector3(p.x * hm, (p.y + L.torsoY0) * hm, p.z * hm);
  const surf = (x: number, v: number, zs: 1 | -1) => {
    const p = teeAtX(x, v, zs, out);
    if (!p) throw new Error(`sling point off the tee: x=${x} v=${v}`);
    const n = new THREE.Vector3(p.x, 0, p.z / 0.72).normalize();
    return { p: toW(p), n };
  };
  const top = (x: number) => ({ p: toW(new THREE.Vector3(x, teeTopAt(x) + out, 0)), n: new THREE.Vector3(0, 1, 0) });
  const [sx, sy, sz] = c.seat;
  // 1) a sash: a closed loop around the mother's torso, over her RIGHT shoulder and under her LEFT arm at the toddler's
  //    seat height (smooth surface normals, so the band never twists)
  const vSeat = (sy / hm - L.torsoY0) / L.torsoH;
  const flank = (zs: 1 | -1, dz: number) => {
    const q = teeSurface(0.97, vSeat, out);
    return { p: toW(new THREE.Vector3(q.p.x, q.p.y, zs * Math.abs(q.p.z) + dz)), n: new THREE.Vector3(q.n.x, 0, q.n.z * zs).normalize() };
  };
  const loop = [
    top(-0.056),
    surf(-0.05, 0.88, 1),
    surf(-0.02, 0.76, 1),
    surf(0.03, 0.64, 1),
    surf(0.07, vSeat + 0.03, 1),
    flank(1, 0),
    flank(-1, 0),
    surf(0.07, vSeat + 0.03, -1),
    surf(0.03, 0.64, -1),
    surf(-0.02, 0.76, -1),
    surf(-0.05, 0.88, -1),
    top(-0.056),
  ];
  // 2) the pouch: a U under the toddler's seat, hanging from the sash at her left flank (inner edge) and rising on the
  //    toddler's outer side; its width runs along the toddler's front-back axis, its normal points at the seat centre
  const cyk = Math.cos(c.kidYaw);
  const syk = Math.sin(c.kidYaw);
  const kx = (lx: number, ly: number): THREE.Vector3 => new THREE.Vector3(sx + lx * cyk, sy + ly, sz - lx * syk);
  const ctr = new THREE.Vector3(sx, sy + 0.04, sz);
  const U = [
    [-0.097, 0.006],
    [-0.084, -0.024],
    [-0.04, -0.044],
    [0, -0.05],
    [0.04, -0.044],
    [0.084, -0.024],
    [0.1, 0.01],
  ].map(([lx, ly]) => {
    const p = kx(lx, ly);
    return { p, n: ctr.clone().sub(p).normalize().negate() };
  });
  return { strips: [{ pts: loop, width: 0.085 }, { pts: U, width: 0.115 }], thick: thick * hm };
};
type SlingPts = { p: THREE.Vector3; n: THREE.Vector3 }[];
/** the width axis the strip uses at curve parameter u (same rule as the drawn geometry) */
const slingAxis = (pts: SlingPts) => (u: number, T: THREE.Vector3) => {
  const k = Math.min(pts.length - 1, Math.max(0, Math.round(u * (pts.length - 1))));
  return new THREE.Vector3().crossVectors(T, pts[k].n);
};
const slingGeos = (c: ReturnType<typeof carryLayout>) => {
  const sp = slingPaths(c);
  return sp.strips.map((st) => stripGeo(st.pts.map((q) => q.p), slingAxis(st.pts), st.width, sp.thick, 72, 16));
};

export const SLING = { color: "#7d5a6e", dark: "#5f4254" };

/** contact checks beyond carryCheck (metres; > 0 = overlap depth, < 0 = clearance): the sling plates against the
 * mother's forearm and hand, the toddler's legs and hands; the mother's hand against the toddler's legs; the toddler's
 * legs against the mother's torso. Limbs are their stick radius; oval hands are spheres of their half-width. */
export const carryContacts = (mom: NpcPreset = IBU, kid: NpcPreset = BALITA) => {
  const c = carryLayout(mom, kid);
  const sp = slingPaths(c);
  const halfT = sp.thick / 2;
  // sling samples with their local frames
  const plates: { c: THREE.Vector3; T: THREE.Vector3; A: THREE.Vector3; N: THREE.Vector3; step: number; halfW: number }[] = [];
  for (const st of sp.strips) {
    const curve = new THREE.CatmullRomCurve3(st.pts.map((q) => q.p), false, "centripetal");
    const n = 300;
    const step = curve.getLength() / n;
    const ax = slingAxis(st.pts);
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const T = curve.getTangentAt(u).normalize();
      const A = ax(u, T);
      A.addScaledVector(T, -A.dot(T)).normalize();
      plates.push({ c: curve.getPointAt(u), T, A, N: new THREE.Vector3().crossVectors(T, A).normalize(), step, halfW: st.width / 2 });
    }
  }
  const vsSling = (p: THREE.Vector3, rad: number) => {
    let worst = -Infinity;
    for (const pl of plates) {
      const d = p.clone().sub(pl.c);
      if (Math.abs(d.dot(pl.T)) > pl.step) continue;
      if (Math.abs(d.dot(pl.A)) > pl.halfW + rad) continue;
      worst = Math.max(worst, halfT + rad - Math.abs(d.dot(pl.N)));
    }
    return worst;
  };
  const along = (a: THREE.Vector3, b: THREE.Vector3, n = 40) => Array.from({ length: n + 1 }, (_, i) => a.clone().lerp(b, i / n));
  // the mother's left arm ("R" chain) in metres (mother frame)
  const pose = c.momPose as Parameters<typeof armChain>[0] & { swivelR?: number };
  const ch = armChain(pose, "R", L);
  const E = c1Swivel(ch.S, ch.E, ch.H, 1, pose.swivelR ?? 0).multiplyScalar(c.hm);
  const H = ch.H.clone().multiplyScalar(c.hm);
  const fore = H.clone().sub(E).normalize();
  const momLimbR = 0.0046 * c.hm;
  const momHandR = 0.023 * c.hm; // oval hand half-width
  const momHand = along(H.clone().addScaledVector(fore, -0.012 * c.hm), H.clone().addScaledVector(fore, 0.03 * c.hm), 12);
  // the toddler (its own frame → mother frame)
  const kq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), c.kidYaw);
  const kidW = (p: THREE.Vector3) => p.clone().multiplyScalar(c.hk).applyQuaternion(kq).add(new THREE.Vector3(...c.kidRoot));
  const { hipY } = stickHip(kid.proportions);
  const legK = kid.proportions?.legK ?? 1;
  const floorLocal = (c.kidFloor - c.kidRoot[1]) / c.hk;
  const legs = ([-1, 1] as const).map((s) => {
    const hx = s * 0.14 * (C1_BUILD.torsoWidth ?? 1) * 0.42;
    const hip = new THREE.Vector3(hx, hipY, 0);
    const knee = new THREE.Vector3(hx * 1.15, hipY - 0.01, 0.17 * legK);
    const ankle = new THREE.Vector3(s * 0.055, floorLocal + 0.012, 0.19 * legK);
    const pts = new THREE.CatmullRomCurve3([hip, hip.clone().lerp(knee, 0.6).setY(hipY - 0.004), knee, knee.clone().lerp(ankle, 0.5).setZ(0.185 * legK), ankle], false, "centripetal").getPoints(40);
    // the hip end sits inside the toddler's tee by design: test from the hem down / forward
    return pts.filter((p) => p.y < L.torsoY0 + stickHip(kid.proportions).dy).map(kidW);
  });
  const kidLimbR = 0.0046 * 1.05 * c.hk;
  const LA = layoutOf({ ...C1_BUILD, armLength: (C1_BUILD.armLength ?? 1) * (kid.proportions?.armK ?? 1) });
  const kidHands = (["L", "R"] as const).map((side) => {
    const hh = armChain(KID_POSE, side, LA).H.clone().add(new THREE.Vector3(0, stickHip(kid.proportions).dy, 0));
    return kidW(hh);
  });
  const kidHandR = 0.023 * c.hk;
  const maxOf = (xs: number[]) => xs.reduce((a, b) => Math.max(a, b), -Infinity);
  const segDist = (pts: THREE.Vector3[], qs: THREE.Vector3[]) => {
    let m = Infinity;
    for (const p of pts) for (const q of qs) m = Math.min(m, p.distanceTo(q));
    return m;
  };
  const momInside = (p: THREE.Vector3) => {
    const v = (p.y / c.hm - L.torsoY0) / L.torsoH;
    if (v < 0 || v > 1) return -1;
    const rx = Math.abs(teeSurface(0.999, v).p.x) * c.hm;
    const rz = Math.abs(teeSurface(0, v).p.z) * c.hm;
    return 1 - Math.hypot(p.x / rx, p.z / rz);
  };
  const r3 = (v: number) => +v.toFixed(4);
  const S = ch.S.clone().multiplyScalar(c.hm);
  // the toddler's tee surface (5 heights × 24 angles) against the sling
  const kRx = Math.abs(teeSurface(0.999, 0.5).p.x) * c.hk;
  const kRz = Math.abs(teeSurface(0, 0.5).p.z) * c.hk;
  const kidSkin: THREE.Vector3[] = [];
  for (let k = 0; k <= 4; k++)
    for (let j = 0; j < 24; j++) {
      const a = (j / 24) * Math.PI * 2;
      const lx = Math.cos(a) * kRx;
      const lz = Math.sin(a) * kRz;
      const cyy = Math.cos(c.kidYaw);
      const syy = Math.sin(c.kidYaw);
      kidSkin.push(new THREE.Vector3(c.seat[0] + lx * cyy + lz * syy, c.seat[1] + 0.004 + (k / 4) * L.torsoH * c.hk * 0.9, c.seat[2] - lx * syy + lz * cyy));
    }
  return {
    momForearmVsSling: r3(maxOf(along(E, H).map((p) => vsSling(p, momLimbR)))),
    momHandVsSling: r3(maxOf(momHand.map((p) => vsSling(p, momHandR)))),
    momHandVsKidLegs: r3(momHandR + kidLimbR - segDist(momHand, legs.flat())),
    kidLegsVsSling: r3(maxOf(legs.flat().map((p) => vsSling(p, kidLimbR)))),
    kidHandsVsSling: r3(maxOf(kidHands.map((p) => vsSling(p, kidHandR)))),
    kidLegsInMomTorso: r3(maxOf(legs.flat().map(momInside))),
    kidHandsInMomTorso: r3(maxOf(kidHands.map(momInside))),
    kidTorsoVsSling: r3(maxOf(kidSkin.map((p) => vsSling(p, 0)))),
    momUpperArmVsSling: r3(maxOf(along(S.clone().lerp(E, 0.35), E).map((p) => vsSling(p, momLimbR * 1.6)))),
  };
};

/** walking support (D-027): the whole carry group moves (position includes the body bob); the mother's legs come from
 * `legPose` (feet compensate the bob, so they stay planted); her free arm ("L", her right) may swing; her carrying
 * arm, the toddler and the sling stay rigid with her, so the support and the contacts checked above hold. */
export type CarryMotion = { legPose?: React.ComponentProps<typeof Npc>["legPose"]; armL?: [number, number]; armLFwd?: number; headYaw?: number; headNod?: number; kidHeadYaw?: number; kidHeadNod?: number; face?: React.ComponentProps<typeof Npc>["face"] };
/** mom / kid: optional preset overrides (2026-11-17: the bodied D-031 looks); defaults IBU / BALITA as before */
export const IbuGendong: React.FC<{ position: V3; yaw?: number; t?: number; faceCamera?: V3; motion?: CarryMotion; mom?: NpcPreset; kid?: NpcPreset }> = ({ position, yaw = 0, t, motion, mom = IBU, kid = BALITA }) => {
  const c = useMemo(() => carryLayout(mom, kid), [mom, kid]);
  const geos = useMemo(() => slingGeos(c), [c]);
  const mat = charMat(SLING.color, { spec: 0.08 });
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <Npc
        preset={mom}
        position={[0, 0, 0]}
        yaw={0}
        t={t}
        legPose={motion?.legPose}
        pose={{ ...c.momPose, ...(motion?.armL ? { armL: motion.armL, armLFwd: motion.armLFwd ?? 0 } : {}), headYaw: motion?.headYaw ?? 0, headNod: motion?.headNod ?? 0 }}
        face={motion?.face ?? { mouth: "soft" }}
      />
      <Npc
        preset={kid}
        position={c.kidRoot}
        yaw={c.kidYaw}
        sitFloor={c.kidFloor}
        t={t}
        pose={{ ...KID_POSE, headYaw: KID_POSE.headYaw + (motion?.kidHeadYaw ?? 0), headNod: motion?.kidHeadNod ?? 0 }}
      />
      {geos.map((g, i) => (
        <Inked key={i} geo={g} mat={mat} ink={W * 0.55 * c.hm} under={0.3} receive={false} />
      ))}
    </group>
  );
};
