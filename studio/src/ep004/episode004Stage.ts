// Episode 3 (2026-11-004), FULL EPISODE stage for the shots the pilot does not have (D-056, owner 2026-11-20, tahap 2).
// A pure function of EPISODE time on the approved working timeline episode004-plan-d055.json (69.15 s). The pilot shots
// (S01, S02, S08a, S08, S09) stay in pilot004Stage.ts and are not touched here.
// Group A (this file, first): S10 retreat (option (c) step-close, D-055 variant — the D-056 hand iteration did not pass,
// owner rule: keep it, the touch is a preview risk), the turn to the hallway (0.70 s), S11 and S12 POVs (Uq's eye).
// Characters come from motion004.ts (the tested chain); this file only maps episode time to it and adds the head turns
// of S12/S13 and the cameras.
import type { Cam } from "../inkbeat/core/rig";
import type { V3 } from "../inkbeat/types";
import * as THREE from "three";
import { buildClips, U1 as R1U } from "./motion004";
import type { MChar } from "./motion004";
import { d055Opts, S10C_PASS } from "./motion004d055";
import { ledWorld } from "./LookDev004";
import P55 from "./episode004-plan-d055.json";
import { charsB, stageB } from "./episode004B";

export const FPS = 30;
export const SHOTS55 = P55.shots as unknown as Record<string, [number, number, number]>;
export const EV55 = P55.events as unknown as Record<string, number | [number, number]>;
const ev = (k: string) => EV55[k] as number;
const span = (k: string) => EV55[k] as [number, number];
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];

// ------------------------------------------------------------------ characters: the tested S10 chain, retimed for S13
const S10_0 = SHOTS55.S10[0];
/** the S13 turn back (hallway → front, 1.1 s) on the plan's timeline: 52.72–53.82 s (L9 end), D-053 */
const BACK: [number, number] = [span("L9")[1] - S10_0, span("L9")[1] + 1.1 - S10_0];
/** S10 step-close: cycles per character are the knob to tune after the preview (owner D-056: the 46–48 cm straddle is
 * accepted for now). Step length = path / cycles: Uq 0.97 m / 3 = 0.32 m, adik 1.06 m / 3 = 0.35 m. */
export const S10_CYCLES: [number, number] = S10C_PASS.cycles;
// to tune by step length instead: cyclesFor(0.97, stepLenUq), cyclesFor(1.06, stepLenAdik) from ./shuffle004
const BUILT = buildClips({ ...d055Opts("lama"), s10c: { ...S10C_PASS, cycles: S10_CYCLES, backT: BACK } });
export const CLIPS55 = BUILT.CLIPS;

/** S12 heads toward the bedroom door (POV S12: −59.5° from the hallway body, clamped −55°, D-053), back in S13 before
 * the turn, and the head lead into the turn back (as the tested clip "balik") */
const headExtra = (t: number) => {
  const kamar = ramp(t, ev("LED4_click") + 0.05, ev("LED4_click") + 0.45) * (1 - ramp(t, ev("toa_open2") + 0.2, ev("toa_open2") + 0.75));
  const b0 = BACK[0] + S10_0;
  const lead = -25 * (ramp(t, b0 - 0.25, b0) - ramp(t, b0 + 0.4, b0 + 1.0));
  return { u: lead - 55 * kamar, a: lead * 0.8 - 50 * kamar };
};
export type CharsAt = { chars: MChar[]; phone: { p: V3; q: [number, number, number, number] }; glow: number };
export const charsAt = (t: number): CharsAt => {
  // D-057: group B (before the pilot's S08a) and S15 (from the insert I15) have their own staging
  if (t < SHOTS55.S08a[0]) return charsB(t);
  if (t >= SHOTS55.I15[0] - 1e-9) return s15Chars(t);
  const fr = CLIPS55.mundur.at(t - S10_0);
  const x = headExtra(t);
  const chars = fr.chars.map((c) => ({ ...c, pose: { ...c.pose, headYaw: ((c.pose.headYaw as number) ?? 0) + (c.who === "uq" ? x.u : x.a) } }));
  return { chars, phone: fr.phone, glow: 0 };
};

// ------------------------------------------------------------------ D-057 group C: I15 + S15 assembled from the tested clips
// I15 (59.20–61.20) = CLIPS55.insert (clipC 0–2 s, the D-055 grip, mutual look from 1.80 s); the two-shot from 61.20 continues
// clipC (match on action) to the tatap2 clip, which starts 0.4 s before the lens stare (64.25 s) already on the phone glance.
// Added here (USULAN): the glance to the phone on "membalas" (word timing by character share, ASUMSI), the look back to
// adik after the 1 s stare (owner D-048: the stare is not repeated), and head-only breathing in the holds (no frozen frames;
// not inside the insert, not during the stare).
const I0 = SHOTS55.I15[0];
const L11 = span("L11");
/** L11 "Kamu akan membalas pesan itu, atau menutup kamera di depanmu?" = 62 characters incl. one space per word */
const L11W = (n: number) => L11[0] + (n / 62) * (L11[1] - L11[0]);
export const S15_GLANCE: [number, number] = [L11W(10), L11W(10) + 0.5]; // "membalas" ≈ 62.42 s
const STARE = span("lens_stare");
const TATAP0 = STARE[0] - 0.4;
export const S15_AWAY: [number, number] = [STARE[1], STARE[1] + 0.7];
const PHONE_LOOK = { yaw: 22, nod: 24 }; // = motion004.ts PHONE_LOOK (the tatap2 clip starts there)
const MUTUAL = { yaw: -40, nod: 4, look: -0.4 }; // = motion004.ts clipC after the look ramp
const breath = (t: number, a: number, hz: number, ph: number) => a * Math.sin((t - I0) * 2 * Math.PI * hz + ph);
const s15Chars = (t: number): CharsAt => {
  const fr = t < TATAP0 ? CLIPS55.insert.at(t - I0) : CLIPS55.tatap2.at(t - TATAP0);
  const g = ramp(t, S15_GLANCE[0], S15_GLANCE[1]) * (t < TATAP0 ? 1 : 0);
  const away = ramp(t, S15_AWAY[0], S15_AWAY[1]);
  const two = ramp(t, SHOTS55.S15[0], SHOTS55.S15[0] + 0.5);
  const wU = t < STARE[0] ? two * (1 - ramp(t, TATAP0 + 0.05, STARE[0])) : ramp(t, S15_AWAY[0], S15_AWAY[1] + 0.3);
  const chars = fr.chars.map((c) => {
    const p = c.pose as Record<string, number>;
    if (c.who === "adik") return { ...c, pose: { ...c.pose, headNod: p.headNod + two * breath(t, 1.0, 0.31, 1.3) } };
    let hy = lerp(p.headYaw, PHONE_LOOK.yaw, g), hn = lerp(p.headNod, PHONE_LOOK.nod, g);
    let look = lerp(((c.face as Record<string, number>).look ?? 0), 0, g);
    hy = lerp(hy, MUTUAL.yaw, away); hn = lerp(hn, MUTUAL.nod, away); look = lerp(look, MUTUAL.look, away);
    return { ...c, pose: { ...c.pose, headYaw: hy, headNod: hn + wU * breath(t, 1.2, 0.28, 0) }, face: { ...c.face, look } };
  });
  return { chars, phone: fr.phone, glow: 0 };
};

// ------------------------------------------------------------------ LEDs (on from their click frame, as the pilot)
export const ledsAt = (t: number) => ({
  T: t >= ev("LED1_click") - 1e-6 ? 1 : 0, D: t >= ev("LED2_click") - 1e-6 ? 1 : 0,
  L: t >= ev("LED3_click") - 1e-6 ? 1 : 0, K: t >= ev("LED4_click") - 1e-6 ? 1 : 0,
});

// ------------------------------------------------------------------ cameras
const S11_EYE: V3 = [-1.55, 1.42, 1.0], S11_AIM: V3 = [-0.6, 1.95, -3.6];
const S12_EYE: V3 = [-1.5, 1.42, 0.95], S12_AIM: V3 = [2.6, 1.75, -0.45];
const ledY = (eye: V3, aim: V3, fov: number, p: V3) => {
  const c = new THREE.PerspectiveCamera(fov, 1080 / 1920, 0.01, 100);
  c.position.set(...eye); c.lookAt(new THREE.Vector3(...aim)); c.updateMatrixWorld(); c.updateProjectionMatrix();
  return (1 - new THREE.Vector3(...p).project(c).y) * 960;
};
/** owner D-056 item 5: LED-3 stays inside the frame from its click to the end of "Satu di lorong". The storyboard's
 * push (fov 32 → 26) takes it out of the top edge (y −16 px at 26). The end fov is the narrowest that keeps the LED's
 * halo (30 px) plus a 30 px margin inside: y(LED-3) = 60 px (bisection, deterministic). */
export const S11_FOV_END = (() => {
  let lo = 26, hi = 32;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (ledY(S11_EYE, S11_AIM, m, ledWorld("L")) < 60) lo = m; else hi = m; }
  return Math.round(hi * 100) / 100 + 0.01;
})();
/** S11 push: slow (~3 %/s) until the LED-3 click, a little faster after it (storyboard), reaching S11_FOV_END at the end
 * of "Satu di lorong" and holding to the cut */
export const s11Fov = (t: number) => {
  const [a, b] = [SHOTS55.S11[0], span("L8b")[1]];
  const c = ev("LED3_click");
  const kC = 0.4; // share of the push done by the LED-3 click
  // v2 (D-056 QC): after the click a cubic Hermite that STARTS with the slow segment's speed and ends at rest (v1 used a
  // smoothstep from zero speed: the push stalled at f93–f94, −0.0168 → −0.0042°/frame)
  const v0 = (kC / (c - a)) * (b - c), x = clamp01((t - c) / (b - c));
  const g = t <= c ? kC * clamp01((t - a) / (c - a)) : kC + v0 * (x * x * x - 2 * x * x + x) + (1 - kC) * (-2 * x * x * x + 3 * x * x);
  return lerp(32, S11_FOV_END, clamp01(g));
};
const P0: V3 = [0.75, 1.5, 2.55];

export type E4Stage = { shot: string; t: number; cam: Cam; pov: boolean; focus: V3; blur: number; /** D-057: background dim under a UI overlay, 0..1 */ dim?: number; chars?: boolean };
export const SHOT_IDS = ["S03", "S04", "S05", "S06", "S07", "S10", "S11", "S12", "S13", "S14", "I15", "S15"] as const;
export const shotOf = (t: number) => (Object.entries(SHOTS55).find(([, [a, b]]) => t >= a - 1e-9 && t < b - 1e-9) ?? ["S15"])[0];
/** S13 (USULAN): lens P, fov 40 → 39 with the S10 end dolly (P0 → (0.72; 1.5; 2.5)), aimed at the pair at R1 */
const S13_LOOK: V3 = [(BUILT.A1[0] + R1U[0]) / 2, 1.05, (BUILT.A1[2] + R1U[2]) / 2];
const s13Cam = (t: number): Cam => {
  const u = sm((t - SHOTS55.S13[0]) / SHOTS55.S13[2]);
  return { pos: lerp3(P0, [0.72, 1.5, 2.5], u), look: S13_LOOK, fov: lerp(40, 39, u), roll: 0 };
};
/** `force` (D-058, episode assembly): the shot whose staging is drawn. The assembled episode cuts on cumulative per-shot
 * frame counts, so a shot's last frame can fall at or just past its plan end; without `force` the next shot's camera would
 * be picked for that frame. Default = shotOf(t), unchanged. */
export const stage55 = (t: number, force?: string): E4Stage => {
  const shot = force ?? shotOf(t);
  if (["S03", "S04", "S05", "S06", "S07"].includes(shot)) {
    const b = stageB(shot, t);
    return { shot, t, cam: b.cam, pov: false, focus: b.focus, blur: 0.5, dim: b.dim, chars: b.chars };
  }
  if (shot === "S13") return { shot, t, cam: s13Cam(t), pov: false, focus: S13_LOOK, blur: 0.5 };
  // S14: the UI over lens P held at the S13 end (no second push under the UI's own), background dimmed
  if (shot === "S14") return { shot, t, cam: s13Cam(SHOTS55.S13[1]), pov: false, focus: S13_LOOK, blur: 0.5, dim: 0.55 };
  if (shot === "I15") { const c = CLIPS55.insert.at(t - I0).cam; return { shot, t, cam: c, pov: false, focus: c.look, blur: 0.5 }; }
  if (shot === "S15") { const c = CLIPS55.dua.at(t - SHOTS55.S15[0]).cam; return { shot, t, cam: c, pov: false, focus: c.look, blur: 0.5 }; }
  if (shot === "S10") {
    const c = CLIPS55.mundur.at(t - S10_0).cam;
    return { shot, t, cam: c, pov: false, focus: c.look, blur: 0.5 };
  }
  if (shot === "S11") return { shot, t, cam: { pos: S11_EYE, look: S11_AIM, fov: s11Fov(t), roll: 0 }, pov: true, focus: ledWorld("L"), blur: 0.5 };
  if (shot === "S12") {
    const u = (t - SHOTS55.S12[0]) / SHOTS55.S12[2];
    return { shot, t, cam: { pos: S12_EYE, look: S12_AIM, fov: lerp(30, 26, sm(u)), roll: 0 }, pov: true, focus: ledWorld("K"), blur: 0.5 };
  }
  return { shot, t, cam: { pos: P0, look: [-1.75, 1.05, 1.05], fov: 46, roll: 0 }, pov: false, focus: [-1.75, 1.1, 1.05], blur: 0.5 };
};
