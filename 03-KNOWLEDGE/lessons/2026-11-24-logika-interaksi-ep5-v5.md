---
type: lesson
date: 2026-11-24
content-id: "2026-11-006"
topic: tiga kesalahan logika interaksi di pratinjau Ep 5 v4 (tangan satpam, adik menembus pintu, gembok) dan cek yang menangkapnya
status: pratinjau v5 dirender; menunggu tinjauan pemilik
---

# Logika interaksi: keadaan sebelum disentuh, jalur saat disentuh, perubahan sesudahnya

Rincian dan angka: [[04-PRODUCTION/2026-11-006/content]] §5. Kode: `studio/src/ep006/stage006.ts`, `lock006.ts`, `sets006.tsx`;
cek: `studio/tools/motion_check_lib.ts` + `studio/tools/e006_check.ts` (aturan R1–R5).

## Yang salah di v4 (tangkapan pemilik, `_media/2026-11-006/Kesalahan_Logika/`)

1. **Tangan satpam**: lengan baju + sarung tangan sebagai satu benda kaku yang melayang, tanpa bahu dan siku, lewat celah
   0,28 rad (± 25 cm), menembus daun pintu.
2. **Adik melewati pintu belakang**: daun pintu di 1,3 rad berdiri di jalurnya; ia berjalan menembusnya.
3. **Gembok**: kotak dengan dua pasak; tidak ada pengait, kupingan, atau lubang kunci; tidak mengunci apa pun. Pintu ruang toa
   juga berayun dari 0,22 ke 1,5 rad tanpa tangan.

Cek gerak v4 tidak menangkap satu pun: ia hanya menguji **badan dan sendi tokoh** terhadap kotak statis dan daun pintu kamar
mandi. Benda yang dipegang, tokoh lain, daun pintu lain pada sudutnya, dan urutan kunci tidak diuji. "Kontak disengaja di
bukaan pintu" dicatat sebagai pengecualian alih-alih dimodelkan.

## Cek baru (pustaka + driver), dan bukti bahwa ia menangkap v4

- Daun pintu **pada sudutnya di setiap frame** (`cfg.leaves`), bukaan pintu dideklarasikan (`cfg.openings`), benda sebagai badan
  (`cfg.props`), tokoh tambahan (`Ch.r/h`: satpam), **ruas lengan** di antara sendi (bukan hanya 3 sendi), dan FK dengan
  **condong badan** (FK lama tanpa condong salah sampai 9 cm).
- Aturan interaksi (driver): **R1** pintu/pengait bergerak hanya di bawah tangan (≤ 7 cm; 10 cm di kenop pintu belakang)
  atau berayun **melambat** sesudah dorongan; **R2** melewati ambang hanya bila lebar bebas ≥ lebar badan + 4 cm; **R3** benda
  tetap di tangan pemegangnya, tanpa lompat di frame serah-terima (≤ 1,5 cm); **R4** urutan gembok (anak kunci di sumbu
  lubang → diputar penuh → lengkung lepas → keluar dari kupingan → pengait dibalik → pintu bergerak; selama terkunci lengkung
  benar-benar melewati kupingan); **R5** aksi penting tidak tertutup badan dari sudut kamera.
- Bukti: driver baru dijalankan pada staging v4 → `episode_preview_v5/qc/interaction_check_v4.txt` = **GAGAL (13)**, termasuk
  ketiga kasus pemilik (lengan satpam −6,7 cm di daun pintu; adik −8,0 cm di daun; gembok tanpa kupingan/lubang; pintu
  ruang toa bergerak tanpa tangan 60 cm). Staging v5: `interaction_check_v5.txt` = **LOLOS**.

## Yang terbukti saat memperbaiki (25 putaran cek)

1. **Siapa yang membuka pintu menentukan semuanya.** Satpam tidak bisa sekaligus menarik daun dan menjulurkan kunci ke dalam
   (IK meleset ≥ 1,8 cm, lengan menembus daun di semua posisi berdiri). Uq membuka sendiri ke 0,45 rad (celah 0,40 m), satpam
   (tubuh utuh di gang, bahu di luar) hanya menjulurkan lengan kirinya.
2. **Jangkauan C1 pendek** (bahu ± 1,05 m, lengan ± 0,5 m): mendorong daun ke 0,7 rad butuh condong 20°; meraih tuas di
   rak 1,0 m membuat lengan bawah selalu menempel di atas rak (−2,5 cm di semua solusi) → rak diturunkan ke 0,85 m.
3. **Interpolasi sendi antara kunci yang jauh = tangan menyapu benda/perut.** Pakai jalur dunia (`wpath` + IK per frame
   dengan benih frame sebelumnya, `track`), dan pilih solusi terdekat benih di antara solusi yang galatnya ≤ 3–8 mm
   (pilihan galat-terkecil melompat antarcabang siku sampai 190°/frame).
4. **Target IK dekat badan atau di pinggul tidak tercapai** (galat 10 cm) → mulai/akhiri jalur di depan badan dan
   sambungkan ke pose diam dengan campuran sendi yang sudah diuji bebas-torso.
5. **Melepas sesudah mendorong**: tangan diam 0,1–0,25 s selagi daun berayun menjauh, lalu turun; berjalan sebelum lengan
   turun membawa lengan ke daun yang berayun.
6. **Serah-terima antar-tangan sendiri bisa tidak mungkin** pada rig ini (tangan kiri memegang gembok selalu masuk perut
   1,2–2,1 cm); solusi sederhana yang wajar: gembok terbuka masuk saku samping.
7. **Mengubah posisi tokoh membatalkan kamera lama**: Uq maju 4–10 cm → kamera S05 v4 melihat menembus kepalanya; cek tidak
   menangkap sampai still dilihat → R5 ditambahkan.
8. **Arah toleh ditentukan sisi kamera.** `headYaw` > 0 = ke kiri tokoh sendiri. Kamera S10c di kiri-depan Uq: toleh ke
   sakelar (kanannya) memutar wajah keluar lensa (r1 salah arah, r2–r3 wajah hilang). Kamera pindah ke sisi benda yang
   dilihat. Cek angka tidak menangkap ini; hanya strip dari MP4.
9. **Durasi mengikuti aksi**: menjelaskan satu interaksi dengan benar butuh waktu (S05 3,6 → 3,8 s, S07a 2,1 → 4,6 s); blok
   tanpa narasi tetap ≤ 5,8 s dengan menggeser N03 0,3 s lebih awal.

## Checklist (dipakai di setiap interaksi tangan–benda)

Ditambahkan ke checklist produksi Ep 5 (P11) di Content Unit dan ke header `motion_check_lib.ts`:
- **Sebelum disentuh:** keadaan benda masuk akal (terkunci = lengkung lewat kupingan; pintu tertutup = gerendel terpasang).
- **Saat disentuh:** tangan di benda (≤ 7–10 cm) di setiap frame benda bergerak; jalur tangan menurut dunia, bukan sendi;
  ruas lengan, bukan hanya sendi, bebas dari daun/kusen/rak/perut.
- **Sesudahnya:** perubahan terlihat dan tetap (pintu berhenti atau melambat; benda pindah tangan tanpa lompat; benda yang
  disimpan hilang di tempat yang masuk akal).
- **Dari kamera shot itu:** aksinya tidak tertutup badan (R5), lalu still/strip dari MP4.
