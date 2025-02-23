import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import billRoutes from './billing.routes';
import { connectQueue, consumeFromQueue } from "./queue";



import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const client = new Client({
//   connectionString: process.env.DATABASE_URL
// });


async function checkConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}

// rabbitmq
const startApp = async () => {
  await connectQueue(); // Ensure connection is established

  // consumeFromQueue("appointmentQueue", (message) => {
  //   console.log("📩 Received message from appointmentQueue:", message);
  // });
};

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/api/billings/hello-world', (req, res) => {
  res.json({ message: 'billing service is running!' });
});

// Register routes
app.use('/api/billing', billRoutes);

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});

checkConnection();
startApp();
