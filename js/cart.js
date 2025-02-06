document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-container");
    const cartItemsContainer = document.getElementById("cart-items"); 
    const checkoutButton = document.getElementById("checkout-btn");

    if (!cartContainer || !cartItemsContainer || !checkoutButton) {
        console.error("One or more elements (cart-container, cart-items, or checkout-btn) are missing from the DOM.");
        return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const cart = JSON.parse(localStorage.getItem(`cart_${currentUser?.Username}`)) || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <p class="indication">You don't have any items in your cart.</p>
                <a href="home.html" class="home">
                    <button class="shopping-btn">Start Shopping</button>
                </a>
            `;
        } else {
            const cartItemsHTML = cart.map((item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price * item.quantity}</p>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            `).join("");

            cartItemsContainer.innerHTML = cartItemsHTML;

            document.querySelectorAll(".remove-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const productId = event.target.dataset.id;
                    const updatedCart = cart.filter(item => item.id !== productId);
                    localStorage.setItem(`cart_${currentUser.Username}`, JSON.stringify(updatedCart));
                    location.reload(); // refresh cart page
                });
            });

            checkoutButton.textContent = "Proceed to Checkout";
            checkoutButton.classList.add("checkout-btn");
            checkoutButton.addEventListener("click", () => {
                alert("Proceeding to checkout...");
            });
        }
    } else {
        cartContainer.innerHTML = `
            <p class="indication">You don't have any items in your cart.</p>
            <p>Have an account? Sign in to see your items.</p>
            <div class="buttons">
                <a href="home.html" class="home">
                    <button class="shopping-btn">Start Shopping</button>
                </a>
                <a href="login.html" class="login">
                    <button class="login-btn"><strong>Sign in</strong></button>
                </a>
            </div>
        `;
    }
});
