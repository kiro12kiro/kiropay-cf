// 🛑 تم التحويل إلى صيغة Cloudflare Pages Function (onRequestGet)
export async function onRequestGet(context) {
    try {
        const db = context.env.DB; // الوصول لـ DB عن طريق context.env

        // 🛑🛑 التعديل: إضافة "required_level" للـ SELECT 🛑🛑
        const { results: items } = await db.prepare(
            'SELECT id, name, price, image_url, required_level FROM store_items'
        ).all();

        return new Response(JSON.stringify({ items }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error fetching store items:', error);
        return new Response(JSON.stringify({ error: `فشل في جلب عناصر المتجر: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
