// Episode 3 (2026-11-004), D-057: overlays for the full-episode shots.
// PhoneUI004 = the chat with the UNKNOWN number (S06: message L5; S14: L5 above, then L10). Built on Ep 2's PhoneUI2 layout
// (src/ep003/Episode003.tsx, not changed): same phone frame, colours, bubble type. Differences (storyboard S06/S14): NO
// shield icon anywhere (plain grey avatar), header "Nomor tidak dikenal" + a masked number (+62 8•• •••• ••17, not a real
// number), no blurred earlier officer bubble (a new chat). The UI opens directly on the chat (the buzz was shown in the S05
// insert) and the message enters 0.15 s before the narrator starts reading it (Ep 2 rule). Slow push 1.00 → 1.03 so the
// UI never freezes. Text = script v1.0 §2 (L5, L10), verbatim.
// PhoneScreen004 = Ep 2's lit screen plate + faint cold light (copied: not exported there).
import React from "react";
import * as THREE from "three";
import type { V3 } from "../inkbeat/types";
import P55 from "./episode004-plan-d055.json";

const EV = P55.events as unknown as Record<string, number | [number, number]>;
const SH = P55.shots as unknown as Record<string, [number, number, number]>;
const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };

export const L5_TEXT = "Ini petugas keamanan. HP saya diambil. Pesan tadi bukan dari saya.";
export const L10_TEXT = "Mereka bisa lihat semua ruangan. Kecuali satu.";
export const MASKED_NUMBER = "+62 8•• •••• ••17";

const Bubble: React.FC<{ text: string; k: number }> = ({ text, k }) =>
  k > 0 ? (
    <div style={{ alignSelf: "flex-start", maxWidth: 640, padding: "22px 28px", borderRadius: 28, background: "#ffffff", boxShadow: "0 4px 0 rgba(0,0,0,0.12)", opacity: k, transform: `translateY(${(1 - k) * 18}px)`, fontFamily: "Poppins", fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: "#1b1a22" }}>
      {text}
    </div>
  ) : null;
const Typing: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ alignSelf: "flex-start", padding: "26px 30px", borderRadius: 28, background: "#ffffff", display: "flex", gap: 14 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: "#7a7f8c", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((t * 3 - i * 0.35) * Math.PI)) }} />
    ))}
  </div>
);

/** `hold` (D-058, episode assembly): keep drawing on a last frame that falls at or past the plan end (default false = unchanged) */
export const PhoneUI004: React.FC<{ t: number; shot: "S06" | "S14"; hold?: boolean }> = ({ t, shot, hold = false }) => {
  const [a, b] = SH[shot];
  if (t < a || (t >= b && !hold)) return null;
  const fade = 1; // D-057 v2: a hard cut to the UI (v1 faded in from 0: the first frame was empty)
  const push = 1 + 0.03 * sstep((t - a) / (b - a));
  const l5 = (EV.L5 as [number, number])[0], l10 = (EV.L10 as [number, number])[0];
  // S14: the second buzz (54.12 s) shakes the phone ±3 px at 18 Hz for 0.52 s (two buzzes 1.0 s apart, as S05)
  const vib = shot === "S14" ? [EV.vib2 as number, (EV.vib2 as number) + 1.0] : [];
  const shake = vib.some((v) => t >= v && t < v + 0.52) ? 3 * Math.sin(t * 2 * Math.PI * 18) : 0;
  const k5 = shot === "S06" ? sstep((t - l5 + 0.15) / 0.25) : 1;
  const k10 = shot === "S14" ? sstep((t - l10 + 0.15) / 0.25) : 0;
  const typing = shot === "S06" ? t < l5 - 0.15 : t >= (EV.vib2 as number) + 0.2 && t < l10 - 0.15;
  return (
    <div style={{ position: "absolute", left: 140, top: 150, width: 800, height: 1110, borderRadius: 70, background: "#16151c", border: "12px solid #2a2833", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", opacity: fade, overflow: "hidden", transform: `translateX(${shake.toFixed(2)}px) scale(${push.toFixed(4)})`, transformOrigin: "center" }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: 54, background: "#e9e6df", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 130, background: "#3c4a63", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
          {/* plain avatar: no shield (storyboard S06) */}
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#9aa3b2" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "Poppins", color: "#f3efe6" }}>
            <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.1 }}>Nomor tidak dikenal</div>
            <div style={{ fontWeight: 500, fontSize: 28, lineHeight: 1.1, opacity: 0.8, letterSpacing: 1 }}>{MASKED_NUMBER}</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "40px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
          <Bubble text={L5_TEXT} k={k5} />
          {shot === "S14" ? <Bubble text={L10_TEXT} k={k10} /> : null}
          {typing ? <Typing t={t} /> : null}
        </div>
      </div>
    </div>
  );
};

/** Ep 2's lit phone screen (copied from src/ep003/Episode003.tsx `PhoneScreen`, unchanged values) */
export const PhoneScreen004: React.FC<{ p: V3; q: [number, number, number, number]; glow: number }> = ({ p, q, glow }) => {
  if (glow <= 0.001) return null;
  const c = new THREE.Color("#1c2230").lerp(new THREE.Color("#dfe9ff"), glow);
  const front = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(...q)).multiplyScalar(0.12);
  return (
    <>
      <group position={p} quaternion={new THREE.Quaternion(...q)}>
        <mesh position={[0, 0, -0.0068]}>
          <boxGeometry args={[0.06, 0.128, 0.0006]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[p[0] + front.x, p[1] + front.y + 0.1, p[2] + front.z]} color="#cfe0ff" intensity={0.12 * glow} distance={0.7} decay={2} />
    </>
  );
};
