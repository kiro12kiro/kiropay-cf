/*
 * API Endpoint: /admin-mass-update
 * (جديد - بتاع الـ Checkbox)
 * وظيفته: تعديل رصيد مجموعة من المستخدمين
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { emails, amount } = data; // هيجيلنا "لستة" ايميلات

    if (!emails || !Array.isArray(emails) || emails.length === 0 || !amount) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة أو خاطئة" }), { status: 400 });
    }

    // 1. حضّر "عملية" (Batch)
    let batch = [];
    
    // 2. اعمل "أمر" لكل إيميل في اللستة
    emails.forEach(email => {
      // أ. أمر تعديل الرصيد
      batch.push(
        db.prepare("UPDATE users SET balance = balance + ? WHERE email = ?")
          .bind(amount, email)
      );
      // ب. أمر تسجيل الحركة في السجل
      batch.push(
        db.prepare("INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)")
          .bind(email, amount, (amount > 0 ? "إضافة جماعية من الأدمن" : "خصم جماعي من الأدمن"))
      );
    });

    // 3. نفذ كل الأوامر دي مرة واحدة
    await db.batch(batch);

    // 4. رجع رسالة نجاح
    return new Response(JSON.stringify({ 
      success: true, 
      message: `تم تحديث رصيد ${emails.length} مستخدم بنجاح!` 
    }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
