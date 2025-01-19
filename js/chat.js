// firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, serverTimestamp, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


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
// initialize Realtime Database and get a ref to the service
const database = getDatabase(app);

// func to send a message
export function sendMessage(message, sender = 'user') {
    // create a reference to the 'messages' node in the database
    const messagesRef = ref(database, 'messages/');

    // use push() to add a new msg with a unique ID
    const newMessageRef = push(messagesRef);  // generate a unique key
    set(newMessageRef, {
        sender: sender,              // user who sent the msg
        message: message,            // content of the msg
        timestamp: serverTimestamp() // timestamp for ordering the msg
    }).then(() => {
        console.log("Message sent successfully!");
    }).catch((error) => {
        console.error("Error sending message:", error);
    });
}

// func to listen for new msgs in real-time
export function listenForMessages(callback) {
    const messagesRef = ref(database, 'messages/');

    // listen for changes in the msgs node
    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();  // get data from snapshot
        const messages = [];

        // if messages exist, iterate through them and store them in an array
        for (let id in data) {
            messages.push(data[id]);
        }
        // pass array of msgs to callback func
        callback(messages);
    });
}

