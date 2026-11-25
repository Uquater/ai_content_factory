---
type: research-note
title: "Target gaya video 3D cartoon — studi 'Badai Matahari' Ep 1 & 2"
checked-date: "2026-11-16"
created: "2026-11-16"
updated: "2026-11-16"
tags: [style-target, 3d, referensi, wajib-dibaca]
related: "[[2026-11-16-animatic-v2-ditolak]], [[DECISION-LOG#D-028]], [[video-production]], [[npc-presets]]"
---

# Target gaya: referensi "Badai Matahari" (Ep 1 & 2)

> **WAJIB dibaca sebelum membuat atau menilai video 3D proyek ini.** Ditetapkan pemilik 2026-11-16 ([[DECISION-LOG#D-028]]) sebagai satu-satunya referensi gaya.
>
> **Yang ditiru:** kualitas gerak, konsistensi, cahaya, ritme, suara. **Yang tidak ditiru:** karakter, nama di kaos, desain, set, dan aset khas kreatornya. Frame referensi hanya untuk analisis pribadi: tidak disalin ke proyek dan tidak dipublikasikan.

**Sumber** (berkas lokal pemilik, di luar Git):
- Ep 1: `Downloads/Badai Matahari - Episode 1…mp4`, 90 s, 720×1280, 30 fps, md5 `93cd62f0…`.
- Ep 2: `refrences/Badai Matahari - Episode 2.mp4`, 124 s, 720×1280, 30 fps, md5 `a1ce8a41…` (`*.mp4` di-gitignore).

## 1. Yang disukai pemilik (kata pemilik, 2026-11-16)
- Gerak model 3D.
- Karakter warga konsisten; tidak ada tangan yang "ke mana-mana".
- Ekspresi terbaca.
- Voice-over dan SFX pas, misalnya efek keran air.
- Semua model berada di tempat yang seharusnya. Tidak ada balok yang menutupi pintu, seperti di animatic v1/v2 kita.

## 2. Angka terukur (VERIFIED, skrip ffmpeg, 6 fps, 45×80 px)

| Ukuran | Ep 1 | Ep 2 | **Animatic v2 kita** | Target |
|---|---:|---:|---:|---|
| Kecerahan rata-rata L* | 23,1 | 26,8 | **55,9** | malam: **20–30**; siang boleh 45–55 |
| Piksel gelap (L* < 15) | 44 % | 40 % | **2 %** | malam: **≥ 35 %** (hitam sungguhan ada di bingkai) |
| Warna dominan | merah 71 % | merah 55 %, biru langit 18 % | biru/ungu 71 % | satu warna dominan **per babak** yang bermotif cerita |
| Potongan per menit (scene > 0,3) | 4,7 | 11,1 | **15,1** | **5–11**; median shot 3,5–4 s |
| Shot terlama | 53,6 s (gerak kontinu) | 14,8 s | 10,6 s (diam) | shot panjang harus bergerak |
| Porsi frame diam | 36 % | 22 % | **46 %** | **≤ 30 %** |
| Loudness | −14,1 LUFS | −14,1 LUFS | −16,3 LUFS | **−14 LUFS**, true peak ≤ −1 dB |
| Hening > 0,4 s (−50 dB) | 0 | 0 | **17** | **0**: selalu ada lapisan ambience/musik |
| Energi > 6 kHz relatif | −16 dB | −16 dB | −24 dB | ada SFX/ambience bertekstur |

Batas: audio diukur sebagai sinyal. Claude tidak bisa mendengar, jadi musik, jenis SFX, dan pembawaan VO **belum dinilai** (UNKNOWN).

## 3. Pengamatan visual (OBSERVATION, contact sheet 1 fps + 8 frame penuh)

**Karakter**
- Kepala putih bulat dengan garis tepi tipis hanya di siluet kepala.
- Wajah: mata bulat besar dengan titik kilau, alis, garis hidung kecil, mulut. Ekspresi jelas (cemas, lapar, kaget).
- Tubuh lengkap: lengan dan kaki **putih bertabung**, celana, sepatu, kaos berwarna polos.
- Proporsi ramping, kaki panjang. Anak lebih pendek dengan kepala relatif besar.
- **Tangan selalu menempel pada sesuatu yang masuk akal:** memegang botol, memberi biskuit, memegang perut, menunjuk, membuka keran. Tidak ada lengan menembus atau melayang.

**Render**
- Tampilan 3D *real-time* yang lembut: bayangan lembut, ambient occlusion, bloom pada sumber cahaya, kedalaman bidang (latar blur di close-up).
- **Tidak ada garis tinta** pada set.

**Cahaya**
- Selalu bersumber nyata: langit aurora merah, lilin, jendela, lampu jalan, matahari pagi biru.
- Malam benar-benar gelap; area di luar cahaya jatuh ke hitam.
- Satu warna dominan per babak: merah (aurora), hangat oranye (lilin/dalam rumah), biru (siang).

**Set**
- Sederhana, tetapi skala dan posisinya benar dan padat: atap, tiang listrik, kabel, menara air, pagar, warung, pom bensin, motor, mobil.
- Kerumunan puluhan sampai ratusan warga di wide shot.

**Kamera**
- Kebanyakan setinggi mata atau sedikit rendah. Gerak pelan dan kontinu (dolly, pan).
- Insert benda close (keran + tangan, galon, lilin, dompet, harga di kardus), ditahan ± 2–4 s.
- Wide establishing di awal tiap babak (jalan kompleks, kota dari atas, pom bensin).

**Akting**
- Pose bermakna di tiap kalimat: duduk di kasur, mengisi ember, berbagi biskuit, menunjuk keluar jendela, memegang perut.
- Tidak ada karakter berdiri kaku tanpa alasan.

**Teks layar**
- HUD jam di kiri atas ("20:14", "07:10", "19:40") sebagai penanda waktu.
- Subtitle putih tebal, 2–3 kata, satu kata kunci berwarna hijau-kuning per potongan; dialog dalam tanda kutip berwarna kuning.
- Label di dunia, misalnya harga di kardus.

**Penutup**
- Kartu "APA PILIHANMU?", dua pilihan berbentuk pil, "KOMENTAR DI BAWAH", tombol merah "LANJUT EPISODE …", dengan tokoh di bawahnya.

## 4. Aturan turunan untuk produksi kita (ditetapkan, berlaku sampai diubah pemilik)

> **[DIUBAH 2026-11-17, [[DECISION-LOG#D-032]]]** Angka di bawah (L*, % gelap, % diam, potongan/menit) hanya **alat diagnosis**, bukan ukuran keberhasilan. Prioritas aktif: bentuk karakter > gerak alami > cerita > pemolesan ([[STUDIO-WORKFLOW]] §7).
1. **Malam = gelap.** L* rata-rata 20–30, piksel gelap ≥ 35 %. Cahaya hanya dari sumber yang terlihat atau termotivasi. Ukur sebelum melapor.
2. **Satu warna dominan per babak**, mengikuti cerita. Episode 2026-11-002, misalnya: biru bulan dingin di luar; hangat lampu ruang tamu sampai A12; sesudah lampu mati, biru gelap ditambah cahaya ponsel atau celah gorden.
3. **Tidak ada balok, dinding, atau properti yang menutupi aksi.** Setiap still kunci diperiksa: pintu bisa dilewati, wajah dan tangan terlihat.
4. **Tangan harus punya tujuan.** Setiap tangan diam memegang atau menyentuh sesuatu, atau rapi di samping badan. Tangan yang bergerak memakai IK ke target dunia. Cek menembus di contact sheet 2 fps.
5. **Gerak kontinu.** Porsi frame diam ≤ 30 %; shot panjang selalu punya gerak kamera pelan atau aksi.
6. **Insert benda** untuk setiap benda yang disebut narasi (ponsel, saklar, plat 7, toa, pintu belakang). Benda mengisi 45–60 % tinggi frame, ada tangan bila relevan, ditahan ≥ 2 s.
7. **Audio tanpa hening.** Ambience atau musik selalu ada; SFX pada kata yang tepat (keran, saklar, langkah, pintu); master −14 LUFS. Sumber SFX/musik harus berlisensi (keputusan pemilik).
8. **UI ala referensi**, dengan desain kita sendiri: HUD jam (02:00 untuk episode ini), satu kata kunci berwarna, kartu pilihan + ajakan komentar + "lanjut episode".
9. **Kerumunan:** wide shot memakai lebih banyak warga (preset + variasi), bukan 3–6 orang.
10. **Gerbang:** look-dev (satu still per lokasi dan cahaya, berdampingan dengan frame referensi, plus tabel angka di atas) → STOP pemilik → pilot 15 s dengan suara → STOP → episode penuh.

## 5. Keputusan yang masih terbuka
- **Gaya render:** tetap 3D toon bertinta (D-021), atau bergeser ke tampilan lembut tanpa tinta seperti referensi?
- **Bentuk tubuh warga:** tetap stick hitam (BODY RULE), atau lengan/kaki bertubuh dan bercelana seperti referensi? C1 sudah disetujui dengan stick hitam (D-018/D-021).
- **Alat produksi:** tetap kode three.js, atau Blender (Eevee) dengan aset berlisensi CC0? Lihat saran di laporan 2026-11-16.
- **Sumber SFX/musik berlisensi.**
