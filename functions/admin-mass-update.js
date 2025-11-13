/*
 * API Endpoint: /admin-mass-update
 * (النسخة المُحسّنة لإرجاع العدد)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    
    const { emails, amount, reason } = data; 

    if (!emails || !Array.isArray(emails) || emails.length === 0 || !amount) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة أو خاطئة" }), { status: 400 });
    }

    const transactionReason = reason || (amount > 0 ? "إضافة جماعية من الأدمن" : "خصم جماعي من الأدمن");

    let batch = [];
    
    emails.forEach(email => {
      batch.push(
        db.prepare("UPDATE users SET balance = balance + ? WHERE email = ?")
          .bind(amount, email)
      );
      batch.push(
        db.prepare("INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)")
          .bind(email, amount, transactionReason)
      );
    });

    await db.batch(batch);

    // 🛑🛑🛑 هذا هو التعديل 🛑🛑🛑
    // أضفنا updated_count ليتطابق مع ما يتوقعه app.js
    return new Response(JSON.stringify({ 
      success: true, 
      message: `تم تحديث رصيد ${emails.length} مستخدم بنجاح!`,
      updated_count: emails.length // <-- الإضافة الجديدة
    }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
