document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id"); 
    if (!listingId) {
      console.error("No listing ID provided");
      return;
    }
  
    try {
      const response = await fetch("/data/listings.json"); // JSON
      const data = await response.json();
      const listing = data.listings[listingId];
  
      if (!listing) {
        console.error("Listing not found");
        return;
      }
  
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
      document.querySelector(".main-image img").src = listing.mainImage;
  
      // thumbnails
      const thumbnails = document.querySelector(".thumbnails");
      thumbnails.innerHTML = listing.thumbnails
        .map((src) => `<img src="${src}" alt="Thumbnail">`)
        .join("");
  
      // suggested products
      const suggestedProducts = document.querySelector(".suggested-products");
      suggestedProducts.innerHTML = `
        <h3>Suggested Products</h3>
        ${listing.suggestedProducts
          .map(
            (product) => `
          <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
          </div>
        `
          )
          .join("")}
      `;
  
       // deal methods
       document.querySelector("#location").textContent = listing.location;
       document.querySelector("#mailing").textContent = listing.mailing;

      // reviews
      const reviewsSection = document.querySelector(".reviews");
      reviewsSection.innerHTML = `
        <h2>Reviews</h2>
        <p class="rating">5.0 ★★★★★ <span>(${listing.reviews.length} reviews)</span></p>
        ${listing.reviews
          .map(
            (review) => `
          <div class="review">
            <img src="${review.profileImage}" alt="${review.username} profile">
            <div class="review-desc">
              <h4>${review.username}</h4>
              <p>${review.review}</p>
            </div>
          </div>
        `
          )
          .join("")}
      `;
  
      // seller info
      document.querySelector(".profile-icon").textContent = listing.seller.profileIcon;
      document.querySelector(".profile-info strong").textContent = listing.seller.username;
      document.querySelector(".profile-info p").textContent = `Since ${listing.seller.joined}`;
    } catch (error) {
      console.error("Error loading listing data:", error);
    }
  });