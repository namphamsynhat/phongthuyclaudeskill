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

_ERRATA = "https://github.com/Renhuai123/nihai-tianji-corpus/blob/main/docs/%E5%8B%98%E8%AF%AF.md"
# Editor's corrections in the source (勘误 / 注), translated. Original Chinese is kept after the translation.
NOTE_VI = {
    f"〔勘误：同一命例（5上已讲），此处宫格仍把文昌化忌画在酉宫田宅，正确应在子宫（迁移）。详见[天纪语料库勘误页]({_ERRATA})〕":
        f"〔Đính chính: cùng một lá số ví dụ (đã giảng ở 5上); ở đây bảng cung vẫn vẽ Văn Xương Hóa Kỵ ở cung Dậu (Điền Trạch), đúng ra phải ở cung Tý (Thiên Di). Xem [trang đính chính của kho ngữ liệu Thiên Kỷ]({_ERRATA}) · 勘误：同一命例（5上已讲），此处宫格仍把文昌化忌画在酉宫田宅，正确应在子宫（迁移）〕",
    "〔勘误：按《紫微斗数全书》，天同属南斗，不属北斗（卷一「天同南斗益算保生之星」，卷二「天同属水金南斗」）。倪师把紫微一组的星都称北斗星系，与《全书》有出入。详见 docs/勘误.md〕":
        f"〔Đính chính: theo 《紫微斗数全书》, Thiên Đồng thuộc Nam Đẩu chứ không thuộc Bắc Đẩu (quyển 1 「天同南斗益算保生之星」, quyển 2 「天同属水金南斗」). Thầy Nghê gọi cả nhóm sao Tử Vi là chòm Bắc Đẩu, khác với 《全书》. Xem [trang đính chính]({_ERRATA}) · 勘误：天同属南斗，不属北斗〕",
    "〔勘误：按《紫微斗数全书》，这三颗里只有七杀属南斗（卷一「七杀南斗第六星也」），破军、贪狼都属北斗（「破军属水，北斗第七星也」「贪狼北斗解厄之神，第一星也」）。倪师把天府一组的星都称南斗星系，与《全书》有出入。详见 docs/勘误.md〕":
        f"〔Đính chính: theo 《紫微斗数全书》, trong ba sao này chỉ Thất Sát thuộc Nam Đẩu (quyển 1 「七杀南斗第六星也」); Phá Quân, Tham Lang đều thuộc Bắc Đẩu (「破军属水，北斗第七星也」「贪狼北斗解厄之神，第一星也」). Thầy Nghê gọi cả nhóm sao Thiên Phủ là chòm Nam Đẩu, khác với 《全书》. Xem [trang đính chính]({_ERRATA}) · 勘误：只有七杀属南斗，破军、贪狼都属北斗〕",
    f"〔勘误：按正确排盘，酉宫田宅没有生年化忌，文昌化忌应在子宫（迁移）。详见[天纪语料库勘误页]({_ERRATA})〕":
        f"〔Đính chính: lập số đúng thì cung Dậu (Điền Trạch) không có Hóa Kỵ năm sinh; Văn Xương Hóa Kỵ phải ở cung Tý (Thiên Di). Xem [trang đính chính]({_ERRATA}) · 勘误：酉宫田宅没有生年化忌，文昌化忌应在子宫（迁移）〕",
    f"〔勘误：此盘文昌化忌应在子宫（迁移），不与太阳同在酉宫田宅；34–43 大限本身不化忌，只有 1994 甲戌年太阳化忌，是一年不是十年。详见[天纪语料库勘误页]({_ERRATA})〕":
        f"〔Đính chính: lá số này Văn Xương Hóa Kỵ phải ở cung Tý (Thiên Di), không cùng Thái Dương ở cung Dậu (Điền Trạch); bản thân đại hạn 34–43 không Hóa Kỵ, chỉ năm Giáp Tuất 1994 Thái Dương Hóa Kỵ — là một năm, không phải mười năm. Xem [trang đính chính]({_ERRATA}) · 勘误：文昌化忌应在子宫；只有1994甲戌年太阳化忌，是一年不是十年〕",
    f"〔注：本句以上一句「文昌化忌与太阳同宫、十年化忌」为前提；按正确排盘，太阳化忌只在 1994 甲戌年。详见[天纪语料库勘误页]({_ERRATA})〕":
        f"〔Ghi chú: câu này dựa trên tiền đề của câu trước («Văn Xương Hóa Kỵ đồng cung với Thái Dương, mười năm Hóa Kỵ»); lập số đúng thì Thái Dương Hóa Kỵ chỉ ở năm Giáp Tuất 1994. Xem [trang đính chính]({_ERRATA}) · 注：太阳化忌只在1994甲戌年〕",
}

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
                note = NOTE_VI.get(note, note)
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
