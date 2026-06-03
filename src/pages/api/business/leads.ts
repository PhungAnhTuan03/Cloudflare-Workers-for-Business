import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createLead, getClientIp, json, notifyLead, rateLimit, readJson } from "../../../lib/business-api";
import type { LeadPayload } from "../../../lib/business-api";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	let payload: LeadPayload;

	try {
		payload = await readJson<LeadPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	const ip = getClientIp(request);
	const allowed = await rateLimit(env.CACHE, `lead:${ip}`, 10, 60 * 10);
	if (!allowed) {
		return json({ ok: false, message: "Ban da gui qua nhieu yeu cau. Vui long thu lai sau." }, 429);
	}

	try {
		const lead = await createLead({ db: env.DB, payload, request });

		if (lead.publicId !== "ignored") {
			await notifyLead({ env, leadPublicId: lead.publicId, payload });
		}

		return json({
			ok: true,
			id: lead.publicId,
			message: "Da ghi nhan thong tin. Tu van vien se lien he trong thoi gian som nhat.",
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Khong the tao lead.";
		return json({ ok: false, message }, 400);
	}
};
