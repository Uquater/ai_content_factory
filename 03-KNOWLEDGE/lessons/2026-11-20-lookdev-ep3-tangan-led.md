---
type: lesson
created: 2026-11-20
related: "[[04-PRODUCTION/2026-11-004/content]], [[DECISION-LOG#D-048]], [[2026-11-17-lengan-hilang-sit-up]]"
tags: [lesson, ik, lookdev, 3d]
---

# Look-dev Ep 3: tangan ke wajah orang di samping, dan LED kecil

## 1. Tangan ke wajah orang yang berdiri di samping: periksa jarak akar dulu

- **Situasi:** C1 dan adik berdiri berdampingan dengan akar berjarak 0,39 m (pose akhir Ep 2).
- **Hasil cek (`studio/tools/e004_mouth_check.ts`):**
  - Tangan kanan C1 ke mulut adik: pose akhir hampir bisa (siku 124°).
  - Semua lintasan gagal: lengan masuk torso sendiri atau menembus adik, termasuk 28 variasi posisi dan jalur lewat pose antara.
  - Cadangan pertama (adik menutup mulut sendiri + tangan C1 di bahunya) juga gagal pada jarak 0,39 m: lengan yang menggantung di antara mereka saling tabrak.
  - Cadangan lolos baru setelah jarak akar **0,64 m**.
- **Aturan:** sebelum merancang kontak tangan antar-tokoh yang berdampingan, cek jarak akar dulu. Di bawah ± 0,6 m, lengan satu-bidang C1 tidak punya ruang. Ini sejalan dengan `ADIK_BEHIND` Ep 2 (0,4 m: galat genggam 8 cm).
- **Cara uji lintasan:** interpolasi sendi (bukan posisi tangan) dari pose awal yang bersih. Titik bantu posisi yang tak terjangkau memberi lompatan 140°/frame palsu.
- **Temuan sampingan:** pose genggam akhir Ep 2 S12 sendiri sudah menaruh garis tengah lengan 7,5 cm di dalam torso, karena dulu dipecahkan dengan `solveArm` tanpa `avoidTorso`. Pose warisan harus dicek ulang sebelum dipakai sebagai titik awal.

## 2. LED kecil di malam gelap

- **Masalah:** `pointLight` merah di LED (intensitas 0,004, batas 0,18 m) tetap mewarnai ± 40 cm dinding menjadi merah. Itu tampak seperti bloom, padahal bukan.
- **Solusi:** inti emisif di bawah ambang bloom + **halo layar berdiameter tetap** (overlay DOM di posisi proyeksi kamera yang sama). Hasilnya deterministik, tidak kena tinta atau DOF, dan ukurannya bisa diatur (22 px).
- **Ukuran:** pada jarak 5–6 m dengan fov 26–28, inti LED 5 mm hanya 3–4 px. Tanpa halo, LED tidak terbaca.

## 3. Pilot Ep 3 (2026-11-20)

- **Menunjuk benda yang ada di belakang lensa tidak terbaca.** Lengan memendek ke arah kamera dan menutupi wajah. Sebelum menulis "tokoh menunjuk X" di storyboard, cek sudut antara arah tunjuk dan sumbu lensa. Bila kurang dari ± 45°, pilih lensa lain atau ganti aksinya.
- **Insert POV gelap + dorongan pelan terbaca "diam"** (diagnosis 86 %). Insert lebih dari 2 s di frame gelap butuh aksi yang terlihat atau dorongan yang lebih kuat.
- **`refrences/SFX/sfx-14_click_tiny_noise.wav` tidak bisa didekode ffmpeg** (WAV berisi Vorbis, tag 0x674F). Cek dulu `_media/2026-11-002/sfx/collection/analysis.csv` sebelum menjanjikan SFX dari koleksi.
- **Pass tinta inkbeat** melewati objek yang diberi `userData={{ outline: false }}`. Cara ini dipakai agar kamera rata-plafon tidak bergaris tinta.
