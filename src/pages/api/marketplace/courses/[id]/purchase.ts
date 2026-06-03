import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../../../lib/auth";
import { json } from "../../../../../lib/business-api";
import { purchaseCourse } from "../../../../../lib/learning";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap de mua khoa hoc." }, 401);

	try {
		const course = await purchaseCourse(env.DB, user, params.id || "");
		return json({
			ok: true,
			course,
			message: "Da ghi nhan mua khoa hoc. Ban co the xem profile giang vien va nhan tin rieng.",
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong mua duoc khoa hoc.";
		return json({ ok: false, message }, 400);
	}
};
