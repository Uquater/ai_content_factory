// rev1 (2026-11-15): C1's reach for the coffee glass in WarungDemo, as a pure function of time.
// Beats (times in demo-plan.json "reach"): the eyes, then the head go to the glass; the right hand peels off the table
// and decelerates onto the glass; a short press; the glass slides (slow start, soft stop) with
// the palm locked to it while the upper body leans, rolls and twists a little into the reach; the hand lets go with a
// small quick lift, the glass stays put, the hand goes back to its resting spot on the table more slowly, and the body settles.
// The arm is solved by a local IK on inkbeat's own arm chain (armChain + layoutOf(C1_BUILD)) through the same upper-body
// matrix C1 draws with, so the drawn palm is where the solver put it. Every solve starts from a fixed preferred pose for
// that instant (not from the previous frame), so each frame is still a pure function of t.
import * as THREE from "three";
import { armChain, layoutOf } from "../inkbeat/char/skeleton";
import type { V3 } from "../inkbeat/types";
import { C1_BUILD, C1_HEIGHT, WRIST_OFF, c1Swivel, c1UpperToWorld, c1WorldDirToUpper } from "./c1rig";
import type { C1Hand } from "./c1rig";

export type ReachPlan = {
  gazeIn: number;
  lift: number;
  touch: number;
  push: number;
  stop: number;
  release: number;
  rest: number;
  gazeOut: number;
  cupFromX: number;
  cupToX: number;
  /** resting palm: [x, depth past the table's near edge] on the table, or a world point [x, y, z] (e.g. the lap) */
  restAt?: number[];
};
/** the scene numbers the reach needs (passed in so this file has no React / set imports) */
export type ReachScene = { root: V3; tableY: number; cupY: number; cupZ: number; table: { x0: number; x1: number; z0: number; z1: number } };
type Q = [number, number, number, number]; // shoulder, elbow, arm-plane forward, elbow swivel (deg) of the "L" chain (C1's right arm)
/** upper-body lean / roll / twist (deg) and the right shoulder lifting into the reach (shrug, h units, up) */
type Body = { lean: number; roll: number; twist: number; shrug: number };

/** C1's default seated arm (the left arm keeps it; the right arm's resting-pose search starts here) */
export const REST_Q: Q = [10, 50, 75, 0];
const D2R = Math.PI / 180;
const LAY = layoutOf(C1_BUILD);
const H = C1_HEIGHT;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerpQ = (a: Q, b: Q, u: number): Q => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)];

/** CSS-style cubic-bezier easing (x1, y1, x2, y2), solved by bisection: deterministic and monotonic */
const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  const u = clamp01(x);
  const bx = (s: number) => 3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (bx(m) < u) lo = m;
    else hi = m;
  }
  const s = (lo + hi) / 2;
  return 3 * (1 - s) * (1 - s) * s * y1 + 3 * (1 - s) * s * s * y2 + s * s * s;
};
/** per-beat tempo: each action gets its own curve instead of one smoothstep for everything */
export const TEMPO = {
  eyes: bezier(0.3, 0, 0.1, 1), // quick dart
  head: bezier(0.4, 0, 0.2, 1), // follows the eyes, settles
  approach: bezier(0.3, 0, 0.18, 1), // out of the lap briskly, long deceleration into the contact
  press: bezier(0.4, 0, 0.6, 1),
  slide: bezier(0.55, 0, 0.3, 1), // a slow start (the glass resists), a soft stop
  release: bezier(0.1, 0.6, 0.3, 1), // a small, quick lift off
  back: bezier(0.42, 0, 0.18, 1), // unhurried return, gentle landing
  body: bezier(0.45, 0, 0.35, 1),
  settle: bezier(0.3, 0, 0.15, 1),
};

// ------------------------------------------------------------------ forward kinematics (same transforms as C1)
const fk = (q: Q, root: V3, body: Body) => {
  const ch = armChain({ armL: [q[0], q[1]], armLFwd: q[2] }, "L", LAY);
  const { S, H: Hc } = ch;
  for (const p of [S, ch.E, Hc]) p.y += body.shrug;
  const E = c1Swivel(S, ch.E, Hc, -1, q[3]);
  const fore = Hc.clone().sub(E).normalize();
  const wristU = Hc.clone().addScaledVector(fore, -WRIST_OFF);
  const w = (p: THREE.Vector3) => c1UpperToWorld(p, root, 0, body, H);
  return { S: w(S), E: w(E), W: w(wristU), Hc: w(Hc) };
};
/** palm center for a wrist blend w toward the world finger direction dir */
const palmOf = (k: ReturnType<typeof fk>, dir: THREE.Vector3 | null, w: number) => {
  const fore = k.Hc.clone().sub(k.W).normalize();
  const d = dir ? fore.clone().lerp(dir, w).normalize() : fore;
  return k.W.clone().addScaledVector(d, WRIST_OFF * H);
};

// ------------------------------------------------------------------ the local IK
/** how far arm points sink into the table slab (squared, meters); the arm stick and hand need ~1 cm of clearance */
const tablePen = (k: ReturnType<typeof fk>, palm: THREE.Vector3, sc: ReachScene) => {
  let pen = 0;
  const top = sc.tableY + 0.0095; // the oilcloth (+4 mm) + the arm stick radius (7 mm) - 1.5 mm: resting on it is fine
  const test = (p: THREE.Vector3) => {
    if (p.x < sc.table.x0 || p.x > sc.table.x1 || p.z < sc.table.z0 - 0.012 || p.z > sc.table.z1) return;
    if (p.y > top || p.y < sc.tableY - 0.05) return;
    pen += (top - p.y) ** 2;
  };
  for (let i = 1; i <= 8; i++) test(k.S.clone().lerp(k.E, i / 8));
  for (let i = 1; i <= 8; i++) test(k.E.clone().lerp(k.W, i / 8));
  test(palm);
  return pen;
};
const cost = (q: Q, target: THREE.Vector3, pref: Q, body: Body, dir: THREE.Vector3 | null, w: number, sc: ReachScene) => {
  const k = fk(q, sc.root, body);
  const palm = palmOf(k, dir, w);
  const reg = (q[0] - pref[0]) ** 2 + (q[1] - pref[1]) ** 2 + (q[2] - pref[2]) ** 2 + 8 * (q[3] - pref[3]) ** 2;
  return palm.distanceToSquared(target) + 1e-8 * reg + 60 * tablePen(k, palm, sc);
};
// shoulder may swing back (elbow behind the body) when the hand comes up out of the lap
const LIM: [number, number][] = [[-55, 170], [0, 150], [-40, 170], [0, 75]];
const clampQ = (q: Q): Q => q.map((v, i) => Math.min(LIM[i][1], Math.max(LIM[i][0], v))) as Q;
/** coordinate descent from the preferred pose with a fixed step schedule (deterministic, no state between frames) */
const solveLocal = (target: THREE.Vector3, pref: Q, body: Body, dir: THREE.Vector3 | null, w: number, sc: ReachScene, start: Q = pref): Q => {
  let q = clampQ([...start] as Q);
  let c = cost(q, target, pref, body, dir, w, sc);
  for (const st of [8, 4, 2, 1, 0.5, 0.25, 0.12, 0.06])
    for (let sweep = 0; sweep < 4; sweep++) {
      let moved = false;
      for (let i = 0; i < 4; i++)
        for (const sg of [1, -1]) {
          const n = [...q] as Q;
          n[i] += sg * st;
          const qn = clampQ(n);
          const cn = cost(qn, target, pref, body, dir, w, sc);
          if (cn < c) {
            q = qn;
            c = cn;
            moved = true;
          }
        }
      if (!moved) break;
    }
  return q;
};
/** a key pose: coarse grid (with the table penalty and a light pull toward `near`), then the local refinement */
const seed = (target: THREE.Vector3, near: Q, body: Body, dir: THREE.Vector3 | null, w: number, sc: ReachScene): Q => {
  let best: Q = near;
  let bc = Infinity;
  for (let a = -40; a <= 150; a += 10)
    for (let b = 0; b <= 140; b += 10)
      for (let f = -20; f <= 160; f += 10)
        for (let sw = 0; sw <= 60; sw += 20) {
        const q: Q = [a, b, f, sw];
        const c = cost(q, target, near, body, dir, w, sc) + 4e-8 * sw * sw;
        if (c < bc) {
          bc = c;
          best = q;
        }
      }
  return solveLocal(target, best, body, dir, w, sc, best);
};

// ------------------------------------------------------------------ the glass contact and the resting hand
/** the palm meets the glass on C1's side, turned 30 deg toward the front so the fingers read from the S2 camera */
const CONTACT_ANG = 30 * D2R;
const RADIAL = new THREE.Vector3(Math.cos(CONTACT_ANG), 0, Math.sin(CONTACT_ANG));
/** palm center: glass outer radius at that height (0.0356) + half the palm thickness (0.0113) + 1 mm */
const CONTACT_R = 0.048;
const CONTACT_UP = 0.05;
const TANGENT = new THREE.Vector3(-Math.sin(CONTACT_ANG), 0, Math.cos(CONTACT_ANG));
/** at the glass: fingers forward around it, tipped 18 deg down, the palm (curl side) toward the glass */
const HAND_DIR = TANGENT.clone().multiplyScalar(Math.cos(18 * D2R)).add(new THREE.Vector3(0, -Math.sin(18 * D2R), 0)).normalize();
const PALM_N = RADIAL.clone().negate();
/** at rest: the right hand lies on the table near its edge, fingers forward and a little inward, palm down.
 * (inkbeat's arm moves in a vertical plane, so a hand coming up out of the lap has to loop the elbow far behind the
 * body to clear the table edge; the hand rests on the table instead.) */
const REST_DIR = new THREE.Vector3(0.18, -0.06, 1).normalize();
const REST_PALM = new THREE.Vector3(0, -1, 0);
const quatOf = (dir: THREE.Vector3, palm: THREE.Vector3) => {
  const y = dir.clone().normalize();
  const z = palm.clone().negate();
  z.addScaledVector(y, -z.dot(y)).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(y, z), y, z));
};
const Q_REST = quatOf(REST_DIR, REST_PALM);
const Q_GLASS = quatOf(HAND_DIR, PALM_N);
/** hand orientation: 0 = resting on the table, 1 = on the glass (slerp), as world finger direction and palm normal */
const handOri = (k: number) => {
  const q = Q_REST.clone().slerp(Q_GLASS, clamp01(k));
  return { dir: new THREE.Vector3(0, 1, 0).applyQuaternion(q), palm: new THREE.Vector3(0, 0, -1).applyQuaternion(q) };
};
export const contactPoint = (cupX: number, sc: ReachScene) => new THREE.Vector3(cupX, sc.cupY + CONTACT_UP, sc.cupZ).addScaledVector(RADIAL, CONTACT_R);
/** palm center at rest: on the oilcloth (+4 mm) + half the palm thickness + 1 mm */
export const restPoint = (sc: ReachScene, at: number[] = REST_AT) => (at.length === 3 ? new THREE.Vector3(at[0], at[1], at[2]) : new THREE.Vector3(at[0], sc.tableY + 0.004 + 0.0113 + 0.001, sc.table.z0 + at[1]));
/** resting palm: x (world) and depth past the table edge (m) */
export const REST_AT: number[] = [-0.16, 0.15];

// ------------------------------------------------------------------ the plan, precomputed once per scene
type PathKeys = { curve: THREE.CatmullRomCurve3; at: number[]; q: Q[] };
type Keys = { lap: boolean; RH: THREE.Vector3; C0: THREE.Vector3; C1: THREE.Vector3; rel: THREE.Vector3; restQ: Q; c0Q: Q; c1Q: Q; relQ: Q; inPath: PathKeys; backPath: PathKeys };
/** a hand path through waypoints, with an IK key pose solved at every waypoint and the arc-length fraction of each */
const pathKeys = (pts: THREE.Vector3[], first: Q, last: Q, body: (u: number) => Body, ori: (u: number) => THREE.Vector3, wOf: (u: number) => number, sc: ReachScene): PathKeys => {
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const N = 400;
  const lens = curve.getLengths(N);
  const total = lens[N];
  const at = pts.map((_, i) => lens[Math.round((i / (pts.length - 1)) * N)] / total);
  const q: Q[] = [first];
  for (let i = 1; i < pts.length - 1; i++) q.push(seed(pts[i], q[i - 1], body(at[i]), ori(at[i]), wOf(at[i]), sc));
  q.push(last);
  return { curve, at, q };
};
const prefOn = (p: PathKeys, u: number): Q => {
  for (let i = 1; i < p.at.length; i++) if (u <= p.at[i]) return lerpQ(p.q[i - 1], p.q[i], (u - p.at[i - 1]) / Math.max(1e-6, p.at[i] - p.at[i - 1]));
  return p.q[p.q.length - 1];
};
const BODY0: Body = { lean: 0, roll: 0, twist: 0, shrug: 0 };
/** the body at the touch and at full reach (the end of the slide) */
const BODY_TOUCH: Body = { lean: 2.5, roll: 1.5, twist: 3, shrug: 0.008 };
const BODY_FULL: Body = { lean: 7, roll: 8, twist: 10, shrug: 0.02 };
const blendBody = (a: Body, b: Body, u: number): Body => ({ lean: lerp(a.lean, b.lean, u), roll: lerp(a.roll, b.roll, u), twist: lerp(a.twist, b.twist, u), shrug: lerp(a.shrug, b.shrug, u) });
/** when the wrist turns from resting to the glass grip (in) and back (out), along the path (0..1) */
const sstep = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const inOri = (u: number) => sstep((u - 0.4) / 0.55);
const outOri = (u: number) => sstep(u / 0.6);
/** wrist override weight: off in the lap (the hand simply follows the forearm, exactly the old resting pose) */
const inW = (lap: boolean) => (u: number) => (lap ? sstep(u / 0.35) : 1);
const outW = (lap: boolean) => (u: number) => (lap ? 1 - sstep((u - 0.65) / 0.35) : 1);
let keysCache: { k: string; v: Keys } | null = null;
const keysOf = (R: ReachPlan, sc: ReachScene): Keys => {
  const k = JSON.stringify([R, sc]);
  if (keysCache?.k === k) return keysCache.v;
  // default rest = C1's old seated arm in the lap (REST_Q, no swivel, no wrist override), so S1 / S3 keep it exactly
  const lap = !R.restAt;
  const RH = lap ? palmOf(fk(REST_Q, sc.root, BODY0), null, 0) : restPoint(sc, R.restAt);
  const C0 = contactPoint(R.cupFromX, sc);
  const C1 = contactPoint(R.cupToX, sc);
  // in: the hand peels up off the table, arcs over and comes down beside the glass, slowing into the touch
  const A3 = C0.clone().addScaledVector(RADIAL, 0.035).add(new THREE.Vector3(0, 0.028, -0.012));
  const rel = C1.clone().addScaledVector(RADIAL, 0.024).add(new THREE.Vector3(0, 0.032, 0));
  let inPts: THREE.Vector3[];
  let outPts: THREE.Vector3[];
  if (lap) {
    // from the lap: back toward the body under the table, up past the edge beside the chest (the elbow swings out
    // and back), then out over the table to the glass; the way back mirrors it, a little lower and slower
    // the waypoints by the chest stay just outside the torso's side (its half-width is ~0.155 m): further in, the
    // forearm ran through the torso (tried 2026-11-15)
    const U1 = new THREE.Vector3(-0.175, sc.tableY - 0.09, sc.table.z0 - 0.05);
    const U2 = new THREE.Vector3(-0.18, sc.tableY + 0.06, sc.table.z0 - 0.035);
    const D2 = new THREE.Vector3(-0.18, sc.tableY + 0.055, sc.table.z0 - 0.035);
    const D1 = new THREE.Vector3(-0.17, sc.tableY - 0.095, sc.table.z0 - 0.055);
    inPts = [RH, U1, U2, A3, C0];
    outPts = [rel, rel.clone().lerp(D2, 0.5).add(new THREE.Vector3(0, 0.02, 0)), D2, D1, RH];
  } else {
    const A1 = RH.clone().add(new THREE.Vector3(-0.005, 0.035, 0.03));
    const A2 = A1.clone().lerp(A3, 0.5).add(new THREE.Vector3(0, 0.03, 0));
    const B2 = RH.clone().add(new THREE.Vector3(-0.004, 0.022, 0.018));
    inPts = [RH, A1, A2, A3, C0];
    outPts = [rel, rel.clone().lerp(B2, 0.5).add(new THREE.Vector3(0, 0.02, 0)), B2, RH];
  }
  const o0 = handOri(0);
  const o1 = handOri(1);
  const restQ = lap ? REST_Q : seed(RH, REST_Q, BODY0, o0.dir, 1, sc);
  const c0Q = seed(C0, restQ, BODY_TOUCH, o1.dir, 1, sc);
  const c1Q = seed(C1, c0Q, BODY_FULL, o1.dir, 1, sc);
  const relQ = solveLocal(rel, c1Q, BODY_FULL, o1.dir, 1, sc);
  const v: Keys = {
    RH,
    C0,
    C1,
    rel,
    restQ,
    c0Q,
    c1Q,
    relQ,
    lap,
    inPath: pathKeys(inPts, restQ, c0Q, (u) => blendBody(BODY0, BODY_TOUCH, u), (u) => handOri(inOri(u)).dir, inW(lap), sc),
    backPath: pathKeys(outPts, relQ, restQ, (u) => blendBody(BODY_FULL, BODY0, u), (u) => handOri(1 - outOri(u)).dir, outW(lap), sc),
  };
  keysCache = { k, v };
  return v;
};

export type ReachState = {
  /** C1 pose fields for the right arm ("L" chain) and the upper body */
  armL: [number, number];
  armLFwd: number;
  swivelL: number;
  body: Body;
  /** wrist override in C1's upper-body frame */
  hand: C1Hand;
  cup: V3;
  /** 0..1 gaze weights (eyes lead the head) and the slide progress (the gaze follows the glass) */
  eyes: number;
  head: number;
  slide: number;
  /** checks: palm target, the solved palm, the hand direction, the remaining error (m), the table penetration (m^2) */
  target: V3;
  palm: V3;
  handDir: V3;
  err: number;
  pen: number;
  phase: string;
};

const bodyAt = (t: number, R: ReachPlan) => {
  const a = TEMPO.body(clamp01((t - R.lift) / (R.touch - R.lift)));
  const s = TEMPO.body(clamp01((t - R.push + 0.08) / (R.stop - R.push - 0.15)));
  const back = TEMPO.settle(clamp01((t - (R.release - 0.08)) / (R.rest - (R.release - 0.08))));
  const k = (f: keyof Body) => (BODY_TOUCH[f] * a + (BODY_FULL[f] - BODY_TOUCH[f]) * s) * (1 - back);
  return { lean: k("lean"), roll: k("roll"), twist: k("twist"), shrug: k("shrug") };
};

/** the right-hand reach at time t (s). Before `lift` and after `rest` the hand lies still on the table. */
export const reachAt = (t: number, R: ReachPlan, sc: ReachScene): ReachState => {
  const K = keysOf(R, sc);
  const body = bodyAt(t, R);
  const slide = TEMPO.slide(clamp01((t - R.push) / (R.stop - R.push)));
  const cupX = lerp(R.cupFromX, R.cupToX, slide);
  let target = K.RH.clone();
  let pref: Q = K.restQ;
  let ori = 0;
  let w = K.lap ? 0 : 1;
  let curl = K.lap ? 0 : 8;
  let phase = "rest";
  if (t >= R.lift && t < R.touch) {
    phase = "approach";
    const u = TEMPO.approach((t - R.lift) / (R.touch - R.lift));
    target = K.inPath.curve.getPointAt(u);
    pref = prefOn(K.inPath, u);
    // the wrist turns toward the glass during the second half of the travel
    ori = inOri(u);
    w = inW(K.lap)(u);
    curl = (K.lap ? 0 : 8) + (K.lap ? 14 : 6) * ori;
  } else if (t >= R.touch && t < R.push) {
    phase = "press";
    const u = TEMPO.press((t - R.touch) / (R.push - R.touch));
    target = K.C0.clone().addScaledVector(RADIAL, -0.0015 * u);
    pref = K.c0Q;
    ori = 1;
    w = 1;
    curl = 14 + 18 * u;
  } else if (t >= R.push && t < R.stop) {
    phase = "slide";
    target = contactPoint(cupX, sc).addScaledVector(RADIAL, -0.0015);
    pref = lerpQ(K.c0Q, K.c1Q, slide);
    ori = 1;
    w = 1;
    curl = 32;
  } else if (t >= R.stop && t < R.release) {
    phase = "release";
    const u = TEMPO.release((t - R.stop) / (R.release - R.stop));
    target = K.C1.clone().addScaledVector(RADIAL, -0.0015).lerp(K.rel, u);
    pref = lerpQ(K.c1Q, K.relQ, u);
    ori = 1;
    w = 1;
    curl = 32 - 20 * u;
  } else if (t >= R.release && t < R.rest) {
    phase = "back";
    const u = TEMPO.back((t - R.release) / (R.rest - R.release));
    target = K.backPath.curve.getPointAt(u);
    pref = prefOn(K.backPath, u);
    ori = 1 - outOri(u);
    w = outW(K.lap)(u);
    curl = (K.lap ? 12 * ori : 8 + 4 * ori);
  }
  const o = handOri(ori);
  const q = phase === "rest" && K.lap ? REST_Q : solveLocal(target, pref, body, o.dir, w, sc);
  const k = fk(q, sc.root, body);
  const palm = palmOf(k, o.dir, w);
  const eyes = TEMPO.eyes((t - R.gazeIn) / 0.2) * (1 - TEMPO.eyes((t - R.gazeOut) / 0.18));
  const head = TEMPO.head((t - R.gazeIn - 0.07) / 0.45) * (1 - TEMPO.head((t - R.gazeOut - 0.06) / 0.6));
  return {
    armL: [q[0], q[1]],
    armLFwd: q[2],
    swivelL: q[3],
    body,
    hand: { dir: c1WorldDirToUpper([o.dir.x, o.dir.y, o.dir.z], 0, body), palm: c1WorldDirToUpper([o.palm.x, o.palm.y, o.palm.z], 0, body), curl, w },
    cup: [cupX, sc.cupY, sc.cupZ],
    eyes,
    head,
    slide,
    target: [target.x, target.y, target.z],
    palm: [palm.x, palm.y, palm.z],
    handDir: [o.dir.x, o.dir.y, o.dir.z],
    err: palm.distanceTo(target),
    pen: tablePen(k, palm, sc),
    phase,
  };
};
/** the hand's wrist / elbow / shoulder in world space for a state (for the numeric checks) */
export const reachJoints = (st: ReachState, sc: ReachScene) => fk([st.armL[0], st.armL[1], st.armLFwd, st.swivelL], sc.root, st.body);
