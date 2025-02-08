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

            function calculateCartTotal(cart) {
                let subtotal = 0;
                // subtotal
                cart.forEach(item => {
                    const validPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
                    subtotal += validPrice * item.quantity;
                });
              
                const taxRate = 0.1; 
                const tax = subtotal * taxRate;
                const total = subtotal + tax;
              
                return {
                    subtotal: subtotal.toFixed(2),
                    shipping: "Free",
                    tax: tax.toFixed(2),
                    total: total.toFixed(2),
                };
              }
              
            cartItemsContainer.innerHTML = cartItemsHTML;
            const { subtotal, shipping, tax, total } = calculateCartTotal(cart);

            document.getElementById("subtotal").textContent = `$${subtotal}`;
            document.getElementById("shipping").textContent = `${shipping}`;
            document.getElementById("tax").textContent = `$${tax}`;
            document.getElementById("total").textContent = `$${total}`;

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

// dynamic profile
// retrieve the logged-in user details from localstorage.
if (!(JSON.parse(localStorage.getItem("loggedInUser")))) {
    if (signUpButton) signUpButton.style.display = "inline-block";
    if (loginButton) loginButton.style.display = "inline-block";
  
    // Remove any existing profile avatar
    const existingAvatar = document.querySelector(".top-bar .avatar");
    if (existingAvatar) {
      existingAvatar.remove();
    }
    else {
      // Hide Sign Up & Log In buttons
      if (signUpButton) signUpButton.style.display = "none";
      if (loginButton) loginButton.style.display = "none";
    }
  }
  
  const loggedinuser = JSON.parse(localStorage.getItem("loggedInUser")) 
  
  // update the top-right (or top-bar) avatar icon (if the container exists)
  const topBarIcons = document.querySelector('.top-bar .buttons');
  if (topBarIcons) {
    topBarIcons.innerHTML = "";
    const profileLink = document.createElement('a');
    profileLink.href = "profile.html";
    const topRightAvatar = document.createElement("div");
    topRightAvatar.classList.add("avatar");
    topRightAvatar.style.width = "2.1rem";
    topRightAvatar.style.height = "2.1rem";
    topRightAvatar.style.fontSize = "1rem";
    topRightAvatar.style.marginTop = "-1.7rem";
    topRightAvatar.style.marginLeft = "0.7rem";
  
    if (loggedinuser.profilePic) {
      topRightAvatar.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
    }
    profileLink.appendChild(topRightAvatar);
    topBarIcons.appendChild(profileLink);
  }
  