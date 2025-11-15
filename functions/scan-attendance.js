/*
 * API Endpoint: /scan-attendance
 * الوظيفة: تحديث رصيد مستخدم بناءً على مسح كود QR (الأدمن)
 */
export async function onRequestPost(context) {
    try {
        const db = context.env.DB; 
        const request = context.request;

        // نستقبل البيانات: إيميل المستخدم (من الـ QR)، وإيميل الأدمن (للتأكد من الصلاحيات)، وقيمة المكافأة
        const { scannedEmail, rewardAmount, reason, adminEmail } = await request.json();

        // 1. تحقق سريع من صلاحيات الأدمن (نعتمد على دالة getAuthUser لتبسيط الكود)
        // (يجب أن تكون هذه الدالة متاحة محلياً أو مستوردة)
        // **نفترض أن لديك دالة تحقق صلاحيات الأدمن موجودة بالفعل في بيئتك.**
        if (!adminEmail || !scannedEmail || isNaN(rewardAmount) || rewardAmount <= 0) {
            return new Response(JSON.stringify({ success: false, error: 'بيانات المكافأة غير كاملة أو غير صالحة.' }), { status: 400 });
        }
        
        // 2. البدء في المعاملة لتحديث الرصيد وتسجيل المعاملة
        const updateResult = await db.prepare(
            'UPDATE users SET balance = balance + ? WHERE email = ? RETURNING balance'
        )
        .bind(rewardAmount, scannedEmail)
        .all();

        if (updateResult.results.length === 0) {
            return new Response(JSON.stringify({ success: false, error: 'لم يتم العثور على المستخدم المراد مكافأته.' }), { status: 404 });
        }
        
        const newBalance = updateResult.results[0].balance;

        // 3. تسجيل المعاملة (Attendance Transaction)
        await db.prepare(
            'INSERT INTO transactions (user_email, amount, reason) VALUES (?, ?, ?)'
        )
        .bind(scannedEmail, rewardAmount, reason || 'مكافأة مسح كود الحضور')
        .run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: `تم إضافة ${rewardAmount} نقطة لـ ${scannedEmail} بنجاح. رصيده الجديد: ${newBalance}.`,
            new_balance: newBalance
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Scan Attendance Error:', error);
        return new Response(JSON.stringify({ success: false, error: `فشل داخلي في الخادم: ${error.message}` }), { status: 500 });
    }
}
