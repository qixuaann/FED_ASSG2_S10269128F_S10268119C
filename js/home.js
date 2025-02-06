import { fetchPopularListings, setPopularListings } from '../js/firebase.js';  

window.onload = () => {
    setPopularListings();
    
    fetchPopularListings((data) => {
        console.log("Fetched data:", data);  
    });
};

fetchPopularListings((listings) => {
    const listingsContainer = document.getElementById('listings-container');
    // listingsContainer.innerHTML = '';
    
    // loop thru listings and generate html for each
    for (const listingId in listings) {
      const listing = listings[listingId];

      // create listing
      const listingItem = document.createElement('div');
      listingItem.classList.add('listing-item');  // from css
      // store
      listingItem.dataset.id = listingId;
      listingItem.dataset.category = listing.category;

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

      const chatButton = document.createElement('h4');
      chatButton.classList.add("chat");
      chatButton.href = `chat.html?category=${encodeURIComponent(listing.category)}&id=${encodeURIComponent(listingId)}`;
      chatButton.innerHTML = `<button class="chat-btn">Chat here</button>`;
      listingContent.appendChild(chatButton);

      listingItem.addEventListener('click', () => {
          window.location.href = `listings.html?id=${listingId}`;
      });

      listingItem.appendChild(listingContent);
      listingsContainer.appendChild(listingItem);
    }
});

