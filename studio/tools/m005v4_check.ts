// Episode 4 opening animatic v2: paths against the sofa, coffee table, bedroom door leaf and walls; arm numbers; the tape.
// Run from studio/:
//   npx esbuild tools/m005v2_check.ts --bundle --platform=node --log-level=warning --outfile=out/m005v2_check.cjs && node out/m005v2_check.cjs
// Body model (same as the storyboards): a vertical cylinder about the root (Uq r 0.22, adik r 0.16, y 0–1.2 m), plus the
// shoulder/elbow/hand points of both arms (r 0.04) and the feet (r 0.05). Clearance < 0 = inside the object.
import * as THREE from "three";
import { H_AD, H_UQ } from "../src/ep004/motion004";
import type { V3 } from "../src/inkbeat/types";
import {
  AD_KEYS, AIM, AIM_ROOT, LENS, POLE, POLE_LEAN, TAPE, T_LED, UQ_KEYS, W, adArmAt, adLeftAt, armWorld, c1ArmTorsoDepth, frameAt, uqArmAt,
} from "../src/ep005/open005v4";
import { EP2_END } from "../src/ep004/e004Poses";

type Box = { name: string; min: V3; max: V3 };
const BOXES: Box[] = [
  { name: "sofa (alas)", min: [-3.3, 0, -0.925], max: [-1.5, 0.42, -0.175] },
  { name: "sofa (sandaran)", min: [-3.3, 0, -0.94], max: [-1.5, 0.87, -0.76] },
  { name: "sofa (lengan timur)", min: [-1.66, 0, -0.925], max: [-1.5, 0.6, -0.175] },
  { name: "sofa (bantal)", min: [-3.22, 0.42, -0.82], max: [-1.58, 0.52, -0.2] },
  { name: "meja kopi", min: [-2.9, 0, 0.275], max: [-1.9, 0.45, 0.825] },
  { name: "kipas (dasar+tiang)", min: [-0.2 + 0.55, 0, -0.2 - 0.55], max: [0.2 + 0.55, 1.37, 0.2 - 0.55] },
  { name: "dinding timur ruang tamu (x 0.94)", min: [0.94, 0, -1.0], max: [1.2, 2.7, 3.0] },
  { name: "dinding selatan (z 2.94)", min: [-4.0, 0, 2.94], max: [1.0, 2.7, 3.2] },
  { name: "dinding utara ruang tamu (z -0.94)", min: [-4.0, 0, -1.2], max: [1.0, 2.7, -0.94] },
];
// bedroom door leaf, open 1.35 rad into the living room: hinge (1.0, 0.69) → free edge (0.14, 0.50), 4.5 cm thick, 2.04 m tall
const LEAF_A = new THREE.Vector2(1.0, 0.69), LEAF_B = new THREE.Vector2(0.14, 0.5), LEAF_HALF = 0.0225, LEAF_H = 2.04;
const segDist = (p: THREE.Vector2, a: THREE.Vector2, b: THREE.Vector2) => { const ab = b.clone().sub(a); const t = Math.max(0, Math.min(1, p.clone().sub(a).dot(ab) / ab.lengthSq())); return p.distanceTo(a.clone().addScaledVector(ab, t)); };
const boxDist = (p: V3, r: number, b: Box, yLo = p[1], yHi = p[1]) => {
  if (yHi < b.min[1] || yLo > b.max[1]) return 9;
  const dx = Math.max(b.min[0] - p[0], 0, p[0] - b.max[0]), dz = Math.max(b.min[2] - p[2], 0, p[2] - b.max[2]);
  const inside = dx === 0 && dz === 0;
  if (inside) return -Math.min(p[0] - b.min[0], b.max[0] - p[0], p[2] - b.min[2], b.max[2] - p[2]) - r;
  return Math.hypot(dx, dz) - r;
};
const leafDist = (p: V3, r: number, yLo = p[1], yHi = p[1]) => (yHi < 0 || yLo > LEAF_H ? 9 : segDist(new THREE.Vector2(p[0], p[2]), LEAF_A, LEAF_B) - LEAF_HALF - r);

const f2 = (x: number) => x.toFixed(2), f3 = (x: number) => x.toFixed(3);
const worst: Record<string, { d: number; t: number; part: string }> = {};
const note = (key: string, d: number, t: number, part: string) => { if (!worst[key] || d < worst[key].d) worst[key] = { d, t, part }; };
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
let stepU = 0, stepUt = 0, stepA = 0, stepAt = 0, stepAL = 0, depthU = 0, depthA = 0, minCC = 9, minCCt = 0, vU = 0, vA = 0;
let prev = frameAt(0);
const cross: Record<string, { d: number; t: number }> = { uq: { d: 9, t: 0 }, adik: { d: 9, t: 0 } };
for (let f = 1; f <= Math.round(9.5 * 30); f++) {
  const t = f / 30;
  if ((t >= W.cut[0] - 1e-9 && t < W.cut[1] - 1e-9) || (t - 1 / 30 >= W.cut[0] - 1e-9 && t - 1 / 30 < W.cut[1] - 1e-9)) { prev = frameAt(t); continue; } // hidden by the cut: not checked, not drawn
  const fr = frameAt(t);
  for (const c of fr.chars) {
    const r = c.who === "uq" ? 0.22 : 0.16, h = c.who === "uq" ? H_UQ : H_AD;
    const qs = c.who === "uq" ? { L: uqArmAt(t), R: [(uqEnd.pose as never as { armR: number[] }).armR[0], (uqEnd.pose as never as { armR: number[] }).armR[1], (uqEnd.pose as never as { armRFwd: number }).armRFwd ?? 0] } : { L: adArmAt(t), R: adLeftAt(t) };
    const pts: [V3, number, string][] = [];
    for (const side of ["L", "R"] as const) armWorld(qs[side] as never, side, c.root, c.yaw, h).forEach((p, i) => pts.push([p, 0.04, `${side === "L" ? "lengan kanan" : "lengan kiri"} ${["bahu", "siku", "tangan"][i]}`]));
    pts.push([c.feet.L, 0.05, "kaki L"], [c.feet.R, 0.05, "kaki R"]);
    for (const b of BOXES) {
      note(`${c.who} | ${b.name}`, boxDist(c.root, r, b, 0, 1.2), t, "badan");
      for (const [p, rr, part] of pts) note(`${c.who} | ${b.name}`, boxDist(p, rr, b), t, part);
    }
    { const left = new THREE.Vector3(Math.cos(c.yaw), 0, -Math.sin(c.yaw)); const d = new THREE.Vector3(c.feet.R[0] - c.feet.L[0], 0, c.feet.R[2] - c.feet.L[2]).dot(left) * 100; if (d < cross[c.who].d) cross[c.who] = { d, t }; }
    note(`${c.who} | daun pintu kamar`, leafDist(c.root, r, 0, 1.2), t, "badan");
    for (const [p, rr, part] of pts) note(`${c.who} | daun pintu kamar`, leafDist(p, rr), t, part);
  }
  const [u, a] = fr.chars, [pu, pa] = prev.chars;
  const cc = Math.hypot(u.root[0] - a.root[0], u.root[2] - a.root[2]) - 0.38;
  if (cc < minCC) { minCC = cc; minCCt = t; }
  vU = Math.max(vU, Math.hypot(u.root[0] - pu.root[0], u.root[2] - pu.root[2]) * 30);
  vA = Math.max(vA, Math.hypot(a.root[0] - pa.root[0], a.root[2] - pa.root[2]) * 30);
  const q1 = uqArmAt(t), q0 = uqArmAt(t - 1 / 30), a1 = adArmAt(t), a0 = adArmAt(t - 1 / 30), l1 = adLeftAt(t), l0 = adLeftAt(t - 1 / 30);
  const s1 = Math.hypot(q1[0] - q0[0], q1[1] - q0[1], q1[2] - q0[2]), s2 = Math.hypot(a1[0] - a0[0], a1[1] - a0[1], a1[2] - a0[2]), s3 = Math.hypot(l1[0] - l0[0], l1[1] - l0[1], l1[2] - l0[2]);
  if (s1 > stepU) { stepU = s1; stepUt = t; }
  if (s2 > stepA) { stepA = s2; stepAt = t; }
  stepAL = Math.max(stepAL, s3);
  depthU = Math.max(depthU, c1ArmTorsoDepth(q1 as never, "L", H_UQ) * 100);
  depthA = Math.max(depthA, c1ArmTorsoDepth(a1 as never, "L", H_AD) * 100);
  prev = fr;
}
console.log("== Clearance (m; < 0 = inside the object; frames hidden by the cut skipped)");
for (const [k, v] of Object.entries(worst).sort((x, y) => x[1].d - y[1].d)) if (v.d < 0.6) console.log(`${v.d < 0 ? "MASUK " : "ok    "} ${k}: ${f3(v.d)} at ${f2(v.t)} s (${v.part})`);
console.log(`foot separation along own left (negative = crossed): Uq ${f2(cross.uq.d)} cm at ${f2(cross.uq.t)} s, adik ${f2(cross.adik.d)} cm at ${f2(cross.adik.t)} s`);
console.log(`Uq-adik body gap min ${f3(minCC)} m at ${f2(minCCt)} s`);
console.log(`root speed max: Uq ${f2(vU)} m/s, adik ${f2(vA)} m/s`);
console.log(`Uq right arm max step ${f2(stepU)} deg/frame at ${f2(stepUt)} s (limit 11.1), in torso max ${f2(depthU)} cm (limit 0.2)`);
console.log(`adik right arm max step ${f2(stepA)} deg/frame at ${f2(stepAt)} s (limit 7.1), in torso max ${f2(depthA)} cm; left arm swing max step ${f2(stepAL)}`);
console.log("\n== Aim and tape");
console.log(`aim root ${AIM_ROOT.map(f3).join(", ")} yaw ${f2((AIM.yaw * 180) / Math.PI)} | hand ${AIM.H.toArray().map(f3).join(", ")} (Uq palm max 1.55 m)`);
console.log(`wall clearance at aim: east ${f3(0.94 - AIM_ROOT[0] - 0.22)} m, south ${f3(2.94 - AIM_ROOT[2] - 0.22)} m`);
for (const [k, v] of Object.entries({ ...UQ_KEYS, ...AD_KEYS })) console.log(`IK ${k}: err ${f3(v.err)} m`);
const fPress = frameAt(W.tape - 0.001);
console.log(`pole tip at press ${fPress.pole.tip.map(f3).join(", ")} | lens ${LENS.map(f3).join(", ")} | tip-to-lens ${f3(new THREE.Vector3(...fPress.pole.tip).distanceTo(new THREE.Vector3(...LENS)))} m (tape gap ${TAPE.gap})`);
const fAfter = frameAt(W.pull[1]);
console.log(`after pull: tip-to-lens ${f3(new THREE.Vector3(...fAfter.pole.tip).distanceTo(new THREE.Vector3(...LENS)))} m; tape on ${fAfter.tape.on}`);
const ledToLens = new THREE.Vector3(...T_LED).distanceTo(new THREE.Vector3(...LENS));
console.log(`LED centre to lens centre ${f3(ledToLens)} m; tape half-width ${TAPE.w / 2}, half-height ${TAPE.h / 2} → LED ${ledToLens > Math.hypot(TAPE.w / 2, TAPE.h / 2) ? "outside the tape (not covered)" : "possibly under the tape"}`);
console.log(`pole leaning ${POLE_LEAN.bottom.join(",")} → ${POLE_LEAN.top.join(",")}, length ${f3(new THREE.Vector3(...POLE_LEAN.top).distanceTo(new THREE.Vector3(...POLE_LEAN.bottom)))} (pole ${POLE.len})`);

// ---- hold and release (pilot v3): the Ep 3 grip, then the hands part
import { Q_HOLD_A, Q_HOLD_U, handWorld } from "../src/ep005/open005v4";
{
  console.log("\n== Hold and release (0.0 .. 1.4 s)");
  for (const t of [0, 0.3, 0.45, 0.6, 0.75, 0.9, 1.2]) {
    const fr = frameAt(t), [u, a] = fr.chars;
    const hu = new THREE.Vector3(...handWorld(uqArmAt(t), "L", u.root, u.yaw, H_UQ).toArray() as V3);
    const ha = new THREE.Vector3(...handWorld(adLeftAt(t), "R", a.root, a.yaw, H_AD).toArray() as V3);
    // each palm vs the other character's body cylinder (r 0.22 / 0.16, 0..1.2 m)
    const dU = Math.hypot(hu.x - a.root[0], hu.z - a.root[2]) - 0.16, dA = Math.hypot(ha.x - u.root[0], ha.z - u.root[2]) - 0.22;
    console.log(`t ${t.toFixed(2)}: palm-to-palm ${hu.distanceTo(ha).toFixed(3)} m | Uq palm to adik body ${dU.toFixed(3)} | adik palm to Uq body ${dA.toFixed(3)}`);
  }
  let mx = 0, mxt = 0, dep = 0;
  for (let f = 1; f <= 60; f++) {
    const t = f / 30, q1 = adLeftAt(t), q0 = adLeftAt(t - 1 / 30);
    const s = Math.hypot(q1[0] - q0[0], q1[1] - q0[1], q1[2] - q0[2]);
    if (s > mx) { mx = s; mxt = t; }
    dep = Math.max(dep, c1ArmTorsoDepth(q1 as never, "R", H_AD) * 100);
  }
  console.log(`adik LEFT arm (hold -> release -> swing): max step ${mx.toFixed(2)} deg/frame at ${mxt.toFixed(2)} s (limit 7.1), in torso max ${dep.toFixed(2)} cm`);
  console.log(`hold keys: Uq ${Q_HOLD_U.map((x) => x.toFixed(1)).join(",")} | adik ${Q_HOLD_A.map((x) => x.toFixed(1)).join(",")}`);
}
// v4: adik's body turn rate and her head, 5.7-7.2 s
{
  let mx = 0, mt = 0, py = frameAt(5.7).chars[1].yaw;
  for (let f = Math.round(5.7 * 30) + 1; f <= Math.round(7.2 * 30); f++) { const y = frameAt(f / 30).chars[1].yaw; let d = Math.abs(y - py) * 180 / Math.PI; if (d > 180) d = 360 - d; if (d > mx) { mx = d; mt = f / 30; } py = y; }
  const e = frameAt(7.2).chars[1];
  console.log(`adik turn: max ${mx.toFixed(2)} deg/frame at ${mt.toFixed(2)} s; end yaw ${(e.yaw * 180 / Math.PI).toFixed(1)} deg, head ${JSON.stringify([ (e.pose as any).headYaw, (e.pose as any).headNod ])}`);
}
