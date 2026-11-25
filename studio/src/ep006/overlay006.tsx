// Episode 5 (2026-11-006) 2D overlays for the full-episode preview (owner 2026-11-24).
//   DayLabel5       "HARI 1 / EPISODE 5" (Ep 4 DayLabel4 copied, script V1), 0.25-4.9 s
//   PhoneUI006      the same chat with the unknown number as Ep 3-4 (PhoneUI005 layout copied): Ep 4's last message (L8) on
//                   top; S01 Uq types and sends "Buktikan dulu." (outgoing bubble, right); S03 the reply: the photo (proof.png,
//                   key with the RUANG TOA tag at the back door) + "Ini kuncinya. Saya di luar pintu belakang." (L2)
//   MonitorGrid006  S08b: the CCTV channels of house no. 7 and the compound (studio/public/ep006/ch_*.png): kitchen,
//                   hallway, bedroom, LIVING ROOM DARK (taped lens, Ep 4), street, a neighbour watching, and the toa room
//                   itself (desk camera); NO bathroom channel (D-064); the viewers' choice list with ticks (real cards Ep 1-4)
//   TextBox006      S09 / S10b: the line types itself, "SUARA: UQ" with the voice bars, "PILIHAN BERIKUTNYA" (S10b), and the
//                   freeze on the switch click
//   GlitchTamat006  the approved closing (D-067, v0f): black after the cut; from 3.90 s TAMAT fades in and the whole screen +
//                   TAMAT glitch to the last frame (seeded per frame: slices, RGB split, grain, a scanline), TAMAT stays legible
import React from "react";
import { Img, staticFile } from "remotion";
import { L8_TEXT } from "../ep005/overlay005";
import { MASKED_NUMBER } from "../ep004/overlay004";

const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };
/** seeded PRNG (mulberry32): the same numbers for the same seed, in every render tab */
const rnd = (seed: number) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

export const DayLabel5: React.FC<{ t: number }> = ({ t }) => {
  // as Ep 1-4 (0.25-4.9 s); the S01 phone sits lower so the label does not cover its header
  const a = sstep((t - 0.25) / 0.5) * (1 - sstep((t - 4.4) / 0.5));
  if (a <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 1080 * 0.08, top: 1920 * 0.12, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 18px", borderRadius: 16, background: "rgba(16, 22, 46, 0.9)", border: "2px solid rgba(160, 176, 230, 0.22)", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden><path d="M19.5 3.5a11.5 11.5 0 1 0 7 20.6A9.5 9.5 0 0 1 19.5 3.5Z" fill="#ffe7a3" /></svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>HARI 1</span>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>EPISODE 5</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ phone
const Bubble: React.FC<{ k: number; out?: boolean; old?: boolean; children: React.ReactNode; pad?: string }> = ({ k, out, old, children, pad = "22px 28px" }) =>
  k > 0 ? (
    <div style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: 640, padding: pad, borderRadius: 28, background: out ? "#d7f5c4" : "#ffffff", boxShadow: "0 4px 0 rgba(0,0,0,0.12)", opacity: k * (old ? 0.75 : 1), transform: `translateY(${(1 - k) * 18}px)`, fontFamily: "Poppins", fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: "#1b1a22" }}>
      {children}
    </div>
  ) : null;
export const OUT_TEXT = "Buktikan dulu.";
export const L2_TEXT = "Ini kuncinya. Saya di luar pintu belakang.";
export const PhoneUI006: React.FC<{ t: number; shot: "S01" | "S03"; span: [number, number]; type?: [number, number]; send?: number; msgAt?: number; vib?: number }> = ({ t, shot, span, type, send, msgAt = 1e9, vib }) => {
  const top = shot === "S01" ? 360 : 150, height = shot === "S01" ? 890 : 1110; // S01: below the HARI 1 label, above the caption band
  const [a, b] = span;
  if (t < a || t >= b) return null;
  const push = 1 + 0.03 * sstep((t - a) / (b - a));
  const shake = vib !== undefined && t >= vib && t < vib + 0.52 ? 3 * Math.sin(t * 2 * Math.PI * 18) : 0;
  // S01: the outgoing text grows in the input field while typing, then flies up as a bubble on send
  const typed = shot === "S01" && type ? OUT_TEXT.slice(0, Math.round(OUT_TEXT.length * Math.min(1, Math.max(0, (t - type[0]) / (type[1] - type[0]))))) : "";
  const sent = shot === "S03" ? 1 : send !== undefined ? sstep((t - send) / 0.2) : 0;
  const kPhoto = shot === "S03" ? sstep((t - msgAt) / 0.25) : 0;
  return (
    <div style={{ position: "absolute", left: 140, top, width: 800, height, borderRadius: 70, background: "#16151c", border: "12px solid #2a2833", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", overflow: "hidden", transform: `translateX(${shake.toFixed(2)}px) scale(${push.toFixed(4)})`, transformOrigin: "center" }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: 54, background: "#e9e6df", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 130, flexShrink: 0, background: "#3c4a63", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#9aa3b2" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "Poppins", color: "#f3efe6" }}>
            <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.1 }}>Nomor tidak dikenal</div>
            <div style={{ fontWeight: 500, fontSize: 28, lineHeight: 1.1, opacity: 0.8, letterSpacing: 1 }}>{MASKED_NUMBER}</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "24px 30px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 18 }}>
          {shot === "S01" ? <Bubble k={1} old>{L8_TEXT}</Bubble> : null}
          <Bubble k={sent} out>{OUT_TEXT}</Bubble>
          {kPhoto > 0 ? (
            <Bubble k={kPhoto} pad="14px 14px 22px 14px">
              <Img src={staticFile("ep006/proof.png")} style={{ width: 440, height: 520, objectFit: "cover", borderRadius: 18, display: "block" }} />
              <div style={{ padding: "14px 10px 0 10px", fontSize: 42 }}>{L2_TEXT}</div>
            </Bubble>
          ) : null}
        </div>
        {/* input field (S01: the typed text, before send) */}
        <div style={{ height: 110, flexShrink: 0, background: "#f6f3ec", display: "flex", alignItems: "center", padding: "0 28px", gap: 16, borderTop: "2px solid #d8d3c8" }}>
          <div style={{ flex: 1, height: 70, borderRadius: 35, background: "#ffffff", display: "flex", alignItems: "center", padding: "0 26px", fontFamily: "Poppins", fontWeight: 600, fontSize: 36, color: "#1b1a22" }}>
            {sent < 0.5 ? typed : ""}
            {shot === "S01" && sent < 0.5 && Math.floor(t * 3) % 2 === 0 ? <span style={{ color: "#3c4a63" }}>|</span> : null}
          </div>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#3c4a63" }} />
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ the monitor grid (S08b)
const CCTV: React.CSSProperties = { filter: "grayscale(0.75) sepia(0.25) hue-rotate(60deg) contrast(1.15) brightness(1.25)" };
const Scan: React.FC = () => <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)" }} />;
// preview v2 QC: the kitchen/hallway/bedroom tiles are frames of Ep 1-4 (Uq and adik in them) while the header said
// "LANGSUNG"; they are now RECORDINGS of tonight with their own times, and only the toa-room tile is live
const Tile: React.FC<{ src?: string; label: string; t: number; dark?: boolean; live?: boolean; clock?: string; style?: React.CSSProperties }> = ({ src, label, t, dark, live, clock = "02:14", style }) => {
  const r = rnd(Math.floor(t * 30) * 7 + label.length);
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 6, background: "#050506", border: live ? `4px solid rgba(255,60,40,${0.55 + 0.45 * Math.abs(Math.sin(t * 4))})` : "2px solid #2a2a30", ...style }}>
      {src && !dark ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...CCTV }} /> : null}
      {dark ? <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${40 + 20 * r()}% ${45 + 10 * r()}%, rgba(120,120,110,0.18), rgba(10,10,12,0.95) 60%)` }} /> : null}
      <Scan />
      <div style={{ position: "absolute", left: 10, top: 8, fontFamily: "monospace", fontWeight: 700, fontSize: 24, color: "#e8f0e0", textShadow: "0 0 4px #000", letterSpacing: 1 }}>{label}</div>
      <div style={{ position: "absolute", right: 10, top: 8, display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 20, color: "#e8f0e0", textShadow: "0 0 4px #000" }}>
        {live ? <span style={{ width: 12, height: 12, borderRadius: 6, background: Math.floor(t * 2) % 2 ? "#ff2a1a" : "#7a1a12", display: "inline-block" }} /> : null}{live ? `LANGSUNG ${clock}` : `REKAMAN ${clock}`}
      </div>
    </div>
  );
};
/** the choices the viewers made, as on the cards of Ep 1-4 (Ep 1 -> Ep 2 "tetap di dalam", Ep 2 -> Ep 3 "tetap diam bersama
 * adik", Ep 3 -> Ep 4 "tutup kameranya", Ep 4 -> Ep 5 "minta bukti dulu"; D-065) */
export const CHOICES_MADE = ["tetap di dalam", "tetap diam bersama adik", "tutup kameranya", "minta bukti dulu"];
export const MonitorGrid006: React.FC<{ t: number; span: [number, number] }> = ({ t, span }) => {
  const [a, b] = span;
  if (t < a || t >= b) return null;
  const push = 1 + 0.035 * sstep((t - a) / (b - a));
  const W = 470, H = 264;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#07080b", transform: `scale(${push.toFixed(4)})`, transformOrigin: "50% 60%" }}>
      <div style={{ position: "absolute", left: 55, top: 120, fontFamily: "monospace", fontWeight: 700, fontSize: 30, color: "#cfe0c8", letterSpacing: 2 }}>KOMPLEKS · RUMAH NO. 7 · MALAM INI</div>
      <div style={{ position: "absolute", left: 55, top: 175, display: "grid", gridTemplateColumns: `${W}px ${W}px`, gridAutoRows: `${H}px`, gap: 16 }}>
        <Tile src="ep006/ch_dapur.png" label="DAPUR" t={t} clock="02:09" />
        <Tile src="ep006/ch_lorong.png" label="LORONG" t={t} clock="02:12" />
        <Tile src="ep006/ch_kamar.png" label="KAMAR" t={t} clock="02:00" />
        <Tile label="RUANG TAMU" t={t} dark clock="02:13" />
        <Tile src="ep006/ch_jalan.png" label="JALAN" t={t} clock="02:10" />
        <Tile src="ep006/ch_tetangga.png" label="RUMAH 3" t={t} live />
      </div>
      {/* the toa room itself, live: below, wide, framed red */}
      <Tile src="ep006/ch_ruangtoa.png" label="RUANG TOA" t={t} live style={{ position: "absolute", left: 55, top: 175 + 3 * (H + 16), width: 2 * W + 16, height: 400 }} />
      {/* the viewers' choices (under the caption band: y >= 1460) */}
      <div style={{ position: "absolute", left: 55, top: 1470, width: 2 * W + 16, padding: "22px 30px", borderRadius: 14, background: "rgba(20,24,30,0.95)", border: "2px solid #3a4250", fontFamily: "monospace", color: "#e8ecf0" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, color: "#ffd36a", marginBottom: 12 }}>PILIHAN PENONTON</div>
        {CHOICES_MADE.map((c, i) => (
          <div key={c} style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.45, opacity: sstep((t - a - 0.3 - 0.18 * i) / 0.2) }}>
            <span style={{ color: "#7ee07a" }}>✓</span> {c}
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ the text box (S09, S10b)
export const TextBox006: React.FC<{ t: number; span: [number, number]; text: string; type: [number, number]; speech: number[][]; freeze?: number; panel?: number; stopAt?: string }> = ({ t, span, text, type, speech, freeze, panel, stopAt }) => {
  const [a, b] = span;
  if (t < a || t >= b) return null;
  const tf = freeze !== undefined ? Math.min(t, freeze) : t;
  const n = Math.round(text.length * Math.min(1, Math.max(0, (tf - type[0]) / (type[1] - type[0]))));
  const shown = stopAt && freeze !== undefined && t >= freeze ? stopAt : text.slice(0, n);
  const talking = speech.some(([s, e]) => tf >= s && tf < e);
  const push = 1 + 0.03 * sstep((t - a) / (b - a));
  const r = rnd(Math.floor(tf * 30));
  const kPanel = panel !== undefined ? sstep((t - panel) / 0.2) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#06070a", transform: `scale(${push.toFixed(4)})`, transformOrigin: "50% 45%" }}>
      <div style={{ position: "absolute", left: 70, top: 260, width: 940, height: 760, borderRadius: 16, background: "#0e1218", border: "3px solid #2c3442", padding: 40, boxSizing: "border-box", fontFamily: "monospace", color: "#d8e2d0" }}>
        <div style={{ fontSize: 28, letterSpacing: 2, color: "#8a96a8" }}>NASKAH · RUMAH NO. 7 · HARI 1</div>
        <div style={{ marginTop: 70, fontSize: 64, fontWeight: 700, lineHeight: 1.2, minHeight: 160 }}>
          {shown}
          {(freeze === undefined || t < freeze) && Math.floor(t * 3) % 2 === 0 ? <span style={{ color: "#7ee07a" }}>▌</span> : null}
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 40, right: 40, display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#ffd36a", letterSpacing: 2 }}>SUARA: UQ</div>
          <div style={{ flex: 1, height: 90, display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: 40 }, (_, i) => {
              const h = talking ? 12 + 70 * Math.abs(Math.sin(tf * 9 + i * 0.7)) * (0.5 + 0.5 * r()) : 6;
              return <div key={i} style={{ width: 10, height: h, borderRadius: 4, background: talking ? "#7ee07a" : "#3a4a3a" }} />;
            })}
          </div>
        </div>
      </div>
      {kPanel > 0 ? (
        <div style={{ position: "absolute", left: 70, top: 1460, width: 940, padding: "24px 30px", borderRadius: 14, background: "rgba(20,24,30,0.95)", border: "2px solid #3a4250", fontFamily: "monospace", color: "#e8ecf0", opacity: kPanel }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2, color: "#ffd36a" }}>PILIHAN BERIKUTNYA</div>
          <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
            {[0, 1].map((i) => <div key={i} style={{ flex: 1, height: 90, borderRadius: 12, border: "3px dashed #5a6478" }} />)}
          </div>
          <div style={{ marginTop: 14, fontSize: 26, color: "#8a96a8" }}>{freeze !== undefined && t >= freeze ? "INPUT: MIKROFON · DIHENTIKAN" : "MENUNGGU PENONTON…"}</div>
        </div>
      ) : null}
    </div>
  );
};

// ------------------------------------------------------------------ the closing glitch (D-067 = v0f)
/** u = time since the start of the stare (s). Before `cut` nothing (the picture shows); cut → glitchIn pure black; from
 * glitchIn: grain + TAMAT fading in over 0.25 s, with seeded glitch frames (about 1 in 3) to the end */
export const GlitchTamat006: React.FC<{ u: number; frame: number; cut: number; glitchIn: number; full: number }> = ({ u, frame, cut, glitchIn, full }) => {
  // v3 QC against v0f (frames every 0.2 s from 3.9 s): v0f stays near-black (luma ~5) with faint grain, and the glitch is
  // ON THE WORD (bands of the letters shifted, colour fringes, a scrambled frame now and then); no light bars across the
  // screen. Matched here; seeded per frame (the same frames glitch in every render).
  if (u < cut) return null;
  if (u < glitchIn) return <div style={{ position: "absolute", inset: 0, background: "#000" }} />;
  const r = rnd(9001 + frame * 13);
  const k = sstep((u - glitchIn) / (full - glitchIn));
  const g = r() < 0.4; // a glitch frame
  const split = g ? 2 + Math.round(r() * 4) : 0;
  const TOP = 905, H = 150; // the word's band (font 120 px, line ~150 px)
  const bands = g ? [0, 1, 2].map(() => ({ y: Math.round(r() * (H - 30)), h: 12 + Math.round(r() * 36), dx: Math.round((r() - 0.5) * 44) })) : [];
  const word = (color: string, ox: number, op: number, blend = "screen") => (
    <div style={{ position: "absolute", left: 0, right: 0, top: TOP, height: H, lineHeight: `${H}px`, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 120, letterSpacing: 12, color, opacity: op, transform: `translateX(${ox}px)`, mixBlendMode: blend as React.CSSProperties["mixBlendMode"] }}>TAMAT</div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: "#020202", overflow: "hidden" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
        <filter id={`gr${frame}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 997} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="1080" height="1920" filter={`url(#gr${frame})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, opacity: k }}>
        {split ? word("#ff2a3a", -split, 0.8) : null}
        {split ? word("#2af0ff", split, 0.8) : null}
        {word("#ffffff", 0, 1, "normal")}
        {/* glitch bands: a strip of the word cut out and shifted sideways */}
        {bands.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: 230, right: 230, top: TOP + b.y, height: b.h, overflow: "hidden", background: "#020202" }}>
            <div style={{ position: "absolute", left: b.dx - 230, top: -b.y, width: 1080, height: H, lineHeight: `${H}px`, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 120, letterSpacing: 12, color: "#ffffff" }}>TAMAT</div>
          </div>
        ))}
      </div>
    </div>
  );
};
