/*
 * API Endpoint: /admin-update-balance
 * (النسخة النهائية والمُحصنة)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    // 🛑 التعديل: استقبلنا حقل 'reason' ووضعنا له قيمة افتراضية.
    const { email, amount, reason } = data; 

    if (!email || typeof amount !== 'number') {
      return new Response(JSON.stringify({ error: "بيانات ناقصة (يجب إرسال إيميل وكمية رقمية)." }), { status: 400 });
    }

    // 🛑 تحصين بسيط: لمنع التحديث إذا كانت الكمية صفر
    if (amount === 0) {
        return new Response(JSON.stringify({ error: "لا يمكن تعديل الرصيد بقيمة صفر." }), { status: 400 });
    }

    // --- الخطوة 1: ابدأ "عملية" (Transaction) ---
    // (إنشاء سبب ديناميكي إذا لم يتم إرسال سبب محدد من الواجهة الأمامية)
    const transactionReason = reason || (amount > 0 ? "إضافة من الأدمن" : "خصم من الأدمن");
    
    const batch = [
      // 1. تحديث الرصيد
      db.prepare(
        "UPDATE users SET balance = balance + ? WHERE email = ?"
      ).bind(amount, email),

      // 2. أمر التسجيل في السجل الجديد
      db.prepare(
        "INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)"
      ).bind(email, amount, transactionReason)
    ];

    // --- الخطوة 2: نفذ العمليتين معاً ---
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
    // 🛑 التحصين ضد خطأ في الداتا بيز (500)
    return new Response(JSON.stringify({ error: `فشل داخلي في تحديث الرصيد: ${e.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
