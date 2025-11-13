// File Name: admin-delete-user.js
// 🛑 تم التعديل: إزالة security-utils ودمج منطق التحقق والحذف المتسلسل
export async function onRequestPost(context) {
    
    // 🛑 وظيفة مساعدة محلية لإنشاء رد غير مصرح به
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
    
    try {
        const db = context.env.DB;
        const request = context.request;
        
        const data = await request.json();
        const emailToDelete = data.emailToDelete;
        const adminEmail = data.adminEmail;

        // 🛑🛑 1. التحقق من الصلاحيات 🛑🛑
        // التحقق من صلاحيات الأدمن الذي يقوم بالطلب
        const { results: adminAuthResults } = await db.prepare('SELECT role FROM users WHERE email = ?').bind(adminEmail).all();
        const adminUser = adminAuthResults[0];

        if (!emailToDelete || !adminEmail) {
            // هذا الخطأ كان يظهر سابقاً لأن الإيميل كان null.
            return new Response(JSON.stringify({ success: false, error: "لم يتم إرسال الإيميل." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        if (!adminUser || adminUser.role !== 'admin') {
            return unauthorizedResponse();
        }
        
        // 🛑🛑 2. فحص المستخدم الهدف 🛑🛑
        const { results: targetUserResults } = await db.prepare('SELECT role FROM users WHERE email = ?').bind(emailToDelete).all();
        const targetUser = targetUserResults[0];

        if (!targetUser) {
            return new Response(JSON.stringify({ success: false, error: "المستخدم الهدف غير موجود." }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        if (targetUser.role === 'admin') {
             return new Response(JSON.stringify({ success: false, error: "لا يمكن حذف مستخدم أدمن آخر." }), { status: 403, headers: { "Content-Type": "application/json" } });
        }
        if (emailToDelete === adminEmail) {
             return new Response(JSON.stringify({ success: false, error: "لا يمكن حذف حساب الأدمن الخاص بك." }), { status: 403, headers: { "Content-Type": "application/json" } });
        }


        // 🛑🛑 3. تنفيذ الحذف المتسلسل (D1 Batch) 🛑🛑
        const batch = [
            // حذف سجلات المعاملات (transactions)
            db.prepare('DELETE FROM transactions WHERE user_email = ?').bind(emailToDelete),
            // حذف سجلات المشتريات (user_unlocked_items)
            db.prepare('DELETE FROM user_unlocked_items WHERE user_email = ?').bind(emailToDelete),
            // حذف المستخدم نفسه (users)
            db.prepare('DELETE FROM users WHERE email = ?').bind(emailToDelete),
        ];

        const results = await db.batch(batch);
        
        if (results[2].changes === 0) { 
             return new Response(JSON.stringify({ success: false, error: 'المستخدم غير موجود بعد التحقق.' }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ success: true, message: `تم حذف المستخدم ${emailToDelete} وكافة سجلاته بنجاح.` }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error('Admin delete user error:', error);
        return new Response(JSON.stringify({ success: false, error: `فشل إداري في حذف المستخدم: ${error.message}` }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}
