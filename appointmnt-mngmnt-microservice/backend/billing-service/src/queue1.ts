import amqp from "amqplib";
import * as dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export const connectQueue = async () => {
  try {
    if (!connection) {
      connection = await amqp.connect(RABBITMQ_URL);
      console.log("✅ RabbitMQ Connected");
      
      connection.on("error", (err) => {
        console.error("❌ RabbitMQ Connection Error:", err);
        connection = null; // Reset connection
      });

      connection.on("close", () => {
        console.warn("⚠️ RabbitMQ Connection Closed. Reconnecting...");
        connection = null;
        setTimeout(connectQueue, 5000); // Retry after 5 sec
      });
    }

    if (!channel) {
      channel = await connection.createChannel();
      console.log("✅ RabbitMQ Channel Created");

      channel.on("close", () => {
        console.warn("⚠️ RabbitMQ Channel Closed. Recreating...");
        channel = null;
        setTimeout(connectQueue, 5000); // Retry after 5 sec
      });
    }

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Failed:", error);
    process.exit(1);
  }
};

export const publishToQueue = async (queueName: string, message: object) => {
  if (!channel) await connectQueue();
  if (!channel) throw new Error("❌ RabbitMQ channel is not available");

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`📩 Message published to queue ${queueName}:`, message);
};

export const consumeFromQueue = async (
  queueName: string,
  callback: (message: any) => Promise<void>
) => {
  if (!channel) await connectQueue();
  if (!channel) throw new Error("❌ RabbitMQ channel is not available");

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(
    queueName,
    async (message) => {
      if (message) {
        try {
          const content = JSON.parse(message.content.toString());
          await callback(content);
          if (channel) channel.ack(message); // ✅ Ensure channel is valid before ack
        } catch (error) {
          console.error("❌ Error processing message:", error);
          if (channel) channel.nack(message, false, false); // ❌ Reject the message
        }
      }
    },
    { noAck: false } // Ensure manual acknowledgment
  );

  console.log(`🔄 Listening for messages on queue: ${queueName}`);
};
