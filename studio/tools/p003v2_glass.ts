// Pilot 2026-11-003 v2 (D-041 pending): the vent glass on screen and the gaze lines for the new insert, as numbers.
//  - glass share of the frame: the pane's four corners projected through each lens (clipped to the frame);
//  - gaze: angle between the insert lens axis and Uq's / adik's head → glass line (how close the insert is to what
//    they look at), and adik's head → glass vs her head direction in S06 (from p003_check).
// Run from studio/: npx esbuild tools/p003v2_glass.ts --bundle --platform=node --log-level=warning --outfile=out/p003v2_glass.cjs && node out/p003v2_glass.cjs
import * as THREE from "three";
import { stickHeadCenter } from "../src/c1/C1";
import { HOUSE } from "../src/ep002/geo";
import { P2 } from "../src/ep003/pilot003V2";
import { P3 } from "../src/ep003/pilot003V3";
import type { ShotId } from "../src/ep003/pilot003Stage";
import { GLASS } from "../src/ep003/ld003Scene";

const Z = HOUSE.z0 + 0.01 - 0.0075; // the pane's inside face (sets.tsx: box 0.015 thick at N + 0.01)
const C = [[-0.25, -0.15], [0.25, -0.15], [0.25, 0.15], [-0.25, 0.15]].map(([dx, dy]) => new THREE.Vector3(GLASS[0] + dx, GLASS[1] + dy, Z));
const W = 1080, H = 1920;
// polygon clip to the frame (Sutherland–Hodgman) and area
const clip = (pts: THREE.Vector2[]) => {
  const edges: [(p: THREE.Vector2) => boolean, (a: THREE.Vector2, b: THREE.Vector2) => THREE.Vector2][] = [
    [(p) => p.x >= 0, (a, b) => a.clone().lerp(b, (0 - a.x) / (b.x - a.x))],
    [(p) => p.x <= W, (a, b) => a.clone().lerp(b, (W - a.x) / (b.x - a.x))],
    [(p) => p.y >= 0, (a, b) => a.clone().lerp(b, (0 - a.y) / (b.y - a.y))],
    [(p) => p.y <= H, (a, b) => a.clone().lerp(b, (H - a.y) / (b.y - a.y))],
  ];
  let out = pts;
  for (const [inside, cut] of edges) {
    const res: THREE.Vector2[] = [];
    out.forEach((p, i) => {
      const q = out[(i + out.length - 1) % out.length];
      if (inside(p)) { if (!inside(q)) res.push(cut(q, p)); res.push(p); } else if (inside(q)) res.push(cut(q, p));
    });
    out = res;
  }
  return out;
};
const area = (p: THREE.Vector2[]) => Math.abs(p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a.x * b.y - b.x * a.y; }, 0)) / 2;
const PP = process.argv[2] === "v3" ? P3 : P2;
const shot = (label: string, t: number, id: ShotId) => {
  const st = PP.stageShot(t, id);
  const cam = new THREE.PerspectiveCamera(st.cam.fov, W / H, 0.05, 100);
  cam.position.set(...st.cam.pos); cam.lookAt(new THREE.Vector3(...st.cam.look)); cam.updateMatrixWorld();
  const pts = C.map((p) => { const v = p.clone().project(cam); return new THREE.Vector2((v.x + 1) * W / 2, (1 - v.y) * H / 2); });
  const cl = clip(pts);
  const xs = cl.map((p) => p.x), ys = cl.map((p) => p.y);
  const axis = new THREE.Vector3(...st.cam.look).sub(new THREE.Vector3(...st.cam.pos)).normalize();
  const g = new THREE.Vector3(GLASS[0], GLASS[1], Z);
  const uq = PP.uqAt(t).char, ad = PP.adikAt(t);
  const ang = (from: THREE.Vector3) => (axis.angleTo(g.clone().sub(from).normalize()) * 180) / Math.PI;
  const uqH = new THREE.Vector3(...stickHeadCenter(uq.root, uq.height)), adH = new THREE.Vector3(...stickHeadCenter(ad.root, ad.height));
  const lens = new THREE.Vector3(...st.cam.pos);
  return {
    label, t: +t.toFixed(2), shot: id,
    glass_share_pct: +((100 * area(cl)) / (W * H)).toFixed(2),
    width_pct: +((100 * (Math.max(...xs) - Math.min(...xs))) / W).toFixed(1), height_pct: +((100 * (Math.max(...ys) - Math.min(...ys))) / H).toFixed(1),
    centre_y_pct: +((100 * ys.reduce((s, y) => s + y, 0)) / ys.length / H).toFixed(1),
    lens_to_glass_m: +lens.distanceTo(g).toFixed(2),
    lensAxis_vs_uqHeadToGlass_deg: +ang(uqH).toFixed(1), lensAxis_vs_adikHeadToGlass_deg: +ang(adH).toFixed(1),
  };
};
const hold = (PP.SW.t2 + PP.SW.t3) / 2;
console.log(JSON.stringify([
  shot("S03 lebar, tahan kaca", hold, "s03"),
  shot("S03i insert, tahan kaca", hold, "s03i"),
  shot("S06 lebar (kata 'kaca')", PP.CUTS.fb0 - 0.6, "s06"),
  shot("S06d kaca sekarang gelap", PP.END - 0.5, "s06d"),
], null, 1));
