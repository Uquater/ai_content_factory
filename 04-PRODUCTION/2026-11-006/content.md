---
type: content-unit
id: "2026-11-006"
title: "(judul kerja belum ada) Episode 5, penutup seri"
status: idea
channel: lab
channel-name: "Uq.cerita"
series: "Peringatan dengan Suaramu Sendiri"
episode: 5
category: fiksi-misteri-pov
experiment: "penutup seri tanpa kartu; pengungkapan narator dan toa (D-045)"
created: "2026-11-24"
updated: "2026-11-24"
preview-v5-approved-for-final: "2026-11-24 (pemilik, md5 7ee9e5361c27d116a25a4ebd11e82144)"
beat-version: "bagian bersama v1.0 (disetujui pemilik sebagai beat 2026-11-24, D-064)"
branch: "B — minta bukti dulu (pemilik 2026-11-24, voting sementara B 15 : A 0, D-065)"
script-version: "draft v0.1 (menunggu tinjauan pemilik)"
storyboard-version: "v0.1 (menunggu tinjauan pemilik)"
approved-by-owner: false
platforms: [tiktok, reels, shorts]
duration-target-s: 60
published-urls: []
tags: [content-unit, 3d, episode-5, checklist-produksi]
---

# 2026-11-006 — Episode 5 (penutup seri)

> **Cabang B (D-065). Naskah draf v0.1, storyboard v0.1, dan paket VO menunggu tinjauan pemilik; beat bagian bersama disetujui (D-064).** Naskah menunggu pilihan penonton Ep 4 (kartu A "temui satpam sekarang" / B "minta bukti dulu", ≥ 5 suara jelas dan unggul ≥ 2, [[DECISION-LOG#D-046]], [[DECISION-LOG#D-047]]) dan arahan pemilik. Arah cerita: [[DECISION-LOG#D-045]]; jembatan dari Ep 4: [[04-PRODUCTION/2026-11-005/content]] §2.2. Kode studio nanti: `studio/src/ep006/`.

## Status

| Tanggal | Status baru | Oleh | Catatan |
|---|---|---|---|
| 2026-11-24 | idea | Claude | Stub dibuat untuk memuat checklist produksi dari pelajaran Ep 4 (permintaan pemilik). Tidak ada isi cerita. |
| 2026-11-24 | idea | pemilik + Claude | **Beat bagian bersama disetujui sebagai beat** (bukan naskah final, storyboard, VO, atau video); dua koreksi pemilik diterapkan; pembuka A/B terbuka. Lihat D-064. |
| 2026-11-24 | idea | pemilik + Claude | Pemilik memilih **cabang B "minta bukti dulu"** untuk mulai produksi hari ini (voting sementara 15 : 0, D-065). Claude: naskah draf v0.1, storyboard v0.1, paket VO, cek persiapan visual. Menunggu tinjauan pemilik. |
| 2026-11-24 | idea | pemilik + Claude | **Lima keputusan storyboard v0.1 disetujui** (§2.7, D-066): suara Uq = Dhani; ruang toa R2; kamera tatap mulai ± 0,70 m dari mata; bukti satpam = foto kunci di pintu belakang + satu pesan; alis Uq `lowered`. Claude: **animatic penutup v0** (hening) §2.8. Menunggu tinjauan pemilik. |
| 2026-11-24 | idea | pemilik | **Animatic penutup v0f disetujui sebagai acuan gambar dan suara shot penutup** (khusus shot penutup; D-067, §2.10). TAMAT tidak lagi hening. |
| 2026-11-24 | idea | Claude | **Pratinjau episode penuh v4** (540×960, 50,97 s) dari VO asli, cabang B; QC di §4. Atas permintaan pemilik langsung ke pratinjau penuh (tanpa gerbang look-dev/pilot terpisah). Menunggu tinjauan pemilik; bukan render final. |
| 2026-11-24 | idea | Claude | **Pratinjau episode penuh v5** (540×960, 58,57 s) atas arahan pemilik D-068: serah-terima kunci, adik melewati pintu belakang, gembok, N06 utuh + jeda 0,8 s; cek interaksi R1–R5 (v4 GAGAL 13, v5 LOLOS); QC dan timestamp di §5. Menunggu tinjauan pemilik; tanpa render final, commit, push. |
| 2026-11-24 | idea | pemilik | **Menyetujui pratinjau v5 untuk render final** (arahan tertulis 2026-11-24): MP4 final 1080×1920, 30 fps, timing, VO, caption, mix audio v6, dan penutup glitch sama dengan v5; v5 dan bahan produksi disimpan sampai pemilik selesai memeriksa final; tanpa upload, commit, push. Persetujuan ini untuk render final; status `approved`/`published` tetap menunggu pemilik setelah memeriksa final. |
| 2026-11-24 | idea | Claude | **Render FINAL** `_media/2026-11-006/out/final_v1/episode_2026-11-006_final_v1.mp4` (1080×1920, 30 fps, 1757 frame = 58,567 s, H.264 CRF 17 + AAC 48 kHz stereo, md5 `2cd08b75ab3ff4089ed8bc5b10ae1c45`; audio = mix v6; skrip `render:final006`). QC di `final_v1/qc/e006_final_qc.txt`. Menunggu pemeriksaan dan unggahan pemilik; v5 dan bahan produksi disimpan. |

`approved` dan `published` hanya berubah atas persetujuan pemilik.

## 1. Naskah draf v0.1 — cabang B "minta bukti dulu" (2026-11-24, MENUNGGU TINJAUAN PEMILIK)

> Cabang B dipilih pemilik untuk mulai produksi hari ini atas dasar voting sementara ([[DECISION-LOG#D-065]]). Kalimat bagian bersama = D-064 kata per kata; pembuka adalah draf baru. `TOA` = suara "kamu" lewat efek pengeras suara (efek saat mixing). `PESAN` = dibaca narator (kering, dekat; pola Ep 1–4) dan tampil di UI ponsel. **Uq tidak bersuara di pembuka**: permintaan buktinya diketik. Kalimat pertama yang diucapkan Uq di seri ini adalah L9.

```text
PEMBUKA B · 0–11,4 s · bukti, lalu pintu belakang
[0–3,0 s · VISUAL — Kamar mandi gelap, akhir Ep 4 (pintu tertutup, satu-satunya cahaya = layar ponsel).
INSERT ponsel di tangan kiri Uq: jempol mengetik dan mengirim gelembung keluar "Buktikan dulu."
Label "HARI 1 / EPISODE 5" masuk 0,25 s. Recap kartu Ep 4 ("minta bukti dulu") tertekan ± 1,5 s
sebagai overlay, tanpa freeze.]
NARATOR: Kamu meminta bukti.

[3,0–6,4 s · VISUAL — Getar. Balasan dari nomor yang sama: sebuah FOTO. Di foto: tangan bersarung
memegang kunci berlabel "RUANG TOA" di depan pintu belakang rumah 7, dilihat dari gang: kenop bulat
(Ep 3) dan kaca lubang angin di atas pintu (Ep 2), di balik kaca ada pendar merah samar (LED dapur, Ep 3).
Di bawah foto, satu pesan singkat.]
PESAN: "Ini kuncinya. Saya di luar pintu belakang."

[6,4–8,2 s · VISUAL — Dua-shot di kamar mandi gelap, wajah diterangi layar. Uq menatap foto,
lalu mengangkat kepala ke arah pintu kamar mandi. Adik menggenggam lengan Uq.]

[8,2–11,4 s · VISUAL — Dapur gelap, LED dapur menyala. Pintu kamar mandi terbuka; Uq dan adik
menyeberang ke pintu belakang. Uq menggeser gerendel (dikunci di Ep 2), membuka pintu sedikit.
Di celah: gang gelap, lengan berseragam. Tanpa narasi; bunyi gerendel dan engsel.]

BAGIAN BERSAMA (D-064) · 11,4–55,5 s
[BEAT 1 · KUNCI — Insert di celah pintu: tangan berlengan seragam menaruh kunci "RUANG TOA" di
telapak Uq, lalu menunjuk ke timur lewat gang. Satpam tetap berjaga di pintu.]
NARATOR: Kamu menerima kuncinya.

[BEAT 2 · GANG — Uq dan adik menyusuri gang gelap. Di sela rumah, warga masih menghadap rumah 7
yang kosong. Satu LED menyala di dinding gang saat mereka lewat.]
TOA (jauh): "Kalian lewat gang."

[BEAT 3 · PINTU RUANG TOA — Gembok dibuka dengan kunci. Ruangan berdebu, kosong.]
NARATOR: Pintunya masih terkunci. Tidak ada siapa pun di dalam.

[BEAT 4 · BUKTI TONTONAN — Dinding layar pemantau menyala. Grid kanal: dapur, lorong, kamar Uq,
jalan dengan warga, ruang keluarga rumah lain yang sedang menonton rumah 7. Kanal ruang tamu GELAP
(lensa tertutup selotip, Ep 4). Kamar mandi TIDAK punya kanal. Di sisi layar, daftar pilihan bercentang:
"tetap di dalam ✓ / tetap diam bersama adik ✓ / tutup kameranya ✓ / minta bukti dulu ✓".
Satu kotak berlabel "RUANG TOA" memperlihatkan Uq dan adik dari depan: kamera kecil di meja,
LED merah, menatap mereka.]
ADIK (berbisik): "Itu rumah kita…"

[BEAT 5 · NARATOR = TOA — Kotak teks di layar mengetik sendiri. Narator membacanya, dan sedetik
kemudian toa di luar menggemakan kalimat yang sama. Label "SUARA: UQ". Lalu "Kamu akan…"
mulai diketik; kolom "PILIHAN BERIKUTNYA" muncul.]
NARATOR + TOA: Kamu melihat semuanya.
NARATOR: Kamu akan…

[BEAT 6 · TINDAKAN PENENTU — Uq memutar sakelar dari OTOMATIS ke MIKROFON. Ketikan berhenti di
tengah kata, narator terpotong di tengah suku kata, kolom pilihan membeku. Hening.]

[BEAT 7 · SUARA SENDIRI — Uq menarik mikrofon dan menarik napas.]
UQ (suara sedikit bergetar): "Ini Uq, rumah nomor tujuh."
[Potong ke jalan: warga mendengar toa. Satu atau dua orang menurunkan pandangan dan berbalik.
Kembali ke wajah Uq.]
UQ: "Kami bukan tontonan."

[BEAT 8 · TATAPAN — Dari kamera meja (bingkai kanal "RUANG TOA"). Uq mengangkat pandangan dan
menatap lurus ke lensa ± 2 s: alis turun sedikit, kepala diam; tajam, tenang, sedikit terluka.
Hening, hanya room tone.]

[BEAT 9 · PUTUS — Tangan Uq meraih kamera, memenuhi bingkai. Gambar dan suara putus bersamaan.
Hitam ± 0,5 s. Teks "TAMAT". Tanpa kartu pilihan, tanpa dentuman.] **[DIPERBARUI D-067, 2026-11-24: TAMAT tidak hening; 2,5 s terakhir glitch layar dan tulisan, static + denging tipis sampai frame terakhir; lihat §2.10.]**
```

### 1.1 Pecahan per baris

| L# | Pembicara | Teks | Kata | Catatan |
|---|---|---|---:|---|
| V1 | teks layar | HARI 1 / EPISODE 5 | — | label seri |
| V2 | UI (gelembung keluar, diketik Uq) | Buktikan dulu. | — | tidak dibacakan; **UI baru**: gelembung keluar |
| V3 | overlay recap | kartu Ep 4 "minta bukti dulu" | — | pola D-051, tanpa freeze |
| L1 | NARATOR | Kamu meminta bukti. | 3 | |
| L2 | PESAN (narator) | "Ini kuncinya. Saya di luar pintu belakang." | 7 | dengan foto; tidak dicaption (aturan Ep 2–4) |
| L3 | NARATOR | Kamu menerima kuncinya. | 3 | D-064 |
| L4 | TOA (jauh) | "Kalian lewat gang." | 3 | D-064 |
| L5 | NARATOR | Pintunya masih terkunci. Tidak ada siapa pun di dalam. | 9 | D-064 |
| L6 | ADIK (berbisik) | "Itu rumah kita…" | 3 | D-064 |
| L7 | NARATOR + TOA | Kamu melihat semuanya. | 3 | satu take dipakai dua kali (kering, lalu efek toa ± 1 s kemudian) |
| L8 | NARATOR | Kamu akan… | 2 | dipotong di tengah suku kata saat sakelar diputar |
| L9 | UQ | "Ini Uq, rumah nomor tujuh." | 5 | **kalimat pertama Uq**: pilihan suara menunggu pemilik (§3.4) |
| L10 | UQ | "Kami bukan tontonan." | 3 | |
| V4 | layar pemantau | label kanal, "RUANG TOA", daftar pilihan, "SUARA: UQ", "OTOMATIS / MIKROFON", "PILIHAN BERIKUTNYA" | — | teks UI, bukan VO |
| V5 | teks layar | TAMAT | — | |

**Total diucapkan: 41 kata.** Estimasi ± 55,5 s (HYPOTHESIS; dasar Ep 3 0,92 s/kata termasuk aksi tidak berlaku penuh karena beat 4, 6, 8, 9 hampir tanpa kata).

### 1.2 Yang masih harus diputuskan pemilik (naskah)

1. **Bukti satpam** (L2 + foto): foto kunci di depan pintu belakang rumah 7 dengan pendar LED dapur di balik kaca. Ketukan **tidak** dipakai (bisa tertukar dengan tiga ketukan Ep 2 dan pencoba kenop Ep 3). Setuju?
2. **Teks gelembung Uq** "Buktikan dulu." (diketik, tidak diucapkan).
3. **Suara Uq** (§3.4).

## 2. Storyboard v0.1 (2026-11-24) — MENUNGGU TINJAUAN PEMILIK

Waktu = estimasi (HYPOTHESIS) sampai VO ada. Aturan: [[02-CHANNELS/lab/STUDIO-WORKFLOW]] §4 dan §7, [[03-KNOWLEDGE/research/2026-11-16-style-target-badai-matahari]] §4. Skill yang dipakai: `video-production` (§2, §11–§14: aturan C1, resep uji gerak, cek angka) dan `inkbeat-shorts` (SKILL.md §4 plausibilitas; `references/camera-and-editing.md`: lensa close-up wajah 40–50°, kepala kartun besar membatasi lensa; `characters.md`: close-up lewat lensa lebih dekat, frontal mati hanya ± 1 close-up per film). Belum ada still, look-dev, atau render.

### 2.1 Ringkasan shot

| Shot | Waktu (s) | Dur | Isi | Baris |
|---|---|---:|---|---|
| S01 | 0,00–3,00 | 3,00 | INSERT ponsel di kamar mandi gelap (pola Ep 4 S14): jempol Uq mengetik dan mengirim gelembung keluar "Buktikan dulu."; label 0,25 s; recap kartu Ep 4 1,6–3,1 s tanpa freeze | L1 0,6–1,9 |
| S02 | 3,00–6,40 | 3,40 | UI chat: getar 3,0; FOTO masuk 3,2 (kunci "RUANG TOA" di depan pintu belakang rumah 7, kenop bulat, kaca lubang angin, pendar merah LED dapur); pesan di bawah foto | L2 3,6–6,2 |
| S03 | 6,40–8,20 | 1,80 | DUA-SHOT kamar mandi gelap, wajah diterangi layar (framing look-dev Ep 4 tanpa kartu): Uq mengangkat kepala ke pintu; adik memegang lengan Uq | — |
| S04 | 8,20–11,40 | 3,20 | DAPUR (kamera di dapur menghadap utara-timur): tangan Uq membuka pintu kamar mandi, keduanya menyeberang ± 1,9 m, tangan Uq menggeser gerendel 10,4, pintu terbuka 10,8; di celah lengan berseragam. LED dapur terlihat | — |
| S05 | 11,40–15,00 | 3,60 | INSERT celah pintu belakang (benda 45–60 % tinggi bingkai, tangan terlihat): kunci diletakkan di telapak Uq; jari satpam menunjuk ke timur | L3 11,8–13,3 |
| S06 | 15,00–20,00 | 5,00 | EXT GANG, lensa rendah dari timur: Uq dan adik merunduk berjalan ke kamera; di sela rumah 7 dan rumah x 9 terlihat warga di jalan; LED dinding gang menyala 17,0 | L4 17,6–18,9 |
| S07 | 20,00–25,00 | 5,00 | EXT pintu ruang toa (sisi utara gang): INSERT gembok, kunci berputar 20,6, gembok lepas 21,4; pintu terbuka 22,0: ruangan gelap berdebu, kosong | L5 21,0–24,8 |
| S08a | 25,00–28,00 | 3,00 | INT ruang toa WIDE dari ambang pintu (still `prep006_wide`): layar menyala 25,3; grid kanal, kanal ruang tamu gelap, tanpa kanal kamar mandi; daftar pilihan bercentang | — |
| S08b | 28,00–30,50 | 2,50 | INSERT layar: kotak "RUANG TOA" memperlihatkan Uq dan adik dari depan; kamera meja dengan LED merah di sudut bingkai | L6 28,6–29,8 |
| S09 | 30,50–33,50 | 3,00 | INSERT kotak teks: "Kamu melihat semuanya." terketik; label "SUARA: UQ" dengan gelombang | L7 30,9–32,2 (kering) + gema toa 31,9–33,2 |
| S10 | 33,50–35,60 | 2,10 | CLOSE Uq dari depan-kiri, diterangi layar: "Kamu akan…" terketik, kolom "PILIHAN BERIKUTNYA" muncul; mata Uq pindah ke sakelar | L8 34,8–35,6 (dipotong) |
| S11 | 35,60–38,00 | 2,40 | INSERT konsol: tangan Uq memutar sakelar OTOMATIS → MIKROFON (klik 35,6 = potong L8); teks berhenti "Kamu akan m"; kolom membeku; hening | — |
| S12 | 38,00–40,00 | 2,00 | MEDIUM Uq dari depan-kiri: menarik leher mikrofon, napas 39,0 | L9 mulai 39,4 |
| S13 | 40,00–42,60 | 2,60 | EXT JALAN: warga mendengar toa (L9 lewat efek toa); satu atau dua orang menurunkan pandangan dan berbalik; yang lain tetap | L9 sampai ± 41,6 |
| S14 | 42,60–44,60 | 2,00 | CLOSE wajah Uq (kamera S12, lebih dekat) | L10 43,0–44,2 |
| S15 | 44,60–48,30 | 3,70 | **POV kamera meja** (bingkai kanal "RUANG TOA": label kecil + titik REC; frontal penuh, satu-satunya di episode): Uq memalingkan pandangan ke lensa 44,6–45,1; **tatap ± 2,0 s** 45,1–47,1 (alis `lowered`, kepala diam); satu langkah maju ± 0,4 m + meraih 47,1–48,3 (usulan MCU, §2.3); tangan menutup lensa 48,3 → **gambar dan suara putus** | — |
| S16 | 48,30–51,30 | 3,00 | Hitam 0,5 s, "TAMAT" 48,8–51,3, hening | — | **[DIPERBARUI D-067, 2026-11-24: TAMAT tidak hening; 2,5 s terakhir glitch layar dan tulisan, static + denging tipis sampai frame terakhir; lihat §2.10.]**

Total ± 51,3 s (HYPOTHESIS; pembuka 0–11,4 s, bagian bersama 11,4–51,3 s). Lebih pendek dari estimasi beat (± 55,5 s) karena blok tanpa kata dipadatkan; VO asli akan menggeser waktu.

**Blok tanpa narasi** (batas pelajaran Ep 4 5,8 s): 6,2–11,8 s = 5,6 s; 13,3–17,6 = 4,3; 24,8–28,6 = 3,8; 35,6–39,4 = 3,8; **44,2–51,3 = 7,1 s (hening disengaja, arahan pemilik)**.

### 2.2 Lokasi ruang toa (USULAN, berubah dari beat)

- **Pangkal tiang toa tidak bisa dipakai.** Frame final Ep 1 A01 (0–1,6 s) memperlihatkan pangkal tiang di trotoar tanpa bangunan apa pun (VERIFIED, potongan frame `_media/2026-11-006/prep/kontinuitas/a01crop_strip.png`). Proyeksi kotak ruang di pangkal tiang ke kamera A01 dan A14: 27/27 titik terlihat.
- **Usulan R2:** ruang kecil di **utara gang, di belakang rumah x 9**: x 7,0–9,4, z −9,4…−7,3, tinggi 2,5 m, pintu di dinding selatan menghadap gang. Kabel ke tiang toa tidak perlu terlihat. Tidak terlihat dari 11 kamera eksterior Ep 1–4 yang dicek (A01 sepanjang gerak, A14, toa, toa rendah, plat 7, POV kamar, Ep 4 S06); di A01 akhir tertutup rumah 7 dan rumah x 9. Model kotak punya dua bias: tanpa pohon/pagar (condong "terlihat") dan atap kotak padat sampai 4,3 m (condong "tertutup" dekat lisplang). **Dikonfirmasi dengan render** set jalan Ep 1 + kotak warna: R1 (cyan) muncul di pangkal tiang pada A01 awal dan A14, sama seperti angka; R2 (magenta) tidak tampak di A01 u = 0 / 0,5 / 0,75 / 1 dan A14 (`_media/2026-11-006/prep/stills/sheet_ext.png`). Batas: kamera A01 diambil dari literal `AnimaticV3.tsx` dengan lerp linier (gerak asli memakai ease; titik ujung sama); kamera Ep 1 berbentuk ekspresi lain tidak dicek. Jalan dari pintu belakang rumah 7 ± 9 m (dipotong di S06).
- **Dampak ke beat:** beat 2 tetap "lewat gang"; beat 3 berlangsung di pintu yang menghadap gang, bukan di tiang. Teks narasi tidak berubah.

### 2.3 Tatapan dan raihan (hasil cek, `studio/tools/e006_prep.ts` → `_media/2026-11-006/prep/e006_prep.txt`)

- **Batas jangkau C1** (kaki diam, tinggi mata, lengan di luar torso): 0,275 m (tegak), 0,325 (condong 5°), 0,350 m (condong 10°) dari mata. Lengan C1 pendek; kamera yang bisa diraih tanpa melangkah harus ≤ 0,30 m dari mata.
- **Kontak mata:** lensa setinggi mata dan lurus di depan → 0,0° (Ep 3: 3,8° terbaca lemah). Mikrofon di kiri Uq 16 cm di depan, setinggi dagu, tidak menutup wajah di kedua opsi.
- **Opsi ECU (0,30 m, fov 70):** kepala ± 75 % tinggi bingkai, tepi kepala terpotong kiri-kanan (still `prep006_ecu.png`). Raihan **lolos angka**: condong 5°, 0,7 s, sendi maks 8,1 °/frame (batas 11,1), lengan dalam torso 0,09 cm (batas 0,2), jarak ke mikrofon 0,20 m, ke meja 0,10 m, galat telapak 0,3 cm. Still akhir raihan (`prep006_reach.png`): bingkai tertutup tangan dan lengan baju.
- **Opsi MCU (0,80 m, fov 60):** kepala 41 %, wajah dan "Uq" di dada terbaca (`prep006_mcu.png`); langkah ± 0,5 m.
- **Opsi MCU70 (0,70 m, fov 50, USULAN):** kepala 56 %, dalam rentang lensa close-up inkbeat 40–50°; S15 tanpa caption, jadi pita 70 % tidak membatasi (`sheet_mcu70.png`). Butuh **satu langkah maju ± 0,40 m** sebelum meraih. Langkah + raihan **belum diuji** (resep §14 wajib sebelum shot); angka raihan yang lolos di atas hanya untuk opsi ECU tanpa langkah.
- **Hasil alat jujur:** `e006_prep.txt` berakhir `HASIL: GAGAL (1)`. Yang gagal adalah target framing (kepala 40–60 %) **di dalam batas jangkau tanpa langkah**: tidak ada lensa ≤ 0,30 m yang memberinya. Itu keputusan pemilik #2 di §2.6, bukan cacat gerak.
- **Alis "turun sedikit":** nilai baru `brows: "lowered"` di `C1Face` (alis lebih rendah 8 px tekstur, hampir datar). Perbandingan `sheet_alis.png` (kiri worried, kanan lowered). **File karakter yang disetujui (`src/c1/C1.tsx`) mendapat satu opsi alis tambahan**; perilaku lama tidak berubah. Uji: (a) still `C1_BODIED` alis `worried` sebelum/sesudah, ECU dan MCU: identik (`getbbox() = None`); (b) still `C1_LOOK` default (`Ep002Set-kamar`) dengan perubahan dicabut sementara vs terpasang: beda maks 1/255 per kanal, rata-rata 0,0001, sama dengan selisih dua render kode yang identik (render GPU tidak identik bit per bit, maks 1/255). Jadi tidak ada perubahan terlihat; "identik piksel" ketat tidak bisa dibuktikan karena derau render itu.

### 2.4 Risiko terbesar (urut)

1. **Framing tatapan** (§2.3): ECU terlalu rapat (kepala terpotong) atau MCU dengan langkah baru. Keputusan pemilik.
2. **Uq bicara** untuk pertama kali: gerak mulut dari amplop VO (mulut `open`/`flat`) adalah aset baru; diuji dengan amplop sementara sampai VO ada.
3. **Set baru:** gang dari dalam, ruang toa, dinding layar pemantau berisi kanal (render kanal = kamera lain di set yang sama, ditampilkan sebagai tekstur), UI gelembung keluar, foto bukti.
4. **Warga berbalik** (S13): gerak menoleh preset Ep 1 + berbalik di tempat (gerak baru untuk NPC).
5. **Satpam:** hanya lengan/tangan berseragam (S04, S05) dan siluet; aset baru (lengan seragam, sarung tangan, kunci berlabel).
6. **Pintu kamar mandi dan pintu belakang dibuka tangan** (pelajaran Ep 4: pintu tidak boleh terbuka sendiri).
7. **Foto bukti (S02) terbaca?** Pintu belakang dari luar belum pernah tampil; penonton mengenal kenop dan kaca lubang angin dari dalam. Pendar merah LED dapur di balik kaca **belum diverifikasi**: LED-2 di (0; 2,66; −4,13), di atas dan ± 0,9 m di dalam pintu; perlu cek garis pandang dari kamera gang dan apakah kaca lubang angin Ep 2 (`MeshBasicMaterial`) memperlihatkan sesuatu di baliknya.
8. **Grey box:** dinding selatan ruang toa (dengan pintu) belum dimodelkan, jadi still memperlihatkan langit di belakang Uq. Set final wajib tertutup (inkbeat §4: interior tidak boleh memperlihatkan langit).

### 2.5 Aset baru

| Aset | Catatan |
|---|---|
| UI gelembung keluar + foto di chat | turunan UI Ep 3–4 |
| Foto bukti (still dari kamera gang) | render dari set gang |
| Set gang (z −5…−7,3) + LED dinding | Ep 1: gang "tidak pernah diperlihatkan dari luar"; ini penampilan pertama |
| Ruang toa R2 + meja + mikrofon leher angsa + sakelar OTOMATIS/MIKROFON + kamera meja + dinding layar | grey box ada di `src/ep006/Prep006.tsx` (bukan look-dev) |
| Kanal pemantau | dapur, lorong, kamar Uq, jalan, rumah lain, ruang tamu (gelap), RUANG TOA; daftar pilihan |
| Lengan seragam satpam, kunci berlabel, gembok | prop |
| Alis `lowered` | sudah ditambahkan (§2.3) |
| Gerak mulut Uq | belum |
| VO 10 segmen | menunggu pemilik (§3) |

### 2.6 Keputusan untuk pemilik (storyboard v0.1) — DIPUTUSKAN 2026-11-24, lihat §2.7

1. **Lokasi ruang toa R2** (belakang rumah x 9, utara gang) menggantikan pangkal tiang. Setuju?
2. **Framing tatapan:** ECU 0,30 m tanpa langkah (lolos angka; kepala ± 75 % dan terpotong; lensa 70° di luar rentang close-up 40–50°, bisa dibenarkan sebagai webcam di dalam cerita), atau MCU70 0,70 m fov 50 dengan satu langkah maju ± 0,4 m sebelum meraih (belum diuji). Usulan: **MCU70 + langkah** (ekspresi alis dan mata terbaca utuh; langkah ke arah lensa menambah niat).
3. **Alis `lowered`** (still `sheet_alis.png`) sebagai ekspresi tatapan, atau dicampur sedikit `worried` untuk "sedikit terluka"?


### 2.7 Keputusan pemilik atas storyboard v0.1 (2026-11-24, D-066)

1. **Suara Uq (U01, U02) = Dhani**, pembawaan berbeda (napas, bergetar, dekat mikrofon, tanpa efek) sesuai §3.2. U01–U02 boleh dibuat.
2. **Ruang toa = R2**, di belakang rumah tetangga timur (x 9), utara gang; pintu di dinding selatan menghadap gang (§2.2).
3. **Kamera tatap mulai ± 0,70 m dari mata Uq** (lensa 50°, kepala ± 56 % tinggi bingkai), lalu satu langkah maju sebelum meraih (§2.3, opsi MCU70).
4. **Bukti satpam** = foto kunci berlabel di depan pintu belakang rumah 7 + satu pesan (L2), tanpa ketukan (§1.2).
5. **Alis Uq turun sedikit** = `brows: "lowered"` saat tatapan (§2.3).

### 2.8 Animatic penutup v0 (2026-11-24, hening) — MENUNGGU TINJAUAN PEMILIK

- **Berkas untuk ditonton:** `_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0b.mp4` (1080×1920, 30 fps, 192 frame = 6,40 s, H.264 + AAC hening). `…_v0.mp4` = render pertama, **tidak dipakai** (tangan baru masuk bingkai 1 frame sebelum putus, "meraih" tidak terbaca); disimpan sebagai riwayat.
- **Isi:** POV kamera meja (lensa (8,2; 1,324; −8,78), fov 50, label kanal "RUANG TOA" + titik merah). 0–2,05 s tatap lurus ke lensa (alis `lowered`, kepala diam, tanpa kedip); 2,05–2,85 s satu langkah maju 0,40 m (kaki kanan dulu, langkah lalu kaki menyusul); 2,05–3,35 s tangan kanan naik, telapak terbuka terlihat di bagian bawah bingkai mulai 2,63 s, lalu menutup lensa; **3,40 s gambar putus** ke hitam; "TAMAT" masuk 3,9–4,15 s, tahan sampai 6,4 s.
- **Kode:** `studio/src/ep006/closeMotion006.ts` (gerak, fungsi murni t), `studio/src/ep006/Close006.tsx` (komposisi `Close006`, ruang toa kotak polos dengan dinding selatan dan pintu, cahaya monitor di belakang kamera), skrip `npm run render:close006v0b`. Cek: `studio/tools/e006_close_check.ts` → `_media/2026-11-006/out/animatic_close_v0/qc/e006_close_check.txt`. Strip `qc/strip_v0b_langkah_raih_10fps.jpg`, `qc/strip_v0b_akhir_tiapframe.jpg`.
- **Angka (VERIFIED dari model, `HASIL: LOLOS`):** kontak mata 0,0° selama tatap (maks 4,0° saat condong 5° di raihan); kepala 56 % tinggi bingkai di awal, mata di px (540, 818); sendi lengan maks 7,3 °/frame (batas 11,1); lengan masuk torso 0,09 cm (batas 0,2); telapak/siku/lengan bawah ke **meja ≥ 0,436 m**, ke **mikrofon ≥ 0,168 m**; telapak 3,7 cm dari lensa pada frame terakhir; badan ke tepi meja ≥ 0,164 m; kaki tidak menyilang (jarak 0,15–0,43 m); badan maks 0,75 m/s; telapak di bingkai 23 frame (0,77 s) sebelum putus. Uji alat: meja dinaikkan 5 cm → GAGAL seperti seharusnya.
- **Iterasi yang dijalankan:** v0 raihan satu tahap (mulai 2,35 / 2,45 / 2,65 s; terbaik 2,45 s, meja 3,6 cm) → ditinggalkan karena tangan tak terlihat; v0b raihan empat kunci (2,05 istirahat → 2,75 telapak 17 cm di depan lensa → 3,05 10 cm → 3,35 menutup).
- **Kelemahan (urut):**
  1. **Tangan putih di depan wajah putih:** kontras rendah; telapak terbaca dari garis tinta, bukan dari warna (strip 2,9–3,4 s). Perlu look-dev cahaya (mis. tangan lebih gelap di sisi bayangan, atau cahaya monitor dari samping).
  2. **± 5 frame terakhir sebelum putus hampir rata pucat** (tangan memenuhi bingkai 3,23–3,40 s); bisa terbaca sebagai kilatan putih sebelum hitam. Opsi: potong lebih awal (± 3,25 s).
  3. **Wajah membesar sampai ± 122 % tinggi bingkai** saat Uq maju; mata terpotong di tepi pada 0,2 s terakhir sebelum tertutup tangan.
  4. Langkah hanya terbaca sebagai wajah mendekat (kaki tidak terlihat dari lensa setinggi mata); kewajaran langkah dan raihan pada kecepatan normal dinilai pemilik.
  5. Kotak polos: tanpa isi monitor, tanpa adik, tanpa tekstur set; ini uji framing, mata, dan raihan, bukan look-dev.

### 2.9 Pratinjau audio penutup v0c (2026-11-24) — MENUNGGU TINJAUAN PEMILIK

- **Berkas:** `_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0c_sfx.mp4` (6,40 s; **video salinan bit v0b**, md5 gambar identik; audio AAC 48 kHz stereo). Audio sumber `_media/2026-11-006/audio/close/2026-11-006_close_sfx_v0c.wav`; skrip `scripts/ep006_close_sfx.py` (menolak menimpa).
- **Keputusan pemilik:** setelah "Kami bukan tontonan" Uq menatap ± 2 s; saat telapak mengenai lensa terdengar dentuman rendah + static singkat; TAMAT dalam hening. **[DIPERBARUI D-067, 2026-11-24: TAMAT tidak hening; 2,5 s terakhir glitch layar dan tulisan, static + denging tipis sampai frame terakhir; lihat §2.10.]**
- **Waktu hit (VERIFIED, `studio/tools/e006_hit.ts` + onset di MP4):** telapak pertama menyentuh lensa di **frame 99 = 3,300 s** (jarak pusat telapak–lensa 3,9 cm ≤ jari-jari telapak 4 cm). Onset boom di MP4: **3,300 s** (frame 98,97). Puncak boom ± 3,36 s. Gambar putus di frame 102 = 3,400 s; **static di 3,400 s, 3 frame (0,10 s)**, −15 dBFS puncak (boom −4 dBFS). Ekor boom difade 3,73–3,85 s; **hening digital 3,86–6,40 s** (puncak < −120 dBFS; TAMAT masuk 3,90 s). 0–3,29 s hening digital.
- **SFX:** `sfx-19_kick-boom_low_impact.wav` dipakai apa adanya (dinormalkan). `sfx-22_white-noise_burst_short.wav` **tidak bisa didekode** (Vorbis di dalam WAV, format 0x674f; sama seperti sfx-14), jadi static **disintesis** (derau putih bersemai, 3 frame). Bunyi belum didengar Claude.
- **VO U02:** ada (`2026-11-006_vo_U02_take01.mp3`, 1,96 s) tetapi **tidak dipakai**: kalimat "Kami bukan tontonan." jatuh di S14 sebelum shot penutup ini (v0b dimulai pada tatapan, tanpa kata), jadi tidak ada potongan yang cocok di klip ini.
- **Cek MP4:** puncak per kanal −1,95 / −3,66 dBFS, 0 sampel ≥ 0,999 (tanpa clipping; AAC menambah ± 0,8 dB di atas WAV −2,8 dBFS).
- **Catatan:** (1) telapak mendarat dengan perlambatan halus (gerak v0b dipertahankan), tidak menampar; dentuman terdengar pada pendaratan lembut. (2) Pada frame 98 (3,267 s) layar sudah tertutup penuh telapak secara visual, satu frame sebelum kontak model; hit bisa digeser 1 frame lebih awal bila terasa terlambat.

### 2.10 Shot penutup DISETUJUI: acuan v0f_glitch (2026-11-24, D-067)

- **Acuan:** `_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0f_glitch.mp4` (1080×1920, 30 fps, 192 frame = 6,40 s, H.264 + AAC; md5 `8af97c00642252d3143721b77110af6f`). Persetujuan pemilik atas **gambar dan suara shot penutup saja**; naskah, storyboard, dan bagian lain Ep 5 tidak berubah dan belum disetujui sebagai video.
- **Yang diikuti saat merakit episode penuh (angka terukur di MP4 v0f):**
  - **Tatapan:** awal tatapan diselaraskan dengan **akhir VO asli U02 "Kami bukan tontonan."**; durasi tatapan, gerak langkah dan tangan (v0b: tatap 0–2,05 s, langkah 2,05–2,85 s, telapak terlihat mulai 2,63 s) mengikuti v0f.
  - **Low hit dan static saat kamera ditampar:** hit mulai **3,300 s** (frame 99, kontak telapak–lensa); gambar putus ke hitam di **3,400 s** (frame 102) dengan static; boom berakhir sebelum 3,9 s. Waktu relatif terhadap awal tatapan.
  - **2,5 detik terakhir (3,9–6,4 s):** seluruh layar **dan tulisan TAMAT mengalami glitch**. **Static dan denging telinga tipis berlanjut sampai frame terakhir** (di v0f: puncak ± −26 sampai −28 dBFS, rms ± −36 dBFS pada 3,9–6,4 s; puncak keseluruhan −1,38 / −1,88 dBFS per kanal, tanpa clipping).
  - Sebelum hit v0f memuat bunyi sangat pelan (puncak −34 dBFS pada 0–3,25 s); ikuti v0f, jangan menambah.
- **Menggantikan:** arahan "TAMAT dalam hening" (beat 9, S16, §2.8, §2.9) dan "hening digital 3,86–6,40 s" dari v0c. Versi antara (v0, v0b, v0c, v0d, v0e) tidak dipakai; tetap disimpan sebagai riwayat.
- **Belum dikerjakan:** rakit episode penuh (VO asli, selaraskan awal tatapan dengan U02), mix, kode glitch di `studio/` (v0f dibuat di luar sesi ini; sumber v0e/v0f belum ada di repo: `git status` hanya memuat `scripts/ep006_close_sfx.py` untuk v0c). **Sebelum merakit, sumber v0f harus ditemukan atau dibuat ulang agar glitch bisa direproduksi.** Pemilik juga perlu mendengar bunyinya; Claude tidak bisa memutar audio.

## 4. Pratinjau episode penuh v4 (2026-11-24) — MENUNGGU TINJAUAN PEMILIK

- **Berkas:** `_media/2026-11-006/out/episode_preview_v4/episode_2026-11-006_preview_v4.mp4` (540×960 pratinjau seperti Ep 4 §13, 30 fps, 1529 frame = 50,97 s, H.264 + AAC; md5 `849b17f04388590ab5d358f54ea509eb`). Riwayat, tidak dipakai: v1 (penutup putus 1 frame terlambat, sakelar S11 terbaca melambai, caption "KAMU AKAN…" tertinggal 0,25 s), v2 (grid berjudul "LANGSUNG" padahal kanal rumah = rekaman Ep 1–4), v3/v3b (glitch TAMAT abu-abu dengan pita terang di seluruh layar, tidak seperti v0f; v3 juga: suara Uq kering terdengar lebih keras dari toa di shot jalan S13).
- **Gerbang:** pemilik meminta langsung pratinjau episode penuh (2026-11-24); look-dev dan pilot 15 s tidak dijalankan terpisah untuk Ep 5 (kecuali shot penutup v0f, D-067).
- **Kode:** `studio/src/ep006/` — `stage006.ts` (shot, kamera, gerak), `Episode006.tsx` (komposisi `Episode006`, skrip `render:episode006preview_v3`), `sets006.tsx` (gang, ruang toa R2, rak sakelar, tangan satpam, kunci berlabel), `overlay006.tsx` (UI ponsel, grid monitor, kotak teks, **`GlitchTamat006` = reproduksi glitch v0f**), `Chan006.tsx` (still kanal + foto bukti → `studio/public/ep006/`), `Close006.tsx` (`CloseView006` dipakai ulang di S15, gambar = v0f). Tambahan aditif di set lama: `HouseInterior backDoorOpen`, `StreetSet gangWall` (default tidak berubah).
- **Audio:** `scripts/ep006_episode_audio.py plan|mix|closing` → `_media/2026-11-006/audio/episode/2026-11-006_episode_v5.wav` (v1–v4 = iterasi, tidak dipakai). Perspektif suara: di S13 (jalan) U01 terdengar lewat toa dan suara kering di-*duck* −20 dB; di S12/S14 suara kering penuh dan toa −10 dB sebagai bocoran dari luar (bagian >4 kHz di S13 turun dari −28,8 ke −35,4 dB = didominasi rantai toa). Rantai dan level Ep 4 (narator −20, toa −21 + `TOA_CHAIN`, adik −22,5, Uq −20 kering; U01 di jalan lewat rantai toa; N05 diulang lewat toa 1,0 s kemudian). **Penutup ditambahkan sesudah master** (`closing006_audio()`, satu fungsi dipakai ulang untuk render final): dengung, hit `Two_deep_cinematic_Doom` + sfx-19 (pencocokan envelope v0f), static saat putus, denging 2760 Hz + static tipis sampai frame terakhir. Episode −14,4 LUFS, TP −2,0 dBTP; puncak MP4 −1,97 dBFS, 0 sampel clipping.
- **Timing (VO asli):** S01 0,00 · S02 2,93 · S03 6,07 · S04a 9,73 · S04b 12,13 · S05 13,73 · S06a 16,60 · S06b 19,93 · S07a 21,57 · S07b 23,23 · S08a 26,47 · S08b 28,67 · S09 31,17 · S10 33,57 · S10b 34,63 · S11 35,87 · S12 37,47 · S13 39,17 · S14 42,47 · **S15 44,57 (= akhir U02 44,571)**–50,97.

### 4.1 QC (VERIFIED di MP4 v4 kecuali disebut)

| Cek | Hasil | Berkas |
|---|---|---|
| ffprobe | 540×960, 30/1, 1529 frame, 50,967 s, h264 + aac | `qc/e006_preview_qc.txt` |
| Kelengkapan VO | 10/10 segmen terdengar; margin ucapan vs latar 12,5–26,5 dB (terendah P01 toa jauh); N06 terpotong tepat di klik 35,883 s (−17,9 → −35,6 dB) | idem |
| Sinkron caption | 14 halaman, semua di dalam ucapannya ± 0,15 s; teks = naskah v0.1 kata per kata; pesan L2 tidak dicaption (aturan Ep 2–4) | `qc/e006_captions.txt` |
| Tamparan dan glitch (relatif awal tatapan) | hit audio **3,303 s** (rencana 3,30); gambar putus **frame 1439 = 3,400 s**; TAMAT/grain **3,900 s**; static + denging sampai frame terakhir (rms 0,3 s terakhir −36,3 dB) | `qc/e006_preview_qc.txt` |
| Glitch vs v0f (frame per 0,2 s dari 3,9 s) | glitch pada huruf TAMAT (pita huruf bergeser, pinggir merah/sian), latar hampir hitam, TAMAT terbaca di semua frame; perubahan antar-frame 3,9–6,4 s: v4 rata-rata 0,69, 43/74 frame > 0,5 · v0f 0,86, 55/74; luma latar v4 10,6 vs v0f 5,7 (sedikit lebih terang) | `qc/glitch_v0f_vs_v4.png` |
| Penutup vs v0f | gambar S15 = `CloseView006` (kode v0f); level audio per jendela (rms): 0–3,25 −46,0/−46,1; 3,25–3,40 −8,8/−8,6; 3,40–3,50 −9,2/−6,2; 3,50–3,70 −11,4/−9,3; 3,70–3,90 −22,3/−22,5; 4,6–6,35 −33,2/−33,4 (episode/v0f) | mix log |
| Gerak menembus benda (S04a–S14) | `HASIL: GAGAL (2)` = tangan kanan Uq di "dinding utara dapur" pada S04b/S05: posisi tangan x −1,04…−0,89, **di dalam bukaan pintu belakang** (x −1,25…−0,35) = memegang gerendel dan mendorong daun pintu (kontak disengaja; kotak dinding pustaka menutup bukaan). Lainnya lolos: kaki tidak menyilang, jarak antartokoh ≥ 5,8 cm, sendi ≤ 11,09 °/frame, lengan masuk torso ≤ 0,09 cm, kamera tidak di dalam badan/dinding | `qc/e006_check.txt` |
| Penutup (S15) | gerak v0f: `e006_close_check` LOLOS | `qc/e006_close_check.txt` |
| Kedip satu frame | 1 lonjakan (frame 1416 = tangan masuk bingkai di S15), sama persis dengan v0f frame 79 | `qc/e006_preview_qc.txt` |
| Pengungkapan di monitor (still 29,6 s) | kanal DAPUR/LORONG/KAMAR/JALAN = REKAMAN bertimestamp; RUANG TAMU gelap (selotip); **tanpa kanal kamar mandi**; RUMAH 3 dan RUANG TOA = LANGSUNG (bingkai merah); daftar 4 pilihan penonton bercentang | `qc/monitor_grid_29_6s.png` |

### 4.2 Kelemahan yang memengaruhi cerita atau kelayakan publikasi (urut)

0. **Penutup = reproduksi, bukan salinan v0f.** Gambar S15 sampai putus = kode v0f (`CloseView006`). Bunyi hit disintesis ulang (sumber v0f tidak ada di repo): `Two_deep_cinematic_Doom` + sfx-19, ± 3 dB lebih pelan dari v0f di 3,40–3,50 s dan ± 2 dB di 3,50–3,70 s; denging = nada sintesis 2760/1058 Hz. Glitch TAMAT dibuat ulang (`GlitchTamat006`), latar sedikit lebih terang dan sedikit lebih jarang berubah. **Alternatif yang persis:** pakai audio v0f sendiri (didekode dari MP4 acuan, md5 dicatat) sebagai stem tetap di S15.

1. **Grid monitor (S08b) hanya 2,5 s untuk 7 kanal + daftar pilihan.** Kanal DAPUR dan LORONG gelap dan abstrak di layar ponsel; pengungkapan terbaca lewat RUANG TOA, RUMAH 3, JALAN, dan daftar pilihan. Kemungkinan perlu lebih lama atau dorong kamera ke satu kanal.
2. **Elipsis yang tidak diperlihatkan:** pintu ruang toa terbuka di S08a dan tertutup di S12–S15 (ditutup di luar layar); ponsel hilang dari tangan Uq sesudah S03; pintu belakang dari celah ke terbuka lebar antara S05 dan S06a.
3. **Satpam hanya tangan** (S04b, S05); keberadaannya di pintu belakang tidak terlihat sesudah kunci diberikan.
4. **S06b (celah antar-rumah):** warga kecil dan jauh; "warga masih menghadap rumah kosong" lemah terbaca.
5. **S13:** warga yang berbalik terbaca, tetapi kamera rendah di jalan; dua orang menunduk lalu memutar badan ± 150° tanpa melangkah.
6. **Close-up S10/S14 lebar (fov 52–60) dari 0,7 m** karena meja membatasi posisi kamera; wajah besar, sedikit distorsi lensa lebar.
7. **Label HARI 1 / EPISODE 5 menimpa pojok kiri atas kartu recap A** pada 3,23–4,9 s (jendela hook). Perbaikan: label selesai sebelum 3,2 s atau kartu masuk lebih lambat (render ulang).
8. **Berubah dari beat D-064 / storyboard (USULAN, belum disetujui):** kanal rumah berlabel REKAMAN dengan jam sendiri, hanya RUMAH 3 dan RUANG TOA yang LANGSUNG; sakelar OTOMATIS/MIKROFON di rak di kanan Uq (bukan di meja; meja di luar jangkau lengan C1 dari ROOT_A); Uq tidak menarik mikrofon (mikrofon tetap di posisi v0f, ± 0,4 m); shot tambahan S10 (wajah Uq); pintu ruang toa ditutup di luar layar; ponsel hilang sesudah S03.
9. **Batas cek gerak:** warga berputar ± 150° di S13, tangan satpam, kunci, dan gembok tidak dicek; daun pintu ruang toa dimodelkan sebagai kotak terbuka penuh saja.
10. **Warna caption Uq = putih**, sama dengan narator (twist: narator menyalin suaranya). Keputusan pemilik: tetap putih atau warna sendiri.
11. **Dengarkan (Claude tidak bisa mendengar):** 35,88 s potongan N06 ("Kamu akan m…", titik potong ASUMSI dari pembagian huruf); 37,67–39,25 s tarikan napas U01 dan potongan ke jalan pada kata pertama; 44,57 s tatapan mulai; 47,87 s hit.
12. Tidak dinilai Claude: keluwesan gerak pada kecepatan normal, keterbacaan di ponsel.

## 5. Pratinjau episode penuh v5 (2026-11-24, D-068) — DISETUJUI pemilik untuk render final (2026-11-24)

- **Berkas:** `_media/2026-11-006/out/episode_preview_v5/episode_2026-11-006_preview_v5.mp4` (540×960, 30 fps, 1757 frame = 58,57 s, H.264 + AAC; md5 `7ee9e5361c27d116a25a4ebd11e82144`). Iterasi yang sama sesi ini (tidak dipakai, belum ditinjau siapa pun): `_r1` (caption menutup kunci di S05; Uq menoleh menjauhi sakelar), `_r2` dan `_r3` (toleh ke sakelar menyembunyikan wajah dari kamera di kiri Uq → kamera S10c dipindah ke kanan-depan).
- **Audio:** `_media/2026-11-006/audio/episode/2026-11-006_episode_v6.wav` (N06 utuh, tanpa `atrim`; jeda 0,8 s; SFX gembok/pengait baru; bed dua sambungan). WAV −14,8 LUFS, TP −2,0 dB.
- **Perubahan dari v4 (arahan pemilik, D-068):** satpam tubuh utuh di gang (seragam khaki, sarung tangan), lengan kiri lewat celah 0,45 rad; Uq membuka pintu sendiri, condong saat mendorong; kamera S05 dari samping kanan Uq; S06a baru (kamera di gang menghadap pintu: daun didorong lalu berayun melambat ke ± 1,75 rad, satpam menunjuk ke timur, adik lewat ambang); S06c = jalan di gang (S06a lama); gembok kuningan + kupingan + tali pengait (`lock006.ts`), gembok terbuka masuk saku samping, tali pengait dibalik, pintu didorong; rak sakelar 0,85 m; S10c baru (± 0,57 s pada Uq, kepala dan matanya ke sakelar).
- **Timing (dari `episode006-plan.json`):** S01 0,00 · S02 2,93 · S03 6,07 · S04a 9,73 · S04b 11,93 · S05 13,33 · S06a 17,10 · S06c 20,60 · S06b 23,53 · S07a 25,17 · S07b 29,73 · S08a 32,73 · S08b 34,93 · S09 37,43 · S10 39,83 · S10b 40,90 · S10c 42,77 · S11 43,33 · S12 45,07 · S13 46,77 · S14 50,07 · S15 52,17–58,57

### 5.1 Empat momen (timestamp)

| Momen | Hitungan kode (plan/stage) | Diperiksa di MP4 |
|---|---|---|
| Serah-terima kunci | lengan satpam masuk celah 13,48–14,68; telapak Uq naik di bawah kunci 14,23–15,03; **pindah tangan 15,283** (1 frame, lompatan 0 cm); satpam menarik lengan 15,53–16,23 | **MP4-verified 13,4–16,4 s**: tiap frame 13,4–14,7 s (`qc/strip_satpam_masuk_tiapframe.png`, lebar 540) — sarung tangan, manset, kunci, dan label lewat celah di kiri tepi bebas, tidak memotong daun; strip 14,4–16,4 s (`qc/strip_kunci.png`): satpam utuh (badan, bahu di luar, siku menekuk), kunci berlabel di sarung tangan, telapak Uq di bawahnya, kunci ikut tangan Uq sesudah 15,3; caption mulai di bawah kunci |
| Adik melewati pintu belakang | daun didorong 17,40–17,90 (0,45→0,70 rad), berayun melambat; **adik masuk ambang 19,73, seluruh badan lewat 20,00**; daun 1,57–1,61 rad, lebar bebas > 0,8 m | strip 19,2–20,4 s: adik terlihat berjalan lewat ambang di antara daun (kiri) dan satpam (kanan); Uq sudah menyingkir |
| Gembok terbuka | anak kunci masuk 25,52–26,02; diputar 26,17–26,57; **lengkung lepas 26,62–26,77**; gembok diputar 90° 27,01–27,16, keluar dari kupingan 27,25; ke saku 27,52–28,12; tali pengait dibalik 28,72–29,42; pintu didorong 30,03 | strip 25,5–29,7 s: anak kunci masuk dari depan, diputar, badan gembok turun, diputar lalu lepas, tangan keluar bingkai, kembali membalik tali pengait |
| Jeda sebelum klik | N06 berakhir 42,673; S10c 42,77–43,33; **klik 43,473** (jeda 0,80 s) | ujung ucapan kuat terakhir 42,433 s (rms 10 ms > lantai + 10 dB; ekor "…lih" lebih pelan sampai ± 42,67), **onset klik 43,493 s** → jeda terukur 1,06 s dari ujung ucapan kuat / ± 0,82 s dari ekor kata |

### 5.2 QC

| Cek | Hasil | Berkas |
|---|---|---|
| ffprobe (MP4) | 540×960, 30/1, 1757 frame, 58,567 s, h264 + aac | `qc/e006_preview_qc.txt` |
| VO (MP4) | 10/10 segmen; margin 11,2–26,0 dB; N06 utuh | idem |
| Caption (plan) | 14 halaman di dalam ucapan ± 0,15 s; "KAMU AKAN MEMILIH…" | `qc/e006_captions.txt` |
| Penutup (MP4) | hit 3,303 s; putus frame 1667 = 3,400 s; TAMAT 3,900 s; static + denging sampai akhir (−36,3 dB) | `qc/e006_preview_qc.txt` |
| Gerak + interaksi (kode) | **LOLOS**: tanpa tembus; R1–R4 tanpa pelanggaran; R5 aksi tidak tertutup badan; IK sentuhan ≤ 7 mm; sendi Uq ≤ 11,1 °/frame; lengan dalam torso ≤ 0,09 cm | `qc/interaction_check_v5.txt` |
| Bukti cek menangkap v4 (kode) | cek yang sama pada staging v4: **GAGAL 13**, termasuk ketiga kasus pemilik | `qc/interaction_check_v4.txt` |
| Kedip 1 frame (MP4) | 1 (frame 1644 = tangan masuk bingkai S15, sama dengan v0f) | `qc/e006_preview_qc.txt` |

### 5.3 Kelemahan (urut)

1. **Kepala satpam terpotong** di S05 dan S06a (badan, lengan, sarung tangan terlihat; wajah di atas bingkai).
2. **S07a 4,6 s** dengan ± 0,8 s bingkai kosong saat tangan menyimpan gembok ke saku (27,5–28,3 s, di luar bingkai). Gembok masuk saku = USULAN (serah ke tangan kiri tidak mungkin tanpa lengan masuk perut pada rig ini).
3. **Episode 58,6 s** (v4 51,0 s): serah-terima, keluar pintu, dan gembok yang benar butuh waktu; blok tanpa narasi tetap ≤ 5,8 s (N03 maju 0,3 s).
4. **Uq condong 8–20° saat mendorong pintu** (jangkauan lengan C1 pendek); rak sakelar diturunkan ke 0,85 m (berbeda dari v4).
5. Tetap dari v4 §4.2: grid monitor 2,5 s, elipsis pintu ruang toa ditutup, S13 putaran warga, warna caption Uq.
6. **Batas cek:** sarung tangan satpam (± 7,5 × 6,8 cm), manset (r 0,047), dan label kunci (7,5 × 4 cm) lebih besar dari titik cek (bola r 0,04; kunci titik r 0,01); jarak terdekat tangan satpam–daun di kode 1,1 cm (13,70 s). Di MP4 tiap frame 13,4–14,7 s tidak terlihat memotong daun.
7. Tidak dinilai Claude: keluwesan pada kecepatan normal (gerak satpam, adik, tangan pada gembok), apakah jeda 0,8 s terasa sebagai keputusan, dengar SFX gembok (USULAN).

## 3. Paket VO (draf, untuk dibuat paralel)

Pengaturan sama dengan Ep 2–4 (D-023): model `Eleven v4`; stability 0,77; similarity 0,43; tanpa Enhance. Narator, pesan, dan toa: **Dhani** (`20ptB7Wn4Q2sMkAxK1qK`). Adik: **Zorin** (`19zQpXlAQKHlcmXgXfLr`). Satu take per segmen; tempel **hanya** teks di dalam backtick. Efek toa ditambahkan saat mixing, bukan di ElevenLabs. Acuan level dan efek toa: MP4 final Ep 4 (D-063).

### 3.1 Teks bersih

| Segmen | Suara | L# | Teks |
|---|---|---|---|
| N01 | Dhani | L1 | `Kamu meminta bukti.` |
| N02 | Dhani (pesan) | L2 | `“Ini kuncinya. Saya di luar pintu belakang.”` |
| N03 | Dhani | L3 | `Kamu menerima kuncinya.` |
| P01 | Dhani (toa) | L4 | `“Kalian lewat gang.”` |
| N04 | Dhani | L5 | `Pintunya masih terkunci. Tidak ada siapa pun di dalam.` |
| D01 | Zorin | L6 | `“Itu rumah kita…”` |
| N05 | Dhani | L7 | `Kamu melihat semuanya.` |
| N06 | Dhani | L8 | `Kamu akan memilih…` (dibuat utuh; dipotong di mix setelah "Kamu akan m", bukan di generasi) |
| **U01** | **Uq — Dhani (disetujui 2026-11-24, D-066)** | L9 | `“Ini Uq, rumah nomor tujuh.”` |
| **U02** | **Uq — Dhani (disetujui 2026-11-24, D-066)** | L10 | `“Kami bukan tontonan.”` |

### 3.2 Teks dengan audio tags (kata sama dengan 3.1)

- **N01** (Dhani): `[quiet, quick, tense] Kamu meminta bukti.`
- **N02** (Dhani): `[dry, close, reading a text message, flat] “Ini kuncinya. Saya di luar pintu belakang.”`
- **N03** (Dhani): `[quiet, steady] Kamu menerima kuncinya.`
- **P01** (Dhani): `[short breath] [flat, calm, formal announcement, slightly hoarse] “Kalian lewat gang.”`
- **N04** (Dhani): `[hushed, uneasy] Pintunya masih terkunci. [slow, low] Tidak ada siapa pun di dalam.`
- **D01** (Zorin): `[whispers, stunned] “Itu rumah kita…”`
- **N05** (Dhani): `[calm, smooth, neutral narration] Kamu melihat semuanya.`
- **N06** (Dhani): `[calm, clear, asking the listener directly] Kamu akan memilih…`
- **U01** (Dhani): `[inhales shakily] [quiet, trembling, unpolished, speaking into a microphone] “Ini Uq, rumah nomor tujuh.”`
- **U02** (Dhani): `[quiet, firm, voice slightly shaking] “Kami bukan tontonan.”`

Tag yang tidak dikenali bisa diabaikan atau ikut terucap; setiap take harus didengar ([[03-KNOWLEDGE/tools/elevenlabs-v4-audio-tags]]).

### 3.3 Catatan mix (bukan bagian generasi)

- **N05** satu take dipakai dua kali: kering (narator), lalu dengan efek toa ± 1 s kemudian (gema dari luar, lebih pelan). Ini yang memperlihatkan narator = toa.
- ~~**N06** dipotong tepat pada klik sakelar (beat 6), di tengah suku kata; sesudahnya hening (room tone tipis), bukan musik.~~ [DIGANTI 2026-11-24, D-068: N06 diputar utuh "Kamu akan memilih…", lalu ± 0,8 s jeda keputusan (Uq menoleh ke sakelar), baru klik; sesudah klik hening (room tone tipis).]
- **U01** di dalam ruang: kering, dekat mikrofon, sedikit ruang kecil. Pada potongan ke jalan, take yang sama lewat efek toa (jauh, gema jalan). **U02** kembali kering.
- **Beat 8–9**: hening yang disengaja (± 7,5 s tanpa kata) adalah pengecualian dari batas blok tanpa narasi 5,8 s (pelajaran Ep 4), sesuai arahan pemilik. Putus = gambar dan suara ke nol pada frame yang sama (tanpa fade).

### 3.4 KEPUTUSAN PEMILIK: suara Uq (U01, U02) — DIPUTUSKAN: Dhani (2026-11-24, D-066)

Sepanjang seri, narator dan toa adalah "suaramu", yaitu salinan suara Uq (Dhani). Kalimat L9 adalah pertama kalinya Uq yang asli bicara.
- **Usulan: Dhani yang sama, pembawaan berbeda** (napas, bergetar, dekat mikrofon, tanpa efek). Twist tetap utuh: suara yang dipakai mesin memang suara Uq; yang berbeda adalah manusianya. Risiko: penonton bisa mengira narator bicara lagi; dikurangi lewat napas, getaran, mulut Uq yang bergerak di layar, dan narator yang baru saja terputus.
- **Alternatif: suara lain** yang mirip tetapi lebih muda/kasar. Lebih mudah dibedakan, tetapi melemahkan "suaramu" (mesin meniru suara yang bukan miliknya).
- Pilihan ini menentukan siapa yang dibuat untuk U01–U02; segmen lain bisa dibuat sekarang.

### 3.5 Serah terima file

Setelah memilih take, unduh ke `_media/2026-11-006/audio/vo_raw/` dengan nama persis:
`2026-11-006_vo_N01_take01.mp3`, `…_N02_…`, `…_N03_…`, `…_P01_…`, `…_N04_…`, `…_D01_…`, `…_N05_…`, `…_N06_…`, dan sesudah keputusan §3.4: `…_U01_…`, `…_U02_…`.

## Beat bagian bersama (DISETUJUI pemilik sebagai beat, 2026-11-24, D-064)

> **Persetujuan beat saja.** Bukan persetujuan naskah final, storyboard, VO, atau video. Pembuka A/B (± 10-14 s; B lebih panjang) **terbuka** sampai voting Ep 4 dihitung ulang (snapshot ≥ 24 j, setelah 2026-11-25 00:22 WIB; sementara B 15 : A 0, umur 14,8 j). Bagian bersama dimulai saat Uq menerima kunci dari satpam (D-045 butir 3). Estimasi ± 44 s; dengan pembuka ± 54-58 s (HYPOTHESIS).
> Inti: ruang toa terkunci sejak Ep 1 dan kosong. Narator dan toa adalah mesin yang memakai suara Uq; pilihan "kamu" tercatat di layar yang sama.

| # | Yang terlihat | Yang penonton pahami | Suara / teks | ± s |
|---|---|---|---|---:|
| 1. Kunci | Insert pintu belakang: tangan berlengan seragam menaruh kunci berlabel "RUANG TOA" di telapak Uq, lalu menunjuk ke timur lewat gang. | Kunci asli; satpam di pihak Uq. | NARATOR: "Kamu menerima kuncinya." | 4 |
| 2. Gang | Uq dan adik menyusuri gang gelap. Di sela rumah, warga masih menghadap rumah 7 yang kosong. Satu LED menyala di dinding gang. | Seluruh kompleks diawasi. | TOA (jauh): "Kalian lewat gang." | 5 |
| 3. Pintu ruang toa | Gembok dibuka dengan kunci. Ruangan berdebu, kosong. | Toa tidak dijalankan dari dalam ruangan ini. | NARATOR: "Pintunya masih terkunci. Tidak ada siapa pun di dalam." | 4 |
| 4. Bukti tontonan | Dinding layar pemantau menampilkan grid kanal (lihat koreksi 1) dan daftar pilihan bercentang di sisi layar. Satu kotak memperlihatkan Uq dan adik dari depan: kamera kecil di meja ruang toa dengan LED merah menatap mereka (menanam lensa untuk beat 8). | Rumah dan kompleks dijadikan tontonan; pilihan "kamu" adalah pilihan penonton; Uq sedang ditonton saat itu juga. | ADIK (berbisik): "Itu rumah kita…" | 8 |
| 5. Narator = toa | Kotak teks mengetik sendiri; narator dan toa membaca kalimat yang sama. Label "SUARA: UQ". "Kamu akan…" mulai diketik, kolom "PILIHAN BERIKUTNYA" muncul. | Narator adalah mesin bersuara Uq; pertanyaan pilihan sedang disiapkan. | NARATOR + TOA: "Kamu melihat semuanya." lalu "Kamu akan…" | 7 |
| 6. Tindakan penentu | Uq memutar sakelar dari OTOMATIS ke MIKROFON. Ketikan berhenti, narator terpotong di tengah suku kata, kolom pilihan membeku. | Uq memutus suara tiruannya sebelum pertanyaan selesai. Tidak akan ada kartu. | klik, hening | 4 |
| 7. Suara sendiri | Uq menarik mikrofon dan menarik napas. **Kalimat 1:** Uq bicara. **Potong ke warga di jalan yang mendengar toa** (lihat koreksi 2). **Kembali ke wajah Uq** sebelum **kalimat 2.** | Uq bicara dengan suaranya sendiri untuk pertama kali, kepada warga; warga mendengar. | UQ (suara sedikit bergetar): "Ini Uq, rumah nomor tujuh." / "Kami bukan tontonan." | 6-7 |
| 8. Tatapan | Kamera meja setinggi mata, lurus ke depan. Uq menatap lurus ke lensa **± 2 s**: alis turun sedikit, kepala diam, ekspresi tajam, tenang, sedikit terluka. Hening, hanya room tone. | Uq sengaja membalas tatapan penonton (Ep 3: baru sadar diawasi). | hening | 2,5 |
| 9. Putus, TAMAT | Tangan Uq meraih kamera dan memenuhi bingkai. **Gambar dan suara putus bersamaan** ke hitam total ± 0,5 s, lalu teks "TAMAT". Tanpa kartu, tanpa dentuman. | Uq yang memilih kapan penonton berhenti melihatnya. | putus, hening | 3,5 | **[DIPERBARUI D-067, 2026-11-24: TAMAT tidak hening; 2,5 s terakhir glitch layar dan tulisan, static + denging tipis sampai frame terakhir; lihat §2.10.]**

### Koreksi pemilik (berlaku pada tabel di atas)

1. **Layar pemantau (beat 4).** Kanal ruang tamu menampilkan **gambar gelap** karena lensa masih tertutup selotip (Ep 4). **Kamar mandi tidak punya kanal kamera** (tidak ada kotak/kanal untuknya, tidak ada kotak hitam). Kanal lain (dapur, lorong, kamar Uq, jalan, rumah lain yang menonton) dan **kamera meja** tetap ada dan mendukung pengungkapan bahwa mereka sedang ditonton.
2. **Beat 7 dan 8.** Pada "Ini Uq, rumah nomor tujuh" tampil warga yang mendengar toa. Kembali ke wajah Uq **sebelum** "Kami bukan tontonan." Setelah itu Uq menatap lurus ke lensa kamera meja ± 2 s, lalu meraih kamera; gambar dan suara putus; TAMAT tanpa kartu pilihan.

### Terbuka (tidak diputuskan di sini)

- Pembuka A/B menunggu voting Ep 4 yang diperbarui.
- Reaksi warga di beat 7 selain "mendengar toa" (diam, menoleh, menunduk, berbalik) dan apakah mereka bubar ditetapkan di storyboard; draf lama memuat "berbalik pulang" di tengah kalimat, yang kini dipindah ke sela dua kalimat Uq dan belum diputuskan.
- Kamar mandi tanpa kanal: konsisten dengan Ep 4 (pintu tertutup, "ruangan tanpa kamera").
- Cek P1-P2 untuk set baru (gang, ruang toa, layar pemantau), tangan satpam, gerak mulut Uq (belum pernah bicara), alis C1, arah pupil ke kamera meja.

## Checklist produksi Ep 5 (pelajaran Ep 4)

Urutan mengikuti gerbang [[02-CHANNELS/lab/STUDIO-WORKFLOW]] (look-dev → pilot → episode). Centang di sini saat dijalankan, dan catat hasil dan tanggal.

| # | Kapan dijalankan | Pemeriksaan | Alat / acuan | Lolos bila |
|---|---|---|---|---|
| P1 | storyboard disetujui, **sebelum look-dev** | cek jangkauan dan posisi (tangan ke benda, pintu terhadap frame lama, kamera Ep 1–4 yang melihat set baru) | resep video-production §14, [[03-KNOWLEDGE/lessons/2026-11-24-cek-gerak-ep4-untuk-ep5]] | angka dan batasnya tercatat di §Hasil cek storyboard |
| P2 | **setiap shot baru, sebelum still dan pilot** | **cek gerak per frame**: tubuh, lengan, kaki terhadap perabot, kusen, dinding, daun pintu pada sudutnya di frame itu; kaki tidak menyilang; jarak antartokoh; kamera vs tubuh | `studio/tools/motion_check_lib.ts`, driver `e006_check.ts` (salinan `e005_check.ts`); set baru ditambah lewat `extraBoxes` | `HASIL: LOLOS`; kalau GAGAL, daftar `MASUK … @shot: t0–t1` diperbaiki per shot |
| P3 | sama, bersama P2 | batas sendi: Uq ≤ 11,1 dan adik ≤ 7,1 °/frame; lengan masuk torso Uq ≤ 0,2 cm (0,26 diterima pose ponsel), adik 0 | idem | idem |
| P4 | tiap shot baru | **still 1080×1920 tiap shot**, di sebelah acuan: bingkai, tokoh terpotong, caption menutup wajah, cahaya karakter (lingkaran putih), kamera menembus benda | Remotion still + HUD | tidak ada tokoh terpotong, aksi terbaca (§keterbacaan di pelajaran) |
| P5 | pilot pembuka | **cek putar normal pemilik** (keluwesan gerak) pada daftar timestamp | tabel "cek putar normal" di pelajaran Ep 4 | pemilik menilai, bukan Claude |
| P6 | VO dari pemilik sudah ada | acuan toa, bisikan, narator, bunyi pembuka, bed, master: **MP4 final Ep 4** (selain Ep 3); pilot memakai master tetap Ep 4 (bukan normalisasi −14), episode penuh dinormalkan | [[03-KNOWLEDGE/lessons/2026-11-23-audio-toa-caption-ep4-pilot-v2-v3]] (checklist A–G), `scripts/ep005_episode_audio.py` | rms dan crest dalam ± 1 dB dari acuan; cek dengar G oleh pemilik |
| P7 | VO sudah ada | caption: komponen `captions005.tsx`; pesan di ponsel **tidak** dicaption; jembatani celah halaman < 0,15 s; `split` sesuai jumlah burst | idem + `Episode005.tsx` (`PAGES005`) | frame vs acuan (§caption pelajaran) |
| P8 | pratinjau penuh | cek isi: VO lengkap per segmen (rms ucapan vs latar), blok tanpa narasi ≤ 5,8 s, kartu terbaca di 1080 (x simetris, wajah ≥ y 700), celah caption | skrip QC di §13 Ep 4 | semua angka tercatat |
| P9 | **tepat sebelum render pratinjau dan sebelum render final** | ulangi P2–P3 pada plan yang akan dirender (waktu VO berubah = jalur ikut berubah) | `e006_check` | `HASIL: LOLOS` |
| P11 | **setiap interaksi tangan–benda** (pintu, kunci, gembok, pengait, sakelar, benda berpindah tangan), sebelum still (tambahan 2026-11-24 dari tinjauan v4) | **sebelum disentuh** keadaan benda masuk akal; **saat disentuh** tangan di benda tiap frame benda bergerak, jalur tangan menurut dunia, ruas lengan bebas; **sesudahnya** perubahan terlihat (pintu berhenti/melambat, benda pindah tangan tanpa lompat); aksi tidak tertutup badan dari kamera shot | `e006_check.ts` aturan R1–R5 + `motion_check_lib` (daun pada sudutnya, bukaan, benda, ruas lengan, condong badan); [[03-KNOWLEDGE/lessons/2026-11-24-logika-interaksi-ep5-v5]] | `aturan interaksi R1–R4: tidak ada pelanggaran`, R5 tanpa GAGAL, `IK pelacak sentuhan ≤ 1 cm`; lalu strip tiap frame dari MP4 di momen itu |
| P10 | pratinjau, final | **daftar timestamp untuk cek putar normal pemilik** (jalan, putaran, sentuh benda, pintu, pose di cut, ponsel) dan keterbacaan aksi di ponsel | tabel pelajaran Ep 4; contoh: [[04-PRODUCTION/2026-11-005/content]] §13 | pemilik menyetujui sebelum render final |

**Di mana dijalankan pada Ep 5:** P1 saat storyboard v0.2 ditulis; P2–P4 per shot sebelum still look-dev dan pilot; P5 pada pilot pembuka; P6–P7 begitu VO pemilik masuk (pilot dengan VO, lalu episode); P8–P10 pada pratinjau penuh; P9 diulang sebelum render final. Hasil tiap run disimpan di `_media/2026-11-006/out/<tahap>/qc/` dan diringkas di Content Unit ini.

## Catatan kontinuitas dari Ep 4 untuk Ep 5 (belum diputuskan oleh pemilik)

- Jaket adik tetap di sofa; selotip tetap di lensa T; LED lorong dan dapur menyala; pintu kamar mandi tertutup di akhir Ep 4 ([[04-PRODUCTION/2026-11-005/content]] §6.3).
- Kamar mandi masih berukuran sementara (`BATH` di `studio/src/ep002/sets.tsx`). Ruang toa dan pintu belakang adalah set baru: tambahkan ke `extraBoxes` (P2).
- Uq membuka lewat IK tangan; jalur dekat bahu melompat 20–50 °/frame bila per-frame, pakai interpolasi sendi (pelajaran gorden, Ep 4 S05).
