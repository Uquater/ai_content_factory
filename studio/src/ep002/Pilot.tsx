// Episode 2026-11-002 — PILOT, the first 15 s (A01–A04, L1–L5), D-031 (STUDIO-WORKFLOW S7).
// Bodied characters + thin ink (approved design, D-031), local night light (sets.tsx light="local"), set dressing.
// Remotion structure (remotion-markup): one <Sequence> per shot on frame boundaries from the plan, the shot reads its
// own useCurrentFrame() and maps it back to episode time; captions are a separate layer with their own frame
// subscription. Cameras and acting are interpolate() + Easing curves of that time: a pure function of the frame.
// Audio (approved VO v2 + the D-025 toa repeat, plus synthesised ambience / SFX / music) is muxed after the render.
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { C1, c1SeatedRoot } from "../c1/C1";
import type { C1Props } from "../c1/C1";
import type { C1Face, StickLook } from "../c1/C1";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { boxG, M } from "../inkbeat/core/kit";
import { KAMAR } from "./geo";
import { C1_BODIED, INK_NIGHT, thin } from "./LookDev";
import { CaptionsHL } from "./overlay";
import PLAN from "./plan-2026-11-002.json";
import { HouseInterior, StreetSet } from "./sets";

export const PILOT_FPS = 30;
const SHOT_IDS = ["a01", "a02", "a03", "a04"] as const;
type ShotId = (typeof SHOT_IDS)[number];
const SHOTS = (PLAN.shots as { id: string; start: number; end: number }[]).filter((s) => (SHOT_IDS as readonly string[]).includes(s.id));
const END = SHOTS[SHOTS.length - 1].end; // 16.15 s, where A05 starts
export const PILOT_FRAMES = Math.round(END * PILOT_FPS);
const L = (id: string) => PLAN.lines.find((l) => l.id === id)!;

// ------------------------------------------------------------------ looks and light
/** C1 in bed: the approved bodied look, bare feet */
const C1_BED: StickLook = { ...C1_BODIED, id: "C1-bodied-bed", limbs: { ...C1_BODIED.limbs!, feet: "bare" } };
const NIGHT_INT = thin("night", INK_NIGHT, 0.05, 0, 0.12, 0.3);
const NIGHT_EXT = thin("night", INK_NIGHT, 0.12, 0.2, 0.3);

// ------------------------------------------------------------------ time helpers (Remotion interpolate + Easing)
/** a symmetric ease-in-out for camera moves (inkbeat: moves ease in and out) */
const IO = Easing.bezier(0.45, 0, 0.25, 1);
const k = (t: number, a: number, b: number, easing = IO) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const camMix = (a: Cam, b: Cam, u: number): Cam => ({ pos: mix3(a.pos, b.pos, u), look: mix3(a.look, b.look, u), fov: mix(a.fov, b.fov, u), roll: 0 });

// ------------------------------------------------------------------ C1 in bed (head west on the pillow, sits up facing east)
const BED_SEAT: V3 = [3.3, KAMAR.bed.top, (KAMAR.bed.z0 + KAMAR.bed.z1) / 2];
const flatLegs = (s: 1 | -1) => ({ ankle: [s * 0.05, 0.411, 0.38] as V3, knee: [s * 0.05, 0.47, 0.19] as V3 });
type BedPose = { up: number; face: C1Face; headYaw?: number; headNod?: number; lean?: number; arms?: { armL?: [number, number]; armR?: [number, number] }; extra?: Partial<NonNullable<C1Props["pose"]>>; hands?: C1Props["hands"]; t: number };
const BedC1: React.FC<BedPose> = ({ up, face, headYaw = 0, headNod = 0, lean = 0, arms, extra, hands, t }) => {
  const seat: V3 = [BED_SEAT[0], BED_SEAT[1] + 0.05 * (1 - Math.min(1, up)), BED_SEAT[2]];
  const root = c1SeatedRoot(seat);
  return (
    <group>
      <C1
        look={C1_BED}
        position={root}
        yaw={Math.PI / 2}
        t={t}
        legPose={{ L: flatLegs(-1), R: flatLegs(1) }}
        hands={hands}
        face={face}
        pose={{ lean: -80 * (1 - up) + lean, armL: arms?.armL ?? [8, 6], armR: arms?.armR ?? [8, 6], headYaw, headNod: 10 * (1 - Math.min(1, up)) + headNod, ...(extra ?? {}) }}
      />
      {/* the blanket over the legs (stays when C1 sits up); taller than the animatic's, it covers the bodied legs */}
      <M g={boxG(0.82, 0.13, 0.66)} c="#4f5f8a" tex="fabric" p={[BED_SEAT[0] + 0.4, KAMAR.bed.top + 0.085, BED_SEAT[2]]} />
      <M g={boxG(0.16, 0.15, 0.68)} c="#46557e" tex="fabric" p={[BED_SEAT[0] + 0.04, KAMAR.bed.top + 0.08, BED_SEAT[2]]} />
    </group>
  );
};

// ------------------------------------------------------------------ the shots
type Staged = { cam: Cam; ext: boolean; body: React.ReactNode; light: V3; blur: number };
const stage = (id: ShotId, t: number): Staged => {
  switch (id) {
    // A01 — high wide across the kompleks at 2 a.m., one continuous push toward house 7's dark bedroom window (L1)
    case "a01": {
      const s = SHOTS[0];
      const u = k(t, s.start, s.end, Easing.bezier(0.33, 0, 0.2, 1));
      return { cam: camMix(cam([-14, 9, 13], [6, 1.5, 3.5], 50), cam([-3.2, 4.4, 10.5], [2.6, 1.35, 3.0], 40), u), ext: true, body: null, light: [2.6, 1.5, 3], blur: 0.4 };
    }
    // A02 — from above the pillow: C1 asleep; the announcement (L2) opens his eyes; he listens (slow push in)
    case "a02": {
      const s = SHOTS[1];
      const l2 = L("L2");
      const push = k(t, s.start, s.end, Easing.bezier(0.3, 0, 0.5, 1));
      const c0 = cam([3.45, 2.2, 0.05], [2.58, 0.66, -0.47], 44);
      const c1 = cam([3.2, 1.86, -0.12], [2.56, 0.68, -0.47], 40);
      const open = t > l2.start + 0.35;
      const listen = k(t, l2.start + 0.5, l2.start + 1.3);
      return {
        cam: camMix(c0, c1, push),
        ext: false,
        body: <BedC1 t={t} up={0} face={{ eyes: open ? "open" : "closed", mouth: "flat", brows: listen > 0.5 ? "raised" : "neutral", look: -0.6 * listen }} headYaw={-28 * listen} headNod={-4 * listen} />,
        light: [2.45, 0.85, -0.47],
        blur: 1.0,
      };
    }
    // A03 — he sits up abruptly: a short anticipation (head and shoulders sink), a fast rise with a small forward
    // overshoot, a settle; the camera rises with him (L3)
    case "a03": {
      const s = SHOTS[2];
      const up = interpolate(t, [s.start, s.start + 0.14, s.start + 0.46, s.start + 0.72], [0, -0.035, 1.07, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: [Easing.bezier(0.4, 0, 0.6, 1), Easing.bezier(0.25, 0.9, 0.35, 1), Easing.bezier(0.4, 0, 0.3, 1)],
      });
      const camUp = k(t, s.start + 0.1, s.start + 0.62, Easing.bezier(0.3, 0.6, 0.35, 1));
      const drift = k(t, s.start + 0.62, s.end, Easing.linear);
      const c0 = cam([3.88, 1.02, 0.95], [2.9, 0.78, -0.47], 54);
      const c1 = cam([3.88, 1.2, 0.92], [3.2, 1.06, -0.47], 50);
      const c2 = cam([3.86, 1.21, 0.82], [3.22, 1.08, -0.47], 48);
      const arms: [number, number] = [mix(8, -6, k(t, s.start + 0.1, s.start + 0.4)) + mix(0, 20, k(t, s.start + 0.5, s.start + 0.9)), mix(6, 2, k(t, s.start, s.start + 0.6))];
      return {
        cam: drift > 0 ? camMix(c1, c2, drift) : camMix(c0, c1, camUp),
        ext: false,
        body: <BedC1 t={t} up={up} face={{ eyes: "open", mouth: up > 0.6 && t < s.start + 1.0 ? "open" : "flat", brows: "raised", look: -0.6 }} headYaw={-34 * k(t, s.start + 0.2, s.start + 0.7)} arms={{ armL: arms, armR: arms }} />,
        light: [3.0, 1.1, -0.2],
        blur: 1.0,
      };
    }
    // A04 — frozen, eyes on the window (L4 "Itu suaramu."): a small lean toward it; on L5 the brows knit, the breath
    // gets short ("cara menarik napas"), the head sinks a little; a slow arc in (~3 %/s)
    case "a04": {
      const s = SHOTS[3];
      const l4 = L("L4");
      const l5 = L("L5");
      const look = k(t, s.start, s.start + 0.55);
      const lean = 4 * k(t, l4.start, l4.end);
      const worried = t > l5.start + 0.6;
      const push = k(t, s.start, s.end, Easing.bezier(0.3, 0, 0.7, 1));
      // a slow arc around him (not a straight dolly), so the long hold keeps moving
      const arc = push * 0.32;
      // polar around his seat: radius 1.37 -> 1.2 m, angle 1.1 -> 1.3 rad (toward where he looks, away from the east wall)
      const r = mix(1.37, 1.2, push);
      const a = 1.1 + 0.62 * arc;
      const c0 = cam([3.28 + r * Math.cos(a), 1.3, -0.47 + r * Math.sin(a)], [3.28, 1.08, -0.47], 40);
      const c1 = cam([3.28 + r * Math.cos(a), 1.29, -0.47 + r * Math.sin(a)], [3.28, 1.1, -0.47], 37);
      // breathing: slow before, short and quick after "cara menarik napas"
      const fast = k(t, l5.start + 1.4, l5.start + 2.2);
      const bob = Math.sin(t * Math.PI * 2 * mix(0.3, 0.9, fast)) * mix(1.2, 2.6, fast);
      return {
        cam: camMix(c0, c1, push),
        ext: false,
        body: (
          <BedC1
            t={t}
            up={1}
            lean={lean}
            face={{ eyes: "open", mouth: worried ? "open" : "flat", brows: worried ? "worried" : "raised", look: -0.8 }}
            headYaw={-34 - 8 * look}
            headNod={-4 * k(t, l5.start + 2.6, l5.start + 3.4)}
            arms={{ armR: [8, 6] }}
            // the hand-to-throat gesture (IK) was tried and dropped: from this camera the hand sank into the torso and
            // inked through the tee (2026-11-16 test stills). Kept: short breaths, brows, mouth, the lean.
            extra={{ bob }}
          />
        ),
        light: [3.4, 1.3, 0.0],
        blur: 1.4,
      };
    }
  }
};

/** SUB = 4 sub-frames per output frame for motion blur (Pilot002Sub at 120 fps): sub-frame k of output frame n is
 * sampled at (n + ((k + 0.5) / 4) * 0.5 - 0.25) / 30 s — four samples across a 180-degree shutter centred on the frame
 * (inkbeat-shorts render-and-qa.md); the frames are averaged with ffmpeg tmix afterwards. */
export const SUB = 4;
const timeOf = (g: number, sub: boolean) => {
  if (!sub) return g / PILOT_FPS;
  const n = Math.floor(g / SUB);
  const kk = g % SUB;
  return (n + ((kk + 0.5) / SUB) * 0.5 - 0.25) / PILOT_FPS;
};
const ShotView: React.FC<{ id: ShotId; from: number; sub: boolean }> = ({ id, from, sub }) => {
  const f = useCurrentFrame();
  const t = timeOf(from + f, sub);
  const st = stage(id, t);
  const mood = st.ext ? NIGHT_EXT : NIGHT_INT;
  return (
    <View mood={mood} cam={st.cam} t={t} focus={st.cam.look} blur={st.blur} sky={st.ext}>
      {st.ext ? (
        <StreetSet t={t} tamuLit={0} kamarLit={0} neighbourDoorsOpen={0} house7="full" light="local" />
      ) : (
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.3} dressing kamarDoorOpen={0.25} />
      )}
      {st.body}
      <CastLight at={st.light} cam={st.cam.pos} mood={mood} />
    </View>
  );
};

/** captions in their own layer, subscribed to the frame on their own (remotion-markup: smallest component) */
const CaptionLayer: React.FC<{ sub: boolean }> = ({ sub }) => {
  const f = useCurrentFrame();
  // captions are keyed to the output frame, so they stay sharp under motion blur
  const n = sub ? Math.floor(f / SUB) : f;
  return <CaptionsHL t={n / PILOT_FPS} />;
};

export const Pilot002: React.FC<{ sub?: boolean }> = ({ sub = false }) => {
  const ready = useFonts();
  const m = sub ? SUB : 1;
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {SHOTS.map((s) => {
        // shot boundaries on output frames (x SUB in the sub-frame composition), so cuts never fall inside a blur
        const from = Math.round(s.start * PILOT_FPS) * m;
        const to = Math.min(Math.round(s.end * PILOT_FPS), PILOT_FRAMES) * m;
        return (
          <Sequence key={s.id} name={s.id.toUpperCase()} from={from} durationInFrames={to - from}>
            <ShotView id={s.id as ShotId} from={from} sub={sub} />
          </Sequence>
        );
      })}
      <CaptionLayer sub={sub} />
    </AbsoluteFill>
  );
};
