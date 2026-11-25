---
type: lesson
date: 2026-11-24
content-id: "2026-11-006"
topic: merakit pratinjau episode penuh Ep 5 (set baru, kanal CCTV, cek gerak, audio penutup v0f)
status: pratinjau v1 dirender; menunggu tinjauan pemilik
---

# Merakit Ep 5: yang terbukti

Rincian dan angka: [[04-PRODUCTION/2026-11-006/content]] §4. Kode: `studio/src/ep006/` (`stage006.ts`, `Episode006.tsx`, `sets006.tsx`, `overlay006.tsx`, `Chan006.tsx`), audio `scripts/ep006_episode_audio.py`, QC `scripts/ep006_preview_qc.py`, `studio/tools/e006_check.ts`, `e006_captions.ts`, `e006_beats.ts`.

1. **`View` dirender 1080×1920 tetap** (`inkbeat/core/View.tsx`, default `width/height`). Komposisi still lanskap (960×540) memotong tengah render potret: semua kanal CCTV pertama tampak "salah arah". Render potret, lalu potong pita 16:9.
2. **`StreetSet dense` punya dinding bata gang** di z = gangZ − 1,6 (−8,1) yang memotong ruang toa R2. Prop baru `gangWall={false}` (default tetap ada). Cek dulu benda set lama di lokasi set baru.
3. **Kanal CCTV yang terbaca:** frame dari episode final Ep 1–4 (ruangan yang sudah dikenal penonton) lebih terbaca daripada render baru dari posisi LED tersembunyi (gelap, sudut plafon). Potong di atas pita caption (y < 1260) karena frame final membawa caption terbakar.
4. **Ruang kecil = urutan masuk penting.** Punggung Uq di ROOT_A hanya 0,27 m dari dinding selatan: adik masuk dulu ke sisi timur, Uq menyusul. Cek gerak menemukan 9 tabrakan di run 1 (tangan di kusen, adik di jalur Uq, kamera di dalam adik); semua kecuali kontak disengaja di bukaan pintu belakang hilang setelah 6 run.
5. **Jalur sendi bukan jalur dunia:** interpolasi sendi dari tangan di tepi pintu (dalam ruangan) ke posisi istirahat menyapu tangan melewati kusen. Dua kunci tambahan di garis lurus dunia memperbaikinya.
6. **Audio acuan yang dibuat di luar repo** (v0d–v0f) harus direproduksi dari angka: envelope rms per jendela (3,25/3,40/3,50/3,70–3,90 s) paling cocok dengan `Two_deep_cinematic_Doom` + sfx-19 (grid fit), denging dari spektrum (2760 Hz + 1058 Hz). Penutup ditambahkan **sesudah** master agar normalisasi −14 LUFS tidak menggeser levelnya.
7. **Pustaka cek gerak:** kotak dinding utara dapur menutupi bukaan pintu belakang; tangan di gerendel tercatat "MASUK". Laporkan koordinat tangan (di dalam bukaan) daripada menghapus kotak.
8. **Cek reproduksi terhadap acuan dengan gambar, bukan hanya waktu.** Glitch v3 lolos angka waktu (3,40 / 3,90 s) tetapi terlihat lain dari v0f (latar abu-abu, pita terang). Strip frame berdampingan (tiap 0,2 s) menemukannya; v4 memindahkan glitch ke huruf.
9. **Perspektif suara per shot:** satu take yang diputar kering dan lewat toa sekaligus harus di-*duck* per shot (jalan = toa, ruang = kering). Duck dipasang SESUDAH pengukuran LUFS (kalau di dalam filter cue, gain normalisasi membatalkannya).
