#!/usr/bin/env python3
"""
Fetch canonical Zhouyi 64 hexagram texts from Wikisource and update src/iching-data.json.
Uses local cache in tools/wikisource_cache/ to prevent re-fetching and rate limiting.
"""
import urllib.request, urllib.parse, json, ssl, certifi, re, os, time

ctx = ssl.create_default_context(cafile=certifi.where())

CACHE_DIR = "tools/wikisource_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'PhongThuyAssistant/1.0 (https://github.com/namphamsynhat/phongthuyclaudeskill; namphamsynhat@users.noreply.github.com)'
}

HEX_NAMES = [
    '乾', '坤', '屯', '蒙', '需', '訟', '師', '比',
    '小畜', '履', '泰', '否', '同人', '大有', '謙', '豫',
    '隨', '蠱', '臨', '觀', '噬嗑', '賁', '剝', '復',
    '無妄', '大畜', '頤', '大過', '坎', '離', '咸', '恆',
    '遯', '大壯', '晉', '明夷', '家人', '睽', '蹇', '解',
    '損', '益', '夬', '姤', '萃', '升', '困', '井',
    '革', '鼎', '震', '艮', '漸', '歸妹', '豐', '旅',
    '巽', '兌', '渙', '節', '中孚', '小過', '既濟', '未濟'
]

CANONICAL_ZH = [
    "乾為天", "坤為地", "水雷屯", "山水蒙", "水天需", "天水訟", "地水師", "水地比",
    "風天小畜", "天澤履", "地天泰", "天地否", "天火同人", "火天大有", "地山謙", "雷地豫",
    "澤雷隨", "山風蠱", "地澤臨", "風地觀", "火雷噬嗑", "山火賁", "山地剝", "地雷復",
    "天雷無妄", "山天大畜", "山雷頤", "澤風大過", "坎為水", "離為火", "澤山咸", "雷風恆",
    "天山遯", "雷天大壯", "火地晉", "地火明夷", "風火家人", "火澤睽", "水山蹇", "雷水解",
    "山澤損", "風雷益", "澤天夬", "天風姤", "澤地萃", "地風升", "澤水困", "水風井",
    "澤火革", "火風鼎", "震為雷", "艮為山", "風山漸", "雷澤歸妹", "雷火豐", "火山旅",
    "巽為風", "兌為澤", "風水渙", "水澤節", "風澤中孚", "雷山小過", "水火既濟", "火水未濟"
]

def clean_wiki(text):
    text = re.sub(r'-\{(?:T\|)?([^}]+)\}-', lambda m: m.group(1).split('|')[-1], text)
    text = re.sub(r'\{\{另\|([^|]+)\|([^}]+)\}\}', r'\2', text)
    text = re.sub(r'\{\{[^}]+\}\}', '', text)
    text = re.sub(r'\[\[(?:File|Image):[^\]]+\]\]', '', text)
    text = re.sub(r'\[\[([^|\]]+\|)?([^\]]+)\]\]', r'\2', text)
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()

def fetch_hex(n, name):
    cache_path = os.path.join(CACHE_DIR, f"{n:02d}.json")
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)["wikitext"]

    page = urllib.parse.quote(f"周易/{name}")
    url = f"https://zh.wikisource.org/w/api.php?action=parse&page={page}&prop=wikitext&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx) as r:
        res = json.loads(r.read().decode())
        wt = res.get('parse', {}).get('wikitext', {}).get('*', '')
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump({"n": n, "name": name, "wikitext": wt}, f, ensure_ascii=False)
        time.sleep(1.0)
        return wt

def parse_hexagram(name, wt):
    cleaned = clean_wiki(wt)
    lines = [l.strip() for l in cleaned.split("\n") if l.strip()]

    guaci_lines = []
    yaoci_list = []
    tuan_lines = []
    xiang_line = ""

    mode = "start"
    for l in lines:
        if "'''易經：'''" in l:
            mode = "guaci"
            continue
        elif "'''彖曰：'''" in l:
            mode = "tuan"
            continue
        elif "'''象曰：'''" in l:
            mode = "xiang"
            continue
        elif "'''文言曰：'''" in l or "'''繫辭" in l or "'''說卦" in l or "'''序卦" in l:
            mode = "other"
            continue

        if mode == "guaci":
            if l.startswith("*#") or re.match(r'^\*#[初二三四五上九六用]', l):
                raw_yao = l.lstrip("*#").strip()
                raw_yao = re.sub(r"'''", "", raw_yao)
                yaoci_list.append(raw_yao)
            elif l.startswith("**") or l.startswith("***"):
                raw_g = l.lstrip("*").strip()
                raw_g = re.sub(r"'''", "", raw_g)
                if raw_g.startswith(f"{name}：") or raw_g.startswith(f"{name}:"):
                    raw_g = raw_g[len(name)+1:].strip()
                guaci_lines.append(raw_g)
        elif mode == "tuan":
            if l.startswith("**") or l.startswith("***"):
                raw_t = l.lstrip("*").strip()
                raw_t = re.sub(r"'''", "", raw_t)
                tuan_lines.append(raw_t)
            elif l.startswith("*"):
                pass
        elif mode == "xiang":
            if l.startswith("**") and not xiang_line:
                raw_x = l.lstrip("*").strip()
                raw_x = re.sub(r"'''", "", raw_x)
                xiang_line = raw_x

    guaci = " ".join(guaci_lines).strip()
    # Normalize punctuation if needed
    guaci = guaci.replace("。 ", "，").replace("， ", "，")
    if not guaci.endswith("。") and not guaci.endswith("！"):
        guaci += "。"

    tuan = "".join(tuan_lines).strip()
    if tuan and not tuan.startswith("《彖》曰："):
        tuan = f"《彖》曰：{tuan}"

    if xiang_line and not xiang_line.startswith("《象》曰："):
        xiang_line = f"《象》曰：{xiang_line}"

    return {
        "guaci": guaci,
        "yaoci": yaoci_list,
        "tuan": tuan,
        "xiang": xiang_line
    }

def main():
    print("Fetching and parsing all 64 hexagrams from Wikisource...")
    parsed_all = {}
    for i, name in enumerate(HEX_NAMES):
        n = i + 1
        print(f"[{n}/64] Hex {n}: {name} ({CANONICAL_ZH[i]})...")
        wt = fetch_hex(n, name)
        p = parse_hexagram(name, wt)
        parsed_all[n] = p

    # Update src/iching-data.json
    data_path = "src/iching-data.json"
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Check trigrams zh names
    tri_map = {
        "qian": "乾", "kun": "坤", "zhen": "震", "kan": "坎",
        "gen": "艮", "xun": "巽", "li": "離", "dui": "兌"
    }
    for t in data["trigrams"]:
        t["zh"] = tri_map.get(t["key"], t["zh"])

    for h in data["hexagrams"]:
        n = h["n"]
        p = parsed_all[n]
        h["zh"] = CANONICAL_ZH[n - 1]
        if p["guaci"]:
            h["guaci"] = p["guaci"]
        if p["tuan"]:
            h["tuan"] = p["tuan"]
        if p["xiang"]:
            h["xiang"] = p["xiang"]
        if p["yaoci"] and len(p["yaoci"]) >= 6:
            h["yaoci"] = p["yaoci"]

    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    print("Successfully updated src/iching-data.json with canonical Traditional Chinese Zhouyi text!")

if __name__ == "__main__":
    main()
