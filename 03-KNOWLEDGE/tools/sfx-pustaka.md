---
type: tool-note
created: 2026-11-18
updated: 2026-11-18
related: "[[04-PRODUCTION/2026-11-003/content|2026-11-003]], [[DECISION-LOG#D-041]], [[2026-11-17-animatic-v3]]"
---

# Pustaka SFX proyek (`refrences/SFX/`)

Catatan sumber, lisensi, dan hasil analisis sinyal untuk file SFX yang dipakai produksi. File asli tidak pernah diubah; semua pengolahan (trim, filter, level) terjadi di skrip mix.

> **Batas:** Claude tidak bisa mendengar. Semua angka di sini adalah **pengukuran sinyal** (ffmpeg + numpy), bukan penilaian telinga. Pilihan variasi bersifat **sementara** sampai pemilik mendengar.

## 1. Sumber dan lisensi

| Kelompok | Asal | Lisensi | Status verifikasi |
|---|---|---|---|
| 32 file `<awalan>_#1…#4.mp3` (8 jenis × 4 variasi), ditambahkan 2026-11-18 | **Dibuat oleh pemilik** (keterangan pemilik, 2026-11-18). Alat pembuatnya **UNKNOWN**: tidak tercatat, dan metadata file hanya berisi `encoder=Lavf59.27.100` (tanpa tag lain). Nama file tampak seperti 20 karakter pertama sebuah deskripsi teks + nomor variasi (OBSERVATION), tetapi itu bukan bukti alat tertentu. | Mengikuti **arahan pemilik yang sudah tercatat** (content.md 2026-11-002, entri 2026-11-17: SFX dari folder SFX proyek boleh dipakai di video yang dipublikasikan). | **Tidak diverifikasi Claude secara independen.** |
| `sfx-01…30_*.wav` | Paket ProducerSpot (lihat `rename_map.csv`) | arahan pemilik yang sama | tidak diverifikasi Claude |
| File `.mp3` lain (`1 Click Mouse`, `Shutter 5Dm4`, `Hit 3`, dst.) | tidak tercatat | arahan pemilik yang sama | tidak diverifikasi Claude; riwayat di [[2026-11-17-animatic-v3]] |
| `_media/2026-11-002/sfx/*.wav` (jangkrik, room tone, dengung toa) | disintesis Claude (`scripts/sfx_synth.py`) | tanpa hak pihak ketiga | — |

## 2. Peran 8 jenis baru (arahan pemilik 2026-11-18)

| Awalan file | Peran | Dipakai di pilot v2? |
|---|---|---|
| `Quiet_night_ambience` | suasana malam (bed) | ya |
| `Slow,_careful_footst` | langkah kaki pelan | ya (grain satu langkah, sinkron tapak kaki) |
| `A_small_metal_barrel` | gerendel digeser dan terkunci | ya (pengganti `Shutter 5Dm4` + `Hit 3`) |
| `A_very_soft_single_f` | ketukan halus layar ponsel | ya, hanya saat senter menyala (pengganti `1 Click Mouse`) |
| `A_distant_outdoor_pu` | pembuka pengeras suara toa | ya (sebelum P01) |
| `A_smartphone_vibrati` | getar ponsel | **ya, episode draft v1** (#2, dua dengung, S08) |
| `Three_slow,_delibera` | tiga ketukan | **ya, episode draft v1** (#3, tiga grain ketukan, S10) |
| `Very_faint,_distant_` | gumam warga di kejauhan | **DILARANG sampai pemilik menyetujui** (bisa menjadi petunjuk cerita baru). Skrip mix menolak file ini (`FORBIDDEN`). |

## 3. Apakah empat variasi benar-benar berbeda? (VERIFIED, pengukuran 2026-11-18)

Ya. Tidak ada pasangan variasi yang byte-nya sama atau PCM hasil dekodenya sama. Korelasi silang gelombang maksimum antarvariasi ≤ 0,56 (salinan identik = 1,0), jadi isinya bukan salinan yang digeser waktu.

Korelasi **selubung** (bentuk naik-turun keras) tinggi untuk ketukan ponsel (0,89–0,98) dan pembuka toa (0,66–0,84). Artinya bentuk kejadiannya mirip (satu ketukan; satu letupan lalu dengung), tetapi isi gelombangnya berbeda. Beda bunyi yang terdengar: **UNKNOWN**, pemilik perlu mendengar.

Skrip: `python scripts/sfx_variants_analyze.py refrences/SFX <folder keluaran>`. Hasil lengkap (CSV/JSON, termasuk MD5 PCM, centroid spektral, level awal/akhir): `_media/2026-11-003/out/pilot_v2/sfx_analysis/`.

### Tabel per file (32 file)

| File | Durasi | Peak (dBFS) | True peak (dBTP) | Loudness (LUFS) | Bunyi (s) | Onset (s) | MD5 (file) |
|---|---:|---:|---:|---:|---|---|---|
| `Quiet_night_ambience_#1.mp3` | 30,0 s | -27,0 | -29,2 | -47,8 | 0,0–30,0 | — | `2cf0ccb6f20df3d22e1925c3d40d2ab4` |
| `Quiet_night_ambience_#2.mp3` | 30,0 s | -26,0 | -28,7 | -41,6 | 0,0–30,0 | — | `fd45aee56f1115adf54d782c9b68baf6` |
| `Quiet_night_ambience_#3.mp3` | 30,0 s | -23,4 | -25,2 | -40,7 | 0,0–30,0 | — | `a8a7319065f952d6620e323fc95c2baa` |
| `Quiet_night_ambience_#4.mp3` | 30,0 s | -25,5 | -19,1 | -40,6 | 0,0–30,0 | — | `48f6f5544a6d6c773d9ed34b8c59bac1` |
| `Slow,_careful_footst_#1.mp3` | 12,0 s | -20,7 | -22,7 | -50,2 | 1,66–11,15 | 1,66 3,06 3,8 4,47 5,18 6,67 … | `c97b8207707385799baa774d4d3d9b71` |
| `Slow,_careful_footst_#2.mp3` | 12,0 s | -20,0 | -22,5 | -49,1 | 0,1–11,59 | 0,1 0,99 1,94 2,92 4,82 5,04 … | `9e03e72f25c200dd63c772ead455ee6a` |
| `Slow,_careful_footst_#3.mp3` | 12,0 s | -7,6 | -10,3 | -41,2 | 0,0–12,0 | 0,28 0,84 1,86 2,93 3,5 4,07 … | `374a9dd362dd33af214a09c0d6f34546` |
| `Slow,_careful_footst_#4.mp3` | 12,0 s | -26,2 | -28,2 | -52,8 | 0,2–11,16 | 2,34 3,32 4,35 10,3 | `17f3ab938d901b389280054a58ca8c72` |
| `A_small_metal_barrel_#1.mp3` | 4,0 s | 0,5 | -1,3 | -20,0 | 0,24–3,13 | 0,25 1,55 2,3 2,5 | `061d023a669e5404ff1928be5c178f66` |
| `A_small_metal_barrel_#2.mp3` | 4,0 s | -4,3 | -4,0 | -21,6 | 0,07–3,67 | 0,07 2,31 2,97 3,09 | `43ba758d658f6d68e6ad1c2c3b22dcd5` |
| `A_small_metal_barrel_#3.mp3` | 4,0 s | 0,9 | -1,2 | -23,9 | 0,13–3,34 | 0,15 1,57 2,5 2,71 | `49dcc5397af7fc56f4e72425531004a4` |
| `A_small_metal_barrel_#4.mp3` | 4,0 s | 0,7 | -1,7 | -21,5 | 0,13–3,05 | 0,18 2,28 2,44 | `5883c4b0a92d1943f9f8098bb683d843` |
| `A_very_soft_single_f_#1.mp3` | 0,486 s | -9,6 | -12,5 | -34,0 | 0,12–0,2 | 0,13 | `694cec1403d9f3808e23b054fdb1e91f` |
| `A_very_soft_single_f_#2.mp3` | 0,486 s | -10,2 | -9,9 | -31,9 | 0,15–0,23 | 0,16 | `fa2f0b22786955cf672ab35d860bf20a` |
| `A_very_soft_single_f_#3.mp3` | 0,486 s | -4,0 | -6,5 | -29,9 | 0,0–0,07 | — | `60fd52ed9ffe5ae60766bd5448c740ac` |
| `A_very_soft_single_f_#4.mp3` | 0,486 s | -1,8 | -4,8 | -28,3 | 0,0–0,06 | — | `981f5686f04d6ee3db36d61984dfde69` |
| `A_distant_outdoor_pu_#1.mp3` | 4,0 s | 1,9 | -0,8 | -20,5 | 0,0–3,81 | — | `0cfebf9fef2cdb81856237f459177750` |
| `A_distant_outdoor_pu_#2.mp3` | 4,0 s | 0,5 | -0,7 | -16,3 | 0,0–3,73 | 0,06 | `3001d474c386c07c8c92b5defc31d3a3` |
| `A_distant_outdoor_pu_#3.mp3` | 4,0 s | 0,2 | -2,3 | -27,0 | 0,0–4,0 | — | `6e8a8cd7fa82957a739067ed51b06341` |
| `A_distant_outdoor_pu_#4.mp3` | 4,0 s | 1,5 | -0,9 | -28,0 | 0,0–4,0 | — | `0452de680d1975ef241610210428ca39` |
| `A_smartphone_vibrati_#1.mp3` | 3,0 s | 2,0 | -0,4 | -11,1 | 0,07–3,0 | 0,08 0,6 1,09 1,6 2,11 2,61 | `e93573861f679e3bc62cdc7b3d3c20cc` |
| `A_smartphone_vibrati_#2.mp3` | 3,0 s | -20,0 | -22,8 | -29,8 | 0,01–2,68 | 0,06 1,03 2,03 | `75147984b97fe34aa0ce3528fbc08442` |
| `A_smartphone_vibrati_#3.mp3` | 3,0 s | 0,8 | -2,2 | -8,2 | 0,07–2,93 | 0,08 1,08 2,1 | `a3cb7467be0438f16113a8995dfd99ad` |
| `A_smartphone_vibrati_#4.mp3` | 3,0 s | -6,9 | -9,5 | -17,9 | 0,04–2,83 | 0,06 1,06 2,07 | `49e6498b8fe8eea539cac28fa3a0b8f7` |
| `Three_slow,_delibera_#1.mp3` | 6,0 s | -12,8 | -12,4 | -34,4 | 0,5–4,2 | 0,5 0,79 2,02 2,35 2,67 3,1 … | `c13905800180f0b21d146ef4ca8400cc` |
| `Three_slow,_delibera_#2.mp3` | 6,0 s | 0,8 | -1,2 | -21,0 | 0,0–4,58 | 0,25 0,48 0,7 3,24 3,47 3,7 … | `afe3d075f314920dd124b326f7fed9a9` |
| `Three_slow,_delibera_#3.mp3` | 6,0 s | -0,2 | -0,7 | -23,4 | 0,04–4,41 | 0,06 1,97 3,89 | `f4031891fd3cdf96a9fd90dce9eb07df` |
| `Three_slow,_delibera_#4.mp3` | 6,0 s | -14,6 | -15,3 | -36,8 | 0,84–5,08 | 0,84 1,1 1,34 1,6 1,87 3,78 … | `451b60a9ca11196e5318a45c0497e997` |
| `Very_faint,_distant__#1.mp3` | 20,0 s | -19,9 | -22,8 | -40,9 | 0,0–20,0 | 4,21 4,56 | `38c9ab51b66f937bb6a978a6a090e0ff` |
| `Very_faint,_distant__#2.mp3` | 20,0 s | -24,0 | -26,5 | -43,9 | 0,0–20,0 | 8,1 | `54e0a6bae4704e0156bc6df9036c213a` |
| `Very_faint,_distant__#3.mp3` | 20,0 s | -29,4 | -32,4 | -51,0 | 0,01–20,0 | 8,9 | `cf5f47e6c3d15903fcd8b8c0a6dc481c` |
| `Very_faint,_distant__#4.mp3` | 20,0 s | -30,7 | -29,6 | -50,2 | 0,0–20,0 | 17,75 | `1a85e93fb373af18332c48363fc560f4` |

| Jenis | Byte sama | PCM sama | Korelasi gelombang maks. | Korelasi selubung (min–maks) |
|---|---|---|---|---|
| `Quiet_night_ambience` | 0/6 | 0/6 | 0,054 | 0,063–0,082 |
| `Slow,_careful_footst` | 0/6 | 0/6 | 0,13 | 0,097–0,297 |
| `A_small_metal_barrel` | 0/6 | 0/6 | 0,192 | 0,521–0,896 |
| `A_very_soft_single_f` | 0/6 | 0/6 | 0,56 | 0,888–0,977 |
| `A_distant_outdoor_pu` | 0/6 | 0/6 | 0,289 | 0,655–0,836 |
| `A_smartphone_vibrati` | 0/6 | 0/6 | 0,381 | 0,289–0,924 |
| `Three_slow,_delibera` | 0/6 | 0/6 | 0,09 | 0,256–0,65 |
| `Very_faint,_distant_` | 0/6 | 0/6 | 0,058 | 0,084–0,117 |

Catatan:
- Semua file stereo 48 kHz, MP3 ±192–219 kb/s.
- Beberapa file melewati 0 dBFS saat didekode (`A_small_metal_barrel` #1/#3/#4, `A_distant_outdoor_pu` #1/#2/#4, `A_smartphone_vibrati` #1/#3). Karena itu skrip mix mengolah SFX sebagai float 32-bit, bukan PCM 24-bit.
- Ketukan #3 dan #4 sudah berbunyi di sampel pertama (tanpa jeda di awal). #1 dan #2 punya jeda 0,12–0,15 s sebelum ketukan. Skrip menyelaraskan berdasarkan puncak, bukan awal file.
- Energi suasana malam hampir seluruhnya di bawah 1 kHz (pita 1–24 kHz hanya 1–3 %): tidak ada pita jangkrik (OBSERVATION). Tidak ada kejadian menonjol (> 9 dB di atas median, jendela 50 ms) di keempat variasi.

## 4. Pilihan sementara untuk pilot v2 (dari sinyal, bukan telinga)

Diatur di `scripts/ep003_pilot_sfx.json` (lihat bagian `_baca` di file itu untuk cara mengganti).

| Peran | Variasi | Alasan sinyal |
|---|---|---|
| suasana malam | #3 | paling rata: puncak 400 ms hanya +0,6 dB di atas median (#1/#2 +1,5; #4 +1,3) |
| langkah | #2 | 12 langkah teratur ± 1 per detik (#3: 21 onset, terlalu rapat untuk "pelan"; #4: hanya 4 onset dan −52,8 LUFS) |
| gerendel | #3 | satu transien dominan. Tidak ada transien susulan dalam 0,4 s sesudah puncak. Transien sebelumnya ≤ −11,7 dB (−0,10 s) dan terpotong oleh pre-roll 0,07 s. Pembanding: #1 punya dua susulan −5 dan −6 dB (+0,07 dan +0,14 s); #2 tiga transien dalam ± 0,1 s; #4 pra-klik −5 dB pada −0,13 s. Semuanya berisiko terdengar sebagai "dua klik". |
| ketukan ponsel | #1 | ada jeda bersih di awal, centroid terendah (1,2 kHz) |
| pembuka toa | #4 | letupan di awal lalu dengung rata ± −35 dB (cocok sebagai pembawa pengeras suara). #1 meluruh mulus, #2 bertahan keras 0,3 s, #3 letupan pendek lalu desis −55 dB |

## 5. Riwayat

- 2026-11-18: 32 file baru dianalisis; 5 jenis dipasang di pilot 2026-11-003 v2 ([[DECISION-LOG#D-041]], pending). `1 Click Mouse`, `Shutter 5Dm4`, dan `Hit 3` tidak lagi dipakai di pilot v2. Jangkrik dan room tone sintesis Ep 1 dimatikan (opsi di config); dengung toa sintesis tetap.
- 2026-11-18 (pilot v3, [[DECISION-LOG#D-042]]): variasi tidak berubah (pemilik belum mengisi pilihan). Bed #3 diberi high shelf +8 dB @2 kHz, dan levelnya diatur di pita ≥ 300 Hz. Pembuka toa #4 kini dipotong 0,75 s mulai di atas ekor N03.
- 2026-11-18 (episode draft v1, [[DECISION-LOG#D-043]] pending):
  - **Getar ponsel #2:** dengung 0,52 s yang bersih, 0,99 s berselang, tanpa letupan kecil (#4 punya letupan 0,01 s di ujung tiap dengung; #1 enam dengung rapat; #3 paling keras). Dipakai dua dengung pertama.
  - **Ketukan #3:** satu-satunya variasi dengan **tepat tiga onset tunggal** (0,05 · 1,97 · 3,895 s; peluruhan 0,09–0,15 s, tanpa flam). #1 punya 8 onset, #2 punya 7 (dua kelompok cepat), #4 punya 10.
    - Ketukan pertama 14 dB lebih pelan dari ketukan ketiga dan jarak aslinya 1,9 s. Karena itu setiap ketukan dipotong sebagai grain, disamakan puncaknya, diberi jarak ulang 0,9 s, dan diberi sedikit redaman (lowpass 2,8 kHz) plus pantulan pendek, sebagai ketukan dari balik pintu belakang.
    - Hasil di premaster: tepat tiga onset (47,11 · 48,02 · 48,93 s), tanpa ucapan di jendela itu.
  - Suasana malam #3 di-loop (file 30 s, episode 67 s) dengan crossfade 1,2 s. Sambungannya berada di tengah L9 dan L18 (di bawah ucapan, bukan di jeda sunyi), dan setiap salinan dimulai 3 s lebih jauh di dalam file.
  - Gumam warga (`Very_faint,_distant_`) tetap tidak dipakai.
