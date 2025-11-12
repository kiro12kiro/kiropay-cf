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

  // --- عناصر لوحة الصدارة ---
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const topChampionsList = document.getElementById("top-champions-list");
  const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
  const familyMargergesList = document.getElementById("family-margerges-list");
  const familyAnbaKarasList = document.getElementById("family-anba-karas-list");
  
  // 🛑🛑 فانكشن جديدة: تصغير الصورة قبل الرفع 🛑🛑
  /**
   * @param {File} file - الملف الأصلي
   * @param {number} maxWidth - أقصى عرض
   * @param {number} maxHeight - أقصى طول
   * @param {number} quality - الجودة (من 0 إلى 1)
   * @returns {Promise<Blob>} - الملف الجديد المضغوط
   */
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
          
          // تحويل الكانفاس لـ Blob (ملف)
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('فشل في ضغط الصورة'));
            }
          }, 'image/jpeg', quality); // بنحولها لـ JPEG عشان نضغطها
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  }


  // --- فورم اللوجن (زي ما هو) ---
  loginForm.addEventListener("submit", async (event) => {
    // ( ... الكود زي ما هو ... )
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


  // --- فورم التسجيل (Signup) (مُعدل ليستخدم التصغير) ---
  signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); 
      messageDiv.textContent = "جاري إنشاء حساب...";
      messageDiv.style.color = "blue";
      
      const avatarFile = signupAvatarFile.files[0];
      let finalAvatarUrl = DEFAULT_AVATAR_URL; 

      try {
          // 1. لو اليوزر رفع صورة، ارفعها الأول
          if (avatarFile && avatarFile.size > 0) {
              messageDiv.textContent = "جاري ضغط الصورة...";
              
              // 🛑🛑 التعديل هنا: نادي الفانكشن الجديدة 🛑🛑
              // (أقصى حاجة 800x800, جودة 70%)
              const resizedFile = await resizeImage(avatarFile, 800, 800, 0.7);

              messageDiv.textContent = "جاري رفع الصورة...";
              
              const formData_signup = new FormData();
              // 🛑 ارفع الملف "المضغوط" مش الأصلي
              formData_signup.append('file', resizedFile, avatarFile.name); // بنضيف اسم الملف الأصلي
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

          // ( ... باقي الكود زي ما هو ... )
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


  // --- زرار تسجيل الخروج (زي ما هو) ---
  logoutBtn.addEventListener("click", () => {
    // ( ... الكود زي ما هو ... )
  });


  // --- كود "تغيير الصورة" (مُعدل ليستخدم التصغير) ---
  avatarUploadInput.addEventListener("change", async () => {
      const file = avatarUploadInput.files[0];
      if (!file) return; 
      
      avatarOverlayLabel.textContent = "جاري الضغط...";
      
      try {
          // 🛑🛑 التعديل هنا: نادي الفانكشن الجديدة 🛑🛑
          const resizedFile = await resizeImage(file, 800, 800, 0.7);

          avatarOverlayLabel.textContent = "جاري الرفع...";
          
          // 2. ارفع الصورة الجديدة لـ Cloudinary
          const formData_upload = new FormData();
          // 🛑 ارفع الملف "المضغوط"
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

          // 3. كلم الـ API الجديد بتاعنا (functions/update-avatar)
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

          // 4. حدث الصورة في الكارت
          userAvatarImg.src = newUrl;
          avatarOverlayLabel.textContent = "تغيير الصورة"; 

      } catch (err) {
          alert("حدث خطأ: " + err.message); 
          avatarOverlayLabel.textContent = "تغيير الصورة";
      }
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
  })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
