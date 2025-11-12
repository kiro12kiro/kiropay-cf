document.addEventListener("DOMContentLoaded", () => {
    // ... (كل المتغيرات زي ما هي) ...
    const loginForm = document.getElementById("login-form");
    const refreshDataBtn = document.getElementById("refresh-data-btn"); 
    let loggedInUserProfile = null; 
    
    // (فانكشن تصغير الصورة - زي ما هي)
    function resizeImage(file, maxWidth, maxHeight, quality) {
      // ...
    }

    // 🛑🛑 فانكشن تحديث البيانات (Refresh) 🛑🛑
    async function refreshUserData() {
        if (!loggedInUserProfile) return;
        refreshDataBtn.textContent = "جاري التحديث...";
        
        try {
            const response = await fetch(`/get-user-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email }),
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error("فشل الحصول على بيانات المستخدم");
            
            const user = data.user;
            loggedInUserProfile = user; 

            // 2. تحديث الكارت
            userNameP.textContent = `الاسم: ${user.name}`;
            userFamilyP.textContent = `العائلة: ${user.family}`;
            userBalanceP.textContent = `الرصيد: $${user.balance}`;
            userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL; 
            
            // 3. تحديث باقي الأقسام
            await loadTransactionHistory(user.email);
            if (user.role !== 'admin') {
                await loadLeaderboards();
                await loadActiveQuiz(user.email);
                await loadAnnouncement(); 
            } else {
                await loadAnnouncement();
            }

            refreshDataBtn.textContent = "تحديث البيانات";
        } catch(err) {
            refreshDataBtn.textContent = "فشل التحديث";
            console.error("Refresh Error:", err);
        }
    }

    // --- فورم اللوجن ---
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        event.stopPropagation();
        
        // ... (باقي كود اللوجن)
    });

    // --- فانكشن سجل المعاملات (مُحصنة) ---
    async function loadTransactionHistory(email) { /* ... */ }

    // --- فانكشن لوحة الصدارة والكويز (زي ما هي) ---
    async function loadLeaderboards() { /* ... */ }
    async function populateFamilyList(familyName, listElement) { /* ... */ }
    async function loadActiveQuiz(email) { /* ... */ }
    
    // 🛑🛑 فانكشن جديدة: جلب الإعلانات (لليوزر) 🛑🛑
    async function loadAnnouncement() { /* ... */ }


    // --- فورم التسجيل (Signup) ---
    signupForm.addEventListener("submit", async (event) => { /* ... */ });


    // --- زرار تسجيل الخروج (مُعدل) ---
    logoutBtn.addEventListener("click", () => { /* ... */ });
    
    // 🛑 ربط زرار الريفرش 🛑
    refreshDataBtn.addEventListener('click', refreshUserData);

    // --- كود "تغيير الصورة" (زي ما هي) ---
    avatarUploadInput.addEventListener("change", async () => { /* ... */ });

    // --- أكواد الكويز (زي ما هي) ---
    quizOptionButtons.forEach(button => { /* ... */ });
    quizSubmitBtn.addEventListener("click", async () => { /* ... */ });
    
    // 
    // --- أكواد الأدمن (مع إصلاحات الـ Checkbox والإعلان) ---
    // 
    (function setupAdminPanel() {
        // --- 1. فورم البحث بالاسم ---
        adminSearchForm.addEventListener("submit", async (event) => {
          event.preventDefault(); // ⬅️ هذا هو الإصلاح لمنع الريفرش
          // ... (باقي الكود)
        });

        // --- فانكشن ملء الكارت ---
        function populateAdminCard(user) { /* ... */ }

        // --- كود الدروب ليست ---
        adminSelectUser.addEventListener("change", () => { /* ... */ });

        // --- فانكشن تعديل الرصيد الجماعي ---
        async function handleMassUpdate(amount) { /* ... */ }

        // --- زراير الرصيد (الفردي) ---
        addBalanceBtn.addEventListener("click", () => { /* ... */ });
        subtractBalanceBtn.addEventListener("click", () => { /* ... */ });

        // --- زرار حذف المستخدم ---
        deleteUserBtn.addEventListener("click", async () => { /* ... */ });

        // --- كود زراير الأسر (🛑 مع إضافة Checkbox) ---
        familyButtons.forEach(button => { /* ... */ });
        
        // 🛑 كود متابعة الـ Checkboxes وتحديث اللوحة الجماعية 🛑
        adminFamilyResultsDiv.addEventListener('change', (e) => { /* ... */ });
        
        // (ربط زراير التعديل الجماعي)
        massUpdateAddBtn.addEventListener('click', () => { /* ... */ });
        massUpdateSubtractBtn.addEventListener('click', () => { /* ... */ });
        
        // --- كود فورم إضافة سؤال (مع الـ preventDefault) ---
        adminQuizForm.addEventListener("submit", async (event) => {
          event.preventDefault(); 
          // ...
        });
        
        // 🛑 كود فورم الإعلانات (مع الـ preventDefault) 🛑
        adminAnnouncementForm.addEventListener("submit", async (event) => {
          event.preventDefault(); 
          // ...
        });
        
    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
