// Episode 3 (2026-11-004), D-054: options for the motion tests after the owner's decisions (retreat option (a), hand
// insert I15 at the start of S15). Timeline = episode004-plan-d054.json (DRAFT, USULAN; the approved draft is unchanged).
import P54 from "./episode004-plan-d054.json";
import { PROPOSED } from "./motion004";
import type { Opts } from "./motion004";

type Ins = { dur: number; dist: number; h: number; fov: number; swing: number; lookDy: number; reach: [number, number]; his: [number, number] };
export const d054Opts = (over: Partial<Ins> = {}): Opts => {
  const I = { ...(P54.insert as unknown as Ins), ...over };
  const sh = P54.shots as Record<string, number[]>;
  return {
    ...PROPOSED, herT: I.reach, hisT: I.his,
    insert: { dur: I.dur, dist: I.dist, h: I.h, fov: I.fov, swing: I.swing, lookDy: I.lookDy, twoStart: sh.S15[0], twoDur: sh.S15[2], stare0: (P54.events.lens_stare as number[])[0] },
  };
};
