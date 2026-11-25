---
type: architecture
status: approved
version: 1.7
created: 2026-11-13
updated: 2026-11-15
owner-approval: 2026-11-13
related: "[[DECISION-LOG]], [[ROADMAP]]"
---

# Arsitektur AI Content Factory

> Dokumen ini menjelaskan **bagaimana sistem disusun**. Aturan kerja, prinsip, dan pipeline produksi ada di `CLAUDE.md`, yang merupakan **satu-satunya sumber aturan utama**. Dokumen ini tidak mengulang isi `CLAUDE.md`; jika ada pertentangan, lihat bagian 15.

---

## 1. Ringkasan

AI Content Factory adalah sistem produksi video pendek berbahasa Indonesia untuk TikTok, Instagram Reels, dan YouTube Shorts. Sistem ini dibangun bertahap: **fondasi dulu, lalu satu video uji end-to-end, baru kemudian publikasi dan otomasi** — semuanya berdasarkan bukti dari eksperimen nyata.

## 2. Batasan proyek (keputusan pemilik)

| Aspek | Ketentuan | Keputusan |
|---|---|---|
| Waktu kerja | ± 5 jam per minggu; dievaluasi setelah satu siklus produksi | [[DECISION-LOG#D-002]] |
| Channel | Satu akun **lab**; konten sama diuji di 3 platform, metadata boleh berbeda per platform | [[DECISION-LOG#D-003]] |
| Anggaran | **Rp0** pada tahap eksperimen; hanya tool gratis/open-source/free tier yang legal dan masih tersedia | [[DECISION-LOG#D-004]] |
| Perangkat | **Hanya satu laptop Windows** (i7-11800H, 32 GB RAM, RTX 3050 Ti Laptop GPU **4 GB VRAM — VERIFIED 2026-11-13**, lihat [[ENVIRONMENT]]). MacBook di luar cakupan proyek | [[DECISION-LOG#D-013]] |
| Version control | Git **lokal** di laptop Windows; tidak ada sinkronisasi antarperangkat; GitHub ditunda; kredensial tidak boleh masuk repo | [[DECISION-LOG#D-013]] |
| Bahasa konten | Bahasa Indonesia natural | `CLAUDE.md` §3 |
| Alat produksi pilot | **Claude Code** membuat seluruh video di `studio/` (Remotion + three.js, 3D toon ber-tinta): karakter, set, gerak, subtitle, render, QC. Layanan video AI lain perlu persetujuan | [[DECISION-LOG#D-021]], [[DECISION-LOG#D-022]] (riwayat: D-014, D-017) |
| Gaya akun lab | **3D toon ber-tinta**, keluarga stick figure (C1 revisi 1 = acuan) + set kartun; cerita what-if/dilema; detail di [[STUDIO-WORKFLOW]] | [[DECISION-LOG#D-021]] (menggantikan gaya 2D flat D-015) |

**Implikasi waktu 5 jam/minggu:** sistem harus ramping. Setiap komponen baru harus menghemat waktu produksi atau menghasilkan pembelajaran yang jelas. Target ritme awal (HIPOTESIS): ±1 video per minggu setelah Milestone 1 selesai.

## 3. Lima lapisan sistem

| Lapisan | Fungsi | Lokasi |
|---|---|---|
| 1. Aturan | Prinsip, aturan kerja, pipeline, protokol | `CLAUDE.md` |
| 2. Keahlian | Skill per tahap pipeline | `.claude/skills/<nama>/SKILL.md` |
| 3. Pengetahuan | Keputusan, riset, eksperimen, pelajaran, evaluasi tool, Channel DNA | Vault Obsidian (`00-CORE/`, `02-CHANNELS/`, `03-KNOWLEDGE/`) |
| 4. Produksi | Satu catatan per konten + script otomasi | `04-PRODUCTION/`, `scripts/` |
| 5. Data | Metrik performa | `05-DATA/metrics.csv` (SQLite hanya bila CSV tidak lagi memadai) |

## 4. Struktur folder target

```
ai_content_factory/                 # = vault Obsidian = repo Git
├── CLAUDE.md                       # satu-satunya sumber aturan
├── README.md                       # pintu masuk repo/vault (ringkas, merujuk ke 00-CORE)
├── .claude/skills/<skill>/SKILL.md # skill (aktif otomatis di Claude Code)
├── 00-CORE/
│   ├── ARCHITECTURE.md             # dokumen ini
│   ├── DECISION-LOG.md             # keputusan + tanggal + alasan
│   ├── ROADMAP.md                  # milestone & tugas
│   └── PROJECT-IDENTITY.md         # (dibuat di Milestone 0)
├── 02-CHANNELS/
│   ├── _template/CHANNEL-DNA.md
│   └── lab/CHANNEL-DNA.md          # identitas minimal akun lab (draft)
├── 03-KNOWLEDGE/
│   ├── research/                   # temuan tren, berlabel VERIFIED/OBSERVATION/HYPOTHESIS/UNKNOWN
│   ├── experiments/                # hipotesis → hasil → kesimpulan
│   ├── lessons/                    # pelajaran lintas eksperimen
│   └── tools/                      # evaluasi tool + tanggal cek harga/lisensi + ENVIRONMENT.md
├── 04-PRODUCTION/<content-id>/content.md
├── 05-DATA/metrics.csv
├── studio/                         # JALUR AKTIF: proyek Remotion + three.js (3D); node_modules/, out/, build/ tidak masuk Git
├── scripts/                        # alat Python (VO preview, ElevenLabs, prep animatic)
├── templates/                      # template catatan Obsidian
├── refrences/                      # referensi pemilik: gambar desain, handoff, video referensi gaya (mp4 tidak di Git)
└── _media/                         # aset berat (gambar, audio, video) — TIDAK masuk Git
```

Catatan:
- Nomor `01-` tidak dipakai karena skill berada di `.claude/skills/` (lihat bagian 6). Penomoran lain dipertahankan agar konsisten dengan `CLAUDE.md`.
- Folder `.claude/` disembunyikan oleh Obsidian. Skill diedit lewat Claude Code atau editor teks.
- `_media/<content-id>/` berpasangan dengan `04-PRODUCTION/<content-id>/`. Aset final yang penting dicadangkan terpisah dari Git (mekanisme ditentukan nanti bila diperlukan).

## 5. Content Unit

Setiap video adalah satu **Content Unit** dengan ID `YYYY-MM-NNN` (contoh `2026-11-001`) dan **satu catatan utama** `04-PRODUCTION/<id>/content.md`. Ide, naskah, storyboard, prompt, hasil QC, metadata publikasi, dan ringkasan performa berada di satu catatan ini, sehingga tidak ada duplikasi.

Siklus status (frontmatter `status`):

```
idea → scripted → storyboarded → assets-ready → rendered → qc-passed → approved → published → analyzed
                                                                    ↘ rejected / parked
```

Contoh frontmatter:

```yaml
---
id: 2026-11-001
status: idea
channel: lab
category: interesting-facts
experiment: "[[EXP-001]]"
created: 2026-11-13
approved-by-owner: false
platforms: [tiktok, reels, shorts]
---
```

Aturan:
- Status `approved` dan `published` **hanya** diubah atas persetujuan pemilik.
- `rendered` ≠ `qc-passed` (sesuai `CLAUDE.md` §6 Stage 8).
- Metrik mentah disimpan di `05-DATA/metrics.csv`; `content.md` hanya memuat ringkasan dan tautan.

## 6. Arsitektur skill

**Lokasi:** `.claude/skills/<nama>/SKILL.md` agar dimuat otomatis oleh Claude Code ([[DECISION-LOG#D-007]]).

**Format:** setiap skill memuat 11 bagian: Purpose, Context, Responsibilities, Required inputs, Execution workflow, Decision-making rules, Quality standards, Constraints, Output format, Failure handling, Knowledge update procedures. Skill ditulis dalam bahasa Inggris (instruksi teknis); output untuk pemilik dalam bahasa Indonesia.

**Aturan pengembangan** ([[DECISION-LOG#D-008]]):
1. Skill **tidak** ditulis sebelum tahap pipeline-nya dijalankan secara nyata minimal sekali.
2. Versi pertama = `v0.1`, ditulis dari pengalaman Milestone 1, bukan dari teori.
3. Skill dinaikkan ke `v1.0` setelah dipakai ± 3 kali dan pelajarannya dicatat.
4. Skill saling terhubung melalui Content Unit: output satu skill = input skill berikutnya (lewat `content.md`).
5. Skill baru atau pemecahan skill harus dicatat di [[DECISION-LOG]].

**Urutan pengembangan:**

| # | Skill | Ditulis setelah |
|---|---|---|
| 1 | `trend-research` | Siklus riset pertama (M1) |
| 2 | `content-strategy` (scoring + pengembangan ide) | Pemilihan ide pertama (M1) |
| 3 | `scriptwriting` | Naskah pertama disetujui (M1) |
| 4 | `storyboard-and-prompts` (digabung dulu) | Storyboard + aset pertama (M1) |
| 5 | `video-production` | Render pertama berhasil (M1) |
| 6 | `quality-control` | QC pertama (M1) |
| 7 | `publishing-prep` | Publikasi pertama (M2) |
| 8 | `performance-analytics` | Data performa pertama tersedia (M2) |
| 9 | `channel-dna-builder` | Ada bukti arah channel (M3+) |

**Skill pihak ketiga (vendor)** ([[DECISION-LOG#D-024]], menunggu persetujuan pemilik): skill teknik dari GitHub dipakai sebagai **lapisan referensi** di bawah skill buatan proyek, bukan sebagai skill proyek. Mereka dikecualikan dari format 11 bagian di atas dan dari aturan D-008, karena tidak ditulis dari pengalaman pipeline kita. Isinya tidak diubah (byte-identik dengan commit yang dipin) supaya bisa di-update. Urutan prioritas: `CLAUDE.md` → `video-production` → `remotion-*` → `threejs-*`; override wajib ada di `video-production` §8–§10. Daftar skill, commit SHA, lisensi, hasil review, dan cara update: `.claude/skills/VENDOR.md`. Skill yang lisensinya tidak jelas dipasang di level user (`~/.claude/skills/`, di luar Git), tidak di repo.

## 7. Strategi produksi sesuai hardware & anggaran

### 7.1 Satu perangkat

Semua pekerjaan dilakukan di **satu laptop Windows** ([[DECISION-LOG#D-013]]): pengembangan, riset, Obsidian, Claude Chat/Code, otomasi, generasi aset lokal (bila GPU memadai), render FFmpeg, QC, dan Git.

Implikasi desain: tidak perlu memikirkan kompatibilitas lintas OS, path Mac, atau sinkronisasi. Sumber daya yang paling membatasi adalah **VRAM 4 GB**; RAM 32 GB dan CPU 8 core cukup longgar untuk render dan model CPU kecil–menengah (HYPOTHESIS, diuji di M1).

### 7.2 Status verifikasi GPU

- VERIFIED (2026-11-13, `nvidia-smi`): NVIDIA GeForce RTX 3050 Ti **Laptop** GPU, VRAM 4096 MiB, driver 621.14. Detail di [[ENVIRONMENT]].
- Kelayakan generasi gambar lokal dengan 4 GB VRAM **belum diuji nyata** (HYPOTHESIS).

### 7.4 Kandidat tool (SEMUA berstatus UNKNOWN sampai dievaluasi)

Tidak ada tool yang dianggap gratis atau layak sebelum dicek harga, batasan, dan lisensinya pada tanggal penggunaan. Hasil evaluasi disimpan di `03-KNOWLEDGE/tools/`.

| Kebutuhan | Arah kandidat                                                                     | Hal yang wajib dicek |
|---|---|---|
| Voice-over Indonesia |  TTS open source lokal; layanan TTS dengan free tier                              | Kualitas suara Indonesia, lisensi penggunaan komersial, ketentuan layanan |
| Subtitle otomatis | Model speech-to-text open source lokal (keluarga Whisper)                         | Akurasi Bahasa Indonesia, kebutuhan VRAM/CPU |
| Musik & SFX | **Dibuat sendiri secara prosedural** (D-029); pustaka berlisensi hanya bila perlu | Kualitas dinilai pemilik; tanpa sampel pihak ketiga |
| Editing/render | Python + FFmpeg                                                                   | FFmpeg 9.0.2 terpasang (2026-11-14); skrip render diuji di M1-08 |

Kriteria pemilihan mengikuti `CLAUDE.md` §13, dengan tambahan: **utamakan lisensi yang mengizinkan penggunaan komersial**, agar tidak perlu mengganti tool bila channel kelak dimonetisasi.

### 7.5 Konsekuensi Claude subscription

Langganan Claude tidak otomatis memberi kredit API (`CLAUDE.md` §3). Karena itu, langkah kreatif (riset, naskah, storyboard, prompt) dikerjakan Claude **di dalam sesi** Claude Chat/Code. Script Python hanya mengerjakan langkah mekanis (render, subtitle, pengecekan teknis, pengelolaan file) dan **tidak** memanggil API berbayar.

### 7.6 Workflow produksi pilot — jalur aktif 3D (D-021, D-022)

```
Ide ─🔒─► Naskah ─🔒─► Storyboard teknis ─► plan JSON (teks, timing, shot, beat) ─► komposisi Remotion di studio/
─► still kunci + cek numerik gerak ─► rough cut (timing sementara) ─► voice-over 🔒 ─► timing dari audio nyata ─►
render pilot ─► QC ─🔒
```

- Langkah dan perintah yang **sudah teruji**: skill `video-production` (v0.2). Render tidak pernah menimpa berkas yang sudah ada (`tools/finish_render.mjs`).
- Belum teruji: penyelarasan ke audio nyata, QC final, publikasi.

## 8. Kolaborasi Claude Chat, Claude Code, dan Obsidian

| Komponen | Peran |
|---|---|
| Obsidian (vault) | Memori bersama proyek. Keputusan yang tidak tercatat di vault dianggap belum ada. |
| Claude Chat | Strategi, brainstorming, evaluasi ide, review naskah/hasil. Dapat membaca/menulis vault melalui koneksi Obsidian MCP selama aplikasi desktop dan Obsidian terbuka. |
| Claude Code | Mengelola file dan struktur, menulis/menjalankan script, render, pengecekan teknis, Git. |

**Protokol sesi** (sudah ada di `CLAUDE.md` §9, 2026-11-14):
1. **Awal sesi:** baca [[ROADMAP]] dan entri terbaru [[DECISION-LOG]]; jika mengerjakan konten, baca `content.md` terkait dan Channel DNA-nya.
2. **Selama sesi:** perubahan status konten ditulis di `content.md`.
3. **Akhir sesi:** catat keputusan baru di [[DECISION-LOG]], perbarui status tugas di [[ROADMAP]], catat pelajaran penting di `03-KNOWLEDGE/lessons/`.

## 9. Version control

- Vault = repository Git **lokal** di laptop Windows ([[DECISION-LOG#D-013]]). Tidak ada sinkronisasi antarperangkat.
- Alur: `git status` → periksa tidak ada file kredensial → `git commit` di akhir sesi kerja.
- Remote GitHub **ditunda**. Bila kelak diperlukan sebagai cadangan, dibuat lewat keputusan baru, dan verifikasi kredensial sebelum push pertama tetap wajib.
- Konfigurasi plugin Obsidian MCP (berisi token dan port lokal) tidak masuk Git.
- Aset berat di `_media/` tidak masuk Git. Cadangannya ditentukan bila diperlukan.

## 10. Keamanan & kredensial

Hasil inspeksi 2026-11-13 (OBSERVATION): token akses ditemukan di `.mcp.json`, `.obsidian/plugins/mcp-tools-istefox/data.json`, dan disebut di `diagnostic.log` plugin yang sama.

`.gitignore` wajib memuat minimal (diterapkan di M0-03, **sebelum** `git init` di-commit):

```
# Kredensial & konfigurasi lokal
.mcp.json
.env
.env.*
*.key
*.pem
credentials*
secrets*
.claude/settings.local.json
.obsidian/plugins/*/data.json
.obsidian/plugins/*/*.log
.obsidian/workspace*.json

# Aset berat & file sementara
_media/
*.mp4
*.mov
*.wav
*.mp3
__pycache__/
.venv/
```

Verifikasi wajib sebelum push pertama: periksa daftar file yang akan di-commit dan cari pola token/kunci. Jika kredensial pernah ter-commit, token harus **dibuat ulang** (menghapus dari riwayat Git saja tidak cukup).

## 11. Akun lab & publikasi

- Satu akun lab per platform; konten sama, metadata (caption, judul, hashtag) boleh disesuaikan per platform ([[DECISION-LOG#D-003]]).
- Identitas lab bersifat **minimal dan sementara**; Channel DNA permanen baru dibuat setelah ada bukti (`CLAUDE.md` §7).
- Publikasi dilakukan pemilik secara manual. Tidak ada auto-posting pada tahap ini.
- Aturan label konten AI di tiap platform harus diverifikasi dari sumber resmi sebelum publikasi pertama (M1-01).

## 12. Data & analitik

- Fase awal: metrik dicatat **manual** dari dashboard platform ke `05-DATA/metrics.csv`, dengan tanggal pengambilan.
- Kolom awal (usulan): `content_id, platform, url, published_at, captured_at, hours_since_publish, views, avg_watch_time_s, completion_rate, likes, comments, shares, saves, followers_gained, notes`.
- Metrik yang tidak tersedia di platform dibiarkan kosong, **tidak diperkirakan**.
- Otomasi pengambilan data hanya dipertimbangkan setelah akses API dan ketentuannya terverifikasi.
- **2026-11-17 (izin pemilik):** integrasi baca API dimulai dari YouTube: `scripts/analytics/`, rincian di [[youtube-analytics-api]]. Kredensial disimpan di luar repo (`%USERPROFILE%\.uq-story-analytics\`). Detail metrik disimpan di `05-DATA/analytics/api_snapshots.csv` (format panjang); skema `metrics.csv` tidak diubah. Tanpa jadwal latar. Snapshot manual tetap dipertahankan.

## 13. Risiko terbuka

| Risiko | Status | Mitigasi |
|---|---|---|
| VRAM GPU tidak cukup untuk generasi lokal | VRAM 4 GB VERIFIED; generasi gambar lokal tidak lagi dibutuhkan untuk pilot (D-014) | Relevan hanya untuk TTS/STT lokal bila dipilih |
| Lettering "Uq" tidak akurat atau berpindah sisi pada varian | HYPOTHESIS | Compositing tulisan konsisten pada torso; larangan flip karakter ([[DECISION-LOG#D-017]]) |
| FFmpeg di Windows | Terpasang: FFmpeg/ffprobe 9.0.2 VERIFIED (2026-11-14) | Risiko ditutup di M0-02; versi dicatat di [[ENVIRONMENT]] |
| Kualitas TTS Indonesia gratis kurang natural | UNKNOWN | Uji dengar beberapa kandidat di M1-02 |
| Free tier berubah/dihentikan | Risiko berkelanjutan | Catat tanggal cek; siapkan alternatif per kebutuhan |
| 5 jam/minggu terlalu sedikit | HYPOTHESIS | Catat waktu per tahap di M1; evaluasi setelah siklus pertama |
| Kebocoran kredensial ke Git/GitHub | Dikendalikan | `.gitignore` + scan nilai token sebelum commit; verifikasi ulang sebelum push pertama bila remote dibuat |
| Satu perangkat tanpa cadangan di luar laptop | Risiko diterima ([[DECISION-LOG#D-013]]) | Riwayat Git lokal; cadangan eksternal dipertimbangkan bila ada aset final penting |
| Klaim hak cipta musik/aset | Risiko | Hanya aset berlisensi jelas; dicatat di `content.md` |

## 14. Yang sengaja **belum** dibangun

- Delapan skill sekaligus.
- Database (SQLite), dashboard, atau scheduler.
- Auto-publishing dan pengambilan analitik otomatis.
- Channel kedua atau Channel DNA permanen.
- Rig karakter, animasi tubuh penuh, lip-sync, dan video AI (D-014).

Semua akan dipertimbangkan kembali berdasarkan bukti dari Milestone 1–2.

## 15. Hubungan dengan CLAUDE.md

- `CLAUDE.md` adalah sumber aturan utama. Dokumen ini hanya menjelaskan struktur dan implementasi.
- `CLAUDE.md` §3, §7, §8, §9 direvisi pada 2026-11-14 (M0-07, disetujui pemilik): struktur folder, lokasi skill, protokol sesi, dan penghapusan MacBook sudah selaras dengan dokumen ini. Tidak ada pertentangan yang diketahui.

## Riwayat dokumen

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 2026-11-13 | Arsitektur awal disetujui pemilik |
| 1.1 | 2026-11-13 | M0: hasil verifikasi GPU dicatat (§2, §7.2, §13); risiko FFmpeg ditambahkan; `README.md` ditambahkan ke §4; `.gitignore` aktual diperluas dari daftar minimal §10 (pola media, file sementara, dan `_media/*` + `!_media/.gitkeep`). Struktur dan keputusan tidak berubah. |
| 1.2 | 2026-11-13 | Cakupan disederhanakan ke satu laptop Windows (D-013): §2, §7.1, §9, §13 diperbarui; MacBook dan sinkronisasi dihapus dari cakupan. |
| 1.3 | 2026-11-14 | §15: pertentangan dengan `CLAUDE.md` dihapus setelah revisi M0-07; protokol sesi (§8) kini ada di `CLAUDE.md` §9. |
| 1.4 | 2026-11-14 | Jalur B (D-012) disetujui pemilik (§7.2); risiko FFmpeg ditutup (§13); tabel kandidat tool diperbarui (§7.4); urutan riwayat dirapikan. |
| 1.6 | 2026-11-15 | Perubahan jalur 2D (dihapus, D-029). |
| 1.5 | 2026-11-14 | D-014/D-015: §2 alat produksi dan gaya lab; §7.2–7.4 diperbarui (ChatGPT untuk gambar, video AI tidak dipakai, §7.3 menjadi riwayat); §7.6 workflow pilot baru; §13 risiko baru; §14 rig/lip-sync/video AI; §4 folder `refrences/`. |
| 1.7 | 2026-11-15 | D-021 approved + D-022: jalur aktif 3D di `studio/` (§2, §4, §7.6); workflow 2D jadi arsip (§7.6a). |
