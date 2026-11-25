"""Assemble a full-story voice-over preview from raw VO segments (no generation, no credits).

Optional per segment: "source_window_s": [start, end] keeps only that part of the raw file
(v2: drops a repeated take inside D02). Bursts outside the window are ignored.

Input: a JSON config (segment order, L# lines per segment, speech-to-speech gaps, loudness
targets, which segments get the PA/"toa" effect, optional extra silence inside a segment).
Raw files are only read. Outputs never overwrite existing files.

Steps:
  1. Detect speech intervals per raw file (ffmpeg silencedetect).
  2. Trim only leading/trailing silence quieter than `trim_db`, keeping `trim_margin_s` around speech
     (words and breaths above that threshold are never cut).
  3. Split a segment into L# sentences at its largest internal pauses (estimate; for timing only,
     except where `insert_silence_after` asks to physically open a pause there).
  4. Toa copies: band-limit + mild soft-clip + short echo, saved separately.
  5. Per-piece gain to a loudness target, place pieces on a timeline with the configured gaps,
     master to target LUFS / true peak (two-pass loudnorm, linear).
  6. Write WAV + MP3 preview, a timing JSON (per segment and per L#), and a join report.

Usage (repo root):
  python scripts/vo_preview.py --config 04-PRODUCTION/2026-11-002/render/vo-preview-v1.json [--analyze]
"""
import argparse, json, re, subprocess, sys, tempfile
from pathlib import Path

SR = 44100


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if p.returncode:
        sys.exit(f"command failed: {' '.join(map(str, cmd))}\n{p.stderr[-2000:]}")
    return p.stderr


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout
    return float(out.strip())


def speech_intervals(path, noise_db, min_sil):
    err = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af",
               f"silencedetect=noise={noise_db}dB:d={min_sil}", "-f", "null", "-"])
    dur = duration(path)
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    sil = []
    for i, s in enumerate(starts):
        sil.append((max(0.0, s), ends[i] if i < len(ends) else dur))
    speech, t = [], 0.0
    for s, e in sil:
        if s > t + 1e-3:
            speech.append((t, s))
        t = e
    if t < dur - 1e-3:
        speech.append((t, dur))
    return speech, dur


def loudness(path):
    err = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"])
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])
    pk = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)[-1])
    return i, pk


def split_lines(speech, texts, min_gap, min_burst=0.06):
    """Sentence boundaries (list of (start,end) per line). Each boundary is the pause (>= min_gap)
    closest to where it is expected from cumulative character counts, chosen in order by DP.
    Bursts shorter than min_burst (clicks, encoder tails) are ignored for splitting."""
    sp = [x for x in speech if x[1] - x[0] >= min_burst] or speech
    gaps = [(sp[i + 1][0] - sp[i][1], i) for i in range(len(sp) - 1)]
    n = len(texts)
    if n == 1:
        return [(sp[0][0], sp[-1][1])], gaps
    cand = [(i, (sp[i][1] + sp[i + 1][0]) / 2) for g, i in gaps if g >= min_gap]
    t0, t1 = sp[0][0], sp[-1][1]
    tot = sum(len(t) for t in texts)
    acc, exp = 0, []
    for t in texts[:-1]:
        acc += len(t)
        exp.append(t0 + (t1 - t0) * acc / tot)
    if len(cand) < n - 1:
        return None, gaps
    INF = float("inf")
    # dp[k][j]: best cost placing boundary k at candidate j
    dp = [[INF] * len(cand) for _ in range(n - 1)]
    bk = [[-1] * len(cand) for _ in range(n - 1)]
    for j, (_, c) in enumerate(cand):
        dp[0][j] = abs(c - exp[0])
    for k in range(1, n - 1):
        best, bj = INF, -1
        for j in range(len(cand)):
            if j > 0 and dp[k - 1][j - 1] < best:
                best, bj = dp[k - 1][j - 1], j - 1
            if bj >= 0:
                dp[k][j] = best + abs(cand[j][1] - exp[k])
                bk[k][j] = bj
    j = min(range(len(cand)), key=lambda j: dp[n - 2][j])
    chosen = []
    for k in range(n - 2, -1, -1):
        chosen.append(cand[j][0])
        j = bk[k][j]
    cut_idx = sorted(chosen)
    lines, a = [], 0
    for i in cut_idx + [len(sp) - 1]:
        lines.append((sp[a][0], sp[i][1]))
        a = i + 1
    return lines, gaps


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--analyze", action="store_true")
    a = ap.parse_args()
    cfg = json.loads(Path(a.config).read_text(encoding="utf-8"))
    raw = Path(cfg["raw_dir"])
    det = cfg["detect"]

    segs = []
    for s in cfg["segments"]:
        f = raw / s["file"]
        if not f.exists():
            sys.exit(f"missing {f}")
        sp, dur = speech_intervals(f, det["noise_db"], det["min_silence_s"])
        if s.get("source_window_s"):
            # use only this part of the raw file (e.g. drop a repeated take); bursts outside are ignored
            w0, w1 = s["source_window_s"]
            sp = [(max(x0, w0), min(x1, w1)) for x0, x1 in sp if x1 > w0 and x0 < w1]
            if not sp:
                sys.exit(f"{s['id']}: no speech inside source_window_s {w0}-{w1}")
        lines, gaps = split_lines(sp, [t for _, t in s["lines"]], det["min_sentence_gap_s"])
        # check: chars per line vs duration per line
        segs.append(dict(s, path=f, speech=sp, dur=dur, lines_t=lines, gaps=gaps))
        print(f"{s['id']}: dur {dur:.3f} lead {sp[0][0]:.3f} tail {dur - sp[-1][1]:.3f} bursts {len(sp)} "
              f"gaps {[round(g, 2) for g, _ in gaps]}")
        if lines is None:
            print(f"   !! could not split into {len(s['lines'])} lines")
        else:
            for (L, txt), (ls, le) in zip(s["lines"], lines):
                print(f"   {L}: {ls:6.3f}-{le:6.3f} ({le - ls:5.2f}s, {len(txt):3d} ch, {len(txt) / max(le - ls, .01):4.1f} ch/s)")
    if a.analyze:
        return

    out = Path(cfg["out_dir"]); out.mkdir(parents=True, exist_ok=True)
    fx_dir = Path(cfg["fx_dir"]); fx_dir.mkdir(parents=True, exist_ok=True)
    stem = cfg["name"]
    targets = [out / f"{stem}.wav", out / f"{stem}.mp3", out / f"{stem}_timing.json"]
    fx_targets = [fx_dir / f"{Path(s['file']).stem}_toa_{cfg['version']}.wav" for s in segs if s.get("toa")]
    for t in targets + fx_targets:
        if t.exists():
            sys.exit(f"{t} exists; refusing to overwrite (bump version)")

    tmp = Path(tempfile.mkdtemp(prefix="vo_preview_"))
    tr = cfg["trim"]
    pieces = []  # each: dict(path, seg, lines (L, start_in_piece, end_in_piece), lead, speech_len)
    for s in segs:
        a0 = max(0.0, s["speech"][0][0] - tr["margin_s"])
        a1 = min(s["dur"], s["speech"][-1][1] + tr["margin_s"])
        cuts = [a0, a1]
        if s.get("insert_silence_after"):
            L = s["insert_silence_after"]
            k = [x[0] for x in s["lines"]].index(L)
            mid = (s["lines_t"][k][1] + s["lines_t"][k + 1][0]) / 2
            cuts = [a0, mid, a1]
        def cut(c0, c1, dst):
            chain = f"atrim={c0:.4f}:{c1:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={c1 - c0 - 0.005:.4f}:d=0.005"
            if s.get("toa"):
                chain += f",apad=pad_dur={cfg['toa']['tail_pad_s']},{cfg['toa']['chain']}"
            run(["ffmpeg", "-hide_banner", "-y", "-i", str(s["path"]), "-af", chain, "-ac", "1", "-ar", str(SR),
                 "-c:a", "pcm_s24le", str(dst)])
        # one gain per segment (measured on the whole trimmed segment) keeps its internal dynamics
        whole = tmp / f"{s['id']}_whole.wav"
        cut(a0, a1, whole)
        li, _ = loudness(whole)
        gain = s["target_lufs"] - li
        for p in range(len(cuts) - 1):
            c0, c1 = cuts[p], cuts[p + 1]
            src = tmp / f"{s['id']}_{p}.wav"
            cut(c0, c1, src)
            g = tmp / f"{s['id']}_{p}_g.wav"
            run(["ffmpeg", "-hide_banner", "-y", "-i", str(src), "-af", f"volume={gain:.2f}dB", "-c:a", "pcm_s24le", str(g)])
            # piece-local speech span and lines
            sp_in = [(max(x[0], c0) - c0, min(x[1], c1) - c0) for x in s["speech"] if x[1] > c0 and x[0] < c1]
            lines = [(L, ls - c0, le - c0) for (L, _), (ls, le) in zip(s["lines"], s["lines_t"]) if ls >= c0 - 1e-6 and le <= c1 + 1e-6]
            pieces.append(dict(seg=s, idx=p, path=g, speech0=sp_in[0][0], speech1=sp_in[-1][1], lines=lines,
                               gain=gain, lufs_before=li, dur=duration(g)))
        if s.get("toa"):
            # keep a standalone toa copy (whole segment, unity gain) for review
            fx = fx_dir / f"{Path(s['file']).stem}_toa_{cfg['version']}.wav"
            run(["ffmpeg", "-hide_banner", "-i", str(s["path"]), "-af",
                 f"apad=pad_dur={cfg['toa']['tail_pad_s']},{cfg['toa']['chain']}", "-c:a", "pcm_s24le", str(fx)])

    # timeline: gap = silence between end of speech of previous piece and start of speech of next
    t = cfg["lead_in_s"]
    timing, inputs, filt = [], [], []
    prev_end = None
    for n, p in enumerate(pieces):
        s = p["seg"]
        if prev_end is None:
            start_speech = t
        else:
            gap = s["gap_before_s"] if p["idx"] == 0 else s["inserted_gap_s"]
            start_speech = prev_end + gap
        place = start_speech - p["speech0"]
        prev_end = place + p["speech1"]
        inputs += ["-i", str(p["path"])]
        filt.append(f"[{n}:a]adelay={int(round(place * 1000))}:all=1[d{n}]")
        for L, ls, le in p["lines"]:
            timing.append(dict(L=L, segment=s["id"], start=round(place + ls, 3), end=round(place + le, 3)))
        p["place"] = place
    total = prev_end + cfg["tail_hold_s"]
    mix = "".join(f"[d{n}]" for n in range(len(pieces))) + f"amix=inputs={len(pieces)}:normalize=0:dropout_transition=0,apad=whole_dur={total:.3f},atrim=0:{total:.3f}[m]"
    raw_mix = tmp / "mix.wav"
    run(["ffmpeg", "-hide_banner", "-y", *inputs, "-filter_complex", ";".join(filt) + ";" + mix, "-map", "[m]",
         "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s24le", str(raw_mix)])

    m = cfg["master"]
    err = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(raw_mix), "-af",
               f"loudnorm=I={m['lufs']}:TP={m['tp']}:LRA={m['lra']}:print_format=json", "-f", "null", "-"])
    st = json.loads(err[err.rindex("{"):err.rindex("}") + 1])
    ln = (f"loudnorm=I={m['lufs']}:TP={m['tp']}:LRA={m['lra']}:measured_I={st['input_i']}:measured_TP={st['input_tp']}:"
          f"measured_LRA={st['input_lra']}:measured_thresh={st['input_thresh']}:offset={st['target_offset']}:linear=true")
    run(["ffmpeg", "-hide_banner", "-i", str(raw_mix), "-af", f"{ln},aresample={SR}", "-ac", "1", "-c:a", "pcm_s24le", str(targets[0])])
    run(["ffmpeg", "-hide_banner", "-i", str(targets[0]), "-c:a", "libmp3lame", "-b:a", "192k", str(targets[1])])

    report = dict(
        name=stem, version=cfg["version"], config=str(a.config), duration_s=round(duration(targets[0]), 3),
        lines=timing,
        segments=[dict(id=p["seg"]["id"], piece=p["idx"], file=p["seg"]["file"], place_s=round(p["place"], 3),
                       speech_start=round(p["place"] + p["speech0"], 3), speech_end=round(p["place"] + p["speech1"], 3),
                       gain_db=round(p["gain"], 2), lufs_before=p["lufs_before"], toa=bool(p["seg"].get("toa")))
                  for p in pieces],
        loudnorm_first_pass=st,
        note="Technical assembly only. Line times are estimates from pauses; acting/clarity need listening.",
    )
    targets[2].write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {targets[0]} ({report['duration_s']} s), {targets[1]}, {targets[2]}")
    for p in fx_targets:
        print(f"wrote {p}")


if __name__ == "__main__":
    main()
