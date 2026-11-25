// WarungLook: look-dev stills of the warung set with C1 seated at the table (vertical 1080x1920).
// variant "wide" = establishing, "medium" = C1 at the table, "reach" = C1's hand on the coffee glass (IK).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { solveArm } from "../inkbeat/core/ik";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { C1, C1_BUILD, C1_HEIGHT, c1Head, c1SeatedRoot } from "./C1";
import { Coffee, SEAT_Y, TABLE_Y, Warung } from "./Warung";

export const C1_SEAT = c1SeatedRoot([0, SEAT_Y, -0.18]);
/** the coffee in front of C1, a little to C1's right (-x), where the right hand reaches it */
export const CUP_NEAR: V3 = [-0.22, TABLE_Y + 0.004, 0.2];

export const WarungLook: React.FC<{ mood?: string; variant?: "wide" | "medium" | "reach" }> = ({ mood = "golden", variant = "medium" }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const t = 1.0 + f / 30;
  const m = moodOf(mood);
  const head = c1Head(C1_SEAT);
  const cam =
    variant === "wide" ? aim([1.6, 1.55, 3.6], [0, 0.95, -0.6], 50, 0.42) : variant === "reach" ? aim([-0.55, 1.05, 1.55], [-0.12, 0.8, 0.0], 40, 0.45) : aim([0.55, 1.12, 1.9], head, 38, 0.36);
  const reach = variant === "reach";
  // C1's right arm is the "R" chain (+x)... C1 faces +z, so its right hand is on -x
  const a = solveArm({ position: C1_SEAT, yaw: 0, side: "L", target: [CUP_NEAR[0] + 0.045, CUP_NEAR[1] + 0.05, CUP_NEAR[2]], height: C1_HEIGHT, build: C1_BUILD });
  const pose = reach ? { armL: a.arm, armLFwd: a.fwd } : { armL: [10, 50] as [number, number], armLFwd: 75, armR: [10, 50] as [number, number], armRFwd: 75 };
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={reach ? CUP_NEAR : head} blur={variant === "wide" ? 0.6 : 1.4} sky={false}>
        <Warung t={t} />
        <Coffee p={CUP_NEAR} t={t} />
        <C1 position={C1_SEAT} yaw={0} sitFloor={0} t={t} face={{ mouth: "smile" }} faceCamera={cam.pos} faceCameraAmount={reach ? 0 : 0.3} pose={pose} />
        <CastLight at={head} cam={cam.pos} mood={m} />
      </View>
    </AbsoluteFill>
  );
};
