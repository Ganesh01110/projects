import { kafka } from "../config/kafkaClient.js";
import { createNotification } from "../services/notificationService.js";

const consumer = kafka.consumer({ groupId: "notification-service" });

export const consumeKafkaEvents = async () => {
    await consumer.connect();
    await consumer.subscribe({ topics: ["ride-booked", "ride-status-updated", "user-registered", "forgot-password"] });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const data = JSON.parse(message.value.toString());

            if (topic === "ride-booked") {
                await createNotification({ userId: data.userId, message: "Your ride is booked!", type: "PUSH", priority: "HIGH", channel: "PUSH" });
            } else if (topic === "ride-status-updated") {
                await createNotification({ userId: data.userId, message: `Ride status changed to ${data.status}`, type: "PUSH", priority: "MEDIUM", channel: "PUSH" });
            } else if (topic === "user-registered") {
                await createNotification({ userId: data.email, message: "Welcome to our service!", type: "EMAIL", priority: "LOW", channel: "EMAIL" });
            } else if (topic === "forgot-password") {
                await createNotification({ userId: data.email, message: "Reset your password here", type: "EMAIL", priority: "HIGH", channel: "EMAIL" });
            }
        }
    });
};
