const service = require('./checkbox.service');

async function getCheckbox(req, res) {
  const checkbox = await service.getCheckbox(req.params.id);

  if (!checkbox) {
    return res.status(404).json({ error: 'Checkbox not found' });
  }

  return res.json(checkbox);
}

async function createCheckbox(req, res) {
  const checkbox = await service.createCheckbox(req.body?.checked);
  return res.status(201).json(checkbox);
}

async function updateCheckbox(req, res) {
  const checkbox = await service.setCheckboxState(req.params.id, req.body?.checked);

  if (!checkbox) {
    return res.status(404).json({ error: 'Checkbox not found' });
  }

  return res.json(checkbox);
}

module.exports = { getCheckbox, createCheckbox, updateCheckbox };
