// File Name: get-unlocked-items.js
// الوصف: يجلب قائمة بالعناصر التي اشتراها المستخدم المحدد.
export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const request = context.request;

        const { email } = await request.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'الإيميل مفقود.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛑🛑 استخدام JOIN لجلب بيانات المنتج ووقت الشراء 🛑🛑
        const query = `
            SELECT 
                si.name, 
                si.image_url, 
                si.description, 
                si.price,
                uui.purchased_at 
            FROM user_unlocked_items uui
            JOIN store_items si ON uui.item_id = si.id
            WHERE uui.user_email = ?
            ORDER BY uui.purchased_at DESC
        `;

        const { results: items } = await db.prepare(query).bind(email).all();

        return new Response(JSON.stringify({ success: true, items: items }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Unlocked items fetch error:', error);
        return new Response(JSON.stringify({ success: false, error: `فشل في جلب المشتريات: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
