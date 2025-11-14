// 🛑 تم التعديل: إضافة التحقق من المستوى
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request; 

        const { email, itemId } = await request.json();

        if (!email || !itemId) {
            return new Response(JSON.stringify({ success: false, error: 'بيانات غير كاملة.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // ----------------- 🛑 بداية عملية المعاملة (Transaction) 🛑 -----------------
        const transactionResult = await db.batch([
            // 🛑🛑 التعديل: جلب المستوى (level) للمستخدم 🛑🛑
            db.prepare('SELECT balance, level FROM users WHERE email = ?').bind(email),
            // 🛑🛑 التعديل: جلب المستوى المطلوب (required_level) للمنتج 🛑🛑
            db.prepare('SELECT id, price, name, required_level FROM store_items WHERE id = ?').bind(itemId)
        ]);

        const user = transactionResult[0].results[0];
        const item = transactionResult[1].results[0];
        
        if (!user) return new Response(JSON.stringify({ success: false, error: 'المستخدم غير موجود.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        if (!item) return new Response(JSON.stringify({ success: false, error: 'العنصر غير موجود.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

        // 🛑🛑 التحقق من المستوى (الشرط الجديد) 🛑🛑
        const userLevel = user.level || 1;
        const requiredLevel = item.required_level || 1;
        if (userLevel < requiredLevel) {
             return new Response(JSON.stringify({ success: false, error: 'المستوى الخاص بك غير كافٍ لشراء هذا العنصر.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑🛑 التحقق من الرصيد (الشرط القديم) 🛑🛑
        const itemPrice = item.price;
        if (user.balance < itemPrice) {
            return new Response(JSON.stringify({ success: false, error: 'نقاطك غير كافية لإتمام عملية الشراء.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        const newBalance = user.balance - itemPrice;
        const transactionReason = `شراء عنصر: ${item.name}`;

        // ----------------- 🛑 تنفيذ التغييرات 🛑 -----------------
        await db.batch([
            // 3. تسجيل العنصر للمستخدم
            db.prepare('INSERT INTO user_unlocked_items (user_email, item_id) VALUES (?, ?)').bind(email, itemId),
            // 4. تحديث رصيد المستخدم
            db.prepare('UPDATE users SET balance = ? WHERE email = ?').bind(newBalance, email),
            // 5. تسجيل الخصم في جدول transactions
            db.prepare('INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)').bind(email, -itemPrice, transactionReason)
        ]);
        // ----------------- 🛑 نهاية عملية المعاملة (Transaction) 🛑 -----------------

        return new Response(JSON.stringify({ success: true, message: `تم شراء ${item.name} بنجاح.`, new_balance: newBalance }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Buy item fatal error:', error);
        return new Response(JSON.stringify({ success: false, error: 'فشل إتمام عملية الشراء بسبب خطأ في الخادم (Transaction Failure).' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
