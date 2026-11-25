// Episode 2026-11-002 sets (night): the kompleks street with house no. 7, and the inside of house no. 7.
// Every number comes from geo.ts (one coordinate system for inside and outside; content.md §3 geography):
//   +x = east (toa), +z = south (street), y up. Interior cameras face west: street = screen left, back = screen right.
// Ink-toon kit pieces only (kit M/boxG/cylG/coneG/coreMat/Label); painted textures on every surface; no text except the
// "7" plate. Deterministic: no clocks, no random. Architecture inside the house does not cast shadows (the mood's key
// light would otherwise leave the rooms black); furniture and characters do.
import React, { useMemo } from "react";
import * as THREE from "three";
import { boxG, coneG, coreMat, cylG, Inst, M, sphG } from "../inkbeat/core/kit";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import { CEIL_H, DAPUR, HOUSE, KAMAR, LORONG, NEIGHBOURS, STREET, TAMU, WALL_T } from "./geo";

const T2 = WALL_T / 2;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// ------------------------------------------------------------------ walls with openings
type Opening = { c: number; w: number; y0: number; y1: number };
/** a straight wall along x (at z) or along z (at x), from a to b, height h, with door/window openings */
const Wall: React.FC<{ along: "x" | "z"; at: number; a: number; b: number; h?: number; open?: Opening[]; c?: string; cast?: boolean; t?: number; skirt?: boolean }> = ({ along, at, a, b, h = CEIL_H, open = [], c = "#e6dccb", cast = false, t = WALL_T, skirt = true }) => {
  // 2026-11-17 fix: the wall is cut into columns at every opening edge; in each column the solid pieces fill the
  // vertical gaps between the openings that cover it. (The old one-pass version filled the full height under a second
  // opening sharing a door's span — the back door's vent — and so put a 0.5 m wall panel inside the door opening.)
  const parts: { u0: number; u1: number; y0: number; y1: number }[] = [];
  const ops = open.map((o) => ({ u0: Math.max(a, o.c - o.w / 2), u1: Math.min(b, o.c + o.w / 2), y0: o.y0, y1: o.y1 }));
  const edges = [...new Set([a, b, ...ops.flatMap((o) => [o.u0, o.u1])])].filter((e) => e >= a && e <= b).sort((p, q) => p - q);
  for (let i = 0; i + 1 < edges.length; i++) {
    const u0 = edges[i];
    const u1 = edges[i + 1];
    if (u1 - u0 < 1e-4) continue;
    const cover = ops.filter((o) => o.u0 <= u0 + 1e-6 && o.u1 >= u1 - 1e-6).sort((p, q) => p.y0 - q.y0);
    let y = 0;
    for (const o of cover) {
      if (o.y0 > y + 0.001) parts.push({ u0, u1, y0: y, y1: o.y0 });
      y = Math.max(y, o.y1);
    }
    if (y < h - 0.001) parts.push({ u0, u1, y0: y, y1: h });
  }
  return (
    <group>
      {parts.map((p, i) => {
        const len = p.u1 - p.u0;
        const mid = (p.u0 + p.u1) / 2;
        const hh = p.y1 - p.y0;
        const pos: V3 = along === "x" ? [mid, p.y0 + hh / 2, at] : [at, p.y0 + hh / 2, mid];
        const g = along === "x" ? boxG(len, hh, t) : boxG(t, hh, len);
        return <M key={i} g={g} c={c} tex="plaster" p={pos} cast={cast} />;
      })}
      {skirt
        ? parts
            .filter((p) => p.y0 < 0.01)
            .map((p, i) => {
              const len = p.u1 - p.u0;
              const mid = (p.u0 + p.u1) / 2;
              const pos: V3 = along === "x" ? [mid, 0.06, at] : [at, 0.06, mid];
              const g = along === "x" ? boxG(len, 0.12, t + 0.03) : boxG(t + 0.03, 0.12, len);
              return <M key={`s${i}`} g={g} c="#8a7a6a" tex="wood" p={pos} cast={false} />;
            })
        : null}
    </group>
  );
};

/** a window frame + glass in a wall opening; `n` = outward normal axis sign; glass glows `glow` (0 dark .. 1 lit) */
const WindowPane: React.FC<{ p: V3; w: number; h: number; along: "x" | "z"; glow?: number; warm?: boolean; frame?: string; clear?: boolean }> = ({ p, w, h, along, glow = 0, warm = true, frame = "#efe6d4", clear = false }) => {
  const rot: V3 = along === "x" ? [0, 0, 0] : [0, Math.PI / 2, 0];
  // clear: a faint transparent pane (depthWrite off), so the exterior set behind it shows through
  const glass = clear ? coreMat("#9ab0e0", 0.8, 0.1) : warm ? coreMat("#ffcf80", 0.12 + 1.0 * glow) : coreMat("#41507e", 0.55 + 0.4 * glow);
  return (
    <group position={p} rotation={rot}>
      <mesh geometry={boxG(w, h, 0.015)} material={glass} />
      <M g={boxG(w + 0.12, 0.07, WALL_T + 0.04)} c={frame} tex="wood" p={[0, h / 2 + 0.035, 0]} cast={false} />
      <M g={boxG(w + 0.12, 0.07, WALL_T + 0.08)} c={frame} tex="wood" p={[0, -h / 2 - 0.035, 0]} cast={false} />
      <M g={boxG(0.06, h, WALL_T + 0.04)} c={frame} tex="wood" p={[-w / 2 - 0.03, 0, 0]} cast={false} />
      <M g={boxG(0.06, h, WALL_T + 0.04)} c={frame} tex="wood" p={[w / 2 + 0.03, 0, 0]} cast={false} />
      {/* a centre mullion only on wide windows: the bedroom window (1.2 m) is one pane, so the POV out of it is clear */}
      {w > 1.3 ? <M g={boxG(0.045, h, 0.05)} c={frame} tex="wood" p={[0, 0, 0.012]} cast={false} /> : null}
      <M g={boxG(w, 0.04, 0.05)} c={frame} tex="wood" p={[0, h * 0.18, 0.012]} cast={false} />
    </group>
  );
};

/** two curtain panels (a few soft folds each) on a rod; `gap` = how far apart they are in the middle (m) */
const Curtains: React.FC<{ p: V3; w: number; h: number; along: "x" | "z"; gap?: number; c?: string; side?: 1 | -1 }> = ({ p, w, h, along, gap = 0.3, c = "#6a7aa8", side = 1 }) => {
  const rot: V3 = along === "x" ? [0, side === 1 ? 0 : Math.PI, 0] : [0, side === 1 ? Math.PI / 2 : -Math.PI / 2, 0];
  const panelW = (w + 0.3 - gap) / 2;
  return (
    <group position={p} rotation={rot}>
      <M g={cylG(0.015, 0.015, w + 0.5, 8)} c="#6a5a4a" tex="metal" p={[0, h / 2 + 0.12, 0]} r={[0, 0, Math.PI / 2]} cast={false} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (gap / 2 + panelW / 2), 0.02, 0]}>
          {[0, 1, 2, 3].map((k) => (
            <M key={k} g={boxG(panelW / 4 + 0.012, h + 0.22, 0.025)} c={k % 2 ? c : new THREE.Color(c).multiplyScalar(0.86).getStyle()} tex="fabric" p={[-panelW / 2 + (k + 0.5) * (panelW / 4), 0, (k % 2) * 0.03]} cast={false} />
          ))}
        </group>
      ))}
    </group>
  );
};

/** a panel door; `open` rotates it about its hinge (rad); handle on the side opposite the hinge */
const Door: React.FC<{ p: V3; w: number; h: number; along: "x" | "z"; open?: number; hinge?: 1 | -1; c?: string; frame?: string }> = ({ p, w, h, along, open = 0, hinge = -1, c = "#7a4e32", frame = "#efe6d4" }) => {
  const rot: V3 = along === "x" ? [0, 0, 0] : [0, Math.PI / 2, 0];
  return (
    <group position={p} rotation={rot}>
      <M g={boxG(0.07, h + 0.07, WALL_T + 0.05)} c={frame} tex="wood" p={[-w / 2 - 0.035, h / 2, 0]} cast={false} />
      <M g={boxG(0.07, h + 0.07, WALL_T + 0.05)} c={frame} tex="wood" p={[w / 2 + 0.035, h / 2, 0]} cast={false} />
      <M g={boxG(w + 0.14, 0.07, WALL_T + 0.05)} c={frame} tex="wood" p={[0, h + 0.035, 0]} cast={false} />
      <group position={[hinge * (w / 2 - 0.01), 0, 0]} rotation={[0, hinge * -open, 0]}>
        <group position={[-hinge * (w / 2 - 0.01), 0, 0]}>
          <M g={boxG(w - 0.02, h - 0.01, 0.045)} c={c} tex="planks" p={[0, h / 2, 0]} />
          {[0.28, 0.72].map((f) => (
            <M key={f} g={boxG(w - 0.24, h * 0.3, 0.012)} c={new THREE.Color(c).multiplyScalar(0.82).getStyle()} tex="wood" p={[0, h * f, 0.028]} cast={false} />
          ))}
          {[1, -1].map((sd) => (
            <M key={sd} g={sphG(0.03, 10)} c="#c8b070" tex="metal" p={[-hinge * (w / 2 - 0.1), 1.0, sd * 0.045]} cast={false} />
          ))}
        </group>
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ interior
/** windowGlass "opaque" (default: interior-only shots, the window reads as night glass) or "clear" (a faint
 * transparent pane: use with StreetSet house7="none" in the same View so the street shows through) */
export type HouseInteriorProps = { /** Ep 4 (2026-11-005) animatic: leave the standing fan out so a moving copy can be drawn (default: drawn, unchanged) */ noFan?: boolean; /** Ep 4 (2026-11-005) look-dev: the bathroom door in the east wall of the kitchen (x 1.0, z -4.0), `open` rad (0 = closed), and a small dark room behind it; undefined = no door (default, unchanged) */ bathDoor?: number; /** Ep 4 (2026-11-005) episode: the living-room curtain gap (m); default 0.28 (unchanged) */ tamuCurtainGap?: number; tamuLamp?: number; t?: number; kamarDoorOpen?: number; windowGlass?: "opaque" | "clear"; /** cold moonlight through the south windows (default 0.55, as before) */ moon?: number;
  /** D-031 lighting mode: "v1" = the animatic look (default, unchanged); "local" = pooled lamp (inverse-square, decay 2,
   * shadows) and moonlight as spot cones through the windows (moon = their strength), no flat directional */
  light?: "v1" | "local";
  /** local mode: how far into the room (m from the window) the moon cones aim (default 2.4) */
  moonReach?: number;
  /** "east" = a wild wall: the house's east wall and what hangs on it are left out, so a camera can stand beyond it
   * at a lens-friendly distance (2026-11-17, pilot A03–A04: the wall is only ~0.6 m in front of C1 on the bed) */
  wild?: "east" | "south";
  /** D-031: extra Indonesian-home props (bolster, wall clock, calendar, fan, TV, shoe rack...); default off */
  dressing?: boolean;
  /** 2026-11-003 (D-037): "lit" = the back-door vent glass receives light (frosted pane, cold emissive base), so a torch
   * can warm it; default "basic" = the unlit 2026-11-002 pane, unchanged */
  vent?: "basic" | "lit" | "lit2";
  /** 2026-11-003 (D-037): a long slide bolt (gerendel) on the back door's inside face, grip at x -0.95, y 1.10;
   * 0 = open (bar pulled back), 1 = locked (bar in the keeper on the west frame). Undefined = no bolt (2026-11-002) */
  backBolt?: number;
  /** 2026-11-003 episode (S10): the back door leaf (and its bolt) pushed this far into the kitchen by a knock (m, +z);
   * 0/undefined = still (default unchanged) */
  backDoorShake?: number; /** Ep 5 (2026-11-006): the back door opens OUTWARD into the gang by this angle (rad); the bolt turns with the leaf. Default 0 (closed, unchanged) */ backDoorOpen?: number };

/** frosted vent glass that takes light (Lambert): pale glass colour lit by lights + the old cold glow as emissive */
const VENT_LIT = new THREE.MeshLambertMaterial({ color: "#d9d4c6", emissive: new THREE.Color("#5a6a90").multiplyScalar(0.5) });
/** 2026-11-003 pilot v2 (owner 2026-11-18: the glass must read clearly as lit by the torch from inside): a warmer
 * frosted albedo (#f2c890: less of the blue night ambient is reflected) and the cold glow at 0.2 instead of 0.5. With "lit" the torch-lit glass mixed to a pale lavender
 * (R/B 0.92 in the insert, f195) inside a warm pool, which can read as light from outside; "lit" stays unchanged for v1. */
const VENT_LIT2 = new THREE.MeshLambertMaterial({ color: "#f2c890", emissive: new THREE.Color("#5a6a90").multiplyScalar(0.2) });
/** 2026-11-003 bolt grip on the back door (world): approved storyboard v0.2 (D-037) */
export const BOLT_GRIP: V3 = [-0.95, 1.1, HOUSE.z0 + 0.045];
/** a long slide bolt: base plate, bar to the keeper on the west frame (x -1.27), grip knob at BOLT_GRIP. Pure of props. */
const BackBolt: React.FC<{ k: number; dz?: number }> = ({ k, dz = 0 }) => {
  const zf = HOUSE.z0 + 0.03 + dz; // just proud of the door leaf's inside face (leaf 0.045 thick, centred on the wall line)
  const slide = (1 - clamp01(k)) * 0.06; // open: bar pulled 6 cm east
  const keeperX = DAPUR.backDoor.x - DAPUR.backDoor.w / 2 - 0.02;
  const barX0 = keeperX - 0.03 + slide;
  const barX1 = BOLT_GRIP[0] + 0.05 + slide;
  return (
    <group>
      <M g={boxG(0.34, 0.05, 0.012)} c="#8a8478" tex="metal" p={[(keeperX + BOLT_GRIP[0] + 0.08) / 2, BOLT_GRIP[1], zf]} cast={false} />
      <M g={cylG(0.011, 0.011, barX1 - barX0, 10)} c="#b8b0a0" tex="metal" p={[(barX0 + barX1) / 2, BOLT_GRIP[1], zf + 0.014]} r={[0, 0, Math.PI / 2]} cast={false} />
      <M g={cylG(0.009, 0.009, 0.05, 8)} c="#b8b0a0" tex="metal" p={[BOLT_GRIP[0] + slide, BOLT_GRIP[1] + 0.025, zf + 0.014]} cast={false} />
      <M g={sphG(0.016, 10)} c="#c8bea8" tex="metal" p={[BOLT_GRIP[0] + slide, BOLT_GRIP[1] + 0.05, zf + 0.014]} cast={false} />
      <M g={boxG(0.04, 0.06, 0.03)} c="#8a8478" tex="metal" p={[keeperX, BOLT_GRIP[1], zf + 0.008]} cast={false} />
    </group>
  );
};

/** the inside of house no. 7 (geo.ts rooms); tamuLamp 0..1 = the living-room ceiling lamp */
export const HouseInterior: React.FC<HouseInteriorProps> = ({ tamuLamp = 1, kamarDoorOpen = 1.35, windowGlass = "opaque", moon = 0.55, light = "v1", dressing = false, moonReach = 2.4, wild, vent = "basic", backBolt, backDoorShake = 0, noFan = false, bathDoor, tamuCurtainGap = 0.28, backDoorOpen = 0 }) => {
  const eastOff = wild === "east";
  // "south": the street-side wall with its door, windows, curtains and switch is left out (camera in front of people
  // who face the front window, 2026-11-17); use only when that wall is behind the camera
  const southOff = wild === "south";
  const local = light === "local";
  const clear = windowGlass === "clear";
  const H = CEIL_H;
  const lamp = clamp01(tamuLamp);
  const S = HOUSE.z1; // south wall line
  const N = HOUSE.z0;
  const kw = KAMAR.window;
  const tw = TAMU.window;
  const fd = TAMU.frontDoor;
  const kd = KAMAR.door;
  const bd = DAPUR.backDoor;
  return (
    <group>
      {/* floor: light ceramic tiles; ceiling */}
      {/* the floor top sits 4 mm above y = 0 so it never z-fights the exterior ground when both sets share a View */}
      <M g={boxG(HOUSE.x1 - HOUSE.x0 + WALL_T, 0.1, HOUSE.z1 - HOUSE.z0 + WALL_T)} c="#d9d0bf" tex="stone" ts={0.35} p={[(HOUSE.x0 + HOUSE.x1) / 2, -0.046, (HOUSE.z0 + HOUSE.z1) / 2]} cast={false} />
      <M g={boxG(HOUSE.x1 - HOUSE.x0 + WALL_T, 0.06, HOUSE.z1 - HOUSE.z0 + WALL_T)} c="#efe9dc" tex="plaster" p={[(HOUSE.x0 + HOUSE.x1) / 2, H + 0.03, (HOUSE.z0 + HOUSE.z1) / 2]} cast={false} />
      {/* outer walls */}
      {southOff ? null : <Wall along="x" at={S} a={HOUSE.x0} b={HOUSE.x1} open={[{ c: fd.x, w: fd.w, y0: 0, y1: fd.h }, { c: tw.x, w: tw.w, y0: tw.y - tw.h / 2, y1: tw.y + tw.h / 2 }, { c: kw.x, w: kw.w, y0: kw.y - kw.h / 2, y1: kw.y + kw.h / 2 }]} />}
      <Wall along="x" at={N} a={HOUSE.x0} b={HOUSE.x1} open={[{ c: bd.x, w: bd.w, y0: 0, y1: bd.h }, { c: bd.x, w: 0.5, y0: bd.h + 0.12, y1: bd.h + 0.42 }]} c="#ddd3bf" />
      <Wall along="z" at={HOUSE.x0} a={N} b={S} />
      {eastOff ? null : <Wall along="z" at={HOUSE.x1} a={N} b={S} c="#b8c4cc" />}
      {/* bedroom walls: west wall with the door, north wall; bedroom paint a cooler tone */}
      <Wall along="z" at={KAMAR.x0} a={KAMAR.z0} b={KAMAR.z1} open={[{ c: kd.z, w: kd.w, y0: 0, y1: kd.h }]} c="#b8c4cc" />
      <Wall along="x" at={KAMAR.z0} a={KAMAR.x0} b={KAMAR.x1} c="#b8c4cc" />
      {/* living-room north wall with the hallway opening; hallway walls; the closed room east of the hallway */}
      <Wall along="x" at={TAMU.z0} a={TAMU.x0} b={KAMAR.x0} open={[{ c: (LORONG.x0 + LORONG.x1) / 2, w: LORONG.x1 - LORONG.x0, y0: 0, y1: 2.2 }]} />
      <Wall along="z" at={LORONG.x0} a={DAPUR.z1} b={LORONG.z1} c="#e0d6c2" />
      <Wall along="z" at={LORONG.x1} a={DAPUR.z1} b={LORONG.z1} c="#e0d6c2" />
      <Wall along="x" at={DAPUR.z1} a={HOUSE.x0} b={LORONG.x0} c="#e0d6c2" />
      <Wall along="x" at={DAPUR.z1} a={LORONG.x1} b={KAMAR.x0} c="#e0d6c2" />
      <Wall along="z" at={KAMAR.x0} a={N} b={KAMAR.z0} c="#e0d6c2" open={bathDoor === undefined ? undefined : [{ c: BATH.z, w: BATH.w, y0: 0, y1: BATH.h }]} />
      {bathDoor === undefined ? null : (
        <>
          <Door p={[KAMAR.x0, 0, BATH.z]} w={BATH.w} h={BATH.h} along="z" open={bathDoor} hinge={1} c="#7a8a8a" />
          <BathRoom />
        </>
      )}

      {/* -------- bedroom */}
      {southOff ? null : (
        <>
          <WindowPane p={[kw.x, kw.y, S]} w={kw.w} h={kw.h} along="x" warm={false} glow={0.3} clear={clear} />
          <Curtains p={[kw.x, kw.y, S - 0.12]} w={kw.w} h={kw.h} along="x" gap={0.34} c="#6f7fae" />
        </>
      )}
      <Door p={[KAMAR.x0, 0, kd.z]} w={kd.w} h={kd.h} along="z" open={kamarDoorOpen} hinge={-1} c="#8a5a3a" />
      <Bed />
      <SideTable />
      {eastOff ? null : <M g={boxG(0.06, 0.9, 1.1)} c="#a8b8c0" tex="plaster" p={[HOUSE.x1 - T2 - 0.03, 1.65, -0.45]} cast={false} />}
      {/* a small wardrobe in the south-east corner (beside the window) */}
      <M g={boxG(0.55, 1.9, 1.0)} c="#9a6a44" tex="wood" p={[HOUSE.x1 - T2 - 0.3, 0.95, 2.35]} />
      <M g={boxG(0.02, 1.7, 0.012)} c="#6a4428" p={[HOUSE.x1 - T2 - 0.585, 1.0, 2.35]} cast={false} />

      {/* -------- living room */}
      {southOff ? null : (
        <>
          <WindowPane p={[tw.x, tw.y, S]} w={tw.w} h={tw.h} along="x" warm={false} glow={0.3} clear={clear} />
          <Curtains p={[tw.x, tw.y, S - 0.12]} w={tw.w} h={tw.h} along="x" gap={tamuCurtainGap} c="#b07a5a" />
          <Door p={[fd.x, 0, S]} w={fd.w} h={fd.h} along="x" open={0} hinge={-1} c="#6e4630" />
        </>
      )}
      <Sofa />
      {/* coffee table, rug, a low cabinet with a vase against the west wall */}
      <M g={boxG(2.2, 0.012, 1.5)} c="#a85a4a" tex="fabric" p={[-2.3, 0.006, 0.6]} cast={false} recv />
      <M g={boxG(1.0, 0.06, 0.55)} c="#8a5a36" tex="wood" p={[-2.4, 0.42, 0.55]} />
      {[[-2.85, 0.33], [-1.95, 0.33], [-2.85, 0.77], [-1.95, 0.77]].map(([x, z], i) => (
        <M key={i} g={boxG(0.05, 0.4, 0.05)} c="#6a4428" tex="wood" p={[x, 0.2, z]} />
      ))}
      <M g={boxG(0.45, 0.8, 1.3)} c="#8a6040" tex="wood" p={[HOUSE.x0 + T2 + 0.24, 0.4, 1.4]} />
      <M g={cylG(0.08, 0.06, 0.3, 12)} c="#3a6a8a" tex="metal" p={[HOUSE.x0 + T2 + 0.24, 0.95, 1.6]} />
      <M g={boxG(0.04, 0.6, 0.85)} c="#c8a878" tex="wood" p={[HOUSE.x0 + T2 + 0.03, 1.7, 0.8]} cast={false} />
      <M g={boxG(0.02, 0.5, 0.75)} c="#7a9ab0" tex="paper" p={[HOUSE.x0 + T2 + 0.06, 1.7, 0.8]} cast={false} />
      {/* ceiling lamp: cord, shade, bulb (dark when off), warm light */}
      <group position={TAMU.lamp}>
        <M g={cylG(0.008, 0.008, 0.12, 6)} c="#3a3238" p={[0, 0.09, 0]} cast={false} />
        <M g={cylG(0.08, 0.22, 0.16, 18, true)} c="#f0e2c0" tex="fabric" p={[0, -0.02, 0]} cast={false} />
        <mesh geometry={sphG(0.06, 14)} material={coreMat("#ffe2a8", 0.18 + 1.5 * lamp)} position={[0, -0.07, 0]} />
        {local ? (
          // inverse-square pool (threejs-lighting: candela, decay 2); shadows stay on and the lamp is switched by
          // intensity only, so toggling never recompiles materials
          <pointLight position={[0, -0.2, 0]} color="#ffb860" intensity={LAMP_CD * lamp} distance={4.5} decay={2} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.002} shadow-normalBias={0.03} />
        ) : (
          <pointLight position={[0, -0.2, 0]} color="#ffc070" intensity={9 * lamp} distance={8} decay={1.6} />
        )}
      </group>
      {/* wall switch right of the front door (seen from inside) */}
      {southOff ? null : (
        <>
          <M g={boxG(0.09, 0.13, 0.014)} c="#f4f0e6" tex="plaster" p={[TAMU.switch[0], TAMU.switch[1], S - T2 - 0.008]} cast={false} />
          <M g={boxG(0.025, 0.045, 0.012)} c="#d8d0c0" p={[TAMU.switch[0], TAMU.switch[1], S - T2 - 0.02]} cast={false} />
        </>
      )}

      {/* -------- hallway, kitchen, back door with a frosted vent above */}
      <Door p={[bd.x, 0, N + backDoorShake]} w={bd.w} h={bd.h} along="x" open={backDoorOpen} hinge={1} c="#5e4a3a" />
      {vent === "lit" || vent === "lit2" ? (
        <mesh geometry={boxG(0.5, 0.3, 0.015)} material={vent === "lit2" ? VENT_LIT2 : VENT_LIT} position={[bd.x, bd.h + 0.27, N + 0.01]} receiveShadow />
      ) : (
        <mesh geometry={boxG(0.5, 0.3, 0.015)} material={coreMat("#5a6a90", 0.5)} position={[bd.x, bd.h + 0.27, N + 0.01]} />
      )}
      {backBolt === undefined ? null : backDoorOpen > 0 ? (
        // Ep 5: the bolt is fixed on the leaf, so it turns with it about the hinge (bd.x + bd.w/2 - 0.01, N)
        <group position={[bd.x + bd.w / 2 - 0.01, 0, N]} rotation={[0, -backDoorOpen, 0]}>
          <group position={[-(bd.x + bd.w / 2 - 0.01), 0, -N]}>
            <BackBolt k={backBolt} dz={backDoorShake} />
          </group>
        </group>
      ) : (
        <BackBolt k={backBolt} dz={backDoorShake} />
      )}
      <M g={boxG(0.56, 0.05, WALL_T + 0.04)} c="#efe6d4" tex="wood" p={[bd.x, bd.h + 0.1, N]} cast={false} />
      <M g={boxG(0.56, 0.05, WALL_T + 0.04)} c="#efe6d4" tex="wood" p={[bd.x, bd.h + 0.445, N]} cast={false} />
      {/* kitchen counter with a sink along the north wall, west of the back door; a shelf */}
      <M g={boxG(2.2, 0.85, 0.6)} c="#c8c0b0" tex="stone" p={[-2.7, 0.425, N + T2 + 0.31]} />
      <M g={boxG(2.24, 0.05, 0.64)} c="#7a6a5a" tex="stone" p={[-2.7, 0.875, N + T2 + 0.32]} />
      <M g={boxG(0.5, 0.06, 0.36)} c="#9aa0a8" tex="metal" p={[-2.2, 0.885, N + T2 + 0.3]} cast={false} />
      <M g={boxG(1.4, 0.04, 0.25)} c="#8a6040" tex="wood" p={[-2.9, 1.7, N + T2 + 0.14]} cast={false} />
      {/* cold street/moonlight coming in through the south windows (constant, no shadows) */}
      {local ? (
        <>
          <MoonSpot win={[kw.x, kw.y, S]} k={moon} reach={moonReach} />
          <MoonSpot win={[tw.x, tw.y, S]} k={moon} reach={moonReach} />
        </>
      ) : (
        <directionalLight position={[0.6, 3.2, 9]} color="#8ea6ff" intensity={moon} />
      )}
      {dressing ? <Dressing eastOff={eastOff} noFan={noFan} /> : null}
    </group>
  );
};

/** D-031 local light: the living-room lamp in candela (decay 2) */
const LAMP_CD = 3.2;
/** moonlight entering through a south window: a soft spot cone from just inside the opening, aimed down into the room
 * (falls on the floor in a window-shaped pool and leaves the walls beside it dark). k = strength (local mode). */
const MoonSpot: React.FC<{ win: V3; k: number; reach?: number }> = ({ win, k, reach = 2.4 }) => {
  const { light, target } = useMemo(() => {
    const l = new THREE.SpotLight("#9bb0ff", 1, 7, 0.5, 0.9, 2);
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.002;
    l.shadow.normalBias = 0.03;
    return { light: l, target: new THREE.Object3D() };
  }, []);
  // every value is set on every render (a pure function of the props: no state between frames)
  light.position.set(win[0], win[1] + 0.75, win[2] - 0.05);
  target.position.set(win[0] - 0.25, 0, win[2] - reach);
  light.target = target;
  light.intensity = 9 * k;
  target.updateMatrixWorld();
  return (
    <>
      <primitive object={light} />
      <primitive object={target} />
    </>
  );
};

/** D-031 set dressing for an Indonesian home (no brands, no readable text; the clocks read 2:00) */
const Dressing: React.FC<{ eastOff?: boolean; noFan?: boolean }> = ({ eastOff = false, noFan = false }) => {
  const b = KAMAR.bed;
  const N = KAMAR.z0 + T2;
  const W0 = HOUSE.x0 + T2;
  const S = HOUSE.z1 - T2;
  return (
    <group>
      {/* bedroom: guling (bolster) on the wall side of the bed, wall clock at 2:00, calendar, a desk fan on the side
          table, a floor mat, a backpack, a shirt on a wall hook */}
      <M g={cylG(0.085, 0.085, 0.85, 14)} c="#e9e2d2" tex="fabric" p={[b.x0 + 0.75, b.top + 0.08, b.z0 + 0.14]} r={[0, 0, Math.PI / 2]} />
      <WallClock p={[2.95, 1.78, N + 0.02]} />
      <Calendar p={[1.62, 1.42, N + 0.012]} />
      {/* the desk fan was removed 2026-11-17: it stood in the middle of the A07 phone insert */}
      <M g={boxG(1.3, 0.01, 0.75)} c="#5a6a8a" tex="fabric" p={[2.95, 0.005, 0.5]} cast={false} />
      <M g={boxG(0.3, 0.38, 0.16)} c="#3a4a3a" tex="fabric" p={[HOUSE.x1 - T2 - 0.75, 0.19, 2.75]} />
      {eastOff ? null : (
        <>
          <M g={boxG(0.05, 0.03, 0.03)} c="#6a5a4a" tex="wood" p={[HOUSE.x1 - T2 - 0.025, 1.7, 1.25]} cast={false} />
          <M g={boxG(0.03, 0.62, 0.42)} c="#a23a3a" tex="fabric" p={[HOUSE.x1 - T2 - 0.03, 1.38, 1.25]} />
        </>
      )}
      {/* living room: TV on the low cabinet, two photo frames over the sofa, wall clock, calendar, a standing fan,
          a shoe rack with sandals by the front door */}
      <M g={boxG(0.08, 0.42, 0.72)} c="#1c1c24" tex="metal" p={[W0 + 0.24, 1.02, 1.25]} />
      <M g={boxG(0.12, 0.04, 0.3)} c="#2a2a32" tex="metal" p={[W0 + 0.24, 0.81, 1.25]} cast={false} />
      {[-2.9, -2.2].map((x, i) => (
        <group key={i} position={[x, 1.55 + i * 0.08, TAMU.z0 + T2 + 0.015]}>
          <M g={boxG(0.4, 0.3, 0.02)} c="#6a4428" tex="wood" cast={false} />
          <M g={boxG(0.32, 0.22, 0.01)} c={i ? "#c8b08a" : "#8aa0b8"} tex="paper" p={[0, 0, 0.012]} cast={false} />
        </group>
      ))}
      {/* 2026-11-17 fix: the clock hung at x -1.2, inside the hallway opening; now on the wall above the photos */}
      <WallClock p={[-2.55, 2.12, TAMU.z0 + T2 + 0.02]} />
      <Calendar p={[0.45, 1.5, TAMU.z0 + T2 + 0.012]} />
      {noFan ? null : <StandFan p={[0.55, 0, -0.55]} />}
      <group position={[TAMU.frontDoor.x - 0.95, 0, S - 0.2]}>
        <M g={boxG(0.6, 0.03, 0.28)} c="#7a5a3a" tex="wood" p={[0, 0.1, 0]} />
        <M g={boxG(0.6, 0.03, 0.28)} c="#7a5a3a" tex="wood" p={[0, 0.32, 0]} />
        {[-0.28, 0.28].map((x) => (
          <M key={x} g={boxG(0.03, 0.4, 0.28)} c="#6a4a2a" tex="wood" p={[x, 0.2, 0]} />
        ))}
        {[-0.14, 0.12].map((x, i) => (
          <M key={i} g={boxG(0.1, 0.02, 0.24)} c={i ? "#3a5a8a" : "#2a2a2a"} tex="fabric" p={[x, 0.125, 0]} />
        ))}
      </group>
    </group>
  );
};
/** a round wall clock at two o'clock (+z faces the room) */
const WallClock: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={cylG(0.15, 0.15, 0.04, 28)} c="#3a2e2a" tex="wood" r={[Math.PI / 2, 0, 0]} cast={false} />
    <M g={cylG(0.125, 0.125, 0.012, 28)} c="#f2ede2" tex="paper" p={[0, 0, 0.022]} r={[Math.PI / 2, 0, 0]} cast={false} />
    <M g={boxG(0.014, 0.075, 0.006)} c="#1a1418" p={[0.032, 0.019, 0.03]} r={[0, 0, -Math.PI / 3]} cast={false} />
    <M g={boxG(0.01, 0.1, 0.006)} c="#1a1418" p={[0, 0.05, 0.033]} cast={false} />
  </group>
);
const Calendar: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={boxG(0.3, 0.42, 0.008)} c="#f0ece2" tex="paper" cast={false} />
    <M g={boxG(0.3, 0.1, 0.01)} c="#b03a3a" tex="paper" p={[0, 0.16, 0.002]} cast={false} />
    <M g={boxG(0.24, 0.2, 0.01)} c="#c8c0b0" tex="paper" p={[0, -0.06, 0.002]} cast={false} />
  </group>
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DeskFan: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p} rotation={[0, 0.6, 0]}>
    <M g={cylG(0.08, 0.09, 0.03, 16)} c="#e8e4dc" tex="metal" p={[0, 0.015, 0]} />
    <M g={cylG(0.012, 0.012, 0.2, 8)} c="#e8e4dc" tex="metal" p={[0, 0.12, 0]} />
    <M g={cylG(0.13, 0.13, 0.06, 20, true)} c="#5a8ab0" tex="metal" p={[0, 0.26, 0]} r={[Math.PI / 2, 0, 0]} />
    <M g={cylG(0.03, 0.03, 0.08, 10)} c="#e8e4dc" tex="metal" p={[0, 0.26, -0.04]} r={[Math.PI / 2, 0, 0]} />
  </group>
);
export const FAN_POS: V3 = [0.55, 0, -0.55];
/** Ep 4 bathroom door (x = KAMAR.x0 = 1.0, centre z -4.0, 0.8 x 2.0 m) and the little dark room behind it (look-dev only) */
export const BATH = { z: -4.0, w: 0.8, h: 2.0, x1: 3.9, z0: -4.9, z1: -1.3, ceil: 2.45 };
const BathRoom: React.FC = () => {
  const w = BATH.x1 - 1.0, d = BATH.z1 - BATH.z0, cz = (BATH.z0 + BATH.z1) / 2, cx = 1.0 + w / 2;
  const tile = "#587070", tileD = "#46595a";
  return (
    <group>
      <M g={boxG(w, 0.05, d)} c="#3c4c4c" tex="stone" p={[cx, 0.025, cz]} cast={false} />
      <M g={boxG(w, 0.06, d)} c="#c9c2b2" tex="plaster" p={[cx, BATH.ceil, cz]} cast={false} />
      <M g={boxG(0.08, BATH.ceil, d)} c={tile} tex="stone" p={[BATH.x1, BATH.ceil / 2, cz]} cast={false} />
      <M g={boxG(w, BATH.ceil, 0.08)} c={tileD} tex="stone" p={[cx, BATH.ceil / 2, BATH.z0]} cast={false} />
      <M g={boxG(w, BATH.ceil, 0.08)} c={tileD} tex="stone" p={[cx, BATH.ceil / 2, BATH.z1]} cast={false} />
      <M g={boxG(0.62, 0.62, 0.62)} c="#7d8f8f" tex="stone" p={[BATH.x1 - 0.4, 0.31, BATH.z0 + 0.4]} />
      <M g={boxG(0.5, 0.02, 0.5)} c="#2c4258" p={[BATH.x1 - 0.4, 0.62, BATH.z0 + 0.4]} cast={false} />
      <M g={cylG(0.14, 0.11, 0.28, 14)} c="#3a6a9a" tex="metal" p={[BATH.x1 - 0.25, 0.14, BATH.z1 - 0.3]} />
      <M g={boxG(0.28, 0.02, 0.28)} c="#2a3a3a" p={[1.35, 0.06, BATH.z + 0.45]} cast={false} />
    </group>
  );
};
export const StandFan: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p} rotation={[0, -2.3, 0]}>
    <M g={cylG(0.18, 0.2, 0.04, 18)} c="#d8d4cc" tex="metal" p={[0, 0.02, 0]} />
    <M g={cylG(0.016, 0.016, 1.05, 8)} c="#d8d4cc" tex="metal" p={[0, 0.55, 0]} />
    <M g={cylG(0.22, 0.22, 0.08, 22, true)} c="#d8d4cc" tex="metal" p={[0, 1.15, 0]} r={[Math.PI / 2, 0, 0]} />
    <M g={cylG(0.045, 0.045, 0.12, 10)} c="#c8c4bc" tex="metal" p={[0, 1.15, -0.07]} r={[Math.PI / 2, 0, 0]} />
  </group>
);

const Bed: React.FC = () => {
  const b = KAMAR.bed;
  const w = b.x1 - b.x0 - T2 - 0.02;
  const d = b.z1 - b.z0;
  const cx = b.x0 + w / 2;
  const cz = (b.z0 + b.z1) / 2;
  return (
    <group>
      <M g={boxG(w, 0.3, d)} c="#8a5a38" tex="wood" p={[cx, 0.15, cz]} />
      <M g={boxG(w - 0.04, 0.18, d - 0.04)} c="#e8e4f0" tex="fabric" p={[cx, b.top - 0.09, cz]} />
      {/* head end WEST (x0, door-wall side): tall headboard + pillow; low footboard at the east wall */}
      <M g={boxG(0.06, 0.95, d + 0.04)} c="#7a4e30" tex="wood" p={[b.x0 - 0.01, 0.475, cz]} />
      <M g={boxG(0.06, 0.5, d + 0.04)} c="#7a4e30" tex="wood" p={[b.x1 - T2 - 0.05, 0.25, cz]} />
      <M g={boxG(0.38, 0.12, d * 0.62)} c="#f4f0f8" tex="fabric" p={[b.x0 + 0.24, b.top + 0.06, cz]} />
    </group>
  );
};
const SideTable: React.FC = () => {
  const t = KAMAR.table;
  return (
    <group>
      <M g={boxG(0.42, t.top - 0.03, 0.4)} c="#9a6a44" tex="wood" p={[t.x, (t.top - 0.03) / 2, t.z]} />
      <M g={boxG(0.46, 0.03, 0.44)} c="#7a4e30" tex="wood" p={[t.x, t.top - 0.015, t.z]} />
      <M g={boxG(0.3, 0.012, 0.012)} c="#c8b070" tex="metal" p={[t.x, t.top * 0.62, t.z + 0.21]} cast={false} />
    </group>
  );
};
const Sofa: React.FC = () => {
  const s = TAMU.sofa;
  const z = s.z;
  return (
    <group>
      <M g={boxG(s.w, 0.42, 0.75)} c="#5a7a6a" tex="fabric" p={[s.x, 0.21, z]} />
      <M g={boxG(s.w, 0.5, 0.18)} c="#4e6e5e" tex="fabric" p={[s.x, 0.62, TAMU.z0 + T2 + 0.11]} />
      {[-1, 1].map((k) => (
        <M key={k} g={boxG(0.16, 0.6, 0.75)} c="#4e6e5e" tex="fabric" p={[s.x + k * (s.w / 2 - 0.08), 0.3, z]} />
      ))}
      {[-0.42, 0.42].map((x) => (
        <M key={x} g={boxG(0.8, 0.1, 0.62)} c="#6a8a7a" tex="fabric" p={[s.x + x, 0.47, z + 0.04]} />
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ exterior
/** the street-facing door of house i: 0–1 = our side (NEIGHBOURS.ourSide), 2–5 = across (NEIGHBOURS.across) */
export const neighbourDoor = (i: number): V3 => {
  if (i < NEIGHBOURS.ourSide.length) return [NEIGHBOURS.ourSide[i] - 1.6, 0, HOUSE.z1 + 0.35];
  const x = NEIGHBOURS.across[i - NEIGHBOURS.ourSide.length];
  return [x + 1.2, 0, STREET.oppositeZ - 0.35];
};
/** the mouth of the west-facing toa horn (upper) */
export const toaHornWorld = (): V3 => [STREET.toa[0] - 0.55, STREET.toaHornY + 0.05, STREET.toa[2]];
/** the plate is mounted on the face of the gate pillar east of the gate (geo.ts STREET.plate x/y; z pushed out to the
 * pillar face, because geo's z lies inside the fence) */
export const PLATE_POS: V3 = [STREET.plate[0], STREET.plate[1], STREET.fenceZ + 0.175];
export const plateWorld = (): V3 => [...PLATE_POS] as V3;

/** a single-storey house facade block; `faceZ` = +1 front faces south (our row), -1 faces north (across) */
/** optional (2026-11-17, defaults = the original house): w width, H wall height, canopy = a small tiled roof over the
 * door, lite = a far house (no shadows) */
const RowHouse: React.FC<{ x: number; z0: number; z1: number; faceZ: 1 | -1; wall: string; roof: string; doorX: number; windows: number[]; lit?: number[]; doorOpen?: number; porch?: number; w?: number; H?: number; canopy?: boolean; lite?: boolean }> = ({ x, z0, z1, faceZ, wall, roof, doorX, windows, lit = [], doorOpen = 0, porch = 1, w = NEIGHBOURS.width, H = 3.0, canopy = false, lite = false }) => {
  const d = z1 - z0;
  const front = faceZ === 1 ? z1 : z0;
  const fz = front + faceZ * 0.01;
  const yaw = faceZ === 1 ? 0 : Math.PI;
  return (
    <group>
      <M g={boxG(w, H, d)} c={wall} tex="plaster" p={[x, H / 2, (z0 + z1) / 2]} cast={!lite} />
      <M g={boxG(w + 0.02, 0.5, d + 0.02)} c="#8a6a5a" tex="brick" p={[x, 0.25, (z0 + z1) / 2]} cast={false} />
      {[-1, 1].map((s) => (
        <M key={s} g={boxG(w + 0.7, 0.14, d * 0.6)} c={roof} tex="roofTiles" p={[x, H + d * 0.16, (z0 + z1) / 2 + s * d * 0.24]} r={[s * 0.55, 0, 0]} cast={!lite} />
      ))}
      {/* 2026-11-17 fix: the group sits at the house's x (it sat at x = 0, so every neighbour's windows and door were
          drawn on house 7 / on top of each other, and the neighbours' own facades were blank) */}
      <group position={[x, 0, fz]} rotation={[0, yaw, 0]}>
        {windows.map((wx, i) => (
          <group key={i} position={[faceZ === 1 ? wx : -wx, 1.5, 0]}>
            <mesh geometry={boxG(1.1, 1.0, 0.02)} material={lit.includes(i) ? coreMat("#ffc878", 0.9) : coreMat("#2e3a66", 0.8)} />
            <M g={boxG(1.22, 0.07, 0.06)} c="#efe6d4" tex="wood" p={[0, 0.535, 0.02]} cast={false} />
            <M g={boxG(1.22, 0.07, 0.1)} c="#efe6d4" tex="wood" p={[0, -0.535, 0.04]} cast={false} />
            <M g={boxG(0.06, 1.0, 0.06)} c="#efe6d4" tex="wood" p={[-0.58, 0, 0.02]} cast={false} />
            <M g={boxG(0.06, 1.0, 0.06)} c="#efe6d4" tex="wood" p={[0.58, 0, 0.02]} cast={false} />
            <M g={boxG(0.04, 1.0, 0.05)} c="#efe6d4" tex="wood" p={[0, 0, 0.025]} cast={false} />
          </group>
        ))}
        <group position={[faceZ === 1 ? doorX - x : -(doorX - x), 0, 0]}>
          {/* a warm interior behind the door: visible when the door is open */}
          <mesh geometry={boxG(0.92, 2.0, 0.01)} material={coreMat("#ffc070", 0.15 + 0.85 * doorOpen)} position={[0, 1.0, -0.02]} />
          <group position={[-0.46, 0, 0.03]} rotation={[0, -1.35 * doorOpen, 0]}>
            <M g={boxG(0.92, 2.0, 0.045)} c="#6a4430" tex="planks" p={[0.46, 1.0, 0]} />
          </group>
          <M g={boxG(1.1, 0.07, 0.07)} c="#efe6d4" tex="wood" p={[0, 2.04, 0.03]} cast={false} />
          {canopy ? <M g={boxG(1.6, 0.08, 0.75)} c={roof} tex="roofTiles" p={[0, 2.42, 0.36]} r={[0.22, 0, 0]} cast={false} /> : null}
          {/* porch light */}
          <mesh geometry={sphG(0.07, 10)} material={coreMat("#ffe0a0", 0.4 + 0.9 * porch)} position={[0.75, 2.25, 0.1]} />
          <M g={boxG(2.2, 0.08, 1.1)} c="#9a8a7a" tex="stone" p={[0, 0.04, 0.55]} cast={false} />
        </group>
      </group>
    </group>
  );
};

/** a low fence: plastered posts and a painted iron rail, with an optional gap (gate) */
export type FenceStyle = "rail" | "wall" | "hedge";
/** style: "rail" = plastered base + iron bars (the original; the bars are one InstancedMesh since 2026-11-17, same
 * look); "wall" = a solid plastered wall with a tiled coping; "hedge" = a trimmed hedge on a low kerb. lite = no
 * shadows (far houses). */
const Fence: React.FC<{ z: number; a: number; b: number; gate?: { x: number; w: number }; style?: FenceStyle; tint?: string; lite?: boolean }> = ({ z, a, b, gate, style = "rail", tint = "#d8cfbf", lite = false }) => {
  const segs: [number, number][] = gate ? [[a, gate.x - gate.w / 2], [gate.x + gate.w / 2, b]] : [[a, b]];
  const cast = !lite;
  return (
    <group>
      {segs.map(([s0, s1], i) => {
        const len = s1 - s0;
        const mid = (s0 + s1) / 2;
        const n = Math.max(2, Math.round(len / 2.0) + 1); // ~2 m spacing: keeps a post out of the bedroom-window POV
        if (style === "wall")
          return (
            <group key={i}>
              <M g={boxG(len, 1.15, 0.2)} c={tint} tex="plaster" p={[mid, 0.575, z]} cast={cast} />
              <M g={boxG(len + 0.04, 0.07, 0.28)} c="#8a5a4a" tex="roofTiles" p={[mid, 1.185, z]} cast={false} />
            </group>
          );
        if (style === "hedge")
          return (
            <group key={i}>
              <M g={boxG(len, 0.18, 0.3)} c="#b8b0a4" tex="stone" p={[mid, 0.09, z]} cast={false} />
              <M g={boxG(len, 0.9, 0.5)} c="#2f4e33" tex="grass" ts={0.6} p={[mid, 0.63, z]} cast={cast} />
            </group>
          );
        return (
          <group key={i}>
            <M g={boxG(len, 0.5, 0.2)} c={tint} tex="plaster" p={[mid, 0.25, z]} cast={cast} />
            <M g={boxG(len, 0.04, 0.04)} c="#2e3a3a" tex="metal" p={[mid, 1.15, z]} cast={cast} />
            <Inst g={boxG(0.02, 0.62, 0.02)} c="#2e3a3a" tex="metal" pts={Array.from({ length: Math.round(len / 0.14) }, (_, k) => [s0 + 0.07 + k * 0.14, 0.82, z] as V3)} />
            {Array.from({ length: n }, (_, k) => (
              <M key={`p${k}`} g={boxG(0.22, 1.3, 0.24)} c="#e4dccc" tex="plaster" p={[s0 + (k * len) / (n - 1), 0.65, z]} cast={cast} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

/** a kompleks street lamp: a tall pole with an arm over the road and a warm practical */
const StreetLamp: React.FC<{ p: V3; toward: 1 | -1; local?: boolean }> = ({ p, toward, local = false }) => (
  <group position={p}>
    <M g={cylG(0.07, 0.1, 5.0, 12)} c="#3a4248" tex="metal" p={[0, 2.5, 0]} />
    <M g={boxG(0.06, 0.06, 1.1)} c="#3a4248" tex="metal" p={[0, 4.95, toward * 0.55]} />
    <M g={boxG(0.34, 0.1, 0.22)} c="#3a4248" tex="metal" p={[0, 4.9, toward * 1.05]} />
    <mesh geometry={boxG(0.28, 0.03, 0.17)} material={coreMat("#ffd890", 1.4)} position={[0, 4.84, toward * 1.05]} />
    {local ? (
      <pointLight position={[0, 4.6, toward * 1.05]} color="#ffb060" intensity={34} distance={10} decay={2} />
    ) : (
      <pointLight position={[0, 4.6, toward * 1.05]} color="#ffb860" intensity={14} distance={11} decay={1.7} />
    )}
  </group>
);

/** a simple tree in a yard (trunk + three foliage balls) */
const Tree: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <M g={cylG(0.09, 0.13, 2.2, 10)} c="#5a4030" tex="wood" p={[0, 1.1, 0]} />
    {[[0, 2.5, 0, 0.85], [0.5, 2.2, 0.2, 0.6], [-0.45, 2.3, -0.15, 0.62]].map(([x, y, z, r], i) => (
      <M key={i} g={sphG(r, 16)} c={i % 2 ? "#3a6a46" : "#2e5a3e"} tex="grass" p={[x, y, z]} />
    ))}
  </group>
);

/** the toa: a tall pole at the street's east end with two loudspeaker horns aimed west along the street */
const Toa: React.FC = () => {
  const [x, , z] = STREET.toa;
  const y = STREET.toaHornY;
  return (
    <group position={[x, 0, z]}>
      <M g={cylG(0.09, 0.13, y + 0.6, 12)} c="#5a6068" tex="metal" p={[0, (y + 0.6) / 2, 0]} />
      <M g={boxG(0.08, 0.08, 0.9)} c="#4a5058" tex="metal" p={[0, y + 0.05, 0]} />
      {[-1, 1].map((s) => (
        <group key={s} position={[-0.12, y + 0.05 + (s > 0 ? 0.28 : -0.12), s * 0.32]} rotation={[0, s * 0.22, 0]}>
          {/* horn: the wide mouth faces west (-x) */}
          <M g={coneG(0.32, 0.75, 18)} c="#dadada" tex="metal" p={[-0.37, 0, 0]} r={[0, 0, -Math.PI / 2]} />
          <mesh geometry={cylG(0.3, 0.3, 0.01, 18)} material={coreMat("#1a1a22", 0.6)} position={[-0.745, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
          <M g={cylG(0.11, 0.11, 0.22, 14)} c="#8a9098" tex="metal" p={[0.08, 0, 0]} r={[0, 0, Math.PI / 2]} />
        </group>
      ))}
      <M g={boxG(0.3, 0.4, 0.2)} c="#6a7078" tex="metal" p={[0.1, 2.4, 0]} />
    </group>
  );
};

/** house7 "full" (default) = the solid exterior house; "none" = only house 7's exterior dressing (roof, eave band, porch,
 * porch light, fence/gate/plate) so a HouseInterior in the same View provides the walls with real window openings */
export type StreetSetProps = { /** Ep 5 (2026-11-006): false = leave out the far gang wall (z gangZ - 1.6), which would cut through the toa room behind the row; default true (unchanged) */ gangWall?: boolean; t?: number; tamuLit?: number; kamarLit?: number; neighbourDoorsOpen?: number; house7?: "full" | "none"; /** D-031: "local" = street lamps as inverse-square pools (decay 2); default "v1" unchanged */ light?: "v1" | "local"; /** 2026-11-17: more houses, fences, back rows (default off = the v3 street) */ dense?: boolean };

/** the kompleks street at night with house no. 7 (our side, facing south across the yard and fence to the road) */
export const StreetSet: React.FC<StreetSetProps> = ({ tamuLit = 0, kamarLit = 0, neighbourDoorsOpen = 0, house7 = "full", light = "v1", dense = false, gangWall = true }) => {
  const solid = house7 === "full";
  const S = HOUSE.z1;
  const tw = TAMU.window;
  const kw = KAMAR.window;
  const fd = TAMU.frontDoor;
  const tl = clamp01(tamuLit);
  const kl = clamp01(kamarLit);
  const no = clamp01(neighbourDoorsOpen);
  const across = NEIGHBOURS.across;
  const wallsAcross = ["#c8d8b8", "#e8c8a8", "#b8c8d8", "#e4d8b0"];
  const roofsAcross = ["#6a3a3a", "#4a4a6a", "#7a4a3a", "#5a4a5a"];
  return (
    <group>
      {/* ground: yards / verges, asphalt road with kerbs, a drain line */}
      <M g={boxG(80, 0.1, 60)} c="#7a8a6a" tex="grass" ts={2} p={[0, -0.05, 0]} cast={false} />
      <M g={boxG(80, 0.04, STREET.roadZ1 - STREET.roadZ0)} c="#4a4a56" tex="stone" ts={3} p={[0, 0.02, (STREET.roadZ0 + STREET.roadZ1) / 2]} cast={false} />
      {[STREET.roadZ0 - 0.1, STREET.roadZ1 + 0.1].map((z) => (
        <M key={z} g={boxG(80, 0.14, 0.2)} c="#b8b0a4" tex="stone" p={[0, 0.07, z]} cast={false} />
      ))}
      <M g={boxG(80, 0.03, 0.75)} c="#a8a094" tex="stone" ts={0.8} p={[0, 0.015, STREET.fenceZ + 0.45]} cast={false} />
      <M g={boxG(80, 0.03, 0.9)} c="#a8a094" tex="stone" ts={0.8} p={[0, 0.015, STREET.roadZ1 + 0.65]} cast={false} />
      {/* our yard: paving from the gate to the porch */}
      <M g={boxG(1.4, 0.03, STREET.fenceZ - S)} c="#b8ae9e" tex="stone" ts={0.5} p={[STREET.gateX, 0.03, (S + STREET.fenceZ) / 2]} cast={false} />

      {/* ---- house no. 7 */}
      <group>
        {solid ? (
          <>
            <M g={boxG(HOUSE.x1 - HOUSE.x0, CEIL_H + 0.3, HOUSE.z1 - HOUSE.z0)} c="#ece0c6" tex="plaster" p={[0, (CEIL_H + 0.3) / 2, (HOUSE.z0 + HOUSE.z1) / 2]} />
            <M g={boxG(HOUSE.x1 - HOUSE.x0 + 0.02, 0.5, HOUSE.z1 - HOUSE.z0 + 0.02)} c="#8a6a5a" tex="brick" p={[0, 0.25, (HOUSE.z0 + HOUSE.z1) / 2]} />
          </>
        ) : (
          // the interior's walls end at the ceiling (CEIL_H); this band closes the gap up to the eaves from outside
          <>
            {[HOUSE.z0, HOUSE.z1].map((z) => (
              <M key={z} g={boxG(HOUSE.x1 - HOUSE.x0 + WALL_T + 0.02, 0.32, WALL_T + 0.02)} c="#ece0c6" tex="plaster" p={[0, CEIL_H + 0.14, z]} cast={false} />
            ))}
            {[HOUSE.x0, HOUSE.x1].map((x) => (
              <M key={x} g={boxG(WALL_T + 0.02, 0.32, HOUSE.z1 - HOUSE.z0)} c="#ece0c6" tex="plaster" p={[x, CEIL_H + 0.14, (HOUSE.z0 + HOUSE.z1) / 2]} cast={false} />
            ))}
          </>
        )}
        {[-1, 1].map((s) => (
          <M key={s} g={boxG(HOUSE.x1 - HOUSE.x0 + 0.8, 0.14, (HOUSE.z1 - HOUSE.z0) * 0.6)} c="#8a3e34" tex="roofTiles" p={[0, CEIL_H + 0.3 + 1.25, (HOUSE.z0 + HOUSE.z1) / 2 + s * 2.0]} r={[s * 0.55, 0, 0]} />
        ))}
        {/* porch roof over the front door and living-room window */}
        <M g={boxG(5.6, 0.1, 1.3)} c="#7a3a30" tex="roofTiles" p={[-1.6, 2.55, S + 0.6]} r={[0.18, 0, 0]} />
        {[-4.2, 1.0].map((x) => (
          <M key={x} g={cylG(0.06, 0.06, 2.45, 10)} c="#efe6d4" tex="wood" p={[x + 0.15, 1.22, S + 1.1]} />
        ))}
        <M g={boxG(5.6, 0.1, 1.3)} c="#b8ae9e" tex="stone" p={[-1.6, 0.05, S + 0.65]} cast={false} />
        {/* front door, living-room window (warm when lit), bedroom window (cool, dark) with curtains behind the glass;
            only on the solid house: with house7="none" the interior provides the door, the openings and the curtains */}
        {solid ? (
        <>
        <group position={[fd.x, 0, S + 0.01]}>
          <M g={boxG(fd.w, fd.h, 0.06)} c="#6e4630" tex="planks" p={[0, fd.h / 2, 0]} />
          <M g={boxG(fd.w + 0.14, 0.07, 0.07)} c="#efe6d4" tex="wood" p={[0, fd.h + 0.035, 0.02]} cast={false} />
          <M g={sphG(0.03, 10)} c="#c8b070" tex="metal" p={[0.33, 1.0, 0.05]} cast={false} />
        </group>
        <group position={[tw.x, tw.y, S + 0.012]}>
          <mesh geometry={boxG(tw.w, tw.h, 0.02)} material={coreMat("#ffcf80", 0.12 + 1.05 * tl)} />
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={boxG(tw.w * 0.36, tw.h, 0.01)} material={coreMat(tl > 0.05 ? "#c88a5a" : "#2e2a3a", 0.25 + 0.6 * tl)} position={[s * tw.w * 0.32, 0, 0.012]} />
          ))}
          <WindowFrame w={tw.w} h={tw.h} />
        </group>
        <group position={[kw.x, kw.y, S + 0.012]}>
          <mesh geometry={boxG(kw.w, kw.h, 0.02)} material={coreMat(kl > 0.05 ? "#ffcf80" : "#2a3460", 0.7 + 0.5 * kl)} />
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={boxG(kw.w * 0.36, kw.h, 0.01)} material={coreMat("#3a4472", 0.6)} position={[s * kw.w * 0.33, 0, 0.012]} />
          ))}
          <WindowFrame w={kw.w} h={kw.h} />
        </group>
        </>
        ) : null}
        <mesh geometry={sphG(0.07, 10)} material={coreMat("#ffe0a0", 0.25)} position={[fd.x + 0.75, 2.2, S + 0.1]} />
      </group>
      <Fence z={STREET.fenceZ} a={HOUSE.x0 - 0.1} b={HOUSE.x1 + 0.1} gate={{ x: STREET.gateX, w: 1.1 }} />
      {/* the "7" plate on the fence, east of the gate (the only text in the set) */}
      <M g={boxG(0.5, 1.5, 0.32)} c="#e8e0d0" tex="plaster" p={[STREET.plate[0], 0.75, STREET.fenceZ]} />
      <M g={boxG(0.58, 0.08, 0.38)} c="#b8ae9e" tex="stone" p={[STREET.plate[0], 1.54, STREET.fenceZ]} cast={false} />
      <group position={PLATE_POS}>
        <M g={boxG(0.4, 0.3, 0.025)} c="#2a3a6a" tex="metal" p={[0, 0, -0.01]} cast={false} />
        <mesh geometry={boxG(0.34, 0.26, 0.004)} material={plateMat()} position={[0, 0, 0.006]} />
      </group>
      <Tree p={[3.75, 0, 3.9]} s={0.7} />

      {/* ---- our-side neighbours (doors 0–1), facing south */}
      {NEIGHBOURS.ourSide.map((x, i) => (
        <group key={x}>
          <RowHouse x={x} z0={HOUSE.z0} z1={HOUSE.z1} faceZ={1} wall={i ? "#d8c8e0" : "#e0d0a8"} roof={i ? "#5a4a6a" : "#7a4232"} doorX={x - 1.6} windows={[-2.85, 1.6]} lit={i ? [] : [1]} doorOpen={no} />
          <Fence z={STREET.fenceZ} a={x - 3.6} b={x + 3.6} gate={{ x: x - 1.6, w: 1.1 }} />
        </group>
      ))}
      {/* ---- across the street (doors 2–5), facing north toward us */}
      {across.map((x, i) => (
        <group key={x}>
          <RowHouse x={x} z0={STREET.oppositeZ} z1={STREET.oppositeZ + 8} faceZ={-1} wall={wallsAcross[i]} roof={roofsAcross[i]} doorX={x + 1.2} windows={[-2.0, 2.75]} lit={i % 2 ? [0] : []} doorOpen={no} />
          <Fence z={STREET.oppositeZ - 1.2} a={x - 3.6} b={x + 3.6} gate={{ x: x + 1.2, w: 1.1 }} />
        </group>
      ))}
      <Tree p={[-5.5, 0, 11.0]} s={1.0} />
      <Tree p={[12.6, 0, 11.2]} s={0.9} />
      {/* the gang behind our row: a dark back wall seen through the gaps between houses */}
      {gangWall ? <M g={boxG(80, 2.6, 0.25)} c="#4a4458" tex="brick" p={[0, 1.3, STREET.gangZ - 1.6]} /> : null}
      {STREET.lamps.map((p, i) => (
        <StreetLamp key={i} p={p} toward={p[2] < (STREET.roadZ0 + STREET.roadZ1) / 2 ? 1 : -1} local={light === "local"} />
      ))}
      <Toa />
      {dense ? <MoreHouses doorsOpen={no} /> : null}
    </group>
  );
};

// ------------------------------------------------------------------ the denser neighbourhood (2026-11-17)
type HouseSpec = { x: number; w: number; H: number; wall: string; roof: string; door: number; windows: number[]; lit?: number[]; canopy?: boolean; fence: FenceStyle; tint?: string };
/** extra houses on our side (facing the street, south) and across (facing north); door / windows relative to x
 * (across: world offsets too — RowHouse mirrors them back); no door / window overlaps (checked by hand: |door| vs
 * window edges >= 0.1 m) */
export const MORE_OUR_SIDE: HouseSpec[] = [
  { x: -21.6, w: 7.4, H: 3.1, wall: "#cfdcc4", roof: "#5e3a30", door: -1.8, windows: [-3.0, 1.4], lit: [0], fence: "wall", tint: "#e6dccb" },
  { x: 17.6, w: 6.6, H: 3.3, wall: "#e6cfb0", roof: "#3e4660", door: 1.5, windows: [-1.8], canopy: true, fence: "hedge" },
  { x: 26.4, w: 7.2, H: 2.9, wall: "#c9c3dc", roof: "#6a4a3a", door: -1.6, windows: [-2.85, 1.7], lit: [1], fence: "rail", tint: "#e0d4c0" },
];
export const MORE_ACROSS: HouseSpec[] = [
  { x: -19.2, w: 7.0, H: 3.0, wall: "#d8b8b8", roof: "#4a3a4a", door: 1.2, windows: [-2.0, 2.75], canopy: true, fence: "wall", tint: "#ece4d4" },
  { x: 26.2, w: 7.4, H: 3.2, wall: "#bfd6cc", roof: "#6a3a3a", door: -1.5, windows: [-2.95, 1.6], lit: [1], fence: "hedge" },
  { x: -28.4, w: 7.0, H: 2.9, wall: "#e2d6b4", roof: "#5a4a5a", door: 1.2, windows: [-2.0, 2.75], fence: "rail" },
  { x: 35.2, w: 7.2, H: 3.1, wall: "#d0c4b0", roof: "#4a4a6a", door: -1.5, windows: [-2.95, 1.6], lit: [0], fence: "wall", tint: "#d8d0c0" },
];
/** depth: the rows behind ours (north) and behind the houses across (south) — bodies and roofs only, no shadows */
const BACK_COLORS = ["#d8c8b0", "#c8d0c0", "#e0c8c0", "#c8c8d8", "#e0d8b8"];
const BACK_ROOFS = ["#6a3a32", "#4a4a5e", "#7a4a36", "#5a4a5a", "#6a5a4a"];
const BackRow: React.FC<{ z0: number; z1: number; from: number; to: number; step: number; seed: number }> = ({ z0, z1, from, to, step, seed }) => {
  const xs: number[] = [];
  for (let x = from; x <= to; x += step) xs.push(x);
  const d = z1 - z0;
  return (
    <group>
      {xs.map((x, i) => {
        const k = (i * 7 + seed) % 5;
        const w = step - 1.2 - ((i + seed) % 3) * 0.3;
        const H = 2.9 + ((i + seed) % 4) * 0.12;
        return (
          <group key={x}>
            <M g={boxG(w, H, d)} c={BACK_COLORS[k]} tex="plaster" p={[x, H / 2, (z0 + z1) / 2]} cast={false} recv={false} />
            {[-1, 1].map((s) => (
              <M key={s} g={boxG(w + 0.7, 0.14, d * 0.6)} c={BACK_ROOFS[(k + 2) % 5]} tex="roofTiles" p={[x, H + d * 0.16, (z0 + z1) / 2 + s * d * 0.24]} r={[s * 0.55, 0, 0]} cast={false} recv={false} />
            ))}
          </group>
        );
      })}
    </group>
  );
};
const MoreHouses: React.FC<{ doorsOpen: number }> = ({ doorsOpen }) => (
  <group>
    {MORE_OUR_SIDE.map((h) => (
      <group key={h.x}>
        <RowHouse x={h.x} z0={HOUSE.z0} z1={HOUSE.z1} faceZ={1} w={h.w} H={h.H} wall={h.wall} roof={h.roof} doorX={h.x + h.door} windows={h.windows} lit={h.lit} doorOpen={doorsOpen} canopy={h.canopy} />
        <Fence z={STREET.fenceZ} a={h.x - h.w / 2 - 0.1} b={h.x + h.w / 2 + 0.1} gate={{ x: h.x + h.door, w: 1.1 }} style={h.fence} tint={h.tint} />
      </group>
    ))}
    {MORE_ACROSS.map((h) => (
      <group key={h.x}>
        <RowHouse x={h.x} z0={STREET.oppositeZ} z1={STREET.oppositeZ + 8} faceZ={-1} w={h.w} H={h.H} wall={h.wall} roof={h.roof} doorX={h.x + h.door} windows={h.windows} lit={h.lit} doorOpen={doorsOpen} canopy={h.canopy} lite={Math.abs(h.x) > 30} />
        <Fence z={STREET.oppositeZ - 1.2} a={h.x - h.w / 2 - 0.1} b={h.x + h.w / 2 + 0.1} gate={{ x: h.x + h.door, w: 1.1 }} style={h.fence} tint={h.tint} lite={Math.abs(h.x) > 30} />
      </group>
    ))}
    <BackRow z0={-15.5} z1={-9.5} from={-30} to={34} step={8.4} seed={1} />
    <BackRow z0={22.5} z1={28.5} from={-34} to={38} step={8.6} seed={3} />
    <Tree p={[-24.6, 0, 3.7]} s={0.85} />
    <Tree p={[21.6, 0, 11.1]} s={0.95} />
    <Tree p={[-15.0, 0, 11.3]} s={0.8} />
  </group>
);

/** the house-number plate face: a painted "7" (unlit, so it reads at night under the street lamp) */
let plateM: THREE.MeshBasicMaterial | null = null;
const plateMat = () => {
  if (plateM) return plateM;
  const W = 512;
  const Hh = 392;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = Hh;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#2a3a6a";
  g.fillRect(0, 0, W, Hh);
  g.strokeStyle = "#f4ead6";
  g.lineWidth = 14;
  g.strokeRect(18, 18, W - 36, Hh - 36);
  g.fillStyle = "#f4ead6";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 300px Poppins";
  g.fillText("7", W / 2, Hh / 2 + 14);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  plateM = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: new THREE.Color(0.85, 0.85, 0.85) });
  return plateM;
};

const WindowFrame: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <group>
    <M g={boxG(w + 0.12, 0.07, 0.06)} c="#efe6d4" tex="wood" p={[0, h / 2 + 0.035, 0.02]} cast={false} />
    <M g={boxG(w + 0.16, 0.07, 0.12)} c="#efe6d4" tex="wood" p={[0, -h / 2 - 0.035, 0.05]} cast={false} />
    <M g={boxG(0.06, h, 0.06)} c="#efe6d4" tex="wood" p={[-w / 2 - 0.03, 0, 0.02]} cast={false} />
    <M g={boxG(0.06, h, 0.06)} c="#efe6d4" tex="wood" p={[w / 2 + 0.03, 0, 0.02]} cast={false} />
    <M g={boxG(0.045, h, 0.05)} c="#efe6d4" tex="wood" p={[0, 0, 0.03]} cast={false} />
  </group>
);

// ------------------------------------------------------------------ POV through a curtain
/** two dark curtain panels just in front of the lens, framing a POV shot out of a window (use in the exterior world).
 * `open` = the visible fraction of the frame width between the panels (0.3 .. 0.9). */
export const PovCurtainFrame: React.FC<{ cam: Cam; open?: number; aspect?: number; c?: string }> = ({ cam, open = 0.6, aspect = 1080 / 1920, c = "#5a5a86" }) => {
  const q = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, [cam.pos, cam.look]);
  const d = 0.32;
  const halfH = Math.tan(((cam.fov / 2) * Math.PI) / 180) * d;
  const halfW = halfH * aspect;
  const inner = halfW * open;
  const pw = halfW * 1.4;
  return (
    <group position={cam.pos} quaternion={q}>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (inner + pw / 2), 0, -d]}>
          {[0, 1, 2].map((k) => (
            <M key={k} g={boxG(pw / 3 + 0.004, halfH * 2.6, 0.006)} c={k % 2 ? c : new THREE.Color(c).multiplyScalar(0.8).getStyle()} tex="fabric" ts={0.15} p={[-pw / 2 + (k + 0.5) * (pw / 3), 0, -(k % 2) * 0.01 * s]} cast={false} />
          ))}
        </group>
      ))}
    </group>
  );
};
