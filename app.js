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

  // 🛑🛑 الحل النهائي للمشكلة 🛑🛑
  // (فرض الحالة الأولية الصحيحة عند فتح الصفحة)
  cardContainer.style.display = "none";
  formContainer.style.display = "flex"; // ⬅️ اظهر الفورمات
  logoutBtn.style.display = "none";
  adminPanelDiv.style.display = "none";
  leaderboardContainer.style.display = "none";
  quizContainer.style.display = "none";
  avatarOverlayLabel.style.display = "none";
  // 🛑🛑 نهاية الحل 🛑🛑

  
  // 🛑 فانكشن جديدة: تصغير الصورة قبل الرفع 🛑
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

          // حساب الأبعاد الجديدة
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


  // --- فورم اللوجن (مُعدل) ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // إخفاء كل حاجة (زي ما هو)
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


  // --- فورم التسجيل (Signup) (مُعدل ليستخدم التصغير) ---
  signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); 
      messageDiv.textContent = "جاري إنشاء حساب...";
      messageDiv.style.color = "blue";
      
      const avatarFile = signupAvatarFile.files[0];
      let finalAvatarUrl = DEFAULT_AVATAR_URL; 

      try {
          if (avatarFile && avatarFile.size > 0) {
              messageDiv.textContent = "جاري ضغط الصورة...";
              
              const resizedFile = await resizeImage(avatarFile, 800, 800, 0.7);

              messageDiv.textContent = "جاري رفع الصورة...";
              
              const formData_signup = new FormData();
              formData_signup.append('file', resizedFile, avatarFile.name); 
              formData_signup.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

              const uploadResponse = await fetch(CLOUDINARY_URL, {
                  method: 'POST',
                  body: formData_signup
              });
              
              const uploadData = await uploadResponse.json();
              
              if (!uploadResponse.ok) {
                  throw new Error(uploadData.error.message || 'فشل رفع الصورة');
              }
              
              finalAvatarUrl = uploadData.secure_url; 
              messageDiv.textContent = "جاري إنشاء الحساب..."; 
          }

          const dataToFunctions = new FormData();
          dataToFunctions.append('name', document.getElementById('name').value);
          dataToFunctions.append('family', document.getElementById('family').value); 
          dataToFunctions.append('email', document.getElementById('signup-email').value);
          dataToFunctions.append('password', document.getElementById('signup-password').value);
          dataToFunctions.append('profile_image_url', finalAvatarUrl);

          const response = await fetch(`/signup`, {
              method: "POST",
              body: dataToFunctions, 
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
          messageDiv.textContent = "حدث خطأ: " + err.message;
          messageDiv.style.color = "red";
      }
  });


  // --- زرار تسجيل الخروج (مُعدل) ---
  logoutBtn.addEventListener("click", () => {
    // 🛑 فرض الحالة الأولية (زي أول الصفحة)
    cardContainer.style.display = "none";
    formContainer.style.display = "flex";
    logoutBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    leaderboardContainer.style.display = "none";
    quizContainer.style.display = "none";
    avatarOverlayLabel.style.display = "none";

    // (تفريغ الكارت)
    userNameP.textContent = "Name: ";
    userFamilyP.textContent = "Family: ";
    userBalanceP.textContent = "Balance: ";
    userAvatarImg.src = DEFAULT_AVATAR_URL;
    
    loginForm.reset();
    messageDiv.textContent = "تم تسجيل الخروج.";
    messageDiv.style.color = "blue";

    loggedInUserEmail = null; 
    transactionList.innerHTML = ""; 
  });


  // --- كود "تغيير الصورة" (مُعدل ليستخدم التصغير) ---
  avatarUploadInput.addEventListener("change", async () => {
      const file = avatarUploadInput.files[0];
      if (!file) return; 
      
      avatarOverlayLabel.textContent = "جاري الضغط...";
      
      try {
          const resizedFile = await resizeImage(file, 800, 800, 0.7);

          avatarOverlayLabel.textContent = "جاري الرفع...";
          
          const formData_upload = new FormData();
          formData_upload.append('file', resizedFile, file.name);
          formData_upload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

          const uploadResponse = await fetch(CLOUDINARY_URL, {
              method: 'POST',
              body: formData_upload
          });
          
          const uploadData = await uploadResponse.json();
          
          if (!uploadResponse.ok) {
              throw new Error(uploadData.error.message || 'فشل رفع الصورة');
          }
          
          const newUrl = uploadData.secure_url; 

          const updateResponse = await fetch(`/update-avatar`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  email: loggedInUserEmail, 
                  newAvatarUrl: newUrl       
              }),
          });
          
          const updateData = await updateResponse.json();
          
          if (!updateResponse.ok) {
              throw new Error(updateData.error.message || 'فشل تحديث الداتا بيز');
          }

          userAvatarImg.src = newUrl;
          avatarOverlayLabel.textContent = "تغيير الصورة"; 

      } catch (err) {
          alert("حدث خطأ: " + err.message); 
          avatarOverlayLabel.textContent = "تغيير الصورة";
      }
  });

  // --- أكواد الكويز (زي ما هي) ---
  // 1. لما اليوزر يختار إجابة
  quizOptionButtons.forEach(button => {
    button.addEventListener("click", () => {
      quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
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
    quizSubmitBtn.disabled = true; 

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
        quizMessage.textContent = data.message;
        quizMessage.style.color = "green";
        const currentBalance = parseFloat(userBalanceP.textContent.replace('Balance: $', ''));
        userBalanceP.textContent = `Balance: $${currentBalance + data.points_added}`;
        await loadTransactionHistory(loggedInUserEmail);
      } else {
        quizMessage.textContent = data.message;
        quizMessage.style.color = "red";
      }

      setTimeout(() => {
        quizContainer.style.display = "none";
      }, 3000);

    } catch (err) {
      quizMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
      quizMessage.style.color = "red";
      quizSubmitBtn.disabled = false; 
    }
  });
  
  // 
  // --- أكواد الأدمن (كلها زي ما هي) ---
  // 
  (function setupAdminPanel() {
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
                        
                        userElement.classList.add('clickable-user');
                        userElement.addEventListener('click', () => {
                            user.family = familyName;
                            populateAdminCard(user);
                            adminSearchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        });

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
      
      // --- كود فورم إضافة سؤال ---
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
