// File Name: buy-store-item.js
// 🛑 تم التعديل: إضافة تسجيل المعاملة في جدول transactions
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; // استخدام context.env.DB
        const request = context.request;

        const { email, itemId } = await request.json();

        if (!email || !itemId) {
            return new Response(JSON.stringify({ error: 'بيانات غير كاملة.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑 الخطوة 1 & 2: جلب البيانات
        const { results: userResults } = await db.prepare('SELECT balance FROM users WHERE email = ?').bind(email).all();
        const user = userResults[0];

        const { results: itemResults } = await db.prepare('SELECT id, price, name FROM store_items WHERE id = ?').bind(itemId).all();
        const item = itemResults[0];

        if (!user) return new Response(JSON.stringify({ error: 'المستخدم غير موجود.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        if (!item) return new Response(JSON.stringify({ error: 'العنصر غير موجود.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

        const itemPrice = item.price;
        if (user.balance < itemPrice) {
            return new Response(JSON.stringify({ success: false, error: 'نقاطك غير كافية لإتمام عملية الشراء.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        // --- عملية الشراء ---

        // 🛑 الخطوة 3: تسجيل العنصر للمستخدم في user_unlocked_items
        await db.prepare('INSERT INTO user_unlocked_items (user_email, item_id) VALUES (?, ?)')
            .bind(email, itemId)
            .run();
        
        // 🛑 الخطوة 4: تحديث رصيد المستخدم
        const newBalance = user.balance - itemPrice;
        await db.prepare('UPDATE users SET balance = ? WHERE email = ?')
            .bind(newBalance, email)
            .run();
        
        // 🛑🛑 الخطوة 5 الجديدة: تسجيل الخصم في جدول المعاملات 🛑🛑
        const transactionReason = `شراء عنصر: ${item.name}`;
        await db.prepare('INSERT INTO transactions (email, amount, reason) VALUES (?, ?, ?)')
            .bind(email, -itemPrice, transactionReason) // نستخدم قيمة سالبة للخصم
            .run();


        return new Response(JSON.stringify({ success: true, message: `تم شراء ${item.name} بنجاح.`, new_balance: newBalance }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Buy item error:', error);
        return new Response(JSON.stringify({ success: false, error: 'حدث خطأ أثناء إتمام عملية الشراء.' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
