---
type: lesson
date: 2026-11-17
content-id: "2026-11-003"
tags: [lesson, lighting, look-dev, 3d]
---

# Look-dev dapur Episode 2: cahaya senter ke kaca lubang angin

**Konteks:** still look-dev a–e untuk storyboard v0.3 (D-037). Berkas: `_media/2026-11-003/out/lookdev_dapur_v1/`; catatan lengkap di [[04-PRODUCTION/2026-11-003/content|2026-11-003]] §7.

1. **Bahan `coreMat` (`MeshBasicMaterial`) tidak menerima cahaya.** Benda yang ceritanya harus berubah oleh cahaya di adegan (kaca lubang angin) perlu bahan yang menerima cahaya (Lambert/toon) dengan warna lama sebagai emisif dasar. Cek bahan dulu sebelum merancang efek cahaya.
2. **Hitung geometri sebelum menjanjikan efek cahaya.** Dari 0,15 m, senter di gerendel tidak bisa menerangi kaca 1,2 m di atasnya (model: ± 0 %). Dari ± 0,9 m dan sorot diarahkan ke kaca, kaca mendapat ± 22 % iluminasi gerendel, dan perubahan terbukti terbaca di still (R/B 0,60 → 0,91).
3. **Posisi benda yang disetujui bisa tertutup tokoh dari sudut kamera tertentu.** Gerendel tepat di depan Uq tidak terlihat dari belakang. Cek setiap benda penting dari setiap kamera yang direncanakan.
4. **"Diredupkan" ≠ "ditutup telapak".** Mengurangi intensitas spot tidak mengubah bentuk kolam cahaya; tutupan tangan butuh bentuk cahaya sendiri.
5. **Cek isi frame referensi sebelum diberi label.** Pemilihan dari contact sheet 1/4 fps meleset ± 2 s (frame "lilin" ternyata keran, "pintu" ternyata aurora). Ambil ulang frame dan lihat dulu.

## Tambahan look-dev v2 (2026-11-17)

6. **`CastLight` menerangi set, bukan hanya tokoh.** Rim-nya 0,85 m di belakang tokoh dan 0,55 m di atas kepala, dengan jangkauan 2,4 m. Bila tokoh berdiri dekat dinding/pintu, rim itu menerangi langit-langit, daun pintu, dan kusen: cahaya tanpa sumber yang termotivasi. Diagnosis termurah: render dengan senter mati, lalu dengan CastLight mati, dan bandingkan luma area itu (139 → 25,5).
7. **Kamera 9:16: cek lebar horizontal, bukan hanya jarak.** Sudut horizontal bingkai vertikal sempit (fov vertikal 46° ≈ 27° horizontal). Pilih kamera dengan solver yang memasukkan semua titik penting plus lebar kepala, dan cek benda yang menghalangi di depan lensa (rak).
8. **Tokoh yang menghadap benda penting tidak bisa terbaca wajahnya bersama benda itu dari depan.** Bagi momen menjadi shot (dari belakang untuk benda, insert untuk tangan, wajah di shot lain) atau ubah blocking.
9. **Cek jarak tubuh numerik menangkap clipping sebelum render** (adik v1: −7,2 cm). Satu sumber posisi untuk render dan cek (`ld003Scene.ts`) mencegah angka dan gambar berbeda.
10. **ID komposisi Remotion hanya boleh huruf, angka, dan tanda hubung** (tanpa garis bawah); satu ID salah menggagalkan semua render dari bundle itu.
