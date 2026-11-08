#!/usr/bin/env python3
"""Dương trạch classics: pair Chinese paragraphs with Vietnamese translations.

  python3 -I tools/duong_trach.py list  <book-slug>          # print id<TAB>paragraph still untranslated
  python3 -I tools/duong_trach.py build                      # write references/vi/duong-trach/*.md

Sources: skill/ziwei-doushu/references/duong-trach/NN-*.md (public domain).
Translations: tools/duong-trach-vi/<slug>.vi.tsv, one "id<TAB>Vietnamese" per line.
"""
import hashlib, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "skill/ziwei-doushu/references/duong-trach")
VI = os.path.join(ROOT, "tools/duong-trach-vi")
OUT = os.path.join(ROOT, "skill/ziwei-doushu/references/vi/duong-trach")

TITLES = {
    "01-hoang-de-trach-kinh": "Hoàng Đế Trạch Kinh 黃帝宅經",
    "02-duong-trach-thap-thu": "Dương Trạch Thập Thư 陽宅十書",
    "03-duong-trach-chi-nam": "Dương Trạch Chỉ Nam 陽宅指南",
    "04-bat-trach-tam-yeu": "Bát Trạch Minh Kính & Dương Trạch Tam Yếu 八宅明鏡與陽宅三要 (tóm lược hiện đại)",
}

NOTES = {
    "04-bat-trach-tam-yeu": "> **Lưu ý:** tệp này không phải nguyên văn hai sách Bát Trạch Minh Kính và Dương Trạch Tam Yếu, mà là bản tóm lược viết lại theo ý hai sách (có cả từ ngữ hiện đại như «công tắc gas»). Bảng Đại Du Niên bát trạch trong đó đã được đối chiếu, đúng với phép truyền thống; khi trích dẫn, ghi là «theo phái Bát Trạch / Tam Yếu», không ghi là nguyên văn cổ thư.\n",
}

def paras(slug):
    """Yield (kind, text): kind 'h' heading, 'p' paragraph."""
    lines = open(os.path.join(SRC, slug + ".md"), encoding="utf-8").read().split("\n")
    for l in lines:
        l = l.strip()
        if not l or l.startswith("> ") or l.startswith("# "): continue
        if l.startswith("## "): yield "h", l[3:]; continue
        yield "p", l

def pid(slug, i, text): return hashlib.sha1(f"{slug}|{i}|{text}".encode()).hexdigest()[:10]

def items(slug):
    out = []
    for i, (k, t) in enumerate(paras(slug)): out.append((k, pid(slug, i, t), t))
    return out

def load(slug):
    f = os.path.join(VI, slug + ".vi.tsv"); d = {}
    if os.path.exists(f):
        for l in open(f, encoding="utf-8"):
            if "\t" in l: a, b = l.rstrip("\n").split("\t", 1); d[a] = b
    return d

def main():
    if len(sys.argv) < 2:
        print("Usage: duong_trach.py [list <slug> | build]")
        return
    cmd = sys.argv[1]
    if cmd == "list":
        slug = sys.argv[2]; lim = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9; vi = load(slug); n = 0
        todo = [(i, t) for k, i, t in items(slug) if i not in vi]
        print(f"# {slug}: {len(todo)} left")
        for i, t in todo:
            if n + len(t) > lim and n: break
            print(f"{i}\t{t}"); n += len(t)
    elif cmd == "build":
        os.makedirs(OUT, exist_ok=True); rows = []; miss_all = 0
        for f in sorted(glob.glob(os.path.join(SRC, "[0-9]*.md"))):
            slug = os.path.basename(f)[:-3]; vi = load(slug); its = items(slug); miss = 0
            md = [f"# {TITLES.get(slug, slug)}\n",
                  "> Bản dịch tiếng Việt cổ thư dương trạch (phong thủy nhà ở), nguyên văn thuộc phạm vi công cộng; nguyên văn đầy đủ ở `../../duong-trach/" + slug + ".md`. "
                  "Mỗi đoạn: bản dịch, rồi nguyên văn trong ngoặc 「」. "
                  "Đây là học thuyết phong thủy truyền thống, mang tính văn hóa và tham khảo, không phải khoa học.\n"]
            if slug in NOTES: md.append(NOTES[slug])
            n_p = sum(1 for k, i, _ in its if k == "p"); n_tr = sum(1 for k, i, _ in its if k == "p" and i in vi)
            if n_tr < n_p: md.append(f"> **Chưa dịch hết:** {n_tr}/{n_p} đoạn có bản dịch; các đoạn còn lại chỉ có nguyên văn 「」, khi dùng hãy tự dịch và nói rõ là bản dịch tạm.\n")
            for k, i, t in its:
                if k == "h": md.append(f"\n## {t}\n"); continue
                v = vi.get(i)
                if v is None: miss += 1; md.append(f"- 「{t}」\n")
                else: md.append(f"- {v}\n  「{t}」\n")
            open(os.path.join(OUT, slug + ".md"), "w", encoding="utf-8").write("\n".join(md))
            n = sum(1 for k, _, _ in its if k == "p"); rows.append((slug, n, n - miss)); miss_all += miss
        with open(os.path.join(OUT, "README.md"), "w", encoding="utf-8") as fo:
            fo.write("# Dương trạch — cổ thư phong thủy nhà ở (bản dịch tiếng Việt)\n\n"
                     "Các kinh điển dương trạch thuộc phạm vi công cộng: Hoàng Đế Trạch Kinh, Dương Trạch Thập Thư, Dương Trạch Chỉ Nam; tệp 04 là bản tóm lược hiện đại theo phái Bát Trạch và Tam Yếu, không phải nguyên văn. "
                     "Xem thêm `duong-trach.md` (tổng hợp phương pháp) và lời giảng dương trạch của thầy Nghê trong `../kinh-dich/07-duong-trach.md`.\n\n"
                     "| Tệp | Sách | Đoạn | Đã dịch |\n|---|---|---|---|\n")
            for s, n, d in rows: fo.write(f"| `{s}.md` | {TITLES.get(s, s)} | {n} | {d} |\n")
        print("untranslated paragraphs:", miss_all)

if __name__ == "__main__":
    main()
