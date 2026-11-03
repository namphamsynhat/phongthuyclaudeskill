"""Convert the repo's knowledge files (TS data / markdown) into Markdown references for a Claude Skill.
Reads files as text only; never executes repo code."""
import json, re, shutil, sys
from pathlib import Path

repo = Path(sys.argv[1])
out = Path(sys.argv[2])
ref = out / "references"
ref.mkdir(parents=True, exist_ok=True)

def unq(s):
    return s.encode().decode("unicode_escape").encode("latin1").decode("utf-8") if "\\u" in s else s

# 1) Classics (public domain)
classics = []
for f in ["quanshu", "quanji", "gusuifu"]:
    src = (repo / f"lib/classics/data/{f}.ts").read_text(encoding="utf-8")
    title = re.search(r"title:\s*'([^']+)'", src).group(1)
    intro = (re.search(r"intro:\s*'([^']*)'", src) or [None, ""])[1]
    lines = [f"# 《{title}》", "", intro, "", "公版古籍（public domain）。来源：Renhuai123/ziwei-doushu `lib/classics/data/" + f + ".ts`。", ""]
    # walk chapters in order: chapter titles are followed by subtitle/paragraphs; paragraph texts have text:
    for m in re.finditer(r"(?:\{\s*title:\s*'([^']+)'(?:,\s*subtitle:\s*'([^']*)')?)|(?:id:\s*'([^']+)',\s*idx:\s*\d+,\s*text:\s*'((?:[^'\\]|\\.)*)')", src, re.S):
        if m.group(1):
            if m.group(1) == title:
                continue
            lines += ["", f"## {m.group(1)}" + (f" — {m.group(2)}" if m.group(2) else ""), ""]
        else:
            lines.append(f"- `{m.group(3)}` {m.group(4)}")
    name = f"classic-{f}.md"
    (ref / name).write_text("\n".join(lines) + "\n", encoding="utf-8")
    classics.append(name)

# 2) Pattern rules: name / description / conditions text / source, from patterns.ts
src = (repo / "lib/ziwei/patterns.ts").read_text(encoding="utf-8")
blocks = re.split(r"\n/\*\* ", src)
plines = ["# 格局规则库（引擎内置）", "",
          "从 `lib/ziwei/patterns.ts` 提取：每个格局的成立条件、加分项、破格项和古籍出处。",
          "排盘脚本会自动识别这些格局；这里供解读时查条件和原意。", ""]
for b in blocks[1:]:
    head = b.split("*/", 1)[0].strip()
    names = re.findall(r"name:\s*'([^']+)'", b)
    if not names:
        continue
    descs = re.findall(r"description:\s*(?:[^']*?\?\s*)?'([^']+)'(?:\s*:\s*'([^']+)')?", b)
    srcs = re.findall(r"source:\s*'([^']+)'", b)
    conds = re.findall(r"(?:required|bonus|breaking)\.push\('([^']+)'\)|required\s*=\s*(?:[^;]*?)\[([^\]]+)\]", b)
    plines.append(f"## {' / '.join(dict.fromkeys(names))}")
    plines.append(f"- 判定：{head}")
    for d in descs:
        for x in d:
            if x:
                plines.append(f"- 断语：{x}")
    req = re.findall(r"required(?:\s*=|:)\s*(?:inMing\s*\?\s*)?\[([^\]]*)\]", b)
    for r in req:
        items = re.findall(r"'([^']+)'", r)
        if items:
            plines.append(f"- 成立条件：{'；'.join(items)}")
    for kind, label in [("bonus", "加分"), ("breaking", "破格")]:
        items = re.findall(kind + r"\.push\('([^']+)'\)", b)
        if items:
            plines.append(f"- {label}：{'；'.join(dict.fromkeys(items))}")
    if srcs:
        plines.append(f"- 出处：{'；'.join(dict.fromkeys(srcs))}")
    plines.append("")
(ref / "patterns.md").write_text("\n".join(plines), encoding="utf-8")

# 3) Marriage / compatibility knowledge (heming-knowledge.ts) — keep as-is in a md wrapper
hk = (repo / "lib/ziwei/heming-knowledge.ts").read_text(encoding="utf-8")
meth = re.search(r"HEMING_METHODOLOGY = `(.*?)`;", hk, re.S).group(1)
hl = ["# 婚姻与合盘知识", "",
      "来源：`lib/ziwei/heming-knowledge.ts`（MIT）。线上站把它当作合盘 AI 的背景知识。",
      "⚠️ 本文件里标为「倪师原话」的句子没有逐条出处，可能是转述；要引用倪师原话请以 `tianji-ziwei/` 带时间戳的条目为准。", "",
      "## 合盘方法论", meth.strip(), "", "## 十四主星在夫妻宫"]
fq = re.search(r"STAR_IN_FUQI_GU[^=]*=\s*\{(.*?)\n\};", hk, re.S).group(1)
for star, body in re.findall(r"'([^']+)':\s*\{(.*?)\n  \}", fq, re.S):
    hl.append(f"### {star}")
    for k, v in re.findall(r"(\w+):\s*'([^']*)'", body):
        label = {"summary": "要点", "good": "吉", "bad": "凶", "spouse_traits": "配偶特征", "timing": "婚期", "ni_quote": "倪师（转述，未核）"}.get(k, k)
        hl.append(f"- {label}：{v}")
for const, title in [("SIHUA_IN_FUQI_GU", "四化入夫妻宫"), ("MARRIAGE_STARS_BRIEF", "婚恋杂曜"), ("HEMING_SCORE_CRITERIA", "合盘评分参考")]:
    m = re.search(const + r"[^=]*=\s*\{(.*?)\n\}", hk, re.S)
    if m:
        hl += ["", f"## {title}"]
        for k, v in re.findall(r"'([^']+)':\s*'([^']*)'", m.group(1)):
            hl.append(f"- {k}：{v}")
(ref / "marriage-compatibility.md").write_text("\n".join(hl) + "\n", encoding="utf-8")

# 4) Ni Haixia Tian Ji quotes (CC BY-NC-SA 4.0) — copy per-lecture files + license
tj = ref / "tianji-ziwei"
if tj.exists():
    shutil.rmtree(tj)
shutil.copytree(repo / "docs/tianji-ziwei", tj, ignore=shutil.ignore_patterns("*.png", "entries.jsonl"))
# topic index from entries.jsonl: h2/h3 -> count, so Claude can grep by topic
topics = {}
for line in (repo / "docs/tianji-ziwei/entries.jsonl").read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    e = json.loads(line)
    key = f"{e.get('book','')} › {e.get('h2','')} · {e.get('h3','')}"
    topics[key] = topics.get(key, 0) + 1
idx = ["# 倪师原话主题索引", "", "每条原话在各讲 .md 里都带 `<sub>主题</sub>` 标签。用 grep 搜下面的主题词或星名即可定位。", ""]
for k, n in sorted(topics.items()):
    idx.append(f"- {k}（{n} 条）")
(tj / "TOPICS.md").write_text("\n".join(idx) + "\n", encoding="utf-8")

# 5) Licenses
(out / "LICENSE-code-MIT.txt").write_text((repo / "LICENSE").read_text(encoding="utf-8"), encoding="utf-8")
print("ok", classics, len(topics), "topics")
