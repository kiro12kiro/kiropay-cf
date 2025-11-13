// File Name: admin-update-item.js
// الوصف: تحديث بيانات عنصر موجود في المتجر.
// يتطلب: itemId, name, price, image_url, adminEmail
import { getAuthUser, unauthorizedResponse } from './security-utils'; 

export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request;

        const { itemId, name, price, image_url, adminEmail } = await request.json();

        // 1. التحقق الأساسي من الصلاحيات
        const authUser = await getAuthUser(adminEmail, db);
        if (!authUser || authUser.role !== 'admin') {
            return unauthorizedResponse();
        }

        if (!itemId || !name || price === undefined || isNaN(price) || price <= 0) {
            return new Response(JSON.stringify({ success: false, error: 'بيانات التعديل غير كاملة أو غير صالحة.' }), { status: 400 });
        }
        
        // 2. تنفيذ التحديث
        const result = await db.prepare(
            'UPDATE store_items SET name = ?, price = ?, image_url = ? WHERE id = ?'
        )
        .bind(name, parseInt(price), image_url, itemId)
        .run();

        if (result.changes === 0) {
             return new Response(JSON.stringify({ success: false, error: 'فشل التعديل: لم يتم العثور على العنصر.' }), { status: 404 });
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
