---
type: tool-evaluation
title: "VoxCPM2 (OpenBMB)"
category: tts
checked-date: "2026-11-14"
created: "2026-11-14"
updated: "2026-11-14"
pricing-status: VERIFIED
license-status: OBSERVATION
commercial-use: OBSERVATION
runs-on: [cloud-gpu-or-larger-local-gpu]
verdict: pending
tags: [tool, tts]
---

# VoxCPM2 (OpenBMB)

> Harga, kuota, dan lisensi bisa berubah. Semua informasi hanya berlaku pada `checked-date` dan harus dicek ulang sebelum dipakai untuk produksi. Lihat [[DECISION-LOG#D-004]].
> `commercial-use: OBSERVATION` = deklarasi di model card ("free for commercial use"); repo/dataset/dependensi tidak diaudit.

## Kebutuhan yang dipenuhi

Voice-over Bahasa Indonesia (model multibahasa, bukan khusus Indonesia).

## Fakta (dengan sumber)

| Aspek | Temuan | Label | Sumber | Tanggal cek |
|---|---|---|---|---|
| Harga / free tier | Gratis (open source) | VERIFIED | [model card](https://huggingface.co/openbmb/VoxCPM2) | 2026-11-14 |
| Kuota / batasan | Tidak ada kuota; dibatasi hardware | VERIFIED | model card | 2026-11-14 |
| Lisensi tool/model | Apache-2.0 (deklarasi model card) | OBSERVATION | model card | 2026-11-14 |
| Hak penggunaan output | Penyalahgunaan (peniruan, penipuan, disinformasi) dilarang; konten AI harus diberi label | OBSERVATION | model card | 2026-11-14 |
| Penggunaan komersial | Dideklarasikan diizinkan | OBSERVATION | model card | 2026-11-14 |
| Watermark | Tidak disebut | UNKNOWN | model card | 2026-11-14 |
| Kebutuhan hardware (**konfigurasi standar yang terdokumentasi**) | 2B parameter, bfloat16, **sekitar 8 GB VRAM**; PyTorch ≥ 2.5, CUDA ≥ 12.0, Python ≥ 3.10. Dengan konfigurasi ini, RTX 3050 Ti Laptop (4 GB VRAM) **tidak memenuhi syarat yang tertulis** | VERIFIED (isi dokumentasi) | model card; [[ENVIRONMENT]] | 2026-11-14 |
| Jalur alternatif (kuantisasi, offload CPU, eksekusi CPU, GPU cloud gratis) | **UNKNOWN.** Tidak diselidiki; tidak ada klaim bahwa jalur itu mustahil atau layak | UNKNOWN | — | 2026-11-14 |
| Dukungan Bahasa Indonesia | Indonesia termasuk 30 bahasa yang didukung; kualitas belum ada benchmark independen dan belum didengar | OBSERVATION | model card | 2026-11-14 |

## Risiko dan catatan

- Kesimpulan hardware hanya berlaku untuk konfigurasi standar yang terdokumentasi di model card per 2026-11-14.
- Fitur cloning dan voice design: jangan meniru orang nyata ([[CLAUDE]] §11).

## Hasil uji nyata

Belum diuji. Tidak ada unduhan atau instalasi.

## Keputusan

- **Verdict:** pending
- **Alasan:** tidak masuk daftar uji dengar tahap pertama karena konfigurasi standar melebihi VRAM lokal; dapat ditinjau ulang bila jalur alternatif diselidiki (UNKNOWN).
- **Alternatif:** [[chatterbox-tts-indonesian]], [[google-cloud-tts]], [[azure-speech-tts]], [[tts-ringkasan]]
