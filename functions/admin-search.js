/*
 * API Endpoint: /admin-search
 * بيبحث عن مستخدم بالاسم (أو جزء من الاسم)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { name } = data;

    if (!name) {
      return new Response(JSON.stringify({ error: "الرجاء إدخال اسم للبحث" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 بنستخدم LIKE عشان نبحث عن أي اسم "يحتوي على" الحروف دي
    const query = "SELECT name, family, email, balance, role FROM users WHERE name LIKE ?";
    // بنضيف % % عشان الـ LIKE
    const user = await db.prepare(query).bind(`%${name}%`).first();

    if (user) {
      // لو لقينا المستخدم
      return new Response(JSON.stringify({ success: true, user: user }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // لو ملقيناش
      return new Response(JSON.stringify({ error: "لم يتم العثور على مستخدم بهذا الاسم" }), {
        status: 404, // 404 Not Found
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
