import { Kafka, Producer, Consumer, Partitioners } from "kafkajs";
import { PrismaClient } from "../../../infra/generated/auth-client";

const authClient = new PrismaClient();

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], // Use environment variable or default to localhost
});

const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Use legacy partitioner to avoid warnings
});
const consumer: Consumer = kafka.consumer({ groupId: "notification-group" });

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected");

    await consumer.connect();
    console.log("✅ Kafka Consumer connected");

    // Subscribe to topics
    await consumer.subscribe({ topics: ["user-registered", "forgot-password", "user-updated"], fromBeginning: false });
    console.log("📢 Kafka Consumer subscribed to topics: user-registered, forgot-password, user-updated");

    // Run consumer
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString());
          console.log(`📥 Received message on topic ${topic}:`, data);

          if (topic === "user-updated") {
            // Update Auth DB
            await authClient.user.update({
              where: { id: data.id },
              data: {
                name: data.name,
                email: data.email,
              },
            });
            console.log(`📢 Auth DB updated for user: ${data.email}`);
          }
        }
      },
    });
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
  }
};

export const publishUserRegistered = async (userData: { email: string; name: string }) => {
  try {
    await producer.send({
      topic: "user-registered",
      messages: [{ value: JSON.stringify(userData) }],
    });
    console.log(`📢 Published user-registered event for ${userData.email}`);
  } catch (error) {
    console.error("Error publishing user-registered event:", error);
  }
};

export const publishForgotPassword = async (userData: { email: string; resetToken: string }) => {
  try {
    await producer.send({
      topic: "forgot-password",
      messages: [{ value: JSON.stringify(userData) }],
    });
    console.log(`📢 Published forgot-password event for ${userData.email}`);
  } catch (error) {
    console.error("Error publishing forgot-password event:", error);
  }
};