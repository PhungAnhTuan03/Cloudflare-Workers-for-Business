import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { clean, json, verifyCertificate } from "../../../../lib/business-api";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const code = clean(new URL(request.url).searchParams.get("code"));

	if (!code) {
		return json({ ok: false, message: "Vui long nhap ma chung nhan." }, 400);
	}

	const certificate = await verifyCertificate(env.DB, code);
	if (!certificate) {
		return json({ ok: false, message: "Khong tim thay chung nhan." }, 404);
	}

	return json({ ok: true, certificate });
};
