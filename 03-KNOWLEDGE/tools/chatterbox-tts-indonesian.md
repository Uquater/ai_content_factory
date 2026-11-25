---
type: tool-evaluation
title: "Chatterbox-TTS-Indonesian (grandhigh)"
category: tts
checked-date: "2026-11-14"
created: "2026-11-14"
updated: "2026-11-14"
pricing-status: OBSERVATION
license-status: OBSERVATION
commercial-use: OBSERVATION
runs-on: [windows-local]
verdict: pending
tags: [tool, tts]
---

# Chatterbox-TTS-Indonesian (grandhigh)

> Harga, kuota, dan lisensi bisa berubah. Semua informasi hanya berlaku pada `checked-date` dan harus dicek ulang sebelum dipakai untuk produksi. Lihat [[DECISION-LOG#D-004]].
> **Arti metadata:** `commercial-use: OBSERVATION` = lisensi *dideklarasikan* di model card dan repo; **bukan** hasil audit hukum atas seluruh rantai komponen. Rincian per komponen ada di tabel "Rantai lisensi".

## Kebutuhan yang dipenuhi

Voice-over Bahasa Indonesia, lokal di laptop Windows (M1-01 tahap 1, kandidat M1-02).

## Fakta (dengan sumber)

| Aspek | Temuan | Label | Sumber | Tanggal cek |
|---|---|---|---|---|
| Harga / free tier | Gratis (open source, jalan lokal) | VERIFIED | [model card](https://huggingface.co/grandhigh/Chatterbox-TTS-Indonesian) | 2026-11-14 |
| Kuota / batasan | Tidak ada kuota; dibatasi hardware lokal | VERIFIED | model card | 2026-11-14 |
| Hak penggunaan output | Tidak ada pembatasan tambahan yang dinyatakan di model card selain Apache 2.0 | OBSERVATION | model card | 2026-11-14 |
| Watermark | Model dasar menyisipkan watermark Perth (tak terdengar, tahan kompresi MP3). Model card fine-tune tidak membahasnya; apakah masih aktif pada fine-tune **belum diuji** | OBSERVATION (dasar) / UNKNOWN (fine-tune) | [HF ResembleAI/chatterbox](https://huggingface.co/ResembleAI/chatterbox); [repo](https://github.com/resemble-ai/chatterbox) | 2026-11-14 |
| Kebutuhan hardware | 0,5B parameter, F32; GPU CUDA disarankan. **Angka VRAM tidak dinyatakan** di sumber mana pun yang dibaca. Muat/tidak di 4 GB VRAM = belum diuji; kelayakan hardware = UNKNOWN | UNKNOWN | model card | 2026-11-14 |
| Dukungan Bahasa Indonesia | Fine-tune khusus Indonesia. Model dasar tidak mencantumkan Indonesia (hanya Malay). Kualitas: klaim penulis tanpa benchmark; belum didengar | OBSERVATION | model card; repo | 2026-11-14 |

## Rantai lisensi (komponen demi komponen)

| Komponen | Lisensi yang dideklarasikan | Apa yang sudah diperiksa | Yang belum | Label |
|---|---|---|---|---|
| Fine-tune `grandhigh/Chatterbox-TTS-Indonesian` | Apache 2.0 (model card) | Model card dibaca penuh | Berkas `LICENSE`/`NOTICE` di repo model tidak dibuka | OBSERVATION |
| Model dasar `ResembleAI/chatterbox` (bobot) | MIT ("License: mit") | Model card HF | Tidak ada pemeriksaan lanjutan | OBSERVATION |
| Kode Chatterbox | MIT | README repo GitHub | Repo dinyatakan *retired, no longer maintained* | OBSERVATION |
| Dataset latih `SuaraGabungan-ID` | Apache 2.0 untuk keseluruhan; sumber: Espeak-ID-5K (MIT), FLEURS (CC BY 4.0, atribusi ke Google wajib), ind_famal (Apache 2.0) | [Dataset card](https://huggingface.co/datasets/grandhigh/SuaraGabungan-ID) dibaca | `NOTICE.md` dataset dan halaman asal tiap sumber **tidak** dibuka; hak atas suara pembicara asli tidak diperiksa | OBSERVATION |
| Dependensi (mis. `resemble-perth` dari git master, `s3tokenizer`, `spacy-pkuseg`) | Tidak diperiksa | — | Lisensi masing-masing | UNKNOWN |

Kesimpulan terbatas: **semua deklarasi yang dibaca mengizinkan penggunaan komersial**, tetapi pemeriksaan hanya sampai kartu model/dataset. Sebelum produksi komersial, buka `NOTICE.md` dataset, `LICENSE` repo, dan lisensi dependensi.

## Kompatibilitas Python & Windows

| Aspek | Temuan | Label | Sumber |
|---|---|---|---|
| Syarat versi Python resmi (kode dasar) | `requires-python >=3.10` di `pyproject.toml` | VERIFIED | [pyproject.toml](https://raw.githubusercontent.com/resemble-ai/chatterbox/master/pyproject.toml) |
| Baseline pengembangan | README: dikembangkan dan diuji di **Python 3.11** pada Debian 11 — ini baseline pengujian, **bukan** syarat versi | VERIFIED | [README](https://github.com/resemble-ai/chatterbox) |
| Keterangan di model card fine-tune | "Python 3.11 atau lebih baru" | OBSERVATION | model card |
| Pin dependensi | `torch==2.6.0` dan `torchaudio==2.6.0` untuk Python < 3.14; `torch>=2.9.0` untuk ≥ 3.14; `numpy<2` untuk < 3.13, `numpy>=2` untuk ≥ 3.13; `transformers==5.2.0`; `librosa==0.11.0`; `gradio==6.8.0`. Komentar di berkas: torch 2.6.0 mendukung Python 3.10–3.13 | VERIFIED | pyproject.toml |
| Penanda platform | Tidak ada penanda Windows/Linux di `pyproject.toml` | VERIFIED | pyproject.toml |
| Wheel Windows untuk semua dependensi | Tidak diperiksa: `s3tokenizer`, `spacy-pkuseg` (mungkin perlu compiler), `resemble-perth` (diambil dari git; Git sudah terpasang) | UNKNOWN | — |
| Python yang terpasang di PC ini | 3.14.4 (default), 3.13, 3.12; **3.11 tidak terpasang** | VERIFIED | `py -0p`, 2026-11-14 |

Kesimpulan terbatas: berdasarkan metadata, **Python 3.12 atau 3.13 kemungkinan cukup** dalam venv terpisah (HYPOTHESIS); Python 3.14 sebaiknya dihindari karena memakai cabang dependensi lain. Python 3.11 hanya perlu dipasang bila uji 3.12/3.13 gagal. Tidak ada yang diinstal atau diunduh dalam riset ini.

## Risiko dan catatan

- Repo dasar dinyatakan *retired research, no longer maintained* (halaman repo, 2026-11-14): risiko perawatan jangka panjang.
- Fine-tune pihak ketiga tanpa evaluasi independen.
- Fitur kloning suara: jangan meniru orang nyata ([[CLAUDE]] §11). Label konten AI tetap berlaku.

## Hasil uji nyata

Belum diuji. Tidak ada unduhan atau instalasi.

## Keputusan

- **Verdict:** pending
- **Alasan:** kandidat lokal yang **sudah ditelaah** dan paling jelas deklarasi lisensinya dibanding kandidat lokal lain yang ditelaah sejauh ini ([[tts-ringkasan]]); itu bukan klaim bahwa tidak ada kandidat lokal lain. Kelayakan di 4 GB VRAM belum diuji.
- **Alternatif:** [[voxcpm2]], [[google-cloud-tts]], [[azure-speech-tts]]
