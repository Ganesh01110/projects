import { Kafka } from "kafkajs";
import { createNotification } from "./notification.service";
// import { io } from "./location.WSClient";
import { io, pushNotification } from "./notification.WSClient";

// Initialize Kafka
const kafka = new Kafka({
  clientId: "notification-service",
  // brokers: ["localhost:9092"], // Replace with your Kafka broker(s)
  // brokers: ["192.168.1.100:9092"],
  brokers:["localhost:9092"],

});

// Create a Kafka consumer
const consumer = kafka.consumer({ groupId: "notification-service" });

export const consumeKafkaEvents = async () => {
  try {
    // Connect the consumer
    await consumer.connect();

    // Subscribe to topics
    await consumer.subscribe({
      topics: [
        "ride-booked",
        "ride-status-updated",
        "user-registered",
        "forgot-password",
        "user-updated",
        "friend-added",
        "friend-removed",
        // "driver.location.updated",
        // "driver.location.removed",
        // "driver.location.error",
      ],
      fromBeginning: true, // Optional: Start consuming from the beginning
    });

    console.log("📢 Kafka Consumer subscribed to topics");

    // Run the consumer
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || "{}");

          switch (topic) {
            case "ride-booked":
              await createNotification({
                userId: data.userId,
                message: "Your ride is booked!",
                type: "PUSH",
                priority: "HIGH",
                channel: "PUSH",
              });
              pushNotification(data.userId, "Your ride is booked!");
            //   console.log(`📢 Notification created and pushed for ride-booked: ${data.userId}`);
              console.log(
                `📢 Notification created for ride-booked: ${data.userId}`
              );
              break;

            case "ride-status-updated":
              await createNotification({
                userId: data.userId,
                message: `Ride status changed to ${data.status}`,
                type: "PUSH",
                priority: "MEDIUM",
                channel: "PUSH",
              });
              pushNotification(data.userId, `Ride status changed to ${data.status}`);
              console.log(
                `📢 Notification created for ride-status-updated: ${data.userId}`
              );
              break;

            case "user-registered":
              await createNotification({
                userId: data.email,
                message: "Welcome to our service!",
                type: "EMAIL",
                priority: "LOW",
                channel: "EMAIL",
              });
                pushNotification(data.email, "Welcome to our service!");
              console.log(
                `📢 Notification created for user-registered: ${data.email}`
              );
              break;

            case "forgot-password":
              await createNotification({
                userId: data.email,
                message: "Reset your password here",
                type: "EMAIL",
                priority: "HIGH",
                channel: "EMAIL",
              });
                pushNotification(data.email, "Reset your password here");
              console.log(
                `📢 Notification created for forgot-password: ${data.email}`
              );
              break;

            case "user-updated":
              console.log(
                `📢 Processing user-updated event for user: ${data.email}`
              );
              await createNotification({
                userId: data.id,
                message: `Your profile has been updated, ${data.name}!`,
                type: "EMAIL",
                priority: "LOW",
                channel: "EMAIL",
              });
                pushNotification(data.id, `Your profile has been updated, ${data.name}!`);
              console.log(
                `✅ Notification created for user-updated: ${data.email}`
              );
              break;

            case "friend-added":
              console.log(
                `📢 Processing friend-added event for userId: ${data.userId}, friendId: ${data.friendId}`
              );
              await createNotification({
                userId: data.friendId,
                message: `You have a new friend request from user ${data.userId}.`,
                type: "PUSH",
                priority: "MEDIUM",
                channel: "PUSH",
              });
                pushNotification(data.friendId, `You have a new friend request from user ${data.userId}.`);
              console.log(
                `✅ Notification created for friend-added: userId ${data.userId}, friendId ${data.friendId}`
              );
              break;

            case "friend-removed":
              console.log(
                `📢 Processing friend-removed event for userId: ${data.userId}, friendId: ${data.friendId}`
              );
              await createNotification({
                userId: data.friendId,
                message: `User ${data.userId} has removed you as a friend.`,
                type: "PUSH",
                priority: "LOW",
                channel: "PUSH",
              });
                pushNotification(data.friendId, `User ${data.userId} has removed you as a friend.`);
              console.log(
                `✅ Notification created for friend-removed: userId ${data.userId}, friendId ${data.friendId}`
              );
              break;

            //   location-updated
            // added to sepatoin of concerns
        //     case "driver.location.updated":
        //     console.log(`📢 Processing driver.location.updated event`);
        //     io.emit("driver.location.updated", data);
        //     console.log(`✅ Emitted driver.location.updated event to WebSocket`);
        //     break;

        //   case "driver.location.removed":
        //     console.log(`📢 Processing driver.location.removed event`);
        //     io.emit("driver.location.removed", data);
        //     console.log(`✅ Emitted driver.location.removed event to WebSocket`);
        //     break;

        //   case "driver.location.error":
        //     console.log(`📢 Processing driver.location.error event`);
        //     io.emit("driver.location.error", data);
        //     console.log(`✅ Emitted driver.location.error event to WebSocket`);
        //     break;

            default:
              console.warn(`⚠️ Unhandled topic: ${topic}`);
          }
        } catch (error) {
          console.error(
            `❌ Error processing message from topic ${topic}:`,
            error
          );
        }
      },
    });

    console.log("✅ Kafka consumer is running and listening for events...");
  } catch (error) {
    console.error("❌ Error initializing Kafka consumer:", error);
  }
};


















// docker stop kafka
// docker rm kafka
// docker run -d --name kafka \^
//   -p 9092:9092 \^
//   --link zookeeper:zookeeper \^
//   -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \^
//   -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092 \^
//   -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.100:9092 \ ^
//   -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT \^
//   -e ALLOW_PLAINTEXT_LISTENER=yes \^
//   bitnami/kafka:latest
