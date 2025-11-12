/*
 * API Endpoint: /admin-get-family
 * (جديد)
 * وظيفته يجيب كل المستخدمين اللي في أسرة معينة
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const familyName = data.family;

    if (!familyName) {
      return new Response(JSON.stringify({ error: "الرجاء إرسال اسم الأسرة" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 هنجيب الاسم والرصيد (زي ما طلبت)
    const ps = db.prepare("SELECT name, balance FROM users WHERE family = ? ORDER BY name ASC");
    const results = await ps.bind(familyName).all();

    // لو مفيش ولا واحد
    if (!results.results || results.results.length === 0) {
      return new Response(JSON.stringify({ error: "لا يوجد مستخدمين مسجلين في هذه الأسرة" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 رجع "لستة" المستخدمين
    return new Response(JSON.stringify({ users: results.results }), {
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
