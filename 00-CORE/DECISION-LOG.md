---
type: decision-log
created: 2026-11-13
updated: 2026-11-17
related: "[[ARCHITECTURE]], [[ROADMAP]]"
---

# Decision Log

Catatan resmi semua keputusan penting proyek.

**Aturan:**
- Log ini **hanya ditambah (append-only)**. Keputusan lama tidak dihapus atau ditulis ulang.
- Keputusan yang diganti diberi status `superseded` dan merujuk ke keputusan penggantinya.
- Status yang dipakai: `approved`, `provisional` (berlaku sementara, menunggu bukti), `pending` (belum diputuskan), `superseded`.
- Keputusan strategis hanya `approved` jika disetujui pemilik.
- Setiap entri memuat: tanggal, status, keputusan, alasan, konsekuensi, dan siapa yang memutuskan.

## Indeks

| ID | Tanggal | Keputusan | Status |
|---|---|---|---|
| D-001 | 2026-11-13 | Arsitektur 5 lapisan; `CLAUDE.md` satu-satunya sumber aturan | approved |
| D-002 | 2026-11-13 | Kapasitas kerja ±5 jam/minggu | approved |
| D-003 | 2026-11-13 | Satu akun lab untuk 3 platform | approved |
| D-004 | 2026-11-13 | Anggaran Rp0 untuk tahap eksperimen | approved |
| D-005 | 2026-11-13 | Pembagian peran perangkat; GPU wajib diverifikasi | superseded oleh D-013 |
| D-006 | 2026-11-13 | Sinkronisasi via GitHub privat tanpa kredensial | superseded oleh D-013 |
| D-007 | 2026-11-13 | Skill disimpan di `.claude/skills/` | approved |
| D-008 | 2026-11-13 | Skill dibuat bertahap setelah workflow diuji | approved |
| D-009 | 2026-11-13 | Aset berat di `_media/`, di luar Git | approved |
| D-010 | 2026-11-13 | Model Content Unit (satu catatan per video) | approved |
| D-011 | 2026-11-13 | Baseline "image-first" (2D) | **dihapus** (D-029) |
| D-012 | 2026-11-13 | GPU terverifikasi RTX 3050 Ti 4 GB VRAM (jalur generasi gambar dihapus) | approved (fakta GPU); jalur dihapus (D-029) |
| D-013 | 2026-11-13 | Hanya satu laptop Windows; tanpa sinkronisasi; Git lokal | approved |
| D-014 | 2026-11-14 | Alat produksi 2D (ChatGPT/Google Flow) | **dihapus** (D-029) |
| D-015 | 2026-11-14 | Pola cerita what-if/dilema (gaya visual 2D dihapus) | approved (bagian cerita) |
| D-016 | 2026-11-14 | Flow untuk gambar | **dihapus** (D-029) |
| D-017 | 2026-11-15 | Google Flow untuk gambar; "Uq" (desain C1 kini diatur D-018) | **dihapus** (D-029) |
| D-018 | 2026-11-15 | Desain C1 "Uq" disetujui dari `refrences/Caracter_Utama.jpg`; "Uq" di dada kiri anatomis; tangan berjari pengecualian BODY RULE untuk C1 | approved |
| D-019 | 2026-11-15 | Pengaturan naskah pilot 2026-11-001: 1 narator, durasi ± 40 s, C2 bernama "Tyo"; naskah v1.1 disetujui | approved |
| D-020 | 2026-11-15 | Render 2D Pillow + FFmpeg | **dihapus** (D-029) |
| D-021 | 2026-11-15 | Pindah ke pipeline 3D inkbeat (Remotion + three.js) di `studio/`; C1 dibuat ulang sebagai karakter 3D toon | **approved** 2026-11-15 (C1 revisi 1 + gaya 3D toon = acuan pilot dan channel; bukan persetujuan video final) |
| D-022 | 2026-11-15 | Pilot dibangun di `studio/` sebagai rough cut seluruh cerita; render tidak boleh menimpa video pembanding; Tyo 3D = usulan | approved (teknis, Claude Code); desain Tyo **pending** pemilik |
| D-024 | 2026-11-16 | Skill pihak ketiga (`threejs-*` di repo, `remotion-*` di level user) sebagai lapisan referensi di bawah `video-production` v0.3 | approved (2026-11-16; `remotion-docs` dihapus) |
| D-025 | 2026-11-16 | 2026-11-002: storyboard v0.2 disetujui dengan penyesuaian (A04, A07, A10, A17 +1 s); referensi desain adik (celana = pengecualian BODY RULE) dan NPC dasar disetujui | approved (pemilik); model 3D **belum** disetujui |
| D-026 | 2026-11-16 | 2026-11-002: revisi model (rambut adik, tangan oval NPC), balita 2–3 th digendong ibu (varian keluarga anak, tanpa referensi baru); A10 tanpa shot reaksi | approved (pemilik); model hasil revisi **belum** disetujui |
| D-027 | 2026-11-16 | 2026-11-002: model 3D + pose gendong disetujui sebagai dasar produksi; gerak jalan warga reusable; animatic seluruh cerita | approved (pemilik); animatic v2 **menunggu** penilaian; bukan video final |
| D-028 | 2026-11-16 | Referensi gaya tunggal "Badai Matahari"; aturan 2D/Flow dikeluarkan (dihapus lewat D-029); skill terpasang (`inkbeat-shorts`, `threejs-*`, `remotion-*`) wajib dipakai; gerbang look-dev + pilot | approved (pemilik) |
| D-029 | 2026-11-16 | Hapus total jalur 2D; tinta tetap tapi tipis; tubuh bertubuh + celana; uji Blender beberapa detik; SFX/musik dibuat sendiri | approved (pemilik) |
| D-030 | 2026-11-16 | Blender tidak dipakai; produksi tetap three.js (Remotion + R3F) dengan skill inkbeat/threejs/remotion | approved (pemilik) |
| D-031 | 2026-11-16 | Desain tubuh+celana+tinta tipis (look-dev v1) disetujui; stack wajib Three.js/R3F + Remotion | approved (pemilik) |
| D-032 | 2026-11-17 | Prioritas produksi: bentuk karakter konsisten > gerak alami > kejelasan cerita > pemolesan set/cahaya/efek | approved (pemilik) |
| D-033 | 2026-11-17 | Revisi A02–A04 v3 jadi acuan produksi; animatic lengkap dengan pendekatan v3; uji SFX dari refrences/SFX/ di preview; musik masih menunggu | approved (pemilik) |
| D-034 | 2026-11-17 | Video berikutnya: topik berbeda, interaksi lebih awal, payoff di video yang sama; pilihan akhir hanya reflektif; C1 tetap | approved (pemilik); "topik berbeda" dan "tanpa kelanjutan" **superseded oleh D-035** |
| D-035 | 2026-11-17 | Urutan video: 2026-11-001 = arsip pembelajaran; 2026-11-002 = **Episode 1** seri aktif channel **Uq.cerita**; Episode 2 melanjutkan dari pilihan akhir Episode 1 | approved (pemilik) |
| D-036 | 2026-11-17 | Episode 2 = **cabang A (tetap di dalam)**; Content Unit `2026-11-003`; naskah v1.0 | approved (pemilik): cabang + **naskah v1.0** + arahan visual; storyboard v0.1 menunggu |
| D-037 | 2026-11-17 | 2026-11-003: storyboard v0.2 disetujui + revisi cahaya "mencari gerendel"; ponsel tangan kiri; stand-off + gerendel; kaca menerima cahaya; cadangan (b)/(c) belum; still look-dev dapur diizinkan | approved (pemilik) |
| D-045 | 2026-11-20 | Seri "rumah nomor tujuh" selesai di Ep 5; arah cerita (kompleks diawasi, satpam orang dalam, twist narator = toa); cabang Ep 3–4 menyatu di tengah; Ep 5 akhir tertutup; prinsip hook baru (HYPOTHESIS); Ep 3 = `2026-11-004` naskah draft v0.1 | approved (pemilik) sebagai arah; naskah v0.1 **menunggu** tinjauan; twist "pilihan penonton sungguhan" = pertanyaan terbuka |
| D-046 | 2026-11-20 | Ep 3 = cabang B (suara terbanyak); K1 kenop berputar, K2 LED dinyalakan, K3 nomor baru + narator tidak memastikan, label biasa, beat kamera ± 10 s; kartu "balas pesan itu" / "tutup kameranya", dentuman Doom; **kebijakan: cabang seri interaktif = suara terbanyak komentar** (memperbarui D-035 butir 4); kamar mandi = usulan ruang tanpa kamera | approved (pemilik); naskah v0.2 → v1.0 dan ambang: lihat D-047 |
| D-047 | 2026-11-20 | Ep 3 naskah v1.0 dikunci; ambang suara ≥ 5 jelas + unggul ≥ 2; Ep 2 `published` + URL YouTube (API); kamar mandi diputuskan di Ep 4 (kandidat utama dinding timur dapur); dentuman cadangan = kombinasi Ep 2 | approved (pemilik); storyboard Ep 3 v0.1 + titik kamera LED **menunggu** tinjauan |
| D-048 | 2026-11-20 | Ep 3 storyboard v0.2: titik LED disetujui, lorong rata-plafon, mundur ± 1 m, kenop close + slot, uji tangan-di-mulut (cadangan otomatis bila gagal → dipakai), pilot Blok A + B, Uq menatap lensa sekali di akhir, N04 dipecah a/b/c | approved (pemilik); look-dev v1 **menunggu** tinjauan |
| D-049 | 2026-11-20 | Ep 3 storyboard v0.3: slot kenop lebih kecil (beda dengan Ep 2 S04 diterima), kamera lorong tanpa tinta, adik 0,25 m lebih jauh (S02), kenop 0,6 m + kaca ×6 (≤ 85 % gelap), pendar 22/30 px + gerbang oklusi, pantulan layar apa adanya, desain kamera disetujui, bunyi klik tiap LED; pilot dua blok | approved (pemilik); pilot v1 **menunggu** tinjauan |
| D-050 | 2026-11-20 | Ep 3 pilot v2: kartu recap di T + 0,5 / T + 1,0 s (**tertahan: bentrok dengan potongan 6,8 s dan L3**, 2 opsi menunggu pemilik); S08 adik hanya mendongak; S09 2,4 s; telapak adik digeser 2 cm; LED pada frame klik; switch_click tetap | approved (pemilik) kecuali kartu (pending opsi); pilot v2 **menunggu** tinjauan |
| D-051 | 2026-11-20 | Ep 3 pilot v3: **Opsi 2** (L3 dan potongan S02 → S03 mundur 2,414 s), kartu kiri di T + 0,5 s, S02 telapak adik sampai 4,5 cm, S08a 1,5 s; usulan: klik 0,5 s sesudah kartu kanan, tahan 1,0 s | approved (pemilik) + 2 usulan pending; pilot v3 **menunggu** tinjauan |
| D-052 | 2026-11-20 | Ep 3 pilot v3 diterima tanpa perubahan (gerbang pilot lolos; episode belum approved); jadwal kartu = keputusan pemilik; dua sisa masalah diterima; VO N04a/b/c diperiksa; rencana episode dari durasi VO asli 68,35 s | approved (pemilik) untuk pilot v3 + jadwal kartu; rencana episode **draft menunggu** tinjauan |

---

## D-001

**Arsitektur 5 lapisan; `CLAUDE.md` satu-satunya sumber aturan**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik (menyetujui usulan Claude)
- **Keputusan:** Sistem disusun dalam 5 lapisan (aturan, keahlian, pengetahuan, produksi, data) seperti dijelaskan di [[ARCHITECTURE]]. `CLAUDE.md` adalah satu-satunya sumber aturan utama. File `MASTER-INSTRUCTIONS.md` dan `OPERATING-PRINCIPLES.md` dari usulan awal **tidak dibuat**. Struktur folder di [[ARCHITECTURE]] §4 menggantikan struktur di `CLAUDE.md` §8.
- **Alasan:** Mencegah dokumentasi ganda yang isinya bisa saling bertentangan.
- **Konsekuensi:** `CLAUDE.md` §8–9 perlu direvisi (ROADMAP M0-07) setelah pemilik menyetujui diff-nya.

## D-002

**Kapasitas kerja ±5 jam per minggu**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik
- **Keputusan:** Perencanaan memakai estimasi 5 jam kerja per minggu.
- **Alasan:** Estimasi awal pemilik.
- **Konsekuensi:** Milestone dan ritme produksi disesuaikan; sistem harus ramping. Waktu per tahap dicatat selama Milestone 1. Angka ini **dievaluasi ulang setelah satu siklus produksi** (ROADMAP M1-11).

## D-003

**Satu akun lab untuk TikTok, Instagram Reels, dan YouTube Shorts**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik
- **Keputusan:** Tahap awal memakai satu akun lab per platform. Video yang sama diuji di ketiga platform. Strategi dan metadata publikasi (caption, judul, hashtag) boleh berbeda per platform.
- **Alasan:** Memusatkan tenaga dan data di tahap eksplorasi; identitas channel permanen baru ditentukan setelah ada bukti.
- **Konsekuensi:** Dibuat `02-CHANNELS/lab/CHANNEL-DNA.md` berstatus draft dan minimal. Channel tambahan memerlukan keputusan baru.

## D-004

**Anggaran Rp0 untuk tahap eksperimen**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik
- **Keputusan:** Tahap eksperimen awal hanya memakai tool gratis, open source, dan free tier yang legal serta masih tersedia.
- **Alasan:** Keputusan pemilik.
- **Konsekuensi:** Setiap tool harus dicek harga, batasan, dan lisensinya pada tanggal penggunaan, lalu dicatat di `03-KNOWLEDGE/tools/`. Tool berbayar hanya boleh diusulkan dengan alasan kuat dan memerlukan keputusan baru. Lisensi yang mengizinkan penggunaan komersial diutamakan.

## D-005

**Pembagian peran perangkat; spesifikasi GPU wajib diverifikasi**

- **Tanggal:** 2026-11-13
- **Status:** superseded oleh [[DECISION-LOG#D-013]] (2026-11-13). Verifikasi GPU sudah selesai; pembagian peran Windows/Mac tidak berlaku lagi.
- **Diputuskan oleh:** pemilik (verifikasi diminta pemilik)
- **Keputusan:** Windows PC (RTX 3050 Ti) menjadi mesin produksi utama. MacBook Air M1 8 GB untuk Obsidian, menulis, review, dan Claude Chat. Model GPU dan VRAM aktual diverifikasi sebelum workflow generasi aset ditentukan.
- **Alasan:** GPU NVIDIA hanya ada di Windows PC. RAM M1 8 GB terbatas untuk model AI lokal. VRAM RTX 3050 Ti belum terverifikasi (UNKNOWN).
- **Konsekuensi:** ROADMAP M0-01 memverifikasi lingkungan dan hasilnya disimpan di `03-KNOWLEDGE/tools/ENVIRONMENT.md`. Lihat juga D-011.

## D-006

**Sinkronisasi via GitHub privat tanpa kredensial**

- **Tanggal:** 2026-11-13
- **Status:** superseded oleh [[DECISION-LOG#D-013]] (2026-11-13). Aturan "kredensial tidak boleh masuk repository" tetap berlaku; sinkronisasi via GitHub tidak berlaku lagi.
- **Diputuskan oleh:** pemilik
- **Keputusan:** Vault/repo disinkronkan antara Windows dan Mac melalui repository GitHub privat. Token, API key, `.mcp.json`, dan kredensial lain tidak boleh masuk repository.
- **Alasan:** Riwayat perubahan, cadangan, dan sinkronisasi dua perangkat tanpa biaya.
- **Konsekuensi:** `.gitignore` dibuat **sebelum** commit pertama (M0-03). Hasil inspeksi 2026-11-13 menemukan token di `.mcp.json`, `.obsidian/plugins/mcp-tools-istefox/data.json`, dan di log plugin tersebut, sehingga ketiganya dikecualikan. Isi commit wajib diverifikasi sebelum push pertama. Konfigurasi plugin Obsidian MCP bersifat per perangkat.

## D-007

**Skill disimpan di `.claude/skills/`**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik (menyetujui usulan arsitektur)
- **Keputusan:** Skill disimpan di `.claude/skills/<nama>/SKILL.md`, bukan di `01-SKILLS/`.
- **Alasan:** Claude Code memuat skill proyek dari lokasi ini secara otomatis.
- **Konsekuensi:** Skill tidak terlihat di Obsidian karena folder berawalan titik disembunyikan; skill diedit lewat Claude Code atau editor teks.

## D-008

**Skill dibuat bertahap setelah workflow diuji**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik
- **Keputusan:** Tidak membuat delapan skill sekaligus. Skill `v0.1` hanya ditulis untuk tahap pipeline yang sudah dijalankan secara nyata, dan dinaikkan ke `v1.0` setelah sekitar 3 kali pakai.
- **Alasan:** Skill yang ditulis dari teori belum teruji dan cenderung perlu ditulis ulang.
- **Konsekuensi:** Milestone 0 tidak membuat skill. Skill pertama ditulis di akhir Milestone 1 (M1-10).

## D-009

**Aset berat di `_media/`, di luar Git**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik (menyetujui usulan arsitektur)
- **Keputusan:** Gambar, audio, dan video disimpan di `_media/<content-id>/` dan tidak dimasukkan ke Git.
- **Alasan:** File media membuat repository berat serta memperlambat Obsidian dan sinkronisasi.
- **Konsekuensi:** Aset tidak tersinkron otomatis ke Mac. Mekanisme cadangan aset final ditentukan bila diperlukan.

## D-010

**Model Content Unit**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik (menyetujui usulan arsitektur)
- **Keputusan:** Setiap video memiliki ID `YYYY-MM-NNN` dan satu catatan utama `04-PRODUCTION/<id>/content.md` dengan status di frontmatter (lihat [[ARCHITECTURE]] §5).
- **Alasan:** Menghindari duplikasi antar folder ide, naskah, dan prompt, serta memudahkan pelacakan status.
- **Konsekuensi:** Template `content.md` dibuat di M0-06. Folder `ideas/`, `scripts/`, dan `prompts/` dari usulan awal tidak dibuat.

## D-011

**Baseline produksi "image-first" (2D) — DIHAPUS**

> **DIHAPUS 2026-11-16 ([[DECISION-LOG#D-029]]):** keputusan jalur 2D/gambar AI ini tidak berlaku dan isinya sengaja dihapus agar tidak dipakai lagi. Riwayat lengkap hanya ada di git (commit `484f1be`).

## D-012

**GPU terverifikasi: RTX 3050 Ti Laptop, 4 GB VRAM**

- Fakta perangkat tetap berlaku ([[ENVIRONMENT]]).
> **DIHAPUS 2026-11-16 ([[DECISION-LOG#D-029]]):** bagian jalur generasi gambar (Jalur A/B/C) tidak berlaku dan isinya sengaja dihapus agar tidak dipakai lagi. Riwayat lengkap hanya ada di git (commit `484f1be`).

## D-013

**Hanya satu laptop Windows; tanpa sinkronisasi antarperangkat; Git lokal**

- **Tanggal:** 2026-11-13
- **Status:** approved
- **Diputuskan oleh:** pemilik
- **Keputusan:** Proyek berjalan **hanya** di laptop Windows (Windows 11 Pro, i7-11800H, 32 GB RAM, RTX 3050 Ti Laptop GPU 4 GB VRAM — lihat [[ENVIRONMENT]]). Laptop ini dipakai untuk pengembangan, riset, Obsidian, otomasi, render, dan QC. MacBook Air **di luar cakupan proyek**. Sinkronisasi antarperangkat tidak direncanakan. Version control memakai Git lokal. Remote GitHub ditunda.
- **Alasan:** Menyederhanakan cakupan dan menghindari pekerjaan yang tidak perlu (setup dua perangkat, sinkronisasi, konfigurasi plugin per perangkat).
- **Konsekuensi:** Menggantikan [[DECISION-LOG#D-005]] dan [[DECISION-LOG#D-006]]. Verifikasi Mac (M0-01) dan M0-08 (GitHub & sinkronisasi Mac) dibatalkan dari roadmap aktif. Larangan memasukkan kredensial ke Git tetap berlaku. Tidak ada cadangan di luar laptop selain riwayat Git lokal (risiko diterima; ditinjau ulang bila ada aset final penting). `CLAUDE.md` §3 sudah disesuaikan (MacBook dihapus) pada 2026-11-14 bersama revisi M0-07, disetujui pemilik.

## D-014

**Pembagian alat produksi 2D (ChatGPT/Google Flow) — DIHAPUS**

> **DIHAPUS 2026-11-16 ([[DECISION-LOG#D-029]]):** keputusan jalur 2D/gambar AI ini tidak berlaku dan isinya sengaja dihapus agar tidak dipakai lagi. Riwayat lengkap hanya ada di git (commit `484f1be`).

## D-015

**Pola cerita what-if/dilema untuk akun lab** (bagian gaya visual 2D dihapus 2026-11-16, [[DECISION-LOG#D-029]])

- **Tanggal:** 2026-11-14
- **Status:** approved (hanya bagian cerita)
- **Diputuskan oleh:** pemilik
- **Keputusan yang masih berlaku:**
  1. Konten berbahasa Indonesia untuk TikTok, Instagram Reels, dan YouTube Shorts; narasi dan subtitle berbahasa Indonesia natural.
  2. Fokus cerita: what-if, rasa penasaran, dilema, dan konsekuensi yang membuat penonton merasa terlibat. Pola: situasi what-if → tanggung jawab penonton → pilihan sulit → konsekuensi/pengungkapan → penutup.
  3. Pilihan harus sama-sama masuk akal dengan pengorbanan jelas; sebagian payoff diberikan di video yang sama; fakta nyata wajib bersumber; fiksi diperlakukan sebagai fiksi.
- **Gaya visual:** tidak lagi diatur di sini; lihat [[DECISION-LOG#D-021]], [[DECISION-LOG#D-028]], [[DECISION-LOG#D-029]] dan [[STUDIO-WORKFLOW]].

## D-016

**Pernyataan Flow untuk gambar — DIHAPUS**

> **DIHAPUS 2026-11-16 ([[DECISION-LOG#D-029]]):** keputusan jalur 2D/gambar AI ini tidak berlaku dan isinya sengaja dihapus agar tidak dipakai lagi. Riwayat lengkap hanya ada di git (commit `484f1be`).

## D-017

**Google Flow untuk gambar — DIHAPUS**

> **DIHAPUS 2026-11-16 ([[DECISION-LOG#D-029]]):** keputusan jalur 2D/gambar AI ini tidak berlaku dan isinya sengaja dihapus agar tidak dipakai lagi. Riwayat lengkap hanya ada di git (commit `484f1be`).

## D-018

**Desain C1 (karakter utama berulang "Uq") disetujui dari gambar referensi**

- **Tanggal:** 2026-11-15
- **Status:** approved
- **Diputuskan oleh:** pemilik
- **Keputusan:**
  1. Desain karakter pada `refrences/Caracter_Utama.jpg` disetujui sebagai **C1 ("kamu")**, karakter utama berulang.
  2. Yang dikunci sesuai gambar: bentuk kepala, wajah, proporsi, kaos navy, **tangan berjari**, serta bentuk dan ukuran tulisan "Uq".
  3. Posisi "Uq": **dada kiri anatomis** C1 (kanan bagi penonton saat C1 menghadap depan). Menggantikan posisi "dada kanan anatomis" di [[DECISION-LOG#D-016]]/[[DECISION-LOG#D-017]].
  4. Tangan berjari adalah **pengecualian BODY RULE khusus C1**. Lengan dan kaki tetap garis hitam tipis. Karakter lain tetap mengikuti BODY RULE asli.
  5. C2 adalah karakter pendukung dan **tidak** memakai identitas "Uq".
  6. Judul "CHARACTER REFERENCE: UQ" dan latar abu-abu pada JPG **bukan** bagian aset produksi. JPG asli dipertahankan sebagai referensi.
  7. Persetujuan ini **hanya** untuk desain C1. Naskah 2026-11-001 v1 tetap draft; suara, durasi, dan nama "Dimas" belum diputuskan.
- **Fakta berkas (OBSERVATION, `ffprobe` 2026-11-15):** JPEG (mjpeg), 1536 × 2752, `pix_fmt=yuvj420p` (tanpa kanal alpha).
- **Alasan:** pemilik memilih gambar referensi yang sudah ada sesuai D-017 butir 5.
- **Pengaruh pada keputusan lama:** [[DECISION-LOG#D-017]] butir 3 dan 5 diganti; [[DECISION-LOG#D-015]] BODY RULE mendapat pengecualian tangan untuk C1; aturan umum "kepala oval sedikit gepeng" tunduk pada bentuk kepala C1 di gambar yang disetujui.
- **Konsekuensi:** [[STUDIO-WORKFLOW]] v0.3 memuat C1 style lock. Langkah berikutnya: referensi bersih C1 (tanpa judul, latar polos) dibuat pemilik di Google Flow, lalu diperiksa Claude Code. Varian adegan **tidak** dibuat sebelum referensi bersih lolos pemeriksaan dan kebutuhan naskah dikunci. Karakter tidak dicerminkan.

## D-019

**Pengaturan naskah pilot 2026-11-001: satu narator, durasi ± 40 detik, C2 bernama "Tyo"**

- **Tanggal:** 2026-11-15
- **Status:** approved
- **Pembaruan 2026-11-15:** teks naskah v1.1 juga disetujui pemilik. D-019 sepenuhnya selesai.
- **Diputuskan oleh:** pemilik
- **Keputusan:**
  1. Satu narator membacakan semua baris, termasuk kalimat C2 di L4. Kalimat C2 dibedakan lewat gaya subtitle.
  2. Durasi draft ± 38–44 detik diterima (± 40 detik); target awal ± 35 detik tidak dipakai. Masih dalam default 25–45 detik (`CLAUDE.md` §6 Stage 7).
  3. Nama C2 diganti dari "Dimas" menjadi **"Tyo"**.
- **Alasan:** satu suara menyederhanakan TTS dan produksi; naskah utuh menjaga petunjuk visual dan payoff.
- **Konsekuensi:** naskah v1.1 (hanya ganti nama) disiapkan di Content Unit 2026-11-001 untuk persetujuan pemilik. Penyebutan "Dimas" di entri lama (D-016–D-018) dibiarkan sebagai catatan sejarah. EXP-001 cukup memilih satu suara narator.

## D-020

**Render 2D Pillow + FFmpeg — DIHAPUS**

> **DIHAPUS 2026-11-16 ([[DECISION-LOG#D-029]]):** keputusan jalur 2D/gambar AI ini tidak berlaku dan isinya sengaja dihapus agar tidak dipakai lagi. Riwayat lengkap hanya ada di git (commit `484f1be`).

## D-021

**Pipeline 3D inkbeat untuk produksi; C1 dibuat ulang dalam 3D**

- **Tanggal:** 2026-11-15
- **Status:** **approved** oleh pemilik 2026-11-15: C1 revisi (`demo3d_c1_rev1.mp4`, content.md §6.3) dan gaya 3D toon ber-tinta ditetapkan sebagai acuan produksi pilot dan channel. Ini persetujuan **gaya/desain**, bukan persetujuan video final. Riwayat: menunggu persetujuan sampai revisi 1.
- **Diusulkan oleh:** pemilik (demo 2D D-020 dinilai sangat jelek; minta memakai skill/tutorial `refrences/Ai_Carton_step-by-step/`); Claude Code (pelaksanaan teknis).
- **Isi:**
  1. Proyek Remotion + React Three Fiber dari template inkbeat disalin ke `studio/` (`npm ci` lokal, 264 paket; Chrome headless Remotion diunduh otomatis saat render). Node.js v26 sudah terpasang sebelumnya; tidak ada instalasi tingkat sistem. Lisensi Remotion: gratis untuk individu/tim ≤ 3 orang.
  2. C1 dibangun sebagai mesh 3D (`studio/src/c1/C1.tsx`) dari ukuran `C1_ref_clean_key.png`: kepala hampir bulat putih, mata titik, alis pendek, senyum kecil, tanpa hidung/telinga/blush, kaos navy lengan pendek, "Uq" putih di dada kiri anatomis (tidak dicerminkan), lengan/kaki garis hitam, tangan putih berjari.
  3. Konsekuensi gaya: D-015 (stick figure 2D flat) menjadi 3D toon ber-tinta. Aset Flow C1_sit/C1_reach tidak dipakai di pipeline 3D (tetap disimpan).
  4. Set warung (`studio/src/c1/Warung.tsx`) dibuat dengan kode; BG1/P1 dari Flow tidak diperlukan di jalur ini.
- **Penyimpangan C1-3D dari referensi 2D (OBSERVATION):** kaos lebih kotak (referensi sedikit melebar ke bawah); tangan kecil tampak gelap pada shot lebar karena tinta; kaki tanpa telapak garis seperti referensi; navy tampak keunguan di cahaya siang.
- **Bacaan referensi tambahan:** `inkbeat-shorts/references/characters.md`, `templates/README.md`, serta kode `char/Character3D.tsx`, `skeleton.ts`, `core/ik.ts`, bagian `geometry.ts`, `clothes.ts`, `material.ts`, `face.ts`, `captions.tsx`, `demo/*.tsx`. Belum dibaca: `look-and-ink.md`, `sets-and-materials.md`, `camera-and-editing.md`, `audio-and-voice.md`, `flicker-and-determinism.md`, `production.md`. Video YouTube tidak ditonton.
- **Bukti:** content.md §6.2.
- **Revisi 1 (2026-11-15, atas arahan pemilik):** pemilik menyukai arah visual 3D; desain C1 **belum** final. Diperbaiki: sambungan bahu–lengan kaos (sendi bahu lebih tinggi lewat field Build opsional `shoulderT`/`shoulderIn` di inkbeat, default tidak berubah; lengan kaos *loft*) dan gerak menjangkau gelas (`studio/src/c1/reach.ts`: tatapan dulu, tempo per aksi, telapak terkunci ke gelas, badan mengikuti, siku *swivel*). Gelas digeser 5 cm menjauh dari tepi meja. Hasil `demo3d_c1_rev1.mp4`; demo lama dipertahankan. Status D-021 tetap menunggu pemilik. Bukti: content.md §6.3.

## D-022

**Pilot 2026-11-001 dibangun di `studio/` sebagai rough cut seluruh cerita; perintah render dilindungi dari penimpaan**

- **Tanggal:** 2026-11-15
- **Status:** approved (keputusan teknis Claude Code atas arahan pemilik); desain Tyo (butir 3) **pending** pemilik
- **Diputuskan oleh:** pemilik (arah: rough cut seluruh cerita, tanpa demo pendek tambahan; jangan menimpa demo pembanding); Claude Code (pilihan teknis)
- **Keputusan:**
  1. Pilot = komposisi `Pilot` (`studio/src/pilot/`), teks/timing/shot/beat di `pilot-plan.json`. C1, set warung, rig, dan gerak raih (`src/c1/reach.ts`) dipakai ulang tanpa diubah.
  2. Karakter lain dibuat sebagai "look" dari keluarga stick C1 (`StickLook` di `src/c1/C1.tsx`), memakai rig yang sama. C1 tetap identik (still uji frame 205 identik piksel sebelum/sesudah refaktor).
  3. Tyo (C2) 3D adalah **usulan**: kepala oval sedikit lebih tinggi, rambut pendek gelap, kemeja kantor biru muda berkerah dengan saku dada, tangan oval tanpa jari, kartu ID pada lanyard, tanpa "Uq". Still: `_media/2026-11-001/out/c2_tyo_usulan_v1.png`.
  4. Render: `npm run render:pilot` → `pilot_2026-11-001_roughcut_v1.mp4`; `render:demo3d-rev1` → `demo3d_c1_rev1.mp4`. Perintah lama `render:demo3d` (menimpa `demo3d_c1.mp4`) dihapus. `tools/finish_render.mjs` **menolak** menimpa berkas keluaran yang sudah ada (kecuali `FORCE=1` disengaja).
  5. Timing rough cut = **sementara** (± 2,2 kata/detik), diberi label di video. Setelah voice-over ada, timing kata nyata menggantikan `lines[]` dan beat/shot digeser.
- **Konsekuensi:** demo 2D (D-020, `scripts/render_video.py`) menjadi arsip. Panduan aktif diselaraskan ke jalur 3D: [[STUDIO-WORKFLOW]], [[ARCHITECTURE]], [[ROADMAP]], Channel DNA lab, skill `video-production` v0.2. Bukti: content.md §6.4.

## D-023

**Pembagian kerja voice-over: naskah bersih terpisah dari paket TTS ber-audio-tags**

- **Tanggal:** 2026-11-15
- **Status:** approved oleh pemilik 2026-11-15
- **Diputuskan oleh:** pemilik
- **Keputusan:**
  1. ChatGPT membantu menyusun naskah dan arah emosi.
  2. Claude Code menyiapkan salinan TTS dengan audio tags sesuai dokumentasi resmi model aktif (diverifikasi, bukan dikarang).
  3. Naskah terkunci tetap bersih. Tags, kapital penekanan, model, dan pengaturan disimpan terpisah (di Content Unit, mis. 2026-11-002 §9.5a).
  4. Setelah naskah disetujui, Claude Code menyajikan **seluruh** paket TTS siap salin sekaligus, bukan per segmen.
  5. Generasi dilakukan pemilik secara manual di situs ElevenLabs. Alasan: paket Free tidak mengizinkan voice library lewat API (HTTP 402 `paid_plan_required`, 2026-11-15).
- **Konsekuensi:** pendekatan yang berhasil dicatat di [[elevenlabs-v4-audio-tags]]. Hak penggunaan komersial (D-004) tetap keputusan terpisah dari persetujuan kualitas audio.
- **Bukti:** 2026-11-002 content.md §9.5a, §9.8.

## D-024

**Skill pihak ketiga sebagai lapisan referensi di bawah skill proyek `video-production`**

- **Tanggal:** 2026-11-16
- **Status:** approved — pemilik 2026-11-16 (lihat "Persetujuan pemilik" di akhir entri). Pemasangan dilakukan atas instruksi pemilik (master prompt "Integrasi Skill Pihak Ketiga", 2026-11-16) dan bisa dibatalkan dengan menghapus folder yang tercantum di `.claude/skills/VENDOR.md`.
- **Diusulkan oleh:** pemilik (daftar sumber, skill yang diambil/ditolak, aturan keras); Claude Code (review keamanan/bentrok, pemasangan, override).
- **Keputusan:**
  1. Skill buatan proyek = **lapisan atas** yang memegang aturan proyek. Skill pihak ketiga = **lapisan referensi** teknik. Urutan prioritas: (1) `CLAUDE.md`, (2) `video-production`, (3) `remotion-*`, (4) `threejs-*`. Bila bentrok, lapisan atas menang. Override wajib ditulis di `video-production` v0.3 §8–§10, bukan di file vendor.
  2. Dipasang di repo (`.claude/skills/`), lisensi MIT, commit `0e181866f095b5f06d005133876e926515390d95` dari `cloudai-x/threejs-skills`: `threejs-fundamentals`, `-geometry`, `-materials`, `-lighting`, `-animation`, `-react-three-fiber`, `-postprocessing`, `-performance`. File LICENSE asli disertakan di tiap folder.
  3. Dipasang di **level user** (`~/.claude/skills/`, di luar Git), commit `7e541aa4d7361dfaca0780a565a47307eb7bdfbb` dari `remotion-dev/skills`: `remotion-markup`, `-render`, `-captions`, `-docs`. Alasan: repo itu tidak punya file LICENSE (API GitHub 404); lisensi monorepo Remotion ("Remotion License", source-available) tidak jelas mengizinkan redistribusi. Konsekuensi: skill ini aktif di semua proyek di laptop ini dan tidak ikut tercadang di Git.
  4. Isi vendor tidak diubah: byte-identik dengan blob Git di commit yang dipin (diverifikasi dengan sha256; 9 file threejs + 82 file remotion, 0 selisih). Update hanya lewat prosedur di `VENDOR.md` (clone di luar repo, SHA baru, diff, review ulang), tidak pernah lewat `npx skills`, `gh skill install`, atau `remotion-upgrade`.
  5. **Pengecualian dari aturan skill proyek:** skill vendor tidak mengikuti format 11 bagian ([[ARCHITECTURE]] §6) dan tidak tunduk pada aturan [[DECISION-LOG#D-008]] ("skill ditulis setelah tahap dijalankan"), karena bukan skill buatan proyek dan tidak ditulis dari pengalaman pipeline kita. `video-production` tetap mengikuti D-008: v0.3 hanya menambah tumpukan skill dan override, bukan langkah produksi baru yang belum diuji.
  6. **Tidak dipasang:**
     - `remotion-best-practices`: ditolak setelah review. Isinya router plus salinan bersarang semua skill yang dikecualikan, dan mengarah ke `remotion-upgrade` (`npx remotion upgrade`, `npx skills update … --yes`). Ini bertentangan dengan kunci versi. Fungsinya juga sudah tercakup oleh empat skill mandiri.
     - Dari `remotion-dev/skills`: create, saas, maps, interactivity, studio, multimedia, license, upgrade (dikecualikan oleh brief).
     - Dari `cloudai-x/threejs-skills`: interaction, loaders, asset-pipeline, textures, shaders (belum ada kebutuhan).
     - `heygen-com/hyperframes`: 2D HTML/GSAP, tumpang tindih dengan Remotion. Alasan dari pemilik; tidak di-clone atau direview di sesi ini.
     - `kevinbadi/blender-skills`: turntable produk 16:9, Meshy berbayar, lisensi tidak tercantum. Alasan dari pemilik; tidak di-clone atau direview di sesi ini.
- **Temuan review (ringkas; rinci di [[skills-pihak-ketiga]] dan `VENDOR.md`):**
  - Tidak ada obfuscation, eksfiltrasi, prompt injection, atau karakter tersembunyi.
  - Tidak ada skrip yang berjalan otomatis. Dua skrip `.mjs` (folder maps bersarang di `remotion-markup`) hanya mengolah geometri lokal dan tidak dijalankan.
  - Bentrok yang ditangani lewat override:
    - waktu berbasis loop/delta dan `Math.random` tanpa seed (threejs);
    - perintah install/upgrade dan render yang bisa menimpa file (Remotion CLI menimpa secara default);
    - permintaan API key ElevenLabs dan aset remote saat render;
    - WebGPU/TSL;
    - tone mapping ACES dan PBR sebagai default;
    - contoh caption landscape.
- **Risiko sisa:** override hanya berlaku bila `video-production` ikut dimuat. Skill vendor bisa terpicu sendiri, termasuk di proyek lain (level user). File vendor dan `CLAUDE.md` tidak diubah sesuai brief, jadi satu-satunya mitigasi adalah deskripsi `video-production` yang meminta dimuat sebelum memakai saran skill vendor.
- **Konsekuensi:** [[ARCHITECTURE]] §6 mendapat paragraf "Skill pihak ketiga". [[ROADMAP]] mendapat task EXP-002 (`proposed`; [[EXP-002-gerak-natural]]). Belum di-commit.
- **Persetujuan pemilik (2026-11-16):**
  - D-024 **disetujui**.
  - Skill Remotion di **level user** boleh tetap aktif di semua proyek di laptop ini.
  - `remotion-docs` **dihapus** (`~/.claude/skills/remotion-docs/` dihapus Claude Code 2026-11-16). Alasan: fungsinya hanya panggilan keluar (Algolia + remotion.dev) dan mendorong API lebih baru dari 4.0.540. Pengganti: baca API di `studio/node_modules` (4.0.540) atau dokumentasi Remotion secara manual. Skill Remotion yang terpasang kini 3: `remotion-markup`, `-render`, `-captions`.
  - Commit diizinkan setelah pemeriksaan rahasia.

## D-025

**2026-11-002: storyboard v0.2 disetujui dengan penyesuaian; referensi desain adik dan NPC dasar disetujui**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik). Model 3D yang dibuat dari referensi ini **belum** disetujui.
- **Diputuskan oleh:** pemilik.
- **Keputusan:**
  1. **Audio:** preview audio v2 tetap disetujui. Rekaman, pembawaan, dan naskah tidak diubah.
  2. **Storyboard v0.2** ([[04-PRODUCTION/2026-11-002/content|2026-11-002]] §4) disetujui sebagai dasar plan JSON, dengan penyesuaian:
     - A04: pengumuman L2 berulang pelan **di bawah L5**; narator tetap jelas.
     - A07: pesan L16 tampil **sampai selesai** sebelum pindah ke wajah C1.
     - A10: **dua shot dipertahankan**, ditambah gerak kamera pelan ~~dan reaksi karakter~~ (diklarifikasi [[DECISION-LOG#D-026]]: tanpa shot reaksi; reaksi adik di A11).
     - A17: **+1 detik hening** di akhir timeline video agar kartu pilihan tampil ± 3 detik. Audio v2 tidak ditimpa; durasi video 99,56 s (frame 0–2987).
     - A14 dan A16: kecukupan waktu dievaluasi saat animatic. Perpanjangan **belum** disetujui.
     - Durasi/frame dihitung ulang dari berkas aktual bila diperlukan.
  3. **Adik (C3) — desain final disetujui** dari `studio/out/rev/C3_adik_ref_v1.jpg` (md5 `e738715f0a0ca241b6e154e375e65449`): perempuan 12–13 tahun, rambut bob hitam, piyama peach **termasuk celana**, jaket mustard dibawa di lengan. **Celana = pengecualian BODY RULE** yang disetujui pemilik (khusus adik).
  4. **NPC — referensi desain dasar disetujui** dari `refrences/NPC_lineup_v1.jpg` (md5 `c59b000a65c5a84d607a0077f91cbfe9`):
     - Bapak/W1: rambut pendek, kaos krem, sarung kotak cokelat tersampir di bahu.
     - Ibu/W2: rambut disanggul rendah, atasan sage.
     - Anak warga: rambut pendek sedikit berantakan, kaos biru kusam, lebih pendek dari adik.
  5. **Penyederhanaan saat pemodelan:**
     - Tangan NPC = oval putih sederhana tanpa jari.
     - Kaki = bentuk sederhana proyek, bukan sepatu kecil seperti di gambar.
     - Tanpa hidung dan garis wajah tambahan.
     - Yang dipertahankan: identitas rambut, warna pakaian, sarung, dan perbedaan usia.
     - NPC tidak memakai "Uq".
- **Alasan:** timing audio v2 menimbulkan konflik dengan rencana visual (§8 butir 5–8). NPC perlu dibuat dari preset agar video berikutnya tidak menunggu gambar referensi baru untuk setiap figuran.
- **Konsekuensi:**
  - Claude Code membuat preset `studio/src/cast/npc.tsx` dan lineup 3D (`_media/2026-11-002/out/cast_lineup_v1*.png`, lalu `cast_lineup_v2*.png` dengan koreksi warna) sebagai **usulan model**. Detail: content.md §10, panduan [[npc-presets]].
  - `C1.tsx` hanya mendapat tambahan yang tidak aktif untuk C1. Still C1 diverifikasi tidak berubah.
  - Tidak ada animasi, siklus jalan, EXP-002, instalasi, perubahan dependency, atau commit di sesi ini.
- **Masih terbuka:**
  - persetujuan visual model 3D;
  - ~~arti "reaksi karakter" di A10~~ (dijawab D-026);
  - gendongan dan anak yang digendong W2;
  - gerak berjalan warga;
  - musik;
  - sumber SFX berlisensi;
  - lisensi komersial ElevenLabs (D-004).

## D-026

**2026-11-002: revisi terbatas model 3D; balita digendong ibu; A10 tanpa shot reaksi**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik) sebagai arahan. Hasil model revisi **menunggu** penilaian visual.
- **Diputuskan oleh:** pemilik, setelah menilai lineup v2.
- **Keputusan:**
  1. **Rambut adik** didekatkan ke `studio/out/rev/C3_adik_ref_v1.jpg`:
     - bob lebih mengikuti kepala, kurangi volume melebar dan bentuk helm;
     - tambah beberapa ujung rambut sederhana yang sedikit tidak beraturan;
     - wajah, tinggi, pakaian, dan identitas tetap.
  2. **Tangan adik dan NPC** harus terbaca sebagai oval putih berisi, bukan cincin.
     - Tetap tanpa jari.
     - Tangan C1 dan karakter 2026-11-001 tidak diubah. Pengaturan khusus dipakai untuk preset baru.
  3. **Anak yang digendong** = varian **balita ± 2–3 tahun** dari keluarga preset anak, tanpa referensi Flow baru.
     - Proporsi kepala dan tubuh disesuaikan untuk balita, bukan sekadar anak besar yang dikecilkan.
     - Preset anak warga yang ada tetap dipakai untuk kebutuhan lain.
     - Satu pose ibu menggendong balita: penopang tubuh jelas, tanpa anggota tubuh saling menembus, tanpa animasi.
  4. **A10:** tetap dua shot (corong toa, plat nomor 7) dengan gerak kamera pelan.
     - Tidak ada shot reaksi tambahan; reaksi adik tetap di A11.
     - Ini menggantikan frasa "reaksi karakter" di D-025.
- **Konsekuensi:** hasil di [[04-PRODUCTION/2026-11-002/content|2026-11-002]] §10.1:
  - `hands: "oval"` khusus preset;
  - slot `proportions` di `C1` (tidak aktif untuk C1);
  - preset `BALITA`, komponen `IbuGendong`;
  - lineup v3, still gendong, detail rambut/tangan, cek malam.
  - Tidak ada animasi, EXP-002, instalasi, commit, atau publikasi.
- **Masih terbuka:**
  - penilaian visual model revisi;
  - gerakan berjalan warga;
  - musik;
  - sumber SFX berlisensi;
  - potongan A07→A08;
  - salinan referensi adik ke `refrences/`;
  - lisensi ElevenLabs (D-004).

## D-027

**2026-11-002: model 3D dan pose gendong disetujui sebagai dasar produksi; gerak jalan warga reusable; animatic seluruh cerita**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik) sebagai arahan. **Bukan** persetujuan video final.
- **Diputuskan oleh:** pemilik.
- **Keputusan:**
  1. Desain model adik, bapak, ibu, anak warga, balita (`cast_lineup_v3.png`) dan pose gendong (`carry_ibu_balita_v2.png`) **disetujui** sebagai dasar produksi episode 2026-11-002. Tidak perlu revisi kosmetik lagi kecuali mengganggu keterbacaan shot atau gerak.
  2. Gerak berjalan warga yang bisa dipakai ulang **disetujui** untuk dibuat: berjalan, melambat sampai berhenti, menoleh.
     - Kaki menapak tanpa meluncur mencolok.
     - Kepala, badan, dan lengan tidak bergerak serentak.
     - Fase langkah bervariasi antarwarga.
     - Ibu menggendong: tangan penopang tetap menjaga balita; kain dan balita ikut tubuh dengan gerak ringan.
     - Deterministik per frame. Diuji internal, langsung dipakai di episode. **Bukan** eksperimen EXP-002.
  3. Lanjut sampai **animatic seluruh cerita dengan audio** (A01–A17), memakai audio preview v2 dan timing aktual. Naskah, kecepatan suara, dan TTS tidak diubah. Keputusan D-025/D-026 dipertahankan (A04, A07, A10, A17 +1 s, A14/A16 dievaluasi).
  4. Potongan A07→A08 dipilih Claude dari audio aktual sebagai **pilihan editing untuk ditinjau**.
  5. Musik dan SFX baru belum dibuat (keputusan terbuka). Efek toa yang disetujui dipertahankan.
  6. Referensi adik disalin ke `refrences/` tanpa menghapus sumber.
- **Pilihan editing Claude (untuk ditinjau):**
  - **A07→A08 di 41,08 s.** Pesan L16 berakhir 40,10 s dan tetap di layar sampai 40,25 s; wajah C1 tampil 40,25–41,08 s (0,83 s), dua frame sebelum L17 (41,15 s). Alasan: reaksi butuh ± 1 detik; potong sebelum kata pertama L17 supaya narasi tidak terpotong. Audio tidak digeser.
  - **A17 memakai pan, bukan wide statis.** Dalam bingkai vertikal 9:16, jendela depan dan lorong tidak muat dalam satu bingkai dari dalam ruang tamu (jarak keduanya ± 4 m, kamera paling jauh ± 1,7 m). Kamera mengikuti lirikan C1: jendela saat "tetap di dalam…", lorong saat "…keluar lewat belakang", lalu kembali ke keduanya untuk kartu pilihan.
  - **Pengulangan L2 dari toa:** pelan di bawah L5 (A04, −6 dB, low-pass 3,4 kHz), lalu samar di A07–A08 (30,1 s, 36,3 s, 41,25 s; −11/−12 dB, low-pass 2,4 kHz). Pengulangan terakhir terputus tepat di awal L18 "Pengumuman itu berhenti" (43,50 s), sesuai content.md §5.3.
- **Konsekuensi:** animatic `_media/2026-11-002/out/episode_2026-11-002_animatic_v2.mp4` (v1 = riwayat, cacat di A14/A17); hasil di [[04-PRODUCTION/2026-11-002/content|2026-11-002]] §11. Panduan gerak dan preset: [[npc-presets]].
- **Masih terbuka:**
  - penilaian animatic v1;
  - musik;
  - sumber SFX berlisensi;
  - lisensi komersial ElevenLabs (D-004);
  - tampilan malam yang lebih gelap (tahap lighting).

## D-028

**Referensi gaya tunggal "Badai Matahari"; aturan 2D/Google Flow diarsipkan; skill terpasang wajib dipakai**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik), sesudah menolak animatic v2.
- **Diputuskan oleh:** pemilik.
- **Keputusan:**
  1. **Referensi gaya tunggal:** "Badai Matahari" Ep 1 dan Ep 2 (`refrences/Badai Matahari - Episode 2.mp4`; Ep 1 di Downloads).
     - Yang disukai pemilik: gerak model 3D; warga konsisten dan tangan tidak ke mana-mana; ekspresi terbaca; VO dan SFX (mis. keran air) pas; semua model di tempatnya (tidak ada balok menutupi pintu).
     - Hasil studi terukur: [[2026-11-16-style-target-badai-matahari]] (dokumen wajib).
  2. **Aturan 2D/Google Flow tidak relevan dan dikeluarkan dari aturan aktif** (izin pemilik untuk menghapus/meniadakan). Dipindah dengan `git mv` ke `_arsip/2d-google-flow/`:
     - master prompt;
     - skill arsip 2D;
     - `scripts/render_video.py`;
     - salinan STUDIO-WORKFLOW v0.4.

     Dokumen yang ditulis ulang atau diperbarui: STUDIO-WORKFLOW v1.0 (khusus 3D), CHANNEL-DNA §3, CLAUDE.md (§16 aturan video; perangkat dikoreksi dari "Apple M1 8 GB" menjadi Windows + RTX 3050 Ti; folder `_arsip/`).
  3. **Skill yang dipasang wajib dipakai dan diingat:**
     - `inkbeat-shorts` (skill pipeline milik pemilik, MIT) dipasang sebagai skill proyek `.claude/skills/inkbeat-shorts/` (salinan identik).
     - `video-production` v0.4 §11 mewajibkan urutan: baca target gaya → muat `video-production` → `inkbeat-shorts` + `threejs-*`/`remotion-*` sesuai tugas → sebut skill yang dipakai di laporan.
     - Gerbang look-dev dan pilot 15 s wajib.
     - QC = teknis + gaya.
     - Juga dicatat di CLAUDE.md §16 dan memori Claude.
- **Alasan:** animatic v2 ditolak ("banyak yang tidak masuk akal… jelek"). Akar masalah: referensi pemilik tidak pernah dipelajari, aturan 2D yang tidak relevan, skill kerajinan tidak dipakai, dan gerbang look-dev/pilot dilewati ([[2026-11-16-animatic-v2-ditolak]]).
- **Masih terbuka (perlu keputusan pemilik):**
  - gaya render: tetap toon bertinta (D-021) atau lembut tanpa tinta seperti referensi;
  - bentuk tubuh warga: stick hitam atau bertubuh + celana;
  - alat produksi: tetap kode three.js atau Blender + aset CC0;
  - sumber SFX/musik berlisensi.

## D-029

**Hapus total jalur 2D; arah render, tubuh karakter, uji Blender, dan audio buatan sendiri**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik. Pilihan bentuk tubuh diserahkan kepada Claude dengan syarat yang ditetapkan pemilik.
- **Keputusan:**
  1. **Hapus, jangan arsipkan.** Pemilik khawatir arsip suatu saat dibaca lagi dan merusak proyek. Yang dihapus:
     - folder `_arsip/` (master prompt 2D, skill arsip 2D, `render_video.py`, STUDIO-WORKFLOW v0.4);
     - `scripts/fonts/`;
     - isi keputusan D-011, D-012 (bagian jalur), D-014, D-016, D-017, D-020, dan bagian visual D-015 (diganti satu baris "dihapus");
     - bagian 2D di ARCHITECTURE, ROADMAP, README, CHANNEL-DNA;
     - kalimat "Apple M1 8 GB" di CLAUDE.md;
     - riwayat lama SESSION-HANDOFF.

     Isi lama hanya ada di git (`484f1be`).
  2. **Render:** tetap 3D bertinta, tetapi **garis tinta dibuat tipis**, tidak terlalu bertinta.
  3. **Tubuh karakter:** pemilik ingin tetap stick hitam bila memungkinkan, tetapi mewajibkan bertubuh dan bercelana bila itu lebih mudah. **Claude memilih bertubuh + bercelana** untuk semua karakter, termasuk C1 (kepala, wajah, kaos "Uq", dan tangan C1 tetap). Alasan:
     - stick hitam hilang di malam yang gelap (target L* 20–30);
     - lengan bertubuh membuat posisi tangan lebih terbaca;
     - rig humanoid standar lebih mudah di Blender;
     - sesuai referensi.

     Hasil dinilai pemilik di look-dev.
  4. **Blender diuji** dengan satu shot beberapa detik; dari hasilnya diputuskan three.js atau Blender.
  5. **SFX, ambience, dan musik dibuat sendiri secara prosedural** (sintesis), bukan dari pustaka pihak ketiga, sehingga tidak ada masalah lisensi. Batas: Claude tidak bisa mendengar; kualitas dinilai pemilik, dan sinyal diukur (level, LUFS).

## D-030

**Blender tidak dipakai; produksi tetap di three.js dengan skill**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik
- **Konteks:** uji Blender v1 ([[2026-11-16-uji-blender-v1]]). Pemilik: "saya tidak menyukai bagaimana 3d di pakai di blender".
- **Keputusan:**
  1. Blender tidak dipakai untuk produksi. D-029 butir 4 (uji Blender) selesai dengan hasil ini.
  2. Jalur produksi tetap `studio/` (Remotion 4.0.540 + React Three Fiber + three.js). Kerajinan mengikuti `inkbeat-shorts`, teknik mengikuti `threejs-*` dan `remotion-*`, dan semuanya tunduk pada target gaya [[2026-11-16-style-target-badai-matahari]].
  3. Keputusan D-029 lainnya tetap berlaku: tinta tipis, karakter bertubuh + bercelana, SFX/musik sintesis.
  4. Pelajaran dari uji Blender yang dibawa ke three.js:
     - malam harus diterangi sumber hangat yang terlihat (target L* 23–27, bukan hitam);
     - karakter harus halus dan ramping, bukan balok;
     - wajah harus terlihat sejak awal shot.
- **Langkah berikutnya:** look-dev three.js (still berdampingan dengan referensi), lalu STOP untuk pemilik.

## D-031

**Desain tubuh, celana, dan tinta tipis disetujui; Three.js/R3F + Remotion jadi stack wajib produksi**

- **Tanggal:** 2026-11-16
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik
- **Keputusan:**
  1. **Disetujui (desain saja):** bentuk tubuh bertubuh, celana, sepatu, dan ketebalan tinta pada look-dev v1 ([[2026-11-16-lookdev-threejs-v1]]). Mencakup:
     - `StickLook.limbs` dan `inkK` (THIN_INK_K 0,55);
     - `C1_BODIED`, `ADIK_B`, `BAPAK_B`, `IBU_B` di `studio/src/ep002/LookDev.tsx`.

     **Belum disetujui:** pencahayaan, set, dan video final.
  2. **Stack wajib produksi:**
     - **Three.js / React Three Fiber** untuk karakter, set, material, pencahayaan, dan gerak 3D;
     - **Remotion** untuk timing berbasis frame, komposisi, kamera mengikuti timeline, subtitle, sinkronisasi audio, dan render.
  3. Sebelum mengerjakan video, skill `threejs-*` dan `remotion-*` yang relevan dibaca dan **diterapkan**. Laporan menyebut skill yang benar-benar dipakai dan pengaruhnya pada hasil, bukan sekadar daftar nama. `video-production` tetap aturan proyek; `inkbeat-shorts` dan target gaya Badai Matahari tetap acuan visual.
  4. Skill tambahan boleh dipakai bila menyelesaikan kebutuhan konkret. Mencari atau memasang skill baru tidak menjadi pekerjaan tersendiri. Tidak ada install atau upgrade dependency tanpa keputusan baru.
  5. Tugas berikut tanpa gerbang ulang untuk tubuh dan tinta:
     - pencahayaan lokal (genangan lampu, sudut gelap, bulan yang tidak memutihkan dinding);
     - properti rumah Indonesia yang masuk akal;
     - pilot 15 detik bersuara dari audio yang sudah disetujui.

     Angka L* dan piksel gelap dipakai sebagai alat diagnosis, bukan satu-satunya kriteria.
- **Batas:** versi lama dipertahankan; output baru disimpan dengan nama baru; desain C1 lama dan episode 2026-11-001 tidak diubah; tidak ada commit atau publikasi.

## D-032

**Urutan prioritas produksi video**

- **Tanggal:** 2026-11-17
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik (setelah pilot v2 belum disukai)
- **Keputusan:**
  1. Urutan prioritas:
     - (1) identitas dan bentuk karakter konsisten antar shot, sudut kamera, dan pose;
     - (2) gerak dan reaksi alami, tidak kaku;
     - (3) kejelasan cerita;
     - (4) detail set, pencahayaan, efek, dan cacat kecil sebagai pemolesan berikutnya.
  2. Angka target gaya (L*, piksel gelap, frame diam, jumlah properti) hanya alat diagnosis, bukan ukuran utama keberhasilan.
  3. Kekurangan gerak tidak boleh disembunyikan dengan close-up atau motion blur. Gerak dievaluasi tanpa blur lebih dulu.
  4. C1 tidak berbicara mengikuti narasi; narator bukan dialog langsung C1.
  5. SFX/musik tambahan di pilot v2 **tidak** dianggap disetujui. Yang disetujui tetap audio v2 + pengulangan TOA (D-025).
  6. Pipeline tetap Three.js + Remotion (D-031). Tidak menambah properti, skill, atau alat tanpa permintaan.
- **Penerapan pertama:** revisi A02–A04 v3 ([[2026-11-17-pilot-a02-a04-v3]]).

## D-033

**Arah revisi v3 jadi acuan produksi; animatic lengkap; uji SFX dari koleksi pemilik**

- **Tanggal:** 2026-11-17
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik
- **Keputusan:**
  1. Pemilik lebih menyukai revisi A02–A04 v3 ([[2026-11-17-pilot-a02-a04-v3]]) dan menjadikannya **acuan produksi**. Yang dipertahankan:
     - proporsi karakter konsisten lewat kamera;
     - gerak dengan tumpuan dan perpindahan berat;
     - jeda wajar antara kepala, badan, dan tangan;
     - siluet terbaca dalam cahaya malam;
     - C1 bereaksi tanpa mengucapkan narasi.

     **Video final belum disetujui.**
  2. Animatic lengkap episode 2026-11-002 dibuat dengan pendekatan ini. Fokus gerak: menarik adik dari pintu, menggenggam tangan, warga berjalan–berhenti–menoleh. Reaksi A04 yang halus cukup untuk tahap ini.
  3. Dua koreksi v3: perpindahan tangan ke pangkuan dirapikan bila siku menyentak; subtitle A04 diatur agar dada dan "Uq" terbaca.
  4. **SFX:** Claude boleh menyeleksi SFX dari `refrences/SFX/` (koleksi gratis yang diunduh pemilik, belum dianalisis) untuk **preview** animatic:
     - isi audio diperiksa, bukan hanya nama file;
     - dipakai secukupnya, jeda hening dipertahankan;
     - narasi dan bisikan adik tetap jelas;
     - sumber asli tidak diubah (yang diolah salinannya);
     - pilihan dicatat (file, waktu, tujuan, volume);
     - sumber/lisensi yang belum jelas ditandai untuk dituntaskan **sebelum publikasi**;
     - Claude tidak bisa mendengar, jadi pilihan = kandidat yang perlu didengar pemilik.
  5. **Musik latar masih menunggu keputusan pemilik.** Mixing dinilai bersama video.
- **Batas:** tidak ada commit atau publikasi.

## D-034

**Arah cerita video berikutnya**

- **Tanggal:** 2026-11-17
- **Status:** approved (pemilik); butir 1 dan sebagian butir 3 **superseded oleh [[DECISION-LOG#D-035]]** (2026-11-17). Butir 2 dan 4 tetap berlaku.
- **Diputuskan oleh:** pemilik, sesudah video pertama (2026-11-002) selesai.
- **Dasar:** umpan balik pemilik (bukan analytics). Interaksi di 2026-11-002 terlalu lambat, dan cerita terlalu bergantung pada pilihan di akhir.
- **Keputusan:**
  1. Video berikutnya menguji **topik berbeda**, tidak terikat performa 2026-11-002.
  2. **Interaksi antartokoh lebih awal**, dan **payoff di dalam video yang sama**.
  3. Pilihan di akhir boleh ada sebagai pertanyaan reflektif, bukan penopang cerita. Tidak ada janji kelanjutan, dan komentar A/B tidak menentukan episode berikutnya.
  4. **Identitas C1 tetap** konsisten (desain D-018/D-021/D-031).
- **Menggantikan:** bagian "pilihan konkret di akhir" pada pola cerita D-015 untuk video berikutnya ([[STUDIO-WORKFLOW]] §2).

## D-035

**Urutan video, nomor episode, dan kelanjutan seri "Peringatan dengan Suaramu Sendiri"**

- **Tanggal:** 2026-11-17
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik (koreksi arah proyek, 2026-11-17).
- **Dasar:** arahan pemilik. Pemilik menilai hasil awal Episode 1 menjanjikan. Angka yang tersedia: [[05-DATA/analytics/2026-11-002/2026-11-17-snapshot-01-analisis|snapshot 1]] (umur ±11 jam).
- **Keputusan:**
  1. **Nama channel:** **Uq.cerita** (YouTube `@Uq.cerita`, Instagram `uq.cerita`, TikTok `@uq.cerita`). Di dokumen internal akun ini tetap disebut akun/channel "lab" ([[DECISION-LOG#D-003]]).
  2. **Pemetaan urutan video, nomor episode, dan ID produksi:**

     | Urutan produksi | ID produksi | Judul | Peran | Status |
     |---|---|---|---|---|
     | 1 | `2026-11-001` | Angka di Atas Kepala Sahabatmu | **Arsip pembelajaran** (latihan produksi; tidak tayang) | tidak dilanjutkan |
     | 2 | `2026-11-002` | Peringatan dengan Suaramu Sendiri | **Episode 1** seri aktif | tayang 2026-11-17 |
     | 3 | usulan `2026-11-003` (belum dibuat) | belum ada | **Episode 2**, melanjutkan Episode 1 | brief cabang, menunggu pilihan pemilik |

     Nomor episode = urutan cerita yang tayang, bukan urutan ID produksi. Folder `05-DATA/analytics/2026-11-002/` menyebut video ini `episode_1`.
  3. **2026-11-001 dan eksperimen pendahulunya** (demo 2D/3D, rough cut, Tyo, uji Blender, look-dev, pilot 15 s) adalah **arsip pembelajaran**. Arsip boleh dibaca untuk mengambil pelajaran produksi (gerak, konsistensi bentuk, cahaya, suara, proses revisi), tetapi **bukan sumber alur cerita aktif**. Aset dan kode yang masih dipakai produksi tetap dipakai dan tidak dipindahkan.
  4. **[Cara memilih cabang diperbarui [[DECISION-LOG#D-046]] butir 7: untuk seri interaktif di channel ini, cabang = suara terbanyak komentar.]** **Episode 2 melanjutkan cerita Episode 1** dari pilihan di akhir: Uq tetap di dalam rumah bersama adiknya, atau membawa adiknya keluar lewat pintu belakang. Cabang dipilih pemilik. Komentar penonton boleh dipakai sebagai masukan (sebut jumlah dan sumbernya), bukan sebagai voting yang mengikat.
  5. **Dibatalkan:** brief chat 2026-11-17 berisi tiga premis baru (ojol, angka kebohongan, angkot) dan rekomendasi mengembangkan ulang "Angka di Atas Kepala Sahabatmu". Brief itu hanya ada di chat, tidak tersimpan di file.
- **Menggantikan:** [[DECISION-LOG#D-034]] butir 1 ("topik berbeda") dan bagian butir 3 ("tidak ada janji kelanjutan, komentar A/B tidak menentukan episode berikutnya"). D-034 butir 2 (**interaksi antartokoh lebih awal, payoff di video yang sama**) dan butir 4 (**identitas C1 tetap**) tetap berlaku untuk Episode 2.
- **Konsekuensi:**
  - Sesi baru memprioritaskan Episode 1 ([[04-PRODUCTION/2026-11-002/content|2026-11-002]]) dan kelanjutannya; lihat [[SESSION-HANDOFF]].
  - Episode 2 memakai fakta akhir Episode 1 sebagai kontinuitas. Kemampuan, asal-usul, atau aturan ancaman baru harus disiapkan dengan petunjuk, bukan diumumkan mendadak.
  - Hak audio Episode 1 mengikuti arahan pemilik yang sudah tercatat di content.md 2026-11-002 (paket ElevenLabs Pro diasumsikan; SFX folder proyek boleh dipakai). Tidak diaudit ulang.
- **Batas:** tidak ada naskah, storyboard, audio, atau render Episode 2 sebelum pemilik memilih cabang. Tidak ada commit atau push.

## D-036

**Episode 2: cabang A (tetap di dalam)**

- **Tanggal:** 2026-11-17
- **Status:** approved (pemilik) untuk pilihan cabang. Naskah: **pending**.
- **Diputuskan oleh:** pemilik, lewat pertanyaan pilihan di Claude Code (2026-11-17 malam), dari brief dua cabang (ringkasan di [[SESSION-HANDOFF]]).
- **Dasar:** kesinambungan dengan Episode 1 (L33 menyebut "menunggu petugas keamanan"; pesan petugas "jangan keluar dulu"), petunjuk lampu yang sudah tampil (A13), dan kelayakan produksi (satu set yang sudah ada, dua tokoh). Bukan hasil voting penonton: isi komentar belum dibaca, retention belum tersedia.
- **Keputusan:**
  1. Episode 2 mengikuti **cabang A**: Uq tetap di dalam bersama adik dan mengunci pintu belakang.
  2. ID produksi Episode 2: **`2026-11-003`** ([[04-PRODUCTION/2026-11-003/content|content.md]]).
  3. Cabang B (keluar lewat belakang) tidak diproduksi untuk Episode 2. Ide-idenya boleh dipertimbangkan lagi untuk episode berikutnya.
- **Masih terbuka (content.md 2026-11-003 §5):** persetujuan naskah v0.1, aturan ancaman "suara hanya tahu yang terlihat dari luar", label "HARI 1", kartu akhir, durasi, hak VO.
- **Batas:** tidak ada audio, storyboard, atau render sebelum naskah disetujui. Tidak ada commit atau push.
- **Pembaruan 2026-11-17 (arahan pemilik, naskah v0.3):** label pembuka "HARI 1 / EPISODE 2" dan kartu pilihan penutup (A. CEK PINTU DEPAN / B. TETAP DIAM BERSAMA ADIK) diinginkan; ini menggantikan usulan sementara "tanpa label hari, tanpa kartu pilihan" di v0.2. Naskah tetap **pending** persetujuan. Rincian: [[04-PRODUCTION/2026-11-003/content|content.md]] §2.4–§2.5.
- **Pembaruan 2026-11-17 (pemilik):** **naskah v1.0 disetujui** (v0.3 + pilihan A "INTIP PINTU DEPAN" dengan narasi penutup baru; kartu muncul saat narasi penutup dan bertahan ± 2–3 s). Disetujui juga: pintu belakang belum terkunci lalu digerendel, "Kak"/"Pak satpam", label HARI 1 / EPISODE 2 gaya Ep 1, kartu vertikal, durasi fleksibel. Ini persetujuan naskah dan arahan visual, bukan video final (`approved-by-owner` tetap `false`). Tahap yang diizinkan: storyboard (v0.2 dibuat setelah catatan pemilik, menunggu tinjauan).

## D-037

**Episode 2: storyboard disetujui; revisi cahaya "mencari gerendel"; still look-dev dapur**

- **Tanggal:** 2026-11-17
- **Status:** approved (pemilik)
- **Diputuskan oleh:** pemilik.
- **Keputusan:**
  1. Storyboard v0.2 2026-11-003 **disetujui** dengan satu revisi (butir 3).
  2. Ponsel di saku kiri, dipegang tangan kiri (asumsi Ep 2): disetujui.
  3. Stand-off ± 1,0 m lalu maju dua langkah; gerendel di (x −0,95; y 1,10): disetujui. **Revisi cahaya:** Uq tidak sengaja mengarahkan senter ke atas; ia **mencari gerendel** yang tidak terlihat. Sorot yang ditutup telapak kanan menyapu daun pintu dari area kenop ke atas, melewati kaca lubang angin, lalu turun dan berhenti di gerendel. Kaca harus **terlihat** menghangat oleh penonton walau samar.
  4. Material kaca lubang angin diganti agar menerima cahaya: disetujui. Cadangan (b) sumber bocor khusus kaca dan (c) ubah ukuran/tinggi kaca: **belum disetujui**.
- **Tahap berikutnya yang diizinkan:** still look-dev dapur + uji cahaya (a–e) 1080×1920, tanpa animasi dan audio, berdampingan dengan frame referensi target gaya. Pilot, audio ElevenLabs, render video, commit, push: belum.
- **Konsekuensi:** storyboard v0.3 (content.md §3.3, S03–S05). Kode aditif: `HouseInterior` props `vent="lit"` dan `backBolt` (default lama tidak berubah), komposisi `LookDev003-a..e`.

## D-038

**Episode 2: momen sapuan dan gerendel dipecah (opsi 1); S03 dengan adik kecil; S06 dipindah; look-dev dapur v3**

- **Tanggal:** 2026-11-18
- **Status:** keputusan pemilik 1–4 approved. Hasil look-dev H1–H3 = usulan Claude, **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik, atas laporan look-dev v2 ([[04-PRODUCTION/2026-11-003/content|content.md]] §7.1).
- **Keputusan pemilik:**
  1. Momen sapuan dan gerendel memakai **opsi 1 (dipecah)**: sapuan dan kaca dilihat dari belakang (S03), tangan/ponsel/gerendel lewat insert S04. Kamera K3 tidak dipakai. Blocking stand-off tetap.
  2. S03: adik tetap terlihat, kecil di tepi bingkai, bukan kepala besar di latar depan.
  3. Usulan S06 dipindah ke x −1,15 agar tidak menyeberang garis 180°: disetujui.
  4. Tambahan: S05 harus punya shot reaksi wajah Uq yang jelas. Usulan pemilik: close-up dari arah pintu sesudah gerendel terkunci, wajah diterangi cahaya bocor dari sela jari. Claude diminta menghitung kelayakannya dan memberi alternatif bila tidak layak.
- **Hasil look-dev v3 (usulan, menunggu pemilik; angka di content.md §7.2):**
  H1. **Close-up dari arah pintu tidak layak.** Sesudah maju, jarak pusat kepala ke daun pintu hanya 0,56 m. Lensa terjauh berada 0,49 m dari pusat kepala (0,32 m dari permukaan wajah). Rasio perspektif depan/pusat kepala 1,56, sedangkan pada 2,2 m 1,09. Ini melanggar aturan jarak ≥ 2,2 m dan pelajaran distorsi proporsi ([[STUDIO-WORKFLOW]] §8.2 no. 2). Still bukti dibuat dan diberi label MELANGGAR. **Alternatif yang diusulkan:** close-up dari dapur barat-barat daya, 2,24 m, fov 30°. Saat toa berbicara, Uq memalingkan wajah ke kiri menjauhi pintu (badan 30°, kepala 50°; tidak ke arah adik), dan wajahnya diterangi cahaya bocor senter. Ini akting baru dan perlu persetujuan.
  H2. **S03, posisi adik:** dari ruang tamu, kamera paling jauh 3,95 m dari adik, sehingga kepala adik tidak bisa lebih kecil dari ± 15 % tinggi bingkai tanpa ikut mengecilkan kaca. Ada dua varian:
     - **(i)** adik di sisi timur mulut lorong, di tepi kanan dan sebagian terpotong. Dengan lensa 40° kepala adik 11 % dan kaca tetap terbaca menyala (R/B 0,90). Ini usulan Claude. Konsekuensi: pegangan kusen S02 dan pasangan genggam S07–S12 perlu disesuaikan.
     - **(ii)** adik tetap di sisi barat, di tengah-kanan bawah.
  H3. **Genggaman ponsel (still a):** jari C1 hanya punya satu sendi dan panjangnya 3,1 cm. Dengan ponsel Ep 1 (tebal 0,9 cm), ujung jari paling jauh hanya sampai bidang layar (kurang 1 mm), jadi bentuk yang bisa dicapai adalah **jari mengait tepi ponsel** (g2), bukan melingkar sampai ke layar. Membungkus penuh butuh sendi jari kedua, yang berarti mengubah desain C1 yang sudah disetujui. Itu keputusan pemilik.
- **Koreksi laporan v2:** klaim "semua kamera S03–S07 di sisi barat garis" salah. Kamera S03 v2 berada di sisi **timur** (+0,71 m) dan still e +0,16 m. Kamera S03 v3 berada di sisi barat. Denah v2 juga masih memakai label lama (K1 2,3 m, K3 1,5 m). **K1 tidak dipakai**, jadi label "2,3 m" di render K1 tidak diperbaiki; cukup dicatat.
- **Dicatat untuk pilot (tidak diperbaiki sekarang):** lengan kanan Uq di S04 terlalu lurus.
- **Batas:** tidak ada pilot, audio, render video, commit, atau push.

## D-039

**Episode 2: look-dev dapur disetujui; S03 (i) lensa 40°; S05 berpaling ke depan rumah; genggaman g2; pilot S03–S06**

- **Tanggal:** 2026-11-18
- **Status:** approved (pemilik) untuk butir 1–4. Pilot: **terblokir menunggu voice-over**.
- **Diputuskan oleh:** pemilik, atas look-dev v3 (content.md 2026-11-003 §7.2).
- **Keputusan:**
  1. Look-dev dapur **disetujui** untuk lanjut ke pilot.
  2. S03 = varian (i) lensa 40°. Blocking S02 (adik memegang kusen **timur** dengan tangan kanan) dan S07 (adik bergeser ke **barat** agar genggaman S11–S12 tetap pas) diperbarui di storyboard. Belum dirender.
  3. S05: Uq berpaling ke arah **depan rumah** (asal suara toa), bukan ke kaca dan bukan ke adik. Senter mati saat Uq tersentak di awal kalimat toa. Ekspresi berubah dan terbaca dalam batas desain C1 (alis naik, mulut "o"; C1 tidak punya mata melebar).
  4. Genggaman ponsel: **g2** (jari mengait). Desain C1 tidak diubah.
- **Tugas yang diberikan:** pilot S03–S06 (L5–L9) dengan audio ElevenLabs (Dhani: narator dan toa; Zorin: adik), teks persis naskah v1.0, SFX folder proyek, waktu shot mengikuti audio.
- **Hasil 2026-11-18:**
  - Akun ElevenLabs masih `free` (read-only `GET /v1/user/subscription`). Sesuai D-023, suara library hanya bisa dipakai lewat situs, jadi audio harus dibuat pemilik.
  - Paket teks bersih + tag disiapkan (content.md §9). Pilot dibangun (`Pilot003`, `pilot003Stage.ts`) dan dicek angka. Skrip `plan`/`mix` audio siap dan teruji dengan VO pengganti.
  - MP4 pilot belum dirender karena timing harus berasal dari audio.
- **Temuan:**
  - Pegangan samping g2 di still a v3 menaruh lengan bawah 5,3 cm di dalam kaos. Di pilot diganti pose lengan menggantung (0,2 cm).
  - Langkah S07 "berbalik 180°" tidak lagi diperlukan, karena Uq sudah menghadap selatan sejak S05.
- **Batas:** tidak ada episode penuh, commit, push, atau publikasi.

## D-040

**Episode 2: pilot S03–S06 v1 dirender dengan VO pemilik; kamera S06 menghadap utara (usulan)**

- **Tanggal:** 2026-11-18
- **Status:** **approved (pemilik, 2026-11-18)**: kamera S06 menghadap utara, pan S03 4,2°, adik di x −0,62 dengan pegangan kusen setinggi pinggang. (Semula pending, usulan Claude atas pilot v1.)
- **Diputuskan oleh:** belum. Dasar: permintaan pemilik 2026-11-18 (S06 harus terbaca menunjuk ke kaca dan kaca terlihat di bingkai; S03 adik memegang kusen timur; durasi tidak dipangkas).
- **Usulan:**
  1. Kamera S06 dipindah ke ruang tamu, menghadap utara (−1,45; 1,05; 1,2), menggantikan kamera D-038 butir 3 (dapur, menghadap selatan). Alasannya, dari kamera D-038 kaca berada di belakang lensa. Akibatnya wajah adik tidak terlihat di S06.
  2. Arah tunjuk memakai trik kamera: garis lengan di layar menuju kaca, sedangkan di 3D lengan menunjuk 19° di atas kaca. Desain tangan oval tidak diubah.
  3. Kamera S03 dipan 4,2° ke timur agar tangan adik di kusen masuk bingkai. Posisi kamera dan lensa 40° (D-039 butir 2) tidak berubah.
  4. Adik berdiri di x −0,62 (sebelumnya −0,5) agar jaket tidak menembus dinding saat tangan memegang kusen.
- **Fakta:** durasi pilot dari audio asli 20,91 s (S03 9,28 · S04 3,56 · S05 3,94 · S06 4,13). File final −14,1 LUFS, true peak −1,0 dBTP. Opsi VO A/B tidak diketahui.
- **Batas:** tidak ada episode penuh, commit, push, atau publikasi.

## D-041

**Episode 2: pilot S03–S06 v2. Insert kaca S03, kilas balik S06, SFX baru dari pemilik, material kaca `lit2` (usulan)**

- **Tanggal:** 2026-11-18
- **Status:** **sebagian approved (pemilik, 2026-11-18, tinjauan v2):** material kaca `lit2` **disetujui**; kilas balik **opsi A disetujui** (dengan perbaikan insert di v3); tambahan **+0,55 s sebelum toa ditolak**. Pilihan variasi SFX: belum (baris pemilik masih templat). Lanjutan: [[DECISION-LOG#D-042]].
- **Diputuskan oleh:** arahan pemilik 2026-11-18 (catatan atas pilot v1). Opsi dan angka di bawah ini usulan Claude.
- **Arahan pemilik (tetap):**
  - naskah tidak berubah;
  - cahaya kaca hanya dari senter Uq;
  - D-040 belum diputuskan, jadi v2 memakai nilai pilot v1 sebagai sementara;
  - gumam warga tidak dipakai sebelum disetujui;
  - tidak ada episode penuh, commit, atau push.
- **Usulan / hasil:**
  1. **Insert S03** (1,07 s) di dalam S03, tanpa tambahan durasi. Tahan sorot di kaca 0,36 → 0,72 s, dari pecahan sapuan yang diubah.
  2. **S06 opsi A:** S06 lebar → kilas balik insert pada "tadi terang" (0,80 s, saturasi 0,55, vinyet, lonjakan terang 3 frame) → kaca sekarang gelap dari lensa yang sama sampai akhir. Opsi B/C dicatat di content.md §11 dan QC v2 §5.
  3. **Material kaca `lit2`** (hanya v2): albedo lebih hangat, cahaya dingin 0,5 → 0,2. Dengan material lama, kaca yang kena senter tampak ungu pucat dan bisa terbaca sebagai cahaya dari luar. Ini perubahan tampilan yang perlu persetujuan.
  4. **Celah sebelum toa +0,55 s** (pembuka toa 0,9 s). Total 20,915 → 21,465 s. Alternatif tanpa tambahan durasi dicatat.
  5. **Gerendel di gambar dan SFX** mendarat pada "Klik" yang terdengar (puncak N03, 10,115 s), bukan pada awal deteksi suara (9,977 s).
  6. **SFX:** variasi sementara dari pengukuran sinyal, diatur lewat `scripts/ep003_pilot_sfx.json` (malam #3, langkah #2, gerendel #3, ketukan #1, toa #4). Pemilik perlu mendengar. Klik senter mati dihapus (arahan "hanya saat senter menyala").
  7. **Master:** −14,2 LUFS, true peak −2,3 dBTP. Syarat ≤ −1,5 dBTP diukur pada AAC final.
- **Temuan:** P4 gagal. Kaki meluncur 7,7–12,0 cm pada 8,30–8,48 s (campuran kaki dari v1). Belum diperbaiki.
- **Rincian:** [[04-PRODUCTION/2026-11-003/content|content.md]] §11, `_media/2026-11-003/out/pilot_v2/QC_pilot_v2.md`, [[sfx-pustaka]].
- **Batas:** tidak ada episode penuh, commit, push, atau publikasi.

## D-042

**Episode 2: pilot S03–S06 v3. Langkah terangkat, S05 pada bunyi toa menyala, insert kaca lebih lebar, bed untuk ponsel, de-plosive adik**

- **Tanggal:** 2026-11-18
- **Status:** **approved (pemilik, 2026-11-18)**. Pilot v3 disetujui sebagai **patokan kualitas** untuk episode penuh.
- **Keputusan pemilik atas v3:**
  1. Pilot v3 disetujui.
  2. Sentakan Uq dan senter mati pada **bunyi toa menyala** disetujui. Ini menggantikan "di awal kalimat toa" di [[DECISION-LOG#D-039]] butir 3.
  3. Variasi SFX ditetapkan: suasana malam #3, langkah #2, gerendel #3, ketukan layar #1, pembuka toa #4.
  4. Tugas berikutnya: episode penuh S01–S12, dikerjakan bertahap (draft render; `approved-by-owner` tetap `false`).
- **Diputuskan oleh:** arahan pemilik 2026-11-18 (tinjauan v2). Cara pelaksanaan diusulkan Claude.
- **Hasil:**
  1. **Kaki (P4) lulus.** Penyebab sebenarnya: akar tubuh melompat 31 cm ke belakang di 8,23 s (jalan pertama berhenti di z −4,124, langkah kedua mulai dari −3,8), ditambah campuran pergelangan kaki 0,25 s. Ini diganti tiga langkah terangkat. Geser kaki saat menapak ≤ 0,01 cm; langkah akar tubuh maks 3,5 cm/frame.
  2. **S05:** celah L7 → napas P01 kembali 0,65 s (total 20,915 s = v1). Pembuka toa di atas ekor N03 (mulai 12,489 s). S05 dipotong masuk pada bunyi itu. Uq tersentak, mematikan senter, dan berputar pada bunyi itu, sehingga wajah terbaca ± 1,0 s sebelum "Dapur". **Ini memindahkan "senter mati saat tersentak di awal kalimat toa" (D-039) ke bunyi toa menyala, dan perlu konfirmasi pemilik.**
  3. **Insert kaca lebih lebar:** daun pintu, kusen atas, dan kaca dalam satu bingkai; kaca 10,7 % luas bingkai. Sorot terlihat naik masuk ke kaca. Insert 1,4 s. Kilas balik diambil dari footage insert yang sama, mulai 0,3 s sebelum sorot mencapai kaca.
  4. **Bed suasana malam:** high shelf +8 dB @2 kHz, dan level diatur di pita ≥ 300 Hz (VO − 22 dB). Di pita ponsel naik ± 2 dB.
  5. **De-plosive:** HPF 90 Hz hanya pada segmen adik. Patokan level SFX = RMS VO + 23,2 dB.
- **Koreksi atas laporan v2:** angka limiter 14,6 dB pada plosif adik salah ukur (latensi limiter tidak dihapus). Angka sebenarnya ≤ 2 dB; maksimum 5,2 dB di "Klik".
- **Belum:** pilihan SFX setelah didengar. Baris pemilik masih berupa templat, jadi variasi v2 tetap dipakai. S04 (lengan, tepi kepala) dicatat tanpa diperbaiki.
- **Rincian:** [[04-PRODUCTION/2026-11-003/content|content.md]] §12, `_media/2026-11-003/out/pilot_v3/QC_pilot_v3.md`.
- **Batas:** tidak ada episode penuh, commit, push, atau publikasi.

## D-043

**Episode 2: episode penuh S01–S12, draft render v1**

- **Tanggal:** 2026-11-18
- **Status:** draft v1 **ditinjau pemilik 2026-11-18**; usulan (a)–(d) diputuskan (lihat bawah). Draft berikutnya: v2. `approved-by-owner` tetap `false`.
- **Diputuskan oleh:** arahan pemilik 2026-11-18 (episode penuh bertahap, pilot v3 sebagai patokan). Pelaksanaan diusulkan Claude.
- **Keputusan pemilik atas draft v1 (2026-11-18):**
  1. Perpindahan adik di luar layar selama S10: **disetujui**.
  2. Tiga ketukan sebelum narasi: **disetujui, tetapi dirapatkan**. Ketukan pertama langsung menyusul D04 ("Itu Pak satpam, kan?"), seolah memotong sebelum Uq menjawab, lalu N07. S10 harus jauh lebih pendek dari 7,9 s (potong ke S11 di "Dari pintu belakang" dan/atau gerak kamera kecil).
  3. Lompatan posisi S01 → S02: **disetujui**.
  4. S12, Uq menunduk ke arah adik: **disetujui**.
  5. **Perubahan baru:**
     - (A) recap pilihan Ep 1 di awal: freeze frame akhir Ep 1, dua kartu Ep 1 persis, kartu "tetap di dalam" diklik (bunyi klik UI, membesar ± 1,1×, tanda terpilih halus), kedua kartu fade out bersamaan, lalu S01 bergerak; N01 mulai sesudah kartu hilang; label "HARI 1 / EPISODE 2" diatur ulang agar tidak bertabrakan;
     - (B) kartu akhir memakai **gaya kartu Ep 1** (dua kartu berdampingan di atas, tanpa label A/B, tanpa judul) dengan teks "intip pintu depan" dan "tetap diam bersama adik", plus dua dentuman bass ("doom… dooom") saat kartu muncul;
     - (C) storyboard dan spesifikasi kartu di content.md diperbarui. **Ini mengubah spesifikasi kartu yang sebelumnya disetujui (D-036, content.md §2.2), atas permintaan pemilik.** Teks dialog/narasi tidak berubah.
- **Draft v2 (2026-11-18, pending tinjauan pemilik):** `_media/2026-11-003/out/episode_draft_v2/`, 68,20 s, −14,1 LUFS, −1,8 dBTP.
  - Recap 2,10 s; label sesudah kartu hilang.
  - Kartu akhir gaya Ep 1; kotak identik sampai piksel; teks baru muat 2 baris.
  - Dentuman = kick-boom sfx-19, lalu kick-boom + Sub Drop 2, keduanya disaturasi.
  - S10 5,77 s.
  - Klik UI `1 Click Mouse` (sementara).
  - Ekor hitam 0,4 s tetap (naskah).
  - Rincian: content.md §14, QC v2.
- **Isi:**
  1. 67,17 s, −14,2 LUFS, true peak −2,3 dBTP. S03–S06 = pilot v3 tanpa perubahan (offset 306 frame; dump stage selisih 0; selisih piksel 0,1–0,6/255).
  2. S01/S12 memakai posisi dan lensa A17 Ep 1. Label "HARI 1 / EPISODE 2" memakai pil Ep 1 dalam dua baris. Kartu vertikal dengan judul berada di y 170–494 px.
  3. S08: getar #2 dua kali, lalu UI pesan pola A07 Ep 1 (L14 tidak ditampilkan dua kali di subtitle). S10: tepat tiga ketukan (#3, grain berjarak 0,9 s) dalam jeda sendiri sesudah L15.
  4. **Usulan yang perlu konfirmasi:**
     - (a) adik dipindahkan di luar layar selama S10, dari kanan Uq (barat, saat menghadap selatan) ke kanan-belakangnya (timur, saat menghadap utara), agar genggaman S11 kanan Uq ↔ kiri adik mungkin;
     - (b) elips posisi S01 → S02;
     - (c) penempatan ketukan sebelum N07 (± 2,4 s lebih panjang daripada ketukan di bawah narasi);
     - (d) S12 klausa B: Uq hanya bisa menunduk ke sisi adik (68°), karena adik berada di belakang bahu kanannya di susunan A17. Menatap penuh membutuhkan perubahan pose kontinuitas Ep 1.
  5. Akhir: 0,4 s hitam sesuai naskah ("potong ke hitam"); Ep 1 tidak memakai ini.
- **Gerbang VO:** 13/13 lengkap. D03/D04 berbeda isi dan tidak tertukar (OBSERVATION dari sinyal).
- **Rincian:** [[04-PRODUCTION/2026-11-003/content|content.md]] §13, `_media/2026-11-003/out/episode_draft_v1/QC_episode_draft_v1.md`.
- **Batas:** tidak ada commit, push, atau publikasi. Naskah tidak berubah.

## D-044

**Episode 2: keputusan atas draft v2 dan render final v1**

- **Tanggal:** 2026-11-18
- **Status:** keputusan pemilik **approved**. File final v1 = **pending** persetujuan pemilik (`approved-by-owner` tetap `false`).
- **Diputuskan oleh:** pemilik, atas draft v2 ([[DECISION-LOG#D-043]]).
- **Keputusan:**
  1. Bunyi klik recap: `1 Click Mouse.mp3` tetap. Baris pemilik masih memuat templat pilihan, tetapi diawali "Tetap 1 click mouse"; dibaca sebagai "tetap", perlu konfirmasi.
  2. Ekor hitam 0,4 s **dihapus**, supaya konsisten dengan Ep 1. Ini menggantikan "lalu potong ke hitam" di arahan visual naskah; teks narasi tidak berubah.
  3. Freeze recap yang sedikit lebih gelap: **diterima**.
  4. "KAN?" yang terpotong ketukan: **diterima**.
  5. **Dua dentuman bass dipindah** ke sesudah narator selesai membaca L19 (termasuk kedua pilihan), tanpa menumpuk dengan narasi. Waktu kartu tetap (saat L19 mulai). Dentuman kedua tetap ± 0,7 s sesudah yang pertama dan lebih panjang. Ekornya tidak boleh terpotong oleh akhir video; lama kartu bertahan boleh diperpanjang.
  6. Render final disimpan sebagai `_media/2026-11-003/out/episode_2026-11-003_final_v1.mp4`. Persiapan publikasi (Stage 9) ditulis di content.md.
- **Batas:** tidak ada commit, push, upload, atau publikasi.
- **Hasil (2026-11-18):** `_media/2026-11-003/out/episode_2026-11-003_final_v1.mp4`.
  - 69,43 s (2 083 frame), −14,1 LUFS, true peak −1,8 dBTP.
  - Dentuman 1 di L19 berakhir + 0,25 s; dentuman 2 0,7 s kemudian. Stem VO hening sejak 0,05 s sebelum dentuman 1. Ekor dentuman habis sebelum akhir video.
  - Durasi bertambah 1,25 s dibanding draft v2.
  - Persiapan publikasi di content.md §15. Aturan label AI terbaru: UNKNOWN (belum dicek ulang).
  - Lisensi VO: arahan pemilik "Pro diasumsikan" berbeda dari cek API 2026-11-18 (akun `free`); perlu konfirmasi pemilik.

## D-045

**Arah seri "rumah nomor tujuh" sampai Episode 5, dan Episode 3 draft**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved** (arah seri dan kerangka Ep 3). Naskah Ep 3 v0.1 = **pending** tinjauan pemilik. Cabang Ep 3 belum dipilih.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20).
- **Keputusan:**
  1. Cerita "rumah nomor tujuh" **selesai di Episode 5**.
  2. **Arah cerita:** rumah dan kompleks ternyata diawasi dan dijadikan tontonan. Warga tahu; Uq dan adik tidak. Satpam adalah orang dalam yang mencoba memperingatkan. Twist meta: narator dan toa adalah suara yang sama, dan pilihan "kamu" adalah pilihan penonton sungguhan.
     - Inspirasi gaya: film bertema hidup yang dijadikan tontonan. **Tidak boleh menyebut nama film apa pun** di naskah, judul, caption, atau dialog. Eksekusi harus orisinal (CLAUDE.md §11).
  3. Cabang A/B di Ep 3 dan Ep 4 **menyatu kembali di tengah episode** (pembuka berbeda, tengah dan akhir sama).
  4. **Ep 5:** akhir tertutup, **tanpa kartu pilihan**. Penutup: Uq masuk ruang pengeras suara memakai kunci dari satpam dan berbicara dengan suaranya sendiri.
  5. **Lengkung kasar:**
     - Ep 3 "Ada yang Menonton": pesan satpam pertama asli, "buka pintunya" palsu; kamera ditemukan.
     - Ep 4: warga menunggu seperti menunggu adegan; toa mengetahui hal yang hanya diketahui penonton; satpam menunjukkan jalan keluar; pilihan terakhir.
     - Ep 5: Uq merebut kembali suaranya; akhir tertutup.
  6. **Prinsip hook baru (HYPOTHESIS, dari data retention Ep 1 hari pertama):** kejadian di 0–3 s; premis satu kalimat untuk penonton baru di 3–10 s; recap kartu sebagai overlay singkat **tanpa freeze** di awal. Dasar data: [[05-DATA/analytics/2026-11-002/2026-11-20-pemetaan-retention-0-12s]] (penurunan terbesar di 2–4 s pada A01 tanpa kejadian; bercampur efek putar ulang).
  7. Content Unit Ep 3 = [[04-PRODUCTION/2026-11-004/content|2026-11-004]], naskah draft v0.1 untuk kedua cabang. Tidak ada storyboard, look-dev, audio, atau render.
- **Pertanyaan terbuka (tidak diputuskan di sini):**
  - Twist "pilihan kamu = pilihan penonton sungguhan" bersinggungan dengan D-035 butir 4 dan [[02-CHANNELS/lab/CHANNEL-DNA|CHANNEL-DNA]] §2 dan §5 ("komentar = masukan, bukan voting yang mengikat; cabang dipilih pemilik"; "hindari janji bahwa komentar menentukan kelanjutan, kecuali pemilik memilih mekanisme itu"). Pemilik perlu memutuskan apakah twist ini tetap fiksi di dalam cerita, atau mekanisme pemilihan cabang ikut diubah. CHANNEL-DNA **tidak diubah**.
  - Konflik kontinuitas Ep 3 terhadap Ep 1–2: content.md 2026-11-004 §4.
- **Batas:** tidak ada perubahan pada Ep 1–2, commit, push, atau publikasi.
- **Catatan:** tabel ringkas di atas berhenti di D-037 (D-038–D-044 hanya ada sebagai bagian). Baris D-045 ditambahkan; celahnya tidak diisi di sesi ini.

## D-046

**Episode 3: cabang B, keputusan atas konflik v0.1, dan kebijakan suara penonton**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved**. Naskah Ep 3 draft v0.2 = **pending** tinjauan pemilik. Ambang "terlalu sedikit" = **usulan, pending** persetujuan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20), atas naskah v0.1 dan hasil suara komentar Ep 2.
- **Keputusan:**
  1. **Cabang Ep 3 = B "tetap diam bersama adik"**, mengikuti suara terbanyak komentar YouTube Ep 2 (KIRI/A 2, KANAN/B 5, ambigu 2; 20 akun; snapshot 2026-11-19 18:39 UTC = 2026-11-20 01:39 WIB; [[05-DATA/analytics/2026-11-003/suara-ab_20261119T1839Z]]). Naskah cabang A diarsipkan di content.md 2026-11-004 §9, tidak dihapus.
  2. **Percobaan membuka pintu (K1):** kenop bulat pintu belakang berputar pelan dari luar, tertahan karena terkunci, lalu kembali. Suara: putaran kenop + gerendel berderak sekali karena pintu sedikit didorong.
  3. **Kamera (K2):** sudah terpasang tersembunyi sejak awal. LED-nya baru dinyalakan sekarang, satu per satu, oleh pihak yang mengawasi (mereka sengaja ingin ketahuan). Tidak bertentangan dengan Ep 1–2.
  4. **Pesan petugas (K3):**
     - pesan asli Ep 3 dari **nomor baru tidak dikenal**: "Ini petugas keamanan. HP saya diambil. Pesan tadi bukan dari saya." (menjelaskan pesan palsu Ep 2 dari chat petugas);
     - narator **tidak** memastikan pesan asli: "Nomornya berbeda. Kamu tidak tahu harus percaya yang mana." menggantikan "Pesan pertama itu asli…";
     - "Mereka bisa lihat semua ruangan. Kecuali satu." dari nomor baru yang sama, **sesudah** kamera terungkap.
  5. **Label "HARI 1 / EPISODE 3"** seperti biasa (0,25–4,9 s), tidak menutupi close-up kenop. Penempatan usulan: content.md 2026-11-004 §2.2 (recap digeser ke ± 5,0–6,5 s karena kartu recap menimpa label).
  6. **Beat penemuan titik merah ± 10 s** (dari 15 s). Target total ± 65–70 s.
  7. **Kebijakan pilihan (memperbarui [[DECISION-LOG#D-035]] butir 4 dan CHANNEL-DNA §2/§5):** untuk **seri interaktif di channel ini**, cabang mengikuti **suara terbanyak komentar penonton**. Bila suara **seri** atau **terlalu sedikit** untuk dihitung, pemilik memutuskan. Konteks di dalam cerita (twist meta D-045: pilihan "kamu" = pilihan penonton) dan aturan channel ini kini **selaras**. Untuk seri atau konteks lain, CHANNEL-DNA berlaku seperti biasa. Ini menjawab pertanyaan terbuka D-045.
  8. **Ruangan tanpa kamera untuk Ep 4 = kamar mandi** (usulan, final saat Ep 4). Denah belum punya kamar mandi; tiga petak tertutup tanpa pintu tersedia (content.md 2026-11-004 §4.1).
  9. **Polesan diterima:** "derak berhenti"; narasi "pesan itu". Kartu: KIRI "balas pesan itu", KANAN "tutup kameranya". Dua dentuman bass Ep 2 diganti `refrences/SFX/Two_deep_cinematic_Doom.wav`.
- **Usulan ambang "terlalu sedikit" (menunggu persetujuan pemilik):**
  - **Sumber dan waktu:** komentar YouTube lewat API (read-only), snapshot tetap saat naskah episode berikutnya mulai ditulis, paling cepat 24 jam sesudah tayang. Komentar Instagram/TikTok hanya bila pemilik menyerahkan tangkapan layar; dihitung per platform lalu dijumlahkan (akun lintas platform tidak bisa dicocokkan).
  - **Cara hitung:** satu akun satu suara; ambigu dipisah dan tidak dihitung (`scripts/analytics/count_votes.py` + tinjauan manual).
  - **Sah bila:** **≥ 10 suara jelas** dan pemenang unggul **≥ 2 suara**. Selain itu: seri/terlalu sedikit → pemilik memutuskan. **[Tidak dipakai. Pemilik menetapkan ≥ 5 suara jelas dan unggul ≥ 2: [[DECISION-LOG#D-047]] butir 2.]**
  - **Catatan jujur:** Ep 2 hanya 7 suara jelas. Dengan ambang ini, Ep 2 termasuk "terlalu sedikit" dan keputusan jatuh ke pemilik; pilihan pemilik (B) sama dengan mayoritas, jadi hasilnya tidak berubah. Alternatif yang lebih longgar: ≥ 5 suara jelas. Dengan ambang itu, Ep 2 dihitung sah.
- **Konsekuensi:** CHANNEL-DNA lab v0.5 (§2, §5). Naskah Ep 3 v0.2 cabang B dan paket VO 9 segmen (content.md 2026-11-004 §2, §7).
- **Batas:** tidak ada storyboard, look-dev, audio, render, commit, atau push. Ep 1–2 tidak diubah.

## D-047

**Episode 3: naskah v1.0 dikunci, ambang suara, status Episode 2, kamar mandi, dentuman cadangan**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved**. Storyboard Ep 3 v0.1 dan titik kamera LED (hasil cek Ep 1–2) = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20).
- **Keputusan:**
  1. **Naskah Ep 3 draft v0.2 disetujui sebagai v1.0.** Teks (L1–L11, kartu) dikunci. Arahan `[VISUAL]` boleh disesuaikan storyboard tanpa mengubah teks yang diucapkan.
  2. **Ambang suara (menggantikan usulan D-046):** hasil komentar sah bila ada **minimal 5 suara jelas DAN pemenang unggul minimal 2 suara**. Kurang dari itu (termasuk seri), pemilik memutuskan. Cara hitung tetap seperti D-046 (satu akun satu suara, ambigu dipisah, snapshot ≥ 24 jam sesudah tayang). Dengan ambang ini, suara Ep 2 (B 5, A 2) **sah**. CHANNEL-DNA v0.6 §5.
  3. **Status Ep 2 (2026-11-003) dirapikan:** `published`; `approved-by-owner: true` (pemilik menyetujui video final sebelum tayang); URL YouTube Shorts dari daftar unggahan API (read-only, 2026-11-20): `N5rrQ6IRqQk`, public, terbit 2026-11-18T14:33:40Z, judul "Suara di Toa Itu Tahu Kami di Dapur | Episode 2 #shorts". Instagram dan TikTok: UNKNOWN.
  4. **Kamar mandi:** diputuskan saat Ep 4. **Kandidat utama: pintu di dinding timur dapur** (x 1,0, ke petak x 1–4, z −5…−1). Catatan cek 2026-11-20: dinding itu terlihat di latar Ep 2 S04 (21,4–24,6 s); posisi pintu harus dicek terhadap bingkai itu saat Ep 4 (content.md 2026-11-004 §10.5).
  5. **Dentuman akhir:** pemilik mendengarkan `Two_deep_cinematic_Doom.wav`. Bila tidak cocok, kembali ke kombinasi Ep 2: `sfx-19_kick-boom_low_impact.wav` + saturasi, ditumpuk `Sub Drop 2.mp3` (D-044).
- **Hasil kerja sesudah keputusan (pending tinjauan):** cek badan kamera di frame Ep 1–2 dan storyboard Ep 3 v0.1 (content.md 2026-11-004 §10–§11).
- **Batas:** tidak ada look-dev, audio, render, commit, atau push. Ep 1–2 tidak diubah, kecuali frontmatter + baris status content.md 2026-11-003 (butir 3, atas perintah pemilik).


## D-048

**Episode 3: keputusan atas storyboard v0.1 → v0.2, dan look-dev aset baru**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved**. Look-dev v1 = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20), atas content.md 2026-11-004 §14.
- **Keputusan:**
  1. Titik LED tamu (sudut langit-langit tenggara), dapur (plafon sisi timur), kamar (dinding timur di atas kepala ranjang): **disetujui**.
  2. Lorong: **opsi A**, kamera rata-plafon sewarna plafon.
  3. Mundur ± 1 m di S10: **disetujui**.
  4. S01: kenop close di tengah (Ø ± 360 px); gerendel hanya terdengar; jarak akhir dipilih di look-dev.
  5. Penanda putar: **slot kecil** di muka kenop dalam.
  6. 0–3 s: kenop 0–2,1 s, lalu potong ke S02.
  7. Tangan di mulut: uji usulan utama dengan angka; **bila gagal, langsung pakai cadangan** (adik menutup mulut sendiri dengan tangan kiri, Uq memegang bahunya) tanpa menunggu pemilik.
     - **Hasil:** usulan utama **gagal** (lintasan masuk torso Uq dan menembus adik); **cadangan dipakai**, dengan adik 0,25 m lebih jauh dari Uq (content.md §11.8).
  8. Pilot: Blok A (0–6,8 s) + Blok B (27,4–35,0 s).
  9. Durasi ± 63,9 s diterima sementara; final mengikuti VO.
  10. Meta: pada "…menutup kamera di depanmu?", Uq menatap lensa **sekali, ± 1 s**, lalu kartu muncul. Tidak diulang di tempat lain.
  11. Kamar mandi Ep 4: pintu di luar bagian dinding timur dapur yang tampil di Ep 2 S04.
  12. VO: L8 dipecah N04a/b/c (teks sama, hanya dipecah).
- **Hasil kerja (pending tinjauan):** look-dev v1, 15 still + 3 contact sheet (`_media/2026-11-004/out/lookdev_v1/`); QC di content.md §15.
- **Batas:** tidak ada pilot, audio, render video, commit, atau push. Kode Ep 1–2 dan `sets.tsx` tidak diubah.

## D-049

**Episode 3: keputusan atas look-dev v1 (storyboard v0.3) dan pilot dua blok**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved**. Pilot v1 = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20), atas content.md 2026-11-004 §15.3.
- **Keputusan:**
  1. Slot kenop **diterima**, dibuat lebih tipis dan pendek. Beda kecil dengan Ep 2 S04 diterima.
  2. Titik kecil kamera lorong di Ep 2 S06 **diterima**. Garis tinta pada objek itu dicoba dihilangkan; kalau gagal, dibiarkan. **Opsi B ditolak.**
  3. Adik 0,25 m lebih jauh di S02 (jarak akar 0,64 m) **disetujui**.
  4. S01: kenop 0,6 m, cahaya kaca dinaikkan (tetap bersumber) sampai kenop dan slot terbaca di layar kecil; target piksel gelap ≤ 85 %.
  5. Pendar LED: 30 px untuk lorong, dapur, kamar; 22 px untuk ruang tamu. POV lorong memakai fov 32.
  6. Pantulan layar di lensa kamera **diterima** tanpa dikuatkan.
  7. Desain kamera tersembunyi (kotak gelap 5 × 4 × 4 cm, lensa + LED) **disetujui**.
  8. Setiap LED menyala disertai bunyi kecil halus, disinkronkan ke frame LED menyala (kandidat `sfx-14_click_tiny_noise.wav`).
  9. **Wajib sebelum pilot:** pendar LED memperhitungkan benda yang menutupinya.
  10. Pilot dua blok (A 0–6,8 s, B 27,4–35,0 s), timing mengikuti audio asli, hanya bila VO N01 dan D01 + SFX kenop dan napas sudah ada (sudah ada).
- **Pelaksanaan (Claude, dilaporkan di content.md §16):**
  - butir 1: slot 16 × 3 mm (dari 22 × 4,5 mm);
  - butir 2: tinta hilang (`userData.outline = false`);
  - butir 4: kaca ×6 = 81 % piksel gelap;
  - butir 8: `sfx-14` **tidak bisa didekode** (WAV berisi Vorbis, tag 0x674F), diganti klik sintesis Ep 1 `switch_click.wav` yang di-highpass;
  - butir 9: gerbang oklusi `studio/src/ep004/occlusion004.ts`, 5 kasus wajib-terhalang lulus.
  - Usulan storyboard v0.3: Blok B dibuka insert POV 1,0 s (S08a) agar LED-1 menyala **di kamera bersama kliknya**. Teks tidak berubah.
- **Batas:** tidak ada render episode penuh, perubahan teks naskah, perubahan Ep 1–2, commit, atau push.

## D-050

**Episode 3: pilot v2 — kartu recap dan lima perbaikan pilot v1**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved**. Bagian kartu **tertahan** (bentrok, lihat bawah), dengan 2 opsi menunggu pemilik. Pilot v2 = **pending** tinjauan.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20), sesudah menonton pilot v1.
- **Keputusan pemilik:**
  - A. Kartu recap muncul di **T + 0,5 s** dan diklik di **T + 1,0 s**. T = akhir audio kata "memakai suaramu." Gaya kartu Ep 1, overlay tanpa freeze, hook 0–3 s tetap. Bila bentrok dengan VO, L3, atau potongan 6,8 s: jangan geser diam-diam; laporkan dan beri 2 opsi.
  - B5. S08: adik hanya mendongak sambil berbisik, tanpa lengan menunjuk (opsi b). S08a dipertahankan.
  - B6. S09 dipendekkan 3,4 → ± 2,4 s.
  - B7. Telapak adik di S02 digeser 1–2 cm agar menutup mulut.
  - B8. LED tamu menyala pada frame yang sama dengan bunyi kliknya.
  - B9. `sfx-14` tidak dipakai; `switch_click.wav` tetap.
- **Usulan Claude (BELUM disetujui):** setelah klik, kartu bertahan **1,0 s** sebelum mulai hilang. Durasi v1 0,75 s, kurang dari batas 1,0 s.
- **Hasil:**
  - T = **6,650 s** (frame 199,5; ambang −45 dBFS; caption "SUARAMU." menyala sampai 6,703 s).
  - Jadwal baru: muncul 7,150 s, klik 7,650 s, mulai hilang ≥ 8,650 s, habis ± 9,0 s. Seluruhnya **sesudah potongan S02 → S03 di 6,8 s** dan **di atas L3 (6,896–9,896 s)**. Timing kartu tidak diubah; kartu di pilot v2 tetap timing v1.
  - Dua opsi untuk pemilik ada di content.md 2026-11-004 §17.2.
  - B5–B9 diterapkan (§17.3).
- **Batas:** naskah, VO, C1, dan kode Ep 1–2 tidak diubah; tanpa render episode penuh, commit, atau push.

## D-051

**Episode 3: pilot v3 — kartu recap sesudah T (Opsi 2), S02, S08a**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved**. Dua usulan Claude **pending**. Pilot v3 = **pending** tinjauan.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20), atas content.md 2026-11-004 §17.2.
- **KEPUTUSAN PEMILIK:**
  1. **Opsi 2:** L3 dan potongan S02 → S03 (dan semua shot, VO, SFX sesudahnya) mundur sejauh perlu, agar L3 mulai ≥ 0,1 s sesudah kartu habis. Teks dan file VO tidak diedit, hanya posisinya.
  2. Kartu kiri muncul di **T + 0,5 s** (T = 6,650 s, akhir audio "memakai suaramu."). Kartu kanan menyusul dengan jeda yang sama (0,2 s). Gaya kartu Ep 1, overlay tanpa freeze, kejadian 0–3 s tetap.
  3. S02: telapak adik boleh digeser **sampai 4,5 cm** atau diubah orientasinya, agar mulut tertutup, tanpa memburukkan angka QC v2.
  4. S08a: insert LED **1,0 → 1,5 s**; LED terlihat menyala ≥ 1,0 s; klik tetap pada frame bunyinya.
  5. S01 dan S09 (2,4 s) tidak diubah.
- **USULAN CLAUDE (belum disetujui):**
  - klik kartu **0,5 s sesudah kartu KANAN muncul** (7,85 s), bukan sesudah kartu kiri;
  - kartu **bertahan 1,0 s sesudah klik** (sudah diusulkan di D-050).
- **Hasil:**
  - Kartu: muncul 7,150 s, kanan 7,350 s, klik 7,850 s, mulai hilang 8,850 s, habis 9,200 s.
  - **Pergeseran = 2,414 s.** L3 6,896 → 9,310 s, 0,11 s sesudah kartu habis. Potongan S02 → S03 di frame 276 = 9,200 s.
  - N01 ditempatkan dua kali dari file yang sama: dipotong di 3,78 s dalam file, di dalam jeda diam antara L2 dan L3, tanpa crossfade dan dengan gain yang sama.
  - S02 diperpanjang 6,8 → 9,2 s dengan gerak halus: napas di kepala, pandangan bergeser, kedipan, dorongan kamera, langkah di gang, dan embusan napas kedua yang lebih pelan. Lengan dan badan tidak bergerak.
  - S08a 1,5 s: LED terlihat 1,0 s. Semua isi Blok B sesudah S08a (D01, layar, S08, S09) +0,5 s.
  - S02 telapak: 4,5 cm. Sisa ± 5 px ujung garis mulut masih tampak; opsinya di content.md §18.
- **Konsekuensi:**
  - **Premis L3 selesai di 12,31 s**, di luar jendela 3–10 s. Jendela itu masih **HYPOTHESIS** dari retention Ep 1 hari pertama (D-045 butir 6).
  - Estimasi episode penuh **± 65,8 s** (masuk target 65–70 s).
  - Limiter master bekerja lebih keras karena jeda tanpa narasi menurunkan loudness terintegrasi.
- **Batas:** naskah, VO, C1, kode Ep 1–2 tidak diubah; tanpa render episode penuh, commit, atau push.

## D-052

**Episode 3: pilot v3 dikunci, pemeriksaan VO, rencana episode dari durasi VO asli**

- **Tanggal:** 2026-11-20
- **Status:** keputusan pemilik **approved** untuk pilot v3. Rencana episode penuh = **draft, menunggu** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-20), sesudah menonton pilot v3.
- **KEPUTUSAN PEMILIK:**
  1. Pilot v3 (`_media/2026-11-004/out/pilot_v3/pilot_2026-11-004_v3.mp4`) **cukup, tanpa perubahan**.
  2. **Jadwal kartu recap = keputusan pemilik** ("sangat pas"): kartu kiri 7,150 s, kanan 7,350 s, **klik 7,850 s**, **tahan 1,0 s sesudah klik**, mulai hilang 8,850 s, habis 9,200 s. Klik 7,850 s dan tahan 1,0 s naik dari usulan (D-051) menjadi keputusan.
  3. Dua sisa masalah **diterima apa adanya**: ujung garis mulut adik di S02 (± 5 px) tidak diubah; level bisikan adik tidak diturunkan.
- **Status:** yang lolos hanya **gerbang pilot**. `status: scripted`, `approved-by-owner: false`. Tidak ada `approved` atau `published`.
- **Hasil kerja Claude (draft, pending tinjauan; content.md 2026-11-004 §19):**
  - VO: 11 file lengkap (N01, P01, N02, N03, D01, N04a, N04b, N04c, P02, N05, N06); N04 satu take **diarsipkan** (tidak dihapus). 12 hash berbeda; P01 dan N06 berukuran sama tetapi isinya berbeda (kebetulan jumlah frame MP3 sama). Tidak ada clipping. **Isi suara belum diverifikasi** (tidak ada alat transkripsi; perlu didengar pemilik).
  - Teks gabungan N04a+b+c identik dengan L8 naskah v1.0 (di dokumen); N04 lama → baru: file +0,940 s, ucapan +0,935 s.
  - Rencana episode dari durasi sampel asli: **68,35 s** (perkiraan lama 65,81 s; selisih +2,54 s dari ucapan yang lebih panjang). Premis L3 selesai 12,31 s (HYPOTHESIS jendela 3–10 s tidak diubah). Kartu akhir 64,95 s, Doom 65,10 s.
  - Pra-cek mix: limiter di bisikan adik 5,7 dB (pilot 8,9 dB); maks seluruh episode 8,4 dB di awal L5; true peak −1,9 dBTP.
- **Batas:** naskah, VO, C1, `npc.tsx`, dan kode Ep 1–2 tidak diubah; tidak ada file dihapus; tanpa render, commit, atau push.


## D-053

**Episode 3, tahap 1 episode penuh: uji empat gerak baru (mundur, berbalik, genggam ulang, tatap lensa)**

- **Tanggal:** 2026-11-20
- **Status:** hasil uji Claude = **draft, menunggu keputusan pemilik** untuk dua gerak yang gagal (mundur, genggam) dan dua penyesuaian pementasan (berbalik, genggam).
- **KEPUTUSAN PEMILIK (arahan tertulis 2026-11-20, sebelum uji):**
  1. Rencana waktu 68,35 s (`studio/src/ep004/episode004-plan-draft.json`, content.md §19.3) **disetujui**, dengan N04a/b/c.
  2. Keputusan pilot v3 (D-051, D-052) berlaku untuk S01, S02, S08a, S08, S09; shot itu tidak diubah.
  3. Tahap 1 = uji terpisah empat gerak dalam klip pendek. Belum membangun shot lain, belum render pratinjau.
  4. Batas uji = batas pilot v3: lompatan sendi Uq ≤ 11,1 dan adik ≤ 7,1 °/frame; Uq–adik ≥ 1,7 cm; lengan di torso sendiri Uq ≤ 0,2 dan adik ≤ 0,0 cm; tubuh ke dinding/benda ≥ 49,6 cm atau angka storyboard. Ditambah cek makna pada crop.
  5. Gerak yang gagal: berhenti dan beri 2–3 opsi. Naskah dan storyboard tidak diubah.
- **Hasil uji Claude (bukan keputusan; content.md 2026-11-004 §20):**
  - **Mundur ± 1 m: GAGAL secara visual.** Semua batas angka pemilik lolos, tetapi kaki bersilang dan kangkang terlihat di strip: adik −24,5 cm, Uq −18,4 cm. Penyebab: lintasan storyboard (ke utara) membentuk ± 50° dari arah "mundur menjauhi LED-1" sambil tetap menghadapnya. Langkahnya jadi menyamping, dan stepper berselang-seling menyilangkan kaki. 3 opsi di §20.3.
  - **Berbalik ± 116° lalu kembali (masalah: perlu persetujuan pementasan):** sudut diambil dari vektor POV S11; kepala S12 −59,5°. Berbalik di tempat **gagal**: lengan jaket adik menyapu punggung Uq, 0,4 cm. **Lolos** bila adik melangkah 0,10 m menjauh saat berbalik (7,9 cm), lalu kembali ke R1 saat berbalik pulang. Itu **usulan pementasan**, bukan keputusan.
  - **Genggam ulang: GAGAL makna.** Pementasan "titik temu di antara mereka": 96 kombinasi diuji, 38 dengan galat telapak ≤ 1,5 cm, 0 lolos. Pencarian terpisah pada jarak 0,5/0,6 m juga gagal: lengan Uq masuk torso 1,3–3,4 cm, atau tangan menembus lawan. Pementasan "adik meraih tangan Uq yang tergantung", dalam 1,25 s (storyboard 0,8 s), lolos angka: 2,7 cm, torso 0,1/0,0, langkah 0,7/6,3. Tetapi dari lensa P, tangan yang bertemu tampak **di depan perut bawah adik**, sehingga tidak terbaca sebagai bergandengan. 3 opsi di §20.4.
  - **Tatap lensa: lolos angka dan makna, dengan catatan.** Lensa hanya 4° dari arah depan, jadi tatapan terbaca sebagai wajah frontal sesudah melirik ponsel. Diuji dengan pose genggam usulan; nilainya ikut gerak genggam.
  - Waktu: mundur 0,2–2,8 s + berbalik 2,8–3,5 s pas dengan S10 3,5 s (tanpa jeda); berbalik pulang 52,72–53,82 s pas di S13; genggam usulan selesai 60,60 s, sebelum L11 61,00 s.
- **Batas:**
  - Naskah, VO, C1, `npc.tsx`, `cast/stepper.ts`, dan kode Ep 1–2 tidak diubah. Shot pilot tidak diubah.
  - Tanpa render episode, commit, atau push. Status tetap `scripted`, `approved-by-owner: false`.
  - Render hanya urutan gambar klip uji di `_media/2026-11-004/out/motion_v1/`.
  - **Pelanggaran "tidak menghapus file":** enam file probe sementara yang dibuat sesi ini terhapus dengan `rm` (`studio/out/m004_probe/m004_feet/m004_ep2legs` .ts + .cjs; folder build di luar Git). Angka yang hanya berasal dari probe itu (pembanding kaki Ep 2) dikeluarkan dari dokumen; sapuan langkah dibuat ulang di `m004_check.ts feetsweep`. Tidak ada file proyek lain yang dihapus.
  - `studio/src/Root.tsx` ditambah komposisi `Motion004-*` (aditif).

## D-054

**Episode 3, tahap 1b: uji gerak dengan keputusan pemilik; resep uji ditulis ke skill**

- **Tanggal:** 2026-11-20
- **Status:** hasil uji Claude = **draft**. Mundur opsi (a) **gagal sesudah satu iterasi → berhenti** (aturan pemilik). Berbalik **tertahan** (bergantung pada S10). Genggam (insert) dan tatap lensa lolos angka. Episode tetap `scripted`, `approved-by-owner: false`.
- **KEPUTUSAN PEMILIK (arahan tertulis 2026-11-20):**
  1. **Mundur S10 = opsi (a):** badan searah lintasan, kepala menoleh ke LED-1. Lintasan storyboard, lensa, dan garis pandang LED tidak diubah. Masalah lengan raih Uq (−4 cm) diselesaikan dengan **satu iterasi**; batas QC tidak dilonggarkan. Gagal → berhenti dan lapor; tidak beralih ke (b) atau (c).
  2. **Genggam S15 = opsi (a):** insert tangan ± 1 s di awal S15 dari lensa yang memperlihatkan dua tangan bertemu (preseden S08a), gerak usulan D-053 (adik meraih tangan Uq yang tergantung, 1,25 s), boleh menambah satu potongan. Hitung ulang total (batas 70 s), L11, dan shot sesudahnya; VO/SFX boleh bergeser, file VO tidak diedit. Lensa P tidak digeser; meta "kamera di depanmu" tetap.
  3. **Berbalik:** adik melangkah 0,10 m menjauh saat berbalik (disetujui). Uji ulang sesudah keputusan 1; uji juga putaran 0,85 s di S13 dan, bila muat tanpa menggeser VO, di S10; bila tidak muat tetap 0,70 s dan tandai risiko kedip.
  4. **Tatap lensa:** uji ulang dengan pose genggam final dan lensa insert; laporkan sudut lensa terhadap arah depan.
  5. **Resep §14 "Uji gerak baru"** ditulis ke skill `video-production` (aditif), rujukan di STUDIO-WORKFLOW bila perlu.
  6. **Penghapusan:** hanya file sementara sesi ini di `studio/out` boleh dihapus, dan namanya dicatat di sini.
  7. **Mix episode v1** (`_media/2026-11-004/audio/episode/`) **sudah didengar pemilik dan dinyatakan aman, termasuk awal L5; tidak ada varian A/B.** Mix **harus dijalankan ulang dengan timing final**: insert S15 (sekitar +1 s) menggeser cue sesudahnya (N06, Doom, kartu), langkah S10 diambil dari gambar, dan durasi audio (68,39 s) dipangkas pas dengan durasi video. **Mix tidak dijalankan ulang sekarang.** Catatan sesi mix (`_NOTES.md`) dipindahkan ke bagian terpisah (Lampiran D-054-A di bawah, isi tidak diubah).
  8. Naskah, VO, `C1.tsx`, `npc.tsx`, `stepper.ts`, kode Ep 1–2, dan shot pilot tidak diubah. Tanpa commit/push, tanpa render pratinjau episode.
- **Hasil uji Claude (bukan keputusan; content.md 2026-11-004 §21, `_media/2026-11-004/out/motion_v2/`):**
  - **Mundur (a): GAGAL sesudah satu iterasi, berhenti.** Iterasi dideklarasikan sebelum dijalankan (kepala log `qc/angka_s10a_iterasi.txt`): putaran awal disebar 0–0,45 s; badan Uq {0, 10}°, adik {0, 10}°; jarak sisa lengan raih {13, 20} cm × waktu lengan {D-053, lebih awal}; akhir jalan {2,80, 2,65} s. **0 dari 32 varian lolos**, juga bila jendela mundur diukur sendiri (`angka_s10a_jendela.txt`).
    - **Terdekat** (badan 0°/0°, sisa 20 cm, lengan awal, jalan sampai 2,80 s): Uq↔adik 2,9 cm (lolos), torso 0,1/0,0, kaki tidak bersilang (min 5,7 cm), geser 0 mm, putaran badan 5,9 °/f (D-053: 12,8). **Gagal: lompatan sendi lengan Uq 11,4 °/f di 0,30 s (batas 11,1).**
    - Dinilai dari angka saja: tidak ada strip/crop (a) yang dirender.
    - Opsi untuk pemilik (content.md §21.2): iterasi kedua (a), (b), atau (c). Claude tidak memilih.
    - Masalah yang tetap ada walau angka lolos: kepala tidak sampai ke LED-1 di awal mundur (sisa **Uq 14°, adik 21°** di luar batas kepala ±55°); di R1 dengan badan searah (0°/0°) tangan diam keduanya hanya **4,3 cm** (adik 10°: 1,9 cm).
    - Kata "mundur": **tidak ada** di VO/naskah v1.0 (L1–L11, kartu) maupun teks caption pilot; caption episode belum dikodekan (sumbernya teks VO, jadi juga tidak). Isi audio VO tidak bisa diverifikasi (tidak ada transkripsi). Storyboard S10 menulis "mundur ± 1 m … **tetap menghadapnya**"; pada (a) itu hanya lewat kepala dan kepala tidak sampai (deviasi storyboard). Draft v0.1 cabang A (arsip §9) punya "mundur selangkah ke adik", tidak dipakai. `scripts/ep004_episode_audio.py` memakai label cue "langkah mundur" (label internal, tidak tampil).
  - **Berbalik: TERTAHAN** (orientasi akhir S10 belum ada karena (a) gagal). Diukur dengan kandidat (a) terdekat: putar ke lorong Uq 168°, adik 164°.
    - 0,70 s: badan 12,0 °/f, arah kepala 9,9 °/f. 0,85 s: 9,9 / 8,2 °/f. 0,85 s muat **tanpa menggeser VO** hanya bila jalan selesai 2,65 s (0,44/0,49 m/s; storyboard ± 0,38).
    - Keduanya **gagal**: tangan Uq ↔ lengan adik 0,2 cm, kaki adik bersilang −4,2 cm (langkah menjauh pada putaran 164°).
    - **S13 putar balik sudah 1,1 s** (≥ 0,85, tidak dipendekkan): lolos, 8,9 cm, kaki 2,9 cm, badan 5,3 °/f, kepala 5,2 °/f; sama pada D-053 dan (a).
    - Kedip tidak bisa saya nilai dengan mata; angka °/f hanya indikator kasar.
  - **Genggam (insert I15): lolos angka dan makna (catatan).** USULAN: insert **1,5 s** (pemilik "± 1 s"; preseden S08a 1,5 s; inkbeat "≥ 2 s" = deviasi). Raih 0,05–1,30 s (1,25 s), tahan 0,20 s. Lensa (−1,522; 0,75; 1,95) → titik temu (−1,704; 0,575; 1,223), fov 40, tegak lurus sumbu Uq–adik di sisi depan; adik tetap kiri layar.
    - Angka: Uq↔adik 2,7 cm, zona genggam mentah −2,3 cm (dikecualikan), torso 0,1/0,0, sendi 0,7/6,3 °/f.
    - Makna (strip/crop): lengan adik dari lengan bajunya meraih telapak Uq yang terbuka; terbaca sebagai "mengambil tangan Uq". Kelemahan: tangan oval adik menempel di samping telapak, tidak melingkupi; noda gelap kecil di tangan adik 0,4–0,6 s (belum didiagnosis); latar gelap (Y rata-rata 36–41, area kontak 88).
  - **Timing baru (USULAN, `studio/src/ep004/episode004-plan-d054.json`; draft 68,35 s tidak diedit):** potong kembali ke two-shot 0,6 s sebelum L11. Saling pandang mulai 1,30 s (0,2 s sebelum potongan, di luar bingkai insert) dan selesai 0,3 s sesudah potongan. Dorong lensa P menempuh jalur yang sama dalam 7,95 s (dulu 9,15 s), jadi ± 15 % lebih cepat.
    - I15 59,20–60,70; S15 60,70–68,65 (7,95 s); **L11 61,30–65,15**; tatap 64,15–65,15; kartu 65,25; Doom 65,40; **total 68,65 s** (≤ 70). Geser **+0,30 s**, bukan "± +1 s" seperti perkiraan pemilik.
    - Alternatif: insert murni ditambahkan tanpa memakai jeda 1,8 s sebelum L11 → +1,5 s (69,85 s); insert 2,0 s (inkbeat) → +0,8 s (69,15 s).
  - **Tatap lensa: lolos.** Pose genggam usulan; lensa P pada waktu baru (u 0,508 → 0,434): kepala **yaw 3,9°, nod −3,5°** dari arah depan (tidak berubah). Insert tidak mempengaruhi tatap (terjadi 3,5 s sebelumnya).
- **Kode (aditif):** `motion004.ts` (opsi `s10`, `insert`, parameter `gap` default 13 cm, `diag`); `MotionTest004.tsx` (varian `d054`: `insert`, `dua`, `tatap2`); baru `motion004d054.ts`, `episode004-plan-d054.json`; `tools/m004_check.ts` mode `s10a`, `s10split`, `s10best`, `s10pick`, `s13`, `insert` (kolom baru dicetak hanya di mode baru). Mode `retreat` masih menghasilkan −4,0 cm @ 1,57 s seperti log D-053 (hanya baris ini yang dicek ulang).
- **Skill/dokumen:** `video-production` v0.6 §14 (aditif; isi lama byte-identik); STUDIO-WORKFLOW v1.3 §10 butir 5 (rujukan).
- **File dihapus (aturan pemilik butir 6):** `studio/out/m004b_check.cjs`, `studio/out/m004b_probe.cjs`, `studio/out/m004b_probe.ts`, semuanya dibuat sesi ini (dicek dengan penanda waktu). Tidak ada file lain dihapus. File probe di `_media/2026-11-004/out/motion_v2/` (`probe_insert_a_f020/044.png`, `qc/_tmp_pair.jpg`, `qc/_tmp_crop.png`) **tidak** dihapus (di luar `studio/out`).
- **`_NOTES.md`:** isinya disalin utuh ke Lampiran D-054-A dan content.md §21.7. File aslinya **tetap di tempat** (menghapus di luar `studio/out` tidak diizinkan); menunggu pemilik.

### Lampiran D-054-A — catatan sesi mix episode v1 (`_media/2026-11-004/audio/episode/_NOTES.md`, disalin tanpa perubahan)

> Catatan Claude (di luar salinan): butir 5 "Kelemahan terbesar" ditulis sebelum D-053; rencana 68,35 s kini disetujui pemilik. Keputusan pemilik tentang mix ada di D-054 butir 7 di atas.

````markdown
# Mix episode penuh 2026-11-004 (Ep 3), v1: catatan (2026-11-20)

Catatan ini ditulis oleh sesi audio. Sesi lain yang memindahkannya ke `DECISION-LOG`, `content.md`, dan `ROADMAP`. Sesi ini tidak mengedit ketiganya.

## Keluaran

| File | Isi |
|---|---|
| `2026-11-004_episode_v1.wav` | mix episode, 48 kHz stereo, 16-bit, 68,39 s |
| `2026-11-004_episode_v1.m4a` | encode AAC 192 kbps dari WAV di atas (hasil encode yang diukur) |
| `2026-11-004_episode_v1_cues.txt` | 40 cue: waktu, aturan level, gain |
| `2026-11-004_episode_v1_report.txt` | loudness, true peak, limiter per bagian |
| `work/` | file antara (cache cue, premix, iterasi master). Tidak dihapus. |

Skrip: `scripts/ep004_episode_audio.py` (baru). `ep004_pilot_audio.py`, `studio/`, VO, dan naskah tidak diubah. Perintah: `python scripts/ep004_episode_audio.py mix --name <nama>`. Skrip menolak menimpa.

## Angka (VERIFIED, diukur ffmpeg ebur128)

| Ukuran | WAV | AAC 192k | Target |
|---|---:|---:|---|
| Loudness terintegrasi | -14,20 LUFS | -14,20 LUFS | -14 ± 0,5 |
| True peak | -1,90 dBTP | -2,00 dBTP | ≤ -1,5 |
| Premix sebelum master | -20,70 LUFS | | |
| Gain master | +7,50 dB, langit-langit limiter -2,6 dB | | |

Angka ini cocok dengan pra-cek §19.4 (-20,8 LUFS, +7,5 dB, TP -1,9).

## Penekanan limiter (gain reduction, jendela 5 ms, latensi dikoreksi)

| Bagian | Maks | Di detik | Total > 1 dB |
|---|---:|---:|---:|
| **Seluruh episode** | **8,4 dB** | 21,66 | 2,75 s |
| **Awal L5 (N02, 21,52-23,52 s)** | **8,4 dB** | 21,66 | 0,49 s |
| L5 seluruhnya | 8,4 dB | 21,66 | 0,58 s |
| L8a/b/c (N04, 41,88-48,83) | 7,2 dB | 47,85 | 0,61 s |
| L4 toa P01 | 6,9 dB | 14,93 | 0,18 s |
| L10 N05 | 6,9 dB | 55,37 | 0,35 s |
| **D01 bisikan adik** | **5,8 dB** | 33,41 | 0,05 s |
| L1-L3 | 5,4 dB | 3,20 | 0,35 s |
| L6 N03 | 4,9 dB | 28,54 | 0,18 s |
| L9 toa P02 | 4,7 dB | 51,05 | 0,11 s |
| N06 pertanyaan | 4,4 dB | 61,05 | 0,33 s |
| Doom + kartu | 0,4 dB | 65,12 | 0,00 s |
| S10 langkah mundur | 0,0 dB | | 0,00 s |

Pra-cek memberi 8,4 dB (awal L5, 21,66 s) dan 5,7 dB (bisikan): mix nyata memberi 8,4 dan 5,8 dB.

Sebab awal L5 (OBSERVATION dari sinyal): N02 punya puncak -3,2 dBFS (tertinggi dari semua VO) pada suku kata pertama sekitar 21,66 s, sedangkan loudness-nya hanya -23,8 LUFS. Normalisasi ke -20 LUFS lalu gain master +7,5 dB membuat puncak itu jauh di atas langit-langit, sehingga limiter menekannya 8,4 dB. Penekanan 8,4 dB dalam jendela 5 ms bisa terdengar sebagai konsonan/awalan yang pipih atau "ditepuk". Belum didengar.

## Hal yang berbeda dari pilot (sengaja)

1. Blok A (S01-S02) memakai cue dan waktu pilot v3. Blok B digeser +3,271 s (D01 29,05 → 32,321 s); hasilnya cocok dengan plan: klik LED-1 31,18 s, D01 32,48 s, layar ponsel 36,32 s.
2. `Relaxed_footsteps_alley` diberi fade-out 0,8 s. Di pilot, potongan di 9,2 s mengakhirinya. Di episode ia berjalan sampai 11,3 s, melewati L3.
3. Bed malam 30 s dipanjangkan ke 68,9 s dengan dua sambungan crossfade 1,2 s di dalam ucapan (28,34 s dan 56,51 s). Metode Ep 2.
4. Fade-out 0,3 s di ujung master. Ekor Doom (6 s) lebih panjang daripada gambar (68,35 s).
5. Tidak ada potongan blok dan tidak ada fade 10 ms di sambungan; pilot punya keduanya.
6. `sfx-14` (UNDECODABLE) tidak dipakai. Empat klik LED memakai `switch_click.wav` sintesis (sama dengan pilot).
7. N04 lama tidak dipakai; N04a/b/c dipakai.

## Langkah mundur S10 (ASUMSI, bukan terkunci ke gambar)

S10 belum dirender, jadi waktu langkah berasal dari storyboard §11 (mundur ± 1 m, ± 0,38 m/s, dari 0,2 s sampai 2,8 s di dalam shot, lalu berbalik):

- Uq: 38,04 / 38,84 / 39,64 s. Puncak -24 dB.
- Adik: 38,24 / 39,04 / 39,84 s, 0,2 s sesudah Uq. Puncak -28 dB.
- Satu geseran pelan saat berbalik: Uq 40,49 s dan adik 40,69 s (lebih pelan 3 dB).
- Sumber: butir langkah dari `Slow,_careful_footst_#1.mp3`, butir dipotong di onset file. Sumber ini sama dengan Ep 2 dan Ep 3.

Begitu S10 dirender dan tapak kaki terukur dari gambar, ganti `RETREAT` di skrip dengan waktu tapak dari gambar (seperti `ep003_episode_audio.py`). Jumlah dan jarak langkah di atas hanya tebakan dari kecepatan; pola nyata bisa lain.

## Kelemahan terbesar (urut)

1. **Tidak ada yang bisa saya dengar.** Seluruh mix hanya terverifikasi dari angka. Tidak dinilai: apakah awal L5 terdengar pipih, apakah bisikan adik terdengar jelas dan wajar, keseimbangan VO terhadap bed, apakah bed dan dengung toa menutupi VO, apakah sambungan bed terdengar.
2. **Penekanan limiter 8,4 dB di awal L5.** Terbesar di episode. Pilot v3 (8,9 dB di bisikan) diterima pemilik, tetapi ini beda tempat dan beda konsonan. Perlu didengar. Bila terdengar buruk, opsi (VO dan naskah tidak diubah): turunkan N02 relatif ke VO lain sebelum master, atau limiter dengan attack/release lain. Belum dicoba.
3. **Langkah mundur S10 hanya asumsi**, belum terkunci ke gambar (lihat di atas).
4. **Isi VO tidak terverifikasi** (tidak ada transkripsi di mesin ini; sama dengan §19.2). Yang diperiksa hanya posisi dan level. Tidak diketahui apakah N04a/b/c berisi kalimat yang benar.
5. **Waktu episode adalah plan draft** §19.3 (belum disetujui pemilik pada plan jeda editorial). Bila jeda berubah, semua cue harus dihitung ulang.
6. **Belum didengar siapa pun:** `Old_round_doorknob`, `Muffled_held_breath`, `Relaxed_footsteps_alley` (baru), klik LED sintesis, Doom (K19), dan titik sambungan bed.
7. **Sinkron dengan gambar belum diuji.** Waktu cue dihitung dari plan; gambar S03-S07 dan S10-S15 belum ada. Sinkron kenop/gerendel/LED di S01 dan S08a tidak berubah dari pilot.
8. **Tidak ada cek clipping antarsampel di luar true peak**, dan tidak ada pengukuran loudness jangka pendek (LRA, momentary max). Hanya integrated dan true peak.
9. Ukuran `work/` ± 110 MB (cache cue, premix float32). Bisa dibersihkan pemilik; sesi ini tidak menghapus.

## Belum dilakukan (di luar tugas)

- Mux ke video, render, perubahan di `studio/`.
- Pembaruan `DECISION-LOG`, `content.md`, `ROADMAP`.
- Commit atau push.
````


## D-055

**Episode 3, tahap 1c: mundur S10 opsi (b) lalu (c), berbalik, insert genggam 2,0 s**

- **Tanggal:** 2026-11-20
- **Status:** hasil uji Claude = **draft**. Opsi (b) **gagal** di cek berantai → otomatis (c). Opsi (c) **lolos semua batas angka** (1 dari 8 varian), tetapi **cek makna memperlihatkan dua kelemahan** (kangkang lebar; tangan Uq tampak menyentuh tangan adik dari lensa P). Saya tidak menyatakan S10 final; pemilik menilai. Episode tetap `scripted`, `approved-by-owner: false`.
- **KEPUTUSAN PEMILIK (arahan tertulis 2026-11-20):**
  1. **Mundur S10 = opsi (b):** lintasan lurus menjauhi LED-1, badan menghadap LED-1, ± 1 m, R1 baru. S10 3,5 s dan jendela mundur tetap; VO tidak bergeser; kecepatan boleh disesuaikan. Satu iterasi, ditulis lebih dulu. Cek berantai dengan angka tanpa render. Uji gerak dengan QC lengkap dan **render** strip + crop 1:1. **Gagal → otomatis opsi (c)** (geser-rapat, tetap menghadap LED-1), satu iterasi, aturan sama. **(c) gagal → berhenti**; tidak membuat opsi baru. Storyboard v0.4 boleh, hanya untuk lintasan/posisi S10–S12 bila (b) dipakai.
  2. **Berbalik:** uji ulang sesudah S10 final dengan 0,70 s; 0,85 s hanya bila muat tanpa menggeser VO. Adik tetap melangkah 0,10 m menjauh. S13 (1,1 s) tidak diulang kecuali orientasi akhir S10 mempengaruhinya.
  3. **Insert I15 = 2,0 s** dengan gerak yang sudah lolos; lensa P tidak digeser; timing ke file rencana baru `episode004-plan-d055.json` (rencana 68,35 s dan D-054 tidak diedit); batas 70 s; dorong lensa P usahakan tidak lebih cepat dari rencana lama; diagnosis noda tangan adik (C1.tsx/npc.tsx tidak diubah); tangan oval adik yang hanya menempel **diterima** sebagai batas model tangan.
  4. **Tatap lensa:** uji ulang, laporkan sudut. Tidak ada keputusan baru.
  5. `_NOTES.md` asli dibiarkan; salinan di Lampiran D-054-A dan content.md §21.7 disetujui.
  6. Penghapusan hanya file sementara sesi ini di `studio/out`.
  7. Naskah, VO, C1.tsx, npc.tsx, stepper.ts, kode Ep 1–2, shot pilot tidak diubah; mix tidak dijalankan ulang; tanpa commit/push/render pratinjau.
- **Hasil uji Claude (bukan keputusan; content.md 2026-11-004 §22, `_media/2026-11-004/out/motion_v3/`):**
  - **(b) GAGAL di cek berantai, 0 dari 3 jarak (0,9 / 1,0 / 1,1 m).** Kepala iterasi ditulis sebelum hitungan (`qc/angka_s10b_iterasi.txt`, termasuk pengakuan perkiraan kertas sebelumnya).
    - LED-3 (lorong) **terhalang fisik** dinding di atas mulut lorong pada ketiga jarak: garis pandang lewat y 2,209–2,254 m, ambang 2,20 m. Agar lolos, mata Uq harus di z ≤ ± 1,18–1,34; lintasan (b) baru sampai situ sesudah ± 1,8 m, sedangkan sesudah ± 0,8 m garis keluar dari kusen barat.
    - LED-4 (kamar) terhalang daun pintu kamar pada ketiga jarak; LED-2 (dapur) terhalang pada 1,0 dan 1,1 m; adik ↔ lemari rendah 42,5 cm (< 49,6) pada 1,1 m.
    - Lolos: LED-1 terlihat dari kedua mata; meja jauh (52–60 cm).
    - Dua kriteria kepala log ternyata lebih ketat dari storyboard sendiri (LED-3 di dalam bingkai pada fov 26; kepala S12 ≤ 55°): R1 storyboard v0.3 juga gagal di keduanya. Dicatat di log; keputusan (b) tidak bergantung pada keduanya.
    - Uji gerak (b) tidak dijalankan. Storyboard v0.4 **tidak dibuat** (tidak ada geometri yang berubah).
    - OBSERVATION untuk S11 nanti: dari R1 storyboard, LED-3 keluar dari tepi atas bingkai pada fov 26 (y −16 px), sedangkan kliknya dan "Satu di lorong" jatuh di akhir S11. Ini risiko pementasan S11, dicatat di content.md §22.8 butir 5.
  - **(c) geser-rapat: 1 dari 8 varian lolos semua batas** (kepala `qc/angka_s10c_iterasi.txt`, ditulis sebelum kode). Pilihan: 3/3 siklus (6 langkah kaki per tokoh), badan "denyut" (bergeser per pasangan langkah), lengan raih Uq waktu D-053 (sisa 13 cm). Fungsi langkah baru `studio/src/ep004/shuffle004.ts`; `stepper.ts` tidak diubah.
    - Jendela mundur 0–2,8 s: sendi Uq **10,7** °/f @ 0,30 s (≤ 11,1), adik 0,0; Uq↔adik **5,7 cm** @ 1,57 s; torso 0,1/0,0 cm; antarkaki min 12,7 cm (tidak bersilang); geser 0 mm; meja storyboard 17,1/11,5 cm (= storyboard); badan 1,3 °/f; kepala ke LED-1 tanpa sisa (0°/0°; D-054 (a): 14°/21°); kecepatan 0,37/0,42 m/s.
    - Gagal di grid: badan "luncur" (lengan masuk torso 1,0 cm), lengan "awal" (sendi 12,6–17,8 °/f), 4/4 siklus + denyut (torso 1,1 cm).
    - **Makna (strip/crop, lensa P):** terbaca sebagai keduanya bergeser menjauh sambil tetap menghadap kamera/LED-1. Kelemahan terlihat:
      1. **Kangkang lebar:** jarak antarkaki maks Uq 45,8 cm @ 1,50 s, adik 47,8 cm @ 1,47 s (diam 15 / 12,7 cm; (a) berjalan 39,0/36,7 cm; log `qc/angka_s10c_kaki_maks.txt`). Terlihat jelas di `crop11_mundur55_f045_kaki.png`.
      2. **Tangan Uq tampak menyentuh** tangan/jaket adik di 1,4–1,7 s (`crop11_mundur55_f047_tangan.png`), walau jarak 3D 5,7 cm. Storyboard: "terulur ke arah adik, tanpa sentuhan".
  - **Berbalik (sesudah (c)): lolos angka, 0,70 s.** Putar 116° (= D-053), badan 8,3 °/f, arah kepala dunia 8,3 °/f, Uq↔adik 7,9 cm, kaki adik min 5,8 cm, sendi 0. **0,85 s tidak muat:** jendela mundur 0,2–2,8 s dikunci (butir 1), jadi putaran hanya punya 2,8–3,5 s. Kedip tidak bisa saya nilai dengan mata.
  - **S13:** orientasi akhir S10 (c) sama dengan D-053/D-054 (R1 storyboard, arah lorong), jadi tidak terpengaruh. Angka cek ulang identik: 8,9 cm, kaki 2,9 cm, badan 5,3 °/f.
  - **Insert I15 2,0 s: lolos angka.** Raih 0,05–1,30 s (gerak D-054 tanpa perubahan), tahan 0,70 s (diam). Uq↔adik 2,7 cm, zona genggam −2,3 cm (dikecualikan), torso 0,1/0,0, sendi 0,7/6,3 °/f. USULAN: saling pandang mulai 1,80 s (0,2 s sebelum potongan, selesai 0,3 s sesudahnya, sama dengan D-054). Tanpa itu, pandangan selesai di dalam insert dan two-shot tidak pernah memperlihatkan keduanya saling menoleh.
  - **Rencana `studio/src/ep004/episode004-plan-d055.json`:** I15 59,20–61,20; S15 61,20–69,15 (7,95 s); L11 61,80–65,65; tatap 64,65–65,65; kartu 65,75; Doom 65,90; **total 69,15 s** (≤ 70); geser **+0,80 s** dari L11 dibanding rencana 68,35 s.
  - **Dorong lensa P (USULAN "lama"; pertimbangan: "mulai" paling harfiah memenuhi "lensa P tidak digeser"):** pemetaan lama 9,15 s diteruskan dari 59,20. Two-shot mulai di u 0,219 (fov 49,0), tiba di posisi akhir lama pada 68,35, lalu diam 0,80 s di bawah kartu. Kecepatan maks **4,79 cm/s, 1,31 °/s = 100 % rencana lama**. Alternatif: "cepat" (jalur penuh dalam 7,95 s, 115 %, sama dengan D-054); "mulai" (dari P0 dengan kecepatan lama, 100 %, berakhir di fov 42,4, masih bergerak).
  - **Noda gelap tangan adik: penyebab ditemukan.** Bayangan jari/tangan Uq dari lampu bulan `MoonSpot` (`studio/src/ep002/sets.tsx`, kode Ep 1; `castShadow`, peta 1024²) jatuh di tangan oval adik saat tangan mendekat (f9–f20).
    - Uji warna (baju, celana, jaket diwarnai lain): noda tidak berubah. Tanpa CharLight: noda tetap. **Tanpa Uq: hilang. Tanpa bulan: hilang** (`_media/2026-11-004/out/motion_v3/diag/`).
    - Bukan di C1.tsx/npc.tsx; tidak diubah. Usulan di content.md §22.5.
  - **Tatap lensa:** yaw **3,8°**, nod **−3,5°** dari arah depan (pemetaan "lama"; "cepat" 3,9/−3,5; "mulai" 4,0→3,9/−3,5). Wajah frontal di crop.
- **Kode (aditif; default lama tetap; log D-054 tereproduksi: kandidat (a) 11,4 °/f @ 0,30 s, insert 2,7 cm):**
  - baru `studio/src/ep004/shuffle004.ts`, `motion004d055.ts`, `episode004-plan-d055.json`;
  - `motion004.ts`: opsi `s10c`, `look0`, `insert.camStart/camDur`;
  - `MotionTest004.tsx`: varian `d055` (4 komposisi) dan prop diagnosis `diag` (hanya lewat `--props`);
  - `tools/m004_check.ts`: mode `s10b_chain`, `s10c`, `s10cpick`, `insert55`, `spread`; kolom jarak antarkaki maks di `measure()`.
- **File dihapus (aturan pemilik butir 6):** `studio/out/d055tmp_check.cjs`, `studio/out/d055tmp_probe.ts`, `studio/out/d055tmp_probe.cjs`, `studio/out/d055tmp_check2.cjs` (dibuat sesi ini). Angka yang dulu hanya dari probe (jarak antarkaki maks, yaw badan) dibuat ulang di `m004_check.ts spread` dan dicatat di log tetap. Tidak ada file lain dihapus.
- **Skill:** `video-production` §14 ditambah satu baris batas rig terbukti (geser-rapat menyamping ± 1 m: kaki tidak bersilang, tetapi kangkang 46–48 cm pada 3 siklus). Temuan lain (ambang lorong, bayangan bulan) adalah geometri set/cahaya, bukan batas rig, jadi tidak masuk skill.


## D-056

**Episode 3, tahap 2 (kode shot), kelompok A: S10–S12; iterasi tangan S10; berhenti di batas kelompok**

- **Tanggal:** 2026-11-20
- **Status:** hasil Claude = **draft**. Kelompok A dibangun. S10 dan S11 lolos angka dan strip. **S12 tertahan** karena kedip pada kusen pintu kamar (cacat set). Kelompok B (S03–S07) dan C (S13–S15, I15, kartu, tatap) **belum dibangun**: sesi berhenti di batas kelompok karena konteks menipis (aturan pemilik butir 6), handoff di SESSION-HANDOFF. Episode tetap `scripted`, `approved-by-owner: false`.
- **KEPUTUSAN PEMILIK (arahan tertulis 2026-11-20):**
  1. S10 (c) geser-rapat **diterima**, dengan **satu** iterasi terarah pada tangan Uq. Bila gagal: kembali ke varian D-055, sentuhan = risiko pratinjau, tanpa iterasi lagi. Kangkang 46–48 cm diterima sementara; jumlah siklus/panjang langkah tetap mudah disetel.
  2. Insert I15 final: 2,0 s, gerak D-055, saling pandang mulai 1,80 s; two-shot S15 pemetaan "lama"; lensa P tidak digeser.
  3. Noda bayangan bulan di tangan adik diterima apa adanya; `sets.tsx` dan kode Ep 1–2 tidak diubah; kasus serupa dilaporkan saja.
  4. `episode004-plan-d055.json` (69,15 s) = rencana kerja; perubahan berikutnya ke file baru bernomor.
  5. S11: LED-3 boleh dijaga di dalam bingkai dari klik (44,355 s) sampai akhir "Satu di lorong" (46,36 s) dengan menyesuaikan akhir dorong; lensa/posisi lain tidak diubah tanpa lapor.
  6. Tahap 2 = kode semua shot yang belum ada, urutan A → B → C, QC per kelompok, berhenti di batas kelompok bila konteks menipis. Shot gagal: berhenti di shot itu, 2–3 opsi, lanjut shot lain yang tidak bergantung.
  7. Kode Ep 3 aditif saja; C1.tsx, npc.tsx, stepper.ts, kode Ep 1–2, shot pilot tidak diubah; render hanya urutan gambar uji per shot; tanpa mix, commit, push, render pratinjau.
  8. Kontinuitas: ponsel di tangan kiri Uq, jaket di lengan kanan adik, "Uq" di dada kiri anatomis, C1.tsx tidak diubah. Uji halo LED pada shot yang kameranya bergerak bersama tokoh (pendar hanya bila LED tidak tertutup). Kartu pilihan akhir gaya Ep 1: dua kartu berdampingan di atas, tanpa label AB, dentuman bass sesudah narasi selesai, tanpa kartu ketiga. Nama film inspirasi tidak disebut di teks apa pun.
- **Hasil Claude (bukan keputusan; content.md 2026-11-004 §23, `_media/2026-11-004/out/motion_v4/`, `_media/2026-11-004/out/shots_v1/`):**
  - **Iterasi tangan S10: 0 dari 6 lolos → kembali ke varian D-055** (kepala ditulis sebelum hitungan: `motion_v4/qc/angka_s10c_tangan_iterasi.txt`).
    - Grid: sisa lengan raih {13, 20, 27} cm × tinggi sasaran {0,92; 1,02} m.
    - Ukuran makna baru: jarak layar dari lensa S10 antara tangan kanan Uq dan tangan/jaket/lengan adik, ≥ 12 px di seluruh jendela mundur.
    - Semua varian gagal ukuran layar (−36 s/d −43 px). Lima varian baru juga gagal batas QC: sendi 11,8–15,1 °/f atau lengan masuk torso 4,7–8,1 cm.
    - Diagnosis sesudah iterasi (varian D-055, hanya tangan+jaket seperti kata pemilik): tumpang tindih di layar pada 0–0,1 s (−21 px, pose awal) dan 1,5–1,7 s (−15 px, saat lengan turun). Selebihnya 2–190 px. Jarak 3D tangan Uq ↔ tangan adik tetap **5,7 cm @ 1,57 s**.
    - **Sentuhan yang tampak = risiko untuk pratinjau.** Tidak ada iterasi lagi.
  - **Kode baru:**
    - `studio/src/ep004/episode004Stage.ts`: waktu episode → tokoh, LED, dan kamera S10–S12, di atas rantai yang sudah diuji. Putar balik S13 sudah dipindah ke 52,72–53,82 s lewat opsi `s10c.backT`. Kepala ke kamar di S12 (−55° / −50°) dan ancang-ancang kepala sebelum putar balik.
    - `studio/src/ep004/Episode004Shot.tsx`: komposisi `Ep004Shot-S10`, `-S11`, `-S12`, didaftarkan di `Root.tsx` (aditif).
    - `motion004.ts`: opsi `s10c.reachY`, `s10c.backT`; default lama tetap.
    - `tools/m004_check.ts`: mode `s10hand`, `s10hand_diag`, `groupA`.
  - **S10: lolos angka.** Sama dengan uji D-055: sendi 10,7 °/f, Uq↔adik 5,7 cm, torso 0,1/0,0, kaki tidak bersilang, geser 0 mm, meja = storyboard, putar 0,70 s 8,3 °/f, kangkang 45,8 / 47,8 cm.
  - **S11: lolos.** Fov akhir **28,12** (storyboard 26). Dorong: 40 % sampai klik LED-3, sisanya dipercepat sampai 46,36 s, lalu diam sampai potongan 46,96 s. Versi 1 sempat tersendat di klik (−0,0168 → −0,0042 °/frame pada f93–f94). Versi 2 memakai kurva yang mulai dengan kecepatan segmen pertama (f92 −0,0168, f93 −0,0173, f94 −0,0197), dirender ulang ke `seq_S11_v2/`. CATATAN: LED-3 ada di y 60–174 px, di atas garis atas kartu proyek (y 170). Aturan zona aman UI platform tidak ditemukan di style target, STUDIO-WORKFLOW, atau CHANNEL-DNA (UNKNOWN) → risiko untuk pratinjau di ponsel. LED-3 y 132 px saat klik dan 60 px di 46,36 s (halo 30 px + tepi 30 px); LED-2 x 846–891 px. Keduanya tidak terhalang dan halo menyala tepat pada klik. Lensa dan posisi S11 tidak diubah.
  - **Cek tepi set di S10/S11 (sesudah S12):** strip tiap frame tepi kanan S10 (f66–f80) dan S11 (f80–f95, skala 0,25). Tidak ada pola gigi gergaji kusen. Di S10 f68–f69 ada bintik kecil di ujung sofa (kemungkinan z-fighting kecil; dicatat, belum didiagnosis).
  - **Kenop langkah:** `cyclesFor(dist, stepLen)` di `shuffle004.ts`; `S10_CYCLES` di `episode004Stage.ts` (default 3/3, keluaran tidak berubah).
  - **S12: TERTAHAN (cacat visual).** LED-4 lolos: terlihat di bukaan pintu dan menyala pada klik (639; 550) → (654; 485). Tetapi kusen kiri dan ambang pintu kamar menampilkan pola gigi gergaji yang **berubah tiap frame**.
    - Ini bukan bayangan bulan: tanpa bulan pola tetap ada.
    - Penyebab (dari membaca kode, belum diuji dengan perubahan): kusen `Door` di `src/ep002/sets.tsx` (kode Ep 1) punya sisi dalam di ±w/2, sebidang dengan sisi bukaan dinding (z-fighting). Opsi di content.md §23.4.
- **Batas:** naskah, VO, C1.tsx, npc.tsx, stepper.ts, kode Ep 1–2, shot pilot, rencana d055 tidak diubah. Tanpa mix, render pratinjau, commit, push.
- **File dihapus (aturan pemilik):** `studio/out/d056tmp_check.cjs`, `studio/out/d056tmp_fov.ts`, `studio/out/d056tmp_fov.cjs` (dibuat sesi ini). Tidak ada file lain.
- **Skill:** `video-production` §14 ditambah satu baris batas rig terbukti (lengan raih C1 saat geser-rapat).

## D-057

**Episode 3, tahap 2 lanjutan: penutup kusen (opsi i), kelompok B (S03–S07), kelompok C (S13–S15, I15, kartu, tatap)**

- **Tanggal:** 2026-11-20
- **Status:** hasil Claude = **draft** (diisi bertahap; lihat content.md 2026-11-004 §24). Episode tetap `scripted`, `approved-by-owner: false`.
- **KEPUTUSAN PEMILIK (arahan tertulis 2026-11-20):**
  1. Kedip kusen S12: opsi (i), penutup kusen khusus Ep 3 di `src/ep004/`, dipakai di semua shot Ep 3 yang memperlihatkan `Door`; `sets.tsx` dan kode Ep 1–2 tidak diubah. Satu iterasi; gagal → berhenti dan lapor, tidak pindah ke (ii)/(iii). Kriteria: pola gerigi hilang di f4–f16 dan tepi atas f45–f55; selisih antarframe kusen ≤ dinding statis di dekatnya; before/after.
  2. S10: varian D-055 diterima apa adanya; tidak diiterasi lagi.
  3. S11: fov akhir 28,12 diterima; LED-3 dekat tepi atas = risiko zona aman, tidak diubah sekarang.
  4. Bintik ujung sofa S10 f68–f69: diagnosis; perbaiki hanya bila di kode Ep 3 dan sederhana.
  5. Kelompok B lalu C, mengikuti storyboard v0.3, rencana d055, pola stage pilot/episode. I15 final 2,0 s (gerak D-055, saling pandang 1,80 s; pemetaan "lama", fov pembuka 49,0, dorong maks 4,79 cm/s, berhenti pelan lalu diam 0,8 s; lensa P tidak digeser), kartu akhir, tatap lensa.
  6. QC tiap shot dengan batas pilot v3, strip + crop, cek makna dari lensa final. Shot gagal → berhenti di shot itu, 2–3 opsi.
  7. Kontinuitas (ponsel kiri Uq, jaket lengan kanan adik, "Uq" dada kiri, C1.tsx tidak diubah), uji halo pada kamera bergerak, kartu gaya Ep 1 tanpa AB, tanpa nama film inspirasi.
  8. Bayangan bulan diterima; `sets.tsx` tidak diubah.
  9–14. Hemat konteks; kode Ep 3 aditif saja; render hanya urutan gambar uji; berhenti di batas kelompok; hapus hanya file sementara sesi ini di `studio/out`; naskah/VO tidak diubah; mix tidak dijalankan ulang; tanpa commit/push/render pratinjau.
- **Hasil Claude (bukan keputusan) — bagian 1: penutup kusen, sofa, kelompok B** (rinci di content.md §24):
  - **Penutup kusen** (`studio/src/ep004/jambCover004.tsx`): tiga kotak yang membungkus kusen asli, setiap sisi terlihat 2 mm di luar sisi asli, tanpa bidang berimpit baru. Kriteria (a) **lolos** (strip before/after). Kriteria (b) secara harfiah **tidak terpenuhi** dengan selisih kecil: ROI sisi dalam kusen 0,24/0,26 vs dinding datar 0,05/0,20 (sebelum 8,23/5,20; maks 4 tingkat, 0 % piksel > 8; sebelum 30 %/21 %, maks 41–44). HYPOTHESIS: sisa = tekstur kayu kusen yang bergeser karena dorong fov. Tidak diiterasi lagi; pemilik memutuskan (b).
  - **Sofa S10 f67–f69:** z-fighting di ujung lengan sofa, tetap ada tanpa tokoh → penyebab di `Sofa` (`src/ep002/sets.tsx`, kode Ep 1–2: sisi luar dan muka depan lengan sebidang dengan dudukan). **Hanya dilaporkan.**
  - **Kelompok B dibangun** (`studio/src/ep004/episode004B.ts`, `overlay004.tsx`): S03 dan S06 lolos. **S04, S05, S07 gagal di lensa storyboard** (v1: kepala Uq terpotong pada fov 30/26; lensa S05 tertutup badan adik); yang dibangun = opsi A (USULAN: S04 fov 40→37, S07 36→34, S05 depan-kiri fov 18), opsi B/C di content.md §24.2. **Makna gagal:** lepasnya tangan Uq di S04 tidak terlihat; cahaya layar di wajah S07 tidak terlihat. Angka harfiah: lompatan sendi S04 11,146/7,146 > 11,1/7,1 (identik dengan jalur S02 pilot sumber batas); lengan ponsel pose awal Ep 2 0,23 cm. S06 tanpa notifikasi layar kunci (deviasi).
- **Hasil Claude — bagian 2: kelompok C** (content.md §24.5): S13, S14 (UI pesan kedua), I15 (klip D-055 tanpa perubahan), S15 utuh dengan kartu akhir dan tatap lensa **lolos angka dan makna di strip/crop** (kaki S13 min 2,9 cm, tidak bersilang). Kamera S15 cocok dengan angka pemilik: fov awal 49,02, dorong maks 4,79 cm/s, diam 0,78 s di akhir. Semua LED di luar bingkai di S13–S15 (halo tidak pernah digambar; uji halo tertutup tokoh tidak bisa dibuktikan di shot ini). Wajah Uq y 682–695 saat kartu (pedoman ≥ 700).
- **Kelemahan terbesar (urut):** (1) kriteria (b) kusen tidak harfiah; (2) lepasnya tangan Uq di S04 tertutup badannya dari lensa; (3) cahaya layar di wajah S07 hampir tidak terlihat; (4) S05 sesudah angkat hanya punggung ponsel; (5) bintik sofa S10 (kode Ep 1–2).
- **Batas:** naskah, VO, C1.tsx, npc.tsx, stepper.ts, sets.tsx, kode Ep 1–2, shot pilot, rencana d055 tidak diubah. Tanpa mix, render pratinjau, commit, push.
- **File dihapus:** `studio/out/d057tmp_check.cjs` (dibuat sesi ini). **Pelanggaran kecil, dilaporkan:** `_media/2026-11-004/out/shots_v2/qc/angka_kelompokB.txt` (dibuat sesi ini beberapa menit sebelumnya) dihapus lalu dibuat ulang dengan angka terbaru; file itu berada di luar `studio/out`, jadi penghapusan ini di luar izin butir 12.
- **Skill:** `video-production` §14 ditambah satu batas rig terbukti (pose baca ponsel Ep 2 = lengan 0,31 cm di torso).


## D-058

**Episode 3, tahap 3: rakit episode penuh dan render PRATINJAU 540×960 (bukan final)**

- **Tanggal:** 2026-11-21
- **Status:** hasil Claude = **draft**. Pratinjau dirender dan di-QC; episode tetap `scripted`, `approved-by-owner: false`. Tanpa render final 1080×1920, commit, push.
- **KEPUTUSAN PEMILIK (arahan tertulis 2026-11-21):**
  1. Penutup kusen S12: kriteria (b) **diterima** (kedip hilang secara visual; sisa selisih sangat kecil); dinilai ulang di pratinjau.
  2. Lensa S04, S05, S07: **opsi A diterima** (S04 fov 40→37, S07 36→34, S05 lensa depan-kiri fov 18); makna S04 dan S07 opsi A diterima. Bila wajah Uq di S07 terasa tidak tersinari layar, opsi B (± 0,3 dengan uji warna kaus) dikerjakan sesudah pemilik menonton.
  3. Angka harfiah S04 (11,146 / 7,146 °/f, identik jalur S02 pilot) dan lengan ponsel 0,23 cm di torso (warisan Ep 2) **diterima**.
  4. S06 tanpa notifikasi layar kunci: **diterima**.
  5. Sofa S10: **biarkan (opsi c)**; `sets.tsx` dan kode Ep 1–2 tidak diubah.
  6. Log buatan sesi sendiri di `qc/` boleh dihapus dan dibuat ulang (dicatat).
  7. Mix = `2026-11-004_episode_v2` (−14,20 LUFS, −1,90 dBTP, 2075 frame); tidak di-mix ulang.
  8. Total video = jumlah frame tiap shot yang dibulatkan (**2076 frame = 69,20 s**); durasi shot tidak diubah demi audio; audio v2 + 1 frame hening di ekor (sesudah fade 0,3 s) dengan nama baru `episode_v3`, v2 tidak ditimpa. Tapak putar 2 per tokoh dan tapak serentak Uq–adik diterima.
  9. Rakit 12 shot (`SHOT_IDS`) + pilot S01/S02/S08a/S08/S09 apa adanya, overlay recap + label seperti pilot v3, kartu recap 7,150 / klik 7,850 / hilang 9,200 s, UI S06/S14, kartu akhir S15, rencana d055; caption episode penuh (gaya pilot v3/Ep 2, teks VO naskah v1.0, waktu kata = ASUMSI, tanpa nama film inspirasi).
  10. QC pratinjau: ffprobe, contact sheet 2 fps, pemindaian kedip seluruh video (10 titik, crop 1:1), sinkron cue–frame (toleransi 1 frame), teks layar vs naskah per karakter, zona aman konservatif (atas 288, bawah 672, kiri 48, kanan 192 px; panduan pihak ketiga = indikasi), total durasi; premis L3 dan posisi kartu = HYPOTHESIS.
  11. Bagian "v2" `_NOTES.md` dipindah ke DECISION-LOG dan content.md tanpa mengubah isi.
  12. Naskah, VO, C1.tsx, npc.tsx, stepper.ts, sets.tsx, kode Ep 1–2, shot pilot tidak diubah. Penghapusan hanya file sementara sesi ini (`studio/out`, log di `qc/`).
- **USULAN / ASUMSI Claude (bukan keputusan pemilik):**
  - **Jam:** semua shot (pilot dan Ep 3) digambar pada jam global t = frame/30 (jam mix dan caption), bukan "awal rencana + frame lokal/30". Potongan jatuh di jumlah kumulatif `round(dur×30)` (0 s/d +1,4 frame sesudah waktu rencana). Dengan jam lokal, bunyi di S12–S15 akan terlambat 1,0–1,4 frame (mis. LED-4 f1416 vs cue f1414,8; getar 2 f1625 vs f1623,6). Akibat: shot pilot Blok B digambar 0,75 frame lebih lambat daripada render pilot v3 (fungsi sama, piksel tidak identik); nomor frame lama (sofa f67–69, kusen f4–16) tidak lagi sama satu-satu.
  - **Shot dipaksa per Sequence:** frame terakhir S11, S12, S13, S14, I15 (dan S15) jatuh di/sesudah akhir rencana. Tambahan aditif (default lama tetap): `stage55(t, force?)`, `PhoneUI004 hold`.
  - **Pilot tanpa penutup kusen D-057** (butir 9 "apa adanya" vs D-057 butir 1 "semua shot Ep 3"): pemindaian tidak menemukan kedip kusen di shot pilot.
  - **Caption:** L5 dan L10 tidak dicaption (aturan "msg" Ep 2: teks tampil di UI ponsel); warna toa `#ffe7a3` dari Ep 2; burst per kalimat dari jeda terukur di take VO (silencedetect −40 dB, 0,12 s) pada posisi file di mix; L4 dipecah sesudah "Diam" (jeda 0,54 s di take; ASUMSI bahwa burst pertama = "Diam"); L11 dipecah di koma; kata di dalam burst = bagi huruf (ASUMSI).
  - **Mux:** WAV v3 lewat `tools/finish_render.mjs` (AAC 128k), bukan m4a 192k (menghindari dua kali encode). `pix_fmt` = `yuvj420p`, sama dengan pilot v3.
- **Hasil Claude (content.md 2026-11-004 §25; `_media/2026-11-004/out/episode_preview_v1/`):**
  - **Gagal / tertahan (urut):**
    1. **Kerlip tepi set di S10.** Ukuran: % piksel yang berbalik arah ≥ 2 kali dalam 5 frame (≥ 10 tingkat luma). **Bukti set saja (render tanpa tokoh, `noChars`):** S10 0,23–0,31 % seluruh bingkai, **1,28 % di ROI bingkai lukisan** (sama dengan tokoh: 1,30 %). Pembanding: pilot v3 S02/S08 0,01 % seluruh bingkai (tokoh hampir diam), jadi batas atasnya di ROI seukuran ini ± 0,15 %. Angka seluruh bingkai dengan tokoh (S10 1,06 %, maks 1,29 %) **memuat gerak tokoh** (geser-rapat). Terbukti **bukan**: encoder (PNG tanpa kompresi 0,69 % = mp4 0,69 %), skala pratinjau (render 1080 0,75 %), status per-tab (concurrency 1 identik piksel), lampu tokoh. Kamera S10 monoton (0 pembalikan, ≤ 0,08 cm/f). Lokasi: tepi vertikal bingkai lukisan, bufet, kaki meja. Penyebab **UNKNOWN**; HYPOTHESIS: aliasing tekstur halus/tepi pada gerak kamera S10. **S13: kerlip set TIDAK terbukti** (tanpa tokoh 0,02–0,11 %, dengan tokoh 0,05–0,43 % di f89–97 lokal; 0,70 % yang terukur di f1585–1605 jatuh di dalam putar balik = gerak tokoh). Tidak diperbaiki. Keterlihatan pada kecepatan normal belum bisa saya nilai.
    1b. **Celah caption (perubahan satu frame di luar gerak):** f132 (4,400 s) kosong 1 frame di antara halaman L1 dan L2 (warisan: rentang pilot v3 sama); **f842–844 (28,07–28,13 s) kosong 3 frame** di tengah L6 (baru: halaman berakhir 28,043, berikutnya mulai 28,147). Celah ini terlihat sebagai lonjakan luma −3,16 di f132. USULAN (tidak dikerjakan): jembatani celah halaman < ± 0,15 s. Celah 7 frame di jeda "Diam" (L4, f431–437) dan di L7 (f989–995, warisan pilot) mengikuti jeda ucapan.
    2. **Sinkron > 1 frame (semua warisan atau rancangan, bukan dari perakitan):** kenop mulai berputar +2,50 f sesudah cue (pilot: putaran mulai 0,05 s sesudah bunyi); kilau layar S09 +2,25 f sesudah cue ketuk (pilot: kilau 0,05 s sesudah ketuk); kartu akhir 4 f sebelum Doom (rancangan d055: kartu 65,75, Doom 65,90). Tapak putar terakhir Uq (41,275 s) dan adik (41,285 s) jatuh di frame pertama S11 (f1239): bunyinya ada, kakinya tidak terlihat.
    3. **Zona aman (indikasi, koordinat 1080):** pita caption y 1264–1424 seluruhnya di zona bawah (≥ 1248); LED-3 (x 574–577, y 132 → 60) seluruhnya di zona atas dari klik sampai "Satu di lorong" selesai; kartu recap/akhir y 176–364: separuh atas (sampai 288) di zona atas, kartu kanan x 561–1013 melewati batas kanan 888; label HARI 1 (y ± 230–330) sebagian di zona atas; kepala UI (y ± 117–280) di zona atas, bingkai UI x 128–952 melewati 888, bawah UI 1260–1293 di zona bawah (bagian kosong); LED-2 x 863–891 menyentuh zona kanan di akhir S11. Aman: teks gelembung UI, wajah Uq saat tatap (675–688; 682–701), adik (409–420; 848–853).
    4. **Kontinuitas lintas S08a:** S07 akhir → S08 awal: ponsel Uq berpindah 35,4 cm / 112°, tangan kiri 34,9 cm, kepala Uq 12°/26° → 0°/2°, kepala adik 38°/16° → 20°/−4° (S08 pilot memakai pose akhir Ep 2). Tertutup sisipan POV 1,5 s. HYPOTHESIS: terbaca "ponsel diturunkan saat layar padam"; pemilik menilai.
    5. **S05 f603–607 (20,10–20,23 s):** angkat ponsel di insert dekat mengubah gambar besar antarframe (risiko tersendat). Belum bisa saya nilai pada kecepatan normal.
  - **Lolos:** ffprobe 540×960, 30/1, 2076 frame, 69,200 s, H.264 High + AAC-LC 48 kHz stereo; sesudah encode −14,2 LUFS, true peak −1,9 dBTP, LRA 10,0 LU. Audio v3 = 3.321.600 sampel, bagian v2 identik bit, ekor 1600 sampel nol. Semua potongan langsung: selisih dunia 0,0 cm kecuali 1 frame gerak (S10→S11 adik 0,9 cm; I15→S15 kepala 3,9°/3,5° = gerak saling pandang). 11 dari 14 peristiwa visual + 16 tapak dalam ≤ 1 frame (LED-1..4 +0,75/+0,75/+0,35/+0,20 f; klik recap +0,50; getar 1 +0,90; getar 2 +0,40; kartu +0,50; gerendel +0,10; kenop tertahan/kembali +1,00). Catatan: waktu cue = awal file SFX di mix, bukan awal bunyi yang terdengar (onset di dalam file tidak diukur; tapak S10 = puncak butir). Teks layar vs naskah v1.0: **0 selisih** (L5, L10, kartu recap, kartu akhir, label, 11 caption; nama film tidak ada). **Kusen S12 (penilaian ulang kriteria (b), `qc/angka_kusen_S12_pratinjau.txt`):** ROI D-057 di pratinjau, frame global f1413–1425 / f1454–1464 (= lokal lama f4–16 / f45–55 di jam baru): sisi dalam kusen |dY| 0,20 / 0,21, ambang 0,27, maks 4, **0,00 % piksel bolak-balik**; dinding datar 0,49 (tepi masuk ROI, maks 30) / 0,04, dinding kamar 0,09 / 0,08. Kusen ≤ dinding datar di jendela 1, sedikit di atas di jendela 2; tidak ada pola bolak-balik. Contact sheet: 17 shot, tanpa frame kosong.
  - **Durasi:** 69,20 s (target 65–70 s; rencana d055 69,15 s, +0,05 s dari pembulatan per shot). Premis selesai L3 12,31 s = 17,8 % video (HYPOTHESIS: cukup cepat). Kartu akhir 65,75 s = 95,0 %, 3,45 s sebelum akhir (HYPOTHESIS).
- **Kode (aditif):** baru `studio/src/ep004/Episode004.tsx` (komposisi `Episode004`), `studio/tools/e004_episode_check.ts`, `e004_text_diff.py`, `e004_flicker_scan.py`, `e004_safezone_sheet.py`; `episode004Stage.ts` (`stage55` opsi `force`), `overlay004.tsx` (`PhoneUI004` opsi `hold`), `Root.tsx` (registrasi), `package.json` (`render:episode004preview`).
- **Audio:** `_media/2026-11-004/audio/episode/2026-11-004_episode_v3.wav` dan `.m4a` (AAC 192k); v2 tidak disentuh.
- **File dihapus (sesi ini sendiri, `studio/out`):** `d058tmp_png/`, `d058tmp_png1080/`, `d058tmp_png_c1/`, `d058tmp_png_nochar/`, `d058tmp_png_withchar/`, `d058tmp_altcrop.png`, `d058tmp_altmap_S10.png` (disalin dulu ke `qc/`), `d058tmp_cam.ts`, `d058tmp_cam.cjs`, `d058tmp_check.cjs`, `d058tmp_f1409.png`, `d058tmp_f1776.png`, `d058tmp_pair.png`, `d058tmp_seq.cjs`, `d058tmp_strings.json`, `d058tmp_render.log`, `episode004_preview_v1_picture.mp4` (gambar antara sebelum mux). Tidak ada file lain dihapus; tidak ada log `qc/` yang dihapus.
- **`_NOTES.md`:** bagian v2 disalin utuh ke Lampiran D-058-A dan content.md §25.10; file asli **tetap di tempat** (preseden D-055 butir 5).
- **Skill:** `video-production` (§2, §5, §9, §13, §14), `inkbeat-shorts` (flicker-and-determinism: uji per-tab, z-fighting, crawl; render-and-qa).

### Lampiran D-058-A — catatan sesi mix episode v2 (`_media/2026-11-004/audio/episode/_NOTES.md` bagian "v2", disalin tanpa perubahan)

````markdown
# v2 (2026-11-20): timing final d055 + langkah S10 dari gambar

Ditulis oleh sesi audio. Isi v1 di atas tidak diubah. Sesi ini tidak mengedit `DECISION-LOG`, `content.md`, `ROADMAP`, `studio/`, VO, naskah. Tidak ada commit, push, atau penghapusan. v1 tetap utuh.

## Keluaran v2

| File | Isi |
|---|---|
| `2026-11-004_episode_v2.wav` | 48 kHz stereo 16-bit, **3.320.000 sampel = 2075 frame @ 30 fps = 69,1667 s** |
| `2026-11-004_episode_v2.m4a` | AAC 192k dari WAV di atas, durasi sama (69,1667 s) |
| `..._v2_cues.txt` | 48 cue (v1: 40) |
| `..._v2_report.txt` | master, limiter per bagian, loudness diperluas, banding v1 |
| `work_v2/` | file antara (150 MB). `work/` v1 tidak disentuh. |

Skrip: `scripts/ep004_episode_audio_v2.py` (salinan; `ep004_episode_audio.py` tidak diubah). Perintah: `mix --name 2026-11-004_episode_v2`, lalu `measure --name 2026-11-004_episode_v2` (menambahkan ukuran diperluas ke report; dipakai karena `mix` pertama belum memuatnya, tanpa mix ulang). Mix ulang dari nol memakai `mix` saja dan sudah memuat ukuran itu.

## Yang berubah dari v1

1. **Timing d055** (`episode004-plan-d055.json`): N06/L11 mulai 61,80 s (file VO mulai 61,70), Doom 65,90 s. Kartu (65,75 s) tidak punya cue sendiri di v1 maupun v2. Semua event lain di d055 sama dengan draft (diperiksa otomatis). `measured` (awal ucapan VO) masih dari draft karena d055 tidak membawanya.
2. **Langkah S10 dari gambar** (tabel di bawah).
3. **Panjang** dipangkas ke 2075 frame. Fade-out 0,3 s di ujung dipertahankan.
4. Gain bed dan dengung toa dihitung pada cue ber-panjang v1, sehingga levelnya identik v1 (+3,9 dan -9,0 dB).
5. Yang lain (VO, level, limiter, gain master +7,50 dB, langit-langit -2,6 dB) tidak diubah.

**Bukti bagian yang tidak berubah:** premix v2 dibanding premix v1: selisih maks untuk t < 37,7 s = 0 (identik bit). Selisih hanya ada di 38,0-41,6 s (langkah S10) dan 60,9-68,3 s (N06, Doom, ujung). Cue sebelum insert I15 tidak berubah.

## Waktu tapak S10 yang dipakai (VERIFIED dari kode; belum ada render S10 final)

Waktu dihitung dari data kode gambar, bukan tebakan. Sumber: `studio/src/ep004/motion004.ts:336-337` memanggil `sideShuffle` (`shuffle004.ts`) dengan `S10C_PASS` (`motion004d055.ts`: 3 siklus per tokoh, body "pulse", walkEnd 2,8 s); adik berputar dengan `walkSteps` karena `PROPOSED.away = 0.10` (`motion004.ts:342-343`). Kaki mendarat pada `FootEvent.t1`, dan `stepper.movesAt` menanam kaki tepat di `t1` (terangkat 0,035 m di antaranya). Nilai diperoleh dengan menjalankan fungsi aslinya (`sideShuffle`, `turnInPlace`, `walkSteps`) lewat skrip esbuild sementara di scratchpad (`studio/` tidak ditulis), dan dicocokkan dengan rumus (assert di skrip). Log `angka_s10c_kaki_maks.txt` dan `angka_s10c_pilihan.txt` tidak memuat waktu tapak (hanya jarak antarkaki dan kegagalan sendi); keduanya hanya mengonfirmasi pilihan (c), 3/3 siklus, "pulse".

Waktu shot-lokal (S10 mulai 37,775 s di jam rencana); pola kaki R-L-R-L-R-L:

| Tapak | Uq (s) | adik (s) |
|---|---|---|
| Geser-rapat 1-6 | 0,613 / 1,047 / 1,480 / 1,913 / 2,347 / 2,780 | 0,605 / 1,030 / 1,455 / 1,880 / 2,305 / 2,730 |
| Putar ke lorong (2 tapak) | 3,13 / 3,50 | 3,16 / 3,51 |

Level aturan v1: Uq -24 dB, adik -28 dB (puncak); empat tapak putar 3 dB lebih pelan. Butir dari `Slow,_careful_footst_#1.mp3` (8 onset; tiap tokoh memakai butir berbeda pada langkah bernomor sama).

**Penyimpangan dari v1, mohon konfirmasi:**
- Tapak putar ke lorong: v1 punya 1 geseran per tokoh; kode gambar punya 2 gerakan kaki per tokoh (Uq putar di tempat, adik dua langkah). Saya pakai 2 per tokoh (4 cue). Mudah dikembalikan ke 1.
- Uq dan adik mendarat hampir bersamaan: selisih 8 ms sampai 50 ms pada enam tapak jalan (adik lebih dulu), 30 ms dan 10 ms pada tapak putar. v1 memberi adik +0,2 s. Hasilnya dua tapak hampir serentak; butirnya dibedakan. Belum didengar.
- Tapak adik terakhir (3,51 s shot-lokal = 41,285 s) jatuh 10 ms sesudah potongan ke S11 (41,275 s). Tetap dipasang pada jam rencana.
- Jam: gambar dirender per shot dengan `round(dur*30)` frame; episode utuh belum dirakit. Awal S10 dalam frame bisa bergeser < 1 frame (sampai 0,025 s) dari 37,775 s. Waktu cue memakai jam rencana, sama dengan cue lain.

## Frame

Rencana d055 hanya memuat total 69,15 s (tidak ada field frame): 69,15 x 30 = 2074,5. Dipakai **2075 frame = 69,1667 s** (`Math.round`, sama seperti `PILOT_FRAMES` di `pilot004Stage.ts`). Alternatif: 2074 frame (69,1333 s) bila dibulatkan ke bawah; 2076 frame (69,2000 s) bila frame per shot dibulatkan satu-satu (`E004_SHOTS` di `Root.tsx`). Yang merakit video harus memilih satu; audio lalu cukup dipangkas ulang (`atrim`). Keputusan ada di pemilik atau sesi perakitan.

## Angka v2 (VERIFIED, ffmpeg ebur128 + oversampling 4x)

| Ukuran | v2 WAV | v2 AAC 192k | v1 WAV | v1 AAC | Target |
|---|---:|---:|---:|---:|---|
| Integrated | -14,2 LUFS | -14,2 | -14,2 | -14,2 | -14 ± 0,5 |
| True peak | -1,9 dBTP | -1,9 | -1,9 | -2,0 | ≤ -1,5 |
| Momentary maks | -9,0 LUFS @ 3,6 s | -9,0 | -9,0 | -9,0 | tidak ada |
| Short-term maks | -12,3 LUFS @ 6,0 s | -12,3 | -12,3 | -12,3 | tidak ada |
| LRA | 9,9 LU | 9,9 | 8,8 | 8,8 | tidak ada |
| Puncak sampel pada 4x oversampling | -1,86 dBFS | -1,89 | -1,86 | -1,96 | |
| Sampel >= 0 dBFS (antar-sampel) | 0 | 0 | 0 | 0 | 0 |
| Sampel 16-bit skala penuh | 0 | | 0 | | 0 |

Gain master +7,50 dB, langit-langit -2,6 dB (dua iterasi gain, langit-langit tidak diturunkan). Semua target terpenuhi; tidak ada pelanggaran untuk dilaporkan.

Catatan:
- **LRA naik 8,8 → 9,9 LU.** Batas bawah LRA turun -22,1 → -23,3 LUFS, batas atas sama (-13,4). Dugaan yang cocok dengan angka (belum diuji terpisah): 0,8 s tambahan hanya-bed di sekitar insert I15 (59,2-61,2 s) menambah jendela short-term yang pelan. Tidak ada target LRA.
- Momentary maks -9,0 LUFS di 3,6 s (L1-L3), sama dengan v1; 5,2 LU di atas integrated.
- ebur128 melaporkan integrated satu desimal; v1 menulis dua desimal dari pembacaan yang sama.

## Limiter (penekanan, jendela 5 ms, latensi dikoreksi)

| Bagian | v1 maks | v2 maks (di detik) | v2 total > 1 dB |
|---|---:|---:|---:|
| Seluruh episode | 8,4 dB | 8,4 (21,66) | 2,78 s (v1 2,75) |
| **Awal L5 (N02)** | 8,4 | **8,4 (21,66)** | 0,49 s (sama) |
| **Bisikan D01** | 5,8 | **5,8 (33,41)** | 0,05 s (sama) |
| **L8a/b/c** | 7,2 | **7,2 (47,85)** | 0,61 s (sama) |
| L1-L3, L4, L6, L9, L10 | | sama dengan v1 | |
| N06 pertanyaan | 4,4 | 4,8 (61,85) | 0,36 s (v1 0,33) |
| Doom + kartu | 0,4 | 0,6 (65,92) | 0,00 s |
| S10 langkah mundur | 0,0 | 0,0 (39,21) | 0,00 s |

N06 dan Doom naik 0,4 dan 0,2 dB. Terukur: puncak premix di awal L11 adalah -2,18 dBFS di v2 dan -2,62 dBFS di v1 (selisih 0,44 dB). VO sama; selisihnya ada pada bed noise yang dijumlahkan di posisi waktu berbeda (selisih sampel maks 0,099, sebanding dengan puncak bed). Tidak melewati batas apa pun dan jauh di bawah awal L5.

## Yang tidak bisa saya nilai (tidak bisa mendengar)

1. **Langkah S10 baru belum didengar siapa pun.** Tidak dinilai: apakah ritme (satu tapak tiap ± 0,43 s per tokoh, hampir serentak antar tokoh) terdengar seperti geser-rapat atau seperti berlari; apakah dua tokoh yang hampir serentak terbedakan; apakah butir tapak (sumber Ep 2/3) cocok dengan lantai di gambar; apakah tapak putar tambahan terlalu banyak.
2. Sinkron nyata dengan gambar: tidak ada render S10 final untuk dibandingkan; hanya terhitung dari kode.
3. Seperti v1: kejelasan bisikan D01, keseimbangan VO vs bed, sambungan bed, isi VO (tidak ada transkripsi). Pemilik sudah mendengar v1 (termasuk awal L5) dan menerimanya; v2 tidak mengubahnya sebelum 37,7 s (bukti di atas). Bagian 61-69 s (N06 dan Doom pada posisi baru) belum didengar.
4. Insert I15 (59,2-61,2 s, 2,0 s) tidak punya cue baru: hanya bed dan dengung. Apakah 2 s itu terasa kosong atau pas, tidak dinilai.

## Belum dilakukan / di luar tugas

- Mux ke video, perubahan `studio/`, `DECISION-LOG`, `content.md`, `ROADMAP`, commit, push.
- `work/` (v1) dan `work_v2/` tidak dibersihkan.
````

## D-059

**Episode 3: pratinjau v3 disetujui pemilik, render FINAL 1080×1920**

- **Tanggal:** 2026-11-22
- **Status:** render final selesai dan diperiksa teknis. Episode tetap `scripted`, `approved-by-owner: false`, `published-urls: []`. Pemilik mengunggah sendiri; tanpa upload, commit, push oleh Claude.
- **KEPUTUSAN PEMILIK (arahan tertulis):**
  1. Kartu recap dan kartu akhir Ep 3 direvisi (khusus Ep 3, rujukan `refrences/card.jpg`): pasangan terpusat di x = 540, huruf A/B di tengah atas tiap kartu, teks/urutan/timing/animasi klik tidak berubah. Celah caption L6 (f842–844) diisi, f132 dibiarkan. Penyesuaian awal kartu (turun ± 70 px, skala 0,88) diganti oleh `CardsAB`.
  2. LED-3 dan diagnosis kerlip S10 **ditunda** sampai pemilik menonton di ponsel.
  3. Pratinjau v3 **disetujui**; render final dengan mix audio yang sama.
- **HASIL CLAUDE (VERIFIED):** `_media/2026-11-004/out/final_v1/episode_2026-11-004_final_v1.mp4`, 1080×1920, 30 fps, 2076 frame, 69,200 s, AAC 48 kHz stereo, −14,2 LUFS, −1,9 dBFS, md5 `ef2838bc242a1009c7ebd23f34a183b3`. Kartu terpusat (margin 165/165) dan A/B terbaca di MP4 final. Rincian: content.md 2026-11-004 §25.11 dan §26.
- **USULAN Claude (keputusan di pemilik):** (a) `CardsAB` dibuat di `Episode004.tsx` (bukan di kode Ep 1–2) karena `CardsEp1` tidak punya label; (b) skala ×0,80 dari kartu Ep 1/2 supaya terpusat dengan teks ≥ 43 px; akibatnya tepi kanan 28–44 px masuk zona kanan konservatif (indikasi pihak ketiga, bukan dokumentasi resmi).
- **Terbuka (tidak diubah):** kerlip tepi S10, LED-3 di zona atas, caption bawah di zona bawah, caption kosong f132, sinkron warisan pilot (kenop +2,5 f, kilau S09 +2,25 f), ponsel S07→S08, S05 angkat ponsel, opsi B cahaya layar S07, kartu ± 10–25 px dari kepala Uq.
- **Batas:** pilot, mix, kode Ep 1–2, `package.json` tidak diubah. Pratinjau v1, v2, v3 dipertahankan.

## D-060

**Episode 3 (2026-11-004): diunggah pemilik, status `published`, `approved-by-owner: true`**

- **Tanggal:** 2026-11-22
- **KEPUTUSAN PEMILIK (arahan tertulis):** video final `_media/2026-11-004/out/final_v1/episode_2026-11-004_final_v1.mp4` (D-059) sudah diunggah sendiri oleh pemilik; status ditandai `published` dan `approved-by-owner: true`.
- **UNKNOWN:** platform, URL, waktu tayang (belum diberikan; `published-urls` kosong, tidak diisi dugaan).
- **Dampak:** butir terbuka D-058/D-059 (kerlip tepi S10, LED-3, sinkron warisan, ponsel S07→S08, caption f132) menjadi catatan pembelajaran untuk Ep 4, bukan perbaikan Ep 3, kecuali pemilik menginstruksikan lain.
- **Berikutnya:** ID YouTube ke `daily_fetch.ps1`, snapshot analytics, suara A/B dari komentar sesuai D-046/D-047. Tidak dikerjakan sekarang.

## D-061

**Episode 4 "Mereka Sudah Menunggu" (2026-11-005): cabang B, naskah v1.0, storyboard v0.1**

- **Tanggal:** 2026-11-23
- **Status:** keputusan pemilik **approved** (cabang B, naskah v1.0). Storyboard v0.1 = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-23).
- **Keputusan:**
  1. **Cabang Ep 4 = B "tutup kameranya"**, mengikuti suara komentar YouTube Ep 3 (B 16, A 3, ambigu 1; 53 akun non-pemilik; snapshot 2026-11-23 18:57 WIB, umur 42,6 jam; [[05-DATA/analytics/2026-11-004/suara-ab_20261123T1157Z]]). Ambang D-047 butir 2 terpenuhi (19 suara jelas, unggul 13).
  2. **Naskah draf v0.2 disetujui sebagai v1.0:** dialog, urutan empat beat, dan kartu A "temui satpam sekarang" / B "minta bukti dulu" dikunci. Kedua cabang Ep 5 menyatu saat Uq menerima kunci (D-045 butir 3). Penutup Ep 5 (Uq masuk ruang toa, bicara dengan suaranya sendiri, tamat tanpa kartu) tidak berubah.
  3. **Content Unit baru:** [[04-PRODUCTION/2026-11-005/content|2026-11-005]], `status: scripted`, `approved-by-owner: false`.
- **Hasil cek storyboard (Claude, VERIFIED dari kode dan frame; rincian di content.md 2026-11-005 §5):**
  - Menutup lensa dari sofa **tidak mungkin**: kamera ruang tamu (0,90; 2,62; 2,90) ± 4,8 m dari sofa; jangkauan Uq ± 2,1 m dari dudukan, ± 2,5 m dari sandaran. Alternatif tunggal untuk ditinjau: Uq **melempar** jaket dari titik (−0,5; 2,1), dua shot (S01 wide, S02 insert).
  - Pintu kamar mandi di dinding timur dapur (x 1,0, z −4,0, lebar 0,8) **lolos** terhadap Ep 2 S04 final: 0 dari 21 titik pintu terlihat; dinding itu hanya terlihat sebagai sliver z −4,82…−5,00. Batas: kamera Ep 1 yang ditulis dengan ekspresi tidak diperiksa satu per satu.
- **Pertanyaan terbuka untuk pemilik:** lemparan jaket sebagai pengganti; jaket adik dilepas dan tetap di sudut langit-langit; istilah "satpam" vs "petugas keamanan"; jeda posisi ± 1,3 m dari akhir Ep 3; posisi pintu awal untuk look-dev (content.md 2026-11-005 §8).
- **Batas:** tidak ada VO, SFX, look-dev, pilot, render, commit, atau push. Ep 1–3 tidak diubah.

## D-062

**Episode 4 pembuka: solusi kipas ditinggalkan, uji selotip di ujung gagang (animatic v2)**

- **Tanggal:** 2026-11-23
- **Status:** keputusan pemilik **approved** (kipas ditinggalkan, uji selotip). Animatic v2 = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik, sesudah menonton animatic v1 (`_media/2026-11-005/out/animatic_open_v1/`).
- **Alasan kipas ditinggalkan (pengamatan pemilik, dikonfirmasi angka):**
  1. Gerak Uq dan adik kaku.
  2. Uq menembus pintu kamar: daun pintu terbuka 1,35 rad dari (1,0; 0,69) ke (0,14; 0,50) memotong jalur kipas ke sudut; cek v1 tidak memuat daun pintu.
  3. Adik menembus sofa/meja: jalur lurus ke sofa melewati meja kopi; cek v1 hanya membandingkan pusat badan dengan tepi depan sofa.
  4. Penutup CCTV tampil sebagai bidang hitam besar (kain statis 0,34 × 0,40 m).
  5. Kipas butuh ganti pegangan, lengan 16,8 °/frame (batas 11,1), dan ± 5 s persiapan.
- **Uji baru:** Uq menempelkan selotip buram kecil (2,2 × 1,8 cm) ke lensa memakai gagang 1,5 m; gagang ditarik, selotip tertinggal, LED-1 tetap terlihat. Gagang bersandar di dinding ruang tamu sisi kamar (x 0,94, z 2,45), tempat yang tidak pernah terlihat di frame final Ep 2–3 (Ep 1 belum dicek). Persiapan disembunyikan potongan antar-shot.
- **Hasil (rincian: [[03-KNOWLEDGE/lessons/2026-11-23-animatic-buka-ep4-selotip]]):** tidak ada badan/lengan/kaki yang masuk ke sofa, meja, daun pintu, atau dinding; kaki tidak menyilang; lensa tertutup terlihat 4,22 s, teks toa 4,35 s, total 6,5 s. Kelemahan terbesar: selotip di ujung gagang hampir tidak terbaca sebelum ditekan.
- **Batas:** belum ada VO, audio, storyboard terkunci, commit, atau push. Gagang dan selotip adalah aset baru.

## D-063

**Episode 4: pratinjau penuh disetujui, render final; pemeriksaan Ep 4 menjadi bagian alur Ep 5**

- **Tanggal:** 2026-11-24
- **Status:** keputusan pemilik **approved** (pratinjau penuh Ep 4, render final, pemeriksaan untuk Ep 5). Final Ep 4 = **pending** unggahan dan persetujuan pemilik.
- **Diputuskan oleh:** pemilik, sesudah menonton pratinjau `episode_preview_v1`.
- **Dilakukan Claude:** final `_media/2026-11-005/out/final_v1/episode_2026-11-005_final_v1.mp4` (1080×1920, 58,90 s, −14,2 LUFS), audio sama dengan pratinjau ([[04-PRODUCTION/2026-11-005/content]] §14). Cek gerak umum `studio/tools/motion_check_lib.ts` (laporan per shot dan waktu, kode keluar 1 bila gagal), driver Ep 4 `e005_check.ts`. Pelajaran [[03-KNOWLEDGE/lessons/2026-11-24-cek-gerak-ep4-untuk-ep5]]; checklist produksi Ep 5 di [[04-PRODUCTION/2026-11-006/content]] (stub, tanpa cerita).
- **Aturan untuk Ep 5 (dari pemilik):** final Ep 4 = acuan audio toa dan caption ([[03-KNOWLEDGE/lessons/2026-11-23-audio-toa-caption-ep4-pilot-v2-v3]]); cek gerak dijalankan sebelum tiap render (P2, P9); keluwesan dan keterbacaan aksi dinilai pemilik pada putar normal (P5, P10).
- **Batas:** bunyi belum didengar Claude; tidak ada commit atau push.

## D-064

**Episode 5 (2026-11-006): beat bagian bersama disetujui, dua koreksi; pembuka A/B terbuka**

- **Tanggal:** 2026-11-24
- **Status:** keputusan pemilik **approved** (beat bagian bersama). **Bukan** persetujuan naskah final, storyboard, VO, atau video. `approved-by-owner` Ep 5 tetap `false`.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-24), atas usulan beat Claude.
- **Keputusan:**
  1. **Beat bagian bersama disetujui** dari Uq menerima kunci sampai TAMAT: kunci, gang, pintu ruang toa, layar pemantau, narator = toa, Uq memutar sakelar ke mikrofon, "Ini Uq, rumah nomor tujuh. Kami bukan tontonan.", tatapan ke kamera meja ± 2 s, Uq meraih kamera, gambar dan suara putus, TAMAT tanpa kartu. Tersimpan di [[04-PRODUCTION/2026-11-006/content]] (± 44 s; dengan pembuka ± 54-58 s, HYPOTHESIS).
  2. **Koreksi 1 (layar pemantau):** kanal ruang tamu menampilkan gambar gelap karena lensa masih tertutup selotip; kamar mandi tidak punya kanal kamera; kanal lain dan kamera meja tetap mendukung pengungkapan bahwa mereka ditonton.
  3. **Koreksi 2 (beat 7-8):** saat "Ini Uq, rumah nomor tujuh" tampil warga yang mendengar toa; kembali ke wajah Uq sebelum "Kami bukan tontonan."; lalu tatap lurus ke lensa kamera meja ± 2 s (tajam, tenang, sedikit terluka), Uq meraih kamera, gambar dan suara putus, TAMAT.
  4. **Tatapan = kelanjutan Ep 3:** dulu Uq baru sadar ia diawasi; kini ia sengaja membalas tatapan dan memilih kapan penonton berhenti melihatnya (D-045 butir 4: penutup tertutup, tanpa kartu).
  5. **Pembuka A/B tetap terbuka** sampai voting Ep 4 dihitung ulang (snapshot ≥ 24 j, setelah 2026-11-25 00:22 WIB; sementara B 15 : A 0 pada umur 14,8 j, [[05-DATA/analytics/2026-11-24-laporan-awal-momentum-tempo-ep1-4]]).
- **Terbuka:** reaksi warga selain mendengar toa, dan apakah mereka bubar (storyboard); cek P1-P2 untuk set baru, tangan satpam, gerak mulut dan alis Uq, arah pupil ke kamera meja.
- **Batas:** tanpa naskah final, storyboard, VO, look-dev, render, commit, atau push.

## D-065

**Episode 5 (2026-11-006): cabang B "minta bukti dulu"; produksi dimulai sebelum snapshot 24 jam**

- **Tanggal:** 2026-11-24
- **Status:** keputusan pemilik **approved** (cabang B, mulai produksi hari ini). Naskah draf v0.1, storyboard v0.1, dan paket VO = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-24).
- **Dasar pemilihan cabang:**
  1. Voting komentar YouTube Ep 4 (`paxmxqBR1_U`), snapshot 2026-11-24 15:12 WIB, umur video 14,8 jam: **B "minta bukti dulu" 15, A "temui satpam sekarang" 0, ambigu 0**, 9 akun bukan suara (24 akun, tanpa komentar pemilik). Hitung manual satu akun satu suara ([[05-DATA/analytics/2026-11-24-laporan-awal-momentum-tempo-ep1-4]] §8.5; data `05-DATA/analytics/2026-11-005/comments_20261124T0812Z.json`).
  2. Ambang D-047 (≥ 5 suara jelas dan unggul ≥ 2) terpenuhi, tetapi **aturan snapshot ≥ 24 jam (D-046/D-047) belum terpenuhi**. Pemilik memutuskan mulai produksi hari ini dengan hasil sementara.
  3. Hitung ulang sesudah 2026-11-25 00:22 WIB hanya sebagai **konfirmasi** dan dicatat. Bila hasilnya berbalik, pemilik yang memutuskan langkah berikutnya; tidak ada perubahan otomatis.
- **Batas:** belum ada VO, look-dev, pilot, render, commit, atau push. Kalimat bagian bersama mengikuti D-064 kata per kata.

## D-066

**Episode 5 (2026-11-006): lima keputusan storyboard v0.1; animatic penutup v0**

- **Tanggal:** 2026-11-24
- **Status:** keputusan pemilik **approved** (lima butir di bawah). Animatic penutup v0 = **pending** tinjauan pemilik.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-24), atas storyboard v0.1 ([[04-PRODUCTION/2026-11-006/content]] §2.6).
- **Keputusan:**
  1. Suara Uq (U01, U02) = Dhani, pembawaan berbeda (napas, bergetar, dekat mikrofon).
  2. Ruang toa di belakang rumah tetangga timur (x 9), utara gang (R2), bukan di pangkal tiang (pangkal tiang terlihat kosong di Ep 1 A01).
  3. Kamera tatap mulai ± 0,70 m dari mata Uq; Uq maju satu langkah sebelum meraih kamera.
  4. Bukti satpam = foto kunci di depan pintu belakang + satu pesan, tanpa ketukan.
  5. Alis Uq turun sedikit saat tatapan (`brows: "lowered"`, opsi tambahan di `studio/src/c1/C1.tsx`; tampilan lama tidak berubah).
- **Dilakukan Claude:** animatic penutup v0 hening, `_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0b.mp4` (6,40 s); cek angka `studio/tools/e006_close_check.ts` LOLOS. Rincian dan kelemahan: content.md §2.8.
- **Batas:** belum ada VO, look-dev, pilot, commit, atau push.

## D-067

**Episode 5 (2026-11-006): shot penutup v0f_glitch disetujui; TAMAT tidak lagi hening**

- **Tanggal:** 2026-11-24
- **Status:** keputusan pemilik **approved**, **khusus shot penutup** (gambar dan suara). Naskah, storyboard, dan bagian lain Ep 5 tidak berubah; `approved-by-owner` Ep 5 tetap `false`.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-24).
- **Acuan:** `_media/2026-11-006/out/animatic_close_v0/animatic_close_2026-11-006_v0f_glitch.mp4` (6,40 s; md5 `8af97c00642252d3143721b77110af6f`).
- **Keputusan:**
  1. v0f_glitch = acuan gambar dan suara shot penutup. Durasi tatapan, gerak tangan, waktu low hit (3,300 s) dan static saat kamera ditampar (putus 3,400 s) diikuti.
  2. **Menggantikan arahan lama "TAMAT hening"** (D-064 beat 9, storyboard S16, content.md §2.8–§2.9): 2,5 detik terakhir seluruh layar dan tulisan TAMAT mengalami glitch; static dan denging telinga tipis berlanjut sampai frame terakhir. Tanpa kartu pilihan (D-045 butir 4 tetap).
  3. Saat merakit episode penuh, awal tatapan diselaraskan dengan akhir VO asli U02 "Kami bukan tontonan."
- **Catatan Claude (bukan keputusan):** sumber render v0d–v0f tidak ada di repo (`studio/` dan `scripts/` hanya memuat sampai v0c); perlu ditemukan atau dibuat ulang sebelum perakitan. Bunyi belum didengar Claude.
- **Batas:** hanya pencatatan; tanpa render, commit, atau push.

## D-068

**Episode 5 (2026-11-006): N06 utuh + jeda keputusan; interaksi satpam, pintu belakang, gembok dibuat ulang (pratinjau v5)**

- **Tanggal:** 2026-11-24
- **Status:** arahan pemilik (revisi pratinjau v4 → v5). Pratinjau v5 = **menunggu tinjauan pemilik**; `approved-by-owner` Ep 5 tetap `false`.
- **Diputuskan oleh:** pemilik (arahan tertulis 2026-11-24, butir 1–5).
- **Keputusan:**
  1. **N06 tidak lagi dipotong** (mengganti D-064 beat 6 "terpotong di tengah suku kata" dan §3.3 lama): take asli diputar sampai "memilih" jelas, lalu ± 0,8 s jeda (tetap pada Uq; kepala dan matanya ke sakelar), baru klik OTOMATIS → MIKROFON. Caption dan kotak teks: "Kamu akan memilih…". Relasi akhir U02 → tatapan → penutup (D-067) tetap.
  2. Serah-terima kunci, adik melewati pintu belakang, dan gembok harus masuk akal pada kecepatan normal (keadaan sebelum disentuh, jalur dan kontak saat disentuh, perubahan sesudahnya).
  3. Pelajaran masuk ke alat dan checklist yang dipakai (cek gerak + aturan interaksi; checklist P11).
- **Cara Claude memenuhinya (USULAN, dinilai pemilik di v5):** Uq membuka pintu belakang sendiri ke 0,45 rad; satpam tubuh utuh di gang (bahu di luar, lengan kiri masuk lewat celah dengan siku menekuk); kunci pindah ke telapak Uq pada satu frame tanpa lompat; Uq mendorong daun (condong) lalu daun berayun melambat ke ± 1,75 rad; adik lewat ambang dengan lebar bebas > 0,8 m, kamera di gang menghadap pintu; gembok kuningan 40 mm dengan kupingan dan tali pengait, lubang kunci di muka, urutan masuk–putar–lengkung lepas–keluar dari kupingan–masuk saku–pengait dibalik–pintu didorong. Rak sakelar diturunkan 1,0 → 0,85 m (jangkauan lengan C1).
- **Bukti:** `_media/2026-11-006/out/episode_preview_v5/qc/interaction_check_v4.txt` (cek baru pada v4: GAGAL 13, termasuk ketiga kasus pemilik) dan `interaction_check_v5.txt` (LOLOS). Pelajaran: [[03-KNOWLEDGE/lessons/2026-11-24-logika-interaksi-ep5-v5]].
- **Batas:** tanpa render final, upload, commit, atau push.

