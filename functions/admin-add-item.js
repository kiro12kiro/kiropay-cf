/*
 * API Endpoint: /admin-add-item
 * وظيفته: إضافة عقار جديد (منتج) إلى المتجر
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { name, price, image_url } = data;

    if (!name || !price) {
      return new Response(JSON.stringify({ error: "الاسم والسعر مطلوبان" }), { status: 400 });
    }
    
    // التأكد من أن السعر رقم صحيح
    const itemPrice = parseInt(price);
    if (isNaN(itemPrice) || itemPrice <= 0) {
        return new Response(JSON.stringify({ error: "السعر يجب أن يكون رقماً صحيحاً أكبر من صفر" }), { status: 400 });
    }

    const ps = db.prepare(
      "INSERT INTO store_items (name, price, image_url) VALUES (?, ?, ?)"
    );
    const result = await ps.bind(name, itemPrice, image_url || null).run();

    // جلب المنتج الذي تم إضافته للتو لإرجاعه
    const newItem = await db.prepare("SELECT * FROM store_items WHERE id = ?")
                           .bind(result.meta.last_row_id)
                           .first();

    return new Response(JSON.stringify({ success: true, item: newItem }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    // معالجة خطأ لو الاسم مكرر (UNIQUE)
    if (e.message.includes("UNIQUE constraint failed")) {
         return new Response(JSON.stringify({ error: "فشل الإضافة: اسم هذا العقار موجود بالفعل" }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
