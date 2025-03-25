import { Router } from "express";
import { requestRide, acceptRide, updateRide } from "./ride.controller";
import { authMiddleware } from "./ride.middlewares";
import { makePayment } from "./payment.controller";

const router = Router();

router.post("/request", authMiddleware, requestRide);
router.post("/accept", authMiddleware, acceptRide);
router.post("/update", authMiddleware, updateRide);

router.post("/make-payment", authMiddleware, makePayment);

export default router;


// model Payment {
//     id        String   @id @default(uuid())
//     userId    String
//     rideId    String
//     amount    Float
//     method    String
//     status    String   @default("COMPLETED")
//     createdAt DateTime @default(now())
  
//     // Relations
//     ride Ride @relation(fields: [rideId], references: [id])
//   }
  