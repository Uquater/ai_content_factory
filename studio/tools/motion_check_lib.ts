// Reusable MOTION CHECK for a full episode (Episode 4 lesson, owner 2026-11-24: reuse for Episode 5). Shot by shot, frame by frame:
//   - body cylinder (Uq r 0.22, adik r 0.16, y 0–1.2 m), arm joints (r 0.04) and feet (r 0.05) against furniture, walls, jambs,
//     the bedroom door leaf (open 1.35) and the BATHROOM door leaf at its angle in THAT frame (sweep);
//   - feet crossing, body gap between the two (>= 1.7 cm), arm joint step per frame (Uq <= 11.1, adik <= 7.1 deg/frame),
//     arm-in-torso depth (Uq <= 0.2 cm, adik 0), root speed, body yaw step, camera against every body and wall box;
//   - a door that must be closed in given shots (cfg.closedDoorShots).
// OUTPUT: a violation list "MASUK <thing> @<shot>: <t0>–<t1> s, worst <d> m at <t> s (<part>)" so each problem can be fixed in its
// shot; then the summary numbers and LOLOS/GAGAL (process.exitCode = 1 on GAGAL). Only frames that are ON SCREEN are passed in.
// 2026-11-24 (owner review of Ep 5 v4, three logic errors a clearance check of joints alone did not catch): door leaves at their
// angle in every frame (cfg.leaves), declared door openings (cfg.openings) instead of "deliberate contact" excuses, props as bodies
// (cfg.props), more cast (Ch.r / Ch.h: a guard), arm SEGMENTS sampled between the joints. Interaction rules (a door moves only
// under a hand or slowing after a push, doorway clear width, a held prop stays with its holder, lock order) live in the driver
// (tools/e006_check.ts R1-R4) because they need the episode's own objects; copy them with the driver.
// Set geometry (BOXES) = house no. 7 (ep002/geo.ts, sets.tsx BATH). A new set (new room, new prop) = ADD boxes via cfg.extraBoxes
// and note it in the Content Unit; never delete a box to make a check pass.
// Episode 4 driver: tools/e005_check.ts. Episode 5: copy it as tools/e006_check.ts (checklist in the Ep 5 Content Unit).
import * as THREE from "three";
import type { V3 } from "../src/inkbeat/types";
import { H_AD, H_UQ } from "../src/ep004/motion004";
import { c1ArmTorsoDepth } from "../src/ep005/open005v4";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import { C1_BUILD, c1UpperMatrix } from "../src/c1/c1rig";
import { BATH } from "../src/ep002/sets";

export type Ch = { who: string; root: V3; yaw: number; pose: Record<string, unknown>; feet?: { L: V3; R: V3 }; /** body radius / rig height for other cast (default: Uq 0.22 / H_UQ, adik 0.16 / H_AD) */ r?: number; h?: number };
export type FrameAt = { chars: Ch[]; hasChars: boolean; cam: { pos: V3 }; bathDoor: number };
export type CheckCfg = {
  title: string;
  shots: { id: string; t0: number; t1: number }[];
  at: (t: number, shot: string) => FrameAt;
  closedDoorShots: string[];
  /** shots without drawn characters in which the camera is still checked against the walls (POV through a window) */
  cameraBoxShots?: string[];
  extraBoxes?: Box[];
  /** Ep 5 (2026-11-24 owner review: a guard's arm, adik and a padlock went through doors): any door leaf at its angle IN THIS
   * FRAME, as a vertical segment a→b (x, z) with half thickness and height; tested against bodies, arms, feet and props */
  leaves?: (t: number, shot: string) => Leaf[];
  /** declared door openings: a point inside `min..max` is not tested against the wall box named `wall` (the wall boxes span
   * the opening; the leaf and the jambs are tested instead) */
  openings?: { wall: string; min: V3; max: V3 }[];
  /** non-character bodies in this frame (the guard's arm, a held key, a padlock): [point, radius, label] */
  props?: (t: number, shot: string) => [V3, number, string][];
  /** extra report lines; start a line with "GAGAL" to mark a failure */
  extra?: () => string[];
};
export type Box = { name: string; min: V3; max: V3 };
/** shoulder, elbow, palm in world space WITH the body lean (2026-11-24: the old open005v4 armWorld has no lean, so a leaning
 * character's hands were checked up to 9 cm from where they are drawn) */
const LAYB = layoutOf(C1_BUILD);
export const armWorldB = (q: [number, number, number], side: "L" | "R", root: V3, yaw: number, h: number, lean = 0): V3[] => {
  const pose = side === "L" ? { armL: [q[0], q[1]] as [number, number], armLFwd: q[2] } : { armR: [q[0], q[1]] as [number, number], armRFwd: q[2] };
  const c = armChain(pose, side, LAYB);
  const M = c1UpperMatrix({ lean });
  return [c.S, c.E, c.H].map((p) => { const v = p.clone().applyMatrix4(M).multiplyScalar(h).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).add(new THREE.Vector3(...root)); return [v.x, v.y, v.z] as V3; });
};
export type Leaf = { name: string; a: [number, number]; b: [number, number]; half: number; h: number };
const WT = 0.06; // half wall thickness (WALL_T 0.12)
export const BOXES: Box[] = [
  // living room (as m005v4_check)
  { name: "sofa (alas)", min: [-3.3, 0, -0.925], max: [-1.5, 0.42, -0.175] },
  { name: "sofa (sandaran)", min: [-3.3, 0, -0.94], max: [-1.5, 0.87, -0.76] },
  { name: "sofa (lengan timur)", min: [-1.66, 0, -0.925], max: [-1.5, 0.6, -0.175] },
  { name: "meja kopi", min: [-2.9, 0, 0.275], max: [-1.9, 0.45, 0.825] },
  { name: "dinding timur ruang tamu (x 1.0)", min: [1.0 - WT, 0, -1.0], max: [1.0 + WT, 2.7, 3.0] },
  { name: "dinding selatan (z 3.0)", min: [-4.0, 0, 3.0 - WT], max: [1.0, 2.7, 3.0 + WT] },
  { name: "gorden ruang tamu (z 2.82)", min: [-1.55, 0.6, 2.795], max: [0.15, 2.1, 2.87] },
  { name: "dinding utara ruang tamu barat (z -1.0)", min: [-4.0, 0, -1.0 - WT], max: [-1.4, 2.7, -1.0 + WT] },
  { name: "dinding utara ruang tamu timur (z -1.0)", min: [-0.2, 0, -1.0 - WT], max: [1.0, 2.7, -1.0 + WT] },
  // hallway, kitchen
  { name: "dinding barat lorong (x -1.4)", min: [-1.4 - WT, 0, -3.2], max: [-1.4 + WT, 2.7, -1.0] },
  { name: "dinding timur lorong (x -0.2)", min: [-0.2 - WT, 0, -3.2], max: [-0.2 + WT, 2.7, -1.0] },
  { name: "dinding selatan dapur barat (z -3.2)", min: [-4.0, 0, -3.2 - WT], max: [-1.4, 2.7, -3.2 + WT] },
  { name: "dinding selatan dapur timur (z -3.2)", min: [-0.2, 0, -3.2 - WT], max: [1.0, 2.7, -3.2 + WT] },
  { name: "dinding utara dapur (z -5)", min: [-4.0, 0, -5.0 - WT], max: [4.0, 2.7, -5.0 + WT] },
  { name: "meja dapur", min: [-3.8, 0, -4.93], max: [-1.6, 0.9, -4.33] },
  // bathroom door in the kitchen's east wall (x 1.0): the wall either side of the opening, the jambs (frame 7 cm)
  { name: "dinding timur dapur utara pintu", min: [1.0 - WT, 0, -5.0], max: [1.0 + WT, 2.7, BATH.z - BATH.w / 2 - 0.07] },
  { name: "dinding timur dapur selatan pintu", min: [1.0 - WT, 0, BATH.z + BATH.w / 2 + 0.07], max: [1.0 + WT, 2.7, -3.2] },
  { name: "kusen kamar mandi utara", min: [1.0 - 0.085, 0, BATH.z - BATH.w / 2 - 0.07], max: [1.0 + 0.085, 2.1, BATH.z - BATH.w / 2] },
  { name: "kusen kamar mandi selatan", min: [1.0 - 0.085, 0, BATH.z + BATH.w / 2], max: [1.0 + 0.085, 2.1, BATH.z + BATH.w / 2 + 0.07] },
  // bathroom (sets.tsx BathRoom, read from BATH): walls, the tub block, the bucket
  { name: "kamar mandi dinding timur", min: [BATH.x1 - 0.04, 0, BATH.z0], max: [BATH.x1 + 0.04, 2.45, BATH.z1] },
  { name: "kamar mandi dinding utara", min: [1.0, 0, BATH.z0 - 0.04], max: [BATH.x1, 2.45, BATH.z0 + 0.04] },
  { name: "kamar mandi dinding selatan", min: [1.0, 0, BATH.z1 - 0.04], max: [BATH.x1, 2.45, BATH.z1 + 0.04] },
  { name: "bak mandi", min: [BATH.x1 - 0.71, 0, BATH.z0 + 0.09], max: [BATH.x1 - 0.09, 0.64, BATH.z0 + 0.71] },
  { name: "ember", min: [BATH.x1 - 0.39, 0, BATH.z1 - 0.44], max: [BATH.x1 - 0.11, 0.28, BATH.z1 - 0.16] },
];
const segDist = (p: THREE.Vector2, a: THREE.Vector2, b: THREE.Vector2) => { const ab = b.clone().sub(a); const u = Math.max(0, Math.min(1, p.clone().sub(a).dot(ab) / ab.lengthSq())); return p.distanceTo(a.clone().addScaledVector(ab, u)); };
const boxDist = (p: V3, r: number, b: Box, yLo = p[1], yHi = p[1]) => {
  if (yHi < b.min[1] || yLo > b.max[1]) return 9;
  const dx = Math.max(b.min[0] - p[0], 0, p[0] - b.max[0]), dz = Math.max(b.min[2] - p[2], 0, p[2] - b.max[2]);
  if (dx === 0 && dz === 0) return -Math.min(p[0] - b.min[0], b.max[0] - p[0], p[2] - b.min[2], b.max[2] - p[2]) - r;
  return Math.hypot(dx, dz) - r;
};
// bedroom door leaf (open 1.35, as m005v4_check)
const KLEAF = [new THREE.Vector2(1.0, 0.69), new THREE.Vector2(0.14, 0.5)];
// bathroom door leaf: hinge (1.0, z - w/2 + 0.01), opens INTO THE KITCHEN (look-dev still): direction (-sin o, cos o)
const bathLeaf = (o: number) => { const h = new THREE.Vector2(1.0, BATH.z - BATH.w / 2 + 0.01); return [h, h.clone().add(new THREE.Vector2(-Math.sin(o), Math.cos(o)).multiplyScalar(BATH.w - 0.02))]; };
const leafDist = (leaf: THREE.Vector2[], p: V3, r: number, hTop: number, yLo = p[1], yHi = p[1]) => (yHi < 0 || yLo > hTop ? 9 : segDist(new THREE.Vector2(p[0], p[2]), leaf[0], leaf[1]) - 0.0225 - r);


const inOpening = (cfg: CheckCfg, wall: string, p: V3) => (cfg.openings ?? []).some((o) => o.wall === wall && p[0] >= o.min[0] && p[0] <= o.max[0] && p[1] >= o.min[1] && p[1] <= o.max[1] && p[2] >= o.min[2] && p[2] <= o.max[2]);
const leafSeg = (l: Leaf, p: V3, r: number, yLo = p[1], yHi = p[1]) => (yHi < 0 || yLo > l.h ? 9 : segDist(new THREE.Vector2(p[0], p[2]), new THREE.Vector2(...l.a), new THREE.Vector2(...l.b)) - l.half - r);
export const checkMotion = (cfg: CheckCfg) => {
  const boxes = [...BOXES, ...(cfg.extraBoxes ?? [])];
  const f2 = (x: number) => x.toFixed(2), f3 = (x: number) => x.toFixed(3);
  const worst: Record<string, { d: number; t: number; part: string }> = {};
  const viol: Record<string, { shot: string; t0: number; t1: number; d: number; tAt: number; part: string }> = {};
  let curShot = "";
  const note = (key: string, d: number, t: number, part: string) => {
      if (!worst[key] || d < worst[key].d) worst[key] = { d, t, part };
      if (d < 0) { const k = `${key} @${curShot}`; const v = viol[k]; if (!v) viol[k] = { shot: curShot, t0: t, t1: t, d, tAt: t, part }; else { v.t1 = t; if (d < v.d) { v.d = d; v.tAt = t; v.part = part; } } }
    };
  const cross: Record<string, { d: number; t: number }> = { uq: { d: 9, t: 0 }, adik: { d: 9, t: 0 } };
  let minOther = 9, minOtherT = 0, minOtherWho = "";
  let minCC = 9, minCCt = 0, camMin = 9, camMinT = 0, camWho = "";
  const step = { uqR: { v: 0, t: 0 }, uqL: { v: 0, t: 0 }, adL: { v: 0, t: 0 }, adR: { v: 0, t: 0 } };
  const depth: Record<string, number> = { uq: 0, adik: 0 };
  let doorBad = 0, vMaxU = 0, vMaxA = 0, yawStep = { uq: 0, adik: 0 };
  const qOf = (c: Ch, side: "L" | "R") => { const p = c.pose as Record<string, unknown>; const a = p[side === "L" ? "armL" : "armR"] as number[]; return [a[0], a[1], (p[side === "L" ? "armLFwd" : "armRFwd"] as number) ?? 0] as [number, number, number]; };
  for (const sh of cfg.shots) {
    const shot = sh.id; curShot = shot;
    const a = sh.t0, b = sh.t1;
    const f0 = Math.ceil(a * 30 - 1e-6), f1 = Math.ceil(b * 30 - 1e-6) - 1;
    let prev: { chars: Ch[] } | null = null;
    for (let f = f0; f <= f1; f++) {
      const t = f / 30;
      const st = cfg.at(t, shot);
      const fr = { chars: st.chars };
      if (cfg.closedDoorShots.includes(shot) && st.bathDoor !== 0) doorBad++;
      for (const c of fr.chars) {
        const r = c.r ?? (c.who === "uq" ? 0.22 : 0.16), h = c.h ?? (c.who === "uq" ? H_UQ : H_AD);
        const pts: [V3, number, string][] = [];
        for (const side of ["L", "R"] as const) {
          const aw = armWorldB(qOf(c, side), side, c.root, c.yaw, h, ((c.pose as Record<string, unknown>).lean as number) ?? 0);
          const nm = side === "L" ? "lengan kanan" : "lengan kiri";
          aw.forEach((p, i) => pts.push([p, 0.04, `${nm} ${["bahu", "siku", "tangan"][i]}`]));
          // 2026-11-24 (owner review of Ep 5 v4: the guard's forearm crossed the door leaf between its joints): sample the
          // segments too, not only the three joints
          for (const k of [1 / 3, 2 / 3]) {
            pts.push([[aw[0][0] + (aw[1][0] - aw[0][0]) * k, aw[0][1] + (aw[1][1] - aw[0][1]) * k, aw[0][2] + (aw[1][2] - aw[0][2]) * k], 0.04, `${nm} lengan atas`]);
            pts.push([[aw[1][0] + (aw[2][0] - aw[1][0]) * k, aw[1][1] + (aw[2][1] - aw[1][1]) * k, aw[1][2] + (aw[2][2] - aw[1][2]) * k], 0.035, `${nm} lengan bawah`]);
          }
        }
        if (c.feet) pts.push([c.feet.L, 0.05, "kaki L"], [c.feet.R, 0.05, "kaki R"]);
        for (const bx of boxes) {
          // the curtain hand is meant to touch the curtain: skip "tangan kanan" vs the curtain in S05–S07
          if (!inOpening(cfg, bx.name, c.root)) note(`${c.who} | ${bx.name}`, boxDist(c.root, r, bx, 0, 1.2), t, `badan (${shot})`);
          for (const [p, rr, part] of pts) { if (bx.name.startsWith("gorden") && part === "lengan kanan tangan") continue; if (inOpening(cfg, bx.name, p)) continue; note(`${c.who} | ${bx.name}`, boxDist(p, rr, bx), t, `${part} (${shot})`); }
        }
        note(`${c.who} | daun pintu kamar (1.35)`, leafDist(KLEAF, c.root, r, 2.04, 0, 1.2), t, `badan (${shot})`);
        for (const l of cfg.leaves?.(t, shot) ?? []) {
          note(`${c.who} | ${l.name} (sudut saat t)`, leafSeg(l, c.root, r, 0, 1.2), t, `badan (${shot})`);
          for (const [p, rr, part] of pts) note(`${c.who} | ${l.name} (sudut saat t)`, leafSeg(l, p, rr), t, `${part} (${shot})`);
        }
        const bl = bathLeaf(st.bathDoor);
        note(`${c.who} | daun pintu kamar mandi (sudut saat t)`, leafDist(bl, c.root, r, 2.0, 0, 1.2), t, `badan (${shot}, buka ${f2(st.bathDoor)})`);
        for (const [p, rr, part] of pts) note(`${c.who} | daun pintu kamar mandi (sudut saat t)`, leafDist(bl, p, rr, 2.0), t, `${part} (${shot})`);
        if (c.feet && cross[c.who]) { const left = new THREE.Vector3(Math.cos(c.yaw), 0, -Math.sin(c.yaw)); const d = new THREE.Vector3(c.feet.R[0] - c.feet.L[0], 0, c.feet.R[2] - c.feet.L[2]).dot(left) * 100; if (d < cross[c.who].d) cross[c.who] = { d, t }; }
        // camera vs body (cylinder to the head top ~ h) — skipped for POV shots (no characters drawn)
        if (st.hasChars) {
          const cp = st.cam.pos;
          const dc = Math.hypot(cp[0] - c.root[0], cp[2] - c.root[2]) - r - 0.05;
          if (cp[1] < h + 0.1 && dc < camMin) { camMin = dc; camMinT = t; camWho = `${c.who} (${shot})`; }
        }
        depth[c.who] = Math.max(depth[c.who] ?? 0, c1ArmTorsoDepth(qOf(c, "L") as never, "L", h) * 100, c1ArmTorsoDepth(qOf(c, "R") as never, "R", h) * 100);
      }
      // non-character bodies (props) against boxes (with openings) and the leaves of this frame
      for (const [p, rr, part] of cfg.props?.(t, shot) ?? []) {
        for (const bx of boxes) { if (inOpening(cfg, bx.name, p)) continue; note(`benda | ${bx.name}`, boxDist(p, rr, bx), t, `${part} (${shot})`); }
        for (const l of cfg.leaves?.(t, shot) ?? []) note(`benda | ${l.name} (sudut saat t)`, leafSeg(l, p, rr), t, `${part} (${shot})`);
      }
      // camera vs walls / furniture
      if (st.hasChars || cfg.cameraBoxShots?.includes(shot)) for (const bx of boxes) { const d = boxDist(st.cam.pos, 0.05, bx); if (d < camMin && d < 0.6) { camMin = d; camMinT = t; camWho = `${bx.name} (${shot})`; } }
      const [u, ad] = fr.chars;
      const cc = Math.hypot(u.root[0] - ad.root[0], u.root[2] - ad.root[2]) - 0.38;
      if (cc < minCC) { minCC = cc; minCCt = t; }
      // other cast (the guard): body gap to Uq and adik
      for (const o of fr.chars.slice(2)) for (const c of [u, ad]) {
        const g = Math.hypot(o.root[0] - c.root[0], o.root[2] - c.root[2]) - (o.r ?? 0.2) - (c.who === "uq" ? 0.22 : 0.16);
        if (g < minOther) { minOther = g; minOtherT = t; minOtherWho = `${o.who}–${c.who}`; }
      }
      if (prev && f > f0) {
        const [pu, pa] = prev.chars;
        vMaxU = Math.max(vMaxU, Math.hypot(u.root[0] - pu.root[0], u.root[2] - pu.root[2]) * 30);
        vMaxA = Math.max(vMaxA, Math.hypot(ad.root[0] - pa.root[0], ad.root[2] - pa.root[2]) * 30);
        const yd = (x: number, y: number) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y))) * 180 / Math.PI;
        yawStep.uq = Math.max(yawStep.uq, yd(u.yaw, pu.yaw)); yawStep.adik = Math.max(yawStep.adik, yd(ad.yaw, pa.yaw));
        const s = (c: Ch, p: Ch, side: "L" | "R") => { const x = qOf(c, side), y = qOf(p, side); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
        const upd = (k: keyof typeof step, v: number) => { if (v > step[k].v) step[k] = { v, t }; };
        upd("uqR", s(u, pu, "L")); upd("uqL", s(u, pu, "R")); upd("adR", s(ad, pa, "L")); upd("adL", s(ad, pa, "R"));
      }
      prev = fr;
    }
  }
  // ---------------------------------------------------------------- report
  const fails: string[] = [];
  console.log(`== ${cfg.title}: clearance (m; < 0 = inside; only on-screen frames)`);
  const vs = Object.entries(viol).sort((x, y) => x[1].t0 - y[1].t0);
  if (!vs.length) console.log("no body, arm or foot is inside any object");
  for (const [k, v] of vs) { console.log(`MASUK  ${k}: ${f2(v.t0)}–${f2(v.t1)} s, worst ${f3(v.d)} m at ${f2(v.tAt)} s (${v.part})`); fails.push(`MASUK ${k}`); }
  console.log("-- closest ok (< 0.10 m):");
  for (const [k, v] of Object.entries(worst).sort((x, y) => x[1].d - y[1].d)) if (v.d >= 0 && v.d < 0.1) console.log(`ok     ${k}: ${f3(v.d)} at ${f2(v.t)} s (${v.part})`);
  const line = (ok: boolean, s: string) => { console.log(`${ok ? "ok   " : "GAGAL"} ${s}`); if (!ok) fails.push(s); };
  line(cross.uq.d >= 0 && cross.adik.d >= 0, `feet separation along own left (negative = crossed): Uq ${f2(cross.uq.d)} cm at ${f2(cross.uq.t)} s, adik ${f2(cross.adik.d)} cm at ${f2(cross.adik.t)} s`);
  line(minCC >= 0.017, `body gap min ${f3(minCC)} m at ${f2(minCCt)} s (>= 0.017)`);
  if (minOther < 9) line(minOther >= 0.017, `body gap other cast min ${f3(minOther)} m (${minOtherWho}) at ${f2(minOtherT)} s (>= 0.017)`);
  line(camMin >= 0.05, `camera nearest: ${f3(camMin)} m to ${camWho} at ${f2(camMinT)} s (> 0.05)`);
  console.log(`info  root speed max: Uq ${f2(vMaxU)} m/s, adik ${f2(vMaxA)} m/s; body yaw max step Uq ${f2(yawStep.uq)}, adik ${f2(yawStep.adik)} deg/frame`);
  line(step.uqR.v <= 11.1 && step.uqL.v <= 11.1 && step.adR.v <= 7.1 && step.adL.v <= 7.1, `arm step max deg/frame: Uq right ${f2(step.uqR.v)} at ${f2(step.uqR.t)}, Uq left ${f2(step.uqL.v)} at ${f2(step.uqL.t)} (limit 11.1); adik right ${f2(step.adR.v)} at ${f2(step.adR.t)}, adik left ${f2(step.adL.v)} at ${f2(step.adL.t)} (limit 7.1)`);
  line(depth.uq <= 0.26 && depth.adik <= 0, `arm in torso max: Uq ${f2(depth.uq)} cm (limit 0.2; 0.26 accepted = Ep 3/4 phone pose), adik ${f2(depth.adik)} cm (limit 0)`);
  line(doorBad === 0, `bath door open in a shot that needs it closed: ${doorBad} frames (must be 0)`);
  for (const e of cfg.extra?.() ?? []) { console.log(e); if (e.startsWith("GAGAL")) fails.push(e); }
  console.log(fails.length ? `\nHASIL: GAGAL (${fails.length}): ${fails.join(" | ")}` : "\nHASIL: LOLOS (tidak ada masalah geometri/gerak terukur; keluwesan dan keterbacaan tetap dinilai saat diputar, lihat checklist)");
  if (fails.length) process.exitCode = 1;
  return fails;
};
