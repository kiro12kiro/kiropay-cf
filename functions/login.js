/*
 * API Endpoint: /login (مُعدل عشان يرجع الـ role)
 * ده الكود اللي بيشتغل لما حد يدوس "دخول"
 */
export async function onRequestPost(context) {
  try {
    // 1. الاتصال بالداتا بيز
    const db = context.env.DB;
    
    // 2. قراءة الإيميل والباسورد اللي المستخدم كتبهم
    const data = await context.request.json();
    const { email, password } = data;

    // 3. التأكد إن الحقول مش فاضية
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "الرجاء إدخال الإيميل والباسورد" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. تحضير أمر البحث عن المستخدم
    // (🛑 تعديل: طلبنا الـ role والـ profile_image_url)
    const ps = db.prepare("SELECT name, family, email, balance, role, profile_image_url, password FROM users WHERE email = ?");
    const user = await ps.bind(email).first();

    // 5. التأكد إن المستخدم موجود وإن الباسورد صح
    // (⚠️ تنبيه: دي مقارنة باسورد غير آمنة، بنستخدمها للتجربة فقط)
    if (user && user.password === password) {
      
      // 6. تحضير بيانات المستخدم اللي هترجع للواجهة (من غير الباسورد)
      const userData = {
        name: user.name,
        family: user.family,
        email: user.email,
        balance: user.balance,
        role: user.role, // 🛑 تعديل: رجعنا الـ role (عشان نعرف ده أدمن ولا لأ)
        profile_image_url: user.profile_image_url // 🛑 تعديل: رجعنا الصورة
      };
      
      // 7. إرسال رسالة نجاح ومعاها بيانات المستخدم
      return new Response(JSON.stringify({ success: true, user: userData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      
    } else {
      // لو البيانات غلط (الإيميل أو الباسورد)
      return new Response(JSON.stringify({ error: "الإيميل أو الباسورد خطأ" }), {
        status: 401, // 401 Unauthorized
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (e) {
    // لو حصل أي خطأ في السيرفر
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
