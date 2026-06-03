import { Resend } from "resend";

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export type LeadStatus =
	| "new"
	| "contacted"
	| "consulting"
	| "scheduled"
	| "won"
	| "lost";

export type LeadPayload = {
	fullName?: string;
	phone?: string;
	email?: string;
	courseSlug?: string;
	locationSlug?: string;
	preferredTime?: string;
	message?: string;
	sourcePath?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	website?: string;
};

export type AdminPrincipal = {
	id: string;
	role: "admin" | "editor" | "admission";
	email?: string;
};

const leadStatuses = new Set<LeadStatus>([
	"new",
	"contacted",
	"consulting",
	"scheduled",
	"won",
	"lost",
]);

export function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

export function clean(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

export function getClientIp(request: Request): string {
	const forwardedFor = request.headers.get("X-Forwarded-For");
	return (
		request.headers.get("CF-Connecting-IP") ||
		forwardedFor?.split(",")[0]?.trim() ||
		"unknown"
	);
}

export async function readJson<T>(request: Request): Promise<T> {
	const text = await request.text();
	if (!text.trim()) return {} as T;
	return JSON.parse(text) as T;
}

export function publicId(prefix: string): string {
	const random = crypto.getRandomValues(new Uint8Array(12));
	const suffix = Array.from(random, (byte) =>
		byte.toString(16).padStart(2, "0"),
	).join("");
	return `${prefix}_${suffix}`;
}

export function validateLeadPayload(payload: LeadPayload): {
	ok: true;
	value: Required<Pick<LeadPayload, "fullName" | "phone">> & LeadPayload;
} | { ok: false; message: string } {
	const fullName = clean(payload.fullName);
	const phone = clean(payload.phone).replaceAll(" ", "");
	const email = clean(payload.email);

	if (clean(payload.website)) {
		return {
			ok: true,
			value: { ...payload, fullName: "honeypot", phone: "honeypot" },
		};
	}

	if (fullName.length < 2) {
		return { ok: false, message: "Vui long nhap ho ten." };
	}

	if (!/^(0|\+84)[0-9]{8,10}$/.test(phone)) {
		return { ok: false, message: "So dien thoai khong hop le." };
	}

	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { ok: false, message: "Email khong hop le." };
	}

	return { ok: true, value: { ...payload, fullName, phone, email } };
}

export async function rateLimit(
	kv: KVNamespace | undefined,
	key: string,
	limit: number,
	windowSeconds: number,
): Promise<boolean> {
	if (!kv) return true;
	const current = Number((await kv.get(key)) ?? "0");
	if (current >= limit) return false;
	await kv.put(key, String(current + 1), { expirationTtl: windowSeconds });
	return true;
}

export async function createLead(input: {
	db: D1Database;
	payload: LeadPayload;
	request: Request;
}): Promise<{ id: number | bigint; publicId: string }> {
	const validation = validateLeadPayload(input.payload);
	if (!validation.ok) {
		throw new Error(validation.message);
	}

	if (validation.value.fullName === "honeypot") {
		return { id: 0, publicId: "ignored" };
	}

	const now = new Date().toISOString();
	const id = publicId("lead");

	const result = await input.db
		.prepare(
			`INSERT INTO business_leads (
				public_id, full_name, phone, email, course_slug, location_slug,
				preferred_time, message, source_path, utm_source, utm_medium,
				utm_campaign, ip_address, user_agent, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			id,
			validation.value.fullName,
			validation.value.phone,
			clean(validation.value.email) || null,
			clean(validation.value.courseSlug) || null,
			clean(validation.value.locationSlug) || null,
			clean(validation.value.preferredTime) || null,
			clean(validation.value.message) || null,
			clean(validation.value.sourcePath) || new URL(input.request.url).pathname,
			clean(validation.value.utmSource) || null,
			clean(validation.value.utmMedium) || null,
			clean(validation.value.utmCampaign) || null,
			getClientIp(input.request),
			input.request.headers.get("User-Agent") || null,
			now,
			now,
		)
		.run();

	await input.db
		.prepare(
			"INSERT INTO business_lead_events (lead_id, event_type, note, created_at) VALUES (?, ?, ?, ?)",
		)
		.bind(result.meta.last_row_id, "created", "Lead submitted from public website", now)
		.run();

	return { id: result.meta.last_row_id, publicId: id };
}

export async function notifyLead(input: {
	env: Cloudflare.Env;
	leadPublicId: string;
	payload: LeadPayload;
}): Promise<string | null> {
	if (!input.env.RESEND_API_KEY || !input.env.ADMIN_EMAIL) return null;

	const resend = new Resend(input.env.RESEND_API_KEY);
	const response = await resend.emails.send({
		from: input.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
		to: input.env.ADMIN_EMAIL,
		subject: `Lead tu van moi: ${clean(input.payload.fullName)}`,
		text: [
			`Lead: ${input.leadPublicId}`,
			`Ho ten: ${clean(input.payload.fullName)}`,
			`Dien thoai: ${clean(input.payload.phone)}`,
			`Email: ${clean(input.payload.email) || "Khong co"}`,
			`Khoa hoc: ${clean(input.payload.courseSlug) || "Chua chon"}`,
			`Co so: ${clean(input.payload.locationSlug) || "Chua chon"}`,
			`Thoi gian mong muon: ${clean(input.payload.preferredTime) || "Chua chon"}`,
			`Tin nhan: ${clean(input.payload.message) || "Khong co"}`,
		].join("\n"),
	});

	if (response.error) {
		throw new Error(response.error.message);
	}

	return response.data?.id ?? null;
}

export async function listCohorts(
	db: D1Database,
	courseSlug: string,
	locationSlug?: string,
) {
	const base = `SELECT id, course_slug, location_slug, instructor_slug, start_date,
		schedule_label, shift, seats_total, seats_left, price, status
		FROM business_cohorts
		WHERE course_slug = ? AND status IN ('open', 'waitlist')`;
	const sql = locationSlug
		? `${base} AND location_slug = ? ORDER BY start_date IS NULL, start_date ASC, id ASC`
		: `${base} ORDER BY start_date IS NULL, start_date ASC, id ASC`;
	const statement = locationSlug
		? db.prepare(sql).bind(courseSlug, locationSlug)
		: db.prepare(sql).bind(courseSlug);
	const { results } = await statement.all();
	return results ?? [];
}

export async function verifyCertificate(db: D1Database, code: string) {
	const normalized = code.trim().toUpperCase();
	if (!/^[A-Z0-9-]{6,40}$/.test(normalized)) {
		return null;
	}

	return db
		.prepare(
			`SELECT code, student_name, course_name, issued_at, expires_at, status
			FROM business_certificates
			WHERE code = ?
			LIMIT 1`,
		)
		.bind(normalized)
		.first();
}

export async function getPrimaryStudentPortalLink(db: D1Database) {
	return db
		.prepare(
			`SELECT label, url
			FROM business_student_portal_links
			WHERE is_active = 1
			ORDER BY is_primary DESC, id ASC
			LIMIT 1`,
		)
		.first();
}

export function requireAdmin(request: Request): AdminPrincipal | null {
	const role = request.headers.get("X-Admin-Role");
	const id = request.headers.get("X-Admin-Id") || "local-admin";

	if (role === "admin" || role === "admission") {
		return { id, role, email: request.headers.get("X-Admin-Email") || undefined };
	}

	return null;
}

export function parseLeadStatus(value: unknown): LeadStatus | null {
	const status = clean(value) as LeadStatus;
	return leadStatuses.has(status) ? status : null;
}

export async function audit(input: {
	db: D1Database;
	actor?: AdminPrincipal | null;
	action: string;
	entityType: string;
	entityId: string | number | bigint;
	payload?: JsonValue;
	request: Request;
}) {
	await input.db
		.prepare(
			`INSERT INTO business_audit_logs
			(actor_id, action, entity_type, entity_id, payload_json, ip_address, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			input.actor?.id ?? null,
			input.action,
			input.entityType,
			String(input.entityId),
			input.payload ? JSON.stringify(input.payload) : null,
			getClientIp(input.request),
			new Date().toISOString(),
		)
		.run();
}
