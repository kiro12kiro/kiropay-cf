// File Name: admin-delete-item.js
// الوصف: حذف عنصر من المتجر بواسطة الأدمن.

export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑 (ملاحظة: يجب التأكد هنا من صلاحيات الأدمن قبل المتابعة)

        const { itemId } = await request.json();

        if (!itemId) {
            return new Response(JSON.stringify({ error: 'ID العنصر مفقود.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        try {
            // 🛑 يجب استبدال هذا بمنطق حذف العنصر من قاعدة البيانات
            await env.DB.deleteItemById(itemId);

            return new Response(JSON.stringify({ success: true, message: 'تم حذف العنصر بنجاح.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Admin error deleting item:', error);
            return new Response(JSON.stringify({ error: 'فشل إداري في حذف العنصر.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
