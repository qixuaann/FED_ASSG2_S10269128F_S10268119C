import { fetchPopularListings, setPopularListings } from '../js/firebase.js';  
// import { DotLottie } from '@lottiefiles/dotlottie-web';

// const dotLottie = new DotLottie({
//     autoplay: true,
//     loop: true,
//     canvas: document.querySelector('#dotlottie-canvas'),
//     src: "<https://lottie.host/e40b6f55-979c-426c-8d8f-3511d48db81f/nZm2cy8K9I.lottie>", // my .lottie url
// });

window.onload = () => {
    setPopularListings();
    
    fetchPopularListings((data) => {
        console.log("Fetched data:", data);  
    });
};

fetchPopularListings((listings) => {
    const listingsContainer = document.getElementById('listings-container');
    listingsContainer.innerHTML = '';
    
    // loop thru listings and generate html for each
    for (const listingId in listings) {
      const listing = listings[listingId];

      // create listing
      const listingItem = document.createElement('div');
      listingItem.classList.add('listing-item');  // from css

      // create image
      const listingImage = document.createElement('img');
      listingImage.src = listing.imageURL;
      listingImage.alt = listing.title;
      listingItem.appendChild(listingImage);  // add image

      const listingContent = document.createElement('div');
      listingContent.classList.add('listing-content');  // from css

      const title = document.createElement('h2');
      title.innerHTML = listing.title;
      listingContent.appendChild(title);

      const category = document.createElement('h4');
      category.innerHTML = `${listing.category}`;
      listingContent.appendChild(category);

      const price = document.createElement('h4');
      price.innerHTML = `$${listing.price}`;
      listingContent.appendChild(price);

      listingItem.appendChild(listingContent);

      listingsContainer.appendChild(listingItem);
    }
});

// for users when they click on the categories 
const categoryContainers = document.querySelectorAll(".circle-container");

// event listeners to all circle-container elements
categoryContainers.forEach((container) => {
  container.addEventListener("click", () => {
    const categoryName = container.dataset.category; 
    if (categoryName) {
      window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
    }
  });
});