// Pilot 2026-11-001 screen overlays (HTML over the 3D view): the A/B choice cards with the 3-second timer, a soft
// spotlight on a world point, the burned-in captions with Tyo's quoted words in their own color, and the
// provisional-timing label. world -> screen uses the same perspective camera as core/View.tsx.
import React from "react";
import * as THREE from "three";
import type { Chunk } from "../inkbeat/core/captions";
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};

/** world point -> pixel (x, y) and whether it is in front of the lens */
export const toScreen = (cam: Cam, p: V3, w = 1080, h = 1920) => {
  const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.05, 200);
  c.position.set(...cam.pos);
  const dir = new THREE.Vector3(...cam.look).sub(c.position).normalize();
  c.up.copy(new THREE.Vector3(0, 1, 0).applyAxisAngle(dir, ((cam.roll ?? 0) * Math.PI) / 180));
  c.lookAt(...cam.look);
  c.updateMatrixWorld(true);
  const v = new THREE.Vector3(...p).project(c);
  return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, front: v.z < 1 };
};

const CHOICES = [
  { k: "A", text: "Ajak bicara sekarang" },
  { k: "B", text: "Beri ruang + bilang kamu siap mendengar" },
];
/** the two choices at the top of the frame (faces sit lower); `timer` = [from, to] for the 3-second bar */
export const ChoiceCards: React.FC<{ t: number; inAt: number; outAt: number; timer?: [number, number]; small?: boolean }> = ({ t, inAt, outAt, timer, small }) => {
  if (t < inAt || t > outAt + 0.3) return null;
  const a = sstep((t - inAt) / 0.35) * (1 - sstep((t - outAt) / 0.3));
  const k = small ? 0.72 : 1;
  const top = small ? 120 : 150;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 * k, opacity: a }}>
      {CHOICES.map((c, i) => {
        const slide = (1 - sstep((t - inAt - i * 0.18) / 0.4)) * 60;
        return (
          <div
            key={c.k}
            style={{ display: "flex", alignItems: "center", gap: 20 * k, width: 900 * k, padding: `${18 * k}px ${26 * k}px`, borderRadius: 26 * k, background: "rgba(252,246,234,0.94)", border: `${5 * k}px solid #1b1a2a`, boxShadow: `0 ${10 * k}px ${0}px rgba(27,26,42,0.85)`, transform: `translateX(${(i ? 1 : -1) * slide}px)` }}
          >
            <div style={{ flex: "none", width: 74 * k, height: 74 * k, borderRadius: 37 * k, background: i ? "#3f7fc9" : "#e07a2a", border: `${5 * k}px solid #1b1a2a`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 44 * k, color: "#fffaf0" }}>{c.k}</div>
            <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 46 * k, lineHeight: 1.12, color: "#1b1a2a" }}>{c.text}</div>
          </div>
        );
      })}
      {timer && t >= timer[0] - 0.2 ? (
        <div style={{ width: 900 * k, height: 22, borderRadius: 11, background: "rgba(27,26,42,0.55)", border: "4px solid #1b1a2a", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${100 * (1 - clamp01((t - timer[0]) / (timer[1] - timer[0])))}%`, background: "#ffd08a" }} />
        </div>
      ) : null}
    </div>
  );
};

/** a soft spotlight: the frame dims except a round pool around `at` (screen px) */
export const Spotlight: React.FC<{ x: number; y: number; r: number; amount: number }> = ({ x, y, r, amount }) =>
  amount <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity: amount, background: `radial-gradient(circle at ${x}px ${y}px, rgba(14,8,24,0) ${r}px, rgba(14,8,24,0.55) ${r * 1.9}px)` }} />
  );

/** captions like core/captions.tsx (Poppins 800, 92 px, centered at 70%), plus Tyo's quoted words in light blue */
export const PilotCaptions: React.FC<{ chunks: (Chunk & { quote?: boolean[] })[]; t: number; until: number }> = ({ chunks, t, until }) => {
  const c = chunks.find((x) => t >= x.a && t < x.b);
  if (!c || t > until) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1920 * 0.7 - 70, height: 140, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      {c.words.map((w, i) => (
        <span key={i} style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 92, lineHeight: 1, color: c.quote?.[i] ? "#bfe6ff" : "#ffffff", WebkitTextStroke: "14px #120a10", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>
          {w}
        </span>
      ))}
    </div>
  );
};

/** the provisional-timing tag (top left): this cut has no audio yet */
export const RoughTag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 40, top: 48, fontFamily: "Poppins", fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.85)", WebkitTextStroke: "5px rgba(18,10,16,0.8)", paintOrder: "stroke fill" }}>{text}</div>
);
