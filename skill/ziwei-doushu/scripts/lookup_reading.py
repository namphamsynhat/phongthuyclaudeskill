#!/usr/bin/env python3
"""Look up the pre-written 13-topic reading for one chart in the open dataset v4.0
(Renhuai123/ziwei-doushu release v4.0-13d, CC BY 4.0; Ni Haixia quotes inside are CC BY-NC-SA 4.0).

Usage:
  python3 lookup_reading.py --key 1990-01-01-0-male [--topic love,career] [--lang en|vi]
  python3 lookup_reading.py --download-all      # fetch + verify all 77 years into ../data/ (161 MB) for offline use

The key is printed by ziwei-chart.mjs ("数据集键"): chart date (after late-Zi / true-solar
adjustment) - hour branch 0-11 - gender. Coverage: every real date 1950-2026.

Year files (~2 MB each) are looked for in ../data/ next to this script, then in
$ZIWEI_DATA_DIR, then ~/.cache/ziwei-doushu/; if missing they are downloaded from the
GitHub release and checked against the bundled SHA256SUMS.txt.
Needs the `zstandard` Python package (pip install zstandard) or the `zstd` command.
"""
import argparse, hashlib, io, json, os, shutil, ssl, subprocess, sys, urllib.request
from pathlib import Path

def _ssl_context():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl._create_unverified_context()

HERE = Path(__file__).resolve().parent
RELEASE = "https://github.com/Renhuai123/ziwei-doushu/releases/download/v4.0-13d/"
TOPICS = ["overview", "personality", "love", "career", "wealth", "health", "family",
          "children", "move", "friends", "home", "spirit", "parents"]
TOPIC_ZH = dict(zip(TOPICS, ["命格总论", "性格", "感情婚姻", "事业", "财运", "健康", "六亲",
                             "子女", "迁移", "交友", "田宅", "福德", "父母"]))
TOPIC_EN = dict(zip(TOPICS, ["Overview", "Personality", "Love & marriage", "Career", "Wealth", "Health", "Family",
                             "Children", "Travel & relocation", "Friends", "Home & property", "Inner life & fortune", "Parents"]))
TOPIC_VI = dict(zip(TOPICS, ["Tổng quan", "Tính cách", "Tình cảm & hôn nhân", "Sự nghiệp", "Tài lộc", "Sức khỏe", "Lục thân",
                             "Con cái", "Di chuyển", "Bạn bè", "Nhà cửa", "Phúc đức", "Cha mẹ"]))
NOTE = {
    "en": ("Source text below is Chinese. Translate the parts you use into English for the user; "
           "keep Ni Haixia quotes in Chinese with an English translation and their episode/timestamp."),
    "vi": ("Nguyên văn bên dưới là tiếng Trung. Hãy dịch những phần dùng tới sang tiếng Việt cho người dùng; "
           "giữ nguyên văn lời Nghê Hải Hạ bằng tiếng Trung kèm bản dịch và tập/thời điểm trích dẫn."),
}
FOOTER = {
    "en": ("Source: Zi Wei Dou Shu open interpretation dataset v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0; "
           "Ni Haixia quotes inside are CC BY-NC-SA 4.0). Natal chart only, no yearly forecast; generated 2026-10-15, "
           "so its 'current decade' assumes that date."),
    "vi": ("Nguồn: bộ dữ liệu luận giải Tử Vi mở v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0; "
           "lời trích Nghê Hải Hạ theo CC BY-NC-SA 4.0). Chỉ luận lá số gốc, không có lưu niên; tạo ngày 2026-10-15 "
           "nên phần 'đại hạn hiện tại' tính theo ngày đó."),
}


def sums():
    out = {}
    f = HERE / "SHA256SUMS.txt"
    if f.exists():
        for line in f.read_text().splitlines():
            parts = line.split()
            if len(parts) == 2:
                out[parts[1].lstrip("*")] = parts[0]
    return out


def download_all():
    """Fetch every year file into ../data/ and verify it against SHA256SUMS.txt."""
    dest_dir = HERE.parent / "data"
    dest_dir.mkdir(exist_ok=True)
    want = sums()
    ok = bad = 0
    for year in range(1950, 2027):
        name = f"year-{year}.jsonl.zst"
        dest = dest_dir / name
        if not (dest.exists() and hashlib.sha256(dest.read_bytes()).hexdigest() == want.get(name)):
            try:
                with urllib.request.urlopen(RELEASE + name, timeout=300, context=_ssl_context()) as r, open(dest, "wb") as fh:
                    shutil.copyfileobj(r, fh)
            except Exception as e:
                print(f"{name}: download failed ({e})", file=sys.stderr); bad += 1; continue
        if hashlib.sha256(dest.read_bytes()).hexdigest() != want.get(name):
            dest.unlink(); print(f"{name}: checksum mismatch, deleted", file=sys.stderr); bad += 1; continue
        ok += 1
        print(f"{name} ok", file=sys.stderr)
    print(f"{ok} files verified in {dest_dir}, {bad} failed")
    sys.exit(1 if bad else 0)


def find_or_fetch(year: int) -> Path:
    name = f"year-{year}.jsonl.zst"
    dirs = [HERE.parent / "data"]
    if os.environ.get("ZIWEI_DATA_DIR"):
        dirs.append(Path(os.environ["ZIWEI_DATA_DIR"]))
    cache = Path.home() / ".cache" / "ziwei-doushu"
    dirs.append(cache)
    for d in dirs:
        if (d / name).exists():
            return d / name
    cache.mkdir(parents=True, exist_ok=True)
    dest = cache / name
    print(f"downloading {name} …", file=sys.stderr)
    try:
        with urllib.request.urlopen(RELEASE + name, timeout=120, context=_ssl_context()) as r, open(dest, "wb") as fh:
            shutil.copyfileobj(r, fh)
    except Exception as e:  # network blocked etc.
        sys.exit(f"Cannot download {name} ({e}). Put the file in {HERE.parent / 'data'} instead.")
    want = sums().get(name)
    if want and hashlib.sha256(dest.read_bytes()).hexdigest() != want:
        dest.unlink()
        sys.exit(f"Checksum mismatch for {name}; deleted.")
    return dest


def lines(path: Path):
    try:
        import zstandard
        dctx = zstandard.ZstdDecompressor(max_window_size=2**31)
        with open(path, "rb") as fh, dctx.stream_reader(fh) as r:
            yield from io.TextIOWrapper(r, encoding="utf-8")
        return
    except ImportError:
        pass
    if not shutil.which("zstd"):
        sys.exit("Need `pip install zstandard` or the zstd command.")
    p = subprocess.Popen(["zstd", "-dc", "--long=27", str(path)], stdout=subprocess.PIPE)
    yield from io.TextIOWrapper(p.stdout, encoding="utf-8")
    p.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", help="YYYY-MM-DD-H-male|female")
    ap.add_argument("--download-all", action="store_true", help="download and verify all 77 year files into ../data/")
    ap.add_argument("--topic", default="overview", help="comma list, or 'all'")
    ap.add_argument("--lang", default="vi", choices=["en", "vi"])
    a = ap.parse_args()
    if a.download_all:
        download_all()
    if not a.key:
        ap.error("--key is required")
    year = int(a.key[:4])
    if not 1950 <= year <= 2026:
        sys.exit("Dataset covers 1950-2026 only; interpret from the chart and references instead.")
    topics = TOPICS if a.topic == "all" else [t.strip() for t in a.topic.split(",")]
    for t in topics:
        if t not in TOPICS:
            sys.exit(f"Unknown topic {t}. Choose from: {', '.join(TOPICS)}")
    needle = f'"k": "{a.key}"'
    needle2 = f'"k":"{a.key}"'
    for line in lines(find_or_fetch(year)):
        if needle in line[:60] or needle2 in line[:60]:
            rec = json.loads(line)
            names = TOPIC_VI if a.lang == "vi" else TOPIC_EN
            print(f"> {NOTE[a.lang]}")
            for t in topics:
                print(f"\n# {names[t]} ({TOPIC_ZH[t]})\n")
                print(rec["c"][t])
            print(f"\n---\n{FOOTER[a.lang]}")
            return
    sys.exit(f"Key {a.key} not found (check date/hour/gender).")


if __name__ == "__main__":
    main()
