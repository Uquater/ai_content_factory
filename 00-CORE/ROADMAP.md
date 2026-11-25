---
type: roadmap
created: 2026-11-13
updated: 2026-11-22
current-milestone: M1
current-status: berjalan
related: "[[ARCHITECTURE]], [[DECISION-LOG]]"
---

# Roadmap

Kapasitas: **±5 jam/minggu** ([[DECISION-LOG#D-002]]). Semua estimasi waktu adalah HYPOTHESIS dan dikoreksi berdasarkan catatan waktu aktual.

**Status tugas:** `[ ]` belum · `[~]` berjalan · `[x]` selesai dan terverifikasi · `[-]` dibatalkan (alasan dicatat)

**Aturan:**
- Tugas hanya ditandai `[x]` setelah hasilnya **diverifikasi**, tidak sekadar dijalankan.
- Tugas bertanda 🔒 memerlukan persetujuan pemilik sebelum dieksekusi.

## Ringkasan milestone

| Milestone | Tujuan | Estimasi | Status |
|---|---|---|---|
| M0 — Fondasi | Lingkungan terverifikasi, struktur, Git lokal aman, template | 1–2 sesi (± 3–5 jam) | selesai 2026-11-14 |
| M1 — Video uji pertama | Satu video end-to-end lolos QC; tool terverifikasi; skill v0.1 | ± 3–4 minggu | berjalan (M1-04: pemilihan ide pilot) |
| M2 — Publikasi & siklus belajar | Akun lab aktif, beberapa video dipublikasi, metrik pertama | ± 4 minggu | belum dimulai |
| M3+ — Diputuskan berdasarkan bukti | Kandidat: otomasi lanjutan, Channel DNA, channel kedua | — | belum direncanakan |

---

## M0 — Fondasi

**Tujuan:** fondasi yang aman dan terverifikasi, tanpa produksi konten.
**Dikerjakan di:** Claude Code di laptop Windows (satu-satunya perangkat proyek, [[DECISION-LOG#D-013]]), folder `C:\AI_CONTENT_FACTORY\ai_content_factory`.

### M0-01 — Verifikasi lingkungan Windows (termasuk GPU)
- [x] Jalankan dan catat hasilnya:
  - `nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv`
  - `nvidia-smi` (versi CUDA yang didukung driver)
  - `python --version`, `ffmpeg -version`, `git --version`, `winget --version`
  - RAM dan ruang disk kosong di drive C
- [-] Jika `nvidia-smi` gagal: (tidak diperlukan — `nvidia-smi` berhasil) periksa GPU lewat Device Manager/`dxdiag`, lalu catat sebagai temuan.
- [x] Simpan hasil di `03-KNOWLEDGE/tools/ENVIRONMENT.md` (dengan tanggal). Windows selesai 2026-11-13.
- [-] Spesifikasi Mac — dibatalkan: MacBook di luar cakupan ([[DECISION-LOG#D-013]]).
- [x] Usulkan jalur workflow A/B/C ([[ARCHITECTURE]] §7.3) berdasarkan hasil → [[DECISION-LOG#D-012]] (Jalur B, disetujui pemilik 2026-11-14). D-011 tetap `provisional`.
- **Verifikasi:** `ENVIRONMENT.md` berisi output nyata, bukan perkiraan. VRAM tercatat dengan status VERIFIED.

### M0-02 — Instalasi tool dasar yang belum ada 🔒
- [x] FFmpeg 9.0.2 dan ffprobe terverifikasi 2026-11-14 (Chocolatey, `Get-Command` → `C:\ProgramData\chocolatey\bin`).
- [x] Entri PATH usang (`IdlixDownloader`, 2 entri duplikat di User PATH) dihapus atas persetujuan pemilik, 2026-11-14 (User PATH 55 → 53 entri). Pemeriksaan read-only 2026-11-14 (sesi lanjutan): registry User PATH = 0 entri Idlix, Machine PATH = 0 entri. Proses Claude Code yang sudah berjalan masih memegang salinan PATH lama (2 entri) sampai di-restart; itu bukan keadaan registry.
- [x] (riwayat) Untuk setiap tool yang belum ada (Python 3.x, FFmpeg, Git) — per 2026-11-13 hanya **FFmpeg** yang belum ada, konfirmasi ID paketnya dengan `winget search <nama>`, lalu minta persetujuan pemilik sebelum instalasi. (2026-11-13: `winget search` berhenti karena source agreement belum disetujui di PC ini; `choco search ffmpeg --exact` → paket `ffmpeg` 9.0.2. PATH berisi entri FFmpeg lama yang foldernya sudah terhapus — hapus entri tersebut.)
- [x] Atur identitas Git (sudah diisi; diverifikasi 2026-11-13): `git config --global user.name` dan `user.email` (diisi pemilik).
- **Verifikasi:** perintah versi di M0-01 berhasil di terminal baru.

### M0-03 — `.gitignore` dan `.gitattributes` (SEBELUM commit pertama)
- [x] Buat `.gitignore` sesuai [[ARCHITECTURE]] §10. File `.gitignore` yang ada saat ini (berisi `.mcp.json`) **diperluas**, bukan diganti.
- [x] Buat `.gitattributes` berisi `* text=auto` agar akhir baris di repo konsisten.
- **Verifikasi:** setelah `git init`, `git status --ignored` menunjukkan `.mcp.json`, `data.json` plugin, file log plugin, dan `.claude/settings.local.json` sebagai *ignored*.

### M0-04 — Inisialisasi Git lokal & pemeriksaan kredensial
- [x] `git init` lalu `git add --dry-run .` untuk melihat daftar file yang akan masuk.
- [x] Pastikan tidak ada file kredensial di daftar tersebut (dicek 2026-11-13: tidak ada).
- [x] Setelah `git add`, cari pola kredensial (2026-11-13: 31 file staged cocok dengan daftar yang disetujui; tidak ada nilai token di blob staged): `git grep -nIiE "bearer|token|api[_-]?key|secret|password" -- .` lalu tinjau setiap hasil secara manual (hasil yang hanya berupa teks dokumentasi tidak masalah).
- [x] Commit pertama — disetujui pemilik; `53d26cf` (2026-11-13), 31 file. Catatan 2026-11-14: hash ini kini `c141e19` (lihat log perubahan di bawah); isi file identik.
- **Verifikasi:** `git ls-files` tidak memuat file kredensial.

### M0-05 — Struktur folder
- [x] Buat folder sesuai [[ARCHITECTURE]] §4. Folder yang masih kosong diberi `.gitkeep` agar ikut tersimpan di Git.
- [x] Jangan memindahkan atau menimpa file yang sudah ada.
- **Verifikasi:** struktur cocok dengan §4 dan tampil benar di Obsidian. (Struktur diverifikasi lewat script 2026-11-13; tampilan di Obsidian dicek manual oleh pemilik.)

### M0-06 — Template & dokumen dasar
- [x] `templates/content-unit.md` (frontmatter sesuai [[ARCHITECTURE]] §5)
- [x] `templates/research-note.md` (wajib: tanggal, sumber, label VERIFIED/OBSERVATION/HYPOTHESIS/UNKNOWN)
- [x] `templates/experiment.md` (hipotesis, variabel, metrik, hasil, kesimpulan)
- [x] `templates/tool-evaluation.md` (harga, batasan, lisensi, tanggal cek, sumber, hasil uji)
- [x] `02-CHANNELS/_template/CHANNEL-DNA.md` (elemen `CLAUDE.md` §7 — ternyata **7** elemen, bukan 9)
- [x] `02-CHANNELS/lab/CHANNEL-DNA.md`: draft minimal untuk akun lab. **Tidak** menetapkan identitas permanen ([[DECISION-LOG#D-003]]).
- [x] `00-CORE/PROJECT-IDENTITY.md`: ringkas, tanpa mengulang isi `CLAUDE.md`.
- [x] `05-DATA/metrics.csv` (header saja, sesuai [[ARCHITECTURE]] §12)
- **Verifikasi:** setiap template bisa dipakai untuk membuat satu catatan contoh tanpa perlu disunting strukturnya.

### M0-07 — Revisi `CLAUDE.md` 🔒
- [x] Siapkan **diff** untuk: §8 (struktur folder dan lokasi skill sesuai [[ARCHITECTURE]] §4 dan §6), §9 (protokol sesi dari [[ARCHITECTURE]] §8), serta rujukan ke [[ARCHITECTURE]], [[DECISION-LOG]], dan [[ROADMAP]].
- [x] Diff ditampilkan; pemilik menyetujui semua perubahan plus penghapusan MacBook di §3. Diterapkan 2026-11-14 (§3, §7, §8, §9). Cadangan: file `CLAUDE.md.bak` di scratchpad sesi.
- [x] **Verifikasi:** `grep` tidak menemukan `MacBook` atau pohon `01-SKILLS` di `CLAUDE.md`; catatan pertentangan di [[ARCHITECTURE]] §15 sudah diganti. Dikomit di `cf87ea3` (2026-11-14).

### M0-08 — GitHub privat & sinkronisasi Mac
- [-] Dibatalkan 2026-11-13: satu perangkat, tanpa sinkronisasi ([[DECISION-LOG#D-013]]). Remote GitHub sebagai cadangan ditunda dan memerlukan keputusan baru.

### M0-09 — Penutupan M0
- [x] Perbarui [[DECISION-LOG]] (D-011 tetap `provisional` sampai M1-08; D-012 disetujui pemilik 2026-11-14) dan roadmap ini (2026-11-14).
- [x] Waktu aktual M0: **UNKNOWN**. Durasi sesi tidak diukur; estimasi awal 3–5 jam. Mulai M1, catat waktu tiap tahap.
- **Kriteria selesai M0:** lingkungan Windows terverifikasi (termasuk FFmpeg/ffprobe), repo Git lokal aman dengan commit pertama, struktur dan template siap, `CLAUDE.md` selaras.

---

## M1 — Video uji pertama (end-to-end)

**Tujuan:** membuktikan pipeline bisa menghasilkan satu video pilot yang lolos QC dengan tool Rp0, sambil mengumpulkan data untuk menulis skill.

> **Pembaruan 2026-11-17 ([[DECISION-LOG#D-035]]):** pilot `2026-11-001` "Angka di Atas Kepala Sahabatmu" dan eksperimen pendahulunya kini **arsip pembelajaran**: tidak dilanjutkan dan tidak menunggu keputusan pemilik lagi (termasuk desain Tyo). Video end-to-end pertama yang tayang adalah **`2026-11-002` = Episode 1** seri "Peringatan dengan Suaramu Sendiri" (channel **Uq.cerita**, tayang 2026-11-17). Tugas M1 di bawah yang menyebut pilot dibaca sebagai riwayat. Langkah aktif: **Episode 2** (usulan ID `2026-11-003`), melanjutkan Episode 1; lihat [[SESSION-HANDOFF]].


**Jalur aktif sejak 2026-11-15 ([[DECISION-LOG#D-021]] approved, [[DECISION-LOG#D-022]]):** 3D toon ber-tinta di `studio/` (Remotion + three.js). C1 revisi 1 = acuan. Gambar Flow dan render 2D (`scripts/`) = arsip. Pilot: rough cut seluruh cerita sudah ada; tersisa voice-over, persetujuan desain Tyo, penyesuaian ke audio, QC final.


- [~] **M1-01 Riset & verifikasi tool** (hanya yang dibutuhkan pilot):
  - [x] Tahap 1 TTS — riset selesai sebagai rujukan ([[tts-ringkasan]], [[EXP-001-uji-dengar-tts]]); pemilihan belum final.
  - [~] Font subtitle berlisensi jelas — Poppins ExtraBold (SIL OFL 1.1) dipakai di demo teknis; konfirmasi pemilik untuk pilot ([[DECISION-LOG#D-020]]).
  - [ ] Musik/SFX berlisensi jelas — sebelum render final (M1-08), bila dipakai.
  - [ ] STT untuk penyelarasan subtitle — hanya bila timing dari audio tidak cukup.
  - [ ] Aturan label konten AI per platform dari sumber resmi — sebelum publikasi pertama (M2).
- [ ] **M1-02 Uji dengar TTS** 🔒 (2026-11-15: rekomendasi penyedia di content.md §6.4; menunggu keputusan pemilik soal biaya/akun): sesuai [[EXP-001-uji-dengar-tts]]; tidak menghambat ide/naskah, tetapi voice-over harus ada sebelum timing final (M1-08).
- [-] **M1-03 Riset tren siklus 1** — ditunda 2026-11-14: pilot memakai fokus cerita yang ditetapkan pemilik (D-015). Dijadwalkan ulang setelah pilot.
- [x] **M1-04 Ide pilot** 🔒: 3 ide disajikan; pemilik memilih Ide 2 "Angka di Atas Kepala Sahabatmu" (2026-11-14); Content Unit [[04-PRODUCTION/2026-11-001/content|2026-11-001]] dibuat.
- [x] **M1-05 Pengaturan + naskah + pemetaan adegan** 🔒: naskah v1.1 disetujui 2026-11-15 ([[DECISION-LOG#D-019]]). Storyboard teknis selesai (content.md §3). Prompt aset disiapkan (content.md §4.1).
- [~] **M1-06 Karakter, style lock, storyboard teknis, daftar layer/aset, prompt gambar** 🔒: C1 disetujui (D-018); C1-3D revisi 1 + gaya 3D disetujui (D-021, 2026-11-15). Tyo 3D = usulan (`c2_tyo_usulan_v1.png`), **menunggu pemilik**. Prompt Flow (content.md §4.1) = arsip. **[2026-11-17, D-035: 2026-11-001 = arsip pembelajaran; Tyo tidak lagi menunggu keputusan.]**
- [~] **M1-08 Animasi/compositing** **[2026-11-17, D-035: bagian pilot 2026-11-001 = arsip pembelajaran; final Episode 1 = 2026-11-002]**: **rough cut seluruh cerita 2026-11-15** (`studio/`, `npm run render:pilot`, 42,4 s, timing sementara, tanpa audio; content.md §6.4). Belum: voice-over, timing dari audio nyata, desain Tyo disetujui, render pilot final. Riwayat: demo teknis 2D (`scripts/render_video.py` + konfigurasi TOML; 12,2 s, tanpa audio; content.md §6.1). Belum: voice-over + timing dari audio nyata, dua karakter per adegan, BG1, angka di atas kepala, render pilot penuh.
- [ ] **M1-09 Quality control**: checklist `CLAUDE.md` §6 Stage 8 + coverage check + BODY/FACE rule; hasil dicatat di `content.md`.
- [~] **M1-10 Retrospektif & skill v0.1**: `video-production` v0.1 ditulis 2026-11-15 dari demo teknis ([[DECISION-LOG#D-020]]). Skill lain belum. Catat waktu tiap tahap; tulis skill v0.1 **hanya** untuk tahap yang benar-benar dijalankan ([[DECISION-LOG#D-008]]); catat pelajaran di `03-KNOWLEDGE/lessons/`.
- [ ] **M1-11 Evaluasi kapasitas** 🔒: tinjau ulang asumsi 5 jam/minggu ([[DECISION-LOG#D-002]]) dan ritme produksi.
- [ ] **EXP-002 — uji gerak natural (spring + gerak sekunder) pada C1** 🔒 — status: `proposed` (2026-11-16). Proposal: [[EXP-002-gerak-natural]]. Belum dijalankan; menunggu persetujuan pemilik. Bergantung pada skill stack [[DECISION-LOG#D-024]] (approved 2026-11-16).

**Kriteria selesai M1:** satu video lolos QC dan dapat diproduksi ulang dari dokumentasi; semua tool tercatat beserta tanggal cek; skill v0.1 tersedia untuk tahap yang sudah teruji.

---

## M2 — Publikasi & siklus belajar (garis besar)

Rincian disusun di akhir M1.

- Pembuatan akun lab di tiga platform (dilakukan pemilik) 🔒
- Skill `publishing-prep` v0.1 (metadata per platform + label AI)
- Publikasi manual beberapa video, dengan ritme sesuai hasil M1-11 🔒
- Pencatatan metrik manual ke `05-DATA/metrics.csv`
- Skill `performance-analytics` v0.1 dan eksperimen pertama yang terdokumentasi

---

## Log perubahan roadmap

| Tanggal | Perubahan |
|---|---|
| 2026-11-13 | Roadmap awal dibuat; M0 dan M1 dirinci, M2 garis besar |
| 2026-11-13 | D-013: cakupan satu laptop Windows; verifikasi Mac dan M0-08 dibatalkan; commit pertama `53d26cf` (hash awal; kini `c141e19`) |
| 2026-11-14 | M0-02 (FFmpeg 9.0.2, PATH usang dihapus), M0-07 (revisi `CLAUDE.md`), M0-09 selesai; M0 ditutup. Commit penutupan `cf87ea3`. |
| 2026-11-14 | D-012 (Jalur B) disetujui pemilik; M1-01 dimulai. Catatan hash: reflog menunjukkan `53d26cf` (commit awal) → `5b8fe2d` → `c141e19` (dua `commit --amend`, semuanya 2026-11-13 22:48:28). Tree, pesan, dan waktu identik; hanya identitas email author/committer yang berubah (OBSERVATION dari `git cat-file`; penyebabnya HYPOTHESIS: konfigurasi Git diubah lalu di-amend). Riwayat Git tidak diubah. |
| 2026-11-14 | M1-01 tahap 1 (TTS) diperluas: Google Cloud TTS dan Azure Speech dievaluasi dari dokumentasi resmi; rancangan uji dengar disiapkan ([[EXP-001-uji-dengar-tts]]). Belum ada audio, instalasi, atau akun cloud. |
| 2026-11-14 | D-014/D-015 (jalur 2D; dihapus D-029, kecuali pola cerita D-015). |
| 2026-11-15 | D-018: desain C1 "Uq" disetujui (dada kiri anatomis, tangan berjari). C1 Style Lock di STUDIO-WORKFLOW v0.3. Naskah tetap draft. |
| 2026-11-15 | D-016 diklarifikasi menjadi D-017 (Flow untuk gambar, tidak untuk video; karakter utama "Uq"). M1-06/M1-07 diperbarui. M1-05 tetap terbuka (suara, durasi, nama). |
| 2026-11-13 | Sesi M0 pertama: M0-01 (Windows), M0-03, M0-05, M0-06 selesai; M0-04 tanpa commit; tambahan `README.md` dan `.obsidian/templates.json` |
| 2026-11-15 | Naskah v1.1 disetujui. Storyboard teknis v1.1 selesai (content.md §3.2). Prompt 5 aset Flow disiapkan (content.md §4.1). M1-05 selesai; M1-06 dalam proses. |
| 2026-11-15 | D-020: generasi aset dijeda; demo teknis C1 12,2 s dirender dari konfigurasi TOML (M1-08 sebagian); skill `video-production` v0.1 (M1-10 sebagian); font demo Poppins OFL (M1-01). |
| 2026-11-15 | D-021 (menunggu persetujuan): demo 2D ditolak pemilik; pipeline 3D inkbeat di `studio/`, C1-3D, set warung, demo 3D 12,2 s (content.md §6.2). |
| 2026-11-15 | D-021 disetujui pemilik (C1 revisi 1 + gaya 3D = acuan). D-022: rough cut seluruh pilot di `studio/` (M1-08 sebagian), Tyo 3D usulan (M1-06), perintah render dilindungi dari penimpaan; skill `video-production` v0.2 (M1-10). |
| 2026-11-16 | D-024 (pending): skill pihak ketiga `threejs-*` (repo) dan `remotion-*` (level user) dipasang sebagai lapisan referensi; `video-production` v0.3. Task EXP-002 ditambahkan (`proposed`). |
| 2026-11-16 | D-024 **disetujui** pemilik; `remotion-docs` dihapus. 2026-11-002: storyboard §4 draft v0.2 diselaraskan dengan audio v2 (98,56 s); keputusan visual terbuka di content.md §8. |
| 2026-11-16 | D-025: storyboard v0.2 disetujui dengan penyesuaian (video 99,56 s); referensi adik + NPC dasar disetujui. Preset NPC 3D (`studio/src/cast/npc.tsx`) dan lineup 3D v1/v2 dibuat sebagai **usulan** (content.md §10, [[npc-presets]]). Belum di-commit. |
| 2026-11-16 | Animatic v2 ditolak. D-028: studi referensi "Badai Matahari" (target gaya terukur), aturan 2D/Flow diarsipkan, `inkbeat-shorts` dipasang + skill wajib dipakai, CLAUDE.md §16. |
| 2026-11-16 | D-029–D-031: 2D dihapus; Blender ditolak; desain tubuh + tinta tipis disetujui; pencahayaan lokal + pilot 15 s A01–A04 (v1, v2 motion blur) menunggu penilaian pemilik ([[2026-11-16-pilot-15s-v1]]). |
| 2026-11-17 | D-032/D-033: prioritas pemilik (bentuk > gerak > cerita > poles); revisi A02–A04 v3 disukai sebagai acuan; animatic v3 lengkap + usulan SFX menunggu penilaian ([[2026-11-17-animatic-v3]]). |
| 2026-11-17 | D-035: 2026-11-002 = **Episode 1** seri aktif channel Uq.cerita (tayang 2026-11-17); 2026-11-001 + eksperimen pendahulu = arsip pembelajaran; Episode 2 (usulan `2026-11-003`) melanjutkan Episode 1, cabang menunggu pilihan pemilik. D-034 "topik berbeda" digantikan. |
| 2026-11-17 | D-036: Episode 2 = cabang A (tetap di dalam); Content Unit `2026-11-003` dibuat dengan naskah draft v0.1 (menunggu persetujuan). Integrasi YouTube API: data nyata pertama Ep 1 (snapshot 2). |
| 2026-11-17 | 2026-11-003: naskah v1.0 disetujui pemilik (naskah + arahan visual); storyboard v0.2 (12 shot; ponsel/tangan dari bukti frame, cahaya ke kaca perlu bukti preview) menunggu tinjauan. Belum ada audio/render. |
| 2026-11-18 | D-038: 2026-11-003 opsi 1 (sapuan dari belakang + insert S04), S06 ke x −1,15; look-dev dapur v3 (S03 adik di tepi, reaksi S05, genggaman ponsel) menunggu tinjauan pemilik. Belum ada pilot/audio/render video. |
| 2026-11-18 | D-039: look-dev dapur 2026-11-003 disetujui; storyboard v0.5; pilot S03–S06 dibangun + dicek angka, **menunggu VO** (pemilik membuat N02/N03/P01/D02 di situs ElevenLabs, content.md §9). |
| 2026-11-18 | D-040 (pending): pilot S03–S06 v1 2026-11-003 dirender dengan VO pemilik (20,91 s, −14,1 LUFS); kamera S06 menghadap utara agar kaca terlihat (usulan). Menunggu tinjauan pemilik. |
| 2026-11-18 | D-041 (pending): pilot S03–S06 v2 2026-11-003 (insert kaca S03, kilas balik S06, SFX baru pemilik, true peak −2,3 dBTP, +0,55 s). Menunggu tinjauan pemilik. |
| 2026-11-18 | D-040 disetujui pemilik; D-041 sebagian disetujui (`lit2`, kilas balik A; +0,55 s ditolak). D-042 (pending): pilot v3 (kaki lulus P4, S05 pada bunyi toa, insert lebih lebar, 20,915 s). Menunggu tinjauan pemilik. |
| 2026-11-18 | D-042 disetujui (pilot v3 = patokan kualitas). D-043 (pending): episode penuh 2026-11-003 draft render v1 (67,17 s), menunggu tinjauan pemilik. |
| 2026-11-18 | D-043: keputusan pemilik atas draft v1 dicatat; draft v2 (recap pilihan Ep 1, kartu gaya Ep 1 + dentuman, ketukan dirapatkan) menunggu tinjauan. |
| 2026-11-18 | D-044: final v1 Episode 2 (2026-11-003) dirender, 69,43 s; persiapan publikasi ditulis. Menunggu persetujuan pemilik; tidak ada unggahan. |
| 2026-11-16 | D-027: model + gendong disetujui sebagai dasar produksi; gerak jalan reusable; set malam; **animatic v2 seluruh cerita** dengan audio + subtitle (content.md §11). Menunggu penilaian; belum di-commit. |
| 2026-11-16 | D-026: revisi model (rambut adik, tangan oval), balita + pose ibu menggendong, A10 tanpa shot reaksi. Lineup v3, still gendong, detail, cek malam (content.md §10.1). Usulan; belum di-commit. |
| 2026-11-18 | Analytics YouTube (API, 22:03 WIB): Ep 1 (38,7 j) 235.506 views / 4.531 likes / 85 komentar; Ep 2 sudah tayang (`N5rrQ6IRqQk`, 21:33 WIB), 519 views / 16 likes / 4 komentar pada ±0,5 j. Analytics API masih 0 baris (retention/durasi/traffic UNKNOWN). **Komentar belum bisa diambil**: 403, scope `youtube.readonly` tidak cukup; menunggu langkah pemilik. Laporan: `05-DATA/analytics/2026-11-002/…snapshot-03…` dan `2026-11-003/…snapshot-01…`. |
| 2026-11-20 | Analytics: scope komentar `youtube.force-ssl` ditambahkan dan login ulang pemilik berhasil (`missing_scopes: []`); task harian `uq-youtube-fetch` 09:00 (Task Scheduler, `scripts/analytics/daily_fetch.ps1`); retention Ep 1 hari pertama dipetakan ke shot ([[05-DATA/analytics/2026-11-002/2026-11-20-pemetaan-retention-0-12s]]); suara + tema komentar Ep 1; suara Ep 2 (KIRI/A 2, KANAN/B 5, ambigu 2; snapshot 2026-11-20 01:39 WIB). |
| 2026-11-20 | **D-045** (pemilik): seri "rumah nomor tujuh" selesai di Ep 5; arah cerita; cabang Ep 3–4 menyatu di tengah; Ep 5 akhir tertutup tanpa kartu; prinsip hook baru (HYPOTHESIS). Ep 3 = [[04-PRODUCTION/2026-11-004/content\|2026-11-004]] "Ada yang Menonton", **naskah draft v0.1 kedua cabang**, 17 catatan kontinuitas, aset, SFX. **Menunggu tinjauan pemilik dan pilihan cabang.** Tanpa storyboard/audio/render. |
| 2026-11-20 | **D-046** (pemilik): Ep 3 = cabang B (suara terbanyak komentar Ep 2); keputusan K1–K6; kebijakan suara penonton untuk seri interaktif (CHANNEL-DNA v0.5). 2026-11-004 **naskah draft v0.2 cabang B** (75 kata, ± 62–67 s), paket VO 9 segmen, 3 SFX belum ada (prompt di §6.1). **Menunggu tinjauan pemilik** + persetujuan ambang suara. Tanpa storyboard/audio/render. |
| 2026-11-20 | **D-047** (pemilik): naskah Ep 3 **v1.0 dikunci** (`status: scripted`); ambang suara ≥ 5 jelas + unggul ≥ 2 (CHANNEL-DNA v0.6); Ep 2 2026-11-003 → `published` (URL YouTube dari API, IG/TikTok UNKNOWN); kamar mandi diputuskan di Ep 4; dentuman cadangan = kombinasi Ep 2. Claude: cek badan kamera Ep 1–2 secara numerik (content.md 2026-11-004 §10; tamu/dapur/kamar aman, lorong konflik kecil Ep 2 S06), **storyboard v0.1** 15 shot ± 63,9 s (§11), denah `_media/2026-11-004/storyboard/`, aset + look-dev minimal (§12), usulan pilot dua blok (§13). **Menunggu tinjauan pemilik** (§14). Tanpa look-dev/audio/render. |
| 2026-11-20 | **D-048** (pemilik): storyboard Ep 3 v0.2 (keputusan §14). Cek tangan-di-mulut: usulan utama gagal → **cadangan dipakai** (adik menutup mulut sendiri, tangan Uq di bahunya). **Look-dev v1** aset baru: 15 still + 3 contact sheet + QC (content.md 2026-11-004 §15). VO final: N01, P01, N02, N03, D01, N04a/b/c, P02, N05, N06. **Menunggu tinjauan pemilik.** Tanpa pilot/audio/render video. |
| 2026-11-20 | **D-049** (pemilik): storyboard Ep 3 v0.3. Claude: look-dev v2 (kenop kaca ×6 = 81 % gelap, kamera lorong tanpa tinta, pendar 22/30 px + gerbang oklusi lulus) dan **pilot v1** dua blok 14,40 s (`_media/2026-11-004/out/pilot_v1/`, −14,3 LUFS, −2,4 dBTP). Kelemahan terbesar: tunjukan adik S08 tidak terbaca; POV S09 nyaris diam. **Menunggu tinjauan pemilik.** |
| 2026-11-20 | **D-050** (pemilik): pilot Ep 3 v2 = `_media/2026-11-004/out/pilot_v2/` (13,40 s, −14,2 LUFS, −2,5 dBTP): S08 adik mendongak tanpa menunjuk, S09 2,4 s, telapak adik 2 cm, LED di frame klik. **Kartu recap T + 0,5 / T + 1,0 s tertahan:** T = 6,650 s, jadwal baru jatuh sesudah potongan 6,8 s dan di atas L3; 2 opsi di content.md §17.2. **Menunggu pemilik.** |
| 2026-11-20 | **D-051** (pemilik): Opsi 2. Pilot Ep 3 v3 = `_media/2026-11-004/out/pilot_v3/` (16,30 s, −14,4 LUFS, −2,4 dBTP): kartu 7,15 / 7,35 / klik 7,85 / habis 9,20 s; L3 mundur 2,414 s; S08a 1,5 s; S02 telapak 4,5 cm (sisa 5 px garis mulut). Estimasi episode ± 65,8 s. Limiter master memburuk (8,9 dB). **Menunggu pemilik.** |
| 2026-11-20 | **D-052** (pemilik): pilot Ep 3 v3 diterima tanpa perubahan (**gerbang pilot lolos; episode tetap `scripted`, belum approved**); jadwal kartu = keputusan; dua sisa masalah diterima. Claude: VO 11 file lengkap (N04 lama diarsipkan), tidak ada clipping, isi belum diverifikasi; rencana episode dari durasi VO asli **68,35 s**; pra-cek mix; penghalang render: kode panggung S03–S07 dan S10–S15 belum ada, mix episode belum ada (content.md §19). **Menunggu pemilik.** |
| 2026-11-20 | **D-053** (pemilik): rencana waktu Ep 3 68,35 s disetujui; tahap 1 = uji empat gerak. Claude: mundur **gagal visual** (kaki bersilang), genggam **gagal makna** (lensa P), berbalik lolos dengan usulan langkah 0,10 m, tatap lensa lolos (content.md 2026-11-004 §20, `_media/2026-11-004/out/motion_v1/`). **Menunggu pilihan opsi pemilik.** Tanpa render episode. |
| 2026-11-20 | **D-054** (pemilik): mundur S10 opsi (a) dengan satu iterasi, genggam lewat insert tangan di awal S15, langkah 0,10 m adik saat berbalik, mix v1 aman (dijalankan ulang dengan timing final, belum sekarang). Claude: mundur (a) **gagal sesudah satu iterasi → berhenti** (0/32; terdekat sendi 11,4 > 11,1 °/f; kepala tak sampai LED-1 14°/21°); berbalik **tertahan** (bergantung S10); insert genggam + tatap **lolos**, usulan total 68,65 s (content.md 2026-11-004 §21, `_media/2026-11-004/out/motion_v2/`); resep uji gerak di skill `video-production` §14. **Menunggu pemilik** (opsi mundur, timing insert). Tanpa render episode. |
| 2026-11-20 | **D-055** (pemilik): mundur S10 opsi (b), gagal → otomatis (c); berbalik 0,70 s; insert I15 2,0 s; noda tangan didiagnosis. Claude: (b) **gagal cek berantai** (LED-3 lorong dan LED-4 kamar terhalang dari R1 baru, 0/3 jarak); (c) geser-rapat **lolos angka** (1/8; sendi 10,7 °/f, 5,7 cm, kaki tidak bersilang) tetapi makna dengan dua kelemahan (kangkang 46–48 cm; tangan Uq tampak menyentuh adik 1,4–1,7 s) → **tidak dinyatakan final**; berbalik 0,70 s lolos angka, 0,85 s tidak muat; insert 2,0 s lolos, total **69,15 s**, dorong lensa P 100 % kecepatan lama (usulan "lama"); noda = bayangan tangan Uq dari lampu bulan (`ep002/sets.tsx`, tidak diubah); tatap 3,8°/−3,5° (content.md 2026-11-004 §22, `_media/2026-11-004/out/motion_v3/`). **Menunggu pemilik.** Tanpa render episode, mix, commit. |
| 2026-11-20 | **D-056** (pemilik): S10 (c) diterima + satu iterasi tangan; I15 2,0 s/"lama" final; rencana d055 = rencana kerja; tahap 2 = kode semua shot (A → B → C). Claude: iterasi tangan **0/6 → varian D-055, sentuhan = risiko pratinjau**; kelompok A dibangun (`episode004Stage.ts`, `Episode004Shot.tsx`): S10 lolos angka, S11 lolos (fov akhir 28,12 agar LED-3 tetap di bingkai), **S12 tertahan** (kusen pintu kamar z-fighting, kode Ep 1 `sets.tsx`, 3 opsi). Kelompok B dan C **belum** (berhenti di batas kelompok; handoff). Gambar `_media/2026-11-004/out/shots_v1/`. Tanpa render episode, mix, commit. |
| 2026-11-20 | **D-057** (pemilik): kusen S12 opsi (i) satu iterasi; S10/S11 diterima; kelompok B lalu C. Claude: penutup kusen Ep 3 (`jambCover004.tsx`) — gerigi hilang (a lolos), selisih antarframe sisa 0,24 vs dinding 0,05 (b tidak harfiah, menunggu pemilik); bintik sofa S10 = kode Ep 1–2 (dilaporkan); **semua shot baru dibangun** (S03–S07, S13–S15, I15, kartu, tatap; `episode004B.ts`, `overlay004.tsx`) dan lolos angka; usulan lensa S04/S05/S07 berbeda dari storyboard. Gambar `_media/2026-11-004/out/shots_v2/`, content.md §24. **Berikutnya:** keputusan pemilik atas (b) dan usulan lensa; lalu render pratinjau episode + mix (sesi lain). Tanpa render episode, mix, commit. |
| 2026-11-21 | **D-058** (pemilik): kusen (b), lensa opsi A, angka S04, S06 tanpa notifikasi, sofa dibiarkan, total 2076 frame, audio v2 + 1 frame = `episode_v3`. Claude: komposisi `Episode004` (17 shot, jam global) dan **pratinjau 540×960** `_media/2026-11-004/out/episode_preview_v1/` (69,20 s, −14,2 LUFS, −1,9 dBTP); teks 0 selisih; sinkron ≤ 1 f kecuali 3 warisan/rancangan; **kerlip tepi set S10** (tanpa tokoh 1,28 % di ROI bingkai lukisan vs pilot 0,01 % seluruh bingkai, penyebab UNKNOWN; S13 tidak terbukti); caption kosong 3 frame di L6; kusen S12 0 % bolak-balik; caption dan LED-3 di zona aman konservatif (content.md 2026-11-004 §25). **Menunggu pemilik menonton.** Tanpa render final, commit. |
| 2026-11-22 | **D-059** (pemilik): pratinjau v3 Ep 3 disetujui (kartu A/B terpusat, celah caption L6 ditutup); LED-3 dan diagnosis kerlip S10 ditunda. Claude: **render FINAL** `_media/2026-11-004/out/final_v1/episode_2026-11-004_final_v1.mp4` (1080×1920, 69,20 s, −14,2 LUFS, −1,9 dBFS; kartu terbaca di MP4 final; content.md 2026-11-004 §25.11, §26). Episode tetap `scripted`, `approved-by-owner: false`; **menunggu pemilik mengunggah/menyetujui**. Tanpa upload, commit, push. |
| 2026-11-22 | **D-060** (pemilik): Ep 3 [[04-PRODUCTION/2026-11-004/content\|2026-11-004]] diunggah pemilik → `published`, `approved-by-owner: true`. Platform/URL/waktu tayang UNKNOWN (belum diberikan). Berikutnya: ID YouTube ke `daily_fetch.ps1`, snapshot analytics, suara A/B (D-046/D-047). |
| 2026-11-23 | **D-061** (pemilik): cabang Ep 4 = B (suara Ep 3: B 16, A 3), naskah Ep 4 v1.0 dikunci. Claude: [[04-PRODUCTION/2026-11-005/content\|2026-11-005]] dibuat, storyboard v0.1 (15 shot, 60 s) menunggu tinjauan. Jangkauan dari sofa **gagal** (alternatif: lempar jaket), pintu kamar mandi **lolos** terhadap Ep 2 S04. Tanpa VO/pilot/render. |
| 2026-11-24 | **D-063** (pemilik): pratinjau penuh Ep 4 disetujui. Claude: **render FINAL** `_media/2026-11-005/out/final_v1/` (58,90 s, −14,2 LUFS), menunggu unggahan pemilik. Cek gerak umum `motion_check_lib.ts`; checklist produksi Ep 5 di [[04-PRODUCTION/2026-11-006/content\|2026-11-006]] (stub, belum ada naskah). |
| 2026-11-24 | **D-064** (pemilik): beat bagian bersama Ep 5 [[04-PRODUCTION/2026-11-006/content\|2026-11-006]] disetujui sebagai beat (bukan naskah/video); dua koreksi layar pemantau dan beat 7-8; pembuka A/B terbuka menunggu voting Ep 4 (≥ 24 j). |
| 2026-11-24 | **D-065** (pemilik): Ep 5 cabang B "minta bukti dulu" (voting sementara 15 : 0, umur 14,8 j; konfirmasi sesudah 25 Nov 00:22 WIB). Claude: naskah draf v0.1, storyboard v0.1, paket VO, cek persiapan visual [[04-PRODUCTION/2026-11-006/content\|2026-11-006]]. Menunggu tinjauan pemilik. |
| 2026-11-24 | **D-066** (pemilik): lima keputusan storyboard Ep 5 (suara Uq Dhani, ruang toa R2, kamera tatap 0,70 m + langkah, bukti foto kunci, alis turun). Claude: animatic penutup v0 hening (`animatic_close_v0/…_v0b.mp4`), cek angka lolos. Menunggu tinjauan pemilik. |
| 2026-11-24 | **D-067** (pemilik): shot penutup Ep 5 disetujui dengan acuan `animatic_close_2026-11-006_v0f_glitch.mp4`; TAMAT tidak lagi hening (2,5 s glitch + static/denging sampai frame terakhir); selaraskan awal tatapan dengan akhir VO U02 saat perakitan. [[04-PRODUCTION/2026-11-006/content\|2026-11-006]] §2.10. |
| 2026-11-24 | Claude: **pratinjau episode penuh Ep 5 v4** `_media/2026-11-006/out/episode_preview_v4/episode_2026-11-006_preview_v4.mp4` (50,97 s, VO asli, cabang B; penutup = v0f, glitch direproduksi di `overlay006.tsx`/`ep006_episode_audio.py`). QC [[04-PRODUCTION/2026-11-006/content\|2026-11-006]] §4. Menunggu tinjauan pemilik; tanpa render final, commit, push. |
| 2026-11-24 | **D-068** (pemilik): revisi v4 → v5 (tangan satpam, adik di pintu belakang, gembok, N06 utuh + jeda 0,8 s). Claude: cek gerak + aturan interaksi R1–R5 (v4 GAGAL 13, v5 LOLOS), **pratinjau v5** `_media/2026-11-006/out/episode_preview_v5/` menunggu tinjauan pemilik. [[04-PRODUCTION/2026-11-006/content\|2026-11-006]] §5, [[03-KNOWLEDGE/lessons/2026-11-24-logika-interaksi-ep5-v5]]. |
| 2026-11-24 | Pemilik menyetujui pratinjau v5 Ep 5 untuk render final. Claude: **render FINAL** `_media/2026-11-006/out/final_v1/episode_2026-11-006_final_v1.mp4` (58,57 s, −14,8 LUFS), menunggu pemeriksaan dan unggahan pemilik. [[04-PRODUCTION/2026-11-006/content\|2026-11-006]]. |
