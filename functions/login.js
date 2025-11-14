/*
 * API Endpoint: /login
 * (مُعدلة لإضافة "المستوى")
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

    // 🛑 SELECT * ستجلب المستوى أوتوماتيكياً (level)
    const ps = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = await ps.bind(email).first();

    // (دي مقارنة غير آمنة بس للتجربة)
    if (user && user.password === password) {
      
      const userData = {
        name: user.name,
        family: user.family,
        email: user.email,
        balance: user.balance,
        role: user.role, 
        profile_image_url: user.profile_image_url,
        level: user.level || 1 // 🛑🛑 التعديل: إضافة المستوى هنا 🛑🛑
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
