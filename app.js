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

  // 🛑🛑 عناصر السجل الجديد 🛑🛑
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


  // --- عناصر لوحة الأدمن (الكاملة) ---
  // ( ... زي ما هي ... )
  const adminPanelDiv = document.getElementById("admin-panel");
  // ... (كل متغيرات الأدمن)
  let currentSearchedUserEmail = null;
  let currentSearchResults = []; 
  
  // --- فورم اللوجن (مُعدل عشان يجيب السجل) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // (إخفاء كل حاجة زي الأول)
    adminPanelDiv.style.display = "none";
    // ...
    transactionList.innerHTML = ""; // 🛑 فضي السجل القديم

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
        userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL; 
        
        cardContainer.style.display = "flex";
        formContainer.style.display = "none";
        logoutBtn.style.display = "block";
        avatarOverlayLabel.style.display = "flex"; 
        loggedInUserEmail = user.email; 
        
        // 🛑🛑 الإضافة الجديدة: نادي الفانكشن اللي بتجيب السجل 🛑🛑
        await loadTransactionHistory(user.email);

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

  // 🛑🛑 فانكشن جديدة: جلب وملء سجل المعاملات 🛑🛑
  async function loadTransactionHistory(email) {
    transactionList.innerHTML = ""; // فضي اللستة
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
          
          // شوف الكمية موجب ولا سالب
          const amountClass = item.amount > 0 ? "positive" : "negative";
          const amountSign = item.amount > 0 ? "+" : "";
          
          // تنسيق التاريخ (شيل الثواني)
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
        // لو مفيش حركات
        transactionList.innerHTML = `<li class="no-history">لا يوجد معاملات سابقة</li>`;
      }

    } catch (err) {
      transactionList.innerHTML = `<li class="no-history" style="color: red;">${err.message}</li>`;
    }
  }


  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود القديم بتاع الـ Signup زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (مُعدل) ---
  logoutBtn.addEventListener("click", () => {
    cardContainer.style.display = "none";
    formContainer.style.display = "flex";
    logoutBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    
    userNameP.textContent = "Name: ";
    userFamilyP.textContent = "Family: ";
    userBalanceP.textContent = "Balance: ";
    userAvatarImg.src = DEFAULT_AVATAR_URL;
    
    loginForm.reset();
    messageDiv.textContent = "تم تسجيل الخروج.";
    messageDiv.style.color = "blue";

    avatarOverlayLabel.style.display = "none";
    loggedInUserEmail = null; 
    
    // 🛑 فضي السجل لما تعمل لوج أوت
    transactionList.innerHTML = "";
  });


  // --- كود "تغيير الصورة" (زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => {
      // ( ... الكود القديم بتاع تغيير الصورة زي ما هو ... )
  });


  // 
  // --- أكواد الأدمن ---
  // 
  // ( ... كل أكواد الأدمن (البحث، الدروب ليست، الأسر، الحذف) زي ما هي ... )
  // ( ... مفيش أي تعديل هنا، الكود بتاع تعديل الرصيد شغال زي ما هو ... )

}); // نهاية "DOMContentLoaded"
