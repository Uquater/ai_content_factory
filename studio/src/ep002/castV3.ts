// 2026-11-17 (D-031/D-033): every 2026-11-002 character in the approved bodied design (white arms, pants, shoes,
// thin ink). C1_BODIED / ADIK_B / BAPAK_B / IBU_B were shown to the owner in look-dev v1/v2; the others follow the same
// rule (same family). The stick presets in cast/npc.tsx stay unchanged for the old animatic.
import { ANAK_WARGA, BALITA, HAIR, WARGA_3, WARGA_4, WARGA_5 } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";
import { ADIK_B, BAPAK_B, bodied, IBU_B } from "./LookDev";

export { ADIK_B, BAPAK_B, IBU_B };
export const ANAK_B: NpcPreset = bodied(ANAK_WARGA, "#2e3a44", "#3a3a3a");
export const BALITA_B: NpcPreset = { ...bodied(BALITA, BALITA.pants?.color ?? "#6a5440", "#c8b8a0"), limbs: { pants: BALITA.pants?.color ?? "#6a5440", shoes: "#c8b8a0", feet: "bare" } };
export const W3_B: NpcPreset = bodied(WARGA_3, "#2e3036");
export const W4_B: NpcPreset = bodied(WARGA_4, "#3e3446");
export const W5_B: NpcPreset = bodied(WARGA_5, "#4a4438");
export const CARRY_B = { mom: IBU_B, kid: BALITA_B };

// ---- 2026-11-17: appearance variants for the extra villagers (same family, same rig; colours / hair / accessory)
const HAIR_BLACK = "#16141a";
const vary = (p: NpcPreset, id: string, shirt: string, dark: string, pants: string, extra: Partial<NpcPreset> = {}): NpcPreset =>
  bodied({ ...p, id, shirt: { color: shirt, dark, cuff: dark }, ...extra }, pants);
export const W6_B: NpcPreset = vary(WARGA_3, "W6-v1", "#5f7a5a", "#4f6a4a", "#2e2c34", { hair: { ...HAIR.messyShort, color: HAIR_BLACK }, height: 1.52, blinkSeed: 43 });
export const W7_B: NpcPreset = vary(WARGA_4, "W7-v1", "#5a6e96", "#4a5e86", "#3a3040", { height: 1.38, blinkSeed: 47 });
export const W8_B: NpcPreset = vary(BAPAK_B, "W8-v1", "#9a6a4a", "#86583c", "#2e2a28", { accessory: undefined, height: 1.56, blinkSeed: 53 });
export const W9_B: NpcPreset = vary(ANAK_WARGA, "W9-v1", "#b0603a", "#9a5030", "#2a3440", { blinkSeed: 59 });
export const W10_B: NpcPreset = vary(WARGA_5, "W10-v1", "#7a5a7a", "#684a68", "#34323a", { hair: { ...HAIR.short, color: "#4a4a50", fringe: 0.5 }, blinkSeed: 61 });
