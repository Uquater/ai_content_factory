// Episode 4 (2026-11-005) captions, the Episode 3 FINAL rules (owner 2026-11-23, pilot v3: "match the Ep 1–3 caption look").
// Copied from studio/src/ep004/Episode004.tsx (captions section; not exported there and Episode004.tsx is not changed, the same way
// Episode004.tsx copied its caption layout from Pilot004.tsx). Same rules:
//   - text = script v1.0, quotes stripped, UPPERCASE, Poppins 800, 88 px, line height 1.05, 13 px dark stroke + soft shadow;
//   - band centred on 70 % of the height (top 1920·0.7 − 80, height 160), left/right 60 px, words wrapped and centred, gap 24 px;
//   - colour by speaker (narrator white, toa #ffe7a3, adik #ffc9d8); the word being spoken = lime #d4f03c (from 0.066 s before
//     to 0.04 s after the word);
//   - words inside a burst share the burst by characters (ASUMSI, as Ep 3); a line splits into groups at its measured pauses;
//   - a page holds max 3 words, breaks on . ? ! , … and on a speaker change or a gap > 0.15 s; page in 2 frames before its
//     first word, out 0.25 s after its last word (or at the next page).
import React from "react";

export type ELine = { id: string; who: "n" | "toa" | "adik"; text: string; bursts: number[][]; split?: RegExp };
const COLOR: Record<string, string> = { n: "#ffffff", toa: "#ffe7a3", adik: "#ffc9d8" };
const ACCENT = "#d4f03c";
type W = { text: string; a: number; b: number; who: string };
type Page = { words: W[]; a: number; b: number };
const strip = (w: string) => w.replace(/[“”"]/g, "");
const spread = (ws: string[], a0: number, b0: number, who: string): W[] => {
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => { const a = a0 + ((b0 - a0) * acc) / total; acc += w.length + 1; return { text: w, a, b: a0 + ((b0 - a0) * acc) / total, who }; });
};
export const captionWords = (lines: ELine[]): W[] =>
  lines.flatMap((l) => {
    const ws = l.text.split(/\s+/).map(strip).filter(Boolean);
    if (l.bursts.length === 1) return spread(ws, l.bursts[0][0], l.bursts[0][1], l.who);
    const groups: string[][] = [[]];
    ws.forEach((w, i) => {
      groups[groups.length - 1].push(w);
      const brk = l.split ? l.split.test(w) : /[.?!…]$/.test(w);
      if (brk && i < ws.length - 1) groups.push([]);
    });
    if (groups.length !== l.bursts.length) throw new Error(`caption ${l.id}: ${groups.length} groups vs ${l.bursts.length} bursts`);
    return groups.flatMap((g, i) => spread(g, l.bursts[i][0], l.bursts[i][1], l.who));
  });
export const captionPages = (words: W[]): Page[] => {
  const pages: Page[] = [];
  let cur: W[] = [];
  const flush = () => { if (cur.length) pages.push({ words: cur, a: cur[0].a - 2 / 30, b: cur[cur.length - 1].b + 0.25 }); cur = []; };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (prev && (prev.who !== w.who || w.a - prev.b > 0.15)) flush();
    cur.push(w);
    if (cur.length >= 3 || /[.?!,…]$/.test(w.text)) flush();
  });
  flush();
  pages.forEach((p, i) => { if (i + 1 < pages.length) p.b = Math.min(p.b, pages[i + 1].a); });
  return pages;
};
export const Captions005: React.FC<{ t: number; pages: Page[] }> = ({ t, pages }) => {
  const p = pages.find((x) => t >= x.a && t < x.b);
  if (!p) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1920 * 0.7 - 80, height: 160, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: 24 }}>
      {p.words.map((w, i) => {
        const on = t >= w.a - 0.066 && t < w.b + 0.04;
        return (
          <span key={i} style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 88, lineHeight: 1.05, color: on ? ACCENT : COLOR[w.who] ?? "#fff", WebkitTextStroke: "13px #0e0a10", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>
            {w.text.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};
