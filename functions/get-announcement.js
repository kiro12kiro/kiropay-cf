/*
 * API Endpoint: /get-announcement
 * (جديد - بتاع الإعلانات)
 * وظيفته: قراءة نص الإعلان من KV
 */
export async function onRequestPost(context) { // 🛑 استخدام POST لسهولة استدعائه من app.js
  try {
    // 🛑 KIROPAY_KV هو الاسم الذي تم ربطه
    const text = await context.env.KIROPAY_KV.get('current_announcement');
    
    // 🛑 إرجاع النص في حقل "message" ليتطابق مع ما يتوقعه app.js
    return new Response(JSON.stringify({ message: text || "" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
