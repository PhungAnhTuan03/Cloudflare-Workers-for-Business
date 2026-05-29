import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ request, locals }) => {
    const { env } = locals.runtime          // ✅

    const { DB, CACHE } = env
    const url = new URL(request.url)

    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50)
    const tag = url.searchParams.get('tag')?.replace(/[^a-z0-9-]/gi, '') // sanitize
    const offset = (page - 1) * limit

    // Cache key an toàn (đã sanitize tag)
    const cacheKey = `cache:posts:${page}:${limit}:${tag || ''}`
    const cached = await CACHE.get(cacheKey)
    if (cached) return new Response(cached, {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
    })

    // Query: lọc theo status + (optional) tag

    const whereClause = tag ? `WHERE status='published' AND EXISTS (SELECT 1 FROM json_each(posts.tags) WHERE value = ?)` : `WHERE status='published'`
    const bindings: string[] = tag ? [tag] : []

    // 1. Lấy total count (cho pagination) — query RIÊNG
    const countResult = await DB.prepare(`SELECT COUNT(*) as total FROM posts ${whereClause}`).bind(...bindings).first<{ total: number }>()
    const total = countResult?.total ?? 0


    // 2. Lấy data của trang hiện tại
    const { results } = await DB.prepare(`SELECT id, title, slug, excerpt, published_at, tags FROM posts ${whereClause} ORDER BY published_at DESC LIMIT ? OFFSET ?`).bind(...bindings, limit, offset).all()
    const payload = JSON.stringify({ data: results, page, limit, total, totalPages: Math.ceil(total / limit) })

    await CACHE.put(cacheKey, payload, { expirationTtl: 300 })
    return new Response(payload, {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
    })
}