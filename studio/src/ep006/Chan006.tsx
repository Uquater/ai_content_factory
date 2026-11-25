// Episode 5 (2026-11-006): stills that the episode SHOWS as pictures (rendered once, saved to studio/public/ep006/):
//   ch_<id>.png  the CCTV channels on the toa-room monitors (from the hidden cameras of Ep 3-4: kitchen D, hallway L,
//                bedroom K; a high street camera; a neighbour's living room watching a screen; the desk camera of the toa
//                room). The living-room channel is DARK (its lens is taped, Ep 4); the bathroom has NO channel (D-064).
//   proof.png    the guard's photo (S03): the back door of house 7 from the gang, the key with its "RUANG TOA" tag in a
//                gloved hand in front of it (D-066 decision 4: photo of the key at the back door + one message).
// Render: npm run stills:ep006 (refuses to overwrite: each still goes to a new name, then cp -n into public/ep006).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B, BAPAK_B, IBU_B, W3_B, W4_B, W5_B, W6_B, W7_B, W8_B, W10_B, ANAK_B } from "../ep002/castV3";
import { C1_BODIED, INK_NIGHT, thin } from "../ep002/LookDev";
import { HouseInterior, StreetSet } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT } from "../ep003/LookDev003";
import { HiddenCam } from "../ep004/LookDev004";
import { H_AD, H_UQ, REST_AD, REST_UQ } from "../ep004/motion004";
import { GANG, GangSet, GuardHand, KeyTag, ToaRoom } from "./sets006";
import { ROOT_A } from "./closeMotion006";

export const CHAN006_VIEWS = ["dapur", "lorong", "kamar", "tamu", "jalan", "tetangga", "ruangtoa", "proof"] as const;
export type Chan006View = (typeof CHAN006_VIEWS)[number];
export const NIGHT_EXT6 = thin("night", INK_NIGHT, 0.12, 0.2, 0.3, 1.0); // = Ep 1/4 exterior mood
const yawTo = (a: V3, b: V3) => Math.atan2(b[0] - a[0], b[2] - a[2]);
/** standing villagers facing the front of house 7 (shared with the episode: S06b, S13, the street channel) */
export type Stand = { key: string; preset: NpcPreset; at: V3 };
export const STAND6: Stand[] = [
  { key: "v1", preset: BAPAK_B, at: [-1.35, 0, 4.85] },
  { key: "v2", preset: W3_B, at: [-0.45, 0, 5.2] },
  { key: "v3", preset: W4_B, at: [-2.0, 0, 5.9] },
  { key: "v4", preset: W5_B, at: [-0.95, 0, 6.3] },
  { key: "v5", preset: W6_B, at: [0.1, 0, 6.6] },
  { key: "v6", preset: ANAK_B, at: [-1.6, 0, 6.9] },
  { key: "v7", preset: W7_B, at: [-2.6, 0, 7.6] },
  { key: "v8", preset: W10_B, at: [-0.2, 0, 7.9] },
  { key: "v9", preset: W8_B, at: [-1.25, 0, 8.6] },
  // further east on the street: seen through the gap between house 7 and house 9 (S06b)
  { key: "e1", preset: IBU_B, at: [4.2, 0, 6.1] },
  { key: "e2", preset: W5_B, at: [4.9, 0, 6.9] },
  { key: "e3", preset: W3_B, at: [3.6, 0, 7.6] },
];
export const HOUSE_FRONT: V3 = [-1.6, 1.2, 3.0];
export const AD_ROOM: V3 = [8.85, 0, -7.66]; // adik in the toa room: east of the door, out of the desk camera's frame
const AD_PRESET = { ...ADIK_B, accessory: undefined };

const CAMS6: Record<Chan006View, Cam> = {
  // run 2: the hidden-camera positions looked into walls/ceilings; these are the proven episode lenses, raised to a
  // ceiling-corner height and widened (a CCTV view of the same rooms)
  dapur: { pos: [-3.6, 2.4, -3.45], look: [0.6, 0.75, -4.4], fov: 70, roll: 0 },
  lorong: { pos: [-0.8, 2.45, -1.15], look: [-0.8, 0.55, -4.6], fov: 72, roll: 0 },
  kamar: { pos: [3.8, 2.4, 2.6], look: [1.9, 0.55, -0.6], fov: 72, roll: 0 },
  tamu: { pos: [0.85, 2.6, 2.85], look: [-1.5, 0.8, 0.5], fov: 75, roll: 0 },
  jalan: { pos: [2.6, 3.6, 9.6], look: [-1.0, 0.8, 6.0], fov: 62, roll: 0 },
  tetangga: { pos: [-0.2, 2.2, 2.55], look: [-3.0, 0.95, 1.2], fov: 100, roll: 0 },
  ruangtoa: { pos: [8.2, 1.55, -8.95], look: [8.35, 1.0, -7.75], fov: 100, roll: 0 },
  proof: { pos: [-1.0, 1.25, -7.05], look: [-0.86, 1.2, -5.0], fov: 55, roll: 0 },
};

export const Chan006: React.FC<{ view: Chan006View }> = ({ view }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;
  const c = CAMS6[view];
  const t = 2;
  if (view === "tamu") return <AbsoluteFill style={{ background: "#08080a" }} />; // taped lens: the overlay draws noise + label
  const ext = view === "jalan" || view === "proof";
  const mood = ext ? NIGHT_EXT6 : NIGHT_INT;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={mood} cam={c} t={t} blur={0} sky={ext} exposure={view === "proof" ? -0.2 : view === "tetangga" ? 0.5 : view === "ruangtoa" ? 0.4 : -0.1}>
        {view === "ruangtoa" ? null : <HouseInterior tamuLamp={view === "tetangga" ? 0.18 : 0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} noFan bathDoor={0} windowGlass={ext ? "clear" : "opaque"} />}
        {ext ? <StreetSet t={t} tamuLit={0} house7="none" neighbourDoorsOpen={1} light="local" dense /> : null}
        {view === "proof" ? <><GangSet ledOn={1} /><GuardHand p={[-0.97, 1.16, -6.2]} yaw={-Math.PI / 2 + 0.7} pitch={0.05} keyIn={false} /><group scale={1.7}><KeyTag p={[-0.88 / 1.7, 1.21 / 1.7, -6.1 / 1.7]} r={[0, Math.PI, 0.2]} /></group></> : null}
        {view === "jalan" ? STAND6.map((s) => <Npc key={s.key} preset={s.preset} position={s.at} yaw={yawTo(s.at, HOUSE_FRONT)} t={t} face={{ mouth: "flat", eyes: "open" }} />) : null}
        {view === "jalan" ? <CastLight at={[-1.0, 1.3, 6.2]} cam={c.pos} mood={NIGHT_EXT6} /> : null}
        {view === "tetangga" ? (
          <>
            {/* a family in the neighbour's living room, standing close to a glowing screen on the west wall */}
            <M g={boxG(0.06, 0.62, 1.05)} c="#111114" tex="metal" p={[-3.85, 1.15, 1.2]} cast={false} />
            <mesh position={[-3.815, 1.15, 1.2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.98, 0.56]} /><meshBasicMaterial color="#8fb0ff" toneMapped={false} /></mesh>
            <pointLight position={[-3.4, 1.2, 1.2]} color="#9ab8ff" intensity={4} distance={3.5} decay={2} />
            <Npc preset={IBU_B} position={[-2.6, 0, 1.0]} yaw={-Math.PI / 2} t={t} face={{ mouth: "flat", eyes: "open" }} />
            <Npc preset={BAPAK_B} position={[-2.35, 0, 1.6]} yaw={-Math.PI / 2 - 0.2} t={t} face={{ mouth: "flat", eyes: "open" }} />
            <Npc preset={ANAK_B} position={[-2.9, 0, 1.45]} yaw={-Math.PI / 2 + 0.2} t={t} face={{ mouth: "flat", eyes: "open" }} />
          </>
        ) : null}
        {view === "ruangtoa" ? (
          <>
            <ToaRoom doorOpen={0} lock={null} showKey={false} haspAngle={0} lever={0} monitors={1} deskCam={false} tex={null} />
            <pointLight position={[8.2, 1.45, -9.05]} color="#9ab0ff" intensity={1.7} distance={2.8} decay={2} />
            <C1 look={C1_BODIED} position={ROOT_A} yaw={Math.PI} t={t} pose={{ armL: [REST_UQ[0], REST_UQ[1]], armLFwd: REST_UQ[2], armR: [REST_UQ[0], REST_UQ[1]], armRFwd: REST_UQ[2], headNod: -6 } as never} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
            <Npc preset={AD_PRESET} position={AD_ROOM} yaw={Math.PI + 0.35} t={t} pose={{ ...(ADIK_B.pose ?? {}), armL: [REST_AD[0], REST_AD[1]], armLFwd: 0, armR: [REST_AD[0], REST_AD[1]], armRFwd: REST_AD[2], headNod: -8 } as never} face={{ eyes: "open", brows: "raised", mouth: "flat" }} />
            <CharLight chars={[{ root: ROOT_A, height: H_UQ }, { root: AD_ROOM, height: H_AD }]} cam={c.pos} mood={charScaled(NIGHT_INT, 0.6)} />
          </>
        ) : null}
        {view === "dapur" || view === "lorong" || view === "kamar" ? (["D", "L", "K"] as const).map((k) => <HiddenCam key={k} id={k} on={1} />) : null}
      </View>
    </AbsoluteFill>
  );
};
void GANG;
