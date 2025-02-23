import { UserDB,BillingDB } from './prismaClient';

import { publishToQueue , consumeFromQueue} from './queue2';
import { setCache, getCache, invalidateCache } from './cache';


const USER_QUEUE = 'userQueue';
const BILLING_QUEUE = 'billingQueue';

const processBillingCreatedEvent = async (patientId: number) => {
  console.log(`Processing bill_CREATED event:`, patientId);
  console.log("Received patientId:", patientId);
console.log("Type of patientId:", typeof patientId);

if (!patientId) {
  console.error("❌ Error: patientId is undefined or null");
  return null; // Or handle this case appropriately
}

  // automatically scan for user and and its bill
  const patient = await UserDB.user.findUnique({ where: { id:patientId} });
  if (!patient) {
    console.error("❌ No patient found with ID:", patientId);
    throw new Error(`Patient with ID ${patientId} does not exist.`);
  }

  // Retrieve bills from cache or database
  let bills = await getCache(`bills:${patientId}`);
  if (!bills) {
    bills = await BillingDB.bill.findMany({ where: { patientId } });
    await setCache(`bills:${patientId}`, bills, 600);
  }

 

  console.log(`Billing entry created for patient ${patientId}`);
};

consumeFromQueue(BILLING_QUEUE, async (message:any) => {

  if (!message) return;

  if (message.event === "BILL_CREATED") {
    const { bill } = message;
        
        // Extracting patientId correctly
        const patientId = bill?.patientId;  

        console.log("📩 Received event data:", message);
        console.log("Extracted patientId:", patientId);

    console.log("📩 Received event data:", message,message.bill,message.bill.patientId );
    await processBillingCreatedEvent(patientId);
  } else {
    console.warn(`Unknown event type received in ${USER_QUEUE}:`, message.event);
  }
});

export const createUser = async (data: { name: string; email: string; password: string }) => {
  const user = await UserDB.user.create({ data });
  // Here you can add logic to communicate with other modules, e.g., publish an event to OrderDB

// Publish user creation event to RabbitMQ
await publishToQueue(USER_QUEUE, {
    event: 'USER_CREATED',
    data: { id: user.id, email: user.email, name: user.name },
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await UserDB.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  return { message: 'Login successful', userId: user.id };
};

export const getAllUsers = async () => {
  return await UserDB.user.findMany();
};

export const getUserById = async (id: number) => {

    // Check cache first
  const cachedUser = await getCache(`user:${id}`);
  if (cachedUser) return cachedUser;

  // Fetch from DB
  const user = await UserDB.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  // Cache the result
  await setCache(`user:${id}`, user);
  return user;
};


export const updateUser = async (id: number, data: { name?: string; email?: string }) => {
    // Update user in DB
    const user = await UserDB.user.update({ where: { id }, data });
  
    // Invalidate cache
    await invalidateCache(`user:${id}`);
  
    return user;
  };
