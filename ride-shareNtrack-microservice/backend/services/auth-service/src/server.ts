import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import authRoutes from "./auth.routes";
// import { kafkaConsumer } from "./auth.kconsumer";
// import { kafkaProducer } from "./auth.kproducer";
import { asyncHandler, dbHealthCheck, rateLimiter } from "./auth.middlewares";
import { connectKafka } from "./auth.kafkaClient";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());



// app.listen(PORT, () => {
//   console.log(`Auth Service running on port ${PORT}`);
// });

// Apply middlewares
// app.use(dbHealthCheck);
// app.use(rateLimiter);
app.use(asyncHandler(dbHealthCheck));
app.use(asyncHandler(rateLimiter));


// Authentication routes
app.use("/auth", authRoutes);

// Proxy logic for other services
const services = {
  user: "http://user-service:5001",
  ride: "http://ride-service:5002",
  location: "http://location-service:5003",
  notification: "http://notification-service:5004",
};

Object.entries(services).forEach(([name, target]) => {
  app.use(`/${name}`, createProxyMiddleware({ target, changeOrigin: true }));
});

const startServer = async () => {
  try {
    await connectKafka();
    console.log("Auth service is ready!");
  } catch (error) {
    console.error("Failed to start auth service:", error);
  }
};

app.listen(PORT, async () => {
  console.log(`Auth service running on port ${PORT}`);
  startServer();
  // await connectKafka(); // ✅ Initialize Kafka producer & consumer
  // await kafkaConsumer(); // Start Kafka consumer
  // await kafkaProducer(); // Initialize producer
});
