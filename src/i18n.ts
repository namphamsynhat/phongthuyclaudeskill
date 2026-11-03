/** English / Vietnamese names for Zi Wei Dou Shu terms. */
export type Lang = 'en' | 'vi';

// char -> [Hán-Việt, pinyin]
const C: Record<string, [string, string]> = {
  丁: ['Đinh', 'ding'], 七: ['Thất', 'qi'], 三: ['Tam', 'san'], 不: ['Bất', 'bu'], 丑: ['Sửu', 'chou'], 丙: ['Bính', 'bing'],
  丧: ['Tang', 'sang'], 中: ['Trung', 'zhong'], 临: ['Lâm', 'lin'], 乙: ['Ất', 'yi'], 书: ['Thư', 'shu'], 二: ['Nhị', 'er'],
  五: ['Ngũ', 'wu'], 亡: ['Vong', 'wang'], 亥: ['Hợi', 'hai'], 仆: ['Bộc', 'pu'], 伏: ['Phục', 'fu'], 会: ['Hội', 'hui'],
  伤: ['Thương', 'shang'], 使: ['Sứ', 'shi'], 兄: ['Huynh', 'xiong'], 光: ['Quang', 'guang'], 入: ['Nhập', 'ru'], 八: ['Bát', 'ba'],
  六: ['Lục', 'liu'], 兵: ['Binh', 'bing'], 养: ['Dưỡng', 'yang'], 军: ['Quân', 'jun'], 冠: ['Quan', 'guan'], 凤: ['Phượng', 'feng'],
  出: ['Xuất', 'chu'], 刑: ['Hình', 'xing'], 利: ['Lợi', 'li'], 副: ['Phó', 'fu'], 力: ['Lực', 'li'], 加: ['Gia', 'jia'],
  劫: ['Kiếp', 'jie'], 化: ['Hóa', 'hua'], 午: ['Ngọ', 'wu'], 华: ['Hoa', 'hua'], 博: ['Bác', 'bo'], 卯: ['Mão', 'mao'],
  厄: ['Ách', 'e'], 厨: ['Trù', 'chu'], 双: ['Song', 'shuang'], 台: ['Thai', 'tai'], 右: ['Hữu', 'you'], 吊: ['Điếu', 'diao'],
  同: ['Đồng', 'tong'], 君: ['Quân', 'jun'], 命: ['Mệnh', 'ming'], 咸: ['Hàm', 'xian'], 哭: ['Khốc', 'ku'], 喜: ['Hỷ', 'xi'],
  四: ['Tứ', 'si'], 因: ['Nhân', 'yin'], 土: ['Thổ', 'tu'], 地: ['Địa', 'di'], 垣: ['Viên', 'yuan'], 墓: ['Mộ', 'mu'],
  士: ['Sĩ', 'shi'], 壬: ['Nhâm', 'ren'], 大: ['Đại', 'da'], 天: ['Thiên', 'tian'], 太: ['Thái', 'tai'], 夫: ['Phu', 'fu'],
  头: ['Đầu', 'tou'], 夹: ['Giáp', 'jia'], 奇: ['Kỳ', 'qi'], 奏: ['Tấu', 'zou'], 女: ['Nữ', 'nü'], 妻: ['Thê', 'qi'],
  姚: ['Diêu', 'yao'], 子: ['Tử', 'zi'], 存: ['Tồn', 'cun'], 孤: ['Cô', 'gu'], 宅: ['Trạch', 'zhai'], 官: ['Quan', 'guan'],
  客: ['Khách', 'ke'], 宫: ['Cung', 'gong'], 宿: ['Tú', 'su'], 寅: ['Dần', 'yin'], 寡: ['Quả', 'gua'], 寿: ['Thọ', 'shou'],
  封: ['Phong', 'feng'], 将: ['Tướng', 'jiang'], 小: ['Tiểu', 'xiao'], 局: ['Cục', 'ju'], 岁: ['Tuế', 'sui'], 左: ['Tả', 'zuo'],
  巨: ['Cự', 'ju'], 巫: ['Vu', 'wu'], 己: ['Kỷ', 'ji'], 巳: ['Tỵ', 'si'], 帛: ['Bạch', 'bo'], 帝: ['Đế', 'di'],
  带: ['Đới', 'dai'], 平: ['Bình', 'ping'], 年: ['Niên', 'nian'], 庆: ['Khánh', 'qing'], 庙: ['Miếu', 'miao'], 庚: ['Canh', 'geng'],
  府: ['Phủ', 'fu'], 座: ['Tọa', 'zuo'], 廉: ['Liêm', 'lian'], 建: ['Kiến', 'jian'], 弟: ['Đệ', 'di'], 弼: ['Bật', 'bi'],
  役: ['Dịch', 'yi'], 得: ['Đắc', 'de'], 微: ['Vi', 'wei'], 德: ['Đức', 'de'], 忌: ['Kỵ', 'ji'], 恩: ['Ân', 'en'],
  息: ['Tức', 'xi'], 戊: ['Mậu', 'wu'], 戌: ['Tuất', 'xu'], 截: ['Triệt', 'jie'], 才: ['Tài', 'cai'], 指: ['Chỉ', 'zhi'],
  擎: ['Kình', 'qing'], 攀: ['Phan', 'pan'], 文: ['Văn', 'wen'], 日: ['Nhật', 'ri'], 旬: ['Tuần', 'xun'], 时: ['Thời', 'shi'],
  旺: ['Vượng', 'wang'], 昌: ['Xương', 'chang'], 明: ['Minh', 'ming'], 星: ['Tinh', 'xing'], 晦: ['Hối', 'hui'], 曲: ['Khúc', 'qu'],
  月: ['Nguyệt', 'yue'], 朝: ['Triều', 'chao'], 木: ['Mộc', 'mu'], 未: ['Mùi', 'wei'], 机: ['Cơ', 'ji'], 杀: ['Sát', 'sha'],
  权: ['Quyền', 'quan'], 来: ['Lai', 'lai'], 格: ['Cách', 'ge'], 梁: ['Lương', 'liang'], 武: ['Vũ', 'wu'], 死: ['Tử', 'si'],
  母: ['Mẫu', 'mu'], 气: ['Khí', 'qi'], 水: ['Thủy', 'shui'], 池: ['Trì', 'chi'], 沐: ['Mộc', 'mu'], 流: ['Lưu', 'liu'],
  浴: ['Dục', 'yu'], 海: ['Hải', 'hai'], 火: ['Hỏa', 'huo'], 灾: ['Tai', 'zai'], 煞: ['Sát', 'sha'], 父: ['Phụ', 'fu'],
  狼: ['Lang', 'lang'], 玉: ['Ngọc', 'yu'], 珠: ['Châu', 'zhu'], 生: ['Sinh', 'sheng'], 田: ['Điền', 'tian'], 甲: ['Giáp', 'jia'],
  申: ['Thân', 'shen'], 男: ['Nam', 'nan'], 疾: ['Tật', 'ji'], 病: ['Bệnh', 'bing'], 癸: ['Quý', 'gui'], 白: ['Bạch', 'bai'],
  盖: ['Cái', 'gai'], 相: ['Tướng', 'xiang'], 石: ['Thạch', 'shi'], 破: ['Phá', 'po'], 碎: ['Toái', 'sui'], 神: ['Thần', 'shen'],
  禄: ['Lộc', 'lu'], 福: ['Phúc', 'fu'], 科: ['Khoa', 'ke'], 移: ['Di', 'yi'], 空: ['Không', 'kong'], 符: ['Phù', 'fu'],
  箭: ['Tiễn', 'jian'], 索: ['Sách', 'suo'], 紫: ['Tử', 'zi'], 红: ['Hồng', 'hong'], 绝: ['Tuyệt', 'jue'], 罗: ['La', 'luo'],
  羊: ['Dương', 'yang'], 耗: ['Hao', 'hao'], 背: ['Bối', 'bei'], 胎: ['Thai', 'tai'], 臣: ['Thần', 'chen'], 虎: ['Hổ', 'hu'],
  虚: ['Hư', 'xu'], 蜚: ['Phi', 'fei'], 衰: ['Suy', 'shuai'], 解: ['Giải', 'jie'], 诰: ['Cáo', 'gao'], 贞: ['Trinh', 'zhen'],
  财: ['Tài', 'cai'], 贪: ['Tham', 'tan'], 贯: ['Quán', 'guan'], 贵: ['Quý', 'gui'], 路: ['Lộ', 'lu'], 身: ['Thân', 'shen'],
  辅: ['Phụ', 'fu'], 辛: ['Tân', 'xin'], 辰: ['Thìn', 'chen'], 迁: ['Thiên', 'qian'], 运: ['Vận', 'yun'], 酉: ['Dậu', 'you'],
  金: ['Kim', 'jin'], 钺: ['Việt', 'yue'], 铃: ['Linh', 'ling'], 长: ['Trường', 'chang'], 门: ['Môn', 'men'], 阁: ['Các', 'ge'],
  阳: ['Dương', 'yang'], 阴: ['Âm', 'yin'], 陀: ['Đà', 'tuo'], 陷: ['Hãm', 'xian'], 隐: ['Ẩn', 'yin'], 青: ['Thanh', 'qing'],
  鞍: ['An', 'an'], 飞: ['Phi', 'fei'], 马: ['Mã', 'ma'], 驿: ['Dịch', 'yi'], 魁: ['Khôi', 'kui'], 鸾: ['Loan', 'luan'],
  龙: ['Long', 'long'],
};

// Curated whole-word names: [Vietnamese, English]
const W: Record<string, [string, string]> = {
  // palaces
  命宫: ['Mệnh', 'Life'], 兄弟: ['Huynh Đệ', 'Siblings'], 夫妻: ['Phu Thê', 'Spouse'], 子女: ['Tử Tức', 'Children'],
  财帛: ['Tài Bạch', 'Wealth'], 疾厄: ['Tật Ách', 'Health'], 迁移: ['Thiên Di', 'Travel'], 仆役: ['Nô Bộc', 'Friends'],
  交友: ['Nô Bộc', 'Friends'], 官禄: ['Quan Lộc', 'Career'], 田宅: ['Điền Trạch', 'Property'], 福德: ['Phúc Đức', 'Fortune & Mind'],
  父母: ['Phụ Mẫu', 'Parents'], 身宫: ['Thân', 'Body palace'],
  // 14 main stars
  紫微: ['Tử Vi', 'Zi Wei (Emperor)'], 天机: ['Thiên Cơ', 'Tian Ji (Strategist)'], 太阳: ['Thái Dương', 'Tai Yang (Sun)'],
  武曲: ['Vũ Khúc', 'Wu Qu (Finance)'], 天同: ['Thiên Đồng', 'Tian Tong (Harmony)'], 廉贞: ['Liêm Trinh', 'Lian Zhen (Integrity)'],
  天府: ['Thiên Phủ', 'Tian Fu (Treasury)'], 太阴: ['Thái Âm', 'Tai Yin (Moon)'], 贪狼: ['Tham Lang', 'Tan Lang (Desire)'],
  巨门: ['Cự Môn', 'Ju Men (Gate)'], 天相: ['Thiên Tướng', 'Tian Xiang (Minister)'], 天梁: ['Thiên Lương', 'Tian Liang (Protector)'],
  七杀: ['Thất Sát', 'Qi Sha (General)'], 破军: ['Phá Quân', 'Po Jun (Pioneer)'],
  // lucky & malefic
  左辅: ['Tả Phù', 'Zuo Fu'], 右弼: ['Hữu Bật', 'You Bi'], 文昌: ['Văn Xương', 'Wen Chang'], 文曲: ['Văn Khúc', 'Wen Qu'],
  天魁: ['Thiên Khôi', 'Tian Kui'], 天钺: ['Thiên Việt', 'Tian Yue'], 禄存: ['Lộc Tồn', 'Lu Cun'], 天马: ['Thiên Mã', 'Tian Ma'],
  擎羊: ['Kình Dương', 'Qing Yang'], 陀罗: ['Đà La', 'Tuo Luo'], 火星: ['Hỏa Tinh', 'Huo Xing'], 铃星: ['Linh Tinh', 'Ling Xing'],
  地空: ['Địa Không', 'Di Kong'], 地劫: ['Địa Kiếp', 'Di Jie'], 旬空: ['Tuần Không', 'Xun Kong'], 截空: ['Triệt Không', 'Jie Kong'],
  长生: ['Trường Sinh', 'Chang Sheng'],
  杀破狼: ['Sát Phá Tham', 'Sha Po Lang'],
  // five-element bureau
  水二局: ['Thủy Nhị Cục', 'Water Bureau 2'], 木三局: ['Mộc Tam Cục', 'Wood Bureau 3'], 金四局: ['Kim Tứ Cục', 'Metal Bureau 4'],
  土五局: ['Thổ Ngũ Cục', 'Earth Bureau 5'], 火六局: ['Hỏa Lục Cục', 'Fire Bureau 6'],
  阳男: ['Dương Nam', 'Yang male'], 阴男: ['Âm Nam', 'Yin male'], 阳女: ['Dương Nữ', 'Yang female'], 阴女: ['Âm Nữ', 'Yin female'],
};

export const STEM_VI = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const STEM_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
export const BRANCH_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const BRANCH_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const STEMS_ZH = '甲乙丙丁戊己庚辛壬癸';
const BRANCHES_ZH = '子丑寅卯辰巳午未申酉戌亥';

export function stem(i: number, lang: Lang) { return (lang === 'vi' ? STEM_VI : STEM_EN)[i] ?? ''; }
export function branch(i: number, lang: Lang) { return (lang === 'vi' ? BRANCH_VI : BRANCH_EN)[i] ?? ''; }

/** Translate a stem-branch pair like 庚午. */
export function ganzhi(gz: string, lang: Lang): string {
  const s = STEMS_ZH.indexOf(gz[0]); const b = BRANCHES_ZH.indexOf(gz[1]);
  if (s < 0 || b < 0) return term(gz, lang);
  return `${stem(s, lang)} ${branch(b, lang)}`;
}

/** Translate a term; unknown terms fall back to per-character Hán-Việt / pinyin. */
export function term(zh: string, lang: Lang): string {
  if (!zh) return zh;
  const w = W[zh];
  if (w) return lang === 'vi' ? w[0] : w[1];
  const parts: string[] = [];
  for (const ch of zh) {
    const c = C[ch];
    if (!c) return zh; // leave untouched if any char is unknown
    parts.push(lang === 'vi' ? c[0] : c[1][0].toUpperCase() + c[1].slice(1));
  }
  return parts.join(' ');
}

/** "Tử Vi (紫微)" style label. */
export function label(zh: string, lang: Lang): string {
  const t = term(zh, lang);
  return t === zh ? zh : `${t} (${zh})`;
}

const BRIGHT: Record<string, [string, string]> = {
  庙: ['Miếu', 'Temple'], 旺: ['Vượng', 'Prosperous'], 得: ['Đắc', 'Favorable'], 利: ['Lợi', 'Beneficial'],
  平: ['Bình', 'Neutral'], 不: ['Bất', 'Weak'], 闲: ['Nhàn', 'Idle'], 陷: ['Hãm', 'Fallen'], 地: ['Địa', 'Earth'],
};
export function brightness(b: string, lang: Lang) { const x = BRIGHT[b]; return x ? (lang === 'vi' ? x[0] : x[1]) : b; }

const SIHUA: Record<string, [string, string]> = {
  禄: ['Hóa Lộc', 'Hua Lu (prosperity)'], 权: ['Hóa Quyền', 'Hua Quan (power)'],
  科: ['Hóa Khoa', 'Hua Ke (fame)'], 忌: ['Hóa Kỵ', 'Hua Ji (obstacle)'],
};
export function sihua(s: string, lang: Lang) { const x = SIHUA[s]; return x ? (lang === 'vi' ? x[0] : x[1]) : s; }
export function sihuaShort(s: string, lang: Lang) {
  return lang === 'vi' ? ({ 禄: 'Lộc', 权: 'Quyền', 科: 'Khoa', 忌: 'Kỵ' } as Record<string, string>)[s] ?? s
    : ({ 禄: 'Lu', 权: 'Quan', 科: 'Ke', 忌: 'Ji' } as Record<string, string>)[s] ?? s;
}

export const LEVEL: Record<string, [string, string]> = {
  excellent: ['Thượng cách', 'Superior'], good: ['Cát cách', 'Auspicious'],
  neutral: ['Trung tính', 'Neutral'], caution: ['Cần lưu ý', 'Caution'],
};

/** Vietnamese & world cities: name, aliases, longitude, standard UTC offset (min). */
export const WORLD_CITIES: { name: string; aliases: string[]; lon: number; utc: number }[] = [
  { name: 'Hà Nội', aliases: ['hanoi', 'ha noi'], lon: 105.85, utc: 420 },
  { name: 'TP. Hồ Chí Minh', aliases: ['ho chi minh', 'hcm', 'saigon', 'sai gon', 'tphcm'], lon: 106.70, utc: 420 },
  { name: 'Hải Phòng', aliases: ['hai phong'], lon: 106.68, utc: 420 },
  { name: 'Đà Nẵng', aliases: ['da nang'], lon: 108.22, utc: 420 },
  { name: 'Huế', aliases: ['hue'], lon: 107.59, utc: 420 },
  { name: 'Cần Thơ', aliases: ['can tho'], lon: 105.78, utc: 420 },
  { name: 'Nha Trang', aliases: ['nha trang'], lon: 109.19, utc: 420 },
  { name: 'Đà Lạt', aliases: ['da lat', 'dalat'], lon: 108.44, utc: 420 },
  { name: 'Vinh', aliases: ['vinh'], lon: 105.68, utc: 420 },
  { name: 'Quy Nhơn', aliases: ['quy nhon'], lon: 109.22, utc: 420 },
  { name: 'Biên Hòa', aliases: ['bien hoa'], lon: 106.82, utc: 420 },
  { name: 'Vũng Tàu', aliases: ['vung tau'], lon: 107.08, utc: 420 },
  { name: 'Nam Định', aliases: ['nam dinh'], lon: 106.17, utc: 420 },
  { name: 'Thanh Hóa', aliases: ['thanh hoa'], lon: 105.78, utc: 420 },
  { name: 'Buôn Ma Thuột', aliases: ['buon ma thuot'], lon: 108.04, utc: 420 },
  { name: 'Bangkok', aliases: ['bangkok'], lon: 100.50, utc: 420 },
  { name: 'Singapore', aliases: ['singapore'], lon: 103.82, utc: 480 },
  { name: 'Kuala Lumpur', aliases: ['kuala lumpur'], lon: 101.69, utc: 480 },
  { name: 'Hong Kong', aliases: ['hong kong', 'hongkong'], lon: 114.17, utc: 480 },
  { name: 'Taipei', aliases: ['taipei'], lon: 121.56, utc: 480 },
  { name: 'Tokyo', aliases: ['tokyo'], lon: 139.69, utc: 540 },
  { name: 'Seoul', aliases: ['seoul'], lon: 126.98, utc: 540 },
  { name: 'Sydney', aliases: ['sydney'], lon: 151.21, utc: 600 },
  { name: 'Melbourne', aliases: ['melbourne'], lon: 144.96, utc: 600 },
  { name: 'London', aliases: ['london'], lon: -0.13, utc: 0 },
  { name: 'Paris', aliases: ['paris'], lon: 2.35, utc: 60 },
  { name: 'Berlin', aliases: ['berlin'], lon: 13.40, utc: 60 },
  { name: 'Moscow', aliases: ['moscow'], lon: 37.62, utc: 180 },
  { name: 'New York', aliases: ['new york', 'nyc'], lon: -74.01, utc: -300 },
  { name: 'Los Angeles', aliases: ['los angeles', 'la'], lon: -118.24, utc: -480 },
  { name: 'San Francisco', aliases: ['san francisco', 'sf'], lon: -122.42, utc: -480 },
  { name: 'Houston', aliases: ['houston'], lon: -95.37, utc: -360 },
  { name: 'Toronto', aliases: ['toronto'], lon: -79.38, utc: -300 },
  { name: 'Vancouver', aliases: ['vancouver'], lon: -123.12, utc: -480 },
];

export function fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[.\s]+/g, ' ').trim();
}
export function findWorldCity(q: string) {
  const f = fold(q);
  return WORLD_CITIES.find(c => fold(c.name) === f || c.aliases.includes(f))
    ?? WORLD_CITIES.find(c => fold(c.name).includes(f) || c.aliases.some(a => a.includes(f)));
}
