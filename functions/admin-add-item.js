// File Name: admin-add-item.js
// 🛑 تم التعديل: استخدام INSERT INTO SQL
export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑 (يجب التأكد هنا من صلاحيات الأدمن قبل المتابعة)

        const { name, price, image_url } = await request.json();

        if (!name || !price || !image_url || isNaN(price) || price <= 0) {
            return new Response(JSON.stringify({ error: 'بيانات العنصر غير كاملة أو غير صالحة.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        try {
            // 🛑🛑 التعديل لـ D1 SQL: استخدام INSERT
            const result = await env.DB.prepare(
                'INSERT INTO store_items (name, price, image_url) VALUES (?, ?, ?)'
            )
            .bind(name, parseInt(price), image_url)
            .run();

            return new Response(JSON.stringify({ success: true, message: `تم إضافة العنصر بنجاح.`, itemId: result.lastRowId }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Admin error adding item:', error);
            return new Response(JSON.stringify({ error: `فشل إداري في إضافة العنصر: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
