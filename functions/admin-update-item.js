// File Name: admin-update-item.js
// 🛑 وظيفة تعديل عنصر المتجر (Final Secure Version) 🛑

// 🛑🛑 الدوال المساعدة المدمجة محلياً (لتجنب أخطاء الاستيراد) 🛑🛑
// يجب عليك التأكد أن جدول users موجود ويحتوي على الأعمدة: email و role.
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

        const data = await request.json();
        // نستقبل البيانات من الواجهة الأمامية
        const { itemId, name, price, image_url, adminEmail } = data;

        // 1. التحقق من الصلاحيات (Authorization)
        const authUser = await getAuthUser(adminEmail, db);
        if (!authUser || authUser.role !== 'admin') {
            return unauthorizedResponse();
        }

        if (!itemId || !name || price === undefined || isNaN(price) || price <= 0) {
            return new Response(JSON.stringify({ success: false, error: 'بيانات التعديل غير كاملة أو غير صالحة.' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }
        
        // 2. تنفيذ التحديث على جدول store_items
        const result = await db.prepare(
            'UPDATE store_items SET name = ?, price = ?, image_url = ? WHERE id = ?'
        )
        .bind(name, parseInt(price), image_url, itemId)
        .run();

        if (result.changes === 0) {
             return new Response(JSON.stringify({ success: false, error: 'فشل التعديل: لم يتم العثور على العنصر.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ success: true, message: `تم تحديث العنصر #${itemId} بنجاح.` }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Admin update item error:', error);
        return new Response(JSON.stringify({ success: false, error: `فشل إداري في تحديث العنصر: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
