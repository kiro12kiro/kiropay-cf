// File Name: admin-add-item.js
// الوصف: إضافة عنصر جديد إلى المتجر بواسطة الأدمن.

export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑 (ملاحظة: يجب التأكد هنا من صلاحيات الأدمن قبل المتابعة)

        const { name, price, image_url } = await request.json();

        if (!name || !price || !image_url || isNaN(price) || price <= 0) {
            return new Response(JSON.stringify({ error: 'بيانات العنصر غير كاملة أو غير صالحة.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        try {
            // 🛑 يجب استبدال هذا بمنطق إضافة عنصر جديد إلى قاعدة البيانات
            const newItemId = await env.DB.addNewItem({ name, price: parseInt(price), image_url });

            return new Response(JSON.stringify({ success: true, message: `تم إضافة العنصر بنجاح.`, itemId: newItemId }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Admin error adding item:', error);
            return new Response(JSON.stringify({ error: 'فشل إداري في إضافة العنصر.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
