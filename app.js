document.addEventListener("DOMContentLoaded", () => {
  // --- مسك العناصر الأساسية ---
  // ( ... زي ما هي ... )
  
  // --- عناصر لوحة الأدمن ---
  // ( ... زي ما هي ... )
  const adminFamilyMessage = document.getElementById("admin-family-message");
  
  // 🛑🛑 عناصر فورم الأسئلة الجديدة 🛑🛑
  const adminQuizForm = document.getElementById("admin-quiz-form");
  const adminQuizMessage = document.getElementById("admin-quiz-message");
  
  // ( ... باقي المتغيرات زي ما هي ... )
  
  // --- فورم اللوجن (زي ما هو) ---
  loginForm.addEventListener("submit", async (event) => {
    // ( ... الكود زي ما هو ... )
  });

  // --- فانكشن سجل المعاملات (زي ما هي) ---
  async function loadTransactionHistory(email) {
    // ( ... الكود زي ما هو ... )
  }

  // --- فانكشن لوحة الصدارة (زي ما هي) ---
  async function loadLeaderboards() {
    // ( ... الكود زي ما هو ... )
  }

  // --- فانكشن مساعدة (زي ما هي) ---
  async function populateFamilyList(familyName, listElement) {
    // ( ... الكود زي ما هو ... )
  }

  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (زي ما هو) ---
  logoutBtn.addEventListener("click", () => {
    // ( ... الكود زي ما هو ... )
  });


  // --- كود "تغيير الصورة" (زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => {
      // ( ... الكود زي ما هو ... )
  });


  // 
  // --- أكواد الأدمن (مُعدلة) ---
  // 
  (function setupAdminPanel() {
      // ( ... كود فورم البحث زي ما هو ... )
      // ( ... كود فانكشن ملء الكارت زي ما هو ... )
      // ( ... كود الدروب ليست زي ما هو ... )
      // ( ... كود فانكشن تعديل الرصيد زي ما هو ... )
      // ( ... كود زراير الرصيد زي ما هو ... )
      // ( ... كود زرار الحذف زي ما هو ... )
      // ( ... كود زراير الأسر زي ما هو ... )

      // 🛑🛑 الكود الجديد: فورم إضافة سؤال 🛑🛑
      adminQuizForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        adminQuizMessage.textContent = "جاري إضافة السؤال...";
        adminQuizMessage.style.color = "blue";

        // 1. لم كل البيانات من الفورم
        const data = {
          question: document.getElementById("quiz-question").value,
          opt_a: document.getElementById("quiz-opt-a").value,
          opt_b: document.getElementById("quiz-opt-b").value,
          opt_c: document.getElementById("quiz-opt-c").value,
          correct_opt: document.getElementById("quiz-correct-opt").value,
          points: document.getElementById("quiz-points").value,
        };

        try {
          // 2. كلم الـ API الجديد
          const response = await fetch(`/admin-create-quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok) {
            adminQuizMessage.textContent = result.message;
            adminQuizMessage.style.color = "green";
            adminQuizForm.reset(); // فضي الفورم
          } else {
            adminQuizMessage.textContent = `فشل: ${result.error}`;
            adminQuizMessage.style.color = "red";
          }
        } catch (err) {
          adminQuizMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
          adminQuizMessage.style.color = "red";
        }
      });
      // 🛑🛑 نهاية الكود الجديد 🛑🛑

  })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
