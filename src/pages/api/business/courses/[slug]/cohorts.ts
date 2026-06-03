import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { clean, json, listCohorts } from "../../../../../lib/business-api";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
	const slug = clean(params.slug);
	const location = clean(new URL(request.url).searchParams.get("location"));

	if (!slug) {
		return json({ ok: false, message: "Thieu ma khoa hoc." }, 400);
	}

	const cohorts = await listCohorts(env.DB, slug, location || undefined);
	return json({ ok: true, courseSlug: slug, locationSlug: location || null, cohorts });
};
