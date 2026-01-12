let cart = {};
let currentLanguage = 'ar';

// Initialize Menu
function initializeMenu() {
    const menuContainer = document.getElementById('menu-container');
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
    let current = parseInt(el.innerText) + delta;
    if (current >= 1) el.innerText = current;
}

function showToast(message) {
    const toast = document.getElementById('custom-toast');
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function addToCart(id) {
    const soup = getProductById(id, currentLanguage);
    const qty = parseInt(document.getElementById(`qty-val-${id}`).innerText);
    
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
    
    document.getElementById(`qty-val-${id}`).innerText = '1';
    
    updateCartCount();
    showCartNotification();
}

function updateCartCount() {
    const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById('cart-count');
    countEl.innerText = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
    
    const fabEl = document.getElementById('cart-fab');
    if (count > 0) {
        fabEl.classList.add('has-items');
    } else {
        fabEl.classList.remove('has-items');
    }
}

function showCartNotification() {
    const fab = document.getElementById('cart-fab');
    fab.classList.add('bounce');
    setTimeout(() => fab.classList.remove('bounce'), 600);
}

function openCart() {
    renderCart();
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('cart-view').style.display = 'block';
    document.getElementById('checkout-view').style.display = 'none';
    document.getElementById('feedback-view').style.display = 'none';
    document.getElementById('working-hours-view').style.display = 'none';
    document.getElementById('contact-view').style.display = 'none';
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartActions = document.getElementById('cart-actions');
    
    const items = Object.values(cart);
    

    cartSummary.style.display = 'block';
    cartActions.style.display = 'block';


    if (items.length === 0) {
        const emptyText = currentLanguage === 'ar' ? 'سلتك فارغة' : 'Your cart is empty';
        const emptySubtext = currentLanguage === 'ar' ? 'أضف بعض الشوربات اللذيذة!' : 'Add some delicious soups!';
        
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🍲</div>
                <p>${emptyText}</p>
                <p class="empty-subtitle">${emptySubtext}</p>
            </div>
        `;
        cartSummary.style.display = 'none';
        cartActions.style.display = 'none';
        return;
    }

        const checkoutBtn = cartActions.querySelector('.primary-btn');
    if (typeof isUserTooFar !== 'undefined' && isUserTooFar) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.background = "#95a5a6"; // لون رمادي للتعطيل
        checkoutBtn.style.cursor = "not-allowed";
        checkoutBtn.innerText = currentLanguage === 'ar' ? "الموقع بعيد جداً للطلب المباشر" : "Location too far for direct order";
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.background = ""; // سيعود للون الأصلي من CSS
        checkoutBtn.innerText = currentLanguage === 'ar' ? "إتمام الطلب" : "Proceed to Checkout";
    }

    
    const currency = currentLanguage === 'ar' ? 'ر.س' : 'SAR';
    const removeText = currentLanguage === 'ar' ? 'حذف' : 'Remove';
    
    let subtotal = 0;
    cartItems.innerHTML = items.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price} ${currency} × ${item.qty}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-qty-selector">
                        <button onclick="updateCartQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">${removeText}</button>
                </div>
                <div class="cart-item-total">${itemTotal.toFixed(2)} ${currency}</div>
            </div>
        `;
    }).join('');
    
    // الحسابات الجديدة: السعر شامل الضريبة
    const total = subtotal;
    const amountBeforeVat = total / 1.15;
    const vat = total - amountBeforeVat;
    
    document.getElementById('subtotal-amount').innerText = `${amountBeforeVat.toFixed(2)} ${currency}`;
    document.getElementById('vat-amount').innerText = `${vat.toFixed(2)} ${currency}`;
    document.getElementById('total-amount').innerText = `${total.toFixed(2)} ${currency}`;
    
    cartSummary.style.display = 'block';
    cartActions.style.display = 'block';
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

function removeFromCart(id) {
    delete cart[id];
    updateCartCount();
    renderCart();
}

function proceedToCheckout() {
    const items = Object.values(cart);
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
    
    document.getElementById('checkout-summary').innerHTML = `
        <div class="checkout-box">
            ${summaryHTML}
            <div class="checkout-divider"></div>
            <div class="checkout-item"><strong>${subtotalLabel}</strong> <span>${amountBeforeVat.toFixed(2)} ${currency}</span></div>
            <div class="checkout-item"><strong>${vatLabel}</strong> <span>${vat.toFixed(2)} ${currency}</span></div>
            <div class="checkout-item total"><strong>${totalLabel}</strong> <span>${total.toFixed(2)} ${currency}</span></div>
        </div>
    `;
    
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'block';
}

function backToCart() {
    document.getElementById('checkout-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Working Hours Modal
function toggleWorkingHours() {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('working-hours-view').style.display = 'block';
    document.getElementById('contact-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'none';
    document.getElementById('feedback-view').style.display = 'none';
}

// Contact Modal
function openContact() {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('contact-view').style.display = 'block';
    document.getElementById('working-hours-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'none';
    document.getElementById('feedback-view').style.display = 'none';
}

// Language Toggle
function toggleLanguage() {
    const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
    currentLanguage = newLang;
    
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    // Save preference
    localStorage.setItem('language', newLang);
    
    // Apply translations
    applyTranslations(newLang);
    
    // Update menu with new language
    initializeMenu();
    
    // Update cart if open
    if (document.getElementById('cart-view').style.display === 'block') {
        renderCart();
    }
    
    // Show notification
    showToast(newLang === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English');
}

// Load saved language on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ar';
    currentLanguage = savedLang;
    
    if (savedLang === 'en') {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        applyTranslations('en');
    }
    
    // Initialize menu after language is set
    initializeMenu();
});

async function processOrder() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    
    const fillFieldsMsg = currentLanguage === 'ar' ? 'الرجاء إدخال جميع البيانات المطلوبة' : 'Please fill in all required fields';
    const invalidPhoneMsg = currentLanguage === 'ar' ? 'يرجى التاكد من صحه رقم الهاتف' : 'Please check phone number validity';
    const sendingMsg = currentLanguage === 'ar' ? 'جاري إرسال الطلب...' : 'Sending order...';
    const confirmMsg = currentLanguage === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm and Send Order';
    const errorMsg = currentLanguage === 'ar' ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.' : 'An error occurred while sending the order, please try again.';
    
    if (!name || !phone) {
        showToast(fillFieldsMsg); 
        return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showToast(invalidPhoneMsg);
        return;
    }

    const orderItems = Object.values(cart).map(item => `${item.name} (${item.qty})`).join('\n');
    const totalAmount = document.getElementById('total-amount').innerText;

    const orderData = {
        name: name,
        phone: phone,
        order: orderItems,
        total: totalAmount
    };

    const btn = document.querySelector('#checkout-view .primary-btn');
    btn.innerText = sendingMsg;
    btn.disabled = true;

    try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyrKS3yMc-huZs-FRdSs23pIwwC3FhId9WbV8xnV8MYq6FSZvezNmMEu9Iu3H7dOP2fAA/exec';
        
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const successTitle = currentLanguage === 'ar' ? 'تم تقديم الطلب بنجاح! ✅' : 'Order placed successfully! ✅';
        const successMsg = currentLanguage === 'ar' ? `شكراً لك ${name}، طلبك قيد التحضير 🍲` : `Thank you ${name}, your order is being prepared 🍲`;

        document.getElementById('checkout-view').style.display = 'none';
        document.getElementById('feedback-view').style.display = 'block';
        document.getElementById('feedback-view').className = "feedback-view success";
        document.getElementById('status-title').innerText = successTitle;
        document.getElementById('status-msg').innerText = successMsg;
        
        cart = {};
        updateCartCount();
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-phone').value = '';

    } catch (error) {
        console.error('Error!', error.message);
        showToast(errorMsg);
        btn.innerText = confirmMsg;
        btn.disabled = false;
    }
}