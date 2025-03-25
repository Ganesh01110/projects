import { Router } from "express";
import { updateLocation, getNearbyDriversAPI } from "./location.controllers";
import { authenticateUser } from "./location.middlewares";

const router = Router();

router.post("/update", authenticateUser, updateLocation);
router.get("/nearby", getNearbyDriversAPI);

export default router;




// generator client {
//     provider = "prisma-client-js"
//     output   = "../../generated/location-client"
//   }
  
//   datasource db {
//     provider = "postgresql"
//     url      = env("POSTGRES_LOCATION_URL")
//   }
  
//   model DriverLocation {
//     id        String   @id @default(uuid())
//     driverId  String   @unique
//     latitude  Float
//     longitude Float
//     lastUpdated DateTime @default(now())
  
//     @@unique([latitude, longitude]) // Index for spatial queries
//   }
  