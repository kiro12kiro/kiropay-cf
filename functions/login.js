/*
 * API Endpoint: /login
 * (النسخة الجديدة المُعدلة - بتجيب لينك الصورة)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, password } = data;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "الرجاء إدخال الإيميل والباسورد" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑🛑 التعديل الأول هنا 🛑🛑
    // ضفنا "profile_image_url" لأمر البحث
    const ps = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = await ps.bind(email).first();

    // (دي مقارنة غير آمنة بس للتجربة)
    if (user && user.password === password) {
      
      // 🛑🛑 التعديل الثاني هنا 🛑🛑
      // ضفنا "profile_image_url" للبيانات اللي بترجع
      const userData = {
        name: user.name,
        family: user.family,
        email: user.email,
        balance: user.balance,
        role: user.role, // اتأكدنا إن الـ role بيرجع عشان الأدمن
        profile_image_url: user.profile_image_url // ⬅️ دي الإضافة المهمة
      };
      
      return new Response(JSON.stringify({ success: true, user: userData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // لو البيانات غلط
      return new Response(JSON.stringify({ error: "الإيميل أو الباسورد خطأ" }), {
        status: 401, 
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
