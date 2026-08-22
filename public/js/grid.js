import { state } from "./state.js";

import { toggleCheckbox, setCheckboxUpdateHandler } from "./socket.js";

const grid = document.querySelector("#checkbox-grid");
const container = grid.parentElement;

const COLUMNS = 20;
const CELL_SIZE = 32;
const BUFFER_ROWS = 4;
const CHUNK_SIZE = 400;

let visibleRows = 0;

const getTotalRows = () => {
  return Math.ceil(state.total / COLUMNS);
};

const calculateVisibleRows = () => {
  visibleRows = Math.ceil(container.clientHeight / CELL_SIZE);
};

const getChunkIndex = (index) => {
  return Math.floor(index / CHUNK_SIZE);
};

const getVisibleRange = () => {
  const scrollTop = container.scrollTop;

  const firstRow = Math.max(0, Math.floor(scrollTop / CELL_SIZE) - BUFFER_ROWS);

  const lastRow = Math.min(
    getTotalRows(),
    firstRow + visibleRows + BUFFER_ROWS * 2,
  );

  return {
    firstRow,
    lastRow,
  };
};

const loadChunk = async (chunkIndex) => {
  if (state.loadedChunks.has(chunkIndex)) {
    return;
  }

  const url = `/api/checkboxes/chunk/${chunkIndex}`;

  console.log("LOADING CHUNK:", chunkIndex);
  console.log("FETCH URL:", url);

  try {
    const response = await fetch(url);

    console.log("CHUNK RESPONSE:", chunkIndex, response.status);

    if (!response.ok) {
      throw new Error(`Failed to load chunk ${chunkIndex}`);
    }

    const chunk = await response.json();

    console.log("CHUNK DATA:", chunkIndex, chunk);

    chunk.values.forEach((checked, offset) => {
      state.checkboxes.set(chunk.start + offset, Boolean(checked));
    });
    state.loadedChunks.add(chunkIndex);

    console.log("CHUNK LOADED:", chunkIndex);
  } catch (error) {
    console.error(`Chunk ${chunkIndex} failed:`, error);
  }
};

const loadVisibleChunks = async () => {
  console.log("LOADING VISIBLE CHUNKS");
  const { firstRow, lastRow } = getVisibleRange();

  const firstIndex = firstRow * COLUMNS;

  const lastIndex = Math.min(state.total, lastRow * COLUMNS);

  const firstChunk = getChunkIndex(firstIndex);

  const lastChunk = getChunkIndex(Math.max(0, lastIndex - 1));

  const requests = [];

  for (let chunk = firstChunk; chunk <= lastChunk; chunk++) {
    requests.push(loadChunk(chunk));
  }

  await Promise.all(requests);
};

const renderVisibleRows = () => {
  const { firstRow, lastRow } = getVisibleRange();

  grid.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let row = firstRow; row < lastRow; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const index = row * COLUMNS + column;

      if (index >= state.total) {
        break;
      }

      const checkbox = document.createElement("button");

      checkbox.className = "checkbox";

      checkbox.dataset.index = index;

      checkbox.classList.toggle(
        "checked",
        state.checkboxes.get(index) === true,
      );

      checkbox.addEventListener("click", () => {
        toggleCheckbox(index);
      });

      fragment.appendChild(checkbox);
    }
  }

  grid.appendChild(fragment);

  grid.style.transform = `translateY(${firstRow * CELL_SIZE}px)`;
};

const refreshVisibleArea = async () => {
  await loadVisibleChunks();

  renderVisibleRows();
};

const updateVisibleCheckbox = (index, checked) => {
  const checkbox = grid.querySelector(`[data-index="${index}"]`);

  if (!checkbox) {
    return;
  }

  checkbox.classList.toggle("checked", checked);
};

export const initializeGrid = async () => {
  console.log("GRID INITIALIZED");
  calculateVisibleRows();

  grid.style.height = `${getTotalRows() * CELL_SIZE}px`;

  /*
   * Load the initial visible chunks
   * before rendering the grid.
   */
  await refreshVisibleArea();

  container.addEventListener("scroll", () => {
    refreshVisibleArea();
  });

  window.addEventListener("resize", async () => {
    calculateVisibleRows();

    await refreshVisibleArea();
  });

  setCheckboxUpdateHandler((index, checked) => {
    state.checkboxes.set(index, checked);

    updateVisibleCheckbox(index, checked);
  });
};
