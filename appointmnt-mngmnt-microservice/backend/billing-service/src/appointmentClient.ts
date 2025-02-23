import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../protos/appointment.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const appointmentProto = grpc.loadPackageDefinition(packageDefinition).AppointmentService as any;

const appointmentClient = new appointmentProto(
  `localhost:${process.env.APPOINTMENT_PROTO_PORT}`,
  grpc.credentials.createInsecure()
);

export default appointmentClient;
