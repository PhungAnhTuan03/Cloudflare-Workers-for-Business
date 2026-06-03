# Technology Training Website Blueprint

Ngay lap: 2026-06-03. Website tham khao: https://tinhocsaoviet.com.

## 1. Pham vi va nguyen tac

Muc tieu la thiet ke website trung tam dao tao cong nghe moi, hien dai hon, nhanh hon, SEO tot hon va co the mo rong thanh marketing site, cong tu van, CMS va lead management. Khong sao chep giao dien, bo cuc, noi dung hay hinh anh cua website tham khao.

Cac nhan dinh ve website tham khao dua tren noi dung cong khai: trang chu, trang khoa hoc, category tin tuc, robots.txt, sitemap redirect, subdomain hoc vien va tra cuu chung nhan. Cac phan ve admin/code/backend cua website tham khao la suy luan vi khong co quyen truy cap.

## 2. Phan tich website tham khao

Nguon quan sat chinh:
- Trang chu co day du cac cum: hero, danh muc khoa hoc, gioi thieu, ly do chon, thanh tich, giang vien, khoa hoc/kien thuc, danh gia, FAQ, footer va link tra cuu chung nhan.
- Trang chu cong bo 13 co so va hon 500,000 hoc vien; menu/danh muc gom nhieu nganh nhu tin hoc van phong, AI, AutoCAD, do hoa, ke toan, marketing, lap trinh.
- Trang khoa hoc ReactJS la dang bai viet dai, co muc luc, noi dung, hoc phi, dia diem dang ky, san pham hoc vien, loi ich, giang vien va feedback.
- Category tin tuc dang WordPress archive, co sidebar danh muc/tag va nhieu bai SEO.
- robots.txt cho thay dang dung Yoast SEO va sitemap_index.xml. Header HTTP trang chu tra ve LiteSpeed, cache-control no-cache/no-store; subdomain chung nhan co PHP 8.1.

### Header va menu da cap

Diem manh: menu phu day rong nhu cau tim khoa hoc, co dang nhap, lien ket he thong hoc vien, footer co thong tin lien he.

Diem yeu: menu qua dai, khong co uu tien theo intent; thieu course finder; cac taxonomy WordPress dan trai nghiem thanh danh sach lien ket lon. Mobile co nguy co qua tai.

De xuat moi: header 2 tang gon nhe: top utility (hotline, co so, hoc vien, tra cuu chung nhan), main nav (Khoa hoc, Lo trinh, Giang vien, Tin tuc, Lien he). Mega menu theo 5-7 nhom, moi nhom co 3 khoa hoc noi bat, CTA "Tu van lo trinh".

### Hero

Diem manh: noi duoc dinh vi dao tao thuc hanh, nhieu nganh, nhieu co so.

Diem yeu: thieu search/finder ngay hero; CTA chua tach ro "dang ky hoc" va "xem khoa hoc"; noi dung dai lam giam scan.

De xuat moi: hero tap trung mot thong diep, co search khoa hoc + bo loc muc tieu nghe nghiep/dia diem, CTA ro, stats ngan, visual rieng dang dashboard lop hoc/mentor khong dung hinh cu.

### Danh muc, khoa hoc noi bat va course detail

Diem manh: phu rong nganh nghe; co local landing page va bai hoc phi/lich khai giang.

Diem yeu: cau truc khoa hoc dang giong blog post, thieu data model chuan cho lich khai giang, hoc phi, outcomes, syllabus, giang vien, du an, FAQ. Kho de scale va tao Course JSON-LD nhat quan.

De xuat moi: tach `course_categories`, `courses`, `course_modules`, `cohorts`, `instructors`, `projects`, `faqs`, `reviews`, `locations`, `local_landing_pages`.

### Gioi thieu, ly do chon, giang vien, danh gia

Diem manh: co social proof manh, nhieu giang vien, thong ke, chinh sach hoc lai/bao luu tren subdomain hoc vien.

Diem yeu: noi dung lap lai, nhieu claim lon can kiem chung; profile giang vien chua gan voi khoa hoc/co so/kinh nghiem cu the; testimonial thieu anh that/nguon/metadata.

De xuat moi: moi giang vien co profile, chuyen mon, khoa phu trach, du an/hoc vien tieu bieu. Testimonial co khoa hoc, co so, ngay hoc, rating, anh da toi uu, optional video.

### FAQ, tin tuc, SEO local

Diem manh: co FAQ tren trang chu va nhieu bai SEO/local.

Diem yeu: FAQ qua dai tren trang chu; tin tuc/category dang archive WordPress can nhieu bai co chat luong hon, internal link ro hon; local SEO chua co template structured theo thanh pho/quan/phuong.

De xuat moi: FAQ ngan theo intent tren trang chu, FAQ rieng theo khoa hoc; blog hub theo topic cluster; local landing page theo cong thuc: khoa hoc + dia diem + lich khai giang + co so gan nhat + reviews dia phuong + FAQ local + schema LocalBusiness/Course.

### Form tu van, tra cuu chung nhan, cong hoc vien

Diem manh: co form tu van, subdomain hoc vien, subdomain tra cuu chung nhan.

Diem yeu: cac he thong co ve tach roi; form chua the hien pipeline CRM; chung nhan/hoc vien co kha nang la PHP rieng, can chuan hoa API va audit log.

De xuat moi: business API rieng cho lead, certificate verification, student portal SSO/link, admin pipeline. Public API contract on dinh, khong phu thuoc CMS API noi bo.

## 3. IA va user flow moi

Primary flows:
- Hoc vien tim khoa hoc: Home -> Finder -> Category/Course -> Schedule/Price -> Lead form -> Admission follow-up.
- Phu huynh/nguoi di lam can tu van: Home -> Tu van lo trinh -> Form -> Lead pipeline -> Email/Zalo/phone.
- Tra cuu chung nhan: Header/Footer -> Verify certificate -> Result printable.
- SEO visitor dia phuong: Local landing -> Course detail -> Cohort at nearest location -> Lead.
- Editor/admin: EmDash admin -> content publish -> public pages render server-side + cache hint -> sitemap update.

Can giu: nhom khoa hoc rong, social proof, nhieu co so, FAQ, blog/local SEO, hoc vien/chung nhan.

Can lam moi: layout, course model, search/finder, lead tracking, structured data, performance/caching, admin roles.

Can bo: menu qua dai khong phan cap theo intent, noi dung lap lai, page khoa hoc dang bai viet khong co data contract, cache no-store cho public HTML neu khong can thiet.

## 4. He thong de xuat

Stack bat buoc:
- Frontend: Astro 6, React 19, TypeScript, Tailwind CSS 4, Motion/Framer Motion, Swiper.
- Backend: Cloudflare Workers/Astro server routes.
- Database: Cloudflare D1.
- Storage: Cloudflare R2.
- Email: Resend.
- Authentication: Better Auth.
- CMS: EmDash CMS.

Boundary:
- Public website: Astro SSR pages, EmDash content collections, server-rendered, cache with `Astro.cache.set(cacheHint)`.
- CMS/editorial: `/_emdash/admin`, roles admin/editor.
- Business API: `/api/business/*`, stable public/admin contract for leads, cohorts, certificates, CRM actions.
- Auth/session: Better Auth for admin/admission staff/student link. EmDash admin auth can stay separate if required, but business API should validate roles through a shared auth adapter/session.

## 5. Cau truc thu muc de xuat

```txt
src/
  components/
    marketing/
    courses/
    instructors/
    lead/
    seo/
  layouts/
    Base.astro
    CourseLayout.astro
  lib/
    business-api.ts
    seo.ts
    schema-org.ts
    auth.ts
  pages/
    index.astro
    gioi-thieu.astro
    khoa-hoc/index.astro
    khoa-hoc/[slug].astro
    giang-vien/index.astro
    tin-tuc/index.astro
    tin-tuc/[slug].astro
    lien-he.astro
    dang-ky-tu-van.astro
    tra-cuu-chung-nhan.astro
    hoc-vien.astro
    chi-nhanh/[slug].astro
    dia-phuong/[location]/[course].astro
    api/business/*.ts
seed/seed.json
migrations/
docs/
```

## 6. D1 schema business core

Business tables nen nam rieng voi EmDash schema: `leads`, `lead_events`, `locations`, `course_business_profiles`, `cohorts`, `certificates`, `student_portal_links`, `audit_logs`. File migration kem theo: `migrations/0004_business_core.sql`.

## 7. Wireframe

Home:
```txt
[Utility bar: Hotline | Co so | Hoc vien | Tra cuu]
[Header: Logo | Khoa hoc mega | Lo trinh | Giang vien | Tin tuc | Lien he | CTA]
[Hero: H1 + subtitle + Search/Finder + CTA Dang ky hoc + CTA Xem khoa hoc + stats + visual]
[Course categories grid]
[Featured courses carousel/cards]
[Why choose us: 4 proofs]
[Learning pathways: beginner -> job-ready]
[Instructors slider]
[Testimonials]
[FAQ accordion]
[Blog latest]
[Lead form band]
[Footer]
```

Course detail:
```txt
[Breadcrumb]
[Course hero: title, outcomes, price from, next cohorts, CTA]
[Mobile sticky CTA]
[Objectives | Audience | Output skills]
[Syllabus accordion]
[Roadmap timeline]
[Instructor]
[Projects]
[Schedule table]
[Tuition and policies]
[Certificate]
[FAQ + Feedback]
[Lead form]
```

Other pages:
- About: mission, method, facilities, milestones, partners, CTA.
- Course category: finder, filters, cards, comparison.
- Instructors: filter by domain, profile cards.
- News: topic clusters, latest, local SEO hub.
- Contact: branches map/list, hotline, form.
- Certificate lookup: code + phone/email optional, result.
- Student portal: login/link-out/SSO notice, support contacts.
- Branch: address, map, courses available, cohorts, reviews, local FAQ.
- Local landing: course + district/province + nearest branches + schema + CTA.

## 8. Design system

Tokens:
- `--color-primary: #2563EB`
- `--color-secondary: #0EA5E9`
- `--color-accent: #F59E0B`
- `--color-ink: #0F172A`
- `--color-muted: #64748B`
- `--color-surface: #FFFFFF`
- `--color-soft: #F8FAFC`
- Radius: 8px cards, 12px major panels only when needed.
- Type: display `Inter Tight` or `Plus Jakarta Sans`; body `Inter`.
- Spacing: 4/8/12/16/24/32/48/64.

Component map:
- `Header`, `MegaMenu`, `MobileNav`, `CourseFinder`, `StatsStrip`, `CategoryGrid`, `CourseCard`, `InstructorCard`, `ReviewCarousel`, `FAQAccordion`, `LeadForm`, `BranchSelector`, `ScheduleTable`, `TuitionPanel`, `CertificateLookup`, `Breadcrumbs`, `JsonLd`, `SeoHead`, `StickyMobileCta`.

## 9. SEO plan

Moi page co meta title, description, canonical, OG/Twitter, breadcrumb, internal links. Sitemap dynamic cho course/category/blog/location/local landing. Robots allow public, disallow admin/API nhay cam. JSON-LD:
- Home/About: `Organization`, `LocalBusiness` summary.
- Course detail: `Course`, `FAQPage`, `BreadcrumbList`.
- Blog: `Article`, `BreadcrumbList`.
- Branch/local: `LocalBusiness`, `Course`, `FAQPage`.

Core Web Vitals:
- Astro SSR islands only for finder/carousel/form.
- Images via R2 + responsive transforms, lazy load below fold.
- Cache public HTML with stale-while-revalidate when content cache hint allows.
- Avoid heavy animation; Motion only for entrance/micro-interactions.
- Swiper only on sections needing touch carousel.

## 10. API contract

Public:
- `POST /api/business/leads` tao lead tu form tu van.
- `GET /api/business/courses/:slug/cohorts` lay lich khai giang.
- `GET /api/business/certificates/verify?code=...` tra cuu chung nhan.
- `GET /api/business/student-portal/link` lay link cong hoc vien.

Admin/admission:
- `GET /api/business/admin/leads`
- `PATCH /api/business/admin/leads/:id`
- `POST /api/business/admin/leads/:id/events`

Security:
- Public form co honeypot, validation, IP, rate limit KV/CACHE.
- Admin endpoints require Better Auth session + role `admin` hoac `admission`.
- Audit lead status changes.

## 11. Roadmap

MVP:
- Design system, home, category, course detail, lead form, certificate lookup, branch pages, basic blog, D1 lead/cohort/certificate.

Production:
- Better Auth roles, CRM board, Resend templates, sitemap automation, local landing generator, analytics/conversion events, A/B CTA, R2 media workflow.

Scale:
- Multi-campus scheduling, course bundles, student SSO, automation lead scoring, dashboards, course recommendation, multi-brand/domain.

## 12. Cloudflare deployment

Checklist:
- D1 migrations applied.
- R2 bucket media configured.
- KV namespaces for cache/session/rate limit.
- Resend domain verified, DKIM/SPF set.
- Better Auth secret/session configured.
- `SITE_URL`, `ADMIN_EMAIL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` set.
- `npm run typecheck`, `npm run build`.
- `wrangler deploy`.
- Verify `/`, `/khoa-hoc`, course detail, `/api/business/leads`, certificate lookup, sitemap, robots, admin.

## 13. Pre-deploy checklist

- No cloned image/content/layout from reference.
- All CMS pages SSR, no `getStaticPaths()` for CMS content.
- All CMS queries call `Astro.cache.set(cacheHint)`.
- Course detail has CTA, mobile sticky CTA, JSON-LD Course/FAQ/Breadcrumb.
- Lead form writes D1 and sends Resend notification.
- Admin lead APIs protected.
- Certificate verify does not expose private student data.
- Sitemap and robots correct.
- Lighthouse mobile: LCP under 2.5s target, CLS under 0.1, INP under 200ms.
- 404/500 pages, monitoring and rollback plan ready.
