// Numeric check of the pilot v3 sit-up (A02–A04, no rendering): per frame the palm error to its target, the palm's
// height above the mattress (penetration < 0); pass "smooth" for the episode (v3b) hand path, the largest arm-angle step between frames (an elbow flip shows as a big
// step), and the torso lean step (pops). Run from studio/:
//   npx esbuild tools/situp_check.ts --bundle --platform=node --log-level=warning --outfile=out/situp_check.cjs && node out/situp_check.cjs
import { c1ArmTorsoDepth, c1HandWorld } from "../src/c1/bodyIk";
import { poseAt, SHOTS, TOP, V3_FPS, YAW } from "../src/ep002/v3motion";

const f0 = Math.round(SHOTS[0].start * V3_FPS);
const f1 = Math.round(SHOTS[SHOTS.length - 1].end * V3_FPS);
let prev: ReturnType<typeof poseAt> | null = null;
let worst = { err: 0, errF: 0, pen: 0, penF: 0, step: 0, stepF: 0, lean: 0, leanF: 0, torso: 0, torsoF: 0 };
let torsoFrames = 0;
const rows: string[] = [];
for (let f = f0; f < f1; f++) {
  const t = f / V3_FPS;
  const arg = process.argv[2];
  const p = poseAt(t, arg === "smooth" ? "v3b" : arg === "v3c" ? "v3c" : "v3");
  const hL = c1HandWorld([p.aL.arm[0], p.aL.arm[1], p.aL.fwd], "L", p.root, YAW, p.body);
  const hR = c1HandWorld([p.aR.arm[0], p.aR.arm[1], p.aR.fwd], "R", p.root, YAW, p.body);
  const err = Math.max(p.aL.err, p.aR.err);
  const tL = c1ArmTorsoDepth([p.aL.arm[0], p.aL.arm[1], p.aL.fwd], "L");
  const tR = c1ArmTorsoDepth([p.aR.arm[0], p.aR.arm[1], p.aR.fwd], "R");
  const torso = Math.max(tL, tR);
  if (torso > 0.005) torsoFrames++;
  if (torso > worst.torso) worst = { ...worst, torso, torsoF: f };
  const pen = Math.min(hL.y, hR.y) - (TOP + 0.012);
  let step = 0;
  let dLean = 0;
  if (prev) {
    step = Math.max(
      Math.abs(p.aL.arm[0] - prev.aL.arm[0]), Math.abs(p.aL.arm[1] - prev.aL.arm[1]), Math.abs(p.aL.fwd - prev.aL.fwd),
      Math.abs(p.aR.arm[0] - prev.aR.arm[0]), Math.abs(p.aR.arm[1] - prev.aR.arm[1]), Math.abs(p.aR.fwd - prev.aR.fwd),
    );
    dLean = Math.abs(p.b.lean - prev.b.lean);
  }
  if (err > worst.err) worst = { ...worst, err, errF: f };
  if (pen < worst.pen) worst = { ...worst, pen, penF: f };
  if (step > worst.step) worst = { ...worst, step, stepF: f };
  if (dLean > worst.lean) worst = { ...worst, lean: dLean, leanF: f };
  if ((t >= 8.05 && t <= 9.6) || (process.argv[3] === "all" && f % 15 === 0))
    rows.push(`${f} t=${t.toFixed(2)} lean=${p.b.lean.toFixed(1)} nod=${p.b.headNod.toFixed(1)} hand=${p.b.hand.toFixed(2)} L=[${p.aL.arm.map((x) => x.toFixed(0))},${p.aL.fwd.toFixed(0)}] R=[${p.aR.arm.map((x) => x.toFixed(0))},${p.aR.fwd.toFixed(0)}] err=${(err * 100).toFixed(1)}cm palmY-top=${(pen * 100).toFixed(1)}cm step=${step.toFixed(1)} inTorso L=${(tL * 100).toFixed(1)} R=${(tR * 100).toFixed(1)}cm`);
  prev = p;
}
console.log(rows.join("\n"));
console.log(`WORST palm error ${(worst.err * 100).toFixed(1)} cm @${worst.errF} · palm below mattress ${(worst.pen * 100).toFixed(1)} cm @${worst.penF} · arm step ${worst.step.toFixed(1)}° @${worst.stepF} · lean step ${worst.lean.toFixed(1)}°/frame @${worst.leanF} · arm INSIDE torso max ${(worst.torso * 100).toFixed(1)} cm @${worst.torsoF}, frames > 5 mm: ${torsoFrames}`);
