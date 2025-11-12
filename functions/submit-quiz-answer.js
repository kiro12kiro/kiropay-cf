/*
 * API Endpoint: /submit-quiz-answer
 * (جديد - بتاع اليوزر)
 * وظيفته: يستقبل الإجابة، يدي النقط، ويسجل الإجابة
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, quiz_id, selected_option } = data;

    if (!email || !quiz_id || !selected_option) {
      return new Response(JSON.stringify({ error: "بيانات الإجابة ناقصة" }), { status: 400 });
    }

    // --- الخطوة 1: اتأكد (تاني) إن اليوزر مجاوبش قبل كده ---
    const checkPs = db.prepare("SELECT * FROM user_answers WHERE user_email = ? AND quiz_id = ?");
    const existingAnswer = await checkPs.bind(email, quiz_id).first();
    
    if (existingAnswer) {
      return new Response(JSON.stringify({ error: "لقد أجبت على هذا السؤال من قبل" }), { status: 403 }); // 403 Forbidden
    }

    // --- الخطوة 2: هات الإجابة الصح والنقط من الداتا بيز ---
    const quizPs = db.prepare("SELECT correct_option, points FROM quizzes WHERE id = ? AND is_active = 1");
    const quiz = await quizPs.bind(quiz_id).first();

    if (!quiz) {
      return new Response(JSON.stringify({ error: "السؤال غير موجود أو غير نشط" }), { status: 404 });
    }

    // --- الخطوة 3: قارن الإجابات ---
    if (selected_option === quiz.correct_option) {
      // --- لو الإجابة صح ---

      // 1. حضّر "عملية" (Batch)
      const batch = [
        // أ. زود الرصيد
        db.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(quiz.points, email),
        // ب. سجل في سجل المعاملات
        db.prepare("INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)")
          .bind(email, quiz.points, "نقاط إجابة السؤال"),
        // ج. سجل إنه جاوب (صح)
        db.prepare("INSERT INTO user_answers (user_email, quiz_id, answered_correctly) VALUES (?, ?, 1)")
          .bind(email, quiz_id)
      ];
      
      // 2. نفذ كله مع بعض
      await db.batch(batch);
      
      // 3. رجع رسالة النجاح
      return new Response(JSON.stringify({ 
        success: true, 
        message: `إجابة صحيحة! +${quiz.points} نقطة`,
        points_added: quiz.points
      }), { status: 200 });

    } else {
      // --- لو الإجابة غلط ---

      // 1. سجل إنه جاوب (غلط) عشان ميجاوبش تاني
      const ps = db.prepare("INSERT INTO user_answers (user_email, quiz_id, answered_correctly) VALUES (?, ?, 0)");
      await ps.bind(email, quiz_id).run();

      // 2. رجع رسالة
      return new Response(JSON.stringify({ 
        success: false, 
        message: "إجابة خاطئة. حظ أوفر المرة القادمة!" 
      }), { status: 200 });
    }

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
