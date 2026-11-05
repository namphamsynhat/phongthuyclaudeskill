---
name: ziwei-doushu
description: Tử Vi Đẩu Số (Zi Wei Dou Shu, Purple Star Astrology, 紫微斗数) và Kinh Dịch (I Ching, 易经) theo truyền thống thầy Nghê Hải Hạ (倪海厦《天纪》); trả lời bằng tiếng Việt (ngôn ngữ chính) hoặc tiếng Anh. Dùng khi người dùng hỏi lá số tử vi, lấy lá số, 排盘, xem theo ngày giờ sinh, đại hạn, lưu niên, xem tuổi hợp (合盘); hoặc hỏi Kinh Dịch: quẻ, gieo quẻ, bói quẻ đồng tiền, Tiểu Lục Nhâm, chiết tự, Lục Thần; hoặc hỏi phong thủy, dương trạch: phòng ngủ, bếp, phòng khách, nhà vệ sinh nên đặt ở phương nào, ai trong nhà nên ở phòng nào; hoặc hỏi âm trạch (phong thủy mộ phần): chọn đất táng, long huyệt sa thủy, điểm huyệt, cải táng. Lá số được tính bằng engine cố định; diễn giải dựa trên bộ lời luận soạn sẵn, cổ thư, quy tắc cách cục và lời giảng có mốc thời gian của thầy Nghê.
---

# Tử Vi Đẩu Số và Kinh Dịch (tiếng Việt / English)

**Lá số do code tính, không phải bạn tính.** Bạn chỉ diễn giải. Đừng tự an sao hay tính Tứ Hóa trong đầu: luôn chạy script. Với Kinh Dịch cũng vậy: tra quẻ, ghép quẻ dương trạch, gieo quẻ, Tiểu Lục Nhâm đều dùng `scripts/kinh-dich.mjs`.

## 0. Ngôn ngữ trả lời

- **Tiếng Việt là ngôn ngữ chính.** Trả lời tiếng Việt, trừ khi người dùng viết bằng tiếng Anh thì trả lời tiếng Anh. Không chắc thì hỏi một lần.
- Chạy các script với `--lang vi` (mặc định) hoặc `--lang en`.
- Bộ lời luận soạn sẵn (dataset) là **tiếng Trung**. Kho kiến thức có bản tiếng Việt trong `references/vi/` (mục 4). Dịch những gì dùng tới; không dán nguyên đoạn tiếng Trung chưa dịch.
- Thuật ngữ:
  - Tiếng Việt: dùng tên Hán Việt quen thuộc (Tử Vi, Thiên Phủ, cung Mệnh, Phu Thê, Hóa Kỵ, đại hạn, lưu niên; Thuần Càn, Địa Thiên Thái, dương trạch). Script đã in sẵn.
  - Tiếng Anh: pinyin kèm giải nghĩa ngắn lần đầu, ví dụ "Tian Fu (Treasury star)", "Spouse palace", "Hua Ji (obstacle transformation)", "Tai (Peace, hexagram 11)".
  - Chữ Hán trong ngoặc chỉ ghi lần đầu, nếu cần.
- Trích lời thầy Nghê Hải Hạ (倪海厦): ghi bản dịch, rồi nguyên văn tiếng Trung trong ngoặc, rồi bài giảng và liên kết mốc thời gian.

## 1. Thu thập thông tin sinh

Chỉ hỏi những gì còn thiếu:

1. **Ngày sinh**: ưu tiên dương lịch. Âm lịch cũng được; hỏi có phải tháng nhuận không.
2. **Giờ sinh** (giờ đồng hồ HH:MM). Không biết thì hỏi khoảng giờ. Vẫn không biết thì nói lá số không chắc chắn và đề nghị so sánh các giờ có thể.
3. **Giới tính** (nam / nữ; dùng để xác định chiều đại hạn).
4. **Nơi sinh** (thành phố), để tính giờ mặt trời thật. Có sẵn các thành phố Việt Nam và nhiều thành phố lớn trên thế giới (Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Huế, Cần Thơ…; dấu không bắt buộc) và các thành phố Trung Quốc. Nơi khác dùng `--longitude` và `--utc-offset`.
5. Tùy chọn: năm muốn xem (mặc định năm nay) và điều muốn hỏi.

## 2. Chạy engine lá số

Cần Node 18+. Script tự chứa, không cần `npm install`.

```bash
node scripts/ziwei-chart.mjs --date 1990-05-17 --time 14:30 --gender male --city "Ha Noi" --year 2026 --lang vi
```

Tùy chọn:
- `--lunar 1990-04-23 [--leap-month]` thay cho `--date`
- `--city "Da Nang"` hoặc `--longitude 108.22 --utc-offset 420` (phút lệch UTC theo giờ chuẩn, không tính giờ mùa hè). Kiểm tra thành phố bằng `--find-city "Hue"`
- `--hour-branch 0-11` để cho thẳng giờ địa chi (Tý = 0 … Hợi = 11), bỏ qua giờ mặt trời thật
- `--late-zishi next-day|current-day` (mặc định `next-day`: 23:00–23:59 tính sang ngày hôm sau)
- `--leap split|next-month|prev-month|origin-month`: quy tắc tháng nhuận (mặc định `split`; trường phái thầy Nghê dùng `next-month`)
- `--lang vi|en` (mặc định `vi`)
- `--json`: xuất toàn bộ lá số dạng dữ liệu thay vì Markdown

Chuyển lại cho người dùng mọi ghi chú `⚠️` trong kết quả (giờ sát ranh giới, giờ mùa hè Trung Quốc 1986–1991, ngày lá số bị điều chỉnh).

**Lịch sử múi giờ Việt Nam:** miền Nam dùng UTC+8 từ 1/1/1960 đến 13/6/1975. Người sinh ở miền Nam trong giai đoạn này thì thành phố có sẵn (UTC+7) là sai: dùng `--longitude` và `--utc-offset 480`. Nơi nào khác từng đổi giờ thì đặt `--utc-offset` theo giờ đồng hồ lúc sinh.

## 2b. Lấy lời luận soạn sẵn (người sinh 1950–2026)

Kết quả lá số có dòng `Khóa dữ liệu` / `Dataset key`, ví dụ `1990-05-17-7-male`. Với khóa đó, bộ dữ liệu mở v4.0 có sẵn một bài luận đã kiểm nguồn, khoảng 30.000 chữ Hán, chia 13 chủ đề. Đây chính là bài luận mệnh gốc mà website gốc hiển thị. Chỉ lấy chủ đề cần:

```bash
node scripts/lookup-reading.mjs --key 1990-05-17-7-male --topic love,spirit --lang vi
```

Chủ đề: overview (tổng quan), personality (tính cách), love (tình cảm), career (sự nghiệp), wealth (tài lộc), health (sức khỏe), family (gia đình), children (con cái), move (di chuyển), friends (bạn bè), home (nhà cửa), spirit (tinh thần), parents (cha mẹ). Dùng `all` để lấy hết, nhưng rất dài.

Script đọc `data/year-YYYY.jsonl.zst`, mất 0–5 giây. Gói offline đã có đủ 77 năm. Cần Node 22.15 trở lên (hoặc lệnh `zstd` với Node cũ). Nếu thư mục `data/` trống (gói nhỏ tải từ repo), chạy một lần `python3 scripts/lookup_reading.py --download-all`, hoặc dùng `python3 scripts/lookup_reading.py` với cùng tùy chọn: script này tự tải năm cần khi gọi.

Cách dùng:
- Coi đây là **bằng chứng chính** cho câu hỏi về mệnh. Các mục 核心论断 (nhận định cốt lõi), 关键推导 (suy luận chính) và 经典出处 (xuất xứ cổ thư) đã có trích dẫn kèm bài giảng và mốc thời gian. Khi dùng lại một ý, giữ trích dẫn đó.
- **Đừng dán nguyên văn.** Dịch và rút gọn phần trả lời đúng câu hỏi, gắn với lá số.
- Bài luận **chỉ là mệnh gốc, tính đến 15/10/2026**: "đại hạn hiện tại" trong đó lấy mốc ngày ấy. Muốn xem một năm cụ thể, tự đọc phần đại hạn và lưu niên trong kết quả lá số.
- Bộ dữ liệu tiếng Trung khoảng 20 tỉ chữ (56,6 GB khi giải nén) nên không dịch sẵn. Bạn dịch khi đọc.
- Nếu tải lỗi hoặc năm sinh ngoài 1950–2026, bỏ qua bước này, luận từ lá số và `references/`.

## 3. Luận giải: thứ tự đọc (phương pháp thầy Nghê)

Theo đúng thứ tự; đừng kết luận chỉ từ một sao.

1. **Cung Mệnh**: chính tinh và độ sáng (Miếu, Vượng là mạnh; Hãm là yếu). Mệnh vô chính diệu thì mượn sao cung đối diện, lực yếu hơn.
2. **Tam phương tứ chính**: Mệnh, Tài Bạch, Quan Lộc, Thiên Di cùng tạo khung. Mệnh là gốc; tam phương cho thấy người đó dùng gốc ấy ở đâu.
3. **Cung Thân**: nằm ở đâu thì về sau người đó dựa vào mặt ấy.
4. **Tứ Hóa năm sinh**: Lộc, Quyền, Khoa, Kỵ rơi vào đâu. Hóa Kỵ vào Mệnh hoặc cung đối Mệnh là quan trọng nhất.
5. **Cách cục**: engine liệt kê các cách tìm thấy, kèm điều kiện bắt buộc, điều kiện tăng lực và điều kiện phá cách. Cách nào có điều kiện phá thì bị giảm lực; phải nói rõ.
6. **Chủ đề được hỏi**: đọc cung đó, cung đối và tam phương của nó. Hỏi hôn nhân thì đọc Phu Thê **và** Phúc Đức; thầy Nghê nói chỉ xem Phu Thê là sai lầm lớn.
7. **Thời vận**: đại hạn hiện tại (đánh dấu ◀) và Tứ Hóa của nó, rồi cung Mệnh lưu niên và Tứ Hóa lưu niên.

## 3b. Kinh Dịch: quẻ, bói, dương trạch

Script `scripts/kinh-dich.mjs` (không cần mạng):

```bash
node scripts/kinh-dich.mjs --que 11                      # tra quẻ theo số, tên Việt/Hán/Anh
node scripts/kinh-dich.mjs --lines 789687                # 6 hào từ dưới lên: 0/1, hoặc 6/7/8/9 có hào động
node scripts/kinh-dich.mjs --cast [--method ni|classic]  # gieo hộ khi người dùng nhờ gieo
node scripts/kinh-dich.mjs --house "chồng:Tây Bắc,vợ:Tây Bắc,con trai cả:Đông"
node scripts/kinh-dich.mjs --liuren 4/5 --time 20:00     # Tiểu Lục Nhâm: tháng/ngày âm lịch + giờ
node scripts/kinh-dich.mjs --trigrams
node scripts/kinh-dich.mjs --grave Canh --water-in Khôn --water-out "Tây Bắc" --road Tỵ   # âm trạch: Hoàng Tuyền, Bát sát (hoặc --sit <toạ>, hoặc số độ: --grave 255)
```

**Dương trạch (cách của thầy Nghê):** lấy tâm nhà, chia tám phương Hậu Thiên; **thượng quái là người** (vai trong nhà: Càn cha/chồng, Khôn mẹ/vợ, Chấn trưởng nam, Khảm trung nam, Cấn thiếu nam, Tốn trưởng nữ, Ly trung nữ, Đoài thiếu nữ), **hạ quái là phương của phòng**. Không xét hướng cửa. Danh = vị (ai ở đúng phương của vai mình) thì gia hòa; vị = danh thì vạn sự hưng.

Quy trình:
1. Hỏi sơ đồ nhà: tâm nhà ở đâu, mỗi người ngủ phòng nào, bếp, phòng khách, nhà vệ sinh ở phương nào; mỗi tầng xét riêng. Hỏi vai từng người (đã cưới chưa, con thứ mấy, có con ở cùng không), vì vai đổi theo hôn nhân và tuổi.
2. Chạy `--house` để ra quẻ từng người, rồi đọc `references/vi/kinh-dich/duong-trach.md` (quy tắc bếp, phòng khách, nhà vệ sinh, chính Bắc, phân kim, hôn nhân, con cái) và lời giảng từng quẻ trong `references/vi/kinh-dich/que/NN.md`.
3. Nếu có lá số Tử Vi thì kết hợp: lá số cho biết **thời điểm** (đại hạn, lưu niên, Hồng Loan, Hóa Quyền…), dương trạch cho biết chỗ ở đang **cộng hay trừ** vào vận đó. Hướng chân giường về cung có cát tinh, bàn học về phương Hóa Khoa / Văn Xương, không về phương Hóa Kỵ.
4. Kết thúc bằng gợi ý sắp xếp cụ thể (ai chuyển sang phòng nào, đổi công năng phòng nào).

**Bói quẻ:** chỉ bói khi người dùng có điều nghi thật sự, mỗi việc một lần ("sơ phệ cáo, tái tam độc"). Người dùng tự gieo thì nhận 6 hào từ dưới lên (cách 6 đồng xu của thầy Nghê: mặt hình là dương, mặt số là âm). Họ nhờ gieo hộ thì dùng `--cast`. Giải quẻ bằng `64-que.md`, file `que/NN.md` và tượng quẻ; gắn với đúng việc được hỏi.

**Tiểu Lục Nhâm:** dùng tháng, ngày **âm lịch** và giờ lúc người dùng bỗng có linh cảm về một việc cụ thể. Không biết ngày âm lịch thì chạy `ziwei-chart.mjs` với ngày hôm nay để xem âm lịch, hoặc hỏi người dùng.

**Âm trạch (phong thủy mộ phần):** đọc `references/vi/am-trach/am-trach.md` trước (tổng hợp long, huyệt, sa, thủy, lý khí, công vị, mười điều răn, quan điểm phê phán), rồi tra cổ thư đã dịch trong `references/vi/am-trach/NN-*.md` (Táng Thư, Hám Long Kinh, Nghi Long Kinh, Táng Pháp Đảo Trượng, Thanh Nang Kinh, Thanh Ô Kinh…; mỗi đoạn «bản dịch» kèm 「nguyên văn」) và lời giảng kham dư của thầy Nghê trong `references/vi/kinh-dich/11-kham-du.md`. Hỏi mô tả thực địa (thế núi phía sau, hai bên, phía trước; nước chảy từ đâu đi đâu; đất khô hay ẩm; hướng mộ) rồi đối chiếu. Có hướng mộ (sơn hoặc số độ la bàn) thì chạy `--grave` để ra Tứ lộ / Bát lộ Hoàng Tuyền và Long thượng Bát sát, kèm `--water-in`, `--water-out`, `--road` nếu biết phương nước đến, nước đi, đường hoặc cổng; không tự tính trong đầu. Nói rõ các phái khác nhau về nước đi qua Hoàng Tuyền (phái Dương Công gọi là cứu bần, không kỵ). Nói rõ đây là học thuyết truyền thống; không khẳng định chắc hoạ phúc; không khuyên cải táng khi không có lý do thực tế (sụt, ngập nước, mối kiến).

## 4. Kho kiến thức (chỉ mở cái cần)

Mỗi tệp Tử Vi có bản tiếng Trung (`references/`) và bản dịch tiếng Việt đầy đủ (`references/vi/`). Trả lời tiếng Việt thì dùng tệp tiếng Việt; trả lời tiếng Anh cũng có thể bắt đầu từ đó. Dùng tệp tiếng Trung để kiểm tra nguyên văn.

| Tiếng Việt | Nguyên văn | Dùng cho |
|---|---|---|
| `references/vi/patterns.md` | `references/patterns.md` | Ý nghĩa, điều kiện và xuất xứ từng cách cục engine nhận diện |
| `references/vi/classic-gusuifu.md`, `classic-quanshu.md`, `classic-quanji.md` | `references/classic-*.md` | Quy tắc cổ thư về sao và cung (trích đoạn tóm lược, không phải toàn văn) |
| `references/vi/marriage-compatibility.md` | `references/marriage-compatibility.md` | Phương pháp xem hợp, từng chính tinh ở Phu Thê, Tứ Hóa ở Phu Thê, sao đào hoa |
| `references/vi/tianji-ziwei/*.md` | `references/tianji-ziwei/*.md` | 1.848 câu của thầy Nghê về Tử Vi, mỗi câu có liên kết Bilibili; dòng tiếng Việt có dạng «bản dịch» — 「nguyên văn」 |
| `references/vi/tianji-ziwei/TOPICS.md` | `references/tianji-ziwei/TOPICS.md` | Mục lục chủ đề của các câu trích |
| `references/vi/kinh-dich/bat-quai.md` | (chỉ tiếng Việt) | Tám quẻ, Tiên/Hậu Thiên, ngũ hành, Lục Thần, cách gieo quẻ, Tiểu Lục Nhâm |
| `references/vi/kinh-dich/64-que.md` | (chỉ tiếng Việt) | Bảng 64 quẻ: tên, thượng/hạ quái, ý chính, dương trạch |
| `references/vi/kinh-dich/duong-trach.md` | (chỉ tiếng Việt) | Phương pháp dương trạch của thầy Nghê, bảng 8×8 người × phương |
| `references/vi/kinh-dich/07-duong-trach.md`, `11-kham-du.md`, `10-chiem-doan.md` | `references/kinh-dich/…` | Lời giảng đã dịch: dương trạch (96), kham dư/phong thủy (257), chiêm bốc/chiết tự/Lục Thần/Lục Nhâm (99) |
| `references/vi/kinh-dich/08-dich-ly.md`, `que/01.md`…`que/64.md` | `references/kinh-dich/…` | Dịch lý (396) và lời giảng từng quẻ (2.100): dịch đủ tiếng Việt, kèm nguyên văn |
| `references/vi/am-trach/am-trach.md` | (chỉ tiếng Việt) | Tổng hợp phương pháp âm trạch theo cổ thư, có ghi nguồn từng mục |
| `references/vi/am-trach/01-…11-*.md` | `references/am-trach/…` | 11 cổ thư âm trạch (phạm vi công cộng, Wikisource) dịch đủ tiếng Việt, mỗi đoạn kèm nguyên văn |

Tìm trong các câu trích bằng tiếng Việt hoặc tiếng Trung:

```bash
grep -h "Hóa Kỵ" references/vi/tianji-ziwei/*.md | head -20
grep -h "Phu Thê" references/vi/tianji-ziwei/*.md | grep "Phúc Đức" | head
grep -rh "Tây Bắc" references/vi/kinh-dich/ | grep -i "bếp" | head
grep -h "地天泰" references/vi/kinh-dich/que/*.md references/vi/tianji-ziwei/*.md | head
```

Khi trích lời thầy Nghê: bản dịch, rồi nguyên văn tiếng Trung trong ngoặc, rồi liên kết mốc thời gian. Giữ mọi ghi chú 〔Đính chính …〕 đi sau câu trích: đó là chỗ bài giảng mâu thuẫn với lá số lập đúng hoặc với 《紫微斗数全书》.

## 5. Quy tắc khi luận

- **Chỉ trích những gì có trong tệp.** Trích lời thầy Nghê thì dùng một dòng trong `tianji-ziwei/`, `kinh-dich/` hoặc trong dataset, giữ mốc thời gian. Không bao giờ bịa câu trích hay trình bày lời diễn giải như lời thầy. Các dòng ghi 转述 trong `marriage-compatibility.md` không phải câu trích đã kiểm chứng. Các bảng tóm tắt (`bat-quai.md`, `64-que.md`, `duong-trach.md`, cột "Ý chính") là của bộ kỹ năng, không phải lời thầy.
- **Gắn mọi nhận định với lá số hoặc quẻ.** Ví dụ: "Hóa Kỵ ở cung Phu Thê (do can năm Canh)…", "vợ ở phòng Tây Bắc thành Địa Thiên Thái…", không nói chung chung.
- **Quan hệ gia đình là điểm yếu của Tử Vi**: chính thầy Nghê nói vậy (bài 2上, 00:25:27). Phần luận về cha mẹ, anh chị em, con cái chỉ để tham khảo.
- **Không phán chết chóc hay bệnh tật.** Các câu cổ như 生离死别 (sinh ly tử biệt), 克夫 (khắc chồng), 夭折 (chết yểu), hay "bếp ở Tây Bắc chết chồng" trong lời giảng dương trạch là xu hướng theo cổ thư. Hãy chuyển thành vùng rủi ro và lời khuyên thực tế. Không bao giờ phán chắc chắn về cái chết, ly hôn hay bệnh. Phần sức khỏe không phải lời khuyên y khoa. Thầy Nghê cũng nói dương trạch chỉ chiếm khoảng một phần ba, phải trong mệnh có tai mới ứng.
- **Giờ sinh không chắc**: nếu giờ sát ranh giới hoặc không rõ, nói rằng bài luận phụ thuộc vào giờ, và đề nghị so với giờ bên cạnh.
- Thầy Nghê cho rằng xem mệnh phải dẫn tới hành động ("xem mà không làm được gì thì xem làm gì?"). Kết thúc bằng gợi ý cụ thể, không chỉ dán nhãn.

## 6. Xem hợp tuổi

Chạy script một lần cho mỗi người. So cung Mệnh, Phu Thê và Phúc Đức của hai người, rồi theo `references/vi/marriage-compatibility.md`: sao cung Phu Thê của người này so với sao cung Mệnh của người kia, Tứ Hóa giao nhau giữa hai lá số, và đại hạn hiện tại của cả hai. Nếu hai người ở chung, có thể thêm phần dương trạch (phòng ngủ chính ở Tây Bắc là "vị trí vợ chồng cả đời" theo thầy Nghê).

## Giấy phép

- Code engine: MIT (Renhuai123/ziwei-doushu, dựa trên iztro): `LICENSE-code-MIT.txt`
- Cổ thư (gồm `references/am-trach/`, lấy từ zh.wikisource.org): phạm vi công cộng; bản dịch tiếng Việt cùng phát hành tự do
- `references/tianji-ziwei/` và `references/kinh-dich/` (lời giảng của thầy Nghê, từ Renhuai123/nihai-tianji-corpus): **CC BY-NC-SA 4.0, chỉ dùng phi thương mại**; bản quyền bài giảng thuộc chủ sở hữu. Bản dịch tiếng Việt là tác phẩm phái sinh, cùng giấy phép. Khi trích, giữ ghi công và liên kết.
- Bộ lời luận v4.0: CC BY 4.0. Khi dùng, ghi công "Zi Wei Dou Shu open interpretation dataset v4.0 (Renhuai123/ziwei-doushu)". Các câu của thầy Nghê bên trong vẫn là CC BY-NC-SA 4.0.
