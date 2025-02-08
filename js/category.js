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

    // Fetch local profile listings
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
            listingLink.href = `listings.html?id=${listingId}&category=${encodeURIComponent(categoryName)}`;
            
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
              lottiePlayerWrapper.setAttribute("href", "profile.html");
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