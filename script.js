


const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");

let userMessage;
const API_KEY = "AIzaSyAprT1IkUK1DRt4YbIo6U9r4EHTt7GYbLc";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = async (usermsg, incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: usermsg }] }],
                }),
            }
        );
        const data = await response.json();
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error:", error.message);
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }
};

const sendMessage = () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(userMessage, incomingChatLi);

    chatInput.value = "";
};

sendChatBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

function scrollChatToBottom() {
    const chatbox = document.querySelector('.chatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Ensure scrolling to bottom on page load
window.addEventListener('load', scrollChatToBottom);

// Ensure scrolling to bottom after sending a message
document.getElementById('send-btn').addEventListener('click', function() {
    // Your existing code to send the message
    setTimeout(scrollChatToBottom, 100);  // Delay to ensure message is added before scrolling
});




