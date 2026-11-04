/**
 * Zi Wei Dou Shu MCP server (stdio). Works fully offline.
 * Layout (relative to this file): ../data/year-*.jsonl.zst, ../references/, ../SKILL.md
 * Override the root with $ZIWEI_HOME.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readingMarkdown, TOPICS } from './lookup';

const ROOT = resolve(process.env.ZIWEI_HOME ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
const DATA = join(ROOT, 'data');
const REFS = join(ROOT, 'references');

const INSTRUCTIONS = `Zi Wei Dou Shu (Tử Vi Đẩu Số, Purple Star Astrology) reader in the Ni Haixia (倪海厦《天纪》) tradition.
Workflow: 1) ask for birth date, clock time, gender and birthplace; 2) call ziwei_chart (never compute the chart yourself);
3) if the chart shows a dataset key (births 1950–2026), call ziwei_reading for the topics asked; 4) check claims with
ziwei_search_quotes / ziwei_reference; 5) answer in English or Vietnamese (Vietnamese if the user writes Vietnamese).
Call ziwei_guide once for the full method and rules. Never invent Ni Haixia quotes; never predict death, divorce or illness as certain.`;

const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });
const fail = (e: unknown) => ({ content: [{ type: 'text' as const, text: `Error: ${(e as Error).message ?? e}` }], isError: true });

// The chart engine is loaded on first use so the other tools start instantly.
let chartMod: Promise<typeof import('./chart')> | null = null;
const chart = () => (chartMod ??= import('./chart'));

const server = new McpServer({ name: 'ziwei-doushu', version: '1.0.0' }, { instructions: INSTRUCTIONS });

server.registerTool('ziwei_chart', {
  title: 'Draw a Zi Wei Dou Shu chart',
  description: 'Compute a natal Zi Wei Dou Shu chart (12 palaces, stars and brightness, Four Transformations, patterns, decade and yearly luck) with true solar time. Returns Markdown in English or Vietnamese, plus a dataset key for ziwei_reading. Give either date (Gregorian) or lunar date, and either time (clock HH:MM) or hour_branch.',
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
    lang: z.enum(['en', 'vi']).optional().describe('Output language (default en)'),
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

server.registerTool('ziwei_find_city', {
  title: 'Look up a birthplace',
  description: 'Find the longitude and standard UTC offset of a city (Vietnamese and major world cities, Chinese cities and districts).',
  inputSchema: { query: z.string() },
}, async ({ query }) => {
  try { return text((await chart()).renderChart({ 'find-city': query })); } catch (e) { return fail(e); }
});

server.registerTool('ziwei_reading', {
  title: 'Get the pre-written reading for a chart',
  description: `Fetch the source-checked natal reading (Chinese, ~30,000 characters over 13 topics) from the offline dataset v4.0 for births 1950–2026. Use the dataset key printed by ziwei_chart. Topics: ${TOPICS.join(', ')}. Translate and condense; do not paste.`,
  inputSchema: {
    key: z.string().describe('Dataset key from ziwei_chart, e.g. 1990-05-17-7-male'),
    topics: z.array(z.enum(TOPICS)).optional().describe('Topics to return (default overview). Ask only for what you need.'),
    lang: z.enum(['en', 'vi']).optional(),
  },
}, async ({ key, topics, lang }) => {
  try { return text(await readingMarkdown(DATA, key, topics?.length ? topics : ['overview'], lang ?? 'en')); } catch (e) { return fail(e); }
});

server.registerTool('ziwei_search_quotes', {
  title: 'Search Ni Haixia quotes',
  description: 'Search the 1,848 timestamped Ni Haixia (Nghê Hải Hạ) quotes on Zi Wei Dou Shu. Vietnamese files contain the Vietnamese translation and the original Chinese on each line, so you can search in either language (e.g. "Hóa Kỵ", "Phu Thê", "化忌", "福德"). All words must appear in the line.',
  inputSchema: {
    query: z.string().describe('Words to find; all must appear (space separated)'),
    lang: z.enum(['vi', 'zh']).optional().describe('vi = Vietnamese + Chinese lines (default), zh = Chinese original only'),
    limit: z.number().int().min(1).max(100).optional(),
  },
}, async ({ query, lang, limit }) => {
  try {
    const dir = join(REFS, ...(lang === 'zh' ? ['tianji-ziwei'] : ['vi', 'tianji-ziwei']));
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits: string[] = [];
    for (const f of readdirSync(dir).filter(n => n.endsWith('.md') && !['README.md', 'LICENSE.md', 'TOPICS.md'].includes(n)).sort()) {
      for (const line of readFileSync(join(dir, f), 'utf8').split('\n')) {
        if (!line.startsWith('- [')) continue;
        const low = line.toLowerCase();
        if (words.every(w => low.includes(w))) hits.push(`[${f.replace('.md', '')}] ${line.slice(2)}`);
      }
    }
    const n = limit ?? 20;
    return text(hits.length ? `${hits.length} match(es)${hits.length > n ? `, showing ${n}` : ''}:\n\n${hits.slice(0, n).join('\n')}` : 'No matching quote. Try fewer or different words, or the other language.');
  } catch (e) { return fail(e); }
});

const REF_FILES = ['patterns', 'marriage-compatibility', 'classic-gusuifu', 'classic-quanshu', 'classic-quanji'] as const;
server.registerTool('ziwei_reference', {
  title: 'Read a knowledge-base file',
  description: 'Read a knowledge-base file: patterns (34 pattern rules), marriage-compatibility (compatibility method, main stars in the Spouse palace), classic-gusuifu / classic-quanshu / classic-quanji (classic excerpts). vi = Vietnamese translation (default), zh = Chinese original.',
  inputSchema: { name: z.enum(REF_FILES), lang: z.enum(['vi', 'zh']).optional() },
}, async ({ name, lang }) => {
  try {
    const p = lang === 'zh' ? join(REFS, `${name}.md`) : join(REFS, 'vi', `${name}.md`);
    return text(readFileSync(p, 'utf8'));
  } catch (e) { return fail(e); }
});

server.registerTool('ziwei_guide', {
  title: 'How to give a reading',
  description: 'The full method and rules for a Zi Wei Dou Shu reading (data to collect, reading order, quoting rules, safety rules, licenses). Call once before the first reading.',
  inputSchema: {},
}, async () => {
  try {
    const p = join(ROOT, 'SKILL.md');
    const md = existsSync(p) ? readFileSync(p, 'utf8').replace(/^---[\s\S]*?---\s*/, '') : INSTRUCTIONS;
    return text(`${md}\n\n(In this extension, use the tools instead of the shell commands above: ziwei_chart = scripts/ziwei-chart.mjs, ziwei_reading = scripts/lookup-reading.mjs, ziwei_search_quotes = grep over references/vi/tianji-ziwei, ziwei_reference = references/*.md.)`);
  } catch (e) { return fail(e); }
});

await server.connect(new StdioServerTransport());
