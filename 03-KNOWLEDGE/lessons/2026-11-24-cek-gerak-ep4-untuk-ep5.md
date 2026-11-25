---
type: lesson
date: 2026-11-24
content-id: "2026-11-005"
topic: cek gerak Ep 4 (e005_check → motion_check_lib) dan cara memakainya di Ep 5
status: siap dipakai; belum dijalankan pada shot Ep 5 (belum ada)
---

# Cek gerak Ep 4 dan pemakaiannya di Ep 5

Sumber: pratinjau penuh Ep 4 ([[04-PRODUCTION/2026-11-005/content]] §13), final Ep 4 §14, `studio/tools/e005_check.ts`, `studio/tools/motion_check_lib.ts`, hasil `_media/2026-11-005/out/episode_preview_v1/qc/e005_check.txt`. Audio dan caption: [[03-KNOWLEDGE/lessons/2026-11-23-audio-toa-caption-ep4-pilot-v2-v3]].

## Apa yang cek ini menangkap (kasus Ep 4, sebelum render)

Cek dijalankan pada frame yang tampil di layar, shot demi shot. Pada run pertama (S04–S15) ia menemukan, lalu diperbaiki:

| Masalah (terukur) | Shot, waktu | Perbaikan |
|---|---|---|
| tangan kanan Uq −4,1 cm di dinding timur lorong | S11, 40,2 s | jalur Uq digeser ke x −0,6 |
| tangan kiri adik −3,3 cm di daun pintu kamar mandi (pada sudut saat itu) | S12, 42,8–43,5 s | jalur adik z −4,0, ayunan lengan dimatikan di ambang pintu |
| tangan kanan Uq −1,9 cm di kusen pintu | S12, 43,2 s | ayunan lengan Uq dimatikan sebelum ambang |
| lengan Uq 47,6 °/frame saat meraih gorden (batas 11,1) | S05, 19,5 s | IK per frame diganti interpolasi sendi antar kunci |
| lengan Uq 19 °/frame lalu 14 °/frame | S05, 19,5 s; S07, 29,5 s | jendela gerak diperpanjang (0,35 s → 0,85 s); lepas gorden 0,45 → 0,7 s |
| adik 1,78 m/s (jalan lorong terlalu cepat) | S11 | langkah ditambah, mulai sebelum cut (di luar layar) |
| putaran badan 11,2 °/frame | S07→S08 | putaran 0,7 s → 1,0 s; S07 diperpanjang 0,4 s |
| kamera 0,085 m dari gorden | S06 (POV) | dicatat, lolos (> 0,05) |

Run akhir: 0 pelanggaran, kaki tidak menyilang, jarak antartokoh ≥ 6,0 cm, pintu kamar mandi 0 rad di S13–S15. Satu angka sisa dan diterima: lengan Uq masuk kaos 0,26 cm (batas 0,2; pose ponsel lama Ep 3–4).

Cek lain yang tidak dijalankan lewat alat ini tetapi terbukti perlu: still resolusi penuh tiap shot baru (S04: dua tokoh terpotong; S07: wajah tertimpa palang jendela; S12: lingkaran cahaya putih; S08: kamera di sisi adik). Semua ditemukan dari still, bukan dari angka.

## Cara menjalankan (Sonnet bisa mengulang persis)

1. Dari `studio/`, salin driver: `cp tools/e005_check.ts tools/e006_check.ts`.
2. Ganti impor ke stage dan plan Ep 5 (`episode006Stage.ts`, `episode006-plan.json`), isi `shots` (id, mulai, akhir) dari plan, dan fungsi `at(t, shot)` yang mengembalikan `{ chars, hasChars, cam, bathDoor }`. `chars` = karakter pada waktu t (root, yaw, pose, feet).
3. Isi `closedDoorShots` dengan shot yang harus berpintu tertutup, `cameraBoxShots` untuk shot POV tanpa karakter.
4. **Set baru** (ruang atau perabot yang belum ada di `BOXES`, mis. ruang toa): tambahkan lewat `extraBoxes`, dan catat kotaknya di Content Unit. Jangan menghapus kotak agar cek lolos. Daun pintu baru: tambahkan sapuannya seperti `bathLeaf` di pustaka.
5. Jalankan: `npx esbuild tools/e006_check.ts --bundle --platform=node --log-level=warning --outfile=out/e006_check.cjs && node out/e006_check.cjs > out/e006_check.txt`. Kode keluar 1 = GAGAL.
6. Baca baris `MASUK <benda> @<shot>: <t0>–<t1> s, worst <jarak> m di <t> s (<bagian>)`: shot dan waktu masalahnya langsung ada. Perbaiki di shot itu, ulangi sampai `HASIL: LOLOS`. Simpan hasil di `_media/<id>/out/<preview>/qc/`.
7. Uji sendiri alat bila driver baru: balik satu aturan (mis. `closedDoorShots` tambah shot yang pintunya terbuka) dan pastikan ia GAGAL; kalau tidak, driver salah sambung.

Batas alat (VERIFIED dari model tubuhnya): tubuh = silinder, lengan = tiga titik, kaki = bola kecil. Ia tidak melihat pakaian, rambut, ponsel, jaket di lengan, atau benda kecil di tangan. Cek angka lolos ≠ gerak bagus.

## Yang hanya bisa dinilai saat diputar normal (pemilik; Claude tidak bisa memutar video)

Beri pemilik daftar timestamp dari plan, bukan "tonton semua". Untuk Ep 4 dipakai tabel di §13. Template:

| Cek putar normal (30 fps, tidak dipelankan) | Apa yang dinilai |
|---|---|
| tiap awal dan akhir jalan (kaki mendarat) | langkah terlihat berat dan wajar, tidak meluncur atau melayang |
| tiap putaran badan | tidak berputar seperti poros, kepala mendahului badan |
| tiap tangan menyentuh benda (gorden, pintu, kenop) | kontak terbaca, tidak melayang di depan benda |
| tiap pintu menutup atau membuka | ada alasan terlihat (tangan, angin, langkah), bukan menutup sendiri |
| tiap lompatan pose pada cut | pose awal shot = pose akhir shot sebelumnya, tidak melompat |
| ponsel di tangan | tidak menempel di dada atau menembus lengan |

## Keterbacaan aksi (dinilai di layar ponsel)

Setiap shot: (1) aksi utama terbaca dalam 1 detik pertama tanpa caption; (2) tangan, benda kunci, atau wajah yang menjadi inti shot tidak keluar bingkai dan tidak terpotong tiang, gorden, atau kartu; (3) caption dan kartu tidak menutup wajah atau tangan kunci (pita 70%); (4) di shot gelap, bentuk dua tokoh masih terbaca. Periksa lewat still 1080×1920 tiap shot baru sebelum render (cek yang menangkap S04, S07, S08, S12 di Ep 4).
