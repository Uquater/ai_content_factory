// When does the viewer first see the cloth / the covered lens, per variant? (composition frame, shot time, film time)
import { camFor, inFrame, totalFrames } from "../src/ep005/cams005";
import type { Variant } from "../src/ep005/cams005";
import { CLOTH_HANG, EV, LENS_T, clothAt, fanAt } from "../src/ep005/motion005";
for (const v of ["A", "B", "C"] as Variant[]) {
  const n = totalFrames(v);
  let firstCloth = -1, firstHang = -1, firstFanHead = -1;
  for (let f = 0; f < n; f++) {
    const { cam, w } = camFor(v, f);
    const c = clothAt(w);
    if (firstFanHead < 0 && inFrame(cam, fanAt(w).head as never)) firstFanHead = f;
    if (firstCloth < 0 && c.mode !== "fan" && inFrame(cam, CLOTH_HANG.c)) firstCloth = f;
    if (firstHang < 0 && c.mode === "hang" && inFrame(cam, LENS_T as never)) firstHang = f;
  }
  let toaF = -1;
  for (let f = 0; f < n; f++) if (toaF < 0 && camFor(v, f).w >= EV.toa + 0.05) toaF = f;
  console.log(`${v}: frames ${n} (${(n / 30).toFixed(2)} s) | toa caption film ${(toaF / 30).toFixed(2)} s | cloth first in frame while falling/hanging: film ${(firstCloth / 30).toFixed(2)} s | lens in frame with cloth hanging: film ${(firstHang / 30).toFixed(2)} s | fan head first in frame ${(firstFanHead / 30).toFixed(2)} s`);
}
console.log("cloth falls", EV.cloth.join("-"), "s world; toa", EV.toa, "s world");
