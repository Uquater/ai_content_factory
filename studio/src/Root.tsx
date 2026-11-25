import React from "react";
import { Composition } from "remotion";
import { Demo, DEMO_MOODS } from "./demo/Demo";
import { DemoCast } from "./demo/DemoCast";
import { DemoMove, MOVE_FRAMES } from "./demo/DemoMove";
import { SUB } from "./inkbeat/core/frame";
import { C1Sheet } from "./c1/C1Sheet";
import { WarungLook } from "./c1/WarungLook";
import { DEMO_FPS, DEMO_FRAMES, WarungDemo } from "./c1/WarungDemo";
import { Pilot, PILOT_FPS, PILOT_FRAMES, TyoProposal } from "./pilot/Pilot";
import { CastLineup } from "./cast/CastLineup";
import { CarryClose, CarryPreview, CastDetail, NightCheck } from "./cast/CastReview";
import { SET_VIEWS, SetCheck } from "./ep002/SetCheck";
import { Animatic, EP002_FPS, EP002_FRAMES, WalkTest } from "./ep002/Animatic";
import { LOOKDEV_VIEWS, LookDev002 } from "./ep002/LookDev";
import { PilotV3, V3_FPS, V3_FRAMES } from "./ep002/PilotV3";
import { CastV3Lineup } from "./ep002/CastV3Lineup";
import { SetDebug } from "./ep002/SetDebug";
import { AnimaticV3, AV3_FPS, AV3_FRAMES } from "./ep002/AnimaticV3";
import { PILOT_FPS as P002_FPS, PILOT_FRAMES as P002_FRAMES, Pilot002, SUB as P002_SUB } from "./ep002/Pilot";
import { LOOKDEV003_VIEWS, LookDev003, LookDev003v2, LookDev003v3 } from "./ep003/LookDev003";
import { LD003_V3_IDS } from "./ep003/ld003SceneV3";
import { Pilot003, Pilot003v2, Pilot003v3, PILOT003_FPS, PILOT003_FRAMES, PILOT003V2_FRAMES, PILOT003V3_FRAMES } from "./ep003/Pilot003";
import { LD003_V2_IDS } from "./ep003/ld003Scene";
import { Episode003, EPISODE003_FPS, EPISODE003_FRAMES } from "./ep003/Episode003";
import { LD004_IDS, LookDev004 } from "./ep004/LookDev004";
import { Pilot004, PILOT004_FPS, PILOT004_FRAMES } from "./ep004/Pilot004";
import { M004_LIST, m004Frames, Motion004 } from "./ep004/MotionTest004";
import { A005_FRAMES, Animatic005 } from "./ep005/Animatic005";
import { A005V2_FRAMES, Animatic005v2 } from "./ep005/Animatic005v2";
import { LD005_IDS, LookDev005 } from "./ep005/LookDev005";
import { Pilot005, PILOT005_FRAMES } from "./ep005/Pilot005";
import { Pilot005v2, PILOT005V2_FRAMES } from "./ep005/Pilot005v2";
import { Pilot005v3, PILOT005V3_FRAMES } from "./ep005/Pilot005v3";
import { Episode005, EPISODE005_FRAMES } from "./ep005/Episode005";
import { E004_SHOTS, Ep004Shot } from "./ep004/Episode004Shot";
import { Episode004, EPISODE004_FRAMES } from "./ep004/Episode004";
import { PREP006_VIEWS, Prep006 } from "./ep006/Prep006";
import { CLOSE006_FRAMES, Close006 } from "./ep006/Close006";
import { CHAN006_VIEWS, Chan006 } from "./ep006/Chan006";
import { EPISODE006_FRAMES, Episode006 } from "./ep006/Episode006";

// DemoHero: a low hero framing with foreground props. Demo: one still. Demo-<mood>: the same frame in each act light. DemoWide: the whole set.
// DemoCast: the three example characters in a row (a landscape family sheet).
// DemoMove: a 3 s beat-rig move (sharp). DemoMoveSub: the same at SUB × fps for motion blur (average with ffmpeg tmix).
export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: false }} />
    <Composition id="DemoHero" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "dusk", wide: false, hero: true }} />
    <Composition id="DemoWide" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: true }} />
    {DEMO_MOODS.map((m) => (
      <Composition key={m} id={`Demo-${m}`} component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: m, wide: false }} />
    ))}
    <Composition id="DemoCast" component={DemoCast} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mood: "day" }} />
    <Composition id="DemoMove" component={DemoMove} durationInFrames={MOVE_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="DemoMoveSub" component={DemoMove} durationInFrames={MOVE_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="C1Sheet" component={C1Sheet} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mood: "day" }} />
    <Composition id="Warung-wide" component={WarungLook} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "golden", variant: "wide" as const }} />
    <Composition id="Warung-medium" component={WarungLook} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "golden", variant: "medium" as const }} />
    <Composition id="Warung-reach" component={WarungLook} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "golden", variant: "reach" as const }} />
    <Composition id="WarungDemo" component={WarungDemo} durationInFrames={DEMO_FRAMES} fps={DEMO_FPS} width={1080} height={1920} />
    <Composition id="Pilot" component={Pilot} durationInFrames={PILOT_FRAMES} fps={PILOT_FPS} width={1080} height={1920} />
    <Composition id="TyoProposal" component={TyoProposal} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ close: false }} />
    <Composition id="TyoProposal-close" component={TyoProposal} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ close: true }} />
    {/* 2026-11-002 cast lineup (C1 + adik + NPC presets) and its QC views */}
    <Composition id="CastLineup002" component={CastLineup} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "front" as const }} />
    <Composition id="CastLineup002-threeq" component={CastLineup} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "threeq" as const }} />
    <Composition id="CastLineup002-back" component={CastLineup} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "back" as const }} />
    <Composition id="CarryPreview002" component={CarryPreview} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="CastDetail002-hair" component={CastDetail} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ part: "hair" as const }} />
    <Composition id="CastDetail002-hands" component={CastDetail} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ part: "hands" as const }} />
    <Composition id="NightCheck002" component={NightCheck} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="CarryClose002-front" component={CarryClose} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "front" as const }} />
    <Composition id="CarryClose002-side" component={CarryClose} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "side" as const }} />
    <Composition id="CarryClose002-below" component={CarryClose} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "below" as const }} />
    {/* episode 2026-11-002: set check stills, walk test, animatic (D-027) */}
    {SET_VIEWS.map((v) => (
      <Composition key={v} id={`Ep002Set-${v}`} component={SetCheck} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: v }} />
    ))}
    {LOOKDEV_VIEWS.map((v) => (
      <Composition key={v} id={`LookDev002-${v}`} component={LookDev002} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: v }} />
    ))}
    {LOOKDEV_VIEWS.map((v) => (
      <Composition key={`v2-${v}`} id={`LookDev002v2-${v}`} component={LookDev002} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: v, v: 2 as const }} />
    ))}
    <Composition id="Pilot002" component={Pilot002} durationInFrames={P002_FRAMES} fps={P002_FPS} width={1080} height={1920} />
    <Composition id="Pilot002Sub" component={Pilot002} durationInFrames={P002_FRAMES * P002_SUB} fps={P002_FPS * P002_SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="Pilot002v3-A02A04" component={PilotV3} durationInFrames={V3_FRAMES} fps={V3_FPS} width={1080} height={1920} />
    <Composition id="CastV3-front" component={CastV3Lineup} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ view: "front" as const }} />
    <Composition id="CastV3-carry" component={CastV3Lineup} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: "carry" as const }} />
    <Composition id="Ep002AnimaticV3" component={AnimaticV3} durationInFrames={AV3_FRAMES} fps={AV3_FPS} width={1080} height={1920} />
    <Composition id="Ep002AnimaticV4" component={AnimaticV3} durationInFrames={AV3_FRAMES} fps={AV3_FPS} width={1080} height={1920} defaultProps={{ env: "v4" as const }} />
    <Composition id="Ep002Final" component={AnimaticV3} durationInFrames={AV3_FRAMES} fps={AV3_FPS} width={1080} height={1920} defaultProps={{ env: "final" as const }} />
    <Composition id="Ep002Cover" component={AnimaticV3} durationInFrames={AV3_FRAMES} fps={AV3_FPS} width={1080} height={1920} defaultProps={{ env: "final" as const, captions: false }} />
    <Composition id="Ep002AnimaticV5" component={AnimaticV3} durationInFrames={AV3_FRAMES} fps={AV3_FPS} width={1080} height={1920} defaultProps={{ env: "v5" as const }} />
    <Composition id="SetDebug-full" component={SetDebug} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ house7: "full" as const, tamuLit: 0 }} />
    <Composition id="SetDebug-none" component={SetDebug} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ house7: "none" as const, tamuLit: 0 }} />
    <Composition id="Ep002WalkTest" component={WalkTest} durationInFrames={240} fps={30} width={1080} height={1920} />
    <Composition id="Ep002Animatic" component={Animatic} durationInFrames={EP002_FRAMES} fps={EP002_FPS} width={1080} height={1920} />
    {/* episode 2026-11-003 (Episode 2): kitchen look-dev + torch light test stills (D-037) */}
    {LOOKDEV003_VIEWS.map((v) => (
      <Composition key={`ld003-${v}`} id={`LookDev003-${v}`} component={LookDev003} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: v }} />
    ))}
    {LD003_V2_IDS.map((v) => (
      <Composition key={`ld003v2-${v}`} id={`LookDev003v2-${v}`} component={LookDev003v2} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id: v }} />
    ))}
    {LD003_V3_IDS.map((v) => (
      <Composition key={`ld003v3-${v}`} id={`LookDev003v3-${v}`} component={LookDev003v3} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id: v }} />
    ))}
    {/* 2026-11-003 pilot S03–S06 (D-039) */}
    <Composition id="Pilot003" component={Pilot003} durationInFrames={PILOT003_FRAMES} fps={PILOT003_FPS} width={1080} height={1920} />
    {/* 2026-11-003 pilot v2 (owner note 2026-11-18: S03 glass insert, S06 flashback; D-041 pending) */}
    <Composition id="Pilot003v2" component={Pilot003v2} durationInFrames={PILOT003V2_FRAMES} fps={PILOT003_FPS} width={1080} height={1920} />
    {/* 2026-11-003 pilot v3 (owner 2026-11-18: lifted steps, S05 on the toa switch-on, wider insert; D-042 pending) */}
    <Composition id="Pilot003v3" component={Pilot003v3} durationInFrames={PILOT003V3_FRAMES} fps={PILOT003_FPS} width={1080} height={1920} />
    {/* 2026-11-003 full episode S01–S12, draft (owner 2026-11-18: pilot v3 approved as the reference; D-043 pending) */}
    <Composition id="Episode003" component={Episode003} durationInFrames={EPISODE003_FRAMES} fps={EPISODE003_FPS} width={1080} height={1920} />
    {/* 2026-11-004 (Episode 3) look-dev v1: new assets only (owner 2026-11-20, D-048) */}
    {LD004_IDS.map((v) => (
      <Composition key={`ld004-${v}`} id={`LookDev004-${v}`} component={LookDev004} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id: v }} />
    ))}
    {/* 2026-11-004 (Episode 3) pilot v1: Blok A 0–6.8 s + Blok B 27.4–35.0 s (owner 2026-11-20, D-049) */}
    <Composition id="Pilot004" component={Pilot004} durationInFrames={PILOT004_FRAMES} fps={PILOT004_FPS} width={1080} height={1920} />
    {/* 2026-11-004 (Episode 3) motion tests: four untested motions, strips + crops only (owner 2026-11-20, D-053) */}
    {/* D-056: Episode 3 full-episode shots, one test composition per shot (image sequences for QC only) */}
    {/* 2026-11-004 (Episode 3) full episode assembly, preview only (owner 2026-11-21, D-058) */}
    <Composition id="Episode004" component={Episode004} durationInFrames={EPISODE004_FRAMES} fps={30} width={1080} height={1920} />
    {E004_SHOTS.map((p) => (
      <Composition key={`e004-${p.id}`} id={`Ep004Shot-${p.id}`} component={Ep004Shot} durationInFrames={p.frames} fps={30} width={1080} height={1920} defaultProps={{ id: p.id }} />
    ))}
    {LD005_IDS.map((id) => (
      <Composition key={`ld005-${id}`} id={`LookDev005-${id}`} component={LookDev005} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id }} />
    ))}
    <Composition id="Pilot005" component={Pilot005} durationInFrames={PILOT005_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: false }} />
    <Composition id="Pilot005-hud" component={Pilot005} durationInFrames={PILOT005_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: true }} />
    <Composition id="Pilot005v2" component={Pilot005v2} durationInFrames={PILOT005V2_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: false }} />
    <Composition id="Pilot005v2-hud" component={Pilot005v2} durationInFrames={PILOT005V2_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: true }} />
    <Composition id="Pilot005v3" component={Pilot005v3} durationInFrames={PILOT005V3_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: false }} />
    <Composition id="Pilot005v3-hud" component={Pilot005v3} durationInFrames={PILOT005V3_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: true }} />
    <Composition id="Episode005" component={Episode005} durationInFrames={EPISODE005_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: false }} />
    <Composition id="Episode005-hud" component={Episode005} durationInFrames={EPISODE005_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: true }} />
    <Composition id="Animatic005v2" component={Animatic005v2} durationInFrames={A005V2_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: false }} />
    <Composition id="Animatic005v2-hud" component={Animatic005v2} durationInFrames={A005V2_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: true }} />
    {(["A", "B", "C"] as const).map((v) => (
      <Composition key={`a005-${v}`} id={`Animatic005-${v}`} component={Animatic005} durationInFrames={A005_FRAMES(v)} fps={30} width={1080} height={1920} defaultProps={{ variant: v }} />
    ))}
    {M004_LIST.map((p) => (
      <Composition key={`m004-${p.clip}-${p.variant}`} id={`Motion004-${p.clip}-${p.variant}`} component={Motion004} durationInFrames={m004Frames(p)} fps={30} width={1080} height={1920} defaultProps={p} />
    ))}
    {/* episode 2026-11-006: visual prep stills before VO (storyboard v0.1, grey box) */}
    {PREP006_VIEWS.map((v) => (
      <Composition key={`p006-${v}`} id={`Prep006-${v}`} component={Prep006} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: v }} />
    ))}
    <Composition id="Close006" component={Close006} durationInFrames={CLOSE006_FRAMES} fps={30} width={1080} height={1920} />
    {CHAN006_VIEWS.map((v) => (
      <Composition key={`c006-${v}`} id={`Chan006-${v}`} component={Chan006} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ view: v }} />
    ))}
    <Composition id="Episode006" component={Episode006} durationInFrames={EPISODE006_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: false }} />
    <Composition id="Episode006-hud" component={Episode006} durationInFrames={EPISODE006_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ hud: true }} />
  </>
);
