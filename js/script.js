// add the library for product recco - joyce

// initialize Auth0

// log in

// log out

// display cart items if logged in
async function displayCart() {
    const cartContainer = document.getElementById("cart-container");
    const cartItems = await fetchCartItems();

    if (cartItems.Length === 0) {
        cartContainer.innerHTML = `
            <p>Your cart is empty. Start shopping now!</p>
            <a href="/home.html"><button>Start Shopping</button></a>
        `;
    }
    else {
        let itemsHTML = cartItems.map(item => `
            <div class="cart-item">
                <p><strong>${item.title}</strong></p>
                <p>Price: $${item.price}</p>
            </div>
        `).join('');
        cartContainer.innerHTML = `
            <h2>Items in your cart: ${cartItems.length}</h2>
            <div>${itemsHTML}</div>
            <a href="/checkout.html"><button>Proceed to Checkout</button></a>
        `;
    }
}

// login prompt if users not logged in
function displayLoginPrompt() {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = `
        <p class="indication">You don't have any items in your cart.</p>
        <p>Have an account? Sign in to see your items.</p>
        <div class="buttons">
            <button onclick="login()">Sign In</button>
        </div>
    `;
}

// fetch cart items from the fake api
async function fetchCartItems() {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    return products;
}

// initialize auth0 and check if user is logged in