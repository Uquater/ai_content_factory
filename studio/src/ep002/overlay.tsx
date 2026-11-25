// Episode 2026-11-002 screen overlays (HTML over the 3D view, authored at 1080×1920): subtitles at 70 % height with
// the speaker's colour (narrator white, the toa voice pale yellow, adik pink), the phone chat UI of A07 (the only
// readable text is the officer's message L14–L16, exactly as in the script), and the two choice cards of A17.
import React from "react";
import { makeChunks } from "../inkbeat/core/captions";
import type { Chunk, Word } from "../inkbeat/core/captions";
import PLAN from "./plan-2026-11-002.json";

type Line = { id: string; who: string; text: string; start: number; end: number };
export const LINES = PLAN.lines as Line[];
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const COLOR: Record<string, string> = { n: "#ffffff", toa: "#ffe7a3", adik: "#ffc9d8" };

/** words with onsets spread over each line by letter count (the audio gives line timing, not word timing) */
const strip = (w: string) => w.replace(/[“”"]/g, "");
type CChunk = Chunk & { who: string };
const buildChunks = (): CChunk[] => {
  const out: CChunk[] = [];
  for (const l of LINES) {
    if (l.who === "msg") continue; // L14–L16: the phone shows the text; no subtitle (content.md §4 A07)
    const ws = l.text.split(/\s+/).map(strip).filter(Boolean);
    const total = ws.reduce((a, w) => a + w.length + 1, 0);
    let acc = 0;
    const words: Word[] = ws.map((w) => {
      const a = l.start + ((l.end - l.start) * acc) / total;
      acc += w.length + 1;
      return [w, a, l.start + ((l.end - l.start) * acc) / total];
    });
    const ch = makeChunks(words, l.end + 0.25);
    ch.forEach((c) => out.push({ ...c, who: l.who }));
  }
  // a chunk never runs into the next line's first chunk
  out.forEach((c, i) => {
    if (i + 1 < out.length) c.b = Math.min(c.b, out[i + 1].a);
  });
  return out;
};
export const CHUNKS = buildChunks();

export const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const c = CHUNKS.find((x) => t >= x.a && t < x.b);
  if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1920 * 0.7 - 70, height: 140, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      {c.words.map((w, i) => (
        <span key={i} style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 92, lineHeight: 1, color: COLOR[c.who] ?? "#fff", WebkitTextStroke: "14px #120a10", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>
          {w}
        </span>
      ))}
    </div>
  );
};

const MSG = LINES.filter((l) => l.who === "msg");
const blur = (w: number, mine = false) => (
  <div style={{ alignSelf: mine ? "flex-end" : "flex-start", width: w, padding: "18px 22px", borderRadius: 26, background: mine ? "#cfe9c8" : "#f4f2ee", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ height: 14, width: "92%", borderRadius: 7, background: "rgba(40,40,50,0.28)", filter: "blur(3px)" }} />
    <div style={{ height: 14, width: "64%", borderRadius: 7, background: "rgba(40,40,50,0.22)", filter: "blur(3px)" }} />
  </div>
);
/** A07: the residents' group scrolls (unreadable), then the officer's message arrives; its three sentences appear as
 * the narrator reads them. tScroll = when the group view starts. */
export const PhoneUI: React.FC<{ t: number; tIn: number; notif: number }> = ({ t, tIn, notif }) => {
  const a = sstep((t - tIn) / 0.25);
  const chat = t >= notif + 0.9; // after the notification is tapped, the officer's chat opens
  const scroll = (t - tIn) * 160;
  return (
    <div style={{ position: "absolute", left: 140, top: 150, width: 800, height: 1110, borderRadius: 70, background: "#16151c", border: "12px solid #2a2833", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", opacity: a, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: 54, background: chat ? "#e9e6df" : "#e3e7e1", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 110, background: chat ? "#3c4a63" : "#3d5a4a", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
          <div style={{ width: 66, height: 66, borderRadius: 33, background: "#f3efe6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {chat ? (
              // a plain shield icon, no name (the officer is never named)
              <svg width="38" height="44" viewBox="0 0 38 44"><path d="M19 2 L35 8 V21 C35 32 28 39 19 42 C10 39 3 32 3 21 V8 Z" fill="#3c4a63" /></svg>
            ) : (
              <svg width="44" height="34" viewBox="0 0 44 34"><circle cx="13" cy="11" r="8" fill="#3d5a4a" /><circle cx="31" cy="11" r="8" fill="#3d5a4a" /><rect x="2" y="21" width="40" height="12" rx="6" fill="#3d5a4a" /></svg>
            )}
          </div>
          <div style={{ height: 18, width: 220, borderRadius: 9, background: "rgba(255,255,255,0.55)", filter: "blur(2px)" }} />
        </div>
        {!chat ? (
          <div style={{ flex: 1, padding: "26px 26px", display: "flex", flexDirection: "column", gap: 20, transform: `translateY(${-scroll % 260}px)` }}>
            {[520, 430, 600, 380, 560, 470, 610, 420, 500, 560].map((w, i) => (
              <React.Fragment key={i}>{blur(w, i % 3 === 1)}</React.Fragment>
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, padding: "40px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
            {t < MSG[0].start - 0.15 ? (
              // the officer is typing (no text): three dots
              <div style={{ alignSelf: "flex-start", padding: "26px 30px", borderRadius: 28, background: "#ffffff", display: "flex", gap: 14 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: "#7a7f8c", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((t * 3 - i * 0.35) * Math.PI)) }} />
                ))}
              </div>
            ) : null}
            {MSG.map((l) => {
              const k = sstep((t - l.start + 0.15) / 0.25);
              return k <= 0 ? null : (
                <div key={l.id} style={{ alignSelf: "flex-start", maxWidth: 640, padding: "22px 28px", borderRadius: 28, background: "#ffffff", boxShadow: "0 4px 0 rgba(0,0,0,0.12)", opacity: k, transform: `translateY(${(1 - k) * 18}px)`, fontFamily: "Poppins", fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: "#1b1a22" }}>
                  {strip(l.text)}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* the notification banner (L13) */}
      {t >= notif && t < notif + 0.9 ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 40 + (1 - sstep((t - notif) / 0.2)) * -140, height: 120, borderRadius: 30, background: "rgba(250,250,252,0.97)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 22, padding: "0 26px" }}>
          <svg width="46" height="54" viewBox="0 0 38 44"><path d="M19 2 L35 8 V21 C35 32 28 39 19 42 C10 39 3 32 3 21 V8 Z" fill="#3c4a63" /></svg>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ height: 16, width: "40%", borderRadius: 8, background: "rgba(30,30,40,0.5)" }} />
            <div style={{ height: 14, width: "75%", borderRadius: 7, background: "rgba(30,30,40,0.25)", filter: "blur(2px)" }} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** A17: the two choices, words taken exactly from L33 (left "tetap di dalam", right "keluar lewat belakang") */
export const Cards: React.FC<{ t: number; inAt: number }> = ({ t, inAt }) => {
  if (t < inAt) return null;
  const items = ["tetap di dalam", "keluar lewat belakang"];
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 170, display: "flex", gap: 30, justifyContent: "center" }}>
      {items.map((s, i) => {
        const k = sstep((t - inAt - i * 0.2) / 0.35);
        return (
          <div key={s} style={{ flex: 1, padding: "34px 26px", borderRadius: 30, background: "rgba(252,246,234,0.95)", border: "6px solid #1b1a2a", boxShadow: "0 10px 0 rgba(27,26,42,0.85)", opacity: k, transform: `translateY(${(1 - k) * -30}px)`, textAlign: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: "#1b1a2a" }}>
            {s}
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ D-031 pilot captions (style target: caps, active word lit)
/** one word in the remotion-captions `Caption` shape (startMs/endMs); onsets spread over the line by letter count,
 * because the voice-over timing is per line, not per word */
export type WordCaption = { text: string; startMs: number; endMs: number; timestampMs: number | null; confidence: number | null; who: string };
const buildWordCaptions = (): WordCaption[] => {
  const out: WordCaption[] = [];
  for (const l of LINES) {
    if (l.who === "msg") continue;
    const ws = l.text.split(/\s+/).map(strip).filter(Boolean);
    const total = ws.reduce((a, w) => a + w.length + 1, 0);
    let acc = 0;
    for (const w of ws) {
      const a = l.start + ((l.end - l.start) * acc) / total;
      acc += w.length + 1;
      const b = l.start + ((l.end - l.start) * acc) / total;
      out.push({ text: w, startMs: Math.round(a * 1000), endMs: Math.round(b * 1000), timestampMs: null, confidence: null, who: l.who });
    }
  }
  return out;
};
export const WORD_CAPTIONS = buildWordCaptions();
/** pages of at most 3 words, broken after punctuation and between lines; a page stays up to 0.25 s past its last word
 * (never into the next page) */
type Page = { words: WordCaption[]; a: number; b: number };
const buildPages = (): Page[] => {
  const pages: Page[] = [];
  let cur: WordCaption[] = [];
  const flush = () => {
    if (cur.length) pages.push({ words: cur, a: cur[0].startMs / 1000 - 2 / 30, b: cur[cur.length - 1].endMs / 1000 + 0.25 });
    cur = [];
  };
  WORD_CAPTIONS.forEach((w, i) => {
    const prev = WORD_CAPTIONS[i - 1];
    if (prev && (prev.who !== w.who || w.startMs - prev.endMs > 150)) flush();
    cur.push(w);
    if (cur.length >= 3 || /[.?!,]$/.test(w.text)) flush();
  });
  flush();
  pages.forEach((p, i) => {
    if (i + 1 < pages.length) p.b = Math.min(p.b, pages[i + 1].a);
  });
  return pages;
};
const PAGES = buildPages();
const ACCENT = "#d4f03c";
/** captions at 70 % height, uppercase heavy sans; the word being spoken is lit in the accent colour (the reference's
 * keyword highlight), the others in the speaker's colour */
export const CaptionsHL: React.FC<{ t: number }> = ({ t }) => {
  const p = PAGES.find((x) => t >= x.a && t < x.b);
  if (!p) return null;
  const ms = t * 1000;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1920 * 0.7 - 80, height: 160, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: 24 }}>
      {p.words.map((w, i) => {
        const on = ms >= w.startMs - 66 && ms < w.endMs + 40;
        return (
          <span key={i} style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 88, lineHeight: 1.05, color: on ? ACCENT : COLOR[w.who] ?? "#fff", WebkitTextStroke: "13px #0e0a10", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>
            {w.text.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ "HARI 1" day label (final, 2026-11-17)
/** a small rounded navy label with a crescent moon, top-left (8 % from the left, 12 % from the top: below the
 * TikTok / Reels / Shorts top bars, clear of the right-side buttons and the caption band); fades in 0.25–0.75 s,
 * holds, fades out 4.4–4.9 s. No intro, no timing change. */
export const DayLabel: React.FC<{ t: number; text?: string }> = ({ t, text = "HARI 1" }) => {
  const a = sstep((t - 0.25) / 0.5) * (1 - sstep((t - 4.4) / 0.5));
  if (a <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 1080 * 0.08, top: 1920 * 0.12, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 18px", borderRadius: 16, background: "rgba(16, 22, 46, 0.9)", border: "2px solid rgba(160, 176, 230, 0.22)", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
        <path d="M19.5 3.5a11.5 11.5 0 1 0 7 20.6A9.5 9.5 0 0 1 19.5 3.5Z" fill="#ffe7a3" />
      </svg>
      <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>{text}</span>
    </div>
  );
};
