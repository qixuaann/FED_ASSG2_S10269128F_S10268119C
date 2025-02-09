import { fetchPopularListings, setPopularListings } from '../js/firebase.js';  

window.onload = () => {
  setPopularListings();
  
  fetchPopularListings((data) => {
    console.log("fetched data:", data);  
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

    listingItem.addEventListener('click', () => {
      window.location.href = `listings.html?id=${listingId}`;
    });

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
  profileLink.href = "html/profile.html";
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
