/**
 * Vietnamese for the Chinese text the pattern engine (src/ziwei/patterns.ts) and constants print.
 * Exact strings first, then rules for strings built from templates. Unknown text is returned unchanged.
 */
import { term } from './i18n';

const st = (zh: string) => term(zh, 'vi');
const BR: Record<string, string> = { 子: 'Tý', 丑: 'Sửu', 寅: 'Dần', 卯: 'Mão', 辰: 'Thìn', 巳: 'Tỵ', 午: 'Ngọ', 未: 'Mùi', 申: 'Thân', 酉: 'Dậu', 戌: 'Tuất', 亥: 'Hợi' };
const list = (s: string) => s.split('、').map(st).join(', ');

const EXACT: Record<string, string> = {
  // ── descriptions ──
  '七杀、破军、贪狼三星会命，开创闯荡之命格。一生变动多、不甘平凡，宜创业、军警、业务、销售。中年后才能稳定守成，年轻时易因冲动失利。':
    'Ba sao Thất Sát, Phá Quân, Tham Lang hội Mệnh, là số khai phá xông pha. Cả đời nhiều biến động, không cam chịu tầm thường, hợp khởi nghiệp, quân đội, cảnh sát, kinh doanh, bán hàng. Sau trung niên mới ổn định giữ được thành quả; lúc trẻ dễ vì bốc đồng mà thất bại.',
  '化忌坐命，左右擎羊陀罗夹命，古书云"羊陀夹忌为败局"，主一生劳碌奔波、坎坷不顺、身心俱疲。需以德行修养与积极做事化解，凡事谨慎为上。':
    'Hóa Kỵ tọa Mệnh, hai bên có Kình Dương, Đà La kẹp; sách xưa nói "Dương Đà giáp Kỵ là bại cục", chủ cả đời vất vả bôn ba, gập ghềnh không thuận, thân tâm mỏi mệt. Cần lấy tu dưỡng đạo đức và tích cực làm việc để hóa giải, mọi việc cẩn trọng là trên hết.',
  '化禄、化权、化科三吉化齐会命宫三方四正，号称"三奇加会"。主一生功名、财富、贵人三全，是紫微斗数最高吉格之一。':
    'Ba cát hóa Lộc, Quyền, Khoa cùng hội tam phương tứ chính của Mệnh, gọi là "Tam Kỳ gia hội". Chủ cả đời đủ cả công danh, tiền của, quý nhân; là một trong những cát cách cao nhất của Tử Vi Đẩu Số.',
  '化禄、禄存同会命宫三方四正，财源涌动、衣食丰足。古书云"双禄朝垣，富比陶朱"，主一生不愁财，多有正财横财兼得。':
    'Hóa Lộc, Lộc Tồn cùng hội tam phương tứ chính của Mệnh, tiền vào dồi dào, cơm áo đầy đủ. Sách xưa nói "Song Lộc triều viên, giàu như Đào Chu", chủ cả đời không lo tiền, thường có cả chính tài lẫn hoạnh tài.',
  '化科 + 化权 同会三方四正，主名权双美——既有学识/名声（科），又有掌控力（权），宜走"专业权威"路线（如医生、律师、教授、技术骨干），名利双收且根基扎实。':
    'Hóa Khoa và Hóa Quyền cùng hội tam phương tứ chính, chủ cả danh lẫn quyền đều đẹp — vừa có học thức, tiếng tăm (Khoa) vừa có khả năng nắm quyền (Quyền); hợp đi đường "chuyên gia có uy tín" (bác sĩ, luật sư, giáo sư, nhân sự kỹ thuật nòng cốt), danh lợi đều có mà nền móng vững.',
  '命未空宫，对宫丑宫日月同辉拱照，号"明珠出海"。主出生平凡、后天努力出头，宜远赴他乡、学术研究或大公司高位，主大富大贵。':
    'Mệnh ở Mùi vô chính diệu, cung đối ở Sửu có Nhật Nguyệt cùng sáng chiếu về, gọi là "Minh Châu Xuất Hải". Chủ xuất thân bình thường, nhờ nỗ lực về sau mà nổi lên; hợp đi xa quê, nghiên cứu học thuật hoặc vị trí cao ở công ty lớn; chủ đại phú quý.',
  '地空地劫夹命，主财来财去、思想脱俗、易遁入宗教哲学。古书云"空劫夹命，财不聚"。宜技艺、宗教、研究等不重物质之业。':
    'Địa Không, Địa Kiếp giáp Mệnh, chủ tiền đến rồi đi, tư tưởng thoát tục, dễ tìm đến tôn giáo, triết học. Sách xưa nói "Không Kiếp giáp Mệnh, tiền không tụ". Hợp nghề kỹ nghệ, tôn giáo, nghiên cứu — những việc không nặng vật chất.',
  '天同天梁同宫，福星与荫星共会，主宽厚和善、乐于助人，宜医疗、教育、宗教、社会公益。但偏温和保守，难成大富大贵之局。':
    'Thiên Đồng, Thiên Lương đồng cung, phúc tinh và ấm tinh cùng hội; chủ rộng lượng hiền hòa, thích giúp người, hợp y tế, giáo dục, tôn giáo, công ích xã hội. Nhưng thiên về ôn hòa bảo thủ, khó thành cục đại phú đại quý.',
  '天府天相分守命宫三方四正，文武并济、权印双辉，主一生衣食丰足、地位崇高。古书云"府相朝垣千钟食禄"，常见于政界、企业管理者。':
    'Thiên Phủ, Thiên Tướng chia nhau giữ tam phương tứ chính của Mệnh, văn võ kiêm toàn, quyền ấn cùng sáng; chủ cả đời cơm áo đầy đủ, địa vị cao. Sách xưa nói "Phủ Tướng triều viên, thiên chung thực lộc", thường thấy ở người trong chính giới, quản lý doanh nghiệp.',
  '天机太阴天同天梁四星齐入命迁财官，文质彬彬、聪慧善谋。最适合公职、学术、文艺、医疗、服务等需稳定累积的行业，不宜大冒险大投机。':
    'Bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Mệnh, Thiên Di, Tài Bạch, Quan Lộc; người nho nhã, thông minh giỏi mưu tính. Hợp nhất công chức, học thuật, văn nghệ, y tế, dịch vụ — những ngành cần tích lũy ổn định; không nên mạo hiểm, đầu cơ lớn.',
  '天马在迁移宫，主外出有利、远行得财，宜异乡发展。配化禄主异地生财，配煞星则旅途多波折。':
    'Thiên Mã ở cung Thiên Di, chủ ra ngoài có lợi, đi xa được tiền, hợp phát triển ở nơi khác. Đi với Hóa Lộc thì kiếm tiền ở xứ người; đi với sát tinh thì đường xa nhiều trắc trở.',
  '天马坐命，主一生奔波、动中得财，宜走商旅、外勤、跨界发展。倪师说「天马入命，无禄不发」——若再会禄存或化禄即「禄马交驰」之富格。':
    'Thiên Mã tọa Mệnh, chủ cả đời bôn ba, trong động mà được tiền; hợp buôn bán đi xa, công việc bên ngoài, phát triển đa lĩnh vực. Thầy Nghê nói (chưa kiểm chứng) "Thiên Mã nhập Mệnh, không Lộc không phát" — nếu hội thêm Lộc Tồn hoặc Hóa Lộc thì là phú cách "Lộc Mã giao trì".',
  '天魁天钺同会命宫三方四正，主"天乙贵人"加持，关键时刻总有贵人提携。倪师说「魁钺夹命，必为贵人」——遇到困难时身边会出现得力相助者，宜主动维护人脉。':
    'Thiên Khôi, Thiên Việt cùng hội tam phương tứ chính của Mệnh, chủ được "Thiên Ất quý nhân" phù trợ, lúc then chốt luôn có quý nhân nâng đỡ. Thầy Nghê nói (chưa kiểm chứng) "Khôi Việt giáp Mệnh, tất là quý nhân" — lúc gặp khó bên cạnh sẽ có người giúp đắc lực; nên chủ động giữ gìn quan hệ.',
  '天魁天钺夹命，男称天乙、女称玉堂，一生贵人提携。考试、求职、关键时刻常有意外贵人相助。':
    'Thiên Khôi, Thiên Việt giáp Mệnh, nam gọi là Thiên Ất, nữ gọi là Ngọc Đường; cả đời có quý nhân nâng đỡ. Thi cử, xin việc, lúc then chốt thường có quý nhân bất ngờ giúp.',
  '太阳、天梁、文昌、禄存四星齐会命宫三方，号称"科举之星"，主清贵显达、考运极佳，宜走学术、文教、研究、专业认证之路，一生功名易就。':
    'Bốn sao Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn cùng hội tam phương của Mệnh, được gọi là "sao khoa cử"; chủ thanh quý hiển đạt, vận thi cử cực tốt, hợp con đường học thuật, văn giáo, nghiên cứu, chứng chỉ chuyên môn; công danh dễ thành.',
  '太阳太阴分居命宫两侧夹照，光明磊落，一生贵人相助，事业蓬勃。男主官贵，女主旺夫兴家。日月须不落陷方为真夹。':
    'Thái Dương, Thái Âm chia hai bên kẹp chiếu cung Mệnh; người quang minh lỗi lạc, cả đời có quý nhân giúp, sự nghiệp phát triển. Nam chủ quan quý, nữ chủ vượng phu, hưng gia. Nhật Nguyệt phải không hãm mới là giáp thật.',
  '左辅右弼同会命宫三方四正，主一生贵人不绝、人缘极佳。最宜领导岗位与团队合作型工作。倪师说「辅弼夹命，平生贵人多」——你不是单打独斗的命，要善用人际网络。':
    'Tả Phù, Hữu Bật cùng hội tam phương tứ chính của Mệnh, chủ cả đời không thiếu quý nhân, nhân duyên cực tốt. Hợp nhất vị trí lãnh đạo và công việc làm theo nhóm. Thầy Nghê nói (chưa kiểm chứng) "Phù Bật giáp Mệnh, cả đời nhiều quý nhân" — đây không phải số đơn thương độc mã, hãy tận dụng mạng lưới quan hệ.',
  '左辅右弼夹命，传统论述认为此格象征贵人相助与福厚特质。适合走仕途、大企业管理等能发挥组织才能的方向。古书云"左辅右弼，终身福厚"——强调此格在组织协调中的优势。':
    'Tả Phù, Hữu Bật giáp Mệnh; theo truyền thống, cách này tượng trưng cho quý nhân giúp đỡ và phúc dày. Hợp đường quan lộ, quản lý doanh nghiệp lớn, những hướng phát huy được tài tổ chức. Sách xưa nói "Tả Phù Hữu Bật, chung thân phúc hậu" — nhấn mạnh ưu thế của cách này trong tổ chức, điều phối.',
  '巨门、火星、擎羊三星会照，传统古籍记载此格为需要警惕之组合（古文"终身缢死"为宿命论表述，今已不适用）。现代理解为：此组合象征直言易触发冲突、情绪激烈时需要自我觉察。修养方向是：练习温和表达、主动化解对立、培养情绪管理。':
    'Ba sao Cự Môn, Hỏa Tinh, Kình Dương hội chiếu; sách cổ ghi đây là tổ hợp cần cảnh giác (câu cổ "chung thân ải tử" là lối nói định mệnh, nay không còn áp dụng). Hiểu theo nghĩa hiện đại: nói thẳng dễ gây xung đột, khi cảm xúc mạnh cần tự nhận biết. Hướng tu dưỡng: tập nói năng ôn hòa, chủ động hóa giải đối đầu, rèn quản lý cảm xúc.',
  '巨门坐命子午，外表平凡而内蕴才学。早年默默无闻、中年方显贵气，宜走专业、研究、口才、传媒。需有禄权或文昌相助方能"凿石见玉"。':
    'Cự Môn tọa Mệnh ở Tý, Ngọ; bề ngoài bình thường mà bên trong có tài học. Lúc trẻ âm thầm không ai biết, trung niên mới lộ quý khí; hợp đi đường chuyên môn, nghiên cứu, ăn nói, truyền thông. Cần có Lộc, Quyền hoặc Văn Xương trợ giúp mới "đục đá thấy ngọc".',
  '廉贞、七杀、擎羊三星会照命宫三方，传统论述中标记为需要特别关注的组合。此格在大限流年触发时提醒保持谨慎态度：驾驶安全、人际和平、医疗决策需理性——强调主动管理而非消极宿命。':
    'Ba sao Liêm Trinh, Thất Sát, Kình Dương hội chiếu tam phương của Mệnh; truyền thống đánh dấu đây là tổ hợp cần đặc biệt lưu ý. Khi đại hạn, lưu niên kích hoạt cách này thì nhắc giữ thận trọng: lái xe an toàn, hòa khí với người, quyết định y tế cần lý trí — nhấn mạnh chủ động quản lý chứ không phải số mệnh tiêu cực.',
  '廉贞天相同宫，印绶格局，主秉公处事、清廉之名，宜任公职、行政管理、法务、企划。怕见擎羊化忌，则反主官非。':
    'Liêm Trinh, Thiên Tướng đồng cung là cách ấn thụ; chủ làm việc công tâm, có tiếng thanh liêm, hợp công chức, quản lý hành chính, pháp chế, hoạch định. Sợ gặp Kình Dương, Hóa Kỵ, khi đó ngược lại chủ kiện tụng.',
  '擎羊于午宫坐命，号"马头带箭"，古书云"威镇边疆"。此格象征果决行动力与竞争精神，适合需要执行力与果敢决策的职业方向。传统论述同时提醒此格需要配合吉利星曜才能最优发挥——强调组合影响而非单星独论。':
    'Kình Dương tọa Mệnh ở Ngọ, gọi là "Mã Đầu Đới Tiễn"; sách xưa nói "uy trấn biên cương". Cách này tượng trưng cho sức hành động quả quyết và tinh thần cạnh tranh, hợp các nghề cần khả năng thực thi và quyết đoán. Truyền thống cũng nhắc cách này cần phối hợp cát tinh mới phát huy tốt nhất — xét tổ hợp chứ không luận một sao riêng lẻ.',
  '文昌文曲同会三方四正，主才华横溢、口才文笔俱佳。宜走需要表达与文采的行业，化科加持则名声大显。':
    'Văn Xương, Văn Khúc cùng hội tam phương tứ chính, chủ tài hoa tràn đầy, ăn nói và văn bút đều giỏi. Hợp ngành cần diễn đạt và văn chương; thêm Hóa Khoa thì danh tiếng nổi rõ.',
  '文昌文曲同入命宫，主聪明俊秀、文采斐然，宜文学、教育、写作、咨询。最忌化忌——昌曲化忌主文书契约暗亏。':
    'Văn Xương, Văn Khúc cùng vào cung Mệnh, chủ thông minh tuấn tú, văn chương xuất sắc, hợp văn học, giáo dục, viết lách, tư vấn. Kỵ nhất Hóa Kỵ — Xương Khúc Hóa Kỵ chủ thiệt ngầm về giấy tờ, hợp đồng.',
  '文昌文曲夹命宫，主聪明俊秀、文采斐然，宜走文教、学术、艺术、写作。古书云"昌曲夹命主科甲"，最利考运。':
    'Văn Xương, Văn Khúc giáp cung Mệnh, chủ thông minh tuấn tú, văn chương xuất sắc, hợp văn giáo, học thuật, nghệ thuật, viết lách. Sách xưa nói "Xương Khúc giáp Mệnh chủ khoa giáp", lợi nhất cho thi cử.',
  '武曲七杀同宫，将星配财星，主果决刚毅、理财能力强，适合金融、军警、创业。但忌见化忌煞星，否则凶险。一生奋斗、积财但操心。':
    'Vũ Khúc, Thất Sát đồng cung, tướng tinh phối tài tinh; chủ quả quyết cương nghị, giỏi quản lý tiền, hợp tài chính, quân đội, cảnh sát, khởi nghiệp. Kỵ gặp Hóa Kỵ và sát tinh, nếu không thì hung hiểm. Cả đời phấn đấu, tích được tiền nhưng hay lo nghĩ.',
  '武曲贪狼会命，财星与桃花欲望星交辉，古书云"武贪不发少年人"——三十岁后方能厚积薄发。主中年以后大富大贵，财源由人脉、应酬、欲望管理而来，适合金融、投机、销售、娱乐业。':
    'Vũ Khúc, Tham Lang hội Mệnh, tài tinh và sao đào hoa, dục vọng cùng sáng. Sách xưa nói "Vũ Tham không phát khi còn trẻ" — sau ba mươi tuổi mới tích lũy dày rồi bứt lên. Chủ sau trung niên đại phú quý; tiền đến từ quan hệ, giao tế và cách quản lý dục vọng; hợp tài chính, đầu cơ, bán hàng, giải trí.',
  '火星铃星分居命宫前后两宫夹命，主性急、易冲动、突发意外或纠纷。需培养耐性、避免冲动决策。':
    'Hỏa Tinh, Linh Tinh chia hai cung trước sau kẹp Mệnh, chủ tính nóng, dễ bốc đồng, có sự cố hoặc tranh chấp bất ngờ. Cần rèn tính kiên nhẫn, tránh quyết định vội vàng.',
  '禄存入身宫，主中年后财源稳定、得禄自享。倪师说「禄存入身，财气近身」——配偶或事业方向能带来稳定财禄。':
    'Lộc Tồn nhập cung Thân, chủ sau trung niên nguồn tiền ổn định, tự hưởng lộc. Thầy Nghê nói (chưa kiểm chứng) "Lộc Tồn nhập Thân, tài khí gần thân" — người phối ngẫu hoặc hướng sự nghiệp mang lại tài lộc ổn định.',
  '禄存坐命，主一生衣食无忧、财禄稳定。性格保守，善积累，但羊陀夹禄须防小人。最宜配化禄、左辅右弼方为大格。':
    'Lộc Tồn tọa Mệnh, chủ cả đời cơm áo không lo, tài lộc ổn định. Tính bảo thủ, giỏi tích lũy, nhưng Dương Đà giáp Lộc thì phải đề phòng tiểu nhân. Hợp nhất đi với Hóa Lộc, Tả Phù, Hữu Bật mới là đại cách.',
  '紫微入命，左辅右弼同会，帝王得贤臣辅佐，主大富大贵、统御之命。一生贵人不绝，宜走政商高位、跨界领袖之途。':
    'Tử Vi nhập Mệnh, Tả Hữu cùng hội, như bậc đế vương có hiền thần phò tá; chủ đại phú quý, số thống lĩnh. Cả đời không thiếu quý nhân, hợp con đường chính trường, thương trường ở vị trí cao, làm người dẫn dắt đa lĩnh vực.',
  '紫微天府同入命宫，帝相并临，尊贵之命。主品行端正、衣食无忧、有领导才能，宜担任要职。需要左右辅弼来配合方为完整大格。':
    'Tử Vi, Thiên Phủ cùng vào cung Mệnh, đế và tướng cùng đến, là số tôn quý. Chủ phẩm hạnh đoan chính, cơm áo không lo, có tài lãnh đạo, hợp giữ chức vụ quan trọng. Cần Tả Phù, Hữu Bật phối hợp mới là đại cách trọn vẹn.',
  '紫微天府同宫但未坐命，主一生有贵人贵气依托，但本身不一定大富贵，需看会照吉煞而定。':
    'Tử Vi, Thiên Phủ đồng cung nhưng không tọa Mệnh, chủ cả đời có quý nhân, quý khí để nương tựa, nhưng bản thân chưa chắc đại phú quý, phải xem cát sát hội chiếu.',
  '紫微独坐命宫，帝王之星，自尊心强、有领导魅力。但紫微最忌"在野孤君"——若无左右辅弼相会，反成孤高自傲、易招毁谤。':
    'Tử Vi độc tọa cung Mệnh, là sao đế vương, lòng tự trọng mạnh, có sức hút lãnh đạo. Nhưng Tử Vi kỵ nhất "cô quân tại dã" — nếu không có Tả Hữu phò tá thì ngược lại thành cao ngạo cô độc, dễ bị gièm pha.',
  '铃星、文昌、陀罗、武曲四星齐会，传统古籍记载此为需要特别关注之组合（古文"限至投河"为宿命论表述，非现代理解）。现代建议为：此组合在大限流年触发时，提醒理性处理重大决策、关注情绪波动、维持生活的稳定性——强调主动管理而非消极等待。':
    'Bốn sao Linh Tinh, Văn Xương, Đà La, Vũ Khúc cùng hội; sách cổ ghi đây là tổ hợp cần đặc biệt lưu ý (câu cổ "hạn chí đầu hà" là lối nói định mệnh, không phải cách hiểu hiện đại). Lời khuyên hiện đại: khi đại hạn, lưu niên kích hoạt tổ hợp này, cần xử lý lý trí các quyết định lớn, để ý dao động cảm xúc, giữ đời sống ổn định — chủ động quản lý chứ không thụ động chờ đợi.',
  // ── conditions ──
  '七杀、破军、贪狼三星齐入命宫三方四正': 'Thất Sát, Phá Quân, Tham Lang cùng vào tam phương tứ chính của Mệnh',
  '三方会照': 'hội chiếu ở tam phương', '三方四正煞星过多': 'tam phương tứ chính quá nhiều sát tinh',
  '三方有化禄或化权（动得有力）': 'tam phương có Hóa Lộc hoặc Hóa Quyền (động mà có lực)', '三方煞重': 'tam phương sát tinh nặng',
  '两星不同宫': 'hai sao không đồng cung', '会照': 'hội chiếu', '会照命宫三方': 'hội chiếu tam phương của Mệnh',
  '再会七杀或破军（武职大贵）': 'hội thêm Thất Sát hoặc Phá Quân (đại quý về võ chức)', '再会化科': 'hội thêm Hóa Khoa',
  '再会左辅': 'hội thêm Tả Phù', '再会文昌或文曲': 'hội thêm Văn Xương hoặc Văn Khúc', '再会昌曲': 'hội thêm Xương Khúc',
  '再会魁钺': 'hội thêm Khôi Việt', '再遇火星/铃星（火贪/铃贪叠加）': 'gặp thêm Hỏa Tinh/Linh Tinh (chồng thêm Hỏa Tham/Linh Tham)',
  '化忌坐命': 'Hóa Kỵ tọa Mệnh', '化禄、化权、化科三吉化齐会命宫三方四正': 'Hóa Lộc, Hóa Quyền, Hóa Khoa cùng hội tam phương tứ chính của Mệnh',
  '化禄会照三方四正': 'Hóa Lộc hội chiếu tam phương tứ chính', '化科、化权同会命宫三方四正': 'Hóa Khoa, Hóa Quyền cùng hội tam phương tứ chính của Mệnh',
  '化科入命': 'Hóa Khoa nhập Mệnh', '化科入身': 'Hóa Khoa nhập Thân', '同宫': 'đồng cung',
  '命坐煞星': 'Mệnh có sát tinh', '命坐空劫（动得辛苦）': 'Mệnh tọa Không Kiếp (động mà vất vả)',
  '命坐空劫（双禄遇空，财来财去）': 'Mệnh tọa Không Kiếp (Song Lộc gặp Không, tiền đến rồi đi)',
  '命宫在未为空宫': 'cung Mệnh ở Mùi vô chính diệu', '命宫坐煞': 'cung Mệnh có sát tinh', '命宫坐煞星': 'cung Mệnh có sát tinh', '命宫见禄': 'cung Mệnh có Lộc',
  '地空地劫分居命宫前后两宫': 'Địa Không, Địa Kiếp chia ở hai cung trước sau cung Mệnh',
  '地空地劫双夹会照（紫微忌空劫）': 'Địa Không, Địa Kiếp cùng giáp hoặc hội chiếu (Tử Vi kỵ Không Kiếp)',
  '天同化禄': 'Thiên Đồng Hóa Lộc', '天同天梁同宫': 'Thiên Đồng, Thiên Lương đồng cung', '天府坐命三方': 'Thiên Phủ ở tam phương của Mệnh',
  '天机、太阴、天同、天梁四星齐入命宫三方四正': 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào tam phương tứ chính của Mệnh',
  '天梁会命宫三方': 'Thiên Lương hội tam phương của Mệnh', '天梁庙旺': 'Thiên Lương miếu vượng', '天相坐命三方': 'Thiên Tướng ở tam phương của Mệnh',
  '天马入命': 'Thiên Mã nhập Mệnh', '天马入命宫': 'Thiên Mã nhập cung Mệnh', '天马入迁移宫': 'Thiên Mã nhập cung Thiên Di', '天马在迁': 'Thiên Mã ở Thiên Di',
  '天魁、天钺同会命宫三方四正': 'Thiên Khôi, Thiên Việt cùng hội tam phương tứ chính của Mệnh', '天魁天钺分居命宫前后两宫': 'Thiên Khôi, Thiên Việt chia ở hai cung trước sau cung Mệnh',
  '太阳会命宫三方': 'Thái Dương hội tam phương của Mệnh', '太阳太阴分居命宫前后两宫': 'Thái Dương, Thái Âm chia ở hai cung trước sau cung Mệnh',
  '太阳庙旺': 'Thái Dương miếu vượng', '太阳落陷（阳梁失辉）': 'Thái Dương hãm (Dương Lương mất ánh sáng)', '太阴庙旺': 'Thái Âm miếu vượng',
  '寅宫太阳庙旺，巨门得日光化解是非': 'ở Dần, Thái Dương miếu vượng, Cự Môn được ánh mặt trời hóa giải thị phi',
  '对宫丑宫为太阳太阴同度': 'cung đối ở Sửu có Thái Dương, Thái Âm đồng độ',
  '左辅、右弼同会命宫三方四正': 'Tả Phù, Hữu Bật cùng hội tam phương tứ chính của Mệnh', '左辅会照': 'Tả Phù hội chiếu',
  '左辅右弼分居命宫前后两宫': 'Tả Phù, Hữu Bật chia ở hai cung trước sau cung Mệnh', '左辅右弼同会': 'Tả Phù, Hữu Bật cùng hội',
  '左辅右弼同会三方四正': 'Tả Phù, Hữu Bật cùng hội tam phương tứ chính',
  '巨门、火星、擎羊三星会照三方四正': 'Cự Môn, Hỏa Tinh, Kình Dương hội chiếu tam phương tứ chính',
  '巨门化忌（口舌官非）': 'Cự Môn Hóa Kỵ (khẩu thiệt, kiện tụng)', '巨门化忌（玉藏深泥）': 'Cự Môn Hóa Kỵ (ngọc vùi trong bùn sâu)',
  '巨门化禄/化权': 'Cự Môn Hóa Lộc/Hóa Quyền', '巨门化禄/化权（口才生财）': 'Cự Môn Hóa Lộc/Hóa Quyền (kiếm tiền bằng ăn nói)',
  '廉相宫坐擎羊（廉杀羊倾向）': 'cung Liêm Tướng có Kình Dương (khuynh hướng Liêm Sát Dương)',
  '廉贞、七杀、擎羊三星会照三方四正': 'Liêm Trinh, Thất Sát, Kình Dương hội chiếu tam phương tứ chính',
  '廉贞化忌': 'Liêm Trinh Hóa Kỵ', '廉贞天相同宫': 'Liêm Trinh, Thiên Tướng đồng cung', '擎羊于午宫坐命': 'Kình Dương tọa Mệnh ở Ngọ',
  '擎羊陀罗分居命宫前后两宫': 'Kình Dương, Đà La chia ở hai cung trước sau cung Mệnh',
  '文昌、文曲同会命宫三方四正': 'Văn Xương, Văn Khúc cùng hội tam phương tứ chính của Mệnh', '文昌会命宫三方': 'Văn Xương hội tam phương của Mệnh',
  '文昌会照': 'Văn Xương hội chiếu', '文昌会照（石中隐玉得明）': 'Văn Xương hội chiếu (ngọc trong đá được sáng)',
  '文昌文曲分居命宫前后两宫': 'Văn Xương, Văn Khúc chia ở hai cung trước sau cung Mệnh', '文昌文曲同会': 'Văn Xương, Văn Khúc cùng hội',
  '无辅弼（孤君无臣）': 'không có Phù Bật (vua cô độc không bề tôi)', '日月宫煞星同坐': 'cung Nhật Nguyệt có sát tinh đồng tọa',
  '日月落陷（夹命无光）': 'Nhật Nguyệt hãm (giáp Mệnh mà không có ánh sáng)', '昌曲会照': 'Xương Khúc hội chiếu', '昌曲同会': 'Xương Khúc cùng hội', '昌曲坐命': 'Xương Khúc tọa Mệnh',
  '未宫日月双美尤佳。': 'Ở Mùi, Nhật Nguyệt cùng đẹp, càng tốt.', '丑宫日月同宫力量较平。': 'Ở Sửu, Nhật Nguyệt đồng cung lực khá bình.',
  '未宫日月同辉（古书云未宫日月双美）': 'Nhật Nguyệt cùng sáng ở Mùi (sách xưa nói ở Mùi Nhật Nguyệt song mỹ)',
  '本盘破格条件已触发，发力打折。': 'Lá số này đã chạm điều kiện phá cách, sức phát huy bị giảm.',
  '武曲七杀同宫': 'Vũ Khúc, Thất Sát đồng cung', '武曲化忌（武曲化忌为财劫之兆）': 'Vũ Khúc Hóa Kỵ (dấu hiệu bị cướp tiền, mất tiền)',
  '武曲化权': 'Vũ Khúc Hóa Quyền', '武曲化禄': 'Vũ Khúc Hóa Lộc', '武曲化禄属正财，宜实业、金融。': 'Vũ Khúc Hóa Lộc là chính tài, hợp sản xuất, tài chính.',
  '武曲贪狼同宫（丑/未）': 'Vũ Khúc, Tham Lang đồng cung (Sửu/Mùi)', '武曲贪狼对宫拱照': 'Vũ Khúc, Tham Lang đối cung chiếu nhau',
  '武杀宫煞星过多': 'cung Vũ Sát quá nhiều sát tinh', '武贪宫见羊陀': 'cung Vũ Tham có Kình Đà', '武贪宫遇空劫': 'cung Vũ Tham gặp Không Kiếp',
  '火星铃星分居命宫前后两宫': 'Hỏa Tinh, Linh Tinh chia ở hai cung trước sau cung Mệnh', '火贪格': 'cách Hỏa Tham', '铃贪格': 'cách Linh Tham',
  '煞星会照（珠光黯淡）': 'sát tinh hội chiếu (ánh ngọc mờ đi)', '煞星同坐': 'sát tinh đồng tọa',
  '煞星过多（机月同梁忌煞）': 'quá nhiều sát tinh (Cơ Nguyệt Đồng Lương kỵ sát)', '煞星过重（动而无成）': 'sát tinh quá nặng (động mà không thành)',
  '申宫太阳偏西，巨门暗曜更显': 'ở Thân, Thái Dương đã ngả tây, cái "ám" của Cự Môn lộ rõ hơn',
  '禄存会命宫三方': 'Lộc Tồn hội tam phương của Mệnh', '禄存会照三方四正': 'Lộc Tồn hội chiếu tam phương tứ chính',
  '禄存入命宫': 'Lộc Tồn nhập cung Mệnh', '禄存入身宫': 'Lộc Tồn nhập cung Thân', '禄存守命': 'Lộc Tồn giữ Mệnh', '禄存守身': 'Lộc Tồn giữ Thân',
  '紫府宫坐空劫（破紫府之贵气）': 'cung Tử Phủ có Không Kiếp (phá quý khí của Tử Phủ)', '紫府宫见双煞同坐': 'cung Tử Phủ có hai sát tinh đồng tọa',
  '紫微化权': 'Tử Vi Hóa Quyền', '紫微天府同入命宫': 'Tử Vi, Thiên Phủ cùng vào cung Mệnh',
  '紫微天府同宫（不在命宫，会照减力）': 'Tử Vi, Thiên Phủ đồng cung (không ở cung Mệnh, hội chiếu giảm lực)',
  '紫微独坐命宫（无天府同坐）': 'Tử Vi độc tọa cung Mệnh (không có Thiên Phủ đồng tọa)', '紫微遇空劫（古书最忌）': 'Tử Vi gặp Không Kiếp (sách xưa kỵ nhất)',
  '见禄存或廉贞化禄': 'gặp Lộc Tồn hoặc Liêm Trinh Hóa Lộc', '贪狼会照命宫三方': 'Tham Lang hội chiếu tam phương của Mệnh',
  '贪狼化禄/化权': 'Tham Lang Hóa Lộc/Hóa Quyền', '贪狼化禄属人脉财、桃花财。': 'Tham Lang Hóa Lộc là tiền nhờ quan hệ, tiền đào hoa.',
  '贪狼宫又见羊陀（破横发之力）': 'cung Tham Lang lại có Kình Đà (phá sức phát bất ngờ)', '贪狼庙旺': 'Tham Lang miếu vượng',
  '贪狼遇空劫（财来财去）': 'Tham Lang gặp Không Kiếp (tiền đến rồi đi)', '辅弼同会（变动中得贵人）': 'Phù Bật cùng hội (trong biến động có quý nhân)',
  '辅弼相助': 'Phù Bật trợ giúp', '铃星、文昌、陀罗、武曲四星会照三方四正': 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc hội chiếu tam phương tứ chính',
  '魁钺加照': 'Khôi Việt chiếu thêm', '魁钺贵人加照': 'Khôi Việt quý nhân chiếu thêm', '太阴化禄属阴财、不动产。': 'Thái Âm Hóa Lộc là âm tài, bất động sản.',
};

type Rule = [RegExp, (...m: string[]) => string];
const RULES: Rule[] = [
  [/^(.+?)化禄入命$/, (_, s) => `${st(s)} Hóa Lộc nhập Mệnh`],
  [/^(.+?)化禄坐命宫$/, (_, s) => `${st(s)} Hóa Lộc tọa cung Mệnh`],
  [/^(.+?)化禄坐命，主生财顺利、人缘佳、机缘多。(.*)$/, (_, s, rest) => `${st(s)} Hóa Lộc tọa Mệnh, chủ kiếm tiền thuận lợi, nhân duyên tốt, nhiều cơ hội.${rest ? ' ' + tr(rest) : ''}`],
  [/^(.+?)化忌入(命|迁)$/, (_, s, w) => `${st(s)} Hóa Kỵ nhập ${w === '命' ? 'Mệnh' : 'Thiên Di'}`],
  [/^(.+?)化忌坐(命|迁)宫$/, (_, s, w) => `${st(s)} Hóa Kỵ tọa cung ${w === '命' ? 'Mệnh' : 'Thiên Di'}`],
  [/^(.+?)化忌坐命宫，需留意/, (_, s) => `${st(s)} Hóa Kỵ tọa cung Mệnh: cần để ý sự cố chấp của bản thân, trở ngại tâm lý hoặc mầm bệnh, mọi việc lùi một bước mà nghĩ. Hóa Kỵ không hẳn là xấu, nó cho biết năng lượng của sao này cần được đặc biệt chú ý.`],
  [/^(.+?)化忌坐迁移宫，/, (_, s) => `${st(s)} Hóa Kỵ tọa cung Thiên Di: ra ngoài, đi xa, quan hệ với người dễ có trắc trở; nên giữ hơn là động.`],
  [/^(.+?)化科入(命|身)宫$/, (_, s, w) => `${st(s)} Hóa Khoa nhập cung ${w === '命' ? 'Mệnh' : 'Thân'}`],
  [/^(.+?)化科入(命|身)宫，主名声/, (_, s, w) => `${st(s)} Hóa Khoa nhập cung ${w === '命' ? 'Mệnh' : 'Thân'}, chủ vận danh tiếng, giấy tờ, học thuật. Thầy Nghê gọi Hóa Khoa là "sao quý nhân" (chưa kiểm chứng) — ${st(s)} Hóa Khoa mang lại phẩm chất được người coi trọng; hợp giấy tờ, giáo dục, nghiên cứu, tư vấn, sáng tạo văn hóa — hướng "nhờ danh mà được lợi".`],
  [/^(.+?)化禄入财帛宫$/, (_, s) => `${st(s)} Hóa Lộc nhập cung Tài Bạch`],
  [/^(.+?)化禄入财帛宫，主财源/, (_, s) => `${st(s)} Hóa Lộc nhập cung Tài Bạch, chủ nguồn tiền thông suốt, thu nhập ổn định. Thầy Nghê gọi Hóa Lộc là biểu tượng "chính tài" (chưa kiểm chứng) — năng lực mà sao Hóa Lộc này đại diện (đặc tính cốt lõi của ${st(s)}) là trục kiếm tiền của bạn. Đi với Lộc Tồn hoặc Thiên Mã thì nguồn tiền rộng hơn.`],
  [/^(.+?)化权入官禄宫$/, (_, s) => `${st(s)} Hóa Quyền nhập cung Quan Lộc`],
  [/^(.+?)化权入官禄宫，主事业/, (_, s) => `${st(s)} Hóa Quyền nhập cung Quan Lộc, chủ nắm quyền chủ động trong sự nghiệp, gánh được vị trí tự lo một mảng. Hóa Quyền đại diện quyền lực và sức thực thi — ${st(s)} Hóa Quyền cho thấy trong sự nghiệp bạn có thể là người ra quyết định hoặc người thực thi nòng cốt; hợp đi đường quản lý hoặc chuyên gia kỹ thuật có uy tín.`],
  [/^三方四正会(.+?)（机月同梁缺(.+)）$/, (_, h, m) => `tam phương tứ chính hội ${list(h)} (Cơ Nguyệt Đồng Lương thiếu ${list(m)})`],
  [/^机月同梁需天机、太阴、天同、天梁四星齐会三方四正方为完整真格；本盘只会齐其中 3 颗（(.+?)），缺(.+?)未会/, (_, h, m) => `Cơ Nguyệt Đồng Lương cần đủ bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội tam phương tứ chính mới là chân cách trọn vẹn; lá số này chỉ hội đủ 3 sao (${list(h)}), thiếu ${list(m)}, nên không phải chân cách, lực giảm một bậc. Văn nhã có mưu, hợp công chức, giảng dạy nghiên cứu, y tế, dịch vụ — những ngành dựa vào tích lũy và ổn định; mấu chốt là xem sao còn thiếu và sự phối hợp của Tứ Hóa.`],
  [/^太阳太阴于(.)宫同宫，阴阳平衡，文武兼备。主异性缘佳、事业顺遂、名声远播。(.*)$/, (_, b, rest) => `Thái Dương, Thái Âm đồng cung ở ${BR[b] ?? b}, âm dương cân bằng, văn võ kiêm toàn. Chủ duyên với người khác giới tốt, sự nghiệp thuận lợi, danh tiếng vang xa.${rest ? ' ' + tr(rest) : ''}`],
  [/^太阳太阴同入(.)宫$/, (_, b) => `Thái Dương, Thái Âm cùng vào cung ${BR[b] ?? b}`],
  [/^巨门入命于(.)宫$/, (_, b) => `Cự Môn nhập Mệnh ở cung ${BR[b] ?? b}`],
  [/^巨门太阳同(.)宫，/, (_, b) => `Cự Môn, Thái Dương đồng cung ở ${BR[b] ?? b}; Thái Dương hóa giải cái "ám" của Cự Môn, chủ lập nghiệp bằng ăn nói, truyền thông, ngoại ngữ, chuyên môn. Ở Dần là tốt, ở Thân lực giảm. Sợ Cự Môn Hóa Kỵ thì kiện tụng.`],
  [/^巨门太阳同入(.)宫$/, (_, b) => `Cự Môn, Thái Dương cùng vào cung ${BR[b] ?? b}`],
  [/^贪狼(同宫|会照)(.+)$/, (_, w, s) => `Tham Lang ${w === '同宫' ? 'đồng cung' : 'hội chiếu'} ${list(s)}`],
  [/^贪狼遇(.+?)(同宫|三方会照)，主突发横财、突如其来的机遇。古书云“贪狼遇火铃，必发横财”，但来得快去得也快，宜见好就收。(.*)$/, (_, s, w, rest) => `Tham Lang gặp ${list(s)} ${w === '同宫' ? 'đồng cung' : 'hội chiếu ở tam phương'}, chủ hoạnh tài bất ngờ, cơ hội đến đột ngột. Sách xưa nói "Tham Lang gặp Hỏa Linh ắt phát hoạnh tài", nhưng đến nhanh đi cũng nhanh, nên thấy tốt thì dừng.${rest ? ' ' + tr(rest) : ''}`],
];

/** Translate one Chinese string from the pattern engine into Vietnamese. */
export function tr(zh: string): string {
  if (!zh) return zh;
  const exact = EXACT[zh];
  if (exact) return exact;
  for (const [re, fn] of RULES) {
    const m = re.exec(zh);
    if (m) return fn(...(m as unknown as string[]));
  }
  return zh;
}

/** Vietnamese keywords for the 14 main stars (constants.ts STAR_DESCRIPTIONS). */
export const STAR_VI: Record<string, { keywords: string; nature: string; element: string }> = {
  紫微: { keywords: 'đế vương · tôn quý · độc lập', nature: 'trung tính thiên cát', element: 'Thổ' },
  天机: { keywords: 'trí tuệ · cơ biến · mưu lược', nature: 'cát tinh', element: 'Mộc' },
  太阳: { keywords: 'dương cương · quan quý · hào phóng', nature: 'cát tinh', element: 'Hỏa' },
  武曲: { keywords: 'tiền của · cương nghị · quả quyết', nature: 'trung tính', element: 'Kim' },
  天同: { keywords: 'ôn hòa · hưởng phúc · tùy duyên', nature: 'cát tinh', element: 'Thủy' },
  廉贞: { keywords: 'tài nghệ · hình tù · đào hoa', nature: 'trong hung có cát', element: 'Hỏa' },
  天府: { keywords: 'kho tiền · điềm đạm · bảo thủ', nature: 'cát tinh', element: 'Thổ' },
  太阴: { keywords: 'nhu mỹ · tiền của · âm nhu', nature: 'cát tinh', element: 'Thủy' },
  贪狼: { keywords: 'dục vọng · đào hoa · đa tài', nature: 'trung tính', element: 'Mộc' },
  巨门: { keywords: 'khẩu thiệt · thị phi · giỏi biện luận', nature: 'trong hung có cát', element: 'Thủy' },
  天相: { keywords: 'phò tá · hành chính · ấn thụ', nature: 'cát tinh', element: 'Thủy' },
  天梁: { keywords: 'che chở · y dược · bậc trên', nature: 'cát tinh', element: 'Thổ' },
  七杀: { keywords: 'tướng tinh · quả quyết · cô khắc', nature: 'hung tinh', element: 'Kim' },
  破军: { keywords: 'khai sáng · biến động · phá cũ', nature: 'hung tinh', element: 'Thủy' },
};
