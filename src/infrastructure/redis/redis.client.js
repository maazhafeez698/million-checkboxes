import { createClient } from "redis";
import { env } from "../../config/env.js";

const redis = createClient({
  url: env.redisUrl,
});

const publisher = redis.duplicate();
const subscriber = redis.duplicate();

const handleRedisError = (error) => {
  console.error("Redis error:", error);
};

redis.on("error", handleRedisError);
publisher.on("error", handleRedisError);
subscriber.on("error", handleRedisError);

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }

  if (!publisher.isOpen) {
    await publisher.connect();
  }

  if (!subscriber.isOpen) {
    await subscriber.connect();
  }

  console.log("Redis connected");
};

export { publisher, subscriber };

export default redis;
