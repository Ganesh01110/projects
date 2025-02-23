import * as grpc from '@grpc/grpc-js';
import * as path from "path";
import * as protoLoader from '@grpc/proto-loader';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const PROTO_PATH = './protos/user.proto';
const PROTO_PATH = path.resolve(__dirname, "../protos/user.proto");

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService as any;

// Implement the gRPC service
const createUser = async (call: any, callback: any) => {
  const { name, email, password } = call.request;
  try {
    const user = await prisma.user.create({ data: { name, email, password } });
    callback(null, { id: user.id, message: 'User created successfully' });
  } catch (error) {
    callback(error, null);
  }
};

const getUser = async (call: any, callback: any) => {
  const { id } = call.request;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      callback(null, { id: user.id, name: user.name, email: user.email });
    } else {
      callback(new Error('User not found'), null);
    }
  } catch (error) {
    callback(error, null);
  }
};

// Start the gRPC server
const server = new grpc.Server();
server.addService(userProto.service, { CreateUser: createUser, GetUser: getUser });

const PORT = process.env.USER_PROTO_PORT;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC server is running on port ${PORT}`);
    server.start();
  }
);
