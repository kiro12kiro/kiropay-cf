/*
 * API Endpoint: /get-family-top-10
 * (جديد - بتاع لستات الأسر)
 * وظيفته: يجيب أعلى 10 في أسرة معينة
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const familyName = data.family; // هناخد اسم الأسرة من الـ JS

    if (!familyName) {
      return new Response(JSON.stringify({ error: "لم يتم إرسال اسم الأسرة" }), { status: 400 });
    }

    // 🛑 ابحث عن اليوزرز اللي في الأسرة دي بس، واخفي الأدمن، ورتبهم، وهات 10
    const ps = db.prepare(
      "SELECT name, balance FROM users WHERE family = ? AND role != 'admin' ORDER BY balance DESC LIMIT 10"
    );
    
    const results = await ps.bind(familyName).all();

    return new Response(JSON.stringify({ users: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
