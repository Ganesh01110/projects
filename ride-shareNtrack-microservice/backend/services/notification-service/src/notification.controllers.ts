import { getUserNotifications, createNotification, markNotificationAsRead } from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
};

export const sendNotification = async (req, res) => {
    try {
        const notification = await createNotification(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: "Error sending notification" });
    }
};

export const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        await markNotificationAsRead(notificationId);
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Error marking notification as read" });
    }
};
