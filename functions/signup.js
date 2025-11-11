/*
 * API Endpoint: /signup (Version 3 - With Cloudinary Upload)
 */

// دي الصورة الافتراضية لو المستخدم مرافعش صورة
const DEFAULT_AVATAR_URL = "https://via.placeholder.com/100"; 

// --- دالة مساعدة عشان نرفع لـ Cloudinary ---
// (دي بتستخدم المفاتيح السرية اللي خزناها)
async function uploadToCloudinary(fileStream, context) {
  const cloudName = context.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = context.env.CLOUDINARY_API_KEY;
  const apiSecret = context.env.CLOUDINARY_API_SECRET;

  // 1. بنعمل "توقيع" (Signature) عشان الأمان
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureString = `timestamp=${timestamp}${apiSecret}`;
  const signature = await crypto.subtle.digest(
    'SHA-1',
    new TextEncoder().encode(signatureString)
  ).then(buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

  // 2. بنجهز الفورم اللي هنبعتها لـ Cloudinary
  const formData = new FormData();
  formData.append('file', fileStream);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  // (اختياري: ممكن نحط الصورة في فولدر)
  // formData.append('folder', 'kiropay-avatars'); 

  // 3. بنعمل طلب الرفع
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  
  // 4. بنرجع الرابط الآمن (https) للصورة
  return data.secure_url;
}
// --- نهاية الدالة المساعدة ---


export async function onRequestPost(context) {
  try {
    const db = context.env.DB;

    // بنقرأ الفورم داتا (عشان الملف)
    const formData = await context.request.formData();

    const name = formData.get('name');
    const family = formData.get('family');
    const email = formData.get('email');
    const password = formData.get('password');
    const file = formData.get('avatar'); // ده الملف

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "الرجاء ملء جميع الحقول" }), { status: 400 });
    }

    let imageUrl = DEFAULT_AVATAR_URL; // القيمة الافتراضية

    // 1. لو المستخدم رفع ملف صورة
    if (file && file.size > 0 && file.type.startsWith("image/")) {
      // 2. ارفع الصورة على Cloudinary
      imageUrl = await uploadToCloudinary(file, context);
    }

    // 3. احفظ بيانات المستخدم (مع رابط الصورة) في D1
    // ⚠️ تحذير أمان: الباسورد لا يزال غير مشفر
    const ps = db.prepare(
      "INSERT INTO users (name, family, email, password, profile_image_url) VALUES (?, ?, ?, ?, ?)"
    );
    await ps.bind(name, family, email, password, imageUrl).run();

    return new Response(JSON.stringify({ success: true, message: "User created!" }), { status: 200 });

  } catch (e) {
    if (e.message.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "هذا الإيميل مسجل من قبل" }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
