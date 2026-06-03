import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser, publicUser } from "../../../lib/auth";
import { json } from "../../../lib/business-api";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	return json({ ok: true, user: user ? publicUser(user) : null });
};

