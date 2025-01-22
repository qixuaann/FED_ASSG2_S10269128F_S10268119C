const chats = [
    {
      id: 1,
      user: "@auther_03",
      listing: "Club Shirts Cute",
      lastMessage: "Start chatting...",
      avatar: "/assets/auther.png"
    },
    {
      id: 2,
      user: "@auther_05",
      listing: "Summer Jackets",
      lastMessage: "How about a discount?",
      avatar: "/assets/auther.png"
    },
    // will add more chats
  ];
 
  const chatList = document.getElementById('chat-list');
  chats.forEach(chat => {
    const chatItem = document.createElement('a');
    chatItem.href = `chat.html?id=${chat.id}`;  // link to actual chat page with chat ID
    chatItem.classList.add('chat-item');
 
    const chatSection = document.createElement('li');
    chatSection.classList.add('chat-section');

    const convoButton = document.createElement('button');
    convoButton.classList.add('convo');
 
 
    const avatarImg = document.createElement('img');
    avatarImg.src = chat.avatar;
    avatarImg.alt = `${chat.user} icon`;
    avatarImg.classList.add('chat-avatar');
 
 
    const chatInfo = document.createElement('div');
    chatInfo.classList.add('chat-info');
 
    const userName = document.createElement('li');
    userName.textContent = chat.user;
 
    const listingTitle = document.createElement('li');
    listingTitle.innerHTML = `<strong>${chat.listing}</strong>`;
 
    const lastMessage = document.createElement('li');
    lastMessage.classList.add('last-message');
    lastMessage.textContent = chat.lastMessage;
 
    chatInfo.appendChild(userName);
    chatInfo.appendChild(listingTitle);
    chatInfo.appendChild(lastMessage);
    convoButton.appendChild(avatarImg);
    convoButton.appendChild(chatInfo);
    chatSection.appendChild(convoButton);
    chatItem.appendChild(chatSection);
    chatList.appendChild(chatItem);
}); 