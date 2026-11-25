// Clearance check (fixed QC step, owner 2026-11-17): minimum distance from each character's body to the set's walls and
// objects, for every look-dev still of 2026-11-003. Negative = the body is INSIDE a wall/object (clipping).
// The body is sampled from the same rig the renderer uses (armChain on C1's layout, tee surface radii, head centre),
// at each character's height; each sample carries a radius (arm tube, hand, head, leg, foot).
// Run from studio/:
//   npx esbuild tools/ld003_clearance.ts --bundle --platform=node --log-level=warning --outfile=out/ld003_clearance.cjs && node out/ld003_clearance.cjs
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { C1_BUILD } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { ADIK_HEIGHT, ADIK_REST, LD003_V2, NORTH } from "../src/ep003/ld003Scene";
import type { Char } from "../src/ep003/ld003Scene";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
type Box = { name: string; min: V3; max: V3 };
const H = 2.7;
// geo.ts walls (thickness 0.12, centred on their lines) and the objects near the action
const BOXES: Box[] = [
  { name: "dinding barat lorong", min: [-1.46, 0, -3.2], max: [-1.34, H, -1.0] },
  { name: "dinding timur lorong", min: [-0.26, 0, -3.2], max: [-0.14, H, -1.0] },
  { name: "dinding utara ruang tamu (barat bukaan)", min: [-4.0, 0, -1.06], max: [-1.4, H, -0.94] },
  { name: "dinding utara ruang tamu (timur bukaan)", min: [-0.2, 0, -1.06], max: [1.0, H, -0.94] },
  { name: "ambang atas bukaan lorong", min: [-1.4, 2.2, -1.06], max: [-0.2, H, -0.94] },
  { name: "dinding dapur-lorong (barat)", min: [-4.0, 0, -3.26], max: [-1.4, H, -3.14] },
  { name: "dinding dapur-lorong (timur)", min: [-0.2, 0, -3.26], max: [1.0, H, -3.14] },
  { name: "dinding utara (pintu belakang)", min: [-4.0, 0, -5.06], max: [1.0, H, -4.98] },
  { name: "gerendel", min: [-1.27, 1.05, -4.98], max: [-0.88, 1.17, -4.93] },
  { name: "meja dapur", min: [-3.8, 0, -4.94], max: [-1.6, 0.9, -4.32] },
];

type S = { p: THREE.Vector3; r: number; part: string };
const toWorld = (c: Char, local: THREE.Vector3) => local.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));

const samples = (c: Char): S[] => {
  const out: S[] = [];
  // torso: tee surface rings (ellipse radii from teeSurface, centred on the body axis)
  for (let k = 0; k <= 10; k++) {
    const v = 0.02 + (0.96 * k) / 10;
    const rx = Math.abs(teeSurface(0.999, v).p.x);
    const rz = Math.abs(teeSurface(0, v).p.z);
    const y = LAY.torsoY0 + v * LAY.torsoH;
    for (let a = 0; a < 24; a++) {
      const th = (a / 24) * Math.PI * 2;
      out.push({ p: toWorld(c, new THREE.Vector3(rx * Math.cos(th), y, rz * Math.sin(th))), r: 0, part: "badan" });
    }
  }
  // arms (shoulder -> elbow -> hand), both sides; the jacket rides on adik's right forearm ("L" chain)
  for (const side of ["L", "R"] as const) {
    const { S: sh, E, H: hd } = armChain(c.pose, side, LAY);
    for (let i = 0; i <= 8; i++) out.push({ p: toWorld(c, sh.clone().lerp(E, i / 8)), r: 0.03, part: `lengan ${side === "L" ? "kanan" : "kiri"}` });
    for (let i = 1; i <= 8; i++) out.push({ p: toWorld(c, E.clone().lerp(hd, i / 8)), r: c.who === "adik" && side === "L" ? 0.07 : 0.03, part: c.who === "adik" && side === "L" ? "lengan kanan + jaket" : `lengan ${side === "L" ? "kanan" : "kiri"}` });
    out.push({ p: toWorld(c, hd), r: 0.05, part: `tangan ${side === "L" ? "kanan" : "kiri"}` });
  }
  // legs and feet (standing): two lines under the hips, shoes reaching forward
  const hipY = LAY.hipY;
  for (const sx of [-1, 1]) {
    const x = sx * 0.045;
    for (let i = 0; i <= 6; i++) out.push({ p: toWorld(c, new THREE.Vector3(x, (hipY * i) / 6, 0)), r: 0.035, part: "kaki" });
    out.push({ p: toWorld(c, new THREE.Vector3(x, 0.03, 0.07)), r: 0.05, part: "sepatu" });
  }
  // head: sphere at the head centre; radius from centre to top (adik's head is 1.06 x wider)
  const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height));
  const ht = new THREE.Vector3(...stickHeadTop(c.root, c.height));
  out.push({ p: hc, r: (ht.y - hc.y) * (c.who === "adik" ? 1.06 : 1), part: "kepala" });
  return out;
};

const boxDist = (p: THREE.Vector3, b: Box) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]);
  const dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]);
  const dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  const outside = Math.hypot(dx, dy, dz);
  if (outside > 0) return outside;
  return -Math.min(p.x - b.min[0], b.max[0] - p.x, p.y - b.min[1], b.max[1] - p.y, p.z - b.min[2], b.max[2] - p.z);
};

const report = (label: string, chars: Char[]) => {
  for (const c of chars) {
    let best = { d: Infinity, part: "", box: "" };
    for (const s of samples(c)) for (const b of BOXES) {
      const d = boxDist(s.p, b) - s.r;
      if (d < best.d) best = { d, part: s.part, box: b.name };
    }
    const flag = best.d < 0 ? "TEMBUS" : best.d < 0.03 ? "MEPET" : "ok";
    console.log(`${label.padEnd(10)} ${c.who.padEnd(5)} min ${(best.d * 100).toFixed(1).padStart(6)} cm  ${flag.padEnd(6)} (${best.part} ↔ ${best.box})`);
  }
};

// v1 still a (the owner's finding), for comparison: adik at (-1.2, 0, -1.2), Uq at (-0.6, 0, -2.1)
report("v1-a", [
  { who: "uq", root: [-0.6, 0, -2.1], yaw: NORTH, height: 1.5, pose: {} },
  { who: "adik", root: [-1.2, 0, -1.2], yaw: NORTH, height: ADIK_HEIGHT, pose: { ...ADIK_REST } },
]);
for (const v of LD003_V2) report(`v2-${v.id}`, v.chars);
// look-dev v3 (2026-11-18, D-038): same check on the v3 stills (ld003SceneV3.ts)
import { LD003_V3 } from "../src/ep003/ld003SceneV3";
for (const v of LD003_V3) report(`v3-${v.id}`, v.chars);
