export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { item_id } = data;

    if (!item_id) return new Response(JSON.stringify({ error: "ID مطلوب" }), { status: 400 });

    await db.prepare("DELETE FROM store_items WHERE id = ?").bind(item_id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
