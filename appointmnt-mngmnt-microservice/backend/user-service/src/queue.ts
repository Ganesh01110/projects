import amqp from 'amqplib';
import * as dotenv from "dotenv";

dotenv.config();


const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

let connection: amqp.Connection | null = null;
export let channel: amqp.Channel;

// let connection;
// let channel;

// async function connect() {

//     connection = await amqp.connect(RABBITMQ_URL);
//     channel = await connection.createChannel();
//     console.log('Connected to RabbitMQ');
// }

export const connectQueue = async () => {
  try {
     connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ RabbitMQ Connected & Channel Created');

    return channel;
  } catch (error) {
    console.error('❌ RabbitMQ Connection Failed:', error);
    process.exit(1);
  }
};

export const publishToQueue = async (queueName: string, message: object) => {
  if (!channel) await connectQueue();

  // if (!channel) throw new Error('❌ RabbitMQ channel is not initialized');
  
  
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`📩 Message published to queue ${queueName}:`, message);
};

export const consumeFromQueue = async (
  queueName: string,
  callback: (message: any) => void
) => {
  if (!channel) await connectQueue();

  // if (!channel) throw new Error('RabbitMQ channel is not initialized');
 
  await channel.assertQueue(queueName, { durable: true });
  
  channel.consume(queueName, (message) => {

    if (!message) return;

    if (message) {
      // const content = JSON.parse(message.content.toString());
      // callback(content);
      // channel.ack(message);
      try {
              console.log(
                `Processing USER_CREATED event: ${message.content.toString()}`
              );
              const content = JSON.parse(message.content.toString());
              callback(content);
              channel.ack(message);
            } catch (error) {
              console.error("Error processing message:", error);
              channel.nack(message, false, true); // ❌ Avoid calling ack() and nack() together
            }
    }
  });
};
