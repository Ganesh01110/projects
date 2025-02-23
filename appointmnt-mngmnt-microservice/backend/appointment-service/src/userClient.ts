import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './protos/user.proto'; // Path to your .proto file

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService as any;

// Create a gRPC client
const userClient = new userProto(
  `localhost:${process.env.USER_PROTO_PORT}`, // Replace with actual user service host and port
  grpc.credentials.createInsecure()
);

export default userClient;
