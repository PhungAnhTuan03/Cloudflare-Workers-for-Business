// src/pages/api/upload.ts
import type { APIRoute } from 'astro'

export const prerender = false

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
const MAX_SIZE = 10 * 1024 * 1024

export const POST: APIRoute = async ({ request, locals }) => {
    const { env } = locals.runtime          // ✅

    const { MEDIA, SITE_URL } = env

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) return new Response(JSON.stringify({ error: 'Không có file' }), { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return new Response(JSON.stringify({ error: 'Định dạng không được phép' }), { status: 400 })
    if (file.size > MAX_SIZE) return new Response(JSON.stringify({ error: 'File quá lớn (max 10MB)' }), { status: 400 })

    const ext = file.name.split('.').pop()
    const now = new Date()
    const key = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.${ext}`

    await MEDIA.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
        customMetadata: { originalName: file.name, uploadedAt: now.toISOString() }
    })
    const url = `${SITE_URL}/media/${key}`   // ← phục vụ qua route mới
    return new Response(JSON.stringify({ success: true, url, key }), { status: 201, headers: { 'Content-Type': 'application/json' } })
}