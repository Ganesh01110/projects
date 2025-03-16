import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 5003;
app.use("/api/rides", rideRoutes);

app.listen(PORT, () => {
  console.log(`ride Service running on port ${PORT}`);
  await connectKafka();
});




// import express from "express";
// import { Server } from "http";
// import rideRoutes from "./routes/ride.routes";
// import { io } from "./websockets";
// import { connectKafka } from "./kafka/ride.kafkaClient";

// const app = express();
// const server = new Server(app);

// app.use(express.json());
// app.use("/api/rides", rideRoutes);

// server.listen(4002, async () => {
//   console.log("Ride Service running on port 4002");
//   await connectKafka();
// });

// io.attach(server);

