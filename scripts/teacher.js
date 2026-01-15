document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');
    const themeSwitcher = document.getElementById('theme-switcher');

    lottie.loadAnimation({
        container: document.getElementById('teacher-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/teacher-lottie.json'
    });

    function addMessage(message, sender, time) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message;

        const timeSpan = document.createElement('span');
        timeSpan.textContent = time;

        messageElement.appendChild(messageParagraph);
        messageElement.appendChild(timeSpan);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            addMessage(message, 'sent', time);
            chatInput.value = '';

            // Simulate a response
            setTimeout(() => {
                const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                addMessage('I am a teacher assistant, how can I help you?', 'received', responseTime);
            }, 1500);
        }
    }

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
});
