export async function onRequestGet(context) {
  try {
    const db = context.env.DB;
    const ps = db.prepare("SELECT * FROM store_items");
    const results = await ps.all();

    return new Response(JSON.stringify({ items: results.results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
