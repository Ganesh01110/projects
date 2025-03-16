import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import userRoutes from "./user.routes";
import { connectKafka } from "./user.kafkaClient";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/user", userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {

  console.log(`user Service running on port ${PORT}`);
  await connectKafka(); // Initialize Kafka
});
