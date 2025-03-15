import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({ clientId: "auth-service", brokers: ["kafka:9092"] });


// export const kafkaProducer = async () => {
//     const kafka = new Kafka({ clientId: "auth-service", brokers: ["kafka:9092"] });
//     const producer = kafka.producer();
  
//     await producer.connect();
//     console.log("Kafka Producer connected");
  
//     return producer;
//   };
export const kafkaProducer = async (): Promise<Producer> => {
  const producer = kafka.producer();
  await producer.connect();
  console.log("Kafka Producer connected");
  return producer;
};


// import { Kafka } from "kafkajs";

// export const kafkaConsumer = async () => {
//   const kafka = new Kafka({ clientId: "auth-service", brokers: ["kafka:9092"] });
//   const consumer = kafka.consumer({ groupId: "auth-group" });

//   await consumer.connect();
//   await consumer.subscribe({ topic: "user-events", fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log(`Received message: ${message.value?.toString()} on topic ${topic}`);
//     },
//   });
// };

export const kafkaConsumer = async (): Promise<void> => {
  const consumer: Consumer = kafka.consumer({ groupId: "auth-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "user-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value?.toString()} on topic ${topic}`);
    },
  });
};




// handaling in notification service


// import { consumeUserRegistered } from "../infra/kafkaClient";
// import { sendEmail } from "../services/emailService";

// const handleUserRegistration = async (email: string, name: string) => {
//   console.log(`Creating notification for user: ${email}`);

//   // Simulate saving a notification message in DB
//   console.log(`Notification: "Welcome ${name}! Your account has been created."`);

//   // Send welcome email
//   await sendEmail(email, "Welcome!", `Hello ${name}, thanks for signing up!`);
// };

// // Start consuming registration events
// consumeUserRegistered(handleUserRegistration).catch(console.error);


// password reset
// import { consumeNotifications } from "../infra/kafkaClient";
// import { sendEmail } from "../services/emailService";

// const handleUserRegistration = async (email: string, name: string) => {
//   console.log(`📩 Sending welcome email to ${email}`);
//   await sendEmail(email, "Welcome!", `Hello ${name}, thanks for signing up!`);
// };

// const handleForgotPassword = async (email: string, resetToken: string) => {
//   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
//   console.log(`📩 Sending password reset email to ${email}`);
//   await sendEmail(email, "Password Reset", `Click here to reset: ${resetLink}`);
// };

// // Start consuming Kafka events
// consumeNotifications(handleUserRegistration, handleForgotPassword).catch(console.error);

