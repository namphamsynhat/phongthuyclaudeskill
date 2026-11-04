"""Write the Vietnamese Kinh Dịch core files (bat-quai.md, 64-que.md, duong-trach.md, README.md)
into <refs>/vi/kinh-dich/ and a README into <refs>/kinh-dich/.

  python3 tools/kinh_dich_core.py <refs_dir>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from iching_data import HEX, TRIGRAMS, composition  # noqa: E402

T = {t[0]: t for t in TRIGRAMS}
ORDER_DIR = ["kan", "gen", "zhen", "xun", "li", "kun", "dui", "qian"]  # Bắc, Đông Bắc, Đông, Đông Nam, Nam, Tây Nam, Tây, Tây Bắc
ORDER_ROLE = ["qian", "kun", "zhen", "kan", "gen", "xun", "li", "dui"]
BY = {composition(zh): (n, zh, vi) for n, zh, vi, _ in HEX}
SRC = "[Renhuai123/nihai-tianji-corpus](https://github.com/Renhuai123/nihai-tianji-corpus)"


def lines_sym(bits):  # bottom→top -> text drawing top→bottom
    return " / ".join("⚊" if b == "1" else "⚋" for b in reversed(bits))


def bat_quai():
    rows = "\n".join(
        f"| {t[3]} | **{t[2]}** {t[1]} | {lines_sym(t[4])} | {t[6]} ({t[5]}) | {t[7]} | {t[8]} | {t[9]} |" for t in TRIGRAMS)
    return f"""# Bát Quái (八卦): tám quẻ đơn

Nền tảng cho Kinh Dịch, phong thủy dương trạch và Lục Thần trong bộ kỹ năng này. Phần lời giảng của thầy Nghê Hải Hạ (倪海厦) xem trong `11-kham-du.md` (mục Tiên Thiên và Hậu Thiên Bát Quái, Định vị Hậu Thiên Bát Quái) và `08-dich-ly.md`.

## Bảng tám quẻ (Hậu Thiên, Văn Vương)

Hào vẽ **từ trên xuống**: ⚊ là hào dương, ⚋ là hào âm. Trong dữ liệu, hào được ghi từ dưới lên (hào Sơ → hào Thượng).

| Ký hiệu | Quẻ | Hào (trên → dưới) | Tượng tự nhiên | Ngũ hành | Phương Hậu Thiên | Vai trong gia đình |
|---|---|---|---|---|---|---|
{rows}

Cách nhớ vai trong nhà (theo 《说卦传》 và lời thầy Nghê): Càn là cha, Khôn là mẹ. Quẻ có **một hào dương** là con trai (hào dương ở dưới: trưởng nam Chấn; ở giữa: trung nam Khảm; ở trên: thiếu nam Cấn). Quẻ có **một hào âm** là con gái (dưới: trưởng nữ Tốn; giữa: trung nữ Ly; trên: thiếu nữ Đoài).

## Tiên Thiên và Hậu Thiên

- **Tiên Thiên Bát Quái** (Phục Hy): Càn trên, Khôn dưới, "thiên địa định vị". Thầy Nghê: Tiên Thiên là **thể**, không có thứ tự tương sinh nên không dùng trực tiếp.
- **Hậu Thiên Bát Quái** (Văn Vương): là **dụng**. Bát tự, Tứ Trụ, dương trạch, phong thủy đều dùng Hậu Thiên. Thứ tự đi theo vòng tương sinh: Chấn, Tốn (Mộc) → Ly (Hỏa) → Khôn, Cấn (Thổ) → Đoài, Càn (Kim) → Khảm (Thủy).
- Phương vị vẽ theo kiểu Trung Quốc xưa: tọa Bắc hướng Nam, nên bản đồ cổ thường **Nam ở trên**. Khi đọc sơ đồ cổ phải xoay lại.

## Ngũ hành sinh khắc

- Tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc.
- Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
- Cùng hành gọi là **tỷ kiên** (ngang vai).

## Lục Thần theo phương (dùng trong phong thủy, tướng mặt, chiết tự)

| Lục Thần | Phương | Hình | Ý chính (theo thầy Nghê) |
|---|---|---|---|
| Thanh Long | Đông | Nét mác dài, có lực, liền mạch | Đại cát, mọi việc hanh thông |
| Bạch Hổ | Tây | Miệng rộng, đuôi nhọn, quay ra ngoài | Tang, bệnh, thị phi, lao ngục |
| Chu Tước | Nam | Nét giao chéo | Khẩu thiệt, kiện tụng |
| Huyền Vũ | Bắc | Vuông, có góc nhọn | Trộm cắp, mất của, tiểu nhân |
| Câu Trần | Tây Nam / Đông Bắc | Nét ngắn, móc, đứt quãng | Đình trệ, họa nhỏ liên miên |
| Đằng Xà | Đông Nam / Tây Bắc | Cong queo, vặn vẹo | Lo sợ hão, lừa dối, bất an |

## Gieo quẻ đồng tiền theo cách thầy Nghê

1. Tâm thành; chỉ bói khi thật sự có điều nghi ("bốc dĩ quyết nghi, bất nghi hà bốc"). Thầy Nghê không bói quá ba quẻ một ngày.
2. Dùng **sáu đồng xu** trong ống tre, lắc 5–6 lần rồi rải thành một hàng.
3. Đọc **từ dưới lên**: mặt hình (đầu người) là dương, mặt chữ số là âm. Hàng lộn xộn thì bỏ, gieo lại.
4. Sáu hào cho ra một quẻ; tra quẻ trong `64-que.md` và lời giảng trong `que/NN.md`.
5. Hỏi một lần là đủ ("sơ phệ cáo, tái tam độc"): hỏi đi hỏi lại cùng một việc thì quẻ không còn ứng.

(Cách ba đồng xu cổ điển với hào động 6/7/8/9 cũng được công cụ `kinh_dich` hỗ trợ.)

## Tiểu Lục Nhâm (bấm đốt tay)

Sáu cung theo thứ tự: **Đại An → Lưu Liên → Tốc Hỷ → Xích Khẩu → Tiểu Cát → Không Vong**. Bắt đầu từ Đại An là tháng Giêng, đếm đến tháng âm lịch; từ cung đó đếm ngày (ngày 1 là chính cung đó); từ cung đó đếm giờ (giờ Tý là chính cung đó). Dùng khi **bỗng có linh cảm** về một việc cụ thể, lấy đúng thời điểm ấy.

| Cung | Ý theo thầy Nghê |
|---|---|
| Đại An | Tốt, khoảng một tuần thấy kết quả |
| Lưu Liên | Việc còn đình trệ, chưa tiến |
| Tốc Hỷ | Có kết quả ngay |
| Xích Khẩu | Người thứ ba xen vào, tiểu nhân, thị phi |
| Tiểu Cát | Tốt, khoảng hai tuần |
| Không Vong | Không thành, có thể dứt niệm |

Ví dụ của thầy Nghê: mùng 5 tháng 4 âm lịch, giờ Tuất → Không Vong.

Nguồn lời giảng: {SRC} (CC BY-NC-SA 4.0). Bảng trên là tóm tắt của bộ kỹ năng, không phải nguyên văn.
"""


def que64():
    rows = []
    for n, zh, vi, meaning in HEX:
        up, lo = composition(zh)
        u, l = T[up], T[lo]
        rows.append(f"| {n} | {chr(0x4DC0 + n - 1)} | **{vi}** | {zh} | {u[2]} {u[3]} / {l[2]} {l[3]} | {meaning} | {u[9].split(' (')[0]} ở {l[8]} | [vi](que/{n:02d}.md) · [zh](../../kinh-dich/que/{n:02d}.md) |")
    return f"""# 64 quẻ Kinh Dịch (thứ tự Văn Vương)

Mỗi quẻ có một file riêng `que/NN.md` chứa lời giảng của thầy Nghê Hải Hạ về quẻ đó (tượng quẻ, vị trí trong Tự Quái, lời hào, ứng dụng đời người, dương trạch, ví dụ bói), kèm mốc thời gian Bilibili. Các file `que/` có tiêu đề và mục tiếng Việt; phần lớn lời giảng hiện còn ở nguyên văn tiếng Trung, Claude dịch khi trích.

Cột **Dương trạch** đọc theo cách của thầy Nghê: thượng quái là **người** (vai trong nhà), hạ quái là **vị trí** (phương của phòng tính từ tâm nhà). Ví dụ Địa Thiên Thái = mẹ/vợ (Khôn) ở phương Tây Bắc (Càn).

| # | Ký hiệu | Tên | Hán | Thượng / Hạ | Ý chính | Dương trạch | Lời giảng |
|---|---|---|---|---|---|---|---|
{chr(10).join(rows)}

Ghi chú:
- "Ý chính" là tóm tắt ngắn của bộ kỹ năng theo nghĩa truyền thống, không phải lời thầy Nghê. Muốn trích lời thầy, dùng file `que/NN.md` hoặc công cụ tìm trích dẫn.
- Thầy Nghê gọi các quẻ thuần như 乾为天, 坤为地; tiếng Việt quen gọi Thuần Càn, Thuần Khôn.

Nguồn lời giảng: {SRC} (CC BY-NC-SA 4.0).
"""


def duong_trach():
    head = "| Vai \\ Phương | " + " | ".join(f"{T[d][8]} ({T[d][2]})" for d in ORDER_DIR) + " |"
    sep = "|---" * (len(ORDER_DIR) + 1) + "|"
    rows = []
    for r in ORDER_ROLE:
        cells = []
        for d in ORDER_DIR:
            n, zh, vi = BY[(r, d)]
            mark = " ✅" if r == d else ""
            cells.append(f"{n}. {vi}{mark}")
        rows.append(f"| **{T[r][9].split(' (')[0]}** ({T[r][2]}) | " + " | ".join(cells) + " |")
    return f"""# Dương trạch theo Kinh Dịch (phương pháp của thầy Nghê Hải Hạ)

Đây là tóm tắt phương pháp **dương trạch đổi mệnh** (阳宅化命) mà thầy Nghê giảng trong 《天纪》. Lời giảng gốc kèm bản dịch: `07-duong-trach.md` và `11-kham-du.md` (mục Vai trò trong gia đình khi vào nhà, Hình và thần của nhà). Lời giảng theo từng quẻ: `que/NN.md`, mục "Dương trạch".

> Đây là quan điểm của một trường phái. Những câu về tai họa trong lời giảng (sinh ly, tử biệt, bệnh tật) là xu hướng theo cổ thư; khi tư vấn hãy chuyển thành **vùng rủi ro và lời khuyên**, không bao giờ phán chắc chắn về cái chết, ly hôn hay bệnh. Thầy Nghê cũng nói dương trạch chỉ chiếm khoảng **một phần ba**, phải trong mệnh có tai thì mới ứng.

## 1. Cách xác định

1. Tìm **điểm trung tâm** của mặt bằng (mỗi tầng xét riêng một mặt bằng).
2. Đặt la bàn ở tâm, chia tám phương theo Hậu Thiên Bát Quái. **Không cần quan tâm cửa chính quay hướng nào**: thầy Nghê chỉ xét bố cục Cửu cung.
3. Mỗi phòng thuộc phương nào thì mang quẻ của phương đó (**hạ quái**). Người ở phòng đó mang quẻ theo **vai** của mình (**thượng quái**). Ghép lại thành một trong 64 quẻ, đọc tượng quẻ để biết người đó sẽ "được nuôi" thành tính cách gì.
4. Vai thay đổi theo hôn nhân và tuổi tác ("danh động thì vị động"): con cả lấy vợ ra ở riêng thì con thứ hai **bổ vị** thành con trưởng; người phụ nữ có con là "mẹ"; người đàn ông đã cưới là "chồng / cha".

## 2. Nguyên tắc "danh = vị"

- **Danh = vị** (ai ở đúng phương của vai mình) → **gia hòa**.
- **Vị = danh** (ở vị trí nào thì dùng danh phận ấy làm việc) → **vạn sự hưng**, phát sự nghiệp.
- Bốn chữ tóm tắt cả phương pháp: **trưởng ấu hữu tự** (lớn nhỏ có thứ tự).
- Ở sai vị trí thì "con thành cha, cha thành con": con ở vị trí cha là thái quá, cha ở vị trí con là bất cập; con cái khó nghe lời.

## 3. Bảng 64 tổ hợp: người (hàng) × phương (cột)

✅ là đúng vị (quẻ thuần, danh = vị).

{head}
{sep}
{chr(10).join(rows)}

## 4. Các quy tắc thầy Nghê nhấn mạnh

**Vợ chồng, hôn nhân**
- Phòng ngủ chính của vợ chồng nên ở **Tây Bắc**: chồng là Thuần Càn, vợ ở đó là **Địa Thiên Thái**. Thầy Nghê gọi đây là "vị trí vợ chồng cả đời".
- Người phụ nữ **một mình** (chưa chồng, ly hôn, góa) không nên ở **Tây Nam**: Thuần Khôn sáu hào âm, dễ cô đơn. Mẹ và con gái cùng ở Tây Nam thì người cha mất vị.
- Muốn Hồng Loan động (chưa chồng, hoặc tái hôn mà không có con ở cùng): ở **Đông Nam**. Có con ở cùng mà muốn tái hôn: về **Tây Nam** (vị trí người mẹ).
- Người mẹ có con mà ở **Tây Bắc** là "mẹ thay cha", khó tái hôn.
- Chồng ở **Đông Nam** là Thiên Phong Cấu: tượng gặp gỡ nam nữ, dễ có đào hoa.
- Chồng ở **Tây Nam** là Thiên Địa Bĩ: vợ chồng không giao hòa.

**Con cái**
- Con trai trưởng ở **cung Đông** (Đông cung Thái tử), chân hướng về phương cát.
- Con trai thứ hai ở **chính Bắc** là Thuần Khảm, "đi đường hiểm", thích mạo hiểm; ở **Nam** thì thành Thủy Hỏa Ký Tế, tốt hơn.
- Nửa nhà phía Bắc (từ Đông đi qua Bắc) thuộc dương, nam; nửa phía Nam thuộc âm, nữ. Theo thầy Nghê, vợ chồng ngủ ở nửa phía Bắc dễ sinh con trai, nửa phía Nam dễ sinh con gái; giường kê **sát tường phía Đông** thì đảo ngược.
- Thiếu cung Đông (phía Đông là phòng khách, phòng ăn bỏ trống) thì khó có con trai, hoặc con trai "thành khách".

**Chính Bắc**
- Bất kỳ ai ở phòng **chính Bắc** cũng dễ "đi đường hiểm": cha ở đó là Thiên Thủy Tụng (kiện tụng), mẹ ở đó là Địa Thủy Sư (tranh cãi). Thầy Nghê thường không cho người ở chính Bắc. Theo lối nhà tứ hợp viện, chính Bắc là chính sảnh đặt bài vị tổ tiên.

**Bếp, phòng khách, nhà vệ sinh** (tượng của từng phòng)
- **Bếp là tượng dao.** Bếp ở phương của vai nào thì người đó chịu rủi ro: Tây Bắc là chồng/cha, Tây Nam là vợ/mẹ, Đông là con trai trưởng, Đông Nam là con gái cả, Nam là con gái thứ, Tây là con gái út, Bắc là con trai thứ, Đông Bắc là con trai út.
- Bếp nên đặt ở **"vùng không người"**, tức phương của vai không có trong nhà, hoặc vùng giữa hai cung trên la kinh. Thầy Nghê có lúc nói chính Bắc hoặc chính Tây là chỗ đặt bếp tốt nhất.
- **Phòng khách là tượng khách.** Phòng khách ở Tây Bắc thì chồng như khách, coi nhà như khách sạn (chủ sinh ly). Phòng khách ở phía Đông thì con trai đi về như khách. Thầy Nghê thường đặt phòng khách ở **Tây Nam**.
- **Nhà vệ sinh là tượng ô trọc.** Đặt ở **giữa nhà** là nhà hung. Ở Tây Bắc: khuyết vị người chồng, nhiều thị phi, cha phá tài. Ở cung Đông: ảnh hưởng hô hấp, mũi họng, da. Nên đặt ở vùng không người.
- Nhà kiểu **"một bên ở người"** (phòng ngủ dồn một nửa, nửa kia là bếp, phòng khách) không tốt cho sức khỏe.

**Giường, bàn học, la kinh**
- Không đặt giường hay xây nhà trên **đường phân kim** (ranh giới giữa hai trong 24 sơn của la kinh): người ngủ không yên, hay rơi khỏi giường.
- Hướng chân giường về phương **Diên Niên / phương có cát tinh** trên lá số; bàn học hướng về phương có **Hóa Khoa, Văn Xương, Văn Khúc, Khôi Việt**. Không bao giờ hướng về phương Hóa Kỵ.
- Thử tìm hướng hợp mình: ngồi ghế xoay, mỗi hướng ngồi 5 phút, hướng nào thấy mát và dễ chịu là hướng tốt.

**Thời gian ứng**
- "Hung trạch ba năm thành tai": số 3 (ba tháng, ba năm), rồi năm thứ sáu. Sửa nhà thì vận đổi theo, ví dụ sửa năm 40 tuổi thì Hồng Loan năm 41 mới ứng.
- Sửa rồi phải giữ: lấy chồng rồi mà không về ở Tây Bắc thì "đi theo mệnh" như cũ.

**Văn phòng**
- Ông chủ ngồi Tây Bắc. Cửa vào ở Tây Nam thì thành Địa Thiên Thái, tốt; ngồi Đông Nam thì thành Địa Phong Thăng. Rồi quay bàn làm việc theo hướng cát trong bát tự.

## 5. Kết hợp với Tử Vi

- Lá số Tử Vi cho biết **thời điểm** (đại hạn, lưu niên: Hồng Loan, Hóa Quyền, Hóa Kỵ…). Dương trạch cho biết **chỗ ở đang cộng hay trừ** vào vận đó. Ví dụ của thầy Nghê: mệnh có Hóa Quyền năm 32 tuổi nhưng ở chính Bắc thì có thể lùi khoảng 5 năm.
- Thầy Nghê dùng 12 cung địa chi của lá số để chọn hướng chân và hướng bàn học: hướng về cung có cát tinh, tránh cung có Hóa Kỵ.

Nguồn: lời giảng 《天纪》 của thầy Nghê Hải Hạ qua {SRC} (CC BY-NC-SA 4.0). Phần trên là tóm tắt của bộ kỹ năng; muốn trích nguyên văn, dùng `07-duong-trach.md`, `11-kham-du.md` hoặc `que/NN.md`.
"""


def readme_vi(stats):
    return f"""# Kho tri thức Kinh Dịch (易经), bản tiếng Việt

Phần Kinh Dịch của bộ kỹ năng, dựa trên lời giảng 《天纪》 của thầy Nghê Hải Hạ: Dịch lý, 64 quẻ, chiêm bốc, chiết tự, Lục Thần, Lục Nhâm, kham dư (phong thủy) và dương trạch.

| File | Nội dung | Trạng thái tiếng Việt |
|---|---|---|
| `bat-quai.md` | Tám quẻ đơn, Tiên/Hậu Thiên, ngũ hành, Lục Thần, cách gieo quẻ, Tiểu Lục Nhâm | Viết bằng tiếng Việt |
| `64-que.md` | Bảng 64 quẻ: tên Việt/Hán, thượng/hạ quái, ý chính, dương trạch, liên kết | Viết bằng tiếng Việt |
| `duong-trach.md` | Phương pháp dương trạch của thầy Nghê, bảng 8×8 người × phương | Viết bằng tiếng Việt |
| `07-duong-trach.md` | {stats['07-duong-trach']} câu: dương trạch đổi mệnh | Dịch đủ, kèm nguyên văn |
| `11-kham-du.md` | {stats['11-kham-du']} câu: kham dư, loan đầu, lý khí, la kinh, vai trò trong nhà | Dịch đủ, kèm nguyên văn |
| `10-chiem-doan.md` | {stats['10-chiem-doan']} câu: quẻ đồng tiền, chiết tự, Lục Thần, Lục Nhâm | Dịch đủ, kèm nguyên văn |
| `08-dich-ly.md` | {stats['08-dich-ly']} câu: tổng cương Dịch lý | Tiêu đề tiếng Việt, lời giảng còn nguyên văn |
| `que/01.md` … `que/64.md` | {stats['que']} câu: lời giảng từng quẻ | Tiêu đề tiếng Việt, lời giảng còn nguyên văn |

Câu chưa dịch giữ nguyên văn tiếng Trung, mỗi câu có liên kết Bilibili đến đúng giây. Khi trích, hãy dịch sang tiếng Việt, kèm nguyên văn trong ngoặc 「」 và liên kết.

Giấy phép: lời giảng thuộc {SRC}, CC BY-NC-SA 4.0, chỉ dùng phi thương mại; bản dịch là tác phẩm phái sinh, cùng giấy phép. Các bảng tóm tắt (`bat-quai.md`, `64-que.md`, `duong-trach.md`) do bộ kỹ năng biên soạn.
"""


def readme_zh(stats):
    return f"""# 易经知识库（倪海厦《天纪》原文）

本目录为《天纪》中与易经相关的原话短引文，按主题整理，每条附 B 站时间戳链接。越南语版本（含越南语译文与越南语核心文档）见 `../vi/kinh-dich/`。

| 文件 | 内容 |
|---|---|
| `07-duong-trach.md` | 阳宅化命：八卦方位与家庭角色（{stats['07-duong-trach']} 条） |
| `08-dich-ly.md` | 易理总纲（{stats['08-dich-ly']} 条） |
| `10-chiem-doan.md` | 占断：金钱卦 / 测字 / 六神 / 六壬（{stats['10-chiem-doan']} 条） |
| `11-kham-du.md` | 堪舆：峦头 / 理气 / 阳宅（{stats['11-kham-du']} 条） |
| `que/01.md` … `que/64.md` | 六十四卦逐卦（共 {stats['que']} 条） |

来源：{SRC}，CC BY-NC-SA 4.0，仅限非商业使用；原课程著作权归权利人。
"""


if __name__ == "__main__":
    refs = Path(sys.argv[1])
    vi, zh = refs / "vi" / "kinh-dich", refs / "kinh-dich"
    stats = {}
    for stem in ["07-duong-trach", "08-dich-ly", "10-chiem-doan", "11-kham-du"]:
        stats[stem] = sum(1 for l in (zh / f"{stem}.md").read_text(encoding="utf8").splitlines() if l.startswith("- ["))
    stats["que"] = sum(sum(1 for l in p.read_text(encoding="utf8").splitlines() if l.startswith("- [")) for p in (zh / "que").glob("*.md"))
    (vi / "bat-quai.md").write_text(bat_quai(), encoding="utf8")
    (vi / "64-que.md").write_text(que64(), encoding="utf8")
    (vi / "duong-trach.md").write_text(duong_trach(), encoding="utf8")
    (vi / "README.md").write_text(readme_vi(stats), encoding="utf8")
    (zh / "README.md").write_text(readme_zh(stats), encoding="utf8")
    print(stats)
