/*
 * API Endpoint: /admin-get-family
 * (لتفعيل الـ Checkboxes ولوحة الأدمن)
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

    // 🛑 التعديل: جلب كل الحقول الضرورية (بما فيها EMAIL)
    const ps = db.prepare(
      "SELECT name, email, balance, family, profile_image_url FROM users WHERE family = ?"
    );
    const results = await ps.bind(familyName).all();

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
    // 🛑 تحصين ضد خطأ 500 
    return new Response(JSON.stringify({ error: `فشل داخلي في جلب بيانات الأسرة للأدمن: ${e.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
