---
type: lesson
date: 2026-11-15
related: "[[04-PRODUCTION/2026-11-001/content|2026-11-001]], [[DECISION-LOG#D-020]]"
---

# Pelajaran: demo render C1 (2026-11-15)

1. **Ukur tanda identitas hanya di dalam area pakaian.** Dua kali posisi "Uq" salah disimpulkan karena rentang y pengukuran ikut mencakup kepala putih; yang terukur adalah pusat kepala. Setelah dibatasi ke area kaos: "Uq" di dada kiri anatomis, sesuai D-018. (VERIFIED oleh pengukuran ulang)
2. **Bandingkan pose lewat kursi dan torso, bukan bounding box.** Lengan terulur memperlebar bounding box C1_reach dari x 234 ke x 32, padahal kursi dan torso tidak bergeser. (VERIFIED)
3. **Pose statis tidak menghasilkan gerak lengan.** Yang bisa dibuat: cut ke pose baru dengan kontak jari–cangkir, lalu hanya cangkir yang digeser. Terbaca sebagai "dorong lalu lepas". (OBSERVATION dari frame MP4)
4. **Bukti "satu input berubah" harus memakai frame mentah, bukan frame MP4.** x264 (preset medium) membuat ± 37 frame sebelum titik perubahan ikut berbeda setelah decode walau gambarnya sama. (VERIFIED: frame mentah berbeda mulai 277, frame MP4 mulai 239)
5. **Still dulu, video kemudian.** `--stills` (± 1 s) menemukan wajah terlalu tinggi dan subtitle dua baris sebelum render 20 s. (OBSERVATION)
6. Waktu: dari mulai sampai MP4 lolos QC ± 12 menit kerja; render 366 frame ± 18–21 s. (OBSERVATION)
