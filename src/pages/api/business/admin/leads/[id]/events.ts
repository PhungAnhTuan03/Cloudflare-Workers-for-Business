import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { audit, clean, json, readJson, requireAdmin } from "../../../../../../lib/business-api";

export const prerender = false;

type CreateEventPayload = {
	eventType?: string;
	note?: string;
};

export const POST: APIRoute = async ({ params, request }) => {
	const actor = requireAdmin(request);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return json({ ok: false, message: "Lead id khong hop le." }, 400);
	}

	let payload: CreateEventPayload;
	try {
		payload = await readJson<CreateEventPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	const eventType = clean(payload.eventType) || "note";
	const note = clean(payload.note);

	await env.DB
		.prepare(
			`INSERT INTO business_lead_events (lead_id, event_type, note, actor_id, created_at)
			VALUES (?, ?, ?, ?, ?)`,
		)
		.bind(id, eventType, note || null, actor.id, new Date().toISOString())
		.run();

	await audit({
		db: env.DB,
		actor,
		action: "lead.event.create",
		entityType: "lead",
		entityId: id,
		payload: { eventType, note },
		request,
	});

	return json({ ok: true, leadId: id });
};
