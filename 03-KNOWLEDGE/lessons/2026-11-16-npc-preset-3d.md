---
type: lesson
date: 2026-11-16
related: "[[04-PRODUCTION/2026-11-002/content|2026-11-002]] §10, [[npc-presets]], [[DECISION-LOG#D-025]]"
---

# Pelajaran: adik + NPC sebagai preset 3D keluarga C1

1. **Warna di kode ≠ warna di layar.** Mood `day` mencerahkan warna terang sampai hampir putih (OBSERVATION) dan mengangkat warna gelap ke lavender (OBSERVATION; tahap penyebabnya HYPOTHESIS, belum diisolasi).
   - Render pertama: kaos peach, krem, sage, dan biru semuanya pucat.
   - Kalibrasi dengan sampel piksel referensi vs render. Putaran 1: albedo diturunkan. Putaran 2: hue diputar sebesar selisih terukur (ibu +18°, anak −16°). Hasil: selisih hue ≤ 7°.
   - Hue ikut bergeser: hijau dan cokelat condong ke kuning/jingga, biru condong ke biru yang lebih kuat.
   - Lakukan sampel warna sebelum menilai desain.
2. **Tepi rambut bergerigi berasal dari grid, bukan dari tekstur.** Memotong cangkang per verteks (di atas/bawah garis rambut) membuat tangga mengikuti baris-kolom bola. Hasilnya terbaca sebagai "keriting" tinta.
   - Solusi: remap lintang. Baris verteks 0..86 % direntangkan sampai garis rambut, sisanya dilipat ke dalam kepala sebagai bibir tersembunyi. Mesh tetap tertutup.
3. **Outline inverted hull bisa "bocor" di perpotongan benda.** Tabung celana yang menembus hull ujung kaos menghasilkan deretan titik tinta, mengikuti segi tabung.
   - Uji pertama yang salah sasaran: outline celana dimatikan → titik tetap ada.
   - Solusi: celana dimulai tepat di bawah pita hull (± 0,006 h) dan bagian atasnya ditutup. **Hanya berkurang, belum hilang:** titik tipis masih terlihat pada framing dekat (2026-11-16 malam).
   - Pelajaran: isolasi sumber artefak dengan satu variabel per render.
4. **Bayangan toon pada permukaan lebar dekat sumber bayangan pecah menjadi baji/titik** (aliasing shadow map). Garis kaki C1 terlalu tipis untuk memperlihatkannya. Celana: `receive=false`.
5. **Tampak depan menyembunyikan masalah kedalaman.** Dua masalah baru terlihat dari 3/4, belakang, dan close-up samping:
   - Tangan adik mencuat ke samping seperti lolipop.
   - Jaket hanya terlihat sebagai profil tipis bila lengan bawah mengarah ke kamera.
   Selalu render QC dari beberapa sudut sebelum melapor.
6. **`remotion still` menimpa file tanpa bertanya.** Iterasi di `out/rev/` dengan nama baru. Keluaran final disalin `cp -n` ke `_media/`.
7. **Noise render:** still `C1Sheet` dengan kode yang sama berbeda ±1 nilai di puluhan piksel antar-render. Diff "identik piksel" untuk C1 perlu pembanding render ulang sebelum menyimpulkan ada perubahan. `TyoProposal-close` ternyata deterministik penuh.

## Revisi D-026 (2026-11-16 malam)

8. **Tangan terbaca sebagai cincin karena ukurannya, bukan karena hull.**
   - Ukur dulu: v2 selebar ± 31 px dengan outline ± 11 px per sisi.
   - Garis tinta pascaproses berukuran tetap di layar (3,2 px × skala render), jadi benda kecil "termakan" garis.
   - Solusi: tangan lebih besar mengikuti proporsi referensi (jenis `"oval"` khusus preset), bukan menipiskan garis global.
9. **Gendong: cek wajah dari sudut kamera utama dulu.** Versi pertama (balita di depan dada ibu) lolos cek numerik, tetapi kepala balita menutupi wajah ibu dari depan. Gendong samping-pinggul menjaga kedua wajah terbaca.
10. **Batas jangkau lengan menentukan tinggi dudukan.**
    - Siku ibu paling rendah ± 0,74 m (lengan atas lurus ke bawah), jadi balita yang duduk di lengan bawah harus ± 0,78 m.
    - Siku perlu diputar keluar (`swivelR`) supaya tidak masuk ke tubuh ibu.
    - Grid search kecil atas posisi/yaw/tangan/swivel dengan `carryCheck()` lebih cepat daripada coba-coba render.
11. **Balita ≠ anak kecil yang diperkecil.** Proporsi baru perlu kaki dan lengan pendek serta kepala besar. Rig dipakai bersama, jadi ditambahkan sebagai slot opsional `proportions` yang tidak aktif untuk C1 (diverifikasi dengan diff still).
12. **Noise render juga terjadi pada Tyo.** `TyoProposal-close` berbeda ±1 nilai antar-render dengan kode yang sama (kadang identik). Pembanding piksel selalu dibuat dari dua render ulang.
13. **Cek numerik harus mencakup semua benda yang bisa bersentuhan.** Cek gendong pertama hanya menguji stik lengan terhadap torso, dan hasilnya "lulus". Setelah kain, kaki, dan volume tangan ikut diuji, muncul tumpang tindih 11–29 mm yang tidak terlihat pada still berskala ± 500 px. Close-up 1:1 dari depan, samping, dan bawah juga memperlihatkan kain yang terpuntir.
14. **Kain sapuan (strip) terpuntir bila normalnya berganti tajam** (depan → bawah → depan). Solusi:
    - Selempang tertutup mengikuti normal permukaan badan.
    - Kantong U terpisah dengan normal yang selalu mengarah ke pusat dudukan.
