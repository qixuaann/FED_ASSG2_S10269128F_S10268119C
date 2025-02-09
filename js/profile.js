// wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // tabs functionality 
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
  
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // remove "active" class from all tabs and contents
        tabs.forEach((t) => t.classList.remove('active'));
        contents.forEach((c) => c.classList.remove('active'));
  
        // activate the clicked tab and its corresponding content
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        if (target) {
          document.getElementById(target).classList.add('active');
        }
      });
    });
  
    // display listings (see the displaylistings() function below)
    displayListings();
  
    // modal elements for creating a listing
    const createListingForm = document.getElementById("create-listing-form");
    const addListingModal = document.getElementById("add-listing-modal");
    const addListingBtn = document.getElementById("add-listing");
    const closeModal = document.getElementById("close-modal");
  
    if (addListingBtn && addListingModal) {
      addListingBtn.addEventListener("click", () => {
        addListingModal.classList.remove("hidden");
      });
    }
    if (closeModal && addListingModal) {
      closeModal.addEventListener("click", () => {
        addListingModal.classList.add("hidden");
      });
    }
  
    // when the form is submitted, create a new listing.
    if (createListingForm) {
      createListingForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        // get form field values
        const title = document.getElementById("listing-title").value;
        const price = document.getElementById("listing-price").value;
        const description = document.getElementById("listing-description").value;
        const fileInput = document.getElementById("listing-image");
        const files = fileInput.files;
  
        // optional fields (use optional chaining to avoid errors if an element isn’t present)
        const category = document.getElementById("listing-category")?.value || "Uncategorized";
        const type = document.getElementById("listing-type")?.value || "None";
        const condition = document.getElementById("listing-condition")?.value || "Unknown";
        const location = document.getElementById("listing-location")?.value || "Not specified";
        const mailing = document.getElementById("listing-mailing")?.value || "Not available";
  
        if (!title || !price || !description || files.length === 0) {
          alert("Please fill in all fields and upload at least one image.");
          return;
        }
  
        // retrieve the logged-in user details from localstorage.
        // if no user is logged in, fallback values are provided.
        const loggedinuser =
          JSON.parse(localStorage.getItem("loggedInUser")) ||
          { username: "currentuser", profilePic: "👤", joined: "2025" };
  
        // convert each uploaded image file to a base64 string.
        const fileReaders = [];
        const imagesArray = [];
        for (let i = 0; i < files.length; i++) {
          fileReaders.push(
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = function () {
                imagesArray.push(reader.result);
                resolve();
              };
              reader.onerror = reject;
              reader.readAsDataURL(files[i]);
            })
          );
        }
  
        // once all images are processed...
        Promise.all(fileReaders)
          .then(() => {
            const listingID = Date.now().toString();
            // use the first image as the main image.
            const newListing = {
              id: listingID,
              title: title,
              price: price.startsWith('$') ? price : `$${price}`,
              description: description,
              mainImage: imagesArray[0],
              thumbnails: imagesArray,
              category: category,
              type: type,
              condition: condition,
              location: location,
              mailing: mailing,
              seller: {
                username: loggedinuser.username,
                profileIcon: loggedinuser.profilePic || "👤",
                joined: loggedinuser.joined || "2025"
              },
              suggestedProducts: [],
              bumped: "no",
              reviews: []
            };
  
            // save the new listing to localstorage and update the ui
            addLocalListing(newListing);
            displayListings();
            createListingForm.reset();
            addListingModal.classList.add("hidden");
          })
          .catch((error) => {
            console.error("Error processing images:", error);
            alert("There was an error processing your images. Please try again.");
          });
      });
    }
  
    // dynamic profile 

    // retrieve the logged-in user details from localstorage.
    const loggedinuser =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      { username: "Guest", profilePic: "Avatar" };
  
    // update the profile card (if the element exists)
    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl && loggedinuser.profilePic) {
      avatarEl.textContent = loggedinuser.username.slice(0, 2).toUpperCase();
    }
    const usernameEl = document.getElementById("user-username");
    if (usernameEl) {
      usernameEl.textContent = "@" + loggedinuser.username;
    }
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
  });
  
  // save listings to localstorage
  function saveListingsToLocalStorage(listings) {
    localStorage.setItem("listings", JSON.stringify(listings));
  }
  
  // load listings from localstorage (or return an empty array if none exist)
  function loadListingsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("listings")) || [];
  }
  
  // add a new listing to localstorage
  function addLocalListing(newListing) {
    const listings = loadListingsFromLocalStorage();
    listings.push(newListing);
    saveListingsToLocalStorage(listings);
  }
  
  // delete a listing by its id and update the display
  function deleteListing(listingId) {
    let listings = loadListingsFromLocalStorage();
    listings = listings.filter(listing => listing.id !== listingId);
    saveListingsToLocalStorage(listings);
    displayListings();
  }
  
  // display listings on the page (only those created by the current user)
  function displayListings() {
    const listingsContainer = document.getElementById("listings-container");
    if (!listingsContainer) return; // exit if no container is found
    listingsContainer.innerHTML = "";
  
    // get the current logged-in user (or a guest fallback)
    const currentUser =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      { username: "guest", profilePic: "avatar" };
  
    // retrieve all listings and then filter to only those created by the current user
    const listings = loadListingsFromLocalStorage();
    const userListings = listings.filter(
      listing => listing.seller && listing.seller.username === currentUser.username
    );
  
    if (userListings.length === 0) {
      listingsContainer.innerHTML = "<p>No listings available.</p>";
      return;
    }
  
    // limit the number of listings shown
    const limitedListings = userListings.slice(0, 30);
  
    limitedListings.forEach(listing => {
      const listingItem = document.createElement("div");
      listingItem.classList.add("listing-item");
      listingItem.dataset.id = listing.id;
      listingItem.dataset.category = listing.category || "Uncategorized";
  
      // create the image element
      const listingImage = document.createElement("img");
      listingImage.src = listing.mainImage || listing.imageURL || "/assets/default-image.png";
      listingImage.alt = listing.title;
      listingItem.appendChild(listingImage);
  
      // create the content container
      const listingContent = document.createElement("div");
      listingContent.classList.add("listing-content");
  
      // title
      const titleEl = document.createElement("h2");
      titleEl.textContent = listing.title;
      listingContent.appendChild(titleEl);
  
      // category
      const categoryEl = document.createElement("h4");
      categoryEl.textContent = listing.category || "No category";
      listingContent.appendChild(categoryEl);
  
      // condition
      const conditionEl = document.createElement("h4");
      conditionEl.innerHTML = `Condition: ${listing.condition || "Unknown"}`;
      listingContent.appendChild(conditionEl);
  
      // price
      const priceEl = document.createElement("h4");
      priceEl.textContent = listing.price;
      listingContent.appendChild(priceEl);
  
      // delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent triggering the listing click event
        if (confirm("Are you sure you want to delete this listing?")) {
          deleteListing(listing.id);
        }
      });
      listingContent.appendChild(deleteBtn);
  
      listingItem.appendChild(listingContent);
  
      // clicking anywhere on the listing redirects to its details page.
      listingItem.addEventListener("click", () => {
        window.location.href = `listings.html?id=${listing.id}`;
      });
  
      listingsContainer.appendChild(listingItem);
    });
  
    // update a counter element if present
    const calculateListings = document.getElementById("calculate-listings");
    if (calculateListings) {
      calculateListings.innerHTML = `<p>Total listings: ${userListings.length}</p>`;
    }
  }
  
// sign out functionality
const signOutBtn = document.getElementById('sign-out-btn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', () => {
    // remove the logged-in user info from localstorage
    localStorage.removeItem('loggedInUser');
    // show a pop-up that sign out was successful
    alert("Signed out successfully. See you soon!");
    // redirect to home.html
    window.location.href = 'index.html';
  });
}
