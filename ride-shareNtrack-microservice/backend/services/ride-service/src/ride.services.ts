import { prisma } from "../prisma/client";
import { RideStatus } from "@prisma/client";

export const createRide = async (userId: string, pickup: string, dropoff: string, fare: number) => {
  return prisma.ride.create({
    data: { userId, pickup, dropoff, fare },
  });
};

export const assignDriver = async (rideId: string, driverId: string) => {
  return prisma.ride.update({
    where: { id: rideId },
    data: { driverId, status: RideStatus.ACCEPTED },
  });
};

export const updateRideStatus = async (rideId: string, status: RideStatus) => {
  return prisma.ride.update({
    where: { id: rideId },
    data: { status },
  });
};

// import prisma from "../prisma/client";

export const processPayment = async (userId: string, rideId: string, amount: number, method: string) => {
  return await prisma.payment.create({
    data: {
      userId,
      rideId,
      amount,
      method,
      status: "COMPLETED",
    },
  });
};
