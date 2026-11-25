---
type: experiment
id: "EXP-002"
title: "Uji gerak natural C1: spring, overlap, dan gerak sekunder"
status: planned
channel: lab
created: "2026-11-16"
start-date: ""
end-date: ""
content-units: []
tags: [experiment, animasi, c1, studio, proposal]
---

# Uji gerak natural C1: spring, overlap, dan gerak sekunder

> **PROPOSAL saja (2026-11-16).** Belum dijalankan: tidak ada kode diubah, tidak ada render. Eksekusi menunggu persetujuan pemilik ([[ROADMAP]], task EXP-002, status `proposed`).
> Konteks: [[DECISION-LOG#D-021]] (C1 revisi 1 = acuan), [[DECISION-LOG#D-024]] (skill pihak ketiga sebagai referensi), skill [[video-production]] v0.3 (§ Override wajib). Pelajaran sebelumnya: [[2026-11-15-c1-rev1-bahu-dan-gerak]].

## Hipotesis

Jika gerak raih C1 (`studio/src/c1/reach.ts`) memakai `spring()` Remotion sebagai fungsi frame, ditambah overlap kepala → badan → lengan (tiap bagian mulai beberapa frame berbeda) dan follow-through kecil saat berhenti, maka gerak akan dinilai pemilik lebih natural daripada `demo3d_c1_rev1.mp4`, **tanpa** memperburuk akurasi tangan ke gelas. Alasannya: gerak yang terasa kaku biasanya berasal dari kurva easing yang sama untuk semua bagian tubuh, start/stop bersamaan, dan tidak ada sisa gerak setelah berhenti.

Label: HYPOTHESIS. Penyebab kekakuan belum diukur. OBSERVATION dari kode (`studio/src/c1/reach.ts` baris 59–67): kurva sekarang adalah `bezier(...)` per fase dan per bagian (`TEMPO.eyes`, `head`, `approach`, `press`, `slide`, `release`, `back`, `body`), bukan linear murni. Urutan tatapan dulu → kepala → tangan juga sudah ada (D-021 revisi 1). Jadi dugaan "easing linear / tanpa overlap" harus dicek dulu pada render baseline, bukan diasumsikan. Yang belum ada: spring (overshoot fisik), follow-through setelah berhenti, dan gerak idle.

## Variabel

- **Variabel yang diuji (satu per varian, lalu kombinasi):**
  - **V1 — spring pada raih:** `TEMPO` fase reach/settle diganti `spring({frame, fps, config})` dari Remotion (fungsi frame murni). Konfigurasi damping/stiffness dicatat di plan JSON, bukan di kode.
  - **V2 — overlap:** offset mulai antarbagian, mis. kepala/tatapan +0, badan +2–3 frame, lengan atas +4, lengan bawah/tangan +5–6. Follow-through: badan melewati sedikit lalu kembali (amplitudo kecil, mis. ≤ 2°).
  - **V3 — idle breathing:** naik-turun dada/bahu periodik (`Math.sin(2π · frame / periode)`, periode ± 3–4 s, amplitudo ≤ 1% tinggi badan) saat C1 diam.
  - **V4 — kombinasi** varian yang lolos.
- **Variabel yang dijaga tetap:** kamera dan shot `demo-plan.json`, set warung, posisi gelas, `C1_LOOK` (desain), durasi demo 12,2 s, 30 fps, `--gl=angle`, versi terkunci (Remotion 4.0.540, three 0.186.1, R3F 9.8.2).
- **Pembanding (baseline):** `_media/2026-11-001/out/demo3d_c1_rev1.mp4` (md5 `f56826e1fcc33e7b6ff5e3e11d26afbe`, dicatat di content.md 2026-11-001 §6.4) dan keluaran `npm run check:reach` pada kode saat ini (direkam sebelum perubahan pertama).

## Desain

- **Content Unit:** [[04-PRODUCTION/2026-11-001/content|2026-11-001]] (komposisi `WarungDemo`). Bukan video publikasi.
- **Platform:** tidak dipublikasi. Uji internal.
- **Cara kerja (bila disetujui):**
  1. Rekam baseline: `npm run check:reach` (simpan baris `WORST`), still C1 frame acuan (mis. frame 205), md5 render pembanding.
  2. Satu varian per iterasi. Parameter di plan JSON; kode hanya membaca.
  3. Render ke nama baru (`demo3d_c1_exp002_v1.mp4`, `_v2`, …) lewat skrip npm baru. `tools/finish_render.mjs` menolak menimpa. **Tidak ada** render lama yang ditimpa.
  4. QC per varian (lihat Metrik), lalu pemilik menonton baseline vs varian berdampingan.
- **Aturan waktu (wajib, dari [[video-production]] § Override wajib):** semua gerak hanya dari `useCurrentFrame()` / `fps`. Tidak boleh `Clock`, `Timer`, `getDelta()`, `useFrame` dengan delta, `MathUtils.damp`, `requestAnimationFrame`, atau `Math.random()` tanpa seed.

## Metrik

| Metrik | Sumber data | Ambang keberhasilan |
|---|---|---|
| Penilaian pemilik: lebih natural dari baseline? | tonton berdampingan | "ya" dari pemilik (subjektif, dicatat apa adanya) |
| `WORST.errMm` (galat telapak ke gelas) | `npm run check:reach` | tidak lebih buruk dari baseline |
| `WORST.penMm` (tembus meja) | `npm run check:reach` | tidak lebih buruk dari baseline |
| `WORST.maxJointStepDeg` (lompatan sendi per frame) | `npm run check:reach` | tidak lebih buruk dari baseline; spring tidak boleh membuat lonjakan |
| `WORST.minPalmGlassGapMm` | `npm run check:reach` | tidak lebih buruk dari baseline |
| Kontinuitas gerak | contact sheet + every-frame strip (`tools/rev_sheet.py`) | tidak ada pop/lompatan satu frame di luar cut |
| Identitas C1 | still frame acuan, `ImageChops.difference(...).getbbox()` pada pose diam | `None` (piksel identik) pada frame tanpa gerak baru; desain `C1_LOOK` tidak disentuh |
| Determinisme | render still yang sama dua kali | md5 identik |

## Guard

- `C1_LOOK` tetap identik piksel (guard dari [[video-production]] §2). EXP-002 mengubah **gerak**, bukan desain.
- Larangan mirror C1, posisi "Uq" (dada kiri anatomis), dan band caption 70% tetap berlaku.
- Output baru selalu bernama `_v2`/`exp002_*`; `demo3d_c1.mp4`, `demo3d_c1_rev1.mp4`, dan rough cut pilot tidak ditimpa. md5 dicek sebelum dan sesudah sesi.
- Tidak ada `npm install` atau perubahan versi dependency.
- Cadangan file `src/c1/` sebelum perubahan pertama (pola yang sama dengan `_media/2026-11-001/work/c1_rev1_backup/`).

## Hasil

| Varian | Metrik | Nilai | Tanggal |
|---|---|---|---|
| | | | |

## Kesimpulan

- **Hipotesis didukung?** belum dijalankan
- **Label kesimpulan:** —
- **Keterbatasan:** penilaian "natural" bersifat subjektif dan hanya dari satu penilai (pemilik).

## Tindak lanjut

- **Bila berhasil:** pola gerak dicatat di [[video-production]] (versi berikutnya) dan dipakai di pilot.
- **Pelajaran dicatat di:** `03-KNOWLEDGE/lessons/`
- **Keputusan baru (bila ada):** [[DECISION-LOG]]
