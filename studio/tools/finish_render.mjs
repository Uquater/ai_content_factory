// Mux a rendered picture-only MP4 with silent AAC (or a given audio file) into a deliverable, and REFUSE to overwrite
// an existing deliverable (comparison videos must stay as they are). FORCE=1 allows an overwrite on purpose.
// usage: node tools/finish_render.mjs <picture.mp4> <out.mp4> [audio.wav]
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const [, , pic, out, audio] = process.argv;
if (!pic || !out) {
  console.error("usage: node tools/finish_render.mjs <picture.mp4> <out.mp4> [audio.wav]");
  process.exit(2);
}
if (existsSync(out) && process.env.FORCE !== "1") {
  console.error(`REFUSED: ${out} already exists. Keep it, or render under a new name (FORCE=1 to overwrite on purpose).`);
  process.exit(3);
}
const a = audio ? ["-i", audio] : ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"];
const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", pic, ...a, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", out], { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`wrote ${out}`);
