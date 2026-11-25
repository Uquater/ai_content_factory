// Episode 3 look-dev v1 QC (2026-11-20): numbers for the S02 fallback pose EXACTLY as rendered (src/ep004/e004Poses.ts),
// plus LED sizes per look-dev camera. Same body sampling as tools/ld003_clearance.ts / tools/e004_mouth_check.ts.
// Run from studio/:
//   npx esbuild tools/e004_lookdev_qc.ts --bundle --platform=node --log-level=warning --outfile=out/e004_lookdev_qc.cjs && node out/e004_lookdev_qc.cjs
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { C1_BUILD } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { S02 } from "../src/ep004/e004Poses";
import { LD004, ledWorld } from "../src/ep004/LookDev004";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
type Ch = { root: V3; yaw: number; height: number; pose: Record<string, unknown> };
const W = (c: Ch, p: THREE.Vector3) => p.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
type S = { p: THREE.Vector3; r: number; part: string };
const samples = (c: Ch, who: "uq" | "adik"): S[] => {
  const out: S[] = [];
  for (let k = 0; k <= 10; k++) {
    const v = 0.02 + (0.96 * k) / 10;
    const rx = Math.abs(teeSurface(0.999, v).p.x), rz = Math.abs(teeSurface(0, v).p.z);
    const y = LAY.torsoY0 + v * LAY.torsoH;
    for (let a = 0; a < 24; a++) { const th = (a / 24) * Math.PI * 2; out.push({ p: W(c, new THREE.Vector3(rx * Math.cos(th), y, rz * Math.sin(th))), r: 0, part: "badan" }); }
  }
  for (const side of ["L", "R"] as const) {
    const { S: sh, E, H } = armChain(c.pose as never, side, LAY);
    const nm = who === "uq" ? (side === "L" ? "lengan kanan Uq" : "lengan kiri Uq") : side === "L" ? "lengan kanan adik + jaket" : "lengan kiri adik";
    for (let i = 0; i <= 8; i++) out.push({ p: W(c, sh.clone().lerp(E, i / 8)), r: 0.03, part: nm });
    for (let i = 1; i <= 8; i++) out.push({ p: W(c, E.clone().lerp(H, i / 8)), r: who === "adik" && side === "L" ? 0.07 : 0.03, part: nm + (i >= 7 ? " (ujung)" : "") });
  }
  for (const sx of [-1, 1]) { for (let i = 0; i <= 6; i++) out.push({ p: W(c, new THREE.Vector3(sx * 0.045, (LAY.hipY * i) / 6, 0)), r: 0.035, part: "kaki" }); out.push({ p: W(c, new THREE.Vector3(sx * 0.045, 0.03, 0.07)), r: 0.05, part: "sepatu" }); }
  const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height)), ht = new THREE.Vector3(...stickHeadTop(c.root, c.height));
  out.push({ p: hc, r: (ht.y - hc.y) * (who === "adik" ? 1.06 : 1), part: "kepala" });
  return out;
};
const BOXES: { name: string; min: V3; max: V3 }[] = [
  { name: "dinding depan (z 3,0)", min: [-4, 0, 2.94], max: [4, 2.7, 3.06] },
  { name: "dinding kamar (x 1,0)", min: [0.94, 0, -1], max: [1.06, 2.7, 3] },
  { name: "dinding barat (x −4)", min: [-4.06, 0, -5], max: [-3.94, 2.7, 3] },
  { name: "meja tamu", min: [-2.9, 0, 0.275], max: [-1.9, 0.45, 0.825] },
  { name: "sofa", min: [-3.3, 0, -0.925], max: [-1.5, 0.92, -0.175] },
  { name: "lemari rendah barat", min: [-3.94, 0, 0.75], max: [-3.49, 0.8, 2.05] },
  { name: "rak sepatu", min: [-3.85, 0, 2.66], max: [-3.25, 0.4, 2.94] },
];
const boxDist = (p: THREE.Vector3, b: { min: V3; max: V3 }) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]), dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]), dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  const o = Math.hypot(dx, dy, dz);
  return o > 0 ? o : -Math.min(p.x - b.min[0], b.max[0] - p.x, p.y - b.min[1], b.max[1] - p.y, p.z - b.min[2], b.max[2] - p.z);
};
const uq = S02.uq as unknown as Ch, ad = S02.adik as unknown as Ch;
const qU = S02.q.uq as [number, number, number], qA = S02.q.adik as [number, number, number];
console.log(`S02 cadangan (seperti dirender): Uq akar (${uq.root[0].toFixed(2)}, ${uq.root[2].toFixed(2)}), adik akar (${ad.root[0].toFixed(2)}, ${ad.root[2].toFixed(2)}), jarak ${Math.hypot(uq.root[0] - ad.root[0], uq.root[2] - ad.root[2]).toFixed(2)} m`);
console.log(`  tangan kiri adik → mulut: galat ${(S02.err.adik * 100).toFixed(1)} cm, siku ${qA[1].toFixed(0)}°, lengan-dalam-torso ${(c1ArmTorsoDepth(qA, "R", ad.height) * 100).toFixed(1)} cm`);
console.log(`  tangan kanan Uq → bahu kiri adik: galat ${(S02.err.uq * 100).toFixed(1)} cm, siku ${qU[1].toFixed(0)}°, lengan-dalam-torso ${(c1ArmTorsoDepth(qU, "L") * 100).toFixed(1)} cm`);
const su = samples(uq, "uq"), sa = samples(ad, "adik");
let ua = { d: Infinity, a: "", b: "" };
for (const a of su) for (const b of sa) {
  if (a.part === "badan" && b.part === "badan") continue;
  const d = a.p.distanceTo(b.p) - a.r - b.r;
  if (a.part.includes("(ujung)") && a.part.startsWith("lengan kanan Uq")) continue; // the palm rests on her (contact)
  if (d < ua.d) ua = { d, a: a.part, b: b.part };
}
let bb = Infinity; for (const a of su) for (const b of sa) if (a.part === "badan" || a.part === "kepala") if (b.part === "badan" || b.part === "kepala") bb = Math.min(bb, a.p.distanceTo(b.p) - a.r - b.r);
console.log(`  Uq ↔ adik (kecuali telapak Uq yang memang menyentuh bahu): ${(ua.d * 100).toFixed(1)} cm (${ua.a} ↔ ${ua.b}); badan/kepala ↔ badan/kepala ${(bb * 100).toFixed(1)} cm`);
for (const [who, ss] of [["Uq", su], ["adik", sa]] as const) {
  let best = { d: Infinity, part: "", box: "" };
  for (const s of ss) for (const b of BOXES) { const d = boxDist(s.p, b) - s.r; if (d < best.d) best = { d, part: s.part, box: b.name }; }
  console.log(`  ${who} ↔ dinding/benda terdekat: ${(best.d * 100).toFixed(1)} cm (${best.part} ↔ ${best.box}) ${best.d < 0 ? "TEMBUS" : best.d < 0.03 ? "MEPET" : "ok"}`);
}
// LED sizes in each look-dev camera
console.log("\nukuran di layar (1080 × 1920):");
for (const [id, v] of Object.entries(LD004)) {
  for (const k of Object.keys(v.leds) as ("T" | "D" | "L" | "K")[]) {
    const p = ledWorld(k);
    const d = new THREE.Vector3(...p).distanceTo(new THREE.Vector3(...v.cam.pos));
    const pxPerM = 1920 / (2 * d * Math.tan((v.cam.fov * Math.PI) / 360));
    console.log(`  ${id}: LED ${k} jarak ${d.toFixed(2)} m → badan kamera ${k === "L" ? "Ø3 cm" : "5 cm"} = ${((k === "L" ? 0.03 : 0.05) * pxPerM).toFixed(0)} px, inti LED ${((k === "L" ? 0.003 : 0.005) * pxPerM).toFixed(1)} px, halo 22 px`);
  }
  if (v.knob !== undefined) { const d = new THREE.Vector3(-1.15, 1.0, -4.955).distanceTo(new THREE.Vector3(...v.cam.pos)); const pxPerM = 1920 / (2 * d * Math.tan((v.cam.fov * Math.PI) / 360)); console.log(`  ${id}: kenop Ø6,1 cm = ${(0.061 * pxPerM).toFixed(0)} px (${((0.061 * pxPerM) / 19.2).toFixed(0)} % tinggi), slot 2,2 cm = ${(0.022 * pxPerM).toFixed(0)} px`); }
}
