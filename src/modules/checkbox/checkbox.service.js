const crypto = require('node:crypto');
const repository = require('./checkbox.repository');

async function getCheckbox(id) {
  return repository.findById(id);
}

async function createCheckbox(checked = false) {
  return repository.save({
    id: crypto.randomUUID(),
    checked: Boolean(checked),
    createdAt: new Date().toISOString()
  });
}

async function setCheckboxState(id, checked) {
  const checkbox = await repository.findById(id);

  if (!checkbox) {
    return null;
  }

  return repository.save({ ...checkbox, checked: Boolean(checked) });
}

module.exports = { getCheckbox, createCheckbox, setCheckboxState };
