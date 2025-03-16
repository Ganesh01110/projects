import { Server } from "socket.io";

export const io = new Server({
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("driver.location.updated", (data) => {
    // Broadcast location update to relevant clients
    io.emit("driver.location.updated", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
