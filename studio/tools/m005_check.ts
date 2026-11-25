// Episode 4 (2026-11-005) opening animatic: numbers for the reach, the carry, the press and the cloth (owner 2026-11-23).
// Run from studio/:
//   npx esbuild tools/m005_check.ts --bundle --platform=node --log-level=warning --outfile=out/m005_check.cjs && node out/m005_check.cjs
import * as THREE from "three";
import { c1ArmTorsoDepth } from "../src/c1/bodyIk";
import { H_AD, H_UQ } from "../src/ep004/motion004";
import {
  AD_KEYS, CAM_T_BODY, CLOTH_HANG, DEST, EV, FAN_LEN, HEAD_AIM, LENS_T, SOFA_DROP, STAND, UQ_KEYS, YAW_DEST, adArmAt, fanAt, frameAt, handWorld, shoulderWorld, uqArmAt,
} from "../src/ep005/motion005";
import { movesAt } from "../src/cast/stepper";
import { UQ_MOVES, AD_MOVES } from "../src/ep005/motion005";

const f2 = (x: number) => x.toFixed(2), f3 = (x: number) => x.toFixed(3);
const D2R = Math.PI / 180;
const ARM = 0.332 * 1.5; // upper + fore (h units 0.175 + 0.157) x Uq height 1.5
console.log("== Positions");
console.log("STAND (Uq at the fan)", STAND.map(f3).join(", "), "| DEST (Uq under the corner)", DEST.map(f3).join(", "), "| yaw dest", f2(YAW_DEST / D2R), "deg");
console.log("lens T", LENS_T.map(f3).join(", "), "| housing", CAM_T_BODY.join(", "), "| disc centre aimed", HEAD_AIM.map(f3).join(", "));
console.log("wall clearance at DEST (root to inner face minus body radius 0.22): east", f3(0.94 - DEST[0] - 0.22), "m, south", f3(2.94 - DEST[2] - 0.22), "m");

console.log("\n== IK keys (error = palm to target)");
for (const [k, v] of Object.entries(UQ_KEYS)) console.log("Uq", k, "err", f3(v.err), "m  q", v.q.map(f2).join(","));
for (const [k, v] of Object.entries(AD_KEYS)) console.log("adik", k, "err", f3(v.err), "m  q", v.q.map(f2).join(","));
const sh = (m: ReturnType<typeof movesAt>, h: number) => shoulderWorld("L", m.root, m.yaw, h);
for (const [name, t, tgt] of [["pole", 2.9, [0.55, 0.85, -0.55]], ["press", 7.85, null]] as const) {
  const m = movesAt(UQ_MOVES, t);
  const s = sh(m, H_UQ);
  const hand = handWorld(uqArmAt(t), "L", m.root, m.yaw, H_UQ);
  console.log(`reach ${name}: shoulder y ${f2(s.y)} | shoulder to palm ${f3(s.distanceTo(hand))} m of arm ${f3(ARM)} m (slack ${f3(ARM - s.distanceTo(hand))})`, tgt ? "" : "");
}
console.log("Uq max hand height (straight up, rig):", f2(handWorld([180, 0, 0], "L", [0, 0, 0], 0, H_UQ).y), "m (palm, from the floor)");
{
  const m = movesAt(AD_MOVES, 1.5);
  const s = shoulderWorld("L", m.root, m.yaw, H_AD);
  console.log("adik drop target", SOFA_DROP.map(f2).join(","), "shoulder to target", f3(s.distanceTo(new THREE.Vector3(...SOFA_DROP))), "m of arm", f3(0.332 * H_AD));
}

console.log("\n== Per frame, 0 .. 10 s");
let maxStepU = 0, maxStepA = 0, tU = 0, tA = 0, depthU = -9, depthA = -9, minCC = 9, minCCt = 0, minBase = 9, maxSpeedU = 0, maxSpeedA = 0, sofaMin = 9, fanFloorMove = 0;
let prev = frameAt(0), prevQU = uqArmAt(0), prevQA = adArmAt(0);
let crossU = 9, crossA = 9;
for (let f = 1; f <= 291; f++) {
  const t = f / 30;
  const fr = frameAt(t);
  const qu = uqArmAt(t), qa = adArmAt(t);
  const su = Math.hypot(qu[0] - prevQU[0], qu[1] - prevQU[1], qu[2] - prevQU[2]), sa = Math.hypot(qa[0] - prevQA[0], qa[1] - prevQA[1], qa[2] - prevQA[2]);
  if (su > maxStepU) { maxStepU = su; tU = t; }
  if (sa > maxStepA) { maxStepA = sa; tA = t; }
  const du = c1ArmTorsoDepth(qu, "L", H_UQ) * 100, da = c1ArmTorsoDepth(qa, "L", H_AD) * 100;
  depthU = Math.max(depthU, du); depthA = Math.max(depthA, da);
  const [u, a] = fr.chars, [pu, pa] = prev.chars;
  const cc = Math.hypot(u.root[0] - a.root[0], u.root[2] - a.root[2]);
  if (cc < minCC) { minCC = cc; minCCt = t; }
  maxSpeedU = Math.max(maxSpeedU, Math.hypot(u.root[0] - pu.root[0], u.root[2] - pu.root[2]) * 30);
  maxSpeedA = Math.max(maxSpeedA, Math.hypot(a.root[0] - pa.root[0], a.root[2] - pa.root[2]) * 30);
  sofaMin = Math.min(sofaMin, a.root[2] - (-0.175) - 0.16);
  if (fr.fan.held) minBase = Math.min(minBase, fr.fan.base[1]);
  if (!fr.fan.held && f > 1) fanFloorMove = Math.max(fanFloorMove, Math.hypot(fr.fan.base[0] - prev.fan.base[0], fr.fan.base[2] - prev.fan.base[2]));
  // feet: the rig-L ankle must stay left of rig-R in the body frame (no crossing): sign of (R - L) along the body's left
  for (const [c, setx] of [[u, "u"], [a, "a"]] as const) {
    const left = new THREE.Vector3(Math.cos(c.yaw), 0, -Math.sin(c.yaw));
    const d = new THREE.Vector3(c.feet.R[0] - c.feet.L[0], 0, c.feet.R[2] - c.feet.L[2]).dot(left) * 100;
    if (setx === "u") crossU = Math.min(crossU, d); else crossA = Math.min(crossA, d);
  }
  prev = fr; prevQU = qu; prevQA = qa;
}
console.log(`Uq right arm: max joint step ${f2(maxStepU)} deg/frame at ${f2(tU)} s (limit 11.1) | max arm-in-torso ${f2(depthU)} cm (limit 0.2)`);
console.log(`adik right arm: max joint step ${f2(maxStepA)} deg/frame at ${f2(tA)} s (limit 7.1) | max arm-in-torso ${f2(depthA)} cm (limit 0.0)`);
console.log(`root speed max: Uq ${f2(maxSpeedU)} m/s, adik ${f2(maxSpeedA)} m/s (Ep 3 retreat reference ≈ 0.4–0.7 m/s)`);
console.log(`Uq-adik root distance min ${f2(minCC)} m at ${f2(minCCt)} s (body radii 0.22 + 0.16 = 0.38)`);
console.log(`adik root to sofa front edge minus radius: min ${f3(sofaMin)} m`);
console.log(`foot separation (rig R minus rig L along own left; negative = crossed): Uq min ${f2(crossU)} cm, adik min ${f2(crossA)} cm`);
console.log(`fan base min height while held ${f3(minBase)} m (carry must clear the floor); fan on floor before grab moved ${f3(fanFloorMove)} m`);

console.log("\n== Fan, press and cloth");
for (const t of [2.5, 2.95, 3.5, 4.5, 6.3, 7.0, 7.5, 7.85, 8.4, 8.8, 9.1, 9.7]) {
  const fan = fanAt(t);
  const head = new THREE.Vector3(...fan.head);
  console.log(`t ${f2(t)} hand y ${f2(fan.hand[1])} base y ${f2(fan.base[1])} head centre ${fan.head.map(f2).join(",")} grip g ${f2(fan.g)} | head-to-lens ${f3(head.distanceTo(new THREE.Vector3(...LENS_T)))} m`);
}
{
  const fan = fanAt(EV.press);
  const head = new THREE.Vector3(...fan.head);
  const lens = new THREE.Vector3(...LENS_T);
  const to = lens.clone().sub(head);
  const hoz = Math.hypot(to.x, to.z), vert = Math.abs(to.y);
  console.log(`PRESS ${f2(EV.press)} s: lens relative to the disc centre: horizontal ${f3(hoz)} m, vertical ${f3(vert)} m (disc radius ${FAN_LEN.headR} m) → ${hoz < 0.14 && vert < FAN_LEN.headR ? "lens inside the disc" : "lens NOT covered by the disc"}`);
  const top = new THREE.Vector3(...fan.head).addScaledVector(new THREE.Vector3(...fan.a), 0.2);
  console.log(`fan head top (cloth on it) ${top.toArray().map(f2).join(",")} vs housing top ${(CAM_T_BODY[1] + 0.02).toFixed(3)} (housing centre y ${CAM_T_BODY[1]})`);
}
{
  // hanging cloth covers the lens? plane facing the room along (-0.707, 0, -0.707); tangent = (0.707, 0, -0.707)
  const n = new THREE.Vector3(-0.7071, 0, -0.7071), tg = new THREE.Vector3(0.7071, 0, -0.7071);
  const rel = new THREE.Vector3(...LENS_T).sub(new THREE.Vector3(...CLOTH_HANG.c));
  const dn = rel.dot(n), dt = rel.dot(tg), dy = rel.y;
  console.log(`hanging cloth: lens is ${f3(-dn)} m behind the cloth plane, ${f3(dt)} m sideways, ${f3(dy)} m vertical from the cloth centre (cloth ${CLOTH_HANG.w} x ${CLOTH_HANG.h} m) → ${Math.abs(dt) < CLOTH_HANG.w / 2 && Math.abs(dy) < CLOTH_HANG.h / 2 && dn < 0 ? "lens covered" : "NOT covered"}`);
}
console.log("\nGrip slide along the pole: from 0.55 to 0.02 within", f2(EV.lift[1] - EV.lift[0] - 0.1), "s = ", f2((0.55 - 0.02) / (EV.lift[1] - EV.lift[0] - 0.1)), "m/s (HYPOTHESIS: reads as a fumble, not a lift)");
