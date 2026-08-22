import { getCheckboxState, toggle, getOverview } from "./checkbox.service.js";

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
