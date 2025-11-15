/*
 * API Endpoint: /get-top-champions
 * (مُعدل لاستثناء الأدمن والجيست)
 */
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 

        // 🛑🛑 التعديل هنا 🛑🛑
        // أضفنا "WHERE role = 'user'" للـ query
        const { results } = await db.prepare(
            "SELECT name, balance, profile_image_url FROM users WHERE role = 'user' ORDER BY balance DESC LIMIT 3"
        ).all();

        return new Response(JSON.stringify({ champions: results }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (e) {
        console.error("Get Top Champions Error:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
