// src/env.d.ts
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare module 'cloudflare:workers' {
    interface Env {
        DB: D1Database
        CACHE: KVNamespace
        MEDIA: R2Bucket
        ASSETS: Fetcher
        RESEND_API_KEY: string
        ADMIN_EMAIL: string
        SITE_URL: string
    }
}

// ✅ Expose Env as global so getRuntime<Env> works
type Env = import('cloudflare:workers').Env

// ✅ Extend Astro's Locals so locals.runtime is typed
declare namespace App {
    interface Locals {
        runtime: import('@astrojs/cloudflare').Runtime<Env>
    }
}