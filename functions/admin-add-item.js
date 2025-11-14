// 🛑 تم التعديل: إضافة "required_level"
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request;

        // التحقق من صلاحيات الأدمن يجب أن يتم هنا (في الكود الحقيقي)

        // 🛑🛑 التعديل: استقبال المستوى المطلوب 🛑🛑
        const { name, price, image_url, required_level } = await request.json();

        // 🛑🛑 التعديل: إضافة المستوى للتحقق 🛑🛑
        const itemPrice = parseInt(price);
        const itemLevel = parseInt(required_level) || 1; // الافتراضي 1

        if (!name || isNaN(itemPrice) || itemPrice <= 0 || isNaN(itemLevel) || itemLevel < 1) {
            return new Response(JSON.stringify({ error: 'بيانات العنصر غير كاملة (الاسم، السعر، والمستوى مطلوبين).' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        try {
            // 🛑🛑 التعديل: إضافة "required_level" للـ INSERT 🛑🛑
            const result = await db.prepare(
                'INSERT INTO store_items (name, price, image_url, required_level) VALUES (?, ?, ?, ?)'
            )
            .bind(name, itemPrice, image_url, itemLevel) // image_url يمكن أن تكون ''
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
