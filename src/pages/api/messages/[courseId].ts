import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../lib/auth";
import { clean, json, readJson } from "../../../lib/business-api";
import { getThreadMessages, sendThreadMessage } from "../../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const url = new URL(request.url);
		const thread = await getThreadMessages(
			env.DB,
			user,
			params.courseId || "",
			clean(url.searchParams.get("studentId")),
		);
		return json({ ok: true, ...thread });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong lay duoc tin nhan.";
		return json({ ok: false, message }, 403);
	}
};

export const POST: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{ body?: string; studentPublicId?: string }>(request);
		await sendThreadMessage(env.DB, user, params.courseId || "", payload);
		return json({ ok: true, message: "Da gui tin nhan." });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong gui duoc tin nhan.";
		return json({ ok: false, message }, 400);
	}
};
