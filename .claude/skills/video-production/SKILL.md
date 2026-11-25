---
name: video-production
description: MANDATORY first read for any video work in studio/ (look-dev, set, character, camera, animatic, render, QC); it says which other skills and the style target to load. Build, render and check a 9:16 3D toon short in studio/ (Remotion 4.0.540 + React Three Fiber 9.8.2 + three 0.186.1, the inkbeat pipeline) for a Content Unit — the approved C1 "Uq" character and its stick family (StickLook), the warung set, the reach rig, a plan JSON with text/timing/shots/beats, overwrite-safe render commands, and QC on the saved MP4 (ffprobe, contact sheet, 1:1 crops, every-frame strips, numeric reach checks). Top layer of the video skill stack — its rules override the vendor reference skills threejs-* (cloudai-x) and remotion-* (remotion-dev); see §8–§10 and .claude/skills/VENDOR.md. Use when staging scenes, adding a character look, re-rendering the pilot or a demo, checking a render, or before applying advice from a threejs-*/remotion-* skill.
metadata:
  version: "0.3"
---

# video-production v0.2 (jalur 3D, `studio/`)

Written from real runs on 2026-11-15 (Content Unit 2026-11-001): the 3D demo, C1 revision 1 (approved, DECISION-LOG
D-021) and the pilot rough cut (D-022). Only executed and verified steps are described; untested stages are listed
in §7. ~~The old 2D path (Pillow + FFmpeg) is kept as history in `archive-2d-v0.1.md`, not as a working path.~~ [SUPERSEDED: the 2D
path and its archive were deleted, D-029.]

> **Active guide (2026-11-17):** `02-CHANNELS/lab/STUDIO-WORKFLOW.md` §7–§10 (priorities D-032, "smooth", proven
> mistakes with their cheapest checks, reusable components, pre-production checklist). Sections marked [SUPERSEDED]
> below are history, not instructions.

## 1. Where things are
| What | Path |
|---|---|
| Project (Remotion 4 + R3F; `npm ci` already done) | `studio/` — `node_modules/`, `out/`, `build/` are not in Git |
| C1 (approved), its look system, contact shadow | `studio/src/c1/C1.tsx` (`C1`, `C1_LOOK`, `StickLook`, `teeSurface`, `stickHeadCenter`, `stickHeadTop`) |
| Rig numbers + transforms shared by drawing and IK | `studio/src/c1/c1rig.ts` (`C1_BUILD` incl. `shoulderT`, `c1UpperMatrix`, `c1Swivel`) |
| C1's reach for the glass (pure function of t) | `studio/src/c1/reach.ts` (`reachAt(t, plan, scene)`) |
| Warung set, chair, coffee | `studio/src/c1/Warung.tsx` (`tyoChairX`, `spareCoffee` props; defaults = demo) |
| Pilot rough cut | `studio/src/pilot/` — `Pilot.tsx`, `pilot-plan.json`, `Tyo.tsx`, `props.tsx`, `overlay.tsx` |
| Demo (comparison only) | `studio/src/c1/WarungDemo.tsx` + `demo-plan.json` |
| Episode 2026-11-002 animatic (D-027): plan, sets, overlays, walk | `studio/src/ep002/` (`Animatic.tsx`, `plan-2026-11-002.json` built by `scripts/ep002_animatic_prep.py`, `geo.ts`, `sets.tsx`, `overlay.tsx`, `WalkTest.tsx`); walk `studio/src/cast/walk.ts` + `Walker.tsx`; render `npm run render:animatic002`; QC `python tools/ep002_qc.py`, keys `bash tools/ep002_keys.sh`, numbers `tools/cast_check.ts` |
| NPC presets + adik (2026-11-002, proposals) and the cast lineup still | `studio/src/cast/npc.tsx` (`Npc`, `NpcPreset`, `ADIK`, `BAPAK`, `IBU`, `ANAK_WARGA`, `HAIR`), `studio/src/cast/CastLineup.tsx` (`CastLineup002`, `-threeq`, `-back`); guide `03-KNOWLEDGE/tools/npc-presets.md` |
| Outputs | `_media/<content-id>/out/` |
| Lessons | `03-KNOWLEDGE/lessons/2026-11-15-demo-render-c1.md`, `2026-11-15-c1-rev1-bahu-dan-gerak.md` |

## 2. Rules that held up
- Every frame is a pure function of the frame number (no clocks, no random, no state between frames).
- Text, timing, shots and story beats live in a plan JSON; code only stages them. Provisional timing is labelled in
  the plan (`"timing": "provisional"`) and on screen until real voice-over timing replaces it.
- New characters are a `StickLook` of the C1 family (same rig), passed as `<C1 look={...} />`. C1's default look must
  stay pixel-identical: after touching `C1.tsx`, render a still and diff it against one rendered before
  (`ImageChops.difference(...).getbbox()` must be `None`).
- Never mirror C1. "Uq" sits on C1's anatomical left chest (+x). Other characters never wear "Uq".
- Captions sit at 70% of the height. Keep faces, hands, the glass and other key props out of that band (check each
  shot's still). The choice cards sit at the top, so put faces lower (`aim(..., face ≈ 0.55–0.6)`).
- inkbeat's arm moves in a vertical plane. A reach across a table needs elbow swivel (`c1Swivel`) and a table
  constraint (`reach.ts`), or the elbow sinks into the tabletop.

## 3. Commands (run from `studio/`)
| Purpose | Command | Output |
|---|---|---|
| Typecheck | `npm run typecheck` | — |
| One still | `npx remotion still src/index.ts <Comp> out/rev/x.png --frame=<n> --gl=angle --timeout=240000` | PNG |
| Pilot rough cut (~3 min) | `npm run render:pilot` | `_media/2026-11-001/out/pilot_2026-11-001_roughcut_v1.mp4` |
| C1 revision demo (~1 min) | `npm run render:demo3d-rev1` | `_media/2026-11-001/out/demo3d_c1_rev1.mp4` |
| Tyo proposal still | `npm run still:tyo` | `_media/2026-11-001/out/c2_tyo_usulan_v1.png` |
| Reach numbers per frame | `npm run check:reach` | table + `WORST` line |

- Renders end in `node tools/finish_render.mjs <picture> <out> [audio]`, which muxes audio (silent AAC if none) and
  **refuses to overwrite** an existing file (exit 3). For a new version, change the output name in `package.json`
  (e.g. `_v2`). Use `FORCE=1` only for a file you made in this session that nobody has reviewed yet.
- `demo3d_c1.mp4` (the first 3D demo) can no longer be re-rendered from the current code. It is a comparison asset;
  its md5 is recorded in content.md §6.3.

## 4. Steps
1. Read the Content Unit (`04-PRODUCTION/<id>/content.md`: script, storyboard) and `CHANNEL-DNA`.
2. Write or extend the plan JSON: lines (text + start/end), shots (id, start, end), beats (story moments).
3. Stage shots in a composition: one `shotCam(id, u, t)` per shot (`aim` + eased `camLerp`), characters, props,
   overlays. Register it in `src/Root.tsx`.
4. Render 8–12 key stills across all shots. Fix framing (heads cut, caption over props, numbers out of frame) before
   any full render.
5. Moving hands: check them numerically first (`check:reach` pattern: palm error, table penetration, joint step per
   frame), then from the real camera.
6. Full render. Then QC (§5) and record the results in content.md.

## 5. QC that was actually run
- `ffprobe`: 1080×1920, 30/1 fps, frame count = duration × 30, h264 + aac.
- Contact sheet: `ffmpeg -i <mp4> -vf "fps=1,scale=216:384,tile=9x5" -frames:v 1 <sheet>.jpg`.
- 1:1 crops of faces, shoulders and hands; every-frame strips (`tools/rev_sheet.py`) for fast motion.
- Luma per frame (`signalstats` YAVG): no one-frame spikes outside cuts.
- Comparison assets: `md5sum` before and after a render session.

## 6. Character looks (pilot 2026-11-001) — [SUPERSEDED for new work by D-031: all characters bodied + pants, `C1_BODIED`, `ep002/castV3.ts`; the stick looks below are history]
- `C1_LOOK`: approved (D-021).
- `TYO_LOOK` (`src/pilot/Tyo.tsx`): a **proposal**, not approved. Office shirt with pocket, ID card on a lanyard
  (`TyoChest`, `tuck` 0..1), oval hands, short hair.
- 2026-11-002 (run 2026-11-16, stills only): `ADIK`, `BAPAK`, `IBU`, `ANAK_WARGA` presets drawn by `Npc` on C1's rig —
  **proposals** (references approved in D-025, models not). Tested standing in `day` light from front, 3/4 and back.
  Review stills: `_media/2026-11-002/out/cast_lineup_v3.png`, `carry_ibu_balita_v1.png` (D-026 revision: `"oval"`
  NPC hands, `proportions` slot for the toddler `BALITA`, `IbuGendong` static carry pose in `src/cast/carry.tsx`).
  Lessons: light albedos render near white in `day` and hues drift (pick darker albedos, sample pixels, correct
  once); a hair shell cut per vertex
  gives a stair-step hairline (remap latitude instead); anything wide that pierces the tee's ink hull draws ink dots
  (start pants just below it); `remotion still` overwrites silently (new name, then `cp -n`).
  `03-KNOWLEDGE/lessons/2026-11-16-npc-preset-3d.md`.

## 7. Not tested yet — [OUTDATED 2026-11-17: voice-over, SFX, motion blur and a full episode have since been done; see STUDIO-WORKFLOW §9 for current test limits]
- Voice-over and syncing to real word timing (no TTS or recording exists yet).
- Final QC checklist and owner approval of a pilot video; publishing.
- Motion blur (inkbeat `DemoMoveSub` path), music/SFX.

---

# v0.3 additions (2026-11-16, DECISION-LOG D-024 — approved by the owner 2026-11-16; `remotion-docs` removed)

Sections 1–7 above are v0.2 and unchanged. v0.3 only adds the skill stack below. Vendor skills are reference
material written for live, interactive apps; this project renders offline, frame by frame. Read the overrides before
copying any vendor example.

## 8. Skill stack & precedence
| Rank | Layer | Where | Role |
|---|---|---|---|
| 1 | `CLAUDE.md` | repo root | project rules (owner approval, privacy, copyright, no fabrication) |
| 1b | **style target** `03-KNOWLEDGE/research/2026-11-16-style-target-badai-matahari.md` | Obsidian vault | the owner's reference, measured (night darkness, cuts/min, still share, audio bed, UI). D-028 |
| 2 | `video-production` (this skill) | `.claude/skills/video-production/` | project rules for video: determinism, C1, captions, overwrite-safe renders, QC |
| 2b | `inkbeat-shorts` | `.claude/skills/inkbeat-shorts/` (MIT, the owner's pipeline skill, D-028) | craft: lenses, framing, sets and props, light per act, physical plausibility, flicker, QA, audio levels |
| 3 | `remotion-markup`, `remotion-render`, `remotion-captions` | user level `~/.claude/skills/` (not in Git; licence unclear) | Remotion technique reference |
| 4 | `threejs-fundamentals`, `-geometry`, `-materials`, `-lighting`, `-animation`, `-react-three-fiber`, `-postprocessing`, `-performance` | `.claude/skills/threejs-*` (MIT) | three.js / R3F technique reference |

- When a lower layer contradicts a higher one, the higher layer wins. Do not "merge" the two.
- Vendor files are never edited (they stay byte-identical to the pinned commit). Overrides live here.
- Pins, licences, review results and the update procedure: `.claude/skills/VENDOR.md`.
- If a vendor skill is missing in a session (e.g. the user-level remotion-* skills are not on this machine), work
  from this skill and the Remotion docs; do not install anything to get it back.

## 9. Mandatory overrides for vendor skills
**Time and state (every frame = pure function of the frame number)**
- Time comes only from `useCurrentFrame()` and `useVideoConfig().fps` (t = frame / fps).
- Forbidden: `THREE.Timer`, `THREE.Clock`, `getDelta()`, `getElapsedTime()`, `renderer.setAnimationLoop`,
  `requestAnimationFrame`, `useFrame` with its `delta`/`clock`, `MathUtils.damp(..., delta)`, `performance.now()`,
  `Date.now()`, unseeded `Math.random()` (use a seeded PRNG keyed by a constant + index), `setInterval`/`setTimeout`.
- Forbidden: accumulating state across frames (`rotation.y += x`, `position.add(step)`, physics integration,
  `action.fadeIn/crossFadeTo/halt` weights). Compute every value directly from t.
- `AnimationMixer`: `mixer.setTime(frame / fps)` (or set `action.time` and weights from t). Never `mixer.update(delta)`.
- Springs and easing: Remotion `spring({ frame, fps, config })`, `interpolate()`, `Easing` — as functions of the frame.
- No `frameloop="demand"` / `invalidate()` patterns; no `OrbitControls`/`CameraControls` damping or autoRotate;
  cameras come from the plan JSON (`shotCam`).
- No output that depends on render order or history: no frozen/baked shadows (`shadowMap.autoUpdate = false`,
  `ContactShadows frames={1}`), no one-time light-probe bakes, no `Detailed`/LOD hysteresis, no adaptive quality
  (`AdaptiveDpr`, `PerformanceMonitor`, `regress`). Set `frustumCulled = false` on skinned/instanced meshes whose
  bounds are computed lazily.
- Post-processing passes with an internal timer or randomness (`FilmPass`, `GlitchPass`) are not used unless time is
  passed explicitly from t and noise is seeded.
- Async loads (`loadAsync`, `useLoader`, `useGLTF`, `useTexture`, drei `Text`) must be gated so no frame is captured
  before they finish (Remotion `delayRender`/`continueRender` or the existing studio pattern). No network fetches at
  render time (no CDN import maps, drei `Environment preset`, remote Draco decoder, remote fonts).

**Renderer and look**
- Output size is fixed by the composition (1080×1920). Pixel ratio is fixed; never use `window.devicePixelRatio`,
  `window.innerWidth/innerHeight` or resize listeners.
- Toon look: keep tone mapping off (`<Canvas flat>` / `NoToneMapping`; R3F applies ACES by default). PBR-first
  advice (MeshStandard/Physical as default, IBL, RectAreaLight, SSAO, bloom) does not apply to the ink-toon style
  unless the owner approves a look change.
- WebGL only: renders use `--gl=angle`. Ignore every `WebGPURenderer` / `three/webgpu` / TSL / `three/tsl` section and
  WebGPU-based tools (e.g. `@remotion/whisper-webgpu`) unless a new decision allows them.

- The existing `studio/` setup is the reference for the approved look (D-021): `ThreeCanvas ... flat`
  (`src/inkbeat/core/View.tsx`), `MeshToonMaterial` + ramp and `MeshBasicMaterial` ink (`src/inkbeat/char/material.ts`),
  the inkbeat post/outline pipeline (`src/inkbeat/post/pipeline.ts`). §9 governs new code; it is not a mandate to
  rewrite approved code. Likewise, the `TEMPO` bezier curves in `src/c1/reach.ts` are pure functions of t and comply;
  `spring()`/`interpolate()` are preferred for new motion, not required to replace them (see EXP-002).

**Project rules that vendor skills do not know**
- Never mirror C1 (no negative scale on C1 or its parents). "Uq" stays on C1's anatomical left chest; other
  characters never wear "Uq".
- Captions sit in the band at 70% of the frame height; faces, hands and key props stay out of it (§2). Vendor caption
  layouts are positioned to that band.
- `C1_LOOK` must stay pixel-identical: after touching `C1.tsx`, still-diff against a render made before (§2).

**Versions and installs (locked)**
- Remotion 4.0.540, `@remotion/three` 4.0.540, `@react-three/fiber` 9.8.2, `three` 0.186.1, React 19.3.1. An API that
  needs another version is not used. The vendor Remotion skills track 4.0.543: confirm a Remotion API exists in
  `studio/node_modules` (4.0.540) before using it.
- Never run `npm install`/`npm i`, `npx remotion add`, `bunx`/`pnpm` equivalents, `npx remotion upgrade`,
  `npx skills add/update`, `gh skill install`, or the `remotion-upgrade` skill. Ask the owner; record a decision first.

**Renders and outputs**
- Render only through the npm scripts in `studio/package.json`, which end in `tools/finish_render.mjs` (refuses to
  overwrite). A vendor command that writes `out/video.mp4` or another fixed path is not a final-output command.
  No `--license-key` (the project uses Remotion's free licence; D-021).

**Remotion vendor specifics (found in review, 2026-11-16)**
- Remotion's CLI overwrites by default (`@remotion/renderer` option `overwrite`, "Default is `true`"). Never point
  `npx remotion render/still/ffmpeg` at an existing file; `npx remotion ffmpeg ... public/output.mp4` (remotion-markup
  `ffmpeg.md`) is not used for outputs.
- Voice-over: never ask the owner for an ElevenLabs (or any) API key and never call a TTS API from code
  (`remotion-markup/voiceover.md`). Voice is generated manually by the owner (D-023); code only reads local files.
  The `calculateMetadata` duration-from-audio pattern in `voiceover.md` is fine with a local file.
- No remote assets at render time: no `https://remotion.media/*.wav` SFX, LottieFiles URLs, remote `src` samples or
  `fetch()` of data URLs. Assets are local (`staticFile`/`public/`) with known licences. The meme SFX listed in
  `sfx.md` have unclear rights (CLAUDE.md §11) and are not used.
- Do not download vendor code into the project "unchanged" (`remotion-captions/display-captions.md`: basic-captions
  element). Copying external code needs a review and a licence check first.
- Do not start Remotion Studio unless the owner asks (`remotion-captions/SKILL.md`, `remotion-best-practices`).
- Packages not installed in `studio/` (so any vendor section needing them is blocked until an owner decision):
  `@remotion/effects`, `@remotion/transitions`, `@remotion/google-fonts`, `@remotion/fonts`,
  `@remotion/layout-utils`, `@remotion/gif`, `@remotion/lottie`, `@remotion/motion-blur`,
  `@remotion/rough-notation`, `@remotion/whisper-webgpu`, `@remotion/video-matting`, `zod`. `@remotion/media` and
  `@remotion/captions` exist only as transitive dependencies (not declared in `package.json`): prefer core `Audio`
  from `remotion`; do not rely on undeclared packages without a decision.
- Transcription examples use the English-only Whisper model (`small.en`); Indonesian would need a multilingual model.
  Transcription is out of scope anyway (timing comes from the voice-over files and their timing JSON).
- Vendor caption examples are landscape (1920×1080) with fixed `bottom` offsets. Recompute positions for 1080×1920
  and the 70% band; read the existing caption code in `studio/` instead of copying numbers.
- Async measurement without `delayRender` (`measuring-dom-nodes.md`, `measuring-text.md`) can capture a frame before
  the value exists. Gate it.
- `remotion-best-practices` is deliberately **not installed** (it bundles the excluded skills and routes to
  `remotion-upgrade`). Lines in the installed remotion-* skills that say "load `remotion-best-practices`" or refer to
  `remotion-interactivity`, `remotion-studio`, `remotion-multimedia` point to skills that are not present: skip them,
  do not install them.

**Network and privacy**
- `remotion-docs` was removed by owner decision (D-024, 2026-11-16); do not reinstall it. Look up Remotion APIs in
  `studio/node_modules` (4.0.540). Any web lookup of Remotion docs uses only technical terms — never the owner's
  name, project, channel, script text or file paths (CLAUDE.md privacy rule).
- Out of scope, not to be followed without an owner decision: the maps reference nested in `remotion-markup`
  (`remotion-maps/`: map API keys, `npm i`, hiding provider attribution), Whisper/WebGPU or cloud transcription,
  Lambda/cloud rendering.

## 10. When to consult a vendor skill
| Task | Consult | Override to keep in mind (§9) |
|---|---|---|
| Toon material, gradient steps, inverted-hull ink outline (`side: BackSide`), `toneMapped` | `threejs-materials` | no PBR default; tone mapping off |
| Ink lines: crease edges, thick lines (`EdgesGeometry`, `Line2`), limb tubes | `threejs-geometry` | no unseeded `Math.random` |
| Screen-space ink/edge pass, MSAA composer target, custom `ShaderPass` | `threejs-postprocessing` | no FilmPass/Glitch; fixed pixel ratio |
| Key/fill/rim lights, hard toon shadows, contact-shadow blob, shadow bias | `threejs-lighting` | no frozen shadows; no IBL for toon |
| Secondary motion, clip blending, morph targets (faces), stepped timing | `threejs-animation` | time from frame; `mixer.setTime` |
| R3F components, `Canvas` props (`flat`, `gl`, `frameloop`), loading hooks, disposal | `threejs-react-three-fiber` | no demand frameloop, no adaptive DPR, gated loads |
| Scene/camera/renderer basics, transforms, colour spaces | `threejs-fundamentals` | no animation loop, no window sizing |
| Slow renders, draw calls, shader compile stalls | `threejs-performance` | never trade determinism for speed |
| Compositions, `<Sequence>`, `spring`/`interpolate`, voice-over audio, fonts, transitions | `remotion-markup` | maps section out of scope |
| Stills and renders, transparent video, CLI flags | `remotion-render` | npm scripts + `finish_render.mjs` only; no `--license-key` |
| Displaying captions/subtitles from timing data | `remotion-captions` | 70% band; no install; no WebGPU transcription |
| Looking up a Remotion API | `studio/node_modules` type definitions (`remotion-docs` removed, D-024) | confirm the API exists in 4.0.540 |

---

# v0.4 additions (2026-11-16, DECISION-LOG D-028 — owner: "use the skills you installed, and remember")

## 11. Mandatory routine for every video task (no exceptions)
1. **Read the style target** `03-KNOWLEDGE/research/2026-11-16-style-target-badai-matahari.md` (§2 numbers, §4 rules) and
   `02-CHANNELS/lab/STUDIO-WORKFLOW.md` §4 (gates).
2. **Load the skills, not only their code:** `inkbeat-shorts` (SKILL.md + the reference files for the task:
   camera-and-editing, look-and-ink, sets-and-materials, characters, render-and-qa, audio-and-voice), plus the
   `threejs-*` / `remotion-*` skills named in §10 for the code you are about to write. Name the skills you used in the
   report and in `content.md`.
3. **Conflicts:** the style target (measured on the owner's chosen reference) wins over generic craft numbers:
   - inkbeat's "56 beats/min, ink outlines on everything" is a generic viral cadence; the owner's reference measures
     5–11 cuts/min with continuous moves, ≤ 30 % still frames and no ink on sets. Use the reference's numbers.
   - Everything else in inkbeat applies as written: lenses (sets 60–80°, close-ups 40–50°), ≥ 12 props per framing,
     physical plausibility (§4 of inkbeat), inserts 45–60 % of the frame height with the hand visible, motion blur,
     audio bed + SFX on words, −14 LUFS.
4. **Gates before any full-length render:** look-dev stills side by side with reference frames + the §2 number table →
   STOP for the owner; a 15 s pilot with VO, ambience, SFX, subtitles and UI → STOP. Never skip them unless the
   owner says so explicitly for that task.
5. **QC = technical + style.** [CHANGED by D-032: the style numbers are diagnostics only; judge shape consistency and motion
   first, STUDIO-WORKFLOW §7–§10.] Measure the render with the same method as the style target (L* mean and dark-pixel
   share, cuts/min, still share, LUFS, silences) and put the frame sheet next to the reference sheet. Check every
   framing for blocked actions (a wall or block covering a door or a face), stray hands and interpenetration. Report
   the biggest weaknesses first. "Readable" is not "good" (memory: feedback-visual-quality; lesson
   `03-KNOWLEDGE/lessons/2026-11-16-animatic-v2-ditolak.md`).
6. inkbeat's `scripts/flicker.py` and `analyze_pacing.py` need numpy, which is **not installed** (no installs without
   the owner). Use the ffmpeg-based measurements in `studio/tools/ep002_qc.py` and the style-target method instead.
   inkbeat's `templates/` live in `refrences/Ai_Carton_step-by-step/inkbeat-shorts/templates/`; `studio/` is already
   built from them.

---

# v0.5 additions (2026-11-16, DECISION-LOG D-031 — body/pants/thin ink approved; Three.js/R3F + Remotion mandatory)

## 12. What exists now (run and verified on the 2026-11-002 pilot)
- **Approved design (D-031):** `StickLook.limbs` (bodied white arms, pants, inkbeat shoes; `feet: "bare"` in bed) and
  `inkK` (thin hull ink) in `src/c1/C1.tsx`; looks `C1_BODIED`, `ADIK_B`, `BAPAK_B`, `IBU_B` and the mood helper
  `thin(id, ink, amb, key, rim, cast)` in `src/ep002/LookDev.tsx`. `C1_LOOK` itself is unchanged.
- **Local light:** `HouseInterior light="local"` (living-room lamp in candela with decay 2 and shadows, switched by intensity;
  moon `SpotLight` cones through the windows, `moon` = strength, `moonReach` = aim depth), `StreetSet light="local"`
  (street-lamp pools). `dressing` adds Indonesian-home props. Defaults stay "v1", so the old animatic renders unchanged.
  Dimming an inkbeat mood means scaling **every** light: hemi, key, **rim**, fill, camFill, cast fill **and cast rim**. A
  missed rim kept L* > 55.
- **Pilot pattern:** `src/ep002/Pilot.tsx`. One `<Sequence>` per shot on plan frame boundaries, cameras and acting as
  `interpolate()` + `Easing.bezier` of episode time, and captions (`CaptionsHL`: caps, active word lit) in their own
  layer. Motion blur goes through `Pilot002Sub` (4 sub-frames over a 180° shutter, captions keyed to the output frame) and
  `npm run render:pilot002-mb`.
- **Audio:** `scripts/sfx_synth.py` (synthesised SFX) and `scripts/ep002_pilot_mix.py` (levels measured against the
  speech, two-pass loudnorm). The mix refuses to overwrite.
- **Measure:**
  - `python tools/style_measure.py <png…>` gives L* and dark share;
  - `python tools/style_video.py <mp4>` gives cuts/min, still %, L* and dark share;
  - always measure the reference frames with the same tool.
- **Lesson:** check a hand gesture toward the character's own body from the real camera first. IK to the throat sank into
  the torso and was dropped (`03-KNOWLEDGE/lessons/2026-11-16-pilot-15s-v1.md`).

## 13. Hands and arms with IK (2026-11-17, lesson `03-KNOWLEDGE/lessons/2026-11-17-lengan-hilang-sit-up.md`)
- The owner's "smooth" means the body stays whole, poses read, and motion is continuous. A hand never vanishes, never comes out of
  the torso, and never jumps without a believable path. Being hidden by an object is fine.
- Check every IK arm against its own body, not only palm-to-target: `c1ArmTorsoDepth(q, side)` in `src/c1/bodyIk.ts`
  measures the arm's centre line, from the sleeve end, against the tee surface. Use `c1ArmIK({ avoidTorso: true })`.
- C1's arm bends in one plane, so elbow-out / hand-in is impossible. Put targets beside the body with room for a
  near-straight arm (seated: ~0.30 m out, at mattress height). Start from a pose on the same IK branch (no branch
  switch = no pose jump). Route hand moves low, along the outside of the body.
- Numbers first (`tools/situp_check.ts` pattern: palm error, surface penetration, arm-in-torso, per-frame steps), then the
  final camera at normal speed, then every frame around the move. Never hide a defect with motion blur or a cut.

---

# v0.6 additions (2026-11-20, DECISION-LOG D-054 — recipe proposed in D-053, written on the owner's instruction)

## 14. Testing a new motion (recipe)
Sections 1–13 are unchanged. Run from Episode 3 (2026-11-004): `studio/src/ep004/motion004.ts` (clips),
`studio/src/ep004/MotionTest004.tsx` (compositions `Motion004-<clip>-<variant>`), `studio/tools/m004_check.ts` (numbers),
`studio/tools/m004_sheet.py` (strips and 1:1 crops from an image sequence). Lesson:
`03-KNOWLEDGE/lessons/2026-11-20-uji-gerak-ep3.md`.

**When:** every motion the project has not shipped before (a walk in a new direction, a turn, a hand-to-hand contact, a
look into the lens), before any shot code is written.

1. **Test clip first.** A short separate clip with the storyboard's lens, start pose and timing; same set, light and cast
   as the episode; no captions, audio or cards. Every value is a pure function of t (§9). New staging goes in as new
   options; the defaults that produced an earlier log stay unchanged, so old logs reproduce.
2. **Numbers per frame** (pattern `tools/m004_check.ts`). Limits = the last owner-approved pilot (Ep 3 pilot v3):
   - joint step of the MOVING arm: Uq ≤ 11.1, adik ≤ 7.1 °/frame;
   - `c1ArmTorsoDepth` of the moving arm: Uq ≤ 0.2, adik ≤ 0.0 cm; static arms printed separately;
   - character ↔ character ≥ 1.7 cm (body↔body printed separately); sample accessories too (adik's jacket);
   - body ↔ wall/object ≥ 49.6 cm or the value written in the storyboard, measured the SAME way as the storyboard
     (root-to-box minus a body radius); print both measures;
   - feet: never crossing (rig-L ankle stays left of rig-R), planted feet drift 0 mm; leg stretch printed as a
     diagnosis only (not calibrated; HYPOTHESIS: no limit known);
   - D-054 additions: body yaw °/frame and world head yaw (body + head) °/frame as a rough flicker indicator; the
     angle a head clamp could not reach (head limit ±55° in tests, rig ±60°).
   - A deliberate contact is excluded only through a declared zone (both samples ≤ 8 cm from the meeting point); its raw
     minimum is still printed.
   - Measure each motion in its own time window when one clip holds two motions (e.g. retreat, then turn): one
     window's failure is not the other's.
3. **Strips:** one overview (every 0.2 s) + every frame ± 0.3 s around the worst number.
4. **1:1 crops** on the worst frame and on the meaning frames (mid-step, mid-turn, contact, hold).
5. **Meaning check from the FINAL lens:** what reads with the sound off? Passing the numbers is not passing the meaning
   (Ep 3 S08 v1; the grip from lens P in D-053 read as a hand on a belly).
6. **Iterations are declared before they run:** the knobs and the grid go into the log header. If the owner allows one
   iteration and nothing passes, stop and report the closest candidate and what fails; do not switch to another option.
7. **Fail → stop, 2–3 options with their impact.** Storyboard and script are not changed without the owner.
8. You cannot judge flicker, "natural" motion at normal speed or readability on a phone from strips: say so and leave it
   for the owner's preview.

**Rig limits proven so far (numbers, not opinions)**
- C1's one-plane arm cannot reach a point between two characters whose roots are ≤ 0.6 m apart without entering its
  own torso (D-053: 96 meeting points, 0 passed). A resting hand that the other character takes passes the numbers
  (2.7 cm), but from a front-oblique lens it can read wrong (D-053). PROPOSAL, not yet reviewed by the owner: an insert
  lens perpendicular to the pair's axis on the front side read correctly in stills (D-054, Ep 3 I15).
- `walkSteps` alternates feet and crosses them when the path is more than about ± 30° sideways from the body (D-053:
  −24.5 cm at ~50°).
- Backing up with the body along the path keeps the feet apart (≥ 5.7 cm; numbers only, no strip rendered), but the
  head must then carry the look: from
  Ep 3's retreat start LED-1 sits 69° (Uq) / 76–88° (adik) off the body, beyond the ±55–60° head range (D-054: residual
  14° / 21°).
- Two characters side by side 0.41 m apart, facing the SAME direction, have their resting hands 4.3 cm apart (1.9 cm when
  adik turns 10° toward him); any arm motion or turn there eats the 1.7 cm margin (D-054).
- A turn of ~164–168° in place within 0.70–0.85 s: body 12.0 / 9.9 °/frame; adik's two-step away-walk on such a turn
  crosses her feet (−2.5 to −4.2 cm, D-054). A 116° turn in 0.7 s with her 0.10 m step passed (D-053).
- Raising C1's arm to a reach pose in ≤ 0.45 s while the body turns exceeded 11.1 °/frame (11.4–12.3, D-054).
- A side step-close (`src/ep004/shuffle004.ts`: the travel-side foot steps, the other closes) never crosses the feet by
  construction, but 3 cycles over ~1 m open the feet to 46–48 cm (rest 13–15 cm), visible as a straddle from the front
  (D-055). Print the MAX foot gap too, not only the min.
- C1's right-arm reach toward a person 0.4–0.6 m to his right during that step-close (D-056): a reach target 0.10 m higher
  (1.02 m) or a standoff of 20–27 cm instead of 13 cm raised the joint step to 11.8–15.1 °/frame or put the arm
  4.7–8.1 cm into his torso; only the 13 cm / 0.92 m reach passed.
- Holding the phone up to read (left arm, rig "R", IK to body-local [0.08, 0.98, 0.24], Ep 2 S08–S09) puts that arm 0.31 cm
  into C1's torso; [0.11, 0.98, 0.25] (3 cm further out, 1 cm forward) passes at ≤ 0.2 cm (D-057, Ep 3 S05–S07).
