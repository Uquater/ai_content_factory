// Episode 3 motion tests (D-053): per-frame numbers for the four test clips EXACTLY as staged (src/ep004/motion004.ts).
// Limits = pilot v3 (owner): joint step Uq ≤ 11.1, adik ≤ 7.1 °/frame; Uq↔adik ≥ 1.7 cm; arm-in-own-torso Uq ≤ 0.2,
// adik ≤ 0.0 cm; body↔wall/object ≥ 49.6 cm or the value recorded in the storyboard (§11.0: R1 table 0.17 m Uq /
// 0.12 m adik, adik's retreat path 0.13 m; measured there as root-to-box minus a body radius 0.22 / 0.16 m).
// Declared exclusion (genggam/tatap only): sample pairs with BOTH samples within 8 cm of the meeting point are the grip
// itself; their raw minimum is printed separately. Body↔body pairs are printed separately (torso rings, r = 0).
// Also: body yaw rate, head yaw, planted-foot drift, foot crossing, leg stretch (ankle–hip vs rest length).
// The set boxes are the renderer's numbers (ep002/sets.tsx: coffee table top + legs, sofa, low cabinet; geo.ts walls).
// Run from studio/:
//   npx esbuild tools/m004_check.ts --bundle --platform=node --log-level=warning --outfile=out/m004_check.cjs && node out/m004_check.cjs
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { C1_BUILD } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import { TORSO_R } from "../src/inkbeat/char/family";
import { chain, movesAt, stanceAt, walkSteps } from "../src/cast/stepper";
import type { FootId } from "../src/cast/stepper";
import { A0, U0 } from "../src/ep004/motion004";
import { EP2_END } from "../src/ep004/e004Poses";
import type { V3 } from "../src/inkbeat/types";
import { A1_SB, buildClips, PROPOSED, H_AD, JACKET_Q, S12_HEAD_U, TIMES, TURN_U, U1, YF_U, YH_U } from "../src/ep004/motion004";
import type { ClipId, MChar, MFrame, Opts, Q } from "../src/ep004/motion004";
import { ledWorld } from "../src/ep004/LookDev004";
import { blockedBy } from "../src/ep004/occlusion004";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const D2 = 180 / Math.PI;
const W = (c: MChar, p: THREE.Vector3) => p.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
type S = { p: THREE.Vector3; r: number; part: string; kind: "badan" | "lengan" | "tangan" | "kaki" | "kepala" | "jaket" | "ponsel" };
const samples = (c: MChar): S[] => {
  const who = c.who === "uq" ? "Uq" : "adik";
  const out: S[] = [];
  for (let k = 0; k <= 10; k++) {
    const v = 0.02 + (0.96 * k) / 10;
    const rx = Math.abs(teeSurface(0.999, v).p.x), rz = Math.abs(teeSurface(0, v).p.z);
    for (let a = 0; a < 24; a++) { const th = (a / 24) * Math.PI * 2; out.push({ p: W(c, new THREE.Vector3(rx * Math.cos(th), LAY.torsoY0 + v * LAY.torsoH, rz * Math.sin(th))), r: 0, part: `badan ${who}`, kind: "badan" }); }
  }
  for (const side of ["L", "R"] as const) {
    const { S: sh, E, H } = armChain(c.pose as never, side, LAY);
    const nm = `lengan ${side === "L" ? "kanan" : "kiri"} ${who}`;
    for (let i = 0; i <= 8; i++) out.push({ p: W(c, sh.clone().lerp(E, i / 8)), r: 0.03, part: nm, kind: "lengan" });
    for (let i = 1; i <= 8; i++) out.push({ p: W(c, E.clone().lerp(H, i / 8)), r: 0.03, part: nm + (i >= 7 ? " (tangan)" : ""), kind: i >= 7 ? "tangan" : "lengan" });
    if (c.who === "adik" && side === "L") {
      // the jacket over her right forearm (npc.tsx JacketOnArm, at 0.6, folds 0.11/0.16 long, ±0.03–0.04 wide)
      const fore = H.clone().sub(E).normalize();
      const midP = E.clone().lerp(H, 0.6);
      const down = new THREE.Vector3(0, -1, 0).addScaledVector(fore, fore.y).normalize();
      const sideV = new THREE.Vector3().crossVectors(fore, down).normalize();
      for (const d of [0, 0.05, 0.1, 0.16]) for (const s of [-0.035, 0.035]) out.push({ p: W(c, midP.clone().addScaledVector(down, d).addScaledVector(sideV, s)), r: 0.02 * c.height, part: "jaket adik", kind: "jaket" });
    }
  }
  const lp = c.legPose as { L: { ankle: V3 }; R: { ankle: V3 } } | undefined;
  for (const f of ["L", "R"] as const) {
    const ank = lp ? new THREE.Vector3(...lp[f].ankle) : new THREE.Vector3(f === "L" ? -0.05 : 0.05, 0.012, 0.004);
    const hip = new THREE.Vector3(f === "L" ? -0.045 : 0.045, LAY.hipY, 0);
    for (let i = 0; i <= 6; i++) out.push({ p: W(c, hip.clone().lerp(ank, i / 6)), r: 0.035, part: `kaki ${who}`, kind: "kaki" });
    out.push({ p: W(c, ank.clone().add(new THREE.Vector3(0, 0.02, 0.06))), r: 0.05, part: `sepatu ${who}`, kind: "kaki" });
  }
  const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height));
  out.push({ p: hc, r: (new THREE.Vector3(...stickHeadTop(c.root, c.height)).y - hc.y) * (who === "adik" ? 1.06 : 1), part: `kepala ${who}`, kind: "kepala" });
  return out;
};
const T2 = 0.06;
const BOXES: { name: string; min: V3; max: V3 }[] = [
  { name: "dinding depan", min: [-4, 0, 2.94], max: [4, 2.7, 3.06] },
  { name: "dinding kamar (x 1)", min: [0.94, 0, -1], max: [1.06, 2.7, 3] },
  { name: "dinding utara tamu (barat bukaan)", min: [-4, 0, -1.06], max: [-1.4, 2.7, -0.94] },
  { name: "dinding utara tamu (timur bukaan)", min: [-0.2, 0, -1.06], max: [1.0, 2.7, -0.94] },
  { name: "meja tamu (daun)", min: [-2.9, 0.39, 0.275], max: [-1.9, 0.45, 0.825] },
  ...[[-2.85, 0.33], [-1.95, 0.33], [-2.85, 0.77], [-1.95, 0.77]].map(([x, z], i) => ({ name: `kaki meja ${i + 1}`, min: [x - 0.025, 0, z - 0.025] as V3, max: [x + 0.025, 0.4, z + 0.025] as V3 })),
  { name: "sofa", min: [-3.3, 0, -0.925], max: [-1.5, 0.87, -0.175] },
  { name: "lemari rendah", min: [-4 + T2 + 0.015, 0, 0.75], max: [-4 + T2 + 0.465, 0.8, 2.05] },
];
const boxDist = (p: THREE.Vector3, b: { min: V3; max: V3 }) => {
  const dx = Math.max(b.min[0] - p.x, 0, p.x - b.max[0]), dy = Math.max(b.min[1] - p.y, 0, p.y - b.max[1]), dz = Math.max(b.min[2] - p.z, 0, p.z - b.max[2]);
  const o = Math.hypot(dx, dy, dz);
  return o > 0 ? o : -Math.min(p.x - b.min[0], b.max[0] - p.x, p.y - b.min[1], b.max[1] - p.y, p.z - b.min[2], b.max[2] - p.z);
};
/** the storyboard's own measure: root to the box in plan view minus a body radius */
const rootBox = (r: V3, b: { min: V3; max: V3 }) => Math.hypot(Math.max(b.min[0] - r[0], 0, r[0] - b.max[0]), Math.max(b.min[2] - r[2], 0, r[2] - b.max[2]));
const armQ = (c: MChar, side: "L" | "R"): Q => { const p = c.pose as Record<string, unknown>; const a = p[side === "L" ? "armL" : "armR"] as [number, number]; return [a[0], a[1], (p[side === "L" ? "armLFwd" : "armRFwd"] as number) ?? 0]; };
const legRest = LAY.hipY - 0.012;
/** the renderer's hip offset (C1.tsx: TORSO_R × torsoWidth × 0.42 = 0.050); Npc uses the same rig numbers */
const HIP_X = TORSO_R * (C1_BUILD.torsoWidth ?? 1) * 0.42;

type R = Record<string, number | string>;
const measure = (clip: { dur: number; at: (t: number) => MFrame }, light = false): R => {
  const n = Math.round(clip.dur * 30);
  const w = { statU: 0, statA: 0, torsoU: 0, torsoUAt: "", torsoA: 0, torsoAAt: "", stepU: 0, stepUAt: "", stepA: 0, stepAAt: "", yawRate: 0, near: Infinity, nearAt: "", grip: Infinity, body: Infinity, bodyAt: "", wallB: Infinity, wallBAt: "", wallH: Infinity, wallHAt: "", sbU: Infinity, sbA: Infinity, headU: 0, headA: 0, drift: 0, driftAt: "", cross: Infinity, crossAt: "", stretch: 0, stretchAt: "", headJump: 0, headJumpAt: "", ledResU: 0, ledResA: 0, spreadU: 0, spreadUAt: "", spreadA: 0, spreadAAt: "" };
  let prev: MFrame | null = null;
  for (let f = 0; f <= n; f++) {
    const t = f / 30, ts = `${t.toFixed(2)} s`;
    const fr = clip.at(t);
    const uq = fr.chars.find((c) => c.who === "uq")!, ad = fr.chars.find((c) => c.who === "adik")!;
    // the limits apply to the MOVING arms, as in pilot v3 (p004_check: Uq rig L = his right, adik rig R = her left);
    // the static arms (Uq's phone arm, adik's jacket arm in Ep 2's last pose) are printed separately
    const tu = c1ArmTorsoDepth(armQ(uq, "L") as never, "L");
    const ta = c1ArmTorsoDepth(armQ(ad, "R") as never, "R", ad.height);
    w.statU = Math.max(w.statU, c1ArmTorsoDepth(armQ(uq, "R") as never, "R"));
    w.statA = Math.max(w.statA, c1ArmTorsoDepth(armQ(ad, "L") as never, "L", ad.height));
    if (tu > w.torsoU) { w.torsoU = tu; w.torsoUAt = ts; }
    if (ta > w.torsoA) { w.torsoA = ta; w.torsoAAt = ts; }
    w.headU = Math.max(w.headU, Math.abs((uq.pose.headYaw as number) ?? 0));
    w.headA = Math.max(w.headA, Math.abs((ad.pose.headYaw as number) ?? 0));
    if (prev) {
      const pu = prev.chars.find((c) => c.who === "uq")!, pa = prev.chars.find((c) => c.who === "adik")!;
      const su = Math.max(...[...armQ(uq, "L"), ...armQ(uq, "R")].map((v, k) => Math.abs(v - [...armQ(pu, "L"), ...armQ(pu, "R")][k])));
      const sa = Math.max(...[...armQ(ad, "L"), ...armQ(ad, "R")].map((v, k) => Math.abs(v - [...armQ(pa, "L"), ...armQ(pa, "R")][k])));
      if (su > w.stepU) { w.stepU = su; w.stepUAt = ts; }
      if (sa > w.stepA) { w.stepA = sa; w.stepAAt = ts; }
      const dy = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)) * D2);
      w.yawRate = Math.max(w.yawRate, dy(uq.yaw, pu.yaw), dy(ad.yaw, pa.yaw));
      // D-054: world head yaw (body + headYaw) jump per frame, rough flicker indicator
      for (const [c, p] of [[uq, pu], [ad, pa]] as const) {
        const j = dy(c.yaw + (((c.pose.headYaw as number) ?? 0) / D2), p.yaw + (((p.pose.headYaw as number) ?? 0) / D2));
        if (j > w.headJump) { w.headJump = j; w.headJumpAt = `${ts} ${c.who}`; }
      }
      for (const [c, p] of [[uq, pu], [ad, pa]] as const)
        for (const k of ["L", "R"] as const)
          if (c.feet && p.feet && c.feet.air[k] === 0 && p.feet.air[k] === 0) {
            const d = Math.hypot(c.feet[k][0] - p.feet[k][0], c.feet[k][2] - p.feet[k][2]);
            if (d > w.drift) { w.drift = d; w.driftAt = `${ts} ${c.who} ${k}`; }
          }
    }
    for (const c of [uq, ad]) {
      const lp = c.legPose as { L: { ankle: V3 }; R: { ankle: V3 } } | undefined;
      if (!lp) continue;
      const cr = lp.R.ankle[0] - lp.L.ankle[0]; // rig L foot sits at −x: must stay left of the R foot
      const crm = cr * c.height;
      if (crm < w.cross) { w.cross = crm; w.crossAt = `${ts} ${c.who}`; }
      for (const k of ["L", "R"] as const) {
        const hip = new THREE.Vector3(k === "L" ? -HIP_X : HIP_X, LAY.hipY, 0);
        const s = hip.distanceTo(new THREE.Vector3(...lp[k].ankle)) / legRest;
        if (s > w.stretch) { w.stretch = s; w.stretchAt = `${ts} ${c.who} ${k}`; }
      }
    }
    // D-055: MAX distance between the two feet (world xz) per character: a straddle shows here, not in the min
    for (const c of [uq, ad]) if (c.feet) {
      const g = Math.hypot(c.feet.L[0] - c.feet.R[0], c.feet.L[2] - c.feet.R[2]);
      if (c.who === "uq" && g > w.spreadU) { w.spreadU = g; w.spreadUAt = ts; }
      if (c.who === "adik" && g > w.spreadA) { w.spreadA = g; w.spreadAAt = ts; }
    }
    if (fr.diag) { w.ledResU = Math.max(w.ledResU, fr.diag.ledResU); w.ledResA = Math.max(w.ledResA, fr.diag.ledResA); }
    prev = fr;
    for (const [c, rad] of [[uq, 0.22], [ad, 0.16]] as const) {
      const m = Math.min(...BOXES.filter((b) => b.name.startsWith("meja") || b.name.startsWith("kaki meja")).map((b) => rootBox(c.root, b))) - rad;
      if (c.who === "uq") w.sbU = Math.min(w.sbU, m); else w.sbA = Math.min(w.sbA, m);
    }
    if (light) continue;
    const su = samples(uq), sa = samples(ad);
    const ph = { p: new THREE.Vector3(...fr.phone.p), r: 0.05, part: "ponsel Uq", kind: "ponsel" as const };
    const meet = fr.meet ? new THREE.Vector3(...fr.meet) : null;
    for (const a of [...su, ph]) for (const b of sa) {
      const d = a.p.distanceTo(b.p) - a.r - b.r;
      if (a.kind === "badan" && b.kind === "badan") { if (d < w.body) { w.body = d; w.bodyAt = ts; } continue; }
      if (meet && a.p.distanceTo(meet) < 0.08 && b.p.distanceTo(meet) < 0.08) { w.grip = Math.min(w.grip, d); continue; }
      if (d < w.near) { w.near = d; w.nearAt = `${ts} ${a.part} ↔ ${b.part}`; }
    }
    for (const s of [...su, ...sa]) for (const b of BOXES) {
      const d = boxDist(s.p, b) - s.r;
      if (s.kind === "tangan" || s.kind === "lengan" || s.kind === "jaket") { if (d < w.wallH) { w.wallH = d; w.wallHAt = `${ts} ${s.part} ↔ ${b.name}`; } }
      else if (d < w.wallB) { w.wallB = d; w.wallBAt = `${ts} ${s.part} ↔ ${b.name}`; }
    }
  }
  return w as unknown as R;
};
const cm = (x: number | string) => (typeof x === "number" ? (x * 100).toFixed(1) : x);
const flag = (ok: boolean) => (ok ? "lolos" : "**GAGAL**");
const report = (id: ClipId, clip: { dur: number; at: (t: number) => MFrame }, x = false) => {
  const w = measure(clip) as Record<string, number> & Record<string, string>;
  const n = (k: string) => w[k] as unknown as number;
  console.log(`\n[${id}] ${clip.dur.toFixed(1)} s`);
  console.log(`  lengan di torso sendiri: Uq ${cm(n("torsoU"))} cm (≤ 0,2) ${flag(Math.round(n("torsoU") * 1000) <= 2)} @ ${w.torsoUAt || "-"} | adik ${cm(n("torsoA"))} cm (≤ 0,0) ${flag(Math.round(n("torsoA") * 1000) <= 0)} @ ${w.torsoAAt || "-"} | lengan diam: ponsel Uq ${cm(n("statU"))} cm, jaket adik ${cm(n("statA"))} cm`);
  console.log(`  lompatan sendi lengan: Uq ${n("stepU").toFixed(1)}°/f (≤ 11,1) ${flag(n("stepU") <= 11.1)} @ ${w.stepUAt || "-"} | adik ${n("stepA").toFixed(1)}°/f (≤ 7,1) ${flag(n("stepA") <= 7.1)} @ ${w.stepAAt || "-"}`);
  console.log(`  Uq ↔ adik (tanpa badan↔badan${Number.isFinite(n("grip")) ? ", tanpa zona genggam" : ""}): ${cm(n("near"))} cm (≥ 1,7) ${flag(n("near") >= 0.017)} @ ${w.nearAt}`);
  if (Number.isFinite(n("grip"))) console.log(`  zona genggam (dikecualikan, ≤ 8 cm dari titik temu): mentah ${cm(n("grip"))} cm`);
  console.log(`  badan ↔ badan: ${cm(n("body"))} cm @ ${w.bodyAt}`);
  console.log(`  tubuh/kaki/kepala ↔ set: ${cm(n("wallB"))} cm @ ${w.wallBAt} | lengan/tangan/jaket ↔ set: ${cm(n("wallH"))} cm @ ${w.wallHAt}`);
  console.log(`  ukuran storyboard (akar ke meja − radius badan): Uq ${cm(n("sbU"))} cm (dicatat 17) | adik ${cm(n("sbA"))} cm (dicatat 12; lintasan 13)`);
  console.log(`  kaki: geser kaki tertanam maks ${(n("drift") * 1000).toFixed(1)} mm @ ${w.driftAt || "-"} | jarak antarkaki min ${cm(n("cross"))} cm @ ${w.crossAt || "-"} | regang kaki maks ${(n("stretch") * 100).toFixed(0)} % @ ${w.stretchAt || "-"}`);
  console.log(`  putaran badan maks ${n("yawRate").toFixed(1)}°/f | |headYaw| maks Uq ${n("headU").toFixed(0)}°, adik ${n("headA").toFixed(0)}° (batas rig ±60°)`);
  if (x) console.log(`  [D-054] arah kepala dunia (badan + kepala) lompatan maks ${n("headJump").toFixed(1)}°/f @ ${w.headJumpAt || "-"} | sisa sudut kepala→LED-1 di luar batas ±55°: Uq ${n("ledResU").toFixed(1)}°, adik ${n("ledResA").toFixed(1)}°`);
};

const mode = process.argv[2] ?? "all";
console.log(`belok: Uq ${TURN_U.toFixed(1)}° ke kiri (muka ${(YF_U * D2).toFixed(1)}° → lorong ${(YH_U * D2).toFixed(1)}°, = vektor POV S11); kepala di S12 ${S12_HEAD_U.toFixed(1)}° (vektor POV S12)`);
console.log(`waktu: S10 ${TIMES.s10}, S15 ${TIMES.s15} (${TIMES.s15dur} s), tatap ${TIMES.stare.join("–")}, L9 habis ${TIMES.l9end}, S13 habis ${TIMES.s13end}`);
const runAll = (label: string, o: Opts, only?: ClipId[]) => {
  const B = buildClips(o);
  const A1 = B.A1;
  const gap = Math.hypot(A1[0] - U1[0], A1[2] - U1[2]);
  const los = (["T", "D", "L", "K"] as const).map((k) => `${k}:${blockedBy([A1[0], 1.12, A1[2]], ledWorld(k)) ? "terhalang" : "terlihat"}`).join(" ");
  console.log(`\n======== ${label}: adik R1 (${A1[0].toFixed(2)}, ${A1[2].toFixed(2)}), jarak akar ${gap.toFixed(2)} m; belok adik ${((B.YH_A - B.YF_A) * D2).toFixed(1)}° | garis pandang adik ke LED: ${los}`);
  const g = B.GRIP;
  console.log(`  genggam: galat telapak Uq ${(g.uq.err * 100).toFixed(1)} cm, adik ${(g.adik.err * 100).toFixed(1)} cm; pose antara galat Uq ${(g.viaU.err * 100).toFixed(1)}, adik ${(g.viaA.err * 100).toFixed(1)} cm`);
  console.log(`  tatap: kepala Uq ke lensa yaw ${B.D_HEAD.start.yaw.toFixed(1)}→${B.D_HEAD.end.yaw.toFixed(1)}°, nod ${B.D_HEAD.start.nod.toFixed(1)}→${B.D_HEAD.end.nod.toFixed(1)}°`);
  for (const id of only ?? (Object.keys(B.CLIPS) as ClipId[])) report(id, B.CLIPS[id]);
};
if (mode === "all" || mode === "sb") runAll("STORYBOARD v0.3", {});
if (mode === "all" || mode === "tuck") {
  // grid: tuck the jacket arm (her own right, rig L) during the turn; own-torso ≤ 0, then the closest Uq↔adik distance
  const B0 = buildClips({});
  const res: { q: Q; near: number; td: number }[] = [];
  for (let a = -20; a <= 30; a += 10)
    for (let b = 60; b <= 140; b += 10)
      for (let fw = 40; fw <= 140; fw += 10) {
        const q: Q = [a, b, fw];
        const td = c1ArmTorsoDepth(q as never, "L", H_AD);
        if (td > 0) continue;
        const Bq = buildClips({ tuck: q });
        // quick: only adik's jacket arm + jacket vs Uq's body and arms, turn frames
        let near = Infinity;
        for (let f = 0; f <= Math.round(Bq.CLIPS.balik.dur * 30); f += 2) {
          const fr = Bq.CLIPS.balik.at(f / 30);
          const uq = fr.chars[0], ad = fr.chars[1];
          const su = samples(uq), sa = samples(ad).filter((s) => s.part.startsWith("lengan kanan adik") || s.kind === "jaket");
          for (const x of su) for (const y of sa) near = Math.min(near, x.p.distanceTo(y.p) - x.r - y.r);
        }
        res.push({ q, near, td });
      }
  res.sort((x, y) => y.near - x.near);
  console.log(`\n======== VARIAN lengan jaket dirapatkan saat berbalik (grid ${res.length} pose lolos torso; pose awal ${JACKET_Q.map((v) => v.toFixed(0)).join(", ")}):`);
  for (const r of res.slice(0, 6)) console.log(`  [${r.q.join(", ")}] jarak terdekat ke Uq ${(r.near * 100).toFixed(1)} cm`);
  void B0;
  if (res.length && res[0].near >= 0.017) runAll(`VARIAN tuck [${res[0].q.join(", ")}]`, { tuck: res[0].q }, ["balik"]);
}
if (mode === "all" || mode === "away") for (const d of [0.1, 0.15, 0.2]) runAll(`VARIAN adik melangkah ${d.toFixed(2)} m menjauh saat berbalik`, { away: d }, ["balik"]);
if (mode === "all" || mode === "meet") for (const m of [0.06, 0.14]) runAll(`VARIAN titik temu ${m.toFixed(2)} m di depan pinggul`, { meetFwd: m }, ["genggam", "tatap"]);
if (mode === "wide") for (const d of [0.6]) {
  const dir = new THREE.Vector3(A1_SB[0] - U1[0], 0, A1_SB[2] - U1[2]).normalize();
  runAll(`VARIAN R1 jarak ${d} m (mengubah storyboard)`, { A1: [U1[0] + dir.x * d, 0, U1[2] + dir.z * d] });
}

if (mode === "grip") {
  // search: meeting point (forward, lateral toward adik, height) × via offset; final pose first, then the path
  const rows: { o: Opts; fin: number; path: number; tu: number; ta: number; su: number; sa: number; eu: number; ea: number }[] = [];
  const sp = Number(process.env.M004_GAP ?? "0");
  const dirA = new THREE.Vector3(A1_SB[0] - U1[0], 0, A1_SB[2] - U1[2]).normalize();
  const A1g: V3 | undefined = sp > 0 ? [U1[0] + dirA.x * sp, 0, U1[2] + dirA.z * sp] : undefined;
  for (const meetFwd of [0.1, 0.14, 0.18, 0.22])
    for (const meetLat of [-0.04, 0, 0.04, 0.08])
      for (const meetY of [0.68, 0.74, 0.8])
        for (const viaFwd of [0.06, 0.12])
        for (const herT of [[0.2, 1.0], [0.2, 1.2]] as [number, number][]) {
          const o: Opts = { A1: A1g, meetFwd, meetLat, meetY, viaFwd, pathIK: process.env.M004_PATHIK !== "0", herT, hisT: [herT[0] + 0.15, herT[1]] };
          const B = buildClips(o);
          const g = B.GRIP;
          if (g.uq.err > 0.015 || g.adik.err > 0.015) continue;
          const m = measure(B.CLIPS.genggam) as unknown as Record<string, number>;
          const fin = (measure({ dur: 0.2, at: (t) => B.CLIPS.tatap.at(1.0 + t) }) as unknown as Record<string, number>).near;
          rows.push({ o, fin, path: m.near, tu: m.torsoU, ta: m.torsoA, su: m.stepU, sa: m.stepA, eu: g.uq.err, ea: g.adik.err });
        }
  const ok = (r: (typeof rows)[0]) => r.fin >= 0.017 && r.path >= 0.017 && Math.round(r.tu * 1000) <= 2 && Math.round(r.ta * 1000) <= 0 && r.su <= 11.1 && r.sa <= 7.1;
  rows.sort((a, b) => Math.min(b.fin, b.path) - Math.min(a.fin, a.path));
  console.log(`
======== CARI titik temu genggam: ${rows.length} kombinasi dengan galat telapak ≤ 1,5 cm; lolos semua batas: ${rows.filter(ok).length}`);
  for (const r of rows.slice(0, 12))
    console.log(`  [${r.o.herT}] maju ${r.o.meetFwd} lateral ${r.o.meetLat} tinggi ${r.o.meetY} via ${r.o.viaFwd}: akhir ${(r.fin * 100).toFixed(1)} cm, lintasan ${(r.path * 100).toFixed(1)} cm, torso Uq ${(r.tu * 100).toFixed(1)} adik ${(r.ta * 100).toFixed(1)}, langkah Uq ${r.su.toFixed(1)} adik ${r.sa.toFixed(1)}, galat ${(r.eu * 100).toFixed(1)}/${(r.ea * 100).toFixed(1)}${ok(r) ? "  LOLOS" : ""}`);
}

if (mode === "hishand") {
  const rows: { o: Opts; fin: number; path: number; tu: number; ta: number; su: number; sa: number; ea: number }[] = [];
  for (const a of [6, 12, 18]) for (const b of [8, 16, 24]) for (const fw of [0, 20, 40]) for (const viaFwd of [0, 0.04]) for (const herT of (process.env.M004_HERT ? JSON.parse(process.env.M004_HERT) : [[0.2, 1.0], [0.2, 1.2]]) as [number, number][]) {
    const o: Opts = { toHisHand: [a, b, fw], viaFwd, herT, hisT: [herT[1] - 0.45, herT[1]] };
    const B = buildClips(o);
    if (B.GRIP.adik.err > 0.015) continue;
    const m = measure(B.CLIPS.genggam) as unknown as Record<string, number>;
    const fin = (measure({ dur: 0.2, at: (t) => B.CLIPS.tatap.at(1.0 + t) }) as unknown as Record<string, number>).near;
    rows.push({ o, fin, path: m.near, tu: m.torsoU, ta: m.torsoA, su: m.stepU, sa: m.stepA, ea: B.GRIP.adik.err });
  }
  const ok = (r: (typeof rows)[0]) => r.fin >= 0.017 && r.path >= 0.017 && Math.round(r.tu * 1000) <= 2 && Math.round(r.ta * 1000) <= 0 && r.su <= 11.1 && r.sa <= 7.1;
  rows.sort((x, y) => Number(ok(y)) - Number(ok(x)) || Math.min(y.fin, y.path) - Math.min(x.fin, x.path));
  console.log(`
======== CARI "adik meraih tangan Uq yang diam": ${rows.length} kombinasi (galat adik ≤ 1,5 cm); lolos semua batas: ${rows.filter(ok).length}`);
  for (const r of rows.slice(0, 10)) console.log(`  tangan Uq [${r.o.toHisHand}] via ${r.o.viaFwd} adik [${r.o.herT}]: akhir ${(r.fin * 100).toFixed(1)} cm, lintasan ${(r.path * 100).toFixed(1)} cm, torso Uq ${(r.tu * 100).toFixed(1)} adik ${(r.ta * 100).toFixed(1)}, langkah Uq ${r.su.toFixed(1)} adik ${r.sa.toFixed(1)}, galat adik ${(r.ea * 100).toFixed(1)}${ok(r) ? "  LOLOS" : ""}`);
}

if (mode === "all" || mode === "prop") runAll("USULAN (adik melangkah 0,10 m saat berbalik; adik meraih tangan Uq yang diam, 1,25 s)", PROPOSED);
if (mode === "retreat")
  for (const r of [{ yawU: 0, yawA: 0, nU: 4, nA: 5 }, { yawU: 10, yawA: 0, nU: 4, nA: 5 }, { yawU: 0, yawA: 0, nU: 3, nA: 4 }])
    runAll(`OPSI mundur: badan Uq ${r.yawU}°, adik ${r.yawA}° (searah lintasan), kepala ke LED-1; langkah ${r.nU}/${r.nA}`, { ...PROPOSED, retreat: r }, ["mundur"]);

if (mode === "feetsweep") {
  // the retreat's feet alone (storyboard path, facing LED-1), n steps and first foot varied: min foot gap / max stretch
  const T: V3 = [0.905, 0, 2.905];
  const yawTo = (a: V3, b: V3) => Math.atan2(b[0] - a[0], b[2] - a[2]);
  const y0 = (w: string) => EP2_END.chars.find((c) => c.who === w)!.yaw;
  const one = (lab: string, from: V3, to: V3, ya: number, yb: number, h: number, n: number, first?: FootId) => {
    const st = stanceAt(from, ya, h);
    const m = chain(st, h, [walkSteps(st, to, yb, n, 0.2, 2.8, h, first)]);
    let cross = Infinity, ct = 0, str = 0, stt = 0;
    for (let f = 0; f <= 90; f++) {
      const lp = movesAt(m, f / 30).legPose;
      const c = (lp.R.ankle[0] - lp.L.ankle[0]) * h;
      if (c < cross) { cross = c; ct = f / 30; }
      for (const k of ["L", "R"] as const) { const a = lp[k].ankle; const d = Math.hypot(a[0] - (k === "L" ? -HIP_X : HIP_X), a[1] - LAY.hipY, a[2]) / legRest; if (d > str) { str = d; stt = f / 30; } }
    }
    console.log(`${lab.padEnd(16)} n=${n} first=${first ?? "auto"}: antarkaki min ${(cross * 100).toFixed(1)} cm @${ct.toFixed(2)} s | regang maks ${(str * 100).toFixed(0)} % @${stt.toFixed(2)} s`);
  };
  const D = Math.PI / 180;
  for (const n of [3, 4, 5, 6]) for (const fst of [undefined, "L", "R"] as (FootId | undefined)[]) one("Uq hadap LED", U0, U1, y0("uq"), yawTo(U1, T), 1.5, n, fst);
  for (const n of [4, 5, 6]) for (const fst of [undefined, "L", "R"] as (FootId | undefined)[]) one("adik hadap LED", A0, A1_SB, y0("adik"), yawTo(A1_SB, T), H_AD, n, fst);
  for (const y of [0, 15, 25]) for (const n of [3, 4]) one(`Uq badan ${y}°`, U0, U1, y * D, y * D, 1.5, n);
  for (const y of [0, 15, 25]) for (const n of [4, 5]) one(`adik badan ${y}°`, A0, A1_SB, y * D, y * D, H_AD, n);
}

// ================================================================ D-054 (owner 2026-11-20): option (a), insert, retests
// Pass = every owner limit above + feet not crossing + planted-foot drift 0 (the D-053 visual failure).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WR = Record<string, any>;
const passA = (w: WR) =>
  Math.round(w.torsoU * 1000) <= 2 && Math.round(w.torsoA * 1000) <= 0 && w.stepU <= 11.1 && w.stepA <= 7.1 && w.near >= 0.017 && w.cross > 0 && w.drift < 1e-6;
const S10_BASE = { nU: 4, nA: 5, turn0: 0.45 };
if (mode === "s10a") {
  console.log(`\n======== D-054 MUNDUR OPSI (a), SATU ITERASI. Kenop yang dideklarasikan sebelum dijalankan:
  putaran awal disebar 0–0,45 s (D-053: 0–0,25 s, 12,8°/f); badan Uq {0, 10}°, adik {0, 10}° (lintasan mundur: Uq 179,4° = badan 0°, adik 167,4° = badan −12,6°);
  lengan raih: jarak sisa {13, 20} cm × waktu {D-053 [0,05 0,55 1,1 2,0], awal [0,05 0,5 0,9 1,45]};
  akhir jalan {2,80 s → putaran ke lorong 0,70 s, 2,65 s → 0,85 s}. Langkah 4/5. Lintasan, lensa, garis pandang LED tetap.`);
  const rows: { lab: string; w: WR; info: Record<string, number> }[] = [];
  for (const yawU of [0, 10]) for (const yawA of [0, 10]) for (const gap of [0.13, 0.2])
    for (const armT of [[0.05, 0.55, 1.1, 2.0], [0.05, 0.5, 0.9, 1.45]] as [number, number, number, number][])
      for (const walkEnd of [2.8, 2.65]) {
        const B = buildClips({ ...PROPOSED, s10: { ...S10_BASE, yawU, yawA, gap, armT, walkEnd, out: 3.5 - walkEnd } });
        const w = measure(B.CLIPS.mundur) as never as WR;
        rows.push({ lab: `Uq ${yawU}° adik ${yawA}° sisa ${gap * 100} cm lengan ${armT[2] === 1.1 ? "D-053" : "awal "} jalan→${walkEnd}`, w, info: B.S10_INFO! });
      }
  for (const r of rows) {
    const w = r.w;
    console.log(`  ${r.lab}: ${passA(w) ? "LOLOS" : "gagal"} | Uq↔adik ${(w.near * 100).toFixed(1)} cm @ ${w.nearAt} | torso ${(w.torsoU * 100).toFixed(1)}/${(w.torsoA * 100).toFixed(1)} | sendi ${w.stepU.toFixed(1)}/${w.stepA.toFixed(1)} | antarkaki ${(w.cross * 100).toFixed(1)} cm @ ${w.crossAt} | regang ${(w.stretch * 100).toFixed(0)} % | badan ${w.yawRate.toFixed(1)}°/f | kepala dunia ${w.headJump.toFixed(1)}°/f | sisa LED Uq ${w.ledResU.toFixed(1)}° adik ${w.ledResA.toFixed(1)}° | v ${r.info.speedU.toFixed(2)}/${r.info.speedA.toFixed(2)} m/s`);
  }
  console.log(`  lolos: ${rows.filter((r) => passA(r.w)).length} dari ${rows.length}`);
}
// the chosen (a) variant, full report (mundur = S10 0–3.5 s incl. the turn to the hallway; balik continues it)
const S10_PICK = (walkEnd: number) => ({ ...S10_BASE, yawU: Number(process.env.M004_YU ?? 0), yawA: Number(process.env.M004_YA ?? 0), gap: Number(process.env.M004_GAPA ?? 0.2), armT: JSON.parse(process.env.M004_ARMT ?? "[0.05,0.5,0.9,1.45]") as [number, number, number, number], walkEnd, out: 3.5 - walkEnd });
if (mode === "s10pick") for (const we of [2.8, 2.65]) {
  const B = buildClips({ ...PROPOSED, s10: S10_PICK(we) });
  console.log(`\n======== D-054 PILIHAN (a): ${JSON.stringify(S10_PICK(we))}; info ${JSON.stringify(B.S10_INFO, (k, v) => (typeof v === "number" ? Number(v.toFixed(3)) : v))}`);
  report("mundur", B.CLIPS.mundur, true);
  report("balik", B.CLIPS.balik, true);
}
// insert + two-shot + stare with the new timeline (src/ep004/episode004-plan-d054.json, via motion004d054.ts)
import { d054Opts } from "../src/ep004/motion004d054";
const env = (k: string) => (process.env[k] !== undefined ? Number(process.env[k]) : undefined);
const INSERT_OPTS = (): Opts => d054Opts(Object.fromEntries(Object.entries({ dist: env("M004_ID"), h: env("M004_IH"), fov: env("M004_IF"), swing: env("M004_IS"), lookDy: env("M004_IL") }).filter(([, v]) => v !== undefined)));
if (mode === "insert") {
  const B = buildClips(INSERT_OPTS());
  const D = B.D_HEAD as unknown as Record<string, { yaw: number; nod: number }>;
  console.log(`\n======== D-054 INSERT GENGGAM: kamera ${JSON.stringify(B.INSERT_INFO, (k, v) => (typeof v === "number" ? Number(v.toFixed(3)) : v))}`);
  console.log(`  tatap (lensa P, waktu baru): kepala yaw ${D.start2.yaw.toFixed(1)}→${D.end2.yaw.toFixed(1)}°, nod ${D.start2.nod.toFixed(1)}→${D.end2.nod.toFixed(1)}° (D-053: 3,9 / −3,5)`);
  report("genggam", B.CLIPS.insert as never, true);
  report("genggam", B.CLIPS.dua as never, true);
  report("tatap", B.CLIPS.tatap2 as never, true);
}
// the same grid measured in two windows: the RETREAT [0, walkEnd] (owner item 1) and the TURN to the hallway
// [walkEnd, 3.5] (owner item 3, re-test of the berbalik motion); one window's failure is not the other's
if (mode === "s10split") {
  console.log(`\n======== D-054 MUNDUR (a): grid yang sama, diukur per jendela: MUNDUR [0, akhir jalan] dan PUTAR ke lorong [akhir jalan, 3,5 s]`);
  let pass = 0, n = 0;
  for (const yawU of [0, 10]) for (const yawA of [0, 10]) for (const gap of [0.13, 0.2])
    for (const armT of [[0.05, 0.55, 1.1, 2.0], [0.05, 0.5, 0.9, 1.45]] as [number, number, number, number][])
      for (const walkEnd of [2.8, 2.65]) {
        const B = buildClips({ ...PROPOSED, s10: { ...S10_BASE, yawU, yawA, gap, armT, walkEnd, out: 3.5 - walkEnd } });
        const c = B.CLIPS.mundur;
        const wr = measure({ dur: walkEnd, at: c.at }) as never as WR;
        const wt = measure({ dur: 3.5 - walkEnd, at: (t) => c.at(walkEnd + t) }) as never as WR;
        n++; if (passA(wr)) pass++;
        const f = (w: WR) => `${passA(w) ? "LOLOS" : "gagal"} ↔ ${(w.near * 100).toFixed(1)} cm @ ${w.nearAt} | torso ${(w.torsoU * 100).toFixed(1)}/${(w.torsoA * 100).toFixed(1)} | sendi ${w.stepU.toFixed(1)}/${w.stepA.toFixed(1)} | antarkaki ${(w.cross * 100).toFixed(1)} @ ${w.crossAt} | regang ${(w.stretch * 100).toFixed(0)} % | badan ${w.yawRate.toFixed(1)}°/f | kepala ${w.headJump.toFixed(1)}°/f | sisa LED ${w.ledResU.toFixed(1)}/${w.ledResA.toFixed(1)}°`;
        console.log(`  Uq ${yawU}° adik ${yawA}° sisa ${gap * 100} cm lengan ${armT[2] === 1.1 ? "D-053" : "awal "} jalan→${walkEnd}\n     MUNDUR: ${f(wr)}\n     PUTAR : ${f(wt)}`);
      }
  console.log(`  jendela MUNDUR lolos: ${pass} dari ${n}`);
}
if (mode === "s10best") {
  // closest candidates: full retreat-window report + the standing pair at R1 with both bodies at the (a) yaw, arms at rest
  for (const [yawU, yawA, gap, we] of [[0, 0, 0.2, 2.8], [0, 0, 0.2, 2.65], [0, 10, 0.2, 2.8]] as number[][]) {
    const s = { ...S10_BASE, yawU, yawA, gap, armT: [0.05, 0.5, 0.9, 1.45] as [number, number, number, number], walkEnd: we, out: 3.5 - we };
    const B = buildClips({ ...PROPOSED, s10: s });
    console.log(`\n======== kandidat terdekat ${JSON.stringify(s)} | ${JSON.stringify(B.S10_INFO, (k, v) => (typeof v === "number" ? Number(v.toFixed(3)) : v))}`);
    report("mundur", { dur: we, at: B.CLIPS.mundur.at }, true);
    const c = B.CLIPS.mundur.at(we);
    const st = measure({ dur: 0.0, at: () => c }) as never as WR;
    console.log(`  berdiri di R1 pada akhir jalan (badan ${yawU}°/${yawA}°, lengan diam): Uq↔adik ${(st.near * 100).toFixed(1)} cm @ ${st.nearAt}`);
  }
}
if (mode === "s13") {
  // the S13 turn back (clip "balik" 2.2–3.8 s = hallway → front, 1.1 s) with the closest (a) candidate, and D-053 PROPOSED
  for (const [lab, o] of [["D-053 USULAN (badan ke LED-1 di akhir S10)", PROPOSED], ["kandidat (a) terdekat", { ...PROPOSED, s10: { ...S10_BASE, yawU: 0, yawA: 0, gap: 0.2, armT: [0.05, 0.5, 0.9, 1.45] as [number, number, number, number], walkEnd: 2.8, out: 0.7 } }]] as [string, Opts][]) {
    const B = buildClips(o);
    console.log(`\n======== S13 putar balik 1,1 s — ${lab}`);
    report("balik", { dur: 1.6, at: (t) => B.CLIPS.balik.at(2.2 + t) }, true);
  }
}

// ================================================================ D-055 (owner 2026-11-20): retreat option (b), then (c)
// Chain check (numbers, no render) from a candidate R1: LED sightlines (Uq's POV eye 1.42 m, adik 1.12 m, the other
// character as occluder), S11/S12 POV with the storyboard aim points (in frame at both fovs), turn angle, S12 head angle,
// and body distances (table: storyboard measure; walls/sofa/cabinet: rig samples as in the pilot, 49.6 cm).
const ST_S11: V3 = [-0.6, 1.95, -3.6], ST_S12: V3 = [2.6, 1.75, -0.45];
const pxOf = (eye: V3, aim: V3, fov: number, p: V3) => {
  const cam = new THREE.PerspectiveCamera(fov, 1080 / 1920, 0.01, 100);
  cam.position.set(...eye); cam.lookAt(new THREE.Vector3(...aim)); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(cam);
  return { x: (v.x + 1) * 540, y: (1 - v.y) * 960, inFront: v.z < 1 };
};
const inFrame = (q: { x: number; y: number; inFront: boolean }) => q.inFront && q.x >= 0 && q.x <= 1080 && q.y >= 0 && q.y <= 1920;
export const chainCheck = (lab: string, U: V3, A: V3) => {
  const yawTo2 = (a: V3, b: V3) => Math.atan2(b[0] - a[0], b[2] - a[2]);
  const T = ledWorld("T");
  const occU = [{ root: A, height: H_AD, who: "adik" as const }], occA = [{ root: U, height: 1.5, who: "uq" as const }];
  const eyeU: V3 = [U[0], 1.42, U[2]], eyeA: V3 = [A[0], 1.12, A[2]];
  const eyeU12: V3 = [U[0] + 0.05, 1.42, U[2] - 0.05];
  const rows: string[] = [];
  let ok = true;
  const chk = (name: string, pass: boolean, val: string) => { rows.push(`    ${pass ? "lolos" : "**GAGAL**"}  ${name}: ${val}`); ok &&= pass; };
  const bU = blockedBy(eyeU, T, occU), bA = blockedBy(eyeA, T, occA);
  chk("LED-1 dari mata Uq", !bU, bU ?? "terlihat");
  chk("LED-1 dari mata adik", !bA, bA ?? "terlihat");
  for (const [id, nm] of [["D", "LED-2 dapur"], ["L", "LED-3 lorong"]] as const) {
    const b = blockedBy(eyeU, ledWorld(id), occU);
    const p32 = pxOf(eyeU, ST_S11, 32, ledWorld(id)), p26 = pxOf(eyeU, ST_S11, 26, ledWorld(id));
    chk(`S11 POV ${nm}`, !b && inFrame(p32) && inFrame(p26), `${b ?? "tidak terhalang"}; px fov32 (${p32.x.toFixed(0)}; ${p32.y.toFixed(0)}), fov26 (${p26.x.toFixed(0)}; ${p26.y.toFixed(0)})`);
    // how far below (+) / above (−) the opening's top edge the sightline passes at the north wall z −1.06..−0.94 (y 2.20)
    const L = ledWorld(id);
    const yAt = (z: number) => eyeU[1] + ((z - eyeU[2]) / (L[2] - eyeU[2])) * (L[1] - eyeU[1]);
    const xAt = (z: number) => eyeU[0] + ((z - eyeU[2]) / (L[2] - eyeU[2])) * (L[0] - eyeU[0]);
    rows.push(`           garis ke ${nm} di dinding utara: y ${yAt(-0.94).toFixed(3)}–${yAt(-1.06).toFixed(3)} m (ambang 2,20), x ${xAt(-0.94).toFixed(3)}–${xAt(-1.06).toFixed(3)} (bukaan −1,40..−0,20)`);
  }
  const bK = blockedBy(eyeU12, ledWorld("K"), occU);
  const k30 = pxOf(eyeU12, ST_S12, 30, ledWorld("K")), k26 = pxOf(eyeU12, ST_S12, 26, ledWorld("K"));
  chk("S12 POV LED-4 kamar", !bK && inFrame(k30) && inFrame(k26), `${bK ?? "tidak terhalang"}; px fov30 (${k30.x.toFixed(0)}; ${k30.y.toFixed(0)}), fov26 (${k26.x.toFixed(0)}; ${k26.y.toFixed(0)})`);
  const yF = yawTo2(U, T), yH = yawTo2(U, ST_S11), y12 = yawTo2(eyeU12, ST_S12);
  const turn = Math.atan2(Math.sin(yH - yF), Math.cos(yH - yF)) * D2, head12 = Math.atan2(Math.sin(y12 - yH), Math.cos(y12 - yH)) * D2;
  const yFA = yawTo2(A, T), yHA = yawTo2(A, ST_S11);
  rows.push(`           putar ke lorong: Uq ${turn.toFixed(1)}° (muka ${(yF * D2).toFixed(1)}° → lorong ${(yH * D2).toFixed(1)}°), adik ${(Math.atan2(Math.sin(yHA - yFA), Math.cos(yHA - yFA)) * D2).toFixed(1)}°`);
  chk("S12 kepala relatif badan (±55°)", Math.abs(head12) <= 55, `${head12.toFixed(1)}°`);
  const table = BOXES.filter((b) => b.name.startsWith("meja") || b.name.startsWith("kaki meja"));
  const sbU = Math.min(...table.map((b) => rootBox(U, b))) - 0.22, sbA = Math.min(...table.map((b) => rootBox(A, b))) - 0.16;
  chk("meja (ukuran storyboard) Uq ≥ 17 cm", Math.round(sbU * 100) >= 17, `${(sbU * 100).toFixed(1)} cm`);
  chk("meja (ukuran storyboard) adik ≥ 12 cm", Math.round(sbA * 100) >= 12, `${(sbA * 100).toFixed(1)} cm`);
  // rig samples standing at R1, facing LED-1, rest arms (Uq: phone arm as in Ep 2; adik: jacket arm)
  const fr = (root: V3, yaw: number, who: "uq" | "adik"): MChar => {
    const e = EP2_END.chars.find((c) => c.who === who)!;
    const m = movesAt(chain(stanceAt(root, yaw, e.height), e.height, []), 0);
    return { who, root, yaw, height: e.height, legPose: m.legPose, pose: { ...(e.pose as object), headYaw: 0, headNod: 0 }, face: {} } as MChar;
  };
  for (const [c, nm] of [[fr(U, yF, "uq"), "Uq"], [fr(A, yFA, "adik"), "adik"]] as const) {
    let best = Infinity, at = "";
    for (const s of samples(c)) for (const b of BOXES) {
      if (b.name.startsWith("meja") || b.name.startsWith("kaki meja")) continue;
      const d = boxDist(s.p, b) - s.r;
      if (d < best) { best = d; at = `${s.part} ↔ ${b.name}`; }
    }
    chk(`${nm} ↔ dinding/sofa/lemari (rig) ≥ 49,6 cm`, best >= 0.496, `${(best * 100).toFixed(1)} cm (${at})`);
  }
  console.log(`  ${lab}: Uq (${U[0].toFixed(3)}; ${U[2].toFixed(3)}), adik (${A[0].toFixed(3)}; ${A[2].toFixed(3)}), jarak akar ${Math.hypot(A[0] - U[0], A[2] - U[2]).toFixed(2)} m → ${ok ? "LOLOS" : "GAGAL"}`);
  for (const r of rows) console.log(r);
  return ok;
};
/** option (b) R1: straight away from LED-1 by d (plan view); adik the same, then closing to `gap` from Uq */
export const r1b = (d: number, gap = 0.41) => {
  const T = ledWorld("T");
  const away = (p: V3) => { const v = new THREE.Vector2(p[0] - T[0], p[2] - T[2]).normalize(); return [p[0] + v.x * d, 0, p[2] + v.y * d] as V3; };
  const U = away(U0), Araw = away(A0);
  const v = new THREE.Vector2(Araw[0] - U[0], Araw[2] - U[2]).normalize();
  return { U, A: [U[0] + v.x * gap, 0, U[2] + v.y * gap] as V3, Araw };
};
if (mode === "s10b_chain") {
  console.log(`\n======== D-055 CEK BERANTAI opsi (b). Pembanding: R1 storyboard (bukan bagian grid)`);
  chainCheck("R1 storyboard v0.3", U1, A1_SB);
  let n = 0;
  for (const d of [0.9, 1.0, 1.1]) { const r = r1b(d); console.log(`\n  -- d = ${d} m (adik tanpa merapat akan di (${r.Araw[0].toFixed(3)}; ${r.Araw[2].toFixed(3)}))`); if (chainCheck(`R1 (b) d ${d}`, r.U, r.A)) n++; }
  console.log(`\n  jarak d yang lolos cek berantai: ${n} dari 3`);
}
// option (c): the declared grid (header in _media/2026-11-004/out/motion_v3/qc/angka_s10c_iterasi.txt)
const s10cOpts = (cycles: [number, number], body: "pulse" | "glide", arm: "D-053" | "awal"): Opts => ({
  ...PROPOSED,
  s10c: { cycles, body, gap: arm === "D-053" ? 0.13 : 0.2, armT: arm === "D-053" ? [0.05, 0.55, 1.1, 2.0] : [0.05, 0.5, 0.9, 1.45], walkEnd: 2.8, out: 0.7 },
});
const lineW = (w: WR) => `${passA(w) ? "LOLOS" : "gagal"} | Uq↔adik ${(w.near * 100).toFixed(1)} cm @ ${w.nearAt} | torso ${(w.torsoU * 100).toFixed(1)}/${(w.torsoA * 100).toFixed(1)} @ ${w.torsoUAt || "-"}/${w.torsoAAt || "-"} | sendi ${w.stepU.toFixed(1)} @ ${w.stepUAt || "-"} / ${w.stepA.toFixed(1)} | antarkaki ${(w.cross * 100).toFixed(1)} cm @ ${w.crossAt} | geser ${(w.drift * 1000).toFixed(1)} mm | regang ${(w.stretch * 100).toFixed(0)} % @ ${w.stretchAt} | badan ${w.yawRate.toFixed(1)}°/f | kepala dunia ${w.headJump.toFixed(1)}°/f @ ${w.headJumpAt} | meja sb ${(w.sbU * 100).toFixed(1)}/${(w.sbA * 100).toFixed(1)} cm | set rig tubuh ${(w.wallB * 100).toFixed(1)} tangan ${(w.wallH * 100).toFixed(1)} cm | sisa LED ${w.ledResU.toFixed(1)}/${w.ledResA.toFixed(1)}°`;
if (mode === "s10c") {
  console.log(`\n======== D-055 MUNDUR OPSI (c) geser-rapat: grid 8 varian, jendela MUNDUR [0; 2,8] dan PUTAR [2,8; 3,5]`);
  let pass = 0;
  for (const cycles of [[3, 3], [4, 4]] as [number, number][]) for (const body of ["pulse", "glide"] as const) for (const arm of ["D-053", "awal"] as const) {
    const B = buildClips(s10cOpts(cycles, body, arm));
    const c = B.CLIPS.mundur;
    const wr = measure({ dur: 2.8, at: c.at }) as never as WR;
    const wt = measure({ dur: 0.7, at: (t) => c.at(2.8 + t) }) as never as WR;
    if (passA(wr) && passA(wt) && Math.round(wr.sbU * 100) >= 17 && Math.round(wr.sbA * 100) >= 12) pass++;
    console.log(`  siklus ${cycles.join("/")} badan ${body === "pulse" ? "denyut" : "luncur"} lengan ${arm} | info ${JSON.stringify(B.S10_INFO, (k, v) => (typeof v === "number" ? Number(v.toFixed(2)) : v))}\n     MUNDUR: ${lineW(wr)}\n     PUTAR : ${lineW(wt)}`);
  }
  console.log(`  lolos kedua jendela (+ meja storyboard): ${pass} dari 8`);
}
if (mode === "s10cpick") {
  const cy = JSON.parse(process.env.M004_CY ?? "[3,3]") as [number, number], bd = (process.env.M004_BODY ?? "pulse") as "pulse" | "glide", ar = (process.env.M004_ARM ?? "D-053") as "D-053" | "awal";
  const B = buildClips(s10cOpts(cy, bd, ar));
  console.log(`\n======== D-055 PILIHAN (c): siklus ${cy} badan ${bd} lengan ${ar}; info ${JSON.stringify(B.S10_INFO, (k, v) => (typeof v === "number" ? Number(v.toFixed(3)) : v))}`);
  report("mundur", { dur: 2.8, at: B.CLIPS.mundur.at }, true);
  report("mundur", { dur: 0.7, at: (t) => B.CLIPS.mundur.at(2.8 + t) }, true);
  report("balik", B.CLIPS.balik, true);
  report("balik", { dur: 1.6, at: (t) => B.CLIPS.balik.at(2.2 + t) }, true);
}
// D-055 insert 2.0 s + two-shot + stare (plan d055), three lens-P push mappings; push speed vs the old 9.15 s plan
import { d055Opts } from "../src/ep004/motion004d055";
import type { CamMode } from "../src/ep004/motion004d055";
if (mode === "insert55") {
  const speed = (at: (t: number) => { pos: V3; fov: number }, n: number) => {
    let v = 0, vf = 0;
    for (let f = 1; f <= n; f++) { const a = at((f - 1) / 30), b = at(f / 30); v = Math.max(v, new THREE.Vector3(...a.pos).distanceTo(new THREE.Vector3(...b.pos)) * 30); vf = Math.max(vf, Math.abs(a.fov - b.fov) * 30); }
    return { v, vf };
  };
  const B0 = buildClips({ ...PROPOSED, insert: { dur: 0, dist: 0.75, h: 0.75, fov: 40, swing: 0, lookDy: 0, twoStart: 59.2, twoDur: 9.15, stare0: 63.85 } });
  const old = speed((t) => B0.CLIPS.dua.at(t).cam, Math.round(9.15 * 30));
  console.log(`\n======== D-055 INSERT 2,0 s. Rencana lama (S15 59,20–68,35, 9,15 s): dorong maks ${(old.v * 100).toFixed(2)} cm/s, fov ${old.vf.toFixed(2)}°/s`);
  for (const cm of ["lama", "cepat", "mulai"] as CamMode[]) {
    const B = buildClips(d055Opts(cm));
    const I = B.CLIPS.dua;
    const sp = speed((t) => I.at(t).cam, Math.round(7.95 * 30));
    const c0 = I.at(0).cam, c1 = I.at(7.95).cam;
    const D = B.D_HEAD as unknown as Record<string, { yaw: number; nod: number }>;
    console.log(`  kamera "${cm}": dorong maks ${(sp.v * 100).toFixed(2)} cm/s (${((sp.v / old.v) * 100).toFixed(0)} % lama), fov ${sp.vf.toFixed(2)}°/s | awal pos ${c0.pos.map((x) => x.toFixed(3))} fov ${c0.fov.toFixed(2)} | akhir pos ${c1.pos.map((x) => x.toFixed(3))} fov ${c1.fov.toFixed(2)} | tatap: yaw ${D.start2.yaw.toFixed(1)}→${D.end2.yaw.toFixed(1)}°, nod ${D.start2.nod.toFixed(1)}→${D.end2.nod.toFixed(1)}°`);
  }
  const B = buildClips(d055Opts("lama"));
  console.log(`  lensa insert ${JSON.stringify(B.INSERT_INFO, (k, v) => (typeof v === "number" ? Number(v.toFixed(3)) : v))}`);
  report("genggam", B.CLIPS.insert as never, true);
  report("genggam", B.CLIPS.dua as never, true);
  report("tatap", B.CLIPS.tatap2 as never, true);
}

// D-055: max foot gap (straddle) per variant + Uq body yaw at keys; kept log for the numbers in D-055 / content.md §22.3
if (mode === "spread") {
  const rows: [string, Opts, number][] = [
    ["(c) pilihan: 3/3 denyut lengan D-053", s10cOpts([3, 3], "pulse", "D-053"), 2.8],
    ["(a) kandidat terdekat D-054", { ...PROPOSED, s10: { ...S10_BASE, yawU: 0, yawA: 0, gap: 0.2, armT: [0.05, 0.5, 0.9, 1.45], walkEnd: 2.8, out: 0.7 } }, 2.8],
    ["storyboard literal D-053 (kaki bersilang)", PROPOSED, 3.0],
  ];
  console.log(`
======== D-055 jarak antarkaki MAKS (dunia xz; diam: Uq 15,0 cm, adik 12,7 cm)`);
  for (const [lab, o, dur] of rows) {
    const B = buildClips(o);
    const w = measure({ dur, at: B.CLIPS.mundur.at }, true) as never as WR;
    const yaws = [0, 0.2, 0.5, 0.8, 1.07, 1.5, 2.0, 2.8].map((t) => `${t.toFixed(2)} s ${(B.CLIPS.mundur.at(t).chars[0].yaw * D2).toFixed(1)}°`).join(", ");
    console.log(`  ${lab}: Uq ${(w.spreadU * 100).toFixed(1)} cm @ ${w.spreadUAt} | adik ${(w.spreadA * 100).toFixed(1)} cm @ ${w.spreadAAt} | antarkaki min ${(w.cross * 100).toFixed(1)} cm
     yaw badan Uq: ${yaws}`);
  }
}

// D-056 (owner): S10 (c) hand iteration — screen distance (px) from lens S10 between Uq's hand and adik's hand/jacket/arm
const screenGap = (clip: { dur: number; at: (t: number) => MFrame }, dur: number) => {
  let best = Infinity, at = "", body = Infinity, bodyAt = "";
  for (let f = 0; f <= Math.round(dur * 30); f++) {
    const fr = clip.at(f / 30);
    const cam = new THREE.PerspectiveCamera(fr.cam.fov, 1080 / 1920, 0.01, 100);
    cam.position.set(...fr.cam.pos); cam.lookAt(new THREE.Vector3(...fr.cam.look)); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const fpx = 960 / Math.tan((fr.cam.fov * Math.PI) / 360);
    const P = (s: { p: THREE.Vector3; r: number }) => { const d = s.p.clone().applyMatrix4(cam.matrixWorldInverse); const v = s.p.clone().project(cam); return { x: (v.x + 1) * 540, y: (1 - v.y) * 960, r: (s.r * fpx) / Math.max(0.05, -d.z) }; };
    const uq = fr.chars.find((c) => c.who === "uq")!, ad = fr.chars.find((c) => c.who === "adik")!;
    const hand = samples(uq).filter((s) => s.part.startsWith("lengan kanan Uq") && s.kind === "tangan").map(P);
    for (const s of samples(ad)) {
      const q = P(s);
      for (const h of hand) {
        const d = Math.hypot(q.x - h.x, q.y - h.y) - q.r - h.r;
        if (s.kind === "badan") { if (d < body) { body = d; bodyAt = `${(f / 30).toFixed(2)} s`; } continue; }
        if (s.kind === "tangan" || s.kind === "jaket" || s.kind === "lengan") if (d < best) { best = d; at = `${(f / 30).toFixed(2)} s ${s.part}`; }
      }
    }
  }
  return { best, at, body, bodyAt };
};
if (mode === "s10hand") {
  console.log(`
======== D-056 S10 (c) tangan Uq: grid 6 varian (jendela mundur 0–2,8 s; layar px dari lensa S10)`);
  let pick: { lab: string; g: number } | null = null;
  for (const gap of [0.13, 0.2, 0.27]) for (const y of [0.92, 1.02]) {
    const o = s10cOpts([3, 3], "pulse", "D-053");
    o.s10c = { ...o.s10c!, gap, reachY: y };
    const B = buildClips(o);
    const c = B.CLIPS.mundur;
    const w = measure({ dur: 2.8, at: c.at }) as never as WR;
    const wt = measure({ dur: 0.7, at: (t) => c.at(2.8 + t) }) as never as WR;
    const sg = screenGap(c, 2.8);
    const ok = passA(w) && passA(wt) && Math.round(w.sbU * 100) >= 17 && Math.round(w.sbA * 100) >= 12 && sg.best >= 12;
    const lab = `sisa ${gap * 100} cm tinggi ${y}`;
    if (ok && (!pick || sg.best > pick.g)) pick = { lab, g: sg.best };
    console.log(`  ${lab}: ${ok ? "LOLOS" : "gagal"} | layar tangan Uq↔tangan/jaket/lengan adik ${sg.best.toFixed(1)} px @ ${sg.at} | ↔ badan adik ${sg.body.toFixed(1)} px @ ${sg.bodyAt}
     MUNDUR: ${lineW(w)}
     PUTAR : ${lineW(wt)}`);
  }
  console.log(`  pilihan: ${pick ? pick.lab + ` (${pick.g.toFixed(1)} px)` : "tidak ada → kembali ke D-055"}`);
}
if (mode === "s10hand_diag") {
  // diagnosis only (after the declared run): the D-055 variant, adik's HAND and JACKET only (owner's words), per 0.1 s
  const B = buildClips(s10cOpts([3, 3], "pulse", "D-053"));
  const c = B.CLIPS.mundur;
  const rows: string[] = [];
  for (let f = 0; f <= 84; f += 3) {
    const fr = c.at(f / 30);
    const cam = new THREE.PerspectiveCamera(fr.cam.fov, 1080 / 1920, 0.01, 100);
    cam.position.set(...fr.cam.pos); cam.lookAt(new THREE.Vector3(...fr.cam.look)); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const fpx = 960 / Math.tan((fr.cam.fov * Math.PI) / 360);
    const P = (s: { p: THREE.Vector3; r: number }) => { const d = s.p.clone().applyMatrix4(cam.matrixWorldInverse); const v = s.p.clone().project(cam); return { x: (v.x + 1) * 540, y: (1 - v.y) * 960, r: (s.r * fpx) / Math.max(0.05, -d.z) }; };
    const uq = fr.chars[0], ad = fr.chars[1];
    const hand = samples(uq).filter((s) => s.part.startsWith("lengan kanan Uq") && s.kind === "tangan").map(P);
    const g = (k: string[]) => Math.min(...samples(ad).filter((s) => k.includes(s.kind)).map(P).flatMap((q) => hand.map((h) => Math.hypot(q.x - h.x, q.y - h.y) - q.r - h.r)));
    rows.push(`  ${(f / 30).toFixed(2)} s: tangan/jaket ${g(["tangan", "jaket"]).toFixed(0)} px | lengan ${g(["lengan"]).toFixed(0)} px | badan ${g(["badan"]).toFixed(0)} px`);
  }
  console.log(`\n======== diagnosis sesudah iterasi (varian D-055): jarak layar tangan kanan Uq ↔ bagian adik, px\n${rows.join("\n")}`);
}
// ================================================================ D-056 tahap 2: per-shot QC on the episode timeline
import { charsAt, ledsAt, s11Fov, S11_FOV_END, SHOTS55, stage55 } from "../src/ep004/episode004Stage";
const epClip = (t0: number, t1: number) => ({ dur: t1 - t0, at: (x: number): MFrame => { const t = t0 + x; const c = charsAt(t); return { cam: stage55(t).cam, chars: c.chars, phone: c.phone, led: ledsAt(t), note: stage55(t).shot }; } });
const ledPx = (t: number, id: "T" | "D" | "L" | "K") => {
  const st = stage55(t);
  const q = pxOf(st.cam.pos, st.cam.look, st.cam.fov, ledWorld(id));
  const b = blockedBy(st.cam.pos, ledWorld(id), charsAt(t).chars.filter((c) => !st.pov || c.who !== "uq").map((c) => ({ root: c.root, height: c.height, who: c.who })));
  return `${id} (${q.x.toFixed(0)}; ${q.y.toFixed(0)})${inFrame(q) ? "" : " LUAR"}${b ? " TERHALANG " + b : ""}`;
};
if (mode === "groupA") {
  const s10 = SHOTS55.S10[0];
  console.log(`\n======== D-056 KELOMPOK A (rencana d055). S10 ${SHOTS55.S10.join(" / ")}, S11 ${SHOTS55.S11.join(" / ")}, S12 ${SHOTS55.S12.join(" / ")}`);
  report("mundur", epClip(s10, s10 + 2.8) as never, true);
  report("balik", epClip(s10 + 2.8, s10 + 3.5) as never, true);
  console.log(`  ^ S10: jendela mundur [0; 2,8] lalu putar ke lorong [2,8; 3,5]`);
  report("balik", epClip(SHOTS55.S11[0], SHOTS55.S12[1]) as never, true);
  console.log(`  ^ S11+S12 (tokoh diam menghadap lorong; kepala ke kamar di S12; POV, Uq tidak digambar)`);
  const w = measure(epClip(s10, s10 + 2.8) as never, true) as never as WR;
  console.log(`  S10 jarak antarkaki maks Uq ${(w.spreadU * 100).toFixed(1)} cm @ ${w.spreadUAt}, adik ${(w.spreadA * 100).toFixed(1)} cm @ ${w.spreadAAt}`);
  console.log(`\n  S11 fov akhir ${S11_FOV_END} (storyboard 26); LED per waktu (px bingkai 1080×1920):`);
  for (const t of [41.275, 41.575, 42.5, 43.5, 44.355, 45.0, 45.5, 46.0, 46.36, 46.93]) console.log(`    ${t.toFixed(3)} s fov ${s11Fov(t).toFixed(2)}: ${ledPx(t, "D")} | ${ledPx(t, "L")}`);
  console.log(`  S12 LED-4:`);
  for (const t of [46.96, 47.16, 48.0, 48.83, 49.7]) console.log(`    ${t.toFixed(3)} s fov ${stage55(t).cam.fov.toFixed(2)}: ${ledPx(t, "K")}`);
  console.log(`  S10 LED-1 (lensa P, di belakang lensa):`);
  for (const t of [37.8, 39.5, 41.25]) console.log(`    ${t.toFixed(2)} s: ${ledPx(t, "T")}`);
}
// ================================================================ D-057 tahap 2: groups B and C (numbers before render)
import { charsB, Q_FRONT, RAISE, REL_A, REL_U, S05_FOV } from "../src/ep004/episode004B";
import { CLIPS55, EV55, S15_AWAY, S15_GLANCE } from "../src/ep004/episode004Stage";
import { adikAt as pAdik, uqAt as pUq } from "../src/ep004/pilot004Stage";
const faces = (t: number) => {
  const st = stage55(t);
  return charsAt(t).chars.map((c) => { const q = pxOf(st.cam.pos, st.cam.look, st.cam.fov, stickHeadCenter(c.root, c.height)); return `${c.who} (${q.x.toFixed(0)}; ${q.y.toFixed(0)})`; }).join(" ");
};
const camLine = (t: number) => { const c = stage55(t).cam; return `pos (${c.pos.map((v) => v.toFixed(3)).join("; ")}) fov ${c.fov.toFixed(2)}`; };
type PR = Record<string, number & number[]>;
const cmpChars = (lab: string, a: MChar, b: MChar) => {
  const pa = a.pose as PR, pb = b.pose as PR;
  const arm = Math.max(...["armL", "armR"].flatMap((k) => [0, 1].map((i) => Math.abs((pa[k]?.[i] ?? 0) - (pb[k]?.[i] ?? 0)))), ...["armLFwd", "armRFwd"].map((k) => Math.abs((pa[k] ?? 0) - (pb[k] ?? 0))));
  console.log(`  ${lab} ${a.who}: akar Δ ${(Math.hypot(a.root[0] - b.root[0], a.root[2] - b.root[2]) * 100).toFixed(1)} cm, yaw Δ ${((Math.abs(a.yaw - b.yaw) * 180) / Math.PI).toFixed(1)}°, lengan Δmaks ${arm.toFixed(1)}°, kepala (${(pa.headYaw ?? 0).toFixed(0)}, ${(pa.headNod ?? 0).toFixed(0)}) → (${(pb.headYaw ?? 0).toFixed(0)}, ${(pb.headNod ?? 0).toFixed(0)})`);
};
if (mode === "groupB") {
  console.log(`\n======== D-057 KELOMPOK B (rencana d055). S03 ${SHOTS55.S03.join(" / ")}, S04 ${SHOTS55.S04.join(" / ")}, S05 ${SHOTS55.S05.join(" / ")}, S06 ${SHOTS55.S06.join(" / ")}, S07 ${SHOTS55.S07.join(" / ")}`);
  console.log(`  lepas tangan: Uq ${REL_U.join(" → ")} s (bahu → MID → REST), adik ${REL_A.join(" → ")} s; angkat ponsel ${RAISE.map((v) => v.toFixed(2)).join(" → ")} s, Q_FRONT [${Q_FRONT.map((v) => v.toFixed(1)).join(", ")}]`);
  // declared contact (as pilot S02): Uq's palm resting on her left shoulder at the S02 pose QU, until his hand reaches MID
  const uq0 = charsB(SHOTS55.S04[0]).chars[0];
  const palm = (() => { const p = uq0.pose as PR; const { H } = armChain({ armL: [p.armL[0], p.armL[1]], armLFwd: p.armLFwd } as never, "L", LAY); return W(uq0, H); })();
  const meetS04: V3 = [palm.x, palm.y, palm.z];
  const s04c = epClip(SHOTS55.S04[0], SHOTS55.S04[1]);
  report("genggam", { dur: s04c.dur, at: (x: number) => ({ ...s04c.at(x), meet: SHOTS55.S04[0] + x <= REL_U[1] ? meetS04 : undefined }) } as never, true);
  console.log(`  ^ S04 (lengan bergerak: Uq kanan = rig L, adik kiri = rig R; zona kontak = telapak Uq di bahu adik sampai ${REL_U[1]} s, seperti S02 pilot)`);
  // reference: the SAME paths forward in pilot S02 (2.1–3.7 s), exact maxima
  const stepMax = (fn: (t: number) => MChar[], t0: number, t1: number) => {
    let u = 0, a = 0;
    for (let f = 1; f <= Math.round((t1 - t0) * 30); f++) {
      const A = fn(t0 + (f - 1) / 30), B = fn(t0 + f / 30);
      for (const [i, k] of [[0, "armL"], [1, "armR"]] as const) {
        const pa = A[i].pose as PR, pb = B[i].pose as PR; const fk = `${k}Fwd`;
        const d = Math.max(Math.abs(pa[k][0] - pb[k][0]), Math.abs(pa[k][1] - pb[k][1]), Math.abs((pa[fk] ?? 0) - (pb[fk] ?? 0)));
        if (i === 0) u = Math.max(u, d); else a = Math.max(a, d);
      }
    }
    return [u, a];
  };
  const fwd = stepMax((t) => [pUq(t), pAdik(t)] as unknown as MChar[], 2.1, 3.7), rev = stepMax((t) => charsB(t).chars, 14.3, 16.1);
  console.log(`  lompatan sendi PERSIS (°/f): S02 pilot maju Uq ${fwd[0].toFixed(3)} adik ${fwd[1].toFixed(3)} | S04 balik Uq ${rev[0].toFixed(3)} adik ${rev[1].toFixed(3)} (batas pilot v3 = 11,1 / 7,1, dibulatkan dari jalur yang sama)`);
  report("genggam", epClip(SHOTS55.S05[0], SHOTS55.S08a[0] - 1 / 30) as never, true);
  console.log(`  ^ S05–S07 (lengan bergerak = lengan PONSEL Uq, rig R: torso-nya = "lengan diam: ponsel Uq"; lompatan sendi memuat kedua lengan)`);
  let mx = 0, at = 0;
  for (let f = 0; f <= 60; f++) {
    const t = RAISE[0] - 0.2 + f / 30;
    const p = charsB(t).chars[0].pose as PR;
    const d = c1ArmTorsoDepth([p.armR[0], p.armR[1], p.armRFwd] as never, "R");
    if (d > mx) { mx = d; at = t; }
  }
  console.log(`  lengan ponsel (rig R) di torso, maks selama angkat: ${(mx * 100).toFixed(2)} cm @ ${at.toFixed(2)} s (batas ≤ 0,2) ${flag(Math.round(mx * 1000) <= 2)}`);
  for (const t of [SHOTS55.S05[0], 19.5, RAISE[0], (RAISE[0] + RAISE[1]) / 2, RAISE[1], SHOTS55.S05[1] - 1 / 30]) {
    const st = stage55(t), ph = charsAt(t).phone;
    const q = new THREE.Quaternion(...ph.q);
    const top = new THREE.Vector3(0, 0.075, 0).applyQuaternion(q).add(new THREE.Vector3(...ph.p)), bot = new THREE.Vector3(0, -0.075, 0).applyQuaternion(q).add(new THREE.Vector3(...ph.p));
    const a = pxOf(st.cam.pos, st.cam.look, st.cam.fov, [top.x, top.y, top.z]), b = pxOf(st.cam.pos, st.cam.look, st.cam.fov, [bot.x, bot.y, bot.z]);
    console.log(`  S05 ${t.toFixed(2)} s fov ${st.cam.fov.toFixed(1)}: ponsel ${(Math.hypot(a.x - b.x, a.y - b.y) / 19.2).toFixed(0)} % tinggi bingkai, tengah (${((a.x + b.x) / 2).toFixed(0)}; ${((a.y + b.y) / 2).toFixed(0)}) | ${faces(t)}`);
  }
  console.log(`  S05 fov (aturan sisipan 45 %, min 20) = ${S05_FOV.toFixed(2)}`);
  for (const t of [SHOTS55.S03[0], SHOTS55.S03[1] - 1 / 30]) console.log(`  S03 ${t.toFixed(2)} s ${camLine(t)}`);
  for (const t of [SHOTS55.S04[0], 13.3, 15.0, 16.5, SHOTS55.S04[1] - 1 / 30]) console.log(`  S04 ${t.toFixed(2)} s ${camLine(t)} wajah ${faces(t)} (storyboard Uq (681; 538), adik (420; 943))`);
  for (const t of [SHOTS55.S07[0], 27.8, 29.5, SHOTS55.S07[1] - 1 / 30]) console.log(`  S07 ${t.toFixed(2)} s ${camLine(t)} wajah ${faces(t)} (storyboard Uq (704; 475), adik (400; 948))`);
  const s02 = [pUq(9.2 - 1 / 30), pAdik(9.2 - 1 / 30)] as unknown as MChar[], s04 = charsB(SHOTS55.S04[0]).chars;
  cmpChars("S02 akhir → S04 awal (potongan lewat S03)", s02[0], s04[0]); cmpChars("S02 akhir → S04 awal (potongan lewat S03)", s02[1], s04[1]);
  const s07 = charsB(SHOTS55.S08a[0] - 1 / 30).chars, s08 = [pUq(28.9), pAdik(28.9)] as unknown as MChar[];
  cmpChars("S07 akhir → S08 pilot awal (potongan lewat S08a 1,5 s)", s07[0], s08[0]); cmpChars("S07 akhir → S08 pilot awal (potongan lewat S08a 1,5 s)", s07[1], s08[1]);
  console.log(`  LED: tidak ada yang menyala sebelum ${EV55.LED1_click} s → halo tidak relevan di kelompok B`);
}
if (mode === "groupC") {
  console.log(`\n======== D-057 KELOMPOK C (rencana d055). S13 ${SHOTS55.S13.join(" / ")}, S14 ${SHOTS55.S14.join(" / ")}, I15 ${SHOTS55.I15.join(" / ")}, S15 ${SHOTS55.S15.join(" / ")}`);
  report("balik", epClip(SHOTS55.S13[0], SHOTS55.S14[1]) as never, true);
  console.log(`  ^ S13+S14 (putar balik 52,72–53,82 s)`);
  const c15 = epClip(SHOTS55.I15[0], SHOTS55.S15[1]);
  report("genggam", { dur: c15.dur, at: (x: number) => ({ ...c15.at(x), meet: CLIPS55.insert.at(Math.min(x, 2.0)).meet }) } as never, true);
  console.log(`  ^ I15+S15 utuh (zona genggam dideklarasikan = titik temu D-055); lirik ponsel ${S15_GLANCE.map((v) => v.toFixed(2)).join("–")} s, kembali ke adik ${S15_AWAY.map((v) => v.toFixed(2)).join("–")} s`);
  for (const t of [SHOTS55.I15[0], SHOTS55.S15[0]]) {
    const a = charsAt(t - 1 / 30).chars, b = charsAt(t).chars;
    a.forEach((c, i) => cmpChars(`sambungan ${t.toFixed(2)} s`, c, b[i]));
  }
  let vmax = 0, vAt = 0, stopAt = 0;
  for (let f = 1; f < Math.round(SHOTS55.S15[2] * 30); f++) {
    const t = SHOTS55.S15[0] + f / 30, a = stage55(t - 1 / 30).cam.pos, b = stage55(t).cam.pos;
    const v = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 30;
    if (v > vmax) { vmax = v; vAt = t; }
    if (v > 1e-5) stopAt = t;
  }
  const c0 = stage55(SHOTS55.S15[0]).cam, cE = stage55(SHOTS55.S15[1] - 1 / 30).cam;
  console.log(`  S15 kamera: fov awal ${c0.fov.toFixed(2)} (pemilik 49,0) | pos awal (${c0.pos.map((v) => v.toFixed(3)).join("; ")}) | dorong maks ${(vmax * 100).toFixed(2)} cm/s @ ${vAt.toFixed(2)} (pemilik 4,79) | gerak terakhir ${stopAt.toFixed(2)} s, diam ${(SHOTS55.S15[1] - stopAt).toFixed(2)} s (pemilik 0,8) | akhir fov ${cE.fov.toFixed(2)} pos (${cE.pos.map((v) => v.toFixed(3)).join("; ")})`);
  console.log(`  I15 kamera: ${camLine(SHOTS55.I15[0])} (tetap)`);
  for (const t of [SHOTS55.S13[0], 52.0, 53.3, SHOTS55.S13[1] - 1 / 30]) console.log(`  S13 ${t.toFixed(2)} s ${camLine(t)} wajah ${faces(t)} (storyboard Uq (679; 772), adik (416; 1026))`);
  for (const t of [SHOTS55.S15[0], 62.7, 64.9, 65.75, 67.0, SHOTS55.S15[1] - 1 / 30]) console.log(`  S15 ${t.toFixed(2)} s fov ${stage55(t).cam.fov.toFixed(2)} wajah ${faces(t)} (kartu y 170–364: wajah ≥ 700 saat kartu)`);
  console.log(`  LED (proyeksi + gerbang oklusi dinding/tokoh; halo hanya bila tidak TERHALANG dan di bingkai):`);
  for (const t of [SHOTS55.S13[0], 51.0, 52.72, 53.3, 53.82, SHOTS55.S14[0], SHOTS55.I15[0], 60.2, SHOTS55.S15[0], 64.9, 67.0, SHOTS55.S15[1] - 1 / 30])
    console.log(`    ${t.toFixed(2)} s [${stage55(t).shot}] ${(["T", "D", "L", "K"] as const).map((k) => ledPx(t, k)).join(" | ")}`);
}
