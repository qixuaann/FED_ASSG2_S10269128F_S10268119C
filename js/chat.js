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

let botHasResponded = false;  

// helper func, bot responses based on user input
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    if (message.includes('hello') || message.includes('hi')) {
        return "Hello! How can I assist you with the product?";
    } else if (message.includes('review')) {
        return "You can do a review after making an offer, and i'll accept it.";
    } else if (message.includes('price')) {
        return "The price of the product is as listed. Let me know if you have more questions!";
    } else if (message.includes('shipping') || message.includes('delivery')) {
        return "We offer standard and expedited shipping options. Would you like more details on delivery times?";
    } else if (message.includes('return') || message.includes('refund')) {
        return "We have a 30-day return policy. If you'd like, I can assist you with initiating a return.";
    }
      else if (message.includes('available')) {
        return "Yes, the product is available. Would you like to place an order?";
    } else {
        return "I'm not sure I understand that. Could you clarify your question?";
    }
}
// func to send a message
export function sendMessage(productName, message, sender = 'user') {
    // create a reference to the 'messages' node in the database
    const messagesRef = ref(database, 'messages/' + productName);  

    // use push() to add a new msg with a unique ID
    const newMessageRef = push(messagesRef);  // generate a unique key
    set(newMessageRef, {
        sender: sender,              // user who sent the msg
        message: message,            // content of the msg
        timestamp: serverTimestamp() // timestamp for ordering the msg
    }).then(() => {
        console.log("Message sent successfully!");

        
        if (!botHasResponded) {
            setTimeout(() => {
                const botResponse = generateBotResponse(message);
                sendMessage(productName, botResponse, 'seller'); // send bot response
                botHasResponded = true;
            }, 1000);
        }

    }).catch((error) => {
        console.error("Error sending message:", error);
    });
}

// func to listen for new msgs in real-time
export function listenForMessages(productName, callback) {
    const messagesRef = ref(database, 'messages/' + productName); 

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

export function resetBotResponseFlag() {
    botHasResponded = false;
}