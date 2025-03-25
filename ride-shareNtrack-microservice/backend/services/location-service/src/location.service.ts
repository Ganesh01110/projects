import prisma from "../prisma/client";
import { cacheDriverLocation, getCachedDriverLocation, redisClient, storeDriverGeoLocation , getNearbyDriversFromRedis as fetchNearbyDrivers} from "./location.redis";

export const updateDriverLocation = async (driverId: string, latitude: number, longitude: number) => {
  const location = await prisma.driverLocation.upsert({
    where: { driverId },
    update: { latitude, longitude, lastUpdated: new Date() },
    create: { driverId, latitude, longitude },
  });

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
  const drivers = await prisma.$queryRaw`
  SELECT * FROM "DriverLocation"
  WHERE ST_DWithin(
    "coordinates",
    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
    ${radius}
  )
`;


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
  const cachedLocation = await getCachedDriverLocation(driverId);
  if (cachedLocation) return cachedLocation;
  


  // Fetch from database if not in cache
  const location = await prisma.driverLocation.findUnique({
    where: { driverId },
  });

  if (location) {
  //   // Store in Redis for future requests
  //   await redisClient.set(`driver:${driverId}`, JSON.stringify(location), "EX", 60);
  await cacheDriverLocation(driverId, location.latitude, location.longitude);
  }

  return location;
};

// Store driver location in Redis using Redis GEO (Alternative method)
export const setDriverGeoLocation = async (driverId: string, latitude: number, longitude: number) => {
  // await redisClient.geoadd("drivers:geo", longitude, latitude, driverId);
  await storeDriverGeoLocation(driverId, latitude, longitude);

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
