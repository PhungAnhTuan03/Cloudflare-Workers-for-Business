import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../lib/auth";
import { json } from "../../../lib/business-api";
import { ensureLearningSchema } from "../../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);
	if (user.role !== "student") {
		return json({ ok: false, message: "Endpoint nay danh cho hoc vien." }, 403);
	}

	await ensureLearningSchema(env.DB);

	const { results } = await env.DB
		.prepare(
			`SELECT
				c.public_id AS course_public_id,
				c.title AS course_title,
				i.full_name AS instructor_name,
				p.created_at
			FROM course_purchases p
			JOIN instructor_courses c ON c.id = p.course_id
			JOIN auth_users i ON i.id = p.instructor_id
			WHERE p.student_id = ? AND p.status = 'active'
			ORDER BY p.created_at DESC`,
		)
		.bind(user.id)
		.all();

	return json({ ok: true, courses: results ?? [] });
};
