import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { clearSessionCookie, deleteSession } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	await deleteSession(env.SESSION, request);

	return new Response(JSON.stringify({ ok: true, redirectTo: "/dang-nhap" }), {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
			"Set-Cookie": clearSessionCookie(request),
		},
	});
};

