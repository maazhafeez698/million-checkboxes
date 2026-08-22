import { createClient } from "redis";
import { env } from "../../config/env.js";

const redis = createClient({
  url: env.redisUrl,
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }

  console.log("Redis connected");
};

export default redis;
