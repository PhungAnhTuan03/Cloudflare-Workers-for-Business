export type CourseCategory = {
	id: string;
	title: string;
	description: string;
	icon: string;
	href: string;
	accent: string;
};

export type Instructor = {
	id: string;
	name: string;
	role: string;
	experience: string;
	bio: string;
	image: string;
	skills: string[];
};

export type Location = {
	slug: string;
	name: string;
	address: string;
	province: string;
	district?: string;
	phone: string;
	email: string;
};

export type Course = {
	slug: string;
	categoryId: string;
	title: string;
	shortTitle: string;
	description: string;
	image: string;
	price: string;
	duration: string;
	students: string;
	rating: string;
	level: string;
	lessons: number;
	instructorId: string;
	outcomes: string[];
	audience: string[];
	curriculum: { title: string; lessons: string[] }[];
	projects: string[];
	faqs: { question: string; answer: string }[];
};

const commonFaqs = [
	{
		question: "Trung tâm có lớp buổi tối hoặc cuối tuần không?",
		answer:
			"Có. Lịch học được chia theo ca sáng, chiều, tối và cuối tuần để phù hợp với người đi làm, sinh viên và học viên ở xa.",
	},
	{
		question: "Học xong có chứng nhận không?",
		answer:
			"Học viên hoàn thành bài tập, dự án hoặc bài kiểm tra cuối khóa sẽ được cấp chứng nhận hoàn thành và có thể tra cứu trên hệ thống.",
	},
];

export const site = {
	name: "Sao Việt Tech Academy",
	shortName: "Sao Việt",
	description:
		"Trung tâm đào tạo công nghệ thực chiến: tin học văn phòng, AI, lập trình, thiết kế đồ họa, vẽ kỹ thuật, kế toán và Digital Marketing.",
	url: "https://my-business.phungtuan23122003.workers.dev",
	email: "trungtamtinhocsaoviet@gmail.com",
	phone: "093 114 48 58",
	address: "21/8 Lê Trực, phường Gia Định, TP. Hồ Chí Minh",
};

export const stats = [
	{ value: "500K+", label: "học viên đã tham gia" },
	{ value: "100+", label: "khóa học và giáo trình" },
	{ value: "13", label: "cơ sở đào tạo" },
	{ value: "15K+", label: "doanh nghiệp đối tác" },
];

export const courseCategories: CourseCategory[] = [
	{
		id: "office",
		title: "Tin học văn phòng",
		description: "Word, Excel, PowerPoint, MOS, IC3 và kỹ năng số cho công việc hằng ngày.",
		icon: "fa-solid fa-file-excel",
		href: "/khoa-hoc?field=office",
		accent: "#2563EB",
	},
	{
		id: "ai",
		title: "AI ứng dụng",
		description: "Ứng dụng trí tuệ nhân tạo vào báo cáo, nội dung, phân tích dữ liệu và tự động hóa.",
		icon: "fa-solid fa-wand-magic-sparkles",
		href: "/khoa-hoc?field=ai",
		accent: "#0EA5E9",
	},
	{
		id: "technical",
		title: "Vẽ kỹ thuật",
		description: "AutoCAD 2D/3D, SolidWorks, SketchUp, Revit, 3ds Max và quy trình bản vẽ.",
		icon: "fa-solid fa-drafting-compass",
		href: "/khoa-hoc?field=technical",
		accent: "#10B981",
	},
	{
		id: "design",
		title: "Thiết kế đồ họa",
		description: "Photoshop, Illustrator, CorelDraw, Premiere, After Effects và portfolio thực tế.",
		icon: "fa-solid fa-pen-nib",
		href: "/khoa-hoc?field=design",
		accent: "#F59E0B",
	},
	{
		id: "accounting",
		title: "Kế toán thực hành",
		description: "Kế toán tổng hợp, kế toán thuế, sổ sách trên Excel, MISA và chứng từ thực tế.",
		icon: "fa-solid fa-calculator",
		href: "/khoa-hoc?field=accounting",
		accent: "#EF4444",
	},
	{
		id: "programming",
		title: "Lập trình",
		description: "Python, Scratch, web căn bản, website ứng dụng và tư duy lập trình cho người mới.",
		icon: "fa-solid fa-code",
		href: "/khoa-hoc?field=programming",
		accent: "#7C3AED",
	},
	{
		id: "marketing",
		title: "Digital Marketing",
		description: "SEO, quảng cáo Google, Facebook, TikTok, tracking và tối ưu landing page.",
		icon: "fa-solid fa-chart-line",
		href: "/khoa-hoc?field=marketing",
		accent: "#F97316",
	},
	{
		id: "certificate",
		title: "MOS và IC3",
		description: "Luyện thi chứng chỉ tin học quốc tế theo năng lực và mục tiêu đầu ra.",
		icon: "fa-solid fa-certificate",
		href: "/khoa-hoc?field=certificate",
		accent: "#14B8A6",
	},
];

export const instructors: Instructor[] = [
	{
		id: "bach-hien",
		name: "Thầy Bạch Hiến",
		role: "Tin học văn phòng",
		experience: "10+ năm đào tạo",
		bio: "Mentor chuyên xây dựng lộ trình Word, Excel, PowerPoint cho người đi làm và nhóm doanh nghiệp.",
		image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
		skills: ["Excel", "Word", "PowerPoint", "MOS"],
	},
	{
		id: "huy-hoang",
		name: "Thầy Huy Hoàng",
		role: "Công nghệ thông tin và MOS",
		experience: "5+ năm giảng dạy",
		bio: "Phụ trách các lớp kỹ năng số, luyện thi chứng chỉ và chuẩn hóa năng lực tin học văn phòng.",
		image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
		skills: ["MOS", "IC3", "Computer Skills", "Excel"],
	},
	{
		id: "dinh-khai",
		name: "Thầy Đình Khải",
		role: "Tin học ứng dụng",
		experience: "10+ năm kinh nghiệm",
		bio: "Hướng dẫn học viên nền tảng máy tính, quy trình làm việc số và kỹ năng thực hành theo tình huống.",
		image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
		skills: ["Office", "Google Sheets", "Power Query", "VBA"],
	},
	{
		id: "thieu-hong",
		name: "Cô Thiều Hồng",
		role: "Kế toán tổng hợp",
		experience: "Kế toán trưởng doanh nghiệp",
		bio: "Thiết kế bài học kế toán dựa trên chứng từ, nghiệp vụ và quy trình xử lý hồ sơ thực tế.",
		image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80",
		skills: ["Kế toán tổng hợp", "Kế toán thuế", "MISA", "Excel"],
	},
	{
		id: "hong-le",
		name: "Cô Hồng Lê",
		role: "Kế toán thực hành",
		experience: "10+ năm tư vấn kế toán",
		bio: "Tập trung vào nghiệp vụ kế toán cho người mới bắt đầu và cách xử lý sổ sách trong doanh nghiệp.",
		image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
		skills: ["Thuế", "Sổ sách", "Excel kế toán", "MISA"],
	},
	{
		id: "hung-tran",
		name: "Thầy Hùng Trần",
		role: "Lập trình",
		experience: "5+ năm phát triển ứng dụng",
		bio: "Dạy lập trình qua sản phẩm nhỏ, giúp học viên hiểu tư duy thuật toán, web và app căn bản.",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
		skills: ["Python", "Scratch", "Web", "App"],
	},
	{
		id: "khai-pham",
		name: "Thầy Khải Phạm",
		role: "Vẽ kỹ thuật",
		experience: "Kỹ sư triển khai dự án",
		bio: "Hướng dẫn AutoCAD, SketchUp và SolidWorks theo quy trình bản vẽ, layout và bàn giao hồ sơ.",
		image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
		skills: ["AutoCAD", "SolidWorks", "SketchUp", "Revit"],
	},
	{
		id: "nhi-nguyen",
		name: "Cô Nhi Nguyễn",
		role: "Thiết kế đồ họa",
		experience: "5+ năm đào tạo thiết kế",
		bio: "Mentor các lớp Photoshop, Illustrator, CorelDraw và tư duy portfolio ứng dụng cho thương hiệu.",
		image: "https://images.unsplash.com/photo-1602576666092-bf6447a729fc?auto=format&fit=crop&w=800&q=80",
		skills: ["Photoshop", "Illustrator", "CorelDraw", "Premiere"],
	},
	{
		id: "dinh-dang",
		name: "Thầy Đinh Đăng",
		role: "Thiết kế nội thất",
		experience: "Chuyên gia dựng phối cảnh",
		bio: "Phụ trách SketchUp, Vray, AutoCAD và quy trình trình bày hồ sơ thiết kế nội thất.",
		image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
		skills: ["SketchUp", "Vray", "AutoCAD", "Enscape"],
	},
	{
		id: "thanh-nhon",
		name: "Thầy Thành Nhơn",
		role: "Thiết kế đồ họa",
		experience: "Mentor thẩm mỹ ứng dụng",
		bio: "Tập trung vào tư duy bố cục, màu sắc, nhận diện và cách trình bày sản phẩm thiết kế chuyên nghiệp.",
		image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
		skills: ["Brand Design", "Layout", "Typography", "Portfolio"],
	},
];

export const locations: Location[] = [
	{
		slug: "gia-dinh-le-truc",
		name: "Cơ sở Gia Định - Lê Trực",
		address: "21/8 Lê Trực, phường Gia Định, TP. Hồ Chí Minh",
		province: "TP. Hồ Chí Minh",
		district: "Gia Định",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "tan-hung-le-van-luong",
		name: "Cơ sở Tân Hưng - Lê Văn Lương",
		address: "515 B2/12 Lê Văn Lương, phường Tân Hưng, TP. Hồ Chí Minh",
		province: "TP. Hồ Chí Minh",
		district: "Tân Hưng",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "an-lac-kinh-duong-vuong",
		name: "Cơ sở An Lạc - Kinh Dương Vương",
		address: "Phòng TM-0.39, 510 Kinh Dương Vương, phường An Lạc, TP. Hồ Chí Minh",
		province: "TP. Hồ Chí Minh",
		district: "An Lạc",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "thoi-an-le-thi-rieng",
		name: "Cơ sở Thới An - Lê Thị Riêng",
		address: "A23 Lê Thị Riêng, KDC Thới An, phường Thới An, TP. Hồ Chí Minh",
		province: "TP. Hồ Chí Minh",
		district: "Thới An",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "thu-duc-do-xuan-hop",
		name: "Cơ sở Thủ Đức - Đỗ Xuân Hợp",
		address: "133/2 Đỗ Xuân Hợp, phường Phước Long, TP. Thủ Đức, TP. Hồ Chí Minh",
		province: "TP. Hồ Chí Minh",
		district: "Thủ Đức",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "tan-binh-pham-van-bach",
		name: "Cơ sở Tân Bình - Phạm Văn Bạch",
		address: "180 Phạm Văn Bạch, phường Tân Bình, TP. Hồ Chí Minh",
		province: "TP. Hồ Chí Minh",
		district: "Tân Bình",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "thu-dau-mot-phu-hoa",
		name: "Cơ sở Thủ Dầu Một - Phú Hòa",
		address: "107 D5, KDC Phú Hòa 1, khu 4, phường Thủ Dầu Một",
		province: "Bình Dương",
		district: "Thủ Dầu Một",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "thuan-giao-viet-sing",
		name: "Cơ sở Thuận Giao - Viet Sing",
		address: "8 đường NA8, KDC Viet Sing, phường Thuận Giao",
		province: "Bình Dương",
		district: "Thuận Giao",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "di-an-dang-van-may",
		name: "Cơ sở Dĩ An - Đặng Văn Mây",
		address: "184/19/11 Đặng Văn Mây, KP Đông Chiêu, phường Dĩ An",
		province: "Bình Dương",
		district: "Dĩ An",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "tan-khanh-tan-hoa",
		name: "Cơ sở Tân Khánh - Tân Hóa",
		address: "30 tổ 3, KP Tân Hóa, phường Tân Khánh",
		province: "Bình Dương",
		district: "Tân Khánh",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "tam-hiep-doan-van-cu",
		name: "Cơ sở Biên Hòa - Đoàn Văn Cự",
		address: "91 Đoàn Văn Cự, phường Tam Hiệp, Đồng Nai",
		province: "Đồng Nai",
		district: "Biên Hòa",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "long-thanh-dinh-bo-linh",
		name: "Cơ sở Long Thành - Đinh Bộ Lĩnh",
		address: "72 Đinh Bộ Lĩnh, xã Long Thành, Đồng Nai",
		province: "Đồng Nai",
		district: "Long Thành",
		phone: site.phone,
		email: site.email,
	},
	{
		slug: "vung-tau-binh-gia",
		name: "Cơ sở Vũng Tàu - Bình Giã",
		address: "293 Bình Giã, phường Tam Thắng, Vũng Tàu",
		province: "Vũng Tàu",
		district: "Tam Thắng",
		phone: site.phone,
		email: site.email,
	},
];

export const courses: Course[] = [
	{
		slug: "tin-hoc-van-phong-thuc-hanh",
		categoryId: "office",
		title: "Tin học văn phòng thực hành",
		shortTitle: "Office Practical",
		description:
			"Nắm chắc Word, Excel, PowerPoint, quy trình xử lý tài liệu và báo cáo văn phòng theo tình huống công việc.",
		image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
		price: "2.900.000đ",
		duration: "1 - 3 tháng",
		students: "120K+",
		rating: "4.9",
		level: "Cơ bản đến nâng cao",
		lessons: 36,
		instructorId: "bach-hien",
		outcomes: [
			"Tự tin dùng Word, Excel, PowerPoint trong môi trường văn phòng.",
			"Tạo báo cáo, bảng tính, biểu mẫu và slide trình bày chuyên nghiệp.",
			"Nắm nền tảng để luyện thi MOS hoặc chứng chỉ ứng dụng CNTT.",
			"Biết tổ chức file, chuẩn hóa dữ liệu và làm việc nhanh hơn bằng phím tắt.",
		],
		audience: [
			"Sinh viên chuẩn bị đi làm.",
			"Nhân viên hành chính, kế toán, nhân sự, kinh doanh.",
			"Người mất gốc tin học cần học lại bài bản.",
		],
		curriculum: [
			{ title: "Máy tính và quản lý dữ liệu", lessons: ["Quản lý file", "Phím tắt", "Làm việc với dữ liệu"] },
			{ title: "Word và PowerPoint", lessons: ["Soạn thảo chuẩn", "Mẫu biểu", "Slide thuyết trình"] },
			{ title: "Excel thực hành", lessons: ["Hàm thông dụng", "Pivot Table", "Dashboard báo cáo"] },
		],
		projects: ["Bộ biểu mẫu văn phòng", "Báo cáo Excel theo phòng ban", "Slide đề xuất 10 trang"],
		faqs: [
			{
				question: "Chưa biết Excel có học được không?",
				answer: "Có. Khóa học bắt đầu từ thao tác nền tảng rồi tăng dần độ khó theo bài tập thực tế.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "autocad-2d-3d-ban-ve-ky-thuat",
		categoryId: "technical",
		title: "AutoCAD 2D/3D bản vẽ kỹ thuật",
		shortTitle: "AutoCAD 2D/3D",
		description:
			"Học AutoCAD qua bản vẽ kỹ thuật, layer, block, dimension, layout in ấn và bài tập bàn giao hồ sơ.",
		image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
		price: "3.700.000đ",
		duration: "8 - 12 tuần",
		students: "38K+",
		rating: "4.8",
		level: "Cơ bản đến trung cấp",
		lessons: 34,
		instructorId: "khai-pham",
		outcomes: [
			"Đọc và dựng bản vẽ kỹ thuật 2D theo tiêu chuẩn.",
			"Sử dụng layer, block, dimension và layout in ấn đúng quy trình.",
			"Biết dựng mô hình 3D cơ bản và xuất file bàn giao.",
			"Có sản phẩm bản vẽ cuối khóa để đưa vào hồ sơ năng lực.",
		],
		audience: ["Sinh viên kỹ thuật", "Kỹ sư mới ra trường", "Người làm xây dựng, cơ khí, nội thất"],
		curriculum: [
			{ title: "Nền tảng CAD", lessons: ["Giao diện", "Lệnh vẽ", "Layer và block"] },
			{ title: "Hồ sơ kỹ thuật", lessons: ["Dimension", "Layout", "In ấn và kiểm lỗi"] },
			{ title: "3D căn bản", lessons: ["Model", "View", "Xuất file bàn giao"] },
		],
		projects: ["Bản vẽ mặt bằng", "Hồ sơ layout in ấn", "Mô hình kỹ thuật đơn giản"],
		faqs: [
			{
				question: "Có cần biết vẽ kỹ thuật trước không?",
				answer: "Không bắt buộc. Mentor sẽ hướng dẫn cách đọc bản vẽ và thao tác phần mềm từ đầu.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "thiet-ke-do-hoa-ung-dung",
		categoryId: "design",
		title: "Thiết kế đồ họa ứng dụng",
		shortTitle: "Graphic Design",
		description:
			"Làm chủ Photoshop, Illustrator, CorelDraw và quy trình thiết kế banner, poster, social post, portfolio.",
		image: "https://images.unsplash.com/photo-1602576666092-bf6447a729fc?auto=format&fit=crop&w=1200&q=80",
		price: "3.300.000đ",
		duration: "10 tuần",
		students: "52K+",
		rating: "4.8",
		level: "Cơ bản",
		lessons: 40,
		instructorId: "nhi-nguyen",
		outcomes: [
			"Thiết kế poster, banner, social post đúng brief.",
			"Nắm nguyên lý bố cục, màu sắc và typography.",
			"Biết xử lý ảnh, vector, file in ấn và file digital.",
			"Hoàn thiện portfolio 6 sản phẩm ứng dụng.",
		],
		audience: ["Người mới học thiết kế", "Marketer", "Freelancer", "Chủ shop online"],
		curriculum: [
			{ title: "Nền tảng thiết kế", lessons: ["Bố cục", "Màu sắc", "Typography"] },
			{ title: "Công cụ", lessons: ["Photoshop", "Illustrator", "CorelDraw"] },
			{ title: "Portfolio", lessons: ["Brand kit", "Social campaign", "Mockup"] },
		],
		projects: ["Bộ nhận diện mini", "Chiến dịch social 5 bài", "Poster sự kiện"],
		faqs: [
			{
				question: "Không biết vẽ tay có học được không?",
				answer: "Có. Khóa này tập trung vào thiết kế ứng dụng và quy trình làm việc với công cụ số.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "ke-toan-tong-hop-thuc-hanh",
		categoryId: "accounting",
		title: "Kế toán tổng hợp thực hành",
		shortTitle: "Accounting",
		description:
			"Học kế toán căn bản, kế toán thuế, sổ sách trên Excel/MISA và xử lý chứng từ theo tình huống doanh nghiệp.",
		image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
		price: "3.900.000đ",
		duration: "2 - 3 tháng",
		students: "46K+",
		rating: "4.8",
		level: "Cơ bản đến thực hành",
		lessons: 42,
		instructorId: "thieu-hong",
		outcomes: [
			"Nắm quy trình kế toán tổng hợp và chứng từ đầu vào/đầu ra.",
			"Biết hạch toán nghiệp vụ phổ biến, lập sổ sách và báo cáo.",
			"Thực hành trên Excel và phần mềm kế toán.",
			"Hiểu các mốc công việc liên quan đến kê khai thuế.",
		],
		audience: ["Người mới học kế toán", "Sinh viên kế toán", "Nhân sự muốn chuyển nghề", "Chủ hộ kinh doanh"],
		curriculum: [
			{ title: "Nền tảng kế toán", lessons: ["Tài khoản", "Chứng từ", "Định khoản"] },
			{ title: "Thực hành doanh nghiệp", lessons: ["Mua bán", "Lương", "Kho và công nợ"] },
			{ title: "Thuế và báo cáo", lessons: ["Kê khai", "Sổ sách", "Báo cáo cuối kỳ"] },
		],
		projects: ["Bộ chứng từ doanh nghiệp mẫu", "Sổ kế toán trên Excel", "Bài tổng hợp cuối khóa"],
		faqs: [
			{
				question: "Người chưa học kế toán bao giờ có theo được không?",
				answer: "Có. Lộ trình đi từ nguyên lý, chứng từ rồi mới sang tình huống thực hành.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "lap-trinh-python-scratch-cho-tre-em",
		categoryId: "programming",
		title: "Lập trình Python và Scratch cho trẻ em",
		shortTitle: "Kids Coding",
		description:
			"Khơi gợi tư duy lập trình qua Scratch, Python, bài tập game nhỏ và sản phẩm trình bày cuối khóa.",
		image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
		price: "2.800.000đ",
		duration: "8 tuần",
		students: "24K+",
		rating: "4.9",
		level: "Cơ bản",
		lessons: 28,
		instructorId: "hung-tran",
		outcomes: [
			"Hiểu tư duy thuật toán qua hình ảnh và trò chơi.",
			"Tạo sản phẩm Scratch có nhân vật, điều kiện và điểm số.",
			"Làm quen Python qua biến, điều kiện, vòng lặp.",
			"Rèn khả năng trình bày ý tưởng và sửa lỗi.",
		],
		audience: ["Học sinh tiểu học", "Học sinh THCS", "Phụ huynh muốn con học công nghệ có định hướng"],
		curriculum: [
			{ title: "Scratch foundation", lessons: ["Nhân vật", "Sự kiện", "Game mini"] },
			{ title: "Tư duy thuật toán", lessons: ["Điều kiện", "Vòng lặp", "Biến"] },
			{ title: "Python nhập môn", lessons: ["Cú pháp", "Bài tập nhỏ", "Demo sản phẩm"] },
		],
		projects: ["Game mê cung Scratch", "Ứng dụng tính điểm", "Demo Python mini"],
		faqs: [
			{
				question: "Trẻ cần biết tiếng Anh trước không?",
				answer: "Không bắt buộc. Giảng viên giải thích bằng tiếng Việt và dùng từ khóa tiếng Anh theo từng bước.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "ai-ung-dung-van-phong",
		categoryId: "ai",
		title: "AI ứng dụng cho công việc văn phòng",
		shortTitle: "AI Productivity",
		description:
			"Sử dụng AI để viết nội dung, phân tích dữ liệu, tóm tắt tài liệu, tạo báo cáo và tự động hóa tác vụ.",
		image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
		price: "3.500.000đ",
		duration: "6 tuần",
		students: "18K+",
		rating: "4.8",
		level: "Ứng dụng",
		lessons: 24,
		instructorId: "dinh-khai",
		outcomes: [
			"Viết prompt rõ mục tiêu và kiểm soát đầu ra.",
			"Kết hợp AI với bảng tính, email, tài liệu và báo cáo.",
			"Biết dùng AI an toàn với dữ liệu công việc.",
			"Xây workflow cá nhân để tiết kiệm thời gian lặp lại.",
		],
		audience: ["Nhân sự văn phòng", "Marketer", "Quản lý nhóm nhỏ", "Sinh viên chuẩn bị đi làm"],
		curriculum: [
			{ title: "Prompt foundation", lessons: ["Vai trò", "Ngữ cảnh", "Tiêu chí đánh giá"] },
			{ title: "AI workflow", lessons: ["Nội dung", "Báo cáo", "Phân tích dữ liệu"] },
			{ title: "Automation", lessons: ["Checklist", "Mẫu quy trình", "Dự án cuối khóa"] },
		],
		projects: ["AI workflow tạo báo cáo tuần", "Bộ prompt cá nhân hóa theo vị trí"],
		faqs: [
			{
				question: "Khóa này có cần biết lập trình không?",
				answer: "Không. Nội dung tập trung vào ứng dụng thực tế và công cụ phổ biến cho công việc văn phòng.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "digital-marketing-seo-ads",
		categoryId: "marketing",
		title: "Digital Marketing: SEO và quảng cáo",
		shortTitle: "Digital Marketing",
		description:
			"Xây chiến lược SEO, quảng cáo Google/Facebook/TikTok, tracking và tối ưu landing page theo chuyển đổi.",
		image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
		price: "4.300.000đ",
		duration: "10 tuần",
		students: "21K+",
		rating: "4.8",
		level: "Ứng dụng",
		lessons: 38,
		instructorId: "thanh-nhon",
		outcomes: [
			"Thiết kế funnel và landing page rõ CTA.",
			"Nắm SEO on-page, content plan và tracking.",
			"Đọc chỉ số quảng cáo để tối ưu ngân sách.",
			"Xây chiến dịch mẫu cho sản phẩm thật.",
		],
		audience: ["Marketer mới vào nghề", "Chủ shop", "Nhân viên kinh doanh", "Freelancer"],
		curriculum: [
			{ title: "Marketing foundation", lessons: ["Persona", "Funnel", "Offer"] },
			{ title: "SEO và content", lessons: ["Keyword", "On-page", "Content calendar"] },
			{ title: "Performance", lessons: ["Tracking", "Ads metrics", "Landing optimization"] },
		],
		projects: ["Marketing plan 30 ngày", "Landing page tư vấn", "Dashboard chỉ số chiến dịch"],
		faqs: [
			{
				question: "Có cần chạy ads bằng tiền thật không?",
				answer: "Không bắt buộc. Học viên có thể dùng case mô phỏng hoặc ngân sách nhỏ nếu muốn thực hành sâu.",
			},
			...commonFaqs,
		],
	},
	{
		slug: "luyen-thi-mos-ic3",
		categoryId: "certificate",
		title: "Luyện thi MOS và IC3",
		shortTitle: "MOS & IC3",
		description:
			"Ôn tập theo bộ kỹ năng tin học quốc tế, luyện bài thi mô phỏng và chuẩn hóa kỹ năng trước kỳ thi.",
		image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
		price: "3.200.000đ",
		duration: "6 - 8 tuần",
		students: "32K+",
		rating: "4.9",
		level: "Luyện thi",
		lessons: 30,
		instructorId: "huy-hoang",
		outcomes: [
			"Nắm cấu trúc bài thi MOS/IC3 và kỹ năng cần đạt.",
			"Luyện thao tác Word, Excel, PowerPoint theo dạng đề.",
			"Nhận checklist lỗi thường gặp trước khi thi.",
			"Biết cách tự ôn và đánh giá điểm mạnh/yếu.",
		],
		audience: ["Học sinh, sinh viên cần chứng chỉ", "Người đi làm cần chuẩn hóa hồ sơ", "Nhóm doanh nghiệp"],
		curriculum: [
			{ title: "Cấu trúc chứng chỉ", lessons: ["MOS", "IC3", "Mục tiêu điểm số"] },
			{ title: "Luyện kỹ năng", lessons: ["Word", "Excel", "PowerPoint"] },
			{ title: "Thi thử", lessons: ["Bài mô phỏng", "Sửa lỗi", "Kế hoạch ôn tập"] },
		],
		projects: ["Bộ đề thi thử", "Checklist thao tác nhanh", "Lộ trình ôn cá nhân"],
		faqs: [
			{
				question: "Trung tâm có tư vấn chứng chỉ phù hợp không?",
				answer: "Có. Tư vấn viên sẽ hỏi mục tiêu học tập hoặc yêu cầu hồ sơ để gợi ý chứng chỉ phù hợp.",
			},
			...commonFaqs,
		],
	},
];

export const reasons = [
	{
		title: "Lộ trình học theo mục tiêu",
		description: "Tư vấn viên phân loại nhu cầu trước khi vào lớp để học viên chọn đúng cấp độ và thời lượng.",
		icon: "fa-solid fa-route",
	},
	{
		title: "Thực hành chiếm trọng tâm",
		description: "Bài học bám sát công việc: báo cáo, bản vẽ, chứng từ, portfolio hoặc chiến dịch marketing.",
		icon: "fa-solid fa-laptop-code",
	},
	{
		title: "Mentor theo sát",
		description: "Giảng viên sửa bài, góp ý quy trình và giúp học viên hiểu tiêu chuẩn bàn giao sản phẩm.",
		icon: "fa-solid fa-user-check",
	},
	{
		title: "Nhiều cơ sở, dễ chọn lịch",
		description: "Mạng lưới cơ sở tại TP. Hồ Chí Minh, Bình Dương, Đồng Nai và Vũng Tàu giúp học viên học gần nơi ở.",
		icon: "fa-solid fa-location-dot",
	},
];

export const roadmap = [
	{ step: "01", title: "Tư vấn đầu vào", description: "Xác định mục tiêu, trình độ hiện tại, địa điểm học và khung giờ phù hợp." },
	{ step: "02", title: "Học nền tảng", description: "Nắm công cụ, thuật ngữ và quy trình làm việc chuẩn của từng lĩnh vực." },
	{ step: "03", title: "Thực hành có mentor", description: "Làm bài tập theo tình huống thật, được nhận xét và sửa lỗi theo từng module." },
	{ step: "04", title: "Hoàn thiện đầu ra", description: "Hoàn thành bài kiểm tra, dự án, chứng nhận hoặc portfolio để dùng ngay trong công việc." },
];

export const testimonials = [
	{
		name: "Nguyễn Thị Hương",
		role: "Nhân viên hành chính",
		content:
			"Khóa Office giúp tôi làm báo cáo nhanh hơn nhiều. Mentor sửa bài kỹ và chỉ cách dùng Excel đúng trong công việc.",
		rating: "5.0",
	},
	{
		name: "Lê Văn An",
		role: "Kỹ thuật viên CAD",
		content:
			"Tôi học AutoCAD từ đầu và sau khóa đã tự dựng được bộ bản vẽ cơ bản để nộp cho công ty.",
		rating: "4.9",
	},
	{
		name: "Phạm Minh Trang",
		role: "Freelance Designer",
		content:
			"Phần portfolio cuối khóa rất đáng giá. Tôi dùng luôn bộ sản phẩm đó để nhận khách freelance đầu tiên.",
		rating: "4.9",
	},
];

export const articles = [
	{
		slug: "lo-trinh-hoc-tin-hoc-van-phong",
		title: "Lộ trình học tin học văn phòng cho người đi làm",
		description: "Cách chọn cấp độ Word, Excel, PowerPoint, MOS và thời lượng học phù hợp với mục tiêu công việc.",
		category: "Tin học văn phòng",
		date: "08/06/2026",
		image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
	},
	{
		slug: "hoc-autocad-cho-nguoi-moi",
		title: "Học AutoCAD cho người mới: nên bắt đầu từ đâu?",
		description: "Những kỹ năng nền tảng cần có trước khi học bản vẽ kỹ thuật, layout và hồ sơ bàn giao.",
		category: "Vẽ kỹ thuật",
		date: "02/06/2026",
		image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
	},
	{
		slug: "ung-dung-ai-trong-cong-viec",
		title: "Ứng dụng AI thế nào để tăng hiệu suất công việc văn phòng?",
		description: "Cách dùng prompt, kiểm soát dữ liệu và xây workflow AI an toàn cho cá nhân hoặc đội nhóm.",
		category: "AI",
		date: "28/05/2026",
		image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
	},
];

export function getCourseBySlug(slug?: string): Course | undefined {
	return courses.find((course) => course.slug === slug);
}

export function getCategoryById(id: string): CourseCategory | undefined {
	return courseCategories.find((category) => category.id === id);
}

export function getInstructorById(id: string): Instructor | undefined {
	return instructors.find((instructor) => instructor.id === id);
}

export function getLocationBySlug(slug?: string): Location | undefined {
	return locations.find((location) => location.slug === slug);
}
