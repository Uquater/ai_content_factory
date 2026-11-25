// Episode 2026-11-003 draft (D-043 pending): numeric checks over EVERY frame of the episode, from the same stage the
// composition renders (episode003Stage.ts). Per shot: body clearance to the set (STUDIO-WORKFLOW §10.6 pattern, boxes as
// p003_check + the living room), Uq–adik distance, joint-angle jumps (°/frame), arm inside the torso, root step per
// frame (pops), feet: slip while planted and slides without lift (P4), the phone in Uq's LEFT hand, the grip pair (Uq
// right ↔ adik left), screen positions of heads (180° / who is left of whom) and of the phone. Cuts are excluded from
// per-frame jumps. Also prints every footfall (for the mix) as JSON with --json.
// Run from studio/: npx esbuild tools/e003_check.ts --bundle --platform=node --log-level=warning --outfile=out/e003_check.cjs && node out/e003_check.cjs [--json]
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop, teeSurface } from "../src/c1/C1";
import { C1_BUILD, C1_HEIGHT } from "../src/c1/c1rig";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import type { V3 } from "../src/inkbeat/types";
import { episodeAt, FPS, FRAMES, KNOCKS, LINES, OFF, P, SHOTS } from "../src/ep003/episode003Stage";
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
  { name: "sofa", min: [-3.3, 0, -0.94], max: [-1.5, 0.85, -0.2] },
  { name: "dinding depan ruang tamu", min: [-4.0, 0, 2.94], max: [1.0, H, 3.06] },
  { name: "dinding timur ruang tamu", min: [0.94, 0, -1.0], max: [1.06, H, 3.0] },
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
const samples = (c: CharS, contact: boolean): S[] => {
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
    for (let i = 1; i <= 8; i++) out.push({ p: toWorld(c, E.clone().lerp(hd, i / 8)), r: 0.03, part: contact && side === "L" && i >= 6 ? `kontak lengan bawah ${nm}` : `lengan bawah ${nm}` });
    if (!(contact && side === "L") && !(c.who === "adik" && side === "L")) out.push({ p: toWorld(c, hd), r: 0.05, part: `tangan ${nm}` });
  }
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
const clearance = (c: CharS, contact: boolean) => {
  let best = { d: Infinity, part: "", box: "" };
  for (const s of samples(c, contact)) for (const b of BOXES) {
    if (s.part.startsWith("kontak") && b.name === "gerendel") continue;
    const d = boxDist(s.p, b) - s.r;
    if (d < best.d) best = { d, part: s.part, box: b.name };
  }
  return best;
};
/** closest distance between two characters' sample sets (bodies, arms, jacket, heads); the gripping hands excluded */
const between = (a: CharS, b: CharS, gripping: boolean) => {
  const sa = samples(a, false).filter((s) => !(gripping && (s.part.includes("bawah kanan") || s.part === "tangan kanan")));
  const sb = samples(b, false).filter((s) => !(gripping && (s.part.includes("bawah kiri") || s.part === "tangan kiri")));
  let best = { d: Infinity, what: "" };
  for (const p of sa) for (const q of sb) {
    const d = p.p.distanceTo(q.p) - p.r - q.r;
    if (d < best.d) best = { d, what: `${p.part} ↔ ${q.part}` };
  }
  return best;
};
const palmW = (c: CharS, side: "L" | "R") => armChain(c.pose, side, LAY).H.multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
const ankleW = (c: CharS, f: "L" | "R") => {
  const lp = c.legPose?.[f];
  const a = lp ? lp.ankle : ([f === "L" ? -0.05 : 0.05, 0.012, 0.004] as V3);
  return toWorld(c, new THREE.Vector3(...a));
};

const cutF = new Set(SHOTS.map((s) => Math.round(s.start * FPS)));
type Row = { f: number; t: number; shot: string; cu: number; cuW: string; ca: number; caW: string; pair: number; pairW: string; torso: number; jump: number; jumpW: string; root: number; rootW: string; phone: number; grip: number; heads: string };
const rows: Row[] = [];
let prev: { c: CharS[]; f: number } | null = null;
const feet: Record<string, { t: number; p: THREE.Vector3; y: number; f: number }[]> = { uqL: [], uqR: [], adL: [], adR: [] };
const angOf = (c: CharS) => [c.pose.armL?.[0] ?? 0, c.pose.armL?.[1] ?? 0, c.pose.armLFwd ?? 0, c.pose.armR?.[0] ?? 0, c.pose.armR?.[1] ?? 0, c.pose.armRFwd ?? 0, c.pose.headYaw ?? 0, c.pose.headNod ?? 0, (c.yaw * 180) / Math.PI];
const ANG = ["bahu kanan a", "siku kanan", "bahu kanan maju", "bahu kiri a", "siku kiri", "bahu kiri maju", "kepala yaw", "kepala angguk", "badan yaw"];
for (let f = 0; f < FRAMES; f++) {
  const t = f / FPS;
  const st = episodeAt(t);
  const uq = st.chars.find((c) => c.who === "uq");
  const ad = st.chars.find((c) => c.who === "adik");
  const knob = st.eshot === "s04" || (st.eshot === "s03" && t > OFF + 9.3);
  const cu = uq ? clearance(uq, knob) : { d: NaN, part: "", box: "" };
  const ca = ad ? clearance(ad, false) : { d: NaN, part: "", box: "" };
  const gripping = ["s00", "s01", "s11", "s12"].includes(st.eshot);
  const pr = uq && ad ? between(uq, ad, gripping) : { d: NaN, what: "" };
  let jump = 0, jumpW = "", root = 0, rootW = "";
  if (prev && prev.f === f - 1 && !cutF.has(f)) {
    for (const c of st.chars) {
      const p = prev.c.find((x) => x.who === c.who);
      if (!p) continue;
      const a = angOf(c), b = angOf(p);
      a.forEach((v, i) => {
        let d = Math.abs(v - b[i]);
        if (i === 8) d = Math.abs(((v - b[i] + 540) % 360) - 180);
        if (d > jump) { jump = d; jumpW = `${c.who} ${ANG[i]}`; }
      });
      const r = Math.hypot(c.root[0] - p.root[0], c.root[2] - p.root[2]);
      if (r > root) { root = r; rootW = c.who; }
    }
  }
  prev = { c: st.chars, f };
  const torso = uq ? Math.max(c1ArmTorsoDepth([uq.pose.armL?.[0] ?? 0, uq.pose.armL?.[1] ?? 0, uq.pose.armLFwd ?? 0], "L"), c1ArmTorsoDepth([uq.pose.armR?.[0] ?? 0, uq.pose.armR?.[1] ?? 0, uq.pose.armRFwd ?? 0], "R")) : NaN;
  // the phone: distance from its centre to Uq's LEFT palm (code side "R"), when it is shown
  const phoneShown = uq && st.phone.p[1] > -1 && st.shot !== "s06" && st.eshot !== "s10";
  const phone = phoneShown ? palmW(uq!, "R").distanceTo(new THREE.Vector3(...st.phone.p)) : NaN;
  const grip = uq && ad && gripping ? palmW(uq, "L").distanceTo(palmW(ad, "R")) : NaN;
  // heads on screen (x px): who is left of whom
  const camO = new THREE.PerspectiveCamera(st.cam.fov, 1080 / 1920, 0.05, 100);
  camO.position.set(...st.cam.pos); camO.lookAt(new THREE.Vector3(...st.cam.look)); camO.updateMatrixWorld();
  const scr = (c: CharS) => { const v = new THREE.Vector3(...stickHeadCenter(c.root, c.height)).project(camO); return v.z < 1 ? `${c.who} (${Math.round((v.x + 1) * 540)}, ${Math.round((1 - v.y) * 960)})` : `${c.who} (di belakang lensa)`; };
  rows.push({ f, t, shot: st.eshot, cu: cu.d, cuW: `${cu.part} ↔ ${cu.box}`, ca: ca.d, caW: `${ca.part} ↔ ${ca.box}`, pair: pr.d, pairW: pr.what, torso, jump, jumpW, root, rootW, phone, grip, heads: st.chars.map(scr).join(" · ") });
  if (!cutF.has(f) || true) {
    if (uq) for (const s of ["L", "R"] as const) { const p = ankleW(uq, s); feet[`uq${s}`].push({ t, p, y: p.y, f }); }
    if (ad) for (const s of ["L", "R"] as const) { const p = ankleW(ad, s); feet[`ad${s}`].push({ t, p, y: p.y, f }); }
  }
}
// feet: slip while planted (no lift, <= 2 mm above its floor height) and slides (moving along the floor), per shot,
// ignoring the frame across a cut (ellipses)
const steps: { t: number; who: string; foot: string; shot: string }[] = [];
const footRep: Record<string, { slip: number; slide: number; slideAt: number }> = {};
for (const [k, arr] of Object.entries(feet)) {
  let slideMax = 0, slideAt = 0, slipMax = 0, wasUp = false;
  for (let i = 1; i < arr.length; i++) {
    const a = arr[i - 1], b = arr[i];
    if (b.f !== a.f + 1 || cutF.has(b.f)) { wasUp = false; continue; }
    const floorY = 0.012 * (k.startsWith("uq") ? C1_HEIGHT : 1.27);
    const up = b.y > floorY + 0.002;
    const mv = Math.hypot(b.p.x - a.p.x, b.p.z - a.p.z);
    if (!up && !(a.y > floorY + 0.002) && mv > 0.001) { if (mv > slideMax) { slideMax = mv; slideAt = b.t; } } // both frames on the floor
    if (!up && !(a.y > floorY + 0.002)) slipMax = Math.max(slipMax, mv);
    if (wasUp && !up) steps.push({ t: +b.t.toFixed(3), who: k.slice(0, 2) === "uq" ? "uq" : "adik", foot: k.slice(-1), shot: rows[b.f].shot });
    wasUp = up;
  }
  footRep[k] = { slip: slipMax, slide: slideMax, slideAt };
}
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ steps: steps.sort((a, b) => a.t - b.t), knocks: KNOCKS, shots: SHOTS, lines: LINES, off: OFF, torchOn: OFF + P.BEAT.torchOn, frames: FRAMES }));
  process.exit(0);
}
const cm = (x: number) => (Number.isNaN(x) ? "-" : (x * 100).toFixed(1));
console.log(`episode 2026-11-003 draft · ${FRAMES} frames (${(FRAMES / FPS).toFixed(2)} s) · pilot block at ${OFF.toFixed(3)} s (frame ${Math.round(OFF * FPS)})`);
for (const s of SHOTS) {
  const r = rows.filter((x) => x.shot === s.id && x.t >= s.start - 1e-9 && x.t < s.end - 1e-9);
  if (!r.length) continue;
  const mn = (k: keyof Row) => r.filter((x) => !Number.isNaN(x[k] as number)).reduce((a, b) => ((b[k] as number) < (a[k] as number) ? b : a), r.find((x) => !Number.isNaN(x[k] as number)) ?? r[0]);
  const mx = (k: keyof Row) => r.reduce((a, b) => ((b[k] as number) > (a[k] as number) ? b : a));
  const u = mn("cu"), a = mn("ca"), p = mn("pair"), j = mx("jump"), ro = mx("root");
  const ph = r.filter((x) => !Number.isNaN(x.phone)), gr = r.filter((x) => !Number.isNaN(x.grip));
  console.log(`${s.id} ${s.start.toFixed(2)}–${s.end.toFixed(2)} (${(s.end - s.start).toFixed(2)} s): Uq↔set ${cm(u.cu)} cm (${u.cuW}) · adik↔set ${cm(a.ca)} cm (${a.caW}) · Uq↔adik ${cm(p.pair)} cm (${p.pairW}) · lompatan ${j.jump.toFixed(1)}°/f (${j.jumpW} @f${j.f}) · akar ${cm(ro.root)} cm/f (${ro.rootW}) · lengan-torso maks ${cm(Math.max(...r.map((x) => x.torso).filter((x) => !Number.isNaN(x))))} cm · ponsel↔telapak kiri ${ph.length ? cm(Math.max(...ph.map((x) => x.phone))) + " cm maks" : "-"} · genggam ${gr.length ? cm(Math.min(...gr.map((x) => x.grip))) + "–" + cm(Math.max(...gr.map((x) => x.grip))) + " cm" : "-"}`);
  console.log(`      kepala di layar (tengah shot): ${r[Math.floor(r.length / 2)].heads}`);
}
console.log("kaki (slip saat menapak / geser tanpa angkat, cm):", Object.entries(footRep).map(([k, v]) => `${k} ${cm(v.slip)} / ${cm(v.slide)}${v.slide > 0.005 ? ` @${v.slideAt.toFixed(2)}s` : ""}`).join(" · "));
const bigJ = rows.filter((x) => x.jump > 15);
console.log(`lompatan > 15°/frame: ${bigJ.length ? bigJ.slice(0, 20).map((x) => `f${x.f} ${x.jump.toFixed(0)}° ${x.jumpW}`).join(", ") : "tidak ada"}`);
const bigR = rows.filter((x) => x.root > 0.05);
console.log(`akar > 5 cm/frame: ${bigR.length ? bigR.slice(0, 20).map((x) => `f${x.f} ${cm(x.root)} ${x.rootW}`).join(", ") : "tidak ada"}`);
const clip = rows.filter((x) => x.cu < 0 || x.ca < 0 || x.pair < 0);
console.log(`frame tembus: ${clip.length} ${clip.slice(0, 25).map((x) => `f${x.f}(${x.shot}) ${cm(Math.min(x.cu, Number.isNaN(x.ca) ? 9 : x.ca, Number.isNaN(x.pair) ? 9 : x.pair))} ${x.cu < 0 ? x.cuW : x.ca < 0 ? x.caW : x.pairW}`).join(", ")}`);
if (process.argv.includes("--list")) for (const x of rows.filter((r) => r.ca < 0 || r.cu < -0.008 || (!Number.isNaN(r.grip) && r.shot === "s11"))) console.log(`  f${x.f} ${x.t.toFixed(2)} ${x.shot} uq ${cm(x.cu)} ${x.cuW} | adik ${cm(x.ca)} ${x.caW} | grip ${cm(x.grip)}`);
console.log(`tapak kaki: ${steps.length} (${steps.map((s) => `${s.t.toFixed(2)} ${s.who}${s.foot}`).join(", ")})`);
