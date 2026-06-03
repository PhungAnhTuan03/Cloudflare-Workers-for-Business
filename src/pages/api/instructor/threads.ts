import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../lib/auth";
import { json } from "../../../lib/business-api";
import { getInstructorThreads } from "../../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const threads = await getInstructorThreads(env.DB, user);
		return json({ ok: true, threads });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong lay duoc tin nhan.";
		return json({ ok: false, message }, 403);
	}
};
