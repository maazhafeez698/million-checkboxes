import { state } from "./state.js";

import { toggleCheckbox, setCheckboxUpdateHandler } from "./socket.js";

const grid = document.querySelector("#checkbox-grid");
const container = grid.parentElement;

const COLUMNS = 20;
const CELL_SIZE = 32;
const BUFFER_ROWS = 4;

let visibleRows = 0;
let initialized = false;
let bottomShown = false;

/*
|--------------------------------------------------------------------------
| Grid calculations
|--------------------------------------------------------------------------
*/

const getTotalRows = () => {
  return Math.ceil(state.total / COLUMNS);
};

const calculateVisibleRows = () => {
  visibleRows = Math.ceil(container.clientHeight / CELL_SIZE);
};

/*
|--------------------------------------------------------------------------
| Chunk handling
|--------------------------------------------------------------------------
*/

const getChunkIndex = (index) => {
  return Math.floor(index / state.chunkSize);
};

const loadChunk = async (chunkIndex) => {
  if (state.loadedChunks.has(chunkIndex)) {
    return;
  }

  state.loadedChunks.add(chunkIndex);

  try {
    const response = await fetch(`/api/checkboxes/chunk/${chunkIndex}`);

    if (!response.ok) {
      throw new Error(`Failed to load chunk ${chunkIndex}`);
    }

    const chunk = await response.json();

    chunk.values.forEach((checked, offset) => {
      state.checkboxes.set(chunk.start + offset, checked === 1);
    });

    renderVisibleRows();
  } catch (error) {
    state.loadedChunks.delete(chunkIndex);

    console.error(error);
  }
};

const loadVisibleChunks = (firstRow, lastRow) => {
  const firstIndex = firstRow * COLUMNS;

  const lastIndex = Math.min(state.total - 1, lastRow * COLUMNS - 1);

  const firstChunk = getChunkIndex(firstIndex);

  const lastChunk = getChunkIndex(lastIndex);

  for (let chunk = firstChunk; chunk <= lastChunk; chunk++) {
    loadChunk(chunk);
  }
};

/*
|--------------------------------------------------------------------------
| Render
|--------------------------------------------------------------------------
*/

const renderVisibleRows = () => {
  if (!initialized) {
    return;
  }

  const scrollTop = container.scrollTop;

  const firstRow = Math.max(0, Math.floor(scrollTop / CELL_SIZE) - BUFFER_ROWS);

  const lastRow = Math.min(
    getTotalRows(),
    firstRow + visibleRows + BUFFER_ROWS * 2,
  );

  /*
   * This is the important part.
   *
   * The grid represents the COMPLETE
   * 1,000,000-checkbox space.
   */
  grid.style.height = `${getTotalRows() * CELL_SIZE}px`;

  /*
   * Load only the chunks needed around
   * the current viewport.
   */
  loadVisibleChunks(firstRow, lastRow);

  /*
   * Remove only the currently rendered
   * virtual elements.
   */
  grid.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let row = firstRow; row < lastRow; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const index = row * COLUMNS + column;

      if (index >= state.total) {
        break;
      }

      const checkbox = document.createElement("button");

      checkbox.type = "button";

      checkbox.className = "checkbox";

      checkbox.dataset.index = index;

      checkbox.style.position = "absolute";

      checkbox.style.top = `${row * CELL_SIZE}px`;

      checkbox.style.left = `${((column + 0.5) / COLUMNS) * 100}%`;

      checkbox.style.transform = "translateX(-50%)";

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

  /*
   * Bottom detection.
   */
  const atBottom =
    container.scrollTop + container.clientHeight >= container.scrollHeight - 2;

  if (atBottom) {
    showBottomToast();
  } else {
    bottomShown = false;
  }
};

/*
|--------------------------------------------------------------------------
| Bottom message
|--------------------------------------------------------------------------
*/

const showBottomToast = () => {
  if (bottomShown) {
    return;
  }

  bottomShown = true;

  const toast = document.querySelector("#toast");

  if (!toast) {
    return;
  }

  toast.textContent = "You have reached the bottom";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1400);
};

/*
|--------------------------------------------------------------------------
| Socket update
|--------------------------------------------------------------------------
*/

const updateVisibleCheckbox = (index, checked) => {
  const checkbox = grid.querySelector(`[data-index="${index}"]`);

  if (!checkbox) {
    return;
  }

  checkbox.classList.toggle("checked", checked);
};

/*
|--------------------------------------------------------------------------
| Scroll
|--------------------------------------------------------------------------
*/

const handleScroll = () => {
  renderVisibleRows();
};

/*
|--------------------------------------------------------------------------
| Resize
|--------------------------------------------------------------------------
*/

const handleResize = () => {
  calculateVisibleRows();

  renderVisibleRows();
};

/*
|--------------------------------------------------------------------------
| Initialize
|--------------------------------------------------------------------------
*/

export const initializeGrid = () => {
  if (initialized) {
    return;
  }

  initialized = true;

  calculateVisibleRows();

  /*
   * Full million-checkbox virtual height.
   *
   * 1,000,000 / 20 = 50,000 rows
   * 50,000 × 32px = 1,600,000px
   */
  grid.style.height = `${getTotalRows() * CELL_SIZE}px`;

  renderVisibleRows();

  container.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", handleResize);

  setCheckboxUpdateHandler((index, checked) => {
    state.checkboxes.set(index, checked);

    updateVisibleCheckbox(index, checked);
  });
};
