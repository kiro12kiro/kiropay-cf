// File Name: buy-store-item.js
// 🛑 تم التعديل: استخدام D1 Transaction لضمان أمان العملية
export async function onRequestPost(context) {
    const db = context.env.DB;
    const request = context.request;

    try {
        const { email, itemId } = await request.json();

        if (!email || !itemId) {
            return new Response(JSON.stringify({ success: false, error: 'بيانات غير كاملة.' }), { status: 400 });
        }

        // ----------------- 🛑 بداية عملية المعاملة (Transaction) 🛑 -----------------
        const transactionResult = await db.batch([
            // 1. جلب بيانات المستخدم
            db.prepare('SELECT balance FROM users WHERE email = ?').bind(email),
            // 2. جلب بيانات العنصر
            db.prepare('SELECT id, price, name FROM store_items WHERE id = ?').bind(itemId)
        ]);

        const user = transactionResult[0].results[0];
        const item = transactionResult[1].results[0];
        
        if (!user) return new Response(JSON.stringify({ success: false, error: 'المستخدم غير موجود.' }), { status: 404 });
        if (!item) return new Response(JSON.stringify({ success: false, error: 'العنصر غير موجود.' }), { status: 404 });

        const itemPrice = item.price;
        if (user.balance < itemPrice) {
            return new Response(JSON.stringify({ success: false, error: 'نقاطك غير كافية لإتمام عملية الشراء.' }), { status: 403 });
        }

        const newBalance = user.balance - itemPrice;
        const transactionReason = `شراء عنصر: ${item.name}`;

        // ----------------- 🛑 تنفيذ التغييرات 🛑 -----------------
        await db.batch([
            // 3. تسجيل العنصر للمستخدم في user_unlocked_items
            db.prepare('INSERT INTO user_unlocked_items (user_email, item_id) VALUES (?, ?)').bind(email, itemId),
            // 4. تحديث رصيد المستخدم
            db.prepare('UPDATE users SET balance = ? WHERE email = ?').bind(newBalance, email),
            // 5. تسجيل الخصم في جدول المعاملات
            db.prepare('INSERT INTO transactions (email, amount, reason) VALUES (?, ?, ?)').bind(email, -itemPrice, transactionReason)
        ]);
        // ----------------- 🛑 نهاية عملية المعاملة (Transaction) 🛑 -----------------

        return new Response(JSON.stringify({ success: true, message: `تم شراء ${item.name} بنجاح.`, new_balance: newBalance }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Buy item fatal error:', error);
        // في حالة فشل المعاملة، نرجع رسالة عامة
        return new Response(JSON.stringify({ success: false, error: 'فشل إتمام عملية الشراء بسبب خطأ في الخادم (Transaction Failure).' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
