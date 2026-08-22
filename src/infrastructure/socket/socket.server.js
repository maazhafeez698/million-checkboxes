import { Server } from "socket.io";
import { subscriber } from "../redis/redis.client.js";
import { registerCheckboxSocket } from "../../modules/checkbox/checkbox.socket.js";

const CHECKBOX_CHANNEL = "omcb:checkbox:updated";

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  registerCheckboxSocket(io);

  return io;
};

export const initializeSubscriber = async () => {
  await subscriber.subscribe(CHECKBOX_CHANNEL, (message) => {
    const event = JSON.parse(message);

    io.emit("checkbox:updated", event);
  });

  console.log(`Subscribed to ${CHECKBOX_CHANNEL}`);
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
