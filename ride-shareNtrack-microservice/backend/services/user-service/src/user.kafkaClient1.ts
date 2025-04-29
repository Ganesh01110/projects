import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({ clientId: "user-service", brokers: ["kafka:9092"] });

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: "auth-service-group" });

// Use Dependency Injection for Kafka Instances
// Instead of directly creating producer and consumer instances in this file, 
// inject them as dependencies. This makes the code more testable and decoupled.

export const createKafkaClient = (kafka: Kafka) => {
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "auth-service-group" });

  return { producer, consumer };
};

export const connectKafka = async () => {
  await producer.connect();
  console.log("✅Kafka Producer connected");

  await consumer.connect();
  await consumer.subscribe({ topic: "user-updated", fromBeginning: false });

  console.log("📢 Kafka Consumer subscribed to user-updated topic");
};

// Publish user updated event
export const publishUserUpdated = async (userData: { id: string; name: string; email: string }) => {
  await producer.send({
    topic: "user-updated",
    messages: [{ value: JSON.stringify(userData) }],
  });
  console.log(`📢Published user-updated event for ${userData.email}`);
};

// Publish friend added event
export const publishFriendAdded = async (userId: string, friendId: string) => {
  await producer.send({
    topic: "friend-added",
    messages: [{ value: JSON.stringify({ userId, friendId }) }],
  });
  console.log(`📢 Published friend-added event for userId: ${userId}, friendId: ${friendId}`);
};

// Publish friend removed event
export const publishFriendRemoved = async (userId: string, friendId: string) => {
  await producer.send({
    topic: "friend-removed",
    messages: [{ value: JSON.stringify({ userId, friendId }) }],
  });
  console.log(`📢 Published friend-removed event for userId: ${userId}, friendId: ${friendId}`);
};

// Helper function to find user by rideId
const findUserByRideId = async (rideId: string): Promise<string | null> => {
  // Replace this with actual logic to fetch the userId from your database or cache
  console.log(`🔍 Finding user for rideId: ${rideId}`);
  // Example: Query your database or cache
  const userId = "exampleUserId"; // Replace with actual logic
  return userId || null;
};


// Consume driver.location.updated event
export const consumeDriverLocationUpdates = async () => {
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const data = JSON.parse(message.value?.toString() || "{}");

        if (topic === "driver.location.updated") {
          console.log(`📢 Processing driver.location.updated event for rideId: ${data.rideId}`);

          // Logic to find the user who booked the ride
          const userId = await findUserByRideId(data.rideId); // Implement this function

          if (userId) {
            // Publish a new event for the notification service
            await producer.send({
              topic: "ride-location-updated-for-user",
              messages: [{ value: JSON.stringify({ userId, location: data.location }) }],
            });
            console.log(`📢 Published ride-location-updated-for-user for userId: ${userId}`);
          } else {
            console.warn(`⚠️ No user found for rideId: ${data.rideId}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing message from topic ${topic}:`, error);
      }
    },
  });
};