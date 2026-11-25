// Episode 5 (2026-11-006) closing shot, ANIMATIC v0 (owner 2026-11-24): the desk camera's view (lens 0.70 m from Uq's
// eyes, fov 50, decision §2.6). Uq stares straight into the lens ~2 s, takes one step forward (step-close, 0.40 m), reaches
// with his right hand (rig "L") and covers the lens; the picture cuts to black, then TAMAT. Silent test.
// Every value is a pure function of t (video-production §9). Numbers: tools/e006_close_check.ts.
import { c1ArmIK } from "../c1/bodyIk";
import { chain, movesAt, stanceAt, walkSteps } from "../cast/stepper";
import type { V3 } from "../inkbeat/types";
import { H_UQ, REST_UQ } from "../ep004/motion004";
import { stickHeadCenter } from "../c1/C1";

export type Q = [number, number, number];
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };

// ---- toa room R2 (decision 2026-11-24): behind the eastern neighbour, north of the gang; door in the south wall
export const ROOM = { x0: 7.0, x1: 9.4, z0: -9.4, z1: -7.3, h: 2.5, t: 0.12, door: { x0: 7.8, x1: 8.6, h: 2.0 } };
export const IN = { x0: ROOM.x0 + ROOM.t, x1: ROOM.x1 - ROOM.t, z0: ROOM.z0 + ROOM.t, z1: ROOM.z1 - ROOM.t };
export const DESK = { x0: IN.x0 + 0.3, x1: IN.x1 - 0.3, z0: IN.z0, z1: IN.z0 + 0.58, top: 0.75 };
export const YAW = Math.PI; // Uq faces north, toward the desk and the desk camera
export const LENS: V3 = [8.2, 1.324, -8.78]; // desk camera lens, on the desk 8 cm behind its front edge, at Uq's eye height
export const EYE_FWD = 0.164; // eye point ahead of the head centre (tools/e006_prep.ts: 0.85 x head half-width)
/** root z so the eyes are `d` metres from the lens (Uq faces -z) */
const rootForEye = (d: number): V3 => [LENS[0], 0, LENS[2] + d + EYE_FWD];
export const ROOT_A = rootForEye(0.7); // stare position
export const ROOT_B = rootForEye(0.3); // after the step: the reach position of e006_prep (inside the 0.35 m reach)
const head0 = stickHeadCenter(ROOT_B, H_UQ);
export const MIC: V3 = [ROOT_B[0] - 0.2, head0[1] - 0.2, ROOT_B[2] - 0.16]; // mic head: his left (-x when facing north), chin height

// ---- timing (s)
export const T = {
  stare: [0, 2.05] as [number, number], // eyes on the lens from the first frame
  step: [2.05, 2.85] as [number, number], // step-close, 0.40 m
  reach: [2.05, 3.35] as [number, number], // v0b: rises during the step, shows the open hand before the lens, then covers
  cut: 3.4, // hand covers the lens: picture and sound cut
  tamatIn: 3.9, tamatFull: 4.15, end: 6.4,
};
export const LEAN = 5; // deg, forward, during the reach (e006_prep D: passes with lean 5)

const st0 = stanceAt(ROOT_A, YAW, H_UQ);
const stepBlock = walkSteps(st0, ROOT_B, YAW, 2, T.step[0], T.step[1], H_UQ, "L"); // right foot (code "L") leads: same side as the reaching hand
export const UQ_MOVES = chain(st0, H_UQ, [stepBlock], 0.03);

// v0b (after the first v0 render: the hand entered the frame only 1 frame before the cut, so "meraih" did not read).
// Joint keys, each solved by IK at the root and lean of its own time; joints interpolate between keys (smooth):
//   K0 2.05 rest -> K1 2.75 open hand rises into the lower frame, 17 cm before the lens -> K2 3.05 10 cm before ->
//   K3 3.35 palm 4 cm before the lens (covers) -> cut 3.4.
const LEAN_T: [number, number] = [2.6, 3.35];
export const leanAt = (t: number) => LEAN * sm((t - LEAN_T[0]) / (LEAN_T[1] - LEAN_T[0]));
const KEY_T = [2.05, 2.75, 3.05, 3.35];
const KEY_OFF: V3[] = [[0, 0, 0], [0, -0.05, 0.17], [0, -0.02, 0.1], [0, 0, 0.04]];
const solveKey = (i: number): { q: Q; err: number } => {
  if (i === 0) return { q: REST_UQ, err: 0 };
  const t = KEY_T[i];
  const root = movesAt(UQ_MOVES, t).root;
  const tg: V3 = [LENS[0] + KEY_OFF[i][0], LENS[1] + KEY_OFF[i][1], LENS[2] + KEY_OFF[i][2]];
  const s = c1ArmIK({ root, yaw: YAW, body: { lean: leanAt(t) }, side: "L", target: tg, ref: [70, 15, 0], height: H_UQ, avoidTorso: true, wMin: -60 });
  return { q: [s.arm[0], s.arm[1], s.fwd], err: s.err };
};
const KEYS = KEY_T.map((_, i) => solveKey(i));
export const KEY_ERRS = KEYS.map((k) => k.err);
export const KEY_TIMES = KEY_T;
export const Q_REACH: Q = KEYS[KEYS.length - 1].q;
export const REACH_ERR = Math.max(...KEY_ERRS);
export const reachU = (t: number) => clamp01((t - T.reach[0]) / (T.reach[1] - T.reach[0]));
export const armAt = (t: number): Q => {
  if (t <= KEY_T[0]) return KEYS[0].q;
  for (let i = 1; i < KEY_T.length; i++) if (t < KEY_T[i]) {
    const u = sm((t - KEY_T[i - 1]) / (KEY_T[i] - KEY_T[i - 1]));
    const a = KEYS[i - 1].q, b = KEYS[i].q;
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  }
  return KEYS[KEYS.length - 1].q;
};

/** the whole state of Uq at t */
export const uqAt = (t: number) => {
  const m = movesAt(UQ_MOVES, t);
  const q = armAt(t);
  const lean = leanAt(t);
  return {
    root: m.root, yaw: m.yaw, legPose: m.legPose, feet: m.feetWorld,
    // the lean pitches the head down; the head nods back up by the same amount so the eyes stay on the lens
    pose: { armL: [q[0], q[1]] as [number, number], armLFwd: q[2], armR: [REST_UQ[0], REST_UQ[1]] as [number, number], armRFwd: REST_UQ[2], lean, headNod: -lean },
    q, lean,
  };
};
// blink seed with no blink in [0, cut] (tools/e006_close_check.ts scans it)
export const BLINK_SEED = 4;
export const FRAMES = Math.round(T.end * 30);
