/*
 * API Endpoint: /admin-update-balance
 * (النسخة الجديدة - بتسجل في جدول transactions)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, amount } = data; // amount can be positive or negative

    if (!email || !amount) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة" }), { status: 400 });
    }

    // --- الخطوة 1: ابدأ "عملية" (Transaction) ---
    // ده بيضمن إن الخطوتين (التحديث والإدخال) يحصلوا مع بعض
    const batch = [
      // 1. حضّر أمر التحديث (زي القديم)
      db.prepare(
        "UPDATE users SET balance = balance + ? WHERE email = ?"
      ).bind(amount, email),

      // 2. 🛑 حضّر أمر التسجيل في السجل الجديد
      db.prepare(
        "INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)"
      ).bind(email, amount, (amount > 0 ? "إضافة من الأدمن" : "خصم من الأدمن"))
    ];

    // --- الخطوة 2: نفذ العمليتين مع بعض ---
    await db.batch(batch);

    // --- الخطوة 3: هات الرصيد الجديد عشان نرجعه ---
    const userPs = db.prepare("SELECT balance FROM users WHERE email = ?");
    const user = await userPs.bind(email).first();

    // 4. رجع رسالة النجاح
    return new Response(JSON.stringify({
      success: true,
      message: "تم تحديث الرصيد وتسجيل الحركة",
      new_balance: user.balance
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
