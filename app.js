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
  const adminSearchMessage = document.getElementById("admin-search-message");
  const adminResultsListDiv = document.getElementById("admin-results-list");
  const adminSelectUser = document.getElementById("admin-select-user");
  const searchedUserCard = document.getElementById("admin-searched-user-card");
  const searchedUserName = document.getElementById("searched-user-name");
  const searchedUserFamily = document.getElementById("searched-user-family");
  const searchedUserEmail = document.getElementById("searched-user-email");
  const searchedUserBalance = document.getElementById("searched-user-balance");
  const balanceAmountInput = document.getElementById("admin-balance-amount");
  const addBalanceBtn = document.getElementById("admin-add-balance-btn");
  const subtractBalanceBtn = document.getElementById("admin-subtract-balance-btn");
  const balanceMessage = document.getElementById("admin-balance-message");
  const deleteUserBtn = document.getElementById("admin-delete-user-btn");
  const deleteMessage = document.getElementById("admin-delete-message");
  const familyButtons = document.querySelectorAll(".family-btn"); 
  const adminFamilyResultsDiv = document.getElementById("admin-family-results");
  const adminFamilyMessage = document.getElementById("admin-family-message");
  const adminQuizForm = document.getElementById("admin-quiz-form");
  const adminQuizMessage = document.getElementById("admin-quiz-message");
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; 

  // --- عناصر لوحة الصدارة ---
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const topChampionsList = document.getElementById("top-champions-list");
  const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
  const familyMargergesList = document.getElementById("family-margerges-list");
  const familyAnbaKarasList = document.getElementById("family-anba-karas-list");
  
  // --- عناصر الكويز ---
  const quizContainer = document.getElementById("quiz-container");
  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizBtnA = document.getElementById("quiz-btn-a");
  const quizBtnB = document.getElementById("quiz-btn-b");
  const quizBtnC = document.getElementById("quiz-btn-c");
  const quizOptionButtons = document.querySelectorAll(".quiz-option-btn");
  const quizSubmitBtn = document.getElementById("quiz-submit-btn");
  const quizMessage = document.getElementById("quiz-message");
  let currentQuizId = null; 
  let selectedOption = null; 

  // (فرض الحالة الأولية الصحيحة عند فتح الصفحة)
  cardContainer.style.display = "none";
  formContainer.style.display = "flex"; 
  logoutBtn.style.display = "none";
  adminPanelDiv.style.display = "none";
  leaderboardContainer.style.display = "none";
  quizContainer.style.display = "none";
  avatarOverlayLabel.style.display = "none";
  
  // (فانكشن تصغير الصورة - زي ما هي)
  function resizeImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('فشل في ضغط الصورة'));
            }
          }, 'image/jpeg', quality); 
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  }


  // --- فورم اللوجن (زي ما هو) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // إخفاء كل حاجة
    adminPanelDiv.style.display = "none";
    transactionList.innerHTML = ""; 
    leaderboardContainer.style.display = "none"; 
    quizContainer.style.display = "none"; 

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
          await loadActiveQuiz(user.email);
        }
        
      } else {
        messageDiv.textContent = `فشل: ${data.error}`;
        messageDiv.style.color = "red";
      }
    } catch (err) {
      // 🛑 ده الـ catch اللي بيطلعلك الرسالة
      messageDiv.textContent = "حدث خطأ في الاتصال بالـ API.";
      messageDiv.style.color = "red";
    }
  });

  // --- فانكشن سجل المعاملات (زي ما هي) ---
  async function loadTransactionHistory(email) {
    transactionList.innerHTML = ""; 
    try {
      const response = await fetch(`/get-transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      // 🛑 تعديل بسيط هنا (زي اللي هنعمله تحت)
      if (!response.ok) {
        // لو فشل (زي 404 أو 500)
        console.error("فشل جلب السجل");
        transactionList.innerHTML = `<li class="no-history" style="color: red;">فشل جلب السجل</li>`;
        return; // اخرج من الفانكشن
      }

      const data = await response.json(); // دلوقتي إحنا متأكدين إنه .json
      
      if (data.history && data.history.length > 0) {
        data.history.forEach(item => {
          const li = document.createElement("li");
          const amountClass = item.amount > 0 ? "positive" : "negative";
          const amountSign = item.amount > 0 ? "+" : "";
          const date = new Date(item.timestamp).toLocaleString('ar-EG', { 
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          }); 
          li.innerHTML = `
            <span>
                ${item.reason}
                <small style="color: #777; display: block;">(${date})</small>
            </span>
            <span class="amount ${amountClass}">${amountSign}${item.amount} نقطة</span>
          `;
          transactionList.appendChild(li);
        });
      } else {
        transactionList.innerHTML = `<li class="no-history">لا يوجد معاملات سابقة</li>`;
      }
    } catch (err) {
      transactionList.innerHTML = `<li class="no-history" style="color: red;">${err.message}</li>`;
    }
  }

  // --- فانكشن لوحة الصدارة (زي ما هي) ---
  async function loadLeaderboards() {
    // ( ... الكود زي ما هو ... )
  }

  // --- فانكشن مساعدة (زي ما هي) ---
  async function populateFamilyList(familyName, listElement) {
    // ( ... الكود زي ما هو ... )
  }

  // 🛑🛑 فانكشن جلب الكويز (مُعدلة ومحصنة) 🛑🛑
  async function loadActiveQuiz(email) {
    try {
      const response = await fetch(`/get-active-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      // 🛑 التعديل المهم هنا 🛑
      // 1. اتأكد الأول إن الرد "نجاح" (200 OK)
      if (response.ok) {
        // --- لو فيه سؤال جديد ---
        const data = await response.json(); // اقرأ الـ JSON
        const quiz = data.quiz;
        quizQuestionText.textContent = `${quiz.question_text} (+${quiz.points} نقطة)`;
        quizBtnA.textContent = quiz.option_a;
        quizBtnB.textContent = quiz.option_b;
        quizBtnC.textContent = quiz.option_c;
        currentQuizId = quiz.id; 

        // تصفير الفورم
        quizMessage.textContent = "";
        selectedOption = null;
        quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
        quizSubmitBtn.disabled = false;

        quizContainer.style.display = "block"; // اظهر الكويز
      
      } else {
        // --- لو مفيش سؤال (404) أو (جاوب عليه) ---
        // (مش محتاجين نقرأ الـ JSON)
        console.log("لا يوجد سؤال جديد متاح"); 
        quizContainer.style.display = "none"; // اخفي الكويز
      }

    } catch (err) {
      // ده هيشتغل لو النت فصل أو الـ API مش موجود
      console.error("فشل جلب الكويز:", err);
      quizContainer.style.display = "none";
    }
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

  // --- أكواد الكويز (زي ما هي) ---
  quizOptionButtons.forEach(button => {
    // ( ... الكود زي ما هو ... )
  });
  quizSubmitBtn.addEventListener("click", async () => {
    // ( ... الكود زي ما هو ... )
  });
  
  // --- أكواد الأدمن (كلها زي ما هي) ---
  (function setupAdminPanel() {
      // ( ... الكود زي ما هو ... )
  })(); // نهاية أكواد الأدمن

}); // نهاية "DOMContentLoaded"
