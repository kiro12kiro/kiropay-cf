/*
 * API Endpoint: /admin-delete-user
 * بيحذف مستخدم (بس مش هيحذف الأدمن)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email } = data; // إيميل المستخدم اللي هيتحذف

    if (!email) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 حماية: بنضيف شرط إنه ميحذفش أي مستخدم الـ role بتاعه 'admin'
    const query = "DELETE FROM users WHERE email = ? AND role != 'admin'";
    const result = await db.prepare(query).bind(email).run();

    // result.changes بتشوف كام سطر اتأثر (اتحذف)
    if (result.changes > 0) {
      return new Response(JSON.stringify({ success: true, message: "تم حذف المستخدم بنجاح" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // ده معناه إنه ملقاش اليوزر، أو إنه حاول يحذف أدمن
      return new Response(JSON.stringify({ error: "لا يمكن حذف هذا المستخدم (إما غير موجود أو أنه أدمن)" }), {
        status: 403, // 403 Forbidden
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
