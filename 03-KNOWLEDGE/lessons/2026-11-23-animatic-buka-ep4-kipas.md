---
type: lesson
date: 2026-11-23
content-id: "2026-11-005"
topic: animatic pembuka Ep 4, kipas berdiri sebagai alat bantu menutup lensa
status: menunggu tinjauan pemilik
---

# Animatic kasar pembuka Ep 4 (kipas + kain): hasil uji dan pelajaran

Skills yang dipakai: `video-production` (rute wajib, §9 determinisme, §13 IK, §14 resep uji gerak), `inkbeat-shorts` tidak dibuka ulang (kerangka kamera dan cahaya sudah ada di komponen Ep 3), `threejs-*` dan `remotion-*` tidak dibuka ulang (tidak ada teknik baru).

## Apa yang dibuat
- Klip gerak `studio/src/ep005/motion005.ts` (fungsi murni dari waktu dunia), kamera dan jendela shot `cams005.ts`, komposisi `Animatic005.tsx`, angka `tools/m005_check.ts` dan `tools/m005_view.ts`.
- Tiga varian (540×960, tanpa audio nyata, teks toa sebagai pengganti suara): `_media/2026-11-005/out/animatic_open_v1/animatic_open_{A,B,C}_v1.mp4`, lembar kontak `sheet_*_video.png`, still `stills/`, angka `m005_check.txt`.
  - **A** = real time, tanpa ellipsis (10,0 s).
  - **B** = potongan antar-shot setelah Uq mengambil kipas, S03 mulai saat Uq tiba di bawah sudut (7,3 s).
  - **C** = alternatif sederhana: pengangkatan tidak diperlihatkan, S02 langsung ke insert di sudut (6,5 s).
- Satu perubahan di kode set lama, perilaku bawaan tidak berubah: `HouseInterior` kini punya prop `noFan` (bawaan `false`) dan mengekspor `StandFan`/`FAN_POS` (`studio/src/ep002/sets.tsx`).

## Jangkauan karakter (VERIFIED, angka rig)
- Telapak Uq paling tinggi 1,55 m dari lantai (lengan lurus ke atas). Bahu 1,05 m, panjang lengan 0,498 m. Tangan menahan kipas di 1,50 m: sisa jangkauan 1,6 cm. Tidak ada ruang untuk menjangkau lebih tinggi atau lebih jauh.
- Kepala kipas hanya mencapai lensa (2,65 m) kalau pegangan dipindah ke dasar tiang (pegangan 0,02 m dari dasar). Pegangan tengah (0,55 m) hanya sampai ± 2,1 m. Konsekuensi: **ada ganti pegangan**. Di animatic tangan meluncur di tiang 0,55 → 0,02 m selama 1,1 s (0,48 m/s). Ini bagian paling rawan terbaca sebagai gerak ganjil (HYPOTHESIS; dari strip kontak bentuknya terbaca sebagai "mengangkat tongkat", bukan sebagai ganti pegangan).
- Posisi Uq di bawah sudut: (0,643; 2,305), jarak ke dinding timur 0,077 m dari badan (jarak badan 0,22 m dikurangi), selatan 0,415 m. Tanpa memiringkan kipas 20° ke sudut, Uq harus berdiri 0,034 m di dalam dinding (percobaan pertama gagal).
- Gerak lengan kanan Uq: batas pilot Ep 3 11,1 °/frame terlampaui di pengangkatan: **16,8 °/frame** pada 7,40 s (durasi angkat 1,2 s). Perkiraan kasar (HYPOTHESIS, skala terbalik dengan durasi): 1,6 s → 12,6; 2,0 s → 10,1. Gerak lengan menurun (pelepasan kipas) 5,5 °/frame setelah diganti interpolasi sendi. Lengan menembus torso ≤ 0,09 cm (batas 0,2).
- Adik menaruh jaket: 2,7 °/frame (batas 7,1), lengan masuk torso ≤ 1,47 cm (batas 0,0; angka ini perlu diperbaiki bila dipakai).
- Kecepatan jalan puncak Uq 1,67 m/s, adik 1,56 m/s (acuan Ep 3 mundur ± 0,4–0,7 m/s: ini jalan, bukan mundur).
- Pelajaran teknis: IK per-frame bertahap (koordinat turun) melompat 20–50 °/frame bila target melewati dekat bahu; titik tengah jalur harus jauh dari bahu (MID_REL r 0,30, f 0,30, y 1,22). Interpolasi sendi lebih aman untuk gerak turun yang panjang. Jalur tangan adik dibangun di kerangka badannya agar sendi konstan saat ia berjalan.

## Kain dan lensa (VERIFIED di MP4 dan angka)
- Kain gantung 0,34 × 0,40 m, bidang menghadap ruangan, lensa 2,7 cm di belakangnya dan di tengahnya (sisi 0,000 m): lensa tertutup. Setelah kipas diturunkan, kain tetap (mesh statis) dan LED-1 turun ke 35 % (titik merah kecil terlihat di tengah kain di still S04). Ini sengaja dibuat sebagai pergantian pose pada 7,9–8,2 s; simulasi kain tidak ada.
- Kain di kepala kipas terbaca seperti topi atau atap; kain gantung di sudut terbaca sebagai persegi hitam rata (tekstur bayangan hitam), belum sebagai kain. Perlu lipatan atau warna yang berbeda dari bayangan (look-dev).

## Kapan penonton pertama melihat lensa tertutup
| Varian | Panjang | Kain mulai jatuh dan terlihat | Lensa tertutup terlihat | Teks toa muncul | Selisih |
|---|---:|---:|---:|---:|---:|
| A real time | 10,00 s | 7,90 s | 8,20 s | 8,37 s | 0,17 s |
| B ellipsis | 7,30 s | 5,23 s | 5,50 s | 5,67 s | 0,17 s |
| C tanpa pengangkatan | 6,50 s | 4,40 s | 4,70 s | 4,87 s | 0,17 s |
(Angka dari `tools/m005_view.ts`: pusat kain masuk bingkai kamera; "lensa terlihat" = titik lensa di dalam bingkai saat kain sudah menggantung. Penghalang oleh karakter tidak dihitung.)

## Dampak pada tempo pembuka
- Rencana naskah v1.0 menaruh toa di ± 2,5 s; storyboard revisi di ± 6,0 s. Animatic: A 8,4 s (+2,4 s dari 6,0), B 5,7 s (−0,3 s), C 4,9 s (−1,1 s).
- Persiapan kipas memakan sekitar 5 s dunia sebelum kain terlihat: adik + Uq berpisah 0–2,2 s, ambil kipas 2,2–3,9 s, bawa 3,9–6,4 s, angkat 6,65–7,85 s. Di A, bagian bawa (±2,5 s) adalah blok tanpa narasi; pelajaran Ep 2 S10 (7,9 s tanpa narasi ditolak, dipendekkan ke 5,8 s) berlaku: A melewati batas itu.
- Potongan antar-shot (B) menghilangkan bagian bawa dan menghemat 2,7 s; geraknya tetap terbaca dari match-on-action (Uq mengambil kipas, lalu sudah di bawah sudut).
- Total film: A 10,0 s, B 7,3 s, C 6,5 s hanya sampai toa dan ekor 1,6 s; sisa beat 1 (konteks 10 kata) menambah ± 4–6 s dan total episode melewati 60 s bila memakai A (HYPOTHESIS).

## Yang TIDAK dinilai (batas)
- Gerak pada kecepatan normal, kerlip, dan keterbacaan di ponsel (hanya strip dan lembar kontak 540×960 yang dilihat; tidak ada penonton nyata).
- Bunyi: tidak ada audio, teks toa saja.
- Kinematika kain (hanya pergantian pose), gesekan jari di tiang saat ganti pegangan, ayunan kipas.
- Lengan telanjang adik tanpa jaket di bingkai dekat (belum ada look-dev still).
- Kamar mandi dan pintunya tidak termasuk dalam klip ini.
