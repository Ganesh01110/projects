// import { prisma } from "../prisma/client";
// import { RideStatus } from "@prisma/client";
import { PrismaClient,RideStatus } from "../../../infra/generated/ride-client";
import { PrismaClient as PaymentClient } from "../../../infra/generated/payment-client";


const rideClient = new PrismaClient();
const paymentClient = new PaymentClient();


export const createRide = async (userId: string, pickup: string, dropoff: string, fare: number) => {
  return rideClient.ride.create({
    data: { userId, pickup, dropoff, fare },
  });
};

export const assignDriver = async (rideId: string, driverId: string) => {
  return rideClient.ride.update({
    where: { id: rideId },
    data: { driverId, status: RideStatus.ACCEPTED },
  });
};

export const updateRideStatus = async (rideId: string, status: RideStatus) => {
  return rideClient.ride.update({
    where: { id: rideId },
    data: { status },
  });
};

export const getRideById = async (rideId: string) => {
  return rideClient.ride.findUnique({
    where: { id: rideId },
  });
};

// import prisma from "../prisma/client";

export const processPayment = async (userId: string, rideId: string, amount: number, method: string) => {
  return await paymentClient.transaction.create({
    data: {
      userId,
      rideId,
      amount,
      method,
      status: "SUCCESS",
    },
  });
};
