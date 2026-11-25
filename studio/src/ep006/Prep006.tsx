// Episode 5 (2026-11-006) visual PREP stills before voice-over (storyboard v0.1): a grey-box toa room behind the row
// (candidate R2, x 7.0-9.4, z -9.4..-7.3, door in the south wall onto the gang), the console desk on the north wall with a
// monitor wall, a gooseneck mic at Uq's left and a small desk camera at his eye height. Views:
//   ecu   - the desk camera's view, lens 0.30 m from Uq's eyes (inside his reach), fov 70: the stare
//   mcu   - lens 0.80 m from the eyes, fov 60 (option: needs one step forward before the reach)
//   reach - ecu framing, Uq's right hand at the end of the reach (IK pose from tools/e006_prep.ts, lean 5)
//   wide  - the room from the door, both characters, for scale and the monitor wall
// Numbers: tools/e006_prep.ts (_media/2026-11-006/prep/e006_prep.txt). NOT look-dev: grey boxes, no monitor content.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { boxG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { CharLight, charScaled, NIGHT_INT } from "../ep003/LookDev003";
import { H_AD, H_UQ, REST_AD, REST_UQ } from "../ep004/motion004";
import { StreetSet } from "../ep002/sets";
import { moodOf } from "../inkbeat/core/moods";

export const PREP006_VIEWS = ["ecu", "mcu", "reach", "wide", "ecu-lowered", "mcu-lowered", "mcu70", "mcu70-lowered", "ext-a01-000", "ext-a01-050", "ext-a01-075", "ext-a01-100", "ext-a14"] as const;
export type Prep006View = (typeof PREP006_VIEWS)[number];

const ROOM = { x0: 7.0, x1: 9.4, z0: -9.4, z1: -7.3, h: 2.5, t: 0.12 };
const IN = { x0: ROOM.x0 + ROOM.t, x1: ROOM.x1 - ROOM.t, z0: ROOM.z0 + ROOM.t, z1: ROOM.z1 - ROOM.t };
const DESK = { x0: IN.x0 + 0.3, x1: IN.x1 - 0.3, z0: IN.z0, z1: IN.z0 + 0.58, top: 0.75 };
// from e006_prep.txt (C): Uq root for the 0.30 m lens, eye y 1.324, lens on the desk 8 cm behind its front edge
const ROOT_ECU: V3 = [8.2, 0, -8.32];
const LENS: V3 = [8.2, 1.324, -8.78];
const HEAD_Y = 1.324;
const ROOT_MCU: V3 = [8.2, 0, -8.32 + 0.5];
const ROOT_MCU70: V3 = [8.2, 0, -8.32 + 0.4]; // e006_prep E: lens 0.70 m from the eyes, fov 50 (inkbeat close-up 40-50 deg)
const Q_REACH: [number, number, number] = [118.8, 21.2, 100.0];

const Room: React.FC = () => (
  <group>
    <M g={boxG(ROOM.x1 - ROOM.x0, 0.04, ROOM.z1 - ROOM.z0)} c="#5a5650" tex="plaster" p={[(ROOM.x0 + ROOM.x1) / 2, -0.02, (ROOM.z0 + ROOM.z1) / 2]} cast={false} />
    {/* north, west, east walls (the south wall with the door is left out so the wide view can stand in the doorway) */}
    <M g={boxG(ROOM.x1 - ROOM.x0, ROOM.h, ROOM.t)} c="#7a7468" tex="plaster" p={[(ROOM.x0 + ROOM.x1) / 2, ROOM.h / 2, ROOM.z0 + ROOM.t / 2]} cast={false} />
    <M g={boxG(ROOM.t, ROOM.h, ROOM.z1 - ROOM.z0)} c="#7a7468" tex="plaster" p={[ROOM.x0 + ROOM.t / 2, ROOM.h / 2, (ROOM.z0 + ROOM.z1) / 2]} cast={false} />
    <M g={boxG(ROOM.t, ROOM.h, ROOM.z1 - ROOM.z0)} c="#7a7468" tex="plaster" p={[ROOM.x1 - ROOM.t / 2, ROOM.h / 2, (ROOM.z0 + ROOM.z1) / 2]} cast={false} />
    {/* console desk */}
    <M g={boxG(DESK.x1 - DESK.x0, DESK.top, DESK.z1 - DESK.z0)} c="#3a3a40" tex="wood" p={[(DESK.x0 + DESK.x1) / 2, DESK.top / 2, (DESK.z0 + DESK.z1) / 2]} cast={false} />
    {/* monitor wall: 3 x 2 dark-blue glowing panels (no content yet) */}
    {[0, 1, 2].map((i) => [0, 1].map((j) => (
      <mesh key={`${i}-${j}`} position={[IN.x0 + 0.45 + i * 0.63, 1.15 + j * 0.6, IN.z0 + 0.04]}>
        <boxGeometry args={[0.58, 0.52, 0.03]} />
        <meshBasicMaterial color={i === 1 && j === 0 ? "#6a7ab0" : "#3a4a80"} toneMapped={false} />
      </mesh>
    )))}
    {/* gooseneck mic at Uq's left (x - 0.2 because Uq faces north: his left is -x) */}
    <M g={boxG(0.02, 0.4, 0.02)} c="#202020" p={[ROOT_ECU[0] - 0.2, DESK.top + 0.2, DESK.z1 - 0.05]} cast={false} />
    <M g={boxG(0.05, 0.08, 0.05)} c="#151515" p={[ROOT_ECU[0] - 0.2, HEAD_Y - 0.2, -8.48]} cast={false} />
    {/* desk camera: small box on a short stand, lens toward Uq (+z), red LED */}
    <M g={boxG(0.02, LENS[1] - DESK.top - 0.03, 0.02)} c="#202020" p={[LENS[0], (LENS[1] + DESK.top) / 2 - 0.02, LENS[2] - 0.03]} cast={false} />
    <M g={boxG(0.09, 0.06, 0.06)} c="#18181c" p={[LENS[0], LENS[1], LENS[2] - 0.03]} cast={false} />
    <mesh position={[LENS[0], LENS[1], LENS[2] + 0.001]}><circleGeometry args={[0.012, 20]} /><meshBasicMaterial color="#0a0a10" /></mesh>
    <mesh position={[LENS[0] + 0.03, LENS[1] + 0.018, LENS[2] + 0.001]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#ff2a1a" toneMapped={false} /></mesh>
  </group>
);

// exterior check: Ep 1 cameras (AnimaticV3 literals, linear lerp a->b) with R1 (cyan, rejected) and R2 (magenta) as
// flat-colour boxes, to confirm the projection check of tools/e006_prep.ts on rendered frames
const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const A01 = (u: number): Cam => ({ pos: lerp3([-14, 9, 13], [-3.2, 4.4, 10.5], u), look: lerp3([6, 1.5, 3.5], [2.6, 1.35, 3.0], u), fov: 50 + (40 - 50) * u, roll: 0 });
const Flat: React.FC<{ min: V3; max: V3; c: string }> = ({ min, max, c }) => (
  <mesh position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]}>
    <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
    <meshBasicMaterial color={c} toneMapped={false} />
  </mesh>
);
const ExtCheck: React.FC<{ cam: Cam }> = ({ cam }) => (
  <AbsoluteFill>
    <View mood={moodOf("night")} cam={cam} t={2} sky exposure={-0.18}>
      <StreetSet t={2} tamuLit={1} neighbourDoorsOpen={0} house7="full" />
      <Flat min={[16.9, 0, 2.2]} max={[19.3, 2.5, 4.3]} c="#00ffff" />
      <Flat min={[ROOM.x0, 0, ROOM.z0]} max={[ROOM.x1, ROOM.h, ROOM.z1]} c="#ff00ff" />
    </View>
  </AbsoluteFill>
);

export const Prep006: React.FC<{ view: Prep006View }> = ({ view }) => {
  if (view.startsWith("ext-")) {
    const cam = view === "ext-a14" ? { pos: [-14, 9, 13] as V3, look: [3.0, 1.4, 5.0] as V3, fov: 48, roll: 0 } : A01(Number(view.slice(-3)) / 100);
    return (
      <AbsoluteFill>
        <ExtCheck cam={cam} />
        <div style={{ position: "absolute", left: 30, top: 30, fontFamily: "monospace", fontSize: 30, color: "#fff", textShadow: "0 0 6px #000" }}>{`ep006 prep · ${view} · cyan = R1 (pangkal tiang), magenta = R2`}</div>
      </AbsoluteFill>
    );
  }
  const reach = view === "reach";
  const lowered = view.endsWith("-lowered");
  const base = view.replace("-lowered", "");
  const uRoot = base === "mcu" ? ROOT_MCU : base === "mcu70" ? ROOT_MCU70 : ROOT_ECU;
  const eye: V3 = [uRoot[0], HEAD_Y, uRoot[2] - 0.0];
  const cam: Cam =
    base === "wide" ? { pos: [8.2, 1.55, -7.0], look: [8.2, 1.1, -9.2], fov: 62, roll: 0 }
    : base === "mcu" ? { pos: LENS, look: [eye[0], eye[1] - 0.06, eye[2]], fov: 60, roll: 0 }
    : base === "mcu70" ? { pos: LENS, look: [eye[0], eye[1] - 0.06, eye[2]], fov: 50, roll: 0 }
    : { pos: LENS, look: [eye[0], eye[1] - 0.06, eye[2]], fov: 70, roll: 0 };
  const uPose = reach ? { armL: [Q_REACH[0], Q_REACH[1]], armLFwd: Q_REACH[2], lean: 5 } : { armL: [REST_UQ[0], REST_UQ[1]], armLFwd: REST_UQ[2], armR: [REST_UQ[0], REST_UQ[1]], armRFwd: REST_UQ[2] };
  const aRoot: V3 = [7.7, 0, -7.95];
  const chars = [{ root: uRoot, height: H_UQ }, { root: aRoot, height: H_AD }];
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={cam} t={2}>
        <Room />
        <pointLight position={[8.2, 1.4, -8.95]} color="#9ab0ff" intensity={1.6} distance={2.6} decay={2} />
        <C1 look={C1_BODIED} position={uRoot} yaw={Math.PI} t={2} pose={uPose as never} face={{ eyes: "open", brows: lowered ? "lowered" : "worried", mouth: "flat" } as never} />
        <Npc preset={{ ...ADIK_B, accessory: undefined }} position={aRoot} yaw={Math.PI - 0.5} t={2} pose={{ ...(ADIK_B.pose ?? {}), armL: [REST_AD[0], REST_AD[1]], armLFwd: 0, armR: [REST_AD[0], REST_AD[1]], armRFwd: REST_AD[2] } as never} face={{ eyes: "open", brows: "raised", mouth: "flat" } as never} />
        <CharLight chars={chars} cam={cam.pos} mood={charScaled(NIGHT_INT, 0.6)} />
      </View>
      <div style={{ position: "absolute", left: 30, top: 30, fontFamily: "monospace", fontSize: 30, color: "#e8ecff", textShadow: "0 0 6px #000" }}>{`ep006 prep · ${view} (grey box, bukan look-dev)`}</div>
    </AbsoluteFill>
  );
};
