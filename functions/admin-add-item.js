// File Name: admin-add-item.js
// 🛑 تم التعديل: إزالة التحقق الإلزامي من وجود image_url
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request;

        // التحقق من صلاحيات الأدمن يجب أن يتم هنا (في الكود الحقيقي)

        const { name, price, image_url } = await request.json();

        // 🛑🛑 التحقق الجديد: لا نشترط وجود image_url، ونفحص فقط الاسم والسعر
        if (!name || price === undefined || isNaN(price) || price <= 0) {
            return new Response(JSON.stringify({ error: 'بيانات العنصر غير كاملة أو غير صالحة (الاسم والسعر ضروريان).' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        try {
            // 🛑🛑 التعديل لـ D1 SQL: استخدام INSERT
            const result = await db.prepare(
                'INSERT INTO store_items (name, price, image_url) VALUES (?, ?, ?)'
            )
            .bind(name, parseInt(price), image_url) // image_url يمكن أن تكون ''
            .run();

            return new Response(JSON.stringify({ success: true, message: `تم إضافة العنصر بنجاح.`, itemId: result.lastRowId }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            });

        } catch (dbError) {
            console.error('Admin DB Error:', dbError);
            return new Response(JSON.stringify({ error: `فشل إداري في إضافة العنصر: ${dbError.message}` }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: `فشل إداري: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
