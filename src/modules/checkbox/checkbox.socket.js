import { toggle } from "./checkbox.service.js";

const RATE_LIMIT_MS = 500;

const lastAction = new Map();

export const registerCheckboxSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("checkbox:toggle", async (index, callback) => {
      const now = Date.now();
      const last = lastAction.get(socket.id) || 0;

      if (now - last < RATE_LIMIT_MS) {
        return callback({
          success: false,
          message: "Please wait before clicking again.",
        });
      }

      lastAction.set(socket.id, now);

      try {
        const result = await toggle(Number(index));

        callback({
          success: true,
          ...result,
        });
      } catch (error) {
        callback({
          success: false,
          message: error.message || "Unable to update checkbox.",
        });
      }
    });

    socket.on("disconnect", () => {
      lastAction.delete(socket.id);
    });
  });
};
