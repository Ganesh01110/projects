import { Request, Response } from "express";
import { updateDriverLocation, getNearbyDrivers } from "./location.service";
import { publishLocationEvent } from "./locations.kafkaClient";
import { io } from "./location.WSClient";
import { AuthRequest } from "./location.middlewares";

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    const driverId = req.user?.id;

    if (!driverId) return res.status(401).json({ message: "Unauthorized" });

    const location = await updateDriverLocation(driverId, latitude, longitude);
    
    // Publish Kafka event
    await publishLocationEvent("driver.location.updated", { driverId, latitude, longitude });

    // Broadcast via WebSocket
    io.emit("driver.location.updated", { driverId, latitude, longitude });

    res.status(200).json({ message: "Location updated", location });
  } catch (error) {
    console.error("Update Location Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNearbyDriversAPI = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius } = req.query;

    const drivers = await getNearbyDrivers(Number(latitude), Number(longitude), Number(radius));

    res.status(200).json({ drivers });
  } catch (error) {
    console.error("Nearby Drivers Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
