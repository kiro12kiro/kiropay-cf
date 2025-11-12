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
  const DEFAULT_AVATAR_URL = "https://via.placeholder.com/100";

  // --- عناصر لوحة الأدمن (الكاملة) ---
  const adminPanelDiv = document.getElementById("admin-panel");
  const adminSearchForm = document.getElementById("admin-search-form");
  const adminSearchInput = document.getElementById("admin-search-name");
  const adminSearchMessage = document.getElementById("admin-search-message");
  
  // 🛑 المتغيرات الجديدة للدروب ليست
  const adminResultsListDiv = document.getElementById("admin-results-list");
  const adminSelectUser = document.getElementById("admin-select-user");
  
  // --- عناصر كارت المستخدم (اللي بـ نبحث عنه) ---
  const searchedUserCard = document.getElementById("admin-searched-user-card");
  const searchedUserName = document.getElementById("searched-user-name");
  const searchedUserFamily = document.getElementById("searched-user-family");
  const searchedUserEmail = document.getElementById("searched-user-email");
  const searchedUserBalance = document.getElementById("searched-user-balance");

  // --- عناصر فورم تعديل الرصيد (الجديدة) ---
  const balanceAmountInput = document.getElementById("admin-balance-amount");
  const addBalanceBtn = document.getElementById("admin-add-balance-btn");
  const subtractBalanceBtn = document.getElementById("admin-subtract-balance-btn");
  const balanceMessage = document.getElementById("admin-balance-message");

  // --- عناصر زرار الحذف ---
  const deleteUserBtn = document.getElementById("admin-delete-user-btn");
  const deleteMessage = document.getElementById("admin-delete-message");

  // 🛑 متغيرات جديدة عشان نخزن فيها بيانات البحث
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; // هنخزن لستة النتائج هنا

  // --- فورم اللوجن ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // إخفاء كل حاجة قبل اللوجن
    adminPanelDiv.style.display = "none";
    searchedUserCard.style.display = "none";
    adminResultsListDiv.style.display = "none";
    adminSearchMessage.textContent = "";

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
        userAvatarImg.src = user.profile_image_url || DEFAULT_AVATAR_URL; 
        
        // إظهار الكارت وإخفاء الفورمات
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
    // 🛑 بيجيب القيمة من الدروب ليست الجديدة
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
        body: formData, // مش بنحول لـ JSON
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
    // رجع كل حاجة زي الأول
    cardContainer.style.display = "none";
    formContainer.style.display = "flex";
    logoutBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    
    // فضي الكارت
    userNameP.textContent = "Name: ";
    userFamilyP.textContent = "Family: ";
    userBalanceP.textContent = "Balance: ";
    userAvatarImg.src = DEFAULT_AVATAR_URL;
    
    // فضي فورم اللوجن
    loginForm.reset();
    messageDiv.textContent = "تم تسجيل الخروج.";
    messageDiv.style.color = "blue";
  });

  // 
  // 🛑🛑 --- أكواد الأدمن الجديدة --- 🛑🛑
  // 

  // --- 1. فورم البحث بالاسم (النسخة الجديدة بالدروب ليست) ---
  adminSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameToSearch = adminSearchInput.value;

    // 1. تصفير الواجهة مع كل بحث جديد
    adminSearchMessage.textContent = "جاري البحث...";
    adminSearchMessage.style.color = "blue";
    searchedUserCard.style.display = "none";
    adminResultsListDiv.style.display = "none"; // اخفي الدروب ليست
    adminSelectUser.innerHTML = ""; // فضي الدروب ليست القديمة
    currentSearchResults = []; // فضي اللستة القديمة
    currentSearchedUserEmail = null; // أهم خطوة

    try {
      const response = await fetch(`/admin-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameToSearch }),
      });

      const data = await response.json();

      if (!response.ok) {
        // لو الـ API رجع 404 (مش لاقي) أو 500
        adminSearchMessage.textContent = data.error || "خطأ غير معروف";
        adminSearchMessage.style.color = "red";
        return;
      }
      
      // لو نجح ورجع لستة
      const users = data.users;
      currentSearchResults = users; // خزن اللستة

      // 🛑🛑 اللوجيك الجديد هنا 🛑🛑

      if (users.length === 1) {
        // --- الحالة 1: مستخدم واحد ---
        adminSearchMessage.textContent = "";
        // استخدم فانكشن جديدة (هنعملها تحت) عشان تملى الكارت
        populateAdminCard(users[0]);
        
      } else {
        // --- الحالة 2: أكتر من مستخدم ---
        adminSearchMessage.textContent = `تم العثور على ${users.length} مستخدمين.`;
        adminSearchMessage.style.color = "green";
        adminResultsListDiv.style.display = "block"; // اظهر الدروب ليست

        // ضيف اختيار افتراضي
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "-- اختر مستخدم --";
        defaultOption.value = "";
        adminSelectUser.appendChild(defaultOption);

        // املى الدروب ليست بالأسماء والإيميلات
        users.forEach(user => {
          const option = document.createElement("option");
          // اعرض الاسم + الايميل عشان الأدمن يفرق بينهم
          option.textContent = `${user.name} (${user.email})`;
          // القيمة هتكون الايميل (لأنه فريد)
          option.value = user.email;
          adminSelectUser.appendChild(option);
        });
      }

    } catch (err) {
      adminSearchMessage.textContent = "خطأ في الاتصال بالـ API بتاع البحث.";
      adminSearchMessage.style.color = "red";
    }
  });

  // 🛑 فانكشن جديدة: عشان تملى كارت الأدمن بالبيانات
  function populateAdminCard(user) {
    // املى الكارت بالبيانات
    searchedUserName.textContent = user.name;
    searchedUserFamily.textContent = user.family;
    searchedUserEmail.textContent = user.email;
    searchedUserBalance.textContent = user.balance;

    // 🛑 بنخزن الإيميل عشان نعرف هنعدل مين
    currentSearchedUserEmail = user.email;

    searchedUserCard.style.display = "block"; // اظهر الكارت

    // فضي رسالة تعديل الرصيد والحذف لو كانت مكتوبة
    balanceMessage.textContent = "";
    deleteMessage.textContent = "";
    balanceAmountInput.value = ""; // فضي خانة الرصيد
  }


  // 🛑 كود جديد: لما الأدمن يختار اسم من الدروب ليست
  adminSelectUser.addEventListener("change", () => {
    const selectedEmail = adminSelectUser.value;

    if (!selectedEmail) {
      // لو اختار الاختيار الافتراضي "-- اختر مستخدم --"
      searchedUserCard.style.display = "none";
      currentSearchedUserEmail = null;
      return;
    }

    // دور على اليوزر اللي اختاره جوه اللستة اللي خزنّاها
    const selectedUser = currentSearchResults.find(user => user.email === selectedEmail);

    if (selectedUser) {
      // املى الكارت ببيانات اليوزر ده
      populateAdminCard(selectedUser);
    }
  });


  // --- 2. فانكشن تعديل الرصيد (الجديدة) ---
  // دي فانكشن مشتركة للخصم والإضافة
  async function handleBalanceUpdate(amount) {
    // اتأكد إننا بنعدل المستخدم الصح
    if (!currentSearchedUserEmail) {
      balanceMessage.textContent = "لا يوجد مستخدم للبحث عنه";
      balanceMessage.style.color = "red";
      return;
    }
    
    // اتأكد إن الرقم مكتوب
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
          amount: amount // الرقم اللي جاي (سواء موجب أو سالب)
        }),
      });
      
      const data = await response.json();
      
      if(response.ok) {
        balanceMessage.textContent = `تم تحديث الرصيد! الرصيد الجديد: ${data.new_balance}`;
        balanceMessage.style.color = "green";
        // حدث الرصيد في الكارت كمان
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
  }

  // زرار الإضافة
  addBalanceBtn.addEventListener("click", () => {
    const amount = parseFloat(balanceAmountInput.value);
    handleBalanceUpdate(amount); // إرسال رقم موجب
  });

  // زرار الخصم
  subtractBalanceBtn.addEventListener("click", () => {
    const amount = parseFloat(balanceAmountInput.value);
    handleBalanceUpdate(-amount); // 🛑 إرسال نفس الرقم بالسالب
  });


  // --- 3. زرار حذف المستخدم (زي ما هو) ---
  deleteUserBtn.addEventListener("click", async () => {
    // اتأكد إننا بنحذف المستخدم الصح
    if (!currentSearchedUserEmail) {
      deleteMessage.textContent = "لا يوجد مستخدم للبحث عنه";
      return;
    }

    // رسالة تأكيد قبل الحذف
    const confirmDelete = confirm(`هل أنت متأكد أنك تريد حذف المستخدم: ${currentSearchedUserEmail}؟ \nهذه العملية لا يمكن التراجع عنها.`);
    
    if (!confirmDelete) {
      return; // لو داس "Cancel"
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
        // اخفي الكارت لإن المستخدم اتمسح
        searchedUserCard.style.display = "none";
        adminResultsListDiv.style.display = "none"; // اخفي الدروب ليست لو ظاهرة
        adminSearchInput.value = ""; // فضي البحث
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

}); // نهاية "DOMContentLoaded"
