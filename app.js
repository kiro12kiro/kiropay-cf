document.addEventListener("DOMContentLoaded", () => {
    // --- العناصر الأساسية ---
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const messageDiv = document.getElementById("message");
    const formContainer = document.querySelector(".form-container");
    const cardContainer = document.querySelector(".card-container");
    const logoutBtn = document.getElementById("logout-btn");
    const refreshDataBtn = document.getElementById("refresh-data-btn");
    const userNameP = document.getElementById("user-name");
    const userFamilyP = document.getElementById("user-family");
    const userBalanceP = document.getElementById("user-balance");
    const userAvatarImg = document.getElementById("user-avatar");
    const transactionList = document.getElementById("transaction-list");
    const avatarUploadInput = document.getElementById("avatar-upload-input");
    const avatarOverlayLabel = document.getElementById("avatar-overlay-label");
    const signupAvatarFile = document.getElementById("signup-avatar-file");
    let loggedInUserProfile = null;

    // --- عناصر المتجر (User Store) ---
    const userStoreContainer = document.getElementById("user-store-container");
    const userBuyModal = document.getElementById("user-buy-modal");
    const userModalCloseBtn = document.getElementById("user-modal-close-btn");
    const userModalItemName = document.getElementById("user-modal-item-name");
    const userModalItemPrice = document.getElementById("user-modal-item-price");
    const userModalBalance = document.getElementById("user-modal-balance");
    const userModalBuyBtn = document.getElementById("user-modal-buy-btn");
    const userModalMessage = document.getElementById("user-modal-message");
    let currentStoreItem = null; // لتخزين العقار الذي يتم شراؤه حالياً

    const DEFAULT_AVATAR_URL = "/default-avatar.png";
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/Dhbanzq4n/image/upload`;
    const CLOUDINARY_UPLOAD_PRESET = "kiropay_upload";

    // --- عناصر لوحة الأدمن ---
    const adminPanelDiv = document.getElementById("admin-panel");
    const leaderboardContainer = document.getElementById("leaderboard-container");
    const quizContainer = document.getElementById("quiz-container");
    // ... (باقي متغيرات الأدمن والكويز كما هي في الكود الأصلي لتوفير المساحة) ...
    
    const resetUI = () => {
        cardContainer.style.display = "none";
        formContainer.style.display = "flex";
        logoutBtn.style.display = "none";
        refreshDataBtn.style.display = "none";
        adminPanelDiv.style.display = "none";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        userStoreContainer.style.display = "none"; // إخفاء المتجر عند الخروج
        avatarOverlayLabel.style.display = "none";
        loggedInUserProfile = null; 
        transactionList.innerHTML = "";
    };
    resetUI();

    function resizeImage(file, maxWidth, maxHeight, quality) { /* ... كود ضغط الصور ... */ 
        return new Promise((resolve, reject) => { 
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } 
                    else { if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; } }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => { resolve(blob); }, 'image/jpeg', quality);
                };
            };
        });
    }

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
            loggedInUserProfile = data.user;

            userNameP.textContent = `الاسم: ${data.user.name}`;
            userFamilyP.textContent = `العائلة: ${data.user.family}`;
            userBalanceP.textContent = `الرصيد: $${data.user.balance}`;
            
            await loadTransactionHistory(data.user.email);
            
            if (data.user.role !== 'admin') {
                loadLeaderboards();
                loadActiveQuiz(data.user.email);
                loadUserStore(); // 🛑 تحميل المتجر لليوزر
            }
            refreshDataBtn.textContent = "تحديث البيانات";
        } catch(err) {
            refreshDataBtn.textContent = "فشل التحديث";
        }
    }

    // --- 🛑🛑 لوجيك متجر اليوزر (TAKLOPOLY) 🛑🛑 ---
    
    async function loadUserStore() {
        userStoreContainer.style.display = "block";
        try {
            const response = await fetch('/get-store-items', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email })
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error);

            const { store_items, owned_ids } = data;

            // تفريغ اللوحة أولاً (إزالة الأسعار القديمة والألوان)
            document.querySelectorAll('#user-board .board-property').forEach(prop => {
                const name = prop.dataset.name;
                const priceSpan = document.getElementById(`user-price-${name}`);
                if(priceSpan) priceSpan.textContent = "...";
                prop.classList.remove('property-owned', 'property-affordable', 'property-unaffordable', 'property-not-for-sale');
                
                // Clone Node لإزالة الـ Event Listeners القديمة
                const newProp = prop.cloneNode(true);
                prop.parentNode.replaceChild(newProp, prop);
            });

            // إعادة ملء اللوحة
            document.querySelectorAll('#user-board .board-property').forEach(prop => {
                const name = prop.dataset.name;
                if (name === "من ممر") return; // تجاهل الخانات غير العقارية

                const item = store_items.find(i => i.name === name);
                const priceSpan = document.getElementById(`user-price-${name}`);

                if (item) {
                    // العقار موجود في المتجر
                    if (priceSpan) priceSpan.textContent = `${item.price}`;
                    
                    if (owned_ids.includes(item.id)) {
                        // مملوك
                        prop.classList.add('property-owned');
                    } else {
                        // غير مملوك - هل يقدر يشتريه؟
                        if (loggedInUserProfile.balance >= item.price) {
                            prop.classList.add('property-affordable');
                            // إضافة كليك للشراء
                            prop.addEventListener('click', () => openBuyModal(item));
                        } else {
                            prop.classList.add('property-unaffordable');
                        }
                    }
                } else {
                    // العقار غير معروض للبيع
                    prop.classList.add('property-not-for-sale');
                    if (priceSpan) priceSpan.textContent = "";
                }
            });

        } catch(err) {
            console.error("فشل تحميل المتجر:", err);
        }
    }

    function openBuyModal(item) {
        currentStoreItem = item;
        userModalItemName.textContent = item.name;
        userModalItemPrice.textContent = item.price;
        userModalBalance.textContent = loggedInUserProfile.balance;
        userModalMessage.textContent = "";
        userBuyModal.style.display = "flex";
    }

    userModalCloseBtn.addEventListener('click', () => { userBuyModal.style.display = "none"; });
    
    userModalBuyBtn.addEventListener('click', async () => {
        if (!currentStoreItem) return;
        userModalBuyBtn.disabled = true;
        userModalMessage.textContent = "جاري الشراء...";
        
        try {
            const response = await fetch('/buy-store-item', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: loggedInUserProfile.email,
                    item_id: currentStoreItem.id
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                userModalMessage.style.color = "green";
                userModalMessage.textContent = data.message;
                setTimeout(() => {
                    userBuyModal.style.display = "none";
                    refreshUserData(); // تحديث الرصيد واللوحة
                }, 1500);
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            userModalMessage.style.color = "red";
            userModalMessage.textContent = err.message;
        } finally {
            userModalBuyBtn.disabled = false;
        }
    });

    // ------------------------------------------------

    // (كود اللوجن الأساسي)
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        messageDiv.textContent = "جاري الدخول...";

        try {
            const response = await fetch(`/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                loggedInUserProfile = data.user;
                // ... (تعبئة بيانات الكارت - نفس الكود القديم) ...
                userNameP.textContent = `الاسم: ${data.user.name}`;
                userBalanceP.textContent = `الرصيد: $${data.user.balance}`;
                
                cardContainer.style.display = "flex";
                formContainer.style.display = "none";
                logoutBtn.style.display = "block";
                refreshDataBtn.style.display = "block";
                avatarOverlayLabel.style.display = "flex";

                await loadTransactionHistory(email);

                if (data.user.role === 'admin') {
                    adminPanelDiv.style.display = "block";
                    setupAdminPanel(); // تشغيل كود الأدمن
                } else {
                    leaderboardContainer.style.display = "block";
                    loadLeaderboards();
                    loadActiveQuiz(email);
                    loadUserStore(); // تشغيل كود متجر اليوزر
                }
                messageDiv.textContent = "";
            } else {
                messageDiv.textContent = data.error;
            }
        } catch (err) {
            messageDiv.textContent = "خطأ في الاتصال";
        }
    });

    // (باقي الفانكشنز الأساسية: loadTransactionHistory, loadLeaderboards, loadActiveQuiz, signup, logout - افترض أنها موجودة كما هي لتوفير المساحة في الرد، لكن تأكد من وجودها في ملفك)
    // ...
    async function loadTransactionHistory(email) { /* ... */ }
    async function loadLeaderboards() { /* ... */ }
    async function loadActiveQuiz(email) { /* ... */ }
    logoutBtn.addEventListener("click", () => { resetUI(); });

    // 🛑🛑 كود الأدمن (المتجر التفاعلي) 🛑🛑
    function setupAdminPanel() {
        // ... (أكواد البحث وتعديل الرصيد والكويز - كما هي) ...
        const adminSearchForm = document.getElementById("admin-search-form");
        // (تأكد من وجود باقي أكواد الأدمن هنا)

        // --- منطق متجر الأدمن ---
        const itemModal = document.getElementById("admin-item-modal");
        const modalCloseBtn = document.getElementById("modal-close-btn");
        const modalTitle = document.getElementById("modal-title");
        const adminItemForm = document.getElementById("admin-item-form");
        const modalItemNameDisplay = document.getElementById("modal-item-name-display");
        const modalItemName = document.getElementById("modal-item-name");
        const modalItemPrice = document.getElementById("modal-item-price");
        const modalItemImage = document.getElementById("modal-item-image");
        const modalDeleteBtn = document.getElementById("modal-delete-btn");
        const adminItemMessage = document.getElementById("admin-item-message");
        let storeItemsData = [];

        async function loadAllItemPrices() {
            try {
                const response = await fetch('/admin-get-items');
                const data = await response.json();
                if (data.items) {
                    storeItemsData = data.items;
                    data.items.forEach(item => {
                        const el = document.getElementById(`price-${item.name}`);
                        if (el) el.textContent = item.price;
                    });
                }
            } catch (e) { console.error(e); }
        }

        document.querySelectorAll('#admin-board .board-property').forEach(prop => {
            const name = prop.dataset.name;
            if (name !== "من ممر") {
                prop.addEventListener('click', () => {
                    const item = storeItemsData.find(i => i.name === name);
                    modalTitle.textContent = `تعديل: ${name}`;
                    modalItemNameDisplay.value = name;
                    modalItemName.value = name;
                    if (item) {
                        modalItemPrice.value = item.price;
                        modalItemImage.value = item.image_url || "";
                        modalDeleteBtn.style.display = "block";
                    } else {
                        modalItemPrice.value = "";
                        modalItemImage.value = "";
                        modalDeleteBtn.style.display = "none";
                    }
                    itemModal.style.display = "flex";
                });
            }
        });

        modalCloseBtn.addEventListener('click', () => itemModal.style.display = "none");

        adminItemForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/admin-add-item', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: modalItemName.value,
                        price: modalItemPrice.value,
                        image_url: modalItemImage.value
                    })
                });
                if (response.ok) {
                    loadAllItemPrices(); // تحديث الأسعار
                    itemModal.style.display = "none";
                }
            } catch(err) { alert("خطأ"); }
        });

        modalDeleteBtn.addEventListener("click", async () => {
            const item = storeItemsData.find(i => i.name === modalItemName.value);
            if (!item || !confirm("حذف؟")) return;
            await fetch('/admin-delete-item', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item_id: item.id })
            });
            document.getElementById(`price-${item.name}`).textContent = "...";
            storeItemsData = storeItemsData.filter(i => i.id !== item.id);
            itemModal.style.display = "none";
        });

        loadAllItemPrices();
    }
});