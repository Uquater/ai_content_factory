"""Count A/B votes in Ep 2 comments (read-only, offline).

Input : JSON from `youtube_extra.py comments` (authors are salted SHA-256 hashes).
Rules : one account = one vote; unclear / both / negated / changed-mind accounts go to
        the separate 'ambigu' list for manual review; channel-owner comments ignored.
  A = "intip pintu depan" (kartu KIRI)   B = "tetap diam bersama adik" (kartu KANAN)
  Variations: A / kiri / intip ; B / kanan / diam.
Usage : python -I scripts/analytics/count_votes.py <comments.json> <out.md>
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

NEG = re.compile(r"\b(jangan|jgn|tidak|tak|nggak|ngga|gak|ga|enggak|bukan)\b", re.I)
A_LETTER = re.compile(r"(?<![a-z0-9])(?:pilihan\s+|opsi\s+|pilih\s+)?a(?![a-z0-9])", re.I)
B_LETTER = re.compile(r"(?<![a-z0-9])(?:pilihan\s+|opsi\s+|pilih\s+)?b(?![a-z0-9])", re.I)
A_PHRASE = re.compile(r"intip|\bkiri\b", re.I)
B_PHRASE = re.compile(r"\bdiam\b|bersama\s+adik|\bkanan\b", re.I)
LOOSE = re.compile(r"pintu\s+depan|buka\s+pintu|keluar|liat|lihat", re.I)


def classify(text: str) -> str:
    t = text.strip()
    a = bool(A_PHRASE.search(t)) or bool(A_LETTER.search(t))
    b = bool(B_PHRASE.search(t)) or bool(B_LETTER.search(t))
    if a and b:
        return "ambigu"
    if (a or b) and NEG.search(t):
        return "ambigu"  # "jangan intip" etc.: needs a human
    if a:
        return "A"
    if b:
        return "B"
    return "ambigu" if LOOSE.search(t) else "none"


def main() -> None:
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    data = json.loads(src.read_text(encoding="utf-8"))
    owner = data.get("owner_channel_hash")
    per = defaultdict(list)
    for c in data["comments"]:
        if c["author"] == owner:
            continue
        per[c["author"]].append((classify(c["text"]), c))
    votes = {"A": [], "B": [], "ambigu": []}
    n_none = 0
    for acc, items in per.items():
        kinds = {k for k, _ in items if k != "none"}
        if not kinds:
            n_none += 1
        elif kinds == {"A"}:
            votes["A"].append(acc)
        elif kinds == {"B"}:
            votes["B"].append(acc)
        else:
            votes["ambigu"].append(acc)  # ambiguous text or changed mind
    lines = [f"# Suara A/B Ep 2 ({data['video_id']})", "",
             f"Akun unik (tanpa pemilik): {len(per)}. Komentar: {len(data['comments'])}.", "",
             "| | akun |", "|---|---:|",
             f"| A (intip pintu depan) | {len(votes['A'])} |",
             f"| B (tetap diam bersama adik) | {len(votes['B'])} |",
             f"| Ambigu (dipisah, tinjau manual) | {len(votes['ambigu'])} |",
             f"| Bukan suara | {n_none} |", "", "## Ambigu", ""]
    for acc in votes["ambigu"]:
        for k, c in per[acc]:
            lines.append(f"- `{acc}` [{k}] {c['text'][:200]!r}")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"A={len(votes['A'])} B={len(votes['B'])} ambigu={len(votes['ambigu'])} none={n_none} -> {out}")


if __name__ == "__main__":
    main()
