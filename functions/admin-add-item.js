export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { name, price, image_url } = data;

    if (!name || !price) {
      return new Response(JSON.stringify({ error: "الاسم والسعر مطلوبان" }), { status: 400 });
    }
    
    const itemPrice = parseInt(price);
    if (isNaN(itemPrice) || itemPrice <= 0) {
        return new Response(JSON.stringify({ error: "السعر يجب أن يكون رقماً صحيحاً أكبر من صفر" }), { status: 400 });
    }

    // Upsert Logic: إدخال جديد أو تحديث القديم إذا كان الاسم موجوداً
    const ps = db.prepare(`
      INSERT INTO store_items (name, price, image_url) VALUES (?, ?, ?)
      ON CONFLICT(name) DO UPDATE SET
      price = excluded.price,
      image_url = excluded.image_url
    `);
    
    await ps.bind(name, itemPrice, image_url || null).run();

    // جلب العقار بعد التعديل
    const item = await db.prepare("SELECT * FROM store_items WHERE name = ?").bind(name).first();

    return new Response(JSON.stringify({ success: true, item: item }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
