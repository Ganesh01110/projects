import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROTO_PATH = path.resolve(__dirname, '../protos/appointment.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const appointmentProto = grpc.loadPackageDefinition(packageDefinition).AppointmentService as any;

const createAppointment = async (call: any, callback: any) => {
  const { userId, date, status } = call.request;
  try {
    const appointment = await prisma.appointment.create({
      data: { userId, date, status },
    });
    callback(null, appointment);
  } catch (error) {
    callback(error, null);
  }
};

const getAppointment = async (call: any, callback: any) => {
  const { appointmentId } = call.request;
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    callback(null, appointment || { error: "Appointment not found" });
  } catch (error) {
    callback(error, null);
  }
};

const getPendingAppointments = async (call: any, callback: any) => {
  let { userId } = call.request;
  try {
    // Ensure `userId` is an integer before querying the database
    userId = parseInt(userId, 10);

    if (isNaN(userId)) {
      console.error("Invalid userId received:", call.request.userId);
      return callback(new Error("Invalid userId format"), null);
    }

    userId = String(userId);
    
    const appointments = await prisma.appointment.findMany({
      where: { userId, status: "scheduled" },
    });
    console.log("scheduled appointment serch",appointments);
    
    callback(null, { appointments });
  } catch (error) {
    callback(error, null);
  }
};

const server = new grpc.Server();
server.addService(appointmentProto.service, {
  CreateAppointment: createAppointment,
  GetAppointment: getAppointment,
  GetPendingAppointments: getPendingAppointments,
});

server.bindAsync(`0.0.0.0:${process.env.APPOINTMENT_PROTO_PORT}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) {
    console.error('Failed to bind gRPC server:', err);
    return;
}
  console.log(`gRPC Appointment Service running on port ${process.env.APPOINTMENT_PROTO_PORT}`);
  server.start();
});
