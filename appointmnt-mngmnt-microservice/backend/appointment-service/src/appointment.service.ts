import { AppointmentDB, UserDB, BillingDB } from './prismaClient';
import { consumeFromQueue,publishToQueue } from './queue1';
import { getCache, setCache, invalidateCache } from './cache';
import userClient from './userClient'; // Import the gRPC client


// queue logic
const USER_QUEUE = 'userQueue';

const processUserCreatedEvent = async (data: any) => {
  console.log('Processing USER_CREATED event:', data);
  // Add logic to sync with AppointmentDB or perform related actions

  // await AppointmentDB.appointment.findMany();

  if (! (data.userId||data.id) ) {
    console.error("Error: User ID is undefined");
    return;
 }

  // Example: Check if user exists and sync data
  const user = await UserDB.user.findUnique({ where: { id: (data.userId ||data.id) } });
  // if (!user) {
  //   await UserDB.user.create({ data });
  //   console.log(`User ${data.userId} added to UserDB`);
  // }
  if (user) {
    // await UserDB.user.create({ data });
    console.log(`User ${data.userId||data.id} exist into UserDB`);
  }else{
    console.log(`no User found on id :: ${data.userId||data.id}  into UserDB`);
  }

};

consumeFromQueue(USER_QUEUE, async (message) => {

  try{ 
    if (!message || !message.event) {
      console.warn("⚠️ Received an empty or invalid message:", message);
      return;
    }

    console.log(`📩 Received message from ${USER_QUEUE}:`, message);


    if (message.event === 'USER_CREATED') {
      await processUserCreatedEvent(message.data);
    }else {
      console.warn(`⚠️ Unknown event type: ${message.event}`);
    }


  } catch (error) {
    console.error("❌ Error processing message:", error);
  }
  

});


// Schedule an appointment
export const createAppointment = async (userId: number, doctor: string, date: string) => {
  console.log("create appointment api called");

  // Check if the user exists in the user database
  // const user = await UserDB.user.findUnique({ where: { id: userId } });

  // does same as above but in grpc
  // Use gRPC to check if the user exists
  const user = await new Promise((resolve, reject) => {
    userClient.GetUser({ id: userId }, (error: any, response: any) => {
      if (error) {
        reject(new Error(`User with ID ${userId} does not exist.`));
      } else {
        resolve(response);
      }
    });
  });

  if (!user) {
    throw new Error(`User with ID ${userId} does not exist.`);
  }

  // Create the appointment in the appointment database
  const appointment = await AppointmentDB.appointment.create({
    data: {
      userId:String(userId),
      // doctor,
      date: new Date(date),
      status: 'scheduled',
    },
  });


  // Publish appointment created event
  await publishToQueue('appointmentQueue', {
    event: 'APPOINTMENT_CREATED',
    data: { userId, appointmentId: appointment.id },
  });

  // Invalidate cache
  await invalidateCache('all_appointments');
  await invalidateCache(`appointments_user_${userId}`);


  return appointment;
};

// Mark an appointment as completed
export const updateAppointmentStatus = async (id: string, status: string) => {
  console.log("coplete appointment api called");


  // Update the status in the appointment database
  const appointment = await AppointmentDB.appointment.update({
    where: { id: String(id) },
    data: { status },
  });

  if (!appointment) {
    throw new Error(`Appointment with ID ${id} does not exist.`);
  }

  // Add a record in the billing database (complex cross-database operation)
  await BillingDB.bill.create({
    data: {
      // appointmentId: id,
      patientId: Number(appointment.userId),
      amount: 200, // Example: Add static billing amount
      // status: 'pending',
      description:"pending"
    },
  });


  // Publish event
  await publishToQueue('appointmentQueue', {
    event: 'APPOINTMENT_UPDATED',
    data: { appointmentId: id, status },
  });

   // Invalidate cache
   await invalidateCache('all_appointments');
   await invalidateCache(`appointments_user_${appointment.userId}`);
 

  return appointment;
};

// Get all appointments
export const fetchAllAppointments = async () => {

  console.log("fetch all appointment api called");


  const cacheKey = 'all_appointments';

  // Check if data is cached
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    console.log('Returning cached appointments');
    return cachedData;
  }

  // Fetch from DB if cache is empty
  const appointments = await AppointmentDB.appointment.findMany();

  // Store result in cache
  await setCache(cacheKey, appointments, 3600); // Cache for 1 hour

  return appointments;

  // return AppointmentDB.appointment.findMany();
};

// Get appointments by user ID
export const fetchAppointmentsByUserId = async (userId: number) => {

  console.log("fetch by id appointment api called",userId,typeof(userId));


  const cacheKey = `appointments_user_${userId}`;

  // Check Redis cache
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log(`Returning cached data for user ${userId}`);
    return cachedData;
  }

  // Fetch user data from the user database
  const user = await UserDB.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`User with ID ${userId} does not exist.`);
  }

  // Fetch related appointments from the appointment database
  const appointments = await AppointmentDB.appointment.findMany({ where: { userId: String(userId)} });

  // Fetch corresponding billing details from the billing database
  const billingDetails = await BillingDB.bill.findMany({ where: { patientId:userId } });


  const responseData = { user, appointments, billingDetails };

  // Store result in cache
  await setCache(cacheKey, responseData, 3600); // Cache for 1 hour


  // return { user, appointments, billingDetails };

  return responseData;
};
