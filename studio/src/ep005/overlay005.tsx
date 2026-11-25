// Episode 4 (2026-11-005) overlays for the full episode (owner 2026-11-23).
// PhoneUI005 = the SAME chat with the unknown number as Ep 3 ("Nomornya sama"): layout, colours, header, masked number and
// bubble copied from src/ep004/overlay004.tsx PhoneUI004 (not changed; its texts are hard-coded there). S09: Ep 3's last
// message (L10) above, the new message L6 enters 0.15 s before the narrator reads it; S14: L6 above, typing after the second
// buzz, then L8. Hard cut to the UI, slow push 1.00 → 1.03, shake ±3 px at 18 Hz during the buzz (as Ep 3). Texts = script
// v1.0 §2.1 verbatim.
// DayLabel4 = Ep 3's "HARI 1 / EPISODE 3" label (Episode004.tsx DayLabel3, copied) with "EPISODE 4" (script V1), 0.25–4.9 s.
import React from "react";
import { L10_TEXT, MASKED_NUMBER } from "../ep004/overlay004";

const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };
export const L6_TEXT = "Ruangan itu kamar mandi, lewat dapur. Tidak ada kamera di sana.";
export const L8_TEXT = "Saya punya kunci ruang toa. Saya tunggu di pintu belakang.";

const Bubble: React.FC<{ text: string; k: number; old?: boolean }> = ({ text, k, old }) =>
  k > 0 ? (
    <div style={{ alignSelf: "flex-start", maxWidth: 640, padding: "22px 28px", borderRadius: 28, background: "#ffffff", boxShadow: "0 4px 0 rgba(0,0,0,0.12)", opacity: k * (old ? 0.75 : 1), transform: `translateY(${(1 - k) * 18}px)`, fontFamily: "Poppins", fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: "#1b1a22" }}>
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

export const PhoneUI005: React.FC<{ t: number; shot: "S09" | "S14"; span: [number, number]; msgAt: number; vib?: number }> = ({ t, shot, span, msgAt, vib }) => {
  const [a, b] = span;
  if (t < a || t >= b + 0.5) return null;
  const push = 1 + 0.03 * sstep((t - a) / (b - a));
  const shake = vib !== undefined && ((t >= vib && t < vib + 0.52) || (t >= vib + 1.0 && t < vib + 1.52)) ? 3 * Math.sin(t * 2 * Math.PI * 18) : 0;
  const kNew = sstep((t - msgAt + 0.15) / 0.25);
  const typing = t < msgAt - 0.15 && (shot === "S09" || (vib !== undefined && t >= vib + 0.2));
  return (
    <div style={{ position: "absolute", left: 140, top: 150, width: 800, height: 1110, borderRadius: 70, background: "#16151c", border: "12px solid #2a2833", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", overflow: "hidden", transform: `translateX(${shake.toFixed(2)}px) scale(${push.toFixed(4)})`, transformOrigin: "center" }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: 54, background: "#e9e6df", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 130, background: "#3c4a63", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#9aa3b2" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "Poppins", color: "#f3efe6" }}>
            <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.1 }}>Nomor tidak dikenal</div>
            <div style={{ fontWeight: 500, fontSize: 28, lineHeight: 1.1, opacity: 0.8, letterSpacing: 1 }}>{MASKED_NUMBER}</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "40px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
          <Bubble text={shot === "S09" ? L10_TEXT : L6_TEXT} k={1} old />
          <Bubble text={shot === "S09" ? L6_TEXT : L8_TEXT} k={kNew} />
          {typing ? <Typing t={t} /> : null}
        </div>
      </div>
    </div>
  );
};

export const DayLabel4: React.FC<{ t: number }> = ({ t }) => {
  const a = sstep((t - 0.25) / 0.5) * (1 - sstep((t - 4.4) / 0.5));
  if (a <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 1080 * 0.08, top: 1920 * 0.12, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 18px", borderRadius: 16, background: "rgba(16, 22, 46, 0.9)", border: "2px solid rgba(160, 176, 230, 0.22)", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden><path d="M19.5 3.5a11.5 11.5 0 1 0 7 20.6A9.5 9.5 0 0 1 19.5 3.5Z" fill="#ffe7a3" /></svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>HARI 1</span>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>EPISODE 4</span>
      </div>
    </div>
  );
};
