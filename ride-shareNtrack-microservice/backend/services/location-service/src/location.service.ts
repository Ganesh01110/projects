// import prisma from "../prisma/client";
import { DriverLocation, PrismaClient } from "../../../infra/generated/location-client";

import { cacheDriverLocation, getCachedDriverLocation, redisClient, storeDriverGeoLocation , getNearbyDriversFromRedis as fetchNearbyDrivers} from "./location.redis";


const locationClient = new PrismaClient();

export const updateDriverLocation = async (driverId: string, latitude: number, longitude: number) => {
  // const location = await locationClient.driverLocation.upsert({
  //   where: { driverId },
  //   update: { latitude,
  //      longitude,
  //      coordinates: locationClient.$queryRaw`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
  //       lastUpdated: new Date() },
  //   create: { driverId,
  //      latitude,
  //      coordinates: locationClient.$queryRaw`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
  //       longitude },
  // });

  const existingLocation = await locationClient.driverLocation.findUnique({
    where: { driverId },
  });

  let location;
  if (existingLocation) {
    // Update existing location
    location = await locationClient.$executeRaw`
      UPDATE "DriverLocation"
      SET "latitude" = ${latitude},
          "longitude" = ${longitude},
          "coordinates" = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
          "lastUpdated" = NOW()
      WHERE "driverId" = ${driverId}
    `;
  } else {
    // Create new location
    location = await locationClient.$executeRaw`
      INSERT INTO "DriverLocation" ("id", "driverId", "latitude", "longitude", "coordinates", "lastUpdated")
      VALUES (gen_random_uuid(), ${driverId}, ${latitude}, ${longitude}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), NOW())
    `;
  }

  // Write-Through: Update Redis immediately
  // await redisClient.set(`driver:${driverId}`, JSON.stringify({ latitude, longitude }), "EX", 60);
  await cacheDriverLocation(driverId, latitude, longitude);


  return location;
};

export const getNearbyDrivers = async (latitude: number, longitude: number, radius: number) => {
  // Read-Through: Check Redis cache first
  // const cacheKey = `nearby:${latitude}:${longitude}:${radius}`;
  // const cachedData = await redisClient.get(cacheKey);

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }

  const redisResults = await getNearbyDriversFromRedis(latitude, longitude, radius);
  if (redisResults && redisResults.length > 0) {
    return redisResults;
  }

  // Query PostGIS for nearby drivers
  // const drivers = await prisma.$queryRaw`
  //   SELECT * FROM "DriverLocation"
  //   WHERE ST_DWithin(
  //     ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
  //     ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326),
  //     ${radius}
  //   )
  // `;


  const drivers = await locationClient.$queryRaw<DriverLocation[]>`
  SELECT * FROM "DriverLocation"
  WHERE ST_DWithin(
    "coordinates",
    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
    ${radius}
  )
`;

// sql injection free
// const drivers = await locationClient.$queryRaw`
//   SELECT * FROM "DriverLocation"
//   WHERE ST_DWithin(
//     "coordinates",
//     ST_SetSRID(ST_MakePoint($1, $2), 4326),
//     $3
//   )
// `, longitude, latitude, radius;


  // Cache the result
  // await redisClient.set(cacheKey, JSON.stringify(drivers), "EX", 60);

  // Store result in Redis
  if (drivers.length > 0) {
    await redisClient.setEx(`nearby:${latitude}:${longitude}:${radius}`, 60, JSON.stringify(drivers));
  }

  return drivers;
};


// Retrieve driver location with Redis Cache (Read-Through Cache)
export const getDriverLocation = async (driverId: string) => {
  // Check Redis first
  // const cachedLocation = await redisClient.get(`driver:${driverId}`);
  // if (cachedLocation) {
  //   return JSON.parse(cachedLocation);
  // }
  try {
    const cachedLocation = await getCachedDriverLocation(driverId);
  if (cachedLocation) return cachedLocation;
  
 

  // Fetch from database if not in cache
  const location = await locationClient.driverLocation.findUnique({
    where: { driverId },
  });

  if (location) {
  //   // Store in Redis for future requests
  //   await redisClient.set(`driver:${driverId}`, JSON.stringify(location), "EX", 60);
  await cacheDriverLocation(driverId, location.latitude, location.longitude);
  }

  return location;

  } catch (error) {
    console.error("❌ Error fetching driver location:", error);
    throw error;
  }
  
};

// Store driver location in Redis using Redis GEO (Alternative method)
export const setDriverGeoLocation = async (driverId: string, latitude: number, longitude: number) => {
  // await redisClient.geoadd("drivers:geo", longitude, latitude, driverId);
  // await storeDriverGeoLocation(driverId, latitude, longitude);
  try {
    await storeDriverGeoLocation(driverId, latitude, longitude);
  } catch (error) {
    console.error("❌ Error setting driver geo-location in Redis:", error);
    throw error;
  }

};

// Get nearby drivers using Redis GEO
export const getNearbyDriversFromRedis = async (latitude: number, longitude: number, radius: number) => {
  // return await redisClient.georadius("drivers:geo", longitude, latitude, radius, "m", "WITHCOORD");
  try {
    const redisResults = await fetchNearbyDrivers(latitude, longitude, radius);
    if (Array.isArray(redisResults) && redisResults.length > 0) {
      return redisResults;
    }
    return [];
  } catch (error) {
    console.error("❌ Error fetching nearby drivers from Redis:", error);
    throw error;
  }
};
