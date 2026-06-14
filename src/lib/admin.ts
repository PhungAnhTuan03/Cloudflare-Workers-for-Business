import type { AuthUser } from "./auth";
import { ensureAuthSchema, getCurrentUser } from "./auth";
import { audit, clean } from "./business-api";
import { ensureLearningSchema } from "./learning";

type AdminEnv = Cloudflare.Env & {
	ADMIN_EMAIL?: string;
	SESSION?: KVNamespace;
};

export type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboardData>>;

const allowedManagedRoles = new Set(["student", "instructor", "admin"]);
const allowedUserStatuses = new Set(["active", "suspended"]);
const allowedCourseStatuses = new Set(["draft", "published"]);
const allowedLeadStatuses = new Set(["new", "contacted", "consulting", "scheduled", "won", "lost"]);

export function isAdminUser(user: AuthUser | null, env: AdminEnv): user is AuthUser {
	if (!user) return false;
	const adminEmail = clean(env.ADMIN_EMAIL).toLowerCase();
	return user.role === "admin" || Boolean(adminEmail && user.email.toLowerCase() === adminEmail);
}

export async function requireAdminUser(
	db: D1Database,
	kv: KVNamespace,
	request: Request,
	env: AdminEnv,
): Promise<AuthUser | null> {
	const user = await getCurrentUser(db, kv, request);
	return isAdminUser(user, env) ? user : null;
}

async function countValue(db: D1Database, sql: string, binds: (string | number)[] = []) {
	try {
		const row = await db.prepare(sql).bind(...binds).first<{ value: number | null }>();
		return Number(row?.value ?? 0);
	} catch {
		return 0;
	}
}

async function rows<T>(db: D1Database, sql: string, binds: (string | number)[] = []) {
	try {
		const result = await db.prepare(sql).bind(...binds).all<T>();
		return result.results ?? [];
	} catch {
		return [];
	}
}

export async function getAdminDashboardData(db: D1Database) {
	await ensureAuthSchema(db);
	await ensureLearningSchema(db);

	const [
		totalUsers,
		totalStudents,
		totalInstructors,
		totalAdmins,
		totalLeads,
		newLeads,
		wonLeads,
		totalCourses,
		publishedCourses,
		draftCourses,
		totalPurchases,
		totalRevenue,
		totalMessages,
		totalCertificates,
		activeLocations,
		openCohorts,
	] = await Promise.all([
		countValue(db, "SELECT COUNT(*) AS value FROM auth_users"),
		countValue(db, "SELECT COUNT(*) AS value FROM auth_users WHERE role = 'student'"),
		countValue(db, "SELECT COUNT(*) AS value FROM auth_users WHERE role = 'instructor'"),
		countValue(db, "SELECT COUNT(*) AS value FROM auth_users WHERE role = 'admin'"),
		countValue(db, "SELECT COUNT(*) AS value FROM business_leads"),
		countValue(db, "SELECT COUNT(*) AS value FROM business_leads WHERE status = 'new'"),
		countValue(db, "SELECT COUNT(*) AS value FROM business_leads WHERE status = 'won'"),
		countValue(db, "SELECT COUNT(*) AS value FROM instructor_courses"),
		countValue(db, "SELECT COUNT(*) AS value FROM instructor_courses WHERE status = 'published'"),
		countValue(db, "SELECT COUNT(*) AS value FROM instructor_courses WHERE status = 'draft'"),
		countValue(db, "SELECT COUNT(*) AS value FROM course_purchases WHERE status = 'active'"),
		countValue(db, "SELECT COALESCE(SUM(amount), 0) AS value FROM course_purchases WHERE status = 'active'"),
		countValue(db, "SELECT COUNT(*) AS value FROM private_messages"),
		countValue(db, "SELECT COUNT(*) AS value FROM business_certificates"),
		countValue(db, "SELECT COUNT(*) AS value FROM business_locations WHERE is_active = 1"),
		countValue(db, "SELECT COUNT(*) AS value FROM business_cohorts WHERE status IN ('open', 'waitlist')"),
	]);

	const leadStatuses = await rows<{ status: string; value: number }>(
		db,
		`SELECT status, COUNT(*) AS value
		FROM business_leads
		GROUP BY status
		ORDER BY value DESC`,
	);

	const recentLeads = await rows<{
		public_id: string;
		full_name: string;
		phone: string;
		email: string | null;
		course_slug: string | null;
		location_slug: string | null;
		status: string;
		assigned_to: string | null;
		created_at: string;
	}>(
		db,
		`SELECT public_id, full_name, phone, email, course_slug, location_slug, status, assigned_to, created_at
		FROM business_leads
		ORDER BY created_at DESC
		LIMIT 8`,
	);

	const recentCourses = await rows<{
		public_id: string;
		title: string;
		price: number;
		status: string;
		created_at: string;
		instructor_name: string;
		purchase_count: number;
		revenue: number;
	}>(
		db,
		`SELECT
			c.public_id,
			c.title,
			c.price,
			c.status,
			c.created_at,
			u.full_name AS instructor_name,
			COALESCE(p.purchase_count, 0) AS purchase_count,
			COALESCE(p.revenue, 0) AS revenue
		FROM instructor_courses c
		JOIN auth_users u ON u.id = c.instructor_id
		LEFT JOIN (
			SELECT course_id, COUNT(*) AS purchase_count, COALESCE(SUM(amount), 0) AS revenue
			FROM course_purchases
			WHERE status = 'active'
			GROUP BY course_id
		) p ON p.course_id = c.id
		ORDER BY c.created_at DESC
		LIMIT 8`,
	);

	const recentUsers = await rows<{
		public_id: string;
		full_name: string;
		email: string;
		phone: string | null;
		role: string;
		status: string;
		created_at: string;
	}>(
		db,
		`SELECT public_id, full_name, email, phone, role, status, created_at
		FROM auth_users
		ORDER BY created_at DESC
		LIMIT 10`,
	);

	const recentCertificates = await rows<{
		code: string;
		student_name: string;
		course_name: string;
		issued_at: string;
		status: string;
	}>(
		db,
		`SELECT code, student_name, course_name, issued_at, status
		FROM business_certificates
		ORDER BY issued_at DESC
		LIMIT 5`,
	);

	const locations = await rows<{
		slug: string;
		name: string;
		address: string;
		province: string;
		phone: string | null;
		is_active: number;
	}>(
		db,
		`SELECT slug, name, address, province, phone, is_active
		FROM business_locations
		ORDER BY is_active DESC, province ASC, id ASC
		LIMIT 8`,
	);

	const auditLogs = await rows<{
		action: string;
		entity_type: string;
		entity_id: string;
		actor_id: string | null;
		created_at: string;
	}>(
		db,
		`SELECT action, entity_type, entity_id, actor_id, created_at
		FROM business_audit_logs
		ORDER BY created_at DESC
		LIMIT 6`,
	);

	return {
		stats: {
			totalUsers,
			totalStudents,
			totalInstructors,
			totalAdmins,
			totalLeads,
			newLeads,
			wonLeads,
			totalCourses,
			publishedCourses,
			draftCourses,
			totalPurchases,
			totalRevenue,
			totalMessages,
			totalCertificates,
			activeLocations,
			openCohorts,
		},
		leadStatuses,
		recentLeads,
		recentCourses,
		recentUsers,
		recentCertificates,
		locations,
		auditLogs,
	};
}

export function parseManagedRole(value: unknown) {
	const role = clean(value);
	return allowedManagedRoles.has(role) ? role : null;
}

export function parseUserStatus(value: unknown) {
	const status = clean(value);
	return allowedUserStatuses.has(status) ? status : null;
}

export function parseCourseStatus(value: unknown) {
	const status = clean(value);
	return allowedCourseStatuses.has(status) ? status : null;
}

export function parseAdminLeadStatus(value: unknown) {
	const status = clean(value);
	return allowedLeadStatuses.has(status) ? status : null;
}

export async function updateManagedUser(input: {
	db: D1Database;
	actor: AuthUser;
	publicId: string;
	role?: string;
	status?: string;
	request: Request;
}) {
	await ensureAuthSchema(input.db);

	const role = input.role === undefined ? null : parseManagedRole(input.role);
	const status = input.status === undefined ? null : parseUserStatus(input.status);
	if (input.role !== undefined && !role) throw new Error("Vai tro khong hop le.");
	if (input.status !== undefined && !status) throw new Error("Trang thai tai khoan khong hop le.");

	const target = await input.db
		.prepare("SELECT id, public_id FROM auth_users WHERE public_id = ? LIMIT 1")
		.bind(clean(input.publicId))
		.first<{ id: number; public_id: string }>();

	if (!target) throw new Error("Khong tim thay nguoi dung.");
	if (target.public_id === input.actor.public_id && status && status !== "active") {
		throw new Error("Khong the khoa chinh tai khoan admin dang dang nhap.");
	}

	const result = await input.db
		.prepare(
			`UPDATE auth_users
			SET role = COALESCE(?, role), status = COALESCE(?, status), updated_at = ?
			WHERE public_id = ?`,
		)
		.bind(role, status, new Date().toISOString(), clean(input.publicId))
		.run();

	if (!result.meta.changes) throw new Error("Khong cap nhat duoc nguoi dung.");

	await audit({
		db: input.db,
		actor: { id: input.actor.public_id, role: "admin", email: input.actor.email },
		action: "admin.user.update",
		entityType: "auth_user",
		entityId: input.publicId,
		payload: { role: role ?? null, status: status ?? null },
		request: input.request,
	});
}

export async function updateManagedCourse(input: {
	db: D1Database;
	actor: AuthUser;
	publicId: string;
	status?: string;
	request: Request;
}) {
	await ensureLearningSchema(input.db);

	const status = input.status === undefined ? null : parseCourseStatus(input.status);
	if (input.status !== undefined && !status) throw new Error("Trang thai khoa hoc khong hop le.");

	const result = await input.db
		.prepare(
			`UPDATE instructor_courses
			SET status = COALESCE(?, status), updated_at = ?
			WHERE public_id = ?`,
		)
		.bind(status, new Date().toISOString(), clean(input.publicId))
		.run();

	if (!result.meta.changes) throw new Error("Khong tim thay khoa hoc.");

	await audit({
		db: input.db,
		actor: { id: input.actor.public_id, role: "admin", email: input.actor.email },
		action: "admin.course.update",
		entityType: "instructor_course",
		entityId: input.publicId,
		payload: { status: status ?? null },
		request: input.request,
	});
}

export async function updateManagedLead(input: {
	db: D1Database;
	actor: AuthUser;
	publicId: string;
	status?: string;
	assignedTo?: string;
	note?: string;
	request: Request;
}) {
	const status = input.status === undefined ? null : parseAdminLeadStatus(input.status);
	if (input.status !== undefined && !status) throw new Error("Trang thai lead khong hop le.");

	const lead = await input.db
		.prepare("SELECT id FROM business_leads WHERE public_id = ? LIMIT 1")
		.bind(clean(input.publicId))
		.first<{ id: number }>();
	if (!lead) throw new Error("Khong tim thay lead.");

	const assignedTo = clean(input.assignedTo);
	const note = clean(input.note);
	const now = new Date().toISOString();

	await input.db.batch([
		input.db
			.prepare(
				`UPDATE business_leads
				SET status = COALESCE(?, status), assigned_to = COALESCE(?, assigned_to), updated_at = ?
				WHERE public_id = ?`,
			)
			.bind(status, assignedTo || null, now, clean(input.publicId)),
		input.db
			.prepare(
				`INSERT INTO business_lead_events (lead_id, event_type, note, actor_id, created_at)
				VALUES (?, ?, ?, ?, ?)`,
			)
			.bind(lead.id, "admin_update", note || null, input.actor.public_id, now),
	]);

	await audit({
		db: input.db,
		actor: { id: input.actor.public_id, role: "admin", email: input.actor.email },
		action: "admin.lead.update",
		entityType: "business_lead",
		entityId: input.publicId,
		payload: { status: status ?? null, assignedTo: assignedTo || null, note: note || null },
		request: input.request,
	});
}
