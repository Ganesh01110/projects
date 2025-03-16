import { Server } from "socket.io";
import { redisClient } from "../redis/client";

export const io = new Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  socket.on("driver.location.updated", async (data) => {
    const { driverId, latitude, longitude } = data;

    // Store in Redis
    await redisClient.set(`driver:${driverId}`, JSON.stringify({ latitude, longitude }), "EX", 60);

    // Broadcast update
    io.emit("driver.location.updated", data);
  });
});
