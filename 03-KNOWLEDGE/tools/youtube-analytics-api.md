---
type: tool-evaluation
tool: YouTube Data API v3 + YouTube Analytics API v2
checked: 2026-11-17
status: disiapkan (belum ada pengambilan data nyata)
tags: [tool, analytics, youtube]
related: "[[ARCHITECTURE]], [[05-DATA/analytics/2026-11-002/2026-11-17-snapshot-01-analisis|snapshot 1]]"
---

# YouTube Data API + Analytics API: integrasi baca untuk Uq.cerita

Integrasi ini **hanya membaca** data. Tidak ada jadwal latar, layanan berbayar, atau unggahan. Kode: `scripts/analytics/youtube_api.py` dan `scripts/analytics/common.py`. Hanya memakai pustaka standar Python, tanpa paket baru.

## Akses

- **OAuth 2.0:** client tipe **Desktop app**, redirect loopback `http://127.0.0.1:<port>`, PKCE S256. Copy/paste (OOB) tidak lagi didukung Google.
  Sumber: https://developers.google.com/youtube/reporting/guides/authorization/installed-apps (dibaca 2026-11-17).
- **Scope minimum (read-only):**
  - `https://www.googleapis.com/auth/youtube.readonly`: Data API. Halaman `reports.query` juga menyebut scope ini wajib.
  - `https://www.googleapis.com/auth/yt-analytics.readonly`: Analytics API.
  Sumber: https://developers.google.com/youtube/analytics/reference/reports/query.
- **Biaya:** kedua API tidak butuh billing untuk kuota standar. Status: OBSERVATION, belum diuji di akun ini.
- **Mode "Testing":** aplikasi OAuth berstatus Testing hanya bisa dipakai test user yang didaftarkan, dan refresh token-nya kedaluwarsa setelah 7 hari. Status: HYPOTHESIS dari ketentuan Google yang umum diketahui; dibuktikan saat refresh pertama gagal. Bila kedaluwarsa, jalankan ulang `auth`.

## File

| File | Isi | Git |
|---|---|---|
| `%USERPROFILE%\.uq-story-analytics\google_oauth_client.json` | JSON client Desktop dari Google Cloud (diunduh pemilik) | di luar repo |
| `%USERPROFILE%\.uq-story-analytics\youtube_token.json` | access/refresh token (ditulis `auth`, tidak pernah ditampilkan) | di luar repo |
| `05-DATA/analytics/youtube_channel.json` | channel yang dikonfirmasi pemilik (ID publik) | ya |
| `05-DATA/analytics/api_snapshots.csv` | semua metrik, format panjang (satu baris = satu metrik × periode × dimensi) | ya |
| `05-DATA/analytics/<content-id>/api/youtube_<waktu>.json` | respons API mentah, tanpa token | ya |
| `05-DATA/analytics/api_runs.jsonl` | log eksekusi, tanpa secret | ya |
| `05-DATA/metrics.csv` | +1 baris bila penghitung publik berubah; skema tidak diubah | ya |

- **Izin folder kredensial:** hanya akun pengguna lokal (`icacls`: inheritance dihapus, `(OI)(CI)F` untuk pengguna saja).
- **Pengaman:** script berhenti bila folder kredensial berada di dalam repo.

## Perintah

```
python scripts/analytics/youtube_api.py auth
python scripts/analytics/youtube_api.py whoami
python scripts/analytics/youtube_api.py confirm-channel <CHANNEL_ID>
python scripts/analytics/youtube_api.py fetch --content-id 2026-11-002 [--dry-run]
```

- `fetch` menolak berjalan bila channel belum dikonfirmasi pemilik.
- `fetch` juga berhenti bila token milik channel lain, atau video bukan milik channel itu.

## Data yang diambil

| Laporan | Sumber | Scope | Isi |
|---|---|---|---|
| `video_public_counters` | Data API `videos.list` | `lifetime_counter` | `viewCount`, `likeCount`, `commentCount` kumulatif saat pengambilan |
| `video_daily` | Analytics `reports.query`, `dimensions=day` | `date_range_daily` | views, engagedViews, estimatedMinutesWatched, averageViewDuration, likes, comments, shares, subscribersGained/Lost per hari |
| `video_range_total` | Analytics, tanpa dimensi | `date_range_total` | metrik di atas + averageViewPercentage, dari tanggal mulai sampai hari terakhir yang tersedia |
| `video_traffic_source` | Analytics, `insightTrafficSourceType` | `date_range_total` | views, engagedViews, menit tonton per sumber traffic |
| `video_retention` | Analytics, `elapsedVideoTimeRatio` | `date_range_total` | `audienceWatchRatio`, `relativeRetentionPerformance` (100 titik, satu video) |

## Definisi dan batasan (dari dokumentasi resmi, 2026-11-17)

- **views:** "represents different numbers in different types of reports"; termasuk co-view di TV.
- **engagedViews:** view yang melewati frame pertama, atau saat pengguna mengetuk untuk memutar.
- **averageViewPercentage:** rata-rata persen video yang ditonton per pemutaran. **Bukan completion rate.** API tidak menyediakan completion rate.
- **audienceWatchRatio:** rasio absolut penonton yang masih menonton di titik tertentu video.
- **relativeRetentionPerformance:** 0–1, dibanding video berdurasi serupa.
- **"Viewed vs swiped away" / "Shown in feed" (Shorts):** **tidak ada** di daftar metrik API. Tetap diambil manual dari YouTube Studio.
- **Latensi:** API mengembalikan data "up until the last day for which all metrics in the query are available". Laporan per hari tidak memuat hari-hari terbaru. Script mencatat `period_end` = hari terakhir yang benar-benar dikembalikan.
- **Zona waktu tanggal laporan:** tidak disebut di dokumentasi API. Script mencatatnya sebagai tidak disebut, dan memulai rentang satu hari sebelum tanggal publikasi UTC agar tidak ada hari yang terlewat.
- **Jangan membandingkan** `viewCount` (penghitung publik) langsung dengan `views` Analytics atau angka Studio 28 hari. Sumber dan periodenya berbeda.

Sumber:
- https://developers.google.com/youtube/analytics/metrics
- https://developers.google.com/youtube/analytics/dimensions
- https://developers.google.com/youtube/analytics/channel_reports

## Dedup

- Satu laporan disimpan sebagai satu `snapshot_key` = hash(platform, video, laporan, periode, nilai).
- Bila dijalankan ulang dengan periode dan nilai yang sama, laporan **dilewati**.
- Penghitung lifetime dibandingkan berdasarkan nilai saja, karena `period_end` = waktu pengambilan.
- `metrics.csv` hanya bertambah bila views/likes/comments publik berubah dari baris API terakhir.

## Status

- 2026-11-17: kode dan folder kredensial siap. Uji offline dengan respons tiruan lolos (tulis, dedup, fallback metrik).
- 2026-11-17 20:33 WIB: login OAuth berhasil dengan kedua scope; channel `UCvVSxi8NwGhsKfCXAauBZKA` (Uq.cerita) cocok dengan pemilik video `iOk68iitJu4` dan dikonfirmasi. **Pengambilan data nyata pertama berhasil:** penghitung publik (Data API) tersimpan; Analytics API valid tetapi belum mengembalikan baris (umur video ±13 jam). Dedup diuji pada data nyata (rerun tidak menggandakan). Laporan: [[2026-11-17-snapshot-02-youtube-api]].
- Perbaikan: keluaran konsol dipaksa UTF-8 (judul video memuat emoji; cp1252 Windows membuat script gagal).
- Instagram dan TikTok: belum disiapkan (urutan: YouTube dulu).
- 2026-11-18 22:03 WIB: `fetch` untuk Ep 1 dan Ep 2 (opsi `--video-id` baru). Analytics API tetap 0 baris, termasuk tingkat channel (views = 0) ketika penghitung publik 235 ribu (OBSERVATION; penyebab UNKNOWN). **Temuan scope:** `commentThreads.list` dengan token `youtube.readonly` → HTTP 403 "insufficient authentication scopes" (VERIFIED). Mengambil komentar lewat OAuth butuh scope `youtube.force-ssl`, yang juga mengizinkan menulis/menghapus komentar (lebih luas dari "read-only"); belum diminta. Alternatif tanpa memperluas izin: API key (HYPOTHESIS: `commentThreads.list` untuk video publik bisa dipakai dengan API key) atau ekspor manual dari Studio.

