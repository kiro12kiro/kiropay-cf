document.addEventListener("DOMContentLoaded", () => {
    // --- مسك العناصر الأساسية ---
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const messageDiv = document.getElementById("message");
    const formContainer = document.querySelector(".form-container");
    const cardContainer = document.querySelector(".card-container");
    const logoutBtn = document.getElementById("logout-btn");
    const refreshDataBtn = document.getElementById("refresh-data-btn");

    // --- 🛑🛑 عناصر واجهة الزائر (جديدة) 🛑🛑 ---
    const guestPanel = document.getElementById("guest-panel");
    // 🛑 استخدمنا querySelectorAll لاستهداف الزراير داخل لوحة الزائر فقط
    const guestFamilyButtons = guestPanel.querySelectorAll(".family-btn"); 
    const guestFamilyResults = document.getElementById("guest-family-results");
    const guestFamilyMessage = document.getElementById("guest-family-message");
    const guestLogoutBtn = document.getElementById("guest-logout-btn"); // زر اللوج أوت الخاص بالزائر


    // --- عناصر كارت المستخدم (اللي عامل لوجن) ---
    const userNameP = document.getElementById("user-name");
    const userFamilyP = document.getElementById("user-family");
    const userBalanceP = document.getElementById("user-balance");
    const userLevelP = document.getElementById("user-level"); 
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
    const searchedUserLevel = document.getElementById("searched-user-level"); 
    const balanceAmountInput = document.getElementById("admin-balance-amount");
    const addBalanceBtn = document.getElementById("admin-add-balance-btn");
    const subtractBalanceBtn = document.getElementById("admin-subtract-balance-btn");
    const balanceMessage = document.getElementById("admin-balance-message");
    
    // 🛑 عناصر التحكم في المستوى (الأدمن)
    const adminLevelAmount = document.getElementById("admin-level-amount");
    const adminUpdateLevelBtn = document.getElementById("admin-update-level-btn");
    const adminLevelMessage = document.getElementById("admin-level-message"); 
    
    const deleteUserBtn = document.getElementById("admin-delete-user-btn");
    const deleteMessage = document.getElementById("admin-delete-message");
    // 🛑 تم تغيير اسم المتغير هذا ليكون خاصاً بالأدمن فقط
    const adminFamilyButtons = adminPanelDiv.querySelectorAll(".family-btn");
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

    // --- عناصر المتجر (جديدة) ---
    const storeContainer = document.getElementById("store-container");
    const storeItemsList = document.getElementById("store-items-list");
    const storeMessage = document.getElementById("store-message");
    const storeLoadingMessage = document.getElementById("store-loading-message");
    // --- عناصر إدارة المتجر (جديدة) ---
    const adminAddItemForm = document.getElementById("admin-add-item-form");
    const adminStoreItemsList = document.getElementById("admin-store-items-list");
    const adminStoreMessage = document.getElementById("admin-store-message");
    const storeItemImageFile = document.getElementById("store-item-image-file"); 
    const storeItemRequiredLevel = document.getElementById("store-item-required-level"); 

    // --- عناصر المشتريات (جديدة) ---
    const unlockedItemsBtn = document.getElementById("unlocked-items-btn");
    const unlockedItemsContainer = document.getElementById("unlocked-items-container");
    const unlockedItemsList = document.getElementById("unlocked-items-list");
    const unlockedItemsMessage = document.getElementById("unlocked-items-message");
    const backToStoreBtn = document.getElementById("back-to-store-btn"); 
    // --- نهاية عناصر المشتريات ---

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
    
    // 🛑 عناصر نافذة التعديل (Modal) 🛑
    const editModalOverlay = document.getElementById("edit-modal-overlay");
    const closeEditModal = document.getElementById("close-edit-modal");
    const editItemForm = document.getElementById("edit-item-form");
    const editItemId = document.getElementById("edit-item-id");
    const editItemCurrentUrl = document.getElementById("edit-item-current-url");
    const editItemName = document.getElementById("edit-item-name");
    const editItemPrice = document.getElementById("edit-item-price");
    const editItemRequiredLevel = document.getElementById("edit-item-required-level"); 
    const editItemNewFile = document.getElementById("edit-item-new-file");
    const editCurrentImage = document.getElementById("edit-current-image");
    const editUploadStatusMessage = document.getElementById("edit-upload-status-message");

    // 🛑🛑 عناصر كود QR الجديدة 🛑🛑
    const showQrBtn = document.getElementById("show-qr-btn");
    const qrModalOverlay = document.getElementById("qr-modal-overlay");
    const closeQrBtn = document.querySelector(".close-qr-btn");
    const qrCodeContainer = document.getElementById("qr-code-container");
    const qrUserEmailDisplay = document.getElementById("qr-user-email-display");
    
    // 🛑🛑 عناصر مسح الأدمن 🛑🛑
    const startScanBtn = document.getElementById("start-scan-btn");
    const readerDiv = document.getElementById("reader");
    const rewardReasonSelect = document.getElementById("reward-reason-select");
    const scanStatusMessage = document.getElementById("scan-status-message");
    let html5QrCode = null; // للمكتبة

    // 🛑🛑 عناصر طباعة الـ QR (جديدة) 🛑🛑
    const fetchQrListBtn = document.getElementById("admin-fetch-qr-list-btn");
    const qrListResults = document.getElementById("admin-qr-list-results");
    const qrListMessage = document.getElementById("admin-qr-list-message");

    // 🛑🛑 زر عرض QR للأدمن (جديد) 🛑🛑
    const adminShowUserQrBtn = document.getElementById("admin-show-user-qr-btn");


    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
    const resetUI = () => {
        cardContainer.style.display = "none";
        formContainer.style.display = "flex";
        logoutBtn.style.display = "none";
        guestLogoutBtn.style.display = "none"; // 🛑 إخفاء زر خروج الزائر
        guestPanel.style.display = "none"; // 🛑 إخفاء واجهة الزائر
        refreshDataBtn.style.display = "none";
        unlockedItemsBtn.style.display = "none"; 
        if (showQrBtn) showQrBtn.style.display = "none";
        adminPanelDiv.style.display = "none";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        storeContainer.style.display = "none";
        unlockedItemsContainer.style.display = "none"; 
        avatarOverlayLabel.style.display = "none";
        massUpdateControls.style.display = "none";
        userAnnouncementBox.style.display = "none";
        loggedInUserProfile = null; 
        transactionList.innerHTML = "";
        if (userLevelP) userLevelP.textContent = ""; 
        if (editModalOverlay) editModalOverlay.style.display = "none"; 
        if (qrModalOverlay) qrModalOverlay.style.display = "none"; // 🛑 إخفاء مودال الـ QR
        // 🛑 إيقاف الماسح إذا كان يعمل عند تسجيل الخروج
        if (html5QrCode && html5QrCode.isScanning) {
            try {
                html5QrCode.stop().catch(err => console.error("Error stopping scanner:", err));
            } catch (e) {
                console.warn("Scanner stop failed on reset:", e);
            }
        }
        html5QrCode = null;
    };

    resetUI();


    // 🛑🛑 فانكشن مساعدة لضغط الصور (مطلوبة لرفع صور المنتجات) 🛑🛑
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
                            height = maxHeight;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    // 🛑🛑 دالة لإخفاء أقسام المستخدم جميعها 🛑🛑
    function hideUserSections() {
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        storeContainer.style.display = "none";
        unlockedItemsContainer.style.display = "none";
    }
    
    // 🛑🛑 دالة العودة للصفحة الرئيسية (المتجر + الكويز + الصدارة) 🛑🛑
    async function loadMainDashboard() {
        if (!loggedInUserProfile || loggedInUserProfile.role === 'admin') return;
        
        hideUserSections(); 
        
        // 🛑🛑 تحميل الأقسام بشكل تسلسلي ومحمي ضد الانهيار 🛑🛑
        try { await loadLeaderboards(); } catch(e) { console.error("Load Failed: Leaderboard", e); leaderboardContainer.style.display = "none"; }
        try { await loadActiveQuiz(loggedInUserProfile.email); } catch(e) { console.error("Load Failed: Quiz", e); quizContainer.style.display = "none"; }
        try { await loadStoreItems(); } catch(e) { console.error("Load Failed: Store", e); storeContainer.style.display = "none"; }
        
        // هذه الدوال ستقوم بضبط display: block للعناصر الخاصة بها
    }


    // 🛑🛑 فانكشن جلب وعرض مشتريات المستخدم 🛑🛑
    async function loadUserUnlockedItems() {
        if (!loggedInUserProfile) return;

        hideUserSections();
        unlockedItemsContainer.style.display = "block";
        unlockedItemsList.innerHTML = '<p style="text-align: center;">جاري تحميل المشتريات...</p>';
        unlockedItemsMessage.textContent = '';

        try {
            const response = await fetch(`/get-unlocked-items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email }),
            });
            
            const data = await response.json();

            unlockedItemsList.innerHTML = '';
            if (response.ok && data.success && data.items.length > 0) {
                data.items.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'store-item-card';
                    const purchaseDate = new Date(item.purchased_at).toLocaleDateString('ar-EG');
                    
                    const itemName = item.name || 'منتج غير معروف';

                    card.innerHTML = `
                        <img src="${item.image_url || '/default-item.png'}" alt="${itemName}">
                        <h5>${itemName}</h5>
                        <p style="color: #28a745;">تم الشراء مقابل ${item.price} نقطة</p>
                        <small>في: ${purchaseDate}</small>
                    `;
                    unlockedItemsList.appendChild(card);
                });
            } else {
                unlockedItemsList.innerHTML = `<p style="text-align: center;">لم تقم بأي مشتريات سابقة.</p>`;
            }
        } catch(err) {
            unlockedItemsMessage.textContent = `خطأ في تحميل المشتريات: ${err.message}`;
            unlockedItemsMessage.style.color = 'red';
            console.error("Unlocked Items Error:", err);
        }
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

            userNameP.textContent = `الاسم: ${user.name}`;
            userFamilyP.textContent = `العائلة: ${user.family}`;
            userBalanceP.textContent = `الرصيد: $${user.balance}`;
            userLevelP.textContent = `المستوى: ${user.level || 1}`; // 🛑 تحديث المستوى
            userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
            
            await loadTransactionHistory(user.email);
            if (user.role !== 'admin') {
                unlockedItemsBtn.style.display = "block"; // 🛑 إظهار الزر
                if (showQrBtn) showQrBtn.style.display = "block"; // 🛑 إظهار زرار الـ QR
                
                // 🛑🛑 نستخدم loadMainDashboard لتهيئة الواجهة بعد التحديث 🛑🛑
                await loadMainDashboard();
                await loadAnnouncement(); // 🛑🛑 تم الإصلاح: تحميل الإعلان للمستخدم
            } else {
                unlockedItemsBtn.style.display = "none";
                if (showQrBtn) showQrBtn.style.display = "none"; // 🛑 إخفاء زرار الـ QR للأدمن
                await loadAnnouncement();
                await loadAdminStoreItems(); 
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
        hideUserSections();
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

                // 🛑🛑🛑 --- التحقق من نوع المستخدم (Role) --- 🛑🛑🛑
                if (user.role === 'admin') {
                    // 1. عرض لوحة الأدمن (ADMIN VIEW)
                    messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
                    adminPanelDiv.style.display = "block";
                    cardContainer.style.display = "flex"; // الأدمن يرى الكارت الخاص به
                    avatarOverlayLabel.style.display = "flex";
                    
                    // ملء بيانات كارت الأدمن (نفس بيانات اليوزر العادي)
                    userNameP.textContent = `الاسم: ${user.name}`;
                    userFamilyP.textContent = `العائلة: ${user.family}`;
                    userBalanceP.textContent = `الرصيد: $${user.balance}`;
                    userLevelP.textContent = `المستوى: ${user.level || 1}`;
                    userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
                    
                    await loadTransactionHistory(user.email);
                    await loadAnnouncement();
                    await loadAdminStoreItems(); 

                    // إخفاء أشياء اليوزر العادي
                    formContainer.style.display = "none";
                    logoutBtn.style.display = "block";
                    refreshDataBtn.style.display = "block";
                    unlockedItemsBtn.style.display = "none";
                    if (showQrBtn) showQrBtn.style.display = "none";
                    hideUserSections();

                } else if (user.role === 'guest') {
                    // 2. عرض لوحة الزائر (GUEST VIEW)
                    messageDiv.textContent = "مرحباً أيها الزائر!";
                    guestPanel.style.display = "block"; // 🛑 إظهار واجهة الزائر
                    guestLogoutBtn.style.display = "block"; // 🛑 إظهار زر خروج الزائر
                    
                    // 🛑 إخفاء كل شيء آخر
                    cardContainer.style.display = "none";
                    formContainer.style.display = "none";
                    logoutBtn.style.display = "none";
                    avatarOverlayLabel.style.display = "none";
                    refreshDataBtn.style.display = "none";
                    unlockedItemsBtn.style.display = "none";
                    if (showQrBtn) showQrBtn.style.display = "none";
                    hideUserSections();
                    leaderboardContainer.style.display = "none";
                    adminPanelDiv.style.display = "none";

                } else {
                    // 3. عرض لوحة المستخدم العادي (USER VIEW)
                    userNameP.textContent = `الاسم: ${user.name}`;
                    userFamilyP.textContent = `العائلة: ${user.family}`;
                    userBalanceP.textContent = `الرصيد: $${user.balance}`;
                    userLevelP.textContent = `المستوى: ${user.level || 1}`;
                    userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
                    
                    cardContainer.style.display = "flex";
                    formContainer.style.display = "none";
                    logoutBtn.style.display = "block";
                    refreshDataBtn.style.display = "block";
                    avatarOverlayLabel.style.display = "flex";

                    await loadTransactionHistory(user.email);
                    
                    unlockedItemsBtn.style.display = "block"; 
                    if (showQrBtn) showQrBtn.style.display = "block"; 
                    await loadMainDashboard(); 
                    await loadAnnouncement(); 
                    leaderboardContainer.style.display = "block";
                    adminPanelDiv.style.display = "none";
                }
                // 🛑🛑🛑 --- نهاية التحقق من نوع المستخدم --- 🛑🛑🛑

            } else {
                messageDiv.textContent = `فشل: ${data.error || "خطأ في بيانات الدخول"}`;
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = "حدث خطأ في الاتصال بالشبكة أو فشل غير متوقع.";
            messageDiv.style.color = "red";
        }
    });

    // 🛑🛑 معالجة ضغط زر مشترياتي 🛑🛑
    if (unlockedItemsBtn) unlockedItemsBtn.addEventListener('click', loadUserUnlockedItems);
    // 🛑🛑 معالجة ضغط زر العودة للمتجر 🛑🛑
    if (backToStoreBtn) backToStoreBtn.addEventListener('click', loadMainDashboard);
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


    // 🛑🛑 فانكشن لوحة الصدارة (مُصححة نهائياً) 🛑🛑
    async function loadLeaderboards() {
        leaderboardContainer.style.display = "block"; // 🛑 الإظهار أولاً
        topChampionsList.innerHTML = '<p style="text-align: center;">جاري التحميل...</p>';
        familyAnbaMoussaList.innerHTML = "<li>جاري التحميل...</li>";
        familyMargergesList.innerHTML = "<li>جاري التحميل...</li>";
        familyAnbaKarasList.innerHTML = "<li>جاري التحميل...</li>";
        const rankEmojis = { 1: "🥇", 2: "🥈", 3: "🥉" };

        try {
            // 🛑🛑 استخدام Promise.allSettled لضمان أن فشل طلب واحد لا يوقف البقية 🛑🛑
            const results = await Promise.allSettled([
                fetch('/get-top-champions', { method: "POST" }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة الانبا موسي الاسود" }) }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة مارجرس" }) }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة الانبا كاراس" }) }),
            ]);

            const [championsResponse, anbaMoussaResponse, margergesResponse, karasResponse] = results;

            // 1. الأبطال (Top 3)
            if (championsResponse.status === 'fulfilled' && championsResponse.value.ok) {
                const championsData = await championsResponse.value.json();
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
            } else {
                topChampionsList.innerHTML = '<p style="text-align: center; color: orange;">فشل تحميل أبطال الصدارة.</p>';
            }

            // 2. القوائم التفصيلية (Top 10 لكل عائلة)
            const familyResponses = [
                { list: familyAnbaMoussaList, response: anbaMoussaResponse, name: "اسرة الانبا موسي الاسود" },
                { list: familyMargergesList, response: margergesResponse, name: "اسرة مارجرس" },
                { list: familyAnbaKarasList, response: karasResponse, name: "اسرة الانبا كاراس" }
            ];
            
            for (const item of familyResponses) {
                if (item.response.status === 'fulfilled' && item.response.value.ok) {
                    const data = await item.response.value.json();
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
                } else {
                    item.list.innerHTML = `<li style="color: orange;">فشل في تحميل القائمة.</li>`;
                }
            }

        } catch (err) {
            console.error("Leaderboard Major Error:", err);
            topChampionsList.innerHTML = '<p style="text-align: center; color: red;">خطأ كارثي في تحميل لوحة الصدارة.</p>';
        }
    }


    // 🛑🛑 فانكشن جلب الكويز (تمت استعادتها بالكامل) 🛑🛑
    async function loadActiveQuiz(email) {
        quizContainer.style.display = "block"; // 🛑 الإظهار أولاً

        try {
            const response = await fetch(`/get-active-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("لا يوجد سؤال جديد متاح.");
                    quizContainer.innerHTML = '<div class="quiz-options"><p style="color: orange;">لا يوجد سؤال جديد متاح حالياً.</p></div>';
                } else {
                    throw new Error("فشل جلب الكويز");
                }
                return;
            }

            const data = await response.json();
            
            const quiz = data.quiz;
            quizQuestionText.textContent = `${quiz.question_text} (+${quiz.points} نقطة)`;
            quizBtnA.textContent = quiz.option_a;
            quizBtnB.textContent = quiz.option_b;
            quizBtnC.textContent = quiz.option_c;
            currentQuizId = quiz.id; 

            quizMessage.textContent = "";
            selectedOption = null;
            quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
            quizSubmitBtn.disabled = false;

            quizContainer.style.display = "block"; 

        } catch (err) {
            console.error("فشل جلب الكويز:", err);
            // لا نستخدم display = "none" هنا بل نعرض رسالة خطأ داخل الحاوية المرئية
            quizContainer.innerHTML = '<div class="quiz-options"><p style="color: red;">خطأ في تحميل بيانات الكويز.</p></div>';
        }
    }

    // 🛑🛑 فانكشن جلب الإعلانات 🛑🛑
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
                if (loggedInUserProfile && loggedInUserProfile.role === 'admin') {
                    adminAnnouncementText.value = data.message;
                }
            }
        } catch (err) {
            console.error("Load Announcement Error:", err);
        }
    }

    // 🛑🛑 فانكشن جلب وعرض عناصر المتجر (للمستخدم) 🛑🛑
    async function loadStoreItems() {
        if (loggedInUserProfile && loggedInUserProfile.role === 'admin') return; 

        storeContainer.style.display = "block"; // 🛑 الإظهار أولاً
        storeLoadingMessage.style.display = 'block';
        storeItemsList.innerHTML = '';
        storeMessage.textContent = "";

        try {
            // 🛑🛑 تم تعديلها إلى GET 🛑🛑
            const response = await fetch(`/get-store-items`); 
            
            if (!response.ok) throw new Error("فشل جلب عناصر المتجر"); 
            const data = await response.json();
            
            storeLoadingMessage.style.display = 'none';
            storeItemsList.innerHTML = ''; // تفريغ القائمة قبل الملء

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'store-item-card';
                    
                    // 🛑🛑 منطق التحقق الجديد (الرصيد + المستوى) 🛑🛑
                    const userLevel = loggedInUserProfile ? loggedInUserProfile.level : 1;
                    const userBalance = loggedInUserProfile ? loggedInUserProfile.balance : 0;
                    const requiredLevel = item.required_level || 1;

                    const canAfford = userBalance >= item.price;
                    const highEnoughLevel = userLevel >= requiredLevel;
                    const canBuy = canAfford && highEnoughLevel;

                    let buttonText = `شراء (${item.price} نقطة)`;
                    
                    if (!highEnoughLevel) {
                        buttonText = `يتطلب مستوى ${requiredLevel}`;
                        card.classList.add('locked'); // 🛑 إضافة كلاس للقفل
                    } else if (!canAfford) {
                        buttonText = `النقاط غير كافية`;
                    }
                    // 🛑🛑 نهاية منطق التحقق الجديد 🛑🛑
                    
                    const itemName = item.name || item.namel || 'منتج غير معروف'; 

                    // 🛑 إضافة نص المستوى المطلوب
                    const requiredLevelText = (requiredLevel > 1) 
                        ? `<p class="level-req">يتطلب مستوى ${requiredLevel}</p>` 
                        : '<p class="level-req" style="color: #28a745;">متاح للجميع</p>';

                    card.innerHTML = `
                        <img src="${item.image_url || '/default-item.png'}" alt="${itemName}">
                        <h5>${itemName}</h5>
                        ${requiredLevelText} 
                        <p class="price">$${item.price}</p>
                        <button class="buy-item-btn" data-item-id="${item.id}" ${canBuy ? '' : 'disabled'}>
                            ${buttonText}
                        </button>
                    `;
                    storeItemsList.appendChild(card);
                });
                
                // إضافة مُستمعي الأحداث لأزرار الشراء
                document.querySelectorAll('.buy-item-btn').forEach(btn => {
                    btn.addEventListener('click', handleBuyItem);
                });

            } else {
                storeItemsList.innerHTML = `<p style="text-align: center; color: #888;">لا توجد عناصر متاحة حالياً في المتجر.</p>`;
            }
        } catch(err) {
            storeLoadingMessage.style.display = 'none';
            storeItemsList.innerHTML = `<li style="color: red;">خطأ في تحميل المتجر: ${err.message}.</li>`;
            console.error("Store Load Error:", err);
        }
    }

    // 🛑🛑 فانكشن شراء عنصر (إصلاح الخطأ الوهمي) 🛑🛑
    async function handleBuyItem(event) {
        const itemId = event.target.dataset.itemId;
        event.target.disabled = true;
        storeMessage.textContent = "جاري إتمام عملية الشراء...";
        storeMessage.style.color = "blue";

        try {
            const response = await fetch(`/buy-store-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loggedInUserProfile.email,
                    itemId: itemId
                }),
            });

            // 🛑🛑 التعديل لحل مشكلة الخطأ الوهمي 🛑🛑
            const data = await response.json(); 

            if (data.success || response.ok) { 
                // 1. إظهار رسالة النجاح الفورية
                storeMessage.textContent = data.message || "تمت العملية بنجاح! جاري التحديث...";
                storeMessage.style.color = "green";
                
                // 2. تحديث الواجهة بشكل منفصل لتجنب انهيار الرسالة الخضراء
                try {
                    await refreshUserData(); // 🛑 تحديث الرصيد والعناصر والسجل
                } catch (refreshErr) {
                    console.error("Failed to refresh UI after purchase:", refreshErr);
                    storeMessage.textContent += " (لكن حدث خطأ في تحديث الواجهة. يرجى التحديث يدوياً.)";
                    storeMessage.style.color = "orange";
                }
                
            } else {
                storeMessage.textContent = data.error || "فشل عملية الشراء.";
                storeMessage.style.color = "red";
            }
        } catch (err) {
            // سنعرض رسالة الخطأ العامة، لكن بما أن الخصم حدث، هذا غالباً خطأ وهمي في الـ JSON
            storeMessage.textContent = "حدث خطأ أثناء إتمام العملية. (الرجاء التحقق من الرصيد والسجل).";
            storeMessage.style.color = "orange";
            console.error("Buy Item Error:", err);
        } finally {
            // لا نعيد تفعيل الزر هنا، لأن refreshUserData سيعيد تحميل المتجر
        }
    }
    
    // 🛑🛑 دالة معالجة تعديل عنصر المتجر (جديدة) 🛑🛑
    async function handleEditItem(itemId, name, price, imageUrl, requiredLevel) { // 🛑 إضافة المستوى
        if (!loggedInUserProfile || loggedInUserProfile.role !== 'admin') {
            adminStoreMessage.textContent = "غير مصرح لك بالتعديل.";
            adminStoreMessage.style.color = 'red';
            return;
        }

        // 1. ملء النموذج وعرضه
        editItemId.value = itemId;
        editItemName.value = name;
        editItemPrice.value = price;
        editItemRequiredLevel.value = requiredLevel || 1; // 🛑 ملء المستوى
        editItemCurrentUrl.value = imageUrl;
        editCurrentImage.src = imageUrl || DEFAULT_AVATAR_URL;
        editItemNewFile.value = null; // تفريغ حقل الملف
        editUploadStatusMessage.textContent = '';
        
        editModalOverlay.style.display = 'flex'; // إظهار النافذة

        // 2. معالج إغلاق النافذة
        closeEditModal.onclick = () => {
            editModalOverlay.style.display = 'none';
            adminStoreMessage.textContent = ''; // مسح الرسائل بعد الإغلاق
        };

        // 3. معالج إرسال النموذج
        editItemForm.onsubmit = async (event) => {
            event.preventDefault();
            
            const newName = editItemName.value.trim();
            const newPrice = parseInt(editItemPrice.value);
            const newRequiredLevel = parseInt(editItemRequiredLevel.value); // 🛑 جلب المستوى
            const fileToUpload = editItemNewFile.files[0];
            
            // التحقق من صلاحية البيانات الأساسية
            if (!newName || isNaN(newPrice) || newPrice <= 0 || isNaN(newRequiredLevel) || newRequiredLevel < 1) { // 🛑 إضافة التحقق
                editUploadStatusMessage.textContent = "الرجاء إدخال اسم وسعر ومستوى صالحين.";
                editUploadStatusMessage.style.color = 'red';
                return;
            }

            editUploadStatusMessage.textContent = "جاري معالجة التعديلات...";
            editUploadStatusMessage.style.color = 'blue';

            let finalImageUrl = editItemCurrentUrl.value; // القيمة الافتراضية: الرابط القديم

            try {
                if (fileToUpload) {
                    editUploadStatusMessage.textContent = "جاري رفع الصورة وضغطها...";
                    // 🛑 منطق رفع الصورة إلى Cloudinary 🛑
                    const resizedBlob = await resizeImage(fileToUpload, 400, 400, 0.8); 
                    const formData = new FormData();
                    formData.append('file', resizedBlob);
                    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                    
                    const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
                        method: 'POST',
                        body: formData
                    });

                    if (!cloudinaryResponse.ok) throw new Error("فشل رفع الصورة لـ Cloudinary");
                    
                    const cloudinaryData = await cloudinaryResponse.json();
                    finalImageUrl = cloudinaryData.secure_url;
                }
                
                editUploadStatusMessage.textContent = "جاري حفظ التعديلات في قاعدة البيانات...";

                // 4. إرسال التعديلات إلى الدالة الخلفية
                const response = await fetch(`/admin-update-item`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        itemId: itemId,
                        name: newName,
                        price: newPrice,
                        required_level: newRequiredLevel, // 🛑 إرسال المستوى
                        image_url: finalImageUrl,
                        adminEmail: loggedInUserProfile.email 
                    }),
                });
                
                const data = await response.json();

                if (response.ok && data.success) {
                    editUploadStatusMessage.textContent = `تم تحديث المنتج بنجاح!`;
                    editUploadStatusMessage.style.color = "green";
                    
                    // إغلاق النموذج وتحديث القائمة
                    setTimeout(() => {
                        editModalOverlay.style.display = 'none';
                        loadAdminStoreItems(); 
                    }, 1000);
                } else {
                    editUploadStatusMessage.textContent = `فشل التعديل: ${data.error || "خطأ غير محدد"}`;
                    editUploadStatusMessage.style.color = "red";
                }
            } catch (err) {
                editUploadStatusMessage.textContent = `خطأ: فشل أثناء الرفع/الاتصال.`;
                editUploadStatusMessage.style.color = "red";
                console.error("Edit Submit Error:", err);
            }
        };
    }
    
    // 🛑🛑 فانكشن تحميل عناصر المتجر للأدمن (مع زر التعديل الجديد) ---
    async function loadAdminStoreItems() {
        if (!loggedInUserProfile || loggedInUserProfile.role !== 'admin') return;

        adminStoreItemsList.innerHTML = '<li>جاري تحميل العناصر...</li>';
        adminStoreMessage.textContent = "";

        try {
            const response = await fetch(`/admin-get-items`); 
            
            if (!response.ok) throw new Error("فشل جلب عناصر المتجر للأدمن"); 

            const text = await response.text();
            if (!text) throw new Error("استجابة فارغة من الخادم. (DB Binding Error?)");

            const data = JSON.parse(text); 
            adminStoreItemsList.innerHTML = '';

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const itemName = item.name || item.namel || 'غير معروف';
                    const itemLevel = item.required_level || 1; // 🛑 جلب المستوى

                    const li = document.createElement('li');
                    li.className = 'admin-item-card'; // 🛑 تطبيق كلاس الكارت الجديد
                    li.innerHTML = `
                        <div class="admin-item-info">
                            <strong>${itemName}</strong>
                            <small>السعر: $${item.price} | المستوى: ${itemLevel} | ID: ${item.id}</small>
                            <small>صورة: ${item.image_url ? 'مرفوعة' : 'لا يوجد'}</small>
                        </div>
                        <div class="admin-item-actions">
                            <button class="edit-item-btn" 
                                data-item-id="${item.id}" 
                                data-item-name="${itemName}" 
                                data-item-price="${item.price}" 
                                data-item-url="${item.image_url || ''}"
                                data-item-level="${itemLevel}" 
                                style="background-color: #ffc107; color: #333; margin-left: 10px; padding: 10px 15px; border-radius: 6px; font-weight: bold;">
                                تعديل
                            </button>
                            <button class="delete-store-item-btn" data-item-id="${item.id}" style="padding: 10px 15px; border-radius: 6px; font-weight: bold;">حذف</button>
                        </div>
                    `;
                    adminStoreItemsList.appendChild(li);
                });

                document.querySelectorAll('.delete-store-item-btn').forEach(btn => {
                    btn.addEventListener('click', handleDeleteItem);
                });
                
                // 🛑 إضافة مُستمعي الأحداث لأزرار التعديل 🛑
                document.querySelectorAll('.edit-item-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.currentTarget.dataset.itemId;
                        const itemName = e.currentTarget.dataset.itemName;
                        const itemPrice = e.currentTarget.dataset.itemPrice;
                        const imageUrl = e.currentTarget.dataset.itemUrl;
                        const itemLevel = e.currentTarget.dataset.itemLevel; // 🛑 جلب المستوى
                        
                        // 🛑 استدعاء دالة التعديل (لفتح النموذج) 🛑
                        handleEditItem(itemId, itemName, itemPrice, imageUrl, itemLevel); 
                    });
                });
            } else {
                adminStoreItemsList.innerHTML = `<li style="text-align: center;">لا توجد عناصر مضافة حالياً.</li>`;
            }
        } catch(err) {
            adminStoreItemsList.innerHTML = `<li style="color: red; text-align: center;">خطأ في تحميل العناصر: ${err.message}.</li>`;
            console.error("Admin Store Load Error:", err);
        }
    }

    // --- فانكشن حذف عنصر ---
    async function handleDeleteItem(event) {
        const itemId = event.target.dataset.itemId;
        if (!confirm(`هل أنت متأكد من حذف العنصر ذو ID: ${itemId} نهائياً؟`)) return;

        adminStoreMessage.textContent = "جاري حذف العنصر...";
        adminStoreMessage.style.color = "blue";

        try {
            const response = await fetch(`/admin-delete-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId }),
            });

            const data = await response.json();

            if (response.ok) {
                adminStoreMessage.textContent = `تم حذف العنصر بنجاح.`;
                adminStoreMessage.style.color = "green";
                await loadAdminStoreItems(); // تحديث القائمة بعد الحذف
                await refreshUserData(); // لتحديث واجهة المستخدمين إذا كان مفتوحاً
            } else {
                adminStoreMessage.textContent = `فشل الحذف: ${data.error || "خطأ غير محدد"}`;
                deleteMessage.style.color = "red";
            }
        } catch (err) {
            adminStoreMessage.textContent = "خطأ في الاتصال بالـ API لحذف العنصر.";
            adminStoreMessage.style.color = "red";
            console.error("Delete Item Error:", err);
        }
    }


    // 🛑🛑 فورم التسجيل (Signup) 🛑🛑
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        messageDiv.textContent = "جاري إنشاء الحساب...";
        messageDiv.style.color = "blue";

        const name = document.getElementById("name").value;
        const family = document.getElementById("family").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const avatarFile = document.getElementById("signup-avatar-file").files[0];

        if (!name || !family || !email || !password) {
            messageDiv.textContent = "الرجاء ملء جميع الحقول المطلوبة.";
            messageDiv.style.color = "red";
            return;
        }

        let profile_image_url = DEFAULT_AVATAR_URL;

        try {
            if (avatarFile) {
                messageDiv.textContent = "جاري ضغط ورفع الصورة...";
                const resizedBlob = await resizeImage(avatarFile, 150, 150, 0.7); 
                const formData = new FormData();
                formData.append('file', resizedBlob);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                
                const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData
                });

                if (!cloudinaryResponse.ok) throw new Error("فشل رفع الصورة لـ Cloudinary");
                
                const cloudinaryData = await cloudinaryResponse.json();
                    profile_image_url = cloudinaryData.secure_url;
            }

            messageDiv.textContent = "جاري إرسال بيانات التسجيل...";
            
            const dataToFunctions = new FormData();
            dataToFunctions.append('name', name);
            dataToFunctions.append('family', family);
            dataToFunctions.append('email', email);
            dataToFunctions.append('password', password);
            dataToFunctions.append('profile_image_url', profile_image_url);

            const response = await fetch(`/signup`, {
                method: "POST",
                body: dataToFunctions, 
            });

            const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));

            if (response.ok) {
                messageDiv.textContent = "تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.";
                messageDiv.style.color = "green";
                signupForm.reset(); 
                loginForm.scrollIntoView({ behavior: 'smooth' }); 
            } else {
                messageDiv.textContent = `فشل التسجيل: ${data.error || "خطأ غير محدد"}`;
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = `حدث خطأ: ${err.message || "فشل غير متوقع."}`;
            messageDiv.style.color = "red";
            console.error("Signup Error:", err);
        }
    });


    // 🛑🛑 زرار تسجيل الخروج (مُصحح ليشمل الزر الجديد) 🛑🛑
    function handleLogout() {
        resetUI();
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";
    }
    logoutBtn.addEventListener("click", handleLogout);
    guestLogoutBtn.addEventListener("click", handleLogout); // 🛑 ربط الزر الجديد


    // --- كود "تغيير الصورة" ---
    avatarUploadInput.addEventListener("change", async () => { /* ... كود تغيير الصورة كما هو ... */ });

    // 🛑🛑 أكواد الكويز (تمت استعادتها بالكامل) 🛑🛑
    quizOptionButtons.forEach(button => {
        button.addEventListener("click", () => {
            quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedOption = button.dataset.value; 
        });
    });

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
                  email: loggedInUserProfile.email,
                  quizId: currentQuizId,
                  selectedOption: selectedOption
                })
            });

            const data = await response.json();

            if (data.success) {
                quizMessage.textContent = data.message;
                quizMessage.style.color = "green";
                await refreshUserData(); // 🛑 تحديث الرصيد والسجل
            } else {
                quizMessage.textContent = data.message;
                quizMessage.style.color = "red";
            }

            setTimeout(() => {
                quizContainer.style.display = "block"; 
                loadActiveQuiz(loggedInUserProfile.email); // تحميل السؤال التالي
            }, 3000);

        } catch (err) {
            quizMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
            quizMessage.style.color = "red";
            quizSubmitBtn.disabled = false; 
        }
    });

    // 🛑 ربط زرار الريفرش 🛑
    refreshDataBtn.addEventListener('click', refreshUserData);

    // 
    // -----------------------------------------------------
    // 🛑🛑🛑 منطق توليد وعرض QR Code (لليوزر) 🛑🛑🛑
    // -----------------------------------------------------

    if(showQrBtn) {
        showQrBtn.addEventListener('click', () => {
            if (!loggedInUserProfile || !loggedInUserProfile.email) return;

            // 1. تفريغ الحاوية للتوليد الجديد
            qrCodeContainer.innerHTML = '';

            // 2. المحتوى المشفر: نستخدم الإيميل كمعرّف
            const qrData = loggedInUserProfile.email;

            // 3. توليد كود QR
            new QRCode(qrCodeContainer, {
                text: qrData,
                width: 250,
                height: 250,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            
            // 4. عرض الإيميل تحت الكود (للتأكد)
            qrUserEmailDisplay.textContent = loggedInUserProfile.email;

            // 5. إظهار النافذة
            qrModalOverlay.style.display = 'flex';
        });
    }

    // 6. إغلاق النافذة
    if(closeQrBtn) {
        closeQrBtn.addEventListener('click', () => {
            qrModalOverlay.style.display = 'none';
        });
    }

    // -----------------------------------------------------
    // 🛑🛑🛑 منطق واجهة الزائر (جديد) 🛑🛑🛑
    // -----------------------------------------------------
    guestFamilyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const familyName = button.dataset.family;
            guestFamilyMessage.textContent = `جاري تحميل أسرة ${familyName}...`;
            guestFamilyMessage.style.color = 'blue';
            guestFamilyResults.innerHTML = '';

            try {
                // 🛑 نستخدم الفانكشن الخاصة بالأدمن (لأنها تجلب كل المستخدمين)
                const response = await fetch(`/admin-get-family`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ family: familyName }),
                });

                if (!response.ok) throw new Error('فشل تحميل القائمة');
                
                const data = await response.json();
                
                if (data.users && data.users.length > 0) {
                    guestFamilyMessage.textContent = `عرض ${data.users.length} مستخدم في: ${familyName}`;
                    guestFamilyMessage.style.color = 'green';
                    
                    // 🛑 عرض "للقراءة فقط" (بدون Checkbox أو Click)
                    data.users.forEach((user, index) => {
                        const li = document.createElement('li');
                        // نستخدم نفس تنسيق لوحة الصدارة
                        li.innerHTML = `<span>${index + 1}. ${user.name}</span> <strong>${user.balance} نقطة</strong>`;
                        guestFamilyResults.appendChild(li);
                    });
                } else {
                    guestFamilyMessage.textContent = 'لا يوجد مستخدمين لعرضهم في هذه الأسرة.';
                    guestFamilyMessage.style.color = 'black';
                }
            } catch (err) {
                guestFamilyMessage.textContent = `خطأ: ${err.message}`;
                guestFamilyMessage.style.color = 'red';
            }
        });
    });


    // -----------------------------------------------------
    // 🛑🛑🛑 أكواد الأدمن (النسخة الكاملة والمُصححة) 🛑🛑🛑
    // -----------------------------------------------------
    (function setupAdminPanel() {
        let currentSearchedUser = null;

        // 🛑🛑 1. فورم البحث بالاسم (مُصحح للدروب ليست) 🛑🛑
        if(adminSearchForm) {
            adminSearchForm.addEventListener("submit", async (event) => {
                event.preventDefault(); 
                event.stopPropagation();
                const name = document.getElementById("admin-search-name").value.trim();

                adminSearchMessage.textContent = `جاري البحث عن ${name}...`;
                adminSearchMessage.style.color = "blue";
                adminSelectUser.innerHTML = '<option value="">اختر مستخدم...</option>'; // 🛑 الإصلاح: تفريغ الدروب ليست
                adminResultsListDiv.style.display = "none";
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
                        
                        adminResultsListDiv.style.display = "block"; // 🛑 الإصلاح: إظهار الدروب ليست
                        adminSelectUser.value = currentSearchResults[0].email;
                        populateAdminCard(currentSearchResults[0]);
                    }
                } catch (err) {
                    adminSearchMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
                    adminSearchMessage.style.color = "red";
                    console.error("Admin Search Error:", err);
                }
            });
        }

        // --- فانكشن ملء الكارت ---
        function populateAdminCard(user) {
            searchedUserName.textContent = `الاسم: ${user.name}`;
            searchedUserFamily.textContent = `العائلة: ${user.family}`;
            searchedUserEmail.textContent = `الإيميل: ${user.email}`;
            searchedUserBalance.textContent = `الرصيد: $${user.balance}`;
            searchedUserLevel.textContent = `${user.level || 1}`; // 🛑 تحديث المستوى
            searchedUserCard.style.display = "block";
            currentSearchedUser = user; 
            balanceMessage.textContent = "";
            deleteMessage.textContent = "";
            adminLevelMessage.textContent = ""; // 🛑 إضافة
            adminLevelAmount.value = user.level || 1; // 🛑 إضافة

            // 🛑🛑 ربط زرار عرض QR الخاص بالأدمن (جديد) 🛑🛑
            // نستخدم نفس النافذة المنبثقة (Modal) الخاصة باليوزر
            if (adminShowUserQrBtn) {
                adminShowUserQrBtn.onclick = () => {
                    if (!user || !user.email) return;

                    // 1. تفريغ الحاوية للتوليد الجديد
                    qrCodeContainer.innerHTML = '';

                    // 2. المحتوى المشفر: نستخدم إيميل "المستخدم الذي يتم البحث عنه"
                    const qrData = user.email;

                    // 3. توليد كود QR
                    new QRCode(qrCodeContainer, {
                        text: qrData,
                        width: 250,
                        height: 250,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                    
                    // 4. عرض الإيميل تحت الكود
                    qrUserEmailDisplay.textContent = user.email;

                    // 5. إظهار النافذة
                    qrModalOverlay.style.display = 'flex';
                };
            }
            // 🛑🛑 نهاية ربط الزر 🛑🛑
        }

        // --- كود الدروب ليست ---
        if (adminSelectUser) {
            adminSelectUser.addEventListener("change", () => {
                const selectedEmail = document.getElementById("admin-select-user").value;
                const user = currentSearchResults.find(u => u.email === selectedEmail);
                if (user) {
                    populateAdminCard(user);
                    searchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                }
            });
        }

        // --- فانكشن تعديل الرصيد الأساسية (مُحصنة) ---
        async function updateBalance(amount, reason) {
             if (!currentSearchedUser) {
                 balanceMessage.textContent = "الرجاء تحديد مستخدم وإدخال قيمة صحيحة.";
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
        if (addBalanceBtn) {
            addBalanceBtn.addEventListener("click", () => {
                const amount = parseInt(document.getElementById("admin-balance-amount").value);
                if (isNaN(amount) || amount <= 0 || !currentSearchedUser) {
                     balanceMessage.textContent = "الرجاء تحديد مستخدم وإدخال قيمة صحيحة.";
                     balanceMessage.style.color = "red";
                     return;
                }
                updateBalance(amount, "إضافة يدوية من الأدمن");
            });
        }
        if (subtractBalanceBtn) {
            subtractBalanceBtn.addEventListener("click", () => {
                const amount = parseInt(document.getElementById("admin-balance-amount").value); 
                if (isNaN(amount) || amount <= 0 || !currentSearchedUser) {
                    balanceMessage.textContent = "الرجاء تحديد مستخدم وإدخال قيمة صحيحة.";
                    balanceMessage.style.color = "red";
                    return;
                }
                updateBalance(-amount, "خصم يدوي من الأدمن");
            });
        }

        // 🛑🛑 زرار تحديث المستوى (جديد) 🛑🛑
        if (adminUpdateLevelBtn) {
            adminUpdateLevelBtn.addEventListener("click", async () => {
                const newLevel = parseInt(adminLevelAmount.value);
                if (!currentSearchedUser) {
                    adminLevelMessage.textContent = "الرجاء اختيار مستخدم أولاً.";
                    adminLevelMessage.style.color = "red";
                    return;
                }
                if (isNaN(newLevel) || newLevel < 1) {
                    adminLevelMessage.textContent = "الرجاء إدخال مستوى صحيح (1 أو أعلى).";
                    adminLevelMessage.style.color = "red";
                    return;
                }

                adminLevelMessage.textContent = "جاري تحديث المستوى...";
                adminLevelMessage.style.color = "blue";
                adminUpdateLevelBtn.disabled = true;

                try {
                    // نفترض وجود API endpoint جديد
                    const response = await fetch(`/admin-update-level`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            adminEmail: loggedInUserProfile.email,
                            targetEmail: currentSearchedUser.email,
                            newLevel: newLevel
                        }),
                    });

                    const data = await response.json();
                    if (response.ok && data.success) {
                        adminLevelMessage.textContent = `تم تحديث المستوى بنجاح إلى ${data.new_level}.`;
                        adminLevelMessage.style.color = "green";
                        currentSearchedUser.level = data.new_level;
                        searchedUserLevel.textContent = `${data.new_level}`;
                        
                        // إذا كان الأدمن يعدل مستواه، نحدث الكارت الرئيسي
                        if (loggedInUserProfile.email === currentSearchedUser.email) {
                            refreshUserData(); 
                        }
                    } else {
                        adminLevelMessage.textContent = `فشل التحديث: ${data.error || "خطأ غير محدد"}`;
                        adminLevelMessage.style.color = "red";
                    }
                } catch (err) {
                    adminLevelMessage.textContent = "خطأ في الاتصال بالـ API.";
                    adminLevelMessage.style.color = "red";
                } finally {
                    adminUpdateLevelBtn.disabled = false;
                }
            });
        }


        // 🛑🛑 زرار حذف المستخدم (مُحصن) 🛑🛑
        if (deleteUserBtn) {
            deleteUserBtn.addEventListener("click", async () => {
                // 🛑 CRITICAL EXTRACTION AND FINAL CHECK 🛑
                const targetEmail = currentSearchedUser && currentSearchedUser.email;
                const currentAdminEmail = loggedInUserProfile && loggedInUserProfile.email;
                
                if (!targetEmail) {
                    deleteMessage.textContent = "خطأ: لم يتم تحديد إيميل المستخدم المراد حذفه بشكل صحيح.";
                    deleteMessage.style.color = "red";
                    return;
                }
                if (!currentAdminEmail) {
                     deleteMessage.textContent = "خطأ: لم يتم التعرف على إيميل الأدمن الحالي. (يرجى إعادة تسجيل الدخول)";
                     deleteMessage.style.color = "red";
                     return;
                }
                
                if (targetEmail === currentAdminEmail) {
                     deleteMessage.textContent = "لا يمكن حذف حساب الأدمن الحالي.";
                     deleteMessage.style.color = "red";
                     return;
                }

                if (!confirm(`تحذير: أنت على وشك حذف ${currentSearchedUser.name} نهائياً. هل أنت متأكد؟ (سيتم حذف كل سجلاته)`)) {
                    return;
                }

                deleteMessage.textContent = "جاري حذف المستخدم وكافة سجلاته...";
                deleteMessage.style.color = "blue";
                deleteUserBtn.disabled = true;

                try {
                    // 🛑 هذا الطلب سيتصل بدالة admin-delete-user.js في الخلفية
                    const response = await fetch(`/admin-delete-user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        // نرسل الإيميل لحذفه وإيميل الأدمن للتحقق من الصلاحيات
                        body: JSON.stringify({ 
                            emailToDelete: targetEmail,
                            adminEmail: currentAdminEmail 
                        }),
                    });
                    
                    // التأكد من قراءة الرد سواء كان ناجحاً أو فاشلاً
                    const data = await response.json().catch(() => ({ success: false, error: 'رد سيرفر غير صالح' }));

                    if (response.ok && data.success) {
                        deleteMessage.textContent = data.message;
                        deleteMessage.style.color = "green";
                        searchedUserCard.style.display = "none";
                        currentSearchedUser = null;
                        document.getElementById("admin-search-form").reset();
                    } else {
                        deleteMessage.textContent = `فشل الحذف: ${data.error || "خطأ غير معروف"}`;
                        deleteMessage.style.color = "red";
                        // تنبيه: هذا يحدث إذا كان هناك خطأ Foreign Key
                        if (data.error && data.error.includes("FOREIGN KEY")) {
                            deleteMessage.textContent = "فشل الحذف: المستخدم لديه سجلات مرتبطة (معاملات/مشتريات). يجب استخدام دالة الحذف المتسلسل الآمنة في الخلفية.";
                        }
                    }
                } catch (err) {
                    deleteMessage.textContent = "خطأ في الاتصال بالشبكة.";
                    deleteMessage.style.color = "red";
                    console.error("Delete User Error:", err);
                } finally {
                    deleteUserBtn.disabled = false;
                }
            });
        }
        
        // 🛑🛑 2. إصلاح "عرض المستخدمين حسب الأسرة" (تشغيل زراير الأسر) 🛑🛑
        adminFamilyButtons.forEach(button => {
            button.addEventListener("click", async (event) => {
                const familyName = button.dataset.family;
                
                adminFamilyMessage.textContent = `جاري تحميل مستخدمي أسرة ${familyName}...`;
                adminFamilyMessage.style.color = "blue";
                adminFamilyResultsDiv.innerHTML = '';
                massUpdateControls.style.display = 'none';
                selectedUsersForMassUpdate = [];
                selectedUsersCount.textContent = '0';

                try {
                    const response = await fetch(`/admin-get-family`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ family: familyName }),
                    });
                    const data = await response.json().catch(() => ({error: 'رد سيرفر غير صالح'}));
                    if (!response.ok) {
                        adminFamilyMessage.textContent = `فشل تحميل الأسرة: ${data.error || "خطأ غير محدد"}`;
                        adminFamilyMessage.style.color = "red";
                        massUpdateControls.style.display = "none";
                        return;
                    }
                    const users = data.users;

                    if (!users || users.length === 0) {
                        adminFamilyMessage.textContent = `لا يوجد مستخدمين مسجلين في "${familyName}".`;
                        adminFamilyMessage.style.color = "black";
                        massUpdateControls.style.display = "none";
                    } else {
                        adminFamilyMessage.textContent = `تم العثور على ${users.length} مستخدم في "${familyName}":`;
                        massUpdateControls.style.display = "block";
                        users.forEach(user => {
                            const userItem = document.createElement("div");
                            userItem.className = "family-user-item";
                            const checkbox = document.createElement("input");
                            checkbox.type = "checkbox";
                            checkbox.className = "mass-update-checkbox";
                            checkbox.dataset.email = user.email;
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
        if (adminFamilyResultsDiv) {
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
                    if (selectedUsersForMassUpdate.length > 0) {
                        massUpdateControls.style.display = 'block';
                    } else {
                        massUpdateControls.style.display = 'none';
                    }
                    massUpdateMessage.textContent = ''; 
                }
            });
        }


        // 🛑🛑🛑 فانكشن تعديل الرصيد الجماعي (التحديث الجديد: عدم الإخفاء) 🛑🛑🛑
        async function handleMassUpdate(amount) {
            if (selectedUsersForMassUpdate.length === 0) {
                massUpdateMessage.textContent = "الرجاء اختيار مستخدم واحد على الأقل.";
                massUpdateMessage.style.color = "red";
                return;
            }
            if (isNaN(amount) || amount === 0) {
                massUpdateMessage.textContent = "الرجاء إدخال كمية صحيحة.";
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
                
                // 🛑🛑🛑 هذا هو التعديل 🛑🛑🛑
                if (response.ok) {
                    massUpdateMessage.textContent = `تم ${action} الرصيد بنجاح لـ ${data.updated_count} مستخدم.`;
                    massUpdateMessage.style.color = "green";
                    
                    // سنقوم بتفريغ المدخلات
                    selectedUsersForMassUpdate = [];
                    selectedUsersCount.textContent = "0";
                    massUpdateAmount.value = "";
                    
                    // قم بإلغاء تحديد كل الـ checkboxes يدوياً
                    const checkboxes = adminFamilyResultsDiv.querySelectorAll('.mass-update-checkbox');
                    checkboxes.forEach(cb => cb.checked = false);

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
        if (massUpdateAddBtn) {
            massUpdateAddBtn.addEventListener('click', () => {
                const amount = parseInt(document.getElementById("mass-update-amount").value);
                if (!isNaN(amount) && amount > 0) {
                    handleMassUpdate(amount);
                } else {
                    massUpdateMessage.textContent = "الرجاء إدخال قيمة صحيحة وموجبة.";
                    massUpdateMessage.style.color = "red";
                }
            });
        }
        if (massUpdateSubtractBtn) {
            massUpdateSubtractBtn.addEventListener('click', () => {
                const amount = parseInt(document.getElementById("mass-update-amount").value);
                if (!isNaN(amount) && amount > 0) {
                    handleMassUpdate(-amount); // إرسال قيمة سالبة للخصم
                } else {
                    massUpdateMessage.textContent = "الرجاء إدخال قيمة صحيحة وموجبة.";
                    massUpdateMessage.style.color = "red";
                }
            });
        }

        // -----------------------------------------------------
        // 🛑🛑🛑 منطق مسح QR Code (للأدمن) - تم نقله إلى هنا 🛑🛑🛑
        // -----------------------------------------------------

        // 🛑🛑 دالة معالجة المسح 🛑🛑
        async function onScanSuccess(decodedText, decodedResult) {
            scanStatusMessage.textContent = `تم مسح كود: ${decodedText}. جاري معالجة المكافأة...`;
            scanStatusMessage.style.color = 'blue';

            // 1. إيقاف الكاميرا فوراً بعد المسح الأول
            if (html5QrCode) {
                try {
                    await html5QrCode.stop();
                    startScanBtn.textContent = 'تشغيل الكاميرا والمسح';
                    readerDiv.innerHTML = ''; // تفريغ الكاميرا
                } catch(err) {
                     console.error("Failed to stop scanner:", err)
                }
            }

            // 2. تحليل بيانات المكافأة
            const [amountStr, reason] = rewardReasonSelect.value.split(':');
            const rewardAmount = parseInt(amountStr);
            const scannedEmail = decodedText.trim();
            const adminEmail = loggedInUserProfile ? loggedInUserProfile.email : '';

            if (!scannedEmail || isNaN(rewardAmount) || rewardAmount <= 0) {
                 scanStatusMessage.textContent = 'خطأ: بيانات الكود أو المكافأة غير صالحة.';
                 scanStatusMessage.style.color = 'red';
                 return;
            }

            // 3. إرسال إلى API المكافأة
            try {
                const response = await fetch(`/scan-attendance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        scannedEmail, 
                        rewardAmount, 
                        reason: reason,
                        adminEmail 
                    })
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    scanStatusMessage.textContent = `✅ نجاح! تم إضافة ${rewardAmount} نقطة لـ ${scannedEmail}.`;
                    scanStatusMessage.style.color = 'green';
                    // تحديث بيانات الأدمن إذا كان المستخدم الذي تم مكافأته هو الأدمن نفسه
                    if (scannedEmail === adminEmail) {
                        refreshUserData();
                    }
                    // تحديث الكارت إذا كان المستخدم الممسوح هو المعروض حالياً
                    if (currentSearchedUser && scannedEmail === currentSearchedUser.email) {
                        currentSearchedUser.balance = data.new_balance;
                        searchedUserBalance.textContent = `الرصيد: $${data.new_balance}`;
                    }
                    
                } else {
                    scanStatusMessage.textContent = `❌ فشل: ${data.error || 'فشل في تحديث الرصيد.'}`;
                    scanStatusMessage.style.color = 'red';
                }

            } catch (err) {
                 scanStatusMessage.textContent = 'خطأ في الاتصال بالسيرفر أثناء معالجة المكافأة.';
                 scanStatusMessage.style.color = 'red';
                 console.error("Scan API Error:", err);
            }
        }
        
        // 🛑🛑 زر تشغيل الماسح 🛑🛑
        if (startScanBtn) {
            startScanBtn.addEventListener('click', () => {
                if (html5QrCode && html5QrCode.isScanning) {
                    // إيقاف الماسح
                    html5QrCode.stop().then(() => {
                        startScanBtn.textContent = 'تشغيل الكاميرا والمسح';
                        readerDiv.innerHTML = '';
                        scanStatusMessage.textContent = 'تم إيقاف الماسح.';
                        scanStatusMessage.style.color = 'gray';
                    }).catch(err => {
                        scanStatusMessage.textContent = 'حدث خطأ أثناء إيقاف الماسح.';
                        scanStatusMessage.style.color = 'red';
                    });
                    return;
                }

                // تهيئة وتفعيل الماسح
                if (!html5QrCode) {
                     html5QrCode = new Html5Qrcode("reader");
                }
                
                scanStatusMessage.textContent = 'جاري تفعيل الكاميرا... قد تظهر رسالة طلب إذن.';
                scanStatusMessage.style.color = 'blue';

                html5QrCode.start(
                    { facingMode: "environment" }, // استخدام الكاميرا الخلفية (الأفضل للمسح)
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    onScanSuccess,
                    (errorMessage) => {
                        // console.log(`QR Code no longer in sight. ${errorMessage}`);
                    }
                )
                .then(() => {
                    startScanBtn.textContent = 'إيقاف الماسح';
                    scanStatusMessage.textContent = 'الكاميرا جاهزة! امسح كود QR الآن.';
                    scanStatusMessage.style.color = 'green';
                })
                .catch((err) => {
                    scanStatusMessage.textContent = `❌ فشل تفعيل الكاميرا: ${err}. تأكد من صلاحية الكاميرا.`;
                    scanStatusMessage.style.color = 'red';
                });
            });
        }

        // 🛑🛑 4. كود جلب قائمة الـ QR للطباعة (جديد) 🛑🛑
        if(fetchQrListBtn) {
            fetchQrListBtn.addEventListener('click', async () => {
                if (!loggedInUserProfile || loggedInUserProfile.role !== 'admin') {
                    qrListMessage.textContent = "خطأ: غير مصرح لك.";
                    qrListMessage.style.color = "red";
                    return;
                }

                qrListMessage.textContent = "جاري جلب قائمة المستخدمين...";
                qrListMessage.style.color = "blue";
                qrListResults.value = ""; // تفريغ المربع
                fetchQrListBtn.disabled = true;

                try {
                    const response = await fetch(`/admin-get-qr-list`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            adminEmail: loggedInUserProfile.email 
                        })
                    });

                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        qrListMessage.textContent = `✅ نجاح! تم جلب ${data.users.length} مستخدم. يمكنك الآن نسخ النص.`;
                        qrListMessage.style.color = 'green';
                        // عرض الـ JSON في مربع النص بشكل منسق
                        qrListResults.value = JSON.stringify(data.users, null, 2); 
                    } else {
                        qrListMessage.textContent = `❌ فشل: ${data.error || 'فشل في جلب القائمة.'}`;
                        qrListMessage.style.color = 'red';
                    }

                } catch (err) {
                     qrListMessage.textContent = 'خطأ في الاتصال بالسيرفر.';
                     qrListMessage.style.color = 'red';
                     console.error("Fetch QR List Error:", err);
                } finally {
                    fetchQrListBtn.disabled = false;
                }
            });
        }


        // 🛑🛑 3. إصلاح "إضافة سؤال جديد (Quiz)" 🛑🛑
        if (adminQuizForm) {
            adminQuizForm.addEventListener("submit", async (event) => {
                event.preventDefault(); 
                event.stopPropagation();
                
                // 🛑 التأكد من أن IDs الحقول صحيحة ومطابقة لـ index.html
                const question = document.getElementById("quiz-question").value.trim();
                const optionA = document.getElementById("quiz-opt-a").value.trim();
                const optionB = document.getElementById("quiz-opt-b").value.trim();
                const optionC = document.getElementById("quiz-opt-c").value.trim();
                const answer = document.getElementById("quiz-correct-opt").value.trim(); // ID الصحيح
                const pointsInput = document.getElementById("quiz-points").value;
                const points = parseInt(pointsInput);

                // منطق التحقق
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
                        body: JSON.stringify({ 
                            question: question, 
                            opt_a: optionA, // 🛑 إرسال الاسم الصحيح للـ API
                            opt_b: optionB, 
                            opt_c: optionC, 
                            correct_opt: answer, // 🛑 إرسال الاسم الصحيح للـ API
                            points: points 
                        }),
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
        }

        // 🛑 كود فورم الإعلانات (مُصحح) 🛑
        if (adminAnnouncementForm) {
            adminAnnouncementForm.addEventListener("submit", async (event) => {
                event.preventDefault(); 
                event.stopPropagation();
                
                const announcementTextValue = document.getElementById("admin-announcement-text").value.trim();

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
                        document.getElementById("admin-announcement-text").value = ""; // تفريغ الحقل
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
        }
        
        // --- فورم إضافة عنصر جديد (المعدل لرفع الملفات) ---
        if (adminAddItemForm) {
            adminAddItemForm.addEventListener("submit", async (event) => {
                event.preventDefault(); 
                const name = document.getElementById("store-item-name").value.trim();
                const price = parseInt(document.getElementById("store-item-price").value);
                const requiredLevel = parseInt(document.getElementById("store-item-required-level").value) || 1; // 🛑 جلب المستوى
                const imageFile = storeItemImageFile.files[0]; // 🛑 جلب الملف

                // 🛑🛑 التعديل لجعل الصورة اختيارية 🛑🛑
                if (!name || isNaN(price) || price <= 0 || isNaN(requiredLevel) || requiredLevel < 1) { // 🛑 إضافة التحقق
                    adminStoreMessage.textContent = "الرجاء ملء الاسم والسعر والمستوى المطلوب بشكل صحيح.";
                    adminStoreMessage.style.color = "red";
                    return;
                }

                adminStoreMessage.textContent = "جاري التحقق والإضافة...";
                adminStoreMessage.style.color = "blue";
                
                let final_image_url = ''; 

                try {
                    if (imageFile) { // 🛑 فقط إذا اختار المستخدم ملفاً، نقوم بالرفع
                        adminStoreMessage.textContent = "جاري رفع الصورة وضغطها...";
                        // 🛑 منطق رفع الصورة إلى Cloudinary مع الضغط 🛑
                        const resizedBlob = await resizeImage(imageFile, 400, 400, 0.8); // ضغط الصورة
                        const formData = new FormData();
                        formData.append('file', resizedBlob);
                        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                        
                        const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
                            method: 'POST',
                            body: formData
                        });

                        if (!cloudinaryResponse.ok) throw new Error("فشل رفع الصورة لـ Cloudinary");
                        
                        const cloudinaryData = await cloudinaryResponse.json();
                        final_image_url = cloudinaryData.secure_url;
                    }
                    
                    adminStoreMessage.textContent = "جاري إرسال بيانات المنتج...";
                    
                    // 🛑 إرسال الرابط (الذي قد يكون فارغاً) إلى الـ Function 🛑
                    const response = await fetch(`/admin-add-item`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            name, 
                            price, 
                            image_url: final_image_url,
                            required_level: requiredLevel, // 🛑 إرسال المستوى
                            email: loggedInUserProfile.email // 🛑 إرسال إيميل الأدمن للتحقق
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        adminStoreMessage.textContent = `تم إضافة المنتج: ${name} بنجاح!`;
                        adminStoreMessage.style.color = "green";
                        adminAddItemForm.reset(); 
                        await loadAdminStoreItems(); // تحديث القائمة بعد الإضافة
                    } else {
                        adminStoreMessage.textContent = `فشل الإضافة: ${data.error || "خطأ غير محدد"}`;
                        adminStoreMessage.style.color = "red";
                    }
                } catch (err) {
                    adminStoreMessage.textContent = `خطأ: ${err.message || "فشل غير متوقع أثناء رفع الصورة أو الإضافة."}`;
                    adminStoreMessage.style.color = "red";
                    console.error("Add Item Error:", err);
                }
            });
        }
        
        // 🛑 استدعاء وظائف الأدمن عند اللوجن 🛑
        // (تم إضافة loadAdminStoreItems في دالة loginForm.addEventListener و refreshUserData)

    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
