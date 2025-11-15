/*
 * API Endpoint: /guest-get-family
 * (جديدة - للجيست)
 * الوظيفة: جلب "كل" مستخدمي الأسرة (مرتبين بالنقاط)
 */
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const { family } = await context.request.json();

        if (!family) {
            return new Response(JSON.stringify({ error: 'اسم العائلة مطلوب.' }), { status: 400 });
        }

        // 🛑🛑 نفس الكود القديم لكن "بدون LIMIT 10" 🛑🛑
        // وبرضه بنفلتر اليوزر العادي بس
        const { results } = await db.prepare(
            "SELECT name, balance FROM users WHERE family = ? AND role = 'user' ORDER BY balance DESC"
        ).bind(family).all();

        return new Response(JSON.stringify({ users: results }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (e) {
        console.error("Guest Get Family Error:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
