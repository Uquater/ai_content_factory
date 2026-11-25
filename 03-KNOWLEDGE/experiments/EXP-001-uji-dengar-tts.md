---
type: experiment
id: "EXP-001"
title: "Uji dengar TTS Bahasa Indonesia untuk konten what-if dan dilema interaktif"
status: planned
channel: lab
created: "2026-11-14"
start-date: ""
end-date: ""
content-units: []
tags: [experiment, tts, m1-02]
---

# Uji dengar TTS Bahasa Indonesia untuk konten what-if dan dilema interaktif

> Rancangan saja (2026-11-14). **Belum ada audio yang dibuat, belum ada instalasi, belum ada akun cloud.** Mengisi M1-02 ([[ROADMAP]]) setelah gerbang persetujuan di bawah terpenuhi.
> Evidence untuk tiap kandidat: [[chatterbox-tts-indonesian]], [[azure-speech-tts]], [[google-cloud-tts]]; ringkasan: [[tts-ringkasan]].

## Hipotesis

Jika naskah identik what-if/dilema dibacakan oleh 2–3 kandidat TTS Bahasa Indonesia, maka minimal satu kandidat mencapai skor ≥ 3,5/5 (rata-rata) pada kealamian dan pelafalan **tanpa** penalti pada intonasi pertanyaan, karena konten ini mengandalkan pertanyaan, jeda tegang, dan perubahan emosi.

Label: HYPOTHESIS (ambang 3,5 adalah tebakan awal; dikoreksi setelah pemilik mendengar sampel pertama).

## Variabel

- **Variabel yang diuji:** mesin/suara TTS (kandidat di bawah).
- **Variabel yang dijaga tetap:** naskah identik (karakter demi karakter), kecepatan bawaan 1,0, format keluaran (WAV mono 24 kHz atau lebih tinggi bila tersedia), normalisasi loudness yang sama sebelum didengar, perangkat dengar yang sama (headphone), urutan putar diacak dan nama berkas disamarkan (uji buta).
- **Pembanding (baseline):** kandidat lokal Rp0 pasti ([[chatterbox-tts-indonesian]]) sebagai patokan biaya; tidak ada rekaman manusia sebagai pembanding.

## Kandidat (2–3)

| Kode | Kandidat | Suara yang diuji | Syarat sebelum uji | Status bukti |
|---|---|---|---|---|
| A | Chatterbox-TTS-Indonesian (lokal) | suara bawaan model; **tanpa kloning suara orang nyata** | Instal di venv Python 3.12/3.13 (HYPOTHESIS cukup; 3.11 tidak terpasang); unduh model; kelayakan 4 GB VRAM belum diketahui | OBSERVATION (deklarasi lisensi); hardware UNKNOWN |
| B | Azure Speech (cloud) | 1 perempuan + 1 laki-laki dari Standard (`id-ID-GadisNeural`, `id-ID-ArdiNeural`); opsional 1 suara HD (`id-ID-Gadis:DragonHDLatestNeural`) bila masuk kuota gratis (UNKNOWN) | Akun Azure (kartu non-prabayar wajib), resource Speech F0 | VERIFIED (daftar suara, batas); biaya/komersial UNKNOWN |
| C | Google Cloud TTS (cloud) | 1 perempuan + 1 laki-laki dari Chirp 3 HD id-ID; WaveNet id-ID sebagai pembanding hemat | Akun Google Cloud + billing aktif (kartu wajib) | VERIFIED (daftar suara, billing); kuota gratis OBSERVATION; komersial UNKNOWN |

Aturan: bila pemilik menolak kartu, uji dilakukan hanya untuk A, ditandai **tidak lengkap** (syarat 2–3 kandidat M1-02 belum terpenuhi), dan kandidat lokal tambahan harus ditelaah dari sumber primer (lihat daftar "belum terverifikasi" di [[tts-ringkasan]]) sebelum M1-02 dianggap selesai.

## Naskah uji (identik untuk semua kandidat)

Naskah fiktif untuk pengujian suara; **bukan** klaim faktual dan bukan konten untuk dipublikasikan. ± 760 karakter.

```
[S1 — pembuka pertanyaan]
Bayangkan, besok pagi kamu bangun, dan semua ponsel di dunia mati. Selamanya. Apa yang kamu lakukan pertama kali?

[S2 — jeda tegang]
Tidak ada peta. Tidak ada pesan. Tidak ada kabar dari keluarga... dan jam alarm pun diam.

[S3 — dilema]
Sekarang pilih. Selamatkan satu orang yang paling kamu sayang, atau lima orang yang tidak kamu kenal? Jangan jawab dulu. Pikirkan sampai hitungan ketiga. Satu... dua... tiga.

[S4 — angka dan istilah campuran]
Misalkan pada tahun 2045, 80 persen pekerjaan berubah karena AI, dan gajimu naik jadi Rp15.000.000 per bulan. Apakah kamu tetap bahagia? Ceritakan di kolom komentar TikTok atau WhatsApp temanmu.

[S5 — emosi]
Dan di detik itu, kamu sadar... semuanya sudah terlambat! Tidak. Tunggu. Masih ada satu pilihan lagi. Kamu pilih A, atau B?
```

Cakupan uji dalam naskah: pertanyaan retoris (S1, S3, S4, S5), jeda tegang (titik, elipsis, kalimat pendek berurutan; S2), hitungan (S3), angka/mata uang/persentase/singkatan/merek (S4: "2045", "80 persen", "Rp15.000.000", "AI", "TikTok", "WhatsApp"), perubahan emosi mendadak dan seruan (S5).

## Protokol

**Putaran A — teks polos, pengaturan bawaan** (wajib). Naskah apa adanya; tanpa SSML, tanpa tag emosi, tanpa penyesuaian kecepatan.

**Putaran B — kontrol jeda** (opsional, bila A lolos). Hanya satu perubahan: jeda dikontrol dengan mekanisme resmi masing-masing (A: tanda baca; B: `<break>` pada suara Standard; C: tag `[pause]` pada Chirp 3 HD atau `<break>` pada Standard/WaveNet). Tujuan: tahu apakah jeda tegang bisa diperbaiki. Catatan: konflik dokumentasi soal SSML Chirp 3 HD (lihat [[google-cloud-tts]]) diuji di sini; hasilnya mengubah label dari UNKNOWN.

**Langkah:**
1. Hasilkan 2 ulangan per suara per putaran (cek konsistensi). Catat waktu dinding per segmen dan total.
2. Normalisasi loudness semua berkas dengan FFmpeg ke target yang sama (nilai target ditetapkan sebelum uji; contoh −16 LUFS integrated — HYPOTHESIS, cek rekomendasi platform sebelum final).
3. Ganti nama berkas ke kode acak; simpan peta kode→suara terpisah sampai penilaian selesai. Aset di `_media/EXP-001/` (tidak masuk Git).
4. Pemilik mendengarkan per segmen S1–S5, mengisi rubrik, **sebelum** melihat peta kode.
5. Hitung rata-rata, isi tabel operasional, putuskan.

## Rubrik penilaian (1–5 per segmen, pemilik sebagai penilai)

| Kriteria | Segmen utama | 1 | 3 | 5 |
|---|---|---|---|---|
| Kealamian | semua | terdengar robotik, ritme mekanis | cukup enak, sesekali kaku | sulit dibedakan dari narator manusia |
| Pelafalan | S4 (daftar cek di bawah) | salah jelas, mengganggu | satu–dua salah kecil | semua tepat |
| Jeda tegang | S2, S3 | tidak ada jeda atau jeda salah tempat | jeda ada tetapi datar | jeda terasa disengaja dan membangun ketegangan |
| Intonasi pertanyaan | S1, S3, S4, S5 | pertanyaan terdengar seperti pernyataan | naik di akhir tetapi tidak konsisten | naik wajar, jelas bertanya |
| Emosi | S5 (juga S1–S3) | datar | ada variasi tetapi tidak sesuai | kejutan/ketegangan terdengar pas |
| Konsistensi antar ulangan | semua | dua ulangan berbeda jauh dan tak terkendali | variasi kecil | stabil, atau variasi alami yang tetap baik |

**Daftar cek pelafalan (centang per kandidat):** "ponsel"; "2045" dibaca "dua ribu empat puluh lima"; "80 persen"; "Rp15.000.000" dibaca "lima belas juta rupiah"; "AI" (catat dibaca "a-i", "ei-ai", atau lain; pemilik menentukan bacaan yang diterima); "TikTok"; "WhatsApp"; elipsis tidak dibaca sebagai bunyi aneh; hitungan "satu... dua... tiga" memberi jeda.

**Skor ringkas:** rata-rata per kriteria per kandidat. Bobot (HYPOTHESIS, bisa diubah sebelum mendengar): kealamian 25%, pelafalan 20%, intonasi pertanyaan 20%, jeda tegang 15%, emosi 15%, konsistensi 5%. Skor adalah alat bantu keputusan, bukan pengukuran objektif ([[CLAUDE]] §6 Stage 2).

## Metrik operasional (diisi dari log, bukan perkiraan)

| Metrik | Cara ukur | A Chatterbox-ID | B Azure | C Google |
|---|---|---|---|---|
| Waktu proses total (detik) dan faktor waktu nyata (waktu proses ÷ durasi audio) | stopwatch skrip per segmen; catat kondisi (GPU/CPU, jaringan, panggilan pertama vs berikutnya) | | | |
| Karakter yang ditagih/terpakai | hitung masukan; Azure: sertakan markup SSML (kecuali `<speak>`/`<voice>`); Google: batas 5.000 byte per permintaan | | | |
| Pemakaian kuota gratis (%) | karakter terpakai ÷ kuota gratis yang terkonfirmasi | n/a | | |
| Biaya aktual (Rp) | tagihan/penggunaan di konsol; target Rp0 | | | |
| Usaha pemasangan (menit, kendala) | catat manual | | | |
| Kegagalan/galat (429, timeout, VRAM habis) | log | | | |
| Risiko lisensi/ketentuan | dari catatan tool; sisa UNKNOWN dicatat | | | |

## Kriteria keputusan (HYPOTHESIS)

- Kandidat **lolos** bila: rata-rata berbobot ≥ 3,5; tidak ada kriteria dengan rata-rata < 3,0; tidak ada salah pelafalan yang mengganggu pada S4; biaya aktual Rp0.
- Beberapa lolos → pilih yang Rp0 pasti dan lisensinya paling jelas; seri → pilih yang punya kontrol jeda terbaik (Putaran B).
- Tidak ada yang lolos → catat sebagai temuan, perluas kandidat (daftar "belum terverifikasi"), jangan menurunkan ambang demi menyelesaikan M1-02.
- Keluaran: catatan `verdict` di tiap catatan tool (`adopted`/`backup`/`rejected`), entri baru di [[DECISION-LOG]] bila ada pemilihan tool.

## Gerbang persetujuan 🔒 (tidak ada yang dijalankan tanpa ini)

| # | Tindakan | Siapa memutuskan | Catatan risiko |
|---|---|---|---|
| G1 | Membuat venv dan memasang paket Chatterbox-ID, mengunduh model | pemilik | Ukuran unduhan dan kompatibilitas Windows UNKNOWN; isolasi venv; tanpa mengubah Python global |
| G2 | Membuat akun Azure dan/atau Google Cloud | pemilik | **Kartu wajib** (VERIFIED); perilaku kuota/hard cap UNKNOWN → risiko tagihan; dilakukan oleh pemilik sendiri; saya tidak memasukkan data kartu |
| G3 | Menyimpan kunci API | pemilik | Kunci hanya di lingkungan lokal/`.env`, tidak masuk Git ([[ARCHITECTURE]] §10) |
| G4 | Menjalankan uji dan menyimpan audio di `_media/EXP-001/` | pemilik | Audio uji bukan untuk dipublikasikan sebelum ketentuan output dipastikan |

## Hasil

| Kandidat | Suara | Putaran | Skor berbobot | Biaya | Waktu | Catatan |
|---|---|---|---|---|---|---|
| | | | | | | |

Konteks pembanding: satu penilai (pemilik) → OBSERVATION saja, bukan bukti generalisasi. Bila memungkinkan, minta 2–3 pendengar tambahan berbahasa Indonesia penutur asli.

## Kesimpulan

- **Hipotesis didukung?** belum diuji
- **Label kesimpulan:** UNKNOWN
- **Keterbatasan:** satu naskah, satu penilai, sampel kecil; perangkat dengar mempengaruhi; kualitas suara cloud dapat berubah antar versi model.

## Tindak lanjut

- **Eksperimen berikutnya:** uji dengan naskah konten nyata (M1-05) memakai pemenang; uji ketahanan subtitle (selaraskan dengan speech-to-text, M1-01 tahap 3).
- **Pelajaran dicatat di:** `03-KNOWLEDGE/lessons/`
- **Keputusan baru (bila ada):** [[DECISION-LOG]]
