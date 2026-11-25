// Episode 3 (2026-11-004) S02: can Uq's RIGHT hand (C1 side "L") cover adik's mouth? Numbers before any still
// (STUDIO-WORKFLOW §10 butir 5; lessons 2026-11-16 pilot throat IK, 2026-11-17 lengan hilang).
// Start = the end of Episode 2 (episodeAt(END), both facing the window, adik on his right). Candidates move adik
// forward (toward the window) by f metres and toward/away from Uq by s metres. For each candidate:
//   palm error (c1ArmIK, avoidTorso), arm-in-own-torso depth (c1ArmTorsoDepth), elbow angle, arm vs adik (head sphere,
//   torso rings, her arms), palm vs her face surface, body vs body, walls/furniture, and the per-frame joint step over
//   a 0.8 s path from his hanging hand (low along the outside of his body, then up to her mouth).
// Run from studio/:
//   npx esbuild tools/e004_mouth_check.ts --bundle --platform=node --log-level=warning --outfile=out/e004_mouth_check.cjs && node out/e004_mouth_check.cjs
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { c1ArmIK, c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { C1_BUILD, C1_HEIGHT } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { END, episodeAt } from "../src/ep003/episode003Stage";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
type Q = [number, number, number];
type Ch = { root: V3; yaw: number; height: number; pose: Record<string, unknown> };
const W = (c: Ch, p: THREE.Vector3) => p.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
const fwd = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));

const st = episodeAt(END - 1 / 30);
const uq0 = st.chars.find((c) => c.who === "uq")! as unknown as Ch;
const ad0 = st.chars.find((c) => c.who === "adik")! as unknown as Ch;
const poseEp2 = uq0.pose as { armL: [number, number]; armLFwd: number };
// Ep 2's last grip pose has the arm's centre line 7.5 cm inside his tee (c1ArmTorsoDepth; pre-existing, Ep 2 is not
// changed). S02 starts after a cut, so the same grip (same palm point) is re-solved with avoidTorso as the start pose.
const gripPalm = (() => { const { H } = armChain({ armL: poseEp2.armL, armLFwd: poseEp2.armLFwd } as never, "L", LAY); return H.clone().multiplyScalar(uq0.height).applyAxisAngle(UP, uq0.yaw).add(new THREE.Vector3(...uq0.root)); })();
const g0 = c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: [gripPalm.x, gripPalm.y, gripPalm.z], ref: [10, 60, 0], avoidTorso: true, wMin: -60 });
const pose0 = { armL: g0.arm, armLFwd: g0.fwd };
console.log(`genggam akhir Ep 2: q=[${poseEp2.armL.map((v) => v.toFixed(0))},${poseEp2.armLFwd.toFixed(0)}] torso ${(c1ArmTorsoDepth([poseEp2.armL[0], poseEp2.armL[1], poseEp2.armLFwd], "L") * 100).toFixed(1)} cm → diselesaikan ulang q=[${g0.arm.map((v) => v.toFixed(0))},${g0.fwd.toFixed(0)}] galat ${(g0.err * 100).toFixed(1)} cm, torso ${(c1ArmTorsoDepth([g0.arm[0], g0.arm[1], g0.fwd], "L") * 100).toFixed(1)} cm`);

// body samples (torso rings + arms + head), as tools/ld003_clearance.ts
type S = { p: THREE.Vector3; r: number; part: string };
const bodySamples = (c: Ch, who: "uq" | "adik", skipArm?: "L" | "R"): S[] => {
  const out: S[] = [];
  for (let k = 0; k <= 10; k++) {
    const v = 0.02 + (0.96 * k) / 10;
    const rx = Math.abs(teeSurface(0.999, v).p.x), rz = Math.abs(teeSurface(0, v).p.z);
    const y = LAY.torsoY0 + v * LAY.torsoH;
    for (let a = 0; a < 24; a++) { const th = (a / 24) * Math.PI * 2; out.push({ p: W(c, new THREE.Vector3(rx * Math.cos(th), y, rz * Math.sin(th))), r: 0, part: "badan" }); }
  }
  for (const side of ["L", "R"] as const) {
    if (side === skipArm) continue;
    const { S: sh, E, H } = armChain(c.pose as never, side, LAY);
    for (let i = 0; i <= 8; i++) out.push({ p: W(c, sh.clone().lerp(E, i / 8)), r: 0.03, part: `lengan ${side}` });
    for (let i = 1; i <= 8; i++) out.push({ p: W(c, E.clone().lerp(H, i / 8)), r: who === "adik" && side === "L" ? 0.07 : 0.03, part: who === "adik" && side === "L" ? "lengan kanan + jaket" : `lengan ${side}` });
  }
  const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height)), ht = new THREE.Vector3(...stickHeadTop(c.root, c.height));
  out.push({ p: hc, r: (ht.y - hc.y) * (who === "adik" ? 1.06 : 1), part: "kepala" });
  return out;
};
const armPts = (c: Ch, q: Q) => {
  const { S: sh, E, H } = armChain({ armL: [q[0], q[1]], armLFwd: q[2] } as never, "L", LAY);
  const pts: { p: THREE.Vector3; u: number }[] = [];
  for (let i = 3; i <= 8; i++) pts.push({ p: W(c, sh.clone().lerp(E, i / 8)), u: i / 16 });
  for (let i = 1; i <= 10; i++) pts.push({ p: W(c, E.clone().lerp(H, i / 10)), u: 0.5 + i / 20 });
  return pts;
};
const BOXES: { name: string; min: V3; max: V3 }[] = [
  { name: "dinding depan (z 3,0)", min: [-4, 0, 2.94], max: [4, 2.7, 3.06] },
  { name: "dinding kamar (x 1,0)", min: [0.94, 0, -1], max: [1.06, 2.7, 3] },
  { name: "meja tamu", min: [-2.9, 0, 0.275], max: [-1.9, 0.45, 0.825] },
  { name: "sofa", min: [-3.3, 0, -0.925], max: [-1.5, 0.92, -0.175] },
  { name: "lemari rendah barat", min: [-3.94, 0, 0.75], max: [-3.49, 0.8, 2.05] },
];
const boxDist = (p: THREE.Vector3, b: { min: V3; max: V3 }) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]), dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]), dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  const o = Math.hypot(dx, dy, dz);
  return o > 0 ? o : -Math.min(p.x - b.min[0], b.max[0] - p.x, p.y - b.min[1], b.max[1] - p.y, p.z - b.min[2], b.max[2] - p.z);
};

let DEBUG = false;
const evalCase = (f: number, s: number, verbose = false) => {
  const fA = fwd(ad0.yaw);
  const toUq = new THREE.Vector3(uq0.root[0] - ad0.root[0], 0, uq0.root[2] - ad0.root[2]).normalize();
  const root: V3 = [ad0.root[0] + fA.x * f + toUq.x * s, 0, ad0.root[2] + fA.z * f + toUq.z * s];
  const ad: Ch = { ...ad0, root };
  const hc = new THREE.Vector3(...stickHeadCenter(root, ad.height)), ht = new THREE.Vector3(...stickHeadTop(root, ad.height));
  const R = (ht.y - hc.y) * 1.06;
  // mouth on the face surface: forward, a third of the radius below the centre; palm centre 1.3 cm in front of it
  const dirM = fwd(ad.yaw).multiplyScalar(Math.cos(0.34)).add(new THREE.Vector3(0, -Math.sin(0.34), 0)).normalize();
  const mouth = hc.clone().add(dirM.clone().multiplyScalar(R));
  const target = mouth.clone().add(dirM.clone().multiplyScalar(0.013));
  const ikAt = (tg: THREE.Vector3, ref: Q) => c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: [tg.x, tg.y, tg.z], ref, avoidTorso: true, wMin: -60 });
  const sol = ikAt(target, [30, 60, 30]);
  const q: Q = [sol.arm[0], sol.arm[1], sol.fwd];
  const uq: Ch = { ...uq0, pose: { ...uq0.pose, armL: sol.arm, armLFwd: sol.fwd } };
  const depth = c1ArmTorsoDepth(q, "L");
  // arm (sleeve end → wrist, palm excluded) vs adik; palm vs her head surface
  const adS = bodySamples(ad, "adik");
  let armVsAdik = { d: Infinity, part: "" };
  for (const ap of armPts(uq, q)) {
    if (ap.u > 0.93) continue; // the palm itself is meant to touch the face
    for (const sp of adS) { const d = ap.p.distanceTo(sp.p) - sp.r - 0.03; if (d < armVsAdik.d) armVsAdik = { d, part: sp.part }; }
  }
  const palm = armPts(uq, q).slice(-1)[0].p;
  const palmToFace = palm.distanceTo(hc) - R - 0.011; // palm half-thickness ~1.1 cm
  // body vs body (torsos + heads, arms excluded except adik's jacket arm)
  const uqS = bodySamples(uq, "uq", "L");
  let bodyGap = Infinity;
  for (const a of uqS) for (const b of adS) { if (a.part.startsWith("lengan") && b.part.startsWith("lengan")) continue; bodyGap = Math.min(bodyGap, a.p.distanceTo(b.p) - a.r - b.r); }
  // walls / furniture for both
  let wall = { d: Infinity, who: "", box: "" };
  for (const [who, ss] of [["Uq", bodySamples(uq, "uq")], ["adik", adS]] as const) for (const sp of ss) for (const b of BOXES) { const d = boxDist(sp.p, b) - sp.r; if (d < wall.d) wall = { d, who, box: b.name }; }
  // path (joint space, eased, 24 frames = 0.8 s): his hand leaves adik's hand (end of Ep 2 grip) and rises to her
  // mouth while she steps forward to her new root; per frame: joint step, arm-in-own-torso, arm vs adik (palm excluded
  // until the last 4 frames), body vs body
  const q0: Q = [pose0.armL[0], pose0.armL[1], pose0.armLFwd];
  let prev = q0, maxStep = 0, maxErr = 0, maxDepth = 0, minArmAd = Infinity, minBody = Infinity;
  for (let i = 1; i <= 24; i++) {
    const u0 = i / 24, u = u0 * u0 * (3 - 2 * u0);
    const qq: Q = [0, 1, 2].map((k) => q0[k] + (q[k] - q0[k]) * u) as Q;
    const adI: Ch = { ...ad0, root: [ad0.root[0] + (root[0] - ad0.root[0]) * u, 0, ad0.root[2] + (root[2] - ad0.root[2]) * u] };
    const uqI: Ch = { ...uq0, pose: { ...uq0.pose, armL: [qq[0], qq[1]], armLFwd: qq[2] } };
    const adSI = bodySamples(adI, "adik");
    for (const ap of armPts(uqI, qq)) {
      if (i > 20 && ap.u > 0.93) continue;
      for (const sp of adSI) { if (sp.part.startsWith("lengan R") && i < 6) continue; minArmAd = Math.min(minArmAd, ap.p.distanceTo(sp.p) - sp.r - 0.03); }
    }
    for (const a2 of bodySamples(uqI, "uq", "L")) for (const b2 of adSI) { if (a2.part.startsWith("lengan") && b2.part.startsWith("lengan")) continue; minBody = Math.min(minBody, a2.p.distanceTo(b2.p) - a2.r - b2.r); }
    maxStep = Math.max(maxStep, ...qq.map((v, k) => Math.abs(v - prev[k])));
    maxDepth = Math.max(maxDepth, c1ArmTorsoDepth(qq, "L"));
    if (verbose && DEBUG) console.log(`  i${i} q=[${qq.map((v) => v.toFixed(0))}] torso ${(c1ArmTorsoDepth(qq, "L") * 100).toFixed(1)} cm`);
    prev = qq;
  }
  void maxErr;
  const res = { f, s, root, err: sol.err, depth, elbow: q[1], q, armVsAdik, palmToFace, bodyGap, wall, maxStep, maxDepth, minArmAd, minBody };
  const pass = sol.err <= 0.015 && depth <= 0.003 && armVsAdik.d >= 0 && palmToFace > -0.008 && bodyGap >= 0 && wall.d >= 0.03 && maxStep <= 15 && maxDepth <= 0.003 && minArmAd >= -0.005 && minBody >= 0;
  if (verbose)
    console.log(`f=${f.toFixed(2)} s=${s.toFixed(2)} adik=(${root[0].toFixed(2)},${root[2].toFixed(2)}) | telapak ${(sol.err * 100).toFixed(1)} cm, lengan-dalam-torso ${(depth * 100).toFixed(1)} cm, siku ${q[1].toFixed(0)}°, q=[${q.map((v) => v.toFixed(0)).join(",")}] | lengan↔adik ${(armVsAdik.d * 100).toFixed(1)} cm (${armVsAdik.part}), telapak↔wajah ${(palmToFace * 100).toFixed(1)} cm | badan↔badan ${(bodyGap * 100).toFixed(1)} cm | dinding/benda ${(wall.d * 100).toFixed(1)} cm (${wall.who} ↔ ${wall.box}) | lintasan: lompatan maks ${maxStep.toFixed(1)}°/frame, torso maks ${(maxDepth * 100).toFixed(1)} cm, lengan↔adik min ${(minArmAd * 100).toFixed(1)} cm, badan↔badan min ${(minBody * 100).toFixed(1)} cm | ${pass ? "LULUS" : "GAGAL"}`);
  return { ...res, pass };
};

console.log(`q0 = [${pose0.armL[0].toFixed(0)},${pose0.armL[1].toFixed(0)},${pose0.armLFwd.toFixed(0)}]`);
console.log(`awal (akhir Ep 2): Uq ${uq0.root.map((v) => v.toFixed(2))} yaw ${(uq0.yaw * 180 / Math.PI).toFixed(0)}°, adik ${ad0.root.map((v) => v.toFixed(2))} yaw ${(ad0.yaw * 180 / Math.PI).toFixed(0)}°, tinggi adik ${ad0.height}`);
console.log("\n— usulan utama (adik setengah langkah ke depan-kanan Uq: f = 0,20 m maju) —");
DEBUG = true;
const main = evalCase(0.2, 0, true);
DEBUG = false;
DEBUG = false;
console.log("\n— variasi (f maju ke arah jendela, s mendekat ke Uq) —");
const rows = [];
for (const f of [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35]) for (const s of [-0.1, 0, 0.05, 0.1]) rows.push(evalCase(f, s, true));
const ok = rows.filter((r) => r.pass);
console.log(`\nusulan utama: ${main.pass ? "LULUS" : "GAGAL"}; variasi lulus: ${ok.length}/${rows.length}${ok.length ? " → " + ok.map((r) => `(f ${r.f}, s ${r.s})`).join(" ") : ""}`);

// ---- second try (2026-11-20): a two-segment joint path through a mid pose (arm out to the side), searched on a grid
const tryMid = (f: number, s: number) => {
  const r = evalCase(f, s, false);
  const q1 = r.q as Q;
  const q0: Q = [pose0.armL[0], pose0.armL[1], pose0.armLFwd];
  const seg = (a: Q, b: Q, n: number) => Array.from({ length: n }, (_, i) => { const u0 = (i + 1) / n, u = u0 * u0 * (3 - 2 * u0); return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u) as Q; });
  const cands: { qm: Q; depth: number; step: number }[] = [];
  for (let a = -40; a <= 70; a += 10) for (let b = 0; b <= 140; b += 10) for (let w = -60; w <= 120; w += 10) {
    const qm: Q = [a, b, w];
    const path = [...seg(q0, qm, 12), ...seg(qm, q1, 12)];
    let depth = 0, step = 0, prev = q0;
    for (const qq of path) { depth = Math.max(depth, c1ArmTorsoDepth(qq, "L")); step = Math.max(step, ...qq.map((v, k) => Math.abs(v - prev[k]))); prev = qq; }
    if (depth <= 0.003 && step <= 15) cands.push({ qm, depth, step });
  }
  // full check (arm vs adik, body vs body) for the torso-clean candidates; adik steps forward during the move
  let best: { qm: Q; armAd: number; body: number; step: number } | null = null;
  for (const c of cands) {
    const path = [...seg(q0, c.qm, 12), ...seg(c.qm, q1, 12)];
    let armAd = Infinity, body = Infinity;
    path.forEach((qq, i) => {
      const u0 = (i + 1) / 24, u = u0 * u0 * (3 - 2 * u0);
      const adI: Ch = { ...ad0, root: [ad0.root[0] + ((r.root as V3)[0] - ad0.root[0]) * u, 0, ad0.root[2] + ((r.root as V3)[2] - ad0.root[2]) * u] };
      const uqI: Ch = { ...uq0, pose: { ...uq0.pose, armL: [qq[0], qq[1]], armLFwd: qq[2] } };
      const adSI = bodySamples(adI, "adik");
      for (const ap of armPts(uqI, qq)) { if (i >= 20 && ap.u > 0.93) continue; for (const sp of adSI) { if (sp.part.startsWith("lengan R") && i < 6) continue; armAd = Math.min(armAd, ap.p.distanceTo(sp.p) - sp.r - 0.03); } }
      if (i % 4 === 3) for (const a2 of bodySamples(uqI, "uq", "L")) for (const b2 of adSI) { if (a2.part.startsWith("lengan") && b2.part.startsWith("lengan")) continue; body = Math.min(body, a2.p.distanceTo(b2.p) - a2.r - b2.r); }
    });
    if (!best || armAd > best.armAd) best = { qm: c.qm, armAd, body, step: c.step };
  }
  const pass = r.err <= 0.015 && r.depth <= 0.003 && r.armVsAdik.d >= -0.005 && r.palmToFace > -0.008 && !!best && best.armAd >= -0.005 && best.body >= 0;
  console.log(`[jalur 2 segmen] f=${f} s=${s}: pose akhir lengan↔adik ${(r.armVsAdik.d * 100).toFixed(1)} cm; pose antara bersih-torso: ${cands.length}; terbaik ${best ? `qm=[${best.qm}] lengan↔adik min ${(best.armAd * 100).toFixed(1)} cm, badan↔badan min ${(best.body * 100).toFixed(1)} cm, lompatan ${best.step.toFixed(1)}°/frame` : "-"} → ${pass ? "LULUS" : "GAGAL"}`);
  return pass;
};
console.log("\n— percobaan kedua: jalur lewat pose antara —");
const p2 = [tryMid(0.2, 0), tryMid(0.1, 0), tryMid(0, 0), tryMid(0.2, -0.1)];
console.log(`hasil akhir usulan utama (f 0,20): ${p2[0] ? "LULUS" : "GAGAL"}`);

// ---- FALLBACK (owner rule 2026-11-20: if the main proposal fails, use it without waiting): adik covers her OWN mouth
// with her LEFT hand (rig side "R"), Uq's RIGHT hand (side "L") rests on her left shoulder (the one next to him).
// S02 starts after a cut from the S01 insert, so both start from hands down (grip released off screen).
console.log("\n— CADANGAN: adik menutup mulut sendiri (tangan kiri), tangan kanan Uq di bahu kiri adik —");
const ADIK_H = ad0.height;
const adC: Ch = { ...ad0 };
const hcA = new THREE.Vector3(...stickHeadCenter(adC.root, ADIK_H)), htA = new THREE.Vector3(...stickHeadTop(adC.root, ADIK_H));
const RA = (htA.y - hcA.y) * 1.06;
const dirMA = fwd(adC.yaw).multiplyScalar(Math.cos(0.34)).add(new THREE.Vector3(0, -Math.sin(0.34), 0)).normalize();
const mouthA = hcA.clone().add(dirMA.clone().multiplyScalar(RA + 0.013));
const ikA = (tg: THREE.Vector3, ref: Q) => c1ArmIK({ root: adC.root, yaw: adC.yaw, body: {}, side: "R", target: [tg.x, tg.y, tg.z], ref, height: ADIK_H, avoidTorso: true, wMin: -60 });
const aSol = ikA(mouthA, [40, 100, 30]);
const qA: Q = [aSol.arm[0], aSol.arm[1], aSol.fwd];
const adPose = { ...(adC.pose as object), armR: aSol.arm, armRFwd: aSol.fwd };
const adF: Ch = { ...adC, pose: adPose };
const armPtsSide = (c: Ch, q: Q, side: "L" | "R") => {
  const pose = side === "L" ? { armL: [q[0], q[1]], armLFwd: q[2] } : { armR: [q[0], q[1]], armRFwd: q[2] };
  const { S: sh, E, H } = armChain(pose as never, side, LAY);
  const pts: { p: THREE.Vector3; u: number }[] = [];
  for (let i = 3; i <= 8; i++) pts.push({ p: W(c, sh.clone().lerp(E, i / 8)), u: i / 16 });
  for (let i = 1; i <= 10; i++) pts.push({ p: W(c, E.clone().lerp(H, i / 10)), u: 0.5 + i / 20 });
  return pts;
};
let aHead = Infinity;
for (const ap of armPtsSide(adF, qA, "R")) { if (ap.u > 0.93) continue; aHead = Math.min(aHead, ap.p.distanceTo(hcA) - RA - 0.03); }
const aPalm = armPtsSide(adF, qA, "R").slice(-1)[0].p;
console.log(`adik tangan kiri → mulut: telapak ${(aSol.err * 100).toFixed(1)} cm, lengan-dalam-torso ${(c1ArmTorsoDepth(qA, "R", ADIK_H) * 100).toFixed(1)} cm, siku ${qA[1].toFixed(0)}°, q=[${qA.map((v) => v.toFixed(0))}], lengan↔kepala sendiri ${(aHead * 100).toFixed(1)} cm, telapak↔wajah ${((aPalm.distanceTo(hcA) - RA - 0.011 * ADIK_H / 1.5) * 100).toFixed(1)} cm`);
// Uq's right palm on top of adik's left shoulder
const shA = (() => { const { S: sh } = armChain(adPose as never, "R", LAY); return W(adF, sh); })();
const shT = shA.clone().add(new THREE.Vector3(0, 0.045, 0));
const uSol = c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: [shT.x, shT.y, shT.z], ref: [20, 30, -20], avoidTorso: true, wMin: -60 });
const qU: Q = [uSol.arm[0], uSol.arm[1], uSol.fwd];
const uqF: Ch = { ...uq0, pose: { ...uq0.pose, armL: uSol.arm, armLFwd: uSol.fwd } };
const adSF = bodySamples(adF, "adik");
let uArm = { d: Infinity, part: "" };
for (const ap of armPts(uqF, qU)) { if (ap.u > 0.9) continue; for (const sp of adSF) { const d = ap.p.distanceTo(sp.p) - sp.r - 0.03; if (d < uArm.d) uArm = { d, part: sp.part }; } }
let bb = Infinity; for (const a2 of bodySamples(uqF, "uq", "L")) for (const b2 of adSF) { if (a2.part.startsWith("lengan") && b2.part.startsWith("lengan")) continue; bb = Math.min(bb, a2.p.distanceTo(b2.p) - a2.r - b2.r); }
let wl = { d: Infinity, who: "", box: "" };
for (const [who, ss] of [["Uq", bodySamples(uqF, "uq")], ["adik", adSF]] as const) for (const sp of ss) for (const b of BOXES) { const d = boxDist(sp.p, b) - sp.r; if (d < wl.d) wl = { d, who, box: b.name }; }
console.log(`Uq tangan kanan → bahu kiri adik: telapak ${(uSol.err * 100).toFixed(1)} cm, lengan-dalam-torso ${(c1ArmTorsoDepth(qU, "L") * 100).toFixed(1)} cm, siku ${qU[1].toFixed(0)}°, q=[${qU.map((v) => v.toFixed(0))}], lengan↔adik ${(uArm.d * 100).toFixed(1)} cm (${uArm.part}) | badan↔badan ${(bb * 100).toFixed(1)} cm | dinding/benda ${(wl.d * 100).toFixed(1)} cm (${wl.who} ↔ ${wl.box})`);
// paths from hands down (0.8 s, joint space, eased): per-frame step, own-torso depth, arm vs other body
const restU = c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: (() => { const sd = new THREE.Vector3(-Math.cos(uq0.yaw), 0, Math.sin(uq0.yaw)); const p = new THREE.Vector3(...uq0.root).add(sd.multiplyScalar(0.25)).setY(0.72); return [p.x, p.y, p.z] as V3; })(), ref: [5, 10, 0], avoidTorso: true, wMin: -60 });
const restA = c1ArmIK({ root: adC.root, yaw: adC.yaw, body: {}, side: "R", target: (() => { const sd = new THREE.Vector3(Math.cos(adC.yaw), 0, -Math.sin(adC.yaw)); const p = new THREE.Vector3(...adC.root).add(sd.multiplyScalar(0.2)).setY(0.6); return [p.x, p.y, p.z] as V3; })(), ref: [5, 10, 0], height: ADIK_H, avoidTorso: true, wMin: -60 });
const pathCheck = (name: string, c: Ch, side: "L" | "R", qa: Q, qb: Q, h: number, other: Ch, otherWho: "uq" | "adik") => {
  let step = 0, depth = 0, minO = Infinity, prev = qa;
  for (let i = 1; i <= 24; i++) {
    const u0 = i / 24, u = u0 * u0 * (3 - 2 * u0);
    const qq: Q = [0, 1, 2].map((k) => qa[k] + (qb[k] - qa[k]) * u) as Q;
    step = Math.max(step, ...qq.map((v, k) => Math.abs(v - prev[k]))); depth = Math.max(depth, c1ArmTorsoDepth(qq, side, h)); prev = qq;
    const cc: Ch = { ...c, pose: { ...(c.pose as object), ...(side === "L" ? { armL: [qq[0], qq[1]], armLFwd: qq[2] } : { armR: [qq[0], qq[1]], armRFwd: qq[2] }) } };
    for (const ap of armPtsSide(cc, qq, side)) { if (i > 20 && ap.u > 0.9) continue; for (const sp of bodySamples(other, otherWho)) minO = Math.min(minO, ap.p.distanceTo(sp.p) - sp.r - 0.03); }
  }
  console.log(`  lintasan ${name}: lompatan maks ${step.toFixed(1)}°/frame, torso maks ${(depth * 100).toFixed(1)} cm, lengan↔${otherWho} min ${(minO * 100).toFixed(1)} cm`);
  return step <= 15 && depth <= 0.003 && minO >= -0.005;
};
const p1 = pathCheck("adik (tangan kiri turun → mulut)", adC, "R", [restA.arm[0], restA.arm[1], restA.fwd], qA, ADIK_H, uqF, "uq");
const p2b = pathCheck("Uq (tangan kanan turun → bahu adik)", uq0, "L", [restU.arm[0], restU.arm[1], restU.fwd], qU, C1_HEIGHT, adF, "adik");
const okF = aSol.err <= 0.015 && c1ArmTorsoDepth(qA, "R", ADIK_H) <= 0.003 && aHead >= -0.005 && uSol.err <= 0.02 && c1ArmTorsoDepth(qU, "L") <= 0.003 && uArm.d >= -0.005 && bb >= 0 && wl.d >= 0.03 && p1 && p2b;
console.log(`CADANGAN: ${okF ? "LULUS" : "GAGAL"}  | qA=${JSON.stringify(qA.map((v) => +v.toFixed(1)))} qU=${JSON.stringify(qU.map((v) => +v.toFixed(1)))} restU=${JSON.stringify([restU.arm[0], restU.arm[1], restU.fwd].map((v) => +v.toFixed(1)))} restA=${JSON.stringify([restA.arm[0], restA.arm[1], restA.fwd].map((v) => +v.toFixed(1)))}`);

// ---- fallback variants: adik f metres toward the window; Uq's palm on her left shoulder top or her upper back; rests =
// the approved hanging poses (ADIK_REST armR [10,-4] fwd 0; C1 hanging right arm [6,8,0])
console.log("\n— CADANGAN, variasi (dari pose istirahat resmi) —");
const REST_UQ: Q = [6, 8, 0], REST_AD: Q = [10, -4, 0];
console.log(`torso pose istirahat: Uq ${(c1ArmTorsoDepth(REST_UQ, "L") * 100).toFixed(1)} cm, adik ${(c1ArmTorsoDepth(REST_AD, "R", ADIK_H) * 100).toFixed(1)} cm`);
const passing: string[] = [];
for (const f of [0, 0.1, 0.2, 0.3]) for (const tgt of ["bahu", "punggung"] as const) for (const wMin of [-90, -60, -30]) {
  const fA = fwd(ad0.yaw);
  const root: V3 = [ad0.root[0] + fA.x * f, 0, ad0.root[2] + fA.z * f];
  const adV: Ch = { ...ad0, root };
  const hc = new THREE.Vector3(...stickHeadCenter(root, ADIK_H)), ht = new THREE.Vector3(...stickHeadTop(root, ADIK_H));
  const R = (ht.y - hc.y) * 1.06;
  const dm = fwd(adV.yaw).multiplyScalar(Math.cos(0.34)).add(new THREE.Vector3(0, -Math.sin(0.34), 0)).normalize();
  const ms = c1ArmIK({ root, yaw: adV.yaw, body: {}, side: "R", target: (() => { const m = hc.clone().add(dm.multiplyScalar(R + 0.013)); return [m.x, m.y, m.z] as V3; })(), ref: [40, 100, 30], height: ADIK_H, avoidTorso: true, wMin: -60 });
  const qa: Q = [ms.arm[0], ms.arm[1], ms.fwd];
  const adP: Ch = { ...adV, pose: { ...(adV.pose as object), armR: ms.arm, armRFwd: ms.fwd } };
  let headA = Infinity; for (const ap of armPtsSide(adP, qa, "R")) { if (ap.u > 0.93) continue; headA = Math.min(headA, ap.p.distanceTo(hc) - R - 0.03); }
  const { S: shL } = armChain(adP.pose as never, "R", LAY); const { S: shR } = armChain(adP.pose as never, "L", LAY);
  const sL = W(adP, shL), sR = W(adP, shR);
  const back = sL.clone().lerp(sR, 0.5).add(fwd(adV.yaw).multiplyScalar(-0.09)).add(new THREE.Vector3(0, -0.06, 0));
  const T = tgt === "bahu" ? sL.clone().add(new THREE.Vector3(0, 0.045, 0)) : back;
  const us = c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: [T.x, T.y, T.z], ref: [20, 40, 0], avoidTorso: true, wMin });
  const qu: Q = [us.arm[0], us.arm[1], us.fwd];
  const uqP: Ch = { ...uq0, pose: { ...uq0.pose, armL: us.arm, armLFwd: us.fwd } };
  const adS = bodySamples(adP, "adik");
  let ua = Infinity; for (const ap of armPts(uqP, qu)) { if (ap.u > 0.9) continue; for (const sp of adS) ua = Math.min(ua, ap.p.distanceTo(sp.p) - sp.r - 0.03); }
  let bbv = Infinity; for (const a2 of bodySamples(uqP, "uq", "L")) for (const b2 of adS) { if (a2.part.startsWith("lengan") && b2.part.startsWith("lengan")) continue; bbv = Math.min(bbv, a2.p.distanceTo(b2.p) - a2.r - b2.r); }
  // paths (adik's hand first 0.0-0.8 s, Uq's hand 0.2-1.0 s; checked separately against the other's FINAL pose = worst case)
  const quiet = (fn: () => boolean) => { const l = console.log; let out = ""; console.log = (s: string) => { out = s; }; const r = fn(); console.log = l; return { r, out }; };
  const pa = quiet(() => pathCheck("adik", adV, "R", REST_AD, qa, ADIK_H, uqP, "uq"));
  const pu = quiet(() => pathCheck("Uq", uq0, "L", REST_UQ, qu, C1_HEIGHT, adP, "adik"));
  const ok = ms.err <= 0.015 && c1ArmTorsoDepth(qa, "R", ADIK_H) <= 0.003 && headA >= -0.005 && us.err <= 0.015 && c1ArmTorsoDepth(qu, "L") <= 0.003 && ua >= -0.005 && bbv >= 0 && pa.r && pu.r;
  const line = `f=${f} ${tgt} wMin=${wMin}: adik telapak ${(ms.err * 100).toFixed(1)} siku ${qa[1].toFixed(0)}° kepala ${(headA * 100).toFixed(1)} | Uq telapak ${(us.err * 100).toFixed(1)} siku ${qu[1].toFixed(0)}° q=[${qu.map((v) => v.toFixed(0))}] lengan↔adik ${(ua * 100).toFixed(1)} badan↔badan ${(bbv * 100).toFixed(1)} |${pa.out.replace("  lintasan adik:", " jalur adik")} |${pu.out.replace("  lintasan Uq:", " jalur Uq")} → ${ok ? "LULUS" : "gagal"}`;
  console.log(line);
  if (ok) passing.push(line);
}
console.log(`\nvarian cadangan lulus: ${passing.length}`);

// ---- fallback, contact-aware (2026-11-20): Uq's palm RESTS on adik, so the distal 20 % of his forearm + palm may touch
// her (overlap ≤ 1.5 cm of the 3 cm tube = sleeve on her tee); everything nearer his elbow must stay clear (≥ 0).
// Timing as staged: adik's hand rises first (0–0.8 s) while his arm still hangs; his arm moves 0.4–1.2 s against her
// final pose. Two-segment joint path for his arm (out to his right side first, then in), searched on a grid.
console.log("\n— CADANGAN, kontak wajar + urutan waktu —");
const segQ = (a: Q, b: Q, n: number) => Array.from({ length: n }, (_, i) => { const u0 = (i + 1) / n, u = u0 * u0 * (3 - 2 * u0); return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u) as Q; });
const armVs = (c: Ch, q: Q, side: "L" | "R", other: S[]) => { let near = Infinity, dist = Infinity; for (const ap of armPtsSide(c, q, side)) for (const sp of other) { const d = ap.p.distanceTo(sp.p) - sp.r - 0.03; if (ap.u >= 0.8) dist = Math.min(dist, d); else near = Math.min(near, d); } return { near, dist }; };
for (const f of [0, 0.1, 0.2]) for (const tgt of ["bahu", "punggung"] as const) {
  const fA = fwd(ad0.yaw);
  const root: V3 = [ad0.root[0] + fA.x * f, 0, ad0.root[2] + fA.z * f];
  const adV: Ch = { ...ad0, root };
  const hc = new THREE.Vector3(...stickHeadCenter(root, ADIK_H)), ht = new THREE.Vector3(...stickHeadTop(root, ADIK_H));
  const R = (ht.y - hc.y) * 1.06;
  const dm = fwd(adV.yaw).multiplyScalar(Math.cos(0.34)).add(new THREE.Vector3(0, -Math.sin(0.34), 0)).normalize();
  const ms = c1ArmIK({ root, yaw: adV.yaw, body: {}, side: "R", target: (() => { const m = hc.clone().add(dm.multiplyScalar(R + 0.013)); return [m.x, m.y, m.z] as V3; })(), ref: [40, 100, 30], height: ADIK_H, avoidTorso: true, wMin: -60 });
  const qa: Q = [ms.arm[0], ms.arm[1], ms.fwd];
  const adP: Ch = { ...adV, pose: { ...(adV.pose as object), armR: ms.arm, armRFwd: ms.fwd } };
  const { S: shL } = armChain(adP.pose as never, "R", LAY); const { S: shR } = armChain(adP.pose as never, "L", LAY);
  const sL = W(adP, shL), sR = W(adP, shR);
  const T = tgt === "bahu" ? sL.clone().add(new THREE.Vector3(0, 0.05, 0)).add(fwd(adV.yaw).multiplyScalar(-0.04)) : sL.clone().lerp(sR, 0.5).add(fwd(adV.yaw).multiplyScalar(-0.09)).add(new THREE.Vector3(0, -0.06, 0));
  const us = c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: [T.x, T.y, T.z], ref: [20, 40, 0], avoidTorso: true, wMin: -90 });
  const qu: Q = [us.arm[0], us.arm[1], us.fwd];
  const adS = bodySamples(adP, "adik");
  const uqP: Ch = { ...uq0, pose: { ...uq0.pose, armL: us.arm, armLFwd: us.fwd } };
  const fin = armVs(uqP, qu, "L", adS);
  // adik's path against Uq at rest
  const uqRest: Ch = { ...uq0, pose: { ...uq0.pose, armL: [REST_UQ[0], REST_UQ[1]], armLFwd: REST_UQ[2] } };
  const uqRestS = bodySamples(uqRest, "uq");
  let pA = Infinity, pAd = 0, pAs = 0, prevA = REST_AD;
  for (const qq of segQ(REST_AD, qa, 24)) { const cc: Ch = { ...adV, pose: { ...(adV.pose as object), armR: [qq[0], qq[1]], armRFwd: qq[2] } }; for (const ap of armPtsSide(cc, qq, "R")) for (const sp of uqRestS) pA = Math.min(pA, ap.p.distanceTo(sp.p) - sp.r - 0.03); pAd = Math.max(pAd, c1ArmTorsoDepth(qq, "R", ADIK_H)); pAs = Math.max(pAs, ...qq.map((v, k) => Math.abs(v - prevA[k]))); prevA = qq; }
  // Uq's path: best mid pose on a grid
  let best: { qm: Q; near: number; dist: number; depth: number; step: number } | null = null;
  for (let a = -30; a <= 60; a += 15) for (let b = 0; b <= 120; b += 15) for (let w = -90; w <= 90; w += 15) {
    const qm: Q = [a, b, w];
    const path = [...segQ(REST_UQ, qm, 12), ...segQ(qm, qu, 12)];
    let depth = 0, step = 0, prev = REST_UQ, near = Infinity, dist = Infinity;
    for (const [i, qq] of path.entries()) {
      depth = Math.max(depth, c1ArmTorsoDepth(qq, "L")); step = Math.max(step, ...qq.map((v, k) => Math.abs(v - prev[k]))); prev = qq;
      if (depth > 0.003 || step > 15) break;
      if (i % 2 === 1 || i === path.length - 1) { const cc: Ch = { ...uq0, pose: { ...uq0.pose, armL: [qq[0], qq[1]], armLFwd: qq[2] } }; const r = armVs(cc, qq, "L", adS); near = Math.min(near, r.near); dist = Math.min(dist, i >= path.length - 3 ? r.dist : Math.min(r.dist, r.near)); }
    }
    if (depth > 0.003 || step > 15) continue;
    const score = Math.min(near, dist + 0.015);
    if (!best || score > Math.min(best.near, best.dist + 0.015)) best = { qm, near, dist, depth, step };
  }
  let bbv = Infinity; for (const a2 of bodySamples(uqP, "uq", "L")) for (const b2 of adS) { if (a2.part.startsWith("lengan") && b2.part.startsWith("lengan")) continue; bbv = Math.min(bbv, a2.p.distanceTo(b2.p) - a2.r - b2.r); }
  const okA = ms.err <= 0.015 && c1ArmTorsoDepth(qa, "R", ADIK_H) <= 0.003 && pA >= 0 && pAd <= 0.003 && pAs <= 15;
  const okU = us.err <= 0.015 && c1ArmTorsoDepth(qu, "L") <= 0.003 && fin.near >= 0 && fin.dist >= -0.015 && bbv >= 0 && !!best && best.near >= 0 && best.dist >= -0.015;
  console.log(`f=${f} ${tgt}: ADIK telapak ${(ms.err * 100).toFixed(1)} cm, siku ${qa[1].toFixed(0)}°, jalur: lengan↔Uq(istirahat) ${(pA * 100).toFixed(1)} cm, torso ${(pAd * 100).toFixed(1)} cm, ${pAs.toFixed(1)}°/frame → ${okA ? "ok" : "gagal"} | UQ telapak ${(us.err * 100).toFixed(1)} cm, siku ${qu[1].toFixed(0)}°, q=[${qu.map((v) => v.toFixed(0))}], akhir: lengan dekat ${(fin.near * 100).toFixed(1)} / ujung ${(fin.dist * 100).toFixed(1)} cm, badan↔badan ${(bbv * 100).toFixed(1)} cm; jalur terbaik ${best ? `qm=[${best.qm}] dekat ${(best.near * 100).toFixed(1)} / ujung ${(best.dist * 100).toFixed(1)} cm, ${best.step.toFixed(1)}°/frame` : "-"} → ${okU ? "ok" : "gagal"} ⇒ ${okA && okU ? "LULUS" : "GAGAL"}`);
}

console.log("\n— CADANGAN, kontak wajar + urutan waktu, adik menjauh dari Uq —");
const segQ2 = (a: Q, b: Q, n: number) => Array.from({ length: n }, (_, i) => { const u0 = (i + 1) / n, u = u0 * u0 * (3 - 2 * u0); return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u) as Q; });
const armVs2 = (c: Ch, q: Q, side: "L" | "R", other: S[]) => { let near = Infinity, dist = Infinity; for (const ap of armPtsSide(c, q, side)) for (const sp of other) { const d = ap.p.distanceTo(sp.p) - sp.r - 0.03; if (ap.u >= 0.8) dist = Math.min(dist, d); else near = Math.min(near, d); } return { near, dist }; };
for (const sAway of [0.1, 0.15, 0.2, 0.25]) for (const f of [0, 0.1]) for (const tgt of ["bahu", "punggung"] as const) {
  const fA = fwd(ad0.yaw);
  const away = new THREE.Vector3(ad0.root[0] - uq0.root[0], 0, ad0.root[2] - uq0.root[2]).normalize();
  const root: V3 = [ad0.root[0] + fA.x * f + away.x * sAway, 0, ad0.root[2] + fA.z * f + away.z * sAway];
  const adV: Ch = { ...ad0, root };
  const hc = new THREE.Vector3(...stickHeadCenter(root, ADIK_H)), ht = new THREE.Vector3(...stickHeadTop(root, ADIK_H));
  const R = (ht.y - hc.y) * 1.06;
  const dm = fwd(adV.yaw).multiplyScalar(Math.cos(0.34)).add(new THREE.Vector3(0, -Math.sin(0.34), 0)).normalize();
  const ms = c1ArmIK({ root, yaw: adV.yaw, body: {}, side: "R", target: (() => { const m = hc.clone().add(dm.multiplyScalar(R + 0.013)); return [m.x, m.y, m.z] as V3; })(), ref: [40, 100, 30], height: ADIK_H, avoidTorso: true, wMin: -60 });
  const qa: Q = [ms.arm[0], ms.arm[1], ms.fwd];
  const adP: Ch = { ...adV, pose: { ...(adV.pose as object), armR: ms.arm, armRFwd: ms.fwd } };
  const { S: shL } = armChain(adP.pose as never, "R", LAY); const { S: shR } = armChain(adP.pose as never, "L", LAY);
  const sL = W(adP, shL), sR = W(adP, shR);
  const T = tgt === "bahu" ? sL.clone().add(new THREE.Vector3(0, 0.05, 0)).add(fwd(adV.yaw).multiplyScalar(-0.04)) : sL.clone().lerp(sR, 0.5).add(fwd(adV.yaw).multiplyScalar(-0.09)).add(new THREE.Vector3(0, -0.06, 0));
  const us = c1ArmIK({ root: uq0.root, yaw: uq0.yaw, body: {}, side: "L", target: [T.x, T.y, T.z], ref: [20, 40, 0], avoidTorso: true, wMin: -90 });
  const qu: Q = [us.arm[0], us.arm[1], us.fwd];
  const adS = bodySamples(adP, "adik");
  const uqP: Ch = { ...uq0, pose: { ...uq0.pose, armL: us.arm, armLFwd: us.fwd } };
  const fin = armVs2(uqP, qu, "L", adS);
  // adik's path against Uq at rest
  const uqRest: Ch = { ...uq0, pose: { ...uq0.pose, armL: [REST_UQ[0], REST_UQ[1]], armLFwd: REST_UQ[2] } };
  const uqRestS = bodySamples(uqRest, "uq");
  let pA = Infinity, pAd = 0, pAs = 0, prevA = REST_AD;
  for (const qq of segQ2(REST_AD, qa, 24)) { const cc: Ch = { ...adV, pose: { ...(adV.pose as object), armR: [qq[0], qq[1]], armRFwd: qq[2] } }; for (const ap of armPtsSide(cc, qq, "R")) for (const sp of uqRestS) pA = Math.min(pA, ap.p.distanceTo(sp.p) - sp.r - 0.03); pAd = Math.max(pAd, c1ArmTorsoDepth(qq, "R", ADIK_H)); pAs = Math.max(pAs, ...qq.map((v, k) => Math.abs(v - prevA[k]))); prevA = qq; }
  // Uq's path: best mid pose on a grid
  let best: { qm: Q; near: number; dist: number; depth: number; step: number } | null = null;
  for (let a = -30; a <= 60; a += 15) for (let b = 0; b <= 120; b += 15) for (let w = -90; w <= 90; w += 15) {
    const qm: Q = [a, b, w];
    const path = [...segQ2(REST_UQ, qm, 12), ...segQ2(qm, qu, 12)];
    let depth = 0, step = 0, prev = REST_UQ, near = Infinity, dist = Infinity;
    for (const [i, qq] of path.entries()) {
      depth = Math.max(depth, c1ArmTorsoDepth(qq, "L")); step = Math.max(step, ...qq.map((v, k) => Math.abs(v - prev[k]))); prev = qq;
      if (depth > 0.003 || step > 15) break;
      if (i % 2 === 1 || i === path.length - 1) { const cc: Ch = { ...uq0, pose: { ...uq0.pose, armL: [qq[0], qq[1]], armLFwd: qq[2] } }; const r = armVs2(cc, qq, "L", adS); near = Math.min(near, r.near); dist = Math.min(dist, i >= path.length - 3 ? r.dist : Math.min(r.dist, r.near)); }
    }
    if (depth > 0.003 || step > 15) continue;
    const score = Math.min(near, dist + 0.015);
    if (!best || score > Math.min(best.near, best.dist + 0.015)) best = { qm, near, dist, depth, step };
  }
  let bbv = Infinity; for (const a2 of bodySamples(uqP, "uq", "L")) for (const b2 of adS) { if (a2.part.startsWith("lengan") && b2.part.startsWith("lengan")) continue; bbv = Math.min(bbv, a2.p.distanceTo(b2.p) - a2.r - b2.r); }
  const okA = ms.err <= 0.015 && c1ArmTorsoDepth(qa, "R", ADIK_H) <= 0.003 && pA >= 0 && pAd <= 0.003 && pAs <= 15;
  const okU = us.err <= 0.015 && c1ArmTorsoDepth(qu, "L") <= 0.003 && fin.near >= 0 && fin.dist >= -0.015 && bbv >= 0 && !!best && best.near >= 0 && best.dist >= -0.015;
  console.log(`menjauh ${sAway} f=${f} ${tgt}: ADIK telapak ${(ms.err * 100).toFixed(1)} cm, siku ${qa[1].toFixed(0)}°, jalur: lengan↔Uq(istirahat) ${(pA * 100).toFixed(1)} cm, torso ${(pAd * 100).toFixed(1)} cm, ${pAs.toFixed(1)}°/frame → ${okA ? "ok" : "gagal"} | UQ telapak ${(us.err * 100).toFixed(1)} cm, siku ${qu[1].toFixed(0)}°, q=[${qu.map((v) => v.toFixed(0))}], akhir: lengan dekat ${(fin.near * 100).toFixed(1)} / ujung ${(fin.dist * 100).toFixed(1)} cm, badan↔badan ${(bbv * 100).toFixed(1)} cm; jalur terbaik ${best ? `qm=[${best.qm}] dekat ${(best.near * 100).toFixed(1)} / ujung ${(best.dist * 100).toFixed(1)} cm, ${best.step.toFixed(1)}°/frame` : "-"} → ${okU ? "ok" : "gagal"} ⇒ ${okA && okU ? "LULUS" : "GAGAL"}`);
}
