/*
 * API Endpoint: /get-user-profile
 * (مُعدلة لإضافة "المستوى")
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email } = data; 

    if (!email) {
      return new Response(JSON.stringify({ error: "الإيميل غير موجود" }), { status: 400 });
    }

    // 🛑🛑 التعديل: إضافة "level" للـ SELECT 🛑🛑
    const ps = db.prepare("SELECT id, name, family, email, balance, role, profile_image_url, level FROM users WHERE email = ?");
    const user = await ps.bind(email).first();

    if (!user) {
        return new Response(JSON.stringify({ error: "المستخدم غير موجود" }), { status: 404 });
    }

    // رجع بيانات اليوزر (ستشمل المستوى أوتوماتيكياً)
    return new Response(JSON.stringify({ user: user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
