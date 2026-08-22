import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3000,
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  checkboxCount: 1_000_000,
  checkboxChunkSize: 400,
};
