---
type: lesson
date: 2026-11-17
content: "[[04-PRODUCTION/2026-11-002/content|2026-11-002]]"
tags: [animation, ik, character, qc]
---

# Lengan C1 "hilang lalu muncul dari torso" saat bangun dari kasur (A02–A04)

**Definisi "smooth" dari pemilik:**
- tubuh tetap utuh, pose terbaca, gerakan berkesinambungan;
- tangan tidak tiba-tiba hilang, muncul dari torso, atau berpindah tanpa lintasan yang masuk akal;
- tangan **boleh** tertutup objek secara alami.

**Referensi:** `refrences/RicksClips_Gerakan.mp4`, detik 9–11 dan 30–32.
- Tangan menyentuh properti dulu sebelum berat badan dipindahkan.
- Lengan selalu tersambung.
- Badan boleh tertutup properti.
- Aksi dibingkai dari samping 3/4 dengan properti utuh di bingkai.
- Pose kunci ditahan sebentar.

## Gejala (render animatic v4, frame 243–302 = 8,1–10,1 s)

- **248–262:** bintik putih di permukaan kaos (tangan di dalam badan).
- **263–277:** lengan sisi kamera tidak terlihat; outline lengan tergambar di dada.
- **278–290:** tangan tiba-tiba muncul, lalu lengan "keluar" dari bawah kaos menuju pangkuan.

## Penyebab (dibuktikan, bukan ditebak)

Penyebabnya **bukan** render, kamera, atau selimut. Ini penetrasi lengan ke torso, diukur dengan `c1ArmTorsoDepth`: garis tengah lengan, mulai dari ujung lengan baju sampai telapak, diuji terhadap permukaan kaos `teeSurface`.

1. IK lengan (`c1ArmIK`) hanya mengejar posisi telapak, tanpa batasan tubuh. Solusi dengan siku menekuk ke dalam membuat garis tengah lengan masuk ke badan di **241 dari 341 frame** A02–A04, terdalam **8,4 cm** di 9,4 s.
2. Titik target terlalu dekat garis tengah badan:
   - bertumpu ±0,22 m ke samping, sedangkan setengah lebar kaos 0,135–0,18 m;
   - pangkuan ±0,11 m.

   Rantai lengan C1 menekuk dalam **satu bidang** (bahu dan siku sebidang), jadi pose "siku keluar, tangan masuk" tidak tersedia. Untuk target yang dekat badan, satu-satunya solusi adalah siku menekuk ke dalam badan.
3. Pemeriksaan sebelumnya (`situp_check`) hanya mengukur jarak telapak ke target, penetrasi telapak ke kasur, dan lompatan sudut. Tidak ada uji lengan terhadap badan, jadi semua angka tampak "lolos".

## Perbaikan (mode lengan `v3c`; animatic `env="v5"`)

1. **IK dengan penghindaran torso** (`c1ArmIK({ avoidTorso: true })`): biaya ditambah 4 × kedalaman garis tengah lengan di dalam kaos. Siku boleh sedikit lurus ke belakang (b ≥ −20°), seperti pose istirahat C1.
2. **Titik target di luar badan:**
   - **Bertumpu:** tepat di samping pinggul, **0,30 m** ke samping, di permukaan kasur. Pada jarak ini lengan yang hampir lurus menapak di kasur dengan siku di luar badan.
   - **Berbaring:** tangan sudah di titik tumpu yang sama. Jadi tidak ada perpindahan cabang solusi IK dari berbaring ke bertumpu, yang sebelumnya menyebabkan lompatan 40° dalam satu frame.
   - **Ke pangkuan:** lewat titik antara rendah di sisi paha (maju 0,18 m, 0,25 m ke samping, 0,15 m di atas kasur), lalu ke paha (0,13 m ke samping). Titik antara yang tinggi dan jauh ke samping sempat membuat lengan jauh terentang horizontal; itu sudah diganti.

**Hasil** (`npx esbuild tools/situp_check.ts … && node out/situp_check.cjs v3c`):
- lengan di dalam badan: 241 → **25 frame**, terdalam 8,4 → **1,2 cm** (lengan masih terlihat);
- lompatan sudut lengan maksimal: 25° → **13°/frame**;
- telapak menapak kasur 0,3–2,4 cm selama berbaring dan bertumpu;
- condong badan, kepala, ekspresi, selimut, kamera, dan timing tidak diubah.

**Dari kamera final:** lengan sisi kamera terlihat sepanjang aksi (berbaring → bertumpu → ke pangkuan). Lengan sisi jauh muncul dari balik badan saat menuju pangkuan; itu tertutup secara alami.

## Berkas (`_media/2026-11-002/out/arm_fix/`)

- `a02-a04_v4-vs-v5.mp4`: sebelum | sesudah berdampingan, timing dan audio sama;
- `a02-a04_v5_lengan.mp4`: potongan sesudah;
- `a02-a04_v4_sebelum.mp4`: potongan sebelum;
- `a02-a04_lengan_sebelum_sesudah.jpg`: still frame 250–292 dan 420.

Audio = potongan mix SFX animatic v3 yang sudah disetujui. Episode lengkap belum dirender ulang.

**Kode:**
- `studio/src/c1/bodyIk.ts`: `c1ArmTorsoDepth`, `avoidTorso`;
- `studio/src/ep002/v3motion.ts`: `ArmMode` `"v3c"`;
- `PilotV3.tsx`: `BedC1 arms`;
- `AnimaticV3.tsx`: `env "v5"`, komposisi `Ep002AnimaticV5`.

v3, v3b, dan v4 tetap bisa dirender persis sama.

## Aturan yang bisa dipakai ulang

1. **Setiap gerak tangan dengan IK harus dicek terhadap tubuh pemiliknya**, bukan hanya jarak telapak ke target. Ukur garis tengah lengan, mulai dari ujung lengan baju, terhadap permukaan torso. Lengan yang menempel di sisi badan wajar; garis tengah yang masuk badan berarti lengan "hilang".
2. **Target tangan harus berada di ruang yang bisa dicapai dengan siku di luar badan.** Untuk rig satu-bidang C1, target di samping badan harus ≥ setengah lebar torso + panjang yang memungkinkan lengan hampir lurus (±0,30 m pada tinggi duduk).
3. **Jaga satu cabang solusi IK sepanjang aksi:** mulai dari pose yang sudah dekat dengan pose tumpuan. Pergantian cabang = lompatan pose.
4. **Lintasan tangan antar pose melewati sisi luar badan dengan rendah,** bukan menyeberang di depan atau di dalam torso, dan tidak diayunkan ke samping.
5. **Nilai dari kamera final** pada kecepatan normal, lalu frame per frame di sekitar masalah. Motion blur tidak dipakai untuk menutupi.
