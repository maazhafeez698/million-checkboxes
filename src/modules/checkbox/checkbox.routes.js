const express = require('express');
const controller = require('./checkbox.controller');

const router = express.Router();

router.post('/', controller.createCheckbox);
router.get('/:id', controller.getCheckbox);
router.patch('/:id', controller.updateCheckbox);

module.exports = router;
