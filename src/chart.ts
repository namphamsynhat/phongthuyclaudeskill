/**
 * Chart renderer — wraps the open-source engine from github.com/Renhuai123/ziwei-doushu (MIT)
 * and prints a chart as Markdown (English or Vietnamese) or JSON, for Claude to read and interpret.
 *
 * Usage:
 *   node ziwei-chart.mjs --date 1990-05-17 --time 14:30 --gender male [--city "Hà Nội" | --longitude 105.85]
 *        [--utc-offset 420] [--hour-branch 0-11] [--year 2026] [--lang en|vi]
 *        [--leap split|next-month|prev-month|origin-month] [--late-zishi next-day|current-day] [--json]
 *   node ziwei-chart.mjs --lunar 1990-04-23 [--leap-month] --time 14:30 --gender male ...
 *   node ziwei-chart.mjs --find-city "Da Nang"
 */
import { generateChart, type LunarMonthPolicy } from './ziwei/algorithm';
import { detectPatterns } from './ziwei/patterns';
import { getLiuNianSiHua, getDaXianSiHua } from './ziwei/sihua';
import { calculateTrueSolarTime, resolveZiweiDayOffset, shiftGregorianDate, formatTrueSolarClock, type LateZishiRule } from './ziwei/true-solar-time';
import { PROVINCES } from './ziwei/cities';
import { isChinaDST } from './ziwei/dst-cn';
import { lunarToSolar } from './ziwei/lunar-solar';
import { STAR_DESCRIPTIONS } from './ziwei/constants';
import type { Palace, Star, ZiweiChart } from './ziwei/types';
import { tr, STAR_VI } from './patterns-vi';
import { type Lang, term, label, brightness, sihua, sihuaShort, stem, branch, ganzhi, LEVEL, findWorldCity, WORLD_CITIES } from './i18n';

const SHICHEN_RANGE = ['23:00–00:59', '01:00–02:59', '03:00–04:59', '05:00–06:59', '07:00–08:59', '09:00–10:59',
  '11:00–12:59', '13:00–14:59', '15:00–16:59', '17:00–18:59', '19:00–20:59', '21:00–22:59'];

// UI strings: [en, vi]
const T = {
  title: ['Zi Wei Dou Shu chart', 'Lá số Tử Vi Đẩu Số'],
  solar: ['Gregorian date', 'Dương lịch'],
  gender: ['Gender', 'Giới tính'],
  male: ['male', 'nam'], female: ['female', 'nữ'],
  place: ['Birthplace', 'Nơi sinh'],
  east: ['longitude', 'kinh độ'],
  time: ['Time', 'Giờ sinh'],
  hourOf: ['hour', 'giờ'],
  lunar: ['Lunar date', 'Âm lịch'],
  leapM: ['leap ', 'nhuận '],
  yearGZ: ['birth year', 'năm'],
  pillars: ['Four pillars (solar terms)', 'Tứ trụ (theo tiết khí)'],
  bureau: ['Five-element bureau', 'Cục'],
  mingZhu: ['Life ruler', 'Mệnh chủ'], shenZhu: ['Body ruler', 'Thân chủ'],
  ming: ['Life palace', 'Cung Mệnh'], shen: ['Body palace in', 'Thân cư'],
  palaces: ['Twelve palaces', 'Mười hai cung'],
  legend: ['In brackets: star brightness. Birth-year transformations are marked with Hua.', 'Trong ngoặc: độ sáng của sao. Tứ Hóa năm sinh ghi bằng Hóa.'],
  thPalace: ['Palace', 'Cung'], thGZ: ['Stem-branch', 'Can chi'], thMajor: ['Main stars', 'Chính tinh'],
  thLucky: ['Auspicious', 'Cát tinh'], thSha: ['Malefic', 'Sát tinh'], thMinor: ['Minor stars', 'Phụ tinh khác'], thDx: ['Decade (age)', 'Đại hạn (tuổi)'],
  empty: ['Empty', 'Vô chính diệu'], borrow: ['borrows from opposite', 'mượn cung đối'],
  sanfang: ['Life palace triad (三方四正)', 'Tam phương tứ chính của Mệnh'],
  starMeaning: ['Life-palace main stars (Chinese keywords)', 'Chính tinh cung Mệnh'],
  patterns: ['Patterns detected', 'Cách cục nhận diện được'],
  none: ['No notable pattern', 'Không có cách cục nổi bật'],
  srcText: ['Source text (Chinese)', 'Lời luận'],
  req: ['Required', 'Điều kiện'], bonus: ['Strengthened by', 'Tăng lực'], broken: ['Weakened by', 'Phá cách'], source: ['Source', 'Xuất xứ'],
  decades: ['Decade luck (大限)', 'Đại hạn'],
  thAge: ['Age (East Asian)', 'Tuổi (tuổi mụ)'], thStem: ['Stem', 'Can'], thDxSh: ['Decade transformations (Lu/Quan/Ke/Ji)', 'Tứ Hóa đại hạn (Lộc/Quyền/Khoa/Kỵ)'],
  year: ['Year', 'Năm'], age: ['age', 'tuổi mụ'],
  lnMing: ['Yearly Life palace falls on natal', 'Mệnh lưu niên rơi vào cung'],
  lnSihua: ['Yearly transformations', 'Tứ Hóa lưu niên'],
  inNatal: ['is in natal palace', 'nằm ở cung'],
  inDecade: ['Current decade', 'Đại hạn hiện tại'],
  footer: ['Engine: Renhuai123/ziwei-doushu (MIT), built on iztro. Brightness table: 《紫微斗数全书》; leap months split mid-month.',
    'Engine: Renhuai123/ziwei-doushu (MIT), dựa trên iztro. Bảng độ sáng theo 《紫微斗数全书》; tháng nhuận chia giữa tháng.'],
  key: ['Dataset key', 'Khóa dữ liệu'],
  keyHint: ['get the 13-topic pre-written reading with', 'lấy bài luận 13 chủ đề bằng'],
  keyNone: ['none (dataset covers 1950–2026 with leap policy split)', 'không có (dữ liệu chỉ có 1950–2026, quy tắc tháng nhuận split)'],
  noCorr: ['not corrected (no birthplace)', 'chưa hiệu chỉnh (không có nơi sinh)'],
  direct: ['hour branch given directly, no true-solar-time correction', 'nhập thẳng giờ, không hiệu chỉnh giờ mặt trời thật'],
  clock: ['clock', 'giờ đồng hồ'], trueSolar: ['true solar time', 'giờ mặt trời thật'],
  lonCorr: ['longitude', 'kinh độ'], eot: ['equation of time', 'phương trình thời gian'], min: ['min', 'phút'],
  lunarConv: ['Lunar date converted to Gregorian', 'Âm lịch đã đổi sang dương lịch'],
  dayShift: ['Chart date moved to', 'Ngày lập lá số chuyển thành'],
  dayShiftWhy: ['(late Zi hour / true solar time rule)', '(quy tắc giờ Tý muộn / giờ mặt trời thật)'],
  boundary: ['⚠️ Birth time is within 10 minutes of an hour boundary; the hour may be wrong. Ask the user to confirm, or compare with the neighbouring hour.',
    '⚠️ Giờ sinh cách ranh giới giờ chưa tới 10 phút, có thể sai giờ. Hãy hỏi lại người dùng hoặc so với lá số giờ kế bên.'],
  dst: ['⚠️ This date is in China daylight saving time (1986–1991). If the user gave the clock time of that day, subtract 1 hour first (the engine does not). Ask the user.',
    '⚠️ Ngày này thuộc giờ mùa hè Trung Quốc (1986–1991). Nếu người dùng đưa giờ đồng hồ lúc đó thì trừ 1 tiếng trước (engine không tự trừ). Hãy hỏi lại.'],
  cityWorld: ['standard UTC offset', 'múi giờ chuẩn'],
} as const;

let LANG: Lang = 'en';
const t = (k: keyof typeof T) => T[k][LANG === 'vi' ? 1 : 0];

export function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = 'true';
    else { out[key] = next; i++; }
  }
  return out;
}

function die(msg: string): never {
  throw new Error(msg);
}

function findChinaCities(q: string) {
  const hits: { province: string; city: string; longitude: number }[] = [];
  for (const p of PROVINCES) for (const c of p.cities) {
    if (c.name === q || c.name.includes(q) || p.name.includes(q) || q.includes(c.name)) hits.push({ province: p.name, city: c.name, longitude: c.longitude });
  }
  hits.sort((a, b) => Number(b.city === q) - Number(a.city === q));
  return hits;
}

function starLabel(s: Star): string {
  let x = term(s.name, LANG);
  if (s.brightnessRaw) x += ` (${brightness(s.brightnessRaw, LANG)})`;
  if (s.siHua) x += ` [${sihua(s.siHua, LANG)}]`;
  return x;
}
const palaceName = (zh: string) => term(zh.endsWith('宫') || zh === '命宫' ? zh : zh, LANG);
const majorsOf = (p: Palace) => p.stars.filter(s => s.type === 'major');

function palaceRow(p: Palace, chart: ZiweiChart): string {
  const major = majorsOf(p).map(starLabel).join(', ')
    || (p.borrowedStars?.length ? `${t('empty')} (${t('borrow')} ${palaceName(p.borrowedFromName ?? '')}: ${p.borrowedStars.map(s => term(s, LANG)).join(', ')})` : t('empty'));
  const lucky = p.stars.filter(s => s.type === 'lucky').map(starLabel).join(', ');
  const sha = p.stars.filter(s => s.type === 'sha').map(starLabel).join(', ');
  const minor = p.stars.filter(s => s.type === 'minor').map(s => term(s.name, LANG)).join(', ');
  const tags = [p.branch === chart.mingGongBranch ? term('命宫', LANG) : '', p.isShenGong ? term('身宫', LANG) : ''].filter(Boolean).join(' / ');
  const age = p.daXianAge ? `${p.daXianAge[0]}–${p.daXianAge[1]}` : '';
  return `| ${palaceName(p.name)} (${p.name})${tags ? ` **[${tags}]**` : ''} | ${stem(p.stem, LANG)} ${branch(p.branch, LANG)} | ${major} | ${lucky} | ${sha} | ${minor} | ${age} |`;
}

/** Render a chart from CLI-style options (date, time, gender, city, …). Returns Markdown or JSON text; throws on bad input. */
export function renderChart(args: Record<string, string>): string {
  LANG = args.lang === 'en' ? 'en' : 'vi';  // Vietnamese is the default

  if (args['find-city']) {
    const res: string[] = [];
    const w = findWorldCity(args['find-city']);
    if (w) res.push(`${w.name}\t${w.lon}\tUTC offset ${w.utc} min`);
    for (const h of findChinaCities(args['find-city']).slice(0, 20)) res.push(`${h.province} ${h.city}\t${h.longitude}\tUTC offset 480 min`);
    if (!res.length) res.push('Not found. Pass --longitude (east positive) and --utc-offset (minutes) instead. Known non-China cities: ' + WORLD_CITIES.map(c => c.name).join(', '));
    return res.join('\n');
  }

  const notes: string[] = [];
  let date: string;
  if (args.lunar) {
    const lm = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(args.lunar) ?? die('lunar date must be YYYY-MM-DD');
    const s = lunarToSolar(Number(lm[1]), Number(lm[2]), Number(lm[3]), args['leap-month'] === 'true');
    if (!s) die(`lunar date does not exist: ${args.lunar}${args['leap-month'] === 'true' ? ' (leap month)' : ''}`);
    date = `${s.year}-${String(s.month).padStart(2, '0')}-${String(s.day).padStart(2, '0')}`;
    notes.push(`${t('lunarConv')}: ${args.lunar}${args['leap-month'] === 'true' ? ` (${t('leapM').trim()})` : ''} → ${date}.`);
  } else {
    date = args.date ?? die('need --date YYYY-MM-DD (Gregorian) or --lunar YYYY-MM-DD');
  }
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date) ?? die('date must be YYYY-MM-DD');
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const gender = (args.gender ?? die('need --gender male|female')) as 'male' | 'female';
  if (gender !== 'male' && gender !== 'female') die('--gender must be male or female');
  const lateZishi = (args['late-zishi'] ?? 'next-day') as LateZishiRule;
  const leap = (args.leap ?? 'split') as LunarMonthPolicy;
  const targetYear = Number(args.year ?? new Date().getFullYear());

  let longitude: number | undefined = args.longitude !== undefined ? Number(args.longitude) : undefined;
  let utcOffset = args['utc-offset'] !== undefined ? Number(args['utc-offset']) : undefined;
  let place = '';
  if (args.city && longitude === undefined) {
    const w = findWorldCity(args.city);
    if (w) {
      longitude = w.lon; place = w.name;
      if (utcOffset === undefined) utcOffset = w.utc;
    } else {
      const hits = findChinaCities(args.city);
      if (!hits.length) die(`city "${args.city}" not found; use --longitude and --utc-offset`);
      longitude = hits[0].longitude; place = `${hits[0].province} ${hits[0].city}`;
    }
  }

  let chartDate = { year, month, day };
  let hourBranch: number;
  let solarText = t('noCorr');

  if (args['hour-branch'] !== undefined) {
    hourBranch = Number(args['hour-branch']);
    solarText = t('direct');
  } else {
    const tm = /^(\d{1,2}):(\d{2})$/.exec(args.time ?? die('need --time HH:MM (clock time) or --hour-branch 0-11')) ?? die('time must be HH:MM');
    const clockHour = Number(tm[1]); const clockMinute = Number(tm[2]);
    const solar = calculateTrueSolarTime({ year, month, day, clockHour, clockMinute, longitude, utcOffsetMinutes: utcOffset });
    if (!solar.dateValid) die(`date does not exist: ${date}`);
    hourBranch = solar.branch;
    const offset = resolveZiweiDayOffset(solar, lateZishi);
    chartDate = shiftGregorianDate({ year, month, day }, offset);
    solarText = solar.corrected
      ? `${t('clock')} ${args.time} → ${t('trueSolar')} ${formatTrueSolarClock(solar)} (${t('lonCorr')} ${solar.longitudeCorrectionMinutes.toFixed(1)} ${t('min')}, ${t('eot')} ${solar.equationOfTimeMinutes.toFixed(1)} ${t('min')})`
      : `${t('clock')} ${args.time}, ${t('noCorr')}`;
    if (offset !== 0) notes.push(`${t('dayShift')} ${chartDate.year}-${chartDate.month}-${chartDate.day} ${t('dayShiftWhy')}.`);
    const minsIntoBranch = ((solar.normalizedMinutes - 60 + 1440) % 120);
    if (minsIntoBranch < 10 || minsIntoBranch > 110) notes.push(t('boundary'));
    if (isChinaDST(year, month, day) && (utcOffset === undefined || utcOffset === 480)) notes.push(t('dst'));
  }

  const chart = generateChart({ ...chartDate, hour: hourBranch, gender, longitude }, { leapMonth: leap });
  const patterns = detectPatterns(chart);
  const ln = getLiuNianSiHua(targetYear);
  const lnBranch = ((targetYear - 4) % 12 + 12) % 12;
  const lnPalace = chart.palaces.find(p => p.branch === lnBranch);
  const lnAge = targetYear - chart.lunarInfo.lunarYear + 1;
  const dxIdx = chart.daXians.findIndex(d => lnAge >= d.startAge && lnAge <= d.endAge);
  const dx = dxIdx >= 0 ? chart.daXians[dxIdx] : undefined;
  const dxSihua = dxIdx >= 0 ? getDaXianSiHua(chart, dxIdx, targetYear) : null;

  const pad = (n: number) => String(n).padStart(2, '0');
  const datasetKey = `${chartDate.year}-${pad(chartDate.month)}-${pad(chartDate.day)}-${hourBranch}-${gender}`;
  const inDataset = chartDate.year >= 1950 && chartDate.year <= 2026 && leap === 'split';

  if (args.json === 'true') {
    return (JSON.stringify({ datasetKey: inDataset ? datasetKey : null, input: { date, time: args.time, gender, longitude, utcOffset, place, chartDate, hourBranch }, notes, chart, patterns,
      targetYear, liuNian: { stem: ln.stemName, branch: lnBranch, palace: lnPalace?.name, sihua: ln.transforms, nominalAge: lnAge },
      daXianOfTargetYear: dx ? { ...dx, sihua: dxSihua?.transforms } : null }, null, 2));
  }

  const L = chart.lunarInfo;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch)!;
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch)!;
  const sh4 = (tr: Record<string, string>) => (['禄', '权', '科', '忌'] as const).map(k => `${term(tr[k], LANG)} ${sihuaShort(k, LANG)}`).join(' · ');
  const out: string[] = [];
  out.push(`# ${t('title')}`, '');
  out.push(`- ${t('solar')}: ${date} · ${t('gender')}: ${t(gender)} (${term(chart.yinYangGender ?? '', LANG)})${place ? ` · ${t('place')}: ${place}` : ''}${longitude !== undefined ? ` (${t('east')} ${longitude}${utcOffset !== undefined ? `, UTC${utcOffset >= 0 ? '+' : ''}${utcOffset / 60}` : ''})` : ''}`);
  out.push(`- ${t('time')}: ${solarText} → **${t('hourOf')} ${branch(hourBranch, LANG)}** (${SHICHEN_RANGE[hourBranch]})`);
  out.push(`- ${t('lunar')}: ${L.lunarYear}-${L.isLeapMonth ? t('leapM') : ''}${Math.abs(L.lunarMonth)}-${L.lunarDay} · ${t('yearGZ')} ${stem(L.yearStem, LANG)} ${branch(L.yearBranch, LANG)}`);
  if (L.fourPillars) out.push(`- ${t('pillars')}: ${L.fourPillars.map(g => ganzhi(g, LANG)).join(' | ')}`);
  out.push(`- ${t('bureau')}: ${label(chart.wuxingJuName, LANG)} · ${t('mingZhu')}: ${term(chart.mingZhu ?? '', LANG)} · ${t('shenZhu')}: ${term(chart.shenZhu ?? '', LANG)}`);
  out.push(`- ${t('ming')}: ${stem(ming.stem, LANG)} ${branch(ming.branch, LANG)} · ${t('shen')}: ${palaceName(shen.name)} (${branch(shen.branch, LANG)})`);
  for (const n of notes) out.push(`- ${n}`);
  out.push(inDataset
    ? `- ${t('key')}: \`${datasetKey}\` (${t('keyHint')} \`python3 scripts/lookup_reading.py --key ${datasetKey} --lang ${LANG}\`)`
    : `- ${t('key')}: ${t('keyNone')}`);
  out.push('', `## ${t('palaces')}`, '', t('legend'), '');
  out.push(`| ${t('thPalace')} | ${t('thGZ')} | ${t('thMajor')} | ${t('thLucky')} | ${t('thSha')} | ${t('thMinor')} | ${t('thDx')} |`);
  out.push('|---|---|---|---|---|---|---|');
  for (let i = 0; i < 12; i++) {
    const b = (chart.mingGongBranch - i + 12) % 12;
    const p = chart.palaces.find(x => x.branch === b);
    if (p) out.push(palaceRow(p, chart));
  }
  out.push('', `## ${t('sanfang')}`);
  for (const o of [0, 4, 8, 6]) {
    const p = chart.palaces.find(x => x.branch === (chart.mingGongBranch + o) % 12)!;
    out.push(`- ${palaceName(p.name)}: ${majorsOf(p).map(starLabel).join(', ') || t('empty')}`);
  }
  out.push('', `## ${t('starMeaning')}`);
  const list = majorsOf(ming).length ? majorsOf(ming).map(s => s.name) : (ming.borrowedStars ?? []);
  for (const s of list) {
    const d = STAR_DESCRIPTIONS[s];
    const dv = LANG === 'vi' ? STAR_VI[s] : undefined;
    if (dv) out.push(`- ${label(s, LANG)}: ${dv.keywords}; ${dv.nature}; hành ${dv.element}`);
    else if (d) out.push(`- ${label(s, LANG)}: ${d.keywords}; ${d.nature}; ${d.element}`);
  }
  out.push('', `## ${t('patterns')} (${patterns.length})`);
  if (!patterns.length) out.push(`- ${t('none')}`);
  for (const p of patterns) {
    out.push(`- **${label(p.name, LANG)}** — ${LEVEL[p.level][LANG === 'vi' ? 0 : 1]}`);
    const X = (z: string) => (LANG === 'vi' ? tr(z) : z);
    const J = LANG === 'vi' ? '; ' : '；';
    out.push(`  - ${t('srcText')}: ${X(p.description)}`);
    if (p.conditions?.required?.length) out.push(`  - ${t('req')}: ${p.conditions.required.map(X).join(J)}`);
    if (p.conditions?.bonus?.length) out.push(`  - ${t('bonus')}: ${p.conditions.bonus.map(X).join(J)}`);
    if (p.conditions?.breaking?.length) out.push(`  - ${t('broken')}: ${p.conditions.breaking.map(X).join(J)}`);
    if (p.source) out.push(`  - ${t('source')}: ${p.source}`);
  }
  out.push('', `## ${t('decades')}`);
  out.push(`| ${t('thAge')} | ${t('thPalace')} | ${t('thStem')} | ${t('thDxSh')} |`);
  out.push('|---|---|---|---|');
  chart.daXians.forEach((d, i) => {
    const s = getDaXianSiHua(chart, i);
    out.push(`| ${d.startAge}–${d.endAge}${i === dxIdx ? ' ◀' : ''} | ${palaceName(d.palaceName)} | ${s ? stem(s.stemIndex, LANG) : ''} | ${s ? sh4(s.transforms) : ''} |`);
  });
  out.push('', `## ${t('year')} ${targetYear} (${stem(ln.stemIndex, LANG)} ${branch(lnBranch, LANG)}, ${t('age')} ${lnAge})`);
  out.push(`- ${t('lnMing')} **${palaceName(lnPalace?.name ?? '')}** (${branch(lnBranch, LANG)}): ${lnPalace ? (majorsOf(lnPalace).map(starLabel).join(', ') || t('empty')) : ''}`);
  out.push(`- ${t('lnSihua')}: ${sh4(ln.transforms)}`);
  for (const k of ['禄', '忌'] as const) {
    const star = ln.transforms[k];
    const p = chart.palaces.find(x => x.stars.some(s => s.name === star));
    if (p) out.push(`  - ${sihua(k, LANG)}: ${term(star, LANG)} ${t('inNatal')} ${palaceName(p.name)}`);
  }
  if (dx) out.push(`- ${t('inDecade')}: ${dx.startAge}–${dx.endAge}, ${palaceName(dx.palaceName)}${dxSihua ? `; ${sh4(dxSihua.transforms)}` : ''}`);
  out.push('', `_${t('footer')}_`);
  return out.join('\n');
}
