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


    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
    const resetUI = () => {
        cardContainer.style.display = "none";
        formContainer.style.display = "flex";
        logoutBtn.style.display = "none";
        refreshDataBtn.style.display = "none";
        unlockedItemsBtn.style.display = "none"; 
        // 🛑 إخفاء زرار الـ QR
        showQrBtn.style.display = "none";
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
        editModalOverlay.style.display = "none"; 
        qrModalOverlay.style.display = "none"; // 🛑 إخفاء مودال الـ QR
        // 🛑 إيقاف الماسح إذا كان يعمل عند تسجيل الخروج
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(err => console.error("Error stopping scanner:", err));
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
    async function loadUserUnlockedItems() { /* ... */ }


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
                showQrBtn.style.display = "block"; // 🛑 إظهار زرار الـ QR
                
                // 🛑🛑 نستخدم loadMainDashboard لتهيئة الواجهة بعد التحديث 🛑🛑
                await loadMainDashboard();
                await loadAnnouncement(); // 🛑🛑 تم الإصلاح: تحميل الإعلان للمستخدم
            } else {
                unlockedItemsBtn.style.display = "none";
                showQrBtn.style.display = "none"; // 🛑 إخفاء زرار الـ QR للأدمن
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

                userNameP.textContent = `الاسم: ${user.name}`;
                userFamilyP.textContent = `العائلة: ${user.family}`;
                userBalanceP.textContent = `الرصيد: $${user.balance}`;
                userLevelP.textContent = `المستوى: ${user.level || 1}`; // 🛑 تحديث المستوى
                userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
                
                cardContainer.style.display = "flex";
                formContainer.style.display = "none";
                logoutBtn.style.display = "block";
                refreshDataBtn.style.display = "block";
                avatarOverlayLabel.style.display = "flex";

                await loadTransactionHistory(user.email);

                if (user.role === 'admin') {
                    messageDiv.textContent = "مرحباً أيها الأدمن! تم تسجيل الدخول بنجاح.";
                    adminPanelDiv.style.display = "block";
                    unlockedItemsBtn.style.display = "none";
                    showQrBtn.style.display = "none";
                    hideUserSections();
                    await loadAnnouncement();
                    await loadAdminStoreItems(); 
                } else {
                    unlockedItemsBtn.style.display = "block"; // 🛑 إظهار زر المشتريات
                    showQrBtn.style.display = "block"; // 🛑 إظهار زرار الـ QR
                    await loadMainDashboard(); // 🛑 تحميل لوحة التحكم الرئيسية الكاملة بعد تسجيل الدخول
                    await loadAnnouncement(); // 🛑🛑 تم الإصلاح: تحميل الإعلان للمستخدم
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

    // 🛑🛑 معالجة ضغط زر مشترياتي 🛑🛑
    unlockedItemsBtn.addEventListener('click', loadUserUnlockedItems);
    // 🛑🛑 معالجة ضغط زر العودة للمتجر 🛑🛑
    backToStoreBtn.addEventListener('click', loadMainDashboard);
    // --- فانكشن سجل المعاملات (مُحصنة) ---
    async function loadTransactionHistory(email) { /* ... */ }


    // 🛑🛑 فانكشن لوحة الصدارة (مُصححة نهائياً) 🛑🛑
    async function loadLeaderboards() { /* ... */ }


    // 🛑🛑 فانكشن جلب الكويز (تمت استعادتها بالكامل) 🛑🛑
    async function loadActiveQuiz(email) { /* ... */ }

    // 🛑🛑 فانكشن جلب الإعلانات 🛑🛑
    async function loadAnnouncement() { /* ... */ }

    // 🛑🛑 فانكشن جلب وعرض عناصر المتجر (للمستخدم) 🛑🛑
    async function loadStoreItems() { /* ... */ }

    // 🛑🛑 فانكشن شراء عنصر (إصلاح الخطأ الوهمي) 🛑🛑
    async function handleBuyItem(event) { /* ... */ }
    
    // 🛑🛑 دالة معالجة تعديل عنصر المتجر (جديدة) 🛑🛑
    async function handleEditItem(itemId, name, price, imageUrl, requiredLevel) { /* ... */ }
    
    // 🛑🛑 فانكشن تحميل عناصر المتجر للأدمن (مع زر التعديل الجديد) ---
    async function loadAdminStoreItems() { /* ... */ }

    // --- فانكشن حذف عنصر ---
    async function handleDeleteItem(event) { /* ... */ }


    // 🛑🛑 فورم التسجيل (Signup) 🛑🛑
    signupForm.addEventListener("submit", async (event) => { /* ... */ });


    // 🛑🛑 زرار تسجيل الخروج (مُصحح) 🛑🛑
    logoutBtn.addEventListener("click", () => {
        resetUI();
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";
    });


    // --- كود "تغيير الصورة" (زي ما هي) ---
    avatarUploadInput.addEventListener("change", async () => { /* ... */ });

    // --- أكواد الكويز (كما هي) ---
    // (... الكود كما هو ...)

    // 🛑 ربط زرار الريفرش 🛑
    refreshDataBtn.addEventListener('click', refreshUserData);

    // -----------------------------------------------------
    // 🛑🛑🛑 منطق توليد وعرض QR Code (لليوزر) 🛑🛑🛑
    // -----------------------------------------------------

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

    // 6. إغلاق النافذة
    closeQrBtn.addEventListener('click', () => {
        qrModalOverlay.style.display = 'none';
    });


    // -----------------------------------------------------
    // 🛑🛑🛑 منطق مسح QR Code (للأدمن) 🛑🛑🛑
    // -----------------------------------------------------

    // 🛑🛑 دالة معالجة المسح 🛑🛑
    async function onScanSuccess(decodedText, decodedResult) {
        scanStatusMessage.textContent = `تم مسح كود: ${decodedText}. جاري معالجة المكافأة...`;
        scanStatusMessage.style.color = 'blue';

        // 1. إيقاف الكاميرا فوراً بعد المسح الأول
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                startScanBtn.textContent = 'تشغيل الكاميرا والمسح';
                readerDiv.innerHTML = ''; // تفريغ الكاميرا
            }).catch(err => console.error("Failed to stop scanner:", err));
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
    startScanBtn.addEventListener('click', () => {
        // ... (منطق تشغيل وإيقاف الكاميرا)
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
        html5QrCode = new Html5Qrcode("reader");
        
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


    // 
    // --- أكواد الأدمن (النسخة المستقرة) ---
    // 
    (function setupAdminPanel() { /* ... */ })(); 

}); // نهاية "DOMContentLoaded"
