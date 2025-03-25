import { Server } from "socket.io";

const io = new Server(5005, { cors: { origin: "*" } });

export const initializeWebSocket = () => {
    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id);

        socket.on("subscribe", (userId) => {
            socket.join(userId);
        });
    });
};

export const pushNotification = (userId, message) => {
    io.to(userId).emit("new.notification", { message });
};
