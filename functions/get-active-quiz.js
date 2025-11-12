/*
 * API Endpoint: /get-active-quiz
 * (جديد - بتاع اليوزر)
 * وظيفته: يجيب السؤال النشط (لو اليوزر مجاوبش عليه)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const email = data.email; // هناخد ايميل اليوزر

    if (!email) {
      return new Response(JSON.stringify({ error: "لم يتم إرسال الإيميل" }), { status: 400 });
    }

    // 🛑 دي أهم خطوة:
    // 1. ابحث عن السؤال اللي (is_active = 1)
    // 2. اعمل "LEFT JOIN" مع جدول الإجابات
    // 3. الشرط: هاته "فقط" لو مفيش إجابة متسجلة لليوزر ده (ua.user_email IS NULL)
    const ps = db.prepare(`
      SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.points
      FROM quizzes q
      LEFT JOIN user_answers ua ON q.id = ua.quiz_id AND ua.user_email = ?
      WHERE q.is_active = 1 AND ua.user_email IS NULL
      LIMIT 1
    `);
    
    const quiz = await ps.bind(email).first();

    if (!quiz) {
      // لو مفيش سؤال جديد، أو اليوزر جاوب عليه خلاص
      return new Response(JSON.stringify({ error: "لا يوجد سؤال جديد متاح لك حالياً" }), {
        status: 404, // 404 Not Found
        headers: { "Content-Type": "application/json" }
      });
    }

    // رجع السؤال (من غير الإجابة الصح طبعاً)
    return new Response(JSON.stringify({ quiz: quiz }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
