---
type: lesson
date: 2026-11-18
content-unit: "2026-11-003"
related: "[[DECISION-LOG#D-038]], [[04-PRODUCTION/2026-11-003/content|2026-11-003]] §7.2, [[STUDIO-WORKFLOW]] §8.2"
tags: [lesson, look-dev, kamera, tangan]
---

# Look-dev dapur v3 (Ep 2): hitung dulu, lalu render

1. **Hitung kelayakan kamera sebelum still.** Close-up "dari arah pintu" tidak mungkin karena ruang wajah–pintu hanya 0,56 m. Rasio perspektif depan/pusat kepala menjadi 1,56, sedangkan pada 2,2 m hanya 1,09. Alat: `studio/tools/ld003_v3_calc.ts` (jarak, rasio perspektif, fov yang dibutuhkan, sisi garis 180°, ukuran objek di bingkai).
2. **Klaim garis 180° harus dihitung, bukan dikira.** Laporan v2 menyebut semua kamera di sisi barat; hitungan menunjukkan S03 v2 berada 0,71 m di sisi timur. Sisi garis sekarang dicetak oleh alat dan ditulis di denah dari data.
3. **Ukuran tokoh di latar depan dibatasi ruangan.** Bila kamera hanya bisa 3,95 m dari adik dan 6,7 m dari Uq, adik selalu tampak lebih besar daripada Uq. "Kecil" hanya bisa dicapai dengan lensa lebih lebar (objek jauh ikut mengecil) atau dengan memindahkan tokoh keluar dari garis pandang.
4. **Batas tangan C1:** jari punya satu sendi dan panjang 3,1 cm, jadi tidak bisa melingkari ponsel setebal 0,9 cm sampai ke layar. Yang bisa dicapai adalah jari mengait tepi. Pergelangan (r 1,15 cm) lebih tebal dari telapak (0,75 cm), sehingga benda pipih yang menempel di telapak selalu menyentuh pergelangan. Cek kontak jari–benda di Node sebelum render (`fingerSamples`, `gripPhone`).
5. **Buktikan sumber cahaya wajah dengan diagnostik.** Render tanpa lampu karakter dan render tanpa cahaya bocor menunjukkan bahwa cahaya bocor yang menerangi wajah.
6. **Label pada gambar dibuat dari angka hasil hitungan.** Label "2,3 m" yang basi di render K1 v2 adalah akibat label yang diketik tangan.
7. **Heredoc Python lewat Git Bash rapuh** untuk teks panjang yang memuat kutip. Tulis skrip atau teks ke berkas dulu, lalu jalankan.

## Tambahan: membangun pilot S03–S06 (2026-11-18, D-039)

8. **Still yang sudah disetujui tetap harus dicek angka sebelum dianimasikan.** Pegangan samping g2 di still a lolos tinjauan mata, tetapi `c1ArmTorsoDepth` = 5,3 cm (lengan bawah di dalam kaos). Jalankan cek lengan-vs-torso pada setiap pose still, bukan hanya pada gerak.
9. **Perpindahan dari pose animasi (ayunan jalan) ke IK** bisa melompat 26–39°/frame karena IK memilih cabang lain. Interpolasikan sudut dari pose awal ke solusi IK di titik akhir, lalu lanjutkan dengan IK. Lompatan dicek per frame (`tools/p003_check.ts`).
10. **Lampu karakter bisa menutupi peristiwa cahaya.** Rim di belakang kepala membuat pintu tetap hangat sesudah senter mati, sehingga senter mati tidak terbaca. Untuk shot yang ceritanya perubahan cahaya, matikan rim karakter dan bandingkan frame sebelum dan sesudah.
11. **Benda di tangan dekat lensa insert bisa menutupi aksi.** Ponsel menutup kenop dari kamera barat. Turunkan bendanya atau pindahkan kamera, lalu cek still sebelum render penuh.
12. **Kedipan mata deterministik** (`blinkAt`) bisa jatuh tepat di wajah reaksi. Pilih seed yang tidak berkedip di jendela itu.
