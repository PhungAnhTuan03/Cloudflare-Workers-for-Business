import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { json } from "../../../lib/business-api";
import { getPublishedMarketplaceCourses } from "../../../lib/learning";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const courses = await getPublishedMarketplaceCourses(env.DB, {
		q: url.searchParams.get("q") || undefined,
		instructorId: url.searchParams.get("instructor") || undefined,
		minPrice: url.searchParams.has("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined,
		maxPrice: url.searchParams.has("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined,
		sort: url.searchParams.get("sort") || undefined,
	});
	return json({ ok: true, courses });
};
