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
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; 

  // --- عناصر لوحة الصدارة ---
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const topChampionsList = document.getElementById("top-champions-list");
  const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
  const familyMargergesList = document.getElementById("family-margerges-list");
  const familyAnbaKarasList = document.getElementById("family-anba-karas-list");
  
  // --- فورم اللوجن (مُعدل) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // إخفاء كل حاجة (زي ما هو)
    adminPanelDiv.style.display = "none";
    transactionList.innerHTML = ""; 
    leaderboardContainer.style.display = "none"; 
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
        
        // (جلب السجل - ده مشترك للكل)
        await loadTransactionHistory(user.email); 

        // 🛑🛑 التعديل الجديد هنا 🛑🛑
        if (user.role === 'admin') {
          // --- لو هو أدمن ---
          messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
          adminPanelDiv.style.display = "block"; // اظهر لوحة الأدمن
          leaderboardContainer.style.display = "none"; // اتأكد إن لوحة الصدارة مخفية
        } else {
          // --- لو هو يوزر عادي ---
          await loadLeaderboards(); // جيب لوحة الصدارة
          leaderboardContainer.style.display = "block"; // اظهر لوحة الصدارة
          adminPanelDiv.style.display = "none"; // اتأكد إن لوحة الأدمن مخفية
        }
        // 🛑🛑 نهاية التعديل 🛑🛑
        
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

  // --- فانكشن لوحة الصدارة (زي ما هي) ---
  async function loadLeaderboards() {
    // ( ... الكود زي ما هو ... )
    topChampionsList.innerHTML = "<li>جاري التحميل...</li>";
    familyAnbaMoussaList.innerHTML = "<li>جاري التحميل...</li>";
    familyMargergesList.innerHTML = "<li>جاري التحميل...</li>";
    familyAnbaKarasList.innerHTML = "<li>جاري التحميل...</li>";

    try {
      // 1. جيب أبطال الأسر
      const championsResponse = await fetch(`/get-top-champions`, { method: "POST" });
      const championsData = await championsResponse.json();
      topChampionsList.innerHTML = ""; 
      
      if (championsData.champions && championsData.champions.length > 0) {
        const rankIcons = ["🥇", "🥈", "🥉"];
        championsData.champions.forEach((user, index) => {
          const rankClass = ["gold", "silver", "bronze"][index] || "bronze";
          const rankIcon = rankIcons[index] || "🏆";
          
          const championCard = document.createElement("div");
          championCard.className = `champion-card ${rankClass}`;
          championCard.innerHTML = `
            <span class="rank">${rankIcon}</span>
            <span class="name">${user.name}</span>
            <span class="family-name">${user.family}</span>
            <span class="balance">${user.balance} نقطة</span>
          `;
          topChampionsList.appendChild(championCard);
        });
      } else {
        topChampionsList.innerHTML = "<p>لا يوجد أبطال بعد</p>";
      }

      // 2. جيب لستات الأسر
      await populateFamilyList("اسرة الانبا موسي الاسود", familyAnbaMoussaList);
      await populateFamilyList("اسرة مارجرس", familyMargergesList);
      await populateFamilyList("اسرة الانبا كاراس", familyAnbaKarasList);

    } catch (err) {
      const errorMsg = `<p style="color: red;">فشل تحميل البيانات</p>`;
      topChampionsList.innerHTML = errorMsg;
      familyAnbaMoussaList.innerHTML = errorMsg;
      familyMargergesList.innerHTML = errorMsg;
      familyAnbaKarasList.innerHTML = errorMsg;
    }
  }

  // --- فانكشن مساعدة (زي ما هي) ---
  async function populateFamilyList(familyName, listElement) {
    try {
      const response = await fetch(`/get-family-top-10`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ family: familyName })
      });
      const data = await response.json();
      listElement.innerHTML = ""; 

      if (data.users && data.users.length > 0) {
        data.users.forEach((user, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div>
              <span class="rank">#${index + 1}</span>
              <span class="name">${user.name}</span>
            </div>
            <span class="balance">${user.balance} نقطة</span>
          `;
          listElement.appendChild(li);
        });
      } else {
        listElement.innerHTML = "<li>لا يوجد بيانات</li>";
      }
    } catch (err) {
      listElement.innerHTML = `<li style="color: red;">فشل التحميل</li>`;
    }
  }


  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود القديم بتاع الـ Signup زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (زي ما هو) ---
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
    
    // اخفي لوحة الصدارة
    leaderboardContainer.style.display = "none";
  });


  // --- كود "تغيير الصورة" (زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => {
      // ( ... الكود القديم بتاع تغيير الصورة زي ما هو ... )
  });


  // 
  // --- أكواد الأدمن (كلها زي ما هي) ---
  // 
  (function setupAdminPanel() {
      // --- 1. فورم البحث بالاسم ---
      adminSearchForm.addEventListener("submit", async (event) => {
        // ( ... الكود زي ما هو ... )
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
  })(); // نهاية أكواد الأدمن

}); // نهاية "DOMContentLoaded"
