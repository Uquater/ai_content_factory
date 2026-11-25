---
type: lesson
date: 2026-11-16
content: "[[04-PRODUCTION/2026-11-002/content|2026-11-002]]"
decision: "[[DECISION-LOG#D-029]]"
tags: [blender, look-dev, 3d]
---

# Uji Blender v1 (D-029): satu shot 6 s, ruang tamu, saklar dimatikan

**Skill dipakai:** `video-production` (§11), target gaya [[2026-11-16-style-target-badai-matahari]]. **Ditolak pemilik** ("tidak menyukai bagaimana 3d di pakai di blender"). Blender ditinggalkan ([[DECISION-LOG#D-030]]).

**Isi:** shot L25–L26 (62,87–68,87 s audio v2). C1 mematikan saklar, lampu padam, C1 dan adik menoleh ke jendela. Karakter bertubuh + celana dari primitif dengan rig tulang dan IK tangan. Freestyle 1,4 px (tinta tipis). EEVEE 48 sampel, AgX, DoF. Audio: VO + SFX sintesis (`scripts/sfx_synth.py`), −14,0 LUFS.

**Berkas** (`_media/2026-11-002/blender_test/`):
- `ep002_blender_test_v1.mp4` (1080×1920, 30 fps, 180 frame, h264 + aac)
- `.blend`
- `sheet_v1.jpg`
- `lookdev_vs_ref_v1.jpg`

## Angka

| Ukuran | Hasil | Target |
|---|---|---|
| Waktu render | 4 m 32 s untuk 180 frame (≈ 1,5 s/frame, RTX 3050 Ti). Satu episode 98 s ≈ 75 menit. | — |
| L* lampu menyala | 38,7 | — |
| L* lampu padam | **≈ 5** (95 % piksel gelap) | 23–27 |

## Temuan (terbesar dulu)

1. **Malam terlalu gelap** (L* 5). Cahaya bulan dari jendela tidak sampai ke wajah. Referensi tetap diterangi sumber hangat yang terlihat (lampu, pintu terbuka) dengan falloff gelap. Gelap ≠ hitam total.
2. **Karakter seperti boneka kayu.** Tungkai silinder lurus, sepatu balok, tubuh kaku. Karakter referensi ramping, halus, dan proporsinya lebih kecil terhadap set. Primitif lewat kode tidak cukup; perlu mesh berbentuk (lofting/skin modifier) atau model yang dibuat khusus.
3. **Noise/bintik** di permukaan putih pada gelap (bayangan lembut EEVEE 48 sampel). Perlu sampel lebih tinggi atau denoise.
4. **Komposisi:** paruh pertama shot memperlihatkan punggung C1 dan sisi adik. Wajah baru terbaca sesudah menoleh.
5. **Tinta Freestyle 1,4 px hampir tak terlihat di gelap.** Tipis memang diminta, tetapi warnanya perlu kontras (lebih terang dari latar) di malam.

## Yang terbukti bekerja

- Sumber cahaya nyata, AO/bayangan lembut, dan DoF bawaan (sesuatu yang di three.js harus dibangun sendiri).
- Lampu padam pada frame klik; IK tangan ke saklar tepat.
- Render headless deterministik dari `.blend` (`blender -b … -a`).
- SFX sintesis dan mix −14 LUFS.

## Kesimpulan sementara (untuk pemilik)

Blender unggul untuk **cahaya dan set** (paling dekat dengan referensi). Kelemahan terbesar ada pada **karakter**: model primitif terlihat murah, dan C1 yang disetujui ada di three.js. Keputusan alat menunggu penilaian pemilik atas video ini.
