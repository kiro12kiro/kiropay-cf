document.addEventListener("DOMContentLoaded", () => {
  // --- مسك العناصر الأساسية ---
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  
  // 🛑 زرار تسجيل الخروج الجديد
  const logoutBtn = document.getElementById("logout-btn");

  // --- عناصر كارت المستخدم (اللي عامل لوجن) ---
  const userNameP = document.getElementById("user-name");
  const userFamilyP = document.getElementById("user-family");
  const userBalanceP = document.getElementById("user-balance");
  const userAvatarImg = document.getElementById("user-avatar");
  
  // 🛑 دي الصورة اللي إنت رفعتها على GitHub
  const DEFAULT_AVATAR_URL = "/default-avatar.png"; // (اتأكد إن الاسم ده مطابق لاسم الصورة اللي رفعتها)

  // --- عناصر لوحة الأدمن ---
  const adminPanelDiv = document.getElementById("admin-panel");
  const adminSearchForm = document.getElementById("admin-search-form");
  const adminSearchInput = document.getElementById("admin-search-name");
  const adminSearchMessage = document.getElementById("admin-search-message");
  
  // --- عناصر كارت المستخدم (اللي بـ نبحث عنه) ---
  const searchedUserCard = document.getElementById("admin-searched-user-card");
  const searchedUserName = document.getElementById("searched-user-name");
  const searchedUserFamily = document.getElementById("searched-user-family");
  const searchedUserEmail = document.getElementById("searched-user-email");
  const searchedUserBalance = document.getElementById("searched-user-balance");

  // 🛑 عناصر فورم تعديل الرصيد (الجديدة) ---
  const balanceAmountInput = document.getElementById("admin-balance-amount");
  const addBalanceBtn = document.getElementById("admin-add-balance-btn");
  const subtractBalanceBtn = document.getElementById("admin-subtract-balance-btn");
  const balanceMessage = document.getElementById("admin-balance-message");


  // --- عناصر زرار الحذف ---
  const deleteUserBtn = document.getElementById("admin-delete-user-btn");
  const deleteMessage = document.getElementById("admin-delete-message");

  let currentSearchedUserEmail = null;

  // --- فورم اللوجن ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    if (adminPanelDiv) adminPanelDiv.style.display = "none";
    if (searchedUserCard) searchedUserCard.style.display = "none";
    if (adminSearchMessage) adminSearchMessage.textContent = "";
    
    // 🛑 إخفاء زرار تسجيل الخروج (عشان لو كان ظاهر من لوجن قديم)
    if (logoutBtn) logoutBtn.style.display = "none";

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
        // 🛑 بيستخدم صورتك أو الصورة الافتراضية
        userAvatarImg.src = user.profile_image_url || DEFAULT_AVATAR_URL; 
        
        // 🛑 إظهار زرار تسجيل الخروج
        if (logoutBtn) logoutBtn.style.display = "block";
        
        if (user.role === 'admin' && adminPanelDiv) {
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

  // --- 🛑 برمجة زرار تسجيل الخروج ---
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // أسهل طريقة لـ "تسجيل الخروج" هي إننا نعمل ريلود للصفحة
        // ده هيرجع كل حاجة لوضعها الطبيعي (قبل اللوجن)
        location.reload();
    });
  }

  // --- فورم التسجيل (زي ما هو) ---
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

  // 
  // --- أكواد الأدمن ---
  // 

  // --- 1. فورم البحث بالاسم (زي ما هو) ---
  if (adminSearchForm) {
    adminSearchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nameToSearch = adminSearchInput.value;
        adminSearchMessage.textContent = "جاري البحث...";
        searchedUserCard.style.display = "none";
        
        try {
            const response = await fetch(`/admin-search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameToSearch }),
            });
            const data = await response.json();
            if(response.ok) {
                adminSearchMessage.textContent = "";
                const user = data.user;
                searchedUserName.textContent = user.name;
                searchedUserFamily.textContent = user.family;
                searchedUserEmail.textContent = user.email;
                searchedUserBalance.textContent = user.balance;
                currentSearchedUserEmail = user.email; 
                searchedUserCard.style.display = "block";
            } else {
                adminSearchMessage.textContent = data.error;
                currentSearchedUserEmail = null;
            }
        } catch (err) {
            adminSearchMessage.textContent = "خطأ في الاتصال بالـ API بتاع البحث.";
        }
    });
  }

  // --- 🛑 2. برمجة زراير تعديل الرصيد (الجديدة) ---
  
  // دي "دالة مساعدة" عشان نبعت للـ API (عشان منكررش الكود مرتين)
  const handleUpdateBalance = async (amount) => {
    if (!currentSearchedUserEmail) {
        balanceMessage.textContent = "لا يوجد مستخدم للبحث عنه";
        balanceMessage.style.color = "red";
        return;
    }
    
    if (isNaN(amount) || amount === 0) {
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
                amount: amount // الكمية (موجبة أو سالبة)
            }),
        });
        
        const data = await response.json();
        
        if(response.ok) {
            balanceMessage.textContent = `تم تحديث الرصيد! الرصيد الجديد: ${data.new_balance}`;
            balanceMessage.style.color = "green";
            searchedUserBalance.textContent = data.new_balance;
            balanceAmountInput.value = ""; // فضي الخانة
        } else {
            balanceMessage.textContent = data.error;
            balanceMessage.style.color = "red";
        }
    } catch (err) {
        balanceMessage.textContent = "خطأ في الاتصال بالـ API بتاع الرصيد.";
        balanceMessage.style.color = "red";
    }
  };

  // زرار الإضافة
  if (addBalanceBtn) {
    addBalanceBtn.addEventListener("click", () => {
        const amount = parseFloat(balanceAmountInput.value);
        handleUpdateBalance(amount); // هيبعت الرقم زي ما هو (موجب)
    });
  }

  // زرار الخصم
  if (subtractBalanceBtn) {
    subtractBalanceBtn.addEventListener("click", () => {
        // هيحول الرقم لسالب لو كان موجب
        const amount = -Math.abs(parseFloat(balanceAmountInput.value)); 
        handleUpdateBalance(amount); // هيبعت الرقم بالسالب
    });
  }

  // --- 3. زرار حذف المستخدم (زي ما هو) ---
  if (deleteUserBtn) {
    deleteUserBtn.addEventListener("click", async () => {
        if (!currentSearchedUserEmail) {
            deleteMessage.textContent = "لا يوجد مستخدم للبحث عنه";
            return;
        }

        const confirmDelete = confirm(`هل أنت متأكد أنك تريد حذف المستخدم: ${currentSearchedUserEmail}؟ \nهذه العملية لا يمكن التراجع عنها.`);
        
        if (!confirmDelete) return; 
        
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
  }

});
