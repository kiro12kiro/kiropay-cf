// File Name: admin-get-items.js
// الوصف: جلب جميع عناصر المتجر لإدارتها (مع متطلبات صلاحيات الأدمن).

export default {
    async fetch(request, env) {
        // 🛑🛑 تم التعديل لحل مشكلة 405: التوقع الآن هو GET وليس POST 🛑🛑
        if (request.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة. يجب استخدام GET.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑 (ملاحظة: يجب التأكد هنا من صلاحيات الأدمن قبل المتابعة)

        try {
            // 🛑 يجب استبدال هذا بمنطق قراءة جميع العناصر من قاعدة البيانات
            const items = await env.DB.getAllItemsForAdmin(); 

            return new Response(JSON.stringify({ items }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Admin error fetching store items:', error);
            return new Response(JSON.stringify({ error: 'فشل إداري في جلب عناصر المتجر.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
