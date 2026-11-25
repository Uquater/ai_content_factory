// Pilot 2026-11-003 v2 (D-041 pending): prints, as JSON, everything the v2 sound mix and QC need from the picture:
// the action schedule (BEAT), sweep phases (SW), cut points (CUTS), shots, line times, and
//  - footfalls: every heel strike of Uq's feet in pilot time, from the per-frame stage itself (uqAt → legPose, root,
//    yaw; sampled at 240 Hz), not from gait formulas (walk 1 decelerates; the settle adds a closing step);
//  - slip: how far a planted foot moves while it is planted (P4 "kaki tidak meluncur"), per walk phase;
//  - side: each camera's distance from the Uq–adik line at its shot time, west_m > 0 = WEST of the line (D-038 rule).
// Run from studio/: npx esbuild tools/p003v2_beats.ts --bundle --platform=node --log-level=warning --outfile=out/p003v2_beats.cjs && node out/p003v2_beats.cjs
import { P2 } from "../src/ep003/pilot003V2";
import { P1 } from "../src/ep003/pilot003Stage";
import { P3 } from "../src/ep003/pilot003V3";
import type { Pilot003Build } from "../src/ep003/pilot003Stage";
import type { V3 } from "../src/inkbeat/types";

const P: Pilot003Build = process.argv[2] === "v1" ? P1 : process.argv[2] === "v3" ? P3 : P2;
const HZ = 240;
const world = (root: V3, yaw: number, h: number, a: V3): V3 => {
  // character frame: x = side, z = forward (dir = (sin yaw, 0, cos yaw)), units of height
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const x = a[0] * h, z = a[2] * h;
  return [root[0] + x * c + z * s, root[1] + a[1] * h, root[2] - x * s + z * c];
};
type Foot = "L" | "R";
const feet: Record<Foot, { t: number; p: V3 }[]> = { L: [], R: [] };
const tEnd = P.BEAT.turn0; // legPose is handed to C1 only before the turn (after it C1 keeps its own stance)
for (let i = 0; i <= Math.ceil(tEnd * HZ); i++) {
  const t = i / HZ;
  const c = P.uqAt(t).char;
  if (!c.legPose) continue;
  for (const f of ["L", "R"] as Foot[]) feet[f].push({ t, p: world(c.root, c.yaw, c.height, c.legPose[f].ankle) });
}
// planted = ankle at (near) its lowest height and (nearly) still horizontally; a strike = the first planted sample
// after >= 0.08 s of swing
const steps: { t: number; foot: Foot; phase: string; swing_s: number; lift_cm: number }[] = [];
const slip: { foot: Foot; from: number; to: number; slip_cm: number }[] = [];
for (const f of ["L", "R"] as Foot[]) {
  const a = feet[f];
  const yMin = Math.min(...a.map((x) => x.p[1]));
  let swingFrom = -1, maxY = 0, plantFrom = -1, plantP: V3 | null = null, maxSlip = 0;
  for (let i = 1; i < a.length; i++) {
    const v = Math.hypot(a[i].p[0] - a[i - 1].p[0], a[i].p[2] - a[i - 1].p[2]) * HZ;
    const planted = a[i].p[1] <= yMin + 0.002 && v < 0.05;
    if (!planted) {
      if (plantFrom >= 0 && plantP) slip.push({ foot: f, from: +plantFrom.toFixed(3), to: +a[i].t.toFixed(3), slip_cm: +(maxSlip * 100).toFixed(2) });
      plantFrom = -1; plantP = null; maxSlip = 0;
      if (swingFrom < 0) { swingFrom = a[i].t; maxY = 0; }
      maxY = Math.max(maxY, a[i].p[1] - yMin);
    } else {
      if (swingFrom >= 0 && a[i].t - swingFrom >= 0.08) {
        const phase = a[i].t < P.BEAT.st0 ? (a[i].t < P.BEAT.walkStop ? "walk1" : "settle1") : a[i].t < P.BEAT.st1 ? "steps2" : "settle2";
        steps.push({ t: +a[i].t.toFixed(3), foot: f, phase, swing_s: +(a[i].t - swingFrom).toFixed(3), lift_cm: +(maxY * 100).toFixed(1) });
      }
      swingFrom = -1;
      if (plantFrom < 0) { plantFrom = a[i].t; plantP = a[i].p; }
      maxSlip = Math.max(maxSlip, Math.hypot(a[i].p[0] - plantP![0], a[i].p[2] - plantP![2]));
    }
  }
  if (plantFrom >= 0) slip.push({ foot: f, from: +plantFrom.toFixed(3), to: +tEnd.toFixed(3), slip_cm: +(maxSlip * 100).toFixed(2) });
}
steps.sort((x, y) => x.t - y.t);
// any horizontal ankle motion WITHOUT lift (a slide): the largest per-window move while the foot stays at ground height
const slide: { foot: Foot; t0: number; t1: number; cm: number }[] = [];
for (const f of ["L", "R"] as Foot[]) {
  const a = feet[f];
  const yMin = Math.min(...a.map((x) => x.p[1]));
  let i0 = -1, d = 0;
  for (let i = 1; i < a.length; i++) {
    const ground = a[i].p[1] <= yMin + 0.002;
    const v = Math.hypot(a[i].p[0] - a[i - 1].p[0], a[i].p[2] - a[i - 1].p[2]);
    if (ground && v * HZ >= 0.05) {
      if (i0 < 0) { i0 = i; d = 0; }
      d += v;
    } else if (i0 >= 0) {
      if (d > 0.005) slide.push({ foot: f, t0: +a[i0].t.toFixed(3), t1: +a[i].t.toFixed(3), cm: +(d * 100).toFixed(1) });
      i0 = -1;
    }
  }
}
// 180°: signed distance of each camera from the line adik → Uq (xz), negative = west of the line
const side = P.SHOTS.map((s) => {
  const tm = Math.min((s.start + s.end) / 2, P.END - 1e-3);
  const st = P.stageAt(tm);
  const ad = P.adikAt(st.ts);
  const u = P.uqAt(st.ts).char.root;
  const dx = u[0] - ad.root[0], dz = u[2] - ad.root[2];
  const L = Math.hypot(dx, dz);
  const cx = st.cam.pos[0] - ad.root[0], cz = st.cam.pos[2] - ad.root[2];
  // the line runs roughly north (-z); this cross product is NEGATIVE for a camera west (-x) of it, so west = -cross
  const west = -(cz * dx - cx * dz) / L;
  return { shot: s.id, t: +tm.toFixed(2), ts: +st.ts.toFixed(2), cam: st.cam.pos.map((x) => +x.toFixed(2)), uq: [+u[0].toFixed(2), +u[2].toFixed(2)], west_m: +west.toFixed(2) };
});
console.log(JSON.stringify({ timing: P.TIMING, end: P.END, frames: P.FRAMES, beat: P.BEAT, sw: P.SW, cuts: P.CUTS, glass: P.GLASS_WINDOW, shots: P.SHOTS, lines: P.LINES, steps, slip, slide, side }));
