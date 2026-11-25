// Episode 3 (2026-11-004) full-episode assembly checks (D-058): sequence table, cut continuity in WORLD space, visual event
// frames vs audio cue times, caption pages, and the on-screen strings (for the text diff). Pure functions of time only —
// the same stage functions the composition Episode004 draws.
// usage (from studio/): npx esbuild tools/e004_episode_check.ts --bundle --platform=node --log-level=warning --outfile=out/<tmp>.cjs && node out/<tmp>.cjs [seq|cuts|sync|captions|strings|all]
import * as THREE from "three";
import { stickHeadCenter } from "../src/c1/C1";
import { C1_BUILD } from "../src/c1/c1rig";
import { armChain, layoutOf } from "../src/inkbeat/char/skeleton";
import { adikAt, BEATS, CARDS, SCREEN, uqAt, stageAt, knobDeg, doorPush } from "../src/ep004/pilot004Stage";
import { charsAt, EV55, ledsAt, SHOTS55, stage55 } from "../src/ep004/episode004Stage";
import { CAPTION_LINES, CAPTION_PAGES, EPISODE004_FRAMES, PILOT_SHIFT, SEQS } from "../src/ep004/Episode004";
import { FINAL_CHOICES } from "../src/ep004/Episode004Shot";
import { EP2_CHOICES } from "../src/ep003/Episode003";
import { EP2_END } from "../src/ep004/e004Poses";
import { L10_TEXT, L5_TEXT, MASKED_NUMBER } from "../src/ep004/overlay004";
import type { V3 } from "../src/inkbeat/types";

const LAY = layoutOf(C1_BUILD);
const UP = new THREE.Vector3(0, 1, 0);
const FPS = 30;
const mode = process.argv[2] ?? "all";
const PIL = new Set(["S01", "S02", "S08a", "S08", "S09"]);
const POV = new Set(["S08a", "S09", "S11", "S12"]);
const pilotT = (t: number) => (t < 10 ? t : t - PILOT_SHIFT);
type Ch = { who: string; root: V3; yaw: number; height: number; pose: Record<string, unknown> };
/** the characters and phone the composition draws for shot `id` at episode time t (before the POV filter) */
const world = (id: string, t: number): { chars: Ch[]; phone: { p: V3; q: number[] } | null; leds: Record<string, number>; cam: { pos: V3; fov: number } } => {
  if (PIL.has(id)) {
    const tp = pilotT(t), st = stageAt(tp);
    return { chars: st.chars ? ([uqAt(tp), adikAt(tp)] as unknown as Ch[]) : [], phone: st.chars ? (EP2_END.phone as never) : null, leds: { T: st.ledT, D: 0, L: 0, K: 0 }, cam: st.cam };
  }
  const st = stage55(t, id), c = charsAt(t);
  return { chars: st.chars === false ? [] : (c.chars as unknown as Ch[]), phone: c.phone as never, leds: ledsAt(t), cam: st.cam };
};
const W = (c: Ch, p: THREE.Vector3) => p.clone().multiplyScalar(c.height).applyAxisAngle(UP, c.yaw).add(new THREE.Vector3(...c.root));
const pts = (c: Ch) => {
  const h = (side: "L" | "R") => W(c, armChain(c.pose as never, side, LAY).H);
  return { root: new THREE.Vector3(...c.root), handL: h("L"), handR: h("R"), head: new THREE.Vector3(...stickHeadCenter(c.root, c.height)) };
};
const cm = (a: THREE.Vector3, b: THREE.Vector3) => (a.distanceTo(b) * 100).toFixed(1);
const deg = (r: number) => ((r * 180) / Math.PI);
const f1 = (x: number) => x.toFixed(1);

if (mode === "seq" || mode === "all") {
  console.log(`\n== SEQUENCES (cumulative round(dur×30)); total ${EPISODE004_FRAMES} frames = ${(EPISODE004_FRAMES / FPS).toFixed(3)} s; plan total ${(EV55 as never as Record<string, number>).final_cards ? "" : ""}69.15 s`);
  for (const s of SEQS) {
    const t0 = s.from / FPS, t1 = (s.from + s.dur - 1) / FPS;
    console.log(`  ${s.id.padEnd(4)} frames ${String(s.from).padStart(4)}–${String(s.from + s.dur - 1).padStart(4)} (${String(s.dur).padStart(3)}) | cut at ${t0.toFixed(3)} s vs plan ${s.planStart.toFixed(3)} (${f1((t0 - s.planStart) * FPS)} f) | last frame t ${t1.toFixed(3)} vs plan end ${s.planEnd.toFixed(3)}${t1 >= s.planEnd - 1e-9 ? " (≥ plan end: shot forced)" : ""}`);
  }
}

if (mode === "cuts" || mode === "all") {
  console.log(`\n== CUT CONTINUITY (world space; A = last frame of the outgoing shot, B = first frame of the incoming shot; 1 frame of motion is in every Δ)`);
  const one = (lab: string, ida: string, ta: number, idb: string, tb: number) => {
    const A = world(ida, ta), B = world(idb, tb);
    const out: string[] = [];
    for (const who of ["uq", "adik"]) {
      const a = A.chars.find((c) => c.who === who), b = B.chars.find((c) => c.who === who);
      if (!a || !b) { out.push(`${who}: ${a ? "drawn→none" : b ? "none→drawn" : "none"}`); continue; }
      const pa = pts(a), pb = pts(b);
      const hy = (c: Ch) => `${f1((c.pose.headYaw as number) ?? 0)}/${f1((c.pose.headNod as number) ?? 0)}`;
      out.push(`${who}: akar ${cm(pa.root, pb.root)} cm, yaw ${f1(Math.abs(deg(a.yaw - b.yaw)))}°, tangan kanan(rig L) ${cm(pa.handL, pb.handL)} cm, tangan kiri(rig R) ${cm(pa.handR, pb.handR)} cm, kepala ${cm(pa.head, pb.head)} cm, headYaw/Nod ${hy(a)} → ${hy(b)}`);
    }
    const ph = A.phone && B.phone ? `ponsel ${cm(new THREE.Vector3(...A.phone.p), new THREE.Vector3(...B.phone.p))} cm, putar ${f1(deg(2 * Math.acos(Math.min(1, Math.abs(new THREE.Quaternion(...(A.phone.q as [number, number, number, number])).dot(new THREE.Quaternion(...(B.phone.q as [number, number, number, number]))))))))}°` : "ponsel -";
    const led = ["T", "D", "L", "K"].filter((k) => A.leds[k] !== B.leds[k]).map((k) => `${k} ${A.leds[k]}→${B.leds[k]}`).join(", ") || "sama";
    console.log(`  ${lab}\n     ${out.join("\n     ")}\n     ${ph}; LED ${led}`);
  };
  for (let i = 1; i < SEQS.length; i++) {
    const a = SEQS[i - 1], b = SEQS[i];
    one(`${a.id}→${b.id} @ f${b.from} (${(b.from / FPS).toFixed(3)} s)${POV.has(a.id) || POV.has(b.id) ? " [POV: Uq tidak digambar di sisi POV]" : ""}`, a.id, (b.from - 1) / FPS, b.id, b.from / FPS);
  }
  // continuity ACROSS a POV/insert/UI shot (what the viewer compares): last visible two-shot frame → next one
  console.log(`\n  -- lintas sisipan (frame terakhir shot bertokoh → frame pertama shot bertokoh berikutnya)`);
  const pairs: [string, string][] = [["S02", "S04"], ["S07", "S08"], ["S09", "S10"], ["S10", "S13"], ["S13", "I15"]];
  for (const [x, y] of pairs) {
    const a = SEQS.find((s) => s.id === x)!, b = SEQS.find((s) => s.id === y)!;
    const ta = (a.from + a.dur - 1) / FPS, tb = b.from / FPS;
    one(`${x} (f${a.from + a.dur - 1}) → ${y} (f${b.from}), selang ${f1((tb - ta) * FPS)} f`, x, ta, y, tb);
  }
}

if (mode === "sync" || mode === "all") {
  console.log(`\n== SYNC: visual event (first frame showing it, episode clock t = frame/30) vs audio cue (file start in the v2/v3 mix; steps: planned heel strike = grain peak)`);
  const firstFrame = (pred: (t: number) => boolean, f0: number, f1x: number) => { for (let f = f0; f <= f1x; f++) if (pred(f / FPS)) return f; return -1; };
  const row = (name: string, cue: number, vf: number, note = "") => {
    const d = vf - cue * FPS;
    console.log(`  ${name.padEnd(34)} cue ${cue.toFixed(3)} s = f${(cue * FPS).toFixed(2).padStart(7)} | gambar f${String(vf).padStart(4)} (${(vf / FPS).toFixed(3)} s) | selisih ${d >= 0 ? "+" : ""}${d.toFixed(2)} f ${Math.abs(d) <= 1 ? "lolos" : "**> 1 f**"}${note ? " | " + note : ""}`);
  };
  const ev = (k: string) => (EV55 as unknown as Record<string, number>)[k];
  const fAt = (t: number) => Math.round(t * FPS);
  row("kenop berputar (sudut > 0)", BEATS.knobTurn, firstFrame((t) => knobDeg(t) > 1e-6, 0, 30), "pilot: putaran mulai 0,05 s sesudah bunyi");
  row("kenop tertahan (getar mulai)", BEATS.knobStrain, firstFrame((t) => t >= BEATS.knobStrain && Math.abs(knobDeg(t) - knobDeg(BEATS.knobStrain - 1e-4)) > 1e-6, fAt(0.9), fAt(1.4)));
  row("gerendel (daun terdorong 3 mm)", BEATS.boltRattle, firstFrame((t) => doorPush(t) > 0, 0, 60));
  row("kenop kembali (sudut turun)", BEATS.knobBack, firstFrame((t) => t > BEATS.knobBack && knobDeg(t) < knobDeg(BEATS.knobBack) - 1e-6, fAt(1.5), fAt(2.1)));
  row("klik recap (cincin kartu)", BEATS.recapClick, firstFrame((t) => t >= BEATS.recapClick, fAt(7.5), fAt(8.2)), `kartu masuk ${CARDS.in}, keluar ${CARDS.out}+${CARDS.fade}`);
  row("getar ponsel 1 (layar menyala)", ev("vib1"), firstFrame((t) => charsAt(t).glow > 0, fAt(19), fAt(19.6)));
  row("LED-1 (pilot T)", ev("LED1_click"), firstFrame((t) => stageAt(pilotT(t)).ledT > 0, fAt(30.7), fAt(31.6)));
  row("layar ponsel menyala S09 (kilau lensa)", BEATS.screenTap + PILOT_SHIFT, firstFrame((t) => stageAt(pilotT(t)).glint > 0, fAt(36), fAt(36.6)), `bunyi = ketuk layar (pilot ${BEATS.screenTap}); kilau ${SCREEN[0]}–${SCREEN[1]} pilot`);
  row("LED-2", ev("LED2_click"), firstFrame((t) => ledsAt(t).D > 0, fAt(41.3), fAt(41.9)));
  row("LED-3", ev("LED3_click"), firstFrame((t) => ledsAt(t).L > 0, fAt(44), fAt(44.7)));
  row("LED-4", ev("LED4_click"), firstFrame((t) => ledsAt(t).K > 0, fAt(46.9), fAt(47.5)));
  row("getar ponsel 2 (UI goyang)", ev("vib2"), firstFrame((t) => t >= ev("vib2"), fAt(54), fAt(54.4)), "PhoneUI004: goyang mulai t ≥ vib2");
  row("kartu akhir (masuk)", ev("final_cards"), firstFrame((t) => t >= ev("final_cards"), fAt(65.5), fAt(66)), "kartu tidak punya cue sendiri (rencana d055); dibanding waktu rencana");
  row("Doom (vs kartu masuk)", ev("doom"), firstFrame((t) => t >= ev("final_cards"), fAt(65.5), fAt(66)), "rancangan: kartu 0,15 s sebelum Doom");
  // S10 steps: planted foot = the frame where the ankle height reaches its floor value and stays (from the drawn legPose)
  const S10 = SHOTS55.S10[0];
  const steps: [string, number][] = [
    ...[0.613, 1.047, 1.48, 1.913, 2.347, 2.78, 3.13, 3.5].map((x, i) => [`langkah Uq ${i + 1} (S10+${x})`, S10 + x] as [string, number]),
    ...[0.605, 1.03, 1.455, 1.88, 2.305, 2.73, 3.16, 3.51].map((x, i) => [`langkah adik ${i + 1} (S10+${x})`, S10 + x] as [string, number]),
  ];
  const s10Seq = SEQS.find((s) => s.id === "S10")!;
  for (const [n, tt] of steps) {
    const vf = Math.ceil(tt * FPS - 1e-9);
    const inShot = vf <= s10Seq.from + s10Seq.dur - 1;
    row(n, tt, vf, inShot ? "frame tapak = frame pertama ≥ waktu tapak (kode)" : `SESUDAH potongan ke S11 (f${s10Seq.from + s10Seq.dur}): tapak tidak terlihat`);
  }
}

if (mode === "captions" || mode === "all") {
  console.log(`\n== CAPTION PAGES (word times by character share inside measured bursts = ASUMSI)`);
  for (const p of CAPTION_PAGES) console.log(`  ${p.a.toFixed(3)}–${p.b.toFixed(3)} s (f${Math.ceil(p.a * FPS)}–f${Math.ceil(p.b * FPS) - 1}): ${p.words.map((w) => `${w.text}@${w.a.toFixed(2)}`).join(" ")}`);
}

if (mode === "strings") {
  console.log(JSON.stringify({ captions: CAPTION_LINES.map((l) => [l.id, l.text]), L5: L5_TEXT, L10: L10_TEXT, number: MASKED_NUMBER, header: "Nomor tidak dikenal", recap: EP2_CHOICES, final: FINAL_CHOICES, label: ["HARI 1", "EPISODE 3"] }));
}

if (mode === "zones") {
  // projected positions (1080×1920 space) of the LEDs and the head centres at the safe-zone key moments
  const px = (cam: { pos: V3; look?: V3; fov: number }, p: V3) => {
    const c = new THREE.PerspectiveCamera(cam.fov, 1080 / 1920, 0.01, 100);
    c.position.set(...cam.pos); c.lookAt(new THREE.Vector3(...((cam as { look: V3 }).look))); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = new THREE.Vector3(...p).project(c);
    return { x: (v.x + 1) * 540, y: (1 - v.y) * 960, front: v.z < 1 };
  };
  const { ledWorld } = require("../src/ep004/LookDev004") as typeof import("../src/ep004/LookDev004");
  for (const f of [1331, 1345, 1360, 1375, 1391, 1955, 1980, 2040, 2075]) {
    const s = SEQS.find((q) => f >= q.from && f < q.from + q.dur)!;
    const t = f / FPS, wv = world(s.id, t);
    const leds = (["T", "D", "L", "K"] as const).filter((k) => wv.leds[k]).map((k) => { const q = px(wv.cam as never, ledWorld(k)); return `${k} (${q.x.toFixed(0)}; ${q.y.toFixed(0)})${q.front && q.x >= 0 && q.x <= 1080 && q.y >= 0 && q.y <= 1920 ? "" : " luar"}`; });
    const heads = POV.has(s.id) ? [] : wv.chars.map((c) => { const q = px(wv.cam as never, stickHeadCenter(c.root, c.height)); return `${c.who} (${q.x.toFixed(0)}; ${q.y.toFixed(0)})`; });
    console.log(`  f${f} ${s.id} t ${t.toFixed(3)}: LED ${leds.join(", ") || "-"} | kepala ${heads.join(", ") || "-"}`);
  }
}
