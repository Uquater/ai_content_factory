---
type: content-unit
id: "2026-11-003"
title: "Dapur Juga Tidak Kosong"
status: published
channel: lab
channel-name: "Uq.cerita"
series: "Peringatan dengan Suaramu Sendiri"
episode: 2
branch: "A — tetap di dalam"
script-version: "v1.0 (disetujui pemilik 2026-11-17)"
script-approved: "2026-11-17 — naskah + arahan visual (label, kartu); bukan persetujuan video final"
storyboard-version: "v0.5 (D-039: S02 kusen timur, S05 berpaling ke depan rumah, S07 adik bergeser ke barat)"
category: fiksi-misteri-pov
experiment: ""
created: "2026-11-17"
updated: "2026-11-20"
approved-by-owner: true
platforms: [tiktok, reels, shorts]
duration-target-s: null
published-urls:
  - "https://www.youtube.com/shorts/N5rrQ6IRqQk"
  - "UNKNOWN (Instagram Reels)"
  - "UNKNOWN (TikTok)"
tags: [content-unit, 3d, episode-2, naskah-disetujui, storyboard-draft]
---

# 2026-11-003 — Episode 2: "Dapur Juga Tidak Kosong" (judul kerja)

> **Episode 2** seri "Peringatan dengan Suaramu Sendiri" (brand Uq.story, akun Uq.cerita). Melanjutkan langsung [[04-PRODUCTION/2026-11-002/content|Episode 1 (2026-11-002)]]: detik-detik setelah pilihan di akhir Episode 1.
> Keputusan: [[DECISION-LOG#D-035]] (seri), [[DECISION-LOG#D-036]] (cabang A, naskah), [[DECISION-LOG#D-034]] butir 2 dan 4.
> Kontinuitas wajib: [[04-PRODUCTION/2026-11-002/content|2026-11-002]] §12; geografi rumah §3 dan `studio/src/ep002/geo.ts`. Workflow: [[STUDIO-WORKFLOW]] (checklist §10). Aturan video: CLAUDE.md §16.
> **`approved-by-owner` = persetujuan video final** (skema [[ARCHITECTURE]] §5) dan tetap `false`. Persetujuan naskah dicatat di `script-approved`.
> Skill yang dipakai untuk storyboard: `video-production` (§2, §12, §13), `inkbeat-shorts` (`camera-and-editing`, `characters`), target gaya [[2026-11-16-style-target-badai-matahari]] §2–§4.
> Semua waktu di catatan ini **estimasi (HYPOTHESIS)** sampai audio nyata ada.

## Status

| Tanggal | Status baru | Oleh | Catatan |
|---|---|---|---|
| 2026-11-17 | idea | pemilik | **Cabang A — tetap di dalam** dipilih untuk Episode 2 ([[DECISION-LOG#D-036]]). |
| 2026-11-17 | idea | Claude | Content Unit dibuat. Naskah draft v0.1. |
| 2026-11-17 | idea | pemilik | Catatan revisi v0.1 (penalaran ancaman, motivasi senter, ruang, akhir, tempo, audio). |
| 2026-11-17 | idea | Claude | Naskah draft v0.2. |
| 2026-11-17 | idea | pemilik | Arahan v0.3: label "HARI 1 / EPISODE 2", kartu pilihan penutup. |
| 2026-11-17 | idea | Claude | Naskah draft v0.3. |
| 2026-11-17 | **scripted** | pemilik | **Naskah v0.3 disetujui dengan dua penyesuaian** → **v1.0**: (1) pilihan A = "INTIP PINTU DEPAN" + narasi penutup baru; (2) kartu muncul **saat** pertanyaan penutup dibacakan, bertahan ± 2–3 s sesudah narasi (timing final mengikuti audio). Juga disetujui: cabang tetap di dalam; pintu belakang belum terkunci lalu dikunci dengan gerendel; sapaan "Kak" dan "Pak satpam"; label HARI 1 / EPISODE 2 dua baris kiri atas dengan gaya dan timing Ep 1; kartu ditumpuk vertikal; durasi fleksibel mengikuti pembacaan alami. Ini persetujuan **naskah dan arahan visual**, bukan video final. Tahap berikutnya yang diizinkan: storyboard. |
| 2026-11-17 | scripted | Claude | Naskah **v1.0** disimpan (§2; v0.3/v0.2/v0.1 di §8). **Storyboard v0.1** (§3) dibuat: 12 shot, ± 66,6 s (estimasi), dengan rencana tangan, cahaya, geometri, aset, dan uji pilot. **Menunggu tinjauan pemilik.** Tidak ada audio, still, atau render. |
| 2026-11-17 | scripted | pemilik | Catatan storyboard v0.1: (1) tetapkan posisi ponsel dan pembagian tangan dari frame akhir Ep 1; (2) lengkapi kontinuitas genggaman (meraih kembali bila mundur bergandengan; pemegang ponsel konsisten); (3) periksa senter, gerendel, daun pintu, kaca lubang angin, jelaskan bagaimana cahaya mencapai kaca, dan perlakukan perubahan warna kaca sebagai hasil pencahayaan yang dibuktikan lewat preview; (4) toa sebagai suara di atas reaksi tokoh, celah di bawah pintu depan ditunda; (5) pertahankan pilot S03–S06 dengan daftar uji yang benar-benar tercakup, pemeriksaan lain terpisah. |
| 2026-11-17 | scripted | Claude | **Storyboard v0.2** (§3–§6). Temuan: kaca memakai `MeshBasicMaterial` (tidak bereaksi cahaya); dari 0,15 m cahaya senter tidak mencapai kaca (model: ± 0 %), jadi Uq berdiri ± 1,0 m dengan sorot miring lalu maju. Ponsel dari saku kiri, tangan kiri; genggaman diraih kembali di S11. Pilot S03–S06 dipertahankan (§5.1). **Menunggu tinjauan pemilik.** Tidak ada audio, still, atau render. |
| 2026-11-17 | scripted | pemilik | **Storyboard v0.2 disetujui** dengan revisi cahaya ([[DECISION-LOG#D-037]]): Uq mencari gerendel, sorot yang ditutup telapak menyapu dari kenop ke atas, melewati kaca, turun ke gerendel; kaca harus terlihat menghangat walau samar. Disetujui juga: ponsel di saku kiri/tangan kiri; stand-off ± 1,0 m + maju dua langkah; gerendel (x −0,95; y 1,10); material kaca menerima cahaya. Cadangan (b)/(c) belum disetujui. Tahap berikutnya: still look-dev dapur + uji cahaya (a–e), tanpa animasi/audio. |
| 2026-11-17 | scripted | Claude | **Storyboard v0.3** (§3.3 sapuan, S03–S05 baru; total tetap ± 63–70 s). **Still look-dev v1 a–e** dirender (§7). Skill: `video-production` (§9, §12, §13), `inkbeat-shorts`, `threejs-lighting`/`threejs-materials` (SpotLight dengan target, decay 2; Lambert untuk kaca). **Menunggu tinjauan pemilik.** |
| 2026-11-17 | scripted | pemilik | Catatan look-dev v1: adik menembus dinding lorong (still a); tangan/ponsel/gerendel tak terlihat dari kamera belakang (b–e). Minta v2: clipping + cek numerik jarak tubuh sebagai QC tetap, opsi kamera samping-depan, denah, penjelasan garis kusen dan langit-langit terang. Kaca cukup "terang"; still a boleh sedikit lebih gelap. |
| 2026-11-17 | scripted | Claude | **Look-dev v2** (§7.1). Clipping diperbaiki (adik −7,2 → +13,1 cm). Sumber garis kusen/langit-langit terang = rim `CastLight` (diganti lampu karakter lokal). Kamera samping: wajah dan kaca tidak bisa satu bingkai (angka di §7.1); S04 insert dan S03 berhasil. **Menunggu keputusan pemilik.** |
| 2026-11-18 | scripted | pemilik | Keputusan atas v2 ([[DECISION-LOG#D-038]]): **opsi 1** (sapuan + kaca dari belakang di S03, tangan/ponsel/gerendel lewat insert S04; K3 tidak dipakai; blocking stand-off tetap); S03 adik kecil di tepi bingkai; S06 dipindah ke x −1,15 **disetujui**. Minta reaksi wajah Uq yang jelas di S05 (usulan close-up dari arah pintu, dihitung dulu), urutan + durasi S03–S06 baru, still v3. |
| 2026-11-18 | scripted | Claude | **Storyboard v0.4** (§3.9: urutan S03–S06 + durasi, HYPOTHESIS) dan **look-dev v3** (§7.2). Close-up dari arah pintu **tidak layak** (0,49 m dari kepala, rasio perspektif 1,56); alternatif dari dapur barat-barat daya 2,24 m. Genggaman: jari C1 hanya bisa **mengait** tepi ponsel. **Menunggu tinjauan pemilik.** Tanpa pilot/audio/render video. |
| 2026-11-18 | scripted | pemilik | Keputusan atas look-dev v3 ([[DECISION-LOG#D-039]]): look-dev **disetujui** untuk pilot; S03 (i) lensa 40°; S05 Uq berpaling ke depan rumah, senter mati saat tersentak di awal toa, ekspresi terbaca; genggaman g2. Tugas: pilot S03–S06 dengan audio. |
| 2026-11-18 | scripted | Claude | Storyboard v0.5 (§10.1). Paket TTS (§9). Pilot dibangun dan dicek angka; pratinjau internal tanpa suara. **Pilot ber-audio terblokir:** VO belum ada (akun `free`, generasi manual oleh pemilik, D-023). Tidak ada file di `pilot_v1/`. |
| 2026-11-18 | scripted | pemilik | VO pilot diserahkan (N02, N03, P01, D02 take01; ditambah 9 segmen lain). Opsi A/B tidak diisi. Minta: pilot S03–S06 ber-audio, S06 menunjuk **ke kaca** dengan kaca terlihat di bingkai, S03 adik memegang kusen timur, durasi tidak dipangkas. |
| 2026-11-18 | scripted | Claude | **Pilot S03–S06 v1 dirender** (§10.3): `_media/2026-11-003/out/pilot_v1/`, 20,91 s, −14,1 LUFS. Kamera S06 diganti (menghadap utara dari ruang tamu) dan S03 dipan 4,2°: **usulan, menunggu pemilik**. Tidak ada episode penuh, commit, atau publikasi. |
| 2026-11-18 | scripted | Claude | **Pilot S03–S06 v2** (§11, [[DECISION-LOG#D-041]] pending): insert kaca S03, kilas balik + kaca gelap S06, material kaca `lit2` (usulan), SFX baru pemilik (variasi sementara lewat `scripts/ep003_pilot_sfx.json`), 21,465 s (+0,55 s), −14,2 LUFS, true peak −2,3 dBTP. Temuan: P4 gagal (kaki meluncur 7,7–12 cm, 8,30–8,48 s). **Menunggu tinjauan pemilik.** |
| 2026-11-18 | scripted | pemilik | Tinjauan v2: **D-040 disetujui** (kamera S06 ke utara, pan S03 4,2°, adik x −0,62 dengan pegangan setinggi pinggang); **`lit2` disetujui**; **kilas balik opsi A disetujui**; **+0,55 s sebelum toa ditolak**. Minta v3: kaki, wajah S05 sebelum "Dapur", insert lebih lebar, bed untuk ponsel, plosif. Pilihan SFX: baris masih templat. |
| 2026-11-18 | scripted | Claude | **Pilot S03–S06 v3** (§12, [[DECISION-LOG#D-042]] pending): 20,915 s, −14,2 LUFS, −2,3 dBTP. P4 lulus (penyebab: akar tubuh melompat 31 cm di 8,23 s di v1/v2). Wajah S05 terbaca ± 1,0 s sebelum "Dapur". Koreksi: angka limiter 14,6 dB di QC v2 salah ukur. **Menunggu tinjauan pemilik.** |
| 2026-11-18 | scripted | pemilik | **Pilot v3 disetujui** sebagai patokan kualitas ([[DECISION-LOG#D-042]]). Sentakan dan senter mati pada bunyi toa menyala disetujui (menggantikan D-039 butir 3). SFX tetap: malam #3, langkah #2, gerendel #3, ketukan #1, toa #4. Tugas: episode penuh S01–S12 bertahap. |
| 2026-11-18 | **rendered (draft render)** | Claude | **Episode penuh S01–S12, draft v1** (§13, [[DECISION-LOG#D-043]] pending): `_media/2026-11-003/out/episode_draft_v1/`, 67,17 s, −14,2 LUFS, −2,3 dBTP. S03–S06 = pilot v3 tanpa perubahan (dump stage selisih 0). Kelemahan terbesar: S10 diam 7,9 s; adik dipindahkan di luar layar (S10) agar genggaman S11 mungkin. **Menunggu tinjauan pemilik.** `approved-by-owner` tetap `false`. |
| 2026-11-18 | rendered (draft render) | pemilik | Tinjauan draft v1 ([[DECISION-LOG#D-043]]): adik pindah di luar layar (S10), ketukan sebelum narasi (dirapatkan), elips S01→S02, dan S12 menunduk **disetujui**. Perubahan baru: recap pilihan Ep 1 di awal, kartu akhir gaya Ep 1 ("intip pintu depan" / "tetap diam bersama adik") + dua dentuman bass. Ini mengubah spesifikasi kartu yang disetujui sebelumnya, atas permintaan pemilik. |
| 2026-11-18 | rendered (draft render) | Claude | **Draft v2** (§14, [[DECISION-LOG#D-043]]): recap pilihan Ep 1 (2,10 s), kartu akhir gaya Ep 1 + dua dentuman, ketukan dirapatkan, S10 5,77 s. 68,20 s, −14,1 LUFS, −1,8 dBTP. **Menunggu tinjauan pemilik.** |
| 2026-11-18 | rendered (draft render) | pemilik | Tinjauan draft v2 ([[DECISION-LOG#D-044]]): klik `1 Click Mouse` tetap (baris masih templat; dibaca "tetap"), ekor hitam dihapus, freeze recap dan "KAN?" diterima, dentuman bass dipindah ke sesudah L19. Minta render final v1 + persiapan publikasi. |
| 2026-11-18 | **rendered** | Claude | **Final v1** `_media/2026-11-003/out/episode_2026-11-003_final_v1.mp4` (69,43 s, 2 083 frame, −14,1 LUFS, −1,8 dBTP; QC `final_v1_qc/`). Persiapan publikasi §15. `approved-by-owner` tetap `false`. **Menunggu persetujuan pemilik.** |
| 2026-11-20 | **published** | pemilik (dicatat Claude) | Dirapikan atas perintah pemilik ([[DECISION-LOG#D-047]] butir 3): pemilik menyetujui video final sebelum tayang → `approved-by-owner: true`. YouTube Shorts `N5rrQ6IRqQk`, public, terbit 2026-11-18T14:33:40Z (21:33 WIB), judul "Suara di Toa Itu Tahu Kami di Dapur \| Episode 2 #shorts" (daftar unggahan API, read-only). Instagram/TikTok: UNKNOWN. Isi lain catatan ini tidak diubah. |

## 1. Ide (final, v1.0)

- **Premis:** Uq memilih tetap di dalam. Pintu belakang belum terkunci, jadi Uq ke dapur yang gelap untuk menguncinya. Adik memperingatkan soal lampu. Uq memakai senter ponsel yang ditutup tangan hanya untuk melihat gerendel. Begitu pintu terkunci, toa berbunyi: "Dapur juga tidak kosong." Adik melihat kaca lubang angin di atas pintu tadi ikut terang.
- **Payoff episode:** respons toa memperkuat **dugaan** bahwa bagian belakang rumah juga diawasi. Bukan aturan dunia yang terbukti.
- **Akhir:** pesan yang mengaku dari petugas meminta pintu depan dibuka; tiga ketukan datang dari pintu belakang yang baru dikunci. Tidak ada kesimpulan siapa pelakunya. Pertanyaan penutup + kartu pilihan.
- **Format:** 3D toon ber-tinta, 9:16, POV "kamu". Uq tidak berbicara; narator = suara "kamu" = suara toa.

## 2. Naskah — v1.0 (DISETUJUI pemilik 2026-11-17)

- **Versi:** v1.0 = v0.3 + dua penyesuaian pemilik (pilihan A dan timing kartu). Riwayat: §8.
- **Kata yang dibacakan:** **116** (L1–L18: 99; L19: 17). Label dan kartu tidak dibacakan.
- **Estimasi durasi:** ± 66,6 s (§3.4). Durasi fleksibel: mengikuti pembacaan alami dan kebutuhan adegan.

Baris `[VISUAL …]` = teks visual atau arahan layar, bukan dialog atau narasi.

```text
[VISUAL — LABEL PEMBUKA, kiri atas, gaya + timing label Ep 1 (± 0,25–4,9 s), bersamaan dengan L1–L2]
HARI 1
EPISODE 2

Pengeras suara itu masih memakai suaramu.

Kamu memilih tetap di dalam.

Tapi pintu belakang belum dikunci.

“Kak, jangan nyalain lampu…”

Dapur gelap. Kamu tidak bisa melihat gerendelnya.

Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan.

Klik. Pintu belakang terkunci.

“Dapur juga tidak kosong.”

“Kak… kaca di atas pintu tadi terang.”

Lubang angin itu menghadap gang.

“Dia lihat dari belakang juga?”

Kamu tidak bisa memastikannya.

Ponselmu bergetar. Pesan dari petugas keamanan.

“Saya sudah di depan rumah tujuh. Buka pintunya.”

“Itu Pak satpam, kan?”

Sebelum kamu sempat menjawab, terdengar tiga ketukan.

Dari pintu belakang.

Pintu yang baru saja kamu kunci.

[JEDA ± 1,2 s — ketukan dan arah sumbernya dipahami; tanpa narasi]

Kamu akan mengintip ke arah pintu depan untuk memastikan siapa di sana, atau tetap diam bersama adikmu?

[VISUAL — KARTU PILIHAN, mulai muncul SAAT L19 dibacakan; bertahan ± 2–3 s sesudah narasi selesai; lalu potong ke hitam]
APA YANG KAMU LAKUKAN?
A. INTIP PINTU DEPAN
B. TETAP DIAM BERSAMA ADIK
```

### 2.1 Pecahan per kalimat (v1.0)

| L# | Pembicara | Teks | Kata |
|---|---|---|---:|
| V1 | — (teks layar) | HARI 1 / EPISODE 2 | — |
| L1 | NARATOR | Pengeras suara itu masih memakai suaramu. | 6 |
| L2 | NARATOR | Kamu memilih tetap di dalam. | 5 |
| L3 | NARATOR | Tapi pintu belakang belum dikunci. | 5 |
| L4 | ADIK (berbisik) | “Kak, jangan nyalain lampu…” | 4 |
| L5 | NARATOR | Dapur gelap. Kamu tidak bisa melihat gerendelnya. | 7 |
| L6 | NARATOR | Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan. | 9 |
| L7 | NARATOR + SFX klik | Klik. Pintu belakang terkunci. | 4 |
| L8 | PENGUMUMAN (suara “kamu”, efek toa) | “Dapur juga tidak kosong.” | 4 |
| L9 | ADIK (berbisik) | “Kak… kaca di atas pintu tadi terang.” | 7 |
| L10 | NARATOR | Lubang angin itu menghadap gang. | 5 |
| L11 | ADIK | “Dia lihat dari belakang juga?” | 5 |
| L12 | NARATOR | Kamu tidak bisa memastikannya. | 4 |
| L13 | NARATOR | Ponselmu bergetar. Pesan dari petugas keamanan. | 6 |
| L14 | NARATOR membaca pesan (kering, dekat) | “Saya sudah di depan rumah tujuh. Buka pintunya.” | 8 |
| L15 | ADIK | “Itu Pak satpam, kan?” | 4 |
| L16 | NARATOR + SFX 3 ketukan | Sebelum kamu sempat menjawab, terdengar tiga ketukan. | 7 |
| L17 | NARATOR | Dari pintu belakang. | 3 |
| L18 | NARATOR | Pintu yang baru saja kamu kunci. | 6 |
| — | — | (jeda ± 1,2 s) | — |
| L19 | NARATOR | Kamu akan mengintip ke arah pintu depan untuk memastikan siapa di sana, atau tetap diam bersama adikmu? | 17 |
| V2 | — (kartu) | APA YANG KAMU LAKUKAN? / A. INTIP PINTU DEPAN / B. TETAP DIAM BERSAMA ADIK | — |

### 2.2 Arahan visual yang disetujui

- **Label pembuka:** "HARI 1" / "EPISODE 2", dua baris, pil `DayLabel` Ep 1 (navy, bulan sabit, Poppins 800, putih), kiri atas 8 % / 12 %, fade 0,25–0,75 s, tahan sampai 4,4 s, fade keluar sampai 4,9 s (± 4,65 s terlihat). Teks visual, bukan narasi. **[Waktu diubah 2026-11-18, D-043]:** label kini muncul sesudah kartu recap hilang (§14.1); in/tahan/out sama, digeser sepanjang recap.
- ~~**Kartu pilihan:** gaya `Cards` Ep 1 (krem, border 6 px, bayangan, Poppins 800, animasi masuk), **ditumpuk vertikal** dengan judul "APA YANG KAMU LAKUKAN?". Mulai muncul saat L19 dibacakan; bertahan ± 2–3 s sesudah narasi selesai.~~ **[DIGANTI 2026-11-18, D-043, atas permintaan pemilik]** spesifikasi kartu baru di §14.2. Teks narasi/dialog tidak berubah.
- **Pilihan A** = mengintip untuk memastikan siapa di depan. **Tidak ada adegan Uq membuka pintu** sebelum penonton memilih.

### 2.3 Kontinuitas (disetujui)

- Dari fakta Ep 1: posisi akhir Uq dan adik (ruang tamu gelap, bergandengan, adik memegang jaket), lampu mati, lubang angin berkaca buram di atas pintu belakang dengan cahaya dingin dari luar, gang tidak pernah diperlihatkan, pesan petugas pertama, warga belum mendekat, Uq tidak bicara.
- Usulan baru yang **disetujui** pemilik: pintu belakang belum terkunci di awal dan dikunci dengan gerendel; adik memanggil "Kak" dan menyebut "Pak satpam"; pesan kedua petugas (keaslian tidak dinyatakan); kalimat toa "Dapur juga tidak kosong."
- **Tidak ditambahkan:** aturan dunia tentang apa yang diketahui suara, asal suara, identitas "kami", alasan perilaku warga, siapa yang mengetuk.

## 3. Storyboard — v0.2 (DRAFT, menunggu tinjauan pemilik)

> v0.2 menjawab lima catatan pemilik atas v0.1: (1) ponsel dan pembagian tangan dari bukti frame; (2) kontinuitas genggaman; (3) cahaya ke kaca; (4) toa sebagai suara di atas reaksi, celah di bawah pintu depan ditunda; (5) cakupan pilot. Ringkasan perubahan: §3.8.

### 3.0 Bukti Episode 1: ponsel dan tangan (butir 1)

Frame diambil dari `_media/2026-11-002/out/episode_2026-11-002_final_v1.mp4` dengan `ffmpeg` ke folder sementara (tidak ada file baru di repo atau media). Kode: `studio/src/ep002/AnimaticV3.tsx`, `studio/src/c1/bodyIk.ts`, `studio/src/cast/npc.tsx`.

| Sumber | Yang terlihat | Kesimpulan |
|---|---|---|
| Frame 40,3 s (A07c, **shot terakhir dengan ponsel**) | C1 memegang ponsel di depan dada | Ponsel di tangan C1. Kode A07c: `reach(root, E, "L", phone)`; sisi `"L"` = **tangan kanan anatomis** C1 (komentar `bodyIk.ts` baris 17) |
| Frame 41,6 dan 43,0 s (A08–A09) | C1 menarik adik menjauh dari pintu | Tidak ada ponsel di tangan mana pun (A08 memakai lengan `"R"` = kiri anatomis untuk menarik adik) |
| Frame 47,0–68,0 s (A09–A13) | Percakapan, lampu dimatikan | Ponsel tidak terlihat |
| Frame 81,5 s (A15) dan 98,5 s (A17, kartu) | Tangan **kanan** C1 menggenggam tangan **kiri** adik (pasangan `Pair`: C1 `"L"`, adik `"R"`). **Tangan kiri C1 menggantung kosong.** Jaket menggantung di lengan bawah **kanan** adik | Di akhir Ep 1 tidak ada ponsel di tangan |
| Kode | Komponen `Phone` hanya dipakai di A07a dan A07c | Setelah A07 ponsel tidak ditampilkan di adegan mana pun |

**Penetapan awal Episode 2 (usulan; butuh persetujuan):**
- **Fakta Ep 1:** ponsel terakhir terlihat di tangan kanan (A07c, 40,3 s). Sesudah A08 tidak ditampilkan. Di akhir Ep 1 tangan kanan memegang adik dan tangan kiri kosong.
- **Asumsi Ep 2 (bukan fakta Ep 1):** ponsel ada di **saku celana kiri** Uq dan dipegang dengan **tangan kiri** (satu-satunya tangan yang bebas di akhir Ep 1). Tangan kanan tetap dipakai untuk adik, lalu untuk menutup senter dan menggeser gerendel.
- **Pembagian tangan awal (S01):** Uq: kanan ↔ tangan kiri adik; kiri kosong. Adik: lengan kanan membawa jaket (aksesori `jacket-arm`, arm `"L"` = kanan adik); tangan kirinya digenggam Uq, bebas sesudah dilepas.
- **Mengambil ponsel dari saku:** di akhir S01, saat Uq menoleh ke lorong, tangan kiri turun lewat sisi luar paha ke saku (target di samping pinggul, ± 0,20 m ke luar, ± 0,70 m tinggi) dan kembali memegang ponsel di samping pinggul. Gerak rendah di sisi luar badan, sesuai pelajaran lengan 2026-11-17. Saku tidak digambar; gerak melewati sisi paha. **Cadangan bila terbaca janggal:** pengambilan terjadi di antara S01 dan S02 (ponsel sudah di tangan kiri pada awal S02).

### 3.1 Ringkasan urutan

1. **Ruang tamu (S01):** pose akhir Ep 1, label "HARI 1 / EPISODE 2". Uq melepas genggaman, mengambil ponsel dengan tangan kiri, menoleh ke lorong.
2. **Lorong dan dapur (S02–S05):** Uq berjalan, berhenti ± 1,0 m dari pintu belakang. Senter ditutup tangan dengan sorot miring ke atas, cahaya merambat naik di pintu sampai kaca lubang angin. Uq maju dua langkah, menggeser gerendel dengan tangan kanan, klik. Toa berbicara di atas reaksi tokoh.
3. **Dugaan (S06–S07):** adik menunjuk kaca dengan tangan kiri; Uq mendongak, berbalik, kembali ke adik.
4. **Pesan dan ketukan (S08–S11):** ponsel bergetar, pesan "petugas", adik bertanya, tiga ketukan di pintu belakang. Adik **meraih kembali tangan kanan Uq**; keduanya mundur setengah langkah bergandengan.
5. **Pertanyaan (S12):** ruang tamu; pan ke pintu depan lalu kembali ke keduanya; kartu masuk saat narasi.

### 3.2 Geometri set (diperiksa terhadap `geo.ts` dan `sets.tsx`)

Koordinat meter; +x timur, −z utara (belakang).

| Elemen | Posisi |
|---|---|
| Ruang tamu | x −4,0..1,0, z −1,0..3,0. Pintu depan di dinding selatan (z 3,0, x −2,6) |
| Mulut lorong | z −1,0, bukaan x −1,4..−0,2 |
| Lorong | x −1,4..−0,2, z −1,0..−3,2 |
| Dapur | x −4,0..1,0, z −3,2..−5,0 |
| Pintu belakang | dinding utara z −5,0, pusat x −0,8, lebar 0,9, tinggi 2,05; **engsel di timur, kenop di barat** (kode `Door`: kenop pada x = pusat − 0,35 = −1,15, y 1,0) |
| Kaca lubang angin | 0,5 × 0,3 m, pusat (−0,8; 2,32; −5,0), di atas kusen atas pintu |
| **Gerendel (usulan baru)** | Muka dalam daun pintu (z ≈ −4,93), **x −0,95**, **y 1,10**. Berada ± 0,15 m di barat pusat pintu, tepat di depan Uq yang berdiri menghadap utara, sehingga terjangkau tangan kanan maupun kiri tanpa menyilang |
| Jangkauan lengan C1 | Perkiraan: lengan atas + bawah ≈ 0,50 m (`armLength` 1,4 × 0,237 × tinggi 1,5), bahu ± 1,04 m. Gerendel di 1,10 m terjangkau dengan lengan hampir lurus bila Uq berdiri ± 0,45 m dari pintu. Angka pasti dicek di uji IK |

**Garis pandang adik ke kaca:** adik di mulut lorong (± x −1,2..−0,8, z −1,15, mata ± 1,15 m). Garis ke kaca melewati posisi Uq (z −4,0) pada tinggi ± 2,03 m dan z −4,5 pada ± 2,18 m, di atas kepala Uq (1,5 m). Tidak ada dinding melintang. **Adik bisa melihat kaca.** Uq menghadap pintu dan menunduk ke gerendel, jadi ia tidak memperhatikan kaca.

**Kelayakan shot akhir:** pintu depan dan belakang tidak bisa satu bingkai vertikal (8 m, dinding berhadapan). Sumber ketukan dibaca lewat S10 (POV ke pintu belakang) dan S11 (reverse kedua tokoh). S12 memakai pola pan A17 Ep 1.

### 3.3 Cahaya: bagaimana senter benar-benar mencapai kaca (butir 3)

**Temuan 1: kaca sekarang tidak bisa bereaksi terhadap cahaya.** Kaca lubang angin memakai `coreMat(...)` = `MeshBasicMaterial` (tidak terpengaruh lampu, `kit.tsx` baris 59–65). Warna hangat harus datang dari cahaya yang jatuh di kaca, jadi kaca harus diganti material yang menerima cahaya (tetap toon, dengan emisif dingin sebagai dasar). Ini penyesuaian set, tercatat di §4.

**Temuan 2: dari dekat, senter tidak bisa menerangi kaca.** Model sederhana (HYPOTHESIS): sumber titik di ponsel (y 1,15, x −0,95), intensitas LED lebar ∝ cos²(sudut dari sumbu sorot), iluminasi ∝ intensitas · cos(sudut datang) ÷ jarak². Pintu di z −4,94; gerendel (−0,95; 1,10); kaca (−0,8; 2,32). Rasio iluminasi kaca ÷ gerendel:

| Jarak ponsel ke pintu | Sorot lurus ke gerendel | Sumbu sorot miring ± 15° ke atas | Sumbu miring ± 25° ke atas |
|---:|---:|---:|---:|
| 0,15 m (dekat gerendel, v0.1) | 0,00 % | 0,05 % | 0,13 % |
| 0,50 m | 0,9 % | 2,6 % | 4,5 % |
| 0,80 m | 5,6 % | 11,3 % | **16,9 %** |
| 1,00 m | 11,4 % | 20,2 % | **28,5 %** |
| 1,20 m | 18,5 % | 30,1 % | 40,8 % |

- Dari 0,15 m, sudut ke kaca 82–83° dari sumbu sorot: cahaya praktis tidak sampai. Rancangan v0.1 (cahaya ditutup telapak di dekat gerendel) **tidak masuk akal secara fisik**.
- Dari ± 1,0 m dengan sorot miring ± 25° ke atas, gerendel dan kaca sama-sama berjarak ± 25–28° dari sumbu sorot. Kaca mendapat ± 28 % iluminasi gerendel di model ini. Kaca buram bersifat tembus, jadi sejumlah itu diperkirakan terbaca sebagai pendar hangat di malam gelap. **Ini hipotesis, bukan bukti.**
- Model tidak memasukkan pantulan lantai/dinding dan penutupan telapak.

**Blocking dan motivasi cahaya (revisi pemilik 2026-11-17, D-037): Uq MENCARI gerendel.**
Uq tidak sengaja mengarahkan senter ke atas. Ia tidak tahu letak gerendel di pintu yang gelap. Senter yang ditutup telapak kanan **menyapu daun pintu dari area kenop ke atas**, sempat melewati kaca lubang angin, lalu turun dan berhenti di gerendel.

1. **S03:** Uq berhenti di stand-off (root z −3,8; ponsel ± 0,9 m dari pintu), ragu-ragu di gelap.
2. **Sapuan (dalam L6), dari ponsel di (−1,02; 1,15; −4,02):**

   | Titik | Elevasi sorot | Jarak |
   |---|---:|---:|
   | Kenop (−1,15; 1,0) | −9° | 0,92 m |
   | Kaca lubang angin (−0,8; 2,32) | +53° | 1,47 m |
   | Gerendel (−0,95; 1,10) | −3° | 0,90 m |

   - Naik 62° (kenop → kaca), turun 56° (kaca → gerendel): total ± 118°.
   - Kecepatan "mencari" ± 60–75°/s (asumsi, disetel di uji): naik ± 0,9 s, berhenti sebentar di atas ± 0,4 s, turun ± 0,8 s. Ditambah diam di kenop ± 0,5 s dan di gerendel ± 0,6 s: **sapuan ± 3,0–3,5 s**.
   - **Kaca berada di dalam sorot ± 1,0–1,3 s** (sorot setengah-sudut ± 28°, mulai masuk saat elevasi ± +28°).
   - Saat sorot tepat di kaca, iluminasi kaca ≈ **22 %** dari iluminasi gerendel saat sorot tepat di gerendel (model sumber titik; kaca lebih jauh dan sudut datangnya miring). Telapak mengurangi keduanya dengan faktor yang sama. **Hipotesis: terbaca sebagai pendar hangat samar di dapur gelap. Dibuktikan di still c.**
3. **Sesudah sapuan:** Uq maju dua langkah (± 0,5 m), telapak kanan lepas, mendorong gerendel → **klik** (L7). Dari dekat, kaca tidak lagi kena sorot (± 0 %, tabel di atas), jadi kaca sudah dingin lagi saat klik.
4. **Senter mati** saat toa berbicara (L8).
5. **Urutan sebab-akibat:** sorot melewati kaca (pertengahan L6) → klik (L7) → toa: "Dapur juga tidak kosong." (L8, ± 3–4 s sesudah kaca menyala) → adik: "kaca di atas pintu *tadi* terang" (L9, kala lampau cocok: kaca sudah dingin).
6. **Durasi:** sapuan ± 3,0–3,5 s muat di dalam L6 (estimasi 4,9 s). **Estimasi total tetap ± 63–70 s.**

**Kenapa sapuan ini bisa terbaca (dan batasnya):** kaca adalah benda paling terang di bingkai dapur yang gelap (S03, dengan emisif dingin dari luar), sehingga perubahan warnanya mudah diikuti mata. Batasnya: kaca hanya terang ± 1 s, dan ukurannya ± 7 % tinggi bingkai di S03 (lensa 40°, 5,8 m). Bila still c tidak memperlihatkan perubahan yang jelas, saya tidak akan menggantinya diam-diam: hasilnya dilaporkan dengan angka, lalu pemilik memilih.

**Bukti lewat preview (belum ada; tidak diklaim sebelum diuji):**
- Still look-dev b/c/d (senter di kenop, di kaca, di gerendel) dengan material kaca yang menerima cahaya.
- **Kriteria (usulan, HYPOTHESIS; disetel bersama pemilik):**
  1. Kaca bergeser dari dingin ke hangat saat sorot di kaca (rasio R/B kaca naik), dan dingin saat sorot di kenop/gerendel.
  2. Gerendel dan kolam cahaya di pintu terbaca; lorong dan ruang tamu tidak ikut terang.
  3. Perubahan terbaca pada kecepatan normal, dari sudut kamera S03 dan dari posisi adik.
  4. Tanpa kedip antarframe.

**Cadangan bila sapuan tidak terbaca — BELUM DISETUJUI, tidak dipakai tanpa persetujuan pemilik:**

| Cadangan | Isi | Dampak pada cerita | Dampak pada gaya / produksi |
|---|---|---|---|
| **(b)** Sumber "bocor" khusus kaca | Satu lampu sempit tambahan yang hanya mengenai kaca selama sapuan (atau penguatan emisif kaca), tidak berasal dari fisika senter | Tidak ada perubahan naskah atau aksi. Petunjuk adik tetap sama | Melanggar aturan target gaya §4.1 "cahaya hanya dari sumber yang terlihat": kaca bisa tampak lebih terang dari pintu di sekitarnya tanpa sebab. Murah dan pasti terbaca |
| **(c)** Ubah kaca lubang angin | Kaca diperbesar dan/atau diturunkan (mis. lebih lebar atau lebih dekat kusen) agar masuk sorot lebih lama | Tidak ada perubahan naskah ("kaca di atas pintu" tetap benar) | **Kontinuitas dengan Ep 1** (kaca terlihat di A16): penonton yang teliti bisa melihat perbedaan. Perlu ubah set dan cek ulang shot Ep 1 yang memakai pintu belakang |

### 3.4 Kontinuitas genggaman dan pegangan (butir 2)

| Shot | Tangan kanan Uq (`"L"`) | Tangan kiri Uq (`"R"`) | Adik |
|---|---|---|---|
| S01 | Menggenggam tangan kiri adik sampai ± 5,0 s, lalu melepas (jari membuka, tangan adik meluncur turun) | Kosong; sesudah melepas turun ke saku kiri dan kembali memegang ponsel (± 5,0–6,4 s) | Tangan kiri digenggam lalu dilepas; lengan kanan membawa jaket |
| S02–S03 | Bebas; di S03 (L6) **menutup senter** | **Ponsel**; di S03 (L6) senter menyala dan **menyapu** pintu | Tangan kiri bebas; di S02 memegang kusen. Jaket tetap di lengan kanan |
| S04 | Lepas dari ponsel → **dorong gerendel** → klik | **Ponsel** menyorot gerendel | — |
| S05 (v0.4, usulan D-038) | Sesudah klik **kembali menutup lampu senter** di punggung ponsel; cahaya bocor dari sela jari menerangi wajah. Sesudah senter mati: turun ke samping badan | Ponsel di depan dada; **ibu jari kiri mematikan senter** di akhir L8 (wajah menjadi gelap) | Di luar bingkai (reaksinya di S06) |
| S06–S07 | Bebas | Ponsel (di samping badan) | Tangan kiri **menunjuk** (S06), lalu turun. Jaket tetap di lengan kanan |
| S08 | Bebas | Ponsel diangkat, layar menyala | Di sisi **kanan anatomis** Uq |
| S09 | Bebas | Ponsel (layar menyala) | Di sisi kanan Uq; tidak menggenggam |
| S10 | — (POV) | — | — |
| S11 | **Diraih kembali:** pada ± 0,7 s pertama tangan kiri adik terulur ke tangan kanan Uq yang menggantung (± 0,76 m, titik temu `MEET()` Ep 1), jari mengait. Uq mundur setengah langkah sesudah genggaman terjadi | Ponsel (layar mati) di samping pinggul | Di kanan-belakang Uq |
| S12 | **Menggenggam** adik (pose A17) | **Ponsel** menggantung rendah di samping badan | Menggenggam tangan kanan Uq dengan tangan kiri |

- **Pemegang ponsel konsisten:** tangan kiri Uq dari S01 (akhir) sampai S12. Tangan kanan hanya bergantian antara adik, menutup senter, dan menggeser gerendel.
- **Pasangan genggam sama dengan Ep 1:** kanan Uq ↔ kiri adik. Di S12 tangan kiri Uq kini memegang ponsel (di Ep 1 A17 kosong): perbedaan kecil yang tercatat.
- **Posisi adik:** adik di sisi kanan anatomis Uq pada S07–S12 agar kedua tangan itu bertemu.

### 3.5 Storyboard per shot

> **[DIUBAH 2026-11-18, D-038]** S03–S06 di bawah adalah v0.3. Urutan dan isi yang berlaku: §3.9 (v0.4). Shot lain tidak berubah.

Konvensi: waktu = estimasi (tempo Ep 1, 1,86 kata/s). fov = sudut vertikal. Jarak kamera ke tokoh terdekat ≥ 2,2 m kecuali insert. Subtitle di pita 70 % tinggi; wajah dan tangan penting di luar pita itu. Kamera sumbu lorong (utara/selatan) berada di garis antara Uq dan adik (tidak memotong garis 180°).

#### S01 — 0,0–6,4 s · Ruang tamu, pembuka

| Aspek | Rencana |
|---|---|
| Narasi | L1, L2 |
| Kamera | Two-shot dari tenggara ruang tamu (posisi A17 `P` = (0,75; 1,5; 2,55)) menghadap barat laut, dorong pelan, fov 54 → 48 |
| Uq | Berdiri di `C1_ROOM`, bergandengan (tangan kanan). Di L2 menoleh ke kanan layar (mulut lorong). Sekitar 5,0 s: melepas genggaman; tangan kiri mengambil ponsel dari saku kiri; mulai melangkah ke lorong |
| Adik | Di `ADIK_ROOM`; tangan kiri digenggam lalu dilepas; lengan kanan membawa jaket; menatap Uq |
| Ekspresi / pandangan | Uq: cemas lalu waspada ke lorong. Adik: cemas, ke Uq |
| Properti | Jaket; ponsel (muncul dari saku, §3.0) |
| Cahaya | Malam gelap; bulan dari jendela bergorden; lampu mati |
| SFX / teks | Dengung toa samar, jangkrik. **Label "HARI 1 / EPISODE 2" 0,25–4,9 s** (y ± 230–340 px). Subtitle L1–L2 |
| Penempatan | Wajah ± 0,5 tinggi bingkai |
| Sambungan | Uq melangkah ke kanan layar → S02 |
| Aset | Ada: `Pair`, kamera A17, `HouseInterior light="local"`. Baru: `DayLabel` dua baris; gerak ambil ponsel (diuji terpisah, §5.2) |

#### S02 — 6,4–11,3 s · Lorong, Uq menuju dapur

| Aspek | Rencana |
|---|---|
| Narasi | L3, L4 |
| Kamera | Medium dari dapur menghadap selatan menyusuri lorong, lensa (−0,5; 1,35; −3,7), fov 50; Uq mendekat dari 3,5 m ke 2,3 m |
| Uq | Berjalan lurus ke arah kamera; ponsel di tangan kiri (layar mati) di samping pinggul; tangan kanan mengayun. Di L4 menoleh sebentar ke belakang |
| Adik | Mengikuti dua langkah lalu berhenti di mulut lorong (± z −1,15); tangan **kiri** memegang kusen; berbisik L4. Jaket di lengan kanan |
| Ekspresi / pandangan | Uq: tegang, ke depan. Adik: takut, ke punggung Uq |
| Properti | Ponsel, jaket |
| Cahaya | Ruang tamu di belakang mereka sedikit lebih terang (siluet) + fill dingin lemah |
| SFX / teks | Langkah pelan di keramik; subtitle L3–L4 |
| Sambungan | Uq melewati kamera di kanan bawah → S03 |
| Aset | Ada: jalan lurus (`walk.ts`), preset adik. Perlu: dressing lorong 3–5 properti |

#### S03 — 11,3–18,6 s · Stand-off, mencari gerendel (sapuan)

| Aspek | Rencana |
|---|---|
| Narasi | L5, L6 (sebagian) |
| Kamera | Dari ruang tamu di belakang adik menghadap **utara** menyusuri lorong (still b/c/d: (−0,55; 1,35; 0,95) → pintu belakang), fov 40; adik di kiri bawah; dorong pelan ± 12 % |
| Uq | Berjalan sampai stand-off (root z −3,8), berhenti. Di L6: senter menyala, ditutup telapak kanan; **sorot menyapu daun pintu dari kenop ke atas, melewati kaca, turun ke gerendel** (± 3,0–3,5 s). Lalu maju dua langkah (± 0,5 m) |
| Adik | Di mulut lorong, punggung ke kamera; kepalanya terangkat mengikuti cahaya saat kaca menyala |
| Properti | Pintu, kenop, gerendel, kaca |
| Cahaya | Awal: kaca biru dingin = titik paling terang. Sapuan: kolam cahaya hangat bergerak naik di pintu; **kaca menghangat samar ± 1 s**; lalu kolam turun ke gerendel |
| SFX / teks | Dengung toa, keran menetes; klik kecil senter; subtitle L5–L6 |
| Sambungan | Tangan kanan Uq bergerak ke gerendel → S04 |
| Aset | Baru: gerendel panjang, kaca menerima cahaya (`vent="lit"`), senter (`SpotLight`) |

#### S04 — 18,6–20,6 s · INSERT gerendel

| Aspek | Rencana |
|---|---|
| Narasi | L6 (akhir), L7 "Klik" |
| Kamera | Insert dari samping (± (0,2; 1,2; −4,3)) menghadap barat laut ke gerendel; fov 40; gerendel + tangan mengisi 45–60 % tinggi; diam ≥ 2 s |
| Uq | Tangan kiri: ponsel menyorot gerendel (masih sebagian ditutup). Tangan kanan: lepas dari ponsel, mendorong gerendel → **klik** |
| Properti | Gerendel (gagang di x −0,95, batang ke penahan di kusen barat), ponsel |
| Cahaya | Kolam cahaya di gerendel |
| SFX / teks | **Klik gerendel**; subtitle L7 (tangan di atas pita subtitle) |
| Sambungan | Klik → S05 |
| Aset | Pose dorong gerendel (IK, rute rendah) |

#### S05 — 20,6–24,2 s · Toa di atas reaksi

| Aspek | Rencana |
|---|---|
| Narasi | L7 (akhir), L8 |
| Kamera | Sumbu S03 (utara, dari belakang adik), fov 42 |
| Uq | Membeku di depan pintu; ibu jari kiri mematikan senter; kepala sedikit terangkat |
| Adik | Bahu menegang, kepala condong ke atas pintu |
| Cahaya | Kaca kembali dingin (sudah dingin sejak Uq maju; senter mati) |
| SFX / teks | **Toa sebagai suara di atas reaksi tokoh** (L8, tanpa insert corong); subtitle L8 |
| Sambungan | Adik mengangkat tangan kiri → S06 |
| Aset | Ada |

#### S06 — 24,2–27,9 s · Adik menunjuk

| Aspek | Rencana |
|---|---|
| Narasi | L9 |
| Kamera | Medium-close adik, dari dapur menghadap selatan, lensa ± 2,4 m dari adik, fov 40; wajah ± 0,45 tinggi bingkai |
| Uq | Di luar bingkai |
| Adik | Di mulut lorong; **tangan kiri menunjuk ke atas pintu** (ke arah lensa, sedikit di atasnya); lengan kanan membawa jaket di depan perut; berbisik L9 |
| Ekspresi / pandangan | Mata bulat, ke atas pintu |
| Cahaya | Rim bulan dari ruang tamu; fill dingin lemah di wajah |
| SFX / teks | Bisikan; subtitle L9 |
| Sambungan | Pandangan adik ke atas → S07 |
| Aset | Baru: pose menunjuk (IK satu bidang, layak) |

#### S07 — 27,9–35,4 s · Kaca, dugaan, Uq kembali

| Aspek | Rencana |
|---|---|
| Narasi | L10, L11, L12 |
| Kamera | Sumbu S03 (utara): tilt ke kaca (kini dingin) di L10, lalu turun ke Uq; mundur pelan saat Uq mendekat (≥ 2,2 m); fov 46 |
| Uq | L10: mendongak ke kaca. L11: berbalik 180°. L12: berjalan kembali ke adik (± 3,3 m), berhenti dengan adik di sisi **kanannya**. Ponsel di tangan kiri |
| Adik | Di mulut lorong (sisi barat), L11 dengan kepala condong ke Uq |
| Cahaya | Kaca dingin; fill lemah dari mulut lorong agar wajah terbaca |
| SFX / teks | Langkah; subtitle L10–L12 |
| Sambungan | Ponsel bergetar di tangan kiri → S08 |
| Aset | Perlu uji: putar 180° di tempat lalu berjalan (belum teruji) |

#### S08 — 35,4–40,5 s · INSERT ponsel, pesan

| Aspek | Rencana |
|---|---|
| Narasi | L13, L14 (awal) |
| Kamera | Insert ponsel di tangan **kiri** Uq dari sisi kanan-atas; layar 45–60 % tinggi; potongan ke UI pesan (pola A07 Ep 1) |
| Uq | Mengangkat ponsel ke depan dada; layar menyala |
| Adik | Ujung kepalanya di tepi bingkai (membaca dari samping, sisi kanan Uq) |
| Cahaya | Cahaya layar |
| SFX / teks | Getar ponsel; `PhoneUI`: satu pesan "Saya sudah di depan rumah tujuh. Buka pintunya."; tidak ada subtitle ganda (pola `who: "msg"` Ep 1) |
| Sambungan | Potong ke wajah keduanya diterangi layar |
| Aset | Ada: `PhoneUI`, `Phone`. Baru: pesan ke-2 |

#### S09 — 40,5–45,1 s · Wajah diterangi layar

| Aspek | Rencana |
|---|---|
| Narasi | L14 (akhir), L15 |
| Kamera | Two-shot dari ruang tamu menghadap barat laut ke mulut lorong, lensa ± 2,4 m, fov 36 (lensa panjang, pola A07c) |
| Uq | Menatap layar, lalu menoleh ke kiri layar (arah depan). Tangan kanan bebas di samping badan |
| Adik | Di sisi kanan Uq; menengadah; L15 dengan harap-cemas; tangan kirinya masih bebas |
| Ekspresi / pandangan | Adik: alis naik. Uq: tegang, tidak menjawab |
| Cahaya | Wajah dari bawah oleh layar; sisanya gelap |
| SFX / teks | Subtitle L15 |
| Sambungan | Ketukan pertama di awal S10; keduanya tersentak |
| Aset | Ada |

#### S10 — 45,1–50,5 s · POV lorong, tiga ketukan

| Aspek | Rencana |
|---|---|
| Narasi | L16, L17 |
| Kamera | POV lorong ke pintu belakang (pola A16b: (−0,8; 1,48; −1,55)), fov 38, dorong pelan ke pintu pada ketukan ke-3 tanpa mendekat < 2,5 m |
| Uq / Adik | Di luar bingkai |
| Petunjuk sumber | **Gambar:** tiap ketukan menggetarkan daun pintu (≤ 3 mm, 2 frame) dan gerendel sedikit bergeser. **Suara:** tiga ketukan kayu dengan gema, lebih jauh dan teredam dibanding narasi; dengung toa merendah sesaat sebelum ketukan pertama |
| SFX / teks | Ketukan selaras "terdengar … tiga ketukan"; subtitle L16–L17 |
| Sambungan | Potong ke reverse S11 |
| Aset | Baru: getar pintu (fungsi t), SFX ketukan |

#### S11 — 50,5–54,9 s · Reverse; adik meraih tangan; mundur

| Aspek | Rencana |
|---|---|
| Narasi | L18, lalu jeda ± 1,2 s |
| Kamera | Two-shot dari dapur menghadap selatan, lensa ± 2,6 m, fov 44 |
| Uq | Menatap pintu belakang (ke lensa). Tangan kanan menggantung; **genggaman diraih adik dalam ± 0,7 s pertama**, lalu **mundur setengah langkah** (`flipLegs`, pola A08). Ponsel di tangan kiri, layar mati |
| Adik | Di kanan-belakang Uq; **tangan kiri terulur ke tangan kanan Uq**, mengait; bersembunyi sebagian di belakangnya |
| Ekspresi / pandangan | Keduanya ke pintu. Uq: kaget tertahan. Adik: takut |
| Cahaya | Rim bulan dari ruang tamu; wajah gelap + fill lemah |
| SFX / teks | Jeda: dengung toa + jangkrik (tanpa hening total); subtitle L18 |
| Sambungan | Keduanya menoleh perlahan ke arah ruang tamu → S12 (elips: mereka telah mundur ke ruang tamu) |
| Aset | Ada: mundur (A08), genggam (`Pair`). Perlu uji: meraih lalu mundur bergandengan |

#### S12 — 54,9–66,6 s · Pertanyaan + kartu pilihan

| Aspek | Rencana |
|---|---|
| Narasi | L19 (± 54,9–64,1 s) |
| Kamera | Pola A17: lensa tetap `P` (0,75; 1,5; 2,55), fov 54. **Pan** ke pintu depan + jendela bergorden (kiri layar) pada "mengintip ke arah pintu depan untuk memastikan siapa di sana", kembali ke keduanya pada "tetap diam bersama adikmu", lalu diam sampai potong ke hitam. Mulut lorong tetap di kanan layar |
| Uq | Di posisi `C1_ROOM` bergandengan (tangan kanan). Menoleh ke pintu depan pada klausa A, ke adik pada klausa B. **Tidak bergerak ke pintu.** Ponsel menggantung di tangan kiri |
| Adik | Menggenggam tangan kanan Uq dengan tangan kiri; menatap Uq |
| Cahaya | Bulan di gorden; **tanpa celah cahaya di bawah pintu depan (ditunda)** |
| SFX / teks | Dengung toa, jangkrik; subtitle L19. **Kartu vertikal mulai masuk saat L19 dimulai** (± 55,2 s; judul lalu A dan B, selang 0,2 s, fade 0,35 s); bertahan ± 2–3 s sesudah narasi; potong ke hitam |
| Penempatan | Kartu di ± y 170–510 px; wajah ± 0,55–0,6 tinggi bingkai; pita subtitle (± y 1264–1424) bebas |
| Sambungan | Akhir episode |
| Aset | Ada: kamera A17, `Pair`. Baru: `Cards` vertikal + judul. Elips S11→S12 diuji terpisah |

### 3.6 Estimasi durasi

| Komponen | Detik |
|---|---:|
| Awal narasi | 0,5 |
| L1–L18 (99 kata ÷ 1,86) | 53,2 |
| Jeda setelah ketukan | 1,2 |
| L19 (17 kata ÷ 1,86) | 9,1 |
| Kartu bertahan sesudah narasi | 2,5 (rentang 2–3) |
| **Total** | **± 66,6 s (rentang ± 63–70)** |

- Kartu tampil ± 11,4 s (dari L19 mulai), tetapi hanya 2,5 s menambah durasi; sisanya tumpang tindih dengan narasi.
- Label tidak menambah durasi (tumpang tindih L1–L2).
- 12 shot ≈ 10,8 potongan/menit (diagnosis saja, D-032).
- Estimasi disesuaikan ulang setelah audio tersedia.

### 3.7 Perlakuan toa dan cahaya tambahan (butir 4)

- **Toa:** sebagai **suara di atas reaksi tokoh** (L8 di S05): kamera tetap di Uq dan adik; tidak ada insert corong toa.
- **Celah cahaya di bawah pintu depan: ditunda.** Dikeluarkan dari S12 dan dari daftar aset.

### 3.8 Ringkasan revisi v0.1 → v0.2

1. **Ponsel dan tangan:** bukti frame dan kode (§3.0). Ponsel di tangan kiri dari saku kiri; tangan kanan = adik / telapak / gerendel.
2. **Genggaman:** tabel per shot (§3.4), termasuk lepas di S01 dan **diraih kembali di S11**.
3. **Cahaya:** v0.1 tidak masuk akal secara fisik (kaca ± 0 % dari dekat). Uq kini berdiri ± 1,0 m dengan sorot miring, lalu maju. Kaca harus bermaterial yang menerima cahaya. Hasil dibuktikan lewat preview.
4. **Gerendel** dipindah ke x −0,95 (y 1,10), karena kenop pintu di sisi barat dan gerendel harus terjangkau tangan kanan Uq.
5. **Toa** di atas reaksi; celah di bawah pintu depan ditunda.
6. **Adik:** menunjuk dengan tangan kiri karena lengan kanannya membawa jaket.
7. **Pilot** tetap S03–S06 dengan cakupan yang dibatasi (§5).

### 3.9 Urutan S03–S06 — v0.4 (2026-11-18, D-038)

Waktu = estimasi tempo Ep 1 (1,86 kata/s) di atas waktu kalimat v0.3: L5 11,3–15,1 · L6 15,1–19,9 · L7 19,9–22,0 · L8 22,0–24,2 · L9 24,2–27,9. **HYPOTHESIS** sampai audio ada. Total episode tetap ± 66,6 s (rentang 63–70). Hanya batas shot yang bergeser, dan jumlah shot tetap 12.

| Shot | Waktu (est.) | Durasi | Narasi | Isi | Kamera | Status |
|---|---|---:|---|---|---|---|
| **S03** | 11,3–18,9 s | ± 7,6 s | L5, L6 (sebagian) | Uq berjalan ke stand-off (z −3,8), berhenti. Senter menyala, ditutup telapak, lalu **sapuan** kenop → kaca → gerendel (± 3,0–3,5 s; kaca terang ± 1 s). Uq mulai maju dua langkah | Dari belakang, ruang tamu, **sisi barat garis**. **Usulan: varian (i) lensa 40°**, (−1,1; 1,95; 2,85) → (−1,4; 1,45; −4,6): adik di tepi kanan, kepala ± 11 %. Varian (ii): (−1,72; 1,95; 2,85), fov 30, adik tengah-kanan bawah | posisi adik: **pilihan pemilik** (§7.2) |
| **S04** | 18,9–21,4 s | ± 2,5 s | L6 (akhir), L7 "Klik" (± 20,0 s) | INSERT: tangan kanan mendorong gerendel, ponsel tangan kiri menyorot, **klik** | Insert v2 (−1,75; 1,25; −4,25), fov 50, sisi barat | disetujui (opsi 1). **Lengan kanan terlalu lurus: diuji di pilot** |
| **S05** | 21,4–24,2 s | ± 2,8 s | L7 (ekor), **L8 toa** | **Reaksi Uq:** telapak kanan kembali menutup lampu senter di punggung ponsel; toa "Dapur juga tidak kosong."; Uq membeku lalu memalingkan wajah ke kiri, menjauhi pintu (± 80° dari utara; **tidak** ke arah adik, yang berada di selatan); wajah diterangi cahaya bocor; senter dimatikan di akhir L8 → wajah gelap | Dapur barat-barat daya (−3,0; 1,42; −3,55), 2,24 m, fov 30 | **usulan** (akting menoleh + telapak kembali = baru) |
| **S06** | 24,2–27,9 s | ± 3,7 s | L9 | Adik menunjuk ke atas pintu dengan tangan kiri | Dari dapur ke selatan, **x −1,15** (disetujui), ± 2,5 m dari adik | disetujui (posisi kamera) |

- **Dibanding v0.3:** S03 + 0,3 s (sapuan penuh di S03), S04 + 0,5 s (insert ≥ 2 s), S05 menjadi reaksi wajah Uq (sebelumnya sumbu S03 dari belakang), S06 tetap.
- **Pemotongan S03 → S04:** Uq mulai melangkah di S03; insert S04 dimulai saat tangan kanan menyentuh gerendel. S04 → S05 dipotong pada aksi telapak kembali ke ponsel sesudah klik.
- **Garis 180°:** kamera S03 (varian i/ii), S04, S05, dan S06 berada di sisi barat garis Uq–adik (angka di §7.2).
- **Arah pandang S05 → S06:** di S05 Uq memandang ke kiri layar (menjauhi pintu). Di S06 adik menengadah ke kaca, juga ke kiri-atas layar. Keduanya tidak saling memandang, jadi potongan dibaca sebagai "dua reaksi terpisah terhadap suara", bukan tatap-balas. Belum diuji pada kecepatan normal.

## 4. Kebutuhan aset dan penyesuaian set

| Kategori | Ada (dipakai ulang) | Baru / penyesuaian |
|---|---|---|
| Set | `HouseInterior light="local"`: ruang tamu, lorong, dapur, pintu belakang, pintu depan, gorden | **Gerendel** di (−0,95; 1,10); **kaca lubang angin bermaterial menerima cahaya** (saat ini `MeshBasicMaterial`, tidak bereaksi); getar pintu per ketukan; dressing lorong 3–5 properti |
| Karakter | `C1_BODIED`, `ADIK_B` + jaket, pose `Pair` Ep 1 | Ambil ponsel dari saku; telapak membungkus senter; dorong gerendel; adik menunjuk (tangan kiri); adik berhenti di kusen; berbalik 180°; meraih tangan lalu mundur |
| Kamera | A16b (POV lorong) dan A17 (`P`, pan) Ep 1 | Sumbu lorong selatan dari dapur (S02, S06, S11); insert samping S04 |
| Cahaya | Malam lokal, bulan, layar ponsel (A07) | `SpotLight` senter (sumbu miring ± 25°, telapak menutup sebagian); fill lemah di lorong |
| Overlay | `CaptionsHL`, `PhoneUI`, `DayLabel`, `Cards` | `DayLabel` dua baris; `Cards` vertikal + judul; pesan ke-2 |
| Audio | Efek toa, ambience, SFX sintesis, folder SFX proyek | VO baru (Dhani; Zorin), SFX klik senter, klik gerendel, getar ponsel, tiga ketukan |
| **Ditunda** | — | Celah cahaya di bawah pintu depan |

**Audio:** arahan pemilik yang tercatat (ElevenLabs Pro diasumsikan, SFX folder proyek boleh dipakai). Generasi audio belum diizinkan.

## 5. Uji: pilot S03–S06 dan pemeriksaan terpisah

### 5.1 Pilot 15 s S03–S06 (L5–L9, ± 11,3–27,9 s): yang benar-benar tercakup

| # | Uji | Shot | Lulus bila |
|---|---|---|---|
| P1 | **Sapuan cahaya ke kaca** (§3.3): kaca menghangat samar saat sorot lewat, dingin sebelum dan sesudahnya | S03 | Kriteria §3.3 terpenuhi di still dan klip |
| P2 | Tangan: **telapak membungkus ponsel** dan **dorong gerendel** dengan rute rendah | S04–S05 | Telapak–target, `c1ArmTorsoDepth`, lompatan sudut ≤ ~15°/frame, satu cabang IK; tanpa lengan masuk torso |
| P3 | **Ponsel tetap di tangan kiri** dari S03 sampai S05 (kontinuitas pemegang) | S03–S05 | Tangan dan ponsel konsisten di setiap shot |
| P4 | **Berjalan ke stand-off ± 1,0 m, berhenti, lalu maju dua langkah** | S03, S05 | Kaki menapak tanpa meluncur; berhenti di titik yang dihitung |
| P5 | **Wajah dalam gelap** Uq (S03) dan adik (S06) | S03, S06 | Ekspresi terbaca dan malam tetap gelap |
| P6 | **Adik menunjuk dengan tangan kiri** sementara lengan kanan membawa jaket | S06 | Pose wajar, tanpa lengan menembus |
| P7 | **Dua kamera berlawanan di sumbu lorong** (S03/S05 ke utara, S06 ke selatan) | S05→S06 | Orientasi tetap terbaca (lorong kiri/kanan konsisten) |
| P8 | **Audio L5–L9**: klik senter, klik gerendel, toa di atas reaksi, bisikan adik | S04–S06 | Level terbaca, tanpa hening total |

### 5.2 Pemeriksaan terpisah (di luar pilot)

| Kode | Pemeriksaan | Shot | Cara |
|---|---|---|---|
| A | Label dua baris + ambil ponsel dari saku | S01 | Still pembuka (label tidak menutup wajah/subtitle); angka IK tangan kiri ke saku |
| B | **Berbalik 180° di tempat lalu berjalan** | S07 | Uji gerak sendiri (belum teruji); numerik + strip per frame |
| C | **Ketukan:** getar pintu + sumber suara terbaca di pintu belakang | S10 | Klip pendek dengan audio |
| D | **Meraih tangan lalu mundur bergandengan** | S11 | Uji `Pair` + `flipLegs`; angka telapak ↔ titik temu |
| E | **Pan akhir + kartu vertikal + elips S11→S12** | S12 | Still di tiga posisi pan; cek kartu tidak menutup wajah |
| F | Insert ponsel + pesan ke-2 | S08–S09 | Still insert; kejelasan layar |
| G | Lorong: jalan lurus + adik memegang kusen | S02 | Still + gerak pendek |

Gerbang (CLAUDE.md §16): still look-dev lorong/dapur berdampingan dengan frame referensi → pemilik → pilot 15 s bersuara → pemilik → episode penuh.

## 6. Keputusan (storyboard)

**Diputuskan pemilik 2026-11-17 (D-037):**
- Storyboard v0.2 **disetujui** dengan satu revisi: motivasi cahaya = **sapuan mencari gerendel** (§3.3) → storyboard v0.3.
- Ponsel di saku kiri, dipegang tangan kiri (asumsi Ep 2): **disetujui**.
- Stand-off ± 1,0 m lalu maju dua langkah, gerendel di (x −0,95; y 1,10): **disetujui**.
- Material kaca diganti agar menerima cahaya: **disetujui**. Cadangan (b) dan (c): **belum disetujui**.
- Toa sebagai suara di atas reaksi; celah di bawah pintu depan ditunda; pilot tetap S03–S06.

**Tahap yang diizinkan sekarang:** still look-dev dapur + uji cahaya (a–e), tanpa animasi dan tanpa audio. Pilot, audio, dan render video belum diizinkan.

**Terbuka:** tinjauan still look-dev (§7) dan, bila perlu, keputusan cadangan (b)/(c).

## 7. Look-dev dapur + uji cahaya v1 (2026-11-17) — MENUNGGU TINJAUAN PEMILIK

- **Berkas:** `_media/2026-11-003/out/lookdev_dapur_v1/`
  - `lookdev_dapur_v1_vs_ref.jpg`: 5 still kita + 3 frame referensi interior malam (target gaya; untuk analisis pribadi, tidak dipublikasikan).
  - `lookdev_dapur_v1_{a,b,c,d,e}.png` (1080×1920).
- **Kode (aditif; default lama tidak berubah):** `HouseInterior` props `vent="lit"` (kaca Lambert yang menerima cahaya, emisif dingin lama sebagai dasar) dan `backBolt` (gerendel panjang: gagang di (−0,95; 1,10), batang ke penahan di kusen barat); komposisi `LookDev003-a..e` (`studio/src/ep003/LookDev003.tsx`). Mood = `NIGHT_INT` animatic Ep 1. Senter = `SpotLight` hangat-putih 6 cd × 0,45 (tutupan telapak), sudut 0,5 rad, decay 2.
- **Iterasi:** v1 dirender lalu diperbaiki staging-nya (adik tertutup Uq di a, ponsel tergambar rebah, kepala adik terlalu besar di b–d) → v2 = berkas di atas. Pencahayaan Ep 1 tidak diubah.
- **Skill:** `video-production` (§9 fungsi murni, §12 cahaya lokal, §13 tangan), `inkbeat-shorts` (kamera, kepala besar di depan lensa), `threejs-lighting` (SpotLight + target, decay 2), `threejs-materials` (Lambert + emisif untuk kaca).

**Angka (metode target gaya: L* rata-rata, piksel L* < 15):**

| Still | L* | Gelap |
|---|---:|---:|
| a · dapur gelap, senter mati | 33,1 | 20 % |
| b · telapak, area kenop | 18,2 | 48 % |
| c · puncak sapuan (kaca) | 18,8 | 49 % |
| d · senter di gerendel | 17,3 | 48 % |
| e · POV adik ke kaca | 27,3 | 33 % |
| Referensi 1:26 (lilin, pintu) | 20,2 | 56 % |
| Referensi 1:29 (dua tokoh, pintu) | 13,4 | 67 % |
| Referensi 1:51 (anak, lilin) | 14,8 | 72 % |

**Kaca lubang angin (rata-rata RGB area kaca, frame 1080×1920, kotak 530–640 × 590–650):** b 86/96/143 (R/B 0,60) · **c 161/155/177 (R/B 0,91)** · d 86/96/143 (R/B 0,61). Kaca jelas lebih terang dan lebih netral saat sorot di atas, lalu kembali biru. Pergeserannya terbaca sebagai "terang", baru samar sebagai "hangat".

**QC — kelemahan terbesar lebih dulu (lolos cek teknis ≠ disetujui):**
1. **Gerendel tidak terbaca dari sumbu S03/S05.** Gerendel di x −0,95 tepat di depan Uq, jadi tertutup kepala/leher Uq dari kamera di belakang adik (still d). Sumber cahaya di gerendel terlihat, gerendelnya tidak. Perlu insert S04 (sudah direncanakan) atau kamera S03 digeser ke barat. Posisi gerendel tidak diubah (sudah disetujui).
2. **"Ditutup telapak" tidak terbaca dari bentuk cahaya.** Kolam cahaya bulat lebar dan lembut, sama seperti senter terbuka yang diredupkan. Di b dan d kolam itu tampak seperti halo di samping kepala Uq. Perlu bentuk cahaya yang lebih sempit dan tidak rata (celah jari). Diuji di pilot.
3. **Kaca lebih "terang" daripada "hangat".** R/B naik 0,60 → 0,91, tetap di bawah 1. Cocok dengan ucapan adik ("tadi terang"), tetapi belum hangat oranye. Warna LED ponsel memang mendekati putih.
4. **Still a terlalu terang untuk malam:** L* 33,1 dan gelap 20 % (target 20–30 dan ≥ 35 %). Wajah sangat terbaca (lulus P5), tetapi fill karakter (`NIGHT_INT` ×9) dan dinding lorong dekat kamera mengangkat kecerahan. Ada tarik-menarik antara keterbacaan wajah dan gelap malam.
5. **Kepala adik di latar depan b–d:** siluet gelap besar terpotong di kiri bawah (± 20 % tinggi bingkai). Masih bisa diterima, tetapi berat.
6. **Outline:** tinta tipis konsisten di karakter; kusen pintu punya garis tepi terang tipis. Pada crop 1:1 tidak terlihat garis putus.
7. **Kedip/noise:** still tidak bisa menunjukkan kedip. Pada crop 1:1 tidak ada shadow acne atau bintik. Kedip sorot yang bergerak harus diuji di pilot (P1).
8. **Konsistensi C1:** di still a, "Uq" berada di dada kiri anatomis (kanan layar saat menghadap kamera). Kepala, wajah, dan bentuk tubuh sesuai C1_BODIED. Di b–e Uq membelakangi kamera, jadi tulisan tidak terlihat (sesuai rencana). Tangan Uq di b–d tertutup badannya; IK tangan belum tervalidasi oleh still ini (pilot P2).
9. **Garis pandang adik (still e):** kaca terlihat utuh di atas kepala Uq. Lulus.
10. **Referensi lebih gelap dan hangat** (L* 13–20, gelap 56–72 %, satu sumber oranye). Still b–d mendekati angka gelap itu, tetapi warnanya ungu-biru karena cahaya bulan, bukan lilin. Ini sesuai cerita (lampu mati), bukan kesalahan.

## 7.1 Look-dev dapur v2 (2026-11-17) — DITINJAU PEMILIK 2026-11-18 (D-038)

**Catatan pemilik atas v1:** (1) still a: adik menembus dinding kanan lorong (bahu/tangan kiri); (2) still b–e: tangan, ponsel, gerendel tidak terlihat karena kamera di belakang Uq. Keputusan: kaca cukup "terang" (tidak dikejar hangat); still a boleh sedikit lebih gelap selama wajah terbaca. Cheat (dinding dibuang, kamera di dalam dinding) tidak dipakai tanpa persetujuan.

- **Berkas:** `_media/2026-11-003/out/lookdev_dapur_v2/`: `lookdev_dapur_v2_vs_ref.jpg` (v2 + v1 terkait + REF 1:26/1:29/1:51 + diagnostik), `lookdev_dapur_v2_denah.png` (denah tampak atas, kamera, garis 180°), `lookdev_dapur_v2_jarak_tubuh.txt`, still `a`, `s03`, `s04`, `e`, `k1c/k1d`, `k3c/k3d`, empat still diagnostik. v1 tidak disentuh.
- **Kode:** `studio/src/ep003/ld003Scene.ts` (satu sumber posisi tokoh/kamera/ponsel untuk render **dan** cek), komposisi `LookDev003v2-*`, alat `studio/tools/ld003_clearance.ts`. Senter lebih sempit (0,25 rad). Lampu karakter v2 (`CharLight`) menggantikan `CastLight` di look-dev ini.
- **Skill:** `video-production` (§9, §12, §13), `inkbeat-shorts` (kepala besar di depan lensa, lensa), `threejs-lighting` (point/spot light, `distance`/`decay`), `threejs-materials`.

**A. Clipping — cek numerik jarak tubuh (QC tetap mulai sekarang; STUDIO-WORKFLOW §10.6):**
Sampel tubuh dari rig yang sama dengan renderer (`armChain`, radius kaos `teeSurface`, pusat kepala), tiap sampel diberi radius; jarak minimum ke dinding/objek (`geo.ts`). Negatif = tembus.

| Still | Uq (cm) | Adik (cm) | Titik terdekat |
|---|---:|---:|---|
| v1 a (temuan pemilik) | 9,2 | **−7,2 TEMBUS** | adik: tangan kiri ↔ dinding barat lorong |
| v2 a | 21,2 | 13,1 | Uq: tangan kanan ↔ dinding timur; adik: tangan kiri ↔ dinding barat |
| v2 s03, k1, k3, e | 52,7 | 13,1 | Uq: kepala ↔ dinding dapur-lorong |
| v2 s04 | 2,0 (kontak disengaja) | 13,1 | Uq: tangan kanan memegang gerendel |

- Adik dipindah ke dalam bukaan lorong (x −1,00, z −0,95), **di belakang** Uq (tidak sejajar). Lebar lorong tidak diubah.
- **Still a, ponsel:** kini terlihat menempel di tangan kiri, layar menghadap depan. **Jari belum terbaca menggenggam** (tangan di atas ponsel): masih kelemahan, masuk uji A.

**B. Kamera momen sapuan (c) dan gerendel (d):**
- **Temuan geometri (angka):** Uq **menghadap** dinding kaca. Wajah terbaca dari utara Uq, kaca terbaca dari selatan dinding, dan jarak Uq–dinding hanya ± 1,1 m. Solver kamera (titik: lebar kepala, ponsel, gerendel, sudut kaca; bingkai 9:16; margin 15–18 %):
  - **K1 legal** (3,1 m, dinding barat dapur): wajah 70°, kaca 88° (nyaris dari sisi), dan **tertutup rak dapur** di atas lensa. Tidak layak.
  - **K3** (1,8 m, melanggar ≥ 2,2 m): wajah 67°, kaca 76°, fov 79°. Uq di tepi kanan, pintu/kaca di tepi kiri, tengah bingkai kosong. Layak secara teknis, lemah secara komposisi.
  - **KE** (timur/engsel): tidak ada posisi yang memuat semua titik dengan fov ≤ 80°. Tidak dirender.
  - **Kesimpulan:** "wajah + telapak + ponsel + gerendel + kaca dalam satu bingkai vertikal" **tidak bisa dicapai** tanpa mengubah blocking. Cheat dinding juga tidak menolong, karena masalahnya arah hadap Uq, bukan dinding.
- **Yang berhasil:** **S04 insert** (tangan kanan di gerendel, ponsel di tangan kiri, kolam cahaya; dikecualikan dari aturan 2,2 m) dan **S03 dari belakang** (kaca dan sapuan terbaca seperti dilihat adik).
- **Garis 180°:** garis Uq–adik = x −0,95. ~~Semua kamera S03–S07 di sisi barat atau tepat di garis.~~ **[KOREKSI 2026-11-18: salah. Kamera S03 v2 (−0,35; 2,6) berada 0,71 m di sisi timur garis, dan still e 0,16 m di timur; dihitung di `tools/ld003_v3_calc.ts`. S03 v3 dipindah ke barat.]** **S06 diusulkan pindah** dari x −0,5 ke x −1,15 agar tidak menyeberang. KE (timur) akan menyeberang.
- **S03:** kepala adik masih masuk bingkai kiri bawah (± 20 % tinggi). Belum diselesaikan.

**C. Dua temuan visual v1 (dijelaskan dengan diagnostik):**
1. **Garis terang di kusen dan langit-langit terang:** sumbernya **lampu rim `CastLight`**, bukan senter dan bukan outline.
   - Rim ditempatkan 0,85 m di belakang tokoh dan 0,55 m di atas kepala, dengan jangkauan 2,4 m. Untuk Uq di depan pintu, posisi itu berada di antara Uq dan pintu dekat langit-langit, sehingga menerangi langit-langit, daun pintu, dan kusen krem.
   - Bukti: senter mati + CastLight lama → luma pita langit-langit **139**. Tanpa CastLight → **25,5**. Outline mati → garis kusen tetap terang.
   - Perbaikan v2: lampu karakter dengan rim pendek (jangkauan 1,0 m dekat kepala) dan fill dari sisi lensa. Still diagnostik "lampu karakter baru": langit-langit, kusen, dan daun pintu gelap tanpa senter.
   - Garis kusen **bukan** cahaya dari gang dan tidak lagi terbaca demikian.
2. Senter v2 lebih sempit (0,25 rad): kolam cahaya kecil dan terarah, tidak lagi seperti halo.

**Angka (L*, piksel gelap):** a 27,7 / 21 % · s03 19,2 / 50 % · s04 21,4 / 48 % · e 12,7 / 78 % · k3 13,4 / 70 % · k1 7,7 / 89 % · REF 20,2 / 56 %, 13,4 / 67 %, 14,8 / 72 %.

**QC — kelemahan terbesar lebih dulu (lolos cek teknis ≠ disetujui):**
1. **Momen sapuan dan gerendel tidak bisa satu bingkai** dengan wajah Uq (geometri hadap). Butuh keputusan pemilik (opsi di laporan).
2. **Ponsel di still a belum terbaca digenggam** (jari tidak membungkus).
3. **Kepala adik masih besar di S03.**
4. **K3:** subjek di tepi bingkai, tengah kosong; melanggar 2,2 m.
5. **S04:** lengan kanan Uq tampak lurus panjang (rig satu bidang, jangkauan hampir penuh): perlu dicek di uji tangan.
6. Label teks yang tertanam di render K1 masih "2,3 m" (versi sebelumnya); jarak sebenarnya 3,1 m (label lembar dan nama berkas benar).
7. **C1:** "Uq" di dada kiri anatomis (still a, dan sisi kiri Uq yang menghadap kamera di K3). Bentuk tubuh konsisten.
8. **Kedip/noise:** tidak bisa dinilai dari still. Tidak ada shadow acne di crop.

## 7.2 Look-dev dapur v3 (2026-11-18) — MENUNGGU TINJAUAN PEMILIK

**Keputusan pemilik atas v2 (D-038):** opsi 1 (S03 dari belakang + insert S04), adik kecil di tepi bingkai S03, S06 ke x −1,15. Diminta: reaksi wajah Uq di S05 dan still genggaman ponsel. Label K1 hanya dicatat karena K1 tidak dipakai; lengan S04 hanya dicatat.

- **Berkas:** `_media/2026-11-003/out/lookdev_dapur_v3/`. v1 dan v2 tidak disentuh.
  - `lookdev_dapur_v3_vs_ref.jpg`: still v3, crop 1:1, still v2 terkait (S03, a, S04), REF 1:26/1:29/1:51, dan denah.
  - Still:
    - `…_s03_adik_tepi_lensa40_kaca.png` = varian (i) dengan lensa 40° dan senter di puncak sapuan (kaca) = **usulan**;
    - `…_s03_adik_tepi.png` = varian (i) fov 28, senter di kenop;
    - `…_s03_alt_adik_barat.png` = varian (ii);
    - `…_s05_reaksi_barat_2m2.png` = usulan reaksi;
    - `…_s05_reaksi_arah_pintu_MELANGGAR.png` = bukti saja, tidak untuk dipakai;
    - `…_a_genggam_g2.png` = dipilih;
    - `…_a_genggam_g1.png` = tidak dipilih.
  - `…_denah.png`: label dihitung dari data, tidak diketik.
  - `…_angka.txt` dan `…_jarak_tubuh.txt`.
- **Kode (aditif):**
  - `studio/src/ep003/ld003SceneV3.ts`: satu sumber data untuk render dan cek. Isinya rangka tangan yang sama dengan `C1.tsx`, genggaman ponsel yang diturunkan dari rangka tangan, dan pose telapak menutup senter.
  - Komposisi `LookDev003v3-*` di `LookDev003.tsx`.
  - Alat:
    - `studio/tools/ld003_v3_calc.ts`: jarak kamera, sisi garis 180°, ukuran adik/kaca di bingkai, rasio perspektif, kontak jari–ponsel;
    - `ld003_v3_denah_data.ts` + `ld003_v3_denah.py`;
    - `ld003_clearance.ts` kini juga mencakup v3.
  - Satu-satunya perubahan di kode v2: `uqAtDoor` diekspor. Data pose v2 identik dengan atau tanpa modul v3 (dibandingkan lewat JSON).
- **Skill:**
  - `video-production` (§9 fungsi murni, §12 cahaya lokal, §13 tangan);
  - `inkbeat-shorts` (`camera-and-editing`: lensa close-up dan garis 180°; `characters`: kepala 3/4, tidak profil murni > 70°, close-up tidak dipalsukan dengan kepala dekat);
  - `threejs-lighting` (point light `distance`/`decay` untuk cahaya bocor);
  - target gaya §2–§4.

**A. Reaksi wajah S05: usulan "close-up dari arah pintu" sudah dihitung dan TIDAK LAYAK**

| Ukuran | Dari arah pintu (usulan) | Alternatif barat-barat daya (usulan Claude) |
|---|---:|---:|
| Kamera → pusat kepala | **0,49 m** (permukaan wajah 0,32 m) | 2,24 m |
| Kamera → daun pintu | 0,07 m | 1,39 m |
| Ruang maksimum wajah–pintu sesudah maju | 0,56 m | — |
| Rasio perspektif depan/pusat kepala | **1,56** (pada 2,2 m: 1,09) | 1,09 |
| fov untuk kepala + bahu | 84° | 30° (tangan + ponsel ikut terlihat) |
| Sudut wajah ke lensa | 5° (frontal) | 32° (3/4) |
| Sisi garis 180° | tepat di garis | barat (−2,03 m) |
| L* bingkai / gelap | 49,2 / 20 % | 24,0 / 47 % |
| L* wajah (crop) | — | 61 (REF 1:51, wajah anak: 66) |

- **Masalah usulan dari arah pintu:**
  - kepala mengisi seluruh bingkai dan badan mengecil di bawahnya; di still bukti, kepala tampak membesar;
  - melanggar prioritas no. 1 (konsistensi bentuk);
  - melanggar aturan ≥ 2,2 m (insert tangan dikecualikan, wajah tidak).
- **Alternatif yang diusulkan:**
  - sesudah klik, telapak kanan kembali menutup lampu senter di punggung ponsel;
  - saat toa berbicara, Uq membeku lalu memalingkan wajah ke kiri, menjauhi pintu (badan 30°, kepala 50°, wajah ± 80° dari utara). Ia **tidak** memandang adik (yang berada di selatan) dan tidak memandang sumber suara (lokasinya tidak diketahui);
  - wajahnya diterangi cahaya bocor, yaitu point light hangat di antara telapak dan ponsel;
  - ibu jari kiri mematikan senter di akhir L8;
  - diagnostik membuktikan wajah memang diterangi cahaya bocor: tanpa lampu karakter wajah tetap terang, tanpa cahaya bocor wajah gelap.
- **Alternatif lain yang dihitung dan ditolak:**
  - profil dari barat: sudut wajah > 70°, dilarang di `characters`;
  - kamera di luar pintu: cheat, dan terbaca sebagai POV pengintai;
  - dari lorong ≥ 2,2 m: Uq harus berbalik ± 150°, tumpang tindih dengan aksi berbalik di S07.

**B. S03: adik "kecil di tepi bingkai"**

| Varian | Kamera | Adik terlihat (tinggi bingkai) | Kepala adik | Posisi adik | Kaca | Sisi garis | L* / gelap | Jarak tubuh adik |
|---|---|---:|---:|---|---:|---|---|---:|
| v2 (acuan) | (−0,35; 1,6; 2,6) fov 34 | 38 % | 14 % | kiri bawah, penuh | 6,6 % | **timur** (+0,71) | 19,2 / 50 % | 13,1 cm |
| **(i)** adik di sisi timur mulut (x −0,5) | (−1,1; 1,95; 2,85) fov 28 | 28 % | 16 % | **tepi kanan, terpotong** | 7,8 % | barat (−1,28) | 14,3 / 74 % | 3,9 cm (jaket ↔ dinding timur) |
| **(i) lensa 40° (usulan)** | (−1,1; 1,95; 2,85) → (−1,4; 1,45; −4,6), fov 40 | 35 % | **11 %** | tepi kanan, terpotong | 5,4 % | barat (−1,28) | 13,2 / 76 % | 3,9 cm |
| **(ii)** adik di sisi barat (x −1,12) | (−1,72; 1,95; 2,85) fov 30 | 32 % | 15 % | tengah-kanan bawah | 7,3 % | barat (−0,37) | 16,6 / 59 % | 1,8 cm MEPET (tangan kiri ↔ kusen barat; cocok untuk pegangan kusen S02) |

- **Batas fisik:** kamera paling jauh berjarak 3,95 m dari adik (dinding selatan ruang tamu), sedangkan Uq 6,7 m dari kamera. Adik selalu tampak lebih besar daripada Uq.
- **Lensa lebih lebar** mengecilkan kepala adik, tetapi kaca ikut mengecil (proyeksi tepat, `ld003_v3_calc.ts`; kamera dan arah varian masing-masing):

  | fov | Kepala adik (i) | Kepala adik (ii) | Kaca |
  |---:|---:|---:|---:|
  | 28 | 15,8 % | 15,6 % | 7,8 % |
  | 30 | 14,7 % | 14,5 % | 7,3 % |
  | 36 | 12,1 % | 12,0 % | 6,0 % |
  | 40 | 10,8 % | 10,7 % | 5,4 % |
  | 45 | 9,5 % | 9,4 % | 4,7 % |

  Pada lensa lebih lebar adik bergeser ke tengah. Arah kamera (i) lensa 40° digeser ke barat agar adik tetap di tepi kanan (x 0,85–1,11).
- **Kaca menyala dari kamera baru** (still lensa 40°, senter di kaca). Rata-rata RGB kotak kaca (proyeksi dari data): **157/153/175, R/B 0,90**. Saat senter di kenop (varian i fov 28): 77/90/139, R/B 0,55; (ii): R/B 0,57. Angka ini setara v1 (0,91 vs 0,60): kaca terbaca "terang" dari sudut S03 yang baru.

- **"Di tepi bingkai"** hanya tercapai bila adik bergeser dari garis pandang ke Uq, yaitu varian (i). Konsekuensi (i):
  - pegangan kusen S02 pindah ke kusen timur, dengan tangan kanan yang membawa jaket;
  - di S07 adik harus bergeser ke barat supaya tetap di sisi kanan Uq untuk genggaman S11–S12.
- Varian (ii) tidak mengubah kontinuitas, tetapi adik berada di tengah-kanan.
- **Pilihan pemilik:** (i) lensa 40° (usulan Claude: kepala adik 11 %, di tepi, kaca masih terbaca menyala), (i) fov 28, atau (ii).

**C. Genggaman ponsel (still a)**
- **g2 dipilih:** ponsel tegak di sisi paha, layar menghadap keluar-depan. Telapak menempel di punggung ponsel dan jari **mengait tepi depan** ponsel. Crop 1:1 terbaca sebagai memegang.
- **Angka g2:**
  - jari tidak menembus ponsel (0,0 cm);
  - ujung dua jari tengah tepat di bidang layar (−0,1 cm);
  - ujung jari 0,9–1,5 cm melewati tepi (kait);
  - telapak–punggung ponsel 0,0 cm;
  - **lengan bawah menembus punggung ponsel 0,6 cm** di pergelangan, tetapi tersembunyi di balik ponsel dari kamera a.
- **Batas rig (terbukti angka):** jari C1 punya satu sendi dan panjangnya 3,1 cm.
  - Agar ujung jari sampai ke depan layar, perlu jangkauan ± 2,6 cm dari pusat telapak; yang tersedia ± 2,5 cm.
  - Jadi jari **tidak bisa melingkar sampai ke layar** tanpa sendi jari kedua.
  - Sendi kedua mengubah desain C1 yang disetujui (D-018/D-031), jadi keputusannya ada di pemilik.
- **g1** (ponsel melintang): tangan tampak di bawah ponsel, tidak terbaca menggenggam. Tidak dipilih.

**D. Lain-lain**
- **K1 tidak dipakai** (opsi 1), jadi label "2,3 m" yang salah di render K1 v2 tidak diperbaiki. Denah v2 juga memuat label lama (K1 2,3 m, K3 1,5 m); denah v3 menggantikannya.
- **S04, lengan kanan terlalu lurus:** dicatat untuk diuji di pilot (P2), tidak diperbaiki sekarang.
- **S06 (x −1,15):** 2,49 m dari adik, di sisi barat garis.
- **Jarak tubuh (semua still v3, negatif = tembus):** tidak ada yang tembus. S03 (i)/(i) lensa 40: Uq 52,7 cm, adik 3,9 cm. S03 (ii): adik 1,8 cm MEPET (kusen). a g1/g2: Uq 21,2 cm, adik 13,1 cm. S05 barat: Uq 21,1 cm (tangan kanan ↔ gerendel). S05 pintu: 13,3 cm. Rincian: `…_jarak_tubuh.txt`.
- **Determinisme:**
  - still v2-a yang dirender ulang hari ini berbeda tipis dari berkas v2 tersimpan, hanya di tepi tinta (rata-rata 0,14/255; 0,03 % piksel > 8);
  - dua render ulang hari ini identik, dan data pose v2 juga identik;
  - penyebabnya belum diketahui (UNKNOWN); perbedaannya tidak terlihat pada ukuran normal.

**Angka (L*, piksel gelap):**

| Still | L* | Gelap |
|---|---:|---:|
| v3 S03 (i) lensa 40, kaca | 13,2 | 76 % |
| v3 S03 (i) fov 28 | 14,3 | 74 % |
| v3 S03 (ii) | 16,6 | 59 % |
| v3 S05 barat | 24,0 | 47 % |
| v3 S05 pintu | 49,2 | 20 % |
| v3 a g2 | 27,8 | 21 % |
| REF 1:26 | 20,2 | 56 % |
| REF 1:29 | 13,4 | 67 % |
| REF 1:51 | 14,8 | 72 % |

**QC — kelemahan terbesar lebih dulu (lolos cek teknis ≠ disetujui):**
1. **S05: "telapak menutup senter" belum terbaca.**
   - Dari kamera ini telapak kanan berada di punggung ponsel (sisi lampu), jadi hanya ujung jarinya yang tampak di tepi atas. Cahaya bocor terbaca sebagai layar ponsel yang berpendar, bukan cahaya dari sela jari.
   - Diperbaiki saat pemeriksaan akhir: ponsel S05 sempat terbalik (layar menghadap pintu); kini layar menghadap Uq, sama dengan S03.
   - Wajah terang dan terbaca.
   - Kedua lengan terulur jauh ke depan (pola lengan lurus yang sama dengan S04).
   - Perlu diuji di pilot (P2) dari kamera ini.
2. **S03: adik hanya bisa dikecilkan dengan lensa lebih lebar.** Kepala adik 11 % pada lensa 40° (v2: 14 %), dengan kaca turun ke 5,4 %. "Tepi bingkai" hanya tercapai di varian (i), yang membawa biaya kontinuitas (S02 kusen, S07 bergeser).
3. **S05 alternatif adalah akting baru** (telapak kembali, memalingkan wajah ± 80° menjauhi pintu, bukan ke adik). Belum diuji sebagai gerak. Memalingkan wajah di S05 dan berbalik di S07 harus terbaca berbeda.
4. **Genggaman = kait, bukan bungkus penuh.** Lengan bawah tembus 0,6 cm, tersembunyi.
5. **Malam:** S05 barat (24,0 / 47 %) di dalam rentang target. S03 lebih gelap dari referensi (L* 13–17), tetapi kaca dan sorot tetap terbaca.
6. **C1:** "Uq" di dada kiri anatomis (still a; di S05 terlihat sebagian di sisi badan yang menghadap kamera). Bentuk kepala dan tubuh konsisten. Still dari arah pintu memperlihatkan distorsi proporsi, dan itu alasan usulan tersebut ditolak.
7. **Kedip/noise** tidak bisa dinilai dari still. Crop 1:1 tidak memperlihatkan shadow acne.

## 7b. (Pilot, produksi, QC video, publikasi: belum dimulai)

## 8. Riwayat naskah dan rencana

### 8.4 Rencana beat v0.3 (digantikan storyboard, §3)

Delapan beat B1–B8 (ruang tamu → lorong → dapur → toa → adik menunjuk → ponsel → ketukan → kartu). Seluruh isinya dipindahkan dan dirinci di storyboard (§3).

### 8.3 Draft v0.3 (2026-11-17) — digantikan v1.0

Alasan diganti: disetujui pemilik dengan dua penyesuaian (pilihan A "INTIP PINTU DEPAN" + narasi penutup baru; kartu muncul saat narasi). Teks disimpan utuh. Jumlah kata 112; estimasi ± 64 s.

```text
[VISUAL — LABEL PEMBUKA, kiri atas, ± 0,25–4,9 s, bersamaan dengan L1–L3]
HARI 1
EPISODE 2

Pengeras suara itu masih memakai suaramu.

Kamu memilih tetap di dalam.

Tapi pintu belakang belum dikunci.

“Kak, jangan nyalain lampu…”

Dapur gelap. Kamu tidak bisa melihat gerendelnya.

Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan.

Klik. Pintu belakang terkunci.

“Dapur juga tidak kosong.”

“Kak… kaca di atas pintu tadi terang.”

Lubang angin itu menghadap gang.

“Dia lihat dari belakang juga?”

Kamu tidak bisa memastikannya.

Ponselmu bergetar. Pesan dari petugas keamanan.

“Saya sudah di depan rumah tujuh. Buka pintunya.”

“Itu Pak satpam, kan?”

Sebelum kamu sempat menjawab, terdengar tiga ketukan.

Dari pintu belakang.

Pintu yang baru saja kamu kunci.

[JEDA ± 1,2 s — ketukan dan arah sumbernya dipahami; tanpa narasi]

Kamu akan mengecek pintu depan untuk memastikan petugasnya, atau tetap diam bersama adikmu?

[VISUAL — KARTU PILIHAN, muncul saat narasi selesai, tahan ± 3,0 s lalu potong ke hitam]
APA YANG KAMU LAKUKAN?
A. CEK PINTU DEPAN
B. TETAP DIAM BERSAMA ADIK
```

### 8.2 Draft v0.2 (2026-11-17) — digantikan v0.3

Alasan diganti: arahan pemilik v0.3 (label dan kartu). Jumlah kata 99; estimasi ± 53 s. Usulan sementara di v0.2: tanpa label hari, tanpa kartu pilihan (digantikan).

```text
Pengeras suara itu masih memakai suaramu.

Kamu memilih tetap di dalam.

Tapi pintu belakang belum dikunci.

“Kak, jangan nyalain lampu…”

Dapur gelap. Kamu tidak bisa melihat gerendelnya.

Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan.

Klik. Pintu belakang terkunci.

“Dapur juga tidak kosong.”

“Kak… kaca di atas pintu tadi terang.”

Lubang angin itu menghadap gang.

“Dia lihat dari belakang juga?”

Kamu tidak bisa memastikannya.

Ponselmu bergetar. Pesan dari petugas keamanan.

“Saya sudah di depan rumah tujuh. Buka pintunya.”

“Itu Pak satpam, kan?”

Sebelum kamu sempat menjawab, terdengar tiga ketukan.

Dari pintu belakang.

Pintu yang baru saja kamu kunci.
```

### 8.1 Draft v0.1 (2026-11-17) — digantikan v0.2

Alasan diganti: catatan revisi pemilik 2026-11-17. Jumlah kata 143; estimasi ± 77 s.

```text
Pengeras suara itu masih memakai suaramu.

Kamu memilih tetap di dalam.

Kamu mengunci pintu belakang.

“Kak… kalau kita harus lari, gimana?”

Petugas keamanan bilang jangan keluar dulu. Kamu memilih percaya.

Pengeras suara diam. Lebih lama dari sebelumnya.

“Tadi dia tahu lampunya mati karena kelihatan dari luar, kan?”

Adikmu mengambil ponselmu. Dia menyalakan senter di dalam jaketnya.

Pengeras suara tetap diam.

“Kalau nggak kelihatan, dia nggak tahu.”

Kamu mengambil ponsel itu dari tangannya, lalu melangkah ke dapur sendirian.

Di atas pintu belakang ada lubang angin berkaca buram.

Kamu menyalakan senter. Satu detik saja.

“Dapur juga tidak kosong.”

Dapur tidak kelihatan dari jalan. Cahaya tadi hanya bisa dilihat dari gang.

“Berarti ada yang di belakang…”

Ponselmu bergetar. Pesan dari petugas keamanan.

“Saya sudah di depan rumah tujuh. Buka pintunya.”

Lalu terdengar tiga ketukan.

Bukan dari pintu depan.

Dari pintu belakang yang baru saja kamu kunci.
```

Masalah v0.1 (dari catatan pemilik): uji jaket dipakai seperti bukti; klaim narator melampaui pengetahuan tokoh; tidak ada alasan praktis menyalakan senter; urutan kunci–senter tidak konsisten.

## 9. Voice-over — paket TTS (2026-11-18)

> Mengikuti [[DECISION-LOG#D-023]]: naskah terkunci tetap bersih, tag disimpan terpisah di sini, dan generasi dilakukan **pemilik secara manual di situs ElevenLabs**. Alasannya, paket akun masih `free` (dicek read-only `GET /v1/user/subscription` 2026-11-18: tier `free`, 2.935 / 10.000 karakter). API tidak boleh memakai suara library Dhani/Zorin (HTTP 402, 2026-11-15). Rujukan tag: [[elevenlabs-v4-audio-tags]].
> Hak audio mengikuti arahan pemilik yang tercatat di 2026-11-002 (paket Pro diasumsikan untuk publikasi; SFX folder proyek boleh dipakai).

**Pengaturan (sama dengan Ep 1):**
- Model `Eleven v4`; stability 0,77; similarity 0,43; tanpa Enhance.
- Narator dan toa: **Dhani – Professional, Clear and Engaging** (`20ptB7Wn4Q2sMkAxK1qK`).
- Adik: **Zorin – Friendly, Calm and Soft** (`19zQpXlAQKHlcmXgXfLr`).
- Satu take per segmen. Tempel **hanya** baris di dalam blok; jangan ikut sertakan judul atau arahan (pelajaran P01 Ep 1).
- Efek toa (pengeras suara di luar rumah) ditambahkan saat mixing, **bukan** di ElevenLabs.

**Untuk pilot S03–S06 hanya perlu: N02, N03, P01, D02** (± 230 karakter).

### 9.1 Teks bersih (opsi A: kata, urutan, dan tanda baca persis naskah v1.0)

| Segmen | Suara | L# | Teks |
|---|---|---|---|
| N01 | Dhani | L1–L3 | `Pengeras suara itu masih memakai suaramu. Kamu memilih tetap di dalam. Tapi pintu belakang belum dikunci.` |
| D01 | Zorin | L4 | `“Kak, jangan nyalain lampu…”` |
| **N02** | Dhani | **L5–L6** | `Dapur gelap. Kamu tidak bisa melihat gerendelnya. Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan.` |
| **N03** | Dhani | **L7** | `Klik. Pintu belakang terkunci.` |
| **P01** | Dhani (toa) | **L8** | `“Dapur juga tidak kosong.”` |
| **D02** | Zorin | **L9** | `“Kak… kaca di atas pintu tadi terang.”` |
| N04 | Dhani | L10 | `Lubang angin itu menghadap gang.` |
| D03 | Zorin | L11 | `“Dia lihat dari belakang juga?”` |
| N05 | Dhani | L12–L13 | `Kamu tidak bisa memastikannya. Ponselmu bergetar. Pesan dari petugas keamanan.` |
| N06 | Dhani | L14 | `“Saya sudah di depan rumah tujuh. Buka pintunya.”` |
| D04 | Zorin | L15 | `“Itu Pak satpam, kan?”` |
| N07 | Dhani | L16–L18 | `Sebelum kamu sempat menjawab, terdengar tiga ketukan. Dari pintu belakang. Pintu yang baru saja kamu kunci.` |
| N08 | Dhani | L19 | `Kamu akan mengintip ke arah pintu depan untuk memastikan siapa di sana, atau tetap diam bersama adikmu?` |

### 9.2 Teks dengan audio tags (opsi B: kata sama dengan 9.1, ditambah `[tag]`)

Tag deskriptif berbahasa Inggris seperti contoh resmi. Tag yang tidak dikenali bisa diabaikan atau ikut terucap, jadi setiap take harus didengar.

- **N01** (Dhani): `[low, uneasy] Pengeras suara itu masih memakai suaramu. [quiet, steady] Kamu memilih tetap di dalam. [tense, slower] Tapi pintu belakang belum dikunci.`
- **D01** (Zorin): `[whispers, scared] “Kak, jangan nyalain lampu…”`
- **N02** (Dhani): `[quiet, tense, low voice] Dapur gelap. Kamu tidak bisa melihat gerendelnya. [careful, hushed] Kamu menyalakan senter ponsel dan menutupinya dengan telapak tangan.`
- **N03** (Dhani): `[hushed, short] Klik. [quiet relief, low voice] Pintu belakang terkunci.`
- **P01** (Dhani): `[short breath] [flat, calm, formal announcement, slightly hoarse] “Dapur juga tidak kosong.”`
- **D02** (Zorin): `[whispers, scared, holding her breath] “Kak… kaca di atas pintu tadi terang.”`
- **N04** (Dhani): `[low, uneasy] Lubang angin itu menghadap gang.`
- **D03** (Zorin): `[whispers, frightened question] “Dia lihat dari belakang juga?”`
- **N05** (Dhani): `[quiet, unsure] Kamu tidak bisa memastikannya. [slightly quicker, tense] Ponselmu bergetar. Pesan dari petugas keamanan.`
- **N06** (Dhani): `[dry, close, reading a text message, flat] “Saya sudah di depan rumah tujuh. Buka pintunya.”`
- **D04** (Zorin): `[whispers, hopeful but scared] “Itu Pak satpam, kan?”`
- **N07** (Dhani): `[quick, tense] Sebelum kamu sempat menjawab, terdengar tiga ketukan. [slow, heavy] Dari pintu belakang. [quiet, chilling] Pintu yang baru saja kamu kunci.`
- **N08** (Dhani): `[calm, clear, asking the listener directly] Kamu akan mengintip ke arah pintu depan untuk memastikan siapa di sana, atau tetap diam bersama adikmu?`

**Serah terima file (satu-satunya cara):** setelah mendengarkan dan memilih take (setiap generasi v4 menghasilkan dua item, `v4` dan `v4_exp`), **unduh take yang dipilih** ke `_media/2026-11-003/audio/vo_raw/` dengan nama persis:
- `2026-11-003_vo_N02_take01.mp3`
- `2026-11-003_vo_N03_take01.mp3`
- `2026-11-003_vo_P01_take01.mp3`
- `2026-11-003_vo_D02_take01.mp3`

History API tidak bisa dipakai untuk mengenali segmen, karena item v4 di history tidak menyimpan teks dan nama suara (dicek 2026-11-18), dan N03 serta P01 sama-sama kalimat pendek Dhani.

## 10. Storyboard v0.5 + pilot S03–S06 (2026-11-18, D-039)

**Keputusan pemilik atas look-dev v3 ([[DECISION-LOG#D-039]]):**
1. Look-dev dapur **disetujui** untuk lanjut ke pilot.
2. S03 memakai varian **(i) lensa 40°**.
3. S05: Uq berpaling ke arah **depan rumah** (asal suara toa), bukan ke kaca atau adik. Senter mati saat ia tersentak di awal kalimat toa. Ekspresinya berubah dan terbaca, dalam batas desain C1.
4. Genggaman ponsel memakai **g2** (jari mengait). Desain C1 tidak diubah.

### 10.1 Perubahan storyboard (hanya storyboard, belum dirender)

- **S02 (pegangan kusen pindah sisi):** adik berhenti di **sisi timur** mulut lorong (x ± −0,5; z −0,95). Ia berpegangan pada **kusen timur** dengan **tangan kanan**, dan jaket tetap tersampir di lengan bawah kanan. Tangan kiri bebas, dipakai untuk menunjuk di S06. Kamera S02 tidak berubah.
- **S05 (diganti):**
  - kamera dari lorong, di sisi barat garis, ± 2,5 m dari kepala Uq, lensa panjang fov 20 → 19;
  - awal shot: Uq membelakangi kamera, telapak kanan menutup senter, pintu tersorot hangat;
  - saat toa mulai: Uq tersentak (bahu naik 1,8 cm, kepala menyentak), ibu jari kiri mematikan senter, lalu badan berputar 115° dan kepala 45° ke arah **depan rumah**;
  - wajah berakhir menghadap kamera ± 15°, alis naik dan mulut "o";
  - wajah diterangi cahaya dingin dari ruang tamu di ujung lorong, bukan cahaya bocor senter (senter sudah mati).
- **S07 (adik bergeser ke barat):**
  - Uq sudah menghadap selatan sejak S05, jadi aksi "berbalik 180°" (uji B) tidak dipakai lagi;
  - L10: Uq menoleh ke belakang, mendongak ke kaca;
  - L11–L12: Uq berjalan kembali ke mulut lorong;
  - sambil Uq mendekat, adik melangkah ± 0,6 m ke **barat** (x −0,5 → ± −1,1), sehingga saat Uq berhenti menghadap selatan, adik berada di **sisi kanan** Uq (barat);
  - genggaman S11–S12 (kanan Uq ↔ kiri adik) tetap seperti §3.4;
  - uji gerak: langkah samping adik + Uq berhenti (pengganti uji B).
- **§3.4 (genggaman):** baris S05 kini: telapak kanan menutup senter → tersentak → ponsel dan kedua tangan tetap di depan dada saat berputar.

### 10.2 Pilot S03–S06 — status: ~~MENUNGGU AUDIO~~ (riwayat; VO masuk 2026-11-18, lihat §10.3)

**Pemblokir:** voice-over belum ada.
- Akun ElevenLabs masih `free` (dicek read-only 2026-11-18). API tidak bisa memakai suara Dhani/Zorin (D-023), dan history akun tidak berisi item Ep 2.
- Paket teks + tag ada di §9. Pilot perlu **N02, N03, P01, D02**.
- Karena pemilik meminta "waktu shot mengikuti audio", MP4 pilot belum dirender ke `_media/2026-11-003/out/pilot_v1/`. Folder itu belum dibuat dan tidak ada file yang ditimpa.

**Yang sudah selesai (kode, cek angka, pratinjau internal tanpa suara):**
- `studio/src/ep003/pilot003Stage.ts`: `stageAt(t)`, fungsi murni waktu. Komposisi dan alat cek membaca data yang sama. Semua waktu aksi diturunkan dari waktu kalimat di `pilot003-plan.json`.
- `studio/src/ep003/Pilot003.tsx`: komposisi `Pilot003`, empat shot, subtitle gaya Ep 1. Label "TIMING SEMENTARA" muncul selama plan masih estimasi.
- `scripts/ep003_pilot_audio.py`:
  - `plan`: VO → waktu kalimat (silence detection) → plan. Jeda editorial dipakai agar sapuan ≥ 3 s dan dua langkah muat sebelum "Klik".
  - `mix`: stem VO + efek toa luar rumah + SFX pada beat gambar + −14 LUFS + cue sheet. Menolak menimpa.
  - Mekaniknya diuji dengan VO Ep 1 sebagai pengganti; hasil uji −14,1 LUFS, peak −1,3 dBFS, dan semuanya dibuang.
- `studio/tools/p003_check.ts` (cek angka per frame), `p003_beats.ts`; skrip `npm run render:pilot003`.
- Pratinjau internal tanpa suara dengan timing estimasi (558 frame, 18,6 s), **bukan deliverable**: `%USERPROFILE%\AppData\Local\Temp\claude\5586fdf7d222076f\5a7c0337-2a13-4a52-a125-144a76dfca12\scratchpad\p3k\pilot003_provisional_silent.mp4`.

**Cek angka (timing estimasi; dijalankan ulang sesudah audio ada):**

| Pemeriksaan | Hasil |
|---|---|
| Lompatan sudut sendi > 15°/frame (di luar potongan) | tidak ada (maks 8,9°/frame) |
| Lengan di dalam torso | S03 maks 1,3 cm (ayunan jalan Ep 1); S04–S06 maks 0,7 cm |
| Siku (b: bukan selang lurus) | S04 kanan 78–102°, kiri 131°; S05 kanan 102°, kiri 131° |
| Telapak kanan → kenop gerendel saat mendorong | ≤ 0,8 cm |
| Jarak tubuh (radius sampel konservatif) | tidak ada tembus nyata. Di S04, sampel lengan bawah kanan ≤ 0,7 cm di dalam kotak gerendel/daun pintu saat tangan memegang kenop (kontak disengaja; radius sampel 3 cm, radius lengan sebenarnya ± 1,7 cm). Adik 3,9 cm (jaket ↔ dinding timur) |
| Kedip luma (lonjakan 1 frame > 4/255) | tidak ada di 558 frame |
| Kaca saat sapuan (a) | dingin 78/91/140 → naik dalam 3 frame → 163/158/178 selama ± 1,0 s → turun dalam 3 frame. Tanpa lonjakan per frame |
| Arah pandang S05 → S06 (keputusan 3: bukan ke adik) | akhir S05: wajah Uq 28° dari lensa, **41° dari kepala adik, 20° dari arah pintu depan**, kepala menengadah 22° (toa = pengeras suara di luar, tinggi). S06: pandangan adik 4° dari kaca, 22° dari lensa, elevasi 18° vs lensa 2° (memandang di atas lensa, ke kaca) |

**Ditemukan dan diperbaiki saat membangun pilot:**
1. Pegangan samping g2 dari still a v3 ternyata menaruh lengan bawah **5,3 cm di dalam kaos**: lengan "keluar dari badan" (lesson 2026-11-17). Diganti pose lengan menggantung [12°, 35°, 75°] (0,2 cm). Still a look-dev v3 punya cacat yang sama dan tidak dirender ulang.
2. Perpindahan lengan kanan dari ayunan jalan ke telapak di senter sempat melompat 26–39°/frame karena IK berganti cabang. Kini diinterpolasi di ruang sudut lalu masuk IK.
3. Insert S04 dari kamera v2: kepala Uq menutup sepertiga bingkai dan ponsel menutup kenop. Kamera dipindah ke dekat bidang pintu di ujung timur meja dapur, dan ponsel diturunkan 15 cm selama dua langkah.
4. S05: lampu rim karakter membuat pintu tetap hangat sesudah senter mati, sehingga senter mati tidak terbaca. Rim dimatikan di S05.
5. Kedipan mata jatuh tepat di wajah reaksi. Seed kedip kini dipilih agar tidak berkedip selama wajah reaksi tampil.
6. S06: tangan adik yang menunjuk ke kaca mengarah ke lensa dan terbaca sebagai "tangan di pipi". Arah tunjuk dinaikkan ± 60°.
7. **Tanda `headNod` terbalik.** Di C1, nilai + berarti menunduk dan − berarti menengadah (Rx memiringkan +z ke bawah; Ep 1 memakai −14 untuk adik menengadah). Saat dibangun, wajah Uq di akhir S05 menunduk. Kini semua anggukan dibalik dan alat cek menghitung elevasi dengan tanda yang benar. Catatan: look-dev v3 (still `glass`/S05) memakai tanda lama, jadi "menengadah" di sana sebenarnya sedikit menunduk.
8. S05: wajah sempat hampir frontal ke lensa (± 15°), sehingga potongan ke adik terbaca "saling pandang". Kini putaran total 150°, wajah 28° dari lensa ke sisi pintu depan, kepala menengadah, dan mata bergeser ke arah yang sama.

**Kelemahan yang sudah terlihat di pratinjau (sebelum audio):**
1. **S03 panjang (± 9,5 s dengan timing estimasi) dan Uq kecil di bingkai.** Bentuk ini mengikuti pilihan (i) lensa 40°. Gerak di dalam shot: Uq berjalan, sapuan, dua langkah, dan dolly 0,25 m. Durasi final mengikuti audio.
2. **S04:** lengan bawah kanan tampak panjang dari kanan bawah ke kenop. Sikunya tertekuk (78–102°), tetapi dari sudut ini hampir hanya lengan bawah yang terlihat.
3. **S06:** tangan NPC berbentuk oval (desain D-026), jadi "menunjuk" terbaca sebagai "mengangkat tangan ke atas", tanpa jari telunjuk.
4. **S05:** arah depan rumah dan arah adik sama-sama ke selatan. Pemisahnya: wajah 41° dari adik dan menengadah. Belum diuji pada kecepatan normal dengan suara.
5. **Kaca naik ke terang dalam 0,1 s**, karena sorot sempit (0,25 rad) yang bergerak cepat. Tidak berkedip, tetapi tepinya tajam.
6. **Durasi pilot ± 19–22 s, bukan ± 15 s.** Penyebabnya: sapuan minimal 3 s ditambah dua langkah harus selesai sebelum "Klik", sehingga L7 baru mulai ≥ 5,8 s sesudah awal L6. Uji VO pengganti: 21,8 s; timing estimasi: 18,6 s. **Opsi lebih ketat (keputusan pemilik):** sapuan ± 2,4 s dan langkah 0,8 s menghemat ± 0,8 s. Belum diterapkan.
7. **Kontinuitas S02 → S03:** S02 v0.5 menempatkan tangan kanan adik di kusen timur, tetapi di S03 pilot adik berdiri dengan pose preset (tangan tidak di kusen). Perlu diselaraskan saat S02 dibuat.
8. **Pegangan g2 di still a v3 yang disetujui** menaruh lengan bawah 5,3 cm di dalam kaos. Pilot memakai pose pengganti; still itu sendiri tidak diubah.

**Sesudah VO ada (urutan kerja):**
1. `python scripts/ep003_pilot_audio.py plan`
2. `node out/p003_check.cjs --keys` (cek ulang)
3. `python scripts/ep003_pilot_audio.py mix` (menulis `_media/2026-11-003/audio/pilot/2026-11-003_pilot_v1_mix.wav`)
4. `mkdir _media/2026-11-003/out/pilot_v1`, lalu `npm run render:pilot003` (render + mux, menolak menimpa)
5. QC: ffprobe, contact sheet, strip per frame (sapuan, gerendel), crop tangan 1:1, LUFS/peak, perbandingan target gaya.

**Sumber suara di mix (rencana; Claude tidak bisa mendengar, semua = kandidat):**
- **Suasana malam:** jangkrik + room tone **sintesis Claude dari Ep 1** (`_media/2026-11-002/sfx/`). Koleksi `refrences/SFX` tidak punya suara jangkrik atau malam.
- **Klik senter:** `1 Click Mouse.mp3`, low-pass. **Gerendel:** `Shutter 5Dm4.mp3` + `Hit 3.mp3` pelan (dari koleksi).
- **Toa:** rantai efek pengeras suara luar rumah (pita horn, soft clip, teredam dinding, dua pantulan 170/390 ms), ditambah dengung toa sintesis Ep 1.
- Belum ada yang didengar.

Skill: `video-production` (§9, §12, §13), `inkbeat-shorts` (camera-and-editing, characters, audio-and-voice), `threejs-lighting` (spot, decay), `remotion-render` (render CLI).

### 10.3 Pilot S03–S06 v1 dengan audio (2026-11-18) — MENUNGGU TINJAUAN PEMILIK

**Berkas:** `_media/2026-11-003/out/pilot_v1/`
- MP4 `pilot_2026-11-003_s03-s06_v1.mp4`
- lembar QC `QC_pilot_v1.md` (kelemahan terbesar lebih dulu)
- contact sheet 2 fps, strip sapuan dan gerendel, crop tangan 1:1, `ffprobe.json`, `loudness.txt`

Mix: `_media/2026-11-003/audio/pilot/` (mix, stem, cue sheet). Semua SFX berstatus kandidat.

**Skill:** `video-production` (§9, §11–§13), `inkbeat-shorts` (render-and-qa, audio-and-voice, characters, camera-and-editing), `threejs-lighting`, `remotion-render`.

**Durasi aktual dari audio asli (tidak dipangkas):**

| Shot | Durasi |
|---|---:|
| S03 | 9,28 s |
| S04 | 3,56 s |
| S05 | 3,94 s |
| S06 | 4,13 s |
| **Total** | **20,91 s** (627 frame) |

Kalimat: L5 0,60–3,90 · L6 4,18–7,72 · L7 9,98–12,64 · L8 14,38–16,33 (napas toa mulai 13,29) · L9 17,03–20,11.

**Audio**
- File final: −14,1 LUFS, sample peak −1,0 dBFS, true peak −1,0 dBTP. Tidak ada hening > 0,4 s.
- Tag yang ikut terucap: dari pengukuran sinyal tidak ada indikasi. Setiap blok suara terpetakan ke teks, dengan laju 4,1–5,8 suku kata/s. **Ini bukan hasil mendengarkan**; pemilik tetap harus mendengar.
- Opsi A/B: **UNKNOWN** (isian pemilik kosong). Napas di awal P01 cocok dengan tag `[short breath]`.

**Perubahan kode**

*`scripts/ep003_pilot_audio.py`*
- Napas tak bersuara di awal P01 dipisah dari onset kata (`pre`). Sentakan Uq dan subtitle L8 mulai di kata "Dapur".
- `bursts` per kalimat dipakai untuk waktu subtitle.
- Stem dan premaster disimpan sebagai float 32-bit (N03 +1,5 dBFS sempat terpotong di 24-bit).

*`studio/src/ep003/pilot003Stage.ts`*
- Adik di x −0,62, tangan kanan di kusen timur (−0,235; 0,66; −0,97).
- Kamera S03 dipan (look x −1,4 → −0,85).
- **Kamera S06 baru** `S06_LENS` (−1,45; 1,05; 1,2) menghadap utara, sehingga kaca masuk bingkai. Kamera D-038 menghadap selatan, jadi kaca berada di belakang lensa.
- Lengan tunjuk hampir lurus ke kaca (siku 151°) dengan trik kamera `POINT_CHEAT` 0,5 (garis lengan di layar tetap menuju kaca), dan kepala ke kaca.
- Angkat lengan di ruang sudut. Versi IK sebelumnya melompat 46,6°/frame; sekarang maksimum 9,1°/frame dan 0 cm di torso.
- Dorongan pada kata "kaca" hanya ± 1 cm, kemungkinan tidak terlihat.
- S06: lampu karakter diredupkan (`charK` 0,35, `rimK` 0), karena dinding di sebelah adik sempat terbakar putih.

*`studio/src/ep003/Pilot003.tsx`*
- Subtitle per kelompok kalimat di atas burst suara masing-masing. Sebelumnya "PINTU" muncul ± 0,7 s sebelum diucapkan.

*`studio/tools/p003_check.ts`*
- Sampel jaket memakai geometrinya sendiri.
- Ditambah cek telapak → kusen, lengan tunjuk (sudut siku, panjang di layar, selisih arah ke kaca), posisi kaca/kepala/tangan di bingkai S06, lengan dan kepala adik per frame, serta arah wajah Uq di S06.

**Uji P1–P8:** tabel di `QC_pilot_v1.md` §6b.
- P4 (kaki tidak meluncur) belum diuji secara numerik.
- P5 berubah oleh D-040.
- P7 tidak berlaku lagi.

**Usulan yang perlu keputusan pemilik:**
1. Kamera S06 baru menggantikan kamera D-038 (x −1,15, dari dapur ke selatan). Akibatnya wajah adik tidak terlihat di S06. Opsi lain ada di QC §4 (a–c).
2. Pan S03 4,2°: adik pindah dari tepi kanan ke kanan-tengah, ukuran tetap.
3. Adik bergeser 12 cm ke barat (x −0,62).

**Kelemahan terbesar:** lihat `QC_pilot_v1.md` §1.
- Pembukaan S05 1,6 s hanya memperlihatkan bagian belakang kepala.
- Wajah adik tidak terlihat di S06.
- S03 panjang, dan subtitle menumpuk di kepala adik.
- Insert S04 diam ± 2,5 s sesudah klik.
- Tidak ada SFX langkah.

## 11. Pilot S03–S06 v2 (2026-11-18): insert kaca, kilas balik S06, SFX baru — MENUNGGU TINJAUAN PEMILIK

**Dasar:** catatan pemilik atas v1. Saat adik berkata "kaca di atas pintu tadi terang" (S06), penonton belum punya dasar visual: kaca di S03 hanya ± 5 % bingkai dan menyala terlalu singkat.
- Naskah **tidak berubah**.
- Cahaya kaca hanya dari senter Uq, tanpa cahaya dari luar.
- D-040 (kamera S06, pan S03, posisi adik) **belum diputuskan**. v2 memakai nilai v1 sebagai sementara.
- Keputusan baru: [[DECISION-LOG#D-041]] (pending).

**Berkas:** `_media/2026-11-003/out/pilot_v2/`. v1 tidak ditimpa.
- MP4 `pilot_2026-11-003_s03-s06_v2.mp4`
- `QC_pilot_v2.md` (kelemahan terbesar lebih dulu)
- contact sheet, strip tiap frame insert S03 dan kilas balik S06
- `ffprobe.json`, `loudness.txt`, `tabel_sfx_v2.csv`, `sfx_analysis/`

**Skill:** `video-production` (§2, §9, §11–§13), `inkbeat-shorts` (camera-and-editing, render-and-qa, audio-and-voice), `threejs-lighting`, `threejs-materials`, `remotion-markup`, `remotion-render`.

**Visual**
1. **Insert S03 (S03i), 5,97–7,03 s (1,07 s).**
   - Lensa di belakang-kiri Uq, 1,8 m dari kaca, fov 40°, 0,38 m di barat garis adik–Uq.
   - Kaca 13,8 % luas bingkai (lebar 65,5 %, tinggi 24,5 %; diproyeksikan), di atas pita subtitle. Di S03 lebar 0,87 % (tinggi 5,5 %).
   - Tahan sorot di kaca diperpanjang dari 0,36 s menjadi 0,72 s, dengan mengubah pecahan sapuan. Panjang sapuan tidak berubah.
   - Selama tahan, titik bidik bergeser 6 cm (tangan yang mencari).
   - Bukti cahaya hanya dari senter: frame yang sama tanpa senter memberi kaca L* 22 dan R/B 0,55; dengan senter L* 54 dan R/B 1,35.
2. **Material kaca v2 `vent="lit2"`** (albedo lebih hangat, cahaya dingin 0,2). Dengan material v1, kaca yang kena senter tampak ungu pucat (R/B 0,92; frame insert f195, area kaca yang sama) dan bisa terbaca sebagai cahaya dari luar. **Perubahan tampilan ini perlu persetujuan pemilik.** Material v1 tidak berubah.
3. **S06, opsi A (dipasang):**
   - S06 lebar selama "Kak… kaca di atas pintu";
   - lalu kilas balik insert S03 pada "tadi terang" (19,60–20,40 s): saturasi 0,55, vinyet, lonjakan terang 3 frame (puncak 0,08; render pertama 0,28 terlalu kuat dan diturunkan);
   - lalu lensa yang sama pada waktu sekarang, kaca gelap sampai akhir (20,40–21,47 s).
   - Waktu "tadi" adalah **perkiraan** dari jumlah huruf.
   - Opsi B/C dan pembeda lain ada di `QC_pilot_v2.md` §5.
4. **Garis 180°:** semua lensa (termasuk insert, kilas balik, dan kaca gelap) berada di **barat** garis adik–Uq, 0,38–1,00 m (tabel di QC §6).
5. **Gerendel di gambar** kini mendarat pada "Klik" yang terdengar (10,115 s; v1 9,977 s, 4 frame lebih awal dari suara).
6. **Batas potongan v2 dibulatkan ke frame utuh.** Di v1 frame pertama setiap shot masih menampilkan shot sebelumnya.

**Dampak durasi:** 20,915 s → **21,465 s (+0,55 s)**.
- Insert dan kilas balik memakai audio yang sudah ada: +0 s.
- Celah L7 → toa 0,65 → 1,20 s untuk pembuka toa: +0,55 s. Tambahan ini jatuh di pembukaan S05 (punggung kepala ± 2,1 s).
- Tidak ada bagian lain yang dipangkas.

**Audio**
- Hasil: −14,2 LUFS, **true peak −2,3 dBTP** (v1 −1,0), tanpa hening > 0,4 s.
- Pilihan sementara (dari sinyal, bukan telinga) di `scripts/ep003_pilot_sfx.json`:
  - suasana malam #3;
  - langkah #2 (7 tapak kaki dari frame);
  - gerendel #3 (satu-satunya tanpa klik susulan);
  - ketukan ponsel #1 (hanya saat senter menyala);
  - pembuka toa #4 (0,10 s sebelum napas P01).
- Analisis 32 file dan lisensi: [[sfx-pustaka]]. Keempat variasi tiap jenis berbeda isi.
- Gumam warga **tidak dipakai**; skrip menolak file itu.
- **Ganti variasi:** ubah angka di config, lalu jalankan `mix2` dan mux dari MP4 v2 yang sudah jadi. Gambar tidak dirender ulang.
- Bed di speaker ponsel mungkin nyaris tak terdengar: energinya < 1 kHz, dan sesudah HPF 300 Hz jeda −40…−47 dB (OBSERVATION).
- ~~Limiter di "Klik" 4,3 dB. Plosif adik ditekan sampai 14,6 dB (5 ms). Pemilik perlu mendengar.~~ **Salah ukur** (latensi limiter tidak dihapus). Angka benar: maks 5,2 dB di "Klik", plosif adik ≤ 2,0 dB. Lihat §12 dan [[DECISION-LOG#D-042]].
- Perbandingan material kaca: `banding_material_kaca_f195.jpg`.

**Temuan baru:** P4 (kaki tidak meluncur) **gagal**. Pada 8,30–8,48 s kaki meluncur 7,7–12,0 cm tanpa terangkat (campuran kaki di awal dua langkah, sama dengan v1). Tidak diperbaiki di v2; usulan perbaikan ada di QC §1.

**Perubahan kode** (semua aditif; v1 dicek identik per frame lewat dump `stageAt` 627 frame):
- `studio/src/ep003/pilot003Stage.ts`: factory `buildPilot003(plan, Variant)` dengan `V1` dan `V2`; shot `s03i`/`s06f`/`s06d`; `CUTS`, `flashTime`, `SW`.
- `studio/src/ep003/pilot003V2.ts` dan `pilot003-plan-v2.json`.
- `Pilot003.tsx`: komposisi `Pilot003v2`, grade kilas balik, probe `noTorch`.
- `Root.tsx` dan npm `render:pilot003v2`.
- `ep002/sets.tsx`: `vent="lit2"`.
- `tools/p003v2_beats.ts` (tapak kaki, slip kaki, sisi 180°) dan `tools/p003_check.ts v2`.
- `scripts/ep003_pilot_audio.py`: `plan --toa-gap --klik`, `mix2`.
- `scripts/ep003_pilot_sfx.json`, `scripts/sfx_variants_analyze.py`.

Status konten tetap `scripted`. `approved-by-owner` tetap `false`.

## 12. Pilot S03–S06 v3 (2026-11-18) — MENUNGGU TINJAUAN PEMILIK

**Keputusan pemilik atas v2 (2026-11-18):**
- [[DECISION-LOG#D-040]] **disetujui**: kamera S06 menghadap utara, pan S03 4,2°, adik x −0,62 dengan pegangan kusen setinggi pinggang.
- [[DECISION-LOG#D-041]]: material kaca `lit2` **disetujui**; kilas balik opsi A **disetujui**; +0,55 s sebelum toa **ditolak**.
- Pilihan SFX setelah didengar: **belum**. Baris pemilik masih berupa templat, jadi variasi v2 tetap dipakai.

**Berkas:** `_media/2026-11-003/out/pilot_v3/`
- MP4, `QC_pilot_v3.md` (kelemahan terbesar lebih dulu), contact sheet
- strip insert, kilas balik, dan langkah kaki
- `ffprobe.json`, `loudness.txt`, `tabel_sfx_v3.csv`

**Skill:** `video-production`, `inkbeat-shorts` (characters, camera-and-editing, render-and-qa, audio-and-voice), `threejs-animation`, `remotion-markup`, `remotion-render`.

**Hasil (rincian di QC v3):**
1. **Kaki: P4 lulus.** Di v1/v2 akar tubuh Uq melompat 31 cm ke belakang di 8,23 s (f247; jalan pertama berhenti di z −4,124, langkah kedua mulai di −3,8), dan kaki meluncur 7,7–12 cm. Kini ada tiga langkah terangkat dari pose berhenti yang sebenarnya.
   - geser kaki saat menapak ≤ 0,01 cm;
   - akar tubuh maks 3,5 cm/frame;
   - tapak kaki 8,558 · 8,908 · 9,208 s.
2. **S05:** celah kembali 0,65 s, sehingga total 20,915 s (sama dengan v1). Pembuka toa di atas ekor N03 mulai 12,489 s. S05 dipotong masuk pada bunyi itu, dan Uq tersentak, mematikan senter, lalu berputar.
   - Wajah terbaca ± 13,4 s, yaitu ± 1,0 s sebelum "Dapur".
   - Belakang kepala ± 0,9 s (v2 2,1 s).
   - **Perlu konfirmasi:** sentakan dan senter mati kini terjadi pada bunyi toa menyala, bukan pada kata pertama toa (D-039).
3. **Insert kaca lebih lebar:** daun pintu, kusen atas, dan kaca; kaca 10,7 % bingkai. Sorot naik masuk ke kaca dalam ± 10 frame. Insert 1,4 s. Kilas balik dari footage yang sama, mulai 0,3 s sebelum sorot mencapai kaca.
4. **Bed:** shelf +8 dB @2 kHz, level diatur di pita ≥ 300 Hz (VO − 22 dB). Di pita ponsel jeda −42…−45 dB (v2 −44…−47). Masih pelan; perlu didengar di ponsel.
5. **Plosif:** HPF 90 Hz hanya pada adik. Limiter (latensi dihapus) maks 5,2 dB di "Klik"; plosif adik ≤ 1,5 dB. **Koreksi:** angka 14,6 dB di QC v2 salah ukur.
6. **S04:** lengan bawah seperti selang dan tepi kepala terpotong, dicatat dan belum diperbaiki.

**Kode (aditif; v1 dicek identik per frame lewat dump `stageAt`):**
- `pilot003Stage.ts`: Variant `steps`/`toaReact`/`ins`, `VAR3`, `liftedSteps`.
- `pilot003V3.ts` dan `pilot003-plan-v3.json`.
- Komposisi `Pilot003v3` dan npm `render:pilot003v3`.
- `scripts/ep003_pilot_audio.py`: `plan --toa-open-lead`; `mix2 --version v3` (de-plosive adik, shelf + level pita ponsel untuk bed, patokan RMS, `limiter_gr` dengan latensi dihapus).
- `tools/p003v2_beats.ts v3`, `tools/p003_check.ts v3`, `tools/p003v2_glass.ts v3`.

Status konten tetap `scripted`; `approved-by-owner` tetap `false`.

## 13. Episode penuh S01–S12 — draft render v1 (2026-11-18) — MENUNGGU TINJAUAN PEMILIK

**Dasar:** pilot v3 disetujui sebagai patokan kualitas, sentakan pada bunyi toa disetujui, dan variasi SFX ditetapkan ([[DECISION-LOG#D-042]]). Keputusan episode: [[DECISION-LOG#D-043]] (pending). Naskah v1.0 tidak berubah. Status konten: `rendered` (draft render); `approved-by-owner` tetap `false`.

**Berkas:** `_media/2026-11-003/out/episode_draft_v1/`
- MP4 dan `QC_episode_draft_v1.md` (kelemahan terbesar lebih dulu)
- contact sheet, 6 strip per frame, crop 1:1 tangan dan "Uq", perbandingan label dengan Ep 1
- `ffprobe.json`, `loudness.txt`, tabel SFX

**Skill:** `video-production`, `inkbeat-shorts` (characters, camera-and-editing, render-and-qa, audio-and-voice), `threejs-animation`, `threejs-lighting`, `remotion-markup`, `remotion-render`.

**Gerbang VO:** 13/13 file ada, nama benar, semua MD5 berbeda.
- D03/D04 sama-sama 49 537 byte karena durasi dan bitrate CBR-nya sama; isinya berbeda (korelasi −0,06).
- Hitungan inti suku kata cocok dengan label (D03 13–14 ≈ 10 suku kata; D04 8 ≈ 6), jadi tidak tertukar.
- Status: OBSERVATION, belum didengar.

**Rangka waktu:** 67,17 s (estimasi 63–70).
- Blok pilot S03–S06 dimulai di 10,2 s (frame 306), stage per frame identik dengan pilot v3.
- Ketukan diberi jeda sendiri sesudah L15 (S10 dibuka pada ketukan pertama). Ini pilihan editorial: ± 2,4 s lebih panjang daripada ketukan yang menumpuk di bawah narasi.

**Posisi dan alasannya** (`studio/src/ep003/episode003Stage.ts`):
- **S01/S12:** posisi dan lensa A17 Ep 1 (C1_ROOM, ADIK_ROOM, lensa P). Lampu mati, gorden tertutup, tanpa kerumunan.
- **S02:** Uq berjalan di garis lorong (x −0,95); jalan pembuka bergabung dengan jalan pilot pada fase yang sama. Adik mengikuti dari belakang ke kusen timur.
- **S07–S09:** Uq di mulut lorong sisi ruang tamu (−0,65; −0,75) menghadap selatan; adik di kanannya (−1,15; −0,6). Di dalam lorong (lebar 1,2 m) jaket adik membentur dinding.
- **S10 (di luar layar):** Uq berbalik ke utara. Adik berpindah ke kanan-belakangnya (−0,25; −0,5) agar genggaman kanan Uq ↔ kiri adik mungkin di S11. Perlu konfirmasi pemilik (QC §1 butir 2).

**Kode baru:**
- `src/cast/stepper.ts`: langkah terangkat untuk berbalik, berjalan, dan mundur; tanpa geser.
- `src/ep003/episode003Stage.ts`, `Episode003.tsx` (label dua baris, kartu vertikal, UI ponsel Ep 2), `episode003-plan.json`.
- `HouseInterior backDoorShake`.
- `tools/e003_check.ts`, `tools/e003_points.ts`.
- `scripts/ep003_episode_audio.py` (`plan`, `mix`).
- npm `render:episode003`.
- Varian pilot `walk1Ext` (jalan pembuka); dump v1 dan v3 tetap identik.

**Diperbaiki sebelum render final** (dari cek arah pandang per ketukan cerita):
- adik di S01 berpaling dari Uq (tanda headYaw terbalik, 80° → 9°);
- di S12 klausa B Uq berpaling menjauhi adik (tanda Ep 1 "lihat lorong", 150° → menunduk ke sisi adik, 68°; batas geometri susunan A17);
- 0,4 s terakhir dibuat hitam sesuai naskah ("lalu potong ke hitam").

Status `rendered` dipilih sebagai nilai skema terdekat untuk "draft render" yang diminta pemilik.

**SFX:**
- variasi pemilik untuk lima jenis;
- getar #2 (dua dengung) dan ketukan #3 (tepat tiga onset; grain dengan jarak 0,9 s);
- loop suasana malam dengan sambungan di bawah L9 dan L18;
- gumam warga tidak dipakai.
- Rincian: [[sfx-pustaka]].

## 14. Draft v2 (2026-11-18) — perubahan storyboard dan spesifikasi kartu (D-043)

> Atas permintaan pemilik 2026-11-18. **Ini mengubah spesifikasi kartu yang sebelumnya disetujui** (§2.2, D-036). Teks narasi/dialog naskah v1.0 tidak berubah. Kartu di blok naskah §2 tetap tertulis seperti semula sebagai riwayat; spesifikasi yang berlaku ada di bawah ini.

### 14.1 S00 — recap pilihan Ep 1 (baru, sebelum S01), 0,00–2,10 s

| Waktu | Gambar | Suara |
|---|---|---|
| 0,00 | **Freeze** frame pertama S01. Lensa = A17 "centre" Ep 1 (P (0,75; 1,5; 2,55), look y 1,0, fov 54); pose pasangan = akhir Ep 1. Dua kartu Ep 1 **persis** ("tetap di dalam" / "keluar lewat belakang"; konstanta `Cards` Ep 1 disalin) sudah terlihat. | suasana malam |
| 0,70 | Kartu "tetap di dalam" **diklik**: membesar 1,0 → 1,1× dalam 0,1 s dari tengah, kembali dalam 0,2 s; cincin lime tipis (5 px) bertahan sampai fade | klik UI (`1 Click Mouse.mp3`, hanya transien puncak) |
| 1,75–2,10 | **Kedua kartu fade out bersamaan** (0,35 s) | — |
| 2,10 | S01 mulai bergerak; N01 mulai 2,40 s | N01 |

- **Label "HARI 1 / EPISODE 2":** muncul sesudah kartu hilang (2,35–7,00 s; in/tahan/out sama dengan Ep 1, digeser 2,10 s), sehingga tidak bertabrakan dengan kartu.
- **Freeze = frame pertama S01** (bukan frame dari MP4 Ep 1), sehingga tidak ada lompatan saat bergerak. Dibanding frame terakhir Ep 1: pose, framing, dan kartu sama (98 % piksel krem kartu di posisi sama). Gambarnya sedikit lebih gelap (L* 24,7 vs 30,4), karena rantai cahaya Ep 2 berbeda dari A17 Ep 1.

### 14.2 Kartu pilihan akhir (S12) — spesifikasi berlaku

- **Gaya `Cards` Ep 1 persis:** dua kartu berdampingan di atas (left/right 60, top 170, gap 30, padding 34/26, radius 30, border 6, bayangan, Poppins 800 54 px, line-height 1,12; masuk: fade 0,35 s, kartu kedua 0,2 s kemudian). Tanpa label A/B dan tanpa judul.
- **Teks:** "intip pintu depan" / "tetap diam bersama adik". Keduanya muat dalam 2 baris; tinggi kartu sama dengan Ep 1 (bagian krem 188 px, y 176–364).
- **Waktu:** masuk 0,3 s sesudah L19 mulai; bertahan sampai akhir (± 2,1 s sesudah narasi), lalu 0,4 s hitam ("potong ke hitam", tetap sesuai naskah; Ep 1 tidak memakai ini).
- **Dua dentuman bass ("doom… dooom"):**
  - dentuman 1 = `sfx-19_kick-boom_low_impact.wav` dengan saturasi ringan, saat kartu pertama masuk;
  - dentuman 2 = kick-boom yang sama di atas ekor `Sub Drop 2.mp3`, juga disaturasi, 0,7 s kemudian dan lebih panjang.
  - Kandidat lain (Deep Hit 1–3, Sub Drop, Impact & Subdrop, Dramatic Impact) memiliki 82–100 % energi di bawah 80 Hz, sehingga hampir tidak terdengar di speaker ponsel.
  - Jarak 0,7 s antar dentuman tidak terikat ke kartu kedua (yang tetap 0,2 s, gaya Ep 1).

### 14.3 Ketukan dan S10 (dirapatkan)

- Ketukan pertama 0,1 s sesudah D04 berakhir (seolah memotong). Ketiga ketukan berselang 0,75 s; N07 mulai 0,35 s sesudah ketukan ketiga.
- S10 kini berakhir di "Dari pintu belakang" (potong ke S11) dengan dorong kamera pelan sepanjang shot: **5,77 s** (v1 7,87 s).

Draft v2: `_media/2026-11-003/out/episode_draft_v2/` (QC di sana).

## 15. Final v1 dan persiapan publikasi (Stage 9) — 2026-11-18 — MENUNGGU PERSETUJUAN PEMILIK

**File final:** `_media/2026-11-003/out/episode_2026-11-003_final_v1.mp4` (pola nama sama dengan Ep 1). QC: `_media/2026-11-003/out/final_v1_qc/QC_final_v1.md`.

- `approved-by-owner` tetap `false` sampai pemilik menyetujui file ini.
- Tidak ada upload atau publikasi oleh Claude. Unggah dilakukan pemilik secara manual.

**Perubahan dari draft v2** ([[DECISION-LOG#D-044]]):
- ekor hitam dihapus;
- dua dentuman bass dipindah ke sesudah L19: 0,25 s sesudah suku kata terakhir selesai, lalu 0,7 s kemudian;
- kartu bertahan sampai ekor dentuman kedua habis. Durasi total **69,45 s** (draft v2 68,20 s).

### 15.1 Judul dan caption

Hook diambil dari kejadian yang benar-benar ada di video (pintu belakang dikunci, lalu tiga ketukan dari pintu itu). Tanpa janji yang tidak ditepati.

**YouTube Shorts**
- **Judul:** Pintu Belakang Sudah Kamu Kunci. Lalu Ada Tiga Ketukan | Episode 2
- **Deskripsi:**
  > Lanjutan Episode 1: kamu memilih tetap di dalam bersama adikmu. Dapur gelap, pintu belakang belum dikunci… lalu pengeras suara itu bicara lagi.
  > Kalau kamu, intip pintu depan atau tetap diam bersama adik? Tulis pilihanmu di komentar.
  > Cerita fiksi. Animasi 3D buatan sendiri. Narasi memakai suara AI.
  > #Shorts #ceritafiksi #animasi3d #misteri

**Instagram Reels**
> Episode 2 · Pintu belakang sudah kamu kunci. Lalu ada tiga ketukan.
> Lanjutan dari pilihan "tetap di dalam" di Episode 1.
> Intip pintu depan, atau tetap diam bersama adik? Tulis di komentar.
> Cerita fiksi · animasi 3D · suara AI
> #ceritafiksi #animasi3d #misteri

**TikTok** (baris pertama berfungsi sebagai judul)
> Episode 2: pintu belakang sudah kamu kunci… lalu ada tiga ketukan
> Lanjutan Episode 1 (kamu memilih tetap di dalam). Intip pintu depan atau tetap diam bersama adik? Jawab di komentar.
> Cerita fiksi · animasi 3D · suara AI
> #ceritafiksi #animasi3d #misteri #whatif

**Catatan:**
- Ajakan memilih bersifat terbuka. Komentar boleh menjadi masukan, tetapi tidak dijanjikan menentukan episode berikutnya (D-035 butir 4).
- Hashtag sengaja sedikit dan sama dengan Ep 1 (konsistensi seri).
- Kata "Episode 2" dan rujukan ke Episode 1 ada di semua platform.
- Bila judul memerlukan "elevenlabs.io", lihat checklist butir 2.

### 15.2 Sampul / cover (usulan; dipilih pemilik)

File kandidat ada di `_media/2026-11-003/upload/` (`sampul_kandidat_A_recap_f0.png`, `…_B_pintu_f1475.png`, `…_C_kaca_f560.png`), diambil dari frame final. A dan B tanpa subtitle:

| Kandidat | Frame | Isi | Catatan |
|---|---|---|---|
| **A (usulan utama)** | recap 0,0 s | Uq dan adik di ruang tamu dengan dua kartu Ep 1 ("tetap di dalam" / "keluar lewat belakang") | Langsung terbaca sebagai lanjutan; kartu Ep 1 menjelaskan pilihan sebelumnya |
| B | S10, di antara ketukan | Pintu belakang gelap dengan gerendel | Paling misterius, tetapi gelap; di ukuran kecil bisa kurang terbaca |
| C | S03 insert kaca (f560) | Kaca di atas pintu tersinari senter | Visual khas episode ini; tanpa tokoh. **Memuat subtitle** ("DENGAN TELAPAK TANGAN."), karena insert ini selalu jatuh di atas narasi L6. Versi tanpa subtitle perlu still terpisah bila dipilih. |

### 15.3 Label konten AI per platform

Rangkuman di bawah adalah catatan Ep 1 (cek 2026-11-17, sebagian dari sumber pihak ketiga; halaman bantuan TikTok/Instagram **tidak** dibaca langsung). Tidak dicek ulang hari ini, jadi **status = UNKNOWN untuk aturan terbaru**. Pemilik atau sesi berikutnya perlu membaca halaman resmi sebelum tayang.

| Platform | Yang tercatat (2026-11-17) | Status | Usulan |
|---|---|---|---|
| YouTube | Animasi yang jelas tidak realistis tidak wajib label "konten sintetis"; narator AI generik = wilayah abu-abu (pihak ketiga) | **UNKNOWN** (aturan terbaru belum dicek) | Sebut "suara AI" di deskripsi (sudah ada); toggle mengikuti aturan resmi saat unggah |
| TikTok | Label wajib untuk konten AI realistis; kartun dan suara yang tidak meniru orang nyata umumnya di luar kewajiban (pihak ketiga) | **UNKNOWN** | Aktifkan label "AI-generated" secara sukarela, seperti Ep 1 |
| Instagram | Label "AI info" untuk konten fotorealistis (tidak diverifikasi dari sumber resmi) | **UNKNOWN** | Aktifkan label AI secara sukarela, seperti Ep 1 |

### 15.4 Checklist publikasi (pemilik)

1. ☐ **Setujui file final** (`episode_2026-11-003_final_v1.mp4`) setelah menonton dan mendengar di ponsel. Sesudah itu baru `approved-by-owner` boleh diubah, dan hanya oleh pemilik.
2. ☐ **Lisensi voice-over (ElevenLabs).**
   - Arahan pemilik yang tercatat (2026-11-17, berlaku untuk seri ini): narasi diperlakukan sebagai dibuat dengan **paket Pro**.
   - **Fakta yang berbeda:** cek read-only API pada 2026-11-18 menunjukkan akun masih **`free`** (content.md §9).
   - Mohon konfirmasi paket yang dipakai saat 13 take Ep 2 dibuat.
   - Bila ternyata `free`: menurut help center ElevenLabs (dibaca 2026-11-17), audio paket Free hanya untuk non-komersial dan wajib mencantumkan "elevenlabs.io" atau "11.ai" di **judul**, dan statusnya tidak berubah walau akun di-upgrade kemudian.
3. ☐ **Lisensi SFX** (arahan pemilik 2026-11-17: SFX folder proyek boleh dipakai; Claude tidak memverifikasi):
   - 7 file yang dibuat pemilik (suasana malam #3, langkah #2, gerendel #3, ketukan layar #1, pembuka toa #4, getar #2, ketukan #3) — [[sfx-pustaka]];
   - `1 Click Mouse.mp3` dan `Sub Drop 2.mp3`: sumber tidak tercatat;
   - `sfx-19_kick-boom_low_impact.wav`: paket ProducerSpot, lisensi belum diverifikasi;
   - `toa_hum.wav`: disintesis sendiri, tanpa hak pihak ketiga.
4. ☐ Font Poppins (OFL), Remotion (lisensi gratis perorangan, D-021), three.js (MIT): tidak ada tindakan.
5. ☐ **Label AI** per platform sesuai §15.3, setelah membaca aturan resmi terbaru.
6. ☐ Pilih **sampul** (A/B/C) di §15.2.
7. ☐ Unggah **manual** di tiap aplikasi dengan judul/caption §15.1. Setelah tayang, catat URL di frontmatter `published-urls` dan ubah status ke `published` (dengan persetujuan pemilik).
8. ☐ Sesudah tayang: snapshot analytics pertama ke `05-DATA/` (seperti Ep 1).

