// Episode 3 (2026-11-004): is a point (an LED) visible from a lens, or is it behind a wall, a door or a character?
// Used to gate the screen-space LED halo (the halo is a DOM overlay, so the renderer's depth test does not hide it).
// Walls = house no. 7 exactly as ep002/sets.tsx HouseInterior builds them (cut around openings); the back door, the
// front door and the vent glass count as solid; curtained windows count as OPEN (conservative = more "visible").
// The bedroom door leaf uses its open angle. Characters: head sphere + torso/leg cylinder per character.
// Furniture is not an occluder (all LED sightlines in the storyboard pass above it). Pure functions, no state.
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop } from "../c1/C1";
import type { V3 } from "../inkbeat/types";

type Box = { min: V3; max: V3; tag: string };
const T = 0.12, H = 2.7;
type Op = { c: number; w: number; y0: number; y1: number };
const wallBoxes = (along: "x" | "z", at: number, a: number, b: number, open: Op[], tag: string): Box[] => {
  const out: Box[] = [];
  const ops = open.map((o) => ({ u0: Math.max(a, o.c - o.w / 2), u1: Math.min(b, o.c + o.w / 2), y0: o.y0, y1: o.y1 }));
  const edges = [...new Set([a, b, ...ops.flatMap((o) => [o.u0, o.u1])])].filter((e) => e >= a && e <= b).sort((p, q) => p - q);
  for (let i = 0; i + 1 < edges.length; i++) {
    const u0 = edges[i], u1 = edges[i + 1];
    if (u1 - u0 < 1e-4) continue;
    const cover = ops.filter((o) => o.u0 <= u0 + 1e-6 && o.u1 >= u1 - 1e-6).sort((p, q) => p.y0 - q.y0);
    let y = 0;
    const parts: [number, number][] = [];
    for (const o of cover) { if (o.y0 > y + 0.001) parts.push([y, o.y0]); y = Math.max(y, o.y1); }
    if (y < H - 0.001) parts.push([y, H]);
    for (const [y0, y1] of parts) out.push(along === "x" ? { min: [u0, y0, at - T / 2], max: [u1, y1, at + T / 2], tag } : { min: [at - T / 2, y0, u0], max: [at + T / 2, y1, u1], tag });
  }
  return out;
};
const WALLS: Box[] = [
  ...wallBoxes("x", 3.0, -4, 4, [{ c: -0.7, w: 1.4, y0: 0.8, y1: 1.9 }, { c: 2.6, w: 1.2, y0: 0.8, y1: 1.9 }], "dinding depan"),
  ...wallBoxes("x", -5.0, -4, 4, [], "dinding belakang"),
  ...wallBoxes("z", -4.0, -5, 3, [], "dinding barat"),
  ...wallBoxes("z", 4.0, -5, 3, [], "dinding timur"),
  ...wallBoxes("z", 1.0, -1, 3, [{ c: 0.25, w: 0.9, y0: 0, y1: 2.05 }], "dinding kamar (barat)"),
  ...wallBoxes("x", -1.0, 1, 4, [], "dinding kamar (utara)"),
  ...wallBoxes("x", -1.0, -4, 1, [{ c: -0.8, w: 1.2, y0: 0, y1: 2.2 }], "dinding utara ruang tamu"),
  ...wallBoxes("z", -1.4, -3.2, -1, [], "dinding barat lorong"),
  ...wallBoxes("z", -0.2, -3.2, -1, [], "dinding timur lorong"),
  ...wallBoxes("x", -3.2, -4, -1.4, [], "dinding dapur (barat)"),
  ...wallBoxes("x", -3.2, -0.2, 1, [], "dinding dapur (timur)"),
  ...wallBoxes("z", 1.0, -5, -1, [], "dinding petak timur"),
];
const segBox = (p: THREE.Vector3, q: THREE.Vector3, b: Box) => {
  let t0 = 0, t1 = 1;
  const d = [q.x - p.x, q.y - p.y, q.z - p.z], o = [p.x, p.y, p.z];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-12) { if (o[i] < b.min[i] || o[i] > b.max[i]) return false; continue; }
    let a = (b.min[i] - o[i]) / d[i], c = (b.max[i] - o[i]) / d[i];
    if (a > c) [a, c] = [c, a];
    t0 = Math.max(t0, a); t1 = Math.min(t1, c);
    if (t0 > t1) return false;
  }
  return t1 > 1e-4 && t0 < 1 - 1e-4;
};
/** bedroom door leaf (Door along z at (1.0, 0, 0.25), hinge −1 at the south jamb, opening into the living room) */
const segLeaf = (p: THREE.Vector3, q: THREE.Vector3, open: number) => {
  const a: V3 = [1.0, 0, 0.69];
  const b: V3 = [1.0 - Math.sin(open) * 0.88, 2.04, 0.69 - Math.cos(open) * 0.88];
  const r = [q.x - p.x, q.z - p.z], s = [b[0] - a[0], b[2] - a[2]];
  const den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-12) return false;
  const w = [a[0] - p.x, a[2] - p.z];
  const t = (w[0] * s[1] - w[1] * s[0]) / den, u = (w[0] * r[1] - w[1] * r[0]) / den;
  if (t <= 1e-4 || t >= 1 - 1e-4 || u < 0 || u > 1) return false;
  const y = p.y + (q.y - p.y) * t;
  return y >= 0 && y <= 2.04;
};
export type Occluder = { root: V3; height: number; who: "uq" | "adik" };
/** what blocks the line from `from` to `to` (the last 3 cm are ignored: the LED sits on its housing), or null */
export const blockedBy = (from: V3, to: V3, chars: Occluder[] = [], kamarDoor = 1.35): string | null => {
  const p = new THREE.Vector3(...from), q0 = new THREE.Vector3(...to);
  const q = p.clone().lerp(q0, 1 - 0.03 / Math.max(0.05, p.distanceTo(q0)));
  for (const b of WALLS) if (segBox(p, q, b)) return b.tag;
  if (segLeaf(p, q, kamarDoor)) return "daun pintu kamar";
  for (const c of chars) {
    const hc = new THREE.Vector3(...stickHeadCenter(c.root, c.height));
    const R = (new THREE.Vector3(...stickHeadTop(c.root, c.height)).y - hc.y) * (c.who === "adik" ? 1.06 : 1) + 0.01;
    const rBody = c.who === "adik" ? 0.15 : 0.19; // torso half-width incl. arms hanging (generous)
    const neckY = hc.y - R;
    for (let i = 0; i <= 200; i++) {
      const x = p.clone().lerp(q, i / 200);
      if (x.distanceTo(hc) < R) return `kepala ${c.who}`;
      if (x.y >= 0 && x.y <= neckY && Math.hypot(x.x - c.root[0], x.z - c.root[2]) < rBody) return `badan ${c.who}`;
    }
  }
  return null;
};
