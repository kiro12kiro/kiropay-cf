// File Name: admin-delete-item.js
// 🛑 تم التحويل إلى صيغة onRequestPost(context)
export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const request = context.request;
        
        // التحقق من صلاحيات الأدمن يجب أن يتم هنا (في الكود الحقيقي)

        const { itemId } = await request.json();

        if (!itemId) {
            return new Response(JSON.stringify({ error: 'ID العنصر مفقود.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const result = await db.prepare('DELETE FROM store_items WHERE id = ?')
            .bind(itemId)
            .run();
        
        if (result.changes === 0) {
             return new Response(JSON.stringify({ success: false, error: 'لم يتم العثور على العنصر للحذف.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ success: true, message: 'تم حذف العنصر بنجاح.' }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: `فشل إداري في حذف العنصر: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
