---
type: content-unit
id: "2026-11-002"
title: "Peringatan dengan Suaramu Sendiri"
status: published
channel: lab
channel-name: "Uq.cerita"
series: "Peringatan dengan Suaramu Sendiri"
episode: 1
category: fiksi-misteri-pov
experiment: ""
created: "2026-11-15"
updated: "2026-11-17"
approved-by-owner: false
platforms: [tiktok, reels, shorts]
duration-target-s: null
published-urls:
  - "https://www.youtube.com/shorts/iOk68iitJu4"
  - "https://www.instagram.com/reel/Df0o04UNy0n/"
  - "https://www.tiktok.com/@uq.cerita/video/7708931044476505345"
tags: [content-unit, 3d, storyboard-draft]
duration-audio-s: 98.56
duration-video-s: 99.56
---

# 2026-11-002 — Peringatan dengan Suaramu Sendiri

> Produksi terpisah dari pilot [[04-PRODUCTION/2026-11-001/content|2026-11-001]] (pilot Tyo dan semua render-nya **tidak diubah**).
> Sumber naskah dan arah kreatif: `refrences/HANDOFF_Peringatan_dengan_Suaramu_Sendiri.md` (§5 naskah terkunci).
> Pipeline: `studio/` (3D toon bertinta, D-021) · skill `video-production` v0.3 · Identitas: [[02-CHANNELS/lab/CHANNEL-DNA|Channel DNA lab]], [[STUDIO-WORKFLOW]] §1.
> Semua durasi di catatan ini **estimasi sementara (HYPOTHESIS)**; timing final mengikuti audio nyata.

## Status

| Tanggal | Status baru | Oleh | Catatan |
|---|---|---|---|
| 2026-11-15 | scripted | pemilik | Konsep 1 dipilih dan naskah Draft 1 diterima (“cocok”) di chat diskusi; dicatat dari dokumen handoff. |
| 2026-11-15 | scripted | Claude | Storyboard teknis **draft v0.1** + inventaris aset disiapkan untuk ditinjau. Belum ada aset, audio, atau render. Status tetap `scripted` sampai pemilik meninjau. |
| 2026-11-15 | scripted | pemilik | Storyboard tetap **draft rencana**; prioritas voice-over. Casting diputuskan (§9.1). Paket ElevenLabs §9 disiapkan; sampel N01/P01/D01 belum dibuat. Desain adik belum disetujui. |
| 2026-11-15 | scripted | Claude | 13 segmen VO lengkap (dibuat pemilik di situs, diterima). Preview audio v1 (100,0 s) + usulan timing storyboard di §9.9; menunggu penilaian pemilik. Belum render video. |
| 2026-11-16 | scripted | Claude | Pemilik menilai v1 (D02 terucap dua kali) → preview v2 (§9.10), tanpa generasi ulang. |
| 2026-11-16 | scripted | pemilik | **Audio v2 disetujui** untuk produksi (98,56 s, tanpa perubahan lagi). Bukan persetujuan video final/publikasi. Storyboard §4 belum diselaraskan; video belum dirender. |
| 2026-11-16 | scripted | Claude | Storyboard §4 → **draft v0.2**: durasi, frame, timing L#, dan potongan shot dari audio v2 (98,56 s). Isi visual tidak berubah. Konflik waktu + keputusan visual terbuka dikumpulkan di §8. Belum disetujui; tidak ada render. |
| 2026-11-16 | scripted | pemilik | **Storyboard v0.2 disetujui** sebagai dasar plan JSON dengan penyesuaian A04/A07/A10/A17 ([[DECISION-LOG#D-025]]); A14/A16 dievaluasi saat animatic. Referensi desain adik (C3) dan NPC dasar (W1, W2, anak warga) disetujui. |
| 2026-11-16 | scripted | Claude | Model 3D adik + 3 NPC sebagai preset (`studio/src/cast/npc.tsx`); lineup 3D v1 dirender (§10). **Usulan model, belum disetujui.** Tidak ada video/animasi. |
| 2026-11-16 | scripted | pemilik | Menilai lineup v2: revisi rambut adik, tangan NPC, balita digendong ibu; A10 diklarifikasi ([[DECISION-LOG#D-026]]). |
| 2026-11-16 | scripted | Claude | Revisi terbatas: lineup v3, gendong ibu+balita, detail rambut/tangan, cek malam (§10.1). **Usulan, menunggu penilaian visual.** |
| 2026-11-16 | scripted | pemilik | **Model lineup v3 + pose gendong v2 disetujui** sebagai dasar produksi; gerak jalan warga disetujui; lanjut animatic penuh ([[DECISION-LOG#D-027]]). Bukan persetujuan video final. |
| 2026-11-16 | animatic | Claude | Animatic v2 A01–A17 dengan audio + subtitle (§11). Menunggu penilaian pemilik. |
| 2026-11-16 | animatic | pemilik | **Animatic v2 ditolak:** "banyak yang tidak masuk akal… jelek". Diagnosis: [[2026-11-16-animatic-v2-ditolak]]. Langkah berikutnya: studi video referensi lalu look-dev, sebelum render ulang. |
| 2026-11-16 | animatic | Claude | Studi referensi Badai Matahari → target gaya ([[2026-11-16-style-target-badai-matahari]]); jalur 2D dihapus (D-029); uji Blender ditolak pemilik (D-030). Look-dev three.js v1: tubuh + celana, tinta tipis ([[2026-11-16-lookdev-threejs-v1]]). |
| 2026-11-16 | animatic | pemilik | **Desain tubuh, celana, dan tinta tipis (look-dev v1) disetujui** ([[DECISION-LOG#D-031]]). Bukan persetujuan pencahayaan atau video final. Three.js/R3F + Remotion jadi stack wajib. |
| 2026-11-16 | animatic | Claude | Pencahayaan lokal + properti rumah (look-dev v2) dan **pilot 15 s A01–A04** dengan audio v2 + SFX/ambience/musik sintesis: `_media/2026-11-002/out/pilot_2026-11-002_v1.mp4` (tanpa motion blur), `…_v2.mp4` (motion blur). Skill dipakai: video-production, inkbeat-shorts, threejs-lighting, remotion-markup (3d/timing), remotion-captions (model data). Catatan: [[2026-11-16-pilot-15s-v1]]. **Menunggu penilaian pemilik.** |
| 2026-11-17 | animatic | pemilik | Pilot v2 **belum disukai**. Prioritas: (1) bentuk karakter konsisten, (2) gerak alami, (3) kejelasan cerita, (4) set/cahaya/efek nanti. SFX/musik tambahan pilot v2 **tidak** dianggap disetujui. |
| 2026-11-17 | animatic | Claude | Revisi **A02–A04 v3**: gerak bangun bertumpu (IK pada rig C1), satu lensa 30° dari jarak 2,2–3,2 m (wild wall timur), rim karakter kembali, selimut lempengan, tanpa lip sync. Audio = potongan audio yang disetujui saja. `_media/2026-11-002/out/pilot_2026-11-002_a02-a04_v3.mp4`, sebelum/sesudah `…_v1-vs-v3.mp4`. Catatan: [[2026-11-17-pilot-a02-a04-v3]]. **Menunggu penilaian pemilik.** |
| 2026-11-17 | animatic | pemilik | Lebih menyukai revisi A02–A04 v3; **arahnya dijadikan acuan produksi** ([[DECISION-LOG#D-033]]). Video final belum disetujui. Uji SFX dari `refrences/SFX/` diizinkan untuk preview; musik masih menunggu. |
| 2026-11-17 | animatic | Claude | **Animatic v3 lengkap A01–A17** dengan usulan SFX (15 cue, kandidat): `_media/2026-11-002/out/episode_2026-11-002_animatic_v3.mp4`, cue sheet `audio/animatic/2026-11-002_animatic_v3_cue_sheet.csv`. Semua karakter bertubuh; kamera ≥ 2,2 m; A08 tarik, A09, A15 genggam dicek numerik. Sumber/lisensi SFX koleksi belum diketahui (tuntaskan sebelum publikasi). Catatan: [[2026-11-17-animatic-v3]]. **Menunggu penilaian pemilik.** |
| 2026-11-17 | animatic | pemilik | Menyukai animatic v3 dan pilihan SFX-nya. Minta perbaikan 4 cacat set dan kompleks yang lebih berpenghuni; karakter, gerak, timing, VO, dan mix dipertahankan. |
| 2026-11-17 | animatic | Claude | **Animatic v4**: `_media/2026-11-002/out/episode_2026-11-002_animatic_v4.mp4` (mix SFX v3 apa adanya). **Penyebab cacat:** (1)+(4) `RowHouse` menaruh jendela/pintu tetangga di x = 0, sehingga jendela tetangga tergambar di fasad rumah 7 dan rumah seberang saling tumpuk, ditambah pintu/jendela yang tumpang tindih; (2) `Wall` tidak mendukung lubang angin di atas pintu belakang, sehingga ada panel di tengah bukaan; (3) jam ruang tamu tergantung di bukaan lorong. Semua diperbaiki dan diperiksa di awal/tengah/akhir gerak kamera. **Lingkungan:** +7 rumah depan (variasi fasad/atap/pagar), +17 rumah deret belakang, +3 pohon, +10 warga (+5 varian penampilan). **Render:** 60 frame terpadat +1–10 % waktu, +0,14–0,32 GB; render penuh 179,8 s, puncak 5,1 GB. Perbandingan: `out/v4_compare/`. Catatan: [[2026-11-17-set-fix-env-v4]]. **Menunggu penilaian pemilik.** |
| 2026-11-17 | animatic | Claude | **Perbaikan lengan C1 saat bangun (A02–A04), dasar v4 → `env v5`.** Penyebab terbukti: IK lengan tanpa batas tubuh, sehingga garis tengah lengan masuk torso (241/341 frame, 8,4 cm) dan tangan "hilang" lalu "keluar dari torso" di 8,1–10,1 s; target tangan terlalu dekat badan untuk rig satu-bidang C1. Perbaikan: IK menghindari torso, tumpuan 0,30 m di samping pinggul, satu cabang IK, jalur ke pangkuan lewat sisi paha. Hasil: 25 frame ≤ 1,2 cm, lompatan ≤ 13°/frame. Perbandingan sebelum/sesudah (timing dan audio sama): `_media/2026-11-002/out/arm_fix/`. Catatan: [[2026-11-17-lengan-hilang-sit-up]]. Episode lengkap belum dirender ulang. **Menunggu penilaian pemilik.** |
| 2026-11-17 | final (tinjau) | pemilik | Perbaikan lengan v5 diterima. Episode ini jadi video pertama yang akan ditayangkan; episode berikutnya topik lain (A/B hanya pertanyaan reflektif). |
| 2026-11-17 | final (tinjau) | Claude | **Final v1:** `_media/2026-11-002/out/episode_2026-11-002_final_v1.mp4` (= v5 + label "HARI 1" 0,25–4,9 s, kiri atas 8 % / 12 %). QC: 2987 frame, tanpa frame kosong atau kedip cahaya, −14,5 LUFS, cek lengan lolos. Paket unggah: `_media/2026-11-002/upload/` (judul, caption 3 platform, sampul A14). **Belum boleh dipublikasikan:** VO dari paket Free ElevenLabs = non-komersial dan wajib "elevenlabs.io" di judul; 9 SFX koleksi belum jelas sumber/lisensinya. Daftar penyempurnaan untuk video berikutnya ada di handoff. **Tidak dipublikasikan.** |
| 2026-11-17 | final (tinjau) | Claude | Evaluasi produksi selesai: [[STUDIO-WORKFLOW]] §7–§10; arah video berikutnya [[DECISION-LOG#D-034]]. Video ini tidak direvisi lagi. |
| 2026-11-17 | published | pemilik | Diunggah manual oleh pemilik pagi 17 Nov 2026 (WIB) ke YouTube Shorts (±07:23, perkiraan), Instagram Reels (±07:30–08:33, perkiraan), dan TikTok (07:29). Status diubah atas persetujuan pemilik. Snapshot 1 (umur ±11 jam): YouTube 5,9 rb views / 2,7 rb engaged, 75,4 % stayed to watch; Instagram 668 likes, skip rate 22,6 %, views belum tersedia; TikTok 0 views (penyebab UNKNOWN). Data mentah: `05-DATA/metrics.csv`; analisis: [[05-DATA/analytics/2026-11-002/2026-11-17-snapshot-01-analisis\|snapshot 1]]. Masih terbuka: "elevenlabs.io" di judul belum dicek; lisensi 9 SFX koleksi. |
| 2026-11-17 | published | pemilik | **Hak audio, arahan pemilik:** (1) narasi ElevenLabs diperlakukan sebagai dibuat dengan paket Pro; (2) SFX dari folder SFX proyek boleh dipakai di video yang dipublikasikan. Keduanya **arahan pemilik proyek**; Claude tidak memverifikasi paket ElevenLabs maupun lisensi SFX secara independen. Atas dasar itu dua poin terbuka **ditutup**: permintaan "elevenlabs.io" di judul (asumsi paket Free) dan pertanyaan lisensi 9 SFX. Catatan lama di atas dan di §8–§9 dipertahankan sebagai riwayat. Status `published`, `approved-by-owner`, URL, dan `metrics.csv` tidak berubah. |
| 2026-11-17 | published | pemilik | **Arah seri ([[DECISION-LOG#D-035]]):** video ini adalah **Episode 1** seri "Peringatan dengan Suaramu Sendiri" di channel **Uq.cerita**. Episode 2 **melanjutkan** dari pilihan akhir (tetap di dalam / keluar lewat belakang), menggantikan arahan "episode berikutnya topik lain" di baris 2026-11-17 sebelumnya. Catatan kontinuitas untuk Episode 2: §12. |

## 1. Ringkasan

- **Genre:** fiksi misteri dengan ancaman, POV orang kedua (“kamu”). Fiksi, bukan klaim peristiwa nyata atau panduan keselamatan.
- **Payoff episode:** suara mengetahui dan merespons tindakan di dalam rumah (A13).
- **Misteri yang tetap terbuka:** asal suara, alasan perilaku warga.
- **Akhir:** pilihan konkret dengan ketidakpastian di kedua jalur. Tidak ada cabang/episode 2 yang ditetapkan. **[Pembaruan 2026-11-17, [[DECISION-LOG#D-035]]: video ini = Episode 1. Episode 2 melanjutkan dari pilihan ini; cabang dipilih pemilik. Kontinuitas: §12.]**

## 2. Naskah terkunci — dipecah per kalimat (L1–L33)

Teks disalin otomatis dari handoff §5 (UTF-8) dan diverifikasi ulang terhadap blok aslinya (§7). Penomoran L# dan label pembicara berada di luar teks naskah.

| L# | Paragraf | Pembicara | Teks persis |
|---|---|---|---|
| L1 | P1 | NARATOR | Jam dua pagi, kamu terbangun karena pengeras suara kompleks. |
| L2 | P2 | PENGUMUMAN (suara “kamu”, efek pengeras suara) | “Seluruh warga diminta keluar rumah.” |
| L3 | P3 | NARATOR | Kamu langsung duduk. |
| L4 | P4 | NARATOR | Itu suaramu. |
| L5 | P5 | NARATOR | Intonasinya, cara menarik napas, bahkan suara serak di ujung kalimatnya. |
| L6 | P6 | NARATOR | Dari jendela, kamu melihat tetangga mulai keluar. |
| L7 | P6 | NARATOR | Ada yang masih memakai sarung. |
| L8 | P6 | NARATOR | Ada yang menggendong anaknya. |
| L9 | P7 | NARATOR | Adikmu muncul di pintu kamar sambil membawa jaket. |
| L10 | P8 | ADIK | “Kita ikut, kan?” |
| L11 | P9 | NARATOR | Kamu mengambil ponsel. |
| L12 | P9 | NARATOR | Grup warga penuh pertanyaan. |
| L13 | P10 | NARATOR | Lalu masuk pesan dari petugas keamanan. |
| L14 | P11 | NARATOR membaca pesan (kering, dekat) | “Jangan keluar dulu. |
| L15 | P11 | NARATOR membaca pesan (kering, dekat) | Ruang pengeras suara terkunci. |
| L16 | P11 | NARATOR membaca pesan (kering, dekat) | Kuncinya masih saya bawa.” |
| L17 | P12 | NARATOR | Kamu menarik adikmu menjauh dari pintu. |
| L18 | P13 | NARATOR | Pengumuman itu berhenti. |
| L19 | P14 | NARATOR | Beberapa detik kemudian, suaramu terdengar lagi. |
| L20 | P15 | PENGUMUMAN (suara “kamu”, efek pengeras suara) | “Keluarga di rumah nomor tujuh. |
| L21 | P15 | PENGUMUMAN (suara “kamu”, efek pengeras suara) | Kami masih menunggu.” |
| L22 | P16 | NARATOR | Nomor rumahmu. |
| L23 | P17 | NARATOR | Adikmu menatapmu. |
| L24 | P18 | ADIK | “Kok dia tahu?” |
| L25 | P19 | NARATOR | Kamu mematikan lampu ruang tamu. |
| L26 | P20 | NARATOR | Pengeras suara kembali berbunyi. |
| L27 | P21 | PENGUMUMAN (suara “kamu”, efek pengeras suara) | “Mematikan lampu tidak berarti rumahnya kosong.” |
| L28 | P22 | NARATOR | Di luar, tetangga yang tadi berjalan mulai berhenti. |
| L29 | P23 | NARATOR | Satu per satu, mereka menoleh ke rumahmu. |
| L30 | P24 | NARATOR | Adikmu menggenggam tanganmu semakin erat. |
| L31 | P25 | NARATOR | Pintu belakang mengarah ke gang sempit. |
| L32 | P25 | NARATOR | Tapi dari tempatmu berdiri, kamu tidak bisa melihat siapa yang ada di sana. |
| L33 | P26 | NARATOR | Kamu akan tetap di dalam dan menunggu petugas keamanan, atau membawa adikmu keluar lewat belakang sebelum orang-orang itu mendekat? |

## 3. Geografi rumah no. 7 dan kompleks (berlaku untuk semua adegan)

```
                    UTARA (belakang)
 ══════ GANG SEMPIT — tidak pernah diperlihatkan dari luar ══════
 ┌───────────────────── RUMAH NO. 7 (satu lantai) ──────────────┐
 │  DAPUR ── [PINTU BELAKANG → gang]                            │
 │     │                                                         │
 │  LORONG lurus depan ↔ belakang                               │
 │     │                         ┌──────────────────────┐        │
 │  RUANG TAMU                   │ KAMAR KAMU           │        │
 │  [sakelar] [lampu plafon]     │ [kasur][meja+ponsel] │        │
 │  [sofa]        pintu kamar ───┤ (pintu di dinding barat)      │
 │  [PINTU DEPAN] [JENDELA]      │ [JENDELA ke jalan]   │        │
 └───────────────────────────────┴──────────────────────┴────────┘
      teras · pagar · plat “7”
 ════════ JALAN KOMPLEKS — warga berjalan ke timur ════════► [TIANG TOA]
      deret rumah tetangga di seberang jalan          (ujung timur)
                    SELATAN (depan)
```

**Aturan arah layar (180°):**
- **Interior** (kamar, ruang tamu, lorong): kamera menghadap **kira-kira barat (barat daya–barat laut)**. Akibatnya **depan/jalan/warga = kiri layar**, **belakang/pintu belakang/gang = kanan layar**. C1 yang melihat ke jalan menghadap kiri layar (tiga perempat), sehingga wajah dan “Uq” terlihat tanpa mencerminkan model.
- **Eksterior dari seberang jalan** (A01, A13): kamera menghadap utara; toa di **kanan** layar, warga berjalan ke kanan.
- **POV dari jendela** (A05, A14): kamera menghadap selatan, sehingga toa pindah ke **kiri** layar. Ini konsisten secara ruang (sudut berbalik). Corong toa dibuat tetap terlihat sebagai jangkar arah di semua shot luar.
- Lampu ruang tamu dinyalakan adik sebelum A06 (terlihat sebagai cahaya hangat di belakangnya), lalu dimatikan C1 di A12. Dari luar, jendela ruang tamu ada di sisi kiri rumah 7 (A13).
- **Satu pengecualian:** POV lorong di A16 menghadap **utara** (bagian depan rumah ada di belakang kamera). A17 menghadap barat laut supaya jendela depan tetap di kiri layar dan lorong ke pintu belakang terlihat menjauh di kanan layar.
- Ruang pengeras suara dan pos tidak pernah diperlihatkan. Yang terlihat hanya corong di tiang, tanpa orang.

**Tafsir staging (bukan perubahan naskah):** “pintu” di L17 dibaca sebagai **pintu depan**. Setelah L10 adik berjalan ke ruang tamu menuju pintu depan, dan L25 menempatkan kamu di ruang tamu. Perpindahan kamar → ruang tamu terjadi lewat potongan A07 → A08, tanpa adegan berjalan.

## 4. Storyboard teknis (v0.2 — diselaraskan dengan audio v2; **disetujui pemilik 2026-11-16** sebagai dasar plan JSON, dengan penyesuaian [[DECISION-LOG#D-025]])

> **Penyesuaian yang disetujui (2026-11-16):** A04 pengumuman L2 berulang pelan **di bawah L5** (narator tetap jelas) · A07 pesan L16 tampil **sampai selesai** sebelum pindah ke wajah C1 · A10 **dua shot tetap**, ditambah gerak kamera pelan ~~dan reaksi karakter~~ (D-026: tanpa shot reaksi; reaksi adik tetap di A11) · A17 **+1,0 s hening** di timeline video (audio v2 tidak diubah) agar kartu pilihan tampil ± 3 s · A14 dan A16 dievaluasi saat animatic; perpanjangan **belum** disetujui. Teks rancangan lama di bawah dibiarkan dan diberi catatan penyesuaian.

- **Sumber waktu (2026-11-16):** `_media/2026-11-002/audio/preview/2026-11-002_vo_preview_v2_timing.json` (audio v2 disetujui pemilik, 98,56 s; §9.10). Estimasi lama berbasis jumlah kata (v0.1) diganti; angka lamanya tetap terbaca di tabel §9.9 kolom “Estimasi lama §4”.
- **Potongan adegan** = titik tengah jeda antara kalimat terakhir adegan dan kalimat pertama adegan berikutnya (metode §9.9). Frame dihitung pada 30 fps (frame mulai inklusif, frame akhir eksklusif).
- **Batas L# di dalam satu segmen** diperkirakan dari jeda dalam file (± 0,1–0,3 s), bukan forced alignment. Batas antarsegmen dan total durasi adalah hasil pengukuran.
- **Potongan shot di dalam adegan** = usulan (titik tengah jeda antar-L#); boleh digeser saat animasi asalkan tidak memotong kata.
- Isi visual tiap adegan (aksi, framing, aset) **tidak berubah** dari v0.1. Konflik antara rencana visual dan waktu nyata dicatat sebagai keputusan terbuka di §8 (butir 5–9).

### A01 — 4,77 s · 0,00–4,77 s · frame 0–143

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L1** Jam dua pagi, kamu terbangun karena pengeras suara kompleks. |
| Suara | L1: NARATOR |
| Timing audio v2 (s) | L1 0,50–4,42 |
| Lokasi | EXT jalan kompleks, depan rumah no. 7 — malam |
| Karakter | — (tanpa tokoh; rumah-rumah gelap) |
| Aksi | Jalan kompleks sepi. Kamera tinggi melihat deret rumah, tiang toa di ujung timur (kanan layar), dan celah gang gelap di belakang deretan rumah. Plat “7” di pagar rumah no. 7 tertangkap cahaya lampu jalan, tidak ditonjolkan. Di akhir shot terdengar klik dan dengung toa menyala. |
| Ekspresi/reaksi | — |
| Framing & kamera | Wide, high angle → turun dan push-in pelan ke jendela kamar rumah 7 (kanan rumah). |
| Tujuan shot | Memperkenalkan geografi sekaligus: jalan di depan, gang di belakang, toa di ujung, nomor 7. Semua petunjuk ini dibayar nanti. |
| Teks layar (selain subtitle) | Tidak ada (waktu cukup dari narasi). |
| Ambience | Malam kompleks: jangkrik, anjing jauh sesekali, dengung lampu jalan. |
| SFX | Klik + dengung/feedback toa menyala (akhir shot). |
| Kata / jeda | 9 kata · jeda nyata ke adegan berikut 0,70 s (v2) |

### A02 — 3,33 s · 4,77–8,10 s · frame 143–243

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L2** “Seluruh warga diminta keluar rumah.” |
| Suara | L2: PENGUMUMAN (suara “kamu”, efek pengeras suara) |
| Timing audio v2 (s) | L2 5,12–7,48 |
| Lokasi | INT kamar kamu — gelap, cahaya biru lampu jalan lewat gorden |
| Karakter | C1 |
| Aksi | C1 berbaring di kasur. Pengumuman terdengar dari luar; mata C1 terbuka tiba-tiba, badan belum bergerak. |
| Ekspresi/reaksi | Tidur (mata tertutup) → mata terbuka, alis netral, mulut datar. |
| Framing & kamera | Close/medium dari samping kasur, kamera rendah setinggi bantal; statis. |
| Tujuan shot | Membuat penonton mendengar suara pengumuman dulu sebelum tahu itu suara siapa. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam (teredam dinding). |
| SFX | Suara pengumuman lewat toa, jauh, bergema di antara rumah. |
| Kata / jeda | 5 kata · jeda nyata ke adegan berikut 1,24 s (v2) |

### A03 — 1,86 s · 8,10–9,96 s · frame 243–299

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L3** Kamu langsung duduk. |
| Suara | L3: NARATOR |
| Timing audio v2 (s) | L3 8,72–9,79 |
| Lokasi | INT kamar kamu |
| Karakter | C1 |
| Aksi | C1 duduk mendadak di kasur, selimut tersibak. |
| Ekspresi/reaksi | Mata bulat, alis terangkat, mulut datar. |
| Framing & kamera | Medium; kamera ikut naik sedikit bersama gerakan duduk (cut tajam dari A02). |
| Tujuan shot | Ketukan kaget pertama. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam. |
| SFX | Derit kasur, gesekan selimut. |
| Kata / jeda | 3 kata · jeda nyata ke adegan berikut 0,35 s (v2) |

### A04 — 6,19 s · 9,96–16,15 s · frame 299–484

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L4** Itu suaramu.<br>**L5** Intonasinya, cara menarik napas, bahkan suara serak di ujung kalimatnya. |
| Suara | L4: NARATOR; L5: NARATOR |
| Timing audio v2 (s) | L4 10,13–10,95<br>L5 11,22–15,98<br>Catatan: L4→L5 jeda hanya 0,28 s; pengulangan toa L2 tidak muat di antaranya (lihat §8 butir 5) |
| Lokasi | INT kamar kamu |
| Karakter | C1 |
| Aksi | C1 membeku menatap ke arah jendela (kiri layar). ~~Di antara L4 dan L5, toa mengulang kalimat L2 sekali, pelan~~ → **(D-025) toa mengulang L2 pelan di bawah L5** (11,22–15,98), narator tetap jelas (lihat catatan audio §5.3). C1 menelan ludah/napas tertahan saat L5. |
| Ekspresi/reaksi | Kaget membeku → alis cemas (worried), mulut sedikit terbuka. |
| Framing & kamera | Close-up wajah, tiga perempat menghadap kiri layar (wajah + “Uq” terlihat); push-in sangat pelan. |
| Tujuan shot | Inti premis: penonton menghubungkan suara pengumuman dengan suara narator/“kamu”. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam, sangat tipis. |
| SFX | Pengulangan L2 dari toa (D-025: lapisan pelan di bawah L5); napas C1 (halus, tanpa kata). |
| Kata / jeda | 12 kata · jeda nyata ke adegan berikut 0,34 s (v2) |

### A05 — 6,61 s · 16,15–22,76 s · frame 484–683

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L6** Dari jendela, kamu melihat tetangga mulai keluar.<br>**L7** Ada yang masih memakai sarung.<br>**L8** Ada yang menggendong anaknya. |
| Suara | L6: NARATOR; L7: NARATOR; L8: NARATOR |
| Timing audio v2 (s) | L6 16,32–19,17<br>L7 19,44–20,96<br>L8 21,16–22,63<br>Potongan shot: OTS jendela 16,15–19,30 (L6) → POV W1 19,30–21,06 (L7) → POV W2 21,06–22,76 (L8) |
| Lokasi | INT kamar kamu → POV ke jalan kompleks |
| Karakter | C1, Warga W1 (sarung di bahu), W2 (ibu menggendong anak dengan gendongan), W3–W6 latar |
| Aksi | C1 menyibak gorden. Pintu rumah tetangga terbuka satu per satu, lampu teras menyala, warga keluar dan mulai berjalan ke arah toa. L7: W1 keluar dengan sarung tersampir di bahu. L8: W2 keluar menggendong anak. |
| Ekspresi/reaksi | Warga: mengantuk/datar (mata setengah tertutup). C1 tidak terlihat wajahnya di POV. |
| Framing & kamera | OTS di belakang bahu C1 di jendela (L6) → POV medium W1 (L7) → POV medium W2 (L8). Kamera POV sedikit goyang tangan, sangat halus. |
| Tujuan shot | Skala kejadian: semua warga patuh pada suara itu. Warga tampak biasa, bukan menyeramkan. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam + pintu-pintu dibuka, langkah sandal di aspal, gumam samar tanpa kata jelas. |
| SFX | Gorden disibak, engsel pintu tetangga, sandal. |
| Kata / jeda | 16 kata · jeda nyata ke adegan berikut 0,26 s (v2) |

### A06 — 4,97 s · 22,76–27,73 s · frame 683–832

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L9** Adikmu muncul di pintu kamar sambil membawa jaket.<br>**L10** “Kita ikut, kan?” |
| Suara | L9: NARATOR; L10: ADIK |
| Timing audio v2 (s) | L9 22,89–25,62<br>L10 26,48–27,32<br>Potongan shot: medium-wide 22,76–26,05 (L9) → medium close adik 26,05–27,73 (L10) |
| Lokasi | INT kamar kamu — pintu kamar; ruang tamu terang di belakangnya |
| Karakter | C1, ADIK |
| Aksi | Adik berdiri di ambang pintu kamar, jaket terlipat di lengan (tidak dipakai). Lampu ruang tamu di belakangnya menyala hangat (adik yang menyalakan). C1 menoleh dari jendela. Setelah L10 adik berbalik ke arah ruang tamu/pintu depan. |
| Ekspresi/reaksi | Adik: setengah mengantuk, polos, sedikit bersemangat (tidak takut). C1: cemas. |
| Framing & kamera | Medium-wide dari sisi jendela: C1 di foreground kiri, adik di pintu di tengah belakang (siluet hangat) → medium close adik pada L10. |
| Tujuan shot | Memperkenalkan hubungan personal dan sumber cahaya ruang tamu yang nanti dimatikan. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam dari jendela; suara warga di luar. |
| SFX | Langkah kaki adik di lantai keramik. |
| Kata / jeda | 11 kata · jeda nyata ke adegan berikut 0,80 s (v2) |

### A07 — 12,90 s · 27,73–40,63 s · frame 832–1219

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L11** Kamu mengambil ponsel.<br>**L12** Grup warga penuh pertanyaan.<br>**L13** Lalu masuk pesan dari petugas keamanan.<br>**L14** “Jangan keluar dulu.<br>**L15** Ruang pengeras suara terkunci.<br>**L16** Kuncinya masih saya bawa.” |
| Suara | L11: NARATOR; L12: NARATOR; L13: NARATOR; L14: NARATOR membaca pesan (kering, dekat); L15: NARATOR membaca pesan (kering, dekat); L16: NARATOR membaca pesan (kering, dekat) |
| Timing audio v2 (s) | L11 28,12–29,45<br>L12 29,84–31,74<br>L13 32,09–34,68<br>L14 35,18–36,19<br>L15 36,59–38,24<br>L16 38,53–40,10<br>Potongan shot: insert tangan + ponsel 27,73–29,64 (L11) → layar ponsel 29,64–40,63 (L12–L16); notifikasi masuk ≈ 32,09 (awal L13); isi pesan L14–L16 tampil ≈ 35,18. Potongan wajah C1: lihat §8 butir 7 |
| Lokasi | INT kamar kamu — ponsel |
| Karakter | C1 (tangan + wajah tersinari layar) |
| Aksi | C1 meraih ponsel dari meja samping kasur. Layar: grup warga bergulir cepat, banyak gelembung pesan tidak terbaca (blur), tanpa nama grup. L13: notifikasi pesan baru dari kontak berikon topi/tameng petugas (tanpa nama tertulis). L14–L16: isi pesan tampil di layar, dibaca narator. |
| Ekspresi/reaksi | C1: membaca cepat → alis cemas, mata membesar di L15–L16. |
| Framing & kamera | Insert tangan + ponsel (L11) → layar penuh UI ponsel (L12–L16) → ~~potongan wajah C1 diterangi cahaya layar di L16~~ → **(D-025) pesan L16 tampil sampai selesai (40,10 s), baru potong ke wajah C1** diterangi layar. Sisa A07 sesudah L16 hanya 0,53 s (40,10–40,63); potongan A07→A08 boleh digeser sampai ± 41,15 s (awal L17) agar wajah ± 1 s — diputuskan saat animatic (§8). |
| Tujuan shot | Informasi kontra pertama: suara itu tidak mungkin dari ruang pengeras suara. Petugas hadir hanya lewat pesan. |
| Teks layar (selain subtitle) | UI chat. **Satu-satunya teks terbaca = isi pesan L14–L16 persis.** Gelembung grup diburamkan; tidak ada nama grup/kontak. Ponsel/UI diletakkan **di atas** pita subtitle (70% tinggi). Subtitle L14–L16 **disembunyikan** karena gelembung pesan sudah menampilkan teks yang sama. |
| Ambience | Malam; toa samar terus mengulang L2 di kejauhan (tanpa subtitle). |
| SFX | Getar ponsel, notifikasi masuk (1 kali). |
| Kata / jeda | 24 kata · jeda nyata ke adegan berikut 1,05 s (v2) |

### A08 — 2,74 s · 40,63–43,37 s · frame 1219–1301

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L17** Kamu menarik adikmu menjauh dari pintu. |
| Suara | L17: NARATOR |
| Timing audio v2 (s) | L17 41,15–43,17 |
| Lokasi | INT ruang tamu — pintu depan, lampu menyala |
| Karakter | C1, ADIK |
| Aksi | Adik sudah memegang gagang pintu depan. C1 menarik pergelangan/bahu adik mundur menjauh dari pintu. |
| Ekspresi/reaksi | Adik: bingung. C1: tegang, mulut datar. |
| Framing & kamera | Medium-wide, kamera menghadap barat: pintu & jendela depan di kiri layar, lorong ke belakang di kanan layar (aturan arah §3). |
| Tujuan shot | Tindakan pertama tokoh; arah ‘luar = kiri layar’ ditanam. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam; toa masih mengulang L2 samar. |
| SFX | Gagang pintu, langkah tergesek. |
| Kata / jeda | 6 kata · jeda nyata ke adegan berikut 0,38 s (v2) |

### A09 — 6,59 s · 43,37–49,96 s · frame 1301–1499

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L18** Pengumuman itu berhenti.<br>**L19** Beberapa detik kemudian, suaramu terdengar lagi. |
| Suara | L18: NARATOR; L19: NARATOR |
| Timing audio v2 (s) | L18 43,56–44,91<br>L19 46,91–49,61<br>Catatan: hening L18→L19 = 2,00 s (44,91–46,91); klik toa terputus ≈ 43,56 |
| Lokasi | INT ruang tamu |
| Karakter | C1, ADIK |
| Aksi | Pengulangan di toa terputus mendadak. Keduanya diam, menatap ke arah jendela depan. Hening ± 2 detik di antara L18 dan L19. |
| Ekspresi/reaksi | Keduanya membeku; adik mendekat ke C1. |
| Framing & kamera | Medium two-shot statis; push-in sangat pelan selama hening. |
| Tujuan shot | Ketegangan lewat kesunyian. |
| Teks layar (selain subtitle) | — |
| Ambience | Hanya jangkrik + dengung toa yang masih menyala. |
| SFX | Klik toa terputus (awal L18). |
| Kata / jeda | 9 kata · jeda nyata ke adegan berikut 0,70 s (v2) |

### A10 — 8,78 s · 49,96–58,74 s · frame 1499–1762

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L20** “Keluarga di rumah nomor tujuh.<br>**L21** Kami masih menunggu.”<br>**L22** Nomor rumahmu. |
| Suara | L20: PENGUMUMAN (suara “kamu”, efek pengeras suara); L21: PENGUMUMAN (suara “kamu”, efek pengeras suara); L22: NARATOR |
| Timing audio v2 (s) | L20 50,31–52,94<br>L21 53,51–55,01<br>L22 56,31–58,42<br>Potongan shot: corong toa 49,96–55,66 (L20–L21) → plat “7” 55,66–58,74 (L22). Durasi naik dari estimasi 5–6 s; lihat §8 butir 8 |
| Lokasi | EXT tiang toa (L20–L21) → EXT pagar rumah 7, plat “7” (L22) |
| Karakter | — (tanpa orang di dekat toa) |
| Aksi | Corong toa di tiang, gelap, tidak ada siapa pun. Lalu plat “7” di pagar rumah. |
| Ekspresi/reaksi | — |
| Framing & kamera | Low angle corong toa, ~~statis~~ (L20–L21) → insert plat “7”, push-in pelan (L22). **(D-025)** Dua shot dipertahankan; keduanya diberi gerak kamera pelan. ~~ditambah “reaksi karakter” (kata pemilik). Kedua shot tidak memuat tokoh; bentuk reaksinya ditanyakan (§8).~~ **(D-026)** Tidak ada shot reaksi tambahan; reaksi adik tetap di A11. |
| Tujuan shot | Membayar penanaman nomor 7 dari A01. Sumber suara tetap misterius: hanya corong, bukan ruangan atau orang. |
| Teks layar (selain subtitle) | Hanya angka “7” pada plat (properti 3D, bukan overlay). |
| Ambience | Malam terbuka. |
| SFX | Pengumuman L20–L21 dari corong (lebih dekat/jelas daripada A02). |
| Kata / jeda | 10 kata · jeda nyata ke adegan berikut 0,64 s (v2) |

### A11 — 4,13 s · 58,74–62,87 s · frame 1762–1886

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L23** Adikmu menatapmu.<br>**L24** “Kok dia tahu?” |
| Suara | L23: NARATOR; L24: ADIK |
| Timing audio v2 (s) | L23 59,06–60,42<br>L24 61,02–62,37<br>Potongan shot: medium close 58,74–60,72 (L23) → close adik 60,72–62,87 (L24) |
| Lokasi | INT ruang tamu |
| Karakter | C1, ADIK |
| Aksi | Adik mendongak menatap C1, lalu berbisik L24. |
| Ekspresi/reaksi | Adik: alis cemas, mata membesar, mulut kecil. C1: tidak menjawab. |
| Framing & kamera | Medium close dari arah adik (C1 tiga perempat kiri layar, “Uq” terlihat) → close adik pada L24. |
| Tujuan shot | Reaksi personal: adik yang pertama sadar ada yang salah. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam tipis. |
| SFX | — |
| Kata / jeda | 5 kata · jeda nyata ke adegan berikut 1,00 s (v2) |

### A12 — 2,81 s · 62,87–65,68 s · frame 1886–1970

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L25** Kamu mematikan lampu ruang tamu. |
| Suara | L25: NARATOR |
| Timing audio v2 (s) | L25 63,37–65,42<br>Potongan shot: insert sakelar 62,87–≈ 64,40 → klik + wide gelap ≈ 64,40–65,68 (titik klik usulan, di kata “lampu”; disesuaikan saat animasi) |
| Lokasi | INT ruang tamu — sakelar |
| Karakter | C1 |
| Aksi | Tangan C1 menekan sakelar; ruangan berubah dari cahaya hangat ke gelap biru (cahaya lampu jalan dari celah gorden). |
| Ekspresi/reaksi | (Gelap) siluet keduanya. |
| Framing & kamera | Insert sakelar → wide ruang tamu saat gelap (perubahan cahaya mengenai tokoh dan ruangan). |
| Tujuan shot | Usaha bersembunyi yang terlihat jelas dari luar. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam. |
| SFX | Klik sakelar. |
| Kata / jeda | 5 kata · jeda nyata ke adegan berikut 0,52 s (v2) |

### A13 — 7,66 s · 65,68–73,34 s · frame 1970–2200

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L26** Pengeras suara kembali berbunyi.<br>**L27** “Mematikan lampu tidak berarti rumahnya kosong.” |
| Suara | L26: NARATOR; L27: PENGUMUMAN (suara “kamu”, efek pengeras suara) |
| Timing audio v2 (s) | L26 65,94–67,75<br>L27 68,65–72,59<br>Potongan shot: siluet interior 65,68–68,20 (L26) → wide eksterior 68,20–73,34 (L27) |
| Lokasi | INT ruang tamu gelap (L26) → EXT rumah 7 dari seberang jalan (L27) |
| Karakter | C1, ADIK (siluet); warga di jalan (latar) |
| Aksi | Toa berbunyi lagi; keduanya menoleh ke jendela. L27: dari luar, jendela ruang tamu rumah 7 baru saja gelap; warga di jalan masih berjalan. |
| Ekspresi/reaksi | Siluet; bahu menegang. |
| Framing & kamera | Medium siluet interior (L26) → wide eksterior statis dari **sudut tinggi netral seperti A01** (L27): rumah 7 di tengah, toa di kanan layar. Tidak ada kamera goyang, siluet di foreground, atau posisi yang jelas berasal dari rumah tertentu, supaya shot tidak terbaca sebagai sudut pandang si pemilik suara. |
| Tujuan shot | Payoff episode: suara tahu tindakan di dalam rumah. |
| Teks layar (selain subtitle) | — |
| Ambience | Malam terbuka. |
| SFX | Feedback toa singkat (L26), pengumuman L27. |
| Kata / jeda | 10 kata · jeda nyata ke adegan berikut 1,50 s (v2) |

### A14 — 7,41 s · 73,34–80,75 s · frame 2200–2422

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L28** Di luar, tetangga yang tadi berjalan mulai berhenti.<br>**L29** Satu per satu, mereka menoleh ke rumahmu. |
| Suara | L28: NARATOR; L29: NARATOR |
| Timing audio v2 (s) | L28 74,09–77,35<br>L29 77,87–80,52<br>Catatan: L28 74,09–77,35 warga melambat → berhenti; tolehan mulai ≈ 77,87, 6 × 0,4 s = 2,4 s, muat di L29 (2,64 s)<br>D-025: kecukupan waktu dievaluasi saat animatic; perpanjangan belum disetujui |
| Lokasi | POV dari celah gorden ruang tamu → jalan kompleks |
| Karakter | W1–W6 |
| Aksi | L28: warga melambat lalu berhenti. L29: satu per satu (selang ± 0,4 s) mereka memutar kepala ke arah kamera = ke rumahmu. Wajah datar, tidak marah, tidak tersenyum. |
| Ekspresi/reaksi | Warga: datar/kosong (mata titik, mulut garis). |
| Framing & kamera | POV medium-wide di balik gorden (tepi gorden gelap di foreground), statis; tiap tolehan diberi ruang. |
| Tujuan shot | Reaksi warga terbaca jelas: berjalan → berhenti → menoleh. Alasan perilaku tetap tidak dijelaskan. |
| Teks layar (selain subtitle) | — |
| Ambience | Langkah sandal berhenti; jangkrik saja. |
| SFX | Langkah terakhir; tanpa musik kejut. |
| Kata / jeda | 15 kata · jeda nyata ke adegan berikut 0,47 s (v2) |

### A15 — 2,49 s · 80,75–83,24 s · frame 2422–2497

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L30** Adikmu menggenggam tanganmu semakin erat. |
| Suara | L30: NARATOR |
| Timing audio v2 (s) | L30 80,98–83,03<br>Potongan shot: satu shot 80,75–83,24: extreme close tangan → tilt |
| Lokasi | INT ruang tamu gelap |
| Karakter | C1, ADIK |
| Aksi | Tangan adik menggenggam tangan C1 dan mengerat; tilt naik ke wajah keduanya. |
| Ekspresi/reaksi | Adik: takut. C1: menahan diri. |
| Framing & kamera | Extreme close tangan → tilt ke two-shot medium. |
| Tujuan shot | Taruhan emosional sebelum pilihan. |
| Teks layar (selain subtitle) | — |
| Ambience | Hening. |
| SFX | Gesekan kain halus. |
| Kata / jeda | 5 kata · jeda nyata ke adegan berikut 0,43 s (v2) |

### A16 — 6,65 s · 83,24–89,89 s · frame 2497–2697

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L31** Pintu belakang mengarah ke gang sempit.<br>**L32** Tapi dari tempatmu berdiri, kamu tidak bisa melihat siapa yang ada di sana. |
| Suara | L31: NARATOR; L32: NARATOR |
| Timing audio v2 (s) | L31 83,46–85,47<br>L32 85,70–89,67<br>Potongan shot: close C1 menoleh 83,24–85,59 (L31) → POV lorong 85,59–89,89 (L32)<br>D-025: kecukupan waktu dievaluasi saat animatic; perpanjangan belum disetujui |
| Lokasi | INT lorong → dapur → pintu belakang |
| Karakter | C1 (menoleh), tanpa orang lain |
| Aksi | C1 menoleh ke kanan layar (belakang rumah). Reverse: lorong gelap menuju dapur, pintu belakang tertutup di ujung; lubang angin/kaca buram di atas pintu hanya gelap dengan sedikit cahaya dingin. Tidak ada siluet orang. |
| Ekspresi/reaksi | C1: waspada. |
| Framing & kamera | Close C1 menoleh → POV lorong, push-in pelan yang berhenti jauh sebelum pintu. |
| Tujuan shot | Menampilkan opsi kedua beserta ketidakpastiannya tanpa memperlihatkan gang dari luar. |
| Teks layar (selain subtitle) | — |
| Ambience | Hening; jangkrik dari arah gang sedikit lebih jelas. |
| SFX | Tetesan keran dapur (opsional). |
| Kata / jeda | 19 kata · jeda nyata ke adegan berikut 0,43 s (v2) |

### A17 — 9,67 s · 89,89–99,56 s · frame 2697–2987 (audio berakhir 98,56 s; +1,0 s hening di timeline video, D-025)

| Aspek | Rancangan |
|---|---|
| Naskah yang dicakup | **L33** Kamu akan tetap di dalam dan menunggu petugas keamanan, atau membawa adikmu keluar lewat belakang sebelum orang-orang itu mendekat? |
| Suara | L33: NARATOR |
| Timing audio v2 (s) | L33 90,10–96,56<br>Catatan: L33 90,10–96,56; tahan akhir 2,00 s (96,56–98,56). Kartu pilihan + potong ke hitam: lihat §8 butir 6<br>**D-025:** + 1,0 s hening di video → tahan akhir **3,00 s** (96,56–99,56; frame 2897–2987). Kartu pilihan tampil di rentang ini; audio v2 tidak diubah |
| Lokasi | INT ruang tamu/lorong gelap |
| Karakter | C1, ADIK; siluet warga di balik gorden |
| Aksi | C1 dan adik berdiri bergandengan di tengah. Kiri layar: jendela depan dengan siluet warga di balik gorden. Kanan layar: lorong ke pintu belakang. C1 melirik kiri, lalu kanan. Tahan diam setelah kalimat selesai. |
| Ekspresi/reaksi | C1: cemas, mengambil keputusan. Adik: menatap C1. |
| Framing & kamera | Wide statis setinggi mata, kamera menghadap barat laut: jendela depan di kiri, lorong menjauh ke pintu belakang di kanan (kedua opsi terlihat dalam satu bingkai). Wajah diletakkan lebih rendah (≈ 0,55–0,6 tinggi) karena kartu pilihan berada di atas. |
| Tujuan shot | Kedua opsi terbaca tanpa narasi tambahan; tidak ada jawaban. |
| Teks layar (selain subtitle) | Kartu pilihan muncul saat tahan akhir, berisi potongan kata persis dari L33: kiri “tetap di dalam”, kanan “keluar lewat belakang”. |
| Ambience | Hening; dengung toa masih menyala. |
| SFX | Tidak ada musik penutup; potong ke hitam setelah ± 3 s (D-025: di 99,56 s). |
| Kata / jeda | 19 kata · tahan akhir 2,00 s (v2) → 3,00 s di video (D-025) |

**Total video (D-025):** **99,56 s** (frame 0–2987 pada 30 fps) = audio v2 98,56 s + 1,0 s hening di akhir timeline video. Audio tidak diubah.

**Total nyata (audio v2):** **98,56 s** (frame 0–2957 pada 30 fps), 183 kata. Masih melebihi default 25–45 s; pemilik sudah menyetujui audio dengan durasi ini (§9.10). Bila kartu pilihan A17 butuh tahan lebih lama, video bisa diperpanjang dengan hening sesudah audio tanpa mengubah audio (§8 butir 6).

~~**Total sementara:** 183 kata → **≈ 99–111 detik** termasuk jeda.~~ (estimasi v0.1, digantikan) Angka ini **melebihi** default 25–45 s ([[STUDIO-WORKFLOW]] §3) dan kemungkinan juga perkiraan handoff 75–90 s. Naskah **tidak** dipangkas dan tempo **tidak** dipercepat; durasi nyata diukur setelah uji baca.

## 5. Rancangan audio

### 5.1 Identitas suara (inti premis)
- Tokoh “kamu” tidak punya satu pun dialog di naskah. Jadi “Itu suaramu.” hanya bisa terasa benar bila **narator = suara “kamu” = suara pengumuman**: satu suara yang sama.
- Pembedanya hanya pemrosesan:
  - Narasi: kering, dekat mikrofon.
  - Pengumuman (L2, L20, L21, L27): band-pass ala corong toa, sedikit distorsi, gema antar-rumah. Ucapan tetap jelas dan timbre tetap mirip.
- L14–L16 (pesan petugas) dibaca narator secara datar, tanpa efek toa, sambil teks pesan tampil di layar. Dengan begitu tidak ada suara ketiga yang membingungkan “siapa yang bicara”.
- Adik memakai suara kedua. Pilihan suaranya bergantung pada usia adik (pertanyaan terbuka).
- Layanan TTS, gender suara “kamu”, dan hak komersial **belum dipilih** (M1-02 masih terbuka). Tidak ada TTS berbayar di tahap ini.

### 5.2 Ambience dan SFX
- **Ambience:** malam kompleks (jangkrik, anjing jauh, dengung lampu jalan), pintu-pintu tetangga, langkah sandal, gumam warga tanpa kata jelas.
- **SFX:** klik/feedback toa nyala-putus, derit kasur, gorden, getar + notifikasi ponsel, gagang pintu, klik sakelar, gesekan kain.
- **Musik:** tidak wajib; bila dipakai hanya drone rendah. Sumber SFX/musik berlisensi = **UNKNOWN** (ROADMAP M1-01).

### 5.3 Pengulangan pengumuman (desain suara, bukan teks baru)
- “Pengumuman itu berhenti.” (L18) menyiratkan pengumuman terus berulang sejak L2.
- Rancangan: toa mengulang **L2 persis** di latar, dengan volume rendah:
  - A04: ~~sekali, di antara L4 dan L5~~ → **(D-025) pelan di bawah L5**; narator tetap jelas (jeda L4→L5 hanya 0,28 s).
  - A07–A08: samar, di sela narasi.
- Pengulangan ini terputus tepat di awal L18.
- Pengulangan tidak diberi subtitle dan tidak menambah kata baru.

## 6. Inventaris aset

Status kemampuan dibaca dari kode `studio/` pada 2026-11-15 (OBSERVATION). “Baru” = belum ada atau belum terverifikasi di pipeline.

### 6.1 Karakter

| ID | Aset | Dipakai di | Status | Catatan |
|---|---|---|---|---|
| C1 | “kamu”, `C1_LOOK` (approved D-021) | semua interior | **pakai ulang** | Wajah tersedia: mata open/closed/down, mulut flat/open/frown, alis worried/raised; `headYaw`, `lean`, pose lengan |
| C1 | pose berbaring → duduk di kasur | A02–A03 | **baru** | Saat ini hanya duduk di kursi (`c1SeatedRoot`) |
| C1 | tangan memegang ponsel | A07 | **baru (adaptasi)** | `HandProp` "phone" ada di inkbeat `Character3D`, belum di `C1` |
| C1 | menarik adik, menekan sakelar, bergandengan | A08, A12, A15, A17 | **baru** | Rig reach (`reach.ts`) hanya mengarah ke gelas; kontak dua tokoh belum ada |
| C3 | ADIK — `StickLook` baru keluarga C1, tanpa “Uq”, lebih pendek (prop `height` pada `C1Props`, tersedia) | A06, A08–A09, A11, A15, A17 | ~~baru, desain menunggu pemilik~~ → **referensi desain disetujui 2026-11-16** (D-025); model 3D preset `ADIK` dibuat, **usulan** (§10) | Jaket **dilipat/tersampir di lengan**, tidak dipakai (BODY RULE). Piyama peach **dengan celana** = pengecualian BODY RULE yang disetujui pemilik |
| W1 | warga dengan sarung **tersampir di bahu** | A05, A14 | referensi disetujui (D-025); preset `BAPAK` dibuat, **usulan** (§10) | Sarung kotak cokelat **di bahu** (diputuskan); ~~di pinggang~~ tidak dipakai |
| W2 | ibu + gendongan (torso) + anak kecil | A05, A14 | ibu dasar: referensi disetujui (D-025); preset `IBU` dibuat, **usulan** (§10). ~~Gendongan + anak yang digendong: belum~~ → **D-026:** balita varian keluarga anak (`BALITA`) + pose `IbuGendong` statis, **usulan** (§10.1) | Animasi menggendong belum ada |
| W-anak | anak warga (berdiri, lebih pendek dari adik) | A05, A14 (latar) | referensi disetujui (D-025); preset `ANAK_WARGA` dibuat, **usulan** (§10) | ~~Belum diputuskan apakah ini anak yang digendong W2~~ → bukan (D-026); anak yang digendong = `BALITA` |
| W3–W6 | warga latar, variasi `StickLook` (kaos/kemeja, peci, rambut) | A05, A13–A14, A17 (siluet) | **baru, sederhana** | Daster/rok panjang dihindari (BODY RULE) |
| — | jalan untuk keluarga C1 (warga berjalan → melambat → berhenti) | A05, A13–A14 | **baru (risiko utama)** | Jalan hanya ada di inkbeat `Character3D` (gaya berbeda); C1 belum punya siklus jalan |
| — | putaran kepala bertahap | A14 | **pakai ulang** | `headYaw` per tokoh, diatur dari plan |
| — | petugas keamanan | — | **tidak dibuat** | Hanya hadir lewat pesan ponsel |

### 6.2 Lokasi dan cahaya

| ID | Aset | Status | Catatan |
|---|---|---|---|
| BG1 | EXT jalan kompleks: deret rumah satu lantai, pagar besi, plat “7”, lampu jalan, tiang + corong toa, celah gang di belakang | **baru** | `Street.tsx` (demo) bergaya jalan Eropa “BAKERY”; `House`, `Window`, `LampPost` bisa dijadikan titik awal saja |
| BG2 | INT kamar: kasur, selimut, meja samping, jendela + gorden, pintu kamar | **baru** | — |
| BG3 | INT ruang tamu: sofa, pintu depan, jendela + gorden, lampu plafon, sakelar | **baru** | `Chair`/`Table` warung tidak cocok |
| BG4 | INT lorong + dapur + pintu belakang (lubang angin/kaca buram) | **baru** | — |
| L-a | mood `night` (bulan + praktikal hangat) untuk eksterior | **pakai ulang** | `moods.ts` |
| L-b | mood `lamp` untuk ruang tamu menyala | **pakai ulang** | — |
| L-c | interior gelap: lampu jalan biru lewat gorden, transisi lampu mati beranimasi | **baru** | `lamp`/`night` saja tidak cukup |
| L-d | cahaya layar ponsel di wajah C1 | **baru** | lampu lokal kecil |

### 6.3 Properti, UI, overlay

| ID | Aset | Status |
|---|---|---|
| P1 | ponsel 3D | adaptasi dari `HandProp` |
| P2 | jaket adik (terlipat) | baru |
| P3 | sarung tersampir, gendongan | baru |
| P4 | plat nomor “7” | pakai ulang `Label` (`kit.tsx`) |
| P5 | corong toa + tiang | baru (geometri sederhana) |
| P6 | sakelar, lampu plafon, gorden | baru (sederhana) |
| UI1 | layar chat ponsel 2D (gelembung buram + pesan L14–L16) | baru |
| UI2 | subtitle (posisi 70% tinggi), kartu pilihan atas | pakai ulang pola `pilot/overlay.tsx` |
| UI3 | label “timing sementara” | pakai ulang |

### 6.4 Teknis yang dipakai ulang tanpa perubahan
- Remotion + R3F di `studio/`, plan JSON (teks/timing/shot/beat), `shotCam`/`aim`/`camLerp`.
- `CastLight`, `SkyDome` (bulan, bintang), PostFX/tinta, font Poppins OFL.
- `tools/finish_render.mjs` (tidak menimpa file).
- Prosedur QC dari skill §5.

### 6.5 Pekerjaan baru terbesar (urutan risiko)
1. Siklus jalan → berhenti → menoleh untuk keluarga C1 (A05, A14). Jika gagal, fallback: warga sudah di posisi dan hanya bergerak sedikit, tetapi “berjalan lalu berhenti” di L28 jadi kurang terbaca.
2. Kontak tangan dua tokoh: menarik dan bergandengan.
3. Pose kasur.
4. Empat set baru dan transisi lampu mati.
5. Suara adik (usia anak = ketersediaan suara TTS anak **UNKNOWN**).

## 7. Coverage check

- Metode: kalimat dipotong otomatis dari blok handoff (UTF-8), lalu file ini dibaca ulang dan dibandingkan dengan blok tersebut. Hanya spasi yang dinormalkan.
- Semua L1–L33 muncul **sekali**, **berurutan**, di adegan A01–A17.
- Gabungan L# identik kata-per-kata dengan blok naskah handoff (183 kata). Perbedaan hanya spasi/baris baru.
- **Hasil 2026-11-15 (VERIFIED):** pemeriksaan independen membaca content.md ini lagi. Tabel §2 menghasilkan 33/33 kalimat yang identik dengan blok handoff. Kutipan di storyboard §4 berurutan L1→L33 dan identik dengan blok handoff.
- **Ulang 2026-11-16 (VERIFIED, skrip):** setelah §4 diselaraskan ke audio v2 (draft v0.2). Tabel §2 = 33 kalimat. Kutipan §4 = 33 kalimat, urutan L1→L33, identik dengan §2. Gabungan teks ada utuh di blok handoff §5 (183 kata, hanya spasi dinormalkan).

| L# | Adegan |
|---|---|
| L1 | A01 |
| L2 | A02 |
| L3 | A03 |
| L4 | A04 |
| L5 | A04 |
| L6 | A05 |
| L7 | A05 |
| L8 | A05 |
| L9 | A06 |
| L10 | A06 |
| L11 | A07 |
| L12 | A07 |
| L13 | A07 |
| L14 | A07 |
| L15 | A07 |
| L16 | A07 |
| L17 | A08 |
| L18 | A09 |
| L19 | A09 |
| L20 | A10 |
| L21 | A10 |
| L22 | A10 |
| L23 | A11 |
| L24 | A11 |
| L25 | A12 |
| L26 | A13 |
| L27 | A13 |
| L28 | A14 |
| L29 | A14 |
| L30 | A15 |
| L31 | A16 |
| L32 | A16 |
| L33 | A17 |

## 8. Pertanyaan terbuka untuk pemilik

1. **Adik:** usia dan gender **diputuskan 2026-11-15** (perempuan, ± 12–13 tahun; §9.1). ~~Desain visual (pakaian torso, rambut, warna jaket) ditunda.~~ → **Diputuskan 2026-11-16 (D-025):** bob hitam, piyama peach + celana, jaket mustard di lengan.
2. ~~**Sarung W1 (ditunda):**~~ **Diputuskan 2026-11-16 (D-025): di bahu.** Pertanyaan lama: tersampir di bahu (sesuai BODY RULE, direkomendasikan), atau di pinggang (perlu pengecualian aturan)?
3. ~~Gender dan karakter suara “kamu”~~ diputuskan: laki-laki, 20-an, tenang tertahan (§9.1). Masih terbuka: lisensi komersial ElevenLabs untuk publikasi (§9.2). **[Pembaruan 2026-11-17: ditutup atas arahan pemilik, paket Pro diasumsikan; lihat tabel Status.]** ~~durasi nyata~~ → 98,56 s (audio v2 disetujui).
4. ~~**Persetujuan storyboard §4 draft v0.2**~~ → **disetujui 2026-11-16** dengan penyesuaian (D-025).

**Keputusan visual/suara terbuka yang muncul dari timing audio v2 (2026-11-16).** Audio terkunci; jalan keluarnya di gambar atau lapisan SFX, bukan di voice-over.

5. ~~**A04 — pengulangan toa L2.**~~ → **Diputuskan (D-025): opsi (a), pelan di bawah L5.** Rencana §5.3: toa mengulang L2 *di antara* L4 dan L5. Jeda nyata hanya 0,28 s (10,95–11,22), sedangkan L2 berdurasi ± 2,4 s. Opsi: (a) L2 diulang pelan **di bawah** L5 sebagai lapisan latar (rekomendasi: tetap menanam “pengumuman terus berulang” untuk L18); (b) diulang sesudah L5, di A05; (c) dibuang di A04, pengulangan baru terdengar di A07–A08.
6. ~~**A17 — tahan akhir.**~~ → **Diputuskan (D-025): +1,0 s hening di video; kartu ± 3 s.** Rencana: tahan diam, kartu pilihan, potong ke hitam setelah ± 3 s. Audio v2 hanya menyisakan 2,00 s (96,56–98,56). Opsi: (a) perpanjang video ± 2–3 s dengan hening/ambience sesudah audio (rekomendasi: kartu dua pilihan butuh waktu baca); (b) kartu muncul lebih awal, di akhir L33 (mis. ≈ 94 s); (c) tetap 2,0 s.
7. ~~**A07 — potongan wajah C1 di L16.**~~ → **Diputuskan (D-025): pesan L16 tampil sampai selesai, lalu wajah.** Sisa terbuka: geser potongan A07→A08 ke ± 41,15 s atau tidak (saat animatic). Subtitle L14–L16 disembunyikan karena gelembung pesan menampilkan teksnya. Bila shot pindah ke wajah C1 saat L16 (38,53–40,10), teks L16 tidak terlihat sama sekali. Opsi: (a) wajah C1 diterangi layar sesudah L16 (hanya ± 0,5 s); (b) tetap di layar ponsel sampai akhir A07, wajah dipindah ke awal A08; (c) potong ke wajah di L16 dan tampilkan subtitle L16.
8. ~~**A10 — 8,78 s**~~ → **Diputuskan (D-025): dua shot + gerak kamera pelan** ~~+ reaksi karakter~~ (D-026: tanpa shot reaksi; reaksi adik di A11; lihat butir 16). (estimasi lama 5–6 s) untuk dua shot statis (corong toa 5,7 s, plat “7” 3,1 s). Opsi: (a) tambah shot di antara L21 dan L22, mis. jalan kompleks dengan warga berhenti sejenak saat nomor disebut; (b) gerak kamera pelan pada kedua shot (tilt/push-in) tanpa shot baru; (c) biarkan statis.
9. **A14 dan A16 lebih pendek** (D-025: dievaluasi saat animatic; perpanjangan belum disetujui) (7,41 s dan 6,65 s; estimasi lama 9–10 s). Tolehan A14 tetap muat (6 × 0,4 s dalam L29 2,64 s). A16: push-in lorong ± 4,3 s. Hanya dicatat; bertindak bila animasi terasa terburu-buru.

**Keputusan visual lama yang masih terbuka** (ringkasan; detail di §6):

10. ~~**Desain adik (C3)**~~ → referensi disetujui (D-025). Model 3D = usulan (butir 18).
11. ~~**Sarung W1**~~ → di bahu (D-025).
12. ~~**W2 + anak**~~ → **Diputuskan (D-026):** balita 2–3 th varian keluarga anak, tanpa referensi Flow baru; satu pose gendong statis (§10.1). Pertanyaan lama: ibu dasar sudah disetujui (D-025); gendongan dan anak yang digendong (L8). Apakah “anak warga” yang berdiri adalah anak yang sama, atau perlu bayi/balita terpisah?
13. ~~**Siklus jalan warga (risiko utama §6.5)**~~ → **dibuat dan dipakai (D-027, §11; panduan [[npc-presets]])**. Pertanyaan lama: buat siklus jalan baru untuk keluarga C1, atau terima fallback “warga sudah di posisi, gerak sedikit” (L28 kurang terbaca).
14. **Musik**: tanpa musik, atau drone rendah (§5.2).
15. **Sumber SFX/ambience berlisensi**: UNKNOWN (ROADMAP M1-01). Tanpa ini rough cut hanya bisa memuat voice-over + hening.

**Keputusan berikutnya (dicatat 2026-11-16):**

16. ~~**A10 “reaksi karakter”**~~ → **Diputuskan (D-026): tidak ada shot reaksi di A10; dua shot (corong toa, plat “7”) dengan gerak kamera pelan; reaksi adik tetap di A11.** Pertanyaan lama: kedua shot A10 (corong toa, plat “7”) tidak memuat tokoh. Maksudnya (a) sisipan reaksi C1/adik di dalam A10 (menambah shot ketiga), (b) reaksi di awal A11, atau (c) warga di latar shot plat “7”? Claude tidak menambah shot sebelum dijawab.
17. ~~**A07 → A08**~~ → **dipilih 41,08 s sebagai pilihan editing untuk ditinjau (§11)**. Pertanyaan lama: geser potongan sampai ± 41,15 s (wajah C1 ± 1 s) atau tetap 40,63 s (wajah 0,53 s) — saat animatic.
18. ~~**Model 3D adik + NPC + balita + pose gendong (lineup v3, §10.1)**~~ → **disetujui (D-027)** sebagai dasar produksi.: persetujuan visual pemilik. Persetujuan referensi **bukan** persetujuan model.
19. ~~**Referensi adik**~~ → **disalin 2026-11-16** ke `refrences/C3_adik_ref_v1.jpg` (md5 identik `e738715f…`, sumber tetap). Catatan lama: `studio/out/rev/C3_adik_ref_v1.jpg` berada di folder kerja yang di-gitignore. Usul: salin (tanpa menimpa) ke `refrences/C3_adik_ref_v1.jpg` agar tercadang.
20. Gerak berjalan warga (butir 13), musik (14), dan sumber SFX (15) tetap terbuka. Lisensi komersial ElevenLabs (D-004, §9.2) juga tetap terbuka. **[Pembaruan 2026-11-17: poin ElevenLabs dan sumber SFX ditutup atas arahan pemilik; lihat tabel Status.]**

## 9. Paket voice-over (ElevenLabs) — draft v0.1, 2026-11-15

> Storyboard §4 tetap **draft rencana**. Durasi akhir mengikuti audio nyata (lihat §9.7). Desain visual adik belum ditetapkan.

### 9.1 Casting (diputuskan pemilik 2026-11-15)
- **Narator = suara “kamu” = suara pengumuman:** laki-laki, terdengar usia 20-an, tenang tertahan. Satu suara dan satu voice ID untuk narasi dan pengumuman.
- **Adik:** perempuan, ± 12–13 tahun. Polos dan mengantuk di D01; takut dan berbisik di D02.
- Pengumuman direkam **bersih**. Efek toa ditambahkan di pipeline setelah audio diterima.

### 9.2 Fakta layanan (dicek 2026-11-15)
- VERIFIED: Eleven Multilingual v2 (`eleven_multilingual_v2`) dan Eleven v3 (`eleven_v3`) mendukung bahasa Indonesia. Batas per permintaan: 10.000 karakter (v2) dan 5.000 karakter (v3). Sumber: https://elevenlabs.io/docs/overview/models
- OBSERVATION: halaman harga menyebut paket Free 10.000 kredit per bulan. “Commercial License” baru tercantum di paket Starter (US$6/bulan; bulan pertama US$1). Sumber: https://elevenlabs.io/pricing
- **Konsekuensi:** sampel dan uji dengar boleh memakai paket Free. Audio untuk video yang **dipublikasikan** kemungkinan butuh lisensi komersial, sehingga perlu keputusan baru karena anggaran Rp0 (D-004). Itu diputuskan setelah sampel disukai, bukan sekarang.
- **Pembaruan 2026-11-17 (arahan pemilik):** narasi episode ini diperlakukan sebagai dibuat dengan paket Pro. Bukan hasil verifikasi independen atas paket akun. Catatan di atas adalah riwayat per 2026-11-15.
- VERIFIED (dicek 2026-11-15 malam, https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices, bagian "Prompting Eleven v4"): `eleven_v4` mendukung audio tags dalam kurung siku, diletakkan tepat sebelum atau sesudah bagian yang diatur. Daftar tag tidak lengkap; contoh resmi memuat tag deskriptif, mis. `[Low, steady voice, restrained urgency]`, `[Quietly, with controlled fear]`, `[whispers]`, `[sighs]`. KAPITAL menambah penekanan; elipsis menambah jeda. Tag SSML `<break>` **tidak** didukung v4/v3. Pengaruh stability 0,77 terhadap kepatuhan tag tidak dibahas (UNKNOWN). Tag dan kapital hanya di salinan TTS; naskah terkunci tidak berubah.
- Kebutuhan teks: total 1261 karakter; sampel 114 karakter. Kredit per karakter bergantung model (UNKNOWN sampai terlihat di akun).

### 9.3 Pengaturan awal (HYPOTHESIS, disesuaikan setelah dengar)
- **Model:** Multilingual v2. Teks bisa ditempel apa adanya tanpa tag, dan hasilnya relatif stabil antar-generasi. Eleven v3 menjadi cadangan bila napas/serak P01 tidak muncul; lihat §9.6.
- **Narator (N##):** stability ± 45–50, similarity ± 75, style 0–15, speaker boost aktif, speed 1,0.
- **Pengumuman (P##):** voice ID **sama** dengan narator, similarity sama, stability lebih tinggi (± 60–65) supaya lebih rata. Hanya stability yang berubah.
- **Adik (D##):** stability ± 40, similarity ± 75, style ± 15–25, speed 1,0.
- Catat model, nama + ID suara, semua slider, dan seed (bila ada) di §9.8 untuk setiap take yang dipakai.

### 9.4 Memilih suara di Voice Library
- **Narator:** laki-laki, muda (young/early 20s–30), kalem, narasi/cerita. Uji dulu dengan teks N01 sebelum dipakai.
- **Adik:** perempuan remaja/muda. Suara anak yang natural belum tentu tersedia (UNKNOWN). Jika tidak ada yang cocok, catat 2–3 kandidat terdekat untuk dibandingkan; jangan memaksakan pitch shift.
- Jangan mengkloning suara orang nyata tanpa izin tertulis.

### 9.5 Segmen (teks siap tempel)
- Isi blok kode = **teks yang dibacakan**, persis dari naskah. Arahan pembawaan ada di luar blok dan **tidak ikut ditempel**.
- Segmen dikelompokkan supaya intonasi mengalir; tidak satu file per kalimat.
- Pengumuman dan dialog adik dipisah dari narasi karena pengaturan atau suaranya berbeda, dan pengumuman nanti diberi efek toa.
- Jeda panjang (hening di L18–L19, tahan akhir) diatur saat editing, bukan dengan menambah teks.
- **Lokasi file:** `_media/2026-11-002/audio/vo_raw/` (di luar Git). Nama: `2026-11-002_vo_<ID>_take<NN>.<ext>`. Simpan dalam format terbaik yang tersedia di akun, mis. mp3 44,1 kHz atau WAV bila ada, lalu catat formatnya.
- Buat 3–4 take untuk segmen pendek (D01, D02, P01). Kalimat pendek lebih sering meleset.

| ID | Peran | L# | Karakter | Sampel |
|---|---|---|---|---|
| N01 | NARATOR | L1 | 60 | **ya** |
| P01 | PENGUMUMAN | L2 | 37 | **ya** |
| N02 | NARATOR | L3–L9 | 268 | — |
| D01 | ADIK | L10 | 17 | **ya** |
| N03 | NARATOR | L11–L13 | 91 | — |
| N04 | NARATOR | L14–L16 | 78 | — |
| N05 | NARATOR | L17–L19 | 113 | — |
| P02 | PENGUMUMAN | L20–L21 | 53 | — |
| N06 | NARATOR | L22–L23 | 32 | — |
| D02 | ADIK | L24 | 15 | — |
| N07 | NARATOR | L25–L26 | 65 | — |
| P03 | PENGUMUMAN | L27 | 48 | — |
| N08 | NARATOR | L28–L33 | 384 | — |

#### Tahap 1 — sampel (buat ini dulu)

**N01 · NARATOR** → `2026-11-002_vo_N01_take01.mp3`  
Arahan: Pembuka. Tenang tertahan, suara rendah seperti baru bangun dan bercerita pelan di malam hari. Tidak dramatis. Ada jeda kecil sesudah “Jam dua pagi,”.

```text
Jam dua pagi, kamu terbangun karena pengeras suara kompleks.
```

**P01 · PENGUMUMAN** → `2026-11-002_vo_P01_take01.mp3`  
Arahan: Pengumuman pertama. Suara sama dengan narator, tetapi diucapkan seperti membaca pengumuman resmi: tegak, rata, sedikit lebih lambat, tanpa emosi. **Wajib terdengar:** tarikan napas pendek sebelum kalimat dan sedikit serak di ujung kalimat, karena L5 menyebut keduanya. Rekam bersih; efek toa ditambahkan nanti.

```text
“Seluruh warga diminta keluar rumah.”
```

**D01 · ADIK** → `2026-11-002_vo_D01_take01.mp3`  
Arahan: Adik (perempuan ± 12–13 tahun). Polos, masih mengantuk, sedikit berharap. Nada naik ringan di “kan?”. Bukan berbisik.

```text
“Kita ikut, kan?”
```

#### Tahap 2 — audio lengkap (setelah sampel disetujui)

N01, P01, dan D01 dari sampel dipakai ulang bila diterima.

**N02 · NARATOR** → `2026-11-002_vo_N02_take01.mp3`  
Arahan: Mengalir sebagai satu rangkaian. “Kamu langsung duduk.” pendek dan cepat. “Itu suaramu.” lebih pelan dan tertahan. L5 menurun seperti sedang menyadari. L6–L9 kembali tenang dan deskriptif.

```text
Kamu langsung duduk. Itu suaramu. Intonasinya, cara menarik napas, bahkan suara serak di ujung kalimatnya. Dari jendela, kamu melihat tetangga mulai keluar. Ada yang masih memakai sarung. Ada yang menggendong anaknya. Adikmu muncul di pintu kamar sambil membawa jaket.
```

**N03 · NARATOR** → `2026-11-002_vo_N03_take01.mp3`  
Arahan: Mulai lebih cepat dan tegang. Ada jeda kecil sebelum “Lalu masuk pesan…”.

```text
Kamu mengambil ponsel. Grup warga penuh pertanyaan. Lalu masuk pesan dari petugas keamanan.
```

**N04 · NARATOR** → `2026-11-002_vo_N04_take01.mp3`  
Arahan: Narator membaca isi pesan. Datar, pelan, jelas, tanpa akting petugas dan tanpa efek. Tiap kalimat diberi jeda pendek.

```text
“Jangan keluar dulu. Ruang pengeras suara terkunci. Kuncinya masih saya bawa.”
```

**N05 · NARATOR** → `2026-11-002_vo_N05_take01.mp3`  
Arahan: L17 tegas dan cepat. L18 pelan dan hampir berbisik. L19 tertahan. Jeda hening antar-kalimat diatur saat editing, bukan di TTS.

```text
Kamu menarik adikmu menjauh dari pintu. Pengumuman itu berhenti. Beberapa detik kemudian, suaramu terdengar lagi.
```

**P02 · PENGUMUMAN** → `2026-11-002_vo_P02_take01.mp3`  
Arahan: Pengumuman. Pembawaan dan pengaturan sama dengan P01, termasuk napas dan serak di ujung. “Kami masih menunggu.” sedikit lebih lambat dan tetap tanpa emosi.

```text
“Keluarga di rumah nomor tujuh. Kami masih menunggu.”
```

**N06 · NARATOR** → `2026-11-002_vo_N06_take01.mp3`  
Arahan: “Nomor rumahmu.” pelan dan berat. “Adikmu menatapmu.” lembut.

```text
Nomor rumahmu. Adikmu menatapmu.
```

**D02 · ADIK** → `2026-11-002_vo_D02_take01.mp3`  
Arahan: Adik. Berbisik dan takut, dengan napas tertahan. Lebih pelan daripada D01.

```text
“Kok dia tahu?”
```

**N07 · NARATOR** → `2026-11-002_vo_N07_take01.mp3`  
Arahan: Tenang tertahan dan lebih pelan. Volume turun karena ruangan baru saja gelap.

```text
Kamu mematikan lampu ruang tamu. Pengeras suara kembali berbunyi.
```

**P03 · PENGUMUMAN** → `2026-11-002_vo_P03_take01.mp3`  
Arahan: Pengumuman. Pembawaan dan pengaturan sama dengan P01. Tetap rata; justru ketenangannya yang membuat seram.

```text
“Mematikan lampu tidak berarti rumahnya kosong.”
```

**N08 · NARATOR** → `2026-11-002_vo_N08_take01.mp3`  
Arahan: Klimaks sebagai satu rangkaian. L28–L29 pelan, diberi ruang. L30 lirih. L31–L32 waspada. L33 adalah pertanyaan langsung ke penonton: jelas, tidak tergesa, tidak melodramatis, dan nada akhirnya bertanya.

```text
Di luar, tetangga yang tadi berjalan mulai berhenti. Satu per satu, mereka menoleh ke rumahmu. Adikmu menggenggam tanganmu semakin erat. Pintu belakang mengarah ke gang sempit. Tapi dari tempatmu berdiri, kamu tidak bisa melihat siapa yang ada di sana. Kamu akan tetap di dalam dan menunggu petugas keamanan, atau membawa adikmu keluar lewat belakang sebelum orang-orang itu mendekat?
```

### 9.5a Salinan TTS dengan audio tags (`eleven_v4`, generasi manual di situs)

> Kata, urutan, dan tanda baca sama dengan §9.5. Tambahan hanya tag `[...]` dan KAPITAL untuk penekanan (dasar: §9.2). Model v4, stability 0,77, similarity 0,43. Tanpa tombol Enhance. N02 dan N03 dibuat pemilik tanpa salinan di sini; N04 diterima pemilik 2026-11-15.

- **N04** (Dhani): `[urgent warning, firm but not shouting] “JANGAN keluar dulu. [slower, serious, clear] Ruang pengeras suara terkunci. Kuncinya masih saya bawa.”`
- **N05** (Dhani): `[quick, tense] Kamu menarik adikmu menjauh dari pintu. [quietly, almost a whisper] Pengumuman itu berhenti. [restrained, uneasy] Beberapa detik kemudian, suaramu terdengar lagi.`
- **P02** (Dhani): `[short breath] [flat, formal announcement, slightly hoarse] “Keluarga di rumah nomor tujuh. [slower] Kami masih menunggu.”`
- **N06** (Dhani): `[slow, heavy] Nomor rumahmu. [softly] Adikmu menatapmu.`
- **D02** (Zorin): `[whispers, scared, holding her breath] “Kok dia tahu?”`
- **N07** (Dhani): `[quiet, restrained, low voice] Kamu mematikan lampu ruang tamu. Pengeras suara kembali berbunyi.`
- **P03** (Dhani): `[short breath] [flat, calm, formal announcement, slightly hoarse] “Mematikan lampu tidak berarti rumahnya kosong.”`
- **N08** (Dhani): `[slow, quiet, unsettled] Di luar, tetangga yang tadi berjalan mulai berhenti. Satu per satu, mereka menoleh ke rumahmu. [softly] Adikmu menggenggam tanganmu semakin erat. [wary, low voice] Pintu belakang mengarah ke gang sempit. Tapi dari tempatmu berdiri, kamu tidak bisa melihat siapa yang ada di sana. [calm, clear, asking the listener directly] Kamu akan tetap di dalam dan menunggu petugas keamanan, atau membawa adikmu keluar lewat belakang sebelum orang-orang itu mendekat?`

### 9.6 Cadangan bila napas/serak P01 tidak muncul
- Coba Eleven v3 untuk P01 dengan tag arahan, mis. `[inhales]` di depan kalimat. Tag adalah instruksi untuk model, bukan bagian naskah, dan tidak boleh terdengar sebagai kata.
- Syarat:
  - Narator juga diuji di v3 dengan suara yang sama. Mencampur model berisiko membuat identitas suara berbeda.
  - Dengarkan apakah tag terucap sebagai kata.
- Alternatif tanpa tag: pilih take v2 yang secara alami memuat napas/serak. Napas pendek juga bisa disambung saat editing dari take narator yang sama.

### 9.7 Setelah audio lengkap diterima (langkah 1 dan 4 dikerjakan di §9.9; 2 hanya estimasi dari jeda)
1. Ukur durasi tiap file (`ffprobe`). Susun timeline dengan jeda dari storyboard; catat total nyata.
2. Ambil timing per kata/kalimat: forced alignment (alat dipilih nanti) atau penandaan manual. Hasilnya jadi start/end per L# di plan JSON.
3. Revisi durasi adegan storyboard §4 mengikuti audio; laporkan ke pemilik bila total berubah jauh dari estimasi ≈ 99–111 s.
4. Efek toa untuk P01–P03 di pipeline, mis. FFmpeg band-pass + sedikit distorsi + gema. Diuji: pengucapan tetap jelas dan timbre tetap dikenali sama.
5. Baru setelah itu: subtitle, animasi detail, render bersuara.

### 9.8 Log take (diisi saat generasi)

| File | Model | Suara (nama + ID) | Stability / Similarity / Style / Speed | Format | Durasi (s) | Dipilih? | Catatan |
|---|---|---|---|---|---|---|---|
| `2026-11-002_vo_N01_take01.mp3` | `eleven_v4` (VERIFIED) | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` (VERIFIED) | stability 0,77 / similarity 0,43 / style dan speed tidak ada di setelan v4 (VERIFIED) | mp3 44,1 kHz mono ~161 kbps (`mp3_44100_128` menurut API) | 4,05 | **ya** (acuan suara, diterima pemilik 2026-11-15) | Diterima 2026-11-15 19:41. md5 `8849ef9f…`. −21,0 LUFS, peak −3,5 dBFS. F0 median ± 130 Hz (estimasi kasar). History `cMDWj40Uqyg9glV3ltTs` (19:39:29 WIB), md5 identik. Teks generasi = naskah L1 persis |
| `2026-11-002_vo_P01_take01.mp3` | `eleven_v4` (VERIFIED, via sumber) | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` (VERIFIED, via sumber) | stability 0,77 / similarity 0,43 (VERIFIED, via sumber) | mp3 44,1 kHz mono ~129 kbps, encoder Lavf58 (berbeda dari dua file lain) | 2,82 | **ya** (acuan suara, diterima pemilik 2026-11-15) | Diterima 19:44. md5 `ca0b3ede…`. −16,1 LUFS, peak −1,8 dBFS (± 5 dB lebih keras dari N01). F0 median ± 142 Hz. **Potongan dari history `3sxwOVHJqYWGagTKOLht`** (19:43:28 WIB), detik 22,268 sampai akhir (25,08), tanpa perubahan volume; lihat catatan 2026-11-15 malam |
| `2026-11-002_vo_D01_take01.mp3` | `eleven_v4` (VERIFIED) | Zorin - Friendly, Calm and Soft · `19zQpXlAQKHlcmXgXfLr` (VERIFIED) | stability 0,77 / similarity 0,43 (VERIFIED) | mp3 44,1 kHz mono ~232 kbps (`mp3_44100_128` menurut API) | 1,31 | **ya** (acuan suara, diterima pemilik 2026-11-15) | Diterima 19:50. md5 `88681db0…`. −22,6 LUFS, peak −6,8 dBFS. F0 median ± 291 Hz. History `d0OkRKfm2btmn2ubrBAT` (19:50:13 WIB), md5 identik. Teks generasi `“.....Kita ikut, kan?”` (ada `.....` di depan; naskah tidak berubah) |
| `2026-11-002_vo_N02_take01.mp3` | `eleven_v4` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 17,16 | ya (pemilik, 2026-11-15) | History `0x9Cmtl1c4dbWyFVp4XQ` (20:47 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5. −21,9 LUFS, peak −3,6 dBFS, md5 `78c2d86e…` |
| `2026-11-002_vo_N03_take01.mp3` | `eleven_v4` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 6,69 | ya (pemilik, 2026-11-15) | History `LGa3hoFWKwGTBekb633z` (20:50 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5. **Teks generasi memuat pagar ```` ```text ```` di awal dan akhir**; periksa dengan mendengar apakah ikut terucap. −21,0 LUFS, peak −4,7 dBFS, md5 `5d2ddd95…` |
| `2026-11-002_vo_N04_take01.mp3` | `eleven_v4_exp` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 5,07 | ya (pemilik, 2026-11-15) | History `jFFsOkK60mt9VgaHMcEO` (21:34 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −19,0 LUFS, peak −1,8 dBFS, md5 `2d1f9f97…` |
| `2026-11-002_vo_N05_take01.mp3` | `eleven_v4_exp` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 7,08 | ya (pemilik, 2026-11-15) | History `Kj19VaYB9tLGIIEKn1lo` (21:37 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −19,6 LUFS, peak −1,2 dBFS, md5 `133074ae…` |
| `2026-11-002_vo_P02_take01.mp3` | `eleven_v4_exp` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 4,99 | ya (pemilik, 2026-11-15) | History `BmABAsI67jOTIAYisRqI` (21:38 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −20,3 LUFS, peak −4,4 dBFS, md5 `260138aa…` |
| `2026-11-002_vo_N06_take01.mp3` | `eleven_v4` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 4,44 | ya (pemilik, 2026-11-15) | History `r2FGavZBaYprJXkTWS2Q` (21:39 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −22,4 LUFS, peak −6,4 dBFS, md5 `defc07cc…` |
| `2026-11-002_vo_D02_take01.mp3` | `eleven_v4` | Zorin - Friendly, Calm and Soft · `19zQpXlAQKHlcmXgXfLr` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 3,24 | ya (pemilik, 2026-11-15) | History `CuLqmQzJOfHUcRY1TGr9` (21:40 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −25,7 LUFS, peak −4,2 dBFS, md5 `3946b7fa…` |
| `2026-11-002_vo_N07_take01.mp3` | `eleven_v4` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 4,68 | ya (pemilik, 2026-11-15) | History `85IkGBoAtXW3PZTbsU6T` (21:41 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −23,3 LUFS, peak −6,6 dBFS, md5 `8a86b7b0…` |
| `2026-11-002_vo_P03_take01.mp3` | `eleven_v4_exp` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 4,28 | ya (pemilik, 2026-11-15) | History `8Hoq4z7whuPBbFWSiKbr` (21:41 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −21,8 LUFS, peak −4,5 dBFS, md5 `2f2e119f…` |
| `2026-11-002_vo_N08_take01.mp3` | `eleven_v4` | Dhani - Professional, Clear and Engaging · `20ptB7Wn4Q2sMkAxK1qK` | 0,77 / 0,43 | mp3 44,1 kHz mono 128 kbps | 22,83 | ya (pemilik, 2026-11-15) | History `i3qK1bOI5Agg2PkZ8E2q` (21:42 WIB), md5 identik. Dibuat pemilik di situs. Teks = naskah §9.5 + tag §9.5a. −23,9 LUFS, peak −4,8 dBFS, md5 `a250a0f5…` |

Catatan pemeriksaan 2026-11-15 (Claude Code):
- Claude **tidak bisa mendengarkan** audio. Angka di atas hasil pengukuran sinyal (ffprobe, ebur128, estimasi F0 autokorelasi), bukan penilaian akting.
- File berada di luar paket: `Downloads/ElevenLabs_2026-11-15T12_42_19_Dhani - Professional, Clear and Engaging_pvc_s77_sim43_v4.mp3` (25,08 s, F0 median ± 129 Hz). Nama file menyiratkan suara “Dhani”, stability 77, similarity 43; hubungannya dengan N01/P01 belum diketahui.

Catatan pemeriksaan 2026-11-15 malam (Claude Code, API ElevenLabs read-only, tanpa kredit):
- Sumber: `GET /v1/history` dan `GET /v1/history/{id}/audio` dengan API key di `.env.local`. Tidak ada generasi baru. Akun: tier `free`, 706 / 10.000 karakter terpakai.
- Kecocokan dibuktikan dengan **md5 identik** antara audio history dan file lokal, bukan dari nama file atau nada.
- Model semua item TTS hari ini `eleven_v4`, bukan Multilingual v2 seperti hipotesis §9.3. `eleven_v4` belum diverifikasi di halaman models (§9.2 hanya v2/v3). Setiap generasi menghasilkan dua item: `eleven_v4` dan `eleven_v4_exp`.
- Dua item Zorin `eleven_multilingual_v2` (19:52 WIB, setelah D01 diterima) memuat teks arahan dan pagar kode; tidak dipakai di sampel.
- **P01:** dua item history berisi teks P01 (`3sxwOVHJqYWGagTKOLht` 25,08 s dan `0IUuMC6JIcAu3I0xpSHQ` 24,92 s, Dhani `20ptB7Wn4Q2sMkAxK1qK`, v4, 0,77/0,43). Teks yang dikirim = **seluruh blok arahan + pagar kode** (369 karakter), bukan hanya L2. Durasi `3sxw…` sama dengan file di Downloads (25,08 s). P01 lokal (2,82 s, Lavf58) kemungkinan potongan dari salah satunya (HYPOTHESIS, belum dibuktikan).
- ~~Konsekuensi: N01 dan sumber P01 memakai voice ID yang sama **bila** P01 memang dipotong dari item Dhani di atas. Itu belum terbukti.~~ Terbukti, lihat poin berikut.
- **P01 = potongan `3sxwOVHJqYWGagTKOLht` (VERIFIED, analisis sinyal lokal).** Metode: korelasi silang ternormalisasi (FFT) pada audio hasil decode, mono, 44,1 kHz, lalu gain optimal + residu. Hasil: puncak NCC 1,0000 pada offset 22,268 s; gain −0,00 dB; SNR residu 91,2 dB; puncak kedua hanya 0,103. Pembanding `0IUu…` NCC 0,127 dan N01 0,083. Potongan berakhir tepat di ujung file (22,268 + 2,81 = 25,08 s). md5 berbeda hanya karena encode ulang (Lavf58).
- Konsekuensi: N01 dan P01 memakai **voice ID dan model yang sama** (Dhani `20ptB7Wn4Q2sMkAxK1qK`, `eleven_v4`, 0,77/0,43). Selisih loudness ± 5 dB berasal dari generasi aslinya, bukan dari pemotongan. Generasi sumber membacakan teks arahan sebelum L2. Napas sebelum kalimat bisa saja ikut terpotong; itu dinilai dengan mendengar.
- Bila P01 perlu dibuat ulang: teks hanya `“Seluruh warga diminta keluar rumah.”`, Dhani `20ptB7Wn4Q2sMkAxK1qK`, `eleven_v4`, stability 0,77, similarity 0,43, `mp3_44100_128`, tanpa paragraf arahan. Kredit ± 37 karakter. Hanya setelah disetujui pemilik.

Catatan 2026-11-15 malam — Tahap 2 (10 segmen) **terblokir**:
- Pemilik menerima N01, P01, D01 sebagai acuan suara episode (sesudah mendengarkan). Pemilik mengizinkan kuota gratis untuk satu take per segmen tersisa (1147 karakter; sisa kuota 9294).
- Skrip `scripts/elevenlabs_tts.py` (teks diambil langsung dari blok §9.5, menolak menimpa, menulis sidecar JSON). Dry-run: 10 segmen, 1147 karakter, teks persis.
- Uji pertama (D02, Zorin, `eleven_v4`) ditolak API: HTTP 402 `paid_plan_required` — “Free users cannot use library voices via the API.” (request_id `03c652a8140c0fd0f37ffa5bcc1b5b92`). Kuota tetap 706/10.000; tidak ada file dibuat. Tidak dicoba ulang.
- VERIFIED: Dhani dan Zorin adalah voice library (`professional`). Paket Free hanya bisa memakainya lewat situs web, bukan API.


### 9.9 Preview audio lengkap v1 dan timing storyboard (2026-11-15)

> Review internal. **Belum disetujui** pemilik. Bukan audio siap publikasi; hak komersial ElevenLabs (§9.2, D-004) tetap terbuka.

**File**
- Preview: `_media/2026-11-002/audio/preview/2026-11-002_vo_preview_v1.mp3` (dengar) dan `.wav` (master 24-bit). Durasi **100,00 s**.
- Timing per L# dan segmen: `_media/2026-11-002/audio/preview/2026-11-002_vo_preview_v1_timing.json`.
- Salinan efek toa (untuk dengar terpisah): `_media/2026-11-002/audio/vo_fx/2026-11-002_vo_P0{1,2,3}_take01_toa_v1.wav`.
- Mentah di `vo_raw/` tidak diubah (md5 sama dengan history).
- Perintah ulang: `python scripts/vo_preview.py --config 04-PRODUCTION/2026-11-002/render/vo-preview-v1.json` (menolak menimpa; naikkan `version`/`name` untuk v2).

**Penyusunan**
- Urutan N01 · P01 · N02 · D01 · N03 · N04 · N05 · P02 · N06 · D02 · N07 · P03 · N08.
- Hanya hening di tepi file yang dibuang (di bawah −45 dB, menyisakan 0,12 s). Wilayah yang dibuang semuanya ≤ −61,5 dB: dengung atau decay, tidak ada napas atau kata. Tidak ada kata dipotong dan tidak ada perubahan kecepatan.
- Jeda ucapan-ke-ucapan (s): masuk 0,5 · N01→P01 0,7 · P01→N02 1,0 · N02→D01 0,6 · D01→N03 0,8 · N03→N04 0,5 · N04→N05 0,9 · **L18→L19 2,0** (“Beberapa detik kemudian”; N05 dibelah di titik hening −87 dB) · N05→P02 0,7 · P02→N06 1,3 · N06→D02 0,6 · D02→N07 1,0 · N07→P03 0,9 · P03→N08 1,5 · tahan akhir 2,0.
- Volume: satu gain per segmen ke target loudness (narasi −20 LUFS; D01 −21; N07 −21,5 karena “volume turun”; D02 −23 karena berbisik; pengumuman −19 setelah efek). Master: two-pass loudnorm linear ke −16 LUFS, true peak −1,5 dB.
- Efek toa (P01–P03, salinan): high-pass 350 Hz, low-pass 3,8 kHz, puncak +5 dB di 1,8 kHz, soft-clip ringan, gema 110/240 ms.

**Pemeriksaan teknis** (bukan penilaian pendengaran)
- Hasil: −16,3 LUFS, LRA 5,4 LU, peak −1,5 dBFS, 0 sampel clipping. MP3 44,1 kHz mono 192 kbps.
- Keseimbangan: RMS ucapan narasi −15,0 s.d. −16,2 dB. D02 −18,7 dB (bisikan, disengaja). Pengumuman −15,3 / −18,1 / −17,2 dB.
- Sambungan: 13/13 segmen hadir; tepi semua file mentah naik dari hening (tidak ada potongan keras). Jeda antarsegmen bersih (≤ −61 dB), kecuali ekor gema toa sesudah P02/P03 dan sisa napas sebelum L19 (≈ −46 dB), yang memang dipertahankan.
- Batas L# diperkirakan dari jeda dalam tiap file (dicocokkan dengan proporsi jumlah karakter). Ini **estimasi ± 0,1–0,3 s**, bukan forced alignment.
- **Belum diperiksa (perlu didengar):** akting dan emosi; apakah tag atau pagar kode di N03 ikut terucap; kejelasan ucapan setelah efek toa; apakah identitas suara pengumuman tetap dikenali sama dengan narator.

**Timing L# (s, dari preview v1)**
L1 0,50–4,42 · L2 5,12–7,48 · L3 8,72–9,79 · L4 10,13–10,95 · L5 11,22–15,98 · L6 16,32–19,17 · L7 19,44–20,96 · L8 21,16–22,63 · L9 22,89–25,62 · L10 26,48–27,32 · L11 28,12–29,45 · L12 29,84–31,74 · L13 32,09–34,68 · L14 35,18–36,19 · L15 36,59–38,24 · L16 38,53–40,10 · L17 41,15–43,17 · L18 43,56–44,91 · L19 46,91–49,61 · L20 50,31–52,94 · L21 53,51–55,01 · L22 56,31–58,42 · L23 59,06–60,42 · L24 61,02–63,81 · L25 64,81–66,86 · L26 67,38–69,19 · L27 70,09–74,03 · L28 75,53–78,79 · L29 79,31–81,95 · L30 82,42–84,47 · L31 84,89–86,91 · L32 87,14–91,11 · L33 91,54–98,00

**Usulan timing storyboard** (potongan adegan di tengah jeda; berlaku setelah preview disetujui, lalu §4 diperbarui)

| Adegan | L# | Mulai | Selesai | Durasi | Ucapan | Estimasi lama §4 |
|---|---|---:|---:|---:|---|---|
| A01 | L1 | 0,00 | 4,77 | 4,77 | 0,50–4,42 | 5 |
| A02 | L2 | 4,77 | 8,10 | 3,33 | 5,12–7,48 | 3 |
| A03 | L3 | 8,10 | 9,96 | 1,86 | 8,72–9,79 | 2 |
| A04 | L4–L5 | 9,96 | 16,15 | 6,19 | 10,13–15,98 | 7–8 |
| A05 | L6–L8 | 16,15 | 22,76 | 6,61 | 16,32–22,63 | 8–9 |
| A06 | L9–L10 | 22,76 | 27,73 | 4,97 | 22,89–27,32 | 6 |
| A07 | L11–L16 | 27,73 | 40,63 | 12,90 | 28,12–40,10 | 11–13 |
| A08 | L17 | 40,63 | 43,37 | 2,74 | 41,15–43,17 | 3–4 |
| A09 | L18–L19 | 43,37 | 49,96 | 6,60 | 43,56–49,61 | 6–7 |
| A10 | L20–L22 | 49,96 | 58,74 | 8,78 | 50,31–58,42 | 5–6 |
| A11 | L23–L24 | 58,74 | 64,31 | 5,56 | 59,06–63,81 | 3 |
| A12 | L25 | 64,31 | 67,12 | 2,81 | 64,81–66,86 | 3–4 |
| A13 | L26–L27 | 67,12 | 74,78 | 7,66 | 67,38–74,03 | 5–6 |
| A14 | L28–L29 | 74,78 | 82,19 | 7,41 | 75,53–81,95 | 9–10 |
| A15 | L30 | 82,19 | 84,68 | 2,50 | 82,42–84,47 | 3 |
| A16 | L31–L32 | 84,68 | 91,32 | 6,64 | 84,89–91,11 | 9–10 |
| A17 | L33 | 91,32 | 100,00 | 8,68 | 91,54–98,00 | 11–12 |

Catatan timing:
- Total 100,0 s, masih dalam estimasi awal ≈ 99–111 s.
- A10 (+3 s) dan A11 (+2,5 s) lebih panjang dari estimasi, karena pengumuman lambat dan bisikan D02.
- A14, A16, A17 lebih pendek 2–3 s. Bila aksi visualnya butuh waktu lebih, tambahkan **jeda hening** di audio (preview v2), bukan mempercepat atau memotong suara.

### 9.10 Preview audio v2 — D02 tanpa pengulangan (2026-11-16)

> **Disetujui pemilik 2026-11-16** sebagai audio untuk produksi (98,56 s, tanpa perubahan lagi). Ini **bukan** persetujuan video final atau publikasi. Hak komersial ElevenLabs (§9.2, D-004) tetap terbuka. v1 tidak diubah. *[Pembaruan 2026-11-17: ditutup atas arahan pemilik, paket Pro diasumsikan; lihat tabel Status.]*
>
> (Catatan awal saat dibuat: review internal, belum disetujui.)

**Penilaian pemilik atas v1 (2026-11-16):** secara keseluruhan disukai. Masalah: L24 “Kok dia tahu?” terucap **dua kali**, terasa aneh; seharusnya sekali.

**Penyebab (OBSERVATION, pengukuran sinyal):** file mentah `2026-11-002_vo_D02_take01.mp3` (3,24 s) berisi dua ucapan terpisah, 0,54–1,51 s dan 1,95–2,95 s, dengan jeda 0,44 s. Tingkat keduanya mirip (RMS −25,7 / −24,0 dB). Di v1 keduanya ikut masuk, sehingga L24 tercatat 2,79 s untuk tiga kata.

**Perbaikan (tanpa generasi ulang, tanpa kredit):**
- `scripts/vo_preview.py`: opsi baru per segmen `"source_window_s": [mulai, akhir]`; hanya bagian file mentah itu yang dipakai. Config lama tetap berjalan sama.
- Config `04-PRODUCTION/2026-11-002/render/vo-preview-v2.json` = v1 + D02 `source_window_s: [0.0, 1.73]`. Ucapan **pertama** dipakai (termasuk burst pendek 0,16–0,41 s di depannya); ucapan kedua dibuang. Jeda dan target loudness lain sama dengan v1.
- File mentah tidak diubah (md5 D02 `3946b7fa75eded0a58b3945a0ea497f9`).

**Hasil**
- `_media/2026-11-002/audio/preview/2026-11-002_vo_preview_v2.mp3` / `.wav`, timing `…_v2_timing.json`. Salinan toa `vo_fx/…_toa_v2.wav` (isi sama dengan v1).
- Durasi **98,56 s** (−1,44 s). −16,3 LUFS, LRA 5,4 LU, peak −1,5 dBFS.
- Verifikasi: di wilayah 60,5–63,3 s hanya ada **satu** ucapan (61,00–62,39 s). L24 = 61,02–62,37 s.
- Timing L1–L24 sama dengan v1. L25–L33 maju 1,44 s (mis. L25 63,37–65,42; L33 90,10–96,56). Tabel adegan §9.9: A01–A10 tetap; A11 selesai 62,87 (durasi 4,13 s); A12–A17 mulai/selesai −1,44 s, durasi sama.

**Perlu didengar:** apakah ucapan pertama adalah versi yang lebih baik. Bila ucapan kedua lebih disukai, buat v3 dengan `source_window_s: [1.73, 3.24]` (catatan: burst awal 0,16–0,41 s ikut terbuang).

## 10. Karakter 3D — lineup v1 dan v2 (2026-11-16)

> **Usulan model 3D, belum disetujui pemilik.** Yang disetujui (D-025) adalah **gambar referensi**, bukan model ini. Belum ada animasi, siklus jalan, atau video.

**Referensi (tidak diubah):**
- Adik: `studio/out/rev/C3_adik_ref_v1.jpg` (768×1376, md5 `e738715f0a0ca241b6e154e375e65449`). Folder ini di-gitignore; usul salin ke `refrences/` (§8 butir 19).
- NPC: `refrences/NPC_lineup_v1.jpg` (768×1376, md5 `c59b000a65c5a84d607a0077f91cbfe9`).

**Keluaran** (`_media/2026-11-002/out/`, di luar Git, disalin `cp -n` tanpa menimpa):

| File | Isi | md5 |
|---|---|---|
| `cast_lineup_v1.png` | lineup depan (1920×1080): C1, adik, bapak, ibu, anak warga | `e68a70fb5d02ecbc89c1fb1b974243fb` |
| `cast_lineup_v1-threeq.png` | QC: semua diputar 40° | `8bf6b78c0fb64e023c45b94388c85325` |
| `cast_lineup_v1-back.png` | QC: tampak belakang | `4dbc97060b5e1b370bf6beaa7752c8ef` |
| **`cast_lineup_v2.png`** | **versi untuk dinilai**: sama dengan v1, warna ibu, anak warga, sarung, dan jaket dikoreksi (tabel warna di bawah) | `92d0279255fd489479a56d4b3b17ca0d` |
| `cast_lineup_v2-threeq.png` | QC 3/4 (v2) | `a9792bf485c60bd1ed51f1d0a8ea5036` |
| `cast_lineup_v2-back.png` | QC belakang (v2) | `91fb4dfcacae41b20272af7c4dba8abb` |

Perintah ulang (dari `studio/`): `npx remotion still src/index.ts CastLineup002 out/rev/<nama-baru>.png --frame=0 --gl=angle --timeout=240000` (juga `CastLineup002-threeq`, `CastLineup002-back`). `remotion still` **menimpa tanpa bertanya**: render ke nama baru di `out/rev/`, lalu salin dengan `cp -n`.

**Kode:** preset `studio/src/cast/npc.tsx` (`ADIK`, `BAPAK`, `IBU`, `ANAK_WARGA`, komponen `Npc`), komposisi `studio/src/cast/CastLineup.tsx`, registrasi di `studio/src/Root.tsx`. `C1.tsx` hanya mendapat tambahan yang tidak aktif untuk C1 (jenis kaos `"tee"`, slot `headWear`/`legWear`, ekspor `STICK_HEAD`/`STICK_INK_W`). Panduan: [[npc-presets]].

**Tinggi terhadap C1** (sol → puncak rambut; C1 = 1,5 unit = puncak kepala). Nilai dari kode (`presetHeight`); cek bbox piksel pada render depan (kamera tanpa tilt/yaw, semua di satu garis):

| Karakter | `height` | Kode (× C1) | Piksel (× C1) | Dasar |
|---|---:|---:|---:|---|
| C1 | 1,50 | 1,000 | 1,000 | disetujui (D-021) |
| Adik (C3) | 1,27 | 0,873 | 0,871 | HYPOTHESIS: anak 12–13 th vs pria 20-an; referensi tidak memuat C1 |
| Bapak (W1) | 1,53 | 1,029 | 1,028 | HYPOTHESIS: skala NPC ↔ C1 tidak ada di referensi |
| Ibu (W2) | 1,39 | 0,931 | 0,929 | ibu/bapak = 0,905 (sama dengan referensi: 612/676 px = 0,905) |
| Anak warga | 1,02 | 0,702 | 0,704 | anak/bapak = 0,682 (referensi 466/676 = 0,689); lebih pendek dari adik |

**Warna pakaian: referensi vs render** (median 12×12 px di sisi terang; sampel piksel, bukan penilaian mata):

| Bagian | Referensi | v1 render | v2 render | Hue ref / v2 (°) |
|---|---|---|---|---|
| Kaos adik | `#fabfa1` | `#fec7b0` | `#fec7b0` | 20 / 17 |
| Celana adik | `#ebbe9f` | `#f7c5b0` | `#f7c5b0` | 24 / 17 |
| Jaket adik | `#d0a149` | `#ec9e48` | `#d5a145` | 39 / 38 |
| Kaos bapak | `#f6edd0` | `#fdf4cc` | `#fdf4cc` | 45 / 48 |
| Sarung (rata-rata motif) | `#927d67` | `#af8871` | `#977c65` | 30 / 27 |
| Kaos ibu | `#a4b29b` | `#b8c2a2` (condong kuning) | `#a3b498` | 96 / 96 |
| Kaos anak warga | `#788c97` | `#7f8b9f` (condong biru) | `#7a8f99` | 201 / 199 |
| Rambut adik | `#202020` | `#3b2b3f` | `#3b2b3f` | — (lihat bawah) |

Koreksi v2: albedo diputar hue dan diatur kecerahan sebesar selisih yang terukur di v1 (ibu +18°, anak −16°, jaket +8°, sarung +8°).

**Perbedaan dari referensi (disengaja atau batas pipeline):**
- Tangan NPC dan adik = oval putih polos tanpa jari (arahan pemilik). Kaki = kapsul sederhana proyek. Wajah = bahasa wajah proyek (mata titik, alis pendek, mulut garis); tanpa hidung dan garis wajah tambahan. Tidak ada “Uq” pada siapa pun selain C1.
- **Paling terlihat:** rambut hitam terbaca **abu-abu keunguan gelap** (`#3b2b3f` vs referensi `#202020`). Terbukti: albedo hampir hitam + spec dan rim material rambut dimatikan tetap terangkat. **HYPOTHESIS** penyebab: tahap pascaproses mood `day` (grade shadow tint lavender, rim toon pascaproses, fog, atau `camFill`); belum diisolasi satu per satu.
- Warna pakaian: albedo sengaja lebih gelap dari target karena cahaya toon + grade sangat mencerahkan warna terang (contoh pertama: peach `#f6b99b` keluar `#fdf5e8`, hampir putih). Selisih terukur ada di tabel warna di atas.
- Bob adik lebih rapi/membulat daripada gambar (rambut berupa satu cangkang; helai hanya dari gerigi halus di garis rambut). Dari samping terbaca seperti helm.
- Sarung = lipatan datar bermotif kotak di bahu kiri anatomis bapak (kanan penonton saat menghadap kamera), menjuntai ke dada dan punggung.
- Jaket adik = dua lipatan kain di lengan bawah kanan anatomis (rantai lengan `"L"`, kiri layar); lengan bawah menyilang ke depan. Dari sudut 3/4, tangan terlihat di ujung depan jaket.
- Celana adik dimulai tepat di bawah pita outline ujung kaos. Di pinggang terbaca satu garis tebal. Tabung yang menembus outline kaos menghasilkan deretan titik tinta, jadi tidak dipakai. (Catatan 2026-11-16 malam: titik tipis masih terlihat pada framing dekat; lihat §10.1.)
- Sanggul ibu hanya terlihat dari samping/belakang (`cast_lineup_v2-threeq.png`, `-back.png`); dari depan ibu dibedakan oleh garis rambut yang menyamping.
- Tangan oval terbaca sebagai cincin putih bergaris tebal pada skala lineup (sama dengan Tyo).

**QC yang dijalankan:**
- `npm run typecheck` lulus.
- C1 tidak berubah setelah edit `C1.tsx`: still `TyoProposal-close` identik piksel (`getbbox() = None`). Still `C1Sheet` berbeda maksimal ±1 nilai di 73 piksel. Render ulang `C1Sheet` dengan kode yang sama juga berbeda ±1, jadi selisih itu noise render, bukan perubahan desain.
- Render final v1 identik piksel dengan render percobaan terakhir (`None`). v2 = render dari kode final (warna terkoreksi), diperiksa langsung dan diukur warnanya.
- Dilihat langsung: tampak depan, 3/4, belakang, close-up adik (depan + samping, dengan/tanpa jaket, QC sementara yang sudah dihapus), crop bahu/sarung/sanggul/pinggang. Tidak terlihat anggota tubuh menembus pakaian pada pose preview.
- Diperbaiki selama QC: garis rambut bergerigi (tangga grid verteks → remap lintang), titik-titik di pinggang celana (lihat atas), bayangan bergerigi di celana (`receive=false`), tekstur sarung jadi garis (wrap `Repeat`), tangan adik mencuat seperti lolipop (pose lengan).
- **Belum diuji:** pose lain selain berdiri diam, duduk dengan celana, animasi, siklus jalan, tampilan dalam cahaya malam (`night`) yang dipakai episode ini.

### 10.1 Revisi terbatas 2026-11-16 (malam) — lineup v3, gendong, detail, cek malam

> Atas penilaian pemilik terhadap lineup v2 ([[DECISION-LOG#D-026]]). **Masih usulan model; menunggu penilaian visual pemilik.** C1, naskah, audio v2, dan keputusan storyboard lain tidak diubah.

**Keluaran** (`_media/2026-11-002/out/`, `cp -n`, v1/v2 tidak ditimpa):

| File | Isi | md5 |
|---|---|---|
| `cast_lineup_v3.png` | lineup depan: C1, adik (rambut rev), bapak, ibu, anak warga, **balita** | `8c1c9af6c545819a8497808e23cc6a95` |
| `cast_lineup_v3-threeq.png` / `-back.png` | QC 3/4 dan belakang | `2ae801b464308c49b125abcff06fa446` / `0b1013181698806e4cc6e4420cee3233` |
| ~~`carry_ibu_balita_v1.png`~~ | gendong versi awal (riwayat). **Cacat ditemukan sesudahnya:** kain gendongan terpuntir di dudukan, lengan bawah ibu menembus kantong ± 11 mm, tangan ibu menyentuh kaki balita ± 29 mm, tangan balita menembus kain ± 19 mm. Jangan dipakai | `92c5549938bde93eb4a697ff1f5217ef` |
| **`carry_ibu_balita_v2.png`** | **gendong untuk dinilai**: depan, 3/4 (sisi kiri ibu), samping, belakang; selempang tertutup + kantong U | `61f46e2bc5e4a23cfaff950e3aa71b95` |
| `carry_ibu_balita_v2-close.png` | QC dekat area dudukan: depan, samping, dari bawah | `55a562ed029cd11ed8c90dc54d3dbee1` |
| `detail_rambut_adik_v1.png` | rambut adik rev: depan, 3/4, samping, belakang | `89c8ecd069eb334ee2c5936b9d0d7933` |
| `detail_tangan_v1.png` | tangan oval NPC dari dekat (adik, bapak, ibu, anak warga) | `355fa1e11fa64d85271a5af23953227b` |
| `night_check_v1.png` | cek cahaya malam (mood `night`, tanpa lampu jalan), dengan gendong v1 (riwayat) | `96792f27238177fd72c9ab0b8d3adb96` |
| **`night_check_v2.png`** | cek cahaya malam yang sama, dengan gendong v2 | `0dab8c52549d870c88d03d987029ca99` |

Komposisi (dari `studio/`): `CastLineup002` (+`-threeq`, `-back`), `CarryPreview002`, `CarryClose002-{front,side,below}`, `CastDetail002-hair`, `CastDetail002-hands`, `NightCheck002`. Kode: `src/cast/npc.tsx`, `src/cast/carry.tsx`, `src/cast/CastReview.tsx`. Cek numerik: `tools/cast_check.ts` (perintah di kepala file).

**Perubahan:**
1. **Rambut adik** (`HAIR.bobClose`, preset `C3-adik-v3`).
   - Ubun-ubun rapat ke kepala (`puffTop` 1,035); volume hanya dari telinga ke bawah (1,095).
   - Mengembang ke bawah turun dari 0,3 ke 0,08.
   - Tengkuk tertutup sampai ± rahang (`back` −0,74).
   - 11 ujung helai runcing tidak beraturan di poni, samping, dan belakang (`tips`).
   - Wajah, tinggi, pakaian, dan jaket tetap. `HAIR.bob` lama disimpan sebagai riwayat.
2. **Tangan NPC** — jenis baru `hands: "oval"` hanya untuk preset (`lookOf`). C1 (`"fingers"`) dan Tyo 2026-11-001 (`"mitt"`) tidak berubah.
   - Diperiksa dulu di v2: tangan selebar ± 31 px dengan outline ± 11 px per sisi, sehingga isi putih hanya ± 9 px.
   - Sumbernya: garis tinta layar (`widthPx` 3,2 × 1,78 pada render 1920) terhadap tangan yang terlalu kecil (0,027 h; referensi ± 0,05 h).
   - Perbaikan: oval 0,046 × 0,06 h (± 1,8× mitt) dengan hull tipis.
3. **Balita** (`BALITA`, 2–3 th, keluarga anak; `ANAK_WARGA` tetap).
   - Proporsi balita lewat slot baru `proportions` di `C1` (tidak aktif untuk C1): kaki 0,5×, lengan 0,62×, kepala 1,3×.
   - Tinggi 0,485 × C1 (± 0,52 × ibu).
4. **Ibu menggendong balita** (`IbuGendong`, satu pose statis, v2).
   - Balita duduk di kantong kain di sisi pinggul kiri ibu, ditopang lengan kiri anatomis ibu dari bawah.
   - Kain = selempang tertutup dari bahu kanan ibu ke bawah lengan kiri (dada + punggung), plus kantong berbentuk U di bawah dudukan balita.
   - Lengan ibu memakai IK (galat 4 mm), siku diputar keluar 55° (siku di belakang pinggul).
   - Tangan balita bertumpu ke depan di atas pangkuan.
5. **A10**: lihat §4 dan §8 butir 16 (D-026).

**Pemeriksaan:**
- `npm run typecheck` lulus.
- Cek numerik gendong v2 (`tools/cast_check.ts`; `carryCheck` + `carryContacts`; meter, negatif = celah). Semua negatif; celah terdekat **3,4 mm** (tangan ibu ↔ kantong).
  - Lengan ibu ↔ tubuh ibu: −0,039 (skala elips torso).
  - Tubuh balita ↔ tubuh ibu: −0,63 (skala elips).
  - Lengan bawah ibu ↔ kain: −20 mm. Lengan atas ibu ↔ kain: −14 mm.
  - Tangan ibu ↔ kain: −3,4 mm. Tangan ibu ↔ kaki balita: −48 mm.
  - Kaki balita ↔ kain: −74 mm. Tangan balita ↔ kain: −187 mm.
  - Tubuh balita ↔ kain: −11,7 mm. Kaki dan tangan balita ↔ tubuh ibu: di luar.
  - Batas cek: anggota tubuh = jari-jari stik, tangan oval = bola selebar setengah tangan, kain = pelat setebal kain. Kepala dan rambut tidak dicek numerik (dicek dari 4 sudut).
- Riwayat QC gendong:
  - Versi 1 (balita di depan dada) **ditolak**: kepala balita menutupi wajah ibu dari depan.
  - Versi samping-pinggul pertama (`carry_ibu_balita_v1.png`) **ditolak** setelah cek kontak diperluas dan close-up 1:1 (lihat tabel).
- Rasio tinggi lineup v3, kode vs piksel: adik 0,862/0,860; bapak 1,029/1,028; ibu 0,931/0,929; anak 0,702/0,704; balita 0,485/0,492. Tinggi tubuh adik tidak berubah (`height` 1,27); rasio turun dari 0,87 ke 0,86 karena puncak rambut lebih rendah.
- C1 dan Tyo setelah edit `C1.tsx`: berbeda maksimal ±1 nilai di ± 80 piksel. Render ulang Tyo dengan kode yang sama juga berbeda ±1 (155 px), jadi selisih itu noise render, bukan perubahan desain.
- Dilihat langsung: lineup 3 sudut, gendong 4 sudut, rambut 4 sudut, tangan dekat, cek malam.

**Cek malam** (`night_check_v1.png`; sistem warna global tidak diubah; kontras WCAG dari sampel piksel):
- Wajah terbaca: wajah/dinding 3,4:1; wajah/rambut 10,3:1. Mata dan mulut terlihat.
- Tangan oval terbaca (lavender muda): tangan/dinding 2,9:1.
- Rambut terhadap dinding ungu hanya 3,0:1. Siluet rambut adik paling lemah di latar gelap keunguan.
- Kaos ibu (sage) dan anak (biru) menjadi gelap kehijauan/kebiruan; motif sarung bapak menggelap tetapi masih terbaca.
- **Belum diuji:** lampu jalan, praktikal hangat, dan interior gelap (L-c) yang direncanakan di §6.2. Tidak ada perubahan warna berdasarkan dugaan; keputusan cahaya ada di tahap set/lighting.

**Batas preset yang diketahui:**
- Gendong = satu pose statis, IBU + BALITA saja. Tidak ada animasi; preset lain belum diuji. Angka tata letak (`SEAT`, `KID_YAW`, `HAND`, `SWIVEL`, `KID_POSE`) dicari dengan grid search memakai `carryContacts`.
- **Cacat diketahui:** deretan titik tinta tipis di bawah ujung kaos adik (pinggang celana) masih terlihat pada framing dekat (`detail_tangan_v1.png`). Sudah berkurang sejak v1, tetapi belum hilang.
- Jaket di lengan mengasumsikan `armK` = 1.
- Celana dan `proportions` teruji pada pose berdiri; balita duduk hanya teruji dalam pose gendong ini.
- Tangan balita kecil karena tingginya 0,85; pada lineup tetap terbaca sebagai oval.
- Rambut tetap satu cangkang. Helai hanya berupa ujung runcing di tepi, bukan untaian terpisah.

## 11. Animatic v2 seluruh cerita (2026-11-16, D-027)

> **Animatic untuk ditinjau, bukan video final.** Model dan pose gendong disetujui sebagai dasar produksi (D-027). Naskah, audio v2, dan keputusan D-025/D-026 tidak diubah. Musik dan SFX baru belum ada.

**Keluaran** (`_media/2026-11-002/out/`, tidak menimpa file lain):

| File | Isi | md5 |
|---|---|---|
| **`episode_2026-11-002_animatic_v2.mp4`** | **untuk dinilai**: 720×1280, 30 fps, h264 + aac, 99,567 s (2987 frame), subtitle tertanam | `8ff9db3956cde69b764c9aa01674e41d` |
| `episode_2026-11-002_animatic_v2_contact.jpg` | contact sheet, 1 frame per detik | `cd160d306fa107528ee34534f4f51386` |
| ~~`episode_2026-11-002_animatic_v1.mp4`~~ | riwayat, **jangan dipakai** (lihat cacat di bawah) | `2283ebff02e3e922bf9bc34918de7c23` |
| `episode_2026-11-002_animatic_v1_contact.jpg` | contact sheet v1 (riwayat) | `7894b02ff116a1cf1bf1493447fa71ef` |

Cacat v1, ditemukan dari contact sheet:
- A14 seluruhnya tertutup gorden (kamera diubah tanpa diuji ulang). Warga berhenti dan menoleh tidak terlihat.
- Pan jendela di A17 tertutup panel.
- Diperbaiki di v2.

**Audio:** `_media/2026-11-002/audio/animatic/2026-11-002_animatic_mix_v2.wav` (md5 `1028d7c4…`).
- Isinya audio v2 tanpa perubahan, ditambah pengulangan L2 dari salinan toa yang sudah disetujui:
  - di bawah L5 (A04) pada −6 dB;
  - samar di A07–A08 (30,1 / 36,3 / 41,25 s); yang terakhir terpotong tepat di awal L18 (43,50 s).
- Ditambah 1,0 s hening (A17), lalu dibulatkan ke panjang gambar + 50 ms.
- Di luar jendela pengulangan, sampelnya identik dengan audio v2 (selisih 0).
- `mix_v1` sama, hanya 3,7 ms lebih pendek dari gambar. Pada mux, `-shortest` memotong 3 frame terakhir; karena itu dibuat v2.

**Pembuatan:**
- Plan: `studio/src/ep002/plan-2026-11-002.json`, dibuat oleh `scripts/ep002_animatic_prep.py` dari §2 dan timing audio v2. Berisi 33 kalimat, 17 adegan, 27 shot.
- Komposisi: `Ep002Animatic` (`studio/src/ep002/Animatic.tsx`).
- Set: `studio/src/ep002/sets.tsx`, koordinat bersama `geo.ts`.
- Overlay: `overlay.tsx` (subtitle berwarna per pembicara, UI ponsel, kartu pilihan).
- Perintah: `npm run render:animatic002` dari `studio/`. Prosesnya: render 1080×1920 → ffmpeg 720×1280 → `finish_render.mjs` (menolak menimpa). Waktu render ± 2 m 40 s.
- Untuk versi baru, naikkan nama output dan mix di `package.json` dan di skrip prep.

**Pilihan editing untuk ditinjau** (D-027):
- **A07→A08 = 41,08 s.** Pesan L16 tampil sampai 40,25 s (L16 selesai 40,10), lalu wajah C1 0,83 s, lalu potong dua frame sebelum L17. Audio tidak digeser.
- **A17 = pan**, bukan wide statis. Bingkai 9:16 tidak bisa memuat jendela depan dan lorong sekaligus. Urutannya: jendela pada "tetap di dalam…", lorong pada "…keluar lewat belakang", lalu keduanya untuk kartu (96,56–99,56 s).
- **A14 dan A16 cukup** dalam durasi audio; tidak perlu diperpanjang.
  - A14: warga melambat dan berhenti selama L28; enam tolehan berselang 0,4 s masuk dalam L29.
  - A16: tolehan C1 ± 0,75 s, lalu POV lorong ± 4,3 s.

**Pemeriksaan** (`studio/tools/ep002_qc.py`, still per shot via `tools/ep002_keys.sh`, contact sheet dilihat langsung):
- Format 720×1280 / 30 fps / h264 + aac; 2987 frame = plan.
- 0 frame kosong; tidak ada lonjakan luma satu frame di luar potongan.
- Audio = mix (residu −35 dB setelah AAC, lag 0). Audio tidak terulang dan tidak terpotong.
- 33 kalimat berurutan di plan. Subtitle muncul untuk semua kalimat kecuali L14–L16: ketiganya tampil utuh di layar ponsel sesuai §4 A07.
- Kontak:
  - Kaki warga: numerik (selip 0,00 mm/frame, berhenti dengan dua kaki menapak).
  - Gendong: kaku terhadap ibu saat berjalan, jadi cek kontak D-026 tetap berlaku (celah terdekat 3,4 mm).
  - Tangan ke ponsel (A07), ke saklar (A12), dan bergandengan (A15/A17): IK, dicek visual di still; tidak diukur numerik.
- C1 tidak berubah setelah slot `legPose` (Tyo identik piksel; C1Sheet ±1 = noise render).
- File keluaran lama tidak berubah (md5 PNG sebelum dan sesudah sama).

**Keterbatasan (paling penting dulu):**
1. **Cahaya malam masih pucat lavender**, lebih mirip senja daripada jam dua pagi; interior "gelap" masih terang. Wajah tetap terbaca. Perlu keputusan lighting/grade; warna global tidak diubah.
2. **Aksi tangan masih blocking:**
   - A08: tarikan C1 = posisi di-lerp dengan langkah kecil di tempat, bukan siklus jalan.
   - A15: genggaman terbaca kasar (tangan oval adik bertemu tangan C1), tanpa animasi meremas.
3. **Bibir tidak sinkron:** mulut hanya terbuka saat kalimat (adik, C1), tanpa lip-sync.
4. A05a didominasi gorden; warga baru terlihat jelas di POV A05b/c.
5. Tidak ada musik dan SFX (klik toa, sandal, saklar) — keputusan terbuka.
6. Suara toa L2 berulang memakai satu take; tanpa variasi jarak selain low-pass.

## 12. Catatan kontinuitas akhir Episode 1 (untuk Episode 2)

> Dibuat 2026-11-17 ([[DECISION-LOG#D-035]]). Sumber: naskah terkunci L1–L33 (§2), geografi (§3), storyboard A11–A17 (§4), dan frame dari video final `_media/2026-11-002/out/episode_2026-11-002_final_v1.mp4` (diambil ke scratchpad, 58–99,4 s; media tidak diubah). Hanya fakta yang ada di episode final. Yang tidak ditunjukkan ditandai **tidak ditunjukkan**.

**Posisi tokoh di akhir (A17, ±97–99,6 s):**
- Uq (C1) dan adik berdiri berdekatan di ruang tamu yang gelap, dekat gorden/jendela depan. Adik sedikit di belakang Uq dan masih memegang jaket (dibawanya sejak L9).
- Sebelumnya (A15) adik menggenggam tangan Uq semakin erat.
- Kartu pilihan "tetap di dalam" / "keluar lewat belakang" tampil mulai ±96,6 s. Video dipotong ke hitam di 99,56 s.

**Kondisi rumah dan luar:**
- **Lampu ruang tamu:** dimatikan Uq (L25, A12). Tidak ada lampu lain yang ditunjukkan menyala.
- **Pintu depan:** tertutup. Uq menarik adik menjauh darinya (L17). Tidak pernah dibuka dalam episode.
- **Pintu belakang:** tertutup, di ujung lorong lewat dapur (A16). Di atasnya ada lubang angin/kaca buram dengan sedikit cahaya dingin. Tidak ada siluet orang.
- **Gang di belakang:** tidak pernah diperlihatkan. Isinya tidak diketahui (L32).
- **Jendela depan:** bergorden. Dari celahnya terlihat jalan (A14).
- **Warga:** keluar rumah (ada yang bersarung, ada yang menggendong anak), berjalan ke arah tiang toa, lalu berhenti dan satu per satu menoleh ke rumah 7 dengan wajah datar (A14). Mereka masih di jalan, di luar pagar. **Mendekat: tidak ditunjukkan** (L33 hanya menyebut kemungkinan "sebelum orang-orang itu mendekat").
- **Toa:** dengung masih menyala di akhir (A17, ambience).

**Yang diketahui tokoh:**
- Pengumuman memakai suara Uq. Narator yang mengatakan ini kepada "kamu" (L4–L5). **Apakah adik menyadarinya: tidak ditunjukkan.**
- Pesan petugas keamanan di ponsel Uq: "Jangan keluar dulu. Ruang pengeras suara terkunci. Kuncinya masih saya bawa." (L14–L16). Keberadaan petugas: tidak ditunjukkan.
- Grup warga penuh pertanyaan (L12). Isinya tidak ditunjukkan.
- Suara itu menyebut "Keluarga di rumah nomor tujuh. Kami masih menunggu." (L20–L21). Adik bertanya "Kok dia tahu?" (L24).
- Setelah lampu dimatikan, suara itu berkata "Mematikan lampu tidak berarti rumahnya kosong." (L27).
- Awalnya adik ingin ikut keluar: "Kita ikut, kan?" (L10).

**Ancaman yang benar-benar ditunjukkan:**
- Suara dari toa menirukan suara Uq dan menyuruh warga keluar.
- Suara itu menyebut rumah nomor 7 dan memakai kata "kami".
- Suara itu bereaksi terhadap lampu yang dimatikan. Perubahan itu terlihat dari luar (A13: wide eksterior jendela rumah 7 baru gelap).
- Warga berhenti dan menoleh serempak ke rumah 7.
- **Tidak ditunjukkan:** kekerasan, orang di gang, orang di ruang toa, warga masuk pagar.

**Misteri yang masih terbuka:** siapa atau apa pemilik suara; bagaimana suara terdengar padahal ruang pengeras suara terkunci; siapa "kami"; mengapa warga menurut dan menoleh; di mana petugas; apa yang ada di gang; apa arti label "HARI 1" di awal video (0,25–4,9 s).

**Kalimat dan kejadian terakhir sebelum pilihan:**
1. L30 (A15): adik menggenggam tangan Uq semakin erat.
2. L31–L32 (A16): pintu belakang mengarah ke gang sempit, dan dari tempat Uq berdiri ia tidak bisa melihat siapa yang ada di sana.
3. L33 (A17): "Kamu akan tetap di dalam dan menunggu petugas keamanan, atau membawa adikmu keluar lewat belakang sebelum orang-orang itu mendekat?"
