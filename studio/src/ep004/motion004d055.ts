// Episode 3 (2026-11-004), D-055: options for the motion tests after the owner's decisions of D-055 — S10 retreat
// option (c) step-close (the one variant of the declared grid that passed), hand insert I15 = 2.0 s with the passing
// grip motion, lens P unmoved. Timeline = episode004-plan-d055.json (DRAFT); the approved draft and the D-054 plan are
// not edited.
import P55 from "./episode004-plan-d055.json";
import { PROPOSED } from "./motion004";
import type { Opts } from "./motion004";

type Ins = { dur: number; dist: number; h: number; fov: number; swing: number; lookDy: number; reach: [number, number]; his: [number, number]; look0: number };
/** the (c) variant that passed (angka_s10c_iterasi.txt): 3/3 cycles, body "pulse", Uq's reach arm with the D-053 keys */
export const S10C_PASS: NonNullable<Opts["s10c"]> = { cycles: [3, 3], body: "pulse", gap: 0.13, armT: [0.05, 0.55, 1.1, 2.0], walkEnd: 2.8, out: 0.7 };
/** camera: "lama" = the old 9.15 s mapping continued from 59.20 (USULAN); "cepat" = full path in the two-shot (D-054 style);
 * "mulai" = from P0 at the two-shot start at the old speed (ends short of the old end) */
export type CamMode = "lama" | "cepat" | "mulai";
export const d055Opts = (cam: CamMode = "lama", over: Partial<Ins> = {}): Opts => {
  const I = { ...(P55.insert as unknown as Ins), ...over };
  const sh = P55.shots as Record<string, number[]>;
  const c = cam === "lama" ? { camStart: P55.cam.start, camDur: P55.cam.dur } : cam === "mulai" ? { camStart: sh.S15[0], camDur: P55.cam.dur } : {};
  return {
    ...PROPOSED, herT: I.reach, hisT: I.his, look0: I.look0, s10c: S10C_PASS,
    insert: { dur: I.dur, dist: I.dist, h: I.h, fov: I.fov, swing: I.swing, lookDy: I.lookDy, twoStart: sh.S15[0], twoDur: sh.S15[2], stare0: (P55.events.lens_stare as number[])[0], ...c },
  };
};
