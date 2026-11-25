// Ep 5: caption pages (the same LINES as Episode006.tsx) vs the VO speech windows of the plan; text = script v0.1 L#.
//   npx esbuild tools/e006_captions.ts --bundle --platform=node --log-level=warning --outfile=out/e006_captions.cjs && node out/e006_captions.cjs
import { captionPages, captionWords } from "../src/ep005/captions005";
import type { ELine } from "../src/ep005/captions005";
import PLAN from "../src/ep006/episode006-plan.json";
const V = PLAN.vo as unknown as Record<string, { capBursts: number[][]; speech: number[][]; end: number }>;
const LINES: ELine[] = [
  { id: "L1", who: "n", text: "Kamu meminta bukti.", bursts: V.N01.capBursts },
  { id: "L3", who: "n", text: "Kamu menerima kuncinya.", bursts: V.N03.capBursts },
  { id: "L4", who: "toa", text: "“Kalian lewat gang.”", bursts: V.P01.capBursts, split: /^Kalian$/ },
  { id: "L5", who: "n", text: "Pintunya masih terkunci. Tidak ada siapa pun di dalam.", bursts: V.N04.capBursts },
  { id: "L6", who: "adik", text: "“Itu rumah kita…”", bursts: V.D01.capBursts },
  { id: "L7", who: "n", text: "Kamu melihat semuanya.", bursts: V.N05.capBursts },
  { id: "L8", who: "n", text: "Kamu akan memilih…", bursts: V.N06.capBursts }, // v5: N06 in full (owner)
  { id: "L9", who: "uq" as never, text: "“Ini Uq, rumah nomor tujuh.”", bursts: V.U01.capBursts, split: /(,|nomor)$/ },
  { id: "L10", who: "uq" as never, text: "“Kami bukan tontonan.”", bursts: V.U02.capBursts },
];
const segOf: Record<string, string> = { L1: "N01", L3: "N03", L4: "P01", L5: "N04", L6: "D01", L7: "N05", L8: "N06", L9: "U01", L10: "U02" };
const pages = captionPages(captionWords(LINES));
pages.forEach((p, i) => { const n = pages[i + 1]; if (n && n.a - p.b > 0 && n.a - p.b < 0.15) p.b = n.a; });
// as Episode006 PAGES006: no caption into the stare (S15)
const S15 = (PLAN.shots as unknown as Record<string, number[]>).S15[0];
pages.forEach((p) => { if (p.b > S15) p.b = S15; });
let bad = 0;
for (const p of pages) {
  const words = p.words.map((w) => w.text).join(" ");
  const line = LINES.find((l) => l.bursts.some((b) => p.words[0].a >= b[0] - 0.01 && p.words[0].a <= b[1] + 0.01))!;
  const sp = V[segOf[line.id]].speech;
  const inSpeech = p.words.every((w) => sp.some(([a, b]) => w.a >= a - 0.15 && w.b <= b + 0.15));
  if (!inSpeech) bad++;
  console.log(`${line.id.padEnd(4)} ${p.a.toFixed(2)}-${p.b.toFixed(2)} s  "${words.toUpperCase()}"  ${inSpeech ? "OK (di dalam ucapan +/- 0,15 s)" : "CEK"}`);
}
const all = pages.flatMap((p) => p.words.map((w) => w.text)).join(" ");
const script = LINES.map((l) => l.text.replace(/[“”"]/g, "")).join(" ");
console.log(`teks caption = naskah: ${all === script ? "YA" : "TIDAK"}`);
console.log(`HASIL: ${bad || all !== script ? "CEK" : "LOLOS"}`);
