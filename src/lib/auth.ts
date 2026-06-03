import { clean, publicId } from "./business-api";
import { Resend } from "resend";

export type AuthRole = "student" | "instructor";

export type AuthUser = {
	id: number;
	public_id: string;
	full_name: string;
	email: string;
	phone: string | null;
	role: string;
	status: string;
};

export type RegisterPayload = {
	fullName?: string;
	email?: string;
	phone?: string;
	role?: string;
	password?: string;
	confirmPassword?: string;
	website?: string;
};

export type LoginPayload = {
	email?: string;
	password?: string;
	remember?: boolean;
};

const sessionCookieName = "sv_auth";
const encoder = new TextEncoder();
const createAuthUsersSql = `CREATE TABLE IF NOT EXISTS auth_users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	public_id TEXT NOT NULL UNIQUE,
	full_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	phone TEXT,
	password_hash TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'student',
	status TEXT NOT NULL DEFAULT 'active',
	last_login_at TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const createAuthUserIndexesSql = [
	"CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users (email);",
	"CREATE INDEX IF NOT EXISTS idx_auth_users_role_status ON auth_users (role, status);",
];

function toBase64(bytes: Uint8Array): string {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let index = 0; index < a.length; index += 1) {
		result |= a.charCodeAt(index) ^ b.charCodeAt(index);
	}
	return result === 0;
}

export function normalizeEmail(email: unknown): string {
	return clean(email).toLowerCase();
}

export function normalizeRole(role: unknown): AuthRole {
	return clean(role) === "instructor" ? "instructor" : "student";
}

export function roleLabel(role: string): string {
	return role === "instructor" ? "Giang vien" : "Hoc vien";
}

export async function ensureAuthSchema(db: D1Database): Promise<void> {
	await db.prepare(createAuthUsersSql).run();
	for (const sql of createAuthUserIndexesSql) {
		await db.prepare(sql).run();
	}
}

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			hash: "SHA-256",
			salt,
			iterations: 120000,
		},
		key,
		256,
	);
	return `pbkdf2_sha256$120000$${toBase64(salt)}$${toBase64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [scheme, iterationsText, saltText, hashText] = stored.split("$");
	if (scheme !== "pbkdf2_sha256" || !iterationsText || !saltText || !hashText) {
		return false;
	}

	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			hash: "SHA-256",
			salt: toArrayBuffer(fromBase64(saltText)),
			iterations: Number(iterationsText),
		},
		key,
		256,
	);

	return timingSafeEqual(toBase64(new Uint8Array(bits)), hashText);
}

export function validateRegisterPayload(payload: RegisterPayload):
	| { ok: true; value: Required<Pick<RegisterPayload, "fullName" | "email" | "password">> & RegisterPayload }
	| { ok: false; message: string } {
	const fullName = clean(payload.fullName);
	const email = normalizeEmail(payload.email);
	const phone = clean(payload.phone).replaceAll(" ", "");
	const role = normalizeRole(payload.role);
	const password = clean(payload.password);
	const confirmPassword = clean(payload.confirmPassword);

	if (clean(payload.website)) {
		return { ok: false, message: "Yeu cau khong hop le." };
	}

	if (fullName.length < 2) return { ok: false, message: "Vui long nhap ho ten." };
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Email khong hop le." };
	if (phone && !/^(0|\+84)[0-9]{8,10}$/.test(phone)) return { ok: false, message: "So dien thoai khong hop le." };
	if (password.length < 8) return { ok: false, message: "Mat khau can toi thieu 8 ky tu." };
	if (password !== confirmPassword) return { ok: false, message: "Mat khau xac nhan khong khop." };

	return { ok: true, value: { ...payload, fullName, email, phone, role, password } };
}

export function validateLoginPayload(payload: LoginPayload):
	| { ok: true; value: Required<Pick<LoginPayload, "email" | "password">> & LoginPayload }
	| { ok: false; message: string } {
	const email = normalizeEmail(payload.email);
	const password = clean(payload.password);

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Email khong hop le." };
	if (!password) return { ok: false, message: "Vui long nhap mat khau." };

	return { ok: true, value: { ...payload, email, password } };
}

export async function createUser(db: D1Database, payload: RegisterPayload): Promise<AuthUser> {
	await ensureAuthSchema(db);

	const validation = validateRegisterPayload(payload);
	if (!validation.ok) throw new Error(validation.message);

	const passwordHash = await hashPassword(validation.value.password);
	const now = new Date().toISOString();
	const id = publicId("user");

	try {
		await db
			.prepare(
				`INSERT INTO auth_users
				(public_id, full_name, email, phone, password_hash, role, status, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
			)
			.bind(
				id,
				validation.value.fullName,
				validation.value.email,
				clean(validation.value.phone) || null,
				passwordHash,
				normalizeRole(validation.value.role),
				now,
				now,
			)
			.run();
	} catch (error) {
		if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
			throw new Error("Email nay da duoc dang ky.");
		}
		throw error;
	}

	const user = await findUserByEmail(db, validation.value.email);
	if (!user) throw new Error("Khong tao duoc tai khoan.");
	return user;
}

export async function findUserByEmail(db: D1Database, email: string): Promise<(AuthUser & { password_hash: string }) | null> {
	await ensureAuthSchema(db);

	return db
		.prepare(
			`SELECT id, public_id, full_name, email, phone, password_hash, role, status
			FROM auth_users
			WHERE email = ?
			LIMIT 1`,
		)
		.bind(normalizeEmail(email))
		.first<AuthUser & { password_hash: string }>();
}

export async function createSession(input: {
	kv: KVNamespace;
	user: AuthUser;
	request: Request;
	remember?: boolean;
}): Promise<string> {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	const token = toBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
	const ttl = input.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

	await input.kv.put(
		`auth:${token}`,
		JSON.stringify({
			userId: input.user.id,
			publicId: input.user.public_id,
			email: input.user.email,
			role: input.user.role,
			createdAt: new Date().toISOString(),
			userAgent: input.request.headers.get("User-Agent"),
		}),
		{ expirationTtl: ttl },
	);

	const secure = new URL(input.request.url).protocol === "https:" ? " Secure;" : "";
	return `${sessionCookieName}=${token}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${ttl}`;
}

export function clearSessionCookie(request: Request): string {
	const secure = new URL(request.url).protocol === "https:" ? " Secure;" : "";
	return `${sessionCookieName}=; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=0`;
}

export function getSessionToken(request: Request): string | null {
	const cookie = request.headers.get("Cookie") || "";
	const parts = cookie.split(";").map((part) => part.trim());
	const session = parts.find((part) => part.startsWith(`${sessionCookieName}=`));
	return session ? session.slice(sessionCookieName.length + 1) : null;
}

export async function getCurrentUser(db: D1Database, kv: KVNamespace, request: Request): Promise<AuthUser | null> {
	await ensureAuthSchema(db);

	const token = getSessionToken(request);
	if (!token) return null;

	const session = await kv.get<{ userId: number }>(`auth:${token}`, "json");
	if (!session?.userId) return null;

	return db
		.prepare(
			`SELECT id, public_id, full_name, email, phone, role, status
			FROM auth_users
			WHERE id = ? AND status = 'active'
			LIMIT 1`,
		)
		.bind(session.userId)
		.first<AuthUser>();
}

export async function deleteSession(kv: KVNamespace, request: Request): Promise<void> {
	const token = getSessionToken(request);
	if (token) await kv.delete(`auth:${token}`);
}

export function publicUser(user: AuthUser) {
	return {
		id: user.public_id,
		fullName: user.full_name,
		email: user.email,
		phone: user.phone,
		role: user.role,
	};
}

export async function notifyRegistration(input: {
	env: Cloudflare.Env;
	user: AuthUser;
}): Promise<string | null> {
	if (!input.env.RESEND_API_KEY || !input.env.ADMIN_EMAIL) return null;

	const resend = new Resend(input.env.RESEND_API_KEY);
	const { data, error } = await resend.emails.send({
		from: input.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
		to: input.env.ADMIN_EMAIL,
		subject: `Tai khoan moi: ${input.user.full_name}`,
		text: [
			"Co tai khoan moi vua dang ky tren website.",
			`Ho ten: ${input.user.full_name}`,
			`Email: ${input.user.email}`,
			`Dien thoai: ${input.user.phone || "Khong cung cap"}`,
			`Vai tro: ${roleLabel(input.user.role)}`,
			`Ma tai khoan: ${input.user.public_id}`,
		].join("\n"),
	});

	if (error) {
		throw new Error(error.message);
	}

	return data?.id ?? null;
}
