# Zi Wei Dou Shu skill for Claude · Kỹ năng Tử Vi cho Claude

A [Claude Skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) that turns Claude into a Zi Wei Dou Shu (Purple Star Astrology, Tử Vi Đẩu Số) reader in the Ni Haixia (倪海厦《天纪》) tradition. **Readings are written in English or Vietnamese.**

Built on the open-source engine, knowledge base and reading dataset of [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu).

## How it works

1. Claude asks for the birth date, time, gender and birthplace.
2. `scripts/ziwei-chart.mjs` computes the chart deterministically: true solar time, lunar conversion, star placement and brightness, the Four Transformations, patterns, decade and yearly luck. It prints the chart in English or Vietnamese and never asks Claude to work out the astrology itself.
3. For births from 1950 to 2026, `scripts/lookup_reading.py` fetches that exact chart's pre-written 13-topic reading from the open dataset v4.0. These readings are source-checked and cite Ni Haixia with episode and timestamp.
4. Claude translates and condenses the parts that answer the question, adds the yearly forecast, and checks quotes against the bundled knowledge base.

## Install

**claude.ai / Claude desktop:** run `npm run package` (or download the zip from Releases), then go to Settings → Capabilities, turn on code execution, and upload `ziwei-doushu-skill.zip` under Skills.

**Claude Code:**

```bash
cp -r skill/ziwei-doushu ~/.claude/skills/
```

The reading lookup needs Python with `zstandard` (`pip install zstandard`) or the `zstd` command. It downloads each year file (~2 MB) on first use and checks its SHA-256. To work fully offline, or where GitHub downloads are blocked, fetch all 77 years (161 MB) once:

```bash
python3 skill/ziwei-doushu/scripts/lookup_reading.py --download-all
```

The dataset files are not stored in this repo. All 77 were checked on 2026-11-04: checksums and sizes match the release, 674,976 charts, every real date from 1950 to 2026 exactly once for each of the 12 hours and both genders, all 13 topics present in every chart, and the stored character counts match the text.

Example prompts:
- "Lập lá số tử vi cho tôi: nam, sinh 17/05/1990 lúc 14:30 tại Hà Nội. Năm 2026 sự nghiệp thế nào?"
- "Read my Zi Wei chart: female, born 1988-11-02 at 07:15 in Ho Chi Minh City. What does it say about marriage?"

## Repository layout

| Path | What |
|---|---|
| `skill/ziwei-doushu/` | The skill itself (SKILL.md, scripts, references) |
| `skill/ziwei-doushu/references/vi/` | Full Vietnamese translation of the knowledge base: classics, patterns, marriage notes, and all 1,848 Ni Haixia quotes (each line keeps the original Chinese and timestamp) |
| `src/cli.ts`, `src/i18n.ts` | Chart CLI and English/Vietnamese term tables (Hán-Việt and pinyin) |
| `src/ziwei/` | Chart engine copied unchanged from Renhuai123/ziwei-doushu `lib/ziwei/` (MIT) |
| `tools/extract_kb.py` | Rebuilds `references/` from a clone of the upstream repo |
| `tools/tianji_vi.py`, `tools/tianji-vi/` | Splits the quote files into lines and rebuilds `references/vi/tianji-ziwei/` from the translation tables (`*.vi.tsv`, `tags.map.tsv`) |

Rebuild the chart script after changing `src/`:

```bash
npm ci --ignore-scripts
npm run build
```

## Status

- The reading lookup has been tested on the 1990 data file.
- **The chart script hasn't been run end-to-end yet.** Please compare a few charts with [ouranic.cn](https://ouranic.cn) before relying on it.
- The knowledge base is fully translated into Vietnamese (`references/vi/`). Pattern descriptions printed by the chart script and the pre-written readings stay in Chinese; Claude translates them when it writes the reading.

## Licenses

| Part | License |
|---|---|
| This repo's own code (`src/cli.ts`, `src/i18n.ts`, scripts, tools) | MIT |
| Engine (`src/ziwei/`, bundled in `ziwei-chart.mjs`) | MIT, © Renhuai123/ziwei-doushu (see `skill/ziwei-doushu/LICENSE-code-MIT.txt`); built on [iztro](https://github.com/SylarLong/iztro) (MIT) |
| Classics excerpts (`references/classic-*.md`) | Public domain |
| Ni Haixia quotes (`references/tianji-ziwei/`) and their Vietnamese translation (`references/vi/tianji-ziwei/`) | **CC BY-NC-SA 4.0, non-commercial only** |
| Reading dataset v4.0 (downloaded at run time, not stored here) | CC BY 4.0 (the Ni Haixia quotes inside it are CC BY-NC-SA 4.0) |

Because of the Ni Haixia quotes, **this skill as a whole is for non-commercial use**. For commercial use, remove `references/tianji-ziwei/` and get permission for the quotes inside the dataset.

Readings are for culture and entertainment. They are not medical, legal or financial advice.
