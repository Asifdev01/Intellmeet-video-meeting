const activeUsers = {};

export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);


        socket.on("join-room", ({ roomId, userId, userName }) => {
            socket.join(roomId);

            if (!activeUsers[roomId]) {
                activeUsers[roomId] = [];
            }


            activeUsers[roomId] = activeUsers[roomId].filter(u => u.socketId !== socket.id);

            const newUser = {
                socketId: socket.id,
                userId,
                userName: userName || "Participant",
            };

            activeUsers[roomId].push(newUser);


            socket.to(roomId).emit("user-joined", newUser);

            // Send full list to the new user
            socket.emit("active-participants", activeUsers[roomId]);

            console.log(`User "${userName}" (socket ${socket.id}) joined room ${roomId}`);
        });


        socket.on("offer", ({ offer, to }) => {
            io.to(to).emit("offer", {
                offer,
                from: socket.id,
            });
        });


        socket.on("answer", ({ answer, to }) => {
            io.to(to).emit("answer", {
                answer,
                from: socket.id,
            });
        });


        socket.on("ice-candidate", ({ candidate, to }) => {
            io.to(to).emit("ice-candidate", {
                candidate,
                from: socket.id,
            });
        });


        socket.on("send-message", (data) => {
            io.to(data.roomId).emit("receive-message", data);
        });


        socket.on("typing", (data) => {
            console.log(`Typing event in room ${data.roomId}`);
            socket.to(data.roomId).emit("user-typing", data);
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);

            for (const roomId in activeUsers) {
                activeUsers[roomId] = activeUsers[roomId].filter(
                    (user) => user.socketId !== socket.id
                );

                socket.to(roomId).emit("user-left", {
                    socketId: socket.id,
                });
            }
        });
    });
};