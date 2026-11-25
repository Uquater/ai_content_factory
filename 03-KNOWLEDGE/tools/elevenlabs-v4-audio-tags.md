---
type: research-note
title: "ElevenLabs eleven_v4 — audio tags untuk narasi Indonesia"
checked-date: "2026-11-15"
created: "2026-11-15"
updated: "2026-11-15"
tags: [tool, tts, elevenlabs]
related: "[[DECISION-LOG]] D-023, [[tts-ringkasan]]"
---

# ElevenLabs `eleven_v4` — audio tags

Dipakai pertama di 2026-11-002 (§9.5a). Pemilik menilai pendekatan ini berhasil (2026-11-15).

## Fakta (VERIFIED, dokumentasi resmi, dicek 2026-11-15)
- Sumber: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices, bagian "Prompting Eleven v4".
- Tag ditulis dalam `[kurung siku]`, tepat sebelum atau sesudah bagian yang diatur.
- Daftar tag resmi **tidak lengkap**. Tag deskriptif berbahasa Inggris juga dicontohkan, mis. `[Low, steady voice, restrained urgency]`.
- KAPITAL menambah penekanan. Elipsis menambah jeda.
- `<break time>` (SSML) **tidak** didukung v4/v3. Jeda panjang diatur saat editing.
- Paket Free: voice library hanya bisa dipakai lewat situs web, bukan API (HTTP 402).

## Pola yang dipakai (OBSERVATION, satu episode)
- Satu tag pembuka per perubahan emosi. Tidak setiap kalimat diberi tag.
- Bentuk tag: 2–4 kata sifat pembawaan, mis. `[quick, tense]`, `[slow, heavy]`, `[softly]`, `[quiet, restrained, low voice]`.
- Penekanan satu kata dengan KAPITAL: `“JANGAN keluar dulu.`
- Pengumuman: `[short breath] [flat, formal announcement, slightly hoarse]`.
- Bisikan karakter: `[whispers, scared, holding her breath]`.
- Teks yang ditempel hanya kalimat naskah + tag. Paragraf arahan atau pagar kode bisa ikut terbaca (terjadi di sampel P01).
- Pengaturan episode itu: stability 0,77, similarity 0,43 (UI v4). Pengaruh stability terhadap kepatuhan tag: UNKNOWN.

## Batasan
- Tag yang sama **tidak menjamin** emosi yang sama di suara, model, atau kalimat lain. Selalu dinilai dengan mendengarkan.
- Tag di luar daftar resmi (mis. `[short breath]`, `[slightly hoarse]`) bisa saja diabaikan atau terucap. Periksa saat mendengar.
