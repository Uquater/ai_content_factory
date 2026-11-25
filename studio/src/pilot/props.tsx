// Pilot 2026-11-001 props: the number above a head (billboard, "0" -> "1" pop), the small numbers floating in the
// warung air (scene 1), and Tyo's cardboard box from the office (plant, mug, folder) under his chair.
import React from "react";
import * as THREE from "three";
import { boxG, canvasTex, cylG, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";

const digitMats = new Map<string, THREE.MeshBasicMaterial>();
/** a hand-inked digit: white fill, thick dark ink, a soft warm halo (unlit, so the grade can not wash it out) */
const digitMat = (d: string, glow: string) => {
  const key = `${d}|${glow}`;
  let m = digitMats.get(key);
  if (!m) {
    const tex = canvasTex(`digit-${key}`, 256, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      const rg = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
      rg.addColorStop(0, glow);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = rg;
      g.fillRect(0, 0, w, h);
      g.font = "800 190px Poppins";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.lineJoin = "round";
      g.lineWidth = 26;
      g.strokeStyle = "#1b1a2a";
      g.strokeText(d, w / 2, h / 2 + 12);
      g.fillStyle = "#fffaf0";
      g.fillText(d, w / 2, h / 2 + 12);
    });
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false });
    digitMats.set(key, m);
  }
  return m;
};
/** rotation that turns a plane at `p` to face the camera at `cam` (upright) */
const facing = (p: V3, cam: V3) => {
  const m = new THREE.Matrix4().lookAt(new THREE.Vector3(...cam), new THREE.Vector3(...p), new THREE.Vector3(0, 1, 0));
  return new THREE.Quaternion().setFromRotationMatrix(m);
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** overshoot pop: 0 -> 1.18 -> 1 */
const pop = (u: number) => {
  const x = clamp01(u);
  return 1 + 0.18 * Math.sin(Math.PI * x) * (1 - x) * 2.2 - (1 - x) * (1 - x) * 0.6 * (x < 1 ? 1 : 0);
};

/** the number over a head: fades in at `inAt`, changes 0 -> 1 at `popAt` with a pop and a ring burst */
export const HeadNumber: React.FC<{ at: V3; cam: V3; t: number; inAt: number; popAt: number; size?: number }> = ({ at, cam, t, inAt, popAt, size = 0.14 }) => {
  if (t < inAt) return null;
  const fade = clamp01((t - inAt) / 0.35);
  const after = t >= popAt;
  const k = after ? pop((t - popAt) / 0.45) : 0.6 + 0.4 * clamp01((t - inAt) / 0.3);
  const bob = Math.sin(t * 1.6) * 0.006;
  const p: V3 = [at[0], at[1] + bob, at[2]];
  const q = facing(p, cam);
  const m = digitMat(after ? "1" : "0", after ? "rgba(255,170,90,0.55)" : "rgba(255,226,160,0.4)");
  m.opacity = fade;
  const ring = after ? clamp01((t - popAt) / 0.5) : 1;
  return (
    <group position={p} quaternion={q} renderOrder={20}>
      <mesh material={m} scale={size * k} renderOrder={20}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      {after && ring < 1 ? (
        <mesh scale={size * (0.5 + ring * 0.9)} renderOrder={19}>
          <ringGeometry args={[0.42, 0.47, 48]} />
          <meshBasicMaterial color="#ffd08a" transparent opacity={(1 - ring) * 0.85} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};

const h1 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** scene 1: small glowing numbers drifting up through the warung air, each fading in and out in turn */
export const FloatingNumbers: React.FC<{ cam: V3; t: number; from: number; to: number; n?: number }> = ({ cam, t, from, to, n = 20 }) => {
  if (t < from || t > to + 0.6) return null;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const x = -1.2 + h1(i) * 2.8;
        const z = -1.2 + h1(i + 40) * 2.0;
        const y0 = 1.0 + h1(i + 80) * 1.0;
        const born = from + h1(i + 120) * (to - from) * 0.55;
        const life = 1.6 + h1(i + 160) * 1.4;
        const u = (t - born) / life;
        if (u < 0 || u > 1) return null;
        const a = Math.sin(Math.PI * u) * clamp01((to + 0.6 - t) / 0.6);
        const p: V3 = [x + Math.sin(t * 0.7 + i) * 0.04, y0 + u * 0.22, z];
        const m = digitMat(String(Math.floor(h1(i + 200) * 10)), "rgba(255,214,150,0.45)");
        const mm = m.clone();
        mm.opacity = a * 0.9;
        return (
          <mesh key={i} position={p} quaternion={facing(p, cam)} material={mm} scale={0.22 + h1(i + 240) * 0.14} renderOrder={18}>
            <planeGeometry args={[1, 1]} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Tyo's box from the office: cardboard with open flaps, a small potted plant, a mug and a blue folder sticking out */
export const OfficeBox: React.FC<{ p: V3; yaw?: number }> = ({ p, yaw = 0 }) => {
  const W = 0.3;
  const D = 0.26;
  const H = 0.17;
  const c = "#c79a62";
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <M g={boxG(W, 0.01, D)} c="#b88a54" tex="paper" p={[0, 0.005, 0]} />
      <M g={boxG(W, H, 0.008)} c={c} tex="paper" p={[0, H / 2, D / 2]} />
      <M g={boxG(W, H, 0.008)} c={c} tex="paper" p={[0, H / 2, -D / 2]} />
      <M g={boxG(0.008, H, D)} c={c} tex="paper" p={[W / 2, H / 2, 0]} />
      <M g={boxG(0.008, H, D)} c={c} tex="paper" p={[-W / 2, H / 2, 0]} />
      {/* open flaps */}
      <M g={boxG(W, 0.008, 0.11)} c="#d3a870" tex="paper" p={[0, H + 0.035, D / 2 + 0.035]} r={[1.0, 0, 0]} />
      <M g={boxG(0.1, 0.008, D)} c="#d3a870" tex="paper" p={[-W / 2 - 0.035, H + 0.03, 0]} r={[0, 0, -1.1]} />
      <M g={boxG(0.07, 0.012, 0.01)} c="#8a6a44" p={[0, H - 0.01, D / 2 + 0.005]} />
      {/* contents: plant, mug, folder */}
      <group position={[-0.07, 0.02, -0.02]}>
        <M g={cylG(0.045, 0.036, 0.09, 14)} c="#c0573a" tex="stone" p={[0, 0.1, 0]} />
        {[[0, 0.2, 0], [0.035, 0.24, 0.01], [-0.035, 0.23, -0.01], [0.005, 0.28, 0]].map(([x, y, z], i) => (
          <M key={i} g={sphG(0.045 - i * 0.006, 12)} c={i % 2 ? "#4f8f4a" : "#62a852"} p={[x, y, z]} />
        ))}
      </group>
      <group position={[0.08, 0.02, 0.05]}>
        <M g={cylG(0.035, 0.035, 0.085, 16)} c="#f1ece2" p={[0, 0.14, 0]} />
        <M g={torG(0.022, 0.006)} c="#f1ece2" p={[0.038, 0.14, 0]} />
        <M g={cylG(0.03, 0.03, 0.004, 16)} c="#3a2a22" p={[0, 0.18, 0]} />
      </group>
      <M g={boxG(0.2, 0.26, 0.012)} c="#3f6fb0" tex="paper" p={[0.05, 0.19, -0.08]} r={[-0.18, 0.1, 0.12]} />
      <M g={boxG(0.18, 0.24, 0.006)} c="#f2ead6" tex="paper" p={[0.05, 0.18, -0.066]} r={[-0.18, 0.1, 0.12]} />
    </group>
  );
};
