// Episode 5 (2026-11-006) sets (full-episode preview, owner 2026-11-24; D-066 decision 2: the toa room "R2" behind the
// eastern neighbour, north of the gang, door in its SOUTH wall onto the gang). Geometry is shared with the approved closing
// shot (closeMotion006.ts: ROOM, IN, DESK, LENS, MIC; Close006.tsx draws the same walls/door/desk/mic in the same colours, so
// S15 matches the reference v0f). New props are additive and drawn only in Episode 5.
//   GangSet    the alley behind the row: concrete strip, the back walls of the next row (north), a dim wall lamp, one camera
//              with an LED on the north wall (lights when they pass, beat 2)
//   ToaRoom    R2 outside + inside: walls, roof slab, the steel-plank door (hinge WEST, opens INTO the room), v5: a real
//              hasp (spacer block + hinged strap on the leaf, a wire eye on the wall) and a brass padlock (lock006.ts) outside, the console desk with the gooseneck mic, the desk camera, the monitor wall (CCTV tiles as
//              textures), the rack with the OTOMATIS / MIKROFON switch on Uq's right
import React from "react";
import * as THREE from "three";
import { continueRender, delayRender, staticFile } from "remotion";
import { boxG, cylG, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { BAPAK_B } from "../ep002/LookDev";
import type { NpcPreset } from "../cast/npc";
import { armWorld } from "../ep005/open005v4";
import { DESK, IN, LENS, MIC, ROOM } from "./closeMotion006";
import { BODY_C, EYE, HASP, KEYWAY_L, PL } from "./lock006";
import type { LockFrame } from "./lock006";

// ------------------------------------------------------------------ canvas text (deterministic, cached)
const texCache = new Map<string, THREE.CanvasTexture>();
export const textTex = (text: string, w = 256, h = 64, bg = "#1b1c20", fg = "#e8e4d8", size = 34) => {
  const k = [text, w, h, bg, fg, size].join("|");
  const hit = texCache.get(k);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = fg; g.font = `700 ${size}px Poppins, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(k, t);
  return t;
};
const Label: React.FC<{ text: string; p: V3; w: number; h: number; r?: V3; bg?: string; fg?: string; size?: number }> = ({ text, p, w, h, r, bg, fg, size }) => (
  <mesh position={p} rotation={r}>
    <planeGeometry args={[w, h]} />
    <meshBasicMaterial map={textTex(text, 256, Math.round((256 * h) / w), bg, fg, size)} toneMapped={false} />
  </mesh>
);

// ------------------------------------------------------------------ CCTV tiles (rendered stills, tools: Chan006 compositions)
export const CHANNELS = ["dapur", "lorong", "kamar", "tamu", "jalan", "tetangga", "ruangtoa"] as const;
export type ChanId = (typeof CHANNELS)[number];
const chanTex = new Map<string, THREE.Texture>();
/** load the channel stills once per tab, gating the frame until they are decoded (video-production §9: gated loads) */
export const useChanTextures = (): Record<string, THREE.Texture> | null => {
  const [ready, setReady] = React.useState(() => CHANNELS.every((c) => chanTex.has(c)));
  React.useEffect(() => {
    if (ready) return;
    const h = delayRender("ep006 channel textures");
    const loader = new THREE.TextureLoader();
    Promise.all(CHANNELS.map((c) => new Promise<void>((res, rej) => loader.load(staticFile(`ep006/ch_${c}.png`), (t) => { t.colorSpace = THREE.SRGBColorSpace; chanTex.set(c, t); res(); }, undefined, rej))))
      .then(() => { setReady(true); continueRender(h); })
      .catch((e) => { throw e; });
  }, [ready]);
  return ready ? Object.fromEntries(CHANNELS.map((c) => [c, chanTex.get(c)!])) : null;
};

// ------------------------------------------------------------------ the gang (alley) behind the row
export const GANG = { z0: -7.42, z1: -5.0, wallH: 2.2, led: [0.3, 2.2, -7.38] as V3, lamp: [-3.2, 2.3, -7.35] as V3 };
export const GangSet: React.FC<{ ledOn: number }> = ({ ledOn }) => (
  <group>
    <M g={boxG(36, 0.04, GANG.z1 - GANG.z0)} c="#5f5d58" tex="plaster" p={[3, -0.015, (GANG.z0 + GANG.z1) / 2]} cast={false} />
    {/* the back walls of the next row (north side): two runs either side of the toa room */}
    <M g={boxG(ROOM.x0 + 14, GANG.wallH, 0.15)} c="#8a8272" tex="plaster" p={[(ROOM.x0 - 14) / 2, GANG.wallH / 2, GANG.z0 - 0.075]} />
    <M g={boxG(10, GANG.wallH, 0.15)} c="#8a8272" tex="plaster" p={[ROOM.x1 + 5, GANG.wallH / 2, GANG.z0 - 0.075]} />
    {/* a gutter along the house side */}
    <M g={boxG(36, 0.06, 0.22)} c="#3e3c38" tex="plaster" p={[3, 0.01, GANG.z1 - 0.13]} cast={false} />
    {/* dim wall lamp (the only motivated light in the gang) */}
    <M g={boxG(0.16, 0.12, 0.1)} c="#2a2a2e" tex="metal" p={GANG.lamp} cast={false} />
    <mesh position={[GANG.lamp[0], GANG.lamp[1] - 0.07, GANG.lamp[2] + 0.04]}><sphereGeometry args={[0.035, 12, 8]} /><meshBasicMaterial color="#ffd9a0" toneMapped={false} /></mesh>
    <pointLight position={[GANG.lamp[0], GANG.lamp[1] - 0.15, GANG.lamp[2] + 0.25]} color="#ffcf90" intensity={3.2} distance={7} decay={2} />
    {/* the gang camera with its LED, facing south-east down the gang */}
    <group position={GANG.led}>
      <M g={boxG(0.06, 0.045, 0.05)} c="#2a2b30" tex="metal" cast={false} />
      <mesh position={[0.02, 0.012, 0.026]}><sphereGeometry args={[0.004, 10, 8]} /><meshBasicMaterial color={new THREE.Color("#3a1010").lerp(new THREE.Color("#ff2a1a"), ledOn)} toneMapped={false} /></mesh>
    </group>
  </group>
);

// ------------------------------------------------------------------ the toa room R2
export const DOOR = { hingeX: ROOM.door.x0, w: ROOM.door.x1 - ROOM.door.x0 - 0.02, h: ROOM.door.h, z: ROOM.z1 - ROOM.t / 2 };
// v5: 0.85 m tall (was 1.0): Uq's shoulder is at 1.05 m, so on a 1.0 m top his forearm lay ON the rack (e006_check v5 run 3,
// arm segments sampled: -2.5 cm in every IK solution); at 0.85 the arm clears it by >= 3 cm (search over the lever spot)
export const RACK = { x0: 8.55, x1: 8.95, z0: -8.35, z1: -7.95, h: 0.85 };
// the lever on the rack's top, nearest Uq (e006_check v4 run 2: 5 cm further north, adik stands east of the door)
export const SWITCH: V3 = [8.6, RACK.h + 0.03, -8.1];
const WALL_C = "#77715f";
export type ToaRoomProps = { doorOpen: number; lock: LockFrame | null; showKey: boolean; haspAngle: number; lever: number; monitors: number; deskCam: boolean; tex: Record<string, THREE.Texture> | null; roof?: boolean };
const BRASS = "#b8923a", STEEL = "#c4c4c0", HASP_C = "#6a6660";
/** the padlock in its own frame (origin = the crown's wire centre; lock006): shackle, brass body (dropped on the long leg once
 * open), the keyway on the front face, the key (in along -z, turned about its blade) */
export const Padlock: React.FC<{ f: LockFrame; showKey: boolean }> = ({ f, showKey }) => {
  const legTop = -PL.leg, bodyTop = BODY_C[1] + PL.h / 2;
  const longLo = bodyTop - 0.012, shortLo = bodyTop - 0.005;
  const kz = KEYWAY_L[2] + 0.05 * (1 - f.keyIn) - PL.keyDepth * f.keyIn + PL.keyLen;
  return (
    <group position={f.o} rotation={[0, 0, f.rz]}>
      <M g={torG(PL.leg, PL.wire, Math.PI)} c={STEEL} tex="metal" p={[0, -PL.leg, 0]} cast={false} />
      <M g={cylG(PL.wire, PL.wire, legTop - longLo, 10)} c={STEEL} tex="metal" p={[-PL.leg, (legTop + longLo) / 2, 0]} cast={false} />
      <M g={cylG(PL.wire, PL.wire, legTop - shortLo, 10)} c={STEEL} tex="metal" p={[PL.leg, (legTop + shortLo) / 2, 0]} cast={false} />
      <group position={[0, -f.drop, 0]}>
        <M g={boxG(PL.w, PL.h, PL.d)} c={BRASS} tex="metal" p={BODY_C} cast={false} />
        <mesh position={[KEYWAY_L[0], KEYWAY_L[1], KEYWAY_L[2] + 0.0006]}><planeGeometry args={[0.0035, 0.011]} /><meshBasicMaterial color="#1a140c" /></mesh>
        {showKey ? (
          <group position={[KEYWAY_L[0], KEYWAY_L[1], kz]} rotation={[0, Math.PI / 2, 0]}>
            <group rotation={[(f.keyTurn * Math.PI) / 2, 0, 0]}><KeyTag p={[0, 0, 0]} tag={false} /></group>
            <KeyCard p={[-0.006, -0.035, 0]} r={[0, -Math.PI / 2, 0]} />
          </group>
        ) : null}
      </group>
    </group>
  );
};
export const ToaRoom: React.FC<ToaRoomProps> = ({ doorOpen, lock, showKey, haspAngle, lever, monitors, deskCam, tex, roof = true }) => {
  const cx = (ROOM.x0 + ROOM.x1) / 2, cz = (ROOM.z0 + ROOM.z1) / 2, w = ROOM.x1 - ROOM.x0, d = ROOM.z1 - ROOM.z0;
  const D = ROOM.door;
  const tiles: (string | null)[] = ["dapur", "lorong", "kamar", "tamu", "jalan", "tetangga"];
  return (
    <group>
      {/* floor, ceiling, walls: the same boxes and colours as Close006.tsx (S15 = v0f) */}
      <M g={boxG(w, 0.04, d)} c="#55524c" tex="plaster" p={[cx, -0.02, cz]} cast={false} />
      <M g={boxG(w, 0.04, d)} c="#4a4844" tex="plaster" p={[cx, ROOM.h + 0.02, cz]} cast={false} />
      <M g={boxG(w, ROOM.h, ROOM.t)} c={WALL_C} tex="plaster" p={[cx, ROOM.h / 2, ROOM.z0 + ROOM.t / 2]} cast={false} />
      <M g={boxG(ROOM.t, ROOM.h, d)} c={WALL_C} tex="plaster" p={[ROOM.x0 + ROOM.t / 2, ROOM.h / 2, cz]} cast={false} />
      <M g={boxG(ROOM.t, ROOM.h, d)} c={WALL_C} tex="plaster" p={[ROOM.x1 - ROOM.t / 2, ROOM.h / 2, cz]} cast={false} />
      <M g={boxG(D.x0 - ROOM.x0, ROOM.h, ROOM.t)} c={WALL_C} tex="plaster" p={[(ROOM.x0 + D.x0) / 2, ROOM.h / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      <M g={boxG(ROOM.x1 - D.x1, ROOM.h, ROOM.t)} c={WALL_C} tex="plaster" p={[(D.x1 + ROOM.x1) / 2, ROOM.h / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      <M g={boxG(D.x1 - D.x0, ROOM.h - D.h, ROOM.t)} c={WALL_C} tex="plaster" p={[(D.x0 + D.x1) / 2, (ROOM.h + D.h) / 2, ROOM.z1 - ROOM.t / 2]} cast={false} />
      {roof ? <M g={boxG(w + 0.5, 0.1, d + 0.5)} c="#4f4a44" tex="roofTiles" p={[cx, ROOM.h + 0.09, cz]} /> : null}
      {/* the door: hinge on the WEST jamb, opens north into the room (rotation +open about y); at 0 = Close006's leaf */}
      <group position={[DOOR.hingeX + 0.01, 0, DOOR.z]} rotation={[0, doorOpen, 0]}>
        <M g={boxG(DOOR.w, DOOR.h, 0.04)} c="#3b2e26" tex="wood" p={[DOOR.w / 2, DOOR.h / 2, 0]} cast={false} />
        {/* outside (v5): the hasp's spacer block on the leaf and the strap hinged on it (closed = over the eye, open = swung
            back onto the leaf); inside: a pull handle */}
        {(() => {
          const hx = HASP.hinge[0] - (DOOR.hingeX + 0.01), hz = HASP.hinge[2] - DOOR.z;
          const slot0 = EYE.c[0] - HASP.hinge[0] - 0.007, slot1 = EYE.c[0] - HASP.hinge[0] + 0.007;
          return (
            <group>
              <M g={boxG(HASP.block[1] - HASP.block[0], 0.04, hz - 0.02 - 0.002)} c={HASP_C} tex="metal" p={[hx - (HASP.block[1] - HASP.block[0]) / 2, HASP.hinge[1], (0.02 + hz - 0.002) / 2]} cast={false} />
              <group position={[hx, HASP.hinge[1], hz]} rotation={[0, -haspAngle, 0]}>
                <M g={cylG(0.005, 0.005, HASP.w, 10)} c={HASP_C} tex="metal" cast={false} />
                <M g={boxG(slot0, HASP.w, 0.004)} c={HASP_C} tex="metal" p={[slot0 / 2, 0, 0]} cast={false} />
                <M g={boxG(HASP.len - slot1, HASP.w, 0.004)} c={HASP_C} tex="metal" p={[(slot1 + HASP.len) / 2, 0, 0]} cast={false} />
                <M g={boxG(slot1 - slot0, 0.0025, 0.004)} c={HASP_C} tex="metal" p={[(slot0 + slot1) / 2, HASP.w / 2 - 0.00125, 0]} cast={false} />
                <M g={boxG(slot1 - slot0, 0.0025, 0.004)} c={HASP_C} tex="metal" p={[(slot0 + slot1) / 2, -HASP.w / 2 + 0.00125, 0]} cast={false} />
              </group>
            </group>
          );
        })()}
        <M g={boxG(0.02, 0.12, 0.03)} c="#6a6660" tex="metal" p={[DOOR.w - 0.08, 1.0, -0.04]} cast={false} />
      </group>
      {/* v5: the eye (a wire ring standing out of the wall beside the free edge, hole axis x) on a small plate, and the padlock */}
      <M g={boxG(0.016, 0.044, 0.003)} c={HASP_C} tex="metal" p={[EYE.c[0], EYE.c[1], ROOM.z1 + 0.0015]} cast={false} />
      <M g={torG(EYE.r + EYE.wire, EYE.wire)} c={STEEL} tex="metal" p={EYE.c} r={[0, Math.PI / 2, 0]} cast={false} />
      {lock ? <Padlock f={lock} showKey={showKey} /> : null}
      {/* console desk + gooseneck mic (= Close006) */}
      <M g={boxG(DESK.x1 - DESK.x0, DESK.top, DESK.z1 - DESK.z0)} c="#3a3a40" tex="wood" p={[(DESK.x0 + DESK.x1) / 2, DESK.top / 2, (DESK.z0 + DESK.z1) / 2]} cast={false} />
      <M g={boxG(0.018, MIC[1] - DESK.top, 0.018)} c="#202020" p={[MIC[0], (MIC[1] + DESK.top) / 2, DESK.z1 - 0.06]} cast={false} />
      <M g={boxG(0.018, 0.018, Math.abs(MIC[2] - (DESK.z1 - 0.06)))} c="#202020" p={[MIC[0], MIC[1], (MIC[2] + DESK.z1 - 0.06) / 2]} cast={false} />
      <M g={boxG(0.05, 0.08, 0.05)} c="#151515" p={MIC} cast={false} />
      {/* a small mixer on the desk, keyboard */}
      <M g={boxG(0.5, 0.05, 0.3)} c="#26272c" tex="metal" p={[8.55, DESK.top + 0.025, -8.95]} cast={false} />
      <M g={boxG(0.42, 0.025, 0.15)} c="#1c1c20" p={[7.75, DESK.top + 0.013, -8.85]} cast={false} />
      {/* the desk camera: a small box on a short stand, lens toward the room (+z), red LED */}
      {deskCam ? (
        <group>
          <M g={boxG(0.02, LENS[1] - DESK.top - 0.03, 0.02)} c="#202020" p={[LENS[0], (LENS[1] + DESK.top) / 2 - 0.02, LENS[2] - 0.03]} cast={false} />
          <M g={boxG(0.09, 0.06, 0.06)} c="#18181c" tex="metal" p={[LENS[0], LENS[1], LENS[2] - 0.03]} cast={false} />
          <mesh position={[LENS[0], LENS[1], LENS[2] + 0.001]}><circleGeometry args={[0.012, 20]} /><meshBasicMaterial color="#0a0a10" /></mesh>
          <mesh position={[LENS[0] + 0.03, LENS[1] + 0.018, LENS[2] + 0.001]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#ff2a1a" toneMapped={false} /></mesh>
        </group>
      ) : null}
      {/* monitor wall: 3 x 2 screens on the north wall, CCTV tiles when on (the living room tile is dark: tape, D-064) */}
      {tiles.map((id, i) => {
        const x = IN.x0 + 0.45 + (i % 3) * 0.63, y = 1.15 + (i < 3 ? 0.6 : 0);
        const t = id && tex ? tex[id] : null;
        return (
          <group key={i} position={[x, y, IN.z0 + 0.04]}>
            <M g={boxG(0.62, 0.56, 0.04)} c="#111114" tex="metal" cast={false} />
            <mesh position={[0, 0, 0.022]}>
              <planeGeometry args={[0.58, 0.52]} />
              {t && monitors > 0 ? <meshBasicMaterial map={t} color={new THREE.Color(0.08, 0.08, 0.1).lerp(new THREE.Color(1, 1, 1), monitors)} toneMapped={false} /> : <meshBasicMaterial color={new THREE.Color("#0c0d12").lerp(new THREE.Color("#3a4a80"), monitors)} toneMapped={false} />}
            </mesh>
          </group>
        );
      })}
      {/* the rack with the input switch on Uq's right */}
      <M g={boxG(RACK.x1 - RACK.x0, RACK.h, RACK.z1 - RACK.z0)} c="#2c2d32" tex="metal" p={[(RACK.x0 + RACK.x1) / 2, RACK.h / 2, (RACK.z0 + RACK.z1) / 2]} cast={false} />
      <Label text="OTOMATIS" p={[SWITCH[0] + 0.15, RACK.h + 0.002, SWITCH[2] - 0.06]} w={0.16} h={0.04} r={[-Math.PI / 2, 0, Math.PI]} />
      <Label text="MIKROFON" p={[SWITCH[0] + 0.15, RACK.h + 0.002, SWITCH[2] + 0.06]} w={0.16} h={0.04} r={[-Math.PI / 2, 0, Math.PI]} />
      <group position={[SWITCH[0], RACK.h, SWITCH[2]]} rotation={[(-0.45 + 0.9 * lever), 0, 0]}>
        <M g={cylG(0.008, 0.01, 0.07, 10)} c="#d0c8b8" tex="metal" p={[0, 0.035, 0]} cast={false} />
        <M g={sphG(0.014, 10)} c="#c0392b" p={[0, 0.072, 0]} cast={false} />
      </group>
      <M g={boxG(0.06, 0.012, 0.12)} c="#55555c" tex="metal" p={[SWITCH[0], RACK.h + 0.006, SWITCH[2]]} cast={false} />
    </group>
  );
};

// ------------------------------------------------------------------ the guard (v5: a whole body; v4 drew a floating sleeve)
/** the guard: BAPAK_B's body in a khaki uniform (the S03 photo's sleeve colour), dark trousers, 1.62 m */
export const SATPAM: NpcPreset = { ...BAPAK_B, id: "satpam-v5", label: "satpam", height: 1.62, shirt: { color: "#7d6f4a", dark: "#6a5d3c", cuff: "#5e5236" }, accessory: undefined, pose: undefined, hair: { ...BAPAK_B.hair, color: "#1a1816" }, limbs: { ...(BAPAK_B.limbs as object), pants: "#2b2a2e", shoes: "#1c1a18" } as NpcPreset["limbs"], blinkSeed: 71 };
const SLEEVE = "#7d6f4a", GLOVE = "#1c1c20";
const Seg: React.FC<{ a: V3; b: V3; r0: number; r1: number; c: string }> = ({ a, b, r0, r1, c }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return (
    <group position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q}>
      <M g={cylG(r1, r0, d.length(), 14)} c={c} tex="fabric" cast={false} />
    </group>
  );
};
/** long uniform sleeves over both arms and dark gloves (the index finger out when `point` > 0), from the guard's arm pose */
export const GuardWear: React.FC<{ root: V3; yaw: number; h: number; pose: Record<string, unknown>; point: number }> = ({ root, yaw, h, pose, point }) => (
  <>
    {(["L", "R"] as const).map((side) => {
      const a = pose[side === "L" ? "armL" : "armR"] as number[];
      const [S, E, H] = armWorld([a[0], a[1], pose[side === "L" ? "armLFwd" : "armRFwd"] as number] as never, side, root, yaw, h) as V3[];
      const fd = new THREE.Vector3(H[0] - E[0], H[1] - E[1], H[2] - E[2]).normalize();
      const W: V3 = [H[0] - fd.x * 0.045, H[1] - fd.y * 0.045, H[2] - fd.z * 0.045];
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), fd);
      const pt = side === "R" ? point : 0;
      return (
        <group key={side}>
          <Seg a={[S[0], S[1] + 0.01, S[2]]} b={E} r0={0.047} r1={0.043} c={SLEEVE} />
          <Seg a={E} b={W} r0={0.043} r1={0.038} c={SLEEVE} />
          <group position={H} quaternion={q}>
            <M g={boxG(0.075, 0.042, 0.068)} c={GLOVE} tex="fabric" p={[0.0, 0, 0]} cast={false} />
            <M g={boxG(0.035, 0.03, 0.062)} c={GLOVE} tex="fabric" p={[0.05 - 0.02 * pt, -0.008, 0]} cast={false} />
            {pt > 0 ? <M g={boxG(0.06 * pt + 0.01, 0.018, 0.018)} c={GLOVE} tex="fabric" p={[0.04 + 0.03 * pt, 0.006, -0.018]} cast={false} /> : null}
          </group>
        </group>
      );
    })}
  </>
);
/** the key (brass) with a white card tag "RUANG TOA" */
/** v4's floating sleeve + glove: kept ONLY for the S03 proof photo still (Chan006 "proof", already rendered to proof.png) */
export const GuardHand: React.FC<{ p: V3; yaw?: number; pitch?: number; keyIn?: boolean; point?: number }> = ({ p, yaw = 0, pitch = 0, keyIn = true, point = 0 }) => (
  <group position={p} rotation={[0, yaw, pitch]}>
    <M g={cylG(0.042, 0.048, 0.34, 14)} c="#7d6f4a" tex="fabric" p={[-0.2, 0, 0]} r={[0, 0, Math.PI / 2]} />
    <M g={boxG(0.02, 0.1, 0.1)} c="#5e5236" tex="fabric" p={[-0.04, 0, 0]} />
    <M g={boxG(0.08, 0.035, 0.075)} c="#1c1c20" tex="fabric" p={[0.01, 0, 0]} />
    <M g={boxG(0.05, 0.03, 0.07)} c="#1c1c20" tex="fabric" p={[0.06, -0.012, 0]} />
    <M g={boxG(0.055 + 0.04 * point, 0.018, 0.02)} c="#1c1c20" tex="fabric" p={[0.075 + 0.02 * point, 0.008, -0.02]} />
    <M g={boxG(0.04, 0.02, 0.022)} c="#1c1c20" tex="fabric" p={[0.04, 0.012, 0.04]} />
    {keyIn ? <KeyTag p={[0.09, 0.0, 0.02]} /> : null}
  </group>
);
/** local frame: the blade's root at the origin, the blade along +x (tip at +0.05), the bow at -0.006 */
export const KeyTag: React.FC<{ p: V3; r?: V3; tag?: boolean }> = ({ p, r, tag = true }) => (
  <group position={p} rotation={r}>
    <M g={boxG(0.05, 0.01, 0.003)} c="#c9a54a" tex="metal" p={[0.025, 0, 0]} cast={false} />
    <M g={cylG(0.012, 0.012, 0.003, 14)} c="#c9a54a" tex="metal" p={[-0.012, 0, 0]} r={[Math.PI / 2, 0, 0]} cast={false} />
    {tag ? <KeyCard p={[-0.05, -0.035, 0]} /> : null}
  </group>
);
export const KeyCard: React.FC<{ p: V3; r?: V3 }> = ({ p, r }) => (
  <group position={p} rotation={r}>
    <mesh><planeGeometry args={[0.075, 0.04]} /><meshBasicMaterial map={textTex("RUANG TOA", 256, 136, "#f2eee2", "#2a2620", 44)} side={THREE.DoubleSide} /></mesh>
  </group>
);
