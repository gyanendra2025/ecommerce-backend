import Redis from "ioredis";
import env from "./env.js";

const redis = new Redis(env.redisUrl);

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default redis;
