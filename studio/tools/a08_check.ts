// Numeric check of A08 v3 (adik pulled from the door), no rendering: per frame C1's palm error to her arm, her palm
// error to the handle while she holds it, the distance between the two bodies, and the largest per-frame arm step.
// Run from studio/: npx esbuild tools/a08_check.ts --bundle --platform=node --log-level=warning --outfile=out/a08_check.cjs && node out/a08_check.cjs
import { a08At, T0 } from "../src/ep002/v3a08";
import PLAN from "../src/ep002/plan-2026-11-002.json";

const end = PLAN.shots.find((s) => s.id === "a08")!.end;
let prev: ReturnType<typeof a08At> | null = null;
let worst = { c1: 0, c1F: 0, handle: 0, handleF: 0, step: 0, stepF: 0, close: 9, closeF: 0 };
for (let f = Math.round(T0 * 30); f < Math.round(end * 30); f++) {
  const t = f / 30;
  const s = a08At(t);
  const dx = s.c1.position[0] - s.adik.position[0];
  const dz = s.c1.position[2] - s.adik.position[2];
  const dist = Math.hypot(dx, dz);
  const e1 = s.c1.armR && s.c1.grab > 0.98 ? s.c1.armR.err : 0;
  const e2 = s.adik.armR && s.adik.onHandle > 0.98 ? s.adik.armR.err : 0;
  let step = 0;
  if (prev && prev.c1.armR && s.c1.armR) step = Math.max(Math.abs(prev.c1.armR.arm[0] - s.c1.armR.arm[0]), Math.abs(prev.c1.armR.arm[1] - s.c1.armR.arm[1]), Math.abs(prev.c1.armR.fwd - s.c1.armR.fwd));
  if (e1 > worst.c1) worst = { ...worst, c1: e1, c1F: f };
  if (e2 > worst.handle) worst = { ...worst, handle: e2, handleF: f };
  if (step > worst.step) worst = { ...worst, step, stepF: f };
  if (dist < worst.close) worst = { ...worst, close: dist, closeF: f };
  if (f % 3 === 0 || (f >= 1255 && f <= 1262))
    console.log(`${f} t=${(t - T0).toFixed(2)} c1=[${s.c1.position.map((v) => v.toFixed(2))}] yaw=${s.c1.yaw.toFixed(2)} grab=${s.c1.grab.toFixed(2)} c1err=${(e1 * 100).toFixed(1)}cm adik=[${s.adik.position.map((v) => v.toFixed(2))}] handle=${s.adik.onHandle.toFixed(2)} herr=${(e2 * 100).toFixed(1)}cm dist=${dist.toFixed(2)} step=${step.toFixed(1)} arm=${s.c1.armR ? s.c1.armR.arm.map((v) => v.toFixed(0)).join(",") + "," + s.c1.armR.fwd.toFixed(0) : "-"}`);
  prev = s;
}
console.log(`WORST C1 palm-to-arm ${(worst.c1 * 100).toFixed(1)} cm @${worst.c1F} · adik palm-to-handle ${(worst.handle * 100).toFixed(1)} cm @${worst.handleF} · C1 arm step ${worst.step.toFixed(1)}° @${worst.stepF} · closest bodies ${worst.close.toFixed(2)} m @${worst.closeF}`);
