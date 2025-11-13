/*
 * API Endpoint: /admin-delete-item
 * وظيفته: حذف عقار من المتجر (وسيتم حذفه من ممتلكات اليوزرز بسبب ON DELETE CASCADE)
 */
export async function onRequestPost(context) { // لاحظ: استخدمنا POST للحذف
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { item_id } = data;

    if (!item_id) {
      return new Response(JSON.stringify({ error: "ID العقار مطلوب" }), { status: 400 });
    }

    const ps = db.prepare("DELETE FROM store_items WHERE id = ?");
    await ps.bind(item_id).run();

    return new Response(JSON.stringify({ success: true, message: "تم حذف العقار بنجاح" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
