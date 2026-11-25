// Episode 3 (2026-11-004), FULL EPISODE assembly (D-058, owner 2026-11-21, tahap 3: preview render only).
// 17 shots in plan order (episode004-plan-d055.json): the pilot shots S01, S02, S08a, S08, S09 staged by pilot004Stage.ts
// exactly as Pilot004 does (same functions; Blok B = episode time − 3.275 s), the other 12 shots (SHOT_IDS) staged by
// episode004Stage.ts exactly as Ep004Shot does. Overlays: the Ep 2 recap cards + "HARI 1 / EPISODE 3" as pilot v3, the
// phone UI (S06, S14), the final cards (S15) and full-episode captions (pilot v3 / Ep 2 style).
//
// Clock (USULAN, D-058): every <Sequence> is round(dur × 30) frames (owner: total = sum of the rounded shots = 2076 frames
// = 69.20 s; shot durations are not changed for the audio). Inside a shot the stage is drawn at the GLOBAL time
// t = frame / 30 — the clock of the mix and the captions — not at "plan start + local frame / 30". Cumulative rounding puts
// later cuts up to 1.4 frames after their plan time; with a shot-local clock every sound in S12–S15 would land 1.0–1.4
// frames late. The shot whose staging is drawn is forced per Sequence (a last frame can fall at or past its plan end).
// Copied from Pilot004.tsx (not exported there; Pilot004.tsx and pilot004Stage.ts are not changed): ShotView (as
// PilotShotView), DayLabel3, the caption layout. Pilot shots do NOT get the D-057 door-frame cover (owner: pilot as is).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { EP2_CHOICES } from "../ep003/Episode003";
import { EP2_END } from "./e004Poses";
import { Glint, Halo, HALO_BY_LED, HiddenCam, KnobSlot, ledWorld, lensWorld } from "./LookDev004";
import { adikAt, BEATS, CARDS, stageAt, uqAt } from "./pilot004Stage";
import { charsAt, EV55, ledsAt, SHOTS55, stage55 } from "./episode004Stage";
import { FINAL_CHOICES } from "./Episode004Shot";
import { JambCovers004 } from "./jambCover004";
import { PhoneScreen004, PhoneUI004 } from "./overlay004";

export const FPS = 30;
/** plan order; pilot shots map to the pilot stage */
export const ORDER = ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08a", "S08", "S09", "S10", "S11", "S12", "S13", "S14", "I15", "S15"] as const;
const PILOT: Record<string, string> = { S01: "s01", S02: "s02", S08a: "s08a", S08: "s08", S09: "s09" };
/** episode time → pilot time: Blok A is identical, Blok B starts at pilot 27.4 s = episode S08a start */
export const PILOT_SHIFT = SHOTS55.S08a[0] - 27.4; // 3.275
const pilotT = (t: number) => (t < 10 ? t : t - PILOT_SHIFT);
export const SEQS = (() => {
  let from = 0;
  return ORDER.map((id) => {
    const dur = Math.round(SHOTS55[id][2] * FPS);
    const s = { id, from, dur, planStart: SHOTS55[id][0], planEnd: SHOTS55[id][1] };
    from += dur;
    return s;
  });
})();
export const EPISODE004_FRAMES = SEQS[SEQS.length - 1].from + SEQS[SEQS.length - 1].dur; // 2076

const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };
const LEDS = ["T", "D", "L", "K"] as const;

/** Pilot004 ShotView, on the episode clock (pilot time = pilotT(t)); the forced shot is the pilot's own shotAt(t) */
const PilotShotView: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const t = pilotT((from + f) / FPS);
  const st = stageAt(t);
  const pov = st.shot === "s08a" || st.shot === "s09";
  const uq = uqAt(t), ad = adikAt(t);
  const chars = st.chars ? (pov ? [ad] : [uq, ad]) : [];
  const occ = chars.map((c) => ({ root: c.root, height: c.height, who: c.who as "uq" | "adik" }));
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={st.blur}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={st.push ?? 0} />
        <HiddenCam id="T" on={st.ledT} />
        <HiddenCam id="D" on={0} />
        <HiddenCam id="L" on={0} />
        <HiddenCam id="K" on={0} />
        {st.knob !== undefined ? (
          <>
            <KnobSlot deg={st.knob} dz={st.push ?? 0} />
            <pointLight position={[-0.85, 2.05, -4.7]} color="#9bb0ff" intensity={0.35 * (st.vent ?? 0)} distance={2.2} decay={2} />
          </>
        ) : null}
        {chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose} hands={c.hands} legPose={c.legPose} face={c.face} blinkSeed={c.blinkSeed} />
          ) : (
            <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...c.pose }} legPose={c.legPose} face={c.face} />
          ),
        )}
        {st.chars && !pov ? <PhoneV3 p={EP2_END.phone.p} q={EP2_END.phone.q} /> : null}
        {chars.length ? <CharLight chars={chars} cam={st.cam.pos} mood={NIGHT_INT} /> : null}
      </View>
      <Halo c={st.cam} p={ledWorld("T")} on={st.ledT} d={HALO_BY_LED.T} occ={occ} />
      <Glint c={st.cam} p={lensWorld("T")} k={st.glint} />
    </AbsoluteFill>
  );
};

/** Ep004Shot body on the episode clock, with the shot forced */
const EpShotView: React.FC<{ from: number; id: string }> = ({ from, id }) => {
  const f = useCurrentFrame();
  const t = (from + f) / FPS;
  const st = stage55(t, id);
  const { chars: all, phone, glow } = charsAt(t);
  const chars = st.chars === false ? [] : st.pov ? all.filter((c) => c.who !== "uq") : all;
  const led = ledsAt(t);
  const occ = chars.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={st.blur}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} />
        <JambCovers004 />
        <KnobSlot deg={0} />
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={led[k]} />)}
        {chars.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose as never} hands={c.hands as never} legPose={c.legPose as never} face={c.face as never} />
          ) : (
            <Npc key={i} preset={ADIK_B} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...(c.pose as object) }} legPose={c.legPose as never} face={c.face as never} />
          ),
        )}
        {st.pov || !chars.length ? null : <PhoneV3 p={phone.p} q={phone.q} />}
        {st.pov || !chars.length ? null : <PhoneScreen004 p={phone.p} q={phone.q} glow={glow} />}
        {chars.length ? <CharLight chars={chars} cam={st.cam.pos} mood={NIGHT_INT} /> : null}
      </View>
      {LEDS.map((k) => <Halo key={k} c={st.cam} p={ledWorld(k)} on={led[k]} d={HALO_BY_LED[k]} occ={occ} />)}
      {st.dim ? <AbsoluteFill style={{ background: `rgba(5,5,10,${st.dim})` }} /> : null}
      {id === "S06" || id === "S14" ? <PhoneUI004 t={t} shot={id} hold /> : null}
      {id === "S15" ? <CardsAB t={t} items={FINAL_CHOICES} inAt={EV55.final_cards as number} /> : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ captions (pilot v3 / Ep 2 style)
// Text = script v1.0 §2.1, verbatim (quotes stripped as Ep 2). L5 and L10 are messages: shown on the phone UI, NOT
// captioned (Ep 2 rule for "msg"). Line spans = measured speech on the mix clock (plan d055 events = draft `measured`
// leads + cue placement). Bursts = pauses measured in the VO takes (ffmpeg silencedetect −40 dB, 0.12 s) placed at the
// mix's file start (speech start − lead). Words inside a burst: share by characters (ASUMSI, as pilot/S15).
export type ELine = { id: string; who: "n" | "toa" | "adik"; text: string; bursts: [number, number][]; split?: RegExp };
const span = (k: string) => EV55[k] as [number, number];
export const CAPTION_LINES: ELine[] = [
  { id: "L1", who: "n", text: "Jam dua pagi.", bursts: [[3.0, 4.126]] }, // pilot v3 spans
  { id: "L2", who: "n", text: "Pengeras suara kompleks memakai suaramu.", bursts: [[4.482, 6.663]] },
  { id: "L3", who: "n", text: "Dan seseorang baru saja mencoba pintu belakangmu.", bursts: [span("L3")] },
  // P01 file start 13.565 (= 13.70 − lead 0.135); pause in the take 0.544–1.084 s after "Diam" (ASUMSI: the first burst = "Diam")
  { id: "L4", who: "toa", text: "“Diam juga tidak membuatmu tidak terlihat.”", bursts: [[13.7, 14.109], [14.649, span("L4")[1]]], split: /^Diam$/ },
  // N03 file start 26.195; pause 1.598–2.019 s between the two sentences
  { id: "L6", who: "n", text: "Nomornya berbeda. Kamu tidak tahu harus percaya yang mana.", bursts: [[26.31, 27.793], [28.214, span("L6")[1]]] },
  // D01: pilot v3 bursts + 3.275 s (same take, same placement)
  { id: "L7", who: "adik", text: "“Kak… itu apa yang merah?”", bursts: [[32.481, 32.701], [33.254, 34.744]] },
  { id: "L8a", who: "n", text: "Satu di dapur.", bursts: [span("L8a")] },
  { id: "L8b", who: "n", text: "Satu di lorong.", bursts: [span("L8b")] },
  { id: "L8c", who: "n", text: "Satu di kamarmu.", bursts: [span("L8c")] },
  { id: "L9", who: "toa", text: "“Akhirnya kamu sadar.”", bursts: [span("L9")] },
  // N06 file start 61.705; pause 1.782–2.044 s at the comma
  { id: "L11", who: "n", text: "Kamu akan membalas pesan itu, atau menutup kamera di depanmu?", bursts: [[61.8, 63.487], [63.749, span("L11")[1]]], split: /,$/ },
];
const COLOR: Record<string, string> = { n: "#ffffff", toa: "#ffe7a3", adik: "#ffc9d8" };
const ACCENT = "#d4f03c";
type W = { text: string; a: number; b: number; who: string };
const strip = (w: string) => w.replace(/[“”"]/g, "");
const spread = (ws: string[], a0: number, b0: number, who: string): W[] => {
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => { const a = a0 + ((b0 - a0) * acc) / total; acc += w.length + 1; return { text: w, a, b: a0 + ((b0 - a0) * acc) / total, who }; });
};
export const CAPTION_WORDS: W[] = CAPTION_LINES.flatMap((l) => {
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
type Page = { words: W[]; a: number; b: number };
export const CAPTION_PAGES: Page[] = (() => {
  const pages: Page[] = [];
  let cur: W[] = [];
  const flush = () => { if (cur.length) pages.push({ words: cur, a: cur[0].a - 2 / 30, b: cur[cur.length - 1].b + 0.25 }); cur = []; };
  CAPTION_WORDS.forEach((w, i) => {
    const prev = CAPTION_WORDS[i - 1];
    if (prev && (prev.who !== w.who || w.a - prev.b > 0.15)) flush();
    cur.push(w);
    if (cur.length >= 3 || /[.?!,…]$/.test(w.text)) flush();
  });
  flush();
  pages.forEach((p, i) => { if (i + 1 < pages.length) p.b = Math.min(p.b, pages[i + 1].a); });
  // Owner D-058 (2026-11-21): bridge ONLY the L6 gap (frames 842–844: page "Nomornya berbeda." ends 28.043 s, next starts 28.147 s).
  // The L1→L2 gap at f132 is left as is (inherited from pilot v3).
  const iL6 = pages.findIndex((p) => p.words[p.words.length - 1].text === "berbeda.");
  if (iL6 < 0 || iL6 + 1 >= pages.length) throw new Error("caption L6 gap: page not found");
  pages[iL6].b = pages[iL6 + 1].a;
  return pages;
})();
// Choice cards A/B (recap + final), Episode 3 only (owner D-058, 2026-11-21, reference refrences/card.jpg). Same behaviour as CardsEp1
// (Ep 1/2 code, untouched): fade 0.35 s, card i 0.2 s late, from 30 px above, click 1.0→1.1 (0.1 s) →1.0 (0.2 s) + lime ring. Differences:
// the pair is centred on x = 540 (equal margins), each card has its letter A/B centred at the top, spaced above the choice text.
// Dimensions = CardsEp1's × 0.80 (measured v2: text 43 px). Texts, order and timing come from the callers.
const CARD_W = 368, CARD_GAP = 24, CARD_TOP = 292;
export const CardsAB: React.FC<{ t: number; items: string[]; inAt: number; click?: { index: number; at: number }; outAt?: number; outDur?: number }> = ({ t, items, inAt, click, outAt, outDur = 0.35 }) => {
  if (t < inAt) return null;
  const out = outAt === undefined ? 1 : 1 - sstep((t - outAt) / outDur);
  if (out <= 0.001) return null;
  const pairW = items.length * CARD_W + (items.length - 1) * CARD_GAP;
  return (
    <div style={{ position: "absolute", left: 540 - pairW / 2, width: pairW, top: CARD_TOP, display: "flex", gap: CARD_GAP }}>
      {items.map((s, i) => {
        const k = sstep((t - inAt - i * 0.2) / 0.35);
        const sel = click && click.index === i && t >= click.at;
        const up = sel ? sstep((t - click!.at) / 0.1) * (1 - sstep((t - click!.at - 0.1) / 0.2)) : 0;
        const ring = sel ? sstep((t - click!.at) / 0.12) : 0;
        return (
          <div key={s} style={{ width: CARD_W, boxSizing: "border-box", padding: "20px 21px 27px", borderRadius: 24, background: "rgba(252,246,234,0.95)", border: "5px solid #1b1a2a", boxShadow: `0 8px 0 rgba(27,26,42,0.85)${ring > 0 ? `, 0 0 0 ${(4 * ring).toFixed(2)}px rgba(212,240,60,${(0.95 * ring).toFixed(3)})` : ""}`, opacity: k * out, transform: `translateY(${(1 - k) * -30}px) scale(${(1 + 0.1 * up).toFixed(4)})`, transformOrigin: "center", textAlign: "center", fontFamily: "Poppins", fontWeight: 800, color: "#1b1a2a" }}>
            <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 16 }}>{String.fromCharCode(65 + i)}</div>
            <div style={{ fontSize: 43, lineHeight: 1.12 }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const p = CAPTION_PAGES.find((x) => t >= x.a && t < x.b);
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

/** "HARI 1 / EPISODE 3" — copied from Pilot004.tsx DayLabel3 (0.25–4.9 s, D-046) */
const DayLabel3: React.FC<{ t: number }> = ({ t }) => {
  const a = sstep((t - 0.25) / 0.5) * (1 - sstep((t - 4.4) / 0.5));
  if (a <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 1080 * 0.08, top: 1920 * 0.12, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 18px", borderRadius: 16, background: "rgba(16, 22, 46, 0.9)", border: "2px solid rgba(160, 176, 230, 0.22)", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden><path d="M19.5 3.5a11.5 11.5 0 1 0 7 20.6A9.5 9.5 0 0 1 19.5 3.5Z" fill="#ffe7a3" /></svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>HARI 1</span>
        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#ffffff", lineHeight: 1 }}>EPISODE 3</span>
      </div>
    </div>
  );
};

const Overlays: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      {/* Ep 2 recap (pilot v3 schedule, owner D-058: in 7.150, click 7.850, gone 9.200) */}
      {t < 12 ? <CardsAB t={t} items={EP2_CHOICES} inAt={CARDS.in} click={{ index: 1, at: BEATS.recapClick }} outAt={CARDS.out} outDur={CARDS.fade} /> : null}
      <DayLabel3 t={t} />
      <Captions t={t} />
    </>
  );
};

export const Episode004: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {SEQS.map((s) => (
        <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.dur}>
          {PILOT[s.id] ? <PilotShotView from={s.from} /> : <EpShotView from={s.from} id={s.id} />}
        </Sequence>
      ))}
      <Overlays />
    </AbsoluteFill>
  );
};
