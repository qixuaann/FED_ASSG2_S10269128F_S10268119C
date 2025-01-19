// add the library for product recco

// chat response
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendMessageButton.addEventListener('click', () => {
    const messageContent = messageInput.value.trim();
    if (messageContent) {
        addMessage(messageContent, 'user');
        messageInput.value = '';

        // Simulate receiving a response
        setTimeout(() => {
            addMessage('Thanks for your message!', 'other');
        }, 1000);
    }
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessageButton.click();
    }
});