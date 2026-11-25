// Ep 5: heel strikes on screen for the footstep SFX of the episode mix (scripts/ep006_episode_audio.py reads out/e006_beats.json)
//   npx esbuild tools/e006_beats.ts --bundle --platform=node --log-level=warning --outfile=out/e006_beats.cjs && node out/e006_beats.cjs
import { writeFileSync } from "node:fs";
import { stepTimes } from "../src/ep006/stage006";
const steps = stepTimes();
writeFileSync("out/e006_beats.json", JSON.stringify({ steps }, null, 1));
console.log(steps.length, "steps ->", "out/e006_beats.json");
