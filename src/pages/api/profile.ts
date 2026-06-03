import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getCurrentUser } from "../../lib/auth";
import { json, readJson } from "../../lib/business-api";
import { getProfileForViewer, upsertProfile } from "../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	const profile = await getProfileForViewer(env.DB, user.public_id, user);
	return json({ ok: true, profile });
};

export const PATCH: APIRoute = async ({ request }) => {
	const user = await getCurrentUser(env.DB, env.SESSION, request);
	if (!user) return json({ ok: false, message: "Ban can dang nhap." }, 401);

	try {
		const payload = await readJson<{
			headline?: string;
			bio?: string;
			avatarUrl?: string;
			expertise?: string;
			websiteUrl?: string;
		}>(request);
		const profile = await upsertProfile(env.DB, user, payload);
		return json({ ok: true, profile, message: "Da cap nhat ho so." });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong cap nhat duoc ho so.";
		return json({ ok: false, message }, 400);
	}
};
