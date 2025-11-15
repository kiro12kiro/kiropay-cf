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
    const guestContainer = document.getElementById("guest-container");
    const guestFamilyButtons = document.querySelectorAll(".guest-family-btn");
    const guestResultsList = document.getElementById("guest-results-list");
    const guestMessage = document.getElementById("guest-message");
    const logoutBtnGuest = document.getElementById("logout-btn-guest"); // زر اللوج أوت الخاص بالزائر

    // ... (باقي العناصر كما هي) ...
    const adminShowUserQrBtn = document.getElementById("admin-show-user-qr-btn");


    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
    const resetUI = () => {
        cardContainer.style.display = "none";
        formContainer.style.display = "flex";
        logoutBtn.style.display = "none";
        logoutBtnGuest.style.display = "none"; // 🛑 إخفاء زر خروج الزائر
        guestContainer.style.display = "none"; // 🛑 إخفاء واجهة الزائر
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
        if (qrModalOverlay) qrModalOverlay.style.display = "none"; 
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

    // ... (كل الدوال المساعدة (resizeImage, hideUserSections, loadMainDashboard, إلخ) كما هي) ...
    // ... (كل دوال المستخدم (loadUnlockedItems, refreshUserData) كما هي) ...


    // --- فورم اللوجن ---
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        messageDiv.textContent = "جاري تسجيل الدخول...";
        messageDiv.style.color = "blue";
        
        // ... (إخفاء الأقسام كما هو) ...

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
                    guestContainer.style.display = "block"; // 🛑 إظهار واجهة الزائر
                    logoutBtnGuest.style.display = "block"; // 🛑 إظهار زر خروج الزائر
                    
                    // 🛑 إخفاء كل شيء آخر
                    cardContainer.style.display = "none";
                    formContainer.style.display = "none";
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

    // ... (كل الدوال السابقة (شراء عنصر، تعديل عنصر، إلخ) كما هي) ...

    // 🛑🛑 زرار تسجيل الخروج (مُصحح ليشمل الزر الجديد) 🛑🛑
    function handleLogout() {
        resetUI();
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";
    }
    logoutBtn.addEventListener("click", handleLogout);
    logoutBtnGuest.addEventListener("click", handleLogout); // 🛑 ربط الزر الجديد


    // ... (أكواد الكويز، والـ QR الخاص باليوزر، كما هي) ...


    // -----------------------------------------------------
    // 🛑🛑🛑 منطق واجهة الزائر (جديد) 🛑🛑🛑
    // -----------------------------------------------------
    guestFamilyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const familyName = button.dataset.family;
            guestMessage.textContent = `جاري تحميل أسرة ${familyName}...`;
            guestMessage.style.color = 'blue';
            guestResultsList.innerHTML = '';

            try {
                // 🛑 نعيد استخدام الفانكشن العامة الخاصة بلوحة الصدارة
                const response = await fetch('/get-family-top-10', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ family: familyName })
                });

                if (!response.ok) throw new Error('فشل تحميل القائمة');
                
                const data = await response.json();
                
                if (data.users && data.users.length > 0) {
                    guestMessage.textContent = `أعلى 10 في: ${familyName}`;
                    guestMessage.style.color = 'green';
                    data.users.forEach((user, index) => {
                        const li = document.createElement('li');
                        // نستخدم نفس تنسيق لوحة الصدارة
                        li.innerHTML = `<span>${index + 1}. ${user.name}</span> <strong>${user.balance} نقطة</strong>`;
                        guestResultsList.appendChild(li);
                    });
                } else {
                    guestMessage.textContent = 'لا يوجد مستخدمين لعرضهم في هذه الأسرة.';
                    guestMessage.style.color = 'black';
                }
            } catch (err) {
                guestMessage.textContent = `خطأ: ${err.message}`;
                guestMessage.style.color = 'red';
            }
        });
    });


    // -----------------------------------------------------
    // 🛑🛑🛑 أكواد الأدمن (النسخة الكاملة والمُصححة) 🛑🛑🛑
    // -----------------------------------------------------
    (function setupAdminPanel() {
        // ... (كل أكواد الأدمن السابقة كما هي، من أول "let currentSearchedUser = null;") ...
        // ... (إلى نهاية "})(); // 🛑 نهاية أكواد الأدمن 🛑") ...
    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
