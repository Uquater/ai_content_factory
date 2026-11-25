// 2026-11-17: all 2026-11-002 characters in the bodied design (castV3.ts) in the same night street light, one lens
// family (30°) — an identity check before the full animatic v3. Also the carry (mom + toddler) from the front and side.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { IbuGendong } from "../cast/carry";
import { Npc } from "../cast/npc";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { ADIK_B, ANAK_B, BAPAK_B, CARRY_B, W3_B, W4_B, W5_B } from "./castV3";
import { C1_BODIED, INK_NIGHT, thin } from "./LookDev";
import { STREET } from "./geo";
import { StreetSet } from "./sets";

const MOOD = thin("night", INK_NIGHT, 0.12, 0.2, 0.3, 1.0);
export const CastV3Lineup: React.FC<{ view: "front" | "carry" }> = ({ view }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#0c0e1c" }} />;
  const z = STREET.walkZ;
  const cam: Cam = view === "front" ? { pos: [0.5, 1.25, z + 8.0], look: [0.5, 0.82, z], fov: 22, roll: 0 } : { pos: [2.6, 1.15, z + 3.4], look: [0.0, 0.85, z], fov: 30, roll: 0 };
  const xs = [-2.7, -1.75, -0.85, 0.1, 1.0, 1.9, 2.8, 3.7];
  const t = 2;
  const S = 0; // facing +z (the camera)
  return (
    <AbsoluteFill style={{ background: "#0c0e1c" }}>
      <View mood={MOOD} cam={cam} t={t} focus={cam.look} blur={0} sky width={view === "front" ? 1920 : 1080} height={view === "front" ? 1080 : 1920}>
        <StreetSet t={t} tamuLit={0} neighbourDoorsOpen={1} house7="full" light="local" />
        {view === "front" ? (
          <>
            <C1 look={C1_BODIED} position={[xs[0], 0, z]} yaw={S + 0.25} t={t} face={{ mouth: "flat" }} />
            <Npc preset={ADIK_B} position={[xs[1], 0, z]} yaw={S + 0.2} t={t} />
            <Npc preset={BAPAK_B} position={[xs[2], 0, z]} yaw={S} t={t} />
            <IbuGendong position={[xs[3] + 0.2, 0, z]} yaw={S - 0.35} t={t} mom={CARRY_B.mom} kid={CARRY_B.kid} />
            <Npc preset={ANAK_B} position={[xs[5], 0, z]} yaw={S} t={t} />
            <Npc preset={W3_B} position={[xs[6] - 0.1, 0, z]} yaw={S - 0.15} t={t} />
            <Npc preset={W4_B} position={[xs[7] - 0.1, 0, z]} yaw={S - 0.25} t={t} />
            <Npc preset={W5_B} position={[xs[4] + 0.25, 0, z - 0.9]} yaw={S} t={t} />
          </>
        ) : (
          <IbuGendong position={[0, 0, z]} yaw={Math.PI / 2 - 0.5} t={t} mom={CARRY_B.mom} kid={CARRY_B.kid} />
        )}
        <CastLight at={[0.4, 1.2, z]} cam={cam.pos} mood={MOOD} />
      </View>
      <div style={{ position: "absolute", left: 30, top: 30, fontFamily: "Poppins", fontWeight: 800, fontSize: 30, color: "#e8ecff", textShadow: "0 0 8px #000" }}>{`cast v3 (bertubuh) · ${view}`}</div>
    </AbsoluteFill>
  );
};
