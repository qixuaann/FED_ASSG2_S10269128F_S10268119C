// firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, get, set, serverTimestamp, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const storage = getStorage(app);

// home popular listings
const setPopularListings = () => {
    const popularListingsRef = ref(database, 'popularListings');
    set(popularListingsRef, {
      listingID1: {
        title: "Chaps Ralph Lauren Coat Man",
        category: "Men's Fashion",
        price: "80.00",
        imageURL: "../assets/jacket1.jpg"
      },
      listingID2: {
        title: "SEVENTEEN 4th Album Repackage 'SECTOR 17'",
        category: "Hobbies & Toys",
        price: "28.00",
        imageURL: "../assets/listing-kpop1.jpg"
      },
      listingID3: {
        title: "Club Shirts Cute",
        category: "Woman's Fashion",
        price: "13.00",
        imageURL: "../assets/tee.jpeg"
      },
      listingID4: {
        title: "Sony WHCH520/B Bluetooth Headphones",
        category: "Mobile & Gadgets",
        price: "13.00",
        imageURL: "../assets/headphones.jpg"
      },
      listingID5: {
        title: "Ralph Lauren Jacket",
        category: "Men's Fashion",
        price: "13.00",
        imageURL: "../assets/jacket2.jpg"
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
          bgImage: "../assets/car-banner.png",
          listings: {
            listingID1: {
              title: "Jaguar XE 2.0 14D TSS Auto",
              price: "52,800.00",
              imageURL:"../assets/jaguar-car.jpg"
            },
            listingID2: {
              title: "Hyundai i30 Wagon 14.A T-GDi DCT Auto",
              price: "50,800.00",
              imageURL:"../assets/hyundai-car.jpg"
            },
            listingID3: {
              title: "Toyota Mark X 2.5 Auto",
              price: "38,500.00",
              imageURL:"../assets/toyota-car.jpg"
            },
            listingID4: {
              title: "BMW X2 MSport 2.0D XDrive AWD",
              price: "80,450.00",
              imageURL:"../assets/bmw-car.jpg"
            }
          }
        },
        "Luxury": {
          bgImage: "../assets/luxury-banner.png",
          listings: {
            listingID5: {
              title: "LV Bag",
              price: "700.00",
              imageURL:"../assets/lv-bag.jpg"
            },
            listingID6: {
              title: "Chanel Necklace",
              price: "980.00",
              imageURL:"../assets/chanel-necklace.jpg"
            },
            listingID7: {
              title: "Van Cleef brand new blue bracelet",
              price: "6,300.00",
              imageURL:"../assets/vancleef-bracelet.jpg"
            },
            listingID8: {
              title: "Dior 30 Montaigne Dahlia Wallet",
              price: "750.00",
              imageURL:"../assets/dior-wallet.jpg"
            }
          }
        },
        "Mobile & Gadgets": {
            bgImage: "../assets/mobilengadgets-banner.png",
            listings: {
                listingID9: {
                    title: "iPhone 13",
                    price: "1,200.00",
                    imageURL: "../assets/iphone-13.jpg",
                },
                listingID10: {
                    title: "Samsung Galaxy S22",
                    price: "1,000.00",
                    imageURL: "../assets/samsung.jpeg",
                },
                listingID11: {
                  title: "Brand New iPhone 15 Pro Max",
                  price: "1,700.00",
                  imageURL:"../assets/iphone-15.jpg"
                },
                listingID12: {
                  title: "Samsung z flip 5 (512GB)",
                  price: "1,200.00",
                  imageURL: "../assets/samsung2.jpg"
                }
            },
        },
        "Home Services": {
            bgImage: "../assets/homeservices-banner.png",
            listings: {
                listingID13: {
                    title: "Handyman, Home Services, Home Repairs, Handyman and Drilling Services",
                    price: "50.00",
                    imageURL: "../assets/handyman-service.jpg",
                },
                listingID14: {
                    title: "Painting Services",
                    price: "35.00",
                    imageURL: "../assets/painting-service.jpg",
                },
                listingID15: {
                  title: "Repair Fan Services",
                  price: "83.00",
                  imageURL:"../assets/repair-service.jpg"
                },
                listingID16: {
                  title: "Post Renovation Clean Up Services",
                  price: "42.00",
                  imageURL: "../assets/postreno-service.jpg"
                }
            },
        },
        "Hobbies & Toys": {
            bgImage: "../assets/hobbiesntoys-banner.png",
            listings: {
                listingID17: {
                    title: "BN Jellycat Bashful Bunny Soft Toy",
                    price: "30.00",
                    imageURL: "../assets/jellycat.jpg",
                },
                listingID18: {
                    title: "75% Custom-built Mechanical Keyboard",
                    price: "210.00",
                    imageURL: "../assets/keyboard.jpg",
                },
                listingID19: {
                  title: "Lesserafim Japan Fearless eunchae sealed album",
                  price: "15.00",
                  imageURL:"../assets/lessarafim-album.jpg"
                },
                listingID20: {
                  title: "(All for $8) Plush Toys / Soft Toy (Average 15cm Height)",
                  price: "8.00",
                  imageURL: "../assets/plush-toy.jpg"
                }
            },
        },
        "Property": {
            bgImage: "../assets/property-banner.png",
            listings: {
                listingID21: {
                    title: "HDB 4 room unit (Open for viewing)",
                    price: "300,000.00",
                    imageURL: "../assets/house1.jpg",
                },
                listingID22: {
                    title: "Bungalow D21 8 rooms",
                    price: "11,239,300.00",
                    imageURL: "../assets/bungalow.jpg",
                },
                listingID23: {
                  title: "Rental 3 bedrooms Condo Riversound",
                  price: "4,200.00",
                  imageURL:"../assets/condo1.jpg"
                },
                listingID24: {
                  title: "Condo For Rent Singapore (3 rooms)",
                  price: "5,302.00",
                  imageURL: "../assets/condo2.jpg"
                }
            },
        },
        "Computers & Tech": {
            bgImage: "../assets/computerntech-banner.png",
            listings: {
                listingID25: {
                    title: "Apple Macbook Pro M13 (NO NEGO)",
                    price: "4375.00",
                    imageURL: "../assets/apple-macbook.jpg",
                },
                listingID26: {
                    title: "Thinkpad Lenovo X1 Carbon 7 | Intel i5-8th",
                    price: "484.00",
                    imageURL: "../assets/lenovo.jpg",
                },
                listingID27: {
                  title: "23 inch Apple Cinema Display Monitor",
                  price: "232.00",
                  imageURL:"../assets/apple-display.jpg"
                },
                listingID28: {
                  title: "Brand New VR Headset Meta Quest 3S",
                  price: "421.00",
                  imageURL: "../assets/vr-headsert.jpg"
                }
            },
        },
        "Women's Fashion": {
            bgImage: "../assets/women-fashion-bg.jpg",
            listings: {
                listingID29: {
                    title: "Summer Dress",
                    price: "50.00",
                    imageURL: "../assets/dress.jpeg",
                },
                listingID30: {
                    title: "Lana Shoulder Bag 23",
                    price: "700.00",
                    imageURL: "../assets/lana-bag.png",
                },
                listingID31: {
                  title: "zara satin slip dress",
                  price: "48.00",
                  imageURL: "../assets/zara-dress.jpg",
                },
                listingID32: {
                  title: "LOVET Merlynn Eyelet Dress (Dusty Pink)",
                  price: "17.00",
                  imageURL: "../assets/lovet-dress.jpg",
                },
              },
        },
        "Men's Fashion": {
            bgImage: "../assets/menfashion-banner.png",
            listings: {
                listingID33: {
                    title: "Men Suit Jackets Blazer Coat Slim Fit",
                    price: "50.00",
                    imageURL: "../assets/men-jackrt.jpg",
                },
                listingID34: {
                    title: "Oversized T-Shirt Men MAKE&WEAR",
                    price: "18.00",
                    imageURL: "../assets/men-shirt.jpg",
                },
                listingID35: {
                  title: "Men white short sleeve clothes",
                  price: "48.00",
                  imageURL: "../assets/men-shirt2.jpg",
                },
                listingID36: {
                  title: "Men's Shirt Harajuku Streetwear Long Sleeve Shirt",
                  price: "30.00",
                  imageURL: "../assets/men-shirt3.jpg",
                },
              },
        },
        "Beauty & Personal Care": {
            bgImage: "../assets/skincare-banner.png",
            listings: {
                listingID29: {
                    title: "Brand new / Preloved Skincare Products to clear",
                    price: "5.00",
                    imageURL: "../assets/skincare1.jpg",
                },
                listingID30: {
                    title: "sakura skincare set brand new",
                    price: "10.00",
                    imageURL: "../assets/sakura-skincare.jpg",
                },
                listingID31: {
                  title: "BEST Face Reality Toner Cooling Moisturizer",
                  price: "38.00",
                  imageURL: "../assets/moisturizer.jpg",
                },
                listingID32: {
                  title: "COSRX Gel Cleanser - A Women's Confidence",
                  price: "20.00",
                  imageURL: "../assets/cosrx-gelcleanser.jpg",
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
  const snapshot = await get(categoryListingsRef);
  if (snapshot.exists()) {
    // bgImage, listings
    console.log("Category data fetched:", snapshot.val());  
    return snapshot.val();
  }
};

export { fetchPopularListings, setPopularListings, fetchCategoryListings, 
  database, storage, ref, set, get, push, serverTimestamp, onValue};

export function fetchListingById(id) {
  return firebase.database().ref(`listings/${id}`).once('value').then(snapshot => snapshot.val());
}