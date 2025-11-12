/*
 * API Endpoint: /get-top-champions
 * (جديد - بتاع أبطال الأسر)
 * وظيفته: يجيب أعلى مستخدم واحد من كل أسرة
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;

    // 🛑 ده كود SQL معقد شوية (Window Function)
    // معناه: قسم اليوزرز حسب الأسرة، رتبهم، هات رقم 1 بس من كل قسم
    // واتأكد إنه مش أدمن
    const ps = db.prepare(`
      SELECT name, family, balance 
      FROM (
        SELECT name, family, balance,
               ROW_NUMBER() OVER(PARTITION BY family ORDER BY balance DESC) as rn
        FROM users
        WHERE role != 'admin' AND family IS NOT NULL AND family != ''
      ) as ranked_users 
      WHERE rn = 1
      ORDER BY balance DESC
    `);
    
    const results = await ps.bind().all();

    return new Response(JSON.stringify({ champions: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
