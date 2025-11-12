/*
 * API Endpoint: /admin-search
 * (هذا الملف ضروري لعمل زر البحث الفردي)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const nameToSearch = data.name;

    if (!nameToSearch) {
      return new Response(JSON.stringify({ error: "الرجاء إدخال اسم" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 🛑 ابحث عن أي اسم يطابق (بغض النظر عن حالة الأحرف)
    const ps = db.prepare(
      "SELECT name, family, email, balance FROM users WHERE name LIKE ? COLLATE NOCASE"
    );
    
    const results = await ps.bind(`%${nameToSearch}%`).all();

    if (results.results.length === 0) {
      return new Response(JSON.stringify({ error: "لا يوجد مستخدمين بهذا الاسم" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

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
