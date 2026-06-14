import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getAdminDashboardData, requireAdminUser } from "../../../lib/admin";
import { json } from "../../../lib/business-api";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const actor = await requireAdminUser(env.DB, env.SESSION, request, env);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	const data = await getAdminDashboardData(env.DB);
	return json({ ok: true, data });
};
