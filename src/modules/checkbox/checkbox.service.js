import { env } from "../../config/env.js";

import {
  getCheckbox,
  toggleCheckbox,
  getCheckedCount,
  getCheckboxChunk,
} from "./checkbox.repository.js";

import { publisher } from "../../infrastructure/redis/redis.client.js";

const CHECKBOX_CHANNEL = "omcb:checkbox:updated";

export const getCheckboxState = async (index) => {
  return getCheckbox(index);
};

export const toggle = async (index) => {
  const checked = await toggleCheckbox(index);

  const checkedCount = await getCheckedCount();

  const event = {
    index,
    checked,
    checkedCount,
  };

  await publisher.publish(CHECKBOX_CHANNEL, JSON.stringify(event));

  return event;
};

export const getOverview = async () => {
  const checked = await getCheckedCount();

  return {
    checked,
    unchecked: env.checkboxCount - checked,
  };
};

export const getChunk = async (chunkIndex) => {
  const start = chunkIndex * env.checkboxChunkSize;

  if (start >= env.checkboxCount) {
    throw new Error("Invalid chunk");
  }

  const remaining = env.checkboxCount - start;

  const size = Math.min(env.checkboxChunkSize, remaining);

  const values = await getCheckboxChunk(start, size);

  return {
    chunkIndex,
    start,
    size,
    values,
  };
};

export const getCheckedIndexes = async () => {
  const indexes = [];

  for (let index = 0; index < env.checkboxCount; index++) {
    const checked = await getCheckbox(index);

    if (checked) {
      indexes.push(index);
    }
  }

  return indexes;
};
