// File Name: get-store-items.js
// الوصف: جلب قائمة بجميع العناصر المتاحة في المتجر.

export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        try {
            // 🛑 يجب استبدال هذا بمنطق قراءة جميع العناصر من قاعدة البيانات
            // (مثال: استخدام env.DB.execute أو env.KV.get)
            const items = await env.DB.getItems(); 

            return new Response(JSON.stringify({ items }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Error fetching store items:', error);
            return new Response(JSON.stringify({ error: 'فشل في جلب عناصر المتجر.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
