// Reusable supporting characters of the C1 stick family (2026-11-16, Content Unit 2026-11-002).
// One NPC = one `NpcPreset`: height, head size, plain tee colours, a parametric hair shell, optional pants and one
// optional accessory (a sarung over a shoulder, a jacket carried on a forearm). The body is C1's rig and look system
// (C1.tsx), so material, ink outline and shading are the approved C1 ones (D-021); hands are plain white ovals ("mitt"),
// feet are the project's simple capsules, faces use the project face (dot eyes, short brows, a line mouth), no "Uq".
// Everything is a pure function of its inputs (no clock, no random): the same preset renders the same pixels.
// Guide: 03-KNOWLEDGE/tools/npc-presets.md. Tested in the lineup still `CastLineup002` (standing, rest pose) only.
import React, { useMemo } from "react";
import * as THREE from "three";
import { smoothSeams } from "../inkbeat/char/geometry";
import { Inked } from "../inkbeat/char/Inked";
import { charMat } from "../inkbeat/char/material";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import { canvasTex } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { C1, C1_BUILD, STICK_HEAD, STICK_INK_W, WRIST_OFF, stickHip, teeRadiusAt, teeSurface } from "../c1/C1";
import type { C1Face, C1Props, StickLeg, StickLook, StickProportions } from "../c1/C1";

const L = layoutOf(C1_BUILD);
const HS = C1_BUILD.headScale ?? 1;
const W = STICK_INK_W;
const TORSO_RX = 0.14 * (C1_BUILD.torsoWidth ?? 1); // TORSO_R × torsoWidth (inkbeat family)
const smooth = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

// ------------------------------------------------------------------ hair
/** A hair shell around the head: an ellipsoid a little larger than the head; every vertex below the hairline is pulled
 * deep inside the head, so the visible hair is one closed mesh with a clean ink edge along the hairline (no open
 * shell edges). Heights are in head-sphere units: +1 = crown, 0 = the head's middle, -1 = chin. */
export type HairStyle = {
  /** hairline at the front centre (fringe / forehead line) */
  fringe: number;
  /** hair bottom at the sides (±90°) and at the back (180°) */
  side: number;
  back: number;
  /** half-width of the face opening (deg of azimuth from the front); outside it the side line applies */
  window: number;
  /** shell size against the head (1.05 tight … 1.15 full) */
  puff: number;
  /** outward flare toward the bottom edge (a bob) */
  flare?: number;
  /** strand jag along the hairline (amplitude in head-sphere units) and its frequency (per turn) */
  jag?: number;
  jagFreq?: number;
  /** bumpy, uneven silhouette (messy short hair) */
  messy?: number;
  /** a side sweep of the fringe line (a parting): + lifts the wearer's own left side, - the right */
  sweep?: number;
  /** a low bun at the back: radius (head units, head width ≈ 0.33) and height (head-sphere units) */
  bun?: { r: number; y: number };
  /** shell size at the crown (defaults to puff): a smaller value keeps the top close to the head (no helmet), the
   * puff value then applies from the ears down (2026-11-16 rev) */
  puffTop?: number;
  /** a few longer strand tips: each lowers the hairline around azimuth `az` (rad, 0 = front, + = the wearer's left)
   * by `len` (head-sphere units) over a half-width `w` (rad), so the edge gets uneven pointed ends */
  tips?: { az: number; len: number; w: number }[];
};
const hairCache = new Map<string, THREE.BufferGeometry>();
export const hairShellGeo = (h: HairStyle, sx = 1, sy = 1) => {
  const key = JSON.stringify([h, sx, sy]);
  const hit = hairCache.get(key);
  if (hit) return hit;
  const g = new THREE.SphereGeometry(1, 128, 96);
  const pa = g.attributes.position as THREE.BufferAttribute;
  const cy = STICK_HEAD.centerY(sy);
  const rx = STICK_HEAD.RX * sx;
  const ry = STICK_HEAD.RY * sy;
  const rz = STICK_HEAD.RZ * sx;
  const pTop = h.puffTop ?? h.puff;
  /** shell scale at height ny: puffTop at the crown → puff from about the ears down */
  const puffAt = (ny: number) => pTop + (h.puff - pTop) * smooth(0.55, -0.15, ny);
  const tipAt = (az: number) => {
    let d = 0;
    for (const tp of h.tips ?? []) {
      const da = Math.atan2(Math.sin(az - tp.az), Math.cos(az - tp.az));
      const u = Math.abs(da) / tp.w;
      if (u < 1) d += tp.len * (1 - u) * (1 - u); // pointed: a sharp tip, wide root
    }
    return d;
  };
  const win = (h.window * Math.PI) / 180;
  const ramp = 0.3; // rad: fringe → side transition
  const lineAt = (az: number) => {
    const a = Math.abs(az);
    const jag = h.jag ?? 0;
    const fq = h.jagFreq ?? 7;
    // left/right symmetric strands (cos), except an optional side sweep (a parting: + lifts the wearer's left side)
    const front = h.fringe + jag * Math.cos(az * fq) + (h.sweep ?? 0) * Math.max(-1, Math.min(1, az / Math.max(0.01, win)));
    const sideLine = h.side + jag * 0.35 * Math.cos(az * fq * 0.6);
    const backLine = h.back + jag * 0.35 * Math.cos(az * fq * 0.6);
    const sideOrBack = sideLine + (backLine - sideLine) * smooth(Math.PI / 2, Math.PI, a);
    return Math.max(-0.97, Math.min(0.97, front + (sideOrBack - front) * smooth(win, win + ramp, a) - tipAt(az)));
  };
  // The sphere's rows are remapped in latitude: rows 0..CUT (crown → hairline) are stretched over the hair, so the
  // hairline is one exact row of vertices (a smooth edge, no grid staircase); the rows below CUT fold the edge inward
  // into the head as a short lip (hidden), which keeps the mesh closed.
  const CUT = 0.86;
  const uvA = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pa.count; i++) {
    const dx = pa.getX(i);
    const dy = pa.getY(i);
    const dz = pa.getZ(i);
    // azimuth from the uv (exact on the pole rows too): 0 = front (+z)
    const phi = uvA.getX(i) * Math.PI * 2;
    const az = Math.atan2(-Math.cos(phi), Math.sin(phi));
    void dx;
    void dz;
    const th = Math.acos(Math.max(-1, Math.min(1, dy))); // 0 = crown
    const thL = Math.acos(lineAt(az));
    const thC = Math.PI * CUT;
    const t2 = th <= thC ? (th / thC) * thL : thL;
    const ny = Math.cos(t2);
    const sr = Math.sin(t2);
    const pf = puffAt(ny);
    let x = sr * Math.sin(az) * rx * pf;
    let y = ny * ry * (1 + (pf - 1) * 0.8);
    let z = sr * Math.cos(az) * rz * pf;
    const bump = 1 + (h.messy ?? 0) * Math.sin(az * 5 + 1.3) * Math.sin(ny * 7 + 0.4);
    const fl = 1 + (h.flare ?? 0) * Math.max(0, 0.25 - ny);
    x *= bump * fl;
    z *= bump * fl;
    y *= 1 + (h.messy ?? 0) * 0.5 * Math.sin(az * 3 + 2.1) * Math.max(0, ny);
    if (th > thC) {
      // the lip: from the hairline straight in toward the head's middle (ends deep inside the head)
      const k = 0.5 * ((th - thC) / (Math.PI - thC));
      x *= 1 - k;
      y *= 1 - k;
      z *= 1 - k;
    }
    pa.setXYZ(i, x, y + cy, z - 0.004);
  }
  g.deleteAttribute("uv");
  const out = smoothSeams(g);
  hairCache.set(key, out);
  return out;
};
const bunGeo = (r: number) => {
  const key = `bun|${r}`;
  const hit = hairCache.get(key);
  if (hit) return hit;
  const g = new THREE.SphereGeometry(r, 32, 24);
  g.scale(1.15, 0.95, 0.9);
  g.deleteAttribute("uv");
  const out = smoothSeams(g);
  hairCache.set(key, out);
  return out;
};
/** head wear for C1's `headWear` slot */
export const HairWear: React.FC<{ hair: HairStyle; color: string; sx?: number; sy?: number }> = ({ hair, color, sx = 1, sy = 1 }) => {
  // spec and rim off: the additive highlight terms, not the albedo, made black hair read brown-grey
  const mat = charMat(color, { spec: 0, rim: 0 });
  const ink = (W * 0.9) / HS;
  const cy = STICK_HEAD.centerY(sy);
  return (
    <group>
      <Inked geo={hairShellGeo(hair, sx, sy)} mat={mat} ink={ink} under={0.6} />
      {hair.bun ? (
        <Inked geo={bunGeo(hair.bun.r)} mat={mat} ink={ink} under={0.4} position={[0, cy + hair.bun.y * STICK_HEAD.RY * sy, -STICK_HEAD.RZ * sx * hair.puff * 0.93 - hair.bun.r * 0.55]} />
      ) : null}
    </group>
  );
};

// ------------------------------------------------------------------ a swept strip (sarung, jacket)
const capG = new THREE.CircleGeometry(1, 24);
/** a flat strip swept along a path: rounded-rectangle cross-section (width along `axis`, thickness across), uv.x
 * across the width, uv.y along the length, both ends closed */
export const stripGeo = (path: THREE.Vector3[], axisAt: (u: number, T: THREE.Vector3) => THREE.Vector3, width: number, thick: number, seg = 48, ring = 16) => {
  const curve = new THREE.CatmullRomCurve3(path, false, "centripetal");
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const lenTotal = curve.getLength();
  const ends: { c: THREE.Vector3; base: number }[] = [];
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    const c = curve.getPointAt(u);
    const T = curve.getTangentAt(u).normalize();
    const A = axisAt(u, T).clone();
    A.addScaledVector(T, -A.dot(T)).normalize();
    const N = new THREE.Vector3().crossVectors(T, A).normalize();
    const base = pos.length / 3;
    for (let j = 0; j < ring; j++) {
      const th = (j / ring) * Math.PI * 2;
      const cs = Math.cos(th);
      const sn = Math.sin(th);
      const a = (Math.sign(cs) * Math.pow(Math.abs(cs), 0.35) * width) / 2;
      const b = (Math.sign(sn) * Math.pow(Math.abs(sn), 0.35) * thick) / 2;
      pos.push(c.x + A.x * a + N.x * b, c.y + A.y * a + N.y * b, c.z + A.z * a + N.z * b);
      uv.push(0.5 + a / width, (u * lenTotal) / width);
    }
    if (i === 0 || i === seg) ends.push({ c, base });
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < ring; j++) {
      const a = i * ring + j;
      const b = i * ring + ((j + 1) % ring);
      const c = (i + 1) * ring + j;
      const d = (i + 1) * ring + ((j + 1) % ring);
      idx.push(a, c, b, b, c, d);
    }
  // end caps (fans)
  ends.forEach(({ c, base }, k) => {
    const ci = pos.length / 3;
    pos.push(c.x, c.y, c.z);
    uv.push(0.5, 0.5);
    for (let j = 0; j < ring; j++) {
      const a = base + j;
      const b = base + ((j + 1) % ring);
      if (k === 0) idx.push(ci, b, a);
      else idx.push(ci, a, b);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // flip if the winding came out inward (normal of the first side quad against the outward direction)
  const n0 = new THREE.Vector3().fromBufferAttribute(g.attributes.normal as THREE.BufferAttribute, 0);
  const p0 = new THREE.Vector3().fromBufferAttribute(g.attributes.position as THREE.BufferAttribute, 0);
  const c0 = curve.getPointAt(0);
  if (n0.dot(p0.clone().sub(c0)) < 0) {
    const ix = g.index!.array as Uint32Array | Uint16Array;
    for (let i = 0; i < ix.length; i += 3) {
      const t = ix[i + 1];
      ix[i + 1] = ix[i + 2];
      ix[i + 2] = t;
    }
    g.index!.needsUpdate = true;
    g.computeVertexNormals();
  }
  return g;
};

// ------------------------------------------------------------------ sarung over a shoulder
/** a point on the tee surface at torso-local x (|x| from the centre line) and height fraction v, front (zs = 1) or
 * back (zs = -1), pushed `out` along the surface normal; null where the tee is narrower than x */
export const teeAtX = (x: number, v: number, zs: 1 | -1, out: number) => {
  const sx = Math.sign(x) || 1;
  const ax = Math.abs(x);
  if (teeSurface(0.999, v).p.x < ax) return null;
  let lo = 0;
  let hi = 0.999;
  for (let k = 0; k < 40; k++) {
    const m = (lo + hi) / 2;
    if (teeSurface(m, v).p.x < ax) lo = m;
    else hi = m;
  }
  const s = teeSurface((lo + hi) / 2, v, out);
  return new THREE.Vector3(s.p.x * sx, s.p.y, s.p.z * zs);
};
/** the tee's top (y, torso-local) above x on the centre plane (z = 0) */
export const teeTopAt = (x: number) => {
  let lo = 0.86;
  let hi = 1;
  const want = Math.abs(x) / TORSO_RX;
  for (let k = 0; k < 40; k++) {
    const m = (lo + hi) / 2;
    if (teeRadiusAt(m) >= want) lo = m;
    else hi = m;
  }
  return lo * L.torsoH;
};
export type SarungOpts = { side: 1 | -1; color: string; line: string; dark: string; x?: number; width?: number; frontV?: number; backV?: number };
const sarungTex = (o: SarungOpts) =>
  canvasTex(`sarung|${o.color}|${o.line}|${o.dark}`, 256, 256, (g, w, h) => {
    g.fillStyle = o.color;
    g.fillRect(0, 0, w, h);
    // a woven check: broad dark bands and thin light lines both ways
    g.fillStyle = o.dark;
    for (const k of [0.08, 0.58]) {
      g.globalAlpha = 0.55;
      g.fillRect(k * w, 0, 0.16 * w, h);
      g.fillRect(0, k * h, w, 0.16 * h);
    }
    g.globalAlpha = 0.7;
    g.fillStyle = o.line;
    for (const k of [0.32, 0.37, 0.82, 0.87]) {
      g.fillRect(k * w, 0, 0.018 * w, h);
      g.fillRect(0, k * h, w, 0.018 * h);
    }
    g.globalAlpha = 1;
  });
const sarungMap = (o: SarungOpts) => {
  const t = sarungTex(o);
  if (t.wrapS !== THREE.RepeatWrapping) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
  }
  return t;
};
/** a folded sarung lying over one shoulder (side +1 = the wearer's own left), hanging down the chest and the back.
 * Pass as C1's `chest` (torso-local frame). */
export const SarungShoulder: React.FC<SarungOpts> = (o) => {
  const geo = useMemo(() => {
    const xc = o.side * (o.x ?? 0.056);
    const thick = 0.011;
    const out = 0.006 + thick / 2;
    const fv = o.frontV ?? 0.3;
    const bv = o.backV ?? 0.4;
    const front: THREE.Vector3[] = [];
    const back: THREE.Vector3[] = [];
    for (const v of [fv, 0.5, 0.68, 0.82, 0.9, 0.95]) {
      const p = teeAtX(xc, v, 1, out);
      if (p) front.push(p);
    }
    for (const v of [bv, 0.55, 0.72, 0.84, 0.91, 0.95]) {
      const p = teeAtX(xc, v, -1, out);
      if (p) back.push(p);
    }
    const top = new THREE.Vector3(xc, teeTopAt(xc) + out, 0);
    const path = [...back, top, ...front.reverse()];
    // the width lies across the shoulder: horizontal on the hanging parts, along the shoulder slope on top
    const dyx = (teeTopAt(xc + 0.012) - teeTopAt(xc - 0.012)) / 0.024;
    const slope = new THREE.Vector3(1, dyx, 0).normalize();
    const flat = new THREE.Vector3(1, 0, 0);
    return stripGeo(path, (_u, T) => flat.clone().lerp(slope, 1 - Math.min(1, Math.abs(T.y) * 1.3)).normalize(), o.width ?? 0.068, thick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.side, o.x, o.width, o.frontV, o.backV]);
  const mat = charMat("#ffffff", { spec: 0.08, map: sarungMap(o) });
  return <Inked geo={geo} mat={mat} ink={W * 0.45} under={0.3} />;
};

// ------------------------------------------------------------------ jacket carried over a forearm
export type JacketOpts = { arm: "L" | "R"; color: string; dark: string; at?: number };
/** a folded jacket hanging over the forearm of arm `arm` ("L" chain = the character's own right, -x), for the pose the
 * body is drawn with. Pass as C1's `chest` (torso-local frame). */
export const JacketOnArm: React.FC<JacketOpts & { pose: NonNullable<C1Props["pose"]> }> = ({ arm, color, dark, at = 0.5, pose }) => {
  const key = JSON.stringify([arm, at, pose.armL, pose.armR, pose.armLFwd, pose.armRFwd]);
  const geos = useMemo(() => {
    const { E, H } = armChain(pose, arm, L);
    const fore = H.clone().sub(E).normalize();
    const wrist = H.clone().addScaledVector(fore, -WRIST_OFF);
    const mid = E.clone().lerp(wrist, at).add(new THREE.Vector3(0, -L.torsoY0, 0));
    const down = new THREE.Vector3(0, -1, 0).addScaledVector(fore, fore.y).normalize();
    const side = new THREE.Vector3().crossVectors(fore, down).normalize();
    const P = (s: number, d: number, f = 0) => mid.clone().addScaledVector(side, s).addScaledVector(down, d).addScaledVector(fore, f);
    // an inverted U over the forearm: the body side hangs shorter, the outer side longer, with a soft swing
    const fold = (sc: number, f: number, lenIn: number, lenOut: number) =>
      stripGeo(
        [P(-0.03 * sc, lenIn, f), P(-0.029 * sc, lenIn * 0.45, f), P(-0.018 * sc, 0.003, f), P(0, -0.015 * sc, f), P(0.018 * sc, 0.003, f), P(0.032 * sc, lenOut * 0.45, f), P(0.038 * sc, lenOut, f)],
        () => fore,
        0.078,
        0.022,
      );
    return [fold(1, 0, 0.11, 0.16), fold(1.3, -0.006, 0.08, 0.125)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <group>
      <Inked geo={geos[0]} mat={charMat(color, { spec: 0.1 })} ink={W * 0.5} under={0.3} />
      <Inked geo={geos[1]} mat={charMat(dark, { spec: 0.08 })} ink={W * 0.45} under={0.3} />
    </group>
  );
};

// ------------------------------------------------------------------ pants (lower-body slot)
export type PantsOpts = { color: string; dark: string; /** 0..1 of hem → ankle the trouser leg covers */ len: number; r?: number; /** outline width factor (default 0.4) */ ink?: number };
const pantsCache = new Map<string, { legs: THREE.BufferGeometry[]; hems: { c: THREE.Vector3; n: THREE.Vector3; r: number }[] }>();
/** loose pyjama-style trousers following the legs' centre lines. Use with C1's `legWear`. Tested standing only. */
const TOP_GAP = 0.006;
export const pantsWear = (o: PantsOpts) => (legs: StickLeg[]) => <Pants o={o} legs={legs} />;
const Pants: React.FC<{ o: PantsOpts; legs: StickLeg[] }> = ({ o, legs }) => {
  const key = JSON.stringify([o.len, o.r, legs.map((l) => l.pts.map((p) => p.toArray().map((v) => v.toFixed(4))))]);
  let hit = pantsCache.get(key);
  if (!hit) {
    const r0 = o.r ?? 0.031;
    const yHem = L.torsoY0;
    const yBot = yHem - o.len * (yHem - 0.012);
    const legGeos: THREE.BufferGeometry[] = [];
    const hems: { c: THREE.Vector3; n: THREE.Vector3; r: number }[] = [];
    for (const l of legs) {
      const curve = new THREE.CatmullRomCurve3(l.pts, false, "centripetal");
      // the trouser leg starts just below the tee's outline band (its hull reaches ~0.012 h under the hem): a tube that
      // pierced the hull drew a row of ink dots along the hem (QC 2026-11-16); the top is closed with a cap instead
      const pts = curve.getPoints(120).filter((p) => p.y >= yBot && p.y <= yHem - TOP_GAP);
      const last = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      const dir = last.clone().sub(prev).normalize();
      const r1 = r0 * 1.1;
      const pr: number[] = [];
      const idx: number[] = [];
      const ring = 24;
      for (let i = 0; i < pts.length; i++) {
        const u = i / (pts.length - 1);
        const T = i < pts.length - 1 ? pts[i + 1].clone().sub(pts[i]).normalize() : dir;
        const A = new THREE.Vector3(1, 0, 0).addScaledVector(T, -T.x).normalize();
        const B = new THREE.Vector3().crossVectors(T, A).normalize();
        // tapered inside the tee (the top rim stays hidden in it), full width from just below the hem, a slight flare
        const r = r0 + (r1 - r0) * u;
        for (let j = 0; j < ring; j++) {
          const th = (j / ring) * Math.PI * 2;
          const c = pts[i];
          pr.push(c.x + (A.x * Math.cos(th) + B.x * Math.sin(th)) * r, c.y + (A.y * Math.cos(th) + B.y * Math.sin(th)) * r, c.z + (A.z * Math.cos(th) + B.z * Math.sin(th)) * r * 0.92);
        }
      }
      for (let i = 0; i < pts.length - 1; i++)
        for (let j = 0; j < ring; j++) {
          const a = i * ring + j;
          const b = i * ring + ((j + 1) % ring);
          const c = (i + 1) * ring + j;
          const d = (i + 1) * ring + ((j + 1) % ring);
          idx.push(a, b, c, b, d, c);
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pr, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      // keep outward-facing triangles
      const n0 = new THREE.Vector3().fromBufferAttribute(g.attributes.normal as THREE.BufferAttribute, ring * 5);
      const p0 = new THREE.Vector3().fromBufferAttribute(g.attributes.position as THREE.BufferAttribute, ring * 5);
      if (n0.dot(p0.clone().sub(pts[5])) < 0) {
        const ix = g.index!.array as Uint32Array | Uint16Array;
        for (let i = 0; i < ix.length; i += 3) {
          const t = ix[i + 1];
          ix[i + 1] = ix[i + 2];
          ix[i + 2] = t;
        }
        g.computeVertexNormals();
      }
      legGeos.push(smoothSeams(g));
      hems.push({ c: last, n: dir, r: r1 });
      hems.push({ c: pts[0], n: new THREE.Vector3(0, 1, 0), r: r0 });
    }
    hit = { legs: legGeos, hems };
    if (pantsCache.size > 40) pantsCache.clear();
    pantsCache.set(key, hit);
  }
  const mat = charMat(o.color, { spec: 0.14 });
  const hemMat = charMat(o.dark, { spec: 0.02 });
  return (
    <group>
      {hit.legs.map((g, i) => (
        // receive=false: the tee hem's shadow broke into dashes (shadow-map aliasing) on the wide trouser tops
        <Inked key={i} geo={g} mat={mat} ink={W * (o.ink ?? 0.4)} under={0.3} receive={false} />
      ))}
      {hit.hems.map((h, i) => (
        <mesh key={i} geometry={capG} material={hemMat} position={h.c.clone().addScaledVector(h.n, -0.002)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), h.n)} scale={[h.r * 0.97, h.r * 0.97, 1]} />
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ presets
export type NpcAccessory = ({ kind: "sarung-shoulder" } & SarungOpts) | ({ kind: "jacket-arm" } & JacketOpts);
export type NpcPreset = {
  id: string;
  /** label for sheets (Indonesian) */
  label: string;
  /** world height passed to C1's `height` (C1 = 1.5); the head size adds on top (see presetHeight) */
  height: number;
  /** head size against C1's (children: larger heads) */
  head: { sx: number; sy: number };
  shirt: { color: string; dark: string; cuff: string };
  hair: HairStyle & { color: string };
  pants?: PantsOpts;
  accessory?: NpcAccessory;
  /** body proportions (toddler: shorter legs and arms). The jacket accessory assumes armK = 1. */
  proportions?: StickProportions;
  /** the preset's resting pose (arm angles) and face; scenes override them */
  pose?: NonNullable<C1Props["pose"]>;
  face?: C1Face;
  blinkSeed?: number;
  /** D-029 bodied limbs (pants = the preset's pants colour or `limbs.pants`); absent = sticks + pantsWear */
  limbs?: StickLook["limbs"];
  inkK?: number;
};
/** the StickLook a preset draws with: a plain tee (never "Uq"), plain oval hands */
export const lookOf = (p: NpcPreset): StickLook => ({
  id: p.id,
  head: p.head,
  shirt: { kind: "tee", color: p.shirt.color, dark: p.shirt.dark, cuff: p.shirt.cuff },
  // "oval" (2026-11-16 rev): larger filled oval; the small "mitt" read as an ink ring at lineup scale
  hands: "oval",
  face: { smileW: 1 },
  ...(p.limbs ? { limbs: p.limbs } : {}),
  ...(p.inkK ? { inkK: p.inkK } : {}),
});

/** hair styles used so far (head-sphere units; see HairStyle) */
export const HAIR = {
  /** C3 adik: full black bob with a jagged fringe, ends at the jaw, flared */
  bob: { fringe: 0.3, side: -0.6, back: -0.64, window: 40, puff: 1.17, flare: 0.3, jag: 0.04, jagFreq: 8 } as HairStyle,
  /** W1 bapak: short, neat, high hairline */
  short: { fringe: 0.6, side: 0.05, back: -0.42, window: 56, puff: 1.045 } as HairStyle,
  /** W2 ibu: smooth, pulled back from the forehead into a low bun */
  bunLow: { fringe: 0.5, side: -0.3, back: -0.5, window: 50, puff: 1.05, sweep: 0.12, bun: { r: 0.062, y: -0.4 } } as HairStyle,
  /** anak warga: short and a little messy */
  messyShort: { fringe: 0.42, side: -0.02, back: -0.45, window: 52, puff: 1.08, jag: 0.06, jagFreq: 9, messy: 0.035 } as HairStyle,
  /** C3 adik rev (2026-11-16): bob closer to the head (tight crown, modest volume from the ears down, little flare) with
   * a few uneven pointed tips in the fringe and along the ends; replaces `bob` on ADIK (`bob` kept for history) */
  bobClose: {
    fringe: 0.36, side: -0.56, back: -0.74, window: 42, puff: 1.095, puffTop: 1.035, flare: 0.08, jag: 0.018, jagFreq: 9,
    tips: [
      { az: -0.42, len: 0.12, w: 0.16 }, { az: -0.08, len: 0.08, w: 0.13 }, { az: 0.3, len: 0.13, w: 0.15 },
      { az: -1.05, len: 0.1, w: 0.14 }, { az: -1.45, len: 0.14, w: 0.16 }, { az: 1.12, len: 0.12, w: 0.15 }, { az: 1.5, len: 0.08, w: 0.12 },
      { az: -2.2, len: 0.1, w: 0.18 }, { az: 2.35, len: 0.12, w: 0.18 }, { az: 2.9, len: 0.08, w: 0.16 }, { az: -2.85, len: 0.11, w: 0.17 },
    ],
  } as HairStyle,
  /** balita (toddler): thin, short, a little tousled */
  toddler: { fringe: 0.5, side: 0.05, back: -0.3, window: 56, puff: 1.04, jag: 0.05, jagFreq: 11, messy: 0.03 } as HairStyle,
};
/** NPC rest pose: arms hang close to the body (the reference lineup), a little straighter than C1's rest */
const REST: NonNullable<C1Props["pose"]> = { armL: [8, -3], armR: [8, -3] };
/** black hair: the albedo is darker than the look target because the toon light lifts it */
export const HAIR_BLACK = "#060509";

/** C3 — adik (2026-11-002): girl 12–13, black bob, peach pyjama tee + trousers, mustard jacket over her right forearm.
 * Reference studio/out/rev/C3_adik_ref_v1.jpg (approved as a design reference 2026-11-16; this 3D model is a proposal). */
export const ADIK: NpcPreset = {
  id: "C3-adik-v3",
  label: "Adik (C3)",
  height: 1.27,
  head: { sx: 1.06, sy: 1.06 },
  shirt: { color: "#c88264", dark: "#b26f53", cuff: "#a5654b" },
  hair: { ...HAIR.bobClose, color: HAIR_BLACK },
  pants: { color: "#c88264", dark: "#9c6049", len: 0.72, r: 0.044 },
  accessory: { kind: "jacket-arm", arm: "L", color: "#91741f", dark: "#775b17", at: 0.6 },
  // the right forearm ("L" chain) crosses in front of the belly, so the hand and the jacket stay close to the body
  pose: { armL: [6, 84], armLFwd: 74, armR: [10, -4] },
  face: { mouth: "flat", brows: "neutral" },
  blinkSeed: 7,
};
/** W1 — bapak warga: short hair, cream tee, brown check sarung over his left shoulder */
export const BAPAK: NpcPreset = {
  id: "W1-bapak-v1",
  label: "Bapak (W1)",
  height: 1.53,
  head: { sx: 1.02, sy: 1.02 },
  shirt: { color: "#c8b991", dark: "#b2a37c", cuff: "#a89a74" },
  hair: { ...HAIR.short, color: HAIR_BLACK },
  accessory: { kind: "sarung-shoulder", side: 1, color: "#4f432e", line: "#817451", dark: "#2d2417" },
  pose: REST,
  face: { mouth: "soft" },
  blinkSeed: 13,
};
/** W2 — ibu warga: low bun, sage tee */
export const IBU: NpcPreset = {
  id: "W2-ibu-v1",
  label: "Ibu (W2)",
  height: 1.39,
  head: { sx: 1.0, sy: 1.0 },
  shirt: { color: "#5a6e57", dark: "#4c604b", cuff: "#485a46" },
  hair: { ...HAIR.bunLow, color: HAIR_BLACK },
  pose: REST,
  face: { mouth: "flat" },
  blinkSeed: 17,
};
/** anak warga: short messy hair, dusty blue tee, shorter than adik */
export const ANAK_WARGA: NpcPreset = {
  id: "W-anak-v1",
  label: "Anak warga",
  height: 1.02,
  head: { sx: 1.1, sy: 1.1 },
  shirt: { color: "#425b5f", dark: "#384e52", cuff: "#34494d" },
  hair: { ...HAIR.messyShort, color: HAIR_BLACK },
  pose: REST,
  face: { mouth: "flat" },
  blinkSeed: 23,
};
/** balita (2–3 th), a variant of the child family (owner 2026-11-16): a much bigger head, short legs and arms — the
 * proportions of a toddler, not a scaled-down ANAK_WARGA (which stays as it is). Carried by IBU (carry.tsx). */
export const BALITA: NpcPreset = {
  id: "W-balita-v1",
  label: "Balita (digendong W2)",
  height: 0.85,
  head: { sx: 1.3, sy: 1.28 },
  shirt: { color: "#a8794a", dark: "#946840", cuff: "#8a603b" },
  hair: { ...HAIR.toddler, color: HAIR_BLACK },
  proportions: { legK: 0.5, armK: 0.62 },
  pose: { armL: [10, 10], armR: [10, 10] },
  face: { mouth: "flat" },
  blinkSeed: 29,
};
/** background villagers W3–W5 (2026-11-002, D-027): variants of the approved presets (colour, hair, height only) */
export const WARGA_3: NpcPreset = { ...BAPAK, id: "W3-v1", label: "Warga 3", height: 1.5, head: { sx: 1.0, sy: 1.0 }, shirt: { color: "#6e7f96", dark: "#5c6b80", cuff: "#56647a" }, hair: { ...HAIR.short, color: HAIR_BLACK, fringe: 0.66 }, accessory: undefined, face: { mouth: "flat" }, blinkSeed: 31 };
export const WARGA_4: NpcPreset = { ...IBU, id: "W4-v1", label: "Warga 4", height: 1.42, shirt: { color: "#9c6b72", dark: "#85595f", cuff: "#7d545a" }, hair: { ...HAIR.bunLow, color: HAIR_BLACK, sweep: -0.1 }, face: { mouth: "flat" }, blinkSeed: 37 };
export const WARGA_5: NpcPreset = { ...BAPAK, id: "W5-v1", label: "Warga 5", height: 1.46, head: { sx: 1.04, sy: 0.98 }, shirt: { color: "#b9b4a4", dark: "#a29d8e", cuff: "#99948a" }, hair: { ...HAIR.short, color: "#3a3a42", fringe: 0.72, side: 0.15 }, accessory: undefined, face: { mouth: "flat" }, blinkSeed: 41 };
export const NPC_PRESETS = { ADIK, BAPAK, IBU, ANAK_WARGA, BALITA, WARGA_3, WARGA_4, WARGA_5 };

/** standing heights (world units, soles = 0) of a preset: to the head top and to the hair top. C1 = 1.5 (head top). */
export const presetHeight = (p: NpcPreset) => {
  const chin = L.chinY + stickHip(p.proportions).dy;
  const headTop = chin + (STICK_HEAD.BOT_Y + 2 * STICK_HEAD.RY * p.head.sy - STICK_HEAD.BOT_Y) * HS;
  const puffY = 1 + ((p.hair.puffTop ?? p.hair.puff) - 1) * 0.8;
  const hairTopLocal = STICK_HEAD.centerY(p.head.sy) + STICK_HEAD.RY * p.head.sy * puffY - STICK_HEAD.BOT_Y;
  return { head: headTop * p.height, hair: (chin + hairTopLocal * HS) * p.height };
};

// ------------------------------------------------------------------ the character
export type NpcProps = Omit<C1Props, "look" | "height" | "headWear" | "legWear" | "chest"> & { preset: NpcPreset };
/** draw a preset with C1's rig: <Npc preset={BAPAK} position={[x, 0, z]} t={t} faceCamera={cam.pos} /> */
export const Npc: React.FC<NpcProps> = ({ preset: p, pose, face, blinkSeed, ...rest }) => {
  const look = lookOf(p);
  const fullPose = { ...(p.pose ?? REST), ...(pose ?? {}) };
  const acc = p.accessory;
  const chest = acc ? acc.kind === "sarung-shoulder" ? <SarungShoulder {...acc} /> : <JacketOnArm {...acc} pose={fullPose} /> : undefined;
  return (
    <C1
      {...rest}
      look={look}
      height={p.height}
      pose={fullPose}
      face={face ?? p.face}
      blinkSeed={blinkSeed ?? p.blinkSeed}
      headWear={<HairWear hair={p.hair} color={p.hair.color} sx={p.head.sx} sy={p.head.sy} />}
      legWear={p.pants && !p.limbs ? pantsWear(p.pants) : undefined}
      chest={chest}
      proportions={p.proportions}
    />
  );
};
export const npcPosition = (x: number, z = 0): V3 => [x, 0, z];
