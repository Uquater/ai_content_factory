---
type: lesson
date: 2026-11-15
related: "[[04-PRODUCTION/2026-11-001/content|2026-11-001]] §6.3, [[DECISION-LOG#D-021]]"
---

# Pelajaran: revisi bahu dan gerak C1 di pipeline 3D inkbeat

1. **Lengan inkbeat hanya bergerak di bidang vertikal** (`armChain`: sudut bahu, siku, dan putaran bidang). Untuk karakter kecil di meja yang tinggi, siku tidak bisa lewat di atas papan meja pada jarak raih menengah.
   - Solusi tanpa mengubah inkbeat: *swivel* siku mengelilingi sumbu bahu–tangan (`studio/src/c1/c1rig.ts`).
   - Posisi tangan tetap, jadi IK inkbeat tetap berlaku.
2. **Cek numerik per frame menemukan masalah yang tak terlihat di still:**
   - siku menembus meja;
   - cabang IK meloncat;
   - telapak lepas dari gelas.

   Alatnya `npm run check:reach`. Urutan kerja: angka dulu, lalu still dari kamera asli, lalu strip setiap frame di bagian gerak cepat.
3. **Strip setiap frame diperlukan.** Lembar kontak (tiap 2–3 frame) melewatkan tangan yang melayang dan lengan yang menembus torso.
4. **Menaikkan sendi bahu punya efek samping:**
   - spline batang lengan melengkung ke atas bahu;
   - shrug mendorong sendi keluar dari kaos.

   Solusinya: batang lengan dimulai di dalam lengan kaos.
5. **Solver IK lokal perlu pose kunci di tiap titik lintasan.** Interpolasi linear dari pose istirahat ke pose kontak membuat solver tersangkut di cabang yang salah.
