INSERT OR IGNORE INTO business_locations
	(slug, name, address, province, district, phone, email, is_active, created_at, updated_at)
VALUES
	('gia-dinh-le-truc', 'Cơ sở Gia Định - Lê Trực', '21/8 Lê Trực, phường Gia Định, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Gia Định', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('tan-hung-le-van-luong', 'Cơ sở Tân Hưng - Lê Văn Lương', '515 B2/12 Lê Văn Lương, phường Tân Hưng, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Tân Hưng', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('an-lac-kinh-duong-vuong', 'Cơ sở An Lạc - Kinh Dương Vương', 'Phòng TM-0.39, 510 Kinh Dương Vương, phường An Lạc, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'An Lạc', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('thoi-an-le-thi-rieng', 'Cơ sở Thới An - Lê Thị Riêng', 'A23 Lê Thị Riêng, KDC Thới An, phường Thới An, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Thới An', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('thu-duc-do-xuan-hop', 'Cơ sở Thủ Đức - Đỗ Xuân Hợp', '133/2 Đỗ Xuân Hợp, phường Phước Long, TP. Thủ Đức, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Thủ Đức', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('tan-binh-pham-van-bach', 'Cơ sở Tân Bình - Phạm Văn Bạch', '180 Phạm Văn Bạch, phường Tân Bình, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Tân Bình', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('thu-dau-mot-phu-hoa', 'Cơ sở Thủ Dầu Một - Phú Hòa', '107 D5, KDC Phú Hòa 1, khu 4, phường Thủ Dầu Một', 'Bình Dương', 'Thủ Dầu Một', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('thuan-giao-viet-sing', 'Cơ sở Thuận Giao - Viet Sing', '8 đường NA8, KDC Viet Sing, phường Thuận Giao', 'Bình Dương', 'Thuận Giao', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('di-an-dang-van-may', 'Cơ sở Dĩ An - Đặng Văn Mây', '184/19/11 Đặng Văn Mây, KP Đông Chiêu, phường Dĩ An', 'Bình Dương', 'Dĩ An', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('tan-khanh-tan-hoa', 'Cơ sở Tân Khánh - Tân Hóa', '30 tổ 3, KP Tân Hóa, phường Tân Khánh', 'Bình Dương', 'Tân Khánh', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('tam-hiep-doan-van-cu', 'Cơ sở Biên Hòa - Đoàn Văn Cự', '91 Đoàn Văn Cự, phường Tam Hiệp, Đồng Nai', 'Đồng Nai', 'Biên Hòa', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('long-thanh-dinh-bo-linh', 'Cơ sở Long Thành - Đinh Bộ Lĩnh', '72 Đinh Bộ Lĩnh, xã Long Thành, Đồng Nai', 'Đồng Nai', 'Long Thành', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('vung-tau-binh-gia', 'Cơ sở Vũng Tàu - Bình Giã', '293 Bình Giã, phường Tam Thắng, Vũng Tàu', 'Vũng Tàu', 'Tam Thắng', '093 114 48 58', 'trungtamtinhocsaoviet@gmail.com', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO business_course_profiles
	(course_slug, category_slug, price_from, price_note, duration_note, level, certificate_name, is_featured, created_at, updated_at)
VALUES
	('tin-hoc-van-phong-thuc-hanh', 'office', 2900000, 'Học phí theo lớp và cấp độ', '1 - 3 tháng', 'Cơ bản đến nâng cao', 'Chứng nhận Tin học văn phòng thực hành', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('autocad-2d-3d-ban-ve-ky-thuat', 'technical', 3700000, 'Học phí theo lớp 2D/3D', '8 - 12 tuần', 'Cơ bản đến trung cấp', 'Chứng nhận AutoCAD thực hành', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('thiet-ke-do-hoa-ung-dung', 'design', 3300000, 'Bao gồm bài tập portfolio', '10 tuần', 'Cơ bản', 'Chứng nhận Thiết kế đồ họa ứng dụng', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('ke-toan-tong-hop-thuc-hanh', 'accounting', 3900000, 'Học phí theo lớp kế toán tổng hợp', '2 - 3 tháng', 'Cơ bản đến thực hành', 'Chứng nhận Kế toán tổng hợp thực hành', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('lap-trinh-python-scratch-cho-tre-em', 'programming', 2800000, 'Học phí theo nhóm tuổi', '8 tuần', 'Cơ bản', 'Chứng nhận Lập trình thiếu nhi', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('ai-ung-dung-van-phong', 'ai', 3500000, 'Học phí theo lớp ứng dụng', '6 tuần', 'Ứng dụng', 'Chứng nhận AI ứng dụng văn phòng', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('digital-marketing-seo-ads', 'marketing', 4300000, 'Học phí theo module SEO/Ads', '10 tuần', 'Ứng dụng', 'Chứng nhận Digital Marketing thực chiến', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('luyen-thi-mos-ic3', 'certificate', 3200000, 'Học phí theo chứng chỉ', '6 - 8 tuần', 'Luyện thi', 'Chứng nhận luyện thi MOS/IC3', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO business_cohorts
	(course_slug, location_slug, instructor_slug, start_date, schedule_label, shift, seats_total, seats_left, price, status, created_at, updated_at)
VALUES
	('tin-hoc-van-phong-thuc-hanh', 'gia-dinh-le-truc', 'bach-hien', '2026-06-22', 'Thứ 2/4/6, 18:00 - 20:30', 'evening', 18, 8, 2900000, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('autocad-2d-3d-ban-ve-ky-thuat', 'thu-duc-do-xuan-hop', 'khai-pham', '2026-06-24', 'Thứ 3/5/7, 18:00 - 20:30', 'evening', 16, 6, 3700000, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('thiet-ke-do-hoa-ung-dung', 'tan-binh-pham-van-bach', 'nhi-nguyen', '2026-06-29', 'Thứ 2/4/6, 13:30 - 16:30', 'afternoon', 16, 9, 3300000, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('ke-toan-tong-hop-thuc-hanh', 'tan-hung-le-van-luong', 'thieu-hong', '2026-07-01', 'Thứ 3/5, 18:00 - 20:30', 'evening', 20, 12, 3900000, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('ai-ung-dung-van-phong', 'gia-dinh-le-truc', 'dinh-khai', '2026-07-06', 'Thứ 2/4, 19:00 - 21:00', 'evening', 24, 14, 3500000, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO business_student_portal_links
	(label, url, is_primary, is_active, created_at, updated_at)
VALUES
	('Cổng học viên', 'https://hocvien.tinhocsaoviet.com', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('Tra cứu chứng nhận', '/tra-cuu-chung-nhan', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
