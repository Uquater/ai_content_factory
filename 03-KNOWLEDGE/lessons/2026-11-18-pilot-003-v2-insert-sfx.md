---
type: lesson
created: 2026-11-18
related: "[[04-PRODUCTION/2026-11-003/content|2026-11-003]] §11, [[DECISION-LOG#D-041]], [[sfx-pustaka]]"
---

# Pilot 2026-11-003 v2: insert kaca, kilas balik, SFX bervariasi

1. **Benda yang nanti disebut dalam dialog butuh shot sendiri.** Kaca seluas 0,87 % bingkai (tinggi 5,5 %) yang menyala penuh 0,36 s tidak cukup menjadi dasar kalimat "tadi terang". Insert 1 s dengan kaca 13,8 % bingkai (sudut kaca diproyeksikan, `tools/p003v2_glass.ts`), ditambah kilas balik dari lensa yang sama, membuat ucapan itu punya dasar visual.
2. **Kaca yang "menyala" bisa terbaca sebagai cahaya dari luar.** Albedo pucat ditambah cahaya ambient biru dan emissive dingin menghasilkan ungu pucat (R/B 0,92; frame insert f195, area kaca yang sama) di dalam lingkaran cahaya hangat. Cek warna kaca dengan dan tanpa senter (probe `noTorch`). Albedo yang hangat menurunkan pantulan ambient biru.
3. **Uji emissive dulu sebelum menyetelnya.** Emissive merah penuh menunjukkan sebagian besar "cahaya malam" di kaca berasal dari cahaya ambient, bukan emissive.
4. **Selaraskan SFX ke transien, bukan ke awal file.** Awal suara dari silence detection (−45 dB) bisa jatuh pada napas sebelum kata. Puncak "Klik" yang terdengar ada 0,138 s sesudahnya.
5. **"Dua klik" bisa diukur.** Hitung transien dalam ± 0,3 s di sekitar puncak (5 ms, naik ≥ 8 dB). Tiga dari empat variasi gerendel punya transien susulan atau pra-klik ≥ −6 dB.
6. **Tapak kaki diambil dari stage per frame, bukan dari rumus gait.** Data yang sama sekaligus mengukur P4. Hasilnya, campuran kaki 0,25 s membuat kaki meluncur 7,7–12 cm, padahal tidak terlihat di contact sheet v1.
7. **True peak diukur pada AAC final.** WAV −2,5 dBTP menjadi AAC −2,2 sampai −2,4 dBTP. Limiter pada 4× sample rate dan pengukuran ulang AAC di dalam skrip memenuhi syarat ≤ −1,5 dBTP.
8. **Refactor modul dicek dengan dump state per frame.** Bandingkan JSON `stageAt` untuk semua frame sebelum dan sesudah. Cara ini lebih murah daripada membandingkan still dan mencakup setiap frame.
9. **Batas potongan dibulatkan ke frame.** Bila `Sequence` mulai di frame `round(t·30)` sementara shot dipilih dengan `t ≥ awal`, frame pertama bisa masih menampilkan shot sebelumnya.

## Tambahan v3 (2026-11-18)

10. **Ukur latensi limiter sebelum membandingkan selubung.** Latensi 96 sampel (2 ms) membuat onset tajam tampak tertekan 14,6 dB. Setelah diselaraskan, angka sebenarnya ≤ 2 dB. Laporan v2 harus dikoreksi.
11. **Periksa kontinuitas akar tubuh per frame di setiap sambungan antar fungsi gerak.** `walkTo` berhenti 32 cm lebih jauh dari target, sedangkan gerak berikutnya mulai dari target, sehingga tubuh melompat 31 cm. Pemeriksaan sudut sendi dan contact sheet tidak menangkap lompatan ini. Cara murah: ukur `max |root(f) − root(f−1)|`.
12. **Aturan level RMS menetralkan EQ.** Shelf pada bed yang levelnya diatur lewat RMS pita lebar hanya menambah +0,8 dB di pita ponsel. Atur levelnya di pita yang ingin didengar.
13. **HPF pada suara berbisik bisa menaikkan puncak** (pergeseran fase). Ukur puncak sesudah filter.
