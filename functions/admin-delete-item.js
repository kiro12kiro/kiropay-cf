// File Name: admin-delete-item.js
// 🛑 تم التعديل: استخدام DELETE SQL
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
            // 🛑🛑 التعديل لـ D1 SQL: استخدام DELETE
            const result = await env.DB.prepare('DELETE FROM store_items WHERE id = ?')
                .bind(itemId)
                .run();
            
            if (result.changes === 0) {
                 return new Response(JSON.stringify({ success: false, error: 'لم يتم العثور على العنصر للحذف.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
            }

            return new Response(JSON.stringify({ success: true, message: 'تم حذف العنصر بنجاح.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Admin error deleting item:', error);
            return new Response(JSON.stringify({ error: `فشل إداري في حذف العنصر: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
