// إحداثيات الكعكية - مكة المكرمة
const RESTAURANT_LAT = 21.389659317435278; 
const RESTAURANT_LNG = 39.77928169205786;
const MAX_ALLOWED_DISTANCE = 10; // المسافة المسموح بها بالكيلومترات
let isUserTooFar = false; // متغير عالمي للتحقق من الحالة

// دالة مراقبة الموقع الجغرافي باستمرار
function startLocationWatch() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const distance = calculateHaversineDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    RESTAURANT_LAT,
                    RESTAURANT_LNG
                );

                const cartFab = document.getElementById('cart-fab');

                if (distance > MAX_ALLOWED_DISTANCE) {
                    isUserTooFar = true;
                    
                    // 1. إخفاء زر السلة العائم فوراً من الشاشة
                    if (cartFab) {
                        cartFab.style.display = 'none'; 
                    }
                    
                    // 2. إغلاق السلة إذا كانت مفتوحة وإظهار التنبيه
                    const modalOverlay = document.getElementById('modal-overlay');
                    if (modalOverlay && modalOverlay.classList.contains('active')) {
                        showLocationWarning(distance.toFixed(1));
                    } else if (!document.getElementById('distance-warning-view')) {
                        // إظهار التنبيه فقط إذا لم يكن ظاهراً مسبقاً
                        showLocationWarning(distance.toFixed(1));
                    }
                } else {
                    isUserTooFar = false;
                    
                    // إظهار زر السلة فقط إذا كان هناك عناصر (يتم التحكم به في updateCartCount)
                    if (typeof updateCartCount === 'function') {
                        updateCartCount();
                    }

                    // إزالة تنبيه المسافة إذا عاد العميل للنطاق المسموح
                    const warning = document.getElementById('distance-warning-view');
                    if (warning) {
                        warning.remove();
                        if (typeof closeModal === 'function') {
                            closeModal();
                        }
                    }
                }

                // تحديث محتوى السلة برمجياً إذا كانت مفتوحة حالياً
                const cartView = document.getElementById('cart-view');
                if (cartView && cartView.style.display === 'block') {
                    if (typeof renderCart === 'function') {
                        renderCart();
                    }
                }
            },
            (error) => { 
                console.warn("Location error:", error); 
            },
            { 
                enableHighAccuracy: true, 
                timeout: 5000, 
                maximumAge: 0 
            }
        );
    }
}

// دالة حساب المسافة بين نقطتين (Haversine formula)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومترات
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// دالة إظهار تنبيه الخروج عن النطاق
function showLocationWarning(dist) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalSheet = document.querySelector('.modal-sheet');
    if (!modalSheet || !modalOverlay) return;

    // إخفاء أي نوافذ أخرى مفتوحة داخل الـ Modal
    const views = modalSheet.querySelectorAll('div[id$="-view"], #cart-view');
    views.forEach(v => v.style.display = 'none');

    const warningContent = `
        <div id="distance-warning-view" class="distance-warning">
            <div class="warning-icon">📍</div>
            <h2 style="color: #e74c3c;">أنت خارج نطاق الطلب المباشر</h2>
            <p>أنت تبعد مسافة <b>${dist} كم</b>. يمكنك تصفح المنيو، وللطلب يرجى استخدام تطبيقات التوصيل.</p>
            <div class="delivery-option-box">
                <a href="https://hungerstation.com/sa-ar/restaurant/saudi/mecca/kudy/127096" target="_blank" class="primary-btn" style="text-decoration:none; display:block; margin:10px 0;">
                    اطلب الآن عبر هنقرستيشن
                </a>
            </div>
            <button class="text-btn" onclick="closeModal()">تصفح المنيو فقط</button>
        </div>
    `;

    // التأكد من عدم تكرار التنبيه
    let existingWarning = document.getElementById('distance-warning-view');
    if (existingWarning) existingWarning.remove();
    
    modalSheet.insertAdjacentHTML('beforeend', warningContent);
    modalOverlay.classList.add('active');
}

// تشغيل المراقبة فور تحميل الصفحة
window.addEventListener('load', startLocationWatch);