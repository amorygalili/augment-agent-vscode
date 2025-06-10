// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendBtn');
    const clearButton = document.getElementById('clearBtn');

    let isTyping = false;

    // Handle messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'addMessage':
                addMessage(message.message);
                break;
            case 'loadHistory':
                loadHistory(message.messages);
                break;
        }
    });

    // Send button click handler
    sendButton.addEventListener('click', sendMessage);

    // Clear button click handler
    clearButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            vscode.postMessage({
                type: 'clearHistory'
            });
            clearMessages();
        }
    });

    // Enter key handler for message input
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && !isTyping) {
            vscode.postMessage({
                type: 'sendMessage',
                message: message
            });
            messageInput.value = '';
            messageInput.style.height = 'auto';
            setTyping(true);
        }
    }

    function addMessage(message) {
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        // Remove typing indicator
        removeTypingIndicator();

        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
        scrollToBottom();

        // If this is an agent message, we're no longer typing
        if (message.type === 'agent' || message.type === 'error') {
            setTyping(false);
        }
    }

    function createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';

        const typeSpan = document.createElement('span');
        typeSpan.className = 'message-type';
        typeSpan.textContent = message.type;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date(message.timestamp).toLocaleTimeString();

        headerDiv.appendChild(typeSpan);
        headerDiv.appendChild(timeSpan);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Process message content for markdown-like formatting
        contentDiv.innerHTML = processMessageContent(message.content);

        messageDiv.appendChild(headerDiv);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }

    function processMessageContent(content) {
        // Basic markdown-like processing
        let processed = content
            // Escape HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Line breaks
            .replace(/\n/g, '<br>');

        return processed;
    }

    function loadHistory(messages) {
        clearMessages();
        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
        scrollToBottom();
    }

    function clearMessages() {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <p>Welcome to Augment Agent! I'm an AI-powered software engineering assistant.</p>
                <p>I can help you with:</p>
                <ul>
                    <li>Code analysis and debugging</li>
                    <li>Writing and modifying code</li>
                    <li>Running tests and commands</li>
                    <li>Exploring codebases</li>
                </ul>
                <p>Type your message below to get started!</p>
            </div>
        `;
    }

    function setTyping(typing) {
        isTyping = typing;
        sendButton.disabled = typing;
        
        if (typing) {
            showTypingIndicator();
        } else {
            removeTypingIndicator();
        }
    }

    function showTypingIndicator() {
        // Remove existing typing indicator
        removeTypingIndicator();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            Agent is thinking
            <span class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </span>
        `;
        
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Initialize
    vscode.postMessage({ type: 'ready' });
})();
