import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import appointmentRoutes from './appointment.routes';
import { connectQueue, consumeFromQueue } from "./queue";


import { PrismaClient as UserClient } from './../prisma/generated/user-client';
import { PrismaClient as AppointmentClient } from './../prisma/generated/appointment-client';
import { PrismaClient as BillClient } from './../prisma/generated/bill-client';

const UserDB = new UserClient();
const AppointmentDB = new AppointmentClient();
const BillingDB = new BillClient();


// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const client = new Client({
//   connectionString: process.env.DATABASE_URL
// });

async function checkConnection() {
    try {
        await UserDB.$connect();
        await AppointmentDB.$connect();
        await BillingDB.$connect();
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


// async function ensureTablesExist() {
//   try {
//       await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
//           id SERIAL PRIMARY KEY,
//           name VARCHAR(255) NOT NULL,
//           email VARCHAR(255) UNIQUE NOT NULL,
//           age INT
//       )`;
//       console.log("✅ User table ensured");
//   } catch (error) {
//       console.error("❌ Error ensuring tables:", error);
//   }
// }





dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/api/appointment/hello-world', (req, res) => {
  res.json({ message: 'appointment service is running!' });
});

// Mount routes
app.use('/api/appointment', appointmentRoutes);

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
  
});
checkConnection();
startApp();

// async function main() {
//   await prisma.$connect();
//   await ensureTablesExist();
// }

// main();

// checkConnection();
