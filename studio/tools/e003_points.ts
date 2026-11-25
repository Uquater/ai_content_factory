// Episode 2026-11-003 draft: screen positions (px, 1080×1920) of the hands, the phone and the "Uq" lettering at given
// frames, for the 1:1 QC crops. node out/e003_points.cjs <frame> [<frame> …] → JSON
import * as THREE from "three";
import { C1_BUILD } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import { episodeAt, FPS } from "../src/ep003/episode003Stage";
import type { CharS } from "../src/ep003/pilot003Stage";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const W = (c: CharS, l: THREE.Vector3) => l.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
const out = process.argv.slice(2).map((a) => {
  const f = Number(a);
  const st = episodeAt(f / FPS);
  const cam = new THREE.PerspectiveCamera(st.cam.fov, 1080 / 1920, 0.05, 100);
  cam.position.set(...st.cam.pos); cam.lookAt(new THREE.Vector3(...st.cam.look)); cam.updateMatrixWorld();
  const px = (p: THREE.Vector3) => { const v = p.clone().project(cam); return v.z < 1 ? [Math.round((v.x + 1) * 540), Math.round((1 - v.y) * 960)] : null; };
  const pts: Record<string, number[] | null> = {};
  for (const c of st.chars) {
    pts[`${c.who}_tangan_kanan`] = px(W(c, armChain(c.pose, "L", LAY).H));
    pts[`${c.who}_tangan_kiri`] = px(W(c, armChain(c.pose, "R", LAY).H));
    if (c.who === "uq") pts.uq_tulisan = px(W(c, new THREE.Vector3(0.045, LAY.torsoY0 + 0.72 * LAY.torsoH, 0.07)));
  }
  pts.ponsel = px(new THREE.Vector3(...st.phone.p));
  return { f, shot: st.eshot, pts };
});
console.log(JSON.stringify(out));
