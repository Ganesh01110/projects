import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({ clientId: "user-service", brokers: ["kafka:9092"] });

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: "auth-service-group" });

export const connectKafka = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");

  await consumer.connect();
  await consumer.subscribe({ topic: "user-updated", fromBeginning: false });

  console.log("Kafka Consumer subscribed to user-updated topic");
};

// Publish user updated event
export const publishUserUpdated = async (userData: { id: string; name: string; email: string }) => {
  await producer.send({
    topic: "user-updated",
    messages: [{ value: JSON.stringify(userData) }],
  });
  console.log(`Published user-updated event for ${userData.email}`);
};
