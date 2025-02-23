// import { PrismaClient } from '@prisma/client';
// import * as dotenv from "dotenv";
// dotenv.config();

// // Initialize Prisma clients for each database
// export const UserDB = new PrismaClient({
//   datasources: { db: { url: process.env.USER_DATABASE_URL } },
// });

// export const AppointmentDB = new PrismaClient({
//   datasources: { db: { url: process.env.APPOINTMENT_DATABASE_URL } },
// });

// export const BillingDB = new PrismaClient({
//   datasources: { db: { url: process.env.BILLING_DATABASE_URL } },
// });

import { PrismaClient as UserClient } from './../prisma/generated/user-client';
import { PrismaClient as AppointmentClient } from './../prisma/generated/appointment-client';
import { PrismaClient as BillClient } from './../prisma/generated/bill-client';

export const UserDB = new UserClient();
export const AppointmentDB = new AppointmentClient();
export const BillingDB = new BillClient();

