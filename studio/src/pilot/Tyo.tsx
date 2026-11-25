// C2 "Tyo" for pilot 2026-11-001 — a DESIGN PROPOSAL (not approved yet; see content.md §6.4). Same stick family and
// rig as C1 (C1.tsx with a different StickLook), so the arm IK and sleeves work unchanged. Identity comes from the
// torso outfit, hair and props (STRICT BODY RULE): a slightly taller oval head, short dark hair, a muted light-blue
// collared office shirt with a chest pocket, plain oval hands (no fingers), an office ID card on a lanyard, NO "Uq".
import React, { useMemo } from "react";
import * as THREE from "three";
import { canvasTex } from "../inkbeat/core/kit";
import { taperTube } from "../inkbeat/char/geometry";
import { Inked } from "../inkbeat/char/Inked";
import { charMat } from "../inkbeat/char/material";
import { INK_K, HEAD_HW } from "../inkbeat/char/family";
import { C1_BUILD, POCKET, teeSurface } from "../c1/C1";
import { layoutOf } from "../inkbeat/char/skeleton";
import type { StickLook } from "../c1/C1";

export const TYO_LOOK: StickLook = {
  id: "C2-tyo-proposal-1",
  head: { sx: 0.95, sy: 1.12 },
  shirt: { kind: "office", color: "#86acc8", dark: "#5f84a3", cuff: "#55779a" },
  hands: "mitt",
  face: { smileW: 1.25 },
  hair: { color: "#2b2427" },
};
export const TYO_HEIGHT = 1.56;

const W = INK_K * HEAD_HW * 2;
/** ID card size (h = 1): about 5 x 7 cm on Tyo */
const CARD = { w: 0.032, h: 0.046 };
const lerpV = (a: THREE.Vector3, b: THREE.Vector3, u: number) => a.clone().lerp(b, u);
const ease = (x: number) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};

/** the card center and facing (torso-local, h = 1) for a tuck progress: 0 = held out in front of the chest by the
 * left hand, 1 = slid into the chest pocket with ~1 cm still showing above its edge */
export const cardPose = (tuck: number) => {
  const held = teeSurface(0.14, 0.6, 0.026);
  const inPocket = teeSurface(POCKET.xr, 0.668, 0.0045);
  const atPocket = teeSurface(POCKET.xr, 0.81, 0.013); // just above the pocket mouth, before it slides down
  const u = Math.min(1, Math.max(0, tuck));
  const a = ease(u / 0.7);
  const b = ease((u - 0.7) / 0.3);
  const p = u < 0.7 ? lerpV(held.p, atPocket.p, a) : lerpV(atPocket.p, inPocket.p, b);
  const n = (u < 0.7 ? lerpV(held.n, atPocket.n, a) : lerpV(atPocket.n, inPocket.n, b)).normalize();
  return { p, n };
};

const cardTex = () =>
  canvasTex("tyo-id-card", 256, 368, (g, w, h) => {
    g.fillStyle = "#f6f7f9";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#2f5d9a";
    g.fillRect(0, 0, w, h * 0.2);
    g.fillStyle = "#f6f7f9";
    g.beginPath();
    g.arc(w * 0.18, h * 0.1, h * 0.05, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#c9ced8";
    g.fillRect(w * 0.28, h * 0.28, w * 0.44, h * 0.32);
    g.fillStyle = "#9aa3b2";
    g.beginPath();
    g.arc(w * 0.5, h * 0.4, h * 0.06, 0, Math.PI * 2);
    g.fill();
    g.fillRect(w * 0.38, h * 0.48, w * 0.24, h * 0.12);
    g.fillStyle = "#3a3f4a";
    g.fillRect(w * 0.18, h * 0.68, w * 0.64, h * 0.05);
    g.fillStyle = "#8a92a0";
    g.fillRect(w * 0.26, h * 0.78, w * 0.48, h * 0.035);
    g.fillStyle = "#2f5d9a";
    g.fillRect(0, h * 0.92, w, h * 0.08);
    // the clip hole
    g.fillStyle = "#c9ced8";
    g.fillRect(w * 0.42, h * 0.025, w * 0.16, h * 0.035);
  });

const faceQuat = (n: THREE.Vector3) => {
  const z = n.clone().normalize();
  const x = new THREE.Vector3(0, 1, 0).cross(z).normalize();
  const y = z.clone().cross(x);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
};

/** worn on Tyo's chest (pass as C1's `chest` prop): lanyard, ID card, and the pocket's front flap (the card slides in
 * behind it). `tuck` 0..1 moves the card from the hand to the pocket. */
export const TyoChest: React.FC<{ tuck: number }> = ({ tuck }) => {
  const card = cardPose(tuck);
  const key = tuck.toFixed(3);
  const strap = useMemo(() => {
    const top = card.p.clone().addScaledVector(new THREE.Vector3(0, 1, 0), CARD.h / 2);
    const mk = (xr: number) => {
      // around the neck (just outside the neck cylinder, over the collar), then down the chest to the card clip
      const L0 = layoutOf(C1_BUILD);
      const s = Math.sign(xr);
      const back = new THREE.Vector3(s * 0.012, L0.torsoH + 0.012, -0.012);
      const neck = new THREE.Vector3(s * 0.019, L0.torsoH + 0.004, 0.006);
      const collar = teeSurface(s * 0.22, 0.93, 0.004).p;
      const mid = teeSurface(xr * 0.4 + 0.05 * s, 0.82, 0.005).p;
      const pts = new THREE.CatmullRomCurve3([back, neck, collar, mid.lerp(top, 0.3), top], false, "centripetal").getPoints(24);
      return taperTube(pts, 0.0016, 0.0016, 16, 6);
    };
    return [mk(-0.3), mk(0.3)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const pocket = teeSurface(POCKET.xr, POCKET.v, 0.0068);
  const strapMat = charMat("#2c4f8f", { spec: 0.1 });
  const flapMat = charMat(TYO_LOOK.shirt.color, { spec: 0.15 });
  const cardMat = useMemo(() => new THREE.MeshToonMaterial({ map: cardTex() }), []);
  return (
    <group>
      {strap.map((g, i) => (
        <Inked key={i} geo={g} mat={strapMat} ink={0} />
      ))}
      <mesh position={card.p} quaternion={faceQuat(card.n)} material={cardMat} castShadow>
        <boxGeometry args={[CARD.w, CARD.h, 0.0015]} />
      </mesh>
      <group position={pocket.p} quaternion={faceQuat(pocket.n)}>
        <Inked geo={flapGeo()} mat={flapMat} ink={W * 0.18} under={0.2} />
      </group>
    </group>
  );
};
let flapG: THREE.BufferGeometry | null = null;
const flapGeo = () => (flapG ??= new THREE.BoxGeometry(POCKET.w, POCKET.h, 0.0016));
