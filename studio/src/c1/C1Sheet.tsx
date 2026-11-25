// C1Sheet: the look-dev sheet for C1 in 3D: frontal, 3/4 and seated on a plain painted floor, one light, one lens.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { C1, c1Head, c1SeatedRoot } from "./C1";
import { Chair } from "./Warung";

export const C1Sheet: React.FC<{ mood?: string }> = ({ mood = "day" }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const t = 1.2 + f / 30;
  const m = moodOf(mood);
  const cam = aim([0, 1.05, 5.2], [0, 0.85, 0], 30, 0.5);
  const seat = c1SeatedRoot([1.2, 0.36, 0.1]);
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={[0, 1.1, 0]} blur={0.3} width={1920} height={1080}>
        <M g={boxG(14, 0.1, 8)} c="#c9b89c" tex="planks" p={[0, -0.05, -1]} />
        <M g={boxG(14, 4, 0.2)} c="#d8c6a6" tex="plaster" p={[0, 2, -2.6]} />
        <C1 position={[-1.2, 0, 0]} yaw={0} t={t} face={{ mouth: "smile" }} faceCamera={cam.pos} threeQuarter={0} faceCameraAmount={1} />
        <C1 position={[0, 0, 0]} yaw={-0.55} t={t + 1} face={{ mouth: "smile" }} faceCamera={cam.pos} pose={{ armR: [12, 8], armL: [10, 10] }} />
        <Chair p={[1.2, 0, 0.0]} yaw={0} />
        <C1 position={seat} yaw={-0.25} sitFloor={0} t={t + 2} face={{ mouth: "smile" }} faceCamera={cam.pos} pose={{ armL: [10, 40], armLFwd: 70, armR: [10, 40], armRFwd: 70 }} />
        <CastLight at={c1Head([0, 0, 0])} cam={cam.pos} mood={m} />
      </View>
    </AbsoluteFill>
  );
};
