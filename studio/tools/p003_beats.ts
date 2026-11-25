// Prints the 2026-11-003 pilot action schedule (BEAT), shots and end as JSON, from pilot003Stage.ts (which reads
// pilot003-plan.json), so the audio mix places its SFX on exactly the frames the picture uses.
// Run from studio/: npx esbuild tools/p003_beats.ts --bundle --platform=node --log-level=warning --outfile=out/p003_beats.cjs && node out/p003_beats.cjs
import { BEAT, END, FRAMES, GLASS_WINDOW, LINES, SHOTS, TIMING } from "../src/ep003/pilot003Stage";

console.log(JSON.stringify({ timing: TIMING, end: END, frames: FRAMES, beat: BEAT, glass: GLASS_WINDOW, shots: SHOTS, lines: LINES }));
