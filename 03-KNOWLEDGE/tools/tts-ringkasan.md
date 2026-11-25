---
type: research-note
title: "Ringkasan kandidat TTS Bahasa Indonesia (M1-01 tahap 1)"
checked-date: "2026-11-14"
created: "2026-11-14"
updated: "2026-11-14"
tags: [tool, tts, ringkasan]
---

# Ringkasan kandidat TTS Bahasa Indonesia

Riset 2026-11-14. Harga dan lisensi dapat berubah; cek ulang sebelum produksi. Prioritas: lisensi yang mengizinkan penggunaan komersial ([[ARCHITECTURE]] §7.4). Rancangan uji dengar: [[EXP-001-uji-dengar-tts]].

**Kesimpulan terbatas:** dari kandidat yang **sudah ditelaah** sejauh ini, Chatterbox-ID adalah kandidat lokal dengan deklarasi lisensi paling jelas, sedangkan Azure Speech dan Google Cloud TTS adalah dua kandidat cloud yang memiliki suara id-ID. Ini bukan klaim bahwa tidak ada kandidat lain. Kelayakan hardware lokal belum diuji. Syarat M1-02 (2–3 kandidat) bisa dipenuhi hanya bila pemilik menyetujui akun cloud dengan kartu (G2) atau kandidat lokal tambahan ditelaah.

## A. Kandidat yang ditelaah dari sumber primer

| Tool | Lisensi/ketentuan | Hardware / biaya | Hambatan | Status |
|---|---|---|---|---|
| [[chatterbox-tts-indonesian]] | Apache 2.0 (deklarasi); rantai lisensi dicek sampai kartu model/dataset | 0,5B; VRAM UNKNOWN; Rp0 | Instalasi belum disetujui; Windows wheel UNKNOWN; basis tak dirawat | pending |
| [[azure-speech-tts]] | Ketentuan output komersial UNKNOWN | F0 0,5 juta karakter Neural/bulan (VERIFIED); kartu non-prabayar wajib untuk akun | Kartu; perilaku kuota/biaya UNKNOWN | pending |
| [[google-cloud-tts]] | Ketentuan output TTS UNKNOWN | Kuota gratis OBSERVATION (sumber sekunder); billing + kartu wajib | Kartu; hard cap UNKNOWN | pending |
| [[voxcpm2]] | Apache-2.0 (deklarasi) | Konfigurasi standar ~8 GB VRAM > 4 GB; jalur alternatif UNKNOWN | Konfigurasi standar tidak memenuhi | pending (tidak diuji tahap 1) |
| `facebook/mms-tts-ind` | CC-BY-NC 4.0 (model card, dibaca langsung) | 36,3M parameter | Non-komersial → tidak cocok bila channel dimonetisasi | tidak dipakai untuk produksi komersial (VERIFIED dari sumber primer) |
| ElevenLabs Free | Lisensi komersial tidak termasuk di Free (halaman harga dibaca langsung); dukungan Indonesia tidak terkonfirmasi di halaman itu | 10.000 kredit/bulan | Free tidak untuk komersial | tidak cocok untuk produksi komersial pada paket Free (VERIFIED dari sumber primer; paket berbayar tidak dievaluasi) |

## B. Belum terverifikasi (sumber pihak ketiga atau ringkasan pencarian; **bukan** ditolak)

| Kandidat | Yang diketahui sejauh ini | Sumber | Status | Yang perlu dicek |
|---|---|---|---|---|
| Piper, voice Indonesia | Pihak ketiga (tts.ai) menyebut "personal and non-commercial use only" untuk voice Indonesia; pihak yang sama menyebut mesin Piper berlisensi MIT dan tiap voice punya lisensi sendiri | [tts.ai](https://tts.ai/voices/piper/?lang=id) | **UNVERIFIED** | Lisensi voice di repo/kartu Piper asli dan dataset |
| `Eempostor/F5-TTS-INDO-FINETUNE` (dan V2) | Ringkasan pencarian: CC-BY-NC karena data Emilia | [HF](https://huggingface.co/Eempostor/F5-TTS-INDO-FINETUNE) | **UNVERIFIED** | Kartu model dibaca langsung |
| `drat/TTS-Indonesia-Gratis` | Ringkasan pencarian: kode MIT tetapi tulisan "DO NOT USE FOR COMMERCIAL PURPOSES" | [GitHub](https://github.com/drat/TTS-Indonesia-Gratis) | **UNVERIFIED** | README dan lisensi model dibaca langsung |
| `PapaRazi/Ijazah_Palsu_V2` | Ringkasan pencarian: non-komersial | [HF](https://huggingface.co/PapaRazi/Ijazah_Palsu_V2) | **UNVERIFIED** | Kartu model; nama model juga mencurigakan, cek asalnya |
| `Ellbendls/csm-1b-indonesian-fine-tuned` | Ringkasan pencarian: Apache-2.0 | [HF](https://huggingface.co/Ellbendls/csm-1b-indonesian-fine-tuned) | **UNVERIFIED** | Kartu model, lisensi dataset, hardware |
| `mengetik/mengetik-voice-id-onnx` | Ringkasan pencarian: CC-BY-4.0; melarang peniruan suara/penipuan | [HF](https://huggingface.co/mengetik/mengetik-voice-id-onnx) | **UNVERIFIED** | Kartu model, dataset, hardware |
| Microsoft Edge TTS (library tidak resmi `edge-tts`) | Tidak ditelaah. Jalur tidak resmi mungkin melanggar ketentuan layanan | — | **UNKNOWN** | Jangan dipakai sebelum diverifikasi; gunakan Azure Speech resmi |

## Riwayat

| Tanggal | Perubahan |
|---|---|
| 2026-11-14 | Dibuat (tahap 1) |
| 2026-11-14 | Direvisi: kandidat berbasis sumber sekunder diberi status UNVERIFIED (bukan ditolak); Google Cloud TTS dan Azure Speech ditambahkan; klaim "satu-satunya kandidat lokal layak" dihapus |
