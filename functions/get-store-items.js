// File Name: get-store-items.js
// 🛑 تم التعديل إلى استخدام 'name' (حسب طلبك)
export default {
    async fetch(request, env) {
        if (request.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة. يجب استخدام GET.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        try {
            // 🛑 تم التعديل: اختيار name
            const { results: items } = await env.DB.prepare(
                'SELECT id, name, price, image_url FROM store_items'
            ).all();

            return new Response(JSON.stringify({ items }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Error fetching store items:', error);
            return new Response(JSON.stringify({ error: `فشل في جلب عناصر المتجر. (DB Error)` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
