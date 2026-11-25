// Episode 5 (2026-11-006) full-episode MOTION + INTERACTION CHECK (motion_check_lib), every on-screen frame of the 3D shots
// with characters. S15 (the closing) is checked by tools/e006_close_check.ts (approved v0f motion, D-067).
// Owner review of preview v4 (2026-11-24, _media/2026-11-006/Kesalahan_Logika/): the guard's hand floated through the
// door, adik walked through the back door's leaf, the padlock did not hold anything. Proof that the checks below catch those
// three: _media/2026-11-006/out/episode_preview_v5/qc/interaction_check_v4.txt (this driver's first version run on the v4
// staging: all three FAIL). Since v5 the guard is a whole body (cast "satpam"), the key and the padlock are props.
//   - door leaves at their angle IN EVERY FRAME (back door, toa-room door; the bathroom leaf is in the lib), against bodies,
//     arm joints AND segments, feet and props; declared door openings instead of "deliberate contact" excuses; jambs as boxes
//   - interaction rules (state BEFORE the touch, path and CONTACT during it, the visible change AFTER it):
//       R1 a door (and the hasp strap) moves only while a hand is on it (palm centre <= 7 cm from the leaf's centre plane;
//          10 cm on the back door, where the hand holds the bolt knob), or swings on after a push and SLOWS DOWN (|da| per
//          frame never grows without a hand; a cut does not stop a swinging door)
//       R2 a body may cross a doorway only when the clear width that frame is >= its width + 4 cm
//       R3 a held prop (the key, the padlock) stays with its holder (key <= 6 cm, padlock body <= 12 cm); it moves <= 8 cm per
//          frame (2.4 m/s: a hand of a walking, turning body; a teleport is more), and on the handover frame <= 1.5 cm
//       R4 the lock: the key tip on the keyway's axis while going in, at the keyway's end when in; turned only when in; the
//          shackle opens only after a full turn; while locked the crown runs THROUGH the eye; the padlock leaves the eye only
//          open; the strap moves only after the padlock is off; the door moves only after the strap is open
//       R5 the action is not hidden behind a body where it must be seen (the key at the handover, adik at the threshold,
//          the keyway, the strap's tip): the line camera -> action misses every body cylinder (to the head top) (v5 stills
//          r1: once Uq stood 10 cm nearer the door, v4's S05 camera looked through the back of his head; in S06a Uq walked
//          into the lens's line to the door just before adik came through; nothing else had caught either)
// New sets added as boxes (motion_check_lib rule: add, never delete).
//   npx esbuild tools/e006_check.ts --bundle --platform=node --log-level=warning --outfile=out/e006_check.cjs && node out/e006_check.cjs
import * as THREE from "three";
import type { V3 } from "../src/inkbeat/types";
import { armWorldB, checkMotion } from "./motion_check_lib";
import type { Box, Ch, Leaf } from "./motion_check_lib";
import { H_AD, H_UQ } from "../src/ep004/motion004";
import { backDoorAt, bathDoorAt, charsAt, guardAt, keyAt, LOCK_HOLDER, padlockAt, roomDoorAt, SH, stageAt, TRACK_CONTACT, TRACK_ERR, TRACK_ERR_T, ARM_KEYS } from "../src/ep006/stage006";
import { DESK, MIC, ROOM } from "../src/ep006/closeMotion006";
import { GANG, RACK } from "../src/ep006/sets006";
import { BODY_C, crownThroughEye, haspTip, HASP, lockFrame, toWorld } from "../src/ep006/lock006";
import PLAN from "../src/ep006/episode006-plan.json";

const extra: Box[] = [
  { name: "gang: dinding utara (z -7.42) barat", min: [-14, 0, GANG.z0 - 0.15], max: [ROOM.x0, 2.2, GANG.z0] },
  { name: "gang: rumah x 9 (sisi belakang)", min: [5.5, 0, -5.2], max: [12.5, 3.0, -5.0] },
  { name: "pintu belakang: kusen barat", min: [-1.32, 0, -5.06], max: [-1.25, 2.05, -4.94] },
  { name: "pintu belakang: kusen timur", min: [-0.35, 0, -5.06], max: [-0.28, 2.05, -4.94] },
  { name: "ruang toa: dinding barat", min: [ROOM.x0, 0, ROOM.z0], max: [ROOM.x0 + ROOM.t, ROOM.h, ROOM.z1] },
  { name: "ruang toa: dinding timur", min: [ROOM.x1 - ROOM.t, 0, ROOM.z0], max: [ROOM.x1, ROOM.h, ROOM.z1] },
  { name: "ruang toa: dinding utara", min: [ROOM.x0, 0, ROOM.z0], max: [ROOM.x1, ROOM.h, ROOM.z0 + ROOM.t] },
  { name: "ruang toa: dinding selatan barat pintu", min: [ROOM.x0, 0, ROOM.z1 - ROOM.t], max: [ROOM.door.x0, ROOM.h, ROOM.z1] },
  { name: "ruang toa: dinding selatan timur pintu", min: [ROOM.door.x1, 0, ROOM.z1 - ROOM.t], max: [ROOM.x1, ROOM.h, ROOM.z1] },
  { name: "ruang toa: meja", min: [DESK.x0, 0, DESK.z0], max: [DESK.x1, DESK.top, DESK.z1] },
  { name: "ruang toa: rak sakelar", min: [RACK.x0, 0, RACK.z0], max: [RACK.x1, RACK.h, RACK.z1] },
  { name: "ruang toa: kepala mikrofon", min: [MIC[0] - 0.03, MIC[1] - 0.045, MIC[2] - 0.03], max: [MIC[0] + 0.03, MIC[1] + 0.045, MIC[2] + 0.03] },
];
// door leaves at their angle (x, z): back door hinge on the east jamb, opens OUTWARD (north); toa-room door hinge west, opens IN (north)
const BACK = { name: "daun pintu belakang", hinge: [-0.36, -5.0] as [number, number], len: 0.88, half: 0.0225, h: 2.05, jamb: [-1.25, -5.0] as [number, number], x: [-1.25, -0.35] as [number, number], z: -5.0 };
const TOA = { name: "daun pintu ruang toa", hinge: [ROOM.door.x0 + 0.01, ROOM.z1 - ROOM.t / 2] as [number, number], len: ROOM.door.x1 - ROOM.door.x0 - 0.02, half: 0.02, h: 2.0, jamb: [ROOM.door.x1, ROOM.z1 - ROOM.t / 2] as [number, number], x: [ROOM.door.x0, ROOM.door.x1] as [number, number], z: ROOM.z1 - ROOM.t / 2 };
const backLeaf = (a: number): Leaf => ({ name: BACK.name, a: BACK.hinge, b: [BACK.hinge[0] - BACK.len * Math.cos(a), BACK.hinge[1] - BACK.len * Math.sin(a)], half: BACK.half, h: BACK.h });
const toaLeaf = (a: number): Leaf => ({ name: TOA.name, a: TOA.hinge, b: [TOA.hinge[0] + TOA.len * Math.cos(a), TOA.hinge[1] - TOA.len * Math.sin(a)], half: TOA.half, h: TOA.h });
const HOUSE_SHOTS = ["S04a", "S04b", "S05", "S06a", "S06c"];
const ROOM_SHOTS = ["S07a", "S07b", "S08a"];
const leavesAt = (t: number, shot: string): Leaf[] => [...(HOUSE_SHOTS.includes(shot) ? [backLeaf(backDoorAt(t))] : []), ...(ROOM_SHOTS.includes(shot) ? [toaLeaf(roomDoorAt(t))] : [])];
const propsAt = (t: number, shot: string): [V3, number, string][] => {
  const out: [V3, number, string][] = [];
  const k = keyAt(t);
  if (k) out.push([k.mid, 0.01, `kunci (${k.holder})`]);
  // the padlock once it is off the eye (on the eye it is mounted on the wall: the eye/strap clearances are R4's)
  const f = ROOM_SHOTS.includes(shot) ? padlockAt(t) : null;
  if (f && !f.onEye) out.push([toWorld(f.o, f.rz, [BODY_C[0], BODY_C[1] - f.drop, BODY_C[2]]), 0.012, "gembok"]);
  return out;
};
const SHOTS = ["S04a", "S04b", "S05", "S06a", "S06c", "S07a", "S07b", "S08a", "S10", "S10c", "S11", "S12", "S14"].filter((id) => SH[id]);
const shots = SHOTS.map((id) => ({ id, t0: SH[id][0], t1: SH[id][1] }));

// ------------------------------------------------------------------ interaction rules
const segD = (p: [number, number], a: [number, number], b: [number, number]) => { const P = new THREE.Vector2(...p), A = new THREE.Vector2(...a), B = new THREE.Vector2(...b); const ab = B.clone().sub(A); const u = Math.max(0, Math.min(1, P.clone().sub(A).dot(ab) / ab.lengthSq())); return P.distanceTo(A.clone().addScaledVector(ab, u)); };
const v = (p: V3) => new THREE.Vector3(...p);
const handsAt = (t: number): [V3, string][] => {
  const out: [V3, string][] = [];
  const all: { who: string; root: V3; yaw: number; pose: Record<string, unknown>; h: number }[] = charsAt(t).chars.map((c) => ({ who: c.who, root: c.root, yaw: c.yaw, pose: c.pose, h: c.who === "uq" ? H_UQ : H_AD }));
  const g = guardAt(t);
  if (g) all.push({ who: "satpam", root: g.root, yaw: g.yaw, pose: g.pose, h: g.h });
  for (const c of all) {
    for (const side of ["L", "R"] as const) {
      const a = c.pose[side === "L" ? "armL" : "armR"] as number[];
      const q = [a[0], a[1], (c.pose[side === "L" ? "armLFwd" : "armRFwd"] as number) ?? 0];
      out.push([armWorldB(q as [number, number, number], side, c.root, c.yaw, c.h, (c.pose.lean as number) ?? 0)[2], `${c.who} tangan ${side === "L" ? "kanan" : "kiri"}`]);
    }
  }
  return out;
};
type Fail = { rule: string; t0: number; t1: number; worst: number; note: string };
const rules = (): string[] => {
  const fails: Record<string, Fail> = {};
  const fail = (rule: string, t: number, val: number, note: string) => { const f = fails[rule]; if (!f) fails[rule] = { rule, t0: t, t1: t, worst: val, note }; else { f.t1 = t; if (val > f.worst) { f.worst = val; f.note = note; } } };
  const seen: string[] = [];
  let prevKey: { p: V3; holder: string } | null = null, prevLock: { p: V3; holder: string } | null = null;
  const doorState: Record<string, { free: boolean; prevD: number }> = {};
  for (const sh of shots) {
    const f0 = Math.ceil(sh.t0 * 30 - 1e-6), f1 = Math.ceil(sh.t1 * 30 - 1e-6) - 1;
    for (let f = f0; f <= f1; f++) {
      const t = f / 30, cut = f === f0;
      const hands = handsAt(t);
      // R1 doors (and the strap) move only under a hand, or swing on slowing down after a push
      const movers: [string, (x: number) => number, (a: number) => Leaf, string[], number][] = [
        ["pintu belakang", backDoorAt, backLeaf, HOUSE_SHOTS, 0.1],
        ["pintu ruang toa", roomDoorAt, toaLeaf, ROOM_SHOTS, 0.07],
        ["tali pengait", (x) => lockFrame(x).haspAngle, (a) => { const p = haspTip(a); return { name: "tali pengait", a: [HASP.hinge[0], HASP.hinge[2]], b: [p[0], p[2]], half: 0.002, h: 2 }; }, ["S07a"], 0.07],
      ];
      for (const [nm, ang, leaf, shs, reach] of movers) {
        if (!shs.includes(sh.id)) continue;
        const a1 = ang(t), a0 = ang(t - 1 / 30), d = Math.abs(a1 - a0);
        const L = leaf(a1);
        const near = Math.min(...hands.filter(([p]) => p[1] > 0.5).map(([p]) => segD([p[0], p[2]], L.a, L.b) - L.half));
        const st = (doorState[nm] ??= { free: false, prevD: 0 });
        if (cut) { st.prevD = d; continue; }
        if (d < 1e-5) { st.prevD = d; continue; }
        if (!seen.includes(`R1 ${nm}`)) seen.push(`R1 ${nm}`);
        if (near <= reach) { st.free = true; st.prevD = d; continue; }
        // 10 %: the release falls between two frames, so the first free step can be a little longer than the straddled one
        if (!(st.free && d <= st.prevD * 1.1 + 1e-6)) fail(`R1 ${nm} bergerak tanpa tangan (dan tidak melambat sesudah dorongan)`, t, near, `tangan terdekat ${(near * 100).toFixed(1)} cm (${sh.id}, ${a0.toFixed(3)}→${a1.toFixed(3)} rad, langkah ${d.toFixed(4)} > sebelumnya ${st.prevD.toFixed(4)})`);
        st.prevD = d;
      }
      // R2 crossing a doorway: clear width >= body width + 4 cm
      for (const c of charsAt(t).chars) {
        const r = c.who === "uq" ? 0.22 : 0.16;
        for (const [D, ang, leaf, shs] of [[BACK, backDoorAt, backLeaf, HOUSE_SHOTS], [TOA, roomDoorAt, toaLeaf, ROOM_SHOTS]] as const) {
          if (!(shs as readonly string[]).includes(sh.id)) continue;
          if (c.root[0] < D.x[0] - r || c.root[0] > D.x[1] + r || Math.abs(c.root[2] - D.z) > r + 0.05) continue;
          if (!seen.includes(`R2 ${c.who} ${D.name}`)) seen.push(`R2 ${c.who} ${D.name}`);
          const L = leaf(ang(t));
          const clear = segD(D.jamb, L.a, L.b) - L.half;
          if (clear < 2 * r + 0.04) fail(`R2 ${c.who} lewat ${D.name.replace("daun ", "")} terlalu sempit`, t, 2 * r + 0.04 - clear, `lebar bebas ${(clear * 100).toFixed(0)} cm < ${((2 * r + 0.04) * 100).toFixed(0)} cm (${sh.id})`);
        }
      }
      // R3 the key stays with its holder and never jumps (the handover frame included)
      const k = keyAt(t);
      if (k) {
        if (!seen.includes(`R3 kunci ${k.holder}`)) seen.push(`R3 kunci ${k.holder}`);
        if (prevKey && !cut) {
          const j = v(k.mid).distanceTo(v(prevKey.p)), sw = prevKey.holder !== k.holder;
          if (j > (sw ? 0.015 : 0.08)) fail(sw ? "R3 kunci melompat saat berpindah tangan" : "R3 kunci bergerak > 8 cm per frame", t, j, `${(j * 100).toFixed(1)} cm dalam 1 frame (${sh.id}, pemegang ${k.holder})`);
        }
        const holder = hands.filter(([, n]) => (k.holder === "guard" ? n === "satpam tangan kiri" : n === "uq tangan kanan"));
        const d = holder.length ? Math.min(...holder.map(([p]) => v(p).distanceTo(v(k.mid)))) : 9;
        if (d > 0.06) fail("R3 kunci lepas dari pemegangnya", t, d, `${(d * 100).toFixed(1)} cm dari tangan ${k.holder} (${sh.id})`);
        prevKey = { p: k.mid, holder: k.holder };
      } else prevKey = null;
      // R3 the padlock once it is off the eye: with the right hand, then the left (T_X)
      const pf = ROOM_SHOTS.includes(sh.id) ? padlockAt(t) : null;
      if (pf) {
        const hd = LOCK_HOLDER(t);
        const body = toWorld(pf.o, pf.rz, [BODY_C[0], BODY_C[1] - pf.drop, BODY_C[2]]);
        if (prevLock && !cut) {
          const j = v(body).distanceTo(v(prevLock.p)), sw = prevLock.holder !== hd && prevLock.holder !== "eye";
          if (j > (sw ? 0.015 : 0.08)) fail(sw ? "R3 gembok melompat saat berpindah tangan" : "R3 gembok bergerak > 8 cm per frame", t, j, `${(j * 100).toFixed(1)} cm (${sh.id}, ${hd})`);
        }
        if (hd === "uq kanan") {
          if (!seen.includes(`R3 gembok ${hd}`)) seen.push(`R3 gembok ${hd}`);
          const hn = "uq tangan kanan";
          const hp = hands.find(([, n]) => n === hn);
          const d = hp ? v(hp[0]).distanceTo(v(body)) : 9;
          if (d > 0.12) fail("R3 gembok lepas dari tangan pemegangnya", t, d, `${(d * 100).toFixed(1)} cm dari ${hd} (${sh.id})`);
        }
        prevLock = { p: body, holder: hd };
      } else prevLock = null;
      // R5 the action is not hidden behind a body, in the windows where it must be seen (the owner's three cases + the click)
      {
        const E = PLAN.events as unknown as Record<string, [number, number] & number>;
        const ad = charsAt(t).chars.find((c) => c.who === "adik")!;
        let focus: V3 | null = null, what = "", skip = "";
        if (sh.id === "S05" && t >= E.reachIn[0] && t <= E.withdraw[0]) { focus = keyAt(t)?.mid ?? null; what = "serah-terima kunci"; }
        if (sh.id === "S06a" && ad.root[2] < -4.8 && ad.root[2] > -5.4) { focus = [ad.root[0], 1.0, -5.0]; what = "adik di ambang pintu"; skip = "adik"; }
        if (sh.id === "S07a" && t >= E.keyIn[0] && t <= E.padOff[1]) { focus = lockFrame(t).keywayIn; what = "lubang kunci"; }
        if (sh.id === "S07a" && t >= E.hasp[0] && t <= E.hasp[1]) { focus = haspTip(lockFrame(t).haspAngle); what = "ujung tali pengait"; }
        if (focus) {
          if (!seen.includes(`R5 ${what}`)) seen.push(`R5 ${what}`);
          const st = stageAt(t, sh.id);
          const cp = v(st.cam.pos as V3), fp = v(focus);
          const bodies: { who: string; root: V3; r: number; h: number }[] = charsAt(t).chars.map((c) => ({ who: c.who, root: c.root, r: c.who === "uq" ? 0.2 : 0.15, h: c.who === "uq" ? 1.62 : 1.45 }));
          const g = guardAt(t);
          if (g) bodies.push({ who: "satpam", root: g.root, r: 0.2, h: 1.75 });
          for (const b of bodies) {
            if (b.who === skip) continue;
            let hit = 0;
            for (let k = 0.02; k <= 0.9; k += 0.02) { const q = cp.clone().lerp(fp, k); const d = Math.hypot(q.x - b.root[0], q.z - b.root[2]); if (d < b.r * 0.85 && q.y > 0 && q.y < b.h) hit = Math.max(hit, b.r * 0.85 - d); }
            if (hit > 0) fail(`R5 ${what} (${sh.id}) tertutup badan ${b.who}`, t, hit, `garis kamera->aksi masuk ${(hit * 100).toFixed(0)} cm ke badan ${b.who}`);
          }
        }
      }
      // R4 the lock (geometry from lock006; S07a-S08a)
      if (ROOM_SHOTS.includes(sh.id)) {
        const L = padlockAt(t), door = roomDoorAt(t), lf = lockFrame(t);
        if (!seen.includes("R4 gembok")) seen.push("R4 gembok");
        if (!L) { if (LOCK_HOLDER(t) !== "saku") fail("R4 gembok hilang dari gambar", t, 1, sh.id); continue; }
        const showKey = t >= SH.S07a[0];
        if (showKey && L.keyIn > 1e-3 && L.keyIn < 0.999) {
          const ax = v(L.axis).normalize(), w = v(L.keyTip).sub(v(L.keywayIn));
          const off = w.clone().sub(ax.clone().multiplyScalar(w.dot(ax))).length();
          if (off > 0.003) fail("R4 ujung anak kunci keluar dari sumbu lubang kunci saat masuk", t, off, `${(off * 1000).toFixed(1)} mm (${sh.id})`);
        }
        if (L.keyIn >= 0.999 && v(L.keyTip).distanceTo(v(L.keywayIn)) > 0.006) fail("R4 anak kunci tidak sampai ujung lubang kunci", t, 1, sh.id);
        if (L.keyTurn > 1e-3 && L.keyIn < 0.999) fail("R4 kunci diputar sebelum masuk penuh", t, 1, sh.id);
        if (L.shackleOpen && L.keyTurn < 0.999) fail("R4 lengkung terbuka sebelum kunci diputar penuh", t, 1, sh.id);
        if (L.onEye && !L.shackleOpen && L.rz < 1e-3) {
          const c = crownThroughEye(L);
          if (!c.ok) fail("R4 lengkung gembok tidak melewati kupingan (tidak mengunci apa pun)", t, c.d, `jarak lengkung ke pusat lubang ${(c.d * 1000).toFixed(1)} mm`);
        }
        if (!L.onEye && !L.shackleOpen) fail("R4 gembok lepas dari kupingan padahal lengkung masih terkunci", t, 1, sh.id);
        if (lf.haspAngle > 1e-3 && L.onEye) fail("R4 tali pengait bergerak sebelum gembok lepas", t, lf.haspAngle, sh.id);
        if (door > 1e-3 && !(lf.haspAngle >= HASP.open - 1e-3 && !L.onEye)) fail("R4 pintu bergerak sebelum gembok lepas dan pengait terbuka", t, door, `pintu ${door.toFixed(2)} rad, gembok di kupingan ${L.onEye}, pengait ${lf.haspAngle.toFixed(2)} rad (${sh.id})`);
      }
    }
  }
  const lines = Object.values(fails).sort((a, b) => a.t0 - b.t0).map((f) => `GAGAL ${f.rule}: ${f.t0.toFixed(2)}–${f.t1.toFixed(2)} s; terburuk: ${f.note}`);
  return [...(lines.length ? lines : ["ok    aturan interaksi R1–R4: tidak ada pelanggaran"]), `info  diuji: ${seen.join(" · ")}`];
};

checkMotion({
  title: "Ep 5 (2026-11-006) pratinjau episode penuh — cek gerak + interaksi S04a–S14 (S15: e006_close_check)",
  shots,
  at: (t, shot) => {
    const { chars } = charsAt(t);
    const st = stageAt(t, shot);
    const all: Ch[] = chars.map((c) => ({ who: c.who, root: c.root, yaw: c.yaw, pose: c.pose, feet: c.feet }));
    const g = guardAt(t);
    if (g) all.push({ who: "satpam", root: g.root, yaw: g.yaw, pose: g.pose, r: g.r, h: g.h });
    return { chars: all, hasChars: true, cam: { pos: st.cam.pos as V3 }, bathDoor: bathDoorAt(t) };
  },
  closedDoorShots: [],
  extraBoxes: extra,
  leaves: leavesAt,
  // the doorway: a body or hand whose point lies within the opening's x range near the wall is tested against the jambs
  // and the leaf, not the wall box that spans the opening (v5 run 1: walking through the doorway read as "in the wall")
  openings: [{ wall: "dinding utara dapur (z -5)", min: [BACK.x[0], 0, -5.4], max: [BACK.x[1], 2.05, -4.6] }],
  props: propsAt,
  extra: () => [
    ...rules(),
    `${[...TRACK_CONTACT].some((k) => TRACK_ERR[k] > 0.01) ? "GAGAL" : "ok   "} IK pelacak sentuhan (galat maks <= 1 cm; m @ s): ${[...TRACK_CONTACT].map((k) => `${k} ${TRACK_ERR[k].toFixed(3)} @ ${TRACK_ERR_T[k].toFixed(2)}`).join("; ")}`,
    `info  IK pelacak jalur (tangan di antara sentuhan; yang digambar = FK): ${Object.keys(TRACK_ERR).filter((k) => !TRACK_CONTACT.has(k)).map((k) => `${k} ${TRACK_ERR[k].toFixed(3)}`).join("; ")}`,
    `info  IK kunci (galat, m): ${Object.entries(ARM_KEYS).map(([k, s]) => `${k} ${s.err.toFixed(3)}`).join("; ")}`,
    `rencana: ${PLAN.timing}; shot: ${SHOTS.join(" ")}`,
  ],
});
