import { Server, ServerCredentials } from "@grpc/grpc-js";
import { LocationService } from "./proto/location_grpc_pb";
import { FindNearestDriversRequest, FindNearestDriversResponse } from "./proto/location_pb";
import { getNearbyDrivers } from "./location.service";

const findNearestDrivers = async (call: any, callback: any) => {
  const { latitude, longitude, radius } = call.request;

  const drivers = await getNearbyDrivers(latitude, longitude, radius);
  const response = new FindNearestDriversResponse();
  response.setDriversList(drivers);

  callback(null, response);
};

const server = new Server();
server.addService(LocationService, { findNearestDrivers });
server.bindAsync("0.0.0.0:50052", ServerCredentials.createInsecure(), () => {
  console.log("gRPC Location Service running on port 50052");
  server.start();
});
