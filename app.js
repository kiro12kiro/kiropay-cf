document.addEventListener("DOMContentLoaded", () => {
  // --- مسك العناصر الأساسية ---
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const formContainer = document.querySelector(".form-container");
  const cardContainer = document.querySelector(".card-container");
  const logoutBtn = document.getElementById("logout-btn");

  // --- عناصر كارت المستخدم ---
  const userNameP = document.getElementById("user-name");
  const userFamilyP = document.getElementById("user-family");
  const userBalanceP = document.getElementById("user-balance");
  const userAvatarImg = document.getElementById("user-avatar");
  const DEFAULT_AVATAR_URL = "/default-avatar.png";
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
  
  // 🛑 عناصر الإعلانات (جديد) 🛑
  const userAnnouncementBox = document.getElementById("user-announcement-box");
  const userAnnouncementText = document.getElementById("user-announcement-text");
  const adminAnnouncementForm = document.getElementById("admin-announcement-form");
  const adminAnnouncementText = document.getElementById("admin-announcement-text");
  const adminAnnouncementMessage = document.getElementById("admin-announcement-message");

  // 🛑 عناصر التعديل الجماعي (جديد) 🛑
  const massUpdateControls = document.getElementById("mass-update-controls");
  const selectedUsersCount = document.getElementById("selected-users-count");
  const massUpdateAmount = document.getElementById("mass-update-amount");
  const massUpdateAddBtn = document.getElementById("mass-update-add-btn");
  const massUpdateSubtractBtn = document.getElementById("mass-update-subtract-btn");
  const massUpdateMessage = document.getElementById("mass-update-message");
  let selectedUsersForMassUpdate = []; // لستة اليوزرز
  
  // --- عناصر لوحة الصدارة ---
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const topChampionsList = document.getElementById("top-champions-list");
  const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
  const familyMargergesList = document.getElementById("family-margerges-list");
  const familyAnbaKarasList = document.getElementById("family-anba-karas-list");
  
  // --- عناصر الكويز ---
  const quizContainer = document.getElementById("quiz-container");
  // ... (باقي عناصر الكويز)
  
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; 
  let currentQuizId = null; 
  let selectedOption = null; 

  // 🛑🛑 الحل الجديد (بتاع الريفرش) 🛑🛑
  // (هنا بنشغل كل حاجة)
  
  /**
   * الفانكشن دي بتخفي كل حاجة وتظهر شاشة اللوجن
   */
  function showLoginScreen() {
    cardContainer.style.display = "none";
    formContainer.style.display = "flex"; 
    logoutBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    leaderboardContainer.style.display = "none";
    quizContainer.style.display = "none";
    avatarOverlayLabel.style.display = "none";
    userAnnouncementBox.style.display = "none";
    
    // (تفريغ الكارت)
    userNameP.textContent = "Name: ";
    userFamilyP.textContent = "Family: ";
    userBalanceP.textContent = "Balance: ";
    userAvatarImg.src = DEFAULT_AVATAR_URL;
    
    loginForm.reset();
    loggedInUserEmail = null; 
    transactionList.innerHTML = ""; 
  }
  
  /**
   * الفانكشن دي بتشغل البرنامج كله (بعد اللوجن أو الريفرش)
   */
  async function initializeApp(user) {
    messageDiv.textContent = ""; // امسح رسالة "جاري التسجيل"
    
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
      adminPanelDiv.style.display = "block"; 
      leaderboardContainer.style.display = "none"; 
      quizContainer.style.display = "none";
      userAnnouncementBox.style.display = "none";
    } else {
      // --- لو هو يوزر عادي ---
      await loadLeaderboards(); 
      await loadActiveQuiz(user.email);
      await loadAnnouncement(); // 🛑 جيب الإعلان
      leaderboardContainer.style.display = "block"; 
      adminPanelDiv.style.display = "none"; 
    }
  }
  
  // 🛑 (فانكشن تصغير الصورة - زي ما هي) 🛑
  function resizeImage(file, maxWidth, maxHeight, quality) {
    // ( ... الكود زي ما هو ... )
  }

  // --- فورم اللوجن (مُعدل) ---
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
        // 1. خزن اليوزر في الـ localStorage
        localStorage.setItem('kiropayUser', JSON.stringify(data.user));
        // 2. شغل البرنامج
        initializeApp(data.user);
        
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

  // --- فانكشن جلب الكويز (زي ما هي) ---
  async function loadActiveQuiz(email) {
    // ( ... الكود زي ما هو ... )
  }
  
  // 🛑🛑 فانكشن جديدة: جلب الإعلانات 🛑🛑
  async function loadAnnouncement() {
    try {
      const response = await fetch(`/get-announcement`, { method: "GET" }); // ده GET
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


  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (مُعدل) ---
  logoutBtn.addEventListener("click", () => {
    // 1. امسح اليوزر من الـ localStorage
    localStorage.removeItem('kiropayUser');
    // 2. اظهر شاشة اللوجن
    showLoginScreen();
    // 3. اعرض رسالة
    messageDiv.textContent = "تم تسجيل الخروج.";
    messageDiv.style.color = "blue";
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
  
  // 
  // --- أكواد الأدمن (مُعدلة بالكامل) ---
  // 
  (function setupAdminPanel() {
      // --- 1. فورم البحث بالاسم (زي ما هو) ---
      adminSearchForm.addEventListener("submit", async (event) => {
        // ( ... الكود زي ما هو ... )
      });

      // --- فانكشن ملء الكارت (زي ما هي) ---
      function populateAdminCard(user) {
        // ( ... الكود زي ما هو ... )
      }

      // --- كود الدروب ليست (زي ما هو) ---
      adminSelectUser.addEventListener("change", () => {
        // ( ... الكود زي ما هو ... )
      });

      // --- فانكشن تعديل الرصيد (زي ما هي) ---
      async function handleBalanceUpdate(amount) {
        // ( ... الكود زي ما هو ... )
      }

      // --- زراير الرصيد (زي ما هي) ---
      addBalanceBtn.addEventListener("click", () => { /* ... */ });
      subtractBalanceBtn.addEventListener("click", () => { /* ... */ });
      
      // --- زرار حذف المستخدم (زي ما هو) ---
      deleteUserBtn.addEventListener("click", async () => {
        // ( ... الكود زي ما هو ... )
      });

      // --- 🛑 كود زراير الأسر (مُعدل بالكامل للـ Checkbox) 🛑 ---
      familyButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const familyName = button.dataset.family;
            
            adminFamilyMessage.textContent = `جاري تحميل بيانات "${familyName}"...`;
            adminFamilyMessage.style.color = "blue";
            adminFamilyResultsDiv.style.display = "none"; 
            adminFamilyResultsDiv.innerHTML = ""; 
            // 🛑 تصفير اللستة والكنترولز
            selectedUsersForMassUpdate = [];
            massUpdateControls.style.display = "none";
            
            try {
                const response = await fetch(`/admin-get-family`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ family: familyName }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    adminFamilyMessage.textContent = `فشل: ${data.error}`;
                    adminFamilyMessage.style.color = "red";
                    return;
                }
                
                const users = data.users;
                
                if (users.length === 0) {
                    adminFamilyMessage.textContent = `لا يوجد مستخدمين مسجلين في "${familyName}".`;
                    adminFamilyMessage.style.color = "black";
                } else {
                    adminFamilyMessage.textContent = `تم العثور على ${users.length} مستخدم في "${familyName}":`;
                    adminFamilyMessage.style.color = "green";
                    
                    users.forEach(user => {
                        const userItem = document.createElement("div");
                        userItem.className = "family-user-item";
                        
                        // 🛑 (ده الـ Checkbox)
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.className = "mass-update-checkbox";
                        checkbox.dataset.email = user.email; // خزن الايميل هنا
                        
                        // 🛑 (ده الجزء اللي بيتداس عليه)
                        const userInfo = document.createElement("div");
                        userInfo.className = "user-info";
                        userInfo.innerHTML = `
                            <span>${user.name} (${user.email})</span>
                            <strong>الرصيد: ${user.balance}</strong>
                        `;
                        
                        // (شغل الكود القديم بتاع الضغطة)
                        userInfo.addEventListener('click', () => {
                            user.family = familyName;
                            populateAdminCard(user);
                            adminSearchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        });

                        userItem.appendChild(checkbox);
                        userItem.appendChild(userInfo);
                        adminFamilyResultsDiv.appendChild(userItem);
                    });
                    
                    adminFamilyResultsDiv.style.display = "block"; 
                }
                
            } catch (err) {
                adminFamilyMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
                adminFamilyMessage.style.color = "red";
            }
        });
      });
      
      // 🛑 كود جديد: متابعة الـ Checkboxes 🛑
      adminFamilyResultsDiv.addEventListener('change', (e) => {
        if (e.target.classList.contains('mass-update-checkbox')) {
          const email = e.target.dataset.email;
          if (e.target.checked) {
            // لو عمل تشيك، ضيفه للستة
            if (!selectedUsersForMassUpdate.includes(email)) {
              selectedUsersForMassUpdate.push(email);
            }
          } else {
            // لو شال التشيك، امسحه من اللستة
            selectedUsersForMassUpdate = selectedUsersForMassUpdate.filter(em => em !== email);
          }
        }
        
        // حدث العداد واظهر/اخفي الكنترولز
        if (selectedUsersForMassUpdate.length > 0) {
          selectedUsersCount.textContent = selectedUsersForMassUpdate.length;
          massUpdateControls.style.display = "block";
        } else {
          massUpdateControls.style.display = "none";
        }
      });
      
      // 🛑 كود جديد: فانكشن التعديل الجماعي 🛑
      async function handleMassUpdate(amount) {
        if (amount === 0 || isNaN(amount)) {
            massUpdateMessage.textContent = "الرجاء إدخال كمية صحيحة";
            massUpdateMessage.style.color = "red";
            return;
        }
        if (selectedUsersForMassUpdate.length === 0) {
            massUpdateMessage.textContent = "الرجاء اختيار مستخدمين أولاً";
            massUpdateMessage.style.color = "red";
            return;
        }

        massUpdateMessage.textContent = "جاري تحديث الرصيد الجماعي...";
        massUpdateMessage.style.color = "blue";
        
        try {
          const response = await fetch(`/admin-mass-update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              emails: selectedUsersForMassUpdate, 
              amount: amount 
            }),
          });
          const data = await response.json();
          if(response.ok) {
            massUpdateMessage.textContent = data.message;
            massUpdateMessage.style.color = "green";
            massUpdateAmount.value = ""; 
            // 🛑 (اختياري) ممكن نعمل ريفرش للستة
          } else {
            massUpdateMessage.textContent = data.error;
            massUpdateMessage.style.color = "red";
          }
        } catch (err) {
          massUpdateMessage.textContent = "خطأ في الاتصال بالـ API.";
          massUpdateMessage.style.color = "red";
        }
      }

      // (ربط زراير التعديل الجماعي)
      massUpdateAddBtn.addEventListener('click', () => {
        const amount = parseFloat(massUpdateAmount.value);
        handleMassUpdate(amount);
      });
      massUpdateSubtractBtn.addEventListener('click', () => {
        const amount = parseFloat(massUpdateAmount.value);
        handleMassUpdate(-amount); // إرسال بالسالب
      });
      
      // --- كود فورم إضافة سؤال (زي ما هو) ---
      adminQuizForm.addEventListener("submit", async (event) => {
        // ( ... الكود زي ما هو ... )
      });
      
      // 🛑 كود جديد: فورم الإعلانات 🛑
      adminAnnouncementForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        adminAnnouncementMessage.textContent = "جاري نشر الإعلان...";
        adminAnnouncementMessage.style.color = "blue";
        
        const text = adminAnnouncementText.value;
        
        try {
          const response = await fetch(`/admin-set-announcement`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text }),
          });
          const data = await response.json();

          if (response.ok) {
            adminAnnouncementMessage.textContent = data.message;
            adminAnnouncementMessage.style.color = "green";
          } else {
            adminAnnouncementMessage.textContent = `فشل: ${data.error}`;
            adminAnnouncementMessage.style.color = "red";
          }
        } catch (err) {
          adminAnnouncementMessage.textContent = "خطأ في الاتصال بالـ API.";
          adminAnnouncementMessage.style.color = "red";
        }
      });
      
  })(); // 🛑 نهاية أكواد الأدمن 🛑
  
  
  // 🛑🛑 الكود اللي بيبدأ البرنامج 🛑🛑
  // (ده اللي بيشغل "الريفرش من غير لوج أوت")
  const storedUser = localStorage.getItem('kiropayUser');
  if (storedUser) {
    // لو فيه يوزر متخزن، شغل البرنامج علطول
    initializeApp(JSON.parse(storedUser));
  } else {
    // لو مفيش، اظهر شاشة اللوجن
    showLoginScreen();
  }

}); // نهاية "DOMContentLoaded"
