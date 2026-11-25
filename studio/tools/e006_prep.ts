// Episode 5 (2026-11-006) visual prep BEFORE voice-over (storyboard v0.1, owner 2026-11-24):
//   A. the new toa room (ruang toa) at the base of the toa pole: free floor, and whether earlier episodes' cameras could
//      have seen it (Ep 1 A01 high wide, Ep 4 S06 POV) - projection + occlusion by the row houses (boxes);
//   B. the stare into the desk camera: lens placement at eye height, eye-contact angle, face size/position in 9:16,
//      the microphone must not cover the face;
//   C. Uq's right hand reaching from rest to cover the lens: IK target error, joint step per frame, arm inside torso,
//      clearance to mic / desk / monitor wall, how much of the frame the hand fills at the cut.
// Pure geometry from the rig (no render). Run from studio/:
//   npx esbuild tools/e006_prep.ts --bundle --platform=node --log-level=warning --outfile=out/e006_prep.cjs && node out/e006_prep.cjs
import * as THREE from "three";
import { c1ArmIK, c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { C1_BUILD, c1UpperMatrix } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import { stickHeadCenter } from "../src/c1/C1";
import type { V3 } from "../src/inkbeat/types";
import { H_UQ, REST_UQ } from "../src/ep004/motion004";
import { NEIGHBOURS, STREET, HOUSE } from "../src/ep002/geo";

type Q = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);
const LAY = layoutOf(C1_BUILD);
const f2 = (x: number) => x.toFixed(2), f1 = (x: number) => x.toFixed(1), f3 = (x: number) => x.toFixed(3);
const sm = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };
const out: string[] = [];
const log = (s = "") => { out.push(s); console.log(s); };
let fails = 0;
const verdict = (ok: boolean) => { if (!ok) fails++; return ok ? "LOLOS" : "GAGAL"; };

// ------------------------------------------------------------------ A. toa room: candidates vs earlier exterior cameras
// v0.1 first idea R1 = at the base of the pole (18, 4.7): Ep 1 final A01 frames (0-1.6 s) show the pole base standing
// free on the pavement (crops in _media/2026-11-006/prep/kontinuitas/a01crop_strip.png), so R1 contradicts Ep 1.
// Candidates behind the row, north of the gang (z -6.5), door in the SOUTH wall onto the gang.
type Room = { id: string; x0: number; x1: number; z0: number; z1: number; h: number };
const ROOMS: Room[] = [
  { id: "R1 pangkal tiang (18; 4,7)", x0: 16.9, x1: 19.3, z0: 2.2, z1: 4.3, h: 2.5 },
  { id: "R2 belakang rumah x 9 (utara gang)", x0: 7.0, x1: 9.4, z0: -9.4, z1: -7.3, h: 2.5 },
  { id: "R3 belakang rumah 7 (utara gang)", x0: -1.2, x1: 1.2, z0: -9.4, z1: -7.3, h: 2.5 },
];
const T_WALL = 0.12;
log("# e006_prep — Ep 5 persiapan visual sebelum VO (angka geometri, bukan render)");
log("");
log("## A. Ruang toa: kandidat lokasi vs kamera eksterior Ep 1-4");
// boxes that can occlude: row houses (wall + roof slab), both sides
type Box = { name: string; min: V3; max: V3 };
const occ: Box[] = [];
for (const x of NEIGHBOURS.ourSide) occ.push({ name: `rumah x ${x}`, min: [x - 3.85, 0, HOUSE.z0 - 0.2], max: [x + 3.85, 4.3, HOUSE.z1 + 0.2] });
occ.push({ name: "rumah 7", min: [HOUSE.x0 - 0.35, 0, HOUSE.z0 - 0.2], max: [HOUSE.x1 + 0.35, 4.3, HOUSE.z1 + 0.2] });
for (const x of NEIGHBOURS.across) occ.push({ name: `rumah seberang x ${x}`, min: [x - 3.85, 0, STREET.oppositeZ - 0.2], max: [x + 3.85, 4.3, STREET.oppositeZ + 8.2] });
const ray = new THREE.Ray();
const occluded = (from: THREE.Vector3, to: THREE.Vector3) => {
  const d = to.clone().sub(from); const len = d.length(); ray.set(from, d.normalize());
  for (const b of occ) {
    const hit = ray.intersectBox(new THREE.Box3(new THREE.Vector3(...b.min), new THREE.Vector3(...b.max)), new THREE.Vector3());
    if (hit && hit.distanceTo(from) < len - 0.05) return b.name;
  }
  return "";
};
const mkCam = (pos: V3, look: V3, fov: number) => {
  const c = new THREE.PerspectiveCamera(fov, 9 / 16, 0.05, 500); c.position.set(...pos); c.lookAt(...look); c.updateMatrixWorld(); c.updateProjectionMatrix(); return c;
};
const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
// exterior cameras written as literals in src/ep002/AnimaticV3.tsx (Ep 1 final), SetCheck presets, Ep 4 S06
const KW = -4.0 + 0.0; // placeholder (KAMAR.window.x is 2.6 in geo; the window POVs face south and never see z < -5)
void KW;
const camsToCheck: { name: string; pos: V3; look: V3; fov: number }[] = [];
const A01a = { pos: [-14, 9, 13] as V3, look: [6, 1.5, 3.5] as V3, fov: 50 }, A01b = { pos: [-3.2, 4.4, 10.5] as V3, look: [2.6, 1.35, 3.0] as V3, fov: 40 };
for (const u of [0, 0.25, 0.5, 0.75, 1]) camsToCheck.push({ name: `Ep1 A01 u=${u}`, pos: lerp3(A01a.pos, A01b.pos, u), look: lerp3(A01a.look, A01b.look, u), fov: A01a.fov + (A01b.fov - A01a.fov) * u });
camsToCheck.push({ name: "Ep1 A14 tinggi", pos: [-14, 9, 13], look: [3.0, 1.4, 5.0], fov: 48 });
camsToCheck.push({ name: "Ep1 toa (SetCheck)", pos: [15.2, 1.6, 7.4], look: [18.0, 6.1, 4.7], fov: 42 });
camsToCheck.push({ name: "Ep1 toa rendah (AnimaticV3 a08)", pos: [STREET.toa[0] - 0.55 - 2.2, 1.6, STREET.toa[2] + 2.6], look: [STREET.toa[0] - 0.55, STREET.toaHornY - 0.15, STREET.toa[2]], fov: 30 });
camsToCheck.push({ name: "Ep1 plat 7", pos: [-1.75, 1.15, 5.9], look: [-1.95, 1.05, 4.375], fov: 30 });
camsToCheck.push({ name: "Ep1 POV kamar (SetCheck pov)", pos: [2.6, 1.45, 2.2], look: [1.9, 0.95, 10.0], fov: 46 });
camsToCheck.push({ name: "Ep4 S06 POV jendela", pos: [-0.7, 1.5, 2.66], look: [-1.0, 1.0, 8.0], fov: 44 });
let chosenRoom: Room | null = null;
for (const R of ROOMS) {
  const pts: V3[] = [];
  for (const x of [R.x0, (R.x0 + R.x1) / 2, R.x1]) for (const z of [R.z0, (R.z0 + R.z1) / 2, R.z1]) for (const y of [0.3, 1.25, R.h]) pts.push([x, y, z]);
  log(`### ${R.id}: x ${R.x0}-${R.x1}, z ${R.z0}-${R.z1}, tinggi ${R.h}`);
  let seen = 0;
  for (const c of camsToCheck) {
    const cam = mkCam(c.pos, c.look, c.fov);
    let inFrame = 0, visible = 0; let px = ""; const by = new Set<string>();
    for (const p of pts) {
      const v = new THREE.Vector3(...p).project(cam);
      if (v.z < 1 && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1) {
        inFrame++;
        const o = occluded(cam.position.clone(), new THREE.Vector3(...p));
        if (o) by.add(o); else { visible++; px = `(${Math.round((v.x + 1) * 540)}, ${Math.round((1 - v.y) * 960)})`; }
      }
    }
    seen += visible;
    if (inFrame) log(`  ${c.name}: di bingkai ${inFrame}/${pts.length}, terlihat ${visible}${visible ? ` (mis. px ${px})` : ""}${by.size ? `; tertutup oleh ${[...by].join(", ")}` : ""}`);
  }
  const ourHouses = NEIGHBOURS.ourSide.map((x) => ({ x0: x - NEIGHBOURS.width / 2, x1: x + NEIGHBOURS.width / 2 }));
  const gangClear = R.z1 < HOUSE.z0 - 2.0 ? "lebar gang ≥ 2,0 m" : `gang tinggal ${f2(HOUSE.z0 - R.z1)} m`;
  void ourHouses;
  log(`  ${seen ? `TERLIHAT di ${seen} titik → bertentangan dengan frame lama` : "tidak terlihat dari kamera eksterior yang dicek"}; ${gangClear}; jalan dari pintu belakang rumah 7 (x -0,8) ke pintu ruang: ${f2(Math.abs((R.x0 + R.x1) / 2 + 0.8))} m`);
  if (!seen && !chosenRoom && R.id.startsWith("R2")) chosenRoom = R;
}
log(`  HASIL lokasi: ${chosenRoom ? `${chosenRoom.id} (usulan)` : "tidak ada kandidat R2 yang lolos"}  ${verdict(!!chosenRoom)}`);
const RM = chosenRoom ?? ROOMS[1];
const IN = { x0: RM.x0 + T_WALL, x1: RM.x1 - T_WALL, z0: RM.z0 + T_WALL, z1: RM.z1 - T_WALL };
// inside: console desk along the NORTH wall (Uq faces north, yaw = pi), monitor wall on the north wall, door in the south wall
const DESK = { x0: IN.x0 + 0.3, x1: IN.x1 - 0.3, z0: IN.z0, z1: IN.z0 + 0.58, top: 0.75 };
const MONITORS = { x0: IN.x0 + 0.2, x1: IN.x1 - 0.2, y0: 0.95, y1: 2.2, z: IN.z0 + 0.06 };
log(`  dalam ${f2(IN.x1 - IN.x0)} x ${f2(IN.z1 - IN.z0)} m; meja di dinding utara z ${f2(DESK.z0)}-${f2(DESK.z1)}, tinggi ${DESK.top}; dinding monitor y ${MONITORS.y0}-${MONITORS.y1}; pintu di dinding selatan (ke gang)`);

// ------------------------------------------------------------------ B+C. reach limit -> desk-camera distance -> fov
// Order (advisor 2026-11-24): (1) how far forward Uq's right hand reaches at eye height (lean 0-10 deg, feet still);
// (2) the desk camera sits inside that reach, on the desk; (3) fov last, so the head fills ~40-60 % of the frame height.
// Uq faces NORTH (yaw = pi) toward the desk; mic on a gooseneck at his LEFT; the right hand (rig "L") covers the lens.
const YAW = Math.PI;
const FWD = new THREE.Vector3(Math.sin(YAW), 0, Math.cos(YAW));
const LEFT = new THREE.Vector3(Math.cos(YAW), 0, -Math.sin(YAW)); // the character's own left (+x local)
const HEAD_R = 0.167 * (C1_BUILD.headScale ?? 1) * H_UQ; // head half-width (x) in metres
const handW = (q: Q, root: V3, body: { lean?: number } = {}) =>
  armChain({ armL: [q[0], q[1]] as [number, number], armLFwd: q[2] }, "L", LAY).H.applyMatrix4(c1UpperMatrix(body)).multiplyScalar(H_UQ).applyAxisAngle(UP, YAW).add(new THREE.Vector3(...root));
const elbowW = (q: Q, root: V3, body: { lean?: number } = {}) =>
  armChain({ armL: [q[0], q[1]] as [number, number], armLFwd: q[2] }, "L", LAY).E.applyMatrix4(c1UpperMatrix(body)).multiplyScalar(H_UQ).applyAxisAngle(UP, YAW).add(new THREE.Vector3(...root));
log("");
log("## B. Batas jangkau tangan kanan Uq (kaki diam) pada tinggi mata");
const ROOT0: V3 = [(RM.x0 + RM.x1) / 2, 0, 0]; // z placed below
const headAt = (root: V3) => new THREE.Vector3(...stickHeadCenter(root, H_UQ));
const eyeAt = (root: V3) => headAt(root).addScaledVector(FWD, HEAD_R * 0.85); // eye point on the face surface (approx.)
const reachAt = (dist: number, lean: number) => {
  const root: V3 = [ROOT0[0], 0, -8.0];
  const eye = eyeAt(root);
  const target = eye.clone().addScaledVector(FWD, dist - 0.04); // palm 4 cm before the lens
  const s = c1ArmIK({ root, yaw: YAW, body: { lean }, side: "L", target: [target.x, target.y, target.z], ref: [70, 15, 0], height: H_UQ, avoidTorso: true, wMin: -60 });
  return { q: [s.arm[0], s.arm[1], s.fwd] as Q, err: s.err, torso: c1ArmTorsoDepth([s.arm[0], s.arm[1], s.fwd], "L", H_UQ) };
};
let reachMax = 0, reachLean = 0;
for (const lean of [0, 5, 10]) {
  let best = 0;
  for (let d = 0.2; d <= 0.9001; d += 0.025) { const r = reachAt(d, lean); if (r.err < 0.01 && r.torso <= 0.002) best = d; }
  log(`  lean ${lean}°: lensa terjauh yang tertutup telapak (galat < 1 cm, lengan di luar torso) = ${f3(best)} m dari mata`);
  if (best > reachMax) { reachMax = best; reachLean = lean; }
}
const D = Math.round((reachMax - 0.05) * 100) / 100; // keep 5 cm inside the limit
log(`  dipakai: jarak lensa-mata ${f2(D)} m (5 cm di dalam batas ${f3(reachMax)} m; lean sampai ${reachLean}°)  ${verdict(D >= 0.3)}`);

log("");
log("## C. Tatapan ke lensa kamera meja (setinggi mata, lurus di depan)");
// stand Uq so the lens sits on the desk, 8 cm behind its front edge, and the body clears the desk edge
const lensZ = DESK.z1 - 0.08;
const eyeZoff = eyeAt([0, 0, 0]).z; // eye z relative to root z
const rootZ = lensZ - FWD.z * D * -1 - eyeZoff; // FWD.z = -1: lens = eye + FWD*D
const UQ_ROOT: V3 = [ROOT0[0], 0, lensZ + D - eyeZoff];
void rootZ;
const eye = eyeAt(UQ_ROOT), head = headAt(UQ_ROOT);
const LENS = eye.clone().addScaledVector(FWD, D);
const bodyToDesk = UQ_ROOT[2] - DESK.z1 - 0.22;
log(`  Uq root (${UQ_ROOT.map(f2).join(", ")}), menghadap utara; mata y ${f3(eye.y)}; lensa (${[LENS.x, LENS.y, LENS.z].map(f2).join(", ")}) di atas meja (8 cm dari tepi); badan ke tepi meja ${f2(bodyToDesk)} m  ${verdict(bodyToDesk > 0.03 && UQ_ROOT[2] < IN.z1 - 0.3)}`);
const MIC = head.clone().addScaledVector(LEFT, 0.2).addScaledVector(FWD, 0.16).setY(head.y - 0.2); // mic head at chin height, left
log(`  mikrofon (${[MIC.x, MIC.y, MIC.z].map(f2).join(", ")}): kiri Uq, 16 cm di depan, setinggi dagu`);
const contact = THREE.MathUtils.radToDeg(FWD.angleTo(LENS.clone().sub(eye).normalize()));
let chosenFov = 0;
for (const fov of [50, 60, 66, 72]) {
  const cam = mkCam([LENS.x, LENS.y, LENS.z], [head.x, head.y - 0.06, head.z], fov);
  const c = head.clone().project(cam), top = head.clone().add(new THREE.Vector3(0, HEAD_R * 1.15, 0)).project(cam);
  const cy = (1 - c.y) * 960, ry = Math.abs(top.y - c.y) * 960;
  const m = MIC.clone().project(cam);
  const micToFace = Math.hypot((m.x - c.x) * 540, (m.y - c.y) * 960) - ry;
  const frac = (2 * ry) / 1920;
  const ok = contact < 2 && frac >= 0.38 && frac <= 0.62 && cy + ry < 0.66 * 1920 && micToFace > 20;
  log(`  fov ${fov}: kontak mata ${f1(contact)}°, kepala ${Math.round(frac * 100)} % tinggi bingkai, pusat wajah y ${Math.round(cy)} px, dagu y ${Math.round(cy + ry)} px (pita caption mulai ± 1267 px), mikrofon ${micToFace > 0 ? `${Math.round(micToFace)} px di luar wajah` : `${Math.round(-micToFace)} px MASUK wajah`}  ${ok ? "LOLOS" : "-"}`);
  if (ok && !chosenFov) chosenFov = fov;
}
log(`  dipakai: fov ${chosenFov || "-"} (lensa lebar kamera kecil/webcam)  ${verdict(!!chosenFov)}`);

log("");
log("## D. Raihan ke lensa: dari istirahat ke menutup lensa");
{
  const target = LENS.clone().addScaledVector(FWD, -0.04);
  let chosen = "";
  for (const lean of [0, 5, 10]) {
    const s = c1ArmIK({ root: UQ_ROOT, yaw: YAW, body: { lean }, side: "L", target: [target.x, target.y, target.z], ref: [70, 15, 0], height: H_UQ, avoidTorso: true, wMin: -60 });
    const q1: Q = [s.arm[0], s.arm[1], s.fwd];
    for (const T of [0.7, 0.9]) {
      const n = Math.round(T * 30);
      let step = 0, torso = 0, clrMic = 9, clrDesk = 9; let prev: Q = REST_UQ;
      for (let f = 0; f <= n; f++) {
        const u = sm(f / n);
        const q: Q = [REST_UQ[0] + (q1[0] - REST_UQ[0]) * u, REST_UQ[1] + (q1[1] - REST_UQ[1]) * u, REST_UQ[2] + (q1[2] - REST_UQ[2]) * u];
        const bl = { lean: lean * u };
        step = Math.max(step, Math.abs(q[0] - prev[0]), Math.abs(q[1] - prev[1]), Math.abs(q[2] - prev[2]));
        torso = Math.max(torso, c1ArmTorsoDepth(q, "L", H_UQ));
        const h = handW(q, UQ_ROOT, bl), e = elbowW(q, UQ_ROOT, bl);
        for (const p of [h, e, h.clone().lerp(e, 0.5)]) {
          clrMic = Math.min(clrMic, p.distanceTo(MIC) - 0.04 - 0.035);
          if (p.z < DESK.z1 && p.x > DESK.x0 && p.x < DESK.x1) clrDesk = Math.min(clrDesk, p.y - DESK.top - 0.04);
        }
        prev = q;
      }
      const visH = 2 * 0.04 * Math.tan(THREE.MathUtils.degToRad((chosenFov || 66) / 2));
      const ok = s.err < 0.01 && step <= 11.1 && torso <= 0.002 && clrMic > 0 && clrDesk > 0;
      log(`  lean ${lean}°, ${T} s: galat telapak ${f3(s.err)} m, sendi maks ${f1(step)} °/frame (batas 11,1), lengan dalam torso ${f2(torso * 100)} cm (batas 0,2), ke mikrofon ${f2(clrMic)} m, ke meja ${f2(clrDesk)} m; pada 4 cm dari lensa bingkai setinggi ${f3(visH)} m tertutup tangan (± 0,09 m)  ${ok ? "LOLOS" : "-"}`);
      if (ok && !chosen) chosen = `lean ${lean}°, ${T} s, pose akhir rig [${q1.map(f1).join(", ")}]`;
    }
  }
  log(`  dipakai: ${chosen || "-"}  ${verdict(!!chosen)}`);
}
log("");
log("## E. Opsi: tatap dari jarak lebih jauh, lalu satu langkah + raihan (jangkau lengan C1 hanya ± 0,35 m). S15 tanpa caption: tidak ada batas pita caption; lensa close-up inkbeat 40-50° (camera-and-editing.md); target kepala 45-60 %");
{
  let pick = "";
  for (const Dst of [0.6, 0.7, 0.8, 0.9, 1.0, 1.1]) {
    const root: V3 = [UQ_ROOT[0], 0, LENS.z + Dst - eyeZoff];
    const hd = headAt(root);
    for (const fov of [40, 45, 50, 55, 60]) {
      const cam = mkCam([LENS.x, LENS.y, LENS.z], [hd.x, hd.y - 0.06, hd.z], fov);
      const c = hd.clone().project(cam), top = hd.clone().add(new THREE.Vector3(0, HEAD_R * 1.15, 0)).project(cam);
      const cy = (1 - c.y) * 960, ry = Math.abs(top.y - c.y) * 960, frac = (2 * ry) / 1920;
      const roomBack = IN.z1 - (root[2] + 0.22);
      const ok = frac >= 0.45 && frac <= 0.6;
      if (ok) log(`  jarak mata-lensa ${f2(Dst)} m, fov ${fov}: kepala ${Math.round(frac * 100)} %, dagu y ${Math.round(cy + ry)} px, sisa ruang di belakang badan ${f2(roomBack)} m${roomBack < 0.05 ? " (ruang perlu diperdalam)" : ""}; langkah maju yang perlu ${f2(Dst - D)} m  LOLOS`);
      if (ok && !pick && fov <= 50 && roomBack > 0.05) pick = `${f2(Dst)} m, fov ${fov}, langkah ${f2(Dst - D)} m`;
    }
  }
  log(`  usulan: ${pick || "-"} (langkah maju satu kaki = gerak baru di set ini; uji gerak resep §14 sebelum shot)`);
}
log("");
log(`Batas: badan = model titik lengan (bahu-siku-telapak), mikrofon = bola r 0,035, tangan = bola r 0,04; ukuran tangan 0,09 m perkiraan. Kaki tidak bergerak. Lolos angka ≠ gerak terlihat wajar (dinilai pemilik pada putar normal).`);
log(`HASIL: ${fails ? `GAGAL (${fails})` : "LOLOS"}`);
import("node:fs").then((fs) => { fs.mkdirSync("../_media/2026-11-006/prep", { recursive: true }); fs.writeFileSync("../_media/2026-11-006/prep/e006_prep.txt", out.join("\n") + "\n"); });
process.exitCode = fails ? 1 : 0;
