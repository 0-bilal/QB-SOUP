// إحداثيات مطعم شوربة (مكة - طريق الملك فهد)
const RESTAURANT_LAT = 21.389194; 
const RESTAURANT_LNG = 39.778889;
const MAX_ALLOWED_DISTANCE = 10; // المسافة المسموحة للطلب المباشر (15 كم)



function checkUserDistance() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const distance = calculateHaversineDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    RESTAURANT_LAT,
                    RESTAURANT_LNG
                );

                if (distance > MAX_ALLOWED_DISTANCE) {
                    showLocationWarning(distance.toFixed(1));
                }
            },
            (error) => {
                console.warn("Location access denied or error:", error);
            }
        );
    }
}

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

function showLocationWarning(dist) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalSheet = document.querySelector('.modal-sheet');
    
    // إخفاء المحتويات الحالية داخل المودال (سلة، ساعات العمل، إلخ)
    const views = modalSheet.querySelectorAll('div[id$="-view"], #cart-view');
    views.forEach(v => v.style.display = 'none');

    const warningContent = `
        <div id="distance-warning-view" class="distance-warning">
            <div class="warning-icon">📍</div>
            <h2 data-translate="distance-title">أنت بعيد عن موقعنا</h2>
            <p>
                نعتذر منك، أنت تبعد عن المطعم مسافة <b>${dist} كم</b>. 
                الطلب المباشر متاح فقط للمناطق المحيطة بالمطعم لضمان جودة الطعام.
            </p>
            
            <div class="delivery-option-box">
                <p>لكن لا تقلق! يمكنك الطلب عبر تطبيقات التوصيل:</p>
                <a href="https://hungerstation.com/sa-ar/restaurant/saudi/mecca/kudy/127096" target="_blank" class="primary-btn delivery-btn">
                    اطلب عبر هنقرستيشن
                </a>
            </div>

            <button class="text-btn" onclick="closeModal()">تصفح القائمة فقط</button>
        </div>
    `;

    // إدخال المحتوى في المودال وتفعيله
    let existingWarning = document.getElementById('distance-warning-view');
    if (existingWarning) existingWarning.remove();
    
    modalSheet.insertAdjacentHTML('beforeend', warningContent);
    modalOverlay.classList.add('active');
}

// تشغيل الفحص عند التحميل
window.addEventListener('load', checkUserDistance);