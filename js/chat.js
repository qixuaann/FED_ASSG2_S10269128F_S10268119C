import { database, get, ref, set, push, onValue, serverTimestamp } from '../js/firebase.js';

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

export function sendMessage(message, sender = 'user') {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');

    // create a ref to the 'messages' node in the database
    const messagesRef = ref(database, `messages/${listingId}`);  
    // use push() to add new msg with unique ID
    const newMessageRef = push(messagesRef);  // generate unique key
    set(newMessageRef, {
        sender: sender,              // user who sent the msg
        message: message,            // content of the msg
        timestamp: serverTimestamp() // timestamp for ordering msg
    }).then(() => {
        console.log("Message sent successfully!");

        
        if (!botHasResponded && sender === 'user') {
            setTimeout(() => {
                const botResponse = generateBotResponse(message);
                sendMessage(botResponse, 'seller'); // send bot response
                botHasResponded = true;
            }, 1000);
        }

    }).catch((error) => {
        console.error("Error sending message:", error);
    });
}

export function listenForMessages(listingId, callback) {
    const messagesRef = ref(database, `messages/${listingId}`); 

    // listen for changes in the msgs node
    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();  // get data from snapshot
        const messages = [];

        if (data) {
            Object.keys(data).forEach((messageId) => {
                const messageData = data[messageId];
                messages.push({
                    sender: messageData.sender,
                    message: messageData.message,
                    timestamp: messageData.timestamp
                });
            });
        }
        // pass array of msgs to callback func
        callback(messages);
    });
}

export function resetBotResponseFlag() {
    botHasResponded = false;
}

// chat UI with selected listing data
export function populateChatUI(listingData) {
    const messagesDiv = document.getElementById('messages');

    // listing title
    const listingTitleElement = document.getElementById('listingTitle');
    if (listingTitleElement) {
      listingTitleElement.textContent = listingData.title;
    }
  
    // listing price
    const listingPriceElement = document.getElementById('listingPrice');
    if (listingPriceElement) {
      listingPriceElement.textContent = `${listingData.price}`;
    }
  
    // listing description
    const listingDescriptionElement = document.getElementById('listingDescription');
    if (listingDescriptionElement) {
      listingDescriptionElement.textContent = listingData.description;
    }
  
    // update image for selected listing 
    const listingImageElement = document.querySelector('.listing-img');
    if (listingImageElement) {
      listingImageElement.src = listingData.mainImage || '';
      listingImageElement.alt = listingData.title || 'Listing Image';
    }
    messagesDiv.innerHTML = '';
}

export function displayMessagesForListing(listingId) {
    const messagesDiv = document.getElementById('messages');

    listenForMessages(listingId, (messages) => {
        if (messages.length === 0) {
            const initialMessage = document.createElement('div');
            initialMessage.classList.add('message');
            initialMessage.textContent = "Start chatting with the seller!";
            messagesDiv.appendChild(initialMessage);
        } 
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");
    const category = params.get("category");

    const [listingsResponse, categoryResponse] = await Promise.all([
        fetch("/data/listings.json"),
        fetch("/data/categoryListings.json"),
    ]);

    const [listingsData, categoryData] = await Promise.all([
        listingsResponse.json(),
        categoryResponse.json(),
    ]);

    // merge listings data
    const allListings = {
        ...listingsData.listings,
        ...(categoryData.listings[category] || {}),
    };
    const listing = allListings[listingId];
    populateChatUI(listing);
    displayMessagesForListing(listingId);
});


// create a button for each listing
export function createListingButton(container, listingId, listingData) {
    const button = document.createElement('button');
    button.classList.add('chat-btn');
  
    // data attributes 
    button.setAttribute('data-listing-id', listingId);
    button.setAttribute('data-listing-title', listingData.title);
    button.setAttribute('data-listing-price', listingData.price);
    button.setAttribute('data-listing-description', listingData.description);
    button.setAttribute('data-listing-image', listingData.mainImage);
  
    button.textContent = `${listingData.title}`;
  
    // append
    container.appendChild(button);
      button.addEventListener('click', () => {
        const chatUrl = `chat.html?category=${encodeURIComponent(listingData.category)}&id=${encodeURIComponent(listingId)}`;
        window.location.href = chatUrl;
    });
    
}

document.addEventListener("DOMContentLoaded", async () => {
    // retrieve the 'category' and 'listingID' from the query string
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const listingId = params.get('id');

    let listing;
    // if there's a category, fetch from category listings, else fetch from popular listings
    if (category) {
        listing = await fetchListingData(category, listingId);
    } else {
        listing = await fetchPopularListingData(listingId); 
    }
});

//  fetch listing data from a category
async function fetchListingData(category, listingId) {
    const categoryListingsRef = ref(database, 'categoryListings/' + category + '/listings');  // Reference to the category listings

    const snapshot = await get(categoryListingsRef);  // fetch data from Firebase
    if (snapshot.exists()) {
        const listings = snapshot.val();  // get all listings in that category
        return listings[listingId] || null;  // return listing that matches the given listingID
    }
    return null;  
}

async function fetchPopularListingData(listingId) {
    const popularListingsRef = ref(database, 'listings');  

    const snapshot = await get(popularListingsRef);  
    if (snapshot.exists()) {
        const listings = snapshot.val();  
        return listings[listingId] || null;  
    }
    return null;  
}