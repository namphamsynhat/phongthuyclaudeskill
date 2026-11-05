/**
 * Âm trạch compass checks (offline): 24 mountains, Tứ lộ / Bát lộ Hoàng Tuyền (四路・八路黃泉)
 * and Long thượng Bát sát (龍上八煞) for a grave (or house) facing direction.
 *
 * Rules (classical mnemonics):
 *   四路黃泉  庚丁坤上是黃泉，乙丙須防巽水先，甲癸向中憂見艮，辛壬水路怕當乾。
 *   八路黃泉  the reverse: 坤向忌庚丁，巽向忌乙丙，艮向忌甲癸，乾向忌辛壬。
 *   八煞      坎龍坤兔震山猴，巽雞乾馬兌蛇頭，艮虎離豬為八煞，墓宅逢之一時休。
 * Common reading: water ARRIVING from the Hoàng Tuyền sector is harmful (sát nhân hoàng tuyền);
 * water LEAVING through it is called "cứu bần hoàng tuyền" by the Yang Gong school (黃泉本是救貧方).
 */
type Lang = 'vi' | 'en';

// Index 0 = Nhâm (337.5°–352.5°), clockwise, 15° each; centre = 345 + 15·i (mod 360).
const MOUNTAINS = [
  { vi: 'Nhâm', zh: '壬', py: 'ren', kind: 'can' }, { vi: 'Tý', zh: '子', py: 'zi', kind: 'chi' }, { vi: 'Quý', zh: '癸', py: 'gui', kind: 'can' },
  { vi: 'Sửu', zh: '丑', py: 'chou', kind: 'chi' }, { vi: 'Cấn', zh: '艮', py: 'gen', kind: 'quai' }, { vi: 'Dần', zh: '寅', py: 'yin', kind: 'chi' },
  { vi: 'Giáp', zh: '甲', py: 'jia', kind: 'can' }, { vi: 'Mão', zh: '卯', py: 'mao', kind: 'chi' }, { vi: 'Ất', zh: '乙', py: 'yi', kind: 'can' },
  { vi: 'Thìn', zh: '辰', py: 'chen', kind: 'chi' }, { vi: 'Tốn', zh: '巽', py: 'xun', kind: 'quai' }, { vi: 'Tỵ', zh: '巳', py: 'si', kind: 'chi' },
  { vi: 'Bính', zh: '丙', py: 'bing', kind: 'can' }, { vi: 'Ngọ', zh: '午', py: 'wu', kind: 'chi' }, { vi: 'Đinh', zh: '丁', py: 'ding', kind: 'can' },
  { vi: 'Mùi', zh: '未', py: 'wei', kind: 'chi' }, { vi: 'Khôn', zh: '坤', py: 'kun', kind: 'quai' }, { vi: 'Thân', zh: '申', py: 'shen', kind: 'chi' },
  { vi: 'Canh', zh: '庚', py: 'geng', kind: 'can' }, { vi: 'Dậu', zh: '酉', py: 'you', kind: 'chi' }, { vi: 'Tân', zh: '辛', py: 'xin', kind: 'can' },
  { vi: 'Tuất', zh: '戌', py: 'xu', kind: 'chi' }, { vi: 'Càn', zh: '乾', py: 'qian', kind: 'quai' }, { vi: 'Hợi', zh: '亥', py: 'hai', kind: 'chi' },
] as const;

// Eight palaces (Hậu Thiên), each 3 mountains; index of the first mountain.
const PALACES = [
  { vi: 'Khảm', zh: '坎', dir: 'Bắc', en: 'North', start: 0 }, { vi: 'Cấn', zh: '艮', dir: 'Đông Bắc', en: 'North-east', start: 3 },
  { vi: 'Chấn', zh: '震', dir: 'Đông', en: 'East', start: 6 }, { vi: 'Tốn', zh: '巽', dir: 'Đông Nam', en: 'South-east', start: 9 },
  { vi: 'Ly', zh: '離', dir: 'Nam', en: 'South', start: 12 }, { vi: 'Khôn', zh: '坤', dir: 'Tây Nam', en: 'South-west', start: 15 },
  { vi: 'Đoài', zh: '兌', dir: 'Tây', en: 'West', start: 18 }, { vi: 'Càn', zh: '乾', dir: 'Tây Bắc', en: 'North-west', start: 21 },
];
const palaceOf = (i: number) => PALACES[Math.floor(i / 3)];

// Hoàng Tuyền: facing mountain → harmful water mountains.
const HT: Record<string, string[]> = {
  Canh: ['Khôn'], Đinh: ['Khôn'], Ất: ['Tốn'], Bính: ['Tốn'], Giáp: ['Cấn'], Quý: ['Cấn'], Tân: ['Càn'], Nhâm: ['Càn'],
  Khôn: ['Canh', 'Đinh'], Tốn: ['Ất', 'Bính'], Cấn: ['Giáp', 'Quý'], Càn: ['Tân', 'Nhâm'],
};
// Song sơn (雙山) pairing used by the Tam Hợp school: each branch shares a palace with its stem / trigram neighbour.
const SONG_SON: Record<string, string> = { Tý: 'Nhâm', Sửu: 'Quý', Dần: 'Cấn', Mão: 'Giáp', Thìn: 'Ất', Tỵ: 'Tốn', Ngọ: 'Bính', Mùi: 'Đinh', Thân: 'Khôn', Dậu: 'Canh', Tuất: 'Tân', Hợi: 'Càn' };
// Bát sát: sitting palace → harmful branch.
const BAT_SAT: Record<string, { chi: string; animal: string; en: string }> = {
  Khảm: { chi: 'Thìn', animal: 'Rồng', en: 'Dragon' }, Khôn: { chi: 'Mão', animal: 'Mèo/Thỏ', en: 'Rabbit' }, Chấn: { chi: 'Thân', animal: 'Khỉ', en: 'Monkey' },
  Tốn: { chi: 'Dậu', animal: 'Gà', en: 'Rooster' }, Càn: { chi: 'Ngọ', animal: 'Ngựa', en: 'Horse' }, Đoài: { chi: 'Tỵ', animal: 'Rắn', en: 'Snake' },
  Cấn: { chi: 'Dần', animal: 'Hổ', en: 'Tiger' }, Ly: { chi: 'Hợi', animal: 'Lợn', en: 'Pig' },
};

const norm = (s: string) => s.normalize('NFC').toLowerCase().trim();
const strip = (s: string) => norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
const DIR8: Record<string, number> = {}; // 8-direction aliases → palace index
PALACES.forEach((p, i) => { for (const k of [p.dir, p.en, p.vi, p.zh]) { DIR8[norm(k)] = i; DIR8[strip(k).replace(/[\s-]/g, '')] = i; } });
Object.assign(DIR8, { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7, '北': 0, '東北': 1, '东北': 1, '東': 2, '东': 2, '東南': 3, '东南': 3, '南': 4, '西南': 5, '西': 6, '西北': 7 });

const fmt = (d: number) => `${Number.isInteger(d) ? d : d.toFixed(1)}°`;
const range = (i: number) => { const c = (345 + 15 * i) % 360; return `${fmt((c - 7.5 + 360) % 360)}–${fmt((c + 7.5) % 360)}`; };
export const mountainIndexOfDegree = (deg: number) => Math.floor((((deg % 360) + 360 + 22.5) % 360) / 15);

/** One mountain from a name (Vietnamese with diacritics, Chinese, pinyin) or a compass degree. */
export function parseMountain(q: string): number {
  const s = norm(q).replace(/°$/, '');
  if (/^-?\d+(\.\d+)?$/.test(s)) return mountainIndexOfDegree(Number(s));
  const byVi = MOUNTAINS.findIndex(m => norm(m.vi) === s);
  if (byVi >= 0) return byVi;
  const byZh = MOUNTAINS.findIndex(m => m.zh === s);
  if (byZh >= 0) return byZh;
  const a = strip(s);
  if (a === 'ty') throw new Error('"Ty" là Tý (子, Bắc) hay Tỵ (巳, Đông Nam)? Viết có dấu, chữ Hán, hoặc số độ.');
  const byAscii = MOUNTAINS.findIndex(m => strip(m.vi) === a || m.py === a);
  if (byAscii >= 0) return byAscii;
  if (DIR8[s] !== undefined || DIR8[a.replace(/[\s-]/g, '')] !== undefined) {
    const p = PALACES[DIR8[s] ?? DIR8[a.replace(/[\s-]/g, '')]];
    const three = [0, 1, 2].map(k => MOUNTAINS[p.start + k].vi).join(', ');
    throw new Error(`"${q}" là cả cung ${p.vi} (${p.dir}) gồm ba sơn ${three}; cần sơn cụ thể hoặc số độ la bàn.`);
  }
  throw new Error(`Không nhận ra sơn "${q}". Dùng một trong 24 sơn (Nhâm, Tý, Quý, Sửu, Cấn, Dần, Giáp, Mão, Ất, Thìn, Tốn, Tỵ, Bính, Ngọ, Đinh, Mùi, Khôn, Thân, Canh, Dậu, Tân, Tuất, Càn, Hợi), chữ Hán, hoặc số độ.`);
}

/** A water/road direction: one mountain, a degree, or an 8-direction (expands to 3 mountains). */
export function parseSector(q: string): number[] {
  const s = norm(q), a = strip(q).replace(/[\s-]/g, '');
  const p = DIR8[s] ?? DIR8[a];
  if (p !== undefined && !MOUNTAINS.some(m => norm(m.vi) === s || m.zh === s)) return [0, 1, 2].map(k => PALACES[p].start + k);
  return [parseMountain(q)];
}

export interface GraveInput { facing?: string; sitting?: string; waterIn?: string[]; waterOut?: string[]; roads?: string[] }

export function graveCheck(inp: GraveInput) {
  if (!inp.facing && !inp.sitting) throw new Error('Cần hướng (--grave) hoặc toạ (--sit).');
  const f = inp.facing ? parseMountain(inp.facing) : (parseMountain(inp.sitting!) + 12) % 24;
  const t = (f + 12) % 24;
  const fm = MOUNTAINS[f], tm = MOUNTAINS[t], tp = palaceOf(t);
  let ht = HT[fm.vi] ?? [], viaSongSon: string | undefined;
  if (!ht.length && SONG_SON[fm.vi]) { viaSongSon = SONG_SON[fm.vi]; ht = HT[viaSongSon] ?? []; }
  const htIdx = ht.map(n => MOUNTAINS.findIndex(m => m.vi === n));
  const bs = BAT_SAT[tp.vi], bsIdx = MOUNTAINS.findIndex(m => m.vi === bs.chi);
  const check = (list: string[] | undefined, kind: 'in' | 'out' | 'road') => (list ?? []).filter(Boolean).map(q => {
    const idx = parseSector(q);
    return { query: q, mountains: idx.map(i => MOUNTAINS[i].vi), hoangTuyen: idx.some(i => htIdx.includes(i)), batSat: idx.includes(bsIdx), kind };
  });
  const deg = inp.facing && /^-?\d+(\.\d+)?°?$/.test(inp.facing.trim()) ? Number(inp.facing.trim().replace('°', '')) : undefined;
  const nearBoundary = deg !== undefined && (() => { const x = ((deg % 360) + 360 + 22.5) % 15; return Math.min(x, 15 - x) <= 1.5; })();
  return {
    deg, nearBoundary,
    facing: { idx: f, ...fm, range: range(f), palace: palaceOf(f) }, sitting: { idx: t, ...tm, range: range(t), palace: tp },
    hoangTuyen: { rule: ht.length === 2 ? 'Bát lộ' : ht.length ? 'Tứ lộ' : '', mountains: htIdx.map(i => ({ ...MOUNTAINS[i], range: range(i) })), viaSongSon },
    batSat: { ...bs, range: range(bsIdx), sittingPalace: tp.vi },
    checks: [...check(inp.waterIn, 'in'), ...check(inp.waterOut, 'out'), ...check(inp.roads, 'road')],
  };
}

export function graveMarkdown(inp: GraveInput, lang: Lang = 'vi'): string {
  const r = graveCheck(inp), vi = lang === 'vi';
  const mt = (m: { vi: string; zh: string; range: string }) => `**${m.vi}** (${m.zh}, ${m.range})`;
  const out: string[] = [vi ? '## Âm trạch: Hoàng Tuyền và Bát sát' : '## Grave compass check: Huang Quan and Eight Killings', ''];
  out.push(vi
    ? `- Hướng: ${mt(r.facing)} — cung ${r.facing.palace.vi} (${r.facing.palace.dir})\n- Toạ: ${mt(r.sitting)} — cung ${r.sitting.palace.vi} (${r.sitting.palace.dir})`
    : `- Facing: ${mt(r.facing)} — ${r.facing.palace.zh} palace (${r.facing.palace.en})\n- Sitting: ${mt(r.sitting)} — ${r.sitting.palace.zh} palace (${r.sitting.palace.en})`);
  if (r.nearBoundary) out.push(vi ? `- ⚠ ${fmt(r.deg!)} nằm sát ranh giới hai sơn (trong 1,5°): phạm "không vong / xuất quái", nên đo lại hoặc chỉnh hướng vào giữa sơn.` : `- ⚠ ${fmt(r.deg!)} is within 1.5° of a mountain boundary (void line); re-measure or adjust.`);
  out.push('', vi ? '### Hoàng Tuyền (黃泉)' : '### Huang Quan (黃泉)');
  if (r.hoangTuyen.mountains.length) {
    const list = r.hoangTuyen.mountains.map(mt).join(vi ? ' và ' : ' and ');
    out.push(vi
      ? `${r.hoangTuyen.viaSongSon ? `Hướng ${r.facing.vi} là địa chi, khẩu quyết gốc không xét; theo song sơn (phái Tam Hợp) tính như hướng **${r.hoangTuyen.viaSongSon}**. ` : ''}${r.hoangTuyen.rule} Hoàng Tuyền: phương kỵ là ${list}.\n\n- Nước **chảy đến** (lai thủy) từ phương này, hoặc đường đi, cổng, rãnh đâm vào từ phương này: hung ("sát nhân hoàng tuyền").\n- Nước **chảy đi** (khứ thủy) ra phương này: phái Dương Công gọi là "cứu bần hoàng tuyền", không kỵ, có sách cho là tốt ("hoàng tuyền bản thị cứu bần phương, lai giả hung hề khứ giả cát"). Các phái khác nhau ở điểm này.`
      : `${r.hoangTuyen.viaSongSon ? `${r.facing.vi} is a branch; the original rhyme does not cover it, so the Tam He double-mountain pairing treats it as ${r.hoangTuyen.viaSongSon}. ` : ''}${r.hoangTuyen.rule === 'Bát lộ' ? 'Eight-road' : 'Four-road'} Huang Quan sector: ${list}.\n\n- Water (or a road, gate or drain) ARRIVING from this sector is harmful.\n- Water LEAVING through it is called "poverty-relieving Huang Quan" by the Yang Gong school and is not avoided; schools differ here.`);
  } else out.push(vi ? 'Hướng này không có Hoàng Tuyền theo khẩu quyết tứ lộ / bát lộ.' : 'No Huang Quan sector for this facing under the four/eight-road rhyme.');
  out.push('', vi ? '### Long thượng Bát sát (龍上八煞)' : '### Eight Killings on the dragon (龍上八煞)');
  out.push(vi
    ? `Toạ cung ${r.sitting.palace.vi} kỵ **${r.batSat.chi}** (con ${r.batSat.animal}, ${r.batSat.range}): không lập hướng ${r.batSat.chi}, tránh nước đến, đường đâm, cửa mở về phương ${r.batSat.chi}; chọn ngày táng cũng tránh ngày, năm ${r.batSat.chi} (khẩu quyết: "Khảm long Khôn thố Chấn sơn hầu, Tốn kê Càn mã Đoài xà đầu, Cấn hổ Ly trư vi bát sát, mộ trạch phùng chi nhất thời hưu").`
    : `A ${r.sitting.palace.zh} sitting avoids **${r.batSat.chi}** (${r.batSat.en}, ${r.batSat.range}): no facing, arriving water, road or door from that branch, and no burial on ${r.batSat.en} days or years.`);
  if (r.checks.length) {
    out.push('', vi ? '### Kiểm tra nước, đường' : '### Water and road check', '',
      vi ? '| Loại | Phương | Sơn | Hoàng Tuyền | Bát sát | Nhận xét |\n|---|---|---|---|---|---|' : '| Kind | Given | Mountains | Huang Quan | Eight Killings | Note |\n|---|---|---|---|---|---|');
    for (const c of r.checks) {
      const kind = vi ? { in: 'Nước đến', out: 'Nước đi', road: 'Đường/cổng' }[c.kind] : { in: 'Water in', out: 'Water out', road: 'Road/gate' }[c.kind];
      let note = vi ? 'Không phạm' : 'Clear';
      if (c.hoangTuyen && c.kind === 'out') note = vi ? 'Khứ thủy qua Hoàng Tuyền: phái Dương Công cho là cứu bần, không kỵ' : 'Leaving through Huang Quan: accepted by the Yang Gong school';
      else if (c.hoangTuyen) note = vi ? '**Phạm Hoàng Tuyền**' : '**Hits Huang Quan**';
      if (c.batSat && c.kind !== 'out') note += vi ? '; **phạm Bát sát**' : '; **hits Eight Killings**';
      else if (c.batSat) note += vi ? '; nước đi qua phương Bát sát (ít sách kỵ)' : '; leaves through the Eight Killings branch (rarely avoided)';
      out.push(`| ${kind} | ${c.query} | ${c.mountains.join(', ')} | ${c.hoangTuyen ? '✗' : '–'} | ${c.batSat ? '✗' : '–'} | ${note} |`);
    }
  }
  out.push('', vi
    ? '> Đây là khẩu quyết lý khí truyền thống, các phái giải khác nhau; cổ thư (Táng Thư) đặt hình thế trên phương vị. Đo bằng la bàn đặt ở giữa mộ, tránh vật kim loại; nếu hướng nằm sát ranh hai sơn (±1,5°) thì cần đo lại. Xem thêm `references/vi/am-trach/am-trach.md` mục 6.'
    : '> Traditional compass rhymes; schools differ, and the classics rank landform above direction. Measure from the centre of the grave away from metal; re-measure if within ±1.5° of a mountain boundary.');
  return out.join('\n');
}
