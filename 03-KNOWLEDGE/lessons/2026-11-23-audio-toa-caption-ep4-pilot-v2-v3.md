---
type: lesson
date: 2026-11-23
content-id: "2026-11-005"
topic: audio toa dan caption pilot pembuka Ep 4, v2 → v3 (checklist untuk Sonnet)
status: menunggu tinjauan pemilik (bunyi belum didengar oleh Claude)
---

# Audio toa dan caption pilot Ep 4: v2 → v3

Pemilik mendengar pilot v2 dan menilai dua hal: suara toa terasa asing, dan gaya caption beda dari Ep 1–3. Pilot v3 memperbaiki keduanya. Dokumen ini mengubah perbaikan itu menjadi checklist yang bisa dijalankan ulang saat merakit episode penuh ([[04-PRODUCTION/2026-11-005/content.md]] §12).

## Sumber

| Apa | Di mana |
|---|---|
| Acuan utama (MP4 final Ep 3) | `_media/2026-11-004/out/final_v1/episode_2026-11-004_final_v1.mp4` (−14,2 LUFS, TP −1,9 dBTP) |
| Skrip mix Ep 3 yang dipakai sebagai acuan | `scripts/ep004_episode_audio_v2.py`, laporan `_media/2026-11-004/audio/episode/2026-11-004_episode_v2_report.txt` dan `…_cues.txt` |
| Skrip mix pilot Ep 4 | `scripts/ep005_pilot_audio.py` (`plan`/`mix`, opsi `--v v3`), rantai toa `TOA_CHAIN` di `scripts/ep003_pilot_audio.py` |
| Rencana waktu | `studio/src/ep005/pilot005v2-plan.json`, `pilot005v3-plan.json` |
| Pilot v2 / v3 | `_media/2026-11-005/out/pilot_open_v2/pilot_2026-11-005_open_v2.mp4`, `…/pilot_open_v3/pilot_2026-11-005_open_v3.mp4` |
| Caption final Ep 3 (sumber aturan) | `studio/src/ep004/Episode004.tsx` bagian "captions" (`CAPTION_LINES`, `CAPTION_WORDS`, `CAPTION_PAGES`, `Captions`) |
| Caption yang dipakai ulang di Ep 4 | `studio/src/ep005/captions005.tsx` (`captionWords`, `captionPages`, `Captions005`), dipakai di `Pilot005v3.tsx` |

## Kasus: apa yang salah di v2

Take Dhani **tidak** bermasalah. P01 Ep 4 mentah hampir sama dengan P01 Ep 3: −20,2 vs −20,0 LUFS, nada dasar ≈ 110 vs 120 Hz, spektrum nyaris identik. Yang salah ada di mix:

1. **Master.** v2 menormalkan klip 10,8 s yang sebagian besar sunyi ke −14 LUFS. Itu butuh gain +15 dB (Ep 3: +7,5 dB), jadi semuanya naik: toa 3–4 dB lebih keras dari Ep 3 dan ditekan limiter, bed malam terlalu keras.
2. **Bunyi pembuka toa tidak ada.** Ep 3 selalu mendahului kata toa dengan bunyi pengeras suara menyala (`A_distant_outdoor_pu_#4`, 1,0 s). Tanpa itu toa muncul "tiba-tiba" dan terdengar asing.
3. **Bed dan dengung** hanya dipasang di sekitar toa, bukan sepanjang klip seperti Ep 3.
4. **Bed salah** (`Quiet_night_ambience_#1`; Ep 3 memakai `#3`).
5. **Caption** memakai gaya sementara pilot v1 (56 px, satu baris, tanpa sorotan kata).

### Angka v2 / v3 (VERIFIED, diukur dari MP4 audio, rms dBFS dan crest dalam dB)

| Bagian | Ep 3 final | v2 | v3 |
|---|---|---|---|
| Toa, rms | −15,0 (L4) / −15,5 (L9) | −11,7 | **−15,8** |
| Toa, crest | 15,5 / 15,9 | 12,3 | **16,3** |
| Toa, energi 1–2,5 kHz (relatif) | −8,4 (L4) | −6,1 | −7,0 |
| Toa, centroid spektral | 551 (L4) / 1236 (L9) | 696 | 625 |
| Pembuka toa, rms | −25,4 | tidak ada | **−25,3** |
| Bed sebelum toa, rms | tidak ada jendela bersih* | −20,6 | −27,5 |
| Bisikan D01, rms | −16,1 | −11,6 | **−16,0** |
| Limiter, tekanan maks di bisikan | 5,8 dB | belum diukur | 6,3 dB |
| Master | +7,5 dB, plafon −2,6 dB | +15 dB, plafon −2,6 | +7,5 dB, plafon −2,6 |
| Seluruh klip | −14,2 LUFS, TP −1,9 | −14,4 LUFS, TP −1,8 | **−19,2 LUFS**, TP −2,6 |

\* Jendela 11,0–12,5 s di Ep 3 berisi narasi, jadi tidak dipakai sebagai acuan bed. Bed Ep 3 dikunci lewat aturan cue (rms −36, dengung −42), bukan lewat ukuran jendela.

Centroid L4 vs L9 Ep 3 berbeda 2×. Itu beda kalimat dan take, bukan beda efek. Jadi centroid hanya penanda kasar: bandingkan dalam rentang Ep 3 (550–1240), bukan satu angka.

## Checklist audio

### A. Pilih adegan acuan
1. Ambil MP4 **final** episode sebelumnya, bukan pilot atau pratinjau.
2. Pilih adegan yang berisi unsur yang sama: toa + pembuka toa (L4, L9 Ep 3), bisikan adik (D01 Ep 3, 32,5–34,8 s), narasi (L6, 26,3–29,5 s).
3. Cari waktunya dari plan Ep 3 (`episode004-plan-d055.json` → `L4`, `L9`, `L7_D01`, `toa_open1/2`), jangan menebak.
4. Pilih jendela yang bersih: tanpa narasi atau SFX lain di rentang ukur.

### B. Bandingkan, bisa diukur (jalankan semuanya, catat dalam tabel seperti di atas)
Ekstrak mono 16 kHz dari kedua MP4 pada jendela yang sama panjangnya, hitung per jendela:
- rms dBFS dan puncak dBFS (`ffmpeg -ss A -to B -i X.mp4 -af astats` atau numpy);
- crest = puncak − rms (toa Ep 3: ≈ 15,5–16 dB; lebih rendah dari 14 berarti terkompres atau dilimit);
- pita energi 0–300, 300–1000, 1000–2500, 2500–4000, 4000–8000 Hz (relatif total) dan centroid;
- nada dasar median (autokorelasi 70–300 Hz). Toa Dhani ≈ 110–130 Hz; bisikan Zorin ≈ 280–290 Hz;
- loudness dan true peak seluruh klip: `ffmpeg -i X -af ebur128=peak=true -f null -`.

Toleransi yang dipakai di v3 (HYPOTHESIS, belum diuji lewat telinga pemilik): rms toa dan bisikan dalam ± 1 dB dari acuan; crest dalam ± 1 dB; pembuka toa dalam ± 1 dB.

### C. Sebab-akibat bila angka meleset
| Gejala | Periksa |
|---|---|
| Semua naik, crest turun | master dinormalkan di klip pendek (lihat §D) |
| Hanya toa keras | target `lufs` toa (−21,0) dan rantai efek; jangan menaikkan gain VO untuk menutup bed |
| Toa "asing" tanpa beda angka besar | bunyi pembuka hilang, atau jeda pembuka → kata pertama beda dari Ep 3 (1,0–1,1 s) |
| Bed menonjol | sumber bed (`#3` untuk Ep 3 dan Ep 4), aturan rms −36, dan master |
| Limiter terlalu aktif | `PA.limiter_gr`: bandingkan tekanan maks dengan bagian sama di Ep 3 (bisikan 5,8 dB; L4 6,9 dB) |

### D. Target pilot vs target episode penuh (jangan tertukar)
| | Pilot pendek (acuan level) | Episode penuh |
|---|---|---|
| Tujuan | level dan karakter sama dengan Ep 3, bisa dibandingkan | loudness platform |
| Master | **tetap**: gain +7,5 dB, plafon limiter −2,6 dB (master Ep 3 final) | normalisasi ke −14 ± 0,5 LUFS, TP ≤ −1,5 dBTP |
| Loudness hasil | tidak dinormalkan (v3: −19,2 LUFS karena isinya sedikit) | −14 ± 0,5 (Ep 3: −14,2) |
| Skrip | `ep005_pilot_audio.py mix --v v3` | skrip episode (turunan `ep004_episode_audio_v2.py`) |
Aturan: **klip pendek dengan banyak sunyi tidak dinormalkan ke −14.** Normalisasi hanya untuk episode utuh, setelah semua cue level aturan Ep 3 terpasang.

### E. Pasang berurutan
1. Cue VO dengan target LUFS Ep 3: narator −20,0; toa −21,0 (dengan `apad=pad_dur=0.6` + `TOA_CHAIN`); adik −22,5 (`highpass=f=90`).
2. Bunyi pembuka toa: `A_distant_outdoor_pu_#4.mp3`, `atrim=0:1.0`, fade out 0,3 s, `highpass=250,lowpass=2600,aecho=0.85:0.7:170|390:0.32|0.16`, puncak −12 dB, mulai **1,0 s sebelum kata pertama toa**.
3. Bed `Quiet_night_ambience_#3` rms −36 dan dengung `toa_hum.wav` rms −42, sepanjang klip.
4. SFX adegan (v3: klik selotip, puncak −16 dB, 0,02 s sebelum selotip menempel).
5. Master tetap atau normalisasi (§D), lalu `PA.true_peak` pada WAV dan AAC.

### F. Waktu dan jeda respons toa
- **Aturan Ep 4 (USULAN, belum diuji):** pembuka toa 0,08 s setelah lensa tertutup, kata pertama 1,0 s sesudahnya. Di v3: selotip menempel 4,62 s, pembuka 4,70 s, "Kalian" 5,70 s.
- Jeda dari kata terakhir toa ke bisikan adik: 0,8 s (beri waktu mendengar dan menoleh). Akhir bisikan harus utuh: ekor file 0,30 s dan ≥ 0,7 s bed sesudahnya.
- Ukur: level audio di jendela 100 ms; bisikan harus turun ke level bed sebelum klip berakhir, tidak terpotong.

### G. Cek dengar (hanya pemilik; Claude tidak bisa mendengar)
Pemilik menilai, Claude hanya menyiapkan jendela waktunya:
1. Kata "Kalian" (5,7–6,2 s) terdengar jelas di balik gema toa.
2. Bunyi pembuka toa terasa seperti pengeras suara menyala dan datang pada saat yang pas setelah lensa tertutup. Terlalu lambat? Opsi: pendekkan jeda pembuka → kata pertama (menyimpang dari Ep 3; catat sebagai keputusan).
3. Toa terasa konsisten dengan Ep 3 (bukan "asing"), dan tidak lebih keras dari narator.
4. Bisikan "Kalian siapa, Kak?" jelas dan tidak tertutup bed.
5. Jeda respons 0,8 s terasa wajar; ekor bisikan tidak terpotong.
6. Limiter di bisikan (10,34 s, 6,3 dB) tidak terdengar memompa.
Catat jawaban pemilik di Content Unit; jangan menandai "diterima" dari angka saja.

## Caption

### Aturan yang dipakai ulang (VERIFIED, disalin dari `Episode004.tsx`, Ep 3 final; kode di `captions005.tsx`)
| Aturan | Nilai |
|---|---|
| Font | Poppins 800, 88 px, `lineHeight 1.05`, huruf kapital |
| Outline | `WebkitTextStroke 13px #0e0a10`, `paintOrder: stroke fill`, bayangan `0 8px 18px rgba(0,0,0,.55)` |
| Posisi | pita berpusat di 70% tinggi: `top = 1920·0,7 − 80`, tinggi 160, `left/right 60`, kata dibungkus dan dipusatkan, `columnGap 24` |
| Warna per pembicara | narator `#ffffff`, toa `#ffe7a3`, adik `#ffc9d8` |
| Sorotan kata | kata yang sedang diucapkan lime `#d4f03c`, dari 0,066 s sebelum sampai 0,04 s sesudah kata |
| Teks | persis naskah, tanda kutip dibuang |
| Waktu kata | burst hasil `silencedetect` −40 dB / 0,12 s pada take; kata dalam satu burst dibagi menurut jumlah huruf (ASUMSI, sama dengan Ep 3) |
| Pemenggalan | maksimal 3 kata per halaman; putus di `. ? ! , …`, saat pembicara berganti, atau jeda > 0,15 s; satu baris memecah menurut jeda terukur (`split`) |
| Halaman | masuk 2 frame sebelum kata pertama, keluar 0,25 s setelah kata terakhir atau saat halaman berikutnya mulai |

Contoh Ep 4 v3: P01 `bursts` dari `capBursts` plan dengan `split: /^Kalian$/` → halaman "KALIAN" / "MEMILIH MENUTUPNYA."; D01 → "KALIAN SIAPA," / "KAK?".

Pakai komponen ini, jangan menulis gaya baru. Jika Ep 3 final berubah, ubah `captions005.tsx` dari `Episode004.tsx`, jangan sebaliknya.

### Bandingkan satu frame hasil render dengan acuan
1. Ambil frame Ep 3 final yang punya halaman caption dari pembicara yang sama (toa: L4 ≈ 14,0 s; adik: L7 ≈ 33,3 s): `ffmpeg -ss <t> -i episode_final.mp4 -frames:v 1 ref.png`.
2. Ambil frame Ep 4 pada frame tengah halaman (`remotion still … --frame=<n>`, atau dari MP4).
3. Taruh berdampingan (`hstack`) pada skala sama.

**Bisa diukur:**
- posisi vertikal pita (pusat y ≈ 1344 = 70%): cek bounding box piksel teks (warna lime/krem/merah muda) di kedua frame;
- tinggi huruf kapital (≈ 88 px font), tebal outline, warna per pembicara (ambil piksel inti huruf);
- jumlah kata per halaman ≤ 3, teks sama persis dengan naskah (bandingkan string dengan naskah v1.0);
- waktu: halaman muncul tidak lebih awal dari 2 frame sebelum kata pertama dan hilang paling lambat 0,25 s setelah kata terakhir (hitung dari plan atau burst);
- caption tidak menutup wajah atau tangan kunci di pita 70% (cek still, SKILL §2).

**Perlu dinilai saat ditonton atau didengar (pemilik):**
- sorotan lime terasa sinkron dengan suara (pembagian per huruf adalah ASUMSI);
- pemenggalan wajar saat dibaca, tidak terlalu cepat berganti;
- keterbacaan di ponsel dan di atas latar terang;
- caption untuk bisikan: kecocokan dengan tingkat suara.

## Batas
Bunyi tidak didengar Claude. Angka di atas hanya mengukur tingkat, spektrum, nada dasar, dan waktu; apakah toa "terasa konsisten dengan Ep 3" tetap penilaian pemilik. Take, naskah, dan Ep 1–3 tidak diubah.
