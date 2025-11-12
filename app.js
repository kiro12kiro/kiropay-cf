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
  // ( ... باقي عناصر الأدمن ... )
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
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; 

  // 🛑🛑 عناصر لوحة الصدارة الجديدة 🛑🛑
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const familyLeaderboardList = document.getElementById("family-leaderboard-list");
  const userLeaderboardList = document.getElementById("user-leaderboard-list");
  
  // --- فورم اللوجن (مُعدل) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // إخفاء كل حاجة
    adminPanelDiv.style.display = "none";
    transactionList.innerHTML = ""; 
    leaderboardContainer.style.display = "none"; // 🛑 اخفي اللوحة

    // ... (باقي كود إخفاء الأدمن)

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
        
        // 🛑🛑 الإضافات الجديدة 🛑🛑
        await loadTransactionHistory(user.email); // جيب السجل
        await loadLeaderboards(); // جيب لوحة الصدارة
        leaderboardContainer.style.display = "block"; // اظهر اللوحة

        if (user.role === 'admin') {
          messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
          adminPanelDiv.style.display = "block";
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
    transactionList.innerHTML = ""; 
    try {
      const response = await fetch(`/get-transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error("فشل جلب السجل");
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

  // 🛑🛑 فانكشن جديدة: جلب لوحة الصدارة 🛑🛑
  async function loadLeaderboards() {
    familyLeaderboardList.innerHTML = "<li>جاري التحميل...</li>";
    userLeaderboardList.innerHTML = "<li>جاري التحميل...</li>";

    try {
      // 1. جيب ترتيب الأسر
      const familyResponse = await fetch(`/get-family-ranks`, { method: "POST" });
      const familyData = await familyResponse.json();
      familyLeaderboardList.innerHTML = ""; // فضي اللستة
      
      if (familyData.families && familyData.families.length > 0) {
        familyData.families.forEach((family, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div>
              <span class="rank">#${index + 1}</span>
              <span class="name">${family.family}</span>
            </div>
            <span class="balance">${family.total_balance} نقطة</span>
          `;
          familyLeaderboardList.appendChild(li);
        });
      } else {
        familyLeaderboardList.innerHTML = "<li>لا يوجد بيانات</li>";
      }

      // 2. جيب أعلى المستخدمين
      const userResponse = await fetch(`/get-top-users`, { method: "POST" });
      const userData = await userResponse.json();
      userLeaderboardList.innerHTML = ""; // فضي اللستة

      if (userData.users && userData.users.length > 0) {
        userData.users.forEach((user, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div>
              <span class="rank">#${index + 1}</span>
              <span class="name">${user.name}</span>
              <small class="family-name">${user.family}</small>
            </div>
            <span class="balance">${user.balance} نقطة</span>
          `;
          userLeaderboardList.appendChild(li);
        });
      } else {
        userLeaderboardList.innerHTML = "<li>لا يوجد بيانات</li>";
      }

    } catch (err) {
      familyLeaderboardList.innerHTML = `<li style="color: red;">فشل تحميل البيانات</li>`;
      userLeaderboardList.innerHTML = `<li style="color: red;">فشل تحميل البيانات</li>`;
    }
  }


  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود القديم بتاع الـ Signup زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (مُعدل) ---
  logoutBtn.addEventListener("click", () => {
    // ( ... كود اللوج أوت زي ما هو ... )
    cardContainer.style.display = "none";
    formContainer.style.display = "flex";
    logoutBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    
    // (تفريغ الكارت)
    userNameP.textContent = "Name: ";
    userFamilyP.textContent = "Family: ";
    userBalanceP.textContent = "Balance: ";
    userAvatarImg.src = DEFAULT_AVATAR_URL;
    
    loginForm.reset();
    messageDiv.textContent = "تم تسجيل الخروج.";
    messageDiv.style.color = "blue";

    avatarOverlayLabel.style.display = "none";
    loggedInUserEmail = null; 
    transactionList.innerHTML = ""; 
    
    // 🛑 اخفي لوحة الصدارة
    leaderboardContainer.style.display = "none";
  });


  // --- كود "تغيير الصورة" (زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => {
      // ( ... الكود القديم بتاع تغيير الصورة زي ما هو ... )
  });


  // 
  // --- 🛑 أكواد الأدمن (كلها رجعت زي ما هي) 🛑 ---
  // 

  // --- 1. فورم البحث بالاسم ---
  adminSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    // ( ... باقي كود البحث زي ما هو ... )
  });

  // --- فانكشن ملء الكارت ---
  function populateAdminCard(user) {
    // ( ... الكود زي ما هو ... )
  }

  // --- كود الدروب ليست ---
  adminSelectUser.addEventListener("change", () => {
    // ( ... الكود زي ما هو ... )
  });

  // --- فانكشن تعديل الرصيد ---
  async function handleBalanceUpdate(amount) {
    // ( ... الكود زي ما هو ... )
  }

  // --- زراير الرصيد ---
  addBalanceBtn.addEventListener("click", () => {
    // ( ... الكود زي ما هو ... )
  });
  subtractBalanceBtn.addEventListener("click", () => {
    // ( ... الكود زي ما هو ... )
  });

  // --- زرار حذف المستخدم ---
  deleteUserBtn.addEventListener("click", async () => {
    // ( ... الكود زي ما هو ... )
  });

  // --- كود زراير الأسر ---
  familyButtons.forEach(button => {
    button.addEventListener("click", async () => {
        // ( ... الكود زي ما هو ... )
    });
  });

}); // نهاية "DOMContentLoaded"
