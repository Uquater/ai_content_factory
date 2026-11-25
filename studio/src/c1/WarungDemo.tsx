// WarungDemo: a ~12 s technical demo of the 3D pipeline with C1 (lines L1, L10, L11 of script v1.1).
// Text, timing, shot cuts and the reach timing live in demo-plan.json; this file only stages them.
// Every frame is a pure function of the frame number (no randomness, no clocks).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { C1, c1Head } from "./C1";
import PLAN from "./demo-plan.json";
import { reachAt } from "./reach";
import type { ReachScene } from "./reach";
import { Coffee, TABLE_Y, Warung } from "./Warung";
import { C1_SEAT } from "./WarungLook";

export const DEMO_FPS = 30;
export const DEMO_FRAMES = Math.ceil(PLAN.end * DEMO_FPS);

const ease = (x: number) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const camLerp = (a: Cam, b: Cam, u: number): Cam => ({ pos: lerp3(a.pos, b.pos, u), look: lerp3(a.look, b.look, u), fov: lerp(a.fov, b.fov, u) });

/** words with estimated onsets: each line's time is split by letter count (replace with real VO timings later) */
const WORDS: Word[] = PLAN.lines.flatMap((l) => {
  const ws = l.text.split(" ");
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => {
    const a = l.start + ((l.end - l.start) * acc) / total;
    acc += w.length + 1;
    return [w, a, l.start + ((l.end - l.start) * acc) / total] as Word;
  });
});
const LAST_END = PLAN.lines[PLAN.lines.length - 1].end;
const CHUNKS = makeChunks(WORDS, LAST_END + 0.35);

const HEAD = c1Head(C1_SEAT);
const REST: [number, number] = [10, 50];
/** rev1: what the reach needs to know about the set (the table is Warung's <Table p={[0, 0, 0.28]} />, 1.5 x 0.62 m) */
const SCENE: ReachScene = { root: C1_SEAT, tableY: TABLE_Y, cupY: TABLE_Y + 0.004, cupZ: PLAN.reach.cupZ, table: { x0: -0.75, x1: 0.75, z0: -0.03, z1: 0.59 } };

/** camera per shot: a start and an end framing, eased (moves start slowly and settle) */
const shotCam = (id: string, u: number): Cam => {
  if (id === "S1") {
    // establishing, then a push in toward C1 on the second clause
    const a = aim([1.7, 1.6, 3.7], [0, 0.95, -0.6], 50, 0.42);
    const b = aim([1.05, 1.32, 2.6], [0, 0.98, -0.3], 44, 0.42);
    const c = aim([0.55, 1.12, 1.85], HEAD, 38, 0.36);
    return u < 0.36 ? camLerp(a, b, ease(u / 0.36) * 0.6) : camLerp(camLerp(a, b, 0.6), c, ease((u - 0.36) / 0.5));
  }
  if (id === "S2") {
    // low 3/4 from C1's right: the hand, the glass and the empty chair where Tyo will sit
    const a = aim([-0.75, 1.08, 1.85], [-0.2, 0.86, -0.05], 44, 0.45);
    const b = aim([-0.68, 1.06, 1.68], [-0.22, 0.85, -0.05], 43, 0.45);
    return camLerp(a, b, ease(u));
  }
  // S3: a near-frontal close-up for the question to the viewer, a slow push
  const a = aim([0.2, 1.12, 1.75], HEAD, 36, 0.36);
  const b = aim([0.17, 1.12, 1.6], HEAD, 35, 0.36);
  return camLerp(a, b, ease(u));
};

export const WarungDemo: React.FC = () => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const t = f / DEMO_FPS;
  const shot = PLAN.shots.find((s) => t >= s.start && t < s.end) ?? PLAN.shots[PLAN.shots.length - 1];
  const cam = shotCam(shot.id, (t - shot.start) / (shot.end - shot.start));
  const m = moodOf("golden");

  // rev1: the reach is a pure function of t (src/c1/reach.ts): gaze first, hand onto the glass, press, slide with the
  // body following, release, the hand back to its resting spot on the table, the body settling
  const st = reachAt(t, PLAN.reach, SCENE);
  const g = st.head;
  const s3 = shot.id === "S3";

  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={shot.id === "S2" ? st.cup : HEAD} blur={shot.id === "S1" ? 0.8 : 1.4} sky={false}>
        <Warung t={t} />
        <Coffee p={st.cup} t={t} />
        <C1
          position={C1_SEAT}
          yaw={0}
          sitFloor={0}
          t={t}
          face={{ mouth: "smile", look: -st.eyes * (0.6 + 0.4 * st.slide), lookY: st.eyes * 1.7 }}
          faceCamera={cam.pos}
          faceCameraAmount={0}
          threeQuarter={s3 ? 6 : 22}
          pose={{
            armL: st.armL,
            armLFwd: st.armLFwd,
            swivelL: st.swivelL,
            shrugL: st.body.shrug,
            lean: st.body.lean,
            roll: st.body.roll,
            twist: st.body.twist,
            armR: REST,
            armRFwd: 75,
            // the head turns to the glass and follows it; the upper body's own turn and lean are taken out of it
            // from the S2 camera the glass sits between C1 and the lens: the look reads as a nod down plus pupils down
            headYaw: -g * (12 + 8 * st.slide) - st.body.twist,
            headNod: g * 22 - st.body.lean * 0.6,
            headTilt: (s3 ? 5 : 0) + g * 3,
          }}
          hands={{ L: st.hand }}
        />
        <CastLight at={HEAD} cam={cam.pos} mood={m} />
      </View>
      <Captions chunks={CHUNKS} t={t} until={LAST_END + 0.35} />
      <div style={{ position: "absolute", left: 40, top: 48, fontFamily: "Poppins", fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.85)", WebkitTextStroke: "5px rgba(18,10,16,0.8)", paintOrder: "stroke fill" }}>{PLAN.label}</div>
    </AbsoluteFill>
  );
};
