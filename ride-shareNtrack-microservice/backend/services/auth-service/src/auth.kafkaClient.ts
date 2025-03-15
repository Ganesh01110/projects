import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({ clientId: "auth-service", brokers: ["kafka:9092"] });

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: "notification-group" });

export const connectKafka = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");

  await consumer.connect();
  await consumer.subscribe({ topics: ["user-registered", "forgot-password"], fromBeginning: false });

  console.log("✅ Kafka Consumer subscribed to topics: user-registered, forgot-password");
};

// Publish an event when a user registers
export const publishUserRegistered = async (userData: { email: string; name: string }) => {
  await producer.send({
    topic: "user-registered",
    messages: [{ value: JSON.stringify(userData) }],
  });
  console.log(`📢 Published user-registered event for ${userData.email}`);
};

// Listen for registration events in notification service
// export const consumeUserRegistered = async (handleMessage: (email: string, name: string) => Promise<void>) => {
//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       if (message.value) {
//         const { email, name } = JSON.parse(message.value.toString());
//         console.log(`Received user-registered event: ${email}`);
//         await handleMessage(email, name);
//       }
//     },
//   });
// };

// ✅ Publish forgot-password event
export const publishForgotPassword = async (userData: { email: string; resetToken: string }) => {
    await producer.send({
      topic: "forgot-password",
      messages: [{ value: JSON.stringify(userData) }],
    });
    console.log(`📢 Published forgot-password event for ${userData.email}`);
  };
  
  // ✅ Consumer for both events
  export const consumeNotifications = async (handleUserRegistered: Function, handleForgotPassword: Function) => {
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString());
  
          if (topic === "user-registered") {
            console.log(`📥 Processing user-registered event: ${data.email}`);
            await handleUserRegistered(data.email, data.name);
          }
  
          if (topic === "forgot-password") {
            console.log(`📥 Processing forgot-password event: ${data.email}`);
            await handleForgotPassword(data.email, data.resetToken);
          }
        }
      },
    });
  };
