// for tabs (listings,reviews,about)
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        contents.forEach((c) => c.classList.remove('active'));

        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        if (target) {
            document.getElementById(target).classList.add('active');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    displayListings();

    const createListingForm = document.getElementById("create-listing-form");
    const addListingModal = document.getElementById("add-listing-modal");
    const addListingBtn = document.getElementById("add-listing");
    const closeModal = document.getElementById("close-modal");

    addListingBtn.addEventListener("click", () => {
        addListingModal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        addListingModal.classList.add("hidden");
    });

    createListingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("listing-title").value;
        const price = document.getElementById("listing-price").value;
        const description = document.getElementById("listing-description").value;
        const imageFile = document.getElementById("listing-image").files[0];
        const category = document.getElementById("listing-category").value || "Uncategorized";
        const condition = document.getElementById("listing-condition").value || "Unknown";
        const location = document.getElementById("listing-location").value || "Not specified";
        const mailing = document.getElementById("listing-mailing").value || "Not available";

        if (!title || !price || !description || !imageFile) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            const imageURL = reader.result;

            const listingID = Date.now().toString();

            const newListing = {
                id: listingID,
                title,
                price,
                description,
                imageURL,
                category,
                condition,
                location,
                mailing,
                seller: { username: "CurrentUser", profileIcon: "👤", joined: "2025" }, // Example user
                thumbnails: [imageURL], // add thumbnail
                suggestedProducts: [], // now put empty array first
                bumped: "No"
            };

            addLocalListing(newListing);
            displayListings();
            createListingForm.reset();

            addListingModal.classList.add("hidden");
        };

        reader.readAsDataURL(imageFile);
    });
});

// save listing under smae key as `listings.js`
function saveListingsToLocalStorage(listings) {
    localStorage.setItem("listings", JSON.stringify(listings));
}

// load listings from `localStorage`
function loadListingsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("listings")) || [];
}

// add new listing 
function addLocalListing(newListing) {
    const listings = loadListingsFromLocalStorage();
    listings.push(newListing);
    saveListingsToLocalStorage(listings);
}

function displayListings() {
    const listingsContainer = document.getElementById("listings-container");
    listingsContainer.innerHTML = ""; 

    const listings = loadListingsFromLocalStorage();
    if (listings.length === 0) {
        listingsContainer.innerHTML = "<p>No listings available.</p>";
        return;
    }

    listings.forEach(listing => {
        const listingItem = document.createElement("div");
        listingItem.classList.add("listing-item");
        listingItem.dataset.id = listing.id;
        listingItem.dataset.category = listing.category || "Uncategorized";

        const listingImage = document.createElement("img");
        listingImage.src = listing.imageURL || "/assets/default-image.jpg";
        listingImage.alt = listing.title;
        listingItem.appendChild(listingImage);

        const listingContent = document.createElement("div");
        listingContent.classList.add("listing-content");

        const title = document.createElement("h2");
        title.textContent = listing.title;
        listingContent.appendChild(title);

        const category = document.createElement("h4");
        category.textContent = listing.category || "No Category";
        listingContent.appendChild(category);

        const price = document.createElement("h4");
        price.textContent = `$${listing.price}`;
        listingContent.appendChild(price);

        listingItem.addEventListener("click", () => {
            window.location.href = `listings.html?id=${listing.id}`;
        });

        listingItem.appendChild(listingContent);
        listingsContainer.appendChild(listingItem);
    });

    document.getElementById("calculate-listings").innerHTML = `<p>Total Listings: ${listings.length}</p>`;
}
