// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validate
        if (!name || !email || !subject || !message) {
            return new Response(JSON.stringify({ error: 'Thiếu thông tin' }), { status: 400 });
        }

        // Gửi email hoặc lưu vào database (giả lập)
        console.log('Contact form:', { name, email, phone, subject, message });

        // TODO: Thực tế nên gửi email qua SMTP hoặc lưu vào DB

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Lỗi server' }), { status: 500 });
    }
};