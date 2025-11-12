/*
 * API Endpoint: /get-family-ranks
 * (جديد - بتاع لوحة الصدارة)
 * وظيفته: يجيب مجموع رصيد كل أسرة
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;

    // 🛑 اجمع (SUM) الرصيد لكل أسرة (GROUP BY family)
    // ورتبهم تنازلياً
    const ps = db.prepare(
      "SELECT family, SUM(balance) as total_balance FROM users GROUP BY family ORDER BY total_balance DESC"
    );
    
    const results = await ps.bind().all();

    return new Response(JSON.stringify({ families: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
