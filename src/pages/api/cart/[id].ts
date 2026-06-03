import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../../lib/auth";
import { json } from "../../../lib/business-api";
import { removeCartItem } from "../../../lib/learning";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	await removeCartItem(env.DB, user, Number(params.id));
	return json({ ok: true, message: "Da xoa khoa hoc khoi gio hang." });
};
