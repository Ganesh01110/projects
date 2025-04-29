import { Request, Response } from "express";
import { getUserNotifications, createNotification, markNotificationAsRead } from "./notification.service";

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
        const notifications = await getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);

        res.status(500).json({ error: "Error fetching notifications" });
    }
};

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const notification = await createNotification(req.body);
        res.status(201).json(notification);
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Error sending notification" });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    const { notificationId } = req.params;
    try {
        await markNotificationAsRead(notificationId);
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ error: "Error marking notification as read" });
    }
};
