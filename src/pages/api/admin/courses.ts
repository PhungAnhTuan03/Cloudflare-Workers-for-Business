import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { requireAdminUser, updateManagedCourse } from "../../../lib/admin";
import { json, readJson } from "../../../lib/business-api";

export const prerender = false;

type PatchCoursePayload = {
	publicId?: string;
	status?: string;
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
		where.push("c.status = ?");
		binds.push(status);
	}

	if (q) {
		where.push("(c.title LIKE ? OR c.description LIKE ? OR u.full_name LIKE ?)");
		binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
	}

	const sql = `SELECT
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
		${where.length ? `WHERE ${where.join(" AND ")}` : ""}
		ORDER BY c.created_at DESC
		LIMIT ?`;
	const result = await env.DB.prepare(sql).bind(...binds, limit).all();

	return json({ ok: true, courses: result.results ?? [] });
};

export const PATCH: APIRoute = async ({ request }) => {
	const actor = await requireAdminUser(env.DB, env.SESSION, request, env);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	let payload: PatchCoursePayload;
	try {
		payload = await readJson<PatchCoursePayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	try {
		await updateManagedCourse({
			db: env.DB,
			actor,
			publicId: payload.publicId || "",
			status: payload.status,
			request,
		});
		return json({ ok: true, message: "Da cap nhat khoa hoc." });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : "Khong cap nhat duoc." }, 400);
	}
};
