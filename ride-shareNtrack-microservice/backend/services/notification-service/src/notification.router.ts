import { Router } from "express";
import { getNotifications, markAsRead, sendNotification } from "./notification.controllers";

const router = Router();

router.get("/:userId", getNotifications);
router.post("/send", sendNotification);
router.patch("/read/:notificationId", markAsRead);

export default router;
