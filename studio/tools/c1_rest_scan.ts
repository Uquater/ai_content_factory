// rev1: scan resting-hand spots on the table for C1's right arm: palm error, elbow swivel, elbow position.
import PLAN from "../src/c1/demo-plan.json";
import { reachAt, reachJoints } from "../src/c1/reach";
import type { ReachScene } from "../src/c1/reach";
import { C1_BUILD, C1_HEIGHT } from "../src/c1/c1rig";
import { layoutOf } from "../src/inkbeat/char/skeleton";
const L = layoutOf(C1_BUILD);
const root: [number, number, number] = [0, 0.36 - (L.torsoY0 + 0.012) * C1_HEIGHT, -0.18];
const SC: ReachScene = { root, tableY: 0.6, cupY: 0.604, cupZ: PLAN.reach.cupZ, table: { x0: -0.75, x1: 0.75, z0: -0.03, z1: 0.59 } };
for (const x of [-0.2, -0.16, -0.12, -0.08, -0.04])
  for (const d of [0.12, 0.16, 0.2, 0.24]) {
    const s = reachAt(0, { ...PLAN.reach, restAt: [x, d] }, SC);
    const j = reachJoints(s, SC);
    console.log(`x=${x} d=${d} err=${(s.err * 1000).toFixed(1)}mm pen=${(Math.sqrt(s.pen) * 1000).toFixed(1)} q=${s.armL.map((v) => v.toFixed(0))},${s.armLFwd.toFixed(0)} sw=${s.swivelL.toFixed(0)} E=${[j.E.x, j.E.y, j.E.z].map((v) => v.toFixed(3))}`);
  }
