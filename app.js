document.addEventListener("DOMContentLoaded", () => {
  // --- مسك العناصر الأساسية ---
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const formContainer = document.querySelector(".form-container");
  const cardContainer = document.querySelector(".card-container");
  const logoutBtn = document.getElementById("logout-btn");
  const refreshDataBtn = document.getElementById("refresh-data-btn"); 
  
  // --- عناصر كارت المستخدم (اللي عامل لوجن) ---
  const userNameP = document.getElementById("user-name");
  const userFamilyP = document.getElementById("user-family");
  const userBalanceP = document.getElementById("user-balance");
  const userAvatarImg = document.getElementById("user-avatar");
  const DEFAULT_AVATAR_URL = "/default-avatar.png";

  // --- عناصر السجل واللوحات ---
  const transactionList = document.getElementById("transaction-list");
  
  // --- عناصر تغيير الصورة ---
  const avatarUploadInput = document.getElementById("avatar-upload-input");
  const avatarOverlayLabel = document.getElementById("avatar-overlay-label");
  const signupAvatarFile = document.getElementById("signup-avatar-file"); 
  let loggedInUserProfile = null; 

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
  const userAnnouncementBox = document.getElementById("user-announcement-box"); // جديد
  const userAnnouncementText = document.getElementById("user-announcement-text"); // جديد
  const adminAnnouncementForm = document.getElementById("admin-announcement-form"); // جديد
  const adminAnnouncementText = document.getElementById("admin-announcement-text"); // جديد
  const adminAnnouncementMessage = document.getElementById("admin-announcement-message"); // جديد
  
  const massUpdateControls = document.getElementById("mass-update-controls");
  const selectedUsersCount = document.getElementById("selected-users-count");
  const massUpdateAmount = document.getElementById("mass-update-amount");
  const massUpdateAddBtn = document.getElementById("mass-update-add-btn"); 
  const massUpdateSubtractBtn = document.getElementById("mass-update-subtract-btn"); 
  const massUpdateMessage = document.getElementById("mass-update-message"); 
  let selectedUsersForMassUpdate = []; // لستة اليوزرز
  
  // --- عناصر لوحة الصدارة والكويز ---
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const topChampionsList = document.getElementById("top-champions-list");
  const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
  const familyMargergesList = document.getElementById("family-margerges-list");
  const familyAnbaKarasList = document.getElementById("family-anba-karas-list");
  const quizContainer = document.getElementById("quiz-container");
  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizBtnA = document.getElementById("quiz-btn-a");
  const quizBtnB = document.getElementById("quiz-btn-b");
  const quizBtnC = document.getElementById("quiz-btn-c");
  const quizOptionButtons = document.querySelectorAll(".quiz-option-btn");
  const quizSubmitBtn = document.getElementById("quiz-submit-btn");
  const quizMessage = document.getElementById("quiz-message");
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; 
  let currentQuizId = null; 
  let selectedOption = null; 

  // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة (عشان الـ display) 🛑
  cardContainer.style.display = "none";
  formContainer.style.display = "flex"; 
  logoutBtn.style.display = "none";
  refreshDataBtn.style.display = "none"; 
  adminPanelDiv.style.display = "none";
  leaderboardContainer.style.display = "none";
  quizContainer.style.display = "none";
  avatarOverlayLabel.style.display = "none";
  massUpdateControls.style.display = "none";
  userAnnouncementBox.style.display = "none"; // اخفاء الإعلان
  
  // (فانكشن تصغير الصورة - زي ما هي)
  function resizeImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        // ... (الكود زي ما هو)
    });
  }

  // 🛑🛑 فانكشن تحديث البيانات (Refresh) 🛑🛑
  async function refreshUserData() {
      if (!loggedInUserProfile) return; 

      refreshDataBtn.textContent = "جاري التحديث...";
      
      try {
          const response = await fetch(`/get-user-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loggedInUserProfile.email }),
          });
          const data = await response.json();
          
          if (!response.ok) throw new Error("فشل الحصول على بيانات المستخدم");
          
          const user = data.user;
          loggedInUserProfile = user; // تحديث البروفايل في الـ JS

          // 2. تحديث الكارت
          userNameP.textContent = `Name: ${user.name}`;
          userFamilyP.textContent = `Family: ${user.family}`;
          userBalanceP.textContent = `Balance: $${user.balance}`;
          userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL; 
          
          // 3. تحديث باقي الأقسام
          await loadTransactionHistory(user.email);
          if (user.role !== 'admin') {
              await loadLeaderboards();
              await loadActiveQuiz(user.email);
              await loadAnnouncement(); // 🛑 جيب الإعلان
          }

          refreshDataBtn.textContent = "تحديث البيانات";
      } catch(err) {
          refreshDataBtn.textContent = "فشل التحديث";
          console.error("Refresh Error:", err);
      }
  }

  // --- فورم اللوجن (مُعدل لمنع الريفرش) ---
  loginForm.addEventListener("submit", async (event) => {
    // 🛑🛑 التحصين الجديد والأقوى 🛑🛑
    event.preventDefault(); 
    event.stopPropagation();
    // 🛑🛑 نهاية التحصين 🛑🛑
    
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
        
        // 🛑 تخزين بروفايل اليوزر 🛑
        loggedInUserProfile = user;
        
        // (ملء الكارت)
        userNameP.textContent = `Name: ${user.name}`;
        userFamilyP.textContent = `Family: ${user.family}`;
        userBalanceP.textContent = `Balance: $${user.balance}`;
        userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL; 
        
        // (إظهار الكارت)
        cardContainer.style.display = "flex";
        formContainer.style.display = "none";
        logoutBtn.style.display = "block";
        refreshDataBtn.style.display = "block"; 
        avatarOverlayLabel.style.display = "flex"; 
        
        // (جلب السجل - ده مشترك للكل)
        await loadTransactionHistory(user.email); 

        if (user.role === 'admin') {
          // --- لو هو أدمن ---
          messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
          adminPanelDiv.style.display = "block"; 
          leaderboardContainer.style.display = "none"; 
          userAnnouncementBox.style.display = "none";
        } else {
          // --- لو هو يوزر عادي ---
          await loadLeaderboards(); 
          await loadActiveQuiz(user.email);
          await loadAnnouncement(); // 🛑 جيب الإعلان
          leaderboardContainer.style.display = "block"; 
          adminPanelDiv.style.display = "none"; 
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
  
  // 🛑 ربط زرار الريفرش 🛑
  refreshDataBtn.addEventListener('click', refreshUserData);


  // --- فانكشن سجل المعاملات (مُحصنة - زي ما هي) ---
  async function loadTransactionHistory(email) { /* ... */ }

  // --- فانكشن لوحة الصدارة (زي ما هي) ---
  async function loadLeaderboards() { /* ... */ }
  async function populateFamilyList(familyName, listElement) { /* ... */ }
  async function loadActiveQuiz(email) { /* ... */ }

  // 🛑🛑 فانكشن جديدة: جلب الإعلانات 🛑🛑
  async function loadAnnouncement() {
    try {
      const response = await fetch(`/get-announcement`, { method: "GET" }); 
      if (response.ok) {
        const data = await response.json();
        if (data.announcement && data.announcement.trim() !== "") {
          userAnnouncementText.textContent = data.announcement;
          userAnnouncementBox.style.display = "block";
        } else {
          userAnnouncementBox.style.display = "none";
        }
      }
    } catch (err) {
      console.error("فشل جلب الإعلان:", err);
      userAnnouncementBox.style.display = "none";
    }
  }


  // --- فورم التسجيل (Signup) (زي ما هي) ---
  signupForm.addEventListener("submit", async (event) => { /* ... */ });


  // --- زرار تسجيل الخروج (مُعدل - زي ما هو) ---
  logoutBtn.addEventListener("click", () => { /* ... */ });


  // --- كود "تغيير الصورة" (مُعدل ليستخدم التصغير - زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => { /* ... */ });

  // --- أكواد الكويز (زي ما هي) ---
  quizOptionButtons.forEach(button => { /* ... */ });
  quizSubmitBtn.addEventListener("click", async () => { /* ... */ });
  
  // 
  // --- أكواد الأدمن (كلها رجعت تاني) ---
  // 
  (function setupAdminPanel() {
      // --- 1. فورم البحث بالاسم ---
      adminSearchForm.addEventListener("submit", async (event) => { /* ... */ });

      // --- فانكشن ملء الكارت ---
      function populateAdminCard(user) { /* ... */ }

      // --- كود الدروب ليست ---
      adminSelectUser.addEventListener("change", () => { /* ... */ });

      // --- فانكشن تعديل الرصيد الجماعي ---
      async function handleMassUpdate(amount) { /* ... */ }

      // --- زراير الرصيد (الفردي) ---
      addBalanceBtn.addEventListener("click", () => { /* ... */ });
      subtractBalanceBtn.addEventListener("click", () => { /* ... */ });

      // --- زرار حذف المستخدم ---
      deleteUserBtn.addEventListener("click", async () => { /* ... */ });

      // --- كود زراير الأسر (🛑 مع إضافة Checkbox) ---
      familyButtons.forEach(button => {
        button.addEventListener("click", async () => {
            // ... (الكود اللي بيجيب اللستة)
            try {
                // ... (fetch)
                const users = data.users;
                
                if (users.length === 0) {
                    // ... (عرض رسالة لا يوجد مستخدمين)
                } else {
                    // ... (عرض رسالة عدد المستخدمين)
                    
                    users.forEach(user => {
                        const userItem = document.createElement("div");
                        userItem.className = "family-user-item";
                        
                        // 🛑 إنشاء Checkbox (الإصلاح المطلوب)
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.className = "mass-update-checkbox";
                        checkbox.dataset.email = user.email; 
                        
                        const userInfo = document.createElement("div");
                        userInfo.className = "user-info";
                        // ... (ملء بيانات اليوزر)
                        
                        userInfo.addEventListener('click', () => { /* ... */ });

                        userItem.appendChild(checkbox);
                        userItem.appendChild(userInfo);
                        adminFamilyResultsDiv.appendChild(userItem);
                    });
                    
                    // ...
                }
                
            } catch (err) {
                // ...
            }
        });
      });
      
      // 🛑 كود متابعة الـ Checkboxes وتحديث اللوحة الجماعية 🛑
      adminFamilyResultsDiv.addEventListener('change', (e) => { /* ... */ });
      
      // (ربط زراير التعديل الجماعي)
      massUpdateAddBtn.addEventListener('click', () => { /* ... */ });
      massUpdateSubtractBtn.addEventListener('click', () => { /* ... */ });
      
      // --- كود فورم إضافة سؤال (مع الـ preventDefault) ---
      adminQuizForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // 🛑 التأكد من منع إعادة التحميل
        // ... (باقي الكود)
      });
      
      // 🛑 كود فورم الإعلانات (مع الـ preventDefault) 🛑
      adminAnnouncementForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // 🛑🛑 الإصلاح: منع تسجيل الخروج 🛑🛑
        // ... (باقي الكود)
      });
      
  })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
