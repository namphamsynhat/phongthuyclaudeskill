# Tử Vi Đẩu Số và Kinh Dịch cho Claude

Bộ [kỹ năng (Skill)](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) và tiện ích mở rộng (extension) giúp Claude luận **Tử Vi Đẩu Số** và **Kinh Dịch** (quẻ, bói, Tiểu Lục Nhâm, phong thủy dương trạch) và **âm trạch** (phong thủy mộ phần, theo cổ thư) theo truyền thống thầy **Nghê Hải Hạ** (倪海厦《天纪》). **Tiếng Việt là ngôn ngữ chính**; người dùng viết tiếng Anh thì Claude trả lời tiếng Anh.

Xây dựng trên engine, kho kiến thức và bộ lời luận mã nguồn mở của [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) và kho ngữ liệu lời giảng [Renhuai123/nihai-tianji-corpus](https://github.com/Renhuai123/nihai-tianji-corpus).

*English summary at the end.*

## Cách hoạt động

**Tử Vi**
1. Claude hỏi ngày, giờ, giới tính và nơi sinh.
2. `scripts/ziwei-chart.mjs` lập lá số bằng code cố định: giờ mặt trời thật, đổi âm lịch, an sao và độ sáng, Tứ Hóa, cách cục, đại hạn, lưu niên. Kết quả in bằng tiếng Việt (hoặc tiếng Anh). Claude không bao giờ tự tính lá số.
3. Với người sinh 1950–2026, `scripts/lookup-reading.mjs` lấy đúng bài luận soạn sẵn 13 chủ đề của lá số đó từ bộ dữ liệu mở v4.0. Các bài luận đã kiểm nguồn, có trích dẫn thầy Nghê kèm bài giảng và mốc thời gian.
4. Claude dịch, rút gọn phần trả lời câu hỏi, thêm phần vận năm, và đối chiếu trích dẫn với kho kiến thức.

**Kinh Dịch**
- `scripts/kinh-dich.mjs` tra 64 quẻ, đọc 6 hào (có hào động), gieo quẻ, tính Tiểu Lục Nhâm, và ghép **quẻ dương trạch** cho từng người trong nhà theo cách thầy Nghê: thượng quái là vai của người (cha, mẹ, con trưởng…), hạ quái là phương của phòng tính từ tâm nhà.
- Claude đối chiếu với `references/vi/kinh-dich/`: Bát Quái, bảng 64 quẻ, phương pháp dương trạch (bếp, phòng khách, nhà vệ sinh, phòng ngủ vợ chồng, con cái), cùng 2.948 câu giảng của thầy Nghê có liên kết đến đúng giây trên Bilibili.

**Âm trạch**
- `references/vi/am-trach/`: 11 cổ thư phong thủy mộ phần thuộc phạm vi công cộng (Táng Thư, Hám Long Kinh, Nghi Long Kinh, Táng Pháp Đảo Trượng, Thanh Nang Kinh, Thanh Nang Áo Ngữ, Thanh Ô Kinh, luận văn của Trình Di, Trương Cư Chính, Trịnh Dụng Tích, phần đầu Nhân Tử Tu Tri), dịch đủ tiếng Việt kèm nguyên văn, cùng bản tổng hợp `am-trach.md` (long, huyệt, sa, thủy, lý khí, mười điều răn, quan điểm phê phán).

## Cài đặt (dùng offline)

Tải từ [Releases](https://github.com/namphamsynhat/phongthuyclaudeskill/releases/latest). Hai gói offline có đủ 77 năm dữ liệu (1950–2026), dùng được không cần internet.

| Tệp | Dùng cho | Dung lượng |
|---|---|---|
| `ziwei-doushu.mcpb` | Tiện ích **Claude Desktop** (cài một lần bấm) | ~155 MB |
| `ziwei-doushu-skill-offline.zip` | Kỹ năng **Claude Code**, đủ dữ liệu | ~155 MB |
| `ziwei-doushu-skill.zip` | Tải lên kỹ năng trên claude.ai (gói nhỏ; tải dữ liệu khi cần) | ~2 MB |

### Claude Desktop (tiện ích)

1. Tải `ziwei-doushu.mcpb`.
2. Bấm đúp vào tệp, hoặc mở Claude Desktop → Settings → Extensions rồi kéo tệp vào. Bấm **Install**.
3. Bắt đầu trò chuyện: "Lập lá số tử vi cho tôi: nam, sinh 17/05/1990 lúc 14:30 tại Hà Nội."

Tiện ích cho Claude bảy công cụ: `ziwei_chart`, `ziwei_find_city`, `ziwei_reading`, `ziwei_search_quotes`, `ziwei_reference`, `kinh_dich`, `ziwei_guide`. Cần Node 22.15 trở lên (các bản Claude Desktop gần đây đã có).

### Claude Code (kỹ năng)

```bash
unzip ziwei-doushu-skill-offline.zip -d ~/.claude/skills/
```

Sau đó hỏi Claude Code; kỹ năng tự được nạp. Cần Node 22.15+ trên máy (`node --version`); Node cũ hơn thì cài lệnh `zstd`.

### Claude Code (cùng bộ công cụ với tiện ích)

Có thể thêm máy chủ MCP của tiện ích vào Claude Code. Giải nén tệp `.mcpb` (thực chất là tệp zip) rồi đăng ký:

```bash
mkdir -p ~/ziwei-doushu-mcp && unzip ziwei-doushu.mcpb -d ~/ziwei-doushu-mcp
```

```bash
claude mcp add ziwei-doushu -- node ~/ziwei-doushu-mcp/server/mcp-server.mjs
```

### claude.ai

Settings → Capabilities → bật chạy code (code execution) → tải `ziwei-doushu-skill.zip` lên mục Skills. Gói nhỏ này tải từng năm (~2 MB) khi cần lần đầu, nên cần mạng; gói tải lên claude.ai giới hạn dung lượng nên không chứa đủ dữ liệu.

### Ví dụ câu hỏi

- "Lập lá số tử vi cho tôi: nam, sinh 17/05/1990 lúc 14:30 tại Hà Nội. Năm 2026 sự nghiệp thế nào?"
- "Nhà tôi: vợ chồng ngủ phòng Tây Nam, con trai cả phòng Bắc, bếp ở Tây Bắc. Theo dương trạch của thầy Nghê nên sắp xếp lại thế nào?"
- "Tôi gieo 6 đồng xu được (từ dưới lên) sấp, ngửa, ngửa, sấp, sấp, ngửa. Hỏi chuyện đổi việc."
- "Read my Zi Wei chart: female, born 1988-11-02 at 07:15 in Ho Chi Minh City. What does it say about marriage?"

## Tình trạng tiếng Việt

| Phần | Tiếng Việt |
|---|---|
| Kết quả lá số (sao, cung, Tứ Hóa, cách cục, điều kiện, lời luận sao) | Đủ (mặc định tiếng Việt) |
| Kho kiến thức Tử Vi: cổ thư, 34 cách cục, xem hợp tuổi, 1.848 câu của thầy Nghê | Dịch đủ, mỗi câu kèm nguyên văn |
| Kinh Dịch: Bát Quái, 64 quẻ, phương pháp dương trạch | Viết bằng tiếng Việt |
| Kinh Dịch: toàn bộ 2.948 câu giảng — dương trạch (96), kham dư/phong thủy (257), chiêm bốc/chiết tự/Lục Thần/Lục Nhâm (99), Dịch lý (396), từng quẻ (2.100) | Dịch đủ, mỗi câu kèm nguyên văn |
| Âm trạch: 11 cổ thư phong thủy mộ phần (Táng Thư, Hám Long Kinh, Nghi Long Kinh, Táng Pháp Đảo Trượng, Thanh Nang Kinh, Thanh Ô Kinh, Trình Di, Trương Cư Chính, Nhân Tử Tu Tri…) và bản tổng hợp phương pháp | Dịch đủ, mỗi đoạn kèm nguyên văn |
| Bộ lời luận soạn sẵn v4.0 (≈20 tỉ chữ Hán, 56,6 GB giải nén) | Giữ nguyên tiếng Trung; Claude dịch khi đọc |
| SKILL.md, README, công cụ | Tiếng Việt (có tiếng Anh) |

## Tự build từ mã nguồn

```bash
npm ci --ignore-scripts
```

```bash
npm run release
```

`npm run release` build các script và máy chủ MCP, tải và kiểm tra 77 tệp dữ liệu vào `build/data/` (chỉ lần đầu), rồi ghi cả ba gói vào `release/`.

Tệp dữ liệu không lưu trong repo. Cả 77 tệp đã được kiểm tra ngày 04/11/2026: checksum và dung lượng khớp bản phát hành; 674.976 lá số; mọi ngày có thật từ 1950 đến 2026 xuất hiện đúng một lần cho mỗi 12 giờ và cả hai giới; đủ 13 chủ đề ở mọi lá số; số ký tự lưu khớp với văn bản.

Dựng lại kho Kinh Dịch từ bản clone của `nihai-tianji-corpus`:

```bash
python3 -I tools/iching_data.py
```

```bash
python3 -I tools/kinh_dich.py gen <corpus>/data/entries.jsonl skill/ziwei-doushu/references
```

```bash
python3 -I tools/kinh_dich.py build <corpus>/data/entries.jsonl skill/ziwei-doushu/references tools/kinh-dich-vi
```

```bash
python3 -I tools/kinh_dich_core.py skill/ziwei-doushu/references
```

## Cấu trúc repo

| Đường dẫn | Nội dung |
|---|---|
| `skill/ziwei-doushu/` | Bản thân kỹ năng (SKILL.md, scripts, references) |
| `skill/ziwei-doushu/references/vi/` | Kho kiến thức tiếng Việt: cổ thư, cách cục, xem hợp, 1.848 câu Tử Vi, và `kinh-dich/` |
| `skill/ziwei-doushu/references/am-trach/` | Cổ thư âm trạch nguyên văn (phạm vi công cộng, Wikisource); bản dịch và tổng hợp ở `references/vi/am-trach/` |
| `tools/am_trach.py`, `tools/am-trach-vi/` | Dựng bản dịch âm trạch từ tệp dịch `.vi.tsv` |
| `skill/ziwei-doushu/references/kinh-dich/` | Lời giảng Kinh Dịch nguyên văn tiếng Trung, theo chủ đề và theo từng quẻ (bản tiếng Việt ở `references/vi/kinh-dich/`) |
| `src/chart.ts`, `src/chart-cli.ts`, `src/i18n.ts`, `src/patterns-vi.ts` | Bộ in lá số, CLI, bảng thuật ngữ Việt/Anh, bản dịch mô tả cách cục |
| `src/iching.ts`, `src/iching-data.json`, `src/kinh-dich-cli.ts` | Engine Kinh Dịch: 64 quẻ, dương trạch, gieo quẻ, Tiểu Lục Nhâm |
| `src/lookup.ts`, `src/lookup-cli.ts` | Tra bài luận offline (zstd có sẵn của Node) |
| `src/mcp-server.ts`, `extension/manifest.json` | Máy chủ MCP và manifest cho tiện ích Claude Desktop |
| `src/ziwei/` | Engine lá số chép nguyên từ Renhuai123/ziwei-doushu `lib/ziwei/` (MIT) |
| `tools/extract_kb.py` | Dựng lại `references/` từ bản clone repo gốc |
| `tools/tianji_vi.py`, `tools/tianji-vi/` | Dựng lại `references/vi/tianji-ziwei/` từ bảng dịch |
| `tools/iching_data.py`, `tools/kinh_dich.py`, `tools/kinh_dich_core.py`, `tools/kinh-dich-vi/` | Dữ liệu 64 quẻ, bộ sinh tệp Kinh Dịch, bảng dịch |

## Lưu ý

- Engine lá số chưa được chạy thử trọn vẹn trong môi trường build này. Hãy so vài lá số với [ouranic.cn](https://ouranic.cn) trước khi tin dùng.
- Phần dương trạch là quan điểm của một trường phái. Các câu về tai họa trong lời giảng là xu hướng theo cổ thư, không phải lời phán.
- Lời luận mang tính văn hóa, giải trí; không phải lời khuyên y khoa, pháp lý hay tài chính.

## Giấy phép

| Phần | Giấy phép |
|---|---|
| Code riêng của repo (`src/*.ts` trừ `src/ziwei/`, scripts, tools) | MIT |
| Engine (`src/ziwei/`, đóng gói trong `ziwei-chart.mjs`) | MIT, © Renhuai123/ziwei-doushu (xem `skill/ziwei-doushu/LICENSE-code-MIT.txt`); dựa trên [iztro](https://github.com/SylarLong/iztro) (MIT) |
| Trích đoạn cổ thư (`references/classic-*.md`) | Phạm vi công cộng |
| Lời giảng thầy Nghê (`references/tianji-ziwei/`, `references/kinh-dich/`) và bản dịch tiếng Việt | **CC BY-NC-SA 4.0, chỉ phi thương mại** |
| Bộ lời luận v4.0 (tải về khi chạy, không lưu ở repo) | CC BY 4.0 (các câu của thầy Nghê bên trong là CC BY-NC-SA 4.0) |

Vì có lời giảng của thầy Nghê, **toàn bộ kỹ năng chỉ dùng phi thương mại**. Muốn dùng thương mại, hãy bỏ `references/tianji-ziwei/` và `references/kinh-dich/`, và xin phép cho các câu trích trong bộ dữ liệu.

---

## English summary

A Claude Skill and Claude Desktop extension for **Zi Wei Dou Shu** (Purple Star Astrology) and the **I Ching** (hexagrams, coin casting, Xiao Liu Ren, house feng shui) in Ni Haixia's tradition. Vietnamese is the main language; Claude answers in English when the user writes English. The chart and the I Ching calculations are done by bundled scripts (`ziwei-chart.mjs`, `lookup-reading.mjs`, `kinh-dich.mjs`), and Claude interprets them using the bundled knowledge base and 4,796 timestamped Ni Haixia quotes. Install the `.mcpb` in Claude Desktop, unzip the offline skill into `~/.claude/skills/` for Claude Code, or upload the small zip to claude.ai. Non-commercial use only, because of the CC BY-NC-SA quotes.
