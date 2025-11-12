/*
 * API Endpoint: /admin-get-family
 * (ملف جديد)
 * وظيفته: يجيب كل المستخدمين اللي تبع أسرة معينة
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

    // 🛑 هنجيب الاسم والايميل والرصيد (مش محتاجين الباسورد)
    const ps = db.prepare(
      "SELECT name, email, balance FROM users WHERE family = ?"
    );
    const results = await ps.bind(familyName).all();

    // لو الأسرة فاضية
    if (!results.results || results.results.length === 0) {
      return new Response(JSON.stringify({ users: [] }), { // رجع لستة فاضية
        status: 200, 
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
