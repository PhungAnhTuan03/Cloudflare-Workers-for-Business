import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createSession, createUser, notifyRegistration, publicUser } from "../../../lib/auth";
import { getClientIp, json, rateLimit, readJson } from "../../../lib/business-api";
import type { RegisterPayload } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	let payload: RegisterPayload;

	try {
		payload = await readJson<RegisterPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	const allowed = await rateLimit(env.CACHE, `register:${getClientIp(request)}`, 8, 60 * 10);
	if (!allowed) return json({ ok: false, message: "Ban da thu qua nhieu lan. Vui long quay lai sau." }, 429);

	try {
		const user = await createUser(env.DB, payload);
		const cookie = await createSession({ kv: env.SESSION, user, request, remember: true });
		let emailSent = false;
		let resendId: string | null = null;
		let emailWarning: string | null = null;

		try {
			resendId = await notifyRegistration({ env, user });
			emailSent = Boolean(resendId);
			if (!emailSent) {
				emailWarning = "Chua cau hinh RESEND_API_KEY hoac ADMIN_EMAIL.";
			}
		} catch (error) {
			emailWarning = error instanceof Error ? error.message : "Khong gui duoc email thong bao.";
			console.error("Failed to send registration notification", error);
		}

		return new Response(
			JSON.stringify({
				ok: true,
				user: publicUser(user),
				emailSent,
				resendId,
				emailWarning,
				redirectTo: "/tai-khoan",
				message: emailSent
					? "Dang ky tai khoan thanh cong. Email thong bao da duoc gui."
					: "Dang ky tai khoan thanh cong, nhung email thong bao chua gui duoc.",
			}),
			{
				status: 201,
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Cache-Control": "no-store",
					"Set-Cookie": cookie,
				},
			},
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong the dang ky tai khoan.";
		return json({ ok: false, message }, 400);
	}
};
