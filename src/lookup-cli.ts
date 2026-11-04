/**
 * node lookup-reading.mjs --key 1990-05-17-7-male [--topic love,career|all] [--lang en|vi] [--data DIR]
 * Offline: reads ../data/year-YYYY.jsonl.zst next to this script (or --data / $ZIWEI_DATA_DIR).
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readingMarkdown, TOPICS } from './lookup';

const args: Record<string, string> = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const k = argv[i].slice(2); const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) args[k] = 'true'; else { args[k] = v; i++; }
}
if (!args.key) {
  console.error(`Usage: node lookup-reading.mjs --key YYYY-MM-DD-H-male|female [--topic ${TOPICS.join(',')}|all] [--lang en|vi]`);
  process.exit(1);
}
const here = dirname(fileURLToPath(import.meta.url));
const dataDir = args.data ?? process.env.ZIWEI_DATA_DIR ?? join(here, '..', 'data');
const topics = args.topic === 'all' ? 'all' : (args.topic ?? 'overview').split(',').map(s => s.trim());
readingMarkdown(dataDir, args.key, topics, args.lang === 'vi' ? 'vi' : 'en')
  .then(md => console.log(md))
  .catch(e => { console.error(`Error: ${e.message}`); process.exit(1); });
