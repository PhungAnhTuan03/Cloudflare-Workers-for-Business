// src/pages/api/contact.ts
import type { APIRoute } from 'astro'
import { Resend } from 'resend'

export const prerender = false


async function checkRateLimit(kv: KVNamespace, ip: string): Promise<boolean> {
    const key = `rate_limit:contact:${ip}`
    const count = await kv.get(key)
    if (count && parseInt(count) >= 5) return false
    await kv.put(key, String(parseInt(count || '0') + 1), { expirationTtl: 3600 })
    return true
}

export const POST: APIRoute = async ({ request, locals }) => {
    const { env, ctx } = locals.runtime     // ✅

    const { DB, CACHE, RESEND_API_KEY, ADMIN_EMAIL } = env
    // ... phần còn lại giữ nguyên

    // 1. Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const allowed = await checkRateLimit(CACHE, ip)
    if (!allowed) {
        return new Response(JSON.stringify({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }), {
            status: 429, headers: { 'Content-Type': 'application/json' }
        })
    }

    // 2. Parse body
    let body: { name?: string; email?: string; message?: string }
    try { body = await request.json() }
    catch { return new Response(JSON.stringify({ error: 'JSON không hợp lệ' }), { status: 400 }) }

    const { name, email, message } = body

    // 3. Validate
    if (!email || !message) {
        return new Response(JSON.stringify({ error: 'Email và tin nhắn là bắt buộc' }), { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ error: 'Email không hợp lệ' }), { status: 400 })
    }

    // 4. Lưu vào D1
    const { meta } = await DB
        .prepare(`INSERT INTO contacts (name, email, message, ip_address, created_at) VALUES (?, ?, ?, ?, ?)`)
        .bind(name ?? null, email, message, ip, new Date().toISOString())
        .run()

    // 5. Gửi email — DÙNG ctx.waitUntil để Worker không kill request
    const resend = new Resend(RESEND_API_KEY)
    ctx.waitUntil(
        resend.emails.send({
            from: 'no-reply@yourdomain.com',
            to: ADMIN_EMAIL,
            subject: `📬 Liên hệ mới từ ${name || email}`,
            html: `<h2>Liên hệ mới</h2>...`
        })

    )

    return new Response(JSON.stringify({
        success: true,
        id: meta.last_row_id,
        message: 'Cảm ơn! Chúng tôi sẽ liên hệ lại sớm nhất.'
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    })
}