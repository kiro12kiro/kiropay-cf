/*
 * API Endpoint: /signup
 * ده الكود اللي هيسجل مستخدم جديد
 */
export async function onRequestPost(context) {
  try {
    // 1. احصل على الداتا بيز (اللي ربطناها باسم "DB")
    const db = context.env.DB;

    // 2. اقرأ البيانات اللي جاية من الواجهة (app.js)
    const data = await context.request.json();
    const { name, family, email, password } = data;

    // 3. اتأكد إن البيانات كاملة
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "الرجاء ملء جميع الحقول" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // ⚠️ تحذير أمان: ده مثال بسيط. في الحقيقة لازم تشفر الباسورد (Hashing)
    
    // 4. حضّر أمر الإدخال للداتا بيز
    const ps = db.prepare(
      "INSERT INTO users (name, family, email, password) VALUES (?, ?, ?, ?)"
    );
    // 5. نفذ الأمر بالبيانات
    await ps.bind(name, family, email, password).run();

    // 6. رجّع رسالة نجاح
    return new Response(JSON.stringify({ success: true, message: "User created!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    // لو الإيميل متكرر أو حصل خطأ
    if (e.message.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "هذا الإيميل مسجل من قبل" }), {
        status: 409, // 409 Conflict
        headers: { "Content-Type": "application/json" },
      });
    }
    // أي خطأ تاني
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
