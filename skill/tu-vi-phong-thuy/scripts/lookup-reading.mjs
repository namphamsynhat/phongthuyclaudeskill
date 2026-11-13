// src/lookup-cli.ts
import { dirname, join as join2 } from "node:path";
import { fileURLToPath } from "node:url";

// src/lookup.ts
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import zlib from "node:zlib";
var TOPICS = [
  "overview",
  "personality",
  "love",
  "career",
  "wealth",
  "health",
  "family",
  "children",
  "move",
  "friends",
  "home",
  "spirit",
  "parents"
];
var NAMES = {
  zh: ["\u547D\u683C\u603B\u8BBA", "\u6027\u683C", "\u611F\u60C5\u5A5A\u59FB", "\u4E8B\u4E1A", "\u8D22\u8FD0", "\u5065\u5EB7", "\u516D\u4EB2", "\u5B50\u5973", "\u8FC1\u79FB", "\u4EA4\u53CB", "\u7530\u5B85", "\u798F\u5FB7", "\u7236\u6BCD"],
  en: [
    "Overview",
    "Personality",
    "Love & marriage",
    "Career",
    "Wealth",
    "Health",
    "Family",
    "Children",
    "Travel & relocation",
    "Friends",
    "Home & property",
    "Inner life & fortune",
    "Parents"
  ],
  vi: [
    "T\u1ED5ng quan",
    "T\xEDnh c\xE1ch",
    "T\xECnh c\u1EA3m & h\xF4n nh\xE2n",
    "S\u1EF1 nghi\u1EC7p",
    "T\xE0i l\u1ED9c",
    "S\u1EE9c kh\u1ECFe",
    "L\u1EE5c th\xE2n",
    "Con c\xE1i",
    "Di chuy\u1EC3n",
    "B\u1EA1n b\xE8",
    "Nh\xE0 c\u1EEDa",
    "Ph\xFAc \u0111\u1EE9c",
    "Cha m\u1EB9"
  ]
};
var NOTE = {
  en: "Source text below is Chinese. Translate the parts you use into English for the user; keep Ni Haixia quotes in Chinese with an English translation and their episode/timestamp.",
  vi: "Nguy\xEAn v\u0103n b\xEAn d\u01B0\u1EDBi l\xE0 ti\u1EBFng Trung. H\xE3y d\u1ECBch nh\u1EEFng ph\u1EA7n d\xF9ng t\u1EDBi sang ti\u1EBFng Vi\u1EC7t cho ng\u01B0\u1EDDi d\xF9ng; gi\u1EEF nguy\xEAn v\u0103n l\u1EDDi Ngh\xEA H\u1EA3i H\u1EA1 b\u1EB1ng ti\u1EBFng Trung k\xE8m b\u1EA3n d\u1ECBch v\xE0 t\u1EADp/th\u1EDDi \u0111i\u1EC3m tr\xEDch d\u1EABn."
};
var FOOTER = {
  en: "Source: Zi Wei Dou Shu open interpretation dataset v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0; Ni Haixia quotes inside are CC BY-NC-SA 4.0). Natal chart only, no yearly forecast; generated 2026-10-15, so its 'current decade' assumes that date.",
  vi: "Ngu\u1ED3n: b\u1ED9 d\u1EEF li\u1EC7u lu\u1EADn gi\u1EA3i T\u1EED Vi m\u1EDF v4.0 (Renhuai123/ziwei-doushu, CC BY 4.0; l\u1EDDi tr\xEDch Ngh\xEA H\u1EA3i H\u1EA1 theo CC BY-NC-SA 4.0). Ch\u1EC9 lu\u1EADn l\xE1 s\u1ED1 g\u1ED1c, kh\xF4ng c\xF3 l\u01B0u ni\xEAn; t\u1EA1o ng\xE0y 2026-10-15 n\xEAn ph\u1EA7n '\u0111\u1EA1i h\u1EA1n hi\u1EC7n t\u1EA1i' t\xEDnh theo ng\xE0y \u0111\xF3."
};
var KEY_RE = /^(\d{4})-(\d{2})-(\d{2})-(\d{1,2})-(male|female)$/;
function yearFile(dataDir2, year) {
  return join(dataDir2, `year-${year}.jsonl.zst`);
}
function findRecord(dataDir2, key) {
  const m = KEY_RE.exec(key);
  if (!m) return Promise.reject(new Error(`Bad key "${key}". Expected YYYY-MM-DD-H-male|female, e.g. 1990-05-17-7-male.`));
  const year = Number(m[1]);
  if (year < 1950 || year > 2026) return Promise.reject(new Error("The dataset covers births from 1950 to 2026 only."));
  const file = yearFile(dataDir2, year);
  if (!existsSync(file)) return Promise.reject(new Error(`Missing data file ${file}. This offline package should contain data/year-1950 \u2026 year-2026.jsonl.zst.`));
  const needle = Buffer.from(`{"k": "${key}"`);
  const needle2 = Buffer.from(`{"k":"${key}"`);
  const { stream, stop } = openDecompressed(file);
  return new Promise((resolve, reject) => {
    let carry = Buffer.alloc(0);
    let done = false;
    const finish = (v, err) => {
      if (done) return;
      done = true;
      stop();
      err ? reject(err) : resolve(v);
    };
    stream.on("data", (chunk) => {
      if (done) return;
      const buf = carry.length ? Buffer.concat([carry, chunk]) : chunk;
      let start = 0;
      for (; ; ) {
        let hit = buf.indexOf(needle, start);
        if (hit < 0) hit = buf.indexOf(needle2, start);
        if (hit < 0) break;
        if (hit !== 0 && buf[hit - 1] !== 10) {
          start = hit + 1;
          continue;
        }
        const nl = buf.indexOf(10, hit);
        if (nl < 0) {
          start = hit;
          break;
        }
        try {
          finish(JSON.parse(buf.subarray(hit, nl).toString("utf8")));
        } catch (e) {
          finish(null, e);
        }
        return;
      }
      const lastNl = buf.lastIndexOf(10);
      carry = Buffer.from(buf.subarray(Math.max(start, lastNl + 1)));
    });
    stream.on("end", () => finish(null));
    stream.on("error", (e) => finish(null, e));
  });
}
function openDecompressed(file) {
  const z = zlib;
  if (typeof z.createZstdDecompress === "function") {
    const src = createReadStream(file, { highWaterMark: 1 << 20 });
    const dec = z.createZstdDecompress({ params: { [z.constants.ZSTD_d_windowLogMax]: 27 } });
    src.pipe(dec);
    return { stream: dec, stop: () => {
      src.destroy();
      dec.destroy();
    } };
  }
  const probe = spawnSync("zstd", ["--version"]);
  if (probe.status !== 0) {
    throw new Error(`Node ${process.version} has no built-in zstd and the zstd command is not installed. Use Node 22.15 or newer, or install zstd.`);
  }
  const child = spawn("zstd", ["-dc", "--long=27", file], { stdio: ["ignore", "pipe", "ignore"] });
  return { stream: child.stdout, stop: () => {
    child.kill();
  } };
}
async function readingMarkdown(dataDir2, key, topics2 = ["overview"], lang = "vi") {
  const list = topics2 === "all" ? [...TOPICS] : topics2;
  for (const t of list) if (!TOPICS.includes(t)) throw new Error(`Unknown topic "${t}". Choose from: ${TOPICS.join(", ")}`);
  const rec = await findRecord(dataDir2, key);
  if (!rec) throw new Error(`Key ${key} not found (check the chart date, hour branch and gender).`);
  const out = [`> ${NOTE[lang]}`];
  for (const t of list) {
    const i = TOPICS.indexOf(t);
    out.push("", `# ${NAMES[lang][i]} (${NAMES.zh[i]})`, "", rec.c[t] ?? "");
  }
  out.push("", "---", FOOTER[lang]);
  return out.join("\n");
}

// src/lookup-cli.ts
var args = {};
var argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith("--")) continue;
  const k = argv[i].slice(2);
  const v = argv[i + 1];
  if (v === void 0 || v.startsWith("--")) args[k] = "true";
  else {
    args[k] = v;
    i++;
  }
}
if (!args.key) {
  console.error(`Usage: node lookup-reading.mjs --key YYYY-MM-DD-H-male|female [--topic ${TOPICS.join(",")}|all] [--lang en|vi]`);
  process.exit(1);
}
var here = dirname(fileURLToPath(import.meta.url));
var dataDir = args.data ?? process.env.ZIWEI_DATA_DIR ?? join2(here, "..", "data");
var topics = args.topic === "all" ? "all" : (args.topic ?? "overview").split(",").map((s) => s.trim());
readingMarkdown(dataDir, args.key, topics, args.lang === "en" ? "en" : "vi").then((md) => console.log(md)).catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
