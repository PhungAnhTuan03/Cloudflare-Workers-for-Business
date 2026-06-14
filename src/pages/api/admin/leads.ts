import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { requireAdminUser, updateManagedLead } from "../../../lib/admin";
import { json, readJson } from "../../../lib/business-api";

export const prerender = false;

type PatchLeadPayload = {
	publicId?: string;
	status?: string;
	assignedTo?: string;
	note?: string;
};

export const GET: APIRoute = async ({ request }) => {
	const actor = await requireAdminUser(env.DB, env.SESSION, request, env);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	const url = new URL(request.url);
	const status = url.searchParams.get("status");
	const q = url.searchParams.get("q");
	const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 100);
	const where: string[] = [];
	const binds: (string | number)[] = [];

	if (status) {
		where.push("status = ?");
		binds.push(status);
	}

	if (q) {
		where.push("(full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR course_slug LIKE ?)");
		binds.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
	}

	const sql = `SELECT public_id, full_name, phone, email, course_slug, location_slug, status, assigned_to, created_at
		FROM business_leads
		${where.length ? `WHERE ${where.join(" AND ")}` : ""}
		ORDER BY created_at DESC
		LIMIT ?`;
	const result = await env.DB.prepare(sql).bind(...binds, limit).all();

	return json({ ok: true, leads: result.results ?? [] });
};

export const PATCH: APIRoute = async ({ request }) => {
	const actor = await requireAdminUser(env.DB, env.SESSION, request, env);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	let payload: PatchLeadPayload;
	try {
		payload = await readJson<PatchLeadPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	try {
		await updateManagedLead({
			db: env.DB,
			actor,
			publicId: payload.publicId || "",
			status: payload.status,
			assignedTo: payload.assignedTo,
			note: payload.note,
			request,
		});
		return json({ ok: true, message: "Da cap nhat lead." });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : "Khong cap nhat duoc." }, 400);
	}
};
