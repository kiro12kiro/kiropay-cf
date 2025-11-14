document.addEventListener("DOMContentLoaded", () => { // 🛑 تم إصلاح الخطأ هنا
    // --- مسك العناصر الأساسية ---
    // (... العناصر السابقة كما هي ...)

    // --- عناصر كارت المستخدم (اللي عامل لوجن) ---
    const userNameP = document.getElementById("user-name");
    const userFamilyP = document.getElementById("user-family");
    const userBalanceP = document.getElementById("user-balance");
    const userLevelP = document.getElementById("user-level"); // 🛑 إضافة عنصر المستوى
    const userAvatarImg = document.getElementById("user-avatar");
    const DEFAULT_AVATAR_URL = "/default-avatar.png";

    // (... باقي العناصر كما هي ...)

    // --- عناصر لوحة الأدمن ---
    // (... العناصر السابقة كما هي ...)
    const searchedUserEmail = document.getElementById("searched-user-email");
    const searchedUserBalance = document.getElementById("searched-user-balance");
    const searchedUserLevel = document.getElementById("searched-user-level"); // 🛑 إضافة عنصر مستوى المستخدم (الأدمن)
    const balanceAmountInput = document.getElementById("admin-balance-amount");
    const addBalanceBtn = document.getElementById("admin-add-balance-btn");
    const subtractBalanceBtn = document.getElementById("admin-subtract-balance-btn");
    const balanceMessage = document.getElementById("admin-balance-message");
    
    // 🛑 إضافة عناصر التحكم في المستوى (الأدمن)
    const adminLevelAmount = document.getElementById("admin-level-amount");
    const adminUpdateLevelBtn = document.getElementById("admin-update-level-btn");
    const adminLevelMessage = document.getElementById("admin-level-message");

    const deleteUserBtn = document.getElementById("admin-delete-user-btn");
    // (... العناصر السابقة كما هي ...)
    
    // --- عناصر إدارة المتجر (جديدة) ---
    const adminAddItemForm = document.getElementById("admin-add-item-form");
    const adminStoreItemsList = document.getElementById("admin-store-items-list");
    const adminStoreMessage = document.getElementById("admin-store-message");
    const storeItemImageFile = document.getElementById("store-item-image-file"); 
    const storeItemRequiredLevel = document.getElementById("store-item-required-level"); // 🛑 إضافة عنصر المستوى للمنتج

    // (... العناصر السابقة كما هي ...)

    // 🛑 عناصر نافذة التعديل (Modal) 🛑
    // (... العناصر السابقة كما هي ...)
    const editItemPrice = document.getElementById("edit-item-price");
    const editItemRequiredLevel = document.getElementById("edit-item-required-level"); // 🛑 إضافة عنصر تعديل المستوى
    const editItemNewFile = document.getElementById("edit-item-new-file");
    // (... العناصر السابقة كما هي ...)


    // 🛑 فرض الحالة الأولية الصحيحة عند فتح الصفحة 🛑
    const resetUI = () => {
        // (... الأكواد السابقة كما هي ...)
        userAnnouncementBox.style.display = "none";
        loggedInUserProfile = null; 
        transactionList.innerHTML = "";
        userLevelP.textContent = ""; // 🛑 إضافة
        editModalOverlay.style.display = "none";
    };

    resetUI();

    // (... دالة ضغط الصور كما هي ...)
    // (... دالة إخفاء الأقسام كما هي ...)
    // (... دالة تحميل اللوحة الرئيسية كما هي ...)
    // (... دالة تحميل المشتريات كما هي ...)


    // 🛑🛑 فانكشن تحديث البيانات (Refresh) 🛑🛑
    async function refreshUserData() {
        if (!loggedInUserProfile) return;
        refreshDataBtn.textContent = "جاري التحديث...";
        try {
            // (... الكود السابق كما هو ...)
            const user = data.user;
            loggedInUserProfile = user;

            userNameP.textContent = `الاسم: ${user.name}`;
            userFamilyP.textContent = `العائلة: ${user.family}`;
            userBalanceP.textContent = `الرصيد: $${user.balance}`;
            userLevelP.textContent = `المستوى: ${user.level || 1}`; // 🛑 تحديث المستوى
            userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
            
            await loadTransactionHistory(user.email);
            if (user.role !== 'admin') {
            // (... الكود السابق كما هو ...)
            }
            // (... الكود السابق كما هو ...)
        } catch(err) {
            refreshDataBtn.textContent = "فشل التحديث";
            console.error("Refresh Error:", err);
        }
    }

    // --- فورم اللوجن ---
    loginForm.addEventListener("submit", async (event) => {
        // (... الكود السابق كما هو ...)
            if (response.ok) {
                // (... الكود السابق كما هو ...)
                const user = data.user;
                loggedInUserProfile = user;

                userNameP.textContent = `الاسم: ${user.name}`;
                userFamilyP.textContent = `العائلة: ${user.family}`;
                userBalanceP.textContent = `الرصيد: $${user.balance}`;
                userLevelP.textContent = `المستوى: ${user.level || 1}`; // 🛑 تحديث المستوى
                userAvatarImg.src = user.profile_image_url ? user.profile_image_url : DEFAULT_AVATAR_URL;
                
                // (... الكود السابق كما هو ...)
            } else {
            // (... الكود السابق كما هو ...)
            }
        } catch (err) {
        // (... الكود السابق كما هو ...)
        }
    });

    // (... باقي الدوال (مشترياتي، سجل المعاملات، لوحة الصدارة، الكويز، الإعلانات) كما هي ...)


    // 🛑🛑 فانكشن جلب وعرض عناصر المتجر (للمستخدم) 🛑🛑
    async function loadStoreItems() {
        if (loggedInUserProfile && loggedInUserProfile.role === 'admin') return; 

        storeContainer.style.display = "block";
        storeLoadingMessage.style.display = 'block';
        storeItemsList.innerHTML = '';
        storeMessage.textContent = "";

        try {
            const response = await fetch(`/get-store-items`); 
            
            if (!response.ok) throw new Error("فشل جلب عناصر المتجر"); 
            const data = await response.json();
            
            storeLoadingMessage.style.display = 'none';
            storeItemsList.innerHTML = '';

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

    // --- فانكشن الشراء (كما هي، الـ back-end هو من سيرفض الشراء للمستوى غير الكافي) ---
    async function handleBuyItem(event) {
        // (... الكود كما هو ...)
        // ملحوظة: إذا فشل الشراء بسبب المستوى، 
        // الـ back-end سيرسل data.error = "المستوى غير كافٍ"
        // والكود الحالي سيعرضها:
        // } else {
        //     storeMessage.textContent = data.error || "فشل عملية الشراء.";
        //     storeMessage.style.color = "red";
        // }
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
        editItemNewFile.value = null;
        editUploadStatusMessage.textContent = '';
        
        editModalOverlay.style.display = 'flex';

        // 2. معالج إغلاق النافذة (كما هو)
        closeEditModal.onclick = () => { /* ... */ };

        // 3. معالج إرسال النموذج
        editItemForm.onsubmit = async (event) => {
            event.preventDefault();
            
            const newName = editItemName.value.trim();
            const newPrice = parseInt(editItemPrice.value);
            const newRequiredLevel = parseInt(editItemRequiredLevel.value); // 🛑 جلب المستوى
            const fileToUpload = editItemNewFile.files[0];
            
            if (!newName || isNaN(newPrice) || newPrice <= 0 || isNaN(newRequiredLevel) || newRequiredLevel < 1) { // 🛑 إضافة التحقق
                editUploadStatusMessage.textContent = "الرجاء إدخال اسم وسعر ومستوى صالحين.";
                editUploadStatusMessage.style.color = 'red';
                return;
            }

            // (... منطق رفع الصورة كما هو ...)

            try {
                // (... الكود السابق كما هو ...)
                
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
                    // (... الكود السابق كما هو ...)
                } else {
                    editUploadStatusMessage.textContent = `فشل التعديل: ${data.error || "خطأ غير محدد"}`;
                    editUploadStatusMessage.style.color = "red";
                }
            } catch (err) {
                // (... الكود السابق كما هو ...)
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
            
            // (... الكود السابق كما هو ...)
            const data = JSON.parse(text); 
            adminStoreItemsList.innerHTML = '';

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const itemName = item.name || item.namel || 'غير معروف';
                    const itemLevel = item.required_level || 1; // 🛑 جلب المستوى

                    const li = document.createElement('li');
                    li.className = 'admin-item-card';
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
                        
                        handleEditItem(itemId, itemName, itemPrice, imageUrl, itemLevel); // 🛑 تمرير المستوى
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

    // --- فانكشن حذف عنصر (كما هي) ---
    // (... الكود كما هو ...)

    // --- فورم التسجيل (كما هو) ---
    // (... الكود كما هو ...)

    // --- زرار تسجيل الخروج (كما هو) ---
    // (... الكود كما هو ...)

    // --- كود "تغيير الصورة" (كما هو) ---
    // (... الكود كما هو ...)

    // --- أكواد الكويز (كما هي) ---
    // (... الكود كما هو ...)

    // --- زرار الريفرش (كما هو) ---
    // (... الكود كما هو ...)

    // 
    // --- أكواد الأدمن (النسخة المستقرة) ---
    // 
    (function setupAdminPanel() {
        let currentSearchedUser = null;

        // --- فورم البحث بالاسم (كما هو) ---
        // (... الكود كما هو ...)

        // --- فانكشن ملء الكارت ---
        function populateAdminCard(user) {
            searchedUserName.textContent = `الاسم: ${user.name}`;
            searchedUserFamily.textContent = `العائلة: ${user.family}`;
            searchedUserEmail.textContent = `الإيميل: ${user.email}`;
            searchedUserBalance.textContent = `الرصيد: $${user.balance}`;
            searchedUserLevel.textContent = `المستوى: ${user.level || 1}`; // 🛑 تحديث المستوى
            searchedUserCard.style.display = "block";
            currentSearchedUser = user; 
            balanceMessage.textContent = "";
            deleteMessage.textContent = "";
            adminLevelMessage.textContent = ""; // 🛑 إضافة
            adminLevelAmount.value = user.level || 1; // 🛑 إضافة
        }

        // --- كود الدروب ليست (كما هو) ---
        // (... الكود كما هو ...)

        // --- فانكشن تعديل الرصيد (كما هي) ---
        // (... الكود كما هو ...)

        // --- زراير الرصيد (الفردي) (كما هي) ---
        // (... الكود كما هو ...)

        // 🛑🛑 زرار تحديث المستوى (جديد) 🛑🛑
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
                    searchedUserLevel.textContent = `المستوى: ${data.new_level}`;
                    
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


        // --- زرار حذف المستخدم (كما هو) ---
        // (... الكود كما هو ...)
        
        // --- عرض المستخدمين حسب الأسرة (كما هو) ---
        // (... الكود كما هو ...)

        // --- كود متابعة الـ Checkboxes (كما هو) ---
        // (... الكود كما هو ...)

        // --- فانكشن تعديل الرصيد الجماعي (كما هي) ---
        // (... الكود كما هو ...)

        // --- إضافة سؤال جديد (Quiz) (كما هو) ---
        // (... الكود كما هو ...)

        // --- كود فورم الإعلانات (كما هو) ---
        // (... الكود كما هو ...)
        
        // --- فورم إضافة عنصر جديد (المعدل لرفع الملفات) ---
        adminAddItemForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            const name = document.getElementById("store-item-name").value.trim();
            const price = parseInt(document.getElementById("store-item-price").value);
            const requiredLevel = parseInt(document.getElementById("store-item-required-level").value) || 1; // 🛑 جلب المستوى
            const imageFile = storeItemImageFile.files[0];

            if (!name || isNaN(price) || price <= 0 || isNaN(requiredLevel) || requiredLevel < 1) { // 🛑 إضافة التحقق
                adminStoreMessage.textContent = "الرجاء ملء الاسم والسعر والمستوى المطلوب بشكل صحيح.";
                adminStoreMessage.style.color = "red";
                return;
            }

            adminStoreMessage.textContent = "جاري التحقق والإضافة...";
            adminStoreMessage.style.color = "blue";
            
            let final_image_url = ''; 

            try {
                // (... منطق رفع الصورة كما هو ...)
                
                adminStoreMessage.textContent = "جاري إرسال بيانات المنتج...";
                
                const response = await fetch(`/admin-add-item`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        name, 
                        price, 
                        image_url: final_image_url,
                        required_level: requiredLevel, // 🛑 إرسال المستوى
                        email: loggedInUserProfile.email 
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    adminStoreMessage.textContent = `تم إضافة المنتج: ${name} بنجاح!`;
                    // (... الكود السابق كما هو ...)
                } else {
                    adminStoreMessage.textContent = `فشل الإضافة: ${data.error || "خطأ غير محدد"}`;
                    // (... الكود السابق كما هو ...)
                }
            } catch (err) {
                // (... الكود السابق كما هو ...)
            }
        });
        
    })(); // 🛑 نهاية أكواد الأدمن 🛑

}); // نهاية "DOMContentLoaded"
