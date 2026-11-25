// Episode 3 (2026-11-004), D-056/D-057: test compositions for the new full-episode shots, one per shot ("Ep004Shot-<id>"),
// frame → episode time = shot start + frame / 30 (episode004-plan-d055.json). Image sequences for QC only — not an
// episode render (owner: no preview render yet). Same set, light, cast, LED/halo components as Pilot004 and the motion
// tests. POV shots (S11, S12) are Uq's eye: his own body is not drawn. No captions/audio (shot tests).
// D-057: the Ep 3 door-frame cover (jambCover004.tsx) and the slotted back-door knob at rest (as pilot S01) are drawn in
// every shot; the phone UI (S06, S14), the lit phone screen (S05–S07) and the final choice cards (S15) are overlays here.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { useFonts } from "../inkbeat/core/frame";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { CardsEp1 } from "../ep003/Episode003";
import { Halo, HALO_BY_LED, HiddenCam, KnobSlot, ledWorld } from "./LookDev004";
import { charsAt, EV55, ledsAt, SHOT_IDS, SHOTS55, stage55 } from "./episode004Stage";
import { JambCovers004 } from "./jambCover004";
import { PhoneScreen004, PhoneUI004 } from "./overlay004";

const LEDS = ["T", "D", "L", "K"] as const;
export const E004_SHOTS = SHOT_IDS.map((id) => ({ id, frames: Math.round(SHOTS55[id][2] * 30) }));
/** final choice cards (owner D-056 item 8 / D-057 item 7): Ep 1 style, two side by side at the top, no A/B labels */
export const FINAL_CHOICES = ["balas pesan itu", "tutup kameranya"];

/** diag (only via --props): moon strength override (D-056); jambs=false = without the D-057 door-frame cover ("before") */
export const Ep004Shot: React.FC<{ id: string; moon?: number; jambs?: boolean; noChars?: boolean }> = ({ id, moon, jambs = true, noChars = false }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const t = SHOTS55[id][0] + f / 30;
  const st = stage55(t);
  const { chars: all, phone, glow } = charsAt(t);
  const chars = noChars || st.chars === false ? [] : st.pov ? all.filter((c) => c.who !== "uq") : all; // noChars: diag only (D-057 sofa speck)
  const led = ledsAt(t);
  const occ = chars.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  if (!ready) return <AbsoluteFill style={{ background: "#05050a" }} />;
  return (
    <AbsoluteFill style={{ background: "#05050a" }}>
      <View mood={NIGHT_INT} cam={st.cam} t={t} focus={st.focus} blur={st.blur}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={moon ?? 0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} />
        {jambs ? <JambCovers004 /> : null}
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
      {st.shot === "S06" || st.shot === "S14" ? <PhoneUI004 t={t} shot={st.shot} /> : null}
      {st.shot === "S15" ? <CardsEp1 t={t} items={FINAL_CHOICES} inAt={EV55.final_cards as number} /> : null}
    </AbsoluteFill>
  );
};
