// import { prisma } from "../config/prismaClient.js";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();


export const getUserNotifications = async (userId) => {
    return await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
};

export const createNotification = async ({ userId, message, type, priority, channel }) => {
    return await prisma.notification.create({
        data: { userId, message, type, priority, channel, deliveryStatus: "PENDING" }
    });
};

export const markNotificationAsRead = async (notificationId) => {
    return await prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
};
