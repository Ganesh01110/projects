import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import locationRoutes from "./location.routes"
import { connectKafka } from "./locations.kafkaClient";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 5003;
app.use("/api/location", locationRoutes);

app.listen(PORT, async() => {
  console.log(`location Service running on port ${PORT}`);
  await connectKafka();
});
