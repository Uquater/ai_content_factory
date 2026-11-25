// Numeric checks for the 2026-11-003 pilot (S03–S06), every frame, from the SAME stageAt(t) the composition renders:
//   - body clearance to the walls/objects (STUDIO-WORKFLOW §10.6; same sampling as tools/ld003_clearance.ts)
//   - per arm: elbow bend (deg; ~0 = a straight "hose"), arm centre line inside the torso (c1ArmTorsoDepth), joint
//     angle step per frame (≤ ~15°/frame), right palm → bolt knob error while pushing
//   - torch: on/off times, the glass in the beam window
// Run from studio/:
//   npx esbuild tools/p003_check.ts --bundle --platform=node --log-level=warning --outfile=out/p003_check.cjs && node out/p003_check.cjs [--keys]
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { C1_BUILD, C1_HEIGHT } from "../src/c1/c1rig";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { FPS } from "../src/ep003/pilot003Stage";
import { P1 } from "../src/ep003/pilot003Stage";
import { P2 } from "../src/ep003/pilot003V2";
import { P3 } from "../src/ep003/pilot003V3";
// v2/v3: `node out/p003_check.cjs v2|v3 ...` checks that pilot version (same checks, its stage)
const PV = process.argv.includes("v3") ? P3 : process.argv.includes("v2") ? P2 : P1;
const { ADIK_ARM_LEN, ADIK_AT, ADIK_GAZE, BEAT, END, GLASS_WINDOW, JAMB_HOLD, LINES, POINT_AT, SHOTS, stageAt, TIMING, uqAt } = PV;
import type { CharS } from "../src/ep003/pilot003Stage";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const H = 2.7;
type Box = { name: string; min: V3; max: V3 };
const BOXES: Box[] = [
  { name: "dinding barat lorong", min: [-1.46, 0, -3.2], max: [-1.34, H, -1.0] },
  { name: "dinding timur lorong", min: [-0.26, 0, -3.2], max: [-0.14, H, -1.0] },
  { name: "dinding utara ruang tamu (barat bukaan)", min: [-4.0, 0, -1.06], max: [-1.4, H, -0.94] },
  { name: "dinding utara ruang tamu (timur bukaan)", min: [-0.2, 0, -1.06], max: [1.0, H, -0.94] },
  { name: "dinding dapur-lorong (barat)", min: [-4.0, 0, -3.26], max: [-1.4, H, -3.14] },
  { name: "dinding dapur-lorong (timur)", min: [-0.2, 0, -3.26], max: [1.0, H, -3.14] },
  { name: "dinding utara + daun pintu", min: [-4.0, 0, -5.06], max: [1.0, H, -4.955] },
  { name: "gerendel", min: [-1.27, 1.05, -4.98], max: [-0.88, 1.17, -4.93] },
  { name: "meja dapur", min: [-3.8, 0, -4.94], max: [-1.6, 0.9, -4.32] },
];
const boxDist = (p: THREE.Vector3, b: Box) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]);
  const dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]);
  const dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  const o = Math.hypot(dx, dy, dz);
  if (o > 0) return o;
  return -Math.min(p.x - b.min[0], b.max[0] - p.x, p.y - b.min[1], b.max[1] - p.y, p.z - b.min[2], b.max[2] - p.z);
};
const toWorld = (c: CharS, local: THREE.Vector3) => local.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
type S = { p: THREE.Vector3; r: number; part: string };
const samples = (c: CharS, grip: boolean): S[] => {
  const out: S[] = [];
  for (let k = 0; k <= 10; k++) {
    const v = 0.02 + (0.96 * k) / 10;
    const rx = Math.abs(teeSurface(0.999, v).p.x), rz = Math.abs(teeSurface(0, v).p.z);
    const y = LAY.torsoY0 + v * LAY.torsoH;
    for (let a = 0; a < 24; a++) {
      const th = (a / 24) * Math.PI * 2;
      out.push({ p: toWorld(c, new THREE.Vector3(rx * Math.cos(th), y, rz * Math.sin(th))), r: 0, part: "badan" });
    }
  }
  for (const side of ["L", "R"] as const) {
    const { S: sh, E, H: hd } = armChain(c.pose, side, LAY);
    const nm = side === "L" ? "kanan" : "kiri";
    for (let i = 0; i <= 8; i++) out.push({ p: toWorld(c, sh.clone().lerp(E, i / 8)), r: 0.03, part: `lengan ${nm}` });
    for (let i = 1; i <= 8; i++) {
      // while gripping the knob, the last 3 forearm samples (≤ 4 cm from the wrist) are the intended contact zone:
      // they are tested against the door leaf only (part tag "kontak"), not against the bolt itself
      const contact = grip && c.who === "uq" && side === "L" && i >= 6;
      out.push({ p: toWorld(c, E.clone().lerp(hd, i / 8)), r: 0.03, part: contact ? `kontak lengan bawah ${nm}` : `lengan bawah ${nm}` });
    }
    // the right palm holding the bolt knob is an intended contact: it is reported, not counted as clipping
    // adik's right palm on the east jamb (pilot v1) is an intended contact too: reported as palm → jamb error below
    if (!(grip && c.who === "uq" && side === "L") && !(c.who === "adik" && side === "L")) out.push({ p: toWorld(c, hd), r: 0.05, part: `tangan ${nm}` });
  }
  // adik's jacket over the right forearm (cast/npc.tsx JacketOnArm, at 0.6): sampled from its own geometry (a fold
  // ±0.05 h wide, hanging 0.16 h, 0.078 h along the forearm, 0.022 h thick) instead of a fat radius on the forearm
  if (c.who === "adik") {
    const { E, H: hd } = armChain(c.pose, "L", LAY);
    const fore = hd.clone().sub(E).normalize();
    const wrist = hd.clone().addScaledVector(fore, -0.012);
    const mid = E.clone().lerp(wrist, 0.6);
    const down = new THREE.Vector3(0, -1, 0).addScaledVector(fore, fore.y).normalize();
    const side = new THREE.Vector3().crossVectors(fore, down).normalize();
    for (const sv of [-0.05, -0.025, 0, 0.025, 0.05]) for (const dv of [-0.02, 0.04, 0.1, 0.16]) for (const fv of [-0.039, 0, 0.039])
      out.push({ p: toWorld(c, mid.clone().addScaledVector(side, sv).addScaledVector(down, dv).addScaledVector(fore, fv)), r: 0.011 * c.height, part: "jaket" });
  }
  for (const sx of [-1, 1]) {
    const lp = c.legPose?.[sx < 0 ? "L" : "R"];
    for (let i = 0; i <= 6; i++) out.push({ p: toWorld(c, new THREE.Vector3(sx * 0.045, (LAY.hipY * i) / 6, 0)), r: 0.035, part: "kaki" });
    out.push({ p: toWorld(c, lp ? new THREE.Vector3(...lp.ankle) : new THREE.Vector3(sx * 0.045, 0.03, 0.07)), r: 0.05, part: "sepatu" });
  }
  const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height));
  const ht = new THREE.Vector3(...stickHeadTop(c.root, c.height));
  out.push({ p: hc, r: (ht.y - hc.y) * (c.who === "adik" ? 1.06 : 1), part: "kepala" });
  return out;
};
const clearance = (c: CharS, grip: boolean) => {
  let best = { d: Infinity, part: "", box: "" };
  for (const s of samples(c, grip)) for (const b of BOXES) {
    if (s.part.startsWith("kontak") && b.name === "gerendel") continue;
    const d = boxDist(s.p, b) - s.r;
    if (d < best.d) best = { d, part: s.part, box: b.name };
  }
  return best;
};

const N = Math.round(END * FPS);
type Row = { f: number; t: number; shot: string; clrUq: number; clrUqWhat: string; clrAd: number; clrAdWhat: string; elbowL: number; elbowR: number; torsoL: number; torsoR: number; stepMax: number; grip: number };
const rows: Row[] = [];
let prev: number[] | null = null;
for (let f = 0; f < N; f++) {
  const t = f / FPS;
  const st = stageAt(t);
  const uq = uqAt(t).char;
  const ad = st.chars.find((c) => c.who === "adik") ?? null;
  const grip = t >= BEAT.grab0 + 0.1 && t < BEAT.back0 + 0.2; // hand at or at the knob (intended contact)
  const cu = clearance(uq, grip);
  const ca = ad ? clearance(ad, false) : { d: NaN, part: "", box: "" };
  const qL: [number, number, number] = [uq.pose.armL?.[0] ?? 0, uq.pose.armL?.[1] ?? 0, uq.pose.armLFwd ?? 0];
  const qR: [number, number, number] = [uq.pose.armR?.[0] ?? 0, uq.pose.armR?.[1] ?? 0, uq.pose.armRFwd ?? 0];
  const cur = [...qL, ...qR, uq.yaw * 57.3];
  const step = prev ? Math.max(...cur.map((v, i) => Math.abs(v - prev![i]))) : 0;
  prev = cur;
  // right palm vs the knob while pushing
  let g = NaN;
  if (t >= BEAT.grab1 && t < BEAT.back0) {
    const palm = armChain(uq.pose, "L", LAY).H.multiplyScalar(C1_HEIGHT).applyAxisAngle(UP, uq.yaw).add(new THREE.Vector3(...uq.root));
    const k = Math.min(1, Math.max(0, (t - BEAT.push0) / (BEAT.click - BEAT.push0)));
    const knob = new THREE.Vector3(-0.95 + (1 - k * k * (3 - 2 * k)) * 0.06, 1.15 - 0.01, -5 + 0.044 + 0.03);
    g = palm.distanceTo(knob);
  }
  rows.push({ f, t, shot: st.shot, clrUq: cu.d, clrUqWhat: `${cu.part} ↔ ${cu.box}`, clrAd: ca.d, clrAdWhat: `${ca.part} ↔ ${ca.box}`, elbowL: qL[1], elbowR: qR[1], torsoL: c1ArmTorsoDepth(qL, "L"), torsoR: c1ArmTorsoDepth(qR, "R"), stepMax: step, grip: g });
}
const cm = (x: number) => (x * 100).toFixed(1);
console.log(`pilot 2026-11-003 S03–S06 · timing: ${TIMING} · ${N} frames (${END.toFixed(2)} s)`);
console.log("lines:", LINES.map((l) => `${l.id} ${l.start.toFixed(2)}–${l.end.toFixed(2)}`).join(" · "));
console.log("shots:", SHOTS.map((s) => `${s.id} ${s.start.toFixed(2)}–${s.end.toFixed(2)} (${(s.end - s.start).toFixed(2)} s)`).join(" · "));
console.log("beats:", Object.entries(BEAT).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(" · "));
console.log(`glass in beam: ${GLASS_WINDOW[0].toFixed(2)}–${GLASS_WINDOW[1].toFixed(2)} s (${(GLASS_WINDOW[1] - GLASS_WINDOW[0]).toFixed(2)} s)`);
for (const s of SHOTS) {
  const r = rows.filter((x) => x.shot === s.id);
  const worst = r.reduce((a, b) => (b.clrUq < a.clrUq ? b : a));
  const ad = r.filter((x) => !Number.isNaN(x.clrAd));
  const minAd = ad.length ? Math.min(...ad.map((x) => x.clrAd)) : NaN;
  const adW = ad.length ? ad.reduce((p, q) => (q.clrAd < p.clrAd ? q : p)) : null;
  if (adW) console.log(`   adik terdekat @${adW.t.toFixed(2)}s: ${adW.clrAdWhat}`);
  const eL = r.map((x) => x.elbowL), eR = r.map((x) => x.elbowR);
  console.log(`${s.id}: Uq jarak min ${cm(worst.clrUq)} cm @${worst.t.toFixed(2)}s (${worst.clrUqWhat}) · adik min ${Number.isNaN(minAd) ? "-" : cm(minAd) + " cm"} · siku kanan ${Math.min(...eL).toFixed(0)}–${Math.max(...eL).toFixed(0)}° · siku kiri ${Math.min(...eR).toFixed(0)}–${Math.max(...eR).toFixed(0)}° · lengan dalam torso maks ${cm(Math.max(...r.map((x) => Math.max(x.torsoL, x.torsoR))))} cm · lompatan sudut maks ${Math.max(...r.slice(1).map((x) => x.stepMax)).toFixed(1)}°/frame`);
}
const gr = rows.filter((x) => !Number.isNaN(x.grip));
if (gr.length) console.log(`telapak kanan → kenop gerendel saat mendorong: maks ${cm(Math.max(...gr.map((x) => x.grip)))} cm (${gr.length} frame)`);
const cut = new Set(SHOTS.map((s) => Math.round(s.start * FPS)));
const jumps = rows.filter((x) => x.stepMax > 15 && !cut.has(x.f));
console.log(`lompatan > 15°/frame (di luar potongan): ${jumps.length ? jumps.map((x) => `f${x.f} ${x.stepMax.toFixed(0)}°`).join(", ") : "tidak ada"}`);
const clip = rows.filter((x) => x.clrUq < 0 || x.clrAd < 0);
console.log(`frame tembus (jarak < 0): ${clip.length ? clip.slice(0, 12).map((x) => `f${x.f} ${cm(Math.min(x.clrUq, x.clrAd || 9))}`).join(", ") : "tidak ada"}`);
// S05/S06 eyelines (owner: Uq turns toward the FRONT of the house, not toward adik)
{
  const dirOf = (yaw: number, pitchDeg: number) => new THREE.Vector3(Math.sin(yaw) * Math.cos(pitchDeg * Math.PI / 180), Math.sin(pitchDeg * Math.PI / 180), Math.cos(yaw) * Math.cos(pitchDeg * Math.PI / 180));
  const ang = (a: THREE.Vector3, b: THREE.Vector3) => (a.angleTo(b) * 180) / Math.PI;
  const tE = BEAT.s06 - 0.05;
  const s5 = stageAt(tE);
  const uq = uqAt(tE).char;
  const head = new THREE.Vector3(...stickHeadCenter(uq.root, uq.height));
  const gaze = dirOf(uq.yaw + ((uq.pose.headYaw ?? 0) * Math.PI) / 180, -(uq.pose.headNod ?? 0)); // headNod: + = down
  const to = (p: V3) => new THREE.Vector3(...p).sub(head);
  const adikHead = stickHeadCenter(ADIK_AT, 1.27);
  console.log(`S05 akhir (t ${tE.toFixed(2)}): pandangan Uq (kepala, tanpa mata) → lensa ${ang(gaze, to(s5.cam.pos)).toFixed(0)}° · → kepala adik ${ang(gaze, to(adikHead)).toFixed(0)}° · → pintu depan (x -2,6; y 2,0; z 3,0) ${ang(gaze, to([-2.6, 2.0, 3.0])).toFixed(0)}°`);
  const tA = BEAT.point0 + 0.8;
  const s6 = stageAt(tA);
  const ad = s6.chars[0];
  const ah = new THREE.Vector3(...stickHeadCenter(ad.root, ad.height));
  const ag = dirOf(ad.yaw + ((ad.pose.headYaw ?? 0) * Math.PI) / 180, -(ad.pose.headNod ?? 0));
  const lens = new THREE.Vector3(...s6.cam.pos).sub(ah);
  const glass = new THREE.Vector3(...POINT_AT).sub(ah);
  const pitch = (v: THREE.Vector3) => (Math.asin(v.clone().normalize().y) * 180) / Math.PI;
  console.log(`S06 (t ${tA.toFixed(2)}): pandangan adik → lensa ${ang(ag, lens).toFixed(0)}° · → kaca ${ang(ag, glass).toFixed(0)}° · elevasi pandangan ${pitch(ag).toFixed(0)}°, lensa ${pitch(lens).toFixed(0)}°, kaca ${pitch(glass).toFixed(0)}°`);
}
// adik: right palm on the jamb (every frame), left arm → glass in S06, and the glass inside the S06 frame
{
  let worst = 0;
  for (let f = 0; f < N; f++) {
    const a = stageAt(f / FPS).chars.find((c) => c.who === "adik");
    if (!a) continue;
    const palm = armChain(a.pose, "L", LAY).H.multiplyScalar(a.height).applyAxisAngle(UP, a.yaw).add(new THREE.Vector3(...a.root));
    worst = Math.max(worst, palm.distanceTo(new THREE.Vector3(...JAMB_HOLD)));
  }
  console.log(`adik telapak kanan → kusen timur: maks ${cm(worst)} cm (semua frame dengan adik) · pandangan target kaca: elevasi ${ADIK_GAZE.elev.toFixed(0)}°, yaw ${ADIK_GAZE.yaw.toFixed(1)}°`);
  const tP = BEAT.point0 + 0.8;
  const st = stageAt(tP);
  const a = st.chars.find((c) => c.who === "adik")!;
  const { S: sh, H: hd } = armChain(a.pose, "R", LAY);
  const S = toWorld(a, sh), Hh = toWorld(a, hd);
  const armDir = Hh.clone().sub(S).normalize();
  const Ew = toWorld(a, armChain(a.pose, "R", LAY).E);
  console.log(`S06 lengan kiri adik: panjang ${(ADIK_ARM_LEN * 100).toFixed(1)} cm · bahu→tangan ${(S.distanceTo(Hh) * 100).toFixed(1)} cm · sudut siku ${(180 - (Ew.clone().sub(S).angleTo(Hh.clone().sub(Ew)) * 180) / Math.PI).toFixed(0)}° (180 = lurus)`);
  const toG = new THREE.Vector3(...POINT_AT).sub(S).normalize();
  const view = S.clone().sub(new THREE.Vector3(...st.cam.pos)).normalize();
  const camP = new THREE.PerspectiveCamera(st.cam.fov, 1080 / 1920, 0.05, 100);
  camP.position.set(...st.cam.pos); camP.lookAt(new THREE.Vector3(...st.cam.look)); camP.updateMatrixWorld();
  const pp = (p: THREE.Vector3) => { const v = p.clone().project(camP); return new THREE.Vector2((v.x + 1) * 540, (1 - v.y) * 960); };
  const sA = pp(S), hA = pp(Hh), gA = pp(new THREE.Vector3(-0.8, 2.32, -4.94));
  const imgAng = (hA.clone().sub(sA).angle() - gA.clone().sub(sA).angle()) * 180 / Math.PI;
  console.log(`S06 di layar: panjang lengan ${hA.distanceTo(sA).toFixed(0)} px · garis lengan vs arah ke kaca ${(((imgAng + 540) % 360) - 180).toFixed(1)}° · kemiringan lengan dari horizontal ${(-Math.atan2(hA.y - sA.y, hA.x - sA.x) * 180 / Math.PI).toFixed(0)}°`);
  console.log(`S06 lengan kiri adik (t ${tP.toFixed(2)}): arah lengan → kaca ${((armDir.angleTo(toG) * 180) / Math.PI).toFixed(1)}° · lengan ↔ sinar kamera ${((armDir.angleTo(view) * 180) / Math.PI).toFixed(0)}° (90° = tanpa pemendekan, 0° = lurus ke lensa)`);
  // project the glass and adik's head/hand into the S06 frame (1080 × 1920)
  const camObj = new THREE.PerspectiveCamera(st.cam.fov, 1080 / 1920, 0.05, 100);
  camObj.position.set(...st.cam.pos);
  camObj.lookAt(new THREE.Vector3(...st.cam.look));
  camObj.updateMatrixWorld();
  const px = (p: THREE.Vector3) => {
    const v = p.clone().project(camObj);
    return `(${Math.round((v.x + 1) * 540)}, ${Math.round((1 - v.y) * 960)})`;
  };
  const glassC = new THREE.Vector3(-0.8, 2.32, -4.94);
  console.log(`S06 bingkai (px, 1080×1920): kaca ${px(glassC)} · tepi kaca kiri/kanan ${px(glassC.clone().add(new THREE.Vector3(-0.25, 0, 0)))} ${px(glassC.clone().add(new THREE.Vector3(0.25, 0, 0)))} · kepala adik ${px(new THREE.Vector3(...stickHeadCenter(a.root, a.height)))} · tangan kiri adik ${px(Hh)} · kepala Uq ${px(new THREE.Vector3(...stickHeadCenter(uqAt(tP).char.root, 1.5)))} · pita subtitle y 1264–1424`);
}
// adik arms every frame (pilot v1): angle step (≤ ~15°/frame outside cuts) and arm-in-torso depth (c1ArmTorsoDepth on
// the shared rig, adik scale), plus Uq's face vs the S06 lens / adik (D-039 butir 3: Uq does not look at adik)
{
  let prevA: number[] | null = null, worstStep = { v: 0, f: -1 }, worstTorso = { v: -9, f: -1 };
  const cutF = new Set(SHOTS.map((s) => Math.round(s.start * FPS)));
  for (let f = 0; f < N; f++) {
    const a = stageAt(f / FPS).chars.find((c) => c.who === "adik");
    if (!a) { prevA = null; continue; }
    const qL: [number, number, number] = [a.pose.armL?.[0] ?? 0, a.pose.armL?.[1] ?? 0, a.pose.armLFwd ?? 0];
    const qR: [number, number, number] = [a.pose.armR?.[0] ?? 0, a.pose.armR?.[1] ?? 0, a.pose.armRFwd ?? 0];
    const cur = [...qL, ...qR, a.pose.headNod ?? 0, a.pose.headYaw ?? 0];
    if (prevA && !cutF.has(f)) {
      const st = Math.max(...cur.map((v, i) => Math.abs(v - prevA![i])));
      if (st > worstStep.v) worstStep = { v: st, f };
    }
    prevA = cur;
    const td = Math.max(c1ArmTorsoDepth(qL, "L"), c1ArmTorsoDepth(qR, "R")) * (a.height / C1_HEIGHT);
    if (td > worstTorso.v) worstTorso = { v: td, f };
  }
  console.log(`adik lengan/kepala: lompatan sudut maks ${worstStep.v.toFixed(1)}°/frame @f${worstStep.f} · lengan dalam torso maks ${cm(worstTorso.v)} cm @f${worstTorso.f}`);
  const tU = BEAT.point0 + 0.8;
  const st6 = stageAt(tU);
  const u6 = uqAt(tU).char;
  const hU = new THREE.Vector3(...stickHeadCenter(u6.root, u6.height));
  const dirOf = (yaw: number, pitchDeg: number) => new THREE.Vector3(Math.sin(yaw) * Math.cos(pitchDeg * Math.PI / 180), Math.sin(pitchDeg * Math.PI / 180), Math.cos(yaw) * Math.cos(pitchDeg * Math.PI / 180));
  const gU = dirOf(u6.yaw + ((u6.pose.headYaw ?? 0) * Math.PI) / 180, -(u6.pose.headNod ?? 0));
  const deg = (v: THREE.Vector3) => ((gU.angleTo(v) * 180) / Math.PI).toFixed(0);
  console.log(`S06 wajah Uq (t ${tU.toFixed(2)}) → lensa S06 ${deg(new THREE.Vector3(...st6.cam.pos).sub(hU))}° · → kepala adik ${deg(new THREE.Vector3(...stickHeadCenter(ADIK_AT, 1.27)).sub(hU))}° · → pintu depan ${deg(new THREE.Vector3(-2.6, 2.0, 3.0).sub(hU))}°`);
}
if (process.argv.includes("--keys")) {
  console.log("\nkey frames (QC jarak tubuh):");
  const keys: [string, number][] = [["S03 jalan", 1.5], ["S03 berhenti", BEAT.walkStop + 0.6], ["S03 senter nyala", BEAT.torchOn + 0.2], ["S03 kaca", (GLASS_WINDOW[0] + GLASS_WINDOW[1]) / 2], ["S03 gerendel", BEAT.sw1 - 0.1], ["S03 akhir langkah", BEAT.st1 - 0.06], ["S04 pegang", BEAT.grab1 + 0.05], ["S04 klik", BEAT.click], ["S05 awal", BEAT.s05 + 0.05], ["S05 senter mati", BEAT.torchOff], ["S05 berbalik", BEAT.turn1], ["S06 menunjuk", BEAT.point0 + 0.8]];
  for (const [n, t] of keys) {
    const r = rows[Math.min(rows.length - 1, Math.round(t * FPS))];
    console.log(`${n.padEnd(18)} t ${t.toFixed(2)} f${r.f} · Uq ${cm(r.clrUq)} cm (${r.clrUqWhat}) · adik ${Number.isNaN(r.clrAd) ? "-" : cm(r.clrAd) + " cm"} · siku kanan ${r.elbowL.toFixed(0)}° kiri ${r.elbowR.toFixed(0)}° · torso ${cm(Math.max(r.torsoL, r.torsoR))} cm`);
  }
}
