/**
 * Mock chat messages matching the ChatMessage Mongoose schema:
 * { _id, sender, message, createdAt }
 */

const now = new Date();
const minsAgo = (n) => new Date(now.getTime() - n * 60000).toISOString();

export const mockChatMessages = () => [
    {
        _id: "mock_msg_001",
        sender: "Demo User",
        message: "Hey team! 👋 Welcome to IntellMeet.",
        createdAt: minsAgo(30),
    },
    {
        _id: "mock_msg_002",
        sender: "Alice",
        message: "Thanks! Excited to try the AI summary feature.",
        createdAt: minsAgo(25),
    },
    {
        _id: "mock_msg_003",
        sender: "Demo User",
        message: "Let me know if you have any questions!",
        createdAt: minsAgo(20),
    },
];
