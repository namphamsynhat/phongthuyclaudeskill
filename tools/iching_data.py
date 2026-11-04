"""Single source of truth for the 8 trigrams and 64 hexagrams (King Wen order).
Writes src/iching-data.json for the TypeScript engine:  python3 tools/iching_data.py
"""
import json
from pathlib import Path

# key, zh, vi, symbol, lines (bottom→top, 1 = yang), nature zh/vi, element vi,
# later-heaven direction vi, family role vi, Ni's yang-zhai role
TRIGRAMS = [
    ("qian", "乾", "Càn", "☰", "111", "天", "Trời", "Kim", "Tây Bắc", "Cha / chồng (người chủ nhà nam)"),
    ("dui", "兑", "Đoài", "☱", "110", "泽", "Đầm", "Kim", "Tây", "Con gái út"),
    ("li", "离", "Ly", "☲", "101", "火", "Lửa", "Hỏa", "Nam", "Con gái giữa"),
    ("zhen", "震", "Chấn", "☳", "100", "雷", "Sấm", "Mộc", "Đông", "Con trai cả"),
    ("xun", "巽", "Tốn", "☴", "011", "风", "Gió", "Mộc", "Đông Nam", "Con gái cả"),
    ("kan", "坎", "Khảm", "☵", "010", "水", "Nước", "Thủy", "Bắc", "Con trai giữa"),
    ("gen", "艮", "Cấn", "☶", "001", "山", "Núi", "Thổ", "Đông Bắc", "Con trai út"),
    ("kun", "坤", "Khôn", "☷", "000", "地", "Đất", "Thổ", "Tây Nam", "Mẹ / vợ (người chủ nhà nữ)"),
]
NATURE = {t[5]: t[0] for t in TRIGRAMS}

# number, Chinese name as in Ni's corpus, Vietnamese name, short Vietnamese meaning
HEX = [
    (1, "乾为天", "Thuần Càn", "Trời; cương kiện, tự cường không ngừng, làm chủ"),
    (2, "坤为地", "Thuần Khôn", "Đất; nhu thuận, bao dung, nâng đỡ vạn vật"),
    (3, "水雷屯", "Thủy Lôi Truân", "Gian nan lúc khởi đầu; gieo mầm giữa khó khăn"),
    (4, "山水蒙", "Sơn Thủy Mông", "Non nớt, mờ tối; cần học hỏi và khai sáng"),
    (5, "水天需", "Thủy Thiên Nhu", "Chờ đợi đúng thời; nuôi sức trước khi tiến"),
    (6, "天水讼", "Thiên Thủy Tụng", "Tranh chấp, kiện tụng; nên hòa giải, dừng giữa chừng"),
    (7, "地水师", "Địa Thủy Sư", "Quân đội, kỷ luật; dẫn dắt đám đông bằng chính nghĩa"),
    (8, "水地比", "Thủy Địa Tỷ", "Gần gũi, liên kết; chọn đúng người để theo"),
    (9, "风天小畜", "Phong Thiên Tiểu Súc", "Tích nhỏ; bị kiềm hãm tạm thời, tích lũy dần"),
    (10, "天泽履", "Thiên Trạch Lý", "Bước đi, lễ nghĩa; thận trọng như giẫm đuôi hổ"),
    (11, "地天泰", "Địa Thiên Thái", "Thông suốt, trên dưới giao hòa; hanh thông"),
    (12, "天地否", "Thiên Địa Bĩ", "Bế tắc, trên dưới không giao; giữ mình chờ thời"),
    (13, "天火同人", "Thiên Hỏa Đồng Nhân", "Hòa đồng, cùng chí hướng với người"),
    (14, "火天大有", "Hỏa Thiên Đại Hữu", "Có lớn, sung túc; giữ đức để giữ của"),
    (15, "地山谦", "Địa Sơn Khiêm", "Khiêm tốn; quẻ duy nhất sáu hào đều tốt"),
    (16, "雷地豫", "Lôi Địa Dự", "Vui vẻ, an lạc; chuẩn bị trước, đừng ham vui"),
    (17, "泽雷随", "Trạch Lôi Tùy", "Theo, thuận theo thời và người"),
    (18, "山风蛊", "Sơn Phong Cổ", "Hư hỏng tích tụ; sửa sai do đời trước để lại"),
    (19, "地泽临", "Địa Trạch Lâm", "Đến gần, giám sát; thời thịnh nhưng phải lo xa"),
    (20, "风地观", "Phong Địa Quan", "Quan sát, làm gương cho người nhìn vào"),
    (21, "火雷噬嗑", "Hỏa Lôi Phệ Hạp", "Cắn hợp; trừ vật cản, hình phạt nghiêm minh"),
    (22, "山火贲", "Sơn Hỏa Bí", "Trang sức, vẻ ngoài; đẹp nhưng đừng quá hình thức"),
    (23, "山地剥", "Sơn Địa Bác", "Bóc mòn, suy sụp; nên yên lặng giữ gốc"),
    (24, "地雷复", "Địa Lôi Phục", "Trở lại, phục hồi; dương khí bắt đầu quay về"),
    (25, "天雷无妄", "Thiên Lôi Vô Vọng", "Không càn bậy; chân thật, tai họa bất ngờ"),
    (26, "山天大畜", "Sơn Thiên Đại Súc", "Tích lớn; nuôi dưỡng tài đức, chờ thời ra giúp đời"),
    (27, "山雷颐", "Sơn Lôi Di", "Nuôi dưỡng; cẩn trọng lời nói và ăn uống"),
    (28, "泽风大过", "Trạch Phong Đại Quá", "Quá lớn; gánh nặng quá sức, cột kèo cong"),
    (29, "坎为水", "Thuần Khảm", "Hiểm nguy chồng chất; giữ lòng tin để vượt hiểm"),
    (30, "离为火", "Thuần Ly", "Sáng, nương tựa; văn minh, bám vào chỗ đúng"),
    (31, "泽山咸", "Trạch Sơn Hàm", "Cảm ứng, tình cảm nam nữ"),
    (32, "雷风恒", "Lôi Phong Hằng", "Bền lâu; đạo vợ chồng lâu dài"),
    (33, "天山遯", "Thiên Sơn Độn", "Lui ẩn đúng lúc để giữ mình"),
    (34, "雷天大壮", "Lôi Thiên Đại Tráng", "Mạnh lớn; mạnh nhưng phải giữ chính đạo"),
    (35, "火地晋", "Hỏa Địa Tấn", "Tiến lên như mặt trời mọc"),
    (36, "地火明夷", "Địa Hỏa Minh Di", "Ánh sáng bị che, bị tổn thương; giấu tài giữ mình"),
    (37, "风火家人", "Phong Hỏa Gia Nhân", "Người nhà; đạo gia đình, mỗi người đúng vị trí"),
    (38, "火泽睽", "Hỏa Trạch Khuê", "Chia lìa, trái ý; tìm điểm chung trong khác biệt"),
    (39, "水山蹇", "Thủy Sơn Kiển", "Gian nan, đi khó; quay lại tu thân"),
    (40, "雷水解", "Lôi Thủy Giải", "Giải tỏa, tháo gỡ khó khăn"),
    (41, "山泽损", "Sơn Trạch Tổn", "Bớt; bớt dưới thêm trên, bớt dục vọng"),
    (42, "风雷益", "Phong Lôi Ích", "Thêm; bớt trên thêm dưới, làm lợi cho người"),
    (43, "泽天夬", "Trạch Thiên Quải", "Quyết đoán; trừ bỏ kẻ tiểu nhân"),
    (44, "天风姤", "Thiên Phong Cấu", "Gặp gỡ bất ngờ; một âm gặp năm dương"),
    (45, "泽地萃", "Trạch Địa Tụy", "Tụ họp; người và của tụ về"),
    (46, "地风升", "Địa Phong Thăng", "Đi lên dần, như cây mọc từ đất"),
    (47, "泽水困", "Trạch Thủy Khốn", "Khốn cùng; giữ chí trong cảnh khó"),
    (48, "水风井", "Thủy Phong Tỉnh", "Cái giếng; nuôi người không cạn"),
    (49, "泽火革", "Trạch Hỏa Cách", "Thay đổi, cách mạng; đổi đúng thời"),
    (50, "火风鼎", "Hỏa Phong Đỉnh", "Cái vạc; lập cái mới, ổn định"),
    (51, "震为雷", "Thuần Chấn", "Sấm động; kinh sợ rồi tỉnh ngộ"),
    (52, "艮为山", "Thuần Cấn", "Núi; dừng lại đúng chỗ"),
    (53, "风山渐", "Phong Sơn Tiệm", "Tiến dần theo thứ tự; con gái về nhà chồng đúng lễ"),
    (54, "雷泽归妹", "Lôi Trạch Quy Muội", "Em gái về nhà chồng; vội vàng, sai vị trí"),
    (55, "雷火丰", "Lôi Hỏa Phong", "Thịnh lớn; thịnh rồi sẽ suy, giữ sáng suốt"),
    (56, "火山旅", "Hỏa Sơn Lữ", "Lữ khách, đi xa, không ổn định"),
    (57, "巽为风", "Thuần Tốn", "Gió; nhu thuận, thâm nhập"),
    (58, "兑为泽", "Thuần Đoài", "Đầm; vui vẻ, nói năng, giao tiếp"),
    (59, "风水涣", "Phong Thủy Hoán", "Tan tác, phân tán; gom lòng người lại"),
    (60, "水泽节", "Thủy Trạch Tiết", "Tiết chế, có chừng mực"),
    (61, "风泽中孚", "Phong Trạch Trung Phu", "Lòng thành tín bên trong"),
    (62, "雷山小过", "Lôi Sơn Tiểu Quá", "Quá nhỏ; việc nhỏ được, việc lớn không"),
    (63, "水火既济", "Thủy Hỏa Ký Tế", "Đã xong; thành rồi phải đề phòng loạn"),
    (64, "火水未济", "Hỏa Thủy Vị Tế", "Chưa xong; còn cơ hội, thận trọng đi tiếp"),
]


EN = ['The Creative', 'The Receptive', 'Difficulty at the Beginning', 'Youthful Folly', 'Waiting', 'Conflict', 'The Army', 'Holding Together', 'Small Taming', 'Treading', 'Peace', 'Standstill', 'Fellowship', 'Great Possession', 'Modesty', 'Enthusiasm', 'Following', 'Work on the Decayed', 'Approach', 'Contemplation', 'Biting Through', 'Grace', 'Splitting Apart', 'Return', 'Innocence', 'Great Taming', 'Nourishment', 'Great Exceeding', 'The Abysmal (Water)', 'The Clinging (Fire)', 'Influence', 'Duration', 'Retreat', 'Great Power', 'Progress', 'Darkening of the Light', 'The Family', 'Opposition', 'Obstruction', 'Deliverance', 'Decrease', 'Increase', 'Breakthrough', 'Coming to Meet', 'Gathering Together', 'Pushing Upward', 'Oppression', 'The Well', 'Revolution', 'The Cauldron', 'The Arousing (Thunder)', 'Keeping Still (Mountain)', 'Development', 'The Marrying Maiden', 'Abundance', 'The Wanderer', 'The Gentle (Wind)', 'The Joyous (Lake)', 'Dispersion', 'Limitation', 'Inner Truth', 'Small Exceeding', 'After Completion', 'Before Completion']
TRI_EN = {"qian": "Heaven", "dui": "Lake", "li": "Fire", "zhen": "Thunder", "xun": "Wind", "kan": "Water", "gen": "Mountain", "kun": "Earth"}
DIR_EN = {"Tây Bắc": "North-west", "Tây": "West", "Nam": "South", "Đông": "East", "Đông Nam": "South-east", "Bắc": "North", "Đông Bắc": "North-east", "Tây Nam": "South-west"}
ROLE_EN = {"qian": "father / husband", "kun": "mother / wife", "zhen": "eldest son", "xun": "eldest daughter", "kan": "middle son", "li": "middle daughter", "gen": "youngest son", "dui": "youngest daughter"}


def composition(zh):
    """Upper and lower trigram keys from a name like 水雷屯 or 乾为天."""
    if zh[1] == "为":
        k = NATURE[zh[2]]
        return k, k
    return NATURE[zh[0]], NATURE[zh[1]]


def records():
    tri = [dict(key=t[0], zh=t[1], vi=t[2], symbol=t[3], lines=t[4], nature_zh=t[5], nature_vi=t[6],
                element=t[7], direction=t[8], role=t[9], en=TRI_EN[t[0]],
                direction_en=DIR_EN[t[8]], role_en=ROLE_EN[t[0]]) for t in TRIGRAMS]
    hexes = []
    for n, zh, vi, meaning in HEX:
        up, lo = composition(zh)
        hexes.append(dict(n=n, zh=zh, vi=vi, en=EN[n - 1], upper=up, lower=lo, meaning=meaning))
    return dict(trigrams=tri, hexagrams=hexes)


if __name__ == "__main__":
    data = records()
    # sanity: 64 distinct (upper, lower) pairs
    assert len({(h["upper"], h["lower"]) for h in data["hexagrams"]}) == 64
    out = Path(__file__).resolve().parent.parent / "src" / "iching-data.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf8")
    print(f"wrote {out}")
