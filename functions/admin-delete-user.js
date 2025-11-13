// File Name: admin-delete-user.js (النسخة النهائية)
import { getAuthUser, unauthorizedResponse } from './security-utils'; 

export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const request = context.request;
        
        const data = await request.json();
        const emailToDelete = data.emailToDelete;
        const adminEmail = data.adminEmail; // يتم استخدامه للتحقق من الصلاحية

        // 1. التحقق الأساسي من وجود الإيميلات
        if (!emailToDelete || !adminEmail) {
            return new Response(JSON.stringify({ success: false, error: "لم يتم إرسال الإيميل." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        
        // 2. التحقق من الصلاحيات
        const adminUser = await getAuthUser(adminEmail, db);
        if (!adminUser || adminUser.role !== 'admin') {
            return unauthorizedResponse();
        }
        
        // 3. فحص المستخدم الهدف
        const { results: targetUserResults } = await db.prepare('SELECT role FROM users WHERE email = ?').bind(emailToDelete).all();
        const targetUser = targetUserResults[0];

        if (!targetUser) {
            return new Response(JSON.stringify({ success: false, error: "المستخدم الهدف غير موجود." }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        if (targetUser.role === 'admin') {
             return new Response(JSON.stringify({ success: false, error: "لا يمكن حذف مستخدم أدمن آخر." }), { status: 403, headers: { "Content-Type": "application/json" } });
        }

        // 4. تنفيذ الحذف المتسلسل (D1 Batch)
        const batch = [
            // حذف سجلات المعاملات
            db.prepare('DELETE FROM transactions WHERE user_email = ?').bind(emailToDelete),
            // حذف سجلات المشتريات
            db.prepare('DELETE FROM user_unlocked_items WHERE user_email = ?').bind(emailToDelete),
            // حذف المستخدم نفسه
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
