// Pure motion for the pilot v3 (A02–A04): C1's body, head, face and hand IK as functions of episode time. No React,
// no three.js scene objects, so tools/situp_check.ts can check every frame in Node. Used by PilotV3.tsx.
import { Easing, interpolate } from "remotion";
import type { C1Face } from "../c1/C1";
import { c1ArmIK, c1HandWorld } from "../c1/bodyIk";
import type { C1Body } from "../c1/bodyIk";
import { C1_BUILD, C1_HEIGHT } from "../c1/c1rig";
import { layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import { KAMAR } from "./geo";
import PLAN from "./plan-2026-11-002.json";

export const V3_FPS = 30;
export const IDS = ["a02", "a03", "a04"] as const;
export type Id = (typeof IDS)[number];
export const SHOTS = (PLAN.shots as { id: string; start: number; end: number }[]).filter((s) => (IDS as readonly string[]).includes(s.id));
export const L = (id: string) => PLAN.lines.find((l) => l.id === id)!;
export const S = (id: Id) => SHOTS.find((s) => s.id === id)!;
/** c1SeatedRoot without importing the React file (same formula as C1.tsx) */
const LAY = layoutOf(C1_BUILD);
const seatedRoot = (seat: V3, height = C1_HEIGHT): V3 => [seat[0], seat[1] - (LAY.torsoY0 + 0.012) * height, seat[2]];

// ------------------------------------------------------------------ time helpers
export const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const IO = Easing.bezier(0.45, 0, 0.25, 1);
export const k = (t: number, a: number, b: number, easing = IO) => interpolate(t, [a, b], [0, 1], { ...clampOpts, easing });
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;
export const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
/** a keyed curve: times (episode s) → values, one easing per segment */
const curve = (t: number, ts: number[], vs: number[], ease: ((x: number) => number)[] | ((x: number) => number) = IO) =>
  interpolate(t, ts, vs, { ...clampOpts, easing: ease });

// ------------------------------------------------------------------ the bed and C1's body over time
// x 3.1 (the animatic used 3.3): lying, the head then rests on the pillow (its east end is at x 2.63)
export const BED_SEAT: V3 = [3.1, KAMAR.bed.top, (KAMAR.bed.z0 + KAMAR.bed.z1) / 2];
export const ROOT = seatedRoot(BED_SEAT);
export const YAW = Math.PI / 2; // sits up facing east (head on the pillow to the west)
// knees a little flatter than the animatic (0.47 -> 0.43) so they stay under the blanket slab while lying
export const flatLegs = (s: 1 | -1) => ({ ankle: [s * 0.05, 0.411, 0.38] as V3, knee: [s * 0.05, 0.43, 0.19] as V3 });
export const TOP = KAMAR.bed.top;

export type BodyState = {
  lean: number; // 0 = upright, -82 = lying
  lift: number; // m: the lying body rests slightly raised on the mattress
  bob: number;
  headNod: number; // + = chin down
  headYaw: number; // - = toward the window (south, screen left in A03/A04)
  hand: number; // 0 = planted beside the hips, 1 = resting on the lap
  plant: number; // 0 = resting where the lying arm falls, 1 = planted for the push
  ref: [number, number, number]; // preferred arm pose for the IK
  fold: number; // blanket top edge: 0 = at the waist (lying), 1 = slid back toward the knees
  face: C1Face;
};

/** the whole performance as a function of episode time */
/** smooth: the hand-to-lap move of the episode version (v3b, 2026-11-17): longer (0.95–1.85 s after the cut) and routed
 * through a waypoint above the blanket at the hip side, so the elbow does not sweep. false = the reviewed v3 cut. */
export type ArmMode = "v3" | "v3b" | "v3c";
export const bodyAt = (t: number, smooth: boolean | ArmMode = false): BodyState => {
  const mode: ArmMode = smooth === true ? "v3b" : smooth === false ? "v3" : smooth;
  smooth = mode !== "v3";
  const a3 = S("a03").start; // 8.10
  const l2 = L("L2");
  const l4 = L("L4");
  const l5 = L("L5");
  // ---- A03 sit-up (times from the cut): hold 0.10 · head leads + elbows push 0.10–0.24 · rise 0.24–0.72 with a small
  // forward overshoot · settle back with a weight dip 0.72–1.05 · alert, slightly forward 1.05+
  const lean = curve(t, [a3 + 0.1, a3 + 0.26, a3 + 0.86, a3 + 1.12, a3 + 1.5], [-74, -69, 7, 1, 3], [IO, Easing.bezier(0.42, 0, 0.32, 1), Easing.bezier(0.3, 0, 0.4, 1), IO]);
  const lift = 0.05 * (1 - k(t, a3 + 0.26, a3 + 0.7));
  const dip = curve(t, [a3 + 0.8, a3 + 0.96, a3 + 1.3], [0, -5, 0]);
  // head: tucks the chin to lead the rise, lags back as the torso swings up, catches up
  const nodRise = curve(t, [a3 + 0.08, a3 + 0.26, a3 + 0.72, a3 + 0.98, a3 + 1.25], [10, 24, -6, 3, 0]);
  // ---- A04: posture slowly closes (hunch) during L5
  const hunch = 4 * k(t, l5.start + 0.6, l5.start + 2.6);
  // breathing: shallow and quick after "cara menarik napas" (bob in 1/430 h)
  const quick = k(t, l5.start + 1.4, l5.start + 2.2);
  const breath = t > l4.end ? Math.sin((t - l4.end) * Math.PI * 2 * mix(0.35, 0.85, quick)) * mix(1.0, 2.2, quick) : 0;
  // the realisation: freeze through L4; in the pause after it the head pulls back a little (recoil); during L5 the gaze
  // drifts from the window toward the floor in front of him (processing), a swallow on "suara serak", and back to the
  // window at the end
  const recoil = curve(t, [l4.end - 0.02, l4.end + 0.22, l4.end + 0.9], [0, -5, -2]);
  const swallowT = l5.start + 3.25;
  const swallow = curve(t, [swallowT, swallowT + 0.16, swallowT + 0.5], [0, 5, 0]);
  const yawLie = curve(t, [l2.start + 0.7, l2.start + 1.5], [-22, -36]);
  const yawRise = curve(t, [a3 + 0.2, a3 + 0.9], [-36, -30]);
  const yawA4 = curve(t, [l5.start + 1.0, l5.start + 2.6, l5.start + 4.0, l5.start + 4.6], [-30, -16, -16, -30]);
  const headYaw = t < a3 ? yawLie : t < S("a04").start ? yawRise : yawA4;
  const nodA4 = 0 + recoil + swallow + 4 * k(t, l5.start + 1.0, l5.start + 2.6) * (1 - k(t, l5.start + 4.0, l5.start + 4.6));
  const headNod = t < a3 ? 10 : t < S("a04").start ? nodRise : nodA4;
  // hands: planted beside the hips through the push, then to the lap
  const plant = smooth ? k(t, a3 - 0.06, a3 + 0.28) : k(t, a3 + 0.06, a3 + 0.26);
  const hand = smooth ? k(t, a3 + 0.95, a3 + 1.85, Easing.bezier(0.4, 0, 0.35, 1)) : k(t, a3 + 0.95, a3 + 1.55);
  // the preferred arm pose follows the real path of the arm (hanging along the body -> pushing behind the hip -> swung
  // forward onto the lap), so every frame picks the same elbow solution (no flips)
  const ref: [number, number, number] = [mix(mix(10, -25, plant), 20, hand), mix(mix(20, 30, plant), 70, hand), mix(mix(-20, 70, plant), 80, hand)];
  // face (no lip sync: the mouth changes once, in the pause after L4, and holds)
  const eyesOpen = t > l2.start + 0.35;
  const face: C1Face =
    t < a3
      ? { eyes: eyesOpen ? "open" : "closed", mouth: "flat", brows: t > l2.start + 1.0 ? "raised" : "neutral", look: -0.7 * k(t, l2.start + 0.5, l2.start + 1.1) }
      : t < l4.end + 0.1
        ? { eyes: "open", mouth: "flat", brows: "raised", look: -0.8 }
        : { eyes: "open", mouth: "open", brows: "worried", look: t > l5.start + 1.0 && t < l5.start + 4.4 ? -0.2 : -0.8, lookY: t > l5.start + 1.0 && t < l5.start + 4.4 ? 0.35 : 0 };
  return {
    lean: t < a3 ? -74 : lean + (t >= S("a04").start ? hunch : 0),
    lift: t < a3 ? 0.05 : lift,
    bob: dip + breath,
    headNod,
    headYaw,
    hand,
    plant,
    ref,
    fold: k(t, a3 + 0.24, a3 + 0.75),
    face,
  };
};

/** hand targets (world): planted on the mattress a little behind and beside the hips; resting on the lap */
// planted on the uncovered mattress just behind the blanket fold, beside the hips (visible from a 3/4 camera)
export const planted = (side: "L" | "R"): V3 => [BED_SEAT[0] - 0.12, TOP + 0.045, BED_SEAT[2] + (side === "L" ? 0.22 : -0.22)];
export const lap = (side: "L" | "R"): V3 => [BED_SEAT[0] + 0.24, TOP + 0.16, BED_SEAT[2] + (side === "L" ? 0.11 : -0.11)];

/** the body transform and both arms (IK) at time t */
export const poseAt = (t: number, smooth: boolean | ArmMode = false) => {
  const mode: ArmMode = smooth === true ? "v3b" : smooth === false ? "v3" : smooth;
  const b = bodyAt(t, mode);
  const c = mode === "v3c";
  const body: C1Body = { lean: b.lean, bob: b.bob };
  const root: V3 = [ROOT[0], ROOT[1] + b.lift, ROOT[2]];
  // lying: the hand rests where the relaxed arm falls (forward kinematics of the lying body), lifted onto the mattress
  // v3c: the push happens beside the hips with a near-straight arm, outside the body: from the shoulder, a straight arm
  // 0.30 m out lands exactly on the mattress (C1's single-plane elbow cannot do elbow-out / hand-in, so closer targets
  // would tuck the elbow into the tee)
  const plantAt = (side: "L" | "R"): V3 => (c ? [BED_SEAT[0], TOP + 0.045, BED_SEAT[2] + (side === "L" ? 0.3 : -0.3)] : planted(side));
  const lapAt = (side: "L" | "R"): V3 => (c ? [BED_SEAT[0] + 0.3, TOP + 0.165, BED_SEAT[2] + (side === "L" ? 0.13 : -0.13)] : lap(side));
  const rest = (side: "L" | "R"): V3 => {
    // v3c: lying, the hands already rest on the mattress beside the hips, where they will push from — the same IK
    // branch from lying to sitting, so the arm never jumps between solutions
    if (c) return plantAt(side);
    const h = c1HandWorld([10, 20, -20], side, [ROOT[0], ROOT[1] + 0.05, ROOT[2]], YAW, { lean: -74 });
    return [h.x, Math.max(h.y, TOP + 0.045), h.z];
  };
  // v3b: planted -> waypoint (lifted beside the hip, above the blanket) -> lap; v3: straight planted -> lap
  // v3c: forward along the side of the thigh (low), then in onto the lap — not swung out to the side
  const via = (side: "L" | "R"): V3 => (c ? [BED_SEAT[0] + 0.18, TOP + 0.15, BED_SEAT[2] + (side === "L" ? 0.25 : -0.25)] : [BED_SEAT[0] + 0.02, TOP + 0.22, BED_SEAT[2] + (side === "L" ? 0.2 : -0.2)]);
  const toLap = (side: "L" | "R"): V3 => {
    const from = mix3(rest(side), plantAt(side), b.plant);
    if (mode === "v3") return mix3(from, lapAt(side), b.hand);
    const h = b.hand;
    return h < 0.5 ? mix3(from, via(side), h * 2) : mix3(via(side), lapAt(side), (h - 0.5) * 2);
  };
  const target = (side: "L" | "R") => toLap(side);
  const arm = (side: "L" | "R") => c1ArmIK({ root, yaw: YAW, body, side, target: target(side), ref: c ? [b.ref[0] + 15, b.ref[1], b.ref[2]] : b.ref, avoidTorso: c });
  return { b, body, root, aL: arm("L"), aR: arm("R") };
};
