---
name: ziwei-doushu
description: Zi Wei Dou Shu (Purple Star Astrology, Tử Vi Đẩu Số, 紫微斗数) chart reading in the Ni Haixia (倪海厦《天纪》) tradition, answered in English or Vietnamese. Use whenever the user asks for a Zi Wei / Tử Vi / purple star chart, lá số tử vi, 排盘, a reading by birth date and time, decade or yearly luck (đại hạn, lưu niên, 大限, 流年), or marriage compatibility of two charts (xem tuổi hợp, 合盘). Computes the chart with a bundled deterministic engine, then interprets it using a pre-written reading dataset, classics, pattern rules and timestamped Ni Haixia quotes.
---

# Zi Wei Dou Shu reader (English / Tiếng Việt)

The chart is **calculated by code, never by you**. You do the interpretation. Do not place stars or compute the Four Transformations in your head: always run the script.

## 0. Output language

- **Reply only in English or Vietnamese.** Use Vietnamese if the user writes in Vietnamese, otherwise English. If unsure, ask once.
- Run both scripts with `--lang vi` or `--lang en` to match.
- The reading dataset is in **Chinese**; the knowledge base has a full Vietnamese translation in `references/vi/` (section 4). Translate what you use; never paste Chinese paragraphs untranslated.
- Term style:
  - Vietnamese: the usual Hán-Việt names (Tử Vi, Thiên Phủ, cung Mệnh, Phu Thê, Hóa Kỵ, đại hạn, lưu niên). The script already prints them.
  - English: pinyin plus a short gloss the first time, e.g. "Tian Fu (Treasury star)", "Spouse palace", "Hua Ji (obstacle transformation)".
  - Add the Chinese characters in brackets only the first time a term appears, if at all.
- Ni Haixia quotes: give your translation, then the original Chinese in brackets, then the episode and timestamp link. Vietnamese readers know him as **Nghê Hải Hạ**.

## 1. Collect birth data

Ask only for what is missing:

1. **Birth date**: Gregorian preferred. A lunar date (âm lịch) also works; ask whether it was a leap month (tháng nhuận).
2. **Birth time** (clock time, HH:MM). If unknown, ask for a rough range. If it's still unknown, say the chart can't be reliable and offer to compare the possible hours.
3. **Gender** (male / female; the tradition uses it for the direction of the decades).
4. **Birthplace** (city), for true solar time. Vietnamese cities and major world cities are built in (Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Huế, Cần Thơ, …; diacritics optional), and so are Chinese cities. For anywhere else, use `--longitude` and `--utc-offset`.
5. Optionally: which year to look at (default: this year), and what they want to know.

## 2. Run the engine

Requires Node 18+. The script is self-contained (no npm install).

```bash
node scripts/ziwei-chart.mjs --date 1990-05-17 --time 14:30 --gender male --city "Ha Noi" --year 2026 --lang vi
```

Options:
- `--lunar 1990-04-23 [--leap-month]` instead of `--date`
- `--city "Da Nang"` or `--longitude 108.22 --utc-offset 420` (minutes east of UTC, standard time, not daylight saving). Check a city with `--find-city "Hue"`
- `--hour-branch 0-11` to give the double-hour directly (Tý/Zi = 0 … Hợi/Hai = 11), skipping true-solar-time
- `--late-zishi next-day|current-day` (default `next-day`: 23:00–23:59 counts as the next day)
- `--leap split|next-month|prev-month|origin-month` leap-month policy (default `split`; Ni's school is `next-month`)
- `--lang en|vi` (default `en`)
- `--json` full structured chart instead of Markdown

Pass on every `⚠️` note in the output (hour near a boundary, China daylight saving 1986–1991, chart date adjusted). **Vietnam clock history:** southern Vietnam used UTC+8 from 1 January 1960 to 13 June 1975. For a southern birth in that period, the built-in city (UTC+7) is wrong: pass `--longitude` and `--utc-offset 480`. For any other place whose clocks changed, set `--utc-offset` to the offset the clock showed at the time of birth.

## 2b. Fetch the pre-written reading (births 1950–2026)

The chart output has a line `Dataset key` / `Khóa dữ liệu`, e.g. `1990-05-17-7-male`. For that key, the open dataset v4.0 holds a finished, source-checked reading of about 30,000 Chinese characters across 13 topics: the same natal reading the original site shows. Get only the topics you need:

```bash
node scripts/lookup-reading.mjs --key 1990-05-17-7-male --topic love,spirit --lang vi
```

Topics: overview, personality, love, career, wealth, health, family, children, move, friends, home, spirit, parents (or `all`, which is long).
It reads `data/year-YYYY.jsonl.zst` and takes 0–5 seconds. The offline package already contains all 77 years. It needs Node 22.15 or newer (or the `zstd` command on older Node). If the `data/` folder is empty (the small package from the repo), run `python3 scripts/lookup_reading.py --download-all` once, or use `python3 scripts/lookup_reading.py` with the same options, which downloads a year when needed.

How to use it:
- Treat it as **the main evidence** for natal questions. Its 核心论断 (core judgment), 关键推导 (key reasoning) and 经典出处 (classical sources) sections already carry checked citations with episode and timestamp. Keep those citations when you reuse a point.
- **Don't paste it.** Translate and condense the parts that answer the user's question, and tie them to the chart.
- It is **natal only, as of 2026-10-15**: its "current decade" assumes that date. For a given year, use the chart script's decade and yearly sections yourself.
- If the download fails or the birth is outside 1950–2026, skip this step and read from the chart plus `references/`.

## 3. Interpret: order of reading (Ni Haixia's method)

Follow this order; don't jump to conclusions from one star.

1. **Life palace (Mệnh)**: main stars and brightness (Temple/Prosperous = strong, Fallen = weak). Empty palace: read the borrowed stars from the opposite palace, at reduced strength.
2. **The triad (tam phương tứ chính)**: Life + Wealth + Career + Travel together set the frame. The Life palace is the base; the triad shows where the person can use it.
3. **Body palace (Thân)**: where it falls shows what the person leans on later in life.
4. **Birth-year transformations**: where Lu / Quan / Ke / Ji land. Hua Ji hitting the Life palace or its opposite matters most.
5. **Patterns (cách cục)**: the engine lists the patterns it found, with required, strengthening and weakening conditions. A pattern with weakening conditions is weakened; say so.
6. **The topic asked about**: read that palace + its opposite + its triad. For marriage, read the Spouse palace **and** the Fortune & Mind palace (Phúc Đức); Ni said looking at the Spouse palace alone is a big mistake.
7. **Timing**: the current decade (marked ◀) and its transformations, then the yearly Life palace and yearly transformations.

## 4. Knowledge base (load only what you need)

Every file exists in Chinese (`references/`) and in a full Vietnamese translation (`references/vi/`). Use the Vietnamese files when answering in Vietnamese, and as a starting point for English. Use the Chinese files to check the original wording.

| Vietnamese | Chinese original | Use for |
|---|---|---|
| `references/vi/patterns.md` | `references/patterns.md` | Meaning, conditions and source of each pattern the engine detects |
| `references/vi/classic-gusuifu.md`, `classic-quanshu.md`, `classic-quanji.md` | `references/classic-*.md` | Classic rules for stars and palaces (summary-style excerpts, not the complete books) |
| `references/vi/marriage-compatibility.md` | `references/marriage-compatibility.md` | Compatibility method, each main star in the Spouse palace, transformations in the Spouse palace, romance stars |
| `references/vi/tianji-ziwei/*.md` | `references/tianji-ziwei/*.md` | 1,848 Ni Haixia quotes, each with a Bilibili timestamp link; the Vietnamese files show «translation» — 「original Chinese」 on every line |
| `references/vi/tianji-ziwei/TOPICS.md` | `references/tianji-ziwei/TOPICS.md` | Topic index for the quotes |

The Vietnamese quote files contain both languages, so you can search with Vietnamese or Chinese terms:

```bash
grep -h "Hóa Kỵ" references/vi/tianji-ziwei/*.md | head -20
grep -h "Phu Thê" references/vi/tianji-ziwei/*.md | grep "Phúc Đức" | head
grep -h "化忌" references/vi/tianji-ziwei/*.md | head
```

When you quote Ni Haixia, use the translation, then the original Chinese in brackets, then the timestamp link. Keep any 〔Đính chính …〕 correction note that follows a quote: it marks places where the lecture contradicts a correctly drawn chart or 《紫微斗数全书》.

## 5. Rules for the reading

- **Quote only what is in the files.** When citing Ni Haixia, use a line from `tianji-ziwei/` or the dataset, and keep its timestamp. Never invent a quote or present a paraphrase as his words. Lines marked 转述 in `marriage-compatibility.md` are not verified quotes.
- **Tie every claim to the chart**: "Hua Ji in your Spouse palace (from the birth-year stem Geng)…", not general statements.
- **Family relations are weak in Zi Wei**: Ni said so himself (lecture 2上, 00:25:27). Mark readings about parents, siblings and children as for reference only.
- **No fatal or medical verdicts.** Source lines like 生离死别 (separation by death), 克夫 (harming the husband) or 夭折 (early death) describe classical tendencies. Turn them into risk areas and practical advice. Never predict a death, divorce or illness as certain. Health readings are not medical advice.
- **Hour uncertainty**: if the time is near a boundary or unknown, say the reading depends on it and offer to compare the neighbouring hour.
- Ni's view is that a reading should lead to action ("what's the point of a reading if nothing can be done about it?"). End with concrete suggestions, not just labels.

## 6. Compatibility

Run the script once per person. Compare both people's Life, Spouse and Fortune & Mind palaces, then follow `references/marriage-compatibility.md`: each person's Spouse-palace stars against the other's Life-palace stars, how the transformations cross between the charts, and both people's current decades.

## Licenses

- Engine code: MIT (Renhuai123/ziwei-doushu, built on iztro): `LICENSE-code-MIT.txt`
- Classics: public domain
- `references/tianji-ziwei/`: **CC BY-NC-SA 4.0, non-commercial only**; copyright in the lectures stays with the rights holders. Keep attribution and links when quoting.
- Reading dataset v4.0: CC BY 4.0. When you use it, credit "Zi Wei Dou Shu open interpretation dataset v4.0 (Renhuai123/ziwei-doushu)". The Ni Haixia quotes inside it stay CC BY-NC-SA 4.0.
