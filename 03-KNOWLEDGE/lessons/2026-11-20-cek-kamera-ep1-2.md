---
type: lesson
created: 2026-11-20
related: "[[04-PRODUCTION/2026-11-004/content]], [[DECISION-LOG#D-047]], [[STUDIO-WORKFLOW]]"
tags: [lesson, kontinuitas, kamera, 3d]
---

# Cek kontinuitas "apakah benda ini seharusnya sudah terlihat?" tanpa render

Konteks: Ep 3 (2026-11-004) memasang kamera tersembunyi yang "sudah ada sejak awal". Pertanyaannya: apakah badan kamera itu seharusnya sudah terlihat di frame Ep 1–2?

## Metode (berhasil, < 1 menit per jalan, tanpa GPU)

1. **Kamera tiap frame diambil dari kode episode.** Kamera ditulis sebagai fungsi murni dari waktu (aturan video-production §9), jadi bisa dihitung ulang di Node:
   - Ep 1: `stage()` di `AnimaticV3.tsx`;
   - Ep 2: `episodeAt()` di `episode003Stage.ts`.
2. **File repo tidak diubah.** Fungsi yang tidak diekspor dibuka lewat plugin esbuild yang menambahkan `export` **di memori** saat bundel (`_media/2026-11-004/camcheck/build.mjs`).
3. **Setiap titik calon diproyeksikan** dengan rumus kamera `View` (fov vertikal, aspek 9:16, `lookAt`).
4. **Penghalang** = dinding `HouseInterior` (dipotong per kolom seperti `Wall`) + daun pintu dengan sudut per shot.
5. **Titik yang masuk bingkai** dicek di frame video asli: luma di kotak seukuran badan benda (ffmpeg → numpy).
6. **Grid permukaan** (ratusan titik) + **garis pandang** dari mata tokoh. Hasilnya: daftar tempat yang tidak pernah tampil **dan** bisa dilihat tokoh.

## Batas

- Furnitur dan tubuh tokoh tidak dihitung sebagai penghalang.
- Jendela bergorden dianggap terbuka.
- Hasilnya konservatif: lebih banyak "terlihat" daripada kenyataan.
- "Gelap = tidak terbaca" tetap HYPOTHESIS sampai dinilai mata.

## Temuan yang akan berulang di Ep 4–5

- **Daun pintu kamar (77°, berengsel di kusen selatan, mengayun ke ruang tamu)** menutupi seluruh kamar dari posisi akhir Ep 2 (dekat jendela depan). Kamar hanya terlihat dari sisi barat laut garis daun pintu.
- **Sumbu lorong sudah habis difilmkan** (Ep 2 S03, S06, S07, S10): apa pun yang dipasang di sumbu itu "seharusnya sudah terlihat". Tempat baru harus di luar sumbu, atau di sudut yang selalu berada di belakang kamera P.
- **Dinding timur dapur** tampil di latar Ep 2 S04 (21,4–24,6 s).
- **Lensa utama P** (Ep 1 A17, Ep 2 S01/S12) berada 1,18 m di bawah sudut langit-langit tenggara ruang tamu. Sudut itu tidak pernah masuk bingkai.

## Pakai ulang

Untuk aset "yang sudah ada sejak awal" berikutnya (mis. kamar mandi Ep 4), jalankan grid yang sama terhadap Ep 1–3 **sebelum** storyboard. Biayanya jauh lebih murah daripada still atau render.
