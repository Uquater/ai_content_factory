// Episode 2026-11-002 — pilot revision v3, A02–A04 only (C1 wakes, sits up, realises the announcement is his voice).
// 2026-11-17, owner priorities: 1 consistent character shape across shots/angles/poses, 2 natural motion and reaction,
// 3 story clarity; set/light/effects are later polish. Approved design (D-031): bodied limbs + pants, thin ink.
// What changed against Pilot.tsx (v2, kept unchanged and reproducible):
//   - one lens family (28–32°) from 1.6–2.4 m, so the head/torso ratio stays the same in every shot; the camera
//     stands beyond the bedroom's east wall (wild wall) instead of 0.6 m in front of C1 with a wide lens;
//   - the sit-up has support and weight: hands planted on the mattress by IK on C1's own rig (c1/bodyIk.ts), head leads,
//     the torso rises over ~0.5 s with a small forward overshoot, the body settles (dip) and the hands come to the lap;
//   - the character silhouette reads again: the character rim light is back at full strength (it was cut to 0.3);
//   - the blanket is one slab with a rolled top edge that slides back as he sits up (no cloth simulation);
//   - C1 never lip-syncs the narrator: the mouth changes once, in a pause, and holds.
// Every value is a pure function of the frame (Remotion interpolate + Easing).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import type { C1Props, StickLook } from "../c1/C1";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, cylG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { C1_BODIED, INK_NIGHT, thin } from "./LookDev";
import { CaptionsHL } from "./overlay";
import { HouseInterior } from "./sets";
import { BED_SEAT, flatLegs, k, mix, mix3, poseAt, S, SHOTS, TOP, V3_FPS, YAW } from "./v3motion";
import type { ArmMode, Id } from "./v3motion";

export { V3_FPS };

/** the cut covers episode frames [F0, F1): A02's first frame to A05's first frame (same timing as the v1/v2 pilots) */
export const V3_F0 = Math.round(SHOTS[0].start * V3_FPS);
const F1 = Math.round(SHOTS[SHOTS.length - 1].end * V3_FPS);
export const V3_FRAMES = F1 - V3_F0;

// ------------------------------------------------------------------ look, light
const C1_BED: StickLook = { ...C1_BODIED, id: "C1-bodied-bed", limbs: { ...C1_BODIED.limbs!, feet: "bare" } };
/** night interior; the character rim (cast) back at 1.0 so the dark tee separates from the dark wall */
export const NIGHT_INT = thin("night", INK_NIGHT, 0.05, 0, 0.12, 1.0);

/** v3b = the episode version (2026-11-17): smooth hand-to-lap path; the reviewed v3 cut uses v3b = false */
/** arms: "v3c" (2026-11-17) = the arms stay outside the body (IK with torso avoidance; hands rest beside the hips and
 * push from there); overrides v3b */
export const BedC1: React.FC<{ t: number; v3b?: boolean; arms?: ArmMode }> = ({ t, v3b = false, arms }) => {
  const { b, root, aL, aR } = poseAt(t, arms ?? v3b);
  const pose: NonNullable<C1Props["pose"]> = { lean: b.lean, bob: b.bob, armL: aL.arm, armLFwd: aL.fwd, armR: aR.arm, armRFwd: aR.fwd, headYaw: b.headYaw, headNod: b.headNod };
  // blanket: one slab over the legs with a rolled top edge; the edge slides back toward the knees as he sits up
  const x0 = mix(BED_SEAT[0] - 0.06, BED_SEAT[0] + 0.16, b.fold);
  const x1 = Math.min(BED_SEAT[0] + 0.86, 3.86); // stops at the footboard
  return (
    <group>
      <C1 look={C1_BED} position={root} yaw={YAW} t={t} legPose={{ L: flatLegs(-1), R: flatLegs(1) }} face={b.face} pose={pose} />
      {/* the knees sit at 0.62 m (mattress top 0.50): the slab top at TOP + 0.14 covers the legs without a visible bump */}
      <M g={boxG(x1 - x0, 0.08, 0.76)} c="#4f5f8a" tex="fabric" p={[(x0 + x1) / 2, TOP + 0.1, BED_SEAT[2]]} />
      <M g={cylG(0.06, 0.06, 0.78, 16)} c="#5a6a96" tex="fabric" p={[x0 + 0.01, TOP + 0.12, BED_SEAT[2]]} r={[Math.PI / 2, 0, 0]} />
    </group>
  );
};

const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const camMix = (a: Cam, b: Cam, u: number): Cam => ({ pos: mix3(a.pos, b.pos, u), look: mix3(a.look, b.look, u), fov: mix(a.fov, b.fov, u), roll: 0 });

// ------------------------------------------------------------------ cameras (one lens family, 28–32°)
const HEAD_LYING: V3 = [BED_SEAT[0] - 0.74, TOP + 0.2, BED_SEAT[2]];
/** v3b: A04 framed lower in the frame (look target 0.14 m lower) so the chest and "Uq" sit above the caption band and the
 * face near 27 % of the height; the reviewed v3 cut uses v3b = false */
export const camAt = (id: Id, t: number, v3b = false): Cam => {
  const s = S(id);
  const u = (t - s.start) / (s.end - s.start);
  if (id === "a02") {
    // beside the bed, low at pillow height (storyboard), close/medium; a barely perceptible drift
    return camMix(cam([2.78, 1.0, 2.62], HEAD_LYING, 30), cam([2.75, 1.0, 2.5], HEAD_LYING, 30), k(t, s.start, s.end, Easing.linear));
  }
  if (id === "a03") {
    // medium 3/4 from the foot end and his right side (beyond the wild east wall): the planted right hand reads;
    // the camera rises with him (storyboard)
    const rise = k(t, s.start + 0.2, s.start + 0.85, Easing.bezier(0.35, 0, 0.3, 1));
    return camMix(cam([5.1, 1.2, 1.95], [2.75, 0.62, -0.47], 30), cam([5.1, 1.4, 1.9], [3.05, 0.86, -0.47], 30), rise);
  }
  // A04: close/medium 3/4 from the north-east (face + "Uq" visible, he looks toward screen left = the window); slow push
  void u;
  const dy = v3b ? -0.14 : 0;
  return camMix(cam([5.45, 1.38, -0.9], [3.1, 1.1 + dy, -0.42], 30), cam([5.25, 1.37, -0.88], [3.1, 1.11 + dy, -0.42], 30), k(t, s.start, s.end, Easing.bezier(0.3, 0, 0.7, 1)));
};

const ShotView: React.FC<{ id: Id; from: number }> = ({ id, from }) => {
  const f = useCurrentFrame();
  const t = (V3_F0 + from + f) / V3_FPS;
  const c = camAt(id, t);
  const head: V3 = id === "a02" ? HEAD_LYING : [BED_SEAT[0], 1.2, -0.47];
  return (
    <View mood={NIGHT_INT} cam={c} t={t} focus={head} blur={0.4} sky={false}>
      <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.3} dressing kamarDoorOpen={0.25} wild={id === "a02" ? undefined : "east"} />
      <BedC1 t={t} />
      <CastLight at={head} cam={c.pos} mood={NIGHT_INT} />
    </View>
  );
};

const CaptionLayer: React.FC = () => {
  const f = useCurrentFrame();
  return <CaptionsHL t={(V3_F0 + f) / V3_FPS} />;
};

/** A02–A04, 341 frames; frame 0 = episode frame 143 (4.77 s) */
export const PilotV3: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {SHOTS.map((s) => {
        const from = Math.round(s.start * V3_FPS) - V3_F0;
        const to = Math.round(s.end * V3_FPS) - V3_F0;
        return (
          <Sequence key={s.id} name={s.id.toUpperCase()} from={from} durationInFrames={to - from}>
            <ShotView id={s.id as Id} from={from} />
          </Sequence>
        );
      })}
      <CaptionLayer />
    </AbsoluteFill>
  );
};
