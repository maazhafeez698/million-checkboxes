import { state } from "./state.js";

const socket = io();

const status = document.querySelector("#connection-status");

const toast = document.querySelector("#toast");

let onCheckboxUpdate = null;
let onStatsUpdate = null;

const showToast = (message) => {
  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1200);
};

socket.on("connect", () => {
  status.textContent = "● Live";
  status.classList.add("connected");
});

socket.on("disconnect", () => {
  status.textContent = "● Offline";
  status.classList.remove("connected");
});

socket.on("checkbox:updated", ({ index, checked, checkedCount }) => {
  state.checkboxes.set(index, checked);

  state.checked = checkedCount;

  if (onCheckboxUpdate) {
    onCheckboxUpdate(index, checked);
  }

  if (onStatsUpdate) {
    onStatsUpdate();
  }
});

export const setCheckboxUpdateHandler = (handler) => {
  onCheckboxUpdate = handler;
};

export const setStatsUpdateHandler = (handler) => {
  onStatsUpdate = handler;
};

export const toggleCheckbox = (index) => {
  socket.emit("checkbox:toggle", index, (response) => {
    if (!response?.success) {
      showToast(response?.message || "Something went wrong");

      return;
    }

    state.userChanges++;

    if (onStatsUpdate) {
      onStatsUpdate();
    }
  });
};
