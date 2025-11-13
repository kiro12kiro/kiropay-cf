// File Name: admin-delete-item.js
// الوصف: حذف عنصر المتجر بعد حذف أي سجلات مشتريات مرتبطة به.
export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const request = context.request;
        const { itemId } = await request.json(); 

        // 🛑 (يجب التأكد هنا من صلاحيات الأدمن قبل المتابعة)

        if (!itemId) {
            return new Response(JSON.stringify({ success: false, error: 'ID العنصر مفقود.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑🛑 تنفيذ عملية الحذف المتسلسل الآمن عبر Batch 🛑🛑
        const batch = [
            // 1. حذف سجلات المشتريات من جدول user_unlocked_items أولاً
            db.prepare('DELETE FROM user_unlocked_items WHERE item_id = ?').bind(itemId),
            // 2. حذف العنصر نفسه من جدول store_items
            db.prepare('DELETE FROM store_items WHERE id = ?').bind(itemId),
        ];

        const results = await db.batch(batch);

        if (results[1].changes === 0) { // التحقق من نتيجة حذف العنصر نفسه
             return new Response(JSON.stringify({ success: false, error: 'لم يتم العثور على العنصر للحذف.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ success: true, message: 'تم حذف العنصر بنجاح.' }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Admin delete item error:', error);
        return new Response(JSON.stringify({ success: false, error: `فشل إداري في حذف العنصر (خطأ DB): ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
