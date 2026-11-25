---
type: lesson
date: 2026-11-20
related: "[[DECISION-LOG#D-057]], [[04-PRODUCTION/2026-11-004/content|2026-11-004]] §24"
---

# Kusen berkedip, lensa storyboard yang tidak muat, dan kelompok B/C Ep 3

1. **Bidang berimpit = kedip saat lensa bergerak.** `Door` (sets.tsx) menaruh sisi dalam kusen tepat di sisi bukaan dinding; `Sofa` menaruh sisi lengan sebidang dengan dudukan. Pola gerigi berubah tiap frame begitu fov/kamera bergerak. Perbaikan aditif yang lolos (VERIFIED, S12): kotak pembungkus 2 mm di luar setiap sisi terlihat, potongan tidak saling tumpang tindih. Buffer 24-bit, near 0,02 → 2 mm aman ± 70×.
2. **Ukur kedip dengan ROI di dalam bidang, divalidasi di "sebelum".** Selisih antarframe rata-rata saja menyesatkan saat kamera bergerak: tekstur di tepi bingkai ikut bergeser. Tambahkan "% piksel > 8 tingkat" dan titik panas blok 16 px; jumlah blok jenuh (255) di S03 ternyata tepi lantai yang bergerak, bukan kedip — selalu lihat crop.
3. **Lensa storyboard dihitung untuk posisi lama.** S04/S07 storyboard (fov 30/26) dihitung dengan adik 0,39 m dari Uq; cadangan S02 menaruhnya 0,64 m → kepala Uq terpotong. Hitung ulang posisi wajah (pusat kepala C1 ± radius besar) sebelum render.
4. **Menoleh ke pasangan di sisi jauh dari lensa = wajah hilang.** Dari lensa di kiri Uq, kepala −30° ke adik memperlihatkan bagian belakang kepala. Cek arah kepala terhadap lensa, bukan hanya terhadap pasangan.
5. **Pola lensa sisipan episode lama tidak bisa dipindah begitu saja.** Lensa depan-kanan Ep 2 S08 tertutup badan adik di Ep 3 (adik berdiri di sana). Cek oklusi tokoh lain sebelum render sisipan.
6. **Tanda bidik:** menaikkan titik bidik membuat tokoh turun di layar. Hitung, jangan tebak.
