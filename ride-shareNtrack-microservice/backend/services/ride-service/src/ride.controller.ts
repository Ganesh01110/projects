import { Request, Response } from "express";
import { createRide, assignDriver, updateRideStatus, getRideById } from "./ride.services";
import { publishRideEvent } from "./ride.kafkaClient";
import { io } from "./ride.WSClient";
import { AuthRequest } from "./ride.middlewares";

export const requestRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pickup, dropoff, fare } = req.body;
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return;}

    const ride = await createRide(userId, pickup, dropoff, fare);
    await publishRideEvent("ride-requested", ride);

    res.status(201).json(ride);
  } catch (error) {
    console.error("Ride Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rideId } = req.body;
    const driverId = req.user?.id;

    if (!driverId)  {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const ride = await assignDriver(rideId, driverId);
    await publishRideEvent("ride-accepted", ride);

    io.to(ride.userId).emit("ride.status.change", { rideId, status: "ACCEPTED" });

    res.status(200).json(ride);
  } catch (error) {
    console.error("Accept Ride Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rideId, status } = req.body;

    const updatedRide = await updateRideStatus(rideId, status);
    await publishRideEvent("ride-status-updated", updatedRide);

    io.to(updatedRide.userId).emit("ride.status.change", { rideId, status });

    res.status(200).json(updatedRide);
  } catch (error) {
    console.error("Update Ride Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRideStatus = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;

    const ride = await getRideById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    res.status(200).json({ rideId, status: ride.status });
  } catch (error) {
    console.error("Get Ride Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
