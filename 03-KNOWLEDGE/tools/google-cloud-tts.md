---
type: tool-evaluation
title: "Google Cloud Text-to-Speech"
category: tts
checked-date: "2026-11-14"
created: "2026-11-14"
updated: "2026-11-14"
pricing-status: OBSERVATION
license-status: UNKNOWN
commercial-use: UNKNOWN
runs-on: [cloud-api]
verdict: pending
tags: [tool, tts, cloud]
---

# Google Cloud Text-to-Speech

> Harga, kuota, dan lisensi bisa berubah. Semua informasi hanya berlaku pada `checked-date` dan harus dicek ulang sebelum dipakai untuk produksi. Lihat [[DECISION-LOG#D-004]].
> Belum ada akun, billing, atau panggilan API. Semua temuan berasal dari dokumentasi dan hasil pencarian pada 2026-11-14.

## Kebutuhan yang dipenuhi

Voice-over Bahasa Indonesia melalui API cloud; kandidat uji dengar ([[EXP-001-uji-dengar-tts]]).

## Fakta (dengan sumber)

| Aspek | Temuan | Label | Sumber | Tanggal cek |
|---|---|---|---|---|
| Suara id-ID | 38 suara: **Chirp 3 HD** (30 nama, mis. `id-ID-Chirp3-HD-Achernar`, campuran perempuan/laki-laki), **Standard** A–D (4), **WaveNet** A–D (4). Tidak ada Neural2/Studio id-ID di segmen daftar yang terbaca | VERIFIED (isi daftar) | [daftar suara](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types) (karakter 100.000–200.000 dibaca; sisa halaman tidak dibaca) | 2026-11-14 |
| Kontrol gaya bicara — Chirp 3 HD | Halaman Chirp 3 HD: `speaking_rate` 0,25–2,0; tag jeda `[pause short]` / `[pause long]` / `[pause]` (panjang tidak pasti, kadang diabaikan); pelafalan kustom IPA/X-SAMPA; **tidak ada kontrol emosi/gaya khusus**; id-ID tidak masuk daftar pengecualian. Kontrol ini ditandai Pre-GA ("as is"). **Bertentangan** dengan halaman daftar suara yang menyebut Chirp 3 HD tidak mendukung SSML maupun parameter rate/pitch | OBSERVATION; konflik antar halaman dokumentasi = UNKNOWN sampai diuji | [Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd); daftar suara | 2026-11-14 |
| Kontrol gaya bicara — Standard/WaveNet | SSML: `<break>`, `<prosody>` (rate, pitch, volume; hanya sekitar kalimat penuh), `<emphasis>`, `<say-as>`, `<phoneme>`, `<sub>`. Gaya (`google:style`, preview) hanya terdokumentasi untuk dua suara en-US | VERIFIED | [SSML](https://docs.cloud.google.com/text-to-speech/docs/ssml) | 2026-11-14 |
| Batas layanan | 5.000 byte per permintaan (teks dan SSML; tidak dapat dinaikkan). Kuota per proyek per menit: Chirp 3 = 200; Neural2/Polyglot = 1.000; Studio = 500; suara tanpa kuota khusus = 1.000 (asumsi Standard/WaveNet masuk "default": **belum dipastikan**) | VERIFIED (angka) / UNKNOWN (pemetaan Standard/WaveNet) | [kuota](https://docs.cloud.google.com/text-to-speech/quotas) | 2026-11-14 |
| Kuota gratis bulanan | Menurut ringkasan hasil pencarian atas halaman harga resmi: Chirp 3 HD 1 juta karakter gratis (lalu ± US$30/juta); Standard dan WaveNet 4 juta (± US$4/juta); Neural2 1 juta (± US$16/juta); Studio 1 juta (± US$160/juta). Ringkasan yang sama mencatat sumber lain yang menyebut WaveNet 1 juta, jadi **angka WaveNet bertentangan**. Halaman harga tidak bisa dimuat penuh lewat fetch (hanya judul) | OBSERVATION (sumber sekunder); angka WaveNet UNKNOWN | [halaman harga](https://cloud.google.com/text-to-speech/pricing) (hasil pencarian) | 2026-11-14 |
| Kartu/billing | "A Google Cloud billing account is required to access the Google Cloud Free Tier." Uji coba gratis: kredit US$300 selama 90 hari dan wajib kartu/metode bayar valid. Halaman free-features tidak memuat entri Text-to-Speech | VERIFIED | [free features](https://docs.cloud.google.com/free/docs/free-cloud-features) | 2026-11-14 |
| Biaya setelah kuota habis | "Any usage that exceeds the Free Tier usage limits is billed at standard rates." Ringkasan harga: billing harus diaktifkan dan penggunaan melebihi kuota akan dikenai biaya otomatis. Ada tidaknya batas pengeluaran keras (hard cap) di akun: **UNKNOWN** | VERIFIED (kebijakan umum) / OBSERVATION (TTS) / UNKNOWN (hard cap) | free features; hasil pencarian harga | 2026-11-14 |
| Ketentuan output untuk konten komersial | **UNKNOWN untuk TTS.** Ketentuan Layanan Google Cloud: "Generated Output is Customer Data… Google does not assert any ownership rights in any new intellectual property created in the Generated Output" (Bagian 20(a), Generative AI Services), dan larangan memakai output "AI/ML Service" untuk membangun produk pesaing atau model serupa (Bagian 17). Apakah Cloud Text-to-Speech termasuk "AI/ML Service"/"Generative AI Service" **tidak dikonfirmasi** (daftar layanan tidak dibuka; sisa 44.000 karakter halaman tidak dibaca) | UNKNOWN | [Service Terms](https://cloud.google.com/terms/service-terms) | 2026-11-14 |
| Hak/atribusi/label AI | Tidak ditemukan syarat atribusi atau pelabelan khusus TTS di halaman yang dibaca; label konten AI tetap mengikuti aturan platform (M1-01 tahap 5) | UNKNOWN | — | 2026-11-14 |
| Dukungan Bahasa Indonesia | Lihat suara id-ID di atas | VERIFIED | daftar suara | 2026-11-14 |
| Wilayah Chirp 3 HD | GA di `global`, `us`, `eu`, `asia-southeast1`, `europe-west2`, `asia-northeast1` | VERIFIED | halaman Chirp 3 HD | 2026-11-14 |

## Jalur uji Rp0 (anggaran D-004)

- **Akun cloud dan billing wajib kartu** (VERIFIED di atas) → bertentangan dengan semangat Rp0 kecuali pemilik secara eksplisit menerima kartu terdaftar dengan risiko tagihan bila kuota terlampaui. **Keputusan pemilik diperlukan.** Tidak ada akun yang dibuat.
- Pada volume uji (teks uji ± 1.000 karakter × beberapa suara × 2 ulangan ≈ puluhan ribu karakter) pemakaian jauh di bawah kuota gratis yang dilaporkan (OBSERVATION), tetapi itu perhitungan, bukan jaminan penagihan nol.
- Jika ada demo resmi di halaman produk yang bisa dicoba tanpa akun, itu bisa menjadi **pra-penyaringan** pendengaran saja (bukan untuk produksi; ketentuannya UNKNOWN). Ketersediaan demo itu belum diverifikasi.

## Hasil uji nyata

Belum diuji.

## Keputusan

- **Verdict:** pending
- **Alasan:** kandidat cloud dengan pilihan suara Indonesia terbanyak (38) dan kuota gratis dilaporkan besar; hambatan: billing wajib kartu, hard cap UNKNOWN, ketentuan output UNKNOWN.
- **Alternatif:** [[azure-speech-tts]], [[chatterbox-tts-indonesian]]
