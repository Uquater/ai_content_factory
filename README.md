# AI Content Factory

Sistem produksi video pendek berbahasa Indonesia berbantuan AI untuk TikTok, Instagram Reels, dan YouTube Shorts.

Folder ini sekaligus **vault Obsidian** dan **repository Git lokal**. Semua pekerjaan dilakukan di satu laptop Windows.

## What this repository is (English summary)

A working, documented example of an AI-assisted short-video production system, run by one person on one Windows PC (RTX 3050 Ti) and published as it evolves. It is a **workspace and reference implementation, not an installable package**: there is no `pip install` or `npm install` entry point for the whole repo, and no release process yet.

What is in it, and what someone else could reuse:

| Part | What it is | Reuse |
|---|---|---|
| `studio/` | Remotion 4 + React Three Fiber toon-shaded 3D video project (vertical 1080x1920), with per-episode scenes and many numeric QC scripts in `studio/tools/` (reach, clearance, flicker, safe-zone, caption checks). Based on the MIT-licensed `inkbeat-shorts` starter (see `.claude/skills/inkbeat-shorts/`). | Scene/QC patterns for deterministic 3D renders |
| `scripts/` | Python audio and SFX tooling (mixing, loudness analysis, synthesized SFX) and a YouTube Data API analytics collector (`scripts/analytics/`, secrets kept outside the repo). | Standalone scripts, adapt paths |
| `00-CORE/`, `03-KNOWLEDGE/`, `04-PRODUCTION/`, `templates/` | An Obsidian + Git vault: one `content.md` per video, an append-only decision log, lessons per experiment. | Copy the structure and templates |
| `CLAUDE.md`, `.claude/skills/` | Operating rules and project skills for Claude Code, with vendored third-party skills pinned by commit (`.claude/skills/VENDOR.md`). | Example of agent-driven repo workflow |

Status and limits, stated plainly: the project is young, has no external users or stars yet, content is mostly in Indonesian, and several scripts assume the author's local folder layout (`_media/` is not in Git). Contributions and forks are welcome; see `CONTRIBUTING.md`. License: MIT (`LICENSE`); third-party material keeps its own license.

## Mulai dari sini

| Dokumen | Isi |
|---|---|
| `CLAUDE.md` | Satu-satunya sumber aturan kerja dan pipeline produksi |
| [ARCHITECTURE](00-CORE/ARCHITECTURE.md) | Struktur sistem, folder, Content Unit, keamanan |
| [DECISION-LOG](00-CORE/DECISION-LOG.md) | Keputusan proyek beserta alasannya (append-only) |
| [ROADMAP](00-CORE/ROADMAP.md) | Milestone dan status tugas |
| [PROJECT-IDENTITY](00-CORE/PROJECT-IDENTITY.md) | Ringkasan proyek satu halaman |
| [ENVIRONMENT](03-KNOWLEDGE/tools/ENVIRONMENT.md) | Hasil verifikasi perangkat |
| [STUDIO-WORKFLOW](02-CHANNELS/lab/STUDIO-WORKFLOW.md) | Workflow produksi akun lab (video 3D cartoon: karakter, cerita, tahapan, gerbang look-dev/pilot) |

## Struktur folder

```
00-CORE/          arsitektur, keputusan, roadmap, identitas proyek
.claude/skills/   skill Claude Code (dibuat bertahap mulai Milestone 1)
02-CHANNELS/      Channel DNA per channel (_template/, lab/)
03-KNOWLEDGE/     research/, experiments/, lessons/, tools/
04-PRODUCTION/    satu folder per Content Unit: <YYYY-MM-NNN>/content.md
05-DATA/          metrics.csv (metrik performa, diisi manual)
scripts/          otomasi Python + FFmpeg
templates/        template catatan Obsidian
refrences/        referensi pemilik: gambar desain, handoff, video referensi gaya
_media/           aset berat (gambar, audio, video) — TIDAK masuk Git
```

## Template

Template Obsidian ada di `templates/` (plugin inti **Templates**, folder sudah diatur di `.obsidian/templates.json`):

| Template | Dipakai untuk | Lokasi hasil |
|---|---|---|
| `content-unit.md` | Satu video (ide → publikasi → performa) | `04-PRODUCTION/<id>/content.md` |
| `research-note.md` | Catatan riset tren | `03-KNOWLEDGE/research/YYYY-MM-DD-topik.md` |
| `experiment.md` | Eksperimen konten | `03-KNOWLEDGE/experiments/EXP-NNN-topik.md` |
| `tool-evaluation.md` | Evaluasi tool (harga, lisensi, uji) | `03-KNOWLEDGE/tools/nama-tool.md` |

Template Channel DNA ada di `02-CHANNELS/_template/CHANNEL-DNA.md`. Salin manual ke `02-CHANNELS/<nama-channel>/`.

## Alur kerja harian

1. Buka [ROADMAP](00-CORE/ROADMAP.md) dan entri terbaru [DECISION-LOG](00-CORE/DECISION-LOG.md).
2. Kerjakan tugas. Perubahan status konten dicatat di `content.md`.
3. Catat keputusan baru, perbarui roadmap, simpan pelajaran penting.
4. `git status` → periksa tidak ada file kredensial → `git commit`. (Remote: GitHub `Uquater/ai_content_factory`.)

## Keamanan

- Jangan pernah meng-commit `.mcp.json`, `.env`, token, atau API key. Semuanya sudah dikecualikan di `.gitignore`.
- Konfigurasi plugin Obsidian MCP berisi token lokal dan tidak masuk Git.
- Jika kredensial pernah ter-commit, **buat ulang token tersebut**. Menghapusnya dari riwayat Git saja tidak cukup.

## Kebutuhan perangkat lunak

- Python 3.12+ (3.14.4 terpasang)
- FFmpeg + ffprobe 9.0.2 (terpasang via Chocolatey, diverifikasi 2026-11-14; lihat [ENVIRONMENT](03-KNOWLEDGE/tools/ENVIRONMENT.md))
- Node.js (proyek `studio/`; `npm ci` di folder itu)
- Git
- Obsidian
