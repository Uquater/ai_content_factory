// Debug stills for set defects (2026-11-17): the A01 end camera on the street set with house 7 full / none, tamu lit 0/1.
import React from "react";
import { AbsoluteFill } from "remotion";
import { View } from "../inkbeat/core/View";
import { INK_NIGHT, thin } from "./LookDev";
import { StreetSet } from "./sets";

const MOOD = thin("night", INK_NIGHT, 0.12, 0.2, 0.3, 1.0);
export const SetDebug: React.FC<{ house7: "full" | "none"; tamuLit: number }> = ({ house7, tamuLit }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <View mood={MOOD} cam={{ pos: [-3.2, 4.4, 10.5], look: [2.6, 1.35, 3.0], fov: 40, roll: 0 }} t={2} focus={[2.6, 1.35, 3.0]} blur={0} sky>
      <StreetSet t={2} tamuLit={tamuLit} house7={house7} neighbourDoorsOpen={1} light="local" />
    </View>
  </AbsoluteFill>
);
