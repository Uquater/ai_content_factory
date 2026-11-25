// Look-dev v3 numbers (2026-11-003, D-038): for every v3 still, from the SAME data the renderer reads (ld003SceneV3.ts):
//   - camera: distance to the nearest character (head centre), to the nearest wall/door, side of the Uq–adik line
//   - S03: adik's and the vent glass's projected size and place in the 9:16 frame; sight lines blocked by walls/lintel
//   - S05: face angle to the lens, perspective ratio (front of the head vs its centre), fov
//   - still a: fingertips vs the phone box (contact / penetration), palm and forearm vs the phone
// Run from studio/:
//   npx esbuild tools/ld003_v3_calc.ts --bundle --platform=node --log-level=warning --outfile=out/ld003_v3_calc.cjs && node out/ld003_v3_calc.cjs
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop } from "../src/c1/C1";
import { C1_BUILD, C1_HEIGHT } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { GLASS } from "../src/ep003/ld003Scene";
import { CAMS3, FINGER_R, GRIPS, LD003_V3, PALM_HALF, fingerSamples, gripPhone, ADIK_MOUTH_W, ADIK_MOUTH_E, UQ_STEPPED } from "../src/ep003/ld003SceneV3";
import type { Grip, ViewV3 } from "../src/ep003/ld003SceneV3";
import { LD003_V2 } from "../src/ep003/ld003Scene";

const LAY = layoutOf(C1_BUILD);
const H = 2.7;
type Box = { name: string; min: V3; max: V3 };
// geo.ts walls (as tools/ld003_clearance.ts) + the door leaf / back wall and the living-room south wall
const WALLS: Box[] = [
  { name: "dinding barat lorong", min: [-1.46, 0, -3.2], max: [-1.34, H, -1.0] },
  { name: "dinding timur lorong", min: [-0.26, 0, -3.2], max: [-0.14, H, -1.0] },
  { name: "dinding utara ruang tamu (barat bukaan)", min: [-4.0, 0, -1.06], max: [-1.4, H, -0.94] },
  { name: "dinding utara ruang tamu (timur bukaan)", min: [-0.2, 0, -1.06], max: [1.0, H, -0.94] },
  { name: "ambang atas bukaan lorong", min: [-1.4, 2.2, -1.06], max: [-0.2, H, -0.94] },
  { name: "dinding dapur-lorong (barat)", min: [-4.0, 0, -3.26], max: [-1.4, H, -3.14] },
  { name: "dinding dapur-lorong (timur)", min: [-0.2, 0, -3.26], max: [1.0, H, -3.14] },
  { name: "dinding utara + daun pintu belakang", min: [-4.0, 0, -5.06], max: [1.0, H, -4.94] },
  { name: "dinding selatan ruang tamu", min: [-4.0, 0, 2.94], max: [1.0, H, 3.06] },
  { name: "rak dapur", min: [-3.6, 1.68, -4.94], max: [-2.2, 1.72, -4.69] },
  { name: "meja dapur", min: [-3.8, 0, -4.94], max: [-1.6, 0.9, -4.32] },
];
const boxDist = (p: THREE.Vector3, b: Box) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]);
  const dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]);
  const dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  return Math.hypot(dx, dy, dz);
};
const segHitsBox = (a: THREE.Vector3, b: THREE.Vector3, bx: Box) => {
  const ray = new THREE.Ray(a, b.clone().sub(a).normalize());
  const hit = ray.intersectBox(new THREE.Box3(new THREE.Vector3(...bx.min), new THREE.Vector3(...bx.max)), new THREE.Vector3());
  return !!hit && hit.distanceTo(a) < a.distanceTo(b) - 0.02;
};
const blockers = (a: THREE.Vector3, b: THREE.Vector3) => WALLS.filter((w) => !w.name.startsWith("dinding utara + daun") && segHitsBox(a, b, w)).map((w) => w.name);

const camOf = (c: { pos: V3; look: V3; fov: number }) => {
  const k = new THREE.PerspectiveCamera(c.fov, 1080 / 1920, 0.02, 100);
  k.position.set(...c.pos);
  k.lookAt(...c.look);
  k.updateMatrixWorld();
  k.updateProjectionMatrix();
  return k;
};
/** screen position: x 0..1 left→right, y 0..1 top→bottom */
const proj = (k: THREE.PerspectiveCamera, p: V3 | THREE.Vector3) => {
  const v = (p instanceof THREE.Vector3 ? p.clone() : new THREE.Vector3(...p)).project(k);
  return { x: (v.x + 1) / 2, y: (1 - v.y) / 2, front: v.z < 1 };
};
const pct = (v: number) => `${(v * 100).toFixed(1)} %`;

/** points on a standing character: feet, hips, shoulders, head (centre ± radius in x/y), hands */
const bodyPts = (root: V3, h: number) => {
  const hc = new THREE.Vector3(...stickHeadCenter(root, h));
  const ht = new THREE.Vector3(...stickHeadTop(root, h));
  const r = (ht.y - hc.y) * 1.06;
  const pts = [new THREE.Vector3(root[0], 0, root[2]), ht];
  for (const dx of [-r, r]) for (const dz of [-r, r]) pts.push(hc.clone().add(new THREE.Vector3(dx, 0, dz)));
  for (const dx of [-0.2, 0.2]) pts.push(new THREE.Vector3(root[0] + dx, h * 0.62, root[2]));
  return { pts, hc, ht, r };
};
const bbox = (k: THREE.PerspectiveCamera, pts: THREE.Vector3[]) => {
  const s = pts.map((p) => proj(k, p));
  const x0 = Math.min(...s.map((q) => q.x)), x1 = Math.max(...s.map((q) => q.x));
  const y0 = Math.min(...s.map((q) => q.y)), y1 = Math.max(...s.map((q) => q.y));
  const vis = { x0: Math.max(0, x0), x1: Math.min(1, x1), y0: Math.max(0, y0), y1: Math.min(1, y1) };
  const area = Math.max(0, vis.x1 - vis.x0) * Math.max(0, vis.y1 - vis.y0);
  return { x0, x1, y0, y1, visH: Math.max(0, vis.y1 - vis.y0), area };
};

// the Uq–adik line (top view): which side is a camera on? + = west of the line seen from adik toward Uq
const sideOf = (cam: V3, uq: V3, ad: V3) => {
  const ux = uq[0] - ad[0], uz = uq[2] - ad[2];
  const cx = cam[0] - ad[0], cz = cam[2] - ad[2];
  const cross = ux * cz - uz * cx; // y of (u × c)
  const along = (cx * ux + cz * uz) / Math.hypot(ux, uz);
  const off = cross / Math.hypot(ux, uz);
  return { off, along, side: Math.abs(off) < 0.05 ? "di garis" : off < 0 ? "BARAT" : "TIMUR" };
};

console.log("=== kamera: jarak, garis 180° (garis Uq–adik dari posisi yang dipakai still itu) ===");
const report = (tag: string, v: { id: string; cam: { pos: V3 }; chars: { who: string; root: V3; height: number }[] }) => {
  const c = new THREE.Vector3(...v.cam.pos);
  const dists = v.chars.map((ch) => ({ who: ch.who, d: c.distanceTo(new THREE.Vector3(...stickHeadCenter(ch.root, ch.height))) }));
  const near = dists.reduce((a, b) => (b.d < a.d ? b : a));
  const wall = WALLS.map((w) => ({ n: w.name, d: boxDist(c, w) })).reduce((a, b) => (b.d < a.d ? b : a));
  const uq = v.chars.find((x) => x.who === "uq")!;
  const ad = v.chars.find((x) => x.who === "adik");
  const line = sideOf(v.cam.pos, uq.root, ad ? ad.root : ADIK_MOUTH_W);
  console.log(`${tag.padEnd(4)} ${v.id.padEnd(12)} terdekat ${near.who.padEnd(4)} ${near.d.toFixed(2)} m · dinding terdekat ${wall.d.toFixed(2)} m (${wall.n}) · sisi garis: ${line.side} (${line.off.toFixed(2)} m)`);
};
for (const v of LD003_V2.filter((x) => ["a", "s03", "s04", "e", "k1c", "k3c"].includes(x.id))) report("v2", v);
for (const v of LD003_V3) report("v3", v);
// S06 (approved move to x -1.15) and the S04 insert, against the v3 line (adik at the west of the mouth)
report("plan", { id: "S06 x-1,15", cam: { pos: [-1.15, 1.2, -3.35] }, chars: [{ who: "uq", root: UQ_STEPPED, height: C1_HEIGHT }, { who: "adik", root: ADIK_MOUTH_W, height: 1.27 }] });

console.log("\n=== S03: ukuran adik dan kaca di bingkai (9:16) ===");
const s03Report = (label: string, c: { pos: V3; look: V3; fov: number }, ad: V3, uq: V3) => {
  const k = camOf(c);
  const A = bodyPts(ad, 1.27);
  const U = bodyPts(uq, C1_HEIGHT);
  const bA = bbox(k, A.pts);
  const bU = bbox(k, U.pts);
  const headA = bbox(k, [A.ht, A.hc.clone().setY(A.hc.y - A.r), A.hc.clone().setX(A.hc.x - A.r), A.hc.clone().setX(A.hc.x + A.r)]);
  const g = [[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]].map(([dx, dy]) => new THREE.Vector3(GLASS[0] + dx, GLASS[1] + dy, GLASS[2]));
  const bG = bbox(k, g);
  const cam = new THREE.Vector3(...c.pos);
  const glassBlock = blockers(cam, new THREE.Vector3(...GLASS));
  const uqBlock = blockers(cam, U.hc);
  // adik overlapping Uq's head or the door knob area on screen?
  const uqHead = bbox(k, [U.ht, U.hc.clone().setY(U.hc.y - U.r), U.hc.clone().setX(U.hc.x - U.r), U.hc.clone().setX(U.hc.x + U.r)]);
  const overlap = !(bA.x1 < uqHead.x0 || bA.x0 > uqHead.x1 || bA.y1 < uqHead.y0 || bA.y0 > uqHead.y1);
  console.log(`${label.padEnd(26)} fov ${String(c.fov).padStart(2)} · adik tinggi terlihat ${pct(bA.visH)} (kepala ${pct(headA.y1 - headA.y0)}), x ${bA.x0.toFixed(2)}–${bA.x1.toFixed(2)}, y ${bA.y0.toFixed(2)}–${bA.y1.toFixed(2)} · Uq ${pct(bU.visH)} · kaca ${pct(bG.y1 - bG.y0)} tinggi, pusat y ${((bG.y0 + bG.y1) / 2).toFixed(2)} · tutup kaca: ${glassBlock.join(",") || "-"} · tutup Uq: ${uqBlock.join(",") || "-"} · adik∩kepala Uq: ${overlap ? "YA" : "tidak"}`);
};
const v2s03 = LD003_V2.find((x) => x.id === "s03")!;
s03Report("v2 s03 (timur)", v2s03.cam, [-1.0, 0, -0.95], [-0.95, 0, -3.8]);
const s3 = LD003_V3.find((x) => x.id === "s03s")!;
s03Report("v3 s03s (barat)", s3.cam, ADIK_MOUTH_E, [-0.95, 0, -3.8]);
s03Report("v3 s03w (alt, adik barat)", LD003_V3.find((x) => x.id === "s03w")!.cam, ADIK_MOUTH_W, [-0.95, 0, -3.8]);
// sweep (decision support): camera at the back wall of the living room, west of (or on) the Uq–adik line;
// adik at the west (x -1.12) or the east (x -0.5) side of the hallway mouth
for (const ax of [-1.12, -0.5]) for (const x of [-0.9, -1.1, -1.3, -1.6]) for (const y of [1.6, 1.95, 2.15]) for (const fov of [26, 30]) {
  const ad: V3 = [ax, 0, -0.95];
  const ln = sideOf([x, y, 2.85], [-0.95, 0, -3.8], ad);
  if (ln.side === "TIMUR") continue;
  s03Report(`  adik x ${ax} cam ${x},${y}`, { pos: [x, y, 2.85], look: [-0.95, 1.45, -4.6], fov }, ad, [-0.95, 0, -3.8]);
}


console.log("\n=== S05: reaksi wajah ===");
for (const id of ["r05w", "r05d"]) {
  const v = LD003_V3.find((x) => x.id === id)!;
  const uq = v.chars[0];
  const hc = new THREE.Vector3(...stickHeadCenter(uq.root, uq.height));
  const ht = new THREE.Vector3(...stickHeadTop(uq.root, uq.height));
  const r = ht.y - hc.y;
  const cam = new THREE.Vector3(...v.cam.pos);
  const d = cam.distanceTo(hc);
  const faceYaw = uq.yaw + ((uq.pose.headYaw ?? 0) * Math.PI) / 180;
  const fdir = new THREE.Vector3(Math.sin(faceYaw), 0, Math.cos(faceYaw));
  const toCam = cam.clone().sub(hc).setY(0).normalize();
  const ang = (Math.acos(Math.max(-1, Math.min(1, fdir.dot(toCam)))) * 180) / Math.PI;
  const k = camOf(v.cam);
  const head = bbox(k, [ht, hc.clone().setY(hc.y - r), hc.clone().setX(hc.x - r), hc.clone().setX(hc.x + r), hc.clone().setZ(hc.z - r), hc.clone().setZ(hc.z + r)]);
  const door = Math.abs(cam.z - -4.94);
  // head + shoulders (head top to ~0.25 m below the chin) at this distance: the fov needed
  const needH = ht.y - (hc.y - r - 0.22);
  const fovNeed = (2 * Math.atan(needH / 2 / (d - r)) * 180) / Math.PI;
  console.log(`${id}: kamera→pusat kepala ${d.toFixed(2)} m, →permukaan depan ${(d - r).toFixed(2)} m · kamera→pintu ${door.toFixed(2)} m · radius kepala ${r.toFixed(3)} m · rasio perspektif depan/pusat ${(d / (d - r)).toFixed(2)} (2,2 m ≈ ${(2.2 / (2.2 - r)).toFixed(2)}) · sudut wajah ke lensa ${ang.toFixed(0)}° · fov ${v.cam.fov}°, kepala ${pct(head.y1 - head.y0)} tinggi bingkai · fov perlu utk kepala+bahu ${fovNeed.toFixed(0)}° · terhalang: ${blockers(cam, hc).join(",") || "-"}`);
}
// the largest legal distance between the face and the door after the two steps
{
  const hc = new THREE.Vector3(...stickHeadCenter(UQ_STEPPED, C1_HEIGHT));
  console.log(`ruang wajah–pintu sesudah maju: pusat kepala z ${hc.z.toFixed(2)}, muka pintu z −4,94 → maks ${(hc.z + 4.94).toFixed(2)} m (perlu ≥ 2,2 m)`);
}

console.log("\n=== still a: jari vs ponsel (satuan cm dunia; negatif = menembus) ===");
const gripCheck = (uq: ViewV3["chars"][number], grip: Grip) => {
  const gp = gripPhone(uq.pose, "R", grip, uq.root, uq.yaw);
  const half = new THREE.Vector3(gp.extent.x / 2, gp.extent.y / 2, gp.extent.z / 2);
  // signed distance from a hand-frame point to the phone box (hand frame, h units)
  const sd = (p: THREE.Vector3) => {
    const q = p.clone().sub(gp.cLocal);
    const d = new THREE.Vector3(Math.abs(q.x) - half.x, Math.abs(q.y) - half.y, Math.abs(q.z) - half.z);
    const out = new THREE.Vector3(Math.max(d.x, 0), Math.max(d.y, 0), Math.max(d.z, 0)).length();
    return out + Math.min(Math.max(d.x, d.y, d.z), 0);
  };
  const s = fingerSamples(grip.hand.curl ?? 0);
  const minF = Math.min(...s.map((x) => sd(x.p) - FINGER_R));
  // fingertip: how far in front of the screen face (hand -z side), and is it over the phone (not past its edge)?
  const tips = s.filter((x) => x.tip).map((x) => {
    const q = x.p.clone().sub(gp.cLocal);
    return { front: -(q.z + half.z) - FINGER_R, over: Math.abs(q.y) <= half.y && Math.abs(q.x) <= half.x, past: Math.max(Math.abs(q.y) - half.y, Math.abs(q.x) - half.x) };
  });
  // palm ellipsoid's palm face vs the phone back
  let minP = Infinity;
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    const u = i / 4, w = j / 4;
    if (u * u + w * w > 1) continue;
    minP = Math.min(minP, sd(new THREE.Vector3(u * PALM_HALF.x, 0.012 + w * PALM_HALF.y, -PALM_HALF.z * Math.sqrt(Math.max(0, 1 - u * u - w * w)))));
  }
  // forearm (wrist back to the elbow, tube radius 0.0115 h) vs the phone, in the hand frame
  const { E } = armChain(uq.pose, "R", LAY);
  const hf = gp.hf;
  const elbowW = E.clone().multiplyScalar(C1_HEIGHT).applyAxisAngle(new THREE.Vector3(0, 1, 0), uq.yaw).add(new THREE.Vector3(...uq.root));
  const elbowH = elbowW.sub(hf.origin).applyQuaternion(hf.q.clone().invert()).multiplyScalar(1 / C1_HEIGHT);
  let minA = Infinity;
  for (let i = 0; i <= 12; i++) minA = Math.min(minA, sd(elbowH.clone().multiplyScalar(i / 12)) - 0.0115);
  return { minF, tips, minP, minA };
};
const cm = (h: number) => (h * C1_HEIGHT * 100).toFixed(1);
// forearm vs phone allowed down to this (h units): the wrist tube (r 0.0115) is thicker than the palm (0.0075), so a phone
// lying on the palm always touches the wrist; the overlap is behind the phone, hidden from the still-a camera (reported)
// fingertip tolerance at the screen plane (h units; 0.0007 h = 1 mm): the reach limit found 2026-11-18 (report)
const HOOK_TOL = -0.0007;
const MIN_FOREARM = process.argv.includes("--strict") ? 0 : -0.0035;
const fmt = (r: ReturnType<typeof gripCheck>) => `jari min ${cm(r.minF)} cm · ujung jari di depan layar ${r.tips.map((t) => `${cm(t.front)}${t.over ? "" : `(lewat tepi ${cm(t.past)})`}`).join(" / ")} cm · telapak–punggung ponsel ${cm(r.minP)} cm · lengan bawah–ponsel ${cm(r.minA)} cm`;
for (const g of ["g1", "g2"] as const) {
  const uq = LD003_V3.find((x) => x.id === `a3${g}`)!.chars[0];
  console.log(`${g} (dipakai): ${fmt(gripCheck(uq, GRIPS[g]))}`);
  if (process.argv.includes("--search")) {
    let best: { score: number; g: Grip; r: ReturnType<typeof gripCheck> } | null = null;
    for (let curl = 80; curl <= 140; curl += 2) for (let e = 0.004; e <= 0.026; e += 0.001) for (let gap = 0; gap <= 0.004; gap += 0.00025) {
      const cand: Grip = { ...GRIPS[g], hand: { ...GRIPS[g].hand, curl }, edgeY: e, gap };
      const r = gripCheck(uq, cand);
      if (r.minF < 0.0002 || r.minA < MIN_FOREARM || r.minP < -0.0002) continue;
      // C1 fingers have ONE joint (the root), so a tip cannot come back over the screen without the finger cutting the
      // phone's edge: the best possible grip is a hook — tips just in front of the screen plane, as little past the edge
      const hook = r.tips.filter((t) => t.front >= HOOK_TOL && t.front <= 0.004);
      const score = hook.length * 10 - hook.reduce((a, t) => a + Math.max(0, t.past), 0) * 1000 - gap * 300;
      if (!best || score > best.score) best = { score, g: cand, r };
    }
    if (best) console.log(`  terbaik: curl ${best.g.hand.curl}, edgeY ${best.g.edgeY.toFixed(3)}, gap ${best.g.gap.toFixed(4)} -> ${fmt(best.r)}`);
    else console.log("  tidak ada kombinasi tanpa tembus");
  }
}
void CAMS3;

// S03 lens sweep (exact projection, decision support for the owner): both adik positions, wider lenses
console.log("\n=== S03: lensa lebih lebar (proyeksi tepat) ===");
for (const [tag, id, ad] of [["(i) adik timur", "s03s", ADIK_MOUTH_E], ["(ii) adik barat", "s03w", ADIK_MOUTH_W]] as const) {
  const c = LD003_V3.find((x) => x.id === id)!.cam;
  for (const fov of [28, 30, 36, 40, 45]) s03Report(`${tag} fov ${fov}`, { pos: c.pos, look: c.look, fov }, ad as V3, [-0.95, 0, -3.8]);
}
// (i) at fov 40 re-aimed west so adik stays at the right edge
for (const lx of [-1.1, -1.25, -1.4]) for (const ly of [1.45, 1.6]) {
  const c = LD003_V3.find((x) => x.id === "s03s")!.cam;
  s03Report(`(i) fov 40 look ${lx},${ly}`, { pos: c.pos, look: [lx, ly, -4.6], fov: 40 }, ADIK_MOUTH_E, [-0.95, 0, -3.8]);
}
