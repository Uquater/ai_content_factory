---
type: workflow
channel: lab
status: active
version: 1.2
created: 2026-11-14
updated: 2026-11-17
decisions: "[[DECISION-LOG#D-015]], [[DECISION-LOG#D-018]], [[DECISION-LOG#D-021]], [[DECISION-LOG#D-025]], [[DECISION-LOG#D-028]], [[DECISION-LOG#D-031]], [[DECISION-LOG#D-032]], [[DECISION-LOG#D-034]], [[DECISION-LOG#D-035]]"
tags: [workflow, lab, production, 3d]
---

# Studio Workflow — akun lab (video 3D cartoon)

> **v1.0 (2026-11-16, [[DECISION-LOG#D-028]]):** hanya jalur **3D cartoon** di `studio/`. Seluruh aturan 2D/Google Flow **dihapus dari proyek** ([[DECISION-LOG#D-029]]).
>
> **v1.1 (2026-11-17):** evaluasi produksi 2026-11-002 (video pertama) digabung di §7–§10. Aturan yang sudah digantikan ditandai **[DIGANTIKAN]** dan tidak berlaku lagi; teksnya disimpan sebagai riwayat.
>
> **Urutan sumber aturan:**
> 1. `CLAUDE.md`
> 2. target gaya [[2026-11-16-style-target-badai-matahari]]
> 3. dokumen ini
> 4. skill `video-production` (langkah teknis, override)
> 5. skill `inkbeat-shorts` (kerajinan: kamera, cahaya, set, QA)
> 6. skill `threejs-*` / `remotion-*` (teknik)

---

## 1. Karakter (keluarga C1, 3D)

**C1 "Uq"** — disetujui ([[DECISION-LOG#D-018]], model 3D [[DECISION-LOG#D-021]]). Model acuan: `studio/src/c1/C1.tsx` (`C1_LOOK`). Referensi gambar: `refrences/Caracter_Utama.jpg`.
- Kepala besar putih hampir bulat dengan garis tepi; mata titik, alis pendek, mulut kecil.
- Kaos navy dengan "Uq" putih di **dada kiri anatomis** (kanan penonton saat menghadap kamera). C1 **tidak pernah dicerminkan (flip)**.
- Tangan putih berjari (khusus C1).
- **Framing:** wajah dan "Uq" harus terlihat secara alami di sebagian shot. C1 yang menghadap kiri layar (tiga perempat) memperlihatkan keduanya.

**Karakter lain** = preset keluarga yang sama ([[npc-presets]]), tanpa "Uq".
- Identitas datang dari kaos, rambut, aksesori, dan tinggi.
- Adik (C3) memakai celana piyama ([[DECISION-LOG#D-025]]).
- Balita = proporsi anak kecil ([[DECISION-LOG#D-026]]).

~~**Bentuk tubuh warga** (lengan/kaki stick hitam atau bertubuh + celana seperti referensi): **keputusan terbuka** di [[DECISION-LOG#D-028]]. Sampai diputuskan, preset yang sudah disetujui tetap dipakai.~~ **[DIGANTIKAN]** oleh [[DECISION-LOG#D-031]]: **semua karakter bertubuh + celana + sepatu, tinta tipis** (`C1_BODIED`, `castV3.ts`). Kepala, wajah, "Uq", dan tangan C1 tetap.

**Ekspresi** (set yang dipakai):
- tenang/datar: mulut garis;
- kaget: mata bulat, alis naik, mulut "o";
- cemas: alis miring ke dalam;
- senang: senyum kecil;
- mengantuk: mata garis lengkung.

**Teks pada karakter:** hanya "Uq" pada C1. Teks lain (subtitle, jam, pilihan) berupa overlay atau label di dunia (plat nomor, harga).

## 2. Gaya cerita ([[DECISION-LOG#D-015]], handoff 2026-11-15)
- Situasi what-if dari sudut pandang "kamu", ancaman yang terungkap sedikit demi sedikit, tokoh personal (mis. adik). ~~…dan pilihan konkret di akhir.~~ **[DIGANTIKAN untuk video berikutnya]** oleh [[DECISION-LOG#D-034]]: **interaksi antartokoh lebih awal dan payoff di video yang sama**. Pilihan di akhir boleh ada sebagai pertanyaan reflektif, bukan penopang cerita.
- **Seri ([[DECISION-LOG#D-035]], 2026-11-17):** episode boleh berlanjut. Episode 2 melanjutkan Episode 1 (2026-11-002) dari pilihan Uq: tetap di dalam atau keluar lewat belakang. Tiap episode tetap punya payoff sendiri. Fakta akhir episode sebelumnya = kontinuitas (content.md 2026-11-002 §12). Aturan ancaman baru wajib disiapkan dengan petunjuk.
- Bahasa Indonesia lisan yang jelas dan netral, kalimat pendek, kata kerja konkret. Tanpa moral di akhir.
- Hook tidak menjanjikan sesuatu yang tidak dibayar. Fakta nyata wajib bersumber; fiksi diperlakukan sebagai fiksi.
- Durasi mengikuti naskah yang disetujui dan audio nyata (tidak dipaksa 25–45 s).

## 3. Spesifikasi video
- Format: 9:16, 1080 × 1920 untuk final (preview boleh 720 × 1280), 30 fps, H.264 + AAC.
- Audio: master −14 LUFS, true peak ≤ −1 dB.
- Target gaya terukur (malam L* 20–30, ≤ 30 % frame diam, 5–11 potongan/menit, audio tanpa hening): [[2026-11-16-style-target-badai-matahari]] §2 dan §4. **[DIUBAH, D-032]** Angka-angka ini hanya **alat diagnosis**, bukan ukuran keberhasilan. Yang menentukan adalah urutan prioritas di §7.

## 4. Tahapan dan gerbang persetujuan (3D)

| # | Tahap | Pelaksana | Keluaran | Gerbang |
|---|---|---|---|---|
| S1 | Ide | Claude (chat) | konsep + hook + pilihan akhir | 🔒 pemilik memilih |
| S2 | Naskah | Claude (chat) | naskah utuh, L1…Ln | 🔒 terkunci |
| S3 | Voice-over | pemilik (ElevenLabs) + Claude Code | segmen, preview, timing per kalimat | 🔒 audio disetujui |
| S4 | Storyboard | Claude Code | tabel adegan (L#, aksi, lokasi, kamera, cahaya, SFX), dengan **gambar sketsa/still per adegan**, bukan hanya teks | review pemilik |
| S5 | Karakter & set | Claude Code | model/preset, set per lokasi | 🔒 lineup disetujui |
| S6 | **Look-dev** | Claude Code | satu still per lokasi dan cahaya, **berdampingan dengan frame referensi**, plus tabel angka target gaya | 🔒 pemilik |
| S7 | **Pilot 15 s** | Claude Code | 15 detik pertama dengan VO + ambience + SFX + subtitle + UI | 🔒 pemilik |
| S8 | Episode penuh | Claude Code | animatic → final | — |
| S9 | QC | Claude Code + pemilik | teknis (`ffprobe`, frame kosong, audio) **dan** gaya (angka §3 + contact sheet berdampingan dengan referensi, cek tangan/tembus/benda menutupi aksi) | 🔒 render selesai ≠ disetujui |
| S10 | Publikasi | pemilik (manual) | caption, disclosure AI, unggah | 🔒 |

Aturan:
- Tidak ada render episode penuh sebelum S6 dan S7 lolos.
- Laporan selalu menyebut kelemahan terbesar lebih dulu.

## 5. Konsistensi
- Satu sistem koordinat per episode (`studio/src/<ep>/geo.ts`): geografi rumah, jalan, dan arah layar konsisten.
- Karakter selalu dari preset; tidak ada perubahan desain per shot.
- Setiap aksi yang disebut narasi ditampilkan utuh dan bisa dibaca.

## 6. Coverage check (wajib sebelum QC lolos)
- Setiap kalimat L# muncul sekali, berurutan, kata per kata identik dengan naskah terkunci.
- Setiap adegan mencakup kalimatnya. Audio tidak terulang dan tidak terpotong.

## 7. Prioritas produksi dan definisi "smooth" ([[DECISION-LOG#D-032]], pemilik 2026-11-17)
1. Identitas dan bentuk karakter konsisten antar-shot, sudut, dan pose.
2. Gerak dan reaksi alami: tumpuan, perpindahan berat, jeda kepala → badan → tangan.
3. Kejelasan cerita.
4. Set, cahaya, efek, dan cacat kecil = pemolesan sesudahnya.

**"Smooth"** = tubuh tetap utuh, pose terbaca, gerak berkesinambungan. Tangan tidak tiba-tiba hilang, muncul dari torso, atau berpindah tanpa lintasan wajar. Tertutup objek secara alami boleh.

C1 tidak pernah ikut mengucapkan narasi. Kekurangan gerak tidak ditutupi dengan close-up, motion blur, atau potongan.

## 8. Evaluasi produksi 2026-11-002 (video pertama, 2026-11-17)

Sumber: riwayat `content.md`, DECISION-LOG D-021–D-033, catatan di `03-KNOWLEDGE/lessons/2026-11-1*`, perbandingan di `_media/2026-11-002/out/`, kode di `studio/src/`.

### 8.1 Yang berhasil dan sudah diterima pemilik
- Desain bertubuh + celana + tinta tipis (D-031); identitas C1 ("Uq", kepala, tangan berjari) terjaga di seluruh episode.
- Revisi A02–A04 v3 sebagai acuan gerak (D-033): proporsi dijaga lewat jarak kamera, bangun dari kasur dengan tumpuan dan perpindahan berat, kepala memimpin, C1 bereaksi tanpa bicara.
- Animatic v3 + SFX pilihan dari koleksi (disukai); perbaikan set dan lingkungan v4; perbaikan lengan v5 (diterima).
- Audio v2 (VO) dan alur naskah; label "HARI 1"; final v1 untuk tinjau.

### 8.2 Kesalahan penting: gejala → akar masalah (terbukti) → perbaikan → pemeriksaan termurah sebelum render penuh

| # | Gejala | Akar masalah (terbukti) | Perbaikan yang berhasil | Pemeriksaan termurah |
|---|---|---|---|---|
| 1 | **Lengan menembus torso walau telapak tepat** (tangan "hilang lalu muncul dari torso", A02–A04) | IK hanya mengejar telapak; target terlalu dekat badan untuk rig satu-bidang C1, sehingga siku masuk badan. Garis tengah lengan di dalam kaos pada 241/341 frame (8,4 cm). Cek lama tidak menguji lengan vs badan. | `c1ArmIK({ avoidTorso: true })`; target ≥ setengah lebar torso + ruang lengan hampir lurus (±0,30 m saat duduk); satu cabang IK; lintasan rendah di sisi luar badan → 25 frame ≤ 1,2 cm | `c1ArmTorsoDepth` + selisih telapak + lompatan sudut per frame di Node (`tools/situp_check.ts` pola), < 1 detik, **tanpa render** |
| 2 | **Proporsi berubah antar shot** (kepala membesar) | Kamera 1,2–1,6 m dari karakter dengan lensa lebar; distorsi berasal dari **jarak**, bukan lensa. Kamar sempit memaksa kamera dekat. | Kamera ≥ ±2,2 m dari karakter (frame 9:16: ±3 m untuk kepala + bahu); dinding lepas (`wild="east"/"south"`) bila ruangan sempit; insert boleh dekat | Hitung jarak kamera → karakter terdekat per shot dari plan (angka), lalu 1 still per shot |
| 3 | **Tumpuan, lintasan tangan, dan transisi pose kaku/meloncat** (duduk 0,3 s seperti papan; lengan meloncat 40–172° saat berganti solusi IK; grip lepas saat badan berbalik) | Pose dianimasikan sebagai sudut tanpa kontak; IK berganti cabang ((a,w) ≡ (−a, w+180), bidang di batas ±90°); titik pegang ikut berputar saat karakter berbalik | Kontak dulu (tangan menapak), lalu berat badan; jendela bidang `wMin` dipilih supaya tidak dilewati gerak; mulai dari pose di cabang yang sama; lepas pegangan sebelum berbalik; berhenti jalan dihitung mundur dari titik akhir (snap double support) | Cek numerik per frame (`tools/a08_check.ts` pola): jarak telapak–target, jarak badan, lompatan sudut ≤ ~15°/frame |
| 4 | **Bukaan pintu/jendela dan koordinat antar-rumah** (jendela tetangga di fasad rumah 7; pintu menembus jendela; panel di tengah pintu belakang; jam di bukaan lorong) | `RowHouse` menaruh grup jendela/pintu di x = 0; tata letak relatif pintu/jendela bertumpuk 0,3–0,4 m; `Wall` tidak mendukung bukaan bertumpuk vertikal; dressing tidak dicek terhadap bukaan | Grup di `[x, 0, fz]`; layout tanpa tumpang tindih; `Wall` dipotong per kolom; jam dipindah | Satu still debug per fasad/ruangan (`SetDebug` pola) **dan** daftar interval bukaan/dressing per dinding dicek tumpang tindih (angka) |
| 5 | **Teks TTS, pengulangan audio, subtitle, mix** (L24 terucap dua kali; P01 membaca teks arahan; selisih loudness ±5 dB; `-shortest` memotong 1–3 frame terakhir; loudnorm mendarat −14,5) | File TTS berisi dua ucapan; teks arahan + pagar kode ikut terkirim ke TTS; mix lebih pendek dari gambar; loudnorm linear meleset | `source_window_s` di `vo_preview.py`; kirim **hanya kata yang diucapkan**; mix di-pad ≥ gambar + 40 ms; ukur −14 ± 0,5 dan jendela non-ucapan ≥ 6 dB di bawah RMS suara | Sebelum mix: deteksi diam per file TTS (jumlah ucapan = 1) dan cek teks yang dikirim; sesudah mux: `ffprobe` jumlah frame = plan |
| 6 | **Revisi berulang yang tidak banyak menambah pengalaman menonton** | Lihat daftar di bawah | Prioritas D-032; satu perubahan → satu perbandingan pada kecepatan normal | Tanya: apakah perubahan ini terlihat pada kecepatan normal di kamera final? Bila tidak, berhenti |

**Revisi berbiaya tinggi dengan manfaat kecil (bukti):**
- Uji Blender, satu sesi, ditolak (D-030).
- Pengejaran angka L* / % gelap / % diam di pilot v1/v2: v2 tidak disukai, lalu D-032 menetapkan angka hanya diagnosis.
- Motion blur di pilot v2: tidak diminta, dan gerak dinilai tanpa blur.
- Tambahan 10 warga di v4: hampir tak terlihat di POV sempit.
- Lima mode `env` (`v3/v4/v5/final`) dalam satu komponen: menjaga versi lama tetap bisa dirender, tetapi menambah kerumitan.

### 8.3 Dugaan yang belum terbukti
- Waktu kata subtitle diperkirakan dari jumlah huruf per kalimat (VO hanya punya timing per kalimat). Akurasinya tidak diukur.
- `solveArm` inkbeat (dipakai di A05 jendela, A07 ponsel, A12 saklar, A15 genggam) **belum** diuji dengan `c1ArmTorsoDepth`. Secara visual tidak ada lengan hilang di final, tetapi angkanya belum ada.
- Apakah wajah gelap atau kurangnya ekspresi di adegan dialog mengurangi pemahaman penonton: belum ada data penonton.
- Status "komersial" akun yang ditujukan untuk tumbuh terhadap lisensi ElevenLabs Free: tafsiran hukum, belum terjawab. *[Pembaruan 2026-11-17: untuk 2026-11-002, pemilik mengarahkan narasi diperlakukan sebagai paket Pro, sehingga pertanyaan ini tidak lagi menghambat episode tersebut. Ini arahan pemilik, bukan verifikasi independen.]*

### 8.4 Evaluasi cerita (umpan balik pemilik, bukan analytics)
- Pemilik menilai **interaksi terlalu lambat** dan kurang menyukai **ketergantungan pada pilihan di akhir**.
- Timeline mendukung penilaian ini:
  - interaksi antartokoh pertama baru di 22,8 s (adik muncul);
  - 16–41 s didominasi menonton dan membaca ponsel;
  - aksi fisik antartokoh pertama di 41 s (A08);
  - teka-teki "suaramu" tidak dibayar di dalam video; akhir bergantung pada kartu A/B.
- Video berikutnya ([[DECISION-LOG#D-034]]): ~~**topik berbeda**~~ **[DIGANTIKAN oleh [[DECISION-LOG#D-035]]: Episode 2 melanjutkan Episode 1]**, **interaksi lebih awal**, **payoff di video yang sama**, identitas C1 tetap.

### 8.5 Tiga peningkatan prioritas untuk video berikutnya
1. **Struktur cerita di tahap naskah/storyboard:** tandai detik interaksi pertama dan detik payoff sebelum audio dibuat (S1–S4).
2. **Gerbang angka gerak dan kamera sebelum still/render:** jarak kamera per shot, dan untuk setiap gerak tangan/kontak cek telapak + lengan-vs-torso + lompatan sudut. Pola cek yang sudah ada dipakai ulang per shot.
3. **Hak audio dituntaskan sebelum produksi:** paket VO (berbayar atau tidak) diputuskan sebelum generasi; SFX hanya dari sumber berlisensi tercatat atau sintesis sendiri, dicatat saat impor.

## 9. Komponen siap pakai ulang dan batas pengujiannya

| Komponen | Lokasi | Sudah teruji | Belum teruji (batas) |
|---|---|---|---|
| C1 bertubuh | `c1/C1.tsx` `StickLook.limbs/inkK`, `C1_BODIED` | berdiri, berjalan (A08), duduk dan berbaring di kasur, meraih | duduk di kursi, berlari, membungkuk, memeluk |
| IK lengan C1 | `c1/bodyIk.ts` `c1ArmIK` (`avoidTorso`, `wMin`), `c1ArmTorsoDepth` | bangun dari kasur, pegang lengan orang | rig satu-bidang: tidak bisa siku-keluar / tangan-masuk; target dekat badan |
| Jalan / berhenti / menoleh | `cast/walk.ts`, `Walker.tsx`, `lookTurn` | garis lurus, berhenti di double support, settle, mundur (A08, `flipLegs`) | belok saat jalan, tangga, lari |
| Preset warga bertubuh + varian | `ep002/castV3.ts` | 13 tampilan, gendong ibu–balita | interaksi antar-NPC, duduk |
| Set rumah 7 + jalan | `ep002/sets.tsx` (`HouseInterior`, `StreetSet dense`, `Wall`, `RowHouse`, cahaya `local`, `wild`) | satu tata letak (geo.ts) | lokasi lain perlu geo baru; dressing harus dicek ulang terhadap bukaan |
| Overlay | `ep002/overlay.tsx` (`CaptionsHL`, `DayLabel`, `Cards`, `PhoneUI`) | 9:16, pita 70 % | waktu kata subtitle hanya perkiraan |
| Audio | `scripts/sfx_synth.py`, `ep002_animatic_v3_mix.py` (cue sheet, aturan level), `vo_preview.py` (`source_window_s`), `sfx_analyze.py` | satu episode | mix spesifik episode (cue list perlu ditulis ulang) |
| QC | `tools/finish_render.mjs` (tidak menimpa), `style_measure.py`/`style_video.py` (diagnosis), pola `situp_check`/`a08_check` | — | `ep002_qc.py` membandingkan dengan mix animatic lama (spesifik episode) |

## 10. Pemeriksaan sebelum produksi berikutnya (maks. 8 poin)
1. **Naskah/storyboard:** detik interaksi pertama dan detik payoff tertulis; payoff ada di video yang sama (D-034).
2. **Hak:** paket VO diputuskan sebelum generasi; tiap SFX punya sumber dan lisensi tercatat, atau sintesis sendiri.
3. **TTS:** hanya kata yang diucapkan yang dikirim; tiap file = satu ucapan (deteksi diam); selisih loudness antar-segmen diukur.
4. **Kamera:** jarak ke karakter terdekat ≥ ±2,2 m per shot (insert dikecualikan), dihitung dari plan sebelum still.
5. **Gerak:** setiap tangan/kontak: telapak–target, `c1ArmTorsoDepth`, lompatan sudut ≤ ~15°/frame, satu cabang IK. Cek angka sebelum still.
   - **[2026-11-20, D-054]** Gerak yang belum pernah dipakai (jalan ke arah baru, berbalik, kontak tangan antar-tokoh, tatap lensa): ikuti resep skill `video-production` §14 "Testing a new motion" (klip uji terpisah, batas pilot, kaki, makna dari lensa final, iterasi dideklarasikan) beserta batas rig yang sudah terbukti di sana.
6. **Set:** bukaan per dinding tanpa tumpang tindih; transform grup fasad; dressing vs bukaan; satu still debug per lokasi (awal/tengah/akhir kamera). **Cek numerik jarak tubuh tokoh ke dinding/objek untuk setiap still dan shot** (pola `studio/tools/ld003_clearance.ts`: sampel dari rig yang sama dengan renderer; negatif = tembus); laporkan angkanya (pemilik, 2026-11-17).
7. **Audio/mux:** mix ≥ gambar + 40 ms; −14 ± 0,5 LUFS; jendela non-ucapan ≥ 6 dB di bawah suara; frame hasil mux = plan.
8. **Urutan tinjau:** still pose kunci dari kamera final → potongan pada kecepatan normal tanpa blur → strip per frame di sekitar masalah. Berhenti memoles bila perubahan tidak terlihat pada kecepatan normal.

## Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1–0.4 | 2026-11-14/15 | Versi lama (dihapus, D-029). |
| 1.0 | 2026-11-16 | D-028: aturan 2D/Flow dikeluarkan; target gaya Badai Matahari; gerbang look-dev dan pilot wajib. |
| 1.1 | 2026-11-17 | Evaluasi video pertama (§7–§10): prioritas D-032, definisi "smooth", kesalahan terbukti + pemeriksaan termurah, komponen siap pakai, checklist pra-produksi; aturan tubuh warga, pilihan di akhir, dan angka gaya ditandai digantikan/diubah. |
| 1.2 | 2026-11-17 | D-035: 2026-11-002 = Episode 1 seri aktif (Uq.cerita); "topik berbeda" untuk video berikutnya digantikan kelanjutan seri (§2, §8.4). 2026-11-001 = arsip pembelajaran. |
| 1.3 | 2026-11-20 | D-054: rujukan ke resep uji gerak baru (skill `video-production` §14) di §10 butir 5. Isi lain tidak diubah. |
