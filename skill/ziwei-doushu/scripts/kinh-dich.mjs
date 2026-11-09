// src/grave.ts
var MOUNTAINS = [
  { vi: "Nh\xE2m", zh: "\u58EC", py: "ren", kind: "can" },
  { vi: "T\xFD", zh: "\u5B50", py: "zi", kind: "chi" },
  { vi: "Qu\xFD", zh: "\u7678", py: "gui", kind: "can" },
  { vi: "S\u1EEDu", zh: "\u4E11", py: "chou", kind: "chi" },
  { vi: "C\u1EA5n", zh: "\u826E", py: "gen", kind: "quai" },
  { vi: "D\u1EA7n", zh: "\u5BC5", py: "yin", kind: "chi" },
  { vi: "Gi\xE1p", zh: "\u7532", py: "jia", kind: "can" },
  { vi: "M\xE3o", zh: "\u536F", py: "mao", kind: "chi" },
  { vi: "\u1EA4t", zh: "\u4E59", py: "yi", kind: "can" },
  { vi: "Th\xECn", zh: "\u8FB0", py: "chen", kind: "chi" },
  { vi: "T\u1ED1n", zh: "\u5DFD", py: "xun", kind: "quai" },
  { vi: "T\u1EF5", zh: "\u5DF3", py: "si", kind: "chi" },
  { vi: "B\xEDnh", zh: "\u4E19", py: "bing", kind: "can" },
  { vi: "Ng\u1ECD", zh: "\u5348", py: "wu", kind: "chi" },
  { vi: "\u0110inh", zh: "\u4E01", py: "ding", kind: "can" },
  { vi: "M\xF9i", zh: "\u672A", py: "wei", kind: "chi" },
  { vi: "Kh\xF4n", zh: "\u5764", py: "kun", kind: "quai" },
  { vi: "Th\xE2n", zh: "\u7533", py: "shen", kind: "chi" },
  { vi: "Canh", zh: "\u5E9A", py: "geng", kind: "can" },
  { vi: "D\u1EADu", zh: "\u9149", py: "you", kind: "chi" },
  { vi: "T\xE2n", zh: "\u8F9B", py: "xin", kind: "can" },
  { vi: "Tu\u1EA5t", zh: "\u620C", py: "xu", kind: "chi" },
  { vi: "C\xE0n", zh: "\u4E7E", py: "qian", kind: "quai" },
  { vi: "H\u1EE3i", zh: "\u4EA5", py: "hai", kind: "chi" }
];
var PALACES = [
  { vi: "Kh\u1EA3m", zh: "\u574E", dir: "B\u1EAFc", en: "North", start: 0 },
  { vi: "C\u1EA5n", zh: "\u826E", dir: "\u0110\xF4ng B\u1EAFc", en: "North-east", start: 3 },
  { vi: "Ch\u1EA5n", zh: "\u9707", dir: "\u0110\xF4ng", en: "East", start: 6 },
  { vi: "T\u1ED1n", zh: "\u5DFD", dir: "\u0110\xF4ng Nam", en: "South-east", start: 9 },
  { vi: "Ly", zh: "\u96E2", dir: "Nam", en: "South", start: 12 },
  { vi: "Kh\xF4n", zh: "\u5764", dir: "T\xE2y Nam", en: "South-west", start: 15 },
  { vi: "\u0110o\xE0i", zh: "\u514C", dir: "T\xE2y", en: "West", start: 18 },
  { vi: "C\xE0n", zh: "\u4E7E", dir: "T\xE2y B\u1EAFc", en: "North-west", start: 21 }
];
var palaceOf = (i) => PALACES[Math.floor(i / 3)];
var HT = {
  Canh: ["Kh\xF4n"],
  \u0110inh: ["Kh\xF4n"],
  \u1EA4t: ["T\u1ED1n"],
  B\u00EDnh: ["T\u1ED1n"],
  Gi\u00E1p: ["C\u1EA5n"],
  Qu\u00FD: ["C\u1EA5n"],
  T\u00E2n: ["C\xE0n"],
  Nh\u00E2m: ["C\xE0n"],
  Kh\u00F4n: ["Canh", "\u0110inh"],
  T\u1ED1n: ["\u1EA4t", "B\xEDnh"],
  C\u1EA5n: ["Gi\xE1p", "Qu\xFD"],
  C\u00E0n: ["T\xE2n", "Nh\xE2m"]
};
var SONG_SON = { T\u00FD: "Nh\xE2m", S\u1EEDu: "Qu\xFD", D\u1EA7n: "C\u1EA5n", M\u00E3o: "Gi\xE1p", Th\u00ECn: "\u1EA4t", T\u1EF5: "T\u1ED1n", Ng\u1ECD: "B\xEDnh", M\u00F9i: "\u0110inh", Th\u00E2n: "Kh\xF4n", D\u1EADu: "Canh", Tu\u1EA5t: "T\xE2n", H\u1EE3i: "C\xE0n" };
var BAT_SAT = {
  Kh\u1EA3m: { chi: "Th\xECn", animal: "R\u1ED3ng", en: "Dragon" },
  Kh\u00F4n: { chi: "M\xE3o", animal: "M\xE8o/Th\u1ECF", en: "Rabbit" },
  Ch\u1EA5n: { chi: "Th\xE2n", animal: "Kh\u1EC9", en: "Monkey" },
  T\u1ED1n: { chi: "D\u1EADu", animal: "G\xE0", en: "Rooster" },
  C\u00E0n: { chi: "Ng\u1ECD", animal: "Ng\u1EF1a", en: "Horse" },
  \u0110o\u00E0i: { chi: "T\u1EF5", animal: "R\u1EAFn", en: "Snake" },
  C\u1EA5n: { chi: "D\u1EA7n", animal: "H\u1ED5", en: "Tiger" },
  Ly: { chi: "H\u1EE3i", animal: "L\u1EE3n", en: "Pig" }
};
var norm = (s) => s.normalize("NFC").toLowerCase().trim();
var strip = (s) => norm(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
var DIR8 = {};
PALACES.forEach((p, i) => {
  for (const k of [p.dir, p.en, p.vi, p.zh]) {
    DIR8[norm(k)] = i;
    DIR8[strip(k).replace(/[\s-]/g, "")] = i;
  }
});
Object.assign(DIR8, { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7, "\u5317": 0, "\u6771\u5317": 1, "\u4E1C\u5317": 1, "\u6771": 2, "\u4E1C": 2, "\u6771\u5357": 3, "\u4E1C\u5357": 3, "\u5357": 4, "\u897F\u5357": 5, "\u897F": 6, "\u897F\u5317": 7 });
var fmt = (d) => `${Number.isInteger(d) ? d : d.toFixed(1)}\xB0`;
var range = (i) => {
  const c = (345 + 15 * i) % 360;
  return `${fmt((c - 7.5 + 360) % 360)}\u2013${fmt((c + 7.5) % 360)}`;
};
var mountainIndexOfDegree = (deg) => Math.floor((deg % 360 + 360 + 22.5) % 360 / 15);
function parseMountain(q) {
  const s = norm(q).replace(/°$/, "");
  if (/^-?\d+(\.\d+)?$/.test(s)) return mountainIndexOfDegree(Number(s));
  const byVi = MOUNTAINS.findIndex((m) => norm(m.vi) === s);
  if (byVi >= 0) return byVi;
  const byZh = MOUNTAINS.findIndex((m) => m.zh === s);
  if (byZh >= 0) return byZh;
  const a2 = strip(s);
  if (a2 === "ty") throw new Error('"Ty" l\xE0 T\xFD (\u5B50, B\u1EAFc) hay T\u1EF5 (\u5DF3, \u0110\xF4ng Nam)? Vi\u1EBFt c\xF3 d\u1EA5u, ch\u1EEF H\xE1n, ho\u1EB7c s\u1ED1 \u0111\u1ED9.');
  const byAscii = MOUNTAINS.findIndex((m) => strip(m.vi) === a2 || m.py === a2);
  if (byAscii >= 0) return byAscii;
  if (DIR8[s] !== void 0 || DIR8[a2.replace(/[\s-]/g, "")] !== void 0) {
    const p = PALACES[DIR8[s] ?? DIR8[a2.replace(/[\s-]/g, "")]];
    const three = [0, 1, 2].map((k) => MOUNTAINS[p.start + k].vi).join(", ");
    throw new Error(`"${q}" l\xE0 c\u1EA3 cung ${p.vi} (${p.dir}) g\u1ED3m ba s\u01A1n ${three}; c\u1EA7n s\u01A1n c\u1EE5 th\u1EC3 ho\u1EB7c s\u1ED1 \u0111\u1ED9 la b\xE0n.`);
  }
  throw new Error(`Kh\xF4ng nh\u1EADn ra s\u01A1n "${q}". D\xF9ng m\u1ED9t trong 24 s\u01A1n (Nh\xE2m, T\xFD, Qu\xFD, S\u1EEDu, C\u1EA5n, D\u1EA7n, Gi\xE1p, M\xE3o, \u1EA4t, Th\xECn, T\u1ED1n, T\u1EF5, B\xEDnh, Ng\u1ECD, \u0110inh, M\xF9i, Kh\xF4n, Th\xE2n, Canh, D\u1EADu, T\xE2n, Tu\u1EA5t, C\xE0n, H\u1EE3i), ch\u1EEF H\xE1n, ho\u1EB7c s\u1ED1 \u0111\u1ED9.`);
}
function parseSector(q) {
  const s = norm(q), a2 = strip(q).replace(/[\s-]/g, "");
  const p = DIR8[s] ?? DIR8[a2];
  if (p !== void 0 && !MOUNTAINS.some((m) => norm(m.vi) === s || m.zh === s)) return [0, 1, 2].map((k) => PALACES[p].start + k);
  return [parseMountain(q)];
}
function graveCheck(inp) {
  if (!inp.facing && !inp.sitting) throw new Error("C\u1EA7n h\u01B0\u1EDBng (--grave) ho\u1EB7c to\u1EA1 (--sit).");
  const f = inp.facing ? parseMountain(inp.facing) : (parseMountain(inp.sitting) + 12) % 24;
  const t = (f + 12) % 24;
  const fm = MOUNTAINS[f], tm = MOUNTAINS[t], tp = palaceOf(t);
  let ht = HT[fm.vi] ?? [], viaSongSon;
  if (!ht.length && SONG_SON[fm.vi]) {
    viaSongSon = SONG_SON[fm.vi];
    ht = HT[viaSongSon] ?? [];
  }
  const htIdx = ht.map((n) => MOUNTAINS.findIndex((m) => m.vi === n));
  const bs = BAT_SAT[tp.vi], bsIdx = MOUNTAINS.findIndex((m) => m.vi === bs.chi);
  const check = (list, kind) => (list ?? []).filter(Boolean).map((q) => {
    const idx = parseSector(q);
    return { query: q, mountains: idx.map((i) => MOUNTAINS[i].vi), hoangTuyen: idx.some((i) => htIdx.includes(i)), batSat: idx.includes(bsIdx), kind };
  });
  const deg = inp.facing && /^-?\d+(\.\d+)?°?$/.test(inp.facing.trim()) ? Number(inp.facing.trim().replace("\xB0", "")) : void 0;
  const nearBoundary = deg !== void 0 && (() => {
    const x = (deg % 360 + 360 + 22.5) % 15;
    return Math.min(x, 15 - x) <= 1.5;
  })();
  return {
    deg,
    nearBoundary,
    facing: { idx: f, ...fm, range: range(f), palace: palaceOf(f) },
    sitting: { idx: t, ...tm, range: range(t), palace: tp },
    hoangTuyen: { rule: ht.length === 2 ? "B\xE1t l\u1ED9" : ht.length ? "T\u1EE9 l\u1ED9" : "", mountains: htIdx.map((i) => ({ ...MOUNTAINS[i], range: range(i) })), viaSongSon },
    batSat: { ...bs, range: range(bsIdx), sittingPalace: tp.vi },
    checks: [...check(inp.waterIn, "in"), ...check(inp.waterOut, "out"), ...check(inp.roads, "road")]
  };
}
function graveMarkdown(inp, lang2 = "vi") {
  const r = graveCheck(inp), vi = lang2 === "vi";
  const mt = (m) => `**${m.vi}** (${m.zh}, ${m.range})`;
  const out = [vi ? "## \xC2m tr\u1EA1ch: Ho\xE0ng Tuy\u1EC1n v\xE0 B\xE1t s\xE1t" : "## Grave compass check: Huang Quan and Eight Killings", ""];
  out.push(vi ? `- H\u01B0\u1EDBng: ${mt(r.facing)} \u2014 cung ${r.facing.palace.vi} (${r.facing.palace.dir})
- To\u1EA1: ${mt(r.sitting)} \u2014 cung ${r.sitting.palace.vi} (${r.sitting.palace.dir})` : `- Facing: ${mt(r.facing)} \u2014 ${r.facing.palace.zh} palace (${r.facing.palace.en})
- Sitting: ${mt(r.sitting)} \u2014 ${r.sitting.palace.zh} palace (${r.sitting.palace.en})`);
  if (r.nearBoundary) out.push(vi ? `- \u26A0 ${fmt(r.deg)} n\u1EB1m s\xE1t ranh gi\u1EDBi hai s\u01A1n (trong 1,5\xB0): ph\u1EA1m "kh\xF4ng vong / xu\u1EA5t qu\xE1i", n\xEAn \u0111o l\u1EA1i ho\u1EB7c ch\u1EC9nh h\u01B0\u1EDBng v\xE0o gi\u1EEFa s\u01A1n.` : `- \u26A0 ${fmt(r.deg)} is within 1.5\xB0 of a mountain boundary (void line); re-measure or adjust.`);
  out.push("", vi ? "### Ho\xE0ng Tuy\u1EC1n (\u9EC3\u6CC9)" : "### Huang Quan (\u9EC3\u6CC9)");
  if (r.hoangTuyen.mountains.length) {
    const list = r.hoangTuyen.mountains.map(mt).join(vi ? " v\xE0 " : " and ");
    out.push(vi ? `${r.hoangTuyen.viaSongSon ? `H\u01B0\u1EDBng ${r.facing.vi} l\xE0 \u0111\u1ECBa chi, kh\u1EA9u quy\u1EBFt g\u1ED1c kh\xF4ng x\xE9t; theo song s\u01A1n (ph\xE1i Tam H\u1EE3p) t\xEDnh nh\u01B0 h\u01B0\u1EDBng **${r.hoangTuyen.viaSongSon}**. ` : ""}${r.hoangTuyen.rule} Ho\xE0ng Tuy\u1EC1n: ph\u01B0\u01A1ng k\u1EF5 l\xE0 ${list}.

- N\u01B0\u1EDBc **ch\u1EA3y \u0111\u1EBFn** (lai th\u1EE7y) t\u1EEB ph\u01B0\u01A1ng n\xE0y, ho\u1EB7c \u0111\u01B0\u1EDDng \u0111i, c\u1ED5ng, r\xE3nh \u0111\xE2m v\xE0o t\u1EEB ph\u01B0\u01A1ng n\xE0y: hung ("s\xE1t nh\xE2n ho\xE0ng tuy\u1EC1n").
- N\u01B0\u1EDBc **ch\u1EA3y \u0111i** (kh\u1EE9 th\u1EE7y) ra ph\u01B0\u01A1ng n\xE0y: ph\xE1i D\u01B0\u01A1ng C\xF4ng g\u1ECDi l\xE0 "c\u1EE9u b\u1EA7n ho\xE0ng tuy\u1EC1n", kh\xF4ng k\u1EF5, c\xF3 s\xE1ch cho l\xE0 t\u1ED1t ("ho\xE0ng tuy\u1EC1n b\u1EA3n th\u1ECB c\u1EE9u b\u1EA7n ph\u01B0\u01A1ng, lai gi\u1EA3 hung h\u1EC1 kh\u1EE9 gi\u1EA3 c\xE1t"). C\xE1c ph\xE1i kh\xE1c nhau \u1EDF \u0111i\u1EC3m n\xE0y.` : `${r.hoangTuyen.viaSongSon ? `${r.facing.vi} is a branch; the original rhyme does not cover it, so the Tam He double-mountain pairing treats it as ${r.hoangTuyen.viaSongSon}. ` : ""}${r.hoangTuyen.rule === "B\xE1t l\u1ED9" ? "Eight-road" : "Four-road"} Huang Quan sector: ${list}.

- Water (or a road, gate or drain) ARRIVING from this sector is harmful.
- Water LEAVING through it is called "poverty-relieving Huang Quan" by the Yang Gong school and is not avoided; schools differ here.`);
  } else out.push(vi ? "H\u01B0\u1EDBng n\xE0y kh\xF4ng c\xF3 Ho\xE0ng Tuy\u1EC1n theo kh\u1EA9u quy\u1EBFt t\u1EE9 l\u1ED9 / b\xE1t l\u1ED9." : "No Huang Quan sector for this facing under the four/eight-road rhyme.");
  out.push("", vi ? "### Long th\u01B0\u1EE3ng B\xE1t s\xE1t (\u9F8D\u4E0A\u516B\u715E)" : "### Eight Killings on the dragon (\u9F8D\u4E0A\u516B\u715E)");
  out.push(vi ? `To\u1EA1 cung ${r.sitting.palace.vi} k\u1EF5 **${r.batSat.chi}** (con ${r.batSat.animal}, ${r.batSat.range}): kh\xF4ng l\u1EADp h\u01B0\u1EDBng ${r.batSat.chi}, tr\xE1nh n\u01B0\u1EDBc \u0111\u1EBFn, \u0111\u01B0\u1EDDng \u0111\xE2m, c\u1EEDa m\u1EDF v\u1EC1 ph\u01B0\u01A1ng ${r.batSat.chi}; ch\u1ECDn ng\xE0y t\xE1ng c\u0169ng tr\xE1nh ng\xE0y, n\u0103m ${r.batSat.chi} (kh\u1EA9u quy\u1EBFt: "Kh\u1EA3m long Kh\xF4n th\u1ED1 Ch\u1EA5n s\u01A1n h\u1EA7u, T\u1ED1n k\xEA C\xE0n m\xE3 \u0110o\xE0i x\xE0 \u0111\u1EA7u, C\u1EA5n h\u1ED5 Ly tr\u01B0 vi b\xE1t s\xE1t, m\u1ED9 tr\u1EA1ch ph\xF9ng chi nh\u1EA5t th\u1EDDi h\u01B0u").` : `A ${r.sitting.palace.zh} sitting avoids **${r.batSat.chi}** (${r.batSat.en}, ${r.batSat.range}): no facing, arriving water, road or door from that branch, and no burial on ${r.batSat.en} days or years.`);
  if (r.checks.length) {
    out.push(
      "",
      vi ? "### Ki\u1EC3m tra n\u01B0\u1EDBc, \u0111\u01B0\u1EDDng" : "### Water and road check",
      "",
      vi ? "| Lo\u1EA1i | Ph\u01B0\u01A1ng | S\u01A1n | Ho\xE0ng Tuy\u1EC1n | B\xE1t s\xE1t | Nh\u1EADn x\xE9t |\n|---|---|---|---|---|---|" : "| Kind | Given | Mountains | Huang Quan | Eight Killings | Note |\n|---|---|---|---|---|---|"
    );
    for (const c of r.checks) {
      const kind = vi ? { in: "N\u01B0\u1EDBc \u0111\u1EBFn", out: "N\u01B0\u1EDBc \u0111i", road: "\u0110\u01B0\u1EDDng/c\u1ED5ng" }[c.kind] : { in: "Water in", out: "Water out", road: "Road/gate" }[c.kind];
      let note = vi ? "Kh\xF4ng ph\u1EA1m" : "Clear";
      if (c.hoangTuyen && c.kind === "out") note = vi ? "Kh\u1EE9 th\u1EE7y qua Ho\xE0ng Tuy\u1EC1n: ph\xE1i D\u01B0\u01A1ng C\xF4ng cho l\xE0 c\u1EE9u b\u1EA7n, kh\xF4ng k\u1EF5" : "Leaving through Huang Quan: accepted by the Yang Gong school";
      else if (c.hoangTuyen) note = vi ? "**Ph\u1EA1m Ho\xE0ng Tuy\u1EC1n**" : "**Hits Huang Quan**";
      if (c.batSat && c.kind !== "out") note += vi ? "; **ph\u1EA1m B\xE1t s\xE1t**" : "; **hits Eight Killings**";
      else if (c.batSat) note += vi ? "; n\u01B0\u1EDBc \u0111i qua ph\u01B0\u01A1ng B\xE1t s\xE1t (\xEDt s\xE1ch k\u1EF5)" : "; leaves through the Eight Killings branch (rarely avoided)";
      out.push(`| ${kind} | ${c.query} | ${c.mountains.join(", ")} | ${c.hoangTuyen ? "\u2717" : "\u2013"} | ${c.batSat ? "\u2717" : "\u2013"} | ${note} |`);
    }
  }
  out.push("", vi ? "> \u0110\xE2y l\xE0 kh\u1EA9u quy\u1EBFt l\xFD kh\xED truy\u1EC1n th\u1ED1ng, c\xE1c ph\xE1i gi\u1EA3i kh\xE1c nhau; c\u1ED5 th\u01B0 (T\xE1ng Th\u01B0) \u0111\u1EB7t h\xECnh th\u1EBF tr\xEAn ph\u01B0\u01A1ng v\u1ECB. \u0110o b\u1EB1ng la b\xE0n \u0111\u1EB7t \u1EDF gi\u1EEFa m\u1ED9, tr\xE1nh v\u1EADt kim lo\u1EA1i; n\u1EBFu h\u01B0\u1EDBng n\u1EB1m s\xE1t ranh hai s\u01A1n (\xB11,5\xB0) th\xEC c\u1EA7n \u0111o l\u1EA1i. Xem th\xEAm `references/vi/am-trach/am-trach.md` m\u1EE5c 6." : "> Traditional compass rhymes; schools differ, and the classics rank landform above direction. Measure from the centre of the grave away from metal; re-measure if within \xB11.5\xB0 of a mountain boundary.");
  return out.join("\n");
}

// src/iching.ts
import { randomInt } from "node:crypto";

// src/iching-data.json
var iching_data_default = {
  trigrams: [
    {
      key: "qian",
      zh: "\u4E7E",
      vi: "C\xE0n",
      symbol: "\u2630",
      lines: "111",
      nature_zh: "\u5929",
      nature_vi: "Tr\u1EDDi",
      element: "Kim",
      direction: "T\xE2y B\u1EAFc",
      role: "Cha / ch\u1ED3ng (ng\u01B0\u1EDDi ch\u1EE7 nh\xE0 nam)",
      en: "Heaven",
      direction_en: "North-west",
      role_en: "father / husband"
    },
    {
      key: "dui",
      zh: "\u514C",
      vi: "\u0110o\xE0i",
      symbol: "\u2631",
      lines: "110",
      nature_zh: "\u6CFD",
      nature_vi: "\u0110\u1EA7m",
      element: "Kim",
      direction: "T\xE2y",
      role: "Con g\xE1i \xFAt",
      en: "Lake",
      direction_en: "West",
      role_en: "youngest daughter"
    },
    {
      key: "li",
      zh: "\u96E2",
      vi: "Ly",
      symbol: "\u2632",
      lines: "101",
      nature_zh: "\u706B",
      nature_vi: "L\u1EEDa",
      element: "H\u1ECFa",
      direction: "Nam",
      role: "Con g\xE1i gi\u1EEFa",
      en: "Fire",
      direction_en: "South",
      role_en: "middle daughter"
    },
    {
      key: "zhen",
      zh: "\u9707",
      vi: "Ch\u1EA5n",
      symbol: "\u2633",
      lines: "100",
      nature_zh: "\u96F7",
      nature_vi: "S\u1EA5m",
      element: "M\u1ED9c",
      direction: "\u0110\xF4ng",
      role: "Con trai c\u1EA3",
      en: "Thunder",
      direction_en: "East",
      role_en: "eldest son"
    },
    {
      key: "xun",
      zh: "\u5DFD",
      vi: "T\u1ED1n",
      symbol: "\u2634",
      lines: "011",
      nature_zh: "\u98CE",
      nature_vi: "Gi\xF3",
      element: "M\u1ED9c",
      direction: "\u0110\xF4ng Nam",
      role: "Con g\xE1i c\u1EA3",
      en: "Wind",
      direction_en: "South-east",
      role_en: "eldest daughter"
    },
    {
      key: "kan",
      zh: "\u574E",
      vi: "Kh\u1EA3m",
      symbol: "\u2635",
      lines: "010",
      nature_zh: "\u6C34",
      nature_vi: "N\u01B0\u1EDBc",
      element: "Th\u1EE7y",
      direction: "B\u1EAFc",
      role: "Con trai gi\u1EEFa",
      en: "Water",
      direction_en: "North",
      role_en: "middle son"
    },
    {
      key: "gen",
      zh: "\u826E",
      vi: "C\u1EA5n",
      symbol: "\u2636",
      lines: "001",
      nature_zh: "\u5C71",
      nature_vi: "N\xFAi",
      element: "Th\u1ED5",
      direction: "\u0110\xF4ng B\u1EAFc",
      role: "Con trai \xFAt",
      en: "Mountain",
      direction_en: "North-east",
      role_en: "youngest son"
    },
    {
      key: "kun",
      zh: "\u5764",
      vi: "Kh\xF4n",
      symbol: "\u2637",
      lines: "000",
      nature_zh: "\u5730",
      nature_vi: "\u0110\u1EA5t",
      element: "Th\u1ED5",
      direction: "T\xE2y Nam",
      role: "M\u1EB9 / v\u1EE3 (ng\u01B0\u1EDDi ch\u1EE7 nh\xE0 n\u1EEF)",
      en: "Earth",
      direction_en: "South-west",
      role_en: "mother / wife"
    }
  ],
  hexagrams: [
    {
      n: 1,
      zh: "\u4E7E\u70BA\u5929",
      vi: "Thu\u1EA7n C\xE0n",
      en: "The Creative",
      upper: "qian",
      lower: "qian",
      meaning: "Tr\u1EDDi; c\u01B0\u01A1ng ki\u1EC7n, t\u1EF1 c\u01B0\u1EDDng kh\xF4ng ng\u1EEBng, l\xE0m ch\u1EE7",
      guaci: "\u5143\u4EA8\u3002\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5927\u54C9\u4E7E\u5143\uFF0C\u842C\u7269\u8CC7\u59CB\uFF0C\u4E43\u7D71\u5929\u3002\u96F2\u884C\u96E8\u65BD\uFF0C\u54C1\u7269\u6D41\u5F62\uFF0C\u5927\u660E\u7D42\u59CB\uFF0C\u516D\u4F4D\u6642\u6210\u3002\u6642\u4E58\u516D\u9F8D\u4EE5\u5FA1\u5929\uFF0C\u4E7E\u9053\u8B8A\u5316\uFF0C\u5404\u6B63\u6027\u547D\uFF0C\u4FDD\u5408\u5927\u548C\uFF0C\u4E43\u5229\u8C9E\u3002\u9996\u51FA\u5EB6\u7269\uFF0C\u842C\u570B\u54B8\u5BE7\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u884C\u5065\uFF0C\u541B\u5B50\u4EE5\u81EA\u5F37\u4E0D\u606F\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u6F5B\u9F8D\u52FF\u7528\u3002",
        "\u4E5D\u4E8C\uFF1A\u898B\u9F8D\u5728\u7530\uFF0C\u5229\u898B\u5927\u4EBA\u3002",
        "\u4E5D\u4E09\uFF1A\u541B\u5B50\u7D42\u65E5\u4E7E\u4E7E\uFF0C\u5915\u60D5\u82E5\uFF1B\u53B2\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u56DB\uFF1A\u6216\u8E8D\u5728\u6DF5\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u98DB\u9F8D\u5728\u5929\uFF0C\u5229\u898B\u5927\u4EBA\u3002",
        "\u4E0A\u4E5D\uFF1A\u4EA2\u9F8D\uFF0C\u6709\u6094\u3002",
        "\u7528\u4E5D\uFF1A\u898B\u7FA3\u9F8D\u65E0\u9996\uFF0C\u5409\u3002"
      ],
      mutual: 1,
      mutual_vi: "Thu\u1EA7n C\xE0n"
    },
    {
      n: 2,
      zh: "\u5764\u70BA\u5730",
      vi: "Thu\u1EA7n Kh\xF4n",
      en: "The Receptive",
      upper: "kun",
      lower: "kun",
      meaning: "\u0110\u1EA5t; nhu thu\u1EADn, bao dung, n\xE2ng \u0111\u1EE1 v\u1EA1n v\u1EADt",
      guaci: "\u5143\u4EA8\u3002\u5229\u725D\u99AC\u4E4B\u8C9E\uFF0C\u541B\u5B50\u6709\u6538\u5F80\uFF0C\u5148\u8FF7\u5F8C\u5F97\u4E3B\uFF0C\u5229\u897F\u5357\u5F97\u670B\uFF0C\u6771\u5317\u55AA\u670B\u3002\u5B89\u8C9E\uFF0C\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u81F3\u54C9\u5764\u5143\uFF0C\u842C\u7269\u8CC7\u751F\uFF0C\u4E43\u9806\u627F\u5929\u3002\u5764\u539A\u8F09\u7269\uFF0C\u5FB7\u5408\u65E0\u7586\uFF1B\u542B\u5F18\u5149\u5927\uFF0C\u54C1\u7269\u54B8\u4EA8\u3002\u725D\u99AC\u5730\u985E\uFF0C\u884C\u5730\u65E0\u7586\uFF0C\u67D4\u9806\u5229\u8C9E\u3002\u541B\u5B50\u6538\u884C\uFF0C\u5148\u8FF7\u5931\u9053\uFF0C\u5F8C\u9806\u5F97\u5E38\u3002\u897F\u5357\u5F97\u670B\uFF0C\u4E43\u8207\u985E\u884C\uFF0C\u6771\u5317\u55AA\u670B\uFF0C\u4E43\u7D42\u6709\u6176\u3002\u5B89\u8C9E\u4E4B\u5409\uFF0C\u61C9\u5730\u65E0\u7586\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5730\u52E2\u5764\uFF0C\u541B\u5B50\u4EE5\u539A\u5FB7\u8F09\u7269\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u5C65\u971C\uFF0C\u5805\u51B0\u81F3\u3002",
        "\u516D\u4E8C\uFF1A\u76F4\u65B9\u5927\uFF0C\u4E0D\u7FD2\u65E0\u4E0D\u5229\u3002",
        "\u516D\u4E09\uFF1A\u542B\u7AE0\uFF0C\u53EF\u8C9E\u3002\u6216\u5F9E\u738B\u4E8B\uFF0C\u65E0\u6210\u6709\u7D42\u3002",
        "\u516D\u56DB\uFF1A\u62EC\u56CA\uFF0C\u65E0\u548E\u65E0\u8B7D\u3002",
        "\u516D\u4E94\uFF1A\u9EC3\u88F3\uFF0C\u5143\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u9F8D\u6230\u4E8E\u91CE\uFF0C\u5176\u8840\u7384\u9EC3\u3002",
        "\u7528\u516D\uFF1A\u5229\u6C38\u8C9E\u3002"
      ],
      mutual: 2,
      mutual_vi: "Thu\u1EA7n Kh\xF4n"
    },
    {
      n: 3,
      zh: "\u6C34\u96F7\u5C6F",
      vi: "Th\u1EE7y L\xF4i Tru\xE2n",
      en: "Difficulty at the Beginning",
      upper: "kan",
      lower: "zhen",
      meaning: "Gian nan l\xFAc kh\u1EDFi \u0111\u1EA7u; gieo m\u1EA7m gi\u1EEFa kh\xF3 kh\u0103n",
      guaci: "\u5143\u4EA8\uFF0C\u5229\u8C9E\u3002\u52FF\u7528\u6709\u6538\u5F80\uFF0C\u5229\u5EFA\u4FAF\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5C6F\uFF0C\u525B\u67D4\u59CB\u4EA4\u800C\u96E3\u751F\uFF0C\u52D5\u4E4E\u96AA\u4E2D\uFF0C\u5927\u4EA8\u8C9E\u3002\u96F7\u96E8\u4E4B\u52D5\u6EFF\u76C8\uFF0C\u5929\u9020\u8349\u6627\uFF0C\u5B9C\u5EFA\u4FAF\u800C\u4E0D\u5BE7\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F2\u96F7\uFF0C\u5C6F\uFF1B\u541B\u5B50\u4EE5\u7D93\u7DB8\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u76E4\u6853\uFF0C\u5229\u5C45\u8C9E\uFF0C\u5229\u5EFA\u4FAF\u3002",
        "\u516D\u4E8C\uFF1A\u5C6F\u5982\u9085\u5982\uFF0C\u4E58\u99AC\u73ED\u5982\uFF0C\u532A\u5BC7\u5A5A\u5ABE\uFF0C\u5973\u5B50\u8C9E\u4E0D\u5B57\uFF0C\u5341\u5E74\u4E43\u5B57\u3002",
        "\u516D\u4E09\uFF1A\u5373\u9E7F\u65E0\u865E\uFF0C\u60DF\u5165\u4E8E\u6797\u4E2D\uFF0C\u541B\u5B50\u5E7E\u4E0D\u5982\u820D\uFF0C\u5F80\u541D\u3002",
        "\u516D\u56DB\uFF1A\u4E58\u99AC\u73ED\u5982\uFF0C\u6C42\u5A5A\u5ABE\uFF0C\u5F80\uFF0C\u5409\u65E0\u4E0D\u5229\u3002",
        "\u4E5D\u4E94\uFF1A\u5C6F\u5176\u818F\uFF1B\u5C0F\u8C9E\u5409\uFF0C\u5927\u8C9E\u51F6\u3002",
        "\u4E0A\u516D\uFF1A\u4E58\u99AC\u73ED\u5982\uFF0C\u6CE3\u8840\u6F23\u5982\u3002"
      ],
      mutual: 23,
      mutual_vi: "S\u01A1n \u0110\u1ECBa B\xE1c"
    },
    {
      n: 4,
      zh: "\u5C71\u6C34\u8499",
      vi: "S\u01A1n Th\u1EE7y M\xF4ng",
      en: "Youthful Folly",
      upper: "gen",
      lower: "kan",
      meaning: "Non n\u1EDBt, m\u1EDD t\u1ED1i; c\u1EA7n h\u1ECDc h\u1ECFi v\xE0 khai s\xE1ng",
      guaci: "\u4EA8\u3002\u532A\u6211\u6C42\u7AE5\u8499\uFF0C\u7AE5\u8499\u6C42\u6211\u3002\u521D\u7B6E\u544A\uFF0C\u518D\u4E09\u7006\uFF0C\u7006\u5247\u4E0D\u544A\u3002\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8499\uFF0C\u5C71\u4E0B\u6709\u96AA\uFF0C\u96AA\u800C\u6B62\uFF0C\u8499\u3002\u8499\u4EA8\uFF0C\u4EE5\u4EA8\u884C\uFF0C\u6642\u4E2D\u4E5F\u3002\u532A\u6211\u6C42\u7AE5\u8499\uFF0C\u7AE5\u8499\u6C42\u6211\uFF0C\u5FD7\u61C9\u4E5F\u3002\u521D\u7B6E\u544A\uFF0C\u4EE5\u525B\u4E2D\u4E5F\u3002\u518D\u4E09\u7006\uFF0C\u7006\u5247\u4E0D\u544A\uFF0C\u7006\u8499\u4E5F\u3002\u8499\u4EE5\u990A\u6B63\uFF0C\u8056\u529F\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0B\u51FA\u6CC9\uFF0C\u8499\uFF1B\u541B\u5B50\u4EE5\u679C\u884C\u80B2\u5FB7\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u767C\u8499\uFF0C\u5229\u7528\u5211\u4EBA\uFF0C\u7528\u8AAA\u684E\u688F\uFF0C\u4EE5\u5F80\u541D\u3002",
        "\u4E5D\u4E8C\uFF1A\u5305\u8499\u5409\uFF0C\u7D0D\u5A66\u5409\uFF0C\u5B50\u514B\u5BB6\u3002",
        "\u516D\u4E09\uFF1A\u52FF\u7528\u5A36\u5973\uFF0C\u898B\u91D1\u592B\uFF0C\u4E0D\u6709\u8EAC\uFF0C\u65E0\u6538\u5229\u3002",
        "\u516D\u56DB\uFF1A\u56F0\u8499\uFF0C\u541D\u3002",
        "\u516D\u4E94\uFF1A\u7AE5\u8499\uFF0C\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u64CA\u8499\uFF0C\u4E0D\u5229\u70BA\u5BC7\uFF0C\u5229\u79A6\u5BC7\u3002"
      ],
      mutual: 24,
      mutual_vi: "\u0110\u1ECBa L\xF4i Ph\u1EE5c"
    },
    {
      n: 5,
      zh: "\u6C34\u5929\u9700",
      vi: "Th\u1EE7y Thi\xEAn Nhu",
      en: "Waiting",
      upper: "kan",
      lower: "qian",
      meaning: "Ch\u1EDD \u0111\u1EE3i \u0111\xFAng th\u1EDDi; nu\xF4i s\u1EE9c tr\u01B0\u1EDBc khi ti\u1EBFn",
      guaci: "\u6709\u5B5A\uFF0C\u5149\u4EA8\u3002\u8C9E\u5409\uFF0C\u5229\u6D89\u5927\u5DDD\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u9700\uFF0C\u9808\u4E5F\uFF0C\u96AA\u5728\u524D\u4E5F\uFF1B\u525B\u5065\u800C\u4E0D\u9677\uFF0C\u5176\u7FA9\u4E0D\u56F0\u7AAE\u77E3\u3002\u9700\uFF0C\u6709\u5B5A\uFF0C\u5149\u4EA8\uFF0C\u8C9E\u5409\uFF0C\u4F4D\u4E4E\u5929\u4F4D\uFF0C\u4EE5\u6B63\u4E2D\u4E5F\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u5F80\u6709\u529F\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F2\u4E0A\u65BC\u5929\uFF0C\u9700\uFF1B\u541B\u5B50\u4EE5\u98F2\u98DF\u5BB4\u6A02\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u9700\u4E8E\u90CA\uFF0C\u5229\u7528\u6046\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u9700\u4E8E\u6C99\uFF0C\u5C0F\u6709\u8A00\uFF0C\u7D42\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u9700\u4E8E\u6CE5\uFF0C\u81F4\u5BC7\u81F3\u3002",
        "\u516D\u56DB\uFF1A\u9700\u4E8E\u8840\uFF0C\u51FA\u81EA\u7A74\u3002",
        "\u4E5D\u4E94\uFF1A\u9700\u4E8E\u9152\u98DF\uFF0C\u8C9E\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u5165\u4E8E\u7A74\uFF0C\u6709\u4E0D\u901F\u4E4B\u5BA2\u4E09\u4EBA\u4F86\uFF0C\u656C\u4E4B\u7D42\u5409\u3002"
      ],
      mutual: 38,
      mutual_vi: "H\u1ECFa Tr\u1EA1ch Khu\xEA"
    },
    {
      n: 6,
      zh: "\u5929\u6C34\u8A1F",
      vi: "Thi\xEAn Th\u1EE7y T\u1EE5ng",
      en: "Conflict",
      upper: "qian",
      lower: "kan",
      meaning: "Tranh ch\u1EA5p, ki\u1EC7n t\u1EE5ng; n\xEAn h\xF2a gi\u1EA3i, d\u1EEBng gi\u1EEFa ch\u1EEBng",
      guaci: "\u6709\u5B5A\uFF0C\u7A92\uFF0C\u60D5\uFF0C\u4E2D\u5409\uFF0C\u7D42\u51F6\u3002\u5229\u898B\u5927\u4EBA\uFF0C\u4E0D\u5229\u6D89\u5927\u5DDD\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8A1F\uFF0C\u4E0A\u525B\u4E0B\u96AA\uFF0C\u96AA\u800C\u5065\uFF0C\u8A1F\u3002\u8A1F\uFF0C\u6709\u5B5A\uFF0C\u7A92\uFF0C\u60D5\uFF0C\u4E2D\u5409\uFF0C\u525B\u4F86\u800C\u5F97\u4E2D\u4E5F\u3002\u7D42\u51F6\uFF0C\u8A1F\u4E0D\u53EF\u6210\u4E5F\u3002\u5229\u898B\u5927\u4EBA\uFF0C\u5C1A\u4E2D\u6B63\u4E5F\u3002\u4E0D\u5229\u6D89\u5927\u5DDD\uFF0C\u5165\u4E8E\u6DF5\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u8207\u6C34\u9055\u884C\uFF0C\u8A1F\uFF1B\u541B\u5B50\u4EE5\u4F5C\u4E8B\u8B00\u59CB\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u4E0D\u6C38\u6240\u4E8B\uFF0C\u5C0F\u6709\u8A00\uFF0C\u7D42\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u4E0D\u514B\u8A1F\uFF0C\u6B78\u800C\u900B\uFF0C\u5176\u9091\u4EBA\u4E09\u767E\u6236\u65E0\u771A\u3002",
        "\u516D\u4E09\uFF1A\u98DF\u820A\u5FB7\uFF0C\u8C9E\u53B2\uFF0C\u7D42\u5409\u3002\u6216\u5F9E\u738B\u4E8B\uFF0C\u65E0\u6210\u3002",
        "\u4E5D\u56DB\uFF1A\u4E0D\u514B\u8A1F\uFF0C\u5FA9\u5373\u547D\u6E1D\uFF0C\u5B89\u8C9E\u5409\u3002",
        "\u4E5D\u4E94\uFF1A\u8A1F\uFF0C\u5143\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u6216\u932B\u4E4B\u97B6\u5E36\uFF0C\u7D42\u671D\u4E09\u62D5\u4E4B\u3002"
      ],
      mutual: 37,
      mutual_vi: "Phong H\u1ECFa Gia Nh\xE2n"
    },
    {
      n: 7,
      zh: "\u5730\u6C34\u5E2B",
      vi: "\u0110\u1ECBa Th\u1EE7y S\u01B0",
      en: "The Army",
      upper: "kun",
      lower: "kan",
      meaning: "Qu\xE2n \u0111\u1ED9i, k\u1EF7 lu\u1EADt; d\u1EABn d\u1EAFt \u0111\xE1m \u0111\xF4ng b\u1EB1ng ch\xEDnh ngh\u0129a",
      guaci: "\u8C9E\u4E08\u4EBA\u5409\uFF0C\u65E0\u548E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5E2B\uFF0C\u773E\u4E5F\u3002\u8C9E\uFF0C\u6B63\u4E5F\u3002\u80FD\u4EE5\u773E\u6B63\uFF0C\u53EF\u4EE5\u738B\u77E3\u3002\u525B\u4E2D\u800C\u61C9\uFF0C\u884C\u96AA\u800C\u9806\uFF0C\u4EE5\u6B64\u6BD2\u5929\u4E0B\uFF0C\u800C\u6C11\u5F9E\u4E4B\uFF0C\u5409\u53C8\u4F55\u548E\u77E3\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5730\u4E2D\u6709\u6C34\uFF0C\u5E2B\uFF1B\u541B\u5B50\u4EE5\u5BB9\u6C11\u755C\u8846\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u5E2B\u51FA\u4EE5\u5F8B\uFF0C\u5426\u81E7\uFF0C\u51F6\u3002",
        "\u4E5D\u4E8C\uFF1A\u5728\u5E2B\u4E2D\u5409\uFF0C\u65E0\u548E\uFF1B\u738B\u4E09\u932B\u547D\u3002",
        "\u516D\u4E09\uFF1A\u5E2B\u6216\u8F3F\u5C38\uFF0C\u51F6\u3002",
        "\u516D\u56DB\uFF1A\u5E2B\u5DE6\u6B21\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u7530\u6709\u79BD\uFF0C\u5229\u57F7\u8A00\uFF0C\u65E0\u548E\u3002\u9577\u5B50\u5E25\u5E2B\uFF0C\u5F1F\u5B50\u8F3F\u5C38\uFF0C\u8C9E\u51F6\u3002",
        "\u4E0A\u516D\uFF1A\u5927\u541B\u6709\u547D\uFF0C\u958B\u570B\u627F\u5BB6\uFF0C\u5C0F\u4EBA\u52FF\u7528\u3002"
      ],
      mutual: 24,
      mutual_vi: "\u0110\u1ECBa L\xF4i Ph\u1EE5c"
    },
    {
      n: 8,
      zh: "\u6C34\u5730\u6BD4",
      vi: "Th\u1EE7y \u0110\u1ECBa T\u1EF7",
      en: "Holding Together",
      upper: "kan",
      lower: "kun",
      meaning: "G\u1EA7n g\u0169i, li\xEAn k\u1EBFt; ch\u1ECDn \u0111\xFAng ng\u01B0\u1EDDi \u0111\u1EC3 theo",
      guaci: "\u5409\u3002\u539F\u7B6E\u5143\u6C38\u8C9E\uFF0C\u65E0\u548E\u3002\u4E0D\u5BE7\u65B9\u4F86\uFF0C\u5F8C\u592B\u51F6\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6BD4\uFF0C\u5409\u4E5F\u3002\u6BD4\uFF0C\u8F14\u4E5F\uFF0C\u4E0B\u9806\u5F9E\u4E5F\u3002\u539F\u7B6E\uFF0C\u5143\u6C38\u8C9E\uFF0C\u65E0\u548E\uFF0C\u4EE5\u525B\u4E2D\u4E5F\u3002\u4E0D\u5BE7\u65B9\u4F86\uFF0C\u4E0A\u4E0B\u61C9\u4E5F\u3002\u5F8C\u592B\u51F6\uFF0C\u5176\u9053\u7AAE\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5730\u4E0A\u6709\u6C34\uFF0C\u6BD4\uFF1B\u5148\u738B\u4EE5\u5EFA\u842C\u570B\uFF0C\u89AA\u8AF8\u4FAF\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u6709\u5B5A\uFF0C\u6BD4\u4E4B\uFF0C\u65E0\u548E\u3002\u6709\u5B5A\u76C8\u7F36\uFF0C\u7D42\u4F86\u6709\u5B83\uFF0C\u5409\u3002",
        "\u516D\u4E8C\uFF1A\u6BD4\u4E4B\u81EA\u5167\uFF0C\u8C9E\u5409\u3002",
        "\u516D\u4E09\uFF1A\u6BD4\u4E4B\u532A\u4EBA\u3002",
        "\u516D\u56DB\uFF1A\u5916\u6BD4\u4E4B\uFF0C\u8C9E\u5409\u3002",
        "\u4E5D\u4E94\uFF1A\u986F\u6BD4\u3002\u738B\u7528\u4E09\u9A45\uFF0C\u5931\u524D\u79BD\uFF0C\u9091\u4EBA\u4E0D\u8AA1\uFF0C\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u6BD4\u4E4B\u65E0\u9996\uFF0C\u51F6\u3002"
      ],
      mutual: 23,
      mutual_vi: "S\u01A1n \u0110\u1ECBa B\xE1c"
    },
    {
      n: 9,
      zh: "\u98A8\u5929\u5C0F\u755C",
      vi: "Phong Thi\xEAn Ti\u1EC3u S\xFAc",
      en: "Small Taming",
      upper: "xun",
      lower: "qian",
      meaning: "T\xEDch nh\u1ECF; b\u1ECB ki\u1EC1m h\xE3m t\u1EA1m th\u1EDDi, t\xEDch l\u0169y d\u1EA7n",
      guaci: "\u4EA8\u3002\u5BC6\u96F2\u4E0D\u96E8\uFF0C\u81EA\u6211\u897F\u90CA\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5C0F\u755C\uFF0C\u67D4\u5F97\u4F4D\u800C\u4E0A\u4E0B\u61C9\u4E4B\uFF0C\u66F0\u5C0F\u755C\u3002\u5065\u800C\u5DFD\uFF0C\u525B\u4E2D\u800C\u5FD7\u884C\uFF0C\u4E43\u4EA8\u3002\u5BC6\u96F2\u4E0D\u96E8\uFF0C\u5C1A\u5F80\u4E5F\u3002\u81EA\u6211\u897F\u90CA\uFF0C\u65BD\u672A\u884C\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u98A8\u884C\u5929\u4E0A\uFF0C\u5C0F\u755C\uFF0C\u541B\u5B50\u4EE5\u61FF\u6587\u5FB7\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u5FA9\u81EA\u9053\uFF0C\u4F55\u5176\u548E\uFF0C\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u727D\u5FA9\uFF0C\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u8F3F\u8AAA\u8F3B\uFF0C\u592B\u59BB\u53CD\u76EE\u3002",
        "\u516D\u56DB\uFF1A\u6709\u5B5A\uFF0C\u8840\u53BB\u60D5\u51FA\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u6709\u5B5A\u6523\u5982\uFF0C\u5BCC\u4EE5\u5176\u9130\u3002",
        "\u4E0A\u4E5D\uFF1A\u65E2\u96E8\u65E2\u8655\uFF0C\u5C1A\u5FB7\u8F09\uFF0C\u5A66\u8C9E\u53B2\uFF0C\u6708\u5E7E\u671B\uFF0C\u541B\u5B50\u5F81\u51F6\u3002"
      ],
      mutual: 38,
      mutual_vi: "H\u1ECFa Tr\u1EA1ch Khu\xEA"
    },
    {
      n: 10,
      zh: "\u5929\u6FA4\u5C65",
      vi: "Thi\xEAn Tr\u1EA1ch L\xFD",
      en: "Treading",
      upper: "qian",
      lower: "dui",
      meaning: "B\u01B0\u1EDBc \u0111i, l\u1EC5 ngh\u0129a; th\u1EADn tr\u1ECDng nh\u01B0 gi\u1EABm \u0111u\xF4i h\u1ED5",
      guaci: "\u5C65\u864E\u5C3E\uFF0C\u4E0D\u54A5\u4EBA\uFF0C\u4EA8\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5C65\uFF0C\u67D4\u5C65\u525B\u4E5F\u3002\u8AAA\u800C\u61C9\u4E4E\u4E7E\uFF0C\u662F\u4EE5\u5C65\u864E\u5C3E\uFF0C\u4E0D\u54A5\u4EBA\uFF0C\u4EA8\uFF0C\u5229\u8C9E\u3002\u525B\u4E2D\u6B63\uFF0C\u5C65\u5E1D\u4F4D\u800C\u4E0D\u759A\uFF0C\u5149\u660E\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u4E0A\u5929\u4E0B\u6FA4\uFF0C\u5C65\uFF1B\u541B\u5B50\u4EE5\u8FA8\u4E0A\u4E0B\uFF0C\u5B9A\u6C11\u5FD7\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u7D20\u5C65\uFF0C\u5F80\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u5C65\u9053\u5766\u5766\uFF0C\u5E7D\u4EBA\u8C9E\u5409\u3002",
        "\u516D\u4E09\uFF1A\u7707\u80FD\u8996\uFF0C\u8DDB\u80FD\u5C65\uFF0C\u5C65\u864E\u5C3E\uFF0C\u54A5\u4EBA\uFF0C\u51F6\u3002\u6B66\u4EBA\u70BA\u4E8E\u5927\u541B\u3002",
        "\u4E5D\u56DB\uFF1A\u5C65\u864E\u5C3E\uFF0C\u612C\u612C\u7D42\u5409\u3002",
        "\u4E5D\u4E94\uFF1A\u592C\u5C65\uFF0C\u8C9E\u53B2\u3002",
        "\u4E0A\u4E5D\uFF1A\u8996\u5C65\u8003\u8A73\uFF0C\u5176\u65CB\u5143\u5409\u3002"
      ],
      mutual: 37,
      mutual_vi: "Phong H\u1ECFa Gia Nh\xE2n"
    },
    {
      n: 11,
      zh: "\u5730\u5929\u6CF0",
      vi: "\u0110\u1ECBa Thi\xEAn Th\xE1i",
      en: "Peace",
      upper: "kun",
      lower: "qian",
      meaning: "Th\xF4ng su\u1ED1t, tr\xEAn d\u01B0\u1EDBi giao h\xF2a; hanh th\xF4ng",
      guaci: "\u5C0F\u5F80\u5927\u4F86\uFF0C\u5409\u4EA8\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6CF0\uFF0C\u5C0F\u5F80\u5927\u4F86\uFF0C\u5409\u4EA8\u3002\u5247\u662F\u5929\u5730\u4EA4\u800C\u842C\u7269\u901A\u4E5F\uFF0C\u4E0A\u4E0B\u4EA4\u800C\u5176\u5FD7\u540C\u4E5F\u3002\u5167\u967D\u800C\u5916\u9670\uFF0C\u5167\u5065\u800C\u5916\u9806\uFF0C\u5167\u541B\u5B50\u800C\u5916\u5C0F\u4EBA\uFF0C\u541B\u5B50\u9053\u9577\uFF0C\u5C0F\u4EBA\u9053\u6D88\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u5730\u4EA4\uFF0C\u6CF0\uFF1B\u540E\u4EE5\u8CA1\u6210\u5929\u5730\u4E4B\u9053\uFF0C\u8F14\u76F8\u5929\u5730\u4E4B\u5B9C\uFF0C\u4EE5\u5DE6\u53F3\u6C11\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u62D4\u8305\u8339\u4EE5\u5176\u5F59\uFF0C\u5F81\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u5305\u8352\u3002\u7528\u99AE\u6CB3\uFF0C\u4E0D\u9050\u907A\uFF1B\u670B\u4EA1\u3002\u5F97\u5C1A\u4E8E\u4E2D\u884C\u3002",
        "\u4E5D\u4E09\uFF1A\u65E0\u5E73\u4E0D\u9642\uFF0C\u65E0\u5F80\u4E0D\u5FA9\uFF0C\u8271\u8C9E\u65E0\u548E\u3002\u52FF\u6064\u5176\u5B5A\uFF0C\u4E8E\u98DF\u6709\u798F\u3002",
        "\u516D\u56DB\uFF1A\u7FE9\u7FE9\uFF0C\u4E0D\u5BCC\u4EE5\u5176\u9130\uFF1B\u4E0D\u6212\u4EE5\u5B5A\u3002",
        "\u516D\u4E94\uFF1A\u5E1D\u4E59\u6B78\u59B9\uFF0C\u4EE5\u7949\uFF0C\u5143\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u57CE\u5FA9\u4E8E\u968D\uFF0C\u52FF\u7528\u5E2B\uFF0C\u81EA\u9091\u544A\u547D\uFF0C\u8C9E\u541D\u3002"
      ],
      mutual: 54,
      mutual_vi: "L\xF4i Tr\u1EA1ch Quy Mu\u1ED9i"
    },
    {
      n: 12,
      zh: "\u5929\u5730\u5426",
      vi: "Thi\xEAn \u0110\u1ECBa B\u0129",
      en: "Standstill",
      upper: "qian",
      lower: "kun",
      meaning: "B\u1EBF t\u1EAFc, tr\xEAn d\u01B0\u1EDBi kh\xF4ng giao; gi\u1EEF m\xECnh ch\u1EDD th\u1EDDi",
      guaci: "\u5426\u4E4B\u532A\u4EBA\uFF0C\u4E0D\u5229\u541B\u5B50\u8C9E\uFF0C\u5927\u5F80\u5C0F\u4F86\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5426\u4E4B\u532A\u4EBA\uFF0C\u4E0D\u5229\u541B\u5B50\u8C9E\uFF0C\u5927\u5F80\u5C0F\u4F86\u3002\u5247\u662F\u5929\u5730\u4E0D\u4EA4\u800C\u842C\u7269\u4E0D\u901A\u4E5F\uFF0C\u4E0A\u4E0B\u4E0D\u4EA4\u800C\u5929\u4E0B\u65E0\u90A6\u4E5F\u3002\u5167\u9670\u800C\u5916\u967D\uFF0C\u5167\u67D4\u800C\u5916\u525B\uFF0C\u5167\u5C0F\u4EBA\u800C\u5916\u541B\u5B50\uFF0C\u5C0F\u4EBA\u9053\u9577\uFF0C\u541B\u5B50\u9053\u6D88\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u5730\u4E0D\u4EA4\uFF0C\u5426\uFF1B\u541B\u5B50\u4EE5\u5109\u5FB7\u8F9F\u96E3\uFF0C\u4E0D\u53EF\u69AE\u4EE5\u797F\u3002",
      yaoci: [
        "\u521D\u516D\uFF0C\u62D4\u8305\u8339\u4EE5\u5176\u5F59\uFF0C\u8C9E\u5409\u3002\u4EA8\u3002",
        "\u516D\u4E8C\uFF0C\u5305\u627F\uFF0C\u5C0F\u4EBA\u5409\uFF0C\u5927\u4EBA\u5426\u3002\u4EA8\u3002",
        "\u516D\u4E09\uFF0C\u5305\u7F9E\u3002",
        "\u4E5D\u56DB\uFF0C\u6709\u547D\uFF0C\u65E0\u548E\uFF0C\u7587\u96E2\u7949\u3002",
        "\u4E5D\u4E94\uFF0C\u4F11\u5426\uFF0C\u5927\u4EBA\u5409\u3002\u5176\u4EA1\u5176\u4EA1\uFF0C\u7E6B\u4E8E\u82DE\u6851\u3002",
        "\u4E0A\u4E5D\uFF0C\u50BE\u5426\uFF0C\u5148\u5426\u5F8C\u559C\u3002"
      ],
      mutual: 53,
      mutual_vi: "Phong S\u01A1n Ti\u1EC7m"
    },
    {
      n: 13,
      zh: "\u5929\u706B\u540C\u4EBA",
      vi: "Thi\xEAn H\u1ECFa \u0110\u1ED3ng Nh\xE2n",
      en: "Fellowship",
      upper: "qian",
      lower: "li",
      meaning: "H\xF2a \u0111\u1ED3ng, c\xF9ng ch\xED h\u01B0\u1EDBng v\u1EDBi ng\u01B0\u1EDDi",
      guaci: "\u540C\u4EBA\u4E8E\u91CE\uFF0C\u4EA8\uFF0C\u5229\u6D89\u5927\u5DDD\uFF0C\u5229\u541B\u5B50\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u540C\u4EBA\uFF0C\u67D4\u5F97\u4F4D\u5F97\u4E2D\uFF0C\u800C\u61C9\u4E4E\u4E7E\uFF0C\u66F0\u540C\u4EBA\u3002\u540C\u4EBA\u66F0\uFF0C\u540C\u4EBA\u4E8E\u91CE\uFF0C\u4EA8\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u4E7E\u884C\u4E5F\u3002\u6587\u660E\u4EE5\u5065\uFF0C\u4E2D\u6B63\u800C\u61C9\uFF0C\u541B\u5B50\u6B63\u4E5F\u3002\u552F\u541B\u5B50\u70BA\u80FD\u901A\u5929\u4E0B\u4E4B\u5FD7\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u8207\u706B\uFF0C\u540C\u4EBA\uFF1B\u541B\u5B50\u4EE5\u985E\u65CF\u8FA8\u7269\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u540C\u4EBA\u4E8E\u9580\uFF0C\u7121\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u540C\u4EBA\u4E8E\u5B97\uFF0C\u541D\u3002",
        "\u4E5D\u4E09\uFF1A\u4F0F\u620E\u4E8E\u83BD\uFF0C\u5347\u5176\u9AD8\u9675\uFF0C\u4E09\u6B72\u4E0D\u8208\u3002",
        "\u4E5D\u56DB\uFF1A\u4E58\u5176\u5889\uFF0C\u5F17\u514B\u653B\uFF0C\u5409\u3002",
        "\u4E5D\u4E94\uFF1A\u540C\u4EBA\uFF0C\u5148\u865F\u5555\u800C\u5F8C\u7B11\u3002\u5927\u5E2B\u514B\u76F8\u9047\u3002",
        "\u4E0A\u4E5D\uFF1A\u540C\u4EBA\u4E8E\u90CA\uFF0C\u7121\u6094\u3002"
      ],
      mutual: 44,
      mutual_vi: "Thi\xEAn Phong C\u1EA5u"
    },
    {
      n: 14,
      zh: "\u706B\u5929\u5927\u6709",
      vi: "H\u1ECFa Thi\xEAn \u0110\u1EA1i H\u1EEFu",
      en: "Great Possession",
      upper: "li",
      lower: "qian",
      meaning: "C\xF3 l\u1EDBn, sung t\xFAc; gi\u1EEF \u0111\u1EE9c \u0111\u1EC3 gi\u1EEF c\u1EE7a",
      guaci: "\u5143\u4EA8\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5927\u6709\uFF0C\u67D4\u5F97\u5C0A\u4F4D\uFF0C\u5927\u4E2D\u800C\u4E0A\u4E0B\u61C9\u4E4B\uFF0C\u66F0\u5927\u6709\u3002\u5176\u5FB7\u525B\u5065\u800C\u6587\u660E\uFF0C\u61C9\u4E4E\u5929\u800C\u6642\u884C\uFF0C\u662F\u4EE5\u5143\u4EA8\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u706B\u5728\u5929\u4E0A\uFF0C\u5927\u6709\uFF1B\u541B\u5B50\u4EE5\u904F\u60E1\u63DA\u5584\uFF0C\u9806\u5929\u4F11\u547D\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u65E0\u4EA4\u5BB3\uFF0C\u532A\u548E\uFF0C\u8271\u5247\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u5927\u8ECA\u4EE5\u8F09\uFF0C\u6709\u6538\u5F80\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E09\uFF1A\u516C\u7528\u4EA8\u4E8E\u5929\u5B50\uFF0C\u5C0F\u4EBA\u5F17\u514B\u3002",
        "\u4E5D\u56DB\uFF1A\u532A\u5176\u5F6D\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u53A5\u5B5A\u4EA4\u5982\uFF0C\u5A01\u5982\uFF1B\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u81EA\u5929\u53F3\u4E4B\uFF0C\u5409\u65E0\u4E0D\u5229\u3002"
      ],
      mutual: 43,
      mutual_vi: "Tr\u1EA1ch Thi\xEAn Qu\u1EA3i"
    },
    {
      n: 15,
      zh: "\u5730\u5C71\u8B19",
      vi: "\u0110\u1ECBa S\u01A1n Khi\xEAm",
      en: "Modesty",
      upper: "kun",
      lower: "gen",
      meaning: "Khi\xEAm t\u1ED1n; qu\u1EBB duy nh\u1EA5t s\xE1u h\xE0o \u0111\u1EC1u t\u1ED1t",
      guaci: "\u4EA8\uFF0C\u541B\u5B50\u6709\u7D42\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8B19\uFF0C\u4EA8\uFF0C\u5929\u9053\u4E0B\u6FDF\u800C\u5149\u660E\uFF0C\u5730\u9053\u5351\u800C\u4E0A\u884C\u3002\u5929\u9053\u8667\u76C8\u800C\u76CA\u8B19\uFF0C\u5730\u9053\u8B8A\u76C8\u800C\u6D41\u8B19\uFF0C\u9B3C\u795E\u5BB3\u76C8\u800C\u798F\u8B19\uFF0C\u4EBA\u9053\u60E1\u76C8\u800C\u597D\u8B19\u3002\u8B19\u5C0A\u800C\u5149\uFF0C\u5351\u800C\u4E0D\u53EF\u903E\uFF0C\u541B\u5B50\u4E4B\u7D42\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5730\u4E2D\u6709\u5C71\uFF0C\u8B19\uFF1B\u541B\u5B50\u4EE5\u88D2\u591A\u76CA\u5BE1\uFF0C\u7A31\u7269\u5E73\u65BD\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u8B19\u8B19\u541B\u5B50\uFF0C\u7528\u6D89\u5927\u5DDD\uFF0C\u5409\u3002",
        "\u516D\u4E8C\uFF1A\u9CF4\u8B19\uFF0C\u8C9E\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u52DE\u8B19\u541B\u5B50\uFF0C\u6709\u7D42\u5409\u3002",
        "\u516D\u56DB\uFF1A\u65E0\u4E0D\u5229\uFF0C\u649D\u8B19\u3002",
        "\u516D\u4E94\uFF1A\u4E0D\u5BCC\uFF0C\u4EE5\u5176\u9130\uFF0C\u5229\u7528\u4FB5\u4F10\uFF0C\u65E0\u4E0D\u5229\u3002",
        "\u4E0A\u516D\uFF1A\u9CF4\u8B19\uFF0C\u5229\u7528\u884C\u5E2B\uFF0C\u5F81\u9091\u570B\u3002"
      ],
      mutual: 40,
      mutual_vi: "L\xF4i Th\u1EE7y Gi\u1EA3i"
    },
    {
      n: 16,
      zh: "\u96F7\u5730\u8C6B",
      vi: "L\xF4i \u0110\u1ECBa D\u1EF1",
      en: "Enthusiasm",
      upper: "zhen",
      lower: "kun",
      meaning: "Vui v\u1EBB, an l\u1EA1c; chu\u1EA9n b\u1ECB tr\u01B0\u1EDBc, \u0111\u1EEBng ham vui",
      guaci: "\u5229\u5EFA\u4FAF\u884C\u5E2B\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8C6B\uFF0C\u525B\u61C9\u800C\u5FD7\u884C\uFF0C\u9806\u4EE5\u52D5\uFF0C\u8C6B\u3002\u8C6B\uFF0C\u9806\u4EE5\u52D5\uFF0C\u6545\u5929\u5730\u5982\u4E4B\uFF0C\u800C\u6CC1\u5EFA\u4FAF\u884C\u5E2B\u4E4E\uFF1F\u5929\u5730\u4EE5\u9806\u52D5\uFF0C\u6545\u65E5\u6708\u4E0D\u904E\uFF0C\u800C\u56DB\u6642\u4E0D\u5FD2\uFF1B\u8056\u4EBA\u4EE5\u9806\u52D5\uFF0C\u5247\u5211\u7F70\u6E05\u800C\u6C11\u670D\u3002\u8C6B\u4E4B\u6642\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u51FA\u5730\u596E\uFF0C\u8C6B\u3002\u5148\u738B\u4EE5\u4F5C\u6A02\u5D07\u5FB7\uFF0C\u6BB7\u85A6\u4E4B\u4E0A\u5E1D\uFF0C\u4EE5\u914D\u7956\u8003\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u9CF4\u8C6B\uFF0C\u51F6\u3002",
        "\u516D\u4E8C\uFF1A\u4ECB\u4E8E\u77F3\uFF0C\u4E0D\u7D42\u65E5\uFF0C\u8C9E\u5409\u3002",
        "\u516D\u4E09\uFF1A\u76F1\u8C6B\uFF0C\u6094\u3002\u9072\u6709\u6094\u3002",
        "\u4E5D\u56DB\uFF1A\u7531\u8C6B\uFF0C\u5927\u6709\u5F97\u3002\u52FF\u7591\u3002\u670B\u76CD\u7C2A\u3002",
        "\u516D\u4E94\uFF1A\u8C9E\u75BE\uFF0C\u6046\u4E0D\u6B7B\u3002",
        "\u4E0A\u516D\uFF1A\u51A5\u8C6B\uFF0C\u6210\u6709\u6E1D\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 39,
      mutual_vi: "Th\u1EE7y S\u01A1n Ki\u1EC3n"
    },
    {
      n: 17,
      zh: "\u6FA4\u96F7\u96A8",
      vi: "Tr\u1EA1ch L\xF4i T\xF9y",
      en: "Following",
      upper: "dui",
      lower: "zhen",
      meaning: "Theo, thu\u1EADn theo th\u1EDDi v\xE0 ng\u01B0\u1EDDi",
      guaci: "\u5143\u4EA8\u3002\u5229\u8C9E\u3002\u65E0\u548E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u96A8\uFF0C\u525B\u4F86\u800C\u4E0B\u67D4\uFF0C\u52D5\u800C\u8AAA\uFF0C\u96A8\u3002\u5927\u4EA8\u8C9E\uFF0C\u65E0\u548E\uFF0C\u800C\u5929\u4E0B\u96A8\u6642\uFF0C\u96A8\u6642\u4E4B\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E2D\u6709\u96F7\uFF0C\u96A8\uFF1B\u541B\u5B50\u4EE5\u56AE\u6666\u5165\u5BB4\u606F\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u5B98\u6709\u6E1D\uFF0C\u8C9E\u5409\u3002\u51FA\u9580\u4EA4\u6709\u529F\u3002",
        "\u516D\u4E8C\uFF1A\u4FC2\u5C0F\u5B50\uFF0C\u5931\u4E08\u592B\u3002",
        "\u516D\u4E09\uFF1A\u4FC2\u4E08\u592B\uFF0C\u5931\u5C0F\u5B50\u3002\u96A8\uFF0C\u6709\u6C42\u5F97\u5229\uFF0C\u5C45\u8C9E\u3002",
        "\u4E5D\u56DB\uFF1A\u96A8\u6709\u7372\uFF0C\u8C9E\u51F6\u3002\u6709\u5B5A\u5728\u9053\uFF0C\u4EE5\u660E\uFF0C\u4F55\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u5B5A\u4E8E\u5609\uFF0C\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u62D8\u4FC2\u4E4B\uFF0C\u4E43\u5F9E\u7DAD\u4E4B\u3002\u738B\u7528\u4EA8\u4E8E\u897F\u5C71\u3002"
      ],
      mutual: 53,
      mutual_vi: "Phong S\u01A1n Ti\u1EC7m"
    },
    {
      n: 18,
      zh: "\u5C71\u98A8\u8831",
      vi: "S\u01A1n Phong C\u1ED5",
      en: "Work on the Decayed",
      upper: "gen",
      lower: "xun",
      meaning: "H\u01B0 h\u1ECFng t\xEDch t\u1EE5; s\u1EEDa sai do \u0111\u1EDDi tr\u01B0\u1EDBc \u0111\u1EC3 l\u1EA1i",
      guaci: "\u5143\u4EA8\u3002\u5229\u6D89\u5927\u5DDD\u3002\u5148\u7532\u4E09\u65E5\uFF0C\u5F8C\u7532\u4E09\u65E5\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8831\uFF0C\u525B\u4E0A\u800C\u67D4\u4E0B\uFF0C\u5DFD\u800C\u6B62\uFF0C\u8831\u3002\u8831\uFF0C\u5143\u4EA8\uFF0C\u800C\u5929\u4E0B\u6CBB\u4E5F\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u5F80\u6709\u4E8B\u4E5F\u3002\u5148\u7532\u4E09\u65E5\uFF0C\u5F8C\u7532\u4E09\u65E5\uFF0C\u7D42\u5247\u6709\u59CB\uFF0C\u5929\u884C\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0B\u6709\u98A8\uFF0C\u8831\uFF1B\u541B\u5B50\u4EE5\u632F\u6C11\u80B2\u5FB7\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u5E79\u7236\u4E4B\u8831\uFF0C\u6709\u5B50\u8003\uFF0C\u65E0\u548E\uFF0C\u53B2\u7D42\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u5E79\u6BCD\u4E4B\u8831\uFF0C\u4E0D\u53EF\u8C9E\u3002",
        "\u4E5D\u4E09\uFF1A\u5E79\u7236\u4E4B\u8831\uFF0C\u5C0F\u6709\u6094\uFF0C\u65E0\u5927\u548E\u3002",
        "\u516D\u56DB\uFF1A\u88D5\u7236\u4E4B\u8831\uFF0C\u5F80\u898B\u541D\u3002",
        "\u516D\u4E94\uFF1A\u5E79\u7236\u4E4B\u8831\uFF0C\u7528\u8B7D\u3002",
        "\u4E0A\u4E5D\uFF1A\u4E0D\u4E8B\u738B\u4FAF\uFF0C\u9AD8\u5C1A\u5176\u4E8B\u3002"
      ],
      mutual: 54,
      mutual_vi: "L\xF4i Tr\u1EA1ch Quy Mu\u1ED9i"
    },
    {
      n: 19,
      zh: "\u5730\u6FA4\u81E8",
      vi: "\u0110\u1ECBa Tr\u1EA1ch L\xE2m",
      en: "Approach",
      upper: "kun",
      lower: "dui",
      meaning: "\u0110\u1EBFn g\u1EA7n, gi\xE1m s\xE1t; th\u1EDDi th\u1ECBnh nh\u01B0ng ph\u1EA3i lo xa",
      guaci: "\u5143\u4EA8\u3002\u5229\u8C9E\u3002\u81F3\u4E8E\u516B\u6708\u6709\u51F6\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u81E8\uFF0C\u525B\u6D78\u800C\u9577\u3002\u8AAA\u800C\u9806\uFF0C\u525B\u4E2D\u800C\u61C9\uFF0C\u5927\u4EA8\u4EE5\u6B63\uFF0C\u5929\u4E4B\u9053\u4E5F\u3002\u81F3\u4E8E\u516B\u6708\u6709\u51F6\uFF0C\u6D88\u4E0D\u4E45\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E0A\u6709\u5730\uFF0C\u81E8\uFF1B\u541B\u5B50\u4EE5\u6559\u601D\u65E0\u7AAE\uFF0C\u5BB9\u4FDD\u6C11\u65E0\u7586\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u54B8\u81E8\uFF0C\u8C9E\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u54B8\u81E8\uFF0C\u5409\u65E0\u4E0D\u5229\u3002",
        "\u516D\u4E09\uFF1A\u7518\u81E8\uFF0C\u65E0\u6538\u5229\u3002\u65E2\u6182\u4E4B\uFF0C\u65E0\u548E\u3002",
        "\u516D\u56DB\uFF1A\u81F3\u81E8\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u77E5\u81E8\uFF0C\u5927\u541B\u4E4B\u5B9C\uFF0C\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u6566\u81E8\uFF0C\u5409\u65E0\u548E\u3002"
      ],
      mutual: 24,
      mutual_vi: "\u0110\u1ECBa L\xF4i Ph\u1EE5c"
    },
    {
      n: 20,
      zh: "\u98A8\u5730\u89C0",
      vi: "Phong \u0110\u1ECBa Quan",
      en: "Contemplation",
      upper: "xun",
      lower: "kun",
      meaning: "Quan s\xE1t, l\xE0m g\u01B0\u01A1ng cho ng\u01B0\u1EDDi nh\xECn v\xE0o",
      guaci: "\u76E5\u800C\u4E0D\u85A6\uFF0C\u6709\u5B5A\u9852\u82E5\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5927\u89C0\u5728\u4E0A\uFF0C\u9806\u800C\u5DFD\uFF0C\u4E2D\u6B63\u4EE5\u89C0\u5929\u4E0B\u3002\u89C0\uFF0C\u76E5\u800C\u4E0D\u85A6\uFF0C\u6709\u5B5A\u9852\u82E5\uFF0C\u4E0B\u89C0\u800C\u5316\u4E5F\u3002\u89C0\u5929\u4E4B\u795E\u9053\uFF0C\u800C\u56DB\u6642\u4E0D\u5FD2\uFF0C\u8056\u4EBA\u4EE5\u795E\u9053\u8A2D\u6559\uFF0C\u800C\u5929\u4E0B\u670D\u77E3\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u98A8\u884C\u5730\u4E0A\uFF0C\u89C0\uFF1B\u5148\u738B\u4EE5\u7701\u65B9\uFF0C\u89C0\u6C11\u8A2D\u6559\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u7AE5\u89C0\uFF0C\u5C0F\u4EBA\u65E0\u548E\uFF0C\u541B\u5B50\u541D\u3002",
        "\u516D\u4E8C\uFF1A\u7ABA\u89C0\uFF0C\u5229\u5973\u8C9E\u3002",
        "\u516D\u4E09\uFF1A\u89C0\u6211\u751F\uFF0C\u9032\u9000\u3002",
        "\u516D\u56DB\uFF1A\u89C0\u570B\u4E4B\u5149\uFF0C\u5229\u7528\u8CD3\u4E8E\u738B\u3002",
        "\u4E5D\u4E94\uFF1A\u89C0\u6211\u751F\uFF0C\u541B\u5B50\u65E0\u548E\u3002",
        "\u4E0A\u4E5D\uFF1A\u89C0\u5176\u751F\uFF0C\u541B\u5B50\u65E0\u548E\u3002"
      ],
      mutual: 23,
      mutual_vi: "S\u01A1n \u0110\u1ECBa B\xE1c"
    },
    {
      n: 21,
      zh: "\u706B\u96F7\u566C\u55D1",
      vi: "H\u1ECFa L\xF4i Ph\u1EC7 H\u1EA1p",
      en: "Biting Through",
      upper: "li",
      lower: "zhen",
      meaning: "C\u1EAFn h\u1EE3p; tr\u1EEB v\u1EADt c\u1EA3n, h\xECnh ph\u1EA1t nghi\xEAm minh",
      guaci: "\u4EA8\u3002\u5229\u7528\u7344\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u9824\u4E2D\u6709\u7269\uFF0C\u66F0\u566C\u55D1\uFF0C\u566C\u55D1\u800C\u4EA8\u3002\u525B\u67D4\u5206\uFF0C\u52D5\u800C\u660E\uFF0C\u96F7\u96FB\u5408\u800C\u7AE0\u3002\u67D4\u5F97\u4E2D\u800C\u4E0A\u884C\uFF0C\u96D6\u4E0D\u7576\u4F4D\uFF0C\u5229\u7528\u7344\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u96FB\u566C\u55D1\uFF1B\u5148\u738B\u4EE5\u660E\u7F70\u6555\u6CD5\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u5C68\u6821\u6EC5\u8DBE\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u566C\u819A\u6EC5\u9F3B\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E09\uFF1A\u566C\u81D8\u8089\uFF0C\u9047\u6BD2\uFF1B\u5C0F\u541D\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u56DB\uFF1A\u566C\u4E7E\u80CF\uFF0C\u5F97\u91D1\u77E2\uFF0C\u5229\u8271\u8C9E\uFF0C\u5409\u3002",
        "\u516D\u4E94\uFF1A\u566C\u4E7E\u8089\uFF0C\u5F97\u9EC3\u91D1\uFF0C\u8C9E\u53B2\uFF0C\u65E0\u548E\u3002",
        "\u4E0A\u4E5D\uFF1A\u4F55\u6821\u6EC5\u8033\uFF0C\u51F6\u3002"
      ],
      mutual: 39,
      mutual_vi: "Th\u1EE7y S\u01A1n Ki\u1EC3n"
    },
    {
      n: 22,
      zh: "\u5C71\u706B\u8CC1",
      vi: "S\u01A1n H\u1ECFa B\xED",
      en: "Grace",
      upper: "gen",
      lower: "li",
      meaning: "Trang s\u1EE9c, v\u1EBB ngo\xE0i; \u0111\u1EB9p nh\u01B0ng \u0111\u1EEBng qu\xE1 h\xECnh th\u1EE9c",
      guaci: "\u4EA8\u3002\u5C0F\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8CC1\uFF0C\u4EA8\uFF1B\u67D4\u4F86\u800C\u6587\u525B\uFF0C\u6545\u4EA8\u3002\u5206\u525B\u4E0A\u800C\u6587\u67D4\uFF0C\u6545\u5C0F\u5229\u6709\u6538\u5F80\u3002\u525B\u67D4\u4EA4\u932F\uFF0C\u5929\u6587\u4E5F\uFF1B\u6587\u660E\u4EE5\u6B62\uFF0C\u4EBA\u6587\u4E5F\u3002\u89C0\u4E4E\u5929\u6587\uFF0C\u4EE5\u5BDF\u6642\u8B8A\uFF1B\u89C0\u4E4E\u4EBA\u6587\uFF0C\u4EE5\u5316\u6210\u5929\u4E0B\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0B\u6709\u706B\uFF0C\u8CC1\uFF1B\u541B\u5B50\u4EE5\u660E\u5EB6\u653F\uFF0C\u65E0\u6562\u6298\u7344\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u8CC1\u5176\u8DBE\uFF0C\u820D\u8ECA\u800C\u5F92\u3002",
        "\u516D\u4E8C\uFF1A\u8CC1\u5176\u9808\u3002",
        "\u4E5D\u4E09\uFF1A\u8CC1\u5982\u6FE1\u5982\uFF0C\u6C38\u8C9E\u5409\u3002",
        "\u516D\u56DB\uFF1A\u8CC1\u5982\u76A4\u5982\uFF0C\u767D\u99AC\u7FF0\u5982\uFF0C\u532A\u5BC7\u5A5A\u5ABE\u3002",
        "\u516D\u4E94\uFF1A\u8CC1\u65BC\u4E18\u5712\uFF0C\u675F\u5E1B\u6214\u6214\uFF0C\u541D\uFF0C\u7D42\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u767D\u8CC1\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 40,
      mutual_vi: "L\xF4i Th\u1EE7y Gi\u1EA3i"
    },
    {
      n: 23,
      zh: "\u5C71\u5730\u525D",
      vi: "S\u01A1n \u0110\u1ECBa B\xE1c",
      en: "Splitting Apart",
      upper: "gen",
      lower: "kun",
      meaning: "B\xF3c m\xF2n, suy s\u1EE5p; n\xEAn y\xEAn l\u1EB7ng gi\u1EEF g\u1ED1c",
      guaci: "\u4E0D\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u525D\uFF0C\u525D\u4E5F\uFF0C\u67D4\u8B8A\u525B\u4E5F\u3002\u4E0D\u5229\u6709\u6538\u5F80\uFF0C\u5C0F\u4EBA\u9577\u4E5F\u3002\u9806\u800C\u6B62\u4E4B\uFF0C\u89C0\u8C61\u4E5F\u3002\u541B\u5B50\u5C1A\u6D88\u606F\u76C8\u865B\uFF0C\u5929\u884C\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u9644\u5730\u4E0A\uFF0C\u525D\uFF1B\u4E0A\u4EE5\u539A\u4E0B\uFF0C\u5B89\u5B85\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u525D\u7240\u4EE5\u8DB3\uFF0C\u8511\u8C9E\u51F6\u3002",
        "\u516D\u4E8C\uFF1A\u525D\u7240\u4EE5\u8FA8\uFF0C\u8511\u8C9E\u51F6\u3002",
        "\u516D\u4E09\uFF1A\u525D\u4E4B\uFF0C\u65E0\u548E\u3002",
        "\u516D\u56DB\uFF1A\u525D\u7240\u4EE5\u819A\uFF0C\u51F6\u3002",
        "\u516D\u4E94\uFF1A\u8CAB\u9B5A\uFF0C\u4EE5\u5BAE\u4EBA\u5BF5\uFF0C\u65E0\u4E0D\u5229\u3002",
        "\u4E0A\u4E5D\uFF1A\u78A9\u679C\u4E0D\u98DF\uFF0C\u541B\u5B50\u5F97\u8F3F\uFF0C\u5C0F\u4EBA\u525D\u5EEC\u3002"
      ],
      mutual: 2,
      mutual_vi: "Thu\u1EA7n Kh\xF4n"
    },
    {
      n: 24,
      zh: "\u5730\u96F7\u5FA9",
      vi: "\u0110\u1ECBa L\xF4i Ph\u1EE5c",
      en: "Return",
      upper: "kun",
      lower: "zhen",
      meaning: "Tr\u1EDF l\u1EA1i, ph\u1EE5c h\u1ED3i; d\u01B0\u01A1ng kh\xED b\u1EAFt \u0111\u1EA7u quay v\u1EC1",
      guaci: "\u4EA8\u3002\u51FA\u5165\u65E0\u75BE\uFF0C\u670B\u4F86\u65E0\u548E\u3002\u53CD\u5FA9\u5176\u9053\uFF0C\u4E03\u65E5\u4F86\u5FA9\uFF0C\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5FA9\u4EA8\uFF1B\u525B\u53CD\uFF0C\u52D5\u800C\u4EE5\u9806\u884C\uFF0C\u662F\u4EE5\u51FA\u5165\u65E0\u75BE\uFF0C\u670B\u4F86\u65E0\u548E\u3002\u53CD\u5FA9\u5176\u9053\uFF0C\u4E03\u65E5\u4F86\u5FA9\uFF0C\u5929\u884C\u4E5F\u3002\u5229\u6709\u6538\u5F80\uFF0C\u525B\u9577\u4E5F\u3002\u5FA9\u5176\u898B\u5929\u5730\u4E4B\u5FC3\u4E4E\uFF1F",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u5728\u5730\u4E2D\uFF0C\u5FA9\uFF1B\u5148\u738B\u4EE5\u81F3\u65E5\u9589\u95DC\uFF0C\u5546\u65C5\u4E0D\u884C\uFF0C\u540E\u4E0D\u7701\u65B9\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u4E0D\u9060\u5FA9\uFF0C\u65E0\u7947\u6094\uFF0C\u5143\u5409\u3002",
        "\u516D\u4E8C\uFF1A\u4F11\u5FA9\uFF0C\u5409\u3002",
        "\u516D\u4E09\uFF1A\u983B\u5FA9\uFF0C\u53B2\u65E0\u548E\u3002",
        "\u516D\u56DB\uFF1A\u4E2D\u884C\u7368\u5FA9\u3002",
        "\u516D\u4E94\uFF1A\u6566\u5FA9\uFF0C\u65E0\u6094\u3002",
        "\u4E0A\u516D\uFF1A\u8FF7\u5FA9\uFF0C\u51F6\uFF0C\u6709\u707D\u771A\u3002\u7528\u884C\u5E2B\uFF0C\u7D42\u6709\u5927\u6557\uFF0C\u4EE5\u5176\u570B\u541B\uFF0C\u51F6\uFF1B\u81F3\u4E8E\u5341\u5E74\uFF0C\u4E0D\u514B\u5F81\u3002"
      ],
      mutual: 2,
      mutual_vi: "Thu\u1EA7n Kh\xF4n"
    },
    {
      n: 25,
      zh: "\u5929\u96F7\u7121\u5984",
      vi: "Thi\xEAn L\xF4i V\xF4 V\u1ECDng",
      en: "Innocence",
      upper: "qian",
      lower: "zhen",
      meaning: "Kh\xF4ng c\xE0n b\u1EADy; ch\xE2n th\u1EADt, tai h\u1ECDa b\u1EA5t ng\u1EDD",
      guaci: "\u5143\u4EA8\uFF0C\u5229\u8C9E\u3002\u5176\u532A\u6B63\u6709\u771A\uFF0C\u4E0D\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u7121\u5984\uFF0C\u525B\u81EA\u5916\u4F86\u800C\u70BA\u4E3B\u65BC\u5167\u3002\u52D5\u800C\u5065\uFF0C\u525B\u4E2D\u800C\u61C9\uFF0C\u5927\u4EA8\u4EE5\u6B63\uFF0C\u5929\u4E4B\u547D\u4E5F\u3002\u300C\u5176\u532A\u6B63\u6709\u771A\uFF0C\u4E0D\u5229\u6709\u6538\u5F80\u300D\uFF0C\u7121\u5984\u4E4B\u5F80\uFF0C\u4F55\u4E4B\u77E3\uFF1F\u5929\u547D\u4E0D\u4F51\u884C\u77E3\u54C9\uFF1F",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u4E0B\u96F7\u884C\uFF0C\u7269\u8207\u7121\u5984\u3002\u5148\u738B\u4EE5\u8302\u5C0D\u6642\uFF0C\u80B2\u842C\u7269\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u7121\u5984\u5F80\uFF0C\u5409\u3002",
        "\u516D\u4E8C\uFF1A\u4E0D\u8015\u7372\uFF0C\u4E0D\u83D1\u756C\uFF0C\u5247\u5229\u6709\u6538\u5F80\u3002",
        "\u516D\u4E09\uFF1A\u7121\u5984\u4E4B\u707D\uFF0C\u6216\u7CFB\u4E4B\u725B\uFF0C\u884C\u4EBA\u4E4B\u5F97\uFF0C\u9091\u4EBA\u4E4B\u707D\u3002",
        "\u4E5D\u56DB\uFF1A\u53EF\u8C9E\uFF0C\u7121\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u7121\u5984\u4E4B\u75BE\uFF0C\u52FF\u85E5\u6709\u559C\u3002",
        "\u4E0A\u4E5D\uFF1A\u7121\u5984\u884C\uFF0C\u6709\u771A\uFF0C\u7121\u6538\u5229\u3002"
      ],
      mutual: 53,
      mutual_vi: "Phong S\u01A1n Ti\u1EC7m"
    },
    {
      n: 26,
      zh: "\u5C71\u5929\u5927\u755C",
      vi: "S\u01A1n Thi\xEAn \u0110\u1EA1i S\xFAc",
      en: "Great Taming",
      upper: "gen",
      lower: "qian",
      meaning: "T\xEDch l\u1EDBn; nu\xF4i d\u01B0\u1EE1ng t\xE0i \u0111\u1EE9c, ch\u1EDD th\u1EDDi ra gi\xFAp \u0111\u1EDDi",
      guaci: "\u5229\u8C9E\uFF0C\u4E0D\u5BB6\u98DF\u5409\uFF0C\u5229\u6D89\u5927\u5DDD\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5927\u755C\uFF0C\u525B\u5065\u7BE4\u5BE6\u8F1D\u5149\uFF0C\u65E5\u65B0\u5176\u5FB7\uFF0C\u525B\u4E0A\u800C\u5C1A\u8CE2\u3002\u80FD\u6B62\u5065\uFF0C\u5927\u6B63\u4E5F\u3002\u4E0D\u5BB6\u98DF\u5409\uFF0C\u990A\u8CE2\u4E5F\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u61C9\u4E4E\u5929\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u5728\u5C71\u4E2D\uFF0C\u5927\u755C\uFF1B\u541B\u5B50\u4EE5\u591A\u8B58\u524D\u8A00\u5F80\u884C\uFF0C\u4EE5\u755C\u5176\u5FB7\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u6709\u53B2\u5229\u5DF2\u3002",
        "\u4E5D\u4E8C\uFF1A\u8F3F\u8AAA\u8179\u3002",
        "\u4E5D\u4E09\uFF1A\u826F\u99AC\u9010\uFF0C\u5229\u8271\u8C9E\uFF0C\u5409\u3002\u65E5\u9591\u8F3F\u885B\uFF0C\u5229\u6709\u6538\u5F80\u3002",
        "\u516D\u56DB\uFF1A\u7AE5\u725B\u4E4B\u727F\uFF0C\u5143\u5409\u3002",
        "\u516D\u4E94\uFF1A\u8C76\u8C55\u4E4B\u7259\uFF0C\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u4F55\u5929\u4E4B\u8862\uFF0C\u4EA8\u3002"
      ],
      mutual: 54,
      mutual_vi: "L\xF4i Tr\u1EA1ch Quy Mu\u1ED9i"
    },
    {
      n: 27,
      zh: "\u5C71\u96F7\u9824",
      vi: "S\u01A1n L\xF4i Di",
      en: "Nourishment",
      upper: "gen",
      lower: "zhen",
      meaning: "Nu\xF4i d\u01B0\u1EE1ng; c\u1EA9n tr\u1ECDng l\u1EDDi n\xF3i v\xE0 \u0103n u\u1ED1ng",
      guaci: "\u8C9E\u5409\u3002\u89C0\u9824\uFF0C\u81EA\u6C42\u53E3\u5BE6\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u9824\u8C9E\u5409\uFF0C\u990A\u6B63\u5247\u5409\u4E5F\u3002\u89C0\u9824\uFF0C\u89C0\u5176\u6240\u990A\u4E5F\uFF1B\u81EA\u6C42\u53E3\u5BE6\uFF0C\u89C0\u5176\u81EA\u990A\u4E5F\u3002\u5929\u5730\u990A\u842C\u7269\uFF0C\u8056\u4EBA\u990A\u8CE2\uFF0C\u4EE5\u53CA\u842C\u6C11\uFF1B\u9824\u4E4B\u6642\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0B\u6709\u96F7\uFF0C\u9824\uFF1B\u541B\u5B50\u4EE5\u614E\u8A00\u8A9E\uFF0C\u7BC0\u98F2\u98DF\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u820D\u723E\u9748\u9F9C\uFF0C\u89C0\u6211\u6735\u9824\uFF0C\u51F6\u3002",
        "\u516D\u4E8C\uFF1A\u985B\u9824\uFF0C\u62C2\u7D93\uFF0C\u4E8E\u4E18\u9824\uFF0C\u5F81\u51F6\u3002",
        "\u516D\u4E09\uFF1A\u62C2\u9824\uFF0C\u8C9E\u51F6\uFF0C\u5341\u5E74\u52FF\u7528\uFF0C\u65E0\u6538\u5229\u3002",
        "\u516D\u56DB\uFF1A\u985B\u9824\u5409\uFF0C\u864E\u8996\u7708\u7708\uFF0C\u5176\u6B32\u9010\u9010\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u62C2\u7D93\uFF0C\u5C45\u8C9E\u5409\uFF0C\u4E0D\u53EF\u6D89\u5927\u5DDD\u3002",
        "\u4E0A\u4E5D\uFF1A\u7531\u9824\uFF0C\u53B2\u5409\uFF0C\u5229\u6D89\u5927\u5DDD\u3002"
      ],
      mutual: 2,
      mutual_vi: "Thu\u1EA7n Kh\xF4n"
    },
    {
      n: 28,
      zh: "\u6FA4\u98A8\u5927\u904E",
      vi: "Tr\u1EA1ch Phong \u0110\u1EA1i Qu\xE1",
      en: "Great Exceeding",
      upper: "dui",
      lower: "xun",
      meaning: "Qu\xE1 l\u1EDBn; g\xE1nh n\u1EB7ng qu\xE1 s\u1EE9c, c\u1ED9t k\xE8o cong",
      guaci: "\u68DF\u6A48\uFF0C\u5229\u6709\u6538\u5F80\uFF0C\u4EA8\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5927\u904E\uFF0C\u5927\u8005\u904E\u4E5F\u3002\u68DF\u6A48\uFF0C\u672C\u672B\u5F31\u4E5F\u3002\u525B\u904E\u800C\u4E2D\uFF0C\u5DFD\u800C\u8AAA\u884C\uFF0C\u5229\u6709\u6538\u5F80\uFF0C\u4E43\u4EA8\u3002\u5927\u904E\u4E4B\u6642\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u6EC5\u6728\uFF0C\u5927\u904E\u3002\u541B\u5B50\u4EE5\u7368\u7ACB\u4E0D\u61FC\uFF0C\u906F\u4E16\u65E0\u60B6\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u85C9\u7528\u767D\u8305\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u67AF\u694A\u751F\u7A0A\uFF0C\u8001\u592B\u5F97\u5176\u5973\u59BB\uFF0C\u65E0\u4E0D\u5229\u3002",
        "\u4E5D\u4E09\uFF1A\u68DF\u6A48\uFF0C\u51F6\u3002",
        "\u4E5D\u56DB\uFF1A\u68DF\u9686\uFF0C\u5409\u3002\u6709\u5B83\u541D\u3002",
        "\u4E5D\u4E94\uFF1A\u67AF\u694A\u751F\u83EF\uFF0C\u8001\u5A66\u5F97\u5176\u58EB\u592B\uFF0C\u65E0\u548E\u65E0\u8B7D\u3002",
        "\u4E0A\u516D\uFF1A\u904E\u6D89\u6EC5\u9802\uFF0C\u51F6\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 1,
      mutual_vi: "Thu\u1EA7n C\xE0n"
    },
    {
      n: 29,
      zh: "\u574E\u70BA\u6C34",
      vi: "Thu\u1EA7n Kh\u1EA3m",
      en: "The Abysmal (Water)",
      upper: "kan",
      lower: "kan",
      meaning: "Hi\u1EC3m nguy ch\u1ED3ng ch\u1EA5t; gi\u1EEF l\xF2ng tin \u0111\u1EC3 v\u01B0\u1EE3t hi\u1EC3m",
      guaci: "\u7FD2\u574E\uFF1A\u6709\u5B5A\uFF0C\u7DAD\u5FC3\u4EA8\u3002\u884C\u6709\u5C1A\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u7FD2\u574E\uFF0C\u91CD\u96AA\u4E5F\u3002\u6C34\u6D41\u800C\u4E0D\u76C8\uFF0C\u884C\u96AA\u800C\u4E0D\u5931\u5176\u4FE1\u3002\u7DAD\u5FC3\u4EA8\uFF0C\u4E43\u4EE5\u525B\u4E2D\u4E5F\u3002\u884C\u6709\u5C1A\uFF0C\u5F80\u6709\u529F\u4E5F\u3002\u5929\u96AA\u4E0D\u53EF\u5347\u4E5F\uFF0C\u5730\u96AA\u5C71\u5DDD\u4E18\u9675\u4E5F\uFF0C\u738B\u516C\u8A2D\u96AA\u4EE5\u5B88\u5176\u570B\uFF0C\u574E\u4E4B\u6642\u7528\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6C34\u6D0A\u81F3\uFF0C\u7FD2\u574E\uFF1B\u541B\u5B50\u4EE5\u5E38\u5FB7\u884C\uFF0C\u7FD2\u6559\u4E8B\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u7FD2\u574E\uFF0C\u5165\u4E8E\u574E\u7A9E\uFF0C\u51F6\u3002",
        "\u4E5D\u4E8C\uFF1A\u574E\u6709\u96AA\uFF0C\u6C42\u5C0F\u5F97\u3002",
        "\u516D\u4E09\uFF1A\u4F86\u4E4B\u574E\u574E\uFF0C\u96AA\u4E14\u6795\uFF0C\u5165\u4E8E\u574E\u7A9E\uFF0C\u52FF\u7528\u3002",
        "\u516D\u56DB\uFF1A\u6A3D\u9152\u7C0B\u8CB3\uFF0C\u7528\u7F36\uFF0C\u7D0D\u7D04\u81EA\u7256\uFF0C\u7D42\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u574E\u4E0D\u76C8\uFF0C\u7957\u65E2\u5E73\uFF0C\u65E0\u548E\u3002",
        "\u4E0A\u516D\uFF1A\u4FC2\u7528\u5FBD\u7E86\uFF0C\u5BD8\u4E8E\u53E2\u68D8\uFF0C\u4E09\u6B72\u4E0D\u5F97\uFF0C\u51F6\u3002"
      ],
      mutual: 27,
      mutual_vi: "S\u01A1n L\xF4i Di"
    },
    {
      n: 30,
      zh: "\u96E2\u70BA\u706B",
      vi: "Thu\u1EA7n Ly",
      en: "The Clinging (Fire)",
      upper: "li",
      lower: "li",
      meaning: "S\xE1ng, n\u01B0\u01A1ng t\u1EF1a; v\u0103n minh, b\xE1m v\xE0o ch\u1ED7 \u0111\xFAng",
      guaci: "\u5229\u8C9E\u3002\u4EA8\u3002\u755C\u725D\u725B\uFF0C\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u96E2\uFF0C\u9E97\u4E5F\uFF1B\u65E5\u6708\u9E97\u4E4E\u5929\uFF0C\u767E\u7A40\u8349\u6728\u9E97\u4E4E\u571F\uFF0C\u91CD\u660E\u4EE5\u9E97\u4E4E\u6B63\uFF0C\u4E43\u5316\u6210\u5929\u4E0B\u3002\u67D4\u9E97\u4E4E\u4E2D\u6B63\uFF0C\u6545\u4EA8\uFF1B\u662F\u4EE5\u755C\u725D\u725B\u5409\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u660E\u5169\u4F5C\u96E2\uFF0C\u5927\u4EBA\u4EE5\u7E7C\u660E\u7167\u4E8E\u56DB\u65B9\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u5C65\u932F\u7136\uFF0C\u656C\u4E4B\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u9EC3\u96E2\uFF0C\u5143\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u65E5\u6603\u4E4B\u96E2\uFF0C\u4E0D\u9F13\u7F36\u800C\u6B4C\uFF0C\u5247\u5927\u800B\u4E4B\u55DF\uFF0C\u51F6\u3002",
        "\u4E5D\u56DB\uFF1A\u7A81\u5982\u5176\u4F86\u5982\uFF0C\u711A\u5982\uFF0C\u6B7B\u5982\uFF0C\u68C4\u5982\u3002",
        "\u516D\u4E94\uFF1A\u51FA\u6D95\u6CB1\u82E5\uFF0C\u621A\u55DF\u82E5\uFF0C\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u738B\u7528\u51FA\u5F81\uFF0C\u6709\u5609\u6298\u9996\uFF0C\u7372\u532A\u5176\u919C\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 28,
      mutual_vi: "Tr\u1EA1ch Phong \u0110\u1EA1i Qu\xE1"
    },
    {
      n: 31,
      zh: "\u6FA4\u5C71\u54B8",
      vi: "Tr\u1EA1ch S\u01A1n H\xE0m",
      en: "Influence",
      upper: "dui",
      lower: "gen",
      meaning: "C\u1EA3m \u1EE9ng, t\xECnh c\u1EA3m nam n\u1EEF",
      guaci: "\u4EA8\u3002\u5229\u8C9E\u3002\u53D6\u5973\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u54B8\uFF0C\u611F\u4E5F\u3002\u67D4\u4E0A\u800C\u525B\u4E0B\uFF0C\u4E8C\u6C23\u611F\u61C9\u4EE5\u76F8\u8207\uFF0C\u6B62\u800C\u8AAA\uFF0C\u7537\u4E0B\u5973\uFF0C\u662F\u4EE5\u4EA8\u5229\u8C9E\uFF0C\u53D6\u5973\u5409\u4E5F\u3002\u5929\u5730\u611F\u800C\u842C\u7269\u5316\u751F\uFF0C\u8056\u4EBA\u611F\u4EBA\u5FC3\u800C\u5929\u4E0B\u548C\u5E73\uFF1B\u89C0\u5176\u6240\u611F\uFF0C\u800C\u5929\u5730\u842C\u7269\u4E4B\u60C5\u53EF\u898B\u77E3\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0A\u6709\u6FA4\uFF0C\u54B8\uFF1B\u541B\u5B50\u4EE5\u865B\u53D7\u4EBA\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u54B8\u5176\u6BCD\u3002",
        "\u516D\u4E8C\uFF1A\u54B8\u5176\u8153\uFF0C\u51F6\uFF0C\u5C45\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u54B8\u5176\u80A1\uFF0C\u57F7\u5176\u96A8\uFF0C\u5F80\u541D\u3002",
        "\u4E5D\u56DB\uFF1A\u8C9E\u5409\u6094\u4EA1\uFF0C\u61A7\u61A7\u5F80\u4F86\uFF0C\u670B\u5F9E\u723E\u601D\u3002",
        "\u4E5D\u4E94\uFF1A\u54B8\u5176\u8122\uFF0C\u65E0\u6094\u3002",
        "\u4E0A\u516D\uFF1A\u54B8\u5176\u8F14\uFF0C\u9830\uFF0C\u820C\u3002"
      ],
      mutual: 44,
      mutual_vi: "Thi\xEAn Phong C\u1EA5u"
    },
    {
      n: 32,
      zh: "\u96F7\u98A8\u6046",
      vi: "L\xF4i Phong H\u1EB1ng",
      en: "Duration",
      upper: "zhen",
      lower: "xun",
      meaning: "B\u1EC1n l\xE2u; \u0111\u1EA1o v\u1EE3 ch\u1ED3ng l\xE2u d\xE0i",
      guaci: "\u4EA8\uFF0C\u7121\u548E\uFF0C\u5229\u8C9E\uFF0C\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6046\uFF0C\u4E45\u4E5F\u3002\u525B\u4E0A\u800C\u67D4\u4E0B\uFF0C\u96F7\u98A8\u76F8\u8207\uFF0C\u5DFD\u800C\u52D5\uFF0C\u525B\u67D4\u7686\u61C9\uFF0C\u6046\u3002\u300C\u6046\uFF0C\u4EA8\uFF0C\u7121\u548E\uFF0C\u5229\u8C9E\u300D\uFF0C\u4E45\u65BC\u5176\u9053\u4E5F\uFF0C\u5929\u5730\u4E4B\u9053\uFF0C\u6046\u4E45\u800C\u4E0D\u5DF2\u4E5F\u3002\u300C\u5229\u6709\u6538\u5F80\u300D\uFF0C\u7D42\u5247\u6709\u59CB\u4E5F\u3002\u65E5\u6708\u5F97\u5929\u800C\u80FD\u4E45\u7167\uFF0C\u56DB\u6642\u8B8A\u5316\u800C\u80FD\u4E45\u6210\uFF0C\u8056\u4EBA\u4E45\u65BC\u5176\u9053\u800C\u5929\u4E0B\u5316\u6210\u3002\u89C0\u5176\u6240\u6046\uFF0C\u800C\u5929\u5730\u842C\u7269\u4E4B\u60C5\u53EF\u898B\u77E3\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u98A8\uFF0C\u6046\u3002\u541B\u5B50\u4EE5\u7ACB\u4E0D\u6613\u65B9\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u6D5A\u6046\uFF0C\u8C9E\u51F6\uFF0C\u7121\u6538\u5229\u3002",
        "\u4E5D\u4E8C\uFF1A\u6094\u4EA1\u3002",
        "\u4E5D\u4E09\uFF1A\u4E0D\u6046\u5176\u5FB7\uFF0C\u6216\u627F\u4E4B\u7F9E\uFF0C\u8C9E\u541D\u3002",
        "\u4E5D\u56DB\uFF1A\u7530\u7121\u79BD\u3002",
        "\u516D\u4E94\uFF1A\u6046\u5176\u5FB7\uFF0C\u8C9E\u5A66\u4EBA\u5409\uFF0C\u592B\u5B50\u51F6\u3002",
        "\u4E0A\u516D\uFF1A\u632F\u6046\uFF0C\u51F6\u3002"
      ],
      mutual: 43,
      mutual_vi: "Tr\u1EA1ch Thi\xEAn Qu\u1EA3i"
    },
    {
      n: 33,
      zh: "\u5929\u5C71\u906F",
      vi: "Thi\xEAn S\u01A1n \u0110\u1ED9n",
      en: "Retreat",
      upper: "qian",
      lower: "gen",
      meaning: "Lui \u1EA9n \u0111\xFAng l\xFAc \u0111\u1EC3 gi\u1EEF m\xECnh",
      guaci: "\u4EA8\u3002\u5C0F\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u906F\u4EA8\uFF0C\u906F\u800C\u4EA8\u4E5F\u3002\u525B\u7576\u4F4D\u800C\u61C9\uFF0C\u8207\u6642\u884C\u4E5F\u3002\u5C0F\u5229\u8C9E\uFF0C\u6D78\u800C\u9577\u4E5F\u3002\u906F\u4E4B\u6642\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u4E0B\u6709\u5C71\uFF0C\u906F\uFF1B\u541B\u5B50\u4EE5\u9060\u5C0F\u4EBA\uFF0C\u4E0D\u60E1\u800C\u56B4\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u906F\u5C3E\uFF0C\u53B2\uFF0C\u52FF\u7528\u6709\u6538\u5F80\u3002",
        "\u516D\u4E8C\uFF1A\u57F7\u4E4B\u7528\u9EC3\u725B\u4E4B\u9769\uFF0C\u83AB\u4E4B\u52DD\u8AAA\u3002",
        "\u4E5D\u4E09\uFF1A\u4FC2\u906F\uFF0C\u6709\u75BE\u53B2\uFF0C\u755C\u81E3\u59BE\u5409\u3002",
        "\u4E5D\u56DB\uFF1A\u597D\u906F\u541B\u5B50\u5409\uFF0C\u5C0F\u4EBA\u5426\u3002",
        "\u4E5D\u4E94\uFF1A\u5609\u906F\uFF0C\u8C9E\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u80A5\u906F\uFF0C\u65E0\u4E0D\u5229\u3002"
      ],
      mutual: 44,
      mutual_vi: "Thi\xEAn Phong C\u1EA5u"
    },
    {
      n: 34,
      zh: "\u96F7\u5929\u5927\u58EF",
      vi: "L\xF4i Thi\xEAn \u0110\u1EA1i Tr\xE1ng",
      en: "Great Power",
      upper: "zhen",
      lower: "qian",
      meaning: "M\u1EA1nh l\u1EDBn; m\u1EA1nh nh\u01B0ng ph\u1EA3i gi\u1EEF ch\xEDnh \u0111\u1EA1o",
      guaci: "\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5927\u58EF\uFF0C\u5927\u8005\u58EF\u4E5F\u3002\u525B\u4EE5\u52D5\uFF0C\u6545\u58EF\u3002\u5927\u58EF\u5229\u8C9E\uFF1B\u5927\u8005\u6B63\u4E5F\u3002\u6B63\u5927\u800C\u5929\u5730\u4E4B\u60C5\u53EF\u898B\u77E3\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u5728\u5929\u4E0A\uFF0C\u5927\u58EF\uFF1B\u541B\u5B50\u4EE5\u975E\u79AE\u5F17\u5C65\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u58EF\u4E8E\u8DBE\uFF0C\u5F81\u51F6\uFF0C\u6709\u5B5A\u3002",
        "\u4E5D\u4E8C\uFF1A\u8C9E\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u5C0F\u4EBA\u7528\u58EF\uFF0C\u541B\u5B50\u7528\u7F54\uFF0C\u8C9E\u53B2\u3002\u7F9D\u7F8A\u89F8\u85E9\uFF0C\u7FB8\u5176\u89D2\u3002",
        "\u4E5D\u56DB\uFF1A\u8C9E\u5409\u6094\u4EA1\uFF0C\u85E9\u6C7A\u4E0D\u7FB8\uFF0C\u58EF\u4E8E\u5927\u8F3F\u4E4B\u8F39\u3002",
        "\u516D\u4E94\uFF1A\u55AA\u7F8A\u4E8E\u6613\uFF0C\u65E0\u6094\u3002",
        "\u4E0A\u516D\uFF1A\u7F9D\u7F8A\u89F8\u85E9\uFF0C\u4E0D\u80FD\u9000\uFF0C\u4E0D\u80FD\u9042\uFF0C\u65E0\u6538\u5229\uFF0C\u8271\u5247\u5409\u3002"
      ],
      mutual: 43,
      mutual_vi: "Tr\u1EA1ch Thi\xEAn Qu\u1EA3i"
    },
    {
      n: 35,
      zh: "\u706B\u5730\u6649",
      vi: "H\u1ECFa \u0110\u1ECBa T\u1EA5n",
      en: "Progress",
      upper: "li",
      lower: "kun",
      meaning: "Ti\u1EBFn l\xEAn nh\u01B0 m\u1EB7t tr\u1EDDi m\u1ECDc",
      guaci: "\u5EB7\u4FAF\u7528\u932B\u99AC\u8543\u5EB6\uFF0C\u665D\u65E5\u4E09\u63A5\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6649\uFF0C\u9032\u4E5F\u3002\u660E\u51FA\u5730\u4E0A\uFF0C\u9806\u800C\u9E97\u4E4E\u5927\u660E\uFF0C\u67D4\u9032\u800C\u4E0A\u884C\u3002\u662F\u4EE5\u5EB7\u4FAF\u7528\u932B\u99AC\u8543\u5EB6\uFF0C\u665D\u65E5\u4E09\u63A5\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u660E\u51FA\u5730\u4E0A\uFF0C\u6649\uFF1B\u541B\u5B50\u4EE5\u81EA\u662D\u660E\u5FB7\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u6649\u5982\uFF0C\u6467\u5982\uFF0C\u8C9E\u5409\u3002\u7F54\u5B5A\uFF0C\u88D5\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u6649\u5982\uFF0C\u6101\u5982\uFF0C\u8C9E\u5409\u3002\u53D7\u8332\u4ECB\u798F\uFF0C\u4E8E\u5176\u738B\u6BCD\u3002",
        "\u516D\u4E09\uFF1A\u773E\u5141\uFF0C\u6094\u4EA1\u3002",
        "\u4E5D\u56DB\uFF1A\u6649\u5982\u78A9\u9F20\uFF0C\u8C9E\u53B2\u3002",
        "\u516D\u4E94\uFF1A\u6094\u4EA1\uFF0C\u5931\u5F97\u52FF\u6064\uFF0C\u5F80\u5409\u65E0\u4E0D\u5229\u3002",
        "\u4E0A\u4E5D\uFF1A\u6649\u5176\u89D2\uFF0C\u7DAD\u7528\u4F10\u9091\uFF0C\u53B2\u5409\u65E0\u548E\uFF0C\u8C9E\u541D\u3002"
      ],
      mutual: 39,
      mutual_vi: "Th\u1EE7y S\u01A1n Ki\u1EC3n"
    },
    {
      n: 36,
      zh: "\u5730\u706B\u660E\u5937",
      vi: "\u0110\u1ECBa H\u1ECFa Minh Di",
      en: "Darkening of the Light",
      upper: "kun",
      lower: "li",
      meaning: "\xC1nh s\xE1ng b\u1ECB che, b\u1ECB t\u1ED5n th\u01B0\u01A1ng; gi\u1EA5u t\xE0i gi\u1EEF m\xECnh",
      guaci: "\u5229\u8271\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u660E\u5165\u5730\u4E2D\uFF0C\u660E\u5937\u3002\u5167\u6587\u660E\u800C\u5916\u67D4\u9806\uFF0C\u4EE5\u8499\u5927\u96E3\uFF0C\u6587\u738B\u4EE5\u4E4B\u3002\u5229\u8271\u8C9E\uFF0C\u6666\u5176\u660E\u4E5F\uFF0C\u5167\u96E3\u800C\u80FD\u6B63\u5176\u5FD7\uFF0C\u7B95\u5B50\u4EE5\u4E4B\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u660E\u5165\u5730\u4E2D\uFF0C\u660E\u5937\uFF1B\u541B\u5B50\u4EE5\u849E\u773E\uFF0C\u7528\u6666\u800C\u660E\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u660E\u5937\u4E8E\u98DB\uFF0C\u5782\u5176\u7FFC\u3002\u541B\u5B50\u4E8E\u884C\uFF0C\u4E09\u65E5\u4E0D\u98DF\uFF0C\u6709\u6538\u5F80\uFF0C\u4E3B\u4EBA\u6709\u8A00\u3002",
        "\u516D\u4E8C\uFF1A\u660E\u5937\uFF0C\u5937\u4E8E\u5DE6\u80A1\uFF0C\u7528\u62EF\u99AC\u58EF\uFF0C\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u660E\u5937\u4E8E\u5357\u72E9\uFF0C\u5F97\u5176\u5927\u9996\uFF0C\u4E0D\u53EF\u75BE\u8C9E\u3002",
        "\u516D\u56DB\uFF1A\u5165\u4E8E\u5DE6\u8179\uFF0C\u7372\u660E\u5937\u4E4B\u5FC3\uFF0C\u4E8E\u51FA\u9580\u5EAD\u3002",
        "\u516D\u4E94\uFF1A\u7B95\u5B50\u4E4B\u660E\u5937\uFF0C\u5229\u8C9E\u3002",
        "\u4E0A\u516D\uFF1A\u4E0D\u660E\u6666\uFF0C\u521D\u767B\u4E8E\u5929\uFF0C\u5F8C\u5165\u4E8E\u5730\u3002"
      ],
      mutual: 40,
      mutual_vi: "L\xF4i Th\u1EE7y Gi\u1EA3i"
    },
    {
      n: 37,
      zh: "\u98A8\u706B\u5BB6\u4EBA",
      vi: "Phong H\u1ECFa Gia Nh\xE2n",
      en: "The Family",
      upper: "xun",
      lower: "li",
      meaning: "Ng\u01B0\u1EDDi nh\xE0; \u0111\u1EA1o gia \u0111\xECnh, m\u1ED7i ng\u01B0\u1EDDi \u0111\xFAng v\u1ECB tr\xED",
      guaci: "\u5229\u5973\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5BB6\u4EBA\uFF0C\u5973\u6B63\u4F4D\u4E4E\u5167\uFF0C\u7537\u6B63\u4F4D\u4E4E\u5916\uFF0C\u7537\u5973\u6B63\uFF0C\u5929\u5730\u4E4B\u5927\u7FA9\u4E5F\u3002\u5BB6\u4EBA\u6709\u56B4\u541B\u7109\uFF0C\u7236\u6BCD\u4E4B\u8B02\u4E5F\u3002\u7236\u7236\uFF0C\u5B50\u5B50\uFF0C\u5144\u5144\uFF0C\u5F1F\u5F1F\uFF0C\u592B\u592B\uFF0C\u5A66\u5A66\uFF0C\u800C\u5BB6\u9053\u6B63\uFF1B\u6B63\u5BB6\u800C\u5929\u4E0B\u5B9A\u77E3\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u98A8\u81EA\u706B\u51FA\uFF0C\u5BB6\u4EBA\uFF1B\u541B\u5B50\u4EE5\u8A00\u6709\u7269\uFF0C\u800C\u884C\u6709\u6046\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u9591\u6709\u5BB6\uFF0C\u6094\u4EA1\u3002",
        "\u516D\u4E8C\uFF1A\u65E0\u6538\u9042\uFF0C\u5728\u4E2D\u994B\uFF0C\u8C9E\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u5BB6\u4EBA\u55C3\u55C3\uFF0C\u6094\u53B2\u5409\uFF1B\u5A66\u5B50\u563B\u563B\uFF0C\u7D42\u541D\u3002",
        "\u516D\u56DB\uFF1A\u5BCC\u5BB6\uFF0C\u5927\u5409\u3002",
        "\u4E5D\u4E94\uFF1A\u738B\u5047\u6709\u5BB6\uFF0C\u52FF\u6064\u3002\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u6709\u5B5A\u5A01\u5982\uFF0C\u7D42\u5409\u3002"
      ],
      mutual: 64,
      mutual_vi: "H\u1ECFa Th\u1EE7y V\u1ECB T\u1EBF"
    },
    {
      n: 38,
      zh: "\u706B\u6FA4\u777D",
      vi: "H\u1ECFa Tr\u1EA1ch Khu\xEA",
      en: "Opposition",
      upper: "li",
      lower: "dui",
      meaning: "Chia l\xECa, tr\xE1i \xFD; t\xECm \u0111i\u1EC3m chung trong kh\xE1c bi\u1EC7t",
      guaci: "\u5C0F\u4E8B\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u777D\uFF0C\u706B\u52D5\u800C\u4E0A\uFF0C\u6FA4\u52D5\u800C\u4E0B\uFF1B\u4E8C\u5973\u540C\u5C45\uFF0C\u5176\u5FD7\u4E0D\u540C\u884C\uFF1B\u8AAA\u800C\u9E97\u4E4E\u660E\uFF0C\u67D4\u9032\u800C\u4E0A\u884C\uFF0C\u5F97\u4E2D\u800C\u61C9\u4E4E\u525B\uFF1B\u662F\u4EE5\u5C0F\u4E8B\u5409\u3002\u5929\u5730\u777D\uFF0C\u800C\u5176\u4E8B\u540C\u4E5F\uFF1B\u7537\u5973\u777D\uFF0C\u800C\u5176\u5FD7\u901A\u4E5F\uFF1B\u842C\u7269\u777D\uFF0C\u800C\u5176\u4E8B\u985E\u4E5F\uFF1B\u777D\u4E4B\u6642\u7528\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u4E0A\u706B\u4E0B\u6FA4\uFF0C\u777D\uFF1B\u541B\u5B50\u4EE5\u540C\u800C\u7570\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u6094\u4EA1\uFF0C\u55AA\u99AC\u52FF\u9010\uFF0C\u81EA\u5FA9\uFF1B\u898B\u60E1\u4EBA\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u9047\u4E3B\u4E8E\u5DF7\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E09\uFF1A\u898B\u8F3F\u66F3\uFF0C\u5176\u725B\u63A3\uFF0C\u5176\u4EBA\u5929\u4E14\u5293\uFF0C\u65E0\u521D\u6709\u7D42\u3002",
        "\u4E5D\u56DB\uFF1A\u777D\u5B64\uFF0C\u9047\u5143\u592B\uFF0C\u4EA4\u5B5A\uFF0C\u53B2\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u6094\u4EA1\uFF0C\u53A5\u5B97\u566C\u819A\uFF0C\u5F80\u4F55\u548E\u3002",
        "\u4E0A\u4E5D\uFF1A\u777D\u5B64\uFF0C \u898B\u8C55\u8CA0\u6D82\uFF0C\u8F09\u9B3C\u4E00\u8ECA\uFF0C \u5148\u5F35\u4E4B\u5F27\uFF0C\u5F8C\u8AAA\u4E4B\u5F27\uFF0C\u532A\u5BC7\u5A5A\u5ABE\uFF0C\u5F80\u9047\u96E8\u5247\u5409\u3002"
      ],
      mutual: 63,
      mutual_vi: "Th\u1EE7y H\u1ECFa K\xFD T\u1EBF"
    },
    {
      n: 39,
      zh: "\u6C34\u5C71\u8E47",
      vi: "Th\u1EE7y S\u01A1n Ki\u1EC3n",
      en: "Obstruction",
      upper: "kan",
      lower: "gen",
      meaning: "Gian nan, \u0111i kh\xF3; quay l\u1EA1i tu th\xE2n",
      guaci: "\u5229\u897F\u5357\uFF0C\u4E0D\u5229\u6771\u5317\uFF1B\u5229\u898B\u5927\u4EBA\uFF0C\u8C9E\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8E47\uFF0C\u96E3\u4E5F\uFF0C\u96AA\u5728\u524D\u4E5F\u3002\u898B\u96AA\u800C\u80FD\u6B62\uFF0C\u77E5\u77E3\u54C9\uFF01\u8E47\u5229\u897F\u5357\uFF0C\u5F80\u5F97\u4E2D\u4E5F\uFF1B\u4E0D\u5229\u6771\u5317\uFF0C\u5176\u9053\u7AAE\u4E5F\u3002\u5229\u898B\u5927\u4EBA\uFF0C\u5F80\u6709\u529F\u4E5F\u3002\u7576\u4F4D\u8C9E\u5409\uFF0C\u4EE5\u6B63\u90A6\u4E5F\u3002\u8E47\u4E4B\u6642\u7528\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0A\u6709\u6C34\uFF0C\u8E47\uFF1B\u541B\u5B50\u4EE5\u53CD\u8EAB\u4FEE\u5FB7\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u5F80\u8E47\uFF0C\u4F86\u8B7D\u3002",
        "\u516D\u4E8C\uFF1A\u738B\u81E3\u8E47\u8E47\uFF0C\u532A\u8EAC\u4E4B\u6545\u3002",
        "\u4E5D\u4E09\uFF1A\u5F80\u8E47\u4F86\u53CD\u3002",
        "\u516D\u56DB\uFF1A\u5F80\u8E47\u4F86\u9023\u3002",
        "\u4E5D\u4E94\uFF1A\u5927\u8E47\u670B\u4F86\u3002",
        "\u4E0A\u516D\uFF1A\u5F80\u8E47\u4F86\u78A9\uFF0C\u5409\uFF1B\u5229\u898B\u5927\u4EBA\u3002"
      ],
      mutual: 64,
      mutual_vi: "H\u1ECFa Th\u1EE7y V\u1ECB T\u1EBF"
    },
    {
      n: 40,
      zh: "\u96F7\u6C34\u89E3",
      vi: "L\xF4i Th\u1EE7y Gi\u1EA3i",
      en: "Deliverance",
      upper: "zhen",
      lower: "kan",
      meaning: "Gi\u1EA3i t\u1ECFa, th\xE1o g\u1EE1 kh\xF3 kh\u0103n",
      guaci: "\u5229\u897F\u5357\uFF0C\u65E0\u6240\u5F80\uFF0C\u5176\u4F86\u5FA9\u5409\u3002\u6709\u6538\u5F80\uFF0C\u5919\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u89E3\uFF0C\u96AA\u4EE5\u52D5\uFF0C\u52D5\u800C\u514D\u4E4E\u96AA\uFF0C\u89E3\u3002\u89E3\u5229\u897F\u5357\uFF0C\u5F80\u5F97\u773E\u4E5F\u3002\u5176\u4F86\u5FA9\u5409\uFF0C\u4E43\u5F97\u4E2D\u4E5F\u3002\u6709\u6538\u5F80\u5919\u5409\uFF0C\u5F80\u6709\u529F\u4E5F\u3002\u5929\u5730\u89E3\uFF0C\u800C\u96F7\u96E8\u4F5C\uFF0C\u96F7\u96E8\u4F5C\uFF0C\u800C\u767E\u679C\u8349\u6728\u7686\u7532\u577C\uFF0C\u89E3\u4E4B\u6642\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u96E8\u4F5C\uFF0C\u89E3\uFF1B\u541B\u5B50\u4EE5\u8D66\u904E\u5BA5\u7F6A\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u7530\u7372\u4E09\u72D0\uFF0C\u5F97\u9EC3\u77E2\uFF0C\u8C9E\u5409\u3002",
        "\u516D\u4E09\uFF1A\u8CA0\u4E14\u4E58\uFF0C\u81F4\u5BC7\u81F3\uFF0C\u8C9E\u541D\u3002",
        "\u4E5D\u56DB\uFF1A\u89E3\u800C\u62C7\uFF0C\u670B\u81F3\u65AF\u5B5A\u3002",
        "\u516D\u4E94\uFF1A\u541B\u5B50\u7DAD\u6709\u89E3\uFF0C\u5409\uFF1B\u6709\u5B5A\u4E8E\u5C0F\u4EBA\u3002",
        "\u4E0A\u516D\uFF1A\u516C\u7528\u5C04\u96BC\uFF0C\u4E8E\u9AD8\u5EB8\u4E4B\u4E0A\uFF0C\u7372\u4E4B\uFF0C\u65E0\u4E0D\u5229\u3002"
      ],
      mutual: 63,
      mutual_vi: "Th\u1EE7y H\u1ECFa K\xFD T\u1EBF"
    },
    {
      n: 41,
      zh: "\u5C71\u6FA4\u640D",
      vi: "S\u01A1n Tr\u1EA1ch T\u1ED5n",
      en: "Decrease",
      upper: "gen",
      lower: "dui",
      meaning: "B\u1EDBt; b\u1EDBt d\u01B0\u1EDBi th\xEAm tr\xEAn, b\u1EDBt d\u1EE5c v\u1ECDng",
      guaci: "\u6709\u5B5A\uFF0C\u5143\u5409\u3002\u65E0\u548E\uFF0C\u53EF\u8C9E\uFF0C\u5229\u6709\u6538\u5F80\u3002\u66F7\u4E4B\u7528\uFF1F\u4E8C\u7C0B\u53EF\u7528\u4EAB\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u640D\uFF0C\u640D\u4E0B\u76CA\u4E0A\uFF0C\u5176\u9053\u4E0A\u884C\u3002\u640D\u800C\u6709\u5B5A\uFF0C\u5143\u5409\uFF0C\u65E0\u548E\uFF0C\u53EF\u8C9E\uFF0C\u5229\u6709\u6538\u5F80\u3002\u66F7\u4E4B\u7528\uFF1F\u4E8C\u7C0B\u53EF\u7528\u4EAB\uFF1B\u4E8C\u7C0B\u61C9\u6709\u6642\u3002\u640D\u525B\u76CA\u67D4\u6709\u6642\uFF0C\u640D\u76CA\u76C8\u865B\uFF0C\u8207\u6642\u5055\u884C\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0B\u6709\u6FA4\uFF0C\u640D\uFF1B\u541B\u5B50\u4EE5\u61F2\u5FFF\u7A92\u6B32\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u5DF2\u4E8B\u9044\u5F80\uFF0C\u65E0\u548E\uFF0C\u914C\u640D\u4E4B\u3002",
        "\u4E5D\u4E8C\uFF1A\u5229\u8C9E\uFF0C\u5F81\u51F6\uFF0C\u5F17\u640D\u76CA\u4E4B\u3002",
        "\u516D\u4E09\uFF1A\u4E09\u4EBA\u884C\uFF0C\u5247\u640D\u4E00\u4EBA\uFF1B\u4E00\u4EBA\u884C\uFF0C\u5247\u5F97\u5176\u53CB\u3002",
        "\u516D\u56DB\uFF1A\u640D\u5176\u75BE\uFF0C\u4F7F\u9044\u6709\u559C\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u6216\u76CA\u4E4B\uFF0C\u5341\u670B\u4E4B\u9F9C\u5F17\u514B\u9055\uFF0C\u5143\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u5F17\u640D\u76CA\u4E4B\uFF0C\u65E0\u548E\uFF0C\u8C9E\u5409\uFF0C\u5229\u6709\u6538\u5F80\uFF0C\u5F97\u81E3\u65E0\u5BB6\u3002"
      ],
      mutual: 24,
      mutual_vi: "\u0110\u1ECBa L\xF4i Ph\u1EE5c"
    },
    {
      n: 42,
      zh: "\u98A8\u96F7\u76CA",
      vi: "Phong L\xF4i \xCDch",
      en: "Increase",
      upper: "xun",
      lower: "zhen",
      meaning: "Th\xEAm; b\u1EDBt tr\xEAn th\xEAm d\u01B0\u1EDBi, l\xE0m l\u1EE3i cho ng\u01B0\u1EDDi",
      guaci: "\u5229\u6709\u6538\u5F80\u3002\u5229\u6D89\u5927\u5DDD\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u76CA\uFF0C\u640D\u4E0A\u76CA\u4E0B\uFF0C\u6C11\u8AAA\u65E0\u7586\uFF0C\u81EA\u4E0A\u4E0B\u4E0B\uFF0C\u5176\u9053\u5927\u5149\u3002\u5229\u6709\u6538\u5F80\uFF0C\u4E2D\u6B63\u6709\u6176\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u6728\u9053\u4E43\u884C\u3002\u76CA\u52D5\u800C\u5DFD\uFF0C\u65E5\u9032\u65E0\u7586\u3002\u5929\u65BD\u5730\u751F\uFF0C\u5176\u76CA\u65E0\u65B9\u3002\u51E1\u76CA\u4E4B\u9053\uFF0C\u8207\u6642\u5055\u884C\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u98A8\u96F7\uFF0C\u76CA\uFF1B\u541B\u5B50\u4EE5\u898B\u5584\u5247\u9077\uFF0C\u6709\u904E\u5247\u6539\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u5229\u7528\u70BA\u5927\u4F5C\uFF0C\u5143\u5409\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u6216\u76CA\u4E4B\uFF0C\u5341\u670B\u4E4B\u9F9C\u5F17\u514B\u9055\uFF0C\u6C38\u8C9E\u5409\u3002\u738B\u7528\u4EAB\u4E8E\u5E1D\uFF0C\u5409\u3002",
        "\u516D\u4E09\uFF1A\u76CA\u4E4B\u7528\u51F6\u4E8B\uFF0C\u65E0\u548E\u3002\u6709\u5B5A\u4E2D\u884C\uFF0C\u544A\u516C\u7528\u572D\u3002",
        "\u516D\u56DB\uFF1A\u4E2D\u884C\uFF0C\u544A\u516C\u5F9E\u3002\u5229\u7528\u70BA\u4F9D\u9077\u90A6\u3002",
        "\u4E5D\u4E94\uFF1A\u6709\u5B5A\u60E0\u5FC3\uFF0C\u52FF\u554F\u5143\u5409\u3002\u6709\u5B5A\u60E0\u6211\u5FB7\u3002",
        "\u4E0A\u4E5D\uFF1A\u83AB\u76CA\u4E4B\uFF0C\u6216\u64CA\u4E4B\uFF0C\u7ACB\u5FC3\u52FF\u6046\uFF0C\u51F6\u3002"
      ],
      mutual: 23,
      mutual_vi: "S\u01A1n \u0110\u1ECBa B\xE1c"
    },
    {
      n: 43,
      zh: "\u6FA4\u5929\u592C",
      vi: "Tr\u1EA1ch Thi\xEAn Qu\u1EA3i",
      en: "Breakthrough",
      upper: "dui",
      lower: "qian",
      meaning: "Quy\u1EBFt \u0111o\xE1n; tr\u1EEB b\u1ECF k\u1EBB ti\u1EC3u nh\xE2n",
      guaci: "\u63DA\u4E8E\u738B\u5EAD\uFF0C\u5B5A\u865F\uFF0C\u6709\u53B2\uFF0C\u544A\u81EA\u9091\uFF0C\u4E0D\u5229\u5373\u620E\uFF0C\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u592C\uFF0C\u6C7A\u4E5F\uFF0C\u525B\u6C7A\u67D4\u4E5F\u3002\u5065\u800C\u8AAA\uFF0C\u6C7A\u800C\u548C\uFF0C\u63DA\u4E8E\u738B\u5EAD\uFF0C\u67D4\u4E58\u4E94\u525B\u4E5F\u3002\u5B5A\u865F\u6709\u53B2\uFF0C\u5176\u5371\u4E43\u5149\u4E5F\u3002\u544A\u81EA\u9091\uFF0C\u4E0D\u5229\u5373\u620E\uFF0C\u6240\u5C1A\u4E43\u7AAE\u4E5F\u3002\u5229\u6709\u6538\u5F80\uFF0C\u525B\u9577\u4E43\u7D42\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E0A\u4E8E\u5929\uFF0C\u592C\uFF1B\u541B\u5B50\u4EE5\u65BD\u797F\u53CA\u4E0B\uFF0C\u5C45\u5FB7\u5247\u5FCC\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u58EF\u4E8E\u524D\u8DBE\uFF0C\u5F80\u4E0D\u52DD\u70BA\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u60D5\u865F\uFF0C\u83AB\u591C\u6709\u620E\uFF0C\u52FF\u6064\u3002",
        "\u4E5D\u4E09\uFF1A\u58EF\u4E8E\u9804\uFF0C\u6709\u51F6\u3002\u541B\u5B50\u592C\u592C\uFF0C\u7368\u884C\u9047\u96E8\uFF0C\u82E5\u6FE1\u6709\u614D\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u56DB\uFF1A\u81C0\u65E0\u819A\uFF0C\u5176\u884C\u6B21\u4E14\u3002\u727D\u7F8A\u6094\u4EA1\uFF0C\u805E\u8A00\u4E0D\u4FE1\u3002",
        "\u4E5D\u4E94\uFF1A\u83A7\u9678\u592C\u592C\uFF0C\u4E2D\u884C\u65E0\u548E\u3002",
        "\u4E0A\u516D\uFF1A\u65E0\u865F\uFF0C\u7D42\u6709\u51F6\u3002"
      ],
      mutual: 1,
      mutual_vi: "Thu\u1EA7n C\xE0n"
    },
    {
      n: 44,
      zh: "\u5929\u98A8\u59E4",
      vi: "Thi\xEAn Phong C\u1EA5u",
      en: "Coming to Meet",
      upper: "qian",
      lower: "xun",
      meaning: "G\u1EB7p g\u1EE1 b\u1EA5t ng\u1EDD; m\u1ED9t \xE2m g\u1EB7p n\u0103m d\u01B0\u01A1ng",
      guaci: "\u5973\u58EF\uFF0C\u52FF\u7528\u53D6\u5973\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u59E4\uFF0C\u9047\u4E5F\uFF0C\u67D4\u9047\u525B\u4E5F\u3002\u52FF\u7528\u53D6\u5973\uFF0C\u4E0D\u53EF\u8207\u9577\u4E5F\u3002\u5929\u5730\u76F8\u9047\uFF0C\u54C1\u7269\u54B8\u7AE0\u4E5F\u3002\u525B\u9047\u4E2D\u6B63\uFF0C\u5929\u4E0B\u5927\u884C\u4E5F\u3002\u59E4\u4E4B\u6642\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5929\u4E0B\u6709\u98A8\uFF0C\u59E4\uFF1B\u540E\u4EE5\u65BD\u547D\u8AA5\u56DB\u65B9\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u7CFB\u4E8E\u91D1\u67C5\uFF0C\u8C9E\u5409\uFF0C\u6709\u6538\u5F80\uFF0C\u898B\u51F6\uFF0C\u7FB8\u8C55\uFF0C\u5B5A\uFF0C\u{28159}\u{28103}\u3002",
        "\u4E5D\u4E8C\uFF1A\u5305\u6709\u9B5A\uFF0C\u65E0\u548E\uFF0C\u4E0D\u5229\u8CD3\u3002",
        "\u4E5D\u4E09\uFF1A\u81C0\u65E0\u819A\uFF0C\u5176\u884C\u6B21\u4E14\uFF0C\u53B2\uFF0C\u65E0\u5927\u548E\u3002",
        "\u4E5D\u56DB\uFF1A\u5305\u65E0\u9B5A\uFF0C\u8D77\u51F6\u3002",
        "\u4E5D\u4E94\uFF1A\u4EE5\u675E\u82DE\u74DC\uFF0C\u542B\u7AE0\uFF0C\u6709\u9695\u81EA\u5929\u3002",
        "\u4E0A\u4E5D\uFF1A\u59E4\u5176\u89D2\uFF0C\u541D\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 1,
      mutual_vi: "Thu\u1EA7n C\xE0n"
    },
    {
      n: 45,
      zh: "\u6FA4\u5730\u8403",
      vi: "Tr\u1EA1ch \u0110\u1ECBa T\u1EE5y",
      en: "Gathering Together",
      upper: "dui",
      lower: "kun",
      meaning: "T\u1EE5 h\u1ECDp; ng\u01B0\u1EDDi v\xE0 c\u1EE7a t\u1EE5 v\u1EC1",
      guaci: "\u738B\u5047\u6709\u5EDF\uFF0C\u5229\u898B\u5927\u4EBA\uFF0C\u4EA8\u3002\u5229\u8C9E\u3002\u7528\u5927\u7272\u5409\uFF0C\u5229\u6709\u6538\u5F80\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8403\uFF0C\u805A\u4E5F\uFF1B\u9806\u4EE5\u8AAA\uFF0C\u525B\u4E2D\u800C\u61C9\uFF0C\u6545\u805A\u4E5F\u3002\u738B\u5047\u6709\u5EDF\uFF0C\u81F4\u5B5D\u4EAB\u4E5F\u3002\u5229\u898B\u5927\u4EBA\u4EA8\uFF0C\u805A\u4EE5\u6B63\u4E5F\u3002\u7528\u5927\u7272\u5409\uFF0C\u5229\u6709\u6538\u5F80\uFF0C\u9806\u5929\u547D\u4E5F\u3002\u89C0\u5176\u6240\u805A\uFF0C\u800C\u5929\u5730\u842C\u7269\u4E4B\u60C5\u53EF\u898B\u77E3\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E0A\u4E8E\u5730\uFF0C\u8403\uFF1B\u541B\u5B50\u4EE5\u9664\u620E\u5668\uFF0C\u6212\u4E0D\u865E\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u6709\u5B5A\u4E0D\u7D42\uFF0C\u4E43\u4E82\u4E43\u8403\uFF0C\u82E5\u865F\u4E00\u63E1\u70BA\u7B11\uFF0C\u52FF\u6064\uFF0C\u5F80\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u5F15\u5409\uFF0C\u65E0\u548E\uFF0C\u5B5A\u4E43\u5229\u7528\u79B4\u3002",
        "\u516D\u4E09\uFF1A\u8403\u5982\uFF0C\u55DF\u5982\uFF0C\u65E0\u6538\u5229\uFF0C\u5F80\u65E0\u548E\uFF0C\u5C0F\u541D\u3002",
        "\u4E5D\u56DB\uFF1A\u5927\u5409\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u8403\u6709\u4F4D\uFF0C\u65E0\u548E\u3002\u532A\u5B5A\uFF0C\u5143\u6C38\u8C9E\uFF0C\u6094\u4EA1\u3002",
        "\u4E0A\u516D\uFF1A\u9F4E\u54A8\u6D95\u6D1F\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 53,
      mutual_vi: "Phong S\u01A1n Ti\u1EC7m"
    },
    {
      n: 46,
      zh: "\u5730\u98A8\u5347",
      vi: "\u0110\u1ECBa Phong Th\u0103ng",
      en: "Pushing Upward",
      upper: "kun",
      lower: "xun",
      meaning: "\u0110i l\xEAn d\u1EA7n, nh\u01B0 c\xE2y m\u1ECDc t\u1EEB \u0111\u1EA5t",
      guaci: "\u5143\u4EA8\uFF0C\u7528\u898B\u5927\u4EBA\uFF0C\u52FF\u6064\uFF0C\u5357\u5F81\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u67D4\u4EE5\u6642\u5347\uFF0C\u5DFD\u800C\u9806\uFF0C\u525B\u4E2D\u800C\u61C9\uFF0C\u662F\u4EE5\u5927\u4EA8\u3002\u7528\u898B\u5927\u4EBA\uFF0C\u52FF\u6064\uFF1B\u6709\u6176\u4E5F\u3002\u5357\u5F81\u5409\uFF0C\u5FD7\u884C\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5730\u4E2D\u751F\u6728\uFF0C\u5347\uFF1B\u541B\u5B50\u4EE5\u9806\u5FB7\uFF0C\u7A4D\u5C0F\u4EE5\u9AD8\u5927\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u5141\u5347\uFF0C\u5927\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u5B5A\u4E43\u5229\u7528\u79B4\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E09\uFF1A\u5347\u865B\u9091\u3002",
        "\u516D\u56DB\uFF1A\u738B\u7528\u4EA8\u4E8E\u5C90\u5C71\uFF0C\u5409\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u8C9E\u5409\uFF0C\u5347\u968E\u3002",
        "\u4E0A\u516D\uFF1A\u51A5\u5347\uFF0C\u5229\u4E8E\u4E0D\u606F\u4E4B\u8C9E\u3002"
      ],
      mutual: 54,
      mutual_vi: "L\xF4i Tr\u1EA1ch Quy Mu\u1ED9i"
    },
    {
      n: 47,
      zh: "\u6FA4\u6C34\u56F0",
      vi: "Tr\u1EA1ch Th\u1EE7y Kh\u1ED1n",
      en: "Oppression",
      upper: "dui",
      lower: "kan",
      meaning: "Kh\u1ED1n c\xF9ng; gi\u1EEF ch\xED trong c\u1EA3nh kh\xF3",
      guaci: "\u4EA8\uFF0C\u8C9E\u5927\u4EBA\u5409\uFF0C\u65E0\u548E\uFF0C\u6709\u8A00\u4E0D\u4FE1\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u56F0\uFF0C\u525B\u63A9\u4E5F\u3002\u96AA\u4EE5\u8AAA\uFF0C\u56F0\u800C\u4E0D\u5931\u5176\u6240\uFF0C\u4EA8\uFF1B\u5176\u552F\u541B\u5B50\u4E4E\uFF1F \u8C9E\u5927\u4EBA\u5409\uFF0C\u4EE5\u525B\u4E2D\u4E5F\u3002\u6709\u8A00\u4E0D\u4FE1\uFF0C\u5C1A\u53E3\u4E43\u7AAE\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u65E0\u6C34\uFF0C\u56F0\uFF1B\u541B\u5B50\u4EE5\u81F4\u547D\u9042\u5FD7\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u81C0\u56F0\u4E8E\u682A\u6728\uFF0C\u5165\u4E8E\u5E7D\u8C37\uFF0C\u4E09\u6B72\u4E0D\u89BF\u3002",
        "\u4E5D\u4E8C\uFF1A\u56F0\u4E8E\u9152\u98DF\uFF0C\u6731\u7D31\u65B9\u4F86\uFF0C\u5229\u7528\u4EA8\u7940\uFF0C\u5F81\u51F6\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E09\uFF1A\u56F0\u4E8E\u77F3\uFF0C\u64DA\u4E8E\u84BA\u85DC\uFF0C\u5165\u4E8E\u5176\u5BAE\uFF0C\u4E0D\u898B\u5176\u59BB\uFF0C\u51F6\u3002",
        "\u4E5D\u56DB\uFF1A\u4F86\u5F90\u5F90\uFF0C\u56F0\u4E8E\u91D1\u8ECA\uFF0C\u541D\uFF0C\u6709\u7D42\u3002",
        "\u4E5D\u4E94\uFF1A\u5293\u5216\uFF0C\u56F0\u4E8E\u8D64\u7D31\uFF0C\u4E43\u5F90\u6709\u8AAA\uFF0C\u5229\u7528\u796D\u7940\u3002",
        "\u4E0A\u516D\uFF1A\u56F0\u4E8E\u845B\u85DF\uFF0C\u4E8E\u81F2\u537C\uFF0C\u66F0\u52D5\u6094\u3002\u6709\u6094\uFF0C\u5F81\u5409\u3002"
      ],
      mutual: 37,
      mutual_vi: "Phong H\u1ECFa Gia Nh\xE2n"
    },
    {
      n: 48,
      zh: "\u6C34\u98A8\u4E95",
      vi: "Th\u1EE7y Phong T\u1EC9nh",
      en: "The Well",
      upper: "kan",
      lower: "xun",
      meaning: "C\xE1i gi\u1EBFng; nu\xF4i ng\u01B0\u1EDDi kh\xF4ng c\u1EA1n",
      guaci: "\u6539\u9091\u4E0D\u6539\u4E95\uFF0C\u65E0\u55AA\u65E0\u5F97\uFF0C\u5F80\u4F86\u4E95\u4E95\u3002\u6C54\u81F3\u4EA6\u672A\u7E58\u4E95\u3002\u7FB8\u5176\u74F6\uFF0C\u51F6\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5DFD\u4E4E\u6C34\u800C\u4E0A\u6C34\uFF0C\u4E95\uFF1B\u4E95\u990A\u800C\u4E0D\u7AAE\u4E5F\u3002\u6539\u9091\u4E0D\u6539\u4E95\uFF0C\u4E43\u4EE5\u525B\u4E2D\u4E5F\u3002\u6C54\u81F3\u4EA6\u672A\u7E58\u4E95\uFF0C\u672A\u6709\u529F\u4E5F\u3002\u7FB8\u5176\u74F6\uFF0C\u662F\u4EE5\u51F6\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6728\u4E0A\u6709\u6C34\uFF0C\u4E95\uFF1B\u541B\u5B50\u4EE5\u52DE\u6C11\u52F8\u76F8\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u4E95\u6CE5\u4E0D\u98DF\uFF0C\u820A\u4E95\u65E0\u79BD\u3002",
        "\u4E5D\u4E8C\uFF1A\u4E95\u8C37\u5C04\u9B92\uFF0C\u74EE\u655D\u6F0F\u3002",
        "\u4E5D\u4E09\uFF1A\u4E95\u6E2B\u4E0D\u98DF\uFF0C\u70BA\u6211\u5FC3\u60FB\uFF0C\u53EF\u7528\u6C72\uFF0C\u738B\u660E\uFF0C\u4E26\u53D7\u5176\u798F\u3002",
        "\u516D\u56DB\uFF1A\u4E95\u7503\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u4E95\u51BD\uFF0C\u5BD2\u6CC9\u98DF\u3002",
        "\u4E0A\u516D\uFF1A\u4E95\u6536\u52FF\u5E55\uFF0C\u6709\u5B5A\u5143\u5409\u3002"
      ],
      mutual: 38,
      mutual_vi: "H\u1ECFa Tr\u1EA1ch Khu\xEA"
    },
    {
      n: 49,
      zh: "\u6FA4\u706B\u9769",
      vi: "Tr\u1EA1ch H\u1ECFa C\xE1ch",
      en: "Revolution",
      upper: "dui",
      lower: "li",
      meaning: "Thay \u0111\u1ED5i, c\xE1ch m\u1EA1ng; \u0111\u1ED5i \u0111\xFAng th\u1EDDi",
      guaci: "\u5DF2\u65E5\u4E43\u5B5A\uFF0C\u5143\u4EA8\u3002\u5229\u8C9E\u3002\u6094\u4EA1\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u9769\uFF0C\u6C34\u706B\u76F8\u606F\uFF0C\u4E8C\u5973\u540C\u5C45\uFF0C\u5176\u5FD7\u4E0D\u76F8\u5F97\uFF0C\u66F0\u9769\u3002\u5DF2\u65E5\u4E43\u5B5A\uFF1B\u9769\u800C\u4FE1\u4E5F\u3002\u6587\u660E\u4EE5\u8AAA\uFF0C\u5927\u4EA8\u4EE5\u6B63\uFF0C\u9769\u800C\u7576\uFF0C\u5176\u6094\u4E43\u4EA1\u3002\u5929\u5730\u9769\u800C\u56DB\u6642\u6210\uFF0C\u6E6F\u6B66\u9769\u547D\uFF0C\u9806\u4E4E\u5929\u800C\u61C9\u4E4E\u4EBA\uFF0C\u9769\u4E4B\u6642\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E2D\u6709\u706B\uFF0C\u9769\uFF1B\u541B\u5B50\u4EE5\u6CBB\u6B77\u660E\u6642\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u978F\u7528\u9EC3\u725B\u4E4B\u9769\u3002",
        "\u516D\u4E8C\uFF1A\u5DF2\u65E5\u4E43\u9769\u4E4B\uFF0C\u5F81\u5409\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E09\uFF1A\u5F81\u51F6\uFF0C\u8C9E\u53B2\uFF0C\u9769\u8A00\u4E09\u5C31\uFF0C\u6709\u5B5A\u3002",
        "\u4E5D\u56DB\uFF1A\u6094\u4EA1\uFF0C\u6709\u5B5A\u6539\u547D\uFF0C\u5409\u3002",
        "\u4E5D\u4E94\uFF1A\u5927\u4EBA\u864E\u8B8A\uFF0C\u672A\u5360\u6709\u5B5A\u3002",
        "\u4E0A\u516D\uFF1A\u541B\u5B50\u8C79\u8B8A\uFF0C\u5C0F\u4EBA\u9769\u9762\uFF0C\u5F81\u51F6\uFF0C\u5C45\u8C9E\u5409\u3002"
      ],
      mutual: 44,
      mutual_vi: "Thi\xEAn Phong C\u1EA5u"
    },
    {
      n: 50,
      zh: "\u706B\u98A8\u9F0E",
      vi: "H\u1ECFa Phong \u0110\u1EC9nh",
      en: "The Cauldron",
      upper: "li",
      lower: "xun",
      meaning: "C\xE1i v\u1EA1c; l\u1EADp c\xE1i m\u1EDBi, \u1ED5n \u0111\u1ECBnh",
      guaci: "\u5143\u5409\uFF0C\u4EA8\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u9F0E\uFF0C\u8C61\u4E5F\u3002\u4EE5\u6728\u5DFD\u706B\uFF0C\u4EA8\u98EA\u4E5F\u3002\u8056\u4EBA\u4EA8\u4EE5\u4EAB\u4E0A\u5E1D\uFF0C\u800C\u5927\u4EA8\u4EE5\u990A\u8056\u8CE2\u3002\u5DFD\u800C\u8033\u76EE\u8070\u660E\uFF0C\u67D4\u9032\u800C\u4E0A\u884C\uFF0C\u5F97\u4E2D\u800C\u61C9\u4E4E\u525B\uFF0C\u662F\u4EE5\u5143\u4EA8\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6728\u4E0A\u6709\u706B\uFF0C\u9F0E\uFF1B\u541B\u5B50\u4EE5\u6B63\u4F4D\u51DD\u547D\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u9F0E\u985B\u8DBE\uFF0C\u5229\u51FA\u5426\uFF0C\u5F97\u59BE\u4EE5\u5176\u5B50\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u9F0E\u6709\u5BE6\uFF0C\u6211\u4EC7\u6709\u75BE\uFF0C\u4E0D\u6211\u80FD\u5373\uFF0C\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u9F0E\u8033\u9769\uFF0C\u5176\u884C\u585E\uFF0C\u96C9\u818F\u4E0D\u98DF\uFF0C\u65B9\u96E8\u8667\u6094\uFF0C\u7D42\u5409\u3002",
        "\u4E5D\u56DB\uFF1A\u9F0E\u6298\u8DB3\uFF0C\u8986\u516C\u9917\uFF0C\u5176\u5F62\u6E25\uFF0C\u51F6\u3002",
        "\u516D\u4E94\uFF1A\u9F0E\u9EC3\u8033\u91D1\u9249\uFF0C\u5229\u8C9E\u3002",
        "\u4E0A\u4E5D\uFF1A\u9F0E\u7389\u9249\uFF0C\u5927\u5409\uFF0C\u65E0\u4E0D\u5229\u3002"
      ],
      mutual: 43,
      mutual_vi: "Tr\u1EA1ch Thi\xEAn Qu\u1EA3i"
    },
    {
      n: 51,
      zh: "\u9707\u70BA\u96F7",
      vi: "Thu\u1EA7n Ch\u1EA5n",
      en: "The Arousing (Thunder)",
      upper: "zhen",
      lower: "zhen",
      meaning: "S\u1EA5m \u0111\u1ED9ng; kinh s\u1EE3 r\u1ED3i t\u1EC9nh ng\u1ED9",
      guaci: "\u4EA8\u3002\u9707\u4F86\u8669\u8669\uFF0C\u7B11\u8A00\u555E\u555E\u3002\u9707\u9A5A\u767E\u91CC\uFF0C\u4E0D\u55AA\u5315\u9B2F\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u9707\uFF0C\u4EA8\u3002\u9707\u4F86\u8669\u8669\uFF0C\u6050\u81F4\u798F\u4E5F\u3002\u7B11\u8A00\u555E\u555E\uFF0C\u5F8C\u6709\u5247\u4E5F\u3002\u9707\u9A5A\u767E\u91CC\uFF0C\u9A5A\u9060\u800C\u61FC\u9087\u4E5F\u3002\u51FA\u53EF\u4EE5\u5B88\u5B97\u5EDF\u793E\u7A37\uFF0C\u4EE5\u70BA\u796D\u4E3B\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6D0A\u96F7\uFF0C\u9707\uFF1B\u541B\u5B50\u4EE5\u6050\u61FC\u4FEE\u7701\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u9707\u4F86\u8669\u8669\uFF0C\u5F8C\u7B11\u8A00\u555E\u555E\uFF0C\u5409\u3002",
        "\u516D\u4E8C\uFF1A\u9707\u4F86\u53B2\uFF0C\u5104\u55AA\u8C9D\uFF0C\u8E8B\u4E8E\u4E5D\u9675\uFF0C\u52FF\u9010\uFF0C\u4E03\u65E5\u5F97\u3002",
        "\u516D\u4E09\uFF1A\u9707\u8607\u8607\uFF0C\u9707\u884C\u65E0\u771A\u3002",
        "\u4E5D\u56DB\uFF1A\u9707\u9042\u6CE5\u3002",
        "\u516D\u4E94\uFF1A\u9707\u5F80\u4F86\u53B2\uFF0C\u5104\u65E0\u55AA\uFF0C\u6709\u4E8B\u3002",
        "\u4E0A\u516D\uFF1A\u9707\u7D22\u7D22\uFF0C\u8996\u77CD\u77CD\uFF0C\u5F81\u51F6\u3002\u9707\u4E0D\u4E8E\u5176\u8EAC\uFF0C\u4E8E\u5176\u9130\uFF0C\u65E0\u548E\u3002\u5A5A\u5ABE\u6709\u8A00\u3002"
      ],
      mutual: 39,
      mutual_vi: "Th\u1EE7y S\u01A1n Ki\u1EC3n"
    },
    {
      n: 52,
      zh: "\u826E\u70BA\u5C71",
      vi: "Thu\u1EA7n C\u1EA5n",
      en: "Keeping Still (Mountain)",
      upper: "gen",
      lower: "gen",
      meaning: "N\xFAi; d\u1EEBng l\u1EA1i \u0111\xFAng ch\u1ED7",
      guaci: "\u826E\u5176\u80CC\uFF0C\u4E0D\u7372\u5176\u8EAB\uFF0C\u884C\u5176\u5EAD\uFF0C\u4E0D\u898B\u5176\u4EBA\uFF0C\u65E0\u548E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u826E\uFF0C\u6B62\u4E5F\u3002\u6642\u6B62\u5247\u6B62\uFF0C\u6642\u884C\u5247\u884C\uFF0C\u52D5\u975C\u4E0D\u5931\u5176\u6642\uFF0C\u5176\u9053\u5149\u660E\u3002\u826E\u5176\u6B62\uFF0C\u6B62\u5176\u6240\u4E5F\u3002\u4E0A\u4E0B\u6575\u61C9\uFF0C\u4E0D\u76F8\u8207\u4E5F\u3002\u662F\u4EE5\u4E0D\u7372\u5176\u8EAB\uFF0C\u884C\u5176\u5EAD\u4E0D\u898B\u5176\u4EBA\uFF0C\u65E0\u548E\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u517C\u5C71\uFF0C\u826E\uFF1B\u541B\u5B50\u4EE5\u601D\u4E0D\u51FA\u5176\u4F4D\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u826E\u5176\u8DBE\uFF0C\u65E0\u548E\uFF0C\u5229\u6C38\u8C9E\u3002",
        "\u516D\u4E8C\uFF1A\u826E\u5176\u8153\uFF0C\u4E0D\u62EF\u5176\u96A8\uFF0C\u5176\u5FC3\u4E0D\u5FEB\u3002",
        "\u4E5D\u4E09\uFF1A\u826E\u5176\u9650\uFF0C\u5217\u5176\u5924\uFF0C\u53B2\u85B0\u5FC3\u3002",
        "\u516D\u56DB\uFF1A\u826E\u5176\u8EAB\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E94\uFF1A\u826E\u5176\u8F14\uFF0C\u8A00\u6709\u5E8F\uFF0C\u6094\u4EA1\u3002",
        "\u4E0A\u4E5D\uFF1A\u6566\u826E\uFF0C\u5409\u3002"
      ],
      mutual: 40,
      mutual_vi: "L\xF4i Th\u1EE7y Gi\u1EA3i"
    },
    {
      n: 53,
      zh: "\u98A8\u5C71\u6F38",
      vi: "Phong S\u01A1n Ti\u1EC7m",
      en: "Development",
      upper: "xun",
      lower: "gen",
      meaning: "Ti\u1EBFn d\u1EA7n theo th\u1EE9 t\u1EF1; con g\xE1i v\u1EC1 nh\xE0 ch\u1ED3ng \u0111\xFAng l\u1EC5",
      guaci: "\u5973\u6B78\u5409\uFF0C\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6F38\u4E4B\u9032\u4E5F\uFF0C\u5973\u6B78\u5409\u4E5F\u3002\u9032\u5F97\u4F4D\uFF0C\u5F80\u6709\u529F\u4E5F\u3002\u9032\u4EE5\u6B63\uFF0C\u53EF\u4EE5\u6B63\u90A6\u4E5F\u3002\u5176\u4F4D\u525B\uFF0C\u5F97\u4E2D\u4E5F\u3002\u6B62\u800C\u5DFD\uFF0C\u52D5\u4E0D\u7AAE\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0A\u6709\u6728\uFF0C\u6F38\uFF1B\u541B\u5B50\u4EE5\u5C45\u8CE2\u5FB7\uFF0C\u5584\u4FD7\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u9D3B\u6F38\u4E8E\u5E72\uFF0C\u5C0F\u5B50\u53B2\uFF0C\u6709\u8A00\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u9D3B\u6F38\u4E8E\u78D0\uFF0C\u98F2\u98DF\u884E\u884E\uFF0C\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u9D3B\u6F38\u4E8E\u9678\uFF0C\u592B\u5F81\u4E0D\u5FA9\uFF0C\u5A66\u5B55\u4E0D\u80B2\uFF0C\u51F6\uFF1B\u5229\u79A6\u5BC7\u3002",
        "\u516D\u56DB\uFF1A\u9D3B\u6F38\u4E8E\u6728\uFF0C\u6216\u5F97\u5176\u6877\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u9D3B\u6F38\u4E8E\u9675\uFF0C\u5A66\u4E09\u6B72\u4E0D\u5B55\uFF0C\u7D42\u83AB\u4E4B\u52DD\uFF0C\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u9D3B\u6F38\u4E8E\u9678\uFF0C\u5176\u7FBD\u53EF\u7528\u70BA\u5100\uFF0C\u5409\u3002"
      ],
      mutual: 64,
      mutual_vi: "H\u1ECFa Th\u1EE7y V\u1ECB T\u1EBF"
    },
    {
      n: 54,
      zh: "\u96F7\u6FA4\u6B78\u59B9",
      vi: "L\xF4i Tr\u1EA1ch Quy Mu\u1ED9i",
      en: "The Marrying Maiden",
      upper: "zhen",
      lower: "dui",
      meaning: "Em g\xE1i v\u1EC1 nh\xE0 ch\u1ED3ng; v\u1ED9i v\xE0ng, sai v\u1ECB tr\xED",
      guaci: "\u5F81\u51F6\uFF0C\u65E0\u6538\u5229\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6B78\u59B9\uFF0C\u5929\u5730\u4E4B\u5927\u7FA9\u4E5F\u3002\u5929\u5730\u4E0D\u4EA4\uFF0C\u800C\u842C\u7269\u4E0D\u8208\uFF0C\u6B78\u59B9\u4EBA\u4E4B\u7D42\u59CB\u4E5F\u3002\u8AAA\u4EE5\u52D5\uFF0C\u6240\u6B78\u59B9\u4E5F\u3002\u5F81\u51F6\uFF0C\u4F4D\u4E0D\u7576\u4E5F\u3002\u65E0\u6538\u5229\uFF0C\u67D4\u4E58\u525B\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E0A\u6709\u96F7\uFF0C\u6B78\u59B9\uFF1B\u541B\u5B50\u4EE5\u6C38\u7D42\u77E5\u655D\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u6B78\u59B9\u4EE5\u5A23\uFF0C\u8DDB\u80FD\u5C65\uFF0C\u5F81\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u7707\u800C\u8996\uFF0C\u5229\u5E7D\u4EBA\u4E4B\u8C9E\u3002",
        "\u516D\u4E09\uFF1A\u6B78\u59B9\u4EE5\u9808\uFF0C\u53CD\u6B78\u4EE5\u5A23\u3002",
        "\u4E5D\u56DB\uFF1A\u6B78\u59B9\u6106\u671F\uFF0C\u9072\u6B78\u6709\u6642\u3002",
        "\u516D\u4E94\uFF1A\u5E1D\u4E59\u6B78\u59B9\uFF0C\u5176\u541B\u4E4B\u8882\uFF0C\u4E0D\u5982\u5176\u5A23\u4E4B\u8882\u826F\uFF0C\u6708\u5E7E\u671B\uFF0C\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u5973\u627F\u7B50\u65E0\u5BE6\uFF0C\u58EB\u5232\u7F8A\u65E0\u8840\uFF0C\u65E0\u6538\u5229\u3002"
      ],
      mutual: 63,
      mutual_vi: "Th\u1EE7y H\u1ECFa K\xFD T\u1EBF"
    },
    {
      n: 55,
      zh: "\u96F7\u706B\u8C50",
      vi: "L\xF4i H\u1ECFa Phong",
      en: "Abundance",
      upper: "zhen",
      lower: "li",
      meaning: "Th\u1ECBnh l\u1EDBn; th\u1ECBnh r\u1ED3i s\u1EBD suy, gi\u1EEF s\xE1ng su\u1ED1t",
      guaci: "\u4EA8\u3002\u738B\u5047\u4E4B\uFF0C\u52FF\u6182\uFF0C\u5B9C\u65E5\u4E2D\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u8C50\uFF0C\u5927\u4E5F\u3002\u660E\u4EE5\u52D5\uFF0C\u6545\u8C50\u3002\u738B\u5047\u4E4B\uFF0C\u5C1A\u5927\u4E5F\u3002\u52FF\u6182\u5B9C\u65E5\u4E2D\uFF0C\u5B9C\u7167\u5929\u4E0B\u4E5F\u3002\u65E5\u4E2D\u5247\u6603\uFF0C\u6708\u76C8\u5247\u98DF\uFF0C\u5929\u5730\u76C8\u865B\uFF0C\u8207\u6642\u6D88\u606F\uFF0C\u800C\u6CC1\u4E8E\u4EBA\u4E4E\uFF1F\u6CC1\u4E8E\u9B3C\u795E\u4E4E\uFF1F",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96F7\u96FB\u7686\u81F3\uFF0C\u8C50\uFF1B\u541B\u5B50\u4EE5\u6298\u7344\u81F4\u5211\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u9047\u5176\u914D\u4E3B\uFF0C\u96D6\u65EC\u65E0\u548E\uFF0C\u5F80\u6709\u5C1A\u3002",
        "\u516D\u4E8C\uFF1A\u8C50\u5176\u8500\uFF0C\u65E5\u4E2D\u898B\u6597\uFF0C\u5F80\u5F97\u7591\u75BE\uFF0C\u6709\u5B5A\u767C\u82E5\uFF0C\u5409\u3002",
        "\u4E5D\u4E09\uFF1A\u8C50\u5176\u6C9B\uFF0C\u65E5\u4E2D\u898B\u6CAC\uFF0C\u6298\u5176\u53F3\u80B1\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u56DB\uFF1A\u8C50\u5176\u8500\uFF0C\u65E5\u4E2D\u898B\u6597\uFF0C\u9047\u5176\u5937\u4E3B\uFF0C\u5409\u3002",
        "\u516D\u4E94\uFF1A\u4F86\u7AE0\uFF0C\u6709\u6176\u8B7D\uFF0C\u5409\u3002",
        "\u4E0A\u516D\uFF1A\u8C50\u5176\u5C4B\uFF0C\u8500\u5176\u5BB6\uFF0C\u7ABA\u5176\u6236\uFF0C\u95C3\u5176\u65E0\u4EBA\uFF0C\u4E09\u6B72\u4E0D\u89CC\uFF0C\u51F6\u3002"
      ],
      mutual: 28,
      mutual_vi: "Tr\u1EA1ch Phong \u0110\u1EA1i Qu\xE1"
    },
    {
      n: 56,
      zh: "\u706B\u5C71\u65C5",
      vi: "H\u1ECFa S\u01A1n L\u1EEF",
      en: "The Wanderer",
      upper: "li",
      lower: "gen",
      meaning: "L\u1EEF kh\xE1ch, \u0111i xa, kh\xF4ng \u1ED5n \u0111\u1ECBnh",
      guaci: "\u5C0F\u4EA8\uFF0C\u65C5\u8C9E\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u65C5\uFF0C\u5C0F\u4EA8\uFF0C\u67D4\u5F97\u4E2D\u4E4E\u5916\uFF0C\u800C\u9806\u4E4E\u525B\uFF0C\u6B62\u800C\u9E97\u4E4E\u660E\uFF0C\u662F\u4EE5\u5C0F\u4EA8\uFF0C\u65C5\u8C9E\u5409\u4E5F\u3002\u65C5\u4E4B\u6642\u7FA9\u5927\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0A\u6709\u706B\uFF0C\u65C5\uFF1B\u541B\u5B50\u4EE5\u660E\u614E\u7528\u5211\uFF0C\u800C\u4E0D\u7559\u7344\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u65C5\u7463\u7463\uFF0C\u65AF\u5176\u6240\u53D6\u707D\u3002",
        "\u516D\u4E8C\uFF1A\u65C5\u5373\u6B21\uFF0C\u61F7\u5176\u8CC7\uFF0C\u5F97\u7AE5\u50D5\u8C9E\u3002",
        "\u4E5D\u4E09\uFF1A\u65C5\u711A\u5176\u6B21\uFF0C\u55AA\u5176\u7AE5\u50D5\uFF0C\u8C9E\u53B2\u3002",
        "\u4E5D\u56DB\uFF1A\u65C5\u4E8E\u8655\uFF0C\u5F97\u5176\u8CC7\u65A7\uFF0C\u6211\u5FC3\u4E0D\u5FEB\u3002",
        "\u516D\u4E94\uFF1A\u5C04\u96C9\u4E00\u77E2\u4EA1\uFF0C\u7D42\u4EE5\u8B7D\u547D\u3002",
        "\u4E0A\u4E5D\uFF1A\u9CE5\u711A\u5176\u5DE2\uFF0C\u65C5\u4EBA\u5148\u7B11\u5F8C\u865F\u54B7\u3002\u55AA\u725B\u4E8E\u6613\uFF0C\u51F6\u3002"
      ],
      mutual: 28,
      mutual_vi: "Tr\u1EA1ch Phong \u0110\u1EA1i Qu\xE1"
    },
    {
      n: 57,
      zh: "\u5DFD\u70BA\u98A8",
      vi: "Thu\u1EA7n T\u1ED1n",
      en: "The Gentle (Wind)",
      upper: "xun",
      lower: "xun",
      meaning: "Gi\xF3; nhu thu\u1EADn, th\xE2m nh\u1EADp",
      guaci: "\u5C0F\u4EA8\u3002\u5229\u6709\u6538\u5F80\u3002\u5229\u898B\u5927\u4EBA\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u91CD\u5DFD\u4EE5\u7533\u547D\uFF0C\u525B\u5DFD\u4E4E\u4E2D\u6B63\u800C\u5FD7\u884C\u3002\u67D4\u7686\u9806\u4E4E\u525B\uFF0C\u662F\u4EE5\u5C0F\u4EA8\uFF0C\u5229\u6709\u6538\u5F80\uFF0C\u5229\u898B\u5927\u4EBA\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u96A8\u98A8\uFF0C\u5DFD\uFF1B\u541B\u5B50\u4EE5\u7533\u547D\u884C\u4E8B\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u9032\u9000\uFF0C\u5229\u6B66\u4EBA\u4E4B\u8C9E\u3002",
        "\u4E5D\u4E8C\uFF1A\u5DFD\u5728\u7240\u4E0B\uFF0C\u7528\u53F2\u5DEB\u7D1B\u82E5\uFF0C\u5409\u65E0\u548E\u3002",
        "\u4E5D\u4E09\uFF1A\u983B\u5DFD\uFF0C\u541D\u3002",
        "\u516D\u56DB\uFF1A\u6094\u4EA1\uFF0C\u7530\u7372\u4E09\u54C1\u3002",
        "\u4E5D\u4E94\uFF1A\u8C9E\u5409\u6094\u4EA1\uFF0C\u65E0\u4E0D\u5229\u3002\u65E0\u521D\u6709\u7D42\uFF0C\u5148\u5E9A\u4E09\u65E5\uFF0C\u5F8C\u5E9A\u4E09\u65E5\uFF0C\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u5DFD\u5728\u7240\u4E0B\uFF0C\u55AA\u5176\u8CC7\u65A7\uFF0C\u8C9E\u51F6\u3002"
      ],
      mutual: 38,
      mutual_vi: "H\u1ECFa Tr\u1EA1ch Khu\xEA"
    },
    {
      n: 58,
      zh: "\u514C\u70BA\u6FA4",
      vi: "Thu\u1EA7n \u0110o\xE0i",
      en: "The Joyous (Lake)",
      upper: "dui",
      lower: "dui",
      meaning: "\u0110\u1EA7m; vui v\u1EBB, n\xF3i n\u0103ng, giao ti\u1EBFp",
      guaci: "\u4EA8\u3002\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u514C\uFF0C\u8AAA\u4E5F\u3002\u525B\u4E2D\u800C\u67D4\u5916\uFF0C\u8AAA\u4EE5\u5229\u8C9E\uFF0C\u662F\u4EE5\u9806\u4E4E\u5929\uFF0C\u800C\u61C9\u4E4E\u4EBA\u3002\u8AAA\u4EE5\u5148\u6C11\uFF0C\u6C11\u5FD8\u5176\u52DE\uFF1B\u8AAA\u4EE5\u72AF\u96E3\uFF0C\u6C11\u5FD8\u5176\u6B7B\uFF1B\u8AAA\u4E4B\u5927\uFF0C\u6C11\u52F8\u77E3\u54C9\uFF01",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u9E97\u6FA4\uFF0C\u514C\uFF1B\u541B\u5B50\u4EE5\u670B\u53CB\u8B1B\u7FD2\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u548C\u514C\uFF0C\u5409\u3002",
        "\u4E5D\u4E8C\uFF1A\u5B5A\u514C\uFF0C\u5409\uFF0C\u6094\u4EA1\u3002",
        "\u516D\u4E09\uFF1A\u4F86\u514C\uFF0C\u51F6\u3002",
        "\u4E5D\u56DB\uFF1A\u5546\u514C\uFF0C\u672A\u5BE7\uFF0C\u4ECB\u75BE\u6709\u559C\u3002",
        "\u4E5D\u4E94\uFF1A\u5B5A\u4E8E\u525D\uFF0C\u6709\u53B2\u3002",
        "\u4E0A\u516D\uFF1A\u5F15\u514C\u3002"
      ],
      mutual: 37,
      mutual_vi: "Phong H\u1ECFa Gia Nh\xE2n"
    },
    {
      n: 59,
      zh: "\u98A8\u6C34\u6E19",
      vi: "Phong Th\u1EE7y Ho\xE1n",
      en: "Dispersion",
      upper: "xun",
      lower: "kan",
      meaning: "Tan t\xE1c, ph\xE2n t\xE1n; gom l\xF2ng ng\u01B0\u1EDDi l\u1EA1i",
      guaci: "\u4EA8\uFF0C\u738B\u5047\u6709\u5EDF\uFF0C\u5229\u6D89\u5927\u5DDD\uFF0C\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u6E19\uFF0C\u4EA8\u3002\u525B\u4F86\u800C\u4E0D\u7AAE\uFF0C\u67D4\u5F97\u4F4D\u4E4E\u5916\u800C\u4E0A\u540C\u3002\u738B\u5047\u6709\u5EDF\uFF0C\u738B\u4E43\u5728\u4E2D\u4E5F\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u4E58\u6728\u6709\u529F\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u98A8\u884C\u6C34\u4E0A\uFF0C\u6E19\uFF1B\u5148\u738B\u4EE5\u4EAB\u4E8E\u5E1D\u7ACB\u5EDF\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u7528\u62EF\u99AC\u58EF\uFF0C\u5409\uFF0C\u6094\u4EA1\u3002",
        "\u4E5D\u4E8C\uFF1A\u6E19\u5954\u5176\u673A\uFF0C\u6094\u4EA1\u3002",
        "\u516D\u4E09\uFF1A\u6E19\u5176\u8EAC\uFF0C\u65E0\u6094\u3002",
        "\u516D\u56DB\uFF1A\u6E19\u5176\u7FA4\uFF0C\u5143\u5409\u3002\u6E19\u6709\u4E18\uFF0C\u532A\u5937\u6240\u601D\u3002",
        "\u4E5D\u4E94\uFF1A\u6E19\u6C57\u5176\u5927\u865F\uFF0C\u6E19\u738B\u5C45\uFF0C\u65E0\u548E\u3002",
        "\u4E0A\u4E5D\uFF1A\u6E19\u5176\u8840\uFF0C\u53BB\u9016\u51FA\uFF0C\u65E0\u548E\u3002"
      ],
      mutual: 27,
      mutual_vi: "S\u01A1n L\xF4i Di"
    },
    {
      n: 60,
      zh: "\u6C34\u6FA4\u7BC0",
      vi: "Th\u1EE7y Tr\u1EA1ch Ti\u1EBFt",
      en: "Limitation",
      upper: "kan",
      lower: "dui",
      meaning: "Ti\u1EBFt ch\u1EBF, c\xF3 ch\u1EEBng m\u1EF1c",
      guaci: "\u4EA8\u3002\u82E6\u7BC0\u4E0D\u53EF\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u7BC0\uFF0C\u4EA8\uFF0C\u525B\u67D4\u5206\uFF0C\u800C\u525B\u5F97\u4E2D\u3002\u82E6\u7BC0\u4E0D\u53EF\u8C9E\uFF0C\u5176\u9053\u7AAE\u4E5F\u3002\u8AAA\u4EE5\u884C\u96AA\uFF0C\u7576\u4F4D\u4EE5\u7BC0\uFF0C\u4E2D\u6B63\u4EE5\u901A\u3002\u5929\u5730\u7BC0\u800C\u56DB\u6642\u6210\uFF0C\u7BC0\u4EE5\u5236\u5EA6\uFF0C\u4E0D\u50B7\u8CA1\uFF0C\u4E0D\u5BB3\u6C11\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E0A\u6709\u6C34\uFF0C\u7BC0\uFF1B\u541B\u5B50\u4EE5\u5236\u6578\u5EA6\uFF0C\u8B70\u5FB7\u884C\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u4E0D\u51FA\u6236\u5EAD\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E8C\uFF1A\u4E0D\u51FA\u9580\u5EAD\uFF0C\u51F6\u3002",
        "\u516D\u4E09\uFF1A\u4E0D\u7BC0\u82E5\uFF0C\u5247\u55DF\u82E5\uFF0C\u65E0\u548E\u3002",
        "\u516D\u56DB\uFF1A\u5B89\u7BC0\uFF0C\u4EA8\u3002",
        "\u4E5D\u4E94\uFF1A\u7518\u7BC0\uFF0C\u5409\uFF1B\u5F80\u6709\u5C1A\u3002",
        "\u4E0A\u516D\uFF1A\u82E6\u7BC0\uFF0C\u8C9E\u51F6\uFF0C\u6094\u4EA1\u3002"
      ],
      mutual: 27,
      mutual_vi: "S\u01A1n L\xF4i Di"
    },
    {
      n: 61,
      zh: "\u98A8\u6FA4\u4E2D\u5B5A",
      vi: "Phong Tr\u1EA1ch Trung Phu",
      en: "Inner Truth",
      upper: "xun",
      lower: "dui",
      meaning: "L\xF2ng th\xE0nh t\xEDn b\xEAn trong",
      guaci: "\u8C5A\u9B5A\u5409\uFF0C\u5229\u6D89\u5927\u5DDD\uFF0C\u5229\u8C9E\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u4E2D\u5B5A\uFF0C\u67D4\u5728\u5167\u800C\u525B\u5F97\u4E2D\u3002\u8AAA\u800C\u5DFD\uFF0C\u5B5A\uFF0C\u4E43\u5316\u90A6\u4E5F\u3002\u8C5A\u9B5A\u5409\uFF0C\u4FE1\u53CA\u8C5A\u9B5A\u4E5F\u3002\u5229\u6D89\u5927\u5DDD\uFF0C\u4E58\u6728\u821F\u865B\u4E5F\u3002\u4E2D\u5B5A\u4EE5\u5229\u8C9E\uFF0C\u4E43\u61C9\u4E4E\u5929\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6FA4\u4E0A\u6709\u98A8\uFF0C\u4E2D\u5B5A\uFF1B\u541B\u5B50\u4EE5\u8B70\u7344\u7DE9\u6B7B\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u865E\u5409\uFF0C\u6709\u4ED6\u4E0D\u71D5\u3002",
        "\u4E5D\u4E8C\uFF1A\u9CF4\u9DB4\u5728\u9670\uFF0C\u5176\u5B50\u548C\u4E4B\uFF0C\u6211\u6709\u597D\u7235\uFF0C\u543E\u8207\u723E\u9761\u4E4B\u3002",
        "\u516D\u4E09\uFF1A\u5F97\u6575\uFF0C\u6216\u9F13\u6216\u7F77\uFF0C\u6216\u6CE3\u6216\u6B4C\u3002",
        "\u516D\u56DB\uFF1A\u6708\u51E0\u3001\u5E7E\u671B\uFF0C\u99AC\u5339\u4EA1\uFF0C\u65E0\u548E\u3002",
        "\u4E5D\u4E94\uFF1A\u6709\u5B5A\u6523\u5982\uFF0C\u65E0\u548E\u3002",
        "\u4E0A\u4E5D\uFF1A\u7FF0\u97F3\u767B\u4E8E\u5929\uFF0C\u8C9E\u51F6\u3002"
      ],
      mutual: 27,
      mutual_vi: "S\u01A1n L\xF4i Di"
    },
    {
      n: 62,
      zh: "\u96F7\u5C71\u5C0F\u904E",
      vi: "L\xF4i S\u01A1n Ti\u1EC3u Qu\xE1",
      en: "Small Exceeding",
      upper: "zhen",
      lower: "gen",
      meaning: "Qu\xE1 nh\u1ECF; vi\u1EC7c nh\u1ECF \u0111\u01B0\u1EE3c, vi\u1EC7c l\u1EDBn kh\xF4ng",
      guaci: "\u4EA8\u3002\u5229\u8C9E\u3002\u53EF\u5C0F\u4E8B\uFF0C\u4E0D\u53EF\u5927\u4E8B\u3002\u98DB\u9CE5\u907A\u4E4B\u97F3\uFF0C\u4E0D\u5B9C\u4E0A\u5B9C\u4E0B\uFF0C\u5927\u5409\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u5C0F\u904E\uFF0C\u5C0F\u8005\u904E\u800C\u4EA8\u4E5F\u3002\u904E\u4EE5\u5229\u8C9E\uFF0C\u8207\u6642\u884C\u4E5F\u3002\u67D4\u5F97\u4E2D\uFF0C\u662F\u4EE5\u5C0F\u4E8B\u5409\u4E5F\u3002\u525B\u5931\u4F4D\u800C\u4E0D\u4E2D\uFF0C\u662F\u4EE5\u4E0D\u53EF\u5927\u4E8B\u4E5F\u3002\u6709\u98DB\u9CE5\u4E4B\u8C61\u7109\uFF0C\u6709\u98DB\u9CE5\u907A\u4E4B\u97F3\uFF0C\u4E0D\u5B9C\u4E0A\u5B9C\u4E0B\uFF0C\u5927\u5409\uFF1B\u4E0A\u9006\u800C\u4E0B\u9806\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u5C71\u4E0A\u6709\u96F7\uFF0C\u5C0F\u904E\uFF1B\u541B\u5B50\u4EE5\u884C\u904E\u4E4E\u606D\uFF0C\u55AA\u904E\u4E4E\u54C0\uFF0C\u7528\u904E\u4E4E\u5109\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u98DB\u9CE5\u4EE5\u51F6\u3002",
        "\u516D\u4E8C\uFF1A\u904E\u5176\u7956\uFF0C\u9047\u5176\u59A3\uFF1B\u4E0D\u53CA\u5176\u541B\uFF0C\u9047\u5176\u81E3\uFF1B\u65E0\u548E\u3002",
        "\u4E5D\u4E09\uFF1A\u5F17\u904E\u9632\u4E4B\uFF0C\u5F9E\u6216\u6215\u4E4B\uFF0C\u51F6\u3002",
        "\u4E5D\u56DB\uFF1A\u65E0\u548E\uFF0C\u5F17\u904E\u9047\u4E4B\u3002\u5F80\u53B2\u5FC5\u6212\uFF0C\u52FF\u7528\u6C38\u8C9E\u3002",
        "\u516D\u4E94\uFF1A\u5BC6\u96F2\u4E0D\u96E8\uFF0C\u81EA\u6211\u897F\u90CA\uFF0C\u516C\u5F0B\u53D6\u5F7C\u5728\u7A74\u3002",
        "\u4E0A\u516D\uFF1A\u5F17\u9047\u904E\u4E4B\uFF0C\u98DB\u9CE5\u96E2\u4E4B\uFF0C\u51F6\uFF0C\u662F\u8B02\u707D\u771A\u3002"
      ],
      mutual: 28,
      mutual_vi: "Tr\u1EA1ch Phong \u0110\u1EA1i Qu\xE1"
    },
    {
      n: 63,
      zh: "\u6C34\u706B\u65E2\u6FDF",
      vi: "Th\u1EE7y H\u1ECFa K\xFD T\u1EBF",
      en: "After Completion",
      upper: "kan",
      lower: "li",
      meaning: "\u0110\xE3 xong; th\xE0nh r\u1ED3i ph\u1EA3i \u0111\u1EC1 ph\xF2ng lo\u1EA1n",
      guaci: "\u4EA8\u5C0F\u3002\u5229\u8C9E\u3002\u521D\u5409\u7D42\u4E82\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u65E2\u6FDF\uFF0C\u4EA8\uFF0C\u5C0F\u8005\u4EA8\u4E5F\u3002\u5229\u8C9E\uFF0C\u525B\u67D4\u6B63\u800C\u4F4D\u7576\u4E5F\u3002\u521D\u5409\uFF0C\u67D4\u5F97\u4E2D\u4E5F\u3002\u7D42\u6B62\u5247\u4E82\uFF0C\u5176\u9053\u7AAE\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u6C34\u5728\u706B\u4E0A\uFF0C\u65E2\u6FDF\uFF1B\u541B\u5B50\u4EE5\u601D\u60A3\u800C\u8C6B\u9632\u4E4B\u3002",
      yaoci: [
        "\u521D\u4E5D\uFF1A\u66F3\u5176\u8F2A\uFF0C\u6FE1\u5176\u5C3E\uFF0C\u65E0\u548E\u3002",
        "\u516D\u4E8C\uFF1A\u5A66\u55AA\u5176\u8300\uFF0C\u52FF\u9010\uFF0C\u4E03\u65E5\u5F97\u3002",
        "\u4E5D\u4E09\uFF1A\u9AD8\u5B97\u4F10\u9B3C\u65B9\uFF0C\u4E09\u5E74\u514B\u4E4B\uFF0C\u5C0F\u4EBA\u52FF\u7528\u3002",
        "\u516D\u56DB\uFF1A\u7E7B\u6709\u8863\u88BD\uFF0C\u7D42\u65E5\u6212\u3002",
        "\u4E5D\u4E94\uFF1A\u6771\u9130\u6BBA\u725B\uFF0C\u4E0D\u5982\u897F\u9130\u4E4B\u79B4\u796D\uFF0C\u5BE6\u53D7\u5176\u798F\u3002",
        "\u4E0A\u516D\uFF1A\u6FE1\u5176\u9996\uFF0C\u53B2\u3002"
      ],
      mutual: 64,
      mutual_vi: "H\u1ECFa Th\u1EE7y V\u1ECB T\u1EBF"
    },
    {
      n: 64,
      zh: "\u706B\u6C34\u672A\u6FDF",
      vi: "H\u1ECFa Th\u1EE7y V\u1ECB T\u1EBF",
      en: "Before Completion",
      upper: "li",
      lower: "kan",
      meaning: "Ch\u01B0a xong; c\xF2n c\u01A1 h\u1ED9i, th\u1EADn tr\u1ECDng \u0111i ti\u1EBFp",
      guaci: "\u4EA8\u3002\u5C0F\u72D0\u6C54\u6FDF\uFF0C\u6FE1\u5176\u5C3E\uFF0C\u65E0\u6538\u5229\u3002",
      tuan: "\u300A\u5F56\u300B\u66F0\uFF1A\u672A\u6FDF\uFF0C\u4EA8\uFF1B\u67D4\u5F97\u4E2D\u4E5F\u3002\u5C0F\u72D0\u6C54\u6FDF\uFF0C\u672A\u51FA\u4E2D\u4E5F\u3002\u6FE1\u5176\u5C3E\uFF0C\u65E0\u6538\u5229\uFF1B\u4E0D\u7E8C\u7D42\u4E5F\u3002\u96D6\u4E0D\u7576\u4F4D\uFF0C\u525B\u67D4\u61C9\u4E5F\u3002",
      xiang: "\u300A\u8C61\u300B\u66F0\uFF1A\u706B\u5728\u6C34\u4E0A\uFF0C\u672A\u6FDF\uFF1B\u541B\u5B50\u4EE5\u614E\u8FA8\u7269\u5C45\u65B9\u3002",
      yaoci: [
        "\u521D\u516D\uFF1A\u6FE1\u5176\u5C3E\uFF0C\u541D\u3002",
        "\u4E5D\u4E8C\uFF1A\u66F3\u5176\u8F2A\uFF0C\u8C9E\u5409\u3002",
        "\u516D\u4E09\uFF1A\u672A\u6FDF\uFF0C\u5F81\u51F6\uFF0C\u5229\u6D89\u5927\u5DDD\u3002",
        "\u4E5D\u56DB\uFF1A\u8C9E\u5409\uFF0C\u6094\u4EA1\uFF0C\u9707\u7528\u4F10\u9B3C\u65B9\uFF0C\u4E09\u5E74\u6709\u8CDE\u4E8E\u5927\u90A6\u3002",
        "\u516D\u4E94\uFF1A\u8C9E\u5409\uFF0C\u65E0\u6094\uFF0C\u541B\u5B50\u4E4B\u5149\uFF0C\u6709\u5B5A\uFF0C\u5409\u3002",
        "\u4E0A\u4E5D\uFF1A\u6709\u5B5A\u4E8E\u98F2\u9152\uFF0C\u65E0\u548E\uFF0C\u6FE1\u5176\u9996\uFF0C\u6709\u5B5A\u5931\u662F\u3002"
      ],
      mutual: 63,
      mutual_vi: "Th\u1EE7y H\u1ECFa K\xFD T\u1EBF"
    }
  ]
};

// src/iching.ts
var TRI = Object.fromEntries(iching_data_default.trigrams.map((t) => [t.key, t]));
var HEX = iching_data_default.hexagrams;
var BY_PAIR = new Map(HEX.map((h) => [`${h.upper}|${h.lower}`, h]));
var BY_LINES = new Map(iching_data_default.trigrams.map((t) => [t.lines, t]));
var S2T = Object.fromEntries([..."\u4E3A\u79BB\u6D4E\u98CE\u6052\u8BBC\u5E08\u89C2\u8D32\u5265\u590D\u65E0\u9890\u8FC7\u9041\u664B\u635F\u6E10\u5F52\u4E30\u5151\u6DA3\u8282\u6CFD\u8C26\u968F\u86CA\u4E34\u58EE\u957F\u4E1C\u95E8"].map((c, i) => [c, "\u70BA\u96E2\u6FDF\u98A8\u6046\u8A1F\u5E2B\u89C0\u8CC1\u525D\u5FA9\u7121\u9824\u904E\u906F\u6649\u640D\u6F38\u6B78\u8C50\u514C\u6E19\u7BC0\u6FA4\u8B19\u96A8\u8831\u81E8\u58EF\u9577\u6771\u9580"[i]]));
var toTrad = (s) => s.replace(/[\u4e00-\u9fff]/g, (c) => S2T[c] ?? c);
var norm2 = (s) => toTrad(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9一-鿿]+/g, " ").trim();
var ROLE_ALIASES = {
  qian: ["cha", "b\u1ED1", "ch\u1ED3ng", "father", "husband", "dad", "c\xE0n", "qian", "\u7236", "\u592B", "\u4E7E", "chu nha nam"],
  kun: ["m\u1EB9", "m\xE1", "v\u1EE3", "mother", "wife", "mom", "kh\xF4n", "kun", "\u6BCD", "\u59BB", "\u5764", "chu nha nu"],
  zhen: ["con trai ca", "con trai truong", "truong nam", "anh ca", "eldest son", "first son", "chan", "zhen", "\u957F\u5B50", "\u9707"],
  kan: ["con trai thu", "con trai giua", "con trai thu hai", "trung nam", "middle son", "second son", "kham", "kan", "\u6B21\u5B50", "\u4E2D\u7537", "\u574E"],
  gen: ["con trai ut", "thieu nam", "con trai thu ba", "youngest son", "third son", "c\u1EA5n", "gen", "\u5C11\u7537", "\u4E09\u5B50", "\u826E"],
  xun: ["con gai ca", "con gai truong", "truong nu", "chi ca", "eldest daughter", "first daughter", "ton", "xun", "\u957F\u5973", "\u5DFD"],
  li: ["con gai thu", "con gai giua", "con gai thu hai", "trung nu", "middle daughter", "second daughter", "ly", "li", "\u6B21\u5973", "\u4E2D\u5973", "\u79BB"],
  dui: ["con gai ut", "thieu nu", "con gai thu ba", "youngest daughter", "third daughter", "doai", "dui", "\u5C11\u5973", "\u4E09\u5973", "\u5151"]
};
var DIR_ALIASES = {
  kan: ["bac", "north", "n", "chinh bac", "\u5317", "\u6B63\u5317"],
  gen: ["dong bac", "north east", "northeast", "ne", "\u4E1C\u5317"],
  zhen: ["dong", "east", "e", "chinh dong", "\u4E1C", "\u6B63\u4E1C"],
  xun: ["dong nam", "south east", "southeast", "se", "\u4E1C\u5357"],
  li: ["nam", "south", "s", "chinh nam", "\u5357", "\u6B63\u5357"],
  kun: ["tay nam", "south west", "southwest", "sw", "\u897F\u5357"],
  dui: ["tay", "west", "w", "chinh tay", "\u897F", "\u6B63\u897F"],
  qian: ["tay bac", "north west", "northwest", "nw", "\u897F\u5317"]
};
function lookup(aliases, q, what) {
  const raw = q.trim().toLowerCase();
  for (const [k, list] of Object.entries(aliases)) if (list.includes(raw)) return k;
  const n = norm2(q);
  for (const [k, list] of Object.entries(aliases)) if (list.some((a2) => norm2(a2) === n)) return k;
  let best = "", key = "";
  const padded = ` ${n} `;
  for (const [k, list] of Object.entries(aliases)) for (const a2 of list) {
    const na = norm2(a2);
    if (na.length > best.length && (/[\u4e00-\u9fff]/.test(na) ? n.includes(na) : padded.includes(` ${na} `))) {
      best = na;
      key = k;
    }
  }
  if (key) return key;
  throw new Error(`Unknown ${what}: "${q}"`);
}
var roleKey = (q) => lookup(ROLE_ALIASES, q, "family role");
var dirKey = (q) => lookup(DIR_ALIASES, q, "direction");
var hexOf = (upper, lower) => BY_PAIR.get(`${upper}|${lower}`);
var mutualHex = (h) => HEX[h.mutual - 1];
function findHexagram(q) {
  if (typeof q === "number" || /^\d{1,2}$/.test(String(q).trim())) {
    const n2 = Number(q);
    if (n2 >= 1 && n2 <= 64) return HEX[n2 - 1];
    throw new Error("Hexagram number must be 1\u201364");
  }
  const s = String(q).trim();
  if (/^[01]{6}$/.test(s)) return fromLines(s).primary;
  if (/^[6-9]{6}$/.test(s)) return fromLines(s).primary;
  const n = norm2(s);
  const t = toTrad(s);
  const hit = HEX.find((h) => toTrad(h.zh) === t || norm2(h.vi) === n || norm2(h.en) === n) ?? HEX.find((h) => norm2(h.vi).includes(n) || toTrad(h.zh).includes(t) || norm2(h.en).includes(n));
  if (!hit) throw new Error(`Unknown hexagram: "${q}"`);
  return hit;
}
function fromLines(lines) {
  const s = lines.replace(/[^0-9]/g, "");
  if (s.length !== 6) throw new Error("Give exactly six lines, bottom to top");
  const yang = [...s].map((c) => c === "1" || c === "7" || c === "9");
  const moving = [...s].map((c, i) => c === "6" || c === "9" ? i + 1 : 0).filter(Boolean);
  const bits = yang.map((b) => b ? "1" : "0").join("");
  const primary = hexOf(BY_LINES.get(bits.slice(3)).key, BY_LINES.get(bits.slice(0, 3)).key);
  let changed;
  if (moving.length) {
    const cb = yang.map((b, i) => moving.includes(i + 1) ? !b : b).map((b) => b ? "1" : "0").join("");
    changed = hexOf(BY_LINES.get(cb.slice(3)).key, BY_LINES.get(cb.slice(0, 3)).key);
  }
  return { primary, changed, moving, bits };
}
function cast(method = "ni") {
  if (method === "ni") return fromLines(Array.from({ length: 6 }, () => String(randomInt(2))).join(""));
  const lines = Array.from({ length: 6 }, () => String(6 + randomInt(2) + randomInt(2) + randomInt(2))).join("");
  return { ...fromLines(lines), raw: lines };
}
var sym = (h) => String.fromCodePoint(19904 + h.n - 1);
var draw = (bits, moving = []) => [...bits].map((b, i) => ({ b, i })).reverse().map(({ b, i }) => `    ${b === "1" ? "\u2501\u2501\u2501\u2501\u2501\u2501\u2501" : "\u2501\u2501\u2501 \u2501\u2501\u2501"}${moving.includes(i + 1) ? "  \u25CB" : ""}`).join("\n");
var bitsOf = (h) => TRI[h.lower].lines + TRI[h.upper].lines;
function changeHex(primary, moving) {
  if (!moving.length) return primary;
  const bits = bitsOf(primary);
  const cb = [...bits].map((b, i) => moving.includes(i + 1) ? b === "1" ? "0" : "1" : b).join("");
  return hexOf(BY_LINES.get(cb.slice(3)).key, BY_LINES.get(cb.slice(0, 3)).key);
}
var roleShort = (t, lang2) => lang2 === "en" ? t.role_en : t.role.split(" (")[0].toLowerCase();
var dirName = (t, lang2) => lang2 === "en" ? t.direction_en : t.direction;
var triName = (t, lang2) => lang2 === "en" ? `${t.zh} ${t.en}` : `${t.vi} ${t.symbol} (${t.nature_vi})`;
var ELEMENT_CYCLE = {
  Kim: { generates: "Th\u1EE7y", overcomes: "M\u1ED9c" },
  Th\u1EE7y: { generates: "M\u1ED9c", overcomes: "H\u1ECFa" },
  M\u1ED9c: { generates: "H\u1ECFa", overcomes: "Th\u1ED5" },
  H\u1ECFa: { generates: "Th\u1ED5", overcomes: "Kim" },
  Th\u1ED5: { generates: "Kim", overcomes: "Th\u1EE7y" }
};
function analyzeTheDung(primary, moving) {
  if (!moving.length) return null;
  const lowerMoving = moving.some((m) => m >= 1 && m <= 3);
  const upperMoving = moving.some((m) => m >= 4 && m <= 6);
  let theKey;
  let dungKey;
  let thePosition;
  if (lowerMoving && !upperMoving) {
    thePosition = "upper";
    theKey = primary.upper;
    dungKey = primary.lower;
  } else if (upperMoving && !lowerMoving) {
    thePosition = "lower";
    theKey = primary.lower;
    dungKey = primary.upper;
  } else {
    thePosition = "lower";
    theKey = primary.lower;
    dungKey = primary.upper;
  }
  const the = TRI[theKey];
  const dung = TRI[dungKey];
  const theEl = the.element;
  const dungEl = dung.element;
  let relation = "";
  let level = "";
  let description = "";
  if (ELEMENT_CYCLE[dungEl]?.generates === theEl) {
    relation = "D\u1EE5ng sinh Th\u1EC3";
    level = "\u0110\u1EA1i C\xE1t";
    description = `${dung.vi} (${dungEl}) sinh ${the.vi} (${theEl}) \u2014 ngo\u1EA1i c\u1EA3nh ph\xF9 tr\u1EE3, vi\u1EC7c c\u1EA7u hanh th\xF4ng, qu\xFD nh\xE2n gi\xFAp \u0111\u1EE1, t\u1EF1 nhi\xEAn m\xE0 th\xE0nh`;
  } else if (ELEMENT_CYCLE[theEl]?.overcomes === dungEl) {
    relation = "Th\u1EC3 kh\u1EAFc D\u1EE5ng";
    level = "Ti\u1EC3u C\xE1t";
    description = `${the.vi} (${theEl}) kh\u1EAFc ${dung.vi} (${dungEl}) \u2014 ph\u1EA3i n\u1ED7 l\u1EF1c v\u01B0\u1EE3t kh\xF3, ch\u1EBF ng\u1EF1 ngo\u1EA1i c\u1EA3nh m\u1EDBi th\xE0nh c\xF4ng, c\xF3 l\u1EE3i nh\u01B0ng hao t\u1ED5n c\xF4ng s\u1EE9c`;
  } else if (theEl === dungEl) {
    relation = "T\u1EF7 h\xF2a";
    level = "C\xE1t";
    description = `${the.vi} v\xE0 ${dung.vi} c\xF9ng h\xE0nh ${theEl} \u2014 b\u1EB1ng h\u1EEFu t\u01B0\u01A1ng tr\u1EE3, \u0111\u1ED3ng t\xE2m hi\u1EC7p l\u1EF1c, b\xECnh \u1ED5n nh\u01B0 \xFD`;
  } else if (ELEMENT_CYCLE[theEl]?.generates === dungEl) {
    relation = "Th\u1EC3 sinh D\u1EE5ng";
    level = "Ti\xEAu hao (Th\u1EE9 Hung)";
    description = `${the.vi} (${theEl}) sinh ${dung.vi} (${dungEl}) \u2014 t\u1ED5n hao nguy\xEAn kh\xED, t\u1ED1n t\xE0i t\u1ED1n s\u1EE9c v\xEC ng\u01B0\u1EDDi kh\xE1c ho\u1EB7c ho\xE0n c\u1EA3nh, v\u1EA5t v\u1EA3 m\xE0 thu ho\u1EA1ch \xEDt`;
  } else if (ELEMENT_CYCLE[dungEl]?.overcomes === theEl) {
    relation = "D\u1EE5ng kh\u1EAFc Th\u1EC3";
    level = "\u0110\u1EA1i Hung";
    description = `${dung.vi} (${dungEl}) kh\u1EAFc ${the.vi} (${theEl}) \u2014 ngo\u1EA1i c\u1EA3nh ch\xE8n \xE9p, g\u1EB7p tr\u1EAFc tr\u1EDF hi\u1EC3m nguy, b\u1ECB t\u1ED5n th\u1EA5t ho\u1EB7c c\u1EA3n tr\u1EDF l\u1EDBn`;
  }
  return { theTrigram: the, dungTrigram: dung, thePosition, relation, level, description };
}
function hexagramMarkdown(h, lang2 = "vi", moving = [], changed) {
  const u = TRI[h.upper], l = TRI[h.lower];
  const vi = lang2 === "vi";
  const mut = mutualHex(h);
  const out = [
    `## ${sym(h)} ${vi ? "Qu\u1EBB" : "Hexagram"} ${h.n}: ${vi ? h.vi : h.en} (${h.zh}${vi ? "" : `, Vietnamese ${h.vi}`})`,
    "",
    "```",
    draw(bitsOf(h), moving),
    "```",
    `- ${vi ? "Th\u01B0\u1EE3ng qu\xE1i (ngo\u1EA1i)" : "Upper trigram"}: ${triName(u, lang2)} \xB7 ${vi ? "H\u1EA1 qu\xE1i (n\u1ED9i)" : "Lower trigram"}: ${triName(l, lang2)}`,
    `- ${vi ? "\xDD ch\xEDnh" : "Gist"}: ${h.meaning}`,
    `- ${vi ? "Qu\xE1i t\u1EEB" : "Guaci (judgement)"}: ${h.guaci}`,
    `- ${vi ? "\u0110\u1EA1i t\u01B0\u1EE3ng" : "Xiang (great image)"}: ${h.xiang}`,
    `- ${vi ? "H\u1ED7 qu\xE1i (n\u1ED9i h\xE0m di\u1EC5n bi\u1EBFn)" : "Nuclear hexagram (mutual)"}: ${sym(mut)} ${mut.n}. ${vi ? mut.vi : mut.en} (${mut.zh}) \u2014 ${mut.meaning}`,
    `- ${vi ? "D\u01B0\u01A1ng tr\u1EA1ch (th\u1EA7y Ngh\xEA)" : "Yang-zhai reading (Ni Haixia)"}: ${vi ? `ng\u01B0\u1EDDi c\xF3 vai **${roleShort(u, lang2)}** (${u.vi}) \u1EDF ph\u01B0\u01A1ng **${l.direction}** (cung ${l.vi})` : `a person in the role of **${roleShort(u, lang2)}** (${u.zh}) living in the **${l.direction_en}** room (${l.zh} sector)`}`
  ];
  if (moving.length) {
    out.push(`- ${vi ? "H\xE0o \u0111\u1ED9ng" : "Moving lines"}: H\xE0o ${moving.join(", ")} \u2192 ${vi ? "qu\u1EBB bi\u1EBFn" : "changes to"} ${sym(changed)} ${changed.n}. ${vi ? changed.vi : changed.en} (${changed.zh})`);
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
          `- **Ph\xE2n t\xEDch Th\u1EC3 D\u1EE5ng (Mai Hoa D\u1ECBch S\u1ED1)**:`,
          `  - Th\u1EC3 (b\u1EA3n th\xE2n / vi\u1EC7c ta c\u1EA7u): **${td.theTrigram.vi}** ${td.theTrigram.symbol} (h\xE0nh ${td.theTrigram.element}) [${td.thePosition === "upper" ? "Th\u01B0\u1EE3ng qu\xE1i" : "H\u1EA1 qu\xE1i"}]`,
          `  - D\u1EE5ng (ngo\u1EA1i c\u1EA3nh / \u0111\u1ED1i ph\u01B0\u01A1ng): **${td.dungTrigram.vi}** ${td.dungTrigram.symbol} (h\xE0nh ${td.dungTrigram.element}) [${td.thePosition === "upper" ? "H\u1EA1 qu\xE1i" : "Th\u01B0\u1EE3ng qu\xE1i"}]`,
          `  - Quan h\u1EC7: **${td.relation}** (${td.level}) \u2014 ${td.description}`,
          ...moving.some((m) => m <= 3) && moving.some((m) => m >= 4) ? ["  - L\u01B0u \xFD: Mai Hoa d\xF9ng m\u1ED9t h\xE0o \u0111\u1ED9ng; \u1EDF \u0111\xE2y c\xF3 h\xE0o \u0111\u1ED9ng c\u1EA3 hai qu\xE1i n\xEAn Th\u1EC3 D\u1EE5ng ch\u1EC9 \u0111\u1EC3 tham kh\u1EA3o."] : []
        );
      } else {
        out.push(
          `- **Body and Use (Th\u1EC3 D\u1EE5ng - Plum Blossom)**:`,
          `  - Body (Self): **${td.theTrigram.en}** ${td.theTrigram.symbol} (${td.theTrigram.element}) [${td.thePosition} trigram]`,
          `  - Use (Circumstances): **${td.dungTrigram.en}** ${td.dungTrigram.symbol} (${td.dungTrigram.element}) [${td.thePosition === "upper" ? "lower" : "upper"} trigram]`,
          `  - Relationship: **${td.relation}** (${td.level}) \u2014 ${td.description}`,
          ...moving.some((m) => m <= 3) && moving.some((m) => m >= 4) ? ["  - Note: Plum Blossom uses a single moving line; with moving lines in both trigrams this is only indicative."] : []
        );
      }
    }
  }
  out.push(`- ${vi ? "L\u1EDDi gi\u1EA3ng c\u1EE7a th\u1EA7y Ngh\xEA v\u1EC1 qu\u1EBB n\xE0y" : "Ni Haixia's lecture quotes"}: \`references/vi/kinh-dich/que/${String(h.n).padStart(2, "0")}.md\`${vi ? " (ho\u1EB7c c\xF4ng c\u1EE5 t\xECm tr\xEDch d\u1EABn v\u1EDBi t\xEAn qu\u1EBB)" : " (or search quotes by the Chinese name)"}`);
  return out.join("\n");
}
function houseMarkdown(members, lang2 = "vi") {
  const vi = lang2 === "vi";
  const rows = members.map((m) => {
    const r = TRI[roleKey(m.role)], d = TRI[dirKey(m.direction)];
    const h = hexOf(r.key, d.key);
    const ok = r.key === d.key;
    return `| ${m.name ?? roleShort(r, lang2)} | ${roleShort(r, lang2)} (${vi ? r.vi : r.zh}) | ${dirName(d, lang2)} (${vi ? d.vi : d.zh}) | ${sym(h)} ${h.n}. ${vi ? h.vi : h.en} (${h.zh}) | ${ok ? vi ? "\u2705 \u0111\xFAng v\u1ECB (danh = v\u1ECB)" : "\u2705 own position" : h.meaning} |`;
  });
  const head = vi ? "| Ng\u01B0\u1EDDi | Vai | Ph\u01B0\u01A1ng ph\xF2ng | Qu\u1EBB | Ghi ch\xFA |\n|---|---|---|---|---|" : "| Person | Role | Room direction | Hexagram | Note |\n|---|---|---|---|---|";
  const note = vi ? "\nC\xE1ch \u0111\u1ECDc (th\u1EA7y Ngh\xEA): th\u01B0\u1EE3ng qu\xE1i l\xE0 ng\u01B0\u1EDDi, h\u1EA1 qu\xE1i l\xE0 ph\u01B0\u01A1ng c\u1EE7a ph\xF2ng t\xEDnh t\u1EEB t\xE2m nh\xE0. Danh = v\u1ECB th\xEC gia h\xF2a; v\u1ECB = danh th\xEC v\u1EA1n s\u1EF1 h\u01B0ng. \u0110\u1ED1i chi\u1EBFu quy t\u1EAFc trong `references/vi/kinh-dich/duong-trach.md` (b\u1EBFp, ph\xF2ng kh\xE1ch, nh\xE0 v\u1EC7 sinh, ch\xEDnh B\u1EAFc, ph\xE2n kim) v\xE0 l\u1EDDi gi\u1EA3ng t\u1EEBng qu\u1EBB trong `que/NN.md`. D\u01B0\u01A1ng tr\u1EA1ch ch\u1EC9 l\xE0 m\u1ED9t ph\u1EA7n ba; \u0111\xE2y l\xE0 xu h\u01B0\u1EDBng, kh\xF4ng ph\u1EA3i l\u1EDDi ph\xE1n ch\u1EAFc ch\u1EAFn." : "\nHow to read it (Ni Haixia): the upper trigram is the person, the lower trigram is the room's direction from the centre of the home. Role matching position brings family harmony. Check the rules in `references/vi/kinh-dich/duong-trach.md` (kitchen, living room, toilet, due north, compass boundary lines) and each hexagram's quotes in `que/NN.md`. Housing is about one third of the picture; these are tendencies, not verdicts.";
  return `${vi ? "## D\u01B0\u01A1ng tr\u1EA1ch: ng\u01B0\u1EDDi \xD7 ph\u01B0\u01A1ng" : "## Yang-zhai: person \xD7 direction"}

${head}
${rows.join("\n")}
${note}`;
}
var LIUREN = [
  { vi: "\u0110\u1EA1i An", zh: "\u5927\u5B89", en: "Great Peace", meaning_vi: "T\u1ED1t, kho\u1EA3ng m\u1ED9t tu\u1EA7n th\u1EA5y k\u1EBFt qu\u1EA3", meaning_en: "Good; result in about a week" },
  { vi: "L\u01B0u Li\xEAn", zh: "\u7559\u8FDE", en: "Lingering", meaning_vi: "Vi\u1EC7c c\xF2n \u0111\xECnh tr\u1EC7, ch\u01B0a ti\u1EBFn", meaning_en: "Stalled; no progress yet" },
  { vi: "T\u1ED1c H\u1EF7", zh: "\u901F\u559C", en: "Swift Joy", meaning_vi: "C\xF3 k\u1EBFt qu\u1EA3 ngay", meaning_en: "Quick result" },
  { vi: "X\xEDch Kh\u1EA9u", zh: "\u8D64\u53E3", en: "Red Mouth", meaning_vi: "Ng\u01B0\u1EDDi th\u1EE9 ba xen v\xE0o, ti\u1EC3u nh\xE2n, th\u1ECB phi", meaning_en: "A third party, gossip or disputes" },
  { vi: "Ti\u1EC3u C\xE1t", zh: "\u5C0F\u5409", en: "Small Luck", meaning_vi: "T\u1ED1t, kho\u1EA3ng hai tu\u1EA7n", meaning_en: "Good; about two weeks" },
  { vi: "Kh\xF4ng Vong", zh: "\u7A7A\u4EA1", en: "Void", meaning_vi: "Kh\xF4ng th\xE0nh, c\xF3 th\u1EC3 d\u1EE9t ni\u1EC7m", meaning_en: "Comes to nothing; let it go" }
];
function liuRen(month, day, hourBranch) {
  if (!(month >= 1 && month <= 12 && day >= 1 && day <= 30 && hourBranch >= 0 && hourBranch <= 11)) throw new Error("Need lunar month 1\u201312, lunar day 1\u201330, hour branch 0\u201311");
  const m = (month - 1) % 6, d = (m + day - 1) % 6, h = (d + hourBranch) % 6;
  return { month: LIUREN[m], day: LIUREN[d], hour: LIUREN[h] };
}
var BRANCH_VI = ["T\xFD", "S\u1EEDu", "D\u1EA7n", "M\xE3o", "Th\xECn", "T\u1EF5", "Ng\u1ECD", "M\xF9i", "Th\xE2n", "D\u1EADu", "Tu\u1EA5t", "H\u1EE3i"];
var hourBranchOf = (hhmm) => {
  const [h, mi] = hhmm.split(":").map(Number);
  if (!(h >= 0 && h < 24 && mi >= 0 && mi < 60)) throw new Error("Time must be HH:MM");
  return Math.floor((h + 1) % 24 / 2);
};
function liuRenMarkdown(month, day, hourBranch, lang2 = "vi") {
  const r = liuRen(month, day, hourBranch);
  const vi = lang2 === "vi";
  const name = (x) => vi ? `${x.vi} (${x.zh})` : `${x.en} (${x.zh}, ${x.vi})`;
  return [
    vi ? "## Ti\u1EC3u L\u1EE5c Nh\xE2m" : "## Xiao Liu Ren (finger reckoning)",
    "",
    `- ${vi ? "Th\xE1ng" : "Lunar month"} ${month} \u2192 ${name(r.month)}`,
    `- ${vi ? "Ng\xE0y" : "Lunar day"} ${day} \u2192 ${name(r.day)}`,
    `- ${vi ? "Gi\u1EDD" : "Hour"} ${BRANCH_VI[hourBranch]} \u2192 **${name(r.hour)}**: ${vi ? r.hour.meaning_vi : r.hour.meaning_en}`,
    "",
    vi ? "Th\u1EA7y Ngh\xEA: d\xF9ng ngay l\xFAc b\u1ED7ng c\xF3 linh c\u1EA3m v\u1EC1 m\u1ED9t vi\u1EC7c c\u1EE5 th\u1EC3; \u0111\xE3 h\u1ECFi th\xEC nghe theo, \u0111\u1EEBng kh\u1EDFi l\u1EA1i l\u1EA7n hai cho c\xF9ng m\u1ED9t ni\u1EC7m. Ch\u1EC9 \u0111\u1EC3 tham kh\u1EA3o." : "Ni Haixia: use it the moment a hunch about one specific matter arises; once asked, follow it and do not re-ask the same question. For reference only."
  ].join("\n");
}
function trigramsMarkdown(lang2 = "vi") {
  const vi = lang2 === "vi";
  const rows = iching_data_default.trigrams.map((t) => `| ${t.symbol} | ${vi ? t.vi : t.en} (${t.zh}) | ${vi ? t.nature_vi : t.en} | ${t.element} | ${dirName(t, lang2)} | ${roleShort(t, lang2)} |`);
  return [
    vi ? "## B\xE1t Qu\xE1i (H\u1EADu Thi\xEAn)" : "## Eight trigrams (Later Heaven)",
    "",
    vi ? "| | Qu\u1EBB | T\u01B0\u1EE3ng | Ng\u0169 h\xE0nh | Ph\u01B0\u01A1ng | Vai trong nh\xE0 |" : "| | Trigram | Image | Element (vi) | Direction | Family role |",
    "|---|---|---|---|---|---|",
    ...rows
  ].join("\n");
}

// src/kinh-dich-cli.ts
var a = {};
var argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith("--")) continue;
  const k = argv[i].slice(2), v = argv[i + 1];
  if (v === void 0 || v.startsWith("--")) a[k] = "true";
  else {
    a[k] = v;
    i++;
  }
}
var lang = a.lang === "en" ? "en" : "vi";
try {
  if (a.que) {
    const h = findHexagram(a.que);
    const moving = a.moving ? a.moving.split(",").map(Number).filter((n) => n >= 1 && n <= 6) : [];
    const changed = moving.length ? changeHex(h, moving) : void 0;
    console.log(hexagramMarkdown(h, lang, moving, changed));
  } else if (a.lines) {
    const r = fromLines(a.lines);
    console.log(hexagramMarkdown(r.primary, lang, r.moving, r.changed));
  } else if (a.cast) {
    const r = cast(a.method === "classic" ? "classic" : "ni");
    console.log(hexagramMarkdown(r.primary, lang, r.moving, r.changed));
  } else if (a.house) console.log(houseMarkdown(a.house.split(",").map((p) => {
    const [role, direction] = p.split(":");
    return { role: role.trim(), direction: (direction ?? "").trim() };
  }), lang));
  else if (a.liuren) {
    const [m, d] = a.liuren.split(/[\/-]/).map(Number);
    const hb = a["hour-branch"] !== void 0 ? Number(a["hour-branch"]) : hourBranchOf(a.time ?? "");
    console.log(liuRenMarkdown(m, d, hb, lang));
  } else if (a.grave || a.sit) {
    const list = (k) => a[k] && a[k] !== "true" ? a[k].split(",").map((x) => x.trim()) : void 0;
    console.log(graveMarkdown({ facing: a.grave && a.grave !== "true" ? a.grave : void 0, sitting: a.sit, waterIn: list("water-in"), waterOut: list("water-out"), roads: list("road") }, lang));
  } else if (a.trigrams) console.log(trigramsMarkdown(lang));
  else {
    console.error('Usage: node kinh-dich.mjs --que N|name [--moving 1,3] | --lines 100010 | --cast | --house "role:direction,..." | --liuren M/D --time HH:MM | --grave <h\u01B0\u1EDBng>|--sit <to\u1EA1> [--water-in X,Y] [--water-out X] [--road X] | --trigrams [--lang en|vi]');
    process.exit(1);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
