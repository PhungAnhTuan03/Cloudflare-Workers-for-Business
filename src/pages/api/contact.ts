import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { Resend } from "resend";

export const prerender = false;

type ContactPayload = {
	name?: string;
	email?: string;
	phone?: string;
	subject?: string;
	message?: string;
	website?: string;
};

const createContactsTableSql = `CREATE TABLE IF NOT EXISTS contacts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	email TEXT NOT NULL,
	phone TEXT,
	subject TEXT,
	message TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'new',
	ip_address TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const createContactsCreatedAtIndexSql =
	"CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at);";

const contactColumnMigrations = [
	{ name: "phone", sql: "ALTER TABLE contacts ADD COLUMN phone TEXT;" },
	{ name: "subject", sql: "ALTER TABLE contacts ADD COLUMN subject TEXT;" },
	{
		name: "status",
		sql: "ALTER TABLE contacts ADD COLUMN status TEXT NOT NULL DEFAULT 'new';",
	},
] as const;

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function clean(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

function getClientIp(request: Request): string {
	const forwardedFor = request.headers.get("X-Forwarded-For");
	return (
		request.headers.get("CF-Connecting-IP") ||
		forwardedFor?.split(",")[0]?.trim() ||
		"unknown"
	);
}

async function ensureContactsTable(db: D1Database): Promise<void> {
	await db.prepare(createContactsTableSql).run();

	const { results } = await db
		.prepare("PRAGMA table_info(contacts);")
		.all<{ name: string }>();
	const columns = new Set((results ?? []).map((column) => column.name));

	for (const migration of contactColumnMigrations) {
		if (!columns.has(migration.name)) {
			await db.prepare(migration.sql).run();
			columns.add(migration.name);
		}
	}

	await db.prepare(createContactsCreatedAtIndexSql).run();
}

async function readContactBody(
	request: Request,
	rawBody?: string,
): Promise<ContactPayload> {
	const contentType = request.headers.get("Content-Type") || "";
	const text = rawBody ?? (await request.text());

	if (!text.trim()) {
		return {};
	}

	if (contentType.includes("application/json")) {
		return JSON.parse(text) as ContactPayload;
	}

	return Object.fromEntries(new URLSearchParams(text)) as ContactPayload;
}

async function sendContactEmail(input: {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}): Promise<string | null> {
	const { RESEND_API_KEY, ADMIN_EMAIL, CONTACT_FROM_EMAIL } = env;

	if (!RESEND_API_KEY || !ADMIN_EMAIL) {
		return null;
	}

	const resend = new Resend(RESEND_API_KEY);
	const { data, error } = await resend.emails.send({
		from: CONTACT_FROM_EMAIL || "onboarding@resend.dev",
		to: ADMIN_EMAIL,
		subject: `Lien he moi tu ${input.name || input.email}`,
		replyTo: input.email,
		html: `<h2>Lien he moi</h2>
			<p><strong>Ten:</strong> ${escapeHtml(input.name || "Khong cung cap")}</p>
			<p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
			<p><strong>Dien thoai:</strong> ${escapeHtml(input.phone || "Khong cung cap")}</p>
			<p><strong>Chu de:</strong> ${escapeHtml(input.subject || "Khong cung cap")}</p>
			<p><strong>Noi dung:</strong></p>
			<p>${escapeHtml(input.message)}</p>`,
		text: [
			"Lien he moi",
			`Ten: ${input.name || "Khong cung cap"}`,
			`Email: ${input.email}`,
			`Dien thoai: ${input.phone || "Khong cung cap"}`,
			`Chu de: ${input.subject || "Khong cung cap"}`,
			"",
			input.message,
		].join("\n"),
	});

	if (error) {
		throw new Error(`Resend failed: ${error.message}`);
	}

	return data?.id ?? null;
}

async function updateContactStatus(
	db: D1Database,
	id: number | bigint | undefined,
	status: string,
): Promise<void> {
	if (id === undefined) {
		return;
	}

	await db.prepare("UPDATE contacts SET status = ? WHERE id = ?").bind(status, id).run();
}

export const POST: APIRoute = async ({ request, locals }) => {
	const { DB } = env;
	const ip = getClientIp(request);

	let payload: ContactPayload;
	try {
		payload = await readContactBody(request, locals.contactBody);
	} catch (error) {
		console.error("Failed to parse contact request body", error);
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	const name = clean(payload.name);
	const email = clean(payload.email);
	const phone = clean(payload.phone);
	const subject = clean(payload.subject);
	const message = clean(payload.message);

	if (clean(payload.website)) {
		return json({
			ok: true,
			message: "Thong tin da duoc ghi nhan.",
			emailQueued: false,
		});
	}

	if (!email || !message) {
		return json(
			{ ok: false, message: "Email va noi dung la bat buoc." },
			400,
		);
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ ok: false, message: "Email khong hop le." }, 400);
	}

	try {
		await ensureContactsTable(DB);

		const { meta } = await DB.prepare(
			"INSERT INTO contacts (name, email, phone, subject, message, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
		)
			.bind(
				name || null,
				email,
				phone || null,
				subject || null,
				message,
				ip,
				new Date().toISOString(),
			)
			.run();

		const contactId = meta.last_row_id;
		let resendId: string | null = null;

		try {
			resendId = await sendContactEmail({ name, email, phone, subject, message });
		} catch (error) {
			console.error("Failed to send contact email", error);
			await updateContactStatus(DB, contactId, "email_failed");

			return json(
				{
					ok: false,
					id: contactId,
					emailSent: false,
					message:
						"Da luu lien he nhung chua gui duoc email thong bao admin. Vui long kiem tra Resend API key, ADMIN_EMAIL va email gui di.",
				},
				502,
			);
		}

		if (!resendId) {
			await updateContactStatus(DB, contactId, "missing_email_config");

			return json(
				{
					ok: false,
					id: contactId,
					emailSent: false,
					message:
						"Da luu lien he nhung chua cau hinh gui email. Thieu RESEND_API_KEY hoac ADMIN_EMAIL.",
				},
				500,
			);
		}

		await updateContactStatus(DB, contactId, "email_sent");

		return json({
			ok: true,
			id: contactId,
			emailSent: true,
			resendId,
			message: "Gui lien he thanh cong. Email thong bao da duoc gui den admin.",
		});
	} catch (error) {
		console.error("Failed to save contact request", error);
		return json(
			{ ok: false, message: "Khong luu duoc lien he. Vui long thu lai." },
			500,
		);
	}
};
