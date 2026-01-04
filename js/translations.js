// Translation data
const translations = {
    ar: {
        // Header
        'header-desc': 'مطاعم شوربة، نحب ونهتم بالشوربة وتفاصيلها. هنا تجد اللذة والقيمة الغذائية في زبدية شوربة',
        
        // Working Hours
        'working-hours-title': 'أوقات العمل',
        'sunday': 'الأحد',
        'monday': 'الإثنين',
        'tuesday': 'الثلاثاء',
        'wednesday': 'الأربعاء',
        'thursday': 'الخميس',
        'friday': 'الجمعة',
        'saturday': 'السبت',
        
        // Contact
        'contact-title': 'تواصل معنا',
        'phone': 'اتصال',
        'whatsapp': 'واتساب',
        'email': 'البريد الإلكتروني',
        'location': 'الموقع',
        'address': 'مكة, طريق الملك فهد',
        'Delivery': 'التوصيل',
        'HungerStation': 'هنقرستيشن',
        
        // Cart
        'cart-title': '🛒 سلة التسوق',
        'empty-cart': 'سلتك فارغة',
        'empty-subtitle': 'أضف بعض الشوربات اللذيذة!',
        'subtotal': 'المجموع الفرعي',
        'vat': 'ضريبة القيمة المضافة (15%)',
        'total': 'الإجمالي',
        'proceed-checkout': 'إتمام الطلب',
        'continue-shopping': 'مواصلة التسوق',
        
        // Checkout
        'back-to-cart': '← العودة للسلة',
        'invoice-details': 'تفاصيل فاتورتك',
        'pickup-info': 'معلومات الاستلام',
        'full-name': 'الاسم الكامل',
        'phone-number': 'رقم الجوال',
        'confirm-order': 'تأكيد وإرسال الطلب',
        'cancel': 'إلغاء',
        
        // Buttons
        'order-btn': 'أطلب',
        'remove': 'حذف',
        'close': 'إغلاق',
        
        // Messages
        'order-success': 'تم تقديم الطلب بنجاح! ✅',
        'order-preparing': 'طلبك قيد التحضير 🍲',
        'back-to-menu': 'العودة إلى القائمة',
        
        // Toasts
        'select-quantity': 'يرجى تحديد الكمية أولاً!',
        'fill-all-fields': 'الرجاء إدخال جميع البيانات المطلوبة',
        'invalid-phone': 'يرجى التاكد من صحه رقم الهاتف',
        'order-error': 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.',
        'sending-order': 'جاري إرسال الطلب...',
        
        // Menu Items (يمكن إضافة ترجمة للأصناف هنا)
        'menu-item-1': 'شوربة الجريش',
        'menu-item-1-desc': 'شوربة الجريش الشعبية تميزة بالتوابل السعودية ع الدجاج',
        'menu-item-2': 'شوربة الدجاج بالكريمة والذرة',
        'menu-item-2-desc': 'شوربة الدجاج بالذرة والكريمة كما يجب أن تكون',
        'currency': 'ريال'
    },
    
    en: {
        // Header
        'header-desc': 'Shorba suop— we love soup and care deeply about every detail. Here, you’ll find rich flavor and wholesome nutrition in every bowl of soup.',
        
        // Working Hours
        'working-hours-title': 'Working Hours',
        'sunday': 'Sunday',
        'monday': 'Monday',
        'tuesday': 'Tuesday',
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        
        // Contact
        'contact-title': 'Contact Us',
        'phone': 'Contact',
        'whatsapp': 'WhatsApp',
        'email': 'Email',
        'location': 'Location',
        'address': 'Makkah, King Fahd Road',
        'Delivery': 'Delivery',
        'HungerStation': 'HungerStation',
        
        // Cart
        'cart-title': '🛒 Shopping Cart',
        'empty-cart': 'Your cart is empty',
        'empty-subtitle': 'Add some delicious soups!',
        'subtotal': 'Subtotal',
        'vat': 'VAT (15%)',
        'total': 'Total',
        'proceed-checkout': 'Proceed to Checkout',
        'continue-shopping': 'Continue Shopping',
        
        // Checkout
        'back-to-cart': '← Back to Cart',
        'invoice-details': 'Invoice Details',
        'pickup-info': 'Pickup Information',
        'full-name': 'Full Name',
        'phone-number': 'Phone Number',
        'confirm-order': 'Confirm and Send Order',
        'cancel': 'Cancel',
        
        // Buttons
        'order-btn': 'Order',
        'remove': 'Remove',
        'close': 'Close',
        
        // Messages
        'order-success': 'Order placed successfully! ✅',
        'order-preparing': 'Your order is being prepared 🍲',
        'back-to-menu': 'Back to Menu',
        
        // Toasts
        'select-quantity': 'Please select quantity first!',
        'fill-all-fields': 'Please fill in all required fields',
        'invalid-phone': 'Please check phone number validity',
        'order-error': 'An error occurred while sending the order, please try again.',
        'sending-order': 'Sending order...',
        
        // Menu Items
        'menu-item-1': 'Jareesh Soup',
        'menu-item-1-desc': 'Traditional Jareesh soup with Saudi spices and chicken',
        'menu-item-2': 'Chicken Cream & Corn Soup',
        'menu-item-2-desc': 'Chicken soup with corn and cream as it should be',
        'currency': 'SAR'
    }
};

// Apply translations to the page
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        
        if (translations[lang] && translations[lang][key]) {
            // For input placeholders
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update cart FAB text
    const cartFab = document.querySelector('.cart-fab');
    if (cartFab) {
        const afterContent = lang === 'ar' ? 'عرض سلة الطلبات' : 'View Cart';
        cartFab.setAttribute('data-after', afterContent);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = document.documentElement.lang || 'ar';
    applyTranslations(currentLang);
});