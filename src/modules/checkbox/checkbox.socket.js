import { toggle } from "./checkbox.service.js";

export const registerCheckboxSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("checkbox:toggle", async (index, callback) => {
      try {
        const checked = await toggle(Number(index));

        callback?.({
          success: true,
          index: Number(index),
          checked,
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
