// Episode 4 (2026-11-005) LOOK-DEV stills (owner 2026-11-23, storyboard v0.2): the S03 insert before/after the tape
// meets the lens, the bathroom door seen from the kitchen, and the dark bathroom with the choice cards. Same set, light,
// cast and LED/halo components as Ep 3; look-dev-only additions (not in any episode render): an insert fill light, a brighter
// tape, the bathroom door and room (HouseInterior `bathDoor`), a phone light in the bathroom. Deterministic (no clocks).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { c1ArmIK } from "../c1/bodyIk";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { CardsAB } from "../ep004/Episode004";
import { Glint, Halo, HALO_BY_LED, HiddenCam, ledWorld } from "../ep004/LookDev004";
import { H_AD, H_UQ, REST_AD } from "../ep004/motion004";
import { EP2_END } from "../ep004/e004Poses";
import { JacketOnSofa, Pole } from "./Animatic005v2";
import { frameAt, LENS, LENS_DIR, TAPE, W } from "./open005v2";
import { SEGS2 } from "./Animatic005v2";

export type Ld005Id = "insert-before" | "insert-after" | "bath-door" | "bath-cards";
export const LD005_IDS: Ld005Id[] = ["insert-before", "insert-after", "bath-door", "bath-cards"];
const LEDS = ["T", "D", "L", "K"] as const;
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;
const fwdV = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
const leftV = (yaw: number) => new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

/** look-dev tape: lighter than the first animatic (the v2 tape read as a dull sticker on a black box) */
const TapeLD: React.FC<{ c: V3; n: V3 }> = ({ c, n }) => {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...n).normalize());
  return (
    <group position={c} quaternion={[q.x, q.y, q.z, q.w]}>
      <M g={boxG(TAPE.w, TAPE.h, 0.0015)} c="#f1ead2" tex="paper" cast={false} />
    </group>
  );
};

const Insert: React.FC<{ after: boolean }> = ({ after }) => {
  const w = after ? W.pull[1] + 0.15 : W.press[0] - 0.3;
  const fr = frameAt(w);
  const seg = SEGS2[2];
  const cam: Cam = seg.cam(after ? 0.55 : 0.12);
  const tapeAt = after
    ? { c: [LENS[0] + LENS_DIR[0] * -TAPE.gap * -1, LENS[1] + LENS_DIR[1] * TAPE.gap, LENS[2] + LENS_DIR[2] * TAPE.gap] as V3, n: [-LENS_DIR[0], -LENS_DIR[1], -LENS_DIR[2]] as V3 }
    : { c: fr.tape.c, n: fr.tape.n };
  return (
    <>
    <View mood={NIGHT_INT} cam={cam} t={w}>
      <HouseInterior tamuLamp={0} t={w} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} noFan />
      {LEDS.map((k) => <HiddenCam key={k} id={k} on={1} />)}
      <Pole p={fr.pole} />
      <TapeLD c={tapeAt.c} n={tapeAt.n} />
      <JacketOnSofa />
      {/* look-dev insert fill: a faint cool light from the camera side so the housing separates from the wall (HYPOTHESIS: reads as moonlight bounce) */}
      <pointLight position={[cam.pos[0] + 0.1, cam.pos[1] + 0.1, cam.pos[2] + 0.1]} color="#aebfe8" intensity={0.1} distance={0.9} decay={2} />
    </View>
    {/* the glass lens catches a faint reflection until it is covered (look-dev: makes the lens recognisable as a lens) */}
    <Glint c={cam} p={LENS} k={after ? 0 : 0.9} />
    </>
  );
};

const POSE_UQ = uqEnd.pose as { armR: [number, number]; armRFwd?: number };
const Dark: React.FC<{ id: "bath-door" | "bath-cards" }> = ({ id }) => {
  const cards = id === "bath-cards";
  const uYaw = cards ? Math.PI / 2 : 1.45, aYaw = uYaw;
  const uRoot: V3 = cards ? [1.55, 0, -3.4] : [-0.1, 0, -3.5];
  const aRoot: V3 = cards ? [1.55, 0, -3.95] : [0.4, 0, -3.78];
  // Uq holds the phone up to read (SKILL §14: left arm, rig "R", body-local [0.11, 0.98, 0.25]) and looks down at it
  const tgt = new THREE.Vector3(...uRoot).addScaledVector(leftV(uYaw), 0.11).addScaledVector(fwdV(uYaw), 0.25).setY(0.98);
  const ik = c1ArmIK({ root: uRoot, yaw: uYaw, body: {}, side: "R", target: [tgt.x, tgt.y, tgt.z], ref: [60, 70, 0], height: H_UQ, avoidTorso: true, wMin: -60 });
  const phoneP: V3 = [tgt.x, tgt.y, tgt.z];
  const dirScreen = fwdV(uYaw).multiplyScalar(-1).add(new THREE.Vector3(0, 0.55, 0)).normalize();
  const qPh = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), dirScreen);
  const uPose = cards
    ? { ...(uqEnd.pose as object), armR: ik.arm, armRFwd: ik.fwd, headYaw: 0, headNod: 16 }
    : { ...(uqEnd.pose as object), armR: POSE_UQ.armR, headYaw: 18, headNod: 0 };
  const aPose = { ...(adEnd.pose as object), armR: [REST_AD[0], REST_AD[1]], armRFwd: REST_AD[2], armL: [REST_AD[0], REST_AD[1]], armLFwd: 0, headYaw: cards ? 0 : 24, headNod: cards ? 10 : 0, lean: 0 };
  const adPreset = { ...ADIK_B, accessory: undefined };
  const cam: Cam = cards
    ? { pos: [3.9, 1.25, -3.67], look: [1.55, 1.12, -3.67], fov: 52, roll: 0 }
    : { pos: [-3.5, 1.4, -4.15], look: [0.8, 1.0, -4.0], fov: 48, roll: 0 };
  const chars = [{ root: uRoot, height: H_UQ }, { root: aRoot, height: H_AD }];
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={cam} t={2} exposure={cards ? EXPO_CARDS : 0}>
        <HouseInterior tamuLamp={0} t={2} light="local" moon={cards ? 0 : 0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} noFan bathDoor={cards ? 1.3 : 1.15} />
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={1} />)}
        <C1 look={C1_BODIED} position={uRoot} yaw={uYaw} t={2} pose={uPose as never} hands={uqEnd.hands as never} face={{ eyes: "open", brows: "worried", mouth: "flat" } as never} />
        <Npc preset={adPreset} position={aRoot} yaw={aYaw} t={2} pose={{ ...(ADIK_B.pose ?? {}), ...(aPose as object) } as never} face={{ eyes: "open", brows: "raised", mouth: "flat" } as never} />
        {cards ? (
          <>
            <PhoneV3 p={phoneP} q={[qPh.x, qPh.y, qPh.z, qPh.w]} />
            {/* the only light in the room: the phone screen, below and in front of both faces (look-dev: intensity tuned by still) */}
            <pointLight position={[phoneP[0] + 0.14, phoneP[1] + 0.12, phoneP[2] - 0.12]} color="#cfe0ff" intensity={CARD_LIGHT} distance={1.6} decay={2} />
          </>
        ) : null}
        <CharLight chars={chars} cam={cam.pos} mood={charScaled(NIGHT_INT, cards ? 0.4 : 0.5)} />
      </View>
      {LEDS.map((k) => <Halo key={k} c={cam} p={ledWorld(k)} on={1} d={HALO_BY_LED[k]} occ={chars.map((c, i) => ({ root: c.root, height: c.height, who: i ? ("adik" as const) : ("uq" as const) }))} />)}
      {cards ? <CardsAB t={5} items={["temui satpam sekarang", "minta bukti dulu"]} inAt={0} /> : null}
    </AbsoluteFill>
  );
};
const CARD_LIGHT = 2.2;
const EXPO_CARDS = -1.3;

export const LookDev005: React.FC<{ id: Ld005Id }> = ({ id }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return id === "insert-before" || id === "insert-after" ? <AbsoluteFill><Insert after={id === "insert-after"} /></AbsoluteFill> : <Dark id={id} />;
};
