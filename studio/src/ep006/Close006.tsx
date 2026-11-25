// Episode 5 (2026-11-006) closing-shot ANIMATIC v0: composition `Close006` (silent; motion in closeMotion006.ts). Grey-box toa
// room with the south wall + door (no sky behind Uq), monitor glow behind the camera as the key, the channel label
// "RUANG TOA" + REC dot, hard cut to black at T.cut, TAMAT. Not look-dev: monitor content, set dressing and the adik are
// left out on purpose (the test is framing, eyes and the reach).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C1 } from "../c1/C1";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { C1_BODIED } from "../ep002/LookDev";
import { CharLight, charScaled, NIGHT_INT } from "../ep003/LookDev003";
import { H_UQ } from "../ep004/motion004";
import { BLINK_SEED, DESK, IN, LENS, MIC, ROOM, ROOT_A, T, uqAt, YAW } from "./closeMotion006";

export const CLOSE006_FRAMES = Math.round(T.end * 30);
const EYE_Y = LENS[1];
export const CLOSE_CAM: Cam = { pos: LENS, look: [ROOT_A[0], EYE_Y - 0.06, ROOT_A[2]], fov: 50, roll: 0 };

const Room006: React.FC = () => {
  const cx = (ROOM.x0 + ROOM.x1) / 2, cz = (ROOM.z0 + ROOM.z1) / 2, w = ROOM.x1 - ROOM.x0, d = ROOM.z1 - ROOM.z0;
  const D = ROOM.door;
  return (
    <group>
      <M g={boxG(w, 0.04, d)} c="#55524c" tex="plaster" p={[cx, -0.02, cz]} cast={false} />
      <M g={boxG(w, 0.04, d)} c="#4a4844" tex="plaster" p={[cx, ROOM.h + 0.02, cz]} cast={false} />
      <M g={boxG(w, ROOM.h, ROOM.t)} c="#77715f" tex="plaster" p={[cx, ROOM.h / 2, ROOM.z0 + ROOM.t / 2]} cast={false} />
      <M g={boxG(ROOM.t, ROOM.h, d)} c="#77715f" tex="plaster" p={[ROOM.x0 + ROOM.t / 2, ROOM.h / 2, cz]} cast={false} />
      <M g={boxG(ROOM.t, ROOM.h, d)} c="#77715f" tex="plaster" p={[ROOM.x1 - ROOM.t / 2, ROOM.h / 2, cz]} cast={false} />
      {/* south wall with the door (closed leaf, dark) */}
      <M g={boxG(D.x0 - ROOM.x0, ROOM.h, ROOM.t)} c="#77715f" tex="plaster" p={[(ROOM.x0 + D.x0) / 2, ROOM.h / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      <M g={boxG(ROOM.x1 - D.x1, ROOM.h, ROOM.t)} c="#77715f" tex="plaster" p={[(D.x1 + ROOM.x1) / 2, ROOM.h / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      <M g={boxG(D.x1 - D.x0, ROOM.h - D.h, ROOM.t)} c="#77715f" tex="plaster" p={[(D.x0 + D.x1) / 2, (ROOM.h + D.h) / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      <M g={boxG(D.x1 - D.x0 - 0.02, D.h, 0.04)} c="#3b2e26" tex="wood" p={[(D.x0 + D.x1) / 2, D.h / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      {/* console desk + gooseneck mic + the desk camera (seen only by the cut; it is the lens we look through) */}
      <M g={boxG(DESK.x1 - DESK.x0, DESK.top, DESK.z1 - DESK.z0)} c="#3a3a40" tex="wood" p={[(DESK.x0 + DESK.x1) / 2, DESK.top / 2, (DESK.z0 + DESK.z1) / 2]} cast={false} />
      <M g={boxG(0.018, MIC[1] - DESK.top, 0.018)} c="#202020" p={[MIC[0], (MIC[1] + DESK.top) / 2, DESK.z1 - 0.06]} cast={false} />
      <M g={boxG(0.018, 0.018, Math.abs(MIC[2] - (DESK.z1 - 0.06)))} c="#202020" p={[MIC[0], MIC[1], (MIC[2] + DESK.z1 - 0.06) / 2]} cast={false} />
      <M g={boxG(0.05, 0.08, 0.05)} c="#151515" p={MIC} cast={false} />
      {/* monitor wall (behind the camera; it lights the room) */}
      {[0, 1, 2].map((i) => [0, 1].map((j) => (
        <mesh key={`${i}-${j}`} position={[IN.x0 + 0.45 + i * 0.63, 1.15 + j * 0.6, IN.z0 + 0.04]}>
          <boxGeometry args={[0.58, 0.52, 0.03]} />
          <meshBasicMaterial color="#3a4a80" toneMapped={false} />
        </mesh>
      )))}
    </group>
  );
};

/** the closing shot's picture at local time t (< T.cut); shared with the full episode (Episode006 S15), so the episode's
 * closing is the approved v0f picture (D-067). Extracted unchanged from Close006 (2026-11-24). */
export const CloseView006: React.FC<{ t: number }> = ({ t }) => {
  const u = uqAt(t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <View mood={NIGHT_INT} cam={CLOSE_CAM} t={t}>
        <Room006 />
        {/* monitor glow: behind the camera, in front of Uq (the only motivated light in the room) */}
        <pointLight position={[8.2, 1.45, -9.05]} color="#9ab0ff" intensity={1.7} distance={2.8} decay={2} />
        <C1 look={C1_BODIED} position={u.root} yaw={YAW} t={t} blinkSeed={BLINK_SEED} pose={u.pose as never} legPose={u.legPose as never} face={{ eyes: "open", brows: "lowered", mouth: "flat" }} />
        <CharLight chars={[{ root: u.root, height: H_UQ }]} cam={CLOSE_CAM.pos} mood={charScaled(NIGHT_INT, 0.6)} />
      </View>
      {/* channel label of the monitor grid (beat 4), kept small in the corner */}
      <div style={{ position: "absolute", left: 48, top: 64, display: "flex", alignItems: "center", gap: 14, fontFamily: "Poppins", fontWeight: 700, fontSize: 34, color: "rgba(255,255,255,0.85)", textShadow: "0 0 6px #000" }}>
        <span style={{ width: 20, height: 20, borderRadius: 10, background: "#ff2a1a", display: "inline-block" }} />
        RUANG TOA
      </div>
    </AbsoluteFill>
  );
};

export const Close006: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ready = useFonts();
  const t = frame / fps;
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;
  if (t >= T.cut) {
    const k = Math.min(1, Math.max(0, (t - T.tamatIn) / (T.tamatFull - T.tamatIn)));
    return (
      <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: k, fontFamily: "Poppins", fontWeight: 800, fontSize: 120, letterSpacing: 12, color: "#ffffff" }}>TAMAT</div>
      </AbsoluteFill>
    );
  }
  return <CloseView006 t={t} />;
};
