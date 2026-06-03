import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../lib/auth";
import { json, readJson } from "../../../lib/business-api";
import { createInstructorCourse, getInstructorCourses, requireInstructor } from "../../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		requireInstructor(user);
		const courses = await getInstructorCourses(env.DB, user.id);
		return json({ ok: true, courses });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong lay duoc khoa hoc.";
		return json({ ok: false, message }, 403);
	}
};

export const POST: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{
			title?: string;
			description?: string;
			price?: number;
			status?: string;
			coverUrl?: string;
		}>(request);
		const course = await createInstructorCourse(env.DB, user, payload);
		return json({ ok: true, course, message: "Da tao khoa hoc." }, 201);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong tao duoc khoa hoc.";
		return json({ ok: false, message }, 400);
	}
};
