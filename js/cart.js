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
            const cartItemsHTML = cart.map((item) => {
                // remove price symbol
                const validPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
                const itemTotal = (validPrice * item.quantity).toFixed(2); 
                return `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: $${itemTotal}</p>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                `;
            }).join("");
            

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
                    <button id="shopping-btn" class="shopping-btn">Start Shopping</button>
                </a>
                <a href="sign-up.html" class="sign-up">
                    <button id="sign-up-btn" class="sign-up-btn"><strong>Sign in</strong></button>
                </a>
            </div>
        `;
    }
});

// need make it work
document.addEventListener("click", function (event) {
    if (event.target.id === "shopping-btn") {
        window.location.href = "home.html";
    }
    if (event.target.id === "sign-up-btn") {
        window.location.href = "sign-up.html";
    }

});
