import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { createNotification } from "../services/notificationService.js";

const PROTO_PATH = "./proto/notification.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const notificationProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(notificationProto.NotificationService.service, {
    sendNotification: async (call, callback) => {
        const { userId, message, type, priority, channel } = call.request;
        await createNotification({ userId, message, type, priority, channel });
        callback(null, { success: true });
    }
});

export const startGRPCServer = () => {
    server.bindAsync("0.0.0.0:5006", grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("🚀 gRPC Notification Service running on port 5006");
    });
};
