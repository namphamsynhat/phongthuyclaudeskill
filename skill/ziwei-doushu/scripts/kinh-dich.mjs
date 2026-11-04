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
      zh: "\u5151",
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
      zh: "\u79BB",
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
      zh: "\u4E7E\u4E3A\u5929",
      vi: "Thu\u1EA7n C\xE0n",
      en: "The Creative",
      upper: "qian",
      lower: "qian",
      meaning: "Tr\u1EDDi; c\u01B0\u01A1ng ki\u1EC7n, t\u1EF1 c\u01B0\u1EDDng kh\xF4ng ng\u1EEBng, l\xE0m ch\u1EE7"
    },
    {
      n: 2,
      zh: "\u5764\u4E3A\u5730",
      vi: "Thu\u1EA7n Kh\xF4n",
      en: "The Receptive",
      upper: "kun",
      lower: "kun",
      meaning: "\u0110\u1EA5t; nhu thu\u1EADn, bao dung, n\xE2ng \u0111\u1EE1 v\u1EA1n v\u1EADt"
    },
    {
      n: 3,
      zh: "\u6C34\u96F7\u5C6F",
      vi: "Th\u1EE7y L\xF4i Tru\xE2n",
      en: "Difficulty at the Beginning",
      upper: "kan",
      lower: "zhen",
      meaning: "Gian nan l\xFAc kh\u1EDFi \u0111\u1EA7u; gieo m\u1EA7m gi\u1EEFa kh\xF3 kh\u0103n"
    },
    {
      n: 4,
      zh: "\u5C71\u6C34\u8499",
      vi: "S\u01A1n Th\u1EE7y M\xF4ng",
      en: "Youthful Folly",
      upper: "gen",
      lower: "kan",
      meaning: "Non n\u1EDBt, m\u1EDD t\u1ED1i; c\u1EA7n h\u1ECDc h\u1ECFi v\xE0 khai s\xE1ng"
    },
    {
      n: 5,
      zh: "\u6C34\u5929\u9700",
      vi: "Th\u1EE7y Thi\xEAn Nhu",
      en: "Waiting",
      upper: "kan",
      lower: "qian",
      meaning: "Ch\u1EDD \u0111\u1EE3i \u0111\xFAng th\u1EDDi; nu\xF4i s\u1EE9c tr\u01B0\u1EDBc khi ti\u1EBFn"
    },
    {
      n: 6,
      zh: "\u5929\u6C34\u8BBC",
      vi: "Thi\xEAn Th\u1EE7y T\u1EE5ng",
      en: "Conflict",
      upper: "qian",
      lower: "kan",
      meaning: "Tranh ch\u1EA5p, ki\u1EC7n t\u1EE5ng; n\xEAn h\xF2a gi\u1EA3i, d\u1EEBng gi\u1EEFa ch\u1EEBng"
    },
    {
      n: 7,
      zh: "\u5730\u6C34\u5E08",
      vi: "\u0110\u1ECBa Th\u1EE7y S\u01B0",
      en: "The Army",
      upper: "kun",
      lower: "kan",
      meaning: "Qu\xE2n \u0111\u1ED9i, k\u1EF7 lu\u1EADt; d\u1EABn d\u1EAFt \u0111\xE1m \u0111\xF4ng b\u1EB1ng ch\xEDnh ngh\u0129a"
    },
    {
      n: 8,
      zh: "\u6C34\u5730\u6BD4",
      vi: "Th\u1EE7y \u0110\u1ECBa T\u1EF7",
      en: "Holding Together",
      upper: "kan",
      lower: "kun",
      meaning: "G\u1EA7n g\u0169i, li\xEAn k\u1EBFt; ch\u1ECDn \u0111\xFAng ng\u01B0\u1EDDi \u0111\u1EC3 theo"
    },
    {
      n: 9,
      zh: "\u98CE\u5929\u5C0F\u755C",
      vi: "Phong Thi\xEAn Ti\u1EC3u S\xFAc",
      en: "Small Taming",
      upper: "xun",
      lower: "qian",
      meaning: "T\xEDch nh\u1ECF; b\u1ECB ki\u1EC1m h\xE3m t\u1EA1m th\u1EDDi, t\xEDch l\u0169y d\u1EA7n"
    },
    {
      n: 10,
      zh: "\u5929\u6CFD\u5C65",
      vi: "Thi\xEAn Tr\u1EA1ch L\xFD",
      en: "Treading",
      upper: "qian",
      lower: "dui",
      meaning: "B\u01B0\u1EDBc \u0111i, l\u1EC5 ngh\u0129a; th\u1EADn tr\u1ECDng nh\u01B0 gi\u1EABm \u0111u\xF4i h\u1ED5"
    },
    {
      n: 11,
      zh: "\u5730\u5929\u6CF0",
      vi: "\u0110\u1ECBa Thi\xEAn Th\xE1i",
      en: "Peace",
      upper: "kun",
      lower: "qian",
      meaning: "Th\xF4ng su\u1ED1t, tr\xEAn d\u01B0\u1EDBi giao h\xF2a; hanh th\xF4ng"
    },
    {
      n: 12,
      zh: "\u5929\u5730\u5426",
      vi: "Thi\xEAn \u0110\u1ECBa B\u0129",
      en: "Standstill",
      upper: "qian",
      lower: "kun",
      meaning: "B\u1EBF t\u1EAFc, tr\xEAn d\u01B0\u1EDBi kh\xF4ng giao; gi\u1EEF m\xECnh ch\u1EDD th\u1EDDi"
    },
    {
      n: 13,
      zh: "\u5929\u706B\u540C\u4EBA",
      vi: "Thi\xEAn H\u1ECFa \u0110\u1ED3ng Nh\xE2n",
      en: "Fellowship",
      upper: "qian",
      lower: "li",
      meaning: "H\xF2a \u0111\u1ED3ng, c\xF9ng ch\xED h\u01B0\u1EDBng v\u1EDBi ng\u01B0\u1EDDi"
    },
    {
      n: 14,
      zh: "\u706B\u5929\u5927\u6709",
      vi: "H\u1ECFa Thi\xEAn \u0110\u1EA1i H\u1EEFu",
      en: "Great Possession",
      upper: "li",
      lower: "qian",
      meaning: "C\xF3 l\u1EDBn, sung t\xFAc; gi\u1EEF \u0111\u1EE9c \u0111\u1EC3 gi\u1EEF c\u1EE7a"
    },
    {
      n: 15,
      zh: "\u5730\u5C71\u8C26",
      vi: "\u0110\u1ECBa S\u01A1n Khi\xEAm",
      en: "Modesty",
      upper: "kun",
      lower: "gen",
      meaning: "Khi\xEAm t\u1ED1n; qu\u1EBB duy nh\u1EA5t s\xE1u h\xE0o \u0111\u1EC1u t\u1ED1t"
    },
    {
      n: 16,
      zh: "\u96F7\u5730\u8C6B",
      vi: "L\xF4i \u0110\u1ECBa D\u1EF1",
      en: "Enthusiasm",
      upper: "zhen",
      lower: "kun",
      meaning: "Vui v\u1EBB, an l\u1EA1c; chu\u1EA9n b\u1ECB tr\u01B0\u1EDBc, \u0111\u1EEBng ham vui"
    },
    {
      n: 17,
      zh: "\u6CFD\u96F7\u968F",
      vi: "Tr\u1EA1ch L\xF4i T\xF9y",
      en: "Following",
      upper: "dui",
      lower: "zhen",
      meaning: "Theo, thu\u1EADn theo th\u1EDDi v\xE0 ng\u01B0\u1EDDi"
    },
    {
      n: 18,
      zh: "\u5C71\u98CE\u86CA",
      vi: "S\u01A1n Phong C\u1ED5",
      en: "Work on the Decayed",
      upper: "gen",
      lower: "xun",
      meaning: "H\u01B0 h\u1ECFng t\xEDch t\u1EE5; s\u1EEDa sai do \u0111\u1EDDi tr\u01B0\u1EDBc \u0111\u1EC3 l\u1EA1i"
    },
    {
      n: 19,
      zh: "\u5730\u6CFD\u4E34",
      vi: "\u0110\u1ECBa Tr\u1EA1ch L\xE2m",
      en: "Approach",
      upper: "kun",
      lower: "dui",
      meaning: "\u0110\u1EBFn g\u1EA7n, gi\xE1m s\xE1t; th\u1EDDi th\u1ECBnh nh\u01B0ng ph\u1EA3i lo xa"
    },
    {
      n: 20,
      zh: "\u98CE\u5730\u89C2",
      vi: "Phong \u0110\u1ECBa Quan",
      en: "Contemplation",
      upper: "xun",
      lower: "kun",
      meaning: "Quan s\xE1t, l\xE0m g\u01B0\u01A1ng cho ng\u01B0\u1EDDi nh\xECn v\xE0o"
    },
    {
      n: 21,
      zh: "\u706B\u96F7\u566C\u55D1",
      vi: "H\u1ECFa L\xF4i Ph\u1EC7 H\u1EA1p",
      en: "Biting Through",
      upper: "li",
      lower: "zhen",
      meaning: "C\u1EAFn h\u1EE3p; tr\u1EEB v\u1EADt c\u1EA3n, h\xECnh ph\u1EA1t nghi\xEAm minh"
    },
    {
      n: 22,
      zh: "\u5C71\u706B\u8D32",
      vi: "S\u01A1n H\u1ECFa B\xED",
      en: "Grace",
      upper: "gen",
      lower: "li",
      meaning: "Trang s\u1EE9c, v\u1EBB ngo\xE0i; \u0111\u1EB9p nh\u01B0ng \u0111\u1EEBng qu\xE1 h\xECnh th\u1EE9c"
    },
    {
      n: 23,
      zh: "\u5C71\u5730\u5265",
      vi: "S\u01A1n \u0110\u1ECBa B\xE1c",
      en: "Splitting Apart",
      upper: "gen",
      lower: "kun",
      meaning: "B\xF3c m\xF2n, suy s\u1EE5p; n\xEAn y\xEAn l\u1EB7ng gi\u1EEF g\u1ED1c"
    },
    {
      n: 24,
      zh: "\u5730\u96F7\u590D",
      vi: "\u0110\u1ECBa L\xF4i Ph\u1EE5c",
      en: "Return",
      upper: "kun",
      lower: "zhen",
      meaning: "Tr\u1EDF l\u1EA1i, ph\u1EE5c h\u1ED3i; d\u01B0\u01A1ng kh\xED b\u1EAFt \u0111\u1EA7u quay v\u1EC1"
    },
    {
      n: 25,
      zh: "\u5929\u96F7\u65E0\u5984",
      vi: "Thi\xEAn L\xF4i V\xF4 V\u1ECDng",
      en: "Innocence",
      upper: "qian",
      lower: "zhen",
      meaning: "Kh\xF4ng c\xE0n b\u1EADy; ch\xE2n th\u1EADt, tai h\u1ECDa b\u1EA5t ng\u1EDD"
    },
    {
      n: 26,
      zh: "\u5C71\u5929\u5927\u755C",
      vi: "S\u01A1n Thi\xEAn \u0110\u1EA1i S\xFAc",
      en: "Great Taming",
      upper: "gen",
      lower: "qian",
      meaning: "T\xEDch l\u1EDBn; nu\xF4i d\u01B0\u1EE1ng t\xE0i \u0111\u1EE9c, ch\u1EDD th\u1EDDi ra gi\xFAp \u0111\u1EDDi"
    },
    {
      n: 27,
      zh: "\u5C71\u96F7\u9890",
      vi: "S\u01A1n L\xF4i Di",
      en: "Nourishment",
      upper: "gen",
      lower: "zhen",
      meaning: "Nu\xF4i d\u01B0\u1EE1ng; c\u1EA9n tr\u1ECDng l\u1EDDi n\xF3i v\xE0 \u0103n u\u1ED1ng"
    },
    {
      n: 28,
      zh: "\u6CFD\u98CE\u5927\u8FC7",
      vi: "Tr\u1EA1ch Phong \u0110\u1EA1i Qu\xE1",
      en: "Great Exceeding",
      upper: "dui",
      lower: "xun",
      meaning: "Qu\xE1 l\u1EDBn; g\xE1nh n\u1EB7ng qu\xE1 s\u1EE9c, c\u1ED9t k\xE8o cong"
    },
    {
      n: 29,
      zh: "\u574E\u4E3A\u6C34",
      vi: "Thu\u1EA7n Kh\u1EA3m",
      en: "The Abysmal (Water)",
      upper: "kan",
      lower: "kan",
      meaning: "Hi\u1EC3m nguy ch\u1ED3ng ch\u1EA5t; gi\u1EEF l\xF2ng tin \u0111\u1EC3 v\u01B0\u1EE3t hi\u1EC3m"
    },
    {
      n: 30,
      zh: "\u79BB\u4E3A\u706B",
      vi: "Thu\u1EA7n Ly",
      en: "The Clinging (Fire)",
      upper: "li",
      lower: "li",
      meaning: "S\xE1ng, n\u01B0\u01A1ng t\u1EF1a; v\u0103n minh, b\xE1m v\xE0o ch\u1ED7 \u0111\xFAng"
    },
    {
      n: 31,
      zh: "\u6CFD\u5C71\u54B8",
      vi: "Tr\u1EA1ch S\u01A1n H\xE0m",
      en: "Influence",
      upper: "dui",
      lower: "gen",
      meaning: "C\u1EA3m \u1EE9ng, t\xECnh c\u1EA3m nam n\u1EEF"
    },
    {
      n: 32,
      zh: "\u96F7\u98CE\u6052",
      vi: "L\xF4i Phong H\u1EB1ng",
      en: "Duration",
      upper: "zhen",
      lower: "xun",
      meaning: "B\u1EC1n l\xE2u; \u0111\u1EA1o v\u1EE3 ch\u1ED3ng l\xE2u d\xE0i"
    },
    {
      n: 33,
      zh: "\u5929\u5C71\u906F",
      vi: "Thi\xEAn S\u01A1n \u0110\u1ED9n",
      en: "Retreat",
      upper: "qian",
      lower: "gen",
      meaning: "Lui \u1EA9n \u0111\xFAng l\xFAc \u0111\u1EC3 gi\u1EEF m\xECnh"
    },
    {
      n: 34,
      zh: "\u96F7\u5929\u5927\u58EE",
      vi: "L\xF4i Thi\xEAn \u0110\u1EA1i Tr\xE1ng",
      en: "Great Power",
      upper: "zhen",
      lower: "qian",
      meaning: "M\u1EA1nh l\u1EDBn; m\u1EA1nh nh\u01B0ng ph\u1EA3i gi\u1EEF ch\xEDnh \u0111\u1EA1o"
    },
    {
      n: 35,
      zh: "\u706B\u5730\u664B",
      vi: "H\u1ECFa \u0110\u1ECBa T\u1EA5n",
      en: "Progress",
      upper: "li",
      lower: "kun",
      meaning: "Ti\u1EBFn l\xEAn nh\u01B0 m\u1EB7t tr\u1EDDi m\u1ECDc"
    },
    {
      n: 36,
      zh: "\u5730\u706B\u660E\u5937",
      vi: "\u0110\u1ECBa H\u1ECFa Minh Di",
      en: "Darkening of the Light",
      upper: "kun",
      lower: "li",
      meaning: "\xC1nh s\xE1ng b\u1ECB che, b\u1ECB t\u1ED5n th\u01B0\u01A1ng; gi\u1EA5u t\xE0i gi\u1EEF m\xECnh"
    },
    {
      n: 37,
      zh: "\u98CE\u706B\u5BB6\u4EBA",
      vi: "Phong H\u1ECFa Gia Nh\xE2n",
      en: "The Family",
      upper: "xun",
      lower: "li",
      meaning: "Ng\u01B0\u1EDDi nh\xE0; \u0111\u1EA1o gia \u0111\xECnh, m\u1ED7i ng\u01B0\u1EDDi \u0111\xFAng v\u1ECB tr\xED"
    },
    {
      n: 38,
      zh: "\u706B\u6CFD\u777D",
      vi: "H\u1ECFa Tr\u1EA1ch Khu\xEA",
      en: "Opposition",
      upper: "li",
      lower: "dui",
      meaning: "Chia l\xECa, tr\xE1i \xFD; t\xECm \u0111i\u1EC3m chung trong kh\xE1c bi\u1EC7t"
    },
    {
      n: 39,
      zh: "\u6C34\u5C71\u8E47",
      vi: "Th\u1EE7y S\u01A1n Ki\u1EC3n",
      en: "Obstruction",
      upper: "kan",
      lower: "gen",
      meaning: "Gian nan, \u0111i kh\xF3; quay l\u1EA1i tu th\xE2n"
    },
    {
      n: 40,
      zh: "\u96F7\u6C34\u89E3",
      vi: "L\xF4i Th\u1EE7y Gi\u1EA3i",
      en: "Deliverance",
      upper: "zhen",
      lower: "kan",
      meaning: "Gi\u1EA3i t\u1ECFa, th\xE1o g\u1EE1 kh\xF3 kh\u0103n"
    },
    {
      n: 41,
      zh: "\u5C71\u6CFD\u635F",
      vi: "S\u01A1n Tr\u1EA1ch T\u1ED5n",
      en: "Decrease",
      upper: "gen",
      lower: "dui",
      meaning: "B\u1EDBt; b\u1EDBt d\u01B0\u1EDBi th\xEAm tr\xEAn, b\u1EDBt d\u1EE5c v\u1ECDng"
    },
    {
      n: 42,
      zh: "\u98CE\u96F7\u76CA",
      vi: "Phong L\xF4i \xCDch",
      en: "Increase",
      upper: "xun",
      lower: "zhen",
      meaning: "Th\xEAm; b\u1EDBt tr\xEAn th\xEAm d\u01B0\u1EDBi, l\xE0m l\u1EE3i cho ng\u01B0\u1EDDi"
    },
    {
      n: 43,
      zh: "\u6CFD\u5929\u592C",
      vi: "Tr\u1EA1ch Thi\xEAn Qu\u1EA3i",
      en: "Breakthrough",
      upper: "dui",
      lower: "qian",
      meaning: "Quy\u1EBFt \u0111o\xE1n; tr\u1EEB b\u1ECF k\u1EBB ti\u1EC3u nh\xE2n"
    },
    {
      n: 44,
      zh: "\u5929\u98CE\u59E4",
      vi: "Thi\xEAn Phong C\u1EA5u",
      en: "Coming to Meet",
      upper: "qian",
      lower: "xun",
      meaning: "G\u1EB7p g\u1EE1 b\u1EA5t ng\u1EDD; m\u1ED9t \xE2m g\u1EB7p n\u0103m d\u01B0\u01A1ng"
    },
    {
      n: 45,
      zh: "\u6CFD\u5730\u8403",
      vi: "Tr\u1EA1ch \u0110\u1ECBa T\u1EE5y",
      en: "Gathering Together",
      upper: "dui",
      lower: "kun",
      meaning: "T\u1EE5 h\u1ECDp; ng\u01B0\u1EDDi v\xE0 c\u1EE7a t\u1EE5 v\u1EC1"
    },
    {
      n: 46,
      zh: "\u5730\u98CE\u5347",
      vi: "\u0110\u1ECBa Phong Th\u0103ng",
      en: "Pushing Upward",
      upper: "kun",
      lower: "xun",
      meaning: "\u0110i l\xEAn d\u1EA7n, nh\u01B0 c\xE2y m\u1ECDc t\u1EEB \u0111\u1EA5t"
    },
    {
      n: 47,
      zh: "\u6CFD\u6C34\u56F0",
      vi: "Tr\u1EA1ch Th\u1EE7y Kh\u1ED1n",
      en: "Oppression",
      upper: "dui",
      lower: "kan",
      meaning: "Kh\u1ED1n c\xF9ng; gi\u1EEF ch\xED trong c\u1EA3nh kh\xF3"
    },
    {
      n: 48,
      zh: "\u6C34\u98CE\u4E95",
      vi: "Th\u1EE7y Phong T\u1EC9nh",
      en: "The Well",
      upper: "kan",
      lower: "xun",
      meaning: "C\xE1i gi\u1EBFng; nu\xF4i ng\u01B0\u1EDDi kh\xF4ng c\u1EA1n"
    },
    {
      n: 49,
      zh: "\u6CFD\u706B\u9769",
      vi: "Tr\u1EA1ch H\u1ECFa C\xE1ch",
      en: "Revolution",
      upper: "dui",
      lower: "li",
      meaning: "Thay \u0111\u1ED5i, c\xE1ch m\u1EA1ng; \u0111\u1ED5i \u0111\xFAng th\u1EDDi"
    },
    {
      n: 50,
      zh: "\u706B\u98CE\u9F0E",
      vi: "H\u1ECFa Phong \u0110\u1EC9nh",
      en: "The Cauldron",
      upper: "li",
      lower: "xun",
      meaning: "C\xE1i v\u1EA1c; l\u1EADp c\xE1i m\u1EDBi, \u1ED5n \u0111\u1ECBnh"
    },
    {
      n: 51,
      zh: "\u9707\u4E3A\u96F7",
      vi: "Thu\u1EA7n Ch\u1EA5n",
      en: "The Arousing (Thunder)",
      upper: "zhen",
      lower: "zhen",
      meaning: "S\u1EA5m \u0111\u1ED9ng; kinh s\u1EE3 r\u1ED3i t\u1EC9nh ng\u1ED9"
    },
    {
      n: 52,
      zh: "\u826E\u4E3A\u5C71",
      vi: "Thu\u1EA7n C\u1EA5n",
      en: "Keeping Still (Mountain)",
      upper: "gen",
      lower: "gen",
      meaning: "N\xFAi; d\u1EEBng l\u1EA1i \u0111\xFAng ch\u1ED7"
    },
    {
      n: 53,
      zh: "\u98CE\u5C71\u6E10",
      vi: "Phong S\u01A1n Ti\u1EC7m",
      en: "Development",
      upper: "xun",
      lower: "gen",
      meaning: "Ti\u1EBFn d\u1EA7n theo th\u1EE9 t\u1EF1; con g\xE1i v\u1EC1 nh\xE0 ch\u1ED3ng \u0111\xFAng l\u1EC5"
    },
    {
      n: 54,
      zh: "\u96F7\u6CFD\u5F52\u59B9",
      vi: "L\xF4i Tr\u1EA1ch Quy Mu\u1ED9i",
      en: "The Marrying Maiden",
      upper: "zhen",
      lower: "dui",
      meaning: "Em g\xE1i v\u1EC1 nh\xE0 ch\u1ED3ng; v\u1ED9i v\xE0ng, sai v\u1ECB tr\xED"
    },
    {
      n: 55,
      zh: "\u96F7\u706B\u4E30",
      vi: "L\xF4i H\u1ECFa Phong",
      en: "Abundance",
      upper: "zhen",
      lower: "li",
      meaning: "Th\u1ECBnh l\u1EDBn; th\u1ECBnh r\u1ED3i s\u1EBD suy, gi\u1EEF s\xE1ng su\u1ED1t"
    },
    {
      n: 56,
      zh: "\u706B\u5C71\u65C5",
      vi: "H\u1ECFa S\u01A1n L\u1EEF",
      en: "The Wanderer",
      upper: "li",
      lower: "gen",
      meaning: "L\u1EEF kh\xE1ch, \u0111i xa, kh\xF4ng \u1ED5n \u0111\u1ECBnh"
    },
    {
      n: 57,
      zh: "\u5DFD\u4E3A\u98CE",
      vi: "Thu\u1EA7n T\u1ED1n",
      en: "The Gentle (Wind)",
      upper: "xun",
      lower: "xun",
      meaning: "Gi\xF3; nhu thu\u1EADn, th\xE2m nh\u1EADp"
    },
    {
      n: 58,
      zh: "\u5151\u4E3A\u6CFD",
      vi: "Thu\u1EA7n \u0110o\xE0i",
      en: "The Joyous (Lake)",
      upper: "dui",
      lower: "dui",
      meaning: "\u0110\u1EA7m; vui v\u1EBB, n\xF3i n\u0103ng, giao ti\u1EBFp"
    },
    {
      n: 59,
      zh: "\u98CE\u6C34\u6DA3",
      vi: "Phong Th\u1EE7y Ho\xE1n",
      en: "Dispersion",
      upper: "xun",
      lower: "kan",
      meaning: "Tan t\xE1c, ph\xE2n t\xE1n; gom l\xF2ng ng\u01B0\u1EDDi l\u1EA1i"
    },
    {
      n: 60,
      zh: "\u6C34\u6CFD\u8282",
      vi: "Th\u1EE7y Tr\u1EA1ch Ti\u1EBFt",
      en: "Limitation",
      upper: "kan",
      lower: "dui",
      meaning: "Ti\u1EBFt ch\u1EBF, c\xF3 ch\u1EEBng m\u1EF1c"
    },
    {
      n: 61,
      zh: "\u98CE\u6CFD\u4E2D\u5B5A",
      vi: "Phong Tr\u1EA1ch Trung Phu",
      en: "Inner Truth",
      upper: "xun",
      lower: "dui",
      meaning: "L\xF2ng th\xE0nh t\xEDn b\xEAn trong"
    },
    {
      n: 62,
      zh: "\u96F7\u5C71\u5C0F\u8FC7",
      vi: "L\xF4i S\u01A1n Ti\u1EC3u Qu\xE1",
      en: "Small Exceeding",
      upper: "zhen",
      lower: "gen",
      meaning: "Qu\xE1 nh\u1ECF; vi\u1EC7c nh\u1ECF \u0111\u01B0\u1EE3c, vi\u1EC7c l\u1EDBn kh\xF4ng"
    },
    {
      n: 63,
      zh: "\u6C34\u706B\u65E2\u6D4E",
      vi: "Th\u1EE7y H\u1ECFa K\xFD T\u1EBF",
      en: "After Completion",
      upper: "kan",
      lower: "li",
      meaning: "\u0110\xE3 xong; th\xE0nh r\u1ED3i ph\u1EA3i \u0111\u1EC1 ph\xF2ng lo\u1EA1n"
    },
    {
      n: 64,
      zh: "\u706B\u6C34\u672A\u6D4E",
      vi: "H\u1ECFa Th\u1EE7y V\u1ECB T\u1EBF",
      en: "Before Completion",
      upper: "li",
      lower: "kan",
      meaning: "Ch\u01B0a xong; c\xF2n c\u01A1 h\u1ED9i, th\u1EADn tr\u1ECDng \u0111i ti\u1EBFp"
    }
  ]
};

// src/iching.ts
var TRI = Object.fromEntries(iching_data_default.trigrams.map((t) => [t.key, t]));
var HEX = iching_data_default.hexagrams;
var BY_PAIR = new Map(HEX.map((h) => [`${h.upper}|${h.lower}`, h]));
var BY_LINES = new Map(iching_data_default.trigrams.map((t) => [t.lines, t]));
var norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9一-鿿]+/g, " ").trim();
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
  const n = norm(q);
  for (const [k, list] of Object.entries(aliases)) if (list.some((a2) => norm(a2) === n)) return k;
  let best = "", key = "";
  const padded = ` ${n} `;
  for (const [k, list] of Object.entries(aliases)) for (const a2 of list) {
    const na = norm(a2);
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
function findHexagram(q) {
  if (typeof q === "number" || /^\d{1,2}$/.test(String(q).trim())) {
    const n2 = Number(q);
    if (n2 >= 1 && n2 <= 64) return HEX[n2 - 1];
    throw new Error("Hexagram number must be 1\u201364");
  }
  const s = String(q).trim();
  if (/^[01]{6}$/.test(s)) return fromLines(s).primary;
  if (/^[6-9]{6}$/.test(s)) return fromLines(s).primary;
  const n = norm(s);
  const hit = HEX.find((h) => h.zh === s || norm(h.vi) === n || norm(h.en) === n) ?? HEX.find((h) => norm(h.vi).includes(n) || h.zh.includes(s) || norm(h.en).includes(n));
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
var roleShort = (t, lang2) => lang2 === "en" ? t.role_en : t.role.split(" (")[0].toLowerCase();
var dirName = (t, lang2) => lang2 === "en" ? t.direction_en : t.direction;
var triName = (t, lang2) => lang2 === "en" ? `${t.zh} ${t.en}` : `${t.vi} ${t.symbol} (${t.nature_vi})`;
function hexagramMarkdown(h, lang2 = "vi", moving = [], changed) {
  const u = TRI[h.upper], l = TRI[h.lower];
  const vi = lang2 === "vi";
  const out = [
    `## ${sym(h)} ${vi ? "Qu\u1EBB" : "Hexagram"} ${h.n}: ${vi ? h.vi : h.en} (${h.zh}${vi ? "" : `, Vietnamese ${h.vi}`})`,
    "",
    "```",
    draw(bitsOf(h), moving),
    "```",
    `- ${vi ? "Th\u01B0\u1EE3ng qu\xE1i (ngo\u1EA1i)" : "Upper trigram"}: ${triName(u, lang2)} \xB7 ${vi ? "H\u1EA1 qu\xE1i (n\u1ED9i)" : "Lower trigram"}: ${triName(l, lang2)}`,
    `- ${vi ? "\xDD ch\xEDnh" : "Gist (Vietnamese summary)"}: ${h.meaning}`,
    `- ${vi ? "D\u01B0\u01A1ng tr\u1EA1ch (th\u1EA7y Ngh\xEA)" : "Yang-zhai reading (Ni Haixia)"}: ${vi ? `ng\u01B0\u1EDDi c\xF3 vai **${roleShort(u, lang2)}** (${u.vi}) \u1EDF ph\u01B0\u01A1ng **${l.direction}** (cung ${l.vi})` : `a person in the role of **${roleShort(u, lang2)}** (${u.zh}) living in the **${l.direction_en}** room (${l.zh} sector)`}`
  ];
  if (moving.length) out.push(`- ${vi ? "H\xE0o \u0111\u1ED9ng" : "Moving lines"}: ${moving.join(", ")} \u2192 ${vi ? "qu\u1EBB bi\u1EBFn" : "changes to"} ${sym(changed)} ${changed.n}. ${vi ? changed.vi : changed.en} (${changed.zh})`);
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
  if (a.que) console.log(hexagramMarkdown(findHexagram(a.que), lang));
  else if (a.lines) {
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
  } else if (a.trigrams) console.log(trigramsMarkdown(lang));
  else {
    console.error('Usage: node kinh-dich.mjs --que N|name | --lines 100010 | --cast | --house "role:direction,..." | --liuren M/D --time HH:MM | --trigrams [--lang en|vi]');
    process.exit(1);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
