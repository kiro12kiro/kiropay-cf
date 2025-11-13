export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const data = await context.request.json();
    const { email } = data;

    // 1. هات كل العقارات
    const allItems = await db.prepare("SELECT * FROM store_items").all();
    
    // 2. هات العقارات اللي اليوزر ده اشتراها
    const myItems = await db.prepare("SELECT item_id FROM user_unlocked_items WHERE user_email = ?")
                            .bind(email).all();
    
    // تحويل قائمة الممتلكات لمصفوفة أرقام بسيطة [1, 5, 7]
    const myItemIds = myItems.results.map(row => row.item_id);

    return new Response(JSON.stringify({ 
        store_items: allItems.results,
        owned_ids: myItemIds
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
