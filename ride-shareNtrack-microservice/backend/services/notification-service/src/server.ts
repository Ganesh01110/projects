import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`notification Service running on port ${PORT}`);
});
