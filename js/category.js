import { fetchCategoryListings } from "../js/firebase.js";

const renderCategoryPage = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("category");
    console.log("Category Name:", categoryName); 

    if (!categoryName) {
        console.error("Category not specified.");
        return;
    }

    const encodedCategoryName = encodeURIComponent(categoryName);  
    console.log("Encoded category name:", encodedCategoryName);

    const categoryData = await fetchCategoryListings(categoryName);
    if (categoryData) {
        const banner = document.getElementById("category-banner");
        banner.style.backgroundImage = `url(${categoryData.bgImage})`;
    
        const title = document.getElementById("category-title");
        title.innerText = categoryName;
    
        const listingContainer = document.getElementById("listings-container");
        listingContainer.innerHTML = "";

        const listings = categoryData.listings;
        for (const listingId in listings) {
            const listing = listings[listingId];
            const listingElement = document.createElement("div");
            listingElement.className = "listing-item";
            listingElement.innerHTML = `
              <img src="${listing.imageURL}" alt="${listing.title}" />
              <h3>${listing.title}</h3>
              <p>$${listing.price}</p>
            `;
            listingContainer.appendChild(listingElement);
          }
        } else {
          console.error("Category data not found.");      
    }
};

renderCategoryPage();