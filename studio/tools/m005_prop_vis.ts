// Episode 4 (2026-11-005): were candidate prop spots ever visible in the FINAL frames of Episode 2 and Episode 3?
// Per-frame cameras from the episode stages (Ep 2: episodeAt; Ep 3: Episode004 SEQS + pilot/stage55), 9:16 frustum, and a
// ray test against the house walls (axis-aligned boxes from geo.ts; doors/windows in those walls treated as solid except
// the living-room/hallway opening and the bedroom door opening). Characters and furniture do NOT occlude (conservative).
// Episode 1 is not covered (its camera function is not exported). Run from studio/:
//   npx esbuild tools/m005_prop_vis.ts --bundle --platform=node --log-level=warning --outfile=out/m005_prop_vis.cjs && node out/m005_prop_vis.cjs
import * as THREE from "three";
import type { Cam } from "../src/inkbeat/core/rig";
import type { V3 } from "../src/inkbeat/types";
import { END, episodeAt } from "../src/ep003/episode003Stage";
import { stage55 } from "../src/ep004/episode004Stage";
import { stageAt } from "../src/ep004/pilot004Stage";
import { PILOT_SHIFT, SEQS } from "../src/ep004/Episode004";

type Box = { name: string; min: V3; max: V3 };
const H = 2.7, T = 0.06;
const W: Box[] = [
  { name: "south wall", min: [-4.1, 0, 3.0 - T], max: [4.1, H, 3.0 + T] },
  { name: "north wall", min: [-4.1, 0, -5.0 - T], max: [4.1, H, -5.0 + T] },
  { name: "west wall", min: [-4.0 - T, 0, -5.1], max: [-4.0 + T, H, 3.1] },
  { name: "east wall", min: [4.0 - T, 0, -5.1], max: [4.0 + T, H, 3.1] },
  { name: "tamu north (west of hall)", min: [-4.0, 0, -1.0 - T], max: [-1.4, H, -1.0 + T] },
  { name: "tamu north (east of hall)", min: [-0.2, 0, -1.0 - T], max: [1.0, H, -1.0 + T] },
  { name: "hall lintel", min: [-1.4, 2.2, -1.0 - T], max: [-0.2, H, -1.0 + T] },
  { name: "kamar west wall (north of door)", min: [1.0 - T, 0, -1.0], max: [1.0 + T, H, -0.2] },
  { name: "kamar west wall (south of door)", min: [1.0 - T, 0, 0.7], max: [1.0 + T, H, 3.0] },
  { name: "kamar door lintel", min: [1.0 - T, 2.05, -0.2], max: [1.0 + T, H, 0.7] },
  { name: "kamar north wall", min: [1.0, 0, -1.0 - T], max: [4.0, H, -1.0 + T] },
  { name: "hall west", min: [-1.4 - T, 0, -3.2], max: [-1.4 + T, H, -1.0] },
  { name: "hall east", min: [-0.2 - T, 0, -3.2], max: [-0.2 + T, H, -1.0] },
];
const hits = (a: THREE.Vector3, b: THREE.Vector3) => {
  const dir = b.clone().sub(a);
  const len = dir.length();
  const ray = new THREE.Ray(a, dir.normalize());
  for (const w of W) {
    const box = new THREE.Box3(new THREE.Vector3(...w.min), new THREE.Vector3(...w.max));
    if (box.containsPoint(b) || box.containsPoint(a)) continue;
    const p = ray.intersectBox(box, new THREE.Vector3());
    if (p && p.distanceTo(a) < len - 0.01) return w.name;
  }
  return null;
};
const project = (c: Cam, p: V3) => {
  const pc = new THREE.PerspectiveCamera(c.fov, 1080 / 1920, 0.02, 600);
  pc.position.set(...c.pos); pc.lookAt(...c.look); pc.updateMatrixWorld(true);
  const v = new THREE.Vector3(...p).project(pc);
  const front = new THREE.Vector3(...p).sub(pc.position).dot(new THREE.Vector3(...c.look).sub(new THREE.Vector3(...c.pos))) > 0;
  return { ok: front && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1, x: ((v.x + 1) / 2) * 1080, y: ((1 - v.y) / 2) * 1920 };
};

const SPOTS: Record<string, V3[]> = {
  "sapu di sudut tenggara (x 0.45, z 2.86)": [[0.45, 0.05, 2.86], [0.45, 0.6, 2.87], [0.42, 1.25, 2.9]],
  "sapu bersandar di dinding kamar (x 0.9, z 2.70)": [[0.86, 0.05, 2.7], [0.88, 0.6, 2.7], [0.92, 1.3, 2.7]],
  "sapu bersandar di dinding kamar (x 0.9, z 2.45)": [[0.86, 0.05, 2.45], [0.88, 0.6, 2.45], [0.92, 1.3, 2.45]],
  "sapu bersandar di dinding kamar (x 0.9, z 2.20)": [[0.86, 0.05, 2.2], [0.88, 0.6, 2.2], [0.92, 1.3, 2.2]],
  "selotip di paku dinding kamar (0.93, 1.2, 2.6)": [[0.93, 1.2, 2.6]],
  "selotip di paku dinding kamar (0.93, 1.2, 2.35)": [[0.93, 1.2, 2.35]],
  "kamera T (cek alat ukur)": [[0.905, 2.665, 2.905]],
};
type Seen = { ep: string; t: number; shot: string; px: [number, number] };
const seen: Record<string, Seen[]> = Object.fromEntries(Object.keys(SPOTS).map((k) => [k, []]));
const test = (ep: string, t: number, shot: string, c: Cam) => {
  const a = new THREE.Vector3(...c.pos);
  for (const [k, pts] of Object.entries(SPOTS))
    for (const p of pts) {
      const s = project(c, p);
      if (!s.ok) continue;
      if (hits(a, new THREE.Vector3(...p))) continue;
      seen[k].push({ ep, t, shot, px: [Math.round(s.x), Math.round(s.y)] });
      break;
    }
};
// Episode 2 (2026-11-003) final: episodeAt over the whole plan
for (let f = 0; f < Math.round(END * 30); f++) { const st = episodeAt(f / 30); test("Ep2", f / 30, String(st.eshot ?? st.shot), st.cam); }
// Episode 3 (2026-11-004) final: the assembled order (pilot shots on the pilot clock)
const PILOT: Record<string, boolean> = { S01: true, S02: true, S08a: true, S08: true, S09: true };
for (const s of SEQS) for (let f = 0; f < s.dur; f++) {
  const t = (s.from + f) / 30;
  const c = PILOT[s.id] ? stageAt(t < 10 ? t : t - PILOT_SHIFT).cam : stage55(t, s.id).cam;
  test("Ep3", t, s.id, c);
}
for (const [k, list] of Object.entries(seen)) {
  if (!list.length) { console.log(`TIDAK PERNAH TERLIHAT  ${k}`); continue; }
  const byShot = new Map<string, Seen[]>();
  for (const x of list) { const key = `${x.ep} ${x.shot}`; byShot.set(key, [...(byShot.get(key) ?? []), x]); }
  console.log(`TERLIHAT ${list.length} frame  ${k}`);
  for (const [sh, xs] of byShot) console.log(`   ${sh}: ${xs.length} frame, ${xs[0].t.toFixed(2)}–${xs[xs.length - 1].t.toFixed(2)} s, px contoh ${xs[0].px.join(",")}`);
}
