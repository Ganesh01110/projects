import { BillingDB, UserDB, AppointmentDB } from "./prismaClient";
import { consumeFromQueue, publishToQueue } from "./queue1";
import { getCache, setCache, invalidateCache } from "./cache";
import userClient from "./userClient"; // Import the gRPC client
import appointmentClient from "./appointmentClient";

// queue logic
const USER_QUEUE = 'userQueue';
// const USER_QUEUE = "userQueue";
const APPOINTMENT_QUEUE = 'appointmentQueue';

const processUserCreatedEvent = async (data: any) => {
  try {
    console.log(`Processing USER_CREATED event:`, data);
    // Add logic to sync with AppointmentDB or perform related actions

    // await AppointmentDB.appointment.findMany();

    if (!data || typeof data !== "object") {
      console.error("❌ Invalid event data received:", data);
      return;
    }

    // Ensure correct field name for the ID
    const userId = data.id || data.userId; // Handle both possible names
    console.log("userId is ::",userId);
    
    if (!userId) {
      console.error("User ID is missing in the event data:", data);
      return;
    }

    console.log("🔍 Checking if user exists in DB...");

    // Example: Check if user exists and sync data
    const user = await UserDB.user.findUnique({ where: { id: userId } });

    if (user) {
      // await UserDB.user.create({ data });
      console.log(`User ${userId} exist to UserDB`);
    } 
    // else {
    //   await UserDB.user.create({
    //     data: {
    //       id: userId,
    //       email: data.email,
    //       name: data.name,
    //     },
    //   });
    //   console.log(`🆕 User ${userId} added to UserDB`);
    // }
    if (!user) {
      await UserDB.user.create({ data });
      console.log(`User ${userId} added to UserDB`);
    }
  } catch (error) {
    console.error("Error processing USER_CREATED event:", error);
  }
};

const processAppointmentCreatedEvent = async (data: any) => {
  console.log('Processing APPOINTMENT_CREATED event:', data);

  if (!data || typeof data !== "object") {
    console.error("❌ Invalid event data received:", data);
    return;
  }

  const { userId, appointmentId } = data;

  if (!userId || !appointmentId) {
    console.error("❌ Missing userId or appointmentId in event data:", data);
    return;
  }

  try {
    // const userId= Number(userId);
    // Automatically generate a billing entry when an appointment is created
    await BillingDB.bill.create({
      data: {
        // appointmentId: data.appointmentId,
        patientId: Number(userId),
        amount: 200, // Example amount
        // status: "pending",
        description: "pending // auto generated",
      },
    });

    // console.log(`Billing entry created for appointment ${data.appointmentId}`);
    console.log(`Billing entry created for appointment ${userId}`);
    
  } catch (error) {
    console.error("Error processing automatic bill creation event:", error);

    //  // Store error in Redis (expire after 5 minutes)
    //  await redis.setex(`billing_error_${data.userId}`, 300, JSON.stringify({
    //   status: "error",
    //   message: `Failed to create bill for appointment ${data.appointmentId}`,
    // }));
  }
};

consumeFromQueue(USER_QUEUE, async (message) => {
  // if (message.event === "USER_CREATED") {
  //   console.log("received data:", message);

  //   if (!message.data) {
  //     console.error("❌ Error: Received USER_CREATED event with missing data:", message);
  //     return;
  //   }
    
  //   await processUserCreatedEvent(message.data);
  // } else {
  //   console.warn(
  //     `Unknown event type received in ${USER_QUEUE}:`,
  //     message.event
  //   );
  // }

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

consumeFromQueue(APPOINTMENT_QUEUE, async (message) => {
  if (message.event === "APPOINTMENT_CREATED") {
    console.log("message of billing appointment creation subscriber",message);

    if (!message.data) {
      console.error("❌ Error: Received APPOINTMENT_CREATED event with missing data:", message);
      return;
    }
    
    await processAppointmentCreatedEvent(message.data);
  } else {
    console.warn(
      `Unknown event type received in ${APPOINTMENT_QUEUE}:`,
      message.event
    );
  }
});

// Generate a new bill for an appointment
export const generateBill = async (
  patientId: number,
  amount: number,
  description: string
) => {

  console.log("generate bill api called");
  // Check if patient exists in UserDB
  // const patient = await UserDB.user.findUnique({ where: { id: patientId } });

  // grpc call rather db call
  // Use gRPC to check if patient exists
  const patient = await new Promise((resolve, reject) => {
    userClient.GetUser({ id: patientId }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });

  if (!patient) {
    console.log("patient not received from grpc");  
    throw new Error(`Patient with ID ${patientId} does not exist.`);
  }

  console.log("patient  received from grpc"); 

  // Fetch pending appointments from AppointmentDB
  // const pendingAppointments = await AppointmentDB.appointment.findMany({
  //   where: { patientId, status: 'pending' },
  // });

  // Fetch pending appointments from cache or database
  let pendingAppointments = await getCache(`pendingAppointments:${patientId}`);
  if (!pendingAppointments) {
    console.log("no cache of pending appointment of patient"); 

    // pendingAppointments = await AppointmentDB.appointment.findMany({
    //   where: { patientId, status: "pending" },
    // });

    // grpc-proto-call rather the above db call
    pendingAppointments = await new Promise((resolve, reject) => {
      appointmentClient.GetPendingAppointments(
        { userId: patientId },
        (error: any, response: any) => {
          // if (error) reject(error);
          // else resolve(response.appointments);
          if (error) {
            console.error(`❌ gRPC Error (GetPendingAppointments):`, error);
            reject(error);
          } else {
            console.log(`✅ gRPC Success (GetPendingAppointments):`, response.appointments);
            resolve(response.appointments);
          }
        }
      );
    });

    console.log("grpc of pending appointment of patient  received from grpc"); 

    // setting cache
    await setCache(
      `pendingAppointments:${patientId}`,
      pendingAppointments,
      600
    );
  }

  if (pendingAppointments.length === 0) {
    throw new Error(`No pending appointments found for patient ${patientId}.`);
  }

  // Generate the bill in BillingDB
  const bill = await BillingDB.bill.create({
    data: {
      patientId,
      amount,
      description,
      createdAt: new Date(),
    },
  });

  // Invalidate patient bills cache
  await invalidateCache(`bills:${patientId}`);

  // Publish bill creation event to RabbitMQ
  await publishToQueue("billingQueue", { event: "BILL_CREATED", bill });

  return bill;
};

// Mark a bill as paid
export const markBillAsPaid = async (billId: number) => {
  console.log("mark bill api called");
  // Update bill status in BillingDB
  const bill = await BillingDB.bill.update({
    where: { id: billId },
    data: { description: "Paid" },
  });

  // Mark associated appointments as 'completed' in AppointmentDB
  await AppointmentDB.appointment.updateMany({
    where: { userId: String(bill.patientId), status: "pending" },
    data: { status: "completed" },
  });

  // Invalidate cache
  await invalidateCache(`bills:${bill.patientId}`);
  await invalidateCache(`pendingAppointments:${bill.patientId}`);

  // Publish bill payment event to RabbitMQ
  await publishToQueue("billingQueue", { event: "BILL_PAID", bill });

  return bill;
};

// Fetch all bills
export const fetchAllBills = async () => {
  console.log("fetch all bill api called");
  // return BillingDB.bill.findMany();

  // check in cache
  let bills = await getCache("allBills");

  // if not present in cache then fetch from db
  if (!bills) {
    bills = await BillingDB.bill.findMany();
    await setCache("allBills", bills, 600);
  }
  return bills;
};

// Fetch bills by patient ID
export const fetchBillsByPatientId = async (patientId: number) => {
  console.log("fetch bill by id api called");
  // Check if patient exists in UserDB
  const patient = await UserDB.user.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new Error(`Patient with ID ${patientId} does not exist.`);
  }

  // Retrieve bills from BillingDB
  // return BillingDB.bill.findMany({
  //   where: { patientId },
  // });

  // Retrieve bills from cache or database
  let bills = await getCache(`bills:${patientId}`);
  if (!bills) {
    bills = await BillingDB.bill.findMany({ where: { patientId } });

    // setting cache
    await setCache(`bills:${patientId}`, bills, 600);
  }

  return bills;
};
