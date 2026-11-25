// Episode 4 (2026-11-005) full-episode motion check, S04–S15: the driver for tools/motion_check_lib.ts (result of the Ep 4 run:
// _media/2026-11-005/out/episode_preview_v1/qc/e005_check.txt). Run from studio/:
//   npx esbuild tools/e005_check.ts --bundle --platform=node --log-level=warning --outfile=out/e005_check.cjs && node out/e005_check.cjs
import { bathDoorAt, charsAt, CURTAIN_KEYS, phaseOf, SH, stageAt, stepTimes } from "../src/ep005/episode005Stage";
import PLAN from "../src/ep005/episode005-plan.json";
import { checkMotion } from "./motion_check_lib";
import type { Ch } from "./motion_check_lib";

const order = PLAN.order.filter((k) => k !== "OPEN");
const d12 = bathDoorAt(SH.S12[1] - 1 / 30);
checkMotion({
  title: "Episode 4 S04–S15",
  shots: order.map((id) => ({ id, t0: SH[id][0], t1: SH[id][1] })),
  at: (t, shot) => { const st = stageAt(t, shot); return { chars: charsAt(t).chars as unknown as Ch[], hasChars: st.chars, cam: st.cam, bathDoor: st.bathDoor }; },
  closedDoorShots: ["S13", "S14", "S15"],
  cameraBoxShots: ["S06"],
  extra: () => [
    `${d12 === 0 ? "ok   " : "GAGAL"} door at S12 end ${d12.toFixed(3)} rad (must be 0)`,
    `${CURTAIN_KEYS.reachErr < 0.02 && CURTAIN_KEYS.pullErr < 0.02 ? "ok   " : "GAGAL"} curtain hand: reach error ${CURTAIN_KEYS.reachErr.toFixed(3)} m, pull end ${CURTAIN_KEYS.pullErr.toFixed(3)} m (< 0.02)`,
    `info  phase at shot starts: ${order.map((k) => `${k}:${phaseOf(SH[k][0])}`).join(" ")}; footsteps on screen ${stepTimes().length}`,
  ],
});
