import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500), // Retry with exponential backoff
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redisClient.connect().then(() => console.log("✅ Redis Client Connected")).catch(console.error);;

/**
 * Store driver location in Redis (Write-Through Cache)
 */
export const cacheDriverLocation = async (driverId: string, latitude: number, longitude: number, expiry = 60) => {
  await redisClient.setEx(`driver:${driverId}`, expiry, JSON.stringify({ latitude, longitude }));
};

/**
 * Retrieve driver location from Redis (Read-Through Cache)
 */
export const getCachedDriverLocation = async (driverId: string) => {
  const cachedLocation = await redisClient.get(`driver:${driverId}`);
  return cachedLocation ? JSON.parse(cachedLocation) : null;
};

/**
 * Store driver geolocation in Redis using GEOADD
 */
// export const storeDriverGeoLocation = async (driverId: string, latitude: number, longitude: number) => {
//   const geoMember: GeoMember = {
//     longitude,
//     latitude,
//     member: driverId,
//   };

//   await redisClient.geoAdd("drivers:geo", [geoMember]); // Pass an array of GeoMember objects
// };
/**
 * Store driver geolocation in Redis using GEOADD
 */
export const storeDriverGeoLocation = async (driverId: string, latitude: number, longitude: number) => {
    await redisClient.geoAdd("drivers:geo", {
      longitude,
      latitude,
      member: driverId,
    });
  };

/**
 * Get nearby drivers from Redis using GEORADIUS
 */
// export const getNearbyDriversFromRedis = async (latitude: number, longitude: number, radius: number) => {
//   return await redisClient.geoRadius("drivers:geo", {
//     latitude,
//     longitude,
//     radius,
//     unit: "m",
//     withCoord: true,
//   });
// };

// export const getNearbyDriversFromRedis = async (latitude: number, longitude: number, radius: number) => {
//     return await redisClient.geoSearch(
//       "drivers:geo",
//       {
//         latitude,
//         longitude,
//       },
//       {
//         radius,
//         unit: "m",
//       },
//       {
//         WITHCOORD: true, // Ensure coordinates are returned
//       }
//     );
//   };


// export const getNearbyDriversFromRedis = async (latitude: number, longitude: number, radius: number) => {
//     return await redisClient.geoSearch(
//       "drivers:geo", // Redis key
//       ["FROMLONLAT", longitude, latitude], // Correct tuple for coordinates
//       ["BYRADIUS", radius, "m"], // Correct tuple for radius
//       {
//         WITHCOORD: true, // Return coordinates
//         WITHDIST: true,  // (Optional) Return distance
//         COUNT: 10,       // (Optional) Limit results
//       }
//     );
// };

export const getNearbyDriversFromRedis = async (latitude: number, longitude: number, radius: number) => {
    try {
    //   const results = await redisClient.sendCommand([
    //     "GEORADIUS",
    //     "drivers:geo", // Redis key
    //     longitude.toString(), // Longitude
    //     latitude.toString(), // Latitude
    //     radius.toString(), // Radius
    //     "m", // Unit (meters)
    //     "WITHCOORD", // Return coordinates
    //     "WITHDIST", // Return distance
    //     "COUNT", "10", // Limit results to 10
    //   ]);
    const results = await redisClient.sendCommand([
        "GEOSEARCH",
        "drivers:geo", 
        "FROMLONLAT", longitude.toString(), latitude.toString(),
        "BYRADIUS", radius.toString(), "m",
        "WITHCOORD", 
        "WITHDIST", 
        "COUNT", "10" 
      ]);
  
      return results;
    } catch (error) {
      console.error("❌ Error fetching nearby drivers from Redis:", error);
      throw error;
    }
  };

  
  
  

export { redisClient };
