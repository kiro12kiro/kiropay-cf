document.addEventListener("DOMContentLoaded", () => {
    // --- مسك العناصر الأساسية ---
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const messageDiv = document.getElementById("message");
    const formContainer = document.querySelector(".form-container");
    const cardContainer = document.querySelector(".card-container");
    const logoutBtn = document.getElementById("logout-btn");
    const refreshDataBtn = document.getElementById("refresh-data-btn");

    // --- عناصر كارت المستخدم (اللي عامل لوجن) ---
    const userNameP = document.getElementById("user-name");
    const userFamilyP = document.getElementById("user-family");
    const userBalanceP = document.getElementById("user-balance");
    const userAvatarImg = document.getElementById("user-avatar");
    const DEFAULT_AVATAR_URL = "/default-avatar.png";

    // --- عناصر السجل واللوحات ---
    const transactionList = document.getElementById("transaction-list");

    // --- عناصر تغيير الصورة ---
    const avatarUploadInput = document.getElementById("avatar-upload-input");
    const avatarOverlayLabel = document.getElementById("avatar-overlay-label");
    const signupAvatarFile = document.getElementById("signup-avatar-file");
    let loggedInUserProfile = null;

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
    const userAnnouncementBox = document.getElementById("user-announcement-box");
    const userAnnouncementText = document.getElementById("user-announcement-text");
    const adminAnnouncementForm = document.getElementById("admin-announcement-form");
    const adminAnnouncementText = document.getElementById("admin-announcement-text");
    const adminAnnouncementMessage = document.getElementById("admin-announcement-message");

    const massUpdateControls = document.getElementById("mass-update-controls");
    const selectedUsersCount = document.getElementById("selected-users-count");
    const massUpdateAmount = document.getElementById("mass-update-amount");
    const massUpdateAddBtn = document.getElementById("mass-update-add-btn");
    const massUpdateSubtractBtn = document.getElementById("mass-update-subtract-btn");
    const massUpdateMessage = document.getElementById("mass-update-message");
    let selectedUsersForMassUpdate = [];

    const leaderboardContainer = document.getElementById("leaderboard-container");
    const topChampionsList = document.getElementById("top-champions-list");
    const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
    const familyMargergesList = document.getElementById("family-margerges-list");
    const familyAnbaKarasList = document.getElementById("family-anba-karas-list");

    const quizContainer = document.getElementById("quiz-container");
    const quizQuestionText = document.getElementById("quiz-question-text");
    const quizBtnA = document.getElementById("quiz-btn-a");
    const quizBtnB = document.getElementById("quiz-btn-b");
    const quizBtnC = document.getElementById("quiz-btn-c");
    const quizOptionButtons = document.querySelectorAll(".quiz-option-btn");
    const quizSubmitBtn = document.getElementById("quiz-submit-btn");
    let currentSearchResults = [];
    let currentSearchedUser = null; 
    let currentQuizId = null;
    let selectedOption = null;

    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
    const resetUI = () => {
        cardContainer.style.display = "none";
        formContainer.style.display = "flex";
        logoutBtn.style.display = "none";
        refreshDataBtn.style.display = "none";
        adminPanelDiv.style.display = "none";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        avatarOverlayLabel.style.display = "none";
        massUpdateControls.style.display = "none";
        userAnnouncementBox.style.display = "none";
        loggedInUserProfile = null; 
        transactionList.innerHTML = "";
    };

    resetUI();


    // (فانكشن مساعدة لضغط الصور)
    function resizeImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => { /* ... */ });
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
            
            if (!response.ok) throw new Error("فشل الحصول على بيانات المستخدم");
            const data = await response.json();

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
                // await loadActiveQuiz(user.email); 
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

        messageDiv.textContent = "جاري تسجيل الدخول...";
        messageDiv.style.color = "blue";

        // إعادة ضبط اللوحة قبل اللوجن
        adminPanelDiv.style.display = "none";
        transactionList.innerHTML = "";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        userAnnouncementBox.style.display = "none";

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

            if (response.ok) {
                messageDiv.textContent = "تم تسجيل الدخول بنجاح!";
                messageDiv.style.color = "green";

                const user = data.user;

                loggedInUserProfile = user;

                // (ملء الكارت)
                userNameP.textContent = `الاسم: ${user.name}`;
                userFamilyP.textContent = `العائلة: ${user.family}`;
                userBalanceP.textContent = `الرصيد: $${user.balance}`;
                userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;

                // (إظهار الكارت)
                cardContainer.style.display = "flex";
                formContainer.style.display = "none";
                logoutBtn.style.display = "block";
                refreshDataBtn.style.display = "block";
                avatarOverlayLabel.style.display = "flex";

                await loadTransactionHistory(user.email);

                if (user.role === 'admin') {
                    // --- لو هو أدمن ---
                    messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
                    adminPanelDiv.style.display = "block";
                    leaderboardContainer.style.display = "none";
                    userAnnouncementBox.style.display = "none";
                    await loadAnnouncement();
                } else {
                    // --- لو هو يوزر عادي ---
                    await loadLeaderboards();
                    // await loadActiveQuiz(user.email); 
                    await loadAnnouncement();
                    leaderboardContainer.style.display = "block";
                    adminPanelDiv.style.display = "none";
                }

            } else {
                messageDiv.textContent = `فشل: ${data.error || "خطأ في بيانات الدخول"}`;
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = "حدث خطأ في الاتصال بالشبكة أو فشل غير متوقع.";
            messageDiv.style.color = "red";
        }
    });

    // --- فانكشن سجل المعاملات (مُحصنة) ---
    async function loadTransactionHistory(email) {
        transactionList.innerHTML = "<li>جاري تحميل السجل...</li>";
        try {
            const response = await fetch(`/get-transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) throw new Error("فشل جلب السجل"); 

            const data = await response.json();

            transactionList.innerHTML = "";
            if (data.transactions && data.transactions.length > 0) {
                // ... (ملء السجل)
            } else {
                transactionList.innerHTML = `<li class="no-history">لا يوجد معاملات سابقة.</li>`;
            }
        } catch(err) {
            transactionList.innerHTML = `<li class="no-history" style="color: red;">خطأ في تحميل السجل.</li>`;
            console.error("Transaction History Error:", err);
        }
    }


    // 🛑🛑 فانكشن لوحة الصدارة (مُصححة نهائياً) 🛑🛑
    async function loadLeaderboards() {
        // ... (الكود زي ما هو)
        leaderboardContainer.style.display = "block"; 
        
        topChampionsList.innerHTML = '<p style="text-align: center;">جاري التحميل...</p>';
        familyAnbaMoussaList.innerHTML = "<li>جاري التحميل...</li>";
        familyMargergesList.innerHTML = "<li>جاري التحميل...</li>";
        familyAnbaKarasList.innerHTML = "<li>جاري التحميل...</li>";

        const rankEmojis = { 1: "🥇", 2: "🥈", 3: "🥉" };

        try {
            // نداء الملفات المتخصصة بشكل متوازٍ
            const [championsResponse, anbaMoussaResponse, margergesResponse, karasResponse] = await Promise.all([
                fetch('/get-top-champions', { method: "POST" }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة الانبا موسي الاسود" }) }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة مارجرس" }) }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة الانبا كاراس" }) }),
            ]);

            // 1. الأبطال (Top 3)
            if (!championsResponse.ok) throw new Error("فشل تحميل الأبطال");
            const championsData = await championsResponse.json();
            
            topChampionsList.innerHTML = ""; 
            if (championsData.champions && championsData.champions.length > 0) {
                // ... (ملء الأبطال)
            } else {
                topChampionsList.innerHTML = '<p style="text-align: center; color: #888;">لا توجد بيانات كافية لعرض الأبطال.</p>';
            }

            // 2. القوائم التفصيلية (Top 10 لكل عائلة)
            const familyResponses = [
                { list: familyAnbaMoussaList, response: anbaMoussaResponse, name: "اسرة الانبا موسي الاسود" },
                { list: familyMargergesList, response: margergesResponse, name: "اسرة مارجرس" },
                { list: familyAnbaKarasList, response: karasResponse, name: "اسرة الانبا كاراس" }
            ];

            for (const item of familyResponses) {
                if (!item.response.ok) {
                    console.error(`فشل تحميل بيانات أسرة ${item.name}`, await item.response.text());
                    item.list.innerHTML = `<li style="color: red;">فشل في تحميل القائمة.</li>`;
                    continue;
                }
                const data = await item.response.json();
                
                item.list.innerHTML = '';
                if (data.users && data.users.length > 0) {
                    // ... (ملء القائمة)
                } else {
                    item.list.innerHTML = `<li><small>لا يوجد مستخدمين.</small></li>`;
                }
            }


        } catch (err) {
            console.error("Leaderboard Error:", err);
            topChampionsList.innerHTML = '<p style="text-align: center; color: red;">فشل تحميل لوحة الصدارة.</p>';
            familyAnbaMoussaList.innerHTML = '<li style="color: red;">فشل في تحميل القائمة.</li>';
            familyMargergesList.innerHTML = '<li style="color: red;">فشل في تحميل القائمة.</li>';
            familyAnbaKarasList.innerHTML = '<li style="color: red;">فشل في تحميل القائمة.</li>';
            leaderboardContainer.style.display = "none";
        }
    }


    // --- فانكشن جلب الكويز (مُحصنة) ---
    async function loadActiveQuiz(email) { /* ... */ }

    // 🛑🛑 فانكشن جديدة: جلب الإعلانات (لليوزر - تم إكمالها) 🛑🛑
    async function loadAnnouncement() {
        userAnnouncementBox.style.display = "none";
        userAnnouncementText.textContent = "";
        
        try {
            const response = await fetch(`/get-announcement`, { method: "POST" });
            if (!response.ok) throw new Error("فشل جلب الإعلان");

            const data = await response.json();
            if (data.message && data.message.trim()) {
                userAnnouncementText.textContent = data.message;
                // إظهار البوكس إذا كان هناك إعلان
                userAnnouncementBox.style.display = "block";
                // 🛑 تحديث الإعلان في لوحة الأدمن (إذا كان مفتوحًا)
                if (loggedInUserProfile && loggedInUserProfile.role === 'admin') {
                    adminAnnouncementText.value = data.message;
                }
            } else {
                userAnnouncementBox.style.display = "none";
            }
        } catch (err) {
            console.error("Load Announcement Error:", err);
        }
    }


    // --- فورم التسجيل (Signup) ---
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        // ... (كود التسجيل)
    });


    // 🛑🛑 زرار تسجيل الخروج (مُصحح نهائياً) 🛑🛑
    logoutBtn.addEventListener("click", () => {
        resetUI();
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";
    });


    // --- كود "تغيير الصورة" (زي ما هي) ---
    avatarUploadInput.addEventListener("change", async () => { /* ... */ });

    // --- أكواد الكويز (زي ما هي) ---
    quizOptionButtons.forEach(button => { /* ... */ });
    quizSubmitBtn.addEventListener("click", async () => { /* ... */ });

    // 🛑 ربط زرار الريفرش 🛑
    refreshDataBtn.addEventListener('click', refreshUserData);

    // 
    // --- أكواد الأدمن (إصلاح شامل) ---
    // 
    (function setupAdminPanel() {
        let currentSearchedUser = null;

        // --- 1. فورم البحث بالاسم ---
        adminSearchForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            const name = adminSearchInput.value.trim();

            adminSearchMessage.textContent = `جاري البحث عن ${name}...`;
            adminSearchMessage.style.color = "blue";
            adminResultsListDiv.innerHTML = "";
            adminSelectUser.innerHTML = '<option value="">اختر مستخدم...</option>';
            searchedUserCard.style.display = "none";
            currentSearchedUser = null;

            if (!name) {
                adminSearchMessage.textContent = "الرجاء إدخال اسم للبحث.";
                adminSearchMessage.style.color = "red";
                return;
            }

            try {
                const response = await fetch(`/admin-search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: name }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));
                
                if (!response.ok) {
                    adminSearchMessage.textContent = `فشل البحث: ${data.error || "خطأ غير محدد"}`;
                    adminSearchMessage.style.color = "red";
                    return;
                }

                currentSearchResults = data.users;

                if (currentSearchResults.length === 0) {
                    adminSearchMessage.textContent = `لم يتم العثور على مستخدمين بالاسم "${name}".`;
                    adminSearchMessage.style.color = "black";
                    adminResultsListDiv.style.display = "none";
                } else if (currentSearchResults.length === 1) {
                    adminSearchMessage.textContent = `تم العثور على مستخدم واحد.`;
                    adminSearchMessage.style.color = "green";
                    populateAdminCard(currentSearchResults[0]);
                    adminResultsListDiv.style.display = "none";
                } else {
                    // 🛑 اللوجيك المطلوب: عرض الدروب ليست للأسماء المكررة 🛑
                    adminSearchMessage.textContent = `تم العثور على ${currentSearchResults.length} مستخدم. يرجى الاختيار:`;
                    adminSearchMessage.style.color = "orange";

                    currentSearchResults.forEach(user => {
                        const option = document.createElement("option");
                        option.value = user.email;
                        option.textContent = `${user.name} (${user.family})`;
                        adminSelectUser.appendChild(option);
                    });
                    
                    adminResultsListDiv.style.display = "block";
                    adminSelectUser.value = currentSearchResults[0].email;
                    populateAdminCard(currentSearchResults[0]);
                }
            } catch (err) {
                adminSearchMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
                adminSearchMessage.style.color = "red";
                console.error("Admin Search Error:", err);
            }
        });

        // --- فانكشن ملء الكارت ---
        function populateAdminCard(user) {
            searchedUserName.textContent = `الاسم: ${user.name}`;
            searchedUserFamily.textContent = `العائلة: ${user.family}`;
            searchedUserEmail.textContent = `الإيميل: ${user.email}`;
            searchedUserBalance.textContent = `الرصيد: $${user.balance}`;
            searchedUserCard.style.display = "block";
            currentSearchedUser = user; 
            balanceMessage.textContent = "";
            deleteMessage.textContent = "";
        }

        // --- كود الدروب ليست ---
        adminSelectUser.addEventListener("change", () => {
            const selectedEmail = adminSelectUser.value;
            const user = currentSearchResults.find(u => u.email === selectedEmail);
            if (user) {
                populateAdminCard(user);
                searchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }
        });

        // --- فانكشن تعديل الرصيد الأساسية (مُحصنة) ---
        async function updateBalance(amount, reason) { /* ... */ }

        // --- زراير الرصيد (الفردي) ---
        addBalanceBtn.addEventListener("click", () => { /* ... */ });
        subtractBalanceBtn.addEventListener("click", () => { /* ... */ });

        // --- زرار حذف المستخدم (مُحصن) ---
        deleteUserBtn.addEventListener("click", async () => { /* ... */ });
        
        // --- كود زراير الأسر (مُصحح) ---
        familyButtons.forEach(button => { /* ... */ });

        // 🛑 كود متابعة الـ Checkboxes وتحديث اللوحة الجماعية 🛑
        adminFamilyResultsDiv.addEventListener('change', (e) => { /* ... */ });


        // --- فانكشن تعديل الرصيد الجماعي (مُحصنة) ---
        async function handleMassUpdate(amount) { /* ... */ }

        // (ربط زراير التعديل الجماعي)
        massUpdateAddBtn.addEventListener('click', () => { /* ... */ });
        massUpdateSubtractBtn.addEventListener('click', () => { /* ... */ });

        // 🛑 كود فورم إضافة سؤال (مُصحح) 🛑
        adminQuizForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            const question = document.getElementById("quiz-question").value.trim();
            const optionA = document.getElementById("quiz-opt-a").value.trim();
            const optionB = document.getElementById("quiz-opt-b").value.trim();
            const optionC = document.getElementById("quiz-opt-c").value.trim();
            // 🛑 هنا نستخدم ID حقل الإجابة الصحيحة
            const answer = document.getElementById("quiz-correct-opt").value.trim();
            const pointsInput = document.getElementById("quiz-points").value;
            const points = parseInt(pointsInput);

            if (!question || !optionA || !optionB || !optionC || !answer || isNaN(points) || points <= 0 || pointsInput.trim() === '') {
                adminQuizMessage.textContent = "فشل الإضافة: الرجاء ملء جميع الحقول بشكل صحيح (بما في ذلك النقاط).";
                adminQuizMessage.style.color = "red";
                return;
            }

            adminQuizMessage.textContent = "جاري إضافة السؤال...";
            adminQuizMessage.style.color = "blue";
            
            try {
                const response = await fetch(`/admin-create-quiz`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, optionA, optionB, optionC, answer, points }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

                if (response.ok) {
                    adminQuizMessage.textContent = `تم إضافة السؤال بنجاح!`;
                    adminQuizMessage.style.color = "green";
                    adminQuizForm.reset(); 
                } else {
                    adminQuizMessage.textContent = `فشل الإضافة: ${data.error || "خطأ غير محدد"}`;
                    adminQuizMessage.style.color = "red";
                }
            } catch (err) {
                adminQuizMessage.textContent = "خطأ في الاتصال بالـ API لإضافة الكويز.";
                adminQuizMessage.style.color = "red";
                console.error("Quiz Creation Error:", err);
            }
        });

        // 🛑 كود فورم الإعلانات (مُصحح) 🛑
        adminAnnouncementForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            const announcementTextValue = adminAnnouncementText.value.trim();

            if (!announcementTextValue) {
                adminAnnouncementMessage.textContent = "الرجاء كتابة نص الإعلان أولاً.";
                adminAnnouncementMessage.style.color = "red";
                return;
            }

            adminAnnouncementMessage.textContent = "جاري نشر الإعلان...";
            adminAnnouncementMessage.style.color = "blue";
            
            try {
                const response = await fetch(`/admin-set-announcement`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: announcementTextValue }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

                if (response.ok) {
                    adminAnnouncementMessage.textContent = "تم نشر الإعلان بنجاح!";
                    adminAnnouncementMessage.style.color = "green";
                    adminAnnouncementText.value = ""; // تفريغ الحقل
                    loadAnnouncement(); // 🛑 تحديث الإعلان لليوزر
                } else {
                    adminAnnouncementMessage.textContent = `فشل النشر: ${data.error || "خطأ غير محدد"}`;
                    adminAnnouncementMessage.style.color = "red";
                }
            } catch (err) {
                adminAnnouncementMessage.textContent = "خطأ في الاتصال بالـ API لنشر الإعلان.";
                adminAnnouncementMessage.style.color = "red";
                console.error("Set Announcement Error:", err);
            }
        });

    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
