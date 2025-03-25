import { Kafka, Producer } from "kafkajs";
import { io } from "./location.WSClient";

const kafka = new Kafka({ clientId: "ride-service", brokers: ["kafka:9092"] });

const producer: Producer = kafka.producer();

export const connectKafka = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};

export const publishLocationEvent = async (event: string, data: any) => {
  await producer.send({
    topic: event,
    messages: [{ value: JSON.stringify(data) }],
  });
  console.log(`📢 Published event: ${event}`);
};

// Kafka Consumer for location updates
export const consumeLocationUpdates = async () => {
  const consumer = kafka.consumer({ groupId: "location-updates-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "driver.location.updated", fromBeginning: false });

  consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === "driver.location.updated") {
        const locationData = JSON.parse(message.value?.toString() || "{}");
        io.emit("driver.location.updated", locationData);
      }
    },
  });

  console.log("📢 Kafka Consumer subscribed to driver.location.updated topic");
};


// export const publishLocationEvent = async (eventType: string, locationData: any) => {
//   await producer.send({
//     topic: "location-events",
//     messages: [{ key: eventType, value: JSON.stringify(locationData) }],
//   });
// };
