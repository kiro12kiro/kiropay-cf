/*
 * API Endpoint: /get-user-profile
 * (جديد - لتحديث بيانات الكارت بعد الريفرش)
 * وظيفته: يجيب كل بيانات اليوزر (بدون الباسورد) عن طريق الإيميل
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email } = data; // هيجيلنا الإيميل المخزن في app.js

    if (!email) {
      return new Response(JSON.stringify({ error: "الإيميل غير موجود" }), { status: 400 });
    }

    // ابحث عن اليوزر وهات كل البيانات ماعدا الباسورد
    const ps = db.prepare("SELECT id, name, family, email, balance, role, profile_image_url FROM users WHERE email = ?");
    const user = await ps.bind(email).first();

    if (!user) {
        return new Response(JSON.stringify({ error: "المستخدم غير موجود" }), { status: 404 });
    }

    // رجع بيانات اليوزر
    return new Response(JSON.stringify({ user: user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
