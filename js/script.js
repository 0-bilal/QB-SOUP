let cart = {};
let currentLanguage = 'ar';

// Initialize Menu
function initializeMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;
    menuContainer.innerHTML = ''; // مسح المحتوى القديم
    
    const menuData = getProducts(currentLanguage);
    
    menuData.forEach(soup => {
        const card = document.createElement('div');
        card.className = 'soup-card';
        card.innerHTML = `
            <div class="bowl-frame"><img src="${soup.img}" alt="${soup.name}"></div>
            <div class="soup-info">
                <h3>${soup.name}</h3>
                <p>${soup.desc}</p>
                <div class="controls">
                    <div class="qty-selector">
                        <button onclick="changeQty(${soup.id}, -1)">-</button>
                        <span id="qty-val-${soup.id}">1</span>
                        <button onclick="changeQty(${soup.id}, 1)">+</button>
                    </div>
                    <button class="add-btn" onclick="addToCart(${soup.id})" data-translate="order-btn">${currentLanguage === 'ar' ? 'أطلب' : 'Order'}</button>
                    <div class="price-tag">${soup.price} ${currentLanguage === 'ar' ? 'ريال' : 'SAR'}</div>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

function changeQty(id, delta) {
    const el = document.getElementById(`qty-val-${id}`);
    if (!el) return;
    let current = parseInt(el.innerText) + delta;
    if (current >= 1) el.innerText = current;
}

function showToast(message) {
    const toast = document.getElementById('custom-toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function addToCart(id) {
    // منع الإضافة إذا كان العميل بعيداً
    if (typeof isUserTooFar !== 'undefined' && isUserTooFar) {
        const farMsg = currentLanguage === 'ar' 
            ? 'عذراً، أنت خارج نطاق التوصيل المباشر. يمكنك الطلب عبر هنقرستيشن.' 
            : 'Sorry, you are outside the direct delivery range. Please order via Hungerstation.';
        showToast(farMsg);
        
        if (typeof showLocationWarning === 'function') {
            showLocationWarning(""); 
        }
        return;
    }

    const soup = getProductById(id, currentLanguage);
    const qtyVal = document.getElementById(`qty-val-${id}`);
    if (!qtyVal) return;
    
    const qty = parseInt(qtyVal.innerText);
    
    if (qty <= 0) {
        const message = currentLanguage === 'ar' ? 'يرجى تحديد الكمية أولاً!' : 'Please select quantity first!';
        showToast(message); 
        return;
    }
    
    if (cart[id]) {
        cart[id].qty += qty;
    } else {
        cart[id] = { ...soup, qty };
    }
    
    qtyVal.innerText = '1';
    
    updateCartCount();
    showCartNotification();
}

function updateCartCount() {
    const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById('cart-count');
    const fabEl = document.getElementById('cart-fab');

    if (!countEl || !fabEl) return;

    countEl.innerText = count;
    
    // يظهر الزر فقط إذا كان هناك عناصر والعميل ليس بعيداً
    if (count > 0 && (typeof isUserTooFar !== 'undefined' && !isUserTooFar)) {
        countEl.style.display = 'flex';
        fabEl.style.display = 'flex';
        fabEl.classList.add('has-items');
    } else {
        // إخفاء الزر تماماً إذا كان العميل بعيداً أو السلة فارغة
        countEl.style.display = 'none';
        fabEl.style.display = 'none';
        fabEl.classList.remove('has-items');
    }
}

function showCartNotification() {
    const fab = document.getElementById('cart-fab');
    if (!fab) return;
    fab.classList.add('bounce');
    setTimeout(() => fab.classList.remove('bounce'), 600);
}

function openCart() {
    renderCart();
    const modal = document.getElementById('modal-overlay');
    if (modal) modal.classList.add('active');
    
    const views = ['cart-view', 'checkout-view', 'feedback-view', 'working-hours-view', 'contact-view'];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === 'cart-view') ? 'block' : 'none';
    });
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartSummary = document.getElementById('cart-summary');
    const cartActions = document.getElementById('cart-actions');
    
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    let total = 0;
    const items = Object.values(cart);

    if (items.length === 0) {
        cartItems.innerHTML = `<p style="text-align:center; padding:20px; color:#888;">${currentLanguage === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>`;
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartActions) cartActions.style.display = 'none';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <span>${item.name} (x${item.qty})</span>
                <div class="cart-item-controls">
                    <button onclick="updateCartQty(${item.id}, -1)">-</button>
                    <button onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <span>${(item.price * item.qty).toFixed(2)} ${currentLanguage === 'ar' ? 'ريال' : 'SAR'}</span>
        `;
        cartItems.appendChild(div);
        total += item.price * item.qty;
    });

    cartTotal.innerText = total.toFixed(2);
    if (cartSummary) cartSummary.style.display = 'block';

    if (cartActions) {
        cartActions.style.display = 'block';
        cartActions.innerHTML = ''; 

        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'primary-btn';

        if (typeof isUserTooFar !== 'undefined' && isUserTooFar) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.background = "#95a5a6"; 
            checkoutBtn.style.cursor = "not-allowed";
            checkoutBtn.innerText = currentLanguage === 'ar' ? "الموقع بعيد جداً للطلب المباشر" : "Location too far";
            cartActions.appendChild(checkoutBtn);
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.innerText = currentLanguage === 'ar' ? "إتمام الطلب" : "Proceed to Checkout";
            checkoutBtn.onclick = () => proceedToCheckout();
            cartActions.appendChild(checkoutBtn);
        }

        const backBtn = document.createElement('button');
        backBtn.className = 'text-btn';
        backBtn.style.marginTop = "10px";
        backBtn.innerText = currentLanguage === 'ar' ? "إغلاق السلة" : "Close Cart";
        backBtn.onclick = closeModal;
        cartActions.appendChild(backBtn);
    }
}

function updateCartQty(id, delta) {
    if (cart[id]) {
        cart[id].qty += delta;
        if (cart[id].qty <= 0) {
            delete cart[id];
        }
        updateCartCount();
        renderCart();
    }
}

function proceedToCheckout() {
    const items = Object.values(cart);
    if (items.length === 0) return;

    let total = 0;
    const currency = currentLanguage === 'ar' ? 'ر.س' : 'SAR';
    
    const summaryHTML = items.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `<div class="checkout-item">${item.name} × ${item.qty} <span>${itemTotal.toFixed(2)} ${currency}</span></div>`;
    }).join('');
    
    const amountBeforeVat = total / 1.15;
    const vat = total - amountBeforeVat;
    
    const subtotalLabel = currentLanguage === 'ar' ? 'المجموع (غير شامل الضريبة)' : 'Subtotal (excl. VAT)';
    const vatLabel = currentLanguage === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)';
    const totalLabel = currentLanguage === 'ar' ? 'الإجمالي (شامل الضريبة)' : 'Total (incl. VAT)';
    
    const checkoutSummary = document.getElementById('checkout-summary');
    if (checkoutSummary) {
        checkoutSummary.innerHTML = `
            <div class="checkout-box">
                ${summaryHTML}
                <div class="checkout-divider"></div>
                <div class="checkout-item"><strong>${subtotalLabel}</strong> <span>${amountBeforeVat.toFixed(2)} ${currency}</span></div>
                <div class="checkout-item"><strong>${vatLabel}</strong> <span>${vat.toFixed(2)} ${currency}</span></div>
                <div class="checkout-item total"><strong>${totalLabel}</strong> <span id="total-amount">${total.toFixed(2)}</span> ${currency}</div>
            </div>
        `;
    }
    
    const cv = document.getElementById('cart-view');
    const chv = document.getElementById('checkout-view');
    if (cv) cv.style.display = 'none';
    if (chv) chv.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) modal.classList.remove('active');
}

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ar';
    currentLanguage = savedLang;
    
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    
    if (typeof applyTranslations === 'function') {
        applyTranslations(savedLang);
    }
    
    initializeMenu();
});

async function processOrder() {
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    if (!nameInput || !phoneInput) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    
    if (!name || !phone) {
        showToast(currentLanguage === 'ar' ? 'الرجاء إدخال جميع البيانات المطلوبة' : 'Please fill in all required fields'); 
        return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showToast(currentLanguage === 'ar' ? 'يرجى التاكد من صحه رقم الهاتف' : 'Please check phone number validity');
        return;
    }

    const orderItems = Object.values(cart).map(item => `${item.name} (${item.qty})`).join('\n');
    const totalEl = document.getElementById('total-amount');
    const totalAmount = totalEl ? totalEl.innerText : "0";

    const orderData = { name, phone, order: orderItems, total: totalAmount };

    const btn = document.querySelector('#checkout-view .primary-btn');
    if (btn) {
        btn.innerText = currentLanguage === 'ar' ? 'جاري إرسال الطلب...' : 'Sending order...';
        btn.disabled = true;
    }

    try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyrKS3yMc-huZs-FRdSs23pIwwC3FhId9WbV8xnV8MYq6FSZvezNmMEu9Iu3H7dOP2fAA/exec';
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        document.getElementById('checkout-view').style.display = 'none';
        const fv = document.getElementById('feedback-view');
        if (fv) {
            fv.style.display = 'block';
            fv.className = "feedback-view success";
            document.getElementById('status-title').innerText = currentLanguage === 'ar' ? 'تم تقديم الطلب بنجاح! ✅' : 'Order placed successfully! ✅';
            document.getElementById('status-msg').innerText = currentLanguage === 'ar' ? `شكراً لك ${name}، طلبك قيد التحضير 🍲` : `Thank you ${name}, your order is being prepared 🍲`;
        }
        
        cart = {};
        updateCartCount();
        nameInput.value = '';
        phoneInput.value = '';

    } catch (error) {
        showToast(currentLanguage === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.');
        if (btn) {
            btn.innerText = currentLanguage === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm and Send Order';
            btn.disabled = false;
        }
    }
}