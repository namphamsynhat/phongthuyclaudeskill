/**
 * Kinh Dịch helper (offline). Examples:
 *   node kinh-dich.mjs --que 11                       # hexagram by number, name or lines
 *   node kinh-dich.mjs --que "Địa Thiên Thái"
 *   node kinh-dich.mjs --lines 100010                 # bottom→top, 1 = yang (or 6/7/8/9 with moving lines)
 *   node kinh-dich.mjs --cast [--method ni|classic]   # random cast
 *   node kinh-dich.mjs --house "chồng:Tây Bắc,vợ:Tây Bắc,con trai cả:Đông"
 *   node kinh-dich.mjs --liuren 4/5 --time 20:00      # lunar month/day + clock time (or --hour-branch 10)
 *   node kinh-dich.mjs --trigrams
 *   node kinh-dich.mjs --grave Canh --water-in Khôn --water-out "Tây Bắc"   # âm trạch: Hoàng Tuyền, Bát sát (or --sit Giáp, or degrees: --grave 255)
 *   add --lang en for English (default vi)
 */
import { graveMarkdown } from './grave';
import { cast, changeHex, findHexagram, fromLines, hexagramMarkdown, hourBranchOf, houseMarkdown, liuRenMarkdown, trigramsMarkdown } from './iching';

const a: Record<string, string> = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const k = argv[i].slice(2), v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) a[k] = 'true'; else { a[k] = v; i++; }
}
const lang = a.lang === 'en' ? 'en' : 'vi';
try {
  if (a.que) {
    const h = findHexagram(a.que);
    const moving = a.moving ? a.moving.split(',').map(Number).filter(n => n >= 1 && n <= 6) : [];
    const changed = moving.length ? changeHex(h, moving) : undefined;
    console.log(hexagramMarkdown(h, lang, moving, changed));
  }
  else if (a.lines) { const r = fromLines(a.lines); console.log(hexagramMarkdown(r.primary, lang, r.moving, r.changed)); }
  else if (a.cast) { const r = cast(a.method === 'classic' ? 'classic' : 'ni'); console.log(hexagramMarkdown(r.primary, lang, r.moving, r.changed)); }
  else if (a.house) console.log(houseMarkdown(a.house.split(',').map(p => { const [role, direction] = p.split(':'); return { role: role.trim(), direction: (direction ?? '').trim() }; }), lang));
  else if (a.liuren) {
    const [m, d] = a.liuren.split(/[\/-]/).map(Number);
    const hb = a['hour-branch'] !== undefined ? Number(a['hour-branch']) : hourBranchOf(a.time ?? '');
    console.log(liuRenMarkdown(m, d, hb, lang));
  } else if (a.grave || a.sit) {
    const list = (k: string) => (a[k] && a[k] !== 'true' ? a[k].split(',').map(x => x.trim()) : undefined);
    console.log(graveMarkdown({ facing: a.grave && a.grave !== 'true' ? a.grave : undefined, sitting: a.sit, waterIn: list('water-in'), waterOut: list('water-out'), roads: list('road') }, lang));
  } else if (a.trigrams) console.log(trigramsMarkdown(lang));
  else { console.error('Usage: node kinh-dich.mjs --que N|name [--moving 1,3] | --lines 100010 | --cast | --house "role:direction,..." | --liuren M/D --time HH:MM | --grave <hướng>|--sit <toạ> [--water-in X,Y] [--water-out X] [--road X] | --trigrams [--lang en|vi]'); process.exit(1); }
} catch (e) { console.error(`Error: ${(e as Error).message}`); process.exit(1); }
