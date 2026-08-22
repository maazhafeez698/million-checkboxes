import http from "node:http";

import app from "./app.js";
import { env } from "./config/env.js";
import { connectRedis } from "./infrastructure/redis/redis.client.js";
import {
  initializeSocket,
  initializeSubscriber,
} from "./infrastructure/socket/socket.server.js";

const startServer = async () => {
  try {
    await connectRedis();

    const httpServer = http.createServer(app);

    initializeSocket(httpServer);

    await initializeSubscriber();

    httpServer.listen(env.port, () => {
      console.log(`OMCB server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
