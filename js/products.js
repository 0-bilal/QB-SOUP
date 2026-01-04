// ملف المنتجات - Products Data
const productsData = {
    ar: [
        {
            id: 1,
            name: "شوربة الجريش",
            desc: "شوربة الجريش الشعبية تميزة بالتوابل السعودية ع الدجاج",
            price: 15,
            img: "img/menu/2.png"
        },
        {
            id: 2,
            name: "شوربة الدجاج بالكريمة والذرة",
            desc: "شوربة الدجاج بالذرة والكريمة كما يجب أن تكون",
            price: 15,
            img: "img/menu/1.png"
        },
        {
            id: 3,
            name: "شوربة الحريرة",
            desc: "شوربة الحريرة باللحم البلدي الطازج والحمص والشعيرية بمزيج من البهارات المغربية",
            price: 20,
            img: "img/menu/2.png"
        },
        {
            id: 4,
            name: "الشوربة الرمضانية",
            desc: "شوربة شوفان كويكر الرمضانية باللحم البلدي الطازج والبهارات السعودية",
            price: 20,
            img: "img/menu/4.png"
        },
        {
            id: 5,
            name: "شوربة البيتزا",
            desc: "شوربة الطماطم المشوية مع الريحان والفلفل الرومي والبصل وزيت زيتون بكر",
            price: 20,
            img: "img/menu/1.png"
        },
        {
            id: 6,
            name: "شوربة اللازانيا",
            desc: "شوربة اللازانيا الإيطالية بطعمها الأصيل، مزيج شهي من اللحم المفروم وجبنة الموزاريلا",
            price: 25,
            img: "img/menu/1.png"
        }
    ],
    
    en: [
        {
            id: 1,
            name: "Jareesh Soup",
            desc: "Traditional Jareesh soup with Saudi spices and chicken",
            price: 15,
            img: "img/menu/2.png"
        },
        {
            id: 2,
            name: "Chicken Cream & Corn Soup",
            desc: "Chicken soup with corn and cream as it should be",
            price: 15,
            img: "img/menu/1.png"
        },
        {
            id: 3,
            name: "Harira Soup",
            desc: "Harira soup with fresh local meat, chickpeas and vermicelli with a blend of Moroccan spices",
            price: 20,
            img: "img/menu/2.png"
        },
        {
            id: 4,
            name: "Ramadan Soup",
            desc: "Quaker oatmeal Ramadan soup with fresh local meat and Saudi spices",
            price: 20,
            img: "img/menu/4.png"
        },
        {
            id: 5,
            name: "Pizza Soup",
            desc: "Roasted tomato soup with basil, bell pepper, onion and virgin olive oil",
            price: 20,
            img: "img/menu/1.png"
        },
        {
            id: 6,
            name: "Lasagna Soup",
            desc: "Italian lasagna soup with its authentic taste, a delicious blend of ground meat and mozzarella cheese",
            price: 25,
            img: "img/menu/1.png"
        }
    ]
};

// دالة للحصول على المنتجات حسب اللغة
function getProducts(lang = 'ar') {
    return productsData[lang] || productsData.ar;
}

// دالة للحصول على منتج واحد بالـ ID
function getProductById(id, lang = 'ar') {
    const products = getProducts(lang);
    return products.find(product => product.id === id);
}