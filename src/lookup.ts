/**
 * Offline lookup in the Zi Wei Dou Shu reading dataset v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0).
 * Uses Node's built-in zstd decoder (Node 22.15+ / 23.8+); falls back to the `zstd` command on older Node.
 * No Python needed.
 */
import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import zlib from 'node:zlib';
import type { Readable } from 'node:stream';

export const TOPICS = ['overview', 'personality', 'love', 'career', 'wealth', 'health', 'family',
  'children', 'move', 'friends', 'home', 'spirit', 'parents'] as const;
export type Topic = typeof TOPICS[number];

const NAMES: Record<'zh' | 'en' | 'vi', string[]> = {
  zh: ['命格总论', '性格', '感情婚姻', '事业', '财运', '健康', '六亲', '子女', '迁移', '交友', '田宅', '福德', '父母'],
  en: ['Overview', 'Personality', 'Love & marriage', 'Career', 'Wealth', 'Health', 'Family', 'Children',
    'Travel & relocation', 'Friends', 'Home & property', 'Inner life & fortune', 'Parents'],
  vi: ['Tổng quan', 'Tính cách', 'Tình cảm & hôn nhân', 'Sự nghiệp', 'Tài lộc', 'Sức khỏe', 'Lục thân',
    'Con cái', 'Di chuyển', 'Bạn bè', 'Nhà cửa', 'Phúc đức', 'Cha mẹ'],
};

const NOTE = {
  en: 'Source text below is Chinese. Translate the parts you use into English for the user; keep Ni Haixia quotes in Chinese with an English translation and their episode/timestamp.',
  vi: 'Nguyên văn bên dưới là tiếng Trung. Hãy dịch những phần dùng tới sang tiếng Việt cho người dùng; giữ nguyên văn lời Nghê Hải Hạ bằng tiếng Trung kèm bản dịch và tập/thời điểm trích dẫn.',
};
const FOOTER = {
  en: "Source: Zi Wei Dou Shu open interpretation dataset v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0; Ni Haixia quotes inside are CC BY-NC-SA 4.0). Natal chart only, no yearly forecast; generated 2026-10-15, so its 'current decade' assumes that date.",
  vi: "Nguồn: bộ dữ liệu luận giải Tử Vi mở v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0; lời trích Nghê Hải Hạ theo CC BY-NC-SA 4.0). Chỉ luận lá số gốc, không có lưu niên; tạo ngày 2026-10-15 nên phần 'đại hạn hiện tại' tính theo ngày đó.",
};

export interface Reading { key: string; c: Record<string, string>; [k: string]: unknown }

const KEY_RE = /^(\d{4})-(\d{2})-(\d{2})-(\d{1,2})-(male|female)$/;

export function yearFile(dataDir: string, year: number): string {
  return join(dataDir, `year-${year}.jsonl.zst`);
}

/** Stream through one year file and return the record for `key`, or null. Stops reading once found. */
export function findRecord(dataDir: string, key: string): Promise<Reading | null> {
  const m = KEY_RE.exec(key);
  if (!m) return Promise.reject(new Error(`Bad key "${key}". Expected YYYY-MM-DD-H-male|female, e.g. 1990-05-17-7-male.`));
  const year = Number(m[1]);
  if (year < 1950 || year > 2026) return Promise.reject(new Error('The dataset covers births from 1950 to 2026 only.'));
  const file = yearFile(dataDir, year);
  if (!existsSync(file)) return Promise.reject(new Error(`Missing data file ${file}. This offline package should contain data/year-1950 … year-2026.jsonl.zst.`));

  const needle = Buffer.from(`{"k": "${key}"`);
  const needle2 = Buffer.from(`{"k":"${key}"`);
  const { stream, stop } = openDecompressed(file);
  return new Promise((resolve, reject) => {
    let carry: Buffer = Buffer.alloc(0);
    let done = false;
    const finish = (v: Reading | null, err?: Error) => {
      if (done) return;
      done = true;
      stop();
      err ? reject(err) : resolve(v);
    };
    stream.on('data', (chunk: Buffer) => {
      if (done) return;
      const buf: Buffer = carry.length ? Buffer.concat([carry, chunk]) : chunk;
      let start = 0;
      for (;;) {
        // jump straight to the next possible match instead of scanning every line
        let hit = buf.indexOf(needle, start);
        if (hit < 0) hit = buf.indexOf(needle2, start);
        if (hit < 0) break;
        if (hit !== 0 && buf[hit - 1] !== 10) { start = hit + 1; continue; }
        const nl = buf.indexOf(10, hit);
        if (nl < 0) { start = hit; break; }
        try { finish(JSON.parse(buf.subarray(hit, nl).toString('utf8')) as Reading); }
        catch (e) { finish(null, e as Error); }
        return;
      }
      // keep the tail (possible partial line) for the next chunk
      const lastNl = buf.lastIndexOf(10);
      carry = Buffer.from(buf.subarray(Math.max(start, lastNl + 1)));
    });
    stream.on('end', () => finish(null));
    stream.on('error', (e: Error) => finish(null, e));
  });
}

function openDecompressed(file: string): { stream: Readable; stop: () => void } {
  const z = zlib as unknown as { createZstdDecompress?: (o?: object) => import('node:stream').Transform; constants: Record<string, number> };
  if (typeof z.createZstdDecompress === 'function') {
    const src = createReadStream(file, { highWaterMark: 1 << 20 });
    const dec = z.createZstdDecompress({ params: { [z.constants.ZSTD_d_windowLogMax]: 27 } });
    src.pipe(dec);
    return { stream: dec, stop: () => { src.destroy(); dec.destroy(); } };
  }
  const probe = spawnSync('zstd', ['--version']);
  if (probe.status !== 0) {
    throw new Error(`Node ${process.version} has no built-in zstd and the zstd command is not installed. Use Node 22.15 or newer, or install zstd.`);
  }
  const child = spawn('zstd', ['-dc', '--long=27', file], { stdio: ['ignore', 'pipe', 'ignore'] });
  return { stream: child.stdout, stop: () => { child.kill(); } };
}

/** Look up a reading and format the chosen topics as Markdown. */
export async function readingMarkdown(dataDir: string, key: string, topics: string[] | 'all' = ['overview'], lang: 'en' | 'vi' = 'vi'): Promise<string> {
  const list = topics === 'all' ? [...TOPICS] : topics;
  for (const t of list) if (!(TOPICS as readonly string[]).includes(t)) throw new Error(`Unknown topic "${t}". Choose from: ${TOPICS.join(', ')}`);
  const rec = await findRecord(dataDir, key);
  if (!rec) throw new Error(`Key ${key} not found (check the chart date, hour branch and gender).`);
  const out = [`> ${NOTE[lang]}`];
  for (const t of list) {
    const i = (TOPICS as readonly string[]).indexOf(t);
    out.push('', `# ${NAMES[lang][i]} (${NAMES.zh[i]})`, '', rec.c[t] ?? '');
  }
  out.push('', '---', FOOTER[lang]);
  return out.join('\n');
}
