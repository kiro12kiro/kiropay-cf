/*
 * API Endpoint: /signup
 * (النسخة الجديدة - بتقرأ FormData وبتحط الصورة الافتراضية)
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;

    // 1. اقرأ البيانات كـ FormData (عشان ملف الصورة)
    const formData = await context.request.formData();

    // 2. اسحب البيانات
    const name = formData.get("name");
    const family = formData.get("family");
    const email = formData.get("email");
    const password = formData.get("password");
    // "avatar" هو الاسم اللي باعتينه من app.js
    const avatarFile = formData.get("avatar"); 

    // 3. اتأكد إن البيانات كاملة
    if (!name || !email || !password || !family) {
      return new Response(JSON.stringify({ error: "الرجاء ملء جميع الحقول" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 4. 🛑🛑 اللوجيك الجديد بتاع الصورة 🛑🛑
    let imageUrlToSave = null; // القيمة اللي هتتسجل في الداتا بيز

    if (avatarFile && avatarFile.size > 0) {
      // لو اليوزر رفع صورة
      // (هنا المفروض نرفع الصورة على R2 وناخد اللينك)
      // (بما إننا معملناش R2، هنسيبها null)
      imageUrlToSave = null; 
      console.log("User uploaded an avatar, but R2 is not configured.");
    } else {
      // لو اليوزر *معملش* رفع صورة
      // 🛑 هنسجل المسار بتاع الصورة الافتراضية
      imageUrlToSave = "/default-avatar.png";
    }
    
    // 5. حضّر أمر الإدخال للداتا بيز
    const ps = db.prepare(
      // 🛑 اتأكد إننا بنضيف "profile_image_url"
      "INSERT INTO users (name, family, email, password, profile_image_url) VALUES (?, ?, ?, ?, ?)"
    );
    
    // 6. نفذ الأمر بالبيانات الجديدة
    await ps.bind(name, family, email, password, imageUrlToSave).run();

    // 7. رجّع رسالة نجاح
    return new Response(JSON.stringify({ success: true, message: "User created!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    if (e.message.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "هذا الإيميل مسجل من قبل" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
