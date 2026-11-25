// Episode 3 (2026-11-004) — LOOK-DEV v1 of the NEW assets only (content.md §12; owner 2026-11-20, D-048).
// The house, cast, light (NIGHT_INT, local light, dressing, vent "lit2") are Episode 2's approved set, unchanged.
// New: hidden cameras + red LED (box type for the living room / kitchen / bedroom, flush ceiling-coloured disc for the
// hallway), a screen-space LED halo (DOM overlay at the LED's projected position: fixed diameter, untouched by the
// ink pass), the back-door inner knob with a slot (drawn 0.5 mm larger over the set's plain sphere, so sets.tsx and
// Episodes 1–2 stay byte-identical), the phone-screen lens glint, the S02 fallback pose, and the unknown-number chat UI.
// Every value is a pure function of the props (one-frame stills).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, cylG, M, sphG } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT, PhoneV3, TorchV3 } from "../ep003/LookDev003";
import { episodeAt } from "../ep003/episode003Stage";
import type { MoodPreset } from "../inkbeat/core/moods";
import { EP2_END, S02 } from "./e004Poses";
import { blockedBy } from "./occlusion004";
import type { Occluder } from "./occlusion004";

const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });
const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };

// ------------------------------------------------------------------ hidden cameras (storyboard §10.2, denah v0.1)
export type LedId = "T" | "D" | "L" | "K";
/** body centre, the direction the lens looks, mount type */
export const CAMS: Record<LedId, { c: V3; dir: V3; kind: "box" | "flush" }> = {
  T: { c: [0.905, 2.665, 2.905], dir: [-1, -0.7, -1], kind: "box" }, // living room, south-east ceiling corner
  D: { c: [0.0, 2.68, -4.13], dir: [-0.35, -1, 0.75], kind: "box" }, // kitchen ceiling, east part
  L: { c: [-0.8, 2.6995, -2.5], dir: [0, -1, 0], kind: "flush" }, // hallway ceiling, flush, ceiling colour
  K: { c: [3.915, 2.5, -0.75], dir: [-1, -0.3, 0.35], kind: "box" }, // bedroom east wall, above the bed head
};
const lookQuat = (c: V3, dir: V3) => {
  const m = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...dir).normalize().multiplyScalar(-1), new THREE.Vector3(0, 1, 0).applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.abs(dir[1]) > 0.95 ? Math.PI / 2 : 0));
  void c;
  return new THREE.Quaternion().setFromRotationMatrix(m); // local +z → dir
};
/** LED position in world space (local offset from the body: beside the lens on the front face) */
export const ledWorld = (id: LedId): V3 => {
  const k = CAMS[id];
  const q = lookQuat(k.c, k.dir);
  const off = k.kind === "box" ? new THREE.Vector3(0.016, 0.012, 0.0205) : new THREE.Vector3(0.009, 0, 0.0012);
  const p = off.applyQuaternion(q).add(new THREE.Vector3(...k.c));
  return [p.x, p.y, p.z];
};
export const lensWorld = (id: LedId): V3 => {
  const k = CAMS[id];
  const q = lookQuat(k.c, k.dir);
  const p = new THREE.Vector3(0, 0, k.kind === "box" ? 0.026 : 0.004).applyQuaternion(q).add(new THREE.Vector3(...k.c));
  return [p.x, p.y, p.z];
};
export const HiddenCam: React.FC<{ id: LedId; on: number }> = ({ id, on }) => {
  const k = CAMS[id];
  const q = lookQuat(k.c, k.dir);
  const led = new THREE.Color("#3a1010").lerp(new THREE.Color("#a81c14"), on);
  return (
    <>
      <group position={k.c} quaternion={q}>
        {k.kind === "box" ? (
          <>
            {/* 5 × 4 × 4 cm dark grey housing, a glossy black lens Ø 1.5 cm, the LED beside it */}
            <M g={boxG(0.05, 0.04, 0.04)} c="#2a2b30" tex="metal" cast={false} />
            <mesh position={[0, 0, 0.021]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0075, 0.0085, 0.006, 20]} />
              <meshPhongMaterial color="#060608" specular="#9aa2b8" shininess={120} />
            </mesh>
            <mesh position={[0.016, 0.012, 0.0205]}>
              <sphereGeometry args={[0.0025, 12, 8]} />
              <meshBasicMaterial color={led} toneMapped={false} />
            </mesh>
          </>
        ) : (
          <group userData={{ outline: false }}>
            {/* D-049: no ink on the flush camera (userData.outline = false: hidden from the ink pre-passes) */}
            {/* flush disc Ø 3 cm: the ceiling's own material (M, "plaster", #efe9dc), 1 mm proud (v1 first try: Lambert
                #e6dfd2, 3.5 mm proud → read as a bright ink-ringed spot) */}
            <group position={[0, 0, 0.0005]} rotation={[Math.PI / 2, 0, 0]}>
              <M g={cylG(0.015, 0.015, 0.001, 28)} c="#efe9dc" tex="plaster" cast={false} />
            </group>
            <mesh position={[0, 0, 0.0012]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.0008, 16]} />
              <meshPhongMaterial color="#121214" specular="#8a90a0" shininess={90} />
            </mesh>
            <mesh position={[0.009, 0, 0.0012]}>
              <sphereGeometry args={[0.0015, 10, 6]} />
              <meshBasicMaterial color={led} toneMapped={false} />
            </mesh>
          </group>
        )}
      </group>
      {/* no point light at the LED: a three.js point light, even at 0.004 cd with a 0.18 m cut-off, tinted ~40 cm of wall red
          (look-dev v1 test); the LED reads by its core + the screen-space halo */}
    </>
  );
};

/** project a world point through the same camera the View uses (fov vertical, 9:16, lookAt, roll 0) */
const project = (c: Cam, p: V3) => {
  const pc = new THREE.PerspectiveCamera(c.fov, 1080 / 1920, 0.02, 600);
  pc.position.set(...c.pos);
  pc.lookAt(...c.look);
  pc.updateMatrixWorld(true);
  const v = new THREE.Vector3(...p).project(pc);
  const front = new THREE.Vector3(...p).sub(pc.position).dot(new THREE.Vector3(...c.look).sub(new THREE.Vector3(...c.pos))) > 0;
  return { x: ((v.x + 1) / 2) * 1080, y: ((1 - v.y) / 2) * 1920, ok: front && Math.abs(v.x) <= 1.05 && Math.abs(v.y) <= 1.05 };
};
/** the LED halo: a soft red disc of FIXED screen size around the LED (≥ 18 px; the LED core alone is 3–8 px) */
export const HALO_PX = 22;
export const HALO_BY_LED: Record<LedId, number> = { T: 22, D: 30, L: 30, K: 30 }; // D-049
export const Halo: React.FC<{ c: Cam; p: V3; on: number; d?: number; occ?: Occluder[] }> = ({ c, p, on, d = HALO_PX, occ = [] }) => {
  const s = project(c, p);
  if (!s.ok || on <= 0) return null;
  // D-049: never drawn over a wall, door or character that stands between the lens and the LED
  if (blockedBy(c.pos, p, occ)) return null;
  return (
    <>
      <div style={{ position: "absolute", left: s.x - d / 2, top: s.y - d / 2, width: d, height: d, borderRadius: d, background: `radial-gradient(circle, rgba(255,70,50,${0.85 * on}) 0%, rgba(255,40,30,${0.45 * on}) 35%, rgba(255,30,20,0) 70%)` }} />
      <div style={{ position: "absolute", left: s.x - 2.5, top: s.y - 2.5, width: 5, height: 5, borderRadius: 5, background: `rgba(255,190,170,${on})` }} />
    </>
  );
};
/** the phone screen's reflection in the glass lens (glass ≈ 4–10 % reflectance of a bright screen = a small dim dot) */
export const Glint: React.FC<{ c: Cam; p: V3; k: number }> = ({ c, p, k }) => {
  const s = project(c, p);
  if (!s.ok || k <= 0) return null;
  return <div style={{ position: "absolute", left: s.x - 4, top: s.y - 4, width: 8, height: 8, borderRadius: 8, background: `radial-gradient(circle, rgba(230,240,255,${0.75 * k}) 0%, rgba(200,220,255,${0.25 * k}) 55%, rgba(200,220,255,0) 100%)` }} />;
};

// ------------------------------------------------------------------ the back-door inner knob with a slot (K1, D-048 butir 5)
export const KNOB: V3 = [-1.15, 1.0, -4.955];
export const KnobSlot: React.FC<{ deg: number; dz?: number }> = ({ deg, dz = 0 }) => (
  <group position={[KNOB[0], KNOB[1], KNOB[2] + dz]}>
    {/* 0.5 mm larger than the set's sphere (r 0.03), same colour and texture: covers it without touching sets.tsx */}
    <M g={sphG(0.0305, 32)} c="#c8b070" tex="metal" cast={false} />
    {/* the slot on the inner face (+z = into the kitchen), turning with the knob about the door normal */}
    {/* D-049: thinner and shorter than look-dev v1 (22 × 4.5 mm → 16 × 3 mm) */}
    <group position={[0, 0, 0.0292]} rotation={[0, 0, (deg * Math.PI) / 180]}>
      <M g={boxG(0.016, 0.003, 0.003)} c="#2e2618" tex="metal" cast={false} />
    </group>
  </group>
);

// ------------------------------------------------------------------ unknown-number chat (Ep 2 PhoneUI2 layout, no shield)
const MSG1 = "Ini petugas keamanan. HP saya diambil. Pesan tadi bukan dari saya.";
const MSG2 = "Mereka bisa lihat semua ruangan. Kecuali satu.";
const PhoneUI3: React.FC<{ second: boolean }> = ({ second }) => (
  <div style={{ position: "absolute", left: 140, top: 150, width: 800, height: 1110, borderRadius: 70, background: "#16151c", border: "12px solid #2a2833", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 18, borderRadius: 54, background: "#e9e6df", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 110, background: "#4a4f5a", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
        {/* a plain person silhouette instead of Ep 2's shield: an unknown number, not the officer's saved chat */}
        <div style={{ width: 66, height: 66, borderRadius: 33, background: "#d9d6cf", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
          <svg width="50" height="52" viewBox="0 0 50 52"><circle cx="25" cy="18" r="11" fill="#8a8e98" /><path d="M3 52 C5 36 15 31 25 31 C35 31 45 36 47 52 Z" fill="#8a8e98" /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* masked: not a real number */}
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 34, color: "#ffffff", letterSpacing: 1 }}>+62 8•• •••• ••17</span>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,0.7)" }}>Nomor tidak dikenal</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: "40px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
        {[MSG1, ...(second ? [MSG2] : [])].map((m) => (
          <div key={m} style={{ alignSelf: "flex-start", maxWidth: 640, padding: "22px 28px", borderRadius: 28, background: "#ffffff", boxShadow: "0 4px 0 rgba(0,0,0,0.12)", fontFamily: "Poppins", fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: "#1b1a22" }}>
            {m}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ------------------------------------------------------------------ the stills
type LD = { cam: Cam; leds: Partial<Record<LedId, number>>; halo?: number; ep2?: number; knob?: number; chars?: "s02" | "rest"; glint?: number; ui?: "msg1" | "msg2"; blur?: number; vent?: number };
const P_S02 = cam([0.62, 1.48, 2.48], [(S02.uq.root[0] + S02.adik.root[0]) / 2, 1.02, (S02.uq.root[2] + S02.adik.root[2]) / 2], 44);
export const LD004: Record<string, LD> = {
  // S09 POV from Uq's eye to the living-room corner (fov 22: middle of the 24 → 20 push)
  "led-tamu-mati": { cam: cam([-1.5, 1.42, 1.95], [0.85, 2.55, 2.85], 22), leds: { T: 0 } },
  "led-tamu-nyala": { cam: cam([-1.5, 1.42, 1.95], [0.85, 2.55, 2.85], 22), leds: { T: 1 } },
  "led-tamu-nyala-layar": { cam: cam([-1.5, 1.42, 1.95], [0.85, 2.55, 2.85], 22), leds: { T: 1 }, glint: 1 },
  // S11 POV from R1 down the hallway (end of the push, fov 28): kitchen + hallway LEDs; and both off (flush disc check)
  "led-lorong-dapur-nyala": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.95, -3.6], 28), leds: { D: 1, L: 1 } },
  "led-lorong-dapur-mati": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.95, -3.6], 28), leds: { D: 0, L: 0 } },
  // v1b: S11 re-aimed ~5° lower (the hallway LED sat on the top edge), 22 px and 30 px halo
  "led-lorong-dapur-nyala-b22": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.6, -3.6], 28), leds: { D: 1, L: 1 } },
  "led-lorong-dapur-nyala-b30": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.6, -3.6], 28), leds: { D: 1, L: 1 }, halo: 30 },
  "led-lorong-dapur-mati-b": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.6, -3.6], 28), leds: { D: 0, L: 0 } },
  // v1c: original aim, fov 32 (the start of the push): the hallway LED ~180 px below the top edge (v1b tilted down = wrong way)
  "led-lorong-dapur-nyala-c32": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.95, -3.6], 32), leds: { D: 1, L: 1 }, halo: 30 },
  "led-kamar-nyala-b30": { cam: cam([-1.5, 1.42, 0.95], [2.6, 1.75, -0.45], 26), leds: { K: 1 }, halo: 30 },
  // D-049 verification: knob 0.6 m in the first 2 s with the vent glow raised (motivated) — levels tried, chosen in QC
  "v2-kenop-060-k3": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 20, blur: 0.8, vent: 3 },
  "v2-kenop-060-k6": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 20, blur: 0.8, vent: 6 },
  "v2-kenop-060-k10": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 20, blur: 0.8, vent: 10 },
  "v2-lorong-c32": { cam: cam([-1.55, 1.42, 1.0], [-0.6, 1.95, -3.6], 32), leds: { D: 1, L: 1 } },
  "v2-kamar": { cam: cam([-1.5, 1.42, 0.95], [2.6, 1.75, -0.45], 26), leds: { K: 1 } },
  "v2-cek-ep2-s06-2890": { cam: cam([0, 0, 0], [0, 0, 1], 40), leds: { L: 0, D: 0 }, ep2: 28.9 },
  // continuity checks: Episode 2's OWN cameras and cast (episodeAt), with the new assets switched off (Ep 2 unchanged)
  "cek-ep2-s06-2890": { cam: cam([0, 0, 0], [0, 0, 1], 40), leds: { L: 0, D: 0 }, ep2: 28.9 },
  "cek-ep2-s04-2250": { cam: cam([0, 0, 0], [0, 0, 1], 40), leds: {}, knob: 0, ep2: 22.5 },
  // S12 POV from R1 through the open bedroom door (fov 26)
  "led-kamar-nyala": { cam: cam([-1.5, 1.42, 0.95], [2.6, 1.75, -0.45], 26), leds: { K: 1 } },
  // S01 knob close-ups in the dark, 0.6 m and 0.35 m, at 0° / 20° / 40° turned
  "kenop-060-00": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 0, blur: 0.8, vent: 1 },
  "kenop-060-20": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 20, blur: 0.8, vent: 1 },
  "kenop-060-40": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 40, blur: 0.8, vent: 1 },
  // variant: the vent's cold glow on the door ×3 (still motivated by the frosted glass above; for the hook's first 2 s)
  "kenop-060-40-terang": { cam: cam([-1.15, 1.03, -4.355], [-1.15, 1.015, -4.955], 30), leds: {}, knob: 40, blur: 0.8, vent: 3 },
  "kenop-035-00": { cam: cam([-1.15, 1.02, -4.605], [-1.15, 1.008, -4.955], 30), leds: {}, knob: 0, blur: 1.0, vent: 1 },
  "kenop-035-40": { cam: cam([-1.15, 1.02, -4.605], [-1.15, 1.008, -4.955], 30), leds: {}, knob: 40, blur: 1.0, vent: 1 },
  // S02 fallback pose from lens P (Ep 1 A17 / Ep 2 S12 position, pushed)
  "pose-s02-cadangan": { cam: P_S02, leds: {}, chars: "s02" },
  // S06 / S14 chat UI over the dark living room (P long lens)
  "ui-pesan-1": { cam: cam([0.68, 1.4, 2.55], [(S02.uq.root[0] + S02.adik.root[0]) / 2, 1.0, (S02.uq.root[2] + S02.adik.root[2]) / 2], 26), leds: {}, chars: "s02", ui: "msg1" },
  "ui-pesan-2": { cam: cam([0.68, 1.4, 2.55], [(S02.uq.root[0] + S02.adik.root[0]) / 2, 1.0, (S02.uq.root[2] + S02.adik.root[2]) / 2], 26), leds: {}, chars: "s02", ui: "msg2" },
};
export const LD004_IDS = Object.keys(LD004);

export const LookDev004: React.FC<{ id: string }> = ({ id }) => {
  const ready = useFonts();
  const v = LD004[id];
  if (!ready || !v) return <AbsoluteFill style={{ background: "#05050a" }} />;
  // continuity check: Episode 2's own stage at that time (camera, cast, torch, bolt), as Episode003.tsx draws it
  const ep = v.ep2 !== undefined ? episodeAt(v.ep2) : null;
  const vc = ep ? ep.cam : v.cam;
  const chars = ep ? ep.chars : v.chars === "s02" ? [S02.uq, S02.adik] : [];
  const rim = (m: MoodPreset, k: number): MoodPreset => (k === 1 ? m : { ...m, castLight: { ...m.castLight, rim: { ...m.castLight.rim, intensity: m.castLight.rim.intensity * k } } });
  const charMood = ep ? rim(charScaled(NIGHT_INT, ep.charK), ep.rimK) : NIGHT_INT;
  const leds = Object.entries(v.leds) as [LedId, number][];
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={NIGHT_INT} cam={vc} t={ep ? ep.ts : 0} focus={ep ? ep.focus : v.cam.look} blur={ep ? (ep.shot === "s04" ? 0.8 : 0.5) : v.blur ?? 0.5}>
        <HouseInterior tamuLamp={0} t={0} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={ep ? ep.bolt : 1} backDoorShake={ep ? ep.doorShake : 0} />
        {(Object.keys(CAMS) as LedId[]).map((k) => <HiddenCam key={k} id={k} on={v.leds[k] ?? 0} />)}
        {v.knob !== undefined ? (
          <>
            <KnobSlot deg={v.knob} />
            {/* the cold moon glow of the vent glass falls on the door from above (motivated; the knob's only light) */}
            <pointLight position={[-0.85, 2.05, -4.7]} color="#9bb0ff" intensity={0.35 * (v.vent ?? 0)} distance={2.2} decay={2} />
          </>
        ) : null}
        {chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={0} pose={c.pose} hands={c.hands} legPose={c.legPose} face={c.face} blinkSeed={c.blinkSeed} />
          ) : (
            <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={0} pose={{ ...(ADIK_B.pose ?? {}), ...c.pose }} legPose={c.legPose} face={c.face} />
          ),
        )}
        {v.chars ? <PhoneV3 p={S02.phone.p} q={S02.phone.q} /> : null}
        {ep ? <PhoneV3 p={ep.phone.p} q={ep.phone.q} /> : null}
        {ep && ep.torch ? <TorchV3 from={ep.torch.from} aim={ep.torch.aim} cover={0.45} leak={ep.torch.leak} leakAt={ep.torch.leakAt} /> : null}
        {chars.length ? <CharLight chars={chars} cam={vc.pos} mood={charMood} /> : null}
      </View>
      {leds.map(([k, on]) => <Halo key={k} c={vc} p={ledWorld(k)} on={on} d={v.halo ?? HALO_BY_LED[k]} occ={chars.map((ch) => ({ root: ch.root, height: ch.height, who: ch.who }))} />)}
      {v.glint ? <Glint c={vc} p={lensWorld("T")} k={v.glint} /> : null}
      {v.ui ? <PhoneUI3 second={v.ui === "msg2"} /> : null}
      {/* frame label (look-dev only) */}
      <div style={{ position: "absolute", left: 24, bottom: 20, fontFamily: "Poppins", fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.55)" }}>lookdev v1 · {id}</div>
    </AbsoluteFill>
  );
};
void sstep;
void EP2_END;
