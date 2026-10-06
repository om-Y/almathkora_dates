// ========================================================
// إعدادات سحاب Google Firebase لمتجر المذخورة للتمور العمانية
// ========================================================
// إذا كان لديك مشروع Firebase، ضع المفاتيح هنا، أو يمكنك لصقها
// مباشرة من شاشة الإعدادات داخل الموقع بكل سهولة وسيقوم بحفظها تلقائياً.

const defaultFirebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// استرجاع الإعدادات المحفوظة من المتصفح إن وجدت
function getActiveFirebaseConfig() {
    try {
        const saved = localStorage.getItem('almathkora_firebase_config');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.projectId && parsed.apiKey) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Error reading saved Firebase config:', e);
    }
    return defaultFirebaseConfig;
}

// التحقق هل تم إدخال إعدادات حقيقية
function isFirebaseConfigured(config) {
    return Boolean(config && config.projectId && config.projectId.trim() && config.apiKey && config.apiKey.trim());
}
