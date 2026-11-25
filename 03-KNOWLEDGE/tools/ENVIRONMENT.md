---
type: environment
created: 2026-11-13
updated: 2026-11-14
checked-date: 2026-11-13
related: "[[ROADMAP]], [[DECISION-LOG]], [[ARCHITECTURE]]"
tags: [tool, environment]
---

# Environment — Hasil Verifikasi Perangkat

> Dibuat untuk ROADMAP M0-01 ([[DECISION-LOG#D-005]], kini [[DECISION-LOG#D-013]]: laptop Windows adalah satu-satunya perangkat proyek). Hanya berisi output perintah yang benar-benar dijalankan.
> Demi privasi, file ini **tidak** memuat PATH lengkap, nama komputer, atau email Git.

## 1. Windows PC

**Cara verifikasi:** Claude Code berjalan **langsung di Windows PC pemilik** (folder `C:\AI_CONTENT_FACTORY\ai_content_factory`), bukan di sandbox cloud. Perintah dijalankan pada 2026-11-13 lewat Git Bash dan Windows PowerShell 5.1 dari Claude Code.

| Komponen | Hasil | Perintah | Label |
|---|---|---|---|
| OS | Microsoft Windows 11 Pro 10.0.26200 (build 26200) | `Get-CimInstance Win32_OperatingSystem` | VERIFIED |
| CPU | 11th Gen Intel Core i7-11800H @ 2.30GHz | `Get-CimInstance Win32_Processor` | VERIFIED |
| RAM | 31.8 GB total | `Win32_OperatingSystem.TotalVisibleMemorySize` | VERIFIED |
| Disk C: | 119.8 GB kosong (344.9 GB terpakai) | `Get-PSDrive C` | VERIFIED |
| GPU diskrit | NVIDIA GeForce RTX 3050 Ti **Laptop** GPU | `nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv` | VERIFIED |
| VRAM | **4096 MiB (4 GB)** | idem | VERIFIED |
| Driver NVIDIA | 621.14 (mode WDDM) | `nvidia-smi` | VERIFIED |
| CUDA (driver) | `CUDA UMD Version: 13.5` (versi maksimum yang didukung driver; CUDA Toolkit belum dicek) | `nvidia-smi` | VERIFIED |
| GPU terintegrasi | Intel UHD Graphics | `Get-CimInstance Win32_VideoController` | VERIFIED |
| Python | 3.14.4 (default, `C:\Python314`); juga terpasang 3.13 dan 3.12 | `python --version`, `py -0` | VERIFIED |
| pip | 26.2.2 (Python 3.14) | `python -m pip --version` | VERIFIED |
| Git | 2.53.0.windows.2; `user.name` dan `user.email` global sudah diisi | `git --version`, `git config --global` | VERIFIED |
| FFmpeg | 9.0.2-essentials_build (gyan.dev), via Chocolatey; `C:\ProgramData\chocolatey\bin\ffmpeg.exe`. Build memuat libx264, libx265, `nvenc`, libass (dicek 2026-11-14) | `choco install ffmpeg -y` (admin) → "already installed"; `ffmpeg -version`; `Get-Command ffmpeg -All` | VERIFIED |
| ffprobe | 9.0.2-essentials_build; `C:\ProgramData\chocolatey\bin\ffprobe.exe` (2026-11-14) | `ffprobe -version`; `Get-Command ffprobe -All` | VERIFIED |
| winget | v1.29.380 terpasang (`Microsoft.DesktopAppInstaller`), tetapi folder `WindowsApps` tidak ada di PATH shell Claude Code | `Get-AppxPackage`, `winget.exe --version` via path lengkap | VERIFIED |
| Chocolatey | 2.7.1 | `choco --version` | VERIFIED |
| GitHub CLI (`gh`) | Tidak ditemukan | `which gh` | VERIFIED |

### Temuan

1. **FFmpeg sudah terpasang (2026-11-14, Chocolatey 9.0.2) dan menjadi hasil pertama `Get-Command`.** **Entri PATH usang sudah dihapus** atas persetujuan pemilik (2026-11-14; User PATH 55 → 53 entri). Pemeriksaan read-only 2026-11-14: registry User PATH dan Machine PATH = 0 entri `IdlixDownloader`; proses Claude Code yang berjalan masih memegang salinan lama (2 entri) sampai di-restart. Catatan awal (2026-11-13): PATH memuat folder FFmpeg lama dari aplikasi pihak ketiga di folder Downloads, tetapi folder tersebut **sudah tidak ada**. Lokasi: **User PATH**, entri ke-43 dan ke-46 (duplikat), keduanya `...\Downloads\Compressed\IdlixDownloader-master\...\ffmpeg-7.1.1-essentials_build\bin`, `Test-Path` = False (dicek 2026-11-13). Instalasi FFmpeg dan penghapusan entri: ROADMAP M0-02.
2. **VRAM 4 GB.** Cukup untuk sebagian model gambar lokal dengan mode hemat VRAM, tetapi kelayakannya **belum diuji nyata** (HYPOTHESIS). Lihat [[DECISION-LOG#D-012]].
3. **Python 3.14 sangat baru.** Sebagian library AI mungkin belum mendukung 3.14 (HYPOTHESIS). Python 3.12 dan 3.13 juga terpasang (`py -0p`, 2026-11-14) dan bisa dipakai untuk virtual environment. **Python 3.11 tidak terpasang**; bila sebuah tool menyebut 3.11 sebagai baseline pengujian, periksa dulu apakah 3.12/3.13 cukup sebelum meminta instalasi.
4. **RAM 31.8 GB** cukup longgar untuk render FFmpeg dan model speech-to-text lokal ukuran kecil–menengah (HYPOTHESIS, diuji di M1).

## 2. MacBook Air M1 — di luar cakupan

Sejak 2026-11-13 MacBook **tidak lagi bagian dari proyek** ([[DECISION-LOG#D-013]]). Bagian di bawah disimpan hanya sebagai arsip dan tidak perlu diisi.

Jalankan di Terminal Mac, lalu tempel hasilnya ke bagian ini:

```bash
sw_vers
sysctl -n machdep.cpu.brand_string
echo "$(($(sysctl -n hw.memsize) / 1073741824)) GB RAM"
df -h /
python3 --version
ffmpeg -version | head -1
git --version
```

Hasil yang diharapkan (perkiraan, bukan fakta): `ProductVersion` macOS, `Apple M1`, `8 GB RAM`. Bila `ffmpeg` atau `git` belum ada, catat sebagai *not found*.

| Komponen | Hasil | Label |
|---|---|---|
| macOS | | UNKNOWN |
| Chip | | UNKNOWN |
| RAM | | UNKNOWN |
| Disk kosong | | UNKNOWN |
| Python | | UNKNOWN |
| FFmpeg | | UNKNOWN |
| Git | | UNKNOWN |

## Riwayat

| Tanggal | Perubahan |
|---|---|
| 2026-11-13 | Verifikasi pertama Windows PC (M0-01) |
| 2026-11-13 | MacBook dikeluarkan dari cakupan (D-013); entri PATH FFmpeg usang dicatat di §1 |
| 2026-11-14 | FFmpeg/ffprobe 9.0.2 terverifikasi; entri PATH usang dihapus (disetujui pemilik); Python 3.11 dicatat tidak terpasang |
