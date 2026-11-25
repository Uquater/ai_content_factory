---
type: research-note
title: "Skill pihak ketiga untuk pipeline video 3D (threejs-*, remotion-*)"
checked-date: "2026-11-16"
created: "2026-11-16"
updated: "2026-11-16"
tags: [tool, skill, vendor, threejs, remotion, keamanan]
related: "[[D-024]], [[DECISION-LOG#D-024]], [[video-production]], [[EXP-002-gerak-natural]]"
---

# Skill pihak ketiga untuk pipeline video 3D

Review dan pemasangan 2026-11-16. Keputusan: [[D-024]] ([[DECISION-LOG#D-024]], **pending** pemilik). Aturan proyek yang mengalahkan skill ini: [[video-production]] v0.3 §8–§10. Manifest teknis (SHA, hash, cara update): `.claude/skills/VENDOR.md`.

**Inti:** skill vendor = buku referensi teknik. Mereka ditulis untuk aplikasi interaktif (loop real-time), sedangkan kita merender video per frame secara deterministik. Karena itu hampir semua contoh kode mereka perlu "diterjemahkan" ke aturan frame. Override-nya ada di `video-production` §9.

## 1. Sumber

| Sumber | Commit (dipin) | Lisensi | Lokasi pasang |
|---|---|---|---|
| https://github.com/cloudai-x/threejs-skills | `0e181866f095b5f06d005133876e926515390d95` (2026-10-19) | MIT — VERIFIED (file `LICENSE` dibaca + API lisensi GitHub) | repo: `.claude/skills/threejs-*` (+ `LICENSE` per folder) |
| https://github.com/remotion-dev/skills | `7e541aa4d7361dfaca0780a565a47307eb7bdfbb` (2026-11-11) | **tidak jelas** — VERIFIED tidak ada file LICENSE di repo (API GitHub 404); monorepo memakai "Remotion License" (source-available, GitHub `NOASSERTION`) | level user: `~/.claude/skills/remotion-*` (di luar Git) |

Semua file yang dipasang byte-identik dengan blob Git di commit itu (sha256: 9 file threejs + 82 file remotion, 0 selisih).

## 2. Ringkasan per skill

| Skill | Status | Berguna untuk kita | Bentrok utama (di-override) |
|---|---|---|---|
| `threejs-fundamentals` | dipasang (repo) | renderer, kamera, warna sRGB/linear, cleanup | loop `setAnimationLoop` + `timer.getDelta()`, ukuran dari `window`, saran tone mapping ACES/AgX (baris 191) |
| `threejs-geometry` | dipasang (repo) | `EdgesGeometry` (garis tinta di lipatan), `Line2` (garis tebal), tube untuk lengan/kaki | `Math.random()` tanpa seed, `rotation.y += …` |
| `threejs-materials` | dipasang (repo) | `MeshToonMaterial` + gradientMap, outline `BackSide`, `toneMapped=false` | menganggap PBR sebagai default (baris 25, 105) |
| `threejs-lighting` | dipasang (repo) | bayangan keras (BasicShadowMap), contact shadow palsu, bias bayangan | bayangan "dibekukan" (`autoUpdate=false`), IBL tidak berlaku untuk toon |
| `threejs-animation` | dipasang (repo) | clip, skeletal/morph (wajah), interpolasi bertangga, gerak sekunder | `mixer.update(delta)`, `MathUtils.damp(..., getDelta())` (baris 405), fade/crossfade berbasis waktu nyata |
| `threejs-react-three-fiber` | dipasang (repo) | prop `Canvas` (`flat`, `gl`, `frameloop`), hook loading, disposal | ACES aktif default di R3F (baris 72 → pakai `flat`), `frameloop="demand"`, adaptive DPR, `useFrame` + delta, decoder Draco dari gstatic |
| `threejs-postprocessing` | dipasang (repo) | composer MSAA, pass tinta/edge custom | timer internal composer (FilmPass), GlitchPass acak, OutlinePass = glow lembut, bukan tinta tegas |
| `threejs-performance` | dipasang (repo) | draw call, shader compile stall, render lambat | DPR dari `window`, integrasi posisi antar-frame, bayangan dibekukan |
| `remotion-markup` | dipasang (level user) | komposisi, `<Sequence>`, `spring`/`interpolate`, `ThreeCanvas` (baris 3d.md 46–52 sudah melarang `useFrame`), durasi dari audio voice-over | `npx remotion add` di banyak file, `npx remotion upgrade` (light-leaks.md 10), "minta API key ElevenLabs" (voiceover.md 16), aset remote saat render, efek WebGPU, folder maps bersarang |
| `remotion-render` | dipasang (level user) | still, render rentang frame, flag CLI | perintah render ke path tetap (CLI Remotion **menimpa secara default**), `--license-key` |
| `remotion-captions` | dipasang (level user) | tipe `Caption`, paging kata, spasi kata | `npx remotion add`, transkripsi Whisper **WebGPU** + model `small.en` (Inggris saja), unduh kode remote "unchanged", contoh landscape 1920×1080 |
| `remotion-docs` | **dihapus** 2026-11-16 (keputusan pemilik, D-024) | mencari API Remotion | fungsinya hanya panggilan keluar (Algolia + remotion.dev); mendorong API terbaru (> 4.0.540) |
| `remotion-best-practices` | **ditolak** setelah review | — | router ke semua skill yang dikecualikan + jalur `remotion-upgrade` (`npx skills update … --yes`) |
| `heygen-com/hyperframes` | ditolak (alasan pemilik, tidak direview) | — | 2D HTML/GSAP, tumpang tindih dengan Remotion |
| `kevinbadi/blender-skills` | ditolak (alasan pemilik, tidak direview) | — | turntable produk 16:9, Meshy berbayar, lisensi tidak tercantum |

## 3. Hasil review keamanan (2026-11-16)

Metode: setiap file yang dipasang dibaca penuh, ditambah pemindaian pola (install, URL, key, eksekusi, karakter tersembunyi, komentar HTML). Tidak ada isi vendor yang dijalankan.

- VERIFIED: tidak ditemukan obfuscation, eksfiltrasi data, kalimat prompt injection, karakter zero-width/bidi, atau komentar HTML tersembunyi.
- VERIFIED: skill threejs hanya berisi Markdown (tanpa skrip). Perintah install hanya ada di README, ditujukan untuk manusia.
- VERIFIED: `remotion-markup` membawa folder `remotion-maps/` bersarang (32 file). Isinya:
  - Dua skrip `.mjs` yang hanya mengolah geometri lokal: tanpa jaringan, tanpa child process, tanpa eval.
  - Komponen peta yang membaca `REMOTION_MAPTILER_KEY` / `REMOTION_GOOGLE_MAPS_API_KEY` dan memuat tile serta kode dari CDN.
  - Dokumen yang menyarankan key "unrestricted" dan menyembunyikan atribusi penyedia peta.

  Folder ini tidak terdaftar sebagai skill dan tidak berjalan otomatis. Di luar cakupan proyek.
- OBSERVATION: `remotion-docs` memuat API key Algolia **publik** (pola DocSearch, search-only). Key itu bukan rahasia kita. Risiko nyatanya ada di teks pencarian yang ditulis agen. Aturan: teks pencarian hanya berisi istilah teknis, tanpa nama pemilik, proyek, channel, atau isi naskah.
- OBSERVATION: `remotion-markup/voiceover.md` menyuruh agen meminta API key ElevenLabs. Di proyek ini dilarang: suara dibuat pemilik secara manual ([[DECISION-LOG#D-023]]).
- OBSERVATION: `sfx.md` menunjuk klip meme (mis. "vine-boom", "spongebob-fail") dari remotion.media. Hak pakainya tidak jelas (risiko hak cipta, `CLAUDE.md` §11). Tidak dipakai.
- VERIFIED (dari `studio/node_modules/@remotion/renderer`): opsi `overwrite` Remotion bernilai default `true`. Karena itu render hanya lewat skrip npm proyek yang diakhiri `finish_render.mjs`.

## 4. Bentrok dan penyelesaiannya

| Bentrok | Penyelesaian (di `video-production` §9) |
|---|---|
| Waktu dari `Clock`/`Timer`/`getDelta`/`setAnimationLoop`/`useFrame` delta/`MathUtils.damp` | waktu hanya dari `useCurrentFrame()`/`fps`; spring/easing pakai `spring()`/`interpolate()`/`Easing` Remotion |
| `AnimationMixer.update(delta)` | `mixer.setTime(frame / fps)` |
| `Math.random()` tanpa seed | PRNG ber-seed |
| State menumpuk antar-frame (`+=`, fade, bayangan beku, LOD hysteresis, adaptive DPR) | setiap nilai dihitung langsung dari t |
| WebGPU/TSL | tidak dipakai (render `--gl=angle`); perlu keputusan baru |
| Tone mapping ACES, PBR default | `flat`/`NoToneMapping`; material toon |
| `npx remotion add` / `upgrade` / `npx skills` | dilarang; versi terkunci (Remotion 4.0.540, three 0.186.1, R3F 9.8.2) |
| Render ke path tetap, CLI menimpa default | hanya skrip npm + `finish_render.mjs` |
| API key ElevenLabs, aset remote saat render | dilarang; aset lokal berlisensi jelas |
| Contoh caption landscape | posisi dihitung ulang untuk 1080×1920 dan band 70% |
| Skill vendor menyuruh memuat `remotion-best-practices` | skill itu tidak dipasang; tautan mati, jangan dipasang |

## 5. Yang belum pasti

- UNKNOWN: apakah skill vendor yang terpicu sendiri, tanpa `video-production`, akan mematuhi override. Override hanya terbaca bila `video-production` juga dimuat. Ini dicatat sebagai risiko sisa di [[D-024]].
- UNKNOWN: apakah Remotion mengizinkan redistribusi file skill-nya. Jika suatu saat repo mereka menambah LICENSE yang jelas, pemindahan ke repo bisa dipertimbangkan ulang.
- HYPOTHESIS: skill threejs paling berguna untuk EXP-002 (gerak natural) dan untuk outline tinta. Ini belum diuji di produksi.

## 6. Cara update

Ikuti `.claude/skills/VENDOR.md` §3: clone di luar repo, pilih SHA baru, ekstrak byte-exact dengan `git -c core.autocrlf=false -c core.longpaths=true archive`, diff, review ulang, lalu perbarui hash dan [[DECISION-LOG]]. Jangan pernah memakai `npx skills add/update`, `gh skill install`, atau skill `remotion-upgrade`.
