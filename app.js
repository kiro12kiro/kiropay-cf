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

    // --- بيانات Cloudinary (مفترض وجودها) ---
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

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            width = maxHeight;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type, quality);
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
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
                data.transactions.forEach(t => {
                    const li = document.createElement("li");
                    const amountClass = t.amount > 0 ? "positive" : "negative";
                    const sign = t.amount > 0 ? "+" : "";
                    
                    li.innerHTML = `
                        <span>${t.reason}</span>
                        <span class="amount ${amountClass}">${sign}${t.amount} نقطة</span>
                    `;
                    transactionList.appendChild(li);
                });
            } else {
                transactionList.innerHTML = `<li class="no-history">لا يوجد معاملات سابقة.</li>`;
            }
        } catch(err) {
            transactionList.innerHTML = `<li class="no-history" style="color: red;">خطأ في تحميل السجل.</li>`;
            console.error("Transaction History Error:", err);
        }
    }


    // 🛑🛑 فانكشن لوحة الصدارة 🛑🛑
    async function loadLeaderboards() {
        leaderboardContainer.style.display = "block"; 
        
        topChampionsList.innerHTML = '<p style="text-align: center;">جاري التحميل...</p>';
        familyAnbaMoussaList.innerHTML = "<li>جاري التحميل...</li>";
        familyMargergesList.innerHTML = "<li>جاري التحميل...</li>";
        familyAnbaKarasList.innerHTML = "<li>جاري التحميل...</li>";

        const rankEmojis = { 1: "🥇", 2: "🥈", 3: "🥉" };

        try {
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
                championsData.champions.forEach((user, index) => {
                    const card = document.createElement('div');
                    card.className = 'champion-card';
                    card.innerHTML = `
                        <div class="rank">${rankEmojis[index + 1] || (index + 1)}</div>
                        <img src="${user.profile_image_url || DEFAULT_AVATAR_URL}" alt="${user.name}" class="card-img" style="width: 100px; height: 100px; border-radius: 50%;">
                        <span class="name">${user.name}</span>
                        <small style="display: block; color: #555;">${user.balance} نقطة</small>
                    `;
                    topChampionsList.appendChild(card);
                });
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
                    data.users.forEach((user, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span>${index + 1}. ${user.name}</span> <strong>${user.balance} نقطة</strong>`;
                        item.list.appendChild(li);
                    });
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


    // --- فانكشن جلب الإعلانات ---
    async function loadAnnouncement() {
        userAnnouncementBox.style.display = "none";
        userAnnouncementText.textContent = "";
        
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
        // ... (كود التسجيل)
    });


    // --- زرار تسجيل الخروج (مُصحح) ---
    logoutBtn.addEventListener("click", () => {
        resetUI();
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";
    });


    // --- كود "تغيير الصورة" (زي ما هي) ---
    avatarUploadInput.addEventListener("change", async () => { /* ... */ });

    // 🛑 ربط زرار الريفرش 🛑
    refreshDataBtn.addEventListener('click', refreshUserData);

    // 
    // --- أكواد الأدمن (إصلاح شامل) ---
    // 

    // 🛑 فانكشن ملء الكارت
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


    (function setupAdminPanel() {

        // --- 1. فورم البحث بالاسم ---
        adminSearchForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            const name = adminSearchInput.value.trim();
            // ... (باقي كود البحث)
            adminSearchMessage.textContent = `جاري البحث عن ${name}...`;
            adminSearchMessage.style.color = "blue";
            adminResultsListDiv.style.display = "none";
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


        // 🛑 كود الدروب ليست (للتنقل بين نتائج البحث) 🛑
        adminSelectUser.addEventListener("change", () => {
            const selectedEmail = adminSelectUser.value;
            const user = currentSearchResults.find(u => u.email === selectedEmail);
            if (user) {
                populateAdminCard(user);
                searchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }
        });

        // --- فانكشن تعديل الرصيد الأساسية ---
        async function updateBalance(amount, reason) {
            // ... (كود تعديل الرصيد صحيح)
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
                    
                    currentSearchedUser.balance = data.new_balance;
                    searchedUserBalance.textContent = `الرصيد: $${data.new_balance}`;
                    balanceAmountInput.value = "";
                    
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

        // --- زرار حذف المستخدم ---
        deleteUserBtn.addEventListener("click", async () => { /* ... */ });
        
        
        // 🛑🛑 1. إصلاح "عرض المستخدمين حسب الأسرة" 🛑🛑
        familyButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const familyName = button.dataset.family;
                
                adminFamilyMessage.textContent = `جاري تحميل مستخدمي أسرة ${familyName}...`;
                adminFamilyMessage.style.color = "blue";
                adminFamilyResultsDiv.innerHTML = '';
                massUpdateControls.style.display = 'none';
                selectedUsersForMassUpdate = [];
                selectedUsersCount.textContent = '0';

                try {
                    const response = await fetch(`/admin-get-family-users`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ family: familyName }),
                    });

                    const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

                    if (!response.ok) {
                        adminFamilyMessage.textContent = `فشل تحميل الأسرة: ${data.error || "خطأ غير محدد"}`;
                        adminFamilyMessage.style.color = "red";
                        return;
                    }

                    if (data.users && data.users.length > 0) {
                        adminFamilyMessage.textContent = `تم تحميل ${data.users.length} مستخدم من أسرة ${familyName}.`;
                        adminFamilyMessage.style.color = "green";

                        data.users.forEach(user => {
                            const div = document.createElement('div');
                            div.className = 'admin-family-user-item';
                            div.innerHTML = `
                                <input type="checkbox" id="user-${user.email}" data-email="${user.email}" data-balance="${user.balance}">
                                <label for="user-${user.email}">
                                    ${user.name} (${user.email}) - **$${user.balance}**
                                </label>
                            `;
                            adminFamilyResultsDiv.appendChild(div);
                        });

                        adminFamilyResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    } else {
                        adminFamilyMessage.textContent = `لا يوجد مستخدمين في أسرة ${familyName}.`;
                        adminFamilyMessage.style.color = "black";
                    }

                } catch (err) {
                    adminFamilyMessage.textContent = "خطأ في الاتصال بالشبكة لتحميل الأسرة.";
                    adminFamilyMessage.style.color = "red";
                    console.error("Family Load Error:", err);
                }
            });
        });

        // 🛑 كود متابعة الـ Checkboxes وتحديث اللوحة الجماعية 🛑
        adminFamilyResultsDiv.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const email = e.target.dataset.email;
                if (e.target.checked) {
                    if (!selectedUsersForMassUpdate.includes(email)) {
                        selectedUsersForMassUpdate.push(email);
                    }
                } else {
                    selectedUsersForMassUpdate = selectedUsersForMassUpdate.filter(u => u !== email);
                }

                selectedUsersCount.textContent = selectedUsersForMassUpdate.length;

                if (selectedUsersForMassUpdate.length > 0) {
                    massUpdateControls.style.display = 'block';
                } else {
                    massUpdateControls.style.display = 'none';
                }
                massUpdateMessage.textContent = ''; 
            }
        });


        // --- فانكشن تعديل الرصيد الجماعي ---
        async function handleMassUpdate(amount) { /* ... */ }

        // (ربط زراير التعديل الجماعي)
        massUpdateAddBtn.addEventListener('click', () => { /* ... */ });
        massUpdateSubtractBtn.addEventListener('click', () => { /* ... */ });

        // 🛑🛑 2. إصلاح "إضافة سؤال جديد (Quiz)" 🛑🛑
        adminQuizForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            const question = document.getElementById("admin-quiz-question").value.trim();
            const optionA = document.getElementById("admin-quiz-option-a").value.trim();
            const optionB = document.getElementById("admin-quiz-option-b").value.trim();
            const optionC = document.getElementById("admin-quiz-option-c").value.trim();
            const answer = document.getElementById("admin-quiz-correct-answer").value.trim();
            const points = parseInt(document.getElementById("admin-quiz-points").value);

            if (!question || !optionA || !optionB || !optionC || !answer || isNaN(points) || points <= 0) {
                adminQuizMessage.textContent = "الرجاء ملء جميع الحقول بشكل صحيح.";
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
                    adminQuizMessage.textContent = `تم إضافة السؤال (ID: ${data.quiz_id}) بنجاح!`;
                    adminQuizMessage.style.color = "green";
                    adminQuizForm.reset(); 
                } else {
                    adminQuizMessage.textContent = `فشل الإضافة: ${data.error || "خطأ غير محدد"}`;
                    adminQuizMessage.style.color = "red";
                }
            } catch (err) {
                adminQuizMessage.textContent = "خطأ في الاتصال بالـ API.";
                adminQuizMessage.style.color = "red";
                console.error("Quiz Creation Error:", err);
            }
        });

        // 🛑🛑 3. إصلاح "نشر إعلان عام" 🛑🛑
        adminAnnouncementForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            const announcement = adminAnnouncementText.value.trim();

            if (!announcement) {
                adminAnnouncementMessage.textContent = "الرجاء كتابة نص الإعلان.";
                adminAnnouncementMessage.style.color = "red";
                return;
            }

            adminAnnouncementMessage.textContent = "جاري نشر الإعلان...";
            adminAnnouncementMessage.style.color = "blue";
            
            try {
                const response = await fetch(`/admin-post-announcement`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: announcement }),
                });

                const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

                if (response.ok) {
                    adminAnnouncementMessage.textContent = `تم نشر الإعلان بنجاح.`;
                    adminAnnouncementMessage.style.color = "green";
                    adminAnnouncementForm.reset(); 
                    loadAnnouncement(); // لتحديث الإعلان في لوحة المستخدمين
                } else {
                    adminAnnouncementMessage.textContent = `فشل النشر: ${data.error || "خطأ غير محدد"}`;
                    adminAnnouncementMessage.style.color = "red";
                }
            } catch (err) {
                adminAnnouncementMessage.textContent = "خطأ في الاتصال بالـ API.";
                adminAnnouncementMessage.style.color = "red";
                console.error("Announcement Post Error:", err);
            }
        });

    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
