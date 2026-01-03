const menuData = [
    { id: 1, name: "شوربة الجريش", price: 15, desc: "شوربة الجريش الشعبية تميزة بالتوابل السعودية ع الدجاج", img: "img/2.png" },
    { id: 2, name: "شوربة الدجاج بالكريمة والذرة", price: 15, desc: "شوربة الدجاج بالذرة والكريمة كما يجب أن تكون", img: "img/1.png" },
    { id: 3, name: "شوربة الحريرة", price: 20, desc: "شوربة الحريرة باللحم البلدي الطازج والحمص والشعيرية بمزيج من البهارات المغربية", img: "img/2.png" },
    { id: 4, name: "الشوربة الرمضانية", price: 20, desc: "شوربة شوفان كويكر الرمضانية باللحم البلدي الطازج والبهارات السعودية", img: "img/4.png" },
    { id: 5, name: "شوربة البيتزا", price: 20, desc: "شوربة الطماطم المشوية مع الريحان والفلفل الرومي والبصل وزيت زيتون بكر", img: "img/1.png" },
    { id: 6, name: "شوربة اللازانيا", price: 25, desc: "شوربة اللازانيا الإيطالية بطعمها الأصيل، مزيج شهي من اللحم المفروم وجبنة الموزاريلا", img: "img/1.png" }
];

let cart = {};

// Initialize Menu
const menuContainer = document.getElementById('menu-container');
menuData.forEach(soup => {
    const card = document.createElement('div');
    card.className = 'soup-card';
    card.innerHTML = `
        <div class="bowl-frame"><img src="${soup.img}" alt="${soup.name}"></div>
        <div class="soup-info">
            <h3>${soup.name}</h3>
            <p>${soup.desc}</p>
            <div class="price-tag">${soup.price} ر.س</div>
            <div class="controls">
                <div class="qty-selector">
                    <button onclick="changeQty(${soup.id}, -1)">-</button>
                    <span id="qty-val-${soup.id}">1</span>
                    <button onclick="changeQty(${soup.id}, 1)">+</button>
                </div>
                <button class="add-btn" onclick="addToCart(${soup.id})">أضف للسلة</button>
            </div>
        </div>
    `;
    menuContainer.appendChild(card);
});

function changeQty(id, delta) {
    const el = document.getElementById(`qty-val-${id}`);
    let current = parseInt(el.innerText) + delta;
    if (current >= 1) el.innerText = current;
}

function addToCart(id) {
    const soup = menuData.find(s => s.id === id);
    const qty = parseInt(document.getElementById(`qty-val-${id}`).innerText);
    
    if (cart[id]) {
        cart[id].qty += qty;
    } else {
        cart[id] = { ...soup, qty };
    }
    
    // Reset quantity selector
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
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartActions = document.getElementById('cart-actions');
    
    const items = Object.values(cart);
    
    if (items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🍲</div>
                <p>سلتك فارغة</p>
                <p class="empty-subtitle">أضف بعض الشوربات اللذيذة!</p>
            </div>
        `;
        cartSummary.style.display = 'none';
        cartActions.style.display = 'none';
        return;
    }
    
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
                    <div class="cart-item-price">${item.price} ر.س × ${item.qty}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-qty-selector">
                        <button onclick="updateCartQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
                <div class="cart-item-total">${itemTotal.toFixed(2)} ر.س</div>
            </div>
        `;
    }).join('');
    
    const vat = subtotal * 0.15;
    const total = subtotal + vat;
    
    document.getElementById('subtotal-amount').innerText = `${subtotal.toFixed(2)} ر.س`;
    document.getElementById('vat-amount').innerText = `${vat.toFixed(2)} ر.س`;
    document.getElementById('total-amount').innerText = `${total.toFixed(2)} ر.س`;
    
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
    let subtotal = 0;
    
    const summaryHTML = items.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `<div class="checkout-item">${item.name} × ${item.qty} <span>${itemTotal.toFixed(2)} ر.س</span></div>`;
    }).join('');
    
    const vat = subtotal * 0.15;
    const total = subtotal + vat;
    
    document.getElementById('checkout-summary').innerHTML = `
        <div class="checkout-box">
            ${summaryHTML}
            <div class="checkout-divider"></div>
            <div class="checkout-item"><strong>المجموع الفرعي</strong> <span>${subtotal.toFixed(2)} ر.س</span></div>
            <div class="checkout-item"><strong>ضريبة القيمة المضافة</strong> <span>${vat.toFixed(2)} ر.س</span></div>
            <div class="checkout-item total"><strong>الإجمالي</strong> <span>${total.toFixed(2)} ر.س</span></div>
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

function processOrder() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
 

    if (!name || !phone ) {
        alert("الرجاء إدخال جميع البيانات المطلوبة");
        return;
    }

    // Simulate success
    const isSuccess = true;

    document.getElementById('checkout-view').style.display = 'none';
    document.getElementById('feedback-view').style.display = 'block';
    document.getElementById('feedback-view').className = isSuccess ? "feedback-view success" : "feedback-view error";

    document.getElementById('status-title').innerText = isSuccess ? "تم تقديم الطلب بنجاح! ✅" : "فشل الطلب";
    document.getElementById('status-msg').innerText = isSuccess 
        ? `شكراً لك ${name}، طلبك قيد التحضير وسيصلك قريباً 🍲`
        : "حدث خطأ في معالجة طلبك، الرجاء المحاولة مرة أخرى";
    
    if (isSuccess) {
        // Clear cart after successful order
        cart = {};
        updateCartCount();
        // Clear form
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-phone').value = '';

    }
}