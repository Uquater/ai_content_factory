// Episode 3: the LED halo occlusion gate (src/ep004/occlusion004.ts) at every planned lens, plus cases that MUST be
// blocked (a wall, the bedroom door leaf, a head, a body). Halo = drawn only when the LED is in frame and unblocked.
// Run from studio/:
//   npx esbuild tools/e004_halo_occ_check.ts --bundle --platform=node --log-level=warning --outfile=out/e004_halo_occ_check.cjs && node out/e004_halo_occ_check.cjs
import * as THREE from "three";
import type { V3 } from "../src/inkbeat/types";
import { LD004, ledWorld } from "../src/ep004/LookDev004";
import type { LedId } from "../src/ep004/LookDev004";
import { blockedBy } from "../src/ep004/occlusion004";
import type { Occluder } from "../src/ep004/occlusion004";
import { R1, S02 } from "../src/ep004/e004Poses";

type Cam = { pos: V3; look: V3; fov: number };
const inFrame = (c: Cam, p: V3) => {
  const pc = new THREE.PerspectiveCamera(c.fov, 1080 / 1920, 0.02, 600);
  pc.position.set(...c.pos); pc.lookAt(...c.look); pc.updateMatrixWorld(true);
  const v = new THREE.Vector3(...p).project(pc);
  const front = new THREE.Vector3(...p).sub(pc.position).dot(new THREE.Vector3(...c.look).sub(new THREE.Vector3(...c.pos))) > 0;
  return { ok: front && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1, px: Math.round(((v.x + 1) / 2) * 1080), py: Math.round(((1 - v.y) / 2) * 1920) };
};
const IDS: LedId[] = ["T", "D", "L", "K"];
const occS02: Occluder[] = [{ root: S02.uq.root, height: S02.uq.height, who: "uq" }, { root: S02.adik.root, height: S02.adik.height, who: "adik" }];
const occR1: Occluder[] = [{ root: R1.uq, height: 1.5, who: "uq" }, { root: R1.adik, height: S02.adik.height, who: "adik" }];
const report = (name: string, c: Cam, occ: Occluder[]) => {
  const r = IDS.map((k) => { const f = inFrame(c, ledWorld(k)); if (!f.ok) return `${k}: di luar bingkai`; const b = blockedBy(c.pos, ledWorld(k), occ); return `${k}: ${b ? `TERHALANG (${b}) → tanpa pendar` : `terlihat (${f.px},${f.py}) → pendar`}`; });
  console.log(`${name.padEnd(34)} ${r.join(" | ")}`);
};
console.log("— semua lensa look-dev —");
for (const [id, v] of Object.entries(LD004)) if (v.ep2 === undefined) report(id, v.cam, v.chars === "s02" ? occS02 : []);
console.log("\n— lensa storyboard (dengan tokoh) —");
const mid = (a: V3, b: V3, y: number): V3 => [(a[0] + b[0]) / 2, y, (a[2] + b[2]) / 2];
report("S02/S04/S08 lensa P (posisi S02)", { pos: [0.75, 1.5, 2.55], look: mid(S02.uq.root, S02.adik.root, 1.0), fov: 50 }, occS02);
report("S10/S13/S15 lensa P (posisi R1)", { pos: [0.75, 1.5, 2.55], look: mid(R1.uq, R1.adik, 1.05), fov: 46 }, occR1);
report("S09 POV sudut (mata Uq)", { pos: [-1.5, 1.42, 1.95], look: [0.85, 2.55, 2.85], fov: 24 }, occS02.slice(1));
report("S11 POV lorong fov 32 (R1)", { pos: [-1.55, 1.42, 1.0], look: [-0.6, 1.95, -3.6], fov: 32 }, occR1.slice(1));
report("S12 POV kamar (R1)", { pos: [-1.5, 1.42, 0.95], look: [2.6, 1.75, -0.45], fov: 30 }, occR1.slice(1));
console.log("\n— kasus yang WAJIB terhalang —");
const must = (name: string, c: Cam, k: LedId, occ: Occluder[], expect: string) => {
  const f = inFrame(c, ledWorld(k)); const b = blockedBy(c.pos, ledWorld(k), occ);
  console.log(`${name.padEnd(48)} LED ${k} ${f.ok ? "di bingkai" : "DI LUAR BINGKAI"}; penghalang: ${b ?? "TIDAK ADA"} → ${b && b.includes(expect) ? "LULUS" : "GAGAL"}`);
};
// 1) living room → kitchen LED: the wall above the hallway opening / the hallway walls
must("dari lensa P ke LED dapur", { pos: [0.75, 1.5, 2.55], look: ledWorld("D"), fov: 30 }, "D", [], "dinding");
// 2) the end-of-Ep-2 spot → the bedroom LED: the open bedroom door leaf or the bedroom wall
must("dari posisi akhir Ep 2 ke LED kamar", { pos: [S02.uq.root[0], 1.42, S02.uq.root[2]], look: ledWorld("K"), fov: 30 }, "K", [], "kamar");
// 3) a lens right behind adik's head, aimed at the living-room LED through her head
{
  const T = ledWorld("T"), hc: V3 = [S02.adik.root[0], 1.0, S02.adik.root[2]];
  const dir = new THREE.Vector3(...hc).sub(new THREE.Vector3(...T)).normalize();
  const pos = new THREE.Vector3(...hc).add(dir.multiplyScalar(0.6));
  must("lensa di belakang kepala adik ke LED tamu", { pos: [pos.x, pos.y, pos.z], look: T, fov: 30 }, "T", occS02, "adik");
}
// 4) a lens behind Uq's body at chest height, aimed at the bedroom LED from R1 through his torso
{
  const K = ledWorld("K"), ch: V3 = [R1.uq[0], 1.1, R1.uq[2]];
  const dir = new THREE.Vector3(...ch).sub(new THREE.Vector3(...K)).normalize();
  const pos = new THREE.Vector3(...ch).add(dir.multiplyScalar(0.5));
  must("lensa di belakang badan Uq (R1) ke LED kamar", { pos: [pos.x, pos.y, pos.z], look: K, fov: 30 }, "K", occR1, "uq");
}
// 5) the kitchen, behind the back door: the hallway LED seen from outside through the north wall
must("dari gang (luar pintu belakang) ke LED lorong", { pos: [-0.8, 1.5, -6.3], look: ledWorld("L"), fov: 30 }, "L", [], "dinding belakang");
