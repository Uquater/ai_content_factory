// Episode 4 (2026-11-005): picture beats for the full-episode mix — heel strikes on screen (S04–S12), from the same move
// data the picture draws (episode005Stage.ts stepTimes). Writes out/e005_beats.json (read by scripts/ep005_episode_audio.py mix).
// Run from studio/:
//   npx esbuild tools/e005_beats.ts --bundle --platform=node --log-level=warning --outfile=out/e005_beats.cjs && node out/e005_beats.cjs
import * as fs from "fs";
import { stepTimes } from "../src/ep005/episode005Stage";

const steps = stepTimes();
fs.writeFileSync("out/e005_beats.json", JSON.stringify({ steps }, null, 1));
console.log(`${steps.length} steps; first ${steps[0]?.[0]}, last ${steps[steps.length - 1]?.[0]}`);
