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
        category: "Hobbies & Toys",
        price: "28.00",
        imageURL: "/assets/listing-kpop1.jpg"
      },
      listingID3: {
        title: "Club Shirts Cute",
        category: "Woman's Fashion",
        price: "13.00",
        imageURL: "/assets/tee.jpeg"
      },
      listingID4: {
        title: "Sony WHCH520/B Bluetooth Headphones",
        category: "Mobile & Gadgets",
        price: "13.00",
        imageURL: "/assets/headphones.jpg"
      },
      listingID5: {
        title: "Ralph Lauren Jacket",
        category: "Men's Fashion",
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
        "Car": {
          bgImage: "/assets/car-banner.jpg",
          listings: {
            listingID1: {
              title: "Jaguar XE 2.0 14D TSS Auto",
              price: "52, 800",
              imageURL:"/assets/jaguar-car.jpg"
            },
            listingID2: {
              title: "Hyundai i30 Wagon 14.A T-GDi DCT Auto",
              price: "50, 800",
              imageURL:"/assets/hyundai-car.jpg"
            },
            listingID3: {
              title: "Toyota Mark X 2.5 Auto",
              price: "38, 500",
              imageURL:"/assets/toyota-car.jpg"
            },
            listingID4: {
              title: "BMW X2 MSport 2.0D XDrive AWD",
              price: "80, 450",
              imageURL:"/assets/bmw-car.jpg"
            }
          }
        },
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