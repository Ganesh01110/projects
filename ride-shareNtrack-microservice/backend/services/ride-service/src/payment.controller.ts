import { Request, Response } from "express";
import { processPayment } from "./ride.services";
import { publishPaymentEvent } from "./ride.kafkaClient";
import { AuthRequest } from "./ride.middlewares";

export const makePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId, amount, method } = req.body;
    const userId = req.user?.id;

    if (!userId)  {
      res.status(401).json({ message: "Unauthorized" });
      return;
  }

    const payment = await processPayment(userId, rideId, amount, method);
    await publishPaymentEvent("payment-success", payment);

    res.status(200).json({ message: "Payment successful", payment });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
