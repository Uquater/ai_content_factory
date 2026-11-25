---
type: tool-evaluation
title: "Azure Speech (Text to Speech)"
category: tts
checked-date: "2026-11-14"
created: "2026-11-14"
updated: "2026-11-14"
pricing-status: OBSERVATION
license-status: UNKNOWN
commercial-use: "paid tier only (VERIFIED 2026-11-15); F0 output not licensed for commercial use"
runs-on: [cloud-api]
verdict: pending
tags: [tool, tts, cloud]
---

# Azure Speech (Text to Speech)

> Harga, kuota, dan lisensi bisa berubah. Semua informasi hanya berlaku pada `checked-date` dan harus dicek ulang sebelum dipakai untuk produksi. Lihat [[DECISION-LOG#D-004]].
> Belum ada akun, resource, atau panggilan API. Temuan berasal dari dokumentasi Microsoft Learn dan halaman harga/akun pada 2026-11-14.

## Kebutuhan yang dipenuhi

Voice-over Bahasa Indonesia melalui API cloud; kandidat uji dengar ([[EXP-001-uji-dengar-tts]]).

## Fakta (dengan sumber)

| Aspek | Temuan | Label | Sumber | Tanggal cek |
|---|---|---|---|---|
| Suara id-ID | 6 suara: Standard `id-ID-GadisNeural` (P) dan `id-ID-ArdiNeural` (L); Neural HD `id-ID-Gadis:DragonHDLatestNeural` (P) dan `id-ID-Ardi:DragonHDLatestNeural` (L); Neural HD Flash `id-ID-Sari:MAI-Voice-2-Flash` (P) dan `id-ID-Cahya:MAI-Voice-2-Flash` (L). Tidak ada gaya/peran yang tercantum untuk id-ID | VERIFIED | [dukungan bahasa](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) | 2026-11-14 |
| Kontrol gaya — suara Standard | Mendukung "full set of SSML" (prosody rate/pitch/volume, break, emphasis, say-as, dll.). Gaya (`express-as`) untuk id-ID: tidak ada yang terdaftar | VERIFIED (SSML) / UNKNOWN (gaya id-ID) | [HD voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/high-definition-voices); tabel bahasa | 2026-11-14 |
| Kontrol gaya — suara HD | DragonHD: SSML subset (`break`, `phoneme`, `say-as`, `sub`, `lang`; **tanpa** `prosody`, `emphasis`, `express-as`); parameter `temperature`. HD otomatis mendeteksi emosi dari teks. Dragon HD Omni: `express-as` ada, tetapi catatan resmi: gaya "available on all English content for all voices" → efek gaya pada Bahasa Indonesia **UNKNOWN**; paralinguistik (tawa, napas, dll.) tersedia "on all voices with all languages". Apakah suara id-ID DragonHD memakai model DragonHD atau Omni tidak dipastikan | VERIFIED (isi dokumen) / UNKNOWN (efek pada id-ID) | halaman HD voices | 2026-11-14 |
| Batas layanan (Free F0) | Real-time TTS: **20 transaksi per 60 detik** (tidak dapat disesuaikan); audio maksimum 10 menit per permintaan; maksimum 50 tag `<voice>`/`<audio>` per SSML; SSML maksimum 64 KB per turn WebSocket. Batch synthesis: **tidak tersedia untuk F0**. Catatan resmi: HTTP 429 sering disebabkan kapasitas backend suatu suara di suatu region, bukan kuota | VERIFIED | [quotas and limits](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-services-quotas-and-limits) (diperbarui 2026-11-09 menurut metadata) | 2026-11-14 |
| Kuota gratis | Halaman harga Azure: F0 = **0,5 juta karakter Neural per bulan**. F0 untuk HD tidak tercantum (UNKNOWN). Harga pay-as-you-go: angka di halaman harga tampil kosong ("$-") pada fetch → **UNKNOWN**. Dokumentasi kuota menyebut contoh harga satuan "$15 per million characters" untuk estimasi biaya; itu contoh, bukan daftar harga | VERIFIED (0,5 juta F0 Neural) / UNKNOWN (HD gratis dan harga) | [harga](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/); halaman quotas | 2026-11-14 |
| Karakter yang ditagih | Semua huruf, angka, spasi, tanda baca, dan markup SSML (kecuali tag `<speak>` dan `<voice>`); ditagih meski audio tidak dihasilkan | VERIFIED | [TTS overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech) | 2026-11-14 |
| Kartu/billing | Akun gratis Azure wajib nomor telepon dan kartu kredit/debit **non-prabayar**; potensi hold sementara ± US$1. Kredit US$200 dalam 30 hari. Indonesia tampil dalam daftar negara tempat Azure tersedia secara komersial. Halaman menyebut Azure Speech sebagai layanan "always free" (0,5 juta karakter Neural/bulan). Setelah 30 hari atau kredit habis, harus pindah ke pay-as-you-go "otherwise, your account and services are disabled" — apakah layanan always-free tetap berjalan tanpa upgrade: **UNKNOWN** | VERIFIED / UNKNOWN (perilaku setelah 30 hari) | [akun Azure](https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account) | 2026-11-14 |
| Biaya setelah kuota F0 habis | Perilaku F0 saat kuota bulanan habis (diblokir vs. ditagih): **UNKNOWN** — tidak ditemukan pernyataan di halaman yang dibaca | UNKNOWN | — | 2026-11-14 |
| Ketentuan output untuk konten komersial | **UNKNOWN** — pernyataan eksplisit tentang kepemilikan/penggunaan komersial audio hasil TTS tidak ditemukan; Product Terms tidak dibuka. Yang ditemukan: Code of Conduct v4.0 (2026-05-01) mewajibkan pengungkapan konten buatan AI "including the synthetic nature of generated voices", melarang peniruan tanpa persetujuan, dan menyatakan pelanggan bertanggung jawab atas hak atas konten (teks masukan). Kewajiban pengungkapan itu ditujukan pada pelanggan yang membangun aplikasi; penerapannya pada pembuat konten individu **UNKNOWN** | VERIFIED (isi Code of Conduct) / UNKNOWN (komersial) | [Code of Conduct](https://learn.microsoft.com/en-us/legal/ai-code-of-conduct) | 2026-11-14 |
| Dukungan Bahasa Indonesia | Lihat suara id-ID | VERIFIED | tabel bahasa | 2026-11-14 |

### Pembaruan 2026-11-15 (cek sumber primer; detail di content.md 2026-11-001 §6.4)

| Fakta | Label | Sumber |
|---|---|---|
| Hak pakai komersial audio keluaran suara neural siap pakai **hanya untuk pelanggan tier berbayar** ("For Customers of the paid tier TTS Service only … including for commercial purposes"). Audio dari F0 tidak termasuk | VERIFIED | [Product Terms MCA](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/MCA) |
| F0 masih 0,5 juta karakter Neural/bulan; suara `id-ID-GadisNeural`, `id-ID-ArdiNeural`, varian DragonHD masih tercantum | VERIFIED | [harga](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/), [bahasa](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) |
| S1 Neural TTS US$15 per 1 juta karakter (± US$0,0075 per take 500 karakter) | VERIFIED | Azure Retail Prices API (southeastasia) |
| Tanpa kode: Audio Content Creation (unduh WAV/MP3; F0: 3.000 karakter teks per berkas) | VERIFIED | [docs](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-audio-content-creation) |
| Setelah 30 hari tanpa upgrade ke pay-as-you-go, akun dan layanan dinonaktifkan (termasuk yang always-free) | VERIFIED | [akun Azure](https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account) |
| Pemakaian S0 dari kredit trial dihitung "paid tier" | HYPOTHESIS | — |

## Jalur uji Rp0 (anggaran D-004)

- Pembuatan akun Azure wajib kartu non-prabayar (VERIFIED) → **keputusan pemilik diperlukan**; tidak ada akun yang dibuat.
- F0 (0,5 juta karakter Neural/bulan) jauh melebihi kebutuhan uji (± puluhan ribu karakter), tetapi perilaku saat kuota habis dan setelah masa 30 hari UNKNOWN; perlakukan sebagai risiko tagihan sampai dipastikan.
- Suara HD id-ID belum terbukti masuk kuota gratis F0.
- Pra-penyaringan tanpa akun: tidak diverifikasi (Voice Gallery mungkin butuh login; UNKNOWN).

## Hasil uji nyata

Belum diuji.

## Keputusan

- **Verdict:** pending
- **Alasan:** kandidat cloud dengan kontrol SSML penuh pada suara Standard dan opsi HD; hambatan: kartu wajib, perilaku kuota/biaya UNKNOWN, ketentuan output UNKNOWN.
- **Alternatif:** [[google-cloud-tts]], [[chatterbox-tts-indonesian]]
