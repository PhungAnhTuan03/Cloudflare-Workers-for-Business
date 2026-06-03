import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { audit, clean, json, parseLeadStatus, readJson, requireAdmin } from "../../../../../lib/business-api";

export const prerender = false;

type PatchLeadPayload = {
	status?: string;
	assignedTo?: string;
	note?: string;
};

export const PATCH: APIRoute = async ({ params, request }) => {
	const actor = requireAdmin(request);
	if (!actor) return json({ ok: false, message: "Unauthorized" }, 401);

	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return json({ ok: false, message: "Lead id khong hop le." }, 400);
	}

	let payload: PatchLeadPayload;
	try {
		payload = await readJson<PatchLeadPayload>(request);
	} catch {
		return json({ ok: false, message: "Du lieu gui len khong hop le." }, 400);
	}

	const status = payload.status === undefined ? null : parseLeadStatus(payload.status);
	if (payload.status !== undefined && !status) {
		return json({ ok: false, message: "Trang thai lead khong hop le." }, 400);
	}

	const assignedTo = clean(payload.assignedTo);
	const now = new Date().toISOString();

	await env.DB.batch([
		env.DB
			.prepare(
				`UPDATE business_leads
				SET status = COALESCE(?, status), assigned_to = COALESCE(?, assigned_to), updated_at = ?
				WHERE id = ?`,
			)
			.bind(status, assignedTo || null, now, id),
		env.DB
			.prepare(
				`INSERT INTO business_lead_events (lead_id, event_type, note, actor_id, created_at)
				VALUES (?, ?, ?, ?, ?)`,
			)
			.bind(id, "updated", clean(payload.note) || null, actor.id, now),
	]);

	await audit({
		db: env.DB,
		actor,
		action: "lead.update",
		entityType: "lead",
		entityId: id,
		payload: {
			status: status ?? null,
			assignedTo: assignedTo || null,
			note: clean(payload.note) || null,
		},
		request,
	});

	return json({ ok: true, id });
};
