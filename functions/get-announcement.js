/*
 * API Endpoint: /get-announcement
 * (جديد - بتاع الإعلانات)
 * وظيفته: قراءة نص الإعلان من KV
 */
export async function onRequestGet(context) {
  try {
    // 🛑 KIROPAY_KV هو الاسم اللي عملناه في الخطوة 1
    const text = await context.env.KIROPAY_KV.get('announcement');
    
    return new Response(JSON.stringify({ announcement: text || "" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
