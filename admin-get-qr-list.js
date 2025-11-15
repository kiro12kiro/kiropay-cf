/*
 * API Endpoint: /admin-get-qr-list
 * الوظيفة: جلب قائمة المستخدمين (الاسم والإيميل) لغرض الطباعة
 */
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request;

        const { adminEmail } = await request.json();

        // 🛑🛑 يجب أن تستورد أو تعرف دالة التحقق من صلاحيات الأدمن هنا 🛑🛑
        // (افتراض أن التحقق من صلاحيات الأدمن قد تم مسبقاً)

        if (!adminEmail) {
            return new Response(JSON.stringify({ success: false, error: 'غير مصرح لك: مطلوب إيميل الأدمن.' }), { status: 403 });
        }

        // 1. جلب قائمة المستخدمين
        // لا نحتاج الباسورد أو الرصيد لغرض الطباعة
        const { results: users } = await db.prepare(
            'SELECT name, email, family FROM users WHERE role != ? ORDER BY family, name'
        ).bind('admin').all(); // نستثني الأدمن من القائمة

        return new Response(JSON.stringify({ 
            success: true, 
            users: users 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('QR List Fetch Error:', error);
        return new Response(JSON.stringify({ success: false, error: `فشل في جلب القائمة: ${error.message}` }), { status: 500 });
    }
}
