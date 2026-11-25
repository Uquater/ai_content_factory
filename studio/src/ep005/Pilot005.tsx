// Episode 4 (2026-11-005) opening PILOT, S01–S03 (owner 2026-11-23, look-dev v1): the Ep 3 hold, the release, the parting, adik's
// jacket on the sofa, the tape on the lens, the toa line. Same set/light/cast as Ep 3 + the look-dev v1 additions (brighter tape,
// lens glint until covered, faint insert fill). Film time: S01 0–3.5 s, S02 3.5–4.4 s, S03 4.4–6.9 s (open005v3 world time).
// Audio = a TEMPORARY mix made outside this file (Windows synthetic voice for the toa line; not a VO). No captions except the toa line.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { Glint, Halo, HALO_BY_LED, HiddenCam, ledWorld } from "../ep004/LookDev004";
import { JacketOnSofa, Pole, SEGS2 } from "./Animatic005v2";
import { frameAt, LENS, TAPE, W } from "./open005v3";

const LEDS = ["T", "D", "L", "K"] as const;
type Seg = { id: string; w0: number; w1: number; cam: (u: number) => Cam };
export const PSEGS: Seg[] = [
  { id: "S01", w0: 0, w1: W.cut[0], cam: (u) => { const k = u * u * (3 - 2 * u); return { pos: [-1.75, 1.45, 2.85 - 0.1 * k], look: [-1.75 - 0.15 * k, 0.95 - 0.25 * k, 1.05 - 0.95 * k], fov: 62, roll: 0 }; } },
  { id: "S02", w0: W.cut[1], w1: W.cut[1] + 0.9, cam: SEGS2[1].cam },
  { id: "S03", w0: W.cut[1] + 0.9, w1: W.end, cam: SEGS2[2].cam },
];
export const PILOT005_FRAMES = Math.round(PSEGS.reduce((a, s) => a + (s.w1 - s.w0), 0) * 30);
export const locateP = (frame: number) => {
  let acc = 0;
  for (const s of PSEGS) {
    const n = Math.round((s.w1 - s.w0) * 30);
    if (frame < acc + n) { const local = (frame - acc) / 30; return { seg: s, w: s.w0 + local, cam: s.cam(local / (s.w1 - s.w0)) }; }
    acc += n;
  }
  const s = PSEGS[PSEGS.length - 1];
  return { seg: s, w: s.w1, cam: s.cam(1) };
};
const TapeLD: React.FC<{ c: V3; n: V3 }> = ({ c, n }) => {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...n).normalize());
  return <group position={c} quaternion={[q.x, q.y, q.z, q.w]}><M g={boxG(TAPE.w, TAPE.h, 0.0015)} c="#f1ead2" tex="paper" cast={false} /></group>;
};

export const Pilot005: React.FC<{ hud?: boolean }> = ({ hud = false }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const { seg, w, cam } = locateP(f);
  const fr = frameAt(w);
  const occ = fr.chars.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  const adPreset = fr.jacketOnArm ? ADIK_B : { ...ADIK_B, accessory: undefined };
  const insert = seg.id === "S03";
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={cam} t={w}>
        <HouseInterior tamuLamp={0} t={w} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} noFan />
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={1} />)}
        <Pole p={fr.pole} />
        {fr.tape.on === "hidden" ? null : <TapeLD c={fr.tape.c} n={fr.tape.n} />}
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
        {insert ? <pointLight position={[cam.pos[0] + 0.1, cam.pos[1] + 0.1, cam.pos[2] + 0.1]} color="#aebfe8" intensity={0.1} distance={0.9} decay={2} /> : null}
      </View>
      {LEDS.map((k) => <Halo key={k} c={cam} p={ledWorld(k)} on={1} d={HALO_BY_LED[k]} occ={occ} />)}
      {insert ? <Glint c={cam} p={LENS} k={fr.tape.on === "lens" ? 0 : 0.9} /> : null}
      {w >= W.toa ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1340, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 56, color: "#f5f1e6", textShadow: "0 3px 0 #000, 0 0 12px #000" }}>
          Kalian memilih menutupnya.
        </div>
      ) : null}
      {hud ? (
        <div style={{ position: "absolute", left: 24, top: 24, fontFamily: "Poppins", fontSize: 26, fontWeight: 600, color: "#ffe9a0", textShadow: "0 2px 0 #000" }}>
          {seg.id} · film {(f / 30).toFixed(2)} s · dunia {w.toFixed(2)} s
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
