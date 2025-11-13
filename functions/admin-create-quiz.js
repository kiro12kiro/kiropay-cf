/*
 * API Endpoint: /admin-create-quiz
 * (مُصحح ليتطابق مع الأسماء المرسلة من app.js)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    
    // 🛑 التعديل هنا: الأسماء يجب أن تطابق ما يرسله app.js
    // app.js يرسل: question, opt_a, opt_b, opt_c, correct_opt, points
    const { question, opt_a, opt_b, opt_c, correct_opt, points } = data;

    // 2. التحقق من البيانات (باستخدام الأسماء الجديدة)
    if (!question || !opt_a || !opt_b || !opt_c || !correct_opt || !points) {
      return new Response(JSON.stringify({ error: "الرجاء ملء جميع الحقول (خطأ من الباك إند)" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 3. جعل كل الأسئلة القديمة غير نشطة
    await db.prepare("UPDATE quizzes SET is_active = 0").run();

    // 4. حضّر أمر الإدخال (باستخدام أسماء الداتا بيز الصحيحة)
    const ps = db.prepare(
      `INSERT INTO quizzes (question_text, option_a, option_b, option_c, correct_option, points, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`
    );
    
    // 5. نفذ الأمر بالبيانات الصحيحة
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
