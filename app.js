document.addEventListener("DOMContentLoaded", () => {
  // --- مسك العناصر الأساسية ---
  // ( ... زي ما هي ... )

  // --- عناصر تغيير الصورة ---
  const avatarUploadInput = document.getElementById("avatar-upload-input");
  const avatarOverlayLabel = document.getElementById("avatar-overlay-label");
  const signupAvatarFile = document.getElementById("signup-avatar-file"); 
  let loggedInUserEmail = null; 
  
  // 🛑🛑 التعديل هنا 🛑🛑
  // اخفي الزرار أول ما الصفحة تفتح (بالـ JS)
  avatarOverlayLabel.style.display = "none";

  // --- بيانات Cloudinary ---
  // ( ... زي ما هي ... )

  // --- عناصر لوحة الأدمن ---
  // ( ... زي ما هي ... )
  
  // --- عناصر لوحة الصدارة ---
  // ( ... زي ما هي ... )
  
  // --- فورم اللوجن ---
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    messageDiv.textContent = "جاري تسجيل الدخول...";
    messageDiv.style.color = "blue";
    
    // (إخفاء كل حاجة)
    adminPanelDiv.style.display = "none";
    transactionList.innerHTML = ""; 
    leaderboardContainer.style.display = "none"; 
    quizContainer.style.display = "none"; 

    // ... (باقي كود اللوجن) ...

      if (response.ok) {
        // ... (ملء الكارت)
        
        // (إظهار الكارت)
        cardContainer.style.display = "flex";
        formContainer.style.display = "none";
        logoutBtn.style.display = "block";
        
        // 🛑🛑 التعديل هنا 🛑🛑
        avatarOverlayLabel.style.display = "flex"; // اظهر الزرار
        loggedInUserEmail = user.email; 
        
        // (جلب السجل)
        await loadTransactionHistory(user.email); 

        // (الشرط بتاع الأدمن واليوزر)
        if (user.role === 'admin') {
          adminPanelDiv.style.display = "block"; 
          leaderboardContainer.style.display = "none"; 
        } else {
          await loadLeaderboards(); 
          leaderboardContainer.style.display = "block"; 
          adminPanelDiv.style.display = "none"; 
          await loadActiveQuiz(user.email);
        }
        
      } else {
        // ( ... كود الفشل ... )
      }
    } catch (err) {
      // ( ... كود الإيرور ... )
    }
  });

  // --- فانكشن سجل المعاملات (زي ما هي) ---
  // ( ... )

  // --- فانكشن لوحة الصدارة (زي ما هي) ---
  // ( ... )

  // --- فانكشن مساعدة (زي ما هي) ---
  // ( ... )
  
  // --- فانكشن جلب الكويز (زي ما هي) ---
  // ( ... )


  // --- فورم التسجيل (Signup) (زي ما هو) ---
  signupForm.addEventListener("submit", async (event) => {
      // ( ... الكود زي ما هو ... )
  });


  // --- زرار تسجيل الخروج (مُعدل) ---
  logoutBtn.addEventListener("click", () => {
    // ( ... كود اللوج أوت ... )
    
    // 🛑🛑 التعديل هنا 🛑🛑
    avatarOverlayLabel.style.display = "none"; // اخفي الزرار
    loggedInUserEmail = null; 
    
    // ( ... باقي الكود ... )
  });


  // --- كود "تغيير الصورة" (زي ما هو) ---
  avatarUploadInput.addEventListener("change", async () => {
      // ( ... الكود زي ما هو ... )
  });

  // --- أكواد الكويز (زي ما هي) ---
  // ( ... )
  
  // --- أكواد الأدمن (كلها زي ما هي) ---
  // ( ... )

}); // نهاية "DOMContentLoaded"
