---
type: content-unit
id: "YYYY-MM-NNN"
title: ""
status: idea
channel: lab
category: ""
experiment: ""
created: "{{date:YYYY-MM-DD}}"
updated: "{{date:YYYY-MM-DD}}"
approved-by-owner: false
platforms: [tiktok, reels, shorts]
duration-target-s: 35
published-urls: []
tags: [content-unit]
---

# YYYY-MM-NNN — judul kerja

> **Cara pakai:** buat folder `04-PRODUCTION/<id>/`, lalu buat catatan `content.md` di dalamnya dari template ini. ID berformat `YYYY-MM-NNN` (contoh `2026-11-001`). Aset berat disimpan di `_media/<id>/`, bukan di folder ini.
> Semua catatan unit bernama `content.md`, jadi tautkan dengan path lengkap: `[[04-PRODUCTION/<id>/content]]`, jangan `[[content]]`.
> Aturan status: [[ARCHITECTURE]] §5 · Keputusan: [[DECISION-LOG#D-010]] · Identitas channel: [[02-CHANNELS/lab/CHANNEL-DNA|Channel DNA lab]]

## Status

Siklus: `idea → scripted → storyboarded → assets-ready → rendered → qc-passed → approved → published → analyzed` (atau `rejected` / `parked`).

- `approved` dan `published` hanya boleh diubah atas persetujuan pemilik.
- `rendered` belum berarti `qc-passed`.

| Tanggal | Status baru | Oleh | Catatan |
|---|---|---|---|
| {{date:YYYY-MM-DD}} | idea | | |

## 1. Ide

- **Working title:**
- **Target audiens:**
- **Premis utama:**
- **Hook pembuka:**
- **Pesan inti:**
- **Format:**
- **Estimasi durasi (detik):**
- **Potensi visual:**
- **Kompleksitas produksi (rendah/sedang/tinggi):**
- **Pertimbangan fakta & hak cipta:**
- **Riset terkait:** (tautan ke catatan di `03-KNOWLEDGE/research/`)

### Skor peluang

Skor adalah estimasi pendukung keputusan, bukan ukuran objektif. Skala 1–5.

| Kriteria | Bobot | Skor | Alasan |
|---|---:|---:|---|
| Minat audiens | 25% | | |
| Potensi kreatif | 20% | | |
| Kelayakan produksi | 20% | | |
| Orisinalitas | 15% | | |
| Repeatability | 10% | | |
| Kesesuaian platform | 10% | | |
| **Total tertimbang** | 100% | | |

## 2. Naskah

- **Versi:** v1
- **Durasi baca (detik):**
- **Disetujui pemilik:** belum

```text
[HOOK]

[KONTEKS]

[ISI]

[PAYOFF]

[PENUTUP]
```

## 3. Storyboard

| # | Narasi | Visual | Kamera/gerakan | Teks overlay | Suara | Durasi (s) | Aset |
|---:|---|---|---|---|---|---:|---|
| 1 | | | | | | | |

## 4. Prompt aset

- **Gaya visual konsisten:**
- **Karakter/objek berulang:**

| Scene | Jenis (gambar/video/audio) | Tool | Prompt | Seed/pengaturan | File di `_media/<id>/` |
|---:|---|---|---|---|---|
| 1 | | | | | |

## 5. Produksi

- **Spesifikasi target:** 1080×1920, 30 fps, H.264, AAC
- **Script render:** (path di `scripts/`)
- **File output:** `_media/<id>/`
- **Hasil `ffprobe`:**
- **Voice-over (tool + lisensi):**
- **Musik/SFX (sumber + lisensi):**

## 6. Quality control

- [ ] Hook pembuka kuat dan jujur (tidak menjanjikan hal yang tidak dipenuhi)
- [ ] Alur cerita jelas
- [ ] Akurasi fakta sudah dicek (sumber dicatat)
- [ ] Kualitas audio seimbang
- [ ] Caption/subtitle akurat dan terbaca
- [ ] Konsistensi visual
- [ ] Risiko hak cipta sudah dicek
- [ ] Sesuai aturan platform
- [ ] Label/disclosure konten AI sesuai ketentuan platform

**Catatan QC:**

## 7. Publikasi

| Platform | Judul | Caption/deskripsi | Hashtag | Cover | Disclosure AI | Tanggal publikasi | URL |
|---|---|---|---|---|---|---|---|
| TikTok | | | | | | | |
| Reels | | | | | | | |
| Shorts | | | | | | | |

**Checklist publikasi**

- [ ] Status `approved` sudah disetujui pemilik
- [ ] Metadata tiap platform sudah dicek
- [ ] Label konten AI diaktifkan sesuai aturan platform
- [ ] File final sesuai spesifikasi (dicek dengan `ffprobe`)
- [ ] URL publikasi dicatat di tabel di atas dan di `05-DATA/metrics.csv`

## 8. Performa

Data mentah dicatat di `05-DATA/metrics.csv`. Bagian ini hanya berisi ringkasan.

- **Ringkasan:**
- **Pelajaran:** (tautan ke `03-KNOWLEDGE/lessons/` bila penting)

## 9. Catatan waktu

| Tahap | Waktu (menit) |
|---|---:|
| Riset & ide | |
| Naskah | |
| Storyboard & prompt | |
| Generasi aset | |
| Render | |
| QC | |
| Publikasi | |
