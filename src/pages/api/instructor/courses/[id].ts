import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../../lib/auth";
import { json, readJson } from "../../../../lib/business-api";
import { updateInstructorCourseStatus } from "../../../../lib/learning";

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{ status?: string }>(request);
		const course = await updateInstructorCourseStatus(env.DB, user, params.id || "", payload.status || "draft");
		return json({ ok: true, course, message: "Da cap nhat trang thai khoa hoc." });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong cap nhat duoc khoa hoc.";
		return json({ ok: false, message }, 400);
	}
};
