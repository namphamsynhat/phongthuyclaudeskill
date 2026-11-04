"""Build the Kinh Dịch (I Ching) knowledge base from Ni Haixia's 《天纪》 corpus.

  python3 tools/kinh_dich.py gen   <entries.jsonl> <refs_dir>          # Chinese quote files -> refs/kinh-dich/
  python3 tools/kinh_dich.py split <entries.jsonl> <work_dir>          # <file>.src.tsv (id<TAB>quote) for translation
  python3 tools/kinh_dich.py build <entries.jsonl> <refs_dir> <work_dir>  # Vietnamese files -> refs/vi/kinh-dich/

Source: Renhuai123/nihai-tianji-corpus data/entries.jsonl (CC BY-NC-SA 4.0).
Each line keeps Ni Haixia's original words and a Bilibili link to the exact second.
"""
import hashlib, json, sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from iching_data import HEX, TRIGRAMS, composition  # noqa: E402

TRI = {t[0]: t for t in TRIGRAMS}
BYNAME = {zh: (n, vi, m) for n, zh, vi, m in HEX}
LICENSE_ZH = ("> 引文出自倪海厦《天纪》讲课（B 站字幕整理），来源 [Renhuai123/nihai-tianji-corpus]"
              "(https://github.com/Renhuai123/nihai-tianji-corpus)，CC BY-NC-SA 4.0，仅限非商业使用；原课程著作权归权利人。")
LICENSE_VI = ("> Trích lời giảng 《天纪》 (Thiên Kỷ) của Nghê Hải Hạ (phụ đề Bilibili), nguồn [Renhuai123/nihai-tianji-corpus]"
              "(https://github.com/Renhuai123/nihai-tianji-corpus), giấy phép CC BY-NC-SA 4.0, chỉ dùng phi thương mại; "
              "bản quyền bài giảng thuộc chủ sở hữu. Bản dịch tiếng Việt là tác phẩm phái sinh, cùng giấy phép. "
              "Mỗi dòng: «bản dịch» — 「nguyên văn」; bấm mốc thời gian để nghe đúng giây đó. "
              "Mọi câu đều đã có bản dịch tiếng Việt (dịch sát ý, có rút gọn chỗ lặp của văn nói); khi trích dẫn, ghi bản dịch rồi nguyên văn trong ngoặc.")

# output file -> (Chinese title, Vietnamese title, selector)
FILES = {
    "07-duong-trach": ("阳宅化命：八卦方位与家庭角色（07 方法论）",
                       "Dương trạch đổi mệnh: phương vị Bát Quái và vai trò trong nhà (sách 07 Phương pháp luận)",
                       lambda e: e["book"] == "07-methodology" and e["h2"].startswith("阳宅")),
    "08-dich-ly": ("易理总纲（08）", "Tổng cương Dịch lý (sách 08)", lambda e: e["book"] == "08-yili"),
    "10-chiem-doan": ("占断：金钱卦 / 测字 / 六神 / 六壬（10）",
                      "Chiêm đoán: quẻ đồng tiền / chiết tự / Lục Thần / Lục Nhâm (sách 10)",
                      lambda e: e["book"] == "10-divination"),
    "11-kham-du": ("堪舆：峦头 / 理气 / 阳宅（11）", "Kham dư (phong thủy): loan đầu / lý khí / dương trạch (sách 11)",
                   lambda e: e["book"] == "11-fengshui"),
}

H3_ORDER = ["卦象 / 卦德", "序卦位置", "爻辞断诀（初爻→上爻）", "人间道", "阳宅", "卜筮用例"]


def url(e):
    h, m, s = map(int, e["t_hms"].split(":"))
    return f"https://www.bilibili.com/video/{e['bvid']}?p={e['part']}&t={h * 3600 + m * 60 + s}"


def qid(e):
    return hashlib.sha1(f"{e['bvid']}|{e['part']}|{e['t_hms']}|{e['quote']}".encode()).hexdigest()[:10]


def note_of(e, lang):
    parts = [p for p in e["note"].split("〕〔") if p and p != "cleaned"]
    if not parts:
        return ""
    if lang == "vi":
        parts = [p.replace("已按裁决改正：", "đã sửa chữ phụ đề: ").replace("字幕疑", "phụ đề có thể sai: ") for p in parts]
    return "".join(f"〔{p}〕" for p in parts)


def hex_of(e):
    """King Wen number for a 09-hexagrams entry."""
    name = e["h2"].split("（")[0]
    if name in BYNAME:
        return BYNAME[name][0]
    return e.get("gua")  # '清扫重挂' entries carry gua when known


def load(path):
    seen, out = set(), []
    for line in open(path, encoding="utf8"):
        e = json.loads(line)
        k = (e["book"], e["quote"])
        if k in seen:
            continue
        seen.add(k)
        out.append(e)
    return out


def sort_key(e):
    return (e["bvid"] != "BV1KJsLekEfA", e["part"], e["t_hms"])


def plan(entries):
    """file stem -> list of ('h2'|'h3'|'q', value) in reading order."""
    plans = {}
    for stem, (_, _, sel) in FILES.items():
        groups = defaultdict(lambda: defaultdict(list))
        order2, order3 = [], defaultdict(list)
        for e in entries:
            if not sel(e):
                continue
            h2, h3 = e["h2"], e["h3"] or ""
            if h2 not in order2: order2.append(h2)
            if h3 not in order3[h2]: order3[h2].append(h3)
            groups[h2][h3].append(e)
        items = []
        for h2 in order2:
            items.append(("h2", h2))
            for h3 in order3[h2]:
                if h3: items.append(("h3", h3))
                items += [("q", e) for e in sorted(groups[h2][h3], key=sort_key)]
        plans[stem] = items
    hexq = defaultdict(lambda: defaultdict(list))
    unassigned = []
    for e in entries:
        if e["book"] != "09-hexagrams":
            continue
        n = hex_of(e)
        if n: hexq[n][e["h3"]].append(e)
        else: unassigned.append(e)
    for n, zh, vi, _ in HEX:
        items = []
        for h3 in sorted(hexq[n], key=lambda h: H3_ORDER.index(h) if h in H3_ORDER else 99):
            items.append(("h3", h3))
            items += [("q", e) for e in sorted(hexq[n][h3], key=sort_key)]
        plans[f"que/{n:02d}"] = items
    if unassigned:
        plans["que/00-chung"] = [("h3", "人间道（未归卦）")] + [("q", e) for e in sorted(unassigned, key=sort_key)]
    return plans


def hex_header(n, lang):
    zh, vi, meaning = next((h[1], h[2], h[3]) for h in HEX if h[0] == n)
    up, lo = composition(zh)
    u, l = TRI[up], TRI[lo]
    sym = chr(0x4DC0 + n - 1)
    if lang == "zh":
        return (f"# {sym} 第 {n} 卦 {zh}\n\n上卦 {u[1]}（{u[5]}）· 下卦 {l[1]}（{l[5]}）。"
                f"阳宅读法（倪师）：{u[1]}位之人住{l[1]}方。")
    return (f"# {sym} Quẻ {n}: {vi} ({zh})\n\n"
            f"- Thượng quái (ngoại): {u[2]} {u[3]} ({u[6]}) · Hạ quái (nội): {l[2]} {l[3]} ({l[6]})\n"
            f"- Ý chính: {meaning}\n"
            f"- Dương trạch theo thầy Nghê: người có vai **{u[2]}** ({u[9].split(' (')[0].lower()}) ở phương **{l[8]}** (cung {l[2]})")


H3_VI = {"卦象 / 卦德": "Tượng quẻ / đức quẻ", "序卦位置": "Vị trí trong Tự Quái", "爻辞断诀（初爻→上爻）": "Lời hào (hào Sơ → hào Thượng)",
         "人间道": "Nhân gian đạo (ứng dụng đời người)", "阳宅": "Dương trạch", "卜筮用例": "Ví dụ bói toán", "人间道（未归卦）": "Nhân gian đạo (chưa gắn quẻ)"}


def render(stem, items, lang, vi=None, heads=None):
    lines = []
    if stem.startswith("que/"):
        n = int(stem[4:6])
        lines += [hex_header(n, lang) if n else ("# 未归卦的六十四卦条目" if lang == "zh" else "# Các câu về 64 quẻ chưa gắn quẻ cụ thể"), ""]
    else:
        zt, vt, _ = FILES[stem]
        lines += [f"# {zt if lang == 'zh' else vt}", ""]
    nq = sum(1 for k, _ in items if k == "q")
    lines += [LICENSE_ZH if lang == "zh" else LICENSE_VI, "", (f"共 {nq} 条。" if lang == "zh" else f"Tổng cộng {nq} câu."), ""]
    missing = 0
    for kind, v in items:
        if kind == "h2":
            lines += ["", f"## {v if lang == 'zh' else (heads or {}).get(v, v)}", ""]
        elif kind == "h3":
            t = v if lang == "zh" else (heads or {}).get(v) or H3_VI.get(v, v)
            lines += ["", f"### {t}", ""]
        else:
            e = v
            if lang == "zh":
                lines.append(f"- [{e['t_hms']}]({url(e)}) 「{e['quote']}」{note_of(e, 'zh')}")
            else:
                tr = (vi or {}).get(qid(e))
                if not tr:
                    missing += 1
                    lines.append(f"- [{e['t_hms']}]({url(e)}) 「{e['quote']}」{note_of(e, 'vi')}")
                else:
                    lines.append(f"- [{e['t_hms']}]({url(e)}) «{tr}» — 「{e['quote']}」{note_of(e, 'vi')}")
    return "\n".join(lines).replace("\n\n\n", "\n\n") + "\n", missing


def load_tsv(p):
    d = {}
    if p.exists():
        for line in p.read_text(encoding="utf8").splitlines():
            if "\t" in line:
                k, v = line.split("\t", 1)
                d[k.strip()] = v.strip()
    return d


def main():
    cmd, src = sys.argv[1], sys.argv[2]
    plans = plan(load(src))
    if cmd == "gen":
        dst = Path(sys.argv[3]) / "kinh-dich"
        (dst / "que").mkdir(parents=True, exist_ok=True)
        for stem, items in plans.items():
            (dst / f"{stem}.md").write_text(render(stem, items, "zh")[0], encoding="utf8")
        print(len(plans), "files,", sum(sum(1 for k, _ in it if k == "q") for it in plans.values()), "quotes")
    elif cmd == "split":
        work = Path(sys.argv[3]); work.mkdir(parents=True, exist_ok=True)
        heads = set()
        for stem, items in plans.items():
            rows = [f"{qid(v)}\t{v['quote']}" for k, v in items if k == "q"]
            heads |= {v for k, v in items if k in ("h2", "h3")}
            (work / f"{stem.replace('/', '_')}.src.tsv").write_text("\n".join(rows) + "\n", encoding="utf8")
        (work / "heads.src.tsv").write_text("\n".join(sorted(heads)) + "\n", encoding="utf8")
    elif cmd == "build":
        refs, work = Path(sys.argv[3]), Path(sys.argv[4])
        dst = refs / "vi" / "kinh-dich"
        (dst / "que").mkdir(parents=True, exist_ok=True)
        heads = load_tsv(work / "heads.map.tsv")
        vi = {}
        for p in work.glob("*.vi.tsv"):
            vi.update(load_tsv(p))
        total = 0
        for stem, items in plans.items():
            text, missing = render(stem, items, "vi", vi, heads)
            (dst / f"{stem}.md").write_text(text, encoding="utf8")
            total += missing
        print("untranslated quotes (kept in Chinese):", total)


if __name__ == "__main__":
    main()
