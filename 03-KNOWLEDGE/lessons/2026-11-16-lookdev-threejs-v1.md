---
type: lesson
date: 2026-11-16
content: "[[04-PRODUCTION/2026-11-002/content|2026-11-002]]"
decision: "[[DECISION-LOG#D-030]]"
tags: [look-dev, threejs, 3d]
---

# Look-dev three.js v1 (2026-11-002): tubuh bertubuh, tinta tipis, malam

**Skill dipakai:** `video-production` §11, `inkbeat-shorts` (SKILL.md: look, karakter, gates), target gaya [[2026-11-16-style-target-badai-matahari]]. **Status:** menunggu pemilik (gerbang S6).

**Berkas:** `_media/2026-11-002/out/lookdev_v1/`:
- `lookdev_v1_vs_ref.jpg` (2 frame referensi + 4 still kita, dengan angka);
- `lookdev_v1_{tamu,gelap,kamar,jalan}.png`.

**Kode (semua aditif, default lama tidak berubah):**
- `StickLook.limbs` (lengan putih bertubuh, celana sampai mata kaki, sepatu inkbeat `shoeGeo`) dan `StickLook.inkK` di `studio/src/c1/C1.tsx`.
- `NpcPreset.limbs/inkK` di `cast/npc.tsx`.
- `HouseInterior moon` di `ep002/sets.tsx`.
- Komposisi `LookDev002-<view>` di `ep002/LookDev.tsx` (usulan `C1_BODIED`, `ADIK_B`, `BAPAK_B`, `IBU_B`).
- Alat ukur `studio/tools/style_measure.py`.
- Pemeriksaan C1Sheet sebelum dan sesudah: selisih maksimum 1/255, sama dengan selisih antara dua render dari kode yang sama (noise GPU).

## Angka (metode target gaya: L* rata-rata, piksel L* < 15)

| Still | L* | Gelap |
|---|---|---|
| Referensi, interior lampu (2 frame) | 12,6 / 13,1 | 71 / 74 % |
| tamu (lampu) | 40,7 | 9 % |
| tamu gelap | 29,2 | 25 % |
| kamar | 25,1 | 17 % |
| jalan | 24,3 | 27 % |

## Temuan (terbesar dulu)

1. **Interior masih jauh lebih terang dan rata dibanding referensi.** Di referensi, cahaya berupa genangan dari satu sumber dan sudut ruangan jatuh ke hitam. Di set kita, dinding terang merata.
   - Penyebab: lampu titik set (intensitas 9, decay 1,6, distance 8), plus lampu rim/key mood yang directional.
   - Rim mood night 2,4 adalah sumber terang utama yang tersembunyi.
2. **Set kosong:** properti per bingkai jauh di bawah 12 (dinding polos).
3. **Bulan di `gelap` membuat dinding dekat jendela putih terang.**
4. **Pose kaku** (berdiri lurus, menatap kamera); ini still look-dev, belum akting.

## Yang berhasil

- Tubuh bertubuh + celana + sepatu terbaca rapi di terang dan gelap.
- Tinta tipis tidak mengganggu.
- `jalan` dan `kamar` sudah di rentang L* target.
- Rantai skill dipakai sesuai urutan.

## Pelajaran

- Untuk meredupkan mood inkbeat, skalakan **semua** lampu: hemi, key, **rim**, fill, camFill, cast fill. Rim yang terlewat membuat L* tetap > 55 meskipun ambient 0.
- Selalu ukur referensi dengan alat yang sama. Interior lampu referensi L* ≈ 13, jauh lebih gelap dari rata-rata episode 23–27.
