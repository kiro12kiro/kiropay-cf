/*
 * API Endpoint: /submit-quiz-answer
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, quizId, selectedOption } = data; // لاحظ: quizId و selectedOption

    if (!email || !quizId || !selectedOption) {
      return new Response(JSON.stringify({ error: "بيانات الإجابة ناقصة" }), { status: 400 });
    }

    // 1. التأكد من عدم الإجابة مسبقاً
    const checkPs = db.prepare("SELECT * FROM user_answers WHERE user_email = ? AND quiz_id = ?");
    const existingAnswer = await checkPs.bind(email, quizId).first();

    if (existingAnswer) {
      return new Response(JSON.stringify({ error: "لقد أجبت بالفعل." }), { status: 403 });
    }

    // 2. جلب الإجابة الصحيحة
    const quizPs = db.prepare("SELECT correct_option, points FROM quizzes WHERE id = ?");
    const quiz = await quizPs.bind(quizId).first();

    if (!quiz) {
      return new Response(JSON.stringify({ error: "السؤال غير موجود" }), { status: 404 });
    }

    // 3. التحقق
    if (selectedOption === quiz.correct_option) {
      // --- إجابة صحيحة ---
      const batch = [
        // زيادة الرصيد
        db.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(quiz.points, email),
        // تسجيل المعاملة
        db.prepare("INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)")
          .bind(email, quiz.points, "مكافأة: إجابة صحيحة على سؤال اليوم"),
        // تسجيل أن المستخدم أجاب
        db.prepare("INSERT INTO user_answers (user_email, quiz_id, answered_correctly) VALUES (?, ?, 1)")
          .bind(email, quizId)
      ];
      await db.batch(batch);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `إجابة صحيحة! مبروك كسبت ${quiz.points} نقطة 🎉`,
        points_added: quiz.points
      }), { status: 200 });

    } else {
      // --- إجابة خاطئة ---
      await db.prepare("INSERT INTO user_answers (user_email, quiz_id, answered_correctly) VALUES (?, ?, 0)")
        .bind(email, quizId).run();

      return new Response(JSON.stringify({ 
        success: false, 
        message: "إجابة خاطئة 😔 حظ أوفر المرة القادمة." 
      }), { status: 200 });
    }

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
