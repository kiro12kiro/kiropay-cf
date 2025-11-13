// File Name: admin-get-items.js
// 🛑 تم التحويل إلى صيغة onRequestGet(context)
export async function onRequestGet(context) {
    try {
        const db = context.env.DB; // استخدام context.env.DB
        
        // التحقق من صلاحيات الأدمن يجب أن يتم هنا (في الكود الحقيقي)

        // جلب جميع البيانات من جدول store_items (وهذا ما كان يسبب الانهيار)
        const { results: items } = await db.prepare('SELECT * FROM store_items').all(); 

        return new Response(JSON.stringify({ items }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: `فشل إداري في جلب العناصر: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
