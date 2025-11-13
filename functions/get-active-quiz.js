/*
 * API Endpoint: /get-active-quiz
 * (الكود المُصحح والنهائي)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const email = data.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "الإيميل مطلوب" }), { status: 400 });
    }

    // هذا الاستعلام سيعمل الآن لأن user_answers موجود
    const ps = db.prepare(`
      SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.points
      FROM quizzes q
      LEFT JOIN user_answers ua ON q.id = ua.quiz_id AND ua.user_email = ?
      WHERE q.is_active = 1 AND ua.user_email IS NULL
      LIMIT 1
    `);

    const quiz = await ps.bind(email).first();

    if (!quiz) {
      return new Response(JSON.stringify({ error: "No active quiz" }), {
        status: 404, 
        headers: { "Content-Type": "application/json" }
      });
    }

    // 🛑🛑 هذا هو التعديل الثاني والمهم 🛑🛑
    // (إصلاح عدم تطابق الأسماء)
    const formattedQuiz = {
        id: quiz.id,
        question_text: quiz.question_text, // <-- تصحيح
        option_a: quiz.option_a,         // <-- تصحيح
        option_b: quiz.option_b,         // <-- تصحيح
        option_c: quiz.option_c,         // <-- تصحيح
        points: quiz.points
    };

    return new Response(JSON.stringify({ quiz: formattedQuiz }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
