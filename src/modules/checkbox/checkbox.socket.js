import { toggle } from "./checkbox.service.js";

export const registerCheckboxSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("checkbox:toggle", async (index, callback) => {
      try {
        const event = await toggle(Number(index));

        callback?.({
          success: true,
          ...event,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });
  });
};
