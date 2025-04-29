import { Kafka, Producer, Consumer, Partitioners } from "kafkajs";
import { io } from "./ride.WSClient";

const kafka = new Kafka({
  clientId: "ride-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], // Use environment variable or default to localhost
});

const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Use legacy partitioner to avoid warnings
});
const consumer: Consumer = kafka.consumer({ groupId: "ride-events-group" });

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected");

    await consumer.connect();
    console.log("✅ Kafka Consumer connected");

    await consumer.subscribe({ topic: "location-updated", fromBeginning: false });
    console.log("📢 Kafka Consumer subscribed to location-updated topic");

    consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          if (topic === "location-updated") {
            const locationData = JSON.parse(message.value?.toString() || "{}");
            io.emit("driver.location.updated", locationData);
            console.log("📢 Emitted driver location update:", locationData);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });

    console.log("📢 Kafka connected for ride-service");
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
  }
};

export const publishRideEvent = async (event: string, data: any) => {
  try {
    await producer.send({
      topic: event,
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log(`📢 Published event ${event} with data:`, data);
  } catch (error) {
    console.error(`Error publishing ride event ${event}:`, error);
  }
};

export const publishPaymentEvent = async (eventType: string, paymentData: any) => {
  try {
    await producer.send({
      topic: "payment-events",
      messages: [{ key: eventType, value: JSON.stringify(paymentData) }],
    });
    console.log(`📢 Published payment event ${eventType} with data:`, paymentData);
  } catch (error) {
    console.error(`Error publishing payment event ${eventType}:`, error);
  }
};