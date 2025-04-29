import { Server } from "socket.io";

const io = new Server(5005, { cors: { origin: "*" } });

// export const initializeWebSocket = () => {
//     io.on("connection", (socket) => {
//         console.log("User connected: ", socket.id);

//         socket.on("subscribe", (userId) => {
//             socket.join(userId);
//         });
//     });
// };

// export const pushNotification = (userId, message) => {
//     io.to(userId).emit("new.notification", { message });
// };

export const initializeWebSocket = () => {
    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id);

        // Subscribe the user to a specific room based on their userId
        socket.on("subscribe", (userId: string) => {
            if (!userId) {
                console.error("Subscription failed: userId is required");
                return;
            }
            socket.join(userId);
            console.log(`User ${socket.id} subscribed to room: ${userId}`);
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.id);
        });
    });
};

export const pushNotification = (userId: string, message: string) => {
    if (!userId || !message) {
        console.error("Push notification failed: userId and message are required");
        return;
    }
    io.to(userId).emit("new.notification", { message });
    console.log(`📢 Notification sent to user ${userId}: ${message}`);
};

export { io };
