// Episode 4 (2026-11-005) opening ANIMATIC v2 (owner 2026-11-23): end of Episode 3 → adik puts the jacket on the sofa,
// Uq covers lens T with a small piece of opaque tape on the tip of a long pole, the toa says "Kalian memilih menutupnya."
// The preparation (tape onto the tip, the grip at the lower end) is cut out between S01 and S02. No real audio: the toa
// line is a caption. Shots: S01 world 0–2.6, S02 world 4.0–4.9, S03 world 4.9–7.4 (open005v2.ts world time).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, cylG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { Halo, HALO_BY_LED, HiddenCam, ledWorld } from "../ep004/LookDev004";
import { frameAt, JACKET_ON_SOFA, POLE, TAPE, W } from "./open005v2";
import type { F5v2 } from "./open005v2";

const LEDS = ["T", "D", "L", "K"] as const;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
type Seg = { id: string; w0: number; w1: number; cam: (u: number) => Cam };
export const SEGS2: Seg[] = [
  { id: "S01", w0: 0, w1: W.cut[0], cam: (u) => ({ pos: lerp3([0.25, 1.5, -0.6], [0.2, 1.5, -0.5], u), look: lerp3([-1.88, 0.75, 0.26], [-1.8, 0.75, 0.3], u), fov: 70, roll: 0 }) },
  { id: "S02", w0: W.cut[1], w1: 4.9, cam: (u) => ({ pos: lerp3([-1.2, 1.15, 1.6], [-1.15, 1.17, 1.62], u), look: [0.5, 1.6, 2.45], fov: 56, roll: 0 }) },
  { id: "S03", w0: 4.9, w1: W.end, cam: (u) => ({ pos: lerp3([0.33, 2.22, 2.28], [0.36, 2.24, 2.31], sm(u)), look: [0.87, 2.62, 2.86], fov: 24, roll: 0 }) },
];
export const A005V2_FRAMES = Math.round(SEGS2.reduce((a, s) => a + (s.w1 - s.w0), 0) * 30);
export const locate2 = (frame: number) => {
  let acc = 0;
  for (const s of SEGS2) {
    const n = Math.round((s.w1 - s.w0) * 30);
    if (frame < acc + n) { const local = (frame - acc) / 30; return { seg: s, w: s.w0 + local, cam: s.cam(local / (s.w1 - s.w0)) }; }
    acc += n;
  }
  const s = SEGS2[SEGS2.length - 1];
  return { seg: s, w: s.w1, cam: s.cam(1) };
};

const UPY = new THREE.Vector3(0, 1, 0);
export const Pole: React.FC<{ p: F5v2["pole"] }> = ({ p }) => {
  const b = new THREE.Vector3(...p.bottom), t = new THREE.Vector3(...p.tip);
  const mid = b.clone().add(t).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(UPY, t.clone().sub(b).normalize());
  return <group position={[mid.x, mid.y, mid.z]} quaternion={[q.x, q.y, q.z, q.w]}><M g={cylG(POLE.r, POLE.r, POLE.len, 10)} c="#9a7a4e" tex="wood" /></group>;
};
const Tape: React.FC<{ tp: F5v2["tape"] }> = ({ tp }) => {
  if (tp.on === "hidden") return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...tp.n).normalize());
  return <group position={tp.c} quaternion={[q.x, q.y, q.z, q.w]}><M g={boxG(TAPE.w, TAPE.h, 0.0015)} c="#ddd5bf" tex="paper" cast={false} /></group>;
};
export const JacketOnSofa: React.FC = () => (
  <group position={JACKET_ON_SOFA}>
    <M g={boxG(0.38, 0.07, 0.28)} c="#91741f" tex="fabric" r={[0, 0.25, 0]} />
    <M g={boxG(0.28, 0.05, 0.1)} c="#775b17" tex="fabric" p={[0.2, 0.02, 0.1]} r={[0, 0.6, 0]} />
  </group>
);

export const Animatic005v2: React.FC<{ hud?: boolean }> = ({ hud = false }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const { seg, w, cam } = locate2(f);
  const fr = frameAt(w);
  const occ = fr.chars.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  const adPreset = fr.jacketOnArm ? ADIK_B : { ...ADIK_B, accessory: undefined };
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={cam} t={w}>
        <HouseInterior tamuLamp={0} t={w} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} />
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={1} />)}
        <Pole p={fr.pole} />
        <Tape tp={fr.tape} />
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
      {LEDS.map((k) => <Halo key={k} c={cam} p={ledWorld(k)} on={1} d={HALO_BY_LED[k]} occ={occ} />)}
      {w >= W.toa ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1340, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 56, color: "#f5f1e6", textShadow: "0 3px 0 #000, 0 0 12px #000" }}>
          Kalian memilih menutupnya.
        </div>
      ) : null}
      {hud ? (
        <div style={{ position: "absolute", left: 24, top: 24, fontFamily: "Poppins", fontSize: 26, fontWeight: 600, color: "#ffe9a0", textShadow: "0 2px 0 #000" }}>
          {seg.id} · film {(f / 30).toFixed(2)} s · dunia {w.toFixed(2)} s · selotip: {fr.tape.on}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
