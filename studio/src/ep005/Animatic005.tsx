// Episode 4 (2026-11-005) opening ANIMATIC (owner 2026-11-23): end of Episode 3 → the toa says "Kalian memilih menutupnya."
// Rough: same set, light, cast and LED/halo components as the Ep 3 tests; a debug strip (shot id, world time) and the toa
// line as a caption; NO real audio. Variant A = real time, variant B = ellipsis between S02 and S03. Not an episode render.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior, StandFan } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { Halo, HALO_BY_LED, HiddenCam, ledWorld } from "../ep004/LookDev004";
import { camFor, totalFrames } from "./cams005";
import type { Variant } from "./cams005";
import { CLOTH_HANG, EV, frameAt, JACKET_ON_SOFA } from "./motion005";
import type { F5 } from "./motion005";

const LEDS = ["T", "D", "L", "K"] as const;
const UP = new THREE.Vector3(0, 1, 0);
const CLOTH = "#566040";
export const A005_FRAMES = (v: Variant) => totalFrames(v);

const FanRig: React.FC<{ fan: F5["fan"]; cloth: F5["cloth"] }> = ({ fan, cloth }) => {
  const a = new THREE.Vector3(...fan.a).normalize();
  const qT = new THREE.Quaternion().setFromUnitVectors(UP, a);
  const qY = new THREE.Quaternion().setFromAxisAngle(UP, fan.held ? fan.yaw + 2.3 : 0);
  const q = qT.multiply(qY);
  return (
    <group position={fan.base} quaternion={[q.x, q.y, q.z, q.w]}>
      <StandFan p={[0, 0, 0]} />
      {cloth.mode === "fan" ? (
        <>
          <M g={boxG(0.3, 0.012, 0.34)} c={CLOTH} tex="fabric" p={[-0.12, 1.3, 0]} r={[0, 0, 0.62]} />
          <M g={boxG(0.3, 0.012, 0.34)} c={CLOTH} tex="fabric" p={[0.12, 1.3, 0]} r={[0, 0, -0.62]} />
        </>
      ) : null}
    </group>
  );
};
const ClothHang: React.FC<{ cloth: F5["cloth"] }> = ({ cloth }) => {
  if (cloth.mode === "fan") return null;
  const k = cloth.mode === "hang" ? 1 : cloth.s * cloth.s;
  const [x, y, z] = CLOTH_HANG.c;
  return <M g={boxG(CLOTH_HANG.w, CLOTH_HANG.h, 0.012)} c={CLOTH} tex="fabric" p={[x, y + (1 - k) * 0.22, z]} r={[0, CLOTH_HANG.yaw, 0]} />;
};
const JacketOnSofa: React.FC = () => (
  <group position={JACKET_ON_SOFA}>
    <M g={boxG(0.4, 0.07, 0.3)} c="#91741f" tex="fabric" p={[0, 0, 0]} r={[0, 0.25, 0]} />
    <M g={boxG(0.3, 0.05, 0.1)} c="#775b17" tex="fabric" p={[0.22, 0.02, 0.1]} r={[0, 0.6, 0]} />
  </group>
);

export const Animatic005: React.FC<{ variant: Variant; hud?: boolean }> = ({ variant, hud = true }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const { cam, shot, w, local } = camFor(variant, f);
  const fr = frameAt(w);
  const occ = fr.chars.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  const adPreset = fr.jacketOnArm ? ADIK_B : { ...ADIK_B, accessory: undefined };
  const toaOn = w >= EV.toa + 0.05;
  const ledT = fr.led.T;
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={cam} t={w}>
        <HouseInterior tamuLamp={0} t={w} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} noFan />
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={k === "T" ? ledT : fr.led[k]} />)}
        <FanRig fan={fr.fan} cloth={fr.cloth} />
        <ClothHang cloth={fr.cloth} />
        {fr.jacketOnArm ? null : <JacketOnSofa />}
        {fr.chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={w} pose={c.pose as never} hands={c.hands as never} legPose={c.legPose as never} face={c.face as never} />
          ) : (
            <Npc key={i} preset={adPreset} position={c.root} yaw={c.yaw} t={w} pose={{ ...(ADIK_B.pose ?? {}), ...(c.pose as object) }} legPose={c.legPose as never} face={c.face as never} />
          ),
        )}
        <PhoneV3 p={fr.phone.p} q={fr.phone.q} />
        <CharLight chars={fr.chars} cam={cam.pos} mood={NIGHT_INT} />
      </View>
      {LEDS.map((k) => <Halo key={k} c={cam} p={ledWorld(k)} on={k === "T" ? ledT : fr.led[k]} d={HALO_BY_LED[k]} occ={occ} />)}
      {toaOn ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1340, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 54, color: "#f5f1e6", textShadow: "0 3px 0 #000, 0 0 12px #000" }}>
          <span style={{ fontSize: 26, color: "#c8d8ff" }}>TOA (suara sementara: teks)</span><br />Kalian memilih menutupnya.
        </div>
      ) : null}
      {hud ? (
        <div style={{ position: "absolute", left: 24, top: 24, fontFamily: "Poppins", fontSize: 26, fontWeight: 600, color: "#ffe9a0", textShadow: "0 2px 0 #000", lineHeight: 1.25 }}>
          {variant} · {shot} · film {(f / 30).toFixed(2)} s · dunia {w.toFixed(2)} s · shot {local.toFixed(2)} s<br />
          kain: {fr.cloth.mode} · LED-1 {Math.round(ledT * 100)}% · jaket: {fr.jacketOnArm ? "di lengan adik" : "di sofa"}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
