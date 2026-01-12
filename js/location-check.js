// إحداثيات الكعكية - مكة المكرمة
const RESTAURANT_LAT = 21.389659317435278; 
const RESTAURANT_LNG = 39.77928169205786;
const MAX_ALLOWED_DISTANCE = 1; 
let isUserTooFar = false; // متغير عالمي للتحقق من الحالة


// استبدال getCurrentPosition بـ watchPosition للمراقبة المستمرة
function startLocationWatch() {
    if (navigator.geolocation) {
        // watchPosition تراقب حركة العميل وتحدث الحالة تلقائياً
        navigator.geolocation.watchPosition(
            (position) => {
                const distance = calculateHaversineDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    RESTAURANT_LAT,
                    RESTAURANT_LNG
                );

                if (distance > MAX_ALLOWED_DISTANCE) {
                    isUserTooFar = true;
                    // نظهر التنبيه فقط إذا لم يكن ظاهراً مسبقاً
                    if (!document.getElementById('distance-warning-view')) {
                        showLocationWarning(distance.toFixed(1));
                    }
                } else {
                    // إذا أصبح العميل قريباً، نقوم بتفعيل الأزرار فوراً
                    isUserTooFar = false;
                    const warning = document.getElementById('distance-warning-view');
                    if (warning) {
                        warning.remove(); // إزالة رسالة التحذير تلقائياً
                        closeModal(); // إغلاق النافذة المنبثقة
                    }
                }
                
                // تحديث السلة فوراً إذا كانت مفتوحة ليعرف العميل أن الزر تفعّل
                if (typeof renderCart === 'function') {
                    const cartView = document.getElementById('cart-view');
                    if (cartView && cartView.style.display !== 'none') {
                        renderCart();
                    }
                }
            },
            (error) => { console.warn("Location error:", error); },
            {
                enableHighAccuracy: true, // طلب دقة عالية
                timeout: 5000,
                maximumAge: 0
            }
        );
    }
}

// تغيير الاستدعاء عند تحميل الصفحة
window.addEventListener('load', startLocationWatch);

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function showLocationWarning(dist) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalSheet = document.querySelector('.modal-sheet');
    
    const views = modalSheet.querySelectorAll('div[id$="-view"], #cart-view');
    views.forEach(v => v.style.display = 'none');

    const warningContent = `
        <div id="distance-warning-view" class="distance-warning">
            <div class="warning-icon">📍</div>
            <h2 style="color: #e74c3c;">أنت خارج نطاق الطلب المباشر</h2>
            <p>أنت تبعد عن مطعمنا مسافة <b>${dist} كم</b>. يمكنك تصفح المنيو، ولكن للطلب يرجى استخدام تطبيقات التوصيل.</p>
            <div class="delivery-option-box">
                <a href="https://hungerstation.com/sa-ar/restaurant/saudi/mecca/kudy/127096" target="_blank" class="primary-btn delivery-btn" style="text-decoration: none; display: block;">
                    اطلب الآن عبر هنقرستيشن
                </a>
            </div>
            <button class="text-btn" onclick="closeModal()">تصفح المنيو فقط</button>
        </div>
    `;

    let existingWarning = document.getElementById('distance-warning-view');
    if (existingWarning) existingWarning.remove();
    
    modalSheet.insertAdjacentHTML('beforeend', warningContent);
    modalOverlay.classList.add('active');
}

window.addEventListener('load', checkUserDistance);