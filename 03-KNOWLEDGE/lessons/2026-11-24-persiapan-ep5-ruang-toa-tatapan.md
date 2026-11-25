---
type: lesson
date: 2026-11-24
content-id: "2026-11-006"
topic: persiapan visual Ep 5 sebelum VO (lokasi ruang toa, tatapan ke lensa, raihan kamera)
status: angka dan still grey box; belum look-dev
---

# Persiapan Ep 5: ruang toa, tatapan, raihan

Sumber: `studio/tools/e006_prep.ts` (hasil `_media/2026-11-006/prep/e006_prep.txt`), still `studio/src/ep006/Prep006.tsx` (`_media/2026-11-006/prep/stills/`), frame Ep 1 final (`_media/2026-11-006/prep/kontinuitas/`). Rincian: [[04-PRODUCTION/2026-11-006/content]] §2.2–§2.3.

1. **Cek frame lama sebelum menaruh bangunan baru.** Pangkal tiang toa terlihat bersih di Ep 1 A01 (0–1,6 s). Proyeksi kotak ke kamera literal di `AnimaticV3.tsx` cocok dengan frame (titik ruang di px ± (928, 677) = posisi tiang di frame). Proyeksi + oklusi kotak rumah adalah cek murah; biasnya dua arah: tanpa pohon/pagar (condong "terlihat") dan atap kotak padat (condong "tertutup" dekat lisplang). Konfirmasi dengan render set + kotak warna (Ep 5: cyan muncul di tempat yang sama dengan angka).
2. **Jangkau lengan C1 pendek:** telapak sampai ± 0,35 m di depan mata dengan condong 10°, kaki diam. Benda yang harus diraih dari posisi berdiri harus sedekat itu, atau tokoh melangkah dulu.
3. **Urutan memilih kamera untuk aksi tangan ke lensa:** batas jangkau → jarak lensa → fov. Mulai dari fov membuat kepala 109–124 % bingkai (run pertama).
4. **Kontak mata** = lensa setinggi mata dan lurus di depan wajah (0,0°), ukur dari titik mata, bukan pusat kepala.
5. **Alis baru di tekstur wajah** (`brows: "lowered"`) cukup sebagai cabang ternary tambahan. Uji still-diff `C1_LOOK`: dua render dari kode yang sama pun berbeda maks 1/255 (derau GPU), jadi bandingkan selisih sebelum/sesudah dengan selisih dua render identik, bukan dengan `None`.
6. **Lensa close-up inkbeat 40–50°** hanya tercapai pada 0,6–0,9 m dari mata C1; lebih dekat butuh lensa lebar (kepala terpotong).
