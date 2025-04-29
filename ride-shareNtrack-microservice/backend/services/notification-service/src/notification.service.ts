import { PrismaClient ,Prisma,Notification as PrismaNotification} from "../../../infra/generated/notification-client";
// import { Notification, Prisma } from "../../../infra/generated/notification-client";

export const prisma = new PrismaClient();

// export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
//     return await prisma.notification.findMany({
//         where: { userId },
//         orderBy: { createdAt: "desc" },
//     });
// };

// export const createNotification = async (data: Prisma.NotificationCreateInput): Promise<Notification> => {
//     return await prisma.notification.create({
//         data: { ...data, deliveryStatus: "PENDING" },
//     });
// };

// export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
//     return await prisma.notification.update({
//         where: { id: notificationId },
//         data: { read: true },
//     });
// };

export const getUserNotifications = async (userId: string): Promise<PrismaNotification[]> => {
    try {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new Error("Failed to fetch notifications");
    }
};

export const createNotification = async (data: Prisma.NotificationCreateInput): Promise<PrismaNotification> => {
    try {
        // return await prisma.notification.create({
        //     data: { ...data, deliveryStatus: "PENDING" },
        return await prisma.notification.create({
            data: {
                ...data,
                deliveryStatus: data.deliveryStatus || "PENDING", // Default to "PENDING" if not provided
                priority: data.priority || "LOW", // Default to "LOW" if not provided
            },
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Failed to create notification");
    }
};

export const markNotificationAsRead = async (notificationId: string):Promise<PrismaNotification> => {
    try {
        return await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw new Error("Failed to mark notification as read");
    }
};