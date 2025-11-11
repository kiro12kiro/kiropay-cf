document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  const userNameP = document.getElementById("user-name");
  const userFamilyP = document.getElementById("user-family");
  const userBalanceP = document.getElementById("user-balance");

  // --- فورم اللوجن ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // 🛑 بيكلم الـ API اللي في functions/login.js
      const response = await fetch(`/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) { // اتأكد إن الـ status code هو 2xx
        messageDiv.textContent = "تم تسجيل الدخول بنجاح!";
        messageDiv.style.color = "green";
        // املى بيانات الكارت
        const user = data.user;
        userNameP.textContent = `Name: ${user.name}`;
        userFamilyP.textContent = `Family: ${user.family}`;
        userBalanceP.textContent = `Balance: $${user.balance}`;
      } else {
        messageDiv.textContent = `فشل: ${data.error}`;
        messageDiv.style.color = "red";
      }
    } catch (err) {
      messageDiv.textContent = "حدث خطأ في الاتصال بالـ API.";
      messageDiv.style.color = "red";
    }
  });

  // --- فورم التسجيل ---
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري إنشاء حساب...";
    messageDiv.style.color = "blue";

    const name = document.getElementById("name").value;
    const family = document.getElementById("family").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      // 🛑 بيكلم الـ API اللي في functions/signup.js
      const response = await fetch(`/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, family, email, password }),
      });

      const data = await response.json();

      if (response.ok) { // اتأأكد إن الـ status code هو 2xx
        messageDiv.textContent = "تم إنشاء الحساب! تقدر تعمل لوجن دلوقتي.";
        messageDiv.style.color = "green";
        signupForm.reset(); // فضي الفورم
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
