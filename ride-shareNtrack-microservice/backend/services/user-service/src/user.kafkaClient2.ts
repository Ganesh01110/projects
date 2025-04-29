import { Kafka, Producer, Consumer } from "kafkajs";
import logger from "./user.logger"; // Importing the winston logger
import { cacheKafkaMessage, cacheRideUser, getCachedRideUser,  isKafkaMessageProcessed, } from "./user.redis"; // Example cache utility (implement as needed)

// Environment variables for configuration
const kafkaBrokers = process.env.KAFKA_BROKERS?.split(",") || ["kafka:9092"];
const groupId = process.env.KAFKA_GROUP_ID || "auth-service-group";

// Create Kafka instance
const kafka = new Kafka({ 
  clientId: "user-service",
  // brokers: ["192.168.1.100:9092"],
  brokers:["localhost:9092"],
  //  brokers: kafkaBrokers 
  });

// Dependency-injected Kafka producer and consumer
const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId });

// Utility to create Kafka client (for testability)
export const createKafkaClient = (kafka: Kafka) => {
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId });
  return { producer, consumer };
};

// Connect Kafka producer and consumer
export const connectKafka = async () => {
  try {
    await producer.connect();
    logger.info("✅ Kafka Producer connected");

    await consumer.connect();
    await consumer.subscribe({ topic: "user-updated", fromBeginning: false });
    logger.info("📢 Kafka Consumer subscribed to user-updated topic");
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
//   const cacheKey = `rideId:${rideId}`;
//   let userId = await getFromCache(cacheKey);

//   if (!userId) {
//     logger.info(`🔍 Fetching user for rideId: ${rideId} from database`);
//     userId = "exampleUserId"; // Replace with actual DB query
//     if (userId) await saveToCache(cacheKey, userId, 3600); // Cache for 1 hour
//   }

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
export const consumeDriverLocationUpdates1 = async () => {
  try {
    await consumer.run({
      eachBatch: async ({ batch }) => {
        for (const message of batch.messages) {
          try {
            const data = JSON.parse(message.value?.toString() || "{}");

            if (batch.topic === "driver.location.updated") {
              logger.info(`📢 Processing driver.location.updated event for rideId: ${data.rideId}`);
              const userId = await findUserByRideId(data.rideId);

              if (userId) {
                await sendWithRetry("ride-location-updated-for-user", [
                  { value: JSON.stringify({ userId, location: data.location }) },
                ]);
                logger.info(`📢 Published ride-location-updated-for-user for userId: ${userId}`);
              } else {
                logger.warn(`⚠️ No user found for rideId: ${data.rideId}`);
              }
            }
          } catch (error) {
            logger.error(`❌ Error processing message from topic ${batch.topic}:`, error);
          }
        }
      },
    });
  } catch (error) {
    logger.error("❌ Error running Kafka consumer:", error);
  }
};

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