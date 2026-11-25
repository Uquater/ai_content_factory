---
type: lesson
date: 2026-11-17
content: "[[04-PRODUCTION/2026-11-002/content|2026-11-002]]"
decision: "[[DECISION-LOG#D-033]]"
tags: [set, environment, performance, animatic]
---

# Animatic v4: empat cacat set diperbaiki + kompleks lebih berpenghuni

**Status:** menunggu penilaian pemilik. Pemilik menyukai animatic v3 dan SFX-nya. v4 hanya memperbaiki set dan menambah lingkungan. Karakter, gerak v3, timing, VO, dan mix SFX tidak diubah (mix v3 dipakai apa adanya).

## Berkas

- **Video:** `_media/2026-11-002/out/episode_2026-11-002_animatic_v4.mp4` (tanpa blur, 2987 frame, mix SFX v3).
- **Perbandingan** (`_media/2026-11-002/out/v4_compare/`):
  - `cacat_sebelum_sesudah.jpg`;
  - `lingkungan_v3_v4.jpg`.
- **Gambar cacat dari pemilik:** `_media/2026-11-002/kesalahan/`.
- **Kode:**
  - `studio/src/ep002/sets.tsx`: `Wall`, `RowHouse`, `Fence`, `MoreHouses`, `BackRow`, `StreetSet dense`;
  - `inkbeat/core/kit.tsx`: `Inst`;
  - `ep002/castV3.ts`: varian W6–W10;
  - `ep002/AnimaticV3.tsx`: `env="v4"`;
  - `ep002/SetDebug.tsx`: still debug fasad;
  - npm `render:animatic002v4-picture`, `mux:animatic002v4`.

Animatic v3 tetap bisa dirender (`Ep002AnimaticV3`, `env="v3"`). Perbaikan cacat berlaku untuk keduanya.

## Empat cacat: penyebab sebenarnya

| # | Gejala (gambar pemilik) | Shot | Penyebab di geometri | Perbaikan |
|---|---|---|---|---|
| 1 | Dua jendela fasad berhimpitan | A01 (dan A13b) | `RowHouse` meletakkan grup jendela/pintu di `[0, 0, fz]`, bukan `[x, 0, fz]`. Semua jendela dan pintu **tetangga** tergambar di fasad rumah 7: jendela menyala tetangga x = −13 (posisi relatif +1,6) muncul di x = 1,6, menempel jendela kamar. Fasad tetangga sendiri jadi kosong. | Grup di `[x, 0, fz]`. |
| 4 | Jendela dan bidang sekitarnya saling menutup | A05b/c, A14 (rumah seberang) | Bug yang sama: keempat rumah seberang menumpuk jendela dan pintunya di x ≈ 0. Selain itu, tata letak relatifnya sendiri membuat pintu (lebar 0,92) dan jendela (1,1) bertumpuk 0,3–0,4 m, sehingga daun pintu yang terbuka menembus kaca. | Grup di x; jendela deret kita `[-2.85, 1.6]`, seberang `[-2.0, 2.75]` (jarak ≥ 0,19 m dari pintu). |
| 2 | Bidang dinding menutupi sebagian bukaan pintu | A16b (pintu belakang) | `Wall` memproses bukaan satu per satu dan tidak mendukung bukaan yang **bertumpuk vertikal**. Lubang angin (lebar 0,5, y 2,17–2,47) di atas pintu belakang (lebar 0,9) membuat algoritma mengisi "bawah lubang angin" dari lantai sampai 2,17 m, sehingga ada panel 0,5 m di tengah bukaan pintu. | `Wall` dipotong per kolom di setiap tepi bukaan; tiap kolom mengisi celah vertikal di antara bukaan yang menutupinya. |
| 3 | Sambungan bidang di sekitar jam bertumpuk | A17 (pandangan ke lorong) | Dressing D-031: jam ruang tamu di x −1,2, **di dalam bukaan lorong** (x −1,4…−0,2, tinggi 2,2). Jam menggantung di ambang bukaan dan menumpuk dengan dinding di atasnya dan dinding lorong di belakangnya. | Jam dipindah ke dinding di atas foto (x −2,55, y 2,12). |

Diperiksa di awal, tengah, dan akhir gerak kamera semua shot terdampak (A01, A05a/b/c, A13b, A14, A16b, A17). Tidak ada bidang yang menutup bukaan dan tidak ada objek bertumpuk.

## Lingkungan yang ditambah (`StreetSet dense`)

**Rumah:**
- **+7 rumah depan:**
  - 3 di deret kita (x −21,6; 17,6; 26,4);
  - 4 di seberang (x −19,2; 26,2; −28,4; 35,2);
  - lebar 6,6–7,4 m, tinggi 2,9–3,3 m;
  - warna dinding dan atap berbeda, posisi pintu kiri/kanan, kanopi pintu, jendela menyala sebagian;
  - pagar: besi, tembok bertegel, atau pagar tanaman.
- **+17 rumah deret belakang** (8 di belakang deret kita, 9 di belakang deret seberang): badan dan atap saja, tanpa bayangan, untuk kedalaman di shot lebar.
- **+3 pohon** di celah halaman.

**Warga** (`env="v4"`):
- **+5 varian penampilan** dari preset yang ada (W6–W10: warna kaos/celana, rambut, tanpa sarung, anak).
- **+5 warga berjalan di A05:**
  - lajur jauh di jalan dan trotoar seberang (z 9,35–10,5), dengan fase langkah, kecepatan, dan waktu mulai berbeda;
  - di POV jendela mereka lewat di **belakang** warga yang sedang diikuti kamera, tidak menutupnya.
- **+1 warga di teras rumah seberang** (A05).
- **+2 warga berjalan–berhenti–menoleh di A13–A14:** waktu toleh +2,3 / +2,7 s sesudah L29.
- **+2 warga berdiri di depan pagar seberang** yang menoleh paling akhir (+2,9 / +3,3 s; kepala dulu, badan menyusul).
- **Total: +10 warga.**

**Konsistensi:**
- posisi rumah 7, jalan (z 5–10), pagar (z 4,2 / 10,8), dan arah jalan (ke timur menuju TOA) tidak berubah;
- tidak ada warga yang menembus pagar atau kerb (`e5` dipindah dari z 10,25 ke trotoar 10,5 karena kakinya tenggelam di kerb setinggi 0,14 m).

## Efisiensi dan pengukuran render

**Efisiensi:**
- Jeruji pagar (±50 per pagar) sekarang **satu InstancedMesh per pagar** (`Inst` di kit). Material sama, matriks statis, `frustumCulled = false`. Pass normal/id post-processing mendukung instancing (`MeshNormalMaterial` bawaan dan `MeshToonMaterial` yang di-patch).
- Rumah jauh dan deret belakang tanpa bayangan dan tanpa detail fasad.
- Geometri dan material dipakai ulang lewat cache kit (`boxG`, `toonMaterial`).

**Pengukuran** (60 frame, concurrency 3, `--gl=angle`, puncak working set proses `chrome-headless-shell`):

| Shot | v3 | v4 | Selisih |
|---|---|---|---|
| A13b (wide tinggi, terpadat) | 15,6 s · 2,50 GB | 16,1 s · 2,70 GB | +3 % · +0,20 GB |
| A14 (POV warga) | 14,6 s · 2,73 GB | 14,7 s · 3,05 GB | +1 % · +0,32 GB |
| A05 (OTS + POV) | 16,8 s · 2,62 GB | 18,5 s · 2,76 GB | +10 % · +0,14 GB |

**Render penuh v4** (2987 frame): **179,8 s**, puncak memori Chrome **5,1 GB**. Sebagai pembanding, render penuh v3 3 m 27 s, sebelum jeruji pagar di-instancing. Tidak ada hambatan render.

## Kekurangan yang masih terlihat

1. **Warga tambahan di POV A14 dan A05b/c hampir tak terlihat.** Bingkai POV sempit dan penuh warga utama di lajur dekat, sedangkan warga tambahan sengaja di belakang supaya tidak menutup momen toleh. Kepadatan terasa terutama di shot lebar A01/A13b.
2. **Warga di teras seberang (A05a) tertutup kusen jendela kamar**, jadi manfaatnya kecil.
3. **Deret belakang hanya badan dan atap** (tanpa jendela). Terbaca sebagai atap di kejauhan; dari dekat akan terlihat polos.
4. **Bukan dari set:** akting wajah di adegan dialog dan cahaya (lingkaran lampu terang di pintu depan A08, noda bulan di dinding kamar) masih seperti v3.

## Pelajaran

- Sebelum menambah objek, periksa dulu transform grup induknya. Satu `position` yang salah membuat tiga gejala berbeda di dua lokasi dan sekaligus membuat lingkungan tampak kosong.
- Komponen dinding dengan banyak bukaan harus dipotong per kolom, bukan diproses berurutan per bukaan.
- Dressing harus dicek terhadap bukaan dinding (jam di ambang lorong).
- Penambahan yang tidak terlihat di bingkai tidak memberi manfaat. Ukur di bingkai yang sebenarnya, jangan hanya di peta set.
