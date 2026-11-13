/**
 * Zi Wei Dou Shu MCP server (stdio). Works fully offline.
 * Layout (relative to this file): ../data/year-*.jsonl.zst, ../references/, ../SKILL.md
 * Override the root with $ZIWEI_HOME.
 */
import { graveMarkdown } from './grave';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readingMarkdown, TOPICS } from './lookup';
import { cast, changeHex, findHexagram, fromLines, hexagramMarkdown, hourBranchOf, houseMarkdown, liuRenMarkdown, trigramsMarkdown } from './iching';

const ROOT = resolve(process.env.ZIWEI_HOME ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
const DATA = join(ROOT, 'data');
const REFS = join(ROOT, 'references');

const INSTRUCTIONS = `Huyền học phương Đông bằng tiếng Việt (Eastern metaphysics, Vietnamese first): Tử Vi Đẩu Số, Kinh Dịch, phong thủy dương trạch (nhà cửa) và âm trạch (mộ phần), theo thầy Nghê Hải Hạ (倪海厦《天纪》) và cổ thư.
SCOPE — use these tools for ANY question about: vận hạn, số mệnh, tử vi, lá số, xem tuổi / hợp tuổi, năm nay hay đại hạn thế nào, sự nghiệp / tình duyên / tài lộc theo ngày giờ sinh; Kinh Dịch, quẻ, gieo quẻ, bói một việc, Tiểu Lục Nhâm, Mai Hoa, chiết tự; nhà cửa, hướng nhà, phòng ngủ, bếp, nhà vệ sinh, ai ở phòng nào (dương trạch); mộ phần, chọn đất táng, hướng mộ, Hoàng Tuyền, Bát sát, cải táng (âm trạch); and Eastern metaphysics / feng shui in general. Never tell the user this extension only reads Tử Vi charts.
- Tử Vi / vận hạn: ask birth date, clock time, gender, birthplace → la_so_tu_vi (never compute the chart yourself) → if it prints a dataset key (births 1950–2026) bai_luan_tu_vi for the topics asked → check with tim_loi_giang / doc_tai_lieu.
- Kinh Dịch / bói: kinh_dich (hexagram, cast, liuren, trigrams) + doc_tai_lieu (bat-quai, 64-que, que).
- Dương trạch: ask the floor plan and who sleeps where → kinh_dich action house → doc_tai_lieu duong-trach / duong-trach-classic; tim_loi_giang scope duong-trach.
- Âm trạch: doc_tai_lieu am-trach → kinh_dich action grave for a facing → tim_loi_giang scope am-trach. Present it as traditional doctrine, not certain fortune.
- Topics without a dedicated tool (chọn ngày, đặt tên…): say so, then help with what the I Ching, five elements and the bundled classics offer.
Answer in Vietnamese (English if the user writes English). Call huong_dan_huyen_hoc once for the full method and rules. Never invent Ni Haixia quotes; never predict death, divorce or illness as certain.`;

const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });
const fail = (e: unknown) => ({ content: [{ type: 'text' as const, text: `Error: ${(e as Error).message ?? e}` }], isError: true });

// The chart engine is loaded on first use so the other tools start instantly.
let chartMod: Promise<typeof import('./chart')> | null = null;
const chart = () => (chartMod ??= import('./chart'));

const server = new McpServer({ name: 'tu-vi-phong-thuy', version: '1.7.0' }, { instructions: INSTRUCTIONS });

server.registerTool('la_so_tu_vi', {
  title: 'Lập lá số Tử Vi',
  description: 'Lập lá số Tử Vi (vận hạn, số mệnh, xem tuổi). Compute a natal Zi Wei Dou Shu chart (12 palaces, stars and brightness, Four Transformations, patterns, decade and yearly luck) with true solar time. Returns Markdown in English or Vietnamese, plus a dataset key for bai_luan_tu_vi. Give either date (Gregorian) or lunar date, and either time (clock HH:MM) or hour_branch.',
  inputSchema: {
    date: z.string().optional().describe('Gregorian birth date YYYY-MM-DD'),
    lunar: z.string().optional().describe('Lunar birth date YYYY-MM-DD (instead of date)'),
    leap_month: z.boolean().optional().describe('Lunar date is in a leap month'),
    time: z.string().optional().describe('Clock time of birth HH:MM'),
    hour_branch: z.number().int().min(0).max(11).optional().describe('Double-hour index 0–11 (Tý/Zi=0 … Hợi/Hai=11), skips true-solar-time'),
    gender: z.enum(['male', 'female']),
    city: z.string().optional().describe('Birth city, e.g. "Ha Noi", "TP. Ho Chi Minh", "Da Nang", "Singapore", "北京"'),
    longitude: z.number().optional().describe('Birthplace longitude, east positive (instead of city)'),
    utc_offset: z.number().int().optional().describe('Standard UTC offset of the birth clock in minutes, e.g. 420 for Vietnam; 480 for southern Vietnam 1960–13 Jun 1975'),
    year: z.number().int().optional().describe('Year for the yearly-luck section (default: this year)'),
    lang: z.enum(['en', 'vi']).optional().describe('Output language (default vi = Vietnamese)'),
    late_zishi: z.enum(['next-day', 'current-day']).optional(),
    leap_policy: z.enum(['split', 'next-month', 'prev-month', 'origin-month']).optional(),
  },
}, async (a) => {
  try {
    const args: Record<string, string> = {};
    const set = (k: string, v: unknown) => { if (v !== undefined && v !== null && v !== '') args[k] = String(v); };
    set('date', a.date); set('lunar', a.lunar); if (a.leap_month) args['leap-month'] = 'true';
    set('time', a.time); set('hour-branch', a.hour_branch); set('gender', a.gender); set('city', a.city);
    set('longitude', a.longitude); set('utc-offset', a.utc_offset); set('year', a.year); set('lang', a.lang);
    set('late-zishi', a.late_zishi); set('leap', a.leap_policy);
    return text((await chart()).renderChart(args));
  } catch (e) { return fail(e); }
});

server.registerTool('tim_noi_sinh', {
  title: 'Tìm nơi sinh',
  description: 'Find the longitude and standard UTC offset of a city (Vietnamese and major world cities, Chinese cities and districts).',
  inputSchema: { query: z.string() },
}, async ({ query }) => {
  try { return text((await chart()).renderChart({ 'find-city': query })); } catch (e) { return fail(e); }
});

server.registerTool('bai_luan_tu_vi', {
  title: 'Bài luận Tử Vi soạn sẵn',
  description: `Fetch the source-checked natal reading (Chinese, ~30,000 characters over 13 topics) from the offline dataset v4.0 for births 1950–2026. Use the dataset key printed by la_so_tu_vi. Topics: ${TOPICS.join(', ')}. Translate and condense; do not paste.`,
  inputSchema: {
    key: z.string().describe('Dataset key from la_so_tu_vi, e.g. 1990-05-17-7-male'),
    topics: z.array(z.enum(TOPICS)).optional().describe('Topics to return (default overview). Ask only for what you need.'),
    lang: z.enum(['en', 'vi']).optional(),
  },
}, async ({ key, topics, lang }) => {
  try { return text(await readingMarkdown(DATA, key, topics?.length ? topics : ['overview'], lang ?? 'vi')); } catch (e) { return fail(e); }
});

server.registerTool('tim_loi_giang', {
  title: 'Tìm lời giảng và cổ thư',
  description: 'Search Tử Vi, Kinh Dịch, dương trạch and âm trạch sources: timestamped Ni Haixia (Nghê Hải Hạ) quotes: 1,848 on Zi Wei Dou Shu (scope ziwei) and 2,948 on the I Ching, divination, feng shui and house placement (scope kinh-dich); scope am-trach searches the 11 translated classical grave feng shui texts (Táng Thư, Hám Long Kinh…); scope duong-trach searches the 4 translated classical house feng shui texts (Hoàng Đế Trạch Kinh, Dương Trạch Thập Thư, Dương Trạch Chỉ Nam, Bát Trạch Tam Yếu). Vietnamese files carry the Vietnamese translation and the original Chinese on each line, so search in either language (e.g. "Hóa Kỵ", "Phu Thê", "化忌", "Tây Bắc", "地天泰", "厨房", "Ngũ Hư", "五虚"). All words must appear in the line.',
  inputSchema: {
    query: z.string().describe('Words to find; all must appear (space separated)'),
    scope: z.enum(['all', 'ziwei', 'kinh-dich', 'am-trach', 'duong-trach']).optional().describe('Which quote set (default all; am-trach = classical grave feng shui; duong-trach = classical house feng shui)'),
    lang: z.enum(['vi', 'zh']).optional().describe('vi = Vietnamese + Chinese lines (default), zh = Chinese original only'),
    limit: z.number().int().min(1).max(100).optional(),
  },
}, async ({ query, scope, lang, limit }) => {
  try {
    const base = lang === 'zh' ? REFS : join(REFS, 'vi');
    const dirs = scope === 'am-trach' ? [join(base, 'am-trach')]
      : scope === 'duong-trach' ? [join(base, 'duong-trach')]
      : [
        ...(scope === 'kinh-dich' ? [] : [join(base, 'tianji-ziwei')]),
        ...(scope === 'ziwei' ? [] : [join(base, 'kinh-dich'), join(base, 'kinh-dich', 'que')]),
      ];
    const SKIP = ['README.md', 'LICENSE.md', 'TOPICS.md', 'bat-quai.md', '64-que.md', 'duong-trach.md', 'am-trach.md'];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits: string[] = [];
    for (const dir of dirs.filter(d => existsSync(d))) {
      const label = dir.endsWith('que') ? 'kinh-dich/que/'
        : dir.endsWith('kinh-dich') ? 'kinh-dich/'
        : dir.endsWith('am-trach') ? 'am-trach/'
        : dir.endsWith('duong-trach') ? 'duong-trach/'
        : '';
      const isClassic = label === 'am-trach/' || label === 'duong-trach/';
      for (const f of readdirSync(dir).filter(n => n.endsWith('.md') && !SKIP.includes(n)).sort()) {
        const lines = readFileSync(join(dir, f), 'utf8').split('\n');
        lines.forEach((line, i) => {
          const zhPlain = isClassic && lang === 'zh';
          if (zhPlain ? (!line.trim() || line.startsWith('#') || line.startsWith('>')) : !line.startsWith(isClassic ? '- ' : '- [')) return;
          const full = isClassic && lines[i + 1]?.startsWith('  「') ? `${line} ${lines[i + 1].trim()}` : line;
          const low = full.toLowerCase();
          if (words.every(w => low.includes(w))) hits.push(`[${label}${f.replace('.md', '')}] ${zhPlain ? full : full.slice(2)}`);
        });
      }
    }
    const n = limit ?? 20;
    return text(hits.length ? `${hits.length} match(es)${hits.length > n ? `, showing ${n}` : ''}:\n\n${hits.slice(0, n).join('\n')}` : 'No matching quote. Try fewer or different words, or the other language.');
  } catch (e) { return fail(e); }
});

const REF_FILES = ['patterns', 'marriage-compatibility', 'classic-gusuifu', 'classic-quanshu', 'classic-quanji',
  'bat-quai', '64-que', 'duong-trach', 'kd-07-duong-trach', 'kd-08-dich-ly', 'kd-10-chiem-doan', 'kd-11-kham-du', 'que',
  'am-trach', 'am-trach-book', 'duong-trach-classic', 'duong-trach-book'] as const;
const VI_ONLY = ['bat-quai', '64-que', 'duong-trach'];
server.registerTool('doc_tai_lieu', {
  title: 'Đọc tài liệu huyền học',
  description: 'Read a knowledge-base file (Tử Vi, Kinh Dịch, dương trạch, âm trạch). Tử Vi: patterns (34 pattern rules), marriage-compatibility, classic-gusuifu / classic-quanshu / classic-quanji. Kinh Dịch: bat-quai (8 trigrams, Lục Thần, coin casting, Tiểu Lục Nhâm), 64-que (table of the 64 hexagrams), duong-trach (Ni Haixia house-placement method, 8×8 table, kitchen/toilet/living-room rules), kd-07-duong-trach / kd-11-kham-du / kd-10-chiem-doan / kd-08-dich-ly (translated Ni quotes on house placement, feng shui, divination, I Ching principles), que + hexagram number (Ni quotes on one hexagram). Âm trạch (grave feng shui): am-trach (Vietnamese synthesis of the method with sources), am-trach-book + book 1–11 (1 Táng Thư, 2 Hám Long Kinh, 3 Nghi Long Kinh, 4 Táng Pháp Đảo Trượng, 5 Thanh Nang Kinh, 6 Thanh Nang Áo Ngữ, 7 Thanh Ô Kinh, 8 Trình Di, 9 Trương Cư Chính, 10 Trịnh Dụng Tích, 11 Nhân Tử Tu Tri; large files: prefer tim_loi_giang scope am-trach). Dương trạch (house feng shui classics): duong-trach-classic (Vietnamese master synthesis of the 4 classics), duong-trach-book + book 1–4 (1 Hoàng Đế Trạch Kinh, 2 Dương Trạch Thập Thư, 3 Dương Trạch Chỉ Nam, 4 Bát Trạch Tam Yếu; large files: prefer tim_loi_giang scope duong-trach). vi = Vietnamese (default), zh = Chinese original.',
  inputSchema: {
    name: z.enum(REF_FILES),
    hexagram: z.number().int().min(1).max(64).optional().describe('For name = que: hexagram number 1–64'),
    book: z.number().int().min(1).max(11).optional().describe('For name = am-trach-book: book 1–11; for name = duong-trach-book: book 1–4'),
    lang: z.enum(['vi', 'zh']).optional(),
  },
}, async ({ name, hexagram, book, lang }) => {
  try {
    const zh = lang === 'zh' && !VI_ONLY.includes(name) && name !== 'am-trach' && name !== 'duong-trach-classic';
    const root = zh ? REFS : join(REFS, 'vi');
    let p: string;
    if (name === 'que') {
      if (!hexagram) throw new Error('Give hexagram (1–64) with name = que');
      p = join(root, 'kinh-dich', 'que', `${String(hexagram).padStart(2, '0')}.md`);
    } else if (name === 'am-trach') p = join(REFS, 'vi', 'am-trach', 'am-trach.md');
    else if (name === 'am-trach-book') {
      if (!book) throw new Error('Give book (1–11) with name = am-trach-book');
      const dir = join(root, 'am-trach');
      const f = readdirSync(dir).find(n => n.startsWith(`${String(book).padStart(2, '0')}-`));
      if (!f) throw new Error(`No book ${book}`);
      p = join(dir, f);
    } else if (name === 'duong-trach-classic') p = join(REFS, 'vi', 'duong-trach', 'duong-trach.md');
    else if (name === 'duong-trach-book') {
      if (!book) throw new Error('Give book (1–4) with name = duong-trach-book');
      const dir = join(root, 'duong-trach');
      const f = readdirSync(dir).find(n => n.startsWith(`${String(book).padStart(2, '0')}-`));
      if (!f) throw new Error(`No book ${book}`);
      p = join(dir, f);
    } else if (name.startsWith('kd-')) p = join(root, 'kinh-dich', `${name.slice(3)}.md`);
    else if (VI_ONLY.includes(name)) p = join(REFS, 'vi', 'kinh-dich', `${name}.md`);
    else p = join(root, `${name}.md`);
    return text(readFileSync(p, 'utf8'));
  } catch (e) { return fail(e); }
});

server.registerTool('kinh_dich', {
  title: 'Kinh Dịch, bói quẻ, dương trạch, âm trạch',
  description: 'Kinh Dịch, bói quẻ, phong thủy nhà (dương trạch) và hướng mộ (âm trạch). Offline I Ching helper in the Ni Haixia method. action: hexagram (look up by number 1–64, Vietnamese/Chinese/English name, or six lines bottom→top as 0/1 or 6/7/8/9), cast (random coin cast; method ni = six coins, classic = three coins with moving lines; only when the user asks you to cast for them), house (Ni yang-zhai: each family member\'s role + the direction of their room from the centre of the home → hexagram), liuren (Tiểu Lục Nhâm from lunar month, lunar day and clock time or hour branch), trigrams (the 8 trigrams), grave (âm trạch compass check for a grave or house facing: Tứ lộ / Bát lộ Hoàng Tuyền and Long thượng Bát sát, optionally checking water and road directions). Then read doc_tai_lieu duong-trach / que for Ni\'s rules and quotes.',
  inputSchema: {
    action: z.enum(['hexagram', 'cast', 'house', 'liuren', 'trigrams', 'grave']),
    facing: z.string().optional().describe('grave: facing mountain (one of the 24, e.g. "Canh", "庚") or compass degrees, e.g. "255"'),
    sitting: z.string().optional().describe('grave: sitting mountain instead of facing'),
    water_in: z.array(z.string()).optional().describe('grave: directions water arrives from (mountain, degrees, or 8-direction like "Tây Bắc")'),
    water_out: z.array(z.string()).optional().describe('grave: directions water leaves through'),
    roads: z.array(z.string()).optional().describe('grave: directions of roads, gates or drains pointing at the grave'),
    query: z.string().optional().describe('hexagram: number, name (e.g. "Địa Thiên Thái", "地天泰", "Peace") or lines like 100010 / 789687'),
    moving: z.array(z.number().int().min(1).max(6)).optional().describe('hexagram: optional moving line numbers (1–6) to display hào từ, transformed hexagram, and Thể Dụng analysis'),
    method: z.enum(['ni', 'classic']).optional().describe('cast: ni (default) or classic'),
    members: z.array(z.object({
      role: z.string().describe('e.g. "chồng", "vợ", "con trai cả", "con gái út", "father", "eldest son"'),
      direction: z.string().describe('Room direction from the centre of the home, e.g. "Tây Bắc", "Đông", "north-west"'),
      name: z.string().optional(),
    })).optional().describe('house: one entry per person'),
    lunar_month: z.number().int().min(1).max(12).optional(),
    lunar_day: z.number().int().min(1).max(30).optional(),
    time: z.string().optional().describe('liuren: clock time HH:MM'),
    hour_branch: z.number().int().min(0).max(11).optional().describe('liuren: Tý=0 … Hợi=11 (instead of time)'),
    lang: z.enum(['vi', 'en']).optional().describe('default vi'),
  },
}, async (a) => {
  try {
    const lang = a.lang ?? 'vi';
    switch (a.action) {
      case 'hexagram': {
        if (!a.query) throw new Error('query is required');
        const q = a.query.trim();
        if (/^[0-9]{6}$/.test(q)) { const r = fromLines(q); return text(hexagramMarkdown(r.primary, lang, r.moving, r.changed)); }
        const primary = findHexagram(q);
        const moving = a.moving ?? [];
        const changed = moving.length ? changeHex(primary, moving) : undefined;
        return text(hexagramMarkdown(primary, lang, moving, changed));
      }
      case 'cast': { const r = cast(a.method ?? 'ni'); return text(hexagramMarkdown(r.primary, lang, r.moving, r.changed)); }
      case 'house': if (!a.members?.length) throw new Error('members is required'); return text(houseMarkdown(a.members, lang));
      case 'liuren': {
        if (!a.lunar_month || !a.lunar_day) throw new Error('lunar_month and lunar_day are required');
        const hb = a.hour_branch ?? (a.time ? hourBranchOf(a.time) : undefined);
        if (hb === undefined) throw new Error('time or hour_branch is required');
        return text(liuRenMarkdown(a.lunar_month, a.lunar_day, hb, lang));
      }
      case 'trigrams': return text(trigramsMarkdown(lang));
      case 'grave': return text(graveMarkdown({ facing: a.facing, sitting: a.sitting, waterIn: a.water_in, waterOut: a.water_out, roads: a.roads }, lang));
    }
  } catch (e) { return fail(e); }
});

server.registerTool('huong_dan_huyen_hoc', {
  title: 'Hướng dẫn luận giải',
  description: 'The full method and rules for every reading: Tử Vi / vận hạn, Kinh Dịch / bói quẻ, dương trạch (house feng shui) and âm trạch (grave feng shui) — data to collect, reading order, quoting rules, safety rules, licenses. Call once before the first answer.',
  inputSchema: {},
}, async () => {
  try {
    const p = join(ROOT, 'SKILL.md');
    const md = existsSync(p) ? readFileSync(p, 'utf8').replace(/^---[\s\S]*?---\s*/, '') : INSTRUCTIONS;
    return text(`${md}\n\n(In this extension, use the tools instead of the shell commands above: la_so_tu_vi = scripts/ziwei-chart.mjs, bai_luan_tu_vi = scripts/lookup-reading.mjs, tim_loi_giang = grep over references/vi/tianji-ziwei and references/vi/kinh-dich, doc_tai_lieu = references/*.md, kinh_dich = scripts/kinh-dich.mjs.)`);
  } catch (e) { return fail(e); }
});

await server.connect(new StdioServerTransport());
