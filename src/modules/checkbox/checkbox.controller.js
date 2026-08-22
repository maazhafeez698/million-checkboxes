import {
  getCheckboxState,
  toggle,
  getOverview,
  getChunk,
  getCheckedIndexes
} from "./checkbox.service.js";

export const getStats = async (req, res, next) => {
  try {
    const stats = await getOverview();

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getSingleCheckbox = async (req, res, next) => {
  try {
    const index = Number(req.params.index);

    const checked = await getCheckboxState(index);

    res.json({
      index,
      checked,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCheckbox = async (req, res, next) => {
  try {
    const index = Number(req.params.index);

    const checked = await toggle(index);

    res.json({
      index,
      checked,
    });
  } catch (error) {
    next(error);
  }
};

export const getCheckboxChunk = async (req, res, next) => {
  try {
    const chunkIndex = Number(req.params.chunkIndex);

    if (!Number.isInteger(chunkIndex) || chunkIndex < 0) {
      return res.status(400).json({
        message: "Invalid chunk index",
      });
    }

    const chunk = await getChunk(chunkIndex);

    res.json(chunk);
  } catch (error) {
    next(error);
  }
};

export const getCheckedIndexesController = async (req, res, next) => {
  try {
    const indexes = await getCheckedIndexes();

    res.json({
      indexes,
    });
  } catch (error) {
    next(error);
  }
};
