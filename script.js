document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    var closeModal = document.getElementsByClassName("close")[0];

    document.querySelectorAll('.product-image').forEach(function (image) {
        image.onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
        }
    });

    closeModal.onclick = function () {
        modal.style.display = "none";
    }

    modal.onclick = function () {
        modal.style.display = "none";
    }
});


let reviewButton = document.querySelector('.review_btn')
let reviewInput = document.querySelector('.review_input')
let reviewCnt = document.querySelector('.comment_cnt')

function addComment(){
    let value = reviewInput.value
    reviewCnt.innerHTML +=`<div class="comment">
                                    <p class="nick">Анонімний користувач</p>
                                    <p>${value}</p>
                            </div>`
    reviewInput.value = ''
}

reviewButton.addEventListener('click', addComment)


// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("store_db.json");
    let products = await response.json();
    return products;
};

// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    // Створюємо JSON-строку з даними про товар і зберігаємо її в data-атрибуті
    let productData = JSON.stringify(product)

    return `
    <div class="product-card my-card">
                <img src="img/${product.image}" alt="Product 1" class="product-image">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p class="price"> ${product.price}</p>
                <button class="add-to-cart cart-btn" data-product='${productData}'>Add to Cart</button>
            </div>
    `;
}

// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.catalog')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.catalog .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})


// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cartBtn');

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('cart.html');
});

// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.cartCounter = document.querySelector('.cart-counter');// отримуємо лічильник кількості товарів у кошику
        this.cartElement = document.querySelector('#cart-items'); 
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }

    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
        } else {
            this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
            this.items[item.title].quantity = 1;
        }
        this.updateCounter(); // Оновлюємо лічильник товарів
        this.saveCartToCookies();
    }

    // Зміна кількості товарів товарів
    updateQuantity(itemTitle, newQuantity) {
        if (this.items[itemTitle]) {
            this.items[itemTitle].quantity = newQuantity;
            if (this.items[itemTitle].quantity == 0) {
                delete this.items[itemTitle];
            }
            this.updateCounter();
            this.saveCartToCookies();
        }
    }

    // Оновлення лічильника товарів
    updateCounter() {
        let count = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            count += this.items[key].quantity; // рахуємо кількість усіх товарів
        }
        this.cartCounter.innerHTML = count; // оновлюємо лічильник на сторінці
    }

    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
            this.updateCounter();
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

// Створення об'єкта кошика 
let cart = new ShoppingCart();


// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);

    // Додаємо товар до кошика
    cart.addItem(product);
    console.log(cart);
}
