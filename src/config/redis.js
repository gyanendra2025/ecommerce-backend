import Redis from "ioredis";
import env from "./env.js";

const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: 3000,
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default redis;
