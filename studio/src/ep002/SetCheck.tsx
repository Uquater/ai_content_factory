// 2026-11-002 set check stills (one camera preset per view) with stand-in figures for scale and night readability.
// view = which camera preset to show. The presets are exported (SET_CAMS) so the animatic can reuse them.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { moodOf } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { ADIK, BAPAK, IBU, Npc } from "../cast/npc";
import { KAMAR, STREET, TAMU } from "./geo";
import { HouseInterior, StreetSet } from "./sets";

export const SET_VIEWS = ["a01", "toa", "plate", "kamar", "tamu", "lorong", "a17", "pov", "bed"] as const;
type View_ = (typeof SET_VIEWS)[number];
const cam = (pos: V3, look: V3, fov: number): Cam => ({ pos, look, fov, roll: 0 });

/** camera presets (world metres, geo.ts frame) */
export const SET_CAMS: Record<View_, Cam> = {
  a01: cam([-14.0, 9.0, 13.0], [6.0, 1.5, 3.5], 50),
  toa: cam([15.2, 1.6, 7.4], [18.0, 6.1, 4.7], 42),
  plate: cam([-1.75, 1.15, 5.9], [-1.95, 1.05, 4.375], 30),
  kamar: cam([3.0, 1.5, 2.65], [1.0, 1.0, -0.1], 56),
  tamu: cam([0.85, 1.5, -0.6], [-3.6, 1.1, 2.2], 60),
  lorong: cam([-0.8, 1.45, 0.9], [-0.8, 1.15, -5.0], 46),
  a17: cam([0.75, 1.5, 2.55], [-2.6, 1.05, -2.6], 58),
  pov: cam([2.6, 1.45, 2.2], [1.9, 0.95, 10.0], 46),
  bed: cam([1.35, 1.55, 1.9], [3.1, 0.55, -0.45], 52),
};
const EXTERIOR: View_[] = ["a01", "toa", "plate", "pov"];
/** View exposure offsets that read as night: exterior a little down, dark interiors clearly down, lamp-lit tamu as is */
export const SET_EXPOSURE = { exterior: -0.18, darkInterior: -0.45, litInterior: 0 };
const EXPOSURE: Record<View_, number> = { a01: -0.18, toa: -0.18, plate: -0.18, pov: -0.18, kamar: -0.45, tamu: 0, lorong: -0.45, a17: -0.45, bed: -0.45 };

export const SetCheck: React.FC<{ view: View_ }> = ({ view }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#141a3a" }} />;
  const c = SET_CAMS[view];
  const ext = EXTERIOR.includes(view);
  const lit = view === "tamu";
  const m = moodOf(ext ? "night" : lit ? "lamp" : "night");
  const t = 2;
  // stand-ins: villagers on the walking line outside; C1 / adik inside
  const extFigs = (
    <>
      <Npc preset={BAPAK} position={[2.0, 0, STREET.walkZ]} yaw={Math.PI / 2} t={t} />
      <Npc preset={IBU} position={[-1.5, 0, STREET.walkZ + 0.4]} yaw={Math.PI / 2} t={t} />
    </>
  );
  const intFig =
    view === "kamar" ? (
      <>
        <C1 position={[1.75, 0, 1.9]} yaw={0.9} t={t} face={{ mouth: "flat" }} />
        <Npc preset={ADIK} position={[0.75, 0, KAMAR.door.z]} yaw={Math.PI / 2} t={t} />
      </>
    ) : view === "tamu" ? (
      <>
        <C1 position={[-1.4, 0, 1.6]} yaw={0.9} t={t} face={{ mouth: "flat" }} />
        <Npc preset={ADIK} position={[-2.3, 0, 2.45]} yaw={0.3} t={t} />
      </>
    ) : view === "a17" ? (
      <>
        <C1 position={[-1.2, 0, 0.7]} yaw={0.6} t={t} face={{ mouth: "flat" }} />
        <Npc preset={ADIK} position={[-1.65, 0, 0.75]} yaw={0.6} t={t} />
      </>
    ) : null;
  const focus: V3 = ext ? c.look : view === "kamar" ? [2.0, 1.1, 1.6] : [-1.3, 1.1, 1.2];
  return (
    <AbsoluteFill style={{ background: "#141a3a" }}>
      <View mood={m} cam={c} t={t} focus={focus} blur={0} sky={ext} exposure={EXPOSURE[view]}>
        {ext ? (
          <>
            <StreetSet t={t} tamuLit={1} neighbourDoorsOpen={view === "a01" ? 0 : 1} house7={view === "pov" ? "none" : "full"} />
            {view === "pov" ? <HouseInterior tamuLamp={0} t={t} windowGlass="clear" /> : null}
            {view === "a01" || view === "pov" ? extFigs : null}
            {/* with the combined sets the bedroom's real curtains frame the view; PovCurtainFrame is for street-only shots */}
            <CastLight at={view === "pov" || view === "a01" ? [0.5, 1.3, STREET.walkZ] : c.look} cam={c.pos} mood={m} />
          </>
        ) : (
          <>
            <HouseInterior tamuLamp={view === "tamu" || view === "kamar" ? 1 : 0} t={t} />
            {intFig}
            <CastLight at={view === "kamar" ? [2.0, 1.3, 1.6] : view === "lorong" ? [-0.8, 1.3, -3] : [TAMU.lamp[0], 1.3, 1.0]} cam={c.pos} mood={m} />
          </>
        )}
      </View>
      <div style={{ position: "absolute", left: 36, top: 40, fontFamily: "Poppins", fontWeight: 800, fontSize: 34, color: "#e8ecff", textShadow: "0 0 8px #000" }}>{`ep002 set · ${view}${view === "kamar" ? ` (bed ${KAMAR.bed.x0}–${KAMAR.bed.x1})` : ""}`}</div>
    </AbsoluteFill>
  );
};
