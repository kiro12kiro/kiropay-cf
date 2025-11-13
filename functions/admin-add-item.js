// File Name: admin-add-item.js
// 🛑 تم التحويل إلى صيغة onRequestPost(context)
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; // استخدام context.env.DB
        const request = context.request;

        // التحقق من صلاحيات الأدمن يجب أن يتم هنا (في الكود الحقيقي)
        
        const { name, price, image_url } = await request.json();

        if (!name || !price || !image_url || isNaN(price) || price <= 0) {
            return new Response(JSON.stringify({ error: 'بيانات العنصر غير كاملة أو غير صالحة.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const result = await db.prepare(
            'INSERT INTO store_items (name, price, image_url) VALUES (?, ?, ?)'
        )
        .bind(name, parseInt(price), image_url)
        .run();

        return new Response(JSON.stringify({ success: true, message: `تم إضافة العنصر بنجاح.`, itemId: result.lastRowId }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: `فشل إداري في إضافة العنصر: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
