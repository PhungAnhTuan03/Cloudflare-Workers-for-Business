import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ locals, params }) => {
    const { env } = locals.runtime          // ✅ không cần import gì thêm
    const { MEDIA } = env
    const key = params.key

    if (!key) return new Response('Not found', { status: 404 })
    const object = await MEDIA.get(key)
    if (!object) return new Response('Not found', { status: 404 })

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('cache-control', 'public, max-age=31536000, immutable')
    return new Response(object.body, { headers })
}