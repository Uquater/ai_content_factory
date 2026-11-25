// Episode 5 (2026-11-006) FULL EPISODE preview (owner 2026-11-24: all VO in, branch B; D-064..D-067). Global clock t = frame/30
// (= the mix and the captions). Shots from episode006-plan.json; staging in stage006.ts; sets in sets006.tsx; 2D inserts in
// overlay006.tsx. S15 = the approved closing shot: CloseView006 (the v0f picture) from the END of U02, then GlitchTamat006
// (the v0f glitch, reproduced in code) to the last frame. Captions = the Ep 3/4 final rules (captions005.tsx); the guard's
// message (L2) is shown on the phone and not captioned (Ep 2-4 rule); Uq's lines are white (his own voice).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { lookTurn } from "../cast/walk";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior, StreetSet } from "../ep002/sets";
import { CharLight, charScaled, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { CardsAB } from "../ep004/Episode004";
import { Halo, HALO_BY_LED, HiddenCam, ledWorld } from "../ep004/LookDev004";
import { PhoneScreen004 } from "../ep004/overlay004";
import { captionPages, captionWords, Captions005 } from "../ep005/captions005";
import type { ELine } from "../ep005/captions005";
import { HOUSE_FRONT, NIGHT_EXT6, STAND6 } from "./Chan006";
import { CloseView006 } from "./Close006";
import { T as CLOSE_T } from "./closeMotion006";
import { DayLabel5, GlitchTamat006, MonitorGrid006, PhoneUI006, TextBox006 } from "./overlay006";
import { GangSet, GuardWear, KeyTag, SATPAM, ToaRoom, useChanTextures } from "./sets006";
import { lockFrame } from "./lock006";
import { backDoorAt, bathDoorAt, boltAt, charsAt, EV, gangLedAt, guardAt, keyAt, leverAt, monitorsAt, padlockAt, roomDoorAt, SH, shotOf, stageAt, VOP, yawTo } from "./stage006";
import PLAN from "./episode006-plan.json";

export const EPISODE006_FRAMES = PLAN.frames;
const LEDS = ["T", "D", "L", "K"] as const;
const AD_PRESET = { ...ADIK_B, accessory: undefined };
const sstep = (x: number) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); };
const T = (k: string) => EV[k] as unknown as number;
const P = (k: string) => EV[k] as unknown as [number, number];

// ------------------------------------------------------------------ captions
const LINES: ELine[] = [
  { id: "L1", who: "n", text: VOP.N01 ? "Kamu meminta bukti." : "", bursts: VOP.N01.capBursts },
  { id: "L3", who: "n", text: "Kamu menerima kuncinya.", bursts: VOP.N03.capBursts },
  { id: "L4", who: "toa", text: "“Kalian lewat gang.”", bursts: VOP.P01.capBursts, split: /^Kalian$/ },
  { id: "L5", who: "n", text: "Pintunya masih terkunci. Tidak ada siapa pun di dalam.", bursts: VOP.N04.capBursts },
  { id: "L6", who: "adik", text: "“Itu rumah kita…”", bursts: VOP.D01.capBursts },
  { id: "L7", who: "n", text: "Kamu melihat semuanya.", bursts: VOP.N05.capBursts },
  { id: "L8", who: "n", text: "Kamu akan memilih…", bursts: VOP.N06.capBursts },
  { id: "L9", who: "uq" as never, text: "“Ini Uq, rumah nomor tujuh.”", bursts: VOP.U01.capBursts, split: /(,|nomor)$/ },
  { id: "L10", who: "uq" as never, text: "“Kami bukan tontonan.”", bursts: VOP.U02.capBursts },
];
export const PAGES006 = (() => {
  const pages = captionPages(captionWords(LINES));
  pages.forEach((p, i) => { const n = pages[i + 1]; if (n && n.a - p.b > 0 && n.a - p.b < 0.15) p.b = n.a; });
  // v1 QC: "KAMI BUKAN TONTONAN." ran 0.2 s into the stare (the closing shot starts without a caption, as v0f). v5: N06 plays
  // in full and the click comes 0.8 s after it, so its page ends with the speech (no clip at the click any more)
  const s15 = SH.S15[0];
  pages.forEach((p) => { if (p.b > s15) p.b = s15; });
  return pages;
})();

// ------------------------------------------------------------------ villagers (S06b, S13): facing the front of house 7; in S13
// two of them lower their eyes and turn away (owner: "satu atau dua orang menurunkan pandangan dan berbalik")
const TA = EV.turnAway as unknown as number[];
const AWAY: Record<string, [number, number]> = { v2: [TA[0], TA[1]], v5: [TA[2], TA[3]] };
const Villagers: React.FC<{ t: number; react: boolean }> = ({ t, react }) => (
  <>
    {STAND6.map((s) => {
      const base = yawTo(s.at, HOUSE_FRONT);
      const aw = react ? AWAY[s.key] : undefined;
      // lower the eyes (0.5 s), then turn the body away from the house (about 150 deg, 0.9 s), head stays down
      const nod = aw ? 18 * sstep((t - aw[0]) / 0.5) : 0;
      const turn = aw ? (150 * Math.PI) / 180 * sstep((t - aw[0] - 0.5) / 0.9) : 0;
      // the others: a small turn of the head toward the toa (east) when the voice starts
      const lk = react && !aw ? lookTurn(t, VOP.U01.speech[1]?.[0] ?? 39.3, 14, 0.6, 0.2) : { headYaw: 0, twist: 0 };
      return <Npc key={s.key} preset={s.preset} position={s.at} yaw={base + turn} t={t} pose={{ ...(s.preset.pose ?? {}), headYaw: lk.headYaw, headNod: nod, twist: lk.twist }} face={{ mouth: "flat", eyes: aw && t > aw[0] + 0.2 ? "down" : "open" }} />;
    })}
  </>
);

// ------------------------------------------------------------------ one 3D frame (S01-S14)
const EpView: React.FC<{ t: number; tex: ReturnType<typeof useChanTextures> }> = ({ t, tex }) => {
  const shot = shotOf(t);
  const st = stageAt(t, shot);
  const { chars, phone, glow } = charsAt(t);
  const drawn = st.chars ? chars : [];
  const place = st.place;
  const inHouse = place === "bath" || place === "kitchen";
  const ext = place === "gang" || place === "street";
  const mon = monitorsAt(t);
  const mood = ext ? NIGHT_EXT6 : NIGHT_INT;
  const charMood = place === "bath" ? charScaled(NIGHT_INT, 0.4) : place === "kitchen" ? charScaled(NIGHT_INT, 0.35) : place === "room" ? charScaled(NIGHT_INT, 0.25 + 0.35 * mon) : mood;
  const occ = drawn.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={mood} cam={st.cam} t={t} focus={st.focus} blur={0.5} exposure={st.exposure} sky={ext || place === "room"}>
        {place !== "room" || shot === "S08a" ? (
          <HouseInterior tamuLamp={0} t={t} light="local" moon={place === "bath" ? 0 : 0.55} moonReach={3.0} dressing vent="lit2" backBolt={boltAt(t)} backDoorOpen={backDoorAt(t)} noFan bathDoor={bathDoorAt(t)} windowGlass={ext ? "clear" : "opaque"} />
        ) : null}
        {ext || place === "room" ? <StreetSet t={t} tamuLit={0} house7="none" neighbourDoorsOpen={1} light="local" dense gangWall={false} /> : null}
        {place === "gang" || place === "room" || (place === "kitchen" && shot !== "S04a") ? <GangSet ledOn={gangLedAt(t)} /> : null}
        {place === "gang" || place === "room" ? <ToaRoom doorOpen={roomDoorAt(t)} lock={padlockAt(t)} showKey={t >= SH.S07a[0]} haspAngle={lockFrame(t).haspAngle} lever={leverAt(t)} monitors={mon} deskCam tex={tex} /> : null}
        {shot === "S06b" || shot === "S13" ? <Villagers t={t} react={shot === "S13"} /> : null}
        {inHouse ? LEDS.map((k) => <HiddenCam key={k} id={k} on={1} />) : null}
        {/* v5: the guard, a whole body in the gang (uniform sleeves, gloves); the key in his glove, then in Uq's palm (S05) */}
        {(() => { const g = st.chars ? guardAt(t) : null; return g ? <><Npc preset={SATPAM} position={g.root} yaw={g.yaw} t={t} pose={g.pose as never} face={{ mouth: "flat", eyes: "open" }} /><GuardWear root={g.root} yaw={g.yaw} h={g.h} pose={g.pose} point={g.point} /></> : null; })()}
        {(() => { const k = st.chars ? keyAt(t) : null; return k ? <KeyTag p={k.o} r={[0, -Math.PI / 2, 0]} /> : null; })()}
        {drawn.map((c, i) =>
          c.who === "uq" ? (
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose as never} hands={c.hands as never} legPose={c.legPose as never} face={c.face as never} />
          ) : (
            <Npc key={i} preset={AD_PRESET} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...(c.pose as object) }} legPose={c.legPose as never} face={c.face as never} />
          ),
        )}
        {phone && drawn.length ? <PhoneV3 p={phone.p} q={phone.q} /> : null}
        {phone && drawn.length ? <PhoneScreen004 p={phone.p} q={phone.q} glow={glow} /> : null}
        {place === "bath" && phone && drawn.length ? <pointLight position={[phone.p[0] + 0.14, phone.p[1] + 0.12, phone.p[2] - 0.12]} color="#cfe0ff" intensity={2.2 * glow} distance={1.6} decay={2} /> : null}
        {/* the toa room: the monitors are the light (they come on at monitorsOn); before that a faint moon through the door */}
        {place === "room" || shot === "S07b" ? <pointLight position={[8.2, 1.45, -9.05]} color="#9ab0ff" intensity={0.15 + 1.6 * mon} distance={2.8} decay={2} /> : null}
        {drawn.length ? <CharLight chars={drawn} cam={st.cam.pos} mood={charMood} /> : null}
        {shot === "S06b" || shot === "S13" ? <CastLight at={[-0.6, 1.3, 6.2]} cam={st.cam.pos} mood={NIGHT_EXT6} /> : null}
      </View>
      {inHouse ? LEDS.map((k) => <Halo key={k} c={st.cam} p={ledWorld(k)} on={1} d={HALO_BY_LED[k]} occ={occ} />) : null}
      {st.dim ? <AbsoluteFill style={{ background: `rgba(5,5,10,${st.dim})` }} /> : null}
    </AbsoluteFill>
  );
};

export const Episode006: React.FC<{ hud?: boolean }> = ({ hud = false }) => {
  const ready = useFonts();
  const tex = useChanTextures();
  const f = useCurrentFrame();
  const t = f / 30;
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  const shot = shotOf(t);
  const s15 = SH.S15[0];
  // v1 QC: the picture cut came one frame late (3.433 s) through rounding of the plan times; count WHOLE FRAMES from the
  // first frame of S15, as v0f does (cut on frame 102 = 3.400 s)
  const u = (f - Math.round(s15 * 30)) / 30;
  const ui = shot === "S08b" || shot === "S09" || shot === "S10b";
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      {shot === "S15" ? (u < CLOSE_T.cut - 1e-6 ? <CloseView006 t={u} /> : null) : ui ? null : <EpView t={t} tex={tex} />}
      {shot === "S01" ? <PhoneUI006 t={t} shot="S01" span={[SH.S01[0], SH.S01[1]]} type={P("type")} send={T("send")} /> : null}
      {shot === "S03" ? <PhoneUI006 t={t} shot="S03" span={[SH.S03[0], SH.S03[1]]} msgAt={T("photo")} vib={undefined} /> : null}
      {shot === "S02" ? <CardsAB t={t} items={PLAN.recapChoices} inAt={EV.recap.in} click={{ index: 1, at: EV.recap.click }} outAt={EV.recap.out} outDur={EV.recap.fade} /> : null}
      {shot === "S08b" ? <MonitorGrid006 t={t} span={[SH.S08b[0], SH.S08b[1]]} /> : null}
      {shot === "S09" ? <TextBox006 t={t} span={[SH.S09[0], SH.S09[1]]} text="Kamu melihat semuanya." type={P("type1")} speech={[...VOP.N05.speech, [T("echo") + 0.14, T("echo") + 1.85]]} /> : null}
      {shot === "S10b" ? <TextBox006 t={t} span={[SH.S10b[0], SH.S10b[1]]} text="Kamu akan memilih…" type={P("type2")} speech={VOP.N06.speech} panel={T("panel")} /> : null}
      {shot === "S15" ? <GlitchTamat006 u={u} frame={f} cut={CLOSE_T.cut - 1e-6} glitchIn={CLOSE_T.tamatIn - 1e-6} full={CLOSE_T.tamatFull} /> : null}
      <DayLabel5 t={t} />
      <Captions005 t={t} pages={PAGES006} />
      {hud ? (
        <div style={{ position: "absolute", left: 24, top: 24, fontFamily: "Poppins", fontSize: 26, fontWeight: 600, color: "#ffe9a0", textShadow: "0 2px 0 #000" }}>
          {shot} · {t.toFixed(2)} s · f{f}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
