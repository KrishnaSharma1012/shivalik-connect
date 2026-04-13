// ⏳ Fake delay (simulate API)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 📥 Get conversations
export async function getConversations() {
  await delay(400);

  return [
    {
      id: 1,
      name: "Rahul (Google)",
      lastMessage: "I can guide you for DSA",
    },
    {
      id: 2,
      name: "Ananya (Amazon)",
      lastMessage: "Join my React workshop",
    },
  ];
}

// 💬 Get messages for a chat
export async function getMessages(chatId) {
  await delay(400);

  return [
    { sender: "them", text: "Hello!" },
    { sender: "me", text: "Hi, I need help." },
  ];
}

// 📤 Send message
export async function sendMessage(chatId, message) {
  await delay(200);

  if (!message.trim()) {
    throw new Error("Message cannot be empty");
  }

  // Return message object (simulate backend response)
  return {
    sender: "me",
    text: message,
    time: new Date().toLocaleTimeString(),
  };
}