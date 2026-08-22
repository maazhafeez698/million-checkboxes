import { state } from "./state.js";

import { setStatsUpdateHandler } from "./socket.js";

import { initializeGrid } from "./grid.js";

const checkedCount = document.querySelector("#checked-count");

const uncheckedCount = document.querySelector("#unchecked-count");

const userChanges = document.querySelector("#user-changes");

const updateStats = () => {
  checkedCount.textContent = state.checked.toLocaleString();

  uncheckedCount.textContent = (state.total - state.checked).toLocaleString();

  userChanges.textContent = state.userChanges.toLocaleString();
};

const loadStats = async () => {
  const response = await fetch("/api/checkboxes/stats");

  if (!response.ok) {
    throw new Error("Failed to load checkbox stats");
  }

  const data = await response.json();

  state.checked = data.checked;

  updateStats();
};

const initialize = async () => {
  try {
    await loadStats();

    initializeGrid();

    updateStats();
  } catch (error) {
    console.error(error);
  }
};

setStatsUpdateHandler(updateStats);

await initialize();
