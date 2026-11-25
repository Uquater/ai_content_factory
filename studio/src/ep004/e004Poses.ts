// Episode 3 (2026-11-004) — poses shared by look-dev and the numeric checks. Pure functions, cached.
// S02 uses the FALLBACK (owner rule 2026-11-20, D-048): Uq's right hand over adik's mouth failed the numbers
// (tools/e004_mouth_check.ts), so adik covers her own mouth with her LEFT hand (rig side "R") and Uq's RIGHT hand
// (side "L") rests on her left shoulder. Passing variant: adik 0.25 m further from Uq than at the end of Ep 2
// (root gap 0.39 → 0.64 m), same facing (the window). The cut from the S01 insert hides the step.
import * as THREE from "three";
import { stickHeadCenter, stickHeadTop } from "../c1/C1";
import { c1ArmIK } from "../c1/bodyIk";
import { C1_BUILD } from "../c1/c1rig";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import { END, episodeAt } from "../ep003/episode003Stage";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const fwd = (yaw: number) => new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));

/** the last frame of Episode 2 (S12): both at Episode 1's A17 spots, facing the window, hand in hand */
export const EP2_END = episodeAt(END - 1 / 30);
const uqEnd = EP2_END.chars.find((c) => c.who === "uq")!;
const adEnd = EP2_END.chars.find((c) => c.who === "adik")!;

export const MOUTH_SHIFT = 0.045; // m: v2 0.02 (D-050), v3 0.045 (D-051 allows up to 4.5 cm); a ~5 px end of the mouth line still shows
/** IK preference for adik's hand-to-mouth arm (v3 test: the arm plane decides how the oval hand lies on the mouth) */
export const MOUTH_REF: [number, number, number] = [40, 100, 30];
export const MOUTH_WMIN = -60;
export const S02_AWAY = 0.25; // m, adik's step away from Uq (fallback, passing variant)
export const S02 = (() => {
  const away = new THREE.Vector3(adEnd.root[0] - uqEnd.root[0], 0, adEnd.root[2] - uqEnd.root[2]).normalize();
  const root: V3 = [adEnd.root[0] + away.x * S02_AWAY, 0, adEnd.root[2] + away.z * S02_AWAY];
  const h = adEnd.height;
  const hc = new THREE.Vector3(...stickHeadCenter(root, h));
  const R = (new THREE.Vector3(...stickHeadTop(root, h)).y - hc.y) * 1.06;
  const dm = fwd(adEnd.yaw).multiplyScalar(Math.cos(0.34)).add(new THREE.Vector3(0, -Math.sin(0.34), 0)).normalize();
  // v2 (D-050): 1.5 cm toward HER LEFT (v1 palm sat on her right cheek seen from lens P); her left = (cos yaw, 0, -sin yaw)
  const mouth = hc.clone().add(dm.multiplyScalar(R + 0.013)).add(new THREE.Vector3(Math.cos(adEnd.yaw), 0, -Math.sin(adEnd.yaw)).multiplyScalar(MOUTH_SHIFT));
  const a = c1ArmIK({ root, yaw: adEnd.yaw, body: {}, side: "R", target: [mouth.x, mouth.y, mouth.z], ref: MOUTH_REF, height: h, avoidTorso: true, wMin: MOUTH_WMIN });
  const adPose = { ...(adEnd.pose as object), armR: a.arm, armRFwd: a.fwd, headNod: -4, headYaw: 20 };
  // her left shoulder (rig side "R"), 5 cm up and 4 cm back: Uq's palm rests on top of it
  const { S } = armChain(adPose as never, "R", LAY);
  const sh = S.clone().multiplyScalar(h).applyAxisAngle(UP, adEnd.yaw).add(new THREE.Vector3(...root)).add(new THREE.Vector3(0, 0.05, 0)).add(fwd(adEnd.yaw).multiplyScalar(-0.04));
  const u = c1ArmIK({ root: uqEnd.root, yaw: uqEnd.yaw, body: {}, side: "L", target: [sh.x, sh.y, sh.z], ref: [20, 40, 0], avoidTorso: true, wMin: -90 });
  const uq = { ...uqEnd, pose: { ...(uqEnd.pose as object), armL: u.arm, armLFwd: u.fwd, headYaw: -35, headNod: 4 }, face: { eyes: "open" as const, brows: "worried" as const, mouth: "flat" as const, look: -0.5 } };
  const adik = { ...adEnd, root, pose: adPose, face: { eyes: "open" as const, brows: "raised" as const, mouth: "flat" as const } };
  return { uq, adik, phone: EP2_END.phone, err: { adik: a.err, uq: u.err }, q: { adik: [a.arm[0], a.arm[1], a.fwd], uq: [u.arm[0], u.arm[1], u.fwd] } };
})();

/** R1 = the spot after the ±1 m retreat (storyboard S10) */
export const R1 = { uq: [-1.55, 0, 1.0] as V3, adik: [-1.95, 0, 1.1] as V3 };
