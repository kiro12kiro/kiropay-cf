/*
 * API Endpoint: /get-transactions
 * (الكود المُصحح)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const email = data.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "لم يتم إرسال الإيميل" }), { status: 400 });
    }

    // 🛑 التعديل الأول: تم تغيير timestamp إلى created_at
    const ps = db.prepare(
      "SELECT amount, reason, created_at FROM transactions WHERE user_email = ? ORDER BY created_at DESC"
    );

    const results = await ps.bind(email).all();

    // 🛑 التعديل الثاني: تم تغيير المفتاح 'history' إلى 'transactions'
    // ليتطابق مع ما يتوقعه app.js
    return new Response(JSON.stringify({ transactions: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
