/*
 * API Endpoint: /admin-get-items
 * وظيفته: جلب كل العقارات (المنتجات) من المتجر
 */
export async function onRequestGet(context) { // لاحظ: استخدمنا GET
  try {
    const db = context.env.DB;

    const ps = db.prepare("SELECT * FROM store_items ORDER BY price ASC");
    const results = await ps.all();

    return new Response(JSON.stringify({ items: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
