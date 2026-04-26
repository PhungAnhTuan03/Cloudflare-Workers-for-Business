Xây dựng Website Doanh Nghiệp Miễn Phí
trên Cloudflare Workers bằng EmDash + Astro

Hướng dẫn đầy đủ từ website tĩnh đến hệ thống Frontend – Backend API – Database, triển khai hoàn toàn miễn phí trên Cloudflare.

Giới thiệu: EmDash + Astro là gì?
EmDash CMS
CMS mã nguồn mở của Cloudflare
Xây trên Astro 6
Có admin panel quản lý nội dung
Thay thế hiện đại cho WordPress
Astro 6
Framework web hiệu suất cao
Render HTML tĩnh mặc định
Hỗ trợ Islands Architecture → chỉ load JS khi cần
Cloudflare Workers
Nền tảng serverless toàn cầu
310+ edge location
100,000 requests/ngày miễn phí
Passkey Auth
Đăng nhập không cần mật khẩu
Dùng Touch ID / Face ID / Windows Hello
Tính năng nổi bật của EmDash
Visual Schema Builder
Rich Text Editor (TipTap)
Media Library
Navigation Menus
Taxonomies (category, tag)
Preview System
WordPress Import
MCP Support (AI integration)

👉 EmDash dùng Astro Live Content Collections → cập nhật nội dung realtime, không cần rebuild site.

Tài nguyên miễn phí trên Cloudflare
Dịch vụ	Free Tier	Dùng cho
Workers	100,000 req/ngày	Backend, SSR
Pages	500 builds/tháng	Hosting
D1	5GB	Database
R2	10GB	File storage
KV	1GB	Cache, session
SSL	Free	HTTPS
Bandwidth	Unlimited	Traffic

👉 Website nhỏ (~1k–5k users/ngày) → free tier đủ dùng

OPTION 1 — Website Tĩnh
1. Mô tả

Website doanh nghiệp tĩnh sử dụng:

Astro (generate HTML)
EmDash (CMS)
Cloudflare Pages (hosting)

👉 Toàn bộ site render sẵn → cực nhanh

2. Mục tiêu
Chi phí = 0
SEO tốt
PageSpeed ≥ 95
Dễ quản lý nội dung
Có thể nâng cấp sau
3. Kiến trúc

Visitor → CDN → HTML cache → trả về ngay
Admin → /_emdash/admin → D1 → cập nhật nội dung

4. Công nghệ
Astro 6
EmDash CMS
Tailwind CSS
TypeScript
Cloudflare Pages
D1 / KV / R2
5. Chức năng
Trang chủ
Trang dịch vụ
Blog
Giới thiệu
Liên hệ
Admin CMS
6. Triển khai
Cài Node.js + Wrangler

Tạo project:

npm create emdash@latest

Tạo DB:

wrangler d1 create

Chạy:

npm run dev

Deploy:

npm run deploy
7. Mở rộng
Thêm API (form liên hệ)
Thêm email
Chuyển sang SSR
Thêm auth / e-commerce
8. Kết luận

👉 Phù hợp:

Landing page
Blog
Website doanh nghiệp nhỏ
OPTION 2 — Full Stack (Frontend + Backend + Database)
1. Mô tả

Hệ thống đầy đủ gồm:

Frontend: Astro + EmDash
Backend: Cloudflare Workers
Database: D1 + KV + R2
2. Mục tiêu
Xây dựng web 3 tầng
Có API động
Có database
Có thể mở rộng mobile
3. Kiến trúc

Client → Frontend (Astro)
→ API (Workers)
→ Database (D1 / KV / R2)

4. Công nghệ
Astro (hybrid rendering)
EmDash CMS
Cloudflare Workers
D1 (SQLite)
KV (cache)
R2 (storage)
5. Chức năng
Form liên hệ (lưu DB + email)
Đăng ký tư vấn
Blog CMS
Trang dịch vụ
Upload media
Admin dashboard
6. API thiết kế
POST /api/contact
POST /api/consultation
GET /api/posts
GET /api/services
POST /api/upload
7. Database
Tables:
contacts
consultations
services
posts
Lưu trữ:
D1 → dữ liệu chính
KV → session, cache
R2 → file
8. Triển khai

Enable hybrid:

output: 'hybrid'

Tạo DB:

wrangler d1 create

Tạo storage:

wrangler r2 bucket create

Secret:

wrangler secret put

Deploy:

npm run deploy
9. Ưu điểm
Edge computing (rất nhanh)
Auto scaling
Bảo mật Cloudflare
AI-ready
10. Kết luận

👉 Phù hợp:

Web app
CRM mini
Đồ án fullstack
Startup
