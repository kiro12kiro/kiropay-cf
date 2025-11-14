/*
 * API Endpoint: /admin-update-level
 * (جديدة - لتغيير مستوى المستخدم)
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
    const data = await context.request.json();
    const { adminEmail, targetEmail, newLevel } = data;

    // 1. التحقق من صلاحيات الأدمن
    const authUser = await getAuthUser(adminEmail, db);
    if (!authUser || authUser.role !== 'admin') {
      return unauthorizedResponse();
    }

    const level = parseInt(newLevel);
    if (!targetEmail || isNaN(level) || level < 1) {
      return new Response(JSON.stringify({ success: false, error: 'بيانات غير كاملة أو غير صالحة.' }), { status: 400 });
    }

    // 2. تنفيذ التحديث
    const result = await db.prepare(
      'UPDATE users SET level = ? WHERE email = ?'
    )
    .bind(level, targetEmail)
    .run();

    if (result.changes === 0) {
      return new Response(JSON.stringify({ success: false, error: 'المستخدم المستهدف غير موجود.' }), { status: 404 });
    }

    // 3. إرسال رد النجاح
    return new Response(JSON.stringify({ success: true, new_level: level, message: 'تم تحديث المستوى بنجاح.' }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error('Admin update level error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
