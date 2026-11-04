Offline data / Dữ liệu ngoại tuyến

EN: This folder holds the reading dataset v4.0 (77 files year-1950 … year-2026.jsonl.zst, about 2 MB each, 161 MB in total).
You don't need them: lookup_reading.py downloads each year from GitHub the first time it's used and checks its SHA-256.
To work fully offline (or where GitHub is blocked), run once:

    python3 scripts/lookup_reading.py --download-all

Source: https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d (CC BY 4.0; Ni Haixia quotes inside are CC BY-NC-SA 4.0).

VI: Thư mục này chứa bộ dữ liệu luận giải v4.0 (77 tệp year-1950 … year-2026.jsonl.zst, khoảng 2 MB mỗi tệp, tổng 161 MB).
Không bắt buộc: lookup_reading.py tự tải từng năm từ GitHub ở lần dùng đầu tiên và kiểm tra mã SHA-256.
Muốn dùng hoàn toàn ngoại tuyến (hoặc nơi chặn GitHub), chạy một lần:

    python3 scripts/lookup_reading.py --download-all

Nguồn: https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d (CC BY 4.0; lời trích Nghê Hải Hạ bên trong theo CC BY-NC-SA 4.0).
