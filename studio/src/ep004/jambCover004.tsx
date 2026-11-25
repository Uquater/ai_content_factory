// Episode 3 (2026-11-004), owner decision D-057 item 1 (option (i)): a door-frame COVER for the Ep 3 shots only.
// Problem (D-056 S12): `Door` in ep002/sets.tsx (Episode 1–2 code, NOT edited) draws its jambs with the inner faces at
// ±w/2, exactly on the wall opening's reveal faces, and the head's underside at y = h, on the opening's top face. The
// jamb and head boxes also overlap in the two top corners, so their front/back faces coincide there. Coincident faces
// z-fight: a saw-tooth pattern that changes every frame when the lens moves.
// Fix (additive): three new boxes that ENCLOSE the original frame, every exposed face 2 mm outside the original one
// (jamb inner faces at ±(w/2 − 2 mm), head underside at h − 2 mm, front/back at ±(D/2 + 2 mm), outer faces and tops
// +2 mm). The covered original faces and the wall reveal are then 2 mm behind a cover face (depth step at 3 m with
// near 0.02 m and a 24-bit buffer ≈ 0.03 mm, so ~70× margin). The three new boxes do not overlap each other: the head
// sits BETWEEN the jambs (its end faces touch the jambs' inner faces back-to-front, both culled/hidden), so the cover
// creates no new coincident visible faces. Same colour and texture as the frame; no shadows (as the original).
// Shape change: the frame grows by 2 mm on each visible side. Episode 1–2 renders are unaffected (not used there).
import React from "react";
import { boxG, M } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { DAPUR, HOUSE, KAMAR, TAMU, WALL_T } from "../ep002/geo";

export const COVER_INSET = 0.002; // m, declared before the render (D-057 log header)
const FRAME_C = "#efe6d4"; // `Door`'s default frame colour (all three doors use it)
const D = WALL_T + 0.05; // `Door`'s frame depth

const Cover: React.FC<{ p: V3; w: number; h: number; along: "x" | "z" }> = ({ p, w, h, along }) => {
  const e = COVER_INSET;
  const rot: V3 = along === "x" ? [0, 0, 0] : [0, Math.PI / 2, 0];
  const jw = 0.07 + 2 * e; // jamb width: inner face w/2 − e, outer face w/2 + 0.07 + e
  const jh = h + 0.07 + e; // from the floor (y 0, under the 4 mm floor top) to h + 0.07 + e
  const jd = D + 2 * e;
  const jx = w / 2 - e + jw / 2;
  const hw = w - 2 * e; // head between the jambs' inner faces
  const hh = 0.07 + 2 * e; // underside h − e, top h + 0.07 + e
  return (
    <group position={p} rotation={rot}>
      <M g={boxG(jw, jh, jd)} c={FRAME_C} tex="wood" p={[-jx, jh / 2, 0]} cast={false} />
      <M g={boxG(jw, jh, jd)} c={FRAME_C} tex="wood" p={[jx, jh / 2, 0]} cast={false} />
      <M g={boxG(hw, hh, jd)} c={FRAME_C} tex="wood" p={[0, h - e + hh / 2, 0]} cast={false} />
    </group>
  );
};

/** the covers for the three doors of house no. 7, at the same transforms as `HouseInterior` draws them
 * (back door with backDoorShake = 0: every Ep 3 shot code passes 0) */
export const JambCovers004: React.FC<{ back?: boolean; kamar?: boolean; front?: boolean }> = ({ back = true, kamar = true, front = true }) => (
  <>
    {kamar ? <Cover p={[KAMAR.x0, 0, KAMAR.door.z]} w={KAMAR.door.w} h={KAMAR.door.h} along="z" /> : null}
    {front ? <Cover p={[TAMU.frontDoor.x, 0, HOUSE.z1]} w={TAMU.frontDoor.w} h={TAMU.frontDoor.h} along="x" /> : null}
    {back ? <Cover p={[DAPUR.backDoor.x, 0, HOUSE.z0]} w={DAPUR.backDoor.w} h={DAPUR.backDoor.h} along="x" /> : null}
  </>
);
