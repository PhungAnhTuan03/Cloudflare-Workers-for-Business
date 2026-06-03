import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../../../lib/auth";
import { json, readJson } from "../../../../../lib/business-api";
import { addLesson } from "../../../../../lib/learning";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{ title?: string; content?: string }>(request);
		await addLesson(env.DB, user, params.id || "", payload);
		return json({ ok: true, message: "Da them bai giang." });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong them duoc bai giang.";
		return json({ ok: false, message }, 400);
	}
};
