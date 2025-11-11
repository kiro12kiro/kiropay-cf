/*
 * API Endpoint: /admin-update-balance
 * بيضيف أو يخصم رصيد (لو الرقم بالسالب)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, amount } = data; // email المستخدم اللي هنعدله, amount الكمية

    if (!email || !amount) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🛑 السحر هنا: بنستخدم `balance = balance + ?`
    // لو الـ amount موجب هيضيف، لو سالب هيخصم
    const query = "UPDATE users SET balance = balance + ? WHERE email = ? RETURNING balance";
    const result = await db.prepare(query).bind(amount, email).first();

    if (result) {
      return new Response(JSON.stringify({ success: true, new_balance: result.balance }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "لم يتم العثور على المستخدم" }), {
        status: 404,
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
