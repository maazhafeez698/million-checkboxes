import app from "./app.js";
import { env } from "./config/env.js";
import { connectRedis } from "./infrastructure/redis/redis.client.js";

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(env.port, () => {
      console.log(`OMCB server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
