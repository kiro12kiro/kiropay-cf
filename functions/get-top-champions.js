/*
 * API Endpoint: /get-top-champions
 * (مُصحح لإظهار صور البروفايل)
 * وظيفته: يجيب أعلى مستخدم واحد من كل أسرة
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;

    // 🛑 التعديل هنا: تمت إضافة profile_image_url
    const ps = db.prepare(`
      SELECT name, family, balance, profile_image_url 
      FROM (
        SELECT name, family, balance, profile_image_url,
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
