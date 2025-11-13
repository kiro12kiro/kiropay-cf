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

    // --- عناصر المتجر (جديدة) ---
    const storeContainer = document.getElementById("store-container");
    const storeItemsList = document.getElementById("store-items-list");
    const storeMessage = document.getElementById("store-message");
    const storeLoadingMessage = document.getElementById("store-loading-message");
    // --- عناصر إدارة المتجر (جديدة) ---
    const adminAddItemForm = document.getElementById("admin-add-item-form");
    const adminStoreItemsList = document.getElementById("admin-store-items-list");
    const adminStoreMessage = document.getElementById("admin-store-message");
    const storeItemImageFile = document.getElementById("store-item-image-file"); // 🛑 العنصر الجديد لرفع الصورة

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
        storeContainer.style.display = "none"; // 🛑 إضافة إخفاء المتجر
        avatarOverlayLabel.style.display = "none";
        massUpdateControls.style.display = "none";
        userAnnouncementBox.style.display = "none";
        loggedInUserProfile = null; 
        transactionList.innerHTML = "";
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
            userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
            
            await loadTransactionHistory(user.email);
            if (user.role !== 'admin') {
                await loadLeaderboards();
                await loadActiveQuiz(user.email); 
                await loadAnnouncement();
                await loadStoreItems(); // 🛑 إضافة المتجر هنا
            } else {
                await loadAnnouncement();
                await loadAdminStoreItems(); // 🛑 إضافة تحميل عناصر الأدمن هنا
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
        
        adminPanelDiv.style.display = "none";
        transactionList.innerHTML = "";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        storeContainer.style.display = "none"; // 🛑 إضافة إخفاء المتجر
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
                    leaderboardContainer.style.display = "none";
                    userAnnouncementBox.style.display = "none";
                    storeContainer.style.display = "none"; // 🛑 إضافة إخفاء المتجر
                    await loadAnnouncement();
                    await loadAdminStoreItems(); // 🛑 إضافة تحميل عناصر الأدمن
                } else {
                    await loadLeaderboards();
                    await loadActiveQuiz(user.email); 
                    await loadAnnouncement();
                    await loadStoreItems(); // 🛑 إضافة تحميل المتجر للمستخدم
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


    // 🛑🛑 فانكشن لوحة الصدارة (مُصححة نهائياً) 🛑🛑
    async function loadLeaderboards() {
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


    // 🛑🛑 فانكشن جلب الكويز (تمت استعادتها بالكامل) 🛑🛑
    async function loadActiveQuiz(email) {
        try {
            const response = await fetch(`/get-active-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("لا يوجد سؤال جديد متاح.");
                    quizContainer.style.display = "none";
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
            quizContainer.style.display = "none";
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
        if (!loggedInUserProfile || loggedInUserProfile.role === 'admin') return; 

        storeLoadingMessage.style.display = 'block';
        storeItemsList.innerHTML = '';
        storeContainer.style.display = "block";
        storeMessage.textContent = "";

        try {
            const response = await fetch(`/get-store-items`, { method: "POST" });
            if (!response.ok) throw new Error("فشل جلب عناصر المتجر"); 
            const data = await response.json();
            
            storeLoadingMessage.style.display = 'none';
            storeItemsList.innerHTML = ''; // تفريغ القائمة قبل الملء

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'store-item-card';
                    
                    const canAfford = loggedInUserProfile.balance >= item.price;
                    const buttonText = canAfford ? `شراء (${item.price} نقطة)` : `النقاط غير كافية`;
                    
                    // نستخدم item.name للعرض، مع افتراض أن الـ function (get-store-items) ترسل اسم العمود الصحيح
                    const itemName = item.name || item.namel || 'منتج غير معروف'; 

                    card.innerHTML = `
                        <img src="${item.image_url || '/default-item.png'}" alt="${itemName}">
                        <h5>${itemName}</h5>
                        <p class="price">$${item.price}</p>
                        <button class="buy-item-btn" data-item-id="${item.id}" ${canAfford ? '' : 'disabled'}>
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
            storeItemsList.innerHTML = `<p style="text-align: center; color: red;">خطأ في تحميل المتجر.</p>`;
            console.error("Store Load Error:", err);
        }
    }

    // 🛑🛑 فانكشن شراء عنصر 🛑🛑
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

            const data = await response.json();

            if (data.success) {
                storeMessage.textContent = data.message;
                storeMessage.style.color = "green";
                await refreshUserData(); // 🛑 تحديث الرصيد والعناصر
            } else {
                storeMessage.textContent = data.error || "فشل عملية الشراء.";
                storeMessage.style.color = "red";
            }
        } catch (err) {
            storeMessage.textContent = "حدث خطأ في الاتصال بالشبكة.";
            storeMessage.style.color = "red";
            console.error("Buy Item Error:", err);
        } finally {
            // يتم التحديث عبر refreshUserData()
        }
    }
    
    // 🛑🛑 فانكشن تحميل عناصر المتجر للأدمن (مع تحسين معالجة الأخطاء) ---
    async function loadAdminStoreItems() {
        if (!loggedInUserProfile || loggedInUserProfile.role !== 'admin') return;

        adminStoreItemsList.innerHTML = '<li>جاري تحميل العناصر...</li>';
        adminStoreMessage.textContent = "";

        try {
            const response = await fetch(`/admin-get-items`); 
            
            if (!response.ok) throw new Error("فشل جلب عناصر المتجر للأدمن"); 

            // 🛑🛑 التعديل لمرونة استلام الـ JSON 🛑🛑
            const text = await response.text();
            if (!text) throw new Error("استجابة فارغة من الخادم. (DB Binding Error?)");

            const data = JSON.parse(text); // تحويل النص إلى JSON

            // نهاية التعديل 

            adminStoreItemsList.innerHTML = '';

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const itemName = item.name || item.namel || 'غير معروف';

                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${itemName} (${item.price} نقطة) - ID: ${item.id}</span>
                        <button class="delete-store-item-btn" data-item-id="${item.id}">حذف</button>
                    `;
                    adminStoreItemsList.appendChild(li);
                });

                document.querySelectorAll('.delete-store-item-btn').forEach(btn => {
                    btn.addEventListener('click', handleDeleteItem);
                });
            } else {
                adminStoreItemsList.innerHTML = `<li>لا توجد عناصر مضافة حالياً.</li>`;
            }
        } catch(err) {
            adminStoreItemsList.innerHTML = `<li style="color: red;">خطأ في تحميل العناصر: ${err.message}.</li>`;
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
                adminStoreMessage.style.color = "red";
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
        const avatarFile = signupAvatarFile.files[0];

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


    // 🛑🛑 زرار تسجيل الخروج (مُصحح) 🛑🛑
    logoutBtn.addEventListener("click", () => {
        resetUI();
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";
    });


    // --- كود "تغيير الصورة" (زي ما هي) ---
    avatarUploadInput.addEventListener("change", async () => { /* ... */ });

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
                quizContainer.style.display = "none";
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
    // --- أكواد الأدمن (النسخة المستقرة) ---
    // 
    (function setupAdminPanel() {
        let currentSearchedUser = null;

        // 🛑🛑 1. فورم البحث بالاسم (مُصحح للدروب ليست) 🛑🛑
        adminSearchForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            const name = adminSearchInput.value.trim();

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
        deleteUserBtn.addEventListener("click", async () => { /* ... */ });
        
        // 🛑🛑 2. إصلاح "عرض المستخدمين حسب الأسرة" (تشغيل زراير الأسر) 🛑🛑
        familyButtons.forEach(button => {
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
                        adminFamilyMessage.style.color = "green";
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
                if (selectedUsersForMassUpdate.length > 0) {
                    massUpdateControls.style.display = 'block';
                } else {
                    massUpdateControls.style.display = 'none';
                }
                massUpdateMessage.textContent = ''; 
            }
        });


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

        // 🛑🛑 3. إصلاح "إضافة سؤال جديد (Quiz)" 🛑🛑
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
        
        // --- فورم إضافة عنصر جديد (المعدل لرفع الملفات) ---
        adminAddItemForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            const name = document.getElementById("store-item-name").value.trim();
            const price = parseInt(document.getElementById("store-item-price").value);
            const imageFile = storeItemImageFile.files[0]; // 🛑 جلب الملف

            if (!name || isNaN(price) || price <= 0 || !imageFile) {
                adminStoreMessage.textContent = "الرجاء ملء جميع الحقول وإرفاق صورة.";
                adminStoreMessage.style.color = "red";
                return;
            }

            adminStoreMessage.textContent = "جاري رفع الصورة وضغطها...";
            adminStoreMessage.style.color = "blue";
            
            let final_image_url = ''; // ستكون رابط المنتج

            try {
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
                
                adminStoreMessage.textContent = "جاري إرسال بيانات المنتج...";
                
                // 🛑 إرسال الرابط الناتج إلى الـ Function 🛑
                const response = await fetch(`/admin-add-item`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, price, image_url: final_image_url }),
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
        
        // 🛑 استدعاء وظائف الأدمن عند اللوجن 🛑
        // (تم إضافة loadAdminStoreItems في دالة loginForm.addEventListener و refreshUserData)

    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
