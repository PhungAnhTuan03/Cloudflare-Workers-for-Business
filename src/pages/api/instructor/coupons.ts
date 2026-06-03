import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../lib/auth";
import { json, readJson } from "../../../lib/business-api";
import { createInstructorCoupon } from "../../../lib/learning";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{
			code?: string;
			coursePublicId?: string;
			discountType?: string;
			discountValue?: number;
			maxRedemptions?: number;
			expiresAt?: string;
		}>(request);
		await createInstructorCoupon(env.DB, user, payload);
		return json({ ok: true, message: "Da tao coupon." });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong tao duoc coupon.";
		return json({ ok: false, message }, 400);
	}
};
