import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();
const port = process.env.GATEWAY_PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Proxy mapping as per architecture diagram
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const USER_SERVICE = process.env.USER_SERVICE_URL || "http://localhost:5002";
const RIDE_SERVICE = process.env.RIDE_SERVICE_URL || "http://localhost:5003";
const LOCATION_SERVICE = process.env.LOCATION_SERVICE_URL || "http://localhost:5004";
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005";
const RECOMMENDATION_SERVICE = process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:5006";

// Routing
app.use("/api/auth", proxy(AUTH_SERVICE));
app.use("/api/users", proxy(USER_SERVICE));
app.use("/api/rides", proxy(RIDE_SERVICE));
app.use("/api/location", proxy(LOCATION_SERVICE));
app.use("/api/notification", proxy(NOTIFICATION_SERVICE));
app.use("/api/recommendation", proxy(RECOMMENDATION_SERVICE));

// Legacy/Image specific routes
app.use("/api/proxy/user/profile", proxy(USER_SERVICE, {
    proxyReqPathResolver: (req) => "/api/user/profile"
}));

app.get("/health", (req, res) => {
    res.json({ status: "UP", gateway: "API Gateway" });
});

app.listen(port, () => {
    console.log(`📡 API Gateway operating on port ${port}`);
});
