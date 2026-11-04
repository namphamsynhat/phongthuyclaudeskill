"""Split / rebuild the Ni Haixia quote files for translation.

  python3 tools/tianji_vi.py split  <refs_dir> <work_dir>   # write <lecture>.src.tsv + tags.src.tsv
  python3 tools/tianji_vi.py build  <refs_dir> <work_dir>   # read <lecture>.vi.tsv + tags.map.tsv (Chinese tag<TAB>Vietnamese), write refs/vi/tianji-ziwei/

Each Vietnamese line keeps the original Chinese quote and its Bilibili timestamp link.
"""
import re, sys
from pathlib import Path

QUOTE = re.compile(r"^- \[(?P<t>[\d:]+)\]\((?P<url>[^)]+)\) 「(?P<q>.*)」(?P<note>〔[^〕]*〕)?\s*<sub>(?P<tag>.*)</sub>\s*$")
SEC = re.compile(r"^## (?P<h>.+)$")
TITLE = re.compile(r"^# (?P<h>.+)$")

LECTURES = ["2上", "3上", "4上", "5上", "6上", "7上", "8上", "9上", "10上", "11上", "12上", "13上", "14上", "15上",
            "19上_补充1", "24下_补充2"]


def parse(path: Path):
    items = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = QUOTE.match(line)
        if m:
            items.append(("q", m.groupdict())); continue
        m = SEC.match(line)
        if m:
            items.append(("s", m.group("h"))); continue
        m = TITLE.match(line)
        if m:
            items.append(("title", m.group("h"))); continue
        if line.strip():
            items.append(("text", line))
        else:
            items.append(("blank", ""))
    return items


def split(refs: Path, work: Path):
    work.mkdir(parents=True, exist_ok=True)
    tags = {}
    for lec in LECTURES:
        items = parse(refs / "tianji-ziwei" / f"{lec}.md")
        out = []
        for i, (kind, v) in enumerate(items):
            if kind == "q":
                out.append(f"{i}\t{v['q']}")
                tags[v["tag"]] = 1
            elif kind in ("s", "title", "text"):
                out.append(f"{i}\t{v}")
        (work / f"{lec}.src.tsv").write_text("\n".join(out) + "\n", encoding="utf-8")
    (work / "tags.src.tsv").write_text("\n".join(f"{n}\t{t}" for n, t in enumerate(tags)) + "\n", encoding="utf-8")
    print(len(tags), "tags")


def load_tsv(p: Path):
    d = {}
    for line in p.read_text(encoding="utf-8").splitlines():
        if "\t" in line:
            k, v = line.split("\t", 1)
            d[k.strip()] = v.strip()
    return d


def build(refs: Path, work: Path):
    dst = refs / "vi" / "tianji-ziwei"
    dst.mkdir(parents=True, exist_ok=True)
    tagmap = load_tsv(work / "tags.map.tsv")  # Chinese tag -> Vietnamese tag
    missing_total = 0
    for lec in LECTURES:
        vi_path = work / f"{lec}.vi.tsv"
        if not vi_path.exists():
            continue
        vi = load_tsv(vi_path)
        items = parse(refs / "tianji-ziwei" / f"{lec}.md")
        lines, missing = [], 0
        for i, (kind, v) in enumerate(items):
            tr = vi.get(str(i))
            if kind == "q":
                if not tr:
                    missing += 1; tr = "(chưa dịch)"
                note = (v.get("note") or "").replace("已按裁决改正：", "đã sửa chữ: ")
                lines.append(f"- [{v['t']}]({v['url']}) «{tr}» — 「{v['q']}」{note}　<sub>{tagmap.get(v['tag'], v['tag'])}</sub>")
            elif kind == "title":
                lines.append(f"# {tr or v}")
            elif kind == "s":
                if not tr: missing += 1
                lines.append(f"## {tr or v}")
            elif kind == "text":
                if not tr: missing += 1
                lines.append(tr or v)
            else:
                lines.append("")
        (dst / f"{lec}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
        missing_total += missing
        print(lec, "missing", missing)
    print("total missing", missing_total)


if __name__ == "__main__":
    cmd, refs, work = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
    {"split": split, "build": build}[cmd](refs, work)
