const initialDefaultProducts = [
    {
        id: "1",
        name: "تمر الفرض العماني",
        description: "من أشهر التمور العمانية، يتميز بلونه الأحمر الداكن وطعمه الأصيل.",
        price: 12,
        image: "images/fard.png",
        isOutOfStock: false
    },
    {
        id: "2",
        name: "تمر النغال العماني",
        description: "أول تباشير القيظ، يتميز بشكله الطويل وحلاوته الخفيفة المفضلة.",
        price: 8,
        image: "images/naghal.png",
        isOutOfStock: false
    },
    {
        id: "3",
        name: "تمر الخلاص العماني",
        description: "الخيار الأول للضيافة، يتميز بلونه الذهبي الفاتح وطعمه الذي يشبه الكراميل.",
        price: 6.5,
        image: "images/khalas.png",
        isOutOfStock: false
    }
];

// Product Data Version - updates whenever file is exported for GitHub
const PRODUCTS_DATA_VERSION = "2026-10-05-v1";

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
