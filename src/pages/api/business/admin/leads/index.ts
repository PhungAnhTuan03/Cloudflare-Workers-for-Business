import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { json, requireAdmin } from "../../../../../lib/business-api";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const actor = requireAdmin(request);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	const url = new URL(request.url);
	const status = url.searchParams.get("status");
	const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 100);

	const sql = status
		? `SELECT * FROM business_leads WHERE status = ? ORDER BY created_at DESC LIMIT ?`
		: `SELECT * FROM business_leads ORDER BY created_at DESC LIMIT ?`;
	const statement = status
		? env.DB.prepare(sql).bind(status, limit)
		: env.DB.prepare(sql).bind(limit);
	const { results } = await statement.all();

	return json({ ok: true, leads: results ?? [] });
};
