import prisma from "../prisma/client";
import { redisClient } from "../redis/client";

export const updateDriverLocation = async (driverId: string, latitude: number, longitude: number) => {
  const location = await prisma.driverLocation.upsert({
    where: { driverId },
    update: { latitude, longitude, lastUpdated: new Date() },
    create: { driverId, latitude, longitude },
  });

  // Write-Through: Update Redis immediately
  await redisClient.set(`driver:${driverId}`, JSON.stringify({ latitude, longitude }), "EX", 60);

  return location;
};

export const getNearbyDrivers = async (latitude: number, longitude: number, radius: number) => {
  // Read-Through: Check Redis cache first
  const cacheKey = `nearby:${latitude}:${longitude}:${radius}`;
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Query PostGIS for nearby drivers
  const drivers = await prisma.$queryRaw`
    SELECT * FROM "DriverLocation"
    WHERE ST_DWithin(
      ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
      ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326),
      ${radius}
    )
  `;

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(drivers), "EX", 60);
  return drivers;
};
