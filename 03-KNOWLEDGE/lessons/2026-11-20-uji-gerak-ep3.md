---
type: lesson
date: 2026-11-20
related: "[[DECISION-LOG#D-053]], [[04-PRODUCTION/2026-11-004/content]] §20"
---

# Uji gerak Ep 3: angka lolos ≠ gerak terbaca

## Yang terjadi
Empat gerak baru Ep 3 diuji sebagai klip pendek sebelum kode shot. Hasilnya:
- **Mundur:** lolos semua batas angka pemilik, tetapi strip memperlihatkan kaki bersilang.
- **Genggam:** satu varian lolos semua angka, tetapi crop 1:1 dari lensa final memperlihatkan tangan di depan perut adik.

## Pelajaran
1. **Batas angka pilot tidak mencakup kaki.** `walkSteps` berselang-seling dan menyilangkan kaki bila lintasan lebih dari ± 30° menyamping dari arah badan. Cek jarak antarkaki dan regang kaki per frame. Arah badan vs arah lintasan harus diputuskan di storyboard, bukan saat render.
2. **Makna dicek dari lensa final, bukan dari angka.** Kontak tangan di antara dua tokoh yang berdiri berdampingan bisa tertutup atau salah baca bila kamera berada di depan-serong (S08 v1, genggam D-053).
3. **Rig lengan satu bidang C1 pada jarak akar 0,41–0,6 m** tidak bisa meraih titik di antara dua tokoh tanpa lengan masuk torso (96 kombinasi diuji, 0 lolos). Tangan yang diam lalu diraih tokoh lain lebih mudah secara angka, tetapi tetap perlu sudut kamera yang memperlihatkannya.
4. **Lengan aksesori ikut disampel.** Jaket adik di lengan kanan menyapu punggung Uq saat berbalik; tanpa sampel jaket, angkanya tampak aman.
5. **Bandingkan ukuran yang sama.** Jarak storyboard (akar ke kotak − radius badan) berbeda dari jarak sampel rig; cetak keduanya.
6. **Hati-hati dengan nama file.** Windows tidak membedakan huruf besar-kecil: `Motion004.tsx` dan `motion004.ts` bentrok di TypeScript, jadi pakai nama berbeda.

## Tambahan 2026-11-20 (tahap 1b, [[DECISION-LOG#D-054]])
7. **Satu masalah bisa pindah ke gerak berikutnya.** Membalik badan searah lintasan (opsi a) menghapus kaki bersilang saat mundur, tetapi membuat tokoh berdiri berdampingan menghadap arah yang sama: tangan diam keduanya tinggal 4,3 cm, dan putaran ke lorong menjadi 164–168°. Ukur setiap gerak di jendela waktunya sendiri, lalu periksa juga pose akhir yang diwariskan ke gerak berikutnya.
8. **Kepala punya batas.** "Tetap menghadap" lewat kepala saja gagal bila sasaran > ± 55–60° dari badan (sisa 14°/21°). Hitung sudut sasaran dari badan di awal dan akhir lintasan sebelum memilih arah badan.
9. **Deklarasikan iterasi sebelum dijalankan.** Grid 32 varian ditulis di kepala log sebelum hasil terlihat; dengan begitu "satu iterasi" bisa diaudit, dan kandidat terdekat (meleset 0,3 °/f) dilaporkan tanpa tergoda melonggarkan batas.
10. **Insert menyelamatkan makna kontak.** Kontak yang gagal makna dari lensa depan-serong terbaca dari lensa rendah yang tegak lurus sumbu kedua tokoh. Insert bisa memakai jeda yang sudah ada sebelum kalimat berikutnya, sehingga durasi hanya bertambah +0,30 s.

## Tambahan 2026-11-20 (tahap 1c, [[DECISION-LOG#D-055]])
11. **Cek garis pandang sebelum memindahkan titik berdiri.** R1 baru opsi (b) gagal bukan karena gerak, tetapi karena LED lorong tersembunyi di balik ambang atas mulut lorong (selisih 1–5 cm) dan LED kamar di balik daun pintu. Cek berantai murah (hitungan geometri, tanpa render) menghentikan opsi itu sebelum ada kode gerak.
12. **Bandingkan kriteria dengan pembanding yang sudah disetujui.** Dua kriteria kepala log ternyata juga gagal pada storyboard sendiri. Jalankan pembanding (R1 storyboard) di log yang sama, supaya kriteria yang salah ketat langsung terlihat.
13. **Kaki aman ≠ kaki enak dilihat.** Langkah geser-rapat tidak pernah bersilang (dijamin oleh cara kerjanya), tetapi membuka kaki 46–48 cm (3–3,8 × lebar diam). Cetak jarak antarkaki MAKS juga, bukan hanya MIN.
14. **Diagnosis bercak dengan varian, bukan dugaan.** Beri warna mencolok pada pakaian dan matikan sumber satu per satu (pakaian, CharLight, tokoh lain, bulan). Noda di tangan adik ternyata bayangan jari Uq dari lampu bulan, bukan pakaian yang menembus.

## Tambahan 2026-11-20 (tahap 2 kelompok A, [[DECISION-LOG#D-056]])
15. **Ukur makna di layar, bukan hanya di 3D.** Jarak 3D 5,7 cm lolos, tetapi dari lensa P tangan Uq menumpuk jaket adik di gambar (−21 px). Proyeksi sampel ke piksel memberi ukuran yang bisa dideklarasikan sebelum iterasi.
16. **Cari sebab di frame awal dulu.** Tumpang tindih sudah ada di pose awal (0–0,1 s), jadi mengubah ujung lengan raih tidak bisa menolong. Lihat frame pertama sebelum memilih kenop.
17. **Permukaan sebidang di set = kedip.** Kusen `Door` (Ep 1) sebidang dengan sisi bukaan dinding; dari POV miring dengan fov bergerak, pola gigi gergaji berganti tiap frame. Tes "tanpa bulan" menyingkirkan bayangan sebagai sebab. Cek strip tiap frame di setiap tepi kusen/ambang yang tampak miring.

