// A small Indonesian warung kopi interior (late afternoon) for pilot 2026-11-001. Every surface is painted (inkbeat
// textures), dressing sits in three depth layers, ONE warm practical (a hanging bulb) plus the window, no lettering.
// Units: meters. C1 sits on Chair at the table; the table top is TABLE_Y.
import React from "react";
import { boxG, coneG, coreMat, cylG, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";

export const SEAT_Y = 0.36;
export const TABLE_Y = 0.6;

export const Chair: React.FC<{ p: V3; yaw?: number; c?: string }> = ({ p, yaw = 0, c = "#9a6236" }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(0.38, 0.04, 0.36)} c={c} tex="wood" p={[0, SEAT_Y - 0.02, 0]} />
    {[[-0.16, -0.15], [0.16, -0.15], [-0.16, 0.15], [0.16, 0.15]].map(([x, z]) => (
      <M key={`${x}${z}`} g={boxG(0.035, SEAT_Y - 0.04, 0.035)} c={c} tex="wood" p={[x, (SEAT_Y - 0.04) / 2, z]} />
    ))}
    {[-0.16, 0.16].map((x) => (
      <M key={x} g={boxG(0.035, 0.46, 0.035)} c={c} tex="wood" p={[x, SEAT_Y + 0.23, -0.15]} />
    ))}
    <M g={boxG(0.36, 0.1, 0.025)} c={c} tex="wood" p={[0, SEAT_Y + 0.38, -0.155]} />
    <M g={boxG(0.36, 0.05, 0.025)} c={c} tex="wood" p={[0, SEAT_Y + 0.2, -0.155]} />
  </group>
);

export const Table: React.FC<{ p: V3; w?: number; d?: number }> = ({ p, w = 1.5, d = 0.62 }) => (
  <group position={p}>
    <M g={boxG(w, 0.04, d)} c="#c98d55" tex="planks" ts={0.6} p={[0, TABLE_Y - 0.02, 0]} />
    {/* a plastic oilcloth on top, a warung staple: checked, slightly lighter than the edge */}
    <M g={boxG(w - 0.06, 0.004, d - 0.06)} c="#e7e1cf" tex="fabric" ts={0.4} p={[0, TABLE_Y + 0.002, 0]} />
    <M g={boxG(w - 0.04, 0.08, 0.025)} c="#a36c3d" tex="wood" p={[0, TABLE_Y - 0.08, d / 2 - 0.04]} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => (
      <M key={`${sx}${sz}`} g={boxG(0.05, TABLE_Y - 0.04, 0.05)} c="#a36c3d" tex="wood" p={[sx * (w / 2 - 0.07), (TABLE_Y - 0.04) / 2, sz * (d / 2 - 0.07)]} />
    ))}
  </group>
);

/** a glass of black coffee on a small saucer (the classic warung "kopi hitam") */
export const Coffee: React.FC<{ p: V3; steam?: number; t?: number }> = ({ p, steam = 0, t = 0 }) => (
  <group position={p}>
    <M g={cylG(0.062, 0.062, 0.008, 24)} c="#f2efe6" p={[0, 0.004, 0]} />
    <M g={cylG(0.036, 0.03, 0.08, 20)} c="#24130b" p={[0, 0.048, 0]} />
    <M g={cylG(0.039, 0.033, 0.095, 20, true)} c="#e8f2f4" op={0.22} p={[0, 0.056, 0]} />
    <M g={torG(0.038, 0.004)} c="#d9e6ea" p={[0, 0.103, 0]} r={[Math.PI / 2, 0, 0]} />
    <M g={cylG(0.033, 0.033, 0.004, 20)} c="#5a3420" p={[0, 0.09, 0]} />
    {steam > 0
      ? [0, 1, 2].map((i) => {
          const ph = (t * 0.45 + i / 3) % 1;
          return <mesh key={i} geometry={sphG(0.012 + ph * 0.012, 10)} material={coreMat("#f6efe6", 0.9, (1 - ph) * 0.35 * steam)} position={[Math.sin(ph * 5 + i) * 0.012, 0.12 + ph * 0.16, 0]} />;
        })
      : null}
  </group>
);

const Jar: React.FC<{ p: V3; c: string }> = ({ p, c }) => (
  <group position={p}>
    <M g={cylG(0.09, 0.09, 0.26, 18)} c="#cfdde0" op={0.5} p={[0, 0.13, 0]} />
    <M g={cylG(0.084, 0.084, 0.16, 18)} c={c} p={[0, 0.08, 0]} />
    <M g={cylG(0.095, 0.095, 0.035, 18)} c="#c43a32" tex="metal" p={[0, 0.278, 0]} />
  </group>
);

const Sachets: React.FC<{ p: V3 }> = ({ p }) => {
  const cols = ["#e8b23a", "#d9443a", "#3f7fc9", "#4aa35a", "#e07a2a", "#8a4ac0"];
  return (
    <group position={p}>
      <M g={cylG(0.008, 0.008, 1.1, 8)} c="#6a5a4a" p={[0, 0, 0]} r={[0, 0, Math.PI / 2]} />
      {cols.map((c, i) => (
        <group key={i} position={[-0.45 + i * 0.18, -0.05, 0]}>
          {[0, 1, 2].map((k) => (
            <M key={k} g={boxG(0.13, 0.1, 0.012)} c={c} tex="paper" p={[0, -0.07 - k * 0.11, 0.004 * k]} r={[0, 0, (k - 1) * 0.05]} />
          ))}
        </group>
      ))}
    </group>
  );
};

/** the whole set; the table center is at the origin (x), C1's chair is behind it at z = -0.18 */
/** tyoChairX / spareCoffee: the pilot moves Tyo's chair to the table end and drops the spare glass (C1 offers his);
 * the defaults keep the 3D demos exactly as rendered */
export const Warung: React.FC<{ t?: number; bulb?: number; tyoChairX?: number; spareCoffee?: boolean }> = ({ t = 0, bulb = 1, tyoChairX = -0.95, spareCoffee = true }) => (
  <group>
    {/* floor and walls (walls never share a face) */}
    <M g={boxG(14, 0.1, 10)} c="#c9b394" tex="stone" ts={0.8} p={[0, -0.05, 0]} cast={false} />
    <M g={boxG(9, 1.1, 0.12)} c="#5f9a86" tex="plaster" p={[0, 0.55, -2.2]} />
    <M g={boxG(9, 2.4, 0.1)} c="#efe2c6" tex="plaster" p={[0, 2.3, -2.21]} />
    <M g={boxG(9, 0.06, 0.16)} c="#7a5236" tex="wood" p={[0, 1.12, -2.16]} />
    <M g={boxG(0.12, 3.6, 7)} c="#e6d6b8" tex="plaster" p={[-3.6, 1.8, 1.2]} />
    {/* window on the back wall, afternoon light */}
    <group position={[-1.7, 1.75, -2.14]}>
      <mesh geometry={boxG(1.1, 1.0, 0.02)} material={coreMat("#ffd79a", 1.05)} />
      {[[0, 0.53, 1.22, 0.07], [0, -0.53, 1.22, 0.07]].map(([x, y, w, h], i) => (
        <M key={i} g={boxG(w, h, 0.06)} c="#6e4a30" tex="wood" p={[x, y, 0.02]} />
      ))}
      {[-0.58, 0, 0.58].map((x) => (
        <M key={x} g={boxG(x === 0 ? 0.04 : 0.07, 1.0, 0.05)} c="#6e4a30" tex="wood" p={[x, 0, 0.02]} />
      ))}
      <M g={boxG(1.3, 0.06, 0.18)} c="#7a5236" tex="wood" p={[0, -0.6, 0.08]} />
    </group>
    {/* counter with jars, thermos and glasses (back layer, right) */}
    <group position={[1.9, 0, -1.6]}>
      <M g={boxG(2.2, 0.95, 0.6)} c="#b07a48" tex="planks" p={[0, 0.475, 0]} />
      <M g={boxG(2.3, 0.05, 0.68)} c="#8a5a34" tex="wood" p={[0, 0.975, 0]} />
      <Jar p={[-0.8, 1.0, 0.05]} c="#e9c56a" />
      <Jar p={[-0.55, 1.0, 0.12]} c="#d98a4a" />
      <Jar p={[-0.3, 1.0, 0.05]} c="#f2e2a8" />
      <M g={cylG(0.07, 0.07, 0.34, 16)} c="#c8433a" tex="metal" p={[0.15, 1.17, 0.05]} />
      <M g={cylG(0.03, 0.03, 0.06, 10)} c="#e6e6e6" p={[0.15, 1.37, 0.05]} />
      {[0.45, 0.56, 0.67].map((x) => (
        <M key={x} g={cylG(0.035, 0.03, 0.1, 14)} c="#d9e6ea" op={0.55} p={[x, 1.05, 0.12]} />
      ))}
      <M g={sphG(0.11, 16)} c="#b8b8c0" tex="metal" p={[0.9, 1.1, 0.0]} />
    </group>
    {/* shelf with tins on the back wall */}
    <group position={[1.9, 1.75, -2.05]}>
      <M g={boxG(1.8, 0.04, 0.26)} c="#7a5236" tex="wood" p={[0, 0, 0]} />
      {[-0.7, -0.45, -0.2, 0.1, 0.35, 0.6].map((x, i) => (
        <M key={x} g={cylG(0.07, 0.07, 0.18 + (i % 2) * 0.05, 14)} c={["#d8a03a", "#3f6fb0", "#c84a3a", "#4a9a6a", "#e6d7a8", "#a85a8a"][i]} tex="metal" p={[x, 0.11 + (i % 2) * 0.025, 0]} />
      ))}
    </group>
    <Sachets p={[1.9, 2.35, -1.62]} />
    {/* wall clock and a blank calendar */}
    <group position={[0.25, 2.45, -2.14]}>
      <M g={cylG(0.18, 0.18, 0.04, 28)} c="#f4efe2" p={[0, 0, 0]} r={[Math.PI / 2, 0, 0]} />
      <M g={torG(0.18, 0.02)} c="#3a2a22" p={[0, 0, 0.01]} />
      <M g={boxG(0.015, 0.12, 0.01)} c="#2a2228" p={[0, 0.05, 0.03]} />
      <M g={boxG(0.09, 0.012, 0.01)} c="#2a2228" p={[0.04, 0, 0.03]} />
    </group>
    <M g={boxG(0.42, 0.56, 0.01)} c="#f2ead6" tex="paper" p={[0.25, 1.75, -2.15]} />
    <M g={boxG(0.42, 0.14, 0.012)} c="#c8433a" tex="paper" p={[0.25, 1.98, -2.145]} />
    {/* plant by the window and a bench along the side */}
    <group position={[-2.75, 0, -1.7]}>
      <M g={cylG(0.18, 0.14, 0.32, 16)} c="#b85a3a" tex="stone" p={[0, 0.16, 0]} />
      {[[0, 0.55, 0], [0.12, 0.72, 0.05], [-0.13, 0.66, -0.03], [0.02, 0.86, 0]].map(([x, y, z], i) => (
        <M key={i} g={sphG(0.17 - i * 0.02, 14)} c={i % 2 ? "#4a8a4a" : "#5aa04a"} p={[x, y, z]} />
      ))}
    </group>
    <M g={boxG(1.6, 0.05, 0.36)} c="#9a6236" tex="wood" p={[-2.6, 0.42, -0.4]} />
    {[-3.3, -1.9].map((x) => (
      <M key={x} g={boxG(0.05, 0.4, 0.3)} c="#9a6236" tex="wood" p={[x, 0.2, -0.4]} />
    ))}
    {/* the hanging bulb: the one warm practical */}
    <group position={[0.1, 2.25, -0.2]}>
      <M g={cylG(0.006, 0.006, 1.2, 6)} c="#2a2228" p={[0, 0.6, 0]} />
      <M g={coneG(0.16, 0.12, 20)} c="#3e7f6e" tex="metal" p={[0, 0.06, 0]} />
      <mesh geometry={sphG(0.05, 14)} material={coreMat("#ffd890", 0.6 + 0.6 * bulb)} position={[0, -0.03, 0]} />
      <pointLight position={[0, -0.12, 0]} color="#ffbe70" intensity={3.2 * bulb} distance={4.5} decay={2} />
    </group>
    {/* the second table and stool (for Tyo later), front-left: mid layer */}
    <Table p={[0, 0, 0.28]} />
    <Chair p={[0, 0, -0.18]} />
    <Chair p={[tyoChairX, 0, -0.18]} c="#8a5a34" />
    {/* a stool in the near foreground (falls into the depth of field) */}
    <group position={[1.35, 0, 1.6]}>
      <M g={cylG(0.17, 0.17, 0.04, 18)} c="#d2453a" p={[0, 0.42, 0]} />
      {[0, 1, 2, 3].map((i) => (
        <M key={i} g={cylG(0.015, 0.02, 0.42, 8)} c="#b83a30" p={[Math.cos(i * 1.57 + 0.78) * 0.12, 0.21, Math.sin(i * 1.57 + 0.78) * 0.12]} />
      ))}
    </group>
    {spareCoffee ? <Coffee p={[-0.95, TABLE_Y + 0.004, 0.36]} t={t} /> : null}
  </group>
);
