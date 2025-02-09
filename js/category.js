import { fetchCategoryListings } from "../js/firebase.js";

function getLocalProfileListings() {
  const storedListings = JSON.parse(localStorage.getItem("listings")) || [];
  return storedListings;
}

const renderCategoryPage = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");
   
    const categoryData = await fetchCategoryListings(categoryName);
    // fetch listings from Firebase
    let listings = categoryData ? categoryData.listings : {};

    // fetch local profile listings
    const localListings = getLocalProfileListings();
    
    const filteredLocalListings = localListings.filter(
      listing => listing.category === categoryName
    );
    
    filteredLocalListings.forEach((localListing, index) => {
      listings[`local-${index}`] = localListing;
    });
    

    if (categoryData) {
        const banner = document.getElementById("category-banner");
        banner.style.backgroundImage = `url(${categoryData.bgImage})`;
    
        const title = document.getElementById("category-title");
        title.innerText = categoryName;
    
        const listingContainer = document.getElementById("listings-container");
        listingContainer.innerHTML = "";

        const listings = categoryData.listings;

        // select random listings for treasure hunt
        const listingIds = Object.keys(listings);
        const treasureCount = Math.min(3, listingIds.length); // up to 3 treasures
        const treasureIndices = new Set();

        while (treasureIndices.size < treasureCount) {
            treasureIndices.add(Math.floor(Math.random() * listingIds.length));
        }

        for (const listingId in listings) {
            const listing = listings[listingId];
            const isTreasure = treasureIndices.has(listingIds.indexOf(listingId));

            const listingLink = document.createElement('a');
            listingLink.href = `../html/listings.html?id=${listingId}&category=${encodeURIComponent(categoryName)}`;
            
            const listingElement = document.createElement("div");
            listingElement.className = "listing-item";
            if (isTreasure) {
              listingElement.classList.add("treasure");
          }

            listingElement.innerHTML = `
              <img src="${listing.mainImage || listing.imageURL || '/assets/default-image.jpg'}" alt="${listing.title}" />
              <h3>${listing.title}</h3>
              <p>$${listing.price}</p>
            `;
            
            if (isTreasure) {
              const lottiePlayerWrapper = document.createElement("a");
              lottiePlayerWrapper.setAttribute("href", "../html/rewards.html");
              lottiePlayerWrapper.setAttribute("target", "_blank");
              lottiePlayerWrapper.classList.add("tuan");
      
      
              const lottiePlayer = document.createElement("dotlottie-player");
              lottiePlayer.setAttribute("src", "https://lottie.host/e40b6f55-979c-426c-8d8f-3511d48db81f/nZm2cy8K9I.lottie");
              lottiePlayer.setAttribute("background", "transparent");
              lottiePlayer.setAttribute("speed", "1");
              lottiePlayer.setAttribute("style", "width: 50px ; height: 50px;");
              lottiePlayer.setAttribute("loop", "");
              lottiePlayer.setAttribute("autoplay", "");

              lottiePlayerWrapper.appendChild(lottiePlayer);
              listingElement.appendChild(lottiePlayerWrapper);
      
              listingElement.addEventListener("click", () => {
                alert("Congratulations! You've found a Golden Find! Enjoy your reward!");
                const loggedinuser = JSON.parse(localStorage.getItem("loggedInUser")) || { badgesEarned: 0, totalBadges: 20 };
                loggedinuser.badgesEarned += 1;  

                // create new reward
                const newReward = {
                  img: '../assets/badge1.png' || '../assets/badge2.png' || '../assets/badge3.png',
                  title: 'Golden Find!',
                  desc: 'Congratulations! You found a Golden Find!',
                  claimed: false
                };

                // existing rewards from localStorage/create a new array
                let rewardsRecord = JSON.parse(localStorage.getItem('rewardsRecord')) || [];
                rewardsRecord.push(newReward);

                localStorage.setItem('rewardsRecord', JSON.stringify(rewardsRecord));
                localStorage.setItem('loggedInUser', JSON.stringify(loggedinuser));
                window.location.href = 'rewards.html';
              });
            }

          listingLink.appendChild(listingElement);
          listingContainer.appendChild(listingLink);

          }
        } else {
          console.error("Category data not found.");      
    }
};

renderCategoryPage();

document.addEventListener('DOMContentLoaded', () => {
  console.log("gameConsole.js loaded and DOM ready.");
  if (typeof categoryData === 'undefined') {
    console.error("categoryData is not defined.");
    return;
  }
  const banner = document.getElementById("category-banner");
  if (banner) {
    banner.style.backgroundImage = `url(${categoryData.bgImage})`;
  } else {
    console.warn("category-banner element not found.");
  }
  
  const title = document.getElementById("category-title");
  if (title) {
    title.innerText = categoryName;
  }
  
  const listingContainer = document.getElementById("listings-container");
  if (!listingContainer) {
    console.error("listings-container element not found.");
    return;
  }
  listingContainer.innerHTML = "";
  
  const listings = categoryData.listings;
  const listingIds = Object.keys(listings);
  const treasureCount = Math.min(3, listingIds.length);
  const treasureIndices = new Set();
  
  while (treasureIndices.size < treasureCount) {
    treasureIndices.add(Math.floor(Math.random() * listingIds.length));
  }
  
  for (const listingId in listings) {
    const listing = listings[listingId];
    const isTreasure = treasureIndices.has(listingIds.indexOf(listingId));
  
    const listingLink = document.createElement('a');
    listingLink.href = `html/listings.html?id=${listingId}&category=${encodeURIComponent(categoryName)}`;
    
    const listingElement = document.createElement("div");
    listingElement.className = "listing-item";
    if (isTreasure) {
      listingElement.classList.add("treasure");
    }
  
    listingElement.innerHTML = `
      <img src="${listing.mainImage || listing.imageURL || '/assets/default-image.jpg'}" alt="${listing.title}" />
      <h3>${listing.title}</h3>
      <p>$${listing.price}</p>
    `;
  
    if (isTreasure) {
      const lottiePlayerWrapper = document.createElement("a");
      lottiePlayerWrapper.setAttribute("href", "#"); // Prevent navigation
      lottiePlayerWrapper.classList.add("tuan");
  
      const lottiePlayer = document.createElement("dotlottie-player");
      lottiePlayer.setAttribute("src", "https://lottie.host/e40b6f55-979c-426c-8d8f-3511d48db81f/nZm2cy8K9I.lottie");
      lottiePlayer.setAttribute("background", "transparent");
      lottiePlayer.setAttribute("speed", "1");
      lottiePlayer.setAttribute("style", "width: 50px; height: 50px;");
      lottiePlayer.setAttribute("loop", "");
      lottiePlayer.setAttribute("autoplay", "");
  
      lottiePlayerWrapper.appendChild(lottiePlayer);
      listingElement.appendChild(lottiePlayerWrapper);
  
      listingElement.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Congratulations! You've found a Golden Find! Enjoy your reward!");
        if (typeof window.addNewVoucher === 'function') {
          console.log("Calling addNewVoucher() from gameConsole.js.");
          window.addNewVoucher();
        } else {
          console.error("addNewVoucher() is not defined.");
        }
      });
    }
  
    listingLink.appendChild(listingElement);
    listingContainer.appendChild(listingLink);
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

