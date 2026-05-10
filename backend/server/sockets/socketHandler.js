export const handleSockets = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit("user-joined", { userId: socket.id });
        });

        socket.on("send-message", (data) => {
            io.to(data.roomId).emit("receive-message", data);
        });

        socket.on("typing", (data) => {
            socket.to(data.roomId).emit("user-typing", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};