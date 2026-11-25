// Review stills for the 2026-11-002 cast revision (2026-11-16): the carry pose from four sides, close details of adik's
// hair and of the hands, and one check in the night light planned for the episode's exterior shots (mood "night").
// Review sheets only (not shots). Labels are HTML overlays.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C1 } from "../c1/C1";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { boxG, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import { IbuGendong } from "./carry";
import { ADIK, ANAK_WARGA, BAPAK, IBU, Npc } from "./npc";

const W = 1920;
const H = 1080;
const T = 2.0;
const Tag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 36, top: 28, fontFamily: "Poppins", fontWeight: 800, fontSize: 26, color: "#5a5260", textShadow: "0 0 6px rgba(255,255,255,0.6)" }}>{text}</div>
);
const Labels: React.FC<{ items: { x: number; text: string }[]; y?: number; color?: string }> = ({ items, y = H - 70, color = "#2a2430" }) => (
  <>
    {items.map((it) => (
      <div key={it.text} style={{ position: "absolute", top: y, left: it.x - 200, width: 400, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 26, color }}>
        {it.text}
      </div>
    ))}
  </>
);
const sx = (x: number, d: number, fov = 30) => W / 2 + (x / d) * (H / 2 / Math.tan(((fov / 2) * Math.PI) / 180));
const Room: React.FC = () => (
  <>
    <M g={boxG(16, 0.1, 10)} c="#d6d0c6" p={[0, -0.05, -1]} />
    <M g={boxG(16, 5, 0.2)} c="#e4e0d8" p={[0, 2.4, -2.6]} />
  </>
);

/** the carry pose: front, 3/4 (her left side, where the toddler sits), side, back */
export const CarryPreview: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#d9d6d0" }} />;
  const m = moodOf("day");
  const D = 5.2;
  const cam = aim([0, 0.8, D], [0, 0.8, 0], 30, 0.5);
  const views = [
    { yaw: 0, text: "depan" },
    { yaw: -0.8, text: "3/4 (sisi kiri ibu)" },
    { yaw: -Math.PI / 2, text: "samping" },
    { yaw: Math.PI, text: "belakang" },
  ];
  const xs = views.map((_, i) => (i - 1.5) * 1.15);
  return (
    <AbsoluteFill style={{ background: "#d9d6d0" }}>
      <View mood={m} cam={cam} t={T} focus={[0, 0.9, 0]} blur={0} sky={false} width={W} height={H}>
        <Room />
        {views.map((v, i) => (
          <IbuGendong key={v.text} position={[xs[i], 0, 0]} yaw={v.yaw} t={T} />
        ))}
        <CastLight at={[0, 1.1, 0]} cam={cam.pos} mood={m} />
      </View>
      <Labels items={views.map((v, i) => ({ x: sx(xs[i], D), text: v.text }))} />
      <Tag text="2026-11-002 · ibu (W2) menggendong balita · pose statis v2 · USULAN, belum disetujui" />
    </AbsoluteFill>
  );
};

/** close details: adik's hair from four sides, or the hands of the presets at 1:1-ish scale */
export const CastDetail: React.FC<{ part: "hair" | "hands" }> = ({ part }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#d9d6d0" }} />;
  const m = moodOf("day");
  if (part === "hair") {
    const D = 2.6;
    const cam = aim([0, 1.0, D], [0, 1.0, 0], 30, 0.5);
    const views = [
      { yaw: 0, text: "depan" },
      { yaw: -0.75, text: "3/4" },
      { yaw: -Math.PI / 2, text: "samping" },
      { yaw: Math.PI, text: "belakang" },
    ];
    const xs = views.map((_, i) => (i - 1.5) * 0.6);
    return (
      <AbsoluteFill style={{ background: "#d9d6d0" }}>
        <View mood={m} cam={cam} t={T} focus={[0, 1.05, 0]} blur={0} sky={false} width={W} height={H}>
          <Room />
          {views.map((v, i) => (
            <Npc key={v.text} preset={ADIK} position={[xs[i], 0, 0]} yaw={v.yaw} t={T} />
          ))}
          <CastLight at={[0, 1.1, 0]} cam={cam.pos} mood={m} />
        </View>
        <Labels items={views.map((v, i) => ({ x: sx(xs[i], D), text: v.text }))} y={H - 70} />
        <Tag text="2026-11-002 · rambut adik rev (bob lebih mengikuti kepala) · USULAN" />
      </AbsoluteFill>
    );
  }
  const D = 2.5;
  const cam = aim([0, 0.75, D], [0, 0.75, 0], 30, 0.5);
  const who = [
    { p: ADIK, text: "adik" },
    { p: BAPAK, text: "bapak" },
    { p: IBU, text: "ibu" },
    { p: ANAK_WARGA, text: "anak warga" },
  ];
  const xs = who.map((_, i) => (i - 1.5) * 0.62);
  return (
    <AbsoluteFill style={{ background: "#d9d6d0" }}>
      <View mood={m} cam={cam} t={T} focus={[0, 0.7, 0]} blur={0} sky={false} width={W} height={H}>
        <Room />
        {who.map((w, i) => (
          <Npc key={w.text} preset={w.p} position={[xs[i], 0, 0]} yaw={0} t={T} />
        ))}
        <CastLight at={[0, 0.9, 0]} cam={cam.pos} mood={m} />
      </View>
      <Labels items={who.map((w, i) => ({ x: sx(xs[i], D), text: w.text }))} y={H - 70} />
      <Tag text="2026-11-002 · tangan oval NPC rev (C1 dan Tyo tidak berubah) · USULAN" />
    </AbsoluteFill>
  );
};

/** one check still in the episode's planned exterior night light (mood "night", moon key + warm practical) */
export const NightCheck: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#141a3a" }} />;
  const m = moodOf("night");
  const D = 4.6;
  const cam = aim([0, 0.95, D], [0, 0.85, 0], 30, 0.5);
  const xs = [-1.65, -0.85, 0.05, 0.95, 1.7];
  return (
    <AbsoluteFill style={{ background: "#141a3a" }}>
      <View mood={m} cam={cam} t={T} focus={[0, 0.9, 0]} blur={0} sky width={W} height={H}>
        <M g={boxG(20, 0.1, 12)} c="#4a4a52" p={[0, -0.05, -1]} />
        <M g={boxG(20, 4, 0.2)} c="#8a8478" p={[0, 2, -3.2]} />
        <C1 position={[xs[0], 0, 0]} yaw={0} t={T} face={{ mouth: "flat", brows: "worried" }} />
        <Npc preset={ADIK} position={[xs[1], 0, 0]} yaw={0} t={T} />
        <IbuGendong position={[xs[2], 0, 0]} yaw={-0.3} t={T} />
        <Npc preset={BAPAK} position={[xs[3], 0, 0]} yaw={0} t={T} />
        <Npc preset={ANAK_WARGA} position={[xs[4], 0, 0]} yaw={0} t={T} />
        <CastLight at={[0, 1.2, 0]} cam={cam.pos} mood={m} />
      </View>
      <div style={{ position: "absolute", left: 36, top: 28, fontFamily: "Poppins", fontWeight: 800, fontSize: 26, color: "#e8ecff" }}>2026-11-002 · cek cahaya malam (mood night, tanpa lampu jalan) · bukan shot · USULAN</div>
    </AbsoluteFill>
  );
};

/** QC close-up of the carry seat area (support and contacts), one view per still: front, side (her left), below */
export const CarryClose: React.FC<{ view: "front" | "side" | "below" }> = ({ view }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#d9d6d0" }} />;
  const m = moodOf("day");
  const at: [number, number, number] = [0.25, 0.8, 0.05];
  const from: [number, number, number] = view === "front" ? [0.25, 0.85, 1.05] : view === "side" ? [1.1, 0.85, 0.12] : [0.4, 0.3, 0.75];
  const cam = { pos: from, look: at, fov: 30, roll: 0 };
  return (
    <AbsoluteFill style={{ background: "#d9d6d0" }}>
      <View mood={m} cam={cam} t={T} focus={at} blur={0} sky={false} width={W} height={H}>
        <Room />
        <IbuGendong position={[0, 0, 0]} yaw={0} t={T} />
        <CastLight at={[0.15, 1.1, 0.1]} cam={cam.pos} mood={m} />
      </View>
      <Tag text={`QC gendong: area dudukan · ${view}`} />
    </AbsoluteFill>
  );
};
