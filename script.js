// انتظار تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    
    // تهيئة المتغيرات
    let cart = {
        productId: '1234',
        productName: 'ساعة يد فاخرة',
        unitPrice: 4500,
        quantity: 1,
        delivery: 300
    };

    // تهيئة Swiper
    initSwiper();
    
    // تهيئة الأحداث
    initEventListeners();
    
    // تهيئة تأثيرات التمرير
    initScrollAnimations();
    
    // تهيئة الزر العائم
    initFloatingButton();
    
    // تهيئة حساب السعر
    initPriceCalculator();
    
    // تهيئة مودال الصور
    initImageModal();
    
    // تهيئة القائمة المنسدلة
    initMobileMenu();

    // تهيئة Swiper للمعرض
    function initSwiper() {
        const swiper = new Swiper('.swiper', {
            // الإعدادات الأساسية
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 1,
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            
            // التنقل
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // النقاط
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // تأثيرات الانتقال
            speed: 600,
            
            // الاستجابة
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 40
                }
            }
        });
    }

    // تهيئة مستمعي الأحداث
    function initEventListeners() {
        // زر الشراء العائم
        const floatingBtn = document.querySelector('.floating-btn');
        if (floatingBtn) {
            floatingBtn.addEventListener('click', () => {
                scrollToOrderForm();
            });
        }
        
        // نموذج الطلب
        const orderForm = document.getElementById('productOrderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', handleOrderSubmit);
        }
        
        // حقل الكمية
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', updatePriceCalculator);
        }
        
        // حقل التوصيل
        const deliveryInput = document.getElementById('delivery');
        if (deliveryInput) {
            deliveryInput.addEventListener('input', updatePriceCalculator);
        }
        
        // حقل الولاية
        const wilayaSelect = document.getElementById('wilaya');
        if (wilayaSelect) {
            wilayaSelect.addEventListener('change', updateDeliveryPrice);
        }
    }

    // تهيئة تأثيرات التمرير
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // إضافة كلاس fade-in للعناصر
        const animatedElements = document.querySelectorAll('#product-overview, #product-details, #store-services, #order-form');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // تهيئة الزر العائم
    function initFloatingButton() {
        // إنشاء الزر العائم
        const floatingBtn = document.createElement('button');
        floatingBtn.className = 'floating-btn';
        floatingBtn.innerHTML = '🛒 اطلب الآن';
        floatingBtn.onclick = scrollToOrderForm;
        document.body.appendChild(floatingBtn);
        
        // تأثير النقر
        floatingBtn.addEventListener('click', function() {
            this.style.transform = 'translateX(-50%) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateX(-50%) scale(1)';
            }, 150);
        });
    }

    // تهيئة حساب السعر
    function initPriceCalculator() {
        createPriceCalculator();
        updatePriceCalculator();
    }

    // إنشاء حاسبة السعر
    function createPriceCalculator() {
        const orderForm = document.getElementById('order-form');
        if (!orderForm) return;
        
        const calculatorHTML = `
            <div class="price-calculator">
                <h4 style="margin-bottom: 1rem; color: var(--accent-color);">💰 حساب السعر</h4>
                <div class="price-row">
                    <span>سعر الوحدة:</span>
                    <span id="unit-price">${cart.unitPrice} دج</span>
                </div>
                <div class="price-row">
                    <span>الكمية:</span>
                    <span id="quantity-display">${cart.quantity}</span>
                </div>
                <div class="price-row">
                    <span>المجموع الفرعي:</span>
                    <span id="subtotal">${cart.unitPrice * cart.quantity} دج</span>
                </div>
                <div class="price-row">
                    <span>التوصيل:</span>
                    <span id="delivery-price">${cart.delivery} دج</span>
                </div>
                <div class="price-row price-total">
                    <span>الإجمالي:</span>
                    <span id="total-price">${cart.unitPrice * cart.quantity + cart.delivery} دج</span>
                </div>
            </div>
        `;
        
        const deliveryInput = document.getElementById('delivery');
        if (deliveryInput) {
            deliveryInput.parentNode.insertAdjacentHTML('afterend', calculatorHTML);
        }
    }

    // تحديث حساب السعر
    function updatePriceCalculator() {
        const quantity = parseInt(document.getElementById('quantity')?.value || 1);
        const delivery = parseInt(document.getElementById('delivery')?.value || 300);
        
        cart.quantity = quantity;
        cart.delivery = delivery;
        
        const subtotal = cart.unitPrice * quantity;
        const total = subtotal + delivery;
        
        // تحديث العرض
        updateElement('quantity-display', quantity);
        updateElement('subtotal', `${subtotal} دج`);
        updateElement('delivery-price', `${delivery} دج`);
        updateElement('total-price', `${total} دج`);
        
        // تأثير بصري
        const totalElement = document.getElementById('total-price');
        if (totalElement) {
            totalElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                totalElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // تحديث سعر التوصيل حسب الولاية
    function updateDeliveryPrice() {
        const wilaya = document.getElementById('wilaya')?.value;
        let deliveryPrice = 300; // السعر الافتراضي
        
        // يمكن إضافة منطق تسعير مختلف حسب الولاية هنا
        
        const deliveryInput = document.getElementById('delivery');
        if (deliveryInput) {
            deliveryInput.value = deliveryPrice;
            updatePriceCalculator();
        }
    }

    // تهيئة مودال الصور
    function initImageModal() {
        // إنشاء مودال الصور
        const modalHTML = `
            <div class="image-modal" id="imageModal">
                <span class="close" onclick="closeImageModal()">&times;</span>
                <img id="modalImage" src="" alt="صورة مكبرة">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // إضافة أحداث النقر على الصور
        document.querySelectorAll('.swiper-slide img').forEach(img => {
            img.addEventListener('click', () => {
                openImageModal(img.src);
            });
        });
    }

    // فتح مودال الصور
    function openImageModal(src) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // إغلاق مودال الصور
    window.closeImageModal = function() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    // تهيئة القائمة المنسدلة للهواتف
    function initMobileMenu() {
        const hamburgerHTML = `
            <button class="hamburger" onclick="toggleMobileMenu()">
                <span>☰</span>
            </button>
            <div class="mobile-menu" id="mobileMenu">
                <button class="hamburger" onclick="toggleMobileMenu()" style="right: 1rem; left: auto;">
                    <span>✕</span>
                </button>
                <div style="margin-top: 4rem;">
                    <h2 style="color: white; text-align: center; margin-bottom: 2rem;">🕒 متجر أناقتك</h2>
                    <nav style="text-align: center;">
                        <a href="store.html" style="display: block; margin: 1rem 0; font-size: 1.2rem;">جميع المنتجات</a>
                        <a href="#product-overview" onclick="toggleMobileMenu()" style="display: block; margin: 1rem 0; font-size: 1.2rem;">المنتج</a>
                        <a href="#order-form" onclick="toggleMobileMenu()" style="display: block; margin: 1rem 0; font-size: 1.2rem;">الطلب</a>
                    </nav>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', hamburgerHTML);
    }

    // تبديل القائمة المنسدلة
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        }
    };

    // التمرير إلى نموذج الطلب
    function scrollToOrderForm() {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // تأثير بصري
            orderForm.style.transform = 'scale(1.02)';
            setTimeout(() => {
                orderForm.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // معالجة إرسال الطلب
    function handleOrderSubmit(event) {
        event.preventDefault();
        
        // جمع بيانات النموذج
        const formData = new FormData(event.target);
        const orderData = {
            productId: formData.get('product_id'),
            productName: formData.get('product_name'),
            unitPrice: parseInt(formData.get('unit_price')),
            quantity: parseInt(formData.get('quantity')),
            fullname: formData.get('fullname'),
            phone: formData.get('phone'),
            wilaya: formData.get('wilaya'),
            commune: formData.get('commune'),
            delivery: parseInt(formData.get('delivery')),
            total: (parseInt(formData.get('unit_price')) * parseInt(formData.get('quantity'))) + parseInt(formData.get('delivery'))
        };
        
        // التحقق من صحة البيانات
        if (!validateOrderData(orderData)) {
            return;
        }
        
        // إظهار رسالة التحميل
        showLoadingMessage();
        
        // محاكاة إرسال الطلب
        setTimeout(() => {
            hideLoadingMessage();
            showOrderConfirmation(orderData);
        }, 2000);
    }

    // التحقق من صحة البيانات
    function validateOrderData(data) {
        const errors = [];
        
        if (!data.fullname || data.fullname.trim().length < 2) {
            errors.push('الاسم الكامل مطلوب (حرفين على الأقل)');
        }
        
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('رقم الهاتف مطلوب (10 أرقام على الأقل)');
        }
        
        if (!data.wilaya || data.wilaya.trim().length < 2) {
            errors.push('الولاية مطلوبة');
        }
        
        if (!data.commune || data.commune.trim().length < 2) {
            errors.push('البلدية مطلوبة');
        }
        
        if (data.quantity < 1 || data.quantity > 10) {
            errors.push('الكمية يجب أن تكون بين 1 و 10');
        }
        
        if (errors.length > 0) {
            showNotification('خطأ في البيانات:\n' + errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    }

    // إظهار رسالة التحميل
    function showLoadingMessage() {
        const loadingHTML = `
            <div class="loading-overlay" id="loadingOverlay">
                <div class="loading-content">
                    <div class="spinner"></div>
                    <p>جارٍ معالجة طلبك...</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        
        // إضافة CSS للتحميل
        const loadingCSS = `
            <style>
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                }
                .loading-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', loadingCSS);
    }

    // إخفاء رسالة التحميل
    function hideLoadingMessage() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    // إظهار تأكيد الطلب
    function showOrderConfirmation(orderData) {
        const confirmationHTML = `
            <div class="order-confirmation" id="orderConfirmation">
                <div class="confirmation-content">
                    <button class="close-confirmation" onclick="closeOrderConfirmation()">×</button>
                    <div class="confirmation-header">
                        <div class="success-icon">✅</div>
                        <h2>تم استلام طلبك بنجاح!</h2>
                        <p>سيتم التواصل معك قريباً لتأكيد الطلب</p>
                    </div>
                    
                    <div class="invoice">
                        <h3>🧾 فاتورة الطلب</h3>
                        <div class="invoice-details">
                            <div class="invoice-row">
                                <span>رقم الطلب:</span>
                                <span>#${generateOrderNumber()}</span>
                            </div>
                            <div class="invoice-row">
                                <span>التاريخ:</span>
                                <span>${new Date().toLocaleDateString('ar-DZ')}</span>
                            </div>
                            <div class="invoice-row">
                                <span>الوقت:</span>
                                <span>${new Date().toLocaleTimeString('ar-DZ')}</span>
                            </div>
                            <hr>
                            <div class="invoice-row">
                                <span>المنتج:</span>
                                <span>${orderData.productName}</span>
                            </div>
                            <div class="invoice-row">
                                <span>سعر الوحدة:</span>
                                <span>${orderData.unitPrice} دج</span>
                            </div>
                            <div class="invoice-row">
                                <span>الكمية:</span>
                                <span>${orderData.quantity}</span>
                            </div>
                            <div class="invoice-row">
                                <span>المجموع الفرعي:</span>
                                <span>${orderData.unitPrice * orderData.quantity} دج</span>
                            </div>
                            <div class="invoice-row">
                                <span>التوصيل:</span>
                                <span>${orderData.delivery} دج</span>
                            </div>
                            <hr>
                            <div class="invoice-row total-row">
                                <span>الإجمالي:</span>
                                <span>${orderData.total} دج</span>
                            </div>
                        </div>
                        
                        <div class="customer-info">
                            <h4>📋 معلومات العميل</h4>
                            <div class="customer-details">
                                <p><strong>الاسم:</strong> ${orderData.fullname}</p>
                                <p><strong>الهاتف:</strong> ${orderData.phone}</p>
                                <p><strong>الولاية:</strong> ${orderData.wilaya}</p>
                                <p><strong>البلدية:</strong> ${orderData.commune}</p>
                            </div>
                        </div>
                        
                        <div class="next-steps">
                            <h4>📞 الخطوات التالية</h4>
                            <ul>
                                <li>✅ سيتم التواصل معك خلال 24 ساعة</li>
                                <li>✅ مراجعة تفاصيل الطلب معك</li>
                                <li>✅ تأكيد عنوان التوصيل</li>
                                <li>✅ التوصيل خلال 48 ساعة</li>
                                <li>✅ الدفع عند الاستلام</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="confirmation-actions">
                        <button class="print-btn" onclick="printInvoice()">🖨️ طباعة الفاتورة</button>
                        <button class="new-order-btn" onclick="closeOrderConfirmation()">طلب جديد</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
        
        // إضافة CSS للتأكيد
        addConfirmationStyles();
        
        // إظهار الإشعار
        showNotification('تم إرسال طلبك بنجاح! 🎉', 'success');
        
        // تفريغ النموذج
        document.getElementById('productOrderForm').reset();
        updatePriceCalculator();
    }

    // إضافة أنماط تأكيد الطلب
    function addConfirmationStyles() {
        const confirmationCSS = `
            <style>
                .order-confirmation {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease;
                }
                
                .confirmation-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .close-confirmation {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #999;
                    z-index: 1;
                }
                
                .close-confirmation:hover {
                    color: var(--primary-color);
                }
                
                .confirmation-header {
                    text-align: center;
                    padding: 2rem;
                    background: var(--gradient);
                    color: white;
                    border-radius: 15px 15px 0 0;
                }
                
                .success-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                
                .confirmation-header h2 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                }
                
                .invoice {
                    padding: 2rem;
                }
                
                .invoice h3 {
                    color: var(--accent-color);
                    margin-bottom: 1rem;
                    text-align: center;
                    font-size: 1.5rem;
                }
                
                .invoice-details {
                    background: var(--bg-light);
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                }
                
                .invoice-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                }
                
                .total-row {
                    font-weight: 700;
                    font-size: 1.2rem;
                    color: var(--primary-color);
                    margin-top: 0.5rem;
                }
                
                .customer-info,
                .next-steps {
                    margin-bottom: 1.5rem;
                }
                
                .customer-info h4,
                .next-steps h4 {
                    color: var(--accent-color);
                    margin-bottom: 1rem;
                }
                
                .customer-details {
                    background: var(--bg-light);
                    padding: 1rem;
                    border-radius: 8px;
                }
                
                .customer-details p {
                    margin-bottom: 0.5rem;
                }
                
                .next-steps ul {
                    list-style: none;
                    padding: 0;
                }
                
                .next-steps li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .confirmation-actions {
                    display: flex;
                    gap: 1rem;
                    padding: 0 2rem 2rem;
                }
                
                .print-btn,
                .new-order-btn {
                    flex: 1;
                    padding: 1rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .print-btn {
                    background: var(--accent-color);
                    color: white;
                }
                
                .new-order-btn {
                    background: var(--primary-color);
                    color: white;
                }
                
                .print-btn:hover,
                .new-order-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow);
                }
                
                @media (max-width: 768px) {
                    .confirmation-content {
                        margin: 1rem;
                        max-height: 95vh;
                    }
                    
                    .confirmation-header {
                        padding: 1.5rem;
                    }
                    
                    .invoice {
                        padding: 1.5rem;
                    }
                    
                    .confirmation-actions {
                        flex-direction: column;
                        padding: 0 1.5rem 1.5rem;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', confirmationCSS);
    }

    // إغلاق تأكيد الطلب
    window.closeOrderConfirmation = function() {
        const confirmation = document.getElementById('orderConfirmation');
        if (confirmation) {
            confirmation.remove();
            document.body.style.overflow = 'auto';
        }
    };

    // طباعة الفاتورة
    window.printInvoice = function() {
        const invoice = document.querySelector('.invoice').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>فاتورة الطلب</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .invoice-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    hr { margin: 10px 0; }
                    .total-row { font-weight: bold; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <h1>متجر أناقتك</h1>
                ${invoice}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // توليد رقم الطلب
    function generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD${timestamp}${random}`;
    }

    // إظهار الإشعارات
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${getNotificationIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // الحصول على أيقونة الإشعار
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    // تحديث عنصر
    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // تأثيرات إضافية عند التحميل
    window.addEventListener('load', function() {
        // تأثير ترحيب
        setTimeout(() => {
            showNotification('مرحباً بك في متجر أناقتك! 🕒', 'success');
        }, 1000);
        
        // تحديث الوقت كل ثانية (يمكن استخدامها لاحقاً)
        setInterval(updateTime, 1000);
    });

    // تحديث الوقت
    function updateTime() {
        // يمكن إضافة عداد الوقت هنا إذا لزم الأمر
    }

    // تأثيرات الماوس
    document.addEventListener('mousemove', function(e) {
        // يمكن إضافة تأثيرات متقدمة للماوس هنا
    });

    // تأثيرات لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        // إغلاق المودال بالضغط على ESC
        if (e.key === 'Escape') {
            closeImageModal();
            closeOrderConfirmation();
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });

    // تحسين الأداء
    let ticking = false;
    
    function updateScrollEffects() {
        // تأثيرات التمرير المتقدمة
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.parallax');
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

});
