/**
 * Kinh Dịch (I Ching) engine: 8 trigrams, 64 hexagrams (King Wen order), Ni Haixia's yang-zhai
 * reading (upper trigram = the person's family role, lower trigram = the room's direction),
 * coin casting and Xiao Liu Ren (Tiểu Lục Nhâm). Pure functions, no I/O except crypto for casting.
 */
import { randomInt } from 'node:crypto';
import data from './iching-data.json';

export type Lang = 'vi' | 'en';
type Tri = (typeof data.trigrams)[number];
type Hex = (typeof data.hexagrams)[number];

const TRI: Record<string, Tri> = Object.fromEntries(data.trigrams.map(t => [t.key, t]));
const HEX: Hex[] = data.hexagrams;
const BY_PAIR = new Map(HEX.map(h => [`${h.upper}|${h.lower}`, h]));
const BY_LINES = new Map(data.trigrams.map(t => [t.lines, t]));

/** Strip Vietnamese diacritics and punctuation for loose matching. */
export const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9一-鿿]+/g, ' ').trim();

const ROLE_ALIASES: Record<string, string[]> = {
  qian: ['cha', 'bố', 'chồng', 'father', 'husband', 'dad', 'càn', 'qian', '父', '夫', '乾', 'chu nha nam'],
  kun: ['mẹ', 'má', 'vợ', 'mother', 'wife', 'mom', 'khôn', 'kun', '母', '妻', '坤', 'chu nha nu'],
  zhen: ['con trai ca', 'con trai truong', 'truong nam', 'anh ca', 'eldest son', 'first son', 'chan', 'zhen', '长子', '震'],
  kan: ['con trai thu', 'con trai giua', 'con trai thu hai', 'trung nam', 'middle son', 'second son', 'kham', 'kan', '次子', '中男', '坎'],
  gen: ['con trai ut', 'thieu nam', 'con trai thu ba', 'youngest son', 'third son', 'cấn', 'gen', '少男', '三子', '艮'],
  xun: ['con gai ca', 'con gai truong', 'truong nu', 'chi ca', 'eldest daughter', 'first daughter', 'ton', 'xun', '长女', '巽'],
  li: ['con gai thu', 'con gai giua', 'con gai thu hai', 'trung nu', 'middle daughter', 'second daughter', 'ly', 'li', '次女', '中女', '离'],
  dui: ['con gai ut', 'thieu nu', 'con gai thu ba', 'youngest daughter', 'third daughter', 'doai', 'dui', '少女', '三女', '兑'],
};
const DIR_ALIASES: Record<string, string[]> = {
  kan: ['bac', 'north', 'n', 'chinh bac', '北', '正北'],
  gen: ['dong bac', 'north east', 'northeast', 'ne', '东北'],
  zhen: ['dong', 'east', 'e', 'chinh dong', '东', '正东'],
  xun: ['dong nam', 'south east', 'southeast', 'se', '东南'],
  li: ['nam', 'south', 's', 'chinh nam', '南', '正南'],
  kun: ['tay nam', 'south west', 'southwest', 'sw', '西南'],
  dui: ['tay', 'west', 'w', 'chinh tay', '西', '正西'],
  qian: ['tay bac', 'north west', 'northwest', 'nw', '西北'],
};

function lookup(aliases: Record<string, string[]>, q: string, what: string): string {
  const raw = q.trim().toLowerCase();
  for (const [k, list] of Object.entries(aliases)) if (list.includes(raw)) return k; // exact, with diacritics (Càn ≠ Cấn)
  const n = norm(q);
  for (const [k, list] of Object.entries(aliases)) if (list.some(a => norm(a) === n)) return k;
  // longest alias contained in the phrase wins ("phòng tây bắc" → Tây Bắc, not Bắc)
  let best = '', key = '';
  const padded = ` ${n} `;
  for (const [k, list] of Object.entries(aliases)) for (const a of list) {
    const na = norm(a);
    if (na.length > best.length && (/[\u4e00-\u9fff]/.test(na) ? n.includes(na) : padded.includes(` ${na} `))) { best = na; key = k; }
  }
  if (key) return key;
  throw new Error(`Unknown ${what}: "${q}"`);
}
export const roleKey = (q: string) => lookup(ROLE_ALIASES, q, 'family role');
export const dirKey = (q: string) => lookup(DIR_ALIASES, q, 'direction');

export const hexOf = (upper: string, lower: string) => BY_PAIR.get(`${upper}|${lower}`)!;
export const mutualHex = (h: Hex): Hex => HEX[h.mutual - 1];

/** Find a hexagram by King Wen number, Chinese / Vietnamese / English name, or six lines bottom→top. */
export function findHexagram(q: string | number): Hex {
  if (typeof q === 'number' || /^\d{1,2}$/.test(String(q).trim())) {
    const n = Number(q);
    if (n >= 1 && n <= 64) return HEX[n - 1];
    throw new Error('Hexagram number must be 1–64');
  }
  const s = String(q).trim();
  if (/^[01]{6}$/.test(s)) return fromLines(s).primary;
  if (/^[6-9]{6}$/.test(s)) return fromLines(s).primary;
  const n = norm(s);
  const hit = HEX.find(h => h.zh === s || norm(h.vi) === n || norm(h.en) === n)
    ?? HEX.find(h => norm(h.vi).includes(n) || h.zh.includes(s) || norm(h.en).includes(n));
  if (!hit) throw new Error(`Unknown hexagram: "${q}"`);
  return hit;
}

/**
 * Lines bottom→top. Either 0/1 (yin/yang, Ni's six-coin method: no moving lines)
 * or 6/7/8/9 (classic three-coin values: 6 old yin and 9 old yang are moving).
 */
export function fromLines(lines: string) {
  const s = lines.replace(/[^0-9]/g, '');
  if (s.length !== 6) throw new Error('Give exactly six lines, bottom to top');
  const yang = [...s].map(c => c === '1' || c === '7' || c === '9');
  const moving = [...s].map((c, i) => (c === '6' || c === '9' ? i + 1 : 0)).filter(Boolean);
  const bits = yang.map(b => (b ? '1' : '0')).join('');
  const primary = hexOf(BY_LINES.get(bits.slice(3))!.key, BY_LINES.get(bits.slice(0, 3))!.key);
  let changed: Hex | undefined;
  if (moving.length) {
    const cb = yang.map((b, i) => (moving.includes(i + 1) ? !b : b)).map(b => (b ? '1' : '0')).join('');
    changed = hexOf(BY_LINES.get(cb.slice(3))!.key, BY_LINES.get(cb.slice(0, 3))!.key);
  }
  return { primary, changed, moving, bits };
}

/** Cast with crypto randomness. method 'ni' = six coins (one per line); 'classic' = three coins per line. */
export function cast(method: 'ni' | 'classic' = 'ni') {
  if (method === 'ni') return fromLines(Array.from({ length: 6 }, () => String(randomInt(2))).join(''));
  const lines = Array.from({ length: 6 }, () => String(6 + randomInt(2) + randomInt(2) + randomInt(2))).join('');
  return { ...fromLines(lines), raw: lines };
}

const sym = (h: Hex) => String.fromCodePoint(0x4dc0 + h.n - 1);
const draw = (bits: string, moving: number[] = []) =>
  [...bits].map((b, i) => ({ b, i })).reverse()
    .map(({ b, i }) => `    ${b === '1' ? '━━━━━━━' : '━━━ ━━━'}${moving.includes(i + 1) ? '  ○' : ''}`).join('\n');
export const bitsOf = (h: Hex) => TRI[h.lower].lines + TRI[h.upper].lines;

export function changeHex(primary: Hex, moving: number[]): Hex {
  if (!moving.length) return primary;
  const bits = bitsOf(primary);
  const cb = [...bits].map((b, i) => (moving.includes(i + 1) ? (b === '1' ? '0' : '1') : b)).join('');
  return hexOf(BY_LINES.get(cb.slice(3))!.key, BY_LINES.get(cb.slice(0, 3))!.key);
}
const roleShort = (t: Tri, lang: Lang) => (lang === 'en' ? t.role_en : t.role.split(' (')[0].toLowerCase());
const dirName = (t: Tri, lang: Lang) => (lang === 'en' ? t.direction_en : t.direction);
const triName = (t: Tri, lang: Lang) => (lang === 'en' ? `${t.zh} ${t.en}` : `${t.vi} ${t.symbol} (${t.nature_vi})`);

export interface TheDungAnalysis {
  theTrigram: Tri;
  dungTrigram: Tri;
  thePosition: 'upper' | 'lower';
  relation: string;
  level: string;
  description: string;
}

const ELEMENT_CYCLE: Record<string, { generates: string; overcomes: string }> = {
  Kim: { generates: 'Thủy', overcomes: 'Mộc' },
  Thủy: { generates: 'Mộc', overcomes: 'Hỏa' },
  Mộc: { generates: 'Hỏa', overcomes: 'Thổ' },
  Hỏa: { generates: 'Thổ', overcomes: 'Kim' },
  Thổ: { generates: 'Kim', overcomes: 'Thủy' },
};

export function analyzeTheDung(primary: Hex, moving: number[]): TheDungAnalysis | null {
  if (!moving.length) return null;
  const lowerMoving = moving.some(m => m >= 1 && m <= 3);
  const upperMoving = moving.some(m => m >= 4 && m <= 6);

  let theKey: string;
  let dungKey: string;
  let thePosition: 'upper' | 'lower';

  if (lowerMoving && !upperMoving) {
    thePosition = 'upper';
    theKey = primary.upper;
    dungKey = primary.lower;
  } else if (upperMoving && !lowerMoving) {
    thePosition = 'lower';
    theKey = primary.lower;
    dungKey = primary.upper;
  } else {
    thePosition = 'lower';
    theKey = primary.lower;
    dungKey = primary.upper;
  }

  const the = TRI[theKey];
  const dung = TRI[dungKey];
  const theEl = the.element;
  const dungEl = dung.element;

  let relation = '';
  let level = '';
  let description = '';

  if (ELEMENT_CYCLE[dungEl]?.generates === theEl) {
    relation = 'Dụng sinh Thể';
    level = 'Đại Cát';
    description = `${dung.vi} (${dungEl}) sinh ${the.vi} (${theEl}) — ngoại cảnh phù trợ, việc cầu hanh thông, quý nhân giúp đỡ, tự nhiên mà thành`;
  } else if (ELEMENT_CYCLE[theEl]?.overcomes === dungEl) {
    relation = 'Thể khắc Dụng';
    level = 'Tiểu Cát';
    description = `${the.vi} (${theEl}) khắc ${dung.vi} (${dungEl}) — phải nỗ lực vượt khó, chế ngự ngoại cảnh mới thành công, có lợi nhưng hao tổn công sức`;
  } else if (theEl === dungEl) {
    relation = 'Tỷ hòa';
    level = 'Cát';
    description = `${the.vi} và ${dung.vi} cùng hành ${theEl} — bằng hữu tương trợ, đồng tâm hiệp lực, bình ổn như ý`;
  } else if (ELEMENT_CYCLE[theEl]?.generates === dungEl) {
    relation = 'Thể sinh Dụng';
    level = 'Tiêu hao (Thứ Hung)';
    description = `${the.vi} (${theEl}) sinh ${dung.vi} (${dungEl}) — tổn hao nguyên khí, tốn tài tốn sức vì người khác hoặc hoàn cảnh, vất vả mà thu hoạch ít`;
  } else if (ELEMENT_CYCLE[dungEl]?.overcomes === theEl) {
    relation = 'Dụng khắc Thể';
    level = 'Đại Hung';
    description = `${dung.vi} (${dungEl}) khắc ${the.vi} (${theEl}) — ngoại cảnh chèn ép, gặp trắc trở hiểm nguy, bị tổn thất hoặc cản trở lớn`;
  }

  return { theTrigram: the, dungTrigram: dung, thePosition, relation, level, description };
}

export function hexagramMarkdown(h: Hex, lang: Lang = 'vi', moving: number[] = [], changed?: Hex): string {
  const u = TRI[h.upper], l = TRI[h.lower];
  const vi = lang === 'vi';
  const mut = mutualHex(h);
  const out = [
    `## ${sym(h)} ${vi ? 'Quẻ' : 'Hexagram'} ${h.n}: ${vi ? h.vi : h.en} (${h.zh}${vi ? '' : `, Vietnamese ${h.vi}`})`,
    '',
    '```', draw(bitsOf(h), moving), '```',
    `- ${vi ? 'Thượng quái (ngoại)' : 'Upper trigram'}: ${triName(u, lang)} · ${vi ? 'Hạ quái (nội)' : 'Lower trigram'}: ${triName(l, lang)}`,
    `- ${vi ? 'Ý chính' : 'Gist'}: ${h.meaning}`,
    `- ${vi ? 'Quái từ' : 'Guaci (judgement)'}: ${h.guaci}`,
    `- ${vi ? 'Đại tượng' : 'Xiang (great image)'}: ${h.xiang}`,
    `- ${vi ? 'Hỗ quái (nội hàm diễn biến)' : 'Nuclear hexagram (mutual)'}: ${sym(mut)} ${mut.n}. ${vi ? mut.vi : mut.en} (${mut.zh}) — ${mut.meaning}`,
    `- ${vi ? 'Dương trạch (thầy Nghê)' : 'Yang-zhai reading (Ni Haixia)'}: ${vi
      ? `người có vai **${roleShort(u, lang)}** (${u.vi}) ở phương **${l.direction}** (cung ${l.vi})`
      : `a person in the role of **${roleShort(u, lang)}** (${u.zh}) living in the **${l.direction_en}** room (${l.zh} sector)`}`,
  ];
  if (moving.length) {
    out.push(`- ${vi ? 'Hào động' : 'Moving lines'}: Hào ${moving.join(', ')} → ${vi ? 'quẻ biến' : 'changes to'} ${sym(changed!)} ${changed!.n}. ${vi ? changed!.vi : changed!.en} (${changed!.zh})`);
    for (const m of moving) {
      if (m >= 1 && m <= 6 && h.yaoci[m - 1]) {
        out.push(`  - ${h.yaoci[m - 1]}`);
      }
    }
    if (moving.length === 6 && (h.n === 1 || h.n === 2) && h.yaoci[6]) {
      out.push(`  - ${h.yaoci[6]}`);
    }

    const td = analyzeTheDung(h, moving);
    if (td) {
      if (vi) {
        out.push(
          `- **Phân tích Thể Dụng (Mai Hoa Dịch Số)**:`,
          `  - Thể (bản thân / việc ta cầu): **${td.theTrigram.vi}** ${td.theTrigram.symbol} (hành ${td.theTrigram.element}) [${td.thePosition === 'upper' ? 'Thượng quái' : 'Hạ quái'}]`,
          `  - Dụng (ngoại cảnh / đối phương): **${td.dungTrigram.vi}** ${td.dungTrigram.symbol} (hành ${td.dungTrigram.element}) [${td.thePosition === 'upper' ? 'Hạ quái' : 'Thượng quái'}]`,
          `  - Quan hệ: **${td.relation}** (${td.level}) — ${td.description}`,
          ...(moving.some(m => m <= 3) && moving.some(m => m >= 4) ? ['  - Lưu ý: Mai Hoa dùng một hào động; ở đây có hào động cả hai quái nên Thể Dụng chỉ để tham khảo.'] : []),
        );
      } else {
        out.push(
          `- **Body and Use (Thể Dụng - Plum Blossom)**:`,
          `  - Body (Self): **${td.theTrigram.en}** ${td.theTrigram.symbol} (${td.theTrigram.element}) [${td.thePosition} trigram]`,
          `  - Use (Circumstances): **${td.dungTrigram.en}** ${td.dungTrigram.symbol} (${td.dungTrigram.element}) [${td.thePosition === 'upper' ? 'lower' : 'upper'} trigram]`,
          `  - Relationship: **${td.relation}** (${td.level}) — ${td.description}`,
          ...(moving.some(m => m <= 3) && moving.some(m => m >= 4) ? ['  - Note: Plum Blossom uses a single moving line; with moving lines in both trigrams this is only indicative.'] : []),
        );
      }
    }
  }
  out.push(`- ${vi ? 'Lời giảng của thầy Nghê về quẻ này' : "Ni Haixia's lecture quotes"}: \`references/vi/kinh-dich/que/${String(h.n).padStart(2, '0')}.md\`${vi ? ' (hoặc công cụ tìm trích dẫn với tên quẻ)' : ' (or search quotes by the Chinese name)'}`);
  return out.join('\n');
}

export interface Member { role: string; direction: string; name?: string }

export function houseMarkdown(members: Member[], lang: Lang = 'vi'): string {
  const vi = lang === 'vi';
  const rows = members.map(m => {
    const r = TRI[roleKey(m.role)], d = TRI[dirKey(m.direction)];
    const h = hexOf(r.key, d.key);
    const ok = r.key === d.key;
    return `| ${m.name ?? roleShort(r, lang)} | ${roleShort(r, lang)} (${vi ? r.vi : r.zh}) | ${dirName(d, lang)} (${vi ? d.vi : d.zh}) | ${sym(h)} ${h.n}. ${vi ? h.vi : h.en} (${h.zh}) | ${ok ? (vi ? '✅ đúng vị (danh = vị)' : '✅ own position') : h.meaning} |`;
  });
  const head = vi
    ? '| Người | Vai | Phương phòng | Quẻ | Ghi chú |\n|---|---|---|---|---|'
    : '| Person | Role | Room direction | Hexagram | Note |\n|---|---|---|---|---|';
  const note = vi
    ? '\nCách đọc (thầy Nghê): thượng quái là người, hạ quái là phương của phòng tính từ tâm nhà. Danh = vị thì gia hòa; vị = danh thì vạn sự hưng. Đối chiếu quy tắc trong `references/vi/kinh-dich/duong-trach.md` (bếp, phòng khách, nhà vệ sinh, chính Bắc, phân kim) và lời giảng từng quẻ trong `que/NN.md`. Dương trạch chỉ là một phần ba; đây là xu hướng, không phải lời phán chắc chắn.'
    : '\nHow to read it (Ni Haixia): the upper trigram is the person, the lower trigram is the room\'s direction from the centre of the home. Role matching position brings family harmony. Check the rules in `references/vi/kinh-dich/duong-trach.md` (kitchen, living room, toilet, due north, compass boundary lines) and each hexagram\'s quotes in `que/NN.md`. Housing is about one third of the picture; these are tendencies, not verdicts.';
  return `${vi ? '## Dương trạch: người × phương' : '## Yang-zhai: person × direction'}\n\n${head}\n${rows.join('\n')}\n${note}`;
}

export const LIUREN = [
  { vi: 'Đại An', zh: '大安', en: 'Great Peace', meaning_vi: 'Tốt, khoảng một tuần thấy kết quả', meaning_en: 'Good; result in about a week' },
  { vi: 'Lưu Liên', zh: '留连', en: 'Lingering', meaning_vi: 'Việc còn đình trệ, chưa tiến', meaning_en: 'Stalled; no progress yet' },
  { vi: 'Tốc Hỷ', zh: '速喜', en: 'Swift Joy', meaning_vi: 'Có kết quả ngay', meaning_en: 'Quick result' },
  { vi: 'Xích Khẩu', zh: '赤口', en: 'Red Mouth', meaning_vi: 'Người thứ ba xen vào, tiểu nhân, thị phi', meaning_en: 'A third party, gossip or disputes' },
  { vi: 'Tiểu Cát', zh: '小吉', en: 'Small Luck', meaning_vi: 'Tốt, khoảng hai tuần', meaning_en: 'Good; about two weeks' },
  { vi: 'Không Vong', zh: '空亡', en: 'Void', meaning_vi: 'Không thành, có thể dứt niệm', meaning_en: 'Comes to nothing; let it go' },
];

/** Xiao Liu Ren: lunar month 1–12, lunar day 1–30, hour branch 0 (Tý) … 11 (Hợi). */
export function liuRen(month: number, day: number, hourBranch: number) {
  if (!(month >= 1 && month <= 12 && day >= 1 && day <= 30 && hourBranch >= 0 && hourBranch <= 11)) throw new Error('Need lunar month 1–12, lunar day 1–30, hour branch 0–11');
  const m = (month - 1) % 6, d = (m + day - 1) % 6, h = (d + hourBranch) % 6;
  return { month: LIUREN[m], day: LIUREN[d], hour: LIUREN[h] };
}

const BRANCH_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const hourBranchOf = (hhmm: string) => {
  const [h, mi] = hhmm.split(':').map(Number);
  if (!(h >= 0 && h < 24 && mi >= 0 && mi < 60)) throw new Error('Time must be HH:MM');
  return Math.floor(((h + 1) % 24) / 2);
};

export function liuRenMarkdown(month: number, day: number, hourBranch: number, lang: Lang = 'vi'): string {
  const r = liuRen(month, day, hourBranch);
  const vi = lang === 'vi';
  const name = (x: (typeof LIUREN)[number]) => (vi ? `${x.vi} (${x.zh})` : `${x.en} (${x.zh}, ${x.vi})`);
  return [
    vi ? '## Tiểu Lục Nhâm' : '## Xiao Liu Ren (finger reckoning)',
    '',
    `- ${vi ? 'Tháng' : 'Lunar month'} ${month} → ${name(r.month)}`,
    `- ${vi ? 'Ngày' : 'Lunar day'} ${day} → ${name(r.day)}`,
    `- ${vi ? 'Giờ' : 'Hour'} ${BRANCH_VI[hourBranch]} → **${name(r.hour)}**: ${vi ? r.hour.meaning_vi : r.hour.meaning_en}`,
    '',
    vi
      ? 'Thầy Nghê: dùng ngay lúc bỗng có linh cảm về một việc cụ thể; đã hỏi thì nghe theo, đừng khởi lại lần hai cho cùng một niệm. Chỉ để tham khảo.'
      : 'Ni Haixia: use it the moment a hunch about one specific matter arises; once asked, follow it and do not re-ask the same question. For reference only.',
  ].join('\n');
}

export function trigramsMarkdown(lang: Lang = 'vi'): string {
  const vi = lang === 'vi';
  const rows = data.trigrams.map(t => `| ${t.symbol} | ${vi ? t.vi : t.en} (${t.zh}) | ${vi ? t.nature_vi : t.en} | ${t.element} | ${dirName(t, lang)} | ${roleShort(t, lang)} |`);
  return [vi ? '## Bát Quái (Hậu Thiên)' : '## Eight trigrams (Later Heaven)', '',
    vi ? '| | Quẻ | Tượng | Ngũ hành | Phương | Vai trong nhà |' : '| | Trigram | Image | Element (vi) | Direction | Family role |',
    '|---|---|---|---|---|---|', ...rows].join('\n');
}
