// Ep 5 closing animatic: frame where the palm first reaches the lens (for SFX sync). Palm centre vs lens plane (z) and
// distance; palm sphere r 0.04, so contact = palm-centre gap <= 0.04 (+ a few mm of finger/skin tolerance).
//   npx esbuild tools/e006_hit.ts --bundle --platform=node --log-level=warning --outfile=out/e006_hit.cjs && node out/e006_hit.cjs
import * as THREE from "three";
import { C1_BUILD, c1UpperMatrix } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import { H_UQ } from "../src/ep004/motion004";
import { LENS, T, uqAt, YAW } from "../src/ep006/closeMotion006";
const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const n = Math.round(T.cut * 30);
for (let f = 90; f <= n; f++) {
  const t = f / 30, u = uqAt(t), q = u.q;
  const H = armChain({ armL: [q[0], q[1]], armLFwd: q[2] }, "L", LAY).H.applyMatrix4(c1UpperMatrix({ lean: u.lean })).multiplyScalar(H_UQ).applyAxisAngle(UP, YAW).add(new THREE.Vector3(...u.root));
  const gapZ = H.z - LENS[2]; // facing north: palm is at larger z than the lens until it touches
  const lat = Math.hypot(H.x - LENS[0], H.y - LENS[1]);
  console.log(`f${f} t=${t.toFixed(3)} palm-lens z-gap ${(gapZ * 100).toFixed(1)} cm, lateral ${(lat * 100).toFixed(1)} cm`);
}
