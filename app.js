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
    
    // --- عناصر فورم الأدمن للكويز ---
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptA = document.getElementById("quiz-opt-a");
    const quizOptB = document.getElementById("quiz-opt-b");
    const quizOptC = document.getElementById("quiz-opt-c");
    const quizCorrectOpt = document.getElementById("quiz-correct-opt");
    const quizPoints = document.getElementById("quiz-points");


    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
    cardContainer.style.display = "none";
    formContainer.style.display = "flex"; // أظهر فورمات اللوجن/الساين أب في البداية
    logoutBtn.style.display = "none";
    refreshDataBtn.style.display = "none";
    adminPanelDiv.style.display = "none";
    leaderboardContainer.style.display = "none";
    quizContainer.style.display = "none";
    avatarOverlayLabel.style.display = "none";
    massUpdateControls.style.display = "none";
    userAnnouncementBox.style.display = "none";

    // --- فانكشن تصغير الصورة (Cloudinary Helper) ---
    function resizeImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
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
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type, quality);
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

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = "تم تسجيل الدخول بنجاح!";
                messageDiv.style.color = "green";
                
                const user = data.user;
                
                // 🛑 تخزين بروفايل اليوزر 🛑
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
                messageDiv.textContent = `فشل: ${data.error}`;
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = "حدث خطأ في الاتصال بالـ API.";
            messageDiv.style.color = "red";
        }
    });

    // --- فانكشن سجل المعاملات ---
    async function loadTransactionHistory(email) {
        transactionList.innerHTML = `<li>جاري تحميل السجل...</li>`;
        try {
            const response = await fetch(`/get-transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || "فشل تحميل السجل");

            transactionList.innerHTML = "";
            if (data.transactions.length === 0) {
                transactionList.innerHTML = `<li class="no-history">لا يوجد سجل معاملات.</li>`;
            } else {
                data.transactions.forEach(t => {
                    const li = document.createElement("li");
                    const amountClass = t.amount > 0 ? "positive" : "negative";
                    const sign = t.amount > 0 ? "+" : "";
                    
                    li.innerHTML = `
                        <span>${t.description}</span>
                        <span class="amount ${amountClass}">${sign}$${t.amount}</span>
                    `;
                    transactionList.appendChild(li);
                });
            }
        } catch(err) {
            transactionList.innerHTML = `<li class="no-history" style="color: red;">خطأ في تحميل السجل.</li>`;
            console.error("Transaction History Error:", err);
        }
    }

    // --- فانكشن جلب الإعلانات ---
    async function loadAnnouncement() {
        userAnnouncementText.textContent = "جاري تحميل الإعلانات...";
        userAnnouncementBox.style.display = "none";

        try {
            const response = await fetch(`/get-announcement`);
            const data = await response.json();

            if (response.ok && data.announcement && data.announcement.is_active) {
                userAnnouncementText.textContent = data.announcement.text;
                userAnnouncementBox.style.display = "block";
                if (loggedInUserProfile && loggedInUserProfile.role === 'admin') {
                    adminAnnouncementText.value = data.announcement.text;
                }
            } else {
                userAnnouncementBox.style.display = "none";
            }
        } catch (err) {
            console.error("Announcement load error:", err);
            userAnnouncementBox.style.display = "none";
        }
    }

    // --- فانكشن لوحة الصدارة ---
    async function loadLeaderboards() {
        topChampionsList.innerHTML = "";
        familyAnbaMoussaList.innerHTML = "";
        familyMargergesList.innerHTML = "";
        familyAnbaKarasList.innerHTML = "";

        const rankEmojis = { 1: "🥇", 2: "🥈", 3: "🥉" };

        try {
            const response = await fetch('/get-leaderboard');
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "فشل تحميل لوحة الصدارة");

            // 1. الأبطال (Top 3)
            const topUsers = data.leaderboard.slice(0, 3);
            if (topUsers.length > 0) {
                topUsers.forEach((user, index) => {
                    const rank = index + 1;
                    const card = document.createElement('div');
                    card.className = 'champion-card';
                    card.innerHTML = `
                        <div class="rank">${rankEmojis[rank]}</div>
                        <img src="${user.profile_image_url || DEFAULT_AVATAR_URL}" alt="${user.name}" class="card-img" style="width: 100px; height: 100px; border-radius: 50%;">
                        <span class="name">${user.name}</span>
                        <small style="display: block; color: #555;">$${user.balance}</small>
                    `;
                    topChampionsList.appendChild(card);
                });
            } else {
                topChampionsList.innerHTML = '<p style="text-align: center; color: #888;">لا توجد بيانات كافية لعرض الأبطال.</p>';
            }

            // 2. القوائم التفصيلية (Top 10 لكل عائلة)
            const familyLists = {
                "اسرة الانبا موسي الاسود": familyAnbaMoussaList,
                "اسرة مارجرس": familyMargergesList,
                "اسرة الانبا كاراس": familyAnbaKarasList
            };

            for (const family in familyLists) {
                const listElement = familyLists[family];
                const familyData = data.leaderboard.filter(user => user.family === family).slice(0, 10);
                
                if (familyData.length === 0) {
                    listElement.innerHTML = `<li><small>لا يوجد مستخدمين مسجلين في هذه الأسرة.</small></li>`;
                    continue;
                }

                familyData.forEach((user, index) => {
                    const rank = index + 1;
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${rank}. ${user.name}</span>
                        <strong>$${user.balance}</strong>
                    `;
                    listElement.appendChild(li);
                });
            }

        } catch (err) {
            console.error("Leaderboard Error:", err);
            topChampionsList.innerHTML = '<p style="text-align: center; color: red;">فشل تحميل لوحة الصدارة.</p>';
        }
    }


    // --- فانكشن الكويز (load, submit) ---
    async function loadActiveQuiz(email) {
        quizContainer.style.display = 'none';
        quizMessage.textContent = '';
        currentQuizId = null;

        try {
            const response = await fetch('/get-active-quiz', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok || !data.quiz) {
                // قد يكون لا يوجد كويز نشط أو المستخدم جاوب
                quizMessage.textContent = data.message || "لا يوجد سؤال نشط حالياً أو لقد أجبت عليه بالفعل.";
                quizMessage.style.color = "black";
                return;
            }

            const quiz = data.quiz;
            currentQuizId = quiz.id;
            quizQuestionText.textContent = quiz.question;

            quizBtnA.textContent = quiz.option_a;
            quizBtnB.textContent = quiz.option_b;
            quizBtnC.textContent = quiz.option_c;

            quizOptionButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.disabled = false;
            });
            quizSubmitBtn.disabled = true;
            selectedOption = null;
            quizContainer.style.display = 'block';

        } catch (err) {
            console.error("Quiz load error:", err);
            quizMessage.textContent = "حدث خطأ في تحميل السؤال.";
            quizMessage.style.color = "red";
        }
    }
    
    // --- فورم التسجيل (Signup) ---
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        event.stopPropagation();
        
        messageDiv.textContent = "جاري التسجيل...";
        messageDiv.style.color = "blue";
        
        const name = document.getElementById("name").value;
        const family = document.getElementById("family").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        
        const avatarFile = signupAvatarFile.files[0];
        let avatarUrl = null;

        try {
            if (avatarFile) {
                messageDiv.textContent = "جاري رفع الصورة...";
                const resizedBlob = await resizeImage(avatarFile, 200, 200, 0.8);
                
                const formData = new FormData();
                formData.append('file', resizedBlob);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                
                const uploadResponse = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
                });
                
                if (!uploadResponse.ok) {
                    throw new Error("فشل رفع الصورة على Cloudinary.");
                }
                
                const uploadData = await uploadResponse.json();
                avatarUrl = uploadData.secure_url;
                messageDiv.textContent = "جاري إكمال التسجيل...";
            }

            const response = await fetch(`/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, family, email, password, profile_image_url: avatarUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = `تم التسجيل بنجاح، مرحباً ${name}!`;
                messageDiv.style.color = "green";
                signupForm.reset();
            } else {
                messageDiv.textContent = `فشل: ${data.error}`;
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = `حدث خطأ: ${err.message}`;
            messageDiv.style.color = "red";
            console.error(err);
        }
    });


    // --- زرار تسجيل الخروج ---
    logoutBtn.addEventListener("click", () => {
        // 🛑 فرض الحالة الأولية 🛑
        cardContainer.style.display = "none";
        formContainer.style.display = "flex";
        logoutBtn.style.display = "none";
        refreshDataBtn.style.display = "none";
        adminPanelDiv.style.display = "none";
        leaderboardContainer.style.display = "none";
        quizContainer.style.display = "none";
        avatarOverlayLabel.style.display = "none";
        userAnnouncementBox.style.display = "none";

        userNameP.textContent = "Name: ";
        userFamilyP.textContent = "Family: ";
        userBalanceP.textContent = "Balance: ";
        userAvatarImg.src = DEFAULT_AVATAR_URL;
        
        loginForm.reset();
        messageDiv.textContent = "تم تسجيل الخروج.";
        messageDiv.style.color = "blue";

        loggedInUserProfile = null;
        transactionList.innerHTML = "";
    });


    // --- كود "تغيير الصورة" ---
    avatarUploadInput.addEventListener("change", async () => {
        if (!loggedInUserProfile) return;
        const file = avatarUploadInput.files[0];
        if (!file) return;

        avatarOverlayLabel.innerHTML = 'جاري الرفع...';

        try {
            const resizedBlob = await resizeImage(file, 200, 200, 0.8);
            
            const formData = new FormData();
            formData.append('file', resizedBlob);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            const uploadResponse = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            });
            
            if (!uploadResponse.ok) {
                throw new Error("فشل رفع الصورة على Cloudinary.");
            }
            
            const uploadData = await uploadResponse.json();
            const newAvatarUrl = uploadData.secure_url;

            // تحديث رابط الصورة في الداتا بيز
            const dbResponse = await fetch('/update-avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loggedInUserProfile.email, url: newAvatarUrl }),
            });

            if (!dbResponse.ok) {
                throw new Error("فشل تحديث قاعدة البيانات.");
            }

            userAvatarImg.src = newAvatarUrl;
            loggedInUserProfile.profile_image_url = newAvatarUrl;
            avatarOverlayLabel.innerHTML = 'تغيير الصورة';
            alert("تم تحديث الصورة بنجاح!");

        } catch (err) {
            console.error(err);
            avatarOverlayLabel.innerHTML = 'حدث خطأ!';
            alert(`فشل تغيير الصورة: ${err.message}`);
        }
    });

    // --- أكواد الكويز ---
    quizOptionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            quizOptionButtons.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedOption = e.target.dataset.value;
            quizSubmitBtn.disabled = false;
        });
    });

    quizSubmitBtn.addEventListener("click", async () => {
        if (!selectedOption || !currentQuizId || !loggedInUserProfile) return;

        quizMessage.textContent = "جاري إرسال الإجابة...";
        quizMessage.style.color = "blue";
        quizSubmitBtn.disabled = true;
        quizOptionButtons.forEach(btn => btn.disabled = true);

        try {
            const response = await fetch('/submit-quiz-answer', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loggedInUserProfile.email,
                    quiz_id: currentQuizId,
                    answer: selectedOption
                }),
            });

            const data = await response.json();

            if (response.ok) {
                quizMessage.textContent = data.message;
                quizMessage.style.color = "green";
                // تحديث بيانات المستخدم بعد الإجابة الصحيحة
                if (data.points_awarded) {
                    await refreshUserData();
                }
            } else {
                quizMessage.textContent = data.error || "فشل إرسال الإجابة.";
                quizMessage.style.color = "red";
            }
        } catch (err) {
            quizMessage.textContent = "حدث خطأ في الاتصال بالشبكة.";
            quizMessage.style.color = "red";
        }
    });

    // 🛑 ربط زرار الريفرش 🛑
    refreshDataBtn.addEventListener('click', refreshUserData);

    // 
    // --- أكواد الأدمن (مع الإصلاحات النهائية) ---
    // 
    (function setupAdminPanel() {
        let currentSearchedUser = null; 

        // --- 1. فورم البحث بالاسم 🛑 (الإصلاح المطلوب) 🛑 ---
        adminSearchForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // ⬅️ الإصلاح الأهم لمنع الريفرش
            
            adminSearchMessage.textContent = "جاري البحث...";
            adminSearchMessage.style.color = "blue";
            adminResultsListDiv.style.display = "none";
            adminSelectUser.innerHTML = "";
            searchedUserCard.style.display = "none";
            currentSearchResults = [];

            const name = adminSearchInput.value.trim();
            if (!name) {
                adminSearchMessage.textContent = "الرجاء إدخال اسم للبحث.";
                adminSearchMessage.style.color = "red";
                return;
            }

            try {
                const response = await fetch(`/admin-search-user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name }),
                });

                const data = await response.json();

                if (!response.ok) {
                    adminSearchMessage.textContent = `فشل البحث: ${data.error}`;
                    adminSearchMessage.style.color = "red";
                    return;
                }

                currentSearchResults = data.users;

                if (currentSearchResults.length === 0) {
                    adminSearchMessage.textContent = `لم يتم العثور على مستخدمين بالاسم "${name}".`;
                    adminSearchMessage.style.color = "black";
                } else if (currentSearchResults.length === 1) {
                    adminSearchMessage.textContent = `تم العثور على مستخدم واحد.`;
                    adminSearchMessage.style.color = "green";
                    populateAdminCard(currentSearchResults[0]);
                } else {
                    adminSearchMessage.textContent = `تم العثور على ${currentSearchResults.length} مستخدمين. يرجى الاختيار من القائمة.`;
                    adminSearchMessage.style.color = "green";
                    
                    currentSearchResults.forEach(user => {
                        const option = document.createElement("option");
                        option.value = user.email;
                        option.textContent = `${user.name} (${user.email}) - ${user.family}`;
                        adminSelectUser.appendChild(option);
                    });
                    adminResultsListDiv.style.display = "block";
                    // قم بملء الكارت بأول نتيجة تلقائيا
                    populateAdminCard(currentSearchResults[0]);
                }
            } catch (err) {
                adminSearchMessage.textContent = "حدث خطأ في الاتصال بالـ API.";
                adminSearchMessage.style.color = "red";
                console.error("Search Error:", err);
            }
        });

        // --- فانكشن ملء الكارت الفردي ---
        function populateAdminCard(user) {
            currentSearchedUser = user;
            searchedUserName.textContent = user.name;
            searchedUserFamily.textContent = user.family;
            searchedUserEmail.textContent = user.email;
            searchedUserBalance.textContent = `$${user.balance}`;
            searchedUserCard.style.display = "block";
            balanceMessage.textContent = "";
            deleteMessage.textContent = "";
        }

        // --- كود الدروب ليست ---
        adminSelectUser.addEventListener("change", () => {
            const selectedEmail = adminSelectUser.value;
            const user = currentSearchResults.find(u => u.email === selectedEmail);
            if (user) {
                populateAdminCard(user);
                searchedUserCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        // --- فانكشن تعديل الرصيد الجماعي 🛑🛑 (مُفعلة) 🛑🛑 ---
        async function handleMassUpdate(amount) {
            if (selectedUsersForMassUpdate.length === 0) {
                massUpdateMessage.textContent = "يجب اختيار مستخدم واحد على الأقل.";
                massUpdateMessage.style.color = "red";
                return;
            }

            const finalAmount = Number(amount);
            if (isNaN(finalAmount) || finalAmount === 0) {
                massUpdateMessage.textContent = "الكمية غير صحيحة.";
                massUpdateMessage.style.color = "red";
                return;
            }

            massUpdateMessage.textContent = "جاري تنفيذ التعديل الجماعي...";
            massUpdateMessage.style.color = "blue";
            
            try {
                const response = await fetch(`/admin-mass-update-balance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        admin_email: loggedInUserProfile.email,
                        target_emails: selectedUsersForMassUpdate,
                        amount: finalAmount
                    }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    massUpdateMessage.textContent = `تم تعديل رصيد ${data.updated_count} مستخدم بنجاح!`;
                    massUpdateMessage.style.color = "green";
                    
                    // إفراغ الاختيارات واللوحة
                    selectedUsersForMassUpdate = [];
                    selectedUsersCount.textContent = 0;
                    massUpdateControls.style.display = "none";
                    adminFamilyResultsDiv.innerHTML = "";
                    massUpdateAmount.value = "";
                    
                    // تحديث لوحة الأدمن إذا كان المستخدم المعدل هو نفسه
                    if (currentSearchedUser && selectedUsersForMassUpdate.includes(currentSearchedUser.email)) {
                        refreshUserData(); 
                    }

                } else {
                    massUpdateMessage.textContent = `فشل: ${data.error}`;
                    massUpdateMessage.style.color = "red";
                }
            } catch (err) {
                massUpdateMessage.textContent = "خطأ في الاتصال بالـ API أثناء التعديل الجماعي.";
                massUpdateMessage.style.color = "red";
            }
        }

        // --- زراير الرصيد (الفردي) ---
        async function handleSingleUpdate(isAddition) {
            if (!currentSearchedUser) {
                balanceMessage.textContent = "يرجى اختيار مستخدم أولاً.";
                balanceMessage.style.color = "red";
                return;
            }

            const amountValue = balanceAmountInput.value;
            const amount = Number(amountValue);

            if (isNaN(amount) || amount <= 0) {
                balanceMessage.textContent = "الرجاء إدخال كمية صحيحة وموجبة.";
                balanceMessage.style.color = "red";
                return;
            }

            const finalAmount = isAddition ? amount : -amount;

            balanceMessage.textContent = "جاري التعديل...";
            balanceMessage.style.color = "blue";

            try {
                const response = await fetch(`/admin-update-balance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        admin_email: loggedInUserProfile.email,
                        target_email: currentSearchedUser.email,
                        amount: finalAmount,
                        description: `تعديل يدوي من الأدمن: ${isAddition ? 'إضافة' : 'خصم'} $${amount}`
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    balanceMessage.textContent = `تم التعديل بنجاح! الرصيد الجديد: $${data.new_balance}`;
                    balanceMessage.style.color = "green";
                    currentSearchedUser.balance = data.new_balance;
                    searchedUserBalance.textContent = `$${data.new_balance}`;
                    
                    // إذا كان المستخدم المُعدل هو المستخدم الحالي (الأدمن نفسه)
                    if (loggedInUserProfile.email === currentSearchedUser.email) {
                        refreshUserData();
                    }
                } else {
                    balanceMessage.textContent = `فشل التعديل: ${data.error}`;
                    balanceMessage.style.color = "red";
                }
            } catch (err) {
                balanceMessage.textContent = "خطأ في الاتصال بالـ API.";
                balanceMessage.style.color = "red";
                console.error("Single Update Error:", err);
            }
        }

        addBalanceBtn.addEventListener("click", () => handleSingleUpdate(true));
        subtractBalanceBtn.addEventListener("click", () => handleSingleUpdate(false));

        // --- زرار حذف المستخدم ---
        deleteUserBtn.addEventListener("click", async () => {
            if (!currentSearchedUser) {
                deleteMessage.textContent = "يرجى اختيار مستخدم للحذف أولاً.";
                deleteMessage.style.color = "red";
                return;
            }

            if (!confirm(`هل أنت متأكد من حذف المستخدم ${currentSearchedUser.name} نهائياً؟ هذا الإجراء لا يمكن التراجع عنه!`)) {
                return;
            }
            
            deleteMessage.textContent = "جاري الحذف...";
            deleteMessage.style.color = "blue";

            try {
                const response = await fetch('/admin-delete-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: currentSearchedUser.email }),
                });

                const data = await response.json();

                if (response.ok) {
                    deleteMessage.textContent = `تم حذف المستخدم ${currentSearchedUser.name} بنجاح.`;
                    deleteMessage.style.color = "green";
                    searchedUserCard.style.display = "none";
                    currentSearchedUser = null;
                } else {
                    deleteMessage.textContent = `فشل الحذف: ${data.error}`;
                    deleteMessage.style.color = "red";
                }
            } catch (err) {
                deleteMessage.textContent = "خطأ في الاتصال بالـ API.";
                deleteMessage.style.color = "red";
                console.error("Delete Error:", err);
            }
        });

        // --- كود زراير الأسر (🛑 مع إضافة Checkbox) ---
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

                    const data = await response.json();

                    if (!response.ok) {
                        adminFamilyMessage.textContent = `فشل: ${data.error}`;
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
                    selectedUsersForMassUpdate = selectedUsersForMassUpdate.filter(em => em !== email);
                }
                selectedUsersCount.textContent = selectedUsersForMassUpdate.length;
                massUpdateMessage.textContent = "";
            }
        });
        
        // (ربط زراير التعديل الجماعي)
        massUpdateAddBtn.addEventListener('click', () => {
            const amount = massUpdateAmount.value;
            handleMassUpdate(amount);
        });
        
        massUpdateSubtractBtn.addEventListener('click', () => {
            const amount = massUpdateAmount.value;
            // يتم تمرير قيمة سالبة للخصم (Amount = -50 مثلا)
            if (Number(amount) > 0) {
                 handleMassUpdate(-Number(amount));
            } else {
                massUpdateMessage.textContent = "يرجى إدخال قيمة موجبة للخصم (مثال: 50).";
                massUpdateMessage.style.color = "red";
            }
        });

        // --- كود فورم إضافة سؤال (مع الـ preventDefault) ---
        adminQuizForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 🛑 التأكد من منع إعادة التحميل
            
            adminQuizMessage.textContent = "جاري إضافة السؤال...";
            adminQuizMessage.style.color = "blue";

            const quizData = {
                question: quizQuestion.value,
                option_a: quizOptA.value,
                option_b: quizOptB.value,
                option_c: quizOptC.value,
                correct_option: quizCorrectOpt.value,
                points: Number(quizPoints.value),
                admin_email: loggedInUserProfile.email
            };

            if (!quizData.question || !quizData.correct_option || isNaN(quizData.points) || quizData.points <= 0) {
                adminQuizMessage.textContent = "يرجى ملء كل الحقول بشكل صحيح.";
                adminQuizMessage.style.color = "red";
                return;
            }

            try {
                const response = await fetch('/admin-add-quiz', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(quizData),
                });

                const data = await response.json();

                if (response.ok) {
                    adminQuizMessage.textContent = `تم إضافة السؤال بنجاح! النقاط: ${quizData.points}`;
                    adminQuizMessage.style.color = "green";
                    adminQuizForm.reset();
                } else {
                    adminQuizMessage.textContent = `فشل إضافة السؤال: ${data.error}`;
                    adminQuizMessage.style.color = "red";
                }
            } catch (err) {
                adminQuizMessage.textContent = "خطأ في الاتصال بالـ API.";
                adminQuizMessage.style.color = "red";
                console.error("Quiz Add Error:", err);
            }
        });

        // 🛑 كود فورم الإعلانات (مع الـ preventDefault) 🛑
        adminAnnouncementForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // 🛑🛑 الإصلاح: منع تسجيل الخروج 🛑🛑
            
            adminAnnouncementMessage.textContent = "جاري نشر الإعلان...";
            adminAnnouncementMessage.style.color = "blue";

            const announcementText = adminAnnouncementText.value;

            try {
                const response = await fetch('/admin-post-announcement', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: announcementText }),
                });

                const data = await response.json();

                if (response.ok) {
                    adminAnnouncementMessage.textContent = `تم نشر الإعلان بنجاح.`;
                    adminAnnouncementMessage.style.color = "green";
                    
                    // تحديث عرض الإعلان في واجهة الأدمن واليوزر
                    loadAnnouncement(); 
                } else {
                    adminAnnouncementMessage.textContent = `فشل نشر الإعلان: ${data.error}`;
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
