import type { AuthUser } from "./auth";
import { ensureAuthSchema, getCurrentUser } from "./auth";
import { clean, publicId } from "./business-api";

export type InstructorCourse = {
	id: number;
	public_id: string;
	instructor_id: number;
	title: string;
	slug: string;
	description: string;
	price: number;
	currency: string;
	status: string;
	cover_url: string | null;
	created_at: string;
	updated_at: string;
};

export type ProfileView = {
	publicId: string;
	fullName: string;
	role: string;
	canViewFullProfile: boolean;
	headline: string | null;
	bio: string | null;
	avatarUrl: string | null;
	expertise: string | null;
	websiteUrl: string | null;
};

const schemaSql = [
	`CREATE TABLE IF NOT EXISTS user_profiles (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL UNIQUE,
		headline TEXT,
		bio TEXT,
		avatar_url TEXT,
		expertise TEXT,
		website_url TEXT,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`,
	`CREATE TABLE IF NOT EXISTS instructor_courses (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		public_id TEXT NOT NULL UNIQUE,
		instructor_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		slug TEXT NOT NULL UNIQUE,
		description TEXT NOT NULL,
		price INTEGER NOT NULL DEFAULT 0,
		currency TEXT NOT NULL DEFAULT 'VND',
		status TEXT NOT NULL DEFAULT 'draft',
		cover_url TEXT,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`,
	"CREATE INDEX IF NOT EXISTS idx_instructor_courses_instructor ON instructor_courses (instructor_id, created_at DESC);",
	"CREATE INDEX IF NOT EXISTS idx_instructor_courses_status ON instructor_courses (status, created_at DESC);",
	`CREATE TABLE IF NOT EXISTS course_lessons (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		course_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		sort_order INTEGER NOT NULL DEFAULT 0,
		status TEXT NOT NULL DEFAULT 'published',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`,
	"CREATE INDEX IF NOT EXISTS idx_course_lessons_course ON course_lessons (course_id, sort_order ASC);",
	`CREATE TABLE IF NOT EXISTS course_materials (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		course_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		file_url TEXT NOT NULL,
		file_type TEXT,
		sort_order INTEGER NOT NULL DEFAULT 0,
		status TEXT NOT NULL DEFAULT 'published',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`,
	"CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials (course_id, sort_order ASC);",
	`CREATE TABLE IF NOT EXISTS course_purchases (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		student_id INTEGER NOT NULL,
		course_id INTEGER NOT NULL,
		instructor_id INTEGER NOT NULL,
		status TEXT NOT NULL DEFAULT 'active',
		amount INTEGER NOT NULL DEFAULT 0,
		currency TEXT NOT NULL DEFAULT 'VND',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		UNIQUE (student_id, course_id)
	);`,
	"CREATE INDEX IF NOT EXISTS idx_course_purchases_student ON course_purchases (student_id, status);",
	"CREATE INDEX IF NOT EXISTS idx_course_purchases_instructor ON course_purchases (instructor_id, status);",
	`CREATE TABLE IF NOT EXISTS private_messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		course_id INTEGER NOT NULL,
		student_id INTEGER NOT NULL,
		instructor_id INTEGER NOT NULL,
		sender_id INTEGER NOT NULL,
		body TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`,
	"CREATE INDEX IF NOT EXISTS idx_private_messages_thread ON private_messages (course_id, student_id, instructor_id, created_at ASC);",
	`CREATE TABLE IF NOT EXISTS cart_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		course_id INTEGER NOT NULL,
		coupon_id INTEGER,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		UNIQUE (user_id, course_id)
	);`,
	"CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items (user_id, created_at DESC);",
	`CREATE TABLE IF NOT EXISTS coupons (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		code TEXT NOT NULL UNIQUE,
		course_id INTEGER,
		instructor_id INTEGER,
		discount_type TEXT NOT NULL DEFAULT 'percent',
		discount_value INTEGER NOT NULL DEFAULT 0,
		max_redemptions INTEGER,
		used_count INTEGER NOT NULL DEFAULT 0,
		starts_at TEXT,
		expires_at TEXT,
		status TEXT NOT NULL DEFAULT 'active',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`,
	"CREATE INDEX IF NOT EXISTS idx_coupons_code_status ON coupons (code, status);",
	"CREATE INDEX IF NOT EXISTS idx_coupons_course ON coupons (course_id, status);",
];

export async function ensureLearningSchema(db: D1Database): Promise<void> {
	await ensureAuthSchema(db);
	for (const sql of schemaSql) {
		await db.prepare(sql).run();
	}
}

export function slugify(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.slice(0, 80);
}

export async function requireCurrentUser(
	db: D1Database,
	kv: KVNamespace,
	request: Request,
): Promise<AuthUser> {
	const user = await getCurrentUser(db, kv, request);
	if (!user) throw new Error("Ban can dang nhap.");
	return user;
}

export function requireInstructor(user: AuthUser): void {
	if (user.role !== "instructor") {
		throw new Error("Chi giang vien moi duoc thuc hien thao tac nay.");
	}
}

export async function upsertProfile(
	db: D1Database,
	user: AuthUser,
	payload: {
		headline?: string;
		bio?: string;
		avatarUrl?: string;
		expertise?: string;
		websiteUrl?: string;
	},
) {
	await ensureLearningSchema(db);
	const now = new Date().toISOString();

	await db
		.prepare(
			`INSERT INTO user_profiles (user_id, headline, bio, avatar_url, expertise, website_url, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(user_id) DO UPDATE SET
				headline = excluded.headline,
				bio = excluded.bio,
				avatar_url = excluded.avatar_url,
				expertise = excluded.expertise,
				website_url = excluded.website_url,
				updated_at = excluded.updated_at`,
		)
		.bind(
			user.id,
			clean(payload.headline) || null,
			clean(payload.bio) || null,
			clean(payload.avatarUrl) || null,
			clean(payload.expertise) || null,
			clean(payload.websiteUrl) || null,
			now,
			now,
		)
		.run();

	return getProfileForViewer(db, user.public_id, user);
}

export async function hasPurchasedFromInstructor(
	db: D1Database,
	studentId: number,
	instructorId: number,
): Promise<boolean> {
	const purchase = await db
		.prepare(
			`SELECT id FROM course_purchases
			WHERE student_id = ? AND instructor_id = ? AND status = 'active'
			LIMIT 1`,
		)
		.bind(studentId, instructorId)
		.first();
	return Boolean(purchase);
}

export async function getProfileForViewer(
	db: D1Database,
	profilePublicId: string,
	viewer: AuthUser | null,
): Promise<ProfileView | null> {
	await ensureLearningSchema(db);

	const row = await db
		.prepare(
			`SELECT
				u.id, u.public_id, u.full_name, u.role,
				p.headline, p.bio, p.avatar_url, p.expertise, p.website_url
			FROM auth_users u
			LEFT JOIN user_profiles p ON p.user_id = u.id
			WHERE u.public_id = ? AND u.status = 'active'
			LIMIT 1`,
		)
		.bind(profilePublicId)
		.first<{
			id: number;
			public_id: string;
			full_name: string;
			role: string;
			headline: string | null;
			bio: string | null;
			avatar_url: string | null;
			expertise: string | null;
			website_url: string | null;
		}>();

	if (!row) return null;

	let canViewFullProfile =
		row.role !== "instructor" ||
		(viewer?.id === row.id) ||
		viewer?.role === "instructor";

	if (!canViewFullProfile && viewer?.role === "student") {
		canViewFullProfile = await hasPurchasedFromInstructor(db, viewer.id, row.id);
	}

	return {
		publicId: row.public_id,
		fullName: row.full_name,
		role: row.role,
		canViewFullProfile,
		headline: canViewFullProfile ? row.headline : null,
		bio: canViewFullProfile ? row.bio : null,
		avatarUrl: canViewFullProfile ? row.avatar_url : null,
		expertise: canViewFullProfile ? row.expertise : null,
		websiteUrl: canViewFullProfile ? row.website_url : null,
	};
}

export async function createInstructorCourse(
	db: D1Database,
	instructor: AuthUser,
	payload: {
		title?: string;
		description?: string;
		price?: number;
		status?: string;
		coverUrl?: string;
	},
): Promise<InstructorCourse> {
	await ensureLearningSchema(db);
	requireInstructor(instructor);

	const title = clean(payload.title);
	const description = clean(payload.description);
	if (title.length < 3) throw new Error("Ten khoa hoc can toi thieu 3 ky tu.");
	if (description.length < 10) throw new Error("Mo ta khoa hoc can toi thieu 10 ky tu.");

	const baseSlug = slugify(title) || publicId("course");
	const slug = `${baseSlug}-${Date.now().toString(36)}`;
	const now = new Date().toISOString();
	const id = publicId("course");
	const price = Math.max(0, Number(payload.price ?? 0));
	const status = clean(payload.status) === "published" ? "published" : "draft";

	await db
		.prepare(
			`INSERT INTO instructor_courses
			(public_id, instructor_id, title, slug, description, price, status, cover_url, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			id,
			instructor.id,
			title,
			slug,
			description,
			price,
			status,
			clean(payload.coverUrl) || null,
			now,
			now,
		)
		.run();

	const course = await getCourseByPublicId(db, id);
	if (!course) throw new Error("Khong tao duoc khoa hoc.");
	return course;
}

export async function getCourseByPublicId(
	db: D1Database,
	coursePublicId: string,
): Promise<InstructorCourse | null> {
	await ensureLearningSchema(db);
	return db
		.prepare("SELECT * FROM instructor_courses WHERE public_id = ? LIMIT 1")
		.bind(coursePublicId)
		.first<InstructorCourse>();
}

export async function getInstructorCourses(db: D1Database, instructorId: number) {
	await ensureLearningSchema(db);
	const { results } = await db
		.prepare("SELECT * FROM instructor_courses WHERE instructor_id = ? ORDER BY created_at DESC")
		.bind(instructorId)
		.all<InstructorCourse>();
	return results ?? [];
}

export async function updateInstructorCourseStatus(
	db: D1Database,
	instructor: AuthUser,
	coursePublicId: string,
	status: string,
) {
	await ensureLearningSchema(db);
	requireInstructor(instructor);
	const normalizedStatus = clean(status) === "published" ? "published" : "draft";

	const result = await db
		.prepare(
			`UPDATE instructor_courses
			SET status = ?, updated_at = ?
			WHERE public_id = ? AND instructor_id = ?`,
		)
		.bind(normalizedStatus, new Date().toISOString(), clean(coursePublicId), instructor.id)
		.run();

	if (!result.meta.changes) {
		throw new Error("Khong tim thay khoa hoc cua ban.");
	}

	return getCourseByPublicId(db, coursePublicId);
}

export async function getPublishedMarketplaceCourses(
	db: D1Database,
	filters: {
		q?: string;
		instructorId?: string;
		minPrice?: number;
		maxPrice?: number;
		sort?: string;
	} = {},
) {
	await ensureLearningSchema(db);
	const where = ["c.status = 'published'"];
	const binds: (string | number)[] = [];

	if (clean(filters.q)) {
		where.push("(c.title LIKE ? OR c.description LIKE ? OR u.full_name LIKE ?)");
		const q = `%${clean(filters.q)}%`;
		binds.push(q, q, q);
	}

	if (clean(filters.instructorId)) {
		where.push("u.public_id = ?");
		binds.push(clean(filters.instructorId));
	}

	if (Number.isFinite(filters.minPrice)) {
		where.push("c.price >= ?");
		binds.push(Number(filters.minPrice));
	}

	if (Number.isFinite(filters.maxPrice)) {
		where.push("c.price <= ?");
		binds.push(Number(filters.maxPrice));
	}

	const sort = clean(filters.sort);
	const orderBy =
		sort === "price_asc"
			? "c.price ASC"
			: sort === "price_desc"
				? "c.price DESC"
				: "c.created_at DESC";

	const { results } = await db
		.prepare(
			`SELECT c.*, u.public_id AS instructor_public_id, u.full_name AS instructor_name
			FROM instructor_courses c
			JOIN auth_users u ON u.id = c.instructor_id
			WHERE ${where.join(" AND ")}
			ORDER BY ${orderBy}
			LIMIT 50`,
		)
		.bind(...binds)
		.all();
	return results ?? [];
}

export async function addCourseToCart(db: D1Database, user: AuthUser, coursePublicId: string) {
	await ensureLearningSchema(db);
	const course = await getCourseByPublicId(db, coursePublicId);
	if (!course || course.status !== "published") throw new Error("Khong tim thay khoa hoc dang ban.");

	await db
		.prepare(
			`INSERT INTO cart_items (user_id, course_id, created_at)
			VALUES (?, ?, ?)
			ON CONFLICT(user_id, course_id) DO NOTHING`,
		)
		.bind(user.id, course.id, new Date().toISOString())
		.run();
}

export async function getCart(db: D1Database, user: AuthUser) {
	await ensureLearningSchema(db);
	const { results } = await db
		.prepare(
			`SELECT
				ci.id AS cart_item_id,
				c.public_id AS course_public_id,
				c.title,
				c.description,
				c.price,
				c.currency,
				u.full_name AS instructor_name,
				cp.code AS coupon_code,
				cp.discount_type,
				cp.discount_value
			FROM cart_items ci
			JOIN instructor_courses c ON c.id = ci.course_id
			JOIN auth_users u ON u.id = c.instructor_id
			LEFT JOIN coupons cp ON cp.id = ci.coupon_id
			WHERE ci.user_id = ?
			ORDER BY ci.created_at DESC`,
		)
		.bind(user.id)
		.all();

	return results ?? [];
}

export async function removeCartItem(db: D1Database, user: AuthUser, itemId: number) {
	await ensureLearningSchema(db);
	await db.prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?").bind(itemId, user.id).run();
}

export async function createInstructorCoupon(
	db: D1Database,
	instructor: AuthUser,
	payload: {
		code?: string;
		coursePublicId?: string;
		discountType?: string;
		discountValue?: number;
		maxRedemptions?: number;
		expiresAt?: string;
	},
) {
	await ensureLearningSchema(db);
	requireInstructor(instructor);

	const code = clean(payload.code).toUpperCase();
	if (!/^[A-Z0-9_-]{4,32}$/.test(code)) throw new Error("Ma coupon can 4-32 ky tu A-Z, 0-9, _ hoac -.");

	let courseId: number | null = null;
	if (clean(payload.coursePublicId)) {
		const course = await getCourseByPublicId(db, clean(payload.coursePublicId));
		if (!course || course.instructor_id !== instructor.id) throw new Error("Khong tim thay khoa hoc cua ban.");
		courseId = course.id;
	}

	const discountType = clean(payload.discountType) === "fixed" ? "fixed" : "percent";
	const discountValue = Math.max(0, Number(payload.discountValue ?? 0));
	if (!discountValue) throw new Error("Gia tri giam gia phai lon hon 0.");

	await db
		.prepare(
			`INSERT INTO coupons
			(code, course_id, instructor_id, discount_type, discount_value, max_redemptions, expires_at, status, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
		)
		.bind(
			code,
			courseId,
			instructor.id,
			discountType,
			discountValue,
			Number(payload.maxRedemptions ?? 0) || null,
			clean(payload.expiresAt) || null,
			new Date().toISOString(),
			new Date().toISOString(),
		)
		.run();
}

export async function validateCouponForCourse(db: D1Database, code: string, courseId: number) {
	await ensureLearningSchema(db);
	const now = new Date().toISOString();
	const coupon = await db
		.prepare(
			`SELECT * FROM coupons
			WHERE code = ? AND status = 'active'
				AND (course_id IS NULL OR course_id = ?)
				AND (starts_at IS NULL OR starts_at <= ?)
				AND (expires_at IS NULL OR expires_at >= ?)
				AND (max_redemptions IS NULL OR used_count < max_redemptions)
			ORDER BY course_id DESC
			LIMIT 1`,
		)
		.bind(clean(code).toUpperCase(), courseId, now, now)
		.first<{
			id: number;
			code: string;
			discount_type: string;
			discount_value: number;
		}>();

	return coupon ?? null;
}

export function discountedPrice(price: number, coupon?: { discount_type: string; discount_value: number } | null) {
	if (!coupon) return price;
	if (coupon.discount_type === "fixed") return Math.max(0, price - Number(coupon.discount_value));
	return Math.max(0, Math.round(price * (1 - Number(coupon.discount_value) / 100)));
}

export async function applyCouponToCart(db: D1Database, user: AuthUser, code: string) {
	await ensureLearningSchema(db);
	const items = await db
		.prepare(
			`SELECT ci.id AS cart_item_id, c.id AS course_id
			FROM cart_items ci
			JOIN instructor_courses c ON c.id = ci.course_id
			WHERE ci.user_id = ?`,
		)
		.bind(user.id)
		.all<{ cart_item_id: number; course_id: number }>();

	let applied = 0;
	for (const item of items.results ?? []) {
		const coupon = await validateCouponForCourse(db, code, item.course_id);
		if (coupon) {
			await db.prepare("UPDATE cart_items SET coupon_id = ? WHERE id = ?").bind(coupon.id, item.cart_item_id).run();
			applied += 1;
		}
	}

	if (!applied) throw new Error("Coupon khong hop le voi cac khoa hoc trong gio.");
}

export async function checkoutCart(db: D1Database, user: AuthUser) {
	await ensureLearningSchema(db);
	if (user.role !== "student") throw new Error("Chi hoc vien moi checkout khoa hoc.");

	const cart = await db
		.prepare(
			`SELECT
				ci.id AS cart_item_id,
				ci.coupon_id,
				c.id AS course_id,
				c.instructor_id,
				c.price,
				c.currency,
				cp.discount_type,
				cp.discount_value
			FROM cart_items ci
			JOIN instructor_courses c ON c.id = ci.course_id
			LEFT JOIN coupons cp ON cp.id = ci.coupon_id
			WHERE ci.user_id = ? AND c.status = 'published'`,
		)
		.bind(user.id)
		.all<{
			cart_item_id: number;
			coupon_id: number | null;
			course_id: number;
			instructor_id: number;
			price: number;
			currency: string;
			discount_type: string | null;
			discount_value: number | null;
		}>();

	const items = cart.results ?? [];
	if (!items.length) throw new Error("Gio hang dang trong.");

	for (const item of items) {
		const finalPrice = discountedPrice(
			Number(item.price),
			item.discount_type && item.discount_value
				? { discount_type: item.discount_type, discount_value: item.discount_value }
				: null,
		);
		await db
			.prepare(
				`INSERT INTO course_purchases (student_id, course_id, instructor_id, amount, currency, status, created_at)
				VALUES (?, ?, ?, ?, ?, 'active', ?)
				ON CONFLICT(student_id, course_id) DO UPDATE SET status = 'active'`,
			)
			.bind(user.id, item.course_id, item.instructor_id, finalPrice, item.currency, new Date().toISOString())
			.run();
		if (item.coupon_id) {
			await db.prepare("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?").bind(item.coupon_id).run();
		}
	}

	await db.prepare("DELETE FROM cart_items WHERE user_id = ?").bind(user.id).run();
	return items.length;
}

export async function hasPurchasedCourse(
	db: D1Database,
	studentId: number,
	courseId: number,
): Promise<boolean> {
	const purchase = await db
		.prepare(
			`SELECT id FROM course_purchases
			WHERE student_id = ? AND course_id = ? AND status = 'active'
			LIMIT 1`,
		)
		.bind(studentId, courseId)
		.first();
	return Boolean(purchase);
}

export async function getMarketplaceCourseForViewer(
	db: D1Database,
	coursePublicId: string,
	viewer: AuthUser | null,
) {
	await ensureLearningSchema(db);

	const course = await db
		.prepare(
			`SELECT c.*, u.public_id AS instructor_public_id, u.full_name AS instructor_name
			FROM instructor_courses c
			JOIN auth_users u ON u.id = c.instructor_id
			WHERE c.public_id = ? AND c.status = 'published'
			LIMIT 1`,
		)
		.bind(clean(coursePublicId))
		.first<InstructorCourse & { instructor_public_id: string; instructor_name: string }>();

	if (!course) return null;

	const isOwner = viewer?.id === course.instructor_id;
	const canViewContent = Boolean(
		viewer &&
			(isOwner ||
				(viewer.role === "student" &&
					(await hasPurchasedCourse(db, viewer.id, course.id)))),
	);

	let lessons: unknown[] = [];
	let materials: unknown[] = [];

	if (canViewContent) {
		const lessonResult = await db
			.prepare(
				`SELECT id, title, content, sort_order
				FROM course_lessons
				WHERE course_id = ? AND status = 'published'
				ORDER BY sort_order ASC, id ASC`,
			)
			.bind(course.id)
			.all();
		const materialResult = await db
			.prepare(
				`SELECT id, title, file_url, file_type, sort_order
				FROM course_materials
				WHERE course_id = ? AND status = 'published'
				ORDER BY sort_order ASC, id ASC`,
			)
			.bind(course.id)
			.all();
		lessons = lessonResult.results ?? [];
		materials = materialResult.results ?? [];
	}

	return {
		course,
		canViewContent,
		lessons,
		materials,
	};
}

export async function addLesson(
	db: D1Database,
	instructor: AuthUser,
	coursePublicId: string,
	payload: { title?: string; content?: string },
) {
	await ensureLearningSchema(db);
	requireInstructor(instructor);
	const course = await getCourseByPublicId(db, coursePublicId);
	if (!course || course.instructor_id !== instructor.id) throw new Error("Khong tim thay khoa hoc cua ban.");

	const title = clean(payload.title);
	const content = clean(payload.content);
	if (!title || !content) throw new Error("Can nhap tieu de va noi dung bai giang.");

	await db
		.prepare(
			`INSERT INTO course_lessons (course_id, title, content, sort_order, created_at, updated_at)
			VALUES (?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM course_lessons WHERE course_id = ?), ?, ?)`,
		)
		.bind(course.id, title, content, course.id, new Date().toISOString(), new Date().toISOString())
		.run();
}

export async function addMaterial(
	db: D1Database,
	instructor: AuthUser,
	coursePublicId: string,
	payload: { title?: string; fileUrl?: string; fileType?: string },
) {
	await ensureLearningSchema(db);
	requireInstructor(instructor);
	const course = await getCourseByPublicId(db, coursePublicId);
	if (!course || course.instructor_id !== instructor.id) throw new Error("Khong tim thay khoa hoc cua ban.");

	const title = clean(payload.title);
	const fileUrl = clean(payload.fileUrl);
	if (!title || !fileUrl) throw new Error("Can nhap tieu de va link tai lieu.");

	await db
		.prepare(
			`INSERT INTO course_materials (course_id, title, file_url, file_type, sort_order, created_at, updated_at)
			VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM course_materials WHERE course_id = ?), ?, ?)`,
		)
		.bind(course.id, title, fileUrl, clean(payload.fileType) || null, course.id, new Date().toISOString(), new Date().toISOString())
		.run();
}

export async function purchaseCourse(db: D1Database, student: AuthUser, coursePublicId: string) {
	await ensureLearningSchema(db);
	if (student.role !== "student") throw new Error("Chi hoc vien moi mua khoa hoc.");
	const course = await getCourseByPublicId(db, coursePublicId);
	if (!course || course.status !== "published") throw new Error("Khong tim thay khoa hoc dang ban.");

	await db
		.prepare(
			`INSERT INTO course_purchases (student_id, course_id, instructor_id, amount, currency, status, created_at)
			VALUES (?, ?, ?, ?, ?, 'active', ?)
			ON CONFLICT(student_id, course_id) DO UPDATE SET status = 'active'`,
		)
		.bind(student.id, course.id, course.instructor_id, course.price, course.currency, new Date().toISOString())
		.run();

	return course;
}

export async function canAccessCourseThread(db: D1Database, user: AuthUser, course: InstructorCourse) {
	if (user.id === course.instructor_id) return true;
	if (user.role !== "student") return false;

	const purchase = await db
		.prepare(
			`SELECT id FROM course_purchases
			WHERE student_id = ? AND course_id = ? AND instructor_id = ? AND status = 'active'
			LIMIT 1`,
		)
		.bind(user.id, course.id, course.instructor_id)
		.first();
	return Boolean(purchase);
}

export async function getThreadMessages(
	db: D1Database,
	user: AuthUser,
	coursePublicId: string,
	studentPublicId?: string,
) {
	await ensureLearningSchema(db);
	const course = await getCourseByPublicId(db, coursePublicId);
	if (!course) throw new Error("Khong tim thay khoa hoc.");
	if (!(await canAccessCourseThread(db, user, course))) throw new Error("Ban can mua khoa hoc nay truoc khi nhan tin.");

	let studentId = user.id;
	if (user.role === "instructor") {
		const student = await db
			.prepare("SELECT id FROM auth_users WHERE public_id = ? AND role = 'student' LIMIT 1")
			.bind(clean(studentPublicId))
			.first<{ id: number }>();
		if (!student) throw new Error("Thieu hoc vien trong thread.");
		studentId = student.id;
	}

	const { results } = await db
		.prepare(
			`SELECT m.id, m.body, m.created_at, u.public_id AS sender_public_id, u.full_name AS sender_name, u.role AS sender_role
			FROM private_messages m
			JOIN auth_users u ON u.id = m.sender_id
			WHERE m.course_id = ? AND m.student_id = ? AND m.instructor_id = ?
			ORDER BY m.created_at ASC`,
		)
		.bind(course.id, studentId, course.instructor_id)
		.all();
	return { course, messages: results ?? [] };
}

export async function sendThreadMessage(
	db: D1Database,
	user: AuthUser,
	coursePublicId: string,
	payload: { body?: string; studentPublicId?: string },
) {
	await ensureLearningSchema(db);
	const course = await getCourseByPublicId(db, coursePublicId);
	if (!course) throw new Error("Khong tim thay khoa hoc.");
	if (!(await canAccessCourseThread(db, user, course))) throw new Error("Ban can mua khoa hoc nay truoc khi nhan tin.");

	let studentId = user.id;
	if (user.role === "instructor") {
		if (user.id !== course.instructor_id) throw new Error("Ban khong phu trach khoa hoc nay.");
		const student = await db
			.prepare("SELECT id FROM auth_users WHERE public_id = ? AND role = 'student' LIMIT 1")
			.bind(clean(payload.studentPublicId))
			.first<{ id: number }>();
		if (!student) throw new Error("Thieu hoc vien trong thread.");
		studentId = student.id;
	}

	const body = clean(payload.body);
	if (body.length < 1) throw new Error("Tin nhan khong duoc de trong.");

	await db
		.prepare(
			`INSERT INTO private_messages (course_id, student_id, instructor_id, sender_id, body, created_at)
			VALUES (?, ?, ?, ?, ?, ?)`,
		)
		.bind(course.id, studentId, course.instructor_id, user.id, body, new Date().toISOString())
		.run();
}

export async function getInstructorThreads(db: D1Database, instructor: AuthUser) {
	await ensureLearningSchema(db);
	requireInstructor(instructor);

	const { results } = await db
		.prepare(
			`SELECT
				p.created_at,
				c.public_id AS course_public_id,
				c.title AS course_title,
				s.public_id AS student_public_id,
				s.full_name AS student_name,
				(
					SELECT body FROM private_messages m
					WHERE m.course_id = p.course_id
						AND m.student_id = p.student_id
						AND m.instructor_id = p.instructor_id
					ORDER BY m.created_at DESC
					LIMIT 1
				) AS last_message
			FROM course_purchases p
			JOIN instructor_courses c ON c.id = p.course_id
			JOIN auth_users s ON s.id = p.student_id
			WHERE p.instructor_id = ? AND p.status = 'active'
			ORDER BY p.created_at DESC`,
		)
		.bind(instructor.id)
		.all();

	return results ?? [];
}
