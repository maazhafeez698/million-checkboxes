import { env } from "../../config/env.js";
import {
  getCheckbox,
  toggleCheckbox,
  getCheckedCount,
} from "./checkbox.repository.js";
import { publisher } from "../../infrastructure/redis/redis.client.js";

const CHECKBOX_CHANNEL = "omcb:checkbox:updated";

export const getCheckboxState = async (index) => {
  return getCheckbox(index);
};

export const toggle = async (index) => {
  const checked = await toggleCheckbox(index);

  const event = {
    index,
    checked,
  };

  await publisher.publish(CHECKBOX_CHANNEL, JSON.stringify(event));

  return checked;
};

export const getOverview = async () => {
  const checked = await getCheckedCount();

  return {
    checked,
    unchecked: env.checkboxCount - checked,
  };
};
