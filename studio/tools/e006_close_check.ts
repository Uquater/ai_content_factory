// Episode 5 closing-shot animatic v0: numbers per frame (video-production §14 limits) BEFORE the render.
//   npx esbuild tools/e006_close_check.ts --bundle --platform=node --log-level=warning --outfile=out/e006_close_check.cjs && node out/e006_close_check.cjs
// Writes ../_media/2026-11-006/out/animatic_close_v0/qc/e006_close_check.txt. Exit 1 = a limit failed.
import * as THREE from "three";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { C1_BUILD, c1UpperMatrix } from "../src/c1/c1rig";
import { stickHeadCenter } from "../src/c1/C1";
import { blinkAt } from "../src/inkbeat/char/Character3D";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { H_UQ } from "../src/ep004/motion004";
import { BLINK_SEED, DESK, EYE_FWD, IN, KEY_ERRS, KEY_TIMES, LENS, MIC, Q_REACH, REACH_ERR, ROOT_A, T, uqAt, YAW } from "../src/ep006/closeMotion006";

const LAY = layoutOf(C1_BUILD);
// self-test of the checker (lesson 2026-11-24 step 7): DESK_UP=0.05 raises the desk top 5 cm and must FAIL
const DTOP = DESK.top + Number(process.env.DESK_UP ?? 0);
const UP = new THREE.Vector3(0, 1, 0);
const out: string[] = [];
const log = (s = "") => { out.push(s); console.log(s); };
const f1 = (x: number) => x.toFixed(1), f2 = (x: number) => x.toFixed(2), f3 = (x: number) => x.toFixed(3);
let fails = 0;
const v = (ok: boolean) => { if (!ok) fails++; return ok ? "LOLOS" : "GAGAL"; };
const toWorldUpper = (local: THREE.Vector3, root: V3, lean: number) => local.clone().applyMatrix4(c1UpperMatrix({ lean })).multiplyScalar(H_UQ).applyAxisAngle(UP, YAW).add(new THREE.Vector3(...root));
const armPts = (q: [number, number, number], root: V3, lean: number) => {
  const { S, E, H } = armChain({ armL: [q[0], q[1]], armLFwd: q[2] }, "L", LAY);
  return { S: toWorldUpper(S, root, lean), E: toWorldUpper(E, root, lean), H: toWorldUpper(H, root, lean) };
};
const cam = new THREE.PerspectiveCamera(50, 9 / 16, 0.02, 50);
cam.position.set(...LENS); cam.lookAt(ROOT_A[0], LENS[1] - 0.06, ROOT_A[2]); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
const HEAD_R = 0.167 * (C1_BUILD.headScale ?? 1) * H_UQ;
const FWD = new THREE.Vector3(Math.sin(YAW), 0, Math.cos(YAW));

log("# e006_close_check — animatic penutup v0 (angka per frame, sebelum render)");
log(`lensa (${LENS.join(", ")}), fov 50; tatap ${T.stare.join("–")} s, langkah ${T.step.join("–")} s (0,40 m), raih ${T.reach.join("–")} s, putus ${T.cut} s`);
log(`kunci raihan ${KEY_TIMES.map((x) => x.toFixed(2)).join(" / ")} s, galat IK per kunci ${KEY_ERRS.map(f3).join(" / ")} m`);
log(`pose akhir lengan kanan (rig L) [${Q_REACH.map(f1).join(", ")}], galat IK telapak ${f3(REACH_ERR)} m  ${v(REACH_ERR < 0.01)}`);
let blinks = 0;
for (let f = 0; f <= Math.round(T.cut * 30); f++) if (blinkAt(f / 30, BLINK_SEED)) blinks++;
log(`kedip selama 0–${T.cut} s (seed ${BLINK_SEED}): ${blinks} frame  ${v(blinks === 0)}`);

let prevQ: [number, number, number] | null = null, prevRoot: V3 | null = null;
let stepMax = 0, stepAt = 0, torsoMax = 0, deskMin = 9, deskAt = 0, micMin = 9, micAt = 0, bodyDesk = 9, footMin = 9, footMax = 0, crossMin = 9, speedMax = 0, contactStareMax = 0, contactAll = 0;
let handFirst = -1, handFrames = 0;
let headFrac0 = 0, headFracCut = 0, eyeY0 = 0, eyeX0 = 0;
const nCut = Math.round(T.cut * 30);
for (let f = 0; f < nCut; f++) {
  const t = f / 30;
  const u = uqAt(t);
  const q = u.q as [number, number, number];
  if (prevQ) { const s = Math.max(Math.abs(q[0] - prevQ[0]), Math.abs(q[1] - prevQ[1]), Math.abs(q[2] - prevQ[2])); if (s > stepMax) { stepMax = s; stepAt = t; } }
  if (prevRoot) speedMax = Math.max(speedMax, Math.hypot(u.root[0] - prevRoot[0], u.root[2] - prevRoot[2]) * 30);
  torsoMax = Math.max(torsoMax, c1ArmTorsoDepth(q, "L", H_UQ));
  const a = armPts(q, u.root, u.lean);
  for (const [name, p] of [["telapak", a.H], ["siku", a.E], ["lengan bawah", a.H.clone().lerp(a.E, 0.5)]] as [string, THREE.Vector3][]) {
    const r = name === "telapak" ? 0.04 : 0.035;
    // desk: top surface where the point is over the desk; front face where it is in front of it below the top
    const overX = p.x > DESK.x0 && p.x < DESK.x1;
    let dd = 9;
    if (overX && p.z < DESK.z1 + r && p.z > DESK.z0) dd = p.y - DTOP - r;
    if (overX && p.y < DTOP) dd = Math.min(dd, p.z - DESK.z1 - r);
    if (dd < deskMin) { deskMin = dd; deskAt = t; }
    const dm = p.distanceTo(new THREE.Vector3(...MIC)) - r - 0.035;
    if (dm < micMin) { micMin = dm; micAt = t; void name; }
  }
  bodyDesk = Math.min(bodyDesk, u.root[2] - DESK.z1 - 0.22);
  // feet: code "L" = the character's own right (-x local). Facing north (yaw pi), local -x = world +x.
  const L = u.feet.L, R = u.feet.R;
  const gap = Math.hypot(L[0] - R[0], L[2] - R[2]);
  footMin = Math.min(footMin, gap); footMax = Math.max(footMax, gap);
  crossMin = Math.min(crossMin, (L[0] - R[0])); // > 0 = right foot stays on his right (+x world)
  // eye point and contact angle (head nod cancels the lean's pitch; the eye point itself moves with the lean)
  const hc = stickHeadCenter([0, 0, 0], H_UQ);
  const eye = toWorldUpper(new THREE.Vector3(0, hc[1] / H_UQ, 0).add(new THREE.Vector3(0, 0, EYE_FWD / H_UQ)), u.root, u.lean);
  const toLens = new THREE.Vector3(...LENS).sub(eye).normalize();
  const ang = THREE.MathUtils.radToDeg(FWD.angleTo(toLens));
  if (t < T.stare[1]) contactStareMax = Math.max(contactStareMax, ang);
  contactAll = Math.max(contactAll, ang);
  const head = toWorldUpper(new THREE.Vector3(0, hc[1] / H_UQ, 0), u.root, u.lean);
  const pc = head.clone().project(cam), pt = head.clone().add(new THREE.Vector3(0, HEAD_R * 1.15, 0)).project(cam), pe = eye.clone().project(cam);
  const frac = Math.abs(pt.y - pc.y);
  if (f === 0) { headFrac0 = frac; eyeY0 = (1 - pe.y) * 960; eyeX0 = (pe.x + 1) * 540; }
  headFracCut = frac;
  const ph = a.H.clone().project(cam);
  if (ph.z < 1 && Math.abs(ph.x) <= 1 && ph.y >= -1 && ph.y <= 1) { handFrames++; if (handFirst < 0) handFirst = t; }
  prevQ = q; prevRoot = u.root;
}
const last = uqAt(T.cut - 1 / 30);
const palmEnd = armPts(last.q as [number, number, number], last.root, last.lean).H;
const palmLens = palmEnd.distanceTo(new THREE.Vector3(...LENS));
log("");
log(`sendi lengan kanan maks ${f1(stepMax)} °/frame di ${f2(stepAt)} s (batas 11,1)  ${v(stepMax <= 11.1)}`);
log(`lengan masuk torso maks ${f2(torsoMax * 100)} cm (batas 0,2)  ${v(torsoMax <= 0.002)}`);
log(`telapak/siku/lengan bawah ke meja: terdekat ${f3(deskMin)} m di ${f2(deskAt)} s  ${v(deskMin > 0)}`);
log(`telapak/siku/lengan bawah ke mikrofon: terdekat ${f3(micMin)} m di ${f2(micAt)} s  ${v(micMin > 0)}`);
log(`telapak ke lensa pada frame terakhir sebelum putus: ${f3(palmLens)} m (sasaran 0,04)  ${v(palmLens < 0.07)}`);
log(`badan (silinder r 0,22) ke tepi meja: terdekat ${f3(bodyDesk)} m  ${v(bodyDesk > 0.03)}`);
log(`kaki: jarak ${f3(footMin)}–${f3(footMax)} m; kaki kanan tetap di kanan (selisih x min ${f3(crossMin)} m)  ${v(crossMin > 0.02)}`);
log(`kecepatan badan maks ${f2(speedMax)} m/s (Ep 4: 1,49)`);
log(`kontak mata: maks ${f1(contactStareMax)}° selama tatap; maks ${f1(contactAll)}° sampai putus (condong ${5}° saat meraih menurunkan titik mata)  ${v(contactStareMax < 2)}`);
log(`framing: kepala ${Math.round(headFrac0 * 100)} % tinggi bingkai di awal (sasaran 45–60), ${Math.round(headFracCut * 100)} % saat putus; mata di px (${Math.round(eyeX0)}, ${Math.round(eyeY0)}) di awal  ${v(headFrac0 >= 0.45 && headFrac0 <= 0.6)}`);
log(`telapak di dalam bingkai: mulai ${handFirst.toFixed(2)} s, ${handFrames} frame sebelum putus (${(handFrames / 30).toFixed(2)} s)  ${v(handFrames >= 12)}`);
log(`ruang di belakang badan saat tatap: ${f3(IN.z1 - (ROOT_A[2] + 0.22))} m`);
log("");
log("Batas: lengan = 3 titik (bola r 0,035–0,04), badan silinder, mikrofon bola r 0,035; kaki dari stepper (tanpa cek tembus lantai). Lolos angka ≠ gerak terlihat wajar.");
log(`HASIL: ${fails ? `GAGAL (${fails})` : "LOLOS"}`);
import("node:fs").then((fs) => { fs.mkdirSync("../_media/2026-11-006/out/animatic_close_v0/qc", { recursive: true }); fs.writeFileSync("../_media/2026-11-006/out/animatic_close_v0/qc/e006_close_check.txt", out.join("\n") + "\n"); });
process.exitCode = fails ? 1 : 0;
