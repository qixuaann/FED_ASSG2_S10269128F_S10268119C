function loadListingsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("listings")) || [];
}

function populateListingDetails(listing) {
    document.querySelector(".title-section h1").textContent = listing.title;
    document.querySelector(".price").textContent = listing.price;
    document.querySelector(".product-specifics .first-row").innerHTML = `
      <p class="light-text">Condition</p>
      <p>${listing.condition}</p>
      <br>
      <p class="light-text">Type</p>
      <p>${listing.type}</p>
    `;
    document.querySelector(".product-specifics .second-row").innerHTML = `
      <p class="light-text">Bumped</p>
      <p>${listing.bumped}</p>
      <br>
      <p class="light-text">Category</p>
      <p>${listing.category}</p>
    `;
    document.querySelector(".description p").textContent = listing.description;
    const mainImageUrl = listing.mainImage || listing.imageURL || "/assets/default-image.png";

    document.querySelector(".main-image img").src = mainImageUrl;
    
    // thumbnails
    const thumbnailsContainer = document.querySelector(".thumbnails");
    if (Array.isArray(listing.thumbnails) && listing.thumbnails.length > 0) {
        thumbnailsContainer.innerHTML = listing.thumbnails
          .map((src) => `<img src="${src}" alt="Thumbnail">`)
          .join("");
    } else {
      thumbnailsContainer.innerHTML = "";
    }

    // suggested products
    const suggestedProducts = document.querySelector(".suggested-products");
    if (listing.suggestedProducts && listing.suggestedProducts.length > 0)
    suggestedProducts.innerHTML = `
      <h3>Suggested Products</h3>
      ${listing.suggestedProducts
        .map(
          (product) => `
        <div class="product">
          <a href="listings.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}">
              <p>${product.name}</p>
           </a>
        </div>
      `
        )
        .join("")}
    `;
    else {
      suggestedProducts.innerHTML = `
      <h3 style="margin-left: 210px";>Suggested Products</h3>
      <p style="margin-left: 210px;">No suggestions available.</p>
  `;
      }
    
    // deal methods
    document.querySelector("#location").textContent = listing.location;
    document.querySelector("#mailing").textContent = listing.mailing;

    // reviews
    const reviewsSection = document.querySelector(".reviews");
    if (reviewsSection) {
      // empty array as fallback in case listing.reviews is undefined
      const reviewsArray = listing.reviews || [];
      reviewsSection.innerHTML = `
        <h2>Reviews</h2>
        <p class="rating">5.0 ★★★★★ <span>(${reviewsArray.length} reviews)</span></p>
        ${
          reviewsArray.length > 0 
          ? reviewsArray.map(
              (review) => `
                <div class="review">
                  <img src="${review.profileImage}" alt="${review.username} profile">
                  <div class="review-desc">
                    <h4>${review.username}</h4>
                    <p>${review.review}</p>
                  </div>
                </div>
              `
            ).join("")
          : "<p>No reviews yet.</p>"
        }
      `;
    } else {
      console.error("Reviews section not found.");
    }
    
    
    // seller info
    document.querySelector(".profile-icon").textContent = listing.seller.profileIcon;
    document.querySelector(".profile-info strong").textContent = listing.seller.username;
    document.querySelector(".profile-info p").textContent = `Since ${listing.seller.joined}`;
} 

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");
  const category = params.get("category");
 
  try {
    const [listingsResponse, categoryResponse] = await Promise.all([
      fetch("/data/listings.json"),
      fetch("/data/categoryListings.json"),
    ]);

    const [listingsData, categoryData] = await Promise.all([
      listingsResponse.json(),
      categoryResponse.json(),
    ]);

    const localListings = loadListingsFromLocalStorage();
    const localListingsObj = localListings.reduce((acc, listing) => {
      acc[listing.id] = listing;
      return acc;
    }, {});

    // merge data
    const allListings = {
      ...listingsData.listings,
      ...(categoryData.listings[category] || {}),
      ...localListingsObj // include local listings
    };

    let listing;
        if (localListingsObj.hasOwnProperty(listingId)) {
            listing = localListingsObj[listingId];
        } else {
            const mergedRemoteListings = {
                ...listingsData.listings,
                ...(category ? (categoryData.listings[category] || {}) : {}),
            };
            listing = mergedRemoteListings[listingId];
        }


    if (listingId) {
      const listing = allListings[listingId];
      populateListingDetails(listing);

      const chatLink = document.querySelector(".chatlink"); 

      if (chatLink) {
        chatLink.href = `chat.html?category=${encodeURIComponent(listing.category)}&id=${encodeURIComponent(listingId)}`;

        chatLink.addEventListener('click', (event) => {
          event.preventDefault(); 
          window.location.href = chatLink.href; 
        });
      }
      document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const userCart = JSON.parse(localStorage.getItem(`cart_${currentUser.Username}`)) || [];
          
          const itemIndex = userCart.findIndex(item => item.id === listingId);
          if (itemIndex === -1) {
            // remove price symbol
              const validPrice = parseFloat(listing.price.replace(/[^0-9.]/g, '')) || 0;
              userCart.push({ 
                  id: listingId,
                  name: listing.title,
                  price: validPrice,
                  image: listing.mainImage,
                  quantity: 1,
              });
          } else {
              userCart[itemIndex].quantity += 1; 
          }

          localStorage.setItem(`cart_${currentUser.Username}`, JSON.stringify(userCart));
          window.location.href = "cart.html";
        } 
    });
  }
  } catch (error) {
    console.error("Error loading listings:", error);
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

