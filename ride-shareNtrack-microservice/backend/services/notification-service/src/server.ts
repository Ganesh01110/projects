import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import notificationRoutes from "./routes/notificationRoutes.js";
import { consumeKafkaEvents } from "./kafka/kafkaConsumer.js";
import { initializeWebSocket } from "./websocket/webSocketLogic.js";
import { startGRPCServer } from "./grpc/grpcServer.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, async() => {
  console.log(`notification Service running on port ${PORT}`);
  // Initialize Kafka consumers
await consumeKafkaEvents();

// Start WebSocket Server
await initializeWebSocket();

// Start gRPC Server
await startGRPCServer();
});
