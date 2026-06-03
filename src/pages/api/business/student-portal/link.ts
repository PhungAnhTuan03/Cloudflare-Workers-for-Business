import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getPrimaryStudentPortalLink, json } from "../../../../lib/business-api";

export const prerender = false;

export const GET: APIRoute = async () => {
	const link = await getPrimaryStudentPortalLink(env.DB);

	if (!link) {
		return json({
			ok: true,
			link: {
				label: "Cong hoc vien",
				url: "https://hocvien.tinhocsaoviet.com",
			},
		});
	}

	return json({ ok: true, link });
};
