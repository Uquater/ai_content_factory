// Episode 2026-11-002 world geography (metres). One coordinate system for the interior and the exterior sets, so every
// shot keeps the geography of content.md §3:
//   +x = east (toward the toa), -x = west; +z = south (front, street), -z = north (back, gang); y up, floor/road = 0.
//   Interior cameras face about west (-x): street/front = screen LEFT, back/lorong/back door = screen RIGHT.
//   Exterior from across the street faces north (-z): toa on the screen RIGHT, villagers walk right (+x).
//   POV from the window faces south (+z): the toa is on the screen LEFT.
// House no. 7: one storey, footprint x ∈ [-4.0, 4.0], z ∈ [-5.0, 3.0] (south wall at z = 3.0).
import type { V3 } from "../inkbeat/types";

export const WALL_T = 0.12;
export const CEIL_H = 2.7;

export const HOUSE = { x0: -4.0, x1: 4.0, z0: -5.0, z1: 3.0, h: CEIL_H };

/** bedroom (kamar kamu): east front room; window to the street in its south wall; its door in its west wall */
export const KAMAR = {
  x0: 1.0, x1: 4.0, z0: -1.0, z1: 3.0,
  window: { x: 2.6, w: 1.2, y: 1.35, h: 1.1 }, // centre x on the south wall (z = 3.0)
  door: { z: 0.25, w: 0.9, h: 2.05 }, // centre z on the west wall (x = 1.0), opens into the living room
  bed: { x0: 2.2, x1: 4.0, z0: -0.95, z1: 0.0, top: 0.5 }, // against the north wall, head end at the east wall (x = 4)
  table: { x: 1.65, z: -0.6, top: 0.62 }, // side table by the bed's foot end, the phone lies here
};
/** living room (ruang tamu): west front room; front door + window in its south wall; lamp; switch by the front door */
export const TAMU = {
  x0: -4.0, x1: 1.0, z0: -1.0, z1: 3.0,
  frontDoor: { x: -2.6, w: 0.95, h: 2.1 }, // centre x on the south wall
  window: { x: -0.7, w: 1.4, y: 1.35, h: 1.1 },
  lamp: [-1.5, 2.55, 1.0] as V3, // ceiling lamp
  switch: [-1.98, 1.25, 2.93] as V3, // on the south wall, right of the front door (seen from inside)
  sofa: { x: -2.4, z: -0.55, w: 1.8 }, // against the north wall
};
/** hallway (lorong): from the living room's north side straight back to the kitchen and the back door */
export const LORONG = { x0: -1.4, x1: -0.2, z0: -5.0, z1: -1.0 };
export const DAPUR = { x0: -4.0, x1: 1.0, z0: -5.0, z1: -3.2, backDoor: { x: -0.8, w: 0.9, h: 2.05 } }; // back door in the north wall (z = -5)

/** outside */
export const STREET = {
  fenceZ: 4.2, // our fence line (south of the yard)
  gateX: -2.6, // the gate in front of the front door
  plate: [-1.95, 1.05, 4.26] as V3, // the "7" plate on the fence, east of the gate
  roadZ0: 5.0, roadZ1: 10.0, // asphalt
  walkZ: 6.4, // the villagers' walking line (east-bound)
  oppositeZ: 12.0, // facades across the street (their front walls face north, toward us)
  toa: [18.0, 0, 4.7] as V3, // the pole at the east end of the street (our side)
  toaHornY: 6.2,
  lamps: [[-9.0, 0, 4.7], [6.0, 0, 4.7], [14.0, 0, 10.6]] as V3[],
  gangZ: -6.5, // the narrow alley behind the row (never shown from outside)
};
/** neighbour houses (x centres) on our side and across; each has a door where villagers come out */
export const NEIGHBOURS = {
  ourSide: [-13.0, 9.0], // our house is the one at x = 0
  across: [-10.0, -1.0, 8.0, 17.0],
  width: 7.0,
};
