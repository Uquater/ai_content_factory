"""Episode 3 (2026-11-004), D-058: compare every on-screen string of the Episode004 composition with the locked script v1.0
(content.md §2 / §2.1) character by character. Input: the JSON printed by `node <bundle of tools/e004_episode_check.ts> strings`.
usage (from the repo root): python studio/tools/e004_text_diff.py <strings.json> > <report.txt>
Captions are compared AS SHOWN: quotes stripped and upper-cased (the caption code does both, as Ep 2)."""
import difflib
import io
import json
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
S = json.load(io.open(sys.argv[1], encoding="utf-8"))
md = io.open("04-PRODUCTION/2026-11-004/content.md", encoding="utf-8").read()
sec = md[md.index("### 2.1"):md.index("### 2.2")]
rows = {m.group(1): m.group(3).strip() for m in re.finditer(r"^\| (L\d+|V\d) \| ([^|]+) \| (.+?) \| [^|]*\| [^|]*\|$", sec, re.M)}
print(f"Naskah v1.0 §2.1: {len(rows)} baris dibaca ({', '.join(rows)})")
strip = lambda s: s.replace("“", "").replace("”", "").replace('"', "")
bad = 0


def cmp(name, shown, ref):
    global bad
    ok = shown == ref
    bad += 0 if ok else 1
    print(f"{name}: {'IDENTIK' if ok else 'BEDA'} ({len(shown)} karakter)\n   layar : {shown!r}\n   naskah: {ref!r}")
    if not ok:
        for op, a1, a2, b1, b2 in difflib.SequenceMatcher(None, ref, shown).get_opcodes():
            if op != "equal":
                print(f"   {op}: naskah[{a1}:{a2}]={ref[a1:a2]!r} -> layar[{b1}:{b2}]={shown[b1:b2]!r}")


print("\n-- UI pesan (S06, S14); naskah memberi tanda kutip sebagai penanda PESAN, gelembung tanpa kutip")
cmp("L5 gelembung S06/S14", S["L5"], strip(rows["L5"]))
cmp("L10 gelembung S14", S["L10"], strip(rows["L10"]))
print(f"   kepala UI: {S['header']!r}; naskah [VISUAL] 'chat dari NOMOR TIDAK DIKENAL' = arahan layar, bukan teks terkunci (huruf besar di arahan)")
print(f"   nomor tersamar: {S['number']!r}; tidak ada di naskah (storyboard S06, D-057)")
print("\n-- kartu dan label")
a, b = [x.strip() for x in rows["V2"].split("/")]
cmp("kartu akhir KIRI", S["final"][0], a)
cmp("kartu akhir KANAN", S["final"][1], b)
cmp("kartu recap kanan (tertekan)", S["recap"][1], "tetap diam bersama adik")
cmp("kartu recap kiri", S["recap"][0], "intip pintu depan")
print("   rujukan recap: naskah v1.0 §2 [VISUAL] 'tetap diam bersama adik' tertekan; kiri = kartu Ep 2 (2026-11-003 content.md, D-043)")
cmp("label", " / ".join(S["label"]), rows["V1"])
print("\n-- caption seperti tampil (kutip dibuang, HURUF BESAR)")
for lid, txt in S["captions"]:
    ref = rows["L8"] if lid.startswith("L8") else rows[lid]
    if lid.startswith("L8"):
        ok = txt in ref
        cmp(lid, strip(txt).upper(), strip(txt).upper() if ok else "<tidak ditemukan di L8>")
    else:
        cmp(lid, strip(txt).upper(), strip(ref).upper())
print("L8a + L8b + L8c = L8 naskah:", " ".join(t for i, t in S["captions"] if i.startswith("L8")) == rows["L8"])
print("Tidak dicaption (aturan Ep 2 'msg'): L5, L10 (tampil di UI ponsel)")
shown = json.dumps(S, ensure_ascii=False).lower()
print("Nama film inspirasi di teks layar:", [n for n in ("badai", "matahari") if n in shown] or "tidak ada")
print(f"\nRINGKAS: {bad} selisih")
