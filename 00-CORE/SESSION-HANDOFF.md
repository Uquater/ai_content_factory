---
type: session-handoff
updated: 2026-11-22
related: "[[ROADMAP]], [[DECISION-LOG]]"
---

# Session Handoff

> Satu file, hanya berisi **status terkini**. Riwayat sesi lama sengaja dihapus (D-029). Keputusan ada di [[DECISION-LOG]], tugas di [[ROADMAP]], dan isi lama di git.

## Pembaruan 2026-11-22 (Ep 3 final + published, D-059/D-060) — BACA INI DULU

- **Ep 3 [[04-PRODUCTION/2026-11-004/content|2026-11-004]]:** pratinjau v3 disetujui; render **final** `_media/2026-11-004/out/final_v1/episode_2026-11-004_final_v1.mp4` (1080×1920, 69,20 s, −14,2 LUFS, −1,9 dBFS, md5 `ef2838bc…`); diunggah sendiri oleh pemilik. **`status: published`, `approved-by-owner: true`** (arahan pemilik). Platform/URL/waktu tayang **UNKNOWN**; `published-urls` kosong.
- **Kartu A/B:** `CardsAB` di `studio/src/ep004/Episode004.tsx` (khusus Ep 3, terpusat x = 540, ×0,80 dari kartu Ep 1/2). Caption L6 f842–844 ditutup; f132 dibiarkan. content.md §25.11, §26, §27.
- **Terbuka sebagai pelajaran (bukan perbaikan Ep 3):** kerlip tepi S10 (39,47–39,53 s), LED-3 di zona atas, caption di zona bawah, kartu 28–44 px di zona kanan, sinkron warisan pilot, ponsel S07→S08.
- **Berikutnya (menunggu pemilik):** URL/platform; ID YouTube ke `daily_fetch.ps1`; snapshot analytics; suara A/B Ep 3 (D-046/D-047) → arah Ep 4. Belum di-commit: semua pekerjaan sesudah `484f1be`.
- **Jangan:** commit, push tanpa izin pemilik.

## Pembaruan 2026-11-21 (tahap 3: rakit episode + pratinjau, D-058) — riwayat

- **Status Ep 3:** `scripted`, belum approved. Tanpa render final, commit, push.
- **Komposisi episode:** `studio/src/ep004/Episode004.tsx` (id `Episode004`, 2076 frame = 69,20 s; 17 shot, pilot apa adanya lewat salinan ShotView, jam global t = frame/30, shot dipaksa per Sequence). Opsi aditif: `stage55(t, force?)`, `PhoneUI004 hold`.
- **Audio:** `_media/2026-11-004/audio/episode/2026-11-004_episode_v3.wav/.m4a` = v2 + 1600 sampel hening (3.321.600 sampel; bagian v2 identik bit).
- **Render pratinjau:** `npm run render:episode004preview` → `_media/2026-11-004/out/episode_preview_v1/episode_2026-11-004_preview_v1.mp4` (540×960, `--scale=0.5`).
- **QC:** `studio/tools/e004_episode_check.ts` (`seq|cuts|sync|captions|strings|zones`), `e004_text_diff.py`, `e004_flicker_scan.py` (`--alt 1 --flat 0|1`), `e004_safezone_sheet.py`; log di `_media/2026-11-004/out/episode_preview_v1/qc/`. Hasil: content.md §25, DECISION-LOG D-058.
- **Selesai:** pratinjau dirender dan di-QC. Lolos: ffprobe, −14,2 LUFS / −1,9 dBTP, teks 0 selisih, sinkron ≤ 1 f (kecuali 3 warisan/rancangan), sambungan potongan 0,0 cm.
- **Menunggu pemilik (urut):** (1) kerlip tepi set S10 (tanpa tokoh 1,28 % piksel bolak-balik di ROI bingkai lukisan vs pilot 0,01 % seluruh bingkai; bukan encoder/skala/per-tab/lampu tokoh; penyebab UNKNOWN; S13 tidak terbukti) — perlu keputusan diagnosis; (1b) caption kosong f842–844 di L6 (dan f132 warisan pilot), usulan jembatani celah < 0,15 s; (2) sinkron warisan pilot (kenop +2,5 f, kilau S09 +2,25 f); (3) zona aman (caption di zona bawah, LED-3 di zona atas, kartu); (4) ponsel S07→S08 lewat S08a; (5) S05 angkat ponsel; (6) opsi B cahaya layar S07 sesudah menonton.
- **Jangan:** render final, commit, push, ubah naskah/VO/C1/npc/stepper/sets/kode Ep 1–2/pilot, mix ulang.

## Pembaruan 2026-11-20 (tahap 2 lanjutan, kelompok B+C, D-057) — riwayat

- **Status Ep 3:** `scripted`, belum approved. **Semua shot episode sekarang punya kode** (pilot S01/S02/S08a/S08/S09 + `Ep004Shot-S03…S07, S10…S15, I15`). Rencana kerja tetap `studio/src/ep004/episode004-plan-d055.json`.
- **Kode baru:** `src/ep004/jambCover004.tsx` (penutup kusen, semua shot Ep 3), `episode004B.ts` (S03–S07), `overlay004.tsx` (UI nomor tidak dikenal, layar ponsel). `episode004Stage.ts` mengarah ke kelompok B (< 30,675 s) dan S15 (≥ 59,2 s). QC: `npx esbuild tools/m004_check.ts --bundle --platform=node --log-level=warning --outfile=out/<tmp>.cjs && node out/<tmp>.cjs groupB|groupC`. Gambar `_media/2026-11-004/out/shots_v2/` (versi terakhir: `seq_S04_v3`, `seq_S05_v2`, `seq_S06_v2`, `seq_S07_v2`, lainnya `seq_<shot>`).
- **Menunggu pemilik:**
  1. Kusen kriteria (b): selisih antarframe sisa 0,24–0,40 vs dinding 0,05–0,20 (gerigi hilang; 0 % piksel > 8). content.md §24.3.
  2. Sofa S10 f67–f69 (kode Ep 1–2): opsi (a) penutup Ep 3 / (b) perbaiki sets.tsx / (c) biarkan. §24.2.
  3. Usulan lensa yang menyimpang dari storyboard: S04 fov 40→37, S07 36→34, S05 depan-kiri fov 18. §24.1.
  4. Kelemahan makna: tangan Uq lepas dari bahu tidak terlihat (S04); cahaya layar di wajah S07 samar; S05 punggung ponsel; wajah Uq y 682–695 di bawah kartu.
- **Berikutnya (sesudah pemilik):** render pratinjau episode (komposisi episode belum ada: rangkai pilot + `Ep004Shot`, offset Blok B pilot +3,275 s), mix (sesi lain), QC gabungan.

## Pembaruan 2026-11-20 (tahap 2, kelompok A, D-056) — riwayat

- **Status Ep 3:** `scripted`, belum approved. Rencana kerja = `studio/src/ep004/episode004-plan-d055.json` (69,15 s, disetujui pemilik). Perubahan rencana berikutnya ke file baru bernomor, jangan menimpa.
- **Sudah final dari pemilik:** S10 = (c) geser-rapat varian D-055 (iterasi tangan gagal 0/6, jadi sentuhan = risiko pratinjau; jangan iterasi lagi); I15 2,0 s, saling pandang 1,80 s, S15 pemetaan "lama"; noda bayangan bulan diterima.
- **Kelompok A selesai dikodekan** (`studio/src/ep004/episode004Stage.ts`, `Episode004Shot.tsx`, komposisi `Ep004Shot-S10/-S11/-S12`; QC `npx esbuild tools/m004_check.ts --bundle --platform=node --log-level=warning --outfile=out/<tmp>.cjs && node out/<tmp>.cjs groupA`; gambar `_media/2026-11-004/out/shots_v1/`):
  - S10 lolos angka; S11 lolos (fov akhir 28,12 agar LED-3 tetap di bingkai).
  - **S12 tertahan:** kusen pintu kamar z-fighting (`Door` di `src/ep002/sets.tsx`, kode Ep 1). 3 opsi di content.md 2026-11-004 §23.4. **Menunggu pemilik.** Risiko yang sama mungkin ada di S03 (pintu belakang) dan S13–S15.
- **Berikutnya (tunggu arahan pemilik atas S12 hanya untuk S12; kelompok B tidak bergantung padanya):**
- **Kelompok B (S03–S07) — belum dikerjakan. Rencana kerja (USULAN, belum diuji):**
  - S03 9,20–12,40: lensa Ep 2 S10 (−0,8; 1,5; −0,4) → (−0,8; 1,49; −0,95), fov 40 → 39, bidik (−0,8; 1,15; −5,0); tanpa tokoh; dorong terus.
  - S04 12,40–19,22: lensa (0,62; 1,45; 2,50) fov 30, dorong ± 3 %/s. Kepala naik ke toa pada 12,6. Tangan dilepas dengan jalur S02 yang sudah dicek, dibalik dan dalam urutan terbalik: tangan Uq bahu → MID [15, 75, −90] → REST (mis. 14,4–15,2), lalu tangan adik mulut → REST (15,2–16,0). Angka tetap wajib dicek ulang.
  - S05 19,22–21,22 insert ponsel: getar 19,27; tangan kiri Uq (kode "R") mengangkat ponsel ke depan dada. Pola Ep 2 S08 ada di `src/ep003/episode003Stage.ts` (`phoneToHand`, `phoneFromHand`, `PHONE_FRONT`; tidak diekspor, jadi salin ke modul Ep 3; kode Ep 2 tidak diubah). Butuh uji gerak §14 (angkat lengan ponsel: sendi, torso).
  - S06 21,22–26,11 UI: komponen baru di `src/ep004/` dengan pola `PhoneUI2` Ep 2 (`src/ep003/Episode003.tsx`), **tanpa ikon perisai**, kepala "Nomor tidak dikenal" + nomor tersamar `+62 8•• •••• ••17`, gelembung L5 "Ini petugas keamanan. HP saya diambil. Pesan tadi bukan dari saya." Dorong pelan 2–3 %.
  - S07 26,11–30,675: lensa panjang (0,68; 1,4; 2,55) fov 26, wajah diterangi layar dari bawah (≤ ~2 cd dalam 1 m); adik condong dari sisi kanan Uq; mata Uq layar → atas → layar. Layar padam 27,5 (versi v0.1) → sekarang di awal S08a pilot (30,675).
- **Kelompok C (S13–S15, I15, kartu, tatap) — belum dikerjakan.**
  - S13 49,73–54,02: lensa P fov 40, dorong pelan; tokoh dari `charsAt` (`episode004Stage.ts`; putar balik 52,72–53,82 sudah ada di rantai).
  - S14 54,02–59,20: UI pesan kedua (gelembung L10 "Mereka bisa lihat semua ruangan. Kecuali satu." di bawah L5, chat nomor yang sama), getar 54,12.
  - I15 59,20–61,20 dan S15 61,20–69,15: `CLIPS55.insert` / `dua` / `tatap2` di `episode004Stage.ts` (pemetaan "lama", look0 1,80). Klip `dua` hanya 2 s dan `tatap2` hanya ± 2 s di sekitar tatap: S15 utuh (7,95 s, termasuk lirik ponsel pada "membalas pesan itu" dan diam 0,8 s di akhir) masih harus dirangkai. Kartu akhir 65,75 (`CardsEp1` dari `src/ep003/Episode003.tsx`, teks KIRI "balas pesan itu", KANAN "tutup kameranya"), Doom 65,90. Lirik ponsel pada "membalas pesan itu" dan tatap lensa 64,65–65,65 sudah ada di klip `tatap2`.
- **Keputusan pemilik butir 8 (berlaku untuk B/C):** ponsel di tangan kiri Uq, jaket di lengan kanan adik, "Uq" di dada kiri anatomis, C1.tsx tidak diubah. Uji halo pada kamera bergerak (pendar hanya bila LED tidak tertutup). Kartu akhir gaya Ep 1 (dua kartu berdampingan di atas, tanpa label AB, dentuman sesudah narasi, tanpa kartu ketiga). Jangan menyebut nama film inspirasi di teks apa pun.
- **Cek di S13–S15:** LED D, L, K sudah menyala. Hitung apakah ada yang terproyeksi ke bingkai lensa P dan apakah gerbang oklusi dinding menutupnya (`ledPx` di `tools/m004_check.ts`, mode `groupA`, sebagai pola).
- Untuk shot baru: tambahkan id ke `SHOT_IDS` dan cabang di `stage55` (`episode004Stage.ts`); komposisi otomatis lewat `E004_SHOTS`. QC: §14 skill `video-production` + batas pilot v3.

## Pembaruan 2026-11-20 (tahap 1c, D-055) — riwayat

- **Status Ep 3:** `scripted`, belum approved. Rencana terbaru (draft) `studio/src/ep004/episode004-plan-d055.json`: insert I15 2,0 s, total **69,15 s**. Rencana 68,35 s dan D-054 tidak diedit.
- **Mundur S10:** (a) gagal (D-054). (b) gagal cek berantai: LED-3 lorong dan LED-4 kamar terhalang dari R1 baru. (c) geser-rapat (`studio/src/ep004/shuffle004.ts`) **lolos angka**, tetapi kangkang 46–48 cm dan tangan Uq tampak menyentuh adik (1,4–1,7 s) → **tidak dinyatakan final, menunggu pemilik**. Jangan membuat opsi baru tanpa pemilik.
- **Lolos angka:** berbalik 0,70 s (0,85 s tidak muat), S13 tidak terpengaruh, insert 2,0 s, tatap 3,8°/−3,5°.
- **Menunggu pemilik:** S10 (c), pemetaan dorong lensa P ("lama" / "cepat" / "mulai"), saling pandang 1,80 s, noda bayangan bulan (bayangan jari Uq dari `MoonSpot`, `ep002/sets.tsx`), risiko LED-3 di S11 (content.md 2026-11-004 §22.8).
- Mix episode belum dijalankan ulang (cue dari L11 +0,80 s; langkah S10 dari gambar). Gambar uji: `_media/2026-11-004/out/motion_v3/`.

## Pembaruan 2026-11-20 (tahap 1: uji empat gerak) — riwayat

- **Rencana waktu 68,35 s disetujui pemilik** ([[DECISION-LOG#D-053]]). Shot pilot (S01, S02, S08a, S08, S09) tidak diubah. Ep 3 tetap `scripted`, belum approved.
- **Uji gerak** (content.md 2026-11-004 §20; kode `studio/src/ep004/motion004.ts`, `MotionTest004.tsx`, angka `studio/tools/m004_check.ts`, gambar `_media/2026-11-004/out/motion_v1/qc/`):
  - **Mundur ± 1 m: gagal visual.** Kaki bersilang karena lintasan storyboard ± 50° menyamping dari badan yang menghadap LED-1. 3 opsi di §20.3.
  - **Genggam ulang: gagal makna.** Dari lensa P, tangan tampak di depan perut adik. Titik temu di antara mereka gagal angka di 96 kombinasi. 3 opsi di §20.4.
  - **Berbalik:** lolos dengan usulan adik melangkah 0,10 m (di tempat: 0,4 cm, gagal).
  - **Tatap lensa:** lolos; lemah karena lensa hanya 4° dari depan.
- **Menunggu pemilik:** opsi mundur, opsi genggam, setuju/tidak langkah 0,10 m. Sesudah itu baru kode panggung S03–S07/S10–S15.
- Usulan resep uji untuk skill `video-production` §14 ada di §20.7 (belum ditulis ke skill).

## Pembaruan 2026-11-20 (pilot v3 dikunci) — riwayat

- **Pilot v3 diterima tanpa perubahan** ([[DECISION-LOG#D-052]]). Hanya gerbang pilot yang lolos; Ep 3 tetap `scripted`, belum approved/published. Jadwal kartu (7,150 / 7,350 / klik 7,850 / tahan 1,0 s / habis 9,200 s) = keputusan pemilik.
- **VO:** 11 file lengkap di `_media/2026-11-004/audio/vo_raw/`; N04 satu take diarsipkan (jangan dihapus). Isi suara **belum diverifikasi** (tidak ada alat transkripsi; pemilik perlu mendengar). 3 SFX baru (kenop, napas, langkah gang) ada dan terbuka.
- **Rencana episode (draft, content.md §19):** 68,35 s dari durasi VO asli; `studio/src/ep004/episode004-plan-draft.json`; skrip `scripts/ep004_episode_plan.py`, pra-cek mix `scripts/ep004_episode_premix_check.py`.
- **Penghalang render episode penuh:** kode panggung S03–S07 dan S10–S15 belum ada; gerak S10 (mundur, berbalik) belum diuji; skrip mix episode belum ada; semua bunyi belum didengar.

## Pembaruan 2026-11-20 (pilot v3) — riwayat

- **Ep 3 pilot v3** ([[DECISION-LOG#D-051]], Opsi 2) = `_media/2026-11-004/out/pilot_v3/pilot_2026-11-004_v3.mp4` (16,30 s); QC `pilot_v3/qc/`, content.md §18. **Menunggu tinjauan pemilik.**
- L3 dan potongan S02 → S03 mundur **2,414 s** (L3 9,310 s); estimasi episode ± 65,8 s; premis selesai 12,31 s (jendela 3–10 s = HYPOTHESIS).
- Usulan pending: klik 0,5 s sesudah kartu kanan; tahan 1,0 s sesudah klik.
- Terbuka: sisa 5 px garis mulut adik di S02 (3 opsi di §18.4); limiter master 8,9 dB di bisikan D01; N04a/b/c belum ada; semua bunyi belum didengar.
- Plan v3: `studio/src/ep004/pilot004-plan-v3.json`; `npm run render:pilot004v3`.

## Pembaruan 2026-11-20 (pilot v2) — riwayat

- **Ep 3 pilot v2** ([[DECISION-LOG#D-050]]) = `_media/2026-11-004/out/pilot_v2/pilot_2026-11-004_v2.mp4` (13,40 s); QC di `pilot_v2/qc/` dan content.md §17. **Menunggu tinjauan pemilik.**
- **Tertahan:** kartu recap di T + 0,5 / T + 1,0 s (T = 6,650 s) jatuh sesudah potongan S02 → S03 (6,8 s) dan di atas L3. Pemilik memilih: Opsi 1 (kartu di atas S03 saat L3) atau Opsi 2 (L3 dan potongan mundur ± 2,2 s). Usulan tahan 1,0 s sesudah klik belum disetujui.
- Plan pilot v2: `studio/src/ep004/pilot004-plan-v2.json`; `npm run render:pilot004v2`.

## Pembaruan 2026-11-20 (larut) — riwayat

- **Ep 3 2026-11-004:** storyboard **v0.3** ([[DECISION-LOG#D-049]]). **Pilot v1** dua blok (A 0–6,8 s, B 27,4–35,0 s) = `_media/2026-11-004/out/pilot_v1/pilot_2026-11-004_v1.mp4`, 14,40 s, −14,3 LUFS, −2,4 dBTP; QC di `pilot_v1/qc/` dan content.md §16.4. **Menunggu tinjauan pemilik.** Belum diizinkan: episode penuh.
- Kode baru: `studio/src/ep004/` (`LookDev004.tsx`, `Pilot004.tsx`, `pilot004Stage.ts`, `e004Poses.ts`, `occlusion004.ts`, `pilot004-plan.json`); QC `studio/tools/e004_*.ts`, `p004_check.ts`; audio `scripts/ep004_pilot_audio.py`; `npm run render:pilot004` (menolak menimpa).
- **Kelemahan terbesar pilot:** tunjukan adik S08 terbaca sebagai tangan di wajah (LED di belakang lensa P); POV S09 nyaris diam 3,4 s; `sfx-14` tidak bisa didekode → klik sintesis.
- **VO:** N04a/b/c belum ada (hanya N04 satu take).

## Pembaruan 2026-11-20 (malam) — riwayat

- **Ep 3 2026-11-004:** storyboard **v0.2** ([[DECISION-LOG#D-048]]). **Look-dev v1** aset baru di `_media/2026-11-004/out/lookdev_v1/` (15 still, `ld1_sheet_*.jpg`, angka `ld1_*.txt`); QC + 5 keputusan di content.md §15. **Menunggu tinjauan pemilik.** Belum diizinkan: pilot, audio, render video.
- **S02:** usulan tangan Uq di mulut adik **gagal** di angka (`studio/tools/e004_mouth_check.ts`). **Cadangan dipakai:** adik menutup mulut sendiri dengan tangan kiri; tangan kanan Uq di bahu kiri adik; adik 0,25 m lebih jauh dari Uq. Pose di `studio/src/ep004/e004Poses.ts`.
- **Kelemahan terbesar look-dev (content.md §15.2):** (1) slot kenop **terlihat** dari kamera asli Ep 2 S04 = konflik kontinuitas; (2) frame kenop S01 hampir hitam (L* 4); (3) kamera lorong rata-plafon tetap tampak ± 14 px di Ep 2 S06; (4) LED jauh kecil (S11 pakai fov 32); (5) kilau lensa Blok B samar; (6) cadangan S02 butuh adik 0,25 m lebih jauh. Bukti: `ld1_sheet_kontinuitas_ep2.jpg`.
- **VO yang harus digenerate pemilik (11 file):** `2026-11-004_vo_{N01,P01,N02,N03,D01,N04a,N04b,N04c,P02,N05,N06}_take01.mp3` (§7).
- **Temuan lama Ep 2 (tidak diubah):** pose genggam akhir S12, lengan kanan Uq 7,5 cm di dalam torso (`c1ArmTorsoDepth`).

## Pembaruan 2026-11-20 (sore) — riwayat

- **Ep 3 [[04-PRODUCTION/2026-11-004/content|2026-11-004]]:** naskah **v1.0 dikunci** ([[DECISION-LOG#D-047]]), `status: scripted`. **Storyboard v0.1** 15 shot ± 63,9 s (§11) dan cek badan kamera Ep 1–2 (§10) **menunggu tinjauan pemilik**; 11 keputusan di §14. Denah: `_media/2026-11-004/storyboard/denah_kamera_led_v0.1.png`; skrip cek: `_media/2026-11-004/camcheck/`.
  - Titik LED usulan: tamu = sudut langit-langit tenggara; dapur = plafon sisi timur; kamar = dinding timur di atas kepala ranjang. Ketiganya tidak pernah masuk bingkai Ep 1–2. Lorong = konflik kecil (Ep 2 S06, 2,2 s) → usulan kamera rata-plafon.
  - Tokoh harus mundur ± 1 m agar dapur, lorong, dan kamar terlihat; daun pintu kamar 77° menutupi kamar dari posisi akhir Ep 2.
  - Risiko terbesar: tangan Uq menutup mulut adik (cek angka IK dulu), keterbacaan LED (halo ≥ 18 px), kenop bola polos tidak terlihat berputar (perlu penanda).
  - **Belum diizinkan:** look-dev, audio, render.
- **Ambang suara (D-047):** ≥ 5 suara jelas + pemenang unggul ≥ 2; kurang dari itu pemilik memutuskan. CHANNEL-DNA v0.6.
- **Ep 2 2026-11-003 dirapikan:** `published`, `approved-by-owner: true`, YouTube `N5rrQ6IRqQk` (API daftar unggahan), IG/TikTok UNKNOWN.
- **Dentuman Ep 3:** pemilik mendengar Doom; cadangan = `sfx-19` + saturasi + `Sub Drop 2`.
- Bagian 2026-11-20 di bawah sebagian sudah usang (ambang ≥ 10, status Ep 2, "storyboard belum diizinkan").

## Pembaruan 2026-11-20 — riwayat (pagi)

- **Arah seri ([[DECISION-LOG#D-045]], pemilik):** cerita "rumah nomor tujuh" selesai di **Ep 5**. Kompleks diawasi dan dijadikan tontonan; warga tahu, Uq dan adik tidak; petugas keamanan = orang dalam yang memperingatkan; twist meta: narator = toa, pilihan "kamu" = pilihan penonton. Tidak boleh menyebut nama film apa pun. Cabang Ep 3–4 menyatu di tengah. Ep 5 akhir tertutup tanpa kartu (Uq masuk ruang pengeras suara dengan kunci dari petugas dan berbicara dengan suaranya sendiri).
- **Ep 3 = [[04-PRODUCTION/2026-11-004/content|2026-11-004]] "Ada yang Menonton"** — **cabang B dipilih** ([[DECISION-LOG#D-046]], suara terbanyak komentar Ep 2). `status: idea`, **naskah draft v0.2 cabang B** (75 kata, ± 62–67 s; v0.1 kedua cabang diarsipkan di §9). Paket VO 9 segmen (§7, `_media/2026-11-004/audio/vo_raw/2026-11-004_vo_<seg>_take01.mp3`). **Menunggu tinjauan pemilik.** Terbuka: ambang suara (usulan ≥ 10 suara jelas + unggul ≥ 2), dentuman Doom 77 % energi < 80 Hz (dengar di ponsel), cek frame Ep 1–2 untuk badan kamera dan pintu kamar sebelum storyboard, kamar mandi belum ada di denah (§4.1), 3 SFX baru (kenop, langkah santai, napas tertahan; prompt §6.1). **Belum diizinkan:** storyboard, look-dev, audio, render.
- **Kebijakan suara (D-046):** seri interaktif channel ini = cabang mengikuti suara terbanyak komentar; seri/terlalu sedikit → pemilik. CHANNEL-DNA v0.5. Pertanyaan terbuka D-045 soal twist "pilihan penonton" **terjawab**.
- **Suara Ep 2 (snapshot 2026-11-20 01:39 WIB, 20 akun):** KIRI/A 2, KANAN/B 5, ambigu 2. File: `05-DATA/analytics/2026-11-003/suara-ab_20261119T1839Z.md`. Claude tidak memilih cabang.
- **Analytics:** scope komentar aktif (login ulang pemilik 2026-11-20). Task Scheduler `uq-youtube-fetch` harian 09:00 (hanya saat pemilik login Windows; episode baru harus ditambahkan ke `scripts/analytics/daily_fetch.ps1`). Retention Ep 2 masih belum tersedia (Studio: maks. 2 hari). Laporan: `05-DATA/analytics/2026-11-002/2026-11-20-*`, `…/suara-ab-ep1-dan-tema-2026-11-20.md`.
- **Belum dirapikan (perlu persetujuan pemilik):** content.md 2026-11-003 masih `status: rendered`, `published-urls: []` padahal Ep 2 tayang 2026-11-18 21:33 WIB (`N5rrQ6IRqQk`). Berkas komentar mentah `comments_*.json` (teks publik, penulis di-hash): pemilik memutuskan apakah masuk Git.
- **Belum di-commit:** semua pekerjaan sesudah `484f1be`.

## Pembaruan 2026-11-18 malam — analytics YouTube

- **Ep 2 sudah tayang** di YouTube: `N5rrQ6IRqQk` (21:33 WIB, 1:10, judul "Suara di Toa Itu Tahu Kami di Dapur | Episode 2 #shorts"). `published-urls` di content.md belum diisi; status `published` hanya diubah atas persetujuan pemilik.
- **Snapshot API 22:03 WIB:** Ep 1 (38,7 j) 235.506 views, 4.531 likes, 85 komentar (snapshot 2 pada 13,2 j: 21.822 / 732 / 24). Ep 2 (0,5 j) 519 / 16 / 4. Laporan: [[05-DATA/analytics/2026-11-002/2026-11-18-snapshot-03-youtube-api|Ep 1]], [[05-DATA/analytics/2026-11-003/2026-11-18-snapshot-01-youtube-api|Ep 2]].
- **UNKNOWN:** semua metrik Analytics API (retention, durasi tonton, traffic, subscriber per video): API mengembalikan 0 baris, bahkan di tingkat channel (views = 0) padahal penghitung publik 235 ribu.
- **Terblokir:** komentar dan suara A/B. `commentThreads.list` → 403 "insufficient authentication scopes". Perlu keputusan pemilik (lihat chat). Skrip: `scripts/analytics/youtube_extra.py` (uploads, comments); `youtube_api.py fetch` kini menerima `--video-id`.

## Status 2026-11-17 — riwayat; status aktif ada di bagian 2026-11-20 di atas

**Arah proyek ([[DECISION-LOG#D-035]]):** channel **Uq.cerita** menjalankan seri **"Peringatan dengan Suaramu Sendiri"**. Prioritas sesi: Episode 1 yang sudah tayang dan kelanjutannya (Episode 2).

**Nama:** **Uq.story** = nama brand/proyek dalam arahan pemilik (juga nama folder kredensial `.uq-story-analytics`). **Uq.cerita** (`@uq.cerita`, YouTube channel ID `UCvVSxi8NwGhsKfCXAauBZKA`, terverifikasi API 2026-11-17) = nama akun publik di platform. Nama akun tidak diubah.

| Urutan produksi | ID produksi | Judul | Peran |
|---|---|---|---|
| 1 | `2026-11-001` | Angka di Atas Kepala Sahabatmu | **Arsip pembelajaran** (tidak tayang, tidak dilanjutkan) |
| 2 | [[04-PRODUCTION/2026-11-002/content\|2026-11-002]] | Peringatan dengan Suaramu Sendiri | **Episode 1**, tayang 2026-11-17 di YouTube Shorts, Instagram Reels, TikTok |
| 3 | [[04-PRODUCTION/2026-11-003/content\|2026-11-003]] | Dapur Juga Tidak Kosong (judul kerja) | **Episode 2**, cabang A (tetap di dalam), **naskah v1.0 disetujui**, storyboard v0.5, look-dev disetujui (D-039); **pilot S03–S06 v1 dirender dengan VO pemilik, menunggu tinjauan** (`_media/2026-11-003/out/pilot_v1/`, QC di `QC_pilot_v1.md`; usulan kamera S06 baru = [[DECISION-LOG#D-040]] pending); rincian content.md §10.3. VO 13 segmen sudah ada di `vo_raw/` (hanya 4 dipakai) |

- **Nomor episode = urutan cerita yang tayang**, bukan urutan ID produksi.
- **Episode 1:** final `_media/2026-11-002/out/episode_2026-11-002_final_v1.mp4` (99,6 s). Status `published`; `approved-by-owner` tetap `false` sampai pemilik menyatakan lain.
- **Analytics YouTube via API (2026-11-17 20:33 WIB, umur ±13,2 jam):** 21.822 views publik, 732 likes, 24 komentar; Analytics API belum mengembalikan baris (retention, durasi tonton, traffic belum ada). Laporan [[05-DATA/analytics/2026-11-002/2026-11-17-snapshot-02-youtube-api|snapshot 2]]; alat `scripts/analytics/youtube_api.py fetch --content-id 2026-11-002` ([[youtube-analytics-api]]). Snapshot manual dan API **beda cakupan**, jangan dihitung sebagai pertumbuhan. Isi komentar belum dibaca. Instagram/TikTok API belum terhubung.
- **Analytics manual:** [[05-DATA/analytics/2026-11-002/2026-11-17-snapshot-01-analisis|snapshot 1]] (umur ±11 jam) dan `05-DATA/metrics.csv`. Grafik retention belum ada. Snapshot berikutnya: 24 jam, 72 jam, 7 hari.
- **Hak audio Episode 1:** arahan pemilik sudah tercatat di content.md 2026-11-002 (ElevenLabs paket Pro diasumsikan; SFX folder proyek boleh dipakai). Jangan diaudit ulang.
- **Episode 2:** melanjutkan dari pilihan Uq: **tetap di dalam** bersama adik, atau **keluar lewat pintu belakang**. Kontinuitas: content.md 2026-11-002 §12. **Pemilik memilih cabang A ([[DECISION-LOG#D-036]], 2026-11-17 malam).** Content Unit [[04-PRODUCTION/2026-11-003/content|2026-11-003]]: **Naskah v1.0 disetujui pemilik 2026-11-17** (naskah + arahan visual: label "HARI 1 / EPISODE 2", kartu vertikal "A. INTIP PINTU DEPAN / B. TETAP DIAM BERSAMA ADIK" yang muncul saat narasi penutup; 116 kata, ± 66,6 s estimasi). `approved-by-owner` tetap `false` (= video final); persetujuan naskah di `script-approved`. **Storyboard v0.2** (content.md §3: 12 shot; §3.0 bukti ponsel/tangan dari frame Ep 1; §3.3 cahaya ke kaca; §3.4 kontinuitas genggaman; §4 aset; §5 uji) **menunggu tinjauan pemilik**. Temuan v0.2: kaca lubang angin memakai `MeshBasicMaterial` (tidak bereaksi cahaya, perlu material baru); dari 0,15 m senter tidak mencapai kaca (model ± 0 %), jadi Uq berdiri ± 1,0 m dengan sorot miring lalu maju; hasilnya **harus dibuktikan lewat preview**. **Look-dev v2 (2026-11-17):** `_media/2026-11-003/out/lookdev_dapur_v2/` (content.md §7.1), menunggu keputusan pemilik soal kamera momen sapuan/gerendel (wajah + kaca tidak bisa satu bingkai: Uq menghadap dinding kaca). Cek jarak tubuh = QC tetap (`tools/ld003_clearance.ts`). Garis kusen/langit-langit terang bersumber dari rim `CastLight`, diganti lampu karakter lokal di look-dev. **Pembaruan (D-037):** storyboard disetujui → v0.3 (sapuan "mencari gerendel"). **Still look-dev dapur v1** a–e + lembar referensi di `_media/2026-11-003/out/lookdev_dapur_v1/` (content.md §7), **menunggu tinjauan pemilik**. Temuan utama: gerendel tertutup badan Uq dari sumbu S03; bentuk cahaya belum terbaca sebagai "ditutup telapak"; kaca berubah terang (R/B 0,60 → 0,91) tetapi baru samar hangat; still a terlalu terang (L* 33). Belum diizinkan: pilot, audio, render video. Cadangan (b)/(c) belum disetujui. Ponsel: asumsi di saku kiri, dipegang tangan kiri (di akhir Ep 1 tangan kiri kosong, tangan kanan memegang adik); genggaman diraih kembali di S11. Toa di atas reaksi tokoh; celah cahaya di bawah pintu depan ditunda. Pilot 15 s tetap S03–S06 (daftar uji §5.1; pemeriksaan lain terpisah §5.2). Temuan geometri: pintu depan dan belakang tidak bisa satu bingkai vertikal; shot akhir memakai pola pan Ep 1 A17. Usulan pilot 15 s: S03–S06. **Belum diizinkan:** generasi audio, still, render. Hak audio memakai arahan pemilik yang tercatat (ElevenLabs Pro diasumsikan, SFX folder proyek boleh). **Langkah berikutnya:** revisi/persetujuan naskah → storyboard → audio (generasi manual pemilik) → look-dev/pilot sesuai gerbang CLAUDE.md §16. Belum ada storyboard, audio, atau render. Ringkasan brief asli (riwayat):
  - **Cabang A — tetap di dalam** (rekomendasi Claude): Uq mengunci pintu belakang dan menunggu petugas. Adik menghubungkan petunjuk lampu Ep 1 → uji senter: lorong tanpa jendela = toa diam; dapur (cahaya bocor lewat lubang angin pintu belakang) = toa: "Dapur juga tidak kosong." **Temuan:** suara tahu apa yang terlihat dari luar, termasuk sisi gang. **Akhir:** pesan petugas "Saya sudah di depan rumah 7. Buka pintunya." + tiga ketukan di pintu **belakang**. Set rumah 7 + 2 tokoh; aset baru: cahaya senter, SFX ketukan, VO baru.
  - **Cabang B — keluar lewat belakang:** pintu depan diketuk tepat saat mereka keluar; adik memakai jaket dan menunjukkan jalan pintas gang; sampai di pos/ruang pengeras suara. **Temuan:** petugas membuka ruangan, kosong, mikrofon tak terpasang, toa tetap bicara. **Akhir:** "Keluarga nomor tujuh sudah di luar." Warga berjalan ke pos. Butuh set gang + pos + karakter petugas (gerbang desain), gerak di ruang sempit.
  - Aturan ancaman di A ("tahu yang terlihat dari luar") = usulan, berdasar reaksi lampu A13 Ep 1; perlu persetujuan pemilik. Label "HARI 1" untuk Ep 2: keputusan terbuka.
- **Tetap berlaku untuk Episode 2** (D-034 butir 2 dan 4): interaksi antartokoh lebih awal, payoff di video yang sama, identitas C1 tetap. Checklist pra-produksi: [[STUDIO-WORKFLOW]] §10.
- **Dibatalkan:** brief chat 2026-11-17 berisi premis ojol, angka kebohongan, dan angkot, termasuk rekomendasi menghidupkan ulang 2026-11-001. Aturan "episode berikutnya topik lain" ([[DECISION-LOG#D-034]] butir 1) **digantikan** D-035.
- **Arsip pembelajaran** (2026-11-001, demo 2D/3D, rough cut pilot, Tyo, uji Blender, look-dev, pilot 15 s, dan catatan di `03-KNOWLEDGE/lessons/`): boleh dibaca untuk pelajaran produksi (gerak, konsistensi bentuk, cahaya, suara, proses revisi), **bukan sumber alur cerita aktif**. Kode dan aset yang masih dipakai (`studio/src/c1`, `cast`, `ep002`, `inkbeat`, `scripts/sfx_*`) tetap dipakai.
- **Aturan kerja video** (CLAUDE.md §16) tetap berlaku; lihat bagian riwayat di bawah.

## Status 2026-11-16 (malam) — riwayat; status aktif ada di atas

**Aturan kerja video (wajib, CLAUDE.md §16):**
1. Baca target gaya [[2026-11-16-style-target-badai-matahari]] dan [[STUDIO-WORKFLOW]] v1.0.
2. Muat skill `video-production` dulu. §11 mengarahkan ke `inkbeat-shorts` (kerajinan), `threejs-*`, dan `remotion-*` (teknik). Sebutkan skill yang dipakai di laporan.
3. Gerbang wajib: look-dev berdampingan dengan frame referensi → pemilik; pilot 15 s bersuara → pemilik; baru episode penuh.
4. Jalur 2D/Google Flow sudah **dihapus** dari proyek. Jangan dihidupkan lagi.

**Episode aktif:** [[04-PRODUCTION/2026-11-002/content|2026-11-002]] "Peringatan dengan Suaramu Sendiri".
- **Naskah dan audio v2 disetujui** (98,56 s). Berkas di `_media/2026-11-002/audio/preview/`; timing di `…_v2_timing.json`.
- **Animatic v2 ditolak** ("banyak yang tidak masuk akal… jelek"). Diagnosis: [[2026-11-16-animatic-v2-ditolak]].
- Masih berlaku dari keputusan sebelumnya:
  - storyboard v0.2 dengan penyesuaian D-025/D-026;
  - cast/preset D-027 (bentuk tubuh akan diubah menurut D-029);
  - plan JSON dan mix audio (`scripts/ep002_animatic_prep.py`).

**Keputusan terbaru (D-029):**
- Tinta tetap ada, tetapi garisnya tipis.
- Semua karakter bertubuh + bercelana (stick hitam hilang di malam gelap). Kepala, wajah, dan "Uq" C1 tetap.
- SFX, ambience, dan musik dibuat sendiri (sintesis).

**Blender ditinggalkan ([[DECISION-LOG#D-030]]).** Uji v1 tidak disukai pemilik; temuan di [[2026-11-16-uji-blender-v1]]. Produksi tetap di `studio/` (three.js) dengan skill inkbeat/threejs/remotion. SFX sintesis tetap dipakai: `_media/2026-11-002/sfx/` (`scripts/sfx_synth.py`).

**Look-dev three.js v1 selesai, menunggu pemilik (S6):** `_media/2026-11-002/out/lookdev_v1/lookdev_v1_vs_ref.jpg`. Temuan: [[2026-11-16-lookdev-threejs-v1]].
- Kelemahan terbesar: interior masih terang dan rata (tamu L* 40,7; referensi interior lampu L* ≈ 13), dan set kosong.

**Langkah berikutnya:** penilaian pemilik atas tubuh, tinta, dan cahaya. Sesudah itu:
- lampu genangan (decay/distance lampu set);
- isi properti ≥ 12 per bingkai;
- pilot 15 s.

**Pembaruan 2026-11-16 (lanjutan, [[DECISION-LOG#D-031]]):**
- **Disetujui:** desain tubuh + celana + tinta tipis (look-dev v1). **Belum:** pencahayaan dan video.
- Stack wajib: Three.js/R3F + Remotion. Skill `threejs-*` / `remotion-*` diterapkan, bukan sekadar disebut.
- **Pilot 15 s (A01–A04) selesai, menunggu pemilik (S7):**
  - video utama `_media/2026-11-002/out/pilot_2026-11-002_v2.mp4` (motion blur);
  - versi tanpa blur `…_v1.mp4`;
  - perbandingan `…_v2_vs_ref.jpg`;
  - look-dev v2 `out/lookdev_v2/`;
  - catatan: [[2026-11-16-pilot-15s-v1]].
- **Kode baru (aditif):**
  - `ep002/Pilot.tsx` (`Pilot002`, `Pilot002Sub`);
  - `sets.tsx` `light="local"`, `moonReach`, `dressing`;
  - `C1.tsx` `limbs.feet`;
  - `overlay.tsx` `CaptionsHL`;
  - `LookDev.tsx` v2;
  - `tools/style_video.py`, `scripts/ep002_pilot_mix.py`;
  - SFX `rustle`, `bed_creak`, `clock_tick`;
  - npm `render:pilot002`, `render:pilot002-mb`.
- **Kelemahan terbesar pilot:**
  - cahaya belum sekontras referensi (hitam pekat + genangan hangat);
  - shot terlalu dekat;
  - akting A04 tipis;
  - gumpalan cahaya bulan di dinding.
- **Langkah berikutnya:** penilaian pemilik atas pilot. Sesudah itu, perbaikan sesuai penilaian, baru episode penuh.

**Pembaruan 2026-11-17:**
- Pemilik belum menyukai pilot v2. **Prioritas pemilik:** (1) bentuk karakter konsisten, (2) gerak alami, (3) kejelasan cerita, (4) set/cahaya/efek sebagai pemolesan nanti. Angka gaya hanya untuk diagnosis.
- SFX/musik tambahan pilot v2 tidak disetujui.
- **Revisi A02–A04 v3 selesai, menunggu pemilik:**
  - `_media/2026-11-002/out/pilot_2026-11-002_a02-a04_v3.mp4`;
  - sebelum/sesudah `…_a02-a04_v1-vs-v3.mp4`;
  - catatan: [[2026-11-17-pilot-a02-a04-v3]].
- **Kode:**
  - `studio/src/ep002/PilotV3.tsx` + `v3motion.ts`;
  - `src/c1/bodyIk.ts` (IK lengan pada rig C1);
  - `sets.tsx` `wild="east"`;
  - `tools/situp_check.ts`;
  - npm `render:pilot002v3`.
- **Daftar perbaikan set berikutnya** (di catatan): dua jendela berhimpitan (lokasi perlu diverifikasi), gumpalan cahaya bulan di dinding, kotak selimut.

**Pembaruan 2026-11-17 (lanjutan, [[DECISION-LOG#D-033]]):**
- Pemilik menyukai arah revisi A02–A04 v3 sebagai **acuan produksi**; video final belum disetujui.
- **Animatic v3 lengkap selesai, menunggu pemilik:** `_media/2026-11-002/out/episode_2026-11-002_animatic_v3.mp4` (tanpa blur, 2987 frame, SFX usulan). Catatan, cue sheet, dan cacat: [[2026-11-17-animatic-v3]].
- **SFX:**
  - 15 cue: 9 dari koleksi pemilik dan 6 sintesis;
  - semuanya **kandidat** yang perlu didengar pemilik;
  - sumber/lisensi koleksi belum diketahui dan harus dituntaskan sebelum publikasi;
  - `sfx-05` dan `sfx-16` dikecualikan (tag lagu/hak cipta).
- Musik latar: menunggu keputusan pemilik.
- **Langkah berikutnya:** pemilik menilai alur, gerak, dan mix. Sesudah itu, perbaikan sesuai penilaian (akting wajah di adegan dialog, cahaya, daftar set).

**Pembaruan 2026-11-17 (set + lingkungan):**
- Pemilik menyukai animatic v3 dan SFX-nya.
- **Animatic v4 selesai, menunggu pemilik:** `_media/2026-11-002/out/episode_2026-11-002_animatic_v4.mp4`. Perbandingan sebelum/sesudah ada di `out/v4_compare/`.
- **Penyebab dan perbaikan 4 cacat:**
  - `RowHouse` menaruh grup jendela/pintu di x = 0 (cacat 1 dan 4);
  - `Wall` tidak mendukung bukaan bertumpuk (cacat 2);
  - jam berada di bukaan lorong (cacat 3).
- **Lingkungan:** +7 rumah depan, +17 rumah deret belakang, +10 warga, jeruji pagar di-instancing.
- **Render:** penuh 179,8 s, puncak 5,1 GB, tanpa hambatan.
- Catatan: [[2026-11-17-set-fix-env-v4]].
- **Kekurangan yang tersisa:** warga tambahan hampir tak terlihat di POV sempit A14/A05b; akting wajah di adegan dialog; cahaya (lampu pintu A08, noda bulan).

**Pembaruan 2026-11-17 (lengan C1 saat bangun):**
- Penyebab tangan "hilang lalu muncul dari torso": IK lengan tanpa batas tubuh, ditambah target tangan yang terlalu dekat badan.
- Diperbaiki di mode lengan `v3c` / `Ep002AnimaticV5` (= v4 + lengan baru).
- Perbandingan: `_media/2026-11-002/out/arm_fix/a02-a04_v4-vs-v5.mp4`.
- Catatan: [[2026-11-17-lengan-hilang-sit-up]]. Aturan baru di skill video-production §13.
- **Langkah berikutnya:** penilaian pemilik; bila disetujui, render episode lengkap v5.

**Pembaruan 2026-11-17 (final tinjau):**
- **Final v1** siap ditinjau: `_media/2026-11-002/out/episode_2026-11-002_final_v1.mp4`.
- **Paket unggah:** `_media/2026-11-002/upload/paket_unggah_v1.md` + `sampul_v1.png`.
- ~~**Belum dipublikasikan.** Tindakan pemilik:~~ (riwayat; video sudah tayang 2026-11-17)
  1. ~~VO (ElevenLabs Free): publikasi non-komersial dengan "elevenlabs.io" di judul, atau paket berbayar + generate ulang VO.~~
  2. ~~Sumber/lisensi 9 SFX koleksi, atau ganti dengan SFX sintesis.~~
  3. ~~Unggah manual.~~ Selesai oleh pemilik.
- **Pembaruan 2026-11-17 (arahan pemilik):** poin 1 dan 2 ditutup. Narasi ElevenLabs diperlakukan sebagai dibuat dengan paket Pro; SFX dari folder SFX proyek boleh dipakai di video yang dipublikasikan. Ini arahan pemilik, bukan verifikasi independen atas paket atau lisensi. Analytics snapshot 1: `05-DATA/analytics/2026-11-002/`.
- **Penyempurnaan untuk video berikutnya:**
  - akting wajah di adegan dialog;
  - lingkaran lampu terang di pintu A08;
  - noda bulan di dinding kamar;
  - genggaman A15 masuk pita subtitle saat kamera mundur;
  - insert ponsel A07a sempit;
  - warga tambahan kurang terlihat di POV sempit.
- ~~Episode berikutnya memakai topik lain.~~ **[DIGANTIKAN 2026-11-17, [[DECISION-LOG#D-035]]]** Episode 2 melanjutkan Episode 1.

**Pembaruan 2026-11-17 (evaluasi produksi):**
- Evaluasi video pertama digabung ke [[STUDIO-WORKFLOW]] v1.1 §7–§10:
  - prioritas dan definisi "smooth";
  - 6 kesalahan terbukti beserta pemeriksaan termurahnya;
  - dugaan yang belum terbukti;
  - komponen siap pakai dan batas ujinya;
  - checklist 8 poin.
- Aturan lama ditandai **[DIGANTIKAN]** di workflow, skill video-production, dan target gaya.
- Arah cerita video berikutnya: [[DECISION-LOG#D-034]] (~~topik baru~~, interaksi lebih awal, payoff di video yang sama). **"Topik baru" digantikan [[DECISION-LOG#D-035]].**
- ~~**Langkah berikutnya:** ide/naskah video kedua, mulai dari checklist §10.~~ **[DIGANTIKAN]** Lihat status aktif di atas: Episode 2 melanjutkan Episode 1.

**Belum di-commit:** semua pekerjaan sesudah `484f1be` (sesi 2026-11-16 siang–malam), termasuk penghapusan 2D. Commit hanya atas izin pemilik.

**EXP-002:** tetap proposal; tidak dijalankan tanpa izin.

**Keamanan (masih terbuka):** token Bearer Obsidian MCP di `.mcp.json` pernah tampil di output sesi 2026-11-15. Pemilik perlu mengganti token di plugin Obsidian MCP lalu memperbarui `.mcp.json`.
