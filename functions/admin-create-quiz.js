/*
 * API Endpoint: /admin-create-quiz
 * (جديد - بتاع الأدمن)
 * وظيفته: إضافة سؤال جديد في جدول quizzes
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    
    // 1. اسحب كل البيانات من الفورم
    const { question, opt_a, opt_b, opt_c, correct_opt, points } = data;

    // 2. اتأكد إن كل حاجة مبعوتة
    if (!question || !opt_a || !opt_b || !opt_c || !correct_opt || !points) {
      return new Response(JSON.stringify({ error: "الرجاء ملء جميع الحقول" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 3. (اختياري) ممكن نعمل كل الأسئلة القديمة "غير نشطة"
    // عشان السؤال الجديد ده يبقى هو الوحيد اللي شغال
    await db.prepare("UPDATE quizzes SET is_active = 0").run();

    // 4. حضّر أمر الإدخال
    const ps = db.prepare(
      `INSERT INTO quizzes (question_text, option_a, option_b, option_c, correct_option, points, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)` // 1 = is_active
    );
    
    // 5. نفذ الأمر
    await ps.bind(question, opt_a, opt_b, opt_c, correct_opt, parseInt(points)).run();

    // 6. رجّع رسالة نجاح
    return new Response(JSON.stringify({ success: true, message: "تم إضافة السؤال بنجاح!" }), {
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
