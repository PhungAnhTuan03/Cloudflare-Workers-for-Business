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

export const site = {
	name: "Sao Việt Tech Academy",
	shortName: "Sao Việt",
	description:
		"Trung tâm đào tạo công nghệ thực chiến: tin học văn phòng, AI, lập trình, thiết kế đồ họa, AutoCAD và Digital Marketing.",
	url: "https://my-business.phungtuan23122003.workers.dev",
	email: "phungtuan23122003@gmail.com",
	phone: "1900 6369",
	address: "145 Lê Duẩn, phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
};

export const stats = [
	{ value: "20K+", label: "học viên đã học" },
	{ value: "42", label: "khóa học thực chiến" },
	{ value: "35+", label: "giảng viên mentor" },
	{ value: "92%", label: "hoàn thành mục tiêu" },
];

export const courseCategories: CourseCategory[] = [
	{
		id: "office",
		title: "Tin học văn phòng",
		description: "Excel, Word, PowerPoint, MOS và kỹ năng số cho công việc hằng ngày.",
		icon: "fa-solid fa-file-excel",
		href: "/khoa-hoc?field=office",
		accent: "#2563EB",
	},
	{
		id: "ai",
		title: "AI ứng dụng",
		description: "Prompt engineering, tự động hóa công việc, phân tích dữ liệu với AI.",
		icon: "fa-solid fa-wand-magic-sparkles",
		href: "/khoa-hoc?field=ai",
		accent: "#8B5CF6",
	},
	{
		id: "programming",
		title: "Lập trình",
		description: "Python, Web Fullstack, JavaScript, API và triển khai sản phẩm thật.",
		icon: "fa-solid fa-code",
		href: "/khoa-hoc?field=programming",
		accent: "#0EA5E9",
	},
	{
		id: "design",
		title: "Thiết kế đồ họa",
		description: "Photoshop, Illustrator, UI cơ bản, portfolio và quy trình thiết kế.",
		icon: "fa-solid fa-pen-nib",
		href: "/khoa-hoc?field=design",
		accent: "#F59E0B",
	},
	{
		id: "autocad",
		title: "AutoCAD",
		description: "Bản vẽ kỹ thuật 2D/3D, thực hành theo tiêu chuẩn doanh nghiệp.",
		icon: "fa-solid fa-drafting-compass",
		href: "/khoa-hoc?field=autocad",
		accent: "#10B981",
	},
	{
		id: "marketing",
		title: "Digital Marketing",
		description: "SEO, quảng cáo, analytics, landing page và chiến dịch tăng trưởng.",
		icon: "fa-solid fa-chart-line",
		href: "/khoa-hoc?field=marketing",
		accent: "#EF4444",
	},
];

export const instructors: Instructor[] = [
	{
		id: "minh-khoa",
		name: "Nguyễn Minh Khoa",
		role: "Lead Instructor - Web & AI",
		experience: "12 năm kinh nghiệm",
		bio: "Từng dẫn dắt đội sản phẩm tại startup SaaS, chuyên đào tạo lập trình theo dự án thật.",
		image:
			"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
		skills: ["Astro", "React", "Node.js", "AI Automation"],
	},
	{
		id: "thu-ha",
		name: "Trần Thu Hà",
		role: "MOS Expert - Office Productivity",
		experience: "10 năm kinh nghiệm",
		bio: "Chuyên gia Excel và phân tích dữ liệu văn phòng, đã đào tạo nhiều nhóm doanh nghiệp.",
		image:
			"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
		skills: ["Excel", "Power BI", "MOS", "Business Reporting"],
	},
	{
		id: "anh-quan",
		name: "Lê Anh Quân",
		role: "Creative Mentor - Design & CAD",
		experience: "9 năm kinh nghiệm",
		bio: "Mentor thiết kế đồ họa và AutoCAD, tập trung vào portfolio và quy trình thực chiến.",
		image:
			"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
		skills: ["Photoshop", "Illustrator", "AutoCAD", "Brand Design"],
	},
];

export const courses: Course[] = [
	{
		slug: "tin-hoc-van-phong-chuyen-nghiep",
		categoryId: "office",
		title: "Tin học văn phòng chuyên nghiệp",
		shortTitle: "Office Pro",
		description:
			"Làm chủ Word, Excel, PowerPoint và quy trình báo cáo hiện đại để tăng hiệu suất làm việc.",
		image:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
		price: "2.890.000đ",
		duration: "8 tuần",
		students: "3.200+",
		rating: "4.9",
		level: "Cơ bản đến nâng cao",
		lessons: 32,
		instructorId: "thu-ha",
		outcomes: [
			"Tạo báo cáo Excel sạch, nhanh và dễ bảo trì.",
			"Thiết kế slide thuyết trình chuyên nghiệp.",
			"Nắm quy trình xử lý tài liệu văn phòng theo chuẩn doanh nghiệp.",
			"Sẵn sàng luyện thi chứng chỉ MOS.",
		],
		audience: [
			"Sinh viên chuẩn bị đi làm.",
			"Nhân viên hành chính, kế toán, nhân sự.",
			"Người muốn nâng cấp kỹ năng văn phòng trong thời gian ngắn.",
		],
		curriculum: [
			{ title: "Nền tảng làm việc số", lessons: ["Quản lý file", "Phím tắt", "Quy trình dữ liệu"] },
			{ title: "Excel thực chiến", lessons: ["Hàm phổ biến", "Pivot Table", "Dashboard mini"] },
			{ title: "Word và PowerPoint", lessons: ["Tài liệu chuẩn", "Slide kể chuyện", "Thuyết trình"] },
		],
		projects: ["Bộ báo cáo Excel theo phòng ban", "Slide proposal 10 trang"],
		faqs: [
			{ question: "Tôi chưa biết Excel có học được không?", answer: "Được. Khóa học bắt đầu từ nền tảng và tăng dần độ khó qua bài tập." },
			{ question: "Có hỗ trợ sau khóa học không?", answer: "Có. Học viên được hỗ trợ trong nhóm mentor và nhận bộ tài liệu cập nhật." },
		],
	},
	{
		slug: "ai-ung-dung-cong-viec",
		categoryId: "ai",
		title: "AI ứng dụng cho công việc",
		shortTitle: "AI Productivity",
		description:
			"Sử dụng AI để viết nội dung, phân tích dữ liệu, tự động hóa tác vụ và xây workflow cá nhân.",
		image:
			"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
		price: "3.490.000đ",
		duration: "6 tuần",
		students: "1.450+",
		rating: "4.8",
		level: "Ứng dụng",
		lessons: 24,
		instructorId: "minh-khoa",
		outcomes: [
			"Viết prompt rõ mục tiêu và kiểm soát đầu ra.",
			"Tự động hóa quy trình email, báo cáo, nghiên cứu.",
			"Kết hợp AI với bảng tính và công cụ no-code.",
			"Xây bộ trợ lý cá nhân cho công việc.",
		],
		audience: ["Nhân sự văn phòng", "Marketer", "Chủ doanh nghiệp nhỏ", "Sinh viên"],
		curriculum: [
			{ title: "Prompt foundation", lessons: ["Cấu trúc prompt", "Vai trò và ngữ cảnh", "Đánh giá output"] },
			{ title: "AI workflow", lessons: ["Nghiên cứu", "Viết nội dung", "Phân tích dữ liệu"] },
			{ title: "Automation", lessons: ["No-code automation", "Checklist bảo mật", "Dự án cuối khóa"] },
		],
		projects: ["AI workflow tạo báo cáo tuần", "Bộ prompt cá nhân hóa theo vị trí"],
		faqs: [
			{ question: "Khóa này có cần biết lập trình không?", answer: "Không. Nội dung tập trung vào ứng dụng thực tế và công cụ phổ biến." },
			{ question: "Có học về bảo mật dữ liệu không?", answer: "Có. Khóa học có phần riêng về dữ liệu nhạy cảm và cách dùng AI an toàn." },
		],
	},
	{
		slug: "lap-trinh-web-fullstack",
		categoryId: "programming",
		title: "Lập trình Web Fullstack",
		shortTitle: "Web Fullstack",
		description:
			"Học HTML, CSS, TypeScript, React, API và triển khai ứng dụng thực tế trên Cloudflare.",
		image:
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
		price: "5.490.000đ",
		duration: "16 tuần",
		students: "2.100+",
		rating: "4.9",
		level: "Từ cơ bản",
		lessons: 64,
		instructorId: "minh-khoa",
		outcomes: [
			"Xây website responsive chuẩn SEO.",
			"Tạo API, form, database và deploy production.",
			"Nắm tư duy component, state và TypeScript.",
			"Có portfolio dự án để ứng tuyển.",
		],
		audience: ["Người mới học lập trình", "Sinh viên CNTT", "Designer muốn chuyển sang frontend"],
		curriculum: [
			{ title: "Frontend foundation", lessons: ["HTML/CSS", "Responsive UI", "JavaScript"] },
			{ title: "React & Astro", lessons: ["Component", "Routing", "SEO & performance"] },
			{ title: "Backend & deploy", lessons: ["API routes", "D1 database", "Cloudflare Workers"] },
		],
		projects: ["Landing page đào tạo", "Dashboard mini", "Website khóa học có form lead"],
		faqs: [
			{ question: "Có cần laptop cấu hình cao không?", answer: "Không. Laptop phổ thông chạy VS Code và trình duyệt là đủ." },
			{ question: "Khóa này có hỗ trợ xin việc không?", answer: "Có review CV, GitHub và mock interview ở giai đoạn cuối." },
		],
	},
	{
		slug: "thiet-ke-do-hoa-thuc-chien",
		categoryId: "design",
		title: "Thiết kế đồ họa thực chiến",
		shortTitle: "Graphic Design",
		description:
			"Làm chủ Photoshop, Illustrator, layout, màu sắc và xây portfolio thương hiệu cá nhân.",
		image:
			"https://images.unsplash.com/photo-1602576666092-bf6447a729fc?auto=format&fit=crop&w=1200&q=80",
		price: "3.290.000đ",
		duration: "10 tuần",
		students: "1.800+",
		rating: "4.8",
		level: "Cơ bản",
		lessons: 40,
		instructorId: "anh-quan",
		outcomes: [
			"Thiết kế poster, banner, social post đúng brief.",
			"Nắm nguyên lý layout, màu sắc, typography.",
			"Tạo portfolio 6 sản phẩm hoàn chỉnh.",
			"Làm việc theo quy trình nhận brief và phản hồi.",
		],
		audience: ["Người mới học thiết kế", "Marketer", "Freelancer", "Chủ shop online"],
		curriculum: [
			{ title: "Design foundation", lessons: ["Bố cục", "Màu sắc", "Typography"] },
			{ title: "Tools", lessons: ["Photoshop", "Illustrator", "Asset workflow"] },
			{ title: "Portfolio", lessons: ["Brand kit", "Social campaign", "Mockup"] },
		],
		projects: ["Bộ nhận diện mini", "Chiến dịch social 5 bài", "Poster sự kiện"],
		faqs: [
			{ question: "Tôi không biết vẽ có học được không?", answer: "Có. Khóa này tập trung vào thiết kế ứng dụng, không yêu cầu vẽ tay." },
			{ question: "Có cần mua Adobe bản quyền ngay không?", answer: "Mentor sẽ tư vấn công cụ phù hợp trước buổi học đầu tiên." },
		],
	},
	{
		slug: "autocad-2d-3d-ky-thuat",
		categoryId: "autocad",
		title: "AutoCAD 2D/3D kỹ thuật",
		shortTitle: "AutoCAD",
		description:
			"Thực hành bản vẽ kỹ thuật, layout, layer, in ấn và tiêu chuẩn bàn giao hồ sơ.",
		image:
			"https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
		price: "3.690.000đ",
		duration: "12 tuần",
		students: "980+",
		rating: "4.7",
		level: "Cơ bản đến trung cấp",
		lessons: 36,
		instructorId: "anh-quan",
		outcomes: [
			"Đọc và dựng bản vẽ kỹ thuật 2D.",
			"Quản lý layer, block, dimension chuẩn.",
			"Tạo layout in ấn và bàn giao file.",
			"Thực hành mô hình 3D cơ bản.",
		],
		audience: ["Sinh viên kỹ thuật", "Kỹ sư mới ra trường", "Người làm nội thất/xây dựng"],
		curriculum: [
			{ title: "CAD foundation", lessons: ["Giao diện", "Lệnh vẽ", "Layer"] },
			{ title: "Technical drawing", lessons: ["Dimension", "Block", "Layout"] },
			{ title: "3D basics", lessons: ["Model", "View", "Bàn giao file"] },
		],
		projects: ["Bản vẽ mặt bằng", "Hồ sơ layout in ấn", "Mô hình kỹ thuật đơn giản"],
		faqs: [
			{ question: "Có học online được không?", answer: "Có. Bài thực hành được review qua file và buổi mentor trực tuyến." },
			{ question: "Có cấp chứng chỉ không?", answer: "Có chứng nhận hoàn thành sau khi đạt đồ án cuối khóa." },
		],
	},
	{
		slug: "digital-marketing-performance",
		categoryId: "marketing",
		title: "Digital Marketing Performance",
		shortTitle: "Digital Marketing",
		description:
			"Xây chiến lược SEO, quảng cáo, tracking và tối ưu landing page theo mục tiêu kinh doanh.",
		image:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
		price: "4.290.000đ",
		duration: "10 tuần",
		students: "1.260+",
		rating: "4.8",
		level: "Ứng dụng",
		lessons: 38,
		instructorId: "minh-khoa",
		outcomes: [
			"Thiết kế funnel và landing page rõ CTA.",
			"Nắm SEO on-page, content plan và tracking.",
			"Đọc chỉ số quảng cáo để tối ưu ngân sách.",
			"Xây chiến dịch mẫu cho sản phẩm thật.",
		],
		audience: ["Marketer mới vào nghề", "Chủ shop", "Nhân viên kinh doanh", "Freelancer"],
		curriculum: [
			{ title: "Marketing foundation", lessons: ["Persona", "Funnel", "Offer"] },
			{ title: "SEO & content", lessons: ["Keyword", "On-page", "Content calendar"] },
			{ title: "Performance", lessons: ["Tracking", "Ads metrics", "Landing optimization"] },
		],
		projects: ["Marketing plan 30 ngày", "Landing page tư vấn", "Dashboard chỉ số chiến dịch"],
		faqs: [
			{ question: "Có cần chạy ads bằng tiền thật không?", answer: "Không bắt buộc. Học viên có thể dùng case mô phỏng hoặc ngân sách nhỏ." },
			{ question: "Có học SEO kỹ thuật không?", answer: "Có phần SEO on-page, technical checklist và đo lường bằng công cụ phổ biến." },
		],
	},
];

export const reasons = [
	{
		title: "Học bằng dự án thật",
		description: "Mỗi khóa có bài thực hành theo tình huống doanh nghiệp, không chỉ xem slide.",
		icon: "fa-solid fa-laptop-code",
	},
	{
		title: "Mentor theo sát",
		description: "Giảng viên review bài, gợi ý sửa và định hướng portfolio sau từng module.",
		icon: "fa-solid fa-user-check",
	},
	{
		title: "Cam kết đầu ra rõ",
		description: "Mục tiêu, tiêu chí đánh giá và sản phẩm cuối khóa được công bố từ đầu.",
		icon: "fa-solid fa-bullseye",
	},
	{
		title: "Hỗ trợ trọn đời",
		description: "Cộng đồng học viên, tài liệu cập nhật và buổi workshop định kỳ sau khóa học.",
		icon: "fa-solid fa-life-ring",
	},
];

export const roadmap = [
	{ step: "01", title: "Tư vấn lộ trình", description: "Đánh giá mục tiêu, trình độ hiện tại và thời gian học phù hợp." },
	{ step: "02", title: "Học nền tảng", description: "Nắm công cụ, nguyên lý và quy trình làm việc chuẩn." },
	{ step: "03", title: "Làm dự án", description: "Thực hành theo brief thật, có mentor review từng vòng." },
	{ step: "04", title: "Hoàn thiện hồ sơ", description: "Chốt portfolio, chứng chỉ, CV và kế hoạch phát triển tiếp theo." },
];

export const testimonials = [
	{
		name: "Nguyễn Thị Hương",
		role: "Nhân viên hành chính",
		content:
			"Khóa Office giúp tôi làm báo cáo nhanh hơn rất nhiều. Mentor sửa bài kỹ và chỉ cách dùng Excel đúng trong công việc.",
		rating: "5.0",
	},
	{
		name: "Lê Văn An",
		role: "Frontend Developer",
		content:
			"Tôi bắt đầu từ con số 0. Sau khóa Web Fullstack, tôi có 3 dự án trong portfolio và tự tin phỏng vấn hơn.",
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
		slug: "hoc-ai-hieu-qua-cho-dan-van-phong",
		title: "Học AI thế nào để tăng hiệu suất công việc văn phòng?",
		description: "Cách chọn công cụ, viết prompt và kiểm soát dữ liệu khi dùng AI trong công việc.",
		category: "AI",
		date: "02/06/2026",
		image:
			"https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
	},
	{
		slug: "lo-trinh-hoc-web-fullstack",
		title: "Lộ trình học Web Fullstack cho người mới trong 16 tuần",
		description: "Từ HTML/CSS đến deploy sản phẩm thật: học gì trước, luyện gì sau.",
		category: "Lập trình",
		date: "28/05/2026",
		image:
			"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
	},
	{
		slug: "portfolio-thiet-ke-do-hoa",
		title: "Portfolio thiết kế đồ họa cần có gì để thuyết phục khách hàng?",
		description: "Cách chọn dự án, trình bày case study và tránh lỗi phổ biến khi làm portfolio.",
		category: "Thiết kế",
		date: "20/05/2026",
		image:
			"https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
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
