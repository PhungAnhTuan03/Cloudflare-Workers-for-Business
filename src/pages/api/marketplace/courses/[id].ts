import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../../lib/auth";
import { json } from "../../../../lib/business-api";
import { getMarketplaceCourseForViewer } from "../../../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	const course = await getMarketplaceCourseForViewer(env.DB, params.id || "", user);

	if (!course) {
		return json({ ok: false, message: "Khong tim thay khoa hoc dang ban." }, 404);
	}

	return json({ ok: true, ...course });
};
