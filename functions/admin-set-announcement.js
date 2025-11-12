/*
 * API Endpoint: /admin-set-announcement
 * (لحفظ الإعلان في KV)
 */
export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    // 🛑 التحقق من وجود الحقل الصحيح الذي يرسله app.js
    const newText = data.message || ""; 
    
    // 🛑 KIROPAY_KV هو الاسم الذي تم ربطه. نستخدم نفس الـ Key للجلب.
    await context.env.KIROPAY_KV.put('current_announcement', newText);
    
    return new Response(JSON.stringify({ success: true, message: "تم نشر الإعلان!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
