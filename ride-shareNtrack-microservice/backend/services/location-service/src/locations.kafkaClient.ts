import { kafka } from "./kafka";

const producer = kafka.producer();
producer.connect();

export const publishLocationEvent = async (eventType: string, locationData: any) => {
  await producer.send({
    topic: "location-events",
    messages: [{ key: eventType, value: JSON.stringify(locationData) }],
  });
};
