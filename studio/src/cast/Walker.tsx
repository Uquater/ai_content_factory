// Walker (D-027): a villager preset (or IBU carrying BALITA) driven by walk.ts — walk, slow down, stop, turn the head.
// Pure function of t. Used by the 2026-11-002 animatic and the walk test.
import React from "react";
import type { C1Face } from "../c1/C1";
import { IbuGendong } from "./carry";
import { Npc } from "./npc";
import type { NpcPreset } from "./npc";
import { lookTurn, walkState } from "./walk";
import type { Gait, WalkPlan } from "./walk";

export type Look = { t0: number; deg: number; dur?: number };
export const Walker: React.FC<{
  preset?: NpcPreset;
  carry?: boolean;
  gait: Gait;
  plan: WalkPlan;
  t: number;
  look?: Look;
  face?: C1Face;
  /** arms that keep the preset pose (e.g. the jacket arm) instead of swinging */
  keep?: ("L" | "R")[];
  /** carry: optional mom / kid presets (bodied looks, 2026-11-17); default IBU / BALITA */
  carryPresets?: { mom: NpcPreset; kid: NpcPreset };
}> = ({ preset, carry, gait, plan, t, look, face, keep = [], carryPresets }) => {
  const w = walkState(gait, plan, t);
  const lk = look ? lookTurn(t, look.t0, look.deg, look.dur) : { headYaw: 0, twist: 0 };
  if (carry) {
    return (
      <IbuGendong
        mom={carryPresets?.mom}
        kid={carryPresets?.kid}
        position={w.position}
        yaw={w.yaw}
        t={t}
        motion={{
          legPose: w.legPose,
          armL: w.pose.armL,
          armLFwd: w.pose.armLFwd,
          headYaw: w.pose.headYaw * 0.5 + lk.headYaw + lk.twist,
          headNod: w.pose.headNod,
          // the toddler's head follows its mother's turn a beat later and less
          kidHeadYaw: look ? lookTurn(t, look.t0 + 0.35, look.deg * 0.6, (look.dur ?? 0.7) * 1.2).headYaw : 0,
          kidHeadNod: w.pose.headNod * 0.6,
          face,
        }}
      />
    );
  }
  if (!preset) return null;
  const base = preset.pose ?? {};
  const pose = {
    ...base,
    ...(keep.includes("L") ? {} : { armL: w.pose.armL, armLFwd: w.pose.armLFwd }),
    ...(keep.includes("R") ? {} : { armR: w.pose.armR, armRFwd: w.pose.armRFwd }),
    twist: w.pose.twist + lk.twist,
    roll: w.pose.roll,
    headYaw: w.pose.headYaw + lk.headYaw,
    headNod: w.pose.headNod,
  };
  return <Npc preset={preset} position={w.position} yaw={w.yaw} t={t} legPose={w.legPose} pose={pose} face={face} />;
};
