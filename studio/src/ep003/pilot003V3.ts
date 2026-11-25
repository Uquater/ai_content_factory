// Episode 2026-11-003 — pilot S03–S06 v3 (owner 2026-11-18: D-040 + lit2 + flashback option A approved; +0.55 s before
// the toa rejected; D-042 pending): v2 plus lifted steps (P4), S05 cut + jolt on the toa switch-on over the tail of N03
// (face before "Dapur"), a wider glass insert in which the beam slides up into the glass, the flashback cut from the
// same footage. Plan: `scripts/ep003_pilot_audio.py plan --toa-gap 0.65 --klik --toa-open-lead -0.15`.
import { buildPilot003, VAR3 } from "./pilot003Stage";
import type { PlanJson } from "./pilot003Stage";
import PLAN_V3 from "./pilot003-plan-v3.json";

export const P3 = buildPilot003(PLAN_V3 as PlanJson, VAR3);
