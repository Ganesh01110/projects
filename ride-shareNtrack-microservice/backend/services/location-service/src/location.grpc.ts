import * as grpc from "@grpc/grpc-js";
import * as path from "path";
import * as protoLoader from "@grpc/proto-loader";
import { getNearbyDrivers } from "./location.service";

// Define the path to the proto file
const PROTO_PATH = path.resolve(__dirname, "./proto/location.proto");

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const locationProto = grpc.loadPackageDefinition(packageDefinition).LocationService as any;

// Implement the gRPC service
const findNearestDrivers = async (call: any, callback: any) => {
  const { latitude, longitude, radius } = call.request;
  try {
    const drivers = await getNearbyDrivers(latitude, longitude, radius);
    callback(null, { drivers });
  } catch (error) {
    callback(error, null);
  }
};

// Start the gRPC server
const server = new grpc.Server();
server.addService(locationProto.service, { FindNearestDrivers: findNearestDrivers });

const PORT = process.env.LOCATION_PROTO_PORT || 50052;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC Location Service running on port ${PORT}`);
  server.start();
});