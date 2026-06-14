import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { requireAdminUser, updateManagedUser } from "../../../lib/admin";
import { json, readJson } from "../../../lib/business-api";

export const prerender = false;

type PatchUserPayload = {
	publicId?: string;
	role?: string;
	status?: string;
};

export const GET: APIRoute = async ({ request }) => {
	const actor = await requireAdminUser(env.DB, env.SESSION, request, env);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	const url = new URL(request.url);
	const role = url.searchParams.get("role");
	const q = url.searchParams.get("q");
	const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 100);
	const where: string[] = [];
	const binds: (string | number)[] = [];

	if (role) {
		where.push("role = ?");
		binds.push(role);
	}

	if (q) {
		where.push("(full_name LIKE ? OR email LIKE ? OR phone LIKE ?)");
		binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
	}

	const sql = `SELECT public_id, full_name, email, phone, role, status, created_at
		FROM auth_users
		${where.length ? `WHERE ${where.join(" AND ")}` : ""}
		ORDER BY created_at DESC
		LIMIT ?`;
	const result = await env.DB.prepare(sql).bind(...binds, limit).all();

	return json({ ok: true, users: result.results ?? [] });
};

export const PATCH: APIRoute = async ({ request }) => {
	const actor = await requireAdminUser(env.DB, env.SESSION, request, env);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	let payload: PatchUserPayload;
	try {
		payload = await readJson<PatchUserPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	try {
		await updateManagedUser({
			db: env.DB,
			actor,
			publicId: payload.publicId || "",
			role: payload.role,
			status: payload.status,
			request,
		});
		return json({ ok: true, message: "Da cap nhat nguoi dung." });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : "Khong cap nhat duoc." }, 400);
	}
};
