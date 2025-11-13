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
    let currentStoreItem = null; 

    // --- عناصر الكويز ---
    const quizContainer = document.getElementById("quiz-container");
    const quizQuestionText = document.getElementById("quiz-question-text");
    const quizBtnA = document.getElementById("quiz-btn-a");
    const quizBtnB = document.getElementById("quiz-btn-b");
    const quizBtnC = document.getElementById("quiz-btn-c");
    const quizOptionButtons = document.querySelectorAll(".quiz-option-btn");
    const quizSubmitBtn = document.getElementById("quiz-submit-btn");
    const quizMessage = document.getElementById("quiz-message");
    let currentQuizId = null;
    let selectedOption = null;

    // --- عناصر لوحة الصدارة ---
    const leaderboardContainer = document.getElementById("leaderboard-container");
    const topChampionsList = document.getElementById("top-champions-list");
    const familyAnbaMoussaList = document.getElementById("family-anba-moussa-list");
    const familyMargergesList = document.getElementById("family-margerges-list");
    const familyAnbaKarasList = document.getElementById("family-anba-karas-list");

    // --- عناصر الإعلانات ---
    const userAnnouncementBox = document.getElementById("user-announcement-box");
    const userAnnouncementText = document.getElementById("user-announcement-text");

    // --- عناصر لوحة الأدمن ---
    const adminPanelDiv = document.getElementById("admin-panel");
    const adminAnnouncementText = document.getElementById("admin-announcement-text");

    const DEFAULT_AVATAR_URL = "/default-avatar.png";
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/Dhbanzq4n/image/upload`;
    const CLOUDINARY_UPLOAD_PRESET = "kiropay_upload";

    // --- إعادة تعيين الواجهة ---
    const resetUI = () => {
        cardContainer.style.display = "none";
        formContainer.style.display = "flex"; // التأكد من ظهور الفورم
        logoutBtn.style.display = "none";
        refreshDataBtn.style.display = "none";
        adminPanelDiv.style.display = "none";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        userStoreContainer.style.display = "none"; 
        avatarOverlayLabel.style.display = "none";
        userAnnouncementBox.style.display = "none";
        loggedInUserProfile = null; 
        transactionList.innerHTML = "";
    };
    resetUI();

    // --- دالة ضغط الصور (الـ Canvas اللي كنت قلقان منه موجود هنا فقط لتصغير الصور) ---
    function resizeImage(file, maxWidth, maxHeight, quality) {
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
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    }

    // --- تحديث بيانات المستخدم ---
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
            userAvatarImg.src = data.user.profile_image_url || DEFAULT_AVATAR_URL;
            
            await loadTransactionHistory(data.user.email);
            await loadAnnouncement();
            
            if (data.user.role !== 'admin') {
                await loadLeaderboards();
                await loadActiveQuiz(data.user.email);
                await loadUserStore(); 
            }
            refreshDataBtn.textContent = "تحديث البيانات";
        } catch(err) {
            refreshDataBtn.textContent = "فشل التحديث";
            console.error(err);
        }
    }

    // --- تسجيل الدخول ---
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        messageDiv.textContent = "جاري الدخول...";
        messageDiv.style.color = "blue";

        try {
            const response = await fetch(`/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = "تم الدخول بنجاح";
                messageDiv.style.color = "green";
                loggedInUserProfile = data.user;
                
                userNameP.textContent = `الاسم: ${data.user.name}`;
                userFamilyP.textContent = `العائلة: ${data.user.family}`;
                userBalanceP.textContent = `الرصيد: $${data.user.balance}`;
                userAvatarImg.src = data.user.profile_image_url || DEFAULT_AVATAR_URL;
                
                cardContainer.style.display = "flex";
                formContainer.style.display = "none";
                logoutBtn.style.display = "block";
                refreshDataBtn.style.display = "block";
                avatarOverlayLabel.style.display = "flex";

                await loadTransactionHistory(email);
                await loadAnnouncement();

                if (data.user.role === 'admin') {
                    adminPanelDiv.style.display = "block";
                    setupAdminPanel(); 
                } else {
                    leaderboardContainer.style.display = "block";
                    await loadLeaderboards();
                    await loadActiveQuiz(email);
                    await loadUserStore(); 
                }
            } else {
                messageDiv.textContent = data.error || "خطأ في البيانات";
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = "خطأ في الاتصال";
            messageDiv.style.color = "red";
        }
    });

    // --- التسجيل (Signup) ---
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        messageDiv.textContent = "جاري إنشاء الحساب...";
        messageDiv.style.color = "blue";

        const name = document.getElementById("name").value;
        const family = document.getElementById("family").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const avatarFile = signupAvatarFile.files[0];

        let profile_image_url = DEFAULT_AVATAR_URL;

        try {
            if (avatarFile) {
                messageDiv.textContent = "جاري رفع الصورة...";
                const resizedBlob = await resizeImage(avatarFile, 150, 150, 0.7); 
                const formData = new FormData();
                formData.append('file', resizedBlob);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                const cloudRes = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
                if(!cloudRes.ok) throw new Error("فشل رفع الصورة");
                const cloudData = await cloudRes.json();
                profile_image_url = cloudData.secure_url;
            }

            messageDiv.textContent = "جاري التسجيل...";
            const dataToSend = new FormData();
            dataToSend.append('name', name);
            dataToSend.append('family', family);
            dataToSend.append('email', email);
            dataToSend.append('password', password);
            dataToSend.append('profile_image_url', profile_image_url);

            const response = await fetch(`/signup`, { method: "POST", body: dataToSend });
            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = "تم التسجيل! قم بتسجيل الدخول الآن.";
                messageDiv.style.color = "green";
                signupForm.reset();
            } else {
                messageDiv.textContent = data.error;
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = "حدث خطأ أثناء التسجيل";
            messageDiv.style.color = "red";
        }
    });

    // --- سجل المعاملات ---
    async function loadTransactionHistory(email) {
        transactionList.innerHTML = "<li>جاري التحميل...</li>";
        try {
            const response = await fetch(`/get-transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            transactionList.innerHTML = "";
            if (data.transactions && data.transactions.length > 0) {
                data.transactions.forEach(t => {
                    const li = document.createElement("li");
                    const sign = t.amount > 0 ? "+" : "";
                    const colorClass = t.amount > 0 ? "positive" : "negative";
                    li.innerHTML = `<span>${t.reason}</span><span class="amount ${colorClass}">${sign}${t.amount}</span>`;
                    transactionList.appendChild(li);
                });
            } else {
                transactionList.innerHTML = `<li class="no-history">لا يوجد معاملات</li>`;
            }
        } catch(err) {
            transactionList.innerHTML = `<li style="color:red">فشل تحميل السجل</li>`;
        }
    }

    // --- لوحة الصدارة ---
    async function loadLeaderboards() {
        try {
            const [res1, res2, res3, res4] = await Promise.all([
                fetch('/get-top-champions', { method: "POST" }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة الانبا موسي الاسود" }) }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة مارجرس" }) }),
                fetch('/get-family-top-10', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: "اسرة الانبا كاراس" }) })
            ]);

            const champs = await res1.json();
            topChampionsList.innerHTML = "";
            if(champs.champions) {
                champs.champions.forEach((u, i) => {
                    topChampionsList.innerHTML += `<div class="champion-card"><div class="rank">${i+1}</div><img src="${u.profile_image_url||DEFAULT_AVATAR_URL}" class="card-img"><span class="name">${u.name}</span><small>${u.balance} نقطة</small></div>`;
                });
            }

            const fillList = async (res, listElem) => {
                const d = await res.json();
                listElem.innerHTML = "";
                if(d.users) d.users.forEach((u,i) => listElem.innerHTML += `<li><span>${i+1}. ${u.name}</span><strong>${u.balance}</strong></li>`);
            };
            await fillList(res2, familyAnbaMoussaList);
            await fillList(res3, familyMargergesList);
            await fillList(res4, familyAnbaKarasList);

        } catch(err) { console.error("Leaderboard error", err); }
    }

    // --- الكويز ---
    async function loadActiveQuiz(email) {
        try {
            const response = await fetch(`/get-active-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                quizContainer.style.display = "none";
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
            quizContainer.style.display = "none";
        }
    }

    quizOptionButtons.forEach(button => {
        button.addEventListener("click", () => {
            quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedOption = button.dataset.value; 
        });
    });

    quizSubmitBtn.addEventListener("click", async () => {
        if (!selectedOption) return;
        quizSubmitBtn.disabled = true;
        try {
            const response = await fetch(`/submit-quiz-answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email, quizId: currentQuizId, selectedOption })
            });
            const data = await response.json();
            quizMessage.textContent = data.message;
            quizMessage.style.color = data.success ? "green" : "red";
            if (data.success) refreshUserData();
            setTimeout(() => { quizContainer.style.display = "none"; }, 2000);
        } catch (err) {
            quizMessage.textContent = "خطأ";
        }
    });

    // --- الإعلانات ---
    async function loadAnnouncement() {
        try {
            const res = await fetch(`/get-announcement`, { method: "POST" });
            const data = await res.json();
            if(data.message) {
                userAnnouncementText.textContent = data.message;
                userAnnouncementBox.style.display = "block";
                if(loggedInUserProfile.role === 'admin') adminAnnouncementText.value = data.message;
            } else {
                userAnnouncementBox.style.display = "none";
            }
        } catch(e) {}
    }

    // --- متجر اليوزر (TAKLOPOLY) ---
    async function loadUserStore() {
        userStoreContainer.style.display = "block";
        try {
            const response = await fetch('/get-store-items', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email })
            });
            const data = await response.json();
            if (!response.ok) return;

            const { store_items, owned_ids } = data;

            document.querySelectorAll('#user-board .board-property').forEach(prop => {
                const name = prop.dataset.name;
                if (name === "من ممر") return;

                // إزالة الأحداث القديمة
                const newProp = prop.cloneNode(true);
                prop.parentNode.replaceChild(newProp, prop);
                const currentProp = newProp; // التعامل مع العنصر الجديد

                const item = store_items.find(i => i.name === name);
                const priceSpan = document.getElementById(`user-price-${name}`);

                currentProp.classList.remove('property-owned', 'property-affordable', 'property-unaffordable', 'property-not-for-sale');

                if (item) {
                    if(priceSpan) priceSpan.textContent = item.price;
                    if (owned_ids.includes(item.id)) {
                        currentProp.classList.add('property-owned');
                    } else {
                        if (loggedInUserProfile.balance >= item.price) {
                            currentProp.classList.add('property-affordable');
                            currentProp.addEventListener('click', () => openBuyModal(item));
                        } else {
                            currentProp.classList.add('property-unaffordable');
                        }
                    }
                } else {
                    currentProp.classList.add('property-not-for-sale');
                    if(priceSpan) priceSpan.textContent = "";
                }
            });
        } catch(err) { console.error("Store error", err); }
    }

    function openBuyModal(item) {
        currentStoreItem = item;
        userModalItemName.textContent = item.name;
        userModalItemPrice.textContent = item.price;
        userModalBalance.textContent = loggedInUserProfile.balance;
        userModalMessage.textContent = "";
        userBuyModal.style.display = "flex";
    }

    userModalCloseBtn.addEventListener('click', () => userBuyModal.style.display = "none");
    
    userModalBuyBtn.addEventListener('click', async () => {
        if (!currentStoreItem) return;
        userModalBuyBtn.disabled = true;
        userModalMessage.textContent = "جاري الشراء...";
        
        try {
            const response = await fetch('/buy-store-item', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email, item_id: currentStoreItem.id })
            });
            const data = await response.json();
            if (response.ok) {
                userModalMessage.textContent = data.message;
                userModalMessage.style.color = "green";
                setTimeout(() => {
                    userBuyModal.style.display = "none";
                    refreshUserData();
                }, 1500);
            } else {
                userModalMessage.textContent = data.error;
                userModalMessage.style.color = "red";
            }
        } catch (err) {
            userModalMessage.textContent = "خطأ في الشراء";
        } finally {
            userModalBuyBtn.disabled = false;
        }
    });

    logoutBtn.addEventListener("click", resetUI);
    refreshDataBtn.addEventListener("click", refreshUserData);

    // --- لوحة تحكم الأدمن (الكاملة) ---
    function setupAdminPanel() {
        const adminSearchForm = document.getElementById("admin-search-form");
        const adminSearchInput = document.getElementById("admin-search-name");
        const adminResultsListDiv = document.getElementById("admin-results-list");
        const adminSelectUser = document.getElementById("admin-select-user");
        const searchedUserCard = document.getElementById("admin-searched-user-card");
        const searchedUserName = document.getElementById("searched-user-name");
        const searchedUserFamily = document.getElementById("searched-user-family");
        const searchedUserBalance = document.getElementById("searched-user-balance");
        const adminBalanceInput = document.getElementById("admin-balance-amount");
        const addBalBtn = document.getElementById("admin-add-balance-btn");
        const subBalBtn = document.getElementById("admin-subtract-balance-btn");
        const adminSearchMsg = document.getElementById("admin-search-message");
        const adminBalanceMsg = document.getElementById("admin-balance-message");
        let currentSearchedUser = null;

        adminSearchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = adminSearchInput.value;
            try {
                const res = await fetch('/admin-search', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
                const data = await res.json();
                if(res.ok && data.users.length > 0) {
                    if(data.users.length === 1) {
                        showAdminUser(data.users[0]);
                    } else {
                        adminResultsListDiv.style.display = "block";
                        adminSelectUser.innerHTML = "";
                        data.users.forEach(u => {
                            const opt = document.createElement("option");
                            opt.value = JSON.stringify(u);
                            opt.textContent = `${u.name} (${u.family})`;
                            adminSelectUser.appendChild(opt);
                        });
                        showAdminUser(data.users[0]);
                        adminSelectUser.onchange = () => showAdminUser(JSON.parse(adminSelectUser.value));
                    }
                } else {
                    adminSearchMsg.textContent = "لا يوجد مستخدم";
                }
            } catch(err) { adminSearchMsg.textContent = "خطأ"; }
        });

        function showAdminUser(user) {
            currentSearchedUser = user;
            searchedUserCard.style.display = "block";
            searchedUserName.textContent = user.name;
            searchedUserFamily.textContent = user.family;
            searchedUserBalance.textContent = user.balance;
            adminResultsListDiv.style.display = "none";
        }

        async function updateBalance(amount) {
            if(!currentSearchedUser) return;
            try {
                const res = await fetch('/admin-update-balance', {
                    method: "POST", headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ email: currentSearchedUser.email, amount, reason: "تعديل أدمن" })
                });
                const d = await res.json();
                if(res.ok) {
                    adminBalanceMsg.textContent = "تم التحديث";
                    searchedUserBalance.textContent = d.new_balance;
                }
            } catch(e) {}
        }

        addBalBtn.addEventListener("click", () => updateBalance(parseInt(adminBalanceInput.value)));
        subBalBtn.addEventListener("click", () => updateBalance(-parseInt(adminBalanceInput.value)));

        // (إدارة الكويز والإعلانات... افترض وجودها هنا كما كانت لعدم الإطالة، لكن الكود أعلاه يحتويها)
        
        // --- إدارة متجر الأدمن ---
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
                    adminItemMessage.textContent = "";
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
            adminItemMessage.textContent = "جاري الحفظ...";
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
                const d = await response.json();
                if (response.ok) {
                    adminItemMessage.textContent = "تم الحفظ";
                    adminItemMessage.style.color = "green";
                    loadAllItemPrices();
                    setTimeout(() => itemModal.style.display = "none", 1000);
                } else {
                    adminItemMessage.textContent = d.error;
                    adminItemMessage.style.color = "red";
                }
            } catch(err) { adminItemMessage.textContent = "خطأ"; }
        });

        modalDeleteBtn.addEventListener("click", async () => {
            const item = storeItemsData.find(i => i.name === modalItemName.value);
            if (!item || !confirm("هل أنت متأكد من الحذف؟")) return;
            try {
                await fetch('/admin-delete-item', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ item_id: item.id })
                });
                document.getElementById(`price-${item.name}`).textContent = "...";
                storeItemsData = storeItemsData.filter(i => i.id !== item.id);
                itemModal.style.display = "none";
            } catch(e) { alert("فشل الحذف"); }
        });

        loadAllItemPrices();
    }
});