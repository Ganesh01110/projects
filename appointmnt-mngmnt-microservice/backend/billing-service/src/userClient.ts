import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

// Load the .proto file
const PROTO_PATH = path.resolve(__dirname, '../protos/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService as any;

// Create gRPC client for User Service
const userClient = new userProto(
  `localhost:${process.env.USER_PROTO_PORT}`,
  grpc.credentials.createInsecure()
);

export default userClient;
