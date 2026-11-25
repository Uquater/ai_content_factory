// 2026-11-002 look-dev stills (STUDIO-WORKFLOW S6, D-029/D-030): bodied characters (white arms, pants, shoes),
// thin ink, night light from visible sources. One still per location + light the episode uses. PROPOSAL — the
// looks below are not approved; the approved C1_LOOK / presets stay untouched.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1, C1_LOOK } from "../c1/C1";
import type { StickLook } from "../c1/C1";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { moodOf } from "../inkbeat/core/moods";
import type { MoodPreset } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK, BAPAK, IBU, Npc } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";
import { STREET } from "./geo";
import { HouseInterior, StreetSet } from "./sets";

export const LOOKDEV_VIEWS = ["tamu", "gelap", "kamar", "jalan"] as const;
type LV = (typeof LOOKDEV_VIEWS)[number];

/** thin ink (D-029): character hull ink at this fraction, post outline thinner and lighter */
export const THIN_INK_K = 0.55;
const BODIED = { pants: "#2c2f3a", shoes: "#3a2c24", sole: "#cfc8bc" };
/** C1 with bodied limbs (head, face, "Uq" tee and finger hands unchanged) */
export const C1_BODIED: StickLook = { ...C1_LOOK, id: "C1-bodied-v1", limbs: BODIED, inkK: THIN_INK_K };
export const bodied = (p: NpcPreset, pants: string, shoes = "#4a3a2e"): NpcPreset => ({ ...p, id: `${p.id}-bodied`, limbs: { pants, shoes, sole: "#cfc8bc" }, inkK: THIN_INK_K });
export const ADIK_B = bodied(ADIK, ADIK.pants?.color ?? "#c88264", "#8a5a48");
export const BAPAK_B = bodied(BAPAK, "#3a3428");
export const IBU_B = bodied(IBU, "#4a3448");

/** a mood with thin, lighter ink (sets: faint silhouettes; characters keep thin hull ink) and a darker night:
 * ambient (hemi, fill, lens fill, cast fill) scaled by `amb`, the key by `key`; practicals (lamp) untouched; the grade
 * lift goes near black so real blacks exist (style target: night L* 20–30, >= 35 % pixels below L* 15) */
export const thin = (id: string, inkColor: string, amb = 1, key = 1, rim = key, cast = 1): MoodPreset => {
  const m = moodOf(id);
  const L = m.lights;
  return {
    ...m,
    lights: { ...L, hemi: { ...L.hemi, intensity: L.hemi.intensity * amb }, fill: { ...L.fill, intensity: L.fill.intensity * amb }, key: { ...L.key, intensity: L.key.intensity * key }, rim: { ...L.rim, intensity: L.rim.intensity * rim } },
    camFill: { ...m.camFill, intensity: m.camFill.intensity * amb },
    castLight: { rim: { ...m.castLight.rim, intensity: m.castLight.rim.intensity * cast }, fill: { ...m.castLight.fill, intensity: m.castLight.fill.intensity * amb } },
    post: {
      ...m.post,
      outline: { ...m.post.outline, color: inkColor, widthPx: 1.5, strength: 0.55, normalThreshold: 0.6 },
      grade: { ...m.post.grade, lift: amb < 1 ? "#08070c" : m.post.grade.lift },
    },
  };
};
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });

type Setup = { cam: Cam; mood: MoodPreset; exposure: number; light: V3; moon?: number; /** living-room lamp 0..1 */ lamp?: number };
/** night ink colour (lighter than the night, so thin lines stay visible) and the warm-interior ink */
export const INK_NIGHT = "#5a68a8";
export const INK_WARM = "#2a1a1e";
const SETUPS: Record<LV, Setup> = {
  // living room, lamp on (A08–A12): the ceiling lamp in frame is the warm source; corners fall off to dark
  tamu: { cam: cam([0.55, 1.5, -0.65], [-2.1, 1.05, 2.3], 58), mood: thin("lamp", "#2a1a1e", 0.08, 0.04), exposure: -0.22, moon: 0.06, lamp: 0.3, light: [-1.9, 1.3, 1.7] },
  // same room after the switch (A13–A16): moonlight from the window, everything else near black
  gelap: { cam: cam([0.55, 1.5, -0.65], [-2.1, 1.05, 2.3], 58), mood: thin("night", "#5a68a8", 0.04, 0.03), exposure: -0.1, moon: 0.2, light: [-1.9, 1.3, 1.7] },
  kamar: { cam: cam([3.55, 1.5, 2.35], [1.5, 1.0, 0.2], 60), mood: thin("night", "#5a68a8", 0.1, 0.06), exposure: 0, moon: 0.3, light: [1.7, 1.3, 1.0] },
  jalan: { cam: cam([-3.2, 1.6, STREET.walkZ + 4.2], [0.8, 1.1, STREET.walkZ], 50), mood: thin("night", "#5a68a8", 0.25, 0.6), exposure: 0, light: [0, 1.3, STREET.walkZ] },
};

/** v2 (D-031): local light (sets.tsx light="local": pooled lamp, moon spot cones, street-lamp pools) and set dressing.
 * The mood keeps only a whisper of ambient and no directional key; the practicals light the room. */
const SETUPS_V2: Record<LV, Setup> = {
  tamu: { ...SETUPS.tamu, mood: thin("lamp", INK_WARM, 0.06, 0, 0.15, 0.3), exposure: 0, moon: 0.25, lamp: 1 },
  gelap: { ...SETUPS.gelap, mood: thin("night", INK_NIGHT, 0.05, 0, 0.12, 0.3), exposure: 0, moon: 1 },
  kamar: { ...SETUPS.kamar, mood: thin("night", INK_NIGHT, 0.05, 0, 0.12, 0.3), exposure: 0, moon: 1 },
  jalan: { ...SETUPS.jalan, mood: thin("night", INK_NIGHT, 0.12, 0.2, 0.3), exposure: 0 },
};

export const LookDev002: React.FC<{ view: LV; v?: 1 | 2 }> = ({ view, v = 1 }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#0c0e1c" }} />;
  const s = (v === 2 ? SETUPS_V2 : SETUPS)[view];
  const local = v === 2 ? ("local" as const) : undefined;
  const t = 2;
  const c = s.cam.pos;
  const inside = view !== "jalan";
  return (
    <AbsoluteFill style={{ background: "#0c0e1c" }}>
      <View mood={s.mood} cam={s.cam} t={t} focus={s.light} blur={0.5} sky={!inside} exposure={s.exposure}>
        {inside ? (
          <HouseInterior tamuLamp={s.lamp ?? 0} t={t} moon={s.moon} light={local} dressing={v === 2} />
        ) : (
          <StreetSet t={t} tamuLit={0} neighbourDoorsOpen={1} house7="full" light={local} />
        )}
        {view === "tamu" || view === "gelap" ? (
          <>
            <C1 look={C1_BODIED} position={[-1.45, 0, 1.95]} yaw={-0.6} faceCamera={c} t={t} face={view === "gelap" ? { mouth: "open", brows: "worried" } : { mouth: "flat" }} />
            <Npc preset={ADIK_B} position={[-2.45, 0, 1.45]} faceCamera={c} t={t} />
          </>
        ) : view === "kamar" ? (
          <>
            <C1 look={C1_BODIED} position={[2.45, 0, 0.95]} yaw={-1.2} faceCamera={c} t={t} face={{ mouth: "flat" }} />
            <Npc preset={ADIK_B} position={[1.3, 0, 0.4]} faceCamera={c} t={t} />
          </>
        ) : (
          <>
            <Npc preset={BAPAK_B} position={[0.6, 0, STREET.walkZ]} faceCamera={c} t={t} />
            <Npc preset={IBU_B} position={[-0.5, 0, STREET.walkZ + 0.5]} faceCamera={c} t={t} />
          </>
        )}
        <CastLight at={s.light} cam={c} mood={s.mood} />
      </View>
      <div style={{ position: "absolute", left: 36, top: 40, fontFamily: "Poppins", fontWeight: 800, fontSize: 30, color: "#e8ecff", textShadow: "0 0 8px #000" }}>{`look-dev${v === 2 ? " v2" : ""} · ${view}`}</div>
    </AbsoluteFill>
  );
};
