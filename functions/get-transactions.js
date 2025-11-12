/*
 * API Endpoint: /get-transactions
 * (ملف جديد)
 * وظيفته: يجيب سجل الحركات بتاع يوزر معين
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const email = data.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "لم يتم إرسال الإيميل" }), { status: 400 });
    }

    // 🛑 ابحث في جدول transactions عن كل الحركات بتاعة الايميل ده
    // ورتبهم من الأحدث للأقدم (DESC)
    const ps = db.prepare(
      "SELECT amount, reason, timestamp FROM transactions WHERE user_email = ? ORDER BY timestamp DESC"
    );
    
    const results = await ps.bind(email).all();

    return new Response(JSON.stringify({ history: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
