// Episode 2026-11-003 — pilot S03–S06 v2 (owner note 2026-11-18, D-041 pending): the same stage as v1
// (pilot003Stage.ts) with the S03 glass insert, the S06 flashback + glass-now-dark, a longer glass hold in the sweep,
// and the plan from `scripts/ep003_pilot_audio.py plan --toa-gap 1.20` (+0.55 s before the toa for its switch-on).
// D-040 (S06 camera, S03 pan, adik position) is still pending: v2 keeps the v1 values as interim, not as approved.
import { buildPilot003, V2 } from "./pilot003Stage";
import type { PlanJson } from "./pilot003Stage";
import PLAN_V2 from "./pilot003-plan-v2.json";

export const P2 = buildPilot003(PLAN_V2 as PlanJson, V2);
