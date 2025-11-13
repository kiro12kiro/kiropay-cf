document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------- المتغيرات والثوابت ---------------------------------
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; 

    let loggedInUserProfile = null;

    // عناصر الواجهة
    const authSection = document.getElementById("auth-section");
    const loginForm = document.getElementById("login-form");
    const authMessage = document.getElementById("auth-message");
    const userInfo = document.getElementById("user-info");
    const welcomeMessage = document.getElementById("welcome-message");
    const userBalance = document.getElementById("user-balance");
    const profileImage = document.getElementById("profile-image");
    const logoutBtn = document.getElementById("logout-btn");
    const userDashboard = document.getElementById("user-dashboard");
    const storeItemsList = document.getElementById("store-items-list");
    const storeMessage = document.getElementById("store-message");
    const adminPanel = document.getElementById("admin-panel");
    const adminBalanceForm = document.getElementById("admin-balance-form");
    const adminBalanceMessage = document.getElementById("admin-balance-message");
    const adminAddItemForm = document.getElementById("admin-add-item-form");
    const storeItemImageFile = document.getElementById("store-item-image-file");
    const adminStoreMessage = document.getElementById("admin-store-message");
    const adminStoreItemsList = document.getElementById("admin-store-items-list");

    // --------------------------------- دوال مساعدة ---------------------------------
    /**
     * تحديث واجهة المستخدم بعد تسجيل الدخول.
     */
    function updateUI(user) {
        loggedInUserProfile = user;
        const isAdmin = user.role === 'admin';

        // تحديث شريط الهيدر
        welcomeMessage.textContent = `مرحباً، ${user.name} ${user.family}`;
        userBalance.textContent = `رصيدك: ${user.balance} نقطة`;
        profileImage.src = user.profile_image_url || 'default-profile.png';
        userInfo.style.display = 'flex';
        authSection.style.display = 'none';
        
        // عرض لوحة الأدمن أو لوحة المستخدم
        adminPanel.style.display = isAdmin ? 'block' : 'none';
        userDashboard.style.display = 'block';

        if (isAdmin) {
            setupAdminPanel();
        } else {
            loadStoreItems();
        }
    }

    /**
     * دالة لتسجيل الخروج.
     */
    function logout() {
        localStorage.removeItem('userEmail');
        loggedInUserProfile = null;
        userInfo.style.display = 'none';
        authSection.style.display = 'block';
        userDashboard.style.display = 'none';
        adminPanel.style.display = 'none';
        authMessage.textContent = "تم تسجيل الخروج بنجاح.";
    }

    /**
     * دالة لتحديث بيانات المستخدم بعد عملية شراء أو تعديل رصيد.
     */
    async function fetchAndUpdateUserProfile() {
        if (!loggedInUserProfile) return;

        try {
            const response = await fetch(`/get-user-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email }),
            });

            const data = await response.json();
            
            if (response.ok && data.user) {
                updateUI(data.user);
            } else {
                console.error("Failed to fetch user profile:", data.error);
                logout(); // تسجيل الخروج إذا فشل التحديث
            }
        } catch(err) {
            console.error("Network error during profile update:", err);
            logout();
        }
    }

    // --------------------------------- دالة ضغط الصور (بدون تغيير) ---------------------------------
    function resizeImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.onload = () => {
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

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // --------------------------------- معالجة تسجيل الدخول ---------------------------------
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        authMessage.textContent = "جاري الدخول...";
        authMessage.style.color = "blue";

        try {
            const response = await fetch(`/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('userEmail', data.user.email);
                authMessage.textContent = "تم تسجيل الدخول بنجاح.";
                authMessage.style.color = "green";
                updateUI(data.user);
            } else {
                authMessage.textContent = data.error || "فشل تسجيل الدخول.";
                authMessage.style.color = "red";
            }
        } catch (err) {
            authMessage.textContent = "خطأ في الاتصال بالخادم.";
            authMessage.style.color = "red";
            console.error("Login Error:", err);
        }
    });

    logoutBtn.addEventListener("click", logout);

    // --------------------------------- لوحة تحكم الأدمن ---------------------------------

    function setupAdminPanel() {
        // --- فورم تحديث الرصيد (بدون تغيير) ---
        adminBalanceForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const targetEmail = document.getElementById("admin-target-email").value.trim();
            const amount = parseInt(document.getElementById("admin-amount").value);

            if (!targetEmail || isNaN(amount) || amount === 0) {
                adminBalanceMessage.textContent = "الرجاء ملء الإيميل والمبلغ بشكل صحيح.";
                adminBalanceMessage.style.color = "red";
                return;
            }

            adminBalanceMessage.textContent = "جاري تحديث الرصيد...";
            adminBalanceMessage.style.color = "blue";

            try {
                const response = await fetch(`/admin-update-balance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ targetEmail, amount }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    adminBalanceMessage.textContent = `تم تحديث رصيد ${targetEmail} بنجاح. الرصيد الجديد: ${data.new_balance}`;
                    adminBalanceMessage.style.color = "green";
                    if (targetEmail === loggedInUserProfile.email) {
                        fetchAndUpdateUserProfile();
                    }
                } else {
                    adminBalanceMessage.textContent = `فشل التحديث: ${data.error || "خطأ غير محدد"}`;
                    adminBalanceMessage.style.color = "red";
                }
            } catch (err) {
                adminBalanceMessage.textContent = "خطأ في الاتصال بالخادم.";
                adminBalanceMessage.style.color = "red";
                console.error("Balance Update Error:", err);
            }
        });

        // --- فورم إضافة عنصر جديد (المعدل لجعل الصورة اختيارية) ---
        adminAddItemForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            const name = document.getElementById("store-item-name").value.trim();
            const price = parseInt(document.getElementById("store-item-price").value);
            const imageFile = storeItemImageFile.files[0]; // 🛑 جلب الملف (قد يكون undefined)

            if (!name || isNaN(price) || price <= 0) {
                adminStoreMessage.textContent = "الرجاء ملء الاسم والسعر بشكل صحيح.";
                adminStoreMessage.style.color = "red";
                return;
            }

            adminStoreMessage.textContent = "جاري التحقق والإضافة...";
            adminStoreMessage.style.color = "blue";
            
            let final_image_url = ''; // 🛑 القيمة الافتراضية تكون رابط فارغ

            try {
                if (imageFile) { // 🛑 فقط إذا اختار المستخدم ملفاً، نقوم بالرفع
                    adminStoreMessage.textContent = "جاري رفع الصورة وضغطها...";
                    const resizedBlob = await resizeImage(imageFile, 400, 400, 0.8); 
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
                adminStoreMessage.textContent = `خطأ: ${err.message || "فشل غير متوقع أثناء الرفع أو الإضافة."}`;
                adminStoreMessage.style.color = "red";
                console.error("Add Item Error:", err);
            }
        });
        
        // تحميل عناصر المتجر للإدارة
        loadAdminStoreItems();
    }
    
    // 🛑🛑 دالة تحميل عناصر المتجر للأدمن (مع هيكل الكارت الجديد) 🛑🛑
    async function loadAdminStoreItems() {
        if (!loggedInUserProfile || loggedInUserProfile.role !== 'admin') return;

        adminStoreItemsList.innerHTML = '<li>جاري تحميل العناصر...</li>';
        adminStoreMessage.textContent = "";

        try {
            const response = await fetch(`/admin-get-items`); 
            
            if (!response.ok) throw new Error("فشل جلب عناصر المتجر للأدمن"); 

            // 🛑 تعديل مرونة استلام الـ JSON (لحماية من أخطاء الـ 500 الخلفية) 🛑
            const text = await response.text();
            if (!text) throw new Error("استجابة فارغة من الخادم.");

            const data = JSON.parse(text); 
            // نهاية التعديل 

            adminStoreItemsList.innerHTML = '';

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const itemName = item.name || 'غير معروف';

                    const li = document.createElement('li');
                    li.className = 'admin-item-card'; // 🛑 تطبيق كلاس الكارت الجديد
                    li.innerHTML = `
                        <div class="admin-item-info">
                            <strong>${itemName}</strong>
                            <small>السعر: $${item.price} | ID: ${item.id}</small>
                            <small>صورة: ${item.image_url ? 'مرفوعة' : 'لا يوجد'}</small>
                        </div>
                        <button class="delete-store-item-btn" data-item-id="${item.id}">حذف</button>
                    `;
                    adminStoreItemsList.appendChild(li);
                });

                document.querySelectorAll('.delete-store-item-btn').forEach(btn => {
                    btn.addEventListener('click', handleDeleteItem);
                });
            } else {
                adminStoreItemsList.innerHTML = `<li style="text-align: center;">لا توجد عناصر مضافة حالياً.</li>`;
            }
        } catch(err) {
            adminStoreItemsList.innerHTML = `<li style="color: red; text-align: center;">خطأ في تحميل العناصر: ${err.message}.</li>`;
            console.error("Admin Store Load Error:", err);
        }
    }
    
    // دالة حذف العنصر
    async function handleDeleteItem(event) {
        const itemId = event.target.dataset.itemId;
        if (!confirm(`هل أنت متأكد من حذف العنصر رقم ${itemId}؟`)) return;

        adminStoreMessage.textContent = `جاري حذف العنصر رقم ${itemId}...`;
        adminStoreMessage.style.color = "blue";

        try {
            const response = await fetch(`/admin-delete-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                adminStoreMessage.textContent = `تم حذف العنصر بنجاح.`;
                adminStoreMessage.style.color = "green";
                await loadAdminStoreItems(); // تحديث القائمة
            } else {
                adminStoreMessage.textContent = `فشل الحذف: ${data.error || "خطأ غير محدد"}`;
                adminStoreMessage.style.color = "red";
            }
        } catch (err) {
            adminStoreMessage.textContent = "خطأ في الاتصال بالخادم أثناء الحذف.";
            adminStoreMessage.style.color = "red";
            console.error("Delete Item Error:", err);
        }
    }

    // --------------------------------- واجهة المستخدم (المتجر) ---------------------------------
    
    // دالة تحميل عناصر المتجر للمستخدم العادي (بدون تغيير)
    async function loadStoreItems() {
        storeItemsList.innerHTML = '<li>جاري تحميل المتجر...</li>';
        storeMessage.textContent = "";

        try {
            const response = await fetch(`/get-store-items`);
            const data = await response.json();

            storeItemsList.innerHTML = '';
            
            if (response.ok && data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'store-item';
                    li.innerHTML = `
                        <img src="${item.image_url || 'default-item.png'}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.price} نقطة</p>
                        <button class="buy-item-btn" data-item-id="${item.id}">شراء</button>
                    `;
                    storeItemsList.appendChild(li);
                });

                document.querySelectorAll('.buy-item-btn').forEach(btn => {
                    btn.addEventListener('click', handleBuyItem);
                });
            } else {
                storeItemsList.innerHTML = `<li style="text-align: center;">لا توجد عناصر متاحة حالياً.</li>`;
            }

        } catch(err) {
            storeItemsList.innerHTML = `<li style="color: red; text-align: center;">خطأ في تحميل المتجر.</li>`;
            console.error("Store Load Error:", err);
        }
    }
    
    // دالة معالجة الشراء (بدون تغيير)
    async function handleBuyItem(event) {
        if (!loggedInUserProfile) return;

        const itemId = event.target.dataset.itemId;
        storeMessage.textContent = "جاري إتمام عملية الشراء...";
        storeMessage.style.color = "blue";
        
        try {
            const response = await fetch(`/buy-store-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loggedInUserProfile.email, itemId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                storeMessage.textContent = data.message;
                storeMessage.style.color = "green";
                await fetchAndUpdateUserProfile(); // تحديث الرصيد بعد الشراء
            } else {
                storeMessage.textContent = data.error || "فشل عملية الشراء.";
                storeMessage.style.color = "red";
            }
        } catch (err) {
            storeMessage.textContent = "خطأ في الاتصال بالخادم أثناء الشراء.";
            storeMessage.style.color = "red";
            console.error("Buy Item Error:", err);
        }
    }


    // --------------------------------- التهيئة عند التحميل ---------------------------------
    async function initializeApp() {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            try {
                const response = await fetch(`/get-user-profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail }),
                });

                const data = await response.json();
                
                if (response.ok && data.user) {
                    updateUI(data.user);
                } else {
                    localStorage.removeItem('userEmail');
                    authSection.style.display = 'block';
                }
            } catch (err) {
                localStorage.removeItem('userEmail');
                authSection.style.display = 'block';
                console.error("Initialization error:", err);
            }
        } else {
            authSection.style.display = 'block';
        }
    }

    initializeApp();
});
