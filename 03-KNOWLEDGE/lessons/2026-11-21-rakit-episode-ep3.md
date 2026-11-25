---
type: lesson
date: 2026-11-21
related: "[[DECISION-LOG#D-058]], [[04-PRODUCTION/2026-11-004/content|2026-11-004]] §25"
---

# Merakit episode dari shot yang dibulatkan per shot, dan memburu kedip di video utuh

## Yang terjadi
Ep 3 dirakit dari 17 shot. Setiap shot `round(dur × 30)` frame, jadi total 2076 frame, sedangkan rencana 69,15 s = 2074,5 frame. Mix memakai jam rencana.

## Pelajaran (VERIFIED di sesi ini)
1. **Gambar setiap shot pada jam global t = frame/30, bukan "awal rencana + frame lokal".** Pembulatan kumulatif menggeser potongan sampai +1,4 frame. Dengan jam lokal, setiap bunyi sesudahnya ikut terlambat 1,0–1,4 frame (gagal toleransi 1 frame). Dengan jam global, semua peristiwa ≤ 1 frame.
2. **Paksa shot per Sequence.** Frame terakhir sebuah shot bisa jatuh tepat di/sesudah akhir rencananya. Fungsi `shotOf(t)` lalu memilih kamera shot berikutnya, dan UI yang memeriksa `t < akhir` hilang satu frame. Tangkap dengan still di frame terakhir tiap shot sebelum render penuh.
3. **Metrik kedip 3 frame (|f−(f−1)|, |f−(f+1)| besar, |(f+1)−(f−1)| kecil) penuh positif palsu.** Tungkai atau tangan yang lewat satu kali sudah memicunya. Metrik yang dipakai: piksel berbalik arah ≥ 2 kali dalam 5 frame. Untuk z-fighting, abaikan piksel dekat tepi median 5 frame.
4. **Bandingkan dengan pilot yang sudah disetujui memakai metrik yang sama, dan pisahkan set dari tokoh.** Tanpa garis dasar, angka 1 % tidak berarti apa-apa. Angka seluruh bingkai memuat gerak tokoh: S13 0,70 % ternyata putar balik (tanpa tokoh 0,02–0,11 %); S10 tetap 1,28 % di ROI bingkai lukisan tanpa tokoh (pilot 0,01 % seluruh bingkai).
5. **Peringkat bukan bukti bersih.** Untuk menilai ulang satu cacat (kusen), ukur ROI-nya langsung di frame yang sesuai jam baru. Mask tepi pada pass permukaan datar membuang kusen yang tipis.
6. **Kedip jenis lain: celah caption.** Halaman caption yang berakhir 1–3 frame sebelum halaman berikutnya membuat pita caption kosong sesaat. Ini tidak tertangkap metrik bolak-balik, tetapi terlihat sebagai lonjakan luma per frame.
7. **Urutan uji yang murah untuk kedip** (masing-masing ± 1 menit render PNG 5–9 frame):
   - PNG tanpa kompresi vs mp4: memisahkan encoder;
   - skala 1 vs 0,5: memisahkan skala pratinjau;
   - concurrency 1 vs 3: memisahkan status per-tab;
   - prop diagnosis (`noChars`): memisahkan tokoh dan lampunya.

## Belum diketahui
Penyebab kerlip tepi set di S10 (UNKNOWN). Kamera monoton. Tidak terlihat di pilot.
