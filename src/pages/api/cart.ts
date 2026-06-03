import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../lib/auth";
import { json, readJson } from "../../lib/business-api";
import { addCourseToCart, applyCouponToCart, checkoutCart, getCart } from "../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);
	const items = await getCart(env.DB, user);
	return json({ ok: true, items });
};

export const POST: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{ courseId?: string; couponCode?: string; checkout?: boolean }>(request);
		if (payload.checkout) {
			const count = await checkoutCart(env.DB, user);
			return json({ ok: true, count, message: "Thanh toan thanh cong. Khoa hoc da duoc mo trong dashboard." });
		}
		if (payload.couponCode) {
			await applyCouponToCart(env.DB, user, payload.couponCode);
			return json({ ok: true, message: "Da ap dung coupon." });
		}
		if (!payload.courseId) return json({ ok: false, message: "Thieu khoa hoc." }, 400);
		await addCourseToCart(env.DB, user, payload.courseId);
		return json({ ok: true, message: "Da them vao gio hang." });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong xu ly duoc gio hang.";
		return json({ ok: false, message }, 400);
	}
};
