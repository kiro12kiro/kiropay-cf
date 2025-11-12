/*
 * API Endpoint: /update-avatar
 * (ملف جديد)
 * وظيفته: تحديث لينك صورة المستخدم في الداتا بيز
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email, newAvatarUrl } = data; // هيجيلنا الايميل واللينك الجديد

    if (!email || !newAvatarUrl) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 🛑 أمر التحديث: حدث جدول users، وخلي profile_image_url = ؟؟؟ لما الايميل = ؟؟؟
    const ps = db.prepare(
      "UPDATE users SET profile_image_url = ? WHERE email = ?"
    );
    
    // نفذ الأمر
    await ps.bind(newAvatarUrl, email).run();

    // رجّع رسالة نجاح
    return new Response(JSON.stringify({ 
        success: true, 
        message: "تم تحديث الصورة!", 
        newUrl: newAvatarUrl // رجع اللينك الجديد عشان نعرضه
    }), {
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
