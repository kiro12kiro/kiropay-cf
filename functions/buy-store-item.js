// File Name: buy-store-item.js
// الوصف: السماح للمستخدم بشراء عنصر من المتجر وخصم الرصيد.

export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'الطريقة غير مسموحة.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        const { email, itemId } = await request.json();

        if (!email || !itemId) {
            return new Response(JSON.stringify({ error: 'بيانات غير كاملة (الإيميل أو ID العنصر مفقود).' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        try {
            // 🛑 الخطوة 1: جلب بيانات المستخدم والعنصر
            const user = await env.DB.getUserByEmail(email);
            const item = await env.DB.getItemById(itemId);

            if (!user) {
                return new Response(JSON.stringify({ error: 'المستخدم غير موجود.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
            }
            if (!item) {
                return new Response(JSON.stringify({ error: 'العنصر غير موجود.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
            }

            const itemPrice = item.price;
            if (user.balance < itemPrice) {
                return new Response(JSON.stringify({ success: false, error: 'نقاطك غير كافية لإتمام عملية الشراء.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
            }

            // 🛑 الخطوة 2: خصم الرصيد وتسجيل المعاملة (يجب أن تكون عملية متكاملة في DB)
            const newBalance = user.balance - itemPrice;
            const transactionReason = `شراء عنصر: ${item.name}`;
            
            await env.DB.updateBalanceAndLogTransaction(email, -itemPrice, transactionReason);
            
            // 🛑 الخطوة 3: تسجيل العنصر للمستخدم (حسب منطق المتجر لديك)
            await env.DB.assignItemToUser(email, itemId);


            return new Response(JSON.stringify({ success: true, message: `تم شراء ${item.name} بنجاح. رصيدك الجديد: ${newBalance}`, new_balance: newBalance }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            console.error('Buy item error:', error);
            return new Response(JSON.stringify({ success: false, error: 'حدث خطأ أثناء إتمام عملية الشراء.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};
