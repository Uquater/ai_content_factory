// Numeric checks for the 2026-11-002 cast presets (no rendering): preset heights against C1 and the carry pose
// clearances. Run from studio/:
//   npx esbuild tools/cast_check.ts --bundle --platform=node --log-level=warning --outfile=out/cast_check.cjs && node out/cast_check.cjs
import { carryCheck, carryContacts } from "../src/cast/carry";
import { NPC_PRESETS, presetHeight } from "../src/cast/npc";

const C1H = 1.5;
for (const p of Object.values(NPC_PRESETS)) {
  const h = presetHeight(p);
  console.log(`${p.id.padEnd(14)} head ${(h.head / C1H).toFixed(3)} × C1   hair ${(h.hair / C1H).toFixed(3)} × C1`);
}
console.log("carryCheck", JSON.stringify(carryCheck()));
const k = carryContacts();
console.log("carryContacts (m; > 0 = overlap)", JSON.stringify(k));
const worst = Math.max(...Object.values(k));
console.log(worst > 0 ? `OVERLAP worst ${worst.toFixed(4)} m` : `OK worst clearance ${(-worst).toFixed(4)} m`);

// ---- walk (D-027): planted feet must not slide in the world; feet never under the floor; the stop is in double support
import { walkState } from "../src/cast/walk";
import type { Gait, WalkPlan } from "../src/cast/walk";
{
  const g: Gait = { height: 1.39, stride: 1.05, phase: 0.31 };
  const plan: WalkPlan = { t0: 0.5, from: [0, 0, 0], yaw: Math.PI / 2, speed: 0.95, tStop: 6.0, decel: 1.2 };
  const world = (t: number, side: "L" | "R") => {
    const w = walkState(g, plan, t);
    const a = w.legPose[side].ankle;
    const c = Math.cos(w.yaw);
    const s = Math.sin(w.yaw);
    const x = a[0] * g.height;
    const z = a[2] * g.height;
    return { p: [w.position[0] + x * c + z * s, w.position[1] + a[1] * g.height, w.position[2] - x * s + z * c], v: w.speed };
  };
  let slide = 0;
  let below = 0;
  for (let f = 0; f < 240; f++) {
    for (const side of ["L", "R"] as const) {
      const a = world(f / 30, side);
      const b = world((f + 1) / 30, side);
      below = Math.min(below, a.p[1] - 0.012 * g.height);
      // planted = it stays at floor height in both frames
      if (Math.abs(a.p[1] - 0.012 * g.height) < 1e-6 && Math.abs(b.p[1] - 0.012 * g.height) < 1e-6) slide = Math.max(slide, Math.hypot(b.p[0] - a.p[0], b.p[2] - a.p[2]));
    }
  }
  const end = walkState(g, plan, 7);
  const lifted = (["L", "R"] as const).map((sd) => +(end.legPose[sd].ankle[1] - 0.012).toFixed(5));
  console.log(`walk: max planted-foot slide ${(slide * 1000).toFixed(2)} mm/frame · lowest foot ${(below * 1000).toFixed(2)} mm · lift at rest L/R ${lifted.join("/")} (0 = planted) · stop distance ${end.d.toFixed(3)} m`);
}
