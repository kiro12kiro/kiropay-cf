document.addEventListener("DOMContentLoaded", () => {
  // --- مسك العناصر الأساسية ---
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const formContainer = document.querySelector(".form-container");
  const cardContainer = document.querySelector(".card-container");
  const logoutBtn = document.getElementById("logout-btn");

  // --- عناصر كارت المستخدم (اللي عامل لوجن) ---
  const userNameP = document.getElementById("user-name");
  const userFamilyP = document.getElementById("user-family");
  const userBalanceP = document.getElementById("user-balance");
  const userAvatarImg = document.getElementById("user-avatar");
  const DEFAULT_AVATAR_URL = "/default-avatar.png";

  // --- عناصر السجل ---
  const transactionList = document.getElementById("transaction-list");

  // --- عناصر تغيير الصورة ---
  const avatarUploadInput = document.getElementById("avatar-upload-input");
  const avatarOverlayLabel = document.getElementById("avatar-overlay-label");
  const signupAvatarFile = document.getElementById("signup-avatar-file"); 
  let loggedInUserEmail = null; 

  // --- بيانات Cloudinary ---
  const CLOUDINARY_CLOUD_NAME = "Dhbanzq4n"; 
  const CLOUDINARY_UPLOAD_PRESET = "kiropay_upload"; 
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // --- عناصر لوحة الأدمن ---
  const adminPanelDiv = document.getElementById("admin-panel");
  const adminSearchForm = document.getElementById("admin-search-form");
  const adminSearchInput = document.getElementById("admin-search-name");
  // ... (باقي عناصر الأدمن)
  const adminFamilyMessage = document.getElementById("admin-family-message");
  const adminQuizForm = document.getElementById("admin-quiz-form");
  const adminQuizMessage = document.getElementById("admin-quiz-message");
  
  // --- عناصر لوحة الصدارة ---
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const topChampionsList = document.getElementById("top-champions-list");
  // ... (باقي عناصر لوحة الصدارة)
  
  // 🛑🛑 عناصر الكويز الجديدة 🛑🛑
  const quizContainer = document.getElementById("quiz-container");
  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizBtnA = document.getElementById("quiz-btn-a");
  const quizBtnB = document.getElementById("quiz-btn-b");
  const quizBtnC = document.getElementById("quiz-btn-c");
  const quizOptionButtons = document.querySelectorAll(".quiz-option-btn");
  const quizSubmitBtn = document.getElementById("quiz-submit-btn");
  const quizMessage = document.getElementById("quiz-message");

  let currentQuizId = null; // عشان نخزن رقم السؤال
  let selectedOption = null; // عشان نخزن إجابة اليوزر

  // --- فورم اللوجن (مُعدل) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // إخفاء كل حاجة
    adminPanelDiv.style.display = "none";
    transactionList.innerHTML = ""; 
    leaderboardContainer.style.display = "none"; 
    quizContainer.style.display = "none"; // 🛑 اخفي الكويز

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
        
        // (ملء الكارت)
        userNameP.textContent = `Name: ${user.name}`;
        userFamilyP.textContent = `Family: ${user.family}`;
        userBalanceP.textContent = `Balance: $${user.balance}`;
        userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL; 
        
        // (إظهار الكارت)
        cardContainer.style.display = "flex";
        formContainer.style.display = "none";
        logoutBtn.style.display = "block";
        avatarOverlayLabel.style.display = "flex"; 
        loggedInUserEmail = user.email; 
        
        // (جلب السجل - ده مشترك للكل)
        await loadTransactionHistory(user.email); 

        if (user.role === 'admin') {
          // --- لو هو أدمن ---
          messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
          adminPanelDiv.style.display = "block"; 
          leaderboardContainer.style.display = "none"; 
        } else {
          // --- لو هو يوزر عادي ---
          await loadLeaderboards(); 
          leaderboardContainer.style.display = "block"; 
          adminPanelDiv.style.display = "none"; 
          // 🛑 جيب الكويز
          await loadActiveQuiz(user.email);
        }
        
      } else {
        messageDiv.textContent = `فشل: ${data.error}`;
        messageDiv.style.color = "red";
      }
    } catch (err) {
      messageDiv.textContent = "حدث خطأ في الاتصال بالـ API.";
      messageDiv.style.color = "red";
    }
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

  // 🛑🛑 فانكشن جديدة: جلب الكويز النشط 🛑🛑
  async function loadActiveQuiz(email) {
    try {
      const response = await fetch(`/get-active-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- لو فيه سؤال جديد ---
        const quiz = data.quiz;
        quizQuestionText.textContent = `${quiz.question_text} (+${quiz.points} نقطة)`;
        quizBtnA.textContent = quiz.option_a;
        quizBtnB.textContent = quiz.option_b;
        quizBtnC.textContent = quiz.option_c;
        currentQuizId = quiz.id; // خزن رقم السؤال

        // تصفير الفورم
        quizMessage.textContent = "";
        selectedOption = null;
        quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
        quizSubmitBtn.disabled = false;

        quizContainer.style.display = "block"; // اظهر الكويز
      } else {
        // --- لو مفيش سؤال (أو جاوب عليه) ---
        console.log(data.error); // اطبع الرسالة في الكونسول
        quizContainer.style.display = "none"; // اخفي الكويز
      }
    } catch (err) {
      console.error("فشل جلب الكويز:", err);
      quizContainer.style.display = "none";
    }
  }


  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (مُعدل) ---
  logoutBtn.addEventListener("click", () => {
    // ( ... كود اللوج أوت زي ما هو ... )
    cardContainer.style.display = "none";
    formContainer.style.display = "flex";
    // ...
    transactionList.innerHTML = ""; 
    leaderboardContainer.style.display = "none";
    quizContainer.style.display = "none"; // 🛑 اخفي الكويز
  });


  // --- كود "تغيير الصورة" (زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => {
      // ( ... الكود زي ما هو ... )
  });

  // 🛑🛑 أكواد جديدة: لوجيك الكويز لليوزر 🛑🛑

  // 1. لما اليوزر يختار إجابة
  quizOptionButtons.forEach(button => {
    button.addEventListener("click", () => {
      // شيل علامة "selected" من كله
      quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
      // حطها على الزرار ده بس
      button.classList.add('selected');
      // خزن القيمة
      selectedOption = button.dataset.value; 
    });
  });

  // 2. لما اليوزر يدوس "إرسال الإجابة"
  quizSubmitBtn.addEventListener("click", async () => {
    if (!selectedOption) {
      quizMessage.textContent = "الرجاء اختيار إجابة أولاً";
      quizMessage.style.color = "red";
      return;
    }

    quizMessage.textContent = "جاري التأكد من الإجابة...";
    quizMessage.style.color = "blue";
    quizSubmitBtn.disabled = true; // اقفل الزرار

    try {
      const response = await fetch(`/submit-quiz-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedInUserEmail,
          quiz_id: currentQuizId,
          selected_option: selectedOption
        })
      });

      const data = await response.json();

      if (data.success) {
        // --- لو الإجابة صح ---
        quizMessage.textContent = data.message;
        quizMessage.style.color = "green";
        // حدث الرصيد في الكارت (يدوي)
        const currentBalance = parseFloat(userBalanceP.textContent.replace('Balance: $', ''));
        userBalanceP.textContent = `Balance: $${currentBalance + data.points_added}`;
        // حدث سجل المعاملات
        await loadTransactionHistory(loggedInUserEmail);
      } else {
        // --- لو الإجابة غلط ---
        quizMessage.textContent = data.message;
        quizMessage.style.color = "red";
      }

      // اخفي الكويز بعد 3 ثواني (سواء صح أو غلط)
      setTimeout(() => {
        quizContainer.style.display = "none";
      }, 3000);

    } catch (err) {
      quizMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
      quizMessage.style.color = "red";
      quizSubmitBtn.disabled = false; // رجع الزرار
    }
  });


  // 
  // --- أكواد الأدمن (كلها زي ما هي) ---
  // 
  (function setupAdminPanel() {
      // ( ... كل أكواد الأدمن زي ما هي ... )

      // 🛑 كود فورم إضافة سؤال (اللي ضفناه المرة اللي فاتت)
      adminQuizForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        adminQuizMessage.textContent = "جاري إضافة السؤال...";
        adminQuizMessage.style.color = "blue";

        const data = {
          question: document.getElementById("quiz-question").value,
          opt_a: document.getElementById("quiz-opt-a").value,
          opt_b: document.getElementById("quiz-opt-b").value,
          opt_c: document.getElementById("quiz-opt-c").value,
          correct_opt: document.getElementById("quiz-correct-opt").value,
          points: document.getElementById("quiz-points").value,
        };

        try {
          const response = await fetch(`/admin-create-quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok) {
            adminQuizMessage.textContent = result.message;
            adminQuizMessage.style.color = "green";
            adminQuizForm.reset(); 
          } else {
            adminQuizMessage.textContent = `فشل: ${result.error}`;
            adminQuizMessage.style.color = "red";
          }
        } catch (err) {
          adminQuizMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
          adminQuizMessage.style.color = "red";
        }
      });
      
  })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
