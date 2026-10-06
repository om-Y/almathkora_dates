function initAlmathkoraApp() {
    // ==========================================
    // 1. STATE & CONSTANTS
    // ==========================================
    const DEFAULT_ADMIN_PASS = 'admin123';
    const DEFAULT_DELETE_PASS = 'admin123';
    // Default Google Web Client ID for standard GIS connection
    const DEFAULT_GOOGLE_CLIENT_ID = '379768224097-uoufsf76c5b5mfs1vhg8c105p4t2gq1a.apps.googleusercontent.com';

    let cart = [];
    let currentNewProductImageData = null;
    let currentEditProductImageData = null;

    // DOM Elements - Main Store
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.querySelector('.cart-count');
    const totalPriceElement = document.getElementById('totalPrice');
    const productsGrid = document.getElementById('productsGrid');

    // DOM Elements - Checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.getElementById('closeCheckout');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const payBtn = document.querySelector('.pay-btn');
    const checkoutCustName = document.getElementById('checkoutCustName');

    // DOM Elements - Google Auth
    const googleLoginNavBtn = document.getElementById('googleLoginNavBtn');
    const userProfileBadge = document.getElementById('userProfileBadge');
    const userPillBtn = document.getElementById('userPillBtn');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const googleLogoutBtn = document.getElementById('googleLogoutBtn');
    const googleSignInModal = document.getElementById('googleSignInModal');
    const closeGoogleSignInModal = document.getElementById('closeGoogleSignInModal');
    const realGoogleDirectBtn = document.getElementById('realGoogleDirectBtn');
    const quickGoogleLoginForm = document.getElementById('quickGoogleLoginForm');
    const demoUserOneClickBtn = document.getElementById('demoUserOneClickBtn');

    // DOM Elements - Settings & Passwords
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const footerSettingsLink = document.getElementById('footerSettingsLink');
    const settingsAuthModal = document.getElementById('settingsAuthModal');
    const closeSettingsAuthModal = document.getElementById('closeSettingsAuthModal');
    const settingsLoginForm = document.getElementById('settingsLoginForm');
    const settingsPasswordInput = document.getElementById('settingsPasswordInput');
    const settingsAuthError = document.getElementById('settingsAuthError');

    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
    const settingsTabContents = document.querySelectorAll('.settings-tab-content');
    const adminTotalProductsCount = document.getElementById('adminTotalProductsCount');

    // DOM Elements - Add Product
    const addProductForm = document.getElementById('addProductForm');
    const newProdName = document.getElementById('newProdName');
    const newProdPrice = document.getElementById('newProdPrice');
    const newProdStockStatus = document.getElementById('newProdStockStatus');
    const newProdDesc = document.getElementById('newProdDesc');
    const newProdImageFile = document.getElementById('newProdImageFile');
    const newProdImageUrl = document.getElementById('newProdImageUrl');
    const imagePreviewBox = document.getElementById('imagePreviewBox');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const removePreviewImgBtn = document.getElementById('removePreviewImgBtn');

    // DOM Elements - Edit Product Modal
    const editProductModal = document.getElementById('editProductModal');
    const closeEditProductModal = document.getElementById('closeEditProductModal');
    const cancelEditProdBtn = document.getElementById('cancelEditProdBtn');
    const editProductForm = document.getElementById('editProductForm');
    const editProdId = document.getElementById('editProdId');
    const editProdName = document.getElementById('editProdName');
    const editProdPrice = document.getElementById('editProdPrice');
    const editProdStockStatus = document.getElementById('editProdStockStatus');
    const editProdDesc = document.getElementById('editProdDesc');
    const editProdCurrentImgPreview = document.getElementById('editProdCurrentImgPreview');
    const editProdImageFile = document.getElementById('editProdImageFile');
    const editProdImageUrl = document.getElementById('editProdImageUrl');

    // DOM Elements - Manage & Delete Products
    const adminProductsList = document.getElementById('adminProductsList');
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteConfirmModal = document.getElementById('closeDeleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteConfirmForm = document.getElementById('deleteConfirmForm');
    const deleteTargetProductId = document.getElementById('deleteTargetProductId');
    const deleteTargetProductName = document.getElementById('deleteTargetProductName');
    const deleteConfirmPasswordInput = document.getElementById('deleteConfirmPasswordInput');
    const deleteAuthError = document.getElementById('deleteAuthError');

    // DOM Elements - Security & Google Config
    const changeLoginPasswordForm = document.getElementById('changeLoginPasswordForm');
    const currentLoginPass = document.getElementById('currentLoginPass');
    const newLoginPass = document.getElementById('newLoginPass');
    const changeDeletePasswordForm = document.getElementById('changeDeletePasswordForm');
    const currentDeletePass = document.getElementById('currentDeletePass');
    const newDeletePass = document.getElementById('newDeletePass');
    const googleConfigForm = document.getElementById('googleConfigForm');
    const googleClientIdInput = document.getElementById('googleClientIdInput');

    const toastContainer = document.getElementById('toastContainer');

    // ==========================================
    // 2. HELPER UTILITIES
    // ==========================================
    function getAdminLoginPassword() {
        try {
            return localStorage.getItem('almathkora_admin_password') || DEFAULT_ADMIN_PASS;
        } catch (e) {
            return DEFAULT_ADMIN_PASS;
        }
    }

    function getAdminDeletePassword() {
        try {
            return localStorage.getItem('almathkora_delete_password') || DEFAULT_DELETE_PASS;
        } catch (e) {
            return DEFAULT_DELETE_PASS;
        }
    }

    function getGoogleClientId() {
        try {
            return localStorage.getItem('almathkora_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID;
        } catch (e) {
            return DEFAULT_GOOGLE_CLIENT_ID;
        }
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;
        
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-circle-exclamation';
        if (type === 'info') icon = 'fa-circle-info';
        if (type === 'gold') icon = 'fa-star';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3500);
    }

    // Toggle password visibility helper
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            if (targetInput) {
                const isPassword = targetInput.type === 'password';
                targetInput.type = isPassword ? 'text' : 'password';
                btn.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
            }
        });
    });

    // Close any modal on clicking backdrop
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // ==========================================
    // 3. PRODUCTS RENDERING (STORE & ADMIN)
    // ==========================================
    function renderProducts() {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';

        if (!products || products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-products-notice">
                    <i class="fa-solid fa-box-open"></i>
                    <p>لا توجد منتجات معروضة حالياً.</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const isSoldOut = Boolean(product.isOutOfStock);
            const statusBadgeHTML = isSoldOut
                ? `<span class="product-status-tag sold-out"><i class="fa-solid fa-ban"></i> نفدت الكمية</span>`
                : `<span class="product-status-tag in-stock"><i class="fa-solid fa-check"></i> متوفر</span>`;

            const buttonHTML = isSoldOut
                ? `<button class="add-to-cart sold-out-btn" disabled><i class="fa-solid fa-ban"></i> نفدت الكمية</button>`
                : `<button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">إضافة <i class="fa-solid fa-plus"></i></button>`;

            const productHTML = `
                <div class="product-card ${isSoldOut ? 'is-sold-out' : ''}">
                    <div class="product-image">
                        ${statusBadgeHTML}
                        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='logo.jpg';">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="desc">${product.description || ''}</p>
                        <div class="price-row">
                            <span class="price">${product.price} ر.ع.</span>
                            ${buttonHTML}
                        </div>
                    </div>
                </div>
            `;
            productsGrid.insertAdjacentHTML('beforeend', productHTML);
        });

        // Re-attach event listeners for available products only
        const addToCartBtns = productsGrid.querySelectorAll('.add-to-cart:not(.sold-out-btn)');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));

                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id, name, price, quantity: 1 });
                }

                // Animate button
                const originalHtml = btn.innerHTML;
                btn.innerHTML = 'تمت الإضافة <i class="fa-solid fa-check"></i>';
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = '#000';
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 1000);

                updateCartUI();
                showToast(`تمت إضافة "${name}" إلى السلة`, 'info');
            });
        });
    }

    function renderAdminProducts() {
        if (!adminProductsList) return;
        adminProductsList.innerHTML = '';

        if (adminTotalProductsCount) {
            adminTotalProductsCount.textContent = products.length;
        }

        if (!products || products.length === 0) {
            adminProductsList.innerHTML = `
                <div class="admin-empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <p>لا توجد منتجات حالياً. يمكنك إضافة منتج جديد من التبويب أعلاه.</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const isSoldOut = Boolean(product.isOutOfStock);
            const itemDiv = document.createElement('div');
            itemDiv.className = `admin-product-item ${isSoldOut ? 'admin-item-soldout' : ''}`;
            itemDiv.innerHTML = `
                <div class="admin-prod-thumb">
                    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='logo.jpg';">
                </div>
                <div class="admin-prod-details">
                    <h4>${product.name}</h4>
                    <div class="admin-prod-meta">
                        <span class="admin-prod-price"><i class="fa-solid fa-tag"></i> ${product.price} ر.ع.</span>
                        <span class="admin-stock-badge ${isSoldOut ? 'out-of-stock' : 'in-stock'}">
                            ${isSoldOut ? 'نفدت الكمية ❌' : 'متوفر بالمخزون ✅'}
                        </span>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button type="button" class="btn-toggle-stock" data-id="${product.id}" title="${isSoldOut ? 'تفعيل كمتوفر' : 'تحديد كنفدت الكمية'}">
                        <i class="fa-solid ${isSoldOut ? 'fa-box-open' : 'fa-box-archive'}"></i>
                        <span>${isSoldOut ? 'إعادة توفير' : 'نفدت الكمية'}</span>
                    </button>
                    <button type="button" class="btn-edit-trigger" data-id="${product.id}" title="تعديل بيانات المنتج">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span>تعديل</span>
                    </button>
                    <button type="button" class="btn-delete-trigger" data-id="${product.id}" data-name="${product.name}" title="حذف هذا المنتج">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>حذف</span>
                    </button>
                </div>
            `;
            adminProductsList.appendChild(itemDiv);
        });

        // Attach Quick Stock Toggle buttons
        adminProductsList.querySelectorAll('.btn-toggle-stock').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const targetProd = products.find(p => p.id === id);
                if (targetProd) {
                    targetProd.isOutOfStock = !targetProd.isOutOfStock;
                    localStorage.setItem('almathkora_products', JSON.stringify(products));

                    if (isFirebaseActive && firebaseDb) {
                        firebaseDb.collection('products').doc(id).update({
                            isOutOfStock: targetProd.isOutOfStock
                        }).catch(e => console.error(e));
                    }

                    renderProducts();
                    renderAdminProducts();
                    const statusText = targetProd.isOutOfStock ? 'تم تحديد المنتج كـ (نفدت الكمية)' : 'تم تحديد المنتج كـ (متوفر بالمخزون)';
                    showToast(`${targetProd.name}: ${statusText}`, targetProd.isOutOfStock ? 'info' : 'success');
                }
            });
        });

        // Attach Edit Trigger buttons
        adminProductsList.querySelectorAll('.btn-edit-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEditProductModal(id);
            });
        });

        // Attach Delete Trigger buttons
        adminProductsList.querySelectorAll('.btn-delete-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                openDeleteModal(id, name);
            });
        });
    }

    // Initial render
    renderProducts();

    // ==========================================
    // 4. CART & CHECKOUT
    // ==========================================
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        if (checkoutModal) checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let totalCount = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">السلة فارغة حالياً</div>';
        } else {
            cart.forEach(item => {
                totalCount += item.quantity;
                totalPrice += item.price * item.quantity;

                const itemHTML = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="item-price">${item.price} ر.ع.</div>
                        </div>
                        <div class="quantity-controls">
                            <button type="button" onclick="changeQuantity('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                            <span>${item.quantity}</span>
                            <button type="button" onclick="changeQuantity('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <button type="button" class="cart-item-remove" onclick="removeItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        cartCountElement.textContent = totalCount;
        totalPriceElement.textContent = (Math.round(totalPrice * 100) / 100) + ' ر.ع.';
    }

    function toggleCheckout() {
        if (cart.length === 0 && !checkoutModal.classList.contains('active')) {
            alert('السلة فارغة! الرجاء إضافة منتجات قبل إتمام الطلب.');
            return;
        }

        if (!checkoutModal.classList.contains('active')) {
            cartSidebar.classList.remove('open');
            checkoutModal.classList.add('active');
            overlay.classList.add('active');
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            checkoutTotal.textContent = '(' + (Math.round(total * 100) / 100) + ' ر.ع.)';

            // Auto-fill logged in user name if available
            const savedUser = getSavedGoogleUser();
            if (savedUser && checkoutCustName && !checkoutCustName.value) {
                checkoutCustName.value = savedUser.name || '';
            }
        } else {
            checkoutModal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    if (checkoutBtn) checkoutBtn.addEventListener('click', toggleCheckout);
    if (closeCheckout) closeCheckout.addEventListener('click', toggleCheckout);

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = payBtn.innerHTML;
            payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري المعالجة...';

            const name = document.getElementById('checkoutCustName').value;
            const phone = document.getElementById('checkoutCustPhone').value;
            const address = document.getElementById('checkoutCustAddress').value;
            const paymentMethod = checkoutForm.querySelector('input[name="payment"]:checked').value === 'transfer' ? 'تحويل عبر الرقم' : 'الدفع عند الاستلام';

            let orderText = `*طلب جديد من المذخورة* 🌴\n\n`;
            orderText += `*بيانات العميل:*\n`;
            orderText += `الاسم: ${name}\n`;
            orderText += `الجوال: ${phone}\n`;
            orderText += `العنوان: ${address}\n`;
            orderText += `طريقة الدفع: ${paymentMethod}\n\n`;

            orderText += `*تفاصيل الطلب:*\n`;
            let total = 0;
            cart.forEach(item => {
                orderText += `- ${item.name} (الكمية: ${item.quantity}) = ${item.price * item.quantity} ر.ع.\n`;
                total += item.price * item.quantity;
            });
            orderText += `\n*الإجمالي: ${Math.round(total * 100) / 100} ر.ع.*\n`;

            const whatsappUrl = `https://wa.me/96895577026?text=${encodeURIComponent(orderText)}`;

            setTimeout(() => {
                alert('تم تجهيز طلبك! سيتم تحويلك إلى الواتساب لإرسال الطلب لنا واعتماده.');
                window.open(whatsappUrl, '_blank');
                cart = [];
                updateCartUI();
                checkoutModal.classList.remove('active');
                overlay.classList.remove('active');
                checkoutForm.reset();
                payBtn.innerHTML = originalText;
            }, 800);
        });
    }

    window.changeQuantity = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartUI();
        }
    };

    window.removeItem = (id) => {
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    };

    // ==========================================
    // 5. GOOGLE AUTHENTICATION SYSTEM (REAL CONNECTION)
    // ==========================================
    function getSavedGoogleUser() {
        try {
            const data = localStorage.getItem('almathkora_google_user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    function saveGoogleUser(userData) {
        localStorage.setItem('almathkora_google_user', JSON.stringify(userData));
        updateAuthUI(userData);
        showToast(`أهلاً بك يا ${userData.name}! تم الربط بحساب Google بنجاح 🌟`, 'gold');
    }

    function updateAuthUI(user) {
        if (user) {
            googleLoginNavBtn.style.display = 'none';
            userProfileBadge.style.display = 'block';
            userNameDisplay.textContent = user.name || 'مستخدم Google';
            userEmailDisplay.textContent = user.email || '';
            userAvatarImg.src = user.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c';
        } else {
            googleLoginNavBtn.style.display = 'flex';
            userProfileBadge.style.display = 'none';
            userDropdownMenu.classList.remove('show');
        }
    }

    // Toggle user dropdown
    if (userPillBtn) {
        userPillBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (userDropdownMenu && !userProfileBadge.contains(e.target)) {
            userDropdownMenu.classList.remove('show');
        }
    });

    // Real Google Sign-In Trigger (Direct GIS or OAuth flow)
    function triggerGoogleAuthFlow() {
        const clientId = getGoogleClientId();

        // 1. Try Google Identity Services Token Client (Modern Official Pop-up)
        if (window.google && google.accounts && google.accounts.oauth2) {
            try {
                const tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'email profile openid',
                    callback: (tokenResponse) => {
                        if (tokenResponse && tokenResponse.access_token) {
                            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                            })
                            .then(res => res.json())
                            .then(userInfo => {
                                saveGoogleUser({
                                    name: userInfo.name,
                                    email: userInfo.email,
                                    picture: userInfo.picture
                                });
                                if (googleSignInModal) googleSignInModal.classList.remove('active');
                            })
                            .catch(err => {
                                console.error('Error fetching Google profile:', err);
                                fallbackInteractiveGoogleModal();
                            });
                        }
                    }
                });
                tokenClient.requestAccessToken({ prompt: 'select_account' });
                return;
            } catch (err) {
                console.warn('GIS TokenClient initiation failed:', err);
            }
        }

        // 2. Try GIS One-Tap Prompt
        if (window.google && google.accounts && google.accounts.id) {
            try {
                google.accounts.id.prompt();
                return;
            } catch (err) {}
        }

        // 3. Fallback: Open Google Sign-In Modal
        fallbackInteractiveGoogleModal();
    }

    function fallbackInteractiveGoogleModal() {
        if (googleSignInModal) googleSignInModal.classList.add('active');
    }

    // Open Google Login modal / Trigger flow on Nav button click
    if (googleLoginNavBtn) {
        googleLoginNavBtn.addEventListener('click', () => {
            googleSignInModal.classList.add('active');
        });
    }

    if (realGoogleDirectBtn) {
        realGoogleDirectBtn.addEventListener('click', () => {
            triggerGoogleAuthFlow();
        });
    }

    if (closeGoogleSignInModal) {
        closeGoogleSignInModal.addEventListener('click', () => {
            googleSignInModal.classList.remove('active');
        });
    }

    // Logout
    if (googleLogoutBtn) {
        googleLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('almathkora_google_user');
            updateAuthUI(null);
            showToast('تم تسجيل الخروج بنجاح', 'info');
        });
    }

    // Quick Google Login Form submit
    if (quickGoogleLoginForm) {
        quickGoogleLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('quickGoogleName').value.trim();
            const email = document.getElementById('quickGoogleEmail').value.trim();

            if (!name || !email) return;

            const userData = {
                name: name,
                email: email,
                picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
            };

            saveGoogleUser(userData);
            googleSignInModal.classList.remove('active');
            quickGoogleLoginForm.reset();
        });
    }

    // 1-Click Demo User button
    if (demoUserOneClickBtn) {
        demoUserOneClickBtn.addEventListener('click', () => {
            const demoUser = {
                name: 'أحمد المعمري',
                email: 'ahmed.almamari@gmail.com',
                picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
            };
            saveGoogleUser(demoUser);
            googleSignInModal.classList.remove('active');
        });
    }

    // Initialize GIS if script is loaded
    function initGoogleIdentityServices() {
        const clientId = getGoogleClientId();
        if (window.google && google.accounts && google.accounts.id) {
            try {
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => {
                        try {
                            const base64Url = response.credential.split('.')[1];
                            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join(''));
                            const payload = JSON.parse(jsonPayload);

                            const user = {
                                name: payload.name || payload.given_name || 'مستخدم Google',
                                email: payload.email,
                                picture: payload.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c'
                            };
                            saveGoogleUser(user);
                            if (googleSignInModal) googleSignInModal.classList.remove('active');
                        } catch (err) {
                            console.error('Error decoding Google JWT credential:', err);
                        }
                    }
                });

                const gisWrapper = document.getElementById('gisButtonWrapper');
                if (gisWrapper) {
                    gisWrapper.innerHTML = '';
                    google.accounts.id.renderButton(gisWrapper, {
                        theme: 'filled_black',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'pill',
                        locale: 'ar'
                    });
                }
            } catch (err) {
                console.error('GIS initialization error:', err);
            }
        }
    }

    // Init Auth UI on page load
    const savedUser = getSavedGoogleUser();
    updateAuthUI(savedUser);
    setTimeout(initGoogleIdentityServices, 800);

    // ==========================================
    // 6. SETTINGS ACCESS & PASSWORD PROTECTION
    // ==========================================
    function openSettingsFlow() {
        if (settingsPasswordInput) settingsPasswordInput.value = '';
        if (settingsAuthError) settingsAuthError.style.display = 'none';
        if (settingsAuthModal) {
            settingsAuthModal.classList.add('active');
            setTimeout(() => {
                if (settingsPasswordInput) settingsPasswordInput.focus();
            }, 150);
        }
    }

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettingsFlow);
    if (footerSettingsLink) footerSettingsLink.addEventListener('click', openSettingsFlow);

    if (closeSettingsAuthModal) {
        closeSettingsAuthModal.addEventListener('click', () => {
            settingsAuthModal.classList.remove('active');
        });
    }

    if (settingsLoginForm) {
        settingsLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const entered = settingsPasswordInput.value.trim();
            const correctPass = getAdminLoginPassword();

            if (entered === correctPass) {
                settingsAuthModal.classList.remove('active');
                settingsLoginForm.reset();
                settingsAuthError.style.display = 'none';
                
                // Open Settings Modal
                settingsModal.classList.add('active');
                renderAdminProducts();
                showToast('مرحباً بك في لوحة تحكم وإعدادات المتجر', 'gold');
            } else {
                settingsAuthError.textContent = 'كلمة المرور غير صحيحة! يرجى التأكد وإعادة المحاولة.';
                settingsAuthError.style.display = 'block';
                settingsPasswordInput.classList.add('input-error');
                setTimeout(() => settingsPasswordInput.classList.remove('input-error'), 800);
            }
        });
    }

    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    // Settings Navigation Tabs
    settingsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');

            settingsTabBtns.forEach(b => b.classList.remove('active'));
            settingsTabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) targetContent.classList.add('active');

            if (targetTabId === 'tabManageProducts') {
                renderAdminProducts();
            }
        });
    });

    // Helper: compress image file to canvas data url
    function compressImageFile(file, callback) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxDim = 700;
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressed = canvas.toDataURL('image/jpeg', 0.82);
                callback(compressed);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ==========================================
    // 7. ADD PRODUCT FUNCTIONALITY
    // ==========================================
    if (newProdImageFile) {
        newProdImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            compressImageFile(file, (base64) => {
                currentNewProductImageData = base64;
                imagePreviewImg.src = base64;
                imagePreviewBox.style.display = 'block';
                newProdImageUrl.value = '';
            });
        });
    }

    if (newProdImageUrl) {
        newProdImageUrl.addEventListener('input', () => {
            const url = newProdImageUrl.value.trim();
            if (url) {
                currentNewProductImageData = url;
                imagePreviewImg.src = url;
                imagePreviewBox.style.display = 'block';
                if (newProdImageFile) newProdImageFile.value = '';
            } else if (!newProdImageFile.files || newProdImageFile.files.length === 0) {
                currentNewProductImageData = null;
                imagePreviewBox.style.display = 'none';
            }
        });
    }

    if (removePreviewImgBtn) {
        removePreviewImgBtn.addEventListener('click', () => {
            currentNewProductImageData = null;
            if (newProdImageFile) newProdImageFile.value = '';
            if (newProdImageUrl) newProdImageUrl.value = '';
            imagePreviewBox.style.display = 'none';
            imagePreviewImg.src = '';
        });
    }

    // ==========================================
    // GOOGLE FIREBASE CLOUD & REAL-TIME SYNC
    // ==========================================
    let firebaseDb = null;
    let isFirebaseActive = false;
    let firebaseUnsubscribe = null;

    const addProdDiskStatusBanner = document.getElementById('addProdDiskStatusBanner');

    function updateFirebaseUIStatus(connected, errorMsg = '') {
        const banner = document.getElementById('firebaseLiveStatusBanner');
        const title = document.getElementById('firebaseStatusTitle');
        const desc = document.getElementById('firebaseStatusDesc');
        const disconnectBtn = document.getElementById('disconnectFirebaseBtn');

        if (connected) {
            if (banner) {
                banner.className = 'firebase-status-card connected';
                if (title) title.innerHTML = 'حالة السحاب: متصل بنجاح 🟢 (الحفظ السحابي المباشر مفعل)';
                if (desc) desc.textContent = 'أي منتج تضيفه أو تعدله أو تحذفه الآن يُحفظ مباشرة في سحاب Google ويشاهده جميع الزوار فوراً وبشكل تلقائي دون الحاجة لـ GitHub!';
            }
            if (disconnectBtn) disconnectBtn.style.display = 'inline-flex';

            if (addProdDiskStatusBanner) {
                addProdDiskStatusBanner.className = 'disk-status-banner connected';
                addProdDiskStatusBanner.innerHTML = `
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <div>
                        <strong>سحاب Google Firebase مفعل 🟢</strong>
                        <span>أي منتج أو صورة تضيفها الآن ستُنقل وتُحفظ فوراً في سحاب Google ويشاهدها جميع الزوار تلقائياً!</span>
                    </div>
                `;
            }
        } else {
            if (banner) {
                banner.className = 'firebase-status-card not-connected';
                if (title) title.innerHTML = 'حالة السحاب: غير متصل (يعمل محلياً) 🟡';
                if (desc) desc.textContent = errorMsg
                    ? `تنبيه الاتصال: (${errorMsg}). تأكد من إعدادات قواعد Firestore في وضع الاختبار.`
                    : 'التعديلات تنحفظ حالياً داخل متصفحك وجهازك. لربط سحاب Google Firebase للحفظ التلقائي المباشر، اتبع الخطوات السهلة أدناه.';
            }
            if (disconnectBtn) disconnectBtn.style.display = 'none';

            if (addProdDiskStatusBanner) {
                addProdDiskStatusBanner.className = 'disk-status-banner connected';
                addProdDiskStatusBanner.innerHTML = `
                    <i class="fa-solid fa-folder-open"></i>
                    <div>
                        <strong>الموقع يعمل بنجاح ومباشرة من جهازك ✨</strong>
                        <span>عند إضافة أو تعديل المنتجات، يمكنك تحميل ملف <code>products.js</code> بنقرة واحدة من تبويب (إدارة المنتجات) لرفعه مع موقعك إلى GitHub. أو فعّل سحاب Firebase للحفظ التلقائي!</span>
                    </div>
                `;
            }
        }
    }

    async function seedInitialProductsToFirebase(db) {
        try {
            const batch = db.batch();
            initialDefaultProducts.forEach((p, idx) => {
                const docRef = db.collection('products').doc(p.id);
                batch.set(docRef, {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    description: p.description || '',
                    image: p.image,
                    isOutOfStock: Boolean(p.isOutOfStock),
                    createdAt: Date.now() - (idx * 1000)
                });
            });
            await batch.commit();
            console.log('Default products seeded to Firebase successfully.');
        } catch (e) {
            console.error('Error seeding default products to Firebase:', e);
        }
    }

    function initFirebaseSystem() {
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
            updateFirebaseUIStatus(false);
            return;
        }

        const config = getActiveFirebaseConfig();
        if (!isFirebaseConfigured(config)) {
            updateFirebaseUIStatus(false);
            return;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
            firebaseDb = firebase.firestore();
            isFirebaseActive = true;
            updateFirebaseUIStatus(true);

            if (firebaseUnsubscribe) {
                firebaseUnsubscribe();
            }

            // Real-time updates listener for products
            firebaseUnsubscribe = firebaseDb.collection('products').onSnapshot(async (snapshot) => {
                if (snapshot.empty) {
                    await seedInitialProductsToFirebase(firebaseDb);
                } else {
                    const fbList = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        fbList.push({
                            id: doc.id,
                            name: data.name || '',
                            price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
                            description: data.description || '',
                            image: data.image || 'logo.jpg',
                            isOutOfStock: Boolean(data.isOutOfStock),
                            createdAt: data.createdAt || 0
                        });
                    });
                    fbList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    products = fbList;
                    try {
                        localStorage.setItem('almathkora_products', JSON.stringify(products));
                    } catch (e) {}
                    renderProducts();
                    renderAdminProducts();
                }
            }, (error) => {
                console.warn('Firestore subscription error:', error);
                updateFirebaseUIStatus(false, error.message);
            });
        } catch (err) {
            console.error('Firebase setup error:', err);
            isFirebaseActive = false;
            updateFirebaseUIStatus(false, err.message);
        }
    }

    initFirebaseSystem();

    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = newProdName.value.trim();
            const price = parseFloat(newProdPrice.value);
            const isOutOfStock = newProdStockStatus ? (newProdStockStatus.value === 'out_of_stock') : false;
            const description = newProdDesc.value.trim();
            const image = currentNewProductImageData || 'logo.jpg';

            if (!name || isNaN(price) || price <= 0) {
                alert('الرجاء إدخال اسم المنتج وسعر صحيح.');
                return;
            }

            const newProduct = {
                id: 'prod_' + Date.now(),
                name: name,
                price: Math.round(price * 100) / 100,
                description: description,
                image: image,
                isOutOfStock: isOutOfStock
            };

            const saveProductBtn = document.getElementById('saveProductBtn');
            const originalBtnHtml = saveProductBtn ? saveProductBtn.innerHTML : '';

            // إذا كان سحاب Firebase مفعلاً، احفظ المنتج مباشرة في سحاب Google
            if (isFirebaseActive && firebaseDb) {
                if (saveProductBtn) saveProductBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ في سحاب Google...';
                try {
                    newProduct.createdAt = Date.now();
                    await firebaseDb.collection('products').doc(newProduct.id).set(newProduct);
                    showToast(`☁️ تم حفظ "${name}" في سحاب Google وظهر لجميع الزوار فوراً!`, 'gold');
                } catch (err) {
                    console.error('Firebase save error:', err);
                    showToast(`تعذر الحفظ في السحاب (${err.message})`, 'error');
                } finally {
                    if (saveProductBtn) saveProductBtn.innerHTML = originalBtnHtml;
                }
            }

            products.unshift(newProduct);
            try {
                localStorage.setItem('almathkora_products', JSON.stringify(products));
            } catch (err) {
                console.error('Storage error:', err);
            }

            addProductForm.reset();
            currentNewProductImageData = null;
            imagePreviewBox.style.display = 'none';
            imagePreviewImg.src = '';

            renderProducts();
            renderAdminProducts();
            showToast(`تمت إضافة منتج "${name}" بنجاح!`, 'success');

            const manageTabBtn = document.querySelector('[data-tab="tabManageProducts"]');
            if (manageTabBtn) manageTabBtn.click();
        });
    }

    // ==========================================
    // 8. EDIT PRODUCT FUNCTIONALITY (تعديل المنتجات)
    // ==========================================
    function openEditProductModal(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        editProdId.value = product.id;
        editProdName.value = product.name;
        editProdPrice.value = product.price;
        editProdStockStatus.value = product.isOutOfStock ? 'out_of_stock' : 'in_stock';
        editProdDesc.value = product.description || '';
        
        currentEditProductImageData = product.image;
        editProdCurrentImgPreview.src = product.image || 'logo.jpg';
        if (editProdImageFile) editProdImageFile.value = '';
        if (editProdImageUrl) editProdImageUrl.value = '';

        editProductModal.classList.add('active');
    }

    if (closeEditProductModal) {
        closeEditProductModal.addEventListener('click', () => {
            editProductModal.classList.remove('active');
        });
    }

    if (cancelEditProdBtn) {
        cancelEditProdBtn.addEventListener('click', () => {
            editProductModal.classList.remove('active');
        });
    }

    if (editProdImageFile) {
        editProdImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            compressImageFile(file, (base64) => {
                currentEditProductImageData = base64;
                editProdCurrentImgPreview.src = base64;
                if (editProdImageUrl) editProdImageUrl.value = '';
            });
        });
    }

    if (editProdImageUrl) {
        editProdImageUrl.addEventListener('input', () => {
            const url = editProdImageUrl.value.trim();
            if (url) {
                currentEditProductImageData = url;
                editProdCurrentImgPreview.src = url;
                if (editProdImageFile) editProdImageFile.value = '';
            }
        });
    }

    if (editProductForm) {
        editProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = editProdId.value;
            const targetProd = products.find(p => p.id === id);

            if (!targetProd) {
                alert('لم يتم العثور على المنتج المطلوب.');
                return;
            }

            const name = editProdName.value.trim();
            const price = parseFloat(editProdPrice.value);
            const isOutOfStock = editProdStockStatus.value === 'out_of_stock';
            const description = editProdDesc.value.trim();

            if (!name || isNaN(price) || price <= 0) {
                alert('الرجاء التأكد من إدخال اسم صحيح وسعر صحيح.');
                return;
            }

            // Update product object
            targetProd.name = name;
            targetProd.price = Math.round(price * 100) / 100;
            targetProd.isOutOfStock = isOutOfStock;
            targetProd.description = description;
            if (currentEditProductImageData) {
                targetProd.image = currentEditProductImageData;
            }

            // Save to localStorage
            try {
                localStorage.setItem('almathkora_products', JSON.stringify(products));
            } catch (err) {
                alert('تحذير: تعذر حفظ التعديلات بسبب امتلاء مساحة التخزين.');
                return;
            }

            // If product was in cart and now out of stock, inform or adjust
            if (isOutOfStock) {
                cart = cart.filter(i => i.id !== id);
                updateCartUI();
            }

            // إذا كان سحاب Firebase مفعلاً، حدّث المنتج مباشرة في سحاب Google
            if (isFirebaseActive && firebaseDb) {
                try {
                    await firebaseDb.collection('products').doc(id).set(targetProd, { merge: true });
                    showToast(`☁️ تم تحديث "${name}" في سحاب Google بنجاح!`, 'gold');
                } catch (e) {
                    console.error('Firebase edit error:', e);
                }
            }

            renderProducts();
            renderAdminProducts();
            editProductModal.classList.remove('active');
            showToast(`تم حفظ تعديلات "${name}" بنجاح!`, 'success');
        });
    }

    // ==========================================
    // 9. DELETE PRODUCT WITH PASSWORD PROTECTION
    // ==========================================
    function openDeleteModal(productId, productName) {
        deleteTargetProductId.value = productId;
        deleteTargetProductName.textContent = productName;
        deleteConfirmPasswordInput.value = '';
        deleteAuthError.style.display = 'none';
        deleteConfirmModal.classList.add('active');
        setTimeout(() => deleteConfirmPasswordInput.focus(), 150);
    }

    if (closeDeleteConfirmModal) {
        closeDeleteConfirmModal.addEventListener('click', () => {
            deleteConfirmModal.classList.remove('active');
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteConfirmModal.classList.remove('active');
        });
    }

    if (deleteConfirmForm) {
        deleteConfirmForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPass = deleteConfirmPasswordInput.value.trim();
            const correctDeletePass = getAdminDeletePassword();

            if (enteredPass === correctDeletePass) {
                const prodIdToDelete = deleteTargetProductId.value;
                const targetProd = products.find(p => p.id === prodIdToDelete);
                const prodName = targetProd ? targetProd.name : '';

                // Filter out the deleted product
                products = products.filter(p => p.id !== prodIdToDelete);
                localStorage.setItem('almathkora_products', JSON.stringify(products));

                // Also remove from cart if present
                cart = cart.filter(i => i.id !== prodIdToDelete);
                updateCartUI();

                // Re-render
                renderProducts();
                renderAdminProducts();

                // إذا كان سحاب Firebase مفعلاً، احذف المنتج من سحاب Google
                if (isFirebaseActive && firebaseDb) {
                    try {
                        firebaseDb.collection('products').doc(prodIdToDelete).delete().catch(e => console.error(e));
                        showToast(`☁️ تم حذف "${prodName}" من سحاب Google نهائياً`, 'info');
                    } catch (err) {
                        console.error('Firebase delete error:', err);
                    }
                }

                deleteConfirmModal.classList.remove('active');
                deleteConfirmForm.reset();
                showToast(`تم حذف "${prodName}" بنجاح`, 'success');
            } else {
                deleteAuthError.textContent = 'كلمة مرور الحذف غير صحيحة! لا يمكن حذف المنتج.';
                deleteAuthError.style.display = 'block';
                deleteConfirmPasswordInput.classList.add('input-error');
                setTimeout(() => deleteConfirmPasswordInput.classList.remove('input-error'), 800);
            }
        });
    }

    // Reset default products
    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من رغبتك في استعادة قائمة المنتجات الافتراضية الأصلية للمتجر؟')) {
                products = [...initialDefaultProducts];
                localStorage.setItem('almathkora_products', JSON.stringify(products));
                renderProducts();
                renderAdminProducts();
                showToast('تمت استعادة المنتجات الافتراضية بنجاح', 'info');
            }
        });
    }

    // ==========================================
    // 10. SECURITY & CONFIG FORMS
    // ==========================================
    if (changeLoginPasswordForm) {
        changeLoginPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cur = currentLoginPass.value.trim();
            const next = newLoginPass.value.trim();

            if (cur !== getAdminLoginPassword()) {
                alert('كلمة مرور الدخول الحالية غير صحيحة!');
                return;
            }

            if (next.length < 4) {
                alert('يجب أن تتكون كلمة المرور الجديدة من 4 خانات على الأقل.');
                return;
            }

            localStorage.setItem('almathkora_admin_password', next);
            changeLoginPasswordForm.reset();
            showToast('تم تحديث كلمة مرور دخول الإعدادات بنجاح!', 'success');
        });
    }

    if (changeDeletePasswordForm) {
        changeDeletePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cur = currentDeletePass.value.trim();
            const next = newDeletePass.value.trim();

            if (cur !== getAdminDeletePassword()) {
                alert('كلمة مرور الحذف الحالية غير صحيحة!');
                return;
            }

            if (next.length < 4) {
                alert('يجب أن تتكون كلمة المرور الجديدة من 4 خانات على الأقل.');
                return;
            }

            localStorage.setItem('almathkora_delete_password', next);
            changeDeletePasswordForm.reset();
            showToast('تم تحديث كلمة مرور الحذف بنجاح!', 'success');
        });
    }

    if (googleConfigForm) {
        const savedClientId = localStorage.getItem('almathkora_google_client_id') || '';
        if (googleClientIdInput) googleClientIdInput.value = savedClientId;

        googleConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientId = googleClientIdInput.value.trim();
            localStorage.setItem('almathkora_google_client_id', clientId);
            showToast('تم حفظ معرف عميل Google بنجاح!', 'success');
            initGoogleIdentityServices();
        });
    }

    // Firebase Cloud Config Form
    const firebaseConfigForm = document.getElementById('firebaseConfigForm');
    const firebaseConfigJson = document.getElementById('firebaseConfigJson');
    const disconnectFirebaseBtn = document.getElementById('disconnectFirebaseBtn');

    if (firebaseConfigJson) {
        try {
            const savedFb = localStorage.getItem('almathkora_firebase_config');
            if (savedFb) {
                firebaseConfigJson.value = JSON.stringify(JSON.parse(savedFb), null, 2);
            }
        } catch (e) {}
    }

    if (firebaseConfigForm) {
        firebaseConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const raw = firebaseConfigJson.value.trim();
            if (!raw) {
                alert('الرجاء لصق كود firebaseConfig أولاً.');
                return;
            }

            let parsedConfig = null;
            try {
                parsedConfig = JSON.parse(raw);
            } catch (err) {
                try {
                    const extract = (key) => {
                        const match = raw.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
                        return match ? match[1] : '';
                    };
                    parsedConfig = {
                        apiKey: extract('apiKey'),
                        authDomain: extract('authDomain'),
                        projectId: extract('projectId'),
                        storageBucket: extract('storageBucket'),
                        messagingSenderId: extract('messagingSenderId'),
                        appId: extract('appId')
                    };
                } catch (e2) {
                    parsedConfig = null;
                }
            }

            if (!parsedConfig || !parsedConfig.projectId || !parsedConfig.apiKey) {
                alert('تعذر قراءة الكود! تأكد من نسخ كود firebaseConfig بالكامل كما هو من موقع Firebase.');
                return;
            }

            try {
                localStorage.setItem('almathkora_firebase_config', JSON.stringify(parsedConfig));
                showToast('تم حفظ إعدادات Firebase بنجاح! جاري الاتصال بالسحاب... ☁️', 'gold');
                initFirebaseSystem();
            } catch (err) {
                alert('حدث خطأ أثناء حفظ الإعدادات: ' + err.message);
            }
        });
    }

    if (disconnectFirebaseBtn) {
        disconnectFirebaseBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من رغبتك في إلغاء ربط سحاب Firebase والعودة للوضع المحلي؟')) {
                localStorage.removeItem('almathkora_firebase_config');
                if (firebaseConfigJson) firebaseConfigJson.value = '';
                if (firebaseUnsubscribe) {
                    firebaseUnsubscribe();
                    firebaseUnsubscribe = null;
                }
                isFirebaseActive = false;
                firebaseDb = null;
                products = loadStoredProducts();
                renderProducts();
                renderAdminProducts();
                updateFirebaseUIStatus(false);
                showToast('تم إلغاء ربط Firebase والعودة للنظام المحلي بنجاح', 'info');
            }
        });
    }

    // ==========================================
    // 11. EXPORT PRODUCTS.JS FOR GITHUB REPOSITORY
    // ==========================================
    function generateExportableProductsJs() {
        const newVersion = "v_" + Date.now();
        const jsonFormatted = JSON.stringify(products, null, 4);

        return `// تم إنشاء هذا الملف وتحديثه تلقائياً من لوحة تحكم المتجر
const initialDefaultProducts = ${jsonFormatted};

// Product Data Version - updates whenever file is exported for GitHub
const PRODUCTS_DATA_VERSION = "${newVersion}";

function loadStoredProducts() {
    try {
        const storedVersion = localStorage.getItem('almathkora_products_version');
        const stored = localStorage.getItem('almathkora_products');

        // If the code file products.js was updated (e.g. pushed to GitHub with a new version),
        // sync the new products from the repository so all visitors see the updated products!
        if (stored && storedVersion === PRODUCTS_DATA_VERSION) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(p => ({
                    ...p,
                    isOutOfStock: typeof p.isOutOfStock === 'boolean' ? p.isOutOfStock : false
                }));
            }
        }
    } catch (e) {
        console.error('Error loading products from localStorage:', e);
    }

    try {
        localStorage.setItem('almathkora_products', JSON.stringify(initialDefaultProducts));
        localStorage.setItem('almathkora_products_version', PRODUCTS_DATA_VERSION);
    } catch (e) {}
    return [...initialDefaultProducts];
}

let products = loadStoredProducts();
`;
    }

    const downloadProductsJsBtn = document.getElementById('downloadProductsJsBtn');
    if (downloadProductsJsBtn) {
        downloadProductsJsBtn.addEventListener('click', () => {
            const content = generateExportableProductsJs();
            const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('تم تحميل ملف products.js بنجاح! استبدله في مجلد مشروعك ثم ارفعه لـ GitHub 🚀', 'gold');
        });
    }

    const copyProductsJsBtn = document.getElementById('copyProductsJsBtn');
    if (copyProductsJsBtn) {
        copyProductsJsBtn.addEventListener('click', () => {
            const content = generateExportableProductsJs();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(content).then(() => {
                    showToast('تم نسخ كود ملف products.js إلى الحافظة بنجاح!', 'success');
                }).catch(() => {
                    fallbackPromptCopy(content);
                });
            } else {
                fallbackPromptCopy(content);
            }
        });
    }

    function fallbackPromptCopy(text) {
        prompt('انسخ كود ملف products.js أدناه والصقه في ملفك قبل رفعه لـ GitHub:', text);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlmathkoraApp);
} else {
    initAlmathkoraApp();
}
