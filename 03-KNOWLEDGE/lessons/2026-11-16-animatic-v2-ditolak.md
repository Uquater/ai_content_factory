---
type: lesson
date: 2026-11-16
related: "[[04-PRODUCTION/2026-11-002/content|2026-11-002]] §11, [[DECISION-LOG#D-027]], [[2026-11-16-ep002-animatic]]"
---

# Animatic v2 2026-11-002 ditolak pemilik: diagnosis

Penilaian pemilik: "banyak yang tidak masuk akal, dan bisa saya bilang jelek". Semua pemeriksaan teknis lulus (frame, audio, kontak, selip kaki). Itu tidak berarti apa-apa bagi kualitas yang diinginkan.

## Pembanding
Video referensi yang dipilih pemilik: "Badai Matahari – Episode 1" (handoff §3; MP4 lokal di Downloads). **Video ini tidak pernah dibuka di sesi produksi** sebelum penolakan.

Hasil contact sheet tiap 2 detik (OBSERVATION):

| Aspek | Referensi | Animatic v2 kita |
|---|---|---|
| Cahaya malam | gelap sungguhan; satu warna dominan kuat (langit merah aurora) memberi suasana; kontras tinggi | ungu-lavender pucat merata; "jam dua pagi" terlihat seperti senja |
| Skala | kerumunan besar, wide/aerial kota, lampu jalan dan kabel | rumah kosong, ruang sempit, 3–6 warga |
| Kamera | gerak kontinu, sedikit potongan (± 16 perubahan adegan dalam 90 s) | 77 potongan keras dalam 100 s, banyak tahan statis (A07b 10,6 s, A04 6,2 s) |
| Lensa | lebar untuk set, close-up dengan bokeh kerumunan | fov 26–56°, mayoritas 28–42° (datar/telefoto; skill inkbeat: set 60–80°) |
| Set | padat detail, kedalaman (atap, tiang, kabel, menara air) | dinding polos besar, < 12 properti per bingkai |
| Akting | pose bermakna, siluet, isyarat | berdiri kaku, tanpa gerak bibir, aksi penting masih blocking |
| UI | HUD jam "20:14", subtitle putih + kata kunci hijau-kuning, kartu pilihan "APA PILIHANMU?" + "LANJUT EPISODE 2" | subtitle saja; ponsel 2D melayang tanpa tangan; kartu kecil |
| Suara | (belum didengar) | hanya narasi; tanpa ambience, musik, SFX |

## Hal yang "tidak masuk akal" di v2 (contoh)
- A01: kota terang kebiruan, tidak terbaca sebagai jam dua pagi.
- A02–A03: kepala raksasa di samping kasur berbentuk balok putih; duduk dilihat dari samping, kaki tertutup balok selimut.
- A05: gorden memenuhi bingkai; yang terlihat fasad rumah seberang, bukan warga keluar.
- A06: adik kecil di pintu jauh, separuh bingkai tertutup kepala C1.
- A07: ponsel 2D melayang di atas dinding blur, tanpa tangan (melanggar aturan inkbeat: UI harus menempel pada objek).
- A12: saklar raksasa di dinding kosong. Ruang "gelap" sesudah lampu mati tetap terang lavender, padahal itu momen kunci.
- A14: warga kecil di balik palang jendela dan pagar; tolehan sulit terbaca.
- A15–A17: tangan bertemu tanpa terbaca menggenggam; pan melewati dinding dan sofa kosong; pilihan akhir tidak terasa.

## Akar masalah (proses dan dokumen)
1. **Tidak ada target gaya dari referensi pemilik.** Dokumen gaya proyek mencampur aturan 2D Google Flow (master prompt, CHANNEL-DNA, STUDIO-WORKFLOW) dengan stillsheet C1. Tidak ada angka terukur dari video referensi (terang, warna, potongan, lensa, kepadatan).
2. **Aturan kerajinan skill inkbeat tidak dipakai.**
   - Skill inkbeat hanya ada di `refrences/`, tidak aktif.
   - Skill proyek `video-production` v0.3 mengatur determinisme dan keamanan, tetapi tidak mengatur lensa, ritme kamera, kepadatan properti, cahaya malam, motion blur, gerbang look-dev, atau gerbang pilot.
3. **Storyboard §4 ditulis dengan tata bahasa film panjang** ("statis", potongan klasik), bukan ritme Shorts referensi. Persetujuan pemilik diberikan atas teks, tanpa gambar look-dev.
4. **Gerbang look-dev dan pilot dilewati.** Set, kamera, dan cahaya langsung dirender penuh. Still kunci hanya dinilai Claude untuk "terbaca", bukan untuk "bagus".
5. **Mood `night` bawaan (lavender pucat) diterima apa adanya**, meski pembangun set sudah melaporkan bahwa malam terlihat seperti senja.
6. **Set dibangun cepat oleh sub-agen dengan brief "sederhana tapi meyakinkan"**, sehingga ruangannya jarang isi.
7. **QC berfokus pada teknis.** Laporan menyebut hasil "terbaca" sebagai keberhasilan; ini mengulang pola penolakan 2026-11-15.

## Arah perbaikan (usulan, belum dikerjakan)
1. Pelajari video referensi secara terukur. Buat "style target" dengan angka: L*, warna dominan/aksen, potongan per menit, durasi tahan, fov, ukuran wajah, kepadatan set, UI.
2. Masukkan aturan kerajinan inkbeat dan style target ke skill proyek.
3. Look-dev: satu still per set dalam cahayanya, berdampingan dengan frame referensi. **STOP** untuk pemilik.
4. Pilot 15 detik pertama dengan audio + ambience. **STOP**.
5. Baru setelah itu animatic penuh.
