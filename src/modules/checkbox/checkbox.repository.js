import redis from "../../infrastructure/redis/redis.client.js";
import { env } from "../../config/env.js";

const CHECKBOX_KEY = "omcb:checkboxes";

const toggleScript = `
  local current = redis.call("GETBIT", KEYS[1], ARGV[1])
  local next = 1 - current

  redis.call("SETBIT", KEYS[1], ARGV[1], next)

  return next
`;

const validateIndex = (index) => {
  if (!Number.isInteger(index) || index < 0 || index >= env.checkboxCount) {
    throw new Error("Invalid checkbox index");
  }
};

export const getCheckbox = async (index) => {
  validateIndex(index);

  return redis.getBit(CHECKBOX_KEY, index);
};

export const toggleCheckbox = async (index) => {
  validateIndex(index);

  const result = await redis.eval(toggleScript, {
    keys: [CHECKBOX_KEY],
    arguments: [String(index)],
  });

  return Boolean(result);
};

export const getCheckedCount = async () => {
  return redis.bitCount(CHECKBOX_KEY);
};

export const getState = async () => {
  const state = await redis.get(CHECKBOX_KEY);

  return state ?? "";
};

export const getCheckboxChunk = async (start, size) => {
  const values = [];

  for (let index = start; index < start + size; index++) {
    const checked = await getCheckbox(index);

    values.push(checked);
  }

  return values;
};
