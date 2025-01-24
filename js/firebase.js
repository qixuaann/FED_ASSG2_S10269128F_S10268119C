// firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, get, set, serverTimestamp, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyDOC3_0byyuOzV7yuq6TXV7je2Su8MhmJU",
    authDomain: "chat-88aed.firebaseapp.com",
    projectId: "chat-88aed",
    storageBucket: "chat-88aed.firebasestorage.app",
    messagingSenderId: "928601961200",
    appId: "1:928601961200:web:f604d0abce1b783b190835",
    measurementId: "G-EP24FPCDB1",
    databaseURL: "https://chat-88aed-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize Realtime Database 
const database = getDatabase(app);

// home popular listings
const setPopularListings = () => {
    const popularListingsRef = ref(database, 'popularListings');
    set(popularListingsRef, {
      listingID1: {
        title: "Chaps Ralph Lauren Coat Man",
        category: "Men's Fashion",
        price: "80.00",
        imageURL: "/assets/jacket1.jpg"
      },
      listingID2: {
        title: "SEVENTEEN 4th Album Repackage 'SECTOR 17'",
        price: "28.00",
        imageURL: "/assets/listing-kpop1.jpg"
      },
      listingID3: {
        title: "Club Shirts Cute",
        price: "13.00",
        imageURL: "/assets/tee.jpeg"
      },
      listingID4: {
        title: "Sony WHCH520/B Bluetooth Headphones",
        price: "13.00",
        imageURL: "/assets/headphones.jpg"
      },
      listingID5: {
        title: "Ralph Lauren Jacket",
        price: "13.00",
        imageURL: "/assets/jacket2.jpg"
      },
    })
    .then(() => {
      console.log("Data has been written successfully.");
    })
    .catch((error) => {
      console.log("Error writing data: ", error);
    });
};
  
const fetchPopularListings = (callback) => {
    const popularListingsRef = ref(database, 'popularListings');
    get(popularListingsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          console.log("No data available.");
        }
      })
      .catch((error) => {
        console.log("Error reading data: ", error);
      });
};

// category listings
const setCategoryListings = () => {
    const categoryListings = {
        "Mobile & Gadgets": {
            bgImage: "/assets/mobile-gadget-bg.png",
            listings: {
                listingID1: {
                    title: "iPhone 13",
                    price: "1200.00",
                    imageURL: "/assets/iphone-13.jpg",
                },
                listingID2: {
                    title: "Samsung Galaxy S22",
                    price: "1000.00",
                    imageURL: "/assets/samsung.jpeg",
                },
            },
        },
        "Women's Fashion": {
            bgImage: "/assets/women-fashion-bg.jpg",
            listings: {
                listingID3: {
                    title: "Summer Dress",
                    price: "50.00",
                    imageURL: "/assets/dress.jpeg",
                },
                listingID4: {
                    title: "Lana Shoulder Bag 23",
                    price: "700.00",
                    imageURL: "/assets/lana-bag.png",
                },
            },
        },
    };

    const categoryListingsRef = ref(database, 'categoryListings');
    set(categoryListingsRef, categoryListings)
        .then(() => console.log("Category listings set successfully"))
        .catch((error) => console.error("Error setting category listings:", error));
};

setCategoryListings();

const fetchCategoryListings = async (categoryName) => {
  const categoryListingsRef = ref(database, `categoryListings/${categoryName}`);
  // console.log("Querying Firebase at:", `categoryListings/${categoryName}`);
  // console.log("Fetching data from Firebase:", categoryListingsRef.toString());

  const snapshot = await get(categoryListingsRef);
  if (snapshot.exists()) {
    // bgImage, listings
    console.log("Category data fetched:", snapshot.val());  
    return snapshot.val();
  }
};

export { fetchPopularListings, setPopularListings, fetchCategoryListings,  database, ref, push, get, set, serverTimestamp, onValue};