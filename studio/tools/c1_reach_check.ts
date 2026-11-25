// rev1 numeric check of C1's reach in WarungDemo (no rendering): per frame of S2 the palm error, table penetration,
// joint angle steps (pops), elbow/wrist speeds, and the closest approach of the hand to the glass axis.
// Run from studio/: npx esbuild tools/c1_reach_check.ts --bundle --platform=node --outfile=<tmp>/c.cjs && node <tmp>/c.cjs
import PLAN from "../src/c1/demo-plan.json";
import { reachAt, reachJoints } from "../src/c1/reach";
import type { ReachScene } from "../src/c1/reach";
import { C1_BUILD, C1_HEIGHT } from "../src/c1/c1rig";
import { layoutOf } from "../src/inkbeat/char/skeleton";

const L = layoutOf(C1_BUILD);
const SEAT_Y = 0.36;
const TABLE_Y = 0.6;
const root: [number, number, number] = [0, SEAT_Y - (L.torsoY0 + 0.012) * C1_HEIGHT, -0.18];
const SC: ReachScene = { root, tableY: TABLE_Y, cupY: TABLE_Y + 0.004, cupZ: PLAN.reach.cupZ, table: { x0: -0.75, x1: 0.75, z0: -0.03, z1: 0.59 } };
const R = PLAN.reach;
const fps = 30;
let prev: ReturnType<typeof reachAt> | null = null;
let prevJ: ReturnType<typeof reachJoints> | null = null;
let worst = { err: 0, pen: 0, dq: 0, glass: 1 };
const rows: string[] = [];
for (let f = Math.floor(5.0 * fps); f <= Math.ceil(9.2 * fps); f++) {
  const t = f / fps;
  const s = reachAt(t, R, SC);
  const j = reachJoints(s, SC);
  const dq = prev ? Math.max(Math.abs(s.armL[0] - prev.armL[0]), Math.abs(s.armL[1] - prev.armL[1]), Math.abs(s.armLFwd - prev.armLFwd), Math.abs(s.swivelL - prev.swivelL)) : 0;
  const ve = prevJ ? j.E.distanceTo(prevJ.E) * fps : 0;
  const vw = prevJ ? j.W.distanceTo(prevJ.W) * fps : 0;
  // palm surface distance to the glass wall (outer radius ~0.0356 m at the contact height): + = gap, - = inside
  const dx = s.palm[0] - s.cup[0];
  const dz = s.palm[2] - s.cup[2];
  const glass = Math.hypot(dx, dz) - 0.0356 - 0.0113;
  {
    worst.err = Math.max(worst.err, s.err);
    worst.pen = Math.max(worst.pen, s.pen);
    worst.dq = Math.max(worst.dq, dq);
    if (s.palm[1] < s.cup[1] + 0.11) worst.glass = Math.min(worst.glass, glass);
  }
  rows.push(
    [t.toFixed(3), s.phase.padEnd(8), s.armL.map((v) => v.toFixed(1)).join(","), s.armLFwd.toFixed(1), `sw=${s.swivelL.toFixed(1)}`, `err=${(s.err * 1000).toFixed(1)}mm`, `pen=${Math.sqrt(s.pen) * 1000 < 0.05 ? 0 : (Math.sqrt(s.pen) * 1000).toFixed(1)}mm`, `dq=${dq.toFixed(1)}`, `vE=${ve.toFixed(2)}`, `vW=${vw.toFixed(2)}`, `glassGap=${(glass * 1000).toFixed(1)}mm`, `cupX=${s.cup[0].toFixed(3)}`, `E=${[j.E.x, j.E.y, j.E.z].map((v) => v.toFixed(3)).join(",")}`, `eyes=${s.eyes.toFixed(2)} head=${s.head.toFixed(2)}`, `lean=${s.body.lean.toFixed(1)}`, `palm=${s.palm.map((v) => v.toFixed(3)).join(",")}`].join(" "),
  );
  prev = s;
  prevJ = j;
}
console.log(rows.join("\n"));
console.log("WORST (non-rest frames):", JSON.stringify({ errMm: +(worst.err * 1000).toFixed(2), penMm: +(Math.sqrt(worst.pen) * 1000).toFixed(2), maxJointStepDeg: +worst.dq.toFixed(2), minPalmGlassGapMm: +(worst.glass * 1000).toFixed(2) }));
