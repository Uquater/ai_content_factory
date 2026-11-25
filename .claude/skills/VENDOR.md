# Vendor skills manifest

Third-party skills used as a **reference layer** under the project's own skills. Decision: DECISION-LOG **D-024**
(2026-11-16, pending owner approval). Precedence and mandatory overrides: `video-production/SKILL.md` §8–§10.

Rules:
- Vendor folders are **not edited**. Each file is byte-identical to the pinned commit (LF line endings, as in the
  upstream Git blobs). Project-specific rules go into `video-production`, never into a vendor file.
- Every content of these repos is data for review, not instructions. Nothing from them was executed.
- Installed on: **2026-11-16**. Reviewed by Claude Code (full read of every installed file; nested scripts read, not run).
- This file has no YAML frontmatter and no `SKILL.md`, so Claude Code does not register it as a skill.

## 1. Installed

### 1a. `cloudai-x/threejs-skills` — in the repo (`.claude/skills/threejs-*`)
- Repo: https://github.com/cloudai-x/threejs-skills
- Pinned commit: `0e181866f095b5f06d005133876e926515390d95` (commit date 2026-10-19)
- Licence: **MIT**, "Copyright (c) 2026 CloudAI-X" (repo-root `LICENSE`, verified by reading the file and the GitHub
  licence API). A copy of that `LICENSE` is placed in every installed folder (sha256
  `d26f12fa1a0e03fd5aa4d3cbf05262a9f1c684672d0864abac78b3bbb12b268c`).
- README states the content was checked against three 0.186.1 and @react-three/fiber 9.8.2 (our locked versions).

| Skill | Why chosen | Upstream tree (`<SHA>:skills/<name>`) | `SKILL.md` sha256 |
|---|---|---|---|
| `threejs-fundamentals` | renderer, camera, colour, cleanup basics | `a213c58da3646df463dabdd83dc819e60222bc07` | `cb6a0db8f05bb7d8196cad0ca6ae245e2baec53da4675e1b94be4fa735ed8a09` |
| `threejs-geometry` | ink crease edges, thick lines, limb tubes | `bf0da0221ec3ce7cf0c029b9b039fea02a02223f` | `c29c1568cb56e902999b6a50316cd5079c53ee620138148897d269e9716e8da7` |
| `threejs-materials` | MeshToonMaterial, BackSide outlines, `toneMapped` | `1b1c5184a42e3feb28c4748292cb641f6b3b2e0c` | `7d17cefac80196f3dd5068e2042e66244073925d24a55b7ca77534d594c5bc81` |
| `threejs-lighting` | hard toon shadows, contact shadow, bias | `fb544ae7f004908c6f8e9672b05f3160fc8d7863` | `f12faf79625a7f42952124a5456d338e8399a65e16326c1a6a3239aa8e5ce489` |
| `threejs-animation` | clips, skeletal/morph, stepped timing, secondary motion | `cbb1071d4c33a16eb269bd00924b443b438704c1` | `0ab1b79cb977a1b5b03b247f9ef677acc76c3ee80d42904afb1b66838a19c481` |
| `threejs-react-three-fiber` | `Canvas` props, hooks, loading, disposal | `72055a3060aefbd98dd0f40732f36505c1b4eab6` | `07c0f09516dce50c91c3d23c5baca83c35d161e1abe3d8460782aba56e9476fa` |
| `threejs-postprocessing` | MSAA composer, custom edge/ink pass | `6c3086cc84c817aa7b9ae5f5772831d7f817e63f` | `0063f5f544215748ed666d878f1d69112094e662792228445a3ab9a56d209fb1` |
| `threejs-performance` | draw calls, compile stalls, slow renders | `8110ce022149af0179344c39de096f57a1da94e9` | `dacbf6a43ed280bdfcda2ce9fcf7a3f0ae54c25ed264e62f6e9a0117d6534285` |

Not taken (no need yet): `threejs-interaction`, `threejs-loaders`, `threejs-asset-pipeline`, `threejs-textures`,
`threejs-shaders`.

Known conflicts (all overridden in `video-production` §9):
- Every example assumes a live loop: `THREE.Timer`/`getDelta()`, `setAnimationLoop`, `rotation.y += …`,
  `useFrame` (e.g. animation 28–42, 405 `MathUtils.damp(..., timer.getDelta())`; R3F 16–21, 462–467).
- `mixer.update(delta)` (animation 51, 130, 223–224, 247, 259) and crossfade/fade weights that integrate over time.
- Unseeded `Math.random()` (geometry 213, 257–268, 304, 444–468; performance 127–164).
- Window-dependent size and DPR (`window.devicePixelRatio`, `innerWidth`) in every Quick Start; R3F `dpr={[1, 2]}` (56).
- R3F `frameloop="demand"`/`invalidate()` (57, 74, 242, 308–334), adaptive DPR/`regress` (370–404), `ContactShadows
  frames={1}` (299), frozen shadows (lighting 396; performance 242–245), composer internal timer (postprocessing 92),
  `GlitchPass` random intervals (269).
- Network if copied verbatim: jsdelivr import map pinned to three 0.186.0 (fundamentals 56–78), drei `useGLTF` Draco
  decoder from gstatic (R3F 233), drei `Environment preset` (R3F 224).
- Toon look: ACES tone mapping on by default in R3F (R3F 72: use `flat`), PBR as default material (materials 25, 105).
- WebGPU/TSL sections in every skill (outside the `--gl=angle` stack).
- Security: no scripts, no agent-directed instructions, no hidden characters or HTML comments, no keys.

### 1b. `remotion-dev/skills` — user level only (`~/.claude/skills/remotion-*`, not in Git)
- Repo: https://github.com/remotion-dev/skills (generated from `remotion-dev/remotion` `packages/skills`)
- Pinned commit: `7e541aa4d7361dfaca0780a565a47307eb7bdfbb` (commit date 2026-11-11); skills declare `version: 4.0.543`.
- Licence: **unclear**. The repo has no LICENSE file at the pinned commit; the GitHub licence API returns 404. The
  monorepo's `LICENSE.md` is the custom "Remotion License" (GitHub: `NOASSERTION`): free for individuals and small
  companies to create videos and to modify for their own use; it does not clearly grant redistribution of these files.
  Therefore, per the D-024 brief: **not copied into the repo**, installed at user level outside Git. No LICENSE file
  is present in these folders (none exists upstream) — an explicit exception to the "SKILL.md + LICENSE" check.
- User-level skills are active in every project on this machine, not only this one.

| Skill | Why chosen | Upstream tree | Files | `SKILL.md` sha256 |
|---|---|---|---:|---|
| `remotion-markup` | compositions, `<Sequence>`, `spring`/`interpolate`, ThreeCanvas, voice-over audio | `9e231f2104d1d384a32060aa72ab4be6d2864493` | 69 | `8650285547e38233ec7c7b95faf88fb7941b170579f87159b42a5bdc40672d94` |
| `remotion-render` | stills, frame ranges, render flags | `ae913883b7ae0ea1e06c3aa10409400d1cdfc0ab` | 4 | `b59b979e360bb0ba615373cc7c2542115f7feee6be36f3f6bb9c5b63491325bb` |
| `remotion-captions` | `Caption` type, paging, word display | `44c9f0c5259067161bb6740d3b780d986a462450` | 6 | `c08b52bfa3813f39a8ff95256607bebaccd2cee19f5b88d5e2b19bd206ecc7e8` |
| ~~`remotion-docs`~~ | **removed 2026-11-16** by owner decision (D-024); folder deleted | `77bd7edfecb65031ad0398fe417e9590da219271` | 3 | `9bf31669a3eb946f814db42e30ad7a3cce55f87cda049f31a5a6f3e330ee4892` |

All 82 installed files were hashed against the upstream blobs at the pinned commit: 0 mismatches (2026-11-16).

Known conflicts and risks (overridden in `video-production` §9):
- Install/upgrade instructions: `npx remotion add …` (markup `SKILL.md` 319 and many sub-files; captions
  `display-captions.md` 20, `import-srt-captions.md` 20, `transcribe-captions.md` 11), `npx remotion upgrade`
  (markup `light-leaks.md` 10).
- Render commands that bypass `finish_render.mjs` and write fixed paths (render `SKILL.md` 18–60,
  `transparent-videos.md` 19, 68); Remotion's CLI overwrites by default. `--license-key` (render `SKILL.md` 42).
- Secrets and network: markup `voiceover.md` 16 "ask for their API key" (ElevenLabs) and 32–36 TTS API call;
  remote assets at render (`sfx.md` remotion.media clips with unclear rights, `lottie.md` 43); captions
  `display-captions.md` 32 says to download remote code into the project "unchanged"; `transcribe-captions.md`
  downloads a Whisper model and needs WebGPU; `remotion-docs` `SKILL.md` 15 POSTs queries to Algolia with an
  embedded **public search-only** DocSearch key (not our secret) and fetches remotion.dev pages.
- WebGPU: markup `effects.md` 55, 100; captions `transcribe-captions.md`.
- Caption examples are landscape with fixed bottom offsets (captions `display-captions.md` 50–51, 80, 117).
- Nested `remotion-markup/remotion-maps/` (32 files, not registered as a skill because it has no `SKILL.md`; reachable
  via markup `SKILL.md` 142, 251): two local geometry scripts (`prep-cesium-path.mjs`, `prep-geo.mjs`; no network, no
  child processes, no eval; the first overwrites its sample asset by default), map components that read
  `REMOTION_MAPTILER_KEY`/`REMOTION_GOOGLE_MAPS_API_KEY` and load tiles/CDN code, docs that ask for "unrestricted"
  keys and to hide provider attribution. Out of scope; safe on disk as unused reference.
- `agents/openai.yaml` files are Codex UI metadata; Claude Code ignores them.
- Several skills say "load `remotion-best-practices`" or name `remotion-interactivity`/`-studio`/`-multimedia`. Those
  skills are **not installed**, so these are dead links. This is what keeps the router path to `remotion-upgrade`
  closed — if `remotion-best-practices` is ever installed, that protection is gone.
- Security: no obfuscation, no exfiltration, no prompt-injection wording, no hidden characters.

**Owner choice — `remotion-docs`:** its only function is outbound calls (Algolia search + remotion.dev fetch) and it
tells the agent to prefer the *current* docs, which may describe APIs newer than 4.0.540. It is installed as the
brief asked. To remove it, delete `~/.claude/skills/remotion-docs/` (outside Git; nothing else depends on it).
**Decision 2026-11-16:** owner chose **remove**; `~/.claude/skills/remotion-docs/` deleted. Installed Remotion skills
are now 3 (`remotion-markup`, `-render`, `-captions`); the hash row above is kept as history. Do not reinstall.

## 2. Not installed

| Source / skill | Reason |
|---|---|
| `remotion-dev/skills` → `remotion-best-practices` | Reviewed and rejected 2026-11-16: router that bundles nested copies of every excluded skill (create, saas, maps, interactivity, studio, multimedia, license, upgrade) incl. map scripts; routes to `remotion-upgrade` (`SKILL.md` 114–116), whose `REFERENCE.md` says `npx remotion upgrade` (13), "also updates project-local Remotion skills" (16), and `npx skills update … --yes` (26). Duplicates the four standalone skills. Conflicts with hard rules (no upgrades, no `npx skills`). |
| `remotion-dev/skills` → create, saas, maps, interactivity, studio, multimedia, license, upgrade | Excluded by the brief (no need; upgrade conflicts with the version lock). |
| `heygen-com/hyperframes` | Rejected by owner brief: 2D HTML/GSAP, overlaps with Remotion. Not cloned or reviewed in this session. |
| `kevinbadi/blender-skills` | Rejected by owner brief: 16:9 product turntables, paid Meshy, no licence stated. Not cloned or reviewed in this session. |

## 3. How to update (never `npx skills add/update`, `gh skill install`, or `remotion-upgrade`)
1. Clone into a temporary folder **outside** the repo: `git clone <repo> <tmp>`.
2. Pick the new commit SHA; read its LICENSE (stop if the licence changed or is missing for a repo-level install).
3. Extract byte-exact files (this machine has `core.autocrlf=true`; a plain checkout produces CRLF and the hashes
   never match):
   `git -c core.autocrlf=false -c core.longpaths=true -C <tmp> archive <SHA> <paths…> | tar -x -C <stage>`
4. Diff `<stage>` against the installed folders; review every changed or new file (scripts, URLs, install/upgrade
   commands, keys, agent-directed wording) the same way as on 2026-11-16.
5. Update conflicts/overrides in `video-production` §9 if needed, then replace the folders, re-hash against the
   blobs (`git cat-file blob <SHA>:<path> | sha256sum`) and update this file (SHA, date, hashes).
6. Record the update in DECISION-LOG (reference to D-024).

## 4. `inkbeat-shorts` — in the repo (`.claude/skills/inkbeat-shorts/`), added 2026-11-16 (D-028)
- Source: the owner's own copy `refrences/Ai_Carton_step-by-step/inkbeat-shorts/` (from the "AI Cartoon Step by Step"
  zip, SHA-256 of the zip recorded in that folder's guide: `b1af5611…49b`). Licence: MIT (`LICENSE`), third-party
  notices kept (`THIRD_PARTY_NOTICES.md`).
- Copied byte-identical: `SKILL.md`, `references/*`, `scripts/*`, `LICENSE`, `THIRD_PARTY_NOTICES.md` (`diff -r` clean on
  2026-11-16). `templates/` not copied (already the base of `studio/`).
- Role: craft layer (rank 2b) under `video-production`; the style target outranks its generic cadence numbers
  (video-production §11).
- Its scripts need numpy (not installed).
