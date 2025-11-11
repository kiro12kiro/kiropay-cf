/*
 * API Endpoint: /login
 * ده الكود اللي هيعمل لوجن للمستخدم
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

    // 1. حضّر أمر البحث عن المستخدم
    const ps = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = await ps.bind(email).first();

    // 2. اتأكد إن المستخدم موجود وإن الباسورد صح
    // ⚠️ تحذير أمان: دي مقارنة غير آمنة. (لأغراض التجربة فقط)
    if (user && user.password === password) {
      // 3. رجّع بيانات المستخدم (من غير الباسورد)
      const userData = {
        name: user.name,
        family: user.family,
        email: user.email,
        balance: user.balance,
      };
      return new Response(JSON.stringify({ success: true, user: userData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // لو البيانات غلط
      return new Response(JSON.stringify({ error: "الإيميل أو الباسورد خطأ" }), {
        status: 401, // 401 Unauthorized
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
