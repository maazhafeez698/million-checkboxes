import { env } from "../../config/env.js";
import {
  getCheckbox,
  toggleCheckbox,
  getCheckedCount,
  getState,
} from "./checkbox.repository.js";

export const getCheckboxState = async (index) => {
  return getCheckbox(index);
};

export const toggle = async (index) => {
  return toggleCheckbox(index);
};

export const getOverview = async () => {
  const checked = await getCheckedCount();

  return {
    checked,
    unchecked: env.checkboxCount - checked,
  };
};

export const getInitialState = async () => {
  const checked = await getCheckedCount();

  return {
    checked,
    unchecked: env.checkboxCount - checked,
  };
};
