const { redisClient } = require('../../infrastructure/redis/redis.client');

const checkboxKey = (id) => `checkbox:${id}`;
const inMemoryCheckboxes = new Map();

async function findById(id) {
  if (redisClient.isReady) {
    const value = await redisClient.get(checkboxKey(id));
    return value ? JSON.parse(value) : null;
  }

  return inMemoryCheckboxes.get(id) || null;
}

async function save(checkbox) {
  if (redisClient.isReady) {
    await redisClient.set(checkboxKey(checkbox.id), JSON.stringify(checkbox));
  } else {
    inMemoryCheckboxes.set(checkbox.id, checkbox);
  }

  return checkbox;
}

module.exports = { findById, save };
