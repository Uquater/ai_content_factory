// Episode 3 (2026-11-004) motion TEST clips (D-053): the four untested motions staged by motion004.ts, drawn with the
// same set, light, cast and LED/halo components as Pilot004 (no captions, no audio, no cards). For frame strips and
// 1:1 crops only — not an episode render. Variant "usulan" = PROPOSED staging, "storyboard" = storyboard literal.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C1 } from "../c1/C1";
import { Npc } from "../cast/npc";
import { View } from "../inkbeat/core/View";
import { ADIK_B } from "../ep002/castV3";
import { C1_BODIED } from "../ep002/LookDev";
import { HouseInterior } from "../ep002/sets";
import { CharLight, NIGHT_INT, PhoneV3 } from "../ep003/LookDev003";
import { Halo, HALO_BY_LED, HiddenCam, ledWorld } from "./LookDev004";
import { buildClips, PROPOSED } from "./motion004";
import type { ClipId } from "./motion004";
import { d054Opts } from "./motion004d054";
import { d055Opts } from "./motion004d055";

const BUILT = { usulan: buildClips(PROPOSED), storyboard: buildClips({}), d054: buildClips(d054Opts()), d055: buildClips(d055Opts()) };
/** D-055 diagnosis of the dark spot on adik's hand (insert 0.4–0.6 s), passed with --props only: colour-tag her shirt,
 * pants or jacket, drop CharLight, or hide Uq. Not used by any registered default. */
export type M004Diag = "shirt" | "pants" | "jacket" | "nolight" | "nouq" | "nomoon";
export type M004Props = { clip: ClipId; variant: keyof typeof BUILT; diag?: M004Diag };
export const M004_LIST: M004Props[] = [
  { clip: "mundur", variant: "usulan" },
  { clip: "balik", variant: "usulan" },
  { clip: "balik", variant: "storyboard" },
  { clip: "genggam", variant: "usulan" },
  { clip: "genggam", variant: "storyboard" },
  { clip: "tatap", variant: "usulan" },
  // D-054: hand insert I15, the two-shot right after the cut, and the stare with the new S15 timing
  { clip: "insert", variant: "d054" },
  { clip: "dua", variant: "d054" },
  { clip: "tatap2", variant: "d054" },
  // D-055: S10 retreat option (c) step-close incl. the turn to the hallway, insert I15 2.0 s, two-shot and stare (plan d055)
  { clip: "mundur", variant: "d055" },
  { clip: "insert", variant: "d055" },
  { clip: "dua", variant: "d055" },
  { clip: "tatap2", variant: "d055" },
];
export const m004Frames = (p: M004Props) => Math.round(BUILT[p.variant].CLIPS[p.clip].dur * 30) + 1;
const LEDS = ["T", "D", "L", "K"] as const;

const adikPreset = (d?: M004Diag) =>
  d === "shirt" ? { ...ADIK_B, shirt: { color: "#20ff20", dark: "#10c010", cuff: "#10a010" } }
  : d === "pants" ? { ...ADIK_B, limbs: { ...ADIK_B.limbs!, pants: "#2040ff" }, pants: { ...ADIK_B.pants!, color: "#2040ff", dark: "#1030c0" } }
  : d === "jacket" && ADIK_B.accessory ? { ...ADIK_B, accessory: { ...ADIK_B.accessory, color: "#ff20ff", dark: "#c010c0" } as typeof ADIK_B.accessory }
  : ADIK_B;
export const Motion004: React.FC<M004Props> = ({ clip, variant, diag }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fr = BUILT[variant].CLIPS[clip].at(t);
  const occ = fr.chars.map((c) => ({ root: c.root, height: c.height, who: c.who }));
  return (
    <AbsoluteFill>
      <View mood={NIGHT_INT} cam={fr.cam} t={t}>
        <HouseInterior tamuLamp={0} t={t} light="local" moon={diag === "nomoon" ? 0 : 0.55} moonReach={3.0} dressing vent="lit2" backBolt={1} backDoorShake={0} />
        {LEDS.map((k) => <HiddenCam key={k} id={k} on={fr.led[k]} />)}
        {fr.chars.map((c, i) =>
          c.who === "uq" ? (diag === "nouq" ? null :
            <C1 key={i} look={C1_BODIED} position={c.root} yaw={c.yaw} t={t} pose={c.pose as never} hands={c.hands as never} legPose={c.legPose as never} face={c.face as never} />
          ) : (
            <Npc key={i} preset={adikPreset(diag)} position={c.root} yaw={c.yaw} t={t} pose={{ ...(ADIK_B.pose ?? {}), ...(c.pose as object) }} legPose={c.legPose as never} face={c.face as never} />
          ),
        )}
        <PhoneV3 p={fr.phone.p} q={fr.phone.q} />
        {diag === "nolight" ? null : <CharLight chars={fr.chars} cam={fr.cam.pos} mood={NIGHT_INT} />}
      </View>
      {LEDS.map((k) => <Halo key={k} c={fr.cam} p={ledWorld(k)} on={fr.led[k]} d={HALO_BY_LED[k]} occ={occ} />)}
    </AbsoluteFill>
  );
};
