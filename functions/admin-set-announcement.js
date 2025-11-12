/*
 * API Endpoint: /admin-set-announcement
 * (جديد - بتاع الإعلانات)
 * وظيفته: حفظ نص الإعلان في KV
 */
export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const newText = data.text || ""; // لو بعت فاضي، امسحه
    
    // 🛑 KIROPAY_KV هو الاسم اللي عملناه في الخطوة 1
    await context.env.KIROPAY_KV.put('announcement', newText);
    
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
