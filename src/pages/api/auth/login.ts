import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createSession, findUserByEmail, publicUser, validateLoginPayload, verifyPassword } from "../../../lib/auth";
import { getClientIp, json, rateLimit, readJson } from "../../../lib/business-api";
import type { LoginPayload } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	let payload: LoginPayload;

	try {
		payload = await readJson<LoginPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	const validation = validateLoginPayload(payload);
	if (!validation.ok) return json({ ok: false, message: validation.message }, 400);

	const allowed = await rateLimit(env.CACHE, `login:${getClientIp(request)}:${validation.value.email}`, 12, 60 * 10);
	if (!allowed) return json({ ok: false, message: "Ban da thu qua nhieu lan. Vui long quay lai sau." }, 429);

	const user = await findUserByEmail(env.DB, validation.value.email);
	if (!user || user.status !== "active") {
		return json({ ok: false, message: "Email hoac mat khau khong dung." }, 401);
	}

	const valid = await verifyPassword(validation.value.password, user.password_hash);
	if (!valid) return json({ ok: false, message: "Email hoac mat khau khong dung." }, 401);

	await env.DB
		.prepare("UPDATE auth_users SET last_login_at = ?, updated_at = ? WHERE id = ?")
		.bind(new Date().toISOString(), new Date().toISOString(), user.id)
		.run();

	const cookie = await createSession({ kv: env.SESSION, user, request, remember: Boolean(validation.value.remember) });

	return new Response(
		JSON.stringify({
			ok: true,
			user: publicUser(user),
			redirectTo: "/tai-khoan",
			message: "Dang nhap thanh cong.",
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
				"Set-Cookie": cookie,
			},
		},
	);
};
