import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({ clientId: "ride-service", brokers: ["kafka:9092"] });

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: "ride-events-group" });

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "location-updated", fromBeginning: false });

  consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === "location-updated") {
        const locationData = JSON.parse(message.value?.toString() || "{}");
        io.emit("driver.location.updated", locationData);
      }
    },
  });

  console.log("Kafka connected for ride-service");
};

export const publishRideEvent = async (event: string, data: any) => {
  await producer.send({
    topic: event,
    messages: [{ value: JSON.stringify(data) }],
  });
  console.log(`Published event ${event}`);
};

export const publishPaymentEvent = async (eventType: string, paymentData: any) => {
    await producer.send({
      topic: "payment-events",
      messages: [{ key: eventType, value: JSON.stringify(paymentData) }],
    });
  };