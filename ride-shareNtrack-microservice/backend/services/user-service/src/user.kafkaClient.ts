import { Kafka, Producer, Consumer, Partitioners } from "kafkajs";
import logger from "./user.logger"; // Importing the winston logger
import { cacheKafkaMessage, cacheRideUser, getCachedRideUser, isKafkaMessageProcessed } from "./user.redis"; // Example cache utility

// Environment variables for configuration
const kafkaBrokers = process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"];
const groupId = process.env.KAFKA_GROUP_ID || "user-service-group";

// Create Kafka instance
const kafka = new Kafka({
  clientId: "user-service",
  brokers: kafkaBrokers,
});

// Dependency-injected Kafka producer and consumer
const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Use legacy partitioner to avoid warnings
});
const consumer: Consumer = kafka.consumer({ groupId });

// Utility to create Kafka client (for testability)
export const createKafkaClient = (kafka: Kafka) => {
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId });
  return { producer, consumer };
};

// Ensure topics exist
const ensureTopicsExist = async () => {
  const admin = kafka.admin();
  await admin.connect();
  try {
    await admin.createTopics({
      topics: [
        { topic: "user-updated", numPartitions: 1, replicationFactor: 1 },
        { topic: "friend-added", numPartitions: 1, replicationFactor: 1 },
        { topic: "friend-removed", numPartitions: 1, replicationFactor: 1 },
        { topic: "driver.location.updated", numPartitions: 1, replicationFactor: 1 },
        { topic: "ride-location-updated-for-user", numPartitions: 1, replicationFactor: 1 },
      ],
    });
    logger.info("✅ Kafka topics ensured");
  } catch (error) {
    logger.error("❌ Error ensuring Kafka topics:", error);
  } finally {
    await admin.disconnect();
  }
};

// Connect Kafka producer and consumer
export const connectKafka = async () => {
  try {
    await ensureTopicsExist(); // Ensure topics exist before connecting
    await producer.connect();
    logger.info("✅ Kafka Producer connected");

    await consumer.connect();
    await consumer.subscribe({ topics: ["user-updated", "driver.location.updated"], fromBeginning: false });
    logger.info("📢 Kafka Consumer subscribed to topics: user-updated, driver.location.updated");
  } catch (error) {
    logger.error("❌ Error connecting Kafka:", error);
    throw error;
  }
};

// Graceful shutdown for Kafka
export const disconnectKafka = async () => {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    logger.info("✅ Kafka Producer and Consumer disconnected");
  } catch (error) {
    logger.error("❌ Error during Kafka disconnection:", error);
  }
};

// Retry logic for producer
const sendWithRetry = async (topic: string, messages: any[], retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await producer.send({ topic, messages });
      logger.info(`📢 Message sent to topic ${topic}`);
      return;
    } catch (error) {
      logger.error(`❌ Failed to send message to topic ${topic}, attempt ${attempt}:`, error);
      if (attempt === retries) throw error;
    }
  }
};

// Publish user updated event
export const publishUserUpdated = async (userData: { id: string; name: string; email: string }) => {
  await sendWithRetry("user-updated", [{ value: JSON.stringify(userData) }]);
  logger.info(`📢 Published user-updated event for ${userData.email}`);
};

// Publish friend added event
export const publishFriendAdded = async (userId: string, friendId: string) => {
  await sendWithRetry("friend-added", [{ value: JSON.stringify({ userId, friendId }) }]);
  logger.info(`📢 Published friend-added event for userId: ${userId}, friendId: ${friendId}`);
};

// Publish friend removed event
export const publishFriendRemoved = async (userId: string, friendId: string) => {
  await sendWithRetry("friend-removed", [{ value: JSON.stringify({ userId, friendId }) }]);
  logger.info(`📢 Published friend-removed event for userId: ${userId}, friendId: ${friendId}`);
};

// Helper function to find user by rideId with caching
const findUserByRideId = async (rideId: string): Promise<string | null> => {
  const cachedUserId = await getCachedRideUser(rideId);

  if (cachedUserId) {
    logger.info(`Cache hit for rideId: ${rideId}`);
    return cachedUserId;
  }

  logger.info(`Cache miss for rideId: ${rideId}`);
  const userId = "exampleUserId"; // Replace with actual DB query
  if (userId) {
    await cacheRideUser(rideId, userId, 3600); // Cache for 1 hour
  }

  return userId || null;
};

// Consume driver.location.updated event with batch processing
export const consumeDriverLocationUpdates = async () => {
  try {
    await consumer.run({
      eachBatch: async ({ batch }) => {
        for (const message of batch.messages) {
          const messageId = message.offset; // Use offset or a unique identifier
          if (await isKafkaMessageProcessed(messageId)) {
            logger.info(`Duplicate message skipped: ${messageId}`);
            continue;
          }

          try {
            const data = JSON.parse(message.value?.toString() || "{}");
            if (batch.topic === "driver.location.updated") {
              logger.info(`Processing driver.location.updated event for rideId: ${data.rideId}`);
              const userId = await findUserByRideId(data.rideId);

              if (userId) {
                await sendWithRetry("ride-location-updated-for-user", [
                  { value: JSON.stringify({ userId, location: data.location }) },
                ]);
                logger.info(`Published ride-location-updated-for-user for userId: ${userId}`);
              } else {
                logger.warn(`No user found for rideId: ${data.rideId}`);
              }
            }

            await cacheKafkaMessage(messageId); // Mark message as processed
          } catch (error) {
            logger.error(`Error processing message from topic ${batch.topic}:`, error);
          }
        }
      },
    });
  } catch (error) {
    logger.error("Error running Kafka consumer:", error);
  }
};

// Handle consumer crashes
consumer.on("consumer.crash", (error) => {
  logger.error("❌ Kafka Consumer crashed:", error);
});