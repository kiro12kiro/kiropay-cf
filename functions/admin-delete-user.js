/*
 * API Endpoint: /admin-delete-user
 * (النسخة الجديدة المُعدلة - بتصلح خطأ الترتيب)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const emailToDelete = data.email;

    if (!emailToDelete) {
      return new Response(JSON.stringify({ error: "لم يتم إرسال الإيميل" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑🛑 الخطوة الأولى: ابحث عن المستخدم الأول 🛑🛑
    const userPs = db.prepare("SELECT role FROM users WHERE email = ?");
    const user = await userPs.bind(emailToDelete).first();

    // 🛑🛑 الخطوة الثانية: اتأكد إنه موجود وإنه مش أدمن 🛑🛑
    if (!user) {
      // لو مش موجود أصلاً
      return new Response(JSON.stringify({ error: "هذا المستخدم غير موجود" }), {
        status: 404, // 404 Not Found
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (user.role === 'admin') {
      // لو هو أدمن
      return new Response(JSON.stringify({ error: "لا يمكن حذف مستخدم أدمن" }), {
        status: 403, // 403 Forbidden
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑🛑 الخطوة الثالثة: (طالما هو يوزر عادي) امسحه 🛑🛑
    const deletePs = db.prepare("DELETE FROM users WHERE email = ?");
    await deletePs.bind(emailToDelete).run();

    // 4. رجع رسالة النجاح
    return new Response(JSON.stringify({ message: "تم حذف المستخدم بنجاح" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
