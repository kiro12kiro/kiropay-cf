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
    const quizMessage = document.getElementById("quiz-message");
    let currentSearchedUserEmail = null;
    let currentSearchResults = [];
    let currentQuizId = null;
    let selectedOption = null;

    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
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


    // (فانكشن مساعدة لضغط الصور)
    function resizeImage(file, maxWidth, maxHeight, quality) {
        // ... (الكود الخاص بضغط الصورة - لا يحتاج تغيير)
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

        messageDiv.textContent = "جاري تسجيل الدخول...";
        messageDiv.style.color = "blue";

        // إخفاء الأقسام
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

                // (جلب السجل - ده مشترك للكل)
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
                    await loadActiveQuiz(user.email);
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
        // ... (الكود زي ما هو)
    }


    // --- فانكشن لوحة الصدارة (مُصححة نهائياً) ---
    async function loadLeaderboards() {
        // ... (الكود زي ما هو)
    }


    // --- فانكشن مساعدة (لن تستخدم هنا - لكنها جزء من النسخة الكاملة) ---
    async function populateFamilyList(familyName, listElement) { /* ... */ }

    // --- فانكشن جلب الكويز (مُحصنة) ---
    async function loadActiveQuiz(email) { /* ... */ }

    // 🛑🛑 فانكشن جديدة: جلب الإعلانات (لليوزر) 🛑🛑
    async function loadAnnouncement() {
        userAnnouncementBox.style.display = "none";
        try {
            const response = await fetch(`/get-announcement`, { method: "POST" });
            if (!response.ok) throw new Error("فشل جلب الإعلان");

            const data = await response.json();
            if (data.message && data.message.trim()) {
                userAnnouncementText.textContent = data.message;
                userAnnouncementBox.style.display = "block";
            }
        } catch (err) {
            console.error("Load Announcement Error:", err);
        }
    }


    // --- فورم التسجيل (Signup) ---
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        // ... (الكود زي ما هو)
    });


    // --- زرار تسجيل الخروج (مُصحح) ---
    logoutBtn.addEventListener("click", () => {
        // ... (الكود زي ما هو)
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

        // --- 1. فورم البحث بالاسم (مُصحح) ---
        adminSearchForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 🛑 التأكيد: منع إعادة التحميل
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
                } else {
                    adminSearchMessage.textContent = `تم العثور على ${currentSearchResults.length} مستخدم:`;
                    adminSearchMessage.style.color = "green";

                    currentSearchResults.forEach(user => {
                        const option = document.createElement("option");
                        option.value = user.email;
                        option.textContent = `${user.name} (${user.family})`;
                        adminSelectUser.appendChild(option);
                    });
                    
                    adminResultsListDiv.style.display = "block";
                    // قم بملء الكارت بأول نتيجة تلقائيا
                    adminSelectUser.value = currentSearchResults[0].email;
                    populateAdminCard(currentSearchResults[0]);
                }
            } catch (err) {
                adminSearchMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
                adminSearchMessage.style.color = "red";
                console.error("Admin Search Error:", err);
            }
        });

        // --- فانكشن ملء الكارت (مُصححة) ---
        function populateAdminCard(user) {
            searchedUserName.textContent = `الاسم: ${user.name}`;
            searchedUserFamily.textContent = `العائلة: ${user.family}`;
            searchedUserEmail.textContent = `الإيميل: ${user.email}`;
            searchedUserBalance.textContent = `الرصيد: $${user.balance}`;
            searchedUserCard.style.display = "block";
            // 🛑 الإصلاح الحاسم: يتم حفظ المستخدم الحالي في المتغير
            currentSearchedUser = user; 
            balanceMessage.textContent = "";
            deleteMessage.textContent = "";
        }

        // --- كود الدروب ليست (للتنقل بين نتائج البحث) ---
        adminSelectUser.addEventListener("change", () => {
            const selectedEmail = adminSelectUser.value;
            const user = currentSearchResults.find(u => u.email === selectedEmail);
            if (user) {
                populateAdminCard(user);
            }
        });

        // --- فانكشن تعديل الرصيد الأساسية (مُحصنة) ---
        async function updateBalance(amount, reason) {
            if (!currentSearchedUser || !loggedInUserProfile) {
                balanceMessage.textContent = "يجب تحديد مستخدم أولاً.";
                balanceMessage.style.color = "red";
                return;
            }

            balanceMessage.textContent = "جاري تحديث الرصيد...";
            balanceMessage.style.color = "blue";
            addBalanceBtn.disabled = true;
            subtractBalanceBtn.disabled = true;

            try {
                const response = await fetch(`/admin-update-balance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: currentSearchedUser.email,
                        amount: amount,
                        reason: reason
                    }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

                if (response.ok) {
                    balanceMessage.textContent = `تم التحديث بنجاح. الرصيد الجديد: $${data.new_balance}`;
                    balanceMessage.style.color = "green";
                    
                    // تحديث الكارت والأوبجكت بعد التعديل
                    currentSearchedUser.balance = data.new_balance;
                    searchedUserBalance.textContent = `الرصيد: $${data.new_balance}`;
                    balanceAmountInput.value = "";
                    
                    // تحديث بيانات الأدمن إذا كان هو المستخدم المُعدل
                    if (loggedInUserProfile.email === currentSearchedUser.email) {
                        refreshUserData(); 
                    }

                } else {
                    balanceMessage.textContent = `فشل التحديث: ${data.error || "خطأ غير محدد"}`;
                    balanceMessage.style.color = "red";
                }
            } catch (err) {
                balanceMessage.textContent = "خطأ في الاتصال بالـ API.";
                balanceMessage.style.color = "red";
                console.error("Balance Update Error:", err);
            } finally {
                addBalanceBtn.disabled = false;
                subtractBalanceBtn.disabled = false;
            }
        }

        // --- زراير الرصيد (الفردي) ---
        addBalanceBtn.addEventListener("click", () => {
            const amount = parseInt(balanceAmountInput.value);
            if (isNaN(amount) || amount <= 0 || !currentSearchedUser) {
                 balanceMessage.textContent = "الرجاء تحديد مستخدم وإدخال قيمة صحيحة.";
                 balanceMessage.style.color = "red";
                 return;
            }
            updateBalance(amount, "إضافة يدوية من الأدمن");
        });
        subtractBalanceBtn.addEventListener("click", () => {
            const amount = parseInt(balanceAmountInput.value); 
            if (isNaN(amount) || amount <= 0 || !currentSearchedUser) {
                balanceMessage.textContent = "الرجاء تحديد مستخدم وإدخال قيمة صحيحة.";
                balanceMessage.style.color = "red";
                return;
            }
            updateBalance(-amount, "خصم يدوي من الأدمن");
        });

        // --- زرار حذف المستخدم (مُحصن) ---
        deleteUserBtn.addEventListener("click", async () => {
            if (!currentSearchedUser) {
                deleteMessage.textContent = "الرجاء تحديد مستخدم للحذف.";
                deleteMessage.style.color = "red";
                return;
            }

            if (!confirm(`هل أنت متأكد من حذف المستخدم ${currentSearchedUser.name}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                return;
            }

            deleteMessage.textContent = "جاري الحذف...";
            deleteMessage.style.color = "blue";
            deleteUserBtn.disabled = true;

            try {
                const response = await fetch(`/admin-delete-user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: currentSearchedUser.email }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));
                
                if (response.ok) {
                    deleteMessage.textContent = `تم حذف المستخدم ${currentSearchedUser.name} بنجاح.`;
                    deleteMessage.style.color = "green";
                    searchedUserCard.style.display = "none";
                    currentSearchedUser = null;
                    // تحديث قائمة البحث إذا كانت مفتوحة
                    adminSelectUser.innerHTML = '<option value="">اختر مستخدم...</option>';
                    adminResultsListDiv.style.display = "none";
                } else {
                    deleteMessage.textContent = `فشل الحذف: ${data.error || "خطأ غير محدد"}`;
                    deleteMessage.style.color = "red";
                }
            } catch (err) {
                deleteMessage.textContent = "خطأ في الاتصال بالـ API.";
                deleteMessage.style.color = "red";
                console.error("Delete User Error:", err);
            } finally {
                deleteUserBtn.disabled = false;
            }
        });
        
        // --- كود زراير الأسر (مُصحح) ---
        familyButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const familyName = button.dataset.family;
                
                adminFamilyMessage.textContent = `جاري تحميل بيانات "${familyName}"...`;
                adminFamilyMessage.style.color = "blue";
                adminFamilyResultsDiv.style.display = "none";
                adminFamilyResultsDiv.innerHTML = "";
                massUpdateMessage.textContent = "";

                try {
                    const response = await fetch(`/admin-get-family`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ family: familyName }),
                    });

                    const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

                    if (!response.ok) {
                        adminFamilyMessage.textContent = `فشل: ${data.error || "خطأ غير محدد"}`;
                        adminFamilyMessage.style.color = "red";
                        massUpdateControls.style.display = "none";
                        return;
                    }

                    const users = data.users;

                    if (users.length === 0) {
                        adminFamilyMessage.textContent = `لا يوجد مستخدمين مسجلين في "${familyName}".`;
                        adminFamilyMessage.style.color = "black";
                        massUpdateControls.style.display = "none";
                    } else {
                        adminFamilyMessage.textContent = `تم العثور على ${users.length} مستخدم في "${familyName}":`;
                        adminFamilyMessage.style.color = "green";
                        massUpdateControls.style.display = "block";

                        users.forEach(user => {
                            const userItem = document.createElement("div");
                            userItem.className = "family-user-item";

                            const checkbox = document.createElement("input");
                            checkbox.type = "checkbox";
                            checkbox.className = "mass-update-checkbox";
                            checkbox.dataset.email = user.email;

                            // حفظ حالة الـ Checkbox في حالة لو كان مختار من قبل
                            if (selectedUsersForMassUpdate.includes(user.email)) {
                                checkbox.checked = true;
                            }

                            const userInfo = document.createElement("div");
                            userInfo.className = "user-info";
                            userInfo.innerHTML = `
                                <span>${user.name} (${user.email})</span>
                                <strong>الرصيد: $${user.balance}</strong>
                            `;

                            userInfo.addEventListener('click', () => {
                                user.family = familyName;
                                populateAdminCard(user);
                                searchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            });

                            userItem.appendChild(checkbox);
                            userItem.appendChild(userInfo);
                            adminFamilyResultsDiv.appendChild(userItem);
                        });

                        adminFamilyResultsDiv.style.display = "block";
                        selectedUsersCount.textContent = selectedUsersForMassUpdate.length;
                    }

                } catch (err) {
                    adminFamilyMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
                    adminFamilyMessage.style.color = "red";
                    massUpdateControls.style.display = "none";
                }
            });
        });

        // 🛑 كود متابعة الـ Checkboxes وتحديث اللوحة الجماعية 🛑
        adminFamilyResultsDiv.addEventListener('change', (e) => {
            if (e.target.classList.contains('mass-update-checkbox')) {
                const email = e.target.dataset.email;
                if (e.target.checked) {
                    if (!selectedUsersForMassUpdate.includes(email)) {
                        selectedUsersForMassUpdate.push(email);
                    }
                } else {
                    selectedUsersForMassUpdate = selectedUsersForMassUpdate.filter(u => u !== email);
                }
                selectedUsersCount.textContent = selectedUsersForMassUpdate.length;
            }
        });


        // --- فانكشن تعديل الرصيد الجماعي (مُحصنة) ---
        async function handleMassUpdate(amount) {
            if (selectedUsersForMassUpdate.length === 0) {
                massUpdateMessage.textContent = "الرجاء اختيار مستخدم واحد على الأقل.";
                massUpdateMessage.style.color = "red";
                return;
            }

            const isAdd = amount > 0;
            const absoluteAmount = Math.abs(amount);
            const action = isAdd ? "إضافة" : "خصم";
            const reason = isAdd ? "إضافة جماعية من الأدمن" : "خصم جماعي من الأدمن";

            if (!confirm(`هل أنت متأكد من ${action} ${absoluteAmount} نقطة لـ ${selectedUsersForMassUpdate.length} مستخدم؟`)) {
                return;
            }

            massUpdateMessage.textContent = `جاري ${action} الرصيد لـ ${selectedUsersForMassUpdate.length} مستخدم...`;
            massUpdateMessage.style.color = "blue";
            massUpdateAddBtn.disabled = true;
            massUpdateSubtractBtn.disabled = true;

            try {
                const response = await fetch(`/admin-mass-update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        emails: selectedUsersForMassUpdate,
                        amount: amount,
                        reason: reason
                    }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));
                
                if (response.ok) {
                    massUpdateMessage.textContent = `تم ${action} الرصيد بنجاح لـ ${data.updated_count} مستخدم.`;
                    massUpdateMessage.style.color = "green";
                    
                    // إفراغ الاختيار بعد النجاح
                    selectedUsersForMassUpdate = [];
                    selectedUsersCount.textContent = "0";
                    massUpdateAmount.value = "";
                    adminFamilyResultsDiv.innerHTML = ""; // لإعادة تحميل القائمة
                    
                    // تحديث بيانات المستخدم الأدمن (إذا كان ضمن التحديث)
                    refreshUserData();
                    
                } else {
                    massUpdateMessage.textContent = `فشل التحديث الجماعي: ${data.error || "خطأ غير محدد"}`;
                    massUpdateMessage.style.color = "red";
                }
            } catch (err) {
                massUpdateMessage.textContent = "خطأ في الاتصال بالـ API.";
                massUpdateMessage.style.color = "red";
                console.error("Mass Update Error:", err);
            } finally {
                massUpdateAddBtn.disabled = false;
                massUpdateSubtractBtn.disabled = false;
            }
        }

        // (ربط زراير التعديل الجماعي)
        massUpdateAddBtn.addEventListener('click', () => {
            const amount = parseInt(massUpdateAmount.value);
            if (!isNaN(amount) && amount > 0) {
                handleMassUpdate(amount);
            } else {
                massUpdateMessage.textContent = "الرجاء إدخال قيمة صحيحة وموجبة.";
                massUpdateMessage.style.color = "red";
            }
        });
        massUpdateSubtractBtn.addEventListener('click', () => {
            const amount = parseInt(massUpdateAmount.value);
            if (!isNaN(amount) && amount > 0) {
                handleMassUpdate(-amount); // إرسال قيمة سالبة للخصم
            } else {
                massUpdateMessage.textContent = "الرجاء إدخال قيمة صحيحة وموجبة.";
                massUpdateMessage.style.color = "red";
            }
        });

        // --- كود فورم إضافة سؤال (مُصحح) ---
        adminQuizForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 🛑 التأكد من منع إعادة التحميل
            // ... (باقي الكود)
        });

        // 🛑 كود فورم الإعلانات (مُصحح) 🛑
        adminAnnouncementForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 🛑 التأكد من منع إعادة التحميل
            
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
                    loadAnnouncement(); // تحديث إعلان الأدمن لنفسه
                } else {
                    adminAnnouncementMessage.textContent = `فشل النشر: ${data.error || "خطأ غير محدد"}`;
                    adminAnnouncementMessage.style.color = "red";
                }
            } catch (err) {
                adminAnnouncementMessage.textContent = "خطأ في الاتصال بالـ API.";
                adminAnnouncementMessage.style.color = "red";
                console.error("Set Announcement Error:", err);
            }
        });

    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
