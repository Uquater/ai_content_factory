// Pilot 2026-11-004 v1: per-frame numbers for the moving arms EXACTLY as staged (src/ep004/pilot004Stage.ts):
// own-torso depth (c1ArmTorsoDepth), arm vs the other character (palm on her shoulder / her mouth excluded),
// body vs walls/furniture (STUDIO-WORKFLOW §10 butir 6), joint step per frame, pointing palm error.
// Run from studio/:
//   npx esbuild tools/p004_check.ts --bundle --platform=node --log-level=warning --outfile=out/p004_check.cjs && node out/p004_check.cjs
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { C1_BUILD } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { adikAt, epTime, PILOT_FRAMES, shotAt, uqAt } from "../src/ep004/pilot004Stage";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
type Ch = { root: V3; yaw: number; height: number; pose: Record<string, unknown> };
const W = (c: Ch, p: THREE.Vector3) => p.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
type S = { p: THREE.Vector3; r: number; part: string };
const samples = (c: Ch, who: string): S[] => {
  const out: S[] = [];
  for (let k = 0; k <= 10; k++) {
    const v = 0.02 + (0.96 * k) / 10;
    const rx = Math.abs(teeSurface(0.999, v).p.x), rz = Math.abs(teeSurface(0, v).p.z);
    for (let a = 0; a < 24; a++) { const th = (a / 24) * Math.PI * 2; out.push({ p: W(c, new THREE.Vector3(rx * Math.cos(th), LAY.torsoY0 + v * LAY.torsoH, rz * Math.sin(th))), r: 0, part: `badan ${who}` }); }
  }
  for (const side of ["L", "R"] as const) {
    const { S: sh, E, H } = armChain(c.pose as never, side, LAY);
    const nm = `lengan ${side === "L" ? "kanan" : "kiri"} ${who}`;
    for (let i = 0; i <= 8; i++) out.push({ p: W(c, sh.clone().lerp(E, i / 8)), r: 0.03, part: nm });
    for (let i = 1; i <= 8; i++) out.push({ p: W(c, E.clone().lerp(H, i / 8)), r: who === "adik" && side === "L" ? 0.07 : 0.03, part: nm + (i >= 7 ? " ujung" : "") });
  }
  for (const sx of [-1, 1]) for (let i = 0; i <= 6; i++) out.push({ p: W(c, new THREE.Vector3(sx * 0.045, (LAY.hipY * i) / 6, 0)), r: 0.035, part: `kaki ${who}` });
  const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height));
  out.push({ p: hc, r: (new THREE.Vector3(...stickHeadTop(c.root, c.height)).y - hc.y) * (who === "adik" ? 1.06 : 1), part: `kepala ${who}` });
  return out;
};
const BOXES: { name: string; min: V3; max: V3 }[] = [
  { name: "dinding depan", min: [-4, 0, 2.94], max: [4, 2.7, 3.06] }, { name: "dinding kamar", min: [0.94, 0, -1], max: [1.06, 2.7, 3] },
  { name: "meja tamu", min: [-2.9, 0, 0.275], max: [-1.9, 0.45, 0.825] }, { name: "sofa", min: [-3.3, 0, -0.925], max: [-1.5, 0.92, -0.175] },
  { name: "lemari rendah", min: [-3.94, 0, 0.75], max: [-3.49, 0.8, 2.05] }, { name: "rak sepatu", min: [-3.85, 0, 2.66], max: [-3.25, 0.4, 2.94] },
];
const boxDist = (p: THREE.Vector3, b: { min: V3; max: V3 }) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]), dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]), dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  const o = Math.hypot(dx, dy, dz);
  return o > 0 ? o : -Math.min(p.x - b.min[0], b.max[0] - p.x, p.y - b.min[1], b.max[1] - p.y, p.z - b.min[2], b.max[2] - p.z);
};
const q = (c: Ch, side: "L" | "R") => { const p = c.pose as Record<string, unknown>; const a = p[side === "L" ? "armL" : "armR"] as [number, number]; return [a[0], a[1], (p[side === "L" ? "armLFwd" : "armRFwd"] as number) ?? 0] as [number, number, number]; };
let prevU: number[] | null = null, prevA: number[] | null = null, prevShot = "";
const worst = { torsoU: 0, torsoA: 0, stepU: 0, stepA: 0, armX: Infinity, armXAt: "", wall: Infinity, wallAt: "" };
for (let f = 0; f < PILOT_FRAMES; f++) {
  const t = epTime(f);
  const shot = shotAt(t);
  if (shot === "s01") continue;
  if (shot !== prevShot) { prevU = null; prevA = null; prevShot = shot; } // a cut is not a joint step
  const uq = uqAt(t) as unknown as Ch, ad = adikAt(t) as unknown as Ch;
  const qu = q(uq, "L"), qa = q(ad, "R");
  worst.torsoU = Math.max(worst.torsoU, c1ArmTorsoDepth(qu, "L"));
  worst.torsoA = Math.max(worst.torsoA, c1ArmTorsoDepth(qa, "R", ad.height));
  if (prevU) worst.stepU = Math.max(worst.stepU, ...qu.map((v, k) => Math.abs(v - prevU![k])));
  if (prevA) worst.stepA = Math.max(worst.stepA, ...qa.map((v, k) => Math.abs(v - prevA![k])));
  prevU = qu; prevA = qa;
  const su = samples(uq, "Uq"), sa = samples(ad, "adik");
  for (const a of su) for (const b of sa) {
    if (a.part.startsWith("badan") && b.part.startsWith("badan")) continue;
    if (a.part.includes("lengan kanan Uq ujung") && t > 3.6 && t < 10) continue; // his palm resting on her shoulder
    const d = a.p.distanceTo(b.p) - a.r - b.r;
    if (d < worst.armX) { worst.armX = d; worst.armXAt = `${t.toFixed(2)} s ${a.part} ↔ ${b.part}`; }
  }
  for (const s of [...su, ...sa]) for (const b of BOXES) { const d = boxDist(s.p, b) - s.r; if (d < worst.wall) { worst.wall = d; worst.wallAt = `${t.toFixed(2)} s ${s.part} ↔ ${b.name}`; } }
}
console.log(`lengan kanan Uq di dalam torso (maks): ${(worst.torsoU * 100).toFixed(1)} cm; lengan kiri adik: ${(worst.torsoA * 100).toFixed(1)} cm`);
console.log(`lompatan sendi maks/frame: Uq ${worst.stepU.toFixed(1)}°, adik ${worst.stepA.toFixed(1)}° (batas ~15°)`);
console.log(`Uq ↔ adik terdekat (selain telapak Uq di bahu): ${(worst.armX * 100).toFixed(1)} cm @ ${worst.armXAt}`);
console.log(`tubuh ↔ dinding/benda terdekat: ${(worst.wall * 100).toFixed(1)} cm @ ${worst.wallAt}`);
