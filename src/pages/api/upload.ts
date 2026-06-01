import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

const ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024;

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export const POST: APIRoute = async ({ request }) => {
	const { MEDIA, SITE_URL } = env;

	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file) {
		return json({ error: "Không có file" }, 400);
	}
	if (!ALLOWED_TYPES.includes(file.type)) {
		return json({ error: "Định dạng không được phép" }, 400);
	}
	if (file.size > MAX_SIZE) {
		return json({ error: "File quá lớn (max 10MB)" }, 400);
	}

	const ext = file.name.split(".").pop();
	const now = new Date();
	const key = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${ext}`;

	await MEDIA.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type },
		customMetadata: { originalName: file.name, uploadedAt: now.toISOString() },
	});

	return json(
		{
			success: true,
			url: `${SITE_URL}/media/${key}`,
			key,
		},
		201,
	);
};
