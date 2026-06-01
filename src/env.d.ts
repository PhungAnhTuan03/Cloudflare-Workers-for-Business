/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
	interface Env {
		DB: D1Database;
		CACHE: KVNamespace;
		SESSION: KVNamespace;
		MEDIA: R2Bucket;
		ASSETS: Fetcher;
		IMAGES: ImagesBinding;
		RESEND_API_KEY?: string;
		CONTACT_FROM_EMAIL?: string;
		ADMIN_EMAIL: string;
		SITE_URL: string;
	}
}

declare namespace App {
	interface Locals {
		contactBody?: string;
	}
}
