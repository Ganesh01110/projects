import { Server } from "socket.io";
import { redisClient } from "./location.redis";

export const io = new Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  socket.on("driver.location.updated", async (data) => {
    try {
      const { driverId, latitude, longitude } = data;

      if (!driverId || !latitude || !longitude) {
        console.error("Invalid data received:", data);
        socket.emit("error", { message: "Invalid data format" });
        return;
      }

      // Store in Redis with a TTL of 60 seconds
      await redisClient.set(
        `driver:${driverId}`,
        JSON.stringify({ latitude, longitude }),
        { EX: 60 } // Use the correct Redis option for expiration
      );

      // Broadcast the update to all connected clients
      io.emit("driver.location.updated", data);
    } catch (error) {
      console.error("Error handling driver.location.updated event:", error);
      socket.emit("error", { message: "Internal server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected:", socket.id);
  });
});