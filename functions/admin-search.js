/*
 * API Endpoint: /admin-search
 * (النسخة الجديدة - بترجع لستة مستخدمين)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const nameToSearch = data.name;

    if (!nameToSearch) {
      return new Response(JSON.stringify({ error: "الرجاء إدخال اسم" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 التعديل هنا:
    // 1. استخدمنا LIKE عشان نجيب كل الأسماء اللي "شبه" الاسم ده
    // 2. استخدمنا .all() عشان نجيب "لستة" كاملة، مش .first()
    const ps = db.prepare("SELECT * FROM users WHERE name LIKE ?");
    // بنضيف % عشان يبحث عن أي حاجة فيها الاسم ده
    const results = await ps.bind(`%${nameToSearch}%`).all();

    // لو مفيش ولا واحد
    if (!results.results || results.results.length === 0) {
      return new Response(JSON.stringify({ error: "لا يوجد مستخدمين بهذا الاسم" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 رجع "لستة" المستخدمين كلها
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
