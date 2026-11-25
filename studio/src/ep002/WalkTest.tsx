// Internal walk test (D-027): villagers walk east, slow down, stop in double support and turn their heads toward the
// camera one after another; IBU carries BALITA. Plain floor, day light, side-on camera. Not an episode shot.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { ANAK_WARGA, BAPAK, IBU, WARGA_3 } from "../cast/npc";
import { Walker } from "../cast/Walker";
import type { Gait, WalkPlan } from "../cast/walk";

const E = Math.PI / 2;
export const WALKERS: { key: string; preset?: typeof BAPAK; carry?: boolean; gait: Gait; plan: WalkPlan; look: number }[] = [
  { key: "bapak", preset: BAPAK, gait: { height: BAPAK.height, stride: 1.12, phase: 0.21 }, plan: { t0: 0, from: [-3.2, 0, -0.4], yaw: E, speed: 0.9, tStop: 4.6, decel: 1.2, d0: 0.4 }, look: 4.9 },
  { key: "ibu", carry: true, gait: { height: IBU.height, stride: 0.92, phase: 0.63, bob: 0.005, swing: 10 }, plan: { t0: 0, from: [-4.4, 0, 0.5], yaw: E, speed: 0.7, tStop: 5.0, decel: 1.4, d0: 0.2 }, look: 5.3 },
  { key: "anak", preset: ANAK_WARGA, gait: { height: ANAK_WARGA.height, stride: 0.78, phase: 0.44, lift: 0.04, swing: 20 }, plan: { t0: 0.2, from: [-2.6, 0, 1.3], yaw: E, speed: 0.85, tStop: 4.8, decel: 1.0 }, look: 5.7 },
  { key: "w3", preset: WARGA_3, gait: { height: WARGA_3.height, stride: 1.08, phase: 0.9 }, plan: { t0: 0, from: [-5.6, 0, -1.3], yaw: E, speed: 0.95, tStop: 5.4, decel: 1.3, d0: 0.7 }, look: 6.1 },
];
export const WalkTest: React.FC = () => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#ddd" }} />;
  const t = f / 30;
  const m = moodOf("day");
  const cam = aim([1.2, 0.95, 4.4], [1.2, 0.75, 0], 36, 0.5);
  return (
    <AbsoluteFill style={{ background: "#ddd" }}>
      <View mood={m} cam={cam} t={t} focus={[0, 0.8, 0]} blur={0} sky={false}>
        <M g={boxG(30, 0.1, 20)} c="#cfc8bc" tex="stone" p={[0, -0.05, 0]} />
        <M g={boxG(30, 5, 0.2)} c="#e4e0d8" tex="plaster" p={[0, 2.4, -4]} />
        {WALKERS.map((w) => (
          <Walker key={w.key} preset={w.preset} carry={w.carry} gait={w.gait} plan={w.plan} t={t} look={{ t0: w.look, deg: -65 }} />
        ))}
        <CastLight at={[0, 1.2, 0]} cam={cam.pos} mood={m} />
      </View>
    </AbsoluteFill>
  );
};
