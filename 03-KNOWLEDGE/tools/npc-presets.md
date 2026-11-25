---
type: tool-guide
title: "Preset NPC 3D keluarga C1 (studio/src/cast/npc.tsx)"
checked-date: "2026-11-16"
created: "2026-11-16"
updated: "2026-11-16"
tags: [tool, 3d, karakter, npc, studio]
related: "[[DECISION-LOG#D-025]], [[04-PRODUCTION/2026-11-002/content|2026-11-002]] §10, [[video-production]]"
---

# Preset NPC 3D (keluarga stick figure C1)

Tujuan: membuat NPC biasa untuk video berikutnya **dari preset**, tanpa meminta gambar referensi baru setiap kali. Satu NPC = satu objek `NpcPreset`. Tubuh, material, outline, dan shading memakai rig dan sistem look C1 yang disetujui ([[DECISION-LOG#D-021]]).

> **Status 2026-11-16:** kode dibuat dan diuji **hanya** pada still review:
> - `CastLineup002`: berdiri diam, pose istirahat, cahaya `day`, tampak depan / 3/4 / belakang.
> - Revisi [[DECISION-LOG#D-026]]: `CarryPreview002`, `CastDetail002-*`, `NightCheck002` (satu still mood `night`).
>
> Model adik, NPC, dan balita adalah **usulan**, belum disetujui pemilik ([[04-PRODUCTION/2026-11-002/content|2026-11-002]] §10, §10.1).

## Yang sudah tersedia dan teruji

| Parameter | Isi | Catatan |
|---|---|---|
| `height` | tinggi dunia yang diteruskan ke `C1` (C1 = 1,5) | ukuran kepala menambah sedikit; tinggi sebenarnya: `presetHeight(p)` |
| `head: { sx, sy }` | ukuran kepala relatif C1 | anak: 1,06–1,10 (kepala lebih besar) |
| `shirt: { color, dark, cuff }` | kaos polos tanpa tulisan (`kind: "tee"`) | `dark` = rib leher + pita ujung; `cuff` = dalam lengan |
| `hair` | cangkang rambut parametrik (`HairStyle`) + warna | gaya siap pakai: `HAIR.bob`, `HAIR.short`, `HAIR.bunLow`, `HAIR.messyShort` |
| `pants?` | celana longgar mengikuti garis kaki (`len` 0..1 dari ujung kaos ke mata kaki) | **pengecualian BODY RULE per karakter**, perlu izin pemilik; teruji berdiri saja |
| `accessory?` | `sarung-shoulder` (sisi, warna, motif kotak) atau `jacket-arm` (lengan, warna) | jaket mengikuti pose lengan yang dipakai |
| `pose?`, `face?`, `blinkSeed?` | pose istirahat, ekspresi, seed kedip | adegan boleh menimpa lewat props `Npc` |
| `proportions?: { legK, armK }` | kaki/lengan lebih pendek (balita: 0,5 / 0,62); tubuh atas turun sesuai | jaket mengasumsikan `armK` = 1 |

Selalu (tidak bisa diubah lewat preset):
- Tangan `"oval"` (sejak D-026): oval putih berisi 0,046 × 0,06 h, tanpa jari. Tangan `"mitt"` lama tetap untuk Tyo 2026-11-001.
- Kaki kapsul proyek.
- Wajah proyek tanpa hidung.
- **Tanpa "Uq"**.

Preset yang ada: `ADIK` (`C3-adik-v3`), `BAPAK`, `IBU`, `ANAK_WARGA`, `BALITA` (2–3 th: kepala 1,3×, kaki 0,5×, lengan 0,62×, tinggi 0,485 × C1).

**Pose gabungan:** `IbuGendong` (`studio/src/cast/carry.tsx`) = IBU menggendong BALITA di pinggul kiri, dengan kain gendongan. Satu pose statis.
- Tata letak dan clearance dicek dengan `carryCheck()`.
- Untuk menyetel ulang: ubah angka `SEAT`/`KID_YAW`/`HAND`/`SWIVEL`/`KID_POSE`, lalu jalankan cek numerik (semua nilai harus negatif):
  `npx esbuild tools/cast_check.ts --bundle --platform=node --log-level=warning --outfile=out/cast_check.cjs && node out/cast_check.cjs` (dari `studio/`).
- Setelah itu render `CarryPreview002` (4 sisi) dan `CarryClose002-{front,side,below}` (close-up 1:1).
- Cek tinggi preset ada di runner yang sama.

### Parameter `HairStyle` (satuan bola kepala: +1 ubun-ubun, 0 tengah, −1 dagu)
- `fringe`: garis rambut depan (poni rendah ≈ 0,3; dahi terbuka ≈ 0,6).
- `side`, `back`: batas bawah rambut di samping dan belakang (bob ≈ −0,6; rambut pendek ≈ 0 / −0,45).
- `window`: setengah lebar bukaan wajah (derajat; 40 sempit … 58 lebar).
- `puff`: tebal/volume (1,04 rapat … 1,17 penuh); `flare`: mengembang ke bawah (bob).
- `jag` + `jagFreq`: gerigi helai di garis rambut; `messy`: siluet tidak rata; `sweep`: belahan menyamping; `bun`: sanggul `{ r, y }`.
- `puffTop`: volume di ubun-ubun (lebih kecil dari `puff` = rambut mengikuti kepala, tidak seperti helm).
- `tips`: daftar ujung helai runcing `{ az, len, w }` (az radian: 0 depan, + kiri anatomis), untuk tepi yang tidak beraturan.

## Cara memakai

```tsx
import { Npc, BAPAK, IBU, HAIR, HAIR_BLACK } from "../cast/npc";
import type { NpcPreset } from "../cast/npc";

// NPC yang sudah ada
<Npc preset={BAPAK} position={[x, 0, z]} yaw={yaw} t={t} face={{ mouth: "flat" }} />

// NPC latar baru tanpa referensi baru: salin preset lalu ubah parameter sederhana
// (CONTOH, belum dirender — render lineup/QC dulu sebelum dipakai)
const WARGA_3: NpcPreset = { ...BAPAK, id: "W3-v1", label: "Warga 3", height: 1.49,
  shirt: { color: "#5f6f86", dark: "#4f5d70", cuff: "#4a586a" }, hair: { ...HAIR.short, color: HAIR_BLACK }, accessory: undefined };
```

- **Warna:** tulis albedo **lebih gelap** daripada warna target. Pada mood `day`, warna terang keluar hampir putih (peach `#f6b99b` → `#fdf5e8`). Belum ada rumus umum. Pasangan albedo → render (mood `day`, sisi terang) yang sudah terukur:
  - `#c88264` → `#fec7b0` (peach)
  - `#c8b991` → `#fdf4cc` (krem)
  - `#5a6e57` → `#a3b498` (sage)
  - `#425b5f` → `#7a8f99` (biru kusam)
  - `#91741f` → `#d5a145` (mustard)

  Cara kerja: render → ambil sampel piksel → koreksi hue/kecerahan sebesar selisihnya → render lagi. Hue cenderung bergeser ke kuning/jingga dan biru ke biru yang lebih kuat.
- **Id preset unik** per varian (cache geometri/tekstur berkunci parameter, bukan id, tetapi id tampil di log dan dokumen).
- **Tinggi:** cek dengan `presetHeight(preset)`; laporkan relatif terhadap C1 (1,5).
- **Lineup/QC baru:** pola `studio/src/cast/CastLineup.tsx` (kamera tanpa tilt/yaw, satu garis lantai, label overlay). `remotion still` menimpa tanpa bertanya: render ke nama baru, salin dengan `cp -n`.

## Belum tersedia / belum diuji (jangan diklaim)
- Siklus jalan, berhenti, menoleh bertahap untuk keluarga C1 (keputusan terbuka, 2026-11-002 §8 butir 13).
- Celana pada pose duduk; jaket/sarung saat lengan bergerak cepat.
- Gendong untuk pasangan preset lain, gendong bergerak/berjalan, dan pose gendong lain (punggung, depan).
- Lampu jalan, praktikal hangat, interior gelap: belum diuji. Hanya satu still mood `night` (2026-11-16): wajah dan tangan terbaca, rambut gelap kontrasnya rendah terhadap latar ungu (3,0:1). Warna preset dikalibrasi di `day`.
- Variasi aksesori lain (peci, daster, rok). Daster/rok panjang melanggar BODY RULE kecuali ada izin.

## Batas teknis yang ditemukan (2026-11-16)
- Garis rambut dari klasifikasi per-verteks menghasilkan tepi bergerigi (tangga grid). Solusi di kode: remap lintang sehingga garis rambut = satu baris verteks.
- Benda lebar yang menembus outline (inverted hull) ujung kaos menimbulkan titik-titik tinta. Celana dimulai di bawah pita outline itu.
- Bayangan ujung kaos pecah menjadi titik di permukaan lebar (shadow-map aliasing); celana `receive=false`.
- Rambut hitam terangkat ke abu-abu keunguan dan tidak bisa dihitamkan dari albedo saja (spec/rim material sudah 0). Penyebab = **HYPOTHESIS**: tahap pascaproses mood (grade, rim toon, fog, atau `camFill`), belum diisolasi.

Pelajaran lengkap: [[2026-11-16-npc-preset-3d]].

## Gerak berjalan, berhenti, menoleh (D-027, 2026-11-16)

Kode: `studio/src/cast/walk.ts` (fungsi murni) dan `studio/src/cast/Walker.tsx` (komponen). Slot baru `legPose` di `C1` (aktif hanya bila diberikan). Dipakai langsung di animatic 2026-11-002 (A05, A13, A14, A17) dan di uji `Ep002WalkTest`.

```tsx
import { Walker } from "../cast/Walker";
<Walker preset={BAPAK} gait={{ height: BAPAK.height, stride: 1.1, phase: 0.2 }}
  plan={{ t0: 62, from: [-12, 0, 7.2], yaw: Math.PI / 2, speed: 0.78, tStop: 76.2, decel: 1.6 }}
  t={t} look={{ t0: 77.9, deg: 72 }} />
<Walker carry gait={{ height: IBU.height, stride: 0.92, phase: 0.63, bob: 0.005, swing: 10 }} plan={...} t={t} />  // ibu + balita
```

- **Kaki:** fase langkah dihitung dari **jarak tempuh**, bukan waktu, jadi kaki yang menapak diam di dunia pada kecepatan berapa pun (cek numerik: selip 0,00 mm/frame).
- **Berhenti:** jarak berhenti dibulatkan ke titik dua kaki menapak. Sesudah itu kaki belakang melangkah kecil menyusul (terangkat, tidak meluncur) dan badan maju ¼ langkah.
- **Tidak serentak:** lengan berayun berlawanan dengan kaki dengan jeda 0,06 siklus. Dada berputar berlawanan (jeda 0,03), badan bergoyang ke samping (jeda 0,1), kepala menahan sebagian putaran dada. Badan naik turun dua kali per siklus.
- **Variasi:** `phase`, `stride`, `speed`, `t0` per warga.
- **Menoleh:** `look: { t0, deg }`. Kepala dulu, dada ikut ± 30 % sesudah 0,18 s, dengan sedikit overshoot. Untuk ibu menggendong, kepala balita mengikuti 0,35 s kemudian.
- **Ibu menggendong saat berjalan:** seluruh grup (ibu, balita, kain) naik turun bersama badan, dan kaki mengompensasi supaya tetap menapak. Lengan penopang, balita, dan kain tetap kaku terhadap ibu, jadi cek kontak gendong tetap berlaku. Hanya lengan bebas ibu yang berayun.
- **Parameter `Gait`:** `height`, `stride` (m per siklus), `phase` (0..1), `lift` (h), `stance` (0,62), `bob` (h), `swing` (derajat), `footX`.
- **Parameter `WalkPlan`:** `t0`, `from`, `yaw` (0 = +z, π/2 = timur), `speed` (m/s), `tStop`, `decel`, `d0`.
- **Cek:** `tools/cast_check.ts` (bagian "walk"): selip kaki, kaki di bawah lantai, dua kaki menapak saat berhenti.

**Belum ada / belum diuji:**
- Jalan berbelok (lintasan hanya garis lurus).
- Naik tangga.
- Lari.
- Duduk ↔ berdiri.
- Berjalan mundur.
- Berjalan sambil memegang orang lain. Di A08, gerak tarik C1 dan adik masih *blocking*: posisi di-lerp dengan langkah kecil di tempat (`shuffle`), bukan siklus jalan.

**Warga latar (D-027):** `WARGA_3`, `WARGA_4`, `WARGA_5` = varian preset yang sudah disetujui (warna kaos, rambut, tinggi). Cara membuat yang baru: salin preset, ubah `id`, `shirt`, `hair`, `height`.
