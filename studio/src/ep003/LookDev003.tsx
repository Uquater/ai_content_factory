// Episode 2026-11-003 (Episode 2) — look-dev stills for the kitchen + torch light test (D-037, storyboard v0.2 S02–S06).
// Stills only (no animation, no audio). Approved designs are reused unchanged: C1_BODIED, ADIK_B (castV3), the house
// set (sets.tsx) with two additive props: vent="lit" (the vent glass takes light) and backBolt (the long slide bolt).
//   a — dark kitchen, torch off, both faces toward the camera (S02 axis): P5 face readability
//   b — palm-covered torch on the knob area (S05 axis, from behind adik)
//   c — the sweep at its top: the beam crosses the vent glass (does the glass warm?)
//   d — the torch on the bolt grip: bolt readable, hallway stays dark
//   e — adik's point of view to the glass (sight line check), torch at the top of the sweep
// Every value is a pure function of the props (video-production §9).
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { C1, C1_BUILD, C1_HEIGHT } from "../c1/C1";
import { Npc } from "../cast/npc";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { solveArm } from "../inkbeat/core/ik";
import { boxG, M } from "../inkbeat/core/kit";
import type { MoodPreset } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { HOUSE } from "../ep002/geo";
import { C1_BODIED, INK_NIGHT, thin } from "../ep002/LookDev";
import { BOLT_GRIP, HouseInterior } from "../ep002/sets";

export const LOOKDEV003_VIEWS = ["a", "b", "c", "d", "e"] as const;
type LV = (typeof LOOKDEV003_VIEWS)[number];

const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
/** same night-interior mood as the 2026-11-002 animatic v3 (NIGHT_INT): thin ink, near-black ambient, character fill x9 */
const faceFill = (m: MoodPreset, k: number): MoodPreset => ({ ...m, castLight: { ...m.castLight, fill: { ...m.castLight.fill, intensity: m.castLight.fill.intensity * k } } });
export const NIGHT_INT = faceFill(thin("night", INK_NIGHT, 0.05, 0, 0.12, 1.0), 9);

const NORTH = Math.PI; // yaw facing -z (the back door)
const reach = (root: V3, yaw: number, side: "L" | "R", target: V3, height = C1_HEIGHT) => {
  const ik = solveArm({ position: root, yaw, side, target, height, build: C1_BUILD });
  return side === "L" ? { armL: ik.arm, armLFwd: ik.fwd } : { armR: ik.arm, armRFwd: ik.fwd };
};

// ------------------------------------------------------------------ positions (storyboard v0.2 §3.2–§3.4)
const DOOR_Z = HOUSE.z0 + 0.06; // inside face of the north wall
const KNOB: V3 = [-1.15, 1.0, DOOR_Z + 0.02];
const GLASS: V3 = [-0.8, 2.32, DOOR_Z];
const BOLT: V3 = [BOLT_GRIP[0], BOLT_GRIP[1], DOOR_Z + 0.02];
/** Uq at the stand-off (~0.9 m from the door to the phone), facing the back door */
const UQ_STAND: V3 = [-0.95, 0, -3.8];
/** the phone in Uq's LEFT hand (code side "R"), in front of the chest; the right palm ("L") cups it */
const PHONE: V3 = [-1.02, 1.15, -4.02];
const CUP: V3 = [-0.93, 1.17, -4.06];
/** adik at the hallway mouth (west side), facing the back door */
const ADIK_MOUTH: V3 = [-1.2, 0, -1.2];

type TorchAim = "off" | "knob" | "glass" | "bolt";
const AIM: Record<Exclude<TorchAim, "off">, V3> = { knob: KNOB, glass: GLASS, bolt: BOLT };

/** the phone torch, palm-covered: a warm-white LED spot (cd, decay 2) at the phone, aimed at `aim`; the palm cuts it to
 * `cover` of full, and a tiny warm point light stands for the light glowing through the fingers */
const Torch: React.FC<{ from: V3; aim: V3; cover: number }> = ({ from, aim, cover }) => {
  const { spot, target } = useMemo(() => {
    const l = new THREE.SpotLight("#ffe9cc", 1, 6, 0.5, 0.65, 2);
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.002;
    l.shadow.normalBias = 0.03;
    return { spot: l, target: new THREE.Object3D() };
  }, []);
  const d = new THREE.Vector3(aim[0] - from[0], aim[1] - from[1], aim[2] - from[2]).normalize();
  spot.position.set(from[0] + d.x * 0.06, from[1] + d.y * 0.06, from[2] + d.z * 0.06);
  target.position.set(...aim);
  spot.target = target;
  spot.intensity = TORCH_CD * cover;
  target.updateMatrixWorld();
  return (
    <>
      <primitive object={spot} />
      <primitive object={target} />
      <pointLight position={[from[0] + d.x * 0.05, from[1] + 0.03, from[2] + d.z * 0.05]} color="#ff9f70" intensity={0.12} distance={0.7} decay={2} />
    </>
  );
};
/** torch strength (candela) before the palm; tuned on the stills, not a measured phone value */
const TORCH_CD = 6;
const COVER = 0.45;

const Phone: React.FC<{ p: V3; aim?: V3 }> = ({ p, aim }) => {
  const yaw = aim ? Math.atan2(aim[0] - p[0], aim[2] - p[2]) : NORTH;
  const pitch = aim ? Math.atan2(aim[1] - p[1], Math.hypot(aim[0] - p[0], aim[2] - p[2])) : 0;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <group rotation={[-pitch, 0, 0]}>
        <M g={boxG(0.072, 0.15, 0.009)} c="#1e2230" tex="metal" p={[0, 0, 0]} cast={false} />
      </group>
    </group>
  );
};

type Setup = { cam: Cam; aim: TorchAim; focus: V3; label: string };
const SETUPS: Record<LV, Setup> = {
  // S02 axis: from the kitchen facing south down the hallway; Uq walks toward the lens (2.4 m), adik at the mouth
  a: { cam: cam([-0.45, 1.35, -4.45], [-0.9, 1.1, -1.6], 50), aim: "off", focus: [-0.6, 1.2, -2.1], label: "a · dapur gelap, senter mati (wajah)" },
  // S05 axis: from the living room behind adik (2.2 m), through the hallway to the back door
  b: { cam: cam([-0.4, 1.5, 1.6], [-0.9, 1.5, -4.6], 40), aim: "knob", focus: [-0.95, 1.3, -4.6], label: "b · senter tertutup telapak di area kenop" },
  c: { cam: cam([-0.4, 1.5, 1.6], [-0.9, 1.5, -4.6], 40), aim: "glass", focus: [-0.95, 1.6, -4.7], label: "c · sapuan di titik tertinggi (kaca)" },
  d: { cam: cam([-0.4, 1.5, 1.6], [-0.9, 1.5, -4.6], 40), aim: "bolt", focus: [-0.95, 1.2, -4.7], label: "d · senter di gerendel" },
  // adik's eye height (1.27 m tall) at the hallway mouth, looking at the vent glass
  e: { cam: cam([-1.05, 1.12, -1.3], [-0.85, 1.85, -4.94], 46), aim: "glass", focus: [-0.85, 1.8, -4.7], label: "e · sudut pandang adik ke kaca" },
};

export const LookDev003: React.FC<{ view: LV }> = ({ view }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#0c0e1c" }} />;
  const s = SETUPS[view];
  const t = 2;
  const c = s.cam.pos;
  const atDoor = view !== "a";
  // a: Uq in the hallway walking toward the kitchen (faces north = the lens), phone low in the left hand
  const uqRoot: V3 = atDoor ? UQ_STAND : [-0.6, 0, -2.1];
  const phoneAt: V3 = atDoor ? PHONE : [uqRoot[0] - 0.22, 0.74, uqRoot[2] - 0.06];
  const aim = s.aim === "off" ? undefined : AIM[s.aim];
  const pose = atDoor
    ? { ...reach(uqRoot, NORTH, "R", phoneAt), ...reach(uqRoot, NORTH, "L", CUP), headNod: s.aim === "glass" ? 4 : -10 }
    : { ...reach(uqRoot, NORTH, "R", phoneAt) };
  return (
    <AbsoluteFill style={{ background: "#0c0e1c" }}>
      <View mood={NIGHT_INT} cam={s.cam} t={t} focus={s.focus} blur={0.4}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit" backBolt={0} />
        <C1 look={C1_BODIED} position={uqRoot} yaw={NORTH} t={t} pose={pose} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
        <Phone p={phoneAt} aim={aim} />
        {aim ? <Torch from={phoneAt} aim={aim} cover={COVER} /> : null}
        {view === "e" ? null : <Npc preset={ADIK_B} position={ADIK_MOUTH} yaw={NORTH} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />}
        <CastLight at={s.focus} cam={c} mood={NIGHT_INT} />
      </View>
      <div style={{ position: "absolute", left: 36, top: 40, fontFamily: "Poppins", fontWeight: 800, fontSize: 30, color: "#e8ecff", textShadow: "0 0 8px #000" }}>{`look-dev 2026-11-003 · ${s.label}`}</div>
    </AbsoluteFill>
  );
};

// ================================================================== look-dev v2 (owner notes on v1, 2026-11-17)
// One source of truth: ld003Scene.ts (also read by tools/ld003_clearance.ts). Narrow, palm-shaped torch (0.25 rad);
// adik behind Uq inside the hallway opening; phone placed at the solved palm; side camera options K1/K3/KE; diagnostics.
import { LD003_V2 } from "./ld003Scene";

const TorchV2: React.FC<{ from: V3; aim: V3; cover: number }> = ({ from, aim, cover }) => {
  const { spot, target } = useMemo(() => {
    const l = new THREE.SpotLight("#ffe9cc", 1, 6, 0.25, 0.5, 2);
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.002;
    l.shadow.normalBias = 0.03;
    return { spot: l, target: new THREE.Object3D() };
  }, []);
  const d = new THREE.Vector3(aim[0] - from[0], aim[1] - from[1], aim[2] - from[2]).normalize();
  spot.position.set(from[0] + d.x * 0.06, from[1] + d.y * 0.06, from[2] + d.z * 0.06);
  target.position.set(...aim);
  spot.target = target;
  spot.intensity = TORCH_CD * cover;
  target.updateMatrixWorld();
  return (
    <>
      <primitive object={spot} />
      <primitive object={target} />
      <pointLight position={[from[0] + d.x * 0.05, from[1] + 0.03, from[2] + d.z * 0.05]} color="#ff9f70" intensity={0.12} distance={0.7} decay={2} />
    </>
  );
};

const PhoneV2: React.FC<{ p: V3; aim?: V3; side: boolean }> = ({ p, aim, side }) => {
  if (side) {
    // gripped at the side: long axis down along the fingers, flat face against the palm (faces east-west)
    // gripped at the side, screen facing forward (north = toward the hallway lens), long axis down
    return (
      <group position={p}>
        <M g={boxG(0.072, 0.15, 0.009)} c="#1e2230" tex="metal" p={[0, 0, 0]} cast={false} />
        <M g={boxG(0.062, 0.13, 0.002)} c="#2c3448" tex="metal" p={[0, 0, -0.0055]} cast={false} />
      </group>
    );
  }
  const yaw = aim ? Math.atan2(aim[0] - p[0], aim[2] - p[2]) : NORTH;
  const pitch = aim ? Math.atan2(aim[1] - p[1], Math.hypot(aim[0] - p[0], aim[2] - p[2])) : 0;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <group rotation={[-pitch, 0, 0]}>
        <M g={boxG(0.072, 0.15, 0.009)} c="#1e2230" tex="metal" p={[0, 0, 0]} cast={false} />
      </group>
    </group>
  );
};

/** v2 character light (replaces CastLight in look-dev v2, owner note C): CastLight's rim sat 0.85 m BEHIND the anchor and
 * 0.55 m up, i.e. between Uq and the back door near the ceiling, with a 2.4 m reach, so it lit the ceiling, the door leaf
 * and the cream door frame (diag stills). Here each character gets a short rim close to the head (1.0 m reach) and the
 * fill from the lens side (as CastLight); nothing reaches the far set. Pure function of the props. */
export const CharLight: React.FC<{ chars: { root: V3; height: number }[]; cam: V3; mood: MoodPreset }> = ({ chars, cam, mood }) => (
  <>
    {chars.map((c, i) => {
      const head: V3 = [c.root[0], c.root[1] + 1.2 * (c.height / 1.5), c.root[2]];
      const dx = cam[0] - head[0];
      const dz = cam[2] - head[2];
      const l = Math.hypot(dx, dz) || 1;
      const fx = dx / l;
      const fz = dz / l;
      const rim: V3 = [head[0] - fx * 0.3, head[1] + 0.25, head[2] - fz * 0.3];
      const fill: V3 = [head[0] + fx * 1.05 + fz * 0.5, head[1] + 0.4, head[2] + fz * 1.05 - fx * 0.5];
      return (
        <React.Fragment key={i}>
          <pointLight position={rim} color={mood.castLight.rim.color} intensity={mood.castLight.rim.intensity * 0.6} distance={1.0} decay={2} />
          <pointLight position={fill} color={mood.castLight.fill.color} intensity={mood.castLight.fill.intensity} distance={2.2} decay={2} />
        </React.Fragment>
      );
    })}
  </>
);

const noInk = (m: MoodPreset): MoodPreset => ({ ...m, post: { ...m.post, outline: { ...m.post.outline, strength: 0 } } });

export const LookDev003v2: React.FC<{ id: string }> = ({ id }) => {
  const ready = useFonts();
  const v = LD003_V2.find((x) => x.id === id);
  if (!ready || !v) return <AbsoluteFill style={{ background: "#0c0e1c" }} />;
  const t = 2;
  const torchOn = v.aim !== "off" && v.diag?.torch !== false;
  const mood = v.diag?.ink === false ? noInk(NIGHT_INT) : NIGHT_INT;
  return (
    <AbsoluteFill style={{ background: "#0c0e1c" }}>
      <View mood={mood} cam={v.cam} t={t} focus={v.focus} blur={0.4} exposure={v.exposure ?? 0}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit" backBolt={0} />
        {v.chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose} hands={c.hands} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          ) : (
            <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          ),
        )}
        <PhoneV2 p={v.phone.p} aim={v.phone.aim} side={v.phone.side} />
        {torchOn && v.phone.aim ? <TorchV2 from={v.phone.p} aim={v.phone.aim} cover={COVER} /> : null}
        {v.diag?.cast === false ? null : v.diag?.castOld ? <CastLight at={v.focus} cam={v.cam.pos} mood={mood} /> : <CharLight chars={v.chars} cam={v.cam.pos} mood={mood} />}
      </View>
      <div style={{ position: "absolute", left: 36, top: 40, fontFamily: "Poppins", fontWeight: 800, fontSize: 28, color: "#e8ecff", textShadow: "0 0 8px #000" }}>{`look-dev v2 · ${v.label}`}</div>
    </AbsoluteFill>
  );
};

// ================================================================== look-dev v3 (owner decisions 2026-11-18, D-038)
// Data: ld003SceneV3.ts (also read by tools/ld003_v3_calc.ts). v1/v2 components above are unchanged. The phone is a box
// with an explicit quaternion (grip from the hand frame); the torch has a separate "leak" light (light escaping between
// the cupping fingers) whose strength is a per-view value.
import { LD003_V3 } from "./ld003SceneV3";

export const TorchV3: React.FC<{ from: V3; aim: V3; cover: number; leak: number; leakAt: V3 }> = ({ from, aim, cover, leak, leakAt }) => {
  const { spot, target } = useMemo(() => {
    const l = new THREE.SpotLight("#ffe9cc", 1, 6, 0.25, 0.5, 2);
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.002;
    l.shadow.normalBias = 0.03;
    return { spot: l, target: new THREE.Object3D() };
  }, []);
  const d = new THREE.Vector3(aim[0] - from[0], aim[1] - from[1], aim[2] - from[2]).normalize();
  spot.position.set(from[0] + d.x * 0.06, from[1] + d.y * 0.06, from[2] + d.z * 0.06);
  target.position.set(...aim);
  spot.target = target;
  spot.intensity = TORCH_CD * cover;
  target.updateMatrixWorld();
  return (
    <>
      <primitive object={spot} />
      <primitive object={target} />
      <pointLight position={leakAt} color="#ffb98a" intensity={leak} distance={0.8} decay={2} />
    </>
  );
};

export const PhoneV3: React.FC<{ p: V3; q: [number, number, number, number] }> = ({ p, q }) => (
  <group position={p} quaternion={new THREE.Quaternion(...q)}>
    <M g={boxG(0.072, 0.15, 0.009)} c="#1e2230" tex="metal" p={[0, 0, 0]} cast={false} />
    <M g={boxG(0.062, 0.13, 0.002)} c="#2c3448" tex="metal" p={[0, 0, -0.0055]} cast={false} />
  </group>
);

export const charScaled = (m: MoodPreset, k: number): MoodPreset =>
  k === 1 ? m : { ...m, castLight: { ...m.castLight, fill: { ...m.castLight.fill, intensity: m.castLight.fill.intensity * k }, rim: { ...m.castLight.rim, intensity: m.castLight.rim.intensity * k } } };

export const LookDev003v3: React.FC<{ id: string }> = ({ id }) => {
  const ready = useFonts();
  const v = LD003_V3.find((x) => x.id === id);
  if (!ready || !v) return <AbsoluteFill style={{ background: "#0c0e1c" }} />;
  const t = 2;
  const face = v.face ?? { eyes: "open", brows: "worried", mouth: "flat" };
  return (
    <AbsoluteFill style={{ background: "#0c0e1c" }}>
      <View mood={NIGHT_INT} cam={v.cam} t={t} focus={v.focus} blur={0.4} exposure={v.exposure ?? 0}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit" backBolt={0} />
        {v.chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose} hands={c.hands} face={face} />
          ) : (
            <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} face={{ eyes: "open", brows: "worried", mouth: "flat" }} />
          ),
        )}
        <PhoneV3 p={v.phone.p} q={v.phone.q} />
        {v.torch ? <TorchV3 {...v.torch} /> : null}
        <CharLight chars={v.chars} cam={v.cam.pos} mood={charScaled(NIGHT_INT, v.charK ?? 1)} />
      </View>
      <div style={{ position: "absolute", left: 36, top: 40, right: 36, fontFamily: "Poppins", fontWeight: 800, fontSize: 28, color: "#e8ecff", textShadow: "0 0 8px #000" }}>{`look-dev v3 · ${v.label}`}</div>
    </AbsoluteFill>
  );
};
