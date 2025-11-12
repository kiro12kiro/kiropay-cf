/*
 * API Endpoint: /get-top-users
 * (جديد - بتاع لوحة الصدارة)
 * وظيفته: يجيب أكتر 10 مستخدمين معاهم رصيد
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;

    // 🛑 ابحث في جدول users، رتبهم تنازلياً (DESC) حسب الرصيد، وهات أول 10 بس
    const ps = db.prepare(
      "SELECT name, family, balance FROM users ORDER BY balance DESC LIMIT 10"
    );
    
    const results = await ps.bind().all();

    return new Response(JSON.stringify({ users: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
