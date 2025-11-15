/*
 * API Endpoint: /admin-get-qr-list
 * الوظيفة: جلب قائمة بكل المستخدمين (الاسم، الإيميل، العائلة) لغرض طباعة QR Codes
 */

// 🛑🛑 الدوال المساعدة (مطلوبة للأمان) 🛑🛑
async function getAuthUser(email, db) {
    if (!email) return null;
    try {
        const { results } = await db.prepare('SELECT role FROM users WHERE email = ?').bind(email).all();
        return results[0] || null;
    } catch (e) { 
        return null; 
    }
}

function unauthorizedResponse() {
    return new Response(JSON.stringify({ 
        success: false, 
        error: "غير مصرح لك بتنفيذ هذا الإجراء.",
        auth_error: true
    }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
    });
}
// 🛑🛑 نهاية الدوال المساعدة 🛑🛑


export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request;

        const { adminEmail } = await request.json();

        // 1. التحقق من صلاحيات الأدمن
        const authUser = await getAuthUser(adminEmail, db);
        if (!authUser || authUser.role !== 'admin') {
            return unauthorizedResponse();
        }

        // 2. جلب قائمة المستخدمين (بدون الأدمن)
        // نجلب فقط البيانات المطلوبة للطباعة، ومرتبة
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
