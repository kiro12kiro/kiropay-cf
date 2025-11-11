document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  const userNameP = document.getElementById("user-name");
  const userFamilyP = document.getElementById("user-family");
  const userBalanceP = document.getElementById("user-balance");
  const userAvatarImg = document.getElementById("user-avatar"); // 🛑 مسكنا الصورة

  // 🛑 الصورة الافتراضية
  const DEFAULT_AVATAR_URL = "https://via.placeholder.com/100";

  // --- فورم اللوجن (مُعدل لعرض الصورة) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.textContent = "تم تسجيل الدخول بنجاح!";
        messageDiv.style.color = "green";
        
        const user = data.user;
        userNameP.textContent = `Name: ${user.name}`;
        userFamilyP.textContent = `Family: ${user.family}`;
        userBalanceP.textContent = `Balance: $${user.balance}`;
        
        // 🛑 السطر الجديد: عرض الصورة
        // لو المستخدم معندوش صورة (null) هنستخدم الافتراضية
        userAvatarImg.src = user.profile_image_url || DEFAULT_AVATAR_URL; 
        
      } else {
        messageDiv.textContent = `فشل: ${data.error}`;
        messageDiv.style.color = "red";
      }
    } catch (err) {
      messageDiv.textContent = "حدث خطأ في الاتصال بالـ API.";
      messageDiv.style.color = "red";
    }
  });

  // --- فورم التسجيل (مُعدل لرفع الصورة) ---
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري إنشاء حساب...";
    messageDiv.style.color = "blue";

    // 1. مبنستخدمش JSON، بنستخدم FormData عشان نبعت الملف
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('family', document.getElementById('family').value);
    formData.append('email', document.getElementById('signup-email').value);
    formData.append('password', document.getElementById('signup-password').value);
    
    // 2. ضيف الملف (لو موجود)
    const avatarFile = document.getElementById('avatar-file').files[0];
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      // 3. ابعت الفورم (المتصفح هيحط الـ Content-Type الصح لوحده)
      const response = await fetch(`/signup`, {
        method: "POST",
        body: formData, // مش بنحول لـ JSON
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.textContent = "تم إنشاء الحساب! تقدر تعمل لوجن دلوقتي.";
        messageDiv.style.color = "green";
        signupForm.reset();
      } else {
        messageDiv.textContent = `فشل: ${data.error}`;
        messageDiv.style.color = "red";
      }
    } catch (err) {
      messageDiv.textContent = "حدث خطأ في الاتصال بالـ API.";
      messageDiv.style.color = "red";
    }
  });
});
