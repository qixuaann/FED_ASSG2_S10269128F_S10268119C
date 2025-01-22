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

const setPopularListings = () => {
    const popularListingsRef = ref(database, 'popularListings');
    set(popularListingsRef, {
      listingID1: {
        title: "Chaps Ralph Lauren Coat Man",
        price: "80",
        imageURL: "/assets/jacket1.jpg"
      },
      listingID2: {
        title: "SEVENTEEN 4th Album Repackage 'SECTOR 17'",
        price: "28",
        imageURL: "/assets/listing-kpop1.jpg"
      }
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
  
export { fetchPopularListings, setPopularListings, database, ref, push, get, set, serverTimestamp, onValue};