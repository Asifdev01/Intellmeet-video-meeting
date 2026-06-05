import { io } from "socket.io-client";

const socket = io("https://intellmeet-backend-e1d1.onrender.com", {
    transports: ["websocket", "polling"]
});

socket.on("connect", () => {
    console.log("Connected to Render backend with socket ID:", socket.id);
    
    // Listen for active-participants
    socket.on("active-participants", (users) => {
        console.log("SUCCESS! Received active-participants:", users);
        process.exit(0);
    });

    // Send join-room
    socket.emit("join-room", {
        roomId: "test-room-123",
        userId: socket.id,
        userName: "BotTester"
    });

    // Timeout if active-participants is never received
    setTimeout(() => {
        console.log("FAILED: Did not receive active-participants within 5 seconds.");
        process.exit(1);
    }, 5000);
});
