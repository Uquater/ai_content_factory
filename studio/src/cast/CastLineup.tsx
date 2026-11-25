// CastLineup002: the 3D cast lineup for Content Unit 2026-11-002 — C1 (approved, unchanged), adik (C3) and three
// villager presets (npc.tsx), standing on one floor line parallel to the image plane, one camera with no tilt and no
// yaw (pixel heights stay comparable), neutral day light, labels as an HTML overlay. A review sheet, not a shot.
// Variants for QC only: "threeq" (all turned 40°) and "back" (all turned 180°) show depth problems the front hides.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1, C1_HEIGHT } from "../c1/C1";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { ADIK, ANAK_WARGA, BALITA, BAPAK, IBU, Npc, presetHeight } from "./npc";
import type { NpcPreset } from "./npc";

const W = 1920;
const H = 1080;
const FOV = 30;
const CAM_Y = 0.82;
const CAM_D = 4.3;
const SPACING = 0.66;
type Slot = { label: string; preset?: NpcPreset };
const SLOTS: Slot[] = [{ label: "C1" }, { label: ADIK.label, preset: ADIK }, { label: BAPAK.label, preset: BAPAK }, { label: IBU.label, preset: IBU }, { label: ANAK_WARGA.label, preset: ANAK_WARGA }, { label: "Balita", preset: BALITA }];
const xOf = (i: number) => (i - (SLOTS.length - 1) / 2) * SPACING;
/** screen x of a world x on the z = 0 line (camera on the axis, no yaw) */
const screenX = (x: number) => W / 2 + (x / CAM_D) * (H / 2 / Math.tan(((FOV / 2) * Math.PI) / 180));
const fmt = (v: number) => v.toFixed(2).replace(".", ",");

export const CastLineup: React.FC<{ view?: "front" | "threeq" | "back" }> = ({ view = "front" }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#d9d6d0" }} />;
  const t = 2.0; // fixed instant (breath phase); blink is off at this t for every seed used
  const m = moodOf("day");
  const cam = aim([0, CAM_Y, CAM_D], [0, CAM_Y, 0], FOV, 0.5);
  const yaw = view === "back" ? Math.PI : view === "threeq" ? -0.7 : 0;
  return (
    <AbsoluteFill style={{ background: "#d9d6d0" }}>
      <View mood={m} cam={cam} t={t} focus={[0, 0.9, 0]} blur={0} sky={false} width={W} height={H}>
        <M g={boxG(16, 0.1, 10)} c="#d6d0c6" p={[0, -0.05, -1]} />
        <M g={boxG(16, 5, 0.2)} c="#e4e0d8" p={[0, 2.4, -2.2]} />
        {SLOTS.map((s, i) =>
          s.preset ? (
            <Npc key={s.label} preset={s.preset} position={[xOf(i), 0, 0]} yaw={yaw} t={t} />
          ) : (
            <C1 key={s.label} position={[xOf(i), 0, 0]} yaw={yaw} t={t} face={{ mouth: "smile" }} />
          ),
        )}
        <CastLight at={[0, 1.3, 0]} cam={cam.pos} mood={m} />
      </View>
      {SLOTS.map((s, i) => {
        const h = s.preset ? presetHeight(s.preset).hair : C1_HEIGHT;
        return (
          <div key={s.label} style={{ position: "absolute", top: H - 92, left: screenX(xOf(i)) - 160, width: 320, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 30, color: "#2a2430" }}>
            {s.label}
            <div style={{ fontWeight: 700, fontSize: 22, color: "#5a5260" }}>{`${fmt(h / C1_HEIGHT)} × C1`}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 36, top: 28, fontFamily: "Poppins", fontWeight: 800, fontSize: 26, color: "#5a5260" }}>
        {`2026-11-002 · lineup 3D v3 · USULAN MODEL, belum disetujui${view === "front" ? "" : ` · QC ${view}`}`}
      </div>
    </AbsoluteFill>
  );
};
