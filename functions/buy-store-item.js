export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, item_id } = data;

    // 1. هات بيانات اليوزر (الرصيد)
    const user = await db.prepare("SELECT balance FROM users WHERE email = ?").bind(email).first();
    if (!user) return new Response(JSON.stringify({ error: "مستخدم غير موجود" }), { status: 404 });

    // 2. هات بيانات العقار (السعر)
    const item = await db.prepare("SELECT * FROM store_items WHERE id = ?").bind(item_id).first();
    if (!item) return new Response(JSON.stringify({ error: "عقار غير موجود" }), { status: 404 });

    // 3. اتأكد إن اليوزر مش شاري العقار ده قبل كده
    const owned = await db.prepare("SELECT id FROM user_unlocked_items WHERE user_email = ? AND item_id = ?")
                          .bind(email, item_id).first();
    if (owned) return new Response(JSON.stringify({ error: "أنت تملك هذا العقار بالفعل!" }), { status: 400 });

    // 4. اتأكد إن الرصيد يكفي
    if (user.balance < item.price) {
        return new Response(JSON.stringify({ error: `رصيدك غير كافٍ. تحتاج ${item.price} نقطة.` }), { status: 400 });
    }

    // 5. نفذ عملية الشراء (Batch Transaction)
    const batch = [
        // خصم الرصيد
        db.prepare("UPDATE users SET balance = balance - ? WHERE email = ?").bind(item.price, email),
        // تسجيل الملكية
        db.prepare("INSERT INTO user_unlocked_items (user_email, item_id) VALUES (?, ?)").bind(email, item_id),
        // تسجيل المعاملة في السجل
        db.prepare("INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)")
          .bind(email, -item.price, `شراء عقار: ${item.name}`)
    ];

    await db.batch(batch);

    return new Response(JSON.stringify({ success: true, message: `مبروك! تم شراء ${item.name} بنجاح.` }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
