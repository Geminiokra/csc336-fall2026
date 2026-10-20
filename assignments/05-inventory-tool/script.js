console.log("script loaded");

// Products data and save to local storage
function getDefaultProducts() {
    return [
  { name: "T-Shirt", price: 9.99, description: "A comfortable cotton t-shirt", image: "https://tse3.mm.bing.net/th/id/OIP.lC7aXOIx9w0ll_2uxTkP3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", category: "clothing" },
  { name: "Jeans", price: 19.99, description: "Stylish denim jeans", image: "https://tse4.mm.bing.net/th/id/OIP.tzZyIWunnORfVTZqk-Fg_wHaJQ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", category: "clothing" },
  { name: "Lord of the Rings", price: 19.99, description: "A fantasy novel by J.R.R. Tolkien", image: "https://m.media-amazon.com/images/I/81nV6x2ey4L._SL1500_.jpg", category: "books" },
  { name: "The Hobbit", price: 14.99, description: "A fantasy novel by J.R.R. Tolkien", image: "https://www.adazing.com/wp-content/uploads/2023/06/the-hobbit-75th-anniversary-edition.jpg", category: "books" },
  { name: "Window Cleaner", price: 7.99, description: "A powerful window cleaner", image: "https://i5.walmartimages.com/seo/Windex-Glass-Cleaner-Original-Blue-Spray-Bottle-26-fl-oz_a6c6e26a-2238-4915-8906-d9f4889e59a5.9919d94c413a58dd866ff333e2164197.jpeg", category: "cleaning" },
  { name: "Bleach", price: 5.99, description: "A strong bleach for tough stains", image: "https://c8.alamy.com/comp/E8PWEB/clorox-concentrated-bleach-E8PWEB.jpg", category: "cleaning" },
];
}

const localStorageKey = "products";

// Save and load products from local storage
function saveProducts() {
    localStorage.setItem(localStorageKey, JSON.stringify(products));
}

function loadProducts() {
    const saved = localStorage.getItem(localStorageKey);
    if (saved === null) {
        return getDefaultProducts();
    }
    const loaded = JSON.parse(saved);
    loaded.forEach((p) => {
        p.selected = false;
    });
    return loaded;
}

let products = loadProducts();
let cart = [];

const productsDiv = document.querySelector("#products");
const cartDiv = document.querySelector("#cart");
const categorySelect = document.querySelector("#category");
const addSelectedButton = document.querySelector("#add-selected");
const resetButton = document.querySelector("#reset-store");
const form = document.querySelector("#add-product-form");
const toggleForm = document.querySelector("#toggle-form");

// Render product card
function renderProducts(products) {
    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.src = products.image;
    image.alt = products.name;
    
    const name = document.createElement("h3");
    name.textContent = products.name;

    const price = document.createElement("p");
    price.textContent = "$" + products.price.toFixed(2);

    const description = document.createElement("p");
    description.textContent = products.description;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!products.selected;
    card.classList.toggle("selected", !!products.selected);
    checkbox.addEventListener("change", function() {
        products.selected = checkbox.checked;
        card.classList.toggle("selected", checkbox.checked);
        updateSelectedButton();
    });

    const button = document.createElement("button");
    button.textContent = "Add to Cart";
    button.addEventListener("click", function() {
        cart.push(products);
        renderCart();
    });
    
    card.append(image, name, price, description, checkbox, button);
    productsDiv.append(card);
}

// Show products based on category
function showProducts() {
    productsDiv.innerHTML = "";

    const visible = products.filter((p) => {
        return categorySelect.value === "all" || p.category === categorySelect.value;
    });

    visible.forEach(renderProducts);
    updateSelectedButton();
}

// Update selected
function updateSelectedButton() {
    const count = products.filter((p) => p.selected).length;
    addSelectedButton.disabled = count === 0;
    if (count === 0) {
        addSelectedButton.textContent = "Add Selected to Cart";
    } else {
        addSelectedButton.textContent = "Add " + count + (count === 1 ? " Item" : " Items") + " to Cart";
    }
}

addSelectedButton.addEventListener("click", function() {
    const selected = products.filter((p) => p.selected);
    selected.forEach((p) => {
        cart.push(p);
        p.selected = false;
    });
    renderCart();
    showProducts();
});

// Render the shopping cart
function renderCart() {
    cartDiv.innerHTML = "<h2>Shopping Cart</h2>";
    if (cart.length === 0) {
        cartDiv.innerHTML += "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((p) => {
        const line = document.createElement("p");
        line.textContent = p.name + " - $" + p.price.toFixed(2);
        cartDiv.append(line);
    });

    const prices = cart.map((p) => p.price);
    let total = 0;
    prices.forEach((price) => (total += price));

    const totalLine = document.createElement("p");
    totalLine.className = "total";
    totalLine.textContent = "Total: $" + total.toFixed(2);
    cartDiv.append(totalLine);
}

// Add new product 
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    let newProduct = {};
    let formData = new FormData(form);
    formData.forEach((value, name) => {
        newProduct[name] = value;
    });
    newProduct.price = Number(newProduct.price);

    const sameName = products.filter((p) => {
        return p.name.toLowerCase() === newProduct.name.toLowerCase();
    });

    if (sameName.length > 0) {
        alert("A product with that name already exists.");
        return;
    }

    products.push(newProduct);
    saveProducts();
    form.reset();
    showProducts();
});

// Reset button functionality
resetButton.addEventListener("click", () => {
    localStorage.removeItem(localStorageKey);
    products = getDefaultProducts();
    cart = [];
    showProducts();
    renderCart();
});

categorySelect.addEventListener("change", showProducts);

toggleForm.addEventListener("click", () => {
    form.classList.toggle("hidden");
    toggleForm.textContent = form.classList.contains("hidden") ? "Add Product" : "Hide Form";
});

showProducts();
renderCart();
