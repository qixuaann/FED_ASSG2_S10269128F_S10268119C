// for profile listings
import { fetchProfileListings, setProfileListings } from '../js/firebase.js';

window.onload = () => {
    setProfileListings(); // Initialize profile listings
    
    fetchProfileListings((data) => {
        console.log("Fetched profile listings:", data);  
    });
};

fetchProfileListings((listings) => {
    const listingsContainer = document.getElementById('listings-container');
    // calculation logic for number of listings
    const numberOfListings = Object.keys(listings).length;
    document.getElementById("calculate-listings").textContent = `${numberOfListings} listings`;


    for (const listingId in listings) {
        const listing = listings[listingId];

        const listingItem = document.createElement('div');
        listingItem.classList.add('listing-item');  // Using existing CSS class
        listingItem.dataset.id = listingId;
        listingItem.dataset.category = listing.category;

        const listingImage = document.createElement('img');
        listingImage.src = listing.imageURL;
        listingImage.alt = listing.title;
        listingItem.appendChild(listingImage);

        const listingContent = document.createElement('div');
        listingContent.classList.add('listing-content');

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
        chatButton.innerHTML = `<button class="chat-btn">Chat here</button>`;
        chatButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            window.location.href = `chat.html?category=${encodeURIComponent(listing.category)}&id=${encodeURIComponent(listingId)}`;
        });
        listingContent.appendChild(chatButton);

        listingItem.addEventListener('click', () => {
            window.location.href = `listings.html?id=${listingId}`;
        });

        listingItem.appendChild(listingContent);
        listingsContainer.appendChild(listingItem);
    }
});

// for tabs (listings,reviews,about)
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add 'active' to the clicked tab and corresponding content
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        target.classList.add('active');
    });
});
