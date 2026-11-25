---
type: lesson
created: 2026-11-18
related: "[[04-PRODUCTION/2026-11-003/content|2026-11-003]] §13, [[DECISION-LOG#D-043]]"
---

# Episode 2 draft v1: menyambung pilot yang sudah disetujui ke episode penuh

1. **Pakai ulang blok yang disetujui dengan offset frame bulat, lalu buktikan.** Dump stage per frame (selisih 0) dan selisih piksel dengan MP4 pilot (0,1–0,6/255) membuktikan blok itu tidak dikerjakan ulang.
2. **Memperpanjang jalan `walk.ts` mengubah gerak.** Snap jarak berhenti dan amplitudo ayun memakai kecepatan rencana, sehingga mengubah `speed` atau `t0` menggeser fase dan pose. Jalan pembuka terpisah berkecepatan jelajah yang sama, berakhir tepat di awal jalan asli dengan fase sama, tidak mengubah jalan asli sama sekali. Perhatikan juga waktu tepat `t0`: di titik itu `walk.ts` masih dalam keadaan diam.
3. **Langkah dibuat sebagai event kaki terangkat** (`cast/stepper.ts`): berbalik, berjalan, mundur, dan bergeser ke samping tanpa geser kaki. Akar tubuh memakai profil trapesium untuk jalan yang lebih panjang (smoothstep penuh membuat puncak laju 1,5×).
4. **Ponsel harus dikunci ke rangka tangan.** Blend posisi dunia membuatnya terlepas 40 cm saat tubuh berputar. Blend offset lokal ke tangan tidak pernah lepas.
5. **Lengan C1 hanya menekuk dalam satu bidang** dan tidak bisa melipat tangan ke dalam dekat badan. Genggaman butuh titik temu ± 0,25 m di samping badan.
6. **Arah hadap mengubah sisi.** "Di kanan Uq" berlaku saat menghadap selatan; begitu berbalik ke utara, sisinya ikut terbalik. Hitung sisi per shot sebelum membangun adegan genggam.
7. **Cahaya praktis di dekat kostum** (layar ponsel 0,55) bisa mengubah warna kaos dari hitam jadi biru. Bentuk dan warna tokoh harus konsisten (D-032): pakai cahaya kecil dan jauh dari badan.
8. **Insert kamera yang sangat dekat dengan blur DOF tinggi** bisa menghasilkan frame hitam. Selalu render still sebelum render penuh.

## Tambahan draft v2

9. **Offset waktu yang bulat dalam detik belum tentu bulat dalam frame floating-point.** 12,1 + 19,0333 jatuh 1e-12 di bawah frame 934, sehingga satu frame menampilkan shot yang salah. Hitung waktu blok yang dipakai ulang dari indeks frame bulat, lalu jalankan ulang dump per frame setiap kali offset berubah.
10. **Bass untuk Shorts harus punya harmoni di atas 200 Hz.** Sub drop murni (82–100 % energi di bawah 80 Hz) hilang di speaker ponsel. Kick dengan energi 200–500 Hz ditambah saturasi ringan tetap terdengar. Ukur di pita > 300 Hz.
11. **Salin konstanta komponen Ep 1, bukan menirunya dari tangkapan layar,** lalu ukur kotak krem pada frame resolusi penuh. Hasilnya identik sampai piksel.

