---
type: lesson
date: 2026-11-23
content-id: "2026-11-005"
topic: animatic pembuka Ep 4 v2 — selotip di ujung gagang; alasan kipas ditinggalkan
status: menunggu tinjauan pemilik
related: "[[2026-11-23-animatic-buka-ep4-kipas]]"
---

# Animatic pembuka Ep 4 v2: selotip di ujung gagang

Skills yang dipakai: `video-production` (§9 determinisme, §13 IK, §14 resep uji gerak: angka dulu, lalu strip dan lembar kontak).

## Mengapa solusi kipas ditinggalkan (keputusan pemilik setelah menonton v1, [[DECISION-LOG#D-062]])
1. **Gerak kaku.** Lengan bebas diam saat berjalan, kepala tidak mendahului badan, dan kipas yang dibawa satu tangan terbaca seperti tongkat pel.
2. **Uq menembus pintu kamar.** Daun pintu kamar terbuka 1,35 rad ke ruang tamu, dari engsel (1,0; 0,69) ke ujung (0,14; 0,50). Jalur v1 dari kipas (0,55; −0,55) ke sudut tenggara memotong daun pintu itu. Cek v1 tidak memuat daun pintu sama sekali: celah alat ukur, bukan hanya kesalahan jalur.
3. **Adik menembus sofa/meja.** Jalur lurus v1 dari titik akhir Ep 3 (−1,95; 1,10) ke sofa melewati meja kopi (x −2,9…−1,9, z 0,275…0,825); cek v1 hanya membandingkan pusat badan dengan tepi depan sofa.
4. **Penutup tidak meyakinkan.** Kain 0,34 × 0,40 m dibuat sebagai bidang statis; di insert jadi persegi hitam besar yang tidak terbaca sebagai kain.
5. **Jangkauan dan tempo.** Kipas hanya mencapai lensa kalau pegangan pindah ke dasar tiang (tangan meluncur 0,53 m), lengan melewati batas 11,1 °/frame (16,8), dan persiapan memakan ± 5 s sebelum lensa tertutup.

## Apa yang diuji di v2
- **Mekanisme:** gagang 1,5 m dengan selotip buram 2,2 × 1,8 cm di ujungnya; ujung ditekan ke lensa, gagang ditarik, selotip tetap di lensa. LED-1 tetap menyala di samping selotip.
- **Persiapan** (menempel selotip di ujung, memegang gagang di ujung bawah) disembunyikan oleh potongan antar-shot (ellipsis 0,9 s dunia).
- **Jalur dan badan:** dicek terhadap sofa (alas, sandaran, lengan, bantal), meja kopi, daun pintu kamar, kipas, dan dinding (`studio/tools/m005v2_check.ts`): badan silinder (Uq r 0,22, adik r 0,16), titik bahu/siku/tangan, dan kaki.
- **Gerak lebih hidup:** kepala mendahului badan; lengan bebas berayun saat berjalan (ayunan ke belakang dibuang karena memasukkan lengan ke kaos 2,0 cm); adik sedikit condong saat berjalan; berjalan hanya searah badan dengan putar-di-tempat di titik belok (jalur menyamping menyilangkan kaki: adik di v2 run 1, Uq di run 2).
- **Kontinuitas tempat gagang:** dinding ruang tamu sisi kamar (x 0,94, z 2,2–2,7) **tidak pernah terlihat** di frame final Ep 2 dan Ep 3 (proyeksi per frame dari stage episode + uji tembus dinding; karakter dan perabot tidak dihitung sebagai penghalang). Sudut tenggara di lantai (x 0,45, z 2,86) **terlihat** di Ep 2 s02 dan s11, dan sisi lemari TV terlihat di Ep 2–3: keduanya ditolak. Ep 1 belum dicek (fungsi kameranya tidak diekspor).

## Angka (VERIFIED, `_media/2026-11-005/out/animatic_open_v2/m005v2_check.txt`)
| Cek | Hasil | Batas |
|---|---|---|
| Badan/lengan/kaki vs sofa, meja, daun pintu, kipas, dinding | semua positif; terdekat adik–sofa 4,5 cm, adik–meja 5,5 cm | > 0 |
| Kaki menyilang | tidak (min 9,0 cm) | > 0 |
| Lengan kanan Uq | 7,74 °/frame; masuk kaos 0,26 cm | 11,1; 0,2 (**lewat tipis**, dari ayunan saat berjalan) |
| Lengan kanan adik | 7,04 °/frame; 0,65 cm (pose jaket lama Ep 2–3) | 7,1; 0,0 |
| Kecepatan jalan puncak | Uq 1,50 m/s, adik 1,43 m/s | — |
| Tangan saat membidik | y 1,368 m (telapak maks 1,55) | — |
| Ujung gagang saat tekan | 4 mm dari lensa (= tebal celah selotip) | — |
| LED ke pusat lensa | 2,1 cm; selotip setengah lebar 1,1 cm | LED di luar selotip |

## Tempo
- Film 6,5 s: S01 0–3,1 s (adik ke sofa, Uq keluar bingkai), S02 3,1–4,0 s (Uq mengangkat gagang), S03 4,0–6,5 s (insert lensa).
- Lensa tertutup terlihat 4,22 s; teks toa 4,35 s (0,13 s sesudahnya). v1: varian B 5,67 s, C 4,87 s.

## Kelemahan yang masih ada (urut)
1. **Selotip di ujung gagang hampir tidak terbaca sebelum ditekan** (petak pucat kecil di ujung gelap). Mekanisme terbaca dari hasilnya: petak pucat tertinggal di lensa saat gagang turun.
2. **Uq hampir tidak terlihat berjalan:** keluar bingkai S01 dalam ± 0,7 s; S02 dari belakang dengan cahaya karakter yang membentuk lingkaran putih besar.
3. **Badan kamera tampil sebagai kotak hitam 5 × 4 cm** yang membesar di lensa 24°; selotip terbaca sebagai stiker di kotak hitam.
4. Lengan kanan Uq 0,26 cm masuk kaos saat berayun (batas 0,2).
5. Akhir Ep 3 bergandengan tangan; animatic mulai dengan tangan sudah lepas.
6. Tanpa audio; toa hanya teks. Belum ditonton di ponsel.
