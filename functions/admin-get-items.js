// File Name: admin-get-items.js
// الوصف: جلب جميع عناصر المتجر لإدارتها.

export default {
    async fetch(request, env) {
        // 🛑🛑 تم التعديل لحل مشكلة 405: التوقع الآن هو GET وليس POST 🛑🛑
        if (request.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة. يجب استخدام GET.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑 (ملاحظة: يجب التأكد هنا من صلاحيات الأدمن قبل المتابعة)

        try {
            // 🛑🛑 التعديل النهائي لـ D1 SQL 🛑🛑
            // استخدام SELECT * على جدول store_items، وهو ما كان يسبب الانهيار سابقاً.
            const { results: items } = await env.DB.prepare('SELECT * FROM store_items').all(); 

            return new Response(JSON.stringify({ items }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Admin error fetching store items:', error);
            // هذا الخطأ الآن سيظهر إذا فشل الربط (Binding) أو اسم الجدول (store_items)
            return new Response(JSON.stringify({ error: `فشل إداري في جلب العناصر: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
