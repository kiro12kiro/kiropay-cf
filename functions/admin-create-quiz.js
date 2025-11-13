/*
 * API Endpoint: /admin-create-quiz
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();

    // استقبال البيانات بالأسماء الموحدة
    const { question, optionA, optionB, optionC, correctOption, points } = data;

    // التحقق من البيانات
    if (!question || !optionA || !optionB || !optionC || !correctOption || !points) {
      return new Response(JSON.stringify({ error: "البيانات غير مكتملة من المصدر." }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 1. إلغاء تنشيط الأسئلة القديمة
    await db.prepare("UPDATE quizzes SET is_active = 0").run();

    // 2. إدخال السؤال الجديد
    // نستخدم أسماء الأعمدة في الجدول (question_text, option_a, ...)
    const ps = db.prepare(
      `INSERT INTO quizzes (question_text, option_a, option_b, option_c, correct_option, points, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`
    );

    await ps.bind(question, optionA, optionB, optionC, correctOption, parseInt(points)).run();

    return new Response(JSON.stringify({ success: true, message: "تم نشر السؤال الجديد!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
