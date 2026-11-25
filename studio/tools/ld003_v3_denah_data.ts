// Floor-plan data for look-dev v3 (2026-11-003, D-038): cameras, characters and the Uq–adik line straight from
// ld003SceneV3.ts / ld003Scene.ts, with computed distances, so no label on the plan is typed by hand.
// Run from studio/: npx esbuild tools/ld003_v3_denah_data.ts --bundle --platform=node --log-level=warning --outfile=out/ld003_v3_denah_data.cjs && node out/ld003_v3_denah_data.cjs > out/ld003_v3_denah.json
//   then: python tools/ld003_v3_denah.py out/ld003_v3_denah.json <out.png>
import * as THREE from "three";
import { stickHeadCenter } from "../src/c1/C1";
import type { V3 } from "../src/inkbeat/types";
import { GLASS, BOLT } from "../src/ep003/ld003Scene";
import { LD003_V3, ADIK_MOUTH_E, UQ_STEPPED } from "../src/ep003/ld003SceneV3";
import { LD003_V2 } from "../src/ep003/ld003Scene";

const hfov = (vfov: number) => (2 * Math.atan(Math.tan(((vfov / 2) * Math.PI) / 180) * (1080 / 1920)) * 180) / Math.PI;
type CamOut = { id: string; pos: V3; look: V3; hfov: number; near: string; d: number; side: string };
const line = { a: ADIK_MOUTH_E, b: UQ_STEPPED };
const sideOf = (c: V3) => {
  const ux = line.b[0] - line.a[0], uz = line.b[2] - line.a[2];
  const cross = (ux * (c[2] - line.a[2]) - uz * (c[0] - line.a[0])) / Math.hypot(ux, uz);
  return Math.abs(cross) < 0.05 ? "di garis" : cross < 0 ? "barat" : "timur";
};
const cams: CamOut[] = [];
const add = (id: string, cam: { pos: V3; look: V3; fov: number }, chars: { who: string; root: V3; height: number }[]) => {
  const c = new THREE.Vector3(...cam.pos);
  const near = chars.map((ch) => ({ who: ch.who, d: c.distanceTo(new THREE.Vector3(...stickHeadCenter(ch.root, ch.height))) })).reduce((a, b) => (b.d < a.d ? b : a));
  cams.push({ id, pos: cam.pos, look: cam.look, hfov: hfov(cam.fov), near: near.who, d: near.d, side: sideOf(cam.pos) });
};
for (const v of LD003_V3) add(v.id, v.cam, v.chars);
const s04 = LD003_V2.find((v) => v.id === "s04")!;
add("S04 (v2)", s04.cam, s04.chars);
// S06 approved move (x -1.15), aimed at adik's face (storyboard: from the kitchen facing south, ~2.4 m)
add("S06 (rencana)", { pos: [-1.15, 1.2, -3.35], look: [-0.5, 1.0, -0.95], fov: 40 }, [{ who: "adik", root: ADIK_MOUTH_E, height: 1.27 }]);
const chars = [
  { who: "Uq stand-off", p: [-0.95, -3.8] },
  { who: "Uq sesudah maju", p: [UQ_STEPPED[0], UQ_STEPPED[2]] },
  { who: "Uq still a", p: [-0.72, -2.15] },
  { who: "adik S03 (timur)", p: [ADIK_MOUTH_E[0], ADIK_MOUTH_E[2]] },
  { who: "adik v2 (still a)", p: [-1.0, -0.95] },
  { who: "adik S03 alt (barat)", p: [-1.12, -0.95] },
];
console.log(JSON.stringify({ cams, chars, line: [[line.a[0], line.a[2]], [line.b[0], line.b[2]]], glass: [GLASS[0], GLASS[2]], bolt: [BOLT[0], BOLT[2]] }));
