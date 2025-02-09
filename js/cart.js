// voucher 
// ensure cart is retrieved from localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const cart = currentUser ? JSON.parse(localStorage.getItem(`cart_${currentUser.Username}`)) || [] : [];

function calculateCartTotal(cart) {
    let subtotal = 0;
    cart.forEach(item => {
        const validPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
        subtotal += validPrice * item.quantity;
    });

    const taxRate = 0.1; 
    const tax = subtotal * taxRate;
    let total = subtotal + tax;

    const appliedVoucher = JSON.parse(localStorage.getItem("appliedVoucher"));
    let discount = 0;
    let shipping = "Free"; // Default shipping

    if (appliedVoucher) {
        if (appliedVoucher.title.includes("5% discount")) {
            discount = subtotal * 0.05;
        } else if (appliedVoucher.title.includes("$3 off")) {
            discount = 3;
        } else if (appliedVoucher.title.includes("Free mailing")) {
            shipping = "Free";
        }
        total -= discount;
    }            

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping,
        tax: tax.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
    };
}

function updateCartTotal() {
    const { subtotal, shipping, tax, discount, total } = calculateCartTotal(cart);

    document.getElementById("subtotal").textContent = `$${subtotal}`;
    document.getElementById("shipping").textContent = `${shipping}`;
    document.getElementById("tax").textContent = `$${tax}`;
    document.getElementById("total").textContent = `$${total}`;

    // show or hide the discount row
    if (discount > 0) {
        document.getElementById("discount").textContent = `-$${discount}`;
        document.getElementById("discount-row").style.display = "block";
    } else {
        document.getElementById("discount-row").style.display = "none";
    }
}

// retrieve claimed vouchers
const claimedVouchers = JSON.parse(localStorage.getItem("vouchersClaimed")) || [];

document.getElementById("apply-voucher").addEventListener("click", function () {
    const enteredCode = document.getElementById("voucher-code").value.trim();
    const voucherMessage = document.getElementById("voucher-message");

    // find a matching voucher
    const validVoucher = claimedVouchers.find(voucher => voucher.code === enteredCode);

    if (validVoucher) {
        localStorage.setItem("appliedVoucher", JSON.stringify(validVoucher));
        voucherMessage.textContent = "Voucher applied successfully!";
        voucherMessage.style.color = "green";
        updateCartTotal(); // recalculate cart with discount
    } else {
        voucherMessage.textContent = "Invalid or unclaimed voucher!";
        voucherMessage.style.color = "red";
    }
});

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
        let cart = JSON.parse(localStorage.getItem(`cart_${currentUser?.Username}`)) || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <p class="indication">You don't have any items in your cart.</p>
                <a href="index.html" class="home">
                    <button class="shopping-btn">Start Shopping</button>
                </a>
            `;
        } else {
            const cartItemsHTML = cart.map((item) => {
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
            updateCartTotal(); // ensure totals are updated on load

            document.querySelectorAll(".remove-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const productId = event.target.dataset.id;
                    cart = cart.filter(item => item.id !== productId);
                    localStorage.setItem(`cart_${currentUser.Username}`, JSON.stringify(cart));
                    location.reload(); 
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
                <a href="index.html" class="home">
                    <button id="shopping-btn" class="shopping-btn">Start Shopping</button>
                </a>
                <a href="../html/sign-up.html" class="sign-up">
                    <button id="sign-up-btn" class="sign-up-btn"><strong>Sign in</strong></button>
                </a>
            </div>
        `;
    }
});
document.getElementById("remove-voucher").addEventListener("click", function () {
    localStorage.removeItem("appliedVoucher"); // Remove the applied voucher
    updateCartTotal(); // Recalculate total without discount
    document.getElementById("voucher-message").textContent = "Voucher removed.";
    document.getElementById("voucher-message").style.color = "red";
});

// need make it work
document.addEventListener("click", function (event) {
    if (event.target.id === "shopping-btn") {
        window.location.href = "../index.html";
    }
    if (event.target.id === "sign-up-btn") {
        window.location.href = "../html/sign-up.html";
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
  
