import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { createNotification } from "./notification.service";
import { Prisma } from "../../../infra/generated/notification-client";



const PROTO_PATH = "./proto/notification.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const notificationProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server();

server.addService(notificationProto.NotificationService.service, {
    sendNotification: async (call: any, callback: any) => {
        try {
            const { userId, message, type, priority, channel } = call.request;

            // Validate required fields
            if (!userId || !message || !type || !channel) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Missing required fields: userId, message, type, or channel",
                });
            }

            // Create notification using the service
            const notificationData: Prisma.NotificationCreateInput = {
                userId,
                message,
                type,
                priority: priority || "LOW", // Default to "LOW" if not provided
                channel,
            };

            await createNotification(notificationData);

            callback(null, { success: true });
        } catch (error) {
            console.error("Error in sendNotification:", error);
            callback({
                code: grpc.status.INTERNAL,
                message: "Failed to send notification",
            });
        }
    },
});

export const startGRPCServer = () => {
    server.bindAsync("0.0.0.0:5006", grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("🚀 gRPC Notification Service running on port 5006");
    });
};





































// import grpc from "@grpc/grpc-js";
// import protoLoader from "@grpc/proto-loader";
// import { createNotification } from "./notification.service";

// const PROTO_PATH = "./proto/notification.proto";
// const packageDefinition = protoLoader.loadSync(PROTO_PATH);
// const notificationProto = grpc.loadPackageDefinition(packageDefinition);

// const server = new grpc.Server();
// server.addService(notificationProto.NotificationService.service, {
//     sendNotification: async (call, callback) => {
//         const { userId, message, type, priority, channel } = call.request;
//         await createNotification({ userId, message, type, priority, channel });
//         callback(null, { success: true });
//     }
// });

// export const startGRPCServer = () => {
//     server.bindAsync("0.0.0.0:5006", grpc.ServerCredentials.createInsecure(), () => {
//         server.start();
//         console.log("🚀 gRPC Notification Service running on port 5006");
//     });
// };
