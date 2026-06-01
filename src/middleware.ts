import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	if (context.url.pathname === "/api/contact" && context.request.method === "POST") {
		context.locals.contactBody = await context.request.clone().text();
	}

	return next();
});
