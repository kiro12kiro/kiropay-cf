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
  
  // 🛑🛑 التعديل الثاني هنا 🛑🛑
  // تم شيل الـ "/" من أول المسار
  const DEFAULT_AVATAR_URL = "default-avatar.png";

  // --- عناصر لوحة الأدمن (الكاملة) ---
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

  // --- فورم اللوجن ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    adminPanelDiv.style.display = "none";
    searchedUserCard.style.display = "none";
    adminResultsListDiv.style.display = "none";
    adminSearchMessage.textContent = "";
    adminFamilyResultsDiv.style.display = "none";
    adminFamilyMessage.textContent = "";

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
        // 🛑 الكود ده دلوقتي هيستخدم المسار الصحيح
        userAvatarImg.src = user.profile_image_url || DEFAULT_AVATAR_URL; 
        
        cardContainer.style.display = "flex";
        formContainer.style.display = "none";
        logoutBtn.style.display = "block";
        
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

  // --- فورم التسجيل ---
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري إنشاء حساب...";
    messageDiv.style.color = "blue";

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('family', document.getElementById('family').value); 
    formData.append('email', document.getElementById('signup-email').value);
    formData.append('password', document.getElementById('signup-password').value);
    
    const avatarFile = document.getElementById('avatar-file').files[0];
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    
    try {
      const response = await fetch(`/signup`, {
        method: "POST",
        body: formData,
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

  // --- زرار تسجيل الخروج ---
  logoutBtn.addEventListener("click", () => {
    cardContainer.style.display = "none";
    formContainer.style.display = "flex";
    logoutBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    
    userNameP.textContent = "Name: ";
    userFamilyP.textContent = "Family: ";
    userBalanceP.textContent = "Balance: ";
    // 🛑 رجع الصورة الافتراضية (بالمسار الصحيح)
    userAvatarImg.src = DEFAULT_AVATAR_URL;
    
    loginForm.reset();
    messageDiv.textContent = "تم تسجيل الخروج.";
    messageDiv.style.color = "blue";
  });

  // 
  // --- أكواد الأدمن (البحث والدروب ليست) ---
  // 

  // --- 1. فورم البحث بالاسم ---
  adminSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameToSearch = adminSearchInput.value;

    adminSearchMessage.textContent = "جاري البحث...";
    adminSearchMessage.style.color = "blue";
    searchedUserCard.style.display = "none";
    adminResultsListDiv.style.display = "none";
    adminSelectUser.innerHTML = ""; 
    currentSearchResults = []; 
    currentSearchedUserEmail = null; 

    try {
      const response = await fetch(`/admin-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameToSearch }),
      });

      const data = await response.json();

      if (!response.ok) {
        adminSearchMessage.textContent = data.error || "خطأ غير معروف";
        adminSearchMessage.style.color = "red";
        return;
      }
      
      const users = data.users;
      currentSearchResults = users; 

      if (users.length === 1) {
        adminSearchMessage.textContent = "";
        populateAdminCard(users[0]);
        
      } else {
        adminSearchMessage.textContent = `تم العثور على ${users.length} مستخدمين.`;
        adminSearchMessage.style.color = "green";
        adminResultsListDiv.style.display = "block"; 

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "-- اختر مستخدم --";
        defaultOption.value = "";
        adminSelectUser.appendChild(defaultOption);

        users.forEach(user => {
          const option = document.createElement("option");
          option.textContent = `${user.name} (${user.email})`;
          option.value = user.email;
          adminSelectUser.appendChild(option);
        });
      }

    } catch (err) {
      adminSearchMessage.textContent = "خطأ في الاتصال بالـ API بتاع البحث.";
      adminSearchMessage.style.color = "red";
    }
  });

  // --- فانكشن ملء الكارت ---
  function populateAdminCard(user) {
    searchedUserName.textContent = user.name;
    searchedUserFamily.textContent = user.family;
    searchedUserEmail.textContent = user.email;
    searchedUserBalance.textContent = user.balance;

    currentSearchedUserEmail = user.email;

    searchedUserCard.style.display = "block"; 

    balanceMessage.textContent = "";
    deleteMessage.textContent = "";
    balanceAmountInput.value = ""; 
  }


  // --- كود الدروب ليست ---
  adminSelectUser.addEventListener("change", () => {
    const selectedEmail = adminSelectUser.value;

    if (!selectedEmail) {
      searchedUserCard.style.display = "none";
      currentSearchedUserEmail = null;
      return;
    }
    const selectedUser = currentSearchResults.find(user => user.email === selectedEmail);
    if (selectedUser) {
      populateAdminCard(selectedUser);
    }
  });


  // --- فانكشن تعديل الرصيد ---
  async function handleBalanceUpdate(amount) {
    if (!currentSearchedUserEmail) {
      balanceMessage.textContent = "لا يوجد مستخدم للبحث عنه";
      balanceMessage.style.color = "red";
      return;
    }
    if (amount === 0 || isNaN(amount)) {
        balanceMessage.textContent = "الرجاء إدخال كمية صحيحة";
        balanceMessage.style.color = "red";
        return;
    }
    balanceMessage.textContent = "جاري تحديث الرصيد...";
    balanceMessage.style.color = "blue";
    
    try {
      const response = await fetch(`/admin-update-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: currentSearchedUserEmail, 
          amount: amount 
        }),
      });
      const data = await response.json();
      if(response.ok) {
        balanceMessage.textContent = `تم تحديث الرصيد! الرصيد الجديد: ${data.new_balance}`;
        balanceMessage.style.color = "green";
        searchedUserBalance.textContent = data.new_balance;
        balanceAmountInput.value = ""; 
      } else {
        balanceMessage.textContent = data.error;
        balanceMessage.style.color = "red";
      }
    } catch (err) {
      balanceMessage.textContent = "خطأ في الاتصال بالـ API بتاع الرصيد.";
      balanceMessage.style.color = "red";
    }
  }

  // --- زراير الرصيد ---
  addBalanceBtn.addEventListener("click", () => {
    const amount = parseFloat(balanceAmountInput.value);
    handleBalanceUpdate(amount);
  });
  subtractBalanceBtn.addEventListener("click", () => {
    const amount = parseFloat(balanceAmountInput.value);
    handleBalanceUpdate(-amount);
  });


  // --- زرار حذف المستخدم ---
  deleteUserBtn.addEventListener("click", async () => {
    if (!currentSearchedUserEmail) {
      deleteMessage.textContent = "لا يوجد مستخدم للبحث عنه";
      return;
    }
    const confirmDelete = confirm(`هل أنت متأكد أنك تريد حذف المستخدم: ${currentSearchedUserEmail}؟ \nهذه العملية لا يمكن التراجع عنها.`);
    if (!confirmDelete) {
      return; 
    }
    deleteMessage.textContent = "جاري حذف المستخدم...";
    
    try {
      const response = await fetch(`/admin-delete-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentSearchedUserEmail }),
      });
      
      const data = await response.json();
      
      if(response.ok) {
        deleteMessage.textContent = data.message;
        deleteMessage.style.color = "green";
        searchedUserCard.style.display = "none";
        adminResultsListDiv.style.display = "none"; 
        adminSearchInput.value = ""; 
        currentSearchedUserEmail = null;
      } else {
        deleteMessage.textContent = data.error;
        deleteMessage.style.color = "red";
      }
    } catch (err) {
      deleteMessage.textContent = "خطأ في الاتصال بالـ API بتاع الحذف.";
      deleteMessage.style.color = "red";
    }
  });


  // --- كود زراير الأسر ---
  familyButtons.forEach(button => {
    
    button.addEventListener("click", async () => {
        
        const familyName = button.dataset.family;
        
        adminFamilyMessage.textContent = `جاري تحميل بيانات "${familyName}"...`;
        adminFamilyMessage.style.color = "blue";
        adminFamilyResultsDiv.style.display = "none"; 
        adminFamilyResultsDiv.innerHTML = ""; 
        
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
                    const userElement = document.createElement("p");
                    userElement.innerHTML = `
                        <span>${user.name} (${user.email})</span>
                        <strong>الرصيد: ${user.balance}</strong>
                    `;
                    adminFamilyResultsDiv.appendChild(userElement);
                });
                
                adminFamilyResultsDiv.style.display = "block"; 
            }
            
        } catch (err) {
            adminFamilyMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
            adminFamilyMessage.style.color = "red";
        }
    });
  });

}); // نهاية "DOMContentLoaded"
