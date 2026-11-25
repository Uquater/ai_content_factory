// C1 "Uq": the channel's recurring main character (DECISION-LOG D-018) as a lit 3D toon mesh in the inkbeat pipeline.
// Proportions measured on _media/2026-11-001/work/C1_ref_clean_key.png (figure height H = 1):
//   near-round head 0.257 H wide x 0.235 H tall, thin white neck, navy short-sleeve tee from 0.74 to 0.40 H (narrower
//   than the head), thin black stick arms and legs (~0.009 H thick), small white hands WITH fingers, dot eyes, short
//   thin brows, a small closed smile, no nose / ears / blush. "Uq" in white on the character's OWN LEFT chest (+x),
//   which reads on the viewer's right when C1 faces the camera. Never mirror the character.
// The arm chain is inkbeat's (char/skeleton.ts), so core/ik.ts solveArm / handWorld work with C1_BUILD and C1_HEIGHT.
import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { blinkAt, bodyYawOf } from "../inkbeat/char/Character3D";
import { ANKLE_Y, FACE_SPAN, HEAD_BOT, HEAD_HW, HEAD_TOP, INK_K, TORSO_R } from "../inkbeat/char/family";
import { shoeGeo, smoothSeams, taperTube } from "../inkbeat/char/geometry";
import { Inked } from "../inkbeat/char/Inked";
import { charLook, charMat, faceMat, hullUniforms } from "../inkbeat/char/material";
import type { FaceUniforms } from "../inkbeat/char/material";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { ArmPose } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import { C1_BUILD, C1_HEIGHT, SLEEVE, WRIST_OFF, c1Swivel, c1UpperMatrix } from "./c1rig";
import type { C1Hand } from "./c1rig";
export { C1_BUILD, C1_HEIGHT, SLEEVE, WRIST_OFF, c1UpperMatrix, c1UpperToWorld } from "./c1rig";
export type { C1Hand } from "./c1rig";

// ------------------------------------------------------------------ design numbers

export const C1_COLORS = {
  head: "#f4f4fb",
  navy: "#121a38",
  navyDark: "#0c1228",
  letter: "#fbfbff",
  limb: "#1d1b26",
  ink: "#1b1a2a",
};
/** a character of this channel's stick family (pilot 2026-11-001): C1 is the default; other characters (C2 "Tyo")
 * change only head shape, shirt, hands, hair and mouth width, and share C1's rig (C1_BUILD), so IK and the sleeve
 * code work for all of them. */
export type StickLook = {
  id: string;
  /** head ellipsoid scale against C1's (x = width and depth, y = height; the head grows upward from the chin) */
  head: { sx: number; sy: number };
  /** "tee-uq" = C1's navy tee with "Uq"; "office" = a collared short-sleeve office shirt with a chest pocket;
   * "tee" = a plain crew-neck tee without any letters (supporting characters / NPC presets, 2026-11-16) */
  shirt: { kind: "tee-uq" | "office" | "tee"; color: string; dark: string; cuff: string };
  /** "fingers" = C1's hands (D-018 exception); "mitt" = plain oval hands (STRICT BODY RULE; Tyo, 2026-11-001);
   * "oval" = a larger, filled-reading oval hand for the 2026-11-002 NPC presets (the small mitt read as an ink ring) */
  hands: "fingers" | "mitt" | "oval";
  /** smile width factor and an optional short hair cap */
  face: { smileW: number };
  hair?: { color: string };
  /** D-029 (2026-11-16): bodied limbs instead of black sticks — skin-white arm tubes, pant legs to the ankle and
   * inkbeat shoes. Absent = sticks (C1_LOOK is unchanged and stays pixel-identical). Radii in h = 1 units. */
  limbs?: { pants: string; shoes: string; sole?: string; armR?: [number, number]; legR?: [number, number]; /** "bare" = skin feet, no shoes (in bed, D-031) */ feet?: "shoes" | "bare" };
  /** D-029: multiplier on this character's hull-ink width (thin ink); absent = 1 */
  inkK?: number;
};
export const C1_LOOK: StickLook = { id: "C1", head: { sx: 1, sy: 1 }, shirt: { kind: "tee-uq", color: C1_COLORS.navy, dark: C1_COLORS.navyDark, cuff: "#0e1530" }, hands: "fingers", face: { smileW: 1 } };
/** cool lavender shade on the white head and hands (the inkbeat skin default is warm) */
const COOL_SHADE: [number, number, number] = [1.0, 1.0, 1.0];
// head-local ellipsoid (before headScale): the widest row is the origin, as in inkbeat
const HEAD_RX = 0.167;
const HEAD_TOP_Y = HEAD_TOP * HEAD_HW;
const HEAD_BOT_Y = -HEAD_BOT * HEAD_HW;
const HEAD_RY = (HEAD_TOP_Y - HEAD_BOT_Y) / 2;
const HEAD_CY = (HEAD_TOP_Y + HEAD_BOT_Y) / 2;
const HEAD_RZ = 0.158;
const LIMB_R = 0.0046;
const NECK_R = 0.017;
const D2R = Math.PI / 180;
const UP = new THREE.Vector3(0, 1, 0);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const quatAlong = (d: THREE.Vector3) => new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());

// ------------------------------------------------------------------ geometry (cached)
const headGs = new Map<string, THREE.BufferGeometry>();
/** the head ellipsoid; a look's sy grows it upward from the chin (C1: sx = sy = 1, the original geometry) */
const headGeo = (sx = 1, sy = 1) => {
  const key = `${sx}|${sy}`;
  const hit = headGs.get(key);
  if (hit) return hit;
  const g = new THREE.SphereGeometry(1, 72, 54);
  g.scale(HEAD_RX * sx, HEAD_RY * sy, HEAD_RZ * sx);
  g.translate(0, HEAD_BOT_Y + HEAD_RY * sy, 0);
  g.deleteAttribute("uv");
  const out = smoothSeams(g);
  headGs.set(key, out);
  return out;
};
/** a short hair cap: the top of a slightly larger head shell, tipped back so the fringe sits above the brows */
const hairGs = new Map<string, THREE.BufferGeometry>();
const hairGeo = (sx = 1, sy = 1) => {
  const key = `${sx}|${sy}`;
  const hit = hairGs.get(key);
  if (hit) return hit;
  const g = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.4);
  g.scale(HEAD_RX * sx * 1.035, HEAD_RY * sy * 1.04, HEAD_RZ * sx * 1.045);
  g.rotateX(-0.16);
  g.translate(0, HEAD_BOT_Y + HEAD_RY * sy, -0.004);
  g.deleteAttribute("uv");
  const out = smoothSeams(g);
  hairGs.set(key, out);
  return out;
};
const capsules = new Map<string, THREE.BufferGeometry>();
const capsule = (r: number, len: number) => {
  const k = `${r}|${len}`;
  let g = capsules.get(k);
  if (!g) {
    g = new THREE.CapsuleGeometry(r, len, 6, 12);
    g.translate(0, len / 2 + r, 0); // base at the origin, pointing +y
    capsules.set(k, g);
  }
  return g;
};
/** the tee: a lathe with a flat-ish hem, straight sides, shoulder points and a neck opening (radius = fraction of
 * TORSO_R x torsoWidth); uv.x wraps the angle (front at 0.5), uv.y = height fraction, like inkbeat's torso */
// rev1: the top slopes from the shoulder corner to the neck like the reference (no flat, rounded "barrel" top)
const TEE: [number, number][] = [[0, 0.0], [0.012, 0.74], [0.045, 0.8], [0.3, 0.76], [0.6, 0.78], [0.8, 0.83], [0.885, 0.865], [0.93, 0.8], [0.965, 0.63], [0.99, 0.4], [1, 0.26]];
export const teeRadiusAt = (u: number) => {
  for (let i = 1; i < TEE.length; i++)
    if (u <= TEE[i][0]) {
      const [a, r0] = TEE[i - 1];
      const [b, r1] = TEE[i];
      const k = (1 - Math.cos(((u - a) / (b - a)) * Math.PI)) / 2;
      return r0 + (r1 - r0) * k;
    }
  return TEE[TEE.length - 1][1];
};
let teeG: THREE.BufferGeometry | null = null;
const teeGeo = (H: number, R: number, depth: number) => {
  if (teeG) return teeG;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    pts.push(new THREE.Vector2(Math.max(0.0001, teeRadiusAt(u) * R), u * H));
  }
  const g = new THREE.LatheGeometry(pts, 72, Math.PI, Math.PI * 2);
  const pa = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i);
    const z = pa.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1e-6) continue;
    const ex = 2.6;
    const k = Math.pow(Math.pow(Math.abs(x / r), ex) + Math.pow(Math.abs(z / r), ex), -1 / ex);
    pa.setX(i, x * (1 + (k - 1) * 0.8));
    pa.setZ(i, z * (1 + (k - 1) * 0.8) * 0.72 * depth);
  }
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setY(i, pa.getY(i) / H);
  teeG = smoothSeams(g);
  return teeG;
};
let palmG: THREE.BufferGeometry | null = null;
const palmGeo = () => {
  if (palmG) return palmG;
  const s = new THREE.SphereGeometry(1, 24, 16);
  s.scale(0.0125, 0.0135, 0.0075);
  s.translate(0, 0.008, 0);
  palmG = smoothSeams(s);
  return palmG;
};
/** a plain oval hand without fingers (STRICT BODY RULE, every character but C1) */
let mittG: THREE.BufferGeometry | null = null;
const mittGeo = () => {
  if (mittG) return mittG;
  const s = new THREE.SphereGeometry(1, 24, 16);
  s.scale(0.0135, 0.019, 0.0085);
  s.translate(0, 0.014, 0);
  mittG = smoothSeams(s);
  return mittG;
};
/** the NPC-preset hand (2026-11-16 rev): ~1.8x the mitt, so the screen-space ink line no longer eats the white fill.
 * Its base sits at the wrist. Width 0.046 h ≈ 0.17 of the head width (reference ≈ 0.2). */
let ovalG: THREE.BufferGeometry | null = null;
const ovalHandGeo = () => {
  if (ovalG) return ovalG;
  const s = new THREE.SphereGeometry(1, 28, 18);
  s.scale(0.023, 0.03, 0.013);
  s.translate(0, 0.024, 0);
  ovalG = smoothSeams(s);
  return ovalG;
};
let capG: THREE.CircleGeometry | null = null;
const capGeo = () => (capG ??= new THREE.CircleGeometry(1, 24));

/** a short-sleeve loft: rings swept along a cubic from the armhole (fixed on the torso, start hidden inside it) to the
 * cuff (follows the upper arm), with parallel-transported frames (no twist). The sleeve's top runs on from the shoulder
 * slope in every arm pose, so the sleeve never reads as a separate tube stuck on the side. */
const sleeveLoft = (A: THREE.Vector3, nA: THREE.Vector3, rA: number, C: THREE.Vector3, nC: THREE.Vector3, rC: number, axis?: THREE.Vector3, outward = false, seg = 18, radial = 22) => {
  const k = A.distanceTo(C) * 0.42;
  const P1 = A.clone().addScaledVector(nA, k * (axis ? 0.5 : 1));
  // with `axis` (a point on the upper arm, below the shoulder) the sweep follows the arm instead of swinging back over
  // the top of the shoulder when the arm reaches forward
  const P2 = axis ? axis.clone() : C.clone().addScaledVector(nC, -k);
  const bez = (u: number) => {
    const v = 1 - u;
    return A.clone().multiplyScalar(v * v * v).addScaledVector(P1, 3 * v * v * u).addScaledVector(P2, 3 * v * u * u).addScaledVector(C, u * u * u);
  };
  const pos: number[] = [];
  const idx: number[] = [];
  let T = nA.clone().normalize();
  let N = new THREE.Vector3(0, 1, 0).addScaledVector(T, -T.y).normalize();
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    const c = bez(u);
    const Tn = bez(Math.min(1, u + 0.01)).sub(bez(Math.max(0, u - 0.01))).normalize();
    // parallel transport: rotate the previous normal by the turn from T to Tn
    N.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(T, Tn));
    N.addScaledVector(Tn, -N.dot(Tn)).normalize();
    T = Tn;
    const B = new THREE.Vector3().crossVectors(T, N);
    const sm = u * u * (3 - 2 * u);
    const r = rA + (rC - rA) * sm + Math.sin(u * Math.PI) * 0.002;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      pos.push(c.x + r * (Math.cos(a) * N.x + Math.sin(a) * B.x), c.y + r * (Math.cos(a) * N.y + Math.sin(a) * B.y), c.z + r * (Math.cos(a) * N.z + Math.sin(a) * B.z));
    }
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = (i + 1) * (radial + 1) + j;
      // C1 (approved, D-021) keeps the winding it was approved with; other looks use outward-facing triangles
      if (outward) idx.push(a, a + 1, b, b, a + 1, b + 1);
      else idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return smoothSeams(g);
};


// ------------------------------------------------------------------ textures
/** mouth "forced" = a wide smile with tight corners (Tyo's "aku baik-baik aja"); "soft" = a small, genuine smile */
export type C1Face = { eyes?: "open" | "closed" | "down"; mouth?: "smile" | "flat" | "frown" | "open" | "forced" | "soft"; brows?: "neutral" | "worried" | "raised" | "lowered"; look?: number; /** continuous downward gaze 0..1 (rev1) */ lookY?: number };
const FS = 1024;
const FK = FS / (2 * FACE_SPAN * HEAD_HW); // canvas px per head-local unit
const fx = (x: number) => FS / 2 + x * FK;
const fy = (y: number) => FS / 2 - y * FK;
const faceCache = new Map<string, THREE.CanvasTexture>();
const faceTex = (f0: C1Face, blink: boolean, smileW = 1) => {
  // continuous gaze values are quantized so the texture cache still hits (0.05 = 0.0004 head units: invisible)
  const q = (v?: number) => (v === undefined ? undefined : Math.round(v * 20) / 20);
  const f: C1Face = { ...f0, look: q(f0.look), lookY: q(f0.lookY) };
  const key = JSON.stringify(smileW === 1 ? [f, blink] : [f, blink, smileW]);
  const hit = faceCache.get(key);
  if (hit) return hit;
  const cv = document.createElement("canvas");
  cv.width = cv.height = FS;
  const g = cv.getContext("2d")!;
  g.strokeStyle = g.fillStyle = C1_COLORS.ink;
  g.lineCap = "round";
  const eyeY = 0.0;
  const eyeX = 0.053;
  const lookX = (f.look ?? 0) * 0.008;
  for (const s of [-1, 1]) {
    const cx = fx(s * eyeX + lookX);
    const eyes = blink ? "closed" : f.eyes ?? "open";
    if (eyes === "closed") {
      g.lineWidth = 9;
      g.beginPath();
      g.moveTo(cx - 20, fy(eyeY));
      g.quadraticCurveTo(cx, fy(eyeY) + 9, cx + 20, fy(eyeY));
      g.stroke();
    } else {
      g.beginPath();
      g.ellipse(cx, fy(eyes === "down" ? eyeY - 0.006 : eyeY - (f.lookY ?? 0) * 0.006), 25, 32, 0, 0, Math.PI * 2);
      g.fill();
    }
    // short thin brows; the outer end slightly lower
    const by = fy(0.031);
    // worried: the inner ends lift (the earlier -14 drew them down, which reads as angry; not used by the demos)
    // lowered (Ep 5 stare, 2026-11-24): the whole brow sits a little lower and nearly level (inner end a hair lower):
    // sharp and calm, not the angry -14 of the early demo
    const tilt = f.brows === "worried" ? 13 : f.brows === "raised" ? 6 : f.brows === "lowered" ? -2 : 3;
    const lift = f.brows === "raised" ? -16 : f.brows === "lowered" ? 8 : 0;
    g.lineWidth = 15;
    g.beginPath();
    g.moveTo(fx(s * 0.04), by + lift - tilt * 0.5);
    g.quadraticCurveTo(fx(s * 0.058), by + lift - 8, fx(s * 0.075), by + lift + tilt);
    g.stroke();
  }
  const my = fy(-0.058);
  g.lineWidth = 14;
  g.beginPath();
  const m = f.mouth ?? "smile";
  const sw = smileW;
  if (m === "smile") {
    g.moveTo(fx(-0.03 * sw), my - 4);
    g.quadraticCurveTo(fx(0), my + 20, fx(0.03 * sw), my - 6);
    g.stroke();
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(fx(-0.006), my + 26);
    g.lineTo(fx(0.007), my + 26);
    g.stroke();
  } else if (m === "forced") {
    // wide and straight across, the corners pulled up hard: a smile that is held, not felt
    g.moveTo(fx(-0.036 * sw), my - 9);
    g.quadraticCurveTo(fx(-0.03 * sw), my + 6, fx(0), my + 7);
    g.quadraticCurveTo(fx(0.03 * sw), my + 6, fx(0.036 * sw), my - 9);
    g.stroke();
  } else if (m === "soft") {
    g.moveTo(fx(-0.02 * sw), my);
    g.quadraticCurveTo(fx(0), my + 12, fx(0.02 * sw), my - 1);
    g.stroke();
  } else if (m === "frown") {
    g.moveTo(fx(-0.026), my + 10);
    g.quadraticCurveTo(fx(0), my - 8, fx(0.026), my + 10);
    g.stroke();
  } else if (m === "open") {
    g.ellipse(fx(0), my + 6, 26, 18, 0, 0, Math.PI * 2);
    g.fill();
  } else {
    g.moveTo(fx(-0.024), my + 4);
    g.lineTo(fx(0.024), my + 4);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (faceCache.size > 64) faceCache.clear();
  faceCache.set(key, tex);
  return tex;
};

let shirtT: THREE.CanvasTexture | null = null;
/** the tee: navy fabric, crew neck, hem, and the white hand-lettered "Uq" on the character's own left chest.
 * The torso canvas wraps the lathe: x = angle (front at 512, the character's +x / own left toward larger x),
 * y = height (top row = torso top). Letters are drawn in torso units with an anisotropic scale so they come out
 * undistorted on the surface, and in the normal left-to-right direction (not mirrored). */
const shirtTex = () => {
  if (shirtT) return shirtT;
  const S = 1024;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d")!;
  g.fillStyle = C1_COLORS.navy;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 18; i++) {
    const x = (Math.sin(i * 12.9) * 0.5 + 0.5) * S;
    const y = (Math.sin(i * 7.3 + 1) * 0.5 + 0.5) * S;
    const rg = g.createRadialGradient(x, y, 0, x, y, 120 + 90 * (Math.sin(i * 3.1) * 0.5 + 0.5));
    rg.addColorStop(0, i % 2 ? "rgba(10,14,32,0.06)" : "rgba(220,228,255,0.05)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, S, S);
  }
  // crew neck rib and hem band
  g.fillStyle = C1_COLORS.navyDark;
  g.fillRect(0, 0, S, S * 0.045);
  g.fillRect(0, S * 0.94, S, S * 0.06);
  g.strokeStyle = "rgba(160,175,220,0.25)";
  g.lineWidth = 3;
  g.setLineDash([10, 9]);
  for (const y of [S * 0.06, S * 0.925]) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(S, y);
    g.stroke();
  }
  g.setLineDash([]);
  // "Uq": center at x/r ~ 0.42 on the +x side (u = 0.5 + asin(0.42) / 2pi) and 66% of the torso height
  const torsoH = 0.29 * (C1_BUILD.torsoHeight ?? 1);
  const rx = TORSO_R * (C1_BUILD.torsoWidth ?? 1) * teeRadiusAt(0.66);
  const perim = 2 * Math.PI * Math.sqrt((rx * rx + (rx * 0.72 * (C1_BUILD.torsoDepth ?? 1)) ** 2) / 2);
  g.save();
  g.translate(S * (0.5 + Math.asin(0.42) / (2 * Math.PI)), S * (1 - 0.66));
  g.scale(S / perim, S / torsoH);
  g.strokeStyle = C1_COLORS.letter;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = 0.0055;
  // U with a small lead-in flick at the top left
  g.beginPath();
  g.moveTo(-0.031, -0.019);
  g.quadraticCurveTo(-0.027, -0.022, -0.026, -0.016);
  g.lineTo(-0.026, 0.004);
  g.quadraticCurveTo(-0.026, 0.017, -0.015, 0.017);
  g.quadraticCurveTo(-0.004, 0.017, -0.004, 0.004);
  g.lineTo(-0.004, -0.018);
  g.stroke();
  // q: bowl, stem and a small hooked descender
  g.beginPath();
  g.ellipse(0.0115, 0.0055, 0.0085, 0.0105, 0, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.moveTo(0.0205, -0.004);
  g.lineTo(0.0205, 0.032);
  g.quadraticCurveTo(0.0205, 0.038, 0.0145, 0.035);
  g.stroke();
  g.restore();
  shirtT = new THREE.CanvasTexture(cv);
  shirtT.colorSpace = THREE.SRGBColorSpace;
  shirtT.anisotropy = 8;
  return shirtT;
};

/** the shirt-canvas transform for drawing in torso units (h = 1) around a point at angle sin = xr on the +x side and
 * height fraction v, undistorted on the lathe (the same mapping as "Uq") */
const torsoFrame = (g: CanvasRenderingContext2D, S: number, xr: number, v: number) => {
  const torsoH = 0.29 * (C1_BUILD.torsoHeight ?? 1);
  const rx = TORSO_R * (C1_BUILD.torsoWidth ?? 1) * teeRadiusAt(v);
  const perim = 2 * Math.PI * Math.sqrt((rx * rx + (rx * 0.72 * (C1_BUILD.torsoDepth ?? 1)) ** 2) / 2);
  g.translate(S * (0.5 + Math.asin(xr) / (2 * Math.PI)), S * (1 - v));
  g.scale(S / perim, S / torsoH);
};
/** where the chest pocket of the office shirt sits (angle sin on the +x side, height fraction): the wearer's left */
export const POCKET = { xr: 0.42, v: 0.64, w: 0.036, h: 0.04 };
const officeTs = new Map<string, THREE.CanvasTexture>();
/** an office shirt: fabric, a collar notch with a button placket down the front, a chest pocket on the wearer's left,
 * a hem band (pilot 2026-11-001, C2 "Tyo") */
const officeTex = (look: StickLook) => {
  const hit = officeTs.get(look.id);
  if (hit) return hit;
  const S = 1024;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d")!;
  g.fillStyle = look.shirt.color;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 18; i++) {
    const x = (Math.sin(i * 12.9) * 0.5 + 0.5) * S;
    const y = (Math.sin(i * 7.3 + 1) * 0.5 + 0.5) * S;
    const rg = g.createRadialGradient(x, y, 0, x, y, 120 + 90 * (Math.sin(i * 3.1) * 0.5 + 0.5));
    rg.addColorStop(0, i % 2 ? "rgba(20,40,70,0.05)" : "rgba(255,255,255,0.06)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, S, S);
  }
  g.fillStyle = look.shirt.dark;
  g.fillRect(0, S * 0.94, S, S * 0.06);
  // collar: a band around the neck and an open V at the front
  g.fillRect(0, 0, S, S * 0.05);
  g.save();
  torsoFrame(g, S, 0, 0.985);
  g.fillStyle = look.shirt.dark;
  g.beginPath();
  g.moveTo(-0.026, 0);
  g.lineTo(0, 0.034);
  g.lineTo(0.026, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = look.shirt.dark;
  g.lineCap = "round";
  g.lineWidth = 0.0022;
  // placket edge and buttons
  g.beginPath();
  g.moveTo(0.004, 0.034);
  g.lineTo(0.004, 0.3);
  g.stroke();
  g.fillStyle = "#f4f6f8";
  for (let k = 0; k < 5; k++) {
    g.beginPath();
    g.arc(-0.003, 0.05 + k * 0.052, 0.0032, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  // chest pocket (its front flap is also a 3D patch, so a card can slide in behind it)
  g.save();
  torsoFrame(g, S, POCKET.xr, POCKET.v);
  g.strokeStyle = look.shirt.dark;
  g.lineWidth = 0.002;
  g.strokeRect(-POCKET.w / 2, -POCKET.h / 2, POCKET.w, POCKET.h);
  g.restore();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  officeTs.set(look.id, tex);
  return tex;
};
const plainTs = new Map<string, THREE.CanvasTexture>();
/** a plain crew-neck tee (no letters): fabric, a darker neck rib and hem band. Cached by colour, not by look id, so a
 * preset reused with another colour never gets a stale texture (2026-11-16, NPC presets) */
const plainTeeTex = (look: StickLook) => {
  const key = `${look.shirt.color}|${look.shirt.dark}`;
  const hit = plainTs.get(key);
  if (hit) return hit;
  const S = 1024;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d")!;
  g.fillStyle = look.shirt.color;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 18; i++) {
    const x = (Math.sin(i * 12.9) * 0.5 + 0.5) * S;
    const y = (Math.sin(i * 7.3 + 1) * 0.5 + 0.5) * S;
    const rg = g.createRadialGradient(x, y, 0, x, y, 120 + 90 * (Math.sin(i * 3.1) * 0.5 + 0.5));
    rg.addColorStop(0, i % 2 ? "rgba(40,30,40,0.05)" : "rgba(255,255,255,0.06)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, S, S);
  }
  g.fillStyle = look.shirt.dark;
  g.fillRect(0, 0, S, S * 0.04);
  g.fillRect(0, S * 0.945, S, S * 0.055);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  plainTs.set(key, tex);
  return tex;
};
const shirtTexOf = (look: StickLook) => (look.shirt.kind === "tee-uq" ? shirtTex() : look.shirt.kind === "tee" ? plainTeeTex(look) : officeTex(look));
/** a point on the shirt surface (h = 1, torso-local: y from the torso bottom) at angle sin = xr (+x side) and height
 * fraction v, pushed `out` along the surface normal; and that normal. For props on the chest (lanyard, card, pocket). */
export const teeSurface = (xr: number, v: number, out = 0): { p: THREE.Vector3; n: THREE.Vector3 } => {
  const L0 = layoutOf(C1_BUILD);
  const R = TORSO_R * (C1_BUILD.torsoWidth ?? 1) * teeRadiusAt(v);
  const depth = C1_BUILD.torsoDepth ?? 1;
  const at = (a: number) => {
    const x = Math.sin(a) * R;
    const z = Math.cos(a) * R;
    const ex = 2.6;
    const k = Math.pow(Math.pow(Math.abs(Math.sin(a)), ex) + Math.pow(Math.abs(Math.cos(a)), ex), -1 / ex);
    return new THREE.Vector3(x * (1 + (k - 1) * 0.8), v * L0.torsoH, z * (1 + (k - 1) * 0.8) * 0.72 * depth);
  };
  const a = Math.asin(xr);
  const p = at(a);
  const tang = at(a + 0.01).sub(at(a - 0.01));
  const n = new THREE.Vector3(-tang.z, 0, tang.x).normalize(); // outward
  return { p: p.addScaledVector(n, out), n };
};

// ------------------------------------------------------------------ materials
// the family-wide skin shade is global (charLook); this channel's heads are white with a cool lavender shade
charLook.uSkinShade.value.setRGB(...COOL_SHADE);
const coolSkin = (m: THREE.Material) => m;
let handMatC: THREE.Material | null = null;
const handMat = () => {
  if (handMatC) return handMatC;
  const m = faceMat(C1_COLORS.head, 1, 1);
  const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
  blank.needsUpdate = true;
  (m.userData.u as FaceUniforms).uFaceMap.value = blank;
  handMatC = coolSkin(m);
  return handMatC;
};

// ------------------------------------------------------------------ helpers for scenes
const L = layoutOf(C1_BUILD);
/** the root (soles) position that seats C1 with the shirt hem on a seat top at `seat` (world) */
export const c1SeatedRoot = (seat: V3, height = C1_HEIGHT): V3 => [seat[0], seat[1] - (L.torsoY0 + 0.012) * height, seat[2]];
/** body proportions for a look (2026-11-16, toddler preset): legK shortens the legs (the upper body drops by the
 * difference), armK shortens the arms. 1 = C1's proportions (the default; no effect). */
export type StickProportions = { legK?: number; armK?: number };
/** the hip height (h = 1) and the upper body's drop for given proportions */
export const stickHip = (pr?: StickProportions) => {
  const k = pr?.legK ?? 1;
  const hipY = k === 1 ? L.hipY : 0.012 + (L.hipY - 0.012) * k;
  return { hipY, dy: hipY - L.hipY };
};
/** like c1SeatedRoot, for a look with proportions (shorter legs lower the hem) */
export const stickSeatedRoot = (seat: V3, height: number, pr?: StickProportions): V3 => [seat[0], seat[1] - (L.torsoY0 + stickHip(pr).dy + 0.012) * height, seat[2]];
/** head center in world space (focus, cast light, framing) */
export const c1Head = (root: V3, yaw = 0, height = C1_HEIGHT, look: StickLook = C1_LOOK): V3 => {
  const y = L.chinY + (HEAD_BOT_Y + HEAD_CY + HEAD_BOT * HEAD_HW + (HEAD_RY * (look.head.sy - 1))) * (C1_BUILD.headScale ?? 1);
  void yaw;
  return [root[0], root[1] + y * height, root[2]];
};
/** the true head center in world space (c1Head above sits near the chin; it is kept as is because the demo cameras
 * were framed with it) */
export const stickHeadCenter = (root: V3, height = C1_HEIGHT, look: StickLook = C1_LOOK): V3 => {
  const y = L.chinY + (HEAD_RY * look.head.sy) * (C1_BUILD.headScale ?? 1);
  return [root[0], root[1] + y * height, root[2]];
};
/** the top of the head in world space (a seated, upright character; for the number above the head) */
export const stickHeadTop = (root: V3, height = C1_HEIGHT, look: StickLook = C1_LOOK): V3 => {
  const y = L.chinY + (HEAD_BOT_Y + 2 * HEAD_RY * look.head.sy + HEAD_BOT * HEAD_HW) * (C1_BUILD.headScale ?? 1);
  return [root[0], root[1] + y * height, root[2]];
};

// ------------------------------------------------------------------ the character
export type C1Props = {
  position: V3;
  yaw?: number;
  height?: number;
  /** seated: the legs bend at the knee and the feet go to this floor height (world y) */
  sitFloor?: number;
  faceCamera?: V3;
  faceCameraAmount?: number;
  threeQuarter?: number;
  /** lean / roll / twist move the upper body about the hips (rev1, c1UpperMatrix); the arm pose is in that frame */
  pose?: ArmPose & { headTilt?: number; headNod?: number; headYaw?: number; roll?: number; twist?: number; shrugL?: number; shrugR?: number; swivelL?: number; swivelR?: number };
  /** wrist override per arm (rev1), in the upper-body frame: finger direction, palm normal, finger curl (deg), blend 0..1 */
  hands?: { L?: C1Hand; R?: C1Hand };
  face?: C1Face;
  t?: number;
  /** which character of the stick family (default C1) */
  look?: StickLook;
  /** props worn on the upper body, in its frame (h = 1; y from the soles): lanyard, ID card, pocket flap */
  chest?: React.ReactNode;
  /** blink seed (characters must not blink in sync) */
  blinkSeed?: number;
  /** worn on the head (hair styles of the NPC presets), in the head-local frame of the head mesh (before the build's
   * headScale, which the slot inherits; see STICK_HEAD). 2026-11-16 */
  headWear?: React.ReactNode;
  /** worn on the legs (pants), drawn in the character frame (h = 1, soles at y = 0) from the legs' centre lines.
   * Tested standing only (2026-11-16). */
  legWear?: (legs: StickLeg[]) => React.ReactNode;
  /** body proportions (toddler): shorter legs / arms. Default = C1's. 2026-11-16 */
  proportions?: StickProportions;
  /** explicit leg pose (walk cycles, 2026-11-16): per leg the ankle in the character frame (h = 1, soles at y = 0,
   * facing +z) and optionally the knee; without a knee the leg bends forward by two-bone IK. "L" = the character's
   * own right (-x), as for the arms. Overrides the standing / seated legs for that side. */
  legPose?: { L?: StickFoot; R?: StickFoot };
};
export type StickFoot = { ankle: V3; knee?: V3 };
/** one leg's centre line (character frame, h = 1): hip → ankle; s = -1 the character's right, +1 its left */
export type StickLeg = { pts: THREE.Vector3[]; ankle: THREE.Vector3; s: 1 | -1 };
/** head ellipsoid numbers in the head-local frame (for head wear): radii, chin y, the head's centre y for a look */
export const STICK_HEAD = { RX: HEAD_RX, RY: HEAD_RY, RZ: HEAD_RZ, BOT_Y: HEAD_BOT_Y, centerY: (sy = 1) => HEAD_BOT_Y + HEAD_RY * sy };
/** the ink width unit the character uses (multiply by ~0.4–1.0 per part) */
export const STICK_INK_W = INK_K * HEAD_HW * 2;

export const C1: React.FC<C1Props> = (p) => {
  const look = p.look ?? C1_LOOK;
  const height = p.height ?? C1_HEIGHT;
  // rest pose: the arms hang slightly out from the sleeves, like the reference
  const pose = { armL: [14, -8] as [number, number], armR: [14, -8] as [number, number], ...(p.pose ?? {}) };
  const hs = C1_BUILD.headScale ?? 1;
  const size = useThree((s) => s.size);
  hullUniforms.uViewH.value = size.height || 1920;
  const W = INK_K * HEAD_HW * 2 * (look.inkK ?? 1);
  const bod = look.limbs;

  const yaw = bodyYawOf(p.position, p.yaw ?? 0, p.faceCamera, p.faceCameraAmount);
  let headYaw = (pose.headYaw ?? 0) * D2R;
  if (p.faceCamera) {
    const target = Math.atan2(p.faceCamera[0] - p.position[0], p.faceCamera[2] - p.position[2]);
    const rest = wrap(target - yaw);
    const tq = (p.threeQuarter ?? 22) * D2R;
    headYaw += Math.max(-50 * D2R, Math.min(50 * D2R, rest - (rest >= 0 ? 1 : -1) * tq));
  }
  const t = p.t;
  const breath = t === undefined ? 0 : Math.sin(t * 1.7);
  const blink = t !== undefined && blinkAt(t, p.blinkSeed ?? 5);

  const headMat = useMemo(() => coolSkin(faceMat(C1_COLORS.head, 1 / (2 * FACE_SPAN * HEAD_HW), FACE_SPAN)), []);
  useEffect(() => () => headMat.dispose(), [headMat]);
  (headMat.userData.u as FaceUniforms).uFaceMap.value = faceTex(p.face ?? {}, blink, look.face.smileW);
  const torsoMat = charMat("#ffffff", { spec: 0.22, map: shirtTexOf(look) });
  const navyMat = charMat(look.shirt.color, { spec: 0.18 });
  // rev1: the cuff opening is shaded navy, not near-black, so it never reads as a hole
  const cuffMat = charMat(look.shirt.cuff, { spec: 0.02 });
  const hairMat = look.hair ? charMat(look.hair.color, { spec: 0.12 }) : null;
  const limbMat = charMat(C1_COLORS.limb, { spec: 0.15 });
  const pantsMat = bod ? charMat(bod.pants, { spec: 0.1 }) : limbMat;
  const shoeMat = bod ? charMat(bod.shoes, { spec: 0.3 }) : limbMat;
  const soleMat = bod ? charMat(bod.sole ?? "#d8d2c8", { spec: 0.1 }) : limbMat;
  const shoes = bod ? shoeGeo() : null;
  const hand = handMat();

  const floorLocal = p.sitFloor === undefined ? 0 : (p.sitFloor - p.position[1]) / height;
  const legK = p.proportions?.legK ?? 1;
  const armK = p.proportions?.armK ?? 1;
  const { hipY, dy } = stickHip(p.proportions);
  const LA = armK === 1 ? L : layoutOf({ ...C1_BUILD, armLength: (C1_BUILD.armLength ?? 1) * armK });
  const key = JSON.stringify([look.id, pose.armL, pose.armR, pose.armLFwd, pose.armRFwd, pose.shrugL, pose.shrugR, pose.swivelL, pose.swivelR, floorLocal.toFixed(4), legK, armK, p.legPose ? JSON.stringify(p.legPose, (_k, v) => (typeof v === "number" ? Math.round(v * 1e5) / 1e5 : v)) : 0]);
  const parts = useMemo(() => {
    const arm = (side: "L" | "R") => {
      const s = side === "L" ? -1 : 1;
      const ch = armChain(pose, side, LA);
      const { S, H } = ch;
      // rev1: the reaching shoulder lifts a little (shrug) and the elbow may swivel out (see c1rig.ts)
      const shrug = (side === "L" ? pose.shrugL : pose.shrugR) ?? 0;
      S.y += shrug;
      H.y += shrug;
      const E = c1Swivel(S, ch.E.setY(ch.E.y + shrug), H, s, (side === "L" ? pose.swivelL : pose.swivelR) ?? 0);
      const fore = H.clone().sub(E).normalize();
      // the stick ends at the wrist; the hand group pivots there (WRIST_OFF before the palm center H)
      const wrist = H.clone().addScaledVector(fore, -WRIST_OFF);
// (the stick is built after the sleeve: it starts inside the sleeve, see below)
      // rev1 sleeve: armhole ring fixed on the torso side, cuff ring around the upper arm, a little out from the
      // stick (the stick leaves through the inner part of the opening, like the reference) and flared outward
      const up = E.clone().sub(S).normalize();
      const out = new THREE.Vector3(s, 0, 0).addScaledVector(up, -up.x * s).normalize();
      // the flare belongs to a hanging arm; a raised arm pulls the sleeve into a plain tube around it
      const hang = Math.pow(Math.min(1, Math.max(0, -up.y)), 1.5);
      // with the arm raised the armhole ring sits lower and smaller and leaves sideways, so the sleeve root stays
      // inside the shoulder instead of poking out of its front
      const A = new THREE.Vector3(S.x * SLEEVE.armholeIn, S.y - shrug - SLEEVE.armholeDrop * (2 - hang), S.z);
      const nA = new THREE.Vector3(s, -0.3, 0).normalize().lerp(up, 0.1 * hang).normalize();
      const C = S.clone().addScaledVector(up, SLEEVE.len).addScaledVector(out, SLEEVE.out * hang);
      const nC = up.clone().addScaledVector(out, SLEEVE.flare * hang).normalize();
      // a raised arm also narrows the cuff, so the opening never reads as a wide funnel toward the camera
      const rC = SLEEVE.rC * (0.76 + 0.24 * hang);
      const axis = S.clone().lerp(C, 0.5).add(new THREE.Vector3(0, -0.006, 0)).addScaledVector(nC, -0.004);
      const sleeve = sleeveLoft(A, nA, SLEEVE.rA * (0.8 + 0.2 * hang), C, nC, rC, axis, look.id !== C1_LOOK.id);
      // rev1: the stick starts halfway down the sleeve, on the upper arm's line, so it is always hidden at the
      // shoulder (starting it at the high joint let it poke out over the shoulder with the shrug or bulge as a spline)
      const S0 = S.clone().lerp(E, Math.min(0.5, (SLEEVE.len * 0.5) / Math.max(1e-6, S.distanceTo(E))));
      const stick = bod
        ? taperTube(new THREE.CatmullRomCurve3([S0, E, wrist], false, "centripetal").getPoints(24), bod.armR?.[0] ?? 0.0155, bod.armR?.[1] ?? 0.0115, 30, 16)
        : taperTube(new THREE.CatmullRomCurve3([S0, E, wrist], false, "centripetal").getPoints(24), LIMB_R, LIMB_R * 0.9, 30, 10);
      return { stick, sleeve, cuff: C, cuffN: nC, rC, H, wrist, fore, s };
    };
    const leg = (s: 1 | -1) => {
      const hx = s * TORSO_R * (C1_BUILD.torsoWidth ?? 1) * 0.42;
      const hip = new THREE.Vector3(hx, hipY, 0);
      let pts: THREE.Vector3[];
      let ankle: THREE.Vector3;
      const lp = p.legPose?.[s < 0 ? "L" : "R"];
      if (lp) {
        ankle = new THREE.Vector3(...lp.ankle);
        let knee: THREE.Vector3;
        if (lp.knee) knee = new THREE.Vector3(...lp.knee);
        else {
          // two-bone IK, bending forward (+z): thigh = shin = half the standing hip-ankle length (+0.3 %: straight when standing)
          const seg = ((hipY - 0.012) / 2) * 1.003;
          const d = ankle.clone().sub(hip);
          const dl = d.length();
          const mid = hip.clone().lerp(ankle, 0.5);
          const fwd = new THREE.Vector3(0, 0, 1).addScaledVector(d, -d.z / Math.max(1e-9, dl * dl)).normalize();
          knee = mid.addScaledVector(fwd, Math.sqrt(Math.max(0, seg * seg - (dl / 2) * (dl / 2))));
        }
        pts = [hip, hip.clone().lerp(knee, 0.55), knee, knee.clone().lerp(ankle, 0.5), ankle];
      } else if (p.sitFloor === undefined) {
        ankle = new THREE.Vector3(s * 0.05, 0.012, 0.004);
        pts = [hip, new THREE.Vector3((hx + ankle.x) / 2, (hipY + ankle.y) / 2, 0.006), ankle];
      } else {
        const knee = new THREE.Vector3(hx * 1.15, hipY - 0.01, legK === 1 ? 0.17 : 0.17 * legK);
        ankle = new THREE.Vector3(s * 0.055, floorLocal + 0.012, legK === 1 ? 0.19 : 0.19 * legK);
        pts = [hip, hip.clone().lerp(knee, 0.6).setY(hipY - 0.004), knee, knee.clone().lerp(ankle, 0.5).setZ(legK === 1 ? 0.185 : 0.185 * legK), ankle];
      }
      const geo = bod
        ? taperTube(new THREE.CatmullRomCurve3(pts, false, "centripetal").getPoints(28), bod.legR?.[0] ?? 0.027, bod.legR?.[1] ?? 0.021, 30, 16)
        : taperTube(new THREE.CatmullRomCurve3(pts, false, "centripetal").getPoints(28), LIMB_R * 1.05, LIMB_R, 30, 10);
      return { geo, ankle, s, pts };
    };
    return { aL: arm("L"), aR: arm("R"), lL: leg(-1), lR: leg(1) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => () => [parts.aL.stick, parts.aL.sleeve, parts.aR.stick, parts.aR.sleeve, parts.lL.geo, parts.lR.geo].forEach((g) => g.dispose()), [parts]);
  /** hand orientation: along the forearm, or blended toward an explicit wrist pose (rev1) */
  const handQuat = (a: { fore: THREE.Vector3; s: number }, o?: C1Hand) => {
    const q0 = quatAlong(a.fore);
    if (!o || (o.w ?? 1) <= 0) return q0;
    // hand frame: +y = fingers, -z = palm (the fingers curl toward -z), so the thumb (+x for the "L" chain, the
    // character's right hand) lands on the correct side for a right hand
    const y = new THREE.Vector3(...o.dir).normalize();
    const z = new THREE.Vector3(...o.palm).negate();
    z.addScaledVector(y, -z.dot(y)).normalize();
    const x = new THREE.Vector3().crossVectors(y, z);
    const q1 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    return q0.slerp(q1, Math.min(1, o.w ?? 1));
  };
  const upPos = new THREE.Vector3();
  const upQuat = new THREE.Quaternion();
  c1UpperMatrix(pose).decompose(upPos, upQuat, new THREE.Vector3());

  const neck = useMemo(() => {
    const g = new THREE.CylinderGeometry(NECK_R, NECK_R * 1.08, L.chinY + 0.03 - (L.torsoTop - 0.05), 20, 1, true);
    g.translate(0, (L.chinY + 0.03 + L.torsoTop - 0.05) / 2, 0);
    return g;
  }, []);
  const fingerSpread = [-0.009, -0.003, 0.003, 0.009];

  return (
    <group position={p.position} rotation={[0, yaw, 0]} scale={height}>
      <C1Contact w={0.3} y={floorLocal} />
      {[parts.lL, parts.lR].map((g) => (
        <group key={g.s}>
          {bod && shoes ? (
            <>
              <Inked geo={g.geo} mat={pantsMat} ink={W * 0.45} under={0.3} cast />
              {bod.feet === "bare" ? (
                // a bare foot: a short skin capsule pointing forward (+z of the leg frame)
                <Inked geo={capsule(0.016, 0.05)} mat={hand} ink={W * 0.3} under={0.2} position={[g.ankle.x, g.ankle.y - 0.004, g.ankle.z + 0.018]} rotation={[Math.PI / 2, 0, 0]} />
              ) : (
                // inkbeat shoes are built for its ankle height (ANKLE_Y); drop them so the leg end sits inside the shoe
                <group position={[g.ankle.x, g.ankle.y - ANKLE_Y * 0.24, g.ankle.z]}>
                  <Inked geo={shoes.upper} mat={shoeMat} ink={W * 0.45} under={0.3} cast />
                  <Inked geo={shoes.sole} mat={soleMat} ink={W * 0.3} under={0.1} cast />
                </group>
              )}
            </>
          ) : (
            <>
              <Inked geo={g.geo} mat={limbMat} ink={0} cast />
              <Inked geo={capsule(0.0062, 0.026)} mat={limbMat} ink={0} position={[g.ankle.x, g.ankle.y - 0.006, g.ankle.z - 0.006]} rotation={[Math.PI / 2, 0, g.s * 0.35]} />
            </>
          )}
        </group>
      ))}
      {p.legWear ? p.legWear([parts.lL, parts.lR].map((g) => ({ pts: g.pts, ankle: g.ankle, s: g.s as 1 | -1 }))) : null}
      <group position={dy ? upPos.clone().setY(upPos.y + dy) : upPos} quaternion={upQuat}>
        <group position={[0, L.torsoY0, 0]} scale={[1 + breath * 0.004, 1 + breath * 0.007, 1 + breath * 0.006]}>
          <Inked geo={teeGeo(L.torsoH, TORSO_R * (C1_BUILD.torsoWidth ?? 1), C1_BUILD.torsoDepth ?? 1)} mat={torsoMat} ink={W * 0.85} under={0.5} />
        </group>
        <Inked geo={neck} mat={hand} ink={W * 0.4} under={0.2} />
        {p.chest ? <group position={[0, L.torsoY0, 0]}>{p.chest}</group> : null}
        {[parts.aL, parts.aR].map((a) => {
          const o = a.s < 0 ? p.hands?.L : p.hands?.R;
          const curl = ((o?.curl ?? 0) * (o?.w ?? 1)) * D2R;
          return (
            <group key={a.s}>
              <Inked geo={a.sleeve} mat={navyMat} ink={W * 0.6} under={0.4} />
              <mesh geometry={capGeo()} material={cuffMat} position={a.cuff.clone().addScaledVector(a.cuffN, -0.009)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), a.cuffN)} scale={a.rC * 0.98} />
              <Inked geo={a.stick} mat={bod ? hand : limbMat} ink={bod ? W * 0.35 : 0} under={bod ? 0.25 : undefined} />
              <group position={a.wrist} quaternion={handQuat(a, o)}>
                {look.hands === "oval" ? (
                  <group position={[0, WRIST_OFF - 0.012, 0]} rotation={[-curl * 0.5, 0, 0]}>
                    <Inked geo={ovalHandGeo()} mat={hand} ink={W * 0.06} under={0.05} />
                  </group>
                ) : look.hands === "fingers" ? (
                  <group position={[0, WRIST_OFF, 0]}>
                    <Inked geo={palmGeo()} mat={hand} ink={W * 0.12} under={0.1} position={[0, -0.008, 0]} />
                    {fingerSpread.map((x, i) => (
                      <group key={i} position={[x, 0.008, 0]} rotation={[-curl * (0.8 + 0.1 * i), 0, -x * 7]}>
                        <Inked geo={capsule(0.0037, i === 0 || i === 3 ? 0.010 : 0.013)} mat={hand} ink={0} />
                      </group>
                    ))}
                    <Inked geo={capsule(0.004, 0.009)} mat={hand} ink={0} position={[-a.s * 0.011, -0.006, 0.003]} rotation={[0.3 - curl * 0.4, 0, a.s * 0.9]} />
                  </group>
                ) : (
                  <group position={[0, WRIST_OFF - 0.012, 0]} rotation={[-curl * 0.5, 0, 0]}>
                    <Inked geo={mittGeo()} mat={hand} ink={W * 0.14} under={0.1} />
                  </group>
                )}
              </group>
            </group>
          );
        })}
        <group position={[0, L.chinY + breath * 0.0012, 0]} rotation={[0, headYaw, 0]}>
          <group rotation={[(pose.headNod ?? 0) * D2R, 0, -(pose.headTilt ?? 0) * D2R]}>
            <group position={[0, HEAD_BOT * HEAD_HW * hs, 0]} scale={hs}>
              <Inked geo={headGeo(look.head.sx, look.head.sy)} mat={headMat} ink={(W * 1.0) / hs} under={0.7} />
              {hairMat ? <Inked geo={hairGeo(look.head.sx, look.head.sy)} mat={hairMat} ink={(W * 0.9) / hs} under={0.6} /> : null}
              {p.headWear ?? null}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

// soft contact shadow under the feet
let shadowM: THREE.MeshBasicMaterial | null = null;
const C1Contact: React.FC<{ w: number; y: number }> = ({ w, y }) => {
  if (!shadowM) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    const g = cv.getContext("2d")!;
    const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, "rgba(28,34,52,1)");
    rg.addColorStop(0.5, "rgba(28,34,52,0.65)");
    rg.addColorStop(1, "rgba(28,34,52,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    shadowM = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.4, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
  }
  return <mesh geometry={capGeo()} material={shadowM} rotation={[-Math.PI / 2, 0, 0]} position={[0, y + 0.004, 0.1]} scale={[w * 0.5, w * 0.36, 1]} renderOrder={1} />;
};
