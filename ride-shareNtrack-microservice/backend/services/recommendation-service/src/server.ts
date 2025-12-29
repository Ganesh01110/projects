import express from "express";
import dotenv from "dotenv";
import { Kafka } from "kafkajs";

dotenv.config();

const app = express();
const port = process.env.RECOMMENDATION_SERVICE_PORT || 5006;

app.use(express.json());

// Kafka Setup for event consumption
const kafka = new Kafka({
    clientId: "recommendation-service",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "recommendation-group" });

const connectKafka = async () => {
    try {
        await consumer.connect();
        console.log("✅ Recommendation Service: Kafka Consumer connected");
        await consumer.subscribe({ topic: "ride.booked", fromBeginning: false });

        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const value = message.value?.toString();
                console.log(`📡 Event received: ${topic}`, value);
                // Logic to store ride history or update recommendations would go here
            },
        });
    } catch (error) {
        console.error("❌ Kafka Connection Error:", error);
    }
};

// Endpoints
app.get("/api/recommendation/driver/latestId", (req, res) => {
    // Mock logic placeholder
    res.json({
        success: true,
        latestDriverId: "drv_778899",
        recommendation: "Driver nearby with 4.9 rating",
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "UP", service: "Recommendation Engine" });
});

app.listen(port, () => {
    console.log(`🚀 Recommendation Engine running on port ${port}`);
    connectKafka();
});
