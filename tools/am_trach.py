#!/usr/bin/env python3
"""Âm trạch classics: pair Chinese paragraphs with Vietnamese translations.

  python3 -I tools/am_trach.py list  <book-slug>          # print id<TAB>paragraph still untranslated
  python3 -I tools/am_trach.py build                      # write references/vi/am-trach/*.md

Sources: skill/ziwei-doushu/references/am-trach/NN-*.md (public domain, zh.wikisource).
Translations: tools/am-trach-vi/<slug>.vi.tsv, one "id<TAB>Vietnamese" per line.
"""
import hashlib, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "skill/ziwei-doushu/references/am-trach")
VI = os.path.join(ROOT, "tools/am-trach-vi")
OUT = os.path.join(ROOT, "skill/ziwei-doushu/references/vi/am-trach")
TITLES = {"01-tang-thu": "Táng Thư 葬書", "02-ham-long-kinh": "Hám Long Kinh 撼龍經", "03-nghi-long-kinh": "Nghi Long Kinh 疑龍經",
  "04-tang-phap-dao-truong": "Táng Pháp Đảo Trượng 葬法倒杖", "05-thanh-nang-kinh": "Thanh Nang Kinh 青囊經", "06-thanh-nang-ao-ngu": "Thanh Nang Áo Ngữ 青囊奧語",
  "07-thanh-o-kinh": "Thanh Ô Kinh 青烏經", "08-tang-phap-quyet-nghi": "Táng Pháp Quyết Nghi 葬法決疑", "09-tang-dia-luan": "Táng Địa Luận 葬地論",
  "10-luan-thanh-dieu-phap": "Luận Thanh Điểu Pháp 論青鳥法", "11-nhan-tu-tu-tri": "Nhân Tử Tu Tri 人子須知 (phàm lệ, tựa)"}

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
    cmd = sys.argv[1]
    if cmd == "list":
        slug = sys.argv[2]; lim = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9; vi = load(slug); n = 0
        todo = [(i, t) for k, i, t in items(slug) if i not in vi]
        print(f"# {slug}: {len(todo)} left"); 
        for i, t in todo:
            if n + len(t) > lim and n: break
            print(f"{i}\t{t}"); n += len(t)
    elif cmd == "build":
        os.makedirs(OUT, exist_ok=True); rows = []; miss_all = 0
        for f in sorted(glob.glob(os.path.join(SRC, "[0-9]*.md"))):
            slug = os.path.basename(f)[:-3]; vi = load(slug); its = items(slug); miss = 0
            md = [f"# {TITLES.get(slug, slug)}\n",
                  "> Bản dịch tiếng Việt cổ thư âm trạch (phong thủy mộ phần), nguyên văn thuộc phạm vi công cộng, lấy từ Wikisource tiếng Trung; nguyên văn đầy đủ ở `../../am-trach/" + slug + ".md`. "
                  "Mỗi đoạn: bản dịch, rồi nguyên văn trong ngoặc 「」. Đoạn bắt đầu bằng **Chú:** là lời chú giải đời sau (trong bản gốc đặt trong 〈 〉). "
                  "Đây là học thuyết phong thủy cổ, mang tính văn hóa và tham khảo, không phải khoa học.\n"]
            for k, i, t in its:
                if k == "h": md.append(f"\n## {t}\n"); continue
                v = vi.get(i)
                if v is None: miss += 1; md.append(f"- 「{t}」\n")
                else: md.append(f"- {v}\n  「{t}」\n")
            open(os.path.join(OUT, slug + ".md"), "w", encoding="utf-8").write("\n".join(md))
            n = sum(1 for k, _, _ in its if k == "p"); rows.append((slug, n, n - miss)); miss_all += miss
        with open(os.path.join(OUT, "README.md"), "w", encoding="utf-8") as fo:
            fo.write("# Âm trạch — cổ thư phong thủy mộ phần (bản dịch tiếng Việt)\n\n"
                     "Các kinh điển âm trạch thuộc phạm vi công cộng: Táng Thư (Quách Phác, tương truyền), các sách của Dương Quân Tùng, Thanh Nang Kinh, Thanh Ô Kinh, và vài luận văn của Trình Di, Trương Cư Chính. "
                     "Xem thêm `am-trach.md` (tổng hợp phương pháp) và 28 câu giảng của thầy Nghê về âm trạch trong `../kinh-dich/11-kham-du.md`.\n\n"
                     "| Tệp | Sách | Đoạn | Đã dịch |\n|---|---|---|---|\n")
            for s, n, d in rows: fo.write(f"| `{s}.md` | {TITLES.get(s, s)} | {n} | {d} |\n")
        print("untranslated paragraphs:", miss_all)
main()
